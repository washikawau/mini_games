import { IGameEngine, Input } from "@src/app/port/in/IGameEngine";
import { DrawerFactories, SceneStack } from "./scene/SceneStack";
import { TitleScene } from "./scene/title/TitleScene";

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
        this.sceneStack.push(TitleScene.create());
    }

    tick(input: Input): void {
        this.sceneStack.tickTop(input);
    }
}
