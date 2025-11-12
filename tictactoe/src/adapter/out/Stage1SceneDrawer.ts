import { Node as ENode, Label, Scene, Sprite, Timeline } from "enchant.js";

import { RectRange } from "@src/app/domain/scene/RectRange";
import { Move, Turn } from "@src/app/domain/scene/stage1/Stage1Scene";
import { IStage1SceneDrawer } from "@src/app/port/out/IStage1SceneDrawer";
import { config } from "@src/common/config";
import { secToFrame } from "@src/common/util";
import { IRepo } from "../IRepo";

export class Stage1SceneDrawer implements IStage1SceneDrawer {
    constructor(repo: IRepo) {
        this.repo = repo;
        this.scene = this.repo.pushNewScene();
    }

    private readonly repo: IRepo;
    private readonly scene: Scene;
    private readonly sqSps: SqSp[] = [];
    private readonly labels: ENode[] = [];
    private readonly marks: Label[] = [];

    onSceneAdded(
        sqRanges: RectRange[],
    ) {
        for (const range of sqRanges) {
            this.sqSps.push(new SqSp(range));
        }
        this.scene.addChild(new BackgroundSp());
        for (const sq of this.sqSps) {
            this.scene.addChild(sq);
        }
        const nodes = [
            new LabelBackgroundSp(),
        ];
        for (const node of nodes) {
            this.labels.push(node);
            this.scene.addChild(node);
        }
    }

    onWaitingUserSelectingTurnStarted(
        firstLabelRange: RectRange,
        secondLabelRange: RectRange,
    ): void {
        const nodes = [
            new TurnLabel("先行（○）", firstLabelRange, -firstLabelRange.width),
            new TurnLabel("後攻（×）", secondLabelRange, config.screen.width),
        ];
        for (const node of nodes) {
            this.labels.push(node);
            this.scene.addChild(node);
        }
    }

    onWaitingPlayerTurnStarted(): void {
        for (const label of this.labels) {
            label.remove();
        }
        this.labels.splice(0);
    }

    onWaitingMarkAppearingStarted(move: Move): void {
        const mark = new MarkLabel(move);
        this.marks.push(mark);
        this.scene.addChild(mark);
    }

    onWaitingWinnerAppearingStarted(
        gameMode: 1 | 2,
        winner: Turn | "DRAW",
        time: number,
    ): void {
        this.labels.push(new LabelBackgroundSp());
        const text = winner === "DRAW" ? "引き分け"
            : gameMode === 2 ? `勝者: ${winner.mark}`
                : winner.player === "MAN" ? "あなたの勝ち"
                    : "あなたの負け";
        this.labels.push(new WinnerLablel(text, time));
        for (const label of this.labels) {
            this.scene.addChild(label);
        }
    }

    onSceneRemoved(): void {
        this.scene!.remove();
    }
}

class BackgroundSp extends Sprite {
    constructor() {
        super(config.screen.width, config.screen.height);
        this.backgroundColor = "black";
    }
}

class SqSp extends Sprite {
    constructor(range: RectRange) {
        super(range.width - 2, range.height - 2);
        this.x = range.left + 1;
        this.y = range.top + 1;
        this.backgroundColor = "white";
    }
}

class LabelBackgroundSp extends Sprite {
    constructor() {
        super(config.screen.width, config.screen.height);
        // super (
        // Math.max(firstLabelRange.width, secondLabelRange.width),
        // secondLabelRange.top + secondLabelRange.height - firstLabelRange.top
        // );
        // this.x = Math.min(firstLabelRange.left, secondLabelRange.left);
        // this.y = firstLabelRange.top;
        this.backgroundColor = "#808080e0";
    }
}

class TurnLabel extends Label {
    constructor(
        text: string,
        range: RectRange,
        startX: number,
    ) {
        super(text);
        const size = 30;
        this.color = "black";
        this.backgroundColor = "white";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        // this.x = range.left;
        this.x = startX;
        this.y = range.top;
        this.width = range.width;
        this.height = range.height;
        new Timeline(this).moveX(range.left, secToFrame(0.2));
    }
}

class MarkLabel extends Label {
    constructor(move: Move) {
        super(move.turn.mark);
        const size = 100;
        this.color = "black";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        this.x = move.sqRange.left + 45;
        this.y = move.sqRange.top + 15;
    }
}

class WinnerLablel extends Label {
    constructor(text: string, time: number) {
        super(text);
        const size = 50;
        const strWidth = text.length * size;
        this.color = "black";
        this.backgroundColor = "#ffffffe0";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        this.x = config.screen.width / 2 - strWidth / 2;
        this.y = config.screen.height / 2 - size / 2;
        this.width = text.length * size;
        this.height = size;
        this.opacity = 0;
        new Timeline(this).fadeIn(time);
    }
}
