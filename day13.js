const Fs = require('fs/promises')

async function readInput() {
	const input = await Fs.readFile('./day13_input.txt', {encoding: 'utf8'})
	return input.split('\n')
	.reduce((memo, line) => {
		if(line === '') {
			memo.result.push(memo.current)
			memo.current = []			
		}
		else memo.current.push(eval(line))
		return memo
	},{result: [], current: []}).result.filter(arr => arr.length !== 0)
}

function comparePair(p1, p2) {
	let left, right
	if(typeof p1 === 'number' && typeof p2 !== 'number') {
		left = [p1]
		right = p2
	}
	else if(typeof p1 !== 'number' && typeof p2 === 'number') {
		left = p1
		right = [p2]
	}
	else {
		left = p1
		right = p2
	}
	let rightOrder = null
	let index = 0
	while(rightOrder == null && index < left.length) {
		if(index >= right.length) rightOrder = false
		else if(typeof left[index] !== 'number' || typeof right[index] !== 'number') {
			rightOrder = comparePair(left[index], right[index])
		} else if(left[index] === right[index]) {
			rightOrder = null
		} else {
		  rightOrder = left[index] < right[index]
		}
		index++
	}
	if(rightOrder === null && index === left.length && index < right.length) rightOrder = true
	return rightOrder
}

async function part1() {
	const pairs = await readInput()
	return pairs.reduce((memo, pair, index) => {
		if(comparePair(...pair)) memo += index + 1
		return memo
	}, 0)
}

async function part2() {
	const pairs = (await readInput()).flat()
	pairs.push([[2]])
	pairs.push([[6]])
	pairs.sort((p1, p2) => comparePair(p1, p2) ? -1 : 1)
	const startIndex = pairs.findIndex(p => p.length === 1 && p[0].length === 1 && p[0][0] === 2) + 1
	const endIndex = pairs.findIndex(p => p.length === 1 && p[0].length === 1 && p[0][0] === 6) + 1
	return startIndex * endIndex
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)
