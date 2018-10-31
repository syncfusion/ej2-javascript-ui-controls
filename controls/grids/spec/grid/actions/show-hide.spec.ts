/**
 * Show hide module specs
 */
import { EmitType, select } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { Freeze } from '../../../src/grid/actions/freeze';
import { contentReady, freezeRender } from '../../../src/grid/base/constant';
import { GridModel } from '../../../src/grid/base/grid-model';
import { Column } from '../../../src/grid/models/column';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';

Grid.Inject(Filter, Freeze);

describe('ShowHide module testing', () => {

    let createGrid: Function = (options: GridModel, done: Function): Grid => {
        let grid: Grid;
        let dataBound: EmitType<Object> = () => { done(); };
        grid = new Grid(
            extend(
                {}, {
                    dataSource: data,
                    dataBound: dataBound,
                },
                options
            )
        );
        document.body.appendChild(createElement('div', { id: 'Grid' }));
        grid.appendTo('#Grid');
        return grid;
    };

    let destroy: EmitType<Object> = (grid: Grid) => {
        if (grid) {
            //  grid.destroy();
            document.getElementById('Grid').remove();
        }
    };

    describe('Hide column at initial rendering', () => {
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
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                },
                done
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
        });

        // it('check colgroup->col visiblity', () => {
        //     let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
        //     expect(col.style.display).toBe('none');
        //     col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
        //     expect(col.style.display).toBe('none');
        // });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Show Column using headerText', () => {
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
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.showColumns('Order ID');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Hide Column using headerText', () => {
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
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.hideColumns('Order ID');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Show Column using field', () => {
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
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.showColumns(['OrderID'], 'field');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Hide Column using field', () => {
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
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.hideColumns(['OrderID'], 'field');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Show Column using UID', () => {
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
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.showColumns((<Column>grid.getColumns()[0]).uid, 'uid');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Hide Column using UID', () => {
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
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    grid.hideColumns((<Column>grid.getColumns()[0]).uid, 'uid');
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    describe('SetVisible function', () => {
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
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                },
                () => {
                    grid.on(contentReady, done);
                    let cols: Column[] = <Column[]>(grid.getColumns());
                    cols[0].visible = true;
                    cols[1].visible = false;
                    grid.showHider.setVisible();
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[1] as HTMLTableRowElement;
            expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[1];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[1];
            expect(col.style.display).toBe('none');
        });


        afterAll(() => {
            destroy(grid);
        });
    });

    // check Show-hide enabled with filtering

    describe('show/hide with filtering', () => {
        let grid: Grid;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: data,
                    allowFiltering: true,
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right', visible: false
                        },
                        { field: 'Verified', displayAsCheckBox: true, type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ]
                }, done);
        });
        it('render grid with filter enable', () => {
            expect(grid.getHeaderContent().querySelectorAll('.e-filterbarcell.e-hide').length).
                toBe(grid.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length);
        });
        it('hide a column with filter enabled', (done: Function) => {
            grid.hideColumns('Verified', 'headerText');
            setTimeout(() => {
                expect(grid.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(2);
                expect(grid.getHeaderContent().querySelectorAll('.e-filterbarcell.e-hide').length).toBe(2);
                expect(grid.getContent().querySelectorAll('.e-rowcell.e-hide').length).toBe(grid.currentViewData.length * 2)
                done();
            }, 1000);

        });
        it('show hidden columns', (done: Function) => {
            grid.showColumns(['Verified', 'Order ID'], 'headerText');
            setTimeout(() => {
                expect(grid.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(0);
                expect(grid.getContent().querySelectorAll('.e-rowcell.e-hide').length).toBe(0);
                done();
            }, 1000);

        });
        afterAll(() => {
            destroy(grid);
        });
    });

    describe('Show / Hide Test with Freeze pane', () => {
        let gridObj: Grid;
        let dBound: () => void;
        let actionBegin: () => void;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenColumns: 2,
                    frozenRows: 2,
                    columns: [
                        {
                            field: 'OrderID', headerText: 'Order ID', headerTextAlign: 'Right',
                            textAlign: 'Right', visible: false
                        },
                        { field: 'Verified', type: 'boolean' },
                        { field: 'Freight', format: 'C1' },
                        { field: 'OrderDate', format: 'yMd' },
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right' }
                    ],
                    actionBegin: actionBegin,
                }, done);
        });
        it('Hide column at initial rendering', () => {
            rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
        });
        it('Show Column using headerText', (done: Function) => {
            gridObj.showColumns('Order ID');
            dBound = (args?: Object): void => {
                rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[0];
                expect(col.style.display).toBe('');
                col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[0];
                expect(col.style.display).toBe('');
                done();
            }
            gridObj.dataBound = dBound;
        });
        it('Hide Column using headerText', (done: Function) => {
            gridObj.hideColumns('Order ID');
            dBound = (args?: Object): void => {
                rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
                rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
                let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[0];
                expect(col.style.display).toBe('none');
                col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[0];
                expect(col.style.display).toBe('none');
                done();
            }
            gridObj.dataBound = dBound;
        });
        it('Show Column using field', (done: Function) => {
            gridObj.showColumns(['OrderID'], 'field');
            dBound = (args?: Object): void => {
                rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[0];
                expect(col.style.display).toBe('');
                col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[0];
                expect(col.style.display).toBe('');
                done();
            }
            gridObj.dataBound = dBound;
        });
        it('Hide Column using field', (done: Function) => {
            gridObj.hideColumns(['Freight'], 'field');
            dBound = (args?: Object): void => {
                rows =
                    (gridObj.getHeaderContent().querySelector('.e-movableheader').children[0] as any).tHead.rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
                rows = ((select('.e-movablecontent').children[0] as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
                let col: HTMLTableColElement =
                    <HTMLTableColElement>(<HTMLTableElement>select('.e-movableheader').children[0]).children[0].children[0];
                expect(col.style.display).toBe('none');
                col = <HTMLTableColElement>(<HTMLTableElement>select('.e-movablecontent').children[0]).children[0].children[0];
                expect(col.style.display).toBe('none');
                done();
            }
            gridObj.dataBound = dBound;
        });
        it('Show Column using UID', (done: Function) => {
            gridObj.showColumns((<Column>gridObj.getColumns()[2]).uid, 'uid');
            dBound = (args?: Object): void => {
                rows =
                    (gridObj.getHeaderContent().querySelector('.e-movableheader').children[0] as any).tHead.rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                rows = ((select('.e-movablecontent').children[0] as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
                expect(rows.cells[2].classList.contains('e-hide')).toBeFalsy();
                let col: HTMLTableColElement =
                    <HTMLTableColElement>(<HTMLTableElement>select('.e-movableheader').children[0]).children[0].children[0];
                expect(col.style.display).toBe('');
                col = <HTMLTableColElement>(<HTMLTableElement>select('.e-movablecontent').children[0]).children[0].children[0];
                expect(col.style.display).toBe('');
                done();
            }
            gridObj.dataBound = dBound;
        });
        it('SetVisible function', (done: Function) => {
            let cols: Column[] = <Column[]>(gridObj.getColumns());
            cols[2].visible = true;
            cols[1].visible = false;
            gridObj.showHider.setVisible();
            dBound = (args?: Object): void => {
                rows =
                    (gridObj.getHeaderContent().querySelector('.e-movableheader').children[0] as any).tHead.rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                rows = ((select('.e-movablecontent').children[0] as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
                expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
                rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
                expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
                rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[1] as HTMLTableRowElement;
                expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
                let col: HTMLTableColElement =
                    <HTMLTableColElement>(<HTMLTableElement>select('.e-movableheader').children[0]).children[0].children[0];
                expect(col.style.display).toBe('');
                col = <HTMLTableColElement>(<HTMLTableElement>select('.e-movablecontent').children[0]).children[0].children[0];
                expect(col.style.display).toBe('');
                col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[1];
                expect(col.style.display).toBe('none');
                col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[1];
                expect(col.style.display).toBe('none');
                done();
            }
            gridObj.dataBound = dBound;
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-7262===>After Enabled The Hidden Column Editing Throws Script Error', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSelection: true,
                    selectionSettings: {type:'Multiple'},
                    allowPaging: true,
                    columns: [
                        { field: 'OrderID', type: 'number', validationRules: { required: true } },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'CustomerID', type: 'string' }
                    ]
                }, done);
        });

        it('EJ2-7262===> Calling setVisible Method', () =>{
            gridObj.selectionModule.selectRow(0, true);
            let isRefreshed: boolean = false;
            gridObj.selectionModule.clearSelection = ()=>{
                isRefreshed = true;
            };
            gridObj.showHider.setVisible();
            expect(isRefreshed).toBeTruthy();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

});