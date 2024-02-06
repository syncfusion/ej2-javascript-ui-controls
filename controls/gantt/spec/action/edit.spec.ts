/**
 * Gantt taskbaredit spec
 */
import { Gantt, Edit, Selection, IGanttData, Filter, IActionBeginEventArgs, ContextMenuClickEventArgs, CriticalPath, Toolbar, ColumnMenu } from '../../src/index';
import { cellEditData, resourcesData, projectData,normalResourceData, resourceCollection, stringTaskId, StringMultiTaskbarData, StringMultiResources, StringResourceData, StringResourceCollection, StringResourceSelefReferenceData, StringCellEditData, StringResourcesData, StringprojectData1, StringProjectResources, resourceviewData,crData1, exportData,editingData,editingResources } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { getValue } from '@syncfusion/ej2-base';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
Gantt.Inject(Edit, Selection, Filter);
describe('Gantt Edit support', () => {
    describe('Gantt Edit action', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: cellEditData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        notes: 'Notes',
                        baselineStartDate: 'BaselineStartDate',
                        baselineEndDate: 'BaselineEndDate',
                        resourceInfo: 'Resource',
                        dependency: 'Predecessor',
                        indicators: 'Indicators',
                        child: 'subtasks',
                        cssClass: 'cssClass',
                    },
                    resourceIDMapping: 'resourceId',
                    resourceNameMapping: 'resourceName',
                    resources: resourcesData,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                    renderBaseline: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                    },
                    editDialogFields: [
                        { type: 'General' },
                        { type: 'Dependency' },
                        { type: 'Resources' },
                        { type: 'Notes' },
                    ],
                    splitterSettings: {
                        columnIndex: 9
                    },
                    allowSelection: true,
                    allowUnscheduledTasks: true,
                    allowFiltering: true,
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
                        { field: 'Customcol', headerText: 'Custom Column', editType: 'datepickeredit', width: 100 }
                    ],
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Update Record By Id Without Startdate and With Custom Column', () => {
            let data: object[] = [{TaskID: 4, TaskName: 'Update Record1', EndDate: new Date('04/02/2019'), Duration: 0, Predecessor: "2", Notes: 'Notes 3',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [4], Customcol: new Date('04/07/2019') }];
            ganttObj.editModule.updateRecordByID(data[0]);
            expect(getValue('TaskName', ganttObj.flatData[3])).toBe('Update Record1');
        });

        it('Update Record By ID with cssClass', () => {
            let data: object[] = [{cssClass: 'ganttClosed',TaskID: 3,TaskName: 'Changed task',StartDate: new Date('04/02/2019'),Duration: 4,Progress: 50}]
            ganttObj.editModule.updateRecordByID(data[0]);
            expect(getValue('cssClass',ganttObj.flatData[2])).toBe('ganttClosed')
        })

        it('Update Record By Id Without Enddate', () => {
            let data: object[] = [{ TaskID: 4, TaskName: 'Update Record2', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "2FF", Notes: 'Notes 3',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [4]  }];
            ganttObj.editModule.updateRecordByID(data[0]);
            expect(getValue('TaskName', ganttObj.flatData[3])).toBe('Update Record2');
        });
        
        it('Update Record By Id Without Startdate,Enddate,Predecessor and with duration value', () => {
            let data: object[] = [{ TaskID: 4, TaskName: 'Milestone Task', Duration: 1, Notes: 'Notes 3',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [4]}];
            ganttObj.updateRecordByID(data[0]);
            expect(getValue('TaskName', ganttObj.flatData[3])).toBe('Milestone Task');
            expect(getValue('Duration', ganttObj.flatData[3])).toBe(1);
        });

        it('Update Record of parent data', () => {
            let data: object[] = [{ TaskID: 1, TaskName: 'Updated Parent Task', Duration: 2}];
            ganttObj.updateRecordByID(data[0]);
            expect(getValue('TaskName', ganttObj.flatData[0])).toBe('Updated Parent Task');
        });

        it('Validate Update Values Method with false argument and 3 field', () => {
            let ganttdata: IGanttData = ganttObj.getRecordByID('3');
            let data: object[] = [{ TaskID: 3, TaskName: 'Updated Record1', StartDate: new Date('04/02/2019'), EndDate: new Date('04/02/2019'), Duration: 3, Progress: 30, Notes: 'Notes 2',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [3, 1] }];
            ganttObj.editModule.validateUpdateValues(data[0],ganttdata,false);
            expect(getValue('TaskName', ganttObj.flatData[2])).toBe('Updated Record1');
        });

        it('Validate Update Values Method with false argument and 2 field of startdate and duration', () => {
            let ganttdata: IGanttData = ganttObj.getRecordByID('3');
            let data: object[] = [{ TaskID: 3, TaskName: 'Updated Record2', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30, Notes: 'Notes 2',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [3, 1] }];
            ganttObj.editModule.validateUpdateValues(data[0],ganttdata,false);
            expect(getValue('TaskName', ganttObj.flatData[2])).toBe('Updated Record2');
        });

        it('Validate Update Values Method with false argument and 2 field of startdate and enddate', () => {
            let ganttdata: IGanttData = ganttObj.getRecordByID('3');
            let data: object[] = [{ TaskID: 3, TaskName: 'Updated Record3', StartDate: new Date('04/02/2019'), EndDate: new Date('04/02/2019'), Progress: 30, Notes: 'Notes 2',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [3, 1] }];
            ganttObj.editModule.validateUpdateValues(data[0],ganttdata,false);
            expect(getValue('TaskName', ganttObj.flatData[2])).toBe('Updated Record3');
        });

        it('Validate Update Values Method with false argument and 2 field of duration and enddate', () => {
            let ganttdata: IGanttData = ganttObj.getRecordByID('3');
            let data: object[] = [{ TaskID: 3, TaskName: 'Updated Record4', EndDate: new Date('04/02/2019'), Duration: 3, Progress: 30, Notes: 'Notes 2',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [3, 1] }];
            ganttObj.editModule.validateUpdateValues(data[0],ganttdata,false);
            expect(getValue('TaskName', ganttObj.flatData[2])).toBe('Updated Record4');
        });

        it('Validate Update Values Method with false argument and 1 field', () => {
            let ganttdata: IGanttData = ganttObj.getRecordByID('3');
            let data: object[] = [{ TaskID: 3, TaskName: 'Updated Record5', Duration: 3, Progress: 30, Notes: 'Notes 2',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [3, 1] }];
            ganttObj.editModule.validateUpdateValues(data[0],ganttdata,false);
            expect(getValue('TaskName', ganttObj.flatData[2])).toBe('Updated Record5');
        });

        it('Update record using updaterecordbyindex method', () => {
            let data: object[] =[{ TaskID: 3, TaskName: 'UpdateRecordByIndex', StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30, Notes: 'Notes 2',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [3, 1] }];
            ganttObj.updateRecordByIndex(2,data[0]);
            expect(getValue('TaskName', ganttObj.flatData[2])).toBe('UpdateRecordByIndex');
        });

        it('Add record Without rowposition and empty data using public method', () => {
            let data: object[] = null;
            ganttObj.editModule.addRecord(data);
            expect(ganttObj.flatData.length).toBe(8);
        });

        it('Add record to bottom position', () => {
            let data: object[] = [{ TaskID: 9, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Bottom');
            expect(ganttObj.flatData.length).toBe(9);
            expect(ganttObj.dataSource[5].TaskName).toBe('New Task');
        });

        it('Add record to above position', () => {
            let data: object[] = [{ TaskID: 10, TaskName: 'New Task', Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Above', 5);
            expect(ganttObj.flatData.length).toBe(10);
            expect(ganttObj.dataSource[2].TaskName).toBe('New Task');
        });

        it('Add record to below position', () => {
            let data: object[] = [{ TaskID: 11, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Predecessor: "2", Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below',6);
            expect(ganttObj.flatData.length).toBe(11);
            expect(ganttObj.dataSource[4].TaskName).toBe('New Task');
        });

        it('Add record as first child record', () => {
            let data: object[] = [{ TaskID: 12, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Child',7);
            expect(ganttObj.flatData.length).toBe(12);
            expect(ganttObj.dataSource[4].subtasks[0].TaskName).toBe('New Task');
        });

        it('Add record as child of child record', () => {
            let data: object[] = [{ TaskID: 13, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Child',8);
            expect(ganttObj.flatData.length).toBe(13);
            expect(ganttObj.dataSource[4].subtasks[0].subtasks.length).toBe(1);
        });

        it('Add record as second child', () => {
            let data: object[] = [{ TaskID: 14, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Child',7);
            expect(ganttObj.flatData.length).toBe(14);
            expect(ganttObj.dataSource[4].subtasks.length).toBe(2);
        });

        it('Add record below to child record', () => {
            ganttObj.allowUnscheduledTasks = false;
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 15, TaskName: 'New Task', Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0], 'Below', 2);
            expect(ganttObj.flatData.length).toBe(15);
            expect(ganttObj.dataSource[1].subtasks[1].TaskName).toBe('New Task');
        });       

        it('Add record above to child record', () => {
            ganttObj.allowUnscheduledTasks = false;
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 21, TaskName: 'Child Added Above', Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Above',2);
            expect(ganttObj.flatData.length).toBe(16);
            expect(ganttObj.dataSource[1].subtasks[0].TaskName).toBe('Child Added Above');
        });

        it('Add record below to parent record', () => {
            ganttObj.allowUnscheduledTasks = false;
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 16, TaskName: 'New Task', Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below',1);
            expect(ganttObj.flatData.length).toBe(17);
        });

        it('Add record with already exiting taskid', () => {
            let data: object[] = [{ TaskID: 16, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0]);
            expect(ganttObj.flatData.length).toBe(18);
        });

        it('Add record with selected row', () => {
            ganttObj.selectionSettings.mode = 'Both';
            ganttObj.dataBind();
            ganttObj.selectionModule.selectRow(3);
            let data: object[] = [{ TaskID: 18, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0]);
            expect(ganttObj.flatData.length).toBe(19);
        });

        it('Add record with selected cell', () => {
            ganttObj.selectionSettings.mode = 'Cell';
            ganttObj.dataBind();
            ganttObj.selectCell({ cellIndex: 1, rowIndex: 3 });
            let data: object[] = [{ TaskID: 19, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0]);
            expect(ganttObj.flatData.length).toBe(20);
        });

        it('Add record with selection module false value', () => {
            ganttObj.allowSelection = false;
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 20, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below');
            expect(ganttObj.flatData.length).toBe(21);
        });

        it('Add record with Editing module false value', () => {
            ganttObj.editSettings.allowAdding = false;
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 20, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below');
            expect(ganttObj.flatData.length).toBe(21);
        });

        it('Add record without Editing module', () => {
            ganttObj.editModule.destroy();
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 20, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below');
            expect(ganttObj.flatData.length).toBe(21);
        });

        it('Search record without Filter module', () => {
            ganttObj.filterModule.destroy();
            ganttObj.dataBind();
            ganttObj.search("child");
            expect(ganttObj.flatData.length).toBe(21);
        });

        it('Changing height', () => {
            ganttObj.height = "auto";
            expect(ganttObj.height).toBe("auto");
        });

        it('Datasource based on indicators', () => {
            var datasource: object[] = [
                {
                    TaskID: 1,
                    TaskName: 'Parent Task',                
                    subtasks: [
                        { TaskID: 2, TaskName: 'Child Task 1',
                            'Indicators': [
                                {
                                    'date': '10/29/2017',
                                    'iconCls': 'fas fa-cat',
                                    'name': 'Custom String',
                                    'tooltip': 'Follow up'
                                }
                            ] 
                        },
                        { TaskID: 3, TaskName: 'Child Task 2' }
                    ]
                }
            ];
            ganttObj.dataSource = datasource;
            ganttObj.projectStartDate = null;
            ganttObj.projectEndDate = null;
            ganttObj.dataBind();
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe('10/29/2017');
        });

        it('Datasource with P-P-unscheduled child', () => {
            var datasource: object[] = [
                {
                    TaskID: 1,
                    TaskName: 'Parent Task',                
                    subtasks: [
                        { TaskID: 2, TaskName: 'Child Task 1',
                            subtasks: [
                                { TaskID: 3, TaskName: 'Child Task 2', StartDate: new Date('04/02/2019') }
                            ]
                        }
                    ]
                }
            ];
            ganttObj.dataSource = datasource;
            ganttObj.dataBind();
            expect(ganttObj.flatData[0].ganttProperties.progress).toBe(0);
        });

        it('Datasource dates with empty string', () => {
            var datasource: object[] = [
                {
                    TaskID: 1,
                    TaskName: 'Parent Task', StartDate:"", EndDate: "",
                    subtasks: [
                        { TaskID: 2, TaskName: 'Child Task 1', EndDate: "",
                            subtasks: [
                                { TaskID: 3, TaskName: 'Child Task 2', StartDate:"" }
                            ]
                        }
                    ]
                }
            ];
            ganttObj.dataSource = datasource;
            ganttObj.dataBind();
            expect(ganttObj.flatData.length).toBe(3);
        });
        it('Rendering Parent milestone on load time', () => {
            var datasource: object[] = [
                {
                    TaskID: 1,
                    TaskName: 'Parent Task',                
                    subtasks: [
                        { TaskID: 2, TaskName: 'Child Task 1', StartDate: new Date('04/02/2019'), Duration: 0},
                        { TaskID: 3, TaskName: 'Child Task 2', StartDate: new Date('04/02/2019'), Duration: 0 }
                    ]
                }
            ];
            ganttObj.dataSource = datasource;
            ganttObj.dataBind();
            expect(ganttObj.flatData[0].ganttProperties.isMilestone).toBe(true);
        });
        it('Rendering Parent milestone on editing', () => {
            var datasource: object[] = [
                {
                    TaskID: 1,
                    TaskName: 'Parent Task',                
                    subtasks: [
                        { TaskID: 2, TaskName: 'Child Task 1', StartDate: new Date('04/02/2019'), Duration: 1}
                    ]
                }
            ];
            ganttObj.dataSource = datasource;
            ganttObj.dataBind();
            expect(ganttObj.flatData[0].ganttProperties.isMilestone).toBe(false);
            let data: object[] = [ { TaskID: 2, TaskName: 'Child Task 1', StartDate: new Date('04/02/2019'), Duration: 0}];
            ganttObj.editModule.updateRecordByID(data[0]);
            expect(ganttObj.flatData[0].ganttProperties.isMilestone).toBe(true);
        });
    });

    describe('Adding record with empty dataSource', () => {
        let ganttObj_tree: Gantt;
        beforeAll((done: Function) => {
            ganttObj_tree = createGantt(
                {
                    dataSource: [],
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
                        allowAdding: true
                    },
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Adding record with empty dataSource', () => {
            let data: object[] = [ { TaskID: 2, TaskName: 'Child Task 1', StartDate: new Date('04/02/2019'), Duration: 2}];
            ganttObj_tree.addRecord(data[0]);
            expect(ganttObj_tree.currentViewData.length).toBe(1);
            expect(ganttObj_tree.treeGrid.flatData.length).toBe(1);
            expect(ganttObj_tree.flatData.length).toBe(1);
        });
        afterAll(() => {
            destroyGantt(ganttObj_tree);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });

    describe('Empty Gantt', () => {
        let ganttObj_tree: Gantt;
        beforeAll((done: Function) => {
            ganttObj_tree = createGantt(
                {
                    dataSource: [],
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                        baselineStartDate: 'BaselineStartDate',
                        baselineEndDate: 'BaselineEndDate',
                    },
                    editSettings: {
                        allowAdding: true
                    },
                    renderBaseline: true,
                    dayWorkingTime : [{ from: 0, to: 24 }],
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019')
                }, done);
        });
        it('Add data with same start and end date', () => {
            let data: object[] = [ { TaskID: 1, TaskName: 'Child Task 1',BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/02/2019'), StartDate: new Date('04/02/2019'), Duration: 1}];
            ganttObj_tree.addRecord(data[0]);
            expect(ganttObj_tree.currentViewData[0].ganttProperties['baselineWidth']).toBe(0);
        });
        afterAll(() => {
            destroyGantt(ganttObj_tree);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });

    describe('Empty Gantt', () => {
        let ganttObj_tree: Gantt;
        beforeAll((done: Function) => {
            ganttObj_tree = createGantt(
                {
                    dataSource: [],
                    taskFields: {
                        id: 'taskID',
                        name: 'taskName',
                        startDate: 'startDate',
                        endDate: 'endDate',
                        duration: 'duration',
                        progress: 'progress',
                        dependency: 'predecessor',
                        baselineStartDate: 'baselineStartDate',
                        baselineEndDate: 'baselineEndDate',
                    },
                    toolbar: ['Add', 'Edit', 'Delete'],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true,
                      },
                    renderBaseline: true,
                    timezone: 'UTC',
                    height: '450px',
                }, done);
        });
        it('UTC TimeZone', () => {
            let data: object[] = [{ taskID: 2, taskName: 'Task 2', startDate: '2022-05-17T08:00:00Z', endDate: '2022-05-17T08:00:00Z', duration: 0,
                                    baselineStartDate: '2022-05-17T08:00:00Z', baselineEndDate: '2022-05-17T08:00:00Z' }];
            ganttObj_tree.addRecord(data[0]);
            expect(ganttObj_tree.getFormatedDate(ganttObj_tree.currentViewData[0].ganttProperties.baselineEndDate, 'MM/dd/yyyy')).toBe('05/17/2022');
            ganttObj_tree.dataSource = [];
            ganttObj_tree.dataBind();
        });
        it('baseline End date Time', () => {
            let data: object[] = [{ taskID: 1, taskName: 'Task 1', startDate: new Date('04/02/2019'), endDate: new Date('04/02/2019'), duration: 0,
                                    baselineStartDate: new Date('04/02/2019'), baselineEndDate: new Date('04/02/2019') }];
            ganttObj_tree.addRecord(data[0]);
            let baselineEndDateTime = ganttObj_tree.currentViewData[0].ganttProperties.baselineEndDate.getHours();
            expect(baselineEndDateTime).toBe(8);
        });

        afterAll(() => {
            destroyGantt(ganttObj_tree);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });

    describe('Adding multiple tasks', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                        segments: "Segments"
                    },
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    allowSelection: true,
                    enableContextMenu: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        it('Adding multiple tasks with segments', () => {
            let data: object[] = [ 
                { TaskID: 40,
                TaskName: 'Identify Site location',
                StartDate: new Date('04/07/2019'),
                Duration: 3,
                Progress: 50
            },
            { TaskID: 41,
                TaskName: 'Site location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 60,
                Segments: [
                    { StartDate: new Date("04/02/2019"), Duration: 2 },
                    { StartDate: new Date("04/04/2019"), Duration: 2 }
                ]
            },
            { TaskID: 42,
                TaskName: 'location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Segments: [
                    { StartDate: new Date("04/02/2019"), Duration: 2 },
                    { StartDate: new Date("04/04/2019"), Duration: 2 }
                ]
            },
            { TaskID: 43,
                TaskName: 'New task',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 80
            }];
            ganttObj.editModule.addRecord(data,'Child',3);
        });

        it('Adding multiple tasks with Unscheduled Task and without Predecessor', () => {
            ganttObj.enableContextMenu= false,
            ganttObj.allowUnscheduledTasks= true;
            ganttObj.dataBind();
            let data: object[] = [ 
                { TaskID: 44,
                TaskName: 'Identify Site location',
                Duration: 3,
                Progress: 50,
                },
                { TaskID: 45,
                TaskName: 'Site location',
                Duration: 3,
                Progress: 60,
                },
                { TaskID: 46,
                TaskName: 'location',
                Duration: 3,
                Progress: 60
                },
                { TaskID: 47,
                TaskName: 'New task',
                Duration: 3,
                Progress: 80,
                }];
            ganttObj.editModule.addRecord(data,'Child',3);
        });

        it('Adding multiple tasks with Unscheduled Tasks and with Predecessor', () => {
            ganttObj.allowUnscheduledTasks= true;
            ganttObj.dataBind();
            let data: object[] = [ 
                { TaskID: 48,
                TaskName: 'Identify Site location',
                Duration: 3,
                Progress: 50,
                },
                { TaskID: 49,
                TaskName: 'Site location',
                Duration: 3,
                Progress: 60,
                Predecessor: "48ss"
                },
                { TaskID: 50,
                TaskName: 'location',
                Duration: 3,
                Progress: 60
                },
                { TaskID: 51,
                TaskName: 'New task',
                Duration: 3,
                Progress: 80,
                Predecessor: "50ss"
                }];
            ganttObj.editModule.addRecord(data,'Child',3);
        });

        it('Adding multiple tasks during beforeAdd ', () => {
            let data: object[] = [
                {TaskID: 52,
                TaskName: 'Identify Site location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 50
                },
                {TaskID: 53,
                TaskName: 'Site location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 60
                },
                {TaskID: 54,
                TaskName: 'location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 70
                },
                {TaskID: 55,
                TaskName: 'New Task',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 80
                }];
            ganttObj.editModule.addRecord(data,'Child',3);
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeAdd") {
                    expect(args.data.length).toBe(4);
                }
            };
        });

        it('Adding multiple tasks during actionBegin', () => {
            let data: object[] = [
                {TaskID: 56,
                TaskName: 'Identify Site location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 50
                },
                {TaskID: 57,
                TaskName: 'Site location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 60
                },
                {TaskID: 58,
                TaskName: 'location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 70
                },
                {TaskID: 59,
                TaskName: 'New Task',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 80
                }];
            ganttObj.editModule.addRecord(data,'Child',3);
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "actionBegin") {
                    expect(args.data.length).toBe(4);
                }
            };
        });

        it('Adding multiple tasks during actionComplete', () => {
            let data: object[] = [
                {TaskID: 60,
                TaskName: 'Identify Site location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 50
                },
                {TaskID: 61,
                TaskName: 'Site location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 60
                },
                {TaskID: 62,
                TaskName: 'location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 70
                },
                {TaskID: 63,
                TaskName: 'New Task',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 80
                }];
            ganttObj.editModule.addRecord(data,'Child',3);
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "actionComplete") {
                    expect(args.data.length).toBe(4);
                }
            };
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
    });
    describe('Update resource units using method', () => {
        let ganttObj_tree: Gantt;
        beforeAll((done: Function) => {
            ganttObj_tree = createGantt(
                {
                    dataSource: normalResourceData,
                    resources: resourceCollection,
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
                        { field: 'work', headerText: 'Work' },
                        { field: 'Progress' },
                        { field: 'resourceGroup', headerText: 'Group' },
                        { field: 'StartDate' },
                        { field: 'Duration' },
                    ],
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
                    actionComplete(args: any) {
                        if (args.requestType == 'save') {
                            expect(args.data.Duration).toBe(1.67);
                        }
                    },
                    projectStartDate: new Date('03/28/2019'),
                    projectEndDate: new Date('05/18/2019')
                }, done);
        });
        it('updating resource units', () => {
            let data: object = {
                TaskID: 2,
                TaskName: 'Updated by index value',
                resources: [
                    {
                        resourceId: 1,
                        resourceName: 'Martin Tamer',
                        resourceUnit: 75,
                    },
                ],
            };
            ganttObj_tree.updateRecordByID(data);
        });
        afterAll(() => {
            destroyGantt(ganttObj_tree);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 2000);
        });
    });
    describe('TaskID as string', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: stringTaskId,
                allowSelection: true,
                allowResizing: true,
                allowSorting: true,
                enableContextMenu: true,
                enableCriticalPath: true,
                allowRowDragAndDrop: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    endDate: 'EndDate'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
            }, done);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        it('Predecessor validation', () => {
            expect(ganttObj.flatData[3].ganttProperties.predecessorsName).toBe("b2 FS");
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe("e5 SS");
            expect(ganttObj.flatData[8].ganttProperties.predecessorsName).toBe("e5 FF");
        });
        it('Remove Predecessor', () => {
            ganttObj.dataBind();
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe('e5 SS');
            ganttObj.removePredecessor((ganttObj.flatData[7].ganttProperties.taskId));
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe("");
        });
        it('Add Predecessor', () => {
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe("");
            ganttObj.addPredecessor((ganttObj.flatData[7].ganttProperties.taskId), 'e5 SS');
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe('e5 SS');
        });
        it('Update Predecessor', () => {
            ganttObj.dataBind();
            ganttObj.updatePredecessor((ganttObj.flatData[7].ganttProperties.taskId), 'e5 FS');
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe('e5 FS');
        });
        it('Rendering critical path ', () => {
            expect(ganttObj.flatData[1].isCritical).toBe(true);
            expect(ganttObj.flatData[2].isCritical).toBe(false);
            expect(ganttObj.flatData[7].isCritical).toBe(true);
            expect(ganttObj.flatData[9].isCritical).toBe(true);
        });
        it('Right Resizing critical path', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 1244, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Deleting Predecessor', () => {
            ganttObj.dataBind();
            ganttObj.removePredecessor((ganttObj.flatData[3].ganttProperties.taskId));
            expect(ganttObj.flatData[3].ganttProperties.predecessorsName).toBe("");
            expect(ganttObj.flatData[1].ganttProperties.isCritical).toBe(false);
        });
        it('adding record below', () => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            ganttObj.selectionModule.selectRow(2);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Below' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData.length).toBe(11);
        });
        it('Add record - Above', () => {
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Above' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData.length).toBe(12);
        });
        it('To Task', () => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            ganttObj.selectionModule.selectRow(1);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_ToTask' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[1].ganttProperties.isMilestone).toBeFalsy;
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(1);
        });
        it('To Milestone', () => {
            ganttObj.selectionModule.selectRow(1);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData[1].ganttProperties.isMilestone).toBeTruthy;
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(0);
        });
        it('Adding Milestone', () => {
            let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2)') as HTMLElement;
            triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
            ganttObj.selectionModule.selectRow(1);
            let e: ContextMenuClickEventArgs = {
                item: { id: ganttObj.element.id + '_contextMenu_Milestone' },
                element: null,
            };
            (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
            expect(ganttObj.currentViewData.length).toBe(13);
        });
        it('Viewing task Information', () => {
            ganttObj.selectionModule.selectRow(1);
            ganttObj.contextMenuClick = function (args: ContextMenuClickEventArgs) {
                expect(args.item.text).toEqual('Task Information');
            }
            ganttObj.dataBind();
            let taskInfo: HTMLElement = document.getElementById(ganttObj.element.id + '_contextMenu_TaskInformation');
            triggerMouseEvent(taskInfo, 'click');
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
        });
        it('Schedule validation- endDate', () => {
            ganttObj.openEditDialog("b2");
            ganttObj.dataBind();
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            ED.value = new Date('04/09/2019');
            ED.dataBind();
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            expect(textObj.value).toBe('4 days');
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
        });
        it('Schedule validation- duration', () => {
            ganttObj.openEditDialog("b2");
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEditDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.dataBind();
            let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
            if (durationField) {
                let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                textObj.value = '5 days';
                textObj.dataBind();
                let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
                expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
                let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
                expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/10/2019');
                let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                triggerMouseEvent(cancelRecord, 'click');
            }
        });
        it('Record update with duration', () => {
            ganttObj.openEditDialog("b2");
            ganttObj.dataBind();
            let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
            if (durationField) {
                let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                textObj.value = '5 days';
                textObj.dataBind();
                let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
                expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
                let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
                expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/10/2019');
                let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
            }
        });
    });
    describe('taskbar resize for diff taskmode', () => {
        Gantt.Inject(CriticalPath);
        let ganttObj: Gantt;
        let taskModeData: Object[] = [
            {
                'TaskID': "a1",
                'TaskName': 'Parent Task 1',
                'StartDate': new Date('02/27/2017'),
                'EndDate': new Date('03/03/2017'),
                'Progress': '40',
                'isManual': true,
                'Children': [
                    { 'TaskID': "b2", 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                        'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                    { 'TaskID': "c3", 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                        'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                    { 'TaskID': "d4", 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                        'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
                ]
            },
            {
                'TaskID': "e5",
                'TaskName': 'Parent Task 2',
                'StartDate': new Date('03/05/2017'),
                'EndDate': new Date('03/09/2017'),
                'Progress': '40',
                'isManual': true,
                'Children': [
                    { 'TaskID': "f6", 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                        'EndDate': new Date('03/09/2017'), 'Progress': '40' },
                    { 'TaskID': "g7", 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                        'EndDate': new Date('03/09/2017'), 'Progress': '40','Predecessor': 'h8 FS'},
                    { 'TaskID': "h8", 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017',),
                        'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true,'Predecessor': 'i9 FF' },
                    { 'TaskID': "i9", 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                        'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
                ]
            },
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: taskModeData,
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
                taskMode : 'Manual',
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],         
                enableCriticalPath: true,
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
                allowFiltering: true,
                columns: [
                    { field: 'TaskID', visible: true},
                    {field: 'TaskName'},
                    { field: 'isManual'},
                    {field: 'StartDate'},
                    {field: 'Duration'},
                    {field: 'Progress'}
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: '${Progress}%'
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),
        
            }, done);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('Custom taskmode', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(false);
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 420, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });
    describe('resource view with predecessor', () => {
        Gantt.Inject(CriticalPath);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: StringMultiTaskbarData,
                resources: StringMultiResources,
                viewType: 'ResourceView',
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
                enableCriticalPath: true,
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
            destroyGantt(ganttObj);
        });
        it('Initial rendering critical path for resource view', () => {
            expect(ganttObj.flatData[7].isCritical).toBe(true);
            expect(ganttObj.flatData[4].isCritical).toBe(false);
        });
    });
    describe('Resource Normal view', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: StringResourceData,
                resources: StringResourceCollection,
                viewType: 'ResourceView',
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
                showOverAllocation: true,
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
            ganttObj.openAddDialog();
            let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            resourceTab.selectedItem = 2;
        });
        it('Add resources using add dialog', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEditDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    expect(ganttObj.currentViewData[0].childRecords.length).toBe(3);
                }
            };
            ganttObj.dataBind();
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
        });
        it('Adding task under unassigned task', () => {
            ganttObj.dataBind();
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
            expect(ganttObj.currentViewData[8].childRecords.length).toBe(1)
        });
        it('Editing task name', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.dataBind();
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[3].ganttProperties.taskName).toBe('TaskName updated');
            expect(ganttObj.currentViewData[7].ganttProperties.taskName).toBe('TaskName updated');
        });
        it('Editing resource column', () => {
            ganttObj.dataBind();
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            let resource: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
            triggerMouseEvent(resource, 'dblclick');
            let ddlElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolResource') as HTMLElement;
            if (ddlElement) {
                let input: any = ddlElement.ej2_instances[0];
                input.value = [1];
                input.dataBind();
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
                //checking work values for task after adding resource
                expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe('Resource 1');
                expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['unit']).toBe(100);
                expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(4);
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/17/2019');
                expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(32);
            }
        });
    });
    describe('OverAllocation container', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: StringMultiTaskbarData,
                resources: StringMultiResources,
                enableMultiTaskbar: true,
                viewType: 'ResourceView',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    dependency: 'Predecessor',
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
        it('Property binding for showOverAllocation', () => {
            ganttObj.showOverAllocation = true;
            expect(ganttObj.showOverAllocation).toEqual(true);
        });
        it('taskbar resizing - editing cancel', () => {
            expect(ganttObj.currentViewData[4].ganttProperties.workTimelineRanges.length).toBe(2);
            ganttObj.taskbarEditing = (args: any) => {
                expect(args.taskBarEditAction).toBe('ChildDrag');
                args.cancel = true;
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: any) => {
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[5].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/01/2019');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(6) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('taskbar resizing cancel - record in collapsed state', () => {
            ganttObj.taskbarEditing = (args: any) => {
                expect(args.taskBarEditAction).toBe('ChildDrag');
                args.cancel = true;
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: any) => {

                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('03/29/2019');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr > td > div.e-collapse-parent > div:nth-child(1)') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('taskbar drag action - parent record in collapsed state', () => {
            ganttObj.taskbarEditing = (args: any) => {
                expect(args.taskBarEditAction).toBe('ChildDrag');
                args.cancel = false;
            };
            ganttObj.dataBind();
            ganttObj.taskbarEdited = (args: any) => {
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/03/2019');
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr > td > div.e-collapse-parent > div:nth-child(1)') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
    });
    describe('Resoure editing using Edit dialog', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: StringMultiTaskbarData,
                resources: StringMultiResources,
                enableMultiTaskbar: true,
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
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
            ganttObj.editModule.dialogModule.openEditDialog(ganttObj.currentViewData[5]);
            let tabElement: HTMLElement = <EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab');
            if (tabElement) {
                let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
                resourceTab.selectedItem = 1;
            }
        });
        it('Adding resource to existing task', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(args.data.ganttProperties.sharedTaskUniqueIds.length).toBe(2);
                    expect(args.data.ganttProperties.resourceInfo.length).toBe(2);
                    expect(ganttObj.currentViewData[0].childRecords.length).toBe(4);
                }
            };
            ganttObj.dataBind();
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
    
        });
    });
    describe('Self reference data', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: StringResourceSelefReferenceData,
                resources: StringMultiResources,
                viewType: 'ResourceView',
                enableMultiTaskbar: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    parentID: 'parentId',
                    duration: 'Duration',
                    progress: 'Progress',
                    resourceInfo: 'resources',
                    expandState: 'isExpand',
                    work: 'work',
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
                    allowTaskbarEditing: true
                },
		taskType: 'FixedWork',
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
            ganttObj.openAddDialog();
            let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            resourceTab.selectedItem = 1;
        });
    
        it('Add resources using add dialog', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEdiaDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    expect(ganttObj.currentViewData[0].childRecords.length).toBe(1);
                    expect(ganttObj.currentViewData[1].parentItem).toBeDefined();
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo.length).toBe(2);
                }
            };
            ganttObj.dataBind();
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
        });
        it('Adding task under unassigned task', () => {
            expect(ganttObj.currentViewData[1].ganttProperties.sharedTaskUniqueIds.length).toBe(2);
            expect(ganttObj.currentViewData[0].childRecords.length).toBe(1);
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
        });
        it('Left resizing the added record', () => {
            expect(ganttObj.flatData[10].childRecords.length).toBe(1);
            expect(ganttObj.flatData[11].parentItem).toBeDefined();
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save' && args.taskBarEditAction === 'LeftResizing') {
                    expect(ganttObj.currentViewData[1].ganttProperties.startDate).toEqual(ganttObj.currentViewData[9].ganttProperties.startDate);
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo.length).toBe(2);
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', -80, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Right resizing the added record', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save' && args.taskBarEditAction === 'RightResizing') {
                    expect(ganttObj.currentViewData[1].ganttProperties.startDate).toEqual(ganttObj.currentViewData[9].ganttProperties.startDate);
                    expect(ganttObj.currentViewData[1].ganttProperties.endDate).toEqual(ganttObj.currentViewData[9].ganttProperties.endDate);
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo.length).toBe(2);
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-right-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', (dragElement.offsetLeft + 100), dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Taskbar drag action', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save' && args.taskBarEditAction === 'ChildDrag') {
                    expect(ganttObj.currentViewData[1].ganttProperties.startDate).toEqual(ganttObj.currentViewData[9].ganttProperties.startDate);
                    expect(ganttObj.currentViewData[1].ganttProperties.endDate).toEqual(ganttObj.currentViewData[9].ganttProperties.endDate);
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo.length).toBe(2);
                }
            };
            ganttObj.dataBind();
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(10) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Editing task name', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.dataBind();
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[9].ganttProperties.taskName).toBe('TaskName updated');       
        });
        it('Deleting the record', () => {
            ganttObj.selectRow(1);
            let deleteRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
            triggerMouseEvent(deleteRecord, 'click');
        });
        it('Adding New task', () => {
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(16);
        });
    });
    describe('Gantt editing action', () => {
        let ganttObj: Gantt;
        let interval: number;
        let preventDefault: Function = new Function();
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: StringCellEditData,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        notes: 'Notes',
                        baselineStartDate: 'BaselineStartDate',
                        baselineEndDate: 'BaselineEndDate',
                        resourceInfo: 'Resource',
                        dependency: 'Predecessor',
                        child: 'subtasks'
                    },
                    resourceIDMapping: 'resourceId',
                    resourceNameMapping: 'resourceName',
                    resources: StringResourcesData,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                    renderBaseline: true,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowNextRowEdit: true
                    },
                    editDialogFields: [
                        { type: 'General' },
                        { type: 'Dependency' },
                        { type: 'Resources' },
                        { type: 'Notes' },
                    ],
                    splitterSettings: {
                        columnIndex: 9
                    },
                    allowUnscheduledTasks: true,
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
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
        it('Editing task name', () => {
            ganttObj.dataBind();
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
        });

        it('Editing start date column', () => {
            ganttObj.dataBind();
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')as any).ej2_instances[0];
            input.value = new Date('04/04/2019');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/4/2019');
        });

        it('Editing end date column', () => {
            ganttObj.dataBind();
            //checking work values for task which have no resource while before enddate editing
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/08/2019');
            expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo).toBe(null);
            expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(0);
            let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(endDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate')as any).ej2_instances[0];
            input.value = new Date('04/10/2019');
            input.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            //checking work values for task which have no resource while after enddate editing
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(5);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/10/2019');
            expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo).toBe(null);
            expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(0);
        });
        it('Editing duration column', () => {
            ganttObj.dataBind();
            //checking work values for task which have no resource while before duration editing
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(5);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/10/2019');
            expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo).toBe(null);
            expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(0);
            let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(5)') as HTMLElement;
            triggerMouseEvent(duration, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
            input.value = '4 days';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            //checking work values for task which have no resource while after duration editing
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(4);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/09/2019');
            expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo).toBe(null);
            expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(0);
        });
        it('Editing predecesssor column', (done: Function) => {
            ganttObj.dataBind();
            let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = 'c3+5';
            let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe('c3 FS+5 days');
            done();
        });
        it('Editing progress column', () => {
              ganttObj.dataBind();
              let progress: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(7)') as HTMLElement;
              triggerMouseEvent(progress, 'dblclick');
              let input = (<HTMLInputElement>document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolProgress') as any).ej2_instances[0];
              input.value = '40';
              input.dataBind();
              let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
              triggerMouseEvent(record, 'click');
              expect(ganttObj.currentViewData[1].ganttProperties.progress).toBe(40);
         });
        it('Editing baseline start date column', () => {
            ganttObj.dataBind();
            let baselineStartDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(8)') as HTMLElement;
            triggerMouseEvent(baselineStartDate, 'dblclick');
            let dateElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolBaselineStartDate') as HTMLElement;
            if (dateElement) {
                let input: any = dateElement.ej2_instances[0];
                input.value = new Date('04/04/2019');
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.baselineStartDate, 'M/d/yyyy')).toBe('4/4/2019');
            }
        });
        it('Editing baseline end date column', () => {
            ganttObj.dataBind();
            let baselineEndDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(9)') as HTMLElement;
            triggerMouseEvent(baselineEndDate, 'dblclick');
            let dateElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolBaselineEndDate') as HTMLElement;
            if (dateElement) {
                let input: any = dateElement.ej2_instances[0];
                input.value = new Date('04/09/2019');
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.baselineEndDate, 'M/d/yyyy')).toBe('4/9/2019');
            }
        });
        it('Editing resource column', () => {
            ganttObj.dataBind();
            //checking work values for task which have no resource before adding resource
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(4);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/17/2019');
            expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(0);
            expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo).toBe(null);
            let resource: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(10)') as HTMLElement;
            triggerMouseEvent(resource, 'dblclick');
            let ddlElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolResource') as HTMLElement;
            if (ddlElement) {
                let input: any = ddlElement.ej2_instances[0];
                input.value = [1];
                input.dataBind();
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
                //checking work values for task after adding resource
                expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo.length).toBe(1);
                expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['unit']).toBe(100);
                expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(4);
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/17/2019');
                expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(32);
            }
        });
         it('Initial checking resource column without unit mapping', () => {
             ganttObj.dataBind();
             expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3,Resource 1');
             expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
             expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
         });
         it('Unscheduled start task - start date editing', () => {
             ganttObj.dataBind();
              let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(3)') as HTMLElement;
              triggerMouseEvent(startDate, 'dblclick');
              let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
              input.value = new Date('04/03/2019');
              let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
              triggerMouseEvent(element, 'click');
              expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/3/2019');
         });
         it('Unscheduled start task - end date editing', () => {
             ganttObj.dataBind();            
             let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(4)') as HTMLElement;
             triggerMouseEvent(endDate, 'dblclick');
             let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
             input.value = new Date('04/10/2019');
             let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element, 'click');
             expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/10/2019');
         });
         it('Unscheduled start task - duration editing', () => {
             ganttObj.dataBind();
             let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(4)') as HTMLElement;
             triggerMouseEvent(endDate, 'dblclick');
             let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
             input.value = null;
             let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element, 'click');
             let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(5)') as HTMLElement;
             triggerMouseEvent(duration, 'dblclick');
             let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
             durationInput.value = '4 days';
             triggerMouseEvent(element, 'click');
             expect(ganttObj.currentViewData[4].ganttProperties.duration).toBe(4);
         });
        it('Milestone task - duration editing', () => {
            ganttObj.dataBind();
            let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
            triggerMouseEvent(duration, 'dblclick');
            let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
            durationInput.value = '5 days';
            ganttObj.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[3].ganttProperties.duration).toBe(5);
        });
    });
    describe('Gantt filter action', () => {
        Gantt.Inject(Filter, Toolbar, ColumnMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: StringprojectData1,
                    allowFiltering: true,
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor',
                        resourceInfo: 'ResourceId',
                    },
                    resourceNameMapping: 'ResourceName',
                    resourceIDMapping: 'ResourceId',
                    resources: StringProjectResources,
                    splitterSettings: {
                        columnIndex: 7,
                    },
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'ResourceId', headerText: 'Resources' },
                        { field: 'TaskName', headerText: 'Task Name' },
                        { field: 'StartDate', headerText: 'Start Date' },
                        { field: 'Duration', headerText: 'Duration' },
                        { field: 'Predecessor', headerText: 'Predecessor' },
                        { field: 'Progress', headerText: 'Progress' },
                    ],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
                    taskbarHeight: 30
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

        it('Initial Filtering', (done: Function) => {
            ganttObj.filterSettings.columns = [{ field: 'TaskName', matchCase: false, operator: 'startswith', value: 'plan' }];
            ganttObj.dataBind();
            expect(ganttObj.filterSettings.columns.length).toBe(1);
            ganttObj.clearFiltering();
            done();
        });

        it('Clear Filter by public method', () => {
            ganttObj.clearFiltering();
            expect(ganttObj.currentViewData.length).toBe(11);
        });
        it('Predecessor FilterMenu Click Function', () => {
            ganttObj.clearFiltering();
            let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[5] as HTMLElement;
            triggerMouseEvent(filterMenuIcon, 'click');
            expect(ganttObj.element.querySelectorAll('.e-headercell')[5].getElementsByClassName('e-headertext')[0].textContent).toBe('Predecessor');
            let clearButton: HTMLElement = document.body.querySelector('.e-flmenu-cancelbtn') as HTMLElement;
            triggerMouseEvent(clearButton, 'click');
        });
    });
});
describe('check datasource  without passing position', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
    dataSource:projectData,
    allowSorting: true,
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency:'Predecessor',
        child: 'subtasks'
    },

    editSettings: {
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: false,
        allowAdding:true
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
    projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('datasource record length', () => {
        ganttObj.addRecord()
  expect((ganttObj.dataSource as any).length).toBe(2);
        
    });
    it('delete and add record',()=>{
        ganttObj.addRecord();
        ganttObj.addRecord();
        ganttObj.addRecord();
        ganttObj.deleteRecord(42);
        ganttObj.deleteRecord(43);
        ganttObj.addRecord();
        expect(parseInt(ganttObj.currentViewData[0].ganttProperties.taskId)).toBe(46);
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);
        
    });
});
describe('add data without resource',() =>{
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourceviewData,
                taskFields: {
                    id: 'oppgaveId',
                    name: 'oppgaveNavn',
                    startDate: 'fraDato',
                    endDate: 'tilDato',
                    duration: 'varighet',
                    resourceInfo: 'resources',
                },
                resourceFields:{
                    id: 'brukerId',
                    name: 'navn',
                },
                treeColumnIndex:1,
                viewType:'ResourceView',
                editSettings: {
                  allowAdding: true,
                  allowEditing: true,
                  allowDeleting: true,
                  allowTaskbarEditing: true,
                  showDeleteConfirmDialog: true,
                },
                splitterSettings:{
                    columnIndex: 2,
                  },
                gridLines: "Both",

                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'oppgaveNavn',
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/01/2023'),
                projectEndDate: new Date('01/01/2024'), 
                toolbar: [ 'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ZoomIn',
                'ZoomOut',
                'ZoomToFit',],
                columns: [
                    { field: 'oppgaveId', visible: false },
                    { field: 'oppgaveNavn', headerText: 'Name', width: 250 },
                    { field: 'fraDato' },
                    { field: 'tilDato' },
                    { field: 'varighet' },
                  ],
            }, done);
            beforeEach((done: Function) => {
                setTimeout(done, 500);
            });
            afterAll(() => {
                if (ganttObj) {
                    destroyGantt(ganttObj);
                }
            });
            it('add data without resource', () => {
                ganttObj.openAddDialog();
                let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
                let treegrid: any =(<EJ2Instance>document.getElementsByClassName('e-gantt')[0]).ej2_instances[0];
                expect(treegrid.dataSource.length).toBe(1);
            });
            it('When we click load button without child shows error',()=>
            {
                let loadBtn: HTMLElement = document.getElementById('load');
                triggerMouseEvent(loadBtn, 'click');
                let treegrid: any =(<EJ2Instance>document.getElementsByClassName('e-gantt')[0]).ej2_instances[0];
                expect(treegrid.currentViewData.length).toBe(7);
            });
    });
});
describe('Gantt parent without update of Unscheduled task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource:crData1,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subTasks',
                    indicators: 'Indicators',
                },

                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true
                },
                editDialogFields: [
                    { type: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                ],
                splitterSettings: {
                    columnIndex: 9
                },
                allowUnscheduledTasks: true,
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],

            }, done);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Editing parent start date', () => {
        ganttObj.dataBind();
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')as any).ej2_instances[0];
        input.value = new Date('11/2/2021');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('11/2/2021');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.startDate, 'M/d/yyyy')).toBe('11/2/2021');

    });
});
describe('check auto validation of parent taskbar', () => {
    let ganttObj: Gantt;
    let taskModeData: Object[] = [
        {
            'TaskID': "a1",
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': "b2", 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                { 'TaskID': "c3", 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                { 'TaskID': "d4", 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        },
        {
            'TaskID': "e5",
            'TaskName': 'Parent Task 2',
            'StartDate': new Date('03/05/2017'),
            'EndDate': new Date('03/09/2017'),
            'Progress': '40',
            'isManual': true,
            'Children': [
                { 'TaskID': "f6", 'TaskName': 'Child Task 1', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40' },
                { 'TaskID': "g7", 'TaskName': 'Child Task 2', 'StartDate': new Date('03/06/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40','Predecessor': 'h8 FS'},
                { 'TaskID': "h8", 'TaskName': 'Child Task 3', 'StartDate': new Date('02/28/2017',),
                    'EndDate': new Date('03/05/2017'), 'Progress': '40', 'isManual': true,'Predecessor': 'i9 FF' },
                { 'TaskID': "i9", 'TaskName': 'Child Task 4', 'StartDate': new Date('03/04/2017'),
                    'EndDate': new Date('03/09/2017'), 'Progress': '40', 'isManual': true }
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
        dataSource: taskModeData,
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
            position: '35%'
        },
        projectStartDate: new Date('02/20/2017'),
        projectEndDate: new Date('03/30/2017'),
    
        }, done);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
    it('check auto start date & end date in manual taskmode', () => {
        ganttObj.openEditDialog("a1");
        let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        triggerMouseEvent(saveButton, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.autoStartDate, 'M/dd/yyyy')).toBe('2/26/2017');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.autoEndDate, 'M/dd/yyyy')).toBe('3/03/2017');
       
    });
    it('Left resizing & then check auto start date & end date in manual taskmode ', () => {
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', -70, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        ganttObj.openEditDialog("a1");
        let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        triggerMouseEvent(saveButton, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.autoStartDate, 'M/dd/yyyy')).toBe('2/24/2017');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.autoEndDate, 'M/dd/yyyy')).toBe('3/03/2017');
        
    });
    it('check start date & end date in auto taskmode', () => {
        ganttObj.openEditDialog("a1");
        let taskMode: any = document.querySelector('#' + ganttObj.element.id + 'isManual') as HTMLInputElement;
        if (taskMode) {
            let inputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'isManual')).ej2_instances[0];
            inputObj.value = false;
            inputObj.dataBind();
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
        }
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].taskData['StartDate'], 'M/dd/yyyy')).toBe('2/23/2017');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].taskData['EndDate'], 'M/dd/yyyy')).toBe('3/03/2017');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0]['StartDate'], 'M/dd/yyyy')).toBe('2/23/2017');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0]['EndDate'], 'M/dd/yyyy')).toBe('3/03/2017');
       
        
	       
    });

});
describe('Start Date of Parent taskbar is not updated properly through dialog editing', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: exportData,
                allowSorting: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency:'Predecessor',
                    child: 'subtasks'
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
    it('check start date after dialog edit', () => {
        ganttObj.openEditDialog(1);
        let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
        SD.value = new Date('04/04/2019');
        SD.dataBind();
        let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/4/2019');
    });
});
describe('check Predecessor name', () => {
    let ganttObj: Gantt;
    let editingData = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('04/02/2019'), Duration: 0,
                    Progress: 30, resources: [1], info: 'Measure the total property area alloted for construction'
                },
                {
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('04/02/2019'), Duration: 4, Predecessor: '2',
                    resources: [2, 3, 5], info: 'Obtain an engineered soil test of lot where construction is planned.' +
                        'From an engineer or company specializing in soil testing'
                },
                { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: '3', Progress: 30 },
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
                    Duration: 3, Predecessor: '4', Progress: 30, resources: 4,
                    info: 'Develop floor plans and obtain a materials list for estimations'
                },
                {
                    TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'),
                    Duration: 3, Predecessor: '6', resources: [4, 8], info: ''
                },
                {
                    TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'),
                    Duration: 0, Predecessor: '7', resources: [12, 5], info: ''
                }
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
                    position: "35%"
                },
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019')
            }, done);
    });
    it('Draw Predecessor using method',()=>{
        ganttObj.actionComplete = (args) => {
            if(args.action == "DrawConnectorLine") {
            expect(ganttObj.treeGrid.getRows()[5].children[5].innerHTML).toBe('4FS,2SS+4 days');
            }
        }
        ganttObj.dataBind();
        ganttObj.updatePredecessor(ganttObj.flatData[5].ganttProperties.taskId, '4FS,2SS');
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('taskbar indent', () => {
    let ganttObj: Gantt;
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
                resources: editingResources,
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
                    { field: 'TaskID', width: 60 },
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
    it('task indent',()=>{
       ganttObj.selectRow(9);
       ganttObj.indent();
       expect(ganttObj.flatData[8].hasChildRecords).toBe(true)
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
