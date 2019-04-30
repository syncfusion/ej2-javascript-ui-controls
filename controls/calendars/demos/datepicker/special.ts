import { DatePicker } from '../../src/datepicker/datepicker';
import { RenderDayCellEventArgs } from '../../src/calendar/calendar';
/**
 * special date sample
 */

/*Initialize the datepicker component*/
let datepicker: DatePicker = new DatePicker({
    width:"250px",
    renderDayCell: customDates,
    value: new Date('5/5/2017')
});
datepicker.appendTo('#datePicker');
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