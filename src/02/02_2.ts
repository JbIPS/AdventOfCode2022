import { read, readFile, readFileSync } from 'fs'
import { join } from 'path'

enum RPS {
  ROC = 0,
  PAP,
  SCI,
}

enum Outcome {
  LOST = 0,
  DRAW = 3,
  WIN = 6,
}

enum RequiredOutcome {
  MUST_LOSE = 'X',
  MUST_DRAW = 'Y',
  MUST_WIN = 'Z',
}

function computeShapeScore(input: RPS) {
  const score = new Map([
    [RPS.ROC, 1],
    [RPS.PAP, 2],
    [RPS.SCI, 3],
  ]).get(input)
  if (!score) throw new Error('invalid ' + input)
  return score
}

function computeOutcomeScore(opponentInput: RPS, input: RPS) {
  switch (input) {
    case RPS.ROC:
      return [Outcome.DRAW, Outcome.LOST, Outcome.WIN][opponentInput]
    case RPS.PAP:
      return [Outcome.WIN, Outcome.DRAW, Outcome.LOST][opponentInput]
    case RPS.SCI:
      return [Outcome.LOST, Outcome.WIN, Outcome.DRAW][opponentInput]
  }
}

function charToRPS(input: string): RPS {
  const rps = { A: RPS.ROC, B: RPS.PAP, C: RPS.SCI }[input]
  if (rps === undefined) throw 'boom'
  return rps
}

function computeScore(opponentInput: RPS, input: RPS) {
  return computeShapeScore(input) + computeOutcomeScore(opponentInput, input)
}

function computeScoreFromStrategy(strategy: string) {
  const [opponentInput, requiredOutcome] = strategy.split(' ')
  return computeScore(
    charToRPS(opponentInput),
    computePlayFromOpponentInputAndRequiredOutcome(
      charToRPS(opponentInput),
      requiredOutcome as RequiredOutcome,
    ),
  )
}

function computePlayFromOpponentInputAndRequiredOutcome(
  opponentInput: RPS,
  requiredOutcome: RequiredOutcome,
) {
  switch (requiredOutcome) {
    case RequiredOutcome.MUST_WIN:
      return [RPS.PAP, RPS.SCI, RPS.ROC][opponentInput]
    case RequiredOutcome.MUST_DRAW:
      return [RPS.ROC, RPS.PAP, RPS.SCI][opponentInput]
    case RequiredOutcome.MUST_LOSE:
      return [RPS.SCI, RPS.ROC, RPS.PAP][opponentInput]
  }
}

async function main() {
  const input = readFileSync(join(__dirname, 'input.txt')).toString()
  const strategy = input.trim().split('\n')
  console.log(
    strategy
      .map((s) => computeScoreFromStrategy(s))
      .reduce((acc, x) => acc + x),
  )
}

main().catch(console.error)
