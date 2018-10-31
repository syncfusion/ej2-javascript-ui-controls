import { Calendar, ChangedEventArgs, RenderDayCellEventArgs } from '../../src/calendar/calendar';
/**
 * Rendercell calendar sample
 */

//let today = new Date();
//let currentYear = today.getFullYear();
//let currentMonth = today.getMonth();
let currentDay =  new Date().getDate();
/*Initialize the calender component*/
let calendar: Calendar = new Calendar({
   // min: new Date(currentYear, currentMonth, currentDay - 7),
   //value: new Date(currentYear, currentMonth, currentDay + 7),
   // max: new Date(currentYear, currentMonth, currentDay + 3),
    renderDayCell: outOfRange
});
calendar.appendTo('#calendar');

function outOfRange(args: RenderDayCellEventArgs) {
    /*Displays out of range date in the alert box*/
    if (args.date.getDate() === currentDay + 7) {
        alert("The given value " + (currentDay + 7) + "is out of range:" + args.isOutOfRange);
    }
}