import { Input } from "@src/app/port/in/IGameEngine";
import { IStage1SceneDrawer } from "@src/app/port/out/IStage1SceneDrawer";
import { config } from "@src/common/config";
import { secToFrame } from "@src/common/util";
import { Board, Mark } from "../../model/Board";
import { BoardW } from "../../model/BoardW";
import { Cpu1 } from "../../model/Cpu1";
import { IScene, TickResult } from "../IScene";
import { RectRange } from "../RectRange";

const name = "Stage1";
type Drawer = IStage1SceneDrawer;
type Props = {
    readonly frame: number,
    readonly board: Board,
    readonly turn: Turn,
    readonly status: State,
};

export type Turn = {
    readonly player: "MAN" | "CPU",
    readonly mark: Mark,
};

export type Move = {
    readonly turn: Turn,
    readonly sqRange: RectRange,
};

type State =
    InitState |
    WaitingUserSelectingTurnState |
    WaitingPlayerTurnState |
    WaitingMarkAppearingState |
    WaitingWinnerAppearingState |
    WaitingUserSelectRetryState |
    RemovingState |
    RemovedState;
type InitState = {
    tag: "Init",
};
type WaitingUserSelectingTurnState = {
    tag: "WaitingUserSelectingTurn",
};
type WaitingPlayerTurnState = {
    tag: "WaitingPlayerTurn",
};
type WaitingMarkAppearingState = {
    tag: "WaitingMarkAppearing",
    readonly move: Move,
    readonly remainingFrame: number,
};
type WaitingWinnerAppearingState = {
    tag: "WaitingWinnerAppearing",
    readonly winner: Turn | "DRAW",
    readonly remainingFrame: number,
};
type WaitingUserSelectRetryState = {
    tag: "WaitingUserSelectRetry",
};
type RemovingState = {
    tag: "Removing",
};
type RemovedState = {
    tag: "Removed",
};

const defaultProps: Props = {
    frame: 0,
    board: BoardW.create().board,
    turn: {
        player: "MAN",
        mark: "o",
    },
    status: { tag: "Init" },
};

const c = {
    sqSize: 150,
    board: {
        left: 75,
        top: 75,
    } as const,
} as const;

const boardRange = RectRange.fromLeftTopAndSize(
    c.board.left,
    c.board.top,
    c.sqSize * 3,
    c.sqSize * 3,
);

const sqRanges = [
    ["00", RectRange.fromLeftTopAndSize(
        c.board.left + c.sqSize * 0,
        c.board.top + c.sqSize * 0,
        c.sqSize,
        c.sqSize,
    )],
    ["01", RectRange.fromLeftTopAndSize(
        c.board.left + c.sqSize * 1,
        c.board.top + c.sqSize * 0,
        c.sqSize,
        c.sqSize,
    )],
    ["02", RectRange.fromLeftTopAndSize(
        c.board.left + c.sqSize * 2,
        c.board.top + c.sqSize * 0,
        c.sqSize,
        c.sqSize,
    )],
    ["10", RectRange.fromLeftTopAndSize(
        c.board.left + c.sqSize * 0,
        c.board.top + c.sqSize * 1,
        c.sqSize,
        c.sqSize,
    )],
    ["11", RectRange.fromLeftTopAndSize(
        c.board.left + c.sqSize * 1,
        c.board.top + c.sqSize * 1,
        c.sqSize,
        c.sqSize,
    )],
    ["12", RectRange.fromLeftTopAndSize(
        c.board.left + c.sqSize * 2,
        c.board.top + c.sqSize * 1,
        c.sqSize,
        c.sqSize,
    )],
    ["20", RectRange.fromLeftTopAndSize(
        c.board.left + c.sqSize * 0,
        c.board.top + c.sqSize * 2,
        c.sqSize,
        c.sqSize,
    )],
    ["21", RectRange.fromLeftTopAndSize(
        c.board.left + c.sqSize * 1,
        c.board.top + c.sqSize * 2,
        c.sqSize,
        c.sqSize,
    )],
    ["22", RectRange.fromLeftTopAndSize(
        c.board.left + c.sqSize * 2,
        c.board.top + c.sqSize * 2,
        c.sqSize,
        c.sqSize,
    )],
] as const;

