/**
 * Gantt taskbaredit spec
 */
import { Gantt, ITaskbarEditedEventArgs, Edit } from '../../src/index';
import { baselineData, scheduleModeData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
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
                expect(ganttObj.getFormatedDate(args['data'].ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('10/16/2017 08:00');
                if (args['requestType'] === 'beforeSave') {
                    args['cancel'] = true;
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
                expect(args['data'].ganttProperties.progress).toBe(0);
                if (args['requestType'] === 'beforeSave') {
                    args['cancel'] = true;
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
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.startDate, 'MM/dd/yyyy HH:mm')).toBe('11/02/2017 17:00');
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
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(5) > td > div.e-taskbar-main-container') as HTMLElement;
            let e: Object = {} as Object;
            let ele: Element = ganttObj.element.querySelector('#ConnectorLineparent6child5 > div > div.e-connector-line-right-arrow') as Element;
            e['target'] = ele;
            ganttObj.connectorLineEditModule.updateConnectorLineEditElement(e as PointerEvent);
            expect(e['target'].classList.contains('e-connector-line-right-arrow-hover')).toBe(true);
            e['target'] = null;
            ganttObj.connectorLineEditModule.updateConnectorLineEditElement(e as PointerEvent);
            expect((ganttObj.element.querySelector('#ConnectorLineparent6child5 > div > div.e-connector-line-right-arrow') as Element).classList.contains('e-connector-line-right-arrow-hover')).toBe(false);
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
});