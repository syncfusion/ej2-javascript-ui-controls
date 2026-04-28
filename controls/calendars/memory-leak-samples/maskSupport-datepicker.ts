/**
 * DropDownTree Default Sample
 */
import { DatePicker } from '../src/datepicker/index';
import { RenderDayCellEventArgs } from '../src/calendar/index';
let calendar: DatePicker;

 document.getElementById('render').addEventListener('click', renderDatePicker);
 document.getElementById('destroy').addEventListener('click', destoryDatePicker);
 
 let today: Date = new Date();
 let currentYear: number = today.getFullYear();
 let currentMonth: number = today.getMonth();
 function renderDatePicker(): void {
    calendar = new DatePicker({
        placeholder: "Choose a date",
        format: "M/d/yyyy",
        enableMask: true,
        min: new Date(currentYear, currentMonth, 7),
        max: new Date(currentYear, currentMonth, 27),
    });
    calendar.appendTo('#calendar');
   
 }

function destoryDatePicker(): void {
    if (calendar) {
        calendar.destroy();
        calendar = null;
    }
  
}
