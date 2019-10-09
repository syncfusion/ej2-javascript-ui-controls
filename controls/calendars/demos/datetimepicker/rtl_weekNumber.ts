import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * Weeknumber sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date('5/5/2017 10:00 AM'),
    weekNumber: true,
    enableRtl: true
});
datetimepicker.appendTo('#datetimepicker');