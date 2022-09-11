import {Component, ViewChild} from '@angular/core';
import {Player} from "./interface/doubleLeaf";
import {BinaryTreeTerComponent} from "./binary-tree-ter/binary-tree-ter.component";
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
    @ViewChild(BinaryTreeTerComponent) Bracket: BinaryTreeTerComponent | undefined;

    async updatePlayerList() {
        await this.Bracket?.setBrackets();
    }

    getPlayerList(): Player[] {
        return PlayerListService.getPlayerList();
    }
}
