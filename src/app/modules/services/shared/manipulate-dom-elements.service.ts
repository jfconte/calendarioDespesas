import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

import * as $ from 'jquery';
@Injectable({
  providedIn: 'root'
})
export class ManipulateDomElementsService {

  constructor() { }


  
  loadScript(url:string, element:HTMLElement) {
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src =url;
    script.type="text/javascript";
    script.async = false;
    script.defer = true;
    element.appendChild(script);
  }

  public getValueInputDOM(idElement:string){
    
    const title = document.getElementById(idElement) as HTMLInputElement;
    return title.value;
  }

  public getTextSeletedItemDOM(idElement:string){
    var text = $("select[id=" + idElement + "]")
                .find(":selected")
                .text();
    return text;
  }

  public isElementChecked(id:string){
    return $('#' + id).is(":checked");
  }

  public setElementOptions(idElement:string, valueSelected:string)
  {
    $("select[id=" + idElement + "]").val(valueSelected);
  }

  public getValueSeletedItemDOM(idElement:string){
    var value = $("select[id=" + idElement + "]")
                .find(":selected")
                .val();
    return value;
  }

  public setValueInputDOM(idElement:string, value:string){
    const title = document.getElementById(idElement) as HTMLInputElement;
    title.value = value;
  }

  public insertHtmlElementDOM(idElement:string, content:string){
    const title = document.getElementById(idElement) as HTMLInputElement;
    title.innerHTML = content;
  }

  public createUUIDCode(){
    return uuidv4();
  }

  public uploadArquive(event:any, nameFile:string):FormData | null{
    if(event.target.files && event.target.files[0]){
      const archive = event.target.files[0];
      const formData = new FormData();
      formData.append(nameFile,archive);
      return archive;
    }
    return null;
  }


  


}
