import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor(private http: HttpClient) { }
  env = environment;

  listUsers() {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `GetAllUsers`
    return this.http.get<any>(url, { headers: headers })
  }

}
