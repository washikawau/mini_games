import { Player } from "@src/app/domain/model/types";
import { SceneState } from "@src/app/domain/scene/Stage1Scene";
import { Input } from "../in/IGameEngine";
import { ISceneController } from "./ISceneController";

export interface IStage1SceneController extends ISceneController {
    set input(v: Input);
    randValFrom(vals: readonly number[]): number;
    fetchSelectedTurn(): Player | undefined;
    fetchSelectedNumPick(): number | undefined;
    isRetrySelected(): boolean;
    isWaiting(status: SceneState): boolean;
    drawScene(status: SceneState): void;
}
