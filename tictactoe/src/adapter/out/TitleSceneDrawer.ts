import { Label, Scene, Sprite, Timeline } from "enchant.js";

import { ITitleSceneDrawer } from "@src/app/port/out/ITitleSceneDrawer";
import { config } from "@src/common/config";
import { IRepo } from "../IRepo";

export class TitleSceneDrawer implements ITitleSceneDrawer {
    constructor(repo: IRepo) {
        this.repo = repo;
        this.scene = this.repo.pushNewScene();
        const toPxScale = this.repo.fetchToPxScale();
        this.pressMeLabel = new PressMeLabel(toPxScale);
    }

    private readonly repo: IRepo;
    private readonly scene: Scene;
    private readonly pressMeLabel: PressMeLabel;

    onSceneAdded() {
        this.scene.addChild(new BackgroundSp());
        const toPxScale = this.repo.fetchToPxScale();
        this.scene.addChild(new TitleLabel(toPxScale));
        this.scene.addChild(this.pressMeLabel);
    }

    onGameModesShown() {
        this.pressMeLabel.remove();
        this.scene?.addChild(new Game1Label());
        this.scene?.addChild(new Game2Label());
    }

    onSceneRemovalStarted(curtainFrame: number) {
        this.scene?.addChild(new CurtainSp(curtainFrame / 2));
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

class TitleLabel extends Label {
    constructor(toPxScale: number) {
        super("ＴＩＣ　ＴＡＣ　ＴＯＥ");
        // const size = config.title.fontSize * toPxScale;
        const size = config.title.fontSize;
        const strWidth = this.text.length * size;
        this.color = "white";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        this.width = config.screen.width;
        this.moveTo(
            (config.screen.width - strWidth) / 2.0,
            (config.screen.height - size) / 2.0
        );
    }
}

class PressMeLabel extends Label {
    constructor(toPxScale: number) {
        super("Ｐｒｅｓｓ　ｔｏ　ｓｔａｒｔ");
        // const titleLabelSize = config.title.fontSize * toPxScale;
        const titleLabelSize = config.title.fontSize;
        const size = titleLabelSize / 3;
        const strWidth = this.text.length * size;
        this.color = "orange";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        this.width = strWidth;
        this.moveTo(
            (config.screen.width - strWidth) / 2.0,
            (config.screen.height) / 2.0 + titleLabelSize
        );
        const blinkFunc = () => {
            this.opacity = 1;
            new Timeline(this).fadeOut(config.screen.fps).then(blinkFunc);
        };
        blinkFunc();
    }
}

class Game1Label extends Label {
    constructor() {
        super("１　ＰＬＡＹＥＲ");
        const size = 20;
        const strWidth = this.text.length * size;
        this.color = "orange";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        this.width = strWidth;
        this.moveTo(
            (config.screen.width - strWidth) / 2.0,
            config.screen.height * 6 / 9,
        );
    }
}

class Game2Label extends Label {
    constructor() {
        super("２　ＰＬＡＹＥＲ");
        const size = 20;
        const strWidth = this.text.length * size;
        this.color = "orange";
        this.font = `${size}px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif`;
        this.width = strWidth;
        this.moveTo(
            (config.screen.width - strWidth) / 2.0,
            config.screen.height * 7 / 9,
        );
    }
}

class CurtainSp extends Sprite {
    constructor(curtainFrame: number) {
        super(config.screen.width, config.screen.height);
        this.backgroundColor = "black";
        this.opacity = 0;
        new Timeline(this).fadeIn(curtainFrame);
    }
}
