export function calculateEnergy(spins: number[][], B: number, J: number) {

    const N = spins.length - 1;
    let energyAtBoundaries = 0;


    for (let i = 1; i < N; i++) {

        const term1 = -J * (
            spins[i][0] * (spins[i - 1][0] + spins[i][1] + spins[i + 1][0] + spins[i + 1][N]) +
            spins[i][N] * (spins[i - 1][N] + spins[i][1] + spins[1][N] + spins[i][N])
        );

        const term2 =
            spins[1][i] * (spins[1][i + 1] + spins[1][i - 1] + spins[2][i] + spins[N][i]) +
            spins[N][i] * (spins[N][i + 1] + spins[N][i - 1] + spins[N - 1][i] + spins[1][i]);

        const term3 = B * spins[i][1] - B * spins[i][N] - B * spins[1][i] - B * spins[N][i];

        energyAtBoundaries += term1 + term2 + term3;
    }

    let interiorEnergy = 0;
    for (let i = 1; i < N; i++) {
        for (let j = 1; j < N; j++) {

            const term1 = -J * (spins[i][j] * (spins[i + 1][j] + spins[i - 1][j] + spins[i][j + 1] + spins[i][j - 1]));
            const term2 = -B * spins[i][j];
            interiorEnergy += term1 + term2;
        }
    }

    const energy = energyAtBoundaries + interiorEnergy;
    return energy;

}
