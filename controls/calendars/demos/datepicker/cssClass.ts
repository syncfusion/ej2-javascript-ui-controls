import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * cssClass sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    cssClass: "e-highlight",
    value: new Date("2/2/2018")
});
datepicker.appendTo('#datepicker');
