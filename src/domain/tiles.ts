import type { TileNotation } from './types.ts'

const HONOR_LABEL = ['東', '南', '西', '北', '白', '發', '中']
const SUIT_KANJI = { m: '萬', p: '筒', s: '索' } as const

export interface ParsedTile {
  notation: TileNotation
  rank: number
  suit: 'm' | 'p' | 's' | 'z'
  label: string
}

export function parseTile(notation: TileNotation): ParsedTile {
  const match = /^([1-9])([mpsz])$/.exec(notation)
  if (!match) {
    throw new Error(`不正な牌表記: ${notation}`)
  }
  const rank = Number(match[1])
  const suit = match[2] as 'm' | 'p' | 's' | 'z'
  const index = rank - 1

  if (suit === 'z') {
    return { notation, rank, suit, label: HONOR_LABEL[index] }
  }

  return { notation, rank, suit, label: `${rank}${SUIT_KANJI[suit]}` }
}

export function renderHand(tiles: TileNotation[]): ParsedTile[] {
  return tiles.map(parseTile)
}
