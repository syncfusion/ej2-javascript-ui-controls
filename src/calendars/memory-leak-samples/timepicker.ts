/**
 * DropDownTree Default Sample
 */
import { TimePicker } from '../src/timepicker/index';

 let calendar: TimePicker;


 document.getElementById('render').addEventListener('click', renderTextBox);
 document.getElementById('destroy').addEventListener('click', destoryTextBox);
 
 
 function renderTextBox(): void {
    calendar = new TimePicker({
        placeholder: "Select a time",
        cssClass: 'e-custom-style',
        open: onOpen,
    });
    calendar.appendTo('#calendar');
   
 }
 function onOpen(args: any): void {
    // scrollTo value will be assigned only if the timepicker value is not null or undefined and is a valid value.
    if (calendar.value && !isNaN(+calendar.value)) {
        //assign the current value as the scrollTo value
        calendar.scrollTo = calendar.value;
    }
}
function destoryTextBox(): void {
    if (calendar) {
        calendar.destroy();
        calendar = null;
    }
  
}
