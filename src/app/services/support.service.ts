import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private http: HttpClient) { }
  env = environment;

  filterTickets(category, status) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "category": category,
      "status": status
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `TicketsFilter`
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  getMessagesFromATicket(id) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "id": id,
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `Chat`
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  finishedPqrs(id) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "id": id,
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `FinishedTickets`
    return this.http.put(url, data_convert_json, { headers: headers })
  }


  addMessage(data) {
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('contents', data.contents);
    formData.append('img', data.img);
  
    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });
  
    const url = this.env.rootUrl + 'CreateMessages';
    return this.http.post(url, formData, { headers: headers });
  }

  listGategories() {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `ListCategory`
    return this.http.get<any>(url, { headers: headers })
  }


  ListStatus(){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `ListStatus`
    return this.http.get<any>(url, { headers: headers })
  }


  createTicket(data) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "name_pqrs": data.name,
      "category": data.type
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `CreateTicket`
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  createMessage(data) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "id_ticket": data.id_ticket,
      "description": data.description,
      "img": data.img
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `createMessage`
    return this.http.post(url, data_convert_json, { headers: headers })
  }

}
