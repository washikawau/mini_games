import { Core, Event, Scene, Surface } from "enchant.js";

import { createIGameEngine } from "@src/app/exporter";
import { IGameEngine, Input } from "@src/app/port/in/IGameEngine";
import { config } from "@src/common/config";
import { assetKeys, IRepo } from "../IRepo";
import { Stage1SceneDrawer } from "../out/Stage1SceneDrawer";
import { TitleSceneDrawer } from "../out/TitleSceneDrawer";

export class GameController {
    static create(): GameController {
        return new GameController();
    }

    private constructor() {
        this.core = createCore();
        this.core.onload = () => {
            this.engine.init();
            this.core.onenterframe = e => this.onenterframe(e);
        };
        const repo = createRepo(
            this.core,
            e => this.ontouchstart(e)
        );
        this.engine = createEngine(repo);
    }

    private readonly core: Core;
    private readonly engine: IGameEngine;

    private input: Input = {};

    private onenterframe(e: Event) {
        try {
            this.engine.tick(this.input);
        } catch (e: unknown) {
            console.log(e);
        } finally {
            this.input = {};
        }
    }

    private ontouchstart(e: Event) {
        const touchstart = {
            pos: { x: e.x, y: e.y },
            localPos: { x: e.localX, y: e.localY },
        };
        this.input = { touchstart };
    }

    start(): void {
        this.core.start();
    }

    stop(): void {
        this.core.stop();
    }
}

function createCore(): Core {
    const { width, height, fps, backgroundColor } = config.screen;
    const core = new Core(width, height);
    core.preload(Object.values(assetKeys));
    core.fps = fps;
    core.rootScene.backgroundColor = backgroundColor;
    return core;
}

function createRepo(
    core: Core,
    ontouchstart: (e: Event) => void
): IRepo {
    return new class implements IRepo {
        core = core;
        fetchToPxScale(): number {
            return core.scale;
        }
        fetchImg(key: string): Surface {
            return core.assets[key];
        }
        pushNewScene(): Scene {
            const scene = new Scene();
            scene.ontouchstart = e => ontouchstart(e);
            core.pushScene(scene);
            return scene;
        }
    }();
}

function createEngine(repo: IRepo): IGameEngine {
    return createIGameEngine(
        () => new TitleSceneDrawer(repo),
        () => new Stage1SceneDrawer(repo),
    );
}
