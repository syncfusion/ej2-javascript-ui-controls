import { Gantt, Toolbar, ExcelExport } from '../../src/index';
import { projectData1 } from '../base/data-source.spec';
import { ExcelRow, ExcelExportProperties, Grid } from '@syncfusion/ej2-grids';
import { createGantt, destroyGantt, triggerMouseEvent, getKeyUpObj } from '../base/gantt-util.spec';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
Gantt.Inject(Toolbar, ExcelExport);

describe('Gantt excel export support', () => {
    describe('Gantt excel export', () => {
        let ganttObj: Gantt;
        var gridObj: Grid;
        beforeAll((done: Function) => {
            ganttObj = createGantt(
                {
                    dataSource: projectData1,
                    editSettings: {
                        allowAdding: true,
                        allowEditing: true,
                        allowDeleting: true
                    },
                    columns: [
                        { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 125 },
                        { field: 'TaskName', headerText: 'Name', width: 125, visible: false },
                        { field: 'StartDate', headerText: 'StartDate', width: 180, visible: false },
                        { field: 'Duration', headerText: 'Duration', width: 110, visible: false },
                        { field: 'Progress', headerText: 'Progress', width: 110 }
                    ],
                    allowExcelExport: true,
                    toolbar: ['ExcelExport', 'CsvExport'],
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
                    projectEndDate: new Date('12/30/2017')
                }, done);
        });
        afterAll(() => {
            if (ganttObj) {
                destroyGantt(ganttObj);
            }
        });
        beforeEach(() => {
            gridObj = ganttObj.treeGrid.grid;
        });

        // it('Check column/Row length of exported excel file', () => {
        //     let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, {}, { result: gridObj.dataSource });
        //     expect((<any>ganttObj.excelExportModule.parent).columns.length).toBe(5);
        //     expect(excelRows.length).toBe((<any>gridObj.dataSource).length + 1);
        //     expect(excelRows[0].cells.length).toBe(2);
        // });

        it('visibility check', () => {
            ganttObj.hideColumn('TaskID');
            expect(ganttObj.treeGrid.getVisibleColumns().length).toBe(2);
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, {}, { result: gridObj.dataSource });
            expect(excelRows[0].cells.length).toBe(2);
        });
        it('visibility check include hidden column', () => {
            (<any>gridObj.excelExportModule).includeHiddenColumn = true;
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, { includeHiddenColumn: true }, { result: gridObj.dataSource });
            expect(excelRows[0].cells.length).toBe(5);
        });

        it('check cell with value invalid values', () => {
            var data: Object = [ganttObj.dataSource[0]];
            data[0]['TaskID'] = 0;
            data[0]['TaskName'] = null;
            ganttObj.excelQueryCellInfo = (args) => {
                if (args.column.field == 'TaskID' && args.data['TaskName'] == null) {
                    expect(args.value).toBe(0);
                }
                if (args.column.field == 'TaskName' && args.data['TaskID'] == 0) {
                    expect(args.value).toBe('');
                }
            }
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, undefined, { result: data });
        });

        it('check cell with empty string value', () => {
            var data: Object = [ganttObj.dataSource[0]];
            data[0]['TaskName'] = '';
            ganttObj.excelQueryCellInfo = (args) => {
                if (args.column.field == 'TaskName' && args.data['TaskID'] == 0) {
                    expect(args.value).toBe('');
                }
            }
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, undefined, { result: data });
        });
    });
});

describe('Gantt excel export', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 125 },
                    { field: 'TaskName', headerText: 'Name', width: 125, visible: false },
                    { field: 'StartDate', headerText: 'StartDate', width: 180, visible: false },
                    { field: 'Duration', headerText: 'Duration', width: 110, visible: false },
                    { field: 'Progress', headerText: 'Progress', width: 110 }
                ],
                allowExcelExport: true,
                toolbar: ['ExcelExport'],
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
                excelExportComplete: (args: any) => {
                    expect(!isNullOrUndefined(args)).toBe(true);
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017')
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });

    it('excel export', (done: Function) => {
        ganttObj.excelExport();
        done();
    });
});
describe('Gantt excel export', () => {
    let ganttObj: Gantt;
    beforeAll((done: Function) => {
        ganttObj = createGantt(
            {
                dataSource: projectData1,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 125 },
                    { field: 'TaskName', headerText: 'Name', width: 125, visible: false },
                    { field: 'StartDate', headerText: 'StartDate', width: 180, visible: false },
                    { field: 'Duration', headerText: 'Duration', width: 110, visible: false },
                    { field: 'Progress', headerText: 'Progress', width: 110 }
                ],
                allowExcelExport: true,
                toolbar: ['ExcelExport'],
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
                loadingIndicator:{indicatorType:'Shimmer'},
                excelExportComplete: (args: any) => {
                    expect(!isNullOrUndefined(args)).toBe(true);
                },
                projectStartDate: new Date('02/01/2017'),
                projectEndDate: new Date('12/30/2017')
            }, done);
    });
    afterAll(() => {
        if (ganttObj) {
            destroyGantt(ganttObj);
        }
    });
    it('excel export', (done: Function) => {
        ganttObj.excelExport();
        done();
    });
});