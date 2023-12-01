import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuyTokenRoutingModule } from './buy-token-routing.module';
import { FormsModule } from '@angular/forms';
import { BuyTokenComponent } from './buy-token.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingModule } from '../layouts/loading/loading.module';
import { PipeCurrencyCopModule } from 'src/app/pipes/currency-cop.module';




@NgModule({
  declarations: [BuyTokenComponent],
  imports: [
    CommonModule,
    BuyTokenRoutingModule,
    TranslateModule,
    LoadingModule,
    FormsModule,
    PipeCurrencyCopModule
  ],
})
export class BuyTokenModule { }
