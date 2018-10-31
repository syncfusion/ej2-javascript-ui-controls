import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * Default sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date("12/15/2017 02:00 PM"),
    placeholder: "select Date Time",
    width:"250px"
});
datetimepicker.appendTo('#datetimepicker');