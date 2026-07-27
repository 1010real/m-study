import type { Breakdown, DoraKind, ScoreName } from '../../domain/types.ts'
import { YAKU_TABLE } from '../../domain/yakuTable.ts'

const SCORE_NAME_LABEL: Record<ScoreName, string> = {
  mangan: '満貫',
  haneman: '跳満',
  baiman: '倍満',
  sanbaiman: '三倍満',
  yakuman: '役満',
}

const DORA_LABEL: Record<DoraKind, string> = {
  dora: 'ドラ',
  uradora: '裏ドラ',
  akadora: '赤ドラ',
}

function formatPayments(breakdown: Breakdown): string {
  const { payments } = breakdown.points
  if (payments.tsumoEach !== undefined) return `${payments.tsumoEach}点オール`
  if (payments.tsumoDealer !== undefined && payments.tsumoNonDealer !== undefined) {
    return `子${payments.tsumoNonDealer}点 / 親${payments.tsumoDealer}点`
  }
  if (payments.ron !== undefined) return `ロン ${payments.ron}点`
  return `${breakdown.points.total}点`
}

export function BreakdownPanel({ breakdown }: { breakdown: Breakdown }) {
  const { question } = breakdown

  return (
    <div className="breakdown-panel">
      <section>
        <h2>成立した役</h2>
        <table>
          <tbody>
            {breakdown.yaku.map((y) => (
              <tr key={y.id}>
                <td>{YAKU_TABLE[y.id].nameJp}</td>
                <td>{y.han}翻</td>
              </tr>
            ))}
            {question.dora.map((d, i) => (
              <tr key={`dora-${i}`}>
                <td>{DORA_LABEL[d.kind]}</td>
                <td>{d.count}翻</td>
              </tr>
            ))}
            <tr className="total-row">
              <td>合計</td>
              <td>{breakdown.han}翻</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>符計算</h2>
        <table>
          <tbody>
            {breakdown.fu.components.map((c, i) => (
              <tr key={i}>
                <td>{c.label}</td>
                <td>{c.value}符</td>
              </tr>
            ))}
            <tr className="total-row">
              <td>合計（切り上げ）</td>
              <td>
                {breakdown.fu.raw}符 → {breakdown.fu.rounded}符
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="result">
        <h2>
          {breakdown.han}翻{breakdown.fu.rounded}符
          {breakdown.points.scoreName && (
            <span className="tier-badge">{SCORE_NAME_LABEL[breakdown.points.scoreName]}</span>
          )}
        </h2>
        <p className="points">
          {breakdown.points.total}点（{formatPayments(breakdown)}）
        </p>
      </section>

      {question.explanationNotes && <p className="notes">{question.explanationNotes}</p>}
    </div>
  )
}
