import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BinaryTreeTerComponent} from './binary-tree-ter/binary-tree-ter.component';
import {TreePlayerBisComponent} from './tree-player-bis/tree-player-bis.component';
import {DragDropModule} from "@angular/cdk/drag-drop";
import {PlayerListComponent} from './player-list/player-list.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSliderModule} from "@angular/material/slider";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent,
    BinaryTreeTerComponent,
    TreePlayerBisComponent,
    PlayerListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DragDropModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSliderModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
