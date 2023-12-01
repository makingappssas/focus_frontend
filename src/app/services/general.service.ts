import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  constructor(private http: HttpClient) { }
  env = environment;

  
  changeLanguage(language) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "language": language
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `languageUpdate`
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  
  getAmountOfReferrals() {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `AmountOfRef`
    return this.http.get<any>(url, { headers: headers })
  }
}
