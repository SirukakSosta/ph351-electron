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

export const deepCopy = (arr) => {
    let copy = [];
    arr.forEach(elem => {
        if (Array.isArray(elem)) {
            copy.push(deepCopy(elem))
        } else {
            if (typeof elem === 'object') {
                copy.push(deepCopyObject(elem))
            } else {
                copy.push(elem)
            }
        }
    })
    return copy;
}
// Helper function to deal with Objects
export const deepCopyObject = (obj) => {
    let tempObj = {};
    for (let [key, value] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            tempObj[key] = deepCopy(value);
        } else {
            if (typeof value === 'object') {
                tempObj[key] = deepCopyObject(value);
            } else {
                tempObj[key] = value
            }
        }
    }
    return tempObj;
}