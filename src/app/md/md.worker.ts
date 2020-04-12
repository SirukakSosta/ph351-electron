/// <reference lib="webworker" />

type input = {
  // dt: { index: number, value: number }[],
  // initialVector: Array<any>,
  // eigenValues: Array<any>,
  // eigenVectors: Array<any>,
  // basisVectors: Array<any>,
  // dxStart: number
  // dxEnd: number
  // dx: number
  // postResultsDuringComputation: boolean
}

// interface ResultOutput { propabilityForAllStates: number[]; diaspora: number; avgs: number; }

type output = {
  // dtIndex: number;
  // dt: number,
  // progress: number,
  // result: ResultOutput
}

addEventListener('message', ({ data }) => {

  const input = JSON.parse(data) as input;

  // const output: output = { dtIndex: input.dtIndex, dt: input.dt, progress: 100, result: { propabilityForAllStates, diaspora, avgs } }
  // postMessage(JSON.stringify(output))

}) 