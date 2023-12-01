import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private http: HttpClient) { }
  env = environment;


  sendWalletAccount(wallet) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "wallet": wallet
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `PostConnection`
    return this.http.post(url, data_convert_json, { headers: headers })
  }


  BuyBlr(data) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "hash_transaction": data.hash_transaction,
      "status": data.status,
      "address_send": data.address_send,
      "amount_send_usdt": data.amount_send_usdt,
      "amount_recieved_blr": data.amount_recieved_blr,
      "wallet": data.wallet,
      "porcent": data.porcent
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `BuyBlr`
    return this.http.post(url, data_convert_json, { headers: headers })
  }


  sendWalletForPayments(wallet, code?, nameMethod?) {
    let method = 'PostWallet';
    if(nameMethod != undefined)
      method = nameMethod;

    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "wallet": wallet,
      "code": code
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + method
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  getReferralsForWallet(data) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "type": data
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `GetReferrals`
    return this.http.post(url, data_convert_json, { headers: headers })
  }
  
  saveWalletSuper(wallet) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "wallet": wallet
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `PostWallet`
    return this.http.post(url, data_convert_json, { headers: headers })
  }
}
