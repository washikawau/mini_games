import { IScene } from "@src/app/domain/scene/IScene";
import { Input } from "@src/app/port/in/IGameEngine";
import { SceneName } from "@src/app/port/in/SceneName";
import { Stage1Scene } from "./stage1/Stage1Scene";
import { TitleScene } from "./title/TitleScene";

export class SceneStack {
    constructor() {
    }

    private readonly stack: IScene<unknown>[] = [];

    push(sceneName: SceneName): void {
        const scene = allScenes[sceneName];
        this.stack.push(scene);
        scene.onAdded();
    }

    pop(): void {
        const scene = this.stack.pop();
        scene?.onRemoved();
    }

    tickTop(input: Input): void {
        const len = this.stack.length;
        if (len <= 0) {
            return;
        }
        const scene = this.stack[len - 1];
        const result = scene.onTick(input);
        if (result.finished ?? false) {
            this.pop();
        }
        if (result.next !== undefined) {
            this.push(result.next);
        }
    }
}

export const allScenes = {
    Title: TitleScene.create(),
    Stage1: Stage1Scene.create(),
};
