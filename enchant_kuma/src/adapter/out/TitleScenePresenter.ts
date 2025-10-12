import { Label, Scene, Sprite, Timeline } from "enchant.js";

import { SceneName } from "@src/app/port/in/SceneName";
import {
    ObjectAddedEvent,
    ObjectMovedEvent,
    SceneAddedEvent,
    SceneRemovedEvent,
    SceneRemovingEvent,
    TitleSceneEvent,
} from "@src/app/port/in/sceneevent/TitleSceneEvent";
import { ISceneDrawer } from "@src/app/port/out/ISceneDrawer";
import { config } from "@src/common/config";
import { IRepo, assetKeys } from "../IRepo";

export class TitleScenePresenter implements ISceneDrawer<TitleSceneEvent> {
    static create(repo: IRepo): TitleScenePresenter {
        return new TitleScenePresenter(repo);
    }

    private constructor(repo: IRepo) {
        this.repo = repo;
    }

    private readonly repo: IRepo;
    private readonly kumas: Map<number, Sprite> = new Map();
    private scene: Scene | null = null;

    sceneName: SceneName = "Title";

    onReceive(e: TitleSceneEvent): void {
        switch (e.tag) {
            case "SceneAdded":
                return this.onSceneAdded(e);
            case "SceneRemoving":
                return this.onSceneRemoving(e);
            case "SceneRemoved":
                return this.onSceneRemoved(e);
            case "ObjectAdded":
                return this.onObjectAdded(e);
            case "ObjectMoved":
                return this.onObjectMoved(e);
        }
    }

    onSceneAdded(e: SceneAddedEvent) {
        this.scene = this.repo.pushNewScene();
        const backgroundSp = new Sprite(config.WIDTH, config.HEIGHT);
        backgroundSp.backgroundColor = "black";
        this.scene.addChild(backgroundSp);
        {
            const label = new Label("hello");
            label.color = "white";
            label.font = "25px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif";
            this.scene.addChild(label);
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
        this.kumas.clear();
    }

    onObjectAdded(e: ObjectAddedEvent) {
        const sp = new Sprite(e.size.x, e.size.y);
        sp.image = this.repo.fetchImg(assetKeys.kuma1);
        sp.scale(e.scale.x, e.scale.y);
        sp.rotate(e.angleDeg);
        sp.moveTo(e.pos.x, e.pos.y);
        sp.frame = e.frame;
        this.scene!.addChild(sp);
        this.kumas.set(e.id, sp);
    }

    onObjectMoved(e: ObjectMovedEvent) {
        const sp = this.kumas.get(e.id);
        if (sp !== undefined) {
            sp.moveTo(e.pos.x, e.pos.y);
            const index = Math.floor((e.frame % 10) / 5);
            sp.frame = index + 1;
        }
    }
}
