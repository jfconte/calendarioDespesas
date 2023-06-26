import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bill } from '../../models/bill';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  baseURL:string = "http://localhost:3000/bills/";

  constructor(private http:HttpClient) { }

  post(bill:Bill):Observable<any> {
    return this.http.post(this.baseURL,bill);
  }

  getAll(): Observable<any> {
    return this.http.get(this.baseURL)
  }

  put(id: string,bill:Bill):Observable<any> {
    return this.http.put(this.baseURL + '/' + id,bill);
  }

  getById(id: string): Observable<any> {
    return this.http.get(this.baseURL + '/' + id);
  }
}
