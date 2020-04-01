/** Constants */
export const N = 100; /** Grid size */
export const STEP = 1 / N; /** Step */
export const TIME_START = 0;
export const TIME_END = 20;
export const TIME_STEP = 0.2;

export const createVectorBase = (): Array<Array<number>> => {
  /** kathe sthlh toy pinaka eiai idiodianisma ths bashs */
  let basisVectors = new Array(N).fill(0).map(() => new Array(N).fill(0));
  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      if (row === col) {
        basisVectors[row][col] = 1;
      }
    }
  }
  return basisVectors;
};
