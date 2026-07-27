import { BreakdownPanel } from '../components/quiz/BreakdownPanel.tsx'
import { ChoiceButtons } from '../components/quiz/ChoiceButtons.tsx'
import { HandDisplay } from '../components/quiz/HandDisplay.tsx'
import '../components/quiz/quiz.css'
import { ScoreTracker } from '../components/quiz/ScoreTracker.tsx'
import { questions } from '../data/questions/index.ts'
import { useQuizSession } from '../hooks/useQuizSession.ts'

export function QuizPage() {
  const session = useQuizSession(questions)

  if (session.isFinished) {
    return (
      <div className="quiz-page">
        <h1>麻雀点数計算クイズ</h1>
        <div className="summary">
          <h2>おつかれさまでした</h2>
          <p className="points">
            {session.score.correct} / {session.score.total} 問正解
          </p>
          <button type="button" className="restart-button" onClick={session.restart}>
            もう一度挑戦する
          </button>
        </div>
      </div>
    )
  }

  const { question, breakdown } = session
  if (!question || !breakdown) return null

  const answered = session.answeredChoiceId !== null
  const selectedChoice = session.choices.find((c) => c.id === session.answeredChoiceId)

  return (
    <div className="quiz-page">
      <h1>麻雀点数計算クイズ</h1>
      <div className="top-bar">
        <span>
          第{session.questionNumber}問 / {session.totalQuestions}問
        </span>
        <ScoreTracker correct={session.score.correct} total={session.score.total} />
      </div>

      {question.title && <h2 className="question-title">{question.title}</h2>}
      <HandDisplay question={question} />

      <p className="prompt">この和了の点数はいくつでしょう？</p>
      <ChoiceButtons choices={session.choices} answeredChoiceId={session.answeredChoiceId} onSelect={session.selectChoice} />

      {answered && (
        <div className="reveal">
          <p className={`result-message ${selectedChoice?.isCorrect ? 'correct' : 'incorrect'}`}>
            {selectedChoice?.isCorrect ? '正解！' : '不正解…'}
          </p>
          <BreakdownPanel breakdown={breakdown} />
          <button type="button" className="next-button" onClick={session.next}>
            次の問題へ
          </button>
        </div>
      )}
    </div>
  )
}
