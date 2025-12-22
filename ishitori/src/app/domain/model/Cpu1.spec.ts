import { Cpu1 } from "./Cpu1";
import { PlayField, Player } from "./types";

test.each([
    [2, 4, "MAN"],
    [2, 5, "CPU"],
    [2, 6, "CPU"],
    [2, 7, "MAN"],
    [4, 11, "MAN"],
    [4, 12, "CPU"],
    [4, 13, "CPU"],
    [4, 14, "CPU"],
    [4, 15, "CPU"],
    [4, 16, "MAN"],
] as [number, number, Player][])('.selectTurn(): [%s, %s| %s]', (maxNumPick, numStones, expected) => {
    // arrange
    const playField: PlayField = {
        maxNumPick,
        numStones,
    };
    // act
    const a = Cpu1.create().selectTurn(playField);
    // assert
    expect(a).toEqual(expected);
});

test.each([
    [2, 1, [1]],
    [2, 2, [1]],
    [2, 3, [2]],
    [2, 4, [1, 2]],
    [2, 5, [1]],
    [2, 6, [2]],
    [2, 7, [1, 2]],
    [4, 11, [1, 2, 3, 4]],
    [4, 12, [1]],
    [4, 13, [2]],
    [4, 14, [3]],
    [4, 15, [4]],
    [4, 16, [1, 2, 3, 4]],
] as [number, number, number[]][])('.selectNumPickCandidates(): [%s, %s| %s]', (maxNumPick, numStones, expected) => {
    // arrange
    const playField: PlayField = {
        maxNumPick,
        numStones,
    };
    // act
    const a = Cpu1.create().selectNumPickCandidates(playField);
    // assert
    expect(a).toEqual(expected);
});
