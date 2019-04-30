import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * datetimepicker width sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date('5/5/2017 10:00 AM'), 
    width: "400px"
});
datetimepicker.appendTo('#datetimepicker');