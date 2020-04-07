/**
 * Schedule resource base spec 
 */
import { isNullOrUndefined, Browser } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { Popup } from '@syncfusion/ej2-popups';
import {
    Schedule, Day, Week, WorkWeek, Month, Agenda, MonthAgenda,
    ResourceDetails, EJ2Instance, ScheduleModel, TimelineViews, ActionEventArgs
} from '../../../src/schedule/index';
import { resourceData } from '../base/datasource.spec';
import * as util from '../util.spec';
import { profile, inMB, getMemoryProfile } from '../../common.spec';

Schedule.Inject(Day, Week, WorkWeek, Month, Agenda, MonthAgenda, TimelineViews);

describe('Schedule Resources', () => {
    beforeAll(() => {
        // tslint:disable:no-any
        const isDef: (o: any) => boolean = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            // tslint:disable-next-line:no-console
            console.log('Unsupported environment, window.performance.memory is unavailable');
            (this as any).skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Multiple resource', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
            let eventBg: string = (schObj.element.querySelector('.e-appointment') as HTMLElement).style.backgroundColor;
            expect(eventBg).toEqual('rgb(255, 170, 0)');
        });

        it('event color by rooms', (done: Function) => {
            schObj.dataBound = () => {
                let eventBg: string = (schObj.element.querySelector('.e-appointment') as HTMLElement).style.backgroundColor;
                expect(eventBg).toEqual('rgb(203, 107, 178)');
                done();
            };
            schObj.eventSettings.resourceColorField = 'Rooms';
            schObj.dataBind();
        });
    });

    describe('Multiple resource with group', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
            let eventPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('headerdate checking in workweek view', () => {
            expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toEqual(11);
        });

        it('headerdate checking in week view', (done: DoneFn) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-date-header-wrap .e-header-cells').length).toEqual(21);
                done();
            };
            schObj.currentView = 'Week';
            schObj.dataBind();
        });
    });

    describe('Multiple resource group with custom workdays and hours', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = { width: '100%', height: '550px', selectedDate: new Date(2017, 10, 1) };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('default resource value checking', () => {
            expect(schObj.resources.length).toEqual(0);
            expect(schObj.group.resources.length).toEqual(0);
        });

        it('setmodel group value checking', (done: Function) => {
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

        it('setmodel group value checking', (done: Function) => {
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
            let resourceRow: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-resource-cells.e-parent-node'));
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
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(5);
            let firstRow: HTMLElement = resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
            firstRow.click();
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(6);
        });
        it('resource icon click testing with actionBegin event', () => {
            schObj.actionBegin = (args: ActionEventArgs) => args.cancel = true;
            let resourceRow: HTMLElement = schObj.element.querySelector('.e-resource-column-wrap tbody') as HTMLElement;
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(6);
            let firstRow: HTMLElement = resourceRow.children[1].querySelector('.e-resource-cells div.e-resource-tree-icon') as HTMLElement;
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

    describe('Public methods for resoure expand/collpase ', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
                ],
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });
        it('To check for resource expand', () => {
            schObj.expandResource(1, "Rooms");
            expect((schObj.element.querySelectorAll('.e-resource-expand')).length).toEqual(1);
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(7);
            expect((schObj.element.querySelector('[data-group-index="0"]')).classList.contains("e-parent-node")).toEqual(true);
            expect((schObj.element.querySelector('[data-group-index="0"] .e-resource-tree-icon')).classList.contains("e-resource-collapse")).toEqual(true);
            
        });
        it('To check for resource collapse', () => {
            schObj.collapseResource(2, "Rooms");
            expect((schObj.element.querySelectorAll('.e-resource-collpase')).length).toEqual(0);
            expect(schObj.element.querySelectorAll('.e-resource-column-wrap tbody tr:not(.e-hidden)').length).toEqual(5);
            expect((schObj.element.querySelector('[data-group-index="3"]')).classList.contains("e-parent-node")).toEqual(true);
            expect((schObj.element.querySelector('[data-group-index="3"] .e-resource-tree-icon')).classList.contains("e-resource-expand")).toEqual(true);
        });
    })

    describe('Public methods checking for resources', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
            expect((<Object[]>schObj.resources.slice(-1)[0].dataSource).length).toEqual(3);
        });

        it('quick cell popup testing', () => {
            let morePopup: Popup = schObj.quickPopup.morePopup;
            schObj.quickPopup.morePopup = null;
            let workCell: HTMLElement = schObj.element.querySelector('.e-work-cells') as HTMLElement;
            util.triggerMouseEvent(workCell, 'click');
            let quickPopup: HTMLElement = schObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement;
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
            expect((<Object[]>schObj.resourceCollection.slice(-1)[0].dataSource).length).toEqual(4);
        });

        it('Public method for remove resource', () => {
            schObj.removeResource(11, 'Owners');
            expect((<Object[]>schObj.resourceCollection.slice(-1)[0].dataSource).length).toEqual(3);
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
                width: '100%', height: '550px',
                selectedDate: new Date(),
                group: { resources: ['Rooms'] },
                resources: [{
                    field: 'RoomId', title: 'Room',
                    name: 'Rooms', allowMultiple: true,
                    dataSource: [],
                    textField: 'Text', idField: 'Id', colorField: 'Color'
                }],
            };
            schObj = util.createSchedule(model, [], done);
        });
        afterAll(() => {
            util.destroy(schObj);
        });

        it('Test eventwindow and datasource length', (done: Function) => {
            schObj.dataBound = () => {
                expect(!isNullOrUndefined(schObj.eventWindow)).toEqual(true);
                expect((schObj.resourceCollection[0].dataSource as Object[]).length).toEqual(1);
                done();
            };
            let roomDetails: Object = { Id: 1, Text: 'Meeting Room', Color: '#000' };
            schObj.addResource(roomDetails, 'Rooms', 0);
        });
    });

    describe('Keyboard interactions with multiple resource grouping', () => {
        let schObj: Schedule;
        let keyModule: any;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[428];
            util.triggerMouseEvent(workCells[428], 'mousedown');
            util.triggerMouseEvent(workCells[495], 'mousemove');
            util.triggerMouseEvent(workCells[495], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
            expect(schObj.element.querySelectorAll('.e-selected-cell').length).toEqual(201);
            expect(focuesdEle.classList).toContain('e-selected-cell');
            expect(focuesdEle.classList).toContain('e-work-cells');
            expect(focuesdEle.getAttribute('aria-selected')).toEqual('true');
            expect(focuesdEle.cellIndex).toEqual(12);
            expect((focuesdEle.parentNode as HTMLTableRowElement).sectionRowIndex).toEqual(23);
        });

        it('multiple work cells selection for other resource', () => {
            keyModule = schObj.keyboardInteractionModule;
            let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
            keyModule.initialTarget = workCells[428];
            util.triggerMouseEvent(workCells[428], 'mousedown');
            util.triggerMouseEvent(workCells[500], 'mousemove');
            util.triggerMouseEvent(workCells[500], 'mouseup');
            let focuesdEle: HTMLTableCellElement = document.activeElement as HTMLTableCellElement;
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
        let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
        beforeAll(() => {
            jasmine.Ajax.install();
            let model: ScheduleModel = {
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
        beforeEach((done: Function) => {
            let request: JasmineAjaxRequest = jasmine.Ajax.requests.mostRecent();
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
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel XL Build/PPP3.180510.008) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidUserAgent;
            let model: ScheduleModel = {
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
            let treePopup: Popup = (schObj.element.querySelector('.e-resource-tree-popup') as EJ2Instance).ej2_instances[0] as Popup;
            treePopup.showAnimation = null;
            treePopup.hideAnimation = null;
            treePopup.dataBind();
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(true);
            let menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            util.triggerMouseEvent(menuElement, 'click');
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(true);
            util.triggerMouseEvent(menuElement, 'click');
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(false);
        });

        it('document click testing', () => {
            let menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            util.triggerMouseEvent(menuElement, 'click');
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(true);
            let popupWrapper: HTMLElement = schObj.element.querySelector('.e-resource-tree-popup');
            util.triggerMouseEvent(popupWrapper, 'mousedown');
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(true);
            let resourceToolbar: HTMLElement = schObj.element.querySelector('.e-schedule-resource-toolbar') as HTMLElement;
            util.triggerMouseEvent(resourceToolbar, 'mousedown');
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-close')).toEqual(true);
            expect(schObj.element.querySelector('.e-resource-tree-popup').classList.contains('e-popup-open')).toEqual(false);
            expect(schObj.element.querySelector('.e-resource-tree-popup-overlay').classList.contains('e-enable')).toEqual(false);
        });

        it('resource node click testing - child node', () => {
            let menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            util.triggerMouseEvent(menuElement, 'click');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:first-child').innerHTML).toEqual('Room 1');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:last-child').innerHTML).toEqual('Nancy');
            let nodeElement: Element = schObj.element.querySelector('.e-resource-tree .e-list-item:not(.e-has-child):not(.e-active)');
            (schObj.resourceBase as any).resourceClick({ event: new MouseEvent('mouseup'), name: 'nodeClicked', node: nodeElement });
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:first-child').innerHTML).toEqual('Room 1');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:last-child').innerHTML).toEqual('Michael');
        });

        it('resource node click testing - parent node', () => {
            let menuElement: HTMLElement = schObj.element.querySelector('.e-resource-menu .e-icon-menu');
            util.triggerMouseEvent(menuElement, 'click');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:first-child').innerHTML).toEqual('Room 1');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:last-child').innerHTML).toEqual('Michael');
            let nodeElement: Element = schObj.element.querySelector('.e-resource-tree .e-list-item.e-has-child');
            (schObj.resourceBase as any).resourceClick({ event: new MouseEvent('mouseup'), name: 'nodeClicked', node: nodeElement });
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:first-child').innerHTML).toEqual('Room 1');
            expect(schObj.element.querySelector('.e-resource-level-title .e-resource-name:last-child').innerHTML).toEqual('Michael');
            util.triggerMouseEvent(menuElement, 'click');
        });

        it('resource events checked for week view testing', () => {
            expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
        });

        it('resource events checked for day view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };
            schObj.currentView = 'Day';
            schObj.dataBind();
        });

        it('resource events checked for workweek view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(2);
                done();
            };
            schObj.currentView = 'WorkWeek';
            schObj.dataBind();
        });

        it('resource events checked for month view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'Month';
            schObj.dataBind();
        });

        it('resource events checked for agenda view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                done();
            };
            schObj.currentView = 'Agenda';
            schObj.dataBind();
        });

        it('resource events checked for monthAgenda view testing', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(1);
                done();
            };
            schObj.currentView = 'MonthAgenda';
            schObj.dataBind();
        });

        it('Negative case for resource without timescale', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.element.querySelectorAll('.e-appointment').length).toEqual(3);
                expect(schObj.getWorkCellElements().length).toEqual(336);
                let workCells: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
                expect(workCells[126].getAttribute('data-date')).toEqual(new Date(2018, 3, 1, 9, 0).getTime().toString());
                done();
            };
            schObj.currentView = 'Week';
            schObj.dataBind();
        });

        it('Negative case for resource with timescale', (done: Function) => {
            schObj.dataBound = () => {
                expect(schObj.getWorkCellElements().length).toEqual(7);
                let emptyCell: HTMLElement[] = [].slice.call(schObj.element.querySelectorAll('.e-work-cells'));
                expect(isNullOrUndefined(emptyCell[126])).toEqual(true);
                done();
            };
            schObj.timeScale.enable = false;
            schObj.dataBind();
        });
    });

    describe('Negative testcases for resource grouping rendering in mobile device', () => {
        let schObj: Schedule;
        let uA: string = Browser.userAgent;
        let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 9; Pixel XL Build/PPP3.180510.008) ' +
            'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.81 Mobile Safari/537.36';
        beforeAll((done: Function) => {
            Browser.userAgent = androidUserAgent;
            let model: ScheduleModel = {
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
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
            let eventBg: string = (schObj.element.querySelector('.e-appointment') as HTMLElement).style.backgroundColor;
            expect(eventBg).toEqual('rgb(255, 170, 0)');
        });

        it('event color by rooms', (done: Function) => {
            schObj.dataBound = () => {
                let eventBg: string = (schObj.element.querySelector('.e-appointment') as HTMLElement).style.backgroundColor;
                expect(eventBg).toEqual('rgb(203, 107, 178)');
                done();
            };
            schObj.eventSettings.resourceColorField = 'Rooms';
            schObj.dataBind();
        });
    });

    describe('Checking scroll to resource public method', () => {
        let schObj: Schedule;
        beforeAll((done: Function) => {
            let model: ScheduleModel = {
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
                ],
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
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollTop).toEqual(240);
            schObj.scrollToResource(1, 'Categories');
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollTop).toEqual(60);
            schObj.scrollToResource('2', 'Projects');
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollTop).toEqual(180);
            (schObj.element.querySelector('.e-resource-tree-icon.e-resource-collapse') as HTMLElement).click();
            schObj.scrollToResource(1, 'Categories');
            expect((schObj.element.querySelector('.e-content-wrap') as HTMLElement).scrollTop).toEqual(60);
        });
    });

    it('memory leak', () => {
        profile.sample();
        // tslint:disable:no-any
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        // tslint:enable:no-any
    });
});
