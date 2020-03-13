import { AM } from "./interface"

export const exerciseChargeEquationMap: Record<AM, {
    chargeEquation: (i: number, j: number, h: number) => number,
    latex: string
}> = {
    "3943": {
        chargeEquation: (x: number, y: number, h: number) => {
            return Math.pow(h, 2) * (2.0 * ((1 - x) * x + (1 - y) * y))
        },
        latex: 'S(x,y) = x(1-x)y(1-y)'
    },
    "3131": {
        chargeEquation: (x: number, y: number, h: number) => {
            return Math.pow(h, 2) * (2.0 * ((1 - x) * x + (1 - y) * y))
        },
        latex: 'S(x,y) = 12 *x^2'
    }
}

