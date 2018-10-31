import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
import { RenderDayCellEventArgs } from '../../src/calendar/calendar';

/**
 * render cell sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    startDate: new Date('1/1/2017'),
    endDate: new Date('5/24/2017'),
    renderDayCell: renderCell
});
daterangepicker.appendTo('#daterangepicker');

function renderCell(args: RenderDayCellEventArgs) {
    /*Displays out of range date in the alert box*/
    if (+args.date === +new Date('1/1/2017')) {
        alert("The given value " + (args.date.getDate()) + "is Rendered");
    }
}

