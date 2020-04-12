export function chunkArray<T>(arr: T[], chunkSize: number) {
    var R: T[][] = [];
    for (var i = 0, len = arr.length; i < len; i += chunkSize)
        R.push(arr.slice(i, i + chunkSize));
    return R;
}

export function randomDecimal(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function createArrayWithRandomNumbers(length: number, min: number, max: number, decimal = false) {
    return new Array(length).fill(0).map(() => decimal ? randomDecimal(min, max) : randomInteger(min, max));
}

export function roundDecimal(number: number) {
    return Math.round(number * 10) / 10
}