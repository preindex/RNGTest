// im ford and i don t now how to spel l

/*
    Possible tests:
    Repeat Test
    Chi Square Test
    Kolmogorov-Smirnov Test
    Anderson-Darling Test
    Shapiro-Wilk Test
    Jarque-Bera Test
    Lilliefors Test
    Lévy-Skewness Test
    Lévy-Kurtosis Test
    Jarque-Bera Test for Normality
    Jarque-Bera Test for Student's t Distribution
    Jarque-Bera Test for Exponential Distribution
    Jarque-Bera Test for Chi-Square Distribution
    Jarque-Bera Test for Uniform Distribution
    Jarque-Bera Test for Logistic Distribution
*/

import { weakRandom } from "./generators/weakRandom";
import { pseudoRandom } from "./generators/pseudoRandom";
import { trueRandom } from "./generators/trueRandom";
import { quantumRandom } from "./generators/quantumRandom";

async function writeData() {
    let Name = `${crypto.randomUUID()}.txt` // Ironically, I'm using the crypto library to generate a (random) UUID
    let weakArray = []
    let pseudoArray = []
    let trueArray = []
    let quantumArray = await quantumRandom(1, 10, 10)
    
    (await trueRandom(1, 10, 10)).split('\n').forEach((value, index) => {
        if (index == 10) return;
        trueArray[index] = parseInt(value)
    })    
    
    for (let i = 0; i < 10; i++) {
        weakArray[weakArray.length] = weakRandom(1, 10)
        pseudoArray[pseudoArray.length] = pseudoRandom(1, 10) 
    }

    let actualData = ["trial_num, generator, number"] // lets COOK. put al the data into one table

    for (let i = 0; i < 10; i++) {
        actualData.push(`${i+1}, weak, ${weakArray[i]}`)
        actualData.push(`${i+1}, pseudo, ${pseudoArray[i]}`)
        actualData.push(`${i+1}, true, ${trueArray[i]}`)
        actualData.push(`${i+1}, quantum, ${quantumArray[i]}`)
    }

    fs.writeFileSync(Name, actualData.join('\n'))
    console.log(`Data saved as ${Name}`)
}

await writeData()
// setInterval(writeData, 3600);