import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * Range sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    width:"250px",
    min: new Date('5/4/2017'),
    max: new Date('5/17/2017'),
    value: new Date('5/6/2017')
});
datepicker.appendTo('#datePicker');