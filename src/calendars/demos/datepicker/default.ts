import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * Default Datepicker sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    width:"250px",
    value: new Date('5/7/2018')
});
datepicker.appendTo('#datePicker');