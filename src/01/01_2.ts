import { read, readFile, readFileSync } from 'fs'
import { join } from 'path'
import { inspect } from 'util'

async function main() {
  const input = readFileSync(join(__dirname, 'input.txt')).toString()
  console.log(input)
  const caloriesDataByElf = input.trim().split('\n\n')
  const caloriesArrByElf = caloriesDataByElf.map((elfData) =>
    elfData.split('\n').map((x) => Number(x)),
  )

  const caloriesTotalByElf = caloriesArrByElf.map((elfCaloriesArr) =>
    elfCaloriesArr.reduce((acc, v) => acc + v, 0),
  )

  const totalByElfSorted = [...caloriesTotalByElf].sort((a, b) => b - a)

  console.log(totalByElfSorted.slice(0, 3).reduce((acc, v) => acc + v, 0))
}

main().catch(console.error)
