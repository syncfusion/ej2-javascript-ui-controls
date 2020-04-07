/**
 * Gantt taskbaredit spec
 */
import { getValue } from '@syncfusion/ej2-base';
import { Gantt, Edit, Toolbar, IGanttData } from '../../src/index';
import { dialogEditData, resourcesData, resources, scheduleModeData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
let dropDownElement: HTMLElement;
let dropDownObj: DropDownList;
let dropDownData = [
    { "Id": 1, "Name": "Tracker 1" },
    { "Id": 2, "Name": "Tracker 2" },
    { "Id": 3, "Name": "Tracker 3" },
    { "Id": 4, "Name": "Tracker 4" },
    { "Id": 5, "Name": "Tracker 5" },
];
let ganttModel: Object = {
    dataSource: dialogEditData,
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
        mode: 'Dialog'
    },
    editDialogFields: [
        { type: 'General' },
        { type: 'Dependency' },
        { type: 'Resources' },
        { type: 'Notes' },
        { type: 'Custom' }
    ],
    addDialogFields: [
        { type: 'General' },
        { type: 'Resources' },
        { type: 'Dependency' }
    ],
    columns: [
        { field: 'TaskID', width: 60 },
        { field: 'TaskName', width: 100 },
        { field: 'StartDate', editType: 'datepickeredit', width: 100 },
        { field: 'EndDate', editType: 'datepickeredit', width: 100 },
        { field: 'Duration', width: 100 },
        { field: 'Predecessor', width: 100 },
        { field: 'Progress', width: 100 },
        { field: 'BaselineStartDate', editType: 'datetimepickeredit', width: 100 },
        { field: 'BaselineEndDate', editType: 'datetimepickeredit', width: 100 },
        { field: 'Resource', width: 100 },
        { field: 'Notes', width: 100 },
        { field: 'Customcol1', editType: 'dropdownedit', headerText: 'Custom Column1', width: 100 },
        { field: 'Customcol2', editType: 'maskededit', headerText: 'Custom Column2', width: 100 },
        { field: 'Customcol3', editType: 'booleanedit', headerText: 'Custom Column3', width: 100 },
        {
            field: 'Customcol4', edit: {
                create: (args: Object) => {
                    dropDownElement = document.createElement('input');
                    return dropDownElement;
                },
                read: () => {
                    return dropDownObj.value;
                },
                destroy: () => {
                    dropDownObj.destroy();
                },
                write: function (args: any) {
                    dropDownObj = new DropDownList({
                        dataSource: dropDownData,
                        fields: { text: 'Name' },
                        value: args.rowData[args.column.field],
                        placeholder: "DropDown Custom Column",
                        floatLabelType: 'Auto'
                    });
                    dropDownObj.appendTo(dropDownElement);
                }
            }
        }
    ],
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
    allowUnscheduledTasks: true,
};
Gantt.Inject(Edit, Toolbar);
describe('Gantt dialog module', () => {

    describe('Dialog editing - General Tab', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
            ganttObj.openEditDialog(4);
        });
        it('Schedule validation- duration', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEdiaDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.dataBind();
            let durationField: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
            if (durationField) {
                let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                textObj.value = '5 days';
                textObj.dataBind();
                let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
                expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('3/29/2019');
                let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
                expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/4/2019');
                let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                triggerMouseEvent(cancelRecord, 'click');
            }
        });
        it('Schedule validation- endDate', () => {
            ganttObj.dataBind();
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            ED.value = new Date('04/09/2019');
            ED.dataBind();
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            expect(textObj.value).toBe('3 days');
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
        });
        it('Schedule validation- startDate', () => {
            ganttObj.dataBind();
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            SD.value = new Date('04/09/2019');
            SD.dataBind();
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/9/2019');
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            expect(textObj.value).toBe('0 days');
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
        });
        it('Record update with duration', () => {
            ganttObj.dataBind();
            let durationField: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
            if (durationField) {
                let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                textObj.value = '5 days';
                textObj.dataBind();
                let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
                expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('3/29/2019');
                let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
                expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/4/2019');
                let saveRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
            }
        });
        it('Unschedule validation- StartDate', () => {
            ganttObj.dataBind();
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            SD.value = null;
            SD.dataBind();
            let rowData: IGanttData = getValue('rowData', ganttObj.editModule.dialogModule);
            let validEndDate = rowData.ganttProperties.endDate;
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            expect(ED.value).toEqual(validEndDate);
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            expect(textObj.value).toBe('');
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
        });
        it('Unschedule validation- endDate', () => {
            ganttObj.dataBind();
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            ED.value = null;
            ED.dataBind();
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            expect(textObj.value).toBe('');
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
        });
        it('Unschedule validation- Duration', () => {
            ganttObj.dataBind();
            let durationField: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            durationField.value = null;
            durationField.dataBind();
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            expect(ED.value).toBe(null);
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
        });
        it('Unschedule to schedule- StartDate', () => {
            ganttObj.dataBind();
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.openEditDialog(5);
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            ED.value = new Date('04/05/2019');
            ED.dataBind();
            let durationField: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            expect(durationField.value).toBe('4 days');
            let cancel: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancel, 'click');
        });
        it('Unschedule to schedule- EndDate', () => {
            ganttObj.dataBind();
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.openEditDialog(6);
            let durationField: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            durationField.value = '3 days';
            durationField.dataBind();
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('3/29/2019');
            let cancel: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancel, 'click');
        });
        it('Unschedule to schedule- Duration', () => {
            ganttObj.dataBind();
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.openEditDialog(7);
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            SD.value = new Date('04/02/2019');
            SD.dataBind();
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/8/2019');
            let cancel: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancel, 'click');
        });
        it('Unschedule duration validation', () => {
            ganttObj.dataBind();
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.openEditDialog(7);
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            ED.value = new Date('04/08/2019');
            ED.dataBind();
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/2/2019');
            let cancel: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancel, 'click');
        });
        it('Schedule validation- Null values', () => {
            ganttObj.dataBind();
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.dataSource[1].StartDate = null;
            ganttObj.dataSource[1].EndDate = null;
            ganttObj.dataSource[1].Duration = null;
            ganttObj.isAdaptive = true;
            ganttObj.selectionSettings.mode = 'Both';
            ganttObj.dataBind();
            let element: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr.gridrowtaskIdlevel0:nth-Child(5) > td > div.e-left-label-container');
            triggerMouseEvent(element, 'dblclick');
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            SD.value = new Date('04/09/2019');
            SD.dataBind();
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            expect(ED.value).toBe(null);
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            expect(textObj.value).toBe('');
            triggerMouseEvent(cancelRecord, 'click');
        });
        // it('Duration editing without resource unit and work mapping', () => {
        //     ganttObj.actionBegin = function (args: any): void {
        //         if (args.requestType === "beforeOpenEdiaDialog") {
        //             args.dialogModel.animationSettings = { 'effect': 'none' };
        //         }
        //     };
        //     ganttObj.actionComplete = (args: any): void => {
        //         if (args.requestType === 'save') {
        //             //Checking work values of task which have resource after duration editing
        //             expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe("Resource 3,Resource 1");
        //             expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        //             expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
        //             expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(80);
        //             expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(5);
        //         }
        //     };
        //     ganttObj.dataBind();
        //     let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
        //     triggerMouseEvent(cancelRecord, 'click');
        //     ganttObj.openEditDialog(3);
        //     //Checking work values of task which have resource before duration editing
        //     expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe("Resource 3,Resource 1");
        //     expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
        //     expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
        //     expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(48);
        //     expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(3);
        //     expect(ganttObj.currentViewData[2].ganttProperties.workUnit).toBe('hour');
        //     expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedUnit');
        //     let durationField: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
        //     if (durationField) {
        //         let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
        //         textObj.value = '5 days';
        //         textObj.dataBind();
        //         let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        //         triggerMouseEvent(saveRecord, 'click');
        //     }
        // });
        // it('Edit record by toolbar', () => {
        //     ganttObj.dataBind();
        //     let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
        //     triggerMouseEvent(cancelRecord, 'click');
        //     ganttObj.dataSource[1].StartDate = null;
        //     ganttObj.dataSource[1].EndDate = null;
        //     ganttObj.dataSource[1].Duration = null;
        //     ganttObj.selectionSettings.mode = 'Both';
        //     ganttObj.dataBind();
        //     let element: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr.gridrowtaskIdlevel0:nth-Child(5) > td > div.e-left-label-container');
        //     triggerMouseEvent(element, 'click');
        //     let edit: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-Child(2) > button');
        //     triggerMouseEvent(edit, 'click');
        //     let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
        //     SD.value = new Date('04/09/2019');
        //     SD.dataBind();
        //     let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
        //     expect(ED.value).toBe(null);
        //     let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
        //     expect(textObj.value).toBe('');
        //     let cancel1: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
        //     triggerMouseEvent(cancel1, 'click');
        //     ganttObj.openEditDialog(1);
        //     let cancel2: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
        //     triggerMouseEvent(cancel2, 'click');
        // });
    });
    describe('Dialog editing with work mapping - General Tab', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: dialogEditData,
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
                    mode: 'Dialog'
                },
                editDialogFields: [
                    { type: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                    { type: 'Custom' }
                ],
                addDialogFields: [
                    { type: 'General' },
                    { type: 'Resources' },
                    { type: 'Dependency' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                allowUnscheduledTasks: true
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
            ganttObj.openEditDialog(3);
        });
        it('Work editing', () => {
            ganttObj.dataBind();
            let workField: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'EstimatedWork') as HTMLInputElement;
            if (workField) {
                let inputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EstimatedWork')).ej2_instances[0];
                inputObj.value = 40;
                let durationFocus: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
                triggerMouseEvent(durationFocus, 'click');
                let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                triggerMouseEvent(cancelRecord, 'click');
            }
        });
        it('Task type editing', () => {
            ganttObj.dataBind();
            let taskType: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'taskType') as HTMLInputElement;
            if (taskType) {
                let inputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'taskType')).ej2_instances[0];
                inputObj.value = 'FixedDuration';
                inputObj.dataBind();
                let workInputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EstimatedWork')).ej2_instances[0];
                workInputObj.value = 40;
                let duration: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                expect(duration.value).toBe('1.25 days');
                let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                triggerMouseEvent(cancelRecord, 'click');
            }
        });
    });
    describe('Dialog editing - predecessor Tab', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
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
        it('Dependency tab editing', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe("2FS");
                }
            };
            let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_content_table > tbody > tr > td:nth-child(2)') as HTMLElement;
            if (row) {
                triggerMouseEvent(row, 'dblclick');
                let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
                input.dataSource = input.dataSource.dataSource.json;
                input.value = "3-Child Task 2";
                input.dataBind();
                let toolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
                triggerMouseEvent(toolbar, 'click');
                let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
            }
        });
    });
    describe('Dialog editing - Resource Tab', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
            ganttObj.openEditDialog(2);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 2;
        });
        it('Resource tab editing', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEdiaDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe("Resource 1");
                    // without unit and work mapping
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['unit']).toBe(100);
                    //expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(24);
                    expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
                    expect(ganttObj.currentViewData[1].ganttProperties.workUnit).toBe('hour');
                    expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedUnit');
                }
            };
            ganttObj.dataBind();
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
            let checkbox: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            if (checkbox) {
                triggerMouseEvent(checkbox, 'click');
                let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
            }
        });
        it('Resource unit editing', () => {
            //Task which have resource
            expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe("Resource 1");
            expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['unit']).toBe(100);
            //expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(24);
            expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/04/2019');
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEdiaDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe("Resource 1[50%]");
                    // without unit and work mapping
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['unit']).toBe(50);
                    //expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(24);
                    // expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(6);
                    // expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.endDate, 'M/dd/yyyy')).toBe('4/07/2019');
                    expect(ganttObj.currentViewData[1].ganttProperties.workUnit).toBe('hour');
                    expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedUnit');
                }
            };
            ganttObj.dataBind();
            let checkbox: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(checkbox, 'click');
            let unit: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(4)') as HTMLElement;
            if (unit) {
                triggerMouseEvent(unit, 'dblclick');
                let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'ResourcesTabContainer_gridcontrolunit')).ej2_instances[0];
                input.value = 50;
                input.dataBind();
                let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
            }
        });
    });
    describe('Dialog editing - Resource Tab with unit mapping', () => {
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: dialogEditData,
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
                    mode: 'Dialog'
                },
                editDialogFields: [
                    { type: 'General' },
                    { type: 'Dependency' },
                    { type: 'Resources' },
                    { type: 'Notes' },
                    { type: 'Custom' }
                ],
                addDialogFields: [
                    { type: 'General' },
                    { type: 'Resources' },
                    { type: 'Dependency' }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                allowUnscheduledTasks: true
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
            ganttObj.openEditDialog(2);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 2;
        });
        it('Resource unit initial with unit mapping', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEdiaDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe("Resource 2[80%]");
                    // with unit and without work mapping
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['resourceUnit']).toBe(80);
                    expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(19.2);
                    expect(ganttObj.currentViewData[1].ganttProperties.workUnit).toBe('hour');
                    expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedUnit');
                }
            };
            ganttObj.dataBind();
            let checkbox: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            if (checkbox) {
                triggerMouseEvent(checkbox, 'click');
                let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
            }
        });
        it('Resource unit editing with unit mapping', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEdiaDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'save') {
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe("Resource 2[50%]");
                    // without unit and work mapping
                    expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo[0]['resourceUnit']).toBe(50);
                    // expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(24);
                    expect(ganttObj.currentViewData[1].ganttProperties.workUnit).toBe('hour');
                    expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedUnit');
                }
            };
            ganttObj.dataBind();
            let checkbox: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
            triggerMouseEvent(checkbox, 'click');
            let unit: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
            if (unit) {
                triggerMouseEvent(unit, 'dblclick');
                let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'ResourcesTabContainer_gridcontrolresourceUnit')).ej2_instances[0];
                input.value = 50;
                input.dataBind();
                let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
            }
        });
    });
    describe('Custom tab', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
            ganttObj.openEditDialog(4);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 4;
        });
        it('Custom Editor for custom column', () => {
            let customColumn: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'Customcol4') as HTMLInputElement;
            if (customColumn) {
                triggerMouseEvent(customColumn, 'click');
                let customValue: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Customcol4')).ej2_instances[0];
                customValue.value = 'Tracker 4';
                customValue.dataBind();
                let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
                expect(getValue('Customcol4', ganttObj.flatData[3])).toBe('Tracker 4');
            }
        });
    });
    describe('Add Dialog', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach(() => {
            let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
            triggerMouseEvent(add, 'click');
        });
        it('Add new record', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.action === 'add') {
                    expect(ganttObj.currentViewData.length).toEqual(8);
                }
            };
            ganttObj.dataBind();
            let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
    });
    describe('Dialog tab', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(ganttModel, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach(() => {
            ganttObj.openEditDialog(4);
        });
        it('Dynamic property change', () => {
            ganttObj.editSettings.mode = "Dialog";
            ganttObj.dataBind();
            let cancelRecord1: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord1, 'click');
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let name: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'TaskName')).ej2_instances[0];
            name.value = "updated";
            name.dataBind();
            let cancelRecord2: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord2, 'click');
        });
        it('Click event', () => {
            ganttObj.isAdaptive = true;
            ganttObj.dataBind();
            let tab: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-dlg-content > div > div > div > div:nth-Child(3)') as HTMLElement;
            triggerMouseEvent(tab, 'click');
            let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            ganttObj.refresh();
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
            // ganttObj.openEditDialog(3);
        });
        it('Changing taskmode of a task to manual', (done: Function) => {
            expect(ganttObj.currentViewData[1].ganttProperties.isAutoSchedule).toBe(true);
            ganttObj.openEditDialog(2);
            let taskMode: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'isManual') as HTMLInputElement;
            debugger
            if (taskMode) {
                let inputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'isManual')).ej2_instances[0];
                inputObj.value = true;
                inputObj.dataBind();
                let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
                setTimeout(done, 500);
            }
            expect(ganttObj.currentViewData[1].ganttProperties.isAutoSchedule).toBe(false);
        });
        it('Changing taskmode of a task to auto', (done: Function) => {
            let startDate: Date = ganttObj.currentViewData[2].ganttProperties.startDate;
            expect(ganttObj.getFormatedDate(startDate, 'M/d/yyyy')).toBe('2/26/2017');
            ganttObj.openEditDialog(3);
            debugger
            let taskMode: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'isManual') as HTMLInputElement;
            if (taskMode) {
                let inputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'isManual')).ej2_instances[0];
                inputObj.value = false;
                inputObj.dataBind();
                let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
                setTimeout(done, 500);
            }
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/27/2017');
        });
    });
});