import { Player } from "./types";

export class PlayerW {
    static wrap(player: Player): PlayerW {
        return new PlayerW(player);
    }

    private constructor(player: Player) {
        this.player = player;
    }

    readonly player: Player;

    get opponent(): Player {
        return this.player === "MAN" ? "CPU" : "MAN";
    }
}
