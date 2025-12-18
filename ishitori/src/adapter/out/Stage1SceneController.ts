import { Label as ELabel, Scene as EScene, Sprite, Timeline } from "enchant.js";

import { PlayFieldW } from "@src/app/domain/model/PlayFieldW";
import { Player } from "@src/app/domain/model/types";
import { SceneState } from "@src/app/domain/scene/Stage1Scene";
import { Input, Pos } from "@src/app/port/in/IGameEngine";
import { IStage1SceneController } from "@src/app/port/out/IStage1SceneController";
import { config } from "@src/common/config";
import { secToFrame, seq } from "@src/common/util";
import { IRepo } from "../IRepo";
import { RectRange } from "./RectRange";

const c_entities = {
    maxNumPickTitle: {
        text: "一回で取れる石の数：",
        size: 40,
        width: 40 * 10,
        x: 10 + config.screen.width * 0 / 9,
        y: 10,
    } as const,
    maxNumPickVal: {
        text: "",
        size: 40,
        x: config.screen.width * 6 / 9,
        y: 10,
    },
    numStonesTitle: {
        text: "石の数：",
        size: 40,
        x: 10 + config.screen.width * 3 / 9 + 35,
        y: 10 + 40,
    } as const,
    numStonesVal: {
        text: "",
        size: 40,
        x: config.screen.width * 6 / 9,
        y: 10 + 40,
    } as const,
    firstTurnTitle: {
        text: "先手",
        size: 80,
        color: "black",
        backgroundColor: "white",
        width: 80 * 2,
        height: 80,
        x: (config.screen.width - 80 * 2) / 2,
        y: config.screen.height * 3 / 9,
    } as const,
    secondTurnTitle: {
        text: "後手",
        size: 80,
        color: "black",
        backgroundColor: "white",
        width: 80 * 2,
        height: 80,
        x: (config.screen.width - 80 * 2) / 2,
        y: config.screen.height * 5 / 9,
    } as const,
    countdownVal: {
        text: "",
        size: 80,
        color: "black",
        backgroundColor: "yellow",
        width: 80 * 3 / 4,
        height: 80,
        x: (config.screen.width - 80 * 3 / 4) / 2,
        y: config.screen.height * 2 / 11,
    } as const,
    numPickVal: {
        text: "",
        size: 80,
        color: "black",
        backgroundColor: "white",
        width: 80 * 3 / 4,
        height: 80,
        x: 0,
        y: config.screen.height * 5 / 9,
    } as const,
    winnerVal: {
        text: "",
        size: 80,
        x: 0,
        y: config.screen.height * 4 / 9,
    } as const,
    retryTitle: {
        text: "再戦",
        size: 80,
        color: "black",
        backgroundColor: "white",
        width: 80 * 2,
        height: 80,
        x: (config.screen.width - 80 * 2) / 2,
        y: config.screen.height * 6 / 9,
    } as const,
} as const;

const c_states = {
    "OnCreated": {
    } as const,
    "OnWaitingInit": {
        waitingFrame: secToFrame(2),
    } as const,
    "OnWaitingUserSelectTurn": {
        waitingFrame: secToFrame(5),
    } as const,
    "OnUserSelectedTurn": {
        waitingFrame: secToFrame(1),
    } as const,
    "OnWaitingCpuFinishTurn": {
        waitingFrame: secToFrame(0.2),
    } as const,
    "OnWaitingUserFinishTurn": {
        waitingFrame: secToFrame(5),
    } as const,
    "OnPlayerFinishedTurn": {
        waitingFrame: secToFrame(1),
    } as const,
    "OnGameFinished": {
        waitingFrame: secToFrame(1),
    } as const,
    "OnWaitingUserSelectRetry": {
    } as const,
    "OnUserSelectedRetry": {
        waitingFrame: secToFrame(1),
    } as const,
    "OnFinished": {
    } as const,
} as const;

export class Stage1SceneController implements IStage1SceneController {
    constructor(repo: IRepo) {
        this.repo = repo;
        this.scene = this.repo.pushNewScene();
    }

    private readonly repo: IRepo;
    private readonly scene: EScene;
    private readonly retryLabel: ELabel = new ELabel("再戦する？");
    private readonly entities = Entities.create();
    private _input: Input = { frame: 0 };

    set input(v: Input) {
        this._input = v;
    }

    private get pos(): Pos | undefined {
        return this._input.touchstart?.pos;
    }

    randValFrom(vals: number[]): number {
        const random = Math.random();
        const index = Math.floor(vals.length * random);
        return vals[index];
    }

    fetchSelectedTurn(): Player | undefined {
        const pos = this.pos;
        if (!pos) {
            return undefined;
        }
        return this.entities.findSelectedTurnVal(pos);
    }

