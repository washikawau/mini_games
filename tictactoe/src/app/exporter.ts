
import { GameEngine } from "./domain/GameEngine";
import { DrawerFactories } from "./domain/scene/SceneStack";
import { IGameEngine } from "./port/in/IGameEngine";

export function createIGameEngine(
    drawerFactories: DrawerFactories
): IGameEngine {
    return GameEngine.create(drawerFactories);
}
