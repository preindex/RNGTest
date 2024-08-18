/*
    quantumRandom
    Generates a random number given a range using quantum principles.
    However, to get the range, the values are normalized.
    This shouldn't affect the random number IN THEORY, but I'm not sure I'll ever know.
*/

export async function quantumRandom(low, high, max) {
    let Numbers = []
    let Request = (await fetch(`https://qrng.anu.edu.au/API/jsonI.php?length=${max}&type=uint16`))
    console.log(Request)
    let Data = (await Request.json()).data
    Data.forEach(value => {
        Numbers[Numbers.length] = Math.round((value / 65535) * (high - low) + low)
    });
    return Numbers
}