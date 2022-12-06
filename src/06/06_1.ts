import { readFile } from 'fs/promises'
import { join } from 'path'

function isStartOfPacketMarker(i: number, data: string) {
  if (i < 4) return false
  const substr = data.slice(i - 4, i)
  return substr
    .split('')
    .every((char) => substr.indexOf(char) === substr.lastIndexOf(char))
}

async function main() {
  const input = await readFile(join(__dirname, 'input.txt'), {
    encoding: 'utf-8',
  })

  for (let i = 0; i < input.length; i++) {
    if (isStartOfPacketMarker(i, input)) {
      console.log(i)
      break
    }
  }
}

main().catch(console.error)
