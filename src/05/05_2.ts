import { readFile } from 'fs/promises'
import { range } from 'lodash'
import { join } from 'path'

function parseCrateSection(data: string): string[][] {
  const lines = data.split('\n')
  const rows = lines.length - 1 // excl number rows below
  const cols = Math.ceil(lines[lines.length - 1].length / 4)

  return range(0, cols).map((col) =>
    range(0, rows)
      .map((row) => lines[row][col * 4 + 1])
      .filter((x) => x != ' '),
  )
}

function parseCommandsSection(data: string): [number, number, number][] {
  const lines = data.split('\n').filter(Boolean)
  return lines.map((line) => {
    const res = /^move (\d+) from (\d+) to (\d+)$/.exec(line)
    if (res === null) throw new Error('lol' + line)
    return [+res[1], +res[2], +res[3]]
  })
}

function moveCrates(crates: string[][], n: number, from: number, to: number) {
  const crateStack = crates[from].splice(0, n)
  crates[to].unshift(...crateStack)
}

async function main() {
  const input = await readFile(join(__dirname, 'input.txt'), {
    encoding: 'utf-8',
  })

  const [crateSection, commandsSection] = input.split('\n\n')
  const crates = parseCrateSection(crateSection)
  const commands = parseCommandsSection(commandsSection)

  console.log(crates)
  console.log(commands)

  commands.forEach(([n, from, to]) => moveCrates(crates, n, from - 1, to - 1))

  console.log(crates.map((c) => c[0]).join(''))
}

main().catch(console.error)
