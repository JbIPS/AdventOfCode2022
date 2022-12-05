import { readFile } from 'fs/promises'
import { join } from 'path'

function pairPartiallyOverlaps(x1: number, x2: number, y1: number, y2: number) {
  return y1 <= x2 && y2 >= x1
}

async function main() {
  const input = await readFile(join(__dirname, 'input.txt'), {
    encoding: 'utf-8',
  })

  const elvesPairs = input.trim().split('\n')

  console.log(
    elvesPairs.filter((elfPair) => {
      const [[e11, e12], [e21, e22]] = elfPair
        .split(',')
        .map((elf) => elf.split('-').map((x) => Number(x)))

      return pairPartiallyOverlaps(e11, e12, e21, e22)
    }).length,
  )
}

main().catch(console.error)
