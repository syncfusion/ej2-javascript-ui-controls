import { Inputs } from './../../src/gantt/actions/dialog-edit';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Gantt taskbaredit spec
 */
import {Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, UndoRedo, CriticalPath} from '../../src/index';
import { cellEditData, resourcesData, resources, scheduleModeData, resourceDataTaskType, resourceResources, taskTypeData, taskTypeWorkData, projectData, editingData, customSelfReferenceData, autoDateCalculate, customZoomingdata, parentProgressData, virtualData, virtualData1, resourcesDatas, splitTasksData, coverageData, taskModeData, resourceCollection, cR885322, cellEditData1, dataSource1, splitTasksDataRelease, releaseVirtualData, unscheduledData1, MT887459, actionFailureData, resourceData, Data893564, CR898960, crValidateIssue, criticalPath, editingResources3 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent, triggerKeyboardEvent, getKeyUpObj } from '../base/gantt-util.spec';
import { DatePickerEditCell } from '@syncfusion/ej2-grids';
import { Input } from '@syncfusion/ej2-inputs';
import { RichTextEditor } from '@syncfusion/ej2-richtexteditor';
import { Calendar } from '@syncfusion/ej2-calendars';

interface EJ2Instance extends HTMLElement {
     ej2_instances: Object[];
 }
 
 Gantt.Inject(Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, VirtualScroll, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, UndoRedo, CriticalPath);
 function valueAccess(field: string, data: Object, column: Object) {   
    return data[field];
}

