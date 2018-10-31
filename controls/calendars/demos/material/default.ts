import { Calendar } from '../../src/calendar/calendar';
import { TimePicker } from '../../src/timepicker/timepicker';
import { DatePicker } from '../../src/datepicker/datepicker';
import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';

/**
 * Default sample
 */

// this.default = (): void => {
let calendar: Calendar = new Calendar({
    value: new Date()
});
calendar.appendTo('#calendar');
let datepicker: DatePicker = new DatePicker({
    value: new Date()
});
datepicker.appendTo('#datepicker');
let timepicker: TimePicker = new TimePicker({
     min : new Date(), max : new Date() ,value : new Date() 
});
timepicker.appendTo('#timepicker');

let datetime = new DateTimePicker({
    min: new Date(), max: new Date(), value: new Date()

})

datetime.appendTo('#datetime');

let daterange = new DateRangePicker({})
daterange.appendTo('#daterange')