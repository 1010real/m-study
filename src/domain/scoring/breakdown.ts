import type { Breakdown, Question } from '../types.ts'
import { computeFu } from './fu.ts'
import { sumHan } from './han.ts'
import { lookupPoints } from './points.ts'

export function buildBreakdown(question: Question): Breakdown {
  const han = sumHan(question.yaku, question.dora)
  const fu = computeFu(question)
  const points = lookupPoints(han, fu.rounded, question.context.seat, question.context.winType)

  return {
    question,
    yaku: question.yaku,
    dora: question.dora,
    han,
    fu,
    points,
  }
}
