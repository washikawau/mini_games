import { IGameEngine, Input } from "@src/app/port/in/IGameEngine";
import { DrawerFactories, SceneStack } from "./scene/SceneStack";
import { Stage1Scene } from "./scene/stage1/Stage1Scene";

export class GameEngine implements IGameEngine {
    static create(drawerFactories: DrawerFactories): GameEngine {
        const sceneStack = new SceneStack(drawerFactories);
        return new GameEngine(sceneStack);
    }

    private constructor(sceneStack: SceneStack) {
        this.sceneStack = sceneStack;
    }

    private readonly sceneStack: SceneStack;

    init(): void {
        // const scene = TitleScene.create();
        const scene = Stage1Scene.create({ gameMode: 1 });
        this.sceneStack.push(scene);
    }

    tick(input: Input): void {
        this.sceneStack.tickTop(input);
    }
}
