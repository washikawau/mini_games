//// @ts-nocheck
import {
    Core,
    Event,
    Label,
    Scene,
    Sprite,
    Surface,
} from "enchant.js";
// } from "@src/enchant.js";

import { GameEngine } from "@src/app/domain/GameEngine";
import { IGameEngine, Input } from "@src/app/port/in/IGameEngine";
import { config } from "@src/common/config";
import { randfloat } from "@src/common/util";
import { assetKeys, IRepo } from "../IRepo";
import { Stage1ScenePresenter } from "../out/Stage1ScenePresenter";
import { TitleScenePresenter } from "../out/TitleScenePresenter";

export class GameController {
    constructor() {
        this.core = this.createCore();
        this.engine = new GameEngine();
        this.core.onload = () => {
            this.engine.init();
            this.core.onenterframe = e => this.onenterframe(e);
        };
        const repo = this.createRepo();
        this.engine.register(TitleScenePresenter.create(repo));
        this.engine.register(Stage1ScenePresenter.create(repo));
    }

    private readonly core: Core;
    private readonly engine: IGameEngine;

    private createCore(): Core {
        const core = new Core(config.WIDTH, config.HEIGHT);
        core.preload(Object.values(assetKeys));
        core.fps = config.FPS;
        core.rootScene.backgroundColor = config.BACKGROUND_COLOR;
        return core;
    }

    private createRepo(): IRepo {
        const self = this;
        return new class implements IRepo {
            fetchImg(key: string): Surface {
                return self.core.assets[key];
            }
            pushNewScene(): Scene {
                const scene = new Scene();
                scene.ontouchstart = e => self.ontouchstart(e);
                self.core.pushScene(scene);
                return scene;
            }
        };
    }

    private readonly input: Input = {
        touchstart: { tag: "None" },
    };

    private onenterframe(e: Event) {
        try {
            this.engine.tick(this.input);
        } catch (e: unknown) {
            console.log(e);
        } finally {
            this.input.touchstart = { tag: "None" };
        }
    }

    private ontouchstart(e: Event) {
        this.input.touchstart = {
            tag: "TouchStart",
            pos: { x: e.x, y: e.y },
            localPos: { x: e.localX, y: e.localY },
        };
    }

    start(): void {
        this.core.start();
    }

    stop(): void {
        this.core.stop();
    }


    fetchImg(key: string): Surface {
        return this.core.assets[key];
    }

    pushNewScene(): Scene {
        const scene = new Scene();
        scene.ontouchstart = e => this.ontouchstart(e);
        this.core.pushScene(scene);
        return scene;
    }
}

class StageScene extends Scene {
    constructor(image: Surface) {
        super();
        this.image = image;
        this.frame = 0;
        // this.addChild(
        //     new Kuma1(image)
        //         .moveTo(50, 50)
        // );
        // this.addChild(
        //     new Kuma1(image)
        //         .moveTo(50, 100)
        //         .rotate(45)
        // );
        // this.addChild(
        //     new Kuma1(image)
        //         .moveTo(50, 150)
        //         .scale(3, 2)
        // );
        // this.addChild(
        //     new Kuma1(image)
        //         .moveTo(50, 200)
        //         .setOnEnterFrame(kuma => {
        //             kuma.frame += 1
        //             kuma.frame %= 3
        //             kuma.moveBy(1, 0)
        //             if (kuma.x > 320) {
        //                 kuma.x = 0
        //             }
        //         })
        // );
        // const label = new Label("hello");
        // label.color = "white";
        // label.font = "25px 'Meiryo', 'メイリオ', 'ヒラギノ角ゴ Pro W3', sans-serif";
        // this.addChild(label);
    }

    private image: Surface;
    private frame: number;

    onEnterFrame(e: Event): void {
        if (this.frame % 5 == 0) {
            const text = "Hello";
            const label = createLabel(
                "Hello",
                randfloat(0, 300) | 0,
                randfloat(0, 300) | 0,
                createColor(
                    randfloat(0, 255) | 0,
                    randfloat(0, 255) | 0,
                    randfloat(0, 255) | 0
                )
            );
            this.addChild(label);
        }

        if (this.frame % 30 == 0) {
            const kuma = new Kuma(this.image);
            kuma.x = randfloat(10, 300) | 0;
            kuma.y = randfloat(10, 300) | 0;
            this.addChild(kuma);
        }

        this.frame += 1;
    }

    override onenterframe(e: Event): void {
    }
}

// class Kuma1 extends Sprite {
//     constructor(image: Surface) {
//         super(32, 32)
//         this.image = image
//         // this.frame = [0, 1, 2];
//     }

//     moveTo(x: number, y: number): Kuma1 {
//         super.moveTo(x, y)
//         return this
//     }

//     moveBy(x: number, y: number): Kuma1 {
//         super.moveBy(x, y)
//         return this
//     }

//     scale(x: number, y: number): Kuma1 {
//         super.scale(x, y)
//         return this
//     }

//     rotate(deg: number): Kuma1 {
//         super.rotate(deg)
//         return this
//     }

//     setOnEnterFrame(listener: (kuma: Kuma1) => void): Kuma1 {
//         // this.onenterframe = () => listener(this)
//         return this
//     }
// }

class Kuma extends Sprite {
    constructor(image: Surface) {
        super(32, 32)
        this.image = image
        this.vx = randfloat(-4, 4) | 0
        this.vy = randfloat(-4, 4) | 0
        if (this.vx < 0) this.scaleX *= -1
    }

    private vx: number;
    private vy: number;

    override onenterframe() {
        // this.x += this.vx
        // this.y += this.vy

        // this.frame += 1
        // this.frame %= 3

        // if (this.x < 0 || this.x > 290) {
        //     this.vx *= -1
        //     this.scaleX *= -1
        // }
        // if (this.y < 0 || this.y > 290) {
        //     this.vy *= -1
        // }
    }

    override ontouchstart() {
        const label = createLabel("10point", this.x, this.y, "white")
        this.parentNode.addChild(label)
        this.parentNode.removeChild(this)
    }
}

function createColor(r: number, g: number, b: number) {
    return `rgb(${r},${g},${b})`
}

function createLabel(text: string, x: number, y: number, color: string) {
    const label = new Label(text)
    label.font = "12px 'Consolas', 'Monaco', 'MS ゴシック'"
    label.moveTo(x, y)
    label.color = color
    label.onenterframe = () => {
        label.opacity -= 0.01
        if (label.opacity <= 0) {
            label.parentNode.removeChild(label)
        }
    }
    return label
}