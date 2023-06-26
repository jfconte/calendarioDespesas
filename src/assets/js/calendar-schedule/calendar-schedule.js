//global variables
var monthEl = $(".c-main");
var dataCel = $(".c-cal__cel");
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1;
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();
var monthText = [
  " Janeiro",
  " Fevereiro",
  " Março",
  " Abril",
  " Maio",
  " Junho",
  " Julho",
  " Agosto",
  " Setembro",
  " Outubro",
  " Novembro",
  " Dezembro"
];

function returnMonthsText(){
  return monthText
}

var indexMonth = month;
var todayBtn = $(".c-today__btn");
var addBtn = $(".js-event__add");
var showDetailsBillBtn = $(".c-aside__event-icon");

//var saveBtn = $(".js-event__save");
var closeBtn = $(".js-event__close");
var winCreator = $(".js-event__creator");
var inputDate = $(this).data();
today = year + "-" + month + "-" + day;

function inicializeDataCelVarible(){
  dataCel = $(".c-cal__cel");
}

// ------ functions control -------

//button of the current day
todayBtn.on("click", function() {
  if (month < indexMonth) {
    var step = indexMonth % month;
    movePrev(step, true);
  } else if (month > indexMonth) {
    var step = month - indexMonth;
    moveNext(step, true,true);
  }
});


//open popup and show detailsBill
inicializeBtnShowDetailsBill();
function inicializeBtnShowDetailsBill(){
  showDetailsBillBtn = $(".c-aside__event-icon");
  showDetailsBillBtn.on("click", function() {
    winCreator = $(".js-event__creator");
    winCreator.addClass("isVisible");
    $("body").addClass("overlay");
    billDetailed = returnBillById($(this).attr('id'));
    $("#expenseName").val(billDetailed.expenseName);
    $("#dateBill").val(returnDateDdMmYyyy(billDetailed.dateBill));
    $("#comments").val(billDetailed.comments);
    $("#idBill").val(billDetailed.id);
    if(billDetailed.isPaid)
      $('#paid').prop('checked', true);
    else
      $('#paid').prop('checked', false);


    $("select[id=categories]").val(billDetailed.category.id);
    $(".js-event__save").text("Alterar Despesa");
    managerExhibitionPaidCheckBox(true);

    //hide button download
    $('#download-pdf').show();

    managerExhibitionProofPaymentFileUpload();

    managerExhibitionDownloadBillIcon(billDetailed);
    managerExhibitionDownloadProofPaymentIcon(billDetailed);
  });
}





function setLocalStorageArchiveSelected(archiveBase64){
  localStorage.setItem('archiveSelected', archiveBase64);
}
function returnDateDdMmYyyy(date){
  var month =  date.getMonth()+1
  month = String(month);
  month = month.padStart(2,'0');
  var day = String( date.getDate());
  day = day.padStart(2,'0');

  return date.getFullYear() + "-" + month + "-" + day;
}

function returnBillById(id){
  if(localStorage.getItem('billsLocalStorage')=="" || localStorage.getItem('billsLocalStorage')==null )
    return;

  var billsLocalStorage = JSON.parse(localStorage.getItem('billsLocalStorage'));
  var billSelected = billsLocalStorage.find(function(bill){return bill.id==id});
  billSelected.dateBill = new Date(billSelected.dateBill);
  //console.log(billSelected.dateBill);
  //billSelected.dateBill.setDate(billSelected.dateBill.getDate() -1);
  return billSelected;
}

function managerExhibitionPaidCheckBox(show){
  if(show)
    $('.div-checkbox-form').show();
  else
    $('.div-checkbox-form').hide();

}

function resetFields(){
  $(".js-event__save").text("Cadastrar Nova Despesa");
  managerExhibitionPaidCheckBox(false);
  $("#expenseName").val('');
  $("#dateBill").val('');
  $("#comments").val('');
  $("select[id=categories]").val(0);
  $("#idBill").val(0);
}

//window event creator
addBtn.on("click", function() {
  resetFields();
  winCreator.addClass("isVisible");
  $("body").addClass("overlay");
  dataCel.each(function() {
    if ($(this).hasClass("isSelected")) {
      today = $(this).data("day");
      document.querySelector('input[type="date"]').value = today;
    } else {
      document.querySelector('input[type="date"]').value = today;
    }
  });

  //hide button download
  $('#download-pdf').hide();

  managerExhibitionDownloadBillIcon();
  managerExhibitionProofPaymentFileUpload();
  //reset the popup hight
  $('.c-event__creator').css('max-height',590);
});
closeBtn.on("click", function() {
  winCreator.removeClass("isVisible");
  $("body").removeClass("overlay");
});

//fill sidebar event info
function fillEventSidebar(bill) {
  switch (bill.status) {
    case "delayed":
      $(".c-aside__eventList").append(
        "<div class='aside-event-list-item'>" +
          "<p class='c-aside__event c-aside__event--delayed'>" +
          bill.expenseName + "</p>" +
          "<span href='javascript:;' class='fa fa-search c-aside__event-icon' id='" + bill.id + "'></span>" +
        "</div>"
      );
      break;
    case "pending":
      
        $(".c-aside__eventList").append(
          "<div class='aside-event-list-item'>" +
              "<p class='c-aside__event c-aside__event--pending'>" +
              bill.expenseName + "</p>" +
              "<span href='javascript:;' class='fa fa-search c-aside__event-icon' id='" + bill.id + "'></span>" +
          "</div>"
      );
      break;
    case "payout":
      
        $(".c-aside__eventList").append(
          "<div class='aside-event-list-item'>" +
              "<p class='c-aside__event c-aside__event--payout'>" +
              bill.expenseName + "</p>" +
              "<span href='javascript:;' class='fa fa-search c-aside__event-icon' id='" + bill.id + "'></span>" +
          "</div>"
      );
      break;
     default:
      
        $(".c-aside__eventList").append(
          "<div class='aside-event-list-item'>" +
            "<p class='c-aside__event'>" +
                bill.expenseName + "</p>" +
            "<span href='javascript:;' class='fa fa-search c-aside__event-icon' id='" + bill.id + "'></span>" +
          "</div>"
      );
      break;
   }
};





