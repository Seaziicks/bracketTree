import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Player} from "../interface/doubleLeaf";

@Component({
  selector: 'app-tree-player-bis',
  templateUrl: './tree-player-bis.component.html',
  styleUrls: ['./tree-player-bis.component.css']
})
export class TreePlayerBisComponent implements OnInit {

  @Input() player: Player | undefined;
  @Input() canWin: boolean = false;
  @Input() isHighSeeded: boolean = false;
  @Output() playerWonEvent = new EventEmitter<Player>();
  score: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  playerWon() {
    if(this.player) {
      this.player.isWinner = true;
      this.playerWonEvent.emit(this.player);
    }
  }

}
