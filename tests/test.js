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

    Arrays.forEach((Array) => {
        let LocalAveragePValue = 0
        let LocalAverageStatistic = 0
        for (let i = 0; i < Array.length; i++) {
            let { pValue, stat } = Array[i]
            LocalAveragePValue += pValue
            LocalAverageStatistic += stat
        }
        LocalAveragePValue /= Array.length
        LocalAverageStatistic /= Array.length
        if (revealLocal) {
            console.log(`Local Average P-Value for ${generator} #${LocalAverage.length} Data: ${LocalAveragePValue}`)
            console.log(`Local Average Statistic for ${generator} #${LocalAverage.length} Data: ${LocalAveragePValue}`)
        }
        localAverages[localAverages.length] = [LocalAveragePValue, LocalAverageStatistic]
    })

    let AveragePValue = 0
    let AverageStatistic = 0

    localAverages.forEach(value => {
        AveragePValue += value[0]
        AverageStatistic += value[1]
    })
    
    AveragePValue /= localAverages.length
    AverageStatistic /= localAverages.length
    
    console.log(`True Average P-Value Across All ${generator} Data: ${AveragePValue}`)
    console.log(`True Average Statistic Across All ${generator} Data: ${AverageStatistic}`)
    console.log(('-').repeat(25))
}

getAverage(weakArrays, "Weak Generator")
getAverage(pseudoArrays, "Pseudo Generator")
getAverage(trueArrays, "True Generator")
getAverage(quantumArrays, "Quantum Generator")

function frequencyTest(dataset) {
    
}