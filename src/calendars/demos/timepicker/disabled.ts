import { TimePicker } from '../../src/timepicker/timepicker';
/**
 * Disabled Sample
 */

/*initialize the timepicker component with disable state*/
let timepicker: TimePicker = new TimePicker({
    value: new Date("10/12/2017 11:00 AM"),
    enabled: false,
    width:"200px"
});
timepicker.appendTo('#timepicker');
