import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

type HistoryMethod = 'HistoryBlr' | 'HistoryNft';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient) { }
  env = environment;

  /**
   * 
   * @param data data para filtrar el historial
   * @param method 'HistoryBlr' para traer los tokens o 'HistoryNft' para traer los nfts
   * @returns 
   */
  getHistory(data, method: HistoryMethod) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': localStorage.getItem('token')

    });
    // console.log(data)
    const dataJson =
    {
      "user": data.user,
      "status": data.status,
      "date_end": data.date_end,
      "date_start": data.date_start,
      "type_nft": data.type_nft
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + method
    return this.http.post(url, data_convert_json, { headers: headers })
  }
}
