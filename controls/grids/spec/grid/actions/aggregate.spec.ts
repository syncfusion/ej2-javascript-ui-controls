/**
 * Data spec
 */
import { createElement, remove } from '@syncfusion/ej2-base';
import { EventHandler, ChildProperty, EmitType, debounce } from '@syncfusion/ej2-base';
import { DataUtil } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { CustomSummaryType } from '../../../src/grid/base/type';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { AggregateColumn } from '../../../src/grid/models/aggregate';
import { GridModel } from '../../../src/grid/base/grid-model';
import { extend } from '@syncfusion/ej2-base';
import { data } from '../base/datasource.spec';
import { Edit } from '../../../src/grid/actions/edit';
import { Sort } from '../../../src/grid/actions/sort';
import '../../../node_modules/es6-promise/dist/es6-promise'; 
import { Group } from '../../../src/grid/actions/group';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { Freeze } from '../../../src/grid/actions/freeze';
import { DataManager, ODataAdaptor, RemoteSaveAdaptor } from '@syncfusion/ej2-data';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { dataBound } from '../../../src';

Grid.Inject(Aggregate, Edit, Group, Toolbar, Selection, Freeze, Sort);


let createGrid: Function = (options: GridModel, done: Function): Grid => {
    let grid: Grid;
    let dataBound: EmitType<Object> = () => { done(); };
    grid = new Grid(
        extend(
            {}, {
                dataSource: data.slice(0, 15),
                dataBound: dataBound
            },
            options,
        )
    );
    document.body.appendChild(createElement('div', { id: 'Grid' }));
    grid.appendTo('#Grid');
    return grid;
};

let destroy: EmitType<Object> = (grid: Grid) => {
    if (grid) {
        grid.destroy();
        document.getElementById('Grid').remove();
    }
};

