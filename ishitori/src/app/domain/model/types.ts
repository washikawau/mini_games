
export type GameMode = 1 | 2;

export type Player = "MAN" | "CPU";

export type PlayField = {
    readonly maxNumPick: number,
    readonly numStones: number,
};
