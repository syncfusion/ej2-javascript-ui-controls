import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * cssClass sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    cssClass: "e-highlight",
    value: new Date("2/2/2018 10:00 AM")
});
datetimepicker.appendTo('#datetimepicker');
