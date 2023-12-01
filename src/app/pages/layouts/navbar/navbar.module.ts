import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { RouteLinksModule } from '../route-links/route-links.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouteLinksModule,
    FormsModule,
    RouterModule,
    NgbDropdownModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule { }
