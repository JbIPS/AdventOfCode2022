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
  switch (input) {
    case 'A':
    case 'X':
      return RPS.ROC
    case 'B':
    case 'Y':
      return RPS.PAP
    case 'C':
    case 'Z':
      return RPS.SCI
    default:
      throw 'boom'
  }
}

function computeScore(opponentInput: RPS, input: RPS) {
  return computeShapeScore(input) + computeOutcomeScore(opponentInput, input)
}

function computeScoreFromStrategy(strategy: string) {
  const [opponentMove, playerMove] = strategy.split(' ').map(charToRPS)
  return computeScore(opponentMove, playerMove)
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