inicializeClickCellCalendar();
function inicializeClickCellCalendar(){
  dataCel.on("click", function() {
    var thisEl = $(this);
    var thisDay = $(this).attr("data-day");
    var month_ = parseInt($(this).attr("data-day").slice(5, 7));
    $(".c-aside__num").text(thisDay.slice(8));
    $(".c-aside__month").text(returnMonthsText()[month_ - 1]);
    $(".c-cal__cel").removeClass("isSelected");
    thisEl.addClass("isSelected");

    if(localStorage.getItem('billsLocalStorage')=="" || localStorage.getItem('billsLocalStorage')==null )
      return;

    var billsLocalStorage = JSON.parse(localStorage.getItem('billsLocalStorage'));
    
    var billsThisDate = billsLocalStorage.filter(function(bill){
                      var monthPosition = Number(thisDay.slice(5,7))-1;
                      var dateSelected = new Date(thisDay.slice(0,4),monthPosition,thisDay.slice(8,10));
                      var dateBill = new Date(bill.dateBill);
                                            
                      var Difference_In_Time = dateSelected.getTime() - dateBill.getTime();
                      var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

                      return Difference_In_Days >-1 && Difference_In_Days <=0;
                    });          
    $(".aside-event-list-item").remove();
    billsThisDate.forEach(function(bill) {
      fillEventSidebar(bill);
    });
    inicializeBtnShowDetailsBill();
  });
}

//function for move the months
function moveNext(fakeClick, indexNext, moveMonthHeader) {
  for (var i = 0; i < fakeClick; i++) {
    $(".c-main").css({
      left: "-=100%"
    });
    if(moveMonthHeader){
        $(".c-paginator__month").css({
          left: "-=100%"
        });
    }

    switch (true) {
      case indexNext:
        indexMonth += 1;
        break;
    }
  }
}
function movePrev(fakeClick, indexPrev) {
  for (var i = 0; i < fakeClick; i++) {
    $(".c-main").css({
      left: "+=100%"
    });
    $(".c-paginator__month").css({
      left: "+=100%"
    });
    switch (true) {
      case indexPrev:
        indexMonth -= 1;
        break;
    }
  }
}

//months paginator
function buttonsPaginator(buttonId, mainClass, monthClass, next, prev) {
  switch (true) {
    case next:
      $(buttonId).on("click", function() {
        
        if (indexMonth >= 2) {
          $(mainClass).css({
            left: "+=100%"
          });
          $(monthClass).css({
            left: "+=100%"
          });
          indexMonth -= 1;
        }
        return indexMonth;
      });
      break;
    case prev:
      
      $(buttonId).on("click", function() {
        if (indexMonth <= 11) {
          $(mainClass).css({
            left: "-=100%"
          });
          $(monthClass).css({
            left: "-=100%"
          });
          indexMonth += 1;
        }
        return indexMonth;
      });
      break;
  }
}

$('#next_year').on("click", function() {$('#year-span').text(year);});
$('#prev_year').on("click", function() {$('#year-span').text(year);});

buttonsPaginator("#next", ".c-main", ".c-paginator__month", false, true);
buttonsPaginator("#prev", ".c-main", ".c-paginator__month", true, false);

//launch function to set the current month
moveNext(indexMonth - 1, false,true);

function getCurrentMonth(){
  return indexMonth;
}


//fill the sidebar with current day
$(".c-aside__num").text(day);
$(".c-aside__month").text(monthText[month - 1]);

//change text label after file selection
$('#fileUpload').on("change", function() {
  $('#file-input-text').text(this.files[0].name);
});



function downloadAsPDF(base64String) {
  const downloadLink = document.createElement("a");
  downloadLink.href = base64String;
  downloadLink.download = "convertedPDFFile.pdf";
  downloadLink.click();
}

$('#paid').on("click", function() {
  managerExhibitionProofPaymentFileUpload();
});

function managerExhibitionProofPaymentFileUpload(){
  var isChecked=$('#paid').prop('checked');
  if(isChecked){
    $('#proof-payment-file-upload-download').show();
    //increase popup hight
    $('.c-event__creator').css('max-height',740);
  }
  else{
    $('#proof-payment-file-upload-download').hide();
    //reduce popup hight
    $('.c-event__creator').css('max-height',640);

  }
}

function managerExhibitionDownloadBillIcon(bill){
    if(bill==undefined || bill.idArchive==undefined){
      $('#download-bill-pdf').hide();
    }else{
      $('#download-bill-pdf').show();
    }
}

function managerExhibitionDownloadProofPaymentIcon(bill){
  if(bill==undefined || bill.idProofPaymentArchive==undefined){
    $('#download-proof-payment-pdf').hide();
  }else{
    $('#download-proof-payment-pdf').show();
  }
}