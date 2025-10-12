import { Stage1SceneEvent } from "./sceneevent/Stage1SceneEvent";
import { TitleSceneEvent } from "./sceneevent/TitleSceneEvent";

export type SceneEvent =
    TitleSceneEvent |
    Stage1SceneEvent;
