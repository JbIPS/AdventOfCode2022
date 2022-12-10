const fs = require("fs/promises");

async function start() {
	const file = await fs.readFile("day10_input.txt", { encoding: "utf8" });
	let cycleNumber = 0;
	let register = 1;

	let strengthSum = 0;

	const checkCycle = () => {
		cycleNumber++;
		if (
			cycleNumber === 20 ||
			cycleNumber === 60 ||
			cycleNumber === 100 ||
			cycleNumber === 140 ||
			cycleNumber === 180 ||
			cycleNumber === 220
		) {
			strengthSum += cycleNumber * register;
		}
	};

	file.split("\n").forEach((command) => {
		if (command === "noop") {
			checkCycle();
		} else {
			const value = parseInt(command.split(" ")[1]);
			checkCycle();
			checkCycle();

			register += value;
		}
	});

	let renderSprite = "";
	let spritePosition = 2;
	let secondCycle = 0;

	const checkSprite = () => {
		secondCycle++;

		if (Math.abs((secondCycle % 40) - spritePosition) <= 1) {
			renderSprite += "#";
		} else {
			renderSprite += " ";
		}
		if (secondCycle % 40 === 0) {
			renderSprite += "\n";
		}
	};

	file.split("\n").forEach((command) => {
		if (command === "noop") {
			checkSprite();
		} else {
			const value = parseInt(command.split(" ")[1]);
			checkSprite();
			checkSprite();

			spritePosition += value;
		}
	});

	console.log(strengthSum);
	console.log(renderSprite);
}
start();
