import {Component, Input, OnInit} from '@angular/core';
import {Bracket} from "../interface/bracket";
import {Player} from "../interface/doubleLeaf";
import {DoubleEliminationBracket} from "../interface/DoubleEliminationBracket";

export enum BracketView {
    WinnerLoser,
    Winner,
    Loser
}

@Component({
    selector: 'app-binary-tree-ter',
    templateUrl: './binary-tree-ter.component.html',
    styleUrls: ['./binary-tree-ter.component.css']
})
export class BinaryTreeTerComponent implements OnInit {

    @Input() Players: Player[] = [];
    nbNodes: number = 0;
    depth: number = 0;
    rounds: number = 0;
    loserBracket: Bracket | undefined;
    winnerBracket: Bracket | undefined;
    maxBracketDepth = 0;
    BracketView = BracketView;
    view: BracketView = BracketView.WinnerLoser;

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


        await this.setBrackets(this.Players);
        this.displayWinnerLoserBracket();
        console.log(this.winnerBracket);
    }

    async setBrackets(players: Player[]) {
        this.doubleEliminationBracket = new DoubleEliminationBracket(this.Players);
        await this.doubleEliminationBracket.createBrackets(players);
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

    changeNbNodes() {
        // console.log(this.nbNodes);
        this.setBrackets(this.Players);
        this.depth = Math.log2(this.nbNodes);
        this.rounds = Math.log(this.nbNodes) / Math.log(2) - 1;
    }

    addOneNode() {
        this.nbNodes++;
        this.changeNbNodes();
    }

    substractOneNode() {
        this.nbNodes--;
        this.changeNbNodes();
    }

    keyDownNbNodes(event: any) {
        if (event.key === '+') {
            event.preventDefault();
            this.addOneNode();
        } else if (event.key === '-') {
            event.preventDefault();
            this.substractOneNode();
        } else if (event.key === 'ArrowLeft') {
            this.substractOneNode();
        } else if (event.key === 'ArrowRight') {
            this.addOneNode();
        }
    }

    async changeBracketView(view: BracketView) {
        this.view = view;
        await this.setBrackets(this.Players);
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
