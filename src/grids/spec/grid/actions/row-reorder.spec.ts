/**
 * Grid Row Reordering spec document
 */
import { EventHandler, EmitType } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Column } from '../../../src/grid/models/column';
import { Sort } from '../../../src/grid/actions/sort';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { RowDD } from '../../../src/grid/actions/row-reorder';
import { data } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';

Grid.Inject(Page, Sort, Selection);

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

function setMouseCordinates(eventarg: any, x: number, y: number): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    return eventarg;
}

// drag and drop rows without inject row Drag and Drop module
describe('Reorder row functionalities', () => {
    let gridObj: Grid;
    let gridObj1: Grid;
    let actionComplete: (e?: Object) => void;
    let actionComplete1: (e?: Object) => void;
    let rows: any;
    let rows1: any;
    window['browserDetails'].isIE = false;

    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: JSON.parse(JSON.stringify(<any>data)),
                allowRowDragAndDrop: true,
                rowDropSettings: { targetID: undefined },
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Row' },
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowSorting: true,
                allowPaging: true,
                pageSettings: { pageSize: 6, currentPage: 1 },
                actionComplete: actionComplete,
            }, done);

        gridObj1 = createGrid(
            {
                dataSource: [],
                allowRowDragAndDrop: true,
                rowDropSettings: { targetID: 'Grid' },
                allowSelection: true,
                selectionSettings: { type: 'Multiple', mode: 'Row' },
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                allowSorting: true,
                allowPaging: true,
                pageSettings: { pageSize: 6, currentPage: 1 },
                actionComplete: actionComplete1,
            }, done);
    });

    it('drag and drop selected row in second grid with out module inject', () => {
        gridObj.selectRows([3, 4, 5]);
        rows = gridObj.getRows();
        let mouseDown: any = getEventObject('MouseEvents', 'mousedown', rows[4].firstChild, 50, 195);
        EventHandler.trigger(gridObj.getContent() as HTMLElement, 'mousedown', mouseDown);

        let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[5].firstChild, 80, 218);
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = document.querySelector('#Grid1');
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.getContent().querySelectorAll('tr')[0];
        EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj.getContent().querySelectorAll('tr')[0], 30, 200);
        EventHandler.trigger(<any>(document), 'mouseup', mouseup);
    });

    it('inject row drag and drop module', () => {
        Grid.Inject(RowDD);
        gridObj.allowRowDragAndDrop = false;
        gridObj.dataBind();
        gridObj.allowRowDragAndDrop = true;
        gridObj.dataBind();
    });
    afterAll(() => {
        destroy(gridObj);
        destroy(gridObj1);
    });
});



