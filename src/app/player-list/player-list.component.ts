import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Player} from "../interface/doubleLeaf";
import {delay} from "rxjs/operators";
import {BinaryTreeTerComponent} from "../binary-tree-ter/binary-tree-ter.component";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {

  @ViewChild(BinaryTreeTerComponent) Bracket: BinaryTreeTerComponent | undefined;
  @ViewChild('playerNameInput') playerNameInput: any;

  displayTree: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  playerNameFormControl = new FormControl('', [Validators.required]);

  addPlayer(playerName: string) {
    this.Players.push(new Player(this.Players.length + 1, playerName));
    this.playerNameInput.nativeElement.value = ' ';
  }

  matcher = new MyErrorStateMatcher();

  Players: Player[] = [
    new Player(1 ,'Charly'),
    new Player(2, 'Thibault'),
    new Player(3, 'Jaffar'),
    new Player(4, 'Kazem'),
    new Player(5, 'Dimitri'),
    new Player(6, ' '),
    new Player(7, 'Xavier'),
    new Player(8, 'Dana')
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Players, event.previousIndex, event.currentIndex);
    for(let i = 0; i < this.Players.length; i++) {
      this.Players[i].seed = i + 1;
    }
  }

  async generateTree() {
    this.displayTree = true;
    await this.Bracket?.setBrackets(this.Players);
  }

}
