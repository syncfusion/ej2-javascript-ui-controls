import { Component, Inject, ViewEncapsulation } from '@angular/core';
import {
    EventSettingsModel, GroupModel, ResourceDetails
} from '@syncfusion/ej2-angular-schedule';
import { generateEvents } from './assets/datasource';

/**
 * horizontal grouping sample
 */
@Component({
    selector: 'app-root',
    templateUrl: './horizontal-grouping.component.html',
    styleUrls: ['./horizontal-grouping.component.css'], 
})

export class HorizontalGroupComponent {
    public selectedDate: Date = new Date(2018, 3, 1);
    public resourceDataSource: Object[] = [
        { AirlineName: 'Airways 1', AirlineId: 1, AirlineColor: '#EA7A57' },
        { AirlineName: 'Airways 2', AirlineId: 2, AirlineColor: '#357cd2' },
        { AirlineName: 'Airways 3', AirlineId: 3, AirlineColor: '#7fa900' }
    ];
    public group: GroupModel = { resources: ['Airlines'] };
    public allowMultiple: Boolean = true;
    public eventSettings: EventSettingsModel = {
        dataSource: generateEvents(),
        fields: {
            subject: { title: 'Travel Summary', name: 'Subject' },
            location: { title: 'Source', name: 'Location' },
            description: { title: 'Comments', name: 'Description' },
            startTime: { title: 'Departure Time', name: 'StartTime' },
            endTime: { title: 'Arrival Time', name: 'EndTime' }
        }
    };

    getAirlineName(value: ResourceDetails): string {
        return (value as ResourceDetails).resourceData[(value as ResourceDetails).resource.textField] as string;
    }
    getAirlineImage(value: ResourceDetails): string {
        let airlineName: string = this.getAirlineName(value);
        return airlineName.replace(' ', '-').toLowerCase();
    }
    getAirlineModel(value: ResourceDetails): string {
        let airlineName: string = this.getAirlineName(value);
        return (airlineName === 'Airways 1') ? 'CRJ 700' : (airlineName === 'Airways 2') ? 'Airbus A330' : 'ATR 72-600';
    }
    getAirlineSeats(value: ResourceDetails): number {
        let airlineName: string = this.getAirlineName(value);
        return (airlineName === 'Airways 1') ? 50 : (airlineName === 'Airways 2') ? 75 : 100;
    }
}