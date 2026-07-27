export function ScoreTracker({ correct, total }: { correct: number; total: number }) {
  return (
    <div className="score-tracker">
      正解: {correct} / {total}
    </div>
  )
}
