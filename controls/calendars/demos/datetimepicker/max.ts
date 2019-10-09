import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * maximum date sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    max: new Date()
});
datetimepicker.appendTo('#datetimepicker');