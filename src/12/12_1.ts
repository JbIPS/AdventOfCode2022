import { compact } from 'lodash'
import chalk from 'chalk'
import convertColor from 'color-convert'
import { readFile } from 'fs/promises'
import { join } from 'path'

class Cell {
  public parent: Cell | null = null
  public g = 0
  public h = 0
  public f = 0

  constructor(public position: [number, number]) {}
  print() {
    console.log(...this.position)
  }

  public setParent(parent: Cell) {
    this.parent = parent
  }

  public equals(cell: Cell) {
    return this.position.toString() === cell.position.toString()
  }
}

class World {
  public readonly sizeX: number
  public readonly sizeY: number

  constructor(public readonly values: number[][]) {
    this.sizeX = values.length
    this.sizeY = values[0].length
    console.log(this.values)
  }

  public getNeighbors(cell: Cell): Cell[] {
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
    const res = compact(
      directions.map((direction) => {
        const newX = cell.position[0] + direction[0]
        const newY = cell.position[1] + direction[1]
        if (
          newX < 0 ||
          newY < 0 ||
          newX > this.sizeX - 1 ||
          newY > this.sizeY - 1
        ) {
          return undefined
        }

        const heightDiff =
          this.values[newX][newY] -
          this.values[cell.position[0]][cell.position[1]]
        if (heightDiff > 1) {
          return undefined
        }

        const newCell = new Cell([newX, newY])
        newCell.setParent(cell)
        return newCell
      }),
    )
    return res
  }

  public prettyPrint(
    s: [number, number][] = [],
    closed: [number, number][] = [],
    open: [number, number][] = [],
  ) {
    process.stdout.write(
      this.values
        .map((r, i) =>
          r
            .map((c, j) =>
              s.some(([x, y]) => x == i && y == j)
                ? chalk.white('█')
                : closed.some(([x, y]) => x == i && y == j)
                ? chalk.black('█')
                : chalk.hex(
                    convertColor.hsl.hex([
                      ~~((this.values[i][j] / 26) * 360),
                      ~~((this.values[i][j] / 26) * 50) + 50,
                      ~~((this.values[i][j] / 26) * 25) + 25,
                    ]),
                  )(
                    open.some(([x, y]) => x == i && y == j) ? '█' : '█' /*'▒'*/,
                  ),
            )
            .join(''),
        )
        .join('\n'),
    )
  }
}

function argMin(array: number[]) {
  return array
    .map((x, i) => [x, i])
    .reduce((acc, v) => (v[0] < acc[0] ? v : acc))[1]
}

function aStar(world: World, start: Cell, goal: Cell) {
  const open: Cell[] = []
  const closed = new Set<string>()

  let current: Cell

  open.push(start)

  let i = 0
  while (open.length) {
    i++
    const minF = argMin(open.map((c) => c.f))
    current = open.splice(minF, 1)[0]

    if (true /* false to remove log spam */) {
      /* START DISPLAY */
      const oldCurrent = current

      const currentPath = []
      while (current!.parent !== null) {
        currentPath.push(current!.position)
        current = current!.parent
      }
      currentPath.push(current!.position)

      world.prettyPrint(
        [...currentPath.reverse(), current.position],
        [...closed].map((s) => s.split(',').map(Number)) as [number, number][],
        open.map((c) => c.position),
      )

      console.log(currentPath.length)

      current = oldCurrent

      /* END DISPLAY */

      console.clear()
    }

    if (current.equals(goal)) {
      const path = []
      while (current!.parent !== null) {
        path.push(current!.position)
        current = current!.parent
      }
      path.push(current!.position)
      return [...path.reverse()]
    }

    for (const neighbor of world.getNeighbors(current)) {
      if (closed.has(neighbor.position.toString())) continue

      var gScore = current.g + 1
      var gScoreIsBest = false

      if (!open.some((c) => c.equals(neighbor))) {
        gScoreIsBest = true
        const [x1, y1] = neighbor.position
        const [x2, y2] = goal.position
        neighbor.h = Math.abs(x1 - x2) + Math.abs(y1 - y2)
        open.push(neighbor)
      } else if (gScore < neighbor.g) {
        gScoreIsBest = true
      }

      if (gScoreIsBest) {
        neighbor.g = gScore
        neighbor.f = neighbor.g + neighbor.h
      }
    }
    closed.add(current.position.toString())
  }
  return []
}

function parseInput(input: string): World {
  const grid = input
    .split('\n')
    .map((line) => line.split('').map((c) => c.charCodeAt(0) - 97))
  return new World(grid)
}

function findStartEnd(input: string): [[number, number], [number, number]] {
  const size = input.indexOf('\n')
  function findCharCoords(c: string): [number, number] {
    const index = input.replace(/\n/g, '').indexOf(c)
    return [~~(index / size), index % size]
  }
  return [findCharCoords('S'), findCharCoords('E')]
}

async function main() {
  const [input, sampleInput] = await Promise.all(
    ['input.txt', 'sample_input.txt'].map((file) =>
      readFile(join(__dirname, file), {
        encoding: 'utf-8',
      }),
    ),
  )

  let usedInput = input
  const [start, goal] = findStartEnd(usedInput).map((pos) => new Cell(pos))

  usedInput = usedInput.replace('S', 'a')
  usedInput = usedInput.replace('E', 'z')

  console.log(start.position, goal.position)
  const world = parseInput(usedInput)
  let s = aStar(world, start, goal)
  console.log('Res', s.length - 1)
  world.prettyPrint(s)
}

if (process.env.NODE_ENV !== 'test') main().catch(console.error)
