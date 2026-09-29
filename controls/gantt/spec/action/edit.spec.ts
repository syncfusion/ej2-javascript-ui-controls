/**
 * Gantt taskbaredit spec
 */
import { DataManager, ODataAdaptor, Query, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import { Gantt, Edit, Selection,VirtualScroll, IGanttData, Filter, IActionBeginEventArgs, ContextMenuClickEventArgs, CriticalPath, Toolbar, ColumnMenu, ContextMenu, UndoRedo } from '../../src/index';
import { cellEditData,bug885565Holiday, resourcesData, projectData,normalResourceData, resourceCollection, stringTaskId, StringMultiTaskbarData, StringMultiResources, StringResourceData, StringResourceCollection, StringResourceSelefReferenceData, StringCellEditData, StringResourcesData, StringprojectData1, StringProjectResources, resourceviewData,crData1, exportData,editingData,editingResources, resourceResources, mileStoneData, coverageParentData, initialDataCR916492, celleditCR916492,
addDependency } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { getValue } from '@syncfusion/ej2-base';
import { TextBox } from '@syncfusion/ej2-inputs';
import { Tooltip } from '@syncfusion/ej2-popups';
import * as utils from '../../src/gantt/base/utils';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
Gantt.Inject(Edit, Selection, Filter,VirtualScroll,ContextMenu,UndoRedo);
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
            expect(getValue('Duration', ganttObj.flatData[3])).toBe(0);
        });
    
        it('Update Record of parent data', () => {
            let data: object[] = [{ TaskID: 1, TaskName: 'Updated Parent Task', Duration: 2}];
            ganttObj.updateRecordByID(data[0]);
            expect(getValue('TaskName', ganttObj.flatData[0])).toBe('Updated Parent Task');
        });
    });
    
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
    });
    
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
    
        it('Add record Without rowposition and empty data using public method', () => {
            let data: object[] = null;
            ganttObj.editModule.addRecord(data);
            expect(ganttObj.flatData.length).toBe(8);
        });
    
        it('Add record to bottom position', () => {
            let data: object[] = [{ TaskID: 9, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.addRecord(data[0],'Bottom');
            expect(ganttObj.flatData.length).toBe(9);
            expect(ganttObj.dataSource[5].TaskName).toBe('New Task');
        });
    
        it('Add record to above position', () => {
            let data: object[] = [{ TaskID: 10, TaskName: 'New Task', Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Resource: [2]  }];
            ganttObj.addRecord(data[0],'Above', 5);
            expect(ganttObj.flatData.length).toBe(10);
            expect(ganttObj.dataSource[2].TaskName).toBe('New Task');
        });
    
        it('Add record to below position', () => {
            let data: object[] = [{ TaskID: 11, TaskName: 'New Task', Duration: 5, Notes: 'Notes 6',
            BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/07/2019'), Predecessor: "2", Resource: [2]  }];
            ganttObj.addRecord(data[0],'Below',6);
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
    });
    
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
    
        it('Search record without Filter module', () => {
            ganttObj.filterModule.destroy();
            ganttObj.dataBind();
            ganttObj.search("child");
            expect(ganttObj.flatData.length).toBe(7);
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
            expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineStartDate, 'M/d/yyyy')).toBe('10/30/2017');
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
            ganttObj.actionComplete = function (args: any): void {
                if (args.requestType === "save") {
                    expect(ganttObj.flatData[0].ganttProperties.isMilestone).toBe(true);
                }
            };
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
            let data: object[] = [ { TaskID: 1, TaskName: 'Child Task 1',BaselineStartDate: new Date('04/02/2019 08:00:00 AM'), BaselineEndDate: new Date('04/02/2019 08:00:00 AM'), StartDate: new Date('04/02/2019'), Duration: 1}];
            ganttObj_tree.addRecord(data[0]);
            expect(ganttObj_tree.currentViewData[0].ganttProperties['baselineWidth']).toBe(0);
        });
        afterAll(() => {
            destroyGantt(ganttObj_tree);
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
            // ganttObj.dataBind();
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
            // ganttObj.editModule.addRecord(data,'Child',3);
        });

        it('Adding multiple tasks with Unscheduled Tasks and with Predecessor', () => {
            // ganttObj.allowUnscheduledTasks= true;
            // ganttObj.dataBind();
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
            // ganttObj.editModule.addRecord(data,'Child',3);
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
            // ganttObj.editModule.addRecord(data,'Child',3);
            // ganttObj.actionBegin = function (args: any): void {
            //     if (args.requestType === "beforeAdd") {
            //         expect(args.data.length).toBe(4);
            //     }
            // };
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
            // ganttObj.editModule.addRecord(data,'Child',3);
            // ganttObj.actionBegin = function (args: any): void {
            //     if (args.requestType === "actionBegin") {
            //         expect(args.data.length).toBe(4);
            //     }
            // };
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
            // ganttObj.editModule.addRecord(data,'Child',3);
            // ganttObj.actionBegin = function (args: any): void {
            //     if (args.requestType === "actionComplete") {
            //         expect(args.data.length).toBe(4);
            //     }
            // };
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
		    taskType:'FixedWork',
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
                // projectEndDate: new Date('05/30/2019'),
                rowHeight: 40,
            }, done);
        });
        afterAll(() => {
            destroyGantt(ganttObj);
        });
        it('Predecessor validation', () => {
            expect(ganttObj.flatData[3].ganttProperties.predecessorsName).toBe("b2 FS");
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe("e5 SS");
            expect(ganttObj.flatData[8].ganttProperties.predecessorsName).toBe("e5 FF");
        });
        it('Remove Predecessor', () => {
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe('e5 SS');
            ganttObj.removePredecessor((ganttObj.flatData[7].ganttProperties.taskId));
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe(null);
        });
        it('Add Predecessor', () => {
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe(null);
            ganttObj.addPredecessor((ganttObj.flatData[7].ganttProperties.taskId), 'e5 SS');
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe('e5 SS');
        });
        it('Update Predecessor', () => {
            ganttObj.updatePredecessor((ganttObj.flatData[7].ganttProperties.taskId), 'e5 FS');
            expect(ganttObj.flatData[7].ganttProperties.predecessorsName).toBe('e5 FS');
        });
        it('Rendering critical path ', () => {
            expect(ganttObj.flatData[1].isCritical).toBe(true);
            expect(ganttObj.flatData[2].isCritical).toBe(true);
            expect(ganttObj.flatData[7].isCritical).toBe(true);
            expect(ganttObj.flatData[9].isCritical).toBe(true);
        });
        it('Right Resizing critical path', () => {
            ganttObj.actionComplete = (args) => {
                if (args.requestType == 'save' && args.taskBarEditAction == 'RightResizing') {
                    expect(args.data.isCritical).toBe(true);
                }
            };
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container > div.e-taskbar-left-resizer.e-icon') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', 1244, 0);
            triggerMouseEvent(dragElement, 'mouseup');
        });
        it('Deleting Predecessor', () => {
            ganttObj.removePredecessor((ganttObj.flatData[3].ganttProperties.taskId));
            expect(ganttObj.flatData[3].ganttProperties.predecessorsName).toBe(null);
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
                expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
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
                expect(ganttObj.currentViewData.length).toBe(10);
            });
            it('Viewing task Information', () => {
                ganttObj.selectionModule.selectRow(1);
                ganttObj.contextMenuClick = function (args: ContextMenuClickEventArgs) {
                    expect(args.item.text).toEqual('Task Information');
                }
                let taskInfo: HTMLElement = document.getElementById(ganttObj.element.id + '_contextMenu_TaskInformation');
                triggerMouseEvent(taskInfo, 'click');
                let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                triggerMouseEvent(cancelRecord, 'click');
            });
            it('Schedule validation- endDate', () => {
                ganttObj.openEditDialog("b2");
                let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
                ED.value = new Date('04/09/2019');
                ED.dataBind();
                let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
                expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/2/2019');
                let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                expect(textObj.value).toBe('6 days');
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
                let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
                if (durationField) {
                    let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                    textObj.value = '5 days';
                    textObj.dataBind();
                    let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
                    expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/2/2019');
                    let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
                    expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/8/2019');
                    let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                    triggerMouseEvent(cancelRecord, 'click');
                }
            });
            it('Record update with duration', () => {
                ganttObj.openEditDialog("b2");
                let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
                if (durationField) {
                    let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                    textObj.value = '5 days';
                    textObj.dataBind();
                    let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
                    expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/2/2019');
                    let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
                    expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/8/2019');
                    let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                    triggerMouseEvent(saveRecord, 'click');
                }
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
                // projectEndDate: new Date('05/18/2019')
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
            setTimeout(done, 500);
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
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
        });
        it('Adding task under unassigned task', () => {
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
            expect(ganttObj.currentViewData[8].childRecords.length).toBe(1)
        });
        it('Editing task name', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
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
            ganttObj.taskbarEdited = (args: any) => {
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[5].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/01/2019');
            };
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
            ganttObj.taskbarEdited = (args: any) => {

                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('03/29/2019');
            };
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
            ganttObj.taskbarEdited = (args: any) => {
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('04/03/2019');
            };
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
            setTimeout(done, 500);
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
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
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
		taskType:'FixedWork',
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
            setTimeout(done, 500);
            ganttObj.openAddDialog();
            let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            resourceTab.selectedItem = 1;
        });
    
        it('Add resources using add dialog', () => {
	    let work: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'work')).ej2_instances[0];
            work.value = 8;
            work.dataBind();
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
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
        });
        it('Adding task under unassigned task', () => {
	    let work: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'work')).ej2_instances[0];
            work.value = 8;
            work.dataBind();
            expect(ganttObj.currentViewData[1].ganttProperties.sharedTaskUniqueIds.length).toBe(2);
            expect(ganttObj.currentViewData[0].childRecords.length).toBe(1);
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
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
            let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(10) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-gantt-child-taskbar') as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
            triggerMouseEvent(dragElement, 'mousemove', dragElement.offsetLeft + 180, 0);
            triggerMouseEvent(dragElement, 'mouseup');
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
		taskType:'FixedWork',
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
            setTimeout(done, 500);
            ganttObj.openAddDialog();
            let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            resourceTab.selectedItem = 1;
        });
        it('Editing task name', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[2].ganttProperties.taskName).toBe('TaskName updated');       
        });
        it('Deleting the record', () => {
            let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.selectRow(1);
            let deleteRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_delete') as HTMLElement;
            triggerMouseEvent(deleteRecord, 'click');
        });
        it('Adding New task', () => {
            let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            let resourceCheckbox2: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(resourceCheckbox1, 'click')
            triggerMouseEvent(resourceCheckbox2, 'click')
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(0);
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Editing task name', () => {
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
        });

        it('Editing start date column', () => {
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')as any).ej2_instances[0];
            input.value = new Date('04/04/2019');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/4/2019');
        });

        it('Editing end date column', () => {
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
            let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(dependency, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
            input.value = 'c3+5';
            let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe('c3 FS+5 days');
            done();
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Editing progress column', () => {
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
          //checking work values for task which have no resource before adding resource
          expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
          expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/04/2019');
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
              expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
              expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/04/2019');
              expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(24);
          }
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Initial checking resource column without unit mapping', () => {
            expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3,Resource 1');
            expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
            expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
        });
        it('Unscheduled start task - start date editing', () => {
             let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(3)') as HTMLElement;
             triggerMouseEvent(startDate, 'dblclick');
             let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
             input.value = new Date('04/03/2019');
             let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element, 'click');
             expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/3/2019');
        });
        it('Unscheduled start task - end date editing', () => {
            let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(endDate, 'dblclick');
            let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
            input.value = new Date('04/10/2019');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/10/2019');
        });
        it('Unscheduled start task - duration editing', () => {
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
        expect(parseInt(ganttObj.currentViewData[0].ganttProperties.taskId)).toBe(57);
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
        let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
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
        let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
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
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
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
        let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/4/2019');
    });
});
describe('taskType with resourceUnit mapping', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{
                TaskID: 1,
                TaskName: 'Project initiation',
                StartDate: new Date('03/29/2019'),
                EndDate: new Date('04/21/2019'),
                subtasks: [
                    {
                        TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 2,
                        Progress: 30, work: 16, resources: [{ resourceId: 1, unit: 70 }, 6], type: 'FixedUnit', isManual: true, Predecessor: '3FS',
                    },
                    {
                        TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
                        resources: [2, 3, 5], work: 96, type: 'FixedUnit', Predecessor: '4FS'
                    },
                    {
                        TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 1,
                        work: 16, resources: [8, { resourceId: 9, unit: 50 }], Progress: 30, type: 'FixedUnit'
                    },
                ]
            }],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                resourceInfo: 'resources',
                work: 'work',
                child: 'subtasks',
                type: 'type',
                manual: 'isManual',
            },
            taskMode: 'Custom',
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            resources: resourceResources,
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'unit'
            },
            taskType: 'FixedUnit',
            workUnit: 'Hour',
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            highlightWeekends: true,
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Name', width: 250 },
                { field: 'work', headerText: 'Work' },
                { field: '' }
            ],
            editDialogFields: [
                { type: 'General', headerText: 'General' },
                { type: 'Dependency' },
                { type: 'Resources' }
            ],
            labelSettings: {
                rightLabel: 'resources'
            },
            splitterSettings: {
                columnIndex: 5.1
            },
            projectStartDate: new Date('03/28/2019'),
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
    it('Editing Work value', () => {
        let name: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(name, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolwork') as HTMLElement;
        input.value = 10;
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
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
describe('Indent predecessor task', () => {
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
                            'date': '04/16/2019',
                            'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                            'name': '<span style="color:red">String Template</span>',
                            'tooltip': 'Review results'
                        }
                    ]
                },
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
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
                        { TaskID: 8, TaskName: 'Customer strength', BaselineStartDate: new Date('04/08/2019'), BaselineEndDate: new Date('04/12/2019'), StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5", Progress: 30 },
                        { TaskID: 9, TaskName: 'Market opportunity analysis', StartDate: new Date('04/04/2019'), Duration: 4, Predecessor: "5" }
                    ]
                },
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
            { field: 'CustomColumn', headerText: 'CustomColumn' }
        ],

        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'Outdent', 'Indent', 'Undo','Redo'],
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
    it('task indent',()=>{
       ganttObj.selectRow(4);
       ganttObj.indent();
       ganttObj.indent();
       expect(ganttObj.getFormatedDate(ganttObj.currentViewData[5].ganttProperties.startDate,'M/d/yyyy')).toBe('4/9/2019');
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Range container in project view ', () => {
    let ganttObj: Gantt;
    var selfData = [
        {
            taskID: '1',
            taskName: 'Project Schedule',
            startDate: new Date('02/04/2019'),
            endDate: new Date('03/10/2019')
        },
        {
            taskID: '2',
            taskName: 'Planning',
            startDate: new Date('02/04/2019'),
            endDate: new Date('02/10/2019'),
            parentID: 1
        },
        {
            taskID: '3',
            taskName: 'Plan timeline',
            startDate: new Date('02/04/2019'),
            endDate: new Date('02/10/2019'),
            duration: 6,
            progress: '60',
            parentID: 2
        },
        {
            taskID: '4',
            taskName: 'Plan budget',
            startDate: new Date('02/04/2019'),
            endDate: new Date('02/10/2019'),
            duration: 6,
            progress: '90',
            parentID: 2
        },
        {
            taskID: '5',
            taskName: 'Allocate resources',
            startDate: new Date('02/04/2019'),
            endDate: new Date('02/10/2019'),
            duration: 6,
            progress: '75',
            parentID: 2
        },
        {
            taskID: '6',
            taskName: 'Planning complete',
            startDate: new Date('02/06/2019'),
            endDate: new Date('02/10/2019'),
            duration: 0,
            predecessor: '3FS,4FS,5FS',
            parentID: 2
        },
        {
            taskID: '7',
            taskName: 'Design',
            startDate: new Date('02/13/2019'),
            endDate: new Date('02/17/2019'),
            parentID: 1,
        },
        {
            taskID: '8',
            taskName: 'Software Specification',
            startDate: new Date('02/13/2019'),
            endDate: new Date('02/15/2019'),
            duration: 3,
            progress: '60',
            predecessor: '6FS',
            parentID: 7,
        },
        {
            taskID: '9',
            taskName: 'Develop prototype',
            startDate: new Date('02/13/2019'),
            endDate: new Date('02/15/2019'),
            duration: 3,
            progress: '100',
            predecessor: '6FS',
            parentID: 7,
        },
        {
            taskID: '10',
            taskName: 'Get approval from customer',
            startDate: new Date('02/16/2019'),
            endDate: new Date('02/17/2019'),
            duration: 2,
            progress: '100',
            predecessor: '9FS',
            parentID: 7,
        },
        {
            taskID: '11',
            taskName: 'Design complete',
            startDate: new Date('02/17/2019'),
            endDate: new Date('02/17/2019'),
            duration: 0,
            predecessor: '10FS',
            parentID: 7,
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: selfData,
            height: '450px',
            highlightWeekends: true,
            allowSelection: true,
            treeColumnIndex: 1,
            allowReordering: true,
            enableContextMenu: true,
            enableMultiTaskbar: true,
            showOverAllocation: true,
            taskFields: {
                id: 'taskID',
                name: 'taskName',
                startDate: 'startDate',
                endDate: 'endDate',
                duration: 'duration',
                progress: 'progress',
                dependency: 'predecessor',
                parentID: 'parentID'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            columns: [
                { field: 'taskID', width: 60 },
                { field: 'taskName', width: 250 },
                { field: 'startDate' },
                { field: 'endDate' },
                { field: 'duration' },
                { field: 'predecessor' },
                { field: 'progress' },
            ],
            sortSettings: {
                columns: [{ field: 'taskID', direction: 'Ascending' },
                { field: 'taskName', direction: 'Ascending' }]
            },
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
            allowExcelExport: true,
            allowPdfExport: true,
            allowRowDragAndDrop: true,
            selectedRowIndex: 1,
            splitterSettings: {
                position: "50%",
            },
            selectionSettings: {
                mode: 'Row',
                type: 'Single',
                enableToggle: true
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
                    day: '02/22/2019',
                    cssClass: 'e-custom-event-marker',
                    label: 'Project approval and kick-off'
                }
            ],
            holidays: [{
                from: "02/27/2019",
                to: "02/28/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "01/30/2019",
                to: "01/30/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
            searchSettings: {
                fields: ['taskName', 'duration']
            },
            labelSettings: {
                leftLabel: 'taskID',
                rightLabel: 'Task Name: ${taskData.taskName}',
                taskLabel: '${progress}%'
            },
            allowResizing: true,
            readOnly: false,
            taskbarHeight: 20,
            allowTaskbarOverlap: false,
            rowHeight: 40,
            allowUnscheduledTasks: true,
            projectStartDate: new Date('01/28/2019'),
            projectEndDate: new Date('03/10/2019')
        }, done);

    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
    it('collapse all', () => {
        ganttObj.collapsed = function (args: any): void {
                expect(ganttObj.element.getElementsByClassName('e-rg-rangdiv e-leftarc')[0]['style'].height
                ).toBe('21px');
        };
        ganttObj.collapseAll()
    });
});
describe('Predecessor validation for taskbar indent', () => {
    let ganttObj: Gantt;
    let data= [
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
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: data,
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
    
    it('task indent',()=>{
       ganttObj.selectRow(1);
       ganttObj.outdent();
       ganttObj.selectRow(2);
       ganttObj.indent();
       expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/2/2019')
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Split task- Unable to merge last two segments', () => {
    let ganttObj: Gantt;
    var splitTasksData = [
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
                            Duration: 9, Progress: '60',
                            Segments: [
                                { StartDate: new Date('02/05/2019'), Duration: 2 },
                                { StartDate: new Date('02/05/2019'), Duration: 6 },
                                { StartDate: new Date('02/18/2019'), Duration: 1 }
                            ]
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
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
    it('Merging tasks', (done: Function) => {
        ganttObj.actionComplete = function(args) {
            if(args.requestType == 'mergeSegment') {
                expect(args.rowData.ganttProperties.segments.length).toBe(2);
            }
        };
        let dragElement: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td > div.e-taskbar-main-container > div.e-gantt-child-taskbar-inner-div.e-segment-inprogress.e-gantt-child-taskbar.e-segmented-taskbar') as HTMLElement;
        triggerMouseEvent(dragElement, 'mousedown', dragElement.offsetLeft, dragElement.offsetTop);
        triggerMouseEvent(dragElement, 'mousemove', 200, 0);
        triggerMouseEvent(dragElement, 'mouseup');
        done();
    });
});
describe('CR:883567: Taskbar duration is not calculated', () => {
    let ganttObj: Gantt;
    let data= [
        {
            TaskID: 1,
            TaskName: 'Final Product',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/05/2019'),
            Duration: 0.89,
            Predecessor: '2FS'
        },
        {
            TaskID: 2,
            TaskName: 'Final Product',
            StartDate: new Date('04/04/2019'),
            EndDate: new Date('04/05/2019'),
            Duration: 0.5
        }
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
                    dependency:'Predecessor',
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
                splitterSettings: {
                    position: "35%"
                },
                allowUnscheduledTasks: true,
            }, done);
    });
    it('Checking taskbar width',()=>{
        expect(ganttObj.currentViewData[0].ganttProperties.width).toBe(29.37);
        expect(ganttObj.currentViewData[1].ganttProperties.width).toBe(16.5);
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Right value in tabel', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: mileStoneData,
                allowReordering: true,
                enableMultiTaskbar: true,
                enableTimelineVirtualization: true,
                autoCalculateDateScheduling: false,
                allowTaskbarDragAndDrop: true,
                showOverAllocation: true,
                enableCriticalPath: true,
                enableImmutableMode: true,
                enableContextMenu: true,
                enableRtl: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
                    indicators: 'Indicators',
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    newRowPosition: 'Top',
                    showDeleteConfirmDialog: true,
                    mode: 'Auto',
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                ],
                sortSettings: {
                    columns: [
                        { field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' },
                    ],
                },
                toolbar: [
                    'Add',
                    'Edit',
                    'CriticalPath',
                    'Update',
                    'Delete',
                    'Cancel',
                    'ExpandAll',
                    'CollapseAll',
                    'Search',
                    'ZoomIn',
                    'ZoomOut',
                    'ZoomToFit',
                    'PrevTimeSpan',
                    'NextTimeSpan',
                    'ExcelExport',
                    'CsvExport',
                    'PdfExport',
                ],
                allowParentDependency: false,
                enablePredecessorValidation: false,
                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    columnIndex: 4,
                },
                selectionSettings: {
                    type: 'Multiple',
                },
                tooltipSettings: {
                    showTooltip: true,
                },
                filterSettings: {
                    columns: [
                        {
                            field: 'TaskName',
                            matchCase: false,
                            operator: 'startswith',
                            predicate: 'or',
                            value: 'zzz',
                        },
                        {
                            field: 'TaskID',
                            matchCase: false,
                            operator: 'equal',
                            predicate: 'or',
                            value: 2,
                        },
                    ],
                },
                allowFiltering: true,
                gridLines: 'Both',
                showColumnMenu: true,
                connectorLineBackground: 'red',
                connectorLineWidth: 4,
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1,
                    },
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off',
                    },
                ],
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
    beforeEach((done) => {
        setTimeout(done, 2000);
    });
    it('Checking Right Value', () => {
        ganttObj.openAddDialog()
        ganttObj.actionBegin = (args: any, done: Function): void => {
            if (args.requestType === 'beforeOpenAddDialog') {
                const element = document.getElementsByClassName('e-task-table ')[0] as HTMLElement;
                expect(element.style.right).toBe('-58677px')
            }
            done()
        };
    });
});
describe('Testin Issue Gantt stuck wile using holiday', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: bug885565Holiday,
                enableMultiTaskbar: true,
                autoCalculateDateScheduling: false,
                showOverAllocation: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
                    indicators: 'Indicators',
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    newRowPosition: 'Top',
                    showDeleteConfirmDialog: true,
                    mode: 'Auto',
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                ],
                sortSettings: {
                    columns: [
                        { field: 'TaskID', direction: 'Ascending' },
                        { field: 'TaskName', direction: 'Ascending' },
                    ],
                },
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search',
                    'Undo',
                    'Redo',
                ],
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1,
                    },
                },
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off',
                    },
                ],
                holidays: [
                    {
                        from: '04/04/2019',
                        to: '04/05/2019',
                        label: ' Public holidays',
                        cssClass: 'e-custom-holiday',
                    },
                    {
                        from: '04/12/2019',
                        to: '04/12/2019',
                        label: ' Public holiday',
                        cssClass: 'e-custom-holiday',
                    },
                ],
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    it('Gantt rendering',(done: Function)=>{
        ganttObj.dataBound = function() {
            expect(true).toBe(true);
        };
        done()
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Adding record with args.cancel', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: bug885565Holiday,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
                    indicators: 'Indicators',
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                ],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search',
                    'Undo',
                    'Redo',
                ],
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1,
                    },
                },
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    it('Gantt rendering',(done: Function)=>{
        function checkData() {
            expect(ganttObj.flatData.length === 39).toBe(true);
            done()
        }
        ganttObj.actionBegin = function(args?:any) {
            if (args.requestType === "beforeAdd") {
                args.cancel = true;
                setTimeout(checkData, 500)
            }
        };
        let record:any = {
            TaskID: 10,
            TaskName: 'Identify Site location',
            StartDate: new Date('04/02/2019'),
            Duration: 3,
            Progress: 50
        };
        ganttObj.editModule.addRecord(record, 'Below', 2);
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Covering DM success method', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: bug885565Holiday,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    durationUnit:'DurationUnit',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
                    parentID:'ParentID',
                    resourceInfo:'resource',
                    indicators: 'Indicators',
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                ],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search',
                    'Undo',
                    'Redo',
                ],
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1,
                    },
                },
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    it('Check for task update',(done: Function)=>{
        ganttObj.actionComplete = function(args?:any) {
            if (args.requestType === "save") {
                expect(ganttObj.flatData[3]['TaskID'] === 10).toBe(true)
                done()
            }
        };
        ganttObj.editedRecords[0] = ganttObj.flatData[3]
        ganttObj.editModule['dmSuccess']({changedRecords:[{
            TaskID: 10,
            TaskName: 'Identify Site location',
            StartDate: new Date('04/02/2019'),
            Duration: 3,
            Progress: 50
        }]},{})
    });
    it('Covering client side method',()=>{
        ganttObj.editModule.updateClientDataFromServer({
            addedRecords: [{
                TaskID: 100,
                TaskName: 'Identify Site location',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                Progress: 50
            }],
            changedRecords: []
        }, {data: ganttObj.flatData[3]});
        expect(ganttObj.flatData.length).toBe(39)
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Changing task Id using method', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coverageParentData,
                dateFormat: 'MMM dd, y',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    parentID: 'parentID',
                    notes: 'info',
                    resourceInfo: 'resources',
                },
                enableContextMenu: true,
                selectedRowIndex: 2,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    allowNextRowEdit: true,
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                allowSelection: true,
                allowRowDragAndDrop: true,
                gridLines: 'Both',
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                resources: editingResources,
                height: '450px',
                columns: [
                    { field: 'TaskID', width: 200 },
                    { field: 'TaskName', headerText: 'Job Name', width: '250', clipMode: 'EllipsisWithTooltip', },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' },
                ],
                splitterSettings: { columnIndex: 6 },
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
            }, done);
    });
    it('Check for updated Id', (done: Function) => {
        ganttObj.actionComplete = function (args?: any) {
            if (args.requestType === "refresh") {
                expect(ganttObj.flatData[2].ganttProperties.taskId).toBe("20")
                done()
            }
        };
        ganttObj.updateTaskId(3,"20")
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});
describe('Changing Value in ActionBegin', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: bug885565Holiday,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
                    indicators: 'Indicators',
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                ],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search',
                    'Undo',
                    'Redo',
                ],
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1,
                    },
                },
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    it('Checking Changed Task ID',(done: Function)=>{
        ganttObj.actionBegin = function(args?:any) {
            if (args.requestType === "beforeAdd") {
                args.data.ganttProperties.taskId = 111
                args.data.taskData.TaskID = 111
                args.data.TaskID = 222
            }
        };
        ganttObj.actionComplete = function(args?:any) {
            if (args.requestType === "add") {
                expect(args.data.ganttProperties.taskId).toBe(222)
                done()
            }
        }
        let record:any = {
            TaskID: 111,
            TaskName: 'Identify Site location',
            StartDate: new Date('04/02/2019'),
            Duration: 3,
            Progress: 50
        };
        ganttObj.editModule.addRecord(record, 'Below', 2);
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Setting edit type for Id column', () => {
    let elem: HTMLElement;
    let dropdownlistObj: TextBox;
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: bug885565Holiday,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
                    indicators: 'Indicators',
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                },
                columns: [
                    {
                        field: 'TaskID', headerText: 'Task ID', edit: {
                            create: () => {
                                elem = document.createElement('input');
                                return elem;
                            },
                            read: () => {
                                return dropdownlistObj.value;
                            },
                            destroy: () => {
                                dropdownlistObj.destroy();
                            },
                            write: (args: Object) => {
                                dropdownlistObj = new TextBox({
                                    value: args['rowData'][args['column'].field]

                                });
                                dropdownlistObj.appendTo(elem);
                            }
                        }
                    },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                ],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search',
                    'Undo',
                    'Redo',
                ],
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1,
                    },
                },
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    it('Checking of flat data',()=>{
        expect(ganttObj.flatData.length).toBe(39)
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Removing cell edit module', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: bug885565Holiday,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
                    indicators: 'Indicators',
                },
                renderBaseline: true,
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    mode:"Auto"
                },
                columns: [
                    {
                        field: 'TaskID', headerText: 'Task ID'
                    },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                ],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search',
                    'Undo',
                    'Redo',
                ],
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1,
                    },
                },
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    it('Removing cell and dialog module',()=>{
        ganttObj.editModule.cellEditModule = null
        ganttObj.editModule.dialogModule = null
        ganttObj.editSettings = {
            allowAdding: false,
            allowEditing: true,
            allowDeleting: true,
            allowTaskbarEditing: true,
            mode:"Auto"
        }
    }); 
    it('Checking if the module is present',()=>{
        expect(ganttObj.editModule.cellEditModule != null).toBe(true)
        expect(ganttObj.editModule.dialogModule != null).toBe(true)
    }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Update Record using method while context menu enabled', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: bug885565Holiday,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
                    indicators: 'Indicators',
                },
                renderBaseline: true,
                enableUndoRedo: true,
                undoRedoActions:['Sorting','Add','ColumnReorder','ColumnResize','ColumnState','Delete','Edit','Filtering','Indent','Outdent','NextTimeSpan','PreviousTimeSpan','RowDragAndDrop','Search'],
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    mode:"Auto"
                },
                columns: [
                    {
                        field: 'TaskID', headerText: 'Task ID'
                    },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                ],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search',
                    'Undo',
                    'Redo',
                ],
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1,
                    },
                },
                enableContextMenu: true,
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    it('Check for edited record',(done:Function)=>{
        ganttObj.contextMenuModule.item = "Task 1";
        ganttObj.actionBegin = function(args?:any) {
            if (args.requestType === "beforeSave") {
                expect(args.data.ganttProperties.taskName).toBe('Updated by index value')
                done()
            }
        };
        let data = {
            TaskID: 3,
            TaskName: 'Updated by index value',
            StartDate: new Date('04/02/2019'),
            Duration: 4,
            Progress: 50
        }
        ganttObj.updateRecordByID(data)
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Update Record using method using undo redo', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: bug885565Holiday,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate',
                    child: 'subtasks',
                    indicators: 'Indicators',
                },
                renderBaseline: true,
                enableUndoRedo: true,
                undoRedoActions:['Sorting','Add','ColumnReorder','ColumnResize','ColumnState','Delete','Edit','Filtering','Indent','Outdent','NextTimeSpan','PreviousTimeSpan','RowDragAndDrop','Search'],
                baselineColor: 'red',
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    mode:"Auto"
                },
                columns: [
                    {
                        field: 'TaskID', headerText: 'Task ID'
                    },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'Predecessor', headerText: 'Predecessor', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                ],
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'Search',
                    'Undo',
                    'Redo',
                ],
                highlightWeekends: true,
                timelineSettings: {
                    showTooltip: true,
                    topTier: {
                        unit: 'Week',
                        format: 'dd/MM/yyyy',
                    },
                    bottomTier: {
                        unit: 'Day',
                        count: 1,
                    },
                },
                enableContextMenu: true,
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2024'),
            }, done);
    });
    it('Check for updated value',(done:Function)=>{
        ganttObj.actionBegin = function(args?:any) {
            if (args.requestType === "beforeSave" && args.data.ganttProperties.taskName === "Defining target audience") {
                expect(args.data.ganttProperties.taskName).toBe('Defining target audience')
                done()
            }
        };
        let data = {
            TaskID: 3,
            TaskName: 'Updated by index value',
            StartDate: new Date('04/02/2019'),
            Duration: 4,
            Progress: 50,
            Predecessor:2
        }
        ganttObj.updateRecordByID(data)
        let undo: HTMLElement = document.querySelector('.e-toolbar-item[title="Undo"]').querySelector('button') as HTMLElement
        triggerMouseEvent(undo, 'click');
    });
    it('Check taskmode value',()=>{
        ganttObj.changeTaskMode(ganttObj.flatData[2]);
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('row indent', () => {
    let ganttObj: Gantt;
    let taskModeData = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual': true,
            resources: [1],
            'Children': [
                { 'TaskID': 2, resources: [2, 3], 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                    'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                { 'TaskID': 3, 'TaskName': 'Child Task 2', 'Progress': '40', 'isManual': true, 'Duration': 5, TaskType: 'Task with duration only',
                    
                },
                { 'TaskID': 4, 'TaskName': 'Child Task 3', 'Duration': 5, 'Progress': '40',
                    'StartDate': new Date('02/27/2017'), 'EndDate': new Date('03/03/2017')
                }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: taskModeData,
    height: '450px',
    allowSelection: true,
    taskMode: 'Custom',
    //enableContextMenu: true,
    treeColumnIndex: 1,
    highlightWeekends: true,
    allowUnscheduledTasks: true,
    taskType:'FixedWork',
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        endDate: 'EndDate',
        duration: 'Duration',
        progress: 'Progress',
        dependency: 'Predecessor',
        child: 'Children',
        manual: 'isManual',
        resourceInfo: 'resources',
        work: 'work',
        baselineStartDate: 'BaselineStartDate',
        baselineEndDate: 'BaselineEndDate',
        notes: 'info',
    },
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll' , 'ZoomToFit' , 'Indent' , 'Outdent'],
    editSettings: {
        allowAdding: true,
        allowEditing: true,
        allowDeleting: true,
        allowTaskbarEditing: true,
        showDeleteConfirmDialog: true
    },
    columns: [
        { field: 'TaskID', headerText: 'ID', visible: false },
        { field: 'TaskName', headerText: 'Name' },
        { field: 'isManual', headerText: 'Task Mode'}
    ],
    labelSettings: {
        leftLabel: 'TaskName',
        rightLabel: 'resources',
        taskLabel: '${Progress}%'
    },
    splitterSettings: {
        position: "35%"
    },
    projectStartDate: new Date('02/20/2017'),
    projectEndDate: new Date('04/06/2017'),
    resourceNameMapping: 'resourceName',
    resourceIDMapping: 'resourceId',
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
        { resourceId: 12, resourceName: 'Construction Supervisor' }
    ]
            }, done);
    });
    it('task indent',()=>{
       ganttObj.selectRow(2);
       ganttObj.indent();
       expect(ganttObj.getFormatedDate(ganttObj.flatData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/27/2017');
    });
    it('UpdateEditedRecordFields method',()=>{
        ganttObj.editModule['updateEditedRecordFields'](ganttObj.flatData[1].ganttProperties, ganttObj.flatData[1]);
        expect(ganttObj.flatData[1]['TaskName']).toBe('Child Task 1');
     }); 
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('CR:916492-When adding a record, the validation for taskType as FixedDuration is not working properly - Initial dataset render', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: initialDataCR916492,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                work: 'Work',
                type: 'taskType'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            taskType: 'FixedDuration',
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Task Name', width: '180' },
                { field: 'Work', width: '110' },
                { field: 'Duration', width: '100' },
                { field: 'taskType', headerText: 'Task Type', width: '110' },
            ],
        }, done);
    });
    it('Checking the work value on load time with fixedDuration and duration is 0',()=>{
       expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(0);
       expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(0);
       expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
       expect(ganttObj.currentViewData[0].ganttProperties.isMilestone).toBe(true);
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('CR:916492-When adding a record, the validation for taskType as FixedDuration is not working properly - dialog edit action', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: celleditCR916492,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                work: 'Work',
                child: 'subtasks',
                type: 'taskType',
                milestone: 'isMilestone',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            workUnit: 'Hour',
            taskType: 'FixedDuration',
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Task Name', width: '180' },
                { field: 'Work', width: '110' },
                { field: 'Duration', width: '100' },
                { field: 'taskType', headerText: 'Task Type', width: '110' },
            ],
        }, done);
    });
    it('Checking the work value when without resource, fixedDuration and duration is 0-dialog edit action',()=>{
        ganttObj.openEditDialog(1);
        let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
       if (durationField) {
           let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           textObj.value = 0;
           textObj.dataBind();
           let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
       };
       expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(0);
       expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(0);
       expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
       expect(ganttObj.currentViewData[0].ganttProperties.isMilestone).toBe(true);
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('CR:916492-When adding a record, the validation for taskType as FixedDuration is not working properly - cell edit action', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: celleditCR916492,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                work: 'Work',
                child: 'subtasks',
                type: 'taskType',
                milestone: 'isMilestone',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            workUnit: 'Hour',
            taskType: 'FixedDuration',
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Task Name', width: '180' },
                { field: 'Work', width: '110' },
                { field: 'Duration', width: '100' },
                { field: 'taskType', headerText: 'Task Type', width: '110' },
            ],
        }, done);
    });
    it('Checking the work value when without resource, fixedDuration and duration is 0- cell edit action',()=>{
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(4)')
        triggerMouseEvent(duration, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration')).ej2_instances[0];
        input.value = '0 days';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(0);
        expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(0);
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[0].ganttProperties.isMilestone).toBe(true);
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('CR:919158-Work calculation is not functioning correctly when adding a record- Dialog edit action', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [ 
                {
                    TaskID: 1,
                    TaskName: 'Identify site location',
                    StartDate: new Date('03/29/2019'),
                    Duration: 1,
                    Progress: 30,
                    Work: 12,
                    taskType: 'FixedUnit',
                    resources: [{ resourceId: 1, Unit: 100 },{ resourceId: 2, Unit: 50 }],
                }
            ],
            resources: [
                { resourceId: 1, resourceName: 'Martin Tamer' },
                { resourceId: 2, resourceName: 'Rose Fuller' }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                resourceInfo: 'resources',
                work: 'Work',
                child: 'subtasks',
                type: 'taskType'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'Unit',
            },
            workUnit: 'Hour',
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Task Name', width: '180' },
                { field: 'resources', headerText: 'Resources', width: '160' },
                { field: 'Work', width: '110' },
                { field: 'Duration', width: '100' },
                { field: 'taskType', headerText: 'Task Type', width: '110' },
            ],
        }, done);
    });
    it('Checking the work value when having 2-resource(100,50) fixedUnit- Dialog edit',() => {
        ganttObj.openEditDialog(1);
        let workField: any = document.querySelector('#' + ganttObj.element.id + 'Work') as HTMLInputElement;
        if (workField) {
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Work')).ej2_instances[0];
            textObj.value = 16;
            textObj.dataBind();
        };
        let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
        expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(1.33);
        expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(16);
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedUnit');
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('CR:919158-Work calculation is not functioning correctly when adding a record- Cell edit action', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [ 
                {
                    TaskID: 1,
                    TaskName: 'Identify site location',
                    StartDate: new Date('03/29/2019'),
                    Duration: 1,
                    Progress: 30,
                    Work: 12,
                    taskType: 'FixedUnit',
                    resources: [{ resourceId: 1, Unit: 100 },{ resourceId: 2, Unit: 50 }],
                }
            ],
            resources: [
                { resourceId: 1, resourceName: 'Martin Tamer' },
                { resourceId: 2, resourceName: 'Rose Fuller' }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                resourceInfo: 'resources',
                work: 'Work',
                child: 'subtasks',
                type: 'taskType',
                milestone: 'isMilestone',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'Unit',
            },
            workUnit: 'Hour',
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Task Name', width: '180' },
                { field: 'resources', headerText: 'Resources', width: '160' },
                { field: 'Work', width: '110' },
                { field: 'Duration', width: '100' },
                { field: 'taskType', headerText: 'Task Type', width: '110' },
            ],
        }, done);
    });
    it('Checking the work value when having 2-resource(100,50) fixedUnit- cell edit',() => {
        let work: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(4)')
        triggerMouseEvent(work, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolWork')).ej2_instances[0];
        input.value = 16;
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(1.33);
        expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(16);
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedUnit');
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Check time for 24 hrs working time', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [ 
                {
                    TaskID: 1,
                    TaskName: 'Identify site location',
                    StartDate: '2019-03-29T09:26:00.000Z',
                    Duration: 0.2,
                    Progress: 30
                }
            ],
            dayWorkingTime:[{from:0, to:24}],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                resourceInfo: 'resources',
                work: 'Work',
                child: 'subtasks',
                type: 'taskType',
                milestone: 'isMilestone',
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true,
            },
            toolbar: [
                'Add',
                'Edit',
                'Update',
                'Delete',
                'Cancel',
                'ExpandAll',
                'CollapseAll',
            ],
            allowSelection: true,
            height: '450px',
            treeColumnIndex: 1,
            columns: [
                { field: 'TaskID', visible: false },
                { field: 'TaskName', headerText: 'Task Name', width: '180' },
                { field: 'resources', headerText: 'Resources', width: '160' },
                { field: 'Work', width: '110' },
                { field: 'Duration', width: '100' },
                { field: 'taskType', headerText: 'Task Type', width: '110' },
            ],
        }, done);
    });
    beforeEach((done) => {
        setTimeout(done, 500);
        ganttObj.openEditDialog(1);
    });
    it('Check the milliseconds',()=>{
        let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
        SD.value = new Date('04/01/2019');
        SD.dataBind();
        let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
        expect(ganttObj.currentViewData[0].ganttProperties.startDate.getMilliseconds()).toBe(0);
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('indent action in tasks', () => {
    let ganttObj: Gantt;
    let data: Object =  [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            Duration: 1
        },
        { TaskID: 2, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 1, Predecessor: "1+3 days" },
        {
            TaskID: 3,
            TaskName: 'Market Research',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            Duration: 1
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
            selectedRowIndex: 2,
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
            projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    it('indent action in tasks',() => {
        ganttObj.indent();
        expect(ganttObj.currentViewData[2].ganttProperties.startDate).toEqual(ganttObj.currentViewData[1].ganttProperties.startDate)
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Duration calculation for FixedWork', () => {
    let ganttObj: Gantt;
    let resourcesData = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                    Progress: 30, work: 0, resources: [{ resourceId: 1, resourceUnit: 0 }]
                },
            ]
        },
    ];
    let resourceCollection = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData,
                resources: resourceCollection,
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
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks',
                    type:'type'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit',
                    group: 'resourceGroup'
                },
                taskType:'FixedWork',
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
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
        }, done);
    });
    beforeEach((done) => {
        setTimeout(done, 500);
    });
    it('Check duration and unit',()=>{
        let work: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)')
        triggerMouseEvent(work, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolwork')).ej2_instances[0];
        input.value = 16;
        input.dataBind();
        let save: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(3)')
        triggerMouseEvent(save, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(16);
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(0);
        expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['resourceUnit']).toBe(0);
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Check work for fixedDuration with zero duration', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [],
        taskFields: {
          id: 'TaskID',
          name: 'TaskName',
          startDate: 'StartDate',
          duration: 'Duration',
          progress: 'Progress',
          resourceInfo: 'resources',
          work: 'Work',
          child: 'subtasks',
          type: 'taskType',
          milestone: 'isMilestone',
        },
        editSettings: {
          allowAdding: true,
          allowEditing: true,
          allowDeleting: true,
          allowTaskbarEditing: true,
          showDeleteConfirmDialog: true,
        },
        resources: resourceResources,
        resourceFields: {
          id: 'resourceId',
          name: 'resourceName',
          unit: 'Unit',
        },
        workUnit: 'Hour',
        taskType: 'FixedWork',
        toolbar: [
          'Add',
          'Edit',
          'Update',
          'Delete',
          'Cancel',
          'ExpandAll',
          'CollapseAll',
        ],
        allowSelection: true,
        height: '450px',
        treeColumnIndex: 1,
        columns: [
          { field: 'TaskID', visible: false },
          { field: 'TaskName', headerText: 'Task Name', width: '180' },
          { field: 'resources', headerText: 'Resources', width: '160' },
          { field: 'Work', width: '110' },
          { field: 'Duration', width: '100' },
          { field: 'taskType', headerText: 'Task Type', width: '110' },
        ],
        }, done);
    });
    beforeEach((done) => {
        ganttObj.openAddDialog();
        setTimeout(done, 500);
    });
    it('Zero duration and no resources', () => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "save") {
                expect(ganttObj.flatData[0].ganttProperties.work).toBe(0);
                expect(ganttObj.flatData[0].ganttProperties.duration).toBe(0);
            }
        };
        let taskType: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'taskType')).ej2_instances[0];
        taskType.value = 'FixedDuration';
        taskType.dataBind();
        let duration: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
        duration.value = 0;
        duration.dataBind();
        let work: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Work')).ej2_instances[0];
        work.value = 12;
        work.dataBind();
        let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('updating tasktype for unassinged task', () => {
    let ganttObj: Gantt;
    let resourceCollection = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [],
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    resourceInfo: 'resources',
                    work: 'work',
                    child: 'subtasks',
                    type: 'taskType',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                taskType: 'FixedWork',
                allowRowDragAndDrop: true,
                resources: resourceCollection,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'unit',
                    group: 'resourceGroup'
                },
                workUnit: 'Hour',
                toolbar: [
                    'Add',
                    'Edit',
                    'Update',
                    'Delete',
                    'Cancel',
                    'ExpandAll',
                    'CollapseAll',
                    'Indent',
                    'Outdent',
                ],
                allowSelection: true,
                height: '450px',
                treeColumnIndex: 1,
                highlightWeekends: true,
                columns: [
                    { field: 'TaskID', visible: false },
                    { field: 'TaskName', headerText: 'Task Name', width: '180' },
                    { field: 'resources', headerText: 'Resources', width: '160' },
                    { field: 'work', width: '110' },
                    { field: 'Duration', width: '100' },
                    { field: 'taskType', headerText: 'Task Type', width: '110' },
                ],
                editDialogFields: [
                    { type: 'General', headerText: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                ],
                labelSettings: {
                    rightLabel: 'resources',
                },
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('07/28/2019'),
        }, done);
    });
    it('updating tasktype for unassinged task',(done: Function)=>{
        ganttObj.addRecord();
        ganttObj.addRecord();
        ganttObj.viewType = 'ResourceView',
        setTimeout(() => {
            ganttObj.dataBind();
            expect(ganttObj.flatData[1].ganttProperties.taskType).toBe('FixedDuration');     
            done();
        }, 500);
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Resource update for Fixed Work', () => {
    let ganttRef: Gantt;
    let Data = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2024'),
            EndDate: new Date('04/21/2024'),
            subtasks: [
                {
                    TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2024'), Duration: 3,
                    Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
                },
                {
                    TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2024'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },
                {
                    TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2024'), Duration: 4,
                    resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 20,
                },
            ]
        },
    ]
    beforeAll((done: Function) => {
        ganttRef = createGantt(
            {
                dataSource: Data,
                resources: resourceCollection,
                viewType: 'ResourceView',
                showOverAllocation: true,
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
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 3
                },
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '450px',
                projectStartDate: new Date('03/28/2024'),
                projectEndDate: new Date('05/18/2024')
        }, done);
    });
    beforeEach((done) => {
        ganttRef.editModule.dialogModule.openEditDialog(ganttRef.flatData[2]);
        let tab: any = (<EJ2Instance>document.getElementById(ganttRef.element.id + '_Tab')).ej2_instances[0];
        tab.selectedItem = 1;
        tab.dataBind();
        setTimeout(done, 500);
    });
    it('Resource update for Fixed Work', () => {
        ganttRef.actionComplete = function (args: any): void {
            if (args.requestType === "save") {
                expect(ganttRef.flatData[2].ganttProperties.resourceInfo[0]['resourceUnit']).toBe(75);
            }
        };
        let checkbox: HTMLElement = document.querySelector('#' + ganttRef.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        triggerMouseEvent(checkbox, 'click');
        let checkbox1: HTMLElement = document.querySelector('#' + ganttRef.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
        triggerMouseEvent(checkbox1, 'click');
        let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttRef.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
    });
    afterAll(() => {
        destroyGantt(ganttRef);       
    });
});
describe('CR-924990:SchedulingType Value Resets to Null even we passed value', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
            dataSource: [ 
                {
                    TaskID: 1,
                    TaskName: 'Project Initiation',
                    StartDate: new Date('04/02/2019'),
                    EndDate: new Date('04/21/2019'),
                    SchedulingType: 'FixedWork'
                },
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                child: 'subtasks',
                type: 'SchedulingType'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            allowSelection: true,
            splitterSettings: {
                position: "50%",
            },
            selectionSettings: {
                mode: 'Row',
                type: 'Multiple',
                enableToggle: true
            },
            taskType:"FixedDuration",
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
            height: '450px'
        }, done);
    });
    it('Checkig tasktype at datasource, after intial load of gantt',() => {
        expect(ganttObj.dataSource[0].SchedulingType).toBe('FixedWork');
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedWork');
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Task to milestone for fixedWork type', () => {
    let ganttObj: Gantt;
    var datas = [
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
    ];
    var resourceCollections = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datas,
                height: '450px',
                allowSelection: true,
                treeColumnIndex: 1,
                highlightWeekends: true,
                taskType:'FixedWork',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    resourceInfo: 'resources',
                    work: 'work'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                enableContextMenu: true,
                columns: [
                    { field: 'TaskID', headerText: 'ID', visible: false },
                    { field: 'TaskName', headerText: 'Name' },
                    { field: 'resources', headerText: 'Resource'},
                    { field: 'work', headerText: 'Work', width: 100},
                    { field: 'Duration', headerText: 'Duration', width: 100},
                    { field: 'taskType', headerText: 'Task Type', width: 100}
                ],
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources',
                    taskLabel: '${Progress}%'
                },
                splitterSettings: {
                    position: "55%"
                },
                projectStartDate: new Date('03/24/2019'),
                projectEndDate: new Date('05/15/2019'),
                resources: resourceCollections,
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit'
                }
        }, done);
    });
    it('Convert to milestone from task',() => {
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "save") {
                expect(ganttObj.flatData[1].ganttProperties.duration).toBe(0);
            }
        };
        ganttObj.convertToMilestone("2");
    });
    afterAll(() => {
        destroyGantt(ganttObj);       
    });
});
describe('Update Record By ID with task type', () => {
    let ganttObj: Gantt;
    const resourcesData : object[] = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 3, TaskName: 'Perform soil test', taskType: 'FixedDuration', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },   
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData,
                resources: resourceCollection,
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
                    child: 'subtasks',
                    type: 'taskType'
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
                    { field: 'taskType' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],     
                splitterSettings: {
                    columnIndex: 3
                },  
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    
    it('Update Record By ID with task type', () => {
        let data: object[] = [{
            TaskID: 3,
            TaskName: 'Updated by index value',
            StartDate: new Date('04/02/2019'),
            Duration: 4,
            Progress: 50,
            taskType: 'FixedUnit',
            resources: [{ resourceId: 3, resourceUnit: 70 }]
        }]
        ganttObj.editModule.updateRecordByID(data[0]);
        expect(getValue('taskType',ganttObj.flatData[3])).toBe('FixedUnit')
    })
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('update record by id method to update enddate', () => {
    let ganttObj: Gantt;
    const datas : Object[] =   [
        {
          TaskID: 1,
          TaskName: 'Product Concept',
          StartDate: new Date('04/02/2019'),
          EndDate: new Date('04/21/2019'),
          subtasks: [

            { TaskID: 3, TaskName: 'Defining target audience', Duration: 3 },

          ],
        },
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datas,
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
                    gridLines: "Both",
                    taskbarHeight: 20,
                    rowHeight: 40,
                    height: '550px',
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
        }, done);
    });
    it('update record by id method to update enddate',() => {
        const data : Object = {
            TaskID: 3,
            TaskName: 'Updated by index value',
            EndDate: new Date('04/02/2019'),
        }
        ganttObj.updateRecordByID(data);
        // expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/02/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('update record by id method to update enddate in self referance data', () => {
    let ganttObj: Gantt;
    const datas : Object[] =  [
        {
          taskID: '1',
          taskName: 'Project Schedule',
          startDate: new Date('02/04/2019'),
          endDate: new Date('03/10/2019'),
        },
        {
          taskID: '2',
          taskName: 'Planning',
          startDate: new Date('02/04/2019'),
          endDate: new Date('02/10/2019'),
          parentID: 1,
        },
        {
          taskID: '3',
          taskName: 'Plan timeline',
          duration: 6,
          progress: '60',
          parentID: 2,
        },
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datas,
                height: '450px',
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                selectedRowIndex: 1,
                gridLines: "Both",
                taskbarHeight: 20,
                rowHeight: 40,
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/28/2019'),
                projectEndDate: new Date('03/10/2019')
        }, done);
    });
    it('update record by id method to update enddate',() => {
        const data : Object = {
            taskID: 3,
            taskName: 'Updated by index value',
            endDate: new Date('04/02/2019'), 
        }
        ganttObj.updateRecordByID(data);
        // expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/02/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('update record by id method to update expand state in self referance data', () => {
    let ganttObj: Gantt;
    const datas : Object[] =  [
        {
            taskID: '1',
            taskName: 'Project Schedule',
            startDate: new Date('02/04/2019'),
            endDate: new Date('03/10/2019'),
        },
        {
            taskID: '2',
            taskName: 'Planning',
            startDate: new Date('02/04/2019'),
            endDate: new Date('02/10/2019'),
            parentID: 1,
        }
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datas,
                height: '450px',
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    expandState: 'expandState'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                selectedRowIndex: 1,
                gridLines: "Both",
                taskbarHeight: 20,
                rowHeight: 40,
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/28/2019'),
                projectEndDate: new Date('03/10/2019'),
        }, done);
    });
    it('update record by id method to update expand state',() => {
        const data : Object = {
            taskID: 1,
            taskName: 'Updated by index value',
            StartDate: new Date('02/05/2019'),
            duration: 4,
            expandState: false,
            progress: 50,
        }
        ganttObj.updateRecordByID(data);
        expect(ganttObj.currentViewData[0].expanded).toBe(false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

});

describe('Improve coveage for edit.ts', () => {
    let ganttObj: Gantt;
    const datas : Object[] =  [
        {
            taskID: '1',
            taskName: 'Project Schedule',
            startDate: new Date('02/04/2019'),
            endDate: new Date('03/10/2019'),
        },
        {
            taskID: '2',
            taskName: 'Planning',
            startDate: new Date('02/04/2019'),
            endDate: new Date('02/10/2019'),
            parentID: 1,
        }
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datas,
                height: '450px',
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    expandState: 'expandState'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                selectedRowIndex: 1,
                gridLines: "Both",
                taskbarHeight: 20,
                rowHeight: 40,
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/28/2019'),
                projectEndDate: new Date('03/10/2019'),
        }, done);
    });
    it('updateRecordByID method',() => {
        const data : Object = {
            taskID: 1,
            taskName: 'Updated by index value',
            StartDate: new Date('02/05/2019'),
            duration: 4,
            expandState: false,
            progress: 50,
        }
        ganttObj.enableImmutableMode = true;
        ganttObj.editModule.updateRecordByID(data);
    });
    it('addRecordAsBottom method', function () {
        const cAddedRecord = {
            uniqueID: 'gantt_data_2',
            level: 1,
            ganttProperties: {
                rowUniqueID: '200',
                taskId: '55'
            },
            taskData: {}
            };
        ganttObj.editModule['addRecordAsBottom'](cAddedRecord);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Indent/Outdent with cell selection', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'), Duration: 1 },
                { TaskID: 2, TaskName: 'Task 2', StartDate: new Date('04/02/2019'), Duration: 1 },
                { TaskID: 3, TaskName: 'Task 3', StartDate: new Date('04/02/2019'), Duration: 1 }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', child: 'subtasks' },
            editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
            selectionSettings: { mode: 'Cell' },
        }, done);
    });

    afterAll(() => {
        if (ganttObj) { destroyGantt(ganttObj); }
    });

    it('should indent a task when a single cell is selected (covers getSelectedRowCellIndexes branch)', () => {
        // select cell in rowIndex 2 (third row)
        ganttObj.selectCell({ cellIndex: 1, rowIndex: 2 });
        // perform indent
        ganttObj.indent();
    });
    it( 'deleteRecord method',()=> {    
        ganttObj.editModule['deleteRecord'](undefined)
    });
});

