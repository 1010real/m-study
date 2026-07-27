import type { QuizChoice } from '../../domain/types.ts'

interface Props {
  choices: QuizChoice[]
  answeredChoiceId: string | null
  onSelect: (choiceId: string) => void
}

export function ChoiceButtons({ choices, answeredChoiceId, onSelect }: Props) {
  const answered = answeredChoiceId !== null

  return (
    <div className="choices">
      {choices.map((choice) => {
        const classes = ['choice-button']
        if (answered && choice.isCorrect) classes.push('correct')
        if (answered && !choice.isCorrect && choice.id === answeredChoiceId) classes.push('incorrect')

        return (
          <button
            key={choice.id}
            type="button"
            className={classes.join(' ')}
            disabled={answered}
            onClick={() => onSelect(choice.id)}
          >
            {choice.label}
          </button>
        )
      })}
    </div>
  )
}
