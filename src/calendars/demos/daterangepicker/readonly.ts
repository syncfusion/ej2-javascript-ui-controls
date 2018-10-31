import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * readonly sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    readonly: true,
    value: {start:new Date("2/2/2018"), end: new Date("4/4/2018")}
});
daterangepicker.appendTo('#daterangepicker');
