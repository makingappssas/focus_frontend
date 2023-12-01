import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import  Swal from 'sweetalert2'

@Injectable()
export class InterceptorService implements HttpInterceptor {

  env = environment;

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // throw new Error('Method not implemented.')
    // console.log("Este es la req", req)
    return next.handle(req).pipe(

      catchError(
        this.mensajeError
      )
    )
  }





  mensajeError(error: HttpErrorResponse) {
    let ruta = "http://localhost:4200/"
    // console.log("Mensaje del error: ", error.error.error)
    let message = error.error.error;
    // console.log("Tipo de error:" , error.status)
    if(error.status == 401){
    setTimeout(() => {
      Swal.fire({
        text: message,
        icon: 'warning',
        confirmButtonColor: "#000"
      }).then(action =>{
          localStorage.removeItem('token');
          setTimeout(() => {
            if(message != 'recaptcha fail'){
              window.location.replace("./home")
            }
          }, 100);
         
      })  
    }, 10);
    
    localStorage.clear();
    }

    return throwError(error)
  }




}
