
export interface ITitleSceneDrawer {
    onSceneAdded(): void;
    onGameModesShown(): void;
    onSceneRemovalStarted(curtainFrame: number): void;
    onSceneRemoved(): void;
}