    fetchSelectedNumPick(): number | undefined {
        const pos = this.pos;
        if (!pos) {
            return undefined;
        }
        return this.entities.findSelectedNumPickVal(pos);
    }

    isRetrySelected(): boolean {
        const pos = this.pos;
        if (!pos) {
            return false;
        }
        return this.entities.findSelectedRetryTitle(pos);
    }

    isWaiting(status: SceneState): boolean {
        if ("frame" in status) {
            return status.frame < c_states[status.tag].waitingFrame;
        }
        return true;
    }

    drawScene(status: SceneState): void {
        switch (status.tag) {
            case "OnCreated":
                throw new Error("here cannot be reached. status=" + JSON.stringify(status));
            case "OnWaitingInit": {
                if (status.frame === 0) {
                    this.entities.showNumStonesLabels(
                        this.scene,
                        status.playField.numStones
                    );
                }
                if (status.frame === secToFrame(1)) {
                    this.entities.showMaxNumPickLabels(
                        this.scene,
                        status.playField.maxNumPick
                    );
                }
                return;
            }
            case "OnWaitingUserSelectTurn": {
                const remainingFrame = c_states[status.tag].waitingFrame - status.frame;
                if (status.frame === 0) {
                    this.entities.showTurnSelectionLabels(this.scene);
                    this.entities.showCountdownLabel(this.scene, remainingFrame);
                    return;
                }
                if (remainingFrame == 0) {
                    this.entities.removeCountdownLabel();
                    return;
                }
                if (remainingFrame % config.screen.fps != 0) {
                    return;
                }
                this.entities.updateCountdownLabel(remainingFrame);
                return;
            }
            case "OnUserSelectedTurn": {
                if (status.frame === 0) {
                    this.entities.removeCountdownLabel();
                    this.entities.selectTurnVal(status.nextPlayer);
                }
                return;
            }
            case "OnWaitingCpuFinishTurn": {
                if (status.frame === 0) {
                    const numPickableStones = PlayFieldW
                        .wrap(status.playField)
                        .numPickableStones!;
                    this.entities.showNumPickLabels(
                        this.scene,
                        numPickableStones,
                    );
                }
                return;
            }
            case "OnWaitingUserFinishTurn": {
                const remainingFrame = c_states[status.tag].waitingFrame - status.frame;
                if (status.frame === 0) {
                    const numPickableStones = PlayFieldW
                        .wrap(status.playField)
                        .numPickableStones!;
                    this.entities.showNumPickLabels(
                        this.scene,
                        numPickableStones,
                    );
                    this.entities.showCountdownLabel(this.scene, remainingFrame);
                    return;
                }
                if (remainingFrame == 0) {
                    this.entities.removeCountdownLabel();
                    return;
                }
                if (remainingFrame % config.screen.fps != 0) {
                    return;
                }
                this.entities.updateCountdownLabel(remainingFrame);
                return;
            }
            case "OnPlayerFinishedTurn": {
                if (status.frame === 0) {
                    this.entities.removeCountdownLabel();
                    this.entities.selectNumPickVal(status.turn.numPick);
                    this.entities.updateNumStonesLabel(
                        status.playField.numStones
                    );
                }
                return;
            }
            case "OnGameFinished": {
                if (status.frame === 0) {
                    this.entities.showWinnerLabel(this.scene, status.winner);
                }
                return;
            }
            case "OnWaitingUserSelectRetry": {
                this.entities.showRetryLabel(this.scene);
                return;
            }
            case "OnUserSelectedRetry": {
                if (status.frame === 0) {
                    this.entities.showCurtain(this.scene);
                }
                return;
            }
            case "OnFinished": {
                this.scene!.remove();
                return;
            }
            default:
                throw new Error("Not Implemented. status=" + JSON.stringify(status));
        }
    }
}

class Entities {
    static create() {
        return new this();
    }

    private constructor() {
        this.numStonesVal = Label1.create(c_entities.numStonesVal);
        this.firstTurnVal = Label1.create(c_entities.firstTurnTitle);
        this.secondTurnVal = Label1.create(c_entities.secondTurnTitle);
        this.countdownVal = Label1.create(c_entities.countdownVal);
        this.numPickVals = [];
        this.retryTitle = Label1.create(c_entities.retryTitle);
    }

    readonly numStonesVal: Label1;
    readonly firstTurnVal: Label1;
    readonly secondTurnVal: Label1;
    readonly countdownVal: Label1;
    readonly numPickVals: Label1[];
    readonly retryTitle: Label1;

