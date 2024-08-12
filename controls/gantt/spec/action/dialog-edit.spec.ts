/**
 * Gantt taskbaredit spec
 */
import { getValue, isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import {  Gantt, Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, Sort, RowDD, ContextMenu, ExcelExport, PdfExport, ContextMenuClickEventArgs  } from '../../src/index';
import { dialogEditData, resourcesData,resourceData, resources, scheduleModeData, projectData1, indentOutdentData, splitTasksData, projectData, crData, scheduleModeData1, splitTasksData2, dialogData1, splitTasksData3, CR886052, MT887459,resourcesDatas1, resourceCollections1 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent, triggerKeyboardEvent } from '../base/gantt-util.spec';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { DataManager } from '@syncfusion/ej2-data';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { TextBox } from '@syncfusion/ej2-inputs';
import { actionComplete } from '@syncfusion/ej2-treegrid';
import { Grid } from '@syncfusion/ej2-grids';
Gantt.Inject( Selection, Toolbar, DayMarkers, Edit, Filter, Reorder, Resize, ColumnMenu, Sort, RowDD, ContextMenu, ExcelExport, PdfExport);
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
                   return dropDownObj;
               }
            }
        }
    ],
    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
    allowUnscheduledTasks: true,
};
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
           setTimeout(done, 500);
           ganttObj.openEditDialog(4);
       });
       it('Schedule validation- duration', () => {
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
               expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
               let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
               expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/11/2019');
               let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
               triggerMouseEvent(cancelRecord, 'click');
           }
       });
       it('Schedule validation- endDate', () => {
           let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
           ED.value = new Date('04/09/2019');
           ED.dataBind();
           let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
           expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
           let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           expect(textObj.value).toBe('3 days');
           let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancelRecord, 'click');
       });
       it('Schedule validation- startDate', () => {
           let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
           SD.value = new Date('04/09/2019');
           SD.dataBind();
           let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
           expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/9/2019');
           let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           expect(textObj.value).toBe('0 days');
           let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancelRecord, 'click');
       });
       it('Record update with duration', () => {
           let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
           if (durationField) {
               let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
               textObj.value = '5 days';
               textObj.dataBind();
               let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
               expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
               let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
               expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/11/2019');
               let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
               triggerMouseEvent(saveRecord, 'click');
           }
       });
       // it('Unschedule validation- StartDate', () => {
       //     ganttObj.dataBind();
       //     let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
       //     SD.value = null;
       //     SD.dataBind();
       //     let rowData: IGanttData = getValue('rowData', ganttObj.editModule.dialogModule);
       //     let validEndDate = rowData.ganttProperties.endDate;
       //     let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
       //     expect(ED.value).toEqual(validEndDate);
       //     let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
       //     expect(textObj.value).toBe('');
       //     let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
       //     triggerMouseEvent(cancelRecord, 'click');
       // });
       // it('Unschedule validation- endDate', () => {
       //     ganttObj.dataBind();
       //     let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
       //     ED.value = null;
       //     ED.dataBind();
       //     let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
       //     expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
       //     let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
       //     expect(textObj.value).toBe('');
       //     let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
       //     triggerMouseEvent(cancelRecord, 'click');
       // });
       it('Unschedule validation- Duration', () => {
           let durationField: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           durationField.value = null;
           durationField.dataBind();
           let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
           expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/4/2019');
           let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
           expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe(null);
           let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancelRecord, 'click');
       });
       it('Unschedule to schedule- StartDate', () => {
           let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancelRecord, 'click');
           ganttObj.openEditDialog(5);
           let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
           ED.value = new Date('04/05/2019');
           ED.dataBind();
           let durationField: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           expect(durationField.value).toBe('4 days');
           let cancel: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancel, 'click');
       });
       it('Unschedule to schedule- EndDate', () => {
           let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancelRecord, 'click');
           ganttObj.openEditDialog(6);
           let durationField: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           durationField.value = '3 days';
           durationField.dataBind();
           let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
           expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('3/29/2019');
           let cancel: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancel, 'click');
       });
       it('Unschedule to schedule- Duration', () => {
           let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancelRecord, 'click');
           ganttObj.openEditDialog(7);
           let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
           SD.value = new Date('04/02/2019');
           SD.dataBind();
           let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
           expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/8/2019');
           let cancel: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancel, 'click');
       });
       it('Unschedule duration validation', () => {
           let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancelRecord, 'click');
           ganttObj.openEditDialog(7);
           let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
           ED.value = new Date('04/08/2019');
           ED.dataBind();
           let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
           expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/2/2019');
           let cancel: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancel, 'click');
       });
       it('Schedule validation- Null values', () => {
           let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
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
           let cancel: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancel, 'click');
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
           setTimeout(done, 500);
           ganttObj.openEditDialog(3);
       });
       it('Work editing', () => {
           let workField: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'EstimatedWork') as HTMLInputElement;
           if (workField) {
               let inputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EstimatedWork')).ej2_instances[0];
               inputObj.value = 40;
               let durationFocus: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
               triggerMouseEvent(durationFocus, 'click');
               let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
               triggerMouseEvent(cancelRecord, 'click');
           }
       });
       //  it('Task type editing', () => {
       //      ganttObj.dataBind();
       //      let taskType: any = ganttObj.element.querySelector('#' + ganttObj.element.id + 'taskType') as HTMLInputElement;
       //      if (taskType) {
       //          let inputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'taskType')).ej2_instances[0];
       //          inputObj.value = 'FixedDuration';
       //          inputObj.dataBind();
       //          let workInputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EstimatedWork')).ej2_instances[0];
       //          workInputObj.value = 40;
       //          let duration: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
       //          expect(duration.value).toBe('3 days');
       //          let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
       //          triggerMouseEvent(cancelRecord, 'click');
       //      }
       //  });
    });
    describe('Task Type changing in Dialogue edit', () => {
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
                   child: 'subtasks',
                   type: 'taskType'
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
           setTimeout(done, 500);
           ganttObj.openEditDialog(3);
       });
       it('Task type editing', () => {
           let inputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'taskType')).ej2_instances[0];
           inputObj.value = 'FixedDuration';
           inputObj.dataBind();
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           expect(ganttObj.currentViewData[2]['taskType']).toBe("FixedDuration");
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
           setTimeout(() => {
               ganttObj.openEditDialog(4);
               let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
               tab.selectedItem = 1;
               tab.dataBind();
               done();
           }, 1000);
       });
       it('Dependency tab editing', () => {
           ganttObj.actionComplete = (args: any): void => {
               if (args.requestType === 'save') {
                    expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe("3FS");
               }
           };
           let row: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_content_table > tbody > tr > td:nth-child(2)') as HTMLElement;
           if (row) {
               triggerMouseEvent(row, 'dblclick');
               let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainername')).ej2_instances[0];
               input.dataSource = input.dataSource.dataSource.json;
               input.value = "3-Child Task 2";
               input.dataBind();
               let idInput: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainerid')).ej2_instances[0];
               idInput.value = "3";
               idInput.dataBind();
               let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
               triggerMouseEvent(toolbar, 'click');
               let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
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
           setTimeout(done, 500);
       ganttObj.openEditDialog(2);
           let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
           tab.selectedItem = 2;
       });
       it('Resource tab editing', () => {
           ganttObj.actionBegin = function (args: any): void {
               if (args.requestType === "beforeOpenEditDialog") {
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
           expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
           let checkbox: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
           if (checkbox) {
               triggerMouseEvent(checkbox, 'click');
               let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
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
               if (args.requestType === "beforeOpenEditDialog") {
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
           let checkbox: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
           triggerMouseEvent(checkbox, 'click');
           let unit: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(4)') as HTMLElement;
           if (unit) {
               triggerMouseEvent(unit, 'dblclick');
               let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'ResourcesTabContainer_gridcontrolunit')).ej2_instances[0];
               input.value = 50;
               input.dataBind();
               let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
               triggerMouseEvent(saveRecord, 'click');
           }
       });
       it('Resource editing -dailog-edit', () => {
           
           ganttObj.actionBegin = function (args: any): void {
               if (args.requestType === "beforeOpenEditDialog") {
                   args.dialogModel.animationSettings = { 'effect': 'none' };
               }
           };
           ganttObj.actionComplete = (args: any): void => {
               if (args.requestType === 'save') {
                  
                   expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(12);
               }
           };
           let checkbox: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
           triggerMouseEvent(checkbox, 'click');
           let unit: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(4)') as HTMLElement;
           if (unit) {
               triggerMouseEvent(unit, 'dblclick');
               let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'ResourcesTabContainer_gridcontrolunit')).ej2_instances[0];
               input.value = 50;
               input.dataBind();
               let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
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
           setTimeout(done, 500);
           ganttObj.openEditDialog(2);
           let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
           tab.selectedItem = 2;
       });
       it('Resource unit initial with unit mapping', () => {
           ganttObj.actionBegin = function (args: any): void {
               if (args.requestType === "beforeOpenEditDialog") {
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
           let checkbox: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
           if (checkbox) {
               triggerMouseEvent(checkbox, 'click');
               let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
               triggerMouseEvent(saveRecord, 'click');
           }
       });
       it('Resource unit editing with unit mapping', () => {
           ganttObj.actionBegin = function (args: any): void {
               if (args.requestType === "beforeOpenEditDialog") {
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
           let checkbox: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
           triggerMouseEvent(checkbox, 'click');
           let unit: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
           if (unit) {
               triggerMouseEvent(unit, 'dblclick');
               let input: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'ResourcesTabContainer_gridcontrolresourceUnit')).ej2_instances[0];
               input.value = 50;
               input.dataBind();
               let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
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
           setTimeout(done, 500);
           ganttObj.openEditDialog(4);
           let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
           tab.selectedItem = 4;
       });
       it('Custom Editor for custom column', () => {
           let customColumn: any = document.querySelector('#' + ganttObj.element.id + 'Customcol4') as HTMLInputElement;
           if (customColumn) {
               triggerMouseEvent(customColumn, 'click');
               let customValue: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Customcol4')).ej2_instances[0];
               customValue.value = 'Tracker 4';
               customValue.dataBind();
               let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
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
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
       });
       it('Add new record beyond project dates', () => {
           ganttObj.actionComplete = (args: any): void => {
               if (args.action === 'TimescaleUpdate') {
                   expect(ganttObj.getFormatedDate(ganttObj.cloneProjectStartDate, 'M/d/yyyy')).toEqual('3/18/2019');
               }
           };
           let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
           SD.value = new Date('03/20/2019');
           SD.dataBind();
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
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
           let cancelRecord1: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancelRecord1, 'click');
           let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
           triggerMouseEvent(taskName, 'dblclick');
           let name: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'TaskName')).ej2_instances[0];
           name.value = "updated";
           name.dataBind();
           let cancelRecord2: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(cancelRecord2, 'click');
       });
       it('Click event', () => {
           ganttObj.isAdaptive = true;
           ganttObj.dataBind();
           let tab: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-dlg-content > div > div > div > div:nth-Child(3)') as HTMLElement;
           triggerMouseEvent(tab, 'click');
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           ganttObj.refresh();
       });
       it('Restrict dialog rendering when allowediting is set as false', () => {
           ganttObj.editSettings.allowEditing = false;
           ganttObj.dataBind();
           let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(3) > td') as HTMLElement;
           triggerMouseEvent(row, 'dblclick');
           expect(document.getElementById('ganttContainer_dialog')).toEqual(null);
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
       it('Changing taskmode of a task to manual', (done: Function) => {
           expect(ganttObj.currentViewData[1].ganttProperties.isAutoSchedule).toBe(true);
           ganttObj.openEditDialog(2);
           let taskMode: any = document.querySelector('#' + ganttObj.element.id + 'isManual') as HTMLInputElement;
           if (taskMode) {
               let inputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'isManual')).ej2_instances[0];
               inputObj.value = true;
               inputObj.dataBind();
               let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
               triggerMouseEvent(saveRecord, 'click');
               setTimeout(done, 500);
           }
           expect(ganttObj.currentViewData[1].ganttProperties.isAutoSchedule).toBe(false);
       });
       it('Changing taskmode of a task to auto', (done: Function) => {
           let startDate: Date = ganttObj.currentViewData[2].ganttProperties.startDate;
           expect(ganttObj.getFormatedDate(startDate, 'M/d/yyyy')).toBe('2/26/2017');
           ganttObj.openEditDialog(3);
           let taskMode: any = document.querySelector('#' + ganttObj.element.id + 'isManual') as HTMLInputElement;
           if (taskMode) {
               let inputObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'isManual')).ej2_instances[0];
               inputObj.value = false;
               inputObj.dataBind();
               let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
               triggerMouseEvent(saveRecord, 'click');
               setTimeout(done, 500);
           }
           expect(ganttObj.getFormatedDate(ganttObj.currentViewData[2].ganttProperties.startDate, 'M/d/yyyy')).toBe('2/27/2017');
       });
   });
   describe('indent-outdent', () => {
       let ganttObj: Gantt;

       beforeAll((done: Function) => {
           ganttObj = createGantt({
               dataSource: indentOutdentData,
               allowSorting: true,
               allowSelection: true,
               taskFields: {
                   id: 'TaskID',
                   name: 'TaskName',
                   startDate: 'StartDate',
                   duration: 'Duration',
                   progress: 'Progress',
                   endDate: 'EndDate',
                   child: 'subtasks',
                  
               },
               editSettings: {
                   allowEditing: true,
                   allowDeleting: true,
                   allowTaskbarEditing: true,
                   showDeleteConfirmDialog: true
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Indent', 'Outdent'],
           }, done);
       });
       afterAll(() => {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('Indenting a record', (done: Function) => {
           expect(ganttObj.currentViewData[2].level).toBe(1);
           ganttObj.selectRow(2, false);
           setTimeout(done, 500);
           ganttObj.indent();
           setTimeout(done, 500);
           expect(ganttObj.currentViewData[2].level).toBe(2);
       });
       it('Otdenting a record', (done: Function) => {
           expect(ganttObj.currentViewData[2].level).toBe(2);
           ganttObj.selectRow(2, false);
           setTimeout(done, 500);
           ganttObj.outdent();
           setTimeout(done, 500);
           expect(ganttObj.currentViewData[2].level).toBe(1);
       });
   });
   describe('CR-issues', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: dialogEditData,
               allowSorting: true,
               allowSelection: true,
               taskFields: {
                   id: 'TaskID',
                   name: 'TaskName',
                   startDate: 'StartDate',
                   duration: 'Duration',
                   progress: 'Progress',
                   endDate: 'EndDate',
                   child: 'subtasks',
                   resourceInfo: 'Resource',
               },
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true,
                   allowTaskbarEditing: true,
                   showDeleteConfirmDialog: true
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Indent', 'Outdent'],
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('EJ2-48224 - Schedule validation- endDate', () => {
           ganttObj.openEditDialog(4);
           let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
           ED.value = new Date('04/09/2019');
           ED.dataBind();
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           expect(ganttObj.flatData[3].ganttProperties.duration).toBe(6);
           ganttObj.openEditDialog(4);
           let ED1: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
           ED1.value = new Date('04/12/2019');
           ED1.dataBind();
           let saveRecord1: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord1 , 'click');
           expect(ganttObj.flatData[3].ganttProperties.duration).toBe(9);
       });
       it('EJ2-48816 - Adding new task with empty string', () => {
           ganttObj.actionComplete = (args: any): void => {
               if (args.requestType === 'save') {
                   expect(ganttObj.flatData[0].ganttProperties.taskName).toBe('');
               }
           };
           ganttObj.openAddDialog();
           let name: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'TaskName')).ej2_instances[0];
           name.value = '';
           name.dataBind();
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
       });
   });
   
   describe('CR-issues', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: [
                   {
                       TaskID: 1,
                       TaskName: "Project Initiation",
                       StartDate: new Date("04/26/2021"),
                       EndDate: new Date("04/30/2021")
                   },
                   {
                       TaskID: 2,
                       TaskName: "Project Initiation1",
                       StartDate: new Date("04/26/2021"),
                       EndDate: new Date("04/30/2021")
                   }
               ],
               projectStartDate: new Date("04/25/2021"),
               projectEndDate: new Date("07/28/2021"),
               dateFormat: "MMM dd, y",

               taskFields: {
                   id: "TaskID",
                   name: "TaskName",
                   startDate: "StartDate",
                   endDate: "EndDate",
                   duration: "Duration",
                   progress: "Progress",
                   dependency: "Predecessor",
                   child: "subtasks",
                   notes: "info",
                   resourceInfo: "resources"
               },
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true,
                   allowTaskbarEditing: true,
                   showDeleteConfirmDialog: true
               },
               toolbar: [
                   "Add",
                   "Edit",
                   "Update",
                   "Delete",
                   "Cancel",
                   "ExpandAll",
                   "CollapseAll",
                   "Indent",
                   "Outdent"
               ],
               allowSelection: true,
               gridLines: "Both",
               height: "450px",
               treeColumnIndex: 1
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('dynamically updating holidays', () => {
           ganttObj.holidays = [
               {
                   from: "04/26/2021",
                   to: "04/27/2021",
                   label: "Test"
               }
           ];
            setTimeout(function () {
               expect(ganttObj.currentViewData[0]['StartDate'].getDate()).toBe(28);
               expect(ganttObj.currentViewData[0]['EndDate'].getDate()).toBe(4);
           }, 100);
       });
   });
    describe('MT-issues', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: projectData1,
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
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
               projectStartDate: new Date('02/01/2017'),
               projectEndDate: new Date('12/30/2017'),
               rowHeight: 40,
               taskbarHeight: 30,
               allowSelection: true
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('Selection maintain after adding record', () => {
           ganttObj.selectRow(1);
           let addToolbar: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
           triggerMouseEvent(addToolbar, 'click');
           let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
            expect((ganttObj.selectionModule.getSelectedRows().length)).toBe(1);
        });
    });
    describe('Split task', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           ganttObj = createGantt({
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
                   durationUnit: 'DurationUnit',
                   segments: 'Segments',
               },
               durationUnit: 'Hour',
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
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
               }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('end date validation when remove all segments', () => {
           expect(ganttObj.element.getElementsByClassName('e-row')[2].children[3].innerHTML).toBe('2/8/2019');
           ganttObj.openEditDialog(3);
           let selectSegment: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_Tab > div.e-tab-header.e-control.e-toolbar.e-lib.e-keyboard > div > div:nth-child(4)') as HTMLElement;
           triggerMouseEvent(selectSegment, 'click');
           let selectRow: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'SegmentsTabContainer_content_table > tbody > tr:nth-child(1)') as HTMLElement;
           triggerMouseEvent(selectRow, 'click');
           let deleteSegment: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'SegmentsTabContainer_delete > span.e-tbar-btn-text') as HTMLElement;
           triggerMouseEvent(deleteSegment, 'click');
           triggerMouseEvent(deleteSegment, 'click');
           triggerMouseEvent(deleteSegment, 'click');
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           expect(ganttObj.element.getElementsByClassName('e-row')[2].children[3].innerHTML).toBe('2/5/2019');

           
       });
   });
   describe('Split task', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           ganttObj = createGantt({
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
                   durationUnit: 'DurationUnit',
                   segments: 'Segments',
               },
               durationUnit: 'Hour',
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
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
               }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       beforeEach((done: Function) => {
           setTimeout(done, 500);
       });
       it('end date validation when remove all segments', () => {
           ganttObj.openEditDialog(3);
           let selectSegment: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_Tab > div.e-tab-header.e-control.e-toolbar.e-lib.e-keyboard > div > div:nth-child(4)') as HTMLElement;
           triggerMouseEvent(selectSegment, 'click');
       });
       it('end date validation when remove all segments', () => {
           let selectRow: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'SegmentsTabContainer_content_table > tbody > tr:nth-child(3)') as HTMLElement;
           triggerMouseEvent(selectRow, 'dblclick');
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           expect(ganttObj.element.getElementsByClassName('e-row')[2].children[3].innerHTML).toBe('2/8/2019')
       });
       it('Editing duration column with 0 days in segmented task', () => {
           let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
           triggerMouseEvent(duration, 'dblclick');
           let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
           input.value = '0';
           let update: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(5)') as HTMLElement;
           triggerMouseEvent(update, 'click');
           expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(0);
       });
   });
   describe('Split task custom', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: splitTasksData,
               taskFields: {
                   id: 'TaskID',
                   name: 'TaskName',
                   startDate: 'StartDate',
                   endDate: 'EndDate',
                   duration: 'Duration',
                   progress: 'Progress',
                   child: 'subtasks',
                   durationUnit: 'DurationUnit',
                   segments: 'Segments',
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
               durationUnit: 'Hour',
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
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
               }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('selecting segment', () => {
           ganttObj.openEditDialog(3);
           let selectSegment: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_Tab > div.e-tab-header.e-control.e-toolbar.e-lib.e-keyboard > div > div:nth-child(4)') as HTMLElement;
           triggerMouseEvent(selectSegment, 'click');
           let selectRow: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'SegmentsTabContainer_content_table > tbody > tr:nth-child(3)') as HTMLElement;
           triggerMouseEvent(selectRow, 'click');
           let deleteSegment: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'SegmentsTabContainer_delete > span.e-tbar-btn-text') as HTMLElement;
           triggerMouseEvent(deleteSegment, 'click');
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           expect(ganttObj.element.getElementsByClassName('e-row')[2].children[3].innerHTML).toBe('2/5/2019');
       });
   });
    describe('DataManager data ', () => {
       let ganttObj: Gantt;
       beforeAll((done: Function) => {
           ganttObj = createGantt({
               dataSource: new DataManager(dialogEditData),
               taskFields: {
                   id: 'TaskID',
                   name: 'TaskName',
                   startDate: 'StartDate',
                   endDate: 'EndDate',
                   duration: 'Duration',
                   progress: 'Progress',
                   resourceInfo: 'Resource',
                   dependency: 'Predecessor',
                   child: 'subtasks'
               },
               projectStartDate: new Date('03/25/2019'),
               projectEndDate: new Date('05/30/2019'),
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true,
                   mode: 'Dialog'
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
           }, done);
       });
       afterAll(() => {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('Editing with datamanager data', () => {
           ganttObj.openEditDialog(1);
           let name: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'TaskName')).ej2_instances[0];
           name.value = "updated";
           name.dataBind();
           let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           expect(ganttObj.flatData[0].ganttProperties.taskName).toBe("updated");
       });
       
   });
    describe('Custom Tab with defaultedit editType', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
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
                   { field: 'Customcolumn', editType: 'defaultedit', headerText: 'Custom Column1', width: 100 }
               ],
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
               allowUnscheduledTasks: true,
               }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('defaultedit type', () => {
           let customColumn: any = document.querySelector('#' + ganttObj.element.id + 'Customcolumn') as HTMLInputElement;
           if (customColumn) {
               triggerMouseEvent(customColumn, 'click');
               let customValue: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Customcolumn')).ej2_instances[0];
               customValue.value = 'Tracker 4';
               customValue.dataBind();
               let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
               triggerMouseEvent(saveRecord, 'click');
               expect(getValue('Customcolumn', ganttObj.flatData[3])).toBe('Tracker 4');
           }

       });
   });
   describe('Localization', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           L10n.load({
               'de-DE': {
                   'gantt': {
                       "emptyRecord": "Gösterilecek kayıt yok",
                       "id": "Id",
                       "name": "Başlık",
                       "duration": "Süre",
                       "progress": "İlerleme",
                       "dependency": "Bağımlılık",
                       "addDialogTitle": "Yeni görev",
                       "editDialogTitle": "Görev Bilgisi",
                       "saveButton": "Kaydet",
                       "add": "",
                       "edit": "",
                       "update": "Güncelleme",
                       "delete": "Sil",
                       "cancel": "İptal",
                   },
                   'grid': {}
                 }
             });
           ganttObj = createGantt({
               dataSource: dialogEditData,
               height: '450px',
               locale: 'de-DE',
               allowSelection: true,
               highlightWeekends: true,
               allowUnscheduledTasks: true,
               enableContextMenu: true,
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true,
                   allowTaskbarEditing: true,
                   showDeleteConfirmDialog: true
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'ZoomToFit', 'Indent', 'Outdent'],
               taskFields: {
                   id: 'TaskID',
                   name: 'TaskName',
                   duration: 'Duration',
                   progress: 'Progress',
                   dependency: 'Predecessor',
                   child: 'subtasks',
               },
               projectStartDate: new Date('03/28/2019'),
               projectEndDate: new Date('07/06/2019'),
               durationUnit: 'Hour',
               treeColumnIndex: 1,
               }, done);
               });
               afterAll(function () {
                   if (ganttObj) {
                       destroyGantt(ganttObj);
                   }
               });
               it('localization for the word New Task', () => {
                   ganttObj.openAddDialog();
                   let taskname: HTMLElement = document.getElementById(ganttObj.element.id + 'TaskName') as HTMLElement;
                   expect(taskname.getAttribute('value')).toBe("Yeni görev 8");
               });
       });
      /* describe('Render only segments tab', function () {
           let ganttObj: Gantt;
           beforeAll(function (done) {
               ganttObj = createGantt({
                   dataSource: projectData1,
                   height: '450px',
                   allowSelection: true,
                   highlightWeekends: true,
                   enableContextMenu: true,
                   editSettings: {
                       allowAdding: true,
                       allowEditing: true,
                       allowDeleting: true,
                       allowTaskbarEditing: true,
                       showDeleteConfirmDialog: true
                   },
                   editDialogFields: [
                       { type: 'Segments' }
                   ],
                   toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'ZoomToFit', 'Indent', 'Outdent'],
                   taskFields: {
                       id: 'TaskID',
                       name: 'TaskName',
                       duration: 'Duration',
                       startDate: 'StartDate',
                       progress: 'Progress',
                       dependency: 'Predecessor',
                       child: 'subtasks',
                       segments: 'Segments'
                   },
                   projectStartDate: new Date('03/28/2019'),
                   projectEndDate: new Date('07/06/2019'),
                   treeColumnIndex: 1,
                   }, done);
               });
               afterAll(function () {
                   if (ganttObj) {
                       destroyGantt(ganttObj);
                   }
               });
               beforeEach((done: Function) => {
                   setTimeout(done, 500);
               });
               it('Render segments tab', () => {
                   ganttObj.actionComplete = (args: any): void => {
                       if (args.requestType === 'save') {
                           expect(args.data.ganttProperties.segments).toBe(null);
                       }
                   };
                   ganttObj.selectRow(2);
                   ganttObj.openEditDialog();
                   let addIcon: HTMLElement = document.getElementById(ganttObj.element.id + 'SegmentsTabContainer' + '_add') as HTMLElement;
                   triggerMouseEvent(addIcon, 'click');
                   let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
                   triggerMouseEvent(saveRecord, 'click');
               });
           });*/
       describe('Add Dialog for Bottom position', () => {
               let ganttObj: Gantt;
               beforeAll((done: Function) => {
                   ganttObj = createGantt({
                       dataSource: projectData,
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
                       ],
                       editDialogFields: [
                           { type: 'General' },
                           { type: 'Dependency' },
                           { type: 'Resources' },
                           { type: 'Notes' }
                       ],
                       toolbar: ['Add', 'Edit', 'Update'],
                       splitterSettings: {
                           position: "50%",
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
               it('Add new record as Bottom', () => {
                   ganttObj.actionComplete = (args: any): void => {
                       if (args.action === 'add') {
                           expect(ganttObj.dataSource[ganttObj.dataSource['length'] - 1].ganttProperties).toBe(undefined);
                       }
                   };
                   let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
                   triggerMouseEvent(add, 'click');
                   let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                   triggerMouseEvent(saveRecord, 'click');
               });
       });
    describe('Manual mode edit endDate', function () {
        let ganttObj: Gantt;
        beforeAll(function (done) {
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
                taskMode: 'Manual',
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
                    { field: 'Customcolumn', editType: 'defaultedit', headerText: 'Custom Column1', width: 100 }
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                allowUnscheduledTasks: true,
            }, done);
        });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done: Function) => {
            setTimeout(done, 500);
            ganttObj.openEditDialog(1);
        });
        it('Edit end date', () => {
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            ED.value = new Date('04/09/2019');
            ED.dataBind();
            expect(ganttObj.getFormatedDate(ED.value, 'M/d/yyyy')).toBe('4/9/2019');
        });
    });
    describe('Baseline - ', function () {
               let ganttObj: Gantt;
               beforeAll(function (done) {
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
                       },
                       toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
                       }, done);
               });
               afterAll(function () {
                   if (ganttObj) {
                       destroyGantt(ganttObj);
                   }
               });
               beforeEach((done: Function) => {
                   ganttObj.openAddDialog();
                   let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                   triggerMouseEvent(saveRecord, 'click');
                   setTimeout(done, 500);
               });
               it('End date validation', () => {
                   ganttObj.selectionModule.selectRow(0);
                   ganttObj.openEditDialog();
                   let sdate: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'BaselineStartDate')).ej2_instances[0];
                   sdate.value = new Date('04/02/2019');
                   sdate.dataBind();
                   let edate: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'BaselineEndDate')).ej2_instances[0];
                   edate.value = new Date('04/10/2019');
                   edate.dataBind();
                   let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                   triggerMouseEvent(saveButton, 'click');
                   expect((ganttObj.currentViewData[0].ganttProperties.baselineEndDate).getDate()).toBe(10);

               });
           });
    describe('Edit Duration of milestone', function () {
       let ganttObj: Gantt;
       let data: Object[] =[ {TaskID: 1, TaskName: 'New Task 1', Duration: 1, Progress: 0, StartDate: new Date('03/26/2019')},
       {TaskID: 2, TaskName: 'New Task 2', StartDate: new Date('03/26/2019'), Duration: 0, Progress: 0}
       ];
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: data,
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
                   { field: 'Duration', headerText: 'Duration' },
                   { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                   { field: 'CustomColumn', headerText: 'CustomColumn' }
               ],
               sortSettings: {
                   columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                   { field: 'TaskName', direction: 'Ascending' }]
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit', 
               'PrevTimeSpan', 'NextTimeSpan','ExcelExport', 'CsvExport', 'PdfExport'],
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
                   from: "03/24/2019",
                   to: "03/25/2019",
                   label: " Public holidays",
                   cssClass: "e-custom-holiday"

               },
               {
                   from: "04/12/2019",
                   to: "04/12/2019",
                   label: " Public holiday",
                   cssClass: "e-custom-holiday"

               }],
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
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       beforeEach((done: Function) => {
           setTimeout(done, 500);
           ganttObj.openEditDialog(2);
       });
       it('Edit duration of milestone', () => {
           let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
           if (durationField) {
               let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
               textObj.value = '1 days';
               textObj.dataBind();
               let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
               expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('3/26/2019');
           }
       });
   });
     describe('Edit Duration of new task', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: [],
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
                   { field: 'Duration', headerText: 'Duration' },
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
                   timelineViewMode: 'Week',
                   topTier: {
                     format: 'MMM',
                     unit: 'Week',
                   },
                   bottomTier: {
                     unit: 'Day',
                     format: 'dd',
                   },
               },
               allowResizing: true,
               readOnly: false,
               taskbarHeight: 20,
               rowHeight: 40,
               height: '550px',
               allowUnscheduledTasks: true,
       projectStartDate: new Date('07/22/2022'),
               projectEndDate: new Date('08/28/2022')
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('Edit duration of new task', () => {
           ganttObj.fitToProject();
           ganttObj.actionComplete = (args: any): void => {
               if (args.requestType == 'add') {
                   expect(args.data.EndDate.getDate() - args.data.StartDate.getDate()).toBe(1);
               }
           };
           ganttObj.openAddDialog();
       let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
           SD.value = new Date('07/20/2022');
       SD.dataBind();
           let name: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           name.value = '2 days';
           name.dataBind();
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
       });
   });
   describe('Edit custom column values in edit dialog', function () {
       let ganttObj: Gantt;
       let elem: HTMLElement;
       let dropdownlistObj: DropDownList;
       let data = [
           {name:'deliver'},
           {name:'stage'},
           {name:'task'}
       ];
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: projectData1,
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
               columns: [
                   { field: 'TaskID', headerText: 'Task ID' },
                   { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                   { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                   { field: 'Duration', headerText: 'Duration', allowEditing: false },
                   { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                   { field: 'taskType', headerText: 'taskType',
                   edit: {
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
                           dropdownlistObj = new DropDownList({
                               dataSource: data,
                               fields: { value: 'name' },
                           });
                           dropdownlistObj.appendTo(elem);
                       }
                   } }
               ],
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
               projectStartDate: new Date('02/01/2017'),
               projectEndDate: new Date('12/30/2017'),
               rowHeight: 40,
               taskbarHeight: 30,
               allowSelection: true
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       beforeEach((done: Function) => {
           setTimeout(done, 500);
           ganttObj.openEditDialog(2);
           let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
           tab.selectedItem = 2;
       });
       it('change custom dialog values in edit dialog', () => {
           let customColumn: any = document.querySelector('#' + ganttObj.element.id + 'taskType') as HTMLInputElement;
           triggerMouseEvent(customColumn, 'click');
           let customValue: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'taskType')).ej2_instances[0];
           customValue.value = 'task';
           customValue.dataBind();
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           expect(getValue('taskType', ganttObj.flatData[1])).toBe('task');
       });
   });
   describe('Dialogue edit with Shimmer effect', function () {
       let ganttObj: Gantt;
       let elem: HTMLElement;
       let dropdownlistObj: DropDownList;
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: projectData1,
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
               columns: [
                   { field: 'TaskID', headerText: 'Task ID' },
                   { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                   { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                   { field: 'Duration', headerText: 'Duration', allowEditing: false },
                   { field: 'Progress', headerText: 'Progress'}, 
               ],
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
               enableContextMenu: true,
               allowSorting: true,
               loadingIndicator: { indicatorType: 'Shimmer' },
               projectStartDate: new Date('02/01/2017'),
               projectEndDate: new Date('12/30/2017'),
               rowHeight: 40,
               taskbarHeight: 30,
               allowSelection: true
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       beforeEach((done: Function) => {
           setTimeout(done, 500);

       });
       it('edit dialogue shimmer effect', () => {
           ganttObj.actionComplete = (args: any): void => {
               if (args.requestType === "openEditDialog") {
                   expect(document.getElementsByClassName('e-table e-masked-table').length).toBe(2);
               }
           }
           ganttObj.openEditDialog(2);
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
       });
       it('add dialogue shimmer effect', () => {
           ganttObj.actionComplete = (args: any): void => {
               if (args.action === "OpenDialog") {
                   expect(document.getElementsByClassName('e-table e-masked-table').length).toEqual(2);
               }
           };
           let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
           triggerMouseEvent(add, 'click');
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
       });
       // it('context menu outdent shimmer effect', () => {
       //     ganttObj.selectionModule.selectRow(8);
       //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1)') as HTMLElement;
       //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
       //     ganttObj.actionComplete = (args: any): void => {
       //         if (args.requestType === "outdented") {
       //             expect(document.getElementsByClassName('e-table e-masked-table').length).toEqual(3);
       //         }
       //     };
       //     let indent: ContextMenuClickEventArgs = {
       //         item: { id: ganttObj.element.id + '_contextMenu_Outdent' },
       //         element: null,
       //     };
       //     (ganttObj.contextMenuModule as any).contextMenuItemClick(indent);
       // });
       it('Selection scroll shimmer', () => {
           ganttObj.selectionModule.selectRow(22);
           ganttObj.actionComplete = (args: any): void => {
               if (args.requestType === "scroll") {
                   expect(document.getElementsByClassName('e-table e-masked-table').length).toEqual(0);
               }
           };
       });
       it('convert to milestone shimmer effect', () => {
           ganttObj.selectionModule.selectRow(8);
           let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1)') as HTMLElement;
           triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
           ganttObj.actionComplete = (args: any): void => {
               if (args.requestType === "save") {
                   expect(document.getElementsByClassName('e-table e-masked-table').length).toEqual(2);
               }
           };
           let e: ContextMenuClickEventArgs = {
                   item: { id: ganttObj.element.id + '_contextMenu_ToMilestone' },
                   element: null,
               };
               (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
       });
       it('Task information shimmer effect', () => {
           ganttObj.selectionModule.selectRow(8);
           let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1)') as HTMLElement;
           triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
           ganttObj.actionComplete = (args: any): void => {
               if (args.requestType === "openEditDialog") {
                   expect(document.getElementsByClassName('e-table e-masked-table').length).toEqual(2);
                   let cancelRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
                   triggerMouseEvent(cancelRecord, 'click');
               }
           };
           let taskInfo: HTMLElement = document.getElementById(ganttObj.element.id + '_contextMenu_TaskInformation');
           triggerMouseEvent(taskInfo, 'click');
       });
       // it('Below shimmer effect', () => {
       //     ganttObj.selectionModule.selectRow(8);
       //     let $tr: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1)') as HTMLElement;
       //     triggerMouseEvent($tr, 'contextmenu', 0, 0, false, false, 2);
       //     ganttObj.actionComplete = (args: any): void => {
       //         if (args.requestType === "add") {
       //             expect(document.getElementsByClassName('e-table e-masked-table').length).toEqual(3);
       //         }
       //     };
       //     let e: ContextMenuClickEventArgs = {
       //         item: { id: ganttObj.element.id + '_contextMenu_Below' },
       //         element: null,
       //     };
       //     (ganttObj.contextMenuModule as any).contextMenuItemClick(e);
       //     ganttObj.selectionModule.selectRow(8);
       // });
       it('Cell edit shimmer effect', () => {
           ganttObj.actionComplete = (args: any): void => {
               if (args.requestType === "save") {
                   expect(document.getElementsByClassName('e-table e-masked-table').length).toEqual(2);
               }
           };
           let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
           triggerMouseEvent(taskName, 'dblclick');
           let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
           input.value = 'TaskName updated';
           let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
           triggerMouseEvent(element, 'click');

       });
   });
   describe('Cr string convert to integer issue', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: [],
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true,
                   allowTaskbarEditing: true,
                   showDeleteConfirmDialog: true,
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
               taskFields: {
                   id: 'secondaryId',
                   name: 'name',
                   startDate: 'currentStartDate',
                   endDate: 'currentFinishDate',
                   duration: 'duration',
                   progress: 'percentComplete',
                   parentID: 'secondaryParentId',
                   baselineStartDate: 'targetStart',
                   baselineEndDate: 'targetFinish',
                   resourceInfo: 'assignees',
                   expandState: 'isExpanded',
                   dependency: 'dependency',
               },
               columns: [
                   { field: 'name' },
                   { field: 'duration' },
                   { field: 'currentStartDate' },
                   { field: 'currentFinishDate' },
                   { field: 'targetStart' },
                   { field: 'targetFinish' },
                   { field: 'percentComplete' },
                   { field: 'secondaryId', visible:false ,headerText: 'Secondary ID'},
                   { field: 'taskType' },
               ],
               projectStartDate: new Date('03/25/2022'),
               projectEndDate: new Date('05/30/2022'),
               rowHeight: 40,
               taskbarHeight: 30,
               allowSelection: true
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('checking edit type', () => {
           // expect(document.getElementsByClassName('e-gantt')[0]['ej2_instances'][0].columnByField['secondaryId'].editType).toBe('stringedit')
       });
   });
   describe('Cr Data source error', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: crData,
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true,
                   allowTaskbarEditing: true,
                   showDeleteConfirmDialog: true,
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
               taskFields: {
                   id: 'runningId',
                   name: 'name',
                   dependency: 'dependency',
                   baselineStartDate: 'actualStartDate',
                   baselineEndDate: 'actualCompletionDate',
                   startDate: 'startDate',
                   endDate: 'estimatedCompletionDate',
                   duration: 'duration',
                   expandState: 'expandState',
                   progress: 'progress',
                   child: 'child',
               },
               queryCellInfo :(args)  => {
                   if (args.column.field == 'progress' && args.data.hasChildRecords) {
                        args.cell.innerText = args.data.taskData.progress.toString();
                      }
                 },
               projectStartDate: new Date('08/01/2022'),
               projectEndDate: new Date('10/28/2022'),
               rowHeight: 40,
               taskbarHeight: 30,
               allowSelection: true
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       beforeEach((done: Function) => {
           setTimeout(done, 500);
       });
       it('changing inner html value', () => {
           // expect(document.getElementsByClassName('e-rowcell e-ellipsistooltip')[5].innerHTML).toBe('2')
       });
   });
   describe('CR-issues', function () {
       let ganttObj: Gantt;
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: dialogEditData,
               allowSorting: true,
               allowSelection: true,
               taskFields: {
                   id: 'TaskID',
                   name: 'TaskName',
                   startDate: 'StartDate',
                   duration: 'Duration',
                   progress: 'Progress',
                   endDate: 'EndDate',
                   child: 'subtasks',
                   resourceInfo: 'Resource',
               },
               actionBegin(args) {
                   if (args.requestType == 'beforeOpenEditDialog') {
                       args.General.TaskName.enabled = false;
                       args.General.StartDate.enabled = false;
                       args.General.Duration.enabled = false;
                   }
               },
               actionComplete(args) {
                   if (args.requestType == 'openEditDialog') {
                       expect(document.getElementsByClassName('e-disabled').length).toBe(8);
                   }
               },
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true,
                   allowTaskbarEditing: true,
                   showDeleteConfirmDialog: true
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Indent', 'Outdent'],
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
   it('EJ2-48816 - Adding new task with empty string', () => {
           ganttObj.openEditDialog(3);
       });
   });
    describe('edit Date in dialog edit', () => {
        let ganttObj: Gantt;
        let editingData = [
            {
                TaskID: 1,
                TaskName: 'Project initiation',
                StartDate: new Date('04/03/2019'),
                EndDate: new Date('04/21/2019'),
                Duration: 1,
            },
            {
                TaskID: 2,
                TaskName: 'Identify site location',
                StartDate: new Date('04/04/2019'),
                Duration: 1,
                Predecessor: '1FS',
            },
        ];
        beforeAll(function (done) {
            ganttObj = createGantt({
                dataSource: editingData,
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
        beforeEach((done) => {
            setTimeout(done, 100);
            ganttObj.openEditDialog(1);
        });
        it('Change dates of predecessor record', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.action === "DialogEditng") {
                    expect(ganttObj.getFormatedDate(args.modifiedRecords[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/2/2019')
                }
            };
            let startDateField: any = document.querySelector('#' + ganttObj.element.id + 'StartDate') as HTMLInputElement;
            if (startDateField) {
                let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
                textObj.value = new Date('04/02/2019');
                textObj.dataBind();
                let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
            }
        });
    });
describe('Edit custom column values in edit dialog', function () {
       let ganttObj: Gantt;
       let elem: HTMLElement;
       let dropdownlistObj: DropDownList;
       let data = [
           {name:'deliver'},
           {name:'stage'},
           {name:'task'}
       ];
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: projectData1,
               editSettings: {
                   allowAdding: true,
                   allowEditing: true,
                   allowDeleting: true
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
               columns: [
                   { field: 'TaskID', headerText: 'Task ID' },
                   { field: 'TaskName', headerText: 'Task Name', allowReordering: false  },
                   { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                   { field: 'Duration', headerText: 'Duration', allowEditing: false },
                   { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                   { field: 'taskType', headerText: 'taskType',
                   edit: {
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
                           dropdownlistObj = new DropDownList({
                               dataSource: data,
                               fields: { value: 'name' },
                           });
                           dropdownlistObj.appendTo(elem);
                       }
                   } }
               ],
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
               projectStartDate: new Date('02/01/2017'),
               projectEndDate: new Date('12/30/2017'),
               rowHeight: 40,
               taskbarHeight: 30,
               allowSelection: true
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       beforeEach((done: Function) => {
           setTimeout(done, 500);
           ganttObj.openEditDialog(2);
           let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
           tab.selectedItem = 2;
       });
       it('change custom dialog values in edit dialog', () => {
           let customColumn: any = document.querySelector('#' + ganttObj.element.id + 'taskType') as HTMLInputElement;
           triggerMouseEvent(customColumn, 'click');
           let customValue: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'taskType')).ej2_instances[0];
           customValue.value = 'task';
           customValue.dataBind();
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           expect(getValue('taskType', ganttObj.flatData[1])).toBe('task');
       });
   });
    describe('edit Date in dialog edit', () => {
        let ganttObj: Gantt;
        let editingData = [
            {
                TaskID: 1,
                TaskName: 'Project initiation',
                StartDate: new Date('04/03/2019'),
                EndDate: new Date('04/21/2019'),
                Duration: 1,
            },
            {
                TaskID: 2,
                TaskName: 'Identify site location',
                StartDate: new Date('04/04/2019'),
                Duration: 1,
                Predecessor: '1FS',
            },
        ];
        beforeAll(function (done) {
            ganttObj = createGantt({
                dataSource: editingData,
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
        beforeEach((done) => {
            setTimeout(done, 100);
            ganttObj.openEditDialog(1);
        });
        it('Change dates of predecessor record', () => {
            ganttObj.actionComplete = function (args: any): void {
                if (args.action === "DialogEditng") {
                    expect(ganttObj.getFormatedDate(args.modifiedRecords[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/2/2019')
                }
            };
            let startDateField: any = document.querySelector('#' + ganttObj.element.id + 'StartDate') as HTMLInputElement;
            if (startDateField) {
                let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
                textObj.value = new Date('04/02/2019');
                textObj.dataBind();
                let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
            }
        });
    });
    describe('Issues in Unscheduled tasks sample', function () {
        let ganttObj: Gantt;
        let unscheduledData: Object[] = [
            {
                TaskId: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),
                EndDate: new Date('04/21/2019'), Duration: '5', TaskType: ''
            },
            {
                TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'
            },
            {
                TaskId: 3, TaskName: 'Task 3', StartDate: new Date('04/03/2019'), TaskType: 'Task with start date only'
            },
            {
                TaskId: 4, TaskName: 'Task 4', EndDate: new Date('04/08/2019'), TaskType: 'Task with end date only'
            },
        ];
        beforeAll(function (done) {
            ganttObj = createGantt({
                dataSource: unscheduledData,
                enableContextMenu: true,
                taskFields: {
                    id: 'TaskId',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
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
                    { field: 'TaskType', visible: false }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' },
                    { field: 'TaskName', direction: 'Ascending' }]
                },
                splitterSettings: {
                    columnIndex: 4
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
                allowSelection: true,
                allowRowDragAndDrop: true,
                selectedRowIndex: 1,
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
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('05/30/2019')
            }, done);
        });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('check duration after changing in dialog edit', () => {
            ganttObj.openEditDialog(2);
            let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
            if (durationField) {
                let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                textObj.value = '-10 days';
                textObj.dataBind();
                expect(textObj.value).toBe('0 days');
            };
            let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
        it('check duration after changing start date in dialog edit', () => {
            ganttObj.openEditDialog(4);
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            SD.value = new Date('06/12/2023');
            SD.dataBind();
            expect(ganttObj.getFormatedDate(SD.value, 'M/d/yyyy')).toBe('4/8/2019');
            let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
        it('check duration after changing duration using cell edit', () => {
            let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(duration, 'dblclick');
            let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
            durationInput.value = '-4 days';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.flatData[2].ganttProperties.duration).toBe(0);
        });
    });
    describe('Cant able to convert the taskbar to milestone', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: scheduleModeData1,
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
                toolbar: ["Add","Edit","Update","Delete","Cancel","ExpandAll","CollapseAll"],
                allowExcelExport: true,
                allowPdfExport: true,
                allowRowDragAndDrop: true,
                splitterSettings: {
                    position: "50%",
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Check the task is milestone', () => {
            ganttObj.openEditDialog(2);
            let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
            if (durationField) {
                let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                textObj.value = '0 days';
                textObj.dataBind();
            }
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.isMilestone).toBe(true);
        });
    });	
});
describe('Issues in Unscheduled tasks sample', function () {
       let ganttObj: Gantt;
       let unscheduledData: Object[] = [
           {
               TaskId: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),
               EndDate: new Date('04/21/2019'), Duration: '5', TaskType: ''
           },
           {
               TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'
           },
           {
               TaskId: 3, TaskName: 'Task 3', StartDate: new Date('04/03/2019'), TaskType: 'Task with start date only'
           },
           {
               TaskId: 4, TaskName: 'Task 4', EndDate: new Date('04/08/2019'), TaskType: 'Task with end date only'
           },
       ];
       beforeAll(function (done) {
           ganttObj = createGantt({
               dataSource: unscheduledData,
               enableContextMenu: true,
               taskFields: {
                   id: 'TaskId',
                   name: 'TaskName',
                   startDate: 'StartDate',
                   endDate: 'EndDate',
                   duration: 'Duration',
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
                   { field: 'TaskType', visible: false }
               ],
               sortSettings: {
                   columns: [{ field: 'TaskID', direction: 'Ascending' },
                   { field: 'TaskName', direction: 'Ascending' }]
               },
               splitterSettings: {
                   columnIndex: 4
               },
               toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
               allowSelection: true,
               allowRowDragAndDrop: true,
               selectedRowIndex: 1,
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
               projectStartDate: new Date('03/25/2019'),
               projectEndDate: new Date('05/30/2019')
           }, done);
       });
       afterAll(function () {
           if (ganttObj) {
               destroyGantt(ganttObj);
           }
       });
       it('check start date after changing in dialog edit', () => {
           ganttObj.actionComplete = (args) => {
               if (args.requestType === 'save') {
                   expect(ganttObj.flatData[0].ganttProperties.startDate).toBe(null);
               }
           }
           ganttObj.openEditDialog(1);
           let dateField: any = document.querySelector('#' + ganttObj.element.id + 'StartDate') as HTMLInputElement;
           if (dateField) {
               let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
               textObj.value = null;
               textObj.dataBind();
           };
           let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
       });
   });	
describe('Update custom field in general tab', function () {
   let ganttObj: Gantt;
   const priorityData = [
       { priorityName: 'Normal', PriorityId: '1' },
       { priorityName: 'High', PriorityId: '2' },
       { priorityName: 'Low', PriorityId: '3' },
       { priorityName: 'Critical', PriorityId: '4' },
       { priorityName: 'Breaker', PriorityId: '5' }
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: projectData1,
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
           editDialogFields: [
               {
                   type: 'General',
                   headerText: 'General',
                   fields: [
                       'TaskID',
                       'TaskName',
                       'StartDate',
                       'EndDate',
                       'Duration',
                       'Progress',
                       'CustomField',
                   ],
               }
           ],
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
               {
                   field: 'CustomField',
                   headerText: 'CustomField',
                   width: '150',
                   editType: 'booleanedit',
                   type: 'boolean',
                   displayAsCheckBox: true
               },],
           sortSettings: {
               columns: [{ field: 'TaskID', direction: 'Ascending' },
               { field: 'TaskName', direction: 'Ascending' }]
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
               // columnIndex: 4
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
           allowUnscheduledTasks: true,
           projectStartDate: new Date('03/25/2019'),
           projectEndDate: new Date('05/30/2019')
       }, done);
   });
   afterAll(function () {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it('change custom field value in general tab', () => {
       ganttObj.actionComplete = (args) => {
           if (args.requestType === 'save') {
               expect(args.data.CustomField).toBe(true);
           }
       }
       ganttObj.openEditDialog(3);
       let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'CustomField')).ej2_instances[0];
       textObj.checked = true;
       textObj.dataBind();
       let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
       triggerMouseEvent(saveRecord, 'click');
   });
});
describe('Validation Rule in Edit Dialog', function () {
   let ganttObj: Gantt;
   let unscheduledData: Object[] = [
       {
           TaskId: 1, TaskName: 'Task 1', StartDate: new Date('04/02/2019'),
           EndDate: new Date('04/21/2019'), Duration: '5', TaskType: ''
       },
       {
           TaskId: 2, TaskName: 'Task 2', Duration: '5', TaskType: 'Task with duration only'
       },
       {
           TaskId: 3, TaskName: 'Task 3', StartDate: new Date('04/03/2019'), TaskType: 'Task with start date only'
       },
       {
           TaskId: 4, TaskName: 'Task 4', EndDate: new Date('04/08/2019'), TaskType: 'Task with end date only'
       },
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: unscheduledData,
           enableContextMenu: true,
           taskFields: {
               id: 'TaskId',
               name: 'TaskName',
               startDate: 'StartDate',
               endDate: 'EndDate',
               duration: 'Duration',
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
               { field: 'Duration', width: 90, validationRules: { required: true } },
               { field: 'TaskType', visible: false },
               { field: 'Custom', visible: false }
           ],
           sortSettings: {
               columns: [{ field: 'TaskID', direction: 'Ascending' },
               { field: 'TaskName', direction: 'Ascending' }]
           },
           splitterSettings: {
               columnIndex: 4
           },
           toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',],
           allowSelection: true,
           allowRowDragAndDrop: true,
           selectedRowIndex: 1,
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
           projectStartDate: new Date('03/25/2019'),
           projectEndDate: new Date('05/30/2019')
       }, done);
   });
   afterAll(function () {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it('Duration Validation Rule', () => {
       let actionBeginFired = false;
       ganttObj.actionComplete = (args) => {
           if (args.requestType === 'save') {
               actionBeginFired = true
           }
       }
       ganttObj.openEditDialog(1);
       let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
       if (durationField) {
           let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           textObj.value = null;
           textObj.dataBind();
           let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           expect(actionBeginFired).toBe(false);
           let textObj1: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           textObj1.value = '3 days';
           textObj1.dataBind();
           let saveRecord1: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
           triggerMouseEvent(saveRecord1, 'click');
           expect(actionBeginFired).toBe(true);
       };
   });
   it('Duration Validation Rule Add', () => {
       let actionBeginFired = false;
       ganttObj.actionComplete = (args) => {
           if (args.requestType === 'add') {
               actionBeginFired = true
           }
       }
       ganttObj.openAddDialog();
       let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
       if (durationField) {
           let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           textObj.value = null;
           textObj.dataBind();
           let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
           expect(actionBeginFired).toBe(false);
           let textObj1: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           textObj1.value = '3 days';
           textObj1.dataBind();
           let saveRecord1: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
           triggerMouseEvent(saveRecord1, 'click');
           expect(actionBeginFired).toBe(true);
       };
   });
});
   describe('Bug-850397: Work column is not properly updating in Resource sample', () => {
       let ganttObj: Gantt;
       beforeAll((done: Function) => {
           ganttObj = createGantt({
               dataSource: [
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
                   }
               ],
               resources: [
                   { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'}
               ],
               viewType: 'ResourceView',
               enableMultiTaskbar: true,
               showOverAllocation: true,
               taskFields: {
                   id: 'TaskID',
                   name: 'TaskName',
                   startDate: 'StartDate',
                   endDate: 'EndDate',
                   duration: 'Duration',
                   progress: 'Progress',
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
       beforeEach((done) => {
           setTimeout(done, 500);
           ganttObj.openAddDialog();
       let resourceTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
       resourceTab.selectedItem = 1;
       });
       it('Verifying total parent work while adding New record with resource', () => {
           let inputObj: any = (document.getElementById(ganttObj.element.id + 'work') as any).ej2_instances[0];
           inputObj.value = 8;
           let resourceCheckbox1: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_gridcontrol_content_table > tbody > tr:nth-child(1) > td.e-rowcell.e-gridchkbox > div > span.e-frame.e-icons.e-uncheck') as HTMLElement;
           triggerMouseEvent(resourceCheckbox1, 'click');
           let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveButton, 'click');
           expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(50.4);
           expect(ganttObj.currentViewData.length).toBe(5);
       });
   });
   describe('Resource using string', () => {
       let ganttObj: Gantt;
       beforeAll((done: Function) => {
           ganttObj = createGantt({
               dataSource: [
                   {
                       TaskID: 2, TaskName: 'Identify site location', StartDate: new Date('03/29/2019'), Duration: 3,
                       Progress: 30, work: 10, resources: "Martin Tamer"
                   }
               ],
               resources: [
                   { resourceId: 1, resourceName: 'Martin Tamer', resourceGroup: 'Planning Team'}
               ],
               viewType: 'ResourceView',
               enableMultiTaskbar: true,
               showOverAllocation: true,
               taskFields: {
                   id: 'TaskID',
                   name: 'TaskName',
                   startDate: 'StartDate',
                   endDate: 'EndDate',
                   duration: 'Duration',
                   progress: 'Progress',
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
       beforeEach((done) => {
           setTimeout(done, 500);
           ganttObj.openAddDialog();
       });
       it("Checking datasource with string resource", () => {
           expect(ganttObj.currentViewData.length>=1).toBe(true);
       });
   });
describe('Edit baseline dates', function () {
   let ganttObj: Gantt;
   let bwData = [
       {
           TaskID: 1,
           TaskName: 'New Task 1',
           StartDate: new Date('05/22/2023'),
           EndDate: new Date('05/22/2023'),
           Progress: 59,
           Duration: 1,
       },
       {
           TaskID: 2,
           TaskName: 'New Task 2',
           StartDate: new Date('05/22/2023'),
           EndDate: new Date('05/22/2023'),
           BaselineStartDate: new Date('05/22/2023'),
           BaselineEndDate: new Date('05/22/2023'),
           Progress: 45,
           Duration: 0,
           //Predecessor: '1FS',
       },
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: bwData,
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
               parentID: 'parentID',
               baselineStartDate: 'BaselineStartDate',
               baselineEndDate: 'BaselineEndDate'
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
               { field: 'Duration', headerText: 'Duration' },
               { field: 'Progress', headerText: 'Progress', allowFiltering: false },
               { field: 'CustomColumn', headerText: 'CustomColumn' }
           ],
           sortSettings: {
               columns: [{ field: 'TaskID', direction: 'Ascending' },
               { field: 'TaskName', direction: 'Ascending' }]
           },
           toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
               'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

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
   afterAll(function () {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it('change baseline dates', () => {
       ganttObj.actionComplete = (args) => {
           if (args.requestType === 'save') {
               expect(ganttObj.flatData[0].ganttProperties.baselineEndDate.getHours()).toBe(8);
           }
       }
       ganttObj.openEditDialog(1);
       let durationField: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
       durationField.value = '0 day';
       durationField.dataBind();
       let baselineStartdateField: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'BaselineStartDate')).ej2_instances[0];
       baselineStartdateField.value = '05/22/2023';
       baselineStartdateField.dataBind();
       let baselineEnddateField: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'BaselineEndDate')).ej2_instances[0];
       baselineEnddateField.value = '05/22/2023';
       baselineEnddateField.dataBind();
       let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
       triggerMouseEvent(saveRecord, 'click');
   });
});
describe('Change baseline dates', function () {
   let ganttObj: Gantt;
   let bwData = [
       {
           TaskID: 1,
           TaskName: 'New Task 1',
           StartDate: new Date('05/22/2023'),
           EndDate: new Date('05/22/2023'),
           Progress: 59,
           Duration: 1,
       }
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: bwData,
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
               parentID: 'parentID',
               baselineStartDate: 'BaselineStartDate',
               baselineEndDate: 'BaselineEndDate'
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
               { field: 'Duration', headerText: 'Duration' },
               { field: 'Progress', headerText: 'Progress', allowFiltering: false },
               { field: 'CustomColumn', headerText: 'CustomColumn' }
           ],
           sortSettings: {
               columns: [{ field: 'TaskID', direction: 'Ascending' },
               { field: 'TaskName', direction: 'Ascending' }]
           },
           toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
               'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

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
   afterAll(function () {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it('change baseline dates', () => {
       ganttObj.actionBegin= (args) => {
           if (args.requestType === 'beforeSave') {
               args.data.BaselineStartDate = args.data.StartDate;
               args.data.ganttProperties.baselineStartDate = args.data.ganttProperties.startDate;
               args.data.ganttProperties.baselineEndDate = args.data.ganttProperties.endDate;
               args.data.BaselineEndDate = args.data.EndDate;
               args.data.taskData.BaselineStartDate = args.data.taskData.StartDate;
               args.data.taskData.BaselineEndDate = args.data.taskData.EndDate;
           }
       }
       ganttObj.actionComplete= (args) => {
           if (args.requestType == "save") {
               expect(args.data.ganttProperties.baselineWidth > 0).toBe(true);
           } 
       }
       ganttObj.openEditDialog(1);
       let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
       triggerMouseEvent(saveRecord, 'click');
   });
});
describe('Change progress', function () {
   let ganttObj: Gantt;
   let bwData = [
       {
           TaskID: 1,
           TaskName: 'New Task 1',
           StartDate: new Date('05/22/2023'),
           EndDate: new Date('05/22/2023'),
           Progress: 59,
           Duration: 1,
       }
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: bwData,
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
               parentID: 'parentID',
               baselineStartDate: 'BaselineStartDate',
               baselineEndDate: 'BaselineEndDate'
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
               { field: 'Duration', headerText: 'Duration' },
               { field: 'Progress', headerText: 'Progress', allowFiltering: false },
               { field: 'CustomColumn', headerText: 'CustomColumn' }
           ],
           sortSettings: {
               columns: [{ field: 'TaskID', direction: 'Ascending' },
               { field: 'TaskName', direction: 'Ascending' }]
           },
           toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
               'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

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
   afterAll(function () {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it('change progress value', () => {
       let currentWidth:any; 
       ganttObj.actionBegin= (args) => {
           if (args.requestType === 'beforeSave') {
               currentWidth = args.data.ganttProperties.progressWidth
               args.data.Progress = 100;
               args.data.ganttProperties.progress = 100;
               args.data.taskData.Progress = 100;
           }
       }
       ganttObj.actionComplete= (args) => {
           if (args.requestType == "save") {
               expect(args.data.ganttProperties.progressWidth > currentWidth).toBe(true);
           } 
       }
       ganttObj.openEditDialog(1);
       let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
       triggerMouseEvent(saveRecord, 'click');
   });
});
describe('End Edit before open dialog', function () {
   let ganttObj: Gantt;
   let bwData = [
       {
           TaskID: 1,
           TaskName: 'New Task 1',
           StartDate: new Date('05/22/2023'),
           EndDate: new Date('05/22/2023'),
           Progress: 59,
           Duration: 1,
       }
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: bwData,
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
               parentID: 'parentID',
               baselineStartDate: 'BaselineStartDate',
               baselineEndDate: 'BaselineEndDate'
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
               { field: 'Duration', headerText: 'Duration' },
               { field: 'Progress', headerText: 'Progress', allowFiltering: false },
               { field: 'CustomColumn', headerText: 'CustomColumn' }
           ],
           sortSettings: {
               columns: [{ field: 'TaskID', direction: 'Ascending' },
               { field: 'TaskName', direction: 'Ascending' }]
           },
           toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
               'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

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
   afterAll(function () {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it('Edit task name and open dialog', () => {
       let TaskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
       triggerMouseEvent(TaskName, 'dblclick');
       triggerMouseEvent(document.querySelector('.e-taskbar-main-container '), 'dblclick');
       // expect(ganttObj.treeGrid.element.getElementsByClassName('e-editedbatchcell').length > 0).toBe(false)
   });
});
describe('Change task start date less than timeline start date using dialog edit', function () {
   let ganttObj: Gantt;
   let bwData = [
       {
           TaskID: 1,
           TaskName: 'New Task 1',
           StartDate: new Date('05/22/2023'),
           EndDate: new Date('05/22/2023'),
           Progress: 59,
           Duration: 1,
       }
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: bwData,
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
               parentID: 'parentID',
               baselineStartDate: 'BaselineStartDate',
               baselineEndDate: 'BaselineEndDate'
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
               { field: 'Duration', headerText: 'Duration' },
               { field: 'Progress', headerText: 'Progress', allowFiltering: false },
               { field: 'CustomColumn', headerText: 'CustomColumn' }
           ],
           toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
               'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],

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
   afterAll(function () {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   beforeEach((done) => {
       setTimeout(done, 500);
       ganttObj.openEditDialog(1);
   });
   it('change start date', () => {
       ganttObj.actionComplete= (args) => {
           if (args.requestType == "save") {
               expect(ganttObj.timelineModule.timelineStartDate.getDate()).toBe(10);
           } 
       }
       let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
       SD.value = new Date('05/10/2023');
       SD.dataBind();
       let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
       triggerMouseEvent(saveRecord, 'click');
   });
});
describe('CR-861733-Action begin event arguments not working properly', () => {
   let ganttObj: Gantt;
   let editingData = [
       {
           TaskID: 1,
           TaskName: 'Project initiation',
           StartDate: new Date('04/02/2019'),
           EndDate: new Date('04/21/2019'),
       }
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: editingData,
           allowSorting: true,
       taskFields: {
           id: 'TaskID',
           name: 'TaskName',
           startDate: 'StartDate',
           endDate: 'EndDate',
           duration: 'Duration',
           progress: 'Progress',
           dependency: 'Predecessor',

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
       showColumnMenu: false,
       highlightWeekends: true,
       height: '550px',
       projectStartDate: new Date('03/25/2019'),
       projectEndDate: new Date('05/30/2019'),
       }, done);
   });
   afterAll(() => {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   beforeEach((done) => {
       setTimeout(done, 500);
       ganttObj.openEditDialog(1);
           let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
           tab.selectedItem = 1;
   });
   it('Checking args cancel value after actionbegin action', () => {
       ganttObj.actionBegin = (args) => {
           if (args.requestType === 'beforeOpenEditDialog' && args.rowData.TaskID == 1) {
               args.cancel = true;
           }
       }
       ganttObj.actionComplete = (args) => {
           expect(args.cancel).toBe(false); 
       }
   });
});
describe('provide support for custom dialog modal for custom column', () => {
   let ganttObj: Gantt;
   let editingData = [
       {
           TaskID: 1,
           TaskName: 'Project initiation',
           StartDate: new Date('04/02/2019'),
           EndDate: new Date('04/21/2019'),
       }
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: editingData,
           allowSorting: true,
       taskFields: {
           id: 'TaskID',
           name: 'TaskName',
           startDate: 'StartDate',
           endDate: 'EndDate',
           duration: 'Duration',
           progress: 'Progress',
           dependency: 'Predecessor',

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
       showColumnMenu: false,
       highlightWeekends: true,
       height: '550px',
       projectStartDate: new Date('03/25/2019'),
       projectEndDate: new Date('05/30/2019'),
           editDialogFields: [
               { type: 'General', fields: ["TaskID", "TaskName", "newinput", "newinput1"] },
               {
                   type: 'Dependency', additionalParams: {
                       allowPaging: true, allowSorting: true, toolbar: ["Search", "Print",]
                   }
               },
               { type: 'Resources', additionalParams: { allowSorting: true, allowPaging: true, toolbar: ["Search", "Print"], columns: [{ field: "newdata" }] } },
               {
                   type: 'Notes', additionalParams: {
                       inlineMode: {
                           enable: true,
                           onSelection: true
                       }
                   }
               },
               {
                   type: "Segments", additionalParams: {

                       columns: [{ field: "segmenttask", width: "170px", headerText: "Segment Task" }],
                   }
               }
           ],
       }, done);
   });
   afterAll(() => {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it(' actionbegin action with edittab', () => {
       ganttObj.openEditDialog(1);
       ganttObj.actionComplete = (args) => {
    
           let  print = document.getElementById("ganttContainerDependencyTabContainer_print")
           let  button  = document.getElementById("ganttContainerDependencyTabContainer_searchbar")
           expect(!isNullOrUndefined(print)).toBe(true);
           expect(!isNullOrUndefined(button)).toBe(true);
       }
   });
});
describe('provide support for custom dialog modal for custom column', () => {
   let ganttObj: Gantt;
   let editingData = [
       {
           TaskID: 1,
           TaskName: 'Project initiation',
           StartDate: new Date('04/02/2019'),
           EndDate: new Date('04/21/2019'),
       }
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: editingData,
           allowSorting: true,
       taskFields: {
           id: 'TaskID',
           name: 'TaskName',
           startDate: 'StartDate',
           endDate: 'EndDate',
           duration: 'Duration',
           progress: 'Progress',
           dependency: 'Predecessor',

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
       showColumnMenu: false,
       highlightWeekends: true,
       height: '550px',
       projectStartDate: new Date('03/25/2019'),
       projectEndDate: new Date('05/30/2019'),
           addDialogFields: [
               { type: 'General', headerText: 'General edit', fields: ["TaskID", "TaskName", "newinput", "newinput1"] },
               {
                   type: 'Dependency', additionalParams: {
                       allowPaging: true, allowSorting: true, toolbar: ["Search", "Print",]
                   }
               },
               { type: 'Resources', additionalParams: { allowSorting: true, allowPaging: true, toolbar: ["Search", "Print"], columns: [{ field: "newdata" }] } },
               {
                   type: 'Notes', additionalParams: {
                       inlineMode: {
                           enable: true,
                           onSelection: true
                       }
                   }
               },
               {
                   type: "Segments", additionalParams: {

                       columns: [{ field: "segmenttask", width: "170px", headerText: "Segment Task" }],
                   }
               }
           ],
       }, done);
   });
   afterAll(() => {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it(' actionbegin action with add tab', () => {
       ganttObj.openAddDialog();
       ganttObj.actionComplete = (args) => {
           let  print = document.getElementById("ganttContainerDependencyTabContainer_print")
           let  button  = document.getElementById("ganttContainerDependencyTabContainer_searchbar")
           expect(!isNullOrUndefined(print)).toBe(true);
           expect(!isNullOrUndefined(button)).toBe(true);
       }
   });
});
describe('provide support for custom dialog modal for custom column', () => {
   let ganttObj: Gantt;
   let editingData = [
       {
           TaskID: 1,
           TaskName: 'Project initiation',
           StartDate: new Date('04/02/2019'),
           EndDate: new Date('04/21/2019'),
       }
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: editingData,
           allowSorting: true,
       taskFields: {
           id: 'TaskID',
           name: 'TaskName',
           startDate: 'StartDate',
           endDate: 'EndDate',
           duration: 'Duration',
           progress: 'Progress',
           dependency: 'Predecessor',

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
       showColumnMenu: false,
       highlightWeekends: true,
       height: '550px',
       projectStartDate: new Date('03/25/2019'),
       projectEndDate: new Date('05/30/2019'),
           editDialogFields: [
               { type: 'General', headerText: 'General edit', fields: ["TaskID", "TaskName", "newinput", "newinput1"] },
               {
                   type: 'Dependency', additionalParams: {
                       allowPaging: true, allowSorting: true, toolbar: ["Search", "Print",]
                   }
               },
               { type: 'Resources', additionalParams: { allowSorting: true, allowPaging: true, toolbar: ["Search", "Print"], columns: [{ field: "newdata" }] } },
               {
                   type: 'Notes', additionalParams: {
                       inlineMode: {
                           enable: true,
                           onSelection: true
                       }
                   }
               },
               {
                   type: "Segments", additionalParams: {

                       columns: [{ field: "segmenttask", width: "170px", headerText: "Segment Task" }],
                   }
               }
           ],
       }, done);
   });
   afterAll(() => {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it(' actionbegin action without add tab', () => {
       ganttObj.openAddDialog();
       ganttObj.actionComplete = (args) => {
           let  print = document.getElementById("ganttContainerDependencyTabContainer_print")
           let  button  = document.getElementById("ganttContainerDependencyTabContainer_searchbar")
           expect(!isNullOrUndefined(print)).toBe(false);
           expect(!isNullOrUndefined(button)).toBe(false);
       }
   });
});
describe('provide support for custom dialog modal for custom column', () => {
   let ganttObj: Gantt;
   let editingData = [
       {
           TaskID: 1,
           TaskName: 'Project initiation',
           StartDate: new Date('04/02/2019'),
           EndDate: new Date('04/21/2019'),
       }
   ];
   beforeAll(function (done) {
       ganttObj = createGantt({
           dataSource: editingData,
           allowSorting: true,
       taskFields: {
           id: 'TaskID',
           name: 'TaskName',
           startDate: 'StartDate',
           endDate: 'EndDate',
           duration: 'Duration',
           progress: 'Progress',
           dependency: 'Predecessor',

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
       showColumnMenu: false,
       highlightWeekends: true,
       height: '550px',
       projectStartDate: new Date('03/25/2019'),
       projectEndDate: new Date('05/30/2019'),
          addDialogFields: [
               { type: 'General', headerText: 'General edit', fields: ["TaskID", "TaskName", "newinput", "newinput1"] },
               {
                   type: 'Dependency', additionalParams: {
                       allowPaging: true, allowSorting: true, toolbar: ["Search", "Print",]
                   }
               },
               { type: 'Resources', additionalParams: { allowSorting: true, allowPaging: true, toolbar: ["Search", "Print"], columns: [{ field: "newdata" }] } },
               {
                   type: 'Notes', additionalParams: {
                       inlineMode: {
                           enable: true,
                           onSelection: true
                       }
                   }
               },
               {
                   type: "Segments", additionalParams: {

                       columns: [{ field: "segmenttask", width: "170px", headerText: "Segment Task" }],
                   }
               }
           ],
       }, done);
   });
   afterAll(() => {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it(' actionbegin action  without edittab', (done: Function) => {
       ganttObj.openEditDialog(1);
       ganttObj.actionComplete = (args) => {
    
           let  print = document.getElementById("ganttContainerDependencyTabContainer_print")
           let  button  = document.getElementById("ganttContainerDependencyTabContainer_searchbar")
           expect(!isNullOrUndefined(print)).toBe(false);
           expect(!isNullOrUndefined(button)).toBe(false);
       }
       done();
   });
});
describe('Bug-870350: Editing resource allocation differed from initial rendering.', () => {
   let ganttObj: Gantt;
   beforeAll((done: Function) => {
       ganttObj = createGantt({
           dataSource: [
               {
                   TaskID: 1,
                   TaskName: 'Project initiation',
                   StartDate: new Date('03/29/2019'),
                   EndDate: new Date('04/21/2019'),
                   subtasks: [
                       {
                           TaskID: 220,
                           TaskName: 'w0 - 50/75',
                           StartDate: new Date('03/29/2019'),
                           Duration: 1,
                           Progress: 30,
                           work: 0,
                           schedulingType: 'FixedDuration',
                           resources: [
                               { resourceId: 1, unit: 50 },
                               { resourceId: 2, unit: 75 },
                           ],
                       },
                       {
                           TaskID: 221,
                           TaskName: 'w10 - 50/75',
                           StartDate: new Date('03/29/2019'),
                           Duration: 1,
                           Progress: 30,
                           work: 10,
                           schedulingType: 'FixedDuration',
                           resources: [
                               { resourceId: 1, unit: 50 },
                               { resourceId: 2, unit: 75 },
                           ],
                       },
                       {
                           TaskID: 222,
                           TaskName: 'w10 - 50/75',
                           StartDate: new Date('03/29/2019'),
                           Duration: 1,
                           Progress: 30,
                           work: 10,
                           schedulingType: 'FixedDuration',
                           resources: [
                               { resourceId: 1, unit: 0 },
                               { resourceId: 2, unit: 150 },
                           ],
                       },
                   ],
               },
           ],
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
               type: 'schedulingType',
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
               unit: 'unit',
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
             highlightWeekends: true,
             columns: [
               { field: 'TaskID', visible: false },
               { field: 'TaskName', headerText: 'Task Name', width: '100' },
               { field: 'resources', headerText: 'Resources', width: '200' },
               { field: 'work', width: '100' },
               { field: 'Duration', width: '100' },
               //{ field: 'schedulingType', headerText: 'Sched Type', width: '100' },
               { field: 'taskType', headerText: 'Task Type', width: '100' },
             ],
             editDialogFields: [
               {
                 type: 'General',
                 headerText: 'General',
                 fields: [
                   'TaskID',
                   'TaskName',
                   'StartDate',
                   'Duration',
                   'Progress',
                   'Predecessor',
                   'work',
                   'schedulingType',
                 ],
               },
               { type: 'Dependency' },
               { type: 'Resources' },
               { type: 'Custom' },
             ],
             labelSettings: {
               rightLabel: 'resources',
             },
             splitterSettings: {
               columnIndex: 5,
             },
             taskType: 'FixedDuration',
             projectStartDate: new Date('03/28/2019'),
             projectEndDate: new Date('07/28/2019'),
         
       }, done);
   });
   afterAll(() => {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   it('Editing resource allocation differed from initial rendering.', () => {
       expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(10);
   });
});
describe('Dialog editing - predecessor Tab with decimal', () => {
   let ganttObj: Gantt;
   beforeAll((done: Function) => {
       ganttObj = createGantt({
           dataSource: [{
               TaskID: 1,
               TaskName: 'Product Concept',
               StartDate: new Date('04/02/2019'),
               EndDate: new Date('04/21/2019'),
               subtasks: [
                   { TaskID: 2, TaskName: 'Defining the product and its usage', BaselineStartDate: new Date('04/02/2019'), BaselineEndDate: new Date('04/06/2019'), StartDate: new Date('04/02/2019'), Duration: 3,Progress: 30 },
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
           },],
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
           projectStartDate: new Date('03/25/2019'),
           projectEndDate: new Date('05/30/2019'),
       }, done);
   });
   afterAll(() => {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   beforeEach((done: Function) => {
       setTimeout(done, 500);
       ganttObj.openAddDialog();
       let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
       tab.selectedItem = 1;
       tab.dataBind();
   });
   it('Dependency tab editing with decimal', () => {
       ganttObj.actionBegin = (args: any): void => {
          if (args.requestType == "beforeAdd") {
              expect(args.data.ganttProperties.predecessor[0].offset).toBe(-2.5)
          }
       }
       let addIcon: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems').querySelector('#Gantt_0DependencyTabContainer_add') as HTMLElement;
       triggerMouseEvent(addIcon, 'click');
       let inputElement: HTMLElement = document.getElementById(ganttObj.element.id + 'DependencyTabContainername') as HTMLElement;
       if (inputElement) {
           let input :any = (<EJ2Instance>inputElement).ej2_instances[0];
           input.value = "1-Product Concept";
           input.dataBind();
           let idInput: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'DependencyTabContainerid')).ej2_instances[0];
           idInput.value = "1";
           idInput.dataBind();
           let offset: any = (<EJ2Instance>document.getElementById('Gantt_0DependencyTabContaineroffset')).ej2_instances[0];
           offset.value = "-2.5 days";
           offset.dataBind();
           let toolbar: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'DependencyTabContainer_toolbarItems') as HTMLElement;
           triggerMouseEvent(toolbar, 'click');
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
       }
   });
});
describe('CR-875373:Start date defaulting to incorrect value when remove the startDate in add dialog issues', function () {
   let ganttObj: Gantt;
   beforeAll(function (done) {
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
           allowSorting: true,
           allowSelection: true,
           taskFields: {
               id: 'TaskID',
               name: 'TaskName',
               startDate: 'StartDate',
               duration: 'Duration',
               progress: 'Progress',
               endDate: 'EndDate',
               child: 'subtasks',
           },
           editSettings: {
               allowAdding: true,
               allowEditing: true,
               allowDeleting: true,
               allowTaskbarEditing: true,
               showDeleteConfirmDialog: true
           },
           toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Indent', 'Outdent'],
       }, done);
   });
   afterAll(function () {
      if (ganttObj) {
             destroyGantt(ganttObj);
         }
   })
it('Verifying endDate after dialog add without startDate', () => {
       ganttObj.openAddDialog();
       let startDate: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
       startDate.value = '';
       startDate.dataBind();
       let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
       triggerMouseEvent(saveRecord, 'click');
       expect(ganttObj.getFormatedDate(ganttObj.flatData[0].ganttProperties.endDate, 'M/d/yyyy')).toEqual('4/2/2019');
   });
});
 describe('Duration column Dialog editing with decimal', () => {
   let ganttObj: Gantt;
   let numericParams = { params: { decimals: 2 } };
   beforeAll((done: Function) => {
       ganttObj = createGantt({
           dataSource: [{ TaskID: 5, TaskName: 'Concept Approval', StartDate: new Date('04/02/2019'), Duration: 1 }],
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
           { field: 'Duration', headerText: 'Duration',edit:numericParams,editType:'numericedit' },
           { field: 'Progress', headerText: 'Progress', allowFiltering: false },
           { field: 'CustomColumn', headerText: 'CustomColumn' }
       ],
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
       projectEndDate: new Date('05/30/2019'),
       }, done);
   });
   afterAll(() => {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   beforeEach((done: Function) => {
       setTimeout(done, 500);
       ganttObj.openEditDialog('5');
   });
   it('editing with decimal', () => {
       ganttObj.actionComplete = (args: any): void => {
          if (args.requestType == "save") {
              expect(args.data.ganttProperties.duration).toBe(0.25)
          }
       }
       let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
       if (durationField) {
           let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
           textObj.value = '0.25';
           textObj.dataBind();
           let save: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
           triggerMouseEvent(save, 'click');
       }
   });
});
describe('Add new record with validation rule', () => {
   let ganttObj: Gantt;
   beforeAll((done: Function) => {
       ganttObj = createGantt({
           dataSource: [],
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
               {
                   field: 'CustomColumn', headerText: 'CustomColumn', editType: 'numericedit', validationRules: {
                       number: true,
                       min: 20, required: true
                   }
               }
           ],
           editDialogFields: [
               { type: 'General', headerText: 'General' },
               { type: 'Dependency' },
               { type: 'Resources' },
               { type: 'Notes' }
           ],
           addDialogFields: [
               { type: 'General', headerText: 'General',fields:['TaskID','TaskName','CustomColumn'] },
               { type: 'Dependency' },
               { type: 'Resources' },
               { type: 'Notes' }
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
               type: 'Excel'
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
   beforeEach((done: Function) => {
       setTimeout(done, 500);
       ganttObj.openAddDialog();
   });
   it('add record', () => {
       ganttObj.actionComplete = (args: any): void => {
           if (args.requestType == "refresh") {
               expect(ganttObj.currentViewData.length).toBe(0);
           }
       }
       let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
       triggerMouseEvent(saveRecord, 'click');
   });
});
describe('Edit cell with timeline virtualization', () => {
   let ganttObj: Gantt;
   let SelfReferenceData = [
       { TaskID: 1, TaskName: 'Project Initiation', StartDate: new Date('04/02/2019'), EndDate: new Date('04/21/2019'), Notes: 'xxxxx' },
       { TaskID: 2, TaskName: 'Identify Site location Empty note', StartDate: new Date('03/29/2019'), Duration: 4, Progress: 50, ParentId: 1, Notes: '' },
       { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50, ParentId: 1 },
       { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50, Predecessor: '2', ParentId: 1 },
       { TaskID: 5, TaskName: 'Project Estimation', StartDate: new Date('04/02/2019'), EndDate: new Date('04/21/2019') },
       { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50, ParentId: 5 },
       { TaskID: 7, TaskName: 'List materials_info', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50, ParentId: 5, Notes: 'yyyyyyy' },
       { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50, ParentId: 5 }
   ];
   beforeAll((done: Function) => {
       ganttObj = createGantt(
           {
               dataSource: SelfReferenceData,
       enableTimelineVirtualization: true,
       allowExcelExport: true,
       height: '450px',
       enableImmutableMode: true,
       highlightWeekends: true,
       allowResizing: true,
       showColumnMenu: true,
       allowFiltering: true,
       allowSorting: true,
       allowReordering: true,
       allowRowDragAndDrop: true,
       taskFields: {
           id: 'TaskID',
           name: 'TaskName',
           startDate: 'StartDate',
           endDate: 'EndDate',
           duration: 'Duration',
           progress: 'Progress',
           dependency: 'Predecessor',
           notes: 'Notes',
           parentID: 'ParentId'
       },
       editSettings: {
           allowAdding: true,
           allowEditing: true,
           allowDeleting: true,
           allowTaskbarEditing: true,
           showDeleteConfirmDialog: true
       },
       editDialogFields: [
           { type: 'General' },
           { type: 'Dependency' },
           { type: 'Notes' },
       ],
       treeColumnIndex: 1,
       toolbar: ['Add', 'Edit', 'Delete', 'CriticalPath', 'ExcelExport', 'PdfExport', { text: 'Quick Filter', id: 'Quick Filter' }, { text: 'Clear Filter', id: 'Clear Filter' }],
       columns: [
           { field: 'TaskID', width: 50 },
           { field: 'TaskName', width: 250 },
           { field: 'StartDate' },
           { field: 'EndDate' },
           { field: 'Duration' },
           { field: 'Predecessor' },
           { field: 'Progress' },
           { field: 'Notes' },
       ],
       selectionSettings: {
           type: 'Multiple'
       },
       splitterSettings: {
           columnIndex: 4
       },
       enableContextMenu: true,
       projectStartDate: new Date('03/24/2019'),
           projectEndDate: new Date('07/06/2019')
           }, done);
   });
   afterAll(() => {
       if (ganttObj) {
           destroyGantt(ganttObj);
       }
   });
   beforeEach((done: Function) => {
       ganttObj.openEditDialog(1);
       setTimeout(done, 500);
   });
   it('edit start date cell', () => {
       ganttObj.actionComplete = (args: any): void => {
           if(args.action === "DialogEditing")
           expect(ganttObj.getFormatedDate(ganttObj.timelineModule.timelineEndDate, 'MM/dd/yyyy')).toBe('04/07/2024');
       };
       let StartDate: any = document.querySelector('#' + ganttObj.element.id + 'StartDate') as HTMLInputElement;
       if (StartDate) {
           let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
           SD.value = new Date('03/22/2024');
           SD.dataBind();
           let save: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[0] as HTMLElement;
           triggerMouseEvent(save, 'click');
       }
   });
});
describe('Validation Rule with change in taskfield and column', () => {
    let ganttObj: Gantt;
    const logTimeValidation = {
        number: true,
        min: 0,
    };
    const estimatedTimeValidation = {
        number: true,
        min: 0,
    };
    beforeAll((done: Function) => {
        ganttObj = createGantt({
            dataSource: [],
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
                notes: 'info',
                resourceInfo: 'resources',
            },
            editDialogFields: [
                { type: 'General', headerText: 'General' },
            ],
            addDialogFields: [
                { type: 'General', headerText: 'General', },
            ],
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
                { field: 'TaskID' },
                { field: 'TaskName' },
                { field: 'StartDate' },
                {
                    field: 'estimatedTime', editType:'numericedit',format: "yMd",validationRules: {estimatedTimeValidation}
                },
                {
                    field: 'logTime', editType:'numericedit', format: "yMd",validationRules: {logTimeValidation}
                },
            ],
            toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
            'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
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
                { resourceId: 12, resourceName: 'Construction Supervisor' }
            ],
            allowUnscheduledTasks: true,
        }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach(() => {
	   ganttObj.openAddDialog();
    });
    it('add record', () => {
        ganttObj.actionComplete = (args: any): void => {
            if (args.requestType == "refresh") {
                expect(ganttObj.currentViewData.length).toBe(1);
            }
        }
        let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        triggerMouseEvent(saveRecord, 'click');
    });
});
    describe('Split task-875295:Console error occurs when try to save with one day duration in segments', () => {
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
                    toolbar: ['Add', 'Edit', 'Delete'],
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
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Verifying with one day segment', () => {
            let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
            triggerMouseEvent(add, 'click');
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 2;
            tab.dataBind();
            let addIcon: HTMLElement = document.querySelector("#"+ganttObj.element.id +"SegmentsTabContainer_toolbarItems > div > div.e-toolbar-right > div:nth-child(1)");
            addIcon.click();
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(1);
        });
    });
    describe('Dialog Edit-882368:Dialog editing is not working properly', () => {
        let ganttObj: Gantt;
        let dataSource = [
            {
                taskId: 1,
                taskName: 'Grava',
                propertyModelActivityId: 2,
                actualStartDate: '2021-12-08T00:00:00',
                actualEndDate: '2024-04-01T00:00:00',
                basePlanStartDate: '23/12/2021 (IST)',
                basePlanEndDate: '12/10/2024 (IST)',
                revisionNo: 1,
                subTasks: [
                    {
                        taskId: 2,
                        blockId: 1,
                        parentId: 1,
                        taskName: 'TOWER 10',
                        startDate: '2021-12-23T00:00:00',
                        endDate: '2024-09-12T00:00:00',
                        propertyModelActivityId: 3,
                        actualStartDate: '2021-12-08T00:00:00',
                        actualEndDate: '2024-04-01T00:00:00',
                        basePlanStartDate: '23/12/2021 (IST)',
                        basePlanEndDate: '03/09/2024 (IST)',
                        revisionNo: 1,
                        subTasks: [
                            {
                                taskId: 3,
                                blockId: 1,
                                siteDrawingTypeId: 1,
                                parentId: 2,
                                taskName: 'Structural',
                                startDate: '2021-12-23T00:00:00',
                                endDate: '2024-09-12T00:00:00',
                                propertyModelActivityId: 4,
                                actualStartDate: '2021-12-08T00:00:00',
                                actualEndDate: '2024-04-01T00:00:00',
                                basePlanStartDate: '23/12/2021 (IST)',
                                basePlanEndDate: '03/09/2024 (IST)',
                                revisionNo: 1,
                                subTasks: [
                                    {
                                        taskId: 9,
                                        blockId: 1,
                                        floorId: 1,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-B07',
                                        startDate: '2021-12-23T00:00:00',
                                        endDate: '2022-04-16T00:00:00',
                                        propertyModelActivityId: 10,
                                        
                                        actualStartDate: '2021-12-08T00:00:00',
                                        actualEndDate: '2022-08-17T00:00:00',
                                        
                                       
                                        basePlanStartDate: '23/12/2021 (IST)',
                                        basePlanEndDate: '16/04/2022 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 15,
                                                blockId: 1,
                                                floorId: 1,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 10,
                                                modelActivityName: 'FDL Jump Lift and Service lift area',
                                                parentId: 9,
                                                taskName: 'FDL Jump Lift and Service lift area',
                                                startDate: '2021-12-23T00:00:00',
                                                endDate: '2021-12-23T00:00:00',
                                                propertyModelActivityId: 16,
                                                
                                                actualStartDate: '2021-12-08T00:00:00',
                                                actualEndDate: '2022-01-12T00:00:00',
                                                
                                               
                                                basePlanStartDate: '23/12/2021 (IST)',
                                                basePlanEndDate: '17/01/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '36 days',
                                                id: 5,
                                            },
                                            {
                                                taskId: 16,
                                                blockId: 1,
                                                floorId: 1,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 11,
                                                modelActivityName: 'FDL Isolated Footing',
                                                parentId: 9,
                                                taskName: 'FDL Isolated Footing',
                                                startDate: '2021-12-23T00:00:00',
                                                endDate: '2021-12-23T00:00:00',
                                                propertyModelActivityId: 17,
                                                
                                                actualStartDate: '2021-12-08T00:00:00',
                                                actualEndDate: '2021-02-10T00:00:00',
                                                
                                               
                                                basePlanStartDate: '23/12/2021 (IST)',
                                                basePlanEndDate: '23/12/2021 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '302 days',
                                                id: 6,
                                            },
                                            {
                                                taskId: 17,
                                                blockId: 1,
                                                floorId: 1,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 9,
                                                taskName: 'CIS walls casting',
                                                startDate: '2021-12-24T00:00:00',
                                                endDate: '2022-02-07T00:00:00',
                                                propertyModelActivityId: 18,
                                                
                                                actualStartDate: '2022-01-03T00:00:00',
                                                actualEndDate: '2022-03-19T00:00:00',
                                                
                                               
                                                basePlanStartDate: '24/12/2021 (IST)',
                                                basePlanEndDate: '07/02/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '76 days',
                                                id: 7,
                                            },
                                            {
                                                taskId: 18,
                                                blockId: 1,
                                                floorId: 1,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 12,
                                                modelActivityName: 'FDL Raft',
                                                parentId: 9,
                                                taskName: 'FDL Raft',
                                                startDate: '2021-12-29T00:00:00',
                                                endDate: '2022-02-10T00:00:00',
                                                propertyModelActivityId: 19,
                                                
                                                actualStartDate: '2021-12-08T00:00:00',
                                                actualEndDate: '2022-01-18T00:00:00',
                                                
                                               
                                                basePlanStartDate: '29/12/2021 (IST)',
                                                basePlanEndDate: '10/02/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '42 days',
                                                id: 8,
                                            },
                                            {
                                                taskId: 19,
                                                blockId: 1,
                                                floorId: 1,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 13,
                                                modelActivityName: 'FDL SubSoil Drainage & Grade Slab',
                                                parentId: 9,
                                                taskName: 'FDL SubSoil Drainage & Grade Slab',
                                                startDate: '2022-01-19T00:00:00',
                                                endDate: '2022-04-16T00:00:00',
                                                propertyModelActivityId: 20,
                                                
                                                actualStartDate: '2022-02-10T00:00:00',
                                                actualEndDate: '2022-08-17T00:00:00',
                                                
                                               
                                                basePlanStartDate: '19/01/2022 (IST)',
                                                basePlanEndDate: '16/04/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '189 days',
                                                id: 9,
                                            },
                                        ],
                                        actualDuration: '253 days',
                                        id: 4,
                                    },
                                    {
                                        taskId: 22,
                                        blockId: 1,
                                        floorId: 42,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-B06',
                                        startDate: '2022-02-02T00:00:00',
                                        endDate: '2022-05-16T00:00:00',
                                        propertyModelActivityId: 23,
                                        
                                        actualStartDate: '2022-02-17T00:00:00',
                                        actualEndDate: '2022-05-31T00:00:00',
                                        
                                       
                                        basePlanStartDate: '02/02/2022 (IST)',
                                        basePlanEndDate: '16/05/2022 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 30,
                                                blockId: 1,
                                                floorId: 42,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 22,
                                                taskName: 'CIS walls casting',
                                                startDate: '2022-02-02T00:00:00',
                                                endDate: '2022-04-15T00:00:00',
                                                propertyModelActivityId: 31,
                                                
                                                actualStartDate: '2022-03-09T00:00:00',
                                                actualEndDate: '2022-04-18T00:00:00',
                                                
                                               
                                                basePlanStartDate: '02/02/2022 (IST)',
                                                basePlanEndDate: '15/04/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '41 days',
                                                id: 11,
                                            },
                                            {
                                                taskId: 31,
                                                blockId: 1,
                                                floorId: 42,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 22,
                                                taskName: 'CIS Column casting',
                                                startDate: '2022-03-16T00:00:00',
                                                endDate: '2022-04-15T00:00:00',
                                                propertyModelActivityId: 32,
                                                
                                                actualStartDate: '2022-02-17T00:00:00',
                                                actualEndDate: '2022-04-18T00:00:00',
                                                
                                               
                                                basePlanStartDate: '16/03/2022 (IST)',
                                                basePlanEndDate: '15/04/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '61 days',
                                                id: 12,
                                            },
                                            {
                                                taskId: 32,
                                                blockId: 1,
                                                floorId: 42,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 22,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2022-03-29T00:00:00',
                                                endDate: '2022-05-11T00:00:00',
                                                propertyModelActivityId: 33,
                                                
                                                actualStartDate: '2022-03-11T00:00:00',
                                                actualEndDate: '2022-05-31T00:00:00',
                                                
                                               
                                                basePlanStartDate: '29/03/2022 (IST)',
                                                basePlanEndDate: '11/05/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '82 days',
                                                id: 13,
                                            },
                                            {
                                                taskId: 34,
                                                blockId: 1,
                                                floorId: 42,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 22,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2022-04-19T00:00:00',
                                                endDate: '2022-05-16T00:00:00',
                                                propertyModelActivityId: 35,
                                                
                                                actualStartDate: '2022-04-12T00:00:00',
                                                actualEndDate: '2022-04-28T00:00:00',
                                                
                                               
                                                basePlanStartDate: '19/04/2022 (IST)',
                                                basePlanEndDate: '16/05/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '17 days',
                                                id: 14,
                                            },
                                        ],
                                        actualDuration: '104 days',
                                        id: 10,
                                    },
                                    {
                                        taskId: 35,
                                        blockId: 1,
                                        floorId: 41,
                                        siteDrawingTypeId: 1,
                                        parentId: 3,
                                        taskName: 'Level-B05',
                                        startDate: '2022-05-02T00:00:00',
                                        endDate: '2022-06-21T00:00:00',
                                        propertyModelActivityId: 36,
                                        actualStartDate: '2022-04-14T00:00:00',
                                        actualEndDate: '2022-05-30T00:00:00',
                                        basePlanStartDate: '02/05/2022 (IST)',
                                        basePlanEndDate: '21/06/2022 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 41,
                                                blockId: 1,
                                                floorId: 41,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 35,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2022-05-02T00:00:00',
                                                endDate: '2022-05-12T00:00:00',
                                                propertyModelActivityId: 42,
                                                predecessor: '',
                                                actualStartDate: '2022-04-14T00:00:00',
                                                actualEndDate: '2022-05-05T00:00:00',
                                                displayPredecessor: '',
                                                basePlanStartDate: '02/05/2022 (IST)',
                                                basePlanEndDate: '12/05/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '22 days',
                                                id: 16,
                                            },
                                            {
                                                taskId: 42,
                                                blockId: 1,
                                                floorId: 41,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 35,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2022-05-02T00:00:00',
                                                endDate: '2022-05-16T00:00:00',
                                                propertyModelActivityId: 43,
                                                predecessor: '',
                                                actualStartDate: '2022-04-19T00:00:00',
                                                actualEndDate: '2022-05-20T00:00:00',
                                                displayPredecessor: '',
                                                basePlanStartDate: '02/05/2022 (IST)',
                                                basePlanEndDate: '16/05/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '32 days',
                                                id: 17,
                                            },
                                            {
                                                taskId: 43,
                                                blockId: 1,
                                                floorId: 41,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 35,
                                                taskName: 'CIS walls casting',
                                                startDate: '2022-05-18T00:00:00',
                                                endDate: '2022-06-19T00:00:00',
                                                propertyModelActivityId: 44,
                                                predecessor: '34FS+1',
                                                actualStartDate: '2022-04-30T00:00:00',
                                                actualEndDate: '2022-05-18T00:00:00',
                                                displayPredecessor: '34FS+1 day',
                                                basePlanStartDate: '18/05/2022 (IST)',
                                                basePlanEndDate: '19/06/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '19 days',
                                                id: 18,
                                            },
                                            {
                                                taskId: 44,
                                                blockId: 1,
                                                floorId: 41,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 35,
                                                taskName: 'CIS Column casting',
                                                startDate: '2022-05-07T00:00:00',
                                                endDate: '2022-05-26T00:00:00',
                                                propertyModelActivityId: 45,
                                                predecessor: '',
                                                actualStartDate: '2022-04-22T00:00:00',
                                                actualEndDate: '2022-05-11T00:00:00',
                                                displayPredecessor: '',
                                                basePlanStartDate: '07/05/2022 (IST)',
                                                basePlanEndDate: '26/05/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '20 days',
                                                id: 19,
                                            },
                                            {
                                                taskId: 45,
                                                blockId: 1,
                                                floorId: 41,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 35,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2022-05-17T00:00:00',
                                                endDate: '2022-06-09T00:00:00',
                                                propertyModelActivityId: 46,
                                                predecessor: '44FS-10,41FS,42FS',
                                                actualStartDate: '2022-05-02T00:00:00',
                                                actualEndDate: '2022-05-30T00:00:00',
                                                displayPredecessor: '44FS-10 days,41FS,42FS',
                                                basePlanStartDate: '17/05/2022 (IST)',
                                                basePlanEndDate: '09/06/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '29 days',
                                                id: 20,
                                            },
                                            {
                                                taskId: 47,
                                                blockId: 1,
                                                floorId: 41,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 35,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2022-06-02T00:00:00',
                                                endDate: '2022-06-21T00:00:00',
                                                propertyModelActivityId: 48,
                                                predecessor: '45SS+16,43FF-10',
                                                actualStartDate: '2022-05-17T00:00:00',
                                                actualEndDate: '2022-05-25T00:00:00',
                                                displayPredecessor: '45SS+16 days,43FF-10 days',
                                                basePlanStartDate: '02/06/2022 (IST)',
                                                basePlanEndDate: '21/06/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '9 days',
                                                id: 21,
                                            },
                                        ],
                                        actualDuration: '47 days',
                                        id: 15,
                                    },
                                    {
                                        taskId: 48,
                                        blockId: 1,
                                        floorId: 40,
                                        siteDrawingTypeId: 1,
                                        parentId: 3,
                                        taskName: 'Level-B04',
                                        startDate: '2022-06-12T00:00:00',
                                        endDate: '2022-07-21T00:00:00',
                                        propertyModelActivityId: 49,
                                        actualStartDate: '2022-05-22T00:00:00',
                                        actualEndDate: '2022-09-17T00:00:00',
                                        basePlanStartDate: '12/06/2022 (IST)',
                                        basePlanEndDate: '21/07/2022 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 54,
                                                blockId: 1,
                                                floorId: 40,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 48,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2022-06-12T00:00:00',
                                                endDate: '2022-06-24T00:00:00',
                                                propertyModelActivityId: 55,
                                                predecessor: '47SS+10',
                                                actualStartDate: '2022-05-23T00:00:00',
                                                actualEndDate: '2022-06-03T00:00:00',
                                                displayPredecessor: '47SS+10 days',
                                                basePlanStartDate: '12/06/2022 (IST)',
                                                basePlanEndDate: '24/06/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '12 days',
                                                id: 23,
                                            },
                                            {
                                                taskId: 55,
                                                blockId: 1,
                                                floorId: 40,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 48,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2022-06-12T00:00:00',
                                                endDate: '2022-06-26T00:00:00',
                                                propertyModelActivityId: 56,
                                                predecessor: '47SS+10',
                                                actualStartDate: '2022-05-23T00:00:00',
                                                actualEndDate: '2022-06-17T00:00:00',
                                                displayPredecessor: '47SS+10 days',
                                                basePlanStartDate: '12/06/2022 (IST)',
                                                basePlanEndDate: '26/06/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '26 days',
                                                id: 24,
                                            },
                                            {
                                                taskId: 56,
                                                blockId: 1,
                                                floorId: 40,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 48,
                                                taskName: 'CIS walls casting',
                                                startDate: '2022-06-13T00:00:00',
                                                endDate: '2022-07-05T00:00:00',
                                                propertyModelActivityId: 57,
                                                predecessor: '47SS+11',
                                                actualStartDate: '2022-06-02T00:00:00',
                                                actualEndDate: '2022-06-22T00:00:00',
                                                displayPredecessor: '47SS+11 days',
                                                basePlanStartDate: '13/06/2022 (IST)',
                                                basePlanEndDate: '05/07/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '21 days',
                                                id: 25,
                                            },
                                            {
                                                taskId: 57,
                                                blockId: 1,
                                                floorId: 40,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 48,
                                                taskName: 'CIS Column casting',
                                                startDate: '2022-06-14T00:00:00',
                                                endDate: '2022-07-03T00:00:00',
                                                propertyModelActivityId: 58,
                                                predecessor: '47SS+12',
                                                actualStartDate: '2022-05-22T00:00:00',
                                                actualEndDate: '2022-06-19T00:00:00',
                                                displayPredecessor: '47SS+12 days',
                                                basePlanStartDate: '14/06/2022 (IST)',
                                                basePlanEndDate: '03/07/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '29 days',
                                                id: 26,
                                            },
                                            {
                                                taskId: 58,
                                                blockId: 1,
                                                floorId: 40,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 48,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2022-06-19T00:00:00',
                                                endDate: '2022-07-12T00:00:00',
                                                propertyModelActivityId: 59,
                                                predecessor: '57FS-15',
                                                actualStartDate: '2022-05-24T00:00:00',
                                                actualEndDate: '2022-09-17T00:00:00',
                                                displayPredecessor: '57FS-15 days',
                                                basePlanStartDate: '19/06/2022 (IST)',
                                                basePlanEndDate: '12/07/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '117 days',
                                                id: 27,
                                            },
                                            {
                                                taskId: 60,
                                                blockId: 1,
                                                floorId: 40,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 48,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2022-07-02T00:00:00',
                                                endDate: '2022-07-21T00:00:00',
                                                propertyModelActivityId: 61,
                                                predecessor: '58SS+13,55FS,54FS',
                                                actualStartDate: '2022-06-12T00:00:00',
                                                actualEndDate: '2022-06-25T00:00:00',
                                                displayPredecessor: '58SS+13 days,55FS,54FS',
                                                basePlanStartDate: '02/07/2022 (IST)',
                                                basePlanEndDate: '21/07/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '14 days',
                                                id: 28,
                                            },
                                        ],
                                        actualDuration: '119 days',
                                        id: 22,
                                    },
                                    {
                                        taskId: 61,
                                        blockId: 1,
                                        floorId: 39,
                                        siteDrawingTypeId: 1,
                                        parentId: 3,
                                        taskName: 'Level-B03',
                                        startDate: '2022-07-10T00:00:00',
                                        endDate: '2022-08-20T00:00:00',
                                        propertyModelActivityId: 62,
                                        actualStartDate: '2022-06-16T00:00:00',
                                        actualEndDate: '2022-09-23T00:00:00',
                                        basePlanStartDate: '10/07/2022 (IST)',
                                        basePlanEndDate: '20/08/2022 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 68,
                                                blockId: 1,
                                                floorId: 39,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 61,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2022-07-10T00:00:00',
                                                endDate: '2022-07-24T00:00:00',
                                                propertyModelActivityId: 69,
                                                predecessor: '60SS+8',
                                                actualStartDate: '2022-06-17T00:00:00',
                                                actualEndDate: '2022-07-26T00:00:00',
                                                displayPredecessor: '60SS+8 days',
                                                basePlanStartDate: '10/07/2022 (IST)',
                                                basePlanEndDate: '24/07/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '40 days',
                                                id: 30,
                                            },
                                            {
                                                taskId: 67,
                                                blockId: 1,
                                                floorId: 39,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 61,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2022-07-10T00:00:00',
                                                endDate: '2022-07-22T00:00:00',
                                                propertyModelActivityId: 68,
                                                predecessor: '60SS+8',
                                                actualStartDate: '2022-06-16T00:00:00',
                                                actualEndDate: '2022-06-30T00:00:00',
                                                displayPredecessor: '60SS+8 days',
                                                basePlanStartDate: '10/07/2022 (IST)',
                                                basePlanEndDate: '22/07/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '15 days',
                                                id: 31,
                                            },
                                            {
                                                taskId: 69,
                                                blockId: 1,
                                                floorId: 39,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 61,
                                                taskName: 'CIS walls casting',
                                                startDate: '2022-07-11T00:00:00',
                                                endDate: '2022-08-02T00:00:00',
                                                propertyModelActivityId: 70,
                                                predecessor: '60SS+9',
                                                actualStartDate: '2022-06-25T00:00:00',
                                                actualEndDate: '2022-07-18T00:00:00',
                                                displayPredecessor: '60SS+9 days',
                                                basePlanStartDate: '11/07/2022 (IST)',
                                                basePlanEndDate: '02/08/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '24 days',
                                                id: 32,
                                            },
                                            {
                                                taskId: 70,
                                                blockId: 1,
                                                floorId: 39,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 61,
                                                taskName: 'CIS Column casting',
                                                startDate: '2022-07-12T00:00:00',
                                                endDate: '2022-07-31T00:00:00',
                                                propertyModelActivityId: 71,
                                                predecessor: '60SS+10',
                                                actualStartDate: '2022-06-21T00:00:00',
                                                actualEndDate: '2022-07-11T00:00:00',
                                                displayPredecessor: '60SS+10 days',
                                                basePlanStartDate: '12/07/2022 (IST)',
                                                basePlanEndDate: '31/07/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '21 days',
                                                id: 33,
                                            },
                                            {
                                                taskId: 71,
                                                blockId: 1,
                                                floorId: 39,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 61,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2022-07-19T00:00:00',
                                                endDate: '2022-08-11T00:00:00',
                                                propertyModelActivityId: 72,
                                                predecessor: '70FS-13',
                                                actualStartDate: '2022-06-25T00:00:00',
                                                actualEndDate: '2022-09-23T00:00:00',
                                                displayPredecessor: '70FS-13 days',
                                                basePlanStartDate: '19/07/2022 (IST)',
                                                basePlanEndDate: '11/08/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '91 days',
                                                id: 34,
                                            },
                                            {
                                                taskId: 73,
                                                blockId: 1,
                                                floorId: 39,
                                                siteDrawingTypeId: 1,
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 61,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2022-08-01T00:00:00',
                                                endDate: '2022-08-20T00:00:00',
                                                propertyModelActivityId: 74,
                                                predecessor: '71SS+13,67FS,68FS',
                                                actualStartDate: '2022-07-11T00:00:00',
                                                actualEndDate: '2022-07-22T00:00:00',
                                                displayPredecessor: '71SS+13 days,67FS,68FS',
                                                basePlanStartDate: '01/08/2022 (IST)',
                                                basePlanEndDate: '20/08/2022 (IST)',
                                                revisionNo: 1,
                                                actualDuration: '12 days',
                                                id: 35,
                                            },
                                        ],
                                        actualDuration: '100 days',
                                        id: 29,
                                    },
                                    {
                                        taskId: 74,
                                        blockId: 1,
                                        floorId: 38,
                                        siteDrawingTypeId: 1,
                                        parentId: 3,
                                        taskName: 'Level-B02',
                                        startDate: '2022-08-09T00:00:00',
                                        endDate: '2022-09-20T00:00:00',
                                        propertyModelActivityId: 75,
                                        actualStartDate: '2022-07-15T00:00:00',
                                        actualEndDate: '2022-08-18T00:00:00',
                                        basePlanStartDate: '09/08/2022 (IST)',
                                        basePlanEndDate: '20/09/2022 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 80,
                                                blockId: 1,
                                                floorId: 38,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 74,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2022-08-09T00:00:00',
                                                endDate: '2022-08-21T00:00:00',
                                                propertyModelActivityId: 81,
                                                predecessor: '73SS+8',
                                                actualStartDate: '2022-07-16T00:00:00',
                                                actualEndDate: '2022-07-27T00:00:00',
                                                
                                                displayPredecessor: '73SS+8 days',
                                                basePlanStartDate: '09/08/2022 (IST)',
                                                basePlanEndDate: '21/08/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '12 days',
                                                id: 37,
                                            },
                                            {
                                                taskId: 81,
                                                blockId: 1,
                                                floorId: 38,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 74,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2022-08-09T00:00:00',
                                                endDate: '2022-08-23T00:00:00',
                                                propertyModelActivityId: 82,
                                                predecessor: '73SS+8',
                                                actualStartDate: '2022-07-15T00:00:00',
                                                actualEndDate: '2022-07-30T00:00:00',
                                                
                                                displayPredecessor: '73SS+8 days',
                                                basePlanStartDate: '09/08/2022 (IST)',
                                                basePlanEndDate: '23/08/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '16 days',
                                                id: 38,
                                            },
                                            {
                                                taskId: 82,
                                                blockId: 1,
                                                floorId: 38,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 74,
                                                taskName: 'CIS walls casting',
                                                startDate: '2022-08-10T00:00:00',
                                                endDate: '2022-09-01T00:00:00',
                                                propertyModelActivityId: 83,
                                                predecessor: '73SS+9',
                                                actualStartDate: '2022-07-26T00:00:00',
                                                actualEndDate: '2022-08-12T00:00:00',
                                                
                                                displayPredecessor: '73SS+9 days',
                                                basePlanStartDate: '10/08/2022 (IST)',
                                                basePlanEndDate: '01/09/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '18 days',
                                                id: 39,
                                            },
                                            {
                                                taskId: 83,
                                                blockId: 1,
                                                floorId: 38,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 74,
                                                taskName: 'CIS Column casting',
                                                startDate: '2022-08-11T00:00:00',
                                                endDate: '2022-08-30T00:00:00',
                                                propertyModelActivityId: 84,
                                                predecessor: '73SS+10',
                                                actualStartDate: '2022-07-19T00:00:00',
                                                actualEndDate: '2022-08-03T00:00:00',
                                                
                                                displayPredecessor: '73SS+10 days',
                                                basePlanStartDate: '11/08/2022 (IST)',
                                                basePlanEndDate: '30/08/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '16 days',
                                                id: 40,
                                            },
                                            {
                                                taskId: 84,
                                                blockId: 1,
                                                floorId: 38,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 74,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2022-08-19T00:00:00',
                                                endDate: '2022-09-11T00:00:00',
                                                propertyModelActivityId: 85,
                                                predecessor: '83FS-12',
                                                actualStartDate: '2022-07-23T00:00:00',
                                                actualEndDate: '2022-08-17T00:00:00',
                                                
                                                displayPredecessor: '83FS-12 days',
                                                basePlanStartDate: '19/08/2022 (IST)',
                                                basePlanEndDate: '11/09/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '26 days',
                                                id: 41,
                                            },
                                            {
                                                taskId: 86,
                                                blockId: 1,
                                                floorId: 38,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 74,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2022-09-01T00:00:00',
                                                endDate: '2022-09-20T00:00:00',
                                                propertyModelActivityId: 87,
                                                predecessor: '84SS+13,80FS,81FS',
                                                actualStartDate: '2022-08-05T00:00:00',
                                                actualEndDate: '2022-08-18T00:00:00',
                                                
                                                displayPredecessor: '84SS+13 days,80FS,81FS',
                                                basePlanStartDate: '01/09/2022 (IST)',
                                                basePlanEndDate: '20/09/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '14 days',
                                                id: 42,
                                            },
                                        ],
                                        actualDuration: '35 days',
                                        id: 36,
                                    },
                                    {
                                        taskId: 87,
                                        blockId: 1,
                                        floorId: 37,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-B01',
                                        startDate: '2022-09-09T00:00:00',
                                        endDate: '2022-10-20T00:00:00',
                                        propertyModelActivityId: 88,
                                        
                                        actualStartDate: '2022-08-08T00:00:00',
                                        actualEndDate: '2022-09-23T00:00:00',
                                        
                                       
                                        basePlanStartDate: '09/09/2022 (IST)',
                                        basePlanEndDate: '20/10/2022 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 93,
                                                blockId: 1,
                                                floorId: 37,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 87,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2022-09-09T00:00:00',
                                                endDate: '2022-09-21T00:00:00',
                                                propertyModelActivityId: 94,
                                                predecessor: '86SS+8',
                                                actualStartDate: '2022-08-08T00:00:00',
                                                actualEndDate: '2022-08-22T00:00:00',
                                                
                                                displayPredecessor: '86SS+8 days',
                                                basePlanStartDate: '09/09/2022 (IST)',
                                                basePlanEndDate: '21/09/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '15 days',
                                                id: 44,
                                            },
                                            {
                                                taskId: 94,
                                                blockId: 1,
                                                floorId: 37,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 87,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2022-09-09T00:00:00',
                                                endDate: '2022-09-23T00:00:00',
                                                propertyModelActivityId: 95,
                                                predecessor: '86SS+8',
                                                actualStartDate: '2022-08-09T00:00:00',
                                                actualEndDate: '2022-08-23T00:00:00',
                                                
                                                displayPredecessor: '86SS+8 days',
                                                basePlanStartDate: '09/09/2022 (IST)',
                                                basePlanEndDate: '23/09/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '15 days',
                                                id: 45,
                                            },
                                            {
                                                taskId: 95,
                                                blockId: 1,
                                                floorId: 37,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 87,
                                                taskName: 'CIS walls casting',
                                                startDate: '2022-09-10T00:00:00',
                                                endDate: '2022-10-02T00:00:00',
                                                propertyModelActivityId: 96,
                                                predecessor: '86SS+9',
                                                actualStartDate: '2022-08-16T00:00:00',
                                                actualEndDate: '2022-09-01T00:00:00',
                                                
                                                displayPredecessor: '86SS+9 days',
                                                basePlanStartDate: '10/09/2022 (IST)',
                                                basePlanEndDate: '02/10/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '17 days',
                                                id: 46,
                                            },
                                            {
                                                taskId: 96,
                                                blockId: 1,
                                                floorId: 37,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 87,
                                                taskName: 'CIS Column casting',
                                                startDate: '2022-09-11T00:00:00',
                                                endDate: '2022-09-30T00:00:00',
                                                propertyModelActivityId: 97,
                                                predecessor: '86SS+10',
                                                actualStartDate: '2022-08-12T00:00:00',
                                                actualEndDate: '2022-08-30T00:00:00',
                                                
                                                displayPredecessor: '86SS+10 days',
                                                basePlanStartDate: '11/09/2022 (IST)',
                                                basePlanEndDate: '30/09/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '19 days',
                                                id: 47,
                                            },
                                            {
                                                taskId: 97,
                                                blockId: 1,
                                                floorId: 37,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 87,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2022-09-19T00:00:00',
                                                endDate: '2022-10-12T00:00:00',
                                                propertyModelActivityId: 98,
                                                predecessor: '96FS-12',
                                                actualStartDate: '2022-08-17T00:00:00',
                                                actualEndDate: '2022-09-23T00:00:00',
                                                
                                                displayPredecessor: '96FS-12 days',
                                                basePlanStartDate: '19/09/2022 (IST)',
                                                basePlanEndDate: '12/10/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '38 days',
                                                id: 48,
                                            },
                                            {
                                                taskId: 99,
                                                blockId: 1,
                                                floorId: 37,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 87,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2022-10-02T00:00:00',
                                                endDate: '2022-10-20T00:00:00',
                                                propertyModelActivityId: 100,
                                                predecessor: '97SS+13,93FS,94FS',
                                                actualStartDate: '2022-08-29T00:00:00',
                                                actualEndDate: '2022-09-09T00:00:00',
                                                
                                                displayPredecessor: '97SS+13 days,93FS,94FS',
                                                basePlanStartDate: '02/10/2022 (IST)',
                                                basePlanEndDate: '20/10/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '12 days',
                                                id: 49,
                                            },
                                        ],
                                        actualDuration: '47 days',
                                        id: 43,
                                    },
                                    {
                                        taskId: 100,
                                        blockId: 1,
                                        floorId: 36,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-MZ',
                                        startDate: '2022-10-10T00:00:00',
                                        endDate: '2022-11-20T00:00:00',
                                        propertyModelActivityId: 101,
                                        
                                        actualStartDate: '2022-09-06T00:00:00',
                                        actualEndDate: '2023-01-18T00:00:00',
                                        
                                       
                                        basePlanStartDate: '10/10/2022 (IST)',
                                        basePlanEndDate: '20/11/2022 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 108,
                                                blockId: 1,
                                                floorId: 36,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 100,
                                                taskName: 'CIS walls casting',
                                                startDate: '2022-10-11T00:00:00',
                                                endDate: '2022-10-25T00:00:00',
                                                propertyModelActivityId: 109,
                                                predecessor: '99SS+9',
                                                actualStartDate: '2022-09-06T00:00:00',
                                                actualEndDate: '2022-09-26T00:00:00',
                                                
                                                displayPredecessor: '99SS+9 days',
                                                basePlanStartDate: '11/10/2022 (IST)',
                                                basePlanEndDate: '25/10/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '21 days',
                                                id: 51,
                                            },
                                            {
                                                taskId: 107,
                                                blockId: 1,
                                                floorId: 36,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 100,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2022-10-10T00:00:00',
                                                endDate: '2022-10-24T00:00:00',
                                                propertyModelActivityId: 108,
                                                predecessor: '99SS+8',
                                                actualStartDate: '2022-09-06T00:00:00',
                                                actualEndDate: '2022-09-26T00:00:00',
                                                
                                                displayPredecessor: '99SS+8 days',
                                                basePlanStartDate: '10/10/2022 (IST)',
                                                basePlanEndDate: '24/10/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '21 days',
                                                id: 52,
                                            },
                                            {
                                                taskId: 106,
                                                blockId: 1,
                                                floorId: 36,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 100,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2022-10-10T00:00:00',
                                                endDate: '2022-10-22T00:00:00',
                                                propertyModelActivityId: 107,
                                                predecessor: '99SS+8',
                                                actualStartDate: '2022-09-06T00:00:00',
                                                actualEndDate: '2022-09-14T00:00:00',
                                                
                                                displayPredecessor: '99SS+8 days',
                                                basePlanStartDate: '10/10/2022 (IST)',
                                                basePlanEndDate: '22/10/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '9 days',
                                                id: 53,
                                            },
                                            {
                                                taskId: 110,
                                                blockId: 1,
                                                floorId: 36,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 100,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2022-10-21T00:00:00',
                                                endDate: '2022-11-13T00:00:00',
                                                propertyModelActivityId: 111,
                                                predecessor: '108FS-5',
                                                actualStartDate: '2022-09-13T00:00:00',
                                                actualEndDate: '2023-01-18T00:00:00',
                                                
                                                displayPredecessor: '108FS-5 days',
                                                basePlanStartDate: '21/10/2022 (IST)',
                                                basePlanEndDate: '13/11/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '128 days',
                                                id: 54,
                                            },
                                            {
                                                taskId: 112,
                                                blockId: 1,
                                                floorId: 36,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 100,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2022-11-03T00:00:00',
                                                endDate: '2022-11-20T00:00:00',
                                                propertyModelActivityId: 113,
                                                predecessor: '110SS+13,106FS,107FS',
                                                actualStartDate: '2022-10-08T00:00:00',
                                                actualEndDate: '2022-10-21T00:00:00',
                                                
                                                displayPredecessor: '110SS+13 days,106FS,107FS',
                                                basePlanStartDate: '03/11/2022 (IST)',
                                                basePlanEndDate: '20/11/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '14 days',
                                                id: 55,
                                            },
                                        ],
                                        actualDuration: '135 days',
                                        id: 50,
                                    },
                                    {
                                        taskId: 113,
                                        blockId: 1,
                                        floorId: 35,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-LG',
                                        startDate: '2022-11-11T00:00:00',
                                        endDate: '2023-01-05T00:00:00',
                                        propertyModelActivityId: 114,
                                        
                                        actualStartDate: '2022-09-06T00:00:00',
                                        actualEndDate: '2023-01-09T00:00:00',
                                        
                                       
                                        basePlanStartDate: '11/11/2022 (IST)',
                                        basePlanEndDate: '05/01/2023 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 121,
                                                blockId: 1,
                                                floorId: 35,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 113,
                                                taskName: 'CIS walls casting',
                                                startDate: '2022-11-12T00:00:00',
                                                endDate: '2023-01-04T00:00:00',
                                                propertyModelActivityId: 122,
                                                predecessor: '112SS+9',
                                                actualStartDate: '2022-10-14T00:00:00',
                                                actualEndDate: '2022-11-11T00:00:00',
                                                
                                                displayPredecessor: '112SS+9 days',
                                                basePlanStartDate: '12/11/2022 (IST)',
                                                basePlanEndDate: '04/01/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '29 days',
                                                id: 57,
                                            },
                                            {
                                                taskId: 122,
                                                blockId: 1,
                                                floorId: 35,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 113,
                                                taskName: 'CIS Column casting',
                                                startDate: '2022-11-13T00:00:00',
                                                endDate: '2022-12-02T00:00:00',
                                                propertyModelActivityId: 123,
                                                predecessor: '112SS+10',
                                                actualStartDate: '2022-09-06T00:00:00',
                                                actualEndDate: '2022-11-02T00:00:00',
                                                
                                                displayPredecessor: '112SS+10 days',
                                                basePlanStartDate: '13/11/2022 (IST)',
                                                basePlanEndDate: '02/12/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '58 days',
                                                id: 58,
                                            },
                                            {
                                                taskId: 120,
                                                blockId: 1,
                                                floorId: 35,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 113,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2022-11-11T00:00:00',
                                                endDate: '2022-12-20T00:00:00',
                                                propertyModelActivityId: 121,
                                                predecessor: '112SS+8',
                                                actualStartDate: '2022-09-10T00:00:00',
                                                actualEndDate: '2022-11-03T00:00:00',
                                                
                                                displayPredecessor: '112SS+8 days',
                                                basePlanStartDate: '11/11/2022 (IST)',
                                                basePlanEndDate: '20/12/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '55 days',
                                                id: 59,
                                            },
                                            {
                                                taskId: 119,
                                                blockId: 1,
                                                floorId: 35,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 113,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2022-11-11T00:00:00',
                                                endDate: '2022-11-23T00:00:00',
                                                propertyModelActivityId: 120,
                                                predecessor: '112SS+8',
                                                actualStartDate: '2022-09-21T00:00:00',
                                                actualEndDate: '2022-11-28T00:00:00',
                                                
                                                displayPredecessor: '112SS+8 days',
                                                basePlanStartDate: '11/11/2022 (IST)',
                                                basePlanEndDate: '23/11/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '69 days',
                                                id: 60,
                                            },
                                            {
                                                taskId: 123,
                                                blockId: 1,
                                                floorId: 35,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 113,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2022-11-21T00:00:00',
                                                endDate: '2022-12-10T00:00:00',
                                                propertyModelActivityId: 124,
                                                predecessor: '122FS-12',
                                                actualStartDate: '2022-10-07T00:00:00',
                                                actualEndDate: '2023-01-09T00:00:00',
                                                
                                                displayPredecessor: '122FS-12 days',
                                                basePlanStartDate: '21/11/2022 (IST)',
                                                basePlanEndDate: '10/12/2022 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '95 days',
                                                id: 61,
                                            },
                                            {
                                                taskId: 125,
                                                blockId: 1,
                                                floorId: 35,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 113,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2022-12-21T00:00:00',
                                                endDate: '2023-01-05T00:00:00',
                                                propertyModelActivityId: 126,
                                                predecessor: '123SS+8,119FS,120FS',
                                                actualStartDate: '2022-11-01T00:00:00',
                                                actualEndDate: '2022-11-15T00:00:00',
                                                
                                                displayPredecessor: '123SS+8 days,119FS,120FS',
                                                basePlanStartDate: '21/12/2022 (IST)',
                                                basePlanEndDate: '05/01/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '15 days',
                                                id: 62,
                                            },
                                        ],
                                        actualDuration: '126 days',
                                        id: 56,
                                    },
                                    {
                                        taskId: 126,
                                        blockId: 1,
                                        floorId: 34,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-UG',
                                        startDate: '2022-12-27T00:00:00',
                                        endDate: '2023-02-15T00:00:00',
                                        propertyModelActivityId: 127,
                                        
                                        actualStartDate: '2022-11-03T00:00:00',
                                        actualEndDate: '2023-04-14T00:00:00',
                                        
                                       
                                        basePlanStartDate: '27/12/2022 (IST)',
                                        basePlanEndDate: '15/02/2023 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 132,
                                                blockId: 1,
                                                floorId: 34,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 126,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2022-12-27T00:00:00',
                                                endDate: '2023-01-11T00:00:00',
                                                propertyModelActivityId: 133,
                                                predecessor: '125SS+6',
                                                actualStartDate: '2022-11-10T00:00:00',
                                                actualEndDate: '2022-12-27T00:00:00',
                                                
                                                displayPredecessor: '125SS+6 days',
                                                basePlanStartDate: '27/12/2022 (IST)',
                                                basePlanEndDate: '11/01/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '48 days',
                                                id: 64,
                                            },
                                            {
                                                taskId: 133,
                                                blockId: 1,
                                                floorId: 34,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 126,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2022-12-27T00:00:00',
                                                endDate: '2023-01-29T00:00:00',
                                                propertyModelActivityId: 134,
                                                predecessor: '125SS+6',
                                                actualStartDate: '2022-11-03T00:00:00',
                                                actualEndDate: '2022-12-22T00:00:00',
                                                
                                                displayPredecessor: '125SS+6 days',
                                                basePlanStartDate: '27/12/2022 (IST)',
                                                basePlanEndDate: '29/01/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '50 days',
                                                id: 65,
                                            },
                                            {
                                                taskId: 134,
                                                blockId: 1,
                                                floorId: 34,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 126,
                                                taskName: 'CIS walls casting',
                                                startDate: '2022-12-28T00:00:00',
                                                endDate: '2023-02-02T00:00:00',
                                                propertyModelActivityId: 135,
                                                predecessor: '125SS+7',
                                                actualStartDate: '2022-11-27T00:00:00',
                                                actualEndDate: '2022-12-21T00:00:00',
                                                
                                                displayPredecessor: '125SS+7 days',
                                                basePlanStartDate: '28/12/2022 (IST)',
                                                basePlanEndDate: '02/02/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '25 days',
                                                id: 66,
                                            },
                                            {
                                                taskId: 135,
                                                blockId: 1,
                                                floorId: 34,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 126,
                                                taskName: 'CIS Column casting',
                                                startDate: '2022-12-29T00:00:00',
                                                endDate: '2023-01-27T00:00:00',
                                                propertyModelActivityId: 136,
                                                predecessor: '125SS+8',
                                                actualStartDate: '2022-11-17T00:00:00',
                                                actualEndDate: '2022-12-20T00:00:00',
                                                
                                                displayPredecessor: '125SS+8 days',
                                                basePlanStartDate: '29/12/2022 (IST)',
                                                basePlanEndDate: '27/01/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '34 days',
                                                id: 67,
                                            },
                                            {
                                                taskId: 136,
                                                blockId: 1,
                                                floorId: 34,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 126,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2023-01-22T00:00:00',
                                                endDate: '2023-02-12T00:00:00',
                                                propertyModelActivityId: 137,
                                                predecessor: '135FS-12,134FS-12',
                                                actualStartDate: '2022-11-03T00:00:00',
                                                actualEndDate: '2023-04-14T00:00:00',
                                                
                                                displayPredecessor: '135FS-12 days,134FS-12 days',
                                                basePlanStartDate: '22/01/2023 (IST)',
                                                basePlanEndDate: '12/02/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '163 days',
                                                id: 68,
                                            },
                                            {
                                                taskId: 138,
                                                blockId: 1,
                                                floorId: 34,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 126,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2023-01-30T00:00:00',
                                                endDate: '2023-02-15T00:00:00',
                                                propertyModelActivityId: 139,
                                                predecessor: '136SS+8,132FS,133FS',
                                                actualStartDate: '2022-12-25T00:00:00',
                                                actualEndDate: '2023-01-06T00:00:00',
                                                
                                                displayPredecessor: '136SS+8 days,132FS,133FS',
                                                basePlanStartDate: '30/01/2023 (IST)',
                                                basePlanEndDate: '15/02/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '13 days',
                                                id: 69,
                                            },
                                        ],
                                        actualDuration: '163 days',
                                        id: 63,
                                    },
                                    {
                                        taskId: 139,
                                        blockId: 1,
                                        floorId: 33,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-01',
                                        startDate: '2023-02-05T00:00:00',
                                        endDate: '2023-03-30T00:00:00',
                                        propertyModelActivityId: 140,
                                        
                                        actualStartDate: '2022-12-28T00:00:00',
                                        actualEndDate: '2023-04-13T00:00:00',
                                        
                                       
                                        basePlanStartDate: '05/02/2023 (IST)',
                                        basePlanEndDate: '30/03/2023 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 147,
                                                blockId: 1,
                                                floorId: 33,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 139,
                                                taskName: 'CIS walls casting',
                                                startDate: '2023-02-06T00:00:00',
                                                endDate: '2023-02-28T00:00:00',
                                                propertyModelActivityId: 148,
                                                predecessor: '138SS+7',
                                                actualStartDate: '2023-01-15T00:00:00',
                                                actualEndDate: '2023-02-21T00:00:00',
                                                
                                                displayPredecessor: '138SS+7 days',
                                                basePlanStartDate: '06/02/2023 (IST)',
                                                basePlanEndDate: '28/02/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '38 days',
                                                id: 71,
                                            },
                                            {
                                                taskId: 148,
                                                blockId: 1,
                                                floorId: 33,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 139,
                                                taskName: 'CIS Column casting',
                                                startDate: '2023-02-07T00:00:00',
                                                endDate: '2023-02-26T00:00:00',
                                                propertyModelActivityId: 149,
                                                predecessor: '138SS+8',
                                                actualStartDate: '2023-01-05T00:00:00',
                                                actualEndDate: '2023-02-23T00:00:00',
                                                
                                                displayPredecessor: '138SS+8 days',
                                                basePlanStartDate: '07/02/2023 (IST)',
                                                basePlanEndDate: '26/02/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '50 days',
                                                id: 72,
                                            },
                                            {
                                                taskId: 145,
                                                blockId: 1,
                                                floorId: 33,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 139,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2023-02-05T00:00:00',
                                                endDate: '2023-03-11T00:00:00',
                                                propertyModelActivityId: 146,
                                                predecessor: '138SS+6',
                                                actualStartDate: '2022-12-28T00:00:00',
                                                actualEndDate: '2023-01-19T00:00:00',
                                                
                                                displayPredecessor: '138SS+6 days',
                                                basePlanStartDate: '05/02/2023 (IST)',
                                                basePlanEndDate: '11/03/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '23 days',
                                                id: 73,
                                            },
                                            {
                                                taskId: 146,
                                                blockId: 1,
                                                floorId: 33,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 139,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2023-02-05T00:00:00',
                                                endDate: '2023-03-11T00:00:00',
                                                propertyModelActivityId: 147,
                                                predecessor: '138SS+6',
                                                actualStartDate: '2022-12-31T00:00:00',
                                                actualEndDate: '2023-01-25T00:00:00',
                                                
                                                displayPredecessor: '138SS+6 days',
                                                basePlanStartDate: '05/02/2023 (IST)',
                                                basePlanEndDate: '11/03/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '26 days',
                                                id: 74,
                                            },
                                            {
                                                taskId: 149,
                                                blockId: 1,
                                                floorId: 33,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 139,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2023-02-21T00:00:00',
                                                endDate: '2023-03-16T00:00:00',
                                                propertyModelActivityId: 150,
                                                predecessor: '148FS-8,147FS-8',
                                                actualStartDate: '2023-01-18T00:00:00',
                                                actualEndDate: '2023-04-13T00:00:00',
                                                
                                                displayPredecessor: '148FS-8 days,147FS-8 days',
                                                basePlanStartDate: '21/02/2023 (IST)',
                                                basePlanEndDate: '16/03/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '86 days',
                                                id: 75,
                                            },
                                            {
                                                taskId: 151,
                                                blockId: 1,
                                                floorId: 33,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 139,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2023-03-12T00:00:00',
                                                endDate: '2023-03-30T00:00:00',
                                                propertyModelActivityId: 152,
                                                predecessor: '149SS+8,145FS,146FS',
                                                actualStartDate: '2023-02-04T00:00:00',
                                                actualEndDate: '2023-02-24T00:00:00',
                                                
                                                displayPredecessor: '149SS+8 days,145FS,146FS',
                                                basePlanStartDate: '12/03/2023 (IST)',
                                                basePlanEndDate: '30/03/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '21 days',
                                                id: 76,
                                            },
                                        ],
                                        actualDuration: '107 days',
                                        id: 70,
                                    },
                                    {
                                        taskId: 152,
                                        blockId: 1,
                                        floorId: 43,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-02',
                                        startDate: '2023-03-18T00:00:00',
                                        endDate: '2023-04-12T00:00:00',
                                        propertyModelActivityId: 153,
                                        
                                        actualStartDate: '2023-02-05T00:00:00',
                                        actualEndDate: '2023-04-19T00:00:00',
                                        
                                       
                                        basePlanStartDate: '18/03/2023 (IST)',
                                        basePlanEndDate: '12/04/2023 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 158,
                                                blockId: 1,
                                                floorId: 43,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 152,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2023-03-18T00:00:00',
                                                endDate: '2023-03-27T00:00:00',
                                                propertyModelActivityId: 159,
                                                predecessor: '151SS+6',
                                                actualStartDate: '2023-02-05T00:00:00',
                                                actualEndDate: '2023-03-27T00:00:00',
                                                
                                                displayPredecessor: '151SS+6 days',
                                                basePlanStartDate: '18/03/2023 (IST)',
                                                basePlanEndDate: '27/03/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '51 days',
                                                id: 78,
                                            },
                                            {
                                                taskId: 159,
                                                blockId: 1,
                                                floorId: 43,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 152,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2023-03-18T00:00:00',
                                                endDate: '2023-03-30T00:00:00',
                                                propertyModelActivityId: 160,
                                                predecessor: '151SS+6',
                                                actualStartDate: '2023-02-05T00:00:00',
                                                actualEndDate: '2023-03-17T00:00:00',
                                                
                                                displayPredecessor: '151SS+6 days',
                                                basePlanStartDate: '18/03/2023 (IST)',
                                                basePlanEndDate: '30/03/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '41 days',
                                                id: 79,
                                            },
                                            {
                                                taskId: 160,
                                                blockId: 1,
                                                floorId: 43,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 152,
                                                taskName: 'CIS walls casting',
                                                startDate: '2023-03-19T00:00:00',
                                                endDate: '2023-03-30T00:00:00',
                                                propertyModelActivityId: 161,
                                                predecessor: '151SS+7',
                                                actualStartDate: '2023-02-27T00:00:00',
                                                actualEndDate: '2023-03-14T00:00:00',
                                                
                                                displayPredecessor: '151SS+7 days',
                                                basePlanStartDate: '19/03/2023 (IST)',
                                                basePlanEndDate: '30/03/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '16 days',
                                                id: 80,
                                            },
                                            {
                                                taskId: 161,
                                                blockId: 1,
                                                floorId: 43,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 152,
                                                taskName: 'CIS Column casting',
                                                startDate: '2023-03-20T00:00:00',
                                                endDate: '2023-03-31T00:00:00',
                                                propertyModelActivityId: 162,
                                                predecessor: '151SS+8',
                                                actualStartDate: '2023-02-21T00:00:00',
                                                actualEndDate: '2023-03-13T00:00:00',
                                                
                                                displayPredecessor: '151SS+8 days',
                                                basePlanStartDate: '20/03/2023 (IST)',
                                                basePlanEndDate: '31/03/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '21 days',
                                                id: 81,
                                            },
                                            {
                                                taskId: 162,
                                                blockId: 1,
                                                floorId: 43,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 152,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2023-03-27T00:00:00',
                                                endDate: '2023-04-07T00:00:00',
                                                propertyModelActivityId: 163,
                                                predecessor: '160FS-5,161FS-5',
                                                actualStartDate: '2023-02-08T00:00:00',
                                                actualEndDate: '2023-04-19T00:00:00',
                                                
                                                displayPredecessor: '160FS-5 days,161FS-5 days',
                                                basePlanStartDate: '27/03/2023 (IST)',
                                                basePlanEndDate: '07/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '71 days',
                                                id: 82,
                                            },
                                            {
                                                taskId: 164,
                                                blockId: 1,
                                                floorId: 43,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 152,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2023-04-04T00:00:00',
                                                endDate: '2023-04-12T00:00:00',
                                                propertyModelActivityId: 165,
                                                predecessor: '162SS+8,158FS,159FS',
                                                actualStartDate: '2023-02-07T00:00:00',
                                                actualEndDate: '2023-03-20T00:00:00',
                                                
                                                displayPredecessor: '162SS+8 days,158FS,159FS',
                                                basePlanStartDate: '04/04/2023 (IST)',
                                                basePlanEndDate: '12/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '42 days',
                                                id: 83,
                                            },
                                        ],
                                        actualDuration: '74 days',
                                        id: 77,
                                    },
                                    {
                                        taskId: 165,
                                        blockId: 1,
                                        floorId: 31,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-03',
                                        startDate: '2023-04-10T00:00:00',
                                        endDate: '2023-04-25T00:00:00',
                                        propertyModelActivityId: 166,
                                        
                                        actualStartDate: '2023-03-09T00:00:00',
                                        actualEndDate: '2023-05-13T00:00:00',
                                        
                                       
                                        basePlanStartDate: '10/04/2023 (IST)',
                                        basePlanEndDate: '25/04/2023 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 171,
                                                blockId: 1,
                                                floorId: 31,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 165,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2023-04-10T00:00:00',
                                                endDate: '2023-04-14T00:00:00',
                                                propertyModelActivityId: 172,
                                                predecessor: '164SS+6',
                                                actualStartDate: '2023-03-11T00:00:00',
                                                actualEndDate: '2023-03-29T00:00:00',
                                                
                                                displayPredecessor: '164SS+6 days',
                                                basePlanStartDate: '10/04/2023 (IST)',
                                                basePlanEndDate: '14/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '19 days',
                                                id: 85,
                                            },
                                            {
                                                taskId: 172,
                                                blockId: 1,
                                                floorId: 31,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 165,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2023-04-10T00:00:00',
                                                endDate: '2023-04-14T00:00:00',
                                                propertyModelActivityId: 173,
                                                predecessor: '164SS+6',
                                                actualStartDate: '2023-03-09T00:00:00',
                                                actualEndDate: '2023-04-08T00:00:00',
                                                
                                                displayPredecessor: '164SS+6 days',
                                                basePlanStartDate: '10/04/2023 (IST)',
                                                basePlanEndDate: '14/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '31 days',
                                                id: 86,
                                            },
                                            {
                                                taskId: 174,
                                                blockId: 1,
                                                floorId: 31,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 165,
                                                taskName: 'CIS Column casting',
                                                startDate: '2023-04-10T00:00:00',
                                                endDate: '2023-04-14T00:00:00',
                                                propertyModelActivityId: 175,
                                                predecessor: '164SS+6',
                                                actualStartDate: '2023-03-15T00:00:00',
                                                actualEndDate: '2023-04-08T00:00:00',
                                                
                                                displayPredecessor: '164SS+6 days',
                                                basePlanStartDate: '10/04/2023 (IST)',
                                                basePlanEndDate: '14/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '25 days',
                                                id: 87,
                                            },
                                            {
                                                taskId: 173,
                                                blockId: 1,
                                                floorId: 31,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 165,
                                                taskName: 'CIS walls casting',
                                                startDate: '2023-04-11T00:00:00',
                                                endDate: '2023-04-15T00:00:00',
                                                propertyModelActivityId: 174,
                                                predecessor: '164SS+7',
                                                actualStartDate: '2023-04-01T00:00:00',
                                                actualEndDate: '2023-04-13T00:00:00',
                                                
                                                displayPredecessor: '164SS+7 days',
                                                basePlanStartDate: '11/04/2023 (IST)',
                                                basePlanEndDate: '15/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '13 days',
                                                id: 88,
                                            },
                                            {
                                                taskId: 175,
                                                blockId: 1,
                                                floorId: 31,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 165,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2023-04-14T00:00:00',
                                                endDate: '2023-04-21T00:00:00',
                                                propertyModelActivityId: 176,
                                                predecessor: '173SS+3,174SS+3',
                                                actualStartDate: '2023-03-15T00:00:00',
                                                actualEndDate: '2023-05-13T00:00:00',
                                                
                                                displayPredecessor: '173SS+3 days,174SS+3 days',
                                                basePlanStartDate: '14/04/2023 (IST)',
                                                basePlanEndDate: '21/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '60 days',
                                                id: 89,
                                            },
                                            {
                                                taskId: 177,
                                                blockId: 1,
                                                floorId: 31,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 165,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2023-04-19T00:00:00',
                                                endDate: '2023-04-25T00:00:00',
                                                propertyModelActivityId: 178,
                                                predecessor: '175SS+5,171FS,172FS',
                                                actualStartDate: '2023-04-07T00:00:00',
                                                actualEndDate: '2023-04-18T00:00:00',
                                                
                                                displayPredecessor: '175SS+5 days,171FS,172FS',
                                                basePlanStartDate: '19/04/2023 (IST)',
                                                basePlanEndDate: '25/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '12 days',
                                                id: 90,
                                            },
                                        ],
                                        actualDuration: '66 days',
                                        id: 84,
                                    },
                                    {
                                        taskId: 178,
                                        blockId: 1,
                                        floorId: 30,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-04',
                                        startDate: '2023-04-24T00:00:00',
                                        endDate: '2023-05-09T00:00:00',
                                        propertyModelActivityId: 179,
                                        
                                        actualStartDate: '2023-04-10T00:00:00',
                                        actualEndDate: '2023-06-17T00:00:00',
                                        
                                       
                                        basePlanStartDate: '24/04/2023 (IST)',
                                        basePlanEndDate: '09/05/2023 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 184,
                                                blockId: 1,
                                                floorId: 30,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 178,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2023-04-24T00:00:00',
                                                endDate: '2023-04-28T00:00:00',
                                                propertyModelActivityId: 185,
                                                predecessor: '177SS+5',
                                                actualStartDate: '2023-04-11T00:00:00',
                                                actualEndDate: '2023-04-18T00:00:00',
                                                
                                                displayPredecessor: '177SS+5 days',
                                                basePlanStartDate: '24/04/2023 (IST)',
                                                basePlanEndDate: '28/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '8 days',
                                                id: 92,
                                            },
                                            {
                                                taskId: 185,
                                                blockId: 1,
                                                floorId: 30,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 178,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2023-04-24T00:00:00',
                                                endDate: '2023-04-28T00:00:00',
                                                propertyModelActivityId: 186,
                                                predecessor: '177SS+5',
                                                actualStartDate: '2023-04-10T00:00:00',
                                                actualEndDate: '2023-05-01T00:00:00',
                                                
                                                displayPredecessor: '177SS+5 days',
                                                basePlanStartDate: '24/04/2023 (IST)',
                                                basePlanEndDate: '28/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '22 days',
                                                id: 93,
                                            },
                                            {
                                                taskId: 187,
                                                blockId: 1,
                                                floorId: 30,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 178,
                                                taskName: 'CIS Column casting',
                                                startDate: '2023-04-24T00:00:00',
                                                endDate: '2023-04-28T00:00:00',
                                                propertyModelActivityId: 188,
                                                predecessor: '177SS+5',
                                                actualStartDate: '2023-04-17T00:00:00',
                                                actualEndDate: '2023-04-25T00:00:00',
                                                
                                                displayPredecessor: '177SS+5 days',
                                                basePlanStartDate: '24/04/2023 (IST)',
                                                basePlanEndDate: '28/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '9 days',
                                                id: 94,
                                            },
                                            {
                                                taskId: 186,
                                                blockId: 1,
                                                floorId: 30,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 178,
                                                taskName: 'CIS walls casting',
                                                startDate: '2023-04-25T00:00:00',
                                                endDate: '2023-04-29T00:00:00',
                                                propertyModelActivityId: 187,
                                                predecessor: '177SS+6',
                                                actualStartDate: '2023-04-22T00:00:00',
                                                actualEndDate: '2023-05-06T00:00:00',
                                                
                                                displayPredecessor: '177SS+6 days',
                                                basePlanStartDate: '25/04/2023 (IST)',
                                                basePlanEndDate: '29/04/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '15 days',
                                                id: 95,
                                            },
                                            {
                                                taskId: 188,
                                                blockId: 1,
                                                floorId: 30,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 178,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2023-04-28T00:00:00',
                                                endDate: '2023-05-05T00:00:00',
                                                propertyModelActivityId: 189,
                                                predecessor: '186SS+3,187SS+3',
                                                actualStartDate: '2023-04-15T00:00:00',
                                                actualEndDate: '2023-06-17T00:00:00',
                                                
                                                displayPredecessor: '186SS+3 days,187SS+3 days',
                                                basePlanStartDate: '28/04/2023 (IST)',
                                                basePlanEndDate: '05/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '64 days',
                                                id: 96,
                                            },
                                            {
                                                taskId: 190,
                                                blockId: 1,
                                                floorId: 30,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 178,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2023-05-03T00:00:00',
                                                endDate: '2023-05-09T00:00:00',
                                                propertyModelActivityId: 191,
                                                predecessor: '188SS+5,184FS,185FS',
                                                actualStartDate: '2023-04-27T00:00:00',
                                                actualEndDate: '2023-05-08T00:00:00',
                                                
                                                displayPredecessor: '188SS+5 days,184FS,185FS',
                                                basePlanStartDate: '03/05/2023 (IST)',
                                                basePlanEndDate: '09/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '12 days',
                                                id: 97,
                                            },
                                        ],
                                        actualDuration: '69 days',
                                        id: 91,
                                    },
                                    {
                                        taskId: 191,
                                        blockId: 1,
                                        floorId: 29,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-05',
                                        startDate: '2023-05-08T00:00:00',
                                        endDate: '2023-05-23T00:00:00',
                                        propertyModelActivityId: 192,
                                        
                                        actualStartDate: '2023-04-27T00:00:00',
                                        actualEndDate: '2023-06-17T00:00:00',
                                        
                                       
                                        basePlanStartDate: '08/05/2023 (IST)',
                                        basePlanEndDate: '23/05/2023 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 199,
                                                blockId: 1,
                                                floorId: 29,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 191,
                                                taskName: 'CIS walls casting',
                                                startDate: '2023-05-09T00:00:00',
                                                endDate: '2023-05-20T00:00:00',
                                                propertyModelActivityId: 200,
                                                predecessor: '190SS+6',
                                                actualStartDate: '2023-04-27T00:00:00',
                                                actualEndDate: '2023-05-23T00:00:00',
                                                
                                                displayPredecessor: '190SS+6 days',
                                                basePlanStartDate: '09/05/2023 (IST)',
                                                basePlanEndDate: '20/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '27 days',
                                                id: 99,
                                            },
                                            {
                                                taskId: 197,
                                                blockId: 1,
                                                floorId: 29,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 191,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2023-05-08T00:00:00',
                                                endDate: '2023-05-12T00:00:00',
                                                propertyModelActivityId: 198,
                                                predecessor: '190SS+5',
                                                actualStartDate: '2023-04-29T00:00:00',
                                                actualEndDate: '2023-05-04T00:00:00',
                                                
                                                displayPredecessor: '190SS+5 days',
                                                basePlanStartDate: '08/05/2023 (IST)',
                                                basePlanEndDate: '12/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '6 days',
                                                id: 100,
                                            },
                                            {
                                                taskId: 198,
                                                blockId: 1,
                                                floorId: 29,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 191,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2023-05-08T00:00:00',
                                                endDate: '2023-05-12T00:00:00',
                                                propertyModelActivityId: 199,
                                                predecessor: '190SS+5',
                                                actualStartDate: '2023-04-30T00:00:00',
                                                actualEndDate: '2023-05-17T00:00:00',
                                                
                                                displayPredecessor: '190SS+5 days',
                                                basePlanStartDate: '08/05/2023 (IST)',
                                                basePlanEndDate: '12/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '18 days',
                                                id: 101,
                                            },
                                            {
                                                taskId: 200,
                                                blockId: 1,
                                                floorId: 29,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 191,
                                                taskName: 'CIS Column casting',
                                                startDate: '2023-05-08T00:00:00',
                                                endDate: '2023-05-12T00:00:00',
                                                propertyModelActivityId: 201,
                                                predecessor: '190SS+5',
                                                actualStartDate: '2023-05-03T00:00:00',
                                                actualEndDate: '2023-05-13T00:00:00',
                                                
                                                displayPredecessor: '190SS+5 days',
                                                basePlanStartDate: '08/05/2023 (IST)',
                                                basePlanEndDate: '12/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '11 days',
                                                id: 102,
                                            },
                                            {
                                                taskId: 201,
                                                blockId: 1,
                                                floorId: 29,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 191,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2023-05-12T00:00:00',
                                                endDate: '2023-05-19T00:00:00',
                                                propertyModelActivityId: 202,
                                                predecessor: '199SS+3,200SS+3',
                                                actualStartDate: '2023-05-02T00:00:00',
                                                actualEndDate: '2023-06-17T00:00:00',
                                                
                                                displayPredecessor: '199SS+3 days,200SS+3 days',
                                                basePlanStartDate: '12/05/2023 (IST)',
                                                basePlanEndDate: '19/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '47 days',
                                                id: 103,
                                            },
                                            {
                                                taskId: 203,
                                                blockId: 1,
                                                floorId: 29,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 191,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2023-05-17T00:00:00',
                                                endDate: '2023-05-23T00:00:00',
                                                propertyModelActivityId: 204,
                                                predecessor: '201SS+5,197FS,198FS',
                                                actualStartDate: '2023-05-15T00:00:00',
                                                actualEndDate: '2023-05-23T00:00:00',
                                                
                                                displayPredecessor: '201SS+5 days,197FS,198FS',
                                                basePlanStartDate: '17/05/2023 (IST)',
                                                basePlanEndDate: '23/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '9 days',
                                                id: 104,
                                            },
                                        ],
                                        actualDuration: '52 days',
                                        id: 98,
                                    },
                                    {
                                        taskId: 204,
                                        blockId: 1,
                                        floorId: 28,
                                        siteDrawingTypeId: 1,
                                        
                                        
                                        
                                        
                                        parentId: 3,
                                        taskName: 'Level-06',
                                        startDate: '2023-05-22T00:00:00',
                                        endDate: '2023-06-06T00:00:00',
                                        propertyModelActivityId: 205,
                                        
                                        actualStartDate: '2023-05-17T00:00:00',
                                        actualEndDate: '2023-07-01T00:00:00',
                                        
                                       
                                        basePlanStartDate: '22/05/2023 (IST)',
                                        basePlanEndDate: '06/06/2023 (IST)',
                                        revisionNo: 1,
                                        subTasks: [
                                            {
                                                taskId: 210,
                                                blockId: 1,
                                                floorId: 28,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 1,
                                                modelActivityName: 'Precast Column Erection',
                                                parentId: 204,
                                                taskName: 'Precast Column Erection',
                                                startDate: '2023-05-22T00:00:00',
                                                endDate: '2023-05-26T00:00:00',
                                                propertyModelActivityId: 211,
                                                predecessor: '203SS+5',
                                                actualStartDate: '2023-05-17T00:00:00',
                                                actualEndDate: '2023-05-30T00:00:00',
                                                
                                                displayPredecessor: '203SS+5 days',
                                                basePlanStartDate: '22/05/2023 (IST)',
                                                basePlanEndDate: '26/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '14 days',
                                                id: 106,
                                            },
                                            {
                                                taskId: 211,
                                                blockId: 1,
                                                floorId: 28,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 2,
                                                modelActivityName: 'Precast Walls Erection',
                                                parentId: 204,
                                                taskName: 'Precast Walls Erection',
                                                startDate: '2023-05-22T00:00:00',
                                                endDate: '2023-05-26T00:00:00',
                                                propertyModelActivityId: 212,
                                                predecessor: '203SS+5',
                                                actualStartDate: '2023-05-17T00:00:00',
                                                actualEndDate: '2023-06-01T00:00:00',
                                                
                                                displayPredecessor: '203SS+5 days',
                                                basePlanStartDate: '22/05/2023 (IST)',
                                                basePlanEndDate: '26/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '16 days',
                                                id: 107,
                                            },
                                            {
                                                taskId: 213,
                                                blockId: 1,
                                                floorId: 28,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 4,
                                                modelActivityName: 'CIS Column casting',
                                                parentId: 204,
                                                taskName: 'CIS Column casting',
                                                startDate: '2023-05-22T00:00:00',
                                                endDate: '2023-05-26T00:00:00',
                                                propertyModelActivityId: 214,
                                                predecessor: '203SS+5',
                                                actualStartDate: '2023-05-24T00:00:00',
                                                actualEndDate: '2023-05-28T00:00:00',
                                                
                                                displayPredecessor: '203SS+5 days',
                                                basePlanStartDate: '22/05/2023 (IST)',
                                                basePlanEndDate: '26/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '5 days',
                                                id: 108,
                                            },
                                            {
                                                taskId: 212,
                                                blockId: 1,
                                                floorId: 28,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 3,
                                                modelActivityName: 'CIS walls casting',
                                                parentId: 204,
                                                taskName: 'CIS walls casting',
                                                startDate: '2023-05-23T00:00:00',
                                                endDate: '2023-05-27T00:00:00',
                                                propertyModelActivityId: 213,
                                                predecessor: '203SS+6',
                                                actualStartDate: '2023-05-24T00:00:00',
                                                actualEndDate: '2023-06-01T00:00:00',
                                                
                                                displayPredecessor: '203SS+6 days',
                                                basePlanStartDate: '23/05/2023 (IST)',
                                                basePlanEndDate: '27/05/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '9 days',
                                                id: 109,
                                            },
                                            {
                                                taskId: 214,
                                                blockId: 1,
                                                floorId: 28,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 5,
                                                modelActivityName: 'Precast Beams & HCS/SS Erection',
                                                parentId: 204,
                                                taskName: 'Precast Beams & HCS/SS Erection',
                                                startDate: '2023-05-26T00:00:00',
                                                endDate: '2023-06-02T00:00:00',
                                                propertyModelActivityId: 215,
                                                predecessor: '212SS+3,213SS+3',
                                                actualStartDate: '2023-05-19T00:00:00',
                                                actualEndDate: '2023-07-01T00:00:00',
                                                
                                                displayPredecessor: '212SS+3 days,213SS+3 days',
                                                basePlanStartDate: '26/05/2023 (IST)',
                                                basePlanEndDate: '02/06/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '44 days',
                                                id: 110,
                                            },
                                            {
                                                taskId: 216,
                                                blockId: 1,
                                                floorId: 28,
                                                siteDrawingTypeId: 1,
                                                
                                                
                                                modelActivityId: 7,
                                                modelActivityName: 'Topping and Slab Casting',
                                                parentId: 204,
                                                taskName: 'Topping and Slab Casting',
                                                startDate: '2023-05-31T00:00:00',
                                                endDate: '2023-06-06T00:00:00',
                                                propertyModelActivityId: 217,
                                                predecessor: '214SS+5,210FS,211FS',
                                                actualStartDate: '2023-05-31T00:00:00',
                                                actualEndDate: '2023-06-07T00:00:00',
                                                
                                                displayPredecessor: '214SS+5 days,210FS,211FS',
                                                basePlanStartDate: '31/05/2023 (IST)',
                                                basePlanEndDate: '06/06/2023 (IST)',
                                                revisionNo: 1,
                                                
                                                actualDuration: '8 days',
                                                id: 111,
                                            },
                                        ],
                                        actualDuration: '46 days',
                                        id: 105,
                                    }
                                ],
                                actualDuration: '846 days',
                                id: 3,
                            }
                        ],
                        actualDuration: '846 days',
                        id: 2,
                    },
                ],
                actualDuration: '846 days',
                id: 1,
            },
        ]
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: dataSource,
                    taskFields: {
                        id: 'taskId',
                        name: 'taskName',
                        startDate: 'startDate',
                        endDate: 'endDate',
                        dependency: 'predecessor',
                        child: 'subTasks',
                    },
                    toolbar: ['Add', 'Edit', 'Delete'],
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true,
                        allowTaskbarEditing: true,
                        showDeleteConfirmDialog: true
                    },
                    columns: [
                        { field: 'taskId', width: 80 },
                        {
                            field: 'taskName',
                            headerText: 'Job Name',
                            width: '250',
                            clipMode: 'EllipsisWithTooltip',
                        },
                        { field: 'StartDate' },
                        { field: 'Duration' },
                        { field: 'Progress' },
                        { field: 'Predecessor' },
                    ],
                    allowUnscheduledTasks: true,
                    allowSelection: true,
                    height: '450px',
                }, done);
        });
        it('multiple dependency-connected tasks ', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType == "openEditDialog") {
                    expect(args.requestType == "openEditDialog").toBe(true);
                }
            }
            ganttObj.openEditDialog(58);
        });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
