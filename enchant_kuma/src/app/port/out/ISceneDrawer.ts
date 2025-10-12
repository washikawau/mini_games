import { SceneName } from "../in/SceneName";

export interface ISceneDrawer<EventType> {
    sceneName: SceneName;
    onReceive(e: EventType): void;
}
