import { Calendar, RenderDayCellEventArgs, ChangedEventArgs } from '../../src/calendar/calendar';
/**
 * Disable date calendar sample
 */

/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
    value: new Date('5/5/2017'),
    renderDayCell: disableDate,
    change: changeValue
});
calendar.appendTo('#calendar');

function disableDate(args: RenderDayCellEventArgs) {
    /*The disabled date specified based on day number (0-6)*/
    if (args.date.getDay() === 0 || args.date.getDay() === 6) {
        args.isDisabled = true;
    }
}

function changeValue(args: ChangedEventArgs): void {
    /*Displays selected date in the input textbox*/
    (<HTMLInputElement>document.getElementById('value')).value = args.value.toLocaleDateString();
}
