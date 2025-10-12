import { Input } from "@src/app/port/in/IGameEngine";
import { Stage1SceneEvent } from "@src/app/port/in/sceneevent/Stage1SceneEvent";
import { createSceneError, randfloat, secToFrame } from "@src/common/util";
import { Kuma, KumasOp, RemovedKuma } from "../../model/Kuma";
import { IScene, TickResult } from "../IScene";
import { SceneEventPublisher } from "../SceneEventPublisher";

type Props = {
    frame: number,
    score: number,
    kumas: Kuma[],
};

type PartialProps = {
    score?: number,
    kumas?: Kuma[],
};

type Label = {
    x: number,
    y: number,
    remainingFrame: number,
};

const defaultProps: Props = {
    frame: 0,
    score: 0,
    kumas: [],
};

export class Stage1Scene implements IScene<Stage1SceneEvent> {
    static create(): Stage1Scene {
        return new Stage1Scene(structuredClone(defaultProps));
    }

    private constructor(props: Props) {
        this.props = props;
    }

    private readonly props: Props;

    readonly eventPublisher = SceneEventPublisher.create<Stage1SceneEvent>();

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
        return props;
    }

    private doBeforeTick(input: Input): [PartialProps, TickResult] {
        const props = structuredClone(this.props);
        let plusPoints = 0;
        const kumasOp = KumasOp
            .wrap(props.kumas)
            .removeIfTouched(
                input.touchstart,
                kumas => {
                    this.removeKumas(kumas);
                    plusPoints = kumas.reduce((accum, x) => accum + x.point, 0);
                }
            )
            .move(
                kumas => this.moveKumas(kumas)
            )
            .popupIfTime(
                props.frame,
                kuma => this.addKuma(kuma)
            );
        if (props.frame % secToFrame(0.2) === 0) {
            this.popupRandomLabel();
        }
        const kumas = kumasOp.kumas;
        const score = props.score + plusPoints;
        this.changeScore(score);
        return [
            { kumas, score },
            {}
        ];
    }

    private changeScore(score: number) {
        this.eventPublisher.publish({
            tag: "ScoreChanged",
            text: `${score}`,
        });
    }

    private popupRandomLabel() {
        this.eventPublisher.publish({
            tag: "LabelPoppedUp",
            text: "Hello",
            color: this.randomColor,
            x: this.randomX,
            y: this.randomY,
            remainingFrame: secToFrame(2),
        });
    }

    private removeKumas(kumas: RemovedKuma[]) {
        for (const kuma of kumas) {
            this.eventPublisher.publish({
                tag: "KumaRemoved",
                id: kuma.id,
                text: `${kuma.point}`,
                color: this.randomColor,
                pos: kuma.pos,
                remainingFrame: secToFrame(1),
            });
        }
    }

    private moveKumas(kumas: Kuma[]) {
        for (const kuma of kumas) {
            this.eventPublisher.publish({
                tag: "KumaMoved",
                ...kuma,
            });
        }
    }

    private addKuma(kuma: Kuma) {
        this.eventPublisher.publish({
            tag: "KumaPoppedUp",
            id: kuma.id,
            size: kuma.size,
            pos: kuma.pos,
            angleDeg: kuma.angleDeg,
        });
    }

    private get randomColor(): string {
        const r = randfloat(0, 255);
        const g = randfloat(0, 255);
        const b = randfloat(0, 255);
        return `rgb(${r},${g},${b})`
    }

    private get randomX(): number {
        return randfloat(0, 300);
    }

    private get randomY(): number {
        return randfloat(0, 300);
    }

    private get randomVX(): number {
        return randfloat(-4, 4) / 2;
    }

    private get randomVY(): number {
        return randfloat(-4, 4) / 2;
    }
}

