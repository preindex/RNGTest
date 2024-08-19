import { create } from 'domain'
import { pseudoRandom } from './generators/pseudoRandom'

const crypto = require('crypto')

/*
    Chi Square Test
    In this case, the higher the pValue, the more random it is, but as it decreases it becomes less random.
*/

const chi2test = require('@stdlib/stats-chi2test')

const die = [1, 2, 3, 4, 5]
const expected = [5, 4, 3, 2, 1]
// const die = [pseudoRandom(10), pseudoRandom(10), pseudoRandom(10), pseudoRandom(10), pseudoRandom(10)]
const Test = chi2test([expected, die]).toJSON()

// console.log({pValue: Test.pValue, statistic: Test.statistic})
// console.log({Expected: expected})
// console.log({Result: die})


/*
  pValue: 0.15458730450476044,
  statistic: 6.666666666666666,
*/

function createHash(string) {
    return crypto.createHash('sha1').update(string).digest('hex')
}

let t = createHash(die.toString())
let t2 = createHash(expected.toString())
let t3 = t + t2

if (t + t2 == t3) console.log('skibidi toilet')


let a = []

console.log(0 + a[1])