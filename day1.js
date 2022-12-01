const fs = require('fs')

// Stream version
const stream = fs.createReadStream('./day1_input.txt', {encoding: 'utf8'})

const calByElf = []
let index = 0
stream.on('readable', () => {
	let data;
	while((data = stream.read()) !== null) {
		data.split('\n').forEach(line => {
		if(line === '') {
			++index
		} else {
			if(!calByElf[index]) calByElf[index] = 0
			calByElf[index] += parseInt(line, 10)
		}
		})
	}
})

stream.on('end', () => {
	console.warn(calByElf)
	console.log(calByElf.sort().slice(-3).reduce((memo, cal) => cal + memo, 0))
})

// In memory version
const Fs = require('fs/promises')

async function start() {
	const calByElf = []
	let index = 0
	const file = await Fs.readFile('AoC_input.txt', {encoding: 'utf8'})
	file.split('\n').forEach(line => {
	if(line === '') {
		++index
	} else {
		if(!calByElf[index]) calByElf[index] = 0
		calByElf[index] += parseInt(line, 10)
	}
	})
	console.log('promise', calByElf.sort().slice(-3).reduce((memo, cal) => cal + memo, 0))
}
start()
