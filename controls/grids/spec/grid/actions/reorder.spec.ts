/**
 * Grid Reordering spec document
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { getActualProperties, parentsUntil } from '../../../src/grid/base/util';
import { Column } from '../../../src/grid/models/column';
import { Sort } from '../../../src/grid/actions/sort';
import { Filter } from '../../../src/grid/actions/filter';
import { Freeze } from '../../../src/grid/actions/freeze';
import { Group } from '../../../src/grid/actions/group';
import { Page } from '../../../src/grid/actions/page';
import { Reorder } from '../../../src/grid/actions/reorder';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Sort, Page, Filter, Reorder, Group, Freeze);

function copyObject(source: Object, destiation: Object): Object {
    for (let prop in source) {
        destiation[prop] = source[prop];
    }
    return destiation;
}

function getEventObject(eventType: string, eventName: string, target?: Element, x?: number, y?: number): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };

    if (!isNullOrUndefined(x)) {
        returnObject.pageX = x;
        returnObject.clientX = x;
    }
    if (!isNullOrUndefined(y)) {
        returnObject.pageY = y;
        returnObject.clientY = y;
    }
    if (!isNullOrUndefined(target)) {
        returnObject.target = returnObject.srcElement = returnObject.toElement = returnObject.currentTarget = target;
    }

    return returnObject;
}

describe('Reorder module', () => {

    describe('Reorder functionalities', () => {
        let gridObj: Grid;
        let actionComplete: (e?: Object) => void;
        let headers: any;
        let columns: Column[];
        window['browserDetails'].isIE = false;

        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowReordering: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowFiltering: true,
                    actionComplete: actionComplete
                }, done);
        });

        it('Dynamic allowReordering set', () => {
            gridObj.allowReordering = false;
            gridObj.dataBind();
            expect(gridObj.reorderModule).toBeUndefined();
            gridObj.allowReordering = true;
            gridObj.dataBind();
            expect(gridObj.getHeaderContent().classList.contains("e-draggable")).toBeTruthy();
        });

        it('Reorder Column method testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                columns = gridObj.getColumns() as Column[];
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
                expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
                expect(columns[0].field).toBe('EmployeeID');
                expect(columns[1].field).toBe('OrderID');
                expect(columns[2].field).toBe('CustomerID');
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.dataBind();
            gridObj.reorderColumns('EmployeeID', 'OrderID');
        });

        it('Reorder Invalid Column testing', () => {
            gridObj.reorderColumns('EmployeeID', 'EmployeeID1');
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(columns[0].field).toBe('EmployeeID');
            expect(columns[1].field).toBe('OrderID');
        });

        it('Reorder same Column testing', () => {
            gridObj.reorderColumns('EmployeeID', 'EmployeeID');
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(columns[0].field).toBe('EmployeeID');
            expect(columns[1].field).toBe('OrderID');
        });

        // it('Reorder Column simulate testing', (done: Function) => {
        //     let dataBound = (args: Object): void => {
        //         columns = gridObj.getColumns() as Column[];
        //         headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
        //         expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
        //         expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
        //         expect(columns[0].field).toBe('OrderID');
        //         expect(columns[1].field).toBe('EmployeeID');
        //         done();
        //     };
        //     gridObj.dataBound = dataBound;
        //     gridObj.dataBind();

        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', headers[0].querySelector('.e-headercelldiv'), 13, 13);
        //     EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader') as HTMLElement, 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', headers[0], 27, 14);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.getContentTable(); //cursor testing
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = document.body; //outside move testing
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = headers[1];
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', headers[1], 198, 13);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        // });
        

        it('Reorder Column simulate testing', (done: Function) => {
            let cOld: Function = (gridObj.reorderModule as any).chkDropPosition;
            let ccOld: Function = (gridObj.reorderModule as any).chkDropAllCols;
            let dataBound = (args: Object): void => {
                columns = gridObj.getColumns() as Column[];
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
                expect(columns[0].field).toBe('OrderID');
                expect(columns[1].field).toBe('EmployeeID');
                done();
                (gridObj.reorderModule as any).chkDropPosition = cOld;
                (gridObj.reorderModule as any).chkDropAllCols = ccOld;
            };
            gridObj.dataBound = dataBound;
            gridObj.dataBind();
            let dropClone = createElement('div', { attrs: { 'e-mappinguid': gridObj.getUidByColumnField('OrderID') } });
            document.body.appendChild(dropClone);
            (gridObj.renderModule as any).headerRenderer.draggable.currentStateTarget = gridObj.getColumnHeaderByField('OrderID');
            (gridObj.headerModule as any).helper({ target: gridObj.getHeaderTable().querySelector('tr'), sender: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID') } });
            (gridObj.headerModule as any).dragStart({ target: gridObj.getColumnHeaderByField('OrderID').children[0], event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID').children[0] } });
            (gridObj.headerModule as any).dragStart({ target: gridObj.getColumnHeaderByField('OrderID'), event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID').children[0] } });
            (gridObj.headerModule as any).drag({ target: gridObj.getColumnHeaderByField('EmployeeID'), event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('EmployeeID').children[0] } });
            (gridObj.headerModule as any).dragStop({
                target: gridObj.getColumnHeaderByField('EmployeeID'),
                element: gridObj.getHeaderTable().querySelector('tr'), helper: dropClone, event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('EmployeeID').children[0] }
            });

            (gridObj.reorderModule as any).element = gridObj.getColumnHeaderByField('OrderID');
            (gridObj.reorderModule as any).chkDropPosition = () => true;
            (gridObj.reorderModule as any).chkDropAllCols = () => true;
            (gridObj.headerModule as any).drop({ target: gridObj.getColumnHeaderByField('EmployeeID'), droppedElement: dropClone });
            (gridObj.reorderModule as any).moveColumns(0, gridObj.getColumnByField('OrderID'));
        });

        it('Reorder disable and enable testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                columns = gridObj.getColumns() as Column[];
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('ShipCity');
                expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
                expect(headers[4].querySelector('.e-headercelldiv').textContent).toBe('Freight');
                expect(columns[0].field).toBe('OrderID');
                expect(columns[1].field).toBe('ShipCity');
                expect(columns[2].field).toBe('EmployeeID');
                expect(columns[4].field).toBe('Freight');
                //for coverage
                getActualProperties({});
                parentsUntil(headers[0], 'e-headercell', false);
                parentsUntil(headers[0], 'Grid', true);
                done();
                gridObj.dataBound = null;
            };
            gridObj.allowReordering = false;
            gridObj.dataBind();
            gridObj.allowReordering = true;
            gridObj.dataBind();
            gridObj.dataBound = dataBound;
            gridObj.dataBind();
            gridObj.reorderColumns('ShipCity', 'EmployeeID');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Reorder functionalities', () => {
        let gridObj: Grid;
        window['browserDetails'].isIE = false;
        beforeAll((done: Function) => {
            gridObj = createGrid({
                dataSource: data,
                allowSorting: true,
                allowReordering: true,
                columns: [{ field: 'OrderID' }, { field: 'EmployeeID' }, { field: 'CustomerID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowFiltering: true,
                filterSettings: { type: 'Menu' },
                dataBound: () => { done(); }
            }, done);
        });

        it('EJ2-6054-script error thrown when render a sample with reorder and filter menu', () => {
            gridObj.reorderColumns('CustomerID', 'EmployeeID');
            expect(gridObj.getColumns()[1].field).toBe('CustomerID');
            let tarele: Element = gridObj.element.querySelectorAll('.e-filtermenudiv')[1];
            let e: {} = { target: tarele };
            (<any>gridObj).filterModule.filterIconClickHandler(e);
            (<any>document.querySelector('.e-flmenu-input')).value = 'V';
            (<any>document.querySelector('.e-flmenu-okbtn')).click();
            expect((<any>gridObj.element.querySelectorAll('.e-filtered')).length).toBe(1);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    // //reOrder stacked header 
    // describe('Stacked header Reordering', () => {
    //     let gridObj: Grid;
    //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //     let actionComplete: (e?: Object) => void;
    //     beforeAll((done: Function) => {
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         document.body.appendChild(elem);
    //         gridObj = new Grid(
    //             {
    //                 dataSource: data, allowPaging: false,
    //                 columns: [
    //                     {
    //                         headerText: 'Order Details', toolTip: 'Order Details',
    //                         columns: [{ field: 'OrderID', headerText: 'Order ID' },
    //                         { field: 'OrderDate', headerText: 'Order Date', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }]
    //                     },
    //                     { field: 'CustomerID', headerText: 'Customer ID' },
    //                     { field: 'EmployeeID', headerText: 'Employee ID' },
    //                     {
    //                         headerText: 'Ship Details',
    //                         columns: [
    //                             { field: 'ShipCity', headerText: 'Ship City' },
    //                             { field: 'ShipCountry', headerText: 'Ship Country' },
    //                             {
    //                                 headerText: 'Ship Name Verified', columns: [{ field: 'ShipName', headerText: 'Ship Name' },
    //                                 { field: 'Verified', headerText: 'Verified' }]
    //                             },
    //                         ],
    //                     }
    //                 ],
    //                 allowGrouping: true,
    //                 allowSorting: true,
    //                 allowReordering: true,
    //                 dataBound: dataBound,
    //                 actionComplete: actionComplete
    //             });
    //         gridObj.appendTo('#Grid');
    //     });

    //     it('Reordering the stackedheadercolumn', (done: Function) => { // reorder stacked header with grouping enabled
    //         let headers = gridObj.getHeaderContent().querySelectorAll('.e-stackedheadercell');
    //         actionComplete = () => {
    //             headers = gridObj.getHeaderContent().querySelectorAll('.e-stackedheadercell');
    //             expect(headers[1].innerHTML).toBe('Order Details');
    //             expect(headers[0].innerHTML).toBe('Ship Details');
    //             expect(gridObj.element.querySelectorAll('.e-cloneproperties').length).toBe(0);
    //             done();
    //         };
    //         expect(headers[0].innerHTML).toBe('Order Details');
    //         expect(headers[1].innerHTML).toBe('Ship Details');
    //         let mousedown: any = getEventObject('MouseEvents', 'mousedown', headers[0], 50, 70);
    //         EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader') as HTMLElement, 'mousedown', mousedown);

    //         let mousemove: any = getEventObject('MouseEvents', 'mousemove', headers[0], 87, 74);
    //         EventHandler.trigger(<any>(document), 'mousemove', mousemove);
    //         let mouseup: any = getEventObject('MouseEvents', 'mouseup', headers[1], 198, 72);
    //         EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    //         gridObj.actionComplete = actionComplete;
    //     });
    //     afterAll(() => {
    //         elem.remove();
    //     });
    // });

    describe('Reorder functionalities with Freeze', () => {
        let gridObj: Grid;
        let headers: any;
        let columns: Column[];

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowReordering: true,
                    frozenColumns: 2,
                    frozenRows: 2,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' }],
                    allowFiltering: true,
                }, done);
        });

        it('Reorder Column method testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                columns = gridObj.getColumns() as Column[];
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
                expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
                expect(columns[0].field).toBe('EmployeeID');
                expect(columns[1].field).toBe('OrderID');
                expect(columns[2].field).toBe('CustomerID');
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.dataBind();
            gridObj.reorderColumns('EmployeeID', 'OrderID');
        });

        it('Reorder Column simulate testing', (done: Function) => {
            let cOld: Function = (gridObj.reorderModule as any).chkDropPosition;
            let ccOld: Function = (gridObj.reorderModule as any).chkDropAllCols;
            let dataBound = (args: Object): void => {
                columns = gridObj.getColumns() as Column[];
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
                expect(columns[2].field).toBe('OrderID');
                expect(columns[1].field).toBe('CustomerID');
                done();
                (gridObj.reorderModule as any).chkDropPosition = cOld;
                (gridObj.reorderModule as any).chkDropAllCols = ccOld;
            };
            gridObj.dataBound = dataBound;
            gridObj.dataBind();
            let dropClone = createElement('div', { attrs: { 'e-mappinguid': gridObj.getUidByColumnField('OrderID') } });
            document.body.appendChild(dropClone);
            (gridObj.renderModule as any).headerRenderer.draggable.currentStateTarget = gridObj.getColumnHeaderByField('OrderID');
            (gridObj.headerModule as any).helper({ target: gridObj.getHeaderTable().querySelector('tr'), sender: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID') } });
            (gridObj.headerModule as any).dragStart({ target: gridObj.getColumnHeaderByField('OrderID').children[0], event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID').children[0] } });
            (gridObj.headerModule as any).dragStart({ target: gridObj.getColumnHeaderByField('OrderID'), event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID').children[0] } });
            (gridObj.headerModule as any).drag({ target: gridObj.getColumnHeaderByField('CustomerID'), event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('CustomerID').children[0] } });
            (gridObj.headerModule as any).dragStop({
                target: gridObj.getColumnHeaderByField('CustomerID'),
                element: gridObj.getHeaderContent().querySelector('.e-movableheader').querySelector('tr'), helper: dropClone, event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('CustomerID').children[0] }
            });
            (gridObj.reorderModule as any).element = gridObj.getColumnHeaderByField('OrderID');
            (gridObj.reorderModule as any).chkDropPosition = () => true;
            (gridObj.reorderModule as any).chkDropAllCols = () => true;
            (gridObj.headerModule as any).drop({ target: gridObj.getColumnHeaderByField('CustomerID'), droppedElement: dropClone });
            (gridObj.reorderModule as any).moveColumns(2, gridObj.getColumnByField('OrderID'));
        });

        afterAll((done) => {
            destroy(gridObj);
            gridObj = headers = columns = null;
        });
    });
    describe('Reorder functionalities with virtual scrolling  =>', () => {
        let gridObj: Grid;
        let headers: any;
        let columns: Column[];

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowReordering: true,
                    frozenColumns: 2,
                    frozenRows: 2,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' }],
                    allowFiltering: true,
                }, done);
        });
        it('Reorder Column method testing', (done: Function) => {
            let dataBound = (args: Object): void => {
                columns = gridObj.getColumns(true) as Column[];
                headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
                expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
                expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
                expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
                expect(columns[0].field).toBe('CustomerID');
                expect(columns[1].field).toBe('EmployeeID');
                expect(columns[2].field).toBe('OrderID');
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.dataBind();
            gridObj.reorderColumns('OrderID', 'EmployeeID');
        });

        afterAll((done) => {
            destroy(gridObj);
            gridObj = headers = columns = null;
        });
    });

    describe('Reorder functionalities-column level', () => {
        let gridObj: Grid;
        let actionComplete: (e?: Object) => void;
        let headers: any;
        let flag: boolean = false;
        let columns: Column[];
        window['browserDetails'].isIE = false;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowReordering: true,
                    columns: [{ field: 'OrderID', allowReordering:false }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowFiltering: true,
                    actionComplete: actionComplete
                }, done);
        });

        it('Dynamic allowReordering set', () => {
            gridObj.allowReordering = true;
            gridObj.dataBind();
            expect(gridObj.getHeaderContent().classList.contains("e-draggable")).toBeTruthy();
        });

        it('Reorder Column method testing - 1', () => {
            gridObj.reorderColumns('OrderID', 'CustomerID');
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(columns[0].field).toBe('OrderID');
            expect(columns[1].field).toBe('CustomerID');
        });
        
        it('Reorder Column simulate testing', () => {      
            (gridObj.reorderModule as any).dragStart({ target: gridObj.getColumnHeaderByField('OrderID').children[0],column:gridObj.getColumnByField("OrderID"), event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID').children[0] } });
            (gridObj.reorderModule as any).dragStart({ target: gridObj.getColumnHeaderByField('OrderID'), column:gridObj.getColumnByField("OrderID"),event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID').children[0] } });
                   
            (gridObj.reorderModule as any).moveColumns = (destIndex: number, column: Column): void => { 
                flag =  true;
            };
            (gridObj.reorderModule as any).headerDrop({ target: gridObj.getColumnHeaderByField('OrderID'), event: { clientX: 10, clientY: 10, target: gridObj.getColumnHeaderByField('OrderID').children[0] } });
            expect(flag).toBe(false);     
        });
        
        afterAll(() => {
            destroy(gridObj);
            gridObj = headers = flag = actionComplete = columns = null;
        });
    });

    describe('Reorder Multiple Columns by using method', () => {
        let gridObj: Grid;
        let headers: any;
        let columns: Column[];

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowReordering: true,
                    columns: [{ field: 'OrderID' }, 
                    { field: 'CustomerID' }, 
                    { field: 'EmployeeID' }, 
                    { field: 'Freight' },
                    { field: 'ShipCity' },
                    {field:'Verified', allowReordering: false}],
                }, done);
        });

        it('Reorder Column method testing - 1', () => {
            gridObj.reorderColumns(['OrderID','CustomerID'], 'EmployeeID');
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(columns[0].field).toBe('EmployeeID');
            expect(columns[1].field).toBe('OrderID');
            expect(columns[2].field).toBe('CustomerID');
        });

        it('Reorder Column method testing - 2', () => {
            gridObj.reorderColumns(['OrderID','CustomerID'], 'EmployeeID');
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(columns[0].field).toBe('OrderID');
            expect(columns[1].field).toBe('CustomerID');
            expect(columns[2].field).toBe('EmployeeID');
        });

        it('Reorder Column method testing - 3', () => {
            gridObj.reorderColumns(['CustomerID'], 'Freight');
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[3].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('Freight');
            expect(columns[3].field).toBe('CustomerID');
            expect(columns[2].field).toBe('Freight');
        });

        it('Reorder Column method testing - 4', () => {
            gridObj.reorderColumns(['Freight','CustomerID','ShipCity'], 'EmployeeID');
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('Freight');
            expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(headers[3].querySelector('.e-headercelldiv').textContent).toBe('ShipCity');
            expect(headers[4].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(columns[1].field).toBe('Freight');
            expect(columns[2].field).toBe('CustomerID');
            expect(columns[3].field).toBe('ShipCity');
            expect(columns[4].field).toBe('EmployeeID');
        });

        it('Reorder Column method testing - 5', () => {
            gridObj.reorderColumns(['CustomerID'], 'Verified');
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(headers[5].querySelector('.e-headercelldiv').textContent).toBe('Verified');
            expect(columns[2].field).toBe('CustomerID');
            expect(columns[5].field).toBe('Verified');
        });

        it('Reorder Invalid Column testing - 6', () => {
            gridObj.reorderColumns(['CustomerID'], 'Verified1');
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[2].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(columns[2].field).toBe('CustomerID');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = headers = columns = null;
        });
    });

    describe('Reorder Column by Index', () => {
        let gridObj: Grid;
        let headers: any;
        let columns: Column[];

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowReordering: true,
                    columns: [{ field: 'OrderID' }, 
                    { field: 'CustomerID' }, 
                    { field: 'EmployeeID' }, 
                    { field: 'Freight' },
                    { field: 'ShipCity' }],
                }, done);
        });

        it('Reorder Column by index testing - 1', () => {
            gridObj.reorderColumnByIndex(0, 4);
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(headers[4].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(columns[0].field).toBe('CustomerID');
            expect(columns[1].field).toBe('EmployeeID');
            expect(columns[4].field).toBe('OrderID');
        });

        it('Reorder Column by index testing - 2', () => {
            gridObj.reorderColumnByIndex(3, 4);
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(headers[3].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(headers[4].querySelector('.e-headercelldiv').textContent).toBe('ShipCity');
            expect(columns[0].field).toBe('CustomerID');
            expect(columns[3].field).toBe('OrderID');
            expect(columns[4].field).toBe('ShipCity');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = headers = columns = null;
        });
    });

    describe('Reorder Column by Target', () => {
        let gridObj: Grid;
        let headers: any;
        let columns: Column[];

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSorting: true,
                    allowReordering: true,
                    columns: [{ field: 'OrderID' }, 
                    { field: 'CustomerID' }, 
                    { field: 'EmployeeID' }, 
                    { field: 'Freight' },
                    { field: 'ShipCity' }],
                }, done);
        });

        it('Reorder Column by target testing - 1', () => {
            gridObj.reorderColumnByTargetIndex('OrderID', 4);
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(headers[4].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(columns[0].field).toBe('CustomerID');
            expect(columns[1].field).toBe('EmployeeID');
            expect(columns[4].field).toBe('OrderID');
        });

        it('Reorder Column by target testing - 2', () => {
            gridObj.reorderColumnByTargetIndex(['OrderID'], 4);
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(headers[4].querySelector('.e-headercelldiv').textContent).toBe('OrderID');
            expect(columns[0].field).toBe('CustomerID');
            expect(columns[1].field).toBe('EmployeeID');
            expect(columns[4].field).toBe('OrderID');
        });

        it('Reorder Column by target testing - 3', () => {
            gridObj.reorderColumnByTargetIndex(['EmployeeID'], 4);
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('Freight');
            expect(headers[4].querySelector('.e-headercelldiv').textContent).toBe('EmployeeID');
            expect(columns[0].field).toBe('CustomerID');
            expect(columns[1].field).toBe('Freight');
            expect(columns[4].field).toBe('EmployeeID');
        });

        it('Reorder Column by target testing - 4', () => {
            gridObj.reorderColumnByTargetIndex(['CustomerID', 'Freight'], 4);
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('ShipCity');
            expect(headers[3].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(headers[4].querySelector('.e-headercelldiv').textContent).toBe('Freight');
            expect(columns[0].field).toBe('ShipCity');
            expect(columns[3].field).toBe('CustomerID');
            expect(columns[4].field).toBe('Freight');
        });

        it('Reorder Column by target testing - 5', () => {
            gridObj.reorderColumnByTargetIndex(['OrderID', 'EmployeeID', 'CustomerID'], 4);
            columns = gridObj.getColumns() as Column[];
            headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            expect(headers[0].querySelector('.e-headercelldiv').textContent).toBe('ShipCity');
            expect(headers[1].querySelector('.e-headercelldiv').textContent).toBe('Freight');
            expect(headers[4].querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(columns[0].field).toBe('ShipCity');
            expect(columns[1].field).toBe('Freight');
            expect(columns[4].field).toBe('CustomerID');
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
            gridObj = headers = columns = null;
        });
    });
});
