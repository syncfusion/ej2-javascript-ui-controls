/**
 * Grid Grouping spec document
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { DataManager } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { ReturnType } from '../../../src/grid/base/type';
import { Sort } from '../../../src/grid/actions/sort';
import { Selection } from '../../../src/grid/actions/selection';
import { Filter } from '../../../src/grid/actions/filter';
import { Page } from '../../../src/grid/actions/page';
import { Group } from '../../../src/grid/actions/group';
import { Reorder } from '../../../src/grid/actions/reorder';
import { filterData } from '../base/datasource.spec';
import { createGrid, destroy, getClickObj, getKeyActionObj } from '../base/specutil.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Render } from '../../../src/grid/renderer/render';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Sort, Page, Filter, Group, Selection, Reorder);


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

describe('Grouping module => ', () => {


    describe('Grouping functionalites => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSelection: true,
                    groupSettings: { showGroupedColumn: true },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('group drop area testing', () => {
            let dropArea: any = gridObj.element.querySelectorAll('.e-groupdroparea');
            expect(dropArea.length).toBe(1);
            expect(dropArea[0].textContent).toBe('Drag a column header here to group its column');
        });

        it('Single column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                let content = gridObj.getContent().querySelectorAll('tr');
                let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                expect(grpHIndent.length).toBe(1);
                expect(grpHIndent[0].querySelector('.e-headercelldiv').classList.contains('e-emptycell')).toBeTruthy();
                expect(content[0].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect(content[0].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[0].querySelectorAll('.e-groupcaption').length).toBe(1);
                expect(content[0].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('6');
                expect(content[0].querySelectorAll('.e-groupcaption')[0].textContent).toBe('Ship City: Albuquerque - 5 items');

                expect(content[1].querySelectorAll('.e-indentcell').length).toBe(1);

                expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(6);

                expect(gHeader.length).toBe(1);
                expect(gHeader[0].querySelectorAll('.e-grouptext').length).toBe(1);
                expect(gHeader[0].querySelectorAll('.e-grouptext')[0].textContent).toBe('Ship City');
                expect(gHeader[0].querySelectorAll('.e-groupsort').length).toBe(1);
                expect(gHeader[0].querySelectorAll('.e-groupsort')[0].classList.contains('e-ascending')).toBeTruthy();
                expect(gHeader[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);

                expect(gridObj.groupSettings.columns.length).toBe(1);
                expect(gridObj.sortSettings.columns.length).toBe(1);


                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCity');
        });

        it('Expandcollase row shortcut testing', () => {
            gridObj.selectRow(1, true);
            (<any>gridObj.groupModule).keyPressHandler(getKeyActionObj('altUpArrow'));
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(13);
            (<any>gridObj.groupModule).keyPressHandler(getKeyActionObj('altUpArrow'));
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(13);
            (<any>gridObj.groupModule).keyPressHandler(getKeyActionObj('altDownArrow'));
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(18);
            (<any>gridObj.groupModule).keyPressHandler(getKeyActionObj('altDownArrow'));
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(18);
        });

        it('Expandcollase row - selection disable testing', () => {
            gridObj.allowSelection = false;
            gridObj.dataBind();
            (<any>gridObj.groupModule).keyPressHandler(getKeyActionObj('altUpArrow'));
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(18);
            gridObj.allowSelection = true;
            gridObj.dataBind();
        });

        it('multi column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(2);
                expect(gridObj.sortSettings.columns.length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCountry');
        });

        it('multiple column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                let content = gridObj.getContent().querySelectorAll('tr');
                let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                expect(grpHIndent.length).toBe(3);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(3);
                expect(content[0].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect((content[0].querySelectorAll('.e-recordplusexpand')[0] as HTMLTableCellElement).cellIndex).toBe(0);
                expect(content[0].querySelectorAll('.e-indentcell').length).toBe(0);
                expect(content[0].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[1].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect((content[1].querySelectorAll('.e-recordplusexpand')[0] as HTMLTableCellElement).cellIndex).toBe(1);
                expect(content[1].querySelectorAll('.e-indentcell').length).toBe(1);
                expect(content[1].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[2].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect((content[2].querySelectorAll('.e-recordplusexpand')[0] as HTMLTableCellElement).cellIndex).toBe(2);
                expect(content[2].querySelectorAll('.e-indentcell').length).toBe(2);
                expect(content[2].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[0].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('8');
                expect(content[1].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('7');
                expect(content[2].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('6');

                expect(content[0].querySelectorAll('.e-groupcaption').length).toBe(1);
                expect(content[1].querySelectorAll('.e-groupcaption').length).toBe(1);
                expect(content[2].querySelectorAll('.e-groupcaption').length).toBe(1);

                expect(content[0].querySelectorAll('.e-groupcaption')[0].textContent).toBe('Ship City: Albuquerque - 1 item');
                expect(content[1].querySelectorAll('.e-groupcaption')[0].textContent).toBe('Ship Country: USA - 1 item');
                expect(content[2].querySelectorAll('.e-groupcaption')[0].textContent).toBe('CustomerID: RATTC - 5 items');

                expect(content[3].querySelectorAll('.e-indentcell').length).toBe(3);

                expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(18);

                expect(gHeader.length).toBe(3);

                expect(gridObj.groupSettings.columns.length).toBe(3);
                expect(gridObj.sortSettings.columns.length).toBe(3);

                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('CustomerID');
        });


        it('ungroup testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                let content = gridObj.getContent().querySelectorAll('tr');
                let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                expect(grpHIndent.length).toBe(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(2);
                expect(content[0].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect((content[0].querySelectorAll('.e-recordplusexpand')[0] as HTMLTableCellElement).cellIndex).toBe(0);
                expect(content[0].querySelectorAll('.e-indentcell').length).toBe(0);
                expect(content[0].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[1].querySelectorAll('.e-recordplusexpand').length).toBe(1);
                expect((content[1].querySelectorAll('.e-recordplusexpand')[0] as HTMLTableCellElement).cellIndex).toBe(1);
                expect(content[1].querySelectorAll('.e-indentcell').length).toBe(1);
                expect(content[1].querySelectorAll('.e-recordplusexpand'
                )[0].firstElementChild.classList.contains('e-gdiagonaldown')).toBeTruthy();

                expect(content[0].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('7');
                expect(content[1].querySelectorAll('.e-groupcaption')[0].getAttribute('colspan')).toBe('6');

                expect(content[0].querySelectorAll('.e-groupcaption').length).toBe(1);
                expect(content[1].querySelectorAll('.e-groupcaption').length).toBe(1);

                expect(content[0].querySelectorAll('.e-groupcaption')[0].textContent).toBe('Ship City: Albuquerque - 1 item');
                expect(content[1].querySelectorAll('.e-groupcaption')[0].textContent).toBe('CustomerID: RATTC - 5 items');

                expect(content[2].querySelectorAll('.e-indentcell').length).toBe(2);

                expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(12);

                expect(gHeader.length).toBe(2);

                expect(gridObj.groupSettings.columns.length).toBe(2);
                expect(gridObj.sortSettings.columns.length).toBe(2);

                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ShipCountry');
        });

        it('Sort column with sorting disabled testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-descending').length).toBe(0);
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-ascending').length).toBe(2);
                expect(gridObj.sortSettings.columns[0].direction).toBe('Ascending');
                expect(gridObj.sortSettings.columns[1].direction).toBe('Ascending');
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getColumnHeaderByField('ShipCity').querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            let grpHCell = gridObj.element.querySelectorAll('.e-groupheadercell');
            (gridObj.groupModule as any).clickHandler(getClickObj(grpHCell[0]));
            (gridObj.groupModule as any).clickHandler(getClickObj(grpHCell[1]));
            gridObj.allowSorting = true;
            gridObj.dataBind();

        });

        it('Sort column with sorting enable testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-descending').length).toBe(1);
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.sortSettings.columns[1].direction).toBe('Descending');
                expect(gridObj.getColumnHeaderByField('ShipCity').querySelectorAll('.e-descending').length).toBe(1);
                done();
            };
            let grpHCell = gridObj.element.querySelectorAll('.e-groupheadercell');
            gridObj.actionComplete = actionComplete;
            (gridObj.groupModule as any).clickHandler(getClickObj(grpHCell[0]));
        });

        it('Sort column with sorting enable testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-descending').length).toBe(2);
                expect(gridObj.element.querySelector('.e-groupdroparea').querySelectorAll('.e-ascending').length).toBe(0);
                expect(gridObj.sortSettings.columns[1].direction).toBe('Descending');
                expect(gridObj.getColumnHeaderByField('CustomerID').querySelectorAll('.e-descending').length).toBe(1);
                done();
            };
            let grpHCell = gridObj.element.querySelectorAll('.e-groupheadercell');
            gridObj.actionComplete = actionComplete;
            (gridObj.groupModule as any).clickHandler(getClickObj(grpHCell[1]));
        });

        it('ungroup from button click testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                expect(grpHIndent.length).toBe(1);
                expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(8);
                expect(gHeader.length).toBe(1);
                expect(gridObj.groupSettings.columns.length).toBe(1);
                expect(gridObj.sortSettings.columns.length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            (gridObj.groupModule as any).clickHandler(getClickObj(gridObj.element.getElementsByClassName('e-groupheadercell')[0].querySelector('.e-ungroupbutton')));
        });

        // it('ungroup from drag and drop testing', (done: Function) => {
        //     actionComplete = (args?: Object): void => {
        //         let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
        //         let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
        //         expect(grpHIndent.length).toBe(0);
        //         expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(0);
        //         expect(gHeader.length).toBe(0);
        //         expect(gridObj.groupSettings.columns.length).toBe(0);
        //         expect(gridObj.sortSettings.columns.length).toBe(2);
        //         done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     let gHeaders = gridObj.element.querySelectorAll('.e-groupheadercell');
        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', gHeaders[0], 10, 10);
        //     EventHandler.trigger(gridObj.element.querySelector('.e-groupdroparea') as HTMLElement, 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', gHeaders[0]);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-cloneproperties');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.getContent().querySelectorAll('.e-rowcell')[1];
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj.getContent().querySelectorAll('.e-rowcell')[1], 198, 198);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        // });

        // it('group from drag and drop testing', (done: Function) => {
        //     actionComplete = (args?: Object): void => {
        //         let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
        //         let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
        //         expect(grpHIndent.length).toBe(1);
        //         expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(8);
        //         expect(gHeader.length).toBe(1);
        //         expect(gridObj.groupSettings.columns.length).toBe(1);
        //         expect(gridObj.sortSettings.columns.length).toBe(2);
        //         done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     let gHeaders = gridObj.element.querySelectorAll('.e-groupheadercell');
        //     let headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');

        //     let mousedown: any = getEventObject('MouseEvents', 'mousedown', headers[1].querySelector('.e-headercelldiv'), 20, 40);
        //     EventHandler.trigger(gridObj.getHeaderContent().querySelector('.e-columnheader') as HTMLElement, 'mousedown', mousedown);

        //     let mousemove: any = getEventObject('MouseEvents', 'mousemove', headers[1]);
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-cloneproperties');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);
        //     mousemove.srcElement = mousemove.target = mousemove.toElement = gridObj.element.querySelector('.e-groupdroparea');
        //     EventHandler.trigger(<any>(document), 'mousemove', mousemove);

        //     let mouseup: any = getEventObject('MouseEvents', 'mouseup', gridObj.element.querySelector('.e-groupdroparea'), 10, 13);
        //     EventHandler.trigger(<any>(document), 'mouseup', mouseup);
        // });

        it('collapseAll method testing', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            gridObj.groupModule.collapseAll();
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(8);
        });

        it('expandAll method testing', () => {
            gridObj.groupModule.expandAll();
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(20);
        });

        it('collapseAll shortcut testing', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            (<any>gridObj.groupModule).keyPressHandler(getKeyActionObj('ctrlUpArrow'));
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(8);
        });

        it('expandAll shortcut testing', () => {
            (<any>gridObj.groupModule).keyPressHandler(getKeyActionObj('ctrlDownArrow'));
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(20);
        });

        it('multi column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(2);
                expect(gridObj.sortSettings.columns.length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCity');
        });

        it('expandcollapse rows method testing', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(28);
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(27);
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(28);
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(30);
            gridObj.groupModule.expandCollapseRows(expandElem[2]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(27);
            gridObj.groupModule.expandCollapseRows(expandElem[2]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(30);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Grouping columns hide => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSorting: true,
                    groupSettings: { showGroupedColumn: false },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('Single column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(1);
                expect(gridObj.sortSettings.columns.length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-headercell:not(.e-hide)').length).toBe(5);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('ShipCity');
        });

        it('Single column ungroup testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(0);
                expect(gridObj.sortSettings.columns.length).toBe(0);
                expect(gridObj.element.querySelectorAll('.e-headercell:not(.e-hide)').length).toBe(6);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('ShipCity');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Grouping set model test case and reorder => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSorting: true,
                    allowPaging: true,
                    allowReordering: true,
                    groupSettings: { showDropArea: false, showToggleButton: true, showUngroupButton: true },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });
        it('check default group property rendering', () => {
            expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(gridObj.columns.length);
        });
        it('disable Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(0);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowGrouping = false;
            gridObj.dataBind();
        });
        it('enable Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(gridObj.columns.length);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowGrouping = true;
            gridObj.dataBind();
        });
        it('group a column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn.e-toggleungroup').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('EmployeeID');
        });
        it('reOrder the grouped column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn.e-toggleungroup').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell')[5].children[0].innerHTML).toMatch('Employee ID');
                expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.reorderColumns('EmployeeID', 'ShipCountry');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });

    });


    describe('Group settings apis => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSorting: true,
                    groupSettings: { showToggleButton: true, showGroupedColumn: true },
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('sort after group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            let headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            (gridObj.groupModule as any).clickHandler(getClickObj(headers[0].querySelector('.e-grptogglebtn')));
        });

        it('group from toogle header testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.sortSettings.columns.length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('CustomerID', 'Ascending', false);
        });

        it('hide drop area', () => {
            gridObj.groupSettings.showDropArea = false;
            gridObj.dataBind();
            expect((gridObj.element.querySelectorAll('.e-groupdroparea')[0] as HTMLElement).style.display).toBe('none');
        });

        it('show drop area', () => {
            gridObj.groupSettings.showDropArea = true;
            gridObj.dataBind();
            expect((gridObj.element.querySelectorAll('.e-groupdroparea')[0] as HTMLElement).style.display).toBe('')
        });

        it('hide group toggle button', () => {
            gridObj.groupSettings.showToggleButton = false;
            gridObj.dataBind();
            expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(0);
        });

        it('show group toggle button', () => {
            gridObj.groupSettings.showToggleButton = true;
            gridObj.dataBind();
            expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(gridObj.columns.length);
        });

        it('hide ungroup button', () => {
            gridObj.groupSettings.showUngroupButton = false;
            gridObj.dataBind();
            expect((gridObj.element.querySelectorAll('.e-groupdroparea')[0].
                querySelectorAll('.e-ungroupbutton')[0] as HTMLElement).style.display).toBe('none');
        });

        it('show ungroup button', () => {
            gridObj.groupSettings.showUngroupButton = true;
            gridObj.dataBind();
            expect((gridObj.element.querySelectorAll('.e-groupdroparea')[0].
                querySelectorAll('.e-ungroupbutton')[0] as HTMLElement).style.display).toBe('');
        });

        it('ungroup from toogele header testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                expect(gridObj.groupSettings.columns.length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            let headers = gridObj.getHeaderContent().querySelectorAll('.e-headercell');
            (gridObj.groupModule as any).clickHandler(getClickObj(headers[0].querySelector('.e-grptogglebtn')));
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Stacked header with grouping => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData, allowPaging: false,
                    columns: [
                        {
                            headerText: 'Order Details', toolTip: 'Order Details',
                            columns: [{ field: 'OrderID', headerText: 'Order ID' },
                            { field: 'OrderDate', headerText: 'Order Date', format: { skeleton: 'yMd', type: 'date' }, type: 'date' }]
                        },
                        { field: 'CustomerID', headerText: 'Customer ID' },
                        { field: 'EmployeeID', headerText: 'Employee ID' },
                        {
                            headerText: 'Ship Details',
                            columns: [
                                { field: 'ShipCity', headerText: 'Ship City' },
                                { field: 'ShipCountry', headerText: 'Ship Country' },
                                {
                                    headerText: 'Ship Name Verified', columns: [{ field: 'ShipName', headerText: 'Ship Name' },
                                    { field: 'Verified', headerText: 'Verified' }]
                                },
                            ],
                        }
                    ],
                    allowGrouping: true,
                    allowSorting: true,
                }, done);
        });

        it('group a column', (done: Function) => {
            let actionComplete = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(3);
                done();
            };
            gridObj.groupModule.groupColumn('EmployeeID');
            gridObj.actionComplete = actionComplete;
        });
        it('sort a column', (done: Function) => {
            let actionComplete = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(3);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('OrderDate', 'Ascending');
        });
        it('ungroup a column', (done: Function) => {
            let actionComplete = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('EmployeeID');
        });
        it('clear sort', (done: Function) => {
            let actionComplete = (args: Object) => {
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Grouping set model test case and reorder => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    allowSorting: true,
                    allowPaging: true,
                    allowReordering: true,
                    groupSettings: { showDropArea: false, showToggleButton: true, showUngroupButton: true },
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });
        it('check default group property rendering', () => {
            expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
            expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(gridObj.columns.length);
        });
        it('disable Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(0);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowGrouping = false;
            gridObj.dataBind();
        });
        it('enable Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn').length).toBe(gridObj.columns.length);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.allowGrouping = true;
            gridObj.dataBind();
        });
        it('group a column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn.e-toggleungroup').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('EmployeeID');
        });
        it('reOrder the grouped column', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.getHeaderTable().querySelectorAll('.e-grptogglebtn.e-toggleungroup').length).toBe(1);
                expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);
                expect(gridObj.getHeaderTable().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-headercell')[5].children[0].innerHTML).toMatch('Employee ID');
                expect(gridObj.getContent().querySelectorAll('.e-row').length).toBe(12);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.reorderColumns('EmployeeID', 'ShipCountry');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });

    });
    //initial render with grouping
    describe('Grouping a column in default =>', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID'] },
                    allowSorting: true,
                    allowPaging: true,
                    allowFiltering: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });
        it('check default group property rendering', () => {
            expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(2);
            expect(gridObj.getContent().querySelectorAll('.e-indentcell').length > 0).toBeTruthy()
            expect(gridObj.getContent().querySelectorAll('.e-rowcell')[0].innerHTML).toBe('10258');
            expect(gridObj.groupSettings.columns.length).toBe(1);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });
    //initial render with two columns grouped. 
    describe('Grouping two columns initial => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID', 'ShipCity'] },
                    allowSorting: true,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });
        it('check default group property rendering', () => {
            expect(gridObj.element.querySelectorAll('.e-groupdroparea').length).toBe(1);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].children.length).toBe(2);
            expect(gridObj.element.querySelectorAll('.e-groupdroparea')[0].querySelectorAll('.e-ungroupbutton').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(2);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell').length).toBe(2);
            expect(gridObj.getContentTable().querySelectorAll('.e-indentcell').length > 0).toBeTruthy();
            expect(gridObj.groupSettings.columns.length).toBe(2);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });

    });

    // initially grouping and sort same column
    describe('Grouping and sorting same column and aria => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { columns: ['EmployeeID'] },
                    sortSettings: { columns: [{ field: 'EmployeeID', direction: 'Ascending' }] },
                    allowSorting: true,
                    allowPaging: true,
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });
        it('initial render testing', () => {
            expect(gridObj.groupSettings.columns.length).toBe(gridObj.sortSettings.columns.length);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-sortnumber').length).toBe(0);
            expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
        });
        it('check aria attribute', () => {
            let groupDropArea: Element = gridObj.element.querySelector('.e-groupdroparea');
            expect(groupDropArea.querySelector('.e-grouptext').hasAttribute('tabindex')).toBeTruthy();
            expect(groupDropArea.querySelector('.e-groupsort').hasAttribute('tabindex')).toBeTruthy();
            expect(groupDropArea.querySelector('.e-ungroupbutton').hasAttribute('tabindex')).toBeTruthy();
            expect(groupDropArea.querySelector('.e-grouptext').hasAttribute('aria-label')).toBeTruthy();
            expect(groupDropArea.querySelector('.e-groupsort').hasAttribute('aria-label')).toBeTruthy();
            expect(groupDropArea.querySelector('.e-ungroupbutton').hasAttribute('aria-label')).toBeTruthy();
            expect(gridObj.element.querySelector('.e-recordplusexpand').hasAttribute('tabindex')).toBeTruthy();
        });
        it('clear Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.sortSettings.columns.length).toBe(1);
                expect(gridObj.groupSettings.columns.length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                expect(gridObj.getContent().querySelectorAll('tr').length).toBe(12);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('EmployeeID');
        });
        it('clear sorting', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.sortSettings.columns.length).toBe(0);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(0);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearSorting();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });

    });

    describe('Grouping remote data => ', () => {
        let gridObj: Grid;
        let old: (e: ReturnType) => Promise<Object> = Render.prototype.validateGroupRecords;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            gridObj = createGrid(
                {
                    dataSource: new DataManager({ url: '/api/test' }),
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'OrderDate', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { disablePageWiseAggregates: true, columns: ['EmployeeID', 'CustomerID'] },
                    allowPaging: true
                }, done);
            let first: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
            first.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify({ d: { results: filterData, __count: 100 } })
            });

            Render.prototype.validateGroupRecords = (e: ReturnType) => {
                let promise: Promise<Object> = old.call(gridObj.renderModule, e);
                let first: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
                first.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({ d: { results: filterData, __count: 100 } })
                });
                return promise;
            };
        });
        it('check data', () => {
            expect(gridObj.groupSettings.columns.length).not.toBeNull();
        });
        afterAll(() => {
            Render.prototype.validateGroupRecords = old;
            destroy(gridObj);
            jasmine.Ajax.uninstall();
            gridObj = old = null;
        });
    });

    describe('Grouping column by format using setmodel => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'OrderDate', headerText: 'Order Date', format: 'y', enableGroupByFormat: true, type: 'date' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    // groupSettings: { disablePageWiseAggregates: true, columns: ['OrderDate', 'ShipCountry'] },
                    allowPaging: true,
                    allowSorting: true
                }, done);
        });
        it('Single column group testing', (done: Function) => {
            actionComplete = (args?: Object): void => {
                let grpHIndent = gridObj.getHeaderContent().querySelectorAll('.e-grouptopleftcell');
                let content = gridObj.getContent().querySelectorAll('tr');
                let gHeader = gridObj.element.querySelectorAll('.e-groupheadercell');
                expect(grpHIndent.length).toBe(1);

                expect(content[0].querySelectorAll('.e-groupcaption').length).toBe(1);

                expect(gHeader.length).toBe(1);
                expect(gHeader[0].querySelectorAll('.e-grouptext').length).toBe(1);
                expect(gHeader[0].querySelectorAll('.e-grouptext')[0].textContent).toBe('Order Date');
                expect(gHeader[0].querySelectorAll('.e-groupsort').length).toBe(1);
                expect(gHeader[0].querySelectorAll('.e-groupsort')[0].classList.contains('e-ascending')).toBeTruthy();
                expect(gHeader[0].querySelectorAll('.e-ungroupbutton').length).toBe(1);

                expect(gridObj.groupSettings.columns.length).toBe(1);
                expect(gridObj.sortSettings.columns.length).toBe(1);


                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('OrderDate');
        });
        it('multi grouping with group by format', (done: Function) => {
            let actionComplete: any = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupcaption')[0].innerHTML.indexOf('Order Date: 1996 ') > -1).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.groupColumn('EmployeeID');

        });
        it('sort a column with multi grouping', (done: Function) => {
            let actionComplete: any = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupcaption')[0].innerHTML.indexOf('Order Date: 1996 ') > -1).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(3);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.sortColumn('OrderID', 'Ascending');
        });
        it('ungroup a column', (done: Function) => {
            let actionComplete: any = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupcaption')[0].innerHTML.indexOf('Order Date: 1996 ') > -1).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(1);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('EmployeeID');
        });
        it('clear Grouping', (done: Function) => {
            actionComplete = () => {
                expect(gridObj.groupSettings.columns.length).toBe(0);
                expect(gridObj.getContent().querySelectorAll('tr').length).toBe(12);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(1);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('OrderDate');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('Grouping remote data for group by format => ', () => {
        let gridObj: Grid;
        let old: (e: ReturnType) => Promise<Object> = Render.prototype.validateGroupRecords;
        beforeAll((done: Function) => {
            jasmine.Ajax.install();
            gridObj = createGrid(
                {
                    dataSource: new DataManager({ url: '/api/test' }),
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'OrderDate', headerText: 'Order Date', format: 'y', enableGroupByFormat: true, type: 'date' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { disablePageWiseAggregates: true, columns: ['OrderDate', 'CustomerID'] },
                    allowPaging: true
                }, done);
            let first: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
            first.respondWith({
                'status': 200,
                'contentType': 'application/json',
                'responseText': JSON.stringify({ d: { results: filterData, __count: 100 } })
            });

            Render.prototype.validateGroupRecords = (e: ReturnType) => {
                let promise: Promise<Object> = old.call(gridObj.renderModule, e);
                let first: JasmineAjaxRequest = jasmine.Ajax.requests.at(1);
                first.respondWith({
                    'status': 200,
                    'contentType': 'application/json',
                    'responseText': JSON.stringify({ d: { results: filterData, __count: 100 } })
                });
                return promise;
            };
        });
        it('check data', () => {
            expect(gridObj.groupSettings.columns.length).not.toBeNull();
        });
        afterAll(() => {
            Render.prototype.validateGroupRecords = old;
            destroy(gridObj);
            jasmine.Ajax.uninstall();
            gridObj = old = null;
        });
    });
    describe('Grouping column by format at initial settings => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight', format: 'C1', enableGroupByFormat: true, type: 'number' },
                    { field: 'OrderDate', headerText: 'Order Date', format: 'y', enableGroupByFormat: true, type: 'date' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { disablePageWiseAggregates: true, columns: ['OrderDate', 'Freight'] },
                    allowPaging: true,
                    allowSorting: true
                }, done);
        });
        it('multi grouping with group by format at initial', (done: Function) => {
            let actionComplete: any = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupcaption')[0].getAttribute('aria-label').indexOf('Order Date: 1996 ') > -1).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(3);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(3);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(3);
                done();
            };
            gridObj.groupModule.groupColumn('EmployeeID');
            gridObj.getColumnByField('OrderDate').type = 'undefined';
            gridObj.dataSource[0].OrderDate = new Date('07 07 1996 00:00:23');
            gridObj.actionComplete = actionComplete;
            gridObj.dataBind();
        });
        it('sort a column with multi grouping', (done: Function) => {
            let actionComplete: any = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupcaption')[0].getAttribute('aria-label').indexOf('Order Date: 1996 ') > -1).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(3);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(4);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(3);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.getColumnByField('OrderDate').type = 'undefined';
            gridObj.dataSource[0].OrderDate = new Date('07 07 1996 00:01:23');
            gridObj.sortColumn('OrderID', 'Ascending');
            gridObj.dataBind();
        });
        it('ungroup a column', (done: Function) => {
            let actionComplete: any = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(2);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(3);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(2);
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.groupModule.ungroupColumn('EmployeeID');
            gridObj.getColumnByField('OrderDate').type = 'undefined';
            gridObj.dataSource[0].OrderDate = new Date('07 07 1996 00:00:20');
            gridObj.dataBind();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('Grouping column by format at initial settings without column type declaration => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight', format: 'C1', enableGroupByFormat: true },
                    { field: 'OrderDate', headerText: 'Order Date', format: 'y', enableGroupByFormat: true },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { disablePageWiseAggregates: true, columns: ['OrderDate', 'Freight'] },
                    allowPaging: true,
                    allowSorting: true
                }, done);
        });
        it('multi grouping with group by format at initial', (done: Function) => {
            let actionComplete: any = (args: Object) => {
                expect(gridObj.element.querySelectorAll('.e-groupcaption')[0].getAttribute('aria-label').indexOf('Order Date: 1996 ') > -1).toBeTruthy();
                expect(gridObj.element.querySelectorAll('.e-groupheadercell').length).toBe(3);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-ascending').length).toBe(3);
                expect(gridObj.getHeaderContent().querySelectorAll('.e-emptycell').length).toBe(3);
                done();
            };
            gridObj.groupModule.groupColumn('EmployeeID');
            gridObj.actionComplete = actionComplete;
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Grouping disablePageWiseAggregates with empty datasource => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'OrderDate', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: { disablePageWiseAggregates: true, columns: ['OrderDate', 'ShipCountry'] },
                    allowPaging: true
                }, done);
        });
        it('check data length', () => {
            expect(gridObj.currentViewData.length).toBe(0);
        });
        it('EJ2-7165-complex data group', () => {
            expect((<any>gridObj.groupModule).getGHeaderCell('Name.FirstName')).toBeNull();
        });
        afterAll((done) => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('EJ2-6791-Groped content not renders properly , when grouping enabled throw set model => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowSorting: true,
                    allowPaging: true,
                    allowReordering: true,
                    actionComplete: actionComplete
                }, done);
        });
        it('Grouping enabled throw set model', () => {
            gridObj.allowGrouping = true;
            gridObj.groupSettings.columns = ['EmployeeID'];
            let actionComplete: any = (args: Object) => {
                expect(gridObj.getContent().querySelectorAll('.e-recordplusexpand').length).toBe(7);
            };
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('Grouping functionalites with empty grid => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' },
                    { field: 'ShipCountry', headerText: 'Ship Country' }],
                    allowGrouping: true,
                    groupSettings: {columns:['OrderID']}
                }, done);
        });

        it('group drop area - header present testing', (done: Function) => {
            //Since no event for group complete on init, used set timeout
            setTimeout(function(){
                let dropArea: any = gridObj.element.querySelectorAll('.e-groupdroparea');
                expect(dropArea.length).toBe(1);
                let headerCell = dropArea[0].querySelectorAll('.e-groupheadercell')
                expect(headerCell.length).toBe(1);
                done();
            }, 100);            
        });
        it('group drop area - ungroup column', (done) => {
            gridObj.actionComplete = function (args) {
                if (args.requestType === 'ungrouping') {
                    expect(gridObj.groupSettings.columns.length).toBe(0);
                    let dropArea: any = gridObj.element.querySelectorAll('.e-groupdroparea');
                    let headerCell = dropArea[0].querySelectorAll('.e-groupheadercell')
                    expect(headerCell.length).toBe(0);
                    done();
                }
            }
            gridObj.ungroupColumn('OrderID')
        });

        it('group drop area - group column', (done) => {
            gridObj.actionComplete = function (args) {
                if (args.requestType === 'grouping') {
                    expect(gridObj.groupSettings.columns.length).toBe(1);
                    let dropArea: any = gridObj.element.querySelectorAll('.e-groupdroparea');
                    let headerCell = dropArea[0].querySelectorAll('.e-groupheadercell')
                    expect(headerCell.length).toBe(1);
                    done();
                }
            }
            gridObj.groupColumn('OrderID')
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
            gridObj = null;
        });
    });

    describe('EJ2-23852-Data row not renders properly , when grouping the all columns in grid => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    groupSettings: { showGroupedColumn: true, columns: ['OrderID', 'CustomerID', 'EmployeeID', 'Freight'] },
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' }],
                    allowSorting: true,
                    allowPaging: true,
                    allowGrouping: true
                }, done);
        });
        it('Check whether data row is rendered while we grouping all columns in grid', () => {
            expect(gridObj.element.querySelector('.e-row').querySelector('.e-rowcell').classList.contains('e-hide')).toBeFalsy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Group with disable pageWise aggregate', () => {
        let grid: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    allowGrouping: true,
                    groupSettings: { disablePageWiseAggregates: true },
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
                    }],
                    actionComplete: actionComplete
                },
                done
            );
        });
        
        it('checking aggreagates with grouping', (done: Function) => {
            let actionComplete: any =  function (args: any) {
                if (args.requestType === 'grouping') {
                    expect(grid.groupSettings.columns.length).toBe(1);
                done();
                }
            };
            grid.groupModule.groupColumn('Verified');
            grid.actionComplete = actionComplete;
        });

        afterAll(() => {
            destroy(grid);
            grid = actionComplete = null;
        });
    });
    //focus strategy script error
    // describe('expand and collapse on enter => ', () => {
    //     let gridObj: Grid;
    //     let actionBegin: () => void;
    //     let actionComplete: () => void;
    //     let columns: any;
    //     beforeAll((done: Function) => {
    //         gridObj = createGrid(
    //             {
    //                 dataSource: filterData,
    //                 columns: [{ field: 'OrderID', headerText: 'Order ID' },
    //                 { field: 'CustomerID', headerText: 'CustomerID' },
    //                 { field: 'EmployeeID', headerText: 'Employee ID' },
    //                 { field: 'Freight', headerText: 'Freight' },
    //                 { field: 'ShipCity', headerText: 'Ship City' },
    //                 { field: 'ShipCountry', headerText: 'Ship Country' }],
    //                 allowGrouping: true,
    //                 allowSelection: true,
    //                 groupSettings: { columns: ['OrderID'] },
    //                 allowPaging: true,
    //                 actionBegin: actionBegin,
    //                 actionComplete: actionComplete
    //             }, done);
    //     });

    //     it('collapse check', () => {
    //         gridObj.element.focus();
    //         gridObj.keyboardModule.keyAction(<any>{ action: 'enter', target: (<any>gridObj.contentModule.getTable()).rows[0].cells[0],
    //         preventDefault: () => {} });
    //     });
    //     it('expand check', () => {
    //         gridObj.keyboardModule.keyAction(<any>{ action: 'enter', target: (<any>gridObj.contentModule.getTable()).rows[0].cells[0],
    //         preventDefault: () => {} });
    //     });
    //     it('collapse check with edit', () => {
    //         gridObj.isEdit = true;
    //         gridObj.keyboardModule.keyAction(<any>{ action: 'enter', target: (<any>gridObj.contentModule.getTable()).rows[0].cells[0],
    //         preventDefault: () => {} });
    //         expect((<any>gridObj.contentModule.getTable()).rows[0].querySelector('.e-recordplusexpand')).not.toBeNull();
    //         gridObj.isEdit = false;
    //     });
    // afterAll((done) => {
    //     destroy(gridObj);
    //      setTimeout(function () {
    //          done();
    //      }, 1000);    
    //  });
    // });
     describe('EJ2-35816-Grouping with animation => ', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        let allowGroupReordering:string = 'allowGroupReordering';
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    groupSettings: { columns: ['OrderID', 'CustomerID'], allowReordering: true },
                    columns: [{ field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'CustomerID' },
                    { field: 'EmployeeID', headerText: 'Employee ID' },
                    { field: 'Freight', headerText: 'Freight' },
                    { field: 'ShipCity', headerText: 'Ship City' }],
                    allowSorting: true,
                    allowPaging: true,
                    allowGrouping: true,
                    actionComplete: actionComplete
                }, done);
        });
        it('Check whether grouped columns added in the droparea', (done) => {
            gridObj.actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-group-animator').length).toBe(3);
                expect(gridObj.element.querySelectorAll('.e-icon-drag').length).toBe(3);
                expect(gridObj.element.querySelectorAll('.e-group-animator .e-icon-next').length).toBe(3);
                done();
            }
            gridObj.groupColumn('EmployeeID');
        });
        it('Check whether ungroup is working', (done) => {
            gridObj.actionComplete = (args?: Object): void => {
                expect(gridObj.element.querySelectorAll('.e-group-animator').length).toBe(2);
                expect(gridObj.element.querySelectorAll('.e-icon-drag').length).toBe(2);
                expect(gridObj.element.querySelectorAll('.e-group-animator .e-icon-next').length).toBe(2);
                done();
            };
            gridObj.ungroupColumn('EmployeeID');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

});
