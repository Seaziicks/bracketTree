import {Component, Input, OnInit} from '@angular/core';
import {Bracket} from "../interface/bracket";
import {Player} from "../interface/doubleLeaf";

@Component({
  selector: 'app-binary-tree-bis',
  templateUrl: './binary-tree-bis.component.html',
  styleUrls: ['./binary-tree-bis.component.css']
})
export class BinaryTreeBisComponent implements OnInit {

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
    console.log(this.personalBracket)
    this.createLoserBracket();

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

    // Ici on essaye de traficoter pour avoir le nombre qu'on veut.
    const layeredDepth = Math.floor(Math.log2(this.nbNodes - 1) / Math.log2(2));
    // console.log('layeredDepth :', layeredDepth);
    const nbMatchWithLoserBracket = this.nbNodes * 2 - 2;
    // this.personalBracket.createLoserLayer(1, layeredDepth - 1);
    for (let i = 0; i < this.nbNodes - 3; i++) {
      // console.log('=====================================')
      // console.log('Ajout du numéro :', i + 3);
      this.personalBracket.addNextLoserOpponentInterface(this.nbNodes, i);
    }
    // console.log('this.nbNodes - 3 :', this.nbNodes - 3)
    // console.log('getNbLeaf :', this.personalBracket.getNbLeaf());
    // console.log('maxDepthOfBracket :', this.personalBracket.maxDepthOfBracket())
    // console.log('maxDepthWidth :', this.personalBracket.maxDepthWidth(0))
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
    // console.log(this.nbNodes);
    this.personalBracket = new Bracket(new Player(1, "Player 1"), new Player(2, "Player 2"), null, 0);
    // this.createBracket();
    this.createLoserBracket();
  }
}
