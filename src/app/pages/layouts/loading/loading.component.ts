import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() textShow;

  constructor(){
    

  }

  ngOnInit(){
    if(this.textShow == undefined){
      this.textShow = "Cargando"
    }else{
      if(this.textShow.toString().length > 12){
        document.getElementById('text').style.fontSize = '1em';
      }
    }
  }
}
