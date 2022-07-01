import {Component, Input, OnInit} from '@angular/core';
import {Bracket} from "../interface/bracket";
import {Player} from "../interface/doubleLeaf";
import {DoubleEliminationBracket} from "../interface/DoubleEliminationBracket";

@Component({
  selector: 'app-binary-tree-ter',
  templateUrl: './binary-tree-ter.component.html',
  styleUrls: ['./binary-tree-ter.component.css']
})
export class BinaryTreeTerComponent implements OnInit {

  @Input() nbNodes: number;
  depth: number = 0;
  rounds: number = 0;
  loserBracket: Bracket | undefined;
  winnerBracket: Bracket | undefined;
  maxBracketDepth = 0;

  doubleEliminationBracket: DoubleEliminationBracket;

  constructor() {
    this.nbNodes = 3;
    this.doubleEliminationBracket = new DoubleEliminationBracket(this.getBasicPlayerArray(this.nbNodes));
    this.setBrackets();
  }

  ngOnInit(): void {
    this.depth = Math.log2(this.nbNodes) / Math.log2(2);
    this.rounds = Math.log(this.nbNodes) / Math.log(2) - 1;

    // On met ça ici car le @Input n'est pris que là, pas dans le constructeur.
    // console.log(this.winnerBracket)
    // console.log(this.loserBracket)


    this.setBrackets();
    console.log(this.winnerBracket);
  }

  setBrackets() {
    this.doubleEliminationBracket = new DoubleEliminationBracket(this.getBasicPlayerArray(this.nbNodes));
    this.doubleEliminationBracket.defineOrder();
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
    this.setBrackets();
    this.depth = Math.log2(this.nbNodes);
    this.rounds = Math.log(this.nbNodes) / Math.log(2) - 1;
  }

  getBasicPlayerArray(nbPlayer: number) {
    const players : Player[] = [];
    for (let i = 0; i < nbPlayer; i++) {
      players.push(new Player(i, 'Player ' + i));
    }
    return players;
  }

}
