import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * Max Value sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    max: new Date('10/10/2017')
});
daterangepicker.appendTo('#daterangepicker');
