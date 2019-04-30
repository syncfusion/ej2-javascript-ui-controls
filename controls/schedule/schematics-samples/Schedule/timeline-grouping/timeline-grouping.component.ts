import { Component, ViewEncapsulation } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
import {
    TimelineViewsService, AgendaService, GroupModel, EventSettingsModel, ResizeService, DragAndDropService
} from '@syncfusion/ej2-angular-schedule';
import { timelineResourceData } from './assets/datasource';

/**
 * Timeline grouping sample
 */

@Component({
    selector: 'app-root',
    templateUrl: './timeline-grouping.component.html',
    styleUrls: ['./timeline-grouping.component.css'], 
})

export class TimeLineGroupComponent {
   public selectedDate: Date = new Date(2018, 6, 30);
    public group: GroupModel = {
        byGroupID: true,
        resources: ['Room', 'Owner']
    };
    public roomDataSource: Object[] = [
        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
        { text: 'ROOM 2', id: 2, color: '#56ca85' }
    ];
    public ownerDataSource: Object[] = [
        { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
        { text: 'Steven', id: 2, groupId: 1, color: '#f8a398' },
        { text: 'Michael', id: 3, groupId: 1, color: '#51a0ed' },
        { text: 'Janet', id: 4, groupId: 2, color: '#51a0ed' },
        { text: 'Milan', id: 5, groupId: 2, color: '#99ff99' },
    ];
    public allowMultiple: Boolean = true;
    public eventSettings: EventSettingsModel = {
        dataSource: timelineResourceData
    };
}