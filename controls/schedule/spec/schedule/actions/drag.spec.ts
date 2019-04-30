/**
 * Event drag action spec
 */
import { Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth, DragEventArgs, DragAndDrop }
    from '../../../src/schedule/index';
import { dragResizeData, resourceGroupData, timelineData, timelineResourceData } from '../base/datasource.spec';
import { triggerMouseEvent } from '../util.spec';
import * as util from '../util.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth, DragAndDrop);

xdescribe('Vertical view events dragging', () => {
    describe('Normal events', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { width: '500px', height: '500px', selectedDate: new Date(2018, 6, 5) };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('dragStart event', () => {
            schObj.dragStart = (args: DragEventArgs) => args.cancel = true;
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown');
        });

        it('dragStop event', () => {
            schObj.dragStart = (args: DragEventArgs) => args.cancel = false;
            schObj.dragStop = (args: DragEventArgs) => args.cancel = true;
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(157) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 100, 50);
            triggerMouseEvent(workCell, 'mousemove', 300, 175);
            triggerMouseEvent(workCell, 'mousemove', 300, 175);
            expect(cloneElement.offsetTop).toEqual(792);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(57);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Normal event dragging', (done: Function) => {
            schObj.dragStop = (args: DragEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 12, 30).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(792);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(26);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(720);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(53);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(157) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 175);
            triggerMouseEvent(workCell, 'mousemove', 300, 175);
            expect(cloneElement.offsetTop).toEqual(792);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(57);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Recurrence event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[10] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 7, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 7, 12, 15).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_11"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(792);
                expect(dragElement.offsetHeight).toEqual(90);
                expect(dragElement.offsetWidth).toEqual(26);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(810);
            expect(dragElement.offsetHeight).toEqual(90);
            expect(dragElement.offsetWidth).toEqual(53);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 150);
            triggerMouseEvent(dragElement, 'mousemove', 100, 150);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(160) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 600, 175);
            triggerMouseEvent(workCell, 'mousemove', 600, 175);
            expect(cloneElement.offsetTop).toEqual(792);
            expect(cloneElement.offsetHeight).toEqual(90);
            expect(cloneElement.offsetWidth).toEqual(56);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('All day event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(62);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(53);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(62);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(53);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 130, 0);
            triggerMouseEvent(dragElement, 'mousemove', 130, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-wrap .e-all-day-cells').item(2) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 235, 0);
            triggerMouseEvent(workCell, 'mousemove', 235, 0);
            expect(cloneElement.offsetTop).toEqual(60);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(57);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Longer event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[8] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 5).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 7).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(62);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(108);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(62);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(110);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-wrap .e-all-day-cells').item(4) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 410, 0);
            triggerMouseEvent(workCell, 'mousemove', 410, 0);
            expect(cloneElement.offsetTop).toEqual(60);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(57);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Enable Time scale mode', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.timeScale = { interval: 120, slotCount: 4 };
            schObj.firstDayOfWeek = 3;
            schObj.dataBind();
        });

        it('Normal event dragging in time scale', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[3] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 7, 9, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 7, 11, 30).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(684);
                expect(dragElement.offsetHeight).toEqual(144);
                expect(dragElement.offsetWidth).toEqual(17);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(648);
            expect(dragElement.offsetHeight).toEqual(144);
            expect(dragElement.offsetWidth).toEqual(53);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(136) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 175);
            triggerMouseEvent(workCell, 'mousemove', 300, 175);
            expect(cloneElement.offsetTop).toEqual(684);
            expect(cloneElement.offsetHeight).toEqual(144);
            expect(cloneElement.offsetWidth).toEqual(57);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Disable Time scale mode', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 0;
            schObj.timeScale = { enable: false };
            schObj.dataBind();
        });

        it('Normal event dragging in time scale', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[6] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 1, 30).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(54);
                expect(dragElement.offsetWidth).toEqual(70);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(112);
            expect(dragElement.offsetHeight).toEqual(54);
            expect(dragElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 600, 0);
            triggerMouseEvent(dragElement, 'mousemove', -300, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(1) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', -300, 0);
            triggerMouseEvent(workCell, 'mousemove', -300, 0);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(54);
            expect(cloneElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Enable RTL mode', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = true;
            schObj.timeScale = { enable: true, interval: 60, slotCount: 2 };
            schObj.dataBind();
        });

        it('Event dragging in RTL', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 11, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 13).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(828);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(26);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(792);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(26);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', 300, 175);
            triggerMouseEvent(dragElement, 'mousemove', 300, 175);
            expect(cloneElement.offsetTop).toEqual(828);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(57);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Longer event (all day) dragging in RTL', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[8] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(62);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(110);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(62);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(108);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 50, 0);
            triggerMouseEvent(dragElement, 'mousemove', 50, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-wrap .e-all-day-cells').item(0) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 0);
            triggerMouseEvent(workCell, 'mousemove', 300, 0);
            expect(cloneElement.offsetTop).toEqual(60);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(57);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Longer event dragging in RTL', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[9] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 6, 1).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_10"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(62);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(167);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_10"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(62);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(112);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 50, 0);
            triggerMouseEvent(dragElement, 'mousemove', 50, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-wrap .e-all-day-cells').item(3) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 240, 0);
            triggerMouseEvent(workCell, 'mousemove', 240, 0);
            expect(cloneElement.offsetTop).toEqual(60);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(57);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Month view changing', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('Month event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[3] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 20, 9, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 20, 11, 30).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(70);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 0, 110);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(19) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 0, 225);
            triggerMouseEvent(workCell, 'mousemove', 0, 225);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(72);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Disabling RTL mode', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = false;
            schObj.dataBind();
        });

        it('Month event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[3] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 24, 9, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 24, 11, 30).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(70);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 500, 110);
            triggerMouseEvent(dragElement, 'mousemove', 500, 110);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(23) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 500, 325);
            triggerMouseEvent(workCell, 'mousemove', 500, 325);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });

    describe('Vertical view events dragging for resourcs', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px', height: '500px', selectedDate: new Date(2018, 6, 5),
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

        it('Normal event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 12, 30).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(792);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(720);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(469) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 350);
            triggerMouseEvent(workCell, 'mousemove', 300, 350);
            expect(cloneElement.offsetTop).toEqual(792);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('All day event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(142);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(142);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 130, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-wrap .e-all-day-cells').item(9) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 240, 0);
            triggerMouseEvent(workCell, 'mousemove', 240, 0);
            expect(cloneElement.offsetTop).toEqual(140);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 4;
            schObj.timeScale = { interval: 120, slotCount: 4 };
            schObj.dataBind();
        });

        it('Normal event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[6] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 5, 11, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 5, 12, 30).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(792);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(11);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[6] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(792);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(469) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 350);
            triggerMouseEvent(workCell, 'mousemove', 300, 350);
            expect(cloneElement.offsetTop).toEqual(792);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.timeScale = { enable: false };
            schObj.dataBind();
        });

        it('All day event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[6] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 7).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 7, 1, 30).getTime());
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(1);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(54);
                expect(dragElement.offsetWidth).toEqual(35);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[6] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(3);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(112);
            expect(dragElement.offsetHeight).toEqual(54);
            expect(dragElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', -50, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(2) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', -240, 0);
            triggerMouseEvent(workCell, 'mousemove', -240, 0);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(54);
            expect(cloneElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 0;
            schObj.timeScale = { enable: true, interval: 60, slotCount: 2 };
            schObj.dataBind();
        });

        it('Enabling RTL mode', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = true;
            schObj.dataBind();
        });

        it('Normal event dragging in RTL mode', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 8, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 10).getTime());
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(1);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(612);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(3);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(792);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(378) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 125);
            triggerMouseEvent(workCell, 'mousemove', 300, 125);
            expect(cloneElement.offsetTop).toEqual(612);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Disabling RTL mode', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = false;
            schObj.dataBind();
        });

        it('Month view changing', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.showWeekend = false;
            schObj.dataBind();
        });

        it('Month event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[2] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 24, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 24, 12, 45).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(35);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[2] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(2);
            expect(event.RoomId).toEqual(2);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 255, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(51) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 150);
            triggerMouseEvent(workCell, 'mousemove', 300, 150);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('byDate property checking', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.group.byDate = true;
            schObj.showWeekend = true;
            schObj.dragStart = (args: DragEventArgs) => args.interval = 10;
            schObj.currentView = 'Week';
            schObj.dataBind();
        });

        it('byDate grouping normal event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 10, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 12).getTime());
                expect(event.OwnerId).toEqual(2);
                expect(event.RoomId).toEqual(2);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(756);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(612);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(425) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 270, 400);
            triggerMouseEvent(workCell, 'mousemove', 270, 400);
            expect(cloneElement.offsetTop).toEqual(756);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Normal event to all day dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect(event.OwnerId).toEqual(2);
                expect(event.RoomId).toEqual(2);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(142);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(2);
            expect(event.RoomId).toEqual(2);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(756);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 300, 200);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-wrap .e-all-day-cells').item(2) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 200, 100);
            triggerMouseEvent(workCell, 'mousemove', 200, 100);
            expect(cloneElement.offsetTop).toEqual(140);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Enabling RTL mode', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = true;
            schObj.dataBind();
        });

        it('byDate grouping normal event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[3] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 12).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(720);
                expect(dragElement.offsetHeight).toEqual(144);
                expect(dragElement.offsetWidth).toEqual(17);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[3] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(648);
            expect(dragElement.offsetHeight).toEqual(144);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(424) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 200, 100);
            triggerMouseEvent(workCell, 'mousemove', 200, 100);
            expect(cloneElement.offsetTop).toEqual(720);
            expect(cloneElement.offsetHeight).toEqual(144);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 4;
            schObj.timeScale = { enable: true, interval: 120, slotCount: 4 };
            schObj.dataBind();
        });

        it('byDate grouping normal event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[4] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 6, 9, 40).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 6, 10, 40).getTime());
                expect(event.OwnerId).toEqual(2);
                expect(event.RoomId).toEqual(2);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(696);
                expect(dragElement.offsetHeight).toEqual(72);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[4] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(3);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(756);
            expect(dragElement.offsetHeight).toEqual(72);
            expect(dragElement.offsetWidth).toEqual(17);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(425) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 225);
            triggerMouseEvent(workCell, 'mousemove', 300, 225);
            expect(cloneElement.offsetTop).toEqual(696);
            expect(cloneElement.offsetHeight).toEqual(72);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.timeScale = { enable: false };
            schObj.dataBind();
        });

        it('byDate grouping normal event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[4] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 5).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 5, 1).getTime());
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(1);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(54);
                expect(dragElement.offsetWidth).toEqual(35);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[4] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(2);
            expect(event.RoomId).toEqual(2);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(54);
            expect(dragElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(0) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 200, 0);
            triggerMouseEvent(workCell, 'mousemove', 200, 0);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(54);
            expect(cloneElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 0;
            schObj.currentView = 'Month';
            schObj.timeScale = { enable: true, interval: 60, slotCount: 2 };
            schObj.dataBind();
        });

        it('byDate grouping Month event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(1);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(35);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(3);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 10, 100);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(3) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 10, 100);
            triggerMouseEvent(workCell, 'mousemove', 10, 100);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Disabling RTL mode', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = false;
            schObj.dataBind();
        });

        it('byDate grouping Month event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                expect(event.OwnerId).toEqual(2);
                expect(event.RoomId).toEqual(2);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(35);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[7] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(5) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 100, 300);
            triggerMouseEvent(workCell, 'mousemove', 100, 300);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });

    describe('Resource grouping - allowGroupEdit schedule events', () => {
        let schObj: Schedule;
        let getResourceIndex: Function = (element: HTMLElement) => {
            return parseInt(element.getAttribute('data-group-index'), 10);
        };
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px', height: '500px', selectedDate: new Date(2018, 3, 1),
                group: { allowGroupEdit: true, resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: true,
                    dataSource: [
                        { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                        { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
                    ],
                    textField: 'RoomText', idField: 'Id', colorField: 'RoomColor'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' },
                        { OwnerText: 'Michael', Id: 3, OwnerGroupId: 1, OwnerColor: '#7499e1' }
                    ],
                    textField: 'OwnerText', idField: 'Id', groupIDField: 'OwnerGroupId', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, resourceGroupData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Normal event dragging', (done: Function) => {
            schObj.dragStop = (args: DragEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 6, 10, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 6, 13).getTime());
                expect(event.OwnerId.toString()).toEqual('1,2,3');
                expect(event.RoomId.toString()).toEqual('1,2');
                let dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_1"]'));
                dragElements.forEach((dragElement: HTMLElement) => {
                    expect(dragElement.offsetTop).toEqual(756);
                    expect(dragElement.offsetHeight).toEqual(180);
                    expect(dragElement.offsetWidth).toEqual(33);
                    let resourceIndex: number = getResourceIndex(dragElement);
                    let wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                    expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
                });
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect(event.OwnerId.toString()).toEqual('1,2,3');
            expect(event.RoomId.toString()).toEqual('1,2');
            let dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_1"]'));
            dragElements.forEach((dragElement: HTMLElement) => {
                expect(dragElement.offsetTop).toEqual(720);
                expect(dragElement.offsetHeight).toEqual(180);
                expect(dragElement.offsetWidth).toEqual(33);
                let resourceIndex: number = getResourceIndex(dragElement);
                let wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
            });
            triggerMouseEvent(dragElements[0], 'mousedown');
            triggerMouseEvent(dragElements[0], 'mousemove', 100, 250);
            triggerMouseEvent(dragElements[0], 'mousemove', 100, 250);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(446) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 550);
            triggerMouseEvent(workCell, 'mousemove', 300, 550);
            expect(cloneElement.offsetTop).toEqual(756);
            expect(cloneElement.offsetHeight).toEqual(180);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElements[0], 'mouseup');
        });

        it('All day event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[2] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 4).getTime());
                let dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_3"]'));
                dragElements.forEach((dragElement: HTMLElement) => {
                    expect(dragElement.offsetTop).toEqual(142);
                    expect(dragElement.offsetHeight).toEqual(22);
                    expect(dragElement.offsetWidth).toEqual(69);
                    let resourceIndex: number = getResourceIndex(dragElement);
                    let wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                    expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
                });
                done();
            };
            let dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_3"]'));
            dragElements.forEach((dragElement: HTMLElement) => {
                expect(dragElement.offsetTop).toEqual(142);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(69);
                let resourceIndex: number = getResourceIndex(dragElement);
                let wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
            });
            triggerMouseEvent(dragElements[0], 'mousedown');
            triggerMouseEvent(dragElements[0], 'mousemove', 250, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-wrap .e-all-day-cells').item(1) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', -100, 0);
            triggerMouseEvent(workCell, 'mousemove', -100, 0);
            expect(cloneElement.offsetTop).toEqual(140);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElements[0], 'mouseup');
        });

        it('Month view change', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('Month event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 20, 10, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 20, 13).getTime());
                expect(event.OwnerId.toString()).toEqual('1,2,3');
                expect(event.RoomId.toString()).toEqual('1,2');
                let dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_1"]'));
                dragElements.forEach((dragElement: HTMLElement) => {
                    expect(dragElement.offsetTop).toEqual(0);
                    expect(dragElement.offsetHeight).toEqual(22);
                    expect(dragElement.offsetWidth).toEqual(35);
                    let resourceIndex: number = getResourceIndex(dragElement);
                    let wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                    expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
                });
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect(event.OwnerId.toString()).toEqual('1,2,3');
            expect(event.RoomId.toString()).toEqual('1,2');
            let dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_1"]'));
            dragElements.forEach((dragElement: HTMLElement) => {
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(35);
                let resourceIndex: number = getResourceIndex(dragElement);
                let wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
            });
            triggerMouseEvent(dragElements[0], 'mousedown');
            triggerMouseEvent(dragElements[0], 'mousemove', 0, 110);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(47) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 0, 100);
            triggerMouseEvent(workCell, 'mousemove', 0, 100);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElements[0], 'mouseup');
        });

        it('Show week end property', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.showWeekend = false;
            schObj.dataBind();
        });

        it('Month event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[1] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 4, 12).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 4, 13, 30).getTime());
                expect(event.OwnerId.toString()).toEqual('3,2');
                expect(event.RoomId.toString()).toEqual('1,2');
                let dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_2"]'));
                dragElements.forEach((dragElement: HTMLElement) => {
                    expect(dragElement.offsetTop).toEqual(0);
                    expect(dragElement.offsetHeight).toEqual(22);
                    expect(dragElement.offsetWidth).toEqual(35);
                    let resourceIndex: number = getResourceIndex(dragElement);
                    let wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                    expect(wrapperIndex).toEqual((resourceIndex * 5) + (wrapperIndex % 5));
                });
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[1] as { [key: string]: Object };
            expect(event.OwnerId.toString()).toEqual('1,3');
            expect(event.RoomId.toString()).toEqual('1');
            let dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_2"]'));
            dragElements.forEach((dragElement: HTMLElement) => {
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(35);
                let resourceIndex: number = getResourceIndex(dragElement);
                let wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                expect(wrapperIndex).toEqual((resourceIndex * 5) + (wrapperIndex % 5));
            });
            triggerMouseEvent(dragElements[0], 'mousedown');
            triggerMouseEvent(dragElements[0], 'mousemove', 100, 150);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(12) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 130, 250);
            triggerMouseEvent(workCell, 'mousemove', 130, 250);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElements[0], 'mouseup');
        });
    });

    describe('Adaptive mode event dragging', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = { width: 300, height: 500, selectedDate: new Date(2018, 6, 5) };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Normal event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-clone-time-indicator').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 6, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 6, 12, 30).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(792);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(11);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(720);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            schObj.isAdaptive = true;
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(159) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 175);
            triggerMouseEvent(workCell, 'mousemove', 300, 175);
            expect(cloneElement.offsetTop).toEqual(792);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(36);
            let timeIndicator: HTMLElement = schObj.element.querySelector('.e-clone-time-indicator') as HTMLElement;
            expect(timeIndicator).toBeTruthy();
            expect(timeIndicator.offsetTop).toEqual(792);
            expect(timeIndicator.offsetHeight).toEqual(14);
            expect(timeIndicator.offsetWidth).toEqual(85);
            schObj.isAdaptive = false;
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });
});

