/**
 * Gantt base spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { Gantt, Selection, Toolbar, DayMarkers, Edit, Filter,  ContextMenu, Sort } from '../../src/index';
import { unscheduledData } from '../base/data-source.spec';
import { createGantt, destroyGantt } from './gantt-util.spec';
Gantt.Inject(Edit, Selection, ContextMenu, Sort, Toolbar, Filter, DayMarkers);
describe('Gantt - Base', () => {

    describe('Gantt base module', () => {
        let ganttObj: Gantt;
        beforeAll((done: Function) => {
            ganttObj = createGantt({
                allowSelection: true,
                dataSource: unscheduledData,
                taskFields: {
                    id: 'TaskID',
                    name: 'TaskName',
                    startDate: 'StartDate',
                    endDate: 'EndDate',
                    duration: 'Duration',
                    progress: 'Progress',
                    dependency: 'Predecessor',
                    child: 'Children',
                    baselineStartDate: 'BaselineStartDate',
                    baselineEndDate: 'BaselineEndDate'
                },
            }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        it('Grid columns method testing', () => {
            ganttObj.getGridColumns();
            expect(ganttObj.treeGrid.getColumns().length).toBe(9);
         });
         it('Gantt columns method testing', () => {
             ganttObj.getGanttColumns();
             expect(ganttObj.ganttColumns.length).toBe(9);
         });
         it('Hide column method testing', () => {
             ganttObj.hideColumn('Duration','field');
             expect(ganttObj.element.querySelector('.e-hide').getElementsByClassName('e-headertext')[0].textContent).toBe('Duration');
         });
         it('Show column method testing', () => {
             ganttObj.ShowColumn('Duration','field');
             expect(ganttObj.element.querySelectorAll('.e-headercell')[4].classList.contains('e-hide')).toBe(false);
         });
        it('control class testing', () => {
            expect(ganttObj.element.classList.contains('e-gantt')).toEqual(true);
        });
        it('get component name testing', () => {
            expect(ganttObj.getModuleName()).toEqual('gantt');
        });
        it('property change check', () => {
            ganttObj.allowSelection = false;
            expect(ganttObj.allowSelection).toEqual(false);
            ganttObj.allowFiltering = true;
            expect(ganttObj.allowFiltering).toEqual(true);
            ganttObj.workWeek = ["Sunday", "Monday", "Tuesday", "Wednesday"];
            ganttObj.dataBind();
            expect(ganttObj.nonWorkingDayIndex.length).toBe(3);
            ganttObj.toolbar = ['Add', 'Edit', 'Update', 'Delete', 'Cancel'];
            ganttObj.dataBind();
            expect(ganttObj.toolbarModule.toolbar.items.length).toBe(5);
            ganttObj.showColumnMenu = true;
            expect(ganttObj.showColumnMenu).toEqual(true);
            ganttObj.columnMenuItems = ['ColumnChooser','Filter'];
            expect(ganttObj.columnMenuItems.length).toBe(2);
            ganttObj.sortSettings= { columns: [{ field: 'TaskID', direction: 'Descending' }]};
            expect(ganttObj.sortSettings.columns.length).toBe(1);
            ganttObj.rowHeight = 60;
            expect(ganttObj.rowHeight).toBe(60);
            ganttObj.taskbarHeight = 50;
            expect(ganttObj.taskbarHeight).toBe(50);
            ganttObj.allowResizing = true;
            expect(ganttObj.allowResizing).toEqual(true);
            ganttObj.allowReordering = true;
            expect(ganttObj.allowReordering).toEqual(true);
            ganttObj.labelSettings = {leftLabel: 'TaskID'};
            ganttObj.dataBind();
            expect(ganttObj.element.querySelector('#' + ganttObj.element.id + 'GanttTaskTableBody > tr:nth-child(2) > td > div.e-left-label-container > div > span').textContent).toBe('2');
            ganttObj.renderBaseline = true;
            expect(ganttObj.renderBaseline).toEqual(true);
            ganttObj.baselineColor = 'red';
            ganttObj.dataBind();
            let ele: HTMLElement = document.getElementsByClassName('e-baseline-bar')[0] as HTMLElement;
            expect(ele.style.backgroundColor).toBe('red');
            ganttObj.resources = [
                { resourceId: 1, resourceName: 'Martin Tamer' },
                { resourceId: 2, resourceName: 'Rose Fuller' },
                { resourceId: 3, resourceName: 'Margaret Buchanan' }];
            ganttObj.resourceIDMapping = 'resourceId';
            expect(ganttObj.resourceIDMapping).toBe('resourceId');
            ganttObj.resourceNameMapping = 'resourceName';
            expect(ganttObj.resourceNameMapping).toBe('resourceName');
            ganttObj.includeWeekend = true;
            expect(ganttObj.includeWeekend).toEqual(true);
            ganttObj.dayWorkingTime = [{ from: 9, to: 18 }];
            ganttObj.dataBind();
            expect(ganttObj.dayWorkingTime[0].from).toBe(9);
            expect(ganttObj.dayWorkingTime[0].to).toBe(18);
            ganttObj.addDialogFields = [
                { type: 'General', headerText: 'General' },
                { type: 'Dependency' }
            ];
            expect(ganttObj.addDialogFields.length).toBe(2);
            ganttObj.editDialogFields =  [
                { type: 'General', headerText: 'General' },
                { type: 'Dependency' },
                { type: 'Resources' },
                { type: 'Notes' }
            ];
            expect(ganttObj.editDialogFields.length).toBe(4);
            ganttObj.width = 'auto';
            expect(ganttObj.width).toBe('auto');
            ganttObj.height = '450px';
            expect(ganttObj.height).toBe('450px');
            ganttObj.connectorLineBackground = 'red';
            expect(ganttObj.connectorLineBackground).toBe('red');
            ganttObj.connectorLineWidth = 15;
            expect(ganttObj.connectorLineWidth).toBe(15);
            ganttObj.treeColumnIndex = 2;
            expect(ganttObj.treeColumnIndex).toBe(2);
            ganttObj.projectStartDate = new Date('01/15/2017');
            expect(ganttObj.getFormatedDate(ganttObj.projectStartDate,'M/d/yyyy')).toBe('1/15/2017');
            ganttObj.projectEndDate = new Date('05/15/2017');
            expect(ganttObj.getFormatedDate(ganttObj.projectEndDate,'M/d/yyyy')).toBe('5/15/2017');
            ganttObj.enableContextMenu = true;
            expect(ganttObj.enableContextMenu).toEqual(true);
            ganttObj.contextMenuItems = ['AutoFitAll', 'AutoFit', 'TaskInformation', 'DeleteTask', 'Save', 'Cancel',
            'SortAscending', 'SortDescending', 'Add', 'DeleteDependency', 'Convert'];
            expect(ganttObj.contextMenuItems.length).toBe(11);
            ganttObj.locale = 'fr-CH';
            expect(ganttObj.locale).toBe('fr-CH');
            ganttObj.enableRtl = true;
            expect(ganttObj.enableRtl).toEqual(true);
            ganttObj.selectionSettings = { mode:'Row', type:'Multiple' };
            ganttObj.selectedRowIndex = 4;
            ganttObj.columns = [
                { field: 'TaskID', width: '150' },
                { field: 'TaskName', width: '250' }
            ];
            expect(ganttObj.columns.length).toBe(2);
            ganttObj.dataSource = [
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
                }];
        });
        it('check destroy method', () => {
            ganttObj.destroy();
            expect(ganttObj.element.classList.contains('e-gantt')).toEqual(false);
        });
        it('control class testing', () => {
            let htmlElement: HTMLElement = createElement('div', { id: 'GanttHtmlCheck' });
            ganttObj = new Gantt({
                allowSelection: true,
                dataBound: () => {
                    expect(htmlElement.classList.contains('e-gantt')).toEqual(true);
                }
            }, htmlElement);
        });
    });
});
