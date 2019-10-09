import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * Max days sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    maxDays: 10
});
daterangepicker.appendTo('#daterangepicker');
