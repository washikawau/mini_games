import { Node as ENode, Label, Scene, Sprite } from "enchant.js";

import { RectRange } from "@src/adapter/out/RectRange";
import { Input } from "@src/app/port/in/IGameEngine";
import { DrawEvent, ITitleSceneController, OnSceneAdded, OnSceneRemoved } from "@src/app/port/out/ITitleSceneController";
import { IRepo } from "../IRepo";

export class TitleSceneController implements ITitleSceneController {
    constructor(repo: IRepo) {
        this.repo = repo;
        this.scene = this.repo.pushNewScene();
    }

    private readonly repo: IRepo;
    private readonly scene: Scene;
    private readonly sqSps: SqSp[] = [];
    private readonly labels: ENode[] = [];
    private readonly marks: Label[] = [];
    private _input: Input = { frame: 0 };

    set input(v: Input) {
        this._input = v;
    }

    drawScene(event: DrawEvent): void {
        switch (event.tag) {
            case "OnSceneAdded": return this.onSceneAdded(event);
            case "OnSceneRemoved": return this.onSceneRemoved(event);
            default: { }
        }
    }

    onSceneAdded(event: OnSceneAdded): void {
    }

    onSceneRemoved(event: OnSceneRemoved): void {
        this.scene!.remove();
    }
}

class SqSp extends Sprite {
    constructor(range: RectRange) {
        super(range.width - 2, range.height - 2);
        this.x = range.left + 1;
        this.y = range.top + 1;
        this.backgroundColor = "white";
    }
}
