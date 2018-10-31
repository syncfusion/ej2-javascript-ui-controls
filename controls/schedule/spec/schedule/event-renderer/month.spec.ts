/**
 * Month view appointment rendering spec 
 */
import { createElement, remove, EmitType, closest, Browser } from '@syncfusion/ej2-base';
import { Schedule, Day, Week, WorkWeek, Month, Agenda } from '../../../src/schedule/index';
import { testData } from '../base/datasource.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda);
describe('Schedule Month view appointment rendering', () => {
    let schObj: Schedule;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        schObj = new Schedule({
            currentView: 'Month',
            height: '550px',
            width: '500px',
            selectedDate: new Date(2017, 10, 6),
            eventSettings: { dataSource: testData },
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

    it('elements in DOM', () => {
        let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
        expect(eventElementList.length).toEqual(9);
        let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
        expect(eventWrapperList.length).toEqual(8);
        expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
        let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
        expect(moreIndicatorList.length).toEqual(2);
    });
});

describe('Mobile view', () => {
    let schObj: Schedule;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    let uA: string = Browser.userAgent;
    let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        Browser.userAgent = androidUserAgent;
        document.body.appendChild(elem);
        schObj = new Schedule({
            currentView: 'Month',
            height: '550px',
            width: '500px',
            selectedDate: new Date(2017, 10, 6),
            eventSettings: { dataSource: testData },
            dataBound: dataBound
        });
        schObj.appendTo('#Schedule');
    });
    afterAll(() => {
        if (schObj) {
            schObj.destroy();
        }
        remove(elem);
        Browser.userAgent = uA;
    });

    it('More event click testing', () => {
        let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
        expect(eventElementList.length).toEqual(9);
        let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
        expect(eventWrapperList.length).toEqual(8);
        expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
        let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
        expect(moreIndicatorList.length).toEqual(2);
        let element: HTMLElement = moreIndicatorList[0] as HTMLElement;
        element.click();
        expect(schObj.element.querySelector('.e-active-view').classList).toContain('e-day');
    });
});

describe('Schedule Hide week end in Month view appointment rendering', () => {
    let schObj: Schedule;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        schObj = new Schedule({
            currentView: 'Month',
            height: '550px',
            width: '500px',
            showWeekend: false,
            selectedDate: new Date(2017, 10, 6),
            eventSettings: { dataSource: testData },
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

    it('elements in DOM', () => {
        let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
        expect(eventElementList.length).toEqual(9);
        let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
        expect(eventWrapperList.length).toEqual(8);
        expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(2);
        let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
        expect(moreIndicatorList.length).toEqual(2);
        expect(schObj.getWorkCellElements().length).toEqual(25);
        schObj.showWeekend = true;
        schObj.dataBind();
        expect(schObj.getWorkCellElements().length).toEqual(35);
    });
});

describe('Schedule month view appointment rendering in RTL Mode', () => {
    let schObj: Schedule;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        schObj = new Schedule({
            currentView: 'Month',
            height: '550px',
            width: '500px',
            enableRtl: true,
            selectedDate: new Date(2017, 10, 6),
            eventSettings: { dataSource: testData },
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

    it('elements in DOM', () => {
        let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
        expect(eventElementList.length).toEqual(9);
        let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
        expect(eventWrapperList.length).toEqual(8);
        expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
        let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
        expect(moreIndicatorList.length).toEqual(2);
    });
});

describe('Schedule month view appointment template checking', () => {
    let schObj: Schedule;
    let appTmpl: string = '<span>${Subject}</span>';
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        schObj = new Schedule({
            currentView: 'Month',
            height: '550px',
            width: '500px',
            selectedDate: new Date(2017, 10, 6),
            eventSettings: {
                dataSource: testData,
                template: appTmpl
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

    it('elements in DOM', () => {
        let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
        expect(eventElementList.length).toEqual(9);
        let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
        expect(eventWrapperList.length).toEqual(8);
        expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
        let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
        expect(moreIndicatorList.length).toEqual(2);
        expect(eventElementList[0].querySelector('.e-appointment-details').innerHTML)
            .toEqual('<span>Spanned - Greater than 24 hour</span><div class="e-indicator e-icons e-right-icon"></div>');
    });
    it('change event template through setmodel', (done: Function) => {
        let dataBound: (args: Object) => void = (args: Object) => {
            let eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            expect(eventElementList.length).toEqual(9);
            let eventWrapperList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment-wrapper'));
            expect(eventWrapperList.length).toEqual(8);
            expect((closest(eventElementList[0], '.e-work-cells') as HTMLTableCellElement).cellIndex).toEqual(3);
            let moreIndicatorList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-more-indicator'));
            expect(moreIndicatorList.length).toEqual(2);
            expect(eventElementList[0].querySelector('.e-appointment-details').innerHTML)
                .toEqual('<span class="event-template">Spanned - Greater than 24 hour</span>' +
                    '<div class="e-indicator e-icons e-right-icon"></div>');
            done();
        }
        schObj.eventSettings.template = '<span class="event-template">${Subject}</span>';
        schObj.dataBound = dataBound;
        schObj.dataBind();
    });
});

describe('EJ2-11284 Events start and end on same time', () => {
    let schObj: Schedule;
    let elem: HTMLElement = createElement('div', { id: 'Schedule' });
    beforeAll((done: Function) => {
        let dataBound: EmitType<Object> = () => { done(); };
        document.body.appendChild(elem);
        schObj = new Schedule({
            height: '550px', selectedDate: new Date(2017, 10, 2),
            currentView: 'Month',
            eventSettings: {
                dataSource: [
                    {
                        Id: 1,
                        Subject: 'Normal event',
                        StartTime: new Date(2017, 10, 2, 10),
                        EndTime: new Date(2017, 10, 2, 10)
                    }, {
                        Id: 2,
                        Subject: 'Recurrence event',
                        StartTime: new Date(2017, 10, 3, 10),
                        EndTime: new Date(2017, 10, 3, 10),
                        RecurrenceRule: 'FREQ=DAILY;INTERVAL=1;COUNT=5'
                    }]
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

    it('appointment element present in DOM', () => {
        expect(schObj.element.querySelectorAll('.e-content-wrap .e-appointment').length).toEqual(6);
    });
});
