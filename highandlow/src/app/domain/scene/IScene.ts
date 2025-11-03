import { Input } from "@src/app/port/in/IGameEngine";

export interface IScene<PropsType> {
    get props(): PropsType;
    onAdded(): void;
    onRemoved(): void;
    onTick(input: Input): TickResult;
}

export type TickResult = {
    finished?: boolean,
    next?: SceneName,
};

export type SceneName =
    "Title" |
    "Stage1";
