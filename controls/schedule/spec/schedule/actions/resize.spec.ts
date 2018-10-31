/**
 * Event resize action spec 
 */
import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda } from '../../../src/schedule/index';
import { TimelineViews, TimelineMonth, ResizeEventArgs, Resize } from '../../../src/schedule/index';
import { dragResizeData, resourceGroupData, timelineData, defaultData } from '../base/datasource.spec';
import { triggerMouseEvent } from '../util.spec';
import * as util from '../util.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth, Resize);

xdescribe('Vertical view events resizing', () => {
    describe('Default schedule events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { width: '500px', height: '500px', selectedDate: new Date(2018, 6, 5) };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('resizeStart event', () => {
            schObj.resizeStart = (args: ResizeEventArgs) => args.cancel = true;
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"] .e-bottom-handler') as HTMLElement;
            triggerMouseEvent(resizeElement, 'mousedown');
        });

        it('resizeStop event', () => {
            schObj.resizeStart = (args: ResizeEventArgs) => args.cancel = false;
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = true;
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"] .e-bottom-handler') as HTMLElement;
            triggerMouseEvent(resizeElement, 'mousedown');
            triggerMouseEvent(resizeElement, 'mousemove', 0, 25);
            expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(1);
            triggerMouseEvent(resizeElement, 'mousemove', 0, 25);
            triggerMouseEvent(resizeElement, 'mousemove', 0, 50);
            triggerMouseEvent(resizeElement, 'mousemove', 0, 50);
            triggerMouseEvent(resizeElement, 'mouseup');
        });

        it('bottom resizing', (done: Function) => {
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 10, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(720);
                expect(resizeElement.offsetHeight).toEqual(180);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-bottom-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(720);
            expect(resizeElement.offsetHeight).toEqual(108);
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-clone-time-indicator').length).toEqual(0);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('top resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 9, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(648);
                expect(resizeElement.offsetHeight).toEqual(252);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-top-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(720);
            expect(resizeElement.offsetHeight).toEqual(180);
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -25);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-clone-time-indicator').length).toEqual(0);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -50);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('right resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(110);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(53);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(110);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(110);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('recurrence event bottom resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData.slice(-1)[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 11, 15).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 13).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_11"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(810);
                expect(resizeElement.offsetHeight).toEqual(126);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-bottom-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(810);
            expect(resizeElement.offsetHeight).toEqual(90);
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('different resizing interval checking', (done: Function) => {
            schObj.resizeStart = (args: ResizeEventArgs) => args.interval = 45;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 9, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 13).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(648);
                expect(resizeElement.offsetHeight).toEqual(288);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-bottom-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(648);
            expect(resizeElement.offsetHeight).toEqual(252);
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -50);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -100);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -100);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('month view events resizing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { width: '500px', height: '500px', currentView: 'Month', selectedDate: new Date(2018, 6, 5) };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('right resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 11, 30).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_1"]')).offsetWidth).toEqual(139);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(68);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 11, 30).getTime());
                expect((schObj.element.querySelectorAll('[data-id="Appointment_1"]').length)).toEqual(0);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(139);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('event resizing checking with firstDayOfWeek property', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 1;
            schObj.dataBind();
        });

        it('left resizing with firstDayOfWeek property', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[9] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 7, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 8, 11).getTime());
                expect(schObj.element.querySelectorAll('[data-id="Appointment_10"]').length).toEqual(1);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_10"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(210);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 100, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 100, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('right resizing with firstDayOfWeek property', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[2] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 3, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 12, 30).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_3"]')).offsetWidth).toEqual(139);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(68);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('showWeekend property', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.showWeekend = false;
            schObj.dataBind();
        });

        it('left resizing with showWeekend property', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[2] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 12, 30).getTime());
                expect(schObj.element.querySelectorAll('[data-id="Appointment_3"]').length).toEqual(0);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(195);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('right resizing with showWeekend property', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(195);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(96);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('Resource grouping schedule events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px',
                height: '500px',
                selectedDate: new Date(2018, 6, 5),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [{
                    field: 'RoomId', name: 'Rooms',
                    dataSource: [
                        { Text: 'Room 1', Id: 1, Color: '#ffaa00' },
                        { Text: 'Room 2', Id: 2, Color: '#f8a398' }
                    ]
                }, {
                    field: 'OwnerId', name: 'Owners',
                    dataSource: [
                        { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                        { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                        { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }
                    ]
                }]
            };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('resizeStart event', () => {
            schObj.resizeStart = (args: ResizeEventArgs) => args.cancel = true;
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"] .e-bottom-handler') as HTMLElement;
            triggerMouseEvent(resizeElement, 'mousedown');
        });

        it('resizeStop event', () => {
            schObj.resizeStart = (args: ResizeEventArgs) => args.cancel = false;
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = true;
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"] .e-bottom-handler') as HTMLElement;
            triggerMouseEvent(resizeElement, 'mousedown');
            triggerMouseEvent(resizeElement, 'mousemove', 0, 50);
            expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(1);
            triggerMouseEvent(resizeElement, 'mousemove', 0, 50);
            triggerMouseEvent(resizeElement, 'mousemove', 0, 100);
            triggerMouseEvent(resizeElement, 'mousemove', 0, 100);
            triggerMouseEvent(resizeElement, 'mouseup');
        });

        it('bottom resizing', (done: Function) => {
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[4] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 5, 10, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 5, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(756);
                expect(resizeElement.offsetHeight).toEqual(144);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-bottom-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(756);
            expect(resizeElement.offsetHeight).toEqual(72);
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(1);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('top resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 9, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 11, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(648);
                expect(resizeElement.offsetHeight).toEqual(180);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-top-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(720);
            expect(resizeElement.offsetHeight).toEqual(108);
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -25);
            expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(1);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -50);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('right resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 5).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(105);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(33);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[8] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 6).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_9"]')).offsetWidth).toEqual(69);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(69);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('month view changing', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('right resizing in month view', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 8).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(213);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(105);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 105, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 105, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing in month view', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 8).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(141);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(213);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 105, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 105, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('showWeekend property', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.showWeekend = false;
            schObj.dataBind();
        });

        it('left resizing with firstDayOfWeek property', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 5).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 8).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(69);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(105);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 75, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 75, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('right resizing with firstDayOfWeek property', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[8] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 5).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_9"]')).offsetWidth).toEqual(33);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(69);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('Resource grouping - allowGroupEdit schedule events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px',
                height: '500px',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    allowGroupEdit: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: true,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                        ],
                        textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                    }, {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                            { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                            { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                        ],
                        textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                    }
                ]
            };
            schObj = util.createSchedule(schOptions, resourceGroupData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('bottom resizing', (done: Function) => {
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 1, 10, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 1, 13, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(720);
                expect(resizeElement.offsetHeight).toEqual(252);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-bottom-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(720);
            expect(resizeElement.offsetHeight).toEqual(180);
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            let cloneElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-resize-clone'));
            expect(cloneElement.length).toEqual(3);
            cloneElement.forEach((element: HTMLElement) => expect(element).toBeTruthy());
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('top resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 1, 11, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 1, 13, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(792);
                expect(resizeElement.offsetHeight).toEqual(180);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-top-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(720);
            expect(resizeElement.offsetHeight).toEqual(252);
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            let cloneElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-resize-clone'));
            expect(cloneElement.length).toEqual(3);
            cloneElement.forEach((element: HTMLElement) => expect(element).toBeTruthy());
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 100);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 100);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('month view changing', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('right resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 1, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 4, 13, 30).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_1"]')).offsetWidth).toEqual(141);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(33);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-resize-clone'));
            expect(cloneElement.length).toEqual(3);
            cloneElement.forEach((element: HTMLElement) => {
                expect(element).toBeTruthy();
                expect(element.offsetHeight).toEqual(22);
            });
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 100, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 100, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 2, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 4, 13, 30).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_1"]')).offsetWidth).toEqual(105);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(141);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-resize-clone'));
            expect(cloneElement.length).toEqual(3);
            cloneElement.forEach((element: HTMLElement) => {
                expect(element).toBeTruthy();
                expect(element.offsetHeight).toEqual(22);
            });
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('RTL mode event resizing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { width: '500px', height: '500px', enableRtl: true, selectedDate: new Date(2018, 6, 5) };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('bottom resizing', (done: Function) => {
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 10, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(720);
                expect(resizeElement.offsetHeight).toEqual(180);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-bottom-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(720);
            expect(resizeElement.offsetHeight).toEqual(108);
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('top resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 9, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(648);
                expect(resizeElement.offsetHeight).toEqual(252);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-top-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(720);
            expect(resizeElement.offsetHeight).toEqual(180);
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -25);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -50);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('right resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(53);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(53);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(110);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(53);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('Timescale disable mode event resizing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px', height: '500px',
                selectedDate: new Date(2018, 6, 5), timeScale: { enable: false }
            };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('left resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[8] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 5).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 6).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_9"]')).offsetWidth).toEqual(68);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(139);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(54);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('right resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(139);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(68);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(54);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('change firstDayOfWeek property value', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 2;
            schObj.dataBind();
        });

        it('right resizing with firstDayOfWeek property', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 5).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(139);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(68);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(54);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing with firstDayOfWeek property', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[9] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 8, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 8, 11).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_10"]')).offsetWidth).toEqual(68);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_10"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(210);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(54);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('Adaptive mode event resizing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { width: 300, height: 500, selectedDate: new Date(2018, 6, 5) };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('bottom resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 10, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(720);
                expect(resizeElement.offsetHeight).toEqual(180);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-bottom-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(720);
            expect(resizeElement.offsetHeight).toEqual(108);
            schObj.isAdaptive = true;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let timeIndicator: HTMLElement = schObj.element.querySelector('.e-clone-time-indicator') as HTMLElement;
            expect(timeIndicator).toBeTruthy();
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, 50);
            expect(timeIndicator.offsetTop).toEqual(900);
            schObj.isAdaptive = false;
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('top resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 9, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetTop).toEqual(648);
                expect(resizeElement.offsetHeight).toEqual(252);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-top-handler') as HTMLElement;
            expect(resizeElement.offsetTop).toEqual(720);
            expect(resizeElement.offsetHeight).toEqual(180);
            schObj.isAdaptive = true;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -25);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let timeIndicator: HTMLElement = schObj.element.querySelector('.e-clone-time-indicator') as HTMLElement;
            expect(timeIndicator).toBeTruthy();
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -25);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -50);
            triggerMouseEvent(resizeHandler, 'mousemove', 0, -50);
            expect(timeIndicator.offsetTop).toEqual(648);
            schObj.isAdaptive = false;
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(33);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(33);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            schObj.isAdaptive = true;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -50, 0);
            schObj.isAdaptive = false;
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('right resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 5).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_8"]')).offsetWidth).toEqual(105);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(33);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            schObj.isAdaptive = true;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(22);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            schObj.isAdaptive = false;
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });
});

