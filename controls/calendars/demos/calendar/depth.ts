import { Calendar, ChangedEventArgs } from '../../src/calendar/calendar';
/**
 * Depth sample
 */

/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
    start: "Decade",
    depth: "Year",
    change: changeValue
});
calendar.appendTo('#calendar');

function changeValue(args: ChangedEventArgs): void {
    /*Displays selected date in the input textbox*/
    (<HTMLInputElement>document.getElementById('value')).value = args.value.toLocaleDateString();
}
