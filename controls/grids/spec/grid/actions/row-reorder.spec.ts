/**
 * Grid Row Reordering spec document
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Sort } from '../../../src/grid/actions/sort';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { RowDD } from '../../../src/grid/actions/row-reorder';
import { data, employeeData, filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { Group } from '../../../src/grid/actions/group';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { RowDropEventArgs } from '../../../src/grid/base/interface';

Grid.Inject(Page, Sort, Selection, RowDD, Group, Aggregate, VirtualScroll);

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
        const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
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
        Grid.Inject(RowDD);
        gridObj.selectRows([3, 4, 5]);
        rows = gridObj.getRows();
        
        // let mouseDown: any = getEventObject('MouseEvents', 'mousedown', rows[4].firstChild, 50, 195);
        // EventHandler.trigger(gridObj.getContent() as HTMLElement, 'mousedown', mouseDown);

        // let mousemove: any = getEventObject('MouseEvents', 'mousemove', rows[5].firstChild, 80, 218);
        // EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        // mousemove.srcElement = mousemove.target = mousemove.toElement = document.querySelector('#Grid1');
        // EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        // mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.getContent().querySelectorAll('tr')[0];
        // EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        // let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj.getContent().querySelectorAll('tr')[0], 30, 200);
        // EventHandler.trigger(<any>(document), 'mouseup', mouseup);
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
        gridObj = gridObj1 = actionComplete = actionComplete1 = null;
    });
});



describe('Row Drag and Drop module', () => {
    describe('Reorder row functionalities', () => {
        let gridObj: Grid;
        let gridObj1: Grid;
        let actionComplete: (e?: Object) => void;
        let actionComplete1: (e?: Object) => void;
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
            gridObj = gridObj1 = actionComplete = actionComplete1 = null;
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
        let actionComplete: (e?: Object) => void;
        let actionComplete1: (e?: Object) => void;
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

        it('memory leak', () => {     
            profile.sample();
            let average: any = inMB(profile.averageChange)
            //Check average change in memory samples to not be over 10MB
            expect(average).toBeLessThan(10);
            let memory: any = inMB(getMemoryProfile())
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
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
            gridObj = gridObj1 = actionComplete = actionComplete1 = null;
        });
    });

    describe('Reorder row functionalities within grid', () => {
        let gridObj: Grid;
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
                }, done);
        });

        // it('Trigger drag and drop helper', () => {
        //     gridObj.selectRow(3);
        //     let target: any = (<any>gridObj).getRows()[0].querySelector('td').firstElementChild;
        //     let sender: object = {};
        //     let eve: any = { sender: { target } };
        //     helperElement = (<any>gridObj).rowDragAndDropModule.helper(eve);
        //     dragTarget = eve;
        //     expect(eve.sender.target.classList.contains('e-icon-rowdragicon')).toBe(true);
        // });

        // it('Trigger the rowDrag event', () => {
        //     (<any>gridObj).rowDragAndDropModule.dragStart((dragTarget as any).sender);
        // });
    
    // it('Trigger the rowDrag event', () => {    
    //     let targetRow: any = (<any>gridObj).getRows()[0].querySelector('td').firstElementChild;
    //     let rows:any = gridObj.getRows();
    //     let mousemove: any = getEventObject('MouseEvents', 'mousemove',
    //         rows[3].firstChild, (<HTMLElement>rows[3].firstChild).offsetLeft + 20, (<HTMLElement>rows[5].firstChild).offsetTop + 20);
    //     let e: any = { target: targetRow, element: gridObj.getContent(), name: 'drag', event: mousemove };
    //     (<any>gridObj).rowDragAndDropModule.drag(e);
    // });
    
    // it('Trigger the dragStop event', () => {    
    //     let rows:any = gridObj.getRows();
    //     let mouseDown: any = getEventObject('MouseEvents', 'mousedown', rows[1].firstChild, (<HTMLElement>rows[1].firstChild).offsetLeft + 20, (<HTMLElement>rows[4].firstChild).offsetTop + 20);
    //     let e: any = { element: gridObj.getContent(), name: 'dragStop', helper:helperElement, event:mouseDown };
    //     (<any>gridObj).rowDragAndDropModule.dragStop(e);
    // });
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
    })

    describe('EJ2-36585 => AllowRowDragAndDrop on property changing', () => {
        let gridObj: Grid;
        window['browserDetails'].isIE = false;
        let actionComplete: (e?: any) => void;
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
                }, done);
        });
   
        it('disabling rowDrag and drop', (done: Function) => {
            actionComplete = (args: any): any => {
                expect(gridObj.element.getElementsByClassName('e-rowdragheader').length).toBe(0);
                expect(gridObj.element.getElementsByClassName('e-rowdragdrop').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowRowDragAndDrop = false;
        });
        it('enabling rowDrag and drop', (done: Function) => {
            actionComplete = (args: any): any => {
                expect(gridObj.element.getElementsByClassName('e-rowdragheader').length).toBe(1);
                expect(gridObj.element.getElementsByClassName('e-rowdragdrop').length).toBe(gridObj.currentViewData.length);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowRowDragAndDrop = true;
        });
    
    afterAll(() => {
        destroy(gridObj);
        gridObj = actionComplete = null;
    });
    })
    
    describe('EJ2-38600-SetCellValue-IsNot-Work-RowDD-Grid-to-Grid', () => {
        let gridObj: Grid;
        let gridObj1: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowRowDragAndDrop: true,
                    rowDropSettings: { targetID: '#Grid' },
                    allowSelection: true,
                    columns: [{ field: 'OrderID', isPrimaryKey:true, }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight', format: 'c2' },
                    { field: 'OrderDate', format: 'yMd' }],
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                }, done);    
        });
        beforeAll((done: Function) => {
            gridObj1 = createGrid(
                {
                    dataSource: [],
                    allowRowDragAndDrop: true,
                    rowDropSettings: { targetID: 'Grid' },
                    allowSelection: true,
                    selectionSettings: { type: 'Multiple', mode: 'Row' },
                    columns: [{ field: 'OrderID', isPrimaryKey:true, }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight', format: 'c2' },
                    { field: 'OrderDate', format: 'yMd' }],
                    allowPaging: true
                }, done);
        });
         
        it('set drop target ID', () => {
                gridObj.setCellValue(10248, 'CustomerID', 'JHON');
                expect(gridObj.getContent().querySelector('tbody').children[0].children[1].innerHTML).toEqual('JHON');
                gridObj.setCellValue(10249, 'Freight', 7);
                expect(gridObj.getContent().querySelector('tbody').children[1].children[3].innerHTML).toEqual('$7.00'); 
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = gridObj1 = null;
        });
    })

    describe('EJ2-42009- Row Drag&Drop with Frozen columns', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 2),
                    allowRowDragAndDrop: true,
                    frozenColumns: 1,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 130, textAlign: 'Left' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'ShipCity', headerText: 'Ship City', width: 130, textAlign: 'Left' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 }
                    ]
                }, done);
        });

        it('Check the Grid content', () => {
            expect(gridObj.getRows().length).toBe(2);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    })

    describe('EJ2-55353 - ActionComplete event is not triggered after row reorder is performed ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowRowDragAndDrop: true,
                    frozenColumns: 1,
                    selectionSettings: { type: 'Multiple' },
                    rowDropSettings: { targetID: undefined },
                    height: 400,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerName', headerText: 'Customer Name', width: 130, textAlign: 'Left' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                    ],
                    actionComplete: actionComplete
                }, done);
        });

        it('set drop target ID', () => {
            gridObj.rowDropSettings.targetID = gridObj.element.id;
            gridObj.dataBind();
        });

   
        it('reorderRows and check the actionComplete event', (done: Function) => {
            gridObj.selectRow(1);
            actionComplete = (args?: any): void => {
                if (args.requestType === 'rowdraganddrop') {
                    done();
                } 
            };
            gridObj.actionComplete = actionComplete;
            gridObj.reorderRows(gridObj.getSelectedRowIndexes(), gridObj.getSelectedRowIndexes()[0] - 1);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('virtualscroll Grouped Row Reorder functionalities', () => {
        let gridObj: Grid;
        let rowDrop: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowRowDragAndDrop: true,
                    enableVirtualization: true,
                    allowGrouping: true,
                    selectionSettings: { type: 'Multiple' },
                    groupSettings: { columns: ['CustomerID']},
                    height: 400,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ],
                    aggregates: [{
                        columns: [
                            {
                                type: 'Sum',
                                field: 'Freight',
                                format: 'C2',
                                groupFooterTemplate: 'Sum : ${Sum}'
                            },
                            {
                                type: 'Average',
                                field: 'Freight',
                                format: 'C2',
                                groupCaptionTemplate: 'Average: ${Average}'
                            }
                        ]
                    }],
                    rowDrop: rowDrop
                }, done);
        });

        it('check group caption and summary before reorder', () => {
            const captionRow: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupcaptionrow .e-groupcaption');
            const captionSummary: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupcaptionrow .e-summarycell.e-templatecell');
            const groupFooterRow: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupfooterrow.e-summaryrow .e-summarycell.e-templatecell');
            expect(captionRow[0].innerHTML).toBe('Customer ID: CENTC - 1 item');
            expect(captionSummary[0].innerHTML).toBe('Average: $3.25');
            expect(groupFooterRow[0].innerHTML).toBe('Sum : $3.25');
            expect(captionRow[1].innerHTML).toBe('Customer ID: CHOPS - 1 item');
            expect(captionSummary[1].innerHTML).toBe('Average: $22.98');
            expect(groupFooterRow[1].innerHTML).toBe('Sum : $22.98');
            expect(captionRow[2].innerHTML).toBe('Customer ID: ERNSH - 1 item');
            // expect(captionSummary[2].innerHTML).toBe('Average: $140.51');
            // expect(groupFooterRow[2].innerHTML).toBe('Sum : $140.51');
        });

        it('drag and drop row action', (done: Function) => {
            const dragRowElem: Element = gridObj.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = gridObj.getRowByIndex(2);
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.children[2].getBoundingClientRect();
            rowDrop = (args?: any): void => {
                args.dropIndex = 2;
                done();
            };
            gridObj.rowDrop = rowDrop;
            (gridObj.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj.rowDragAndDropModule as any).helper({
                target: gridObj.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                dragElement: dropClone,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj.rowDragAndDropModule as any).drag({
                target: dropRowElem.children[2],
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem.children[2] }
            });
            (gridObj.rowDragAndDropModule as any).dragStop({
                target: dropRowElem.children[2],
                element: gridObj.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem.children[2] }
            });
        });

        it('check group caption and summary after reorder', () => {
            const captionRow: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupcaptionrow .e-groupcaption');
            const captionSummary: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupcaptionrow .e-summarycell.e-templatecell');
            const groupFooterRow: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupfooterrow.e-summaryrow .e-summarycell.e-templatecell');
            expect(captionRow[0].innerHTML).toBe('Customer ID: CHOPS - 1 item');
            expect(captionSummary[0].innerHTML).toBe('Average: $22.98');
            expect(groupFooterRow[0].innerHTML).toBe('Sum : $22.98');
            expect(captionRow[1].innerHTML).toBe('Customer ID: ERNSH - 2 items');
            // expect(captionSummary[1].innerHTML).toBe('Average: $71.88');
            // expect(groupFooterRow[1].innerHTML).toBe('Sum : $143.76');
        });

        it('for coverage drag and drop row action', () => {
            const dragRowElem: Element = gridObj.getRowByIndex(2).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = gridObj.getRowByIndex(1);
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.children[2].getBoundingClientRect();
            gridObj.rowDrop = rowDrop;
            (gridObj.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj.rowDragAndDropModule as any).helper({
                target: gridObj.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                dragElement: dropClone,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj.rowDragAndDropModule as any).drag({
                target: dropRowElem.children[2],
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem.children[2] }
            });
            (gridObj.rowDragAndDropModule as any).dragStop({
                target: dropRowElem.children[2],
                element: gridObj.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem.children[2] }
            });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            rowDrop = null;
        });
    });

    describe('Grouped Row Reorder functionalities', () => {
        let gridObj: Grid;
        let rowDrop: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowRowDragAndDrop: true,
                    allowGrouping: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    groupSettings: { columns: ['CustomerID']},
                    height: 400,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ],
                    aggregates: [{
                        columns: [
                            {
                                type: 'Sum',
                                field: 'Freight',
                                format: 'C2',
                                groupFooterTemplate: 'Sum : ${Sum}'
                            },
                            {
                                type: 'Average',
                                field: 'Freight',
                                format: 'C2',
                                groupCaptionTemplate: 'Average: ${Average}'
                            }
                        ]
                    }],
                    rowDrop: rowDrop
                }, done);
        });

        it('check group caption and summary before reorder', () => {
            const captionRow: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupcaptionrow .e-groupcaption');
            const captionSummary: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupcaptionrow .e-summarycell.e-templatecell');
            const groupFooterRow: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupfooterrow.e-summaryrow .e-summarycell.e-templatecell');
            expect(captionRow[0].innerHTML).toBe('Customer ID: CENTC - 1 item');
            expect(captionSummary[0].innerHTML).toBe('Average: $3.25');
            expect(groupFooterRow[0].innerHTML).toBe('Sum : $3.25');
            expect(captionRow[1].innerHTML).toBe('Customer ID: CHOPS - 1 item');
            expect(captionSummary[1].innerHTML).toBe('Average: $22.98');
            expect(groupFooterRow[1].innerHTML).toBe('Sum : $22.98');
            expect(captionRow[2].innerHTML).toBe('Customer ID: ERNSH - 1 item');
            // expect(captionSummary[2].innerHTML).toBe('Average: $140.51');
            // expect(groupFooterRow[2].innerHTML).toBe('Sum : $140.51');
        });

        it('drag and drop row action', (done: Function) => {
            const dragRowElem: Element = gridObj.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = gridObj.getRowByIndex(2);
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.children[2].getBoundingClientRect();
            rowDrop = (args?: any): void => {
                args.dropIndex = 2;
                done();
            };
            gridObj.rowDrop = rowDrop;
            (gridObj.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj.rowDragAndDropModule as any).helper({
                target: gridObj.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj.rowDragAndDropModule as any).drag({
                target: dropRowElem.children[2],
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem.children[2] }
            });
            (gridObj.rowDragAndDropModule as any).dragStop({
                target: dropRowElem.children[2],
                element: gridObj.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem.children[2] }
            });
        });

        it('check group caption and summary after reorder', () => {
            const captionRow: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupcaptionrow .e-groupcaption');
            const captionSummary: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupcaptionrow .e-summarycell.e-templatecell');
            const groupFooterRow: NodeListOf<Element> = gridObj.getContentTable().querySelectorAll('.e-groupfooterrow.e-summaryrow .e-summarycell.e-templatecell');
            expect(captionRow[0].innerHTML).toBe('Customer ID: CHOPS - 1 item');
            expect(captionSummary[0].innerHTML).toBe('Average: $22.98');
            expect(groupFooterRow[0].innerHTML).toBe('Sum : $22.98');
            expect(captionRow[1].innerHTML).toBe('Customer ID: ERNSH - 2 items');
            // expect(captionSummary[1].innerHTML).toBe('Average: $71.88');
            // expect(groupFooterRow[1].innerHTML).toBe('Sum : $143.76');
        });

        it ('for coverage', () => {
            //for coverage for helper and dragstop
            
            expect(gridObj.rowDropSettings.targetID).toBe(undefined);
            const dragRowElem: Element = gridObj.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            gridObj.rowDropSettings.targetID = 'coverage';
            (gridObj.rowDragAndDropModule as any).helper({
                target: gridObj.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            gridObj.selectionSettings.type = 'Single';
            (gridObj.rowDragAndDropModule as any).helper({
                target: gridObj.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            dragRowElem.classList.add('e-rowcell');
            (gridObj.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj.rowDragAndDropModule as any).helper({
                target: gridObj.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropRowElem: Element = gridObj.getContentTable().querySelector('tr');
            dropRowElem.classList.add('e-rowcell');
            const dropClient: any = dropRowElem.getBoundingClientRect();
            const dropClone: HTMLElement = gridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: gridObj.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
        });

        it('for coverage drag and drop row action', () => {
            gridObj.rowDropSettings.targetID = undefined;
            const dragRowElem: Element = gridObj.getRowByIndex(5).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = gridObj.getRowByIndex(0);
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.children[2].getBoundingClientRect();
            (gridObj.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj.rowDragAndDropModule as any).helper({
                target: gridObj.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj.rowDragAndDropModule as any).drag({
                target: dropRowElem.children[2],
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem.children[2] }
            });
            (gridObj.rowDragAndDropModule as any).dragStop({
                target: dropRowElem.children[2],
                element: gridObj.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem.children[2] }
            });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            rowDrop = null;
        });
    });

    describe('Code Coverage - Grouped Row Reorder functionalities without group caption', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 5),
                    allowRowDragAndDrop: true,
                    allowGrouping: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    groupSettings: { columns: ['CustomerID']},
                    height: 'auto',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ]
                }, done);
        });

        it('for coverage drag and drop row action', () => {
            expect(gridObj.rowDropSettings.targetID).toBe(undefined);
            const dragRowElem: Element = gridObj.getRowByIndex(2).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = gridObj.getRowByIndex(4);
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.getBoundingClientRect();
            (gridObj.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj.rowDragAndDropModule as any).helper({
                target: gridObj.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (gridObj.rowDragAndDropModule as any).dragStop({
                target: dropRowElem.children[2],
                element: gridObj.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem.children[2] }
            });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Code Coverage - drag and drop selected rows within grid with data', () => {
        let gridObj1: Grid;
        beforeAll((done: Function) => {
            gridObj1 = createGrid(
                {
                    dataSource: data,
                    allowRowDragAndDrop: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ]
                }, done);
        });

        it('coverage improvement single grid with data drag and drop - 1', () => {
            expect(gridObj1.rowDropSettings.targetID).toBe(undefined);
            const dragRowElem: Element = gridObj1.getRowByIndex(2).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = gridObj1.getRowByIndex(1).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.getBoundingClientRect();
            gridObj1.selectRow(2);
            dragRowElem.classList.add('e-rowcell');
            (gridObj1.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj1.rowDragAndDropModule as any).helper({
                target: gridObj1.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj1.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: gridObj1.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
        });

        it('coverage improvement single grid with data drag and drop - 2', () => {
            expect(gridObj1.rowDropSettings.targetID).toBe(undefined);
            const dragRowElem: Element = gridObj1.getRowByIndex(11).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            let dropRowElem: Element = gridObj1.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dragClient: any = dragRowElem.getBoundingClientRect();
            let dropClient: any = dropRowElem.getBoundingClientRect();
            gridObj1.selectRow(11);
            dragRowElem.classList.add('e-rowcell');
            (gridObj1.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj1.rowDragAndDropModule as any).helper({
                target: gridObj1.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            let dropClone: HTMLElement = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj1.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: gridObj1.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });

            // for coverage
                
            dropRowElem = gridObj1.getRowByIndex(0);
            dropClient = dropRowElem.getBoundingClientRect();
            (gridObj1.rowDragAndDropModule as any).helper({
                target: gridObj1.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            dropClone = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj1.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            gridObj1.rowDropSettings.targetID = gridObj1.element.id;
            dropRowElem.children[0].classList.add('e-content');
            (gridObj1.rowDragAndDropModule as any).drag({
                target: dropRowElem.children[2],
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            gridObj1.rowDropSettings.targetID = undefined;
            dropRowElem.children[0].classList.remove('e-content');
        });

        it('coverage improvement single grid with data drag and drop - 3', () => {
            expect(gridObj1.rowDropSettings.targetID).toBe(undefined);
            const dragRowElem: Element = gridObj1.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element =
            gridObj1.getRowByIndex(11).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.getBoundingClientRect();
            gridObj1.selectRow(0);
            dragRowElem.classList.add('e-rowcell');
            (gridObj1.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj1.rowDragAndDropModule as any).helper({
                target: gridObj1.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            let dropClone: HTMLElement = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj1.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: gridObj1.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });

            // for coverage
            gridObj1.rowDropSettings.targetID = undefined;
            gridObj1.selectionSettings.type = 'Multiple';
            gridObj1.selectRows([0, 1]);
            // gridObj1.rowDragAndDropModule.dragTarget = dragRowElem;
            dropClone = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            dropClone.querySelector('td').classList.add('e-selectionbackground');
            document.getElementById('captiontemplate').querySelector('div').classList.add('e-dlg-overlay');
            (gridObj1.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: gridObj1.getContentTable(),
                helper: dropClone,
                event: { clientX: 10, clientY: 10, target: undefined }
            });
            document.getElementById('captiontemplate').querySelector('div').classList.remove('e-dlg-overlay');
            (gridObj1.rowDragAndDropModule as any).helper({
                target: gridObj1.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            gridObj1.rowDropSettings.targetID = gridObj1.element.id;
            (gridObj1.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
        });

        afterAll(() => {
            destroy(gridObj1);
            gridObj1 = null;
        });
    });

    describe('Code Coverage - drag and drop selected rows outside of grid without data', () => {
        let gridObj1: Grid;
        let gridObj2: Grid;
        beforeAll((done: Function) => {
            gridObj1 = createGrid(
                {
                    dataSource: data,
                    allowRowDragAndDrop: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    width: '49%',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ]
                }, done);
        });
        beforeAll((done: Function) => {
            gridObj2 = createGrid(
                {
                    dataSource: [],
                    allowRowDragAndDrop: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    width: '49%',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ]
                }, done);
        });

        it('coverage improvement 2nd grid empty data', () => {
            gridObj1.element.style.display = 'inline-block';
            gridObj2.element.style.display = 'inline-block';
            expect(gridObj1.rowDropSettings.targetID).toBe(undefined);
            expect((gridObj2.dataSource as Object[]).length).toBe(0);
            gridObj1.rowDropSettings.targetID = gridObj2.element.id;
            const dragRowElem: Element = gridObj1.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = gridObj2.getContentTable().querySelector('tr');
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.getBoundingClientRect();
            gridObj1.selectRow(0);
            dragRowElem.classList.add('e-rowcell');
            (gridObj1.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj1.rowDragAndDropModule as any).helper({
                target: gridObj1.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj1.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: gridObj2.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });

            // for coverage reorderrow(), dragstart(), drag() and dragStop()
            (gridObj1.rowDragAndDropModule as any).reorderRow();
            (gridObj1.rowDragAndDropModule as any).rowData = {0:{}};
            (gridObj1.rowDragAndDropModule as any).startedRow.cells[0].classList.remove('e-selectionbackground');
            (gridObj1.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            gridObj1.rowDropSettings.targetID = gridObj1.element.id;
            gridObj1.selectRows([0, 1]);
            (gridObj1.rowDragAndDropModule as any).drag({
                target: undefined,
                event: { clientX: 1, clientY: 1, target: undefined }
            });
            dropClone.classList.add('e-dlg-overlay');
            dropRowElem.classList.add('e-dlg-overlay');
            (gridObj1.rowDragAndDropModule as any).dragStartData = {0:{}};
            gridObj1.selectRows([0, 1]);
            gridObj1.rowDropSettings.targetID = undefined;
            (gridObj1.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: gridObj2.getContentTable(),
                helper: dropClone,
                event: { clientX: 1, clientY: 1, target: dropRowElem }
            });

            // for coverage refreshRowTarget() and getScrollWidth()

            (gridObj1.rowDragAndDropModule as any).getScrollWidth();
            const args: RowDropEventArgs = { fromIndex: 0, dropIndex: 0, target: dragRowElem.children[0] };
            (gridObj1.rowDragAndDropModule as any).refreshRowTarget(args);
            gridObj1.element.style.width = '400px';
            (gridObj1.rowDragAndDropModule as any).getScrollWidth();

        });

        afterAll(() => {
            destroy(gridObj1);
            gridObj1 = null;
            destroy(gridObj2);
            gridObj2 = null;
        });
    });

    describe('Code Coverage - multiple selected rows drag and drop outside of grid without data', () => {
        let gridObj1: Grid;
        let gridObj2: Grid;
        beforeAll((done: Function) => {
            gridObj1 = createGrid(
                {
                    dataSource: data,
                    allowRowDragAndDrop: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    width: '49%',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ]
                }, done);
        });
        beforeAll((done: Function) => {
            gridObj2 = createGrid(
                {
                    dataSource: [],
                    allowRowDragAndDrop: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    width: '49%',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ]
                }, done);
        });

        it('coverage improvement 2nd grid empty data', () => {
            gridObj1.element.style.display = 'inline-block';
            gridObj2.element.style.display = 'inline-block';
            expect(gridObj1.rowDropSettings.targetID).toBe(undefined);
            expect((gridObj2.dataSource as Object[]).length).toBe(0);
            gridObj1.rowDropSettings.targetID = gridObj2.element.id;
            const dragRowElem: Element = gridObj1.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = gridObj2.getContentTable().querySelector('tr');
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.getBoundingClientRect();
            gridObj1.selectRows([0, 1]);
            dragRowElem.classList.add('e-rowcell');
            (gridObj1.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj1.rowDragAndDropModule as any).helper({
                target: gridObj1.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj1.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: gridObj2.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
        });

        afterAll(() => {
            destroy(gridObj1);
            gridObj1 = null;
            destroy(gridObj2);
            gridObj2 = null;
        });
    });

    describe('Code Coverage - drag and drop selected rows outside of grid with data', () => {
        let gridObj1: Grid;
        let gridObj2: Grid;
        beforeAll((done: Function) => {
            gridObj1 = createGrid(
                {
                    dataSource: data,
                    allowRowDragAndDrop: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    width: '49%',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ]
                }, done);
        });
        beforeAll((done: Function) => {
            gridObj2 = createGrid(
                {
                    dataSource: data.slice(9, 11),
                    allowRowDragAndDrop: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    width: '49%',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ]
                }, done);
        });

        it('coverage improvement 2nd grid with data', () => {
            gridObj1.element.style.display = 'inline-block';
            gridObj2.element.style.display = 'inline-block';
            expect(gridObj1.rowDropSettings.targetID).toBe(undefined);
            expect((gridObj2.dataSource as Object[]).length).toBe(2);
            gridObj1.rowDropSettings.targetID = gridObj2.element.id;
            const dragRowElem: Element = gridObj1.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = gridObj2.getRowByIndex(0);
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.getBoundingClientRect();
            gridObj1.selectRow(0);
            dragRowElem.classList.add('e-rowcell');
            (gridObj1.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj1.rowDragAndDropModule as any).helper({
                target: gridObj1.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj1.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: gridObj2.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
        });

        afterAll(() => {
            destroy(gridObj1);
            gridObj1 = null;
            destroy(gridObj2);
            gridObj2 = null;
        });
    });

    describe('Code Coverage - Hierarchy row drag and drop testing', () => {
        let gridObj: Grid;
        let childGrid: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowRowDragAndDrop: true,
                    allowPaging: true,
                    allowFiltering: true,
                    allowTextWrap: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 'auto',
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                        { field: 'FirstName', headerText: 'First Name', textAlign: 'Left', width: 100 },
                        { field: 'Title', headerText: 'Title', textAlign: 'Left', width: 120 },
                        { field: 'City', headerText: 'City', textAlign: 'Left', width: 100 },
                        { field: 'Country', headerText: 'Country', textAlign: 'Left', width: 100 }
                    ],
                    childGrid: {
                        dataSource: filterData,
                        queryString: 'EmployeeID',
                        allowRowDragAndDrop: true,
                        allowPaging: true,
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 75 },
                            { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 75 },
                            { field: 'ShipCity', headerText: 'Ship City', textAlign: 'Left', width: 100 },
                            { field: 'Freight', headerText: 'Freight', textAlign: 'Left', width: 120 },
                            { field: 'ShipName', headerText: 'Ship Name', textAlign: 'Left', width: 100 }
                        ]
                    },
                }, done);
        });


        it('row expand testing - 1', (done: Function) => {
            let detailDataBound = (e: any) => {
                childGrid = e.childGrid;
                gridObj.detailDataBound = null;
                done();
            }
            gridObj.detailDataBound = detailDataBound;
            (gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse') as HTMLElement).click();
        });

        it('coverage child grid row drag and drop', () => {
            expect(childGrid.rowDropSettings.targetID).toBe(undefined);
            const dragRowElem: Element = childGrid.getRowByIndex(2).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = childGrid.getRowByIndex(1).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.getBoundingClientRect();
            childGrid.selectRow(2);
            dragRowElem.classList.add('e-rowcell');
            (childGrid.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (childGrid.rowDragAndDropModule as any).helper({
                target: childGrid.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = childGrid.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (childGrid.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem },
                dragElement: dragRowElem
            });
            childGrid.rowDropSettings.targetID = childGrid.element.id;
            (childGrid.rowDragAndDropModule as any).drag({
                target: childGrid.getRowByIndex(0),
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (childGrid.rowDragAndDropModule as any).drag({
                target: dragRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (childGrid.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (childGrid.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: childGrid.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
        });

        it('for coverage - 1 - coverage child grid focus', () => {
            const header = childGrid.getHeaderContent().querySelector('.e-headercell');
            childGrid.enableHeaderFocus = true;
            (childGrid.focusModule as any).onFocus({target: header});
            (childGrid.focusModule as any).onKeyPress({ action: 'shiftTab', preventDefault: function () { }, target: header });
            (childGrid.focusModule as any).onKeyPress({ action: 'shiftTab', preventDefault: function() {}, target: childGrid.element } as any);
        });
    
        it('for coverage - 2 - coverage pager focus', () => {
            const pagerItems = (gridObj.pagerModule as any).element.querySelectorAll('.e-numericitem');
            gridObj.pagerModule.pagerObj.element.tabIndex = 0;
            pagerItems[0].click();
            (gridObj.focusModule as any).onFocus({target: pagerItems[0]});
            (gridObj.focusModule as any).onKeyPress({ action: 'tab', preventDefault: function () { }, target: pagerItems[0], keyCode: 9 });
            (gridObj.focusModule as any).onKeyPress({ action: 'tab', preventDefault: function () { }, target: pagerItems[1], keyCode: 9 });
            (gridObj.focusModule as any).onKeyPress({ action: 'shiftTab', preventDefault: function () { }, target: pagerItems[1], keyCode: 9, shiftKey: true });
            (gridObj.focusModule as any).onKeyPress({ action: 'shiftTab', preventDefault: function () { }, target: pagerItems[0], keyCode: 9, shiftKey: true });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            destroy(childGrid);
            childGrid = null;
        });
    });

    describe('Code Coverage - freeze row drag and drop', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    frozenRows: 2,
                    frozenColumns: 2,
                    allowSorting: true,
                    allowRowDragAndDrop: true,
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' }]
                }, done);
        });

        it('for coverage set target id', () => {
            expect(gridObj.rowDropSettings.targetID).toBe(undefined);
            gridObj.rowDropSettings.targetID = gridObj.element.id;
        });

        it('for coverage', () => {
            const dragRowElem: Element = gridObj.getRowByIndex(5).querySelectorAll('.e-rowcell')[1];
            const dropRowElem: Element = gridObj.getRowByIndex(3).querySelectorAll('.e-rowcell')[1];
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.getBoundingClientRect();
            gridObj.selectRow(5);
            (gridObj.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj.rowDragAndDropModule as any).helper({
                target: gridObj.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem },
                dragElement: dragRowElem
            });
            (gridObj.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            dropClone.querySelector('tr').setAttribute('single-dragrow', 'true');
            (gridObj.rowDragAndDropModule as any).columnDrop({ target: dropRowElem, droppedElement: dropClone });
            dropClone.querySelector('tr').removeAttribute('single-dragrow');
            (gridObj.rowDragAndDropModule as any).columnDrop({ target: dropRowElem, droppedElement: dropClone });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    // used for code coverage
    describe('Execute methods', () => {
        let gridObj: Grid;
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
                }, done);
        });

        it('hide the rowdd cell', (done) => {
            gridObj.disableRowDD(true);
            expect(1).toBe(1);
            done();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    })

    describe('EJ2-847896 - DataSource not updated when row drag and drop performed in-between grids', () => {
        let gridObj1: Grid;
        let gridObj2: Grid;
        let dataBound: () => void;
        beforeAll((done: Function) => {
            gridObj1 = createGrid(
                {
                    dataSource: data.slice(0, 5),
                    allowRowDragAndDrop: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    width: '49%',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ],
                    dataBound: dataBound,
                }, done);
        });
        beforeAll((done: Function) => {
            gridObj2 = createGrid(
                {
                    dataSource: [],
                    allowRowDragAndDrop: true,
                    allowPaging: true,
                    selectionSettings: { type: 'Multiple' },
                    height: 400,
                    width: '49%',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', isPrimaryKey: true, width: 80, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 130, textAlign: 'Left' },
                        { field: 'Freight', headerText: 'Freight', width: 130, format: 'C2', textAlign: 'Right' },
                        { field: 'OrderDate', headerText: 'Order Date', width: 120, format: 'yMd', textAlign: 'Right' }
                    ]
                }, done);
        });

        it('coverage improvement 2nd grid empty data', (done: Function) => {
            dataBound = (): void => {
                expect((gridObj1.dataSource as Object[]).length).toBe(4);
                done();
            };
            gridObj1.dataBound = dataBound;
            gridObj1.element.style.display = 'inline-block';
            gridObj2.element.style.display = 'inline-block';
            expect(gridObj1.rowDropSettings.targetID).toBe(undefined);
            expect((gridObj2.dataSource as Object[]).length).toBe(0);
            gridObj1.rowDropSettings.targetID = gridObj2.element.id;
            const dragRowElem: Element = gridObj1.getRowByIndex(0).querySelector('.e-rowdragdrop.e-rowdragdropcell');
            const dropRowElem: Element = gridObj2.getContentTable().querySelector('tr');
            const dragClient: any = dragRowElem.getBoundingClientRect();
            const dropClient: any = dropRowElem.getBoundingClientRect();
            gridObj1.selectRow(0);
            dragRowElem.classList.add('e-rowcell');
            (gridObj1.rowDragAndDropModule as any).draggable.currentStateTarget = dragRowElem;
            (gridObj1.rowDragAndDropModule as any).helper({
                target: gridObj1.getContentTable().querySelector('tr'),
                sender: { clientX: 10, clientY: 10, target: dragRowElem }
            });
            const dropClone: HTMLElement = gridObj1.element.querySelector('.e-cloneproperties.e-draganddrop.e-grid.e-dragclone');
            (gridObj1.rowDragAndDropModule as any).dragStart({
                target: dragRowElem,
                event: { clientX: dragClient.x, clientY: dragClient.y, target: dragRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).drag({
                target: dropRowElem,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (gridObj1.rowDragAndDropModule as any).dragStop({
                target: dropRowElem,
                element: gridObj2.getContentTable(),
                helper: dropClone,
                event: { clientX: dropClient.x, clientY: dropClient.y, target: dropRowElem }
            });
            (gridObj2.rowDragAndDropModule as any).columnDrop({ target: dropRowElem, droppedElement: dropClone });
        });

        afterAll(() => {
            destroy(gridObj1);
            gridObj1 = dataBound = null;
            destroy(gridObj2);
            gridObj2 = null;
        });
    });

    describe('EJ2-867031: Empty grid message does not display correctly when drag and drop is enabled', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    allowRowDragAndDrop: true,
                    height: 100,
                    columns: [
                        { headerText: '#', field: 'OrderID', width: 10 },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });
        it('Check colspan when no records to display', () => {
            expect(parseInt((gridObj.getContentTable().querySelector('.e-emptyrow').firstChild as HTMLElement).getAttribute('colspan'), 10)).toBe(3);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});
