import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Archive } from '../../models/archive';

@Injectable({
  providedIn: 'root'
})
export class ArchiveCalendarService {


  constructor(private http:HttpClient) { }
  baseURL:string = "http://localhost:3000/archive/";


  post(archive:Archive): Observable<any>{
    return this.http.post(this.baseURL,archive);
  }

  put(id: string,archive:Archive):Observable<any> {
    return this.http.put(this.baseURL + '/' + id,archive);
  }

  getAll(): Observable<any> {
    return this.http.get(this.baseURL)
  }
  
  getById(id: string): Observable<any> {
    return this.http.get(this.baseURL + '/' + id);
  }
}
