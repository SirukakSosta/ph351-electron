/// <reference lib="webworker" />

import { getPropability } from "./methods/method";

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

    const propability = getPropability(input.dt, k, input.points, input.eigenVectors, input.basisVectors, input.initialVector, input.eigenValues);
    propabilityForAllStatesPerTime.push(propability);
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
  postMessage(JSON.stringify({ dt: input.dt, progress: 100, results: { propabilityForAllStatesPerTime, diaspora, avgs } }))

}) 