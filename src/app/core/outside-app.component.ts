import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    template: `
        <router-outlet></router-outlet>
    `
})

export class OutsideComponent {

    constructor(private router: Router) {
        // console.log("estas en la ruta externa")
        let token = localStorage.getItem('token');
        if (token != undefined) {
            this.router.navigate(['/profile']);
        }
    }

    ngOnInit() {

    }
}