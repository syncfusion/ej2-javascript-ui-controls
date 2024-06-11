/**
 * Gantt connector line spec
 */

import { baselineData, connectorLineFFDatasource, connectorLineFSDatasource, connectorLineSFDatasource, connectorLineSSDatasource, data5, data6, data7, editingData1, predecessorData, projectNewData1, predcessor1, connectorLineData } from '../base/data-source.spec';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, ITaskbarEditedEventArgs } from '../../src/index';

import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
describe('Gantt connector line support', () => {
    let changeDuration: Function = (data: Object[]) => {
        for (let i: number = 0; i < data.length; i++) {
            data[i]['Duration'] = 0;
        }
        return data;
    };
    describe('Gantt connector line rendering', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: connectorLineFSDatasource,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'Children'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                editSettings: {
                    allowTaskbarEditing: true,
                    allowEditing: true
                }
            }, done);
        });
        it('predecessor-SS', (done: Function) => {
            ganttObj.dataSource = connectorLineSSDatasource;
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[1].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[7].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[9].ganttProperties.left).toBe(363);
                done();
            }
        });
        it('predecessor-FF', (done: Function) => {
            ganttObj.dataSource = connectorLineFFDatasource;
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[2].ganttProperties.left).toBe(363);
                expect(ganttObj.flatData[4].ganttProperties.left).toBe(363);
                expect(ganttObj.flatData[6].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[8].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[10].ganttProperties.left).toBe(264);
                done();
            }
        });
        it('predecessor-SF', (done: Function) => {
            ganttObj.dataSource = connectorLineSFDatasource;
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[1].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(132);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(33);
                expect(ganttObj.flatData[7].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[9].ganttProperties.left).toBe(363);
                done();
            }
        });
        it('predecessor-FS-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineFSDatasource);
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[2].ganttProperties.left).toBe(363);
                expect(ganttObj.flatData[4].ganttProperties.left).toBe(396);
                expect(ganttObj.flatData[6].ganttProperties.left).toBe(297);
                expect(ganttObj.flatData[8].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[10].ganttProperties.left).toBe(297);
                done();
            }
        });
        it('predecessor-SS-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineSSDatasource);
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[1].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(297);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(132);
                expect(ganttObj.flatData[7].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[9].ganttProperties.left).toBe(363);
                done();
            }
        });
        it('predecessor-FF-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineFFDatasource);
            ganttObj.connectorLineWidth = 8;
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[2].ganttProperties.left).toBe(363);
                expect(ganttObj.flatData[4].ganttProperties.left).toBe(396);
                expect(ganttObj.flatData[6].ganttProperties.left).toBe(297);
                expect(ganttObj.flatData[8].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[10].ganttProperties.left).toBe(297);
                done();
            }
        });
        it('predecessor-SF-Milestone', (done: Function) => {
            ganttObj.dataSource = changeDuration(connectorLineSFDatasource);
            ganttObj.dataBound = () => {
                expect(ganttObj.flatData[1].ganttProperties.left).toBe(99);
                expect(ganttObj.flatData[3].ganttProperties.left).toBe(297);
                expect(ganttObj.flatData[5].ganttProperties.left).toBe(132);
                expect(ganttObj.flatData[7].ganttProperties.left).toBe(264);
                expect(ganttObj.flatData[9].ganttProperties.left).toBe(363);
                done();
            }
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });

    describe('Gantt connector line rendering', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: connectorLineFSDatasource,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'Children'
                },
                projectStartDate: new Date('10/15/2017'),
                projectEndDate: new Date('12/30/2017'),
                editSettings: {
                    allowTaskbarEditing: true,
                    allowEditing: true
                }
            }, done);
        });
 
        it('New predecessor sample loaded', (done: Function) => {
            ganttObj.dataSource = predecessorData;
            ganttObj.dataBound = () => {
                done();
            }
        });
        it('Remove Predecessor with edit module false value', () => {
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
            ganttObj.editSettings.allowTaskbarEditing = false;
            ganttObj.dataBind();
            ganttObj.removePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId));
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Remove Predecessor', () => {
            ganttObj.editSettings.allowTaskbarEditing = true;
            ganttObj.dataBind();
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
            ganttObj.removePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId));
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('');
        });
        it('Add Predecessor', () => {
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('');
            ganttObj.addPredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '2FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Add Predecessor with edit module false value', () => {
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
            ganttObj.editSettings.allowTaskbarEditing = false;
            ganttObj.dataBind();
            ganttObj.addPredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '4FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with edit module false value', () => {
            ganttObj.editSettings.allowTaskbarEditing = false;
            ganttObj.dataBind();
            ganttObj.updatePredecessor(Number(ganttObj.flatData[4].ganttProperties.taskId), '3FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with same taskID', () => {
            ganttObj.editSettings.allowTaskbarEditing = true;
            ganttObj.dataBind();
            ganttObj.updatePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '2FS,2');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with invalid taskID', () => {
            ganttObj.updatePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '24FS,2');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
        });
        it('Update Predecessor with valid TaskID and invalid connector type', () => {
            ganttObj.updatePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '4KS,2');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('4FS,2FS+12 days');
        });
        it('Update Predecessor with cyclic dependency', () => {
            ganttObj.updatePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '3FS');
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('4FS,2FS+12 days');
        });
        it('Aria-label testing - SS', (done: Function) => {
            ganttObj.dataSource = connectorLineSSDatasource;
            ganttObj.dataBound = () => {
                const connectorLine: HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent2child7').childNodes[0] as HTMLElement;
                const ariaLabel = connectorLine.getAttribute('aria-label');
                expect(ariaLabel && ariaLabel.indexOf('SS Start to SS Start') > -1).toBeTruthy();
                done();
            };
        });
        it('Aria-label testing - FF', (done: Function) => {
            ganttObj.dataSource = connectorLineFFDatasource;
            ganttObj.dataBound = () => {
                const connectorLine: HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent9child7').childNodes[0] as HTMLElement;
                const ariaLabel = connectorLine.getAttribute('aria-label');
                expect(ariaLabel && ariaLabel.indexOf('FF Finish to FF Finish') > -1).toBeTruthy();
                done();
            }
        });
        it('Aria-label testing - SF', (done: Function) => {
            ganttObj.dataSource = connectorLineSFDatasource;
            ganttObj.dataBound = () => {
                const connectorLine: HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent7child13').childNodes[0] as HTMLElement;
                const ariaLabel = connectorLine.getAttribute('aria-label');
                expect(ariaLabel && ariaLabel.indexOf('SF Start to SF Finish') > -1).toBeTruthy();
                done();
            }
        });
        it('Aria-label testing - FS', (done: Function) => {
            ganttObj.dataSource = connectorLineFSDatasource;
            ganttObj.dataBound = () => {
                const connectorLine: HTMLElement = ganttObj.element.querySelector('#ConnectorLineparent7child6').childNodes[0] as HTMLElement;
                const ariaLabel = connectorLine.getAttribute('aria-label');
                expect(ariaLabel && ariaLabel.indexOf('FS Finish to FS Start') > -1).toBeTruthy();
                done();
            }
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });

    describe('Cancel connector line using actionBegin event', () => {
        let ganttObj_tree: Gantt;
        beforeAll((done: Function) => {
            ganttObj_tree = createGantt(
                {
                    dataSource: projectNewData1,
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
        it('cancel connector line using actionBegin event', () => {
            ganttObj_tree.actionBegin = (args) => {
                if (args.action == 'DrawConnectorLine') {
                    args.cancel = true;
                }
            }
            ganttObj_tree.updatePredecessor(Number(ganttObj_tree.flatData[2].ganttProperties.taskId), '2SS');
            expect(ganttObj_tree.flatData[2]['Predecessor']).toBe(null);
        });
        afterAll(() => {
            destroyGantt(ganttObj_tree);
        });
    });
    describe('Cancel connector line using actionBegin event', () => {
        let ganttObj_tree: Gantt;
        beforeAll((done: Function) => {
            ganttObj_tree = createGantt(
                {
                    dataSource: connectorLineFSDatasource,
                    taskFields: {
                        id: 'TaskId',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        child: 'Children'
                    },
                    projectStartDate: new Date('10/15/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    editSettings: {
                        allowTaskbarEditing: true,
                        allowEditing: true
                    }
                }, done);
        });
        it('Update Predecessor with current parent', () => {
            ganttObj_tree.updatePredecessor(Number(ganttObj_tree.flatData[2].ganttProperties.taskId), '1FS');
            expect(ganttObj_tree.flatData[2].ganttProperties.predecessorsName).toBe('1FS');
        });
        it('Update Predecessor with independent parent', () => {
            ganttObj_tree.updatePredecessor(Number(ganttObj_tree.flatData[2].ganttProperties.taskId), '6FS');
            expect(ganttObj_tree.flatData[2].ganttProperties.predecessorsName).toBe('1FS');
        });
        it('Update Predecessor with some valid and invalid predecessor strings', () => {
            ganttObj_tree.updatePredecessor(Number(ganttObj_tree.flatData[8].ganttProperties.taskId), '2FS,5FS,4FS,3FS');
            expect(ganttObj_tree.flatData[2].ganttProperties.predecessorsName).toBe('1FS');
        });
        afterAll(() => {
            destroyGantt(ganttObj_tree);
        });
    });
    describe('offset not updating properly issue', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: [],
                    taskFields: {
                        id: 'TaskId',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor'
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                    allowSelection: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                    allowUnscheduledTasks: true,
                    editSettings: {
                        allowTaskbarEditing: true,
                        allowEditing: true,
                        allowAdding: true
                    }
                }, done);
        });

        it('check offset value after adding dependency', (done: Function) => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(ganttObj.currentViewData[1].ganttProperties.predecessor[0].offset).toBe(0);
                }
            };
            ganttObj.openAddDialog();
            let taskName: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'TaskName')).ej2_instances[0];
            taskName.value = "New Task 2";
            taskName.dataBind();
            let duration: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            duration.value = "2 days";
            duration.dataBind();
            ganttObj.dataBind();
            let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(save, 'click');
            ganttObj.openAddDialog();
            let taskName1: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'TaskName')).ej2_instances[0];
            taskName1.value = "New Task 1";
            taskName1.dataBind();
            let duration1: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            duration1.value = "3 days";
            duration1.dataBind();
            let save1: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(save1, 'click');
            ganttObj.openEditDialog(1);
            let duration2: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            duration2.value = "3 days";
            duration2.dataBind();
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
            tab.dataBind();
            let add: any = (document.getElementById(ganttObj.element.id + 'DependencyTabContainer_add'));
            triggerMouseEvent(add, 'click');
            let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
            input.dataSource = input.dataSource.dataSource.json;
            input.value = "2-New Task 1";
            input.dataBind();
            ganttObj.dataBind();
            triggerMouseEvent(save, 'click');
            done();
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
    describe('Bug - 871589 -Disabling all editing options leads to console errors', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: editingData1,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        endDate: 'EndDate',
                        dependency: 'Predecessor',
                        child: 'subtasks'
                    },
                    editSettings: {
                        allowAdding: false,
                        allowEditing: false,
                        allowDeleting: false,
                        allowTaskbarEditing: false,
                        showDeleteConfirmDialog: false,
                    }
                }, done);
        });
        it('Disabling all editing options leads to console errors.', () => {
            expect(ganttObj.flatData[3].ganttProperties.predecessorsName).toBe('113FS');
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
});
describe('coverage increament for resource view', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data5,
                resources: [
                    { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
                    { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
                ],
                viewType: 'ResourceView',
                showOverAllocation: true,
                allowTaskbarOverlap: false,
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
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName', editType: 'stringedit', width: 100 },
                    { field: 'StartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'EndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Duration', width: 100 },
                    { field: 'Predecessor', width: 100 },
                    { field: 'Progress', width: 100 },
                    { field: 'BaselineStartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'BaselineEndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Resource', width: 100 },
                    { field: 'Notes', width: 100 },
                    { field: 'Customcol', headerText: 'Custom Column', width: 100 }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 6
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
                allowSelection: true,
                highlightWeekends: true,
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('connector line in resource view', () => {
        ganttObj.updatePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '24FS,2');
        expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });

});
describe('connector line edit with virtualization', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data6 ,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                enableVirtualization: true,
                editSettings: {
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
    it('connector line edit with viratulization', () => {
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
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});
describe('Update Predecessor with invalid connector type', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data7 ,
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
    it('Update Predecessor with valid TaskID and invalid connector type', () => {
        ganttObj.updatePredecessor(Number(ganttObj.flatData[2].ganttProperties.taskId), '2KS');
        expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe('2FS');
    });
    afterAll(() => {
        if(ganttObj){
            destroyGantt(ganttObj);
        }
    });
});
describe('predecessor collection as object', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: predcessor1,
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
                connectorLineBackground:'blue',
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
    beforeEach((done: Function) => {
        setTimeout(done, 100);
    });
    it('predecessor validation as object', () => {
        expect(ganttObj.currentViewData[6].ganttProperties.predecessorsName).toBe("11FS,10FS");
        expect(ganttObj.connectorLineBackground).toBe('blue');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('predecessor collection with virtualization', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: connectorLineData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                enableTimelineVirtualization : true,
                enableVirtualization : true,
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
                connectorLineBackground:'blue',
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
    beforeEach((done: Function) => {
        setTimeout(done, 100);
    });
    it('predecessor validation as object', () => {
        expect(ganttObj.connectorLineBackground).toBe('blue');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt predecessor for GUID', () => {
    let ganttObj: Gantt;
    let projectNewData: Object[] = [
        {
            TaskID: "123e4567-e89b-12d3-a456-426614174000",
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: "123e4567-e89c-12d3-a456-314414174000", TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
                { TaskID: "321e4567-e89c-12c3-a456-454414174000", TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3
            },
                { TaskID: "456e4567-e89e-12f3-a456-113314174000", TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3 ,Progress: 30},
            ]
        },
        { TaskID: "789e4567-e89e-12f3-b456-234514174000", TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "321e4567-e89c-12c3-a456-454414174000,456e4567-e89e-12f3-a456-113314174000" },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
                    dependency:'Predecessor',
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
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'Predecessor', headerText: 'Predecessor' }
                ],
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
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Editing dependency column', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '123e4567-e89c-12d3-a456-314414174000';
            let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe('123e4567-e89c-12d3-a456-314414174000 FS');
    });
    it('Editing dependency column', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '123e4567-e89c-12d3-a456-314414174000 FS + 2';
            let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe('123e4567-e89c-12d3-a456-314414174000 FS+2 days');
    });
    it('Editing dependency column', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '123e4567-e89c-12d3-a456-314414174000 FS - 2 days';
            let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe('123e4567-e89c-12d3-a456-314414174000 FS-2 days');
    });
});
describe('Gantt predecessor for GUID', () => {
    let ganttObj: Gantt;
    let projectNewData = [
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
                { TaskID: "321e4567-e89c-12c3-a456-454414174000", TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "321e4567-e89c-12c3-a456-454414174000" },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
            { field: 'Predecessor', headerText: 'Predecessor' }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Editing dependency column', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '321e4567-e89c-12c3-a456-454414174000FS - 2';
            let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[4].ganttProperties.predecessorsName).toBe('321e4567-e89c-12c3-a456-454414174000FS');
    });
    it('mouseover dependency lines', () => {
        let element: Element = ganttObj.connectorLineEditModule['getConnectorLineHoverElement'](document.getElementsByClassName('e-connector-line')[0]);
        ganttObj.connectorLineEditModule['highlightConnectorLineElements'](element);
        ganttObj.connectorLineEditModule['highlightConnectorLineElements'](null);
        expect(element.classList[0]).toBe('e-connector-line-container');
    });
});
describe('critical path for GUID', () => {
    let ganttObj: Gantt;
    let projectNewData = [
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
                { TaskID: "321e4567-e89c-12c3-a456-454414174000", TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "321e4567-e89c-12c3-a456-454414174000" },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
            { field: 'Predecessor', headerText: 'Predecessor' }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
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
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        enableCriticalPath: true,
        height: '550px',
        allowUnscheduledTasks: true,
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Editing dependency column', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '321e4567-e89c-12c3-a456-454414174000FS - 2';
            let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[4].ganttProperties.predecessorsName).toBe('321e4567-e89c-12c3-a456-454414174000FS');
    });
    it('mouseover dependency lines', () => {
        let element: Element = ganttObj.connectorLineEditModule['getConnectorLineHoverElement'](document.getElementsByClassName('e-connector-line')[1]);
        ganttObj.connectorLineEditModule['highlightConnectorLineElements'](element);
        ganttObj.connectorLineEditModule['highlightConnectorLineElements'](null);
        expect(element.classList[0]).toBe('e-connector-line-container');
    });
});
describe('parent dependency as false', () => {
    let ganttObj: Gantt;
    let projectNewData = [
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
                { TaskID: "321e4567-e89c-12c3-a456-454414174000", TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "321e4567-e89c-12c3-a456-454414174000" },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
            { field: 'Predecessor', headerText: 'Predecessor' }
        ],
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
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
        allowParentDependency: false,
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
        searchSettings: { fields: ['TaskName', 'Duration']
        },
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        enableCriticalPath: true,
        height: '550px',
        allowUnscheduledTasks: true,
        projectStartDate: new Date('03/25/2019'),
        projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('edit dependency', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '2FS - 2';
            let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe('2 FS');
    });
});
describe('render dependency from parent to child', () => {
    let ganttObj: Gantt;
    let projectNewData = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            Predecessor: "5",
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                },
                { TaskID: "4", TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        {TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
        {
            TaskID: 5,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 6, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 7, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
                },
            ]
        }]},
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
            { field: 'Predecessor', headerText: 'Predecessor' }
        ],
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('dependency', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.predecessorsName).toBe('5FS');
        expect(ganttObj.connectorLineEditModule['compareArrays'](ganttObj.currentViewData[0].ganttProperties.predecessor, ganttObj.currentViewData[5].ganttProperties.predecessor)).toBe(true);
    });
});
describe('render dependency FF', () => {
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
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2FF", Progress: 30 },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
            { field: 'Predecessor', headerText: 'Predecessor' }
        ],
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('dependency', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
});
describe('render dependency FF', () => {
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
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2FF+1", Progress: 30 },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
            { field: 'Predecessor', headerText: 'Predecessor' }
        ],
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('dependency', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
});
describe('render dependency SS', () => {
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
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2SS", Progress: 30 },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
            { field: 'Predecessor', headerText: 'Predecessor' }
        ],
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
    beforeEach((done) => {
        setTimeout(done, 500);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
   it('dependency', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 200), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
});
describe('render dependency SS', () => {
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
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2SS+1", Progress: 30 },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
            { field: 'Predecessor', headerText: 'Predecessor' }
        ],
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('dependency', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft - 100), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
});
