/// <reference lib="webworker" />

import { getPropability } from "./methods/method";

type input = {
  dt: number,
  dtIndex: number
  initialVector: Array<any>,
  eigenValues: Array<any>,
  eigenVectors: Array<any>,
  basisVectors: Array<any>,
  size: number
}

type output = {
  dtIndex: number;
  dt: number,
  progress: number,
  result: {
    propabilityForAllStates: number[];
    diaspora: number;
    avgs: number;
  };
  // }
}

addEventListener('message', ({ data }) => {

  const input = JSON.parse(data) as input;
  const response = JSON.stringify({ progress: 0 });
  // postMessage(response);

  let propabilityForAllStates: number[] = [];
  let avgs = 0;
  let avgsSquared = 0;
  for (let k = 0; k < input.size; k++) {


    const propability = getPropability(input.dt, k, input.size, input.eigenVectors, input.basisVectors, input.initialVector, input.eigenValues);
    propabilityForAllStates.push(propability);
    avgs += propability * k;
    avgsSquared += propability * Math.pow(k, 2);

    // async update on results
    if ((k % (input.size / 20)) === 0) {
      const output: output = { dtIndex: input.dtIndex, dt: input.dt, progress: (k * 100 / input.size), result: { propabilityForAllStates, diaspora: 0, avgs } }
      postMessage(JSON.stringify(output))
    }

  }
  const diaspora = Math.sqrt(avgsSquared - Math.pow(avgs, 2));
  // avgX.push(avgs);
  // diaspora.push(diasp);
  // finalDataForEachState.push(propabilityForAllStatesPerTime);
  // deltaTimes.push(dt);
  // this.saveData(dt, avgs, diasp, propabilityForAllStatesPerTime, increment);
  // increment++;
  const output: output = { dtIndex: input.dtIndex, dt: input.dt, progress: 100, result: { propabilityForAllStates, diaspora, avgs } }
  postMessage(JSON.stringify(output))

}) 