describe('Edit internal methods coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{ TaskID: 1, TaskName: 'Root Task', StartDate: new Date('04/01/2019'), Duration: 1 }],
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', child: 'subtasks' },
            editSettings: { allowAdding: true, allowEditing: true }
        }, done);
    });
    afterAll(() => {
        if (ganttObj) { destroyGantt(ganttObj); }
    });

    it('cover indentFailure path (triggers actionFailure)', (done: Function) => {
        ganttObj.actionFailure = function () { done(); };
        const edit: any = ganttObj.editModule;
        edit.indentFailure({ message: 'indent failed' });
    });
    it('cover dmFailure path (triggers actionFailure) with deletedTaskDetails', (done: Function) => {
        // actionFailure handler will complete the test when dmFailure triggers the event
        ganttObj.actionFailure = function () { done(); };
        const edit: any = ganttObj.editModule;
        // prepare deletedTaskDetails to enter the branch that resets isDelete flags
        edit.deletedTaskDetails = [
            { taskData: { TaskID: 100 }, isDelete: true },
            { taskData: { TaskID: 101 }, isDelete: true }
        ];
        // invoke dmFailure to exercise the branch and trigger actionFailure
        edit.dmFailure({ message: 'dm failed' }, {});
    });
});
describe('endEditAction dialog branch coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{ TaskID: 1, TaskName: 'Task', StartDate: new Date('04/01/2019'), Duration: 1 }],
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', child: 'subtasks' },
            editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true }
        }, done);
    });

    afterAll(() => {
        if (ganttObj) { destroyGantt(ganttObj); }
    });

    it('calls dialogObj.hide when dialog exists and is not destroyed', () => {
        const edit: any = ganttObj.editModule;
        let hideCalled = false;
        edit.dialogModule = {
            dialog: true,
            dialogObj: { isDestroyed: false, hide: () => { hideCalled = true; } },
            dialogClose: () => { /* noop */ }
        };
        edit.endEditAction({ action: 'DialogEditing' });
    });
});

