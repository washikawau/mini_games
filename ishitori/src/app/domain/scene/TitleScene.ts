import { ITitleSceneController } from "@src/app/port/out/ITitleSceneController";
import { IScene, TickResult } from "./IScene";

const name = "Title";
type Controller = ITitleSceneController;
type Props = {
    readonly status: SceneState,
};

type SceneState =
    OnCreated
    ;
type OnCreated = {
    readonly tag: "OnCreated",
};

export class TitleScene implements IScene<typeof name, Props, Controller> {
    static create(): TitleScene {
        return new this();
    }

    private constructor() {
        this._props = {
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
        controller.drawScene({
            tag: "OnSceneAdded",
        });
    }

    onRemoved(controller: Controller): void {
        controller.drawScene({
            tag: "OnSceneRemoved",
        });
    }

    onTick(controller: Controller): TickResult {
        const curr = this.props;
        // const props = this.updateProps({
        //     status: nextStatus
        // });
        this.doDraw(controller, curr, curr);
        return {};
    }

    private doDraw(controller: Controller, curr: Props, next: Props) {
        const isChanged = curr.status.tag !== next.status.tag;
        const status = next.status;
        switch (status.tag) {
            case "OnCreated": {
                return;
            }
            default:
                return;
        }
    }
}
