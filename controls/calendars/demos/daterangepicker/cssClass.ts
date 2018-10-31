import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * cssClass sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    cssClass: 'e-highlight',
    value: {start:new Date("2/2/2018"), end:new Date("4/4/2018")}
});
daterangepicker.appendTo('#daterangepicker');
