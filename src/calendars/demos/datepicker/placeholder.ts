import { DatePicker } from '../../src/datepicker/datepicker';
/**
 *Placeholder sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    width:"250px",
    placeholder: "Pick a date",
    floatLabelType:"Auto"
});
datepicker.appendTo('#datePicker');