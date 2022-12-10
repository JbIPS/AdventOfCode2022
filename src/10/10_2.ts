import { readFile } from 'fs/promises'
import { join } from 'path'

class CRT {
  public pixels = Array(240).fill(false)
  enablePixel(pos: number) {
    this.pixels[pos - 1] = true
  }
  draw() {
    let res = ''
    for (const [i, pixel] of this.pixels.entries()) {
      res += pixel ? '#' : '.'
      if ((i + 1) % 40 === 0) res += '\n'
    }
    console.log(res)
  }
}

function parseInput(input: string): string[][] {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      return line.split(' ')
    })
}

function getSpritePositions(x: number): number[] {
  return [x - 1, x, x + 1]
}

function tick(crt: CRT, cycle: number, x: number) {
  const spritePositions = getSpritePositions(x)
  if (spritePositions.some((pos) => pos + 1 === cycle % 40)) {
    crt.enablePixel(cycle)
  }
}

async function main() {
  const [input, sampleInput] = await Promise.all(
    ['input.txt', 'sample_input.txt'].map((file) =>
      readFile(join(__dirname, file), {
        encoding: 'utf-8',
      }),
    ),
  )

  let x = 1
  let cycle = 0
  const crt = new CRT()

  for (const [cmd, arg] of parseInput(input)) {
    switch (cmd) {
      case 'noop':
        cycle++
        tick(crt, cycle, x)
        break
      case 'addx':
        cycle++
        tick(crt, cycle, x)
        cycle++
        tick(crt, cycle, x)
        x += +arg
        break
      default:
        throw new Error('wtf is ' + cmd)
    }
  }

  crt.draw()
}

if (process.env.NODE_ENV !== 'test') main().catch(console.error)
