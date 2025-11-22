// import { Card } from "@src/app/exporter";
type Card = {};

export interface IStage1SceneDrawer {
    onSceneAdded(
        firstLabelPos: { x: number, y: number },
        secondLabelPos: { x: number, y: number },
    ): void;
    onCardOpened(opened: Card, time: number): void;
    onSelectionStarted(): void;
    onDrawn(time: number): void;
    onWon(time: number): void;
    onLost(time: number): void;
    onSceneRemoved(): void;
}
