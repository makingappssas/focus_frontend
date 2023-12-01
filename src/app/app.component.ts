import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gobeyond';
  language;

  constructor(private translate: TranslateService) {
    this.language = localStorage.getItem('CurrentLang');
    this.language = localStorage.getItem('CurrentLang');
    if (this.language == undefined ||
      this.language == null ||
      this.language == "null" ||
      this.language == "") {
      this.translate.use("en")
      localStorage.setItem('CurrentLang', 'en')
    } else {
      this.translate.use(this.language)
    }
  }
}
