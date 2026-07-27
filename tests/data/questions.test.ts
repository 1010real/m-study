import { describe, expect, it } from 'vitest'
import { buildBreakdown } from '../../src/domain/scoring/breakdown.ts'
import { generateChoices } from '../../src/domain/distractors.ts'
import { questions } from '../../src/data/questions/index.ts'

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
})
