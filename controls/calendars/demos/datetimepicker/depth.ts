import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * depth view sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    start: "Decade",
    depth: "Year"
});
datetimepicker.appendTo('#datetimepicker');