describe('Gantt editing action', () => {
    let ganttObj: Gantt;
    let interval: number;
    let preventDefault: Function = new Function();
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

    it('Editing task id', () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(1)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskId') as HTMLElement;
        expect(input).toBe(null);
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
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
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
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
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

    it('Editing predecesssor column', (done: Function) => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = '3+5';
        let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(update, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe('3FS+5 days');
        done();
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
    it('Editing parent progress column', () => {
        let progress: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(progress, 'dblclick');
        expect(ganttObj.treeGrid.element.getElementsByClassName('e-editedbatchcell').length > 0).toBe(false)
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
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/16/2019');
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
            expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe('Resource 1');
            expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['unit']).toBe(100);
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/16/2019');
            expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(24);
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
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
    it('Initial checking resource column without unit mapping', () => {
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3,Resource 1');
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
    });
    it('Initial work,workunit,tasktype value checking without unit and work mapping', () => {
        //Task with resource
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3,Resource 1');
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
        expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(48);
        expect(ganttObj.currentViewData[2].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedUnit');
        //Task without resource
        expect(ganttObj.currentViewData[5].ganttProperties.resourceInfo).toBe(null);
        expect(ganttObj.currentViewData[5].ganttProperties.work).toBe(0);
        expect(ganttObj.currentViewData[5].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[5].ganttProperties.taskType).toBe('FixedUnit');
        //Parent Task without resource
        expect(ganttObj.currentViewData[0].ganttProperties.resourceInfo).toBe(null);
        expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(48);
        expect(ganttObj.currentViewData[0].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
    });
    it('Editing resource column without unit mapping by adding new resource', () => {
        let resource: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(10)') as HTMLElement;
        triggerMouseEvent(resource, 'dblclick');
        let ddlElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolResource') as HTMLElement;
        if (ddlElement) {
            let input: any = ddlElement.ej2_instances[0];
            input.value = [1]; // add new resource
            input.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[5].ganttProperties.resourceNames).toBe('Resource 1');
            expect(ganttObj.currentViewData[5].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        }
    });
    it('Editing resource column without unit mapping by adding another resource', () => {
        expect(ganttObj.currentViewData[3].ganttProperties.resourceNames).toBe('Resource 4');
        expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        let resource: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(10)') as HTMLElement;
        triggerMouseEvent(resource, 'dblclick');
        let ddlElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolResource') as HTMLElement;
        if (ddlElement) {
            let input: any = ddlElement.ej2_instances[0];
            input.value.push(1);
            input.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[3].ganttProperties.resourceNames).toBe('Resource 4,Resource 1');
            expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo[0]['unit']).toBe(100);
            expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo[1]['unit']).toBe(100);
        }
    });
    it('Editing parent task resource column by adding a resource', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.resourceInfo).toBe(null);
        let resource: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(10)') as HTMLElement;
        triggerMouseEvent(resource, 'dblclick');
        let ddlElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolResource') as HTMLElement;
        if (ddlElement) {
            let input: any = ddlElement.ej2_instances[0];
            input.value = [1];
            input.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[0].ganttProperties.resourceNames).toBe('Resource 1');
            expect(ganttObj.currentViewData[0].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
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

    it('Editing duration column without resource unit and work mapping', () => {
        //checking work values for task which have resource while before duration editing
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(3);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/04/2019');
        expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(48);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3,Resource 1');
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = '4 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        //checking work values for task which have no resource while after duration editing
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(4);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/05/2019');
        expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(64);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3,Resource 1');
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
    });
    it('Editing endDate column without resource unit and work mapping', () => {
        //checking work values for task which have resource while before enddate editing
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(4);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/05/2019');
        expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(64);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3,Resource 1');
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate')).ej2_instances[0];
        input.value = new Date('04/08/2019');
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        //checking work values for task which have resource while after enddate editing
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(5);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/08/2019');
        expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(64);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3,Resource 1');
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
    });
    it('Editing custom column', () => {
        let customColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(12)') as HTMLElement;
        triggerMouseEvent(customColumn, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolCustomcol') as HTMLElement;
        input.value = 'updated';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(12)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[1]['Customcol']).toBe('updated');
        expect(ganttObj.dataSource[0].subtasks[0]["Customcol"]).toBe('updated');
    });
    it('Editing parent task name with expand/collapse actions', () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(1) > div > span') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[0].expanded).toBe(true);
    });
    it('Editing parent task name with enter key', () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let args1: any = { action: 'saveRequest', preventDefault: preventDefault };
        ganttObj.keyboardModule.keyAction(args1);
        expect(ganttObj.currentViewData[0].ganttProperties.taskName).toBe('TaskName updated');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(1) > div > span') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[0].expanded).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
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
    it('Editing parent taskbar', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr.e-row.e-gridrowindex0level0 > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        expect(durationInput).toBe(null);
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr.e-row.e-gridrowindex0level0 > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let dependencyInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        expect(dependencyInput).toBe(null);
        let progress: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr.e-row.e-gridrowindex0level0 > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(progress, 'dblclick');
        let progressInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolProgress') as HTMLElement;
        expect(progressInput).toBe(null);
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr.e-row.e-gridrowindex0level0 > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let endDateInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as HTMLElement;
        expect(endDateInput).toBe(null);
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
    it('Unscheduled end task - end date editing', () => {
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
        input.value = new Date('04/03/2019');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[5].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/3/2019');
    });
    it('Unscheduled end task - start date editing', () => {
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
        input.value = new Date('04/01/2019');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[5].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/1/2019');
    });
    it('Unscheduled end task - duration editing', () => {

        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let durationInput: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration')).ej2_instances[0];
        durationInput.value = '4 days';
        durationInput.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[5].ganttProperties.duration).toBe(4);
    });
    it('Unscheduled duration task - duration editing', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(7) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        durationInput.value = '4 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[6].ganttProperties.duration).toBe(4);
    });
    it('Unscheduled duration task - start date editing', () => {
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(7) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
        input.value = new Date('04/01/2019');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[6].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/1/2019');
    });
    it('Unscheduled duration task - end date editing', () => {
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(7) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let endDateInput: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate')).ej2_instances[0];
        endDateInput.value = new Date('04/03/2019');
        endDateInput.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[6].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/3/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
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
    it('Milestone task - duration editing', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        durationInput.value = '5 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[3].ganttProperties.duration).toBe(5);
    });
    it('Milestone task - start date editing', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        durationInput.value = '0 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
        input.value = new Date('04/01/2019');
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/1/2019');
    });
    it('Milestone task - end date editing', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        durationInput.value = '0 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let endDateInput: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
        endDateInput.value = new Date('04/05/2019');
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/5/2019');
    });
    it('Editing duration column - null duration', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = '';
        let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(update, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(null);
    });
    it('Editing dependency column', () => {
        let dependency1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency1, 'dblclick');
        let input1: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input1.value = '0';
        let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(update, 'click');
        let dependency2: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency2, 'dblclick');
        let input2: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input2.value = '2FF+3';
        triggerMouseEvent(update, 'click');
        let dependency3: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency3, 'dblclick');
        let input3: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input3.value = '3SF+5H';
        triggerMouseEvent(update, 'click');
        let dependency4: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency4, 'dblclick');
        let input4: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input4.value = '4SS+50M';
        triggerMouseEvent(update, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.predecessorsName).toBe('');
        expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe('2FF+3 days');
        expect(ganttObj.currentViewData[4].ganttProperties.predecessorsName).toBe('3SF');
        expect(ganttObj.currentViewData[5].ganttProperties.predecessorsName).toBe('4SS-480 minutes');
    });
    it('Editing task name with dialog close arguments', () => {
        ganttObj.actionBegin = function (args: any): void {
            if (args.requestType === "beforeOpenEditDialog") {
                args.dialogModel.animationSettings = { 'effect': 'none' };
            }
        };
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
    });
    it('Editing notes column-Dialog', (done: Function) => {
        let notes: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(11)') as HTMLElement;
        triggerMouseEvent(notes, 'dblclick');
        setTimeout(done, 500);
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType == "openEditDialog") {
                let element: any = document.getElementById(ganttObj.element.id + 'NotesTabContainer') as HTMLElement;
                if (element && !isNullOrUndefined(element.value)) {
                    let input: any = (element as any).ej2_instances[0];
                    input.value = 'updated';
                    let save: any = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
                    triggerMouseEvent(save, 'click');
                    expect(ganttObj.currentViewData[1].ganttProperties.notes).toBe('updated');
                }
                done();
            }
        };
    });
    it('Editing notes column- inline', () => {
        ganttObj.showInlineNotes = true;
        ganttObj.dataBind();
        let notes: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(11)') as HTMLElement;
        triggerMouseEvent(notes, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolNotes');
        if (input && !isNullOrUndefined(input.value)) {
            input.value = 'changed';
            let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[2].ganttProperties.notes).toBe('changed');
        }
    });
    it('Editing with tab navigation', () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let args: any = { action: 'tab', preventDefault: preventDefault, target: ganttObj.treeGrid.grid.element.querySelector('.e-editedbatchcell') } as any;
        ganttObj.keyboardModule.keyAction(args);
        expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
        expect(ganttObj.treeGrid.grid.isEdit).toBe(true);
        ganttObj.treeGrid.grid.endEdit();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt editing action validation', () => {
    let ganttObj: Gantt;
    let interval: number;
    let preventDefault: Function = new Function();
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
                    { field: 'TaskName', editType: 'stringedit', width: 100, validationRules: { required: true } },
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
    it('Editing task name Validation', (done: Function) => {
        let actionBeginFired = false;
        ganttObj.endEdit = (args) => {
            if (args.action === 'CellEditing') {
                actionBeginFired = true;
                done();
            }
        }
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = '';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(actionBeginFired).toBe(false);
        let taskName1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName1, 'dblclick');
        let input1: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input1.value = 'testing';
        let element1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element1, 'click');
        expect(actionBeginFired).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('parent progress calculation', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: parentProgressData,
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
                renderBaseline: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true
                },
                splitterSettings: {
                    columnIndex: 4
                }
            }, done);
    });
    it('EJ2-70876-parentProgress value', () => {
        expect(ganttObj.currentViewData[0]['Progress']).toBe(100);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('End date to weekend', () => {
    let ganttObj: Gantt;
    let interval: number;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: autoDateCalculate,
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
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                renderBaseline: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true
                },
                splitterSettings: {
                    columnIndex: 4
                },
                autoCalculateDateScheduling: false,
                allowUnscheduledTasks: true,
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search',
                    'PrevTimeSpan', 'NextTimeSpan'],
            }, done);
    });
    it('Editing end date column to weekend', () => {
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
        input.value = new Date('04/06/2019');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(6);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/06/2019');
    });
    it('Predecessor SF date validation', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = "3SF";
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(6);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/06/2019');
    });
    it('Predecessor FF date validation', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = "3FF";
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(6);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/06/2019');
    });
    it('Predecessor SS date validation', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input.value = "3SS";
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(6);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/06/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt expand collapse', () => {
    let ganttObj: Gantt;
    let interval: number;
    let preventDefault: Function = new Function();
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
    it('Shimmer expand collapse', () => {
        ganttObj.selectRow(0);
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(1) > div > span') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(document.querySelector('.e-spinner-pane').classList.contains("e-spin-hide")).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Resource with unit', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
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
                child: 'subtasks'
            },
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit'
            },
            resources: resources,
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
    it('Resource column - Initial', () => {
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3[40%],Resource 1');
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(40);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1][ganttObj.resourceFields.unit]).toBe(100);//unit value not set for resource1 in datasource,hence set as 100
    });
    it('Initial work,workunit,tasktype value checking without work mapping', () => {
        //Task with resource
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3[40%],Resource 1');
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(40);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1][ganttObj.resourceFields.unit]).toBe(100);
        expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(33.6);
        expect(ganttObj.currentViewData[2].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedUnit');
        //Task without resource
        expect(ganttObj.currentViewData[5].ganttProperties.resourceInfo).toBe(null);
        expect(ganttObj.currentViewData[5].ganttProperties.work).toBe(0);
        expect(ganttObj.currentViewData[5].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[5].ganttProperties.taskType).toBe('FixedUnit');
        //Parent Task without resource
        expect(ganttObj.currentViewData[0].ganttProperties.resourceInfo).toBe(null);
        expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(33.6);
        expect(ganttObj.currentViewData[0].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
    });
    it('Resource added newly', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe(undefined);
        let resource: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(10)') as HTMLElement;
        triggerMouseEvent(resource, 'dblclick');
        let ddlElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolResource') as HTMLElement;
        if (ddlElement) {
            let input: any = ddlElement.ej2_instances[0];
            input.value = [3];
            input.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe('Resource 3');
            expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(100);
        }
    });
    it('Resource added with old resource', () => {
        let resource: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(10)') as HTMLElement;
        expect(ganttObj.currentViewData[4].ganttProperties.resourceNames).toBe('Resource 3[40%]');
        expect(ganttObj.currentViewData[4].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(40);
        triggerMouseEvent(resource, 'dblclick');
        let ddlElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolResource') as HTMLElement;
        if (ddlElement) {
            let input: any = ddlElement.ej2_instances[0];
            input.value.push(2);
            input.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[4].ganttProperties.resourceNames).toBe('Resource 3[40%],Resource 2');
            expect(ganttObj.currentViewData[4].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(40);
            expect(ganttObj.currentViewData[4].ganttProperties.resourceInfo[1][ganttObj.resourceFields.unit]).toBe(100);
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Work', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
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
                work: 'EstimatedWork',
                child: 'subtasks'
            },
	    taskType:'FixedWork',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit'
            },
            resources: resources,
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
                 { field: 'Work', width: 100 },
                 { field: 'Notes', width: 100 },
                 { field: 'Customcol', headerText: 'Custom Column', width: 100 }
             ],
        }, done);
    });
    it('Initial work,workunit,tasktype value checking with work mapping', () => {
        //Task without resource
        expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo).toBe(null);
        expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(40.45);
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
        expect(ganttObj.currentViewData[1].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedWork');
        //Task with resource
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3[69.83%],Resource 1[69.83%]');
        expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(20);
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(1.79);
        expect(ganttObj.currentViewData[2].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedWork');
        //Parent Task without resource
        expect(ganttObj.currentViewData[0].ganttProperties.resourceInfo).toBe(null);
        expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(140.45);
        expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(13);
        expect(ganttObj.currentViewData[0].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
    });
    it('Editing Work column with fixed work', () => {
         expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3[69.83%],Resource 1[69.83%]');
         expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(69.83);
         expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1][ganttObj.resourceFields.unit]).toBe(69.83);
         expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(20);
         expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(1.79);
         expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedWork');
         let work: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(12)') as HTMLElement;
         triggerMouseEvent(work, 'dblclick');
         let input = <HTMLInputElement>document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolEstimatedWork');
         if (input) {
             input.value = '40';
             let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element, 'click');
             expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3[40%],Resource 1');
             expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(40);
             expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1][ganttObj.resourceFields.unit]).toBe(100);
             expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(40);
             expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(3.57);
         }
     });
     it('Editing task type column to fixed duration', () => {
         expect(ganttObj.currentViewData[3].ganttProperties.resourceNames).toBe('Resource 4');
         expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(100);
         expect(ganttObj.currentViewData[3].ganttProperties.work).toBe(80);
         expect(ganttObj.currentViewData[3].ganttProperties.duration).toBe(10);
         expect(ganttObj.currentViewData[3].ganttProperties.taskType).toBe('FixedWork');
         let taskType: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(13)') as HTMLElement;
         triggerMouseEvent(taskType, 'dblclick');
         let taskInput: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontroltaskType') as HTMLElement;
         if (taskInput) {
             let input: any = taskInput.ej2_instances[0];
             input.value = 'FixedDuration';
             input.dataBind();
             let element1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element1, 'click');
             //change work value
             let work: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(12)') as HTMLElement;
             triggerMouseEvent(work, 'dblclick');
             let workInput = <HTMLInputElement>document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolEstimatedWork');
             workInput.value = '40';
             let element2: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element2, 'click');
             expect(ganttObj.currentViewData[3].ganttProperties.resourceNames).toBe('Resource 4[50%]');
             expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(50);
             expect(ganttObj.currentViewData[3].ganttProperties.work).toBe(40);
             expect(ganttObj.currentViewData[3].ganttProperties.duration).toBe(10);
             expect(ganttObj.currentViewData[3].ganttProperties.taskType).toBe('FixedDuration');
         }
     });
     it('Work unit checking with day', (done) => {
         ganttObj.dataBind();
         ganttObj.workUnit = 'Day';
         ganttObj.dataBound = () => {
             expect(ganttObj.currentViewData[6].ganttProperties.resourceNames).toBe('Resource 2[0%]');
             expect(ganttObj.currentViewData[6].ganttProperties.workUnit).toBe('day');
             done();
         };
         ganttObj.refresh();
     });
    it('Work unit checking with minute', (done) => {
        ganttObj.dataBind();
        ganttObj.workUnit = 'Minute';
        ganttObj.dataBound = () => {
            expect(ganttObj.currentViewData[3].ganttProperties.resourceNames).toBe('Resource 4[98.04%]');
            expect(ganttObj.currentViewData[3].ganttProperties.workUnit).toBe('minute');
            done();
        };
        ganttObj.refresh();
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
    it('Changing taskmode of a task to manual', () => {
        expect(ganttObj.currentViewData[1].ganttProperties.isAutoSchedule).toBe(true);
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(element, 'dblclick');
        let taskMode: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolisManual') as HTMLElement;
        if (taskMode) {
            let inputObj: any = taskMode.ej2_instances[0];
            inputObj.value = true;
            inputObj.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        }
        expect(ganttObj.currentViewData[1].ganttProperties.isAutoSchedule).toBe(false);
    });
    it('Changing taskmode of a task to auto', () => {
        let startDate: Date = ganttObj.currentViewData[2].ganttProperties.startDate;
        expect(ganttObj.getFormatedDate(startDate, 'M/d/yyyy')).toBe('2/26/2017');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(element, 'dblclick');
        let taskMode: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolisManual') as HTMLElement;
        if (taskMode) {
            let inputObj: any = taskMode.ej2_instances[0];
            inputObj.value = false;
            inputObj.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
        }
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/27/2017');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('adding task type in taskFields', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: taskTypeData,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks',
                type: 'taskType'
            },
            taskType: 'FixedUnit',
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
            columns: [
                { field: 'TaskID' },
                { field: 'TaskName', headerText: 'Task Name', width: '180' },
                { field: 'Duration', width: '100' },
                { field: 'taskType', headerText: 'Task Type', width: '110',valueAccessor:valueAccess }
            ],
        }, done);
    });
    it('task type on load time', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedUnit');
        expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[7].ganttProperties.taskType).toBe('FixedUnit');
        expect(ganttObj.currentViewData[8].ganttProperties.taskType).toBe('FixedDuration');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('work mapping with tasktype', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: taskTypeWorkData,
            allowSorting: true,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                dependency:'Predecessor',
                child: 'subtasks',
                type: 'taskType',
                work: 'work'
            },
	    taskType:'FixedWork',
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
            columns: [
                { field: 'TaskID' },
                { field: 'TaskName', headerText: 'Task Name', width: '180' },
                { field: 'Duration', width: '100' },
                { field: 'work', width: '100' },
                { field: 'taskType', headerText: 'Task Type', width: '110' }
            ],
        }, done);
    });
    it('task type with work mapping on load time', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedWork');
        expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[7].ganttProperties.taskType).toBe('FixedWork');
        expect(ganttObj.currentViewData[8].ganttProperties.taskType).toBe('FixedDuration');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('taskType with resourceUnit mapping', () => {
    let ganttObj: Gantt;

    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: resourceDataTaskType,
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
            type: 'type'
        },
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
        workUnit: 'Hour',
	taskType:'FixedWork',
        toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
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
            { field: 'taskType', headerText: 'Task Type', width: '110' }
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
    it('task type with work mapping and unit mapping on load time', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedWork');
        expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[6].ganttProperties.taskType).toBe('FixedUnit');
    });
    it('testing load time fixed duration task', () => {
        expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(96);
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)')
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = '5 days';
        let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(update, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(120);
    });
    it('testing load time fixed unit task', () => {
        expect(ganttObj.currentViewData[6].ganttProperties.work).toBe(48);
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(7) > td:nth-child(5)')
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = '4 days';
        let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(update, 'click');
        expect(ganttObj.currentViewData[6].ganttProperties.work).toBe(64);
    });
     it('testing load time fixed work task', () => {
        expect(ganttObj.currentViewData[5].ganttProperties.resourceInfo[0]['unit']).toBe(50);
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(5)')
        triggerMouseEvent(duration, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration')).ej2_instances[0];
        input.value = '8 days';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[5].ganttProperties.resourceInfo[0]['unit']).toBe(46.88);
    });
    it('Adding a new task after performing expand/collapse multiple times', () => {
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(1) > div > span') as HTMLElement;
        triggerMouseEvent(element, 'dblclick');
        ganttObj.openAddDialog();
        let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
        triggerMouseEvent(saveButton, 'click');
        expect(ganttObj.currentViewData[0]['TaskID']).toBe(10);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
    describe('Update notes tab', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
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
                    child: 'subtasks'
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                    unit: 'resourceUnit'
                },
                resources: resources,
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
                    { field: 'Resource', width: 100 },
                    { field: 'Notes', width: 100 },
                ],
            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 100);
            ganttObj.openAddDialog();
            let notesTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            notesTab.selectedItem = 3;
        });
        it('Add Notes using add dialog', (done: Function) => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    expect(ganttObj.currentViewData[0].ganttProperties.notes).toBe('<p>Updated</p>');
                    done();
                }
            };
            let notesTab: RichTextEditor = (document.getElementById(ganttObj.element.id + 'NotesTabContainer') as any).ej2_instances[0]
            notesTab.value = "Updated";
			notesTab.dataBind();
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('update taskID by using updatetaskID method', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData,
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
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
        it('update taskID using updateTaskId method', () => {
            ganttObj.updateTaskId(2,40);
            expect(ganttObj.currentViewData[1]['TaskID']).toBe(40);
            expect(ganttObj.currentViewData[1].taskData['TaskID']).toBe(40);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Custom timeline unit count', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: customZoomingdata,
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll'],
                allowSelection: true,
                gridLines: "Both",
                showColumnMenu: false,
                highlightWeekends: true,
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
                timelineSettings: {
                    timelineUnitSize: 99,
                    timelineViewMode: 'Month',
                    bottomTier: {
                        unit: 'Month',
                        count: 1,
                    },
                    topTier: {
                        unit: 'Month',
                        count: 5,
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/24/2019'),
                projectEndDate: new Date('07/06/2019'),
            }, done);
        });
        it('Timeline unit count', () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(5);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Cell Edit', () => {
        let ganttObj: Gantt;
        let preventDefault: Function = new Function();
        beforeAll((done: Function) => {
            ganttObj = createGantt({
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
                  resourceInfo: 'resources',
                },
                editSettings: {
                  allowAdding: true,
                  allowEditing: true,
                  allowDeleting: true,
                  allowTaskbarEditing: true,
                  allowNextRowEdit: true,
                  showDeleteConfirmDialog: true,
                },
                toolbar: ['Add','Edit','Update','Delete','Cancel'],
                allowSelection: true,
                allowRowDragAndDrop: true,
                gridLines: 'Both',
                height: '450px',
                columns: [
                  { field: 'TaskID', width: 60 },
                  {field: 'TaskName',headerText: 'Job Name',width: '250',clipMode: 'EllipsisWithTooltip',},
                  { field: 'StartDate' },
                  { field: 'Duration' },
                  { field: 'Progress' },
                  { field: 'Predecessor' },
                ],
                splitterSettings: {columnIndex: 6},
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
              }, done);
        });
        it('Tab navigation to next row', () => {
            let customColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(7)') as HTMLElement;
            triggerMouseEvent(customColumn, 'dblclick');
            let args: any = { action: 'tab', preventDefault: preventDefault, target: ganttObj.treeGrid.grid.element.querySelector('.e-editedbatchcell') } as any;
            ganttObj.keyboardModule.keyAction(args);
            let args1: any = { action: 'tab', preventDefault: preventDefault, target: ganttObj.treeGrid.grid.element.querySelector('.e-editedbatchcell') } as any;
            ganttObj.keyboardModule.keyAction(args1);
            expect(ganttObj.treeGrid.grid.isEdit).toBe(true);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Milestone date cell edit', () => {
        let ganttObj: Gantt;
        let preventDefault: Function = new Function();
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData,
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
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
                'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
            
                height: '550px',
                allowUnscheduledTasks: true,
              //  connectorLineBackground: "red",
              //  connectorLineWidth: 3,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),            
              }, done);
        });
        it('Cell edit milestone', () => {
            let customColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(customColumn, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')as any).ej2_instances[0];
            input.value = new Date('2/8/2017');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4].ganttProperties.startDate,'M/d/yyyy')).toBe('2/8/2017');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
