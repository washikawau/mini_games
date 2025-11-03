import { Label, Scene, Sprite, Timeline } from "enchant.js";

import { Card } from "@src/app/exporter";
import { IStage1SceneDrawer } from "@src/app/port/out/IStage1SceneDrawer";
import { config } from "@src/common/config";
import { IRepo } from "../IRepo";

type LabelRange = {
    x: number,
    y: number,
    width: number,
    height: number,
};

export class Stage1SceneDrawer implements IStage1SceneDrawer {
    constructor(repo: IRepo) {
        this.repo = repo;
        this.scene = this.repo.pushNewScene();
    }

    private readonly repo: IRepo;
    private readonly scene: Scene;
    private readonly labels: Label[] = [];
    private readonly openeds: CardSp[] = [];

    onSceneAdded(
        highLabelRange: LabelRange,
        lowLabelRange: LabelRange,
    ) {
        this.scene.addChild(new BackgroundSp());
        // const toPxScale = this.repo.fetchToPxScale();
        this.labels.push(new HighLabel(highLabelRange));
        this.labels.push(new LowLabel(lowLabelRange));
        for (const label of this.labels) {
            this.scene.addChild(label);
        }
    }

    onCardOpened(opened: Card, time: number): void {
        const openeds = this.openeds;
        if (openeds.length > 0) {
            const index = openeds.length - 1;
            const prev = openeds[index];
            prev.moveTo(0, index * 20);
        }
        const sp = new CardSp(opened, time);
        this.openeds.push(sp);
        this.scene?.addChild(sp);
        for (const label of this.labels) {
            label.opacity = 0;
        }
    }

    onSelectionStarted(): void {
        for (const label of this.labels) {
            label.opacity = 1;
        }
    }

    onDrawn(time: number): void {
        this.scene.addChild(new ResultLabel("ＤＲＡＷ", time));
    }

    onWon(time: number): void {
        this.scene.addChild(new ResultLabel("ＹＯＵ　ＷＩＮ", time));
    }

    onLost(time: number): void {
        this.scene.addChild(new ResultLabel("ＹＯＵ　ＬＯＳＥ", time));
    }

    onSceneRemoved(): void {
        this.scene!.remove();
    }
}

class BackgroundSp extends Sprite {
    constructor() {
        super(config.screen.width, config.screen.height);
        this.backgroundColor = "green";
    }
}

class HighLabel extends Label {
    constructor(range: LabelRange) {
        super("ＨＩＧＨ");
        const size = 30;
        // const strWidth = this.text.length * size;
        this.color = "red";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        // this.width = strWidth;
        this.x = range.x;
        this.y = range.y;
        this.width = range.width;
        this.height = range.height;
    }
}

class LowLabel extends Label {
    constructor(range: LabelRange) {
        super("ＬＯＷ");
        const size = 30;
        // const strWidth = this.text.length * size;
        this.color = "blue";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        // this.width = strWidth;
        this.x = range.x;
        this.y = range.y;
        this.width = range.width;
        this.height = range.height;
    }
}

class CardSp extends Label {
    constructor(card: Card, time: number) {
        super(CardSp.toStr(card));
        const size = 20;
        const strWidth = this.text.length * size;
        this.color = "white";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        this.width = strWidth;
        this.moveTo(
            (config.screen.width - strWidth) / 2.0,
            (config.screen.height - size) / 2.0
        );
        this.opacity = 0;
        new Timeline(this).fadeIn(time);
    }

    static toStr(card: Card): string {
        const suit = card.suit.charAt(0).toUpperCase();
        const rank = card.rank === 1 ? "A"
            : card.rank === 11 ? "J"
                : card.rank === 12 ? "Q"
                    : card.rank === 13 ? "K"
                        : card.rank;
        return `${suit}:${rank}`;
    }
}

class ResultLabel extends Label {
    constructor(text: string, time: number) {
        super(text);
        const size = 40;
        const strWidth = this.text.length * size;
        this.color = "white";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        this.width = strWidth;
        this.x = (config.screen.width - strWidth) / 2;
        this.y = (config.screen.height - size * 3) / 2;
        this.width = strWidth;
        this.height = size;
        new Timeline(this).delay(time).then(() => this.remove());
    }
}
