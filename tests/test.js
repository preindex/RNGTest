const chi2test = require('@stdlib/stats-chi2test')
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
        let Value = v[2]

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