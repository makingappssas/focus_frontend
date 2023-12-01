import { Component } from '@angular/core';

@Component({
  selector: 'app-route-links',
  templateUrl: './route-links.component.html',
  styleUrls: ['./route-links.component.scss']
})
export class RouteLinksComponent {
  currentRol;

  ngOnInit(){
    this.currentRol = localStorage.getItem('type_user');
  }

  clickId(){
    document.getElementById('dropdownMenuButtonRoutes').click();
  }
}
