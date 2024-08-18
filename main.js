// im ford and i don t now how to spel l

/*
    Possible tests:
    Repeat Test
    Chi Square Test
    Kolmogorov-Smirnov Test
    Shapiro-Wilk Test
*/

import { weakRandom } from "./generators/weakRandom";
import { pseudoRandom } from "./generators/pseudoRandom";
import { trueRandom } from "./generators/trueRandom";
import { quantumRandom } from "./generators/quantumRandom";

const fs = require('fs')

async function writeData() {
    let Name = `logs/${crypto.randomUUID()}.txt`;
    let weakArray = [];
    let pseudoArray = [];
    let trueArray = [];
    let quantumArray = await quantumRandom(1, 10, 10);

    (await trueRandom(1, 10, 10)).split('\n').forEach((value, index) => {
        if (index == 10) return;
        trueArray[index] = parseInt(value)
    })

    for (let ford = 0; ford < 10; ford++) { // we got ford++ before GTA 6
        weakArray[weakArray.length] = weakRandom(1, 10)
        pseudoArray[pseudoArray.length] = pseudoRandom(1, 10)
    }

    let actualData = ["trial_num, generator, number"] // this defines what the CSV file will look like

    for (let i = 0; i < 10; i++) {
        actualData[actualData.length] = `${i + 1}, Weak Random, ${weakArray[i]}`
        actualData[actualData.length] = `${i + 1}, Pseudo Random, ${pseudoArray[i]}`
        actualData[actualData.length] = `${i + 1}, True Random, ${trueArray[i]}`
        actualData[actualData.length] = `${i + 1}, Quantum Random, ${quantumArray[i]}`
    }

    fs.writeFileSync(Name, actualData.join("\n"))
    console.log(`Data successfully written to ${Name}`)
}

setInterval(async () => {
    await writeData()
}, 62000);