describe('Aggregates Functionality testing', () => {
    describe('Default functionality', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            grid = createGrid(
                {
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Average',
                            field: 'Freight',
                            format: 'c2'
                        }]
                    }, {
                        columns: [{
                            type: 'Max',
                            field: 'OrderDate',
                            format: { type: 'date', skeleton: 'medium' },
                            footerTemplate: '${Max}'
                        }]
                    }]
                },
                done
            );
        });
        it('check content and table visiblity', () => {
            expect(grid.getFooterContent()).not.toBeNull();
            expect(grid.getFooterContentTable()).not.toBeNull();
        });
        it('check summary value', () => {
            let rows = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            expect(rows.cells[2].innerHTML).toBe('$' + DataUtil.aggregates.average(grid.dataSource, 'Freight').toFixed(2));
        });
        afterAll(() => {
            destroy(grid);
            grid = rows = null;
        });
    });

    describe('Default functionality - Empty DataSource', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: [],
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Average',
                            field: 'Freight',
                            format: 'c2'
                        }]
                    }, {
                        columns: [{
                            type: 'Max',
                            field: 'OrderDate',
                            format: { type: 'date', skeleton: 'medium' },
                            footerTemplate: '${Max}'
                        }]
                    }]
                },
                done
            );
        });
        it('check content and table visiblity', () => {
            expect(grid.getFooterContentTable().querySelector('.e-summarycell')).toBeNull();
        });
        afterAll(() => {
            destroy(grid);
            grid = rows = null;
        });
    });

    describe('Group functionality enabled', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    allowGrouping: true,
                    groupSettings: { columns: ['Verified'], showGroupedColumn: true },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right'
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Average',
                            field: 'Freight',
                            format: 'c2'
                        }]
                    }, {
                        columns: [{
                            type: ['Max'],
                            field: 'OrderDate',
                            format: 'yMd',
                            footerTemplate: '${Max}'
                        }]
                    }]
                },
                done
            );
        });
        it('check summary value', () => {
            let rows = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            expect(rows.cells[3].innerHTML).toBe('$' + DataUtil.aggregates.average(grid.dataSource, 'Freight').toFixed(2));
            expect(rows.cells[0].classList.contains('e-indentcell')).toBeTruthy();
        });
        afterAll(() => {
            destroy(grid);
            grid = rows = null;
        });
    });

    describe('Group and caption summary functionality enabled', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    allowGrouping: true,
                    allowPaging: true,
                    groupSettings: { columns: ['EmployeeID'] },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right'
                        },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Average',
                            field: 'Freight',
                            groupFooterTemplate: '${Average}'
                        }]
                    },
                    {
                        columns: [{
                            type: ['Max'],
                            field: 'OrderDate',
                            format: 'yMd',
                            groupCaptionTemplate: '${Max}'
                        }]
                    }]
                },
                done
            );
        });

        it('Footer disabled check', () => {
            expect((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows.length).toBe(0);
        });
        it('check caption summary value', () => {
            let rows: HTMLTableRowElement = <any>(grid.getContentTable() as HTMLTableElement)
                .querySelector('.e-summarycell.e-templatecell');
            let val: string | Object = grid.valueFormatterService.toView(
                DataUtil.aggregates.max((<{ items: Object[] }>grid.currentViewData[0]).items, 'OrderDate'),
                (<AggregateColumn>grid.aggregates[1].columns[0]).getFormatter());
            //  expect(rows.innerHTML).toBe(<string>val);
        });

        it('check group summary value', () => {
            let rows: HTMLTableRowElement = (<any>(grid.getContentTable() as HTMLTableElement)
                .querySelector('.e-summaryrow') as HTMLTableRowElement);
            // expect(rows.cells[3].innerHTML).toBe(
            //     DataUtil.aggregates.average((<{ items: Object[] }>grid.currentViewData[0]).items, 'Freight') + '');
        });

        afterAll(() => {
            destroy(grid);
            grid = rows = null;
        });
    });

    describe('Caption summary with single visible column', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    allowGrouping: true,
                    allowPaging: true,
                    groupSettings: { columns: ['OrderID'] },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right'
                        },
                        { field: 'Freight', format: 'C1' },
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Average',
                            field: 'Freight',
                            groupCaptionTemplate: '${Average}'
                        }]
                    }]
                },
                done
            );
        });

        it('check caption summary value', () => {
            let rows: HTMLTableRowElement = <any>(grid.getContentTable() as HTMLTableElement)
                .querySelector('.e-summarycell.e-templatecell');
            expect(rows).toBeNull();
        });

        afterAll(() => {
            destroy(grid);
            grid = rows = null;
        });
    });

    describe('Custom summary functionality', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        let customSum: CustomSummaryType = (data: Object[], column: Object) => 'Best Employee: 1';
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    allowGrouping: true,
                    groupSettings: { columns: ['Verified'] },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right'
                        },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Custom',
                            columnName: 'EmployeeID',
                            customAggregate: customSum
                        },
                        //Use this to provide title in another column.
                        {
                            type: 'Custom',
                            columnName: 'OrderID',
                            footerTemplate: 'Custom'
                        }]
                    }]
                },
                done
            );
        });

        it('check custom footer summary', () => {
            let rows: HTMLTableRowElement = <any>(grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0];
            expect(rows.cells[5].innerHTML).toBe('Best Employee: 1');
        });

        it('check custom caption summary value', () => {
            let rows: HTMLTableRowElement = <any>(grid.getContentTable() as HTMLTableElement)
                .querySelector('.e-summarycell:not(:empty)');
            expect(rows.innerHTML).toBe('Best Employee: 1');
        });

        it('check group summary value', () => {
            let rows: HTMLTableRowElement = (<any>(grid.getContentTable() as HTMLTableElement)
                .querySelector('.e-summaryrow') as HTMLTableRowElement);
            expect(rows.cells[5].innerHTML).toBe('Best Employee: 1');
        });

        afterAll(() => {
            destroy(grid);
            grid = rows = customSum = null;
        });
    });

    describe('Set Model', () => {
        describe('Enable summary', () => {
            let grid: Grid;
            let rows: HTMLTableRowElement;
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        allowGrouping: true,
                        groupSettings: { columns: ['Verified'] },
                        columns: [
                            {
                                field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                                textAlign: 'Right'
                            },
                            { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                            { field: 'Freight', format: 'C1' },
                            { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                        ]
                    },
                    () => {
                        grid.aggregates = [{
                            columns: [{
                                type: 'Average',
                                field: 'Freight',
                                groupFooterTemplate: '${Average}'
                            }]
                        },
                        {
                            columns: [{
                                type: ['Max'],
                                field: 'OrderDate',
                                format: 'yMd',
                                groupCaptionTemplate: '${Max}'
                            }]
                        }];
                        grid.dataBind();
                        done();
                    }
                );
            });

            it('check footer summary', () => {
                let footer: Element = grid.element.querySelector('.e-gridfooter');
                expect(footer).not.toBeNull();
            });

            afterAll(() => {
                destroy(grid);
                grid = rows = null;
            });
        });
        describe('Enable summary without group/caption summary', () => {
            let grid: Grid;
            let rows: HTMLTableRowElement;
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        allowGrouping: true,
                        groupSettings: { columns: ['Verified'] },
                        columns: [
                            {
                                field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                                textAlign: 'Right'
                            },
                            { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                            { field: 'Freight', format: 'C1' },
                            { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                        ]
                    },
                    () => {
                        grid.aggregates = [{
                            columns: [{
                                type: 'Average',
                                field: 'Freight',
                                footerTemplate: '${Average}'
                            }]
                        }];
                        grid.dataBind();
                        done();
                    }
                );
            });

            it('check footer summary', () => {
                let footer: Element = grid.element.querySelector('.e-gridfooter');
                expect(footer).not.toBeNull();
            });

            afterAll(() => {
                destroy(grid);
                grid = rows = null;
            });
        });
        describe('Skip on other module update', () => {
            let grid: Grid;
            let rows: HTMLTableRowElement;
            beforeAll((done: Function) => {
                grid = createGrid(
                    {
                        allowGrouping: true,
                        groupSettings: { disablePageWiseAggregates: true, columns: ['Verified'] },
                        columns: [
                            {
                                field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                                textAlign: 'Right'
                            },
                            { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                            { field: 'Freight', format: 'C1' },
                            { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                        ],
                        aggregates: [{
                            columns: [{
                                type: 'Average',
                                field: 'Freight',
                                groupFooterTemplate: '${Average}'
                            }]
                        },
                        {
                            columns: [{
                                type: ['Max'],
                                field: 'OrderDate',
                                format: 'yMd',
                                groupCaptionTemplate: '${Max}'
                            }]
                        }]
                    },
                    done
                );
            });

            it('skip on other module update', () => {
                grid.allowPaging = true;
                grid.dataBind();
                let footer: Element = grid.element.querySelector('.e-gridfooter');
                expect(footer).not.toBeNull();
            });

            afterAll(() => {
                destroy(grid);
                grid = rows = null;
            });
        });
    });

    describe('Summary dynamic show/hide column', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;        
        beforeAll((done: Function) => {
		window['browserDetails']['isDevice'] = true;
            grid = createGrid(
                {
                    allowGrouping: true,
                    groupSettings: { columns: ['Verified'] },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right'
                        },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Average',
                            field: 'Freight',
                        }]
                    }],
                },
                () => {
                    grid.hideColumns('Order ID');
                    done();
                }
            );
        });

        it('Check cell visibility', () => {
            let rows: HTMLTableRowElement = <any>(grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
            //for coverage
            grid.aggregates = [];
            grid.dataBind();
        });

        afterAll(() => {
            window['browserDetails']['isDevice'] = false;
            destroy(grid);
            grid = rows = null;
        });
    });

    describe('Aggregation with detailTemplate', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: [],
                    detailTemplate: '${OrderID}',
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right', visible: false
                        },
                        { field: 'Verified', displayAsCheckbox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Average',
                            field: 'Freight',
                            format: 'c2'
                        }]
                    }, {
                        columns: [{
                            type: 'Max',
                            field: 'OrderDate',
                            format: { type: 'date', skeleton: 'medium' },
                            footerTemplate: '${Max}'
                        }]
                    }]
                },
                done
            );
        });

        it('check colgroup length', () => {
            expect(grid.getFooterContentTable().querySelectorAll('colgroup col').length).toBe(grid.getColumns().length + 1);
        });
        afterAll(() => {
            destroy(grid);
            grid = rows = null;
        });
    });
 
    describe('Reactive aggregates in footer with batch editing', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        let preventDefault: Function = new Function();
        let updateAggregatesVal: string = '';
        let cell: HTMLElement;
        let customCount: CustomSummaryType = (data: any) =>
            (
                'result' in data ? ('records' in data.result ?
                    data.result.records.filter((item: Object) =>
                        item['CustomerID'] === 'HANAR'
                    ).length :
                    data.result.filter((item: Object) =>
                        item['CustomerID'] === 'HANAR'
                    ).length)
                    :
                    ('items' in data ?
                        data.items.filter((item: Object) =>
                            item['CustomerID'] === 'HANAR'
                        ).length
                        : data.filter((item: Object) =>
                            item['CustomerID'] === 'HANAR'
                        ).length)

            );
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    pageSettings: { pageSize: 8 },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right', isPrimaryKey: true,
                            textAlign: 'Right'
                        },
                        { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                },
                () => {
                    grid.aggregates = [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            footerTemplate: 'Sum: ${Sum}'
                        }]

                    },
                    {
                        columns: [{
                            type: 'Custom',
                            columnName: 'CustomerID',
                            customAggregate: customCount,
                            footerTemplate: 'Count: ${Custom}'
                        }]
                    }
                    ];
                    grid.dataBind();
                    done();
                }
            );
        });
        it('tab key to update aggregates in footer ', (done: Function) => {
            grid.editModule.editCell(0, 'Freight');
            let AggregateRow = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            let beforeSumVal: string = AggregateRow.cells[2].innerHTML;
            updateAggregatesVal = beforeSumVal;
            let cellSave = (args?: any): void => {
                grid.cellSave = null;
                done();
            };
            grid.cellSave = cellSave;
            //tab key press here
            grid.element.querySelector('.e-editedbatchcell').querySelector('input').value = '100';
            grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
        });

        it('tab key to update custom aggregates in footer', (done: Function) => {
            let AggregateRow: HTMLTableRowElement = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            let afterSumVal: string = AggregateRow.cells[2].innerHTML;
            let isUpdateSummary: boolean = updateAggregatesVal !== afterSumVal ? true : false;
            expect(isUpdateSummary).toBeTruthy();
            let cellSave = (args?: any): void => {
                grid.cellSave = null;
                done();
            };
            grid.cellSave = cellSave;
            grid.editModule.editCell(0, 'CustomerID');
            grid.element.querySelector('.e-editedbatchcell').querySelector('input').value = 'HANAR';
            grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
        });

        it('Update aggregates in footer using enter key', (done: Function) => {
            let CustomAggregateRow: HTMLTableRowElement = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[1] as HTMLTableRowElement);
            let customAggrVal = CustomAggregateRow.cells[1].innerHTML;
            expect(customAggrVal).toBe('Count: 3');

            grid.editModule.editCell(1, 'Freight');
            let AggregateRow = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            let beforeSumVal: string = AggregateRow.cells[2].innerHTML;
            updateAggregatesVal = beforeSumVal;
            let cellSave = (args?: any): void => {
                grid.cellSave = null;
                done();
            };
            grid.cellSave = cellSave;
            //Enter key press here
            grid.element.querySelector('.e-editedbatchcell').querySelector('input').value = '10';
            grid.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: cell } as any);
        });

        it('Add a new row with data in footer', (done: Function) => {
            let AggregateRow: HTMLTableRowElement = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            let afterSumVal: string = AggregateRow.cells[2].innerHTML;
            let isUpdateSummary: boolean = updateAggregatesVal !== afterSumVal ? true : false;
            expect(isUpdateSummary).toBeTruthy();
            let cellSave = (args?: any): void => {
                grid.cellSave = null;
                done();
            };
            grid.cellSave = cellSave;
            grid.addRecord({ OrderID: 10242, CustomerID: 'HANAR', Freight: 1 });
        });

        it('SetCellValue in footer', (done: Function) => {
            let AggregateRow: HTMLTableRowElement = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            let afterSumVal: string = AggregateRow.cells[2].innerHTML;
            let isUpdateSummary: boolean = updateAggregatesVal !== afterSumVal ? true : false;
            expect(isUpdateSummary).toBeTruthy();

            let CustomAggregateRow: HTMLTableRowElement = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[1] as HTMLTableRowElement);
            let customAggrVal: string = CustomAggregateRow.cells[1].innerHTML;
            expect(customAggrVal).toBe('Count: 4');
            let queryCellInfo = (args?: any): void => {
                grid.queryCellInfo = null;
                done();
            };
            grid.queryCellInfo = queryCellInfo;
            grid.setCellValue(10251, 'CustomerID', 'HANAR');
        });

        it('SetRowData in footer', (done: Function) => {
            let CustomAggregateRow: HTMLTableRowElement = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[1] as HTMLTableRowElement);
            let customAggrVal: string = CustomAggregateRow.cells[1].innerHTML;
            expect(customAggrVal).toBe('Count: 5');
            grid.setRowData(10250, { OrderID: 1249, CustomerID: 'new value', Freight: 11 });
            done();
        });

        it('Delete: refresh aggregates in footer', (done: Function) => {
            grid.selectRow(1);
            let row: Object = grid.getSelectedRecords();
            let batchDelete = (args?: any): void => {
                grid.batchDelete = null;
                done();
            };
            let beforeBatchDelete = (args?: any): void => {
                grid.beforeBatchDelete = null;
            };
            grid.beforeBatchDelete = beforeBatchDelete;
            grid.batchDelete = batchDelete;
            grid.clearSelection();
            grid.selectRow(2, true);
            grid.deleteRow(grid.getContent().querySelectorAll('.e-row')[2] as any);
        });
        it('cancel the bulk edited value ', (done: Function) => {
            grid.editModule.editCell(0, 'Freight');
            //tab key press here
            grid.element.querySelector('.e-editedbatchcell').querySelector('input').value = '100';   
            let beforeBatchSave = (args?: any): void => {
                expect(grid.isEdit).toBeFalsy();
                args.cancel = true;
                grid.beforeBatchSave = null;
                done();
            };
            grid.beforeBatchSave = beforeBatchSave;
            (<any>grid.toolbarModule).toolbarClickHandler({ item: { id: grid.element.id + '_update' } });
            grid.element.querySelector('#' + grid.element.id + 'EditConfirm').querySelectorAll('button')[0].click();                   
        });
        it('cancel the edited value ', (done: Function) => {
            grid.editModule.editCell(0, 'Freight');
            //tab key press here
            grid.element.querySelector('.e-editedbatchcell').querySelector('input').value = '10';
            grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            grid.editSettings.showConfirmDialog = false;
            grid.closeEdit();            
            done();
        });
        afterAll(() => {
            destroy(grid);
            grid = rows = preventDefault = updateAggregatesVal = cell = customCount = null;
        });
    });

    describe('Aggregate in group/group caption', () => {

        let rows: HTMLTableRowElement;
        let preventDefault: Function = new Function();
        let cell: HTMLElement;
        let updateAggregatesVal: string = '';
        let customCount: CustomSummaryType = (data: any) =>
            (
                'result' in data ? ('records' in data.result ?
                    data.result.records.filter((item: Object) =>
                        item['CustomerID'] === 'HANAR'
                    ).length :
                    data.result.filter((item: Object) =>
                        item['CustomerID'] === 'HANAR'
                    ).length)
                    :
                    ('items' in data ?
                        data.items.filter((item: Object) =>
                            item['CustomerID'] === 'HANAR'
                        ).length
                        : data.filter((item: Object) =>
                            item['CustomerID'] === 'HANAR'
                        ).length)

            );
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    pageSettings: { pageSize: 8 },
                    allowGrouping: true,
                    groupSettings: { showDropArea: false, columns: ['ShipCountry'] },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right', isPrimaryKey: true
                        },
                        { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }
                    ]
                },
                () => {
                    grid.aggregates = [
                        {
                            columns: [{
                                type: 'Sum',
                                field: 'Freight',
                                groupFooterTemplate: 'Sum: ${Sum}'
                            },
                            {
                                type: 'Custom',
                                customAggregate: customCount,
                                columnName: 'CustomerID',
                                groupFooterTemplate: 'Count : ${Custom}'
                            }
                            ]
                        },
                        {
                            columns: [{
                                type: 'Sum',
                                field: 'Freight',
                                groupCaptionTemplate: 'Sum :${Sum}'
                            }]
                        },
                        {
                            columns: [{
                                type: 'Custom',
                                customAggregate: customCount,
                                columnName: 'CustomerID',
                                footerTemplate: 'Count : ${Custom}'
                            },
                            {
                                type: 'Sum',
                                field: 'Freight',
                                footerTemplate: 'Count : ${Sum}'
                            }
                            ]
                        }
                    ];
                    grid.dataBind();
                    done();
                }
            );
        });
        it('update the group aggregates using tab key press', (done: Function) => {
            grid.editModule.editCell(0, 'Freight');
            let cellSave = (args?: any): void => {
                grid.cellSave = null;
                done();
            };
            grid.cellSave = cellSave;
            //tab key press here
            grid.element.querySelector('.e-editedbatchcell').querySelector('input').value = '100';
            grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
            let footer: Element = grid.element.querySelector('.e-gridfooter');
            expect(footer).not.toBeNull();
        });

        it('Delete: refresh aggregates in grouping', (done: Function) => {
            grid.selectRow(1);
            let row: Object = grid.getSelectedRecords();
            grid.clearSelection();
            grid.selectRow(2, true);
            grid.deleteRow(grid.getContent().querySelectorAll('.e-row')[2] as any);
            done();
        });

        it('SetRowData in grouping', (done: Function) => {
            grid.setRowData(10250, { OrderID: 1249, CustomerID: 'new value', Freight: 11 });
            done();
        });

        it('SetCellValue in footer', (done: Function) => {
            grid.setCellValue(10251, 'CustomerID', 'HANAR');
            done();
        });

        afterAll(() => {
            destroy(grid);
            grid = rows = preventDefault = updateAggregatesVal = cell = customCount = null;
        });
    });


    describe('Aggregate in inline edit mode', () => {

        let rows: HTMLTableRowElement;
        let preventDefault: Function = new Function();
        let cell: HTMLElement;
        let updateAggregatesVal: string = '';
        let customCount: CustomSummaryType = (data: any) =>
            (
                'result' in data ? ('records' in data.result ?
                    data.result.records.filter((item: Object) =>
                        item['CustomerID'] === 'HANAR'
                    ).length :
                    data.result.filter((item: Object) =>
                        item['CustomerID'] === 'HANAR'
                    ).length)
                    :
                    ('items' in data ?
                        data.items.filter((item: Object) =>
                            item['CustomerID'] === 'HANAR'
                        ).length
                        : data.filter((item: Object) =>
                            item['CustomerID'] === 'HANAR'
                        ).length)

            );
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    pageSettings: { pageSize: 8 },
                    allowGrouping: true,
                    allowSelection: true,
                    groupSettings: { showDropArea: false, columns: ['ShipCountry'] },
                    actionComplete: (args?: any): void => {
                        if (args.requestType === 'save') {
                            (<any>grid).aggregateModule.refresh(args.rowData);
                            (<any>grid).aggregateModule.refresh([args.rowData]);
                        }
                    },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right', isPrimaryKey: true
                        },
                        { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country' }
                    ]
                },
                () => {
                    grid.aggregates = [
                        {
                            columns: [{
                                type: 'Custom',
                                customAggregate: customCount,
                                columnName: 'CustomerID',
                                footerTemplate: 'Count : ${Custom}'
                            },
                            {
                                type: 'Sum',
                                field: 'Freight',
                                footerTemplate: 'Count : ${Sum}'
                            }
                            ]
                        }
                    ];
                    grid.dataBind();
                    done();
                }
            );
        });
        it('update the group aggregates using tab key press', (done: Function) => {

            grid.selectRow(0, true);
            (<any>grid.toolbarModule).toolbarClickHandler({ item: { id: grid.element.id + '_edit' } });
            (grid.element.querySelector('#' + grid.element.id + 'Freight') as any).value = 100;
            grid.keyboardModule.keyAction({ action: 'enter', preventDefault: preventDefault, target: grid.getContent().querySelector('.e-row') } as any);         
            done();
        });
        it('realtime updating in inline editing', (done: Function) => {
            grid.selectRow(1, true);
            let row = grid.getSelectedRecords()[0];
            row['Freight'] = 10.25;
            (<any>grid).aggregateModule.refresh(row);
            grid.clearSelection();
            done();
        });
        afterAll(() => {
            destroy(grid);
            grid = rows = preventDefault = updateAggregatesVal = cell = customCount = null;
        });
    });

    describe('Reactive aggregates in batch editing with frozen', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        let preventDefault: Function = new Function();
        let updateAggregatesVal: string = '';
        let cell: HTMLElement;
        let customCount: CustomSummaryType = (data: any) =>
            (
                'result' in data ? ('records' in data.result ?
                    data.result.records.filter((item: Object) =>
                        item['CustomerID'] === 'HANAR'
                    ).length :
                    data.result.filter((item: Object) =>
                        item['CustomerID'] === 'HANAR'
                    ).length)
                    :
                    ('items' in data ?
                        data.items.filter((item: Object) =>
                            item['CustomerID'] === 'HANAR'
                        ).length
                        : data.filter((item: Object) =>
                            item['CustomerID'] === 'HANAR'
                        ).length)

            );
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    pageSettings: { pageSize: 8 },
                    frozenRows: 1,
                    frozenColumns: 1,
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right', isPrimaryKey: true,
                            textAlign: 'Right'
                        },
                        { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                },
                () => {
                    grid.aggregates = [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            footerTemplate: 'Sum: ${Sum}'
                        }]
                    }];
                    grid.dataBind();
                    done();
                }
            );
        });
        it('Update aggregates in footer,when enabled the frozen ', (done: Function) => {
            grid.editModule.editCell(0, 'Freight');
            let cellSave = (args?: any): void => {
                grid.cellSave = null;
                done();
            };
            grid.cellSave = cellSave;
            //tab key press here
            grid.element.querySelector('.e-editedbatchcell').querySelector('input').value = '100';
            grid.keyboardModule.keyAction({ action: 'tab', preventDefault: preventDefault, target: cell } as any);
        });
        afterAll(() => {
            destroy(grid);
            grid = rows = preventDefault = updateAggregatesVal = cell = customCount = null;
        });
    });

    describe('Reactive aggregates in batch editing', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        let datas = new DataManager({
            json: data,
            adaptor: new RemoteSaveAdaptor
        });
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource : datas,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch'},
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    pageSettings: { pageSize: 8 },
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right', isPrimaryKey: true,
                            textAlign: 'Right'
                        },
                        { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],
                    aggregates: [{ columns: [{ type: 'Sum', field: 'Freight', format: 'C2', footerTemplate: 'Sum: ${Sum}' }] }]
                },done);
        });
        it('Reactive aggregate with remote save adaptor ', () => {
            expect((grid.getFooterContent().querySelector('.e-templatecell') as HTMLElement).innerText).toBe('Sum: $696.45');
            grid.editModule.editCell(0, 'Freight');
            grid.editModule.saveCell();
            expect(grid.isEdit).toBeFalsy();
            expect((grid.getFooterContent().querySelector('.e-templatecell') as HTMLElement).innerText).toBe('Sum: $696.45');
            grid.editModule.editCell(0, 'CustomerID');
            grid.editModule.saveCell();
            expect((grid.getFooterContent().querySelector('.e-templatecell') as HTMLElement).innerText).toBe('Sum: $696.45');
        });
        it('memory leak', () => {     
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });   
        afterAll(() => {
            destroy(grid);
            grid = rows = datas = null;
        });
    });
    
    describe('Frozen columns with aggregates', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch'},
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    frozenColumns: 2,
                    frozenRows: 1,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID' },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' },
                        { field: 'ShipName', headerText: 'Ship Name',},
                        { field: 'ShipCountry', headerText: 'Ship Country' },
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            footerTemplate: 'Sum: ${Sum}'
                        },
                        {
                            type: 'Average',
                            field: 'OrderID',
                            footerTemplate: 'Average: ${Average}'
                        }]
                    }]
                },
                done
            );
        });

        it('Footer content  scroll check', () => {
            grid.element.querySelector('.e-movablecontent').scroll(200, 0);
            let left : number = (grid.element.querySelector('.e-movablecontent')).scrollLeft;
            grid.editModule.updateCell(5, 'ShipRegion', 'updated');
            (grid.aggregateModule as any).footerRenderer.refresh();
            expect(grid.element.querySelector('.e-movablefootercontent').scrollLeft).toBe(left);
        });

        afterAll(() => {
            destroy(grid);
            grid = rows = null;
        });
    });
    
    describe('Reactive aggregates in footer with batch editing and frozen columns', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    pageSettings: { pageSize: 8 },
                    frozenRows: 2,
                    frozenColumns: 2,
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right', isPrimaryKey: true,
                            textAlign: 'Right'
                        },
                        { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],

                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            footerTemplate: 'Sum: ${Sum}'
                        }]

                    }
                    ]

                },
                done
            );
        });

        it('Add a new row with data in footer', (done: Function) => {
            expect((grid.aggregateModule as any).footerRenderer.aggregates.aggregates["Freight - sum"].toFixed(2)).toBe('696.45');
            let batchAdd = (args?: any): void => {
                expect((grid.aggregateModule as any).footerRenderer.aggregates.aggregates["Freight - sum"].toFixed(2)).toBe('706.45');
                grid.batchAdd = null;
                done();
            };
            grid.batchAdd = batchAdd;
            grid.addRecord({ OrderID: 10242, CustomerID: 'HANAR', Freight: 10 });
        });
        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });

    describe('Aggregates with mapping uid and index', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    pageSettings: { pageSize: 8 },
                    frozenRows: 2,
                    frozenColumns: 2,
                    height: 500,
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right', isPrimaryKey: true,
                            textAlign: 'Right'
                        },
                        { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],

                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            footerTemplate: 'Sum: ${Sum}'
                        }]

                    }
                    ]

                },
                done
            );
        });

        it('checking index and mapping uid of the column', () => {
            expect(grid.getFooterContent().querySelector('.e-summarycell').getAttribute('index')).toBe('0');
            expect(grid.getFooterContent().querySelector('.e-summarycell').hasAttribute('e-mappinguid')).toBeTruthy();
        });

        it('Remove padding when using hideScroll in Footer content', () => {
            expect(grid.getFooterContent().classList.contains('e-footerpadding')).toBeTruthy();
            grid.hideScroll();
            expect(grid.getFooterContent().classList.contains('e-footerpadding')).toBeFalsy();
        });
        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });

    describe('Aggregates with setRow method', () => {
        let grid: Grid;
        let rowDataBound: (args: any) => void;
        let localdata = [
            { OrderID: 10248, Customer: { ID: "VINET" }, EmployeeID: 5, Freight: 32.38 },
            { OrderID: 10249, Customer: { ID: "TOMSP" }, EmployeeID: 6, Freight: 11.61 },
            { OrderID: 10250, Customer: { ID: "HANAR" }, EmployeeID: 2, Freight: 65.83 }
        ];
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right', isPrimaryKey: true,
                            textAlign: 'Right'
                        },
                        { field: 'Customer.ID', headerText: 'Customer ID', textAlign: 'Right' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd', type: 'datetime' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            footerTemplate: 'Sum: ${Sum}'
                        }]
                    }
                    ],
                },
                done
            );
        });

        it('checking index and mapping uid of the column', (done: Function) => {
            rowDataBound = (args:any)=>{
                expect((grid.getRowByIndex(0) as any).cells[2].innerHTML).toBe('$32.4');
                done();
            }
            localdata[0].Freight = 100; 
            var tempdata = localdata[0];
            grid.rowDataBound = rowDataBound;
            grid.setRowData(10248,tempdata);
            expect((grid.getRowByIndex(0) as any).cells[2].innerHTML).toBe('$100.0');
        });
        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });    

    describe('Frozen columns with aggregates', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data.slice(0,4),
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch'},
                    toolbar: ['Add','Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    frozenColumns: 2,
                    frozenRows: 1,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' },
                        { field: 'ShipName', headerText: 'Ship Name',},
                        { field: 'ShipCountry', headerText: 'Ship Country' },
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            footerTemplate: 'Sum: ${Sum}'
                        },
                        ]
                    }]
                },
                done
            );
        });

        it('Edit cell value', () => {
            expect((grid.aggregateModule as any).footerRenderer.aggregates.aggregates["Freight - sum"].toFixed(2)).toBe('151.16');
            grid.editModule.editCell(3, 'Freight');
            (grid.getContent().querySelector('.e-editedbatchcell').querySelector('.e-input')as any).value = 44.34;
            grid.editModule.batchSave();
            expect((grid.aggregateModule as any).footerRenderer.aggregates.aggregates["Freight - sum"].toFixed(2)).toBe('154.16');
        });

        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });

    describe('EJ2-35825-Aggregates with empty Grid batch adding', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: [],
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch'},
                    toolbar: ['Add', 'Delete', 'Update', 'Cancel'],
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID' },
                        { field: 'Freight', format: 'C2' },
                        { field: 'ShipName', headerText: 'Ship Name',},
                        { field: 'ShipCountry', headerText: 'Ship Country' },
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            footerTemplate: 'Sum: ${Sum}'
                        },
                        {
                            type: 'Average',
                            field: 'OrderID',
                            footerTemplate: 'Average: ${Average}'
                        }]
                    }]
                },
                done
            );
        });

        it('adding record', () => {
            grid.addRecord({ OrderID: 10242, CustomerID: 'HANAR', Freight: 1 });
            let AggregateRow: HTMLTableRowElement = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            let afterSumVal: string = AggregateRow.cells[1].innerHTML;
            expect(AggregateRow).not.toBeNull();
            expect(afterSumVal).toBe('Sum: 1');
        });

        it('cancel the added value ', (done: Function) => {
            grid.editSettings.showConfirmDialog = false;
            grid.closeEdit();
            let AggregateRow: HTMLTableSectionElement = (grid.getFooterContentTable() as HTMLTableElement).tFoot;
            expect(AggregateRow.childElementCount).toBe(0);           
            done();
        });

        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });
    describe('EJ2-37046 when combining Aggregate, Resize and Freeze and calling autoFitColumns() on the same Grid throws script error', () => {
        let gridObj: Grid;
        let actionComplete: (e?: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    allowSorting: true,
                    frozenColumns: 1,
                    pageSettings: { pageCount: 5 },
                    columns: [
                      { field: "CustomerName", headerText: "Customer Name", width: 150 },
                      { field: "Freight", width: 160, format: "C2", textAlign: "Right" },
                      { field: "OrderDate", headerText: "Order Date", width: 130, format: "yMd", textAlign: "Right"},
                      { field: "ShipCountry", headerText: "Ship Country", width: 140 }
                    ],
                    aggregates: [
                      {
                        columns: [
                          {
                            type: "Sum",
                            field: "Freight",
                            format: "C2",
                            footerTemplate: "Sum: ${Sum}"
                          }
                        ]
                      },
                      {
                        columns: [
                          {
                            type: "Average",
                            field: "Freight",
                            format: "C2",
                            footerTemplate: "Average: ${Average}"
                          }
                        ]
                      }
                    ],
                    actionComplete : actionComplete
                }, done);
        });
      
        it('Query selector check', (done:Function) => {
            let dataBound = () => gridObj.autoFitColumns();
            actionComplete = (args: any): void => {
                expect((gridObj.getFooterContent().querySelector('.e-movablefootercontent').children[0] as any)).toBeDefined();
                done();
            }
            gridObj.dataBound = dataBound;
            gridObj.actionComplete = actionComplete;
            let cols: any = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            cols[1].click();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('EJ2-39551 - Show column names for aria-label in the summary row', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    pageSettings: { pageCount: 5 },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 150 }
                    ],
                    aggregates: [{
                        columns: [{
                                type: 'Sum',
                                field: 'Freight',
                                format: 'C2',
                                footerTemplate: 'Sum: ${Sum}'
                            }]
                    },
                    {
                        columns: [{
                                type: 'Average',
                                field: 'Freight',
                                format: 'C2',
                                footerTemplate: 'Average: ${Average}'
                            }]
                    }]
                },done);
        });
        it('check aria-label summary-cell', () => {
            let rows = ((grid.getFooterContentTable() as HTMLTableElement).tFoot.rows[0] as HTMLTableRowElement);
            expect(rows.cells[0].getAttribute('aria-label').toString().indexOf('Order ID')).toBeGreaterThan(0);
            expect(rows.cells[1].getAttribute('aria-label').toString().indexOf('Freight')).toBeGreaterThan(0);
            expect(rows.cells[2].getAttribute('aria-label').toString().indexOf('Order Date')).toBeGreaterThan(0);
            expect(rows.cells[3].getAttribute('aria-label').toString().indexOf('Ship Country')).toBeGreaterThan(0);
        });
        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });

    describe('EJ2-41305 - Footer cell was not aligned properly when the height value was not in number format', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    ],
                    height:'300px',
                    aggregates: [{
                        columns: [{
                                type: 'Sum',
                                field: 'OrderID',
                                footerTemplate: '${Sum}'
                            }]
                    }]
                },done);
        });
        it('check footercontent padding', () => {
            expect(grid.getFooterContent().classList.contains('e-footerpadding')).toBeTruthy();
        });
        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });

    describe('EJ2-42438 - Footer aggregate aligment issue', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                    ],
                    aggregates: [{
                        columns: [{
                                type: 'Sum',
                                field: 'OrderID',
                                footerTemplate: '${Sum}'
                            }]
                    }]
                },done);
        });
        it('checking without scroll', () => {
            expect(grid.getFooterContent().classList.contains('e-footerpadding')).toBeFalsy();
        });
        afterAll(() => {
            destroy(grid);
            grid = null;
        });
    });

});