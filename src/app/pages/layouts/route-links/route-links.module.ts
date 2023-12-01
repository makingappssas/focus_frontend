import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteLinksComponent } from './route-links.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    RouteLinksComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forRoot([]), // Asegúrate de incluir esta línea
  ],
  exports:[
    RouteLinksComponent
  ]
})
export class RouteLinksModule { }
