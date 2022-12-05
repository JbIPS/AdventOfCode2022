import { read, readFile, readFileSync } from 'fs'
import { join } from 'path'

function sliceBackpack(backpack: string): [string, string] {
  return [
    backpack.slice(0, backpack.length / 2),
    backpack.slice(backpack.length / 2, backpack.length),
  ]
}

function findCommonLetter(str1: string[], str2: string[]) {
  return str1.find((v, i) => str2.indexOf(v) !== -1)
}

function getLetterPrio(l: string) {
  const code = l.charCodeAt(0)
  if (code <= 90) return code - 38
  return code - 96
}

async function main() {
  const input = readFileSync(join(__dirname, 'input.txt')).toString()
  const backpacks = input.trim().split('\n')
  console.log(
    backpacks
      .map((backpack) => {
        const [part1, part2] = sliceBackpack(backpack).map((slice) =>
          slice.split(''),
        )
        return getLetterPrio(findCommonLetter(part1, part2)!)
      })
      .reduce((acc, v) => acc + v, 0),
  )
}

main().catch(console.error)
