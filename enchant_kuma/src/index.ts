import { enchant, ENV } from "enchant.js";

import { GameController } from "@src/adapter/in/GameController";

enchant();
ENV.TOUCH_ENABLED = true;

window.onload = () => {
    const gameController = new GameController();
    gameController.start();
}
