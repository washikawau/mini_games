import { ResultOf } from "@src/common/ResultOf";
import { allSqIds, Board2, Sq, SqId, SqState } from "./Board";
import { Board2W } from "./Board2W";

test.each([
    [],
])('.create(): [%s | ]', () => {
    // arrange
    // act
    const a = Board2W.create();
    // assert
    expect(a.board).not.toEqual([]);
});

test.each([
    [[]],
    [[{ sqId: '00', state: 'o' }]],
    [[{ sqId: '00', state: 'o' }, { sqId: '01', state: 'x' }]],
] as [Sq[]][])('.wrap(): [%s | ]', (records) => {
    // arrange
    const board: Board2 = { records };
    // act
    const a = Board2W.wrap(board);
    // assert
    const eBoard: Board2 = { records };
    expect(a.board).toEqual(eBoard);
});

test.each([
    [[], ['00', undefined], ResultOf.ok(Board2W.wrap({ records: [{ sqId: '00', state: 'o' }] }))],
    [[{ sqId: '00', state: 'o' }], ['01', undefined], ResultOf.ok(Board2W.wrap({ records: [{ sqId: '00', state: 'o' }, { sqId: '01', state: 'x' }] }))],
    [[{ sqId: '00', state: 'o' }], ['01', 'o'], ResultOf.ok(Board2W.wrap({ records: [{ sqId: '00', state: 'o' }, { sqId: '01', state: 'o' }] }))],
    [[{ sqId: '00', state: 'o' }], ['00', undefined], ResultOf.err(new Error(`already marked: sqId=00`))],
] as [Sq[], [SqId, SqState | undefined], ResultOf<Board2W>][])('.mark(): [%s, %s| %s]', (records, [sqId, state], expected) => {
    // arrange
    const board: Board2 = { records };
    const sut = Board2W.wrap(board);
    // act
    const a = sut.mark(sqId, state);
    // assert
    expect(a).toEqual(expected);
});

test.each([
    [[], ['-', '-', '-', '-', '-', '-', '-', '-', '-']],
    [['00'], ['o', '-', '-', '-', '-', '-', '-', '-', '-']],
    [['22', '01'], ['-', 'x', '-', '-', '-', '-', '-', '-', 'o']],
] as [SqId[], SqState[]][])('.state(): [%s | %s]', (sqIds, expected) => {
    // arrange
    let sut = Board2W.create();
    for (const x of sqIds) {
        sut = sut.mark(x).ok!;
    }
    // act
    const a: SqState[] = [];
    for (const sqId of allSqIds) {
        a.push(sut.state(sqId));
    }
    // assert
    expect(a).toEqual(expected);
});

test.each([
    [[], false],
    [['00', '11', '22'], false],
    [['00', '11', '22', '12', '20', '10', '21'], true],
] as [SqId[], boolean][])('.mark(): [%s | %s]', (sqIds, expected) => {
    // arrange
    let sut = Board2W.create();
    for (const x of sqIds) {
        sut = sut.mark(x).ok!;
    }
    // act
    const a = sut.isFinished;
    // assert
    expect(a).toEqual(expected);
});
