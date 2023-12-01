import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { SupportComponent } from './support.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ChatComponent } from './chat/chat.component';
import { LoadingModule } from '../layouts/loading/loading.module';


@NgModule({
  declarations: [
    SupportComponent,
    ChatComponent
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    FormsModule,
    TranslateModule,
    LoadingModule,
    NgbPaginationModule
  ],
  exports:[
    SupportComponent
  ]
})
export class SupportModule { }