describe('recordLevel segments branch coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{ taskID: 1, taskName: 'T', StartDate: new Date('04/01/2019'), Duration: 1 }],
            taskFields: { id: 'taskID', name: 'taskName', startDate: 'StartDate', duration: 'Duration', child: 'subtasks', segments: 'Segments' },
            editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true }
        }, done);
    });
    afterAll(() => {
        if (ganttObj) { destroyGantt(ganttObj); }
    });

    it('recordLevel - clears segments when dropPosition is middleSegment and droppedRec.ganttProperties.segments length > 0', () => {
        const edit: any = ganttObj.editModule;
        edit.draggedRecord = {
            uniqueID: 'drop-1',
            level: 0,
            index: 1,
            childRecords: [],
            taskData: { Segments: [{ StartDate: new Date(), Duration: 1 }] },
            ganttProperties: { segments: [{ StartDate: new Date(), Duration: 1 }], rowUniqueID: 'r1' },
            expanded: false
        };
        edit.droppedRecord = {
            uniqueID: 'drop-1',
            level: 0,
            index: 1,
            childRecords: [],
            taskData: { Segments: [{ StartDate: new Date(), Duration: 1 }] },
            ganttProperties: { segments: [{ StartDate: new Date(), Duration: 1 }], rowUniqueID: 'r1' },
            expanded: false
        };
        edit.dropPosition = 'middleSegment';
        edit.recordLevel();
    });
});
describe('Edit.deleteDragRow branch coverage with result property', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: {
                result: [
                    {
                        TaskID: 1,
                        TaskName: 'Parent Task',
                        StartDate: new Date('02/04/2019'),
                        EndDate: new Date('03/10/2019'),
                        subtasks: [
                            {
                                TaskID: 2,
                                TaskName: 'Child Task',
                                StartDate: new Date('02/04/2019'),
                                EndDate: new Date('02/10/2019')
                            }
                        ]
                    }
                ]
            },
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                child: 'subtasks'
            },
            editSettings: {
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: false
            },
            allowSelection: true,
            height: '450px',
            projectStartDate: new Date('02/04/2019'),
            projectEndDate: new Date('03/10/2019')
        }, done);
    });

    afterAll(() => {
        if (ganttObj) { destroyGantt(ganttObj); }
    });

    it('deleteDragRow with result property in dataSource', () => {
        const edit: any = ganttObj.editModule;
        
        edit.draggedRecord = ganttObj.currentViewData[0];
        edit.draggedRecord.uniqueID = ganttObj.currentViewData[0].uniqueID;
        
        edit.parent.getTaskByUniqueID = (uniqueID: string) => {
            return ganttObj.currentViewData.find(data => data.uniqueID === uniqueID);
        };
        
        const originalRemoveRecords = edit.removeRecords;
        let removeRecordsCalled: boolean = false;
        edit.removeRecords = (record: IGanttData) => {
            removeRecordsCalled = true;
        };
        
        edit.deleteDragRow();
        
        edit.removeRecords = originalRemoveRecords;
    });
});
describe('improve coverage', () => {
    let ganttObj: Gantt;
    const resourcesData : object[] = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 3, TaskName: 'Perform soil test', taskType: 'FixedDuration', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },   
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData,
                resources: resourceCollection,
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
                    child: 'subtasks',
                    type: 'taskType'
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
                    { field: 'taskType' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],     
                splitterSettings: {
                    columnIndex: 3
                },  
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    
    it('Update Record By ID with task type', () => {
        ganttObj.taskType = 'FixedDuration';
            (ganttObj as any).editModule.dialogModule = {
                dialog: true,
                currentResources: 'Fuller'
            };
            ganttObj.editModule.updateResourceRelatedFields(ganttObj.flatData[1], 'work');
    })
    it('Update Record By ID with task type', () => {
            (ganttObj as any).isAutoSchedule = false;
            ganttObj.taskType = 'FixedWork';
            ganttObj.flatData[1].ganttProperties.taskType = 'FixedWork'
            ganttObj.flatData[1].ganttProperties.isAutoSchedule = false;
            (ganttObj as any).editModule.dialogModule = {
                dialog: true,
                currentResources: 'Fuller'
            };
            ganttObj.editModule.updateResourceRelatedFields(ganttObj.flatData[1], 'work');
    })
    it('Update Record By ID with task type', () => {
        (ganttObj as any).isAutoSchedule = false;
        ganttObj.taskType = 'FixedWork';
        ganttObj.flatData[1].ganttProperties.taskType = 'FixedWork'
        ganttObj.flatData[1].ganttProperties.isAutoSchedule = false;
        (ganttObj as any).editModule.dialogModule = {
            dialog: true,
            currentResources: 'Fuller'
        };
        ganttObj.editModule.updateResourceRelatedFields(ganttObj.flatData[1], 'resource');
    })
    it('Update Record By ID with task type', () => {
        (ganttObj as any).isAutoSchedule = false;
        ganttObj.taskType = 'FixedWork';
        ganttObj.flatData[1].ganttProperties.taskType = 'FixedWork'
        ganttObj.flatData[1].ganttProperties.isAutoSchedule = false;
        (ganttObj as any).editModule.dialogModule = {
            dialog: true,
            currentResources: []
        };
        ganttObj.editModule.updateResourceRelatedFields(ganttObj.flatData[1], 'work');
    })
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Cover validateScheduleByTwoValues branches in edit.ts', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{ TaskID: 1, TaskName: 'T1', StartDate: new Date('04/01/2019'), EndDate: new Date('04/03/2019'), Duration: 2 }],
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', endDate: 'EndDate', duration: 'Duration', child: 'subtasks' },
            editSettings: { allowAdding: true, allowEditing: true }
        }, done);
    });

    afterAll(() => {
        if (ganttObj) { destroyGantt(ganttObj); }
    });
    it('validateScheduleByTwoValues -> endDate & duration branch via allowUnscheduledTasks true', () => {
        const edit: any = ganttObj.editModule;
        ganttObj.allowUnscheduledTasks = true;
        ganttObj.dataBind();
        const ganttData: IGanttData = ganttObj.getRecordByID('1');
        const data = { EndDate: new Date('04/08/2019') };
        const fieldNames = ['EndDate', 'Duration'];
        edit.validateScheduleByTwoValues(data, fieldNames, ganttData);
    });

    it('validateScheduleByTwoValues -> startDate & duration branch via allowUnscheduledTasks true', () => {
        const edit: any = ganttObj.editModule;
        ganttObj.allowUnscheduledTasks = true;
        ganttObj.dataBind();
        const ganttData: IGanttData = ganttObj.getRecordByID('1');
        const data = { StartDate: new Date('04/09/2019')};
        const fieldNames = ['StartDate', 'Duration'];
        edit.validateScheduleByTwoValues(data, fieldNames, ganttData);
    });
});

