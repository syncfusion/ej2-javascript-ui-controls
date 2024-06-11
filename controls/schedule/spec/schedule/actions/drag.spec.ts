/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Event drag action spec
 */
import {
    Schedule, ScheduleModel, Day, Week, WorkWeek, Month, Agenda,
    TimelineViews, TimelineMonth, DragEventArgs, DragAndDrop, CallbackFunction
} from '../../../src/schedule/index';
import { dragResizeData, resourceGroupData, timelineData, timelineResourceData } from '../base/datasource.spec';
import { triggerMouseEvent } from '../util.spec';
import * as cls from '../../../src/schedule/base/css-constant';
import * as util from '../util.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth, DragAndDrop);

xdescribe('Vertical view events dragging', () => {
    describe('Normal events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { width: '702px', height: '500px', selectedDate: new Date(2018, 6, 5) };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('dragStart event', () => {
            schObj.dragStart = (args: DragEventArgs) => args.cancel = true;
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown');
        });

        it('dragStop event', () => {
            schObj.dragStart = (args: DragEventArgs) => args.cancel = false;
            schObj.dragStop = (args: DragEventArgs) => args.cancel = true;
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', 130, 224);
            triggerMouseEvent(dragElement, 'mousemove', 130, 234);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(171) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 130, 200);
            triggerMouseEvent(workCell, 'mousemove', 380, 370);
            triggerMouseEvent(workCell, 'mousemove', 380, 370);
            expect(cloneElement.offsetTop).toEqual(864);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.style.width).toEqual('100%');
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Normal event dragging', (done: DoneFn) => {
            schObj.dragStop = (args: DragEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0];
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 12).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 13, 30).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(864);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.style.width).toEqual('46%');
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(720);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.style.width).toEqual('93%');
            triggerMouseEvent(dragElement, 'mousedown', 130, 224);
            triggerMouseEvent(dragElement, 'mousemove', 130, 234);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(171) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 130, 200);
            triggerMouseEvent(workCell, 'mousemove', 380, 370);
            triggerMouseEvent(workCell, 'mousemove', 380, 370);
            expect(cloneElement.offsetTop).toEqual(864);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.style.width).toEqual('100%');
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Recurrence event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[10];
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 12, 15).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_11"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(792);
                expect(dragElement.offsetHeight).toEqual(90);
                expect(dragElement.style.width).toEqual('93%');
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_2"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(810);
            expect(dragElement.offsetHeight).toEqual(90);
            expect(dragElement.style.width).toEqual('93%');
            triggerMouseEvent(dragElement, 'mousedown', 214, 316);
            triggerMouseEvent(dragElement, 'mousemove', 214, 326);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(154) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 124, 286);
            triggerMouseEvent(workCell, 'mousemove', 124, 286);
            expect(cloneElement.offsetTop).toEqual(792);
            expect(cloneElement.offsetHeight).toEqual(90);
            expect(cloneElement.style.width).toEqual('100%');
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('All day event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[7] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(62);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.style.width).toEqual('93%');
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(62);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.style.width).toEqual('93%');
            triggerMouseEvent(dragElement, 'mousedown', 242, 126);
            triggerMouseEvent(dragElement, 'mousemove', 252, 126);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const allDayCell: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells').item(3) as HTMLElement;
            triggerMouseEvent(allDayCell, 'mousemove', 300, 126);
            triggerMouseEvent(allDayCell, 'mousemove', 300, 126);
            expect(cloneElement.offsetTop).toEqual(60);
            expect(cloneElement.offsetHeight).toEqual(1728);
            // expect(cloneElement.offsetWidth).toEqual(85);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('All day longer event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[8] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 5).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 7).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(62);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.style.width).toEqual('193%');
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(62);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toBeGreaterThanOrEqual(109);
            triggerMouseEvent(dragElement, 'mousedown', 280, 120);
            triggerMouseEvent(dragElement, 'mousemove', 286, 120);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const allDayCell: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells').item(5) as HTMLElement;
            triggerMouseEvent(allDayCell, 'mousemove', 468, 126);
            triggerMouseEvent(allDayCell, 'mousemove', 468, 126);
            expect(cloneElement.offsetTop).toEqual(60);
            expect(cloneElement.offsetHeight).toEqual(1728);
            expect(cloneElement.offsetWidth).toBeGreaterThanOrEqual(57);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Enable Time scale mode', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.timeScale = { interval: 120, slotCount: 4 };
            schObj.firstDayOfWeek = 3;
            schObj.dataBind();
        });

        it('Normal event dragging in time scale', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[3] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 7, 9, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 7, 11, 30).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(684);
                expect(dragElement.offsetHeight).toEqual(144);
                expect(dragElement.style.width).toEqual('46%');
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(648);
            expect(dragElement.offsetHeight).toEqual(144);
            expect(dragElement.style.width).toEqual('93%');
            triggerMouseEvent(dragElement, 'mousedown', 124, 180);
            triggerMouseEvent(dragElement, 'mousemove', 134, 180);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(136) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 390, 186);
            triggerMouseEvent(workCell, 'mousemove', 390, 186);
            expect(cloneElement.offsetTop).toEqual(684);
            expect(cloneElement.offsetHeight).toEqual(144);
            expect(cloneElement.style.width).toEqual('100%');
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Disable Time scale mode', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 0;
            schObj.timeScale = { enable: false };
            schObj.dataBind();
        });

        it('Normal event dragging in without time scale', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[6] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 12, 30).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(54);
                expect(dragElement.offsetWidth).toEqual(95);
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(108);
            expect(dragElement.offsetHeight).toEqual(54);
            expect(dragElement.offsetWidth).toBeGreaterThanOrEqual(65);
            triggerMouseEvent(dragElement, 'mousedown', 460, 236);
            triggerMouseEvent(dragElement, 'mousemove', 450, 236);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(1) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 150, 236);
            triggerMouseEvent(workCell, 'mousemove', 150, 236);
            expect(cloneElement.offsetTop).toEqual(108);
            expect(cloneElement.offsetHeight).toEqual(54);
            expect(cloneElement.offsetWidth).toBeGreaterThanOrEqual(70);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Enable RTL mode', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = true;
            schObj.timeScale = { enable: true, interval: 60, slotCount: 2 };
            schObj.dataBind();
        });

        it('Event dragging in RTL', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 11, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 13).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(828);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.style.width).toEqual('46%');
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(864);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.style.width).toEqual('46%');
            triggerMouseEvent(dragElement, 'mousedown', 308, 388);
            triggerMouseEvent(dragElement, 'mousemove', 308, 380);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(164) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 308, 330);
            triggerMouseEvent(workCell, 'mousemove', 308, 330);
            expect(cloneElement.offsetTop).toEqual(828);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.style.width).toEqual('100%');
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Longer event (all day) dragging in RTL', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[8] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(62);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.style.width).toEqual('193%');
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(62);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.style.width).toEqual('193%');
            triggerMouseEvent(dragElement, 'mousedown', 200, 124);
            triggerMouseEvent(dragElement, 'mousemove', 210, 124);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(cloneElement, 'mousemove', 0, 124);
            triggerMouseEvent(cloneElement, 'mousemove', 600, 124);
            expect(cloneElement.offsetTop).toEqual(60);
            expect(cloneElement.offsetHeight).toEqual(1728);
            // expect(cloneElement.offsetWidth).toEqual(85);
            triggerMouseEvent(cloneElement, 'mouseup');
        });

        it('Longer event dragging in RTL', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[9] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 4, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 6, 11).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_10"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(62);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toBeGreaterThanOrEqual(165);
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_10"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(62);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.style.width).toEqual('200%');
            triggerMouseEvent(dragElement, 'mousedown', 172, 124);
            triggerMouseEvent(dragElement, 'mousemove', 182, 124);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(cloneElement, 'mousemove', 0, 124);
            triggerMouseEvent(cloneElement, 'mousemove', 324, 124);
            expect(cloneElement.offsetTop).toEqual(60);
            expect(cloneElement.offsetHeight).toEqual(1008);
            expect(cloneElement.offsetWidth).toBeGreaterThanOrEqual(56);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Prevent drag and drop on all day row RTL mode', (done: DoneFn) => {
            schObj.dragStart = (args: DragEventArgs) => {
                args.excludeSelectors = 'e-all-day-cells,e-all-day-appointment';
            };
            let dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(62);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.style.width).toEqual('193%');
            triggerMouseEvent(dragElement, 'mousedown', 500, 124);
            triggerMouseEvent(dragElement, 'mousemove', 490, 124);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(cloneElement, 'mousemove', 0, 124);
            triggerMouseEvent(cloneElement, 'mousemove', 406, 124);
            expect(cloneElement.offsetTop).toEqual(60);
            expect(cloneElement.offsetHeight).toEqual(1728);
            // expect(cloneElement.offsetWidth).toEqual(85);
            triggerMouseEvent(dragElement, 'mouseup');
            const event: Record<string, any> = schObj.eventsData[8] as Record<string, any>;
            expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1).getTime());
            expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
            dragElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(62);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.style.width).toEqual('193%');
            done();
        });

        it('Month view changing', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('Month event dragging in RTL mode', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[3] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 20, 9, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 20, 11, 30).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toBeGreaterThanOrEqual(64);
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toBeGreaterThanOrEqual(64);
            triggerMouseEvent(dragElement, 'mousedown', 36, 106);
            triggerMouseEvent(dragElement, 'mousemove', 36, 112);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(19) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 132, 300);
            triggerMouseEvent(workCell, 'mousemove', 132, 300);
            cloneElement = schObj.element.querySelector('.e-schedule-event-clone') as HTMLElement;
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toBeGreaterThanOrEqual(64);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Disabling RTL mode', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = false;
            schObj.dataBind();
        });

        it('Month event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[3] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 24, 9, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 24, 11, 30).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toBeGreaterThanOrEqual(64);
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toBeGreaterThanOrEqual(64);
            triggerMouseEvent(dragElement, 'mousedown', 388, 280);
            triggerMouseEvent(dragElement, 'mousemove', 388, 290);
            let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(23) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 250, 378);
            triggerMouseEvent(workCell, 'mousemove', 250, 378);
            cloneElement = schObj.element.querySelector('.e-schedule-event-clone') as HTMLElement;
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toBeGreaterThanOrEqual(64);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('More indicator event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[8] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 12).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 14).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_9"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toBeGreaterThanOrEqual(135);
                done();
            };
            const indicator: HTMLElement = schObj.element.querySelector('.e-more-indicator') as HTMLElement;
            indicator.click();
            setTimeout(() => {
                const dragElement: HTMLElement = document.querySelector('.e-more-appointment-wrapper .e-appointment') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(39);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toBeGreaterThanOrEqual(190);
                triggerMouseEvent(dragElement, 'mousedown', 110, 142);
                triggerMouseEvent(dragElement, 'mousemove', 110, 152);
                let cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
                expect(cloneElement).toBeTruthy();
                const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(11) as HTMLElement;
                triggerMouseEvent(workCell, 'mousemove', 520, 200);
                triggerMouseEvent(workCell, 'mousemove', 520, 200);
                cloneElement = schObj.element.querySelector('.e-schedule-event-clone') as HTMLElement;
                expect(cloneElement.offsetTop).toEqual(0);
                expect(cloneElement.offsetHeight).toEqual(22);
                expect(cloneElement.offsetWidth).toBeGreaterThanOrEqual(135);
                triggerMouseEvent(dragElement, 'mouseup');
                (document.querySelector('.e-more-event-close') as HTMLElement).click();
            }, 1000);
        });
    });

    describe('Vertical view events dragging for resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
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

        it('Normal event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 12, 30).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(792);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(720);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(469) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 350);
            triggerMouseEvent(workCell, 'mousemove', 300, 350);
            expect(cloneElement.offsetTop).toEqual(792);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('All day event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[7] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 4).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(142);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[7] as Record<string, any>;
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(142);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 130, 0);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-wrap .e-all-day-cells').item(9) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 240, 0);
            triggerMouseEvent(workCell, 'mousemove', 240, 0);
            expect(cloneElement.offsetTop).toEqual(140);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 4;
            schObj.timeScale = { interval: 120, slotCount: 4 };
            schObj.dataBind();
        });

        it('Normal event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[6] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 5, 11, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 5, 12, 30).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(792);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(11);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[6] as Record<string, any>;
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(792);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(469) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 350);
            triggerMouseEvent(workCell, 'mousemove', 300, 350);
            expect(cloneElement.offsetTop).toEqual(792);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.timeScale = { enable: false };
            schObj.dataBind();
        });

        it('All day event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[6] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 7).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 7, 1, 30).getTime());
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(1);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(54);
                expect(dragElement.offsetWidth).toEqual(35);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[6] as Record<string, any>;
            expect(event.OwnerId).toEqual(3);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_7"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(112);
            expect(dragElement.offsetHeight).toEqual(54);
            expect(dragElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', -50, 0);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(2) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', -240, 0);
            triggerMouseEvent(workCell, 'mousemove', -240, 0);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(54);
            expect(cloneElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 0;
            schObj.timeScale = { enable: true, interval: 60, slotCount: 2 };
            schObj.dataBind();
        });

        it('Enabling RTL mode', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = true;
            schObj.dataBind();
        });

        it('Normal event dragging in RTL mode', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 8, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 1, 10).getTime());
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(1);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(612);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
            expect(event.OwnerId).toEqual(3);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(792);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(378) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 125);
            triggerMouseEvent(workCell, 'mousemove', 300, 125);
            expect(cloneElement.offsetTop).toEqual(612);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Disabling RTL mode', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = false;
            schObj.dataBind();
        });

        it('Month view changing', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.showWeekend = false;
            schObj.dataBind();
        });

        it('Month event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[2] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 24, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 24, 12, 45).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(35);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[2] as Record<string, any>;
            expect(event.OwnerId).toEqual(2);
            expect(event.RoomId).toEqual(2);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_3"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 255, 0);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(51) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 150);
            triggerMouseEvent(workCell, 'mousemove', 300, 150);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('byDate property checking', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.group.byDate = true;
            schObj.showWeekend = true;
            schObj.dragStart = (args: DragEventArgs) => args.interval = 10;
            schObj.currentView = 'Week';
            schObj.dataBind();
        });

        it('byDate grouping normal event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 10, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 12).getTime());
                expect(event.OwnerId).toEqual(2);
                expect(event.RoomId).toEqual(2);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(756);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(612);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(425) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 270, 400);
            triggerMouseEvent(workCell, 'mousemove', 270, 400);
            expect(cloneElement.offsetTop).toEqual(756);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Normal event to all day dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect(event.OwnerId).toEqual(2);
                expect(event.RoomId).toEqual(2);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(142);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
            expect(event.OwnerId).toEqual(2);
            expect(event.RoomId).toEqual(2);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(756);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 300, 200);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-wrap .e-all-day-cells').item(2) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 200, 100);
            triggerMouseEvent(workCell, 'mousemove', 200, 100);
            expect(cloneElement.offsetTop).toEqual(140);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Enabling RTL mode', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = true;
            schObj.dataBind();
        });

        it('byDate grouping normal event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[3] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 10).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2, 12).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(720);
                expect(dragElement.offsetHeight).toEqual(144);
                expect(dragElement.offsetWidth).toEqual(17);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[3] as Record<string, any>;
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_4"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(648);
            expect(dragElement.offsetHeight).toEqual(144);
            expect(dragElement.offsetWidth).toEqual(33);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 0);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(424) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 200, 100);
            triggerMouseEvent(workCell, 'mousemove', 200, 100);
            expect(cloneElement.offsetTop).toEqual(720);
            expect(cloneElement.offsetHeight).toEqual(144);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 4;
            schObj.timeScale = { enable: true, interval: 120, slotCount: 4 };
            schObj.dataBind();
        });

        it('byDate grouping normal event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[4] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 6, 9, 40).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 6, 10, 40).getTime());
                expect(event.OwnerId).toEqual(2);
                expect(event.RoomId).toEqual(2);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(696);
                expect(dragElement.offsetHeight).toEqual(72);
                expect(dragElement.offsetWidth).toEqual(33);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[4] as Record<string, any>;
            expect(event.OwnerId).toEqual(3);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(756);
            expect(dragElement.offsetHeight).toEqual(72);
            expect(dragElement.offsetWidth).toEqual(17);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            triggerMouseEvent(dragElement, 'mousemove', 100, 250);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(425) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 225);
            triggerMouseEvent(workCell, 'mousemove', 300, 225);
            expect(cloneElement.offsetTop).toEqual(696);
            expect(cloneElement.offsetHeight).toEqual(72);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.timeScale = { enable: false };
            schObj.dataBind();
        });

        it('byDate grouping normal event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[4] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 5).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 5, 1).getTime());
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(1);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(54);
                expect(dragElement.offsetWidth).toEqual(35);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[4] as Record<string, any>;
            expect(event.OwnerId).toEqual(2);
            expect(event.RoomId).toEqual(2);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_5"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(54);
            expect(dragElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(0) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 200, 0);
            triggerMouseEvent(workCell, 'mousemove', 200, 0);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(54);
            expect(cloneElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('first day of week property', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.firstDayOfWeek = 0;
            schObj.currentView = 'Month';
            schObj.timeScale = { enable: true, interval: 60, slotCount: 2 };
            schObj.dataBind();
        });

        it('byDate grouping Month event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[7] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 1).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(1);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(35);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[7] as Record<string, any>;
            expect(event.OwnerId).toEqual(3);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 10, 100);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(3) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 10, 100);
            triggerMouseEvent(workCell, 'mousemove', 10, 100);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Disabling RTL mode', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.enableRtl = false;
            schObj.dataBind();
        });

        it('byDate grouping Month event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[7] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 3).getTime());
                expect(event.OwnerId).toEqual(2);
                expect(event.RoomId).toEqual(2);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(35);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[7] as Record<string, any>;
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_8"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(0);
            expect(dragElement.offsetHeight).toEqual(22);
            expect(dragElement.offsetWidth).toEqual(35);
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 100);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(5) as HTMLElement;
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
        const getResourceIndex: CallbackFunction = (element: HTMLElement) => {
            return parseInt(element.getAttribute('data-group-index'), 10);
        };
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
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

        it('Normal event dragging', (done: DoneFn) => {
            schObj.dragStop = (args: DragEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 6, 10, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 6, 13).getTime());
                expect(event.OwnerId.toString()).toEqual('1,2,3');
                expect(event.RoomId.toString()).toEqual('1,2');
                const dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_1"]'));
                dragElements.forEach((dragElement: HTMLElement) => {
                    expect(dragElement.offsetTop).toEqual(756);
                    expect(dragElement.offsetHeight).toEqual(180);
                    expect(dragElement.offsetWidth).toEqual(33);
                    const resourceIndex: number = getResourceIndex(dragElement);
                    const wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                    expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
                });
                done();
            };
            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
            expect(event.OwnerId.toString()).toEqual('1,2,3');
            expect(event.RoomId.toString()).toEqual('1,2');
            const dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_1"]'));
            dragElements.forEach((dragElement: HTMLElement) => {
                expect(dragElement.offsetTop).toEqual(720);
                expect(dragElement.offsetHeight).toEqual(180);
                expect(dragElement.offsetWidth).toEqual(33);
                const resourceIndex: number = getResourceIndex(dragElement);
                const wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
            });
            triggerMouseEvent(dragElements[0], 'mousedown');
            triggerMouseEvent(dragElements[0], 'mousemove', 100, 250);
            triggerMouseEvent(dragElements[0], 'mousemove', 100, 250);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(446) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 550);
            triggerMouseEvent(workCell, 'mousemove', 300, 550);
            expect(cloneElement.offsetTop).toEqual(756);
            expect(cloneElement.offsetHeight).toEqual(180);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElements[0], 'mouseup');
        });

        it('All day event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[2] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 2).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 4).getTime());
                const dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_3"]'));
                dragElements.forEach((dragElement: HTMLElement) => {
                    expect(dragElement.offsetTop).toEqual(142);
                    expect(dragElement.offsetHeight).toEqual(22);
                    expect(dragElement.offsetWidth).toEqual(69);
                    const resourceIndex: number = getResourceIndex(dragElement);
                    const wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                    expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
                });
                done();
            };
            const dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_3"]'));
            dragElements.forEach((dragElement: HTMLElement) => {
                expect(dragElement.offsetTop).toEqual(142);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(69);
                const resourceIndex: number = getResourceIndex(dragElement);
                const wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
            });
            triggerMouseEvent(dragElements[0], 'mousedown');
            triggerMouseEvent(dragElements[0], 'mousemove', 250, 0);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-date-header-wrap .e-all-day-cells').item(1) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', -100, 0);
            triggerMouseEvent(workCell, 'mousemove', -100, 0);
            expect(cloneElement.offsetTop).toEqual(140);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElements[0], 'mouseup');
        });

        it('Month view change', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('Month event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 20, 10, 30).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 20, 13).getTime());
                expect(event.OwnerId.toString()).toEqual('1,2,3');
                expect(event.RoomId.toString()).toEqual('1,2');
                const dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_1"]'));
                dragElements.forEach((dragElement: HTMLElement) => {
                    expect(dragElement.offsetTop).toEqual(0);
                    expect(dragElement.offsetHeight).toEqual(22);
                    expect(dragElement.offsetWidth).toEqual(35);
                    const resourceIndex: number = getResourceIndex(dragElement);
                    const wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                    expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
                });
                done();
            };
            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
            expect(event.OwnerId.toString()).toEqual('1,2,3');
            expect(event.RoomId.toString()).toEqual('1,2');
            const dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_1"]'));
            dragElements.forEach((dragElement: HTMLElement) => {
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(35);
                const resourceIndex: number = getResourceIndex(dragElement);
                const wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                expect(wrapperIndex).toEqual((resourceIndex * 7) + (wrapperIndex % 7));
            });
            triggerMouseEvent(dragElements[0], 'mousedown');
            triggerMouseEvent(dragElements[0], 'mousemove', 0, 110);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(47) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 0, 100);
            triggerMouseEvent(workCell, 'mousemove', 0, 100);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElements[0], 'mouseup');
        });

        it('Show week end property', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.showWeekend = false;
            schObj.dataBind();
        });

        it('Month event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[1] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 3, 4, 12).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 3, 4, 13, 30).getTime());
                expect(event.OwnerId.toString()).toEqual('3,2');
                expect(event.RoomId.toString()).toEqual('1,2');
                const dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_2"]'));
                dragElements.forEach((dragElement: HTMLElement) => {
                    expect(dragElement.offsetTop).toEqual(0);
                    expect(dragElement.offsetHeight).toEqual(22);
                    expect(dragElement.offsetWidth).toEqual(35);
                    const resourceIndex: number = getResourceIndex(dragElement);
                    const wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                    expect(wrapperIndex).toEqual((resourceIndex * 5) + (wrapperIndex % 5));
                });
                done();
            };
            const event: Record<string, any> = schObj.eventsData[1] as Record<string, any>;
            expect(event.OwnerId.toString()).toEqual('1,3');
            expect(event.RoomId.toString()).toEqual('1');
            const dragElements: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('[data-id="Appointment_2"]'));
            dragElements.forEach((dragElement: HTMLElement) => {
                expect(dragElement.offsetTop).toEqual(0);
                expect(dragElement.offsetHeight).toEqual(22);
                expect(dragElement.offsetWidth).toEqual(35);
                const resourceIndex: number = getResourceIndex(dragElement);
                const wrapperIndex: number = (<HTMLTableCellElement>dragElement.closest('td')).cellIndex;
                expect(wrapperIndex).toEqual((resourceIndex * 5) + (wrapperIndex % 5));
            });
            triggerMouseEvent(dragElements[0], 'mousedown');
            triggerMouseEvent(dragElements[0], 'mousemove', 100, 150);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(12) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 130, 250);
            triggerMouseEvent(workCell, 'mousemove', 130, 250);
            expect(cloneElement.offsetTop).toEqual(0);
            expect(cloneElement.offsetHeight).toEqual(22);
            expect(cloneElement.offsetWidth).toEqual(36);
            triggerMouseEvent(dragElements[0], 'mouseup');
        });
    });

    describe('Multiple events dragging with resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '500px', height: '500px', selectedDate: new Date(2018, 3, 1),
                allowMultiDrag: true,
                eventSettings: {
                    dataSource: [{
                        Id: 1,
                        Subject: 'Multi-drag-one',
                        StartTime: new Date(2018, 3, 1, 9),
                        EndTime: new Date(2018, 3, 1, 10),
                        OwnerId: [1]
                    }, {
                        Id: 2,
                        Subject: 'Multi-drag-two',
                        StartTime: new Date(2018, 3, 1, 11),
                        EndTime: new Date(2018, 3, 1, 12),
                        OwnerId: [1]
                    }, {
                        Id: 3,
                        Subject: 'Multi-drag-three',
                        StartTime: new Date(2018, 3, 2, 11),
                        EndTime: new Date(2018, 3, 2, 12),
                        OwnerId: [1]
                    }, {
                        Id: 4,
                        Subject: 'Multi-drag-four',
                        StartTime: new Date(2018, 3, 1, 11),
                        EndTime: new Date(2018, 3, 1, 12),
                        OwnerId: [1]
                    }]
                },
                group: { allowGroupEdit: true, resources: ['Owners'] },
                resources: [{
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { OwnerText: 'Nancy', Id: 1, OwnerGroupId: 1, OwnerColor: '#ffaa00' },
                        { OwnerText: 'Steven', Id: 2, OwnerGroupId: 2, OwnerColor: '#f8a398' }
                    ],
                    textField: 'OwnerText', idField: 'Id', colorField: 'OwnerColor'
                }]
            };
            schObj = util.createSchedule(schOptions, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Vertical view events drag', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('[data-id="Appointment_1"]')).toBeTruthy();
                expect(schObj.element.querySelector('[data-id="Appointment_2"]')).toBeTruthy();
                const apps: Record<string, any>[] = schObj.eventSettings.dataSource as Record<string, any>[];
                expect(apps[0].StartTime.getTime()).toEqual(new Date(2018, 3, 6, 13, 30).getTime());
                expect(apps[0].EndTime.getTime()).toEqual(new Date(2018, 3, 6, 14, 30).getTime());
                expect(apps[0].OwnerId[0]).toEqual(2);
                expect(apps[1].StartTime.getTime()).toEqual(new Date(2018, 3, 6, 15, 30).getTime());
                expect(apps[1].EndTime.getTime()).toEqual(new Date(2018, 3, 6, 16, 30).getTime());
                expect(apps[1].OwnerId[0]).toEqual(2);
                done();
            };
            const appointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appointments[0], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            util.triggerMouseEvent(appointments[1], 'click', 0, 0, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            const apps: Record<string, any>[] = schObj.eventSettings.dataSource as Record<string, any>[];
            expect(apps[0].StartTime.getTime()).toEqual(new Date(2018, 3, 1, 9).getTime());
            expect(apps[0].EndTime.getTime()).toEqual(new Date(2018, 3, 1, 10).getTime());
            expect(apps[0].OwnerId[0]).toEqual(1);
            expect(apps[1].StartTime.getTime()).toEqual(new Date(2018, 3, 1, 11).getTime());
            expect(apps[1].EndTime.getTime()).toEqual(new Date(2018, 3, 1, 12).getTime());
            expect(apps[1].OwnerId[0]).toEqual(1);
            triggerMouseEvent(appointments[0], 'mousedown');
            triggerMouseEvent(appointments[0], 'mousemove', 100, 250);
            triggerMouseEvent(appointments[0], 'mousemove', 100, 250);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(446) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 550);
            triggerMouseEvent(workCell, 'mousemove', 300, 550);
            triggerMouseEvent(appointments[0], 'mouseup');
        });

        it('Month view change', (done: DoneFn) => {
            schObj.dataBound = () => done();
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('Month view events drag', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('[data-id="Appointment_3"]')).toBeTruthy();
                expect(schObj.element.querySelector('[data-id="Appointment_4"]')).toBeTruthy();
                const apps: Record<string, any>[] = schObj.eventSettings.dataSource as Record<string, any>[];
                expect(apps[3].StartTime.getTime()).toEqual(new Date(2018, 3, 5, 11).getTime());
                expect(apps[3].EndTime.getTime()).toEqual(new Date(2018, 3, 5, 12).getTime());
                expect(apps[3].OwnerId[0]).toEqual(1);
                expect(apps[2].StartTime.getTime()).toEqual(new Date(2018, 3, 6, 11).getTime());
                expect(apps[2].EndTime.getTime()).toEqual(new Date(2018, 3, 6, 12).getTime());
                expect(apps[2].OwnerId[0]).toEqual(1);
                done();
            };
            const appointments: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
            util.triggerMouseEvent(appointments[0], 'click', 14, 152, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(1);
            util.triggerMouseEvent(appointments[1], 'click', 50, 150, false, true);
            expect(schObj.element.querySelectorAll('.e-appointment-border').length).toEqual(2);
            const apps: Record<string, any>[] = schObj.eventSettings.dataSource as Record<string, any>[];
            expect(apps[3].StartTime.getTime()).toEqual(new Date(2018, 3, 1, 11).getTime());
            expect(apps[3].EndTime.getTime()).toEqual(new Date(2018, 3, 1, 12).getTime());
            expect(apps[3].OwnerId[0]).toEqual(1);
            expect(apps[2].StartTime.getTime()).toEqual(new Date(2018, 3, 2, 11).getTime());
            expect(apps[2].EndTime.getTime()).toEqual(new Date(2018, 3, 2, 12).getTime());
            expect(apps[2].OwnerId[0]).toEqual(1);
            triggerMouseEvent(appointments[1], 'mousedown');
            triggerMouseEvent(appointments[1], 'mousemove', 60, 152);
            triggerMouseEvent(appointments[1], 'mousemove', 60, 152);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(5) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 200, 152);
            triggerMouseEvent(appointments[1], 'mouseup');
        });

    });

    describe('Adaptive mode event dragging', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = { width: 300, height: 500, selectedDate: new Date(2018, 6, 5) };
            schObj = util.createSchedule(schOptions, dragResizeData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Normal event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-clone-time-indicator').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 6, 6, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 6, 6, 12, 30).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(792);
                expect(dragElement.offsetHeight).toEqual(108);
                expect(dragElement.offsetWidth).toEqual(11);
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(720);
            expect(dragElement.offsetHeight).toEqual(108);
            expect(dragElement.offsetWidth).toEqual(33);
            schObj.isAdaptive = true;
            triggerMouseEvent(dragElement, 'mousedown');
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            triggerMouseEvent(dragElement, 'mousemove', 100, 50);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(159) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 300, 175);
            triggerMouseEvent(workCell, 'mousemove', 300, 175);
            expect(cloneElement.offsetTop).toEqual(792);
            expect(cloneElement.offsetHeight).toEqual(108);
            expect(cloneElement.offsetWidth).toEqual(36);
            const timeIndicator: HTMLElement = schObj.element.querySelector('.e-clone-time-indicator') as HTMLElement;
            expect(timeIndicator).toBeTruthy();
            expect(timeIndicator.offsetTop).toEqual(792);
            expect(timeIndicator.offsetHeight).toEqual(14);
            expect(timeIndicator.offsetWidth).toEqual(85);
            schObj.isAdaptive = false;
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });
});

