import { describe, expect, it } from 'vitest'
import { buildBreakdown } from '../../src/domain/scoring/breakdown.ts'
import { generateChoices } from '../../src/domain/distractors.ts'
import { doraFromIndicator } from '../../src/domain/tiles.ts'
import type { Question } from '../../src/domain/types.ts'
import { questions } from '../../src/data/questions/index.ts'

function countMatches(question: Question, indicator: string): number {
  const meldTiles = question.melds?.flatMap((m) => m.tiles) ?? []
  const allTiles = [...question.hand, question.winningTile, ...meldTiles]
  const doraTile = doraFromIndicator(indicator)
  return allTiles.filter((t) => t === doraTile).length
}

describe('questions data', () => {
  it('IDが重複しない', () => {
    const ids = questions.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(questions.map((q) => [q.id, q] as const))('%s: 役が1つ以上あり、内訳計算がエラーにならない', (_id, question) => {
    expect(question.yaku.length).toBeGreaterThan(0)
    const breakdown = buildBreakdown(question)
    expect(breakdown.points.total).toBeGreaterThan(0)
  })

  it.each(questions.map((q) => [q.id, q] as const))('%s: 4択の選択肢が正しく生成される', (_id, question) => {
    const choices = generateChoices(question)
    expect(choices).toHaveLength(4)
    expect(choices.filter((c) => c.isCorrect)).toHaveLength(1)
    const totals = choices.map((c) => c.points.total)
    expect(new Set(totals).size).toBe(4)
  })

  it.each(questions.map((q) => [q.id, q] as const))('%s: ドラ表示牌が実際のドラ枚数と整合する', (_id, question) => {
    const declaredDora = question.dora.filter((d) => d.kind === 'dora').reduce((sum, d) => sum + d.count, 0)
    const indicatedDora = (question.doraIndicators ?? []).reduce((sum, ind) => sum + countMatches(question, ind), 0)
    expect(indicatedDora).toBe(declaredDora)

    const declaredUradora = question.dora.filter((d) => d.kind === 'uradora').reduce((sum, d) => sum + d.count, 0)
    const indicatedUradora = (question.uraDoraIndicators ?? []).reduce((sum, ind) => sum + countMatches(question, ind), 0)
    expect(indicatedUradora).toBe(declaredUradora)

    if (declaredUradora > 0) {
      expect(question.context.riichi || question.context.doubleRiichi).toBe(true)
    }
  })
})
