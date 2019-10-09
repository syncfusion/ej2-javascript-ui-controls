import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * Min sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    min: new Date('5/10/2017')
});
daterangepicker.appendTo('#daterangepicker');
