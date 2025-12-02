import { Board, Mark, SqId } from "./Board";
import { BoardW } from "./BoardW";

export class Cpu1 {
    static create(mark: Mark): Cpu1 {
        return new Cpu1(mark);
    }

    private constructor(mark: Mark) {
        this.mark = mark;
    }

    readonly mark: Mark;

    get opponent(): Mark {
        return this.mark === 'o'
            ? 'x'
            : 'o';
    }

    nextCandidates(curr: Board): SqId[] {
        const currBoard = BoardW.wrap(curr);
        if (currBoard.possibles.length === 9) {
            return ['00', '02', '20', '22'];
        }
        const calculator = Calculator.create(
            this.mark,
            this.opponent,
            currBoard,
        );
        const result = calculator.run();
        return result.nextCandidates;
    }
}

class Calculator {
    static create(
        mark: Mark,
        opponent: Mark,
        currBoard: BoardW
    ): Calculator {
        const nextBoards = currBoard
            .possibles
            .map(sqId => ({
                sqId,
                boardW: currBoard.mark(sqId, mark).ok!
            }))
        if (nextBoards.length === 0) {
            throw new Error('already finished.');
        }
        return new Calculator(
            mark,
            opponent,
            nextBoards
        );
    }

    private constructor(
        mark: Mark,
        opponent: Mark,
        nextBoards: NextBoard[]
    ) {
        this.mark = mark;
        this.opponent = opponent;
        this.nextBoards = nextBoards;
    }

    readonly mark: Mark;
    readonly opponent: Mark;
    readonly nextBoards: NextBoard[];

    run(): NextResult {
        if (this.canWin) {
            return this.toWinResult();
        }
        if (this.isGoingtoFinish) {
            return this.toDrawResult();
        }
        const opponentsNextResults = this.nextBoards
            .map(x => [
                x,
                Calculator
                    .create(this.opponent, this.mark, x.boardW)
                    .run(),
            ] as [NextBoard, NextResult]);
        const nonLoses = opponentsNextResults
            .filter(x => x[1].winner !== this.opponent);
        if (this.isGoingtoLose(nonLoses)) {
            return this.toLoseResult(opponentsNextResults);
        }
        if (this.canWin2(nonLoses)) {
            return this.toWinResult2(nonLoses);
        }
        return this.toNextResult(nonLoses);
    }

    private get canWin(): boolean {
        return !!this.nextBoards
            .find(x => x.boardW.winner === this.mark);
    }

    private toWinResult(): NextResult {
        const candidates = this.nextBoards
            .filter(x => x.boardW.winner === this.mark)
            .map(x => ({
                sqId: x.sqId,
                priority: 1
            }));
        return new NextResult(
            this.mark,
            candidates
        );
    }

    private get isGoingtoFinish(): boolean {
        return this.nextBoards.length === 1;
    }

    private toDrawResult(): NextResult {
        return new NextResult(
            null,
            [{
                sqId: this.nextBoards[0].sqId,
                priority: 1
            }]
        );
    }

    private isGoingtoLose(
        nonLoses: [NextBoard, NextResult][]
    ): boolean {
        return nonLoses.length === 0;
    }

    private toLoseResult(
        opponentsNextResults: [NextBoard, NextResult][]
    ): NextResult {
        const min = opponentsNextResults
            .map(x => x[1].candidates.length)
            .reduce((a, b) => Math.min(a, b));
        return new NextResult(
            this.opponent,
            opponentsNextResults
                .filter(x => x[1].candidates.length === min)
                .map(x => ({
                    sqId: x[0].sqId,
                    priority: 0
                }))
        );
    }

    private canWin2(
        nonLoses: [NextBoard, NextResult][]
    ): boolean {
        return !!nonLoses
            .find(x => x[1].winner === this.mark);
    }

    private toWinResult2(
        nonLoses: [NextBoard, NextResult][]
    ): NextResult {
        const candidates = nonLoses
            .filter(x => x[1].winner === this.mark)
            .map(x => ({
                sqId: x[0].sqId,
                priority: x[1].candidates
                    .map(y => y.priority)
                    .reduce((a, b) => a + b, 1)
            }));
        return new NextResult(
            this.mark,
            candidates
        );
    }

    private toNextResult(
        nonLoses: [NextBoard, NextResult][]
    ): NextResult {
        const min = nonLoses
            .map(x => x[1].candidates.length)
            .reduce((a, b) => Math.min(a, b));
        const ret = nonLoses
            .filter(x => x[1].candidates.length === min)
            .map(x => [
                x[0].sqId,
                x[1].candidates
                    .map(y => y.priority)
                    .reduce((a, b) => a + b, 1)
            ] as [SqId, number]);
        const max = ret
            .map(x => x[1])
            .reduce((a, b) => Math.max(a, b));
        const candidates = ret
            .filter(x => x[1] === max)
            .map(x => ({
                sqId: x[0],
                priority: x[1],
            }));
        return new NextResult(
            null,
            candidates
        );
    }
}

class NextResult {
    constructor(
        winner: Mark | null,
        candidates: NextCandidate[]
    ) {
        this.winner = winner;
        this.candidates = candidates;
    }

    readonly winner: Mark | null;
    readonly candidates: NextCandidate[];

    get nextCandidates(): SqId[] {
        return this.candidates.map(x => x.sqId);
    }
}

type NextBoard = {
    readonly sqId: SqId,
    readonly boardW: BoardW,
};

type NextCandidate = {
    readonly sqId: SqId,
    readonly priority: number,
}
