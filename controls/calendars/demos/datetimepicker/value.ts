import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * value sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date()
});
datetimepicker.appendTo('#datetimepicker');