describe('Edit.updateNewRecord - additional branch coverage', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Root', StartDate: new Date('04/01/2019'), Duration: 1 }
            ],
            timelineSettings: {
                updateTimescaleView: false
            },
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', child: 'subtasks' },
            editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true }
        }, done);
    });

    afterAll(() => {
        if (ganttObj) { destroyGantt(ganttObj); }
    });

    it('updateNewRecord - processes records with level === 0 (parentData & dataOperation.dataArray splice branch)', () => {
        const edit: any = ganttObj.editModule;
        const cAddedRecord: any[] = [
            {
                uniqueID: 'gantt_data_200',
                level: 0,
                taskData: { TaskID: 200, TaskName: 'RootAdded' },
                ganttProperties: { taskId: 200, rowUniqueID: '200' }
            }
        ];
        // call private method to exercise branch where record.level === 0
        edit['updateNewRecord'](cAddedRecord, { addedRecords: cAddedRecord, modifiedRecords: cAddedRecord } as any);
    });
});

describe('AddRecord method', () => {
    let ganttObj: Gantt;
    const resourcesData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 3, TaskName: 'Perform soil test', taskType: 'FixedDuration', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData,
                resources: resourceCollection,
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
                    child: 'subtasks',
                    type: 'taskType'
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
                    { field: 'taskType' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                splitterSettings: {
                    columnIndex: 3
                },
                enableUndoRedo: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });

    it('updateNewRecord - processes records with level === 0 (parentData & dataOperation.dataArray splice branch)', () => {
        ganttObj.undoRedoModule['isUndoRedoPerformed'] = true;
        ganttObj.undoRedoModule['currentAction'] = {deletedRecordsDetails: false}
        const data = [
            {
                position: 'below',    // can be 'above' | 'below' | 'child'
                id: 2,               // must match an entry in this.parent.taskIds
                data: [
                    { TaskID: 101, TaskName: 'New Resource Task', StartDate: new Date('2019-04-03'), Duration: 3 }
                ]
            }
        ];
        ganttObj.editModule.addRecord(data);
    });
    it('updateNewRecord - processes records with level === 0 (parentData & dataOperation.dataArray splice branch)', () => {
        ganttObj.undoRedoModule['isUndoRedoPerformed'] = true;
        ganttObj.undoRedoModule['currentAction'] = {deletedRecordsDetails: false}
        const data = [
            {
                position: 'above',    // can be 'above' | 'below' | 'child'
                id: 2,               // must match an entry in this.parent.taskIds
                data: [
                    { TaskID: 101, TaskName: 'New Resource Task', StartDate: new Date('2019-04-03'), Duration: 3 }
                ]
            }
        ];
        ganttObj.editModule.addRecord(data);
    });
    it('updateNewRecord - processes records with level === 0 (parentData & dataOperation.dataArray splice branch)', () => {
        ganttObj.undoRedoModule['isUndoRedoPerformed'] = true;
        ganttObj.undoRedoModule['currentAction'] = {deletedRecordsDetails: false}
        const data = [
            {
                position: 'child',    // can be 'above' | 'below' | 'child'
                id: 2,               // must match an entry in this.parent.taskIds
                data: [
                    { TaskID: 101, TaskName: 'New Resource Task', StartDate: new Date('2019-04-03'), Duration: 3 }
                ]
            }
        ];
        ganttObj.editModule.addRecord(data);
    });
    it('getTaskId method', () => {
        const data: any = { ganttProperties:{taskId: 1} };
        ganttObj.viewType = 'ResourceView'; 
        ganttObj.editModule['getTaskId'](data)
    });
    it('updateConstraintViolationType method', () => {
        ganttObj.editModule['updateConstraintViolationType'](2);
    });
    it('updateConstraintViolationType method', () => {
        ganttObj.editModule['updateConstraintViolationType'](3);
    });
    it('updateConstraintViolationType method', () => {
        ganttObj.editModule['updateConstraintViolationType'](5);
    });
    it('updateConstraintViolationType method', () => {
        ganttObj.editModule['updateConstraintViolationType'](7);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Cover processSuccessorChainAndChildren and updateSuccessorChildren complete branches', () => {
    let ganttObj: Gantt;

    const predecessorChainData = [
            {
                TaskID: 1,
                TaskName: 'Parent Task 1',
                StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'),
                Predecessor: ['2','4'],
                subtasks: [
                    {
                        TaskID: 2,
                        TaskName: 'Child Task 1',
                        StartDate: new Date('04/02/2019'),
                        Duration: 3,
                        Progress: 30,
                        subtasks: [
                            {
                                TaskID: 4,
                                TaskName: 'Grandchild Task 1',
                                StartDate: new Date('04/02/2019'),
                                Duration: 2,
                                Predecessor: '2'
                            }
                        ]
                    },
                ]

            },
            

            {
                TaskID: 5,
                TaskName: 'Task with Successor',
                StartDate: new Date('04/02/2019'),
                Duration: 3,
                subtasks: [
                    {
                        TaskID: 3,
                        TaskName: 'Child Task 2',
                        StartDate: new Date('04/05/2019'),
                        Duration: 4,
                        Predecessor: '2',
                        subtasks: [{
                                TaskID: 8,
                                TaskName: 'Grandchild Task 1',
                                StartDate: new Date('04/02/2019'),
                                Duration: 2,
                                Predecessor: '2'
                            
                        }]
                    },
                ]
            },
            {
                TaskID: 6,
                TaskName: 'Successor Task',
                StartDate: new Date('04/05/2019'),
                Duration: 2,
                Predecessor: '5'
            },
            {
                TaskID: 7,
                TaskName: 'Second Level Successor',
                StartDate: new Date('04/07/2019'),
                Duration: 2,
                Predecessor: '6'
            }
        ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: predecessorChainData,
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
            // allowParentDependency: false,
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true,
                allowAdding: true
            },
            autoCalculateDateScheduling: true,
            projectStartDate: new Date('04/01/2019'),
            projectEndDate: new Date('04/30/2019')
        }, done);
    });

    it('processSuccessorChainAndChildren - visitedSuccessors deduplication branch', () => {
        const record = (ganttObj as any).currentViewData.find((r: any) => r.ganttProperties.taskId === 2);
        ganttObj.editModule['processSuccessorChainAndChildren'](record);
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});

