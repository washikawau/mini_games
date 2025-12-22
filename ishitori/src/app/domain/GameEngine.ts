import { IGameEngine, Input } from "@src/app/port/in/IGameEngine";
import { ControllerFactories, SceneStack } from "./SceneStack";
import { Stage1Scene } from "./scene/Stage1Scene";

export class GameEngine implements IGameEngine {
    static create(
        controllerFactories: ControllerFactories,
    ): GameEngine {
        const sceneStack = SceneStack.create(controllerFactories);
        return new GameEngine(sceneStack);
    }

    private constructor(sceneStack: SceneStack) {
        this.sceneStack = sceneStack;
    }

    private readonly sceneStack: SceneStack;

    init(): void {
        const scene = Stage1Scene.create({ gameMode: 1 });
        this.sceneStack.push(scene);
    }

    tick(input: Input): void {
        this.sceneStack.tickTop(input);
    }
}
