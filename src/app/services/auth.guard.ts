import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
/* La clase AuthGuard implementa la interfaz CanActivate, que es una protección que comprueba si se
puede activar una ruta. Si se puede activar la ruta, el vigilante permite continuar la navegación.
Si no, el guardia bloquea la navegación. */
export class AuthGuard  {
  isLogged: boolean | undefined;
  constructor(private router: Router,
     private authenticationService: AuthenticationService) { 
    // console.log("Entro al auth guard")
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.authenticationService.isLogged.subscribe(logged => {
      this.isLogged = logged;
      // console.log("Islogged: ", this.isLogged)
    });
    let token = localStorage.getItem('token')
    if (this.isLogged && token != undefined) {
      // console.log("Tienes acceso para entrar el backoffice")
      return true;
    } else {
      // console.log("No Tienes acceso para entrar el backoffice")
      this.router.navigate(['login']);
      return false;
    }

  }
}
