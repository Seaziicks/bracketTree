import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BinaryTreeComponent } from './binary-tree/binary-tree.component';
import { TreePlayerComponent } from './tree-player/tree-player.component';

@NgModule({
  declarations: [
    AppComponent,
    BinaryTreeComponent,
    TreePlayerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
