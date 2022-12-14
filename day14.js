import ansiEscapes from 'ansi-escapes'
import chalk from 'chalk'
import Fs from 'fs/promises'
import { setTimeout } from 'timers/promises'

const SAND_START = {x: 500, y: 0}

async function readInput() {
	const input = await Fs.readFile('./day14_input.txt', {encoding: 'utf8'})
	const walls = input.split('\n')
	.filter(l => l !== '')
	.map(l => l.split(' -> ').map(coord => {
		const [x, y] = coord.split(',').map(p => parseInt(p, 10))
		return {x, y}
	}))
	
	let limits = walls.reduce((memo, wall) => {
		return wall.reduce((m, coord) => {
			if(coord.x > m.max.x) m.max.x = coord.x
			if(coord.x < m.min.x) m.min.x = coord.x
			if(coord.y > m.max.y) m.max.y = coord.y
			if(coord.y < m.min.y) m.min.y = coord.y
			return m
		}, memo)
	}, {max: Object.assign({}, SAND_START), min: Object.assign({}, SAND_START)})
	const map = new Array(limits.max.y + 1)
	for(let i = 0; i < map.length; i++) { 
		map[i] = new Array(limits.max.x + 1)
	}
	walls.forEach(wall => generateWall(wall, map))
	await drawMap(map, limits)

	return [map, limits]
}

async function drawMap(map, limits) {
	process.stdout.write(ansiEscapes.eraseLines(map.length + 1))
	for(let y = limits.min.y; y < map.length; y++) {
		process.stdout.write(`${y} `)
		for(let x = limits.min.x; x < map[y].length; x++) {
			if(x === SAND_START.x && y === SAND_START.y) process.stdout.write(chalk.bgYellowBright('+'))
			else if(map[y][x] === 1) process.stdout.write(chalk.bgRed('#'))
			else if(map[y][x] === 2) process.stdout.write(chalk.yellow('o'))
			else process.stdout.write('.')
		}
		process.stdout.write('\n')
	}
	await setTimeout(50)
}

function generateWall(wall, map) {
	wall.forEach((side, index, array) => {
		map[side.y][side.x] = 1
		const next = index !== array.length - 1 ? array[index + 1] : null
		if(!next) return

		if(side.x === next.x) {
			if(side.y < next.y) {
				for(let y = side.y + 1; y < next.y; y++) {
					map[y][side.x] = 1
				}
			} else {
				for(let y = side.y - 1; y > next.y; y--) {
					map[y][side.x] = 1
				}
			}
		}
		else if(side.y === next.y) {
			if(side.x < next.x) {
				for(let x = side.x + 1; x < next.x; x++) {
					map[side.y][x] = 1
				}
			} else {
				for(let x = side.x - 1; x > next.x; x--) {
					map[side.y][x] = 1
				}
			}
		}
	})
}

function updateSandPosition(current, yDiff, xDiff, map) {
	map[current.y][current.x] = 0
	current.y += yDiff
	current.x += xDiff
	map[current.y][current.x] = 2
}

function isFree(cell) {
	return cell !== 1 && cell !== 2
}

async function part1() {
	const [map, limits] = await readInput()
	let fallsInVoid = false
	let unitsOfSand = 0
	while(!fallsInVoid) {
		let currentSand = Object.assign({}, SAND_START)
		unitsOfSand++
		let stopped = false
		while(!stopped) {
			if(currentSand.y + 1 === map.length) {
				unitsOfSand--
				fallsInVoid = true
				stopped = true
			} else if(isFree(map[currentSand.y+1][currentSand.x])) {
				updateSandPosition(currentSand, 1, 0, map)
			} else if(isFree(map[currentSand.y+1][currentSand.x - 1])) {
				updateSandPosition(currentSand, 1, -1, map)
			} else if(isFree(map[currentSand.y+1][currentSand.x + 1])) {
				updateSandPosition(currentSand, 1, 1, map)
			} else stopped = true
			//await drawMap(map, limits)
		}
	}
	return unitsOfSand
}

async function part2() {
	const [map, limits] = await readInput()
	const floor = new Array(2)
	floor[0] = new Array(map[0].length)
	floor[1] = new Array(map[0].length).fill(1)
	const mapWithFloor = map.concat(floor)
	let sourceBlocked = false
	let unitsOfSand = 0
	while(!sourceBlocked) {
		let currentSand = Object.assign({}, SAND_START)
		unitsOfSand++
		let stopped = false
		while(!stopped) {
			if(currentSand.y + 2 === mapWithFloor.length) stopped = true
			else if(isFree(mapWithFloor[currentSand.y+1][currentSand.x])) {
				updateSandPosition(currentSand, 1, 0, mapWithFloor)
			} else if(isFree(mapWithFloor[currentSand.y+1][currentSand.x - 1])) {
				updateSandPosition(currentSand, 1, -1, mapWithFloor)
			} else if(isFree(mapWithFloor[currentSand.y+1][currentSand.x + 1])) {
				updateSandPosition(currentSand, 1, 1, mapWithFloor)
			} else stopped = true
			//await drawMap(mapWithFloor, limits)
		}
		if(stopped && currentSand.x === SAND_START.x && currentSand.y === SAND_START.y)
			sourceBlocked = true
	}
	return unitsOfSand
}

part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)
