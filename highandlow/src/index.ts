import { enchant, ENV } from "enchant.js";

import { GameController } from "./adapter/in/GameController";

enchant();
ENV.TOUCH_ENABLED = true;

window.onload = () => {
    const controller = GameController.create();
    controller.start();
}

