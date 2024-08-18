/*
    weakRandom
    Generates a random number given a range.
    This function is simple, and is insecure.
*/

export function weakRandom(low, high) {
    return Math.round(Math.random() * (high - low) + low)
}