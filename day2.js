const fs = require("fs/promises");
const { deflateRaw } = require("zlib");

async function startFirstPart() {
	const file = await fs.readFile("day2_input.txt", { encoding: "utf8" });
	let totalScore = 0;
	file.split("\n").forEach((line) => {
		const values = {
			X: 1,
			Y: 2,
			Z: 3,
			A: 1,
			B: 2,
			C: 3,
		};
		const splitedLine = line.split(" ");
		const theirValue = values[splitedLine[0]];
		const ourValue = values[splitedLine[1]];
		totalScore += ourValue;

		const result = ourValue - theirValue;

		if (result === -2 || result === 1) {
			totalScore += 6;
		} else if (result === 0) {
			totalScore += 3;
		}
	});
	console.log(totalScore);
}
startFirstPart();

// The Elf finishes helping with the tent and sneaks back over to you. "Anyway, the second column says how the round needs to end: X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win. Good luck!"

// The total score is still calculated in the same way, but now you need to figure out what shape to choose so the round ends as indicated. The example above now goes like this:

// In the first round, your opponent will choose Rock (A), and you need the round to end in a draw (Y), so you also choose Rock. This gives you a score of 1 + 3 = 4.
// In the second round, your opponent will choose Paper (B), and you choose Rock so you lose (X) with a score of 1 + 0 = 1.
// In the third round, you will defeat your opponent's Scissors with Rock for a score of 1 + 6 = 7.
// Now that you're correctly decrypting the ultra top secret strategy guide, you would get a total score of 12.

// Following the Elf's instructions for the second column, what would your total score be if everything goes exactly according to your strategy guide?

async function startSecondPart() {
	const file = await fs.readFile("day2_input.txt", { encoding: "utf8" });
	let totalScore = 0;
	file.split("\n").forEach((line) => {
		const situation = {
			X: "lose",
			Y: "draw",
			Z: "win",
		};
		const values = {
			A: 1,
			B: 2,
			C: 3,
		};

		const splitedLine = line.split(" ");
		const theirValue = values[splitedLine[0]];
		const situationResult = situation[splitedLine[1]];

		if (situationResult === "draw") {
			totalScore += 3 + theirValue;
		}

		if (situationResult === "win") {
			let ourValue = 1;
			if (theirValue === 2) {
				ourValue += 2;
			}
			if (theirValue === 1) {
				ourValue += 1;
			}
			totalScore += 6 + ourValue;
		}

		if (situationResult === "lose") {
			let ourValue = 1;
			if (theirValue === 1) {
				ourValue += 2;
			}
			if (theirValue === 3) {
				ourValue += 1;
			}
			totalScore += ourValue;
		}
	});
	console.log(totalScore);
}
startSecondPart();
