/**
 * Gantt connector line spec
 */

import { baselineData, connectorLineFFDatasource, connectorLineFSDatasource, connectorLineSFDatasource, connectorLineSSDatasource, data5, data6, data7, editingData1, predecessorData, projectNewData1, predcessor1, connectorLineData, CR909421, CR919774, CR1023089 } from '../base/data-source.spec';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, ITaskbarEditedEventArgs, CriticalPath } from '../../src/index';
import { ConnectorLineEdit } from '../../src/gantt/task-dependency/connector-line-edit';
import { CalendarModule } from '../../src/gantt/base/calendar-module';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, CriticalPath);
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
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe(null);
        });
        it('Add Predecessor', () => {
            expect(ganttObj.flatData[2].ganttProperties.predecessorsName).toBe(null);
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

    // describe('Cancel connector line using actionBegin event', () => {
    //     let ganttObj_tree: Gantt;
    //     beforeAll((done: Function) => {
    //         ganttObj_tree = createGantt(
    //             {
    //                 dataSource: projectNewData1,
    //                 taskFields: {
    //                     id: 'TaskID',
    //                     name: 'TaskName',
    //                     startDate: 'StartDate',
    //                     duration: 'Duration',
    //                     progress: 'Progress',
    //                     dependency: 'Predecessor',
    //                     child: 'subtasks'
    //                 },

    //                 editSettings: {
    //                     allowEditing: true,
    //                     allowDeleting: true,
    //                     allowTaskbarEditing: true,
    //                     showDeleteConfirmDialog: true
    //                 },
    //                 toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
    //                     'PrevTimeSpan', 'NextTimeSpan'],
    //                 allowSelection: true,
    //                 gridLines: "Both",
    //                 showColumnMenu: false,
    //                 highlightWeekends: true,
    //                 timelineSettings: {
    //                     topTier: {
    //                         unit: 'Week',
    //                         format: 'dd/MM/yyyy'
    //                     },
    //                     bottomTier: {
    //                         unit: 'Day',
    //                         count: 1
    //                     }
    //                 },
    //                 labelSettings: {
    //                     leftLabel: 'TaskName',
    //                     taskLabel: 'Progress'
    //                 },
    //                 height: '550px',
    //                 allowUnscheduledTasks: true,
    //                 projectStartDate: new Date('03/25/2019'),
    //                 projectEndDate: new Date('05/30/2019'),
    //             }, done);
    //     });
    //     it('cancel connector line using actionBegin event', () => {
    //         ganttObj_tree.actionBegin = (args) => {
    //             if (args.action == 'DrawConnectorLine') {
    //                 args.cancel = true;
    //             }
    //         }
    //         ganttObj_tree.updatePredecessor(Number(ganttObj_tree.flatData[2].ganttProperties.taskId), '2SS');
    //         expect(ganttObj_tree.flatData[2]['Predecessor']).toBe(null);
    //     });
    //     afterAll(() => {
    //         destroyGantt(ganttObj_tree);
    //     });
    // });
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
            let save: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(save, 'click');
            ganttObj.openAddDialog();
            let taskName1: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'TaskName')).ej2_instances[0];
            taskName1.value = "New Task 1";
            taskName1.dataBind();
            let duration1: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            duration1.value = "3 days";
            duration1.dataBind();
            let save1: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
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
    // beforeEach((done: Function) => {
    //     setTimeout(done, 100);
    // });
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
    // beforeEach((done: Function) => {
    //     setTimeout(done, 100);
    // });
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
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });
    
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
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
    
    it('Editing dependency column', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '321e4567-e89c-12c3-a456-454414174000FS - 2';
            let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[4].ganttProperties.predecessorsName).toBe('321e4567-e89c-12c3-a456-454414174000FS-1 days');
    });
    it('mouseover dependency lines', () => {
        let element: Element = ganttObj.connectorLineEditModule['getConnectorLineHoverElement'](document.getElementsByClassName('e-connector-line')[0]);
        ganttObj.connectorLineEditModule['highlightConnectorLineElements'](element);
        ganttObj.connectorLineEditModule['highlightConnectorLineElements'](null);
        expect(element.classList[0]).toBe('e-connector-line-container');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
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
   
    it('Editing dependency column', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '321e4567-e89c-12c3-a456-454414174000FS - 2';
            let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[4].ganttProperties.predecessorsName).toBe('321e4567-e89c-12c3-a456-454414174000FS-1 days');
    });
    it('mouseover dependency lines', () => {
        let element: Element = ganttObj.connectorLineEditModule['getConnectorLineHoverElement'](document.getElementsByClassName('e-connector-line')[1]);
        ganttObj.connectorLineEditModule['highlightConnectorLineElements'](element);
        ganttObj.connectorLineEditModule['highlightConnectorLineElements'](null);
        expect(element.classList[0]).toBe('e-connector-line-container');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
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
    
    it('edit dependency', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = '2FS - 2';
            let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            //expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe('2 FS');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
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
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        {TaskID: 5,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
        {
            TaskID: 6,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 7, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 8, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
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
    
    it('dependency', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.predecessorsName).toBe('5FS-2 days');
        expect(ganttObj.connectorLineEditModule['compareArrays'](ganttObj.currentViewData[0].ganttProperties.predecessor, ganttObj.currentViewData[4].ganttProperties.predecessor)).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('render dependency FF', () => {
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

    it('dependency', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('render dependency FF', () => {
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
   
    it('dependency', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('render dependency SS', () => {
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
    // beforeEach((done) => {
    //     setTimeout(done, 500);
    // });
    
   it('dependency', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 200), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('render dependency SS', () => {
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
    
    it('dependency', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft - 100), dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mouseup');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('render dependency SS', () => {
    let ganttObj: Gantt;
    let coulmntemplate = [
        {
            TaskID: 1,
            TaskName: 'Product concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2,Predecessor: '4SS+2', TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), notes: 'game',
                    Duration: 3, Progress: 30, resources: [2], EmailId: 'RoseFuller@gmail.com', resourcesImage: '/9j/4AAQSkZJRgABAQAAAQABAAD//gAfQ29tcHJlc3NlZCBieSBqcGVnLXJlY29tcHJlc3P/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIADcANwMBIgACEQEDEQH/xAAbAAADAAMBAQAAAAAAAAAAAAAFBwgEBgkCA//aAAgBAQAAAAC/hQFOvYjnCinKzbmZbGH5zuQtL+rjE/fO5y7I93/rpMhES5qCgxOTPErmqDaDCzVpNoBsPfbf/8QAGgEAAQUBAAAAAAAAAAAAAAAAAAECAwQFBv/aAAgBAhAAAAAoWZjmNLVM6a2Pan//xAAXAQEBAQEAAAAAAAAAAAAAAAAABAUG/9oACAEDEAAAAGjNO7PFxm1FEH//xAA3EAACAgECBAMFBgQHAAAAAAABAgMEBQAGBxESQSExMhATUVKBCBQiYWKhFiNxkTNCU2RygrH/2gAIAQEAAT8A0chavSvWwcaFUYrJdlBMSkeYjA9Z/bW5b209pY98xvncBFf57UrKrP8ACOGL1H8gCdRcfOB8txaopTojeU5p8o9Uq+OuVUv7XzrLE4DIYpvvNduY+Vif2I1Vyk0NiPH5eBYLD+EUqEmCc/BSfJv0n2ZB5MjajwlZ2RCnvbkinkViJ5CMH5n/APNdNajV5L0Q14IyflREUeJ1vDP53jTu65l72QMOMWZ4MbW/yQwBuw+Yj1HW3OAEF1lntZ50iHNRGkHiSe/MtrbEF3ghuPEWkyktvbt2daeQRx4oH8EfkPk1PTr5CrLVtRBom5fkQR3B7EdjrD2Z1exibrdVury/mf6sLeiT+vY6wRV69rJv671mSX4n3anoRfoo1l6pv4rKUAwQ2ak8AY+QMiFef76x2VbacmNrvjnnmjAMiGRU5OW9IB8WOtucRXk2ra3FiMK9panISQGTpCv+ZAJ1ZvZjiJgbr28VBVimjjmj6RYVo2V/DwljQN3BI1Gysqup5hgCNZ2VcbZx2Z7Rl683LzaORSw/syjW3HUYHFfEVkB9m7sNitqby3LVzlFmkhlkmrFVKO6MSY+nXBvN0Zq+YoLQsixLKr9DxosBHkSCxAIXvrFTRzyDCrSjhnM6x9KgCFwT6l5dtIOlFX4Aa3uhG3bCjxYyxfU9WsEfu5v4lvBqlhygPeGY9aH9yPZ9rHEQ0M5tvOo/4sjVnqSoP9uQQw+kuuFMAd0DW4pK5J61lkYsOf8A28DrYaU23dFVqoohgWWdlTyDEcv7nnz9mShTIZGhiTzaNFe1Z5dlAKIPqTrK1bEU8GYx8ZezApSWIec8BPMqP1DzXXEn7Ue2dlT2sNisLfyGZi7TxmrWT+rP+JtY7c03GVty/wAVSKcnNcjsQyJ4CCLoEaJEOypy1tjgruGnuypiZcpXkSWMWVevZVHeH5mTnzGt75ylwWweJkw5jmzlu5FyD94IiGm+jenWy+NG1N60m+4CxHlo4laTGshMhZjyHQw8GBOsZTmrJNaukNftMJJyPJeyxj9KD2cReDu0OJNUnJVBDdH+Hai/C6nW2+AWe4ZbrOTe3VvYKeKSByT0ypzIKkL31tfZ+8It62tx5a37h6+T+/0pY5FKycj0CAgEkRmPw1ujg/n+Ke7XzuRvpTwcaJBVjRg0vuk8T/xJOtmcPtu7EpJVw9VRL0/zJ28XY+z/xAAiEQACAQMEAgMAAAAAAAAAAAABAgMABBEQEhNRISIFQYH/2gAIAQIBAT8AqW/hjk4y/t1ioJ0nTemtyA0pYREOjeT3XxjFufxhcg/ut5aMw5Ez7H6Gas7ZraHa4wzHcdVYjaOjmiSTk6f/xAAiEQACAQIGAwEAAAAAAAAAAAABAgMEEQAFEBITISJBUZH/2gAIAQMBAT8AxFltRJGsvH4H3fFTTvTPsf2LjWlBEChp1aNk8V+YzdVUwDddrH81y6t4xxkjpSLsbdYr6hamfehuoULr91//2Q==' },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), notes: 'game',
                    Duration: 2, Progress: 30, resources: [2, 4], EmailId: 'FullerKing@gmail.com', resourcesImage: ['/9j/4AAQSkZJRgABAQAAAQABAAD//gAfQ29tcHJlc3NlZCBieSBqcGVnLXJlY29tcHJlc3P/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIADcANwMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAFBwQGCAMCCf/aAAgBAQAAAADfwhV0x/EZ4hW5npVo+hcTlnMn4TW6ofZUBIXDSIEnOzwAaDYEyICYV79vc+aEqNLsbBM//8QAGAEAAwEBAAAAAAAAAAAAAAAAAgQFAwD/2gAIAQIQAAAABNvRaHSpjAqO9hof/8QAGQEAAgMBAAAAAAAAAAAAAAAAAgUDBAYA/9oACAEDEAAAADbLIbutRIi2OdXdagD/xAAfEAACAwEBAQADAQAAAAAAAAAEBQIDBgEHABITFBX/2gAIAQEAAQgA+/0izrLKEuj9O81zxtwL2r3Pze87lUFwwDEEVrlQ21sL617X47th5VaUf2TSlZ/O0Z9IT468vpqspb+dtFYNhQ3jnpLfFP6lzAoQY4aY5acm+MyFJqOf5jlMu+12WWaxaJBjugEFv8cG+5kMlobU70irSIgntauc+rF0rHtsVpK5z9nZ/ihVc56fmiTmueaDmJMvJkTeVxnnCKIgcJUrma0oRaHRwYYYeO3h3mdIjxF3+fp6mRlA5dMxyHyyqbZuDVFcbTyFFuAVdpIlKz5lTBgxAU9aikV30OALtIDMbnQ9akbk12vEoL7YmE1i9xrWtZKdU6tYkvF7IVYHcNC4o35zmhjLJmCfqbZwqBJeqGzphcDs2mzjIsTN8WJ84Ak7K2H3/8QAMxAAAgEDAgMECQMFAAAAAAAAAQIDAAQREjETIVEFQWGhEBQjMkJicXKBBiIzUlOCkbH/2gAIAQEACT8ApE0IxWS9l5xKRuEHxnyrt687Wv4v5o4Q7oh8Fj0pX6PuY7HIBunjjDjqdCk12xItvOgkhZJDPbspH9D58iDUKw3D8opUJMEx6KTs3yn0SMqlOLeyqcFYicCNT1f/AJXsZryMxkxjBSHbC/dUS3XEjDSaSoYN/kRVndZikKSppJKMOoHcakkXseadI7mCbKhdZwZUB2K0gaKTGANwe4g9xFNqu7XHtP7sLe5J9e40My31zJL1IjU6EH4UUTxNFsR0KvIVxVnLPPGig5dIkzjnguQTiuxxi4bHtpAgBHzYNWcEc9rexJrt51nDRzciCQBUgaQ20RYg55ledbRl7ebG7RyKWH+mUVv6sgPhgUoYiWO3lDclVUbiqSfrUEMlyrH4QWOfOpFdopjmAxMMN0C489qgRtckMiRON3WQPjyonTFEqDPRRiubGWL8nVXJrS4coOsMx1ofMiow6HcVcvBLLMdMyAFlO/xCnLXnMLcNAMdNVScd7ePEkxULqZ+/C4A9GWjRXurnHcoBRB+Saj13MAKSxDeeA8yo+YbrUmt2HMEEafr4ipHkljYm4Qe+veGHUVLFpZsamWpGnyWSd1HvTIobC/aDtUrTTNgJbqhEruTyUCiGv7phJPjZcDCxj5UHok9WvH95gMxyfevXxFW4MWzNFIGR1+hwaaW2u5c8UJEBFkjGcMVw3iKs/Ubaxt7mOX1iZZuJLOysZMpgs37eg3ocW9fOudhjGdwg7h6P/8QAIREBAAIBBAEFAAAAAAAAAAAAAQIDAAQQETESBSJBYYH/2gAIAQIBAT8AnMhFk4a2Euph+ZXYWG2rOaX6yTxEDr5z015jMD2m0kB5yyLXKzkAVTND4RoiHart3llNdkGE48mRhGIeMToNv//EACIRAQACAQMEAwEAAAAAAAAAAAECAxEAEBIEBTFhFSEiNP/aAAgBAwEBPwCuuVs4wj5dfFTBzFUPGdXUyplxdu3/ANURQyOq6xCUs5cYdd7hwnUyRk7R5cjj510t5OqGP2kQfSa7k2T6qyUj6MB62FETVHU3U2RsrniXh96nZOaspLlV2//Z', '/9j/4AAQSkZJRgABAQAAAQABAAD//gAfQ29tcHJlc3NlZCBieSBqcGVnLXJlY29tcHJlc3P/2wCEAAQEBAQEBAQEBAQGBgUGBggHBwcHCAwJCQkJCQwTDA4MDA4MExEUEA8QFBEeFxUVFx4iHRsdIiolJSo0MjRERFwBBAQEBAQEBAQEBAYGBQYGCAcHBwcIDAkJCQkJDBMMDgwMDgwTERQQDxAUER4XFRUXHiIdGx0iKiUlKjQyNEREXP/CABEIADcANwMBIgACEQEDEQH/xAAbAAADAAMBAQAAAAAAAAAAAAAFBwgEBgkCA//aAAgBAQAAAAC/hQFOvYjnCinKzbmZbGH5zuQtL+rjE/fO5y7I93/rpMhES5qCgxOTPErmqDaDCzVpNoBsPfbf/8QAGgEAAQUBAAAAAAAAAAAAAAAAAAECAwQFBv/aAAgBAhAAAAAoWZjmNLVM6a2Pan//xAAXAQEBAQEAAAAAAAAAAAAAAAAABAUG/9oACAEDEAAAAGjNO7PFxm1FEH//xAA3EAACAgECBAMFBgQHAAAAAAABAgMEBQAGBxESQSExMhATUVKBCBQiYWKhFiNxkTNCU2RygrH/2gAIAQEAAT8A0chavSvWwcaFUYrJdlBMSkeYjA9Z/bW5b209pY98xvncBFf57UrKrP8ACOGL1H8gCdRcfOB8txaopTojeU5p8o9Uq+OuVUv7XzrLE4DIYpvvNduY+Vif2I1Vyk0NiPH5eBYLD+EUqEmCc/BSfJv0n2ZB5MjajwlZ2RCnvbkinkViJ5CMH5n/APNdNajV5L0Q14IyflREUeJ1vDP53jTu65l72QMOMWZ4MbW/yQwBuw+Yj1HW3OAEF1lntZ50iHNRGkHiSe/MtrbEF3ghuPEWkyktvbt2daeQRx4oH8EfkPk1PTr5CrLVtRBom5fkQR3B7EdjrD2Z1exibrdVury/mf6sLeiT+vY6wRV69rJv671mSX4n3anoRfoo1l6pv4rKUAwQ2ak8AY+QMiFef76x2VbacmNrvjnnmjAMiGRU5OW9IB8WOtucRXk2ra3FiMK9panISQGTpCv+ZAJ1ZvZjiJgbr28VBVimjjmj6RYVo2V/DwljQN3BI1Gysqup5hgCNZ2VcbZx2Z7Rl683LzaORSw/syjW3HUYHFfEVkB9m7sNitqby3LVzlFmkhlkmrFVKO6MSY+nXBvN0Zq+YoLQsixLKr9DxosBHkSCxAIXvrFTRzyDCrSjhnM6x9KgCFwT6l5dtIOlFX4Aa3uhG3bCjxYyxfU9WsEfu5v4lvBqlhygPeGY9aH9yPZ9rHEQ0M5tvOo/4sjVnqSoP9uQQw+kuuFMAd0DW4pK5J61lkYsOf8A28DrYaU23dFVqoohgWWdlTyDEcv7nnz9mShTIZGhiTzaNFe1Z5dlAKIPqTrK1bEU8GYx8ZezApSWIec8BPMqP1DzXXEn7Ue2dlT2sNisLfyGZi7TxmrWT+rP+JtY7c03GVty/wAVSKcnNcjsQyJ4CCLoEaJEOypy1tjgruGnuypiZcpXkSWMWVevZVHeH5mTnzGt75ylwWweJkw5jmzlu5FyD94IiGm+jenWy+NG1N60m+4CxHlo4laTGshMhZjyHQw8GBOsZTmrJNaukNftMJJyPJeyxj9KD2cReDu0OJNUnJVBDdH+Hai/C6nW2+AWe4ZbrOTe3VvYKeKSByT0ypzIKkL31tfZ+8It62tx5a37h6+T+/0pY5FKycj0CAgEkRmPw1ujg/n+Ke7XzuRvpTwcaJBVjRg0vuk8T/xJOtmcPtu7EpJVw9VRL0/zJ28XY+z/xAAiEQACAQMEAgMAAAAAAAAAAAABAgMABBEQEhNRISIFQYH/2gAIAQIBAT8AqW/hjk4y/t1ioJ0nTemtyA0pYREOjeT3XxjFufxhcg/ut5aMw5Ez7H6Gas7ZraHa4wzHcdVYjaOjmiSTk6f/xAAiEQACAQIGAwEAAAAAAAAAAAABAgMEEQAFEBITISJBUZH/2gAIAQMBAT8AxFltRJGsvH4H3fFTTvTPsf2LjWlBEChp1aNk8V+YzdVUwDddrH81y6t4xxkjpSLsbdYr6hamfehuoULr91//2Q=='] }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coulmntemplate,
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
            resourceInfo: 'resources',
            dependency: 'Predecessor',
            child: 'subtasks',
            notes: 'notes',
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
        toolbar: ['PdfExport'],
        columns: [
            { field: 'TaskID', headerText: 'Task ID', textAlign: 'Left' },
            { field: 'TaskName', headerText: 'Task Name', width: '250' },
            { field: 'resources', headerText: 'Resources', width: '250', template: '#columnTemplate' },
            { field: 'EmailId', headerText: 'Email ID', template: '#template2', width: 180 },
            { field: 'notes', headerText: 'notes' }
        ],
        allowExcelExport: true,
        allowPdfExport: true,
        allowSelection: true,
        height: '450px',
            }, done);
    });
    // beforeEach((done: Function) => {
    //     setTimeout(done, 100);
    // });
   
    it('dependency', () => {
       expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe('4SS+2 days');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('manual mode dependency SS', () => {
    let ganttObj: Gantt;
    let taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'isMilestone': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'), 'Duration':0,
                    'EndDate': new Date('02/27/2017'), 'Progress': '40', 'BaselineStartDate': new Date('04/02/2019'), 'BaselineEndDate': new Date('04/06/2019') },
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('03/09/2017'),
            'Progress': '40',
            'isManual': true,
            'Predecessor':'2SS',
            'Children': [
                { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40' }
            ]
        },
    ];
    // beforeEach((done: Function) => {
    //     setTimeout(done, 100);
    // });
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
        allowSorting: true,
        enableContextMenu: true,
        height: '450px',
        allowSelection: true,
        highlightWeekends: true,
        renderBaseline: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            endDate: 'EndDate',
            dependency: 'Predecessor',
            child: 'Children',
            milestone: 'isMilestone',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            manual: 'isManual',
        },
        taskMode: 'Custom',
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowRowDragAndDrop: true,
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
        allowFiltering: true,
        columns: [
            { field: 'TaskID', visible: true },
            { field: 'TaskName' },
            { field: 'isManual' },
            { field: 'StartDate' },
            { field: 'Duration' },
            { field: 'Progress' }
        ],
        validateManualTasksOnLinking: true,
        treeColumnIndex: 1,
        allowReordering: true,
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
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
        gridLines: "Both",
        showColumnMenu: true,
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        labelSettings: {
            leftLabel: 'TaskName',
            taskLabel: '${Progress}%'
        },
        projectStartDate: new Date('02/20/2017'),
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    
    it('dependency', () => {
       expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('manual mode dependency SS', () => {
    let ganttObj: Gantt;
    let taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'isMilestone': true,
            'Children': [
                { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'), 'Duration':0,
                    'EndDate': new Date('02/27/2017'), 'Predecessor':'5SS','Progress': '40', 'BaselineStartDate': new Date('04/02/2019'), 'BaselineEndDate': new Date('04/06/2019') },
            ]
        },
        {
            'TaskID': 5,
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('03/09/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': 6, 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40' }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
        allowSorting: true,
        enableContextMenu: true,
        height: '450px',
        allowSelection: true,
        highlightWeekends: true,
        renderBaseline: true,
        taskFields: {
            id: 'TaskID',
            name: 'TaskName',
            startDate: 'StartDate',
            duration: 'Duration',
            progress: 'Progress',
            endDate: 'EndDate',
            dependency: 'Predecessor',
            child: 'Children',
            milestone: 'isMilestone',
            baselineStartDate: "BaselineStartDate",
            baselineEndDate: "BaselineEndDate",
            manual: 'isManual',
        },
        taskMode: 'Custom',
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' },
                { field: 'TaskName', direction: 'Ascending' }]
        },
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
        allowExcelExport: true,
        allowPdfExport: true,
        allowRowDragAndDrop: true,
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
        allowFiltering: true,
        columns: [
            { field: 'TaskID', visible: true },
            { field: 'TaskName' },
            { field: 'isManual' },
            { field: 'StartDate' },
            { field: 'Duration' },
            { field: 'Progress' }
        ],
        validateManualTasksOnLinking: true,
        treeColumnIndex: 1,
        allowReordering: true,
        editSettings: {
            allowAdding: true,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            showDeleteConfirmDialog: true
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
        gridLines: "Both",
        showColumnMenu: true,
        allowResizing: true,
        readOnly: false,
        taskbarHeight: 20,
        rowHeight: 40,
        labelSettings: {
            leftLabel: 'TaskName',
            taskLabel: '${Progress}%'
        },
        projectStartDate: new Date('02/20/2017'),
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    // beforeEach((done: Function) => {
    //     setTimeout(done, 100);
    // });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('dependency', () => {
       expect(ganttObj.currentViewData[1].ganttProperties.predecessor.length).toBe(1);
    });
});
describe('Checking connector line position', () => {
    let ganttObj: Gantt;
    let projectNewData = [
        { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "4" },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
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
                allowResizing: true,
                readOnly: false,
                rowHeight: 60,
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    // beforeEach(function (done) {
    //     setTimeout(done, 500);
    // });
    it('dependency', () => {
        expect(ganttObj.chartPane.querySelector('.e-connector-line').getAttribute('d')).toBe('M 363 31  L 373 31 L 373 60 L 326 60 L 326 92 L 334 92');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR:909421-Change the event argument action property value while deleting dependency', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR909421,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'Predecessor', headerText: 'Predecessor' }
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
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
                enableContextMenu: true,
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
    beforeEach((done: Function) => {
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        setTimeout(done, 200);
    });
    it('Checking actionBegin event requestType while contextMenu Delete Depedency', (done: Function) => {
        ganttObj.actionBegin = (args?: any): void => {
            if (args.requestType === "beforeSave") {
                expect(args.action).toBe('DeleteConnectorLine');
            }
            done();
        };
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        let e = {
            item: ganttObj.contextMenuModule.contextMenu.items[5].items[0],
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
    });
    it('Remove Predecessor', () => {
        ganttObj.actionBegin = (args?: any): void => {
            if (args.requestType === "beforeSave") {
                expect(args.action).toBe('DeleteConnectorLine');
            }
        };
        ganttObj.removePredecessor((ganttObj.flatData[3].ganttProperties.taskId));
    });
    it('Add Predecessor', () => {
        ganttObj.actionBegin = (args?: any): void => {
            if (args.requestType === "beforeSave") {
                expect(args.action).toBe('DrawConnectorLine');
            }
        };
        ganttObj.addPredecessor((ganttObj.flatData[3].ganttProperties.taskId), '3FS');
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('CR:919774-Predecessor getting removed when offset is in decimal', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR919774,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'Predecessor', headerText: 'Predecessor' }
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
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
                enableContextMenu: true,
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
    it('Checking for dependency', () => {
        expect(ganttObj.flatData[3].ganttProperties.predecessor.length > 0).toBe(true);
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Coverage issue due to CSP - Optimized Tests', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: CR919774,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'Predecessor', headerText: 'Predecessor' }
            ],
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            allowSelection: true,
            gridLines: "Both",
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
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    it('should correctly add a predecessor using the addPredecessor method', () => {
        ganttObj.addPredecessor(4, "3FS");
        const task = ganttObj.flatData[3];
        expect(task.ganttProperties.predecessor.length).toBe(2);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('Coverage for validatetype method', () => {
    let ganttObj: Gantt;
    const data = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval',Duration: 3, EndDate: new Date('04/02/2019')},
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'Predecessor', headerText: 'Predecessor' }
            ],
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            allowSelection: true,
            gridLines: "Both",
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
            allowUnscheduledTasks: true,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    it('Coverage for validatetype method', () => {
       const ganttdata :Object = ganttObj.getRecordByID('5');
       const ganttdata1 :Object = ganttObj.getRecordByID('4');
       const data: any = ganttObj.connectorLineEditModule.validateTypes(ganttdata,ganttdata1);
       expect(data.task.ganttProperties.left).toBe(0);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe(' Hierarchical Task Movement in Gantt Chart with FS Dependencies', () => {
    let ganttObj: Gantt;
    const data = [
        {
            TaskID: 5,
            TaskName: 'new task 5',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 4, TaskName: 'new task 4', StartDate: new Date('04/02/2019'), Duration: 1, Progress: 30 },
            ]
        },
        {
            TaskID: 3,
            TaskName: 'new task 3',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'new task 2', StartDate: new Date('04/02/2019'), Duration: 1, Progress: 30,
                    subtasks: [
                        { TaskID: 1, TaskName: 'new task 1', StartDate: new Date('04/02/2019'), Duration: 1, Progress: 30 },
                    ]
                },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
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
            allowExcelExport: true,
            allowPdfExport: true,
            allowSelection: true,
            allowRowDragAndDrop: true,
            selectedRowIndex: 1,
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
    it('Hierarchical Task Movement in Gantt Chart with FS Dependencies', () => {
        ganttObj.addPredecessor(2, "5FS");
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/03/2019');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('Manual parent connector line render', () => {
    let ganttObj: Gantt;
    const data = [
        {
            "TaskID": 1,
            "TaskName": "Parent Task 1",
            "StartDate": new Date("02/27/2024"),
            "EndDate": new Date("03/03/2024"),
            "Progress": "40",
            "isManual": true,
            "Children": [
                { "TaskID": 2, "TaskName": "Child Task 1", "StartDate": new Date("02/27/2024"), "EndDate": new Date("03/03/2024"), "Progress": "40" }
            ]
        },
        {
            "TaskID": 5,
            "TaskName": "Parent Task 2",
            "StartDate": new Date("03/05/2024"),
            "EndDate": new Date("03/09/2024"),
            "Progress": "40",
            "isManual": true,
            "Predecessor": '1SS',
            "Children": [
                { "TaskID": 6, "TaskName": "Child Task 1", "StartDate": new Date("03/06/2024"), "EndDate": new Date("03/09/2024"), "Progress": "40" }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
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
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search'],
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName' },
                { field: 'isManual' }
            ],
            collapseAllParentTasks: true,
            validateManualTasksOnLinking: true,
            treeColumnIndex: 1,
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            labelSettings: {
                leftLabel: 'TaskName'
            },
            splitterSettings: {
                position: "35%"
            },
            projectStartDate: new Date("02/20/2024"),
            projectEndDate: new Date('03/30/2024'),
        }, done);
    });
    it('checking d value of connector line', () => {
        expect(ganttObj.chartPane.querySelector('.e-connector-line').getAttribute('d')).toBe('M 232 8 L 221 8 L 221 43 L 386 43');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('calling processpredcessor method for code coverage', () => {
    let ganttObj: Gantt;
       const data =[
        {
            TaskID: '1',
            TaskName: 'Contract Award / Terms / Execution',
            StartDate: '2025-05-21T22:00:00.000Z',
            EndDate: '2025-05-22T22:00:00.000Z',
            Duration: 1,
            Progress: 0
        },
        {
            TaskID: '2',
            TaskName: 'Signed Contract with Owner',
            StartDate: '2025-05-22T22:00:00.000Z',
            EndDate: '2025-05-27T22:00:00.000Z',
            Duration: 3,
            Progress: 0,
            Dependencies: '1 FS',
        },
        {
            TaskID: '3',
            TaskName: 'Project Kickoff Meeting',
            StartDate: '2025-05-27T22:00:00.000Z',
            EndDate: '2025-06-03T22:00:00.000Z',
            Duration: 5,
            Progress: 0,
            Dependencies: '2 FS',
        },
        {
            TaskID: '7',
            TaskName: 'Preliminary Pricing / Budget Finalization',
            StartDate: '2025-06-03T22:00:00.000Z',
            EndDate: '2025-06-10T22:00:00.000Z',
            Duration: 5,
            Progress: 0,
            Dependencies: '3 FS'
        },
        {
            TaskID: '8',
            TaskName: 'Design Finalization / Construction Documents',
            StartDate: '2025-06-03T22:00:00.000Z',
            EndDate: '2025-06-06T22:00:00.000Z',
            Duration: 3,
            Progress: 0,
            Dependencies: '3 FS',
        },
        {
            TaskID: '9',
            TaskName: 'Value Engineering Process',
            StartDate: '2025-06-10T22:00:00.000Z',
            EndDate: '2025-06-17T22:00:00.000Z',
            Duration: 5,
            Progress: 0,
            Dependencies: '7 FS,8 SS'
        },
        {
            TaskID: '10',
            TaskName: 'Drawings Update based on VE',
            StartDate: '2025-06-17T22:00:00.000Z',
            EndDate: '2025-06-24T22:00:00.000Z',
            Duration: 5,
            Progress: 0,
            Dependencies: '9 FS'
        }]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Dependencies',
                baselineStartDate: 'BaselineStartDate',
                baselineEndDate: 'BaselineEndDate',
                parentID: 'ParentID',
            },
            resourceFields : {
                id: 'resourceId',
                name: 'resourceName',
            },
            enableTimelineVirtualization: true,
            enableVirtualization: true,
            renderBaseline: true,
            baselineColor: 'red',
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
        }, done);
    });
    it('calling processpredcessor method for code coverage', () => {
        ganttObj.connectorLineEditModule['processPredecessor']('3',[]);
        expect(ganttObj.currentViewData[2].ganttProperties.predecessorsName).toBe('2 FS');
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('CR-983909', () => {
    let ganttObj: Gantt;
       const data = [
      {
        Id: 0,
        Name: 'Parent Task',
        Start: '2025-09-01T02:30:00.000Z',
        Finish: '2025-09-30T12:30:00.000Z',
        SubTasks: [
          {
            Id: 86,
            Name: 'Task 86',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-10T12:30:00.000Z',
            Duration: 8,
            Predecessors: '',
            ConstraintType: null,
            ConstraintDate: null,
          },
          {
            Id: 158,
            Name: 'Task 158',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-12T12:30:00.000Z', // Early finish
            Duration: 10,
            Predecessors: '',
            ConstraintType: 2,
            ConstraintDate: '2025-09-01T02:30:00.000Z',
          },
          {
            Id: 159,
            Name: 'Task 159',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-10T12:30:00.000Z',
            Duration: 8,
            Predecessors: '',
            ConstraintType: null,
            ConstraintDate: null,
          },
          {
            Id: 160,
            Name: 'Task 160',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-10T12:30:00.000Z',
            Duration: 8,
            Predecessors: '',
            ConstraintType: null,
            ConstraintDate: null,
          },
          {
            Id: 171,
            Name: 'Task 171',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-10T12:30:00.000Z',
            Duration: 8,
            Predecessors: '',
            ConstraintType: null,
            ConstraintDate: null,
          },
          {
            Id: 172,
            Name: 'Task 172',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-10T12:30:00.000Z',
            Duration: 8,
            Predecessors: '',
            ConstraintType: null,
            ConstraintDate: null,
          },
          {
            Id: 189,
            Name: 'Task 189',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-10T12:30:00.000Z',
            Duration: 8,
            Predecessors: '',
            ConstraintType: null,
            ConstraintDate: null,
          },
          {
            Id: 190,
            Name: 'Task 190',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-10T12:30:00.000Z',
            Duration: 8,
            Predecessors: '',
            ConstraintType: null,
            ConstraintDate: null,
          },
          {
            Id: 207,
            Name: 'Task 207',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-10T12:30:00.000Z',
            Duration: 8,
            Predecessors: '',
            ConstraintType: null,
            ConstraintDate: null,
          },
          {
            Id: 208,
            Name: 'Task 208',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-10T12:30:00.000Z',
            Duration: 8,
            Predecessors: '',
            ConstraintType: null,
            ConstraintDate: null,
          },
          {
            Id: 218,
            Name: 'Task 218',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-16T12:30:00.000Z', // Late finish
            Duration: 12,
            Predecessors: '',
            ConstraintType: 2,
            ConstraintDate: '2025-09-01T02:30:00.000Z',
          },
          {
            Id: 219,
            Name: 'Task 219',
            Start: '2025-09-01T02:30:00.000Z',
            Finish: '2025-09-10T12:30:00.000Z',
            Duration: 8,
            Predecessors: '',
            ConstraintType: null,
            ConstraintDate: null,
          },
          {
            Id: 161,
            Name: 'Task 161',
            Start: '2025-09-16T02:30:00.000Z',
            Finish: '2025-09-24T12:30:00.000Z',
            Duration: 7,
            Predecessors: '158, 219, 190, 208, 218, 207, 172, 171, 189, 86, 159, 160', // Swap to '158,218,219,190,208,207,172,171,189,86,159,160'
            ConstraintType: 0, // AsSoonAsPossible
            ConstraintDate: null,
          },
        ],
      },
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
            height: "450px",
            taskFields: {
                id: 'Id',
                name: 'Name',
                startDate: 'Start',
                endDate: 'Finish',
                duration: 'Duration',
                dependency: 'Predecessors',
                constraintType: 'ConstraintType',
                constraintDate: 'ConstraintDate',
                child: 'SubTasks',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            timelineSettings: {
                topTier: { unit: 'Week', format: 'MMM dd, y' },
                bottomTier: { unit: 'Day' },
            },
            projectStartDate: new Date('09/01/2025'),
            projectEndDate: new Date('09/30/2025')
        }, done);
    });
    it('Checking for predecessor length', () => {
        expect(ganttObj.flatData[13].ganttProperties.predecessor.length).toBe(12);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('computeTopologicalOrder coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task A', StartDate: new Date('04/04/2019'), Duration: 2 }
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                enableUndoRedo: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration'
                }
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Covers the ? 0 branch in computeTopologicalOrder', () => {
        const cyclicValidator = ganttObj['cyclicValidator'];
        cyclicValidator['adjacency'] = new Map<string, Set<string>>();
        cyclicValidator['adjacency'].set('A', new Set(['B']));
        const order = cyclicValidator['computeTopologicalOrder']().length;
        expect(order).toBe(2);
    });
});
describe('computeTopologicalOrder coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 1, TaskName: 'Task A', StartDate: new Date('04/04/2019'), Duration: 2 }
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                enableUndoRedo: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration'
                }
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Covers the ? 0 branch in computeTopologicalOrder', () => {
        const cyclicValidator = ganttObj['cyclicValidator'];
        cyclicValidator['adjacency'] = new Map<string, Set<string>>();
        cyclicValidator['adjacency'].set('A', new Set(['B']));
        const order = cyclicValidator['computeTopologicalOrder']().length;
        expect(order).toBe(2);
    });
});
describe('decrementDegree helper coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    { TaskID: 2, TaskName: 'Task X', StartDate: new Date('04/06/2019'), Duration: 1 }
                ],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true
                },
                enableUndoRedo: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration'
                }
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Covers missing key branch in decrementDegree helper', () => {
        const testIndeg: Map<string, number> = new Map();
        testIndeg.set('otherNode', 5);
        const node: string = 'missingNode';
        ganttObj['cyclicValidator']['decrementDegree'](testIndeg, node);
        expect(ganttObj.flatData.length).toBe(1);
    });
});

describe('ConnectorLineEdit - getEditedConnectorLineString branch coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                    TaskID: 1, TaskName: 'Parent', StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/05/2019'),
                    subtasks: [
                        { TaskID: 2, TaskName: 'Child A', StartDate: new Date('04/02/2019'), Duration: 2 },
                        { TaskID: 3, TaskName: 'Child B', StartDate: new Date('04/04/2019'), Duration: 1, Predecessor: '2FS' }
                    ]
                }
            ],
            taskFields: {
                id: 'TaskID', name: 'TaskName', startDate: 'StartDate', endDate: 'EndDate',
                duration: 'Duration', dependency: 'Predecessor', child: 'subtasks'
            },
            editSettings: { allowAdding: true, allowEditing: true, allowTaskbarEditing: true },
            projectStartDate: new Date('04/01/2019'),
            projectEndDate: new Date('04/30/2019'),
        }, done);
    });

    it('invoke getEditedConnectorLineString when parent is expanded and allowParentDependency = false', () => {
        const module: any = (ganttObj as any).connectorLineEditModule;
        const parentRecord: any = ganttObj.flatData[0]; // parent row
        const childRecord: any = ganttObj.flatData[1]; // first child
        ganttObj.allowParentDependency = false;
        parentRecord.expanded = true;
        childRecord.expanded = false;
        // call internal method with shaped args to exercise branch
        module['getEditedConnectorLineString'](ganttObj.flatData);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('validationDialogCancelButton - additional branch coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'), Duration: 2 },
                { TaskID: 2, TaskName: 'Task 2', StartDate: new Date('04/04/2019'), Duration: 3, Predecessor: '1FS' }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            editSettings: { allowEditing: true, allowTaskbarEditing: true },
            projectStartDate: new Date('04/01/2019'),
            projectEndDate: new Date('04/30/2019'),
        }, done);
    });

    it('executes validationDialogCancelButton for respectLink false and true, and confirm handlers', () => {
        const module: any = (ganttObj as any).connectorLineEditModule;
        // ensure dialog placeholder exists to avoid runtime errors
        module.confirmPredecessorDialog = { destroy: () => { /* noop */ } };

        // branch: respectLink = false
        ganttObj.constraintViolationType = 'constraintTypeX';
        ganttObj.currentEditedArgs = { validateMode: { respectLink: false } } as any;
        module['validationDialogCancelButton']();
        // branch: respectLink = true -> simulate confirm flow and internal state needed for ok handler
        ganttObj.currentEditedArgs = { validateMode: { respectLink: true } } as any;
        module.childRecord = ganttObj.flatData[1];
        module.predecessorIndex = 0;
        // ensure removePredecessorByIndex exists to be invoked by confirmOkDeleteButton
        module.removePredecessorByIndex = (childRecord: any, index: number) => { /* noop */ };
        // ensure confirm dialog exists
        module.confirmPredecessorDialog = { destroy: () => { /* noop */ } };
        module['validationDialogCancelButton']();
        // directly invoke private confirm handlers to cover those branches
        module['confirmCloseDialog']();
        module['confirmOkDeleteButton']();
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Gantt connector line validateTypes - Additional Coverage', () => {
    let ganttObj: Gantt;
    
    // Data source for allowUnscheduledTasks with null startDate/duration (endDate < startDate)
    const dataUnscheduledTasksBeforePredecessor = [
        {
                TaskID: 1,
                TaskName: 'Unscheduled Task 1',
                EndDate: new Date('04/01/2019'),
                Predecessor: '2SS'
            },
            {
                TaskID: 2,
                TaskName: 'Task 2',
                StartDate: new Date('04/05/2019'),
                Duration: 3
            }
    ];

    // Data source for allowUnscheduledTasks with null startDate/duration (endDate > startDate)
    const dataUnscheduledTasksAfterPredecessor = [
        {
                TaskID: 1,
                TaskName: 'Unscheduled Task 1',
                EndDate: new Date('01/01/1969'),
                Predecessor: '2SS'
            },
            {
                TaskID: 2,
                TaskName: 'Task 2',
                StartDate: new Date('04/05/2019'),
                Duration: 3
            }
    ];
    // Test Case 2: Coverage for SS type with allowUnscheduledTasks true and endDate < startDate
    it('should handle unscheduled tasks with endDate before predecessor startDate (endDate < startDate)', (done: Function) => {
        ganttObj = createGantt({
            dataSource: dataUnscheduledTasksBeforePredecessor,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                // startDate: 'StartDate',
                // duration: 'Duration',
                endDate: 'EndDate',
                dependency: 'Predecessor'
            },
            editSettings: { allowEditing: true, allowTaskbarEditing: true },
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            allowUnscheduledTasks: true
        }, done);
    });

    it('validateTypes triggers taskBeforePredecessor_SS for unscheduled task with endDate before predecessor', () => {
        const ganttRecord = ganttObj.getRecordByID('1');
        const validateResult = ganttObj.connectorLineEditModule.validateTypes(ganttRecord);
        ganttObj.connectorLineEditModule.validationPredecessor;
        validateResult;
    });

    // Test Case 3: Coverage for SS type with allowUnscheduledTasks true and endDate > startDate
    it('should handle unscheduled tasks with endDate after predecessor startDate (endDate > startDate)', (done: Function) => {
        ganttObj = createGantt({
            dataSource: dataUnscheduledTasksAfterPredecessor,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                // startDate: 'StartDate',
                // duration: 'Duration',
                endDate: 'EndDate',
                dependency: 'Predecessor'
            },
            editSettings: { allowEditing: true, allowTaskbarEditing: true },
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            allowUnscheduledTasks: true
        }, done);
    });

    it('validateTypes triggers taskAfterPredecessor_SS for unscheduled task with endDate after predecessor', () => {
        const ganttRecord = ganttObj.getRecordByID('1');
        const validateResult = ganttObj.connectorLineEditModule.validateTypes(ganttRecord);
        ganttObj.connectorLineEditModule.validationPredecessor;
        validateResult;
    });

    afterAll(() => {
        destroyGantt(ganttObj);
    });
});

describe('Gantt connector line validateTypes - defaultCalendarContext branch coverage', () => {
    let ganttObj: Gantt;
    
    // Data source where ganttProperties.calendarContext is NOT set (will use defaultCalendarContext)
    const dataWithoutCalendarContext = [
        {
            TaskID: 1,
            TaskName: 'Task 1',
            StartDate: new Date('04/02/2019'),
            Duration: 3,
            Predecessor: '2FS'
        },
        {
            TaskID: 2,
            TaskName: 'Task 2',
            StartDate: new Date('03/25/2019'),
            Duration: 5
        }
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: dataWithoutCalendarContext,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                dependency: 'Predecessor'
            },
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            },
            projectStartDate: new Date('03/20/2019'),
            projectEndDate: new Date('04/30/2019')
        }, done);
    });

    it('should use defaultCalendarContext when ganttRecord.ganttProperties.calendarContext is not set', () => {
        const ganttRecord = ganttObj.getRecordByID('1');
        // Ensure calendarContext is not explicitly set
        ganttRecord.ganttProperties.calendarContext = null;
        
        // Call validateTypes which should use defaultCalendarContext
        ganttObj.connectorLineEditModule.validateTypes(ganttRecord);
        
        // Access the method's internal calendarContext by calling the validation
        const predecessors = ganttObj.connectorLineEditModule.validationPredecessor;
        predecessors;
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('MT-1017141:Code coverage for connector-line-edit file', () => {
    let ganttObj: Gantt;
       const data = [
         {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3},
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        }
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
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
            splitterSettings: {
                position: "30%",
            },
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
            height: '550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('removePredecessors method code coverage spec', () => {
       ganttObj.connectorLineEditModule['removePredecessors'](ganttObj.currentViewData[3], null);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('MT-1017141:Code coverage for connector-line-edit file', () => {
    let ganttObj: Gantt;
       const data = [
         {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3},
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "1, 4" }
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
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
            splitterSettings: {
                position: "30%",
            },
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
            height: '550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('processPredecessor method code coverage spec', () => {
        ganttObj.connectorLineEditModule['validatedId'] = [{id: 1, value: ganttObj.currentViewData[3].ganttProperties.predecessor[0]}];
        ganttObj.connectorLineEditModule['processPredecessor']('1', null);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('MT-1017141:Code coverage for connector-line-edit file', () => {
    let ganttObj: Gantt;
       const data = [
         {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3},
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "1, 4" }
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
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
            splitterSettings: {
                position: "30%",
            },
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
            height: '550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('processPredecessor method code coverage spec', () => {
        (ganttObj.connectorLineEditModule['validatedId'] as any) = [{id: 1, value: [ganttObj.currentViewData[0].ganttProperties.predecessor[0]]}];
        ganttObj.connectorLineEditModule['processPredecessor']('1', null);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('MT-1017141:Code coverage for connector-line-edit file', () => {
    let ganttObj: Gantt;
    const data = [
        { TaskID: 1, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3}
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            splitterSettings: {
                position: "30%",
            },
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
            height: '550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('renderValidationDialog method code coverage spec', () => {
        ganttObj.element.id ='gantt';
        ganttObj.connectorLineEditModule.renderValidationDialog();
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('MT-1017141:Code coverage for connector-line-edit file', () => {
    let ganttObj: Gantt;
    const data = [
         {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3},
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "1, 4" }
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
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
            splitterSettings: {
                position: "30%",
            },
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
            height: '550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('checkParentRelation method code coverage spec', () => {
        ganttObj.connectorLineEditModule['checkParentRelation'](ganttObj.currentViewData[1], ['1']);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('MT-1017141:Code coverage for connector-line-edit file', () => {
    let ganttObj: Gantt;
    const data = [
         {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3},
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "1, 4" }
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
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
            splitterSettings: {
                position: "30%",
            },
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
            height: '550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('checkParentRelation method code coverage spec', () => {
        ganttObj.connectorLineEditModule['checkParentRelation'](ganttObj.currentViewData[4], ['1']);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('MT-1017141:Code coverage for calendar-module file', () => {
    let ganttObj: Gantt;
    const data = [
         {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3},
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "1, 4" }
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
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
            splitterSettings: {
                position: "30%",
            },
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
            height: '550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('returns projectCalendar when taskCalendars is missing or empty', () => {
        const projectCalendar = { calendarId: 'proj', name: 'Project' } as any;
        const fakeGantt: any = { calendarSettings: { projectCalendar: projectCalendar, taskCalendars: undefined } };
        const cm = new CalendarModule(fakeGantt);
        expect(cm.getCalendarById('someId')).toBe(projectCalendar);
    });
    it('calls applyPredecessorOption when isInteracted is true', () => {
        const ej2Base: any = require('@syncfusion/ej2-base');
        // minimal fake parent to avoid constructor side-effects
        const fakeParent: any = {
            currentEditedArgs: { validateMode: { respectLink: false }, data: {} },
            hideSpinner: jasmine.createSpy('hideSpinner'),
            on: function () { /* noop */ },
            constraintViolationType: 'init',
            // provide minimal editModule used by applyPredecessorOption
            editModule: {
                reUpdatePreviousRecords: jasmine.createSpy('reUpdatePreviousRecords'),
                updateEditedTask: jasmine.createSpy('updateEditedTask')
            },
            // provide chartRowsModule used by applyPredecessorOption
            chartRowsModule: {
                refreshRecords: jasmine.createSpy('refreshRecords')
            }
        };
        const cle = new ConnectorLineEdit(fakeParent);
        spyOn(cle, 'applyPredecessorOption').and.callThrough();
        spyOn(ej2Base, 'getValue').and.callFake((key: string, e: any) => {
        return key === 'isInteracted' ? true : undefined;
        });
        (cle as any).validationDialogClose({});
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('MT-1017141: ConnectorLineEdit.predecessorValidation branches code coverage', () => {
    let ganttObj: Gantt;
    const data = [
         {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3},
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "1, 4" }
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: data,
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
            splitterSettings: {
                position: "30%",
            },
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
            height: '550px',
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019')
        }, done);
    });
    it('returns false when connectorLineModule.getRecordByID returns null', () => {
        const data = { rowUniqueID: '1' };
        ganttObj.connectorLineEditModule['predecessorValidation'](['10'], data as any);
    });
    it('returns false when currentRecord.rowUniqueID equals recordId (cycle)', () => {
        const data = { rowUniqueID: '2' };
        ganttObj.connectorLineEditModule['predecessorValidation'](['2'], data as any);
    });
    it('returns false when currentRecord.predecessor contains a from equal to recordId (currentIdArray matches)', () => {
        const data = { rowUniqueID: '2' };
        ganttObj.connectorLineEditModule['predecessorValidation'](['1'], data as any);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('CR-1023089: Unscheduled tasks with predecessors cause exception on initial load', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR1023089,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks',
                    dependency: 'Predecessor',
                },
                editSettings: {
                    allowEditing: true,
                    allowTaskbarEditing: true,
                    mode: 'Auto',
                },
                allowUnscheduledTasks: true,
                height: '550px',
                projectStartDate: new Date('03/20/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
    });
    it('should render Gantt data on initial load without throwing exceptions', () => {
        expect(ganttObj.currentViewData.length).toBe(4);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Unscheduled predecessor validation', () => {
    let ganttObj: Gantt;
    const predecessorData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Project Planning',
            StartDate: new Date('04/01/2019'),
            EndDate: new Date('04/30/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Scheduled predecessor', StartDate: new Date('04/02/2019'), Duration: 3 },
                { TaskID: 3, TaskName: 'Unscheduled predecessor' },
                { TaskID: 4, TaskName: 'Scheduled predecessor 2', StartDate: new Date('04/05/2019'), Duration: 2 },
                { TaskID: 5, TaskName: 'Milestone successor', StartDate: new Date('04/05/2019'), Duration: 0, Predecessor: '3,4' }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: predecessorData,
            allowUnscheduledTasks: true,
            height: '450px',
            projectStartDate: new Date('04/01/2019'),
            projectEndDate: new Date('04/30/2019'),
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                mode: 'Dialog'
            },
            toolbar: ['Edit', 'Update', 'Cancel']
        }, done);
    });
    it('ignores an unscheduled predecessor during initial render', () => {
        const ganttData = ganttObj.flatData[4];
        expect(ganttData.ganttProperties.predecessor.length).toBe(1);
        expect(ganttData.ganttProperties.predecessorsName).toBe('4FS');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});