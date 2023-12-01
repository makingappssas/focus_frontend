import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NftService {

  constructor(private http: HttpClient) { }
  env = environment;

  createNft(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('price', data.price);
    formData.append('img', data.img);

    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    const url = this.env.rootUrl + 'CreateNft';
    return this.http.post(url, formData, { headers: headers });
  }

  deleteNFT(id) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': localStorage.getItem('token')

    });
    const dataJson =
    {
      "nft_id": id
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'DeleteNft'
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  buyNft(data) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "status": data.status,
      "amount_send_usdt": data.amount_send_usdt,
      "porcent": data.porcent,
      "wallet": data.wallet,
      "address_send": data.address_send,
      "hash_transaction": data.hash,
      "nft_id": data.nft_id,
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `BuyNft`
    return this.http.post(url, data_convert_json, { headers: headers })
  }




  getMyNFTs() {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `MyNfts`
    return this.http.get<any>(url, { headers: headers })
  }


  getCantNftAvailable(){
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `CantNftAvailable`
    return this.http.get<any>(url, { headers: headers })
  }
}
