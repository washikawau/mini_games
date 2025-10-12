
export type TitleSceneEvent =
    SceneAddedEvent |
    SceneRemovingEvent |
    SceneRemovedEvent |
    ObjectAddedEvent |
    ObjectMovedEvent |
    ObjectRemovedEvent;
export type SceneAddedEvent = {
    tag: "SceneAdded",
};
export type SceneRemovingEvent = {
    tag: "SceneRemoving",
    remainingFrame: number,
};
export type SceneRemovedEvent = {
    tag: "SceneRemoved",
};
export type ObjectAddedEvent = {
    tag: "ObjectAdded",
    id: number,
    size: {
        x: number,
        y: number,
    },
    scale: {
        x: number,
        y: number,
    },
    angleDeg: number,
    pos: {
        x: number,
        y: number,
    },
    frame: number,
};
export type ObjectMovedEvent = {
    tag: "ObjectMoved",
    id: number,
    pos: {
        x: number,
        y: number,
    },
    frame: number,
};
export type ObjectRemovedEvent = {
    tag: "ObjectRemoved",
    id: number,
};
