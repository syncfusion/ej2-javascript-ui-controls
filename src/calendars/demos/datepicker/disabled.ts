import { DatePicker } from '../../src/datepicker/datepicker';
import { RenderDayCellEventArgs } from '../../src/calendar/calendar';
/**
 * disable-date sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    value: new Date('5/5/2017'),
    width:"250px",
    renderDayCell: disableDate
});
datepicker.appendTo('#datePicker');

function disableDate(args: RenderDayCellEventArgs) {
    /*The disabled date specified based on day number (0-6)*/
    if (args.date.getDay() === 0 || args.date.getDay() === 6) {
        args.isDisabled = true;
    }
}