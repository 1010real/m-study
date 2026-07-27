import type { FuBreakdown, Question } from '../types.ts'

function roundUpToTen(value: number): number {
  return Math.ceil(value / 10) * 10
}

function hasYaku(question: Question, id: string): boolean {
  return question.yaku.some((y) => y.id === id)
}

export function computeFu(question: Question): FuBreakdown {
  if (hasYaku(question, 'chiitoitsu')) {
    const components = [{ type: 'base' as const, label: '七対子固定', value: 25 }]
    return { components, raw: 25, rounded: 25 }
  }

  if (hasYaku(question, 'pinfu') && question.context.winType === 'tsumo') {
    const components = [{ type: 'base' as const, label: '平和・自摸固定', value: 20 }]
    return { components, raw: 20, rounded: 20 }
  }

  const raw = question.fuComponents.reduce((total, c) => total + c.value, 0)
  let rounded = roundUpToTen(raw)

  // 食い平和: 開いた手で符が20符になる場合は30符に補正する
  if (!question.context.isClosed && rounded === 20) {
    rounded = 30
  }

  return { components: question.fuComponents, raw, rounded }
}
