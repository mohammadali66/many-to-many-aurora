import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ManyToManyAuroraComponent } from './many-to-many-aurora.component';



@NgModule({
  declarations: [
    ManyToManyAuroraComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  exports: [
    ManyToManyAuroraComponent
  ]
})
export class ManyToManyAuroraModule { }
