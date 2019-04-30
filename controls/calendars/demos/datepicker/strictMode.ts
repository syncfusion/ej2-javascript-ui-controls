import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * strict Mode sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    value: new Date(),
    strictMode: true,
    min: new Date("12/12/2017"),
    max: new Date("6/6/2018")
});
datepicker.appendTo('#datepicker');