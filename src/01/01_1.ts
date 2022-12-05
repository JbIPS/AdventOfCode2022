import { read, readFile, readFileSync } from 'fs'
import { join } from 'path'

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

  console.log(Math.max(...caloriesTotalByElf))
}

main().catch(console.error)
