const chi2test = require('@stdlib/stats-chi2test')
const crypto = require('crypto')

function createHash(string) {
    return crypto.createHash('sha1').update(string).digest('hex')
}

export function pvalue_test(data, removeEmpty) { // Chi Square Test
    // 10 sets data
    let numbers = []
    let PossibleHashes = []
    for (let i = 0; i < data.length; i++) {
        let localSet = data[i];
        let Sets = []
        for (let i = 0; i < data.length; i++) {
            if (data[i] != localSet) {
                let localHash = createHash(localSet.toString())
                let currentHash = createHash(data[i].toString())
                if (PossibleHashes.includes(localHash + currentHash) || PossibleHashes.includes(currentHash + localHash)) {
                    // console.log(`Duplicate found of ${localHash} & ${currentHash}). They will not be recreated.`)
                    continue
                }
                // console.log(`Comparing ${localHash} & ${currentHash}`)
                let Body = chi2test([localSet, data[i]])
                Sets.push({pValue: Body.pValue, stat: Body.statistic, degrees: Body.df})
                PossibleHashes[PossibleHashes.length] = localHash + currentHash
            }
        }
        if (Sets.length <= 0 && removeEmpty) continue;
        numbers[i] = Sets
    }
    return numbers
}

export function kstest(data1, data2) {
    // Sort both arrays
    data1 = data1.sort((a, b) => a - b);
    data2 = data2.sort((a, b) => a - b);
    
    // Calculate empirical CDFs
    function empiricalCDF(data, x) {
        return data.filter(d => d <= x).length / data.length;
    }
    
    // Find maximum difference between CDFs
    let maxDiff = 0;
    let allPoints = [...new Set([...data1, ...data2])].sort((a, b) => a - b);
    
    for (let x of allPoints) {
        let cdf1 = empiricalCDF(data1, x);
        let cdf2 = empiricalCDF(data2, x);
        let diff = Math.abs(cdf1 - cdf2);
        maxDiff = Math.max(maxDiff, diff);
    }
    
    // Calculate critical value
    const n1 = data1.length;
    const n2 = data2.length;
    const alpha = 0.05;
    const criticalValue = Math.sqrt(-0.5 * Math.log(alpha)) * Math.sqrt((n1 + n2) / (n1 * n2));
    
    // Calculate p-value (approximate)
    const lambda = maxDiff * Math.sqrt((n1 * n2)/(n1 + n2));
    const pValue = Math.exp(-2 * lambda ** 2);
    
    return {
        statistic: maxDiff,
        pValue: pValue,
        criticalValue: criticalValue
    };
}

// export function runs_test(data) {
//     let results = [];
    
//     for (let array of data) {
//         // Calculate median
//         let sortedArray = [...array].sort((a, b) => a - b);
//         let median = sortedArray.length % 2 === 0 
//             ? (sortedArray[sortedArray.length/2 - 1] + sortedArray[sortedArray.length/2]) / 2
//             : sortedArray[Math.floor(sortedArray.length/2)];

//         // Convert to binary sequence based on median
//         let binarySequence = array.map(num => num > median ? 1 : 0);
        
//         // Count runs
//         let runs = 1;
//         for (let i = 1; i < binarySequence.length; i++) {
//             if (binarySequence[i] !== binarySequence[i-1]) {
//                 runs++;
//             }
//         }

//         // Count n1 and n2
//         let n1 = binarySequence.filter(x => x === 1).length;
//         let n2 = binarySequence.filter(x => x === 0).length;
        
//         // Calculate expected runs and standard deviation
//         let expectedRuns = ((2 * n1 * n2) / (n1 + n2)) + 1;
//         let standardDev = Math.sqrt((2 * n1 * n2 * (2 * n1 * n2 - n1 - n2)) / 
//                                   (Math.pow(n1 + n2, 2) * (n1 + n2 - 1)));

//         // Calculate Z-statistic
//         let zStat = (runs - expectedRuns) / standardDev;
        
//         // Calculate p-value
//         let pValue = 2 * (1 - normalCDF(Math.abs(zStat)));

//         results.push({
//             runs,
//             expectedRuns,
//             zStat,
//             pValue
//         });
//     }

//     // Calculate average results
//     let avgPValue = results.reduce((acc, r) => acc + r.pValue, 0) / results.length;
//     let avgZStat = results.reduce((acc, r) => acc + r.zStat, 0) / results.length;

//     return {
//         statistic: avgZStat,
//         pValue: avgPValue
//     };
// }

// // Helper function for normal CDF
// function normalCDF(z) {
//     let t = 1 / (1 + 0.2316419 * Math.abs(z));
//     let d = 0.3989423 * Math.exp(-z * z / 2);
//     let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
//     if (z > 0) {
//         prob = 1 - prob;
//     }
//     return prob;
// }

export function runs_test(data) {
    console.log(data.length)
    let results = [];
    
    for (let array of data) {
        // Sort and calculate median
        let sortedArray = [...array].sort((a, b) => a - b);
        let mid = Math.floor(sortedArray.length / 2);
        let median = sortedArray.length % 2 === 0 
            ? (sortedArray[mid - 1] + sortedArray[mid]) / 2.0
            : sortedArray[mid];

        // Convert to binary sequence based on median
        let binarySequence = array.map(num => num > median ? 1 : 0);
        
        // Count runs
        let runs = 1;
        for (let i = 1; i < binarySequence.length; i++) {
            if (binarySequence[i] !== binarySequence[i - 1]) {
                runs++;
            }
        }

        // Count n1 and n2 in one pass
        let n1 = 0, n2 = 0;
        binarySequence.forEach(num => num === 1 ? n1++ : n2++);
        
        // Calculate expected runs and standard deviation
        let expectedRuns = ((2 * n1 * n2) / (n1 + n2)) + 1;
        let standardDev = Math.sqrt((2 * n1 * n2 * (2 * n1 * n2 - n1 - n2)) / 
                                  (Math.pow(n1 + n2, 2) * (n1 + n2 - 1)));

        // Calculate Z-statistic
        let zStat = (runs - expectedRuns) / standardDev;
        
        // Calculate p-value
        let pValue = 2 * (1 - normalCDF(Math.abs(zStat)));

        results.push({
            runs,
            expectedRuns,
            zStat,
            pValue
        });
    }

    // Calculate average results
    let avgPValue = results.reduce((acc, r) => acc + r.pValue, 0) / results.length;
    let avgZStat = results.reduce((acc, r) => acc + r.zStat, 0) / results.length;

    return {
        statistic: avgZStat,
        pValue: avgPValue
    };
}

// More accurate normal CDF using erf approximation
function normalCDF(z) {
    return 0.5 * (1 + erf(z / Math.SQRT2));
}

// Error function approximation
function erf(x) {
    let a1 =  0.254829592, a2 = -0.284496736, a3 =  1.421413741;
    let a4 = -1.453152027, a5 =  1.061405429;
    let p  =  0.3275911;

    let sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    let t = 1 / (1 + p * x);
    let y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}