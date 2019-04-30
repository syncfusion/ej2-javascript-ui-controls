import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * strict Mode sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date(),
    strictMode: true,
    min: new Date("12/12/2017 10:00 AM"),
    max: new Date("6/6/2018 08:00 PM")
});
datetimepicker.appendTo('#datetimepicker');