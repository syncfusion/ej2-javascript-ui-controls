/**
 * DropDownTree Default Sample
 */
import { DateRangePicker } from '../src/daterangepicker/index';

 let calendar: DateRangePicker;
 let start: Date = new Date(new Date(new Date().setDate(new Date().getDate() - (new Date().getDay() + 7) % 7)).toDateString());

 document.getElementById('render').addEventListener('click', renderTextBox);
 document.getElementById('destroy').addEventListener('click', destoryTextBox);
 
 
 function renderTextBox(): void {
    calendar = new DateRangePicker({
        placeholder: "Select a range",
        format: 'dd\'\/\'MMM\'\/\'yy hh:mm a',
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(new Date().setDate(20))
    });
    calendar.appendTo('#calendar');
   
 }

function destoryTextBox(): void {
    if (calendar) {
        calendar.destroy();
        calendar = null;
    }
  
}