describe('Timeline view events dragging', () => {
    describe('Default schedule events', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
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
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', 120, 330);
            triggerMouseEvent(dragElement, 'mousemove', 130, 330);
        });

        it('dragStop event', () => {
            schObj.dragStart = (args: DragEventArgs) => args.cancel = false;
            schObj.dragStop = (args: DragEventArgs) => args.cancel = true;
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', 120, 330);
            triggerMouseEvent(dragElement, 'mousemove', 130, 330);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone');
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', 280, 330);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Normal event dragging', (done: DoneFn) => {
            schObj.dragStop = (args: DragEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 13, 30).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(122);
                expect(dragElement.offsetHeight).toEqual(38);
                expect(dragElement.offsetWidth).toEqual(250);
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(202);
            expect(dragElement.offsetHeight).toEqual(38);
            expect(dragElement.offsetWidth).toEqual(250);
            triggerMouseEvent(dragElement, 'mousedown', 120, 330);
            triggerMouseEvent(dragElement, 'mousemove', 130, 330);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', 220, 330);
            expect(cloneElement.offsetTop).toEqual(202);
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(250);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Month view changing', (done: DoneFn) => {
            schObj.dataBound = () => {
                schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS).scrollLeft = 0;
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });

        it('Month event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 11).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 13, 30).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(82);
                expect(dragElement.offsetHeight).toEqual(38);
                expect(dragElement.offsetWidth).toEqual(68);
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(242);
            expect(dragElement.offsetHeight).toEqual(38);
            expect(dragElement.offsetWidth).toEqual(68);
            triggerMouseEvent(dragElement, 'mousedown', 12, 342);
            triggerMouseEvent(dragElement, 'mousemove', 16, 342);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', 160, 342);
            expect(cloneElement.offsetTop).toEqual(242);
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });

    describe('RTL mode events dragging', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '500px', height: '500px', enableRtl: true, selectedDate: new Date(2018, 4, 1),
                views: ['TimelineDay', 'TimelineWeek', 'TimelineWorkWeek', 'TimelineMonth']
            };
            schObj = util.createSchedule(schOptions, timelineData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('dragStart event', () => {
            schObj.dragStart = (args: DragEventArgs) => args.cancel = true;
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', 160, 336);
            triggerMouseEvent(dragElement, 'mousemove', 170, 336);
        });

        it('dragStop event', () => {
            schObj.dragStart = (args: DragEventArgs) => args.cancel = false;
            schObj.dragStop = (args: DragEventArgs) => args.cancel = true;
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', 160, 336);
            triggerMouseEvent(dragElement, 'mousemove', 170, 336);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone');
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', 460, 336);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Normal event dragging', (done: DoneFn) => {
            schObj.dragStart = (args: DragEventArgs) => args.cancel = false;
            schObj.dragStop = (args: DragEventArgs) => args.cancel = false;
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 9, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 11, 30).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(202);
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(202);
            triggerMouseEvent(dragElement, 'mousedown', 160, 336);
            triggerMouseEvent(dragElement, 'mousemove', 170, 336);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', 440, 336);
            triggerMouseEvent(dragElement, 'mousemove', 460, 336);
            expect(cloneElement.offsetTop).toEqual(202);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Month view changing', (done: DoneFn) => {
            schObj.dataBound = () => {
                schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS).scrollLeft = 0;
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });
        it('Month event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 7, 9, 0).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 7, 11, 30).getTime());
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(162);
                done();
            };
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(202);
            triggerMouseEvent(dragElement, 'mousedown', 460, 300);
            triggerMouseEvent(dragElement, 'mousemove', 450, 300);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            triggerMouseEvent(dragElement, 'mousemove', 50, 300);
            expect(cloneElement.offsetTop).toEqual(202);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });

    describe('Timeline view events dragging for resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
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

        it('Normal event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 9).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 1, 11, 30).getTime());
                expect(event.OwnerId).toEqual(3);
                expect(event.RoomId).toEqual(1);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(242);
                expect(dragElement.offsetHeight).toEqual(38);
                expect(dragElement.offsetWidth).toEqual(250);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(122);
            expect(dragElement.offsetHeight).toEqual(38);
            expect(dragElement.offsetWidth).toEqual(250);
            triggerMouseEvent(dragElement, 'mousedown', 380, 260);
            triggerMouseEvent(dragElement, 'mousemove', 380, 270);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(210) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 240, 380);
            expect(cloneElement.offsetTop).toEqual(240);
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(250);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Month view changing', (done: DoneFn) => {
            schObj.dataBound = () => {
                schObj.element.querySelector('.' + cls.CONTENT_WRAP_CLASS).scrollLeft = 0;
                done();
            };
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });

        it('Month event dragging', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect((event.StartTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 9).getTime());
                expect((event.EndTime as Date).getTime()).toEqual(new Date(2018, 4, 3, 11, 30).getTime());
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(2);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(362);
                expect(dragElement.offsetHeight).toEqual(38);
                expect(dragElement.offsetWidth).toEqual(68);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
            expect(event.OwnerId).toEqual(3);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(242);
            expect(dragElement.offsetHeight).toEqual(38);
            expect(dragElement.offsetWidth).toEqual(68);
            triggerMouseEvent(dragElement, 'mousedown', 224, 340);
            triggerMouseEvent(dragElement, 'mousemove', 224, 350);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(188) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 360, 480);
            expect(cloneElement.offsetTop).toEqual(360);
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });

    describe('Timeline view events dragging for resources with scaling', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const schOptions: ScheduleModel = {
                width: '500px', height: '500px', selectedDate: new Date(2018, 4, 1),
                views: ['TimelineMonth'],
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
            document.body.style.transform = 'scale(1.25)';
            schObj = util.createSchedule(schOptions, timelineResourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Timeline Month event dragging with scaling', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-drag-clone').length).toEqual(0);
                const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
                expect(event.OwnerId).toEqual(1);
                expect(event.RoomId).toEqual(2);
                const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
                expect(dragElement.offsetTop).toEqual(362);
                expect(dragElement.offsetHeight).toEqual(38);
                expect(dragElement.offsetWidth).toEqual(68);
                done();
            };
            const event: Record<string, any> = schObj.eventsData[0] as Record<string, any>;
            expect(event.OwnerId).toEqual(1);
            expect(event.RoomId).toEqual(1);
            const dragElement: HTMLElement = schObj.element.querySelector('[data-id="Appointment_1"]') as HTMLElement;
            expect(dragElement.offsetTop).toEqual(122);
            expect(dragElement.offsetHeight).toEqual(38);
            expect(dragElement.offsetWidth).toEqual(68);
            triggerMouseEvent(dragElement, 'mousedown', 224, 340);
            triggerMouseEvent(dragElement, 'mousemove', 224, 350);
            const cloneElement: HTMLElement = schObj.element.querySelector('.e-drag-clone') as HTMLElement;
            expect(cloneElement).toBeTruthy();
            const workCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells').item(188) as HTMLElement;
            triggerMouseEvent(workCell, 'mousemove', 360, 480);
            expect(cloneElement.offsetTop).toEqual(420);
            expect(cloneElement.offsetHeight).toEqual(38);
            expect(cloneElement.offsetWidth).toEqual(70);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });
});
