import { DateRangePicker } from '../../src/daterangepicker/daterangepicker';

/**
 * DateFormat DateRangePicker sample
 */

// this.default = (): void => {   
    let daterangepicker: DateRangePicker = new DateRangePicker();
        daterangepicker.appendTo('#daterangepicker');
    document.getElementById('dateFormats').addEventListener('change', changeDateFormat);

    function changeDateFormat(): void {
        let dateFormat: string = (document.getElementById('dateFormats') as HTMLSelectElement).value;
        daterangepicker.format = dateFormat;                
        daterangepicker.dataBind();
    }
// };
