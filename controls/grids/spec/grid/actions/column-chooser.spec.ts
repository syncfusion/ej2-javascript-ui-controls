/**
 * Grid Column chooser spec document
 */
import { Grid } from '../../../src/grid/base/grid';
import { Page } from '../../../src/grid/actions/page';
import { Button } from '@syncfusion/ej2-buttons';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { data, employeeData } from '../base/datasource.spec';
import { Freeze } from '../../../src/grid/actions/freeze';
import { EJ2Intance } from '../../../src/grid/base/interface';
import { ColumnChooser } from '../../../src/grid/actions/column-chooser';
import { createGrid, destroy } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { removeClass, isNullOrUndefined } from '@syncfusion/ej2-base';
import * as events from '../../../src/grid/base/constant';
import { Edit } from '../../../src/grid/actions/edit';


Grid.Inject(Page, Toolbar, ColumnChooser, Freeze, DetailRow, Edit);
describe('Column chooser module', () => {
    describe('Column chooser testing', () => {
        let gridObj: Grid;
        let beforeOpenColumnChooser: () => void;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', showInColumnChooser: false }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowPaging: true,
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser'],
                    pageSettings: { pageSize: 5 },
                    beforeOpenColumnChooser: beforeOpenColumnChooser,
                }, done);
        });

        it('Column chooser testing', (done: Function) => {
            beforeOpenColumnChooser = (args?: { element: Element }): void => {
                expect(args.element.querySelectorAll('.e-columnchooser-btn').length).toBe(1);
                done();
            };
            beforeOpenColumnChooser = (args?: { element: Element }): void => {
                expect(args.element.querySelectorAll('.e-ccdlg').length).toBe(1);
                done();
            };
            gridObj.beforeOpenColumnChooser = beforeOpenColumnChooser;

            gridObj.element.classList.add('e-device');
            setTimeout(() => {
                (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_columnchooser')).click();
                (<any>gridObj).isDestroyed = true;
                (<any>gridObj).columnChooserModule.addEventListener();
                (<any>gridObj).columnChooserModule.destroy();
                (<any>gridObj).isDestroyed = false;
                (<any>gridObj).columnChooserModule.removeEventListener();
                (<any>gridObj).destroy();
            }, 500);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = beforeOpenColumnChooser = null;
        });
    });

    describe('Column chooser event testing', () => {
        let gridObj: Grid;
        let beforeOpenColumnChooser: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', showInColumnChooser: false }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowPaging: true,
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser'],
                    pageSettings: { pageSize: 5 },
                    beforeOpenColumnChooser: beforeOpenColumnChooser,
                }, done);
        });
        it('Column chooser render testing', (done: Function) => {
            beforeOpenColumnChooser = (args?: any): void => {
                expect(args.requestType).toBe('beforeOpenColumnChooser');
                expect(args.columns.length).toBe(4);
                done();
            };

            gridObj.beforeOpenColumnChooser = beforeOpenColumnChooser;
            setTimeout(() => {
                (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_columnchooser')).click();
                (<any>gridObj).columnChooserModule.isDlgOpen = true;
                (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_columnchooser')).click();
                (<any>gridObj).columnChooserModule.destroy();
                (<any>gridObj).destroy();
            }, 500);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = beforeOpenColumnChooser = null;
        });
    });

    describe('Column chooser Custom testing', () => {
        let gridObj: Grid;
        let beforeOpenColumnChooser: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', showInColumnChooser: false }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowPaging: true,
                    showColumnChooser: true,
                    pageSettings: { pageSize: 5 },
                    beforeOpenColumnChooser: beforeOpenColumnChooser,
                }, done);
        });
        it('Column chooser open  testing', (done: Function) => {
            beforeOpenColumnChooser = (args?: any): void => {
                expect(args.requestType).toBe('beforeOpenColumnChooser');
                expect(args.columns.length).toBe(4);
                done();
            };

            gridObj.beforeOpenColumnChooser = beforeOpenColumnChooser;

            setTimeout(() => {
                gridObj.columnChooserModule.openColumnChooser();
                (<HTMLElement>gridObj.element.querySelectorAll('.e-rowcell')[0]).click();
                (<any>gridObj).columnChooserModule.destroy();
                (<any>gridObj).destroy();
                done();
            }, 1000);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = beforeOpenColumnChooser = null;
        });
    });

    describe('column chooser search', () => {
        let gridObj: Grid;
        let beforeOpenColumnChooser: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', showInColumnChooser: false }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowPaging: true,
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser'],
                    pageSettings: { pageSize: 5 },
                    beforeOpenColumnChooser: beforeOpenColumnChooser,
                }, done);
        });
        it('coverage', (done: Function) => {
            setTimeout(() => {
                gridObj.columnChooserModule.openColumnChooser();
                (gridObj.columnChooserModule as any).columnChooserSearch('e');
                (<HTMLElement>gridObj.element.querySelector('.e-cc-cancel')).click();
                (<HTMLElement>gridObj.element.querySelector('.e-cc_okbtn')).click();
                gridObj.columnChooserModule.openColumnChooser();
                (gridObj.columnChooserModule as any).columnChooserSearch('ghgh');
                (<HTMLElement>gridObj.element.querySelector('.e-cc-cnbtn')).click();
                gridObj.columnChooserModule.openColumnChooser();
                (gridObj.columnChooserModule as any).columnChooserSearch('');
                (<HTMLElement>gridObj.element.querySelector('.e-cc_okbtn')).click();
                (<any>gridObj).columnChooserModule.destroy();
                (<any>gridObj).destroy();
                done();
            }, 500);

        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = beforeOpenColumnChooser = null;
        });

    });

    describe('column chooser manual search', () => {
        let gridObj: Grid;
        let beforeOpenColumnChooser: () => void;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', showInColumnChooser: false }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight', visible: false },
                    { field: 'ShipCity' }],
                    allowPaging: true,
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser'],
                    pageSettings: { pageSize: 5 },
                    beforeOpenColumnChooser: beforeOpenColumnChooser,
                }, done);
        });
        it('column chooser manual search', (done: Function) => {
            setTimeout(() => {
                gridObj.columnChooserModule.openColumnChooser();
                let value: any;
                let target: Object;
                let keycode: number = 13;
                let e: Object;
                e = { target: { value: 'ddc' } };
                (gridObj.columnChooserModule as any).columnChooserManualSearch(e);
                (<HTMLElement>gridObj.element.querySelector('.e-cc_okbtn')).click();
                e = { target: { value: 'ddc' }, keycode: 13 };
                (gridObj.columnChooserModule as any).columnChooserManualSearch(e);
                gridObj.columnChooserModule.openColumnChooser(100, 100);
                (<any>gridObj).columnChooserModule.confirmDlgBtnClick();
                (gridObj.columnChooserModule as any).columnChooserManualSearch(e);
                let searchElement = gridObj.element.querySelector('.e-ccsearch');
                // (<any>gridObj).columnChooserModule.columnChooserSearch('e');
                // (<any>gridObj).columnChooserModule.startTime({keycode: 13});
                (<any>gridObj).columnChooserModule.destroy();
                (<any>gridObj).destroy();
                done();
            }, 500);

        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = beforeOpenColumnChooser = null;
        });

    });

    describe('column chooser single field search', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowPaging: true,
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser'],
                }, done);
        });
        it('column chooser single field search', (done: Function) => {
            setTimeout(() => {
                gridObj.columnChooserModule.openColumnChooser();
                let value: any;
                let target: Object;
                let keycode: number = 13;
                let e: Object;
                e = { target: { value: 'f' } };
                (gridObj.columnChooserModule as any).columnChooserManualSearch(e);
                expect(gridObj.element.querySelector('.e-cc_okbtn').hasAttribute('disabled')).toBeFalsy();
                gridObj.element.querySelector('.e-check').classList.add('e-uncheck');
                gridObj.element.querySelector('.e-check').classList.remove('e-check');
                expect(gridObj.element.querySelector('.e-cc_okbtn').hasAttribute('disabled')).toBeFalsy();
                (<HTMLElement>gridObj.element.querySelector('.e-cc-cancel')).click();
                (<any>gridObj).columnChooserModule.destroy();
                (<any>gridObj).destroy();
                done();
            }, 500);

        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });

    });

    describe('column chooser checkstate', () => {
        let gridObj: Grid;
        let beforeOpenColumnChooser: () => void;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID', visible: false },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity', showInColumnChooser: false }],
                    allowPaging: true,
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser'],
                    pageSettings: { pageSize: 5 },
                    beforeOpenColumnChooser: beforeOpenColumnChooser,
                }, done);
        });
        it('change checkstate', (done: Function) => {
            setTimeout(() => {
                gridObj.columnChooserModule.openColumnChooser();
                expect(gridObj.element.querySelectorAll('.e-selectall.e-stop').length).toBe(1);
                let cheEle: any = gridObj.element.querySelectorAll('.e-cc-chbox')[0];
                let cheEle1: any = gridObj.element.querySelectorAll('.e-cc-chbox')[1];
                cheEle.click();
                cheEle1.click();
                (<HTMLElement>gridObj.element.querySelector('.e-cc_okbtn')).click();
                gridObj.columnChooserModule.openColumnChooser();
                gridObj.columnChooserModule.openColumnChooser();
                done();
            }, 500);

        });
        it('change checkstate on focus out', (done: Function) => {
            gridObj.columnChooserModule.openColumnChooser();
            let cheEle: any = gridObj.element.querySelectorAll('.e-cc-chbox')[0];
            let cheEle1: any = gridObj.element.querySelectorAll('.e-cc-chbox')[1];
            let checkbox1state = cheEle.checked;
            let checkbox2state = cheEle1.checked;
            cheEle.click();
            cheEle1.click();
            (<HTMLElement>gridObj.element).click();
            gridObj.columnChooserModule.openColumnChooser();
            gridObj.columnChooserModule.openColumnChooser();
            cheEle = gridObj.element.querySelectorAll('.e-cc-chbox')[0];
            cheEle1 = gridObj.element.querySelectorAll('.e-cc-chbox')[1];
            expect(cheEle.checked).toBe(checkbox1state);
            expect(cheEle1.checked).toBe(checkbox2state);
            done();
        });

        afterAll(() => {
            (<any>gridObj).columnChooserModule.destroy();
            destroy(gridObj);
            gridObj = beforeOpenColumnChooser = null;
        });

    });

    describe('column chooser checkstate with Freeze pane', () => {
        let gridObj: Grid;
        let beforeOpenColumnChooser: () => void;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    frozenColumns: 2,
                    frozenRows: 2,
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID', visible: false },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity', showInColumnChooser: false }],
                    allowPaging: true,
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser'],
                    pageSettings: { pageSize: 5 },
                    beforeOpenColumnChooser: beforeOpenColumnChooser,
                }, done);
        });
        it('change checkstate with Freeze pane', (done: Function) => {
            setTimeout(() => {
                gridObj.columnChooserModule.openColumnChooser();
                let cheEle: any = gridObj.element.querySelectorAll('.e-cc-chbox')[0];
                let cheEle1: any = gridObj.element.querySelectorAll('.e-cc-chbox')[1];
                cheEle.click();
                cheEle1.click();
                (<HTMLElement>gridObj.element.querySelector('.e-cc_okbtn')).click();
                gridObj.columnChooserModule.openColumnChooser();
                gridObj.columnChooserModule.openColumnChooser();
                (<any>gridObj).columnChooserModule.destroy();
                (<any>gridObj).destroy();
                done();
            }, 500);

        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = beforeOpenColumnChooser = null;
        });
    });

    describe('Column chooser rtl testing', () => {
        let gridObj: Grid;
        let beforeOpenColumnChooser: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', showInColumnChooser: false }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity', visible: false }],
                    allowPaging: true,
                    toolbar: ['ColumnChooser'],
                    showColumnChooser: true,
                    pageSettings: { pageSize: 5 },
                    enableRtl: true,
                    beforeOpenColumnChooser: beforeOpenColumnChooser,
                }, done);
        });
        it('rtl', (done: Function) => {
            let x: number = 100;
            let y: number = 100;
            let target: HTMLElement;
            let e: Object;
            gridObj.element.classList.add('e-bigger');
            setTimeout(() => {
                (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_columnchooser')).click();
                (<any>gridObj).columnChooserModule.openColumnChooser(x, y);
                (<any>gridObj).columnChooserModule.openColumnChooser();
                let sel: HTMLElement = (<any>gridObj).element.querySelector('.e-columnchooser-btn');
                e = { target: sel };
                (<any>gridObj).initialOpenDlg = false;
                (<any>gridObj).isDlgOpen = true;
                (<any>gridObj).columnChooserModule.clickHandler(e);
                (<any>gridObj).columnChooserModule.clickHandler(e);
                (<any>gridObj).columnChooserModule.openColumnChooser();
                let ele: HTMLElement = (<any>gridObj).element.querySelectorAll('.e-cc-chbox')[0];
                e = { event: { target: ele }, value: true };
                (<any>gridObj).columnChooserModule.checkstatecolumn(e);
                let ele1: HTMLElement = (<any>gridObj).element.querySelectorAll('.e-cc-chbox')[3];
                e = { event: { target: ele1 }, value: true };
                (<any>gridObj).columnChooserModule.checkstatecolumn(e);
                ele.click();
                e = { event: { target: ele }, value: false };
                (<any>gridObj).columnChooserModule.checkstatecolumn(e);
                ele1.click();
                e = { event: { target: ele }, value: false };
                (<any>gridObj).columnChooserModule.checkstatecolumn(e);

                (<any>gridObj).columnChooserModule.destroy();
                (<any>gridObj).destroy();
                done();
            }, 1000);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = beforeOpenColumnChooser = null;
        });
    });
    describe('Colum chooser enable throw set model => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    showColumnChooser: false,
                    toolbar: ['ColumnChooser'],
                    pageSettings: { pageSize: 5 },
                }, done);
        });
        it('Colum chooser enable throw set model', () => {
            gridObj.showColumnChooser = true;
            gridObj.dataBind();
            gridObj.columnChooserModule.openColumnChooser();
            expect(gridObj.element.querySelectorAll('.e-ccdlg').length).toBe(1);
        });

        it('EJ2-7683==>enabling rtl', () => {
            gridObj.enableRtl = true;
            gridObj.dataBind();
        });

        it('EJ2-7683==>checking whether rtl is enabled', () => {
            let columnChooser: any = (<any>gridObj.element.querySelector('.e-ccdlg'));
            expect(columnChooser.querySelectorAll('.e-rtl').length).toBeGreaterThan(5);
            gridObj.enableRtl = false;
            gridObj.dataBind();
        });

        it('EJ2-7683==>checking whether rtl is disabled', () => {
            let columnChooser: any = (<any>gridObj.element.querySelector('.e-ccdlg'));
            expect(columnChooser.querySelectorAll('.e-rtl').length).toBe(0);
            gridObj.columnChooserModule.openColumnChooser();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('Column Chooser ok button disabled =>', function () {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowPaging: true,
                showColumnChooser: true,
                toolbar: ['ColumnChooser'],
                actionComplete: actionComplete,
                pageSettings: { pageSizes: true, pageSize: 5 },
                columns: [{ field: 'OrderID', type: 'number', isPrimaryKey: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                ],
            }, done);
        });

        it('button disabled', (done: Function) => {           
            setTimeout(() => {
                gridObj.columnChooserModule.openColumnChooser();
                let cheEle: any = gridObj.element.querySelectorAll('.e-cc-chbox')[1];
                let cheEle1: any = gridObj.element.querySelectorAll('.e-cc-chbox')[2];
                let cheEle2: any = gridObj.element.querySelectorAll('.e-cc-chbox')[3];
                cheEle.click();
                cheEle1.click();
                cheEle2.click();
                done();
            }, 500);
        });

        it('check button disabled case', () => {
            let btn: Button = (gridObj.element.querySelector('.e-footer-content').querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
            expect(btn.disabled).toBe(true);
            (<any>gridObj).columnChooserModule.destroy();          
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('Open multiple column chooser in hierarchyGrid', () => {
        let gridObj: Grid;
        let beforeOpenColumnChooser: () => void;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    columns: [{ field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                    { field: 'FirstName', headerText: 'Name', width: 125 },
                    { field: 'Title', headerText: 'Title', width: 180 },
                    { field: 'City', headerText: 'City', width: 110 },
                    { field: 'Country', headerText: 'Country', width: 110 }],
                    allowPaging: true,
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser'],
                    pageSettings: { pageSize: 5 },
                    beforeOpenColumnChooser: beforeOpenColumnChooser,
                    childGrid: {
                        dataSource: [],
                        queryString: 'EmployeeID',
                        allowPaging: true,
                        toolbar: ['ColumnChooser'],
                        showColumnChooser: true,
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                            { field: 'ShipCity', headerText: 'Ship City', width: 120 },
                            { field: 'Freight', headerText: 'Freight', width: 120 },
                            { field: 'ShipName', headerText: 'Ship Name', width: 150 }
                        ],
                    }
                }, done);
        });
        it('Show/hide the column chooser in parent grid', (done: Function) => {
            setTimeout(() => {
                ;
                gridObj.columnChooserModule.openColumnChooser();
                gridObj.columnChooserModule.openColumnChooser();
                done();
            }, 500);
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
            (<any>gridObj).columnChooserModule.destroy();
            destroy(gridObj);
            gridObj = beforeOpenColumnChooser = null;
        });
    });
    

    describe('Select all added in column chooser =>', function () {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowPaging: true,
                showColumnChooser: true,
                toolbar: ['ColumnChooser'],
                actionComplete: actionComplete,
                pageSettings: { pageSizes: true, pageSize: 5 },
                columns: [{ field: 'OrderID', type: 'number', isPrimaryKey: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                ],
            }, done);
        });

        it('Update select all- uncheck', function () {
            (gridObj.columnChooserModule as any).openColumnChooser();
            (gridObj.columnChooserModule as any).updateSelectAll(false);
            expect(gridObj.element.querySelectorAll('.e-uncheck.e-selectall').length).toBe(1);
            expect((gridObj.columnChooserModule as any).ulElement.querySelectorAll('.e-uncheck').length).toBe(4);
            expect((gridObj.columnChooserModule as any).ulElement.querySelectorAll('.e-check').length).toBe(0);
            (gridObj.columnChooserModule as any).updateIntermediateBtn();
            let btn: Button = (gridObj.element.querySelector('.e-footer-content').querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
            expect(btn.disabled).toBe(true);
        });
        
        it('Update select all- check', function () {
            (gridObj.columnChooserModule as any).updateSelectAll(true);
            expect(gridObj.element.querySelectorAll('.e-check.e-selectall').length).toBe(1);
            expect((gridObj.columnChooserModule as any).ulElement.querySelectorAll('.e-uncheck').length).toBe(0);
            expect((gridObj.columnChooserModule as any).ulElement.querySelectorAll('.e-check').length).toBe(4);

        });

        it('Update intermediate button', function () {
            (gridObj.columnChooserModule as any).ulElement.querySelectorAll('.e-check')[1].classList.remove('e-check');
            (gridObj.columnChooserModule as any).updateIntermediateBtn();
            expect(gridObj.element.querySelectorAll('.e-stop.e-selectall').length).toBe(1);
        });
        
        it('enter key disabled', () => {
            expect(gridObj.element.querySelector('.e-ccdlg').classList.contains('e-popup-close')).toBeTruthy();
            gridObj.columnChooserModule.openColumnChooser();
            (gridObj.element.querySelectorAll('.e-cc-chbox')[0] as any).click();
            let action: any = 'enter';
            let args: Object = action;
            (gridObj.columnChooserModule as any).confirmDlgBtnClick(args);
            expect(gridObj.element.querySelector('.e-ccdlg').classList.contains('e-popup-open')).toBeTruthy();
        });
        
        afterAll(() => {
            destroy(gridObj);
        });
    });
    
    describe('Checkbox column in column chooser =>', function () {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowPaging: true,
                showColumnChooser: true,
                toolbar: ['ColumnChooser'],
                actionComplete: actionComplete,
                pageSettings: { pageSizes: true, pageSize: 5 },
                columns: [{ type: 'checkbox', width: 40},
                    { field: 'OrderID', type: 'number', isPrimaryKey: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                ],
            }, done);
        });
        it('checkbox type check', function () {
            let colType: string = 'checkbox';
            expect(gridObj.getVisibleColumns()[0].type).toBe(colType); 
            gridObj.columnChooserModule.openColumnChooser();
            (gridObj.element.querySelectorAll('.e-cc-chbox')[0] as any).click();
            (gridObj.element.querySelectorAll('.e-cc-chbox')[2] as any).click();
            let btn: Button = (gridObj.element.querySelector('.e-footer-content').querySelector('.e-btn') as EJ2Intance).ej2_instances[0] as Button;
            btn.click();
            expect(gridObj.getVisibleColumns()[0].type).toBe(colType);
        });

        it('Column chooser open event testing', (done: Function) => {
            gridObj.columnChooserModule.openColumnChooser();
            (gridObj.element.querySelectorAll('.e-cc-chbox')[2] as any).click();
            let columnChooserOpenedHandler : any = (args: any): void => {
                let name: string = 'columnChooserOpened';
                expect(args.name).toBe(name);
                gridObj.off(events.columnChooserOpened, columnChooserOpenedHandler);  
            }
            gridObj.on(events.columnChooserOpened, columnChooserOpenedHandler);
            (gridObj.element.querySelector('.e-footer-content').querySelector('.e-btn') as EJ2Intance).ej2_instances[0].click();
            done();
        });
        
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('EJ2-36229 => column chooser ok button click check', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' },
                    { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity', showInColumnChooser: false }],
                    allowPaging: true,
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser'],
                    pageSettings: { pageSize: 5 },
                }, done);
        });
        it('check ok button click when unselect all with ShowInColumnChooser False', (done: Function) => {
            gridObj.columnChooserModule.openColumnChooser();
            let cheEle: any = gridObj.element.querySelectorAll('.e-cc-selectall .e-selectall')[0];
            cheEle.click();
            let okButton: any = gridObj.element.querySelector(".e-cc_okbtn");
            okButton.click();
            expect(gridObj.getVisibleColumns().length).toBe(1);
            done();
        });

        afterAll(() => {
            (<any>gridObj).columnChooserModule.destroy();
            destroy(gridObj);
            gridObj = null;
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
                    showColumnChooser: true,
                    toolbar: ['ColumnChooser'],
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
        it('Check form is closed after column choooser action', (done: Function) => {
            gridObj.columnChooserModule.openColumnChooser();
            let cheEle: any = gridObj.element.querySelectorAll('.e-icons.e-check')[2];
            cheEle.click();
            let okButton: any = gridObj.element.querySelector(".e-cc_okbtn");
            okButton.click();
            expect(gridObj.getVisibleColumns().length).toBe(4);
            expect(isNullOrUndefined(document.querySelector(".e-gridform"))).toBe(true);
            done();
        });

        afterAll(() => {
            (<any>gridObj).columnChooserModule.destroy();
            destroy(gridObj);
            gridObj = null;
        });

    });

    describe('EJ2-37361 => Columns does not render properly while using column chooser to select columns', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    showColumnChooser: true,
                        toolbar: ['ColumnChooser'],
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', width: 130, textAlign: 'Right' },
                            { field: 'CustomerName', headerText: 'Customer Name', width: 150, showInColumnChooser: false },
                            { field: 'OrderDate', headerText: 'Order Date', width: 130, format: 'yMd', textAlign: 'Right' },
                            { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                            { field: 'ShippedDate', headerText: 'Shipped Date', width: 140, format: 'yMd', textAlign: 'Right' },
                            { field: 'ShipCountry', visible: false, headerText: 'Ship Country', width: 150 },
                            { field: 'ShipCity', visible: false, headerText: 'Ship City', width: 150 }
                        ]
                }, done);
        });
        it('check ok button are disable', (done: Function) => {
            let columnchooser: HTMLElement = gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_columnchooser');
            columnchooser.click();
            let cheEle: any = gridObj.element.querySelectorAll('.e-cc-selectall .e-selectall')[0];
            cheEle.click();
            cheEle.click();
            columnchooser.click();
            columnchooser.click();
            expect(gridObj.element.querySelector('.e-cc_okbtn').hasAttribute('disabled')).toBeFalsy();
            done();
        });

        afterAll(() => {
            (<any>gridObj).columnChooserModule.destroy();
            destroy(gridObj);
            gridObj = null;
        });

    });

    describe('EJ2-40938 => While adding a hide custom column On editing this cell, the columns were get collapsed', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    allowRowDragAndDrop: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    gridLines: 'Both',
                    editSettings: { allowEditing: true, allowDeleting: true, allowAdding: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' },
                        { field: 'Freight', visible: false , headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'ShipCity', headerText: 'Ship City', width: 130, textAlign: 'Left' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                    ]
                }, done);
        });
        it('check the visible cells true/false', () => {
            gridObj.showColumns('Freight');
            expect(gridObj.getRowsObject()[1].cells[4].visible).toBeTruthy()
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });

    });
});
