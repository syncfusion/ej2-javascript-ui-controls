import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * maximum date sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    max: new Date()
});
datepicker.appendTo('#datepicker');