/**
 * Grid Resize spec document
 */
import { Browser, EventHandler, EmitType } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { SortDirection } from '../../../src/grid/base/enum';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { ResizeArgs } from '../../../src/grid/base/interface';
import { Column } from '../../../src/grid/models/column';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Reorder } from '../../../src/grid/actions/reorder';
import { Resize, resizeClassList } from '../../../src/grid/actions/resize';
import { Freeze } from '../../../src/grid/actions/freeze';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { GridModel } from '../../../src/grid/base/grid-model';
import { extend } from '@syncfusion/ej2-base';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { AggregateColumn } from '../../../src/grid/models/aggregate';
import { createGrid, destroy } from '../base/specutil.spec';

Grid.Inject(Sort, Page, Filter, Reorder, Group, Resize, Selection, Aggregate, Freeze);

describe('Resize module', () => {
    describe('Resize functionalities for columns', () => {
        let gridObj: Grid;
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowReordering: true,
                    columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 }, { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 }, { field: 'Freight', headerText: 'Freight', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
                }, done);
        });
        it('Resize for particular column when width is specified', () => {
            gridObj.autoFitColumns('OrderID');
            headers = gridObj.getColumns()[0] as Column;
            expect(headers.width).not.toEqual('150px')
        });
        it('Resize OrderID except CustomerID all fields have width', () => {
            gridObj.autoFitColumns('OrderID');
            headers = (<HTMLElement>gridObj.getHeaderTable()).style.width
            expect(headers).toBeFalsy();
        });
        it('Resize CustomerID except CustomerID all fields have width', () => {
            gridObj.autoFitColumns('CustomerID');
            headers = (<HTMLElement>gridObj.getHeaderTable()).style.width
            expect(headers).toBeTruthy();
        });
        it('Auto fit with Reorder', () => {
            gridObj.reorderColumns('EmployeeID', 'Freight');
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[3].querySelector('.e-headercelldiv').textContent).toEqual('EmployeeID');
            headers = gridObj.getColumns()[3] as Column;
            expect(headers.width).toEqual(150)
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('Resize functionalities for columns', () => {
        let gridObj: Grid;
        let contentTable: any;
        let footerTable: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowResizing: true,
                    columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 }, { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 }, { field: 'Freight', headerText: 'Freight', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
         aggregates: [{
         columns: [{
             type: 'Sum',
             field: 'Freight',
             footerTemplate: 'Sum: ${Sum}'
         }]
     },
     {
         columns: [{
             type: 'Max',
             field: 'OrderID',
             footerTemplate: 'Max: ${Max}'
         }]
     }]
                }, done);
        });
        it('autofit all columns', () => {
            gridObj.autoFitColumns('');
        });
        it('autofit all columns with footer content', () => {
            contentTable = gridObj.getContentTable();
            footerTable = gridObj.getFooterContentTable();
            expect(contentTable.style.width).toEqual(footerTable.style.width)
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('Resize functionalities for all columns', () => {
        let gridObj: Grid;
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 }, { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID' }, { field: 'Freight', headerText: 'Freight', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity' }],
                }, done);
        });
        it('More than one columns to be Autofit', () => {
            gridObj.autoFitColumns(['OrderID', 'CustomerID', 'EmployeeID']);
            headers = gridObj.getColumns()[0] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[1] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[2] as Column;
            expect(headers.width).toBeTruthy();
            headers = (<HTMLElement>gridObj.getHeaderTable()).style.width
            expect(headers).toBeFalsy();
        });
        it('Resize all columns', () => {
            gridObj.autoFitColumns('');
            headers = gridObj.getColumns()[0] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[1] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[2] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[3] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[4] as Column;
            expect(headers.width).toBeTruthy();
            headers = (<HTMLElement>gridObj.getHeaderTable()).style.width
            expect(headers).toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('Resize functionalities for Hidden columns', () => {
        let gridObj: Grid;
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowReordering: true,
                    allowGrouping: true,
                    columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 }, { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', }, { field: 'Freight', headerText: 'Freight', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity', width: 180, visible: false }],
                }, done);
        });
        it('Resize for Hidden column', () => {
            gridObj.autoFitColumns('ShipCity');
            headers = (<HTMLElement>gridObj.getHeaderTable().querySelectorAll('th')[4]).style.width;
            expect(headers).toBeFalsy();
        });
        it('grouping with resize all column ', () => {
            gridObj.groupModule.groupColumn('EmployeeID');
            gridObj.autoFitColumns('');
            headers = (<HTMLElement>gridObj.getHeaderTable()).style.width;
            expect(headers).toBeFalsy();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('allowResizing functionality', () => {
        let gridObj: any;
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowResizing: true,
                    gridLines: 'Horizontal',
                    columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150, minWidth: 100, maxWidth: 200 },
                    { field: 'Freight', headerText: 'Freight', format: 'C2', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
                }, done);
        });
        // it('autoFit from hander', () => {
        //     let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
        //     let column: Column = gridObj.resizeModule.getTargetColumn({ target: handler });
        //     expect(column.field).toEqual('CustomerID');
        //     let width: string = (gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth;
        //     gridObj.resizeModule.callAutoFit({ target: handler });
        //     expect(parseInt((gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth)).toBeLessThan(parseInt(width));
        // });
        it('resize start', () => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            gridObj.resizeModule.resizeStart({ target: handler });

            expect(handler.classList.contains(resizeClassList.icon)).toBeFalsy();
            let head = gridObj.getHeaderTable();
            [].slice.call(head.querySelectorAll('th')).forEach((ele: HTMLElement) => {
                //expect(ele.classList.contains(resizeClassList.cursor)).toBeTruthy();
            });
            //expect(gridObj.element.classList.contains(resizeClassList.cursor)).toBeTruthy();
            //expect(gridObj.element.querySelector('.'+ resizeClassList.helper)).toBeTruthy();

        });
        it('resize end', () => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            gridObj.resizeModule.resizeEnd({ target: handler });
            expect(handler.classList.contains(resizeClassList.icon)).toBeFalsy();
            let head = gridObj.getHeaderTable();
            [].slice.call(head.querySelectorAll('th')).forEach((ele: HTMLElement) => {
                expect(ele.classList.contains(resizeClassList.cursor)).toBeFalsy();
            });
            expect(gridObj.element.classList.contains(resizeClassList.cursor)).toBeFalsy();
            expect(gridObj.resizeModule.pageX).toBeNull();
            expect(gridObj.resizeModule.element).toBeNull();
            expect(gridObj.resizeModule.column).toBeNull();
            expect(gridObj.resizeModule.helper).toBeNull();
            expect(gridObj.element.querySelector('.' + resizeClassList.helper)).toBeFalsy();
        });

        it('resizing width restriction', () => {
            let column = { field: 'CustomerID', width: 100, minWidth: 50, maxWidth: 200 };
            expect(gridObj.resizeModule.widthService.getWidth(column)).toBe(100);
            column = { field: 'CustomerID', width: 300, minWidth: 50, maxWidth: 200 };
            expect(gridObj.resizeModule.widthService.getWidth(column)).toBe(200);
            column = { field: 'CustomerID', width: 10, minWidth: 50, maxWidth: 200 };
            expect(gridObj.resizeModule.widthService.getWidth(column)).toBe(50);
        });

        it('resizing - mousemove', () => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            gridObj.resizeModule.resizeStart({ target: handler, pageX: 0 });
            gridObj.resizeModule.resizing({ target: handler, pageX: 200 });
            let width = (gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth;
            gridObj.resizeModule.resizing({ target: handler, pageX: 300 });
            width += 100;
            expect(width).toEqual((gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth);
            gridObj.resizeModule.resizing({ target: handler, pageX: 100 });
            width -= 200;
            expect(width).toEqual((gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth);
        });

        it('resizing - mousemove - rtl', () => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            gridObj.enableRtl = true;
            gridObj.dataBind();
            gridObj.resizeModule.resizeStart({ target: handler, pageX: 0 });
            gridObj.resizeModule.resizing({ target: handler, pageX: 200 });
            let width = (gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth;
            gridObj.resizeModule.resizing({ target: handler, pageX: 300 });
            width -= 100;
            //expect(width).toEqual((gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth);
            gridObj.resizeModule.resizing({ target: handler, pageX: 100 });
            width += 200;
            //expect(width).toEqual((gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth);
            <HTMLElement>gridObj.resizeModule.appendHelper();
        });
        it('min move', () => {
            gridObj.enableRtl = false;
            gridObj.dataBind();
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[2];
            gridObj.resizeModule.helper = null;
            gridObj.resizeModule.resizeStart({ target: handler, pageX: 0 });
            gridObj.resizeModule.resizing({ target: handler, pageX: 200 });
            gridObj.enableRtl = true;
            gridObj.dataBind();
            gridObj.resizeModule.helper = null;
            gridObj.resizeModule.resizeStart({ target: handler, pageX: 0 });
            gridObj.resizeModule.resizing({ target: handler, pageX: 200 });
        });
        it('resizing - destroy', () => {
            gridObj.resizeModule.render();
            gridObj.resizeModule.destroy();
            expect(gridObj.resizeModule.widthService).toBeNull();
        });

        it('check width', () => {
            let width: string = gridObj.widthService.getTableWidth(gridObj.getColumns()) + 'px';
            expect((gridObj.getHeaderTable() as HTMLElement).style.width).toBe(width);
            expect((gridObj.getContentTable() as HTMLElement).style.width).toBe(width);
        });
        it('grid lines', () => {
            expect(gridObj.element.classList.contains('e-resize-lines')).toBeTruthy();
        });
        it('calc position', () => {
            let off = gridObj.resizeModule.calcPos(document.body);
            expect(document.body.getBoundingClientRect().left).toBe(off.left);
        });
        it('getWidth method', () => {
            let off = gridObj.resizeModule.getWidth(100, 200, 300);
            expect(200).toBe(off);
            off = gridObj.resizeModule.getWidth(200, 100, 300);
            expect(200).toBe(off);
            off = gridObj.resizeModule.getWidth(400, 100, 300);
            expect(300).toBe(off);
        });
        it('refreshColumnWidth method', () => {
            let columns: Column[] = gridObj.getColumns();
            for (let ele of [].slice.apply(gridObj.getHeaderTable().querySelectorAll('th.e-headercell'))) {
                for (let column of columns) {
                    if (ele.querySelector('[e-mappinguid]') &&
                        ele.querySelector('[e-mappinguid]').getAttribute('e-mappinguid') === column.uid && column.visible) {
                        expect(column.width === ele.getBoundingClientRect().width);
                        break;
                    }
                }
            }
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Events', () => {
        let resizeStartevent: EmitType<ResizeArgs> = jasmine.createSpy('resizeStartevent');
        let resizeStop: EmitType<ResizeArgs> = jasmine.createSpy('resizeStartStop');
        let resize: EmitType<ResizeArgs> = jasmine.createSpy('resize');
        let gridObj: any;
        let columns: Column[];
        beforeAll((done) => {
            jasmine.Ajax.install();
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowResizing: true,
                    columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 },
                    { field: 'Freight', headerText: 'Freight', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
                    resizeStart: resizeStartevent,
                    resizeStop: resizeStop,
                    resizing: resize
                }, done);
        });
        beforeEach((done: Function) => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            gridObj.resizeModule.resizeStart({ target: handler });
            gridObj.resizeModule.resizing({ target: handler, pageX: 200 });
            gridObj.resizeModule.resizeEnd({ target: handler });
            setTimeout(() => {
                done();
            }, 100);
        });
        it('events', () => {
            // expect(resizeStartevent).toHaveBeenCalled();
            // expect(resizeStop).toHaveBeenCalled();
            // expect(resize).toHaveBeenCalled();
        });
        afterAll(() => {
            jasmine.Ajax.uninstall();
            destroy(gridObj);
        });
    });

    describe('resize start event', () => {

        let gridObj: any;
        let columns: Column[];
        beforeAll((done) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowResizing: true,
                    columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 },
                    { field: 'Freight', headerText: 'Freight', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
                    resizeStart: function (e: any) {
                        e.cancel = true;
                    },

                }, done);
        });

        beforeEach((done: Function) => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            gridObj.resizeModule.resizeStart({ target: handler });
            setTimeout(() => {
                done();
            }, 100);
        });

        it('cancel', () => {
            //expect(gridObj.resizeModule.helper).toBeNull();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
    describe('resize event', () => {

        let gridObj: any;
        let columns: Column[];
        beforeAll((done) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowResizing: true,
                    columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 },
                    { field: 'Freight', headerText: 'Freight', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
                    width: 200,
                    resizing: function (e: any) {
                        e.cancel = true;
                    },

                }, done);
        });
        beforeEach((done: Function) => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            gridObj.resizeModule.resizeStart({ target: handler });
            gridObj.resizeModule.resizing({ target: handler, pageX: 200 });
            setTimeout(() => {
                done();
            }, 100);
        });

        it('cancel', () => {
            //expect(gridObj.resizeModule.helper).toBeNull();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('Resize in mobile layout', () => {
        let gridObj: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            let iphoneUa: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6' +
                ' (KHTML, like Gecko) Version/10.0 Mobile/14D27 Safari/602.1';
            Browser.userAgent = iphoneUa;
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowResizing: true,
                    columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 },
                    { field: 'Freight', headerText: 'Freight', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
                }, done);
        });

        afterAll(() => {
            destroy(gridObj);
            let desktop: string = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
            Browser.userAgent = desktop;
        });

        it('resize start', () => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            let args = { target: handler, touches: [{ pageX: 200 }] };
            gridObj.resizeModule.resizeStart(args);
            let x: number = gridObj.resizeModule.getPointX(args);
            expect(x).toBe(200);
            //expect(gridObj.element.querySelector('.'+ resizeClassList.helper).classList.contains(resizeClassList.icon)).toBeTruthy();
        });

        it('resize stop', (done) => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            let args = { target: handler, touches: [{ pageX: 200 }] };
            let twidth = gridObj.getHeaderTable().offsetWidth;

            gridObj.resizeModule.resizeEnd(args);
            setTimeout(function () {
                gridObj.resizeModule.tapped = true;
                gridObj.resizeModule.resizeStart(args);
                gridObj.resizeModule.pageX = 100;
                gridObj.resizeModule.resizing(args);
                gridObj.resizeModule.resizeEnd(args);
                expect(twidth).not.toBe(gridObj.getHeaderTable().offsetWidth);
                done();
            }, 300);
        })

        it('remove helper', () => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            gridObj.resizeModule.resizeStart({ target: handler });
            gridObj.resizeModule.removeHelper({ target: document.body });
            //expect(gridObj.element.querySelector('.'+ resizeClassList.helper)).toBeFalsy();
            expect(gridObj.resizeModule.pageX).toBeNull();
            expect(gridObj.resizeModule.element).toBeNull();
            expect(gridObj.resizeModule.column).toBeNull();
            expect(gridObj.resizeModule.helper).toBeNull();
        });
        it('cancel Resize action', () => {
            let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            gridObj.resizeModule.resizeStart({ target: handler });
            gridObj.resizeModule.cancelResizeAction();
            expect(gridObj.resizeModule.helper).toBeNull();
        });
    });
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
        let gridDiv = createElement('div', { id: 'Grid' });
        document.body.appendChild(gridDiv)
        grid.appendTo(gridDiv);
        return grid;
    };

    let destroy: EmitType<Object> = (grid: Grid) => {
        if (grid) {
            grid.destroy();
            document.getElementById('Grid').remove();
        }
    };

    describe('Resize with footer table', () => {
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
                    allowResizing: true,
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
                            footerTemplate: '${max}'
                        }]
                    }]
                },
                done
            );
        });
        it('width test case', () => {
            expect(grid.element.classList.contains('e-resize-lines')).toBe(true);
            expect(grid.getFooterContent()).not.toBeNull();
            expect(grid.getFooterContentTable()).not.toBeNull();
            expect((grid.getFooterContentTable() as HTMLElement).style.width).toBeDefined();
            let handler: HTMLElement = <HTMLElement>grid.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
            (grid.resizeModule as any).resizeStart({ target: handler, pageX: 0 });
            (grid.resizeModule as any).resizing({ target: handler, pageX: 200 });
            expect((grid.getFooterContentTable() as HTMLElement).style.width).toBeDefined();
        });

        it('allowResizing - dynamic -testing', () => {
            grid.allowResizing = false;
            grid.dataBind();
            expect(grid.element.classList.contains('e-resize-lines')).toBe(false);
            grid.allowResizing = true;
            grid.dataBind();
            expect(grid.element.classList.contains('e-resize-lines')).toBe(true);
        });

        afterAll(() => {
            destroy(grid);
        });
    });

   describe('Resize module with Freeze pane', () => {
        describe('Resize functionalities for columns', () => {
            let gridObj: Grid;
            let headers: any;
            let columns: Column[];
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        frozenColumns: 2,
                        frozenRows: 2,
                        dataSource: data,
                        allowReordering: true,
                        allowResizing: true,
                        height: 300,
                        width: 700,
                        columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 }, { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 }, { field: 'Freight', headerText: 'Freight', width: 200 },
                        { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
                    }, done);
            });
            it('Resize for particular column when width is specified', () => {
                gridObj.autoFitColumns('OrderID');
                headers = gridObj.getColumns()[0] as Column;
                expect(headers.width).not.toEqual('150px')
            });
            it('Resize OrderID except CustomerID all fields have width', () => {
                gridObj.autoFitColumns('OrderID');
                headers = (<HTMLElement>gridObj.getHeaderTable()).style.width
                expect(headers).toBeTruthy();
            });
            it('Resize CustomerID except CustomerID all fields have width', () => {
                gridObj.autoFitColumns('CustomerID');
                headers = (<HTMLElement>gridObj.getHeaderTable()).style.width
                expect(headers).toBeTruthy();
            });           
            afterAll(() => {
                destroy(gridObj);
            });
        });
        describe('allowResizing functionality', () => {
            let gridObj: any;
            let headers: any;
            let columns: Column[];
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        frozenColumns: 2,
                        frozenRows: 2,
                        dataSource: data,
                        allowResizing: true,
                        height: 300,
                        width: 700,
                        gridLines: 'Horizontal',
                        columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'EmployeeID', width: 150, minWidth: 100, maxWidth: 200 },
                        { field: 'Freight', headerText: 'Freight', format: 'C2', width: 200 },
                        { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
                    }, done);
            });
            it('autoFit from hander', () => {
                let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
                let column: Column = gridObj.resizeModule.getTargetColumn({ target: handler });
                expect(column.field).toEqual('CustomerID');
                let width: string = (gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth;
                gridObj.resizeModule.callAutoFit({ target: handler });
                expect(parseInt((gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth)).toBeLessThan(parseInt(width));
            });
            it('resize start', () => {
                let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
                gridObj.resizeModule.resizeStart({ target: handler });

                expect(handler.classList.contains(resizeClassList.icon)).toBeFalsy();
                let head = gridObj.getHeaderTable();
                [].slice.call(head.querySelectorAll('th')).forEach((ele: HTMLElement) => {
                    //expect(ele.classList.contains(resizeClassList.cursor)).toBeTruthy();
                });
                //expect(gridObj.element.classList.contains(resizeClassList.cursor)).toBeTruthy();
                //expect(gridObj.element.querySelector('.'+ resizeClassList.helper)).toBeTruthy();

            });
            it('resize end', () => {
                let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
                gridObj.resizeModule.resizeEnd({ target: handler });
                expect(handler.classList.contains(resizeClassList.icon)).toBeFalsy();
                let head = gridObj.getHeaderTable();
                [].slice.call(head.querySelectorAll('th')).forEach((ele: HTMLElement) => {
                    expect(ele.classList.contains(resizeClassList.cursor)).toBeFalsy();
                });
                expect(gridObj.element.classList.contains(resizeClassList.cursor)).toBeFalsy();
                expect(gridObj.resizeModule.pageX).toBeNull();
                expect(gridObj.resizeModule.element).toBeNull();
                expect(gridObj.resizeModule.column).toBeNull();
                expect(gridObj.resizeModule.helper).toBeNull();
                expect(gridObj.element.querySelector('.' + resizeClassList.helper)).toBeFalsy();
            });

            it('resizing width restriction', () => {
                let column = { field: 'CustomerID', width: 100, minWidth: 50, maxWidth: 200 };
                expect(gridObj.resizeModule.widthService.getWidth(column)).toBe(100);
                column = { field: 'CustomerID', width: 300, minWidth: 50, maxWidth: 200 };
                expect(gridObj.resizeModule.widthService.getWidth(column)).toBe(200);
                column = { field: 'CustomerID', width: 10, minWidth: 50, maxWidth: 200 };
                expect(gridObj.resizeModule.widthService.getWidth(column)).toBe(50);
            });

            it('resizing - mousemove', () => {
                let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
                gridObj.resizeModule.resizeStart({ target: handler, pageX: 0 });
                gridObj.resizeModule.resizing({ target: handler, pageX: 200 });
                let width = (gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth;
                gridObj.resizeModule.resizing({ target: handler, pageX: 300 });
                width += 100;
                expect(width).toEqual((gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth);
                gridObj.resizeModule.resizing({ target: handler, pageX: 100 });
                width -= 200;
                expect(width).toEqual((gridObj.getHeaderTable().querySelectorAll('th')[1]).offsetWidth);
            });
            it('resizing - destroy', () => {
                gridObj.resizeModule.render();
                gridObj.resizeModule.destroy();
                expect(gridObj.resizeModule.widthService).toBeNull();
            });            
    
            afterAll(() => {
                destroy(gridObj);
            });
        });
        describe('Events', () => {
            let resizeStartevent: EmitType<ResizeArgs> = jasmine.createSpy('resizeStartevent');
            let resizeStop: EmitType<ResizeArgs> = jasmine.createSpy('resizeStartStop');
            let resize: EmitType<ResizeArgs> = jasmine.createSpy('resize');
            let gridObj: any;
            let columns: Column[];
            beforeAll((done) => {
                jasmine.Ajax.install();
                gridObj = createGrid(
                    {
                        frozenColumns: 2,
                        frozenRows: 2,
                        dataSource: data,
                        allowResizing: true,
                        height: 300,
                        width: 700,
                        columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 },
                        { field: 'Freight', headerText: 'Freight', width: 200 },
                        { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
                        resizeStart: resizeStartevent,
                        resizeStop: resizeStop,
                        resizing: resize
                    }, done);
            });
            beforeEach((done: Function) => {
                let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
                gridObj.resizeModule.resizeStart({ target: handler });
                gridObj.resizeModule.resizing({ target: handler, pageX: 200 });
                gridObj.resizeModule.resizeEnd({ target: handler });
                setTimeout(() => {
                    done();
                }, 100);
            });
            it('events', () => {
                // expect(resizeStartevent).toHaveBeenCalled();
                // expect(resizeStop).toHaveBeenCalled();
                // expect(resize).toHaveBeenCalled();
            });
            afterAll(() => {
                jasmine.Ajax.uninstall();
                destroy(gridObj);
            });
        });

        describe('resize start event', () => {

            let gridObj: any;
            let columns: Column[];
            beforeAll((done) => {
                gridObj = createGrid(
                    {
                        frozenColumns: 2,
                        frozenRows: 2,
                        dataSource: data,
                        allowResizing: true,
                        height: 300,
                        width: 700,
                        columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 },
                        { field: 'CustomerID', headerText: 'CustomerID' },
                        { field: 'EmployeeID', headerText: 'EmployeeID', width: 150 },
                        { field: 'Freight', headerText: 'Freight', width: 200 },
                        { field: 'ShipCity', headerText: 'ShipCity', width: 180 }],
                        resizeStart: function (e:any) {
                            e.cancel = true;
                        },

                    }, done);
            });

            beforeEach((done: Function) => {
                let handler: HTMLElement = gridObj.getHeaderTable().querySelectorAll('.' + resizeClassList.root)[1];
                gridObj.resizeModule.resizeStart({ target: handler });
                setTimeout(() => {
                    done();
                }, 100);
            });

            it('cancel', () => {
                //expect(gridObj.resizeModule.helper).toBeNull();
            });
            afterAll(() => {
                destroy(gridObj);
            });
        });
    });

    describe('Resize functionalities for all columns', () => {
        let gridObj: Grid;
        let headers: any;
        let columns: Column[];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    frozenColumns: 2,
                    frozenRows: 2,
                    allowResizing: true,
                    dataSource: data,
                    columns: [{ field: 'OrderID', headerText: 'OrderID', width: 150 }, { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'EmployeeID' }, { field: 'Freight', headerText: 'Freight', width: 200 },
                    { field: 'ShipCity', headerText: 'ShipCity' }],
                }, done);
        });
        it('More than one columns to be Autofit', () => {
            gridObj.autoFitColumns(['OrderID', 'CustomerID', 'EmployeeID']);
            headers = gridObj.getColumns()[0] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[1] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[2] as Column;
            expect(headers.width).toBeTruthy();
            headers = (<HTMLElement>gridObj.getHeaderTable()).style.width;
            expect(headers).toBeTruthy();
        });
        it('Resize all columns', () => {
            gridObj.autoFitColumns('');
            headers = gridObj.getColumns()[0] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[1] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[2] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[3] as Column;
            expect(headers.width).toBeTruthy();
            headers = gridObj.getColumns()[4] as Column;
            expect(headers.width).toBeTruthy();
            headers = (gridObj.getHeaderContent().querySelector('.e-movableheader').children[0] as HTMLElement).style.width;
            expect(headers).toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

});