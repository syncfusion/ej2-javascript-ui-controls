import { Calendar } from '../../src/calendar/calendar';
import { TimePicker } from '../../src/timepicker/timepicker';
import { DatePicker } from '../../src/datepicker/datepicker';
import { DateTimePicker } from '../../src/index';
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
    value: new Date()
});
timepicker.appendTo('#timepicker');
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date()
});
datetimepicker.appendTo('#datetimepicker');

// };