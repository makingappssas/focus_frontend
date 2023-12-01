import { NgModule } from '@angular/core';
import { CurrencyCopPipe } from './currency-cop.pipe';
import { DecimalPipe } from '@angular/common';


@NgModule({
  declarations: [
    CurrencyCopPipe
  ],
  imports: [

  ],
  providers:[
    DecimalPipe
  ],
  exports:[
    CurrencyCopPipe
  ]
})
export class PipeCurrencyCopModule { }
