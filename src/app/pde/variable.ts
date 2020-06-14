import { AM } from "./interface";

export const exerciseChargeEquationMap: Record<AM, string> = {
  "3943": 'x*(1-x)*y*(1-y)',
  "3131": 'Math.cos(x * Math.PI) + Math.pow(x,2) + Math.pow(y,2) * Math.sin(y * Math.PI)'
};

export function _chargeEquation(str: string, x: number, y: number, h: number) {

  const charge = eval(`Math.pow(h, 2) *` + str)
  return charge;

}