import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * minimum date sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    min: new Date()
});
datepicker.appendTo('#datepicker');
