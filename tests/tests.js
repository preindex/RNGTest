import { create } from 'domain';

const chi2test = require('@stdlib/stats-chi2test');
const crypto = require('crypto')

function createHash(string) {
    return crypto.createHash('sha1').update(string).digest('hex')
}


export function repeat_test(data) { // Repeat Test
    // 10 sets data
    for (let i = 0; i < data.length; i++) {
    
    }
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