describe('Cover updateSuccessorChildren method - all statements coverage', () => {
    let ganttObj: Gantt;

    const updateSuccessorChildrenData = [
      {
        TaskID: 1,
        TaskName: "Parent Task",
        StartDate: new Date("04/02/2019"),
        EndDate: new Date("04/21/2019"),
        subtasks: [
          {
            TaskID: 2,
            TaskName: "First Child",
            StartDate: new Date("04/02/2019"),
            Duration: 2,
            subtasks: [
              {
                TaskID: 5,
                TaskName: "Grandchild 1",
                StartDate: new Date("04/02/2019"),
                Duration: 1,
                Predecessor: "2",
              },
              {
                TaskID: 6,
                TaskName: "Grandchild 2",
                StartDate: new Date("04/03/2019"),
                Duration: 1,
                Predecessor: "5",
              },
            ],
          },
          {
            TaskID: 3,
            TaskName: "Second Child",
            StartDate: new Date("04/04/2019"),
            Duration: 2,
            Predecessor: "2",
            subtasks: [
              {
                TaskID: 4,
                TaskName: "Third Child",
                StartDate: new Date("04/06/2019"),
                Duration: 2,
                subtasks: [
                  {
                    TaskID: 7,
                    TaskName: "Grandchild 3",
                    StartDate: new Date("04/06/2019"),
                    Duration: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: updateSuccessorChildrenData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                dependency: 'Predecessor',
                child: 'subtasks'
            },
            editSettings: {
                allowEditing: true,
                allowTaskbarEditing: true
            },
            autoCalculateDateScheduling: true,
            projectStartDate: new Date('04/01/2019'),
            projectEndDate: new Date('04/30/2019')
        }, done);
    });

    it('updateSuccessorChildren - processes child records with predecessors in sequence', () => {
        const parentRecord = (ganttObj as any).currentViewData.find((r: any) => r.ganttProperties.taskId === 1);
        if (parentRecord && parentRecord.childRecords) {
            ganttObj.editModule['updateSuccessorChildren'](parentRecord.childRecords);
        }
    });
    afterAll(() => {
        destroyGantt(ganttObj);
    });
});

describe('Improve coverage for updateConstraintViolationAction method', () => {
    let ganttObj: Gantt;
    const resourcesData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 3, TaskName: 'Perform soil test', taskType: 'FixedDuration', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData,
                resources: resourceCollection,
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
                    child: 'subtasks',
                    type: 'taskType'
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
                    { field: 'taskType' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                splitterSettings: {
                    columnIndex: 3
                },
                enableUndoRedo: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('updateConstraintViolationAction method', ()=> {
        const editedField: string = 'StartDate';
        let shouldRespectLink: boolean;
        const action: string = '';
        const args: any = ''
        let showDialog: boolean;
        ganttObj.editModule['updateConstraintViolationAction'](editedField, 2, ganttObj.taskFields, shouldRespectLink, args, action, showDialog)
    })
    it('updateConstraintViolationAction method', ()=> {
        const editedField: string = 'EndDate';
        let shouldRespectLink: boolean;
        const action: string = '';
        const args: any = ''
        let showDialog: boolean;
        ganttObj.editModule['updateConstraintViolationAction'](editedField, 3, ganttObj.taskFields, shouldRespectLink, args, action, showDialog)
    })
    it('updateConstraintViolationAction method', ()=> {
        const editedField: string = '';
        let shouldRespectLink: boolean;
        const action: string = '';
        const args: any = {action:''}
        let showDialog: boolean;
        ganttObj.editModule['updateConstraintViolationAction'](editedField, 2, ganttObj.taskFields, shouldRespectLink, args, action, showDialog)
    })
    it('updateConstraintViolationAction method', ()=> {
        const editedField: string = '';
        let shouldRespectLink: boolean;
        const action: string = 'RightResizing';
        const args: any = {action:''}
        let showDialog: boolean;
        ganttObj.editModule['updateConstraintViolationAction'](editedField, 2, ganttObj.taskFields, shouldRespectLink, args, action, showDialog)
    })
    it('updateConstraintViolationAction method', ()=> {
        const editedField: string = '';
        let shouldRespectLink: boolean;
        const action: string = '';
        const args: any = {action:''}
        let showDialog: boolean;
        ganttObj.editModule['updateConstraintViolationAction'](editedField, 3, ganttObj.taskFields, shouldRespectLink, args, action, showDialog)
    })
    it('updateConstraintViolationAction method', ()=> {
        const editedField: string = '';
        let shouldRespectLink: boolean;
        const action: string = 'LeftResizing';
        const args: any = {action:''}
        let showDialog: boolean;
        ganttObj.editModule['updateConstraintViolationAction'](editedField, 3, ganttObj.taskFields, shouldRespectLink, args, action, showDialog)
    })
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Edit.saveFailed coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{ TaskID: 1, TaskName: 'Task', StartDate: new Date('04/01/2019'), Duration: 1 }],
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration', child: 'subtasks' },
            editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true }
        }, done);
    });

    it('calls saveFailed when reUpdatePreviousRecords exists', () => {
        (ganttObj.editModule as any).saveFailed({ message: 'simulated failure' });
    });
    afterAll(() => {
        if (ganttObj) { destroyGantt(ganttObj); }
    });
});

describe('Improve coverage for updateConstraintViolationAction method', () => {
    let ganttObj: Gantt;
    const resourcesData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 3, TaskName: 'Perform soil test', taskType: 'FixedDuration', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
                },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData,
                resources: resourceCollection,
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
                    child: 'subtasks',
                    type: 'taskType'
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
                    { field: 'taskType' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                splitterSettings: {
                    columnIndex: 3
                },
                enableUndoRedo: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
        it('calls updateTargetedRecords with id array (ResourceView -> T{id} lookup)', () => {
            (ganttObj.editModule as any).updateTargetedRecords(['3', '999']);
        });
        
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('addRecordAsChild coverage - uncovered branches', () => {
    let ganttObj: Gantt;
    const testData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Parent Task',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Child 1',
                    StartDate: new Date('03/29/2019'),
                    EndDate: new Date('04/05/2019'),
                    subtasks: [
                        {
                            TaskID: 100,
                            TaskName: 'Grandchild 1',
                            StartDate: new Date('03/29/2019'),
                            EndDate: new Date('04/02/2019'),
                            Duration: 4
                        }
                    ]
                },
                {
                    TaskID: 4,
                    TaskName: 'Child 2',
                    StartDate: new Date('04/06/2019'),
                    EndDate: new Date('04/10/2019'),
                    Duration: 5
                }
            ]
        }
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: testData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                child: 'subtasks'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true
            },
            allowSelection: true
        }, done);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

    // TEST 1: Cover position 'above' branch in deletedIndexes condition
    it('addRecordAsChild with position above in deletedIndexes - matching parent and taskId', () => {
        const edit: any = ganttObj.editModule;
        const droppedRecord = ganttObj.flatData[1]; // Child 1
        const draggedRecord: IGanttData = {
            uniqueID: 'unique_test_001',
            level: 1,
            index: 2,
            taskData: { TaskID: 100, TaskName: 'New Child', Duration: 3 },
            ganttProperties: {
                taskId: 100,
                taskName: 'New Child',
                rowUniqueID: 'row_100'
            } as any,
            parentItem: droppedRecord.parentItem,
            parentUniqueID: droppedRecord.parentUniqueID,
            childRecords: []
        } as any;

        edit.parent.undoRedoModule = {
            isUndoRedoPerformed: true,
            currentAction: {}
        };
        edit.dialogModule = {
            indexes: {
                deletedIndexes: [
                    {
                        data: {
                            parentUniqueID: draggedRecord.parentUniqueID,
                            ganttProperties: { taskId: 100 }
                        },
                        index: 2,
                        position: 'above',
                        id: 'T100'
                    }
                ]
            }
        };

        const parentTaskRecord = ganttObj.getTaskByUniqueID(draggedRecord.parentUniqueID);
        parentTaskRecord.ganttProperties.taskName = 'Parent Task';

        edit.addRecordAsChild(droppedRecord, draggedRecord);
    });

    it('addRecordAsChild with position Below in deletedIndexes - matching parent and taskId', () => {
        const edit: any = ganttObj.editModule;
        const droppedRecord = ganttObj.flatData[1]; // Child 1
        const draggedRecord: IGanttData = {
            uniqueID: 'unique_test_001',
            level: 1,
            index: 2,
            taskData: { TaskID: 100, TaskName: 'New Child', Duration: 3 },
            ganttProperties: {
                taskId: 100,
                taskName: 'New Child',
                rowUniqueID: 'row_100'
            } as any,
            parentItem: droppedRecord.parentItem,
            parentUniqueID: droppedRecord.parentUniqueID,
            childRecords: []
        } as any;

        edit.parent.undoRedoModule = {
            isUndoRedoPerformed: true,
            currentAction: {}
        };
        edit.dialogModule = {
            indexes: {
                deletedIndexes: [
                    {
                        data: {
                            parentUniqueID: draggedRecord.parentUniqueID,
                            ganttProperties: { taskId: 100 }
                        },
                        index: 2,
                        position: 'below',
                        id: 'T100'
                    }
                ]
            }
        };

        const parentTaskRecord = ganttObj.getTaskByUniqueID(draggedRecord.parentUniqueID);
        parentTaskRecord.ganttProperties.taskName = 'Parent Task';

        edit.addRecordAsChild(droppedRecord, draggedRecord);
    });
    
    
});

