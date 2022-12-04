const fs = require("fs/promises");

async function startFirstPart() {
	const file = await fs.readFile("day4_input.txt", { encoding: "utf8" });
	let totalScore = 0;
	file.split("\n").forEach((line) => {
		const sections = line.split(",");
		const firstElfZones = sections[0].split("-");
		const secondElfZones = sections[1].split("-");
		if (
			(parseInt(firstElfZones[0]) >= parseInt(secondElfZones[0]) &&
				parseInt(firstElfZones[1]) <= parseInt(secondElfZones[1])) ||
			(parseInt(firstElfZones[0]) <= parseInt(secondElfZones[0]) &&
				parseInt(firstElfZones[1]) >= parseInt(secondElfZones[1]))
		) {
			totalScore++;
		}
	});
	console.log(totalScore);
}
startFirstPart();

async function startSecondPart() {
	const file = await fs.readFile("day4_input.txt", { encoding: "utf8" });
	let totalScore = 0;
	file.split("\n").forEach((line) => {
		const sections = line.split(",");
		const firstElfZones = sections[0].split("-");
		const secondElfZones = sections[1].split("-");
		if (
			(parseInt(firstElfZones[0]) >= parseInt(secondElfZones[0]) &&
				parseInt(firstElfZones[0]) <= parseInt(secondElfZones[1])) ||
			(parseInt(secondElfZones[0]) >= parseInt(firstElfZones[0]) &&
				parseInt(secondElfZones[0]) <= parseInt(firstElfZones[1]))
		) {
			totalScore++;
		}
	});
	console.log(totalScore);
}
startSecondPart();
