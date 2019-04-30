import { TimePicker } from '../../src/timepicker/timepicker';
/**
 * Step Range Sample
 */

/*Initialize the timepicker component*/
let timepicker: TimePicker = new TimePicker({
    step: 45,
    value: new Date("12/12/2016 10:15 AM"),
    placeholder: "Pick the time value",
    width:"200px"
});
timepicker.appendTo('#timepicker');
