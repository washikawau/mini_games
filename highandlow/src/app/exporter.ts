
import { GameEngine } from "./domain/GameEngine";
import { Stage1Scene } from "./domain/scene/stage1/Stage1Scene";
import { TitleScene } from "./domain/scene/title/TitleScene";
import { IGameEngine } from "./port/in/IGameEngine";
import { IStage1SceneDrawer } from "./port/out/IStage1SceneDrawer";
import { ITitleSceneDrawer } from "./port/out/ITitleSceneDrawer";

export function createIGameEngine(
    titleSceneDrawerFactory: () => ITitleSceneDrawer,
    stage1SceneDrawerFactory: () => IStage1SceneDrawer,
): IGameEngine {
    return GameEngine.create({
        Title: () => TitleScene.create(titleSceneDrawerFactory()),
        Stage1: () => Stage1Scene.create(stage1SceneDrawerFactory()),
    });
}

export { Card } from "./domain/model/Cards";
