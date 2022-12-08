import { readFile } from 'fs/promises'
import { join } from 'path'

function parseInput(input: string) {
  return input
    .trim()
    .split('\n')
    .map((row) => row.split('').map((c) => Number(c)))
}

function isTreeVisible(map: number[][], ownRow: number, ownCol: number) {
  const ownTreeHeight = map[ownRow][ownCol]
  //console.log('own height', ownTreeHeight)
  const visibleFromDirection = [true, true, true, true]

  for (const [directionIndex, direction] of [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ].entries()) {
    let row = ownRow + direction[0],
      col = ownCol + direction[1]

    while (row >= 0 && row < map.length && col >= 0 && col < map[0].length) {
      const treeHeight = map[row][col]
      //console.log(row, col, '|', treeHeight)
      if (treeHeight >= ownTreeHeight) {
        visibleFromDirection[directionIndex] = false
        break
      }

      row += direction[0]
      col += direction[1]
    }
    //console.log('---')
  }
  //console.log(visibleFromDirection)
  return visibleFromDirection.some((d) => d === true)
}

async function main() {
  const [input, sampleInput] = await Promise.all(
    ['input.txt', 'sample_input.txt'].map((file) =>
      readFile(join(__dirname, file), {
        encoding: 'utf-8',
      }),
    ),
  )

  const trees = parseInput(input)

  let count = 0
  for (let r = 0; r < trees.length; r++) {
    for (let c = 0; c < trees[0].length; c++) {
      if (isTreeVisible(trees, r, c)) count++
    }
  }
  console.log(count)
}

main().catch(console.error)
