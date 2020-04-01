import { Injectable } from "@angular/core";
@Injectable({
  providedIn: "root"
})
export class MatrixHelperService {
  constructor() {}
  public normalizeVector(vector: Array<number>): Array<number> {
    const length = vector.length;
    let tmp = [];
    let count = 0;
    for (let i = 0; i < length; i++) {
      count = count + Math.pow(vector[i], 2);
    }
    count = Math.sqrt(count);

    for (let i = 0; i < length; i++) {
      tmp.push(vector[i] / count);
    }
    return tmp;
  }
  public normalizeEigenVectors(
    eigenVectors: Array<Array<any>>
  ): Array<Array<any>> {
    const N = eigenVectors.length;
    let tmp = new Array(N).fill(0).map(() => new Array(N).fill(0));
    for (let row = 0; row < N; row++) {
      let count = 0;
      for (let col = 0; col < N; col++) {
        count = count + Math.pow(eigenVectors[row][col], 2);
      }
      for (let i = 0; i < N; i++) {
        tmp[row][i] = eigenVectors[row][i] / Math.sqrt(count);
      }
    }
    return tmp;
  }
  public calculateBraKet(
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
  public calculateketBra(
    columnVector: Array<number>,
    rowVector: Array<number>
  ): Array<Array<any>> {
    const N = columnVector.length;
    let currentMatrix = new Array(N).fill(0).map(() => new Array(N).fill(0));
    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        currentMatrix[row][col] = columnVector[row] * rowVector[col];
      }
    }
    return currentMatrix;
  }
  public getColVector(basisVectors: Array<Array<number>>, col: number) {
    const N = basisVectors.length;
    let tmp = [];
    for (let row = 0; row < N; row++) {
      tmp.push(basisVectors[row][col]);
    }
    return tmp;
  }
  public getRowVector(basisVectors: Array<Array<number>>, row: number) {
    const N = basisVectors.length;
    let tmp = [];
    for (let col = 0; col < N; col++) {
      tmp.push(basisVectors[row][col]);
    }
    return tmp;
  }
}
