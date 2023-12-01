import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferralsRoutingModule } from './referrals-routing.module';
import { ReferralsComponent } from './referrals.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ReferralsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReferralsRoutingModule
  ]
})
export class ReferralsModule { }
