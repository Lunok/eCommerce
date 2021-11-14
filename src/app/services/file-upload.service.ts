import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Response } from '../models/response';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
 /* private baseUrlUpload = `${environment.api + 'uploadImage.php?API_KEY=' + environment.api_key}`;
  private baseUrlDelete = `${environment.api + 'deleteImage.php?API_KEY=' + environment.api_key}`;
  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<any> {
    let formData: any = new FormData();
    formData.append("image", file);

    return this.http.post(this.baseUrlUpload, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  deleteImage(name: string): Observable<any> {
    const url = this.baseUrlDelete+"&name="+name;

    return this.http.delete(url);
  }*/

  private baseUrl = `${environment.api+'image'+'?API_KEY='+environment.api_key}`;
  private baseUrlUpload = `${environment.api + 'uploadImage.php?API_KEY=' + environment.api_key}`;
  private baseUrlDeleteImage = `${environment.api+'deleteImage'+'?API_KEY='+environment.api_key}`;

  constructor(private http: HttpClient) { }

  uploadImage(file: File):Observable<any>{
    let formData: any = new FormData();
    formData.append("image", file);

    return this.http.post(this.baseUrlUpload, formData,{
      reportProgress: true,
      observe: 'events'
    })
  }

  deleteImage(name: string): Observable<Response> {
    const urlDeletion = this.baseUrlDeleteImage+"&name="+name;
    return this.http.delete<Response>(urlDeletion);
  }
}
