import { Label, Scene, Sprite, Timeline } from "enchant.js";

import { SceneName } from "@src/app/port/in/SceneName";
import {
    KumaMovedEvent,
    KumaPoppedUpEvent,
    KumaRemovedEvent,
    LabelPoppedUpEvent,
    SceneAddedEvent,
    SceneRemovedEvent,
    SceneRemovingEvent,
    ScoreChangedEvent,
    Stage1SceneEvent
} from "@src/app/port/in/sceneevent/Stage1SceneEvent";
import { ISceneDrawer } from "@src/app/port/out/ISceneDrawer";
import { config } from "@src/common/config";
import { IRepo, assetKeys } from "../IRepo";

export class Stage1ScenePresenter implements ISceneDrawer<Stage1SceneEvent> {
    static create(repo: IRepo): Stage1ScenePresenter {
        return new Stage1ScenePresenter(repo);
    }

    private constructor(repo: IRepo) {
        this.repo = repo;
    }

    private readonly repo: IRepo;
    private readonly kumas: Map<number, Sprite> = new Map();
    private scene: Scene | null = null;
    private scoreLabel: Label | null = null;

    sceneName: SceneName = "Stage1";

    onReceive(e: Stage1SceneEvent): void {
        switch (e.tag) {
            case "SceneAdded":
                return this.onSceneAdded(e);
            case "SceneRemoving":
                return this.onSceneRemoving(e);
            case "SceneRemoved":
                return this.onSceneRemoved(e);
            case "ScoreChanged":
                return this.onScoreChanged(e);
            case "LabelPoppedUp":
                return this.onLabelPoppedUp(e);
            case "KumaPoppedUp":
                return this.onKumaPoppedUp(e);
            case "KumaMoved":
                return this.onKumaMoved(e);
            case "KumaRemoved":
                return this.onKumaRemoved(e);
            default:
                throw new Error(`unhandled event: e=${e}`);
        }
    }

    onSceneAdded(e: SceneAddedEvent) {
        this.scene = this.repo.pushNewScene();
        {
            const backgroundSp = new Sprite(config.WIDTH, config.HEIGHT);
            backgroundSp.backgroundColor = "black";
            this.scene.addChild(backgroundSp);
        }
        {
            const label = new Label("Score:");
            label.font = "12px 'Consolas', 'Monaco', 'MS ゴシック'";
            label.moveTo(config.WIDTH - 95, 1);
            label.color = "white";
            this.scene.addChild(label);
        }
        {
            this.scoreLabel = new Label("");
            this.scoreLabel.font = "12px 'Consolas', 'Monaco', 'MS ゴシック'";
            this.scoreLabel.moveTo(config.WIDTH - 50, 1);
            this.scoreLabel.color = "white";
            this.scene.addChild(this.scoreLabel);
        }
    }

    onSceneRemoving(e: SceneRemovingEvent) {
        const blackSp = new Sprite(config.WIDTH, config.HEIGHT);
        blackSp.backgroundColor = "black";
        blackSp.opacity = 0;
        new Timeline(blackSp).fadeIn(e.remainingFrame);
        this.scene!.addChild(blackSp);
    }

    onSceneRemoved(e: SceneRemovedEvent) {
        this.scene!.remove();
        this.scene = null;
        this.scoreLabel = null;
        this.kumas.clear();
    }

    onScoreChanged(e: ScoreChangedEvent) {
        if (!!this.scoreLabel) {
            this.scoreLabel!.text = e.text;
        }
    }

    onLabelPoppedUp(e: LabelPoppedUpEvent) {
        const label = new Label(e.text);
        label.font = "12px 'Consolas', 'Monaco', 'MS ゴシック'";
        label.moveTo(e.x, e.y);
        label.color = e.color;
        label.opacity = 1;
        new Timeline(label)
            .fadeOut(e.remainingFrame)
            .then(() => this.scene!.removeChild(label));
        this.scene!.addChild(label);
    }

    onKumaPoppedUp(e: KumaPoppedUpEvent) {
        const sp = new Sprite(e.size.x, e.size.y);
        sp.image = this.repo.fetchImg(assetKeys.kuma1);
        sp.scaleY = Math.abs(e.angleDeg) > 90 ? -1 : 1;
        sp.rotate(e.angleDeg);
        sp.moveTo(e.pos.x, e.pos.y);
        sp.frame = 0;
        this.scene!.addChild(sp);
        this.kumas.set(e.id, sp);
    }

    onKumaMoved(e: KumaMovedEvent) {
        const sp = this.kumas.get(e.id);
        if (sp !== undefined) {
            sp.scaleY = Math.abs(e.angleDeg) > 90 ? -1 : 1;
            sp.rotation = e.angleDeg;
            sp.moveTo(e.pos.x, e.pos.y);
            const index = Math.floor((e.frame % 10) / 5);
            sp.frame = index + 1;
        }
    }

    onKumaRemoved(e: KumaRemovedEvent) {
        const sp = this.kumas.get(e.id);
        if (sp !== undefined) {
            sp.remove();
            const label = new Label(e.text);
            label.font = "12px 'Consolas', 'Monaco', 'MS ゴシック'";
            label.moveTo(e.pos.x, e.pos.y);
            label.color = e.color;
            label.opacity = 1;
            new Timeline(label)
                .fadeOut(e.remainingFrame)
                .then(() => this.scene!.removeChild(label));
            this.scene!.addChild(label);
        }
    }
}
