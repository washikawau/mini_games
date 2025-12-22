import { ResultOf } from "@src/common/ResultOf";
import { PlayField } from "./types";

export class PlayFieldW {
    static create(): PlayFieldW {
        return new PlayFieldW({
            maxNumPick: 4,
            numStones: 15,
        });
    }

    static wrap(playField: PlayField): PlayFieldW {
        return new PlayFieldW(playField);
    }

    private constructor(playField: PlayField) {
        this.playField = playField;
    }

    readonly playField: PlayField;

    get numPickableStones(): number | undefined {
        const { maxNumPick, numStones } = this.playField;
        if (numStones <= 0) {
            return undefined;
        }
        return Math.min(maxNumPick, numStones);
    }

    removeStones(num: number): ResultOf<PlayField> {
        if (this.numPickableStones === undefined) {
            const msg = `stones not exists.`;
            return ResultOf.err(new Error(msg));
        }
        const max = Math.min(this.playField.numStones, this.playField.maxNumPick);
        if (num < 1 ||
            max < num
        ) {
            const msg = `numPick must be between [1 .. ${max}], but is ${num}.`;
            return ResultOf.err(new Error(msg));
        }
        return ResultOf.ok({
            ...this.playField,
            numStones: this.playField.numStones - num,
        });
    }
}
