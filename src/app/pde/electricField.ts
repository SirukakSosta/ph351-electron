
//*
// Electric field calculation based on paper:
// https://my.ece.utah.edu/~ece6340/LECTURES/Feb1/Nagel%202012%20-%20Solving%20the%20Generalized%20Poisson%20Equation%20using%20FDM.pdf
// 
//
export class ElectricField {

    readonly yVector: number[][] = [];
    readonly xVector: number[][] = [];

    constructor(private voltageMatrix: number[][], private h: number) {

        console.log(voltageMatrix)

        this.xVector = new Array(voltageMatrix.length)
            .fill(0)
            .map(() => new Array(voltageMatrix.length).fill(0));

        this.yVector = new Array(voltageMatrix.length)
            .fill(0)
            .map(() => new Array(voltageMatrix.length).fill(0));

        this.calculateX_Vector();
        this.calculateY_Vector();

    }

    private calculateX_Vector() {

        console.log(999)
        const size = this.voltageMatrix.length;

        // initial calculation
        for (let i = 0; i < size - 1; i++) {


            if (!this.xVector[i]) {
                this.xVector[i] = []
            }
            for (let j = 0; j < size - 1; j++) {


                this.xVector[i][j] = - (this.voltageMatrix[i + 1][j] - this.voltageMatrix[i][j]) / this.h; // eq 24

            }

        }

        // normalization
        for (let i = 0; i < size - 1; i++) {

            for (let j = 0; j < size - 1; j++) {

                this.xVector[i][j] = 0.5 * (this.xVector[i][j + 1] + this.xVector[i][j])  // eq 26

            }

        }
    }

    private calculateY_Vector() {

        const size = this.voltageMatrix.length;

        // initial calculation
        for (let i = 0; i < size - 1; i++) {

            if (!this.yVector[i]) {
                this.yVector[i] = []
            }

            for (let j = 0; j < size - 1; j++) {

                this.yVector[i][j] = - (this.voltageMatrix[i][j + 1] - this.voltageMatrix[i][j]) / this.h; // eq 25

            }

        }

        // normalization
        for (let i = 0; i < size - 1; i++) {

            for (let j = 0; j < size - 1; j++) {

                this.yVector[i][j] = 0.5 * (this.yVector[i + 1][j] + this.yVector[i][j])  // eq 27

            }

        }
    }


}