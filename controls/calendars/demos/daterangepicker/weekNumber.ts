import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * WeekNumber sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    weekNumber: true
});
daterangepicker.appendTo('#daterangepicker');
