import { create } from 'domain'
import { pseudoRandom } from './generators/pseudoRandom'

const crypto = require('crypto')

/*
    Chi Square Test
    In this case, the higher the pValue, the more likely it happened by chance, but as it decreases it becomes more predictable.
    However, chance is not the same thing as randomness.
*/

/*
    General definitions:
    Chi-Square Statistic (CSS): The statistic quantifying the deviation of observed values from the expected values.
        - In our case, if the data is completely random, we expect to see high CSS, and thus a low P-Value.
        - However, if the data is not random, we expect to see a low CSS and a high P-Value.
    P-Value: The probability that an event will happen
        - When the p-Value lower than the alpha, our result did not happen due to chance.
        - However, when higher, its possible that the result happened due to chance (more likely as it goes up).

    Note: CSS & P-Value have an inverse, but not exact relationship. If one is high, the other is low.
    If you have a high deviation, you have a low probability. If you have a high probability, you have a low probability.

    But if the P-Value is low, that means that the probability is low. What does the probability represent then?
*/

const chi2test = require('@stdlib/stats-chi2test')

let Expected = [1, 2, 3, 4, 5]
let Result = [1, 2, 3, 4, 5]
let Result2 = [1, 3, 2, 4, 5]
let Result3 = [pseudoRandom(10), pseudoRandom(10), pseudoRandom(10), pseudoRandom(10), pseudoRandom(10)]

function CreateResult(Result) {
    const Test = chi2test([Expected, Result]).toJSON()

    console.log(`Expected: ${Expected}`)
    console.log(`Result: ${Result}`)
    console.log(`pValue: ${Test.pValue}, statistic: ${Test.statistic}`)
    console.log('------------------------------------')
}

CreateResult(Result)
CreateResult(Result2)
CreateResult(Result3)