/**
 * Events base methods testing
 */
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, Timezone } from '../../../src/schedule/index';
import { EventBase } from '../../../src/schedule/event-renderer/event-base';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);
describe('split event by day method testing', () => {
    let schObj: Schedule;
    let eventBase: EventBase;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll(() => {
        document.body.appendChild(elem);
        schObj = new Schedule();
        eventBase = new EventBase(schObj);
        schObj.appendTo('#Schedule');
    });
    afterAll(() => {
        if (schObj) {
            schObj.destroy();
        }
        remove(elem);
    });

    it('Event on same day', () => {
        let event: { [key: string]: Object } = {
            'StartTime': new Date(2017, 11, 1, 4),
            'EndTime': new Date(2017, 11, 1, 8)
        }
        let spannedEvents: Object[] = eventBase.splitEventByDay(event);
        expect(spannedEvents.length).toEqual(1);
    });

    it('Event on multiple day', () => {
        let event: { [key: string]: Object } = {
            'StartTime': new Date(2017, 11, 1, 4),
            'EndTime': new Date(2017, 11, 4, 8)
        }
        let spannedEvents: Object[] = eventBase.splitEventByDay(event);
        expect(spannedEvents.length).toEqual(4);
    });
});

describe('checking spanned recurrence appointment', () => {
    let schObj: Schedule;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        schObj = new Schedule({
            height: '550px', selectedDate: new Date(2018, 7, 7),
            eventSettings: {
                dataSource: [
                    {
                        Id: 1,
                        StartTime: new Date(2018, 7, 7, 23),
                        EndTime: new Date(2018, 7, 8, 16),
                        RecurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,MO,TU,WE,TH,FR,SA;INTERVAL=1;UNTIL=20180905T070000Z;'
                    }
                ]
            },
            dataBound: dataBound
        });
        schObj.appendTo('#Schedule');
    });
    afterAll(() => {
        if (schObj) {
            schObj.destroy();
        }
        remove(elem);
    });
    it('spanned recurrence appointments with offsetTop', (done: Function) => {
        schObj.dataBound = () => {
            let app2: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-content-wrap .e-appointment'));
            expect(app2.length).toEqual(14);
            expect(app2[0].offsetTop).toEqual(0);
            done();
        };
        let app1: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-content-wrap .e-appointment'));
        expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('August 05 - 11, 2018');
        expect(app1.length).toEqual(9);
        expect(app1[0].offsetTop).toEqual(1656);
        (schObj.element.querySelector('.e-schedule-toolbar .e-next') as HTMLElement).click();
        expect(schObj.element.querySelector('.e-date-range .e-tbar-btn-text').innerHTML).toEqual('August 12 - 18, 2018');
    });
});

describe('Schedule Timezone testing', () => {
    let schObj: Schedule;
    let eventBase: EventBase;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    let datas: Object[] = [{
        Id: 1,
        Subject: 'Testing',
        StartTime: new Date(2018, 5, 14, 15, 0),
        EndTime: new Date(2018, 5, 14, 17, 0)
    }];
    for (let data of datas) {
        let event: { [key: string]: Object } = data as { [key: string]: Object };
        let timezone: Timezone = new Timezone();
        event.StartTime = timezone.removeLocalOffset(<Date>event.StartTime);
        event.EndTime = timezone.removeLocalOffset(<Date>event.EndTime);
    }
    let initialStartDate: Date = new Date((datas[0] as { [key: string]: Object }).StartTime + '');
    beforeAll((done: Function) => {
        document.body.appendChild(elem);
        let dataBound: EmitType<Object> = () => { done(); };
        schObj = new Schedule({
            selectedDate: new Date(2018, 5, 14),
            eventSettings: {
                dataSource: datas
            },
            dataBound: dataBound
        });
        schObj.appendTo('#Schedule');
    });
    afterAll(() => {
        if (schObj) {
            schObj.destroy();
        }
        remove(elem);
    });

    it('Set timezone to Schedule', () => {
        schObj.timezone = 'America/New_York';
        schObj.dataBind();
        let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
        expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 5, 14, 11, 0).getTime());
    });

    it('Convert timezone', () => {
        schObj.timezone = 'Asia/Kolkata';
        schObj.dataBind();
        let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
        expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 5, 14, 20, 30).getTime());
    });

    it('Remove timezone to Schedule', () => {
        schObj.timezone = null;
        schObj.dataBind();
        let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
        expect((event.StartTime as Date).getTime()).toEqual(initialStartDate.getTime());
    });
});