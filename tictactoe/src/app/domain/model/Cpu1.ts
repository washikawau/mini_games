import { Board, Player, SqId } from "./Board";
import { BoardW } from "./BoardW";

export class Cpu1 {
    static create(player: Player): Cpu1 {
        return new Cpu1(player);
    }

    private constructor(player: Player) {
        this.player = player;
    }

    readonly player: Player;

    get opponent(): Player {
        return this.player === 'o'
            ? 'x'
            : 'o';
    }

    nextCandidates(curr: Board): SqId[] {
        const currBoard = BoardW.wrap(curr);
        if (currBoard.possibles.length === 9) {
            return ['00', '02', '20', '22'];
        }
        const calculator = Calculator.create(
            this.player,
            this.opponent,
            currBoard,
        );
        const result = calculator.run();
        return result.nextCandidates;
    }

    // private static next2(
    //     player: Player,
    //     opponent: Player,
    //     currBoard: BoardW
    // ): NextResult3 {
    //     if (currBoard.possibles.length === 0) {
    //         throw new Error('already finished.');
    //     }
    //     const nextBoards = this.nextBoards(player, currBoard);
    //     if (this.hasWins(nextBoards, player)) {
    //         return this.toWinResult(nextBoards, player);
    //     }
    //     if (nextBoards.length === 1) {
    //         return {
    //             winner: null,
    //             candidates: [{ sqId: nextBoards[0].sqId, priority: 1 }]
    //         };
    //     }
    //     const xs = nextBoards
    //         .map(x => [
    //             x,
    //             this.next2(opponent, player, x.boardW),
    //         ] as [NextBoard, NextResult3]);
    //     const nonLoses = xs.filter(x => x[1].winner !== opponent);
    //     if (nonLoses.length === 0) {
    //         const min = xs
    //             .map(x => x[1].candidates.length)
    //             .reduce((a, b) => Math.min(a, b));
    //         return {
    //             winner: opponent,
    //             candidates: xs
    //                 .filter(x => x[1].candidates.length === min)
    //                 .map(x => ({
    //                     sqId: x[0].sqId,
    //                     priority: 0
    //                 }))
    //         };
    //     }
    //     const wins2 = nonLoses.filter(x => x[1].winner === player);
    //     if (wins2.length > 0) {
    //         return {
    //             winner: player,
    //             candidates: wins2
    //                 .map(x => ({
    //                     sqId: x[0].sqId,
    //                     priority: x[1].candidates
    //                         .map(y => y.priority)
    //                         .reduce((a, b) => a + b, 1)
    //                 }))
    //         };
    //     }
    //     const min = nonLoses
    //         .map(x => x[1].candidates.length)
    //         .reduce((a, b) => Math.min(a, b));
    //     const ret = nonLoses
    //         .filter(x => x[1].candidates.length === min)
    //         .map(x => [
    //             x[0].sqId,
    //             x[1].candidates.map(y => y.priority).reduce((a, b) => a + b, 1)
    //         ] as [SqId, number]);
    //     const max = ret.map(x => x[1]).reduce((a, b) => Math.max(a, b));
    //     const filteredRet = ret
    //         .filter(x => x[1] === max)
    //         .map(x => ({
    //             sqId: x[0],
    //             priority: x[1],
    //         }));
    //     return {
    //         winner: null,
    //         candidates: filteredRet
    //     };
    // }

    // private static nextBoards(player: Player, currBoard: BoardW): NextBoard[] {
    //     return currBoard
    //         .possibles
    //         .map(sqId => ({
    //             sqId,
    //             boardW: currBoard.mark(sqId, player).ok!
    //         }));
    // }

    // private static hasWins(nextBoards: NextBoard[], player: Player): boolean {
    //     return !!nextBoards.find(x => x.boardW.winner === player);
    // }

