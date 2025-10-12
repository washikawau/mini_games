import { Scene, Surface } from "enchant.js";

export interface IRepo {
    fetchImg(key: string): Surface;
    pushNewScene(): Scene;
}

export const assetKeys = {
    kuma1: "./assets/chara1.png",
};