const firstLabelRange = RectRange.fromLeftTopAndSize(
    config.screen.width / 2.0 - 30 * 5 / 2,
    config.screen.height * 4 / 9,
    30 * 5,
    30,
);

const secondLabelRange = RectRange.fromLeftTopAndSize(
    config.screen.width / 2.0 - 30 * 5 / 2,
    config.screen.height * 5 / 9,
    30 * 5,
    30,
);

export class Stage1Scene implements IScene<typeof name, Props, Drawer> {
    static create(
        data: { gameMode: 1 | 2 },
    ): Stage1Scene {
        return new this(data);
    }

    private constructor(
        data: { gameMode: 1 | 2 },
    ) {
        this.gameMode = data.gameMode;
    }

    private readonly gameMode: 1 | 2;
    private _props = defaultProps;

    get name(): typeof name {
        return name;
    }

    get props(): Props {
        return this._props;
    }

    private updateProps(next: Partial<Props>) {
        const frame = this._props.frame + 1;
        this._props = {
            ...this._props,
            ...next,
            frame,
        };
    }

    onAdded(drawer: Drawer): void {
        this._props = defaultProps;
        drawer.onSceneAdded(
            sqRanges.map(x => x[1]),
        );
    }

    onRemoved(drawer: Drawer): void {
        drawer.onSceneRemoved();
        this._props = defaultProps;
    }

    onTick(drawer: Drawer, input: Input): TickResult {
        const curr = this.props;
        const [next, result] = this.doTick(curr, input);
        this.updateProps(next);
        this.doDraw(drawer, curr, this.props);
        return result;
    }

    private doTick(curr: Props, input: Input): [Partial<Props>, TickResult] {
        switch (curr.status.tag) {
            case "Init": {
                const status = this.doTickForInit();
                return [{ status }, {}];
            }
            case "WaitingUserSelectingTurn": {
                const nextProps = this.doTickForWaitingUserSelectingTurn(
                    curr,
                    input,
                );
                return [nextProps, {}];
            }
            case "WaitingPlayerTurn": {
                const nextProps = this.doTickForWaitingPlayerTurn(
                    curr,
                    input,
                );
                return [nextProps, {}];
            }
            case "WaitingMarkAppearing": {
                const status = this.doTickForWaitingMarkAppearing(
                    curr.status
                );
                return [{ status }, {}];
            }
            case "WaitingWinnerAppearing": {
                const status = this.doTickForWaitingWinnerAppearing(
                    curr.status,
                );
                return [{ status }, {}];
            }
            case "WaitingUserSelectRetry": {
                const status = this.doTickForWaitingUserSelectRetry(
                    curr.status,
                    input,
                );
                return [{ status }, {}];
            }
            case "Removing": {
                const result = {
                    finished: true,
                    next: Stage1Scene.create({ gameMode: 1 })
                };
                return [{}, result];
            }
            case "Removed": {
                return [{}, {}];
            }
            default: {
                throw new Error("Not implemented");
            }
        }
    }

    private doTickForInit(
    ): WaitingUserSelectingTurnState | WaitingPlayerTurnState {
        if (this.gameMode === 1) {
            return {
                tag: "WaitingUserSelectingTurn",
            };
        } else {
            return {
                tag: "WaitingPlayerTurn",
            };
        }
    }

    private doTickForWaitingUserSelectingTurn(
        curr: Props,
        input: Input
    ): Partial<Props> {
        if (!input.touchstart) {
            return curr;
        }
        const pos = input.touchstart.pos;
        const player = firstLabelRange.isHit(pos) ? "MAN"
            : secondLabelRange.isHit(pos) ? "CPU"
                : null;
        if (!player) {
            return curr;
        }
        const board = BoardW.create().board;
        return {
            board,
            turn: {
                player,
                mark: "o",
            },
            status: {
                tag: "WaitingPlayerTurn",
            }
        };
    }

    private doTickForWaitingPlayerTurn(
        curr: Props,
        input: Input
    ): Partial<Props> {
        switch (curr.turn.player) {
            case "MAN": {
                return this.doTickForWaitingTurnOfMan(curr, input);
            }
            case "CPU": {
                return this.doTickForWaitingTurnOfCpu(curr);
            }
        }
    }

