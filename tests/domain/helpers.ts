import type { Question } from '../../src/domain/types.ts'

export function makeQuestion(overrides: Partial<Question> = {}): Question {
  return {
    id: 'test',
    hand: [],
    winningTile: '1m',
    context: {
      seat: 'nonDealer',
      winType: 'ron',
      isClosed: true,
      riichi: false,
      doubleRiichi: false,
      ippatsu: false,
      seatWind: 'E',
      roundWind: 'E',
    },
    yaku: [],
    dora: [],
    fuComponents: [],
    ...overrides,
  }
}
