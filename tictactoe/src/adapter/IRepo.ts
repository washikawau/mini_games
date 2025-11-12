import { Core, Scene, Surface } from "enchant.js";

export interface IRepo {
    core: Core;
    fetchToPxScale(): number;
    fetchImg(key: string): Surface;
    pushNewScene(): Scene;
}

export const assetKeys = {
    kuma1: "./assets/chara1.png",
};
