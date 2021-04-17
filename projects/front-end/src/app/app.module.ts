import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ManyToManyAuroraModule } from 'projects/many-to-many-aurora/src/lib/many-to-many-aurora.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ManyToManyAuroraModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
