import { Schedule, Day, Week, WorkWeek, Month, Agenda, ActionEventArgs, ToolbarActionArgs } from '../../src/schedule/index';
import { Browser } from '@syncfusion/ej2-base';
import { ItemModel, DisplayMode } from '@syncfusion/ej2-navigations';
import { sampleData } from '../../spec/schedule/base/datasource.spec';

/**
 * Schedule header customization sample
 */

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);

let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: 500,
    selectedDate: new Date(2018, 1, 15),
    actionBegin: (args: ActionEventArgs & ToolbarActionArgs) => {
        if (args.requestType === 'toolbarItemRendering') {
            let showtext: DisplayMode = Browser.isDevice ? 'Overflow' : 'Both';
            let printItem: ItemModel = {
                align: 'Center', showTextOn: showtext, prefixIcon: 'e-icon-schedule-print', text: 'Print', cssClass: 'e-schedule-print'
            };
            args.items.push(printItem);
            let pdfExportItem: ItemModel = {
                align: 'Center', showTextOn: showtext, prefixIcon: 'e-icon-schedule-pdf', text: 'Pdf Export', cssClass: 'e-schedule-pdf'
            };
            args.items.push(pdfExportItem);
        }
    },eventSettings: { dataSource: sampleData}
});
scheduleObj.appendTo('#schedule');

(document.querySelector('.e-schedule-print') as HTMLElement).onclick = () => {
    alert('Print item clicked');
};
(document.querySelector('.e-schedule-pdf') as HTMLElement).onclick = () => {
    alert('Pdf item clicked');
};
