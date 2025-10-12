import { Input } from "@src/app/port/in/IGameEngine";
import { TitleSceneEvent } from "@src/app/port/in/sceneevent/TitleSceneEvent";
import { createSceneError, secToFrame } from "@src/common/util";
import { Kuma, KumaOp } from "../../model/Kuma";
import { IScene, TickResult } from "../IScene";
import { SceneEventPublisher } from "../SceneEventPublisher";

type Props = {
    frame: number,
    kuma1: Kuma,
    kuma2: Kuma,
    kuma3: Kuma,
    kuma4: Kuma,
    status: State,
};

type PartialProps = {
    kuma1?: Kuma,
    kuma2?: Kuma,
    kuma3?: Kuma,
    kuma4?: Kuma,
    status?: State,
};

type State =
    PlayingState |
    RemovingState |
    RemovedState;
type PlayingState = {
    tag: "Playing",
};
type RemovingState = {
    tag: "Removing",
    remainingFrame: number,
};
type RemovedState = {
    tag: "Removed",
};

const defaultProps: Props = {
    frame: 0,
    kuma1: KumaOp.create(1)
        .moveTo(50, 50)
        .props,
    kuma2: KumaOp.create(2)
        .moveTo(50, 100)
        .rotate(45)
        .props,
    kuma3: KumaOp.create(3)
        .moveTo(50, 150)
        .scale(3, 2)
        .props,
    kuma4: KumaOp.create(4)
        .moveTo(50, 200)
        .props,
    status: { tag: "Playing" },
};

export class TitleScene implements IScene<TitleSceneEvent> {
    static create(): TitleScene {
        return new TitleScene(structuredClone(defaultProps));
    }

    private constructor(props: Props) {
        this.props = props;
    }

    private readonly props: Props;

    readonly eventPublisher = SceneEventPublisher.create<TitleSceneEvent>();

    onAdded(): void {
        const props = this.init();
        Object.assign(this.props, props);
    }

    onRemoved(): void {
        this.eventPublisher.publish({
            tag: "SceneRemoved",
        });
    }

    onTick(input: Input): TickResult {
        try {
            const [props, result] = this.doBeforeTick(input);
            const frame = this.props.frame + 1;
            Object.assign(
                this.props,
                { ...props, frame }
            );
            return result;
        } catch (e: unknown) {
            throw createSceneError(e, this.props);
        }
    }

    private init(): Props {
        const props = structuredClone(defaultProps);
        this.eventPublisher.publish({
            tag: "SceneAdded",
        });
        this.eventPublisher.publish({
            tag: "ObjectAdded",
            ...structuredClone(props.kuma1),
        });
        this.eventPublisher.publish({
            tag: "ObjectAdded",
            ...structuredClone(props.kuma2),
        });
        this.eventPublisher.publish({
            tag: "ObjectAdded",
            ...structuredClone(props.kuma3),
        });
        this.eventPublisher.publish({
            tag: "ObjectAdded",
            ...structuredClone(props.kuma4),
        });
        return props;
    }

    private doBeforeTick(input: Input): [PartialProps, TickResult] {
        const status = this.props.status;
        switch (status.tag) {
            case "Playing":
                return this.doTickForPlaying(input);
            case "Removing":
                if (status.remainingFrame > 0) {
                    return this.doTickForRemoving(status);
                } else {
                    return this.doTickForFinishRemoving();
                }
            case "Removed":
                return [{}, {}];
        }
    }

    private doTickForPlaying(input: Input): [PartialProps, TickResult] {
        const p0 = input.touchstart.tag === "TouchStart"
            ? this.removeScene()
            : {};
        const p1 = this.moveKuma();
        const props = {
            ...structuredClone(p0),
            ...structuredClone(p1),
        };
        return [props, {}];
    }

    private doTickForRemoving(status: RemovingState): [PartialProps, TickResult] {
        const p0 = this.moveKuma();
        const newStatus: State = {
            tag: status.tag,
            remainingFrame: status.remainingFrame - 1
        };
        const props = {
            ...structuredClone(p0),
            status: newStatus,
        };
        return [props, {}];
    }

    private doTickForFinishRemoving(): [PartialProps, TickResult] {
        const props = this.finishRemovingScene();
        return [
            { ...structuredClone(props), },
            { next: "Stage1" }
        ];
    }

    private moveKuma(): { kuma4: Kuma } {
        const kuma4 = KumaOp.clone(this.props.kuma4)
            .walkBy(1, 0)
            .props;
        this.eventPublisher.publish({
            tag: "ObjectMoved",
            ...structuredClone(kuma4),
        });
        return { kuma4 };
    }

    private removeScene(): { status: State } {
        const status: State = {
            tag: "Removing",
            remainingFrame: secToFrame(0.1),
        };
        this.eventPublisher.publish({
            tag: "SceneRemoving",
            remainingFrame: status.remainingFrame,
        });
        return { status };
    }

    private finishRemovingScene(): { status: State } {
        const status: State = { tag: "Removed", };
        return { status };
    }
}
