import { Inputs } from './../../src/gantt/actions/dialog-edit';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Gantt taskbaredit spec
 */
import { Gantt, Edit, Toolbar } from '../../src/index';
import { cellEditData, resourcesData, resources, scheduleModeData, resourceDataTaskType, resourceResources, taskTypeData, taskTypeWorkData, projectData, editingData, customSelfReferenceData, autoDateCalculate, customZoomingdata } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent, triggerKeyboardEvent, getKeyUpObj } from '../base/gantt-util.spec';
import { DatePickerEditCell } from '@syncfusion/ej2-grids';
import { Input } from '@syncfusion/ej2-inputs';
import { RichTextEditor } from '@syncfusion/ej2-richtexteditor';

interface EJ2Instance extends HTMLElement {
     ej2_instances: Object[];
 }
 
Gantt.Inject(Edit, Toolbar);
describe('Gantt Edit module', () => {
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
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Editing task id', () => {
            ganttObj.dataBind();
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(1)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskId') as HTMLElement;
            expect(input).toBe(null);
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
            input.value = '3+5';
            let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.predecessorsName).toBe('3FS+5 days');
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
                expect(ganttObj.currentViewData[1].ganttProperties.resourceNames).toBe('Resource 1');
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
         it('Initial work,workunit,tasktype value checking without unit and work mapping', () => {
             ganttObj.dataBind();
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
             expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(80);
             expect(ganttObj.currentViewData[0].ganttProperties.workUnit).toBe('hour');
             expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
         });
        it('Editing resource column without unit mapping by adding new resource', () => {
            ganttObj.dataBind();
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
            ganttObj.dataBind();
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
            ganttObj.dataBind();
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
         it('Editing duration column without resource unit and work mapping', () => {
             ganttObj.dataBind();
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
              ganttObj.dataBind();
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
              expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(80);
              expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3,Resource 1');
              expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0]['unit']).toBe(100);
              expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1]['unit']).toBe(100);
           });
          it('Editing custom column', () => {
            ganttObj.dataBind();
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
            ganttObj.dataBind();
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(1) > div > span') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[0].expanded).toBe(true);
         });
         it('Editing parent task name with enter key', () => {
            ganttObj.dataBind();
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
         it('Editing parent taskbar', () => {
            ganttObj.dataBind();
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
         it('Unscheduled end task - end date editing', () => {
             ganttObj.dataBind();
             let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(4)') as HTMLElement;
             triggerMouseEvent(endDate, 'dblclick');
             let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
             input.value = new Date('04/03/2019');
             let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element, 'click');
             expect(ganttObj.getFormatedDate(ganttObj.currentViewData[5].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/3/2019');
         });
         it('Unscheduled end task - start date editing', () => {
             ganttObj.dataBind();
             let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(3)') as HTMLElement;
             triggerMouseEvent(startDate, 'dblclick');
             let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
             input.value = new Date('04/01/2019');
             let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element, 'click');
             expect(ganttObj.getFormatedDate(ganttObj.currentViewData[5].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/1/2019');
         });
         it('Unscheduled end task - duration editing', () => {
             ganttObj.dataBind();
             let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(3)') as HTMLElement;
             triggerMouseEvent(startDate, 'dblclick');
             let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
             input.value = null;
             let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element, 'click');
             let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(5)') as HTMLElement;
             triggerMouseEvent(duration, 'dblclick');
             let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
             durationInput.value = '4 days';
             triggerMouseEvent(element, 'click');
             expect(ganttObj.currentViewData[5].ganttProperties.duration).toBe(4);
         });
         it('Unscheduled duration task - duration editing', () => {
             ganttObj.dataBind();
             let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(7) > td:nth-child(5)') as HTMLElement;
             triggerMouseEvent(duration, 'dblclick');
             let durationInput: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
             durationInput.value = '4 days';
             let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element, 'click');
             expect(ganttObj.currentViewData[6].ganttProperties.duration).toBe(4);
         });
         it('Unscheduled duration task - start date editing', () => {
             ganttObj.dataBind();
             let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(7) > td:nth-child(3)') as HTMLElement;
             triggerMouseEvent(startDate, 'dblclick');
             let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
             input.value = new Date('04/01/2019');
             let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element, 'click');
             expect(ganttObj.getFormatedDate(ganttObj.currentViewData[6].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/1/2019');
         });
         it('Unscheduled duration task - end date editing', () => {
             ganttObj.dataBind();
             let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(7) > td:nth-child(3)') as HTMLElement;
             triggerMouseEvent(startDate, 'dblclick');
             let input: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as any).ej2_instances[0];
             input.value = null;
             let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
             triggerMouseEvent(element, 'click');
             let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(7) > td:nth-child(4)') as HTMLElement;
             triggerMouseEvent(endDate, 'dblclick');
             let endDateInput: any = (document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolEndDate') as any).ej2_instances[0];
             endDateInput.value = new Date('04/03/2019');
             triggerMouseEvent(element, 'click');
             expect(ganttObj.getFormatedDate(ganttObj.currentViewData[6].ganttProperties.endDate, 'M/d/yyyy')).toBe('4/3/2019');
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
        it('Milestone task - start date editing', () => {
            ganttObj.dataBind();
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
            ganttObj.dataBind();
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
            ganttObj.dataBind();
            let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
            triggerMouseEvent(duration, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
            input.value = '';
            let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
            triggerMouseEvent(update, 'click');
            expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(null);
        });
        it('Editing dependency column', () => {
            ganttObj.dataBind();
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
            expect(ganttObj.currentViewData[2].ganttProperties.predecessorsName).toBe(null);
            expect(ganttObj.currentViewData[3].ganttProperties.predecessorsName).toBe('2FF+3 days');
            expect(ganttObj.currentViewData[4].ganttProperties.predecessorsName).toBe('3SF+5 hours');
            expect(ganttObj.currentViewData[5].ganttProperties.predecessorsName).toBe('4SS+50 minutes');
        });
        it('Editing task name with dialog close arguments', () => {
            ganttObj.actionBegin = function (args: any): void {
                if (args.requestType === "beforeOpenEditDialog") {
                    args.dialogModel.animationSettings = { 'effect': 'none' };
                }
            };
            ganttObj.dataBind();
            let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(taskName, 'dblclick');
            let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
            input.value = 'TaskName updated';
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
        });
        it('Editing notes column-Dialog', (done) => {
            ganttObj.dataBind();
            let notes: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(11)') as HTMLElement;
            triggerMouseEvent(notes, 'dblclick');
            setTimeout(done, 1000);
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType == "openEditDialog") {
                    let element: any = document.getElementById(ganttObj.element.id + 'NotesTabContainer') as HTMLElement;
                    if (element && !isNullOrUndefined(element.value)) {
                        let input: any = (element as any).ej2_instances[0];
                        input.value = 'updated';
                        let save: any = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
                        triggerMouseEvent(save, 'click');
                        expect(ganttObj.currentViewData[1].ganttProperties.notes).toBe('updated');
                    }
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
            ganttObj.dataBind();
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
        it('Editing with tab navigation - next row', () => {
            ganttObj.dataBind();
            let customColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(12)') as HTMLElement;
            triggerMouseEvent(customColumn, 'dblclick');
            let args: any = { action: 'tab', preventDefault: preventDefault, target: ganttObj.treeGrid.grid.element.querySelector('.e-editedbatchcell') } as any;
            ganttObj.keyboardModule.keyAction(args);
            let args1: any = { action: 'tab', preventDefault: preventDefault, target: ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(1)') as HTMLElement };
            ganttObj.keyboardModule.keyAction(args1);
            expect(ganttObj.treeGrid.grid.isEdit).toBe(true);
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
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Editing end date column to weekend', () => {
            let endDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(4) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(endDate, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolEndDate')as any).ej2_instances[0];
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
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Shimmer expand collapse', () => {
            ganttObj.selectRow(0);
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(1) > div > span') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(document.querySelector('.e-spinner-pane').classList.contains("e-spin-hide")).toBe(true)
        });
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Resource column - Initial', () => {
        ganttObj.dataBind();
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3[40%],Resource 1');
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(40);
        expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1][ganttObj.resourceFields.unit]).toBe(100);//unit value not set for resource1 in datasource,hence set as 100
    });
    it('Initial work,workunit,tasktype value checking without work mapping', () => {
        ganttObj.dataBind();
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
        ganttObj.dataBind();
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
        ganttObj.dataBind();
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    it('Initial work,workunit,tasktype value checking with work mapping', () => {
        ganttObj.dataBind();
        //Task without resource
        expect(ganttObj.currentViewData[1].ganttProperties.resourceInfo).toBe(null);
        expect(ganttObj.currentViewData[1].ganttProperties.work).toBe(40.45);
        expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(3);
        expect(ganttObj.currentViewData[1].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedWork');
        //Task with resource
        expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3[41.67%],Resource 1[41.67%]');
        expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(20);
        expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(3);
        expect(ganttObj.currentViewData[2].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedWork');
        //Parent Task without resource
        expect(ganttObj.currentViewData[0].ganttProperties.resourceInfo).toBe(null);
        expect(ganttObj.currentViewData[0].ganttProperties.work).toBe(140.45);
        expect(ganttObj.currentViewData[0].ganttProperties.duration).toBe(3);
        expect(ganttObj.currentViewData[0].ganttProperties.workUnit).toBe('hour');
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
    });
    it('Editing Work column with fixed work', () => {
         ganttObj.dataBind();
         expect(ganttObj.currentViewData[2].ganttProperties.resourceNames).toBe('Resource 3[41.67%],Resource 1[41.67%]');
         expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(41.67);
         expect(ganttObj.currentViewData[2].ganttProperties.resourceInfo[1][ganttObj.resourceFields.unit]).toBe(41.67);
         expect(ganttObj.currentViewData[2].ganttProperties.work).toBe(20);
         expect(ganttObj.currentViewData[2].ganttProperties.duration).toBe(3);
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
         ganttObj.dataBind();
         expect(ganttObj.currentViewData[3].ganttProperties.resourceNames).toBe('Resource 4');
         expect(ganttObj.currentViewData[3].ganttProperties.resourceInfo[0][ganttObj.resourceFields.unit]).toBe(100);
         expect(ganttObj.currentViewData[3].ganttProperties.work).toBe(80);
         expect(ganttObj.currentViewData[3].ganttProperties.duration).toBe(0);
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
             expect(ganttObj.currentViewData[6].ganttProperties.resourceNames).toBe('Resource 2');
             expect(ganttObj.currentViewData[6].ganttProperties.workUnit).toBe('day');
             done();
         };
         ganttObj.refresh();
     });
    it('Work unit checking with minute', (done) => {
        ganttObj.dataBind();
        ganttObj.workUnit = 'Minute';
        ganttObj.dataBound = () => {
            expect(ganttObj.currentViewData[3].ganttProperties.resourceNames).toBe('Resource 4');
            expect(ganttObj.currentViewData[3].ganttProperties.workUnit).toBe('minute');
            done();
        };
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
                { field: 'taskType', headerText: 'Task Type', width: '110' }
            ],
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
    it('task type on load time', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedUnit');
        expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[7].ganttProperties.taskType).toBe('FixedUnit');
        expect(ganttObj.currentViewData[8].ganttProperties.taskType).toBe('FixedDuration');
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 1000);
        // ganttObj.openEditDialog(3);
    });
    it('task type with work mapping on load time', () => {
        expect(ganttObj.currentViewData[0].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[1].ganttProperties.taskType).toBe('FixedWork');
        expect(ganttObj.currentViewData[2].ganttProperties.taskType).toBe('FixedDuration');
        expect(ganttObj.currentViewData[7].ganttProperties.taskType).toBe('FixedWork');
        expect(ganttObj.currentViewData[8].ganttProperties.taskType).toBe('FixedDuration');
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    beforeEach((done: Function) => {
        setTimeout(done, 1000);
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
        expect(ganttObj.currentViewData[5].ganttProperties.resourceInfo[0]['unit']).toBe(125);
        let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(5)')
        triggerMouseEvent(duration, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
        input.value = '8 days';
        let update: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + '_Gantt_Toolbar > div > div:nth-child(3)') as HTMLElement;
        triggerMouseEvent(update, 'click');
        expect(ganttObj.currentViewData[5].ganttProperties.resourceInfo[0]['unit']).toBe(46.88);
    });
    it('Adding a new task after performing expand/collapse multiple times', () => {
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(1) > td:nth-child(1) > div > span') as HTMLElement;
        triggerMouseEvent(element, 'dblclick');
        ganttObj.openAddDialog();
        let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
        triggerMouseEvent(saveButton, 'click');
        expect(ganttObj.currentViewData[0]['TaskID']).toBe(10);
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
            ganttObj.openAddDialog();
            let notesTab: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + '_Tab')).ej2_instances[0];
            notesTab.selectedItem = 3;
        });
        it('Add Notes using add dialog', () => {
            ganttObj.actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    expect(ganttObj.currentViewData[0].ganttProperties.notes).toBe('<p>Updated</p>');
                }
            };
            let notesTab: RichTextEditor = (document.getElementById(ganttObj.element.id + 'NotesTabContainer') as any).ej2_instances[0]
            notesTab.value = "Updated";
			notesTab.dataBind();
            let saveButton: HTMLElement = document.querySelector('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control.e-btn.e-lib.e-primary.e-flat') as HTMLElement;
            triggerMouseEvent(saveButton, 'click');
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
        });
        it('update taskID using updateTaskId method', () => {
            // let gantt: any = (document.getElementsByClassName('e-gantt')[0] as any).ej2_instances[0];
            ganttObj.updateTaskId(2,40);
            expect(ganttObj.currentViewData[1]['TaskID']).toBe('40');
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Timeline unit count', () => {
            expect(ganttObj.timelineModule.customTimelineSettings.topTier.count).toBe(5);
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
        });
        it('Tab navigation to next row', () => {
            ganttObj.dataBind();
            let customColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(7)') as HTMLElement;
            triggerMouseEvent(customColumn, 'dblclick');
            let args: any = { action: 'tab', preventDefault: preventDefault, target: ganttObj.treeGrid.grid.element.querySelector('.e-editedbatchcell') } as any;
            ganttObj.keyboardModule.keyAction(args);
            let args1: any = { action: 'tab', preventDefault: preventDefault, target: ganttObj.treeGrid.grid.element.querySelector('.e-editedbatchcell') } as any;
            ganttObj.keyboardModule.keyAction(args1);
            expect(ganttObj.treeGrid.grid.isEdit).toBe(true);
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
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach((done) => {
            setTimeout(done, 1000);
        });
        it('Cell edit milestone', () => {
            ganttObj.dataBind();
            let customColumn: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(5) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(customColumn, 'dblclick');
            let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')as any).ej2_instances[0];
            input.value = new Date('2/8/2017');
            let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(6) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(element, 'click');
            expect(ganttObj.getFormatedDate(ganttObj.currentViewData[4].ganttProperties.startDate,'M/d/yyyy')).toBe('2/8/2017');
        });
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
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Editing task name and save in chart side', () => {
        ganttObj.dataBind();
        let taskName: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(taskName, 'dblclick');
        let input: any = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolTaskName') as HTMLElement;
        input.value = 'TaskName updated';
        let row: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(4) > td > div.e-left-label-container') as HTMLElement;
        triggerMouseEvent(row, 'mousedown', 10, 10, false, true);
        triggerMouseEvent(row, 'mousedown', 10, 10, false, true);
        expect(ganttObj.currentViewData[1].ganttProperties.taskName).toBe('TaskName updated');
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
    beforeEach((done: Function) => {
        setTimeout(done, 500);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Editing start date', () => {
        ganttObj.dataBind();
        let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
        triggerMouseEvent(startDate, 'dblclick');
        let input: any = (document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrolStartDate')as any).ej2_instances[0];
        input.value = new Date('04/04/2019');
        let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
        triggerMouseEvent(element, 'click');
        expect(ganttObj.getFormatedDate(ganttObj.currentViewData[1].ganttProperties.startDate, 'M/d/yyyy')).toBe('4/4/2019');
     
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
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('Checking gantt renders', () => {
        expect(ganttObj.currentViewData.length > 0).toBe(true);
    });
});
