import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  template: `
  <div class="content-page-backoffice">
        <div class="sidebar-main-content">
          <app-sidebar></app-sidebar>
        </div>

        <div class="navbar-main-content">
          <app-navbar class="h-100 d-block"></app-navbar>
        </div>
        <div id="page-content" class="page-content div-scroll">
          <router-outlet></router-outlet>
        </div>
        <div class="footer-main-content">
          <app-footer></app-footer>
        </div>
  </div>

    `
})

export class InsideComponent {

  constructor(private router: Router) {

  }
}