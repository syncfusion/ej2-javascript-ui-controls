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
import '../../../node_modules/es6-promise/dist/es6-promise'; 
import { Group } from '../../../src/grid/actions/group';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { Selection } from '../../../src/grid/actions/selection';
import { Freeze } from '../../../src/grid/actions/freeze';
import { DataManager, ODataAdaptor } from '@syncfusion/ej2-data';

Grid.Inject(Aggregate, Edit, Group, Toolbar, Selection, Freeze);


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
        });
    });
});