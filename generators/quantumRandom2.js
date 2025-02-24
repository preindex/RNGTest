/*
    quantumRandom
    Generates a random number given a range using quantum principles such as quantum fluctuations.
*/

export async function quantumRandom2(low, high, max) {
    const params = new URLSearchParams({
        min: low,
        max: high,
        n: max
    });
    
    const response = await fetch(`https://qrandom.io/api/random/ints?${params}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });
    
    const data = await response.json();
    return data.numbers; // The API returns an object with a 'result' property containing the numbers
}

// Usage example:
// getRandomNumbers()
//     .then(data => console.log(data))
//     .catch(error => console.error(error));
