
import { GameEngine } from "./domain/GameEngine";
import { DrawerFactories } from "./domain/scene/SceneStack";
import { IGameEngine } from "./port/in/IGameEngine";
import { IStage1SceneDrawer } from "./port/out/IStage1SceneDrawer";
import { ITitleSceneDrawer } from "./port/out/ITitleSceneDrawer";

export function createIGameEngine(
drawerFactories: DrawerFactories
): IGameEngine {
    return GameEngine.create(drawerFactories);
}
