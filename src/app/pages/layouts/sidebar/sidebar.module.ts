import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouteLinksModule } from '../route-links/route-links.module';



@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouteLinksModule
  ],
  exports: [
    SidebarComponent
  ]
})
export class SidebarModule { }
