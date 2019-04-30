/**
 * Gantt DayMarkers Sample
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { projectNewData } from './assets/data-source';

@Component({
    selector: 'app-daymarkers',
    templateUrl: 'daymarkers.component.html',
    styleUrls: ['daymarkers.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class GanttDaymarkersComponent {
    // Define an array of JSON data
    public data: object[] = projectNewData;
    public taskSettings: object = {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks'
    };
    public eventMarkers : object[] =  [
        {
            day: new Date('04/09/2019'),
            label: 'Research phase'
        }, {
            day: new Date('04/30/2019'),
            label: 'Design phase'
        }, {
            day: new Date('05/23/2019'),
            label: 'Production phase'
        }, {
            day: new Date('06/20/2019'),
            label: 'Sales and marketing phase'
        }
    ];
    public holidays : object[] = [
        {
            from: '04/15/2019',
            cssClass: 'e-custom-holiday',
            label: 'Local Holiday'
        },
        {
            from: '05/01/2019',
            to: '05/05/2019',
            label: ' Public holiday',
            cssClass: 'e-custom-holiday'
        }
    ];  
}
