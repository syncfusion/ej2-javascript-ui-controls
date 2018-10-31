import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * start view sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    start: 'Year'
});
datepicker.appendTo('#datepicker');