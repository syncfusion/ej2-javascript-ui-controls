import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * Weeknumber sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    width:"250px",
    value: new Date('5/5/2017'),
    weekNumber: true,
    enableRtl: true
});
datepicker.appendTo('#datePicker');