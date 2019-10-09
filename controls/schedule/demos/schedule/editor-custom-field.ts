import { createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, PopupOpenEventArgs } from '../../src/schedule/index';

/**
 * schedule sample
 */
Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);
let data: Object[] = [
    {
        Id: 1,
        Subject: 'Server Maintenance',
        StartTime: new Date(2018, 0, 8, 2, 30),
        EndTime: new Date(2018, 0, 8, 4, 0),
        EventType: 'Maintenance'
    }, {
        Id: 2,
        Subject: 'Technology Book Stall',
        StartTime: new Date(2018, 0, 12, 12, 30),
        EndTime: new Date(2018, 0, 12, 16, 0),
        EventType: 'Public Event'
    }, {
        Id: 3,
        Subject: 'George Birthday Celebration',
        StartTime: new Date(2018, 0, 9, 10, 0),
        EndTime: new Date(2018, 0, 9, 12, 0),
        EventType: 'Family Event'
    }, {
        Id: 4,
        Subject: 'John Wedding Aniversary',
        StartTime: new Date(2018, 0, 11, 10, 30),
        EndTime: new Date(2018, 0, 11, 12, 30),
        EventType: 'Family Event'
    }, {
        Id: 5,
        Subject: 'Annual Conference',
        StartTime: new Date(2018, 0, 9, 17, 30),
        EndTime: new Date(2018, 0, 9, 21, 0),
        EventType: 'Commercial Event'
    }];
let scheduleObj: Schedule = new Schedule({
    width: '100%',
    height: '550px',
    selectedDate: new Date(2018, 0, 9),
    popupOpen: (args: PopupOpenEventArgs) => {
        if (args.type === 'Editor') {
            // Create required custom elements in initial time
            if (!args.element.querySelector('.custom-field-row')) {
                let row: HTMLElement = createElement('div', { className: 'custom-field-row' });
                let formElement: HTMLElement = args.element.querySelector('.e-schedule-form');
                formElement.firstChild.insertBefore(row, args.element.querySelector('.e-title-location-row'));
                let container: HTMLElement = createElement('div', { className: 'custom-field-container' });
                let inputEle: HTMLInputElement = createElement('input', {
                    className: 'e-field', attrs: { name: 'EventType' }
                }) as HTMLInputElement;
                container.appendChild(inputEle);
                row.appendChild(container);
                let drowDownList: DropDownList = new DropDownList({
                    dataSource: [
                        { text: 'Public Event', value: 'Public Event' },
                        { text: 'Holiday', value: 'Holiday' },
                        { text: 'Maintenance', value: 'Maintenance' },
                        { text: 'Commercial Event', value: 'Commercial Event' },
                        { text: 'Family Event', value: 'Family Event' }
                    ],
                    fields: { text: 'text', value: 'value' },
                    value: (<{ [key: string]: Object }>(args.data)).EventType as string,
                    floatLabelType: 'Always', placeholder: 'Event Type'
                });
                drowDownList.appendTo(inputEle);
                inputEle.setAttribute('name', 'EventType');
            }
        }
    },
    eventSettings: {
        dataSource: data
    }
});
scheduleObj.appendTo('#schedule');
