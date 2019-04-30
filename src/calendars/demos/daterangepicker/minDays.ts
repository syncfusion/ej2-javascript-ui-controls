import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * minDays sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    minDays: 5
});
daterangepicker.appendTo('#daterangepicker');
