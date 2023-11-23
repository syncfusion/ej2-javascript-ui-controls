/**
 * Gantt taskbaredit spec
 */
import { Gantt, ITaskbarEditedEventArgs, Edit, RowDD, ContextMenu } from '../../src/index';
import { DataManager } from '@syncfusion/ej2-data';
import { baselineData, scheduleModeData, splitTasksData, editingData, scheduleModeData1, dragSelfReferenceData, multiTaskbarData, resources, projectData, resourcesData, resourceCollection, multiResources, predecessorOffSetValidation, customCRData, customCrIssue } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { falseLine } from '../../src/gantt/base/css-constants';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
describe('Gantt taskbar editing', () => {
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
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
                expect(args['name']).toBe('taskbarEdited');
                expect(args.taskBarEditAction).toBe('LeftResizing');
                expect(ganttObj.getFormatedDate(args.previousData.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -50, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Left resizing -  drop on weekdays', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args['name']).toBe('taskbarEditing');
                expect(args.taskBarEditAction).toBe('LeftResizing');
                expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
                expect(args['name']).toBe('taskbarEdited');
                expect(args.taskBarEditAction).toBe('LeftResizing');
                expect(ganttObj.getFormatedDate(args.previousData.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -80, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Left resizing - editing cancel', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                args.cancel = true;
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -100, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Left resizing -  edited cancel', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            };
            ganttObj.dataBind();
            ganttObj.actionBegin = (args: object) => {
                if (args['requestType'] !== 'taskbarediting') {
                    expect(ganttObj.getFormatedDate(args['data'].ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/16/2017 08:00');
                    if (args['requestType'] === 'beforeSave') {
                        args['cancel'] = true;
                    }
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -110, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
        });
        it('progress with 0% - editing cancel', () => {
            ganttObj.actionBegin = (args: object) => { };
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args.data['Progress']).toBe(80);
                args['cancel'] = true;
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(args.data.ganttProperties.progress).toBe(80);
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 100, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('progress with 0% - edited cancel', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args.data['Progress']).toBe(80);
            };
            ganttObj.dataBind();
            ganttObj.actionBegin = (args: object) => {
                if (args['requestType'] !== 'taskbarediting') {
                    expect(args['data'].ganttProperties.progress).toBe(0);
                    if (args['requestType'] === 'beforeSave') {
                        args['cancel'] = true;
                    }
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 100, 0);
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[1].ganttProperties.progress).toBe(80);
        });
        it('progress with 0%', () => {
            ganttObj.actionBegin = (args: object) => { };
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args.data['Progress']).toBe(80);
                expect(args.taskBarEditAction).toBe('ProgressResizing');
                expect(args.editingFields.progress).toBe(0);
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(args.data.ganttProperties.progress).toBe(0);
                expect(args.taskBarEditAction).toBe('ProgressResizing');
                expect(args.editingFields.progress).toBe(0);
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 0, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Child drag action', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
                expect(args.taskBarEditAction).toBe('ChildDrag');
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
               //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
                expect(args.taskBarEditAction).toBe('ChildDrag');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Milestone drag action', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/24/2017 08:00');
                expect(args.taskBarEditAction).toBe('MilestoneDrag');
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('11/02/2017 08:00');
                expect(args.taskBarEditAction).toBe('MilestoneDrag');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Parent drag action', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                //expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
                expect(args.taskBarEditAction).toBe('ParentDrag');
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/24/2017 08:00');
                expect(args.taskBarEditAction).toBe('ParentDrag');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr.gridrowtaskIdlevel0.e-chart-row > td > div.e-taskbar-main-container') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 300, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Right resizing - editing cancel', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/30/2017 17:00');
                expect(args.taskBarEditAction).toBe('RightResizing');
                args.cancel = true;
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/30/2017 17:00');
                expect(args.taskBarEditAction).toBe('RightResizing');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mouseup');
        });

        it('Right resizing - edited cancel', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/30/2017 17:00');
                expect(args.taskBarEditAction).toBe('RightResizing');
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            ganttObj.actionBegin = (args: object) => {
                if (args['requestType'] === 'beforeSave') {
                    args['cancel'] = true;
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/30/2017 17:00');
        });
        it('Right resizing', () => {
            ganttObj.actionBegin = (args: object) => { };
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data['EndDate'], 'MM/dd/yyyy HH:mm')).toBe('10/30/2017 17:00');
                expect(args.taskBarEditAction).toBe('RightResizing');
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/24/2017 08:00');
                expect(args.taskBarEditAction).toBe('RightResizing');
            };
            ganttObj.dataBind();
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
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 800, 100);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Connector Line Left drag - drop inside the Gantt container', () => {
            ganttObj.actionBegin = (args: object) => {
                if (args['requestType'] === 'ValidateDependency') {
                    expect(args['name']).toBe('actionBegin');
                    expect(args['newPredecessorString']).toBe('5SS');
                }
            };
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
            };
            ganttObj.dataBind();
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
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('ConnectorPointRightDrag');
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('ConnectorPointRightDrag');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-right-connectorpoint-outer-div > div.e-connectorpoint-right') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 400, 100);
            triggerMouseEvent(dragElement, 'mouseup');
        });        
        it('Dependency editing - spec coverage', () => {
            ganttObj.actionBegin = (args: any) => {
                if (args.requestType == "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false;
                }
             };
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 100, -50);
            ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
            ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[4];
            ganttObj.editModule.taskbarEditModule.finalPredecessor = '6SF';
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[4].ganttProperties.predecessorsName).toBe('6SF');
            let dragElement1: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div:nth-Child(3)') as HTMLElement;
            triggerMouseEvent(dragElement1, 'mousedown');
            triggerMouseEvent(dragElement1, 'mousemove', -80, 0);
            triggerMouseEvent(dragElement1, 'mouseup');
            let ok: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialogValidationRule > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(ok, 'click');
            let dragElement2: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div:nth-Child(3)') as HTMLElement;
            triggerMouseEvent(dragElement2, 'mousedown');
            triggerMouseEvent(dragElement2, 'mousemove', -80, 0);
            triggerMouseEvent(dragElement2, 'mouseup');
            let cancel: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialogValidationRule > div.e-footer-content > button:nth-child(2)') as HTMLElement;
            triggerMouseEvent(cancel, 'click');
            let dragElement3: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div:nth-Child(3)') as HTMLElement;
            triggerMouseEvent(dragElement3, 'mousedown');
            triggerMouseEvent(dragElement3, 'mousemove', 80, 0);
            triggerMouseEvent(dragElement3, 'mouseup');
            let move: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_ValidationAddlineOffset') as HTMLElement;
            triggerMouseEvent(move, 'click');
            let ok1: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialogValidationRule > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(ok1, 'click');
            let dragElement4: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div:nth-Child(3)') as HTMLElement;
            triggerMouseEvent(dragElement4, 'mousedown');
            triggerMouseEvent(dragElement4, 'mousemove', 80, 0);
            triggerMouseEvent(dragElement4, 'mouseup');
            let remove: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_ValidationRemoveline') as HTMLElement;
            triggerMouseEvent(remove, 'click');
            let ok2: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialogValidationRule > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(ok2, 'click');
        });
        it('Draw Connector Line by drag and drop', () => {
            ganttObj.actionBegin = (args: any) => {
                if (args.requestType == "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false;
                }
             };
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -10, 50);
            ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
            ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[4];
            ganttObj.editModule.taskbarEditModule.finalPredecessor = '6SS';
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[4].ganttProperties.predecessorsName).toBe('6SS');
            let dragElement1: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div:nth-Child(3)') as HTMLElement;
            triggerMouseEvent(dragElement1, 'mousedown');
            triggerMouseEvent(dragElement1, 'mousemove', -80, 0);
            triggerMouseEvent(dragElement1, 'mouseup');
            let close: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialogValidationRule > div.e-dlg-header-content > button') as HTMLElement;
            triggerMouseEvent(close, 'click');
        });
        it('Connector Line highlight while perform click on connector line', () => {
            const ele: HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent6child5').childNodes[0] as HTMLElement;
            let e: Object = {} as Object;
            e['target'] = ele;
            ganttObj.connectorLineEditModule.updateConnectorLineEditElement(e as PointerEvent);
            const strokeWidth = ele.getAttribute('stroke-width');
            expect(strokeWidth === '2').toBeTruthy();
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
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('04/02/2019 17:00');
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
        beforeEach((done: Function) => {
            setTimeout(done, 500);
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
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('Manual parent task-right resizing', () => {
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('ParentResizing');
            };
            ganttObj.dataBind();
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
            ganttObj.dataBind();   
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy')).toBe('03/04/2017');
            };
            ganttObj.dataBind();
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
        beforeEach((done: Function) => {
            setTimeout(done, 500);
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
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('dynamically enabling allowTaskbarEditing proprty', () => {
            ganttObj.editSettings.allowTaskbarEditing = true;
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
                expect(args.taskBarEditAction).toBe('MilestoneDrag');
            };
            ganttObj.dataBind();
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
            ganttObj.actionBegin = (args: any) => {
                if (args['requestType'] === 'beforeSave') {
                   expect(args.modifiedRecords.length).toBe(3);
                }
            };
            ganttObj.dataBind();
            expect(ganttObj.currentViewData[2].taskData['Segments'].length).toBe(3);
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-first.e-gantt-child-taskbar.e-segmented-taskbar > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 500), dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Date time picker in dialog segment tab', () => {
            ganttObj.openEditDialog(2);
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
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
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
            setTimeout(done, 2000);
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('Avoid initial resize', () => {
            ganttObj.actionComplete = (args: ITaskbarEditedEventArgs) => {
                expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('04/03/2019 08:00');
            };
            ganttObj.dataBind();
            ganttObj.actionBegin = (args: any) => {
                if (args.requestType == "taskbarediting" && args.taskBarEditAction == 'LeftResizing' && args.data.TaskID == 2) {
                    args.cancel = true;
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -110, 0);
            triggerMouseEvent(dragElement, 'mouseup');
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('Timespan gets changed', () => {
            ganttObj.openEditDialog(1);
            let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(save, 'click');
        });
    });
    describe('Taskbar Expand/Collapse', () => {
        let ganttObj: Gantt
        beforeAll((done: Function) => {
            ganttObj = createGantt({
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('when allow editing is false',() => {
            let taskbarElement: HTMLElement = ganttObj.element.getElementsByClassName('e-gantt-parent-taskbar-inner-div e-gantt-parent-taskbar e-row-expand')[0] as HTMLElement;
            triggerMouseEvent(taskbarElement, 'mousedown');
            triggerMouseEvent(taskbarElement, 'mouseup');
            setTimeout(() => {
                expect(ganttObj.currentViewData[0].expanded).toBe(true);
            }, 100);
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
            let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(save, 'click');
            setTimeout(done, 500);
        });
        it('split over weekends', () => {
            ganttObj.splitTask(12, new Date('02/09/2019'));
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.segments[1].startDate, 'MM/dd/yyyy')).toBe('02/12/2019');
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });

    });
    describe('Connector line from parent to child', () => {
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
        it('Dependency editing - child to parent', () => {
            ganttObj.actionBegin = (args: any) => {
                if (args.requestType == "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false;
                }
            };
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 100, -50);
            ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
            ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[8];
            ganttObj.editModule.taskbarEditModule.finalPredecessor = '3SF';
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[8].ganttProperties.predecessorsName).toBe('3SF-7320 days');
        });
        it('Dependency editing - parent to child', () => {
            ganttObj.actionBegin = (args: any) => {
                if (args.requestType == "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false;
                }
            };
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 100, -50);
            ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
            ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[6];
            ganttObj.editModule.taskbarEditModule.finalPredecessor = '6SS';
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[6].ganttProperties.predecessorsName).toBe('6SS+118 days');
        });
        it('Dependency editing - parent to parent', () => {
            ganttObj.actionBegin = (args: any) => {
                if (args.requestType == "validateLinkedTask") {
                    args.validateMode.preserveLinkWithEditing = false;
                }
            };
            ganttObj.dataBind();
            ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(9) > td > div.e-taskbar-main-container > div') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(9) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 100, -50);
            ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
            ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[13];
            ganttObj.editModule.taskbarEditModule.finalPredecessor = '9SS';
            triggerMouseEvent(dragElement, 'mouseup');
            expect(ganttObj.flatData[13].ganttProperties.predecessorsName).toBe('9SS');
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });

    });
    describe('Dialog editing - predecessor Tab', () => {
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
            ganttObj.openEditDialog(4);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
            tab.dataBind();
        });
        it('Dialog Dependency tab editing-- child to parent', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe("21FS");
                }
            };
            let add: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainer_add'));
            triggerMouseEvent(add, 'click');
            let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
            input.dataSource = input.dataSource.dataSource.json;
            input.value = "21-Phase 2";
            input.dataBind();
            let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
            triggerMouseEvent(toolbar, 'click');
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
    });
    describe('Dialog editing - predecessor Tab parent to parent', () => {
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
            ganttObj.openEditDialog(2);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
            tab.dataBind();
        });
        // it('Dependency tab editing', () => {
        //     ganttObj.actionComplete = (args: any): void => {
        //         if (args.requestType === 'save') {
        //             expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe("12FS");
        //         }
        //     };
        //     let add: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainer_add'));
        //     triggerMouseEvent(add, 'click');
        //     let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
        //     input.dataSource = input.dataSource.dataSource.json;
        //     input.value = "12-Implementation Phase";
        //     input.dataBind();
        //     let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
        //     triggerMouseEvent(toolbar, 'click');
        //     let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        //     triggerMouseEvent(saveRecord, 'click');
        // });
    });
    describe('Dialog editing - predecessor Tab Multiple predecessors', () => {
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
            ganttObj.openEditDialog(6);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
            tab.dataBind();
        });
        // it('Dependency tab editing', () => {
        //     ganttObj.actionComplete = (args: any): void => {
        //         if (args.requestType === 'save') {
        //             expect(ganttObj.currentViewData[5].ganttProperties.predecessorsName).toBe("7FS,3FS,4FS,5FS");
        //         }
        //     };
        //     let add: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainer_add'));
        //     triggerMouseEvent(add, 'click');
        //     let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
        //     input.dataSource = input.dataSource.dataSource.json;
        //     input.value = "7-Design";
        //     input.dataBind();
        //     let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
        //     triggerMouseEvent(toolbar, 'click');
        //     let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        //     triggerMouseEvent(saveRecord, 'click');
        // });
    });
    describe('Add new record with parent predecessor', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData,
                    toolbar: ['Add'],
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
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
            ganttObj.openAddDialog();
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
            tab.dataBind();
        });
        // it('Dependency tab editing', () => {
        //     debugger
        //     ganttObj.actionComplete = (args: any): void => {
        //         if (args.requestType === 'add') {
        //             expect(args.data.Predecessor).toBe("2FS");
        //         }
        //     };
        //     let add: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainer_add'));
        //     triggerMouseEvent(add, 'click');
        //     let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
        //     input.dataSource = input.dataSource.dataSource.json;
        //     input.value = "2-Planning";
        //     input.dataBind();
        //     let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
        //     triggerMouseEvent(toolbar, 'click');
        //     let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        //     triggerMouseEvent(saveRecord, 'click');
        // });
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
        // it('Dependency editing - parent to parent', () => {
        //     ganttObj.actionBegin = (args: any) => {
        //         if (args.requestType == "validateLinkedTask") {
        //             args.validateMode.preserveLinkWithEditing = false;
        //         }
        //     };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     triggerMouseEvent(dragElement, 'mousemove', 100, -50);
        //     ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
        //     ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[1];
        //     ganttObj.editModule.taskbarEditModule.finalPredecessor = '2SS';
        //     triggerMouseEvent(dragElement, 'mouseup');
        //     expect(ganttObj.flatData[1].ganttProperties.predecessorsName).toBe(null);
        // });
        // it('Dependency editing - parent to child', () => {
        //     ganttObj.actionBegin = (args: any) => {
        //         if (args.requestType == "validateLinkedTask") {
        //             args.validateMode.preserveLinkWithEditing = false;
        //         }
        //     };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     triggerMouseEvent(dragElement, 'mousemove', 100, -50);
        //     ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
        //     ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[2];
        //     ganttObj.editModule.taskbarEditModule.finalPredecessor = '2SS';
        //     triggerMouseEvent(dragElement, 'mouseup');
        //     expect(ganttObj.flatData[1].ganttProperties.predecessorsName).toBe(null);
        // });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
    describe('Custom task mode Connector line', () => {
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
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                }, done);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        // it('Dependency editing - manual parent to manual parent', () => {
        //     ganttObj.actionBegin = (args: any) => {
        //         if (args.requestType == "validateLinkedTask") {
        //             args.validateMode.preserveLinkWithEditing = false;
        //         }
        //     };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-manualparent-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     triggerMouseEvent(dragElement, 'mousemove', 100, -50);
        //     ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
        //     ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[4];
        //     ganttObj.editModule.taskbarEditModule.finalPredecessor = '1SS';
        //     triggerMouseEvent(dragElement, 'mouseup');
        //     expect(ganttObj.flatData[4].ganttProperties.predecessorsName).toBe('1SS');
        // });
        // it('Dependency editing - manual parent to parent', () => {
        //     debugger
        //     ganttObj.actionBegin = (args: any) => {
        //         if (args.requestType == "validateLinkedTask") {
        //             args.validateMode.preserveLinkWithEditing = false;
        //         }
        //     };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-manualparent-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     triggerMouseEvent(dragElement, 'mousemove', 100, -50);
        //     ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
        //     ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[9];
        //     ganttObj.editModule.taskbarEditModule.finalPredecessor = '5SS';
        //     triggerMouseEvent(dragElement, 'mouseup');
        //     expect(ganttObj.flatData[9].ganttProperties.predecessorsName).toBe('5SS');
        // });
        // it('Dependency editing - manual parent to child', () => {
        //     ganttObj.actionBegin = (args: any) => {
        //         if (args.requestType == "validateLinkedTask") {
        //             args.validateMode.preserveLinkWithEditing = false;
        //         }
        //     };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-manualparent-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     triggerMouseEvent(dragElement, 'mousemove', 100, -50);
        //     ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
        //     ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[3];
        //     ganttObj.editModule.taskbarEditModule.finalPredecessor = '5FS';
        //     triggerMouseEvent(dragElement, 'mouseup');
        //     expect(ganttObj.flatData[3].ganttProperties.predecessorsName).toBe('5FS');
        // });
        // it('Dependency editing - child to manual parent', () => {
        //     ganttObj.actionBegin = (args: any) => {
        //         if (args.requestType == "validateLinkedTask") {
        //             args.validateMode.preserveLinkWithEditing = false;
        //         }
        //     };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
        //     ganttObj.dataBind();
        //     let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(8) > td > div.e-taskbar-main-container > div') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(8) > td > div.e-taskbar-main-container > div.e-left-connectorpoint-outer-div > div.e-connectorpoint-left') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     triggerMouseEvent(dragElement, 'mousemove', 100, -50);
        //     ganttObj.editModule.taskbarEditModule.drawPredecessor = true;
        //     ganttObj.editModule.taskbarEditModule.connectorSecondRecord = ganttObj.flatData[0];
        //     ganttObj.editModule.taskbarEditModule.finalPredecessor = '8FF';
        //     triggerMouseEvent(dragElement, 'mouseup');
        //     expect(ganttObj.flatData[0].ganttProperties.predecessorsName).toBe('8FF');
        // });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
            ganttObj.openEditDialog(1);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
            tab.dataBind();
        });
        // it('Dependency tab editing', () => {
        //     ganttObj.actionComplete = (args: any): void => {
        //         if (args.requestType === 'add') {
        //             expect(args.data.Predecessor).toBe("6FS");
        //         }
        //     };
        //     let add: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainer_add'));
        //     triggerMouseEvent(add, 'click');
        //     let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
        //     input.dataSource = input.dataSource.dataSource.json;
        //     input.value = "6-Child Task 1";
        //     input.dataBind();
        //     let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
        //     triggerMouseEvent(toolbar, 'click');
        //     let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        //     triggerMouseEvent(saveRecord, 'click');
        // });
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
            ganttObj.openAddDialog();
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
            tab.dataBind();
        });
        // it('Add dependancy', () => {
        //     ganttObj.actionComplete = (args: any): void => {
        //         if (args.requestType === 'add') {
        //             expect(args.data.Predecessor).toBe("1FS");
        //         }
        //     };
        //     let add: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainer_add'));
        //     triggerMouseEvent(add, 'click');
        //     let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
        //     input.dataSource = input.dataSource.dataSource.json;
        //     input.value = "1-Parent Task 1";
        //     input.dataBind();
        //     let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
        //     triggerMouseEvent(toolbar, 'click');
        //     let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        //     triggerMouseEvent(saveRecord, 'click');
        // });
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
        });
        // it('Child Drag', () => {
        //     ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
        //         expect(args.taskBarEditAction).toBe('ChildDrag');
        //     };
        //     ganttObj.dataBind();
        //     ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
        //        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.endDate, 'MM/dd/yyyy')).toBe('04/08/2019');
        //         expect(args.taskBarEditAction).toBe('ChildDrag');
        //     };
        //     ganttObj.dataBind();
        //     let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        //     triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        //     triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 200, 0);
        //     triggerMouseEvent(dragElement, 'mouseup');
        // });
    });
    // describe('Splittasks data with day/hour mode', () => {
    //     let ganttObj: Gantt;
    //     let splitTasksData1: any = [
    //         {
    //             "name": "Company A 79087",
    //             "durationUnit": "minute",
    //             "idTask": 142730,
    //             "codiceCommessa": "79087",
    //             "cliente": {
    //                 "id": 3112,
    //                 "name": "Company A"
    //             },
    //             "bistra": null,
    //             "quantita": {
    //                 "unitaMisura": "N.",
    //                 "ordinata": 300000,
    //                 "tolleranza_percentuale": 20,
    //                 "massimaConTolleranza": 360000
    //             },
    //             "dettaglio": {
    //                 "diametro": 29.5,
    //                 "altezza": 60,
    //                 "altezzaCS": 60
    //             },
    //             "subTasks": [
    //                 {
    //                     "idTask": 888,
    //                     "codiceCommessa": "79087",
    //                     "name": "Phase 1",
    //                     "color": "#E91E63",
    //                     "startDate": new Date("2022-11-09T16:00:00"),
    //                     "durationUnit": "minute",
    //                     "duration": 240,
    //                     "duration_Calendar": 240,
    //                     "progress": 0,
    //                     "predecessor": "",
    //                     "risorsa": "VE04",
    //                     "priorita": null,
    //                     "colGanttCustoms": [
    //                         {
    //                             "name": "consegna",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memodue",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memouno",
    //                             "value": null
    //                         }
    //                     ],
    //                     "calendarName": "Phase 1"
    //                 },
    //                 {
    //                     "idTask": 889,
    //                     "codiceCommessa": "79087",
    //                     "name": "Phase2",
    //                     "color": "#CDDC39",
    //                     "startDate": new Date("2022-11-09T20:00:00"),
    //                     "durationUnit": "minute",
    //                     "duration": 180,
    //                     "duration_Calendar": 180,
    //                     "progress": 0,
    //                     "predecessor": "888FS",
    //                     "risorsa": "",
    //                     "priorita": null,
    //                     "colGanttCustoms": [
    //                         {
    //                             "name": "consegna",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memodue",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memouno",
    //                             "value": null
    //                         }
    //                     ],
    //                     "calendarName": "Phase 2"
    //                 }
    //             ],
    //             "startDate": new Date("2022-11-09T16:00:00"),
    //             "endDate": new Date("2022-11-13T00:12:00"),
    //             "color": "#428af5",
    //             "conicita": "0,83°=0°50' Diam. 29.5",
    //             "priorita_Filter": 9,
    //             "diametro_Filter": 29.5,
    //             "stato_Filter": "Inevaso",
    //             "statoProduzione_Filter": "Da iniziare"
    //         },
    //         {
    //             "name": "Company B 78999",
    //             "durationUnit": "minute",
    //             "idTask": 142218,
    //             "codiceCommessa": "78999",
    //             "cliente": {
    //                 "id": 1019,
    //                 "name": "Company 2"
    //             },
    //             "bistra": null,
    //             "dataConsegna": "2022-12-05T00:00:00",
    //             "dataInserimento": "2022-12-05T00:00:00",
    //             "quantita": {
    //                 "unitaMisura": "N.",
    //                 "ordinata": 80000,
    //                 "tolleranza_percentuale": 40,
    //                 "massimaConTolleranza": 112000
    //             },
    //             "dettaglio": {
    //                 "diametro": 34,
    //                 "altezza": 128,
    //                 "altezzaCS": 140
    //             },
    //             "subTasks": [
    //                 {
    //                     "idTask": 898,
    //                     "codiceCommessa": "78999",
    //                     "name": "Phase 1",
    //                     "color": "#E91E63",
    //                     "startDate": new Date("2022-11-09T16:00:00"),
    //                     "durationUnit": "minute",
    //                     "duration": 240,
    //                     "duration_Calendar": 240,
    //                     "progress": 0,
    //                     "predecessor": "",
    //                     "risorsa": "VE08",
    //                     "priorita": null,
    //                     "colGanttCustoms": [
    //                         {
    //                             "name": "consegna",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memodue",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memouno",
    //                             "value": null
    //                         }
    //                     ],
    //                     "calendarName": "Phase 1"
    //                 },
    //                 {
    //                     "idTask": 899,
    //                     "codiceCommessa": "78999",
    //                     "name": "Phase 2",
    //                     "color": "#CDDC39",
    //                     "startDate": new Date("2022-11-09T20:00:00"),
    //                     "durationUnit": "minute",
    //                     "duration": 1560,
    //                     "duration_Calendar": 1560,
    //                     "progress": 0,
    //                     "predecessor": "898FS",
    //                     "risorsa": "",
    //                     "priorita": null,
    //                     "colGanttCustoms": [
    //                         {
    //                             "name": "consegna",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memodue",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memouno",
    //                             "value": null
    //                         }
    //                     ],
    //                     "calendarName": "Phase 2",
    //                     "segments": [
    //                         {
    //                             "startDate": new Date("2022-11-09T20:00:00"),
    //                             "duration": 240
    //                         },
    //                         {
    //                             "startDate": new Date("2022-11-10T00:00:00"),
    //                             "duration": 1320
    //                         }
    //                     ]
    //                 }
    //             ],
    //             "startDate": new Date("2022-11-09T16:00:00"),
    //             "endDate": new Date("2022-11-10T22:51:00"),
    //             "color": "#428af5",
    //             "conicita": "3,6°=3°36' Diam. 34",
    //             "priorita_Filter": 9,
    //             "diametro_Filter": 34,
    //             "stato_Filter": "Inevaso",
    //             "statoProduzione_Filter": "Da iniziare"
    //         },
    //         {
    //             "name": "Company C 79128",
    //             "durationUnit": "minute",
    //             "mercePronta": "2022-10-05T00:00:00",
    //             "idTask": 142948,
    //             "codiceCommessa": "79128",
    //             "cliente": {
    //                 "id": 6207,
    //                 "name": "Company 3"
    //             },
    //             "bistra": null,
    //             "dataConsegna": "2022-10-15T00:00:00",
    //             "dataInserimento": "2022-10-15T00:00:00",
    //             "quantita": {
    //                 "unitaMisura": "N.",
    //                 "ordinata": 10000,
    //                 "tolleranza_percentuale": 40,
    //                 "massimaConTolleranza": 14000
    //             },
    //             "dettaglio": {
    //                 "diametro": 34,
    //                 "altezza": 122,
    //                 "altezzaCS": 134
    //             },
    //             "subTasks": [
    //                 {
    //                     "idTask": 858,
    //                     "codiceCommessa": "79128",
    //                     "name": "Phase 1",
    //                     "color": "#E91E63",
    //                     "startDate": new Date("2022-11-09T22:00:00"),
    //                     "durationUnit": "minute",
    //                     "duration": 180,
    //                     "duration_Calendar": 660,
    //                     "progress": 0,
    //                     "predecessor": "",
    //                     "risorsa": "VE08",
    //                     "priorita": null,
    //                     "colGanttCustoms": [
    //                         {
    //                             "name": "consegna",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memodue",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memouno",
    //                             "value": null
    //                         }
    //                     ],
    //                     "calendarName": "Phase 1",
    //                     "segments": [
    //                         {
    //                             "startDate": new Date("2022-11-09T22:00:00"),
    //                             "duration": 60
    //                         },
    //                         {
    //                             "startDate": new Date("2022-11-10T07:00:00"),
    //                             "duration": 120
    //                         }
    //                     ]
    //                 },
    //                 {
    //                     "idTask": 859,
    //                     "codiceCommessa": "79128",
    //                     "name": "Phase 2",
    //                     "color": "#CDDC39",
    //                     "startDate": new Date("2022-11-09T23:00:00"),
    //                     "durationUnit": "minute",
    //                     "duration": 360,
    //                     "duration_Calendar": 360,
    //                     "progress": 0,
    //                     "predecessor": "",
    //                     "risorsa": "",
    //                     "priorita": null,
    //                     "colGanttCustoms": [
    //                         {
    //                             "name": "consegna",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memodue",
    //                             "value": null
    //                         },
    //                         {
    //                             "name": "memouno",
    //                             "value": null
    //                         }
    //                     ],
    //                     "calendarName": "Phase 2",
    //                     "segments": [
    //                         {
    //                             "startDate": new Date("2022-11-09T23:00:00"),
    //                             "duration": 60
    //                         },
    //                         {
    //                             "startDate": new Date("2022-11-10T00:00:00"),
    //                             "duration": 300
    //                         }
    //                     ]
    //                 }
    //             ],
    //             "startDate": new Date("2022-11-09T22:00:00"),
    //             "endDate": new Date("2022-11-10T07:58:00"),
    //             "color": "#428af5",
    //             "conicita": "4,36°=4°22' Diam. 34",
    //             "priorita_Filter": 9,
    //             "diametro_Filter": 34,
    //             "stato_Filter": "Inevaso",
    //             "statoProduzione_Filter": "Da iniziare"
    //         }
    //     ];
    //     beforeAll((done: Function) => {
    //         ganttObj = createGantt(
    //             {
    //                 dataSource: splitTasksData1,
    //                 taskFields: {
    //                     id: "idTask",
    //                     name: "name",
    //                     startDate: "startDate",
    //                     endDate: "endDate",
    //                     duration: "duration",
    //                     durationUnit: "durationUnit",
    //                     progress: "progress",
    //                     dependency: "predecessor",
    //                     child: "subTasks",
    //                     segments: "segments",
    //                 },
    //                 actionBegin(args) {
    //                     if (args.requestType == "beforeSave") {
    //                       console.log(args.modifiedTaskData);
    //                     }
    //                   },
    //                 renderBaseline: true,
    //                 baselineColor: 'red',
    //                 editSettings: {
    //                     allowAdding: true,
    //                     allowEditing: true,
    //                     allowDeleting: true,
    //                     allowTaskbarEditing: true,
    //                     showDeleteConfirmDialog: true
    //                 },
                    
    //                 allowSelection: true,
    //                 gridLines: "Both",
    //                 showColumnMenu: true,
    //                 highlightWeekends: true,
    //                 timezone: "Europe/Rome",
    //                 timelineSettings: {
    //                     timelineUnitSize: 40,
    //                     timelineViewMode: "Day",
    //                     topTier: {
    //                       unit: "Day",
    //                       format: "E, d MMMM",
    //                       count: 1,
    //                     },
    //                     bottomTier: {
    //                       unit: "Hour",
    //                       count: 1,
    //                     },
    //                     weekStartDay: 1,
    //                     weekendBackground: "rgba(0,0,0,0.1)",
    //                     updateTimescaleView: false,
    //                 },
    //                 workWeek: [
    //                     "Monday",
    //                     "Tuesday",
    //                     "Wednesday",
    //                     "Thursday",
    //                     "Friday",
    //                     "Saturday",
    //                     "Sunday",
    //                   ],
    //                   dayWorkingTime: [
    //                         {
    //                           from: 0,
    //                           to: 24,
    //                         },
    //                       ],
    //                 height: '550px',
    //                 durationUnit: 'Minute',
    //                 projectStartDate: new Date('2022-11-09'),
    //                 projectEndDate: new Date('2022-11-12'),
    
    //             }, done);
    //     });
    //     it('Splittasks data with day/hour mode', () => {
    //         ganttObj.actionBegin = function (args: any): void {
    //             if (args.requestType == "beforeSave") {
    //                 expect(args.modifiedTaskData.length).toBe(2);
    //               }
    //         };
    //         ganttObj.dataBind()
    //         let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(8) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-last.e-gantt-child-taskbar.e-segmented-taskbar > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
    //         triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    //         triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft - 150), dragElement.offsetTop);
    //         triggerMouseEvent(dragElement, 'mouseup');
    //     });
    //     afterAll(() => {
    //         destroyGantt(ganttObj);
    //     });
    //     beforeEach((done: Function) => {
    //         setTimeout(done, 2000);
    //     });
    // });
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
        afterAll(() => {
          if (ganttObj) {
            destroyGantt(ganttObj);
          }
        });
        beforeEach(function (done) {
            setTimeout(done, 500);
        });
        it("Taskbar Drag and drop", () => {
            ganttObj.actionComplete = (args: any) => {
                if (args.requestType == 'rowDropped') {
                    expect(args.data[0].resources).toBe('Rose Fuller');
                    expect(args.modifiedRecords[1].childRecords.length).toBe(2);
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1)').getElementsByClassName('e-taskbar-main-container')[1] as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 70, 150);
            triggerMouseEvent(dragElement, 'mouseup');
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
        afterAll(() => {
          if (ganttObj) {
            destroyGantt(ganttObj);
          }
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
            ganttObj.dataBind();
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
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1)').getElementsByClassName('e-taskbar-main-container')[1] as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 70, 300);
        triggerMouseEvent(dragElement, 'mouseup');
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
        beforeEach(function (done) {
            setTimeout(done, 500);
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
        beforeEach(function (done) {
            setTimeout(done, 500);
        });
        it("check offset value while connecting predecessors", () => {
            expect(ganttObj.flatData[0].ganttProperties.predecessor[0].offset).toBe(-5);
        });
    });
});
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
    beforeEach(function (done) {
        setTimeout(done, 500);
    });
    it("Taskbar Drag and drop", () => {
        ganttObj.actionComplete = (args: any) => {
            if (args.requestType == 'rowDropped') {
                expect(args.data[0].resources).toBe('Rose Fuller');
                expect(args.modifiedRecords[1].childRecords.length).toBe(2);
            }
        };
        ganttObj.dataBind();
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
    afterAll(() => {
      if (ganttObj) {
        destroyGantt(ganttObj);
      }
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
        ganttObj.dataBind();
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
    ganttObj.dataBind();
    let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1)').getElementsByClassName('e-taskbar-main-container')[1] as HTMLElement;
    triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
    triggerMouseEvent(dragElement, 'mousemove', 70, 300);
    var cloneElement = ganttObj.element.getElementsByClassName('e-clone-taskbar');
    expect(! isNullOrUndefined(cloneElement)).toBe(true);
    var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
    expect(! isNullOrUndefined(resizeCheck)).toBe(true);
    triggerMouseEvent(dragElement, 'mouseup');
});
});

describe('cloneTaskbar Expand/Collapse', () => {
    let ganttObj: Gantt
    beforeAll((done: Function) => {
        ganttObj = createGantt({
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('when allow editing is false',() => {
        let taskbarElement: HTMLElement = ganttObj.element.getElementsByClassName('e-gantt-parent-taskbar-inner-div e-gantt-parent-taskbar e-row-expand')[0] as HTMLElement;
        triggerMouseEvent(taskbarElement, 'mousedown');
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(false);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(false);
        triggerMouseEvent(taskbarElement, 'mouseup');
        setTimeout(() => {
            expect(ganttObj.currentViewData[0].expanded).toBe(true);
        }, 100);
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
describe('clone taskbar Split task -', () => {
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
        ganttObj.actionBegin = (args: any) => {
            if (args['requestType'] === 'beforeSave') {
               expect(args.modifiedRecords.length).toBe(3);
            }
        };
        ganttObj.dataBind();
        expect(ganttObj.currentViewData[2].taskData['Segments'].length).toBe(3);
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-first.e-gantt-child-taskbar.e-segmented-taskbar > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 500), dragElement.offsetTop);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
    beforeEach((done: Function) => {
        setTimeout(done, 2000);
    });
});
describe(' clone taskbar Schedule mode', () => {
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
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Manual parent task-dragging', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ManualParentDrag');
        };
        ganttObj.dataBind();   
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy')).toBe('03/04/2017');
        };
        ganttObj.dataBind();
        expect(ganttObj.getFormatedDate(ganttObj.flatData[0].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('02/27/2017');
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(1) > td > div.e-taskbar-main-container > div.e-manualparent-main-container') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
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
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
            expect(args['name']).toBe('taskbarEdited');
            expect(args.taskBarEditAction).toBe('LeftResizing');
            expect(ganttObj.getFormatedDate(args.previousData.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
        };
        ganttObj.dataBind();
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
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args['name']).toBe('taskbarEdited');
            expect(args.taskBarEditAction).toBe('LeftResizing');
            expect(ganttObj.getFormatedDate(args.previousData.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/23/2017 08:00');
        };
        ganttObj.dataBind();
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
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
        };
        ganttObj.dataBind();
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
        ganttObj.dataBind();
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] !== 'taskbarediting') {
                expect(ganttObj.getFormatedDate(args['data'].ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/16/2017 08:00');
                if (args['requestType'] === 'beforeSave') {
                    args['cancel'] = true;
                }
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -110, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
    });
    it('progress with 0% - editing cancel', () => {
        ganttObj.actionBegin = (args: object) => { };
        ganttObj.dataBind();
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.data['Progress']).toBe(80);
            args['cancel'] = true;
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.data.ganttProperties.progress).toBe(80);
        };
        ganttObj.dataBind();
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
        ganttObj.dataBind();
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] !== 'taskbarediting') {
                expect(args['data'].ganttProperties.progress).toBe(0);
                if (args['requestType'] === 'beforeSave') {
                    args['cancel'] = true;
                }
            }
        };
        ganttObj.dataBind();
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
        ganttObj.dataBind();
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.data['Progress']).toBe(80);
            expect(args.taskBarEditAction).toBe('ProgressResizing');
            expect(args.editingFields.progress).toBe(0);
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.data.ganttProperties.progress).toBe(0);
            expect(args.taskBarEditAction).toBe('ProgressResizing');
            expect(args.editingFields.progress).toBe(0);
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-child-progress-resizer') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 0, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Child drag action', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args.taskBarEditAction).toBe('ChildDrag');
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
           //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args.taskBarEditAction).toBe('ChildDrag');
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    it('Milestone drag action', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/24/2017 08:00');
            expect(args.taskBarEditAction).toBe('MilestoneDrag');
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('11/02/2017 08:00');
            expect(args.taskBarEditAction).toBe('MilestoneDrag');
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 300, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    it('Parent drag action', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            //expect(ganttObj.getFormatedDate(args.data['StartDate'], 'MM/dd/yyyy HH:mm')).toBe('10/20/2017 08:00');
            expect(args.taskBarEditAction).toBe('ParentDrag');
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            //expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/24/2017 08:00');
            expect(args.taskBarEditAction).toBe('ParentDrag');
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr.gridrowtaskIdlevel0.e-chart-row > td > div.e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 300, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });

    it('Right resizing - editing cancel', () => {
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/30/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
            args.cancel = true;
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/30/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        ganttObj.dataBind();
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
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/30/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => { };
        ganttObj.dataBind();
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'beforeSave') {
                args['cancel'] = true;
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/30/2017 17:00');
    });
    it('Right resizing', () => {
        ganttObj.actionBegin = (args: object) => { };
        ganttObj.dataBind();
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data['EndDate'], 'MM/dd/yyyy HH:mm')).toBe('10/30/2017 17:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'MM/dd/yyyy HH:mm')).toBe('10/24/2017 08:00');
            expect(args.taskBarEditAction).toBe('RightResizing');
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        var cloneElement = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-clone-taskbar')
        expect(! isNullOrUndefined(cloneElement)).toBe(true);
        var resizeCheck = ganttObj.ganttChartModule.chartBodyContainer.querySelector('.e-taskbar-resize-div')
        expect(! isNullOrUndefined(resizeCheck)).toBe(true);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    it('Connector Line Left drag - drop outside the Gantt container', () => {
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'ValidateDependency') {
                expect(args['name']).toBe('actionBegin');
                expect(args['newPredecessorString']).toBe('5SS');
            }
        };
        ganttObj.dataBind();
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        ganttObj.dataBind();
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
    it('Connector Line Left drag - drop inside the Gantt container', () => {
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'ValidateDependency') {
                expect(args['name']).toBe('actionBegin');
                expect(args['newPredecessorString']).toBe('5SS');
            }
        };
        ganttObj.dataBind();
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointLeftDrag');
        };
        ganttObj.dataBind();
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
    it('Connector Line Right drag - drop inside the Gantt container', () => {
        ganttObj.actionBegin = (args: object) => {
            if (args['requestType'] === 'ValidateDependency') {
                expect(args['name']).toBe('actionBegin');
                expect(args['newPredecessorString']).toBe('5FF');
            }
        };
        ganttObj.dataBind();
        ganttObj.taskbarEditing = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointRightDrag');
        };
        ganttObj.dataBind();
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(args.taskBarEditAction).toBe('ConnectorPointRightDrag');
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        dragElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container > div.e-right-connectorpoint-outer-div > div.e-connectorpoint-right') as HTMLElement;
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('check duration of taskbar', () => {
        ganttObj.openAddDialog();
        let duration: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
        duration.value = 0;
        let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        triggerMouseEvent(save, 'click');
        ganttObj.dataBind();
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(0);
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('check duration of taskbar when milestome property is mapped', () => {
        expect(ganttObj.currentViewData[0].taskData['Duration']).toBe(5);
        expect(ganttObj.currentViewData[1].taskData['Duration']).toBe(10);
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it ('Drag milestone and check start date time', () => {
        ganttObj.taskbarEdited = (args: ITaskbarEditedEventArgs) => {
            expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('03/28/2019 08:00');
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 100, 0);
        triggerMouseEvent(dragElement, 'mouseup');
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Drag drop taskbar outside the chart side', () => {
        ganttObj.actionComplete = (args) => {
            if(args.requestType === 'save'){
               expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('04/08/2019 08:00');
            }
        };
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 800, 0);
        triggerMouseEvent(dragElement, 'mouseup');
    });
});
describe('CR-856375-Milestone not working properly while drop at weekend', () => {
    let ganttObj: Gantt;
    let newData1: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Project Initiation',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            isParent: true,
            subtasks: [
              {
                TaskID: 2,
                TaskName: 'Identify Site location',
                StartDate: new Date('04/02/2019'),
                Duration: 0,
                Progress: 50,
              },
              {
                TaskID: 4,
                TaskName: 'Soil test approval',
                StartDate: new Date('04/02/2019'),
                Duration: 4,
                Predecessor: '2FS',
                Progress: 50,
              },
            ],
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
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            gridLines: "Both",
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Drag and drop milestone on weekend days', () => {
        ganttObj.dataBind();
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-gantt-milestone') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 380, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/15/2019');
    });
});