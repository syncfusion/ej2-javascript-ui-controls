import { Calendar, ChangedEventArgs } from '../../src/calendar/calendar';
/**
 * Start view calendar sample
 */

/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
    start: 'Year',
    change: changeValue
});
calendar.appendTo('#calendar');

function changeValue(args: ChangedEventArgs): void {
    /*Displays selected date in the input textbox*/
    (<HTMLInputElement>document.getElementById('value')).value = args.value.toLocaleDateString();
}
