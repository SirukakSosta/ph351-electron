export function waveFunctionVal(x: number, waveFunctionStr: string) {
    return eval(waveFunctionStr)
}

function generateRandomVector(N: number, waveFunction: string): Array<number> {
    let vector = [];
    for (let i = 0; i < N; i++) {
        // const x = this.relalX(i);



        const x = i;
        const exp_value = (-1 / 50) * Math.pow(x - 50, 2);
        const c_i = waveFunctionVal(i, waveFunction) // eval(waveFunction) // Math.exp(exp_value);
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


export function createInitialVector(N: number, waveFunction: string) {

    const randomVector = generateRandomVector(N, waveFunction);
    const normalizedVector = normalizeVector(randomVector);
    return normalizedVector;

}

export function createPotentialFunction(i: number, potentialFunction: string): number {
    // const x = this.relalX(i);
    // const x = i;
    // const factor = 1;
    // const harmonicOscilator = factor * Math.pow(x, 2);
    // const exam = Math.sin((2 * Math.PI * x) / 10);
    // const tanoglidis =  0.5 * i // Math.sign(sin(2 * Math.PI * x));

    const x = i

    const potential = eval(potentialFunction)
    console.log(x, potential)

    return potential;
    // x = transform i to real x
}