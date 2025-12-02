import { Input } from "@src/app/port/in/IGameEngine";
import { ITitleSceneDrawer } from "@src/app/port/out/ITitleSceneDrawer";
import { config } from "@src/common/config";
import { secToFrame } from "@src/common/util";
import { IScene, TickResult } from "../IScene";
import { RectRange } from "../RectRange";
import { Stage1Scene } from "../stage1/Stage1Scene";

const name = "Title";
type Drawer = ITitleSceneDrawer;
type RoProps = Readonly<Props>;
type Props = {
    frame: number,
    status: State,
};

type State =
    PlayingState |
    GameModesShowingState |
    RemovingState |
    RemovedState;

type PlayingState = { tag: "Playing" };
type GameModesShowingState = { tag: "GameModesShowingState" };
type RemovingState = {
    tag: "Removing",
    remainingFrame: number,
    gameMode: GameMode,
};
type RemovedState = { tag: "Removed" };

type GameMode = 1 | 2;

const defaultProps: RoProps = {
    frame: 0,
    status: { tag: "Playing" },
};

export class TitleScene implements IScene<typeof name, RoProps, Drawer> {
    static create(): TitleScene {
        return new this();
    }

    private constructor() {
        this._props = defaultProps;
    }

    private _props: RoProps;
    private readonly highLabelRange = RectRange.fromLeftTopAndSize(
        config.screen.width / 2.0 - 90,
        config.screen.height * 6 / 9,
        180,
        30,
    );
    private readonly lowLabelRange = RectRange.fromLeftTopAndSize(
        config.screen.width / 2.0 - 90,
        config.screen.height * 7 / 9,
        180,
        30,
    );

    private updateProps(next: Partial<Props>) {
        const frame = this._props.frame + 1;
        this._props = {
            ...this._props,
            ...next,
            frame,
        };
    }

    get name(): typeof name {
        return name;
    }

    get props(): RoProps {
        return this._props;
    }

    onAdded(drawer: Drawer): void {
        this._props = defaultProps;
        drawer.onSceneAdded();
    }

    onRemoved(drawer: Drawer): void {
        drawer.onSceneRemoved();
        this._props = defaultProps;
    }

    onTick(drawer: Drawer, input: Input): TickResult {
        const curr = this.props;
        const [next, result] = this.doTick(drawer, curr, input);
        this.updateProps(next);
        return result;
    }

    private doTick(drawer: Drawer, curr: RoProps, input: Input): [Partial<RoProps>, TickResult] {
        switch (curr.status.tag) {
            case "Playing":
                return this.doTickForPlaying(drawer, input);
            case "GameModesShowingState":
                return this.doTickForGameModesShowing(drawer, input);
            case "Removing":
                return this.doTickForRemoving(curr.status);
            case "Removed":
                return [{}, {}];
            default:
                throw new Error("Not implemented");
        }
    }

    private doTickForPlaying(drawer: Drawer, input: Input): [Partial<Props>, TickResult] {
        const next: Partial<Props> = {};
        if (!!input.touchstart) {
            next.status = {
                tag: "GameModesShowingState",
            };
            drawer.onGameModesShown();
        }
        return [next, {}];
    }

    private doTickForGameModesShowing(drawer: Drawer, input: Input): [Partial<Props>, TickResult] {
        const next: Partial<Props> = {};
        if (!input.touchstart) {
            return [next, {}];
        }
        const pos = input.touchstart.pos;
        const gameMode = this.highLabelRange.isHit(pos) ? 1
            : this.lowLabelRange.isHit(pos) ? 2
                : null;
        if (!gameMode) {
            return [next, {}];
        }
        const curtainFrame = secToFrame(config.title.curtainingSec);
        next.status = {
            tag: "Removing",
            remainingFrame: curtainFrame,
            gameMode,
        };
        drawer.onSceneRemovalStarted(curtainFrame);
        return [next, {}];
    }

    private doTickForRemoving(curr: RemovingState): [Partial<Props>, TickResult] {
        if (curr.remainingFrame > 0) {
            const remainingFrame = curr.remainingFrame - 1;
            const next = {
                tag: curr.tag,
                remainingFrame,
                gameMode: curr.gameMode,
            };
            return [
                { status: next },
                {}
            ];
        } else {
            const data = {
                gameMode: curr.gameMode,
            };
            return [
                { status: { tag: "Removed" } },
                { next: Stage1Scene.create(data) }
            ];
        }
    }
}

