import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * Weeknumber sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    weekNumber: true,
    width:"265px",
    value: new Date('5/5/2017')
});
datepicker.appendTo('#datePicker');