import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * minimum date sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    min: new Date()
});
datetimepicker.appendTo('#datetimepicker');
