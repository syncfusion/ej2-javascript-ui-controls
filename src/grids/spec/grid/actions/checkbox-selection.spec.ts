/**
 * Grid Selection spec document
 */
import { Browser, EmitType } from '@syncfusion/ej2-base';
import { EventHandler, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Freeze } from '../../../src/grid/actions/freeze';
import { Selection } from '../../../src/grid/actions/selection';
import { Page } from '../../../src/grid/actions/page';
import { data } from '../base/datasource.spec';
import { Group } from '../../../src/grid/actions/group';
import { Sort } from '../../../src/grid/actions/sort';
import { Edit } from '../../../src/grid/actions/edit';
import { FocusStrategy } from '../../../src/grid/services/focus-strategy';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { employeeSelectData } from '../base/datasource.spec';
import { employeeData } from '../base/datasource.spec';
import { BeforeCopyEventArgs } from '../../../src/grid/base/interface';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { QueryCellInfoEventArgs } from '../../../src/grid/base/interface';
import { createGrid, destroy } from '../base/specutil.spec';

Grid.Inject(Selection, Page, Sort, Group, Edit, Toolbar);

//checkboxSelection
describe('Grid checkbox selection functionality', () => {
    describe('grid checkbox selection functionality with persist selection', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let preventDefault: Function = new Function();
        let chkBox: any;
        let args: any;
        let chkAll: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { type: 'checkbox', width: 50 },
                        { headerText: 'OrderID', isPrimaryKey: true, field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    pageSettings: { pageSize: 5 },
                    allowPaging: true,
                    allowSorting: true,
                    selectionSettings: { persistSelection: true }
                }, done);
        });

        it('dataBound', (done: Function) => {
            setTimeout(
                () => {
                    done();
                },
                2500);
        });


        it('checkbox render', () => {
            expect(gridObj.getHeaderContent().querySelectorAll('.e-checkselectall').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-checkselect').length).toBe(5);
        });

        it('click row for selection', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            chkAll = gridObj.element.querySelector('.e-checkselectall').nextElementSibling as HTMLElement;
            (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();

            expect(rows[0].querySelectorAll('.e-check').length).toBe(1);

            expect(chkAll.classList.contains('e-stop')).toBeTruthy();
        });

        it('toogle row for selection', () => {
            (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();

            expect(rows[0].querySelectorAll('.e-check').length).toBe(0);

            expect(chkAll.classList.contains('e-stop')).toBeFalsy();
        });

        it('checkbox down arrow', () => {
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();

            expect(rows[0].querySelectorAll('.e-check').length).toBe(0);
            expect(rows[1].querySelectorAll('.e-check').length).toBe(1);

            expect(chkAll.classList.contains('e-stop')).toBeTruthy();
        });

        it('checkbox up arrow', () => {
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();

            expect(rows[1].querySelectorAll('.e-check').length).toBe(1);
            expect(rows[0].querySelectorAll('.e-check').length).toBe(1);

            expect(chkAll.classList.contains('e-stop')).toBeTruthy();
        });

        it('selection method test', () => {
            gridObj.clearSelection();
            expect(rows[0].querySelectorAll('.e-check').length).toBe(0);

            selectionModule.selectRows([1, 2]);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);

            expect(rows[1].querySelectorAll('.e-check').length).toBe(1);
            expect(rows[2].querySelectorAll('.e-check').length).toBe(1);
        });

        it('goto page 2', (done: Function) => {
            let dataBound = (args: Object): void => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.goToPage(2);
        });

        it('goto page 1', (done: Function) => {
            let dataBound = (args: Object): void => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.goToPage(1);
        });


        it('check selection persistance', () => {
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);

            //checkbox element test
            expect(rows[1].querySelectorAll('.e-check').length).toBe(1);
            expect(rows[2].querySelectorAll('.e-check').length).toBe(1);

            //indeterminate status check
            expect(chkAll.classList.contains('e-stop')).toBeTruthy();
        });


        it('checkbox selection through space key', () => {
            rows = gridObj.getRows();
            (gridObj.selectionModule as any).applySpaceSelection((rows[3].querySelector('.e-checkselect') as HTMLElement));
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        });

        it('checkbox selection through space key for checkall', () => {
            gridObj.selectionModule.clearSelection();
            (gridObj.selectionModule as any).applySpaceSelection((gridObj.element.querySelector('.e-checkselectall') as HTMLElement));
            expect(chkAll.classList.contains('e-stop')).toBeFalsy();
            (gridObj.selectionModule as any).applySpaceSelection((gridObj.element.querySelector('.e-checkselectall') as HTMLElement));
            expect(gridObj.getSelectedRecords().length).toBe(0);
            expect(chkAll.classList.contains('e-uncheck')).toBeTruthy();
        });

        it('checkbox selection with reordering', () => {
            gridObj.selectRows([1, 2]);
            expect(gridObj.getSelectedRecords().length).toBe(2);
            (gridObj.selectionModule as any).columnPositionChanged();
            expect(gridObj.getSelectedRecords().length).toBe(2);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('grid without checkbox selection functionality with persist selection', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let preventDefault: Function = new Function();
        let chkBox: any;
        let args: any;
        let chkAll: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { headerText: 'OrderID', isPrimaryKey: true, field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    pageSettings: { pageSize: 5 },
                    allowPaging: true,
                    allowSorting: true,
                    selectionSettings: { persistSelection: true, type: 'Multiple' }
                }, done);
        });

        it('dataBound', (done: Function) => {
            setTimeout(
                () => {
                    done();
                },
                2500);
        });

        it('selection method test', () => {
            gridObj.clearSelection();
            rows = gridObj.getRows();
            expect(rows[0].querySelectorAll('.e-check').length).toBe(0);
            selectionModule = gridObj.selectionModule;
            selectionModule.selectRows([1, 2]);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
        });

        it('goto page 2', (done: Function) => {
            let dataBound = (args: Object): void => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.goToPage(2);
        });

        it('goto page 1', (done: Function) => {
            let dataBound = (args: Object): void => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.goToPage(1);
        });


        it('check selection persistance', () => {
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });


    describe('grid checkbox selection functionality without persist selection', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let preventDefault: Function = new Function();
        let chkBox: any;
        let args: any;
        let chkAll: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [
                        { type: 'checkbox', width: 50 },
                        { headerText: 'OrderID', isPrimaryKey: true, field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                    pageSettings: { pageSize: 5 },
                    allowPaging: true,
                    allowSorting: true,
                    selectionSettings: { persistSelection: false }
                }, done);
        });

        it('dataBound', (done: Function) => {
            setTimeout(
                () => {
                    done();
                },
                2500);
        });


        it('checkbox render', () => {
            expect(gridObj.getHeaderContent().querySelectorAll('.e-checkselectall').length).toBe(1);
            expect(gridObj.getContent().querySelectorAll('.e-checkselect').length).toBe(5);
        });

        it('click row for selection', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            chkAll = gridObj.element.querySelector('.e-checkselectall').nextElementSibling as HTMLElement;
            (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();

            expect(rows[0].querySelectorAll('.e-check').length).toBe(1);

            expect(chkAll.classList.contains('e-stop')).toBeTruthy();
        });

        it('toogle row for selection', () => {
            (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();

            expect(rows[0].querySelectorAll('.e-check').length).toBe(0);

            expect(chkAll.classList.contains('e-stop')).toBeFalsy();
        });

        it('checkbox down arrow', () => {
            let args: any = { action: 'downArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();

            expect(rows[0].querySelectorAll('.e-check').length).toBe(0);
            expect(rows[1].querySelectorAll('.e-check').length).toBe(1);

            expect(chkAll.classList.contains('e-stop')).toBeTruthy();
        });

        it('checkbox up arrow', () => {
            let args: any = { action: 'upArrow', preventDefault: preventDefault };
            gridObj.keyboardModule.keyAction(args);
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();

            expect(rows[1].querySelectorAll('.e-check').length).toBe(0);
            expect(rows[0].querySelectorAll('.e-check').length).toBe(1);

            expect(chkAll.classList.contains('e-stop')).toBeTruthy();
        });

        it('selection method test', () => {
            gridObj.clearSelection();
            expect(rows[0].querySelectorAll('.e-check').length).toBe(0);

            selectionModule.selectRows([1, 2]);
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(selectionModule.selectedRecords.length).toBe(2);

            expect(rows[1].querySelectorAll('.e-check').length).toBe(1);
            expect(rows[2].querySelectorAll('.e-check').length).toBe(1);
        });

        it('goto page 2', (done: Function) => {
            let dataBound = (args: Object): void => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.goToPage(2);
        });

        it('goto page 1', (done: Function) => {
            let dataBound = (args: Object): void => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.goToPage(1);
        });


        it('check selection persistance', () => {
            rows = gridObj.getRows();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(selectionModule.selectedRecords.length).toBe(0);

            // status check
            expect(chkAll.classList.contains('e-uncheck')).toBeTruthy();
        });


        it('checkbox selection through space key', () => {
            rows = gridObj.getRows();
            (gridObj.selectionModule as any).applySpaceSelection((rows[3].querySelector('.e-checkselect') as HTMLElement));
            expect(rows[3].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        });

        it('checkbox selection through space key for checkall', () => {
            gridObj.selectionModule.clearSelection();
            (gridObj.selectionModule as any).applySpaceSelection((gridObj.element.querySelector('.e-checkselectall') as HTMLElement));
            expect(chkAll.classList.contains('e-stop')).toBeFalsy();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });


    describe('grid checkbox selection functionaly with datasource field', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let chkAll: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeSelectData.map(data => data),
                    columns: [
                        { type: 'checkbox', field: 'IsAutoSelect' },
                        { field: 'EmployeeID', isPrimaryKey: true, headerText: 'Employee ID', textAlign: 'Right', width: 135, },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                    ],
                    allowSelection: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    pageSettings: { pageSize: 5 },
                    allowPaging: true,
                    selectionSettings: { persistSelection: true }
                }, done);
        });

        it('dataBound', (done: Function) => {
            setTimeout(
                () => {
                    done();
                },
                2500);
        });

        it('initial selection check', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        });

        it('goto page 2', (done: Function) => {
            let dataBound = (args: Object): void => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.goToPage(2);
        });

        it('initial selection check', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
        });

        it('goto page 1', (done: Function) => {
            let dataBound = (args: Object): void => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.goToPage(1);
        });

        it('initial selection check after paging', () => {
            rows = gridObj.getRows();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        });

        it('click row for selection', () => {
            gridObj.clearSelection();
            chkAll = gridObj.element.querySelector('.e-checkselectall').nextElementSibling as HTMLElement;
            (rows[0].querySelector('.e-rowcell') as HTMLElement).click();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();

            expect(rows[0].querySelectorAll('.e-check').length).toBe(1);

            expect(chkAll.classList.contains('e-stop')).toBeTruthy();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('grid checkbox selection functionaly with datasource field and persist false', () => {
        let gridObj: Grid;
        let selectionModule: Selection;
        let rows: Element[];
        let chkAll: HTMLElement;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeSelectData.map(data => data),
                    columns: [
                        { type: 'checkbox', field: 'IsAutoSelect' },
                        { field: 'EmployeeID', isPrimaryKey: true, headerText: 'Employee ID', textAlign: 'Right', width: 135, },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                    ],
                    allowSelection: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    pageSettings: { pageSize: 5 },
                    allowPaging: true,
                    selectionSettings: { persistSelection: false }
                }, done);
        });

        it('dataBound', (done: Function) => {
            setTimeout(
                () => {
                    done();
                },
                2500);
        });

        it('initial selection check', () => {
            selectionModule = gridObj.selectionModule;
            rows = gridObj.getRows();
            expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[1].firstElementChild.classList.contains('e-selectionbackground')).toBeTruthy();
            expect(rows[2].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Grid clipboard box copy for cell selection => ', () => {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let selectionModule: Selection;
        let gridBeforeCopy: (e: BeforeCopyEventArgs) => void;
        let rows: Element[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 135, },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                    ],
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    beforeCopy: gridBeforeCopy
                }, done);
        });

        it('checkBoxSelection method testing with row selection', () => {
            let obj: { status: boolean, rowIndexes?: number[], colIndexes?: number[] } = (gridObj.clipboardModule as any).checkBoxSelection();
            expect(obj.status).toBeFalsy();
        });

        it('checkBoxSelection method testing for false', () => {
            gridObj.selectionSettings.mode = 'Cell';
            gridObj.dataBind();
            gridObj.selectionModule.addCellsToSelection([{ rowIndex: 1, cellIndex: 1 }, { rowIndex: 0, cellIndex: 0 }])
            let obj: { status: boolean, rowIndexes?: number[] } = (gridObj.clipboardModule as any).checkBoxSelection();
            expect(obj.status).toBeFalsy();
            expect(obj.rowIndexes).toBeUndefined();
        });

        it('checkBoxSelection method testing for true', () => {
            gridObj.selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 1 }, { rowIndex: 1, cellIndex: 0 }])
            let obj: { status: boolean, rowIndexes?: number[], colIndexes?: number[] } = (gridObj.clipboardModule as any).checkBoxSelection();
            expect(obj.status).toBeTruthy();
            expect(JSON.stringify(obj.rowIndexes)).toBe(JSON.stringify([0, 1]));
            expect(JSON.stringify(obj.colIndexes)).toBe(JSON.stringify([0, 1]));
        });

        it('checkBoxSelection method testing for deselection', () => {
        gridObj.selectionModule.addCellsToSelection([{ rowIndex: 0, cellIndex: 0 }, { rowIndex: 0, cellIndex: 1 }])
        gridObj.selectionModule.addCellsToSelection([{ rowIndex: 2, cellIndex: 0 }, { rowIndex: 2, cellIndex: 1 }])
        let obj: { status: boolean, rowIndexes?: number[] } = (gridObj.clipboardModule as any).checkBoxSelection();
        expect(obj.status).toBeTruthy();
        expect(JSON.stringify(obj.rowIndexes)).toBe(JSON.stringify([1,2]));
        });

        it('Check clipboard data', () => {
            gridObj.copy(false);
            expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
                === "2	Andrew\n3	Janet").toBeTruthy();
        });

        it('Check clipboard data with header', () => {
            gridObj.copy(true);
            expect((document.querySelector('.e-clipboard') as HTMLInputElement).value
                === "Employee ID	Name\n2	Andrew\n3	Janet").toBeTruthy();
        });

        afterAll(() => {
            destroy(gridObj);
        });

    });
});