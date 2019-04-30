import { TimePicker } from '../../src/timepicker/timepicker';
/**
 *  Timepicker Strict Mode sample
 */

/*Initialize the timepicker component with strictmodel enable*/
let timepicker: TimePicker = new TimePicker({
    value: new Date("12/12/2016 10:00 AM"),
    strictMode: true,
    min: new Date("12/12/2016 11:00 AM"),
    max: new Date("12/12/2016 11:00 PM"),
    width:"200px"
});
timepicker.appendTo('#timepicker');

document.getElementById('checkbox').addEventListener('change', changeMode);
function changeMode(args: any): void {
    let state: boolean = (document.getElementById('checkbox') as HTMLInputElement).checked;
    timepicker.strictMode = state;
}
