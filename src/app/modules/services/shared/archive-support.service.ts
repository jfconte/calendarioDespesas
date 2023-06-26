import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchiveSupportService {

  constructor(private datePipe: DatePipe) { }

  public convertToBase64(file:File):Observable<any>{

    return new Observable((subscriber: Subscriber<any>)=> {
      this.readFile(file,subscriber);
    });
  }

  public readFile(file:File, subscriber:Subscriber<any>){
    const filereader = new FileReader();
    filereader.readAsDataURL(file);

    filereader.onload = () => {
      subscriber.next(filereader.result);
      subscriber.complete();
    };

    filereader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }

  padWithZero(num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }


  castStringToDate(stringDate:string):Date{


    var year = Number(stringDate.slice(0,4));
    var month= Number(stringDate.slice(5,7));
    var day = Number(stringDate.slice(8));
    
    return new Date(year,month-1,day,0,0);
  }

  castDateToString(date_:Date):string{

    var year = date_.getFullYear();
    var month= this.padWithZero(date_.getMonth()+1,2);
    var day = this.padWithZero(date_.getDate(),2);
    return year +'-'+month+'-'+day;
  }

}
