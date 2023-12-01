import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from '../layouts/loading/loading.module';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    LoadingModule,
    FormsModule
  ]
})
export class ProfileModule { }
