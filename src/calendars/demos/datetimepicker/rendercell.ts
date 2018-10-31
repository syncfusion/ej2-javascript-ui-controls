import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
import { RenderDayCellEventArgs } from '../../src/calendar/calendar';
/**
 * Rendercell sample
 */

let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let currentDay = today.getDate();
/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    min: new Date(currentYear, currentMonth, currentDay - 7, 10),
    value: new Date(currentYear, currentMonth, currentDay + 7, 20),
    max: new Date(currentYear, currentMonth, currentDay + 3, 18),
    renderDayCell: outOfRange
});
datetimepicker.appendTo('#datetimepicker');

function outOfRange(args: RenderDayCellEventArgs) {
    if (args.date.getDate() === currentDay + 7) {
        alert("The given value " + (currentDay + 7) + "is out of range:" + args.isOutOfRange);
    }
}