    // private static toWinResult(nextBoards: NextBoard[], player: Player): NextResult3 {
    //     const candidates = nextBoards
    //         .filter(x => x.boardW.winner === player)
    //         .map(x => ({
    //             sqId: x.sqId,
    //             priority: 1
    //         }));
    //     return {
    //         winner: player,
    //         candidates,
    //     };
    // }

    // private static next2(
    //     player: Player,
    //     opponent: Player,
    //     boardW: BoardW
    // ): [Player | null, [SqId, number][]] {
    //     const possibleNexts: [SqId, BoardW][] = boardW
    //         .possibles
    //         .map(sqId => [
    //             sqId,
    //             boardW.mark(sqId, player).ok
    //         ] as [SqId, BoardW]);
    //     if (possibleNexts.length === 0) {
    //         return [null, []];
    //     }
    //     const wins = possibleNexts.filter(x => x[1].winner === player);
    //     if (wins.length > 0) {
    //         return [
    //             player,
    //             wins.map(x => [x[0], 1])
    //         ];
    //     }
    //     const xs = possibleNexts
    //         .map(x => [
    //             x[0],
    //             ...this.next2(opponent, player, x[1]),
    //         ] as [SqId, Player | null, [SqId, number][]]);
    //     const nonLoses = xs.filter(x => x[1] !== opponent);
    //     if (nonLoses.length === 0) {
    //         const min = xs.map(x => x[2].length).reduce((a, b) => Math.min(a, b));
    //         return [
    //             opponent,
    //             xs
    //                 .filter(x => x[2].length === min)
    //                 .map(x => [x[0], 0])
    //         ];
    //     }
    //     const wins2 = nonLoses.filter(x => x[1] === player);
    //     if (wins2.length > 0) {
    //         return [
    //             player,
    //             wins2.map(x => [x[0], x[2].map(y => y[1]).reduce((a, b) => a + b, 1)])
    //         ];
    //     }
    //     const min = nonLoses
    //         .map(x => x[2].length)
    //         .reduce((a, b) => Math.min(a, b));
    //     const ret = nonLoses
    //         .filter(x => x[2].length === min)
    //         .map(x => [
    //             x[0],
    //             x[2].map(y => y[1]).reduce((a, b) => a + b, 1)
    //         ] as [SqId, number]);
    //     const max = ret.map(x => x[1]).reduce((a, b) => Math.max(a, b));
    //     const filteredRet = ret.filter(x => x[1] === max);
    //     return [
    //         null,
    //         filteredRet
    //     ];
    // }

    // private static next3(
    //     player: Player,
    //     opponent: Player,
    //     boardW: BoardW,
    //     numOfWin: number
    // ): [Player | null, [SqId, number][]] {
    //     // console.log('---- 10.1: ', player, '-', numOfWin, ':', boardW);
    //     const a = this.next3Impl(player, opponent, boardW, numOfWin);
    //     // console.log('---- 10.2: ', player, '-', numOfWin, '->', a);
    //     return a;
    // }

