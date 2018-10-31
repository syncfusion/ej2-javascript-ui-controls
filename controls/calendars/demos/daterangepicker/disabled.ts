import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
import { RenderDayCellEventArgs } from '../../src/calendar/calendar';
/**
 * Disabled Dates sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker ({
    renderDayCell:disableDate
});
daterangepicker.appendTo('#daterangepicker');

function disableDate(args: RenderDayCellEventArgs) {
    /*Date need to be disabled*/
    if (args.date.getDay() === 0 || args.date.getDay() === 6) {
        args.isDisabled = true;        
    }
}
