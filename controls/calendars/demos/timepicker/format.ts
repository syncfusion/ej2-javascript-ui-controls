import { TimePicker } from '../../src/timepicker/timepicker';
/**
 * Format Sample
 */

/*Initialize the timepicker component*/
let timepicker: TimePicker = new TimePicker({
    format: '\' Time \': HH.mm',
    value: new Date("12/12/2016 10:15 AM"),
    width:"200px"
});
timepicker.appendTo('#timepicker');
