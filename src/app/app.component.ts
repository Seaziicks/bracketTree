import {Component, ViewChild} from '@angular/core';
import {Player} from "./interface/doubleLeaf";
import {BinaryTreeComponent} from "./binary-tree/binary-tree.component";
import {PlayerListService} from "./player-list.service";

export enum MenuStates {
    PlayerList,
    BracketTree
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'bracketTree';
    state: MenuStates = MenuStates.PlayerList;
    MenuStates = MenuStates;
    @ViewChild(BinaryTreeComponent) Bracket: BinaryTreeComponent | undefined;

    async updatePlayerList() {
        await this.Bracket?.setBrackets();
    }

    getPlayerList(): Player[] {
        return PlayerListService.getPlayerList();
    }
}
