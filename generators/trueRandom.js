/*
    trueRandom
    Generates a random number given a range.
    This function utilizes environemntal factors such as atmospheric noise and radiation to generate numbers.
    How? By capturing it, and using some man-made translation.
*/

export async function trueRandom(low, high, max) {
    const response = await fetch(`https://www.random.org/integers/?num=${max || 1}&min=${low}&max=${high}&col=1&base=10&format=plain&rnd=new`);
    const result = await response.text();
    
    let data = []

    result.split('\n').forEach(value => {
        data[data.length] = parseInt(value)
    })

    return data;
}
