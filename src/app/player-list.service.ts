import {Injectable} from '@angular/core';
import {Player} from "./interface/Player";

@Injectable({
    providedIn: 'root'
})
export class PlayerListService {
    private static Players: Player[]= [
        new Player(1, 'Charly'),
        new Player(2, 'Thibault'),
        new Player(3, 'Jaffar'),
        new Player(4, 'Kazem'),
        new Player(5, 'Dimitri'),
        new Player(6, '[   ]'),
        new Player(7, 'Dana'),
        new Player(8, 'Xavier')
    ];

    constructor() {
    }

    public static getPlayerList() {
        return PlayerListService.Players;
    }

    public static addPlayerToList(playerName: string) {
        PlayerListService.Players.push(new Player(PlayerListService.Players.length + 1, playerName));
    }

    public static removeSpecificPlayerByName(playerName: string) {
        PlayerListService.Players.splice(PlayerListService.Players.findIndex(player => player.name === playerName), 1);
    }

    public static removeLastPlayer() {
        PlayerListService.Players.pop();
    }
}
