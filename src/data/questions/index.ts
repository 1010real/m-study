import type { Question } from '../../domain/types.ts'
import { advancedYakuQuestions } from './advancedYaku.ts'
import { basicYakuQuestions } from './basicYaku.ts'
import { situationalQuestions } from './situational.ts'

export const questions: Question[] = [...basicYakuQuestions, ...advancedYakuQuestions, ...situationalQuestions]
