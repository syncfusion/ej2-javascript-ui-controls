import { DateTimePicker } from '../../src/datetimepicker/datetimepicker';
import { Ajax, loadCldr } from '@syncfusion/ej2-base';
/**
 * KeyboardNavigation Sample
 */

/*Initialize the datetimepicker component*/
let datetimepicker: DateTimePicker = new DateTimePicker({
    value: new Date("12/15/2017 02:00 PM"),
    placeholder: "select Date Time"
});
datetimepicker.appendTo('#datetimepicker');
