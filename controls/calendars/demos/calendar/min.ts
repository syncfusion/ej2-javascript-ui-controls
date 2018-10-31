import { Calendar, ChangedEventArgs } from '../../src/calendar/calendar';
/**
 * Min date calendar sample
 */

/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
    min: new Date(),
    change: changeValue
});
calendar.appendTo('#calendar');

function changeValue(args: ChangedEventArgs): void {
    /*Displays selected date in the input textbox*/
    (<HTMLInputElement>document.getElementById('value')).value = args.value.toLocaleDateString();
}