    showMaxNumPickLabels(scene: EScene, maxNumPick: number) {
        {
            const a = Label1.create(c_entities.maxNumPickTitle);
            scene.addChild(a);
        }
        {
            const a = Label1.create(c_entities.maxNumPickVal);
            a.text = `${maxNumPick}`;
            scene.addChild(a);
        }
    }

    showNumStonesLabels(scene: EScene, numStones: number) {
        {
            const a = Label1.create(c_entities.numStonesTitle);
            scene.addChild(a);
        }
        {
            const a = this.numStonesVal;
            a.text = `${numStones}`;
            scene.addChild(a);
        }
    }

    updateNumStonesLabel(numStones: number) {
        this.numStonesVal.text = `${numStones}`;
    }

    showTurnSelectionLabels(scene: EScene) {
        scene.addChild(this.firstTurnVal);
        scene.addChild(this.secondTurnVal);
    }

    findSelectedTurnVal(pos: Pos): Player | undefined {
        if (this.firstTurnVal.contains(pos)) {
            return "MAN";
        }
        if (this.secondTurnVal.contains(pos)) {
            return "CPU";
        }
        return undefined;
    }

    selectTurnVal(nextPlayer: string) {
        const [selected, not] = nextPlayer === "MAN"
            ? [this.firstTurnVal, this.secondTurnVal]
            : [this.secondTurnVal, this.firstTurnVal];
        new Timeline(selected)
            .fadeOut(c_states.OnUserSelectedTurn.waitingFrame)
            .then(() => selected.remove());
        not.remove();
    }

    showCountdownLabel(scene: EScene, remainingFrame: number) {
        this.countdownVal.text = `${remainingFrame / config.screen.fps}`;
        scene.addChild(this.countdownVal);
    }

    updateCountdownLabel(remainingFrame: number) {
        this.countdownVal.text = `${remainingFrame / config.screen.fps}`;
    }

    removeCountdownLabel() {
        this.countdownVal.remove();
    }

    showNumPickLabels(scene: EScene, numPickableStones: number) {
        const space = 5;
        const width = (c_entities.numPickVal.width + space) * numPickableStones;
        const left = (config.screen.width - width) / 2;
        for (const i of seq(0, numPickableStones)) {
            const a = Label1.create(c_entities.numPickVal);
            a.text = `${i + 1}`;
            a.x = left + (a.width + space) * i;
            this.numPickVals.push(a);
            scene.addChild(a);
        }
    }

    findSelectedNumPickVal(pos: Pos): number | undefined {
        for (const a of this.numPickVals) {
            if (a.contains(pos)) {
                return Number.parseInt(a.text);
            }
        }
        return undefined;
    }

    selectNumPickVal(numPick: number) {
        for (const a of this.numPickVals.splice(0)) {
            const num = Number.parseInt(a.text);
            if (num !== numPick) {
                a.remove();
                continue;
            }
            new Timeline(a)
                .fadeOut(c_states.OnPlayerFinishedTurn.waitingFrame)
                .then(() => a.remove());
        }
    }

    showWinnerLabel(scene: EScene, winner: Player) {
        const text = winner === "MAN"
            ? `あなたの勝ち`
            : `あなたの負け`;
        const width = c_entities.winnerVal.size * text.length;
        const a = Label1.create(c_entities.winnerVal);
        a.text = text;
        a.width = width;
        a.x = (config.screen.width - width) / 2;
        scene.addChild(a);
    }

    showRetryLabel(scene: EScene) {
        scene.addChild(this.retryTitle);
    }

    findSelectedRetryTitle(pos: Pos): boolean {
        return this.retryTitle.contains(pos);
    }

    showCurtain(scene: EScene) {
        const a = new Sprite(config.screen.width, config.screen.height);
        a.backgroundColor = "black";
        a.opacity = 0;
        scene.addChild(a);
        new Timeline(a).fadeIn(secToFrame(0.9));
    }
}

class Label1 extends ELabel {
    static create(p: {
        text?: string,
        size?: number,
        color?: string,
        backgroundColor?: string,
        width?: number,
        height?: number,
        x?: number,
        y?: number,
    }) {
        const text = p.text ?? "";
        const a = new this(text);
        const size = p.size ?? 10;
        a.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        a.color = p.color ?? "black";
        a.backgroundColor = p.backgroundColor ?? "transparent";
        if (!!p.width) {
            a.width = p.width;
        }
        if (!!p.height) {
            a.height = p.height;
        }
        a.x = p.x ?? 0;
        a.y = p.y ?? 0;
        return a;
    }

    private constructor(text: string) {
        super(text);
    }

    contains(pos: Pos): boolean {
        const r = RectRange
            .fromLeftTopAndSize(this.x, this.y, this.width, this.height);
        return r.contains(pos);
    }
}
