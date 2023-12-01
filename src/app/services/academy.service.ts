import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AcademyService {

  constructor(private http: HttpClient) { }
  env = environment;


  getTypesResourcesAndProfiles() {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const url = this.env.rootUrl + `GetTypesAndProfiles`
    return this.http.get<any>(url, { headers: headers })
  }

  saveResource(data) {
    let author = null;
    let time = null
    if (data.author != undefined)
      author = data.author;

    if (data.time_audio != undefined)
      time = data.time_audio;


    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('language', data.language);
    formData.append('description', data.description);
    formData.append('author', author);
    formData.append('time_audio', time);
    formData.append('type_file', data.type_resource);
    formData.append('img', data.img);
    formData.append('document', data.resource);

    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    const url = this.env.rootUrl + 'SaveAcademyFiles';
    return this.http.post(url, formData, { headers: headers });
  }

  editResource(data) {

    let data_img;
    let author = null;
    let document = null;
    let time = null

    if (data.author != undefined)
      author = data.author;

    if (data.time_audio != undefined)
      time = data.time_audio;

    if (data.document != undefined)
      document = data.document;

    if (data.img != null && data.img.toString().includes("s3.amazonaws.com")) {
      data_img = null;
    } else {
      data_img = data.img;
    }
    if (data.author != undefined)
      author = data.author;


      
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('title', data.title);
    formData.append('language', data.language);
    formData.append('description', data.description);
    formData.append('author', author);
    formData.append('time_audio', time);
    formData.append('type_document', data.type_document);
    formData.append('img', data_img);
    formData.append('document', document);

    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    const url = this.env.rootUrl + 'EditFileAcademy';
    return this.http.post(url, formData, { headers: headers });



    // var headers: HttpHeaders = new HttpHeaders({
    //   "Content-Type": "application/json; charset=utf-8",
    //   'Authorization': localStorage.getItem('token')

    // });
    // const dataJson =
    // {
    //   "id": data.id,
    //   "img": data_img,
    //   "language": data.language,
    //   "author": author,
    //   "time_audio": time,
    //   "document": document,
    //   "title": data.title,
    //   "description": data.description,
    //   "type_document": Number(data.type_document)
    // }
    // const data_convert_json = JSON.stringify(dataJson)
    // const url = this.env.rootUrl + 'EditFileAcademy'
    // return this.http.put(url, data_convert_json, { headers: headers })
  }

  getVideosOfCourse(id) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': localStorage.getItem('token')

    });
    const dataJson =
    {
      "id": id,
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'GetCurses'
    return this.http.post(url, data_convert_json, { headers: headers })
  }


  saveVideo(data) {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('video', data.video);
    formData.append('description', data.description);
    formData.append('id', data.id);
    formData.append('img', data.img);

    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    const url = this.env.rootUrl + 'SaveChapter';
    return this.http.post(url, formData, { headers: headers });
  }

  deleteFile(id) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "id": id
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `DeleteAcademy`
    return this.http.delete(url, {
      headers: headers,
      body: data_convert_json
    },)
  }

  deleteVideo(id) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "id": id
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `DeleteCourseVideo`
    return this.http.delete(url, {
      headers: headers,
      body: data_convert_json
    },)
  }

  deleteCourse(id) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': localStorage.getItem('token')
    });
    const dataJson =
    {
      "id": id
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + `DeleteAcademy`
    return this.http.delete(url, {
      headers: headers,
      body: data_convert_json
    },)
  }

  getFileById(id) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': localStorage.getItem('token')

    });
    const dataJson =
    {
      "id": Number(id),
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'GetOnlyOneFile'
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  getVideoById(id) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': localStorage.getItem('token')

    });
    const dataJson =
    {
      "id": Number(id),
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'GetOnlyOneVideo'
    return this.http.post(url, data_convert_json, { headers: headers })
  }

  editVideo(data) {

    let data_img;
    let resource;
    if (data.img != null && data.img.toString().includes("s3.amazonaws.com")) {
      data_img = null;
    } else {
      data_img = data.img;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('video', data.video);
    formData.append('description', data.description);
    formData.append('id', data.id);
    formData.append('img', data.img);

    const headers = new HttpHeaders({
      'Authorization': localStorage.getItem('token')
    });

    const url = this.env.rootUrl + 'EditCourseVideo';
    return this.http.post(url, formData, { headers: headers });


    // var headers: HttpHeaders = new HttpHeaders({
    //   "Content-Type": "application/json; charset=utf-8",
    //   'Authorization': localStorage.getItem('token')

    // });
    // const dataJson =
    // {
    //   "id": data.id,
    //   "img": data_img,
    //   "title": data.title,
    //   "description": data.description,
    //   "url": data.url
    // }
    // const data_convert_json = JSON.stringify(dataJson)
    // const url = this.env.rootUrl + 'EditCourseVideo'
    // return this.http.put(url, data_convert_json, { headers: headers })
  }

  getResources(data) {
    var headers: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json; charset=utf-8",
      'Authorization': localStorage.getItem('token')

    });
    const dataJson =
    {
      "language": data.language,
      "type_document": data.type_resource
    }
    const data_convert_json = JSON.stringify(dataJson)
    const url = this.env.rootUrl + 'GetFilesAcademy'
    return this.http.post(url, data_convert_json, { headers: headers })
  }
}
