import type { TileNotation } from './types.ts'

const HONOR_LABEL = ['東', '南', '西', '北', '白', '發', '中']
const SUIT_KANJI = { m: '萬', p: '筒', s: '索' } as const

export interface ParsedTile {
  notation: TileNotation
  rank: number
  suit: 'm' | 'p' | 's' | 'z'
  label: string
  /** タイル画像のパス（public/tiles/ 配下、CC0: FluffyStuff/riichi-mahjong-tiles） */
  imageSrc: string
}

export function parseTile(notation: TileNotation): ParsedTile {
  const match = /^([1-9])([mpsz])$/.exec(notation)
  if (!match) {
    throw new Error(`不正な牌表記: ${notation}`)
  }
  const rank = Number(match[1])
  const suit = match[2] as 'm' | 'p' | 's' | 'z'
  const index = rank - 1
  const imageSrc = `/tiles/${notation}.svg`

  if (suit === 'z') {
    return { notation, rank, suit, label: HONOR_LABEL[index], imageSrc }
  }

  return { notation, rank, suit, label: `${rank}${SUIT_KANJI[suit]}`, imageSrc }
}

export function renderHand(tiles: TileNotation[]): ParsedTile[] {
  return tiles.map(parseTile)
}

/** ドラ表示牌から実際のドラ牌を求める（数牌は+1、風牌・三元牌は各巡目で循環） */
export function doraFromIndicator(indicator: TileNotation): TileNotation {
  const { rank, suit } = parseTile(indicator)

  if (suit === 'z') {
    if (rank <= 4) {
      return `${(rank % 4) + 1}z`
    }
    const dragonIndex = rank - 5
    return `${5 + ((dragonIndex + 1) % 3)}z`
  }

  return `${(rank % 9) + 1}${suit}`
}
