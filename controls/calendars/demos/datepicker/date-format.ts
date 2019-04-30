import { Ajax, loadCldr } from '@syncfusion/ej2-base';
import { DatePicker } from '../../src/datepicker/datepicker';
import {  } from '../../src/calendar/calendar';
import { Component, EventHandler, Property, Event, CreateBuilder, Internationalization, EmitType, L10n, setCulture } from '@syncfusion/ej2-base';

/**
 * DateFormat DatePicker sample
 */

// this.default = (): void => {   
    let datepicker: DatePicker = new DatePicker({
        value: new Date()
        });
    datepicker.appendTo('#datepicker');
    document.getElementById('dateFormats').addEventListener('change', changeDateFormat);

    function changeDateFormat(): void {
        let dateFormat: string = (document.getElementById('dateFormats') as HTMLSelectElement).value;
        datepicker.format = dateFormat;                
        datepicker.dataBind();
    }
// };
