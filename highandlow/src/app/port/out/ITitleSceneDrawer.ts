
export interface ITitleSceneDrawer {
    onSceneAdded(): void;
    onSceneRemovalStarted(curtainFrame: number): void;
    onSceneRemoved(): void;
}
