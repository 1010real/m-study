import { describe, expect, it } from 'vitest'
import { computeFu } from '../../src/domain/scoring/fu.ts'
import { makeQuestion } from './helpers.ts'

describe('computeFu', () => {
  it('raw 22 は 30 に切り上げる', () => {
    const q = makeQuestion({
      fuComponents: [
        { type: 'base', label: '副底', value: 20 },
        { type: 'waitKanchan', label: '嵌張待ち', value: 2 },
      ],
    })
    const fu = computeFu(q)
    expect(fu.raw).toBe(22)
    expect(fu.rounded).toBe(30)
  })

  it('raw 20（閉じた手）はそのまま20', () => {
    const q = makeQuestion({
      context: {
        seat: 'nonDealer',
        winType: 'ron',
        isClosed: true,
        riichi: false,
        doubleRiichi: false,
        ippatsu: false,
        seatWind: 'E',
        roundWind: 'E',
        haitei: false,
        houtei: false,
        rinshan: false,
        chankan: false,
      },
      fuComponents: [{ type: 'base', label: '副底', value: 20 }],
    })
    expect(computeFu(q).rounded).toBe(20)
  })

  it('食い平和: 開いた手で20符になる場合は30符に補正する', () => {
    const q = makeQuestion({
      context: {
        seat: 'nonDealer',
        winType: 'ron',
        isClosed: false,
        riichi: false,
        doubleRiichi: false,
        ippatsu: false,
        seatWind: 'E',
        roundWind: 'E',
        haitei: false,
        houtei: false,
        rinshan: false,
        chankan: false,
      },
      fuComponents: [{ type: 'base', label: '副底', value: 20 }],
    })
    expect(computeFu(q).rounded).toBe(30)
  })

  it('raw 30 はそのまま（端数なし）', () => {
    const q = makeQuestion({
      fuComponents: [
        { type: 'base', label: '副底', value: 20 },
        { type: 'menzenRon', label: '門前加符', value: 10 },
      ],
    })
    expect(computeFu(q).rounded).toBe(30)
  })

  it('七対子は fuComponents に関わらず常に25符固定', () => {
    const q = makeQuestion({
      yaku: [{ id: 'chiitoitsu', han: 2 }],
      fuComponents: [{ type: 'base', label: '副底', value: 20 }],
    })
    const fu = computeFu(q)
    expect(fu.raw).toBe(25)
    expect(fu.rounded).toBe(25)
  })

  it('平和+ツモは fuComponents に関わらず常に20符固定', () => {
    const q = makeQuestion({
      context: {
        seat: 'nonDealer',
        winType: 'tsumo',
        isClosed: true,
        riichi: false,
        doubleRiichi: false,
        ippatsu: false,
        seatWind: 'E',
        roundWind: 'E',
        haitei: false,
        houtei: false,
        rinshan: false,
        chankan: false,
      },
      yaku: [{ id: 'pinfu', han: 1 }],
      fuComponents: [
        { type: 'base', label: '副底', value: 20 },
        { type: 'tsumo', label: '自摸符', value: 2 },
      ],
    })
    expect(computeFu(q).rounded).toBe(20)
  })

  it('平和+ロンは20符+門前加符10符=30符', () => {
    const q = makeQuestion({
      yaku: [{ id: 'pinfu', han: 1 }],
      fuComponents: [
        { type: 'base', label: '副底', value: 20 },
        { type: 'menzenRon', label: '門前加符', value: 10 },
      ],
    })
    expect(computeFu(q).rounded).toBe(30)
  })

  it.each([
    ['triplet_open_simple', 2],
    ['triplet_open_terminal', 4],
    ['triplet_closed_simple', 4],
    ['triplet_closed_terminal', 8],
    ['kan_open_simple', 8],
    ['kan_open_terminal', 16],
    ['kan_closed_simple', 16],
    ['kan_closed_terminal', 32],
  ] as const)('%s の符は%i', (type, value) => {
    const q = makeQuestion({
      fuComponents: [{ type, label: type, value }],
    })
    expect(computeFu(q).raw).toBe(value)
  })
})
