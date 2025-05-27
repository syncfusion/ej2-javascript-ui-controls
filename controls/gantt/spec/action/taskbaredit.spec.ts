/**
 * Gantt taskbaredit spec
 */
import { Gantt, ITaskbarEditedEventArgs, Edit, RowDD, ContextMenu } from '../../src/index';
import { DataManager } from '@syncfusion/ej2-data';
import { baselineData, scheduleModeData, splitTasksData, editingData, scheduleModeData1, dragSelfReferenceData, multiTaskbarData, resources, projectData, resourcesData, resourceCollection, multiResources, predecessorOffSetValidation, customCRData, customCrIssue, crDialogEditData, projectSplitTask, MT887459, MT877459, predecessorMT877459, parentPredecessorMT877459, parentMT877459, sengmentData, sengmentCollection, cR893051, dateFormateData, editingResources3, normalResourceData, CR929550, MT915273, segmentResourcesData, SegmentResourceCollection, projectNewData1 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { falseLine } from '../../src/gantt/base/css-constants';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
    describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Left resizing - drop on weekends', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args['name']).toBe('taskbarEditing');
            expect(args.taskBarEditAction).toBe('LeftResizing');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
            expect(args['name']).toBe('taskbarEdited');
            expect(args.taskBarEditAction).toBe('LeftResizing');
            expect(ganttObj.getFormatedDate(args.previousData.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
            expect(args.target.classList.contains('e-taskbar-main-container')).toBe(true);
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -50, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
        ganttObj.hideSpinner();
    });
    it('Left resizing -  drop on weekdays', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args['name']).toBe('taskbarEditing');
            expect(args.taskBarEditAction).toBe('LeftResizing');
            expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args['name']).toBe('taskbarEdited');
            expect(args.taskBarEditAction).toBe('LeftResizing');
            expect(ganttObj.getFormatedDate(args.previousData.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -80, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });
    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Left resizing - editing cancel', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            args.cancel = true;
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });
    it('progress with 0% - editing cancel', () => {
        ganttObj.actionBegin = (args: object) => { };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.data['Progress']).toBe(80);
            args['cancel'] = true;
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.data.ganttProperties.progress).toBe(80);
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });
    it('progress with 0%', () => {
        ganttObj.actionBegin = (args: object) => { };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.data['Progress']).toBe(80);
            expect(args.taskBarEditAction).toBe('ProgressResizing');
            expect(args.editingFields.progress).toBe(0);
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.data.ganttProperties.progress).toBe(0);
            expect(args.taskBarEditAction).toBe('ProgressResizing');
            expect(args.editingFields.progress).toBe(0);
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 0, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Child drag action', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args.taskBarEditAction).toBe('ChildDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
           //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args.taskBarEditAction).toBe('ChildDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Milestone drag action', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/24/2017 08:00');
            expect(args.taskBarEditAction).toBe('MilestoneDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('11/02/2017 08:00');
            expect(args.taskBarEditAction).toBe('MilestoneDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 300, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Parent drag action', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            //expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args.taskBarEditAction).toBe('ParentDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/24/2017 08:00');
            expect(args.taskBarEditAction).toBe('ParentDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr.gridrowtaskIdlevel0.e-chart-row > td > div.e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 300, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Right resizing - editing cancel', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/26/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
            args.cancel = true;
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/26/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    it('Right resizing - edited cancel', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/26/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
        
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'beforeSave') {
                args['cancel'] = true;
            }
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/26/2017 17:00');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });
    it('Right resizing', () => {
        ganttObj.actionBegin = (args: object) => { };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data['EndDate'], 'MM/dd/yyyy HH:mm')).toBe('10/26/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Connector Line Left drag - drop outside the Gantt container', () => {
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'ValidateDependency') {
                expect(args['name']).toBe('actionBegin');
                expect(args['newPredecessorString']).toBe('5SS');
            }
        };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 800, 100);
        triggerMouseEvent(dragElement, 'mouseup');
    });    
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });
    it('Connector Line Left drag - drop inside the Gantt container', () => {
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'ValidateDependency') {
                expect(args['name']).toBe('actionBegin');
                expect(args['newPredecessorString']).toBe('5SS');
            }
        };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 400, 100);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Connector Line Right drag - drop inside the Gantt container', () => {
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'ValidateDependency') {
                expect(args['name']).toBe('actionBegin');
                expect(args['newPredecessorString']).toBe('5FF');
            }
        };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointRightDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointRightDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-right-connectorpoint-outer-div > div.e-connectorpoint-right') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 400, 100);
        triggerMouseEvent(dragElement, 'mouseup');
    });        
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });
    it('Connector Line drag - spec coverage', () => {
        let element: Element = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container') as Element;
        ganttObj.editModule.taskbarEditModule.showHideTaskBarEditingElements(null, element, false);
        ganttObj.editModule.taskbarEditModule.showHideTaskBarEditingElements(null, element, true);
        element = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container') as Element;
        ganttObj.editModule.taskbarEditModule.showHideTaskBarEditingElements(null, element, true);
    });
    it('Converting to milestone', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -400, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.flatData[4].ganttProperties.duration).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });
    it('Check start date after dragging parent task', () => {
        let dragParentElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragParentElement, 'mousedown', dragParentElement.offsetLeft, dragParentElement.offsetTop);
        triggerMouseEvent(dragParentElement, 'mousemove', dragParentElement.offsetLeft + 40, 0);
        triggerMouseEvent(dragParentElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.startDate)).toBe(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.startDate));
    });
    it('Check parent milestone drag action', () => {
       let dragParentElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(8) > td > div.e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragParentElement, 'mousedown', dragParentElement.offsetLeft, dragParentElement.offsetTop);
        triggerMouseEvent(dragParentElement, 'mousemove', dragParentElement.offsetLeft + 40, 0);
        triggerMouseEvent(dragParentElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[8].ganttProperties.startDate)).toBe(ganttObj.getFormatedDate(ganttObj.currentViewData[7].ganttProperties.startDate));
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
    describe('Disable offset validation', () => {
        Gantt.Inject(Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: predecessorOffSetValidation,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor'
                    },
                    UpdateOffsetOnTaskbarEdit:false,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: false,
                    editSettings: {
                        allowEditing: true,
                        allowTaskbarEditing: true
                    }
                }, done);
        });
        it('Child right drag action', () => {
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.currentViewData[3]['Predecessor']).toBe('2FS');
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Child left drag action', () => {
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.currentViewData[3]['Predecessor']).toBe('2FS');
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 300, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Enable offset validation', () => {
        Gantt.Inject(Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: predecessorOffSetValidation,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor'
                    },
                    UpdateOffsetOnTaskbarEdit:true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: false,
                    editSettings: {
                        allowEditing: true,
                        allowTaskbarEditing: true
                    }
                }, done);
        });
        it('Child right drag action', () => {
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.currentViewData[3]['Predecessor']).toBe("2FS+3 days");
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Child left drag action', () => {
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.currentViewData[3]['Predecessor']).toBe("2FS-4 days");
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 300, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('disable auto date calculation', () => {
        Gantt.Inject(Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: baselineData,
                    taskFields: {
                        id: 'TaskId',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'Children',
                        cssClass: 'cusClass',
                        dependency: 'predecessor'
                    },
                    autoCalculateDateScheduling:false,
                    projectStartDate: new Date('10/15/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: false,
                    editSettings: {
                        allowEditing: true,
                        allowTaskbarEditing: true
                    }
                }, done);
        });
        it('Left resizing - drop on weekends', () => {
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/21/2017 08:00');
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -50, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Child drag action', () => {
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('11/01/2017 17:00');
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('11/01/2017 17:00');
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Parent drag action', () => {
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/31/2017 17:00');
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/31/2017 17:00');
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr.gridrowtaskIdlevel0.e-chart-row > td > div.e-taskbar-main-container') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        }); 
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('milestone drop date', () => {
        Gantt.Inject(Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: customCRData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        child: 'subtasks'
                    },
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: false,
                    editSettings: {
                        allowEditing: true,
                        allowTaskbarEditing: true
                    }
                }, done);
        });
        it('Milestone drag action', () => {
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('04/03/2019 17:00');
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td >div.e-taskbar-main-container') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Validate link CR issue', () => {
        Gantt.Inject(Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: customCrIssue,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                    },
                    actionBegin: function (args) {
                        if (args.requestType == 'validateLinkedTask') {
                            args.validateMode.removeLink = true;
                        }
                    },
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('07/28/2019'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: false,
                    editSettings: {
                        allowEditing: true,
                        allowTaskbarEditing: true
                    }
                }, done);
        });
        it('Child drag action', () => {
            ganttObj.actionComplete = () => {
                expect(ganttObj.currentViewData[2].ganttProperties.predecessor.length).toBe(0)
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Disable progress resizer', () => {
        let ganttObj: Gantt
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: editingData,
                 taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Progress Resizer disable when progress not mapped',() => {
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 5, dragElement.offsetTop + 5);
            expect((ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody >tr:nth-child(3) > td > div.e-taskbar-main-container> div.e-child-progress-resizer').classList.contains('e-progress-resize-gripper'))).toBe(false);
            expect(document.getElementsByClassName('e-connectorpoint-right-hover').length).toBe(1);
        });
    });   
    describe('Schedule mode', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: scheduleModeData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Custom',
                enableContextMenu: true,
                splitterSettings: {
                    columnIndex: 8
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Manual parent task-right resizing', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('ParentResizing');
            };
            
            expect(ganttObj.flatData[0].ganttProperties.duration).toBe(5);
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-manualparent-main-container > div.e-gantt-manualparenttaskbar-right') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[0].ganttProperties.duration).toBe(9);
        });
        it('Manual parent task-dragging', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('ManualParentDrag');
            };
               
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy')).toBe('03/04/2017');
            };
            
            expect(ganttObj.getFormatedDate(ganttObj.flatData[0].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('02/27/2017');
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-manualparent-main-container') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });
    describe('parent child end date mismatch', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/03/2019'), Duration: 0, Progress: 30 },
                            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/09/2019'), Duration: 0 },
                            ]
                    }],
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency:'Predecessor',
                        child: 'subtasks'
                },
                includeWeekend: true,
                editSettings: {
                  allowAdding: true,
                  allowDeleting: false,
                  allowEditing: true,
                  allowTaskbarEditing: true
                }
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('task end date check after parent drag', () => {
            let dragParentElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container') as HTMLElement;
            triggerMouseEvent(dragParentElement, 'mousedown', dragParentElement.offsetLeft, dragParentElement.offsetTop);
            triggerMouseEvent(dragParentElement, 'mousemove', dragParentElement.offsetLeft - 30, 0);
            triggerMouseEvent(dragParentElement, 'mouseup');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('04/08/2019 08:00');
        });
    })
    describe('CR issues', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/03/2019'), Duration: 0, Progress: 30 },
                            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/09/2019'), Duration: 0 },
                            ]
                    }],
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency:'Predecessor',
                        child: 'subtasks'
                },
                includeWeekend: true,
                editSettings: {
                  allowAdding: true,
                  allowDeleting: false,
                  allowEditing: true,
                  allowTaskbarEditing: false
                }
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('dynamically enabling allowTaskbarEditing proprty', () => {
            ganttObj.editSettings.allowTaskbarEditing = true;
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('MilestoneDrag');
            };
            
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-milestone') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });
    describe('Split task -', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: splitTasksData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                        segments: 'Segments'
                    },
                    dateFormat:'MM/dd/yyyy hh:mm:ss',
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    
                    allowSelection: true,
                    height: '450px',
                }, done);
        });
        it('Merging tasks', () => {
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(args.data.taskData['Segments'].length).toBe(2);
            };
            
            expect(ganttObj.currentViewData[2].taskData['Segments'].length).toBe(3);
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-first.e-gantt-child-taskbar.e-segmented-taskbar > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 500), dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Date time picker in dialog segment tab', () => {
            ganttObj.openEditDialog(3);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 2;
            tab.dataBind();
            let addIcon: HTMLElement = document.querySelector("#"+ganttObj.element.id +"SegmentsTabContainer_toolbarItems > div > div.e-toolbar-right > div:nth-child(1)");
            addIcon.click();
            var timerExistence = document.querySelector("#"+ganttObj.element.id+"SegmentsTabContainerEditForm > table > tbody > tr > td:nth-child(1) > div > span.e-input-group-icon.e-time-icon.e-icons")
            expect(!isNullOrUndefined(timerExistence)).toBeTruthy();
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });

    describe('Split task - with self data', () => {
        let ganttObj: Gantt;
        var segmentCollection = [{ segmentId: 3, startDate: new Date('02/04/2019'), duration: 2 }, { segmentId: 3, startDate: new Date('02/07/2019'), duration: 3 }];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: new DataManager(dragSelfReferenceData),
                    taskFields: {
                        id: 'taskID',
                        name: 'taskName',
                        startDate: 'startDate',
                        endDate: 'endDate',
                        duration: 'duration',
                        progress: 'progress',
                        dependency: 'predecessor',
                        parentID: 'parentID',
                        segmentId: 'segmentId'
                    },
                    segmentData: segmentCollection,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    
                    allowSelection: true,
                    height: '450px',
                }, done);
        });
        it('Rendering datamanager data', () => {
            expect(ganttObj.currentViewData[2].taskData['Segments'].length).toBe(2);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
    });
   describe('CR issue', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/03/2019'), Duration: 2, Progress: 30 },
                            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/09/2019'), Duration: 0 },
                            ]
                    }],
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency:'Predecessor',
                        child: 'subtasks'
                },
                includeWeekend: true,
                editSettings: {
                  allowAdding: true,
                  allowDeleting: false,
                  allowEditing: true,
                  allowTaskbarEditing: true
                }
            }, done);
        });
        it('Avoid initial resize', () => {
            ganttObj.actionComplete = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('04/03/2019 08:00');
            };
            
            ganttObj.actionBegin = (args: any) => {
                if (args.requestType == "taskbarediting" && args.taskBarEditAction == 'LeftResizing' && args.data.TaskID == 2) {
                    args.cancel = true;
                }
            };
            
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -110, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    
    describe('Multitaskbar issue', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: multiTaskbarData,
                resources: resources,
                viewType: 'ResourceView',
                enableMultiTaskbar: true,
                collapseAllParentTasks: true,
                showOverAllocation: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    work: 'work',
                    expandState: 'isExpand',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                actionComplete (args: any) {
                    if(args.requestType == 'save') {
                        expect(ganttObj.timelineModule.timelineStartDate.getDate()).toBe(28);
                    }
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                labelSettings: {
                    taskLabel: 'TaskName'
                },
                splitterSettings: {
                    columnIndex: 2
                },
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')            
            }, done);
        });
        it('Timespan gets changed', () => {
            ganttObj.openEditDialog(1);
            let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(save, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Split task -', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: splitTasksData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                        segments: 'Segments'
                    },
                    enableContextMenu: true,
                    dateFormat:'MM/dd/yyyy hh:mm:ss',
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },

                    allowSelection: true,
                    height: '450px',
                }, done);
        });
        beforeEach((done: Function) => {
            ganttObj.openAddDialog();
            let startDate: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            startDate.value = new Date('02/08/2019');
            let duration: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            duration.value = 2;
            let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(save, 'click');
            setTimeout(done, 500);
        });
        it('split over weekends', () => {
            ganttObj.splitTask(12, new Date('02/09/2019'));
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.segments[1].startDate, 'MM/dd/yyyy')).toBe('02/12/2019');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

     });
    describe('Invalid Connector line', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        dependency: 'Predecessor',
                        child: 'subtasks'
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    allowSelection: true,
                }, done);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('Dependency editing - parent to parent', () => {
            ganttObj.actionBegin = (args: any) => {
                if (args.requestType == "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false;
                }
            };
            
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 100, -50);
            ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
            ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[1];
            ganttObj.editModule.taskbarEditModule.finalPredecessor = '2SS';
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[1].ganttProperties.predecessorsName).toBe(null);
        });
        it('Dependency editing - parent to child', () => {
            ganttObj.actionBegin = (args: any) => {
                if (args.requestType == "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false;
                }
            };
            
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 100, -50);
            ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
            ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[2];
            ganttObj.editModule.taskbarEditModule.finalPredecessor = '2SS';
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[1].ganttProperties.predecessorsName).toBe(null);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    // describe('Custom task mode Connector line', () => {
    //     let ganttObj: Gantt;
    //     beforeAll((done: Function) => {
    //         ganttObj = createGantt(
    //             {
    //                 dataSource: scheduleModeData,
    //                 allowSorting: true,
    //                 taskFields: {
    //                     id: 'TaskID',
    //                     name: 'TaskName',
    //                     startDate: 'StartDate',
    //                     duration: 'Duration',
    //                     progress: 'Progress',
    //                     endDate: 'EndDate',
    //                     child: 'Children',
    //                     manual: 'isManual',
    //                     dependency: 'Predecessor'
    //                 },
    //                 taskMode: 'Custom',
    //                 enableContextMenu: true,
    //                 splitterSettings: {
    //                     columnIndex: 8
    //                 },
    //                 editSettings: {
    //                     allowEditing: true,
    //                     allowDeleting: true,
    //                     allowTaskbarEditing: true,
    //                     showDeleteConfirmDialog: true
    //                 },
    //                 toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
    //             }, done);
    //     });
    //     beforeEach((done: Function) => {
    //         setTimeout(done, 500);
    //     });
    //     it('Dependency editing - manual parent to manual parent', () => {
    //         ganttObj.actionBegin = (args: any) => {
    //             if (args.requestType == "validateLinkedTask") {
    //                 args.validateMode.preserveLinkWithEditing = false;
    //             }
    //         };
            
    //         let dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-manualparent-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
    //         triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    //         triggerMouseEvent(dragElement, 'mousemove', 100, -50);
    //         ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
    //         ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[4];
    //         ganttObj.editModule.taskbarEditModule.finalPredecessor = '1SS';
    //         triggerMouseEvent(dragElement, 'mouseup');
    //         expect(ganttObj.flatData[4].ganttProperties.predecessorsName).toBe('1SS+5 days');
    //      });
    //     it('Dependency editing - manual parent to parent', () => {
    //         ganttObj.actionBegin = (args: any) => {
    //             if (args.requestType == "validateLinkedTask") {
    //                 args.validateMode.preserveLinkWithEditing = false;
    //             }
    //         };
            
    //         let dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-manualparent-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
    //         triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    //         triggerMouseEvent(dragElement, 'mousemove', 100, -50);
    //         ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
    //         ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[9];
    //         ganttObj.editModule.taskbarEditModule.finalPredecessor = '5SS';
    //         triggerMouseEvent(dragElement, 'mouseup');
    //         expect(ganttObj.flatData[9].ganttProperties.predecessorsName).toBe('5SS');
    //     });
    //     it('Dependency editing - manual parent to child', () => {
    //         ganttObj.actionBegin = (args: any) => {
    //             if (args.requestType == "validateLinkedTask") {
    //                 args.validateMode.preserveLinkWithEditing = false;
    //             }
    //         };

    //         let dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-manualparent-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
    //         triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    //         triggerMouseEvent(dragElement, 'mousemove', 100, -50);
    //         ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
    //         ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[3];
    //         ganttObj.editModule.taskbarEditModule.finalPredecessor = '5FS';
    //         triggerMouseEvent(dragElement, 'mouseup');
    //         expect(ganttObj.flatData[3].ganttProperties.predecessorsName).toBe('5FS');
    //     });
    //     it('Dependency editing - child to manual parent', () => {
    //         ganttObj.actionBegin = (args: any) => {
    //             if (args.requestType == "validateLinkedTask") {
    //                 args.validateMode.preserveLinkWithEditing = false;
    //             }
    //         };
            
    //         let dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(8) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
    //         triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    //         triggerMouseEvent(dragElement, 'mousemove', 100, -50);
    //         ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
    //         ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[0];
    //         ganttObj.editModule.taskbarEditModule.finalPredecessor = '8FF';
    //         triggerMouseEvent(dragElement, 'mouseup');
    //         expect(ganttObj.flatData[0].ganttProperties.predecessorsName).toBe('8FF');
    //     });
    //     afterAll(() => {
    //         if (ganttObj) {
    //             destroyGantt(ganttObj);
    //         }
    //     });
    // });
    describe('Dialog Edit for custom taskmode', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: scheduleModeData,
                    allowSorting: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        endDate: 'EndDate',
                        child: 'Children',
                        manual: 'isManual',
                        dependency: 'Predecessor'
                    },
                    taskMode: 'Custom',
                    enableContextMenu: true,
                    splitterSettings: {
                        columnIndex: 8
                    },
                    editSettings: {
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel']
                }, done);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
            ganttObj.openEditDialog(1);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
        });
        it('Dependency tab editing', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    expect(args.data.Predecessor).toBe("6FS");
                }
            };
            let add: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainer_add'));
            triggerMouseEvent(add, 'click');
            let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
            input.dataSource = input.dataSource.dataSource.json;
            input.value = "6-Child Task 1";
            input.dataBind();
            let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
            triggerMouseEvent(toolbar, 'click');
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Add new Record', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: scheduleModeData,
                    allowSorting: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        endDate: 'EndDate',
                        child: 'Children',
                        manual: 'isManual',
                        dependency: 'Predecessor'
                    },
                    taskMode: 'Custom',
                    enableContextMenu: true,
                    splitterSettings: {
                        columnIndex: 8
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel']
                }, done);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
            ganttObj.openAddDialog();
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
        });
        it('Add dependancy', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    expect(args.data.Predecessor).toBe("1FS");
                }
            };
            let add: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainer_add'));
            triggerMouseEvent(add, 'click');
            let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
            input.dataSource = input.dataSource.dataSource.json;
            input.value = "1-Parent Task 1";
            input.dataBind();
            let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
            triggerMouseEvent(toolbar, 'click');
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Taskbar drag action', () => {
        let ganttObj: Gantt;
        let editingData = [
            {
                TaskID: 1,
                TaskName: 'Project initiation',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('04/02/2019'), Duration: 4, Predecessor: '2',
                        resources: [2, 3], info: 'Obtain an engineered soil test of lot where construction is planned.' +
                            'From an engineer or company specializing in soil testing'
                    },
                    { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '5SF', Progress: 30 },
                ]
            },
            {
                TaskID: 5,
                TaskName: 'Project estimation',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'),
                        Duration: 3, Progress: 30,
                        info: 'Develop floor plans and obtain a materials list for estimations'
                    },
                ]
            },
           
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: editingData,
        dateFormat: 'MMM dd, y',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                notes: 'info',
                resourceInfo: 'resources'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
            allowSelection: true,
            gridLines: 'Both',
            height: '450px',
            treeColumnIndex: 1,
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName'
            },
            resources: resources,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'MMM dd, y',
                },
                bottomTier: {
                    unit: 'Day',
                },
            },
            columns: [
                { field: 'TaskID', width: 80 },
                { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                { field: 'StartDate' },
                { field: 'Duration' },
                { field: 'Progress' },
                { field: 'Predecessor' }
            ],
            eventMarkers: [
                { day: '4/17/2019', label: 'Project approval and kick-off' },
                { day: '5/3/2019', label: 'Foundation inspection' },
                { day: '6/7/2019', label: 'Site manager inspection' },
                { day: '7/16/2019', label: 'Property handover and sign-off' },
            ],
            labelSettings: {
                leftLabel: 'TaskName',
                rightLabel: 'resources'
            },
            editDialogFields: [
                { type: 'General', headerText: 'General' },
                { type: 'Dependency' },
                { type: 'Resources' },
                { type: 'Notes' },
            ],
            splitterSettings: {
                columnIndex: 2
            },
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('07/28/2019')
                }, done);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('Child Drag', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('ChildDrag');
            };
            
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
               expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.endDate, 'MM/dd/yyyy')).toBe('04/10/2019');
                expect(args.taskBarEditAction).toBe('ChildDrag');
            };
            
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 200, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Splittasks data with day/hour mode', () => {
        let ganttObj: Gantt;
        let splitTasksData1: any = [
            {
                "name": "Company A 79087",
                "durationUnit": "minute",
                "idTask": 142730,
                "codiceCommessa": "79087",
                "cliente": {
                    "id": 3112,
                    "name": "Company A"
                },
                "bistra": null,
                "quantita": {
                    "unitaMisura": "N.",
                    "ordinata": 300000,
                    "tolleranza_percentuale": 20,
                    "massimaConTolleranza": 360000
                },
                "dettaglio": {
                    "diametro": 29.5,
                    "altezza": 60,
                    "altezzaCS": 60
                },
                "subTasks": [
                    {
                        "idTask": 888,
                        "codiceCommessa": "79087",
                        "name": "Phase 1",
                        "color": "#E91E63",
                        "startDate": new Date("2022-11-09T16:00:00"),
                        "durationUnit": "minute",
                        "duration": 240,
                        "duration_Calendar": 240,
                        "progress": 0,
                        "predecessor": "",
                        "risorsa": "VE04",
                        "priorita": null,
                        "colGanttCustoms": [
                            {
                                "name": "consegna",
                                "value": null
                            },
                            {
                                "name": "memodue",
                                "value": null
                            },
                            {
                                "name": "memouno",
                                "value": null
                            }
                        ],
                        "calendarName": "Phase 1"
                    },
                    {
                        "idTask": 889,
                        "codiceCommessa": "79087",
                        "name": "Phase2",
                        "color": "#CDDC39",
                        "startDate": new Date("2022-11-09T20:00:00"),
                        "durationUnit": "minute",
                        "duration": 180,
                        "duration_Calendar": 180,
                        "progress": 0,
                        "predecessor": "888FS",
                        "risorsa": "",
                        "priorita": null,
                        "colGanttCustoms": [
                            {
                                "name": "consegna",
                                "value": null
                            },
                            {
                                "name": "memodue",
                                "value": null
                            },
                            {
                                "name": "memouno",
                                "value": null
                            }
                        ],
                        "calendarName": "Phase 2"
                    }
                ],
                "startDate": new Date("2022-11-09T16:00:00"),
                "endDate": new Date("2022-11-13T00:12:00"),
                "color": "#428af5",
                "conicita": "0,83°=0°50' Diam. 29.5",
                "priorita_Filter": 9,
                "diametro_Filter": 29.5,
                "stato_Filter": "Inevaso",
                "statoProduzione_Filter": "Da iniziare"
            },
            {
                "name": "Company B 78999",
                "durationUnit": "minute",
                "idTask": 142218,
                "codiceCommessa": "78999",
                "cliente": {
                    "id": 1019,
                    "name": "Company 2"
                },
                "bistra": null,
                "dataConsegna": "2022-12-05T00:00:00",
                "dataInserimento": "2022-12-05T00:00:00",
                "quantita": {
                    "unitaMisura": "N.",
                    "ordinata": 80000,
                    "tolleranza_percentuale": 40,
                    "massimaConTolleranza": 112000
                },
                "dettaglio": {
                    "diametro": 34,
                    "altezza": 128,
                    "altezzaCS": 140
                },
                "subTasks": [
                    {
                        "idTask": 898,
                        "codiceCommessa": "78999",
                        "name": "Phase 1",
                        "color": "#E91E63",
                        "startDate": new Date("2022-11-09T16:00:00"),
                        "durationUnit": "minute",
                        "duration": 240,
                        "duration_Calendar": 240,
                        "progress": 0,
                        "predecessor": "",
                        "risorsa": "VE08",
                        "priorita": null,
                        "colGanttCustoms": [
                            {
                                "name": "consegna",
                                "value": null
                            },
                            {
                                "name": "memodue",
                                "value": null
                            },
                            {
                                "name": "memouno",
                                "value": null
                            }
                        ],
                        "calendarName": "Phase 1"
                    },
                    {
                        "idTask": 899,
                        "codiceCommessa": "78999",
                        "name": "Phase 2",
                        "color": "#CDDC39",
                        "startDate": new Date("2022-11-09T20:00:00"),
                        "durationUnit": "minute",
                        "duration": 1560,
                        "duration_Calendar": 1560,
                        "progress": 0,
                        "predecessor": "898FS",
                        "risorsa": "",
                        "priorita": null,
                        "colGanttCustoms": [
                            {
                                "name": "consegna",
                                "value": null
                            },
                            {
                                "name": "memodue",
                                "value": null
                            },
                            {
                                "name": "memouno",
                                "value": null
                            }
                        ],
                        "calendarName": "Phase 2",
                        "segments": [
                            {
                                "startDate": new Date("2022-11-09T20:00:00"),
                                "duration": 240
                            },
                            {
                                "startDate": new Date("2022-11-10T00:00:00"),
                                "duration": 1320
                            }
                        ]
                    }
                ],
                "startDate": new Date("2022-11-09T16:00:00"),
                "endDate": new Date("2022-11-10T22:51:00"),
                "color": "#428af5",
                "conicita": "3,6°=3°36' Diam. 34",
                "priorita_Filter": 9,
                "diametro_Filter": 34,
                "stato_Filter": "Inevaso",
                "statoProduzione_Filter": "Da iniziare"
            },
            {
                "name": "Company C 79128",
                "durationUnit": "minute",
                "mercePronta": "2022-10-05T00:00:00",
                "idTask": 142948,
                "codiceCommessa": "79128",
                "cliente": {
                    "id": 6207,
                    "name": "Company 3"
                },
                "bistra": null,
                "dataConsegna": "2022-10-15T00:00:00",
                "dataInserimento": "2022-10-15T00:00:00",
                "quantita": {
                    "unitaMisura": "N.",
                    "ordinata": 10000,
                    "tolleranza_percentuale": 40,
                    "massimaConTolleranza": 14000
                },
                "dettaglio": {
                    "diametro": 34,
                    "altezza": 122,
                    "altezzaCS": 134
                },
                "subTasks": [
                    {
                        "idTask": 858,
                        "codiceCommessa": "79128",
                        "name": "Phase 1",
                        "color": "#E91E63",
                        "startDate": new Date("2022-11-09T22:00:00"),
                        "durationUnit": "minute",
                        "duration": 180,
                        "duration_Calendar": 660,
                        "progress": 0,
                        "predecessor": "",
                        "risorsa": "VE08",
                        "priorita": null,
                        "colGanttCustoms": [
                            {
                                "name": "consegna",
                                "value": null
                            },
                            {
                                "name": "memodue",
                                "value": null
                            },
                            {
                                "name": "memouno",
                                "value": null
                            }
                        ],
                        "calendarName": "Phase 1",
                        "segments": [
                            {
                                "startDate": new Date("2022-11-09T22:00:00"),
                                "duration": 60
                            },
                            {
                                "startDate": new Date("2022-11-10T07:00:00"),
                                "duration": 120
                            }
                        ]
                    },
                    {
                        "idTask": 859,
                        "codiceCommessa": "79128",
                        "name": "Phase 2",
                        "color": "#CDDC39",
                        "startDate": new Date("2022-11-09T23:00:00"),
                        "durationUnit": "minute",
                        "duration": 360,
                        "duration_Calendar": 360,
                        "progress": 0,
                        "predecessor": "",
                        "risorsa": "",
                        "priorita": null,
                        "colGanttCustoms": [
                            {
                                "name": "consegna",
                                "value": null
                            },
                            {
                                "name": "memodue",
                                "value": null
                            },
                            {
                                "name": "memouno",
                                "value": null
                            }
                        ],
                        "calendarName": "Phase 2",
                        "segments": [
                            {
                                "startDate": new Date("2022-11-09T23:00:00"),
                                "duration": 60
                            },
                            {
                                "startDate": new Date("2022-11-10T00:00:00"),
                                "duration": 300
                            }
                        ]
                    }
                ],
                "startDate": new Date("2022-11-09T22:00:00"),
                "endDate": new Date("2022-11-10T07:58:00"),
                "color": "#428af5",
                "conicita": "4,36°=4°22' Diam. 34",
                "priorita_Filter": 9,
                "diametro_Filter": 34,
                "stato_Filter": "Inevaso",
                "statoProduzione_Filter": "Da iniziare"
            }
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: splitTasksData1,
                    taskFields: {
                        id: "idTask",
                        name: "name",
                        startDate: "startDate",
                        endDate: "endDate",
                        duration: "duration",
                        durationUnit: "durationUnit",
                        progress: "progress",
                        dependency: "predecessor",
                        child: "subTasks",
                        segments: "segments",
                    },
                    renderBaseline: true,
                    baselineColor: 'red',
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    
                    allowSelection: true,
                    gridLines: "Both",
                    showColumnMenu: true,
                    highlightWeekends: true,
                    timezone: "Europe/Rome",
                    timelineSettings: {
                        timelineUnitSize: 40,
                        timelineViewMode: "Day",
                        topTier: {
                          unit: "Day",
                          format: "E, d MMMM",
                          count: 1,
                        },
                        bottomTier: {
                          unit: "Hour",
                          count: 1,
                        },
                        weekStartDay: 1,
                        weekendBackground: "rgba(0,0,0,0.1)",
                        updateTimescaleView: false,
                    },
                    workWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                      ],
                      dayWorkingTime: [
                            {
                              from: 0,
                              to: 24,
                            },
                          ],
                    height: '550px',
                    durationUnit: 'Minute',
                    projectStartDate: new Date('2022-11-09'),
                    projectEndDate: new Date('2022-11-12'),
    
                }, done);
        });
        it('Splittasks data with day/hour mode', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType == "beforeSave") {
                    expect(args.modifiedTaskData.length).toBe(2);
                  }
            };
            ganttObj.dataBind()
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(8) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-last.e-gantt-child-taskbar.e-segmented-taskbar > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft - 150), dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
          if (ganttObj) {
            destroyGantt(ganttObj);
          }
        });
    });
    describe("Taskbar drag drop", () => {
        Gantt.Inject(Edit,RowDD);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
          ganttObj = createGantt(
            {
                dataSource: multiTaskbarData,
            resources: multiResources,
            allowRowDragAndDrop: true,
            enableMultiTaskbar: true,
            allowTaskbarDragAndDrop: true,
            viewType: 'ResourceView',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                expandState: 'isExpand',
                resourceInfo: 'resources',
                work: 'work',
                child: 'subtasks'
            },
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit',
                group: 'resourceGroup'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'work', headerText: 'Work' },
                { field: 'Progress' },
                { field: 'resourceGroup', headerText: 'Group' },
                { field: 'StartDate' },
                { field: 'Duration' },
            ],
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
            labelSettings: {
                taskLabel: 'TaskName'
            },
            splitterSettings: {
                columnIndex: 2
            },
            allowResizing: true,
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            height: '450px',
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019')
            },
            done
          );
        });
        it("Taskbar Drag and drop", () => {
            ganttObj.actionComplete = (args: any) => {
                if (args.requestType == 'rowDropped') {
                    expect(args.data[0].resources).toBe('Rose Fuller');
                    expect(args.modifiedRecords[1].childRecords.length).toBe(2);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1)').getElementsByClassName('e-taskbar-main-container')[1] as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 70, 150);
            triggerMouseEvent(dragElement, 'mouseup');
      });
        afterAll(() => {
          if (ganttObj) {
            destroyGantt(ganttObj);
          }
        });
    });
    describe("Taskbar drag drop without overallocation", () => {
        Gantt.Inject(Edit,RowDD);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
          ganttObj = createGantt(
            {
                dataSource: multiTaskbarData,
            resources: multiResources,
            allowRowDragAndDrop: true,
            enableMultiTaskbar: true,
            allowTaskbarDragAndDrop: true,
            allowTaskbarOverlap: false,
            showOverAllocation: true,
            viewType: 'ResourceView',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                expandState: 'isExpand',
                resourceInfo: 'resources',
                work: 'work',
                child: 'subtasks'
            },
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit',
                group: 'resourceGroup'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'work', headerText: 'Work' },
                { field: 'Progress' },
                { field: 'resourceGroup', headerText: 'Group' },
                { field: 'StartDate' },
                { field: 'Duration' },
            ],
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
            labelSettings: {
                taskLabel: 'TaskName'
            },
            splitterSettings: {
                columnIndex: 2
            },
            allowResizing: true,
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            height: '450px',
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019')
            },
            done
          );
        });
        beforeEach(function (done) {
            setTimeout(done, 500);
        });
        it("Taskbar Drag and drop", () => {
            ganttObj.actionComplete = (args: any) => {
                if (args.requestType == 'rowDropped') {
                    expect(args.data[0].resources).toBe('Margaret Buchanan');
                    expect(args.modifiedRecords[1].childRecords.length).toBe(2);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1)').getElementsByClassName('e-taskbar-main-container')[1] as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 70, 200);
            triggerMouseEvent(dragElement, 'mouseup');
      });
      it("Taskbar Drag and drop in Auto scroll", () => {
        ganttObj.actionComplete = (args: any) => {
            if (args.requestType == 'rowDropped') {
                expect(args.data[0].resources).toBe('Davolio Fuller');
                expect(args.modifiedRecords[1].childRecords.length).toBe(2);
                expect(args.modifiedRecords[2].childRecords.length).toBe(4);
            }
        };
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1)').getElementsByClassName('e-taskbar-main-container')[1] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 70, 300);
        triggerMouseEvent(dragElement, 'mouseup');
  });
        afterAll(() => {
          if (ganttObj) {
            destroyGantt(ganttObj);
          }
        });
    });
    describe("offset value not updating issue", () => {
        Gantt.Inject(Edit);
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: scheduleModeData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        endDate: 'EndDate',
                        dependency:'Predecessor',
                        child: 'Children',
                        manual: 'isManual'
                    },
                    projectStartDate: new Date('02/20/2017'),
                    projectEndDate: new Date('03/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: false,
                    editSettings: {
                        allowEditing: true,
                        allowTaskbarEditing: true
                    }
                }, done);
        });
        it("check offset value after connecting predecessors", () => {
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(9) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(9) > td > div.e-taskbar-main-container > div.e-right-connectorpoint-outer-div > div.e-connectorpoint-right') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 10, 100);
            ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
            ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[10];
            ganttObj.editModule.taskbarEditModule.finalPredecessor = '9FS';
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[10].ganttProperties.predecessorsName).toBe('9FS');
            let dragElement1: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(8) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement1, 'mousedown', dragElement1.offsetLeft, dragElement1.offsetTop);
            dragElement1 = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(8) > td > div.e-taskbar-main-container > div.e-right-connectorpoint-outer-div > div.e-connectorpoint-right') as HTMLElement;
            triggerMouseEvent(dragElement1, 'mousedown', dragElement1.offsetLeft, dragElement1.offsetTop);
            triggerMouseEvent(dragElement1, 'mousemove', 10, 150);
            ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
            ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[10];
            ganttObj.editModule.taskbarEditModule.finalPredecessor = '8FS+4 days';
            triggerMouseEvent(dragElement1, 'mouseup');
            expect(ganttObj.flatData[10].ganttProperties.predecessor[0].offset).toBe(4);
            
      });
        afterAll(() => {
          if (ganttObj) {
            destroyGantt(ganttObj);
          }
        });
    });
    describe("offset value updating issue", () => {
        Gantt.Inject(Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Child Task 1',
                        StartDate: new Date('02/27/2017'),
                        EndDate: new Date('03/03/2017'),
                        Progress: '40',
                        isManual: true,
                    },
                    {
                        TaskID: 2,
                        TaskName: 'Child Task 2',
                        StartDate: new Date('02/26/2017'),
                        EndDate: new Date('03/03/2017'),
                        Predecessor: 1,
                        Progress: '40',
                        isManual: true,
                    }],
                allowSorting: true,
                enableContextMenu: true,
                height: '450px',
                allowSelection: true,
                highlightWeekends: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    endDate: 'EndDate',
                    dependency: 'Predecessor',
                    child: 'Children',
                    manual: 'isManual',
                },
                taskMode: 'Custom',
                toolbar: ['Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'ExpandAll',
                    'CollapseAll',
                    'Search',],
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName' },
                    { field: 'isManual' },
                ],
                treeColumnIndex: 1,
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                },
                splitterSettings: {
                    position: '35%',
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),
            }, done);
        });
        it("check offset value while connecting predecessors", () => {
            expect(ganttObj.flatData[0].ganttProperties.predecessor[0].offset).toBe(-5);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });


