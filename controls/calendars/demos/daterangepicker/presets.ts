import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * Presets sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    presets: [
        { label: 'Today', start: new Date(), end: new Date() },
        { label: 'This Week', start: new Date(new Date().setDate(new Date().getDate() - new Date().getDay())), end: new Date() },
        { label: 'Last Week', start: new Date(new Date().setDate(new Date().getDate() - 6)), end: new Date() },
        { label: 'This Month', start: new Date(new Date().setDate(1)), end: new Date() },
        { label: 'Last Month', start: new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setDate(1)), end: new Date() },
        { label: 'Last Year', start: new Date(new Date().setDate(new Date().getDate() - 365)), end: new Date() },
    ]
});
daterangepicker.appendTo('#daterangepicker');
