function generateRandomVector(N: number): Array<number> {
    let vector = [];
    for (let i = 0; i < N; i++) {
        // const x = this.relalX(i);
        const x = i;
        const exp_value = (-1 / 50) * Math.pow(x - 50, 2);
        const c_i = Math.exp(exp_value);
        vector.push(c_i);
    }
    return vector;
}

function normalizeVector(vector: Array<number>): Array<number> {
    const length = vector.length;
    let tmp = [];
    let count = 0;
    for (let i = 0; i < length; i++) {
        count = count + Math.pow(vector[i], 2);
    }
    count = Math.sqrt(count);

    for (let i = 0; i < length; i++) {
        tmp.push(vector[i] / count);
    }
    return tmp;
}


export function createInitialVector(N: number) {

    const randomVector = generateRandomVector(N);
    const normalizedVector = normalizeVector(randomVector);
    return normalizedVector;

}