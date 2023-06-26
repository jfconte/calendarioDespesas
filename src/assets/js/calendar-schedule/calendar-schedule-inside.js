  var html = "";
  // CAHNGE the below variable to the CURRENT YEAR
  var year = new Date().getUTCFullYear();

  $( document ).ready(function() {
    $('#year-span').text(year);
  });


  
  // first day of the week of the new year
  var today = new Date("January 1, " + year);
  var start_day = today.getDay() + 1;

  fill_table("January", "01",year,1);
  fill_table("February", "02",year,2);
  fill_table("March", "03",year,3);
  fill_table("April", "04",year,4);
  fill_table("May", "05",year,5);
  fill_table("June", "06",year,6);
  fill_table("July", "07",year,7);
  fill_table("August", "08",year,8);
  fill_table("September", "09",year,9);
  fill_table("October", "10",year,10);
  fill_table("November", "11",year,11);
  fill_table("December", "12",year,12);



  function setHtmlVarible(value){
    html = value;
  }

  function resetVaribleFirstDayOfTheWeekOfFirstDayOfYear(year_){
    var date_ = new Date("January 1, " + year_);
    start_day = date_.getDay() + 1;
   
  }

  // fill the month table with column headings
  function day_title(day_name) {
    html= html + "<div class='c-cal__col'>" + day_name + "</div>";
  }
  // fills the month table with numbers

  function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

  function fill_table(month,indexMonth,year_,month_) {
    year = year_;
    day = 1;
    month_length = daysInMonth(month_,year_)
    // begin the new month table
    html= html + "<div class='c-main c-main-" + indexMonth + "'>";
    //document.write("<b>"+month+" "+year+"</b>")

    // column headings
    html= html + "<div class='c-cal__row'>";
    day_title("Dom");
    day_title("Seg");
    day_title("Ter");
    day_title("Qua");
    day_title("Qui");
    day_title("Sex");
    day_title("Sáb");
    html= html + "</div>";

    // pad cells before first day of month
    html= html + "<div class='c-cal__row'>";
    for (var i = 1; i < start_day; i++) {
      if (start_day > 7) {
      } else {
        html= html + "<div class='c-cal__cel'></div>";
      }
    }

    // fill the first week of days
    for (var i = start_day; i < 8; i++) {
      html= html + 
        "<div data-day='" + year + "-" +
          indexMonth +
          "-0" +
          day +
          "'class='c-cal__cel'><p>" +
          day +
          "</p></div>";
      day++;
    }
    html= html + "</div>";

    // fill the remaining weeks
    while (day <= month_length) {
      html= html + "<div class='c-cal__row'>";
      for (var i = 1; i <= 7 && day <= month_length; i++) {
        if (day >= 1 && day <= 9) {
          html= html + 
            "<div data-day='" + year + "-" +
              indexMonth +
              "-0" +
              day +
              "'class='c-cal__cel'><p>" +
              day +
              "</p></div>";
          day++;
        } else {
          html= html + 
            "<div data-day='" + year + "-" +
              indexMonth +
              "-" +
              day +
              "' class='c-cal__cel'><p>" +
              day +
              "</p></div>";
          day++;
        }
      }
      html= html + "</div>";
      // the first day of the week of the next month
      start_day = i;
    }

    html= html + "</div>";
    document.getElementById('calendar-div').innerHTML= html;

  }







     