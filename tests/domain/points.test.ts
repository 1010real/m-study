import { describe, expect, it } from 'vitest'
import { lookupPoints } from '../../src/domain/scoring/points.ts'

describe('lookupPoints - 通常帯（1〜4翻）', () => {
  it('1翻30符 子ロン = 1000', () => {
    expect(lookupPoints(1, 30, 'nonDealer', 'ron').total).toBe(1000)
  })

  it('2翻30符 子ロン = 2000', () => {
    expect(lookupPoints(2, 30, 'nonDealer', 'ron').total).toBe(2000)
  })

  it('3翻30符 子ロン = 3900', () => {
    expect(lookupPoints(3, 30, 'nonDealer', 'ron').total).toBe(3900)
  })

  it('4翻30符 子ロン = 7700（満貫に繰り上げない）', () => {
    const result = lookupPoints(4, 30, 'nonDealer', 'ron')
    expect(result.total).toBe(7700)
    expect(result.scoreName).toBeUndefined()
  })

  it('3翻60符 子ロン = 7700（満貫未満）', () => {
    const result = lookupPoints(3, 60, 'nonDealer', 'ron')
    expect(result.total).toBe(7700)
    expect(result.scoreName).toBeUndefined()
  })

  it('3翻70符 子ロン = 8000（満貫クランプ）', () => {
    const result = lookupPoints(3, 70, 'nonDealer', 'ron')
    expect(result.total).toBe(8000)
    expect(result.scoreName).toBe('mangan')
  })

  it('4翻40符 子ロン = 8000（満貫クランプ）', () => {
    const result = lookupPoints(4, 40, 'nonDealer', 'ron')
    expect(result.total).toBe(8000)
    expect(result.scoreName).toBe('mangan')
  })

  it('3翻30符 親ロン = 5800', () => {
    expect(lookupPoints(3, 30, 'dealer', 'ron').total).toBe(5800)
  })

  it('2翻30符 子ツモ = 500/1000', () => {
    const result = lookupPoints(2, 30, 'nonDealer', 'tsumo')
    expect(result.payments).toEqual({ tsumoDealer: 1000, tsumoNonDealer: 500 })
    expect(result.total).toBe(2000)
  })

  it('1翻30符 親ツモ = 500オール', () => {
    const result = lookupPoints(1, 30, 'dealer', 'tsumo')
    expect(result.payments).toEqual({ tsumoEach: 500 })
    expect(result.total).toBe(1500)
  })
})

describe('lookupPoints - 満貫以上', () => {
  it('満貫 子ロン = 8000', () => {
    expect(lookupPoints(5, 30, 'nonDealer', 'ron').total).toBe(8000)
  })

  it('満貫 子ツモ = 2000/4000', () => {
    const result = lookupPoints(5, 30, 'nonDealer', 'tsumo')
    expect(result.payments).toEqual({ tsumoDealer: 4000, tsumoNonDealer: 2000 })
    expect(result.total).toBe(8000)
  })

  it('満貫 親ロン = 12000', () => {
    expect(lookupPoints(5, 30, 'dealer', 'ron').total).toBe(12000)
  })

  it('満貫 親ツモ = 4000オール', () => {
    const result = lookupPoints(5, 30, 'dealer', 'tsumo')
    expect(result.payments).toEqual({ tsumoEach: 4000 })
    expect(result.total).toBe(12000)
  })

  it('跳満 子ロン = 12000', () => {
    expect(lookupPoints(6, 30, 'nonDealer', 'ron').total).toBe(12000)
  })

  it('跳満 親ツモ = 6000オール', () => {
    const result = lookupPoints(6, 30, 'dealer', 'tsumo')
    expect(result.payments).toEqual({ tsumoEach: 6000 })
  })

  it('倍満 子ロン = 16000', () => {
    expect(lookupPoints(8, 30, 'nonDealer', 'ron').total).toBe(16000)
  })

  it('三倍満 親ロン = 36000', () => {
    expect(lookupPoints(11, 30, 'dealer', 'ron').total).toBe(36000)
  })

  it('役満 子ロン = 32000', () => {
    expect(lookupPoints(13, 30, 'nonDealer', 'ron').total).toBe(32000)
  })
})
