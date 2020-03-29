import { clone, dot, transpose } from 'numeric';

export function jacobiDiagonalization(size, inputA, maxIteration, threshold) {

    var A = clone<any>(inputA);

    // Pを単位行列で初期化
    var P = new Array(size);
    for (var i = 0; i < size; ++i) {
        P[i] = new Array(size);
        for (var j = 0; j < size; ++j) {
            if (i == j) {
                P[i][j] = 1;
            } else {
                P[i][j] = 0;
            }
        }
    }

    var R = new Array(size);
    for (var i = 0; i < size; ++i) {
        R[i] = new Array(size);
    }

    var count = 0;
    while (1) {
        // search max |A[p][q]|
        var p = 0;
        var q = 1;
        var val = Math.abs(A[0][1]);
        for (var i = 0; i < size - 1; ++i) {
            for (var j = i + 1; j < size; ++j) {
                if (val < Math.abs(A[i][j])) {
                    p = i;
                    q = j;
                    val = Math.abs(A[i][j]);
                }
            }
        }
        if (val < threshold) {
            break;
        }
        // make rotation matrix
        for (var i = 0; i < size; ++i) {
            for (var j = 0; j < size; ++j) {
                if (i == j) {
                    R[i][j] = 1;
                } else {
                    R[i][j] = 0;
                }
            }
        }
        var th = 0.5 * Math.atan2(-2 * A[p][q], A[p][p] - A[q][q]);
        R[p][p] = Math.cos(th);
        R[p][q] = Math.sin(th);
        R[q][p] = -Math.sin(th);
        R[q][q] = Math.cos(th);
        // A <- R.transpose * A * R
        A = dot(transpose(R), A);
        A = dot(A, R);
        // P <- P * R
        P = dot(P, R) as any
        ++count;
    }
    return { DiagonalMatrix: A, OrthodonalMatrix: P };
}