// // // modify
describe("cloneTaskbar drag drop", () => {
    Gantt.Inject(Edit,RowDD);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
      ganttObj = createGantt(
        {
            dataSource: multiTaskbarData,
        resources: multiResources,
        allowRowDragAndDrop: true,
        enableMultiTaskbar: true,
        allowTaskbarDragAndDrop: true,
        viewType: 'ResourceView',
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            expandState: 'isExpand',
            resourceInfo: 'resources',
            work: 'work',
            child: 'subtasks'
        },
        resourceFields: {
            id: 'resourceId',
            name: 'resourceName',
            unit: 'resourceUnit',
            group: 'resourceGroup'
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskID', visible: false },
            { field: 'TaskName', headerText: 'Name', width: 250 },
            { field: 'work', headerText: 'Work' },
            { field: 'Progress' },
            { field: 'resourceGroup', headerText: 'Group' },
            { field: 'StartDate' },
            { field: 'Duration' },
        ],
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
        labelSettings: {
            taskLabel: 'TaskName'
        },
        splitterSettings: {
            columnIndex: 2
        },
        allowResizing: true,
        allowSelection: true,
        highlightWeekends: true,
        treeColumnIndex: 1,
        height: '450px',
        projectStartDate: new Date('03/28/2019'),
        projectEndDate: new Date('05/18/2019')
        },
        done
      );
    });
    afterAll(() => {
      if (ganttObj) {
        destroyGantt(ganttObj);
      }
    });
    it("Taskbar Drag and drop", () => {
        ganttObj.actionComplete = (args: any) => {
            if (args.requestType == 'rowDropped') {
                expect(args.data[0].resources).toBe('Rose Fuller');
                expect(args.modifiedRecords[1].childRecords.length).toBe(2);
            }
        };
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1)').getElementsByClassName('e-taskbar-main-container')[1] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 70, 150);
        var cloneElement = ganttObj.element.getElementsByClassName('e-clone-taskbar');
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
  });
});

