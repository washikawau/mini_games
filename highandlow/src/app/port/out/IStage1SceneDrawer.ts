import { Card } from "@src/app/exporter";

export interface IStage1SceneDrawer {
    onSceneAdded(
        highLabelPos: { x: number, y: number },
        lowLabelPos: { x: number, y: number },
    ): void;
    onCardOpened(opened: Card, time: number): void;
    onSelectionStarted(): void;
    onDrawn(time: number): void;
    onWon(time: number): void;
    onLost(time: number): void;
    onSceneRemoved(): void;
}
