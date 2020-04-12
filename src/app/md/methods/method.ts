export function particleAcceleration(particleIndex: number, displacementMatrix: number[], massMatrix: number[], constant: { k: number, g: number, a: number, b: number }) {

    const displacementPrevious = displacementMatrix[particleIndex - 1]
    const displacementCurrent = displacementMatrix[particleIndex]
    const displacementNext = displacementMatrix[particleIndex + 1]
    const mass = massMatrix[particleIndex];

    const term1 = (constant.k / mass) * (displacementNext - 2 * displacementCurrent + displacementPrevious);
    const term2 = (constant.g / mass) * ((Math.pow(displacementNext - displacementCurrent, 3) - Math.pow(displacementCurrent - displacementPrevious, 3)));
    const term3 = (constant.a / mass) * displacementCurrent;
    const term4 = (constant.b / mass) * Math.pow(displacementCurrent, 3);

    const result = term1 + term2 - term3 - term4;

    return result;
}