import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ReferralsService {

  constructor(private http: HttpClient) { }
  env = environment;

  getReferred(id) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': localStorage.getItem('token')

    });
    const dataJson =
    {
      "id":id
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'ListReferrals'
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  amountUsers(){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `GetCantUsers`
    return this.http.get<any>(url, { headers: headers })
  }
}
