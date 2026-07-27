import { useCallback, useMemo, useState } from 'react'
import { generateChoices } from '../domain/distractors.ts'
import { buildBreakdown } from '../domain/scoring/breakdown.ts'
import type { Breakdown, Question, QuizChoice } from '../domain/types.ts'

function shuffleOrder(length: number): number[] {
  const order = Array.from({ length }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export interface QuizSession {
  question: Question | undefined
  breakdown: Breakdown | undefined
  choices: QuizChoice[]
  answeredChoiceId: string | null
  score: { correct: number; total: number }
  questionNumber: number
  totalQuestions: number
  isFinished: boolean
  selectChoice: (choiceId: string) => void
  next: () => void
  restart: () => void
}

export function useQuizSession(questions: Question[]): QuizSession {
  const [order, setOrder] = useState<number[]>(() => shuffleOrder(questions.length))
  const [index, setIndex] = useState(0)
  const [answeredChoiceId, setAnsweredChoiceId] = useState<string | null>(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const isFinished = index >= order.length
  const question = isFinished ? undefined : questions[order[index]]

  const choices = useMemo(() => (question ? generateChoices(question) : []), [question])
  const breakdown = useMemo(() => (question ? buildBreakdown(question) : undefined), [question])

  const selectChoice = useCallback(
    (choiceId: string) => {
      if (answeredChoiceId !== null || !question) return
      setAnsweredChoiceId(choiceId)
      const choice = choices.find((c) => c.id === choiceId)
      setScore((prev) => ({
        correct: prev.correct + (choice?.isCorrect ? 1 : 0),
        total: prev.total + 1,
      }))
    },
    [answeredChoiceId, question, choices],
  )

  const next = useCallback(() => {
    setAnsweredChoiceId(null)
    setIndex((prev) => prev + 1)
  }, [])

  const restart = useCallback(() => {
    setOrder(shuffleOrder(questions.length))
    setIndex(0)
    setAnsweredChoiceId(null)
    setScore({ correct: 0, total: 0 })
  }, [questions.length])

  return {
    question,
    breakdown,
    choices,
    answeredChoiceId,
    score,
    questionNumber: index + 1,
    totalQuestions: order.length,
    isFinished,
    selectChoice,
    next,
    restart,
  }
}
