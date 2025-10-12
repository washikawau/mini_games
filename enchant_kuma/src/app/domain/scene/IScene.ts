import { Input } from "@src/app/port/in/IGameEngine";
import { SceneName } from "@src/app/port/in/SceneName";
import { SceneEventPublisher } from "./SceneEventPublisher";

export interface IScene<EventType> {
    eventPublisher: SceneEventPublisher<EventType>;
    onAdded(): void;
    onRemoved(): void;
    onTick(input: Input): TickResult;
}

export type TickResult = {
    finished?: boolean,
    next?: SceneName,
};
