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
  // "0m"/"0p"/"0s" は赤ドラ（赤5）を表す特別表記
  const match = /^([0-9])([mpsz])$/.exec(notation)
  if (!match) {
    throw new Error(`不正な牌表記: ${notation}`)
  }
  const rawRank = Number(match[1])
  const suit = match[2] as 'm' | 'p' | 's' | 'z'
  const isRedFive = rawRank === 0
  if (isRedFive && suit === 'z') {
    throw new Error(`不正な牌表記: ${notation}`)
  }

  const rank = isRedFive ? 5 : rawRank
  const index = rank - 1
  const imageSrc = `${import.meta.env.BASE_URL}tiles/${notation}.svg`

  if (suit === 'z') {
    return { notation, rank, suit, label: HONOR_LABEL[index], imageSrc }
  }

  const label = isRedFive ? `赤${rank}${SUIT_KANJI[suit]}` : `${rank}${SUIT_KANJI[suit]}`
  return { notation, rank, suit, label, imageSrc }
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
