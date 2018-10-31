import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * datepicker width sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    value: new Date('5/5/2017'), 
    width: "400px"
});
datepicker.appendTo('#datePicker');