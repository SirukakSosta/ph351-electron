export function acceleration(displacement: { previous: number, current: number, next: number }, mass: number, constant: { k: number, g: number, a: number, b: number }) {

    const displacementPrevious = displacement.previous;
    const displacementCurrent = displacement.current;
    const displacementNext = displacement.next;

    const term1 = (constant.k / mass) * (displacementNext - 2 * displacementCurrent + displacementPrevious);
    const term2 = (constant.g / mass) * ((Math.pow(displacementNext - displacementCurrent, 3) - Math.pow(displacementCurrent - displacementPrevious, 3)));
    const term3 = (constant.a / mass) * displacementCurrent;
    const term4 = (constant.b / mass) * Math.pow(displacementCurrent, 3);

    const result = term1 + term2 - term3 - term4;

    return result;
}

export function velocityNextDt(velocityCurrentDt: number, accelerationCurrentDt: number, accelerationNextDt: number, dt: number) {

    const term1 = velocityCurrentDt;
    const term2 = (accelerationCurrentDt + accelerationNextDt) * dt * 0.5;
    return term1 + term2;

}

export function displacementNextDt(displacementCurrentDt: number, velocityCurrentDt: number, accelerationCurrentDt: number, dt: number) {

    const term1 = displacementCurrentDt;
    const term2 = velocityCurrentDt * dt;
    const term3 = 0.5 * accelerationCurrentDt * Math.pow(dt, 2);

    return term1 + term2 + term3;

}