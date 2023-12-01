import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  env =  environment;
  constructor(private http: HttpClient) { }

  getUsers(){
    var headers : HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `GetUsersNotifications`
    return this.http.get<any>(url,{headers:headers})
  }

  sendNotifications(data){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': localStorage.getItem('token')

    });
    const dataJson =
    {
      "ids":data.ids,
      "subject":data.subject,
      "description":data.description,
      "url":data.url,
      "status_icon":data.status_icon
      }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'NotificationCreate'
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  cantNotifications(){
    var headers : HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `CantNotifications`
    return this.http.get<any>(url,{headers:headers})
  }

  getNotifications(){
    var headers : HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `NotificationsGet`
    return this.http.get<any>(url,{headers:headers})
  }

  
  deleteNotification(id){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "id_notification": id
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `NotifyDelate`
    return this.http.delete(url, {
      headers: headers,
      body:data_convert_json
    }, )
  }


}
