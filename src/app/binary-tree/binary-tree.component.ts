import {Component, Input, OnInit} from '@angular/core';
import {Bracket} from "../interface/bracket";
import {DoubleBinaryLeaf, Player} from "../interface/doubleLeaf";

@Component({
  selector: 'app-binary-tree',
  templateUrl: './binary-tree.component.html',
  styleUrls: ['./binary-tree.component.css']
})
export class BinaryTreeComponent implements OnInit {

  @Input() nbNodes: number = 0;
  depth: number = 0;
  rounds: number = 0;
  personalBracket: Bracket | undefined;
  maxBracketDepth = 0;

  constructor() {
  }

  ngOnInit(): void {
    this.depth = Math.log2(this.nbNodes) / Math.log2(2);
    this.rounds = Math.log(this.nbNodes) / Math.log(2) - 1;

    // On met ça ici car le @Input n'est pris que là, pas dans le constructeur.
    // this.createBracket();
    // this.createLoserBracket();

  }

  createBracket() {
    if (this.personalBracket === undefined)
      this.personalBracket = new Bracket(new Player(1, "Player 1"), new Player(2, "Player 2"), null, 0);
    const layeredDepth = Math.floor(Math.log2(this.nbNodes) / Math.log2(2));
    this.personalBracket.createNewLayers(1, layeredDepth);
    for (let i = 0; i < this.nbNodes - Math.pow(2, layeredDepth); i++) {
      this.personalBracket.addNextOpponentInterface();
    }
  }

  createLoserBracket() {
    if (this.personalBracket === undefined)
      this.personalBracket = new Bracket(new Player(1, "Player 1"), new Player(2, "Player 2"), null, 0);

    const layeredDepth = Math.floor(Math.log2(this.nbNodes) / Math.log2(2));
    const nbMatchWithLoserBracket = this.nbNodes * 2 - 2;
    this.personalBracket.createLoserLayer(1, layeredDepth - 2);
    this.maxBracketDepth = this.personalBracket.maxBracketDepth(0);
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
    console.log(this.nbNodes);
    this.personalBracket = new Bracket(new Player(1, "Player 1"), new Player(2, "Player 2"), null, 0);
    this.createBracket();
  }
}
