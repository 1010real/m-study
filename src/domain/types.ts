/** 牌表記: 数牌は "<1-9><m|p|s>"、字牌は "<1-7>z" (東南西北白發中) */
export type TileNotation = string

export type MeldKind = 'chi' | 'pon' | 'minkan' | 'ankan'

export interface MeldDescriptor {
  kind: MeldKind
  tiles: TileNotation[]
}

export type YakuId =
  | 'riichi'
  | 'doubleRiichi'
  | 'ippatsu'
  | 'menzenTsumo'
  | 'pinfu'
  | 'tanyao'
  | 'yakuhaiHaku'
  | 'yakuhaiHatsu'
  | 'yakuhaiChun'
  | 'yakuhaiSeatWind'
  | 'yakuhaiRoundWind'
  | 'iipeikou'
  | 'toitoi'
  | 'sanankou'
  | 'chanta'
  | 'honitsu'
  | 'chinitsu'
  | 'chiitoitsu'
  | 'haitei'
  | 'houtei'
  | 'rinshan'
  | 'chankan'

export interface YakuDefinition {
  id: YakuId
  nameJp: string
  nameEn: string
  han: { closed?: number; open?: number }
  description: string
}

/** 問題作成者が閉/開の翻数をあらかじめ確定させて持たせる */
export interface AppliedYaku {
  id: YakuId
  han: number
}

export type DoraKind = 'dora' | 'uradora' | 'akadora'

export interface DoraEntry {
  kind: DoraKind
  count: number
}

export type FuComponentType =
  | 'base'
  | 'menzenRon'
  | 'tsumo'
  | 'waitKanchan'
  | 'waitPenchan'
  | 'waitTanki'
  | 'triplet_open_simple'
  | 'triplet_open_terminal'
  | 'triplet_closed_simple'
  | 'triplet_closed_terminal'
  | 'kan_open_simple'
  | 'kan_open_terminal'
  | 'kan_closed_simple'
  | 'kan_closed_terminal'
  | 'pairYakuhai'
  | 'pairDoubleWind'

export interface FuComponent {
  type: FuComponentType
  label: string
  value: number
}

export type Seat = 'dealer' | 'nonDealer'
export type WinType = 'ron' | 'tsumo'
export type Wind = 'E' | 'S' | 'W' | 'N'

export interface QuestionContext {
  seat: Seat
  winType: WinType
  isClosed: boolean
  riichi: boolean
  doubleRiichi: boolean
  ippatsu: boolean
  seatWind: Wind
  roundWind: Wind
}

export type ScoreName = 'mangan' | 'haneman' | 'baiman' | 'sanbaiman' | 'yakuman'

export interface PointsPayments {
  ron?: number
  tsumoDealer?: number
  tsumoNonDealer?: number
  tsumoEach?: number
}

export interface PointsResult {
  han: number
  fu: number
  scoreName?: ScoreName
  total: number
  payments: PointsPayments
}

export interface Question {
  id: string
  title?: string
  hand: TileNotation[]
  melds?: MeldDescriptor[]
  winningTile: TileNotation
  context: QuestionContext
  yaku: AppliedYaku[]
  dora: DoraEntry[]
  /** ドラ表示牌（常時公開）。対応する dora の枚数と整合する必要がある */
  doraIndicators?: TileNotation[]
  /** 裏ドラ表示牌。リーチ和了時のみ公開される */
  uraDoraIndicators?: TileNotation[]
  fuComponents: FuComponent[]
  explanationNotes?: string
  manualDistractors?: PointsResult[]
}

export interface QuizChoice {
  id: string
  label: string
  points: PointsResult
  isCorrect: boolean
}

export interface FuBreakdown {
  components: FuComponent[]
  raw: number
  rounded: number
}

export interface Breakdown {
  question: Question
  yaku: AppliedYaku[]
  dora: DoraEntry[]
  han: number
  fu: FuBreakdown
  points: PointsResult
}
