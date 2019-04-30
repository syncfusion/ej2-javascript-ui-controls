import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
/**
 * Readonly sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date(),
    readonly: true
});
datetimepicker.appendTo('#datetimepicker');
