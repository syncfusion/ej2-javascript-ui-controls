import { TimePicker } from '../../src/timepicker/timepicker';
/**
 * RTL sample
 */

/*Initialize the timepicker component*/
let timepicker: TimePicker = new TimePicker({
    placeholder: "Select a time",
    enableRtl: true
});
timepicker.appendTo('#timepicker');


