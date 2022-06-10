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
  personalBracket: Bracket;

  constructor() {
    this.personalBracket = new Bracket(new Player(1, "Player 1"), new Player(2, "Player 2"), null, 0);
  }

  ngOnInit(): void {
    this.depth = Math.log2(this.nbNodes) / Math.log2(2);
    this.rounds = Math.log(this.nbNodes) / Math.log(2) - 1;

    // On met ça ici car le @Input n'est pris que là, pas dans le constructeur.
    const layeredDepth = Math.floor(Math.log2(this.nbNodes) / Math.log2(2));
    this.personalBracket.createNewLayers(1, layeredDepth);
    for (let i = 0; i < this.nbNodes - Math.pow(2, layeredDepth); i++) {
      this.personalBracket.addNextOpponentInterface();
    }
  }

  setWinner(bracket: Bracket, player: Player) {
    if (bracket.value1.name !== "" && bracket.value2.name !== "") {
      bracket.winner = player;
      if (bracket.parent !== null) {
        bracket.parent.declareWinner(bracket);
        if (bracket.parent && bracket.parent.winner)
          this.setWinner(bracket.parent, player);
      }
    }
  }
}
