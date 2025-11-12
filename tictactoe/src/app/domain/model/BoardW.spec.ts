import { allSqIds, Board, Mark, SqId, SqState } from "./Board";
import { BoardW } from "./BoardW";

test.each([
    [],
])('.create(): [%s | ]', () => {
    // arrange
    // act
    const a = BoardW.create();
    // assert
    expect(a.board).not.toEqual([]);
});

test.each([
    [['-', '-', '-', '-', '-', '-', '-', '-', '-']],
    [['o', '-', '-', '-', '-', '-', '-', '-', '-']],
    [['o', 'x', '-', '-', '-', '-', '-', '-', '-']],
] as [Board][])('.wrap(): [%s | ]', (board) => {
    // arrange
    // act
    const a = BoardW.wrap(board);
    // assert
    expect(a.board).toEqual(board);
});

test.each([
    [['-', '-', '-', '-', '-', '-', '-', '-', '-'], ['-', '-', '-', '-', '-', '-', '-', '-', '-']],
    [['o', '-', '-', '-', '-', '-', '-', '-', '-'], ['o', '-', '-', '-', '-', '-', '-', '-', '-']],
    [['-', 'x', '-', '-', '-', '-', '-', '-', 'o'], ['-', 'x', '-', '-', '-', '-', '-', '-', 'o']],
] as [Board, SqState[]][])('.state(): [%s | %s]', (board, expected) => {
    // arrange
    let sut = BoardW.wrap(board);
    // act
    const a: SqState[] = [];
    for (const sqId of allSqIds) {
        a.push(sut.state(sqId));
    }
    // assert
    expect(a).toEqual(expected);
});

test.each([
    [['-', '-', '-', '-', '-', '-', '-', '-', '-'], ['00', undefined], ['o', '-', '-', '-', '-', '-', '-', '-', '-']],
    [['o', '-', '-', '-', '-', '-', '-', '-', '-'], ['01', undefined], ['o', 'x', '-', '-', '-', '-', '-', '-', '-']],
    [['o', '-', '-', '-', '-', '-', '-', '-', '-'], ['01', 'o'], ['o', 'o', '-', '-', '-', '-', '-', '-', '-']],
] as [Board, [SqId, Mark | undefined], Board][])('.mark()-ok: [%s, %s| %s]', (board, [sqId, state], expected) => {
    // arrange
    const sut = BoardW.wrap(board);
    // act
    const a = sut.mark(sqId, state).ok;
    // assert
    expect(a?.board).toEqual(expected);
});

test.each([
    [['o', '-', '-', '-', '-', '-', '-', '-', '-'], ['00', undefined], 'already marked: sqId=00'],
] as [Board, [SqId, Mark | undefined], string][])('.mark()-err: [%s, %s| %s]', (board, [sqId, state], expected) => {
    // arrange
    const sut = BoardW.wrap(board);
    // act
    const a = sut.mark(sqId, state).err;
    // assert
    expect(a?.message).toEqual(expected);
});

test.each([
    [['-', '-', '-', '-', '-', '-', '-', '-', '-'], null],
    [['o', '-', '-', '-', 'x', '-', '-', '-', 'o'], null],
    [['o', '-', '-', 'x', 'x', 'x', 'o', '-', 'o'], 'x'],
] as [Board, Mark | undefined][])('.winner(): [%s | %s]', (board, expected) => {
    // arrange
    let sut = BoardW.wrap(board);
    // act
    const a = sut.winner;
    // assert
    expect(a).toEqual(expected);
});
