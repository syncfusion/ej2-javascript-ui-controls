/**
 * Gantt taskbaredit spec
 */
import { Gantt, Edit, Toolbar } from '../../src/index';
import { dialogEditData, resourcesData } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { EJ2Instance } from '@syncfusion/ej2-navigations';
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
    columns: [
        { field: 'TaskID', width: 60 },
        { field: 'TaskName', width: 100 },
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
        beforeEach(() => {
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
        it('Schedule validation- Null values', () => {
            ganttObj.dataBind();
            let cancelRecord: HTMLElement = ganttObj.element.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(cancelRecord, 'click');
            ganttObj.dataSource[1].StartDate = null;
            ganttObj.dataSource[1].EndDate = null;
            ganttObj.dataSource[1].Duration = null;
            ganttObj.dataBind();
            ganttObj.refresh();
            ganttObj.openEditDialog(5);
            let SD: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'StartDate')).ej2_instances[0];
            SD.value = new Date('04/09/2019');
            SD.dataBind();
            let ED: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'EndDate')).ej2_instances[0];
            expect(ED.value).toBe(null);
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            expect(textObj.value).toBe('');
            triggerMouseEvent(cancelRecord, 'click');
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
        beforeEach(() => {
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
            let row: HTMLElement = ganttObj.element.querySelector('#'+ ganttObj.element.id + 'DependencyTabContainer_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
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
        beforeEach(() => {
            ganttObj.openEditDialog(5);
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
                    expect(ganttObj.currentViewData[4].ganttProperties.resourceNames).toBe("Resource 1");
                }
            };
            ganttObj.dataBind();
            let checkbox: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'ResourcesTabContainer_content_table > tbody > tr:nth-child(1) > td:nth-child(1) > div.e-checkbox-wrapper > input.e-checkselect') as HTMLElement;
            if (checkbox) {
                triggerMouseEvent(checkbox, 'click');
                let saveRecord: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                triggerMouseEvent(saveRecord, 'click');
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
});