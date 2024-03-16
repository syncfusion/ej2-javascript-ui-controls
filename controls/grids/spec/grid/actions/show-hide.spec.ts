/**
 * Show hide module specs
 */
import { EmitType, select, isNullOrUndefined } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Filter } from '../../../src/grid/actions/filter';
import { contentReady, freezeRender } from '../../../src/grid/base/constant';
import { GridModel } from '../../../src/grid/base/grid-model';
import { Column } from '../../../src/grid/models/column';
import { data, filterData, employeeData } from '../base/datasource.spec';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import '../../../node_modules/es6-promise/dist/es6-promise';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { Resize } from '../../../src/grid/actions/resize';
import { RowDD } from '../../../src/grid/actions/row-reorder';
import { Edit } from '../../../src/grid/actions/edit';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { InfiniteScroll } from '../../../src/grid/actions/infinite-scroll';
import { Group } from '../../../src/grid/actions/group';
import { Aggregate } from '../../../src/grid/actions/aggregate';

Grid.Inject(Aggregate, Filter, Resize, DetailRow, RowDD, Edit, VirtualScroll, InfiniteScroll, Group);

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
            rows = null;
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
                    grid.showColumns('Order ID');
                    done();
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].style.display).toBe('');
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('');
        });


        afterAll(() => {
            destroy(grid);
            rows = null;
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
                    grid.hideColumns('Order ID');
                    done();
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].style.display).toBe('none');
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
        });


        afterAll(() => {
            destroy(grid);
            rows = null;
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
                    grid.showColumns(['OrderID'], 'field');
                    done();
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].style.display).toBe('');
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('');
        });


        afterAll(() => {
            destroy(grid);
            rows = null;
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
                    grid.hideColumns(['OrderID'], 'field');
                    done();
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].style.display).toBe('none');
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
        });


        afterAll(() => {
            destroy(grid);
            rows = null;
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
                    grid.showColumns((<Column>grid.getColumns()[0]).uid, 'uid');
                    done();
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].style.display).toBe('');
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('');
        });


        afterAll(() => {
            destroy(grid);
            rows = null;
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
                    grid.hideColumns((<Column>grid.getColumns()[0]).uid, 'uid');
                    done();
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].style.display).toBe('none');
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
        });


        afterAll(() => {
            destroy(grid);
            rows = null;
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
                    let cols: Column[] = <Column[]>(grid.getColumns());
                    cols[0].visible = true;
                    cols[1].visible = false;
                    grid.showHider.setVisible();
                    done();
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].style.display).toBe('');
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[1] as HTMLTableRowElement;
            expect(rows.cells[1].style.display).toBe('none');
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
            rows = null;
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
                expect(grid.getContent().querySelectorAll('.e-rowcell.e-hide.e-gridchkbox-cell').length).toBe(grid.currentViewData.length);
                expect((grid.getContent().querySelectorAll('.e-rowcell')[1] as HTMLElement).style.display).toBe('none');
                done();
            }, 1000);

        });
        it('show hidden columns', (done: Function) => {
            grid.showColumns(['Verified', 'Order ID'], 'headerText');
            setTimeout(() => {
                expect(grid.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(0);
                expect(grid.getContent().querySelectorAll('.e-rowcell.e-hide').length).toBe(0);
                expect((grid.getContent().querySelectorAll('.e-rowcell')[0] as HTMLElement).style.display).toBe('');
                expect((grid.getContent().querySelectorAll('.e-rowcell')[1] as HTMLElement).style.display).toBe('');
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
        it('Show Column using headerText', () => {
            gridObj.showColumns('Order ID');
            rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].style.display).toBe('');
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('');
        });
        it('Hide Column using headerText', () => {
            gridObj.hideColumns('Order ID');
            rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeTruthy();
            rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].style.display).toBe('none');
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('none');
        });
        it('Show Column using field', () => {
            gridObj.showColumns(['OrderID'], 'field');
            rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].classList.contains('e-hide')).toBeFalsy();
            rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[0].style.display).toBe('');
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[0];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[0];
            expect(col.style.display).toBe('');
        });
        it('Hide Column using field', () => {
            gridObj.hideColumns(['Freight'], 'field');
            rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[2].classList.contains('e-hide')).toBeTruthy();
            rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[2].style.display).toBe('none');
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[2];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[2];
            expect(col.style.display).toBe('none');
        });
        it('Show Column using UID', () => {
            gridObj.showColumns((<Column>gridObj.getColumns()[2]).uid, 'uid');
            rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[2].classList.contains('e-hide')).toBeFalsy();
            rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[2].classList.contains('e-hide')).toBeFalsy();
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[2];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[2];
            expect(col.style.display).toBe('');
        });
        it('SetVisible function', () => {
            let cols: Column[] = <Column[]>(gridObj.getColumns());
            cols[2].visible = true;
            cols[1].visible = false;
            gridObj.showHider.setVisible();
            rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[2].classList.contains('e-hide')).toBeFalsy();
            rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[2].classList.contains('e-hide')).toBeFalsy();
            rows = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
            rows = ((gridObj.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[1] as HTMLTableRowElement;
            expect(rows.cells[1].style.display).toBe('none');
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[2];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[2];
            expect(col.style.display).toBe('');
            col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getHeaderTable()).children[0].children[1];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>gridObj.getContentTable()).children[0].children[1];
            expect(col.style.display).toBe('none');
        });
        afterAll(() => {
            destroy(gridObj);
            rows = null;
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
            destroy(gridObj);
        });
    });
    
    describe('EJ2-26051===>script error throws when invoke hidecolumns with empty data', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [
                        { field: 'OrderID', type: 'number', validationRules: { required: true } },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'CustomerID', type: 'string' }
                    ]
                },
                () => {
                    gridObj.hideColumns('Verified', 'headerText');
                    done();                   
                }
            );
        });

        it('checking after invoking the hide column method(with empty datasource)', () => {
            expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-rowcell.e-hide').length).toBe(gridObj.currentViewData.length);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('EJ2-35609-Hide Column with resizing and row drag and drop', () => {
        let grid: Grid;
        let rows: HTMLTableRowElement;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    allowReszing:true,
                    allowRowDragAndDrop:true,
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
                    grid.hideColumns(['OrderID'], 'field');
                    done();
                }
            );
        });
        it('check TH/TD visiblity', () => {
            rows = (grid.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
            rows = ((grid.getContentTable() as any).tBodies[0] as HTMLTableElement).rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].style.display).toBe('none');
        });

        it('check colgroup->col visiblity', () => {
            let col: HTMLTableColElement = <HTMLTableColElement>(<HTMLTableElement>grid.getHeaderTable()).children[0].children[1];
            expect(col.style.display).toBe('none');
            col = <HTMLTableColElement>(<HTMLTableElement>grid.getContentTable()).children[0].children[1];
            expect(col.style.display).toBe('none');
        });


        afterAll(() => {
            destroy(grid);
            rows = null;
        });
    });
    describe('EJ2-37190 => Form not closed for the Column choooser action', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', isPrimaryKey: true }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowPaging: true,
                    selectedRowIndex: 2,
                    editSettings: { allowAdding: true, allowEditing: true, allowDeleting: true },
                    pageSettings: { pageSize: 5 },
                }, done);
        });
        
        it('Check form is ceated', (done: Function) => {
            gridObj.actionComplete = (e)=>{
                if (e.requestType === 'beginedit') {
                    expect(isNullOrUndefined(document.querySelector(".e-gridform"))).toBe(false);
                }
                done();
            }
            gridObj.startEdit();
        });
        it('Check form is closed after hiding column', (done: Function) => {
            gridObj.hideColumns('EmployeeID', 'field')
            expect(gridObj.getVisibleColumns().length).toBe(4);
            expect(isNullOrUndefined(document.querySelector(".e-gridform"))).toBe(true);
            done();
        });
        it('Check form is closed after column choooser action', (done: Function) => {
            gridObj.showColumns('EmployeeID', 'field')
            expect(gridObj.getVisibleColumns().length).toBe(5);
            expect(isNullOrUndefined(document.querySelector(".e-gridform"))).toBe(true);
            done();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });

    });
    describe('EJ2-45608 - Checkbox selection not persisting when show/hide columns is performed', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    selectionSettings: { type: 'multiple', persistSelection: true },
                    columns: [
                        { type: 'checkbox', width: 50 },
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'ShipName', headerText: 'Ship Name', width: '170' },
                    ]
                }, done);
        });
        it('checking the row select with persistSelection', () => {
            gridObj.selectRow(2, true);
            gridObj.hideColumns(['Order ID']);
            expect(gridObj.getSelectedRecords().length).toBe(1);
        });
        
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('EJ2-50707 - Show/hide columns not working properly with virtualization', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    enableVirtualization: true,
                    height: 400,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                        { field: 'Freight', format: 'C2', textAlign: 'Right' },
                        { field: 'ShipName', headerText: 'Ship Name' }
                    ]
                }, done);
        });
        it('Hide Column without columns width and with virtualization', () => {
            gridObj.hideColumns(['Order ID']);
            expect(gridObj.getVisibleColumns().length).toBe(3);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('EJ2-58915 - Check visible row object after hiding column', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    height: 300,
                    enableInfiniteScrolling: true,
                    allowGrouping: true,
                    pageSettings: { pageSize: 50 },
                    columns: [
                        { field: 'OrderID', headerText: 'OrderID', isPrimaryKey: true, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'ShipName', headerText: 'ShipName' }
                    ],
                    groupSettings: { columns: ['CustomerID'] }
                }, done);
        });
        it('Check visible row object', () => {
            gridObj.hideColumns(['ShipName']);
            expect((gridObj.contentModule as any).visibleRows.length).toBe(114);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
        
    describe('EJ2-69504 - Copy not working properly when using hideColumns property', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right'}
                    ],
                    pageSettings: { pageCount: 5 }
                }, done);
        });

        it('Hide a Columns and check the copy value', () => {
            gridObj.hideColumns(['Customer Name', 'Order Date']);
            gridObj.selectRows([1]);
            gridObj.copy(true);
            expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
                === 'Order ID\tFreight\n10249\t$11.61').toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Frozen Revamp feature', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    allowGrouping: true,
                    allowFiltering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true,   freeze: 'Left', width: 120, validationRules: { required: true, number: true }, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name', validationRules: { required: true }, width: 160, freeze: 'Left' },
                        { field: 'ShipName', headerText: 'Ship Name', width: '190' },
                        { field: 'Freight', width: 150, format: 'C', validationRules: { required: true }, textAlign: 'Right' },
                        { field: 'ShipAddress', headerText: 'Ship Address', width: '170' },
                        { field: 'OrderDate', headerText: 'Order Date', editType: 'datetimepickeredit', format: { type: 'dateTime', format: 'M/d/y hh:mm a' },
                            width: 160
                        },
                        { field: 'EmployeeID', headerText: 'Employee ID', width: '150', freeze: 'Fixed' },
                        { field: 'ShipRegion', headerText: 'Ship Region', width: '150', freeze: 'Fixed' },
                        { field: 'ShipCity', headerText: 'Ship City', width: '170' },
                        { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 170,
                            edit: { params: { popupHeight: '300px' }  }
                        },
                        { field: 'ShipPostalCode', headerText: 'ShipPostal Code', width: '150', freeze: 'Right' },
                        { field: 'Verified', headerText: 'Boolean', width: '150', freeze: 'Right' },
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            groupFooterTemplate: 'Total units: ${Sum}'
                        },
                        {
                            type: 'Max',
                            field: 'Freight',
                            groupCaptionTemplate: 'Maximum: ${Max}'
                        },
                        {
                            type: 'Sum',
                            field: 'Freight',
                            format: 'C2',
                            footerTemplate: 'Sum: ${Sum}'
                        }]
                    }],
                    actionComplete: actionComplete,
                    pageSettings: { pageCount: 5 }
                }, done);
        });

        it('Hide a Freeze Left Columns', () => {
            gridObj.hideColumns(['Customer Name']);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(1);
            let rows: HTMLTableRowElement = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[1].classList.contains('e-hide')).toBeTruthy();
        });
        it('Hide a Freeze Right Columns', () => {
            gridObj.hideColumns(['ShipPostal Code']);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(2);
            let rows: HTMLTableRowElement = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[10].classList.contains('e-hide')).toBeTruthy();
            gridObj.showColumns(['ShipPostal Code', 'Customer Name'], 'headerText');
        });
        it('column group testing', (done: Function) => {
            actionComplete = (): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('CustomerID');
        });
        it('Hide a Grouping Freeze Left Columns', () => {
            gridObj.hideColumns(['Ship Name']);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(2);
            let rows: HTMLTableRowElement = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[2].classList.contains('e-hide')).toBeTruthy();
            expect(rows.cells[3].classList.contains('e-hide')).toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Frozen Revamp feature with Grouping', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    allowGrouping: true,
                    allowFiltering: true,
                    allowRowDragAndDrop: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true,   freeze: 'Left', width: 120, validationRules: { required: true, number: true }, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name', validationRules: { required: true }, width: 160, freeze: 'Left' },
                        { field: 'ShipName', headerText: 'Ship Name', width: '190' },
                        { field: 'Freight', width: 150, format: 'C', validationRules: { required: true }, textAlign: 'Right' },
                        { field: 'ShipAddress', headerText: 'Ship Address', width: '170' },
                        { field: 'OrderDate', headerText: 'Order Date', editType: 'datetimepickeredit', format: { type: 'dateTime', format: 'M/d/y hh:mm a' },
                            width: 160
                        },
                        { field: 'EmployeeID', headerText: 'Employee ID', width: '150', freeze: 'Fixed' },
                        { field: 'ShipRegion', headerText: 'Ship Region', width: '150', freeze: 'Fixed' },
                        { field: 'ShipCity', headerText: 'Ship City', width: '170' },
                        { field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 170,
                            edit: { params: { popupHeight: '300px' }  }
                        },
                        { field: 'ShipPostalCode', headerText: 'ShipPostal Code', width: '150', freeze: 'Right' },
                        { field: 'Verified', headerText: 'Boolean', width: '150', freeze: 'Right' },
                    ],
                    actionComplete: actionComplete,
                    pageSettings: { pageCount: 5 }
                }, done);
        });

        it('Hide a Freeze Left Columns', () => {
            gridObj.hideColumns(['Customer Name']);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(1);
            let rows: HTMLTableRowElement = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[2].classList.contains('e-hide')).toBeTruthy();
            gridObj.showColumns(['Customer Name'], 'headerText');
        });
        it('column group testing', (done: Function) => {
            actionComplete = (): void => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('CustomerID');
        });
        it('Hide a Grouping Freeze Left Columns', () => {
            gridObj.hideColumns(['Ship Name']);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell.e-hide').length).toBe(2);
            let rows: HTMLTableRowElement = (gridObj.getHeaderTable() as any).tHead.rows[0] as HTMLTableRowElement;
            expect(rows.cells[3].classList.contains('e-hide')).toBeTruthy();
            expect(rows.cells[4].classList.contains('e-hide')).toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-870490 - Issue with column chooser hidden maintain when editing the record', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowPaging: true,
                    columns: [
                        { field: 'EmployeeID', visible: false, headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                        { field: 'Title', headerText: 'Title', textAlign: 'Left', width: 120 },
                        { field: 'City', headerText: 'City', textAlign: 'Left', width: 100 },
                        { field: 'Country', headerText: 'Country', textAlign: 'Left', width: 100 }
                    ],
                    pageSettings: { pageCount: 5 },
                    childGrid: {
                        dataSource: filterData,
                        queryString: 'EmployeeID',
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 75 },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                            { field: 'ShipCity', headerText: 'Ship City', textAlign: 'Left', width: 100 },
                            { field: 'Freight', headerText: 'Freight', textAlign: 'Left', width: 120 },
                            { field: 'ShipName', headerText: 'Ship Name', textAlign: 'Left', width: 100 }
                        ]
                    }
                }, done);
        });

        it('Show a Columns and check the visible property in cell object', () => {
            gridObj.showColumns(['Employee ID'], 'headerText');
            expect(gridObj.getRowsObject()[0].cells[1].visible).toBe(true);
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
});
