import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 *Placeholder sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    placeholder: "Pick a date and time"
});
datetimepicker.appendTo('#datetimepicker');