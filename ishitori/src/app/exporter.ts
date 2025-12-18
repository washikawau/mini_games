import { GameEngine } from "./domain/GameEngine";
import { ControllerFactories } from "./domain/SceneStack";
import { IGameEngine } from "./port/in/IGameEngine";

export function createIGameEngine(
    controllerFactories: ControllerFactories,
): IGameEngine {
    return GameEngine.create(controllerFactories);
}
