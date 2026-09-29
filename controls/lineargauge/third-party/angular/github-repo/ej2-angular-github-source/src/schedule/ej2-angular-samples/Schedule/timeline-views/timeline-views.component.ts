import { Component } from '@angular/core';
import { EventSettingsModel, View} from '@syncfusion/ej2-angular-schedule';
import { scheduleData} from './assets/datasource';

/**
 * Timeline views sample
 */

@Component({
  selector: 'app-root',
  templateUrl: './timeline-views.component.html',
  styleUrls: ['./timeline-views.component.css']
})
export class TimeLineViewsComponent {
    public currentDate: Date = new Date(2018, 1, 15); 
    public currentView: View = 'TimelineWeek';
    public eventSettings: EventSettingsModel = { dataSource: scheduleData }; 
}