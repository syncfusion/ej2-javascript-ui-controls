import { RenderDayCellEventArgs } from '../../src/calendar/calendar';
import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
/**
 * Special day sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker({
    renderDayCell: customDates
});
daterangepicker.appendTo('#daterangepicker');

function customDates(args: RenderDayCellEventArgs) {
    /*Date need to be customized*/
    if (args.date.getDate() === 10) {
        let span: HTMLElement;
        span = document.createElement('span');
        span.setAttribute('class', 'e-icons highlight');
        args.element.firstElementChild.setAttribute('title', 'Birthday !');
        args.element.setAttribute('title', 'Birthday !');
        args.element.setAttribute('data-val', 'Birthday !');
        args.element.appendChild(span);
    }
}