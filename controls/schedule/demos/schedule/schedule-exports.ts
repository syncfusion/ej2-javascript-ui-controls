import { Button } from '@syncfusion/ej2-buttons';
import { Uploader } from '@syncfusion/ej2-inputs';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, ICalendarExport, ICalendarImport, ExcelExport, ExportOptions } from '../../src/schedule/index';
import { defaultData } from '../../spec/schedule/base/datasource.spec';

/**
 * Schedule header customization sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, ICalendarExport, ICalendarImport, ExcelExport);

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: 500,
    selectedDate: new Date(2019, 1, 15),
    eventSettings: { dataSource: defaultData }
});
scheduleObj.appendTo('#schedule');

let buttonObj: Button = new Button();
buttonObj.appendTo('#schedule-print');
buttonObj.appendTo('#excel-export');
buttonObj.appendTo('#ics-export');

let uploadObj: Uploader = new Uploader({
    asyncSettings: {
        saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
        removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
    },
    multiple: false,
    selected: onSelect
});
uploadObj.appendTo('#ics-import');
function onSelect(args: any) {
    scheduleObj.importICalendar(args.event.target.files[0]);
}
(document.querySelector('#ics-export') as HTMLElement).onclick = () => scheduleObj.exportToICalendar();
let exportValues: ExportOptions = {
    fileName: "CalendarData",
    exportType: 'xlsx',
    includeOccurrences: false
};
(document.querySelector('#excel-export') as HTMLElement).onclick = () => scheduleObj.exportToExcel(exportValues);

