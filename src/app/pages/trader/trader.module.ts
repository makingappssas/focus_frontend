import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TraderRoutingModule } from './trader-routing.module';
import { TraderComponent } from './trader.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TraderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TraderRoutingModule
  ]
})
export class TraderModule { }
