import { seq } from "@src/common/util";
import { PlayFieldW } from "./PlayFieldW";
import { PlayField, Player } from "./types";

export class Cpu1 {
    static create(): Cpu1 {
        return new Cpu1();
    }

    private constructor() {
    }

    selectTurn(playField: PlayField): Player {
        const { maxNumPick, numStones } = playField;
        return (numStones - 1) % (maxNumPick + 1) !== 0
            ? "CPU"
            : "MAN";
    }

    selectNumPickCandidates(playField: PlayField): number[] {
        const { maxNumPick, numStones } = playField;
        if ((numStones - 1) % (maxNumPick + 1) !== 0) {
            const c = Math.floor((numStones - 1) / (maxNumPick + 1));
            const numPick = (numStones - 1) - c * (maxNumPick + 1);
            return [numPick];
        }
        const numPickableStones = PlayFieldW
            .wrap(playField)
            .numPickableStones!;
        return [...seq(1, numPickableStones + 1)];
    }
}
