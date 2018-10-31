import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * Range Sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    min: new Date('5/4/2017 10:00 AM'),
    max: new Date('5/17/2017 04:00 PM'),
    value: new Date('5/6/2017 11:00 AM')
});
datetimepicker.appendTo('#datetimepicker');