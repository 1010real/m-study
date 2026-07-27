import type { AppliedYaku, DoraEntry } from '../types.ts'

export function sumHan(yaku: AppliedYaku[], dora: DoraEntry[]): number {
  const yakuHan = yaku.reduce((total, y) => total + y.han, 0)
  const doraHan = dora.reduce((total, d) => total + d.count, 0)
  return yakuHan + doraHan
}
