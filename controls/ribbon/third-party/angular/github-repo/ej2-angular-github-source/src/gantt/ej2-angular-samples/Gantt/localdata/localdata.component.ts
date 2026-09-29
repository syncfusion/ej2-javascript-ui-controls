/**
 * Gantt LocalData Sample
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { projectNewData } from './assets/data-source';

@Component({
    selector: 'app-localdata',
    templateUrl: 'localdata.component.html',
    styleUrls: ['localdata.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class GanttLocaldataComponent {
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
}
