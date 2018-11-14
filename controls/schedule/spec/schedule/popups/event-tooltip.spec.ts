/**
 * Schedule event tooltip spec 
 */
import { createElement, remove, EmitType, isVisible } from '@syncfusion/ej2-base';
import { Tooltip } from '@syncfusion/ej2-popups';
import { Schedule, Day, Week, WorkWeek, Month, Agenda, TimelineViews } from '../../../src/schedule/index';
import { defaultData, tooltipData, resourceData, cloneDataSource } from '../base/datasource.spec';
import { triggerMouseEvent } from '../util.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, TimelineViews);
describe('Schedule event tooltip module', () => {
    describe('Event tooltip on default content', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                selectedDate: new Date(2018, 0, 1),
                currentView: 'Month',
                eventSettings: {
                    enableTooltip: true,
                    dataSource: tooltipData,
                    fields: {
                        subject: { name: 'Subject', default: 'No Title' }
                    }
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            let schEventTooltipObj: Tooltip = ((schObj.eventTooltip as any).tooltipObj as Tooltip);
            schEventTooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
            schEventTooltipObj.dataBind();
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('mouse hover open tooltip - check for single day appointment', () => {
            let target: HTMLElement = [].slice.call(elem.querySelectorAll('.e-appointment'))[1];
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-subject').innerHTML).toBe('Normal Event');
            expect(tooltipEle.querySelector('.e-location').innerHTML).toBe('');
            expect(tooltipEle.querySelector('.e-details').innerHTML).toBe('January 3, 2018');
            expect(tooltipEle.querySelector('.e-all-day').innerHTML).toBe('10:00 AM - 11:00 AM');
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });

        it('mouse hover open tooltip- check for single all day appointment', () => {
            let target: HTMLElement = [].slice.call(elem.querySelectorAll('.e-appointment'))[2];
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-subject').innerHTML).toBe('Normal Spanned Event');
            expect(tooltipEle.querySelector('.e-details').innerHTML).toBe('Jan 4 - Jan 5, 2018');
            expect(tooltipEle.querySelector('.e-all-day').innerHTML).toBe('10:00 AM - 9:30 AM');
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });

        it('mouse hover open tooltip- check for multiple all day appointment', () => {
            let target: HTMLElement = [].slice.call(elem.querySelectorAll('.e-appointment'))[0];
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-subject').innerHTML).toBe('No Title');
            expect(tooltipEle.querySelector('.e-location').innerHTML).toBe('Chennai');
            expect(tooltipEle.querySelector('.e-details').innerHTML).toBe('Dec 31, 2017 - Jan 1, 2018');
            expect(tooltipEle.querySelector('.e-all-day').innerHTML).toBe('10:00 AM - 11:30 AM');
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });

        it('mouse hover open tooltip- check for long day appointment', () => {
            let target: HTMLElement = [].slice.call(elem.querySelectorAll('.e-appointment'))[4];
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-subject').innerHTML).toBe('AllDay Spanned Event');
            expect(tooltipEle.querySelector('.e-details').innerHTML).toBe('Jan 6 - Jan 8, 2018');
            expect(tooltipEle.querySelector('.e-all-day').innerHTML).toBe('10:00 AM - 10:30 AM');
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });

        it('mouse hover open tooltip- check default subject', () => {
            let target: HTMLElement = [].slice.call(elem.querySelectorAll('.e-appointment'))[0];
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-subject').innerHTML).toBe('No Title');
            expect(tooltipEle.querySelector('.e-details').innerHTML).toBe('Dec 31, 2017 - Jan 1, 2018');
            expect(tooltipEle.querySelector('.e-all-day').innerHTML).toBe('10:00 AM - 11:30 AM');
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });

        it('mouse hover open and click appointment to open quickinfo window', () => {
            let target: HTMLElement = [].slice.call(elem.querySelectorAll('.e-appointment'))[2];
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            target.click();
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper');
            expect(eventPopup).toBeTruthy();
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });
    });

    describe('Event tooltip on template content', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                width: '500px',
                selectedDate: new Date(2017, 10, 6),
                eventSettings: {
                    dataSource: cloneDataSource(defaultData),
                    enableTooltip: true,
                    tooltipTemplate: '<div class="event-template" style="padding:5px;"><div>Subject : ${Subject}</div></div>'
                },
                dataBound: dataBound
            });
            schObj.appendTo('#Schedule');
            let schEventTooltipObj: Tooltip = ((schObj.eventTooltip as any).tooltipObj as Tooltip);
            schEventTooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
            schEventTooltipObj.dataBind();
        });
        afterAll(() => {
            if (schObj) {
                schObj.destroy();
            }
            remove(elem);
        });

        it('mouse hover open tooltip', () => {
            let target: HTMLElement = elem.querySelector('.e-appointment');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect([].slice.call(tooltipEle.querySelectorAll('.event-template')).length).toEqual(1);
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });
        it('change tooltip template through set model', () => {
            schObj.eventSettings.tooltipTemplate = '<div class="event-template1" style="padding:5px;">Subject : ${Subject}</div>';
            schObj.dataBind();
            let target: HTMLElement = elem.querySelector('.e-appointment');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect([].slice.call(tooltipEle.querySelectorAll('.event-template')).length).toEqual(0);
            expect([].slice.call(tooltipEle.querySelectorAll('.event-template1')).length).toEqual(1);
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });
    });

    describe('Disable/Enable Event tooltip', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        beforeAll((done: Function) => {
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            schObj = new Schedule({
                height: '500px',
                width: '500px',
                selectedDate: new Date(2017, 10, 6),
                eventSettings: {
                    dataSource: defaultData,
                    enableTooltip: false
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

        it('hide tooltip on mouse hover', () => {
            let target: HTMLElement = elem.querySelector('.e-appointment');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });
        it('show tooltip through set model on mouse hover', () => {
            schObj.eventSettings.enableTooltip = true;
            schObj.dataBind();
            let schEventTooltipObj: Tooltip = ((schObj.eventTooltip as any).tooltipObj as Tooltip);
            schEventTooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
            schEventTooltipObj.dataBind();
            let target: HTMLElement = elem.querySelector('.e-appointment');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });
        it('hide tooltip through set model on mouse hover', () => {
            schObj.eventSettings.enableTooltip = false;
            schObj.dataBind();
            let target: HTMLElement = elem.querySelector('.e-appointment');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });
    });
    describe('Resource tooltip on template content', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let tooltipTemplate: string = '<div class="tWrap"><div class="rText">Name: ${getResourceName(data)}</div></div>';
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%',
                currentView: 'TimelineDay',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                group: {
                    byGroupID: false,
                    headerTooltipTemplate: tooltipTemplate,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85', Expand: false }
                        ],
                        textField: 'RoomText', idField: 'Id', colorField: 'RoomColor', expandedField: 'Expand'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                    }
                ],
                selectedDate: new Date(2017, 10, 1),
                eventSettings: { dataSource: [] },
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
        it('mouse hover open tooltip', () => {
            let schEventTooltipObj: Tooltip = ((schObj.eventTooltip as any).tooltipObj as Tooltip);
            schEventTooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
            schEventTooltipObj.dataBind();
            let target: HTMLElement = elem.querySelector('.e-resource-cells');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect([].slice.call(tooltipEle.querySelectorAll('.tWrap')).length).toEqual(1);
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });
        it('change tooltip template through set model', () => {
            schObj.group.headerTooltipTemplate = '<div class="event-template1" style="padding:5px;">Name: ${getResourceName(data)}</div>';
            schObj.dataBind();
            let target: HTMLElement = elem.querySelector('.e-resource-cells');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect([].slice.call(tooltipEle.querySelectorAll('.tWrap')).length).toEqual(0);
            expect([].slice.call(tooltipEle.querySelectorAll('.event-template1')).length).toEqual(1);
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });
    });
    describe('Timeline resource header and event tooltip', () => {
        let schObj: Schedule;
        let elem: HTMLElement = createElement('div', { id: 'Schedule' });
        let headerTooltipTemplate: string = '<div class="resname">Name: ${getResourceName(data)}</div>';
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            schObj = new Schedule({
                height: '550px', width: '100%',
                currentView: 'TimelineDay',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek'],
                group: {
                    byGroupID: false,
                    headerTooltipTemplate: headerTooltipTemplate,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85', Expand: false }
                        ],
                        textField: 'RoomText', idField: 'Id', colorField: 'RoomColor', expandedField: 'Expand'
                    },
                    {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                    }
                ],
                selectedDate: new Date(2018, 3, 1),
                eventSettings: {
                    dataSource: cloneDataSource(resourceData),
                    enableTooltip: true
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
        it('tooltip on resource header', () => {
            let schEventTooltipObj: Tooltip = ((schObj.eventTooltip as any).tooltipObj as Tooltip);
            schEventTooltipObj.animation = { open: { effect: 'None' }, close: { effect: 'None' } };
            schEventTooltipObj.dataBind();
            let target: HTMLElement = elem.querySelector('.e-resource-cells');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect([].slice.call(tooltipEle.querySelectorAll('.resname')).length).toEqual(1);
            expect(tooltipEle.innerHTML).toEqual('<div class="e-tip-content"><div><div class="resname">Name: ROOM 1</div></div></div>');
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });
        it('tooltip on appointment', () => {
            let targets: HTMLElement[] = [].slice.call(elem.querySelectorAll('.e-appointment'));
            expect(targets.length).toEqual(2);
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
            triggerMouseEvent(targets[1], 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-schedule-event-tooltip') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-subject').innerHTML).toBe('Michael');
            expect(tooltipEle.querySelector('.e-location').innerHTML).toBe('');
            expect(tooltipEle.querySelector('.e-details').innerHTML).toBe('April 1, 2018');
            expect(tooltipEle.querySelector('.e-all-day').innerHTML).toBe('10:00 AM - 12:30 PM');
            triggerMouseEvent(targets[1], 'mouseleave');
            expect(document.querySelector('.e-schedule-event-tooltip')).toBeNull();
        });
    });
});
