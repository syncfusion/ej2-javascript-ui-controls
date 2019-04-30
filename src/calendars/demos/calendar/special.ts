import { Calendar, RenderDayCellEventArgs, ChangedEventArgs } from '../../src/calendar/calendar';
/**
 * Special date calendar sample
 */

/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
    renderDayCell: customDates,
    change: changeValue
});
calendar.appendTo('#calendar');

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

function changeValue(args: ChangedEventArgs): void {
    /*Displays selected date in the input textbox*/
    (<HTMLInputElement>document.getElementById('value')).value = args.value.toLocaleDateString();
}