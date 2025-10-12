
export type Stage1SceneEvent =
    SceneAddedEvent |
    SceneRemovingEvent |
    SceneRemovedEvent |
    ScoreChangedEvent |
    LabelPoppedUpEvent |
    KumaPoppedUpEvent |
    KumaMovedEvent |
    KumaRemovedEvent;
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
export type LabelPoppedUpEvent = {
    tag: "LabelPoppedUp",
    text: string,
    color: string,
    x: number,
    y: number,
    remainingFrame: number,
};
export type ScoreChangedEvent = {
    tag: "ScoreChanged",
    text: string,
};
export type KumaPoppedUpEvent = {
    tag: "KumaPoppedUp",
    id: number,
    size: {
        x: number,
        y: number,
    },
    pos: {
        x: number,
        y: number,
    },
    angleDeg: number,
};
export type KumaMovedEvent = {
    tag: "KumaMoved",
    id: number,
    pos: {
        x: number,
        y: number,
    },
    angleDeg: number,
    frame: number,
};
export type KumaRemovedEvent = {
    tag: "KumaRemoved",
    id: number,
    text: string,
    color: string,
    pos: {
        x: number,
        y: number,
    },
    remainingFrame: number,
};
