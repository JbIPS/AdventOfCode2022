const fs = require("fs/promises");

async function startFirstPart() {
	const file = await fs.readFile("day5_input.txt", { encoding: "utf8" });
	const stacks = [[], [], [], [], [], [], [], [], []];
	file
		.split("\n")
		.slice(0, 9)
		.reverse()
		.forEach((line) => {
			line.split("").forEach((char, index) => {
				let realIndex = Math.floor(index / 4);
				if (char.match(/[A-Z]/)) {
					stacks[realIndex].push(char);
				}
			});
		});
	const moves = file
		.split("\n")
		.slice(10, file.length)
		.map((line) => {
			const splitedLine = line.split(" ");
			return [
				parseInt(splitedLine[1]),
				parseInt(splitedLine[3]),
				parseInt(splitedLine[5]),
			];
		});

	moves.forEach((move) => {
		for (let i = 0; i < move[0]; i++) {
			const to = stacks[move[2] - 1];
			const from = stacks[move[1] - 1];
			to.push(from[from.length - 1]);
			from.pop();
		}
	});

	let finalResult = "";

	stacks.forEach((stack) => {
		finalResult += stack[stack.length - 1];
	});
	console.log(finalResult);
}
startFirstPart();

// async function startSecondPart() {
// 	const file = await fs.readFile("day4_input.txt", { encoding: "utf8" });
// 	file.split("\n").forEach((line) => {
// 	});
// }
// startSecondPart();
