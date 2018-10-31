import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';
import { EventHandler } from '@syncfusion/ej2-base';

/**
 * target sample
 */

/*Initialize the daterangepicker component*/
let daterangepicker: DateRangePicker = new DateRangePicker();
daterangepicker.appendTo('#daterangepicker');

let target: HTMLElement = <HTMLElement>document.body.querySelector("#target");
target.addEventListener('click', function (e) {
    e.stopPropagation();
    let popup: HTMLElement = <HTMLElement>document.querySelector('.e-popup');
    if (daterangepicker && !popup) {
        daterangepicker.hide();
        daterangepicker.show(target);
    } else {
        daterangepicker.hide();
    }
});
