import { RectRange } from "@src/app/domain/scene/RectRange";
import { Move, Turn } from "@src/app/domain/scene/stage1/Stage1Scene";

export interface IStage1SceneDrawer {
    onSceneAdded(
        sqRanges: RectRange[],
    ): void;
    onWaitingUserSelectingTurnStarted(
        firstLabelRange: RectRange,
        secondLabelRange: RectRange,
    ): void;
    onWaitingPlayerTurnStarted(): void;
    onWaitingMarkAppearingStarted(move: Move): void;
    onWaitingWinnerAppearingStarted(
        gameMode: 1 | 2,
        winner: Turn | "DRAW",
        time: number,
    ): void;
    onSceneRemoved(): void;
}
