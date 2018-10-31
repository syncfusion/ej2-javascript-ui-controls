import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * enable sample
 */

/*Initialize the datepicker component with disabled state*/
let datepicker: DatePicker = new DatePicker({
    width:"250px",
    value: new Date('5/5/2017'),
    enabled: false
});
datepicker.appendTo('#datePicker');