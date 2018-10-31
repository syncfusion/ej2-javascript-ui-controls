import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 *  firstDayOfWeek Sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    // Specify the first day of the week need to be displayed in a calendar.
    firstDayOfWeek: 2
});
daterangepicker.appendTo('#daterangepicker');
