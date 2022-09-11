import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroupDirective,
    NgForm,
    ValidationErrors,
    ValidatorFn,
    Validators
} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {Player} from "../interface/doubleLeaf";
import {BinaryTreeTerComponent} from "../binary-tree-ter/binary-tree-ter.component";
import {PlayerListService} from "../player-list.service";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

export function forbiddenEmptyNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const forbidden = control.value.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        return forbidden.length === 0 ? {forbiddenEmptyName: {value: control.value}} : null;
    };
}

export function alreadyExistingNameNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return PlayerListService.getPlayerList().some(name =>
            name.getName().replace(/\s*/g, '') == control.value.replace(/\s*/g, '')) ?
            {alreadyExistingName: {value: control.value}}
            : null;
    };
}

@Component({
    selector: 'app-player-list',
    templateUrl: './player-list.component.html',
    styleUrls: ['./player-list.component.css']
})
export class PlayerListComponent implements OnInit {

    @ViewChild(BinaryTreeTerComponent) Bracket: BinaryTreeTerComponent | undefined;
    @ViewChild('playerNameInput') playerNameInput: any;
    @Output() playerListUpdated = new EventEmitter<Player[]>();

    displayTree: boolean = false;

    constructor() {
    }

    ngOnInit(): void {
    }

    playerNameFormControl = new FormControl('', [Validators.required, forbiddenEmptyNameValidator(), alreadyExistingNameNameValidator()]);

    addPlayer(playerName: string) {
        console.log(this.playerNameFormControl.errors);
        console.log(this.playerNameFormControl.errors?.['forbiddenEmptyName']);
        console.log(this.playerNameFormControl.hasError('forbiddenEmptyName'));
        if (this.playerNameFormControl.valid) {
            playerName = playerName.replace(/\s{3,}/g, '    ');                                  // On permet les espaces multiples, pour rigoler.
            console.log(playerName);
            PlayerListService.addPlayerToList(playerName);
            // this.playerNameFormControl.setValue('');
            this.playerNameFormControl.reset();
        }
    }

    matcher = new MyErrorStateMatcher();

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(PlayerListService.getPlayerList(), event.previousIndex, event.currentIndex);
        for (let i = event.currentIndex - 1; i < PlayerListService.getPlayerList().length; i++) {
            PlayerListService.getPlayerList()[i].seed = i + 1;
        }
    }

    async generateTree() {
        this.displayTree = true;
        await this.Bracket?.setBrackets();
    }

    onPlayerListUpdate() {
        this.playerListUpdated.emit(PlayerListService.getPlayerList());
    }

    getPlayerList(): Player[] {
        return PlayerListService.getPlayerList();
    }

}
