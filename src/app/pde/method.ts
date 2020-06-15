export function getColumnFrom2dArray<T>(array: T[][], columnIndex: number) {
    return array.map(x => x[columnIndex]);
}

export function getHFromSize(size: number) {
    return 1 / (size - 1);
}

export function magnitude(i, j) {
    const sum = Math.pow(i, 2) + Math.pow(j, 2);
    return Math.sqrt(sum);
}
export function radians(i, j) {
    let p = j / i;

    let rads: number;
    if ((i <= 0 && j >= 0) || (i <= 0 && j <= 0)) {
        rads = (Math.atan(p) * 180) / Math.PI + 180;
    } else {
        rads = (Math.atan(p) * 180) / Math.PI;
    }
    //becouse atan dont know about the (+-) of xy we need
    // to map it atan 's angle run from -p/2 to p/2 means -90 to 90
    let mapToChats = (-1 * rads + 270) % 360;

    // if (rads < 0) return -1 * rads;
    return mapToChats;
}

export function getRealXYByIndexLatticeSizeBoundaryLength(i: number, latticeSize: number, xStart: number, xEnd: number) {
    const diasthma = xEnd - xStart;
    const step = diasthma / (latticeSize - 1);
    let realPos = xStart + (step * i);
    realPos = Math.round(realPos * 100) / 100;
    return realPos;
}