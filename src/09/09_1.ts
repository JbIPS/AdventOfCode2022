type Rope = [number, number]

import { readFile } from 'fs/promises'
import { range } from 'lodash'
import { join } from 'path'

type Direction = [number, number]

const Directions: Record<string, Direction> = {
  U: [0, 1],
  D: [0, -1],
  L: [-1, 0],
  R: [1, 0],
}

function parseInput(input: string): [Direction, number][] {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      const [direction, amount] = line.split(' ')
      return [Directions[direction], Number(amount)]
    })
}

function distance([hx, hy]: Rope, [tx, ty]: Rope) {
  return Math.sqrt(Math.pow(hx - tx, 2) + Math.pow(hy - ty, 2))
}

export function computeNextTailPosition([hx, hy]: Rope, [tx, ty]: Rope): Rope {
  let dx = hx - tx
  let dy = hy - ty
  const dist = distance([hx, hy], [tx, ty])
  dx = dist < 2 ? 0 : Math.sign(dx) * Math.min(Math.abs(dx), 1)
  dy = dist < 2 ? 0 : Math.sign(dy) * Math.min(Math.abs(dy), 1)
  return [tx + dx, ty + dy]
}

async function main() {
  const [input, sampleInput] = await Promise.all(
    ['input.txt', 'sample_input.txt'].map((file) =>
      readFile(join(__dirname, file), {
        encoding: 'utf-8',
      }),
    ),
  )

  const positionsVisitedAtLeastOnce = new Set()
  let head: Rope = [0, 0]
  let tail: Rope = [0, 0]

  function processMove(direction: Direction) {
    head = [head[0] + direction[0], head[1] + direction[1]]
    tail = computeNextTailPosition(head, tail)

    positionsVisitedAtLeastOnce.add(tail.toString())
    console.log(head, tail)
  }

  for (const [direction, times] of parseInput(input)) {
    range(0, times).forEach(() => processMove(direction))
  }

  console.log(positionsVisitedAtLeastOnce.size)
}

if (process.env.NODE_ENV !== 'test') main().catch(console.error)
