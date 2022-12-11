const termination = require('termination')
const Fs = require('fs/promises')

async function readInput() {
	const input = await Fs.readFile('./day9_input.txt', {encoding: 'utf8'})
	return input.split('\n').filter(line => line !== '').map(line => {
		const [direction, mp] = line.split(' ')
		return {
			direction,
			mp
		}
	})
}

function updateTailPosition(tailPosition, headPosition) {
	if(Math.abs(tailPosition.x - headPosition.x) <= 1) {
		if( Math.abs(tailPosition.y - headPosition.y) <= 1) return
		tailPosition.y += tailPosition.y < headPosition.y ? 1 : -1
		if(tailPosition.x - headPosition.x !== 0) {
			tailPosition.x += tailPosition.x < headPosition.x ? 1 : -1
		}
	} else {
		if(tailPosition.y - headPosition.y !== 0) {
			tailPosition.y += tailPosition.y < headPosition.y ? 1 : -1
		} 
		tailPosition.x += tailPosition.x < headPosition.x ? 1 : -1
	}
}

async function part1() {
	const inputs = await readInput()
	let max = {x: 0, y: 0}
	let min = {x: 200, y: 200}
	const tailPosition = {x: 0, y: 0}
	const headPosition = {x: 0, y: 0}
	const visitedPosition = []
	for(let mvmt of inputs) {
		while(mvmt.mp > 0) {
			switch(mvmt.direction) {
				case 'U': ++headPosition.y
					break
				case 'D': --headPosition.y
					break
				case 'R': ++headPosition.x
					break
				case 'L': --headPosition.x
					break
			}
			min.x = min.x > headPosition.x ? headPosition.x : min.x
			min.y = min.y > headPosition.y ? headPosition.y : min.y
			max.x = max.x < headPosition.x ? headPosition.x : max.x
			max.y = max.y < headPosition.y ? headPosition.y : max.y
			updateTailPosition(tailPosition, headPosition)
			if(!visitedPosition.some(pos => pos.x === tailPosition.x && pos.y === tailPosition.y)) visitedPosition.push(Object.assign({}, tailPosition))
			--mvmt.mp
		}
	}
	console.log(min, max)
	return visitedPosition.length
}

async function part2() {
	const inputs = await readInput()
	const headPosition = {x: 0, y: 0}
	const knots = []
	for(let i = 0; i < 9; i++) {
		knots[i] = {x: 0, y: 0}
	}
	const visitedPosition = []
	for(let mvmt of inputs) {
		while(mvmt.mp > 0) {
			switch(mvmt.direction) {
				case 'U': ++headPosition.y
					break
				case 'D': --headPosition.y
					break
				case 'R': ++headPosition.x
					break
				case 'L': --headPosition.x
					break
			}
			knots.forEach((knot, index, knots) => {
				updateTailPosition(knot, index === 0 ? headPosition : knots[index - 1])
				if(index === knots.length - 1 && !visitedPosition.some(pos => pos.x === knot.x && pos.y === knot.y)) visitedPosition.push(Object.assign({}, knot))
			})
			--mvmt.mp
		}
	}
	return visitedPosition.length
}

/*part1()
.then(solution => console.log('part1', solution))
.then(() => part2())
.then((solution) => console.log('part2', solution))
.catch(console.error)*/

function createFrame(grid) {
	return grid.slice().reverse().map(line => line.join('')).join('\n')
}

async function startAnim() {
	const maxCoord = {x: 377, y: 44}
	const offset = {x: 25, y: 222}
	const inputs = await readInput()
	const grid = new Array(maxCoord.y + offset.y + 1)
	for (let i = 0; i < grid.length; i++) {
		grid[i] = new Array(maxCoord.x + offset.x + 1).fill('.')
	}
	const headPosition = {x: 0, y: 0}
	grid[headPosition.y + offset.y][headPosition.x + offset.x] = 'H'
	const frames = [createFrame(grid)]
	grid[headPosition.y + offset.y][headPosition.x + offset.x] = '.'
	const animation = new termination.Animation({
		fps: 60,
		maxSize: {
			width: maxCoord.x + offset.x,
			height: maxCoord.y + offset.y
		}
	})
	const rope = animation.add({
		x: 0,
		y: 0,
		content: frames[0],
		replaceSpace: true,
		color: 'yellow'
	})
	const knots = []
	for(let i = 0; i < 9; i++) {
		knots[i] = {x: 0, y: 0}
	}
	for(let mvmt of inputs) {
		while(mvmt.mp > 0) {
			switch(mvmt.direction) {
				case 'U': ++headPosition.y
					break
				case 'D': --headPosition.y
					break
				case 'R': ++headPosition.x
					break
				case 'L': --headPosition.x
					break
			}
			knots.forEach((knot, index, knots) => {
				updateTailPosition(knot, index === 0 ? headPosition : knots[index - 1])
			})
			knots.slice().reverse().forEach((knot, index) => {
				grid[knot.y + offset.y][knot.x + offset.x] = `${index + 1}`
			})
			grid[headPosition.y + offset.y][headPosition.x + offset.x] = 'H'

			// Save frame
			frames.push(createFrame(grid))
			
			// reset grid
			knots.forEach((knot) => {
				grid[knot.y + offset.y][knot.x + offset.x] = '.'
			})
			grid[headPosition.y + offset.y][headPosition.x + offset.x] = '.'
			--mvmt.mp
		}
	}
	const ropeTransition = rope.transition(frames.map(frame => ({props: {content: frame}, duration: 150})), {loop: true, loopInterval: 300})
	animation.start()
	ropeTransition.run()
}
startAnim()
