export interface ExperimentConstant {
    k: number;
    g: number;
    a: number;
    b: number;
}

export interface MdWorkerInput {

    constant: { k: number; g: number; a: number; b: number; }
    dt: number;
    dtStart: number;
    dtEnd: number;
    mass: number[];
    initialDisplacement: number[];
    initialVelocity: number[];
    initialAcceleration: number[];
    initialKineticEnergy: number[];
    initialPotentialEnergy: number[];

}

export interface MdWorkerOutput {

    progress: number;
    displacement: number[][];
    velocity: number[][];
    acceleration: number[][];
    kineticEnergy: number[][];
    potentialEnergy: number[][];
    totalEnergy: number;
    temperature: number;

}