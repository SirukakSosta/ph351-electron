/// <reference lib="webworker" />

import { getDxTotalPoints, getPropability } from "./methods/method";

type input = {
  dt: { index: number, value: number }[],
  initialVector: Array<any>,
  eigenValues: Array<any>,
  eigenVectors: Array<any>,
  basisVectors: Array<any>,
  dxStart: number
  dxEnd: number
  dx: number
  postResultsDuringComputation: boolean
}

interface ResultOutput { propabilityForAllStates: number[]; diaspora: number; avgs: number; }

type output = {
  dtIndex: number;
  dt: number,
  progress: number,
  result: ResultOutput
}

addEventListener('message', ({ data }) => {

  const input = JSON.parse(data) as input;
  // console.log('input', input)
  const totalPoints = getDxTotalPoints(input.dxEnd, input.dx)
  const results: ResultOutput[] = input.dt.map(e => ({ avgs: 0, diaspora: 0, propabilityForAllStates: [] }))

  input.dt.forEach((dt, index) => {
    let avgsSquared = 0;
    let propabilitySum = 0;

    // const output: output = { dtIndex: dt.index, dt: dt.value, progress: 0, result: null }
    // console.log(dt.value, 'initial posting')
    // postMessage(JSON.stringify(output))

    for (let k = 0; k < totalPoints; k++) {

      const propability = getPropability(dt.value, k, totalPoints, input.eigenVectors, input.basisVectors, input.initialVector, input.eigenValues);

      results[index].propabilityForAllStates.push(propability);
      results[index].avgs += propability * k;
      avgsSquared += propability * Math.pow(k, 2);
      results[index].diaspora = Math.sqrt(avgsSquared - Math.pow(results[index].avgs, 2));
      propabilitySum += propability;

      const progress = ((k + 1) * 100 / totalPoints)

      // console.log(dt.value,progress)

      // async update on results
      if (progress === 100) {
        const result = results[index]
        const output: output = { dtIndex: dt.index, dt: dt.value, progress, result }
        // console.log(dt.value, 'final posting')
        postMessage(JSON.stringify(output))
      }

    }

  })

  // console.log(input.dt,avgs)

  // avgs = avgs / propabilitySum;

  // console.log(input.dt,avgs)

  // const output: output = { dtIndex: input.dtIndex, dt: input.dt, progress: 100, result: { propabilityForAllStates, diaspora, avgs } }
  // postMessage(JSON.stringify(output))

}) 