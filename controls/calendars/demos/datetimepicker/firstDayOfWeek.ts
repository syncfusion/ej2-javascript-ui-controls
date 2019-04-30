import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * firstdayofweek sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    // Specify the first day of the week need to be displayed in a calendar.
    firstDayOfWeek: 2,
    value: new Date('5/5/2017 10:00 AM')
});
datetimepicker.appendTo('#datetimepicker');