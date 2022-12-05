import { read, readFile, readFileSync } from 'fs'
import { join } from 'path'
import { range } from 'lodash'

function getLetterPrio(l: string) {
  const code = l.charCodeAt(0)
  if (code <= 90) return code - 38
  return code - 96
}

function findCommonLettersInGroup(groups: string[][]) {
  const sets: Set<string>[] = []
  const allLetters = new Set<string>()
  for (const [i, group] of groups.entries()) {
    sets[i] = new Set(group)
    group.map((l) => allLetters.add(l))
  }
  return [...allLetters].find((l) => sets.every((s) => s.has(l)))
}

async function main() {
  const input = readFileSync(join(__dirname, 'input.txt')).toString()
  const backpacks = input.trim().split('\n')
  console.log(
    range(0, backpacks.length, 3)
      .map((i) =>
        findCommonLettersInGroup(
          [backpacks[i], backpacks[i + 1], backpacks[i + 2]].map((s) =>
            s.split(''),
          ),
        ),
      )
      .reduce((acc, c) => acc + getLetterPrio(c!), 0),
  )
}

main().catch(console.error)
