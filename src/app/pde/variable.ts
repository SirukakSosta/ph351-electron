import { AM } from "./interface";

// export const exerciseChargeEquationMap: Record<
//   AM,
//   {
//     chargeEquation: (i: number, j: number, h: number) => number;
//     latex: string;
//   }
// > = {
//   "3943": {
//     chargeEquation: (x: number, y: number, h: number) => {
//       return Math.pow(h, 2) * (2.0 * ((1 - x) * x + (1 - y) * y));
//     },
//     latex: "S(x,y) = x(1-x)y(1-y)"
//   },
//   "3131": {
//     chargeEquation: (x: number, y: number, h: number) => {
//       return Math.pow(h, 2) * ((cos(x * Math.PI)) + Math.pow(y, 2) * (sin(y * Math.PI)))
//     },
//     latex: "S(x,y) = cos(x * π) + Math.pow(x,2) + y^2 * sin(y *π)"
//   }
// };

export const exerciseChargeEquationMap: Record<AM, string> = {
  "3943": 'x*(1-x)*y*(1-y)',
  "3131": 'Math.cos(x * Math.PI) + Math.pow(x,2) + Math.pow(y,2) * Math.sin(y * Math.PI)'
};

export function _chargeEquation(str: string, x: number, y: number, h: number) {

  const charge = eval(`Math.pow(h, 2) *` + str)
  return charge;

}