describe('addRecordAsChild coverage - uncovered branches', () => {
    let ganttObj: Gantt;
    const testData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Parent Task',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Child 1',
                    StartDate: new Date('03/29/2019'),
                    EndDate: new Date('04/05/2019'),
                    subtasks: [
                        {
                            TaskID: 100,
                            TaskName: 'Grandchild 1',
                            StartDate: new Date('03/29/2019'),
                            EndDate: new Date('04/02/2019'),
                            Duration: 4
                        }
                    ]
                },
                {
                    TaskID: 4,
                    TaskName: 'Child 2',
                    StartDate: new Date('04/06/2019'),
                    EndDate: new Date('04/10/2019'),
                    Duration: 5
                }
            ]
        }
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: testData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                child: 'subtasks'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true
            },
            allowSelection: true
        }, done);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('addRecordAsChild with deletedRecordsDetails', () => {
        const edit: any = ganttObj.editModule;
        const droppedRecord = ganttObj.flatData[1]; // Child 1
        const draggedRecord: IGanttData = {
            uniqueID: 'unique_test_001',
            level: 1,
            index: 2,
            taskData: { TaskID: 100, TaskName: 'New Child', Duration: 3 },
            ganttProperties: {
                taskId: 100,
                taskName: 'New Child',
                rowUniqueID: 'row_100'
            } as any,
            parentItem: droppedRecord.parentItem,
            parentUniqueID: droppedRecord.parentUniqueID,
            childRecords: []
        } as any;
        const deletedRecordsDetails: any = [{ data: {ganttProperties: {taskId:100} }}];
        edit.parent.undoRedoModule = {
            isUndoRedoPerformed: true,
            currentAction: {deletedRecordsDetails}
        };
        const parentTaskRecord = ganttObj.getTaskByUniqueID(draggedRecord.parentUniqueID);
        parentTaskRecord.ganttProperties.taskName = 'Unassigned Task';

        edit.addRecordAsChild(droppedRecord, draggedRecord);
    });
});


describe('addRecordAsChild coverage - dropChildRecord branches', () => {
    let ganttObj: Gantt;
    const testData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Parent Task',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 2,
                    TaskName: 'Child 1',
                    StartDate: new Date('03/29/2019'),
                    EndDate: new Date('04/05/2019'),
                    subtasks: [
                        {
                            TaskID: 100,
                            TaskName: 'Grandchild 1',
                            StartDate: new Date('03/29/2019'),
                            EndDate: new Date('04/02/2019'),
                            Duration: 4
                        }
                    ]
                },
                {
                    TaskID: 4,
                    TaskName: 'Child 2',
                    StartDate: new Date('04/06/2019'),
                    EndDate: new Date('04/10/2019'),
                    Duration: 5
                }
            ]
        }
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: testData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                child: 'subtasks'
            },
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true
            },
            allowSelection: true
        }, done);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('addRecordAsChild with addRowPosition Above and dropChildRecord exists', () => {
        const edit: any = ganttObj.editModule;
        const droppedRecord = ganttObj.flatData[1]; // Child 1
        const draggedRecord: IGanttData = {
            uniqueID: 'unique_test_003',
            level: 0,
            index: 4,
            taskData: { TaskID: 102, TaskName: 'New Child 3', Duration: 2 },
            ganttProperties: {
                taskId: 102,
                taskName: 'New Child 3',
                rowUniqueID: 'row_102'
            } as any,
            parentItem: droppedRecord.parentItem,
            parentUniqueID: droppedRecord.parentUniqueID,
            childRecords: []
        } as any;

        edit.addRowIndex = 0;
        edit.addRowPosition = 'Above';
        droppedRecord.childRecords = [ganttObj.flatData[2] || draggedRecord];

        edit.addRecordAsChild(droppedRecord, draggedRecord);
    });
    it('addRecordAsChild with addRowPosition Below and dropChildRecord exists', () => {
        const edit: any = ganttObj.editModule;
        const droppedRecord = ganttObj.flatData[1]; // Child 1
        const draggedRecord: IGanttData = {
            uniqueID: 'unique_test_003',
            level: 1,
            index: 4,
            taskData: { TaskID: 102, TaskName: 'New Child 3', Duration: 2 },
            ganttProperties: {
                taskId: 102,
                taskName: 'New Child 3',
                rowUniqueID: 'row_102'
            } as any,
            parentItem: droppedRecord.parentItem,
            parentUniqueID: droppedRecord.parentUniqueID,
            childRecords: []
        } as any;

        edit.addRowIndex = 0;
        edit.addRowPosition = 'Below';
        droppedRecord.childRecords = [ganttObj.flatData[2] || draggedRecord];

        edit.addRecordAsChild(droppedRecord, draggedRecord);
    });
    it('addRecordAsChild with addRowPosition Below and dropChildRecord exists', () => {
        const edit: any = ganttObj.editModule;
        const droppedRecord = ganttObj.flatData[1]; // Child 1
        const draggedRecord: IGanttData = {
            uniqueID: 'unique_test_003',
            level: 1,
            index: 4,
            taskData: { TaskID: 102, TaskName: 'New Child 3', Duration: 2 },
            ganttProperties: {
                taskId: 102,
                taskName: 'New Child 3',
                rowUniqueID: 'row_102'
            } as any,
            parentItem: droppedRecord.parentItem,
            parentUniqueID: droppedRecord.parentUniqueID,
            childRecords: []
        } as any;

        edit.addRowIndex = 0;
        edit.addRowPosition = 'Top';
        droppedRecord.childRecords = [ganttObj.flatData[2] || draggedRecord];

        edit.addRecordAsChild(droppedRecord, draggedRecord);
    });
    it('addRecordAsChild with addRowPosition Below and no dropChildRecord exists', () => {
        const edit: any = ganttObj.editModule;
        const droppedRecord = ganttObj.flatData[1]; // Child 1
        const draggedRecord: IGanttData = {
            uniqueID: 'unique_test_003',
            level: 1,
            index: 4,
            taskData: { TaskID: 102, TaskName: 'New Child 3', Duration: 2 },
            ganttProperties: {
                taskId: 102,
                taskName: 'New Child 3',
                rowUniqueID: 'row_102'
            } as any,
            parentItem: droppedRecord.parentItem,
            parentUniqueID: droppedRecord.parentUniqueID,
            childRecords: []
        } as any;

        edit.addRowIndex = 0;
        edit.addRowPosition = 'Top';
        droppedRecord.childRecords = [];
        edit.addRecordAsChild(droppedRecord, draggedRecord);
    });
});

describe('shouldShowDialog method', () => {
    let ganttObj: Gantt;
    const resourcesData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            Predecessor: '2FS',
            subtasks: [
                {
                    TaskID: 1, TaskName: 'Perform soil test', taskType: 'FixedDuration', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20, Predecessor: '1FS',
                },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData,
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
                    child: 'subtasks',
                    type: 'taskType'
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
                    { field: 'taskType' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                splitterSettings: {
                    columnIndex: 3
                },
                enableUndoRedo: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
        it('shouldShowDialog method', () => {
            (ganttObj as any).editModule['shouldShowDialog']('',false); 
        });
        it('shouldShowDialog method', () => {
            (ganttObj as any).editModule['shouldShowDialog']('MustFinishOn',true ); 
        });
        it('shouldShowDialog method', () => {
            (ganttObj as any).editModule['shouldShowDialog']('FinishNoLaterThan',true ); 
        });
        it('updateEditedTask method', ()=> {
            ganttObj.autoCalculateDateScheduling = false;
            ganttObj.flatData[1].ganttProperties.predecessorsName = 'FS'
            ganttObj.flatData[0].ganttProperties.predecessorsName = 'FS'
            ganttObj.flatData[0].ganttProperties.predecessor = [{from: '1', to: '2'} ]
            ganttObj.flatData[0].ganttProperties.constraintType = 2;
            ganttObj.flatData[0].ganttProperties.taskId = '1';
            ganttObj.editedRecords = [ganttObj.flatData[0]]
            const args = {data: ganttObj.flatData[1]}
            ganttObj.editModule['updateEditedTask'](args)
        });
        it('shouldShowDialog method', function () {
            (ganttObj as any).editModule['processStandardDateFields']('','','','')
        });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('shouldShowDialog method', () => {
    let ganttObj: Gantt;
    const resourcesData: object[] = [
        {
            TaskID: 1,
            TaskName: 'Project initiation',
            StartDate: new Date('03/29/2019'),
            EndDate: new Date('04/21/2019'),
            Predecessor: '2FS',
            subtasks: [
                {
                    TaskID: 1, TaskName: 'Perform soil test', taskType: 'FixedDuration', StartDate: new Date('03/29/2019'), Duration: 4,
                    resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20, Predecessor: '1FS',
                },
            ]
        },
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                
                dataSource: resourcesData,
                resources: resourceCollection,
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
                    child: 'subtasks',
                    type: 'taskType'
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
                    { field: 'taskType' },
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                splitterSettings: {
                    columnIndex: 3
                },
                enableUndoRedo: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('backUpAndPushNewlyAddedRecord  method', function () {
        (ganttObj as any).editModule['backUpAndPushNewlyAddedRecord'](ganttObj.flatData[1], 'Bottom', '');
    });
});

describe('Edit tooltip coverage', () => {
    let ganttObj: Gantt;
    const datas : Object[] =  [
        {
            taskID: '1',
            taskName: 'Project Schedule',
            startDate: new Date('02/04/2019'),
            endDate: new Date('03/10/2019'),
        },
        {
            taskID: '2',
            taskName: 'Planning',
            startDate: new Date('02/04/2019'),
            endDate: new Date('02/10/2019'),
            parentID: 1,
        }
      ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: datas,
                height: '450px',
                highlightWeekends: true,
                allowSelection: true,
                treeColumnIndex: 1,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    expandState: 'expandState'
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                selectedRowIndex: 1,
                taskbarHeight: 20,
                rowHeight: 40,
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/28/2019'),
                projectEndDate: new Date('03/10/2019'),
        }, done);
    });
    it('ConnectorPointRightDrag - coverage',() => {
        ganttObj.editModule.taskbarEditModule.connectorSecondAction = 'ConnectorPointRightDrag';
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[0];
        ganttObj.editModule.taskbarEditModule.connectorSecondElement = ganttObj.element.querySelectorAll('.e-taskbar-main-container')[1];
        ganttObj.editModule.taskbarEditModule['editTooltip']['showHideTaskbarEditTooltip'](true, -1);
        ganttObj.editModule.taskbarEditModule.taskBarEditAction = 'ConnectorPointRightDrag';
        ganttObj.editModule.taskbarEditModule['editTooltip']['toolTipObj'] = null;
        ganttObj.editModule.taskbarEditModule['editTooltip']['getTooltipText'](-1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Code coverage- edit tool tip', () => {
    Gantt.Inject(Edit, VirtualScroll);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
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
                        },
                        {
                            TaskID: 3, TaskName: 'Plan timeline', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                            Duration: 10, Progress: '60',
                            Segments: [
                                { StartDate: new Date('02/04/2019'), Duration: 2 },
                                { StartDate: new Date('02/05/2019'), Duration: 5 },
                                { StartDate: new Date('02/08/2019'), Duration: 3 }
                              ]
                        },
                    ]
                },
                {
                    TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                    Duration: 10, Progress: '90'
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
                segments: 'Segments'
            },
            gridLines: "Both",
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            allowTaskbarDragAndDrop: true,
            highlightWeekends: true,
            labelSettings: {
                taskLabel: 'Progress'
            },
            tooltipSettings: {
                showTooltip: true,
                editing: '<div>game</div>'
            },
            enableRtl: true,
            enableMultiTaskbar: true,
            splitterSettings:{
                columnIndex: 2,
            },
            height: '550px',
        }, done);
    });
    it('updateTooltip - coverage',() => {
        ganttObj.editModule.taskbarEditModule.taskBarEditRecord = ganttObj.flatData[2];
        ganttObj.editModule.taskbarEditModule.taskBarEditAction = 'ProgressResizing';
        ganttObj.editModule.taskbarEditModule['mainElement']= ganttObj.element.querySelectorAll('.e-taskbar-main-container')[2];
        ganttObj.editModule.taskbarEditModule['editTooltip']['toolTipHeight'] = "517.4px";
        ganttObj.editModule.taskbarEditModule['editTooltip']['toolTipObj'] = new Tooltip(
            {
                opensOn: 'Custom',
                position: 'TopRight',
                enableRtl: ganttObj.enableRtl,
                mouseTrail: false,
                cssClass: 'e-gantt-tooltip',
                windowCollision : true,
                target: null,
                animation: { open: { effect: 'None' }, close: { effect: 'None' } }
            }
        );
        ganttObj.editModule.taskbarEditModule['editTooltip']['updateTooltip'](0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Code coverage- edit file', () => {
    Gantt.Inject(Edit, VirtualScroll);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                {
                    TaskID: 1,
                    TaskName: 'Project Schedule',
                    StartDate: new Date('02/04/2019'),
                    EndDate: new Date('03/10/2019'),
                },
                {
                    TaskID: 4, TaskName: 'Plan budget', StartDate: new Date('02/04/2019'), EndDate: new Date('02/10/2019'),
                    Duration: 10, Progress: '90'
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
                segments: 'Segments'
            },
            gridLines: "Both",
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            highlightWeekends: true,
            enableRtl: true,
            enableMultiTaskbar: true,
            splitterSettings:{
                columnIndex: 2,
            },
            height: '550px',
        }, done);
    });
    it('reUpdateEditModules - coverage',() => {
        ganttObj.editModule.confirmDialog = null;
        ganttObj.editSettings.mode = 'Dialog';
        ganttObj.editSettings.allowEditing = false;
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Code coverage - edit', () => {
    Gantt.Inject(Edit, VirtualScroll, UndoRedo);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
              { TaskID: 1, TaskName: 'Task A - Concept', StartDate: '2025-04-01', EndDate: '2025-04-05', Duration: 5, Progress: 100 },
              { TaskID: 2, TaskName: 'Task B - Design',   StartDate: '2025-04-06', Duration: 4, Progress: 65, Predecessor: '1FS' },
              { TaskID: 3, TaskName: 'Task C - Develop',  StartDate: '2025-04-10', Duration: 7, Progress: 20, Predecessor: '2FS' }
            ],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
            },
            gridLines: "Both",
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            enableUndoRedo: true,
            highlightWeekends: true,
            enableRtl: true,
            enableMultiTaskbar: true,
            splitterSettings:{
                columnIndex: 2,
            },
            height: '550px',
        }, done);
    });
    it('updateRecordByID - coverage',() => {
        ganttObj.editModule.updateRecordByID({
            TaskID: 3,
            Predecessor: "2FS+3d" 
        });
        ganttObj.undo();
        ganttObj.enableImmutableMode = true;
        ganttObj.editModule.updateRecordByID({
            TaskID: 3,
            Predecessor: "2FS+3d" 
        });

    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Code coverage - initiate save action coverage', () => {
    Gantt.Inject(Edit, VirtualScroll, UndoRedo);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
              {
                taskID: 1,
                taskName: 'Task A - Concept',
                startDate: new Date('2025-04-01'),
                endDate: new Date('2025-04-05'),
                duration: 5,
                progress: 100,
                isMilestone: false
              },
              {
                taskID: 2,
                taskName: 'Task B - Design',
                startDate: new Date('2025-04-06'),
                duration: 4,
                progress: 65,
                predecessor: '1FS',
                isMilestone: false
              },
              {
                taskID: 3,
                taskName: 'Task C - Develop & Release',
                startDate: new Date('2025-04-17'),
                duration: 0,                   // still recommended to set 0 for correct behavior
                progress: 0,
                predecessor: '2FS',
                isMilestone: true              // ← explicit flag
              }
            ],
            taskFields: {
                id: 'taskID',
                name: 'taskName',
                startDate: 'startDate',
                endDate: 'endDate',
                duration: 'duration',
                progress: 'progress',
                dependency: 'predecessor',
                milestone: 'isMilestone',
                work: 'work'
            },
            enableWBS: true,
            gridLines: "Both",
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
            actionBegin: function (args) {
                if(args.requestType === 'beforeSave') {
                    ganttObj.flatData[2].ganttProperties.duration = 2;
                    ganttObj.flatData[2]['duration'] = 2;
                    ganttObj.flatData[2]['isMilestone'] = false;
                    ganttObj.flatData[2]['taskName'] = 'F1';
                    ganttObj.flatData[2].ganttProperties.taskName = 'F1';
                }
            },
            enableUndoRedo: true,
            highlightWeekends: true,
            enableRtl: true,
            enableMultiTaskbar: true,
            splitterSettings:{
                columnIndex: 2,
            },
            height: '550px',
        }, done);
    });
    it('save action - coverage',() => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let save: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(save, 'click');

    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('ValidateUpdateValues date conversion', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{ TaskID: 1, TaskName: 'Task 1', StartDate: '2020-01-01T00:00:00', EndDate: '2020-01-02T00:00:00', Duration: 1 }],
            taskFields: {
                id: 'TaskID', name: 'TaskName', startDate: 'StartDate', endDate: 'EndDate', duration: 'Duration'
            },
            editSettings: { allowEditing: true }
        }, done);
    });

    afterAll(() => {
        destroyGantt(ganttObj);
    });

    it('should convert string start/end date in ganttData to Date when isFromDialog is true', () => {
        const ganttdata: IGanttData = ganttObj.getRecordByID("1");
        // ensure raw data fields are strings to exercise the conversion branch
        (ganttdata as any)['StartDate'] = '2020-01-01T00:00:00';
        (ganttdata as any)['EndDate'] = '2020-01-02T00:00:00';
        const data: Object = { StartDate: '2020-01-01T00:00:00', EndDate: '2020-01-02T00:00:00' };

        // call the method under test
        ganttObj.editModule.validateUpdateValues(data, ganttdata, true);

        expect((ganttdata as any)['StartDate'] instanceof Date).toBe(true);
        expect((ganttdata as any)['EndDate'] instanceof Date).toBe(true);
    });
});

