/**
 * Gantt taskbaredit spec
 */
import { Gantt, Edit, Selection, IGanttData, Filter, IActionBeginEventArgs } from '../../src/index';
import { cellEditData, resourcesData } from '../base/data-source.spec';
import { createGantt, destroyGantt } from '../base/gantt-util.spec';
import { getValue } from '@syncfusion/ej2-base';

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
                        child: 'subtasks'
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
        });

        it('Add record to above position', () => {
            let data: object[] = [{ TaskID: 10, TaskName: 'New Task', Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Above', 5);
            expect(ganttObj.flatData.length).toBe(10);
        });

        it('Add record to below position', () => {
            let data: object[] = [{ TaskID: 11, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Predecessor: "2", Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below',6);
            expect(ganttObj.flatData.length).toBe(11);
        });

        it('Add record as first child record', () => {
            let data: object[] = [{ TaskID: 12, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Child',7);
            expect(ganttObj.flatData.length).toBe(12);
        });

        it('Add record as child of child record', () => {
            let data: object[] = [{ TaskID: 13, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Child',8);
            expect(ganttObj.flatData.length).toBe(13);
        });

        it('Add record as second child', () => {
            let data: object[] = [{ TaskID: 14, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Child',7);
            expect(ganttObj.flatData.length).toBe(14);
        });

        it('Add record below to child record', () => {
            ganttObj.allowUnscheduledTasks = false;
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 15, TaskName: 'New Task', Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below',2);
            expect(ganttObj.flatData.length).toBe(15);
        });

        it('Add record below to parent record', () => {
            ganttObj.allowUnscheduledTasks = false;
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 16, TaskName: 'New Task', Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below',1);
            expect(ganttObj.flatData.length).toBe(16);
        });

        it('Add record with already exiting taskid', () => {
            let data: object[] = [{ TaskID: 16, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0]);
            expect(ganttObj.flatData.length).toBe(17);
        });

        it('Add record with selected row', () => {
            ganttObj.selectionSettings.mode = 'Both';
            ganttObj.dataBind();
            ganttObj.selectionModule.selectRow(3);
            let data: object[] = [{ TaskID: 18, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0]);
            expect(ganttObj.flatData.length).toBe(18);
        });

        it('Add record with selected cell', () => {
            ganttObj.selectionSettings.mode = 'Cell';
            ganttObj.dataBind();
            ganttObj.selectCell({ cellIndex: 1, rowIndex: 3 });
            let data: object[] = [{ TaskID: 19, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0]);
            expect(ganttObj.flatData.length).toBe(19);
        });

        it('Add record with selection module false value', () => {
            ganttObj.allowSelection = false;
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 20, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below');
            expect(ganttObj.flatData.length).toBe(20);
        });

        it('Add record with Editing module false value', () => {
            ganttObj.editSettings.allowAdding = false;
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 20, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below');
            expect(ganttObj.flatData.length).toBe(20);
        });

        it('Add record without Editing module', () => {
            ganttObj.editModule.destroy();
            ganttObj.dataBind();
            let data: object[] = [{ TaskID: 20, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.editModule.addRecord(data[0],'Below');
            expect(ganttObj.flatData.length).toBe(20);
        });

        it('Search record without Filter module', () => {
            ganttObj.filterModule.destroy();
            ganttObj.dataBind();
            ganttObj.search("child");
            expect(ganttObj.flatData.length).toBe(20);
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
    });
});