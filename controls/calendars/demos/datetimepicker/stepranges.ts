import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * Step Range Sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    step: 45,
    value: new Date("12/12/2016 10:15 AM"),
    placeholder: "Pick the date and time value"
});
datetimepicker.appendTo('#datetimepicker');
