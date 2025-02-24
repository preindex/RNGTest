// im ford and i don t now how to spel l

/*
    Possible tests:
    Repeat Test
    Chi Square Test
    Kolmogorov-Smirnov Test
    Shapiro-Wilk Test
*/

import { weakRandom } from "../generators/weakRandom";
import { pseudoRandom } from "../generators/pseudoRandom";
import { trueRandom } from "../generators/trueRandom";
import { quantumRandom } from "../generators/quantumRandom";
import { quantumRandom2 } from "../generators/quantumRandom2";

const fs = require('fs')

let WroteData = false;

async function writeData() {
    try {
        WroteData = false;    
        let Name = `logs/${crypto.randomUUID()}.txt`;
        let weakArray = [];
        let pseudoArray = [];
        let trueArray = await trueRandom(1, 10, 10);;
        let quantumArray = await quantumRandom2(1, 10, 10) // await quantumRandom(1, 10, 10);
    
        console.log("Gathered the quantum data.")
        console.log("Gathered the true data.")

        for (let ford = 0; ford < 10; ford++) { // we got ford++ before GTA 6
            weakArray[weakArray.length] = weakRandom(1, 10)
            pseudoArray[pseudoArray.length] = pseudoRandom(1, 10)
        }
    
        let actualData = ["generator, trial number, number"] // this defines what the CSV file will look like
    
        for (let i = 0; i < 10; i++) {
            actualData[actualData.length] = `Weak, ${i + 1}, ${weakArray[i]}`
            actualData[actualData.length] = `Pseudo, ${i + 1}, ${pseudoArray[i]}`
            actualData[actualData.length] = `True, ${i + 1}, ${trueArray[i]}`
            actualData[actualData.length] = `Quantum, ${i + 1}, ${quantumArray[i]}`
        }
    
        fs.writeFileSync(Name, actualData.join("\n"))
        console.log(`Data successfully written to ${Name}`)
    
        WroteData = true;
    } catch(e) {}
}

// setInterval(async () => {
//     let self;self = setInterval(() => {
//         writeData()
//         if (WroteData) return clearInterval(self);
//     }, 5000);
// }, 120000);

let self;self = setInterval(() => {
    writeData()
    if (WroteData) return clearInterval(self);
}, 2000);

console.log("Starting...")
await writeData()