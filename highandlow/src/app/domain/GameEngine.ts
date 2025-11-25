import { IGameEngine, Input } from "@src/app/port/in/IGameEngine";
import { SceneFactories, SceneStack } from "./scene/SceneStack";

export class GameEngine implements IGameEngine {
    static create(factories: SceneFactories): GameEngine {
        const sceneStack = new SceneStack(factories);
        return new GameEngine(sceneStack);
    }

    private constructor(sceneStack: SceneStack) {
        this.sceneStack = sceneStack;
    }

    private readonly sceneStack: SceneStack;

    init(): void {
        this.sceneStack.push("Title");
    }

    tick(input: Input): void {
        this.sceneStack.tickTop(input);
    }
}
