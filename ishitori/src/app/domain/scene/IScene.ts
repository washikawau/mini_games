import { Stage1Scene } from "./Stage1Scene";
import { TitleScene } from "./TitleScene";

export interface IScene<Name, PropsType, ControllerType> {
    get name(): Name;
    get props(): PropsType;
    onAdded(controller: ControllerType): void;
    onRemoved(controller: ControllerType): void;
    onTick(controller: ControllerType): TickResult;
}

export type TickResult = {
    finished?: boolean,
    next?: Scenes[SceneName],
};

export type SceneName = keyof Scenes;
export type Scene = Scenes[SceneName];
export type SceneSet = SceneSets[SceneName];
export type SceneSets = {
    [k in SceneName]: {
        scene: Scenes[k],
        controller: Parameters<Scenes[k]["onAdded"]>[0],
    };
};
export type Scenes = {
    Title: TitleScene,
    Stage1: Stage1Scene,
};
