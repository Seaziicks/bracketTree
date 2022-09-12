import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Player} from "../interface/DoubleLeaf";

@Component({
  selector: 'app-tree-player-bis',
  templateUrl: './tree-player.component.html',
  styleUrls: ['./tree-player.component.css']
})
export class TreePlayerComponent implements OnInit {

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
