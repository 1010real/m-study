import { renderHand } from '../../domain/tiles.ts'
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

  badges.push(`自風:${WIND_LABEL[context.seatWind]}`, `場風:${WIND_LABEL[context.roundWind]}`)

  return badges
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
          <span key={i} className={`tile tile-${tile.suit}`}>
            {tile.label}
          </span>
        ))}
        <span className={`tile tile-${winTile.suit} win-tile`}>{winTile.label}</span>
      </div>

      {question.melds && question.melds.length > 0 && (
        <div className="melds">
          {question.melds.map((meld, i) => (
            <div key={i} className="meld">
              <span className="meld-label">{meldLabel(meld.kind)}</span>
              {renderHand(meld.tiles).map((tile, j) => (
                <span key={j} className={`tile tile-${tile.suit}`}>
                  {tile.label}
                </span>
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
                <span key={i} className={`tile tile-${tile.suit}`}>
                  {tile.label}
                </span>
              ))}
            </div>
          )}
          {uraDoraIndicators.length > 0 && (
            <div className="indicator-row">
              <span className="indicator-label">裏ドラ表示牌</span>
              {uraDoraIndicators.map((tile, i) => (
                <span key={i} className={`tile tile-${tile.suit}`}>
                  {tile.label}
                </span>
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
