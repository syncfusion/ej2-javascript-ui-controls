import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
import { DatePicker } from '../../src/datepicker/datepicker';
import { RenderDayCellEventArgs } from '../../src/calendar/calendar';
/**
 * Disabled Sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date("5/5/2017 12:00 AM"),
    renderDayCell: disableDate,
    width:"250px"
});
datetimepicker.appendTo('#datetimepicker');

function disableDate(args: RenderDayCellEventArgs) {
    /*The disabled date specified based on day number (0-6)*/
    if (args.date.getDay() === 0 || args.date.getDay() === 6) {
        args.isDisabled = true;
    }
}