describe('Gantt editing action', () => {
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
    it('Editing task name and save in chart side', () => {
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-left-label-container') as HTMLElement;
        triggerMouseEvent(row, 'mousedown', 10, 10, false, true);
        triggerMouseEvent(row, 'mousedown', 10, 10, false, true);
        expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt parent record editing action', () => {
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
                resources: resourcesData,
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
    it('Editing start date', () => {
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')as any).ej2_instances[0];
        input.value = new Date('04/04/2019');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/4/2019');
     
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Console error in parent ID', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: customSelfReferenceData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    parentID: 'parentID',
                },
                resources: resourcesData,
                projectStartDate: new Date('03/03/2017'),
                projectEndDate: new Date('04/18/2017'),
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
            }, done);
    });
    it('Checking gantt renders', () => {
        expect(ganttObj.currentViewData.length > 0).toBe(true);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Assign datasource after initial load', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [],
		dataBound() {
		   ganttObj.dataSource = projectData;
		},
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
                resources: resourcesData,
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

    it('Editing Task Name', () => {
        ganttObj.actionBegin = (args) => {
            if(args.requestType === 'beforeSave') {
                expect(args.modifiedRecords.length).toBe(2);
            }
        }
        let name: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
	if(name) {
        triggerMouseEvent(name, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName')as any).ej2_instances[0];
        input.value = 'game';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
	}
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Edit template for start date column', () => {
    let ganttObj: Gantt;
    let dropdownlistObj: Calendar;
    let elem: HTMLElement;
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
                resources: resourcesData,
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
                    { field: 'StartDate', edit: {
                        create: () => {
                            elem = document.createElement('div');
                            return elem;
                        },
                        read: () => {
                           return dropdownlistObj.value;
                        },
                        destroy: () => {
                            dropdownlistObj.destroy();
                        },
                        write: (args: Object) => {
                            dropdownlistObj = new Calendar({
                                weekNumber: true,
                            });
                            dropdownlistObj.appendTo(elem);
                        }
                    }, width: 200 },
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
    
    it('Editing Task Name', () => {
        let name: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(name, 'dblclick');
	expect(document.getElementsByClassName('e-calendar').length).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
// describe('Edit for start date column to be null', () => {
//     let ganttObj: Gantt;
//     let data = [
//         {
//             TaskID: 1,
//             TaskName: 'Project initiation',
//             StartDate: new Date('03/29/2019'),
//             EndDate: new Date('04/21/2019'),
//             subtasks: [
//                 {
//                     TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
//                     Progress: 30, work: 10, resources: [{ resourceId: 1, resourceUnit: 50 }]
//                 },
//                 {
//                     TaskID: 3, TaskName: 'Perform soil test', StartDate: new Date('03/29/2019'), Duration: 4,
//                     resources: [{ resourceId: 2, resourceUnit: 70 }], Progress: 30, work: 20
//                 },
//                 {
//                     TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('03/29/2019'), Duration: 4,
//                     resources: [{ resourceId: 1, resourceUnit: 75 }], Predecessor: 2, Progress: 30, work: 10,
//                 },
//             ]
//         },
//         {
//             TaskID: 5,
//             TaskName: 'Project estimation', StartDate: new Date('03/29/2019'), EndDate: new Date('04/21/2019'),
//             subtasks: [
//                 {
//                     TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('03/29/2019'),
//                     Duration: 3, Progress: 30, resources: [{ resourceId: 2, resourceUnit: 70 }], Predecessor: '3FS+2', work: 30
//                 },
//                 {
//                     TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/08/2019'), Duration: 12,
//                     resources: [{ resourceId: 6, resourceUnit: 40 }], Progress: 30, work: 40
//                 },
//                 {
//                     TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/03/2019'),
//                     Duration: 10, resources: [{ resourceId: 5, resourceUnit: 75 }], Progress: 30, work: 60,
//                 },
//                 {
//                     TaskID: 9, TaskName: 'Excavate for foundations', StartDate: new Date('04/01/2019'),
//                     Duration: 4, Progress: 30, resources: [4]
//                 },
//                 {
//                     TaskID: 10, TaskName: 'Install plumbing grounds', StartDate: new Date('04/08/2019'), Duration: 4,
//                     Progress: 30, Predecessor: '9SS', resources: [3]
//                 },
//                 {
//                     TaskID: 11, TaskName: 'Dig footer', StartDate: new Date('04/08/2019'),
//                     Duration: 3, resources: [2]
//                 },
//                 {
//                     TaskID: 12, TaskName: 'Electrical utilities', StartDate: new Date('04/03/2019'),
//                     Duration: 4, Progress: 30, resources: [3]
//                 }
//             ]
//         },
//         {
//             TaskID: 13, TaskName: 'Sign contract', StartDate: new Date('04/04/2019'), Duration: 2,
//             Progress: 30,
//         }
//     ];
//     let resourceCollection = [
//         { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'},
//         { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
//         { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' },
//         { resourceId: 4, resourceName: 'Fuller King', resourceGroup: 'Development Team' },
//         { resourceId: 5, resourceName: 'Davolio Fuller', resourceGroup: 'Approval Team' },
//         { resourceId: 6, resourceName: 'Van Jack', resourceGroup: 'Development Team' }
//     ];
//     beforeAll((done: Function) => {
        
//         ganttObj = createGantt(
//             {
//                 dataSource: data,
//   resources: resourceCollection,
//   viewType: 'ResourceView',
//   enableMultiTaskbar: true,
//   showOverAllocation: true,
//   taskFields: {
//     id: 'TaskID',
//     name: 'TaskName',
//     startDate: 'StartDate',
//     endDate: 'EndDate',
//     duration: 'Duration',
//     progress: 'Progress',
//     notes: 'Notes',
//     baselineStartDate: 'BaselineStartDate',
//     baselineEndDate: 'BaselineEndDate',
//     resourceInfo: 'Resource',
//     dependency: 'Predecessor',
//     child: 'subtasks',
//   },
//   resourceFields: {
//     id: 'resourceId',
//     name: 'resourceName',
//     unit: 'resourceUnit',
//     group: 'resourceGroup',
//   },
//   editDialogFields: [
//     { type: 'General' },
//     { type: 'Dependency' },
//     { type: 'Resources' },
//     { type: 'Notes' },
//   ],
//   editSettings: {
//     allowAdding: true,
//     allowEditing: true,
//     allowDeleting: true,
//     allowTaskbarEditing: true,
//     showDeleteConfirmDialog: true,
//   },
//   columns: [
//     { field: 'TaskID', visible: false },
//     { field: 'TaskName', headerText: 'Name', width: 250 },
//     { field: 'work', headerText: 'Work' },
//     { field: 'Progress' },
//     { field: 'resourceGroup', headerText: 'Group' },
//     { field: 'StartDate' },
//     { field: 'Duration' },
//   ],
//   toolbar: [
//     'Add',
//     'Edit',
//     'Update',
//     'Delete',
//     'Cancel',
//     'ExpandAll',
//     'CollapseAll',
//   ],
//   labelSettings: {
//     taskLabel: 'TaskName',
//   },
//   splitterSettings: {
//     columnIndex: 2,  
//   },
//   allowResizing: true,
//   allowSelection: true,
//   highlightWeekends: true,
//   allowUnscheduledTasks: true,
//   treeColumnIndex: 1,
//   height: '450px',
//   projectStartDate: new Date('03/28/2019'),
//   projectEndDate: new Date('05/18/2019'),
//             }, done);
//     });
//     afterAll(() => {
//         if (ganttObj) {
//             destroyGantt(ganttObj);
//         }
//     });
//     it('Editing Start date', (done: Function) => {
//         ganttObj.actionComplete = (args: any): void => {
//             if(args.requestType === 'save') {
//                 expect(args.data.ganttProperties.startDate).toBe(null);
//                 done();
//             }
//         }
//         let name: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8) > td:nth-child(5)') as HTMLElement;
//         triggerMouseEvent(name, 'dblclick');
//         let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')as any).ej2_instances[0];
//         input.value = null;
//         let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
//         triggerMouseEvent(element, 'click');
//     });
//     it('Editing taskname for parent task', () => {
//         ganttObj.dataBind();
//         let name: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(5)') as HTMLElement;
//         triggerMouseEvent(name, 'dblclick');
//     });
// });
describe('CR:866697-The taskbar render validation not working properly', () => {
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
                            { TaskID: 2, TaskName: 'Defining the product and its usage', StartDate: new Date('04/02/2019'), Duration: 0.5, Progress: 30 },
                            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 0.5, Predecessor: "2", Progress: 30 },
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
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            }, done);
    });
    
    it('Checking taskbar width and enddate', () => {
        expect(ganttObj.currentViewData[3].ganttProperties.duration).toBe(0.5);
        expect(ganttObj.currentViewData[3].ganttProperties.width).toBe(16.5);
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.endDate, 'MM/dd/yyyy')).toBe('04/02/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Checking predecessor update while updating duration', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: virtualData1,
                treeColumnIndex: 1,
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
                    notes: 'info',
                },
                enableVirtualization: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                allowReordering: true,
                enableContextMenu: true,
                columns: [
                    { field: 'TaskID', headerText: 'ID', textAlign: 'Left' },
                    { field: 'TaskName', headerText: 'Name' },
                    { field: 'StartDate', headerText: 'Start Date' },
                    { field: 'EndDate', headerText: 'End Date' },
                    { field: 'Duration', headerText: 'Duration' },
                    { field: 'Predecessor', headerText: 'Dependency' },
                    { field: 'Progress', headerText: 'Progress' },
                    { field: 'BaselineStartDate', headerText: 'Baseline Start Date' },
                    { field: 'BaselineEndDate', headerText: 'Baseline End Date' },
                    { field: 'info', headerText: 'Notes' },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                    { text: 'Show/Hide Overallocation', tooltipText: 'Show/Hide Overallocation', id: 'showhidebar' }, 'Indent', 'Outdent', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

                allowExcelExport: true,
                allowPdfExport: true,
                allowSelection: true,
                allowRowDragAndDrop: true,
                highlightWeekends: true,
                allowFiltering: true,
                gridLines: 'Both',
                height: '550px',
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
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
                selectionSettings: {
                    mode: 'Row',
                    type: 'Single',
                    enableToggle: false
                },
                tooltipSettings: {
                    showTooltip: true
                },
                taskbarHeight: 20,
                rowHeight: 40,
                splitterSettings: {
                    columnIndex: 3
                },
            }, done);
    });
    
    it('updating duration', (done: Function) => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = '6 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        setTimeout(() => {
            triggerMouseEvent(element, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[7].ganttProperties.startDate, 'M/d/yyyy')).toBe(ganttObj.getFormatedDate(ganttObj.currentViewData[8].ganttProperties.startDate, 'M/d/yyyy'));
            done();
        }, 1000);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('coverageImp - parent record  editing', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: coverageData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    endDate: 'EndDate',
                    startDate: 'StartDate',
                    manual: 'isManual',
                    duration: 'Duration',
                    progress: 'Progress',
                    notes: 'Notes',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                },
                allowParentDependency: false,
                splitterSettings: {
                    columnIndex: 6
                },
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                renderBaseline: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true
                },
                taskMode: 'Custom',
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName', editType: 'stringedit', width: 100 },
                    { field: 'StartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'isManual', editType: 'dropdownedit', width: 100 ,headerText:'Manual',valueAccessor: valueAccess},
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
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });
    
    it('Editing parent taskbar', () => {
        ganttObj.dataBind();
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let dependencyInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        expect(dependencyInput).toBe(null);
        let progress: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(progress, 'dblclick');
        let progressInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolProgress') as HTMLElement;
        // expect(progressInput).toBe(null);
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let endDateInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as HTMLElement;
        expect(endDateInput).toBe(null);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt editing action', () => {
    let ganttObj: Gantt;;
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
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true,
                    mode: 'Dialog'
                },
                readOnly: true,
                editDialogFields: [
                    { type: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                ],
                allowUnscheduledTasks: true,
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName', editType: 'stringedit', width: 100 },
                    { field: 'StartDate', editType: 'datepickeredit', width: 100 }
                ],
            }, done);
    });
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });
    
    it('Editing task name', () => {
        ganttObj.dataBind();
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('Child Task 1');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt editing field as null', () => {
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
                    dependency: 'Predecessor',
                    child: 'subtasks'
                },
                splitterSettings: {
                    position: '70%'
                },
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
                renderBaseline: true,
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowNextRowEdit: true
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'TaskID', width: 60 },
                    { field: 'TaskName', editType: 'stringedit', width: 100 },
                    { field: 'StartDate', editType: 'datepickeredit', width: 100 },
                    { field: 'EndDate', editType: 'datepickeredit', width: 100 },
                    { field: 'Duration', width: 100 }
                ],
            }, done);
    });
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });
    

    it('Editing feild as empty', () => {
        ganttObj.dataBind();
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
        input.value = null;
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/2/2019');
    });

    it('Editing end date column', () => {
        ganttObj.dataBind();
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
        input.value = '';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
    });
    it('Editing duration column', () => {
        ganttObj.dataBind();
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = null;
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
    });
    it('Editing duration column', () => {
        ganttObj.dataBind();
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = -3;
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt editing action with work', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesDatas,
                resources: resourceResources,
                viewType: 'ResourceView',
                showOverAllocation: true,
                enableContextMenu: true,
                allowSorting: true,
                splitterSettings: {
                    columnIndex: 3
                },
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
                    { field: 'TaskName', headerText: 'Name', width: 250 },
                    { field: 'work', headerText: 'Work',valueAccessor:valueAccess },
                    { field: 'taskType', headerText: 'Task Type', width: '110' },
                    { field: 'Progress' },
                    { field: 'resourceGroup', headerText: 'Group',allowFiltering: true },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                allowResizing: true,
                allowFiltering: true,
                allowSelection: true,
                highlightWeekends: true,
                allowTaskbarOverlap: false,
                treeColumnIndex: 1,
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });
    
    it('Editing work', () => {
        let work: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(work, 'dblclick');
        let input = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolwork') as any).ej2_instances[0];
        if (input) {
            input.value = '10';
            input.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(10);
        }
    });
    it('Editing task type', () => {
        ganttObj.dataBind();
        let taskType: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(taskType, 'dblclick');
        let taskInput: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontroltaskType') as HTMLElement;
        if (taskInput) {
            let input: any = taskInput.ej2_instances[0];
            input.value = 'FixedDuration';
            input.dataBind();
            let taskType: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskType, 'dblclick');
            expect(ganttObj.currentViewData[3].ganttProperties.taskType).toBe('FixedDuration');
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt editing in split task', () => {
    let ganttObj: Gantt;
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
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "70%",
                    // columnIndex: 4
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
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });
    
    it('Editing end date column', () => {
        ganttObj.dataBind();
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
        input.value = new Date('02/04/2019');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/4/2019');
    });
    it('Editing duration column', () => {
        ganttObj.dataBind();
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = 5;
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(5);
    });
    it('Editing progress column', () => {
        ganttObj.dataBind();
        let progress: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(progress, 'dblclick');
        let input = (<HTMLInputElement>document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolProgress') as any).ej2_instances[0];
        input.value = '105';
        let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(record, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.progress).toBe(100);
    });
    it('Editing progress', () => {
        ganttObj.dataBind();
        let progress: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(progress, 'dblclick');
        let input = (<HTMLInputElement>document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolProgress') as any).ej2_instances[0];
        input.value = '90';
        let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(record, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.progress).toBe(90);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt startdate editing for milestone', () => {
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
                            { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
                            { TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3 },
                            { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "2", Progress: 30 },
                        ]
                    }
                ],
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    endDate: 'EndDate',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                allowParentDependency: false,
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
                    { field: 'EndDate', headerText: 'End Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                allowSelection: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "50%",
                },
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
                height: '550px',
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });
    
    it('Editing end date column', () => {
        ganttObj.dataBind();
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
        input.value = new Date('04/02/2019');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/2/2019');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt enddate editing in manual task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
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
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: '${Progress}%'
                },
                projectStartDate: new Date('02/20/2017'),
                projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });

    it('Editing progress column', () => {
        ganttObj.dataBind();
        let progress: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(progress, 'dblclick');
        let input = (<HTMLInputElement>document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolProgress') as any).ej2_instances[0];
        input.value = '105';
        let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(record, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.progress).toBe(100);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Gantt resuoce in resource view', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesDatas,
                resources: resourceResources,
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
                    { field: 'resources',allowFiltering: false },
                    { field: 'resourceGroup', headerText: 'Group' },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                ],
                labelSettings: {
                    rightLabel: 'resources',
                    taskLabel: 'Progress'
                },
                splitterSettings: {
                    columnIndex: 4
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
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });
    
    it('Editing resource column', () => {
        ganttObj.dataBind();
        let progress: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(progress, 'dblclick');
        let input = (<HTMLInputElement>document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolresources') as any).ej2_instances[0];
        input.value = 'Rose Fuller';
        let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(record, 'click');
        expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe('Martin Tamer[75%]');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Cr-885322 duration get deleted when start date empty', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: cR885322,
                dateFormat: 'MMM dd, y',
                treeColumnIndex: 1,
                allowSelection: true,
                showColumnMenu: false,
                highlightWeekends: true,
                allowUnscheduledTasks: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subTasks',
                    notes: 'info',
                    resourceInfo: 'resources',
                },
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources',
                },
                splitterSettings: {
                    columnIndex: 2,
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                gridLines: 'Both',
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
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
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
                ]
            }, done);
    });
    // beforeEach((done: Function) => {
    //     setTimeout(done, 500);
    // });
    
    it('Checking Duration', () => {
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(1);
    });
    it('Checking parent date', (done: Function) => {
        ganttObj.actionComplete = (args: any): void => {
            if(args.requestType === 'add') {
                expect(args.data.ganttProperties.left).toBe(66);
                done();
            }
        }
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')as any).ej2_instances[0];
        input.value = new Date('04/02/2024');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let i = Math.floor(Math.random() * (100 - 1 + 1) + 1);
        let dataItem = {
            id: `62ed764512fb9e8q015ae94cf${i}`,
            TaskID: `SUBITEM-0${i}`,
            TaskName: `SUBITEM-0${i}`,
            Duration: 1,
            Progress: 20,
            parent: '62ed75125fb9p80015ae8ee7',
            rank: '3',
            PlannedStartDate: '2022-12-05T16:00:00.000Z',
            PlannedEndDate: '2022-12-30T01:00:00.000Z',
            isExpand: true,
        };
        let parentRow = ganttObj.getRowByID('ITEM-02');
        if (parentRow) {
            ganttObj.editModule.addRecord(dataItem, 'Child', 3);
        }
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR:885318-Custom value task type does not render initially, and the dropdown does not display correctly', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: cellEditData1,
            taskFields: {
                id: 'TaskID',
                name: 'TaskName',
                startDate: 'StartDate',
                duration: 'Duration',
                progress: 'Progress',
                resourceInfo: 'resources',
                work: 'Work',
                child: 'subtasks',
                type: 'SchedulingType',
            },
	    taskType:'FixedWork',
            resourceFields: {
                id: 'resourceId',
                name: 'resourceName',
                unit: 'resourceUnit'
            },
            splitterSettings:{
                columnIndex: 4
            },
            resources: resources,
            projectStartDate: new Date('03/25/2019'),
            projectEndDate: new Date('05/30/2019'),
            renderBaseline: true,
            editSettings: {
                allowAdding: true,
                allowEditing: true,
                allowDeleting: true,
            },
            allowUnscheduledTasks: true,
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
            columns: [
                { field: 'TaskID'},
                { field: 'SchedulingType', headerText: 'Task Type', width: '210' },
                { field: 'TaskName', headerText: 'Task Name', width: '180' },
                { field: 'resources', headerText: 'Resources', width: '160' },
                { field: 'Work', width: '110' },
                { field: 'Duration', width: '100' },
            ],
        }, done);
    });
    it('Checking custom TaskType', () => {
            let element1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
            let elementValue: string = element1.innerHTML;
            expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
            expect(elementValue).toBe('FixedDuration');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Cr-885322 Checking Parent date', () => {
    let ganttObj: Gantt;
    let resourceCollections : any =  [
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
    ]
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: cR885322,
                dateFormat: 'MMM dd, y',
                treeColumnIndex: 1,
                allowSelection: true,
                showColumnMenu: false,
                highlightWeekends: true,
                allowUnscheduledTasks: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subTasks',
                    notes: 'info',
                    resourceInfo: 'resources',
                },
                timelineSettings: {
                    topTier: {
                        unit: 'Week',
                        format: 'MMM dd, y',
                    },
                    bottomTier: {
                        unit: 'Day',
                    },
                },
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources',
                },
                splitterSettings: {
                    columnIndex: 2,
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true,
                },
                gridLines: 'Both',
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
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                },
                resources: resourceCollections
            }, done);
    });

    it('Parent Date Value', (done: Function) => {
        ganttObj.actionBegin = (args: any): void => {
            if (args.requestType === 'beforeSave') {
                expect(ganttObj.getFormatedDate(ganttObj.flatData[0]['EndDate'], 'M/d/yyyy')).toBe('4/1/2024');
                done();
            }
        }
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
        input.value = new Date('4/1/2024');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
// describe('update task name in immutable mode', () => {
//     let ganttObj: Gantt;
//     let projectNewData: Object[] = [
//         {
//             TaskID: 1,
//             TaskName: 'Product Concept',
//             StartDate: new Date('04/02/2019'),
//             EndDate: new Date('04/21/2019'),
//             subtasks: [
//                 { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
//                 {
//                     TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
//                     Indicators: [
//                         {
//                             'date': '04/10/2019',
//                             'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
//                             'name': 'Indicator title',
//                             'tooltip': 'tooltip'
//                         }
//                     ]
//                 },
//                 { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
//             ]
//         },
//         { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" }
//     ];
//     beforeAll((done: Function) => {
//         ganttObj = createGantt(
//             {
//                 dataSource: projectNewData,
//                 allowSorting: true,
//                 allowReordering: true,
//                 enableContextMenu: true,
//                 enableImmutableMode: true,
//                 taskFields: {
//                     id: 'TaskID',
//                     name: 'TaskName',
//                     startDate: 'StartDate',
//                     duration: 'Duration',
//                     progress: 'Progress',
//                     dependency: 'Predecessor',
//                     baselineStartDate: "BaselineStartDate",
//                     baselineEndDate: "BaselineEndDate",
//                     child: 'subtasks',
//                     indicators: 'Indicators'
//                 },
//                 renderBaseline: true,
//                 baselineColor: 'red',
//                 editSettings: {
//                     allowAdding: true,
//                     allowEditing: true,
//                     allowDeleting: true,
//                     allowTaskbarEditing: true,
//                     showDeleteConfirmDialog: true
//                 },
//                 columns: [
//                     { field: 'TaskID', headerText: 'Task ID' },
//                     { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
//                     { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
//                     { field: 'Duration', headerText: 'Duration', allowEditing: false },
//                     { field: 'Progress', headerText: 'Progress', allowFiltering: false },
//                     { field: 'CustomColumn', headerText: 'CustomColumn' }
//                 ],
//                 sortSettings: {
//                     columns: [{ field: 'TaskID', direction: 'Ascending' },
//                     { field: 'TaskName', direction: 'Ascending' }]
//                 },
//                 toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
//                     'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
//                 allowExcelExport: true,
//                 allowPdfExport: true,
//                 allowSelection: true,
//                 allowRowDragAndDrop: true,
//                 selectedRowIndex: 1,
//                 splitterSettings: {
//                     position: "50%",
//                     // columnIndex: 4
//                 },
//                 selectionSettings: {
//                     mode: 'Row',
//                     type: 'Single',
//                     enableToggle: false
//                 },
//                 tooltipSettings: {
//                     showTooltip: true
//                 },
//                 filterSettings: {
//                     type: 'Menu'
//                 },
//                 allowFiltering: true,
//                 gridLines: "Both",
//                 showColumnMenu: true,
//                 highlightWeekends: true,
//                 timelineSettings: {
//                     showTooltip: true,
//                     topTier: {
//                         unit: 'Week',
//                         format: 'dd/MM/yyyy'
//                     },
//                     bottomTier: {
//                         unit: 'Day',
//                         count: 1
//                     }
//                 },
//                 eventMarkers: [
//                     {
//                         day: '04/10/2019',
//                         cssClass: 'e-custom-event-marker',
//                         label: 'Project approval and kick-off'
//                     }
//                 ],
//                 holidays: [{
//                     from: "04/04/2019",
//                     to: "04/05/2019",
//                     label: " Public holidays",
//                     cssClass: "e-custom-holiday"

//                 },
//                 {
//                     from: "04/12/2019",
//                     to: "04/12/2019",
//                     label: " Public holiday",
//                     cssClass: "e-custom-holiday"

//                 }],
//                 searchSettings:
//                 {
//                     fields: ['TaskName', 'Duration']
//                 },
//                 labelSettings: {
//                     leftLabel: 'TaskID',
//                     rightLabel: 'Task Name: ${taskData.TaskName}',
//                     taskLabel: '${Progress}%'
//                 },
//                 allowResizing: true,
//                 readOnly: false,
//                 taskbarHeight: 20,
//                 rowHeight: 40,
//                 height: '550px',
//                 allowUnscheduledTasks: true,
//                 //  connectorLineBackground: "red",
//                 //  connectorLineWidth: 3,
//                 projectStartDate: new Date('03/25/2019'),
//                 projectEndDate: new Date('05/30/2019'),
//             }, done);
//     });
//     afterAll(() => {
//         if (ganttObj) {
//             destroyGantt(ganttObj);
//         }
//     });
//     it('update record by id', () => {
//         let taskname: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
//         // triggerMouseEvent(taskname, 'dblclick');
//         // let data = {
//         //     TaskID: 2,
//         //     TaskName: 'Updated by index value'
//         // };
//         // ganttObj.updateRecordByID(data);
//         // expect(ganttObj.flatData[1].ganttProperties.taskName).toBe('Updated by index value');
//         // done();
//     });
// });
// describe('update task name in immutable mode', () => {
//     let ganttObj: Gantt;
//     let projectNewData: Object[] = [
//         {
//             TaskID: 1,
//             TaskName: 'Product Concept',
//             StartDate: new Date('04/02/2019'),
//             EndDate: new Date('04/21/2019'),
//             subtasks: [
//                 { TaskID: 2, TaskName: 'Defining the product  and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3, Progress: 30 },
//                 {
//                     TaskID: 3, TaskName: 'Defining target audience', StartDate: new Date('04/02/2019'), Duration: 3,
//                     Indicators: [
//                         {
//                             'date': '04/10/2019',
//                             'iconClass': 'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
//                             'name': 'Indicator title',
//                             'tooltip': 'tooltip'
//                         }
//                     ]
//                 },
//                 { TaskID: 4, TaskName: 'Prepare product sketch and notes', StartDate: new Date('04/02/2019'), Duration: 3, Predecessor: "2", Progress: 30 },
//             ]
//         },
//         { TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 0, Predecessor: "3,4" }
//     ];
//     beforeAll((done: Function) => {
//         ganttObj = createGantt(
//             {
//                 dataSource: projectNewData,
//                 allowSorting: true,
//                 allowReordering: true,
//                 enableContextMenu: true,
//                 enableImmutableMode: true,
//                 taskFields: {
//                     id: 'TaskID',
//                     name: 'TaskName',
//                     startDate: 'StartDate',
//                     duration: 'Duration',
//                     progress: 'Progress',
//                     dependency: 'Predecessor',
//                     baselineStartDate: "BaselineStartDate",
//                     baselineEndDate: "BaselineEndDate",
//                     child: 'subtasks',
//                     indicators: 'Indicators'
//                 },
//                 renderBaseline: true,
//                 baselineColor: 'red',
//                 editSettings: {
//                     allowAdding: true,
//                     allowEditing: true,
//                     allowDeleting: true,
//                     allowTaskbarEditing: true,
//                     showDeleteConfirmDialog: true
//                 },
//                 columns: [
//                     { field: 'TaskID', headerText: 'Task ID' },
//                     { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
//                     { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
//                     { field: 'Duration', headerText: 'Duration', allowEditing: false },
//                     { field: 'Progress', headerText: 'Progress', allowFiltering: false },
//                     { field: 'CustomColumn', headerText: 'CustomColumn' }
//                 ],
//                 sortSettings: {
//                     columns: [{ field: 'TaskID', direction: 'Ascending' },
//                     { field: 'TaskName', direction: 'Ascending' }]
//                 },
//                 toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
//                     'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
//                 allowExcelExport: true,
//                 allowPdfExport: true,
//                 allowSelection: true,
//                 allowRowDragAndDrop: true,
//                 selectedRowIndex: 1,
//                 splitterSettings: {
//                     position: "50%",
//                     // columnIndex: 4
//                 },
//                 selectionSettings: {
//                     mode: 'Row',
//                     type: 'Single',
//                     enableToggle: false
//                 },
//                 tooltipSettings: {
//                     showTooltip: true
//                 },
//                 filterSettings: {
//                     type: 'Menu'
//                 },
//                 allowFiltering: true,
//                 gridLines: "Both",
//                 showColumnMenu: true,
//                 highlightWeekends: true,
//                 timelineSettings: {
//                     showTooltip: true,
//                     topTier: {
//                         unit: 'Week',
//                         format: 'dd/MM/yyyy'
//                     },
//                     bottomTier: {
//                         unit: 'Day',
//                         count: 1
//                     }
//                 },
//                 eventMarkers: [
//                     {
//                         day: '04/10/2019',
//                         cssClass: 'e-custom-event-marker',
//                         label: 'Project approval and kick-off'
//                     }
//                 ],
//                 holidays: [{
//                     from: "04/04/2019",
//                     to: "04/05/2019",
//                     label: " Public holidays",
//                     cssClass: "e-custom-holiday"

//                 },
//                 {
//                     from: "04/12/2019",
//                     to: "04/12/2019",
//                     label: " Public holiday",
//                     cssClass: "e-custom-holiday"

//                 }],
//                 searchSettings:
//                 {
//                     fields: ['TaskName', 'Duration']
//                 },
//                 labelSettings: {
//                     leftLabel: 'TaskID',
//                     rightLabel: 'Task Name: ${taskData.TaskName}',
//                     taskLabel: '${Progress}%'
//                 },
//                 allowResizing: true,
//                 readOnly: false,
//                 taskbarHeight: 20,
//                 rowHeight: 40,
//                 height: '550px',
//                 allowUnscheduledTasks: true,
//                 //  connectorLineBackground: "red",
//                 //  connectorLineWidth: 3,
//                 projectStartDate: new Date('03/25/2019'),
//                 projectEndDate: new Date('05/30/2019'),
//             }, done);
//     });
//     afterAll(() => {
//         if (ganttObj) {
//             destroyGantt(ganttObj);
//         }
//     });
//     it('update record by id', () => {
//         let taskname: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
//         // triggerMouseEvent(taskname, 'dblclick');
//         // let data = {
//         //     TaskID: 2,
//         //     TaskName: 'Updated by index value'
//         // };
//         // ganttObj.updateRecordByID(data);
//         // expect(ganttObj.flatData[1].ganttProperties.taskName).toBe('Updated by index value');
//         // done();
//     });
// })

// describe('update task name in immutable mode', () => {
//     let ganttObj: Gantt;
//     beforeAll((done: Function) => {
//         ganttObj = createGantt(
//             {
//                 dataSource: dataSource1,
//                 allowSorting: true,
//                 dateFormat: 'MMM dd, y',
//                 allowSelection: true,
//                 highlightWeekends: false,
//                 includeWeekend: true,
//                 allowUnscheduledTasks: true,
//                 taskFields: {
//                     id: 'taskId',
//                     name: 'taskName',
//                     startDate: 'startDate',
//                     endDate: 'endDate',
//                     duration: 'duration',
//                     progress: 'progress',
//                     dependency: 'predecessor',
//                     parentID: 'parentID',
//                 },
//                 gridLines: 'Both',
//                 timelineSettings: {
//                     timelineUnitSize: 50,
//                     topTier: {
//                         unit: 'Month',
//                         format: 'MMM dd, y',
//                     },
//                     bottomTier: {
//                         unit: 'Day',
//                     },
//                 },
//                 labelSettings: {
//                     leftLabel: 'taskName',
//                 },
//                 height: "410px",
//                 editSettings: {
//                     allowAdding: true,
//                     allowEditing: true,
//                     allowDeleting: true,
//                     allowTaskbarEditing: true,
//                     showDeleteConfirmDialog: true,
//                 }
//             }, done);
//     });
//     it('update record by id', () => {
//         // ganttObj.actionComplete = (args: any): void => {
//         //     if(args.type === 'save') {
//         //         expect(ganttObj.flatData[1].taskData['predecessor']).toBe('')
//         //         done()
//         //     }
//         // }
//         let predecessor: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(6)') as HTMLElement;
//         // triggerMouseEvent(predecessor, 'dblclick');
//         // let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolpredecessor') as any).ej2_instances[0];
//         // input.value = '2fs'
//         // let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
//         // triggerMouseEvent(element, 'click');
//     });
//     afterAll(() => {
//         if (ganttObj) {
//             destroyGantt(ganttObj);
//         }
//     });
// });
describe('checking for dependency in split task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: splitTasksDataRelease,
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
                    { field: 'Predecessor',allowFiltering: false }
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
                {
                    fields: ['TaskName', 'Duration']
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
    beforeEach((done) => {
        setTimeout(done, 200);
    });
    it('update record by id', (done: Function) => {
        ganttObj.actionComplete = (args: any): void => {
            if(args.type === 'save') {
                expect(ganttObj.flatData[7]['Predecessor']).toBe('4SS')
                done()
            }
        }
        let predecessor: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8) > td:nth-child(8)') as HTMLElement;
        triggerMouseEvent(predecessor, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as any).ej2_instances[0];
        input.value = '4SS'
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Check for correct parent start date', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: unscheduledData1,
                allowSorting: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    child: 'child'
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
                actionBegin: (args) => {
                    if (args.requestType === "beforeSave") {
                        args.data.ganttProperties.startDate = args.data.ActualStartDate;
                        args.data.StartDate = args.data.ActualStartDate;
                        args.data.taskData.StartDate = args.data.ActualStartDate;
                    }
                },
                columns: [
                    { field: 'TaskId', width: 90 },
                    { field: 'TaskName', width: 80 },
                    { field: 'StartDate', width: 120 },
                    { field: 'EndDate', width: 120, editType: 'datepickeredit' },
                    { field: 'ActualStartDate', width: 120, editType: 'datepickeredit' },
                    { field: 'ActualEndDate', width: 120, editType: 'datepickeredit' },
                    { field: 'Duration', width: 90 }
                ],
                labelSettings: {
                    leftLabel: 'TaskName',
                    taskLabel: 'Progress'
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/01/2019'),
                projectEndDate: new Date('01/20/2019'),
            }, done);
    });
    it('Checking of start date', (done: Function) => {
        ganttObj.actionBegin = function (args: any): void {
            if (args.requestType === "beforeSave") {
                args.data.ganttProperties.startDate = args.data.ActualStartDate;
                args.data.StartDate = args.data.ActualStartDate;
                args.data.taskData.StartDate = args.data.ActualStartDate;
            }
        }
        ganttObj.actionComplete = (args: any): void => {
            if (args.type === 'save' && !isNullOrUndefined(ganttObj.currentViewData[0].ganttProperties.startDate)) {
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.startDate, 'M/d/yyyy')).toBe('1/11/2019')
                done()
            }
        }
        let actualStartDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(actualStartDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolActualStartDate') as any).ej2_instances[0];
        input.value = '1/11/2019'
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Undo Redo For Predecessor', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: MT887459,
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
    it('Changing Dependency', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input1: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input1.value = '3FS';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
        triggerMouseEvent(undo, 'click');
        expect(ganttObj.flatData[3]['Predecessor']).toBe('2FS')
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Progress edit in split task data', () => {
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
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "70%",
                    // columnIndex: 4
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
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Editing progress column', () => {
        ganttObj.dataBind();
        let progress: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(progress, 'dblclick');
        let input = (<HTMLInputElement>document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolProgress') as any).ej2_instances[0];
        input.value = 100;
        let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(record, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.progress).toBe(100);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Editing End Date with Null Value', () => {
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
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
                splitterSettings: {
                    position: "70%",
                    // columnIndex: 4
                },
                allowFiltering: true,
                allowUnscheduledTasks: true,
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
                height: '550px',
                projectStartDate: new Date('01/30/2019'),
                projectEndDate: new Date('03/04/2019')
            }, done);
    });
    it('Editing progress column', (done: Function) => {
        ganttObj.actionBegin = function (args: any): void {
            if (args.type === "save") {
                args.value = null
                args.rowData.EndDate = null
                args.rowData.ganttProperties.endDate = null
            }
        };
        ganttObj.actionComplete = function (args: any): void {
            if (args.requestType === "save") {
                expect(ganttObj.getFormatedDate(args.data.ganttProperties.endDate, 'M/d/yyyy')).toBe(null)
                done()
            }
        };
        ganttObj.dataBind();
        let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(endDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
        input.value = new Date('02/04/2019');
        let record: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(record, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Removing dependency after Undo Redo', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: MT887459,
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
    it('Removing Dependency', () => {
        let dependency: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(dependency, 'dblclick');
        let input1: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor') as HTMLElement;
        input1.value = '3FS';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        let undo: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_undo') as HTMLElement;
        triggerMouseEvent(undo, 'click');
        let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
        let e = {
            item: ganttObj.contextMenuModule.contextMenu.items[5].items[0],
        };
        (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
        expect(ganttObj.flatData[3]['Predecessor']).toBe("")
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Getting Column menu object', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: MT887459,
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
                showColumnMenu:true,
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
    it('Removing Dependency', () => {
        expect(ganttObj.columnMenuModule.getColumnMenu() instanceof HTMLElement).toBe(true)
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('fixed work editing', () => {
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
                    Progress: 30, work: 0, resources: [{ resourceId: 1, resourceUnit: 50 }]
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
    let resourceCollection = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData,
        resources: resourceCollection,
        viewType: 'ResourceView',
        showOverAllocation: true,
        enableContextMenu: true,
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
            child: 'subtasks',
            notes: 'info'
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
        taskType:'FixedWork',
        columns: [
            { field: 'TaskID', visible: false },
            { field: 'TaskName', headerText: 'Name', width: 250 },
            { field: 'work', headerText: 'Work' },
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
    it('check duration', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let duration1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(duration, 'click');
        expect(ganttObj.flatData[1].ganttProperties.duration).toBe(0);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('fixed duration editing', () => {
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
                    Progress: 30, work: 0, resources: [{ resourceId: 1, resourceUnit: 50 }]
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
    let resourceCollection = [
        { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team' },
        { resourceId: 2, resourceName: 'Rose Fuller', resourceGroup: 'Testing Team' },
        { resourceId: 3, resourceName: 'Margaret Buchanan', resourceGroup: 'Approval Team' }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: resourcesData,
        resources: resourceCollection,
        viewType: 'ResourceView',
        showOverAllocation: true,
        enableContextMenu: true,
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
            child: 'subtasks',
            notes: 'info'
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
        taskType:'FixedDuration',
        columns: [
            { field: 'TaskID', visible: false },
            { field: 'TaskName', headerText: 'Name', width: 250 },
            { field: 'work', headerText: 'Work' },
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
    it('check duration', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let duration1: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(duration, 'click');
        expect(ganttObj.flatData[1].ganttProperties.duration).toBe(3);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR: 898101 - Gantt duration editing action', () => {
    let ganttObj: Gantt;
    let interval: number;
    let actionFailedFunction: () => void = jasmine.createSpy('actionFailure');
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: actionFailureData,
                taskFields: {
                    id: 'taskID',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'progress',
                    dependency: 'predecessor',
                    parentID: 'parentID',
                    type: 'taskType',
                    durationUnit: 'durationUnit',
                    milestone: 'isMilestone',
                    work: 'worktime',
                    expandState: 'isExpanded',
                    resourceInfo: 'assignees',
                    baselineStartDate: 'targetStart',
                    baselineEndDate: 'targetfinish',
                },
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
                actionFailure: actionFailedFunction,
                splitterSettings: {
                    columnIndex: 5
                },
                allowUnscheduledTasks: true,
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                columns: [
                    { field: 'taskID', width: 60 },
                    { field: 'taskName', editType: 'stringedit', width: 100 },
                    { field: 'startDate', editType: 'datepickeredit', width: 100 },
                    { field: 'endDate', editType: 'datepickeredit', width: 100 },
                    { field: 'duration', width: 100 },
                    { field: 'predecessor', width: 100 },
                    { field: 'progress', width: 100 }
                ],
            }, done);
    });
    
    it('duration editing', () => {
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(duration, 'dblclick');
        let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolduration') as HTMLElement;
        durationInput.value = '5 days';
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[3].ganttProperties.duration).toBe(5);
        expect(actionFailedFunction).not.toHaveBeenCalled();
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Dependency offset value not updating properly with unscheduled tasks', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Task 1',
                        StartDate: '1/2/2024',
                        EndDate: '1/6/2024',
                        Duration: 5,
                      },
                      {
                        TaskID: 2,
                        TaskName: 'Task 2',
                        StartDate: '1/2/2024',
                        EndDate: '1/6/2024',
                        Duration: 4,
                      },
                      {
                        TaskID: 3,
                        TaskName: 'Task 3',
                        StartDate: null,
                        EndDate: null,
                        Duration: null,
                        Predecessor: '2FS',
                      },
                      {
                        TaskID: 4,
                        TaskName: 'Task 4',
                        StartDate: null,
                        EndDate: null,
                        Duration: null,
                        Predecessor: '2FF',
                      },
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
                    resourceInfo: 'resources',
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                  },
                  resources: [],
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
                actionBegin:(args)=>{
                    if (args.requestType == 'validateLinkedTask') {
                        args.validateMode.respectLink = true;
                      }
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/1/2024'),
                projectEndDate: new Date('12/30/2024'),
            }, done);
    });
    it('updating properly with unscheduled tasks', () => {
        let endDateColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDateColumn, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate')).ej2_instances[0];
        input.value = new Date('01/08/2024');
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.endDate,'MM/dd/yyyy')).toBe('01/08/2024');
    
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Dependency offset value not updating properly with unscheduled tasks FF', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Task 1',
                        StartDate: '1/2/2024',
                        EndDate: '1/6/2024',
                        Duration: 5,
                      },
                      {
                        TaskID: 2,
                        TaskName: 'Task 2',
                        StartDate: '1/2/2024',
                        EndDate: '1/6/2024',
                        Duration: 4,
                      },
                      {
                        TaskID: 3,
                        TaskName: 'Task 3',
                        StartDate: null,
                        EndDate: null,
                        Duration: null,
                        Predecessor: '2FF',
                      },
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
                    resourceInfo: 'resources',
                },
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                  },
                  resources: [],
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
                actionBegin:(args)=>{
                    if (args.requestType == 'validateLinkedTask') {
                        args.validateMode.respectLink = true;
                      }
                },
                height: '550px',
                allowUnscheduledTasks: true,
                projectStartDate: new Date('01/1/2024'),
                projectEndDate: new Date('12/30/2024'),
            }, done);
    });
    it('updating properly with unscheduled tasks FF', () => {
        let endDateColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDateColumn, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate')).ej2_instances[0];
        input.value = new Date('01/05/2024');
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.endDate,'MM/dd/yyyy')).toBe('01/05/2024');
    
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Dependency offset value not updating properly with unscheduled tasks SF', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                      taskName: 'New Task 1',
                      startDate: '2024-07-22',
                      endDate: '2024-07-22',
                      duration: 1,
                      realized: 0,
                      dependencies: '',
                      cost: '',
                      taskId: '1',
                      parts: '',
                      parentId: null,
                      taskIndex: 0,
                    },
                    {
                      taskName: 'New Task 1',
                      startDate: '2024-07-15',
                      endDate: '2024-07-19',
                      duration: 4,
                      realized: 0,
                      dependencies: '1SF-3days',
                      cost: '',
                      taskId: '2',
                      parts: [
                        {
                          startDate: '2024-07-15',
                          endDate: '2024-07-17',
                          duration: 3,
                        },
                        {
                          startDate: '2024-07-19',
                          endDate: '2024-07-19',
                          duration: 1,
                        },
                      ],
                      parentId: null,
                      taskIndex: 1,
                    },
                  ],
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                taskFields: {
                    id: 'taskId',
                    name: 'taskName',
                    startDate: 'startDate',
                    endDate: 'endDate',
                    duration: 'duration',
                    progress: 'realized',
                    dependency: 'dependencies',
                    segments: 'parts',
                    parentID: 'parentId',
                    baselineStartDate: 'baselineStartDate',
                    baselineEndDate: 'baselineEndDate',
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
                    { field: 'taskId', allowEditing: false, visible: true },
                    { field: 'dependencies', visible: true },
                    {
                      field: 'index',
                      headerText: "index",
                      allowEditing: false,
                      visible: true,
                    },
                    { field: 'wbs', headerText: 'WBS', allowEditing: false, visible: true },
                    { field: 'taskName', visible: true },
                    { field: 'startDate', visible: true },
                    { field: 'endDate', visible: true },
                    { field: 'duration', visible: true },
                    { field: 'realized', visible: true },
                    {
                      field: 'cost', headerText: "cost",
                      visible: true,
                    },
                  ],
               
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
            }, done);
    });
    it('updating properly with unscheduled tasks offset value SF', () => {
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate,'MM/dd/yyyy')).toBe('07/10/2024');   
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});

