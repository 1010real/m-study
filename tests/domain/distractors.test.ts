import { describe, expect, it } from 'vitest'
import { generateChoices } from '../../src/domain/distractors.ts'
import { makeQuestion } from './helpers.ts'

const richQuestion = makeQuestion({
  id: 'q-rich',
  yaku: [
    { id: 'riichi', han: 1 },
    { id: 'pinfu', han: 1 },
    { id: 'tanyao', han: 1 },
  ],
  dora: [{ kind: 'dora', count: 1 }],
  fuComponents: [
    { type: 'base', label: '副底', value: 20 },
    { type: 'menzenRon', label: '門前加符', value: 10 },
  ],
})

const sparseQuestion = makeQuestion({
  id: 'q-sparse',
  yaku: [{ id: 'riichi', han: 1 }],
  fuComponents: [{ type: 'base', label: '副底', value: 20 }],
})

describe('generateChoices', () => {
  it('4択・正解1つ・点数が重複しない', () => {
    const choices = generateChoices(richQuestion)
    expect(choices).toHaveLength(4)
    expect(choices.filter((c) => c.isCorrect)).toHaveLength(1)
    const totals = choices.map((c) => c.points.total)
    expect(new Set(totals).size).toBe(4)
  })

  it('役が少ない問題でも4択そろう', () => {
    const choices = generateChoices(sparseQuestion)
    expect(choices).toHaveLength(4)
    expect(choices.filter((c) => c.isCorrect)).toHaveLength(1)
  })

  it('同じ question.id なら並び順が決定的', () => {
    const first = generateChoices(richQuestion).map((c) => c.id)
    const second = generateChoices(richQuestion).map((c) => c.id)
    expect(first).toEqual(second)
  })

  it('manualDistractors がある場合はそちらを使う', () => {
    const q = makeQuestion({
      id: 'q-manual',
      yaku: [{ id: 'riichi', han: 1 }],
      fuComponents: [{ type: 'base', label: '副底', value: 20 }],
      manualDistractors: [
        { han: 13, fu: 30, scoreName: 'yakuman', total: 32000, payments: { ron: 32000 } },
        { han: 11, fu: 30, scoreName: 'sanbaiman', total: 24000, payments: { ron: 24000 } },
        { han: 8, fu: 30, scoreName: 'baiman', total: 16000, payments: { ron: 16000 } },
      ],
    })
    const choices = generateChoices(q)
    expect(choices).toHaveLength(4)
    const totals = choices.map((c) => c.points.total).sort((a, b) => a - b)
    expect(totals).not.toContain(NaN)
  })
})
