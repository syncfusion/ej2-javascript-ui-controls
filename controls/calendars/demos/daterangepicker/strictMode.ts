import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * StrictMode sample
 */

/*Initialize the daterangepicker component with strictmode true*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    strictMode: true,
    min: new Date('4/5/2017'),
    max: new Date('5/25/2017'),
    startDate : new Date('4/4/2017'),
    endDate: new Date('5/24/2017')
});
daterangepicker.appendTo('#daterangepicker');
