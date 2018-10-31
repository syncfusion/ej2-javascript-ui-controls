import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * Weeknumber sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    weekNumber: true,
    value: new Date('5/5/2017 10:00 AM')
});
datetimepicker.appendTo('#datetimepicker');