    // private static next3Impl(
    //     player: Player,
    //     opponent: Player,
    //     boardW: BoardW,
    //     numOfWin: number
    // ): [Player | null, [SqId, number][]] {
    //     // const possibles: [SqId, BoardW][] = allSqIds
    //     //     .map(sqId => [
    //     //         sqId,
    //     //         boardW.mark(sqId, player).ok
    //     //     ] as [SqId, BoardW])
    //     //     .filter(x => !!x);
    //     const possibleNexts: [SqId, BoardW][] = boardW
    //         .possibles
    //         .map(sqId => [
    //             sqId,
    //             boardW.mark(sqId, player).ok
    //         ] as [SqId, BoardW]);
    //     if (possibleNexts.length === 0) {
    //         return [null, []];
    //     }
    //     // console.log('---- 10: ', player, ':', JSON.stringify(possibles));
    //     const wins = possibleNexts.filter(x => x[1].winner === player);
    //     if (wins.length > 0) {
    //         // console.log("---- wins=", JSON.stringify(wins));
    //         return [
    //             player,
    //             wins.map(x => [x[0], numOfWin + 1])
    //         ];
    //     }
    //     const xs = possibleNexts
    //         .map(x => [
    //             x[0],
    //             ...this.next3(opponent, player, x[1], numOfWin),
    //         ] as [SqId, Player | null, [SqId, number][]]);
    //     const nonLoses = xs.filter(x => x[1] !== opponent);
    //     // console.log('---- xs: ', player, '-', numOfWin, ':', boardW, '->', JSON.stringify(xs));
    //     // console.log("---- nonLoses=", player, ":", JSON.stringify(nonLoses));
    //     if (nonLoses.length === 0) {
    //         // console.log('---- 11: ', JSON.stringify(xs));
    //         const min = xs.map(x => x[2].length).reduce((a, b) => Math.min(a, b));
    //         return [
    //             opponent,
    //             xs
    //                 .filter(x => x[2].length === min)
    //                 .map(x => [x[0], 0])
    //         ];
    //     }
    //     const wins2 = nonLoses.filter(x => x[1] === player);
    //     if (wins2.length > 0) {
    //         // console.log("---- wins2=", JSON.stringify(wins2));
    //         // for (const x of wins2) {
    //         //     const bb = x[2].map(y => y[1]).reduce((a, b) => a + b, 0);
    //         //     console.log('---- bb=', bb);
    //         // }
    //         return [
    //             player,
    //             wins2.map(x => [x[0], numOfWin + x[2].map(y => y[1]).reduce((a, b) => a + b, 0)])
    //         ];
    //     }
    //     const min = nonLoses
    //         .map(x => x[2].length)
    //         .reduce((a, b) => Math.min(a, b));
    //     // const max = nonLoses
    //     //     .map(x => x[2].map( y => y[1]).reduce((a, b) => Math.max(a, b)))
    //     return [
    //         null,
    //         nonLoses
    //             .filter(x => x[2].length === min)
    //             // .filter(x => x[2].map(y => y[1]) === max)
    //             .map(x => [
    //                 x[0],
    //                 x[2].map(y => y[1]).reduce((a, b) => a + b, numOfWin)
    //                 // numOfWin
    //                 // x[2].map(y => y[1]).reduce((a, b) => a + b)
    //             ])
    //     ];
    // }
}

class Calculator {
    static create(
        player: Player,
        opponent: Player,
        currBoard: BoardW
    ): Calculator {
        const nextBoards = currBoard
            .possibles
            .map(sqId => ({
                sqId,
                boardW: currBoard.mark(sqId, player).ok!
            }))
        if (nextBoards.length === 0) {
            throw new Error('already finished.');
        }
        return new Calculator(
            player,
            opponent,
            nextBoards
        );
    }

    private constructor(
        player: Player,
        opponent: Player,
        nextBoards: NextBoard[]
    ) {
        this.player = player;
        this.opponent = opponent;
        this.nextBoards = nextBoards;
    }

    readonly player: Player;
    readonly opponent: Player;
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
                    .create(this.opponent, this.player, x.boardW)
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
            .find(x => x.boardW.winner === this.player);
    }

    private toWinResult(): NextResult {
        const candidates = this.nextBoards
            .filter(x => x.boardW.winner === this.player)
            .map(x => ({
                sqId: x.sqId,
                priority: 1
            }));
        return new NextResult(
            this.player,
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
            .find(x => x[1].winner === this.player);
    }

    private toWinResult2(
        nonLoses: [NextBoard, NextResult][]
    ): NextResult {
        const candidates = nonLoses
            .filter(x => x[1].winner === this.player)
            .map(x => ({
                sqId: x[0].sqId,
                priority: x[1].candidates
                    .map(y => y.priority)
                    .reduce((a, b) => a + b, 1)
            }));
        return new NextResult(
            this.player,
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
        winner: Player | null,
        candidates: NextCandidate[]
    ) {
        this.winner = winner;
        this.candidates = candidates;
    }

    readonly winner: Player | null;
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