xdescribe('Timeline view events resizing', () => {
    describe('Default schedule events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px', height: '500px', selectedDate: new Date(2018, 4, 1),
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth']
            };
            schObj = util.createSchedule(schOptions, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('resizeStart event', () => {
            schObj.resizeStart = (args: ResizeEventArgs) => args.cancel = true;
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_11"] .e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeElement, 'mousedown');
        });

        it('resizeStop event', () => {
            schObj.resizeStart = (args: ResizeEventArgs) => args.cancel = false;
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = true;
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_11"] .e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeElement, 'mousedown');
            triggerMouseEvent(resizeElement, 'mousemove', -25, 0);
            expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(1);
            triggerMouseEvent(resizeElement, 'mousemove', -25, 0);
            triggerMouseEvent(resizeElement, 'mousemove', -50, 0);
            triggerMouseEvent(resizeElement, 'mousemove', -50, 0);
            triggerMouseEvent(resizeElement, 'mouseup');
        });

        it('right resizing', (done: Function) => {
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 13).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_1"]')).offsetWidth).toEqual(300);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(250);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetTop).toEqual(202);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 11, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 13).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_1"]')).offsetWidth).toEqual(150);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(300);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetTop).toEqual(202);
            triggerMouseEvent(resizeHandler, 'mousemove', 50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('month view events resizing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px', height: '500px', currentView: 'TimelineMonth', selectedDate: new Date(2018, 4, 1),
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth']
            };
            schObj = util.createSchedule(schOptions, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('right resizing', (done: Function) => {
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetWidth).toEqual(210);
                expect(resizeElement.offsetTop).toEqual(202);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(70);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetTop).toEqual(202);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 75, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 75, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing at left end side', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetWidth).toEqual(210);
                expect(resizeElement.offsetTop).toEqual(202);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(210);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetTop).toEqual(202);
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -50, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -50, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 2, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetWidth).toEqual(140);
                expect(resizeElement.offsetTop).toEqual(2);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(210);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetTop).toEqual(202);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 100, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 100, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('RTL mode events resizing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px', height: '500px', enableRtl: true, selectedDate: new Date(2018, 4, 1),
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth']
            };
            schObj = util.createSchedule(schOptions, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('right resizing', (done: Function) => {
            schObj.element.querySelector('.e-content-wrap').scrollLeft = 750;
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[10] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 13).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 15).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_11"]') as HTMLElement;
                expect(resizeElement.offsetWidth).toEqual(200);
                expect(resizeElement.offsetTop).toEqual(2);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_11"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(100);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetTop).toEqual(2);
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -75, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -75, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing', (done: Function) => {
            schObj.element.querySelector('.e-content-wrap').scrollLeft = 750;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[12] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 12).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 14).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_13"]') as HTMLElement;
                expect(resizeElement.offsetWidth).toEqual(200);
                expect(resizeElement.offsetTop).toEqual(2);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_13"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(100);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetTop).toEqual(122);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 75, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 75, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('Resource Grouping Header bar customization', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px',
                height: '500px',
                selectedDate: new Date(2017, 10, 1),
                currentView: 'TimelineWeek',
                headerRows: [
                    { option: 'Year' },
                    { option: 'Month' },
                    { option: 'Week' }
                ],
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth']
            };
            schObj = util.createSchedule(schOptions, defaultData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('right resizing', (done: Function) => {
            schObj.resizeStop = (args: ResizeEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2017, 9, 29, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2017, 9, 31, 11, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetWidth).toEqual(213);
                expect(resizeElement.offsetTop).toEqual(2);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(71);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetTop).toEqual(2);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2017, 9, 29, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2017, 9, 31, 11, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(resizeElement.offsetWidth).toEqual(213);
                expect(resizeElement.offsetTop).toEqual(2);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(213);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(213);
            expect(cloneElement.offsetTop).toEqual(2);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 75, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 75, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('month view testing', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });

        it('header rows setmodel', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.headerRows = [
                { option: 'Date' },
                { option: 'Hour' }
            ];
            schObj.dataBind();
        });

        it('right resizing in month view', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[8] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2017, 10, 2, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2017, 10, 4, 12, 30).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
                expect(resizeElement.offsetWidth).toEqual(210);
                expect(resizeElement.offsetTop).toEqual(2);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(70);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(140);
            expect(cloneElement.offsetTop).toEqual(2);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 75, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 75, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('left resizing in month view', (done: Function) => {
            schObj.resizeStart = (args: ResizeEventArgs) => args.scroll.enable = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[11] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2017, 10, 4, 9, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2017, 10, 5, 5, 45).getTime());
                let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_12"]') as HTMLElement;
                expect(resizeElement.offsetWidth).toEqual(140);
                expect(resizeElement.offsetTop).toEqual(42);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_12"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(140);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(140);
            expect(cloneElement.offsetTop).toEqual(42);
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -75, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -75, 0);
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });

    describe('Adaptive mode event resizing', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px', height: '500px', selectedDate: new Date(2018, 6, 1),
                currentView: 'TimelineWeek',
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth']
            };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('left resizing', (done: Function) => {
            schObj.element.querySelector('.e-content-wrap').scrollLeft = 800;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-clone-time-indicator').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 8, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 11, 30).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_1"]')).offsetWidth).toEqual(300);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(150);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-left-handler') as HTMLElement;
            schObj.isAdaptive = true;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let timeIndicator: HTMLElement = schObj.element.querySelector('.e-clone-time-indicator') as HTMLElement;
            expect(timeIndicator).toBeTruthy();
            expect(cloneElement.offsetWidth).toEqual(200);
            expect(cloneElement.offsetHeight).toEqual(38);
            triggerMouseEvent(resizeHandler, 'mousemove', -25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -100, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', -100, 0);
            expect(timeIndicator.offsetLeft).toEqual(850);
            schObj.isAdaptive = false;
            triggerMouseEvent(resizeHandler, 'mouseup');
        });

        it('right resizing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-resize-clone').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-clone-time-indicator').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 8, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 13).getTime());
                expect((<HTMLElement>schObj.element.querySelector('[data-id="Appointment_1"]')).offsetWidth).toEqual(450);
                done();
            };
            let resizeElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(resizeElement.offsetWidth).toEqual(300);
            let resizeHandler: HTMLElement = resizeElement.querySelector('.e-right-handler') as HTMLElement;
            schObj.isAdaptive = true;
            triggerMouseEvent(resizeHandler, 'mousedown');
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-resize-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let timeIndicator: HTMLElement = schObj.element.querySelector('.e-clone-time-indicator') as HTMLElement;
            expect(timeIndicator).toBeTruthy();
            expect(cloneElement.offsetWidth).toEqual(350);
            expect(cloneElement.offsetHeight).toEqual(38);
            triggerMouseEvent(resizeHandler, 'mousemove', 25, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            triggerMouseEvent(resizeHandler, 'mousemove', 150, 0);
            expect(timeIndicator.offsetLeft).toEqual(1300);
            schObj.isAdaptive = false;
            triggerMouseEvent(resizeHandler, 'mouseup');
        });
    });
});