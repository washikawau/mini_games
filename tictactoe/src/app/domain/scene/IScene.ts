import { Input } from "@src/app/port/in/IGameEngine";
import { Stage1Scene } from "./stage1/Stage1Scene";
import { TitleScene } from "./title/TitleScene";

export interface IScene<Name, PropsType, DrawerType> {
    get name(): Name;
    get props(): PropsType;
    onAdded(drawer: DrawerType): void;
    onRemoved(drawer: DrawerType): void;
    onTick(drawer: DrawerType, input: Input): TickResult;
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
        drawer: Parameters<Scenes[k]["onAdded"]>[0],
    };
};
export type Scenes = {
    Title: TitleScene,
    Stage1: Stage1Scene,
};
