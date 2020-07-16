export function randomIntFromInterval(maxValue: number, minValue: number): number {
    return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}