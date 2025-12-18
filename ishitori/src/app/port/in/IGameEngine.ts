
export interface IGameEngine {
    init(): void;
    tick(input: Input): void;
}

export type Input = {
    readonly frame: number,
    readonly touchstart?: TouchStart,
};

export type TouchStart = {
    readonly pos: Pos,
    readonly localPos: Pos,
};

export type Pos = {
    readonly x: number,
    readonly y: number,
};
