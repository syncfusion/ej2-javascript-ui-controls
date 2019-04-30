import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * placholder sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    placeholder: 'Select a range'
});
daterangepicker.appendTo('#daterangepicker');
