import { Input } from "../in/IGameEngine";
import { ISceneController } from "./ISceneController";

export interface ITitleSceneController extends ISceneController {
    set input(v: Input);
    drawScene(event: DrawEvent): void;
}

export type DrawEvent =
    OnSceneAdded |
    OnSceneRemoved;
export type OnSceneAdded = {
    readonly tag: "OnSceneAdded",
};
export type OnSceneRemoved = {
    readonly tag: "OnSceneRemoved",
};