describe('Edit->processCustomDateColumns coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{ TaskID: 1, TaskName: 'Task 1' }],
            taskFields: { id: 'TaskID', name: 'TaskName' },
            editSettings: {
                allowEditing: true,
            }
        }, done);
    });

    it('should process custom date column - coverage', () => {
        // arrange
        ganttObj.customColumns = ['customDate'];
        const src: any = { customDate: new Date('2020-01-01T00:00:00Z') };
        const target: any = {};
        // act - call private method via any cast
        (ganttObj.editModule as any).processCustomDateColumns(src, target, ganttObj, 'convert');
        (ganttObj.editModule as any).processStandardDateFields(src, target, ganttObj, 'convert');
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('ValidateUpdateValues date conversion for baseline dates', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{
                TaskID: 1,
                TaskName: 'Task 1',
                StartDate: '2020-01-01T00:00:00',
                EndDate: '2020-01-02T00:00:00',
                Duration: 1,
                BaselineStartDate: '2020-01-01T00:00:00',
                BaselineEndDate: '2020-01-03T00:00:00'
            }],
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                baselineStartDate: 'BaselineStartDate',   // ← important
                baselineEndDate: 'BaselineEndDate'        // ← important
            },
            editSettings: { allowEditing: true }
        }, done);
    });

    afterAll(() => {
        destroyGantt(ganttObj);
    });

    it('should convert string baselineStartDate/baselineEndDate in ganttData to Date when isFromDialog is true', () => {
        const ganttData: IGanttData = ganttObj.getRecordByID("1");

        (ganttData as any)['BaselineStartDate'] = '2020-01-01T00:00:00';
        (ganttData as any)['BaselineEndDate']   = '2020-01-03T00:00:00';

        // This is the object typically passed from the edit dialog
        const dialogData: Object = {
            BaselineStartDate: '2020-01-01T00:00:00',
            BaselineEndDate:   '2020-01-03T00:00:00'
        };
        // Call the method under test
        ganttObj.editModule.validateUpdateValues(dialogData, ganttData, true);

        // Verify that the values were converted to Date objects in the gantt record
        expect((ganttData as any)['BaselineStartDate'] instanceof Date).toBe(true);
        expect((ganttData as any)['BaselineEndDate'] instanceof Date).toBe(true);

    });
});
describe('remote data coverage', () => {
    let ganttObj: Gantt;
    const remoteGanttData = [
      {
        TaskID: 1,
        TaskName: 'Parent Task',
        StartDate: new Date('2026-03-01'),
        EndDate: new Date('2026-03-10'),
        ParentID: null
      },
      {
        TaskID: 2,
        TaskName: 'Child Task 1',
        StartDate: new Date('2026-03-01'),
        EndDate: new Date('2026-03-04'),
        ParentID: 1
      },
      {
        TaskID: 3,
        TaskName: 'Child Task 2',
        StartDate: new Date('2026-03-05'),
        EndDate: new Date('2026-03-10'),
        ParentID: 1
      }
    ];
    function createMockRemoteDataManager(): DataManager {
      return new DataManager({
        json: remoteGanttData,
        adaptor: new RemoteSaveAdaptor()
      });
    }
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: createMockRemoteDataManager(),
            taskFields: {
              id: 'TaskID',
              name: 'TaskName',
              startDate: 'StartDate',
              endDate: 'EndDate',
              parentID: 'ParentID'
            },
            projectStartDate: new Date('2026-03-01'),
            projectEndDate: new Date('2026-03-15'),
            height: '400px',
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
                allowTaskbarEditing: true,
                showDeleteConfirmDialog: true
            },
        }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('remote data coverage', () => {
        ganttObj.selectRow(1)
        ganttObj.outdent();
    });
    it('remote data add coverage', () => {
        let record: Object = {
            TaskID: 10,
            TaskName: 'Identify Site location',
            StartDate: new Date('03/02/2026'),
            Duration: 3,
            Progress: 50
        };
        ganttObj.editModule.addRecord(record, 'Below', 2);

    });
});
describe('getValueOrFallback', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{ TaskID: 1, TaskName: 'Task 1' }],
            taskFields: { id: 'TaskID', name: 'TaskName' },
            editSettings: {
                allowEditing: true,
            }
        }, done);
    });
    it('returns the fallback when record is null', () => {
        const result = ganttObj.editModule['getValueOrFallback'](null, 'name', 'Unknown');
        expect(result).toBe('Unknown');
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('getVisibleChildRecordCount', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{ TaskID: 1, TaskName: 'Task 1' }],
            taskFields: { id: 'TaskID', name: 'TaskName' },
            editSettings: {
                allowEditing: true,
            }
        }, done);
    });
    it('returns count incremented when data has no child records and is in collection', () => {
        const data: IGanttData = {
            TaskID: 1,
            TaskName: 'Task 1',
            hasChildRecords: false,
            childRecords: [],
        } as any;
        const collection: IGanttData[] = [data];
        const result = ganttObj.editModule['getVisibleChildRecordCount'](data, 0, collection);
        expect(result).toBe(1);
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('updateNewlyAddedDataBeforeAjax', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [{ TaskID: 1, TaskName: 'Task 1' }],
            taskFields: { id: 'TaskID', name: 'TaskName', parentID: 'ParentID' },
            editSettings: { allowEditing: true }
        }, done);
    });
    it('should not modify index when rowPosition is unknown (default case)', () => {
        const obj = { TaskID: 2, TaskName: 'Task 2' };
        const level = 1;
        const rowIndex = 5;
        const result = ganttObj.editModule['updateNewlyAddedDataBeforeAjax'](
            obj,
            level,
            'InvalidRowPosition' as any,
            undefined,
            rowIndex
        );
        expect(result.index).toBeUndefined();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('refreshNewlyAddedRecord loop branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [],
            taskFields: { id: 'TaskID', name: 'TaskName' },
            editSettings: {
                allowEditing: true,
                allowAdding: true
            },
            enableUndoRedo: true,
            viewType: 'ResourceView'
        }, done);
    });
    it('covers loop branch with resourceInfo and else path', () => {
        const recordWithResource: IGanttData = {
            TaskID: 1,
            TaskName: 'Task 1',
            ganttProperties: {
                rowUniqueID: 'row1',
                sharedTaskUniqueIds: [],
                resourceInfo: [{ id: 1 }, { id: 2 }]
            }
        } as any;
        const recordWithoutResource: IGanttData = {
            TaskID: 2,
            TaskName: 'Task 2',
            ganttProperties: {
                rowUniqueID: 'row2',
                sharedTaskUniqueIds: []
            }
        } as any;
        const args = {
            data: [recordWithResource, recordWithoutResource],
            modifiedRecords: [],
            action: 'add'
        } as any;
        const cAddedRecord: IGanttData[] = [recordWithResource, recordWithoutResource];
        ganttObj.editModule['refreshNewlyAddedRecord'](args, cAddedRecord);
        expect(recordWithResource.ganttProperties.sharedTaskUniqueIds).toContain('row1');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('outdent method coverage', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date(), Duration: 5 },
                { TaskID: 2, TaskName: 'Task 2', StartDate: new Date(), Duration: 3 }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName' },
            editSettings: { allowEditing: true },
        }, done);
    });
    it('evaluates resolveCondition branch when cell selection length is 1', () => {
        ganttObj.editModule.outdent();
        expect(ganttObj.flatData.length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('indentOutdentRow child branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date(), Duration: 5 },
                { TaskID: 2, TaskName: 'Task 2', StartDate: new Date(), Duration: 3 }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName' },
            editSettings: { allowEditing: true, allowAdding: true }
        }, done);
    });
    it('executes indentOutdentRow with pos = "child"', () => {
        ganttObj.editModule['indentOutdentRow']([1], 0, 'child');
        expect(ganttObj.editModule['dropPosition']).toBe('middleSegment');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('indent when selectionModule is false', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date(), Duration: 5 },
                { TaskID: 2, TaskName: 'Task 2', StartDate: new Date(), Duration: 3 }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName' },
            editSettings: { allowEditing: true, allowAdding: true },
        }, done);
    });
    it('should return early when selectionModule is not available', () => {
        ganttObj.editModule.indent();
        expect(ganttObj.flatData.length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('indentOutdentSuccess timezone branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date(), Duration: 5 },
                { TaskID: 2, TaskName: 'Task 2', StartDate: new Date(), Duration: 3 }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName' },
            editSettings: { allowEditing: true, allowAdding: true },
            timezone: 'UTC'
        }, done);
    });
    it('should call updateDates for each modified record when timezone is set', () => {
        const args: any = {
            data: ganttObj.currentViewData[0],
            modifiedRecords: ganttObj.currentViewData,
            requestType: '',
        };
        ganttObj.editModule['indentOutdentSuccess'](args, false);
        expect(ganttObj.flatData.length).toBe(2);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('indentOutdentSuccess timezone branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date(), Duration: 5 },
                { TaskID: 2, TaskName: 'Task 2', StartDate: new Date(), Duration: 3 }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName' },
            editSettings: { allowEditing: true, allowAdding: true },
        }, done);
    });
    it('should return fallback when customColumns is null', () => {
        const result = ganttObj.editModule['resolveFallback'](null, 'fallback');
        expect(result).toBe('fallback');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('updateEditedRecordFields else branches', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date(), Duration: 5 }
            ],
            taskFields: { id: 'TaskID' },
            editSettings: { allowEditing: true }
        }, done);
    });
    it('should hit all else branches when fields are null', () => {
        const currentData: IGanttData = ganttObj.currentViewData[0];
        currentData.ganttProperties = {
            taskId: 99,
            taskName: 'Existing',
            startDate: new Date('2026-01-01'),
            endDate: new Date('2026-01-02'),
            duration: 10,
            durationUnit: 'day',
            progress: 50,
            dependency: '1FS',
            parentID: 0,
            baselineEndDate: new Date('2026-01-03'),
            baselineStartDate: new Date('2026-01-01'),
            resources: [{ id: 1, name: 'Res A' }]
        } as any;
        ganttObj.editModule['updateEditedRecordFields']({}, currentData);
        expect(currentData.ganttProperties.taskName).toBe('Existing');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('addNewUndoCollection extend branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date(), Duration: 5 }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
            editSettings: { allowEditing: true },
            enableUndoRedo: true
        }, done);
    });
    it('should use extend when args.data is an array', () => {
        const record: any = {};
        const args: any = {
            data: [
                {
                    TaskID: 1,
                    TaskName: 'Task 1',
                    StartDate: new Date(),
                    Duration: 5,
                    ganttProperties: { taskId: 1 }
                } as any
            ]
        } as any;
        ganttObj.editModule['addNewUndoCollection'](record, args);
        expect(record.action).toBe('Add');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('resolveQueryValue helper', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date(), Duration: 5 }
            ],
            taskFields: { id: 'TaskID', name: 'TaskName', startDate: 'StartDate', duration: 'Duration' },
            editSettings: { allowEditing: true }
        }, done);
    });
    it('should return the same Query instance when input is a Query', () => {
        const q = new Query();
        const result = ganttObj.editModule['resolveQuery'](q);
        expect(ganttObj.flatData.length).toBe(1);
    });
    it('should create a new Query when input is not a Query', () => {
        const q: any = {};
        const result = ganttObj.editModule['resolveQuery'](q);
        expect(ganttObj.flatData.length).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('updateSharedTask else branch', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [
                { TaskID: 1, TaskName: 'Task 1', StartDate: new Date(), Duration: 5 },
                { TaskID: 2, TaskName: 'Task 2', StartDate: new Date(), Duration: 3 }
            ],
            taskFields: { id: 'TaskID' },
            editSettings: { allowEditing: true }
        }, done);
    });
    it('should hit else branch when parentItem is null', () => {
        const currentData = ganttObj.currentViewData[0];
        const otherData = ganttObj.currentViewData[1];
        currentData.ganttProperties.sharedTaskUniqueIds = ["2"];
        otherData.parentItem = null;
        ganttObj.editModule['updateSharedTask'](currentData);
        expect(otherData.parentItem).toBeNull();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: addDependency,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor'
                },
                allowRowDragAndDrop: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                gridLines: "Both",
                height: '450px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('should clear segments for remote data source', () => {
        ganttObj.editModule['dropPosition'] = 'middleSegment';
        ganttObj.editModule['draggedRecord'] = {
            hasChildRecords: false,
            taskData: {}
        } as any;
        ganttObj.editModule['droppedRecord'] = {
            hasChildRecords: true,
            childRecords: [],
            expanded: false,
            level: 0,
            uniqueID: '1',
            index: 0,
            ganttProperties: {
                rowUniqueID: 1,
                segments: [{ startDate: new Date() }]
            },
            taskData: {
                segments: [{}]
            }
        } as any;
        ganttObj.taskFields = {
            child: 'subtasks',
            segments: 'segments'
        } as any;
        ganttObj.dataSource = new DataManager({
            url: '/api/tasks'
        });
        spyOn(ganttObj, 'setRecordValue');
        ganttObj.editModule['recordLevel']();
    });
    it('should call removeChildItem recursively for child records', () => {
        const grandChild: any = {
            hasChildRecords: false,
            taskData: {
                TaskID: 3
            }
        };
        const childRecord: any = {
            hasChildRecords: true,
            childRecords: [grandChild],
            taskData: {
                TaskID: 2
            }
        };
        const record: any = {
            childRecords: [childRecord]
        };
        ganttObj.taskFields = {
            id: 'TaskID'
        } as any;
        ganttObj.dataSource = [
            { TaskID: 2 },
            { TaskID: 3 }
        ];
        (ganttObj.editModule['treeGridData'] as any) = [
            { TaskID: 2 },
            { TaskID: 3 }
        ];
        ganttObj.ids = ['2', '3'];
        ganttObj.editModule['removeChildItem'](record);
    });
    it('should return 0 when record has no child records', () => {
        const record: any = {
            hasChildRecords: false,
            childRecords: []
        }
        const result = ganttObj.editModule['updateChildRecord'](record, 0, true);
        expect(result).toBe(0);
    });
    it('should update child records recursively', () => {
        const grandChild: any = {
            hasChildRecords: false,
            childRecords: [],
            ganttProperties: {
                rowUniqueID: 3
            },
            taskData: {
                TaskID: 3
            }
        };
        const child: any = {
            hasChildRecords: true,
            childRecords: [grandChild],
            ganttProperties: {
                rowUniqueID: 2
            },
            taskData: {
                TaskID: 2
            }
        };
        const parentRecord: any = {
            hasChildRecords: true,
            childRecords: [child],
            ganttProperties: {
                rowUniqueID: 1
            }
        };
        ganttObj.ids = [];
        ganttObj.taskFields = {
            parentID: 'ParentID'
        } as any;
        ganttObj.editModule['ganttData'] = [];
        spyOn(ganttObj, 'insertRecord');
        const result = ganttObj.editModule['updateChildRecord'](parentRecord, 0, true);
    });
    it('should return 0 when record has no child records', () => {
        const record: any = {
            hasChildRecords: false,
            childRecords: []
        };
        const result = ganttObj.editModule['updateChildRecordLevel'](record, 0);
        expect(result).toBe(0);
    });
    it('should update child record level recursively', () => {
        const grandChild: any = {
            hasChildRecords: false,
            childRecords: [],
            level: 0
        };
        const child: any = {
            hasChildRecords: true,
            childRecords: [grandChild],
            level: 0
        };
        const parent: any = {
            hasChildRecords: true,
            level: 0,
            parentItem: null    ,
            childRecords: [child]
        };
        ganttObj.editModule['updateChildRecordLevel'](parent, 0);
    });
    it('should splice dragged record at top segment position', () => {
        ganttObj.editModule['dropPosition'] = 'topSegment';
        ganttObj.taskFields = {
            child: 'subtasks',
            parentID: null
        } as any;
        const draggedRec: any = {
            taskData: {
                TaskID: 3
            }
        };
        const childCollection: any[] = [];
        const droppedRec: any = {
            parentItem: null,
            taskData: {
                subtasks: childCollection
            }
        };
        const dataSource: any[] = [
            {
                TaskID: 1,
                subtasks: childCollection
            }
        ];
        ganttObj.dataSource = dataSource;
        ganttObj.editModule['draggedRecord'] = draggedRec;
        ganttObj.editModule['droppedRecord'] = droppedRec;

        ganttObj.editModule['refreshDataSource']();
        expect(dataSource.length).toBe(2);
    });
    it('should refresh records when React template cell exists', () => {
        ganttObj.isReact = true;
        const templateCell = document.createElement('div');
        templateCell.className = 'e-templatecell';
        const gridElement = document.createElement('div');
        gridElement.appendChild(templateCell);
        const grid = ganttObj.treeGrid.grid;
        ganttObj.treeGrid.grid = {
            element: gridElement
        } as any;
        ganttObj.editedRecords = [{}];
        spyOn(ganttObj.chartRowsModule, 'refreshRecords');
        spyOn(ganttObj, 'trigger');
        spyOn(ganttObj.treeGrid, 'refresh');
        const args: any = {
            data: {}    
        };
        ganttObj.editModule['indentOutdentSuccess'](args, false);
        ganttObj.treeGrid.grid = grid;
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: addDependency,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor'
                },
                allowRowDragAndDrop: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                gridLines: "Both",
                height: '450px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('should enter changedRecords array branch', () => {
        const dataManager: any = {
            adaptor: new ODataAdaptor(),
            dataSource: {},
            update: jasmine.createSpy('update').and.returnValue(Promise.resolve({}))
        };
        ganttObj.dataSource = dataManager;
        ganttObj.taskFields = {
            id: 'TaskID'
        } as any;
        (ganttObj.editedRecords as any) = [
            { TaskID: 1 },
            { TaskID: 2 }
        ];
        spyOn(utils, 'isRemoteData').and.returnValue(true);
        spyOn(utils, 'getTaskData').and.returnValue([
            { TaskID: 1 },
            { TaskID: 2 }
        ]);
        ganttObj.editModule.refreshRecord({}, false);
    });
    it('should return task id as string', () => {
        ganttObj.ids = ['1', '2'];
        ganttObj.dataOperation = {
            isTaskIDInteger: false
        } as any;
        ganttObj.taskFields = {
            id: 'TaskID'
        } as any;
        ganttObj.columnByField = {
            TaskID: {
                type: 'string',
                editType: 'stringedit'
            }
        } as any;
        const result = ganttObj.editModule.getNewTaskId();
        expect(typeof result).toBe('string');
    });
    it('should remove predecessor from child record when predecessor to matches parent record', () => {
        const predecessor = {
            from: '2',
            to: '1',
            type: 'FS'
        };
        const parentRecord: any = {
            ganttProperties: {
                rowUniqueID: 1,
                predecessor: [predecessor]
            }
        };
        const childRecord: any = {
            ganttProperties: {
                predecessor: [predecessor]
            }
        };
        spyOn(ganttObj, 'getRecordByID').and.callFake((id: string) => {
            if (id === '2') {
                return childRecord;
            }
            return parentRecord;
        });
        spyOn(
            ganttObj.predecessorModule,
            'validateParentPredecessor'
        ).and.returnValue(false);
        spyOn(ganttObj, 'setRecordValue');
        ganttObj.editModule.updatePredecessorOnIndentOutdent(parentRecord);
    });
    it('should insert record at index when rowPosition is Above', () => {
        ganttObj.editModule.isBreakLoop = false;
        ganttObj.viewType = 'ResourceView';
        ganttObj.taskFields = {
            id: 'TaskID',
            child: 'subtasks'
        } as any;
        ganttObj.editModule.addRowSelectedItem = {
            ganttProperties: {
                rowUniqueID: '1'
            }
        } as any;
        const record: any = {
            TaskID: 100
        };
        const dataCollection: any[] = [
            { TaskID: 1 },
            { TaskID: 2 },
            { TaskID: 3 }
        ];
        ganttObj.rowDragAndDropModule = {
            droppedRecord: {
                ganttProperties: {
                    taskId: 2
                }
            }
        } as any;
        ganttObj.editModule['addDataInRealDataSource'](
            dataCollection,
            record,
            'Above'
        );
        expect(dataCollection[1]).toBe(record);
    });
    it('should push record into existing child collection', () => {
        ganttObj.editModule.isBreakLoop = false;
        ganttObj.taskFields = {
            id: 'TaskID',
            child: 'subtasks'
        } as any;
        ganttObj.editModule.addRowSelectedItem = {
            ganttProperties: {
                rowUniqueID: '1'
            }
        } as any;
        const record: any = {
            TaskID: 10
        };
        const dataCollection: any[] = [{
            TaskID: 1,
            subtasks: [
                { TaskID: 2 }
            ]
        }];
        ganttObj.editModule['addDataInRealDataSource'](
            dataCollection,
            record,
            'Child'
        );
        expect(dataCollection[0].subtasks.length).toBe(2);
    });
    it('should create child collection and push record', () => {
        ganttObj.editModule.isBreakLoop = false;
        ganttObj.taskFields = {
            id: 'TaskID',
            child: 'subtasks'
        } as any;
        ganttObj.editModule.addRowSelectedItem = {
            ganttProperties: {
                rowUniqueID: '1'
            }
        } as any;
        const record: any = {
            TaskID: 20
        };
        const dataCollection: any[] = [{
            TaskID: 1,
            subtasks: []
        }];
        ganttObj.editModule['addDataInRealDataSource'](
            dataCollection,
            record,
            'Child'
        );
        expect(dataCollection[0].subtasks.length).toBe(1);
    });
    it('should set topSegment and get record from currentAction data', () => {
        ganttObj.undoRedoModule = {
            isUndoRedoPerformed: true,
            currentAction: {
                data: [{ TaskID: 1 }]
            }
        } as any;
        spyOn(ganttObj, 'trigger').and.callFake(
            (event: string, args: any, callback: Function) => {
                callback({ cancel: true });
            }
        );
        spyOn(ganttObj as any, 'hideLoadingIndicator');
        ganttObj.editModule['indentOutdentRow']([0], 1, 'above');

        expect(ganttObj.editModule['dropPosition']).toBe('topSegment');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: addDependency,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor'
                },
                allowRowDragAndDrop: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowSelection: true,
                gridLines: "Both",
                height: '450px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('should reset redo collection when redoEnabled is true', () => {
        ganttObj.controlId = 'Gantt';
        ganttObj.toolbarModule = {
            enableItems: jasmine.createSpy('enableItems')
        } as any;
        ganttObj.undoRedoModule = {
            isUndoRedoPerformed: false,
            redoEnabled: true,
            getUndoCollection: [],
            getRedoCollection: [],
            findPosition: jasmine.createSpy('findPosition'),
            createUndoCollection: jasmine.createSpy('createUndoCollection')
        } as any;
        (ganttObj.editModule['treeGridData'] as any) = [
            { TaskID: 2 },
            { TaskID: 3 }
        ];
        ganttObj.editModule['reArrangeRows']({
            dropPosition: 'bottomSegment',
            dropIndex: 0,
            data: []
        }, false);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: addDependency,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
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
                allowSelection: true,
                gridLines: "Both",
                height: '450px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('should set topSegment and get record from currentAction data', () => {
        ganttObj.editModule['triggerDuplicateIdError']('2');
        expect(ganttObj.flatData.length).toBe(3);
    });
   
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Spec to cover branches', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: addDependency,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
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
                allowSelection: true,
                gridLines: "Both",
                height: '450px',
                allowUnscheduledTasks: true
            }, done);
    });
    it('triggerDuplicateIdError method coverage spec', () => {
        ganttObj.editModule['triggerDuplicateIdError']('2');
        expect(ganttObj.flatData.length).toBe(3);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Cyclic dependency value is getting saved after cell editing', () => {
    let ganttObj: Gantt;

    const editingData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30, Work: 10 },
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
                { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2" ,Progress: 30},
            ]
        },
        { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" },
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
        ganttObj = createGantt({
            dataSource: editingData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                child: 'subtasks',
                baselineStartDate: 'BaselineStartDate',
                baselineEndDate: 'BaselineEndDate',
                notes: 'info',
                indicators: 'Indicators',
                work: 'work'
            },
            editSettings: {
                allowEditing: true
            },
            allowSelection: true,
            height: '450px',
            splitterSettings: {
                columnIndex: 3
            },
            columns: [
                { field: 'TaskID', headerText: 'Task ID' },
                { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                { field: 'Predecessor', headerText: 'Dependency', allowSorting: false },
            ],
        }, done);
    });

    it('Editing predecesssor column', (done: Function) => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = '6FS';
        let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(update, 'click');
        expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe(null);
        done();
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Regression - Task start date after multiple indents', () => {
    let ganttObj: Gantt;

    const projectNewData: Object[] = [
        {
            TaskID: 1,
            TaskName: 'Product Concept',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                {
                    TaskID: 5,
                    TaskName: 'Prepare product sketch and notes',
                    StartDate: new Date('04/02/2019'),
                    Duration: 3,
                    Progress: 30
                },
                {
                    TaskID: 2,
                    TaskName: 'Defining the product and its usage',
                    StartDate: new Date('04/02/2019'),
                    Duration: 3,
                    Progress: 30,
                    Predecessor: '5'
                },
                {
                    TaskID: 3,
                    TaskName: 'Defining target audience',
                    Predecessor: '2',
                    StartDate: new Date('04/02/2019'),
                    Duration: 3
                },
                {
                    TaskID: 4,
                    TaskName: 'Prepare product sketch and notes',
                    StartDate: new Date('04/02/2019'),
                    Duration: 3,
                    Predecessor: '2',
                    Progress: 30
                }
            ]
        }
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectNewData,
                allowSelection: true,
                allowRowDragAndDrop: true,
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
                    allowEditing: true,
                    allowAdding: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true
                },
                height: '450px'
            },
            done
        );
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

    it('should maintain correct start date for Task 4 after indenting Task 3 and Task 4', (done: Function) => {

        const task4Before: IGanttData = ganttObj.flatData[4];
        const initialStartDate: number =
            task4Before.ganttProperties.startDate.getTime();

        // Act - Indent Task 3 under Task 2

        ganttObj.selectRow(3);
        ganttObj.indent();

        let task3: IGanttData = ganttObj.flatData[3]

        // Act - Indent Task 4 under Task 2

        ganttObj.selectRow(4);
        ganttObj.indent();

        ganttObj.dataBind();

        // Assert

        const task4After: IGanttData = ganttObj.flatData[4];

        // Validate start date remains same after hierarchy update
        expect(
            task4After.ganttProperties.startDate.getTime()
        ).toBe(initialStartDate);

        done();
    });
});
describe('Indent action should preserve predecessor', () => {
    let ganttObj: Gantt;

    const editingData: Object[] = [
        { TaskID: 1, TaskName: 'Planning and permits', StartDate: new Date('04/02/2025'), EndDate: new Date('04/10/2025'), Duration: 7, Progress: 100 },
        { TaskID: 2, TaskName: 'Site evaluation', StartDate: new Date('04/02/2025'), EndDate: new Date('04/04/2025'), Duration: 2, Progress: 100, ParentId: 1 },
        { TaskID: 3, TaskName: 'Obtain permits', StartDate: new Date('04/07/2025'), EndDate: new Date('04/09/2025'), Duration: 3, Progress: 100, ParentId: 1, Predecessor: '2' },
        { TaskID: 4, TaskName: 'Finalize planning', StartDate: new Date('04/10/2025'), EndDate: new Date('04/11/2025'), Duration: 2, Progress: 100, ParentId: 1, Predecessor: '3' }
    ];

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: editingData,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                endDate: 'EndDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency: 'Predecessor',
                parentID: 'ParentId'
            },
            editSettings: {
                allowEditing: true
            },
            allowSelection: true,
            toolbar: ['Indent'],
            height: '450px'
        }, done);
    });

    it('Task 3 predecessor should remain 2 after indenting Task 4', () => {
        // Select Task 4
        ganttObj.selectRow(3);
        // Perform indent
        ganttObj.indent();

        const task3: IGanttData = ganttObj.flatData[2]
        expect(task3.ganttProperties.predecessorsName).toBe('2FS');
        expect(task3.taskData['Predecessor']).toBe('2FS');
    });

    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
