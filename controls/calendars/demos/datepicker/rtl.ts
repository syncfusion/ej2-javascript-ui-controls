import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * Right to left sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    width:"250px",
    value: new Date('5/5/2017'),
    enableRtl: true
});
datepicker.appendTo('#datePicker');