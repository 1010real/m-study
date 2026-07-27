import { renderHand } from '../../domain/tiles.ts'
import type { ParsedTile } from '../../domain/tiles.ts'
import type { MeldKind, Question, Wind } from '../../domain/types.ts'

const WIND_LABEL: Record<Wind, string> = { E: '東', S: '南', W: '西', N: '北' }

function meldLabel(kind: MeldKind): string {
  switch (kind) {
    case 'chi':
      return 'チー'
    case 'pon':
      return 'ポン'
    case 'minkan':
      return '明槓'
    case 'ankan':
      return '暗槓'
  }
}

function contextBadges(question: Question): string[] {
  const { context } = question
  const badges: string[] = [context.seat === 'dealer' ? '親' : '子', context.winType === 'ron' ? 'ロン' : 'ツモ']

  if (context.doubleRiichi) badges.push('ダブルリーチ')
  else if (context.riichi) badges.push('リーチ')
  if (context.ippatsu) badges.push('一発')
  if (context.haitei) badges.push('海底')
  if (context.houtei) badges.push('河底')
  if (context.rinshan) badges.push('嶺上開花')
  if (context.chankan) badges.push('槍槓')

  badges.push(`自風:${WIND_LABEL[context.seatWind]}`, `場風:${WIND_LABEL[context.roundWind]}`)

  return badges
}

function Tile({ tile, highlight = false }: { tile: ParsedTile; highlight?: boolean }) {
  return <img className={`tile${highlight ? ' win-tile' : ''}`} src={tile.imageSrc} alt={tile.label} width={34} height={46} />
}

export function HandDisplay({ question }: { question: Question }) {
  const handTiles = renderHand(question.hand)
  const winTile = renderHand([question.winningTile])[0]
  const doraIndicators = renderHand(question.doraIndicators ?? [])
  const showUraDora = question.context.riichi || question.context.doubleRiichi
  const uraDoraIndicators = renderHand(showUraDora ? (question.uraDoraIndicators ?? []) : [])

  return (
    <div className="hand-display">
      <div className="tiles">
        {handTiles.map((tile, i) => (
          <Tile key={i} tile={tile} />
        ))}
        <Tile tile={winTile} highlight />
      </div>

      {question.melds && question.melds.length > 0 && (
        <div className="melds">
          {question.melds.map((meld, i) => (
            <div key={i} className="meld">
              <span className="meld-label">{meldLabel(meld.kind)}</span>
              {renderHand(meld.tiles).map((tile, j) => (
                <Tile key={j} tile={tile} />
              ))}
            </div>
          ))}
        </div>
      )}

      {(doraIndicators.length > 0 || uraDoraIndicators.length > 0) && (
        <div className="indicators">
          {doraIndicators.length > 0 && (
            <div className="indicator-row">
              <span className="indicator-label">ドラ表示牌</span>
              {doraIndicators.map((tile, i) => (
                <Tile key={i} tile={tile} />
              ))}
            </div>
          )}
          {uraDoraIndicators.length > 0 && (
            <div className="indicator-row">
              <span className="indicator-label">裏ドラ表示牌</span>
              {uraDoraIndicators.map((tile, i) => (
                <Tile key={i} tile={tile} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="badges">
        {contextBadges(question).map((badge) => (
          <span key={badge} className="badge">
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}
