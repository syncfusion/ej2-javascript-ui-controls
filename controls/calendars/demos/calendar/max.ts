import { Calendar, ChangedEventArgs } from '../../src/calendar/calendar';
/**
 * Max Date calendar sample
 */

/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
    max: new Date(),
    change: changeValue
});
calendar.appendTo('#calendar');

function changeValue(args: ChangedEventArgs): void {
    /*Displays selected date in the input textbox*/
    (<HTMLInputElement>document.getElementById('value')).value = args.value.toLocaleDateString();
}