import { Component } from '@angular/core';
import { EventSettingsModel, View} from '@syncfusion/ej2-angular-schedule';
import { scheduleData } from './assets/datasource';

/**
 * Calendar views sample
 */

@Component({
  selector: 'app-root',
  templateUrl: './calendar-views.component.html', 
  styleUrls: ['./calendar-views.component.css'],
})
export class CalendarViewsComponent {
    public currentDate: Date = new Date(2018, 1, 15);
    public currentView: View = 'Week';
    public eventSettings: EventSettingsModel = {dataSource: scheduleData};
}
