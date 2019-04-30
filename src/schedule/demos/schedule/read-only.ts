import {
    Schedule, Week, Month, Agenda, TimelineViews, TimelineMonth, Resize, DragAndDrop
} from '../../src/schedule/index';
import { extend } from '@syncfusion/ej2-base';
import { readonlyEventsData } from '../../spec/schedule/base/datasource.spec';
/**
 * schedule read only events sample
 */

Schedule.Inject(Week, Month, Agenda, TimelineViews, TimelineMonth, Resize, DragAndDrop);
let data: Object[] = <Object[]>extend([], readonlyEventsData, null, true);
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '650px',
    eventSettings: { dataSource: data },
    views: ['Week', 'Month', 'Agenda', 'TimelineWeek', 'TimelineMonth']
});
scheduleObj.appendTo('#schedule');