describe('Row Drag and Drop module', () => {
    describe('Reorder row functionalities', () => {
        let gridObj: Grid;
        let gridObj1: Grid;
        let actionComplete: (e?: Object) => void;
        let actionComplete1: (e?: Object) => void;
        let rows: any;
        let rows1: any;
        window['browserDetails'].isIE = false;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: JSON.parse(JSON.stringify(<any>data)),
                    allowRowDragAndDrop: true,
                    rowDropSettings: { targetID: undefined },
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6, currentPage: 1 },
                    actionComplete: actionComplete,
                }, done);

            gridObj1 = createGrid(
                {
                    dataSource: [],
                    allowRowDragAndDrop: true,
                    rowDropSettings: { targetID: 'Grid' },
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6, currentPage: 1 },
                    actionComplete: actionComplete1,
                }, done);
        });

        it('chekc drag and drop module', () => {
            expect(gridObj.rowDragAndDropModule).not.toBe(undefined);
        });

        // it('Reorder box selection simulate testing', () => {
        //     rows = gridObj.getContent().querySelectorAll('tr.e-row');

        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[1].querySelectorAll('.e-rowcell')[0], 15, 29);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousemove', mousemove);
        //     mousemove = setMouseCordinates(mousemove, 2, 2);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = rows[0].querySelectorAll('.e-rowcell')[0];
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = rows[1].querySelectorAll('.e-rowcell')[0];
        //     mousemove = setMouseCordinates(mousemove, 15, 29);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', rows[1].querySelectorAll('.e-rowcell')[0]);
        //     EventHandler.trigger(<any>(document.body), 'mouseup', mouseup);

        //     expect(gridObj.selectionModule.selectedRowIndexes.length).toBe(2);
        //     expect(gridObj.selectionModule.selectedRowIndexes.indexOf(0) > -1).toBeTruthy();
        //     expect(gridObj.selectionModule.selectedRowIndexes.indexOf(1) > -1).toBeTruthy();

        // });

        // it('Reorder Row within grid return testing', () => {
        //     rows = gridObj.getContent().querySelectorAll('tr.e-row');

        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = rows[3].querySelectorAll('.e-rowcell')[0];
        //     mousemove = setMouseCordinates(mousemove, 15, 75);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', rows[3].querySelectorAll('.e-rowcell')[0]);
        //     mouseup.type = 'mouseup';
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        //     rows = gridObj.getContent().querySelectorAll('tr.e-row');
        //     expect(rows[0].querySelector('.e-rowcell').textContent).toBe('10248');
        // });

        // it('Reorder drag with dragarea testing', () => {
        //     rows = gridObj.getContent().querySelectorAll('tr.e-row');
        //     gridObj.element.appendChild(createElement('div', { className: 'e-griddragarea' }));
        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-cloneproperties');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = rows[3].querySelectorAll('.e-rowcell')[0];
        //     mousemove = setMouseCordinates(mousemove, 15, 75);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', rows[3].querySelectorAll('.e-rowcell')[0]);
        //     mouseup.type = 'mouseup';
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        //     rows = gridObj.getContent().querySelectorAll('tr.e-row');
        //     expect(rows[0].querySelector('.e-rowcell').textContent).toBe('10248');
        //     remove(gridObj.element.querySelector('.e-griddragarea'));
        // });


        // it('Reorder Row simulate grid to grid with undefined id testing', () => {
        //     rows = gridObj.getContent().querySelectorAll('tr.e-row');

        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

        //     rows1 = gridObj1.element.querySelector('.e-emptyrow');
        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element; //not-allowed cursor
        //     mousemove = setMouseCordinates(mousemove, 15, 75);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = rows1;
        //     mousemove = setMouseCordinates(mousemove, 15, 75);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', rows1, 15, 75);
        //     mouseup.type = 'mouseup';
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);

        //     expect(rows[0].querySelector('.e-rowcell').textContent).toBe('10248');
        //     expect(rows[1].querySelector('.e-rowcell').textContent).toBe('10249');
        // });

        // it('Reorder Row simulate grid to grid testing', (done: Function) => {
        //     actionComplete = (args: Object): void => {
        //         rows = gridObj1.getContent().querySelectorAll('tr.e-row');
        //         expect(rows[0].querySelector('.e-rowcell').textContent).toBe('10248');
        //         expect(rows[1].querySelector('.e-rowcell').textContent).toBe('10249');

        //         rows = gridObj.getContent().querySelectorAll('tr.e-row');
        //         expect(rows[0].querySelector('.e-rowcell').textContent).toBe('10250');
        //         expect(rows[1].querySelector('.e-rowcell').textContent).toBe('10251');
        //         //for coverage
        //         gridObj.allowRowDragAndDrop = false;
        //         gridObj.dataBind();
        //         gridObj.allowRowDragAndDrop = true;
        //         gridObj.dataBind();
        //         (<any>gridObj.rowDragAndDropModule).enableAfterRender({ module: 'sort' });
        //         (<any>gridObj.rowDragAndDropModule).columnDrop({
        //             droppedElement: createElement('div',
        //                 { attrs: { 'action': 'grouping' } })
        //         });


        //         //for coverage
        //         gridObj.element.appendChild(createElement('div', { className: 'e-griddragarea' }));
        //         (<any>gridObj.getContent()).ej2_instances[2].trigger('dragStart', {}); //draggable instance  
        //         gridObj.element.appendChild(createElement('div', { className: 'e-cloneproperties' }));
        //         (<any>gridObj.getContent()).ej2_instances[2].trigger('dragStop',
        //             { target: gridObj.element, helper: gridObj.element.querySelector('.e-cloneproperties'), event: { clientX: 15, clientY: 15 } }); //draggable instance
        //         let target: HTMLElement = createElement('div', { id: 'Grid', attrs: { 'action': 'grouping1' } });
        //         gridObj.element.appendChild(target);
        //         (<any>gridObj.rowDragAndDropModule).columnDrop({ target: gridObj.element, droppedElement: target });

        //         gridObj.isDestroyed = true;
        //         gridObj.rowDragAndDropModule = new RowDD(gridObj);

        //         gridObj.rowDragAndDropModule.destroy();
        //         done();
        //     };
        //     gridObj.rowDropSettings.targetID = 'Grid1';
        //     gridObj.actionComplete = actionComplete;
        //     gridObj.dataBind();
        //     rows = gridObj.getContent().querySelectorAll('tr.e-row');

        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[0].querySelectorAll('.e-rowcell')[0], 15, 10);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

        //     rows1 = gridObj1.element.querySelector('.e-emptyrow');
        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[0].querySelectorAll('.e-rowcell')[0], 15, 70);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element;
        //     mousemove = setMouseCordinates(mousemove, 0, 0);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element;
        //     let obj: any = gridObj1.element.getElementsByClassName('e-emptyrow')[0].getBoundingClientRect();
        //     mousemove = setMouseCordinates(mousemove, obj.left + 2, obj.top + 2);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = rows1;
        //     mousemove = setMouseCordinates(mousemove, 15, 75);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', rows1, (<HTMLElement>rows1).offsetLeft + 30,
        //         (<HTMLElement>gridObj1.element).offsetTop + (<HTMLElement>gridObj1.getContent()).offsetTop + 10);
        //     mouseup.type = 'mouseup';
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);

        // });

        // it('Coverage testing', () => {
        //     gridObj.isDestroyed = true;
        //     gridObj.rowDragAndDropModule.destroy();
        //     gridObj.isDestroyed = false;
        //     gridObj.element.appendChild(createElement('div', { className: 'e-griddragarea' }));
        //     (<any>gridObj.rowDragAndDropModule).helper();
        //     (<any>gridObj.rowDragAndDropModule).dragStart();
        //     let target: HTMLElement = createElement('div', { id: 'Grid1', attrs: { 'action': 'grouping1' } });
        //     gridObj.element.appendChild(target);
        //     (<any>gridObj.rowDragAndDropModule).columnDrop({ target: gridObj.element, droppedElement: target });
        //     let target1: HTMLElement = createElement('div', { id: 'Grid2', attrs: { 'action': 'grouping' } });
        //     gridObj.element.appendChild(target1);
        //     (<any>gridObj.rowDragAndDropModule).enableAfterRender({ module: 'group' });




        //     (<any>gridObj.rowDragAndDropModule).columnDrop({ target: gridObj.element, droppedElement: target1 });
        //     gridObj.rowDragAndDropModule.destroy();
        //     gridObj.isDestroyed = true;
        //     gridObj.rowDragAndDropModule = new RowDD(gridObj);
        // });


        afterAll(() => {
            destroy(gridObj);
            destroy(gridObj1);
        });
    });



    // describe('Row Drag and Drop module', () => {
    //     describe('Reorder row functionalities', () => {
    //         let gridObj: Grid;
    //         let gridObj1: Grid;
    //         let actionComplete: (e?: Object) => void;
    //         let actionComplete1: (e?: Object) => void;
    //         let rows: any;
    //         let rows1: any;
    //         window['browserDetails'].isIE = false;

    //         beforeAll((done: Function) => {
    //             gridObj = createGrid(
    //                 {
    //                     dataSource: JSON.parse(JSON.stringify(<any>data)),
    //                     allowRowDragAndDrop: true,
    //                     rowDropSettings: { targetID: 'Grid1' },
    //                     allowSelection: true,
    //                     selectionSettings: { type: 'Multiple', mode: 'Row' },
    //                     columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
    //                     { field: 'ShipCity' }],
    //                     allowSorting: true,
    //                     allowPaging: true,
    //                     pageSettings: { pageSize: 6, currentPage: 1 },
    //                     actionComplete: actionComplete,
    //                 }, done);

    //             gridObj1 = createGrid(
    //                 {
    //                     dataSource: [],
    //                     allowRowDragAndDrop: true,
    //                     rowDropSettings: { targetID: 'Grid' },
    //                     allowSelection: true,
    //                     selectionSettings: { type: 'Multiple', mode: 'Row' },
    //                     columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
    //                     { field: 'ShipCity' }],
    //                     allowSorting: true,
    //                     allowPaging: true,
    //                     pageSettings: { pageSize: 6, currentPage: 1 },
    //                     actionComplete: actionComplete1,
    //                 }, done);
    //         });

    //         it('row drop method for coverage', () => {
    //             gridObj.selectRow(1);
    //             let target: HTMLElement = createElement('div', { id: 'Grid11', attrs: { 'action': 'grouping1' } });
    //             gridObj.element.appendChild(target);

    //             (gridObj1.rowDragAndDropModule as any).columnDrop({
    //                 droppedElement: target,
    //                 target: gridObj1.getContentTable().querySelector('.e-emptyrow').children[0]
    //             });
    //             gridObj.element.appendChild(createElement('div', { className: 'e-cloneproperties' }));
    //             (gridObj.rowDragAndDropModule as any).dragStart({ target: gridObj.element });
    //             (gridObj1.rowDragAndDropModule as any).dragStart({ target: gridObj.element });
    //             (gridObj.rowDragAndDropModule as any).drag({ target: gridObj.element, event: { clientX: 10, clientY: 10, target: gridObj.element } });
    //             (gridObj.rowDragAndDropModule as any).dragStop({ helper: gridObj.element, event: { clientX: 10, clientY: 10, target: gridObj.element } });
    //             (gridObj.rowDragAndDropModule as any).getTargetIdx(null);
    //         });
    //         it('row drop method for coverage', () => {
    //             gridObj.selectRow(1);
    //             let target: HTMLElement = createElement('div', { id: 'Grid11', attrs: { 'action': 'grouping1' } });
    //             gridObj.element.appendChild(target);
    //             document.body.appendChild(gridObj.element);
    //             gridObj.element.appendChild(createElement('div', { className: 'e-cloneproperties' }));
    //             (gridObj.rowDragAndDropModule as any).dragStart({ target: "" });
    //             (gridObj1.rowDragAndDropModule as any).dragStart({ target: gridObj.element });
    //             (gridObj.rowDragAndDropModule as any).drag({ target: gridObj.element, event: { clientX: 10, clientY: 10, target: gridObj.element } });
    //             (gridObj.rowDragAndDropModule as any).dragStop({ helper: gridObj.element, event: { clientX: 10, clientY: 10, target: gridObj.element } });
    //             (gridObj.rowDragAndDropModule as any).getTargetIdx(null);
    //             gridObj.notify('rows-added', { records: [{ OrderID: 343434 }], toIndex: 1 });
    //         });


    //         afterAll(() => {
    //             destroy(gridObj);
    //             destroy(gridObj1);
    //         });
    //     });
    // });

    describe('Row Drag and Drop module', () => {    
        // describe('Reorder row functionalities', () => {
        //     let gridObj: Grid;
        //     let gridObj1: Grid;
        //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
        //     let elem1: HTMLElement = createElement('div', { id: 'Grid1' });
        //     let dataBound: EmitType<Object>;
        //     let actionComplete: (e?: Object) => void;
        //     let dataBound1: EmitType<Object>;
        //     let actionComplete1: (e?: Object) => void;
        //     let rows: any;
        //     let rows1: any;
        //     window['browserDetails'].isIE = false;

        //     beforeAll((done: Function) => {
        //         let dataBound: EmitType<Object> = () => { done(); };
        //         document.body.appendChild(elem);
        //         gridObj = new Grid(
        //             {
        //                 dataSource: JSON.parse(JSON.stringify(<any>data)),
        //                 allowRowDragAndDrop: true,
        //                 rowDropSettings: { targetID: 'Grid1' },
        //                 allowSelection: true,
        //                 selectionSettings: { type: 'Multiple', mode: 'Row' },
        //                 columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
        //                 { field: 'ShipCity' }],
        //                 allowSorting: true,
        //                 allowPaging: false,
        //                 pageSettings: { pageSize: 6, currentPage: 1 },
        //                 actionComplete: actionComplete,
        //                 dataBound: dataBound
        //             });
        //         gridObj.appendTo('#Grid');

        //         document.body.appendChild(elem1);
        //         gridObj1 = new Grid(
        //             {
        //                 dataSource: [],
        //                 allowRowDragAndDrop: true,
        //                 rowDropSettings: { targetID: 'Grid' },
        //                 allowSelection: true,
        //                 selectionSettings: { type: 'Multiple', mode: 'Row' },
        //                 columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
        //                 { field: 'ShipCity' }],
        //                 allowSorting: true,
        //                 allowPaging: false,
        //                 pageSettings: { pageSize: 6, currentPage: 1 },
        //                 actionComplete: actionComplete1,
        //                 dataBound: dataBound1
        //             });
        //         gridObj1.appendTo('#Grid1');
        //     });

        //     // it('row drop method for coverage', () => {
        //     //     gridObj.selectRow(1, true);
        //     //     let target: HTMLElement = createElement('div', { id: 'Grid1', attrs: { 'action': 'grouping1' } });
        //     //     gridObj.element.appendChild(target);

        //     //     (gridObj1.rowDragAndDropModule as any).columnDrop({
        //     //         droppedElement: target,
        //     //         target: gridObj1.getContentTable().querySelector('.e-emptyrow').children[0]
        //     //     });

        //     //     gridObj.rowDropSettings.targetID = undefined;
        //     //     gridObj1.rowDropSettings.targetID = undefined;
        //     //     gridObj.dataBind();
        //     //     gridObj1.dataBind();
        //     //     (gridObj1.rowDragAndDropModule as any).columnDrop({
        //     //         droppedElement: target,
        //     //         target: gridObj1.getContentTable().querySelector('td')
        //     //     });
        //     // });


        //     afterAll(() => {
        //         remove(elem);
        //         remove(elem1);
        //     });
        // });
    });


    // row reorder between two grids using touch and mouse.
    describe('Reorder row functionalities with mouse and touch', () => {
        let gridObj: Grid;
        let gridObj1: Grid;
        let preventDefault: Function = new Function();
        let actionComplete: (e?: Object) => void;
        let actionComplete1: (e?: Object) => void;
        let rows: any;
        let rows1: any;
        let firstData: Object;
        let firstData1: Object;
        let bool: boolean = false;
        window['browserDetails'].isIE = false;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowRowDragAndDrop: true,
                    rowDropSettings: { targetID: undefined },
                    allowSelection: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight', format: 'c2' },
                    { field: 'OrderDate', format: 'yMd' }],
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6, currentPage: 1 },
                    selectionSettings: { type: 'Multiple' },
                    actionComplete: actionComplete,
                }, done);

            gridObj1 = createGrid(
                {
                    dataSource: [],
                    allowRowDragAndDrop: true,
                    rowDropSettings: { targetID: 'Grid' },
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight', format: 'c2' },
                    { field: 'OrderDate', format: 'yMd' }],
                    allowSorting: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6, currentPage: 1 },
                    actionComplete: actionComplete1,
                }, done);
        });

        it('set drop target ID', () => {
            gridObj.rowDropSettings.targetID = gridObj1.element.id;
            gridObj.dataBind();
            expect(document.getElementById(gridObj1.element.id)).toEqual(gridObj1.element);
        });

        // it('reorder helper coverage', () => {
        //     gridObj.selectRow(3);
        //     let target: any = gridObj.getContent().querySelectorAll('.e-selectionbackground')[0];
        //     let sender: object = {};
        //     let eve: any = { sender: { target } };
        //     (<any>gridObj).rowDragAndDropModule.helper(eve);
        // });


        // it('drag and drop selected rows outside of grid', () => {
        //     rows = gridObj.getRows();
        //     gridObj.selectRows([3, 4, 5]);
        //     let mouseDown: any = getEventObject('MouseEvents', 'mousedown', rows[4].firstChild, 50, 195);
        //     EventHandler.trigger(gridObj.getContent() as HTMLElement, 'mousedown', mouseDown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[5].firstChild, 80, 218);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = document.querySelector('#Grid1');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj1.getHeaderContent();
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj1.getHeaderContent(), 198, 306);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        //     expect(document.querySelectorAll('.e-grid.e-dragclone').length).toBe(0);
        //     expect(gridObj.getContent().querySelectorAll('.e-selectionbackground.e-active').length).toBe(15);
        // });

        // it('drag and drop selected row in second grid using touch', (done: Function) => {
        //     dataBound1 = () => {
        //         expect(gridObj1.getRows().length).toBe(3);
        //         expect(gridObj1.pageSettings.currentPage).toBe(1);
        //         expect(gridObj1.pageSettings.totalRecordsCount).toBe(3);
        //         expect(gridObj1.getRows()[0].children[3].innerHTML).toBe('$41.34');
        //     };
        //     let dataBound = () => {
        //         expect(gridObj.getRows().length).toBe(6);
        //         expect(gridObj.pageSettings.currentPage).toBe(1);
        //         expect(gridObj.pageSettings.totalRecordsCount).toBe(12);
        //     };
        //     gridObj1.dataBound = dataBound1;
        //     gridObj.dataBound = dataBound;
        //     gridObj.actionComplete = () => {
        //         done();
        //     };
        //     let doc: any = document;
        //     let touch: any = getEventObject('TouchEvent', 'touchstart', rows[5].firstChild);
        //     let touchs: Touch = document.createTouch(window, rows[5].firstChild, 1,
        //         (<HTMLElement>rows[5].firstChild).offsetLeft + 20, (<HTMLElement>rows[5].firstChild).offsetTop + 20, 60, 299);
        //     let touchList: TouchList = document.createTouchList(touchs);
        //     touch.changedTouches = touchList;
        //     touch.touches = touchList;
        //     touch.targetTouches = touchList;
        //     EventHandler.trigger(<HTMLElement>gridObj.getContent(), 'touchstart', touch);

        //     let touchMove: any = getEventObject('TouchEvent', 'touchmove', rows[5].firstChild);
        //     touchs = doc.createTouch(window, rows[5].firstChild, 2,
        //         (<HTMLElement>rows[5].firstChild).offsetLeft + 25, (<HTMLElement>rows[5].firstChild).offsetTop + 15, 65, 300,
        //         (<HTMLElement>rows[5].firstChild).offsetLeft + 25, (<HTMLElement>rows[5].firstChild).offsetTop + 15);
        //     touchList = document.createTouchList(touchs);
        //     touchMove.srcElement = touchMove.target = touchMove.toElement = rows[5].firstChild;
        //     touchMove.changedTouches = touchMove.touches = touchMove.targetTouches = document.createTouchList(touchs);
        //     touchMove.view = window;
        //     EventHandler.trigger((<any>document), 'touchmove', touchMove);

        //     touchMove.srcElement = touchMove.target = touchMove.toElement = document.querySelector('#Grid1');
        //     touchs = doc.createTouch(window, document.querySelector('#Grid1'), 3,
        //         (<HTMLElement>document.querySelector('#Grid1')).offsetLeft + 30, (<HTMLElement>document.querySelector('#Grid1')).offsetTop + 20, 62, 370,
        //         (<HTMLElement>document.querySelector('#Grid1')).offsetLeft + 30, (<HTMLElement>document.querySelector('#Grid1')).offsetTop + 20);
        //     touchMove.changedTouches = touchMove.touches = touchMove.targetTouches = document.createTouchList(touchs);
        //     EventHandler.trigger((<any>document), 'touchmove', touchMove);

        //     let touchEnd: any = getEventObject('TouchEvent', 'touchend', <HTMLTableRowElement>gridObj1.getContent().querySelectorAll('tr')[0]);

        //     touchs = doc.createTouch(window, gridObj1.getContent().querySelectorAll('tr')[0], 4,
        //         (<HTMLElement>gridObj1.getContent().querySelectorAll('tr')[0]).offsetLeft + 30, (<HTMLElement>gridObj1.element).offsetTop + (<HTMLElement>gridObj1.getContent()).offsetTop + 10, 198, 450,
        //         (<HTMLElement>gridObj1.getContent().querySelectorAll('tr')[0]).offsetLeft + 30, (<HTMLElement>gridObj1.element).offsetTop + (<HTMLElement>gridObj1.getContent()).offsetTop + 10);
        //     touchList = document.createTouchList(touchs);
        //     touchEnd.changedTouches = touchList;
        //     touchEnd.touches = touchList;
        //     touchEnd.targetTouches = touchList;
        //     touchEnd.view = window;
        //     EventHandler.trigger((<any>document), 'touchend', touchEnd);
        // });

        // it('drag and drop selected row in second grid', (done: Function) => {
        //     rows = gridObj.getRows();
        //     gridObj.selectRows([3, 4, 5]);
        //     dataBound1 = () => {
        //         expect(gridObj1.getRows().length).toBe(6);
        //         expect(gridObj1.pageSettings.currentPage).toBe(1);
        //         expect(gridObj1.pageSettings.totalRecordsCount).toBe(6);
        //         expect(gridObj1.currentViewData[0]['OrderID']).toBe(10254);
        //     };
        //     let dataBound = () => {
        //         expect(gridObj.getRows().length).toBe(6);
        //         expect(gridObj.pageSettings.currentPage).toBe(1);
        //         expect(gridObj.pageSettings.totalRecordsCount).toBe(9);
        //         expect(gridObj.currentViewData[3]['OrderID']).toBe(10257);
        //     };
        //     actionComplete = (args: Object) => {
        //         expect(args['requestType']).toBe('rowdraganddrop');
        //         expect(args['type']).toBe('actionComplete');
        //         expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(0);
        //         done();
        //     };
        //     actionComplete1 = (args: Object) => {
        //         expect(args['requestType']).toBe('rowdraganddrop');
        //         expect(args['type']).toBe('actionComplete');
        //     };
        //     let actionBegin = (args: Object) => {
        //         expect(args['requestType']).toBe('rowdraganddrop');
        //         expect(args['type']).toBe('actionBegin');
        //     };
        //     let actionBegin1 = (args: Object) => {
        //         expect(args['requestType']).toBe('rowdraganddrop');
        //         expect(args['type']).toBe('actionBegin');
        //     };
        //     let rowDragStart: EmitType<Object> = (args: Object) => {
        //         expect(rows[3]).toBe(args['rows'][0]);
        //         expect(args['rows'].length).toBe(3);
        //         expect(args['target']).toEqual(rows[5].firstChild);
        //         expect(args['draggableType']).toBe('rows');
        //         expect(args['data']).not.toBe(null);
        //         expect(args['data'].length).toBe(gridObj.getSelectedRowIndexes().length);
        //     };
        //     let rowDrag: EmitType<Object> = (args: Object) => {
        //         expect(rows[3]).toEqual(args['rows'][0]);
        //         expect(args['rows'].length).toBe(3);
        //         expect(args['target']).toEqual(rows[4].firstChild);
        //         expect(args['draggableType']).toBe('rows');
        //         expect(args['data']).not.toBe(null);
        //         expect(args['data'].length).toBe(gridObj.getSelectedRowIndexes().length);
        //         expect((<any>document.getElementById(gridObj.rowDropSettings.targetID)).ej2_instances[0].getContent().classList.contains('e-allowRowDrop')).toBe(true)
        //         bool ? expect(gridObj.element.classList.contains('e-rowdrag')).toBe(true) : bool = true;
        //     };
        //     let rowDrop: EmitType<Object> = (args: Object) => {
        //         expect(rows[3]).toEqual(args['rows'][0]);
        //         expect(args['rows'].length).toBe(3);
        //         expect(args['target']).not.toBe(null);
        //         expect(args['draggableType']).toBe('rows');
        //         expect(args['data']).not.toBe(null);
        //         expect(args['data'].length).toBe(gridObj.getSelectedRowIndexes().length);
        //     };
        //     gridObj.rowDragStart = rowDragStart;
        //     gridObj.rowDrag = rowDrag;
        //     gridObj.rowDrop = rowDrop;
        //     gridObj1.dataBound = dataBound1;
        //     gridObj.dataBound = dataBound;
        //     gridObj.actionComplete = actionComplete;
        //     gridObj1.actionComplete = actionComplete1;
        //     gridObj.actionBegin = actionBegin;
        //     gridObj1.actionBegin = actionBegin1;
        //     let mouseDown: any = getEventObject('MouseEvents', 'mousedown', rows[4].firstChild, (<HTMLElement>rows[4].firstChild).offsetLeft + 20, (<HTMLElement>rows[4].firstChild).offsetTop + 20);
        //     EventHandler.trigger(gridObj.getContent() as HTMLElement, 'mousedown', mouseDown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[5].firstChild, (<HTMLElement>rows[5].firstChild).offsetLeft + 20, (<HTMLElement>rows[5].firstChild).offsetTop + 20);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = document.querySelector('#Grid1');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj1.getContent().querySelectorAll('tr')[0];
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj1.getContent().querySelectorAll('tr')[0], (<HTMLElement>gridObj1.getContent().querySelectorAll('tr')[0]).offsetLeft + 30, (<HTMLElement>gridObj1.element).offsetTop + (<HTMLElement>gridObj1.getContent()).offsetTop + 20);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        // });

        // it('Go to second page', (done: Function) => {
        //     actionComplete = () => {
        //         expect(gridObj.pageSettings.currentPage).toBe(2);
        //         expect(gridObj.getPager().querySelector('.e-currentitem.e-active').innerHTML).toBe('2');
        //         done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     gridObj.actionBegin = undefined;
        //     gridObj1.actionBegin = undefined;
        //     gridObj1.actionComplete = undefined;
        //     gridObj.dataBound = undefined;
        //     gridObj.pageSettings.currentPage = 2;
        //     gridObj.dataBind();
        // });

        // it('drag and drop selected row in second grid in second page', (done: Function) => {
        //     let args: any = { action: 'ctrlPlusA', preventDefault: preventDefault };
        //     gridObj.element.focus();
        //     gridObj.keyboardModule.keyAction(args);
        //     rows = gridObj.getRows();
        //     dataBound1 = () => {
        //         expect(gridObj1.getRows().length).toBe(6);
        //         expect(gridObj1.pageSettings.currentPage).toBe(1);
        //         expect(gridObj1.pageSettings.totalRecordsCount).toBe(9);
        //     };
        //     let dataBound = () => {
        //         expect(gridObj.getRows().length).toBe(6);
        //         expect(gridObj.pageSettings.currentPage).toBe(1);
        //         expect(gridObj.getPager().querySelector('.e-currentitem.e-active').innerHTML).toBe('1');
        //         expect(gridObj.pageSettings.totalRecordsCount).toBe(6);
        //     };
        //     gridObj1.dataBound = dataBound1;
        //     gridObj.dataBound = dataBound;
        //     gridObj.actionComplete = () => {
        //         done();
        //     };
        //     gridObj.rowDragStart = undefined;
        //     gridObj.rowDrag = undefined;
        //     gridObj.rowDrop = undefined;
        //     let mouseDown: any = getEventObject('MouseEvents', 'mousedown', rows[1].firstChild, (<HTMLElement>rows[1].firstChild).offsetLeft + 20, (<HTMLElement>rows[1].firstChild).offsetTop + 20);
        //     EventHandler.trigger(gridObj.getContent() as HTMLElement, 'mousedown', mouseDown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[2].firstChild, (<HTMLElement>rows[2].firstChild).offsetLeft + 20, (<HTMLElement>rows[2].firstChild).offsetTop + 20);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = document.querySelector('#Grid1');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj1.getContent().querySelectorAll('tr')[0];
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj1.getContent().querySelectorAll('tr')[0], (<HTMLElement>gridObj1.getContent().querySelectorAll('tr')[0]).offsetLeft + 30, (<HTMLElement>gridObj1.element).offsetTop + (<HTMLElement>gridObj1.getContent()).offsetTop + 20);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        // });

        // it('Go to second page in second grid', (done: Function) => {
        //     actionComplete = () => {
        //         expect(gridObj1.pageSettings.currentPage).toBe(2);
        //         expect(gridObj1.getPager().querySelector('.e-currentitem.e-active').innerHTML).toBe('2');
        //         done();
        //     };
        //     gridObj1.actionComplete = actionComplete;
        //     gridObj1.dataBound = undefined;
        //     firstData1 = gridObj1.currentViewData[0];
        //     gridObj1.pageSettings.currentPage = 2;
        //     gridObj1.dataBind();
        // });

        // it('drag and drop selected rows second grid to first grid in second page', (done: Function) => {
        //     gridObj1.selectRows([0, 1, 2]);
        //     rows = gridObj1.getRows();
        //     firstData = gridObj1.currentViewData[0];
        //     dataBound1 = () => {
        //         expect(gridObj1.getRows().length).toBe(6);
        //         expect(gridObj1.pageSettings.currentPage).toBe(1);
        //         expect(gridObj1.getPager().querySelector('.e-currentitem.e-active').innerHTML).toBe('1');
        //         expect(gridObj1.pageSettings.totalRecordsCount).toBe(6);
        //         expect(gridObj1.currentViewData[0]['OrderID']).toEqual(firstData1['OrderID']);
        //         gridObj1.dataBound = undefined;
        //     };
        //     let dataBound = () => {
        //         expect(gridObj.getRows().length).toBe(6);
        //         expect(gridObj.pageSettings.currentPage).toBe(1);
        //         expect(gridObj.pageSettings.totalRecordsCount).toBe(9);
        //         expect(gridObj.currentViewData[0]['OrderID']).toEqual(firstData['OrderID']);
        //     };
        //     gridObj1.dataBound = dataBound1;
        //     gridObj.dataBound = dataBound;
        //     gridObj.actionComplete = undefined;
        //     gridObj1.actionComplete = () => {
        //         done();
        //     };
        //     let mouseDown: any = getEventObject('MouseEvents', 'mousedown', rows[1].firstChild, (<HTMLElement>gridObj1.getContent().querySelectorAll('tr')[1]).offsetLeft + 30, (<HTMLElement>gridObj1.element).offsetTop + (<HTMLElement>gridObj1.getContent()).offsetTop + 20);
        //     EventHandler.trigger(gridObj1.getContent() as HTMLElement, 'mousedown', mouseDown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[0].firstChild, (<HTMLElement>gridObj1.getContent().querySelectorAll('tr')[0]).offsetLeft + 30, (<HTMLElement>gridObj1.element).offsetTop + (<HTMLElement>gridObj1.getContent()).offsetTop);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = document.querySelector('#Grid');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.getContent().querySelectorAll('tr')[0];
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj.getContent().querySelectorAll('tr')[0], (<HTMLElement>gridObj.getContent().querySelectorAll('tr')[0]).offsetLeft + 30, (<HTMLElement>gridObj.element).offsetTop + (<HTMLElement>gridObj.getContent()).offsetTop + 20);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        // });

        // it('disable paging', (done: Function) => {
        //     actionComplete1 = () => {
        //         done();
        //     };
        //     gridObj.allowPaging = false;
        //     gridObj.dataBind();
        //     gridObj.dataBound = undefined;
        //     gridObj1.allowPaging = false;
        //     gridObj1.dataBind();
        //     gridObj1.actionComplete = actionComplete1;
        // });

        // it('Sort a Column', (done: Function) => {
        //     actionComplete = () => {
        //         expect(gridObj.sortSettings.columns.length).toBe(1);
        //         done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     gridObj1.dataBound = undefined;
        //     gridObj.dataBound = undefined;
        //     gridObj.sortColumn('EmployeeID', 'Ascending');
        //     gridObj.dataBind();
        // });

        // it('drag and drop selected row in second grid', (done: Function) => {
        //     rows = gridObj.getRows();
        //     gridObj.selectRows([3, 4, 5]);
        //     dataBound1 = () => {
        //         expect(gridObj1.getRows().length).toBe(9);
        //         expect(gridObj1.currentViewData[0]['OrderID']).toBe(10252);
        //     };
        //     let dataBound = () => {
        //         expect(gridObj.getRows().length).toBe(6);
        //         expect(gridObj.currentViewData[0]['OrderID']).toBe(10258);
        //     };
        //     gridObj1.dataBound = dataBound1;
        //     gridObj.dataBound = dataBound;
        //     gridObj.actionComplete = () => {
        //         done();
        //     };
        //     let mouseDown: any = getEventObject('MouseEvents', 'mousedown', rows[4].firstChild, (<HTMLElement>rows[4].firstChild).offsetLeft + 20, (<HTMLElement>rows[4].firstChild).offsetTop + 20);
        //     EventHandler.trigger(gridObj.getContent() as HTMLElement, 'mousedown', mouseDown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[5].firstChild, (<HTMLElement>rows[5].firstChild).offsetLeft + 20, (<HTMLElement>rows[5].firstChild).offsetTop + 20);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = document.querySelector('#Grid1');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj1.getContent().querySelectorAll('tr')[0];
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj1.getContent().querySelectorAll('tr')[0], (<HTMLElement>gridObj.getContent().querySelectorAll('tr')[0]).offsetLeft + 30, (<HTMLElement>gridObj.element).offsetTop + (<HTMLElement>gridObj.getContent()).offsetTop + 20);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        // });


        // /*scenario : set grid height and enable paging 
        // and select last page records using mouse and drag to the grid empty body */
        // it('enable paging', (done: Function) => {
        //     let actionComplete = () => {
        //         expect(gridObj.element.querySelectorAll('.e-gridpager').length).toBe(1);
        //         expect(gridObj.getRows().length).toBe(6);
        //         done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     gridObj.allowPaging = true,
        //         gridObj.selectionSettings.mode = 'Row';
        //     gridObj.dataBind();
        //     expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
        // });
        // it('set page size', (done: Function) => {
        //     let actionComplete = () => {
        //         expect(gridObj.element.querySelectorAll('.e-gridpager').length).toBe(1);
        //         done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     gridObj.pageSettings.pageSize = 12;
        //     gridObj.dataBind();
        // });
        // it('set height to grid', () => {
        //     gridObj.height = 400;
        //     gridObj.dataBind();
        //     expect((gridObj.getContent().firstChild as HTMLElement).style.height).toBe('400px');
        //     expect((gridObj.getContent().firstChild as HTMLElement).style.overflowY).toBe('scroll');
        // });

        // it('Select using mouse', (done: Function) => {   // select rows using mouse drag
        //     let rowSelected = (args: Object) => {
        //         if (i) {
        //             expect(gridObj.getSelectedRecords().length).toBe(2);
        //             done();
        //         }
        //         i = true;
        //     };
        //     let i: boolean = false;
        //     rows = gridObj.getRows();
        //     gridObj.rowSelected = rowSelected;

        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', rows[4].querySelectorAll('.e-rowcell')[0], 10, 220);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[5].querySelectorAll('.e-rowcell')[0], 30, 350);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousemove', mousemove);
        //     mousemove = setMouseCordinates(mousemove, 200, 355);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = rows[5].querySelectorAll('.e-rowcell')[0];
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousemove', mousemove);
        //     mousemove.currentTarget = gridObj.getContent();
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.getContent();
        //     mousemove = setMouseCordinates(mousemove, 210, 450);
        //     EventHandler.trigger(<any>gridObj.getContent(), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj.getContent());
        //     EventHandler.trigger(<any>(document.body), 'mouseup', mouseup);
        // });

        afterAll(() => {
            destroy(gridObj);
            destroy(gridObj1);
        });
    });

});
