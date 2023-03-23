/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schedule resource base spec
 */
import { isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { Popup } from '@syncfusion/ej2-popups';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineYear,
    ResourceDetails, EJ2Instance, ScheduleModel, TimelineViews, ActionEventArgs
} from '../../../src/schedule/index';
import { resourceData, resourceGroupData } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews, TimelineYear);

describe('Schedule Resources', () => {
    beforeAll(() => {
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // eslint-disable-next-line no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Multiple resource', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                selectedDate: new Date(2017, 10, 1),
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
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('control class testing', () => {
            expect(document.getElementById('Schedule').classList.contains('e-schedule')).toEqual(true);
        });
    });

    describe('Event Color by resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', name: 'Rooms',
                    dataSource: [
                        { Text: 'Room 1', Id: 1, Color: '#cb6bb2' },
                        { Text: 'Room 2', Id: 2, Color: '#56ca85' }
                    ]
                }, {
                    field: 'OwnerId', name: 'Owners',
                    dataSource: [
                        { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                        { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                        { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }
                    ]
                }],
                eventSettings: { resourceColorField: 'Owners', dataSource: resourceData }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('control class testing', () => {
            const eventBg: string = (schObj.element.querySelector('.e-appointment') as HTMLElement).style.backgroundColor;
            expect(eventBg).toEqual('rgb(255, 170, 0)');
        });

        it('event color by rooms', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventBg: string = (schObj.element.querySelector('.e-appointment') as HTMLElement).style.backgroundColor;
                expect(eventBg).toEqual('rgb(203, 107, 178)');
                done();
            };
            schObj.eventSettings.resourceColorField = 'Rooms';
            schObj.dataBind();
        });
    });

    describe('Multiple resource with group', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
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
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('control class testing', () => {
            expect(document.getElementById('Schedule').classList.contains('e-schedule')).toEqual(true);
        });

        it('resource details in quick event popup', () => {
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-appointment')[3] as HTMLElement, 'click');
            const eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(eventPopup.classList).toContain('e-popup-open');
            (<HTMLElement>eventPopup.querySelector('.e-close')).click();
        });

        it('current time indicator testing without group by-date', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-current-timeline')).not.toBeNull();
                expect(schObj.element.querySelectorAll('.e-current-timeline').length).toEqual(3);
                done();
            };
            expect(schObj.element.querySelector('.e-current-timeline')).toBeNull();
            schObj.selectedDate = new Date();
            schObj.dataBind();
        });

        it('current time indicator testing with group by-date', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-schedule-table tbody tr').length).toBe(4);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-resource-cells').length).toBe(35);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toBe(7);
                expect(schObj.element.querySelector('.e-current-timeline')).not.toBeNull();
                expect(schObj.element.querySelectorAll('.e-current-timeline').length).toEqual(3);
                done();
            };
            schObj.group.byDate = true;
            schObj.dataBind();
        });
    });

    describe('Multiple resource with group setmodel testing', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                currentView: 'WorkWeek',
                selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', title: 'Room', name: 'Rooms', allowMultiple: false,
                    dataSource: [
                        { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                        { text: 'ROOM 2', id: 2, color: '#56ca85' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color'
                }, {
                    field: 'OwnerId', title: 'Owner', name: 'Owners', allowMultiple: true,
                    dataSource: [{
                        text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [0, 1, 2, 3],
                        startHour: '00:00', endHour: '08:00', css: 'e-na'
                    }, {
                        text: 'Steven', id: 2, groupId: 2, color: '#f8a398', workDays: [3, 4],
                        startHour: '08:00', endHour: '16:00', css: 'e-st'
                    }, {
                        text: 'Michael', id: 3, groupId: 1, color: '#7499e1', startHour: '16:00', endHour: '23:59', css: 'e-mi'
                    }],
                    textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color',
                    workDaysField: 'workDays', startHourField: 'startHour', endHourField: 'endHour', cssClassField: 'css'
                }]
            };
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('headerdate checking in workweek view', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toEqual(11);
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
        });

        it('headerdate checking in week view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toEqual(21);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(9);
                done();
            };
            schObj.currentView = 'Week';
            schObj.dataBind();
        });
    });

    describe('Multiple resource group with custom workdays and hours', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                selectedDate: new Date(2017, 10, 1),
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
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('setmodel - byDate testing', () => {
            schObj.group.byDate = true;
            schObj.dataBind();
        });

        it('setmodel - resources testing', () => {
            schObj.group.resources = ['Rooms', 'Owners'];
            schObj.dataBind();
        });
    });

    describe('Multiple resource group with custom workdays and hours', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '650px',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    allowGroupEdit: true,
                    byDate: true,
                    resources: ['Owners']
                },
                resources: [{
                    field: 'TaskId', title: 'Assignee',
                    name: 'Owners', allowMultiple: true,
                    dataSource: [
                        { text: 'Alice', id: 1, color: '#df5286', workDays: [1, 2, 4, 5], startHour: '08:00', endHour: '15:00' },
                        { text: 'Smith', id: 2, color: '#7fa900', workDays: [1, 3, 5], startHour: '08:00', endHour: '17:00' }
                    ],
                    textField: 'text', idField: 'id', colorField: 'color', workDaysField: 'workDays', startHourField: 'startHour',
                    endHourField: 'endHour'
                }],
                views: ['Day', 'WorkWeek', 'Month', 'Agenda'],
                currentView: 'WorkWeek',
                eventSettings: {
                    dataSource: resourceData,
                    fields: {
                        subject: { title: 'Task', name: 'Subject' },
                        location: { title: 'Project Name', name: 'Location' },
                        description: { title: 'Comments', name: 'Description' }
                    }
                }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('setmodel - byDate testing', () => {
            expect(schObj.element.querySelectorAll('.e-work-hours').length).toEqual((14 * 5) + (18 * 5));
            expect(schObj.element.querySelectorAll('.e-work-cells:not(.e-work-hours)').length).toEqual((34 * 5) + (30 * 5));
        });
    });

    describe('Multiple resource without group rendering in setmodel', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = { width: '100%', height: '550px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('default resource value checking', () => {
            expect(schObj.resources.length).toEqual(0);
            expect(schObj.group.resources.length).toEqual(0);
        });

        it('setmodel group value checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.resources.length).toEqual(2);
                expect(schObj.group.resources.length).toEqual(0);
                done();
            };
            schObj.resources = [{
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
            }];
            schObj.dataBind();
        });

        it('setmodel group value checking', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.resources.length).toEqual(2);
                expect(schObj.group.resources.length).toEqual(2);
                done();
            };
            schObj.group.resources = ['Rooms', 'Owners'];
            schObj.dataBind();
        });
    });

    describe('Resource expand/collapse icon checking', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    resources: ['Projects', 'SubProjects', 'Categories']
                },
                resources: [
                    {
                        field: 'ProjectId',
                        title: 'Project',
                        name: 'Projects',
                        dataSource: [
                            { text: 'PROJECT 1', id: 1, color: '#cb6bb2' },
                            { text: 'PROJECT 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'SubProjectId',
                        title: 'SubProject',
                        name: 'SubProjects',
                        dataSource: [
                            { text: 'SUB-PROJECT1', id: 3, color: '#df5286', groupId: 1 },
                            { text: 'SUB-PROJECT2', id: 4, color: '#df5286', groupId: 2 },
                            { text: 'Michael', id: 5, color: '#df5286', groupId: 1 }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color', groupIDField: 'groupId'
                    }, {
                        field: 'CategoryId',
                        title: 'Category',
                        name: 'Categories',
                        dataSource: [
                            { text: 'Steven', id: 6, color: '#7fa900', groupId: 3 },
                            { text: 'Robert', id: 7, color: '#ea7a57', groupId: 4 },
                            { text: 'Smith', id: 8, color: '#5978ee', groupId: 4 }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color', groupIDField: 'groupId'
                    }],
                views: ['TimelineWeek']
            };
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('checking resource expand/collapse icon when it has no child', () => {
            const resourceRow: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-resource-cells.e-parent-node'));
            expect(resourceRow[1].parentElement.classList.contains('e-hidden')).toEqual(false);
            expect(resourceRow[1].children[0].classList.contains('e-resource-tree-icon')).toEqual(true);
            expect(resourceRow[1].children[0].classList.contains('e-resource-collapse')).toEqual(true);
            expect(resourceRow[2].parentElement.classList.contains('e-hidden')).toEqual(false);
            expect(resourceRow[2].children[0].classList.contains('e-resource-tree-icon')).toEqual(false);
            expect(resourceRow[2].children[0].classList.contains('e-resource-collapse')).toEqual(false);
            util.triggerMouseEvent(resourceRow[0].children[0] as HTMLElement, 'click');
            expect(resourceRow[1].parentElement.classList.contains('e-hidden')).toEqual(true);
            expect(resourceRow[2].parentElement.classList.contains('e-hidden')).toEqual(true);
            expect(schObj.eventWindow.dialogObject.element.querySelectorAll('.e-resources').length).toEqual(3);
        });
        it('resource icon click testing with tooltip enabled', () => {
            schObj.eventSettings.enableTooltip = true;
            schObj.dataBind();
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(5);
            const firstRow: HTMLElement = resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            firstRow.click();
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(6);
        });
        it('resource icon click testing with actionBegin event', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            const resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(6);
            const firstRow: HTMLElement = resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            firstRow.click();
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(6);
        });
        it('setting group resource as empty', (done: DoneFn) => {
            schObj.actionBegin = null;
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.element.querySelectorAll('.e-resources').length).toEqual(3);
                done();
            };
            schObj.group.resources = [];
            schObj.dataBind();
        });
        it('entire resource has been removed', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.eventWindow.dialogObject.element.querySelectorAll('.e-resources').length).toEqual(0);
                done();
            };
            schObj.resources = [];
            schObj.dataBind();
        });
    });

    describe('Public methods for resource expand/collapse ', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '500px', height: '460px',
                views: ['TimelineWeek'],
                selectedDate: new Date(2017, 10, 1),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId', title: 'Room', name: 'Rooms',
                        dataSource: [
                            { Text: 'ROOM 1', Id: 1, Color: '#cb6bb2', Expand: false },
                            { Text: 'ROOM 2', Id: 2, Color: '#56ca85' },
                            { Text: 'ROOM 3', Id: 3, Color: '#df5286', Expand: false }
                        ],
                        textField: 'Text', idField: 'Id', colorField: 'Color', expandedField: 'Expand'
                    }, {
                        field: 'OwnerId', title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { Text: 'Nancy', Id: 1, GroupId: 1, Color: '#df5286' },
                            { Text: 'Steven', Id: 2, GroupId: 1, Color: '#7fa900' },
                            { Text: 'Robert', Id: 3, GroupId: 2, Color: '#ea7a57' },
                            { Text: 'Smith', Id: 4, GroupId: 2, Color: '#5978ee' },
                            { Text: 'Micheal', Id: 5, GroupId: 3, Color: '#df5286' },
                            { Text: 'Root', Id: 6, GroupId: 3, Color: '#00bdae' }
                        ],
                        textField: 'Text', idField: 'Id', groupIDField: 'GroupId', colorField: 'Color'
                    }
                ]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('To check for resource expand', () => {
            schObj.expandResource(1, 'Rooms');
            expect((schObj.element.querySelectorAll('.e-resource-expand')).length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(7);
            expect((schObj.element.querySelector('[data-group-index="0"]')).classList.contains('e-parent-node')).toEqual(true);
            expect((schObj.element.querySelector('[data-group-index="0"] .e-resource-tree-icon')).classList.contains('e-resource-collapse'))
                .toEqual(true);
        });
        it('To check for resource collapse', () => {
            schObj.collapseResource(2, 'Rooms');
            expect((schObj.element.querySelectorAll('.e-resource-collpase')).length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(5);
            expect((schObj.element.querySelector('[data-group-index="3"]')).classList.contains('e-parent-node')).toEqual(true);
            expect((schObj.element.querySelector('[data-group-index="3"] .e-resource-tree-icon')).classList.contains('e-resource-expand'))
                .toEqual(true);
        });
    });

    describe('Public methods checking for resources', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px',
                selectedDate: new Date(2017, 10, 1),
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
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Initial resource testing', () => {
            expect((<Record<string, any>[]>schObj.resources.slice(-1)[0].dataSource).length).toEqual(3);
        });

        it('quick cell popup testing', () => {
            const morePopup: Popup = schObj.quickPopup.morePopup;
            schObj.quickPopup.morePopup = null;
            const workCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            const quickPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
            expect(quickPopup.classList.contains('e-popup-open')).toEqual(true);
            expect(quickPopup.classList.contains('e-popup-close')).toEqual(false);
            expect(quickPopup.querySelector('.e-resource-details')).toBeNull();
            util.triggerMouseEvent(quickPopup.querySelector('.e-close'), 'click');
            expect(quickPopup.classList.contains('e-popup-open')).toEqual(false);
            expect(quickPopup.classList.contains('e-popup-close')).toEqual(true);
            schObj.quickPopup.morePopup = morePopup;
        });

        it('getResourcesByIndex ', () => {
            let resourceDetails: ResourceDetails = schObj.getResourcesByIndex(1);
            expect(isNullOrUndefined(resourceDetails)).toEqual(true);
            schObj.group = { resources: ['Rooms', 'Owners'] };
            schObj.dataBind();
            resourceDetails = schObj.getResourcesByIndex(1);
            expect(isNullOrUndefined(resourceDetails)).toEqual(false);
            resourceDetails = schObj.getResourcesByIndex(-1);
            expect(isNullOrUndefined(resourceDetails)).toEqual(true);
        });

        it('Public method for add resource', () => {
            schObj.addResource({ Text: 'New Resource', Id: 11, GroupID: 1, Color: '#7499e1' }, 'Owners', 1);
            expect((<Record<string, any>[]>schObj.resourceCollection.slice(-1)[0].dataSource).length).toEqual(4);
        });

        it('Public method for remove resource', () => {
            schObj.removeResource(11, 'Owners');
            expect((<Record<string, any>[]>schObj.resourceCollection.slice(-1)[0].dataSource).length).toEqual(3);
        });

        it('Public method setWorkHours checking with resource', () => {
            schObj.workHours.highlight = false;
            schObj.dataBind();
            expect(schObj.element.querySelectorAll('.e-work-hours[data-group-index="1"]').length).toEqual(0);
            schObj.setWorkHours(schObj.activeView.renderDates, '07:00', '09:00', 1);
            expect(schObj.element.querySelectorAll('.e-work-hours[data-group-index="1"]').length).toEqual(28);

        });
    });

    describe('Add resources dynamically', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px',
                selectedDate: new Date(),
                group: { resources: ['Rooms'] },
                resources: [{
                    field: 'RoomId', title: 'Room',
                    name: 'Rooms', allowMultiple: true,
                    dataSource: [],
                    textField: 'Text', idField: 'Id', colorField: 'Color'
                }]
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Test eventwindow and datasource length', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(!isNullOrUndefined(schObj.eventWindow)).toEqual(true);
                expect((schObj.resourceCollection[0].dataSource as Record<string, any>[]).length).toEqual(1);
                done();
            };
            const roomDetails: Record<string, any> = { Id: 1, Text: 'Meeting Room', Color: '#000' };
            schObj.addResource(roomDetails, 'Rooms', 0);
        });
    });

    describe('Keyboard interactions with multiple resource grouping', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%', height: '550px',
                selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
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
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('multiple work cells selection for particular resource', () => {
            keyModule = schObj.keyboardInteractionModule;
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[428];
            util.triggerMouseEvent(workCells[428], 'mousedown');
            util.triggerMouseEvent(workCells[495], 'mousemove');
            util.triggerMouseEvent(workCells[495], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(201);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(12);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(23);
        });

        it('multiple work cells selection for other resource', () => {
            keyModule = schObj.keyboardInteractionModule;
            const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[428];
            util.triggerMouseEvent(workCells[428], 'mousedown');
            util.triggerMouseEvent(workCells[500], 'mousemove');
            util.triggerMouseEvent(workCells[500], 'mouseup');
            const focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(274);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(13);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(47);
        });
    });

    describe('actionFailure testing for resource datasource', () => {
        let schObj: Schedule;
        const actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        beforeAll(() => {
            jasmine.Ajax.install();
            const model: ScheduleModel = {
                selectedDate: new Date(2019, 11, 5),
                group: { resources: ['Owners'] },
                resources: [{
                    field: 'OwnerId', name: 'Owners',
                    dataSource: new DataManager({ url: 'api/Schedule/Events/' })
                }],
                actionFailure: actionFailedFunction
            };
            schObj = util.createSchedule(model, resourceData);
        });
        beforeEach((done: DoneFn) => {
            const request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
            request.respondWith({ 'status': 404, 'contentType': 'application/json', 'responseText': 'Page not found' });
            setTimeout(() => { done(); }, 100);
        });
        it('actionFailure testing', () => {
            expect(actionFailedFunction).toHaveBeenCalled();
        });
        afterAll(() => {
            util.destroy(schObj);
            jasmine.Ajax.uninstall();
        });
    });

    describe('Multiple resource grouping rendering in mobile device', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel XL Build/PPP3.180510.008) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = {
                width: 300, height: '500px',
                selectedDate: new Date(2018, 3, 1),
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda'],
                group: { resources: ['Rooms', 'Owners'] },
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
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('resource toolbar testing', () => {
            expect(schObj.element.querySelectorAll('.e-schedule-resource-toolbar-container')).toBeTruthy();
            expect(schObj.element.querySelectorAll('.e-schedule-resource-toolbar').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-schedule-resource-toolbar .e-resource-menu').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-schedule-resource-toolbar .e-resource-level-title').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-resource-level-title .e-resource-name').length).toEqual(2);
            expect(schObj.element.querySelectorAll('.e-resource-level-title .e-icon-next').length).toEqual(1);
        });

        it('resource treeview testing', () => {
            expect(schObj.element.querySelectorAll('.e-resource-tree-popup').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-resource-tree').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-resource-tree .e-list-item.e-has-child').length).toEqual(2);
            expect(schObj.element.querySelectorAll('.e-resource-tree .e-list-item:not(.e-has-child)').length).toEqual(3);
        });

        it('resource menu click testing', () => {
            const treePopup: Popup = (schObj.element.querySelector('.e-resource-tree-popup') as EJ2Instance).ej2_instances[0] as Popup;
            treePopup.showAnimation = null;
            treePopup.hideAnimation = null;
            treePopup.dataBind();
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(true);
            const menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            util.triggerMouseEvent(menuElement, 'click');
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(true);
            util.triggerMouseEvent(menuElement, 'click');
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(false);
        });

        xit('document click testing', () => {
            const menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            util.triggerMouseEvent(menuElement, 'click');
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(true);
            const popupWrapper: HTMLElement = schObj.element.querySelector('.e-resource-tree-popup');
            util.triggerMouseEvent(popupWrapper, 'mousedown');
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(true);
            const resourceToolbar: HTMLElement = schObj.element.querySelector('.e-schedule-resource-toolbar') as HTMLElement;
            util.triggerMouseEvent(resourceToolbar, 'mousedown');
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(false);
        });

        it('resource node click testing - child node', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:first-child').innerHTML).toEqual('Room 1');
                expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:last-child').innerHTML).toEqual('Michael');
                done();
            };
            const menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            util.triggerMouseEvent(menuElement, 'click');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:first-child').innerHTML).toEqual('Room 1');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:last-child').innerHTML).toEqual('Nancy');
            const nodeElement: Element = schObj.element.querySelector('.e-resource-tree .e-list-item:not(.e-has-child):not(.e-active)');
            (schObj.resourceBase as any).resourceClick({ event: new MouseEvent('mouseup'), name: 'nodeClicked', node: nodeElement });
        });

        it('resource node click testing - parent node', () => {
            const menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            util.triggerMouseEvent(menuElement, 'click');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:first-child').innerHTML).toEqual('Room 1');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:last-child').innerHTML).toEqual('Michael');
            const nodeElement: Element = schObj.element.querySelector('.e-resource-tree .e-list-item.e-has-child');
            (schObj.resourceBase as any).resourceClick({ event: new MouseEvent('mouseup'), name: 'nodeClicked', node: nodeElement });
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:first-child').innerHTML).toEqual('Room 1');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:last-child').innerHTML).toEqual('Michael');
            util.triggerMouseEvent(menuElement, 'click');
        });

        it('resource events checked for week view testing', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
        });

        it('resource events checked for day view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };
            schObj.currentView = 'Day';
            schObj.dataBind();
        });

        it('resource events checked for workweek view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
                done();
            };
            schObj.currentView = 'WorkWeek';
            schObj.dataBind();
        });

        it('resource events checked for month view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('resource events checked for agenda view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'Agenda';
            schObj.dataBind();
        });

        it('resource events checked for monthAgenda view testing', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };
            schObj.currentView = 'MonthAgenda';
            schObj.dataBind();
        });

        it('Negative case for resource without timescale', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                expect(schObj.getWorkCellElements().length).toEqual(336);
                const workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
                expect(workCells[126].getAttribute('data-date')).toEqual(new Date(2018, 3, 1, 9, 0).getTime().toString());
                done();
            };
            schObj.currentView = 'Week';
            schObj.dataBind();
        });

        it('Negative case for resource with timescale', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.getWorkCellElements().length).toEqual(7);
                const emptyCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
                expect(isNullOrUndefined(emptyCell[126])).toEqual(true);
                done();
            };
            schObj.timeScale.enable = false;
            schObj.dataBind();
        });
    });

    describe('Negative testcases for resource grouping rendering in mobile device', () => {
        let schObj: Schedule;
        const uA: string = Browser.userAgent;
        const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel XL Build/PPP3.180510.008) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36';
        beforeAll((done: DoneFn) => {
            Browser.userAgent = androidUserAgent;
            const model: ScheduleModel = {
                width: 300, height: '500px',
                selectedDate: new Date(2018, 3, 1),
                views: ['Day', 'Week', 'WorkWeek', 'Month', 'Agenda', 'MonthAgenda'],
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', name: 'Rooms',
                    dataSource: [
                        { Text: 'Room 1', Id: 1, Color: '#ffaa00' },
                        { Text: 'Room 2', Id: 2, Color: '#f8a398' }
                    ]
                }, {
                    field: 'OwnerId', name: 'Owners', dataSource: []
                }]
            };
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
            Browser.userAgent = uA;
        });

        it('last level resource datasource is not defined', () => {
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(0);
        });

        it('last level resource datasource is defined', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toBeGreaterThan(0);
                done();
            };
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(0);
            schObj.resources[1].dataSource = [
                { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }
            ];
            schObj.dataBind();
        });
    });

    describe('Event Color by resources for timeline view', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '550px',
                views: ['TimelineWeek'],
                selectedDate: new Date(2018, 3, 1),
                group: { resources: ['Rooms', 'Owners'] },
                resources: [{
                    field: 'RoomId', name: 'Rooms',
                    dataSource: [
                        { Text: 'Room 1', Id: 1, Color: '#cb6bb2' },
                        { Text: 'Room 2', Id: 2, Color: '#56ca85' }
                    ]
                }, {
                    field: 'OwnerId', name: 'Owners',
                    dataSource: [
                        { Text: 'Nancy', Id: 1, GroupID: 1, Color: '#ffaa00' },
                        { Text: 'Steven', Id: 2, GroupID: 2, Color: '#f8a398' },
                        { Text: 'Michael', Id: 3, GroupID: 1, Color: '#7499e1' }
                    ]
                }],
                eventSettings: { resourceColorField: 'Owners', dataSource: resourceData }
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('event color by owner', () => {
            const eventBg: string = (schObj.element.querySelector('.e-appointment') as HTMLElement).style.backgroundColor;
            expect(eventBg).toEqual('rgb(255, 170, 0)');
        });

        it('event color by rooms', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventBg: string = (schObj.element.querySelector('.e-appointment') as HTMLElement).style.backgroundColor;
                expect(eventBg).toEqual('rgb(203, 107, 178)');
                done();
            };
            schObj.eventSettings.resourceColorField = 'Rooms';
            schObj.dataBind();
        });
    });

    describe('Checking scroll to resource public method', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '480px', height: '360px',
                views: ['Week', 'Month', 'TimelineMonth'],
                selectedDate: new Date(2017, 10, 1),
                group: {
                    resources: ['Projects', 'Categories']
                },
                resources: [
                    {
                        field: 'ProjectId', title: 'Choose Project', name: 'Projects',
                        dataSource: [
                            { text: 'PROJECT 1', id: '1', color: '#cb6bb2' },
                            { text: 'PROJECT 2', id: '2', color: '#56ca85' },
                            { text: 'PROJECT 3', id: '3', color: '#df5286' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'TaskId', title: 'Category',
                        name: 'Categories', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: '1', color: '#df5286' },
                            { text: 'Steven', id: 2, groupId: '1', color: '#7fa900' },
                            { text: 'Robert', id: 3, groupId: '2', color: '#ea7a57' },
                            { text: 'Smith', id: 4, groupId: '2', color: '#5978ee' },
                            { text: 'Micheal', id: 5, groupId: '3', color: '#df5286' },
                            { text: 'Root', id: 6, groupId: '3', color: '#00bdae' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color'
                    }
                ]
            };
            schObj = util.createSchedule(model, [], done);
        });
        beforeEach((done: DoneFn) => done());
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking scroll to resource method on Week view', () => {
            schObj.scrollToResource(3);
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollLeft).toEqual(504);
            schObj.scrollToResource(1, 'Categories');
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollLeft).toEqual(0);
            schObj.scrollToResource('2', 'Projects');
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollLeft).toEqual(504);
            schObj.currentView = 'TimelineMonth';
            schObj.dataBind();
        });
        it('Checking scroll to resource method on Timeline month view', () => {
            schObj.scrollToResource(3);
            const conWrap: HTMLElement = schObj.element.querySelector('.e-content-wrap') as HTMLElement;
            expect(conWrap.scrollTop).toEqual(240);
            schObj.scrollToResource(1, 'Categories');
            expect(conWrap.scrollTop).toBeGreaterThanOrEqual(59);
            schObj.scrollToResource('2', 'Projects');
            expect(conWrap.scrollTop).toEqual(180);
            util.triggerScrollEvent(conWrap, conWrap.scrollTop);
            (schObj.element.querySelector('.e-resource-tree-icon.e-resource-collapse') as HTMLElement).click();
            schObj.scrollToResource(1, 'Categories');
            expect(conWrap.scrollTop).toBeGreaterThanOrEqual(59);
        });
    });

    describe('EJ2-55924-Resource appointments are rendered in default appointment colors', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                height: '580px', selectedDate: new Date(2018, 4, 1),
                group: {
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [0, 1, 2, 3], startHour: '00:00', endHour: '08:00', css: 'e-na' },
                            { text: 'Steven', id: 2, groupId: 2, color: '#f8a398', workDays: [3, 4], startHour: '08:00', endHour: '16:00', css: 'e-st' },
                            { text: 'Michael', id: 3, groupId: 1, color: '#7499e1', startHour: '16:00', endHour: '23:59', css: 'e-mi' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color',
                        workDaysField: 'workDays', startHourField: 'startHour', endHourField: 'endHour', cssClassField: 'css'
                    }],
                views: [
                    { option: 'TimelineYear', orientation: 'Vertical', displayName: 'VerticalYear' }
                ]
            };
            schObj = util.createSchedule(model, resourceGroupData, done);
        });
        beforeEach((done: DoneFn) => done());
        afterAll(() => {
            util.destroy(schObj);
        });
        it('Checking resource appointment color', () => {
            const appElements: NodeListOf<Element> = schObj.element.querySelectorAll('[data-id="Appointment_1"]');
            expect((appElements[0] as HTMLElement).style.backgroundColor).toEqual('rgb(255, 170, 0)');
            expect((appElements[1] as HTMLElement).style.backgroundColor).toEqual('rgb(116, 153, 225)');
            expect((appElements[2] as HTMLElement).style.backgroundColor).toEqual('rgb(248, 163, 152)');
        });
    });

    describe('custom workDays with group by date support for vertical views', () => {
        let schObj: Schedule;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '650px',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    byGroupID: false,
                    byDate: true,
                    hideNonWorkingDays: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [1, 2, 3, 4], startHour: '00:00', endHour: '08:00', css: 'e-na' },
                            { text: 'Steven', id: 2, groupId: 2, color: '#f8a398', workDays: [3, 4], startHour: '08:00', endHour: '16:00', css: 'e-st' },
                            { text: 'Michael', id: 3, groupId: 1, color: '#7499e1', workDays: [2, 6], startHour: '16:00', endHour: '23:59', css: 'e-mi' }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color',
                        workDaysField: 'workDays', startHourField: 'startHour', endHourField: 'endHour', cssClassField: 'css'
                    }
                ],
                views: ['Day', 'Week', 'WorkWeek'],
                currentView: 'Week'
            };
            schObj = util.createSchedule(model, resourceData, done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checked resources and dates checked for week view', () => {
            expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(6);
            expect(schObj.element.querySelectorAll('.e-header-day')[0].innerHTML).toEqual('Mon');
            expect(schObj.element.querySelectorAll('.e-header-day')[1].innerHTML).toEqual('Tue');
            expect(schObj.element.querySelectorAll('.e-header-day')[2].innerHTML).toEqual('Wed');
            expect(schObj.element.querySelectorAll('.e-header-day')[3].innerHTML).toEqual('Thu');
            expect(schObj.element.querySelectorAll('.e-header-day')[4].innerHTML).toEqual('Sat');
            expect(schObj.element.querySelector('[data-id="Appointment_5"]').children[1].firstElementChild.innerHTML).toBe('Conference');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[0] as HTMLElement, 'click');
            const saveButton: HTMLElement = schObj.element.querySelector('.e-event-create') as HTMLElement;
            saveButton.click();
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
        });

        it('checked for different resource for week view ', () => {
            const middleResource: HTMLCollection = schObj.element.querySelectorAll('.e-header-row')[2].children;
            expect(middleResource[0].firstElementChild.innerHTML).toEqual('Nancy');
            expect(middleResource[15].firstElementChild.innerHTML).toEqual('Michael');
            expect(middleResource[7].firstElementChild.innerHTML).toEqual('Steven');
        });

        it('checked for resources length for week view', () => {
            expect(schObj.element.querySelectorAll('.e-header-row')[2].children.length).toEqual(16);
        });

        it('checked colspan for week view', () => {
            const firstLevelResource: NodeListOf<Element> = schObj.element.querySelectorAll('.e-header-cells');
            expect(firstLevelResource[1].getAttribute('colspan')).toEqual('2');
            expect(firstLevelResource[2].getAttribute('colspan')).toEqual('4');
            expect(firstLevelResource[3].getAttribute('colspan')).toEqual('4');
            expect(firstLevelResource[4].getAttribute('colspan')).toEqual('4');
            expect(firstLevelResource[5].getAttribute('colspan')).toEqual('2');
        });

        it('checked resources and dates for day view', (done: DoneFn) => {
            const firstLevelResource: NodeListOf<Element> = schObj.element.querySelectorAll('.e-header-cells');
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(2);
                expect(schObj.element.querySelectorAll('.e-header-day')[0].innerHTML).toEqual('Mon');
                expect(firstLevelResource[1].getAttribute('colspan')).toEqual('2');
                expect(schObj.element.querySelectorAll('.e-header-row')[2].firstElementChild.firstElementChild.innerHTML).toEqual('Nancy');
                expect(schObj.element.querySelectorAll('.e-header-row')[2].children.length).toEqual(2);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };

            schObj.currentView = 'Day';
            schObj.dataBind();
        });

        it('checked next date checked for day view', (done: DoneFn) => {
            const nextElement: HTMLElement = schObj.element.querySelector('.e-next');
            util.triggerMouseEvent(nextElement as HTMLElement, 'click');
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(2);
                expect(schObj.element.querySelectorAll('.e-header-day')[0].innerHTML).toEqual('Tue');
                expect(schObj.element.querySelectorAll('.e-header-row')[2].firstElementChild.firstElementChild.innerHTML).toEqual('Nancy');
                expect(schObj.element.querySelectorAll('.e-header-row')[2].lastElementChild.firstElementChild.innerHTML).toEqual('Michael');
                expect(schObj.element.querySelectorAll('.e-header-row')[2].children.length).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                expect(schObj.element.querySelector('[data-id="Appointment_5"]').children[1].firstElementChild.innerHTML).toBe('Conference');
                done();
            };
            schObj.currentView = 'Day';
            schObj.dataBind();
        });

        it('checked next date colspan for day view', () => {
            const firstLevelResource: NodeListOf<Element> = schObj.element.querySelectorAll('.e-header-cells');
            expect(firstLevelResource[1].getAttribute('colspan')).toEqual('4');
        });

        it('checked previous date checked for day view', (done: DoneFn) => {
            const previousElement: HTMLElement = schObj.element.querySelector('.e-prev');
            util.triggerMouseEvent(previousElement as HTMLElement, 'click');
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(2);
                expect(schObj.element.querySelectorAll('.e-header-day')[0].innerHTML).toEqual('Mon');
                expect(schObj.element.querySelectorAll('.e-header-row')[2].firstElementChild.firstElementChild.innerHTML).toEqual('Nancy');
                expect(schObj.element.querySelectorAll('.e-header-row')[2].children.length).toEqual(2);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };
            schObj.currentView = 'Day';
            schObj.dataBind();
        });

        it('checked previous date colspan for day view', () => {
            const firstLevelResource: NodeListOf<Element> = schObj.element.querySelectorAll('.e-header-cells');
            expect(firstLevelResource[1].getAttribute('colspan')).toEqual('2');
        });

        it('checked resources and dates checked for workweek view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-header-day')[0].innerHTML).toEqual('Mon');
                expect(schObj.element.querySelectorAll('.e-header-day')[1].innerHTML).toEqual('Tue');
                expect(schObj.element.querySelectorAll('.e-header-day')[2].innerHTML).toEqual('Wed');
                expect(schObj.element.querySelectorAll('.e-header-day')[3].innerHTML).toEqual('Thu');
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                expect(schObj.element.querySelector('[data-id="Appointment_5"]').children[1].firstElementChild.innerHTML).toBe('Conference');
                done();
            };
            schObj.currentView = 'WorkWeek';
            schObj.dataBind();
        });

        it('checked colspan for workweek view', () => {
            const firstLevelResource: NodeListOf<Element> = schObj.element.querySelectorAll('.e-header-cells');
            expect(firstLevelResource[1].getAttribute('colspan')).toEqual('2');
            expect(firstLevelResource[2].getAttribute('colspan')).toEqual('4');
            expect(firstLevelResource[3].getAttribute('colspan')).toEqual('4');
            expect(firstLevelResource[4].getAttribute('colspan')).toEqual('4');
        });

        it('checked for different resource for workweek view', () => {
            const middleResource: HTMLCollection = schObj.element.querySelectorAll('.e-header-row')[2].children;
            expect(middleResource[0].firstElementChild.innerHTML).toEqual('Nancy');
            expect(middleResource[13].firstElementChild.innerHTML).toEqual('Steven');
            expect(middleResource[3].firstElementChild.innerHTML).toEqual('Michael');
        });

        it('checked for resources length for workweek view', () => {
            expect(schObj.element.querySelectorAll('.e-header-row')[2].children.length).toEqual(14);
        });
    });

    describe('custom workDays with group by date support for month view', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: DoneFn) => {
            const model: ScheduleModel = {
                width: '100%',
                height: '650px',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    byDate: true,
                    hideNonWorkingDays: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [1, 2, 3, 4] },
                            { text: 'Steven', id: 2, groupId: 2, color: '#f8a398', workDays: [3, 4] },
                            { text: 'Michael', id: 3, groupId: 1, color: '#7499e1', workDays: [2, 6] }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color', workDaysField: 'workDays'
                    }
                ],
                views: ['Day', 'Week', 'WorkWeek', 'Month'],
                currentView: 'Month'
            };
            schObj = util.createSchedule(model, resourceData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checked layout rendering with enabled hideNonWorkingDays property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-work-cells')[20].lastElementChild.classList).toContain('e-appointment-wrapper');
                done();
            };
            expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(5);
            expect((schObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement).innerText).toEqual('Mon');
            expect((schObj.element.querySelectorAll('.e-header-cells')[4] as HTMLElement).innerText).toEqual('Sat');
            expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(7);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(8);
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(40);
            expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
            expect(schObj.element.querySelectorAll('.e-work-cells')[4].getAttribute('data-group-index')).toEqual('2');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[20] as HTMLElement, 'click');
            const saveButton: HTMLElement = schObj.element.querySelector('.e-event-create') as HTMLElement;
            saveButton.click();
        });

        it('checked layout rendering with enabled hideNonWorkingDays and disabled showWeekend property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(4);
                expect((schObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement).innerText).toEqual('Mon');
                expect((schObj.element.querySelectorAll('.e-header-cells')[3] as HTMLElement).innerText).toEqual('Thu');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(6);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(7);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(35);
                expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[6].getAttribute('data-group-index')).toEqual('2');
                expect(schObj.element.querySelectorAll('.e-week-number-wrapper tbody tr').length).toBe(5);
                expect(schObj.element.querySelector('.e-week-number').innerHTML).toEqual('14');
                done();
            };
            schObj.showWeekend = false;
            schObj.showWeekNumber = true;
            schObj.dataBind();
        });

        it('checked layout rendering with enabled hideNonWorkingDays and schedule workdays property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(3);
                expect((schObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement).innerText).toEqual('Mon');
                expect((schObj.element.querySelectorAll('.e-header-cells')[2] as HTMLElement).innerText).toEqual('Sat');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(20);
                expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[3].getAttribute('data-group-index')).toEqual('1');
                expect(schObj.element.querySelectorAll('.e-week-number').length).toEqual(0);
                done();
            };
            schObj.showWeekNumber = false;
            schObj.workDays = [1, 3, 6];
            schObj.dataBind();
        });

        it('checked layout rendering with enabled hideNonWorkingDays and firstDayOfWeek property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(3);
                expect((schObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement).innerText).toEqual('Wed');
                expect((schObj.element.querySelectorAll('.e-header-cells')[2] as HTMLElement).innerText).toEqual('Mon');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(20);
                expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[3].getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-header-cells')[0].getAttribute('colspan')).toEqual('2');
                expect(schObj.element.querySelectorAll('.e-header-cells')[1].getAttribute('colspan')).toEqual('1');
                done();
            };
            schObj.firstDayOfWeek = 2;
            schObj.dataBind();
        });

        it('checked layout rendering with disabled hideNonWorkingDays', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(7);
                expect((schObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement).innerText).toEqual('Sun');
                expect((schObj.element.querySelectorAll('.e-header-cells')[4] as HTMLElement).innerText).toEqual('Thu');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(14);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(21);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(12);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(105);
                expect(schObj.element.querySelectorAll('.e-header-cells')[0].getAttribute('colspan')).toEqual('3');
                expect(schObj.element.querySelector('.e-resource-cells').getAttribute('colspan')).toEqual('2');
                done();
            };
            schObj.firstDayOfWeek = 0;
            schObj.workDays = [1, 2, 3, 4, 5];
            schObj.group.hideNonWorkingDays = false;
            schObj.showWeekend = true;
            schObj.dataBind();
        });

        it('checked layout rendering with enabled hideNonWorkingDays and allowInline', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                done();
            };
            schObj.group.hideNonWorkingDays = true;
            schObj.allowInline = true;
            schObj.dataBind();
        });

        it('Adding inline appointments with hideNonWorkingDays', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(6);
                expect((eventElementList[4].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Testing');
                done();
            };
            const targetWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[19] as HTMLElement;
            util.triggerMouseEvent(targetWorkCell, 'click');
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            const inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Testing';
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });
        });

        it('checked hideNonWorkingDays property without providing workdays field in resource datasource', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-cells').length).toEqual(5);
                expect((schObj.element.querySelectorAll('.e-header-cells')[0] as HTMLElement).innerText).toEqual('Mon');
                expect((schObj.element.querySelectorAll('.e-header-cells')[4] as HTMLElement).innerText).toEqual('Fri');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(10);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(15);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(8);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(75);
                expect(schObj.element.querySelectorAll('.e-header-cells')[0].getAttribute('colspan')).toEqual('3');
                expect(schObj.element.querySelector('.e-resource-cells').getAttribute('colspan')).toEqual('2');
                done();
            };
            schObj.allowInline = false;
            schObj.resources[1].dataSource = [
                { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                { text: 'Steven', id: 2, groupId: 2, color: '#f8a398' },
                { text: 'Michael', id: 3, groupId: 1, color: '#7499e1' }
            ];
            schObj.dataBind();
        });
    });

    describe('custom workDays with group by date support for Week view', () => {
        let schObj: Schedule;
        let keyModule: any;
        let model: ScheduleModel;
        beforeAll((done: DoneFn) => {
            model = {
                width: '100%',
                height: '650px',
                selectedDate: new Date(2018, 3, 1),
                group: {
                    byDate: true,
                    hideNonWorkingDays: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [1, 2, 3, 4] },
                            { text: 'Steven', id: 2, groupId: 2, color: '#f8a398', workDays: [3, 4] },
                            { text: 'Michael', id: 3, groupId: 1, color: '#7499e1', workDays: [2, 6] }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color', workDaysField: 'workDays'
                    }
                ],
                views: ['Day', 'Week', 'WorkWeek', 'Month'],
                currentView: 'Week'
            };
            schObj = util.createSchedule(model, resourceData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('checked layout rendering with enabled hideNonWorkingDays property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-all-day-appointment').length).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-appointment-wrapper')[4].childElementCount).toBe(1);
                done();
            };
            expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
            expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(5);
            expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Mon');
            expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Sat');
            expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(7);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(8);
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
            expect(schObj.element.querySelectorAll('.e-all-day-appointment').length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(384);
            expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
            expect(schObj.element.querySelectorAll('.e-work-cells')[4].getAttribute('data-group-index')).toEqual('2');
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[180] as HTMLElement, 'click');
            expect(schObj.element.querySelectorAll('.e-appointment-wrapper')[4].childElementCount).toBe(0);
            const saveButton: HTMLElement = schObj.element.querySelector('.e-event-create') as HTMLElement;
            saveButton.click();
        });

        it('checked layout rendering with enabled hideNonWorkingDays and disabled showWeekend property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
                expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(4);
                expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Mon');
                expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Thu');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(6);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(7);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-all-day-appointment').length).toEqual(1);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(336);
                expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[6].getAttribute('data-group-index')).toEqual('2');
                expect(schObj.element.querySelector('.e-left-indent-wrap td').classList).toContain('e-week-number');
                expect((schObj.element.querySelector('.e-week-number') as HTMLElement).innerText).toEqual('14');
                expect((schObj.element.querySelector('.e-schedule-toolbar .e-date-range') as HTMLElement).innerText).toEqual('April 02 - 06, 2018');
                done();
            };
            schObj.showWeekend = false;
            schObj.showWeekNumber = true;
            schObj.dataBind();
        });

        it('checked layout rendering with enabled hideNonWorkingDays and schedule workdays property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
                expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(3);
                expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Mon');
                expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Sat');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
                expect(schObj.element.querySelectorAll('.e-all-day-appointment').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(192);
                expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[3].getAttribute('data-group-index')).toEqual('1');
                expect(schObj.element.querySelector('.e-left-indent-wrap td').classList.contains('e-week-number')).toBeFalsy();
                expect((schObj.element.querySelector('.e-schedule-toolbar .e-date-range') as HTMLElement).innerText).toEqual('April 02 - 07, 2018');
                done();
            };
            schObj.showWeekNumber = false;
            schObj.workDays = [1, 3, 6];
            schObj.dataBind();
        });

        it('checked layout rendering with enabled hideNonWorkingDays and firstDayOfWeek property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
                expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(3);
                expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Wed');
                expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Mon');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-all-day-appointment').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(192);
                expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[3].getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-header-row td')[0].getAttribute('colspan')).toEqual('2');
                expect(schObj.element.querySelectorAll('.e-header-row')[1].firstElementChild.getAttribute('colspan')).toEqual('1');
                expect((schObj.element.querySelector('.e-schedule-toolbar .e-date-range') as HTMLElement).innerText).toEqual('Mar 28 - Apr 02, 2018');
                done();
            };
            schObj.firstDayOfWeek = 2;
            schObj.dataBind();
        });

        it('checked layout rendering with disabled hideNonWorkingDays', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
                expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(7);
                expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Sun');
                expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Sat');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(14);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(21);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(11);
                expect(schObj.element.querySelectorAll('.e-all-day-appointment').length).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(1008);
                expect(schObj.element.querySelectorAll('.e-header-row td')[0].getAttribute('colspan')).toEqual('3');
                expect(schObj.element.querySelectorAll('.e-header-row')[1].firstElementChild.getAttribute('colspan')).toEqual('2');
                done();
            };
            schObj.firstDayOfWeek = 0;
            schObj.workDays = [1, 2, 3, 4, 5];
            schObj.group.hideNonWorkingDays = false;
            schObj.showWeekend = true;
            schObj.dataBind();
        });

        it('checked layout rendering with enabled hideNonWorkingDays and allowInline', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-all-day-appointment').length).toEqual(1);
                done();
            };
            schObj.group.hideNonWorkingDays = true;
            schObj.allowInline = true;
            schObj.dataBind();
        });

        it('Adding inline appointments with hideNonWorkingDays', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(6);
                expect((eventElementList[2].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Testing');
                done();
            };
            const targetWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[163] as HTMLElement;
            util.triggerMouseEvent(targetWorkCell, 'click');
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            const inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Testing';
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });
        });

        it('Adding allday inline appointments with hideNonWorkingDays', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                const alldayApp: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-all-day-appointment'));
                expect(eventElementList.length).toEqual(7);
                expect(alldayApp.length).toEqual(2);
                expect((alldayApp[0].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Allday appointment');
                done();
            };
            const targetWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-all-day-cells')[2] as HTMLElement;
            util.triggerMouseEvent(targetWorkCell, 'click');
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            const inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Allday appointment';
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });
        });

        it('checked hideNonWorkingDays property without providing workdays field in resource datasource', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(9);
                expect(schObj.element.querySelectorAll('.e-all-day-appointment').length).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
                expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(5);
                expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Mon');
                expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Fri');
                expect(schObj.element.querySelectorAll('.e-header-row')[1].childElementCount).toEqual(10);
                expect(schObj.element.querySelectorAll('.e-header-row')[2].childElementCount).toEqual(15);
                expect(schObj.element.querySelector('.e-all-day-row').childElementCount).toEqual(15);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(720);
                expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[1].getAttribute('data-group-index')).toEqual('1');
                expect(schObj.element.querySelectorAll('.e-work-cells')[2].getAttribute('data-group-index')).toEqual('2');
                done();
            };
            schObj.allowInline = false;
            schObj.resources[1].dataSource = [
                { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                { text: 'Steven', id: 2, groupId: 2, color: '#f8a398' },
                { text: 'Michael', id: 3, groupId: 1, color: '#7499e1' }
            ];
            schObj.dataBind();
        });
    });

    describe('custom workDays with group byDate hideNonWorkingDays property for Week view', () => {
        let schObj: Schedule;
        let keyModule: any;
        let model: ScheduleModel;
        beforeAll((done: DoneFn) => {
            model = {
                width: '100%',
                height: '650px',
                selectedDate: new Date(2018, 3, 1),
                timeScale: {
                    enable: false
                },
                group: {
                    byDate: true,
                    hideNonWorkingDays: true,
                    resources: ['Rooms', 'Owners']
                },
                resources: [
                    {
                        field: 'RoomId',
                        title: 'Room',
                        name: 'Rooms', allowMultiple: false,
                        dataSource: [
                            { text: 'ROOM 1', id: 1, color: '#cb6bb2' },
                            { text: 'ROOM 2', id: 2, color: '#56ca85' }
                        ],
                        textField: 'text', idField: 'id', colorField: 'color'
                    }, {
                        field: 'OwnerId',
                        title: 'Owner',
                        name: 'Owners', allowMultiple: true,
                        dataSource: [
                            { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00', workDays: [1, 2, 3, 4] },
                            { text: 'Steven', id: 2, groupId: 2, color: '#f8a398', workDays: [3, 4] },
                            { text: 'Michael', id: 3, groupId: 1, color: '#7499e1', workDays: [2, 6] }
                        ],
                        textField: 'text', idField: 'id', groupIDField: 'groupId', colorField: 'color', workDaysField: 'workDays'
                    }
                ],
                views: ['Day', 'Week', 'WorkWeek', 'Month'],
                currentView: 'Week'
            };
            schObj = util.createSchedule(model, resourceData, done);
            keyModule = schObj.keyboardInteractionModule;
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Checking Timescale disabled layout', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-work-cells')[4].childElementCount).toBe(1);
                done();
            };
            expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
            expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(5);
            expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Mon');
            expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Sat');
            expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(7);
            expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(8);
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(4);
            expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(8);
            expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
            expect(schObj.element.querySelectorAll('.e-work-cells')[4].getAttribute('data-group-index')).toEqual('2');
            expect(schObj.element.querySelectorAll('.e-work-cells')[4].childElementCount).toBe(0);
            util.triggerMouseEvent(schObj.element.querySelectorAll('.e-work-cells')[4] as HTMLElement, 'click');
            const saveButton: HTMLElement = schObj.element.querySelector('.e-event-create') as HTMLElement;
            saveButton.click();
        });

        it('checked layout rendering with timescale disabled and disabled showWeekend property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
                expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(4);
                expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Mon');
                expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Thu');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(6);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(7);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(7);
                expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[6].getAttribute('data-group-index')).toEqual('2');
                expect((schObj.element.querySelector('.e-schedule-toolbar .e-date-range') as HTMLElement).innerText).toEqual('April 02 - 06, 2018');
                done();
            };
            schObj.showWeekend = false;
            schObj.dataBind();
        });

        it('checked layout rendering with timescale disabled and schedule workdays property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
                expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(3);
                expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Mon');
                expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Sat');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(4);
                expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[3].getAttribute('data-group-index')).toEqual('1');
                expect((schObj.element.querySelector('.e-schedule-toolbar .e-date-range') as HTMLElement).innerText).toEqual('April 02 - 07, 2018');
                done();
            };
            schObj.workDays = [1, 3, 6];
            schObj.dataBind();
        });

        it('checked layout rendering with timescale disabled and firstDayOfWeek property', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
                expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(3);
                expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Wed');
                expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Mon');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(4);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(0);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(4);
                expect(schObj.element.querySelector('.e-work-cells').getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[3].getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-header-row td')[0].getAttribute('colspan')).toEqual('2');
                expect(schObj.element.querySelectorAll('.e-header-row')[1].firstElementChild.getAttribute('colspan')).toEqual('1');
                expect((schObj.element.querySelector('.e-schedule-toolbar .e-date-range') as HTMLElement).innerText).toEqual('Mar 28 - Apr 02, 2018');
                done();
            };
            schObj.firstDayOfWeek = 2;
            schObj.dataBind();
        });

        it('checked layout rendering with timescale and hideNonWorkingDays disabled', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
                expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(7);
                expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Sun');
                expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Sat');
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[1].childElementCount).toEqual(14);
                expect(schObj.element.querySelectorAll('.e-date-header-wrap tbody tr')[2].childElementCount).toEqual(21);
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(11);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(21);
                expect(schObj.element.querySelectorAll('.e-header-row td')[0].getAttribute('colspan')).toEqual('3');
                expect(schObj.element.querySelectorAll('.e-header-row')[1].firstElementChild.getAttribute('colspan')).toEqual('2');
                done();
            };
            schObj.firstDayOfWeek = 0;
            schObj.workDays = [1, 2, 3, 4, 5];
            schObj.group.hideNonWorkingDays = false;
            schObj.showWeekend = true;
            schObj.dataBind();
        });

        it('checked layout rendering with with timescale disabled and enabling hideNonWorkingDays and allowInline', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(5);
                done();
            };
            schObj.group.hideNonWorkingDays = true;
            schObj.allowInline = true;
            schObj.dataBind();
        });

        it('Adding inline appointments with timescale disabled', (done: DoneFn) => {
            schObj.dataBound = () => {
                const eventElementList: Element[] = [].slice.call(schObj.element.querySelectorAll('.e-appointment'));
                expect(eventElementList.length).toEqual(6);
                expect((eventElementList[0].querySelector('.e-subject') as HTMLElement).innerHTML).toBe('Testing');
                done();
            };
            const targetWorkCell: HTMLElement = schObj.element.querySelectorAll('.e-work-cells')[1] as HTMLElement;
            util.triggerMouseEvent(targetWorkCell, 'click');
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            expect(schObj.element.querySelector('.e-inline-appointment')).toBeTruthy();
            const inputElement: HTMLInputElement = schObj.element.querySelector('.e-inline-subject') as HTMLInputElement;
            expect(inputElement.classList.contains('e-inline-subject')).toBeTruthy();
            inputElement.value = 'Testing';
            keyModule.keyActionHandler({ action: 'enter', target: schObj.element.querySelector('.e-inline-subject') });
        });

        it('checked timescale disabled without providing workdays field in resource datasource', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(8);
                expect(schObj.element.querySelectorAll('.e-header-row').length).toEqual(3);
                expect(schObj.element.querySelector('.e-header-row').childElementCount).toEqual(5);
                expect((schObj.element.querySelector('.e-header-row td').firstElementChild as HTMLElement).innerText).toEqual('Mon');
                expect((schObj.element.querySelector('.e-header-row').lastElementChild.firstElementChild as HTMLElement).innerText).toEqual('Fri');
                expect(schObj.element.querySelectorAll('.e-header-row')[1].childElementCount).toEqual(10);
                expect(schObj.element.querySelectorAll('.e-header-row')[2].childElementCount).toEqual(15);
                expect(schObj.element.querySelectorAll('.e-work-cells').length).toEqual(15);
                expect(schObj.element.querySelectorAll('.e-work-cells')[0].getAttribute('data-group-index')).toEqual('0');
                expect(schObj.element.querySelectorAll('.e-work-cells')[1].getAttribute('data-group-index')).toEqual('1');
                expect(schObj.element.querySelectorAll('.e-work-cells')[2].getAttribute('data-group-index')).toEqual('2');
                done();
            };
            schObj.allowInline = false;
            schObj.resources[1].dataSource = [
                { text: 'Nancy', id: 1, groupId: 1, color: '#ffaa00' },
                { text: 'Steven', id: 2, groupId: 2, color: '#f8a398' },
                { text: 'Michael', id: 3, groupId: 1, color: '#7499e1' }
            ];
            schObj.dataBind();
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        expect(average).toBeLessThan(10);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});
