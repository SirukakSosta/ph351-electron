import { Injectable } from '@angular/core';
import { clone, inv, random, transpose } from 'numeric';
import { jacobiDiagonalization } from './method';

@Injectable({
  providedIn: 'root'
})
export class EdLabService {

  constructor() {

    console.log(88)

    let a = [[3, 3.5], [3.2, 3.6]]

    const b = clone(a)


    console.table(transpose(b))
    console.table(inv(b))

  }

  diagonalize() {

    var maxiteration = 10000;

    var A = random([30, 30]);
    const threshold = 1e-2;

    // A = [
    //   [
    //     3,
    //     1,
    //     1
    //   ],
    //   [
    //     2,
    //     4,
    //     2
    //   ],
    //   [
    //     -1,
    //     -1,
    //     -1,
    //   ],

    // ]

    var size = A.length;

    // for (var i = 1; i < size; ++i) {
    //   for (var j = 0; j < i; ++j) {
    //     A[i][j] = A[j][i];
    //   }
    // }

    var result = jacobiDiagonalization(size, A, maxiteration, threshold);
    var D = clone(result.DiagonalMatrix);
    var P = clone(result.OrthodonalMatrix);

    console.table(D)
    console.table(P)
    console.table(transpose(P))

  }
}
