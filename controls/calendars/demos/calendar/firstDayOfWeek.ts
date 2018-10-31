import { Calendar, ChangedEventArgs } from '../../src/calendar/calendar';
/**
 * Firstdayofweek sample
 */

/*initialize the calender component*/
let calendar: Calendar = new Calendar({
    // Specify the first day of the week need to be displayed in a calendar.
    value: new Date('5/5/2017'),
    firstDayOfWeek: 2,
    change: changeValue
});
calendar.appendTo('#calendar');

function changeValue(args: ChangedEventArgs): void {
    /*Display the selected date in the input textbox*/
    (<HTMLInputElement>document.getElementById('value')).value = args.value.toLocaleDateString();
}
