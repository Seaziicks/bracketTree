import {Component, Input, OnInit} from '@angular/core';
import {Bracket} from "../interface/Bracket";
import {Player} from "../interface/Player";
import {DoubleEliminationBracket} from "../interface/DoubleEliminationBracket";
import {PlayerListService} from "../player-list.service";

export enum BracketView {
    WinnerLoser,
    Winner,
    Loser
}

@Component({
    selector: 'app-binary-tree-ter',
    templateUrl: './binary-tree.component.html',
    styleUrls: ['./binary-tree.component.css']
})
export class BinaryTreeComponent implements OnInit {

    @Input() Players: Player[] = [];
    nbNodes: number = 0;
    depth: number = 0;
    rounds: number = 0;
    loserBracket: Bracket | undefined;
    winnerBracket: Bracket | undefined;
    maxBracketDepth = 0;
    BracketView = BracketView;
    view: BracketView = BracketView.Loser;

    doubleEliminationBracket: DoubleEliminationBracket | undefined;

    displayedBracket: Bracket | undefined;

    constructor() {
    }

    async ngOnInit(): Promise<void> {
        this.nbNodes = this.Players.length;
        console.log(this.Players);
        this.depth = Math.log2(this.nbNodes) / Math.log2(2);
        this.rounds = Math.log(this.nbNodes) / Math.log(2) - 1;

        // On met ça ici car le @Input n'est pris que là, pas dans le constructeur.
        // console.log(this.winnerBracket)
        // console.log(this.loserBracket)


        await this.setBrackets();
        await this.changeBracketView(this.view);
        console.log(this.winnerBracket);
    }

    async setBrackets() {
        this.doubleEliminationBracket = new DoubleEliminationBracket(PlayerListService.getPlayerList());
        await this.doubleEliminationBracket.createBrackets(PlayerListService.getPlayerList());
        this.winnerBracket = this.doubleEliminationBracket.winnerBracket;
        this.loserBracket = this.doubleEliminationBracket.loserBracket;
    }


    setWinner(bracket: Bracket, player: Player) {
        if (bracket.player1.getName() !== "" && bracket.player2.getName() !== "") {
            bracket.winner = player;
            if (bracket.parent !== null) {
                bracket.parent.declareWinner(bracket);
                if (bracket.parent && bracket.parent.winner)
                    this.setWinner(bracket.parent, player);
            }
        }
    }

    async changeNbNodes() {
        // console.log(this.nbNodes);
        console.clear();
        await this.setBrackets();
        this.depth = Math.log2(this.nbNodes);
        this.rounds = Math.log(this.nbNodes) / Math.log(2) - 1;
        await this.changeBracketView(this.view);
    }

    async addOneNode() {
        this.nbNodes++;
        PlayerListService.addPlayerToList('' + (PlayerListService.getPlayerList().length + 1));
        await this.changeNbNodes();
    }

    async substractOneNode() {
        this.nbNodes--;
        PlayerListService.removeLastPlayer();
        await this.changeNbNodes();
    }

    async keyDownNbNodes(event: any) {
        if (event.key === '+') {
            event.preventDefault();
            await this.addOneNode();
        } else if (event.key === '-') {
            event.preventDefault();
            await this.substractOneNode();
        } else if (event.key === 'ArrowLeft') {
            await this.substractOneNode();
        } else if (event.key === 'ArrowRight') {
            await this.addOneNode();
        }
        else if (event.key === 'ArrowDown') {
            await this.substractOneNode();
        } else if (event.key === 'ArrowUp') {
            await this.addOneNode();
        }
    }

    async changeBracketView(view: BracketView) {
        this.view = view;
        await this.setBrackets();
        switch (this.view) {
            case BracketView.WinnerLoser:
                this.displayWinnerLoserBracket();
                break;
            case BracketView.Winner:
                this.displayWinnerBracket();
                break;
            case BracketView.Loser:
                this.displayLoserBracket();
                break;
        }
        // this.displayedBracket = this.winnerBracket;
    }

    displayWinnerLoserBracket() {
        console.log('On tente de changer.')
        this.displayedBracket = this.doubleEliminationBracket?.getFullBracket();
    }

    displayWinnerBracket() {
        this.displayedBracket = this.doubleEliminationBracket?.getWinnerBracket();
    }


    displayLoserBracket() {
        this.displayedBracket = this.doubleEliminationBracket?.getLoserBracket();
    }

}
