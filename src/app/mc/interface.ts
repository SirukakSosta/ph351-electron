export interface McWorkerOutput {
    GRID_SIZE: number;
    magnetizations: number[];
    tempratures: number[];
    theoritical: number[];
    energies: number[];
    eidikesThermotites: number[];
}

export interface McWorkerInput {

    K: number;
    B: number;
    J: number;
    GRID_SIZE: number;
    ITERATIONS: number;
    T0: number;
    T_MAX: number;
    T_STEP: number;
    spinChangesPerIteration: number;

}