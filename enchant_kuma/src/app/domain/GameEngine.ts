import { IGameEngine, Input } from "@src/app/port/in/IGameEngine";
import { ISceneDrawer } from "@src/app/port/out/ISceneDrawer";
import { SceneEvent } from "../port/in/SceneEvent";
import { allScenes, SceneStack } from "./scene/SceneStack";

export class GameEngine implements IGameEngine {
    constructor() { }

    private readonly sceneStack = new SceneStack();

    init(): void {
        this.sceneStack.push("Title");
    }

    tick(input: Input): void {
        this.sceneStack.tickTop(input);
    }

    register(s: ISceneDrawer<SceneEvent>): void {
        allScenes[s.sceneName]
            .eventPublisher
            .register(s);
    }
}
