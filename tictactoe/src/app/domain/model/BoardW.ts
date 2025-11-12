
import { ResultOf } from '@src/common/ResultOf';
import { allSqIds, Board, Mark, SqId, SqState } from './Board';

export class BoardW {
    static create(): BoardW {
        const board: Board = [
            '-', '-', '-',
            '-', '-', '-',
            '-', '-', '-',
        ];
        return new BoardW(board);
    }

    static wrap(board: Board): BoardW {
        return new BoardW(board);
    }

    private constructor(board: Board) {
        this.board = board;
    }

    readonly board: Board;

    toString(): string {
        return `
        ${this.state('00')}${this.state('01')}${this.state('02')}
        ${this.state('10')}${this.state('11')}${this.state('12')}
        ${this.state('20')}${this.state('21')}${this.state('22')}`;
    }

    get possibles(): SqId[] {
        return allSqIds.filter(id => this.state(id) === '-');
    }

    state(sqId: SqId): SqState {
        return this.board[BoardW.indexMap[sqId]];
    }

    mark(sqId: SqId, mark?: Mark): ResultOf<BoardW> {
        if (this.state(sqId) !== '-') {
            const err = new Error(`already marked: sqId=${sqId}`);
            return ResultOf.err(err);
        }
        const clone = [...this.board];
        clone[BoardW.indexMap[sqId]] = mark ?? this.nextMark;
        const nextBoard = clone as unknown as Board;
        return ResultOf.ok(BoardW.wrap(nextBoard));
    }

    private get nextMark(): Mark {
        return this.board
            .filter(x => x !== '-')
            .length % 2 === 0 ? 'o' : 'x';
    }

    private static readonly indexMap = {
        '00': 0, '01': 1, '02': 2,
        '10': 3, '11': 4, '12': 5,
        '20': 6, '21': 7, '22': 8,
    };

    get winner(): Mark | null {
        const lines: [SqId, SqId, SqId][] = [
            ['00', '01', '02'],
            ['10', '11', '12'],
            ['20', '21', '22'],

            ['00', '10', '20'],
            ['01', '11', '21'],
            ['02', '12', '22'],

            ['00', '11', '22'],
            ['02', '11', '20'],
        ];
        for (const squares of lines) {
            const grouped = squares
                .map(x => this.state(x))
                .reduce((accum, x) => accum.has(x)
                    ? accum.set(x, accum.get(x)! + 1)
                    : accum.set(x, 1),
                    new Map<SqState, number>()
                );
            if (grouped.get('o') === 3) {
                return 'o';
            }
            if (grouped.get('x') === 3) {
                return 'x';
            }
        }
        return null;
    }
}
