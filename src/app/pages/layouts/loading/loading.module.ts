import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    LoadingComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports:[
    LoadingComponent
  ]
})
export class LoadingModule { }
