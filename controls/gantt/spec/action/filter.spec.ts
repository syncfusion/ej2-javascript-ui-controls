/**
 * Gantt filter spec
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { actionComplete } from '@syncfusion/ej2-grids';
import { Gantt, Filter, Toolbar, ColumnMenu } from '../../src/index';
import { projectData1, projectResources, filteredData, baselineData1 } from '../base/data-source.spec';
import { createGantt, destroyGantt, triggerMouseEvent } from '../base/gantt-util.spec';

describe('Gantt filter support', () => {
    describe('Gantt filter action', () => {
        Gantt.Inject(Filter, Toolbar, ColumnMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
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
                    resources: projectResources,
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
            expect(ganttObj.currentViewData.length).toBe(41);
        });

     //  it('TaskID FilterMenu Click Function', () => {
     //      let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[0] as HTMLElement;
     //      triggerMouseEvent(filterMenuIcon, 'click');
     //      let input: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('.e-numerictextbox'));
     //      if (input) {
     //          ganttObj.dataBound = () => {
     //              expect(ganttObj.currentViewData.length).toBe(1);
     //              ganttObj.dataBound = null;
     //              ganttObj.dataBind();                    
     //          }
     //          ganttObj.dataBind();
     //          let inputValue: any = (document.getElementsByClassName('e-numerictextbox')[0] as any).ej2_instances[0];
     //          inputValue.value = 1;
     //          inputValue.dataBind();
     //          let filterButton: HTMLElement = document.body.querySelector('.e-flmenu-okbtn') as HTMLElement;
     //          triggerMouseEvent(filterButton, 'click');
     //      }
     //  });

        it('Predecessor FilterMenu Click Function', () => {
            ganttObj.clearFiltering();
            let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[5] as HTMLElement;
            triggerMouseEvent(filterMenuIcon, 'click');
            expect(ganttObj.element.querySelectorAll('.e-headercell')[5].getElementsByClassName('e-headertext')[0].textContent).toBe('Predecessor');
            let clearButton: HTMLElement = document.body.querySelector('.e-flmenu-cancelbtn') as HTMLElement;
            triggerMouseEvent(clearButton, 'click');
        });

        it('Filter item in column menu click action', (done: Function) => {
            ganttObj.showColumnMenu = true;
            ganttObj.dataBound = () => {
                let columnMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-columnmenu')[0] as HTMLElement;
                triggerMouseEvent(columnMenuIcon, 'click');
                let filterIcon: HTMLElement = document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_colmenu_Filter').getElementsByClassName('e-icon-filter')[0] as HTMLElement;
                triggerMouseEvent(filterIcon, 'click');
                expect(document.body.querySelector('.e-flmenu')).not.toBe(null);
                done();
            }
            ganttObj.refresh();
        });

        it('ColumnMenuOpen Function', () => {
            let columnMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-columnmenu')[0] as HTMLElement;
            triggerMouseEvent(columnMenuIcon, 'click');
            let filterIcon: HTMLElement = document.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol_colmenu_Filter').getElementsByClassName('e-icon-filter')[0] as HTMLElement;
            triggerMouseEvent(filterIcon, 'click');
            expect(document.body.querySelector('.e-flmenu')).not.toBe(null);
        });

        it('Disable Filtering and enable Search Toolbar', (done: Function) => {
            ganttObj.allowFiltering = false;
            ganttObj.toolbar = ['Search'];
            ganttObj.dataBound = () => {
                expect(ganttObj.allowFiltering).toBe(false);
                done();
            }
            ganttObj.refresh();
        });

        // it('Filter by public method', () => {
        //     ganttObj.filterByColumn('TaskName', 'startswith', 'planning', '', true);
        //     expect(ganttObj.currentViewData.length).toBe(0);
        // });
    });
    
    describe('Gantt Excel filter action', () => {
        Gantt.Inject(Filter, Toolbar, ColumnMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
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
                    resources: projectResources,
                    splitterSettings: {
                        columnIndex: 7,
                    },
                    load: function (args) {
                        let ganttObj: Gantt = (document.getElementsByClassName('e-gantt')[0] as any).ej2_instances[0];;
                        ganttObj.treeGrid.filterSettings.type = "Excel";
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
    });

    describe('Excel like Filter Support', () => {
        Gantt.Inject(Filter, Toolbar, ColumnMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
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
                    resources: projectResources,
                    splitterSettings: {
                        columnIndex: 7,
                    },
                    filterSettings: {
                        type: "Excel"
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
            setTimeout(done, 2000);
            ganttObj.clearFiltering();
            done();
        });
        it('Clear Filter by public method', () => {
            ganttObj.clearFiltering();
            expect(ganttObj.currentViewData.length).toBe(41);
        });
    });
    describe('Gantt Excel filter action', () => {
        Gantt.Inject(Filter, Toolbar, ColumnMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
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
                    resources: projectResources,
                    splitterSettings: {
                        columnIndex: 7,
                    },
                    load: function (args) {
                        let ganttObj: Gantt = (document.getElementsByClassName('e-gantt')[0] as any).ej2_instances[0];;
                        ganttObj.treeGrid.filterSettings.type = "Excel";
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
        beforeEach((done: Function) => {
            setTimeout(done, 500);
        });
        // it('Check the filtered records for checkbox count', (done: Function) => {
        //     ganttObj.actionComplete = function (args: any): void {
        //       if(args.requestType === 'filterchoicerequest'){
        //       expect(document.getElementsByClassName('e-label e-checkboxfiltertext').length == 6).toBe(true);
        //       done();
        //       }
        //     }
        //     ganttObj.filterByColumn("duration","equal",11);
        //     (<HTMLElement>ganttObj.element.querySelectorAll('.e-filtermenudiv')[1]).click();
        // });
        // it('Initial Filtering resourceID', () => {
        //     ganttObj.actionComplete = function (args: any): void {
        //         if(args.requestType === 'filtering'){
        //         expect(ganttObj.currentViewData.length).toBe(20);
        //         }
        //       }
        //     let element: any = document.getElementsByClassName('e-label e-checkboxfiltertext')[0];
        //     triggerMouseEvent(element, 'click');
        //     let element1: any = document.getElementsByClassName('e-label e-checkboxfiltertext')[1]
        //     triggerMouseEvent(element1, 'click');
        //     let element2: any = document.getElementsByClassName('e-footer-content')[0].children[0];
        //     triggerMouseEvent(element2, 'click');
        // });
    });
    describe('Gantt Excel filter action', () => {
        Gantt.Inject(Filter, Toolbar, ColumnMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
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
                    resources: projectResources,
                    splitterSettings: {
                        columnIndex: 7,
                    },
                    load: function (args) {
                        let ganttObj: Gantt = (document.getElementsByClassName('e-gantt')[0] as any).ej2_instances[0];;
                        ganttObj.treeGrid.filterSettings.type = "Excel";
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
        beforeEach((done: Function) => {
            setTimeout(done, 1000);
        });
        // it('Task Name check box count', (done: Function) => {
        //     ganttObj.actionComplete = function (args: any): void {
        //       if(args.requestType === 'filterchoicerequest'){
        //       expect(document.getElementsByClassName('e-label e-checkboxfiltertext').length).toBe(32);
        //       done();
        //       }
        //     }
        //     ganttObj.filterByColumn("duration","equal",11);
        //     (<HTMLElement>ganttObj.element.querySelectorAll('.e-filtermenudiv')[2]).click();
        // });
        // it('Initial Filtering Task Name', () => {
        //     ganttObj.actionComplete = function (args: any): void {
        //         if(args.requestType === 'filtering'){
        //         expect(ganttObj.currentViewData.length).toBe(3);
        //         }
        //       }
        //     let element: any = document.getElementsByClassName('e-label e-checkboxfiltertext')[0];
        //     triggerMouseEvent(element, 'click');
        //     let element1: any = document.getElementsByClassName('e-label e-checkboxfiltertext')[1]
        //     triggerMouseEvent(element1, 'click');
        //     let element3: any = document.getElementsByClassName("e-control e-btn e-lib e-primary e-flat")[0];
        //     triggerMouseEvent(element3, 'click');
        // });
    });
    describe('Gantt disable filter for one column', () => {
        Gantt.Inject(Filter, Toolbar, ColumnMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
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
                    resources: projectResources,
                    splitterSettings: {
                        columnIndex: 7,
                    },
                    load: function (args) {
                        let ganttObj: Gantt = (document.getElementsByClassName('e-gantt')[0] as any).ej2_instances[0];;
                        ganttObj.treeGrid.filterSettings.type = "Excel";
                    },
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID' },
                        { field: 'ResourceId', headerText: 'Resources' },
                        { field: 'TaskName', headerText: 'Task Name' },
                        { field: 'StartDate', headerText: 'Start Date' },
                        { field: 'Duration', headerText: 'Duration', allowFiltering: false },
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
        
     //   it('Filtering Taskname', () => {
     //       let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[0] as HTMLElement;
     //           triggerMouseEvent(filterMenuIcon, 'click');
     //           let input: HTMLElement = document.querySelector('.e-numerictextbox');
     //           if (input) {
     //               ganttObj.dataBound = function () {
     //                   expect(ganttObj.currentViewData.length).toBe(1);
     //                   ganttObj.dataBound = null;
     //                   ganttObj.dataBind();
     //               };
     //               ganttObj.dataBind();
     //               let inputValue: any = (document.getElementsByClassName('e-numerictextbox')[0] as any).ej2_instances[0];
     //               inputValue.value = 1;
     //               inputValue.dataBind();
     //               let filterButton: HTMLElement = document.body.querySelector('.e-flmenu-okbtn');
     //               triggerMouseEvent(filterButton, 'click');
     //           }
     //   });
    });
    describe('Gantt filter child mode', () => {
        Gantt.Inject(Filter, Toolbar, ColumnMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: filteredData,
                    dateFormat: 'MM/dd/yyyy hh:mm:ss',
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                    },
                    columns: [
                        { field: 'TaskID', visible: false },
                        {
                            field: 'TaskName',
                            headerText: 'Task Name',
                            width: '250',
                            clipMode: 'EllipsisWithTooltip',
                        },
                        { field: 'StartDate', headerText: 'Start Date' },
                        { field: 'Duration', headerText: 'Duration' },
                        { field: 'EndDate', headerText: 'End Date' },
                        { field: 'Predecessor', headerText: 'Predecessor' },
                    ],
                    searchSettings: {
                        hierarchyMode: 'Child',
                    },
                    treeColumnIndex: 0,
                    toolbar: ['Search'],
                    allowFiltering: true,
                    includeWeekend: true,
                    height: '450px',
                    timelineSettings: {
                        timelineUnitSize: 60,
                        topTier: {
                            format: 'MMM dd, yyyy',
                            unit: 'Day',
                        },
                        bottomTier: {
                            unit: 'Hour',
                            format: 'h.mm a',
                        },
                    },
                    splitterSettings: {
                        columnIndex: 3,
                    },
                    durationUnit: 'Hour',
                    dayWorkingTime: [{ from: 1, to: 24 }],
                    labelSettings: {
                        rightLabel: 'TaskName',
                    },
                    projectStartDate: new Date('07/16/1969 01:00:00 AM'),
                    projectEndDate: new Date('07/25/1969'),
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('filter popup closed- when click in between the fields', () => {
            let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[0] as HTMLElement;
            triggerMouseEvent(filterMenuIcon, 'click');
            let element: HTMLElement = document.querySelector('div.e-flmenu-valuediv') as HTMLElement;
            ganttObj.filterModule.closeFilterOnContextClick(element);
            expect(document.querySelector('.e-filter-popup').classList.contains('e-popup-open')).toBe(true);
        });
        it('Filtering Taskname', () => {
            ganttObj.actionComplete = function (args: any): void {
                expect(ganttObj.currentViewData.length).toBe(1);
            }
            ganttObj.search('ap');
        });
    });
    describe('Gantt filter action', () => {
        Gantt.Inject(Filter, Toolbar, ColumnMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
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
                    resources: projectResources,
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
        it('Resource FilterMenu Click Function', () => {
            let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[1] as HTMLElement;
            triggerMouseEvent(filterMenuIcon, 'click');
            expect(ganttObj.element.querySelectorAll('.e-headercell')[1].getElementsByClassName('e-headertext')[0].textContent).toBe('Resources');
            let clearButton: HTMLElement = document.body.querySelector('.e-flmenu-cancelbtn') as HTMLElement;
            triggerMouseEvent(clearButton, 'click');
        });
    });
    describe('Gantt filter Both mode', () => {
        Gantt.Inject(Filter, Toolbar, ColumnMenu);
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: filteredData,
                    dateFormat: 'MM/dd/yyyy hh:mm:ss',
                    taskFields: {
                        id: 'TaskID',
                        name: 'TaskName',
                        startDate: 'StartDate',
                        endDate: 'EndDate',
                        duration: 'Duration',
                        dependency: 'Predecessor',
                        child: 'subtasks',
                    },
                    columns: [
                        { field: 'TaskID', visible: false },
                        {
                            field: 'TaskName',
                            headerText: 'Task Name',
                            width: '250',
                            clipMode: 'EllipsisWithTooltip',
                        },
                        { field: 'StartDate', headerText: 'Start Date' },
                        { field: 'Duration', headerText: 'Duration' },
                        { field: 'EndDate', headerText: 'End Date' },
                        { field: 'Predecessor', headerText: 'Predecessor' },
                    ],
                    searchSettings: {
                        hierarchyMode: 'Both',
                    },
                    treeColumnIndex: 0,
                    toolbar: ['Search'],
                    allowFiltering: true,
                    includeWeekend: true,
                    height: '450px',
                    timelineSettings: {
                        timelineUnitSize: 60,
                        topTier: {
                            format: 'MMM dd, yyyy',
                            unit: 'Day',
                        },
                        bottomTier: {
                            unit: 'Hour',
                            format: 'h.mm a',
                        },
                    },
                    splitterSettings: {
                        columnIndex: 3,
                    },
                    filterSettings: {
                        hierarchyMode: 'Both'
                    },
                    collapseAllParentTasks: true,
                    durationUnit: 'Hour',
                    dayWorkingTime: [{ from: 1, to: 24 }],
                    labelSettings: {
                        rightLabel: 'TaskName',
                    },
                    projectStartDate: new Date('07/16/1969 01:00:00 AM'),
                    projectEndDate: new Date('07/25/1969'),
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
        it('Filtering Taskname', () => {
            ganttObj.actionComplete = function (args: any): void {
                if(args.searchString == 'Hatch closing') {
                   expect(ganttObj.currentViewData.length).toBe(2);
                }
            }
            ganttObj.search('Return');
            ganttObj.search('Hatch closing');
        });
    });
});
describe('Bug-853245: Excel filter only takes one character at a time', () => {
    Gantt.Inject(Filter, Toolbar, ColumnMenu);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
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
                resources: projectResources,
                splitterSettings: {
                    columnIndex: 7,
                },
                filterSettings: {
                    type: "Excel"
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
    it('Initial Filter', (done: Function) => {
        ganttObj.filterSettings.columns = [{ field: 'TaskName', matchCase: false, operator: 'startswith', value: 'Design complete' }];
        ganttObj.dataBind();
        expect(ganttObj.filterSettings.columns.length).toBe(1);
        setTimeout(done, 2000);
        ganttObj.clearFiltering();
        done();
    });
});
describe('filtering in startdate', () => {
    Gantt.Inject(Filter, Toolbar, ColumnMenu);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
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
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name' },
                    { field: 'StartDate', headerText: 'Start Date', allowFiltering: false  },
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
    it('Filtering in startdate', () => {
        expect(ganttObj.columns[2]['allowFiltering']).toBe(false);
    });
});
describe('filtering using datetimepickeredit', () => {
    Gantt.Inject(Filter, Toolbar, ColumnMenu);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData1,
                allowFiltering: true,
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
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                     { field: 'BaselineStartDate', editType: 'datetimepickeredit', width: 100 },
                    { field: 'BaselineEndDate', editType: 'datetimepickeredit', width: 100 },
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
    it('filtering using datetimepickeredit', () => {
        expect(ganttObj.columns[6]['editType']).toBe('datetimepickeredit');
    });
});
describe('Filter in duration', () => {
    Gantt.Inject(Filter, Toolbar, ColumnMenu);
    let ganttObj: Gantt;
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: [
                    {
                        TaskID: 1,
                        TaskName: 'Project Initiation',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
                            { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50  },
                            { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
                        ]
                    },
                    {
                        TaskID: 5,
                        TaskName: 'Project Estimation',
                        StartDate: new Date('04/02/2019'),
                        EndDate: new Date('04/21/2019'),
                        subtasks: [
                            { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
                            { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
                            { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 }
                        ]
                    },
                ],
                allowFiltering: true,
                height: '450px',
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    child: 'subtasks'
                },
                splitterSettings: {
                    columnIndex: 4,
                },
                columns: [
                    { field: 'TaskID' },
                    { field: 'TaskName'},
                    { field: 'StartDate' },
                    { field: 'Duration'}]
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('filtering in duration', function () {
        setTimeout(()=>{
            actionComplete = function (args) {
                if (args.requestType == 'filterAfterOpen') {
                    args.filterModel.dlgDiv.querySelectorAll('.e-input')[1].ej2_instances[0].value = '1';
                    args.filterModel.dlgDiv.querySelector('.e-flmenu-okbtn').click();
                }
            }
        }, 500);
        (ganttObj.element.querySelectorAll('.e-filtermenudiv')[3] as HTMLElement).click();     
        ganttObj.actionComplete = actionComplete;
    });
});
describe('Filter in startdate', () => {
    Gantt.Inject(Filter, Toolbar, ColumnMenu);
    let ganttObj: Gantt;
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData1,
                allowFiltering: true,
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
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                     { field: 'BaselineStartDate', editType: 'datetimepickeredit', width: 100 },
                    { field: 'BaselineEndDate', editType: 'datetimepickeredit', width: 100 },
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
    it('filtering in startdate', function () {
        setTimeout(()=>{
            actionComplete = function (args) {
                if (args.requestType == 'filterAfterOpen') {
                    args.filterModel.dlgDiv.querySelector('.e-input.e-keyboard').value = '4/18/2017';
                    args.filterModel.dlgDiv.querySelector('.e-flmenu-okbtn').click();
                }
            }
        }, 500); 
        (ganttObj.element.querySelectorAll('.e-filtermenudiv')[2] as HTMLElement).click();    
        ganttObj.actionComplete = actionComplete;      
    });
});
describe('Filter in baseline startdate', () => {
    Gantt.Inject(Filter, Toolbar, ColumnMenu);
    let ganttObj: Gantt;
    let actionComplete: (args: any) => void;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData1,
                allowFiltering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate : 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                columns: [
                    { field: 'TaskID', headerText: 'Task ID' },
                    { field: 'TaskName', headerText: 'Task Name', allowReordering: false },
                    { field: 'StartDate', headerText: 'Start Date', allowSorting: false },
                    { field: 'EndDate', headerText: 'EndDate', allowSorting: false,editType: 'datetimepickeredit', },
                    { field: 'Duration', headerText: 'Duration', allowEditing: false },
                    { field: 'Progress', headerText: 'Progress', allowFiltering: false },
                    { field: 'CustomColumn', headerText: 'CustomColumn' },
                     { field: 'BaselineStartDate', editType: 'datetimepickeredit', width: 100 },
                    { field: 'BaselineEndDate', editType: 'datetimepickeredit', width: 100 },
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
    it('filtering in  startdate', function () {
        setTimeout(()=>{
            actionComplete = function (args) {
                if (args.requestType == 'filterAfterOpen') {
                    args.filterModel.dlgDiv.querySelector('.e-input.e-keyboard').value = '4/18/2017';
                    args.filterModel.dlgDiv.querySelector('.e-flmenu-okbtn').click();
                }
            }
        }, 500); 
        (ganttObj.element.querySelectorAll('.e-filtermenudiv')[3] as HTMLElement).click();    
        ganttObj.actionComplete = actionComplete;      
    });
});
describe('Filter in duration', () => {
    Gantt.Inject(Filter, Toolbar, ColumnMenu);
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: baselineData1,
                allowFiltering: true,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate : 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    baselineStartDate: "BaselineStartDate",
                    baselineEndDate: "BaselineEndDate",
                    child: 'subtasks',
                    indicators: 'Indicators'
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017'),
                rowHeight: 40,
                taskbarHeight: 30,
                renderBaseline: true,
                filterSettings: {
                    columns: [
                        { field: 'Duration', matchCase: false, operator: 'equal', predicate: 'and', value: 3 }]
                },
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('filtering in  duration', function () {
        expect(ganttObj.currentViewData.length === 7).toBe(true);
    });
});