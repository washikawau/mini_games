import { IStage1SceneController } from "@src/app/port/out/IStage1SceneController";
import { seq } from "@src/common/util";
import { Cpu1 } from "../model/Cpu1";
import { PlayFieldW } from "../model/PlayFieldW";
import { PlayerW } from "../model/PlayerW";
import { GameMode, PlayField, Player } from "../model/types";
import { IScene, TickResult } from "./IScene";

const name = "Stage1";
type Controller = IStage1SceneController;
type Props = {
    readonly gameMode: GameMode,
    readonly status: SceneState,
};

export class Stage1Scene implements IScene<typeof name, Props, Controller> {
    static create(
        data: { gameMode: GameMode },
    ): Stage1Scene {
        return new this(data);
    }

    private constructor(
        data: { gameMode: GameMode },
    ) {
        this._props = {
            gameMode: data.gameMode,
            status: { tag: "OnCreated" },
        };
    }

    private _props: Props;

    get name(): typeof name {
        return name;
    }

    get props(): Props {
        return this._props;
    }

    private updateProps(next: Partial<Props>): Props {
        this._props = {
            ...this._props,
            ...next,
        };
        return this._props;
    }

    onAdded(controller: Controller): void {
        // controller.drawScene({
        //     tag: "OnCreated",
        // });
    }

    onRemoved(controller: Controller): void {
        // controller.drawScene({
        //     tag: "OnFinished",
        // });
    }

    onTick(controller: Controller): TickResult {
        const curr = this.props;
        const nextStatus = tick(controller, curr);
        const next = this.updateProps({
            status: nextStatus
        });
        controller.drawScene(next.status);
        if (next.status.tag === "OnFinished") {
            return {
                finished: true,
                next: Stage1Scene.create(this.props),
            };
        } else {
            return {};
        }
    }
}

const c = {
    maxNumPickCands: [...seq(2, 9)],
    turnsCands: [...seq(5, 9)],
} as const;

export type SceneState =
    OnCreated |
    OnWaitingInit |
    OnWaitingUserSelectTurn |
    OnUserSelectedTurn |
    OnWaitingCpuFinishTurn |
    OnWaitingUserFinishTurn |
    OnPlayerFinishedTurn |
    OnGameFinished |
    OnWaitingUserSelectRetry |
    OnUserSelectedRetry |
    OnFinished;
type OnCreated = {
    readonly tag: "OnCreated",
};
type OnWaitingUserSelectTurn = {
    readonly tag: "OnWaitingUserSelectTurn",
    readonly playField: PlayField,
    readonly frame: number,
};
type OnWaitingInit = {
    readonly tag: "OnWaitingInit",
    readonly playField: PlayField,
    readonly frame: number,
};
type OnUserSelectedTurn = {
    readonly tag: "OnUserSelectedTurn",
    readonly playField: PlayField,
    readonly nextPlayer: Player,
    readonly frame: number,
};
type OnWaitingCpuFinishTurn = {
    readonly tag: "OnWaitingCpuFinishTurn",
    readonly playField: PlayField,
    readonly frame: number,
};
type OnWaitingUserFinishTurn = {
    readonly tag: "OnWaitingUserFinishTurn",
    readonly playField: PlayField,
    readonly frame: number,
};
type OnPlayerFinishedTurn = {
    readonly tag: "OnPlayerFinishedTurn",
    readonly playField: PlayField,
    readonly turn: {
        readonly player: Player,
        readonly numPick: number,
    },
    readonly frame: number,
};
type OnGameFinished = {
    readonly tag: "OnGameFinished",
    readonly winner: Player,
    readonly frame: number,
};
type OnWaitingUserSelectRetry = {
    readonly tag: "OnWaitingUserSelectRetry",
};
type OnUserSelectedRetry = {
    readonly tag: "OnUserSelectedRetry",
    readonly frame: number,
}
type OnFinished = {
    readonly tag: "OnFinished",
};

