/**
 * DropDownTree Default Sample
 */
import { Calendar } from '../src/calendar/index';

 let calendar: Calendar;


 document.getElementById('render').addEventListener('click', renderTextBox);
 document.getElementById('destroy').addEventListener('click', destoryTextBox);
 
 
 function renderTextBox(): void {
    calendar = new Calendar({
        isMultiSelection: true,
        showTodayButton: true, 
        cssClass: 'custom-class',
        min: new Date('07/05/2024'),
        max: new Date('07/05/2025')
    });
    calendar.appendTo('#calendar');
   
 }

function destoryTextBox(): void {
    if (calendar) {
        calendar.destroy();
        calendar = null;
    }
  
}
