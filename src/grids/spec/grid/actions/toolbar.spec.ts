/**
 * Grid toolbar spec document
 */
import { EventHandler, select } from '@syncfusion/ej2-base';
import { extend } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Grid } from '../../../src/grid/base/grid';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Group } from '../../../src/grid/actions/group';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { data, filterData } from '../base/datasource.spec';
import { ToolbarItem } from '../../../src/grid/base/enum';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { Sort } from '../../../src/grid/actions/sort';

Grid.Inject(Page, Group, Selection, Toolbar, Sort);

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
    let preventDefault: Function = new Function();
    keyup.keyCode = 13;

    beforeAll((done: Function) => {
        const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                pending; //Skips test (in Chai)
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
    it('Check keyPressHandler by Tab and Shift Tab Action', () => {
        const focusableToolbarItems: NodeListOf<Element> = gridObj.toolbarModule.toolbar.element.querySelectorAll('.e-toolbar-item:not(.e-overlay):not(.e-hidden)');
        let args: any = { action: 'tab', preventDefault: preventDefault, target: focusableToolbarItems[0].querySelector('.e-btn')};
        (gridObj.toolbarModule as any).keyPressedHandler(args);
        expect(focusableToolbarItems[1].querySelector('.e-btn').getAttribute('tabindex')).toBe('0');
        args = { action: 'shiftTab', preventDefault: preventDefault, target: focusableToolbarItems[1].querySelector('.e-btn')};
        (gridObj.toolbarModule as any).keyPressedHandler(args);
        expect(focusableToolbarItems[0].querySelector('.e-btn').getAttribute('tabindex')).toBe('0');
    });

    it('check search', (done: Function) => {
        gridObj.actionComplete = () => {
            expect(gridObj.currentViewData.length).toBe(0);
            expect(gridObj.searchSettings.key).toBe('hai');
            done();
        };
        let searchElement: HTMLInputElement = select('#' + gridObj.element.id + '_searchbar', gridObj.toolbarModule.getToolbar());
        (searchElement).value = 'hai';
        (select('#' + gridObj.element.id + '_searchbar', gridObj.toolbarModule.getToolbar())).focus();
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
        let searchElement: HTMLInputElement = select('#' + gridObj.element.id + '_searchbar', gridObj.toolbarModule.getToolbar());
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
        select('#' + gridObj.element.id + '_print', gridObj.toolbarModule.getToolbar()).click();
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

    describe('EJ2-912751 - code coverage for memory leak issue with toolbarTemplate in angular', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            let templete: string = '<div><div style="padding: 12px" title="search" ><input id="txt" type="search" style="padding: 0 5px"placeholder="search"></input><span id="searchbutton" class="e-search e-icons"></span></div></div>';
            document.body.appendChild(createElement('div', { innerHTML: templete, id: 'search' }));
            gridObj = createGrid(
                {
                    dataSource: data,
                    width: "400px",
                    columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                    { field: 'ShipCity' }],
                    toolbarTemplate: '#search',
                    load: function () {
                        expect(this.isAngular).toBe(false);
                        this.isAngular = true;
                    },
                }, done);
        });

        it('check toolbar template', () => {
            expect(gridObj.toolbarModule.getToolbar().id).toBe('search');
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
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
            let searchElement: HTMLInputElement = select('#' + gridObj.element.id + '_searchbar', gridObj.toolbarModule.getToolbar());
            (searchElement).value = '98';
            (select('#' + gridObj.element.id + '_searchbar', gridObj.toolbarModule.getToolbar())).focus();
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

describe('code coverage - Toolbar - Adaptive UI', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 24),
                allowPaging: true,
                rowRenderingMode: 'Vertical',
                enableAdaptiveUI: true,
                height: '100%',
                width: 600,
                toolbar: ['Print'],
                showColumnChooser: true,
                searchSettings: { fields: ['CustomerID'], operator: 'contains', key: 'VINET', ignoreCase: true, ignoreAccent: true },
                pageSettings: { pageSize: 12, pageSizes: true },
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2' },
                ],
            }, done);
    });

    it('Render search, filter and sort', function () {
        gridObj.setProperties({ toolbar: ['Search'], allowSorting: true });
    });

    it('Click search wrapper', function () {
        (gridObj.element.querySelector('.e-search-wrapper') as HTMLElement).click();
    });

    it('Clear search', function () {
        const clear: HTMLElement = gridObj.element.querySelector('#' + gridObj.element.id + '_clearbutton') as HTMLElement;
        clear.classList.add('e-clear-icon');
        clear.click();
    });

    it('Back search wrapper', function () {
        (gridObj.element.querySelector('#' + gridObj.element.id + '_responsiveback') as HTMLElement).click();
    });

    it('Click sort', function () {
        (gridObj.element.querySelector('#' + gridObj.element.id + '_responsivesort') as HTMLElement).click();
    });

    it('React render and destroy', function () {
        gridObj.toolbarModule.toolbar.element = null;
        gridObj.toolbarModule.element = { parentNode: null } as any;
        gridObj.toolbarModule.destroy();
        gridObj.isReact = true;
        gridObj.portals = [];
        (gridObj.toolbarModule as any).addReactToolbarPortals([{}]);
        gridObj.toolbarModule.destroy();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Code Coverage - childGrid - toolbarTemplate and emptyRecordTemplate => ', () => {
    let gridObj: Grid;
    let template: HTMLElement = createElement('div', { id: 'template' });
    let element: HTMLElement = createElement('div');
    element.innerText = 'template';
    beforeAll((done: Function) => {
        template.appendChild(element);
        document.body.appendChild(template);
        gridObj = createGrid(
            {
                dataSource: filterData.slice(0, 10),
                height: 400,
                columns: [
                    { field: 'OrderID', textAlign: 'Right', width: 100, headerText: "Order ID" },
                    { field: 'CustomerID', width: 120, minWidth: '100', headerText: "Customer ID" },
                    { field: 'Freight', textAlign: 'Right', width: 110, format: 'C2', headerText: "Freight" },
                ],
                childGrid: {
                    dataSource: [],
                    queryString: 'EmployeeID',
                    allowPaging: true,
                    toolbarTemplate: '#template',
                    emptyRecordTemplate: '#template',
                    columns: [
                        { field: 'FirstName', headerText: 'First Name', width: 120 },
                        { field: 'Region', headerText: 'Region', width: 120 },
                    ],
                }
            }, done);
    });

    it('Case 1', () => {
        (gridObj.getContentTable().querySelector('.e-dtdiagonalright') as HTMLElement).click();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});
describe('EJ2-899326 => Script error occurs on selecting records in Adaptive UI when the toolbar have template elements => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 24),
                allowPaging: true,
                rowRenderingMode: 'Vertical',
                enableAdaptiveUI: true,
                height: '100%',
                width: 600,
                toolbar: [ 'Add', { id: 'test', template: '<span id="test">Test</span>'} ],
                pageSettings: { pageSize: 12, pageSizes: true },
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2' },
                ],
            }, done);
    });

    it('Selecting records and check the script error', function () {
        expect(document.querySelector('.e-grid.e-row-responsive')).not.toBeNull();
        if(document.querySelectorAll('.e-toolbar-item.e-template').length)
        {
            gridObj.selectRow(0);
            expect(document.querySelector('.e-toolbar-item.e-template')).not.toBeNull();
        }
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-924659 => Export Options Not Disabled When Properties Are Set to False for Adaptive mode => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 24),
                allowPaging: true,
                rowRenderingMode: 'Vertical',
                enableAdaptiveUI: true,
                showColumnChooser: true,
                allowExcelExport: false,
                allowPdfExport: false,
                height: '100%',
                width: 600,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search', 'ColumnChooser', 'ExcelExport', 'PdfExport'],
                pageSettings: { pageSize: 12, pageSizes: true },
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2' },
                ],
            }, done);
    });

    it('In expect checks the context menu items wer disabled or not in adaptive mode', function (done) {
        const toolbarMenuButton: HTMLElement = gridObj.toolbarModule.toolbar.element.querySelector('.e-responsive-toolbar-items');
        toolbarMenuButton.click();
        const menuItems = document.querySelectorAll('.e-menu-item');
        expect(menuItems[0].classList.contains('e-disabled')).toBeFalsy();
        expect(menuItems[1].classList.contains('e-disabled')).toBeTruthy();
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-924659 => Export Options Not Disabled When Properties Are Set to False for normal mode => ', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 24),
                allowPaging: true,
                showColumnChooser: false,
                allowExcelExport: false,
                allowPdfExport: false,
                toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel', 'Search', 'ColumnChooser', 'ExcelExport', 'PdfExport', 'CsvExport'],
                pageSettings: { pageSize: 12, pageSizes: true },
                columns: [
                    { field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right', validationRules: { required: true, number: true }, width: 120 },
                    { field: 'CustomerID', headerText: 'Customer ID', validationRules: { required: true }, width: 140 },
                    { field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit', width: 120, format: 'C2' },
                ],
            }, done);
    });

    it('In expect checks the context menu items wer disabled or not in normal mode', function (done) {
        expect((document.getElementById(gridObj.element.id+'_excelexport') as any).ariaDisabled).toBeTruthy();
        expect((document.getElementById(gridObj.element.id+'_pdfexport') as any).ariaDisabled).toBeTruthy();
        expect((document.getElementById(gridObj.element.id+'_columnchooser') as any).ariaDisabled).toBeTruthy();
        expect((document.getElementById(gridObj.element.id+'_csvexport') as any).ariaDisabled).toBeTruthy();
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

