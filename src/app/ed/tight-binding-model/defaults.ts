/** Constants */
// export const N = 100; /** Grid size */
// export const STEP = 1 / N; /** Step */
export const TIME_START = 100;
export const TIME_END = 200;
export const TIME_STEP = 100;

export function createVectorBase(size: number): Array<Array<number>> {
  /** kathe sthlh toy pinaka eiai idiodianisma ths bashs */
  let basisVectors = new Array(size).fill(0).map(() => new Array(size).fill(0));
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (row === col) {
        basisVectors[row][col] = 1;
      }
    }
  }
  return basisVectors;
}

export function getStepDx(size: number) {
  return 1 / size;
}
