/// <reference lib="webworker" />

type lel = {
  dt: number, initialVector: Array<any>, eigenValues: Array<any>, eigenVectors: Array<any>, basisVectors: Array<any>,
  points: number
}

addEventListener('message', ({ data }) => {
  const input = JSON.parse(data) as lel;
  const response = JSON.stringify({ progress: 0 });
  // postMessage(response);

  let propabilityForAllStatesPerTime: number[] = [];
  let avgs = 0;
  let avgsSquared = 0;
  for (let k = 0; k < input.points; k++) {

    if ((k % (input.points / 20)) === 0) {
      postMessage(JSON.stringify({ dt: input.dt, progress: (k * 100 / input.points) }))
    }

    const propability = getPropability(input.dt, k);
    propabilityForAllStatesPerTime.push(getPropability(input.dt, k));
    avgs += propability * k;
    avgsSquared += propability * Math.pow(k, 2);
  }
  const diaspora = Math.sqrt(avgsSquared - Math.pow(avgs, 2));
  // avgX.push(avgs);
  // diaspora.push(diasp);
  // finalDataForEachState.push(propabilityForAllStatesPerTime);
  // deltaTimes.push(dt);
  // this.saveData(dt, avgs, diasp, propabilityForAllStatesPerTime, increment);
  // increment++;
  return { propabilityForAllStatesPerTime, diaspora, avgs }

  function getPropability(dt: number, state: number): number {

    let realPart = 0;
    let imageinaryPart = 0;
    for (let i = 0; i < input.points; i++) {
      for (let m = 0; m < input.points; m++) {
        const Z_IM_PART = createZpart(m, i);
        const Z_KM_PART = createZpart(m, state);
        realPart = realPart + input.initialVector[i] * Z_IM_PART * Z_KM_PART * Math.cos(input.eigenValues[m] * dt);
        imageinaryPart = imageinaryPart + input.initialVector[i] * Z_IM_PART * Z_KM_PART * Math.sin(input.eigenValues[m] * dt);
      }
    }
    let magnitude = Math.pow(realPart, 2) + Math.pow(imageinaryPart, 2);
    return magnitude;

    function createZpart(m: number, i: number): number {
      // <e_m|x_i>
      const x_i = getColVector(input.basisVectors, i);
      const e_m = getRowVector(input.eigenVectors, m);
      const zPartIM = calculateBraKet(x_i, e_m);
      return zPartIM;
    }
    function calculateBraKet(
      columnVector: Array<number>,
      rowVector: Array<number>
    ): number {
      const length = columnVector.length;
      let dotProduct = 0;
      for (let i = 0; i < length; i++) {
        dotProduct = dotProduct + columnVector[i] * rowVector[i];
      }
      return dotProduct;
    }
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
  }

});
