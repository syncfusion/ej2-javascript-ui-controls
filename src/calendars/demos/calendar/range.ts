import { Calendar, ChangedEventArgs, RenderDayCellEventArgs } from '../../src/calendar/calendar';

/**
 *Range sample
 */

let today = new Date('5/6/2017');
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let curentDay = today.getDate();
/*Initialize the calender component*/
let leftcalendar: Calendar = new Calendar({
    min: new Date(currentYear, currentMonth, curentDay - 7),
    max: new Date(currentYear, currentMonth + 3, curentDay),
    change: startDate,
    renderDayCell:function(args: RenderDayCellEventArgs){
        if(args.date.toDateString() == "Tue Aug 01 2017") args.element.classList.add('e-start');
    }
});
leftcalendar.appendTo('#startday');
/*Initialize the calender component*/
let rightcalendar: Calendar = new Calendar({
    max: new Date(currentYear, currentMonth + 3, curentDay),
    change: endDate,
    renderDayCell:function(args: RenderDayCellEventArgs){
      if(args.date.toDateString() == "Fri Aug 04 2017")  args.element.classList.add('e-start');
    }
});
rightcalendar.appendTo('#endday');

function startDate(args: ChangedEventArgs): void {
    rightcalendar.min = args.value;
    (<HTMLInputElement>document.getElementById('startDay')).value = args.value.toLocaleDateString();
}

function endDate(args: ChangedEventArgs): void {
    leftcalendar.max = args.value;
    (<HTMLInputElement>document.getElementById('endDay')).value = args.value.toLocaleDateString();
}