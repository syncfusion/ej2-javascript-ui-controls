import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * Right to left sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date('5/5/2017 10:00 AM'),
    enableRtl: true
});
datetimepicker.appendTo('#datetimepicker');