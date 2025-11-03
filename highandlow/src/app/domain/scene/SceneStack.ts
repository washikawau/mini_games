import { Input } from "@src/app/port/in/IGameEngine";
import { IScene, SceneName, TickResult } from "./IScene";

export class SceneStack {
    constructor(factories: SceneFactories) {
        this.factories = factories;
    }

    private readonly factories: SceneFactories;
    private readonly stack: IScene<object>[] = [];

    push(sceneName: SceneName): void {
        const factory = this.factories[sceneName];
        const scene = factory();
        this.stack.push(scene);
        scene.onAdded();
        scene.onTick({});
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
        const result = this.tryTick(scene, input);
        if (result.finished ?? false) {
            this.pop();
        }
        if (result.next !== undefined) {
            this.push(result.next);
        }
    }

    private tryTick(scene: IScene<object>, input: Input): TickResult {
        const beforeProps = this.beforeLog(scene, input);
        try {
            return scene.onTick(input);
        } catch (e: unknown) {
            console.error(e);
            return { finished: true };
        } finally {
            this.afterLog(scene, beforeProps);
        }
    }

    private beforeLog(scene: IScene<object>, input: Input): string {
        const beforeProps = JSON.stringify({ ...scene.props, frame: 0 });
        if (!!input.touchstart) {
            console.log(`beforeTick: props=${beforeProps}, input=${JSON.stringify(input)}`);
        }
        return beforeProps;
    }
    private afterLog(scene: IScene<object>, beforeProps: string): void {
        const afterProps = JSON.stringify({ ...scene.props, frame: 0 });
        if (beforeProps != afterProps) {
            console.log(`afterTick: props=${afterProps}`);
        }
    }
}

export type SceneFactories = {
    [k in SceneName]: () => IScene<object>;
};