describe('clone taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Left resizing - drop on weekends', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args['name']).toBe('taskbarEditing');
            expect(args.taskBarEditAction).toBe('LeftResizing');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
            expect(args['name']).toBe('taskbarEdited');
            expect(args.taskBarEditAction).toBe('LeftResizing');
            expect(ganttObj.getFormatedDate(args.previousData.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -50, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Left resizing -  drop on weekdays', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args['name']).toBe('taskbarEditing');
            expect(args.taskBarEditAction).toBe('LeftResizing');
            expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args['name']).toBe('taskbarEdited');
            expect(args.taskBarEditAction).toBe('LeftResizing');
            expect(ganttObj.getFormatedDate(args.previousData.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -80, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    it('Left resizing - editing cancel', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            args.cancel = true;
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -100, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    it('Left resizing -  edited cancel', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
        };
        
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] !== 'taskbarediting') {
                expect(ganttObj.getFormatedDate(args['data'].ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/16/2017 08:00');
                if (args['requestType'] === 'beforeSave') {
                    args['cancel'] = true;
                }
            }
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -110, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
    });     
   
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('clone taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                tooltipSettings: {
                    showTooltip: true,
                    editing: '<div>game</div'
                },
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('progress with 0% - editing cancel', () => {
        ganttObj.actionBegin = (args: object) => { };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.data['Progress']).toBe(80);
            args['cancel'] = true;
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.data.ganttProperties.progress).toBe(80);
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    it('progress with 0% - edited cancel', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.data['Progress']).toBe(80);
        };
        
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] !== 'taskbarediting') {
                expect(args['data'].ganttProperties.progress).toBe(0);
                if (args['requestType'] === 'beforeSave') {
                    args['cancel'] = true;
                }
            }
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.flatData[1].ganttProperties.progress).toBe(80);
    });
    it('progress with 0%', () => {
        ganttObj.actionBegin = (args: object) => { };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.data['Progress']).toBe(80);
            expect(args.taskBarEditAction).toBe('ProgressResizing');
            expect(args.editingFields.progress).toBe(0);
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.data.ganttProperties.progress).toBe(0);
            expect(args.taskBarEditAction).toBe('ProgressResizing');
            expect(args.editingFields.progress).toBe(0);
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 0, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });     
   
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('clone taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Child drag action', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args.taskBarEditAction).toBe('ChildDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
           //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args.taskBarEditAction).toBe('ChildDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    }); 

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('clone taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Milestone drag action', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/24/2017 08:00');
            expect(args.taskBarEditAction).toBe('MilestoneDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('11/02/2017 08:00');
            expect(args.taskBarEditAction).toBe('MilestoneDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 300, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('clone taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });

    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Parent drag action', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            //expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args.taskBarEditAction).toBe('ParentDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/24/2017 08:00');
            expect(args.taskBarEditAction).toBe('ParentDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr.gridrowtaskIdlevel0.e-chart-row > td > div.e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 300, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    }); 

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('clone taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });
    
    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Right resizing - editing cancel', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/26/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
            args.cancel = true;
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/26/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    it('Right resizing - edited cancel', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/26/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
        
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'beforeSave') {
                args['cancel'] = true;
            }
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/26/2017 17:00');
    });
    it('Right resizing', () => {
        ganttObj.actionBegin = (args: object) => { };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data['EndDate'], 'MM/dd/yyyy HH:mm')).toBe('10/26/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });       
   
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('clone taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });
    
    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Connector Line Left drag - drop outside the Gantt container', () => {
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'ValidateDependency') {
                expect(args['name']).toBe('actionBegin');
                expect(args['newPredecessorString']).toBe('5SS');
            }
        };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 800, 100);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(false);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(false);
        triggerMouseEvent(dragElement, 'mouseup');
    });
   
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('clone taskbar edit action', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                    cssClass: 'cusClass',
                    dependency: 'predecessor'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                allowSelection: false,
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true
                }
            }, done);
    });
    
    it('Hide spinner', () => {
            ganttObj.hideSpinner();
    });

    it('Connector Line Left drag - drop inside the Gantt container', () => {
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'ValidateDependency') {
                expect(args['name']).toBe('actionBegin');
                expect(args['newPredecessorString']).toBe('5SS');
            }
        };
        
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 400, 100);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(false);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(false);
        triggerMouseEvent(dragElement, 'mouseup');
    });        
   
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Milestone get disappeared when we indent the record issue', () => {
    let ganttObj: Gantt;
    Gantt.Inject(Edit, ContextMenu);
    let newData: Object[] = [
        {
            TaskID: 1,
            TaskName: '1',
            StartDate: new Date('05/23/2023'),
            EndDate: new Date('05/23/2023'),
            Progress: 59,
            Duration: 1,
          },
          {
            TaskID: 2,
            TaskName: '2',
            StartDate: new Date('05/23/2023'),
            EndDate: new Date('05/23/2023'),
            Progress: 0,
            Duration: 0,
            ParentID: 1,
          },
        ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: newData,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            parentID: 'parentID',
            baselineStartDate: 'BaselineStartDate',
            baselineEndDate: 'BaselineEndDate',
            milestone: 'isMilestone'
            },
            editSettings: {
                allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true,
            newRowPosition: 'Bottom',
            },
            enableContextMenu:true,
            toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'Indent','Outdent'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            renderBaseline:false,
            enableVirtualization:true,
            allowRowDragAndDrop:true,
            allowFiltering:true,
            allowResizing:true,
            allowParentDependency:false,
            highlightWeekends: true,
            labelSettings: {
                taskLabel: 'Progress'
            },
            splitterSettings:{
                columnIndex: 2,
            },
            height: '550px',
            allowUnscheduledTasks: true,
        }, done);
    });
    it('check duration of taskbar', () => {
        ganttObj.openAddDialog();
        let duration: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
        duration.value = 0;
        let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
        triggerMouseEvent(save, 'click');
        
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Bug-842430:Milestone is not converting back to taskbar when we change isMilestone property', () => {
    let ganttObj: Gantt;
    let newData1: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Identify site location',
            StartDate: new Date('04/02/2019'),
            Duration: 5,
            Progress: 30,
            isMileStone: true,
        },
        {
            TaskID: 2,
            TaskName: 'Soil test approval',
            StartDate: new Date('04/02/2019'),
            Duration: 10,
            Progress: 30,
            isMileStone: true,
        },
        {
            TaskID: 3,
            TaskName: 'New project approval',
            StartDate: new Date('04/02/2019'),
            Duration: 3,
            Progress: 30
        }
        ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: newData1,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                milestone: 'isMilestone'
            },
            gridLines: "Both",
            allowFiltering:true,
            allowResizing:true,
            highlightWeekends: true,
            labelSettings: {
                taskLabel: 'Progress'
            },
            splitterSettings:{
                columnIndex: 2,
            },
            height: '550px',
        }, done);
    });
    it('check duration of taskbar when milestome property is mapped', () => {
        expect(ganttObj.currentViewData[0].taskData['Duration']).toBe(5);
        expect(ganttObj.currentViewData[1].taskData['Duration']).toBe(10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Milestone renders at default end time after editing', () => {
    let ganttObj: Gantt;
    var projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                    Indicators: [
                        {
                            'date': '04/10/2019',
                            'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                            'name': 'Indicator title',
                            'tooltip': 'tooltip'
                        }
                    ]
                },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 0, Progress: 30 },
            ]
        },
         { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0,Predecessor: "4" },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: projectNewData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            child: 'subtasks',
            indicators: 'Indicators'
        },
        renderBaseline: true,
        baselineColor: 'red',

        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskID', headerText: 'Task ID' },
            { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
            { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
            { field: 'Duration', headerText: 'Duration', allowEditing: false },
            { field: 'Progress', headerText: 'Progress', allowFiltering: false },
            { field: 'CustomColumn', headerText: 'CustomColumn' }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        allowRowDragAndDrop: true,
        selectedRowIndex: 1,
        splitterSettings: {
            position: "50%",
        },
        selectionSettings: {
            mode: 'Row',
            type: 'Single',
            enableToggle: false
        },
        tooltipSettings: {
            showTooltip: true
        },
        filterSettings: {
            type: 'Menu'
        },
        allowFiltering: true,
        gridLines: "Both",
        showColumnMenu: true,
        highlightWeekends: true,
        timelineSettings: {
            showTooltip: true,
            topTier: {
                unit: 'Week',
                format: 'dd/MM/yyyy'
            },
            bottomTier: {
                unit: 'Day',
                count: 1
            }
        },
        eventMarkers: [
            {
                day: '04/10/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/04/2019",
                to: "04/05/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "04/12/2019",
                to: "04/12/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        labelSettings: {
            leftLabel: 'TaskID',
            rightLabel: 'Task Name: ${taskData.TaskName}',
            taskLabel: '${Progress}%'
        },
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        height: '550px',
        allowUnscheduledTasks: true,
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it ('Drag milestone and check start date time', () => {
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('03/28/2019 08:00');
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Drag drop taskbar outside the chart side', () => {
    let ganttObj: Gantt;
    let newData1: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Identify site location',
            StartDate: new Date('04/02/2019'),
            Duration: 5,
            Progress: 30,
            isMileStone: true,
        },
        {
            TaskID: 2,
            TaskName: 'Soil test approval',
            StartDate: new Date('04/02/2019'),
            Duration: 10,
            Progress: 30,
            isMileStone: true,
        },
        {
            TaskID: 3,
            TaskName: 'New project approval',
            StartDate: new Date('04/02/2019'),
            Duration: 3,
            Progress: 30
        }
        ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: newData1,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                milestone: 'isMilestone'
            },
            gridLines: "Both",
            allowFiltering:true,
            allowResizing:true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            highlightWeekends: true,
            labelSettings: {
                taskLabel: 'Progress'
            },
            splitterSettings:{
                columnIndex: 2,
            },
            height: '550px',
        }, done);
    });
    it('Drag drop taskbar outside the chart side', () => {
        ganttObj.actionComplete = (args) => {
            if(args.requestType === 'save'){
              // expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('04/08/2019 08:00');
            }
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 800, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Split task- Unable to merge two segments lies between holidays', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
                    TaskID: 1, TaskName: 'Allocate resources', StartDate: new Date('02/05/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '75',
                            Segments: [
                                { StartDate: new Date('02/05/2019'), Duration: 4 },
                                { StartDate: new Date('02/08/2019'), Duration: 2 }
                            ]
                }],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                allowResizing:true,
                height: '450px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('04/04/2019')
            }, done);
    });
    it('Merging tasks while lies between holidays', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-last.e-gantt-child-taskbar.e-segmented-taskbar > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -150, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        var segmentElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-segmented-taskbar')
        expect(isNullOrUndefined(segmentElement)).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Cant able to merge the splited taskbar by resizing in split tasks sample', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{
                    TaskID: 1, TaskName: 'Allocate resources', StartDate: new Date('02/05/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '75',
                            Segments: [
                                { StartDate: new Date('02/05/2019'), Duration: 4 },
                                { StartDate: new Date('02/08/2019'), Duration: 2 }
                            ]
                }],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                includeWeekend: true,
                allowSelection: true,
                allowResizing:true,
                height: '450px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('04/04/2019')
            }, done);
    });
    it('check if the segments merge properly while including weekend', () => {
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-last.e-gantt-child-taskbar.e-segmented-taskbar > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -150, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        var segmentElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-segmented-taskbar')
        expect(isNullOrUndefined(segmentElement)).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Overallocation container not rendered after taskbar resize', () => {
    let ganttObj: Gantt;
    var multiTaskbarData = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                    Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                },
                {
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('04/03/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 70 }], Predecessor: 2, Progress: 30, work: 20
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/09/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 25 }], Predecessor: 3, Progress: 30, work: 10,
                },
            ]
        },
    ];
    var resources = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team', isExpand: false },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team', isExpand: true },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: multiTaskbarData,
        resources: resources,
        viewType: 'ResourceView',
        enableMultiTaskbar: true,
        allowTaskbarDragAndDrop: false,
        allowTaskbarOverlap: false,
        showOverAllocation: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            dependency: 'Predecessor',
            progress: 'Progress',
            resourceInfo: 'resources',
            work: 'work',
            expandState: 'isExpand',
            child: 'subtasks'
        },
        resourceFields: {
            id: 'resourceId',
            name: 'resourceName',
            unit: 'resourceUnit',
            group: 'resourceGroup'
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskID', visible: false },
            { field: 'TaskName', headerText: 'Name', width: 250 },
            { field: 'work', headerText: 'Work' },
            { field: 'Progress' },
            { field: 'resourceGroup', headerText: 'Group' },
            { field: 'StartDate' },
            { field: 'Duration' },
        ],
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
        labelSettings: {
            taskLabel: 'TaskName'
        },
        splitterSettings: {
            columnIndex: 2
        },
        allowResizing: true,
        allowSelection: true,
        highlightWeekends: true,
        treeColumnIndex: 1,
        height: '450px',
        projectStartDate: new Date('03/28/2019'),
        projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('check range container rendered', () => {
        
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(document.getElementsByClassName('e-rg-rangdiv e-leftarc').length).toBe(1);
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -50, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-868784-The taskbar edit action is not working in RTL mode', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Product Concept',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                        { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                    ]
                }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            gridLines: "Both",
            enableRtl: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            highlightWeekends: true,
            labelSettings: {
                taskLabel: 'Progress'
            },
            splitterSettings:{
                columnIndex: 2,
            },
            height: '550px',
        }, done);
    });

   it('Drag and Drop Taskbar while RTL is enabled', () => {
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 80, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/04/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Incorrect offset update while dragging taskbar', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Project initiation',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            {
                                TaskID: 2,
                                TaskName: 'Identify site location',
                                StartDate: new Date('04/02/2019'),
                                Duration: 0,
                                Progress: 30,
                                resources: [1],
                                info: 'Measure the total property area alloted for construction',
                            },
                            {
                                TaskID: 3,
                                TaskName: 'Perform Soil test',
                                StartDate: new Date('04/02/2019'),
                                Duration: 4,
                                Predecessor: '2',
                                resources: [2, 3, 5],
                                info: 'Obtain an engineered soil test of lot where construction is planned.' +
                                    'From an engineer or company specializing in soil testing',
                            },
                            {
                                TaskID: 4,
                                TaskName: 'Soil test approval',
                                StartDate: new Date('04/02/2019'),
                                Duration: 0,
                                Predecessor: '3',
                                Progress: 30,
                            },
                        ],
                    },
                    {
                        TaskID: 5,
                        TaskName: 'Project estimation',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            {
                                TaskID: 6,
                                TaskName: 'Develop floor plan for estimation',
                                StartDate: new Date('04/04/2019'),
                                Duration: 3,
                                Predecessor: '7,8SS',
                                Progress: 30,
                                resources: 4,
                                info: 'Develop floor plans and obtain a materials list for estimations',
                            },
                            {
                                TaskID: 7,
                                TaskName: 'List materials',
                                StartDate: new Date('04/04/2019'),
                                Duration: 3,
                                resources: [4, 8],
                                info: '',
                            },
                            {
                                TaskID: 8,
                                TaskName: 'Estimation approval',
                                StartDate: new Date('04/04/2019'),
                                Duration: 0,
                                Predecessor: '9',
                                resources: [12, 5],
                                info: '',
                            },
                        ],
                    },
                    {
                        TaskID: 9,
                        TaskName: 'Sign contract',
                        StartDate: new Date('04/04/2019'),
                        Duration: 1,
                        Predecessor: '7',
                        Progress: 30,
                        resources: [12],
                        info: 'If required obtain approval from HOA (homeowners association) or ARC (architectural review committee)',
                    },
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    },
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer' },
                    { resourceId: 2, resourceName: 'Rose Fuller' },
                    { resourceId: 3, resourceName: 'Margaret Buchanan' },
                    { resourceId: 4, resourceName: 'Fuller King' },
                    { resourceId: 5, resourceName: 'Davolio Fuller' },
                    { resourceId: 6, resourceName: 'Van Jack' },
                    { resourceId: 7, resourceName: 'Fuller Buchanan' },
                    { resourceId: 8, resourceName: 'Jack Davolio' },
                    { resourceId: 9, resourceName: 'Tamer Vinet' },
                    { resourceId: 10, resourceName: 'Vinet Fuller' },
                    { resourceId: 11, resourceName: 'Bergs Anton' },
                    { resourceId: 12, resourceName: 'Construction Supervisor' },
                ],
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
            }, done);
    });
    it('checking offset', () => {
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#'+ganttObj.element.id+ 'GanttTaskTableBody > tr:nth-child(9) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Slow update multiple connector lines', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                    { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2,6+3days", },
                    { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
                    { TaskID: 5, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "4", Progress: 30 },
                    { TaskID: 6, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "5", Progress: 30 },
                ],
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                includeWeekend: true,
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Checking updated value', () => {
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#'+ganttObj.element.id+ 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/22/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Disable Overlap and child Drag in Resource view', () => {
    let ganttObj: Gantt;
    let multiTaskbarData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                    Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                },
                {
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('04/03/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 70 }], Predecessor: 2, Progress: 30, work: 20
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/09/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 25 }], Predecessor: 3, Progress: 30, work: 10,
                },
            ]
        },
        {
            TaskID: 5,
            TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/01/2019'),
                    Duration: 5, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 50 }], work: 30
                },
                {
                    TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 40 }], Predecessor: '6FS-2', Progress: 30, work: 40
                },
                {
                    TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/09/2019'),
                    Duration: 4, resources: [{ resourceId: 2, resourceUnit: 75 }], Predecessor: '7FS-1', Progress: 30, work: 60,
                }
            ]
        },
        {
            TaskID: 9,
            TaskName: 'Site work',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 10, TaskName: 'Install temporary power service', StartDate: new Date('04/01/2019'), Duration: 14,
                    Progress: 30, resources: [{ resourceId: 3, resourceUnit: 75 }]
                },
                {
                    TaskID: 11, TaskName: 'Clear the building site', StartDate: new Date('04/08/2019'),
                    Duration: 9, Progress: 30, Predecessor: '10FS-9', resources: [3]
                },
                {
                    TaskID: 12, TaskName: 'Sign contract', StartDate: new Date('04/12/2019'),
                    Duration: 5, resources: [3], Predecessor: '11FS-5'
                },
            ]
        }
    ];
    
    let resources = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team', isExpand: false},
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team', isExpand: true},
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team', isExpand: false },
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team', isExpand: false },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team', isExpand: true }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: multiTaskbarData,
    resources: resources,
    viewType: 'ResourceView',
    enableMultiTaskbar: true,
    showOverAllocation: true,
    taskType:'FixedWork',
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        dependency: 'Predecessor',
        progress: 'Progress',
        resourceInfo: 'resources',
        work: 'work',
        expandState: 'isExpand',
        child: 'subtasks'
    },
    resourceFields: {
        id: 'resourceId',
        name: 'resourceName',
        unit: 'resourceUnit',
        group: 'resourceGroup'
    },
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', visible: false },
        { field: 'TaskName', headerText: 'Name', width: 250 },
        { field: 'work', headerText: 'Work' },
        { field: 'Progress' },
        { field: 'resourceGroup', headerText: 'Group' },
        { field: 'StartDate' },
        { field: 'Duration' },
    ],
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
    labelSettings: {
        taskLabel: 'TaskName'
    },
    splitterSettings: {
        columnIndex: 2
    },
    allowResizing: true,
    allowSelection: true,
    allowTaskbarOverlap: false,
    highlightWeekends: true,
    treeColumnIndex: 1,
    height: '450px',
    projectStartDate: new Date('03/28/2019'),
    projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Child Drag', () => {
        ganttObj.actionComplete = (args) => {
            expect(parseInt(ganttObj.currentViewData[2].ganttProperties.taskId)).toBe(3);
        };
        
            let dragElement: HTMLElement = ganttObj.element.querySelector('#'+ganttObj.element.id+ 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 180, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Incorrect offset update while dragging taskbar - CR 544540', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Project initiation',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            {
                                TaskID: 2,
                                TaskName: 'Identify site location',
                                StartDate: new Date('04/02/2019'),
                                Duration: 0,
                                Progress: 30,
                            },
                            {
                                TaskID: 3,
                                TaskName: 'Perform Soil test',
                                StartDate: new Date('04/02/2019'),
                                Duration: 4,
                            },
                            {
                                TaskID: 4,
                                TaskName: 'Soil test approval',
                                StartDate: new Date('04/02/2019'),
                                Duration: 0,
                                Predecessor: '6FS',
                                Progress: 30,
                            },
                        ],
                    },
                    {
                        TaskID: 5,
                        TaskName: 'Project estimation',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            {
                                TaskID: 6,
                                TaskName: 'Develop floor plan for estimation',
                                StartDate: new Date('04/04/2019'),
                                Duration: 3,
                                Predecessor: '',
                                Progress: 30,
                            },
                            {
                                TaskID: 7,
                                TaskName: 'List materials',
                                StartDate: new Date('04/04/2019'),
                                Duration: 3,
                                Predecessor: '3SF,6FS',
                            },
                            {
                                TaskID: 8,
                                TaskName: 'Estimation approval',
                                StartDate: new Date('04/04/2019'),
                                Duration: 0,
                                Predecessor: '',
                            },
                        ],
                    },
                ],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources'
                },
                treeColumnIndex: 1,
                height: "450px",
                allowSelection: true,
                dateFormat: "MMM dd, y",
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
                highlightWeekends: true,
                gridLines: 'Both',
                eventMarkers: [
                    { day: '4/17/2019', label: 'Project approval and kick-off' },
                    { day: '5/3/2019', label: 'Foundation inspection' },
                    { day: '6/7/2019', label: 'Site manager inspection' },
                    { day: '7/16/2019', label: 'Property handover and sign-off' },
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer' },
                    { resourceId: 2, resourceName: 'Rose Fuller' },
                    { resourceId: 3, resourceName: 'Margaret Buchanan' },
                    { resourceId: 4, resourceName: 'Fuller King' },
                    { resourceId: 5, resourceName: 'Davolio Fuller' },
                    { resourceId: 6, resourceName: 'Van Jack' },
                    { resourceId: 7, resourceName: 'Fuller Buchanan' },
                    { resourceId: 8, resourceName: 'Jack Davolio' },
                    { resourceId: 9, resourceName: 'Tamer Vinet' },
                    { resourceId: 10, resourceName: 'Vinet Fuller' },
                    { resourceId: 11, resourceName: 'Bergs Anton' },
                    { resourceId: 12, resourceName: 'Construction Supervisor' },
                ],
                splitterSettings: {
                    position: "35%"
                }
            }, done);
    });
    it('checking offset', () => {
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(7) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        let storeOffset :any= ganttObj.currentViewData[6].ganttProperties.predecessor[0].offset
        let dragElement1: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement1, 'mousedown', dragElement1.offsetLeft, dragElement1.offsetTop);
        triggerMouseEvent(dragElement1, 'mousemove', dragElement1.offsetLeft + 180, 0);
        triggerMouseEvent(dragElement1, 'mouseup');
        expect(ganttObj.currentViewData[6].ganttProperties.predecessor[0].offset > storeOffset).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Incorrect offset update while dragging taskbar - CR 544540', () => {
    let ganttObj: Gantt;
    let data =  [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Identify site location',
                    StartDate: new Date('04/02/2019'),
                    Duration: 0,
                    Progress: 30,
                },
                {
                    TaskID: 3,
                    TaskName: 'Perform Soil test',
                    StartDate: new Date('04/02/2019'),
                    Duration: 4,
                },
                {
                    TaskID: 4,
                    TaskName: 'Soil test approval',
                    StartDate: new Date('04/02/2019'),
                    Duration: 0,
                    Predecessor: '6FS',
                    Progress: 30,
                },
            ],
        },
        {
            TaskID: 5,
            TaskName: 'Project estimation',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 6,
                    TaskName: 'Develop floor plan for estimation',
                    StartDate: new Date('04/04/2019'),
                    Duration: 3,
                    Predecessor: '',
                    Progress: 30,
                },
                {
                    TaskID: 7,
                    TaskName: 'List materials',
                    StartDate: new Date('04/04/2019'),
                    Duration: 3,
                    Predecessor: '3SF,6FS',
                },
                {
                    TaskID: 8,
                    TaskName: 'Estimation approval',
                    StartDate: new Date('04/04/2019'),
                    Duration: 0,
                    Predecessor: '',
                },
            ],
        },
    ];
    let resource = [
        { resourceId: 1, resourceName: 'Martin Tamer' },
        { resourceId: 2, resourceName: 'Rose Fuller' },
        { resourceId: 3, resourceName: 'Margaret Buchanan' },
        { resourceId: 4, resourceName: 'Fuller King' },
        { resourceId: 5, resourceName: 'Davolio Fuller' },
        { resourceId: 6, resourceName: 'Van Jack' },
        { resourceId: 7, resourceName: 'Fuller Buchanan' },
        { resourceId: 8, resourceName: 'Jack Davolio' },
        { resourceId: 9, resourceName: 'Tamer Vinet' },
        { resourceId: 10, resourceName: 'Vinet Fuller' },
        { resourceId: 11, resourceName: 'Bergs Anton' },
        { resourceId: 12, resourceName: 'Construction Supervisor' },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources'
                },
                treeColumnIndex: 1,
                height: "450px",
                allowSelection: true,
                dateFormat: "MMM dd, y",
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
                highlightWeekends: true,
                gridLines: 'Both',
                eventMarkers: [
                    { day: '4/17/2019', label: 'Project approval and kick-off' },
                    { day: '5/3/2019', label: 'Foundation inspection' },
                    { day: '6/7/2019', label: 'Site manager inspection' },
                    { day: '7/16/2019', label: 'Property handover and sign-off' },
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: resource,
                splitterSettings: {
                    position: "35%"
                }
            }, done);
    });
    it('checking offset', () => {
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(7) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        let storeOffset :any= ganttObj.currentViewData[6].ganttProperties.predecessor[0].offset
        let dragElement1: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement1, 'mousedown', dragElement1.offsetLeft, dragElement1.offsetTop);
        triggerMouseEvent(dragElement1, 'mousemove', dragElement1.offsetLeft + 180, 0);
        triggerMouseEvent(dragElement1, 'mouseup');
        expect(ganttObj.currentViewData[6].ganttProperties.predecessor[0].offset > storeOffset).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
    describe(" cloneTaskbar drag drop without overallocation", () => {
        Gantt.Inject(Edit,RowDD);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
          ganttObj = createGantt(
            {
                dataSource: multiTaskbarData,
            resources: multiResources,
            allowRowDragAndDrop: true,
            enableMultiTaskbar: true,
            allowTaskbarDragAndDrop: true,
            allowTaskbarOverlap: false,
            showOverAllocation: true,
            viewType: 'ResourceView',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                expandState: 'isExpand',
                resourceInfo: 'resources',
                work: 'work',
                child: 'subtasks'
            },
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit',
                group: 'resourceGroup'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'work', headerText: 'Work' },
                { field: 'Progress' },
                { field: 'resourceGroup', headerText: 'Group' },
                { field: 'StartDate' },
                { field: 'Duration' },
            ],
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
            labelSettings: {
                taskLabel: 'TaskName'
            },
            splitterSettings: {
                columnIndex: 2
            },
            allowResizing: true,
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            height: '450px',
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019')
            },
            done
          );
        });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
        it("Taskbar Drag and drop", () => {
            ganttObj.actionComplete = (args: any) => {
                if (args.requestType == 'rowDropped') {
                    expect(args.data[0].resources).toBe('Margaret Buchanan');
                    expect(args.modifiedRecords[1].childRecords.length).toBe(2);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1)').getElementsByClassName('e-taskbar-main-container')[1] as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 70, 200);
            var cloneElement = ganttObj.element.getElementsByClassName('e-clone-taskbar');
            expect(! isNullOrUndefined(cloneElement)).toBe(true);
            var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
            expect(! isNullOrUndefined(resizeCheck)).toBe(true);
            triggerMouseEvent(dragElement, 'mouseup');
      });
      it("Taskbar Drag and drop in Auto scroll", () => {
        ganttObj.actionComplete = (args: any) => {
            if (args.requestType == 'rowDropped') {
                expect(args.data[0].resources).toBe('Davolio Fuller');
                expect(args.modifiedRecords[1].childRecords.length).toBe(2);
                expect(args.modifiedRecords[2].childRecords.length).toBe(4);
            }
        };
        
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1)').getElementsByClassName('e-taskbar-main-container')[1] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 70, 300);
        var cloneElement = ganttObj.element.getElementsByClassName('e-clone-taskbar');
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
          destroyGantt(ganttObj);
        }
      });
    });
    
    describe('clone taskbar Disable offset validation', () => {
        Gantt.Inject(Edit);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: predecessorOffSetValidation,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor'
                    },
                    UpdateOffsetOnTaskbarEdit:false,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                    rowHeight: 40,
                    taskbarHeight: 30,
                    allowSelection: false,
                    editSettings: {
                        allowEditing: true,
                        allowTaskbarEditing: true
                    }
                }, done);
        });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
        it('Child right drag action', () => {
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.currentViewData[3]['Predecessor']).toBe('2FS');
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
            expect(! isNullOrUndefined(cloneElement)).toBe(true);
            var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
            expect(! isNullOrUndefined(resizeCheck)).toBe(true);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Child left drag action', () => {
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.currentViewData[3]['Predecessor']).toBe('2FS');
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 300, 0);
            var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
            expect(! isNullOrUndefined(cloneElement)).toBe(true);
            var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
            expect(! isNullOrUndefined(resizeCheck)).toBe(true);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('CR-882787 Dependency ', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: crDialogEditData,
                    allowSorting: true,
                    taskFields: {
                        id: 'taskId',
                        name: 'taskName',
                        startDate: 'startDate',
                        endDate: 'endDate',
                        dependency: 'predecessor',
                        child: 'subTasks',
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                        'PrevTimeSpan', 'NextTimeSpan'],
                    allowSelection: true,
                    gridLines: "Both",
                    enableTimelineVirtualization: true,
                    enableVirtualization: true,
                    showColumnMenu: false,
                    highlightWeekends: true,
                    timelineSettings: {
                        topTier: {
                            unit: 'Week',
                            format: 'dd/MM/yyyy'
                        },
                        bottomTier: {
                            unit: 'Day',
                            count: 1
                        }
                    },
                    height: '550px',
                }, done);
        });
        it('Checking updated value', () => {
            let dragElement: HTMLElement = ganttObj.element.querySelector('#'+ganttObj.element.id+ 'GanttTaskTableBody > tr:nth-child(13) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[12].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/04/2022');
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
describe('Split task left resize', () => {
        let ganttObj: Gantt;
        var GanttData = [
            {
                TaskID: 1,
                TaskName: 'Project Initiation',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50,
                        Segments: [
                            { StartDate: new Date("04/02/2019"), Duration: 2 },
                            { StartDate: new Date("04/04/2019"), Duration: 2 }
                        ] },
                    { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
                    { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
                ]
            }
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: GanttData,
        allowSorting: true,
        allowReordering: true,
        enableContextMenu: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            child: 'subtasks',
            segments: 'Segments'
        },
        renderBaseline: true,
        baselineColor: 'red',
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: false,
        enableVirtualization: false,
        allowRowDragAndDrop: true,
        splitterSettings: {
            position: "50%",
        },
        tooltipSettings: {
            showTooltip: true
        },
        filterSettings: {
            type: 'Menu'
        },
        allowFiltering: true,
        gridLines: "Both",
        showColumnMenu: true,
        highlightWeekends: true,
        timelineSettings: {
            topTier: {
                unit: 'Week',
                count: 1,
                format: "MMM dd, yyyy"
            },
            bottomTier: {
                unit: 'Day',
                count: 1,
                format: "d"
            }
        },
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        height: '550px',
        allowUnscheduledTasks: true,
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('duration calculation',() => {
            ganttObj.fitToProject();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(args.data.ganttProperties.duration).toBe(5);
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-last.e-gantt-child-taskbar.e-segmented-taskbar > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft - 20), dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mouseup');
        }); 
        afterAll(() => {
            destroyGantt(ganttObj);       
        });
    });
    describe('Validating predecessor', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: MT877459,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                        child: 'subtasks',
                        notes: 'info',
                        resourceInfo: 'resources',
                        indicators: 'Indicators'
                    },
                    enableUndoRedo: true,
                    showColumnMenu: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Undo', 'Redo'],
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'Predecessor' },
                    ],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                    },
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Checking for dependency offset', () => {
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[3].ganttProperties.predecessor[0].offset).toBe(3)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Validating predecessor with preserveLinkWithEditing to false', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: predecessorMT877459,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                        child: 'subtasks',
                        notes: 'info',
                        resourceInfo: 'resources',
                        indicators: 'Indicators'
                    },
                    enableUndoRedo: true,
                    showColumnMenu: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Undo', 'Redo'],
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'Predecessor' },
                    ],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                    },
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Checking for dependency offset SS', (done:Function) => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false
                }
            };
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.predecessor[0].offset).toBe(4)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelector('#'+ganttObj.element.id+'_ValidationAddlineOffset')['checked'] = true;
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
        });
        it('Checking for dependency negative offset SS', (done:Function) => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false
                }
            };
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.predecessor[0].offset).toBe(-4)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 380, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelector('#'+ganttObj.element.id+'_ValidationAddlineOffset')['checked'] = true;
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
        });
        it('Checking for dependency offset FS', (done:Function) => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false
                }
            };
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.predecessor[0].offset).toBe(5)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelector('#'+ganttObj.element.id+'_ValidationAddlineOffset')['checked'] = true;
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
        });
        it('Checking for dependency negative offset FS', (done:Function) => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false
                }
            };
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.predecessor[0].offset).toBe(-3)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 380, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelector('#'+ganttObj.element.id+'_ValidationAddlineOffset')['checked'] = true;
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
        });
        it('Checking for dependency offset FF', (done:Function) => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false
                }
            };
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.predecessor[0].offset).toBe(4)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelector('#'+ganttObj.element.id+'_ValidationAddlineOffset')['checked'] = true;
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
        });
        it('Checking for dependency negative offset FF', (done:Function) => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false
                }
            };
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.predecessor[0].offset).toBe(-4)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 380, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelector('#'+ganttObj.element.id+'_ValidationAddlineOffset')['checked'] = true;
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
        });
        it('Checking for dependency offset SF', (done:Function) => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false
                }
            };
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.predecessor[0].offset).toBe(11)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 580, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelector('#'+ganttObj.element.id+'_ValidationAddlineOffset')['checked'] = true;
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
        });
        it('Checking for dependency negative offset SF', (done:Function) => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false
                }
            };
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.predecessor[0].offset).toBe(-4)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 880, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelector('#'+ganttObj.element.id+'_ValidationAddlineOffset')['checked'] = true;
            let button: HTMLElement = document.getElementById(ganttObj.element.id+'_dialogValidationRule').querySelectorAll('button')[1] as HTMLElement
            triggerMouseEvent(button, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Validating predecessor with removeLink to true', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: parentPredecessorMT877459,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                        child: 'subtasks',
                        notes: 'info',
                        resourceInfo: 'resources',
                        indicators: 'Indicators'
                    },
                    enableUndoRedo: true,
                    showColumnMenu: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Undo', 'Redo'],
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'Predecessor' },
                    ],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                    },
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Removing parent dependency', (done:Function) => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "validateLinkedTask") {
                    args.validateMode.removeLink = true
                }
            };
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(args.data.ganttProperties.predecessor.length).toBe(0)
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-parent-taskbar-inner-div.e-gantt-parent-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Show active predecessor', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: parentPredecessorMT877459,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                        child: 'subtasks',
                        notes: 'info',
                        resourceInfo: 'resources',
                        indicators: 'Indicators'
                    },
                    enableUndoRedo: true,
                    showColumnMenu: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Undo', 'Redo'],
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'Predecessor' },
                    ],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                    },
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Check if the correct class is added', () => {
            ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[1];
            ganttObj.editModule.taskbarEditModule.taskBarEditElement = (ganttObj.chartPane.querySelectorAll('.e-taskbar-main-container')[1] as HTMLElement);
            ganttObj.editModule.taskbarEditModule['showHideActivePredecessors'](true)
            expect(document.getElementsByClassName('e-active-child-task').length > 0).toBe(true)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Checking if dependency valid', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: parentPredecessorMT877459,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                        child: 'subtasks',
                        notes: 'info',
                        resourceInfo: 'resources',
                        indicators: 'Indicators'
                    },
                    enableUndoRedo: true,
                    showColumnMenu: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Undo', 'Redo'],
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'Predecessor' },
                    ],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                    },
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Check dependency', () => {
            ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[1];
            ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[4]
            expect(ganttObj.editModule.taskbarEditModule['validateConnectorPoint']()).toBe(true)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Show active predecessor remove class', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: parentPredecessorMT877459,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                        child: 'subtasks',
                        notes: 'info',
                        resourceInfo: 'resources',
                        indicators: 'Indicators'
                    },
                    enableUndoRedo: true,
                    showColumnMenu: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Undo', 'Redo'],
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'Predecessor' },
                    ],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                    },
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Check if the correct class is removed', () => {
            ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[1];
            ganttObj.editModule.taskbarEditModule.taskBarEditElement = (ganttObj.chartPane.querySelectorAll('.e-taskbar-main-container')[1] as HTMLElement);
            ganttObj.editModule.taskbarEditModule['showHideActivePredecessors'](false)
            expect(document.getElementsByClassName('e-active-child-task').length === 0).toBe(true)
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Hiding Pop up', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: parentPredecessorMT877459,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Multiple'
                    },
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                        child: 'subtasks',
                        notes: 'info',
                        resourceInfo: 'resources',
                        indicators: 'Indicators'
                    },
                    enableUndoRedo: true,
                    showColumnMenu: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Undo', 'Redo'],
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'Predecessor' },
                    ],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                    },
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Check if the correct class is removed', () => {
            ganttObj.editModule.taskbarEditModule['multipleSelectionEnabled']()
            expect(document.getElementsByClassName('e-gridpopup')[0]['style'].display).toBe('none')
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Getting co-ordinates', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: parentMT877459,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Multiple'
                    },
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                        child: 'subtasks',
                        notes: 'info',
                        resourceInfo: 'resources',
                        indicators: 'Indicators'
                    },
                    enableUndoRedo: true,
                    showColumnMenu: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Undo', 'Redo'],
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'Predecessor' },
                    ],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                    },
                    enableContextMenu: true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Checking obtained co-ordinate', () => {
            const touchMoveEvent = new TouchEvent('touchmove', {
                bubbles: true,
                cancelable: true,
                view: window,
                changedTouches: [
                    new Touch({
                        identifier: 1,
                        target: document.body,
                        clientX: 100,
                        clientY: 200,
                        pageX: 100,
                        pageY: 200,
                        radiusX: 2.5,
                        radiusY: 2.5,
                        rotationAngle: 0,
                        force: 0.5
                    })
                ]
            });
            const coordinates = ganttObj.editModule.taskbarEditModule['getCoordinate'](touchMoveEvent);
            expect(coordinates).toEqual({ pageX: 100, pageY: 200 });
        });    
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Getting end date', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: parentMT877459,
                    selectionSettings: {
                        mode: 'Row',
                        type: 'Multiple'
                    },
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        baselineStartDate: "BaselineStartDate",
                        baselineEndDate: "BaselineEndDate",
                        child: 'subtasks',
                        notes: 'info',
                        resourceInfo: 'resources',
                        indicators: 'Indicators'
                    },
                    enableUndoRedo: true,
                    showColumnMenu: true,
                    undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                    toolbar: ['Undo', 'Redo'],
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                        { field: 'Duration', headerText: 'Duration', allowEditing: false },
                        { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                        { field: 'Predecessor' },
                    ],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                    },
                    enableContextMenu: true,
                    allowTaskbarDragAndDrop :true,
                    allowSelection: true,
                    height: '450px',
                    treeColumnIndex: 1,
                    highlightWeekends: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Checking for taskbar end date', (done:Function) => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(ganttObj.getFormatedDate(ganttObj.flatData[5].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/8/2019');
                    expect(ganttObj.editModule.taskbarEditModule.leftValue).toBe(0);
                    expect(ganttObj.editModule.taskbarEditModule['previousLeftValue']).toBe(0);
                    done()
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-parent-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });    
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    //// This doesn't work too
describe('Changing first segment position', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                dateFormat:'MM/dd/yyyy hh:mm:ss',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                
                allowSelection: true,
                height: '450px',
            }, done);
    });
    it('Checking segment length', () => {
    //    ganttObj.taskbarEdited = () => {
    //     expect(ganttObj.getFormatedDate(ganttObj.flatData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/6/2019');
    // };
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 80), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});

