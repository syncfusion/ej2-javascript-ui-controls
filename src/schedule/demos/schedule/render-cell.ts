import { Schedule, RenderCellEventArgs, Day, Week, WorkWeek, Month, Agenda } from '../../src/schedule/index';
/**
 * schedule sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '500px',
    renderCell: onRenderCell
});
scheduleObj.appendTo('#schedule');
function onRenderCell(args: RenderCellEventArgs): void {
    if (args.elementType === 'workCells' && (args.date.getDay() === 0 || args.date.getDay() === 6)) {
        args.element.classList.add('holiday');
    }
}
