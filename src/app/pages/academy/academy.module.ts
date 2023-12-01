import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademyRoutingModule } from './academy-routing.module';
import { AcademyComponent } from './academy.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingModule } from '../layouts/loading/loading.module';
import { LoadFilesAcademyComponent } from './load-files-academy/load-files-academy.component';


@NgModule({
  declarations: [
    AcademyComponent,
    LoadFilesAcademyComponent
  ],
  imports: [
    CommonModule,
    AcademyRoutingModule,
    TranslateModule,
    FormsModule,
    NgbTooltipModule,
    LoadingModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    NgbDropdownModule
  ],
  exports: [
    AcademyComponent
  ]
})
export class AcademyModule { }
