import { DatePipe } from '@angular/common';
import {  AfterViewInit, Component, OnInit } from '@angular/core';

import { Bill } from 'src/app/modules/models/bill';
import { CategoryBill } from 'src/app/modules/models/categories-bill';
import { ManipulateDomElementsService } from 'src/app/modules/services/shared/manipulate-dom-elements.service';
import * as $ from 'jquery';
import { ArchiveCalendarService } from 'src/app/modules/services/calendar/archive-calendar.service';
import { ArchiveSupportService } from 'src/app/modules/services/shared/archive-support.service';
import { Archive } from 'src/app/modules/models/archive';
import { CalendarService } from 'src/app/modules/services/calendar/calendar.service';

//javascript functions
declare function fill_table(month:string, indexMonth:string,year_:number,month_:number):any;
declare function setHtmlVarible(value:string):any;
declare function moveNext(fakeClick:number, indexNext:boolean,moveMonthHeader:boolean):any;
declare function resetVaribleFirstDayOfTheWeekOfFirstDayOfYear(year_:number):any;
declare function getCurrentMonth():any;
declare function inicializeDataCelVarible():any;
declare function inicializeClickCellCalendar():any;
declare function fillEventSidebar(bill:any):any;
declare function returnMonthsText():any;
declare function inicializeBtnShowDetailsBill():any;
declare function downloadAsPDF(base64String:string):any;

@Component({
  selector: 'app-calendario-pagamentos',
  templateUrl: './calendario-pagamentos.component.html',
  styleUrls: ['./calendario-pagamentos.component.css']
})
export class CalendarioPagamentosComponent implements OnInit, AfterViewInit  {
  bills:Bill[]=[];
  categories:CategoryBill[]=[];
  year_:number = new Date().getFullYear();
  fileName = '';
  archiveChose?:Archive;


  constructor(public manipulateDomElementsService: ManipulateDomElementsService, private archiveCalendarService:ArchiveCalendarService,
                private calendarService: CalendarService, private archiveSupportService:ArchiveSupportService) {}

  ngOnInit(): void {
    this.mocks();
    this.populateCategoriesList(this.categories);

    this.styleManipulateCalendarElements();
    this.resetLocalStorageBills();
  }

  ngAfterViewInit() {
    this.populateBills();
  }

  populateBills(){
    this.calendarService.getAll().subscribe(response => {

      
      this.bills = response as Bill[];

      this.bills.forEach(x => x.dateBill! = new Date(x.dateBill!));
          
      this.setLocalStorageBills();
      this.populatesBillsOnCalendar();

    })
  }

  mocks(){
    this.categories =[{id:1,name:"Internet" },{id:2,name:"Aluguel" },{id:3,name:"Prestação Carro"}];
  }

  styleManipulateCalendarElements(){
    //style and manipulate calendar elements
    this.manipulateDomElementsService.loadScript('../assets/js/calendar-schedule/calendar-schedule-inside.js',document.body);
    this.manipulateDomElementsService.loadScript('../assets/js/calendar-schedule/calendar-schedule.js',document.body);
  }

  populateCategoriesList(categories:CategoryBill[]){
    var html='<option value="0">Selecione uma categoria...</option>';
    categories.forEach(x => html+='<option value="' + x.id + '">' + x.name + '</option>');

    this.manipulateDomElementsService.insertHtmlElementDOM("categories", html);
  }

  ManagerBill(){
   var valueIdBill = this.manipulateDomElementsService.getValueInputDOM("idBill");
   if(valueIdBill=="0"){
    this.AddBill();
   }else{
    this.UpDateBill(valueIdBill);
   }

   this.resetUploadControl();
  }

  resetUploadControl(){
    $("#fileUpload").val('');
    $("#file-input-text").text('Selecione um documento para a despesa');
  }

  

  AddBill(){
    var bill = new Bill();
    bill.expenseName = this.manipulateDomElementsService.getValueInputDOM("expenseName");
    bill.dateBill =  this.archiveSupportService.castStringToDate(this.manipulateDomElementsService.getValueInputDOM("dateBill"));
    bill.comments = this.manipulateDomElementsService.getValueInputDOM("comments");
    bill.category = this.categories?.find(x=> x.id==this.manipulateDomElementsService.getValueSeletedItemDOM("categories"));
    bill.isPaid = false;
    bill.id = this.manipulateDomElementsService.createUUIDCode();
    bill.idArchive = this.archiveChose?.id;
    this.bills.push(bill);
    this.addBillOnCalendar(bill,true);
    
    this.calendarService.post(bill).subscribe(response => alert('Despesa incluída com sucesso!'));

    inicializeBtnShowDetailsBill();
  }

