import { pseudoRandom } from './generators/pseudoRandom'

/*
    Chi Square Test
    In this case, the higher the pValue, the more random it is, but as it decreases it becomes less random.
*/

const chi2test = require('@stdlib/stats-chi2test')

const expected = [1, 2, 3, 4, 5]
const die = [pseudoRandom(10), pseudoRandom(10), pseudoRandom(10), pseudoRandom(10), pseudoRandom(10)]
const Test = chi2test([expected, die]).toJSON()

console.log({pValue: Test.pValue, statistic: Test.statistic})
console.log({Expected: expected})
console.log({Result: die})