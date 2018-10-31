import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
import { RenderDayCellEventArgs } from '../../src/calendar/calendar';
/**
 * special date sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    renderDayCell: customDates,
    value: new Date('5/5/2017 10:00 AM')
});
datetimepicker.appendTo('#datetimepicker');
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