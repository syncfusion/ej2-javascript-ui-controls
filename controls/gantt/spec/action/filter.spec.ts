/**
 * Gantt filter spec
 */
import { Gantt, Filter, Toolbar, ColumnMenu } from '../../src/index';
import { projectData1, projectResources, filteredData} from '../base/data-source.spec';
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

        it('TaskID FilterMenu Click Function', () => {
            let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[0] as HTMLElement;
            triggerMouseEvent(filterMenuIcon, 'click');
            let input: HTMLInputElement = (<HTMLInputElement>ganttObj.element.querySelector('.e-numerictextbox'));
            if (input) {
                ganttObj.dataBound = () => {
                    expect(ganttObj.currentViewData.length).toBe(1);
                    ganttObj.dataBound = null;
                    ganttObj.dataBind();                    
                }
                ganttObj.dataBind();
                let inputValue: any = (document.getElementsByClassName('e-numerictextbox')[0] as any).ej2_instances[0];
                inputValue.value = 1;
                inputValue.dataBind();
                let filterButton: HTMLElement = document.body.querySelector('.e-flmenu-okbtn') as HTMLElement;
                triggerMouseEvent(filterButton, 'click');
            }
        });

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

        it('Filtering Taskname', () => {
            let filterMenuIcon: HTMLElement = ganttObj.element.querySelector('#treeGrid' + ganttObj.element.id + '_gridcontrol').getElementsByClassName('e-icon-filter')[0] as HTMLElement;
                triggerMouseEvent(filterMenuIcon, 'click');
                let input: HTMLElement = document.querySelector('.e-numerictextbox');
                if (input) {
                    ganttObj.dataBound = function () {
                        expect(ganttObj.currentViewData.length).toBe(1);
                        ganttObj.dataBound = null;
                        ganttObj.dataBind();
                    };
                    ganttObj.dataBind();
                    let inputValue: any = (document.getElementsByClassName('e-numerictextbox')[0] as any).ej2_instances[0];
                    inputValue.value = 1;
                    inputValue.dataBind();
                    let filterButton: HTMLElement = document.body.querySelector('.e-flmenu-okbtn');
                    triggerMouseEvent(filterButton, 'click');
                }
        });
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
            let element : HTMLElement = document.querySelector('div.e-flmenu-valuediv') as HTMLElement;
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
});