  UpDateBill(id:string){
    var billSelected = this.bills.find(x => x.id==id);
    billSelected!.expenseName = this.manipulateDomElementsService.getValueInputDOM("expenseName");
    //remove status bill on day selected
    this.showStatusBillOnDay(billSelected!,false);
    billSelected!.dateBill =  this.archiveSupportService.castStringToDate(this.manipulateDomElementsService.getValueInputDOM("dateBill"));
   
    billSelected!.comments = this.manipulateDomElementsService.getValueInputDOM("comments");
    billSelected!.category = this.categories?.find(x=> x.id==this.manipulateDomElementsService.getValueSeletedItemDOM("categories"));
    if(this.manipulateDomElementsService.isElementChecked("paid"))
      billSelected!.isPaid = true;
    else{
      billSelected!.isPaid = false;
      billSelected!.idProofPaymentArchive = undefined;
    }
      


    this.addBillOnCalendar(billSelected!,true);

    this.calendarService.put(billSelected!.id??'', billSelected!).subscribe(response => alert('Despesa alterada com sucesso!'));

    inicializeBtnShowDetailsBill();
  }


  addBillOnCalendar(bill:Bill,showStatusDay:boolean){

    this.populateDayOnCalendar(bill,showStatusDay)

    //clean the selection
    var winCreator = $(".js-event__creator");
    winCreator.removeClass("isVisible");
    
    //styles the day selected
    $("body").removeClass("overlay");
    var dateBillFormated = this.archiveSupportService.castDateToString(bill.dateBill!);
    $(".c-cal__cel").removeClass("isSelected");
    $('*[data-day='+ dateBillFormated+']').addClass("isSelected");


    this.setLocalStorageBills();
    this.populateSideBarDetailsBills(bill.dateBill!);
    this.populateSideBarDaySelected(bill.dateBill!);

  }

 
  populateDayOnCalendar(bill:Bill,showStatusDay:boolean){
    //status bill
    bill.status ="pending";
    var currentNextDate = new Date();
    var currentNextDateStr = this.archiveSupportService.castDateToString(currentNextDate);
    currentNextDate = this.archiveSupportService.castStringToDate(currentNextDateStr);

    var billDate =  bill.dateBill!;
    var billDateStr = this.archiveSupportService.castDateToString(billDate);
    billDate = this.archiveSupportService.castStringToDate(billDateStr);

    var Difference_In_Time = billDate.getTime() - currentNextDate.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);



    if(bill.isPaid)
      bill.status = "payout";
    else if(Difference_In_Days<0)
    bill.status = "delayed";

