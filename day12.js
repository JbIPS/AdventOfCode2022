const Fs = require('fs/promises')

async function readInput() {
	const input = await Fs.readFile('./day12_sample.txt', {encoding: 'utf8'})
	return input.split('\n')
		.filter(l => l !== '')
		.map((l, y) => l.split('').map((c, x) => ({height: c, distance: Number.MAX_VALUE, x, y})))
}

function getCell(x, y, grid) {
	if(y < 0 || y === grid.length || x < 0 || x === grid[y].length) return null
	return grid[y][x]
}

function locatePoint(query, grid) {
	let startX
	const startY = grid.findIndex(line => {
		const index = line.findIndex(alt => alt.height === query)
		if(index !== -1) startX = index
		return index !== -1
	})
	return {x: startX, y: startY}
}

function getNeighbours({x, y, height}, currentDistance, grid) {
	return [
		getCell(x-1, y, grid), 
		getCell(x+1, y, grid),
		getCell(x, y-1, grid),
		getCell(x, y+1, grid)
	]
	.filter(n => n != null)
	.filter(n => n.distance > currentDistance)
	.filter(n => n.height <= String.fromCharCode(height.charCodeAt(0) + 1))
}

function explore(start, numStep, target, grid) {
	console.log(`exploring ${start.height} at ${start.x};${start.y} with distance ${numStep}`)
	const neighbours = getNeighbours(start, numStep, grid)
	neighbours.forEach(n => n.distance = numStep + 1)
	if(neighbours.some(cell => cell.x === target.x && cell.y === target.y)) return 
	neighbours.forEach((cell) => explore(cell, numStep + 1, target, grid))
}

async function part1() {
	const grid = await readInput()
	const {x: startX, y: startY} = locatePoint('S', grid)
	const start = getCell(startX, startY, grid)
	start.height = 'a'
	start.distance = 0
	const end = locatePoint('E', grid)
	getCell(end.x, end.y, grid).height = 'z'
	explore(start, 0, end, grid)
	return getCell(end.x, end.y, grid).distance

}

async function part2() {
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)