describe('Console error occurs when connecting predecessor with decimal task Id', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: '1',

                        TaskName: 'Project Initiation',

                        StartDate: new Date('2024-04-01T18:30:00.000Z'),

                        Description: 'desc',

                        Duration: 3,

                        employees: 'John',

                        contractors: 'John',

                        BaselineStartDate: new Date('2024-04-01T18:30:00.000Z'),

                        BaselineEndDate: new Date('2024-04-01T18:30:00.000Z'),

                        BaselineDuration: 4,

                        Progress: 10,

                        Predecessor: '',

                        subtasks: [
                            {
                                TaskID: '1.1',

                                TaskName: 'Project Design',

                                StartDate: new Date('2024-04-01T18:30:00.000Z'),

                                Description: 'desc',

                                Duration: 3,

                                BaselineStartDate: new Date('2024-04-01T18:30:00.000Z'),

                                BaselineEndDate: new Date('2024-04-01T18:30:00.000Z'),

                                BaselineDuration: 4,

                                Progress: 10,

                                Predecessor: '',

                                subtasks: [],
                            },

                            {
                                TaskID: '1.2',

                                TaskName: 'Project Design review',

                                StartDate: new Date('2024-04-01T18:30:00.000Z'),

                                Description: 'desc review',

                                Duration: 3,

                                BaselineStartDate: new Date('2024-04-01T18:30:00.000Z'),

                                BaselineEndDate: new Date('2024-04-01T18:30:00.000Z'),

                                BaselineDuration: 4,

                                Progress: 10,

                                Predecessor: '',

                                subtasks: [],
                            },
                        ],
                    },

                    {
                        TaskID: '2',

                        TaskName: 'LLD Initiation',

                        StartDate: new Date('2024-04-01T18:30:00.000Z'),

                        Description: 'desc',

                        Duration: 3,

                        BaselineStartDate: new Date('2024-04-01T18:30:00.000Z'),

                        BaselineEndDate: new Date('2024-04-01T18:30:00.000Z'),

                        BaselineDuration: 4,

                        Progress: 10,

                        Predecessor: '',

                        subtasks: [
                            {
                                TaskID: '2.1',

                                TaskName: 'HoV - New Task 4',

                                Description: 'HLD',

                                StartDate: new Date('2024-07-12T00:00:00.000Z'),

                                Progress: 0,

                                Duration: 1,

                                BaselineStartDate: new Date('2024-07-17T02:30:00.000Z'),

                                BaselineDuration: 2,

                                BaselineEndDate: new Date('2024-07-19T02:30:00.000Z'),

                                Predecessor: '',
                            },
                        ],
                    },
                ],
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
                    // resourceInfo: 'resources',
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
                    'Indent',
                    'Outdent',
                ],
                allowSelection: true,
                gridLines: 'Both',
                height: '450px',
                treeColumnIndex: 1,
                //   resourceFields: {
                //     id: 'resourceId',
                //     name: 'resourceName',
                //   },
                //   resources: editingResources,
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
                    {
                        field: 'TaskName',
                        headerText: 'Job Name',
                        width: '250',
                        clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' },
                ],
                eventMarkers: [
                    { day: '4/17/2024', label: 'Project approval and kick-off' },
                    { day: '5/3/2024', label: 'Foundation inspection' },
                    { day: '6/7/2024', label: 'Site manager inspection' },
                    { day: '7/16/2024', label: 'Property handover and sign-off' },
                ],
                labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources',
                },
                editDialogFields: [
                    { type: 'General', headerText: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                ],
                splitterSettings: {
                    position: '35%',
                },
                projectStartDate: new Date('03/25/2024'),
                projectEndDate: new Date('07/28/2024'),
            }, done);
    });
    it('update  predecessor with decimal task Id', () => {
        let endDateColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(endDateColumn, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor')).ej2_instances[0];
        input.value = '1.1SS';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[2].ganttProperties.predecessorsName).toBe('1.1 SS');

    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Work Property Not Working Properly ', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [],
            enableContextMenu: true,
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
            resources: resourceData,
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
    
    beforeEach(() => {
        ganttObj.openAddDialog();
     });
    it('check  duration ', () => {
        let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
        textObj.value = '4 days';
        textObj.dataBind();
        let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
        expect(ganttObj.flatData[0].ganttProperties.duration).toBe(4); 
    });
    it('check  duration durtion', () => {
        ganttObj.dataOperation.getWorkString(3,'days');
        ganttObj.dataOperation.getWorkString(3,'minute');

        expect(ganttObj.flatData[0].ganttProperties.duration).toBe(4); 
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR:893564-Milestone task end date is not updating properly when using cell edit and dialog', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: Data893564,
                resources: resourceCollection,
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
                resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName'
                },
                gridLines: 'Both',
                editDialogFields: [
                    { type: 'General', headerText: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                ],
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
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },

                ],
                actionBegin: function (args) {
                    if (args.requestType == 'validateLinkedTask') {
                        args.validateMode.respectLink = true;
                    }
                },
                splitterSettings: {
                    columnIndex: 4
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
                enableContextMenu: true,
                allowResizing: true,
                allowSelection: true,
                highlightWeekends: true,
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
    });
    it('Changing endDate by celledit and dialog edit actions', () => {
        let endDateColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8) > td:nth-child(4)') as HTMLElement;
        triggerMouseEvent(endDateColumn, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate')).ej2_instances[0];
        input.value = new Date('04/16/2019');
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(8) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[7].ganttProperties.startDate,'MM/dd/yyyy')).toBe('04/16/2019');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[7].ganttProperties.endDate,'MM/dd/yyyy')).toBe('04/16/2019');
        expect(ganttObj.currentViewData[7].ganttProperties.duration).toBe(1);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR-898960: Milestone endDate not properly validating when convert to task', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: CR898960,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration'
                },
                actionBegin(args) {
                    if (args.requestType === "beforeSave" && args.data.ActualEndDate) {
                        args.data.ganttProperties.endDate = args.data.ActualEndDate;
                        args.data.EndDate = args.data.ActualEndDate;
                        args.data.taskData.EndDate = args.data.ActualEndDate;
                    }
                },
                editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                },
                columns: [
                    { field: 'TaskId', width: 75 },
                    { field: 'TaskName', width: 80 },
                    { field: 'StartDate', width: 120 },
                    { field: 'EndDate', width: 120 },
                    { field: 'Duration', width: 90 },
                    { field: 'ActualStartDate', width: 120, editType:'datepickeredit' },
                    { field: 'ActualEndDate', width: 120, editType:'datepickeredit' }
                ],
                splitterSettings: {
                    columnIndex: 8
                },
                toolbar: [{ text: 'Insert task', tooltipText: 'Insert task at top', id: 'toolbarAdd', prefixIcon: 'e-add-icon tb-icons' }, 'Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
                allowSelection: true,
                allowFiltering: true,
                gridLines: "Both",
                showColumnMenu: true,
                highlightWeekends: true,
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
    it('Updating Gantt Enddate with custom column date', (done: Function) => {
        ganttObj.actionBegin = (args: any): void => {
            if (args.requestType === "beforeSave") {
                args.data.ganttProperties.endDate = args.data.ActualEndDate;
                args.data.EndDate = args.data.ActualEndDate;
                args.data.taskData.EndDate = args.data.ActualEndDate;
            }
        }
        ganttObj.actionComplete = (args: any): void => {
            if (args.type === 'save' && !isNullOrUndefined(ganttObj.currentViewData[0].ganttProperties.endDate)) {
                expect(ganttObj.getFormatedDate(ganttObj.currentViewData[0].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/5/2019');
                expect(ganttObj.currentViewData[0].ganttProperties.isMilestone).toBe(false);
                done();
            }
        }
        let actualEndDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(7)') as HTMLElement;
        triggerMouseEvent(actualEndDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolActualEndDate') as any).ej2_instances[0];
        input.value = new Date('4/5/2019');
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('CR issue validation', () => {
    let ganttObj: Gantt;
    let customFn: (args: { [key: string]: string }) => boolean = (args: { [key: string]: string }) => {
        return args['value'].length >= 5;
    };
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: crValidateIssue,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    //dependency:'Predecessor',
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
                    { field: 'TaskName', headerText: 'Task Name', validationRules: { required: true, minLength: [customFn, 'Need atleast 5 letters'] } },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                allowSelection: true,
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
                gridLines: "Both",
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
                //  connectorLineBackground: "red",
                //  connectorLineWidth: 3,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019'),
            }, done);
    });
    it('Checking of isEdit Property', (done: Function) => {
        ganttObj.taskbarEdited  = (): void => {
            expect(ganttObj.treeGrid.grid.isEdit).toBe(false)
            done()
        }
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = null;
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
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

describe('Console error occurs when connecting predecessor with decimal task Id', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource:criticalPath,
                  dateFormat: 'MMM dd, y',
                  enableCriticalPath: true,
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
                    'Indent',
                    'Outdent',
                  ],
                  allowSelection: true,
                  gridLines: 'Both',
                  height: '450px',
                  treeColumnIndex: 1,
                  resourceFields: {
                    id: 'resourceId',
                    name: 'resourceName',
                  },
                  resources: editingResources3,
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
                    {
                      field: 'TaskName',
                      headerText: 'Job Name',
                      width: '250',
                      clipMode: 'EllipsisWithTooltip',
                    },
                    { field: 'StartDate' },
                    { field: 'Duration' },
                    { field: 'Progress' },
                    { field: 'Predecessor' },
                  ],
                  eventMarkers: [
                    { day: '4/17/2024', label: 'Project approval and kick-off' },
                    { day: '5/3/2024', label: 'Foundation inspection' },
                    { day: '6/7/2024', label: 'Site manager inspection' },
                    { day: '7/16/2024', label: 'Property handover and sign-off' },
                  ],
                  labelSettings: {
                    leftLabel: 'TaskName',
                    rightLabel: 'resources',
                  },
                  editDialogFields: [
                    { type: 'General', headerText: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                  ],
                  splitterSettings: {
                    position: '35%',
                  },
                  projectStartDate: new Date('09/01/2024'),
                  // projectEndDate: new Date('07/28/2024'),
            }, done);
    });
    it('update  predecessor with decimal task Id', () => {
        let endDateColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
        triggerMouseEvent(endDateColumn, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolPredecessor')).ej2_instances[0];
        input.value = '4SS';
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe('4 SS');

    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
describe('Change start date for manual parent', () => {
    let ganttObj: Gantt;
    let modeData: object[] = [
        {
            'TaskID': 1,
            'TaskName': 'Parent Task 1',
            'StartDate': new Date('02/27/2017'),
            'EndDate': new Date('03/03/2017'),
            'Progress': '40',
            'isManual' : true,
            'Children': [
                 { 'TaskID': 2, 'TaskName': 'Child Task 1', 'StartDate': new Date('02/27/2017'),
                 'EndDate': new Date('03/03/2017'), 'Progress': '40' },
                 { 'TaskID': 3, 'TaskName': 'Child Task 2', 'StartDate': new Date('02/26/2017'),
                 'EndDate': new Date('03/03/2017'), 'Progress': '40', 'isManual': true },
                 { 'TaskID': 4, 'TaskName': 'Child Task 3', 'StartDate': new Date('02/27/2017'),
                 'EndDate': new Date('03/03/2017'), 'Duration': 5, 'Progress': '40', }
            ]
        }
    ];
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: modeData,
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
        taskMode : 'Custom',
        sortSettings: {
            columns: [{ field: 'TaskID', direction: 'Ascending' }, 
            { field: 'TaskName', direction: 'Ascending' }]
        },
        allowExcelExport: true,
        allowPdfExport: true,
        allowRowDragAndDrop: true,
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
        projectStartDate: new Date('02/20/2017'),
        projectEndDate: new Date('03/30/2017'),
            }, done);
    });
    it('check date for child record', () => {
        let startDateColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(5)') as HTMLElement;
        triggerMouseEvent(startDateColumn, 'dblclick');
        let input: any = (<EJ2Instance>document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')).ej2_instances[0];
        input.value = new Date('02/28/2017');
        input.dataBind();
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/d/yyyy')).toBe('3/3/2017');

    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
});
