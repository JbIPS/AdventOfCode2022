const fs = require("fs/promises");

const addCharCodeVal = (value) => {
	return value > 96 ? value - 96 : value - 38;
};

async function startFirstPart() {
	const file = await fs.readFile("day3_input.txt", { encoding: "utf8" });
	let totalScore = 0;
	file.split("\n").forEach((line) => {
		const firstCompartment = line.slice(0, line.length / 2);
		const secondCompartment = line.slice(line.length / 2, line.length);
		let commonLetter = "";
		firstCompartment.split("").forEach((letter) => {
			if (secondCompartment.includes(letter)) {
				commonLetter += letter;
			}
		});
		const charCodeVal = commonLetter.charCodeAt(0);
		totalScore += addCharCodeVal(charCodeVal);
	});
	console.log(totalScore);
}
startFirstPart();

async function startSecondPart() {
	const file = await fs.readFile("day3_input.txt", { encoding: "utf8" });
	let totalScore = 0;
	const groupArray = [];
	file.split("\n").forEach((line) => {
		if (groupArray.length === 3) {
			let commonLetter = "";
			groupArray[0].split("").forEach((letter) => {
				if (groupArray[1].includes(letter) && groupArray[2].includes(letter)) {
					commonLetter += letter;
				}
			});
			const charCodeVal = commonLetter.charCodeAt(0);
			totalScore += addCharCodeVal(charCodeVal);
			groupArray.length = 0;
		}
		groupArray.push(line);
	});
	console.log(totalScore);
}
startSecondPart();