/////
describe('Adaptive mode', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: parentMT877459,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Multiple'
                },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources',
                    indicators: 'Indicators'
                },
                enableUndoRedo: true,
                showColumnMenu: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                toolbar: ['Undo', 'Redo'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'Predecessor' },
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                enableContextMenu: true,
                allowTaskbarDragAndDrop :true,
                allowSelection: true,
                height: '450px',
                treeColumnIndex: 1,
                highlightWeekends: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('Checking for taskbar end date', () => {
        ganttObj.isAdaptive = true
        let dragElement: HTMLElement =  ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        expect(ganttObj.flatData.length).toBe(6)
    });    
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Trigerring dependency event', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: parentMT877459,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Multiple'
                },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources',
                    indicators: 'Indicators'
                },
                enableUndoRedo: true,
                showColumnMenu: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                toolbar: ['Undo', 'Redo'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'Predecessor' },
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                enableContextMenu: true,
                allowTaskbarDragAndDrop :true,
                allowSelection: true,
                height: '450px',
                treeColumnIndex: 1,
                highlightWeekends: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('Checking for predecessor tooltip', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[4];
        ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[5];
        ganttObj.editModule.taskbarEditModule.taskBarEditAction = 'ConnectorPointLeftDrag';
        ganttObj.editModule.taskbarEditModule.connectorSecondAction = 'ConnectorPointLeftDrag';
        ganttObj.editModule.taskbarEditModule.connectorSecondElement = document.getElementsByClassName('e-taskbar-main-container')[5]
        let pointerEvent = new PointerEvent('pointermove', {
            bubbles: true,
            cancelable: true,
            view: window,
            screenX: 632,
            screenY: 160,
            clientX: 632,
            clientY: 73,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0,
            buttons: 1,
            relatedTarget: null,
            pointerId: 1,
            width: 1,
            height: 1,
            pressure: 0.5,
            tangentialPressure: 0,
            tiltX: 0,
            tiltY: 0,
            twist: 0,
            pointerType: 'mouse',
            isPrimary: true
        });
        ganttObj.editModule.taskbarEditModule['triggerDependencyEvent'](pointerEvent)
        expect(document.getElementsByClassName('e-gantt-tooltip').length > 0).toBe(true)
    });    
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Trigerring dependency event', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: parentMT877459,
                selectionSettings: {
                    mode: 'Row',
                    type: 'Multiple'
                },
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources',
                    indicators: 'Indicators'
                },
                enableUndoRedo: true,
                showColumnMenu: true,
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                toolbar: ['Undo', 'Redo'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'Predecessor' },
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                enableContextMenu: true,
                allowTaskbarDragAndDrop :true,
                allowSelection: true,
                height: '450px',
                treeColumnIndex: 1,
                highlightWeekends: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('Checking for predecessor tooltip', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[4];
        ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[5];
        ganttObj.editModule.taskbarEditModule.taskBarEditAction = 'ConnectorPointLeftDrag';
        ganttObj.editModule.taskbarEditModule.connectorSecondAction = 'ConnectorPointLeftDrag';
        ganttObj.editModule.taskbarEditModule.connectorSecondElement = document.getElementsByClassName('e-taskbar-main-container')[5]
        let pointerEvent = new PointerEvent('pointermove', {
            bubbles: true,
            cancelable: true,
            view: window,
            screenX: 632,
            screenY: 160,
            clientX: 632,
            clientY: 73,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0,
            buttons: 1,
            relatedTarget: null,
            pointerId: 1,
            width: 1,
            height: 1,
            pressure: 0.5,
            tangentialPressure: 0,
            tiltX: 0,
            tiltY: 0,
            twist: 0,
            pointerType: 'mouse',
            isPrimary: true
        });
        ganttObj.editModule.taskbarEditModule['triggerDependencyEvent'](pointerEvent)
        expect(document.getElementsByClassName('e-gantt-tooltip').length > 0).toBe(true)
    });    
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Dragging taskbar to next timeline', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                dateFormat:'MM/dd/yyyy hh:mm:ss',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                
                allowSelection: true,
                height: '450px',
            }, done);
    });
    it('Checking end date', (done:Function) => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "save") {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'M/d/yyyy')).toBe('3/11/2019')
                done()
            }
        };
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 1500), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('Mouse move action', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                dateFormat:'MM/dd/yyyy hh:mm:ss',
                allowTaskbarDragAndDrop : true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                
                allowSelection: true,
                height: '450px',
            }, done);
    });
    it('Taskbar drag', (done:Function) => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "save") {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'M/d/yyyy')).toBe('2/19/2019')
                done()
            }
        };
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 80), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('890951 - Duration column is not working properly when using editType as numericedit ', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectSplitTask,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                editSettings: {
                    allowTaskbarEditing: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', },
                    { field: 'Duration', headerText: 'Duration', type: 'number', editType: 'numericedit' },
                ],
                toolbar: ['Add', 'Edit', 'Delete', 'Cancel', 'Update', 'ExpandAll', 'CollapseAll'],
                allowSelection: true,
                enableContextMenu: true
            }, done);
    });
    it('Right resizing', () => {
        ganttObj.actionBegin = (args: object) => { };         
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data['EndDate'], 'MM/dd/yyyy HH:mm')).toBe('04/08/2019 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('04/05/2019 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
            expect(ganttObj.currentViewData[1].taskData['Duration']).toBe(3);
        };      
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-segment-last > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });   
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking for offset in autoCalculateDateScheduling to false', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: cR893051,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                autoCalculateDateScheduling: false,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                //   allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Moving Taskbar', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container >div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 180, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.flatData[3].ganttProperties.predecessor[0].offset).toBe(0)
    });   
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('trigger mouseleave method ', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectSplitTask,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                editSettings: {
                    allowEditing: true,
                    allowAdding: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', },
                    { field: 'Duration', headerText: 'Duration', type: 'number', editType: 'numericedit' },
                ],
                toolbar: ['Add', 'Edit', 'Delete', 'Cancel', 'Update', 'ExpandAll', 'CollapseAll'],
                allowSelection: true,
                enableContextMenu: true
            }, done);
    });
    it('trigger mouseleavehandler ', () => {
        ganttObj.editModule.taskbarEditModule['mouseLeaveHandler'](undefined);
        ganttObj.editModule.taskbarEditModule.taskBarEditAction = 'RightResizing';
        ganttObj.editModule.taskbarEditModule['mouseLeaveHandler'](undefined);
    });   
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Checking if dependency valid', () => {
    let ganttObj: Gantt;
    let projectNewData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2",
                Indicators: [
                    {
                        'date': '04/10/2019',
                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                        'name': 'Indicator title',
                        'tooltip': 'tooltip'
                    }
                ] 
            },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "3SF" ,Progress: 30},
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "6FF" },
        {
            TaskID: 6,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 7,
                    TaskName: 'Demand Analysis',
                    StartDate: new Date('04/04/2019'),
                    EndDate: new Date('04/21/2019'),
                    subtasks: [
                        { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5",Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                    ]
                },
                { TaskID: 10, TaskName: 'Competitor Analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "7,8" ,Progress: 30},
                { TaskID: 11, TaskName: 'Product strength analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "9" },
                { TaskID: 12, TaskName: 'Research complete', StartDate: new Date('04/04/2019'), Duration: 0, Predecessor: "10" }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
    allowSorting: true,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency:'Predecessor',
        baselineStartDate: "BaselineStartDate",
        baselineEndDate: "BaselineEndDate",
        child: 'subtasks',
        indicators: 'Indicators'
    },
    renderBaseline: true,
    baselineColor: 'red',
    allowTaskbarDragAndDrop: true,
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', headerText: 'Task ID' },
        { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
        { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
        { field: 'Duration', headerText: 'Duration', allowEditing: false },
        { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
        { field: 'CustomColumn', headerText: 'CustomColumn' }
    ],
    selectedRowIndex: 1,
    splitterSettings: {
        position: "50%",
       // columnIndex: 4
    },
    selectionSettings: {
        mode: 'Row',
        type: 'Single',
        enableToggle: false
    },
    tooltipSettings: {
        showTooltip: true
    },
    filterSettings: {
        type: 'Menu'
    },
    allowFiltering: true,
    gridLines: "Both",
    showColumnMenu: true,
    highlightWeekends: true,
    timelineSettings: {
        showTooltip: true,
        topTier: {
            unit: 'Week',
            format: 'dd/MM/yyyy'
        },
        bottomTier: {
            unit: 'Day',
            count: 1
        }
    },
    searchSettings:
     { fields: ['TaskName', 'Duration'] 
    },
    labelSettings: {
        leftLabel: 'TaskID',
        rightLabel: 'Task Name: ${taskData.TaskName}',
        taskLabel: '${Progress}%'
    },
    allowResizing: true,
    readOnly: false,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
    allowUnscheduledTasks: true,
  //  connectorLineBackground: "red",
  //  connectorLineWidth: 3,
    projectStartDate: new Date('03/25/2019'),
    projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Check dependency', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[1];
        ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[2];
        expect(ganttObj.editModule.taskbarEditModule['validateConnectorPoint']()).toBe(false)
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[3];
        ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[2];
        expect(ganttObj.editModule.taskbarEditModule['validateConnectorPoint']()).toBe(false)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('taskbar drag and drop', () => {
    let ganttObj: Gantt;
    let splitTasksData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Project Schedule',
            StartDate: new Date('02/04/2019'),
            EndDate: new Date('03/10/2019'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Planning',
                    StartDate: new Date('02/04/2019'),
                    subtasks: [
                        {
                            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '60',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 2 },
                                { StartDate: new Date('02/05/2019'), Duration: 5 },
                                { StartDate: new Date('02/08/2019'), Duration: 3 }
                              ]
                        },
                        {
                            TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '90'
                        },
                        {
                            TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '75',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 4 },
                                { StartDate: new Date('02/08/2019'), Duration: 2 }
                              ]
                        },
                        {
                            TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                            Duration: 0, Predecessor: '3FS,5FS'
                        },
                    ]
                },
                {
                    TaskID: 7,
                    TaskName: 'Design',
                    StartDate: new Date('02/25/2019'),
                    subtasks: [
                        {
                            TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                            Duration: 5, Progress: '60', Predecessor: '6FS'
                        },
                        {
                            TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                            Duration: 5, Progress: '100', Predecessor: '6FS',
                            Segments: [
                                { StartDate: new Date('02/25/2019'), Duration: 2 },
                                { StartDate: new Date('02/28/2019'), Duration: 3 }
                              ]
                        },
                        {
                            TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/25/2019'),
                            EndDate: new Date('03/01/2019'), Duration: 4, Progress: '100', Predecessor: '9FS'
                        },
                        {
                            TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/25/2019'), EndDate: new Date('02/25/2019'),
                            Duration: 0, Predecessor: '10FS'
                        }
                    ]
                }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
    allowSorting: true,
    allowReordering: true,
    allowTaskbarDragAndDrop: true,
    enableContextMenu: true,
    enableVirtualization: false,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks',
        segments: 'Segments'
    },
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', width: 60 },
        { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
        { field: 'Progress' },
        { field: 'Predecessor' }
    ],
    sortSettings: {
        columns: [{ field: 'TaskID', direction: 'Ascending' }, 
        { field: 'TaskName', direction: 'Ascending' }]
    },
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
    'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],

    allowExcelExport: true,
    allowPdfExport: true,
    allowSelection: true,
    allowRowDragAndDrop: true,
    selectedRowIndex: 1,
    splitterSettings: {
        position: "50%",
       // columnIndex: 4
    },
    selectionSettings: {
        mode: 'Row',
        type: 'Single',
        enableToggle: false
    },
    tooltipSettings: {
        showTooltip: true
    },
    filterSettings: {
        type: 'Menu'
    },
    allowFiltering: true,
    gridLines: "Both",
    showColumnMenu: true,
    highlightWeekends: true,
    timelineSettings: {
        showTooltip: true,
        topTier: {
            unit: 'Week',
            format: 'dd/MM/yyyy'
        },
        bottomTier: {
            unit: 'Day',
            count: 1
        }
    },
    eventMarkers: [
        {
            day: '04/10/2019',
            cssClass: 'e-custom-event-marker',
            label: 'Project approval and kick-off'
        }
    ],
    holidays: [{
        from: "04/04/2019",
        to: "04/05/2019",
        label: " Public holidays",
        cssClass: "e-custom-holiday"
    
    },
    {
        from: "04/12/2019",
        to: "04/12/2019",
        label: " Public holiday",
        cssClass: "e-custom-holiday"
    
    }],
    searchSettings:
     { fields: ['TaskName', 'Duration'] 
    },
    labelSettings: {
        leftLabel: 'TaskID',
        rightLabel: 'Task Name: ${taskData.TaskName}',
        taskLabel: '${Progress}%'
    },
    allowResizing: true,
    readOnly: false,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
    projectStartDate: new Date('01/30/2019'),
    projectEndDate: new Date('03/04/2019')
            }, done);
    });
    beforeEach(function (done) {
            setTimeout(done, 500);
        });
    it('progress resize', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-child-progress-resizer');
    triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    triggerMouseEvent(dragElement, 'mousemove', 50, 0);
    triggerMouseEvent(dragElement, 'mouseup');
    });
    it('right resize', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-first.e-gantt-child-taskbar.e-segmented-taskbar > div.e-taskbar-right-resizer.e-icon');
    triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    triggerMouseEvent(dragElement, 'mousemove', 50, 0);
    triggerMouseEvent(dragElement, 'mouseup');
    });
    it('left resize', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-first.e-gantt-child-taskbar.e-segmented-taskbar > div.e-taskbar-left-resizer.e-icon');
    triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    triggerMouseEvent(dragElement, 'mousemove', 50, 0);
    triggerMouseEvent(dragElement, 'mouseup');
    });
    it('child drag', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-first.e-gantt-child-taskbar.e-segmented-taskbar');
    triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    triggerMouseEvent(dragElement, 'mousemove', 50, 0);
    triggerMouseEvent(dragElement, 'mouseup');
    });
    it('last child drag', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-last.e-gantt-child-taskbar.e-segmented-taskbar');
    triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    triggerMouseEvent(dragElement, 'mousemove', 50, 0);
    triggerMouseEvent(dragElement, 'mouseup');
    });
    it('connetor point left drag', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 800, 100);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('connetor point right drag', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-right-connectorpoint-outer-div > div.e-connectorpoint-right') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 800, 100);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('resource view taskbar drag and drop', () => {
    let ganttObj: Gantt;
    var resourcesData = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                    Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                },
                {
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                },
            ]
        },
        {
            TaskID: 5,
            TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
                    Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
                },
                {
                    TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2019'), Duration: 12,
                    resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
                },
                {
                    TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2019'),
                    Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
                },
                {
                    TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
                    Duration: 4, Progress: 30, resources: [4]
                },
                {
                    TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 4,
                    Progress: 30, Predecessor: '9SS', resources: [3]
                },
                {
                    TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2019'),
                    Duration: 3, resources: [2]
                },
                {
                    TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2019'),
                    Duration: 4, Progress: 30, resources: [3]
                }
            ]
        },
        {
            TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 2,
            Progress: 30,
        }
    ];
    var resourceCollection = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
        { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
        { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
        { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData,
        resources: resourceCollection,
        viewType: 'ResourceView',
        showOverAllocation: true,
        enableContextMenu: true,
        enableMultiTaskbar: true,
        allowTaskbarOverlap: false,
        enableUndoRedo: true,
        allowSorting: true,
        allowReordering: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            endDate: 'EndDate',
            duration: 'Duration',
            progress: 'Progress',
            dependency: 'Predecessor',
            resourceInfo: 'resources',
            work: 'work',
            child: 'subtasks'
        },
        resourceFields: {
            id: 'resourceId',
            name: 'resourceName',
            unit: 'resourceUnit',
            group: 'resourceGroup'
        },
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
        },
        columns: [
            { field: 'TaskID', visible: false },
            { field: 'TaskName', headerText: 'Name', width: 250 },
            { field: 'work', headerText: 'Work', visible: false },
            { field: 'Progress' },
            { field: 'resourceGroup', headerText: 'Group' },
            { field: 'StartDate' },
            { field: 'Duration' },
        ],
        toolbar: ['Add', 'Undo', 'Redo'],
        allowTaskbarDragAndDrop: true,
        labelSettings: {
            rightLabel: 'resources',
            taskLabel: 'Progress'
        },
        splitterSettings: {
            columnIndex: 3
        },
        selectionSettings: {
            mode: 'Row',
            type: 'Single',
            enableToggle: false
        },
        tooltipSettings: {
            showTooltip: true
        },
        timelineSettings: {
            showTooltip: true,
            topTier: {
                unit: 'Week',
                format: 'dd/MM/yyyy'
            },
            bottomTier: {
                unit: 'Day',
                count: 1
            }
        },
        eventMarkers: [
            {
                day: '04/17/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/04/2019",
                to: "04/05/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            }],
        readOnly: false,
        allowRowDragAndDrop: true,
        allowResizing: true,
        allowFiltering: true,
        allowSelection: true,
        highlightWeekends: true,
        treeColumnIndex: 1,
        taskbarHeight: 20,
        rowHeight: 40,
        height: '550px',
        projectStartDate: new Date('03/28/2019'),
        projectEndDate: new Date('05/18/2019')
            }, done);
    });
    beforeEach(function (done) {
            setTimeout(done, 500);
        });
    it('progress resize', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer');
    triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    triggerMouseEvent(dragElement, 'mousemove', 50, 0);
    triggerMouseEvent(dragElement, 'mouseup');
    });
    it('right resize', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon');
    triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    triggerMouseEvent(dragElement, 'mousemove', 50, 0);
    triggerMouseEvent(dragElement, 'mouseup');
    });
    it('child drag', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container');
    triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    triggerMouseEvent(dragElement, 'mousemove', 50, 0);
    triggerMouseEvent(dragElement, 'mouseup');
    });
    it('connetor point left drag', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 800, 100);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('connetor point right drag', () => {
        let dragElement: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-right-connectorpoint-outer-div > div.e-connectorpoint-right') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 800, 100);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('taskbar drag and drop', () => {
    let ganttObj: Gantt;
    let splitTasksData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Project Schedule',
            StartDate: new Date('02/04/2019'),
            EndDate: new Date('03/10/2019'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Planning',
                    StartDate: new Date('02/04/2019'),
                    subtasks: [
                        {
                            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '60',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 2 },
                                { StartDate: new Date('02/05/2019'), Duration: 5 },
                                { StartDate: new Date('02/08/2019'), Duration: 3 }
                              ]
                        },
                        {
                            TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '90'
                        },
                        {
                            TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '75',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 4 },
                                { StartDate: new Date('02/08/2019'), Duration: 2 }
                              ]
                        },
                        {
                            TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                            Duration: 0, Predecessor: '3FS,5FS'
                        },
                    ]
                },
                {
                    TaskID: 7,
                    TaskName: 'Design',
                    StartDate: new Date('02/25/2019'),
                    subtasks: [
                        {
                            TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                            Duration: 5, Progress: '60', Predecessor: '6FS'
                        },
                        {
                            TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                            Duration: 5, Progress: '100', Predecessor: '6FS',
                            Segments: [
                                { StartDate: new Date('02/25/2019'), Duration: 2 },
                                { StartDate: new Date('02/28/2019'), Duration: 3 }
                              ]
                        },
                        {
                            TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/25/2019'),
                            EndDate: new Date('03/01/2019'), Duration: 4, Progress: '100', Predecessor: '9FS'
                        },
                        {
                            TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/25/2019'), EndDate: new Date('02/25/2019'),
                            Duration: 0, Predecessor: '10FS'
                        }
                    ]
                }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
    allowSorting: true,
    allowReordering: true,
    allowTaskbarDragAndDrop: true,
    enableContextMenu: true,
    enableVirtualization: false,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks',
        segments: 'Segments'
    },
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', width: 60 },
        { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
        { field: 'Progress' },
        { field: 'Predecessor' }
    ],
    sortSettings: {
        columns: [{ field: 'TaskID', direction: 'Ascending' }, 
        { field: 'TaskName', direction: 'Ascending' }]
    },
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
    'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],

    allowExcelExport: true,
    allowPdfExport: true,
    allowSelection: true,
    allowRowDragAndDrop: true,
    selectedRowIndex: 1,
    splitterSettings: {
        position: "50%",
       // columnIndex: 4
    },
    selectionSettings: {
        mode: 'Row',
        type: 'Single',
        enableToggle: false
    },
    tooltipSettings: {
        showTooltip: true
    },
    filterSettings: {
        type: 'Menu'
    },
    allowFiltering: true,
    gridLines: "Both",
    showColumnMenu: true,
    highlightWeekends: true,
    timelineSettings: {
        showTooltip: true,
        topTier: {
            unit: 'Week',
            format: 'dd/MM/yyyy'
        },
        bottomTier: {
            unit: 'Day',
            count: 1
        }
    },
    eventMarkers: [
        {
            day: '04/10/2019',
            cssClass: 'e-custom-event-marker',
            label: 'Project approval and kick-off'
        }
    ],
    holidays: [{
        from: "04/04/2019",
        to: "04/05/2019",
        label: " Public holidays",
        cssClass: "e-custom-holiday"
    
    },
    {
        from: "04/12/2019",
        to: "04/12/2019",
        label: " Public holiday",
        cssClass: "e-custom-holiday"
    
    }],
    searchSettings:
     { fields: ['TaskName', 'Duration'] 
    },
    labelSettings: {
        leftLabel: 'TaskID',
        rightLabel: 'Task Name: ${taskData.TaskName}',
        taskLabel: '${Progress}%'
    },
    allowResizing: true,
    readOnly: false,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
    projectStartDate: new Date('01/30/2019'),
    projectEndDate: new Date('03/04/2019')
            }, done);
    });
    beforeEach(function (done) {
            setTimeout(done, 500);
        });
    it('roundoffstart', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[2];
        ganttObj.editModule.taskbarEditModule['getRoundOffEndLeft'](ganttObj.flatData[2],true)
        ganttObj.editModule.taskbarEditModule['getRoundOffEndLeft'](ganttObj.flatData[2],false)
        ganttObj.timelineModule.bottomTier = 'Minutes';
        ganttObj.editModule.taskbarEditModule.getRoundOffStartLeft(ganttObj.flatData[2],true)
        ganttObj.editModule.taskbarEditModule.getRoundOffStartLeft(ganttObj.flatData[2],false)
        ganttObj.editModule.taskbarEditModule['getRoundOffEndLeft'](ganttObj.flatData[2],true)
        ganttObj.editModule.taskbarEditModule['getRoundOffEndLeft'](ganttObj.flatData[2],false)
        ganttObj.timelineModule.bottomTier = 'Hour';
        ganttObj.editModule.taskbarEditModule['getRoundOffEndLeft'](ganttObj.flatData[2],true)
        ganttObj.editModule.taskbarEditModule['getRoundOffEndLeft'](ganttObj.flatData[2],false)
    });
    it('split task leftresize', () => {
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 200;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 100;
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[2];
        ganttObj.editModule.taskbarEditModule['enableSplitTaskLeftResize'](ganttObj.flatData[2].ganttProperties);
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 400;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 300;
        ganttObj.editModule.taskbarEditModule['enableSplitTaskLeftResize'](ganttObj.flatData[2].ganttProperties);
    });
    it('split task leftresize', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[2];
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 50;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 100;
        ganttObj.editModule.taskbarEditModule.segmentIndex = 1
        ganttObj.editModule.taskbarEditModule['enableSplitTaskLeftResize'](ganttObj.flatData[2].ganttProperties);
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 100;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 200;
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.editModule.taskbarEditModule['enableSplitTaskLeftResize'](ganttObj.flatData[2].ganttProperties);
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 400;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 494;
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.editModule.taskbarEditModule['enableSplitTaskLeftResize'](ganttObj.flatData[2].ganttProperties);
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 400;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 494;
        ganttObj.editModule.taskbarEditModule.segmentIndex = 1;
        ganttObj.editModule.taskbarEditModule['enableSplitTaskLeftResize'](ganttObj.flatData[2].ganttProperties);
    });
    it('split task leftresize', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[2];
        ganttObj.editModule.taskbarEditModule.previousItem = {}
        ganttObj.editModule.taskbarEditModule.previousItem.left = 100;
        ganttObj.editModule.taskbarEditModule.previousItem.width = 150;
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 800;
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ganttObj.treeGrid.getRows()[2]
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 700;
        ganttObj.editModule.taskbarEditModule.segmentIndex = 1
        ganttObj.editModule.taskbarEditModule['enableLeftResizing'](undefined);
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 500;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 600;
        ganttObj.editModule.taskbarEditModule['enableLeftResizing'](undefined);
    });
    it('validate width', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.editModule.taskbarEditModule['currentSegmentIndex'] = 1;
        ganttObj.editModule.taskbarEditModule['validateProgressWidth'](ganttObj.flatData[2].ganttProperties, 50,500);
    });
    it('validate width', () => {
        ganttObj.editModule.taskbarEditModule.segmentIndex = 2;
        ganttObj.editModule.taskbarEditModule['currentSegmentIndex'] = 1;
        ganttObj.editModule.taskbarEditModule['validateProgressWidth'](ganttObj.flatData[2].ganttProperties, 50,500);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('taskbar drag and drop', () => {
    let ganttObj: Gantt;
    let splitTasksData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Project Schedule',
            StartDate: new Date('02/04/2019'),
            EndDate: new Date('03/10/2019'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Planning',
                    StartDate: new Date('02/04/2019'),
                    subtasks: [
                        {
                            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '60',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 2 },
                                { StartDate: new Date('02/05/2019'), Duration: 5 },
                                { StartDate: new Date('02/08/2019'), Duration: 3 }
                              ]
                        },
                        {
                            TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '90'
                        },
                        {
                            TaskID: 5, TaskName: 'Allocate resources', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '75',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 4 },
                                { StartDate: new Date('02/08/2019'), Duration: 2 }
                              ]
                        },
                        {
                            TaskID: 6, TaskName: 'Planning complete', StartDate: new Date('02/21/2019'), EndDate: new Date('02/21/2019'),
                            Duration: 0, Predecessor: '3FS,5FS'
                        },
                    ]
                },
                {
                    TaskID: 7,
                    TaskName: 'Design',
                    StartDate: new Date('02/25/2019'),
                    subtasks: [
                        {
                            TaskID: 8, TaskName: 'Software Specification', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                            Duration: 5, Progress: '60', Predecessor: '6FS'
                        },
                        {
                            TaskID: 9, TaskName: 'Develop prototype', StartDate: new Date('02/25/2019'), EndDate: new Date('03/02/2019'),
                            Duration: 5, Progress: '100', Predecessor: '6FS',
                            Segments: [
                                { StartDate: new Date('02/25/2019'), Duration: 2 },
                                { StartDate: new Date('02/28/2019'), Duration: 3 }
                              ]
                        },
                        {
                            TaskID: 10, TaskName: 'Get approval from customer', StartDate: new Date('02/25/2019'),
                            EndDate: new Date('03/01/2019'), Duration: 4, Progress: '100', Predecessor: '9FS'
                        },
                        {
                            TaskID: 11, TaskName: 'Design complete', StartDate: new Date('02/25/2019'), EndDate: new Date('02/25/2019'),
                            Duration: 0, Predecessor: '10FS'
                        }
                    ]
                }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksData,
    allowSorting: true,
    allowReordering: true,
    allowTaskbarDragAndDrop: true,
    enableContextMenu: true,
    enableVirtualization: false,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'subtasks',
        segments: 'Segments'
    },
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', width: 60 },
        { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
        { field: 'StartDate' },
        { field: 'EndDate' },
        { field: 'Duration' },
        { field: 'Progress' },
        { field: 'Predecessor' }
    ],
    sortSettings: {
        columns: [{ field: 'TaskID', direction: 'Ascending' }, 
        { field: 'TaskName', direction: 'Ascending' }]
    },
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
    'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],

    allowExcelExport: true,
    allowPdfExport: true,
    allowSelection: true,
    allowRowDragAndDrop: true,
    selectedRowIndex: 1,
    splitterSettings: {
        position: "50%",
       // columnIndex: 4
    },
    selectionSettings: {
        mode: 'Row',
        type: 'Single',
        enableToggle: false
    },
    tooltipSettings: {
        showTooltip: true
    },
    filterSettings: {
        type: 'Menu'
    },
    allowFiltering: true,
    gridLines: "Both",
    showColumnMenu: true,
    highlightWeekends: true,
    timelineSettings: {
        showTooltip: true,
        topTier: {
            unit: 'Week',
            format: 'dd/MM/yyyy'
        },
        bottomTier: {
            unit: 'Day',
            count: 1
        }
    },
    eventMarkers: [
        {
            day: '04/10/2019',
            cssClass: 'e-custom-event-marker',
            label: 'Project approval and kick-off'
        }
    ],
    holidays: [{
        from: "04/04/2019",
        to: "04/05/2019",
        label: " Public holidays",
        cssClass: "e-custom-holiday"
    
    },
    {
        from: "04/12/2019",
        to: "04/12/2019",
        label: " Public holiday",
        cssClass: "e-custom-holiday"
    
    }],
    searchSettings:
     { fields: ['TaskName', 'Duration'] 
    },
    labelSettings: {
        leftLabel: 'TaskID',
        rightLabel: 'Task Name: ${taskData.TaskName}',
        taskLabel: '${Progress}%'
    },
    allowResizing: true,
    readOnly: false,
    taskbarHeight: 20,
    rowHeight: 40,
    height: '550px',
    projectStartDate: new Date('01/30/2019'),
    projectEndDate: new Date('03/04/2019')
            }, done);
    });
    beforeEach(function (done) {
            setTimeout(done, 500);
        });
    it('split task right resize', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[2];
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 500;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 400;
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-first.e-gantt-child-taskbar.e-segmented-taskbar');
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.editModule.taskbarEditModule['enableRightResizing'](undefined);

        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 200;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 100;
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.timelineModule.isSingleTier = true;
        ganttObj.timelineModule.customTimelineSettings.bottomTier.unit = 'Hour';
        ganttObj.editModule.taskbarEditModule['enableRightResizing'](undefined);
    });
    it('minutes mode', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[2];
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-first.e-gantt-child-taskbar.e-segmented-taskbar');
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 200;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 100;
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.timelineModule.isSingleTier = true;
        ganttObj.timelineModule.customTimelineSettings.bottomTier.unit = 'Minutes';
        ganttObj.editModule.taskbarEditModule['enableRightResizing'](undefined);
    });
    it('Hour mode', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[2];
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-first.e-gantt-child-taskbar.e-segmented-taskbar');
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 200;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 100;
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.timelineModule.isSingleTier = true;
        ganttObj.timelineModule.customTimelineSettings.topTier.unit = 'Hour';
        ganttObj.editModule.taskbarEditModule['enableRightResizing'](undefined);
    });
    it('minutes mode', () => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[2];
        ganttObj.editModule.taskbarEditModule.taskBarEditElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-first.e-gantt-child-taskbar.e-segmented-taskbar');
        ganttObj.editModule.taskbarEditModule['mouseDownX'] = 200;
        ganttObj.editModule.taskbarEditModule.mouseMoveX = 100;
        ganttObj.editModule.taskbarEditModule.segmentIndex = 0;
        ganttObj.timelineModule.isSingleTier = true;
        ganttObj.timelineModule.customTimelineSettings.topTier.unit = 'Minutes';
        ganttObj.editModule.taskbarEditModule['enableRightResizing'](undefined);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking update segmentData', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: sengmentData,
                segmentData:sengmentCollection,
                enableContextMenu: true,
                allowSorting: true,
                taskFields: {
                    id: 'taskId',
                    name: 'taskName',
                    startDate: 'startDate',
                    duration: 'duration',
                    progress: 'progress',
                    parentID: 'parentID',
                    segmentId: 'segmentId'
                },
                editSettings: {
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
            }, done);
    });
    it('Moving Taskbar', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container >div.e-segment-last') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -300, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.segmentData.length).toBe(2)
    });   
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});	    
describe('Taskbar drag action', () => {
    let ganttObj: Gantt;
    let editingData = [
        {
            TaskID: 6, TaskName: 'Task 6', StartDate: new Date('03/24/2024'), Duration: 1, Progress: 30, subtasks: [
                { TaskID: 5, TaskName: 'Task 5', StartDate: new Date('03/24/2024'), Duration: 1, Progress: 40 },
                { TaskID: 4, TaskName: 'Task 4', StartDate: new Date('03/24/2024'), Duration: 1, Progress: 50 },
            ]
        },
        {
            TaskID: 3, TaskName: 'Task 3', StartDate: new Date('03/24/2024'), Duration: 1, Progress: 60, Predecessor: 5, subtasks: [
                { TaskID: 2, TaskName: 'Task 2', StartDate: new Date('03/24/2024'), Duration: 1, Progress: 70, Predecessor: 6 },
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date('03/24/2024'), Duration: 1, Progress: 80 },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData,
                height: '450px',
                highlightWeekends: true,
                showColumnMenu: true,
                enableContextMenu: true,
                allowFiltering: true,
                enableUndoRedo: true,
                allowSorting: true,
                allowResizing: true,
                allowReordering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'ID', width: 100 },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor', headerText: 'Dependency' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search', 'Undo', 'Redo'],
                undoRedoActions: ['Sorting', 'Add', 'ColumnReorder', 'ColumnResize', 'ColumnState', 'Delete', 'Edit', 'Filtering', 'Indent', 'Outdent', 'NextTimeSpan', 'PreviousTimeSpan', 'RowDragAndDrop', 'Search'],
                treeColumnIndex: 1,
                labelSettings: {
                    leftLabel: 'TaskName'
                },
                splitterSettings: {
                    columnIndex: 2
                },
                projectStartDate: new Date('03/24/2024'),
                projectEndDate: new Date('07/06/2024')
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Date check', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 200, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        let date = ganttObj.getFormatedDate(ganttObj.flatData[4].ganttProperties.startDate, 'MM/dd/yyyy');
        let dragElement1: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement1, 'mousedown', dragElement1.offsetLeft, dragElement1.offsetTop);
        triggerMouseEvent(dragElement1, 'mousemove', dragElement1.offsetLeft + 200, 0);
        triggerMouseEvent(dragElement1, 'mouseup');
        let date1 = ganttObj.getFormatedDate(ganttObj.flatData[4].ganttProperties.startDate, 'MM/dd/yyyy');
        expect(date !== date1).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Offset calculation for taskbar drag', () => {
    let ganttObj: Gantt;
    let editingData = [{ TaskID: 3, TaskName: 'Jan 7',  StartDate: new Date('01/07/2025'), Duration: 1},
        { TaskID: 2, TaskName: 'Jan 13',  StartDate: new Date('01/13/2025'), Duration: 1},
        { TaskID: 1, TaskName: 'Jan 16',  StartDate: new Date('01/16/2025'), Duration: 1, Predecessor:'2SF+4,3FS+2'}
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: editingData,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                filterSettings: {
                    type: 'Menu'
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                allowUnscheduledTasks: true,
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Offset Check', () => {
        let offset1 = ganttObj.flatData[0].ganttProperties.predecessor[0].offset;
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft - 200, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        let offset2 = ganttObj.flatData[0].ganttProperties.predecessor[0].offset;
        expect(offset1 !== offset2).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking date formate', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: dateFormateData,
                resources: editingResources3,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                },
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources',
                },
                actionBegin: (args) => {
                    if (args.requestType == "validateLinkedTask") {
                        args.validateMode.preserveLinkWithEditing = false;
                    }
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                dateFormat: 'dd MMM, y',
                highlightWeekends: true,
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Moving Taskbar date formate', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container ') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.currentViewData.length).toBe(51)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('MT:911868-After changing a taskbar into milestone by dragging the duration days not updated correctly in Resource view sample with fixedWork', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: normalResourceData,
            resources: resourceCollection,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                resourceInfo: 'resources',
                work: 'work',
                child: 'subtasks'
            },
            taskType: 'FixedWork',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit',
                group: 'resourceGroup'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'work', headerText: 'Work' },
                { field: 'Progress' },
                { field: 'resources', headerText: 'Group' },
                { field: 'StartDate' },
                { field: 'Duration' },
            ],
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
            splitterSettings: { columnIndex: 3 },
            labelSettings: {
                rightLabel: 'resources',
                taskLabel: 'Progress'
            },
            allowResizing: true,
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            height: '450px',
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019')
        }, done);
    });
    it('Right resizing to change the task to milestone with fixedWork- taskType taskbar edit action', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -200, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(0);
        expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('MT:911868-After changing a taskbar into milestone by dragging the duration days not updated correctly in Resource view sample with fixedWork', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: normalResourceData,
            resources: resourceCollection,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                resourceInfo: 'resources',
                work: 'work',
                child: 'subtasks'
            },
            taskType: 'FixedWork',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit',
                group: 'resourceGroup'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'work', headerText: 'Work' },
                { field: 'Progress' },
                { field: 'resources', headerText: 'Group' },
                { field: 'StartDate' },
                { field: 'Duration' },
            ],
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
            splitterSettings: { columnIndex: 3 },
            labelSettings: {
                rightLabel: 'resources',
                taskLabel: 'Progress'
            },
            allowResizing: true,
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            height: '450px',
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019')
        }, done);
    });
    it('Changing duration as 0 via dialog edit action with fixedWork- taskType', () => {
        ganttObj.openEditDialog(2);
        let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
        if (durationField) {
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            textObj.value = '0 days';
            textObj.dataBind();
            let work: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'work')).ej2_instances[0];
            expect(work.value).toBe(10);
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('MT:911868-After changing a taskbar into milestone by dragging the duration days not updated correctly in Resource view sample with fixedWork', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: normalResourceData,
            resources: resourceCollection,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                resourceInfo: 'resources',
                work: 'work',
                child: 'subtasks'
            },
            taskType: 'FixedWork',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit',
                group: 'resourceGroup'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'work', headerText: 'Work' },
                { field: 'Progress' },
                { field: 'StartDate' },
                { field: 'Duration' },
            ],
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
            splitterSettings: { columnIndex: 3 },
            labelSettings: {
                rightLabel: 'resources',
                taskLabel: 'Progress'
            },
            allowResizing: true,
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            height: '450px',
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019')
        }, done);
    });
    it('Changing Duration as 0 via cell edit action with fixedWork- taskType', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(6)');
        triggerMouseEvent(duration, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration')).ej2_instances[0];
        input.value = 0;
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(0);
        expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});	    
