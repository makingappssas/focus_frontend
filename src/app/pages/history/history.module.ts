import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { PipeCurrencyCopModule } from 'src/app/pipes/currency-cop.module';


@NgModule({
  declarations: [
    HistoryComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    HistoryRoutingModule,
    NgbPaginationModule,
    PipeCurrencyCopModule
  ]
})
export class HistoryModule { }
