export function getColumnFrom2dArray<T>(array: T[][], columnIndex: number) {
    return array.map(x => x[columnIndex]);
}

export function vectorMagnitude(i: number, j: number) {
    const sum = Math.pow(i, 2) + Math.pow(j, 2);
    return Math.sqrt(sum);
}

export function radians(i: number, j: number) {
    if (i == 0) {
        return 0;
    } else {
        let rads = Math.atan2(j, i) * 180 / Math.PI;
        return rads;
    }
}

export function getHFromSize(size: number) {
    return 1 / (size - 1);
}