describe('Unschedule task offset', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [{ TaskID: 2, TaskName: 'Task 2', EndDate: new Date('04/02/2019') },
                    { TaskID: 3, TaskName: 'task 3', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 , Predecessor:'2'}
                ],
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                dateFormat: 'dd MMM, y',
                highlightWeekends: true,
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
            }, done);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Moving Taskbar date formate', () => {
        ganttObj.tooltipSettings.editing = '<div>game</div>';
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container ') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.currentViewData[1].ganttProperties.predecessor[0].offset != 0).toBe(true);
        let args: any = {};
        args['element'] = dragElement;
        args['target'] =  dragElement;
        ganttObj.editModule.taskbarEditModule['editTooltip']['updateTooltipPosition'](args);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR:929550-Console error occurred while taskbar drag with null duration in queryCellInfo', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
        {
            dataSource: CR929550,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'subtasks',
                //notes: 'info',
                //resourceInfo: 'resources',
                manual: 'isManual'
            },
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
            'PrevTimeSpan', 'NextTimeSpan'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            queryTaskbarInfo: function (args) {
                if (args.data.hasChildRecords) {
                    let visible = args.data.childRecords.filter(
                        (child: any) => child.EndDate === null
                    );
                    if (visible && visible.length > 0) { // Check if the array is non-empty
                        visible.forEach((child: any) => {
                            child.ganttProperties.duration = null;
                        });
                        args.data.Duration = null;
                    }
                }
            },

            queryCellInfo: function (args) {
                if (
                    args.data.hasChildRecords &&
                    (args.column.field === 'StartDate' || args.column.field === 'EndDate')
                ) {
                    let allChildrenHaveNullEndDate = args.data.childRecords.every(
                        (child: any) => child.EndDate === null
                    );
                    if (allChildrenHaveNullEndDate) {
                        args.data.ganttProperties.duration = null;
                        args.data.Duration = null;
                    }
                }
            },

            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Drag taskbar with null duration', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ParentDrag');
        };
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ParentDrag');
        };
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr.gridrowtaskIdlevel0.e-chart-row > td > div.e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('MT:923718-Maximum call stack size exceeded error occurs in Resource view sample in Javascript platform', () => {
    let ganttObj: Gantt;
    let newData1: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                    Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                }
            ]
        }
    ];
    let resourceCollection: Object[] = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: newData1,
            resources: resourceCollection,
            viewType: 'ResourceView',
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                work: 'work',
                dependency: 'Predecessor',
                resourceInfo: 'resources',
                child: 'subtasks',
            },
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit',
                group: 'resourceGroup'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            allowSelection: true,
            highlightWeekends: true,
            treeColumnIndex: 1,
            projectStartDate: new Date('03/28/2019'),
            projectEndDate: new Date('05/18/2019')
        }, done);
    });
     beforeEach((done) => {
        setTimeout(done, 500);
        ganttObj.openAddDialog();
    });
    it('Adding task to existing resource', () => {
        let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
        tab.selectedItem = 2;
        tab.dataBind();
        let checkbox: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        triggerMouseEvent(checkbox, 'click');
        let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
        expect(ganttObj.currentViewData.length).toBe(3);
        expect(ganttObj.currentViewData[2].ganttProperties.rowUniqueID).toBe('2');
        expect(ganttObj.currentViewData[2].ganttProperties.uniqueID).toBe(ganttObj.element.id +'_data_2');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('MT:915273-OverAllocation container does not render properly in project view', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt ({
            dataSource: MT915273,
            allowReordering: true,
            showOverAllocation: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                { field: 'Duration', headerText: 'Duration', allowEditing: false },
                { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                { field: 'CustomColumn', headerText: 'CustomColumn' }
            ],
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
            allowSelection: true,
            splitterSettings: {
                position: "50%",
            },
            showColumnMenu: true,
            highlightWeekends: true,
            timelineSettings: {
                showTooltip: true,
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskID',
                rightLabel: 'Task Name: ${taskData.TaskName}',
                taskLabel: '${Progress}%'
            },
            allowResizing: true,
            taskbarHeight: 20,
            rowHeight: 40,
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('04/05/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Checking rangerContainer height with Hierarchy ChildRecords', () => {
        const rangeContainer: any = ganttObj.element.querySelectorAll('.e-rangecontainer')[0].childNodes[0].childNodes;
        if (rangeContainer) {
            expect(rangeContainer[0].style.height).toBe('221px');
            expect(rangeContainer[1].style.height).toBe('221px');
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Querytaskbar info on split task resource view', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: segmentResourcesData,
                resources: SegmentResourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                allowSorting: true,
                allowReordering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    segments: 'Segments',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                queryTaskbarInfo:function (args) {
                    if (args.data.ganttProperties.taskId === 2) {
                        if (parseInt(args.taskbarElement.dataset.segmentIndex) === 0) {
                            args.taskbarBgColor = 'red'
                            args.progressBarBgColor = 'pink'
                        } else if (parseInt(args.taskbarElement.dataset.segmentIndex) === 1) {
                            args.taskbarBgColor = 'blue'
                            args.progressBarBgColor = 'purple'
                        }
                    }
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking customization made in queryTaskBarInfo', () => {
        expect((ganttObj.getRowByID(1).querySelector('.e-segment-first') as HTMLElement).style.backgroundColor).toBe('red');
        expect((ganttObj.getRowByID(1).querySelector('.e-segment-last') as HTMLElement).style.backgroundColor).toBe('blue');
        expect((ganttObj.getRowByID(1).querySelector('.e-gantt-child-progressbar') as HTMLElement).style.backgroundColor).toBe('pink');
    });
    it('Changing progress and checking color', () => {
        let data = {
            TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 10,
            Progress: 80, work: 10, resources: [{ resourceId: 1, resourceUnit: 100 },{ resourceId: 2, resourceUnit: 100 }],Segments: [
                { StartDate: new Date('03/29/2019'), Duration: 2 },
                { StartDate: new Date('04/05/2019'), Duration: 5 },

            ]
        }
        ganttObj.updateRecordByID(data);
        expect((ganttObj.getRowByID(1).querySelector('.e-segment-last').querySelector('.e-gantt-child-progressbar') as HTMLElement).style.backgroundColor).toBe('purple');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking if multiple resource assignment change correctly', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: segmentResourcesData,
                resources: SegmentResourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                allowSorting: true,
                allowReordering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    segments: 'Segments',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Changing Progress', () => {
        let data = {
            TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 10,
            Progress: 80, work: 10, resources: [{ resourceId: 1, resourceUnit: 100 },{ resourceId: 2, resourceUnit: 100 }],Segments: [
                { StartDate: new Date('03/29/2019'), Duration: 2 },
                { StartDate: new Date('04/05/2019'), Duration: 5 },

            ]
        }
        ganttObj.updateRecordByID(data);
        expect(ganttObj.flatData[1].ganttProperties.progress).toBe(80);
        expect(ganttObj.flatData[4].ganttProperties.progress).toBe(80);
    });
    it('Merging Task', () => {
        ganttObj.mergeTask(2,[{ 'firstSegmentIndex': 0, 'secondSegmentIndex': 1 }]);
        expect(ganttObj.flatData[1].ganttProperties.segments === null).toBe(true);
        expect(ganttObj.flatData[4].ganttProperties.segments === null).toBe(true);
    });
    it('Split task', () => {
        ganttObj.splitTask(2, new Date('04/02/2019'));
        expect(ganttObj.flatData[1].ganttProperties.segments.length > 1).toBe(true);
        expect(ganttObj.flatData[4].ganttProperties.segments.length > 1).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking if work mapping provide correct duration', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: segmentResourcesData,
                resources: SegmentResourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                allowSorting: true,
                allowReordering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    work: 'work',
                    resourceInfo: 'resources',
                    segments: 'Segments',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking Duration and segments for shared task', () => {
        expect(ganttObj.flatData[1].ganttProperties.segments).toBe(null);
        expect(ganttObj.flatData[4].ganttProperties.segments).toBe(null);
        expect(ganttObj.flatData[4].ganttProperties.duration).toBe(0.63);
        expect(ganttObj.flatData[4].ganttProperties.duration).toBe(0.63);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Deleting segments in dialog', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: segmentResourcesData,
                resources: SegmentResourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                allowSorting: true,
                allowReordering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    segments: 'Segments',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking segments', () => {
        expect(ganttObj.flatData[1].ganttProperties.segments.length).toBe(2);
        ganttObj.openEditDialog(1);
        let selectSegment: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_Tab > div.e-tab-header.e-control.e-toolbar.e-lib.e-keyboard > div > div:nth-child(4)') as HTMLElement;
        triggerMouseEvent(selectSegment, 'click');
        let selectRow: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'SegmentsTabContainer_content_table > tbody > tr:nth-child(1)') as HTMLElement;
        triggerMouseEvent(selectRow, 'click');
        let deleteSegment: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'SegmentsTabContainer_delete > span.e-tbar-btn-text') as HTMLElement;
        triggerMouseEvent(deleteSegment, 'click');
        triggerMouseEvent(deleteSegment, 'click');
        let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
        expect(ganttObj.flatData[1].ganttProperties.segments).toBe(null);
        expect(ganttObj.flatData[4].ganttProperties.segments).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Adding additional resource to split task', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: segmentResourcesData,
                resources: SegmentResourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                allowSorting: true,
                allowReordering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    segments: 'Segments',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    beforeEach((done: Function) => {
        ganttObj.openEditDialog(1);
        setTimeout(done, 500);
    });
    it('Checking segments', () => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "save") {
                expect(ganttObj.flatData[8].childRecords[2].ganttProperties.segments.length).toBe(2);
            }
        };
        let selectResourceTab: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_Tab > div.e-tab-header.e-control.e-toolbar.e-lib.e-keyboard > div > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(selectResourceTab, 'click');
        let checkbox: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(3) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        triggerMouseEvent(checkbox, 'click');
        let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Adding new segment task in resource view', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: segmentResourcesData,
                resources: SegmentResourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                allowSorting: true,
                allowReordering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    segments: 'Segments',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking segment after adding', () => {
        let record = {
            TaskID: 20, TaskName: 'Newly added task', StartDate: new Date('03/29/2019'), Duration: 10,
            Progress: 10, work: 10, resources: [{ resourceId: 1, resourceUnit: 100 },{ resourceId: 2, resourceUnit: 100 }],Segments: [
                { StartDate: new Date('03/29/2019'), Duration: 2 },
                { StartDate: new Date('04/05/2019'), Duration: 5 },

            ]
        };
        ganttObj.editModule.addRecord(record, 'Below', 2);
        expect(ganttObj.flatData[3].ganttProperties.taskName).toBe('Newly added task');
        expect(ganttObj.flatData[9].ganttProperties.taskName).toBe('Newly added task')
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking if dependency update for shared task', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: segmentResourcesData,
                resources: SegmentResourceCollection,
                viewType: 'ResourceView',
                enableMultiTaskbar: true,
                showOverAllocation: true,
                enableContextMenu: true,
                allowSorting: true,
                allowReordering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    segments: 'Segments',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                readOnly: false,
                allowRowDragAndDrop: true,
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019'),
                collapseAllParentTasks: true,
                allowTaskbarOverlap :false
            }, done);
    });
    it('Moving task and checking dependency', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1)  > td > .e-collapse-parent > .e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 80, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.flatData[4].ganttProperties.predecessorsName).toBe(null)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Task:932388-Provide support to enable Progress Editing in Collapsed State with Multi Taskbar Property Enabled', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
        {
            dataSource: projectNewData1,
            allowSorting: true,
            allowTaskbarOverlap: false,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
            enableMultiTaskbar: true,
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
            'PrevTimeSpan', 'NextTimeSpan'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Checking progress resize icon while task in collapsed state', () => {
        let collapseallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_collapseall') as HTMLElement;
        triggerMouseEvent(collapseallToolbar, 'click');
        let collapsedTaskbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container') as HTMLElement;
        let progressResizer = collapsedTaskbar.childNodes[3] as HTMLElement;
        if (progressResizer) {
            expect(progressResizer.classList.contains('e-child-progress-resizer')).toBe(true);
        }
    });
    it('Checking progress width while task in collapsed state', () => {
        let collapseallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_collapseall') as HTMLElement;
        triggerMouseEvent(collapseallToolbar, 'click');
        let collapsedTaskbarProgess: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar > div.e-gantt-child-progressbar-inner-div.e-gantt-child-progressbar') as HTMLElement;
        if (collapsedTaskbarProgess) {
            expect(collapsedTaskbarProgess.style.width).toBe('29.7px');
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Task:932388-Provide support to enable Progress Editing in Collapsed State with Multi Taskbar Property Enabled(With queryTaskbarInfo)', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
        {
            dataSource: projectNewData1,
            allowSorting: true,
            allowTaskbarOverlap: false,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks'
            },
            queryTaskbarInfo: function (args: any) {
                if (args.data.TaskID == 1) {
                    args.taskbarBgColor = '#539ed6';
                    args.milestoneColor = '#539ed6';
                    args.progressBarBgColor = "red";
                } else if (args.data.TaskID == 2) {
                    args.taskbarBgColor = '#ff826b';
                    args.milestoneColor = '#ff826b';
                    args.progressBarBgColor = "brown";
                } else if (args.data.TaskID == 3) {
                    args.taskbarBgColor = '#ef6fbb';
                    args.milestoneColor = '#ef6fbb';
                    args.progressBarBgColor = "lightgreen";
                }else if (args.data.TaskID == 4) {
                    args.taskbarBgColor = '#87b972';
                    args.milestoneColor = '#87b972';
                    args.progressBarBgColor = "purple";
                }
            },
            enableMultiTaskbar: true,
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            toolbar:['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
            'PrevTimeSpan', 'NextTimeSpan'],
            allowSelection: true,
            gridLines: "Both",
            showColumnMenu: false,
            highlightWeekends: true,
            timelineSettings: {
                topTier: {
                    unit: 'Week',
                    format: 'dd/MM/yyyy'
                },
                bottomTier: {
                    unit: 'Day',
                    count: 1
                }
            },
            labelSettings: {
                leftLabel: 'TaskName',
                taskLabel: 'Progress'
            },
            height: '550px',
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('Checking progress resize icon while task in collapsed state with queryTaskbarInfo', () => {
        let collapseallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_collapseall') as HTMLElement;
        triggerMouseEvent(collapseallToolbar, 'click');
        let collapsedTaskbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container') as HTMLElement;
        let progressResizer = collapsedTaskbar.childNodes[3] as HTMLElement;
        if (progressResizer) {
            expect(progressResizer.classList.contains('e-child-progress-resizer')).toBe(true);
        }
    });
    it('Checking progress width while task in collapsed state with queryTaskbarInfo', () => {
        let collapseallToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_collapseall') as HTMLElement;
        triggerMouseEvent(collapseallToolbar, 'click');
        let collapsedTaskbarProgess: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar > div.e-gantt-child-progressbar-inner-div.e-gantt-child-progressbar') as HTMLElement;
        if (collapsedTaskbarProgess) {
            expect(collapsedTaskbarProgess.style.width).toBe('29.7px');
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Overallocation in split task', () => {
    Gantt.Inject(Edit);
    let ganttObj: Gantt;
    let resourceLocal: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 10,
                    Progress: 10, work: 10, resources: [{ resourceId: 1, resourceUnit: 100 }, { resourceId: 2, resourceUnit: 100 }], Segments: [
                        { StartDate: new Date('03/29/2019'), Duration: 2 },
                        { StartDate: new Date('04/05/2019'), Duration: 5 },

                    ]
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
                },
            ]
        }
    ];
    let collectionLocal: Object[] = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourceLocal,
                resources: collectionLocal,
                viewType: 'ResourceView',
                showOverAllocation: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    segments: 'Segments',
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'Progress' },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                ],
                splitterSettings: {
                    columnIndex: 3
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy'
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    }
                },
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Checking left value', () => {
        expect((ganttObj.chartPane.querySelectorAll('.e-rightarc')[1] as HTMLElement).style.left).toBe('160px')
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Content menu split task  -', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [ {
                    TaskName: 'New Task 2',
                    StartDate: new Date('04/02/2024'),
                    EndDate: new Date('04/04/2024'),
                    Progress: 0,
                    work: 0,
                    resources: [],
                    Segments: [{ StartDate: new Date('02/04/2024'), Duration: 2 },
                        { StartDate: new Date('02/05/2024'), Duration: 5 },],
                    TaskID: 'task_956caa3b-2946-4230-b251-20bab82abe7d',
                  },
                  {
                    TaskName: 'New Task 1',
                    StartDate: new Date('04/02/2024'),
                    EndDate: new Date('04/04/2024'),
                    Progress: 0,
                    work: 0,
                    resources: [],
                    Segments: [{ StartDate: new Date('02/04/2024'), Duration: 2 },
                        { StartDate: new Date('02/05/2024'), Duration: 5 },],
                    TaskID: 'task_692b81b9-8bd2-4bf3-a6fa-d4ce4c997b70',
                  }],
                allowSorting: true,
                includeWeekend: true,
                enableContextMenu: true,
                enableVirtualization: false,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    segments: 'Segments'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },

                ],
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                timelineSettings: {
                    timelineUnitSize: 60,
            weekStartDay: 1,
            topTier: {
              format: 'MMM dd, yyyy',
              unit: 'Week',
            },
            bottomTier: {
              unit: 'Day',
              format: 'dd',
              count: 1,
            },
                },
                allowResizing: true,
                readOnly: false,
                taskbarHeight: 20,
                rowHeight: 40,
                height: '550px',
            }, done);
    });
    beforeEach(function (done) {
        setTimeout(done, 100);
    });
    it('split task ', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container >div.e-segment-last') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 250, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.currentViewData[0].ganttProperties.segments.length).toBe(2);
        expect(ganttObj.currentViewData[1].ganttProperties.segments.length).toBe(2)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Dragging task after connecting predecessor', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/22/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                        ]
                }],
                updateOffsetOnTaskbarEdit: false,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources'
                },
                treeColumnIndex: 1,
                height: "450px",
                allowSelection: true,
                dateFormat: "MMM dd, y",
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
                highlightWeekends: true,
                gridLines: 'Both',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                    newRowPosition: 'Bottom'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer' },
                    { resourceId: 2, resourceName: 'Rose Fuller' },
                    { resourceId: 3, resourceName: 'Margaret Buchanan' },
                    { resourceId: 4, resourceName: 'Fuller King' },
                    { resourceId: 5, resourceName: 'Davolio Fuller' },
                    { resourceId: 6, resourceName: 'Van Jack' },
                    { resourceId: 7, resourceName: 'Fuller Buchanan' },
                    { resourceId: 8, resourceName: 'Jack Davolio' },
                    { resourceId: 9, resourceName: 'Tamer Vinet' },
                    { resourceId: 10, resourceName: 'Vinet Fuller' },
                    { resourceId: 11, resourceName: 'Bergs Anton' },
                    { resourceId: 12, resourceName: 'Construction Supervisor' },
                ],
                splitterSettings: {
                    position: "35%"
                }
            }, done);
    });
    beforeEach(function (done) {
        setTimeout(done, 100);
    });
    it('check if task stay in same position ', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = "2";
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 200, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[2].ganttProperties.startDate, 'M/dd/yyyy')).toBe('4/22/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Dragging task after connecting predecessor', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/22/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                        ]
                }],
                updateOffsetOnTaskbarEdit: false,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources'
                },
                treeColumnIndex: 1,
                height: "450px",
                allowSelection: true,
                dateFormat: "MMM dd, y",
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
                highlightWeekends: true,
                gridLines: 'Both',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                    newRowPosition: 'Bottom'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer' },
                    { resourceId: 2, resourceName: 'Rose Fuller' },
                    { resourceId: 3, resourceName: 'Margaret Buchanan' },
                    { resourceId: 4, resourceName: 'Fuller King' },
                    { resourceId: 5, resourceName: 'Davolio Fuller' },
                    { resourceId: 6, resourceName: 'Van Jack' },
                    { resourceId: 7, resourceName: 'Fuller Buchanan' },
                    { resourceId: 8, resourceName: 'Jack Davolio' },
                    { resourceId: 9, resourceName: 'Tamer Vinet' },
                    { resourceId: 10, resourceName: 'Vinet Fuller' },
                    { resourceId: 11, resourceName: 'Bergs Anton' },
                    { resourceId: 12, resourceName: 'Construction Supervisor' },
                ],
                splitterSettings: {
                    position: "35%"
                }
            }, done);
    });
    beforeEach(function (done) {
        setTimeout(done, 100);
    });
    it('check if task stay in same position with offset', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = "2FS+1";
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 200, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[2].ganttProperties.startDate, 'M/dd/yyyy')).toBe('4/22/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Dragging task after connecting predecessor SS', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/22/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                        ]
                }],
                updateOffsetOnTaskbarEdit: false,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources'
                },
                treeColumnIndex: 1,
                height: "450px",
                allowSelection: true,
                dateFormat: "MMM dd, y",
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
                highlightWeekends: true,
                gridLines: 'Both',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                    newRowPosition: 'Bottom'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer' },
                    { resourceId: 2, resourceName: 'Rose Fuller' },
                    { resourceId: 3, resourceName: 'Margaret Buchanan' },
                    { resourceId: 4, resourceName: 'Fuller King' },
                    { resourceId: 5, resourceName: 'Davolio Fuller' },
                    { resourceId: 6, resourceName: 'Van Jack' },
                    { resourceId: 7, resourceName: 'Fuller Buchanan' },
                    { resourceId: 8, resourceName: 'Jack Davolio' },
                    { resourceId: 9, resourceName: 'Tamer Vinet' },
                    { resourceId: 10, resourceName: 'Vinet Fuller' },
                    { resourceId: 11, resourceName: 'Bergs Anton' },
                    { resourceId: 12, resourceName: 'Construction Supervisor' },
                ],
                splitterSettings: {
                    position: "35%"
                }
            }, done);
    });
    beforeEach(function (done) {
        setTimeout(done, 100);
    });
    it('check if task stay in same position ', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = "2SS";
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 200, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[2].ganttProperties.startDate, 'M/dd/yyyy')).toBe('4/22/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Dragging task after connecting predecessor SS', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Product Concept',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            {
                                TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/22/2019'), Duration: 3,
                                Indicators: [
                                    {
                                        'date': '04/10/2019',
                                        'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                                        'name': 'Indicator title',
                                        'tooltip': 'tooltip'
                                    }
                                ]
                            },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                        ]
                }],
                updateOffsetOnTaskbarEdit: false,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    notes: 'info',
                    resourceInfo: 'resources'
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' }
                ],
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources'
                },
                treeColumnIndex: 1,
                height: "450px",
                allowSelection: true,
                dateFormat: "MMM dd, y",
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
                highlightWeekends: true,
                gridLines: 'Both',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                    newRowPosition: 'Bottom'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Indent', 'Outdent'],
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer' },
                    { resourceId: 2, resourceName: 'Rose Fuller' },
                    { resourceId: 3, resourceName: 'Margaret Buchanan' },
                    { resourceId: 4, resourceName: 'Fuller King' },
                    { resourceId: 5, resourceName: 'Davolio Fuller' },
                    { resourceId: 6, resourceName: 'Van Jack' },
                    { resourceId: 7, resourceName: 'Fuller Buchanan' },
                    { resourceId: 8, resourceName: 'Jack Davolio' },
                    { resourceId: 9, resourceName: 'Tamer Vinet' },
                    { resourceId: 10, resourceName: 'Vinet Fuller' },
                    { resourceId: 11, resourceName: 'Bergs Anton' },
                    { resourceId: 12, resourceName: 'Construction Supervisor' },
                ],
                splitterSettings: {
                    position: "35%"
                }
            }, done);
    });
    beforeEach(function (done) {
        setTimeout(done, 100);
    });
    it('check if task stay in same position offset', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = "2SS+1";
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 200, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[2].ganttProperties.startDate, 'M/dd/yyyy')).toBe('4/22/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