    private doTickForWaitingTurnOfMan(
        curr: Props,
        input: Input
    ): Partial<Props> {
        if (!input.touchstart) {
            return curr;
        }
        const pos = input.touchstart.pos;
        if (!boardRange.isHit(pos)) {
            return curr;
        }
        const [nextSqId, sqRange] = sqRanges
            .find(x => x[1].isHit(pos))!;
        const boardW = BoardW.wrap(curr.board);
        if (!boardW.possibles.includes(nextSqId)) {
            return curr;
        }
        return {
            board: boardW.mark(nextSqId, curr.turn.mark).ok!.board,
            turn: {
                player: this.gameMode === 1 ? "CPU" : "MAN",
                mark: curr.turn.mark === "o" ? "x" : "o",
            },
            status: {
                tag: "WaitingMarkAppearing",
                move: {
                    turn: curr.turn,
                    sqRange,
                },
                remainingFrame: secToFrame(0.2),
            }
        };
    }

    private doTickForWaitingTurnOfCpu(
        curr: Props,
    ): Partial<Props> {
        const boardW = BoardW.wrap(curr.board);
        const candidates = Cpu1
            .create(curr.turn.mark)
            .nextCandidates(boardW.board);
        const nextSqId = candidates[Math.floor(Math.random() * candidates.length)];
        const sqRange = sqRanges
            .find(x => x[0] === nextSqId)![1];
        return {
            board: boardW.mark(nextSqId, curr.turn.mark).ok!.board,
            turn: {
                player: "MAN",
                mark: curr.turn.mark === "o" ? "x" : "o",
            },
            status: {
                tag: "WaitingMarkAppearing",
                move: {
                    turn: curr.turn,
                    sqRange,
                },
                remainingFrame: secToFrame(0.2),
            }
        };
    }

    private doTickForWaitingMarkAppearing(
        curr: WaitingMarkAppearingState,
    ): WaitingPlayerTurnState | WaitingMarkAppearingState | WaitingWinnerAppearingState {
        const remainingFrame = curr.remainingFrame - 1;
        if (remainingFrame > 0) {
            return {
                ...curr,
                remainingFrame
            };
        }
        const boardW = BoardW.wrap(this.props.board);
        if (boardW.winner) {
            return {
                tag: "WaitingWinnerAppearing",
                winner: curr.move.turn,
                remainingFrame: secToFrame(1.0),
            };
        }
        if (boardW.possibles.length === 0) {
            return {
                tag: "WaitingWinnerAppearing",
                winner: "DRAW",
                remainingFrame: secToFrame(1.0),
            };
        }
        return {
            tag: "WaitingPlayerTurn",
        };
    }

    private doTickForWaitingWinnerAppearing(
        curr: WaitingWinnerAppearingState,
    ): WaitingWinnerAppearingState | WaitingUserSelectRetryState {
        if (curr.remainingFrame > 1) {
            return {
                ...curr,
                remainingFrame: curr.remainingFrame - 1,
            };
        }
        return {
            tag: "WaitingUserSelectRetry",
        };
    }

    private doTickForWaitingUserSelectRetry(
        curr: WaitingUserSelectRetryState,
        input: Input,
    ): WaitingUserSelectRetryState | RemovingState {
        if (!input.touchstart) {
            return curr;
        }
        return {
            tag: "Removing",
        };
    }

    private doDraw(drawer: Drawer, curr: Props, next: Props) {
        const nextStatusTag = next.status.tag;
        switch (nextStatusTag) {
            case "WaitingUserSelectingTurn":
                if (nextStatusTag !== curr.status.tag) {
                    drawer.onWaitingUserSelectingTurnStarted(
                        firstLabelRange,
                        secondLabelRange,
                    );
                }
                return;
            case "WaitingPlayerTurn":
                if (nextStatusTag !== curr.status.tag) {
                    drawer.onWaitingPlayerTurnStarted();
                }
                return;
            case "WaitingMarkAppearing":
                if (nextStatusTag !== curr.status.tag) {
                    drawer.onWaitingMarkAppearingStarted(next.status.move);
                }
                return;
            case "WaitingWinnerAppearing":
                if (nextStatusTag !== curr.status.tag) {
                    drawer.onWaitingWinnerAppearingStarted(
                        this.gameMode,
                        next.status.winner,
                        next.status.remainingFrame,
                    );
                }
                return;
            default:
                return;
        }
    }
}
