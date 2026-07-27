import type { PointsResult, ScoreName, Seat, WinType } from '../types.ts'

/** 満貫繰り上げ（4翻30符・3翻60符等を満貫として扱う）は採用しない */
const KIRIAGE_MANGAN = false

interface FixedTotals {
  nonDealerRon: number
  nonDealerTsumoDealer: number
  nonDealerTsumoNonDealer: number
  dealerRon: number
  dealerTsumoEach: number
}

const FIXED_TOTALS: Record<ScoreName, FixedTotals> = {
  mangan: { nonDealerRon: 8000, nonDealerTsumoDealer: 4000, nonDealerTsumoNonDealer: 2000, dealerRon: 12000, dealerTsumoEach: 4000 },
  haneman: { nonDealerRon: 12000, nonDealerTsumoDealer: 6000, nonDealerTsumoNonDealer: 3000, dealerRon: 18000, dealerTsumoEach: 6000 },
  baiman: { nonDealerRon: 16000, nonDealerTsumoDealer: 8000, nonDealerTsumoNonDealer: 4000, dealerRon: 24000, dealerTsumoEach: 8000 },
  sanbaiman: { nonDealerRon: 24000, nonDealerTsumoDealer: 12000, nonDealerTsumoNonDealer: 6000, dealerRon: 36000, dealerTsumoEach: 12000 },
  yakuman: { nonDealerRon: 32000, nonDealerTsumoDealer: 16000, nonDealerTsumoNonDealer: 8000, dealerRon: 48000, dealerTsumoEach: 16000 },
}

function roundUpToHundred(value: number): number {
  return Math.ceil(value / 100) * 100
}

function classify(han: number, fu: number): ScoreName | undefined {
  if (han >= 13) return 'yakuman'
  if (han >= 11) return 'sanbaiman'
  if (han >= 8) return 'baiman'
  if (han >= 6) return 'haneman'
  if (han === 5) return 'mangan'

  const base = Math.min(fu * 2 ** (2 + han), 2000)
  if (base >= 2000) return 'mangan'
  if (KIRIAGE_MANGAN && han === 4 && fu === 30) return 'mangan'
  if (KIRIAGE_MANGAN && han === 3 && fu === 60) return 'mangan'
  return undefined
}

export function lookupPoints(han: number, fu: number, seat: Seat, winType: WinType): PointsResult {
  const scoreName = classify(han, fu)

  if (scoreName) {
    const fixed = FIXED_TOTALS[scoreName]
    if (seat === 'nonDealer') {
      if (winType === 'ron') {
        return { han, fu, scoreName, total: fixed.nonDealerRon, payments: { ron: fixed.nonDealerRon } }
      }
      const total = fixed.nonDealerTsumoDealer + fixed.nonDealerTsumoNonDealer * 2
      return {
        han,
        fu,
        scoreName,
        total,
        payments: { tsumoDealer: fixed.nonDealerTsumoDealer, tsumoNonDealer: fixed.nonDealerTsumoNonDealer },
      }
    }
    if (winType === 'ron') {
      return { han, fu, scoreName, total: fixed.dealerRon, payments: { ron: fixed.dealerRon } }
    }
    return { han, fu, scoreName, total: fixed.dealerTsumoEach * 3, payments: { tsumoEach: fixed.dealerTsumoEach } }
  }

  const base = fu * 2 ** (2 + han)

  if (seat === 'nonDealer') {
    if (winType === 'ron') {
      const total = roundUpToHundred(base * 4)
      return { han, fu, total, payments: { ron: total } }
    }
    const dealerPay = roundUpToHundred(base * 2)
    const eachPay = roundUpToHundred(base)
    return { han, fu, total: dealerPay + eachPay * 2, payments: { tsumoDealer: dealerPay, tsumoNonDealer: eachPay } }
  }

  if (winType === 'ron') {
    const total = roundUpToHundred(base * 6)
    return { han, fu, total, payments: { ron: total } }
  }
  const eachPay = roundUpToHundred(base * 2)
  return { han, fu, total: eachPay * 3, payments: { tsumoEach: eachPay } }
}
