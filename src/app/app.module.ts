import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BinaryTreeComponent } from './binary-tree/binary-tree.component';
import { TreePlayerComponent } from './tree-player/tree-player.component';
import {FormsModule} from "@angular/forms";
import { BinaryTreeBisComponent } from './binary-tree-bis/binary-tree-bis.component';

@NgModule({
  declarations: [
    AppComponent,
    BinaryTreeComponent,
    TreePlayerComponent,
    BinaryTreeBisComponent
  ],
    imports: [
        BrowserModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
