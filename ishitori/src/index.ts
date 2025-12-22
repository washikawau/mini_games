import { enchant, ENV } from "enchant.js";

import { GameController } from "./adapter/in/GameController";

enchant();
ENV.TOUCH_ENABLED = true;

window.onload = () => {
    const controller = GameController.create();
    window.onblur = () => controller.pause();
    window.onfocus = () => controller.resume();
    controller.start();
}
