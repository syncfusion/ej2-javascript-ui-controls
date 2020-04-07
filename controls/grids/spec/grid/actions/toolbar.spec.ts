/**
 * Grid toolbar spec document
 */
import { EventHandler } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Group } from '../../../src/grid/actions/group';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { data } from '../base/datasource.spec';
import { ToolbarItem } from '../../../src/grid/base/enum';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Page, Group, Selection, Toolbar);

function getEventObject(eventType: string, eventName: string): Object {
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = extend({}, tempEvent);
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('Toolbar functionalities', () => {
    let gridObj: Grid;
    let actionBegin: (e?: Object) => void;
    let actionComplete: (e?: Object) => void;
    let keyup: any = getEventObject('KeyboardEvent', 'keyup');
    keyup.keyCode = 13;

    beforeAll((done: Function) => {
        const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
        gridObj = createGrid(
            {
                dataSource: data,
                allowGrouping: true,
                width: "400px",
                columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                { field: 'ShipCity' }],
                toolbar: ['Print', 'Edit', { text: 'hello', id: 'hello' }, 'expand', ToolbarItem.Add] as any,
                actionBegin: actionBegin,
                actionComplete: actionComplete,
            }, done);
    });
    it('initial checck', () => {
        expect(gridObj.toolbarModule.getToolbar().firstElementChild.querySelector('.e-hscroll-content').childElementCount).toBe(5);
        expect(gridObj.toolbarModule.getToolbar().firstElementChild.querySelectorAll('.e-toolbar-item')[4].getAttribute('title')).toBe('Add');
        expect(gridObj.element.firstElementChild.classList.contains('e-groupdroparea')).toBeTruthy();
    });
    // it('check event trigger', (done: Function) => {
    //     gridObj.toolbarClick = (args: Object) => {
    //         expect(args['target']['id']).toBe('');
    //         done();
    //     };
    //     (<any>gridObj.toolbarModule).toolbarClickHandler({ target: gridObj.toolbarModule.getToolbar().firstElementChild.children[2].firstChild });
    // });
    it('enable Rtl', () => {
        gridObj.toolbarClick = undefined;
        gridObj.enableRtl = true;
        gridObj.dataBind();
        gridObj.toolbarModule.getToolbar()['ej2_instances'][0].dataBind();
        expect(gridObj.toolbarModule.getToolbar()['ej2_instances'][0]['enableRtl']).toBeTruthy();
        expect(gridObj.toolbarModule.getToolbar().classList.contains('e-rtl')).toBeTruthy();
    });
    it('disable Rtl', () => {
        gridObj.enableRtl = false;
        gridObj.dataBind();
        gridObj.toolbarModule.getToolbar()['ej2_instances'][0].dataBind();
        expect(gridObj.toolbarModule.getToolbar()['ej2_instances'][0]['enableRtl']).toBeFalsy();
        expect(gridObj.toolbarModule.getToolbar().classList.contains('e-rtl')).toBeFalsy();
    });
    it('change toolbar value', () => {
        gridObj.toolbar = ['Search', 'Add', 'Update', 'Cancel', 'hi'];
        gridObj.dataBind();
        expect(gridObj.toolbarModule.getToolbar().querySelector('.e-toolbar-left').children.length).toBe(4);
        expect(gridObj.toolbarModule.getToolbar().querySelector('.e-toolbar-right').children.length).toBe(1);
        //expect(gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay').length).toBe(2);
    });
    it('check aria-attribute', () => {
        let search: Element = gridObj.toolbarModule.getToolbar().querySelector('.e-search');
        expect(search.querySelector('.e-search-icon').hasAttribute('tabindex')).toBeTruthy();
        expect(search.querySelector('.e-search-icon').hasAttribute('aria-label')).toBeTruthy();
    });
    it('Enable Toolbar items', () => {
        gridObj.toolbarModule.enableItems(['Grid_update'], true);
        gridObj.dataBind();
        //expect(gridObj.toolbarModule.getToolbar().querySelectorAll('.e-overlay').length).toBe(1);
    });
    it('remove toolbar', () => {
        gridObj.toolbar = undefined;
        gridObj.dataBind();
        expect(gridObj.toolbarModule).toBe(undefined);
    });
    it('render all predefined items', () => {
        gridObj.toolbar = ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Print', 'ExcelExport', 'PdfExport', 'WordExport', 'Search', 'CsvExport'];
        gridObj.dataBind();
        expect(gridObj.toolbarModule.getToolbar().querySelectorAll('.e-toolbar-item').length).toBe(11);
        //expect(gridObj.toolbarModule.toolbar.items[9].align).toBe('left');
    });

    it('check search', (done: Function) => {
        gridObj.actionComplete = () => {
            expect(gridObj.currentViewData.length).toBe(0);
            expect(gridObj.searchSettings.key).toBe('hai');
            done();
        };
        let searchElement: HTMLInputElement = <HTMLInputElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_searchbar');
        (searchElement).value = 'hai';
        (<HTMLInputElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_searchbar')).focus();
        expect(document.activeElement.id).toBe(gridObj.element.id + '_searchbar');
        keyup.target = searchElement;
        EventHandler.trigger(searchElement, 'keyup', keyup);
    });
    it('check search with searchbutton', (done: Function) => {
        gridObj.actionComplete = () => {
            expect(gridObj.currentViewData.length).toBe(15);
            expect(gridObj.searchSettings.key).toBe('');
            done();
        };
        let searchElement: HTMLInputElement = <HTMLInputElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_searchbar');
        searchElement.value = '';
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: (<any>gridObj.toolbarModule).toolbar.items[9], originalEvent: { target: document.getElementById(gridObj.element.id + '_searchbutton') } });
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: (<any>gridObj.toolbarModule).toolbar.items[9], originalEvent: { target: searchElement } });
    });

    it('check print', (done: Function) => {
        gridObj.printComplete = () => {
            done();
        };
        gridObj.beforePrint = (args: { element: Element }) => {
            expect((args.element.querySelector('.e-toolbar') as HTMLElement)).toBe(null);
        };
        (<HTMLElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_print')).click();
        //forcoverage
        (<any>gridObj.toolbarModule).toolbarClickHandler({ target: (<any>gridObj.toolbarModule).element });
        (gridObj.toolbarModule as any).keyUpHandler({ keyCode: 12 });

        keyup.target = gridObj.toolbarModule.getToolbar();
        EventHandler.trigger(gridObj.toolbarModule.getToolbar() as HTMLElement, 'keyup', keyup);
        (<any>gridObj.toolbarModule).removeEventListener();
        (<any>gridObj.toolbarModule).unWireEvent();
        gridObj.isDestroyed = true;
        (<any>gridObj.toolbarModule).addEventListener();
        (<any>gridObj.toolbarModule).removeEventListener();
        gridObj.isDestroyed = false;
        (<any>gridObj.toolbarModule).onPropertyChanged({ module: 'Grouping' });
    });

    it('for coverage', () => {
        gridObj.selectRow(1, true);
        gridObj.selectRow(1, true);
        gridObj.selectCell({ cellIndex: 0, rowIndex: 0 }, true);
        gridObj.selectCell({ cellIndex: 0, rowIndex: 0 }, true);
        (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: '' } });
        (<any>gridObj.toolbarModule).getItem({text: 'add'});
        (<any>gridObj.toolbarModule).toolbar.isDestroyed = true;
        (<any>gridObj.toolbarModule).destroy();
        gridObj.isDestroyed = true;
        (<any>gridObj.toolbarModule).destroy();
        gridObj.isDestroyed = false;
        expect(1).toBe(1);
    });

    afterAll(() => {
        destroy(gridObj);
    });

    describe('Toolbar functionalities', () => {
        let gridObj: Grid;
        let actionBegin: (e?: Object) => void;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            let templete: string = '<div><div style="padding: 12px" title="search" ><input id="txt" type="search" style="padding: 0 5px"placeholder="search"></input><span id="searchbutton" class="e-search e-icons"></span></div></div>';
            document.body.appendChild(createElement('div', { innerHTML: templete, id: 'search' }));
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowGrouping: true,
                    width: "400px",
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    toolbarTemplate: '#search',
                    actionBegin: actionBegin,
                    actionComplete: actionComplete,
                }, done);
        });

        it('add toolbar template', () => {
            expect(gridObj.toolbarModule.getToolbar().id).toBe('search');
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
            gridObj = actionBegin = actionComplete = keyup = null;
        });

    });

    describe('EJ2-36447 Searching actionBegin , cancel is not working', () => {
        let gridObj: Grid;
        let actionBegin: (args?: Object) => void;
        let actionComplete: (args?: Object) => void;
        let count: number = 0;
        let keyup: any = getEventObject('KeyboardEvent', 'keyup');
        keyup.keyCode = 13;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    allowSorting: true,
                    clipMode: 'EllipsisWithTooltip',
                    pageSettings: { pageCount: 5, pageSize: 10 },
                    toolbar: [ 'Search'],
                    columns: [
                        { field: 'OrderID',headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 140 },
                        { field: 'Freight', headerText: 'Freight', textAlign: 'Right', width: 120, format: 'C2' },
                        { field: 'Freight1', headerText: 'Percentage', format: 'P', width: 170, textAlign: 'Right' }
                        ], 
                    actionBegin: actionBegin,
                
                }, done);
        });
        it('Check the search args', (done: Function) => {
            actionBegin = (args: any): void => {
                args.cancel = true;
                count = count + 1;
                done();
            }
            gridObj.actionBegin = actionBegin;
            let searchElement: HTMLInputElement = <HTMLInputElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_searchbar');
            (searchElement).value = '98';
            (<HTMLInputElement>gridObj.toolbarModule.getToolbar().querySelector('#' + gridObj.element.id + '_searchbar')).focus();
            keyup.target = searchElement;
            EventHandler.trigger(searchElement, 'keyup', keyup);
            expect(count).toBe(1);  
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = count = actionComplete = null;
        });
    });

});
