import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * value sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    value: new Date()
});
datepicker.appendTo('#datepicker');
