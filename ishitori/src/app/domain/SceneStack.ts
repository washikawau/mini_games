import { Input } from "@src/app/port/in/IGameEngine";
import { Scene, SceneName, SceneSet, SceneSets, TickResult } from "./scene/IScene";

export class SceneStack {
    static create(
        controllerFactories: ControllerFactories,
    ): SceneStack {
        return new SceneStack(controllerFactories);
    }

    private constructor(
        controllerFactories: ControllerFactories,
    ) {
        this.controllerFactories = controllerFactories;
    }

    private readonly controllerFactories: ControllerFactories;
    private readonly stack: SceneSet[] = [];

    push(scene: Scene): void {
        const controller = this.controllerFactories[scene.name]();
        const sceneSet = { scene, controller } as SceneSet;
        this.stack.push(sceneSet);
        sceneSet.scene.onAdded(
            // @ts-ignore
            sceneSet.controller
        );
        // this.tickTop({});
    }

    private pop(): void {
        const sceneSet = this.stack.pop();
        if (sceneSet === undefined) {
            return;
        }
        sceneSet.scene.onRemoved(
            // @ts-ignore
            sceneSet.controller
        );
    }

    tickTop(input: Input): void {
        const len = this.stack.length;
        if (len <= 0) {
            return;
        }
        const sceneSet = this.stack[len - 1];
        const result = this.tickTopImpl(sceneSet, input);
        if (result.finished ?? false) {
            this.pop();
        }
        if (result.next !== undefined) {
            this.push(result.next);
        }
    }

    private tickTopImpl(sceneSet: SceneSet, input: Input): TickResult {
        const beforeProps = this.beforeLog(sceneSet.scene, input);
        try {
            const controller = sceneSet.controller;
            controller.input = input;
            return sceneSet.scene.onTick(
                // @ts-ignore
                controller
            );
        } catch (e: unknown) {
            console.error(e);
            return { finished: true };
        } finally {
            this.afterLog(sceneSet.scene, beforeProps);
        }
    }

    private beforeLog(scene: Scene, input: Input): string {
        const beforeProps = JSON.stringify(scene.props);
        if (!!input.touchstart) {
            const props = JSON.stringify(scene.props);
            console.log(`beforeTick: props=${props}, input=${JSON.stringify(input)}`);
        }
        return beforeProps;
    }
    private afterLog(scene: Scene, beforeProps: string): void {
        const afterProps = JSON.stringify(scene.props);
        if (beforeProps != afterProps) {
            const props = JSON.stringify(scene.props);
            console.log(`afterTick: props=${props}`);
        }
    }
}

export type ControllerFactories = {
    [k in SceneName]: () => SceneSets[k]["controller"];
};
