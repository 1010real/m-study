import { describe, expect, it } from 'vitest'
import { sumHan } from '../../src/domain/scoring/han.ts'

describe('sumHan', () => {
  it('役の翻数とドラを合算する', () => {
    const total = sumHan(
      [
        { id: 'riichi', han: 1 },
        { id: 'pinfu', han: 1 },
        { id: 'tanyao', han: 1 },
      ],
      [{ kind: 'dora', count: 1 }],
    )
    expect(total).toBe(4)
  })

  it('複数種のドラを合算する', () => {
    const total = sumHan(
      [{ id: 'riichi', han: 1 }],
      [
        { kind: 'dora', count: 2 },
        { kind: 'uradora', count: 1 },
        { kind: 'akadora', count: 1 },
      ],
    )
    expect(total).toBe(5)
  })

  it('役がなくてもドラだけ合算する', () => {
    expect(sumHan([], [{ kind: 'dora', count: 2 }])).toBe(2)
  })
})
