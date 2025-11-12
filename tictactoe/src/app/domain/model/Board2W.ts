
// import { ResultOf } from '@src/common/ResultOf';
import { ResultOf } from '../../../common/ResultOf';
import { Board2, Player, SqId, SqState } from './Board';

export class Board2W {
    static create(): Board2W {
        const board: Board2 = { records: [] };
        return new Board2W(board);
    }

    static wrap(board: Board2): Board2W {
        return new Board2W(board);
    }

    private constructor(board: Board2) {
        this.board = board;
    }

    readonly board: Board2;

    toString(): string {
        return `
        ${this.state('00')}${this.state('01')}${this.state('02')}
        ${this.state('10')}${this.state('11')}${this.state('12')}
        ${this.state('20')}${this.state('21')}${this.state('22')}`;
    }

    mark(sqId: SqId, state?: SqState): ResultOf<Board2W> {
        if (this.state(sqId) !== '-') {
            const err = new Error(`already marked: sqId=${sqId}`);
            return ResultOf.err(err);
        }
        const next = {
            sqId,
            state: state ?? this.nextState,
        };
        const records = [...this.board.records, next]
        return ResultOf.ok(Board2W.wrap({ records }));
    }

    private get nextState(): SqState {
        return this.board.records.length % 2 === 0 ? 'o' : 'x';
    }

    state(sqId: SqId): SqState {
        return this.board.records
            .find(x => x.sqId === sqId)
            ?.state
            ?? '-';
    }

    get winner(): Player | undefined {
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
        return undefined;
    }

    get isFinished(): boolean {
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
            if (grouped.get('o') === 3 ||
                grouped.get('x') === 3
            ) {
                return true;
            }
        }
        return false;
    }
}
