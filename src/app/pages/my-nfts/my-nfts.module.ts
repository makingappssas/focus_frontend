import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyNftsRoutingModule } from './my-nfts-routing.module';
import { MyNftsComponent } from './my-nfts.component';
import { TranslateModule } from '@ngx-translate/core';
import { LoadingModule } from '../layouts/loading/loading.module';


@NgModule({
  declarations: [
    MyNftsComponent
  ],
  imports: [
    CommonModule,
    MyNftsRoutingModule,
    TranslateModule,
    LoadingModule
  ]
})
export class MyNftsModule { }
