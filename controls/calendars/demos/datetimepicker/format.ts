import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
import { Ajax, loadCldr } from '@syncfusion/ej2-base';
/**
 * Format Sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date(),
    format: "yyyy/MMM/dd hh:mm a",
    width:"250px"
});
datetimepicker.appendTo('#datetimepicker');