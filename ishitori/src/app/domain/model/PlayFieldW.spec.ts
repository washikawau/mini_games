import { ResultOf } from "@src/common/ResultOf";
import { PlayFieldW } from "./PlayFieldW";
import { PlayField } from "./types";

test.each([
    [4, 15, 5, { err: "numPick must be between [1 .. 4], but is 5." }],
    [4, 15, 4, { ok: { maxNumPick: 4, numStones: 11 } }],
    [4, 15, 3, { ok: { maxNumPick: 4, numStones: 12 } }],
    [4, 15, 2, { ok: { maxNumPick: 4, numStones: 13 } }],
    [4, 15, 1, { ok: { maxNumPick: 4, numStones: 14 } }],
    [4, 15, 0, { err: "numPick must be between [1 .. 4], but is 0." }],
    [4, 15, -1, { err: "numPick must be between [1 .. 4], but is -1." }],
    [4, 4, 5, { err: "numPick must be between [1 .. 4], but is 5." }],
    [4, 4, 4, { ok: { maxNumPick: 4, numStones: 0 } }],
    [4, 4, 3, { ok: { maxNumPick: 4, numStones: 1 } }],
    [4, 4, 2, { ok: { maxNumPick: 4, numStones: 2 } }],
    [4, 4, 1, { ok: { maxNumPick: 4, numStones: 3 } }],
    [4, 4, 0, { err: "numPick must be between [1 .. 4], but is 0." }],
    [4, 3, 4, { err: "numPick must be between [1 .. 3], but is 4." }],
    [4, 3, 3, { ok: { maxNumPick: 4, numStones: 0 } }],
    [4, 3, 2, { ok: { maxNumPick: 4, numStones: 1 } }],
    [4, 3, 1, { ok: { maxNumPick: 4, numStones: 2 } }],
    [4, 3, 0, { err: "numPick must be between [1 .. 3], but is 0." }],
    [4, 2, 3, { err: "numPick must be between [1 .. 2], but is 3." }],
    [4, 2, 2, { ok: { maxNumPick: 4, numStones: 0 } }],
    [4, 2, 1, { ok: { maxNumPick: 4, numStones: 1 } }],
    [4, 2, 0, { err: "numPick must be between [1 .. 2], but is 0." }],
    [4, 1, 2, { err: "numPick must be between [1 .. 1], but is 2." }],
    [4, 1, 1, { ok: { maxNumPick: 4, numStones: 0 } }],
    [4, 1, 0, { err: "numPick must be between [1 .. 1], but is 0." }],
    [4, 0, 0, { err: "stones not exists." }],
])('.removeStones: [%s, %s, %s | %s]', (maxNumPick: number, numStones: number, numPick: number, expected: { ok?: PlayField, err?: string }) => {
    // arrange
    const init = {
        maxNumPick,
        numStones,
    } as PlayField;
    const sut = PlayFieldW.wrap(init);
    // act
    const a = sut.removeStones(numPick);
    // assert
    const e = !!expected.ok
        ? ResultOf.ok(expected.ok!)
        : ResultOf.err(new Error(expected.err!));
    expect(a).toEqual(e);
});
