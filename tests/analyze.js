import {pvalue_test, kstest, runs_test} from '../modules/tests'
import { generateRNGCharts } from '../modules/generateCharts';
import fs from 'fs';

let weakArrays = [];
let pseudoArrays = [];
let trueArrays = [];
let quantumArrays = [];

let distributions = {
    "Weak": [],
    "Pseudo": [],
    "True": [],
    "Quantum": []
};

let results = [];

let c = 0;
let old = console.log;
let file = [];
let log = (string) => {
    file.push(string);
    old(string);
}
console.log = function() {}
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

        distributions[Generator].push(Value); // Store for histogram

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

    if (results.length == 98) {
        console.log = log
        getData();
        console.log = old
        return
    }
    getData();
})

console.log = old

function getData() {
    let ksResults = [
        getKSTestResults(weakArrays, "Weak Generator"),
        getKSTestResults(pseudoArrays, "Pseudo Generator"),
        getKSTestResults(trueArrays, "True Generator"),
        getKSTestResults(quantumArrays, "Quantum Generator")
    ];
    
    let chiResults = [
        getAverage(weakArrays, "Weak Generator"),
        getAverage(pseudoArrays, "Pseudo Generator"),
        getAverage(trueArrays, "True Generator"),
        getAverage(quantumArrays, "Quantum Generator")
    ];
    
    // Add runs test results
    let runsResults = [
        runs_test(weakArrays),
        runs_test(pseudoArrays),
        runs_test(trueArrays),
        runs_test(quantumArrays)
    ];

    results[results.length] = [ksResults, chiResults, runsResults]
}


function generateCSVs() {
    convertResultsToCSV(results);
}

function convertResultsToCSV(results) {
    const fs = require('fs');
    const headers = {
        kstest: {
            pvalue: "Trial Index,Average P-Value,Generator\n",
            statistic: "Trial Index,Average Statistic,Generator\n"
        },
        chi: {
            pvalue: "Trial Index,Average P-Value,Generator\n",
            statistic: "Trial Index,Average Statistic,Generator\n"
        },
        run: {
            zstat: "Trial Index,Z-Statistic,Generator\n",
            pvalue: "Trial Index,P-Value,Generator\n"
        }
    };

    const data = {
        kstest: { pvalue: {}, statistic: {} },
        chi: { pvalue: {}, statistic: {} },
        run: { zstat: {}, pvalue: {} }
    };

    // Initialize data structure
    ['Weak', 'Pseudo', 'True', 'Quantum'].forEach(gen => {
        data.kstest.pvalue[gen] = [];
        data.kstest.statistic[gen] = [];
        data.chi.pvalue[gen] = [];
        data.chi.statistic[gen] = [];
        data.run.zstat[gen] = [];
        data.run.pvalue[gen] = [];
    });

    // Group data by generator
    results.forEach(([ksResults, chiResults, runsResults], trialIndex) => {
        ksResults.forEach(([pValue, statistic, generator]) => {
            const gen = generator.split(' ')[0];
            data.kstest.pvalue[gen].push(`${trialIndex},${pValue},${generator}`);
            data.kstest.statistic[gen].push(`${trialIndex},${statistic},${generator}`);
        });

        chiResults.forEach(([pValue, statistic, generator]) => {
            const gen = generator.split(' ')[0];
            data.chi.pvalue[gen].push(`${trialIndex},${pValue},${generator}`);
            data.chi.statistic[gen].push(`${trialIndex},${statistic},${generator}`);
        });

        runsResults.forEach((result, index) => {
            const generators = ["Weak", "Pseudo", "True", "Quantum"];
            const gen = generators[index];
            data.run.zstat[gen].push(`${trialIndex},${result.statistic},${gen}`);
            data.run.pvalue[gen].push(`${trialIndex},${result.pValue},${gen}`);
        });
    });

    // Write grouped data to files
    for (const [testType, metrics] of Object.entries(data)) {
        for (const [metricType, generatorData] of Object.entries(metrics)) {
            const allLines = Object.values(generatorData).flat();
            fs.writeFileSync(
                `results/${testType}_${metricType}_results.csv`, 
                headers[testType][metricType] + allLines.join('\n')
            );
        }
    }
}


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

function getKSTestResults(dataset, generator) {
    let results = [];
    
    // Compare each array with every other array
    for (let i = 0; i < dataset.length; i++) {
        for (let j = i + 1; j < dataset.length; j++) {
            // Create deep copies to prevent mutation
            let copyI = [...dataset[i]]; // or JSON.parse(JSON.stringify(dataset[i])) for nested arrays
            let copyJ = [...dataset[j]];

            let result = kstest(copyI, copyJ);
            results.push(result);
        }
    }
    
    // Calculate averages
    let avgStatistic = results.reduce((acc, r) => acc + r.statistic, 0) / results.length;
    let avgPValue = results.reduce((acc, r) => acc + r.pValue, 0) / results.length;
    
    console.log(`KS-Test Results for ${generator}:`);
    console.log(`Average Statistic: ${avgStatistic}`);
    console.log(`Average P-Value: ${avgPValue}`);
    console.log('-'.repeat(25));
    
    return [avgPValue, avgStatistic, generator];
}



let [ksResults, Ranking, runsResults] = results[results.length - 1]

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

await generateRNGCharts(Ranking, distributions);

log(`--------------------------------`)

log('Runs Test Results:');
log('-'.repeat(25));
runsResults.forEach((result, index) => {
    const generators = ["Weak", "Pseudo", "True", "Quantum"];
    log(`${generators[index]} Generator:`);
    log(`Z-Statistic: ${result.statistic}`);
    log(`P-Value: ${result.pValue}`);
    log(`Runs: ${result.runs}`);
    log(`Expected Runs: ${result.expectedRuns}`);
    log('-'.repeat(25));
});

log('-'.repeat(25));

log('KTest Results')
for (let Array of ksResults) {
    log(`  --> ${Array[2]} (p-value: ${Array[0]}, statistic: ${Array[1]})`)
}

log(`--------------------------------`)
log(`Ranking (from most random to least)`)

{    
    let Index = 1
    for (let Array of Ranking) {
        log("   --> " + Array[2] + ` (#${Index++}) [${Array[0] > 16.92 ? "Large (reject null)" : "Small (accept null)"}]`) // 16.92 is the critical value for DoF of 9 and alpha of 0.05
    }
}

log(`--------------------------------`)

fs.writeFileSync('results/results.txt', file.join('\n'));
generateCSVs();
fs.writeFileSync('results/data.json', JSON.stringify(results));
require('./graph.js')

// true and CSRNG fight over 2nd place
