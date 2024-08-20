import { repeat_test, pvalue_test } from './tests';

const fs = require('fs')

let weakArrays = [];
let pseudoArrays = [];
let trueArrays = [];
let quantumArrays = [];

fs.readdirSync('./logs').forEach(file => {
    let Data = fs.readFileSync(`./logs/${file}`, 'utf8').split('\n').splice(1)
    
    let weakArray = [];
    let pseudoArray = [];
    let trueArray = [];
    let quantumArray = [];

    for (let i = 0; i < Data.length; i++) {
        let v = Data[i].split(', ')
        let Generator = v[0]
        let Value = parseInt(v[2])

        switch(Generator) {
            case "Weak":
                weakArray[weakArray.length] = Value
                break;
                
            case "Pseudo":
                pseudoArray[pseudoArray.length] = Value
                break;
                
            case "True":
                trueArray[trueArray.length] = Value
                break;
                
            case "Quantum":
                quantumArray[quantumArray.length] = Value
                break;
        }   
    }
    weakArrays[weakArrays.length] = weakArray
    pseudoArrays[pseudoArrays.length] = pseudoArray
    trueArrays[trueArrays.length] = trueArray
    quantumArrays[quantumArrays.length] = quantumArray
})

function getAverage(dataset, generator, revealLocal) {
    let Arrays = pvalue_test(dataset, true)
    let localAverages = []

    let ArrayIndex = 0

    Arrays.forEach((Array) => {
        let LocalDegrees = 0
        let LocalAveragePValue = 0
        let LocalAverageStatistic = 0
        for (let i = 0; i < Array.length; i++) {
            let { pValue, stat, degrees } = Array[i]
            LocalAveragePValue += pValue
            LocalAverageStatistic += stat
            LocalDegrees += degrees
        }
        LocalDegrees /= Array.length
        LocalAveragePValue /= Array.length
        LocalAverageStatistic /= Array.length
        if (revealLocal) {
            console.log(`Local Average Degrees for ${generator} #${ArrayIndex} Data: ${LocalDegrees}`)
            console.log(`Local Average P-Value for ${generator} #${++ArrayIndex} Data: ${LocalAveragePValue}`)
            console.log(`Local Average Statistic for ${generator} #${ArrayIndex} Data: ${LocalAverageStatistic}`)
        }
        localAverages[localAverages.length] = [LocalAveragePValue, LocalAverageStatistic, LocalDegrees]
    })

    let AveragePValue = 0
    let AverageStatistic = 0
    let AverageDegrees = 0
    
    localAverages.forEach(value => {
        AveragePValue += value[0]
        AverageStatistic += value[1]
        AverageDegrees += value[2]
    })
    
    AverageDegrees /= localAverages.length
    AveragePValue /= localAverages.length
    AverageStatistic /= localAverages.length
    
    console.log(`True Average P-Value Across All ${generator} Data: ${AveragePValue}`)
    console.log(`True Average Degree Across All ${generator} Data: ${AverageDegrees}`)   
    console.log(`True Average Statistic Across All ${generator} Data: ${AverageStatistic}`)
    console.log(('-').repeat(25))

    return [AveragePValue, AverageStatistic, generator]
}

let Ranking =  []
Ranking[Ranking.length] = getAverage(weakArrays, "Weak Generator")
Ranking[Ranking.length] = getAverage(pseudoArrays, "Pseudo Generator")
Ranking[Ranking.length] = getAverage(trueArrays, "True Generator")
Ranking[Ranking.length] = getAverage(quantumArrays, "Quantum Generator")

Ranking.sort((a, b) => {
    // 0 = Average P-Value
    // 1 = Average Statistic
    // 2 = Generator Name
    // First, compare by p-value (element[0])
    if (a[0] !== b[0]) {
        return a[0] - b[0]; // Ascending order for p-value
    }
    // If p-values are the same, compare by statistic (element[1])
    return b[1] - a[1]; // Descending order for statistic
});

console.log(`Ranking (from most random to least)`)

{    
    let Index = 1
    for (let Array of Ranking) {
        console.log("   --> " + Array[2] + ` (#${Index++}) [${Array[0] > 16.92 ? "Large (reject null)" : "Small (accept null)"}]`) // 16.92 is the critical value for DoF of 9 and alpha of 0.05
    }
}

console.log(`--------------------------------\nshoutout to miguel he's my goat fr`)