function tick(
    controller: Controller,
    curr: Props,
): SceneState {
    const status = curr.status;
    switch (status.tag) {
        case "OnCreated": {
            const playField = createPlayField(controller);
            return createOnWaitingInit(playField);
        }
        case "OnWaitingInit": {
            if (controller.isWaiting(status)) {
                return incFrame(status);
            }
            return toOnWaitingUserSelectTurn(status);
        }
        case "OnWaitingUserSelectTurn": {
            const selectedU = controller.fetchSelectedTurn();
            if (!!selectedU) {
                return toOnUserSelectedTurn(status, selectedU);
            }
            if (controller.isWaiting(status)) {
                return incFrame(status);
            }
            const selectedC = Cpu1
                .create()
                .selectTurn(status.playField);
            return toOnUserSelectedTurn(status, selectedC);
        }
        case "OnUserSelectedTurn": {
            if (controller.isWaiting(status)) {
                return incFrame(status);
            }
            if (status.nextPlayer === "CPU") {
                return toOnWaitingCpuFinishTurn(status);
            } else {
                return toOnWaitingUserFinishTurn(status);
            }
        }
        case "OnWaitingCpuFinishTurn": {
            if (controller.isWaiting(status)) {
                return incFrame(status);
            }
            const cands = Cpu1
                .create()
                .selectNumPickCandidates(status.playField);
            const numPick = controller.randValFrom(cands);
            return toOnPlayerFinishedTurn(status, "CPU", numPick);
        }
        case "OnWaitingUserFinishTurn": {
            const selected = controller.fetchSelectedNumPick();
            if (!!selected) {
                return toOnPlayerFinishedTurn(status, "MAN", selected);
            }
            if (controller.isWaiting(status)) {
                return incFrame(status);
            }
            const numPickableStones = PlayFieldW
                .wrap(status.playField)
                .numPickableStones!;
            const arr = [...seq(1, numPickableStones + 1)];
            const numPick = controller.randValFrom(arr);
            return toOnPlayerFinishedTurn(status, "MAN", numPick);
        }
        case "OnPlayerFinishedTurn": {
            if (controller.isWaiting(status)) {
                return incFrame(status);
            }
            const playFieldW = PlayFieldW.wrap(status.playField);
            if (!playFieldW.numPickableStones) {
                const winner = PlayerW.wrap(status.turn.player).opponent;
                return createOnGameFinished(winner);
            }
            if (status.turn.player === "CPU") {
                return toOnWaitingUserFinishTurn(status);
            } else {
                return toOnWaitingCpuFinishTurn(status);
            }
        }
        case "OnGameFinished": {
            if (controller.isWaiting(status)) {
                return incFrame(status);
            }
            return createOnWaitingUserSelectRetry();
        }
        case "OnWaitingUserSelectRetry": {
            const selected = controller.isRetrySelected();
            if (!!selected) {
                return createOnUserSelectedRetry();
            }
            return status;
        }
        case "OnUserSelectedRetry": {
            if (controller.isWaiting(status)) {
                return incFrame(status);
            }
            return {
                tag: "OnFinished",
            };
        }
        default:
            throw new Error("Not Implemented. status=" + status);
    }
}

function incFrame<T extends SceneState>(curr: T): T {
    if ("frame" in curr) {
        return {
            ...curr,
            frame: curr.frame + 1,
        };
    }
    return curr;
}

function createPlayField(
    controller: Controller,
): PlayField {
    const maxNumPick = controller.randValFrom(c.maxNumPickCands);
    const randRemains = [...seq(0, maxNumPick)];
    const numStones = maxNumPick * controller.randValFrom(c.turnsCands) +
        controller.randValFrom(randRemains);
    return {
        maxNumPick,
        numStones,
    };
}

function createOnWaitingInit(
    playField: PlayField,
): OnWaitingInit {
    return {
        tag: "OnWaitingInit",
        playField,
        frame: 0,
    };
}

function toOnWaitingUserSelectTurn(
    curr: OnWaitingInit,
): OnWaitingUserSelectTurn {
    return {
        tag: "OnWaitingUserSelectTurn",
        playField: curr.playField,
        frame: 0,
    };
}

function toOnUserSelectedTurn(
    curr: OnWaitingUserSelectTurn,
    nextPlayer: Player,
): OnUserSelectedTurn {
    return {
        tag: "OnUserSelectedTurn",
        playField: curr.playField,
        nextPlayer,
        frame: 0,
    };
}

function toOnWaitingCpuFinishTurn(
    curr: OnUserSelectedTurn | OnPlayerFinishedTurn,
): OnWaitingCpuFinishTurn {
    return {
        tag: "OnWaitingCpuFinishTurn",
        playField: curr.playField,
        frame: 0,
    };
}

function toOnWaitingUserFinishTurn(
    curr: OnUserSelectedTurn | OnPlayerFinishedTurn,
): OnWaitingUserFinishTurn {
    return {
        tag: "OnWaitingUserFinishTurn",
        playField: curr.playField,
        frame: 0,
    };
}

function toOnPlayerFinishedTurn(
    curr: OnWaitingCpuFinishTurn | OnWaitingUserFinishTurn | OnWaitingUserFinishTurn,
    player: Player,
    numPick: number,
): OnPlayerFinishedTurn {
    return {
        tag: "OnPlayerFinishedTurn",
        playField: {
            ...curr.playField,
            numStones: curr.playField.numStones - numPick,
        },
        turn: {
            player,
            numPick,
        },
        frame: 0,
    };
}

function createOnGameFinished(
    winner: Player,
): OnGameFinished {
    return {
        tag: "OnGameFinished",
        winner,
        frame: 0,
    };
}

function createOnWaitingUserSelectRetry(
): OnWaitingUserSelectRetry {
    return {
        tag: "OnWaitingUserSelectRetry",
    };
}

function createOnUserSelectedRetry(
): OnUserSelectedRetry {
    return {
        tag: "OnUserSelectedRetry",
        frame: 0,
    };
}
