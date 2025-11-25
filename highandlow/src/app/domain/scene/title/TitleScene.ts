import { Input } from "@src/app/port/in/IGameEngine";
import { ITitleSceneDrawer } from "@src/app/port/out/ITitleSceneDrawer";
import { config } from "@src/common/config";
import { secToFrame } from "@src/common/util";
import { IScene, TickResult } from "../IScene";

type RoProps = Readonly<Props>;
type Props = {
    frame: number,
    status: State,
};

type State =
    PlayingState |
    RemovingState |
    RemovedState;
type PlayingState = { tag: "Playing" };
type RemovingState = { tag: "Removing", remainingFrame: number };
type RemovedState = { tag: "Removed" };

const defaultProps: RoProps = {
    frame: 0,
    status: { tag: "Playing" },
};

export class TitleScene implements IScene<RoProps> {
    static create(drawer: ITitleSceneDrawer): TitleScene {
        return new this(drawer);
    }

    private constructor(drawer: ITitleSceneDrawer) {
        this._props = defaultProps;
        this.drawer = drawer;
    }

    private _props: RoProps;
    private readonly drawer: ITitleSceneDrawer;

    private updateProps(next: Partial<Props>) {
        const frame = this._props.frame + 1;
        this._props = {
            ...this._props,
            ...next,
            frame,
        };
    }

    get props(): RoProps {
        return this._props;
    }

    onAdded(): void {
        this._props = defaultProps;
        this.drawer.onSceneAdded();
    }

    onRemoved(): void {
        this.drawer.onSceneRemoved();
        this._props = defaultProps;
    }

    onTick(input: Input): TickResult {
        const curr = this.props;
        const [next, result] = this.doTick(curr, input);
        this.updateProps(next);
        return result;
    }

    private doTick(curr: RoProps, input: Input): [Partial<RoProps>, TickResult] {
        switch (curr.status.tag) {
            case "Playing":
                return this.doTickForPlaying(input);
            case "Removing":
                return this.doTickForRemoving(curr.status);
            case "Removed":
                return [{}, {}];
            default:
                throw new Error("Not implemented");
        }
    }

    private doTickForPlaying(input: Input): [Partial<Props>, TickResult] {
        const next: Partial<Props> = {};
        if (!!input.touchstart) {
            const curtainFrame = secToFrame(config.title.curtainingSec);
            next.status = {
                tag: "Removing",
                remainingFrame: curtainFrame,
            };
            this.drawer.onSceneRemovalStarted(curtainFrame);
        }
        return [next, {}];
    }

    private doTickForRemoving(curr: RemovingState): [Partial<Props>, TickResult] {
        if (curr.remainingFrame > 0) {
            const remainingFrame = curr.remainingFrame - 1;
            const next = {
                tag: curr.tag,
                remainingFrame,
            };
            return [
                { status: next },
                {}
            ];
        } else {
            return [
                { status: { tag: "Removed" } },
                { next: "Stage1" }
            ];
        }
    }
}
