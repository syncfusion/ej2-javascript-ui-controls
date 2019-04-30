import { Calendar, ChangedEventArgs } from '../../src/calendar/calendar';
/**
 * RTL Week number calendar sample
 */

/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
    value: new Date('5/5/2017'),
    enableRtl:true,
    weekNumber: true,
    firstDayOfWeek: 2,
	change: changeValue
});
calendar.appendTo('#calendar');

function changeValue(args: ChangedEventArgs): void {
    /*Displays selected date in the input textbox*/
    (<HTMLInputElement>document.getElementById('value')).value = args.value.toLocaleDateString();
}