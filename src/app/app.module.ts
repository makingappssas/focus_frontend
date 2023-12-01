import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OutsideComponent } from './core/outside-app.component';
import { InsideComponent } from './core/inside-app.component';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { InterceptorService } from './services/interceptor.service';
import { NavbarModule } from './pages/layouts/navbar/navbar.module';
import { SidebarModule } from './pages/layouts/sidebar/sidebar.module';
import { FooterModule } from './pages/layouts/footer/footer.module';


@NgModule({
  declarations: [
    AppComponent,
    OutsideComponent,
    InsideComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  imports: [
    BrowserModule,
    NavbarModule,
    SidebarModule,
    FooterModule,
    AppRoutingModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => {
          return new TranslateHttpLoader(http, './assets/i18n/', '.json');
        },
        deps: [HttpClient]
      }
    }),
  ],  
  bootstrap: [AppComponent],
})
export class AppModule { }