xdescribe('Timeline view events dragging', () => {
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

        it('dragStart event', () => {
            schObj.dragStart = (args: DragEventArgs) => args.cancel = true;
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown');
        });

        it('dragStop event', () => {
            schObj.dragStart = (args: DragEventArgs) => args.cancel = false;
            schObj.dragStop = (args: DragEventArgs) => args.cancel = true;
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 0);
            expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(1);
            triggerMouseEvent(dragElement, 'mousemove', 100, 0);
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Normal event dragging', (done: Function) => {
            schObj.dragStop = (args: DragEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 13, 30).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(122);
                expect(dragElement.offsetHeight).toEqual(38);
                expect(dragElement.offsetWidth).toEqual(250);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(202);
            expect(dragElement.offsetHeight).toEqual(38);
            expect(dragElement.offsetWidth).toEqual(250);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', 100, 0);
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            expect(cloneElement.offsetTop).toEqual(202);
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(250);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Month view changing', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });

        it('Month event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 13, 30).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(82);
                expect(dragElement.offsetHeight).toEqual(38);
                expect(dragElement.offsetWidth).toEqual(70);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(242);
            expect(dragElement.offsetHeight).toEqual(38);
            expect(dragElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 50, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', 200, 0);
            triggerMouseEvent(dragElement, 'mousemove', 200, 0);
            expect(cloneElement.offsetTop).toEqual(242);
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });

    describe('RTL mode events dragging', () => {
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

        it('Normal event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 7, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 9, 30).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(202);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(202);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', 100, 0);
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            expect(cloneElement.offsetTop).toEqual(202);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Month view changing', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });
        it('Month event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 7, 7, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 7, 9, 30).getTime());
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(162);
                done();
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(202);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', -70, 0);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', -700, 0);
            triggerMouseEvent(dragElement, 'mousemove', -700, 0);
            triggerMouseEvent(dragElement, 'mousemove', -700, 0);
            expect(cloneElement.offsetTop).toEqual(202);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });

    describe('Timeline view events dragging for resourcs', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let schOptions: ScheduleModel = {
                width: '500px', height: '500px', selectedDate: new Date(2018, 4, 1),
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth'],
                group: {
                    byGroupID: false,
                    resources: ['Halls', 'Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'HallId', title: 'Hall',
                        name: 'Halls', allowMultiple: false,
                        dataSource: [
                            { HallText: 'Hall 1', Id: 1, HallColor: '#cb6bb2' },
                            { HallText: 'Hall 2', Id: 2, HallColor: '#56ca85' }
                        ],
                        textField: 'HallText', idField: 'Id', colorField: 'HallColor'
                    },
                    {
                        field: 'RoomId', title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { RoomText: 'ROOM 1', Id: 1, RoomColor: '#cb6bb2' },
                            { RoomText: 'ROOM 2', Id: 2, RoomColor: '#56ca85' }
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
                ]
            };
            schObj = util.createSchedule(schOptions, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Normal event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 9).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 11, 30).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(242);
                expect(dragElement.offsetHeight).toEqual(38);
                expect(dragElement.offsetWidth).toEqual(250);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(122);
            expect(dragElement.offsetHeight).toEqual(38);
            expect(dragElement.offsetWidth).toEqual(250);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 0, 100);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(210) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 0, 400);
            triggerMouseEvent(workCell, 'mousemove', 0, 400);
            expect(cloneElement.offsetTop).toEqual(240);
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(250);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Month view changing', (done: Function) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });

        it('Month event dragging', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 9).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 11, 30).getTime());
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(2);
                let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(362);
                expect(dragElement.offsetHeight).toEqual(38);
                expect(dragElement.offsetWidth).toEqual(70);
                done();
            };
            let event: { [key: string]: Object } = schObj.eventsData[0] as { [key: string]: Object };
            expect(event.OwnerId).toEqual(3);
            expect(event.RoomId).toEqual(1);
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(242);
            expect(dragElement.offsetHeight).toEqual(38);
            expect(dragElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 0, 400);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            let workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(188) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 150, 450);
            triggerMouseEvent(workCell, 'mousemove', 150, 450);
            expect(cloneElement.offsetTop).toEqual(360);
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });
});