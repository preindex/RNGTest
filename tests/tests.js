const chi2test = require('@stdlib/stats-chi2test');

export function repeat_test(data) { // Repeat Test
    // 10 sets data
    for (let i = 0; i < data.length; i++) {
    
    }
}

export function pvalue_test(data) { // Chi Square Test
    // 10 sets data
    let numbers = []
    for (let i = 0; i < data.length; i++) {
        let localSet = data[i];
        let Sets = []
        for (let i = 0; i < data.length; i++) {
            if (data[i] != localSet) {
                let Body = chi2test([localSet, data[i]])
                Sets.push({pValue: Body.pValue, stat: Body.statistic})
            }
        }
        numbers[i] = Sets
    }
    return numbers
}