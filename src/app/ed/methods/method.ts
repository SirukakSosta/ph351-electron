
function getColVector(basisVectors: Array<Array<number>>, col: number) {
    const N = basisVectors.length;
    let tmp = [];
    for (let row = 0; row < N; row++) {
        tmp.push(basisVectors[row][col]);
    }
    return tmp;
}


function getRowVector(basisVectors: Array<Array<number>>, row: number) {
    const N = basisVectors.length;
    let tmp = [];
    for (let col = 0; col < N; col++) {
        tmp.push(basisVectors[row][col]);
    }
    return tmp;
}

function calculateBraKet(columnVector: Array<number>, rowVector: Array<number>): number {
    const length = columnVector.length;
    let dotProduct = 0;
    for (let i = 0; i < length; i++) {
        dotProduct = dotProduct + columnVector[i] * rowVector[i];
    }
    return dotProduct;
}

function createZpart(m: number, i: number, eigenVectors: Array<any>, basisVectors: Array<any>): number {
    // <e_m|x_i>
    const x_i = getColVector(basisVectors, i);
    const e_m = getRowVector(eigenVectors, m);
    const zPartIM = calculateBraKet(x_i, e_m);
    return zPartIM;
}


export function getPropability(dt: number, state: number, points: number, eigenVectors: Array<any>, basisVectors: Array<any>, initialVector: Array<any>, eigenValues: Array<any>): number {

    let realPart = 0;
    let imageinaryPart = 0;
    for (let i = 0; i < points; i++) {
        for (let m = 0; m < points; m++) {
            const Z_IM_PART = createZpart(m, i, eigenVectors, basisVectors);
            const Z_KM_PART = createZpart(m, state, eigenVectors, basisVectors);
            realPart = realPart + initialVector[i] * Z_IM_PART * Z_KM_PART * Math.cos(eigenValues[m] * dt);
            imageinaryPart = imageinaryPart + initialVector[i] * Z_IM_PART * Z_KM_PART * Math.sin(eigenValues[m] * dt);
        }
    }
    let magnitude = Math.pow(realPart, 2) + Math.pow(imageinaryPart, 2);
    return magnitude;

};

export function createRealPosition(N: number) {
    const realPosition: number[] = [];
    for (let i = 0; i < N; i++) {
        realPosition.push(i);
    }
    return realPosition;
}

export function createDeltaTimes(start: number, end: number, step: number) {
    const deltaTimes: number[] = [];
    for (let dt = start; dt < end; dt += step) {
        deltaTimes.push(dt);
    }
    return deltaTimes;
}
