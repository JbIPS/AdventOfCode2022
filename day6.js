const Fs = require('fs/promises')

function isAllUnique(array) {
	const temp = []
	return array.every(char => {
		const alreadyExists = temp.includes(char)
		temp.push(char)
		return !alreadyExists
	})
}

async function readInput(sizeOfMarker) {
	const input = await Fs.readFile('./day6_input.txt', {encoding: 'utf8'})
	let index = 0
	const markers = []
	let allUnique = false
	while(!allUnique) {
		const newChar = input.charAt(index)
		markers.push(newChar)
		if(markers.length > sizeOfMarker) markers.shift()
		if(markers.length === sizeOfMarker) allUnique = isAllUnique(markers)
		index++
	}
	return index
}

async function part1() {
	return readInput(4)
}

async function part2() {
	return readInput(14)
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)
