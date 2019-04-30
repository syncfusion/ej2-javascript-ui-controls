import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * firstdayofweek sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    // Specify the first day of the week need to be displayed in a calendar.
    firstDayOfWeek: 2,
    width:"250px",
    value: new Date('5/5/2017')
});
datepicker.appendTo('#datePicker');