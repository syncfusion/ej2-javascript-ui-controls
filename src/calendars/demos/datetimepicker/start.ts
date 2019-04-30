import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * start view sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    start: 'Year'
});
datetimepicker.appendTo('#datetimepicker');