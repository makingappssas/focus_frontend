import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { WalletConnectModalService } from './wallet-connect-modal.service';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private logged = new ReplaySubject<boolean>(1);
  isLogged = this.logged.asObservable();
  env = environment
  constructor(private http: HttpClient,
    private walletService: WalletConnectModalService,
    private router: Router) {
    if (localStorage.getItem('token') != undefined && localStorage.getItem('token') != "undefined") {
      this.logged.next(true);
      // console.log("Logueado");
    } else {
      this.logged.next(false);
      // console.log("No logueado");
    }
  }

  loginUser(user: string, pass: string, token: any): Observable<any> {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': token

    });
    let user_ = user.toString().toLowerCase();
    const dataJson =
    {
      "username": user_.trim(),
      "password": pass.trim()
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'Login'
    this.logged.next(true);
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  registerUser(data: any): Observable<any> {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': data.token

    });
    let user =  data.username.toString().toLowerCase();
    const dataJson =
    {
      "username": user,
      "email": data.email,
      "password": data.password.toString().trim(),
      "code": data.code,
      "code_referral": data.link_referral,
      "language": 'en'
    }
    // {
    //   "username": user_,
    //     "password": data.pass.trim(),
    //       "language": 'en',
    //         "invitation_code": data.referred
    // }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'Register'
    this.logged.next(true);
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  changePasswordForForgotten(data){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': data.token

    });
    const dataJson =
    {
      "code": data.code,
      "email": data.email.toString().trim(),
      "password": data.password
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'ChangePassword'
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  changePasswordAfterLogging(data){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': localStorage.getItem('token')

    });
    const dataJson =
    {
      "code": data.code,
      "password": data.password
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'ChangePassword'
    return this.http.put(url, data_convert_json, { headers: headers })
  }

  changeCode(email){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8"
    });
    const dataJson =
    {
      "email": email.toString().trim()
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'ChangeCode'
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  
  getCode(email, token, username?){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': token

    });
    const dataJson =
    {
      "email": email.toString().trim(),
      "username": username
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'GetCode'
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  getCodeAfterLogging(){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `GetCode`
    return this.http.get<any>(url, { headers: headers })
  }

  forgetPassword(email, token){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': token

    });
    const dataJson =
    {
      "email": email.toString().trim()
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'GetCode'
    return this.http.put(url, data_convert_json, { headers: headers })
  }


  logOut() {
    this.walletService.disconnectAccount();
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    this.logged.next(false);
    localStorage.clear();
    const url = this.env.rootUrl + `LogOut`
    return this.http.get<any>(url, { headers: headers })
  }
}
