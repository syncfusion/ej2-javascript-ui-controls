import { DatePicker } from '../../src/datepicker/datepicker';
import { RenderDayCellEventArgs } from '../../src/calendar/calendar';
/**
 * Rendercell sample
 */

let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let currentDay = today.getDate();
/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    min: new Date(currentYear, currentMonth, currentDay - 7),
    value: new Date(currentYear, currentMonth, currentDay + 7),
    max: new Date(currentYear, currentMonth, currentDay + 3),
    renderDayCell: outOfRange
});
datepicker.appendTo('#datepicker');

function outOfRange(args: RenderDayCellEventArgs) {
    if (args.date.getDate() === currentDay + 7) {
        alert("The given value " + (currentDay + 7) + "is out of range:" + args.isOutOfRange);
    }
}