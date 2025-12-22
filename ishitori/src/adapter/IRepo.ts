import { Core, Scene, Surface } from "enchant.js";

export interface IRepo {
    core: Core;
    fetchImg(key: string): Surface;
    pushNewScene(): Scene;
}

export const assetKeys = {
    start: "./assets/start.png",
    end: "./assets/end.png",
    font1: "./assets/font1.png",
    kuma1: "./assets/chara1.png",
} as const;
