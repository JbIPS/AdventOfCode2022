import { readFile } from 'fs/promises'
import { range } from 'lodash'
import { join } from 'path'

function parseInput(input: string): string[][] {
  return input
    .trim()
    .split('\n')
    .map((line) => {
      return line.split(' ')
    })
}

function shouldCheckSignalStrength(cycle: number) {
  return cycle >= 20 && cycle <= 220 && (cycle + 20) % 40 === 0
}

function getSignal(cycle: number, reg: number) {
  //console.log(cycle)
  if (!shouldCheckSignalStrength(cycle)) return 0
  console.log(cycle, '*', reg, '=', cycle * reg)
  return cycle * reg
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
  let cycleCount = 0
  let signal = 0

  for (const [cmd, arg] of parseInput(input)) {
    switch (cmd) {
      case 'noop':
        cycleCount++
        signal += getSignal(cycleCount, x)
        break
      case 'addx':
        cycleCount++
        signal += getSignal(cycleCount, x)

        cycleCount++
        signal += getSignal(cycleCount, x)
        x += +arg
        break
      default:
        throw new Error('wtf is ' + cmd)
    }
  }

  console.log(x, cycleCount, signal)
}

if (process.env.NODE_ENV !== 'test') main().catch(console.error)
