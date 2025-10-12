import { ISceneDrawer } from "../out/ISceneDrawer";
import { SceneEvent } from "./SceneEvent";

export interface IGameEngine {
    init(): void;
    tick(input: Input): void;
    register(s: ISceneDrawer<SceneEvent>): void;
}

export type Input = {
    touchstart: None | TouchStart,
};

export type None = {
    tag: "None",
}

export type TouchStart = {
    tag: "TouchStart",
    pos: Pos,
    localPos: Pos,
};

export type Pos = {
    x: number,
    y: number,
};