describe('Edit date in RTL mode', () => {
        let ganttObj: Gantt;
        let projectNewData = [
            {
              TaskID: 1,
              TaskName: 'Product Concept',
              StartDate: new Date('04/02/2019'),
              EndDate: new Date('04/21/2019'),
              subtasks: [
                {
                  TaskID: 2,
                  TaskName: 'Defining the product  and its usage',
                  BaselineStartDate: new Date('04/02/2019'),
                  BaselineEndDate: new Date('04/06/2019'),
                  StartDate: new Date('04/02/2019'),
                  Duration: 3,
                  Progress: 30,
                },
                {
                  TaskID: 3,
                  TaskName: 'Defining target audience',
                  StartDate: new Date('04/02/2019'),
                  Duration: 3,
                  Indicators: [
                    {
                      date: '04/10/2019',
                      iconClass:
                        'e-btn-icon e-notes-info e-icons e-icon-left e-gantt e-notes-info::before',
                      name: 'Indicator title',
                      tooltip: 'tooltip',
                    },
                  ],
                },
                {
                  TaskID: 4,
                  TaskName: 'Prepare product sketch and notes',
                  StartDate: new Date('04/02/2019'),
                  Duration: 3,
                  Progress: 30,
                },
              ],
            },
            {
              TaskID: 5,
              TaskName: 'Concept Approval',
              StartDate: new Date('04/02/2024'),
              Duration: 0,
            },
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
                    {
                      TaskID: 8,
                      TaskName: 'Customer strength',
                      BaselineStartDate: new Date('04/08/2019'),
                      BaselineEndDate: new Date('04/12/2019'),
                      StartDate: new Date('04/04/2019'),
                      Duration: 4,
                      Predecessor: '5',
                      Progress: 30,
                    },
                    {
                      TaskID: 9,
                      TaskName: 'Market opportunity analysis',
                      StartDate: new Date('04/04/2019'),
                      Duration: 4,
                    },
                  ],
                },
                {
                  TaskID: 10,
                  TaskName: 'Competitor Analysis',
                  StartDate: new Date('04/04/2019'),
                  Duration: 4,
                  Progress: 30,
                },
                {
                  TaskID: 11,
                  TaskName: 'Product strength analysis',
                  StartDate: new Date('04/04/2019'),
                  Duration: 4,
                  Predecessor: '9',
                },
                {
                  TaskID: 12,
                  TaskName: 'Research complete',
                  StartDate: new Date('04/04/2019'),
                  Duration: 0,
                  Predecessor: '10',
                },
              ],
            },
            {
              TaskID: 13,
              TaskName: 'Product Design and Development',
              StartDate: new Date('04/04/2019'),
              EndDate: new Date('04/21/2019'),
              subtasks: [
                {
                  TaskID: 14,
                  TaskName: 'Functionality design',
                  StartDate: new Date('04/04/2019'),
                  Duration: 7,
                  Progress: 30,
                },
                {
                  TaskID: 15,
                  TaskName: 'Quality design',
                  StartDate: new Date('04/04/2019'),
                  Duration: 5,
                },
                {
                  TaskID: 16,
                  TaskName: 'Define Reliability',
                  StartDate: new Date('04/04/2019'),
                  Duration: 5,
                  Progress: 30,
                },
                {
                  TaskID: 17,
                  TaskName: 'Identifying raw materials ',
                  StartDate: new Date('04/04/2019'),
                  Duration: 4,
                },
                {
                  TaskID: 18,
                  TaskName: 'Define cost plan',
                  StartDate: new Date('04/04/2019'),
                  EndDate: new Date('04/21/2019'),
                  subtasks: [
                    {
                      TaskID: 19,
                      TaskName: 'Manufacturing cost',
                      StartDate: new Date('04/04/2019'),
                      Duration: 1,
                      Progress: 30,
                    },
                    {
                      TaskID: 20,
                      TaskName: 'Selling cost',
                      StartDate: new Date('04/04/2019'),
                      Duration: 1,
                    },
                  ],
                },
                {
                  TaskID: 21,
                  TaskName: 'Development of the final design',
                  StartDate: new Date('04/04/2019'),
                  EndDate: new Date('04/21/2019'),
                  subtasks: [
                    {
                      TaskID: 22,
                      TaskName: 'Defining dimensions and package volume',
                      StartDate: new Date('04/04/2019'),
                      Duration: 2,
                      Progress: 30,
                    },
                    {
                      TaskID: 23,
                      TaskName: 'Develop design to meet industry standards',
                      StartDate: new Date('04/04/2019'),
                      Duration: 3,
                    },
                    {
                      TaskID: 24,
                      TaskName: 'Include all the details',
                      StartDate: new Date('04/04/2019'),
                      Duration: 5,
                    },
                  ],
                },
                {
                  TaskID: 25,
                  TaskName: 'CAD Computer-aided design',
                  StartDate: new Date('04/04/2019'),
                  Duration: 10,
                  Progress: 30,
                },
                {
                  TaskID: 26,
                  TaskName: 'CAM Computer-aided manufacturing',
                  StartDate: new Date('04/04/2019'),
                  Duration: 10,
                },
              ],
            },
            {
              TaskID: 27,
              TaskName: 'Prototype Testing',
              StartDate: new Date('04/04/2019'),
              Duration: 12,
              Progress: 30,
            },
            {
              TaskID: 28,
              TaskName: 'Include feedback',
              StartDate: new Date('04/04/2019'),
              Duration: 5,
            },
            {
              TaskID: 29,
              TaskName: 'Manufacturing',
              StartDate: new Date('04/04/2019'),
              Duration: 9,
              Progress: 30,
            },
            {
              TaskID: 30,
              TaskName: 'Assembling materials to finished goods',
              StartDate: new Date('04/04/2019'),
              Duration: 12,
            },
            {
              TaskID: 31,
              TaskName: 'Feedback and Testing',
              StartDate: new Date('04/04/2019'),
              EndDate: new Date('04/21/2019'),
              subtasks: [
                {
                  TaskID: 32,
                  TaskName: 'Internal testing and feedback',
                  StartDate: new Date('04/04/2019'),
                  Duration: 5,
                  Progress: 30,
                },
                {
                  TaskID: 33,
                  TaskName: 'Customer testing and feedback',
                  StartDate: new Date('04/04/2019'),
                  Duration: 7,
                  Progress: 30,
                },
              ],
            },
            {
              TaskID: 34,
              TaskName: 'Product Development',
              StartDate: new Date('04/04/2019'),
              EndDate: new Date('04/21/2019'),
              subtasks: [
                {
                  TaskID: 35,
                  TaskName: 'Important improvements',
                  StartDate: new Date('04/04/2019'),
                  Duration: 2,
                  Progress: 30,
                },
                {
                  TaskID: 36,
                  TaskName: 'Address any unforeseen issues',
                  StartDate: new Date('04/04/2019'),
                  Duration: 2,
                  Progress: 30,
                },
              ],
            },
            {
              TaskID: 37,
              TaskName: 'Final Product',
              StartDate: new Date('04/04/2019'),
              EndDate: new Date('04/21/2019'),
              subtasks: [
                {
                  TaskID: 38,
                  TaskName: 'Branding product',
                  StartDate: new Date('04/04/2019'),
                  Duration: 5,
                },
                {
                  TaskID: 39,
                  TaskName: 'zzz',
                  StartDate: new Date('04/04/2019'),
                  Duration: 10,
                  Progress: 30,
                },
              ],
            },
          ];
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectNewData,
  allowReordering: true,
  enableMultiTaskbar: true,
  enableUndoRedo: true,
  enableTimelineVirtualization: true,
  // autoCalculateDateScheduling: false,
  // allowTaskbarDragAndDrop: true,
  // showOverAllocation: true,
  enableCriticalPath: true, 
  queryTaskbarInfo(args) {
    if (args.data.isCritical && !args.data.hasChildRecords) {
      args.taskbarBgColor = 'rgb(242, 210, 189)';
      args.progressBarBgColor = 'rgb(201, 169, 166)';
    }
  },
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
    'Update',
    'Delete',
    'Cancel',
    'Search',
    'Undo',
    'Redo',
  ],
  undoRedoActions: [
    'Sorting',
    'Add',
    'ColumnReorder',
    'ColumnResize',
    'ColumnState',
    'Delete',
    'Edit',
    'Filtering',
    'Indent',
    'Outdent',
    'NextTimeSpan',
    'PreviousTimeSpan',
    'RowDragAndDrop',
    'Search',
  ],
  // treeColumnIndex: 1,
  // allowKeyboard: false,
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
  height: '550px',
  //   allowUnscheduledTasks: true,
  projectStartDate: new Date('03/25/2019'),
  projectEndDate: new Date('05/30/2024'),

                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 500);
            ganttObj.openEditDialog(4);
        });
        it('edit start date with critical path', () => {
            ganttObj.actionComplete = (args: any): void => {
                if(args.requestType == 'save') {
                    expect(ganttObj.getFormatedDate(ganttObj.currentViewData[3].ganttProperties.startDate, 'MM/dd/yyyy')).toBe('05/10/2024');
                }
            };
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            SD.value = new Date('05/10/2024');
            SD.dataBind();
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
    });
    describe('Add Dialog in manual task', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: dialogData1,
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
                    taskMode: 'Manual',
                    allowExcelExport: true,
                    allowPdfExport: true,
                    allowRowDragAndDrop: true,
                    splitterSettings: {
                        position: "50%",
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel'],
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
                    projectStartDate: new Date('02/20/2017'),
                    projectEndDate: new Date('03/30/2017'),
                }, done);
        });
        beforeEach((done: Function) => {
            let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_add') as HTMLElement;
            triggerMouseEvent(add, 'click');
            setTimeout(done, 500);
        });
        it('Add new record', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.action === 'add') {
                    expect(ganttObj.currentViewData.length).toEqual(5);
                }
            };
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Split task', function () {
        let ganttObj: Gantt;
        beforeAll(function (done) {
            ganttObj = createGantt({
                dataSource: splitTasksData2,
                taskFields: {
                    id: 'id',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    durationUnit: 'DurationUnit',
                    segments: 'Segments',
                },
                durationUnit: 'Hour',
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
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
                }, done);
        });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('when give a taskid as id getting console error', () => {
            expect(ganttObj.element.getElementsByClassName('e-row')[2].children[3].innerHTML).toBe('2/8/2019');
            ganttObj.openEditDialog(3);
            let selectSegment: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_Tab > div.e-tab-header.e-control.e-toolbar.e-lib.e-keyboard > div > div:nth-child(4)') as HTMLElement;
            triggerMouseEvent(selectSegment, 'click');
            let selectRow: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'SegmentsTabContainer_content_table > tbody > tr:nth-child(1)') as HTMLElement;
            triggerMouseEvent(selectRow, 'click');
            let deleteSegment: HTMLElement = document.querySelector('#' + ganttObj.element.id + 'SegmentsTabContainer_delete > span.e-tbar-btn-text') as HTMLElement;
            triggerMouseEvent(deleteSegment, 'click');
            triggerMouseEvent(deleteSegment, 'click');
            triggerMouseEvent(deleteSegment, 'click');
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.element.getElementsByClassName('e-row')[2].children[3].innerHTML).toBe('2/5/2019');           
        });
      });
    describe('Edit Dialog while selection in row', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: dialogData1,
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
                        mode: 'Both',
                        type: 'Single',
                        enableToggle: false
                    },
                    allowFiltering: true,
                    gridLines: "Both",
                    showColumnMenu: true,
                    highlightWeekends: true,
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        beforeEach((done: Function) => {
            let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_edit') as HTMLElement;
            triggerMouseEvent(add, 'click');
            setTimeout(done, 500);
        });
        it('Edit record', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.action === 'edit') {
                    expect(ganttObj.currentViewData.length).toEqual(1);
                }
            };
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    })
    describe('Edit Dialog while selection is cell', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: dialogData1,
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
                        mode: 'Cell',
                        type: 'Single',
                        enableToggle: false
                    },
                    allowFiltering: true,
                    gridLines: "Both",
                    showColumnMenu: true,
                    highlightWeekends: true,
                    allowUnscheduledTasks: true,
                    projectStartDate: new Date('03/25/2019'),
                    projectEndDate: new Date('05/30/2019'),
                }, done);
        });
        beforeEach((done: Function) => {
            let add: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_edit') as HTMLElement;
            triggerMouseEvent(add, 'click');
            setTimeout(done, 500);
        });
        it('Edit record', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.action === 'edit') {
                    expect(ganttObj.currentViewData.length).toEqual(1);
                }
            };
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    })
    describe('Split task Cr-885547', function () {
        let ganttObj: Gantt;
        beforeAll(function (done) {
            ganttObj = createGantt({
                dataSource: splitTasksData3,
                taskFields: {
                    id: 'id',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    durationUnit: 'DurationUnit',
                    segments: 'Segments',
                },
                durationUnit: 'Hour',
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
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
                }, done);
        });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
	beforeEach((done) => {
            setTimeout(done, 500);
            ganttObj.openEditDialog(3);
        });
        it('Checking Custom Column', (done: Function) => {
            ganttObj.actionComplete = (args: any): void => {
                if(args.requestType === 'save') {
                    expect(args.data.Segments[0].customID).toBe(33);
                    done();        
                }
            }
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
    });
    describe('CR:886052-Editing issue for the grid rendered inside a custom column', function () {
        let ganttObj: Gantt | any;
        let indicatorData: any;
        let elem: HTMLElement;
        let gridObj: Grid | any;
        beforeAll(function (done) {
            ganttObj = createGantt({
                dataSource: CR886052,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
                editSettings: {
                  allowAdding: true,
                  allowEditing: true,
                  allowDeleting: true,
                  allowTaskbarEditing: true,
                  showDeleteConfirmDialog: true,
                },
                columns: [
                    { field: 'TaskID', width: 80 },
                    { field: 'TaskName', width: 250 },
                    { field: 'StartDate' },
                    { field: 'EndDate' },
                    { field: 'Duration' },
                    { field: 'Predecessor' },
                    { field: 'Progress' },
                    { field: 'Customfield', visible: false,
                    edit: {
                        create: () => {
                          elem = document.createElement('div');
                          return elem;
                        },
                        read: () => {
                          return gridObj.value;
                        },
                        destroy: () => {
                          gridObj.destroy();
                        },
                        write: (args: Object) => {
                          if ((args as any).rowData.Indicators) {
                            indicatorData = (args as any).rowData.Indicators.map((indicator: any, index: number) => ({
                              id: index,
                              date: new Date(indicator.date),
                              name: indicator.name,
                              tooltip: indicator.tooltip,
                              iconClass: indicator.iconClass
                            }));
                        } else {
                            indicatorData = []; 
                        }
                          gridObj = new Grid({
                            width:"550px",
                            height:"120px",
                            dataSource: indicatorData,
                            columns: [
                                { field: 'id', headerText: 'id', width: 120, isPrimaryKey: true,  },
                                { field: 'date', type:'date', headerText: 'date', width: 120, format:'yMd', editType: 'datepickeredit',},
                                { field: 'name', width: 150},
                                { field: 'tooltip', width: 150,}
                            ],
                            toolbar: [ 'Add','Edit', 'Delete', 'Update', 'Cancel'],
                            editSettings: { 
                              allowAdding: true,
                              allowEditing: true, allowDeleting: true, mode: 'Normal' },
                          });
                          gridObj.appendTo(elem);
                        },
                      },

                    },
                ],
                editDialogFields: [
                    { type: 'General', headerText: 'General' },
                    { type: 'Dependency' },
                    { type: 'Custom', headerText: 'Indicator' },
                ],
                actionBegin: function (args: any) {
                    if (args.requestType === 'beforeOpenEditDialog') {
                        ganttObj['columnByField'].Customfield.visible = true;
                    }
                    if(args.requestType == "beforeSave"){
                        if (Array.isArray(indicatorData)) {
                            const obj = indicatorData.map((indicator: any, index: number) => ({
                                date: new Date(indicator.date),
                                name: indicator.name,
                                tooltip: indicator.tooltip,
                                iconClass: indicator.iconClass || 'okIcon e-icons'
                            }));
                            args.data.Indicators = obj;
                            args.data.ganttProperties.indicators = obj;
                        }
                    }
                },
                enableContextMenu: true,
                allowSelection: true,
                height: '450px',
                treeColumnIndex: 1,
                highlightWeekends: true,
                projectStartDate: new Date('03/24/2019'),
                projectEndDate: new Date('07/06/2019')
                }, done);
            });
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it ('Opening Indicator tab and save action', () => {
            ganttObj.openEditDialog(2);
            let selectIndicator: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_Tab > div.e-tab-header.e-control.e-toolbar.e-lib.e-keyboard > div > div:nth-child(3)') as HTMLElement;
            triggerMouseEvent(selectIndicator, 'click');
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.currentViewData.length).toBe(12);
            expect(ganttObj['columnByField'].Customfield.visible).toBe(true);
        });
    });
    describe('MT:887459-Page is automatically getting refreshed after pressing ENTER Key in custom column tab ', function () {
        let ganttObj: Gantt;
        beforeAll(function (done) {
            ganttObj = createGantt({
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
                    indicators: 'Indicators'
                },
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'Search'],
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
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
        afterAll(function () {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 500);
            ganttObj.openEditDialog(2);
        });
        it('Dialog Custom Tab', () => {
            let selectCustomTab: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_Tab > div.e-tab-header.e-control.e-toolbar.e-lib.e-keyboard > div > div:nth-child(4)') as HTMLElement;
            triggerMouseEvent(selectCustomTab, 'click');
            let customField: any = document.querySelector('#' + ganttObj.element.id + 'CustomColumn') as HTMLInputElement;
            triggerMouseEvent(customField, 'dblclick');
            if (customField) {
                triggerKeyboardEvent(customField, 'keydown', 'Enter');
                expect(document.getElementById(ganttObj.element.id + '_dialog')).toBeDefined();
            }
        });
    });
    describe('CR-890587 actionBegin event used for canceling edit actions is not working properly', () => {
        let ganttObj: Gantt;
        beforeAll(function (done) {
            ganttObj = createGantt({
                dataSource: resourcesDatas1,
                resources: resourceCollections1,
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete'],
                treeColumnIndex: 1,
                height: '550px',
                projectStartDate: new Date('03/28/2019'),
                projectEndDate: new Date('05/18/2019')
            }, done);
        });
        beforeEach((done) => {
            setTimeout(done, 500);
            ganttObj.openEditDialog(2);
        });
        it('Schedule validation- duration', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeSave") {
                    args.cancel = true;
                }
            };
            let durationField: any = document.querySelector('#' + ganttObj.element.id + 'Duration') as HTMLInputElement;
            if (durationField) {
                let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
                textObj.value = '5 days';
                let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
            }
            const dialogElement: HTMLElement = ganttObj.editModule.dialogModule.dialog.querySelector('#' +  ganttObj.element.id + 'DependencyTabContainer');
            expect(dialogElement).toBe(null);
        });  
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('CR- 886123: disable "Add" and "Delete" button in dependency tab when not necessary', () => {
        let ganttObj: Gantt;
        const datas: Object = [
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
                        info:
                            'Obtain an engineered soil test of lot where construction is planned.' +
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
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: datas,
                dateFormat: 'MMM dd, y',
                treeColumnIndex: 1,
                allowSelection: true,
                showColumnMenu: false,
                highlightWeekends: true,
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
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
                }
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Dependency tab editing', () => {
            ganttObj.openEditDialog(1);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
            tab.dataBind();
            const dialog: any = document.getElementById(ganttObj.element.id + 'DependencyTabContainer')['ej2_instances'][0];
            expect(dialog.editSettings.allowAdding).toBe(false)
        });
    });
    describe('Validation Rule on Custom Column', () => {
        let ganttObj: Gantt;
        const logTimeValidation = {
            number: true,
            min: 0,
        };
        const estimatedTimeValidation = {
            number: true,
            min: 0,
        };
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: [],
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
                    notes: 'info',
                    resourceInfo: 'resources',
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
                    { field: 'TaskID' },
                    { field: 'TaskName' },
                    { field: 'StartDate' },
                    {
                        field: 'estimatedTime', editType:'numericedit',format: "yMd",validationRules: {estimatedTimeValidation}
                    },
                    {
                        field: 'logTime', editType:'numericedit', format: "yMd",validationRules: {logTimeValidation}
                    },
                ],
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                'PrevTimeSpan', 'NextTimeSpan', 'ExcelExport', 'CsvExport', 'PdfExport'],
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
                    { resourceId: 12, resourceName: 'Construction Supervisor' }
                ],
                allowUnscheduledTasks: true,
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach(() => {
           ganttObj.openAddDialog();
        });
        it('add record', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType == "refresh") {
                    expect(ganttObj.currentViewData.length).toBe(1);
                }
            }
            let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
        });
    });
    describe('AditionalParams property not working properly', () => {
        let ganttObj: Gantt;
        const datas: Object = [
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
                        info:
                            'Obtain an engineered soil test of lot where construction is planned.' +
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
        ];
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: datas,
                dateFormat: 'MMM dd, y',
                treeColumnIndex: 1,
                allowSelection: true,
                showColumnMenu: false,
                highlightWeekends: true,
                allowUnscheduledTasks: true,
                projectStartDate: new Date('03/25/2019'),
                projectEndDate: new Date('07/28/2019'),
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
                toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll', 'Search', 'ZoomIn', 'ZoomOut', 'ZoomToFit',
                    'PrevTimeSpan', 'NextTimeSpan'],
                editDialogFields: [
                    { type: 'Dependency', additionalParams: { columns: [{ field: 'id', visible: false, headerText: "Iv value" }] } },
                ],
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('AditionalParams dependency tab editing', () => {
            ganttObj.openEditDialog(1);
            let tab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            tab.selectedItem = 1;
            tab.dataBind();
            const dialog: any = document.getElementById(ganttObj.element.id + 'DependencyTabContainer')['ej2_instances'][0];
            expect(dialog.columnModel[0].visible).toBe(false);
            expect(dialog.columnModel[0].field).toBe("id");
            expect(dialog.columnModel[0].headerText).toBe("Iv value");
        });
    });

    describe('Milestone and Work Property Not Working Properly ', () => {
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach(() => {
            ganttObj.openAddDialog();
         });
        it('check Milestone and Work  ', () => {
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            textObj.value = '0 days';
            textObj.dataBind();
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.flatData[0].ganttProperties.isMilestone).toBe(true);
            expect(ganttObj.flatData[0]["isMilestone"]).toBe(true);
            expect(ganttObj.flatData[0].ganttProperties.work).toBe(0);
            expect(ganttObj.flatData[0]['Work']).toBe(0);  
        });
        it('check Milestone as true and Work as number  ', () => {
           let saveRecord: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
           triggerMouseEvent(saveRecord, 'click');
            expect(ganttObj.flatData[0].ganttProperties.isMilestone).toBe(false);
            expect(ganttObj.flatData[0]["isMilestone"]).toBe(false);
            expect(ganttObj.flatData[0].ganttProperties.work).toBe(0);
            expect(ganttObj.flatData[0]['Work']).toBe(0);  
        });
    });
