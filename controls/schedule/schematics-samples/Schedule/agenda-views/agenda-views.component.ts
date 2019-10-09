import { Component, ViewChild } from '@angular/core';  
import { EventSettingsModel, View} from '@syncfusion/ej2-angular-schedule';
import { generateObject } from './assets/datasource';

/**
 * Agenda views sample
 */

@Component({
    selector: 'app-root',
    templateUrl: './agenda-views.component.html',	
    styleUrls: ['./agenda-views.component.css'],
})
export class AgendaViewsComponent { 
    public selectedDate: Date = new Date(2018, 1, 15);
    public currentView: View = "Agenda";
    public eventSettings: EventSettingsModel = { dataSource: generateObject() };  
}