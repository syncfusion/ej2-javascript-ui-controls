import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * enable sample
 */

/*Initialize the datetimepicker component with disabled state*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date('5/5/2017 11:00 AM'),
    enabled: false
});
datetimepicker.appendTo('#datetimePicker');