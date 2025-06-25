/**
 * DropDownTree Default Sample
 */
import { DateTimePicker } from '../src/datetimepicker/index';

 let calendar: DateTimePicker;
 let today: Date = new Date();
 let currentYear: number = today.getFullYear();
 let currentMonth: number = today.getMonth();

 document.getElementById('render').addEventListener('click', renderTextBox);
 document.getElementById('destroy').addEventListener('click', destoryTextBox);
 
 
 function renderTextBox(): void {
    calendar = new DateTimePicker({
        placeholder: "Select a date and time",
        min: new Date(currentYear, currentMonth, 7, 10, 0, 0),
        max: new Date(currentYear, currentMonth, 27, 22, 30, 0),
        format: "M/d/yyyy hh:mm a",
        enableMask: true
    });
    calendar.appendTo('#calendar');
   
 }

function destoryTextBox(): void {
    if (calendar) {
        calendar.destroy();
        calendar = null;
    }
  
}
