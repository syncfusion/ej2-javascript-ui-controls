/**
 * Gantt base spec
 */
import { Gantt, Toolbar, Edit } from '../../src/index';
import { timezoneData, projectData1, newData, taskMode, splitTasksData } from '../base/data-source.spec'
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
    describe('Week working time', () => {
        Gantt.Inject(Toolbar, Edit);
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: projectData1,
                    allowSelection: true,
                    allowResizing: true,
                    allowSorting: true,
                    enableContextMenu: true,
                    weekWorkingTime:[{dayOfWeek:'Monday',timeRange:[{from:10,to:12},{from:13,to:16}]},{dayOfWeek:'Tuesday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 17 }]},{dayOfWeek:'Thursday',timeRange:[{ from: 9, to: 12 }, { from: 13, to: 16 }]}],                  
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        progress: 'Progress',
                        child: 'subtasks',
                        dependency: 'Predecessor'
                    },
                    editSettings: {
                    allowAdding: true,
                    allowEditing: true,
                    allowDeleting: true,
                    allowTaskbarEditing: true,
                    showDeleteConfirmDialog: true
                    },
                    toolbar: ['Add', 'Edit', 'Update', 'Delete', 'Cancel', 'ExpandAll', 'CollapseAll',
                            { text: 'update', id: 'update' }],
                    projectStartDate: new Date('02/01/2017'),
                    projectEndDate: new Date('12/30/2017'),
                    rowHeight: 40,
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('initial render on week working time', () => {
           expect(ganttObj.weekWorkingTime.length).toBe(3);
           expect(ganttObj.flatData[2].ganttProperties.startDate.getHours()).toBe(10);
           expect(ganttObj.flatData[2].ganttProperties.endDate.getHours()).toBe(17);
        });
    });
    describe('Week working time', () => {
        Gantt.Inject(Toolbar, Edit);
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: newData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                weekWorkingTime:[{dayOfWeek:'Monday',timeRange:[{from:10,to:12},{from:13,to:16}]},{dayOfWeek:'Tuesday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 17 }]}],                  
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
                    { field: 'CustomColumn', headerText: 'CustomColumn' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
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
        it('initial render on week working time', () => {
           expect(ganttObj.flatData[3].ganttProperties.startDate.getHours()).toBe(8);
           expect(ganttObj.flatData[3].ganttProperties.endDate.getHours()).toBe(17);
           expect(ganttObj.flatData[1].ganttProperties.baselineStartDate.getHours()).toBe(10);
        });
        it('Edit date', () => {
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(3)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let dateElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolStartDate') as HTMLElement;
            if (dateElement) {
                let input: any = dateElement.ej2_instances[0];
                input.value = new Date('04/03/2019');
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
                expect(ganttObj.currentViewData[1].ganttProperties.startDate.getHours()).toBe(8);
                expect(ganttObj.currentViewData[1].ganttProperties.endDate.getHours()).toBe(17);
            }
        });
        it('Edit duration', () => {
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(2) > td:nth-child(4)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let dateElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
            if (dateElement) {
                let input: any = dateElement.ej2_instances[0];
                input.value = '4.5 days';
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
                expect(ganttObj.currentViewData[1].ganttProperties.startDate.getHours()).toBe(13);
                expect(ganttObj.currentViewData[3].ganttProperties.endDate.getHours()).toBe(13);
            }
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Week working time', () => {
        Gantt.Inject(Toolbar, Edit);
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: newData,
                allowSorting: true,
                allowReordering: true,
                enableContextMenu: true,
                weekWorkingTime:[{dayOfWeek:'Monday',timeRange:[{from:10,to:12},{from:13,to:16}]},{dayOfWeek:'Tuesday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 17 }]}],                  
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
                    { field: 'Duration', headerText: 'Duration'},
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false }, 
                    { field: 'Predecessor', headerText: 'Predecessor' }
                ],
                sortSettings: {
                    columns: [{ field: 'TaskID', direction: 'Ascending' }, 
                    { field: 'TaskName', direction: 'Ascending' }]
                },
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
                eventMarkers: [
                    {
                        day: '04/10/2019',
                        cssClass: 'e-custom-event-marker',
                        label: 'Project approval and kick-off'
                    }
                ],
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
        it('Edit dependency offset', () => {
            let startDate: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(6)') as HTMLElement;
            triggerMouseEvent(startDate, 'dblclick');
            let dateElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
            if (dateElement) {
                let input: any = dateElement.ej2_instances[0];
                input.value = '2FS+2';
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
                expect(ganttObj.currentViewData[3].ganttProperties.startDate.getHours()).toBe(10);
            }
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        
    });
    describe('Week working time for manual task mode', () => {
        Gantt.Inject(Toolbar, Edit);
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: taskMode,
        allowSorting: true,
        enableContextMenu: true,
        height: '450px',
        allowSelection: true,
        highlightWeekends: true,
        weekWorkingTime:[{dayOfWeek:'Monday',timeRange:[{from:10,to:12},{from:13,to:16}]},{dayOfWeek:'Tuesday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 17 }]},{dayOfWeek:'Saturday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 17 }]},{dayOfWeek:'Sunday',timeRange:[{ from: 9, to: 12 }, { from: 13, to: 16 }]}],
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
        it('manual mode rendering', () => {
            expect(ganttObj.flatData[2].ganttProperties.startDate.getHours()).toBe(9);
            expect(ganttObj.flatData[2].ganttProperties.endDate.getHours()).toBe(17);
            expect(ganttObj.flatData[2].ganttProperties.duration).toBe(6);
            expect(ganttObj.flatData[8].ganttProperties.duration).toBe(6);
        });
        it('Edit duration', () => {
            let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
            triggerMouseEvent(duration, 'dblclick');
            let dateElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
            if (dateElement) {
                let input: any = dateElement.ej2_instances[0];
                input.value = '7.5 days';
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
                expect(ganttObj.currentViewData[2].ganttProperties.endDate.getHours()).toBe(12);
                expect(ganttObj.currentViewData[1].ganttProperties.duration).toBe(5);
            }
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Week working time for split tasks', () => {
        Gantt.Inject(Toolbar, Edit);
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: splitTasksData,
                allowSorting: true,
                allowReordering: true,
                weekWorkingTime:[{dayOfWeek:'Monday',timeRange:[{from:10,to:12},{from:13,to:16}]},{dayOfWeek:'Tuesday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 16 }]},{dayOfWeek:'Saturday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 17 }]},{dayOfWeek:'Sunday',timeRange:[{ from: 9, to: 12 }, { from: 13, to: 16 }]}],
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
        it('split task rendering', () => {
            expect(ganttObj.flatData[2].ganttProperties.endDate.getHours()).toBe(16);
            expect(ganttObj.flatData[8].ganttProperties.startDate.getHours()).toBe(8);
        });
        it('Edit duration', () => {
            let duration: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(5)') as HTMLElement;
            triggerMouseEvent(duration, 'dblclick');
            let dateElement: any = document.getElementById('treeGrid' + ganttObj.element.id + '_gridcontrolDuration') as HTMLElement;
            if (dateElement) {
                let input: any = dateElement.ej2_instances[0];
                input.value = '9.5 days';
                let element: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_content_table > tbody > tr:nth-child(3) > td:nth-child(2)') as HTMLElement;
                triggerMouseEvent(element, 'click');
                expect(ganttObj.currentViewData[2].ganttProperties.endDate.getHours()).toBe(13);
                expect(ganttObj.currentViewData[2].ganttProperties.segments[2].endDate.getHours()).toBe(13);
                expect(ganttObj.currentViewData[8].ganttProperties.endDate.getHours()).toBe(10);
                expect(ganttObj.currentViewData[8].ganttProperties.endDate.getMinutes()).toBe(30);
            }
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('Map both week working and day working time', () => {
        Gantt.Inject(Toolbar, Edit);
        let ganttObj: Gantt;

        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: splitTasksData,
                allowSorting: true,
                allowReordering: true,
                dayWorkingTime:[{ from: 9, to: 15 }],
                weekWorkingTime:[{dayOfWeek:'Monday',timeRange:[{from:10,to:12},{from:13,to:16}]},{dayOfWeek:'Tuesday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 16 }]},{dayOfWeek:'Saturday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 17 }]},{dayOfWeek:'Sunday',timeRange:[{ from: 9, to: 12 }, { from: 13, to: 16 }]}],
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
        it('split task rendering', () => {
            expect(ganttObj.flatData[3].ganttProperties.endDate.getHours()).toBe(15);
            expect(ganttObj.flatData[7].ganttProperties.startDate.getHours()).toBe(9);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
    describe('unscheduled tasks', () => {
        Gantt.Inject(Toolbar, Edit);
        let ganttObj: Gantt;
        var unscheduledData = [
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
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                dataSource: unscheduledData,
        enableContextMenu: true,
        dayWorkingTime:[{ from: 9, to: 15 }],
                weekWorkingTime:[{dayOfWeek:'Monday',timeRange:[{from:10,to:12},{from:13,to:16}]},{dayOfWeek:'Tuesday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 16 }]},{dayOfWeek:'Saturday',timeRange:[{ from: 10, to: 12 }, { from: 13, to: 17 }]},{dayOfWeek:'Sunday',timeRange:[{ from: 9, to: 12 }, { from: 13, to: 16 }]}],
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
        eventMarkers: [
            {
                day: '04/11/2019',
                cssClass: 'e-custom-event-marker',
                label: 'Project approval and kick-off'
            }
        ],
        holidays: [{
                from: "04/16/2019",
                to: "04/16/2019",
                label: " Public holidays",
                cssClass: "e-custom-holiday"
            },
            {
                from: "03/26/2019",
                to: "03/26/2019",
                label: " Public holiday",
                cssClass: "e-custom-holiday"
            }],
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
        it('unscheduled task rendering', () => {
            expect(ganttObj.flatData[2].ganttProperties.startDate.getHours()).toBe(9);
            expect(ganttObj.flatData[3].ganttProperties.endDate.getHours()).toBe(16);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
    });
});
