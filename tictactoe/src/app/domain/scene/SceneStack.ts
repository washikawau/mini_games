import { Input } from "@src/app/port/in/IGameEngine";
import { Scene, SceneName, SceneSet, SceneSets, TickResult } from "./IScene";

export class SceneStack {
    constructor(drawerFactories: DrawerFactories) {
        this.drawerFactories = drawerFactories;
    }

    private readonly drawerFactories: DrawerFactories;
    private readonly stack: SceneSet[] = [];

    push(scene: Scene): void {
        const drawer = this.drawerFactories[scene.name]();
        const sceneSet = { scene, drawer } as SceneSet;
        this.stack.push(sceneSet);
        sceneSet.scene.onAdded(
            // @ts-ignore
            sceneSet.drawer
        );
    }

    private pop(): void {
        const sceneSet = this.stack.pop();
        if (sceneSet === undefined) {
            return;
        }
        sceneSet.scene.onRemoved(
            // @ts-ignore
            sceneSet.drawer
        );
    }

    tickTop(input: Input): void {
        const len = this.stack.length;
        if (len <= 0) {
            return;
        }
        const sceneSet = this.stack[len - 1];
        const result = this.doTickTop(sceneSet, input);
        if (result.finished ?? false) {
            this.pop();
        }
        if (result.next !== undefined) {
            this.push(result.next);
        }
    }

    private doTickTop(sceneSet: SceneSet, input: Input): TickResult {
        const beforeProps = this.beforeLog(sceneSet.scene, input);
        try {
            return sceneSet.scene.onTick(
                // @ts-ignore
                sceneSet.drawer,
                input
            );
        } catch (e: unknown) {
            console.error(e);
            return { finished: true };
        } finally {
            this.afterLog(sceneSet.scene, beforeProps);
        }
    }

    private beforeLog(scene: Scene, input: Input): string {
        const beforeProps = JSON.stringify({ ...scene.props, frame: 0 });
        if (!!input.touchstart) {
            const props = JSON.stringify(scene.props);
            console.log(`beforeTick: props=${props}, input=${JSON.stringify(input)}`);
        }
        return beforeProps;
    }
    private afterLog(scene: Scene, beforeProps: string): void {
        const afterProps = JSON.stringify({ ...scene.props, frame: 0 });
        if (beforeProps != afterProps) {
            const props = JSON.stringify(scene.props);
            console.log(`afterTick: props=${props}`);
        }
    }
}

export type DrawerFactories = {
    [k in SceneName]: () => SceneSets[k]["drawer"];
};
