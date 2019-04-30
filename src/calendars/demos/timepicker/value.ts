import { TimePicker } from '../../src/timepicker/timepicker';
/**
 * Default Timepicker Sample
 */

/*Initialize the timepicker component*/
let timepicker: TimePicker = new TimePicker({
    width:"200px",
    value: new Date("12/12/2016 10:00 AM")
});
timepicker.appendTo('#timepicker');
