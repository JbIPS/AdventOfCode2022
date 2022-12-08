import { readFile } from 'fs/promises'
import { join } from 'path'

function parseInput(input: string) {
  return input
    .trim()
    .split('\n')
    .map((row) => row.split('').map((c) => Number(c)))
}

function countVisibleTrees(
  map: number[][],
  ownRow: number,
  ownCol: number,
): number {
  const ownTreeHeight = map[ownRow][ownCol]
  const visibleTreesByDirection = [0, 0, 0, 0]

  for (const [directionIndex, direction] of [
    [-1, 0], // up
    [0, -1], // left
    [1, 0], // down
    [0, 1], // right
  ].entries()) {
    let row = ownRow + direction[0],
      col = ownCol + direction[1]

    while (row >= 0 && row < map.length && col >= 0 && col < map[0].length) {
      const treeHeight = map[row][col]
      if (treeHeight >= ownTreeHeight) {
        visibleTreesByDirection[directionIndex]++

        break
      }
      visibleTreesByDirection[directionIndex]++

      row += direction[0]
      col += direction[1]
    }
  }
  return visibleTreesByDirection.reduce((acc, x) => acc * x)
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

  let highScore = 0
  for (let r = 0; r < trees.length; r++) {
    for (let c = 0; c < trees[0].length; c++) {
      const scenicScore = countVisibleTrees(trees, r, c)
      if (scenicScore > highScore) {
        highScore = scenicScore
      }
    }
  }
  console.log(highScore)
}

main().catch(console.error)
