import { Calendar, ChangedEventArgs } from '../../src/calendar/calendar';
/**
 * Value sample
 */

/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
    value: new Date(),
    change: changeValue
});
calendar.appendTo('#calendar');

function changeValue(args: ChangedEventArgs): void {
    /*Displays selected date in the input textbox*/
    (<HTMLInputElement>document.getElementById('value')).value = args.value.toLocaleDateString();
}