    //populate day in calendar
    this.showStatusBillOnDay(bill,showStatusDay)
  }

  showStatusBillOnDay(bill:Bill,showStatus:boolean){

    var date = $('*[data-day='+ this.archiveSupportService.castDateToString(bill.dateBill!) +']');

    if(showStatus){
      date.addClass("event");
      date.addClass("event--" + bill.status);
    }else{
      date.removeClass("event");
      date.removeClass("event--" + bill.status);
    }
  }

  goToNextYear(){
    this.year_++;
    this.changeYear();

  }

  goToPrevYear(){
    this.year_--;
    this.changeYear();
  }


  changeYear(){
    
    setHtmlVarible('');
    resetVaribleFirstDayOfTheWeekOfFirstDayOfYear(this.year_);

    //create calendar
    fill_table("January", "01",this.year_,1);
    fill_table("February", "02",this.year_,2);
    fill_table("March", "03",this.year_,3);
    fill_table("April", "04",this.year_,4);
    fill_table("May", "05",this.year_,5);
    fill_table("June", "06",this.year_,6);
    fill_table("July", "07",this.year_,7);
    fill_table("August", "08",this.year_,8);
    fill_table("September", "09",this.year_,9);
    fill_table("October", "10",this.year_,10);
    fill_table("November", "11",this.year_,11);
    fill_table("December", "12",this.year_,12);

    //move to currenty month but other year
    var positonMonthOnArray = getCurrentMonth()-1;
    moveNext( positonMonthOnArray, false,false);

    
    this.populatesBillsOnCalendar();

    inicializeDataCelVarible();
    inicializeClickCellCalendar();
    this.setLocalStorageBills();

  }

  populatesBillsOnCalendar(){
    //filter just the bills' year
    this.bills.filter(x=> x.dateBill!.getFullYear()==this.year_).forEach(x => this.populateDayOnCalendar(x,true));
  }

  setLocalStorageBills(){
    localStorage.setItem('billsLocalStorage', JSON.stringify(this.bills));
  }

  resetLocalStorageBills(){
    localStorage.setItem('billsLocalStorage', "");
  }

  getLocalStorageBills(){
    return JSON.parse(localStorage.getItem('billsLocalStorage')!);
  }

  populateSideBarDetailsBills(billDateSelected:Date){
    $(".aside-event-list-item").remove();
    var billsDaySelected = this.bills.filter( function (bill:Bill){
      var dateSelected = billDateSelected;
      var dateBill = bill.dateBill;
      var Difference_In_Time = dateSelected.getTime() - dateBill!.getTime();
      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
      return Difference_In_Days >-1 && Difference_In_Days <1;
    });
    billsDaySelected.forEach(x => fillEventSidebar(x));
  }

  populateSideBarDaySelected(billDateSelected:Date){
    $(".c-aside__num").text(String(billDateSelected.getDate()).padStart(2,"0"));
    var indexMonth = billDateSelected!.getMonth();
    $(".c-aside__month").text(returnMonthsText()[indexMonth]);
  }

  async onFileSelected(event:any,archiveType:string){
    $('.js-event__save').hide();
    const archive = event.target.files[0];


    this.archiveSupportService.convertToBase64(archive).subscribe(response =>{
      this.sendFileBase64ToApi(response,archive.name,archiveType);
    });
  }


  sendFileBase64ToApi(archiveBase64:string,nameFile:string, archiveType:string){
    var archive_ = new Archive;
    
    archive_.base64 = archiveBase64;
    archive_.name = nameFile;

    $('.js-event__save').show();
    
    //if archive exists, alter archive, else post the new archive
    var valueIdBill = this.manipulateDomElementsService.getValueInputDOM("idBill");
    var billSelected = this.bills.find(x => x.id==valueIdBill);

    if(archiveType=='bill'){
      if (billSelected==undefined){
        archive_.id = this.manipulateDomElementsService.createUUIDCode();
        this.archiveCalendarService.post(archive_).subscribe(response => alert('arquivo carregado com sucesso!'));
        this.managerExhibitionBillIconDownLoad(true);
      }
      else if(billSelected?.idArchive==null || billSelected?.idArchive==undefined){
        archive_.id = this.manipulateDomElementsService.createUUIDCode();
        billSelected!.idArchive = archive_.id;
        this.archiveCalendarService.post(archive_).subscribe(response => alert('arquivo carregado com sucesso!'));
        this.managerExhibitionBillIconDownLoad(true);
      }else {
        this.archiveCalendarService.put(billSelected!.idArchive??'', archive_).subscribe(response => alert('arquivo alterado com sucesso!'));
      }
      this.archiveChose = archive_;
    } else if(archiveType=='proofPayment'){
     if(billSelected?.idProofPaymentArchive==null || billSelected?.idProofPaymentArchive==undefined){
       archive_.id = this.manipulateDomElementsService.createUUIDCode();
       billSelected!.idProofPaymentArchive = archive_.id;
       this.archiveCalendarService.post(archive_).subscribe(response => alert('arquivo carregado com sucesso!'));
       this.managerExhibitionProofPaymentIconDownLoad(true);
     }else {
       this.archiveCalendarService.put(billSelected!.idArchive??'', archive_).subscribe(response => alert('arquivo alterado com sucesso!'));
     }
    }
  }

  managerExhibitionProofPaymentIconDownLoad(show:boolean){
    if(show)
      $('#download-proof-payment-pdf').show();
    else
      $('#download-proof-payment-pdf').hide();
  }

  managerExhibitionBillIconDownLoad(show:boolean){
    if(show)
      $('#download-bill-pdf').show();
    else
      $('#download-bill-pdf').hide();
  }


  pdfDownload(archiveType:string){
    //if archive exists, alter archive, else post the new archive
    var valueIdBill = this.manipulateDomElementsService.getValueInputDOM("idBill");
    var billSelected = this.bills.find(x => x.id==valueIdBill);
    var idArchive;
    if(archiveType=='bill'){
      if(billSelected==undefined){
        idArchive = this.archiveChose?.id;
        console.log('idArchive ' + idArchive);
      }
      else
        idArchive = billSelected?.idArchive;
    }else if(archiveType=='proofPayment'){
      idArchive= billSelected?.idProofPaymentArchive;
    }

    if(idArchive==null || idArchive==undefined){
      alert('não há arquivo disponível');
    }else{
      this.archiveCalendarService.getById(idArchive).subscribe(response => {
        var archiveBase64 = response.base64;
        downloadAsPDF(archiveBase64);
      });
    }

  }


}
