import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * depth view sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    start: "Decade",
    depth: "Year"
});
datepicker.appendTo('#datepicker');
