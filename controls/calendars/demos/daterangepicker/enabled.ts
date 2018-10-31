import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * Enabled sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    enabled: false
});
daterangepicker.appendTo('#daterangepicker');
