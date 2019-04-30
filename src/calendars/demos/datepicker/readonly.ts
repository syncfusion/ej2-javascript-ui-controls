import { DatePicker } from '../../src/datepicker/datepicker';
/**
 * Readonly sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    value: new Date(),
    readonly: true
});
datepicker.appendTo('#datepicker');
