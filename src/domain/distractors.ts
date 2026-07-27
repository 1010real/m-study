import type { PointsResult, Question, QuizChoice, Seat, WinType } from './types.ts'
import { buildBreakdown } from './scoring/breakdown.ts'
import { computeFu } from './scoring/fu.ts'
import { sumHan } from './scoring/han.ts'
import { lookupPoints } from './scoring/points.ts'

function formatLabel(points: PointsResult): string {
  return `${points.total}点`
}

function flipSeat(seat: Seat): Seat {
  return seat === 'dealer' ? 'nonDealer' : 'dealer'
}

function flipWinType(winType: WinType): WinType {
  return winType === 'ron' ? 'tsumo' : 'ron'
}

/** 一番翻数の低い役（役牌・ドラ優先）を1つ落とした場合の点数 */
function missingYakuCandidate(question: Question): PointsResult | undefined {
  if (question.yaku.length === 0) return undefined
  const lowest = [...question.yaku].sort((a, b) => a.han - b.han)[0]
  const remainingYaku = question.yaku.filter((y) => y !== lowest)
  if (remainingYaku.length === 0) return undefined
  const han = sumHan(remainingYaku, question.dora)
  const fu = computeFu({ ...question, yaku: remainingYaku })
  return lookupPoints(han, fu.rounded, question.context.seat, question.context.winType)
}

/** 符の切り上げを誤った場合（切り上げ忘れ／余計な切り上げ）の点数 */
function fuRoundingErrorCandidate(question: Question, correctFu: number, correctRaw: number): PointsResult | undefined {
  const han = sumHan(question.yaku, question.dora)
  let wrongFu: number
  if (correctFu === correctRaw) {
    wrongFu = correctFu + 10
  } else {
    wrongFu = correctFu - 10
  }
  if (wrongFu <= 0) return undefined
  return lookupPoints(han, wrongFu, question.context.seat, question.context.winType)
}

function seatSwapCandidate(question: Question, fu: number): PointsResult {
  const han = sumHan(question.yaku, question.dora)
  return lookupPoints(han, fu, flipSeat(question.context.seat), question.context.winType)
}

function winTypeSwapCandidate(question: Question, fu: number): PointsResult {
  const han = sumHan(question.yaku, question.dora)
  return lookupPoints(han, fu, question.context.seat, flipWinType(question.context.winType))
}

function hanOffsetCandidates(question: Question, fu: number): PointsResult[] {
  const han = sumHan(question.yaku, question.dora)
  const results: PointsResult[] = []
  for (const offset of [-1, 1, -2, 2]) {
    if (han + offset >= 1) {
      results.push(lookupPoints(han + offset, fu, question.context.seat, question.context.winType))
    }
  }
  return results
}

function fuOffsetCandidates(question: Question, fu: number): PointsResult[] {
  const han = sumHan(question.yaku, question.dora)
  const results: PointsResult[] = []
  for (const offset of [20, -20, 10, -10]) {
    if (fu + offset >= 20) {
      results.push(lookupPoints(han, fu + offset, question.context.seat, question.context.winType))
    }
  }
  return results
}

/** 満貫〜役満の代表的な翻数（符は無関係）を候補として並べる。高翻数の問題で
 * 近傍の翻数がすべて同じ点数帯に収まり候補が不足するケースの保険。 */
function tierCandidates(question: Question): PointsResult[] {
  const representativeHan = [5, 6, 8, 11, 13]
  return representativeHan.map((han) => lookupPoints(han, 30, question.context.seat, question.context.winType))
}

/** question.id から決定的な擬似乱数を作る mulberry32 */
function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  let a = h >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function generateChoices(question: Question): QuizChoice[] {
  const correct = buildBreakdown(question)
  const correctTotal = correct.points.total

  const seen = new Set<number>([correctTotal])
  const distractors: PointsResult[] = []

  const addCandidate = (candidate: PointsResult | undefined) => {
    if (!candidate) return
    if (candidate.total <= 0) return
    if (seen.has(candidate.total)) return
    seen.add(candidate.total)
    distractors.push(candidate)
  }

  if (question.manualDistractors) {
    for (const manual of question.manualDistractors) {
      addCandidate(manual)
    }
  } else {
    addCandidate(missingYakuCandidate(question))
    addCandidate(fuRoundingErrorCandidate(question, correct.fu.rounded, correct.fu.raw))
    addCandidate(seatSwapCandidate(question, correct.fu.rounded))
    addCandidate(winTypeSwapCandidate(question, correct.fu.rounded))
    for (const candidate of hanOffsetCandidates(question, correct.fu.rounded)) {
      addCandidate(candidate)
    }
    for (const candidate of fuOffsetCandidates(question, correct.fu.rounded)) {
      addCandidate(candidate)
    }
    for (const candidate of tierCandidates(question)) {
      addCandidate(candidate)
    }
  }

  const finalDistractors = distractors.slice(0, 3)

  const choices: QuizChoice[] = [
    { id: `${question.id}-correct`, label: formatLabel(correct.points), points: correct.points, isCorrect: true },
    ...finalDistractors.map((points, index) => ({
      id: `${question.id}-distractor-${index}`,
      label: formatLabel(points),
      points,
      isCorrect: false,
    })),
  ]

  const random = seededRandom(question.id)
  return shuffle(choices, random)
}
