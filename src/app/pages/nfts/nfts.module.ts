import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NftsRoutingModule } from './nfts-routing.module';
import { NftsComponent } from './nfts.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from '../layouts/loading/loading.module';


@NgModule({
  declarations: [
    NftsComponent
  ],
  imports: [
    CommonModule,
    NftsRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingModule
  ]
})
export class NftsModule { }
