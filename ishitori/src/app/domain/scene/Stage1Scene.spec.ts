import { RectRange } from "@src/adapter/out/RectRange";
import { Input, Pos } from "@src/app/port/in/IGameEngine";
import { IStage1SceneController } from "@src/app/port/out/IStage1SceneController";
import { Player } from "../model/types";
import { SceneState, Stage1Scene } from "./Stage1Scene";

test.each([
    [],
])('.onAdded-props', () => {
    // arrange
    const sut = Stage1Scene.create({ gameMode: 1 });
    const controller = UtController.create();
    // act
    sut.onAdded(controller);
    // assert
    expect(controller.addScene).toHaveBeenCalledTimes(1);
});

class UtController implements IStage1SceneController {
    static create(): UtController {
        return new UtController();
    }
    private constructor() {
        this.addScene = jest.fn();
    }
    set input(v: Input) {

    }
    randValFrom(vals: number[]): number {
        throw new Error("Method not implemented.");
    }
    fetchSelectedTurn(pos?: Pos): Player | undefined {
        throw new Error("Method not implemented.");
    }
    fetchSelectedNumPick(pos?: Pos): number | undefined {
        throw new Error("Method not implemented.");
    }
    isRetrySelected(pos?: Pos): boolean {
        throw new Error("Method not implemented.");
    }
    drawScene(status: SceneState): void {
        throw new Error("Method not implemented.");
    }
    addScene(sqRanges: RectRange[]): void {
        throw new Error("Method not implemented.");
    }
    // onWaitingUserSelectingTurnStarted(firstLabelRange: RectRange, secondLabelRange: RectRange): void {
    //     throw new Error("Method not implemented.");
    // }
    // onWaitingPlayerTurnStarted(): void {
    //     throw new Error("Method not implemented.");
    // }
    // onWaitingMarkAppearingStarted(move: Move): void {
    //     throw new Error("Method not implemented.");
    // }
    // onWaitingWinnerAppearingStarted(gameMode: 1 | 2, winner: Turn | "DRAW", time: number): void {
    //     throw new Error("Method not implemented.");
    // }
    isWaiting(status: SceneState): boolean {
        return false;
    }
    onSceneRemoved(): void {
        throw new Error("Method not implemented.");
    }
}
