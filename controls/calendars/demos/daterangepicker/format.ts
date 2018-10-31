import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * date format sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    format: "yyyy/MMM/dd"
});
daterangepicker.appendTo('#daterangepicker');
