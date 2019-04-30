import { TimePicker, ChangeEventArgs } from '../../src/timepicker/timepicker';
/**
 * Min and Max timepicker sample
 */

/*Initialize the timepicker component*/
let timepicker: TimePicker = new TimePicker({
    width:"200px",
    min: new Date(2017, 5, 14, 8, 0, 0),
    max: new Date(2017, 5, 14, 9, 0, 0),
    placeholder: "Timepicker with ranges"
});
timepicker.appendTo('#timepicker');
/*Initialize the min-timepicker component*/
let mintimepicker: TimePicker = new TimePicker({
    change: onMinChange
});
mintimepicker.appendTo('#mintimepicker');
/*Initialize the max-timepicker component*/
let maxtimepicker: TimePicker = new TimePicker({
    change: onMaxChange
});
maxtimepicker.appendTo('#maxtimepicker');

function onMinChange(args: ChangeEventArgs) {
    timepicker.min = args.value;
    timepicker.dataBind();
}
function onMaxChange(args: ChangeEventArgs) {
    timepicker.max = args.value;
    timepicker.dataBind();
}
