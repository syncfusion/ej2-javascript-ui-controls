import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * DateFormat sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    width:"250px",
    value: new Date('5/5/2017'),
    format: "yyyy/MMM/dd"
});
datepicker.appendTo('#datePicker');