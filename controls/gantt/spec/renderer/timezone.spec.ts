/**
 * Gantt base spec
 */
import { Gantt, Toolbar, Edit } from '../../src/index';
import { timezoneData } from '../base/data-source.spec'
import { extend } from '@syncfusion/ej2-base';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';
import { IGanttData, IActionBeginEventArgs } from '../../src/gantt/base/interface';
interface EJ2Instance extends HTMLElement {
    ej2_instances: Object[];
}
describe('Gantt-Timezone', () => {

    describe('Gantt timezone module', () => {
        Gantt.Inject(Toolbar, Edit);
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: timezoneData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'Children',
                },
                editSettings:{
                    allowTaskbarEditing:true,
                    allowEditing:true,
                },
                timelineSettings: { topTier: { unit: 'Day' }, bottomTier: { unit: 'Hour' } },
                durationUnit: 'Hour',
                timezone: 'UTC',
                dayWorkingTime: [{ from: 8, to: 17 }],
                toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit', 'PrevTimeSpan', 'NextTimeSpan'],
                projectStartDate: new Date('02/05/2018'),
                projectEndDate: new Date('03/24/2018'),
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });

        //None
        // it('Check timezone on load', () => {
        //     expect((ganttObj.currentViewData[1][ganttObj.taskFields.startDate].getHours())).toBe(8);           
        //     ganttObj.timezone = 'europe/brussels';
        //     ganttObj.dataBind();
        //     ganttObj.dataSource = timezoneData;
        //     ganttObj.dataBind();
        //     expect((ganttObj.flatData[1][ganttObj.taskFields.startDate].getHours())).toBe(9);
        //     expect((ganttObj.flatData[1][ganttObj.taskFields.startDate].getMinutes())).toBe(30);
        // });
        it('Check CRUD values on dialog edit', () => {
            ganttObj.openEditDialog(2);
            let textObj: any = (<EJ2Instance>document.getElementById(ganttObj.element.id + 'Duration')).ej2_instances[0];
            textObj.value = '5 hours';
            textObj.dataBind();
            let saveRecord: HTMLElement = document.querySelectorAll('#' + ganttObj.element.id + '_dialog > div.e-footer-content > button.e-control')[1] as HTMLElement;
            triggerMouseEvent(saveRecord, 'click');
            ganttObj.actionComplete = (args: IActionBeginEventArgs): void => {
                if (args.requestType === 'save') {
                    //Checking work values of task which have resource after duration editing
                    expect((args.modifiedTaskData[0]["taskData"] as IGanttData)[ganttObj.taskFields.startDate].getHours).toBe(14);
                }
            }
        });
        // it('Check CRUD values on taskbaredit', () => {
        //     let $tr: HTMLElement = ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-taskbar-main-container') as HTMLElement;
        //     // triggerMouseEvent($tr, 'mousedown');
        //     triggerMouseEvent($tr, 'mousemove',  $tr.offsetLeft,  $tr.offsetTop);
        //     triggerMouseEvent($tr, 'mousemove', $tr.offsetLeft + 180, 10);
        //     triggerMouseEvent($tr, 'mouseup');
        //     // expect((ganttObj.currentViewData[1][ganttObj.taskFields.startDate].getHours())).toBe(11);
        //     ganttObj.actionComplete = (args: IActionBeginEventArgs): void => {
        //         if (args.requestType === 'save') {
        //             //Checking work values of task which have resource after duration editing
        //             // expect((args.modifiedTaskData[0]["taskData"] as IGanttData)[ganttObj.taskFields.startDate].getHours).toBe(15);
        //             // expect((args.modifiedTaskData[0]["taskData"] as IGanttData)[ganttObj.taskFields.startDate].getMinutes).toBe(30);
        //         }
        //     }
        // })
    });
});
