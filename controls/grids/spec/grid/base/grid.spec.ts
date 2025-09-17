/**
 * Grid base spec 
 */
import { L10n,EventHandler, select, Browser } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { Column, ColumnModel } from '../../../src/grid/models/column';
import { QueryCellInfoEventArgs, LoadEventArgs } from '../../../src/grid/base/interface';
import { Page } from '../../../src/grid/actions/page';
import { Edit } from '../../../src/grid/actions/edit';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { data, filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy, getClickObj } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from './common.spec';
import { KeyboardEventArgs } from '../../../src';
import { Selection } from '../../../src/grid/actions/selection';
import { getNumberFormat, getActualRowHeight, padZero, getColumnModelByFieldName,
    getCollapsedRowsCount, distinctStringValues, parents, getComplexFieldID, getParsedFieldID,
    getPrintGridModel, getPrototypesOfObj, resetCachedRowIndex, sliceElements, applyStickyLeftRightPosition,
    getCellFromRow } from '../../../src/grid/base/util';
import { Group } from '../../../src/grid/actions/group';
import { ColumnChooser } from '../../../src/grid/actions/column-chooser';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { Aggregate } from '../../../src/grid/actions/aggregate';
import { Filter } from '../../../src/grid/actions/filter';
import { InfiniteScroll } from '../../../src/grid/actions/infinite-scroll';
import { VirtualScroll } from '../../../src/grid/actions/virtual-scroll';
import { ExcelExport } from '../../../src/grid/actions/excel-export';
import { PdfExport } from '../../../src/grid/actions/pdf-export';
import { Resize } from '../../../src/grid/actions/resize';
import { RowDD } from '../../../src/grid/actions/row-reorder';
Grid.Inject(Aggregate, Page, Edit, Resize, Toolbar, Group, ColumnChooser, VirtualScroll, InfiniteScroll, DetailRow, PdfExport, ExcelExport, Filter, RowDD);

describe('Grid base module', () => {
    describe('Grid properties', () => {
        let gridObj: Grid;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                pending; //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    enableHover: false,
                    actionComplete: actionComplete,
                }, done);
        });

        it('enable RTL testing', () => {
            gridObj.enableRtl = true;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-rtl')).toBeTruthy();
        });

        it('disable RTL testing', () => {
            gridObj.enableRtl = false;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-rtl')).toBeFalsy();
        });

        it('enable row hover testing', () => {
            gridObj.enableHover = true;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-gridhover')).toBeTruthy();
        });

        it('disable row hover testing', () => {
            gridObj.enableHover = false;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-gridhover')).toBeFalsy();
        });

        it('Row count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(data.length);
        });

        it('Column count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-headercell').length).toBe(gridObj.getColumns().length);
        });
        it('Content cell count testing', () => {
            expect(gridObj.element.querySelectorAll('.e-row')[0].childNodes.length).toBe(gridObj.getColumns().length);
        });

        // it('datasource onproperty changed testing', (done: Function) => {
        //     actionComplete = (args: Object): void => {
        //         expect(gridObj.element.querySelectorAll('.e-row').length).toBe(15);
        //         done();
        //     };
        //     gridObj.dataBound = actionComplete;
        //     gridObj.dataSource = filterData;
        //     gridObj.dataBind();
        // });

        it('Disable altrow', (done: Function) => {
            let dataBound = (args: Object) => {
                expect(gridObj.getContent().querySelectorAll('.e-altrow').length).toBe(0);
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.enableAltRow = false;
            gridObj.dataBind();
        });
        it('enable altrow', (done: Function) => {
            let dataBound = (args: Object) => {
                expect(gridObj.getContent().querySelectorAll('.e-altrow').length).toBe(Math.floor(gridObj.currentViewData.length / 2));
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.enableAltRow = true;
            gridObj.dataBind();
        });

        it('Ensure the grid column while dynamically change the lockColumn property value', (done: Function) => {
            (gridObj.columns[1] as Column).lockColumn = true;
            let dataBound = (args: Object) => {
                 expect(gridObj.lockcolPositionCount).toBe(1);
                 expect(gridObj.getColumns()[0].field).toBe('CustomerID');
                 done();
             };
            gridObj.dataBound = dataBound;
            gridObj.refreshColumns();
         });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });

    });

    describe('Allow resizing test cases', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowTextWrap: true,
                    allowResizing: true
                }, done);
        });

        it('handlers added', () => {
            expect(gridObj.element.querySelectorAll('.e-rhandler').length).toBe(5);
        });

        it('property change reflect', () => {
            gridObj.allowResizing = false;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-rhandler').length).toBe(0);
            gridObj.allowResizing = true;
            gridObj.dataBind();
            expect(gridObj.element.querySelectorAll('.e-rhandler').length).toBe(5);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Allow resizing - columns', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', allowResizing: false },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID', allowResizing: false },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowTextWrap: true,
                    allowResizing: true
                }, done);
        });

        it('Column resize suppress', () => {
            expect(gridObj.element.querySelectorAll('.e-rhandler').length).toBe(3);
            expect(gridObj.element.querySelectorAll('.e-rsuppress').length).toBe(2);

        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Method testing', () => {
        let gridObj: Grid;
        let actionComplete: (e?: Object) => void;

        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, actionComplete: actionComplete, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('getRowByIndex testing', () => {
            expect(isNullOrUndefined(gridObj.getRowByIndex(1))).toBeFalsy();
        });

        it('getHeaderContent testing', () => {
            expect(isNullOrUndefined(gridObj.getHeaderContent())).toBeFalsy();
        });

        it('getContentTable testing', () => {
            expect(isNullOrUndefined(gridObj.getContentTable())).toBeFalsy();
        });

        it('getContent testing', () => {
            expect(isNullOrUndefined(gridObj.getContent())).toBeFalsy();
        });

        it('getHeaderTable testing', () => {
            expect(isNullOrUndefined(gridObj.getHeaderTable())).toBeFalsy();
        });

        it('setGridHeaderContent testing', () => {
            let element: Element = gridObj.getHeaderContent();
            gridObj.setGridHeaderContent(element);
            expect(gridObj.getHeaderContent().isEqualNode(element)).toBeTruthy();
        });

        it('setGridContentTable testing', () => {
            let element: Element = gridObj.getContentTable();
            gridObj.setGridContentTable(element);
            expect(gridObj.getContentTable().isEqualNode(element)).toBeTruthy();
        });

        it('setGridContent testing', () => {
            let element: Element = gridObj.getContent();
            gridObj.setGridContent(element);
            expect(gridObj.getContent().isEqualNode(element)).toBeTruthy();
        });

        it('setGridHeaderTable testing', () => {
            let element: Element = gridObj.getHeaderTable();
            gridObj.setGridHeaderTable(element);
            expect(gridObj.getHeaderTable().isEqualNode(element)).toBeTruthy();
        });

        it('getColumnByField testing', () => {
            let col: Column = gridObj.getColumnByField('OrderID');
            expect(col.field).toBe('OrderID');
        });

        it('getColumnIndexByField testing', () => {
            let col: number = gridObj.getColumnIndexByField('OrderID');
            expect(col).toBe(0);
            let col1: number = gridObj.getColumnIndexByField('OrderID1');
            expect(col1).toBe(-1);
        });

        it('getColumnIndexByUid testing', () => {
            let col: number = gridObj.getColumnIndexByUid(gridObj.getColumnByField('OrderID').uid);
            expect(col).toBe(0);
            col = gridObj.getColumnIndexByUid(gridObj.getColumnByField('OrderID').uid + 'test');
            expect(col).toBe(-1);
        });

        it('getUidByColumnField testing', () => {
            expect(gridObj.getUidByColumnField('OrderID')).toBe(gridObj.getColumnByField('OrderID').uid);
        });

        it('getColumnHeaderByIndex testing', () => {
            expect(gridObj.getColumnHeaderByIndex(1).querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(gridObj.getMovableColumnHeaderByIndex(1).querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(gridObj.getFrozenRightColumnHeaderByIndex(1).querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
            expect(gridObj.getFrozenRightColumnHeaderByIndex(1).querySelector('.e-headercelldiv').textContent).toBe('CustomerID');
        });

        it('renderEmptyRow testing', () => {
            gridObj.renderModule.renderEmptyRow();
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
            expect(gridObj.element.querySelectorAll('.e-emptyrow').length).toBe(1);
        });


        afterAll(() => {
            gridObj.getPersistData();
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('Grid lines testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    gridLines: 'Both'
                }, done);
        });

        it('Grid line both testing', () => {
            expect(gridObj.element.classList.contains('e-horizontallines')).toBeFalsy();
            expect(gridObj.element.classList.contains('e-verticallines')).toBeFalsy();
            expect(gridObj.element.classList.contains('e-hidelines')).toBeFalsy();
        });

        it('Grid line horizontal testing', () => {
            gridObj.gridLines = 'Horizontal';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-horizontallines')).toBeTruthy();
            expect(gridObj.element.classList.contains('e-verticallines')).toBeFalsy();
            expect(gridObj.element.classList.contains('e-hidelines')).toBeFalsy();
        });

        it('Grid line vertical testing', () => {
            gridObj.gridLines = 'Vertical';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-horizontallines')).toBeFalsy();
            expect(gridObj.element.classList.contains('e-verticallines')).toBeTruthy();
            expect(gridObj.element.classList.contains('e-hidelines')).toBeFalsy();
        });

        it('Grid line hide both testing', () => {
            gridObj.gridLines = 'None';
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-horizontallines')).toBeFalsy();
            expect(gridObj.element.classList.contains('e-verticallines')).toBeFalsy();
            expect(gridObj.element.classList.contains('e-hidelines')).toBeTruthy();
        });

        it('dblClickHandler testing', () => {
            let ele: HTMLElement = gridObj.element.querySelector('.e-content');
            let args: object = {target: ele};
            (gridObj as any).dblClickHandler(args);
            expect(1).toBe(1);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });


    describe('EJ2-907415 - Indent cell border line appears thick at group and caption aggregate', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 1),
                    allowGrouping: true,
                    gridLines: 'Vertical',
                    groupSettings: { columns: ['ShipCountry'] },
                    editSettings: {
                        allowEditing: true,
                        allowAdding: true,
                    },
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        {
                            headerText: 'Customer Details', columns: [
                                { headerText: 'EmployeeID', field: 'EmployeeID' },
                                { headerText: 'ShipCountry', field: 'ShipCountry' },
                            ]
                        },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                }, done);
        });

        it('first cell class testing', () => {
            expect(gridObj.element.querySelector('.e-grid-group-first-cell')).not.toBeUndefined();
        });

        it('Grid line horizontal testing', (done: Function) => {
            actionComplete = (args: any): void => {
                if (args.requestType === 'add') {
                    gridObj.actionComplete = null;
                    expect(gridObj.element.querySelector('.e-gridform .e-grid-group-first-cell')).not.toBeUndefined();
                    done();
                }
            }
            gridObj.actionComplete = actionComplete;
            gridObj.addRecord();
        });

        it('close edit', () => {
            gridObj.closeEdit();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

    describe('Grid lines testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowTextWrap: true
                }, done);
        });

        it('Text wrap testing', () => {
            expect(gridObj.element.classList.contains('e-wrap')).toBeTruthy();
        });

        it('Text wrap false testing', () => {
            gridObj.allowTextWrap = false;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-wrap')).toBeFalsy();
        });

        it('Text wrap false testing', () => {
            gridObj.allowTextWrap = true;
            gridObj.dataBind();
            expect(gridObj.element.classList.contains('e-wrap')).toBeTruthy();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Localization testing', () => {
        let gridObj: Grid;

        beforeAll((done: Function) => {
            L10n.load({
                'de-DE': {
                    'grid': {
                        EmptyRecord: 'Geen records om te laten zien'
                    }
                }
            });
            gridObj = createGrid(
                {
                    dataSource: data, locale: 'de-DE', allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });

        it('renderEmptyRow testing', () => {
            gridObj.renderModule.renderEmptyRow();
            expect(gridObj.element.querySelectorAll('.e-row').length).toBe(0);
            expect(gridObj.element.querySelectorAll('.e-emptyrow').length).toBe(1);
        });

        it('renderEmptyRow content testing', () => {
            expect(gridObj.element.querySelector('.e-emptyrow').textContent).toBe('Geen records om te laten zien');
        });

        it('get constant method testing', () => {
            expect(gridObj.localeObj.getConstant('True')).toBe('true');
        });

        it('get constant method testing', () => {
            expect(gridObj.localeObj.getConstant('EmptyRecord')).toBe('Geen records om te laten zien');
            //for coverage 
            gridObj.refreshHeader();
            gridObj.refresh();
            gridObj.setInjectedModules([]);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('media columns testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', hideAtMedia: '(min-width:500px)' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });


        it('media columns', () => {
            (<any>gridObj).getMediaColumns();
            (<any>gridObj).isInitialLoad = true;
            let mediaqry: any = window.matchMedia('(min-width:500px)');
            gridObj.mediaQueryUpdate(0, mediaqry);
            let mediaqry1: any = window.matchMedia('(max-width:1300px)');
            gridObj.mediaQueryUpdate(1, mediaqry);
            let ele: Element = gridObj.element;
            let e: any = { target: ele };
            (<any>gridObj).focusOutHandler(e);

        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Dynamic columns change testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', hideAtMedia: '(min-width:500px)' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });


        it('Change Columns', (done: Function) => {
            gridObj.dataBound = () => {
                expect(gridObj.columns.length).toBe(3);
                expect(gridObj.getRows()[0].children.length).toBe(3);
                done();
            };
            expect(gridObj.columns.length).toBe(5);
            gridObj.columns = [
                { headerText: 'OrderID', field: 'OrderID', hideAtMedia: '(min-width:500px)' },
                { headerText: 'CustomerID', field: 'CustomerID' },
                { headerText: 'EmployeeID', field: 'EmployeeID' },
            ];
            gridObj.dataBind();
        });

        it('Change Columns using push method', (done: Function) => {
            gridObj.dataBound = () => {
                // expect(gridObj.columns.length).toBe(5);
                // expect(gridObj.getRows()[0].children.length).toBe(5);
                done();
            };
            expect(gridObj.columns.length).toBe(3);
            let newcol: Column[] = <Column[]>[{ headerText: 'ShipCountry', field: 'ShipCountry' },
            { headerText: 'ShipCity', field: 'ShipCity' },];
            (<any>gridObj.columns).push(...newcol);
            gridObj.dataBind();
            gridObj.refreshColumns();
        });

        it('Change Columns using pop method', (done: Function) => {
            gridObj.dataBound = () => {
                expect(gridObj.columns.length).toBe(4);
                expect(gridObj.getRows()[0].children.length).toBe(4);
                done();
            };
            expect(gridObj.columns.length).toBe(5);
            (<any>gridObj.columns).pop();
            gridObj.dataBind();
            gridObj.refreshColumns();
        });

        // it('Spinner showing test', (done: Function) => { //random failure
        //     gridObj.dataBound = () => {
        //         expect(gridObj.element.querySelector('.e-spinner-pane').classList.contains('e-spin-show')).toBeTruthy();
        //         done();
        //     };
        //     gridObj.refresh();
        // });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    // describe('Data module testing', () => {
    //     let gridObj: Grid;
    //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //     beforeAll((done: Function) => {
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         document.body.appendChild(elem);
    //         gridObj = new Grid(
    //             {
    //                 dataSource: data, allowPaging: false,
    //                 columns: [
    //                     { headerText: 'OrderID', field: 'OrderID' },
    //                     { headerText: 'CustomerID', field: 'CustomerID' },
    //                     { headerText: 'EmployeeID', field: 'EmployeeID' },
    //                     { headerText: 'ShipCountry', field: 'ShipCountry' },
    //                     { headerText: 'ShipCity', field: 'ShipCity' },
    //                 ],
    //                 dataBound: dataBound
    //             });
    //         gridObj.appendTo('#Grid');
    //     });


    //     it('getDataModule tets', (done: Function) => {
    //          gridObj.dataBound = () => {
    //         let gdata = gridObj.getDataModule();
    //         expect(gdata).not.toBeNull();
    //         done();
    //     }
    //     });

    //     afterAll(() => {
    //         remove(elem);
    //     });
    // });

    describe('row Information', () => {

        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, allowPaging: false,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', hideAtMedia: '(min-width:500px)' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ]
                }, done);
        });


        it('get row information', () => {

            // let gdata = gridObj.getRowInfo(document.getElementsByClassName('e-rowcell')[9]);
            //let gdata1 = gridObj.getRowInfo(document.getElementsByClassName('e-groupcaption')[0]);
            //expect(gdata.rowData['EmployeeID']).toBe(6);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });

    })

    describe('update particular row and cell value =>', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        let template: Element = createElement('div', { id: 'template' });
        template.innerHTML = '<span>$Freight$</span>';
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [{
                        OrderID: 10248, CustomerID: 'VINET', EmployeeID: 5, OrderDate: new Date(8364186e5),
                        ShipName: 'Vins et alcools Chevalier', ShipCity: 'Reims', ShipAddress: '59 rue de l Abbaye',
                        ShipRegion: 'CJ', ShipPostalCode: '51100', ShipCountry: 'France', Freight: 32.38, Verified: !0
                    },
                    {
                        OrderID: 10249, CustomerID: 'TOMSP', EmployeeID: 6, OrderDate: new Date(836505e6),
                        ShipName: 'Toms Spezialitäten', ShipCity: 'Münster', ShipAddress: 'Luisenstr. 48',
                        ShipRegion: 'CJ', ShipPostalCode: '44087', ShipCountry: 'Germany', Freight: 11.61, Verified: !1
                    },
                    {
                        OrderID: 10250, CustomerID: 'HANAR', EmployeeID: 4, OrderDate: new Date(8367642e5),
                        ShipName: 'Hanari Carnes', ShipCity: 'Rio de Janeiro', ShipAddress: 'Rua do Paço, 67',
                        ShipRegion: 'RJ', ShipPostalCode: '05454-876', ShipCountry: 'Brazil', Freight: 65.83, Verified: !0
                    }],
                    allowFiltering: true,
                    allowPaging: true,
                    filterSettings: { type: 'Menu' },
                    columns: [{ field: 'OrderID', type: 'number', isPrimaryKey: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', template:'#template', allowFiltering: false },
                    { field: 'OrderDate', format: 'yMd' },
                    { field: 'Verified' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                },
                done);
        });
        it('update particular cell', () => {
            gridObj.setCellValue(10249, 'CustomerID', 'new value');
            let selRow: any = gridObj.contentModule.getRows()[1];
            expect((<any>selRow).data.CustomerID).toEqual('new value');
        });
        it('update particular row', () => {
            gridObj.setRowData(10250, { OrderID: 1249, CustomerID: 'new value', CustomerName: 'accc' });
            let selRow: any = gridObj.contentModule.getRows()[2];
            expect((<any>selRow).data.CustomerID).toEqual('new value');
        });
         it('update template cell', () => {
            gridObj.setCellValue(10249, 'Freight', 1);
            let selRow: any = gridObj.contentModule.getRows()[1];
            expect((<any>selRow).data.Freight).toEqual(1);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
            document.getElementById('template').remove();
        });
    });
    // describe('media columns testing', () => {
    //     let gridObj: Grid;
    //     let elem: HTMLElement = createElement('div', { id: 'Grid' });
    //     beforeAll((done: Function) => {
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         document.body.appendChild(elem);
    //         gridObj = new Grid(
    //             {
    //                 dataSource: data, allowPaging: false,
    //                 columns: [
    //                     { headerText: 'OrderID', field: 'OrderID', hideAtMedia: '(min-width:500px)' },
    //                     { headerText: 'CustomerID', field: 'CustomerID' },
    //                     { headerText: 'EmployeeID', field: 'EmployeeID' },
    //                     { headerText: 'ShipCountry', field: 'ShipCountry' },
    //                     { headerText: 'ShipCity', field: 'ShipCity' },
    //                 ],
    //                 dataBound: dataBound
    //             });
    //         gridObj.appendTo('#Grid');
    //     });


    //     it('getDataModule tets', () => {
    //        let gdata = gridObj.getDataModule();
    //     });

    //     afterAll(() => {
    //         remove(elem);
    //     });
    // });

     describe('page size greater than total records grid get refresh =>', () => {
        let gridObj: Grid;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data, 
                    allowPaging: true,
                    actionComplete: actionComplete,
                    pageSettings: { pageSizes:true,pageSize: 5 },
                    columns: [{ field: 'OrderID', type: 'number', isPrimaryKey: true },
                    { field: 'CustomerID', type: 'string' },
                    { field: 'Freight', format: 'C2', type: 'number', allowFiltering: false },
                    ],
                },
                done);
        });

        it('setting current page', function (done) {
            actionComplete = (args: Object): void => {
              done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings = { currentPage: 2 };            
            gridObj.dataBind();
        });
        // it('Setting pagesize', function (done) {
        //     actionComplete = (args: Object): void => {     
        //     expect(gridObj.currentViewData.length).toEqual(15);                
        //     done();
        //     };
        //     gridObj.actionComplete = actionComplete;
        //     gridObj.pageSettings.pageSize = 20;            
        // });
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

    describe('grid scrollbar placeholder hide', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,5),
                    height: 500,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    allowSelection: true,
                }, done);
        });

        it('when total row height is smaller than Grid’s height', () => {
            let contentTable: HTMLElement = gridObj.getContent().querySelector('.e-content') as HTMLElement;
            expect(contentTable.style.overflowY === 'scroll').toBeTruthy();
            if ((gridObj.currentViewData.length * gridObj.getRowHeight()) < gridObj.height) {
                gridObj.hideScroll();
            }
            expect(contentTable.style.overflowY === 'auto').toBeTruthy();
        });

        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('update cell and row method testing => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowFiltering: true,
                    allowGrouping: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch', showConfirmDialog: true, showDeleteConfirmDialog: false },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'ShipAddress', allowFiltering: true, visible: false },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionBegin: actionBegin,
                    actionComplete: actionComplete
                }, done);
        });

        it('update cell', () => {
            gridObj.updateCell(0, 'CustomerID', 'updated');
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(1);
            expect((gridObj as any).contentModule.getRows()[0].changes.CustomerID).toBe('updated');
        });

        it('update row', () => {
            gridObj.updateRow(1, { CustomerID: 'updatedrow' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBe(2);
            expect((gridObj as any).contentModule.getRows()[1].changes.CustomerID).toBe('updatedrow');
        });

        it('add record by method', () => {
            gridObj.addRecord({ OrderID: 10247, CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(2);
            expect((gridObj as any).contentModule.getRows()[0].changes.OrderID).toBe(10247);
        });

        it('delete record by method', () => {
            gridObj.deleteRecord('OrderID', gridObj.currentViewData[2]);
            expect(gridObj.getContent().querySelectorAll('.e-row')[3].classList.contains('e-hiddenrow')).toBeTruthy();
        });

        it('getBatch changes method test', () => {
            let batch: any = gridObj.getBatchChanges();
            expect(batch.changedRecords[0].CustomerID).toBe('updated');
            expect(batch.changedRecords[1].CustomerID).toBe('updatedrow');
            expect(batch.addedRecords[0].OrderID).toBe(10247);
            expect(batch.deletedRecords[0].OrderID).toBe(10250);
        });

        it('add record by method', () => {
            gridObj.addRecord({ OrderID: 10246, CustomerID: 'updated' });
            expect(gridObj.element.querySelectorAll('.e-updatedtd').length).toBeGreaterThan(0);
            expect((gridObj as any).contentModule.getRows()[0].changes.OrderID).toBe(10246);
        });

        it('delete record by method', () => {
            gridObj.clearSelection();
            gridObj.selectRow(0, true);
            gridObj.deleteRecord();
            expect(gridObj.getContent().querySelectorAll('.e-row')[0].classList.contains('e-hiddenrow')).toBeFalsy();
        });       

        afterAll(() => {
            gridObj.notify('tooltip-destroy', {});
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });

        describe('Toolbar functionalities', () => {
            let gridObj: Grid;
            let actionBegin: (e?: Object) => void;
            let actionComplete: (e?: Object) => void;
        
            beforeAll((done: Function) => {
                const isDef = (o: any) => o !== undefined && o !== null;
                    if (!isDef(window.performance)) {
                        pending; //Skips test (in Chai)
                    }
                gridObj = createGrid(
                    {
                        dataSource: data,
                        allowGrouping: true,
                        width: "400px",
                        columns: [{ field: 'OrderID' }, { field: 'CustomerID' }, { field: 'EmployeeID' }, { field: 'Freight' },
                        { field: 'ShipCity' }],
                        toolbar: ['Print', 'Edit', { text: 'hello', id: 'hello' }, 'expand'] as any,
                        actionBegin: actionBegin,
                        actionComplete: actionComplete,
                    }, done);
            });
            
            it('Enable Toolbar items', () => {
                gridObj.enableToolbarItems(['Grid_update'], true);
                gridObj.dataBind();
                expect(gridObj.element.getAttribute('aria-disabled')).toBeFalsy;
            });

            it('Disable Toolbar items', () => {
                gridObj.enableToolbarItems(['Grid_update'], false);
                gridObj.dataBind();
                expect(gridObj.element.getAttribute('aria-disabled')).toBeTruthy;
            });
        });
    });

    describe('Capturing keypress events', () => {
        let gridObj: Grid;
        let preventDefault: Function = new Function();
        let actionComplete: (e: KeyboardEventArgs) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    height: 500,
                    columns: [
                        { headerText: 'Order ID', field: 'OrderID' },
                        { headerText: 'Customer ID', field: 'CustomerID' },
                        { headerText: 'Freight', field: 'Freight' },
                        { headerText: 'Order Date', field: 'OrderDate' },
                    ],
                    allowSelection: true,
                }, done);
        });
        it('pressing keycode for "a" and ctrlkey as true', (done: Function) => {
            let keyPressed = (args?: any): void => {
                expect(args.keyCode).toEqual(65);        
                done();
            };
            gridObj.keyPressed = keyPressed;
            EventHandler.trigger(gridObj.element, "keydown", { keyCode: 65, ctrlKey: true });
      
        });
        it('pressing keycode for "space" and ctrlkey as false , shiftkey as true', (done: Function) => {
            let keyPressed = (args?: any): void => {
                expect(args.keyCode).toEqual(32);        
                done();
            };
            gridObj.keyPressed = keyPressed;
            EventHandler.trigger(gridObj.element, "keydown", { keyCode: 32, ctrlKey: false, shiftKey: true });
      
        });
        it('pressing keycode for "ctrl" and shiftkey  as true', (done: Function) => {
            let keyPressed = (args?: any): void => {
                expect(args.keyCode).toEqual(17);        
                done();
            };
            gridObj.keyPressed = keyPressed;
            EventHandler.trigger(gridObj.element, "keydown", { keyCode: 17, shiftKey: true });
      
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

   describe('Grouping functionalites => ', () => {
        let gridObj: Grid;
        let actionBegin: () => void;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                pending; //Skips test (in Chai)
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

        it('collapseAll method testing', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            gridObj.groupCollapseAll();
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(12);
        });
        
        it('expandAll method testing', () => {
            gridObj.groupExpandAll();
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(12);
        });

        it('expandCollapse rows method testing', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(12);
          
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = actionBegin = actionComplete = null;
        });
    });

    describe('Open column chooser', () => {
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
        it('openColumnChooser testing', (done: Function) => {
            setTimeout(() => {
                gridObj.openColumnChooser();
                let cheEle: any = document.querySelectorAll('.e-cc-chbox')[0];
                let cheEle1: any = document.querySelectorAll('.e-cc-chbox')[1];
                cheEle.click();
                cheEle1.click();
                (<HTMLElement>document.querySelector('.e-cc_okbtn')).click();
                gridObj.openColumnChooser();
                gridObj.openColumnChooser();
                done();
            }, 500);

        });

        afterAll(() => {
            (<any>gridObj).columnChooserModule.destroy();
            destroy(gridObj);
            gridObj = beforeOpenColumnChooser = null;
        });

    });
      
        describe('Detail Module Functionalities', () => {
            let gridObj: Grid;
    
            beforeAll((done: Function) => {
                const isDef = (o: any) => o !== undefined && o !== null;
                if (!isDef(window.performance)) {
                    pending; //Skips test (in Chai)
                }
                gridObj = createGrid(
                    {
                        dataSource: filterData,
                        allowPaging: true,
                        detailTemplate: '#detailtemplate1',
                        allowGrouping: true,
                        selectionSettings: { type: 'Multiple', mode: 'Row' },
                        allowFiltering: true,
                        allowSorting: true,
                        allowReordering: true,
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                            { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                            { field: 'Freight', width: 120, format: 'C', textAlign: 'Right' },
                            { field: 'ShipCity', headerText: 'Ship City', width: 150 }
                        ]
                    }, done);
            });
    
            it('Collapse method testing', () => {
                gridObj.detailRowModule.collapse(gridObj.getDataRows()[1].querySelector('.e-detailrowexpand'));
                expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(0);
            });

            it('Expand method testing', () => {
                gridObj.detailRowModule.expand(gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse'));
                expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(1);
            });
    
            afterAll(() => {
                destroy(gridObj);
                gridObj = null;
            });
        });

        describe('expandAll and collapseAll in detail module ', () => {
            let gridObj: Grid;
            let actionComplete: () => void;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: filterData,
                        detailTemplate: '#detailtemplate',
                        allowPaging: true,
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                            { field: 'CustomerID', headerText: 'Customer ID', width: 125 },
                            { field: 'Freight', width: 120, format: 'C', textAlign: 'Right' },
                            { field: 'ShipCity', headerText: 'Ship City', width: 150 }
                        ],
                        actionComplete: actionComplete
                        }, done);
                });
            it('actionComplete event triggerred for expandAll action complete', () => {
                actionComplete = (args?: any): void => {
                    expect(args.requestType).toBe('expandAllComplete');
                }
                gridObj.actionComplete = actionComplete;
                gridObj.detailExpandAll();
            });
            it('actionComplete event triggerred for collapseAll action complete', () => {
                actionComplete = (args?: any): void => {
                    expect(args.requestType).toBe('collapseAllComplete');
                }
                gridObj.actionComplete = actionComplete;
                gridObj.detailCollapseAll();
            });
            afterAll(() => {
                destroy(gridObj);
                gridObj = actionComplete = null;
            });
        });

        describe('grid selection functionalities', () => {
            let gridObj: Grid;
            let selectionModule: Selection;
            let rows: Element[];
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        frozenColumns: 2,
                        frozenRows: 2,
                        dataSource: data,
                        columns: [
                            { headerText: 'OrderID', field: 'OrderID' },
                            { headerText: 'CustomerID', field: 'CustomerID' },
                            { headerText: 'EmployeeID', field: 'EmployeeID' },
                            { headerText: 'ShipCountry', field: 'ShipCountry' },
                            { headerText: 'ShipCity', field: 'ShipCity' },
                        ],
                        allowSelection: true,
                        selectionSettings: { type: 'Single', mode: 'Both' },
                    }, done);
            });

            it('clear cell selection testing', () => {
                gridObj.clearCellSelection();
                expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
              });

            it('clear row selection testing', () => {
                gridObj.clearRowSelection();
                expect(gridObj.element.querySelectorAll('.e-selectionbackground').length).toBe(0);
              });

            it('selectCells testing', () => {
                gridObj.selectCells([{ rowIndex: 0, cellIndexes: [0] }, { rowIndex: 1, cellIndexes: [1] }]);
                expect(gridObj.element.querySelectorAll('.e-cellselectionbackground').length).toBe(0);
              });

            it('selectRowsByRange  testing', () => {
                //selectionModule.clearRowSelection();
                selectionModule = gridObj.selectionModule;
                rows = gridObj.getRows();
                gridObj.selectRowsByRange(3, 4);
                selectionModule.selectCells([{ rowIndex: 0, cellIndexes: [0] }]);
                //expect(rows[3].hasAttribute('aria-selected')).toBeFalsy();
                expect(rows[0].firstElementChild.classList.contains('e-selectionbackground')).toBeFalsy();
            });

            // code coverage
            it('mergeColumns  testing', () => {
                (gridObj as any).mergeColumns(gridObj.columns, gridObj.columns);
                (gridObj as any).leftrightColumnWidth('left');
            });
            afterAll(() => {
                destroy(gridObj);
                gridObj = selectionModule = rows = null;
            });
        });

        describe('Ensure column properties while calling the getPersistData', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: data,
                        height: 500,
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID' },
                            { field: 'EmployeeID', headerText: 'Employee ID', foreignKeyField: 'EmployeeID', foreignKeyValue: 'ShipName' },
                            { field: 'CustomerID', headerText: 'Customer ID', filter: { type: 'checkbox' } }
                        ]
                    }, done);
            });
            it('Collect persist data', (done: Function) => {
                let persistData: Grid = JSON.parse(gridObj.getPersistData());
                expect((persistData.columns[1] as Column).dataSource).toBe(undefined);
                expect((persistData.columns[2] as Column).filter).toBe(undefined);
                done();
            });
            afterAll(() => {
                destroy(gridObj);
            });
        });
    });
    
    describe('grid checkbox selection functionalities with Freeze pane', () => {
        let gridObj: Grid;
        let rowSelected: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSelection: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6},
                    columns: [
                        { type:'checkbox', width: 40},
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                    ],
                    rowSelected:rowSelected
                    
                }, done);
        });
    
        it('Checkbox select all with data count', () => {
            rowSelected = (args?: any): void => {
                expect(args.data.length).toBe(6);
                expect(args.isInteracted).toBeTruthy();
                gridObj.rowSelected = null;
            }
            gridObj.rowSelected = rowSelected;
            (gridObj.element.querySelector('.e-headercelldiv').querySelectorAll('.e-frame.e-icons')[0] as any).click();
            expect(gridObj.getSelectedRowIndexes().length).toBe(6);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    
    describe('Complex field with auto generated columns checking', () => {
        let gridObj: Grid;
        let dataSource = [{
            OrderID: 10248, Customer: { ID: 'VINET', Name: { FirstName: 'Dijin', LastName: 'Jones' } }, EmployeeID: 5, OrderDate: new Date(8364186e5),
        },
        {
            OrderID: 10249, Customer: { ID: 'TOMSP', Name: { FirstName: 'Vins', LastName: 'Chevalier' } }, EmployeeID: 6, OrderDate: new Date(836505e6),
        },
        {
            OrderID: 10250, Customer: { ID: 'HANAR', Name: { FirstName: 'Hilarton', LastName: 'Abastos' } }, EmployeeID: 4, OrderDate: new Date(8367642e5),
        }];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: dataSource,
                    height: 500,
                }, done);
        });
        it('Check Complex data', () => {
            expect((gridObj.getRowByIndex(0) as any ).cells[1].innerHTML).toBe('VINET');
            expect((gridObj.getRowByIndex(1) as any ).cells[1].innerHTML).toBe('TOMSP');
            expect((gridObj.getRowByIndex(0) as any ).cells[2].innerHTML).toBe('Dijin');
            expect((gridObj.getRowByIndex(0) as any ).cells[3].innerHTML).toBe('Jones');
            expect((gridObj.columns[1] as  any).field).toBe('Customer.ID');
            expect((gridObj.columns[2] as  any).field).toBe('Customer.Name.FirstName');
            expect((gridObj.columns[3] as  any).field).toBe('Customer.Name.LastName');
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('grid with stacked header and clipmode', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowSelection: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6},
                    columns: [
                        {
                            headerText: 'Order Details', toolTip: 'Order Details',clipMode: 'EllipsisWithTooltip', textAlign: 'Center',
                            columns: [{ field: 'OrderID', width: 120, clipMode: 'EllipsisWithTooltip', textAlign: 'Right', headerText: 'Order ID' },
                            {
                                field: 'OrderDate', width: 120, textAlign: 'Right',clipMode: 'EllipsisWithTooltip', headerText: 'Order Date',
                                format: { skeleton: 'yMd', type: 'date' }, type: 'date'
                            }]
                        },
                        { field: 'CustomerID', width: 120,clipMode: 'EllipsisWithTooltip', headerText: 'Customer ID' },
                        { field: 'EmployeeID', width: 120, textAlign: 'Right', clipMode: 'EllipsisWithTooltip', headerText: 'Employee ID' },
                        {
                            headerText: 'Ship Details',clipMode: 'EllipsisWithTooltip',
                            columns: [
                                { field: 'ShipCity', width: 120,clipMode: 'EllipsisWithTooltip', headerText: 'Ship City' },
                                { field: 'ShipCountry', width: 120,clipMode: 'EllipsisWithTooltip', headerText: 'Ship Country' },
                            ],
                        }
                    ],
                    
                }, done);
        });
    
        it('check stacked header clipmode', () => {
            expect(gridObj.getHeaderContent().querySelector('tr').querySelectorAll('th')[0].classList.contains('e-ellipsistooltip')).toBeTruthy();
            expect(gridObj.getHeaderContent().querySelector('tr').querySelectorAll('th')[1].classList.contains('e-ellipsistooltip')).toBeTruthy();
            expect(gridObj.getHeaderContent().querySelectorAll('.e-ellipsistooltip').length).toBe(8);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('custom date format checking', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,2),
                    allowSelection: true,
                    allowPaging: true,
                    pageSettings: { pageSize: 6},
                    columns: [
            
                           { field: 'OrderID', width: 120, textAlign: 'Right', headerText: 'Order ID' },
                            {
                                field: 'OrderDate', width: 120, textAlign: 'Right', headerText: 'Order Date1',
                                format: 'dd-MM-yyyy', type: 'date'
                            },
                            {
                                field: 'OrderDate', width: 120, textAlign: 'Right', headerText: 'Order Date2',
                                format: 'dd:MM:yyyy'
                            },
                            { field: 'CustomerID', width: 120, headerText: 'Customer ID' },
                    ],
                    
                }, done);
        });
    
        it('date format check', () => {
            expect(gridObj.getRows()[0].children[1].innerHTML).toBe('03-07-1996');
            expect(gridObj.getRows()[0].children[2].innerHTML).toBe('03:07:1996');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('clipMode testing in grid level', () => {
        let gridObj: Grid;
        let row: any;
        let td: any;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: false,
                    allowGrouping: true,
                    clipMode:'EllipsisWithTooltip',
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', clipMode: 'Clip' },
                        { headerText: 'CustomerID', field: 'CustomerID', clipMode: 'Ellipsis' },
                        { headerText: 'OrderDate', field: 'OrderDate', clipMode:'EllipsisWithTooltip' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipAddress', field: 'Shipping Address of the order'},
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });
        it( 'class testing' , ()=>{
            row = [gridObj.contentModule.getTable().children['1'].children];           
            expect(row[0][0].cells[0].classList.contains('e-gridclip')).toBeTruthy();
            expect(row[0][0].cells[2].classList.contains('e-ellipsistooltip')).toBeTruthy();
            expect(row[0][0].cells[3].classList.contains('e-ellipsistooltip')).toBeTruthy();
            expect(row[0][0].cells[1].classList.contains('e-ellipsistooltip')).toBeFalsy();             
        });    
        afterAll(() => {
            destroy(gridObj);
            gridObj = row = td = null;
        });
    });

    describe('getting hidden columns ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: false,
                    allowGrouping: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID' },
                        { headerText: 'CustomerID', field: 'CustomerID', visible: false },
                        { headerText: 'OrderDate', field: 'OrderDate' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipAddress', field: 'Shipping Address of the order' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });
        it('testing for one column', () => {
            expect(gridObj.getHiddenColumns()[0].field).toBe('CustomerID');
        });
        it('testing for Employee Id column ', () => {
            gridObj.getColumnByField('CustomerID').visible = true;
            gridObj.getColumnByField('EmployeeID').visible = false;
            expect(gridObj.getHiddenColumns()[0].field).toBe('EmployeeID');
        });
        it('visible false for two columns ', () => {
            gridObj.getColumnByField('ShipCity').visible = false;
            expect(gridObj.getHiddenColumns()[0].field).toBe('EmployeeID');
            expect(gridObj.getHiddenColumns()[1].field).toBe('ShipCity');
        });
        it('checking for all columns visible true', () => {
            gridObj.getColumnByField('ShipCity').visible = true;
            gridObj.getColumnByField('EmployeeID').visible = true;
            gridObj.getColumnByField('OrderID').visible = true;
            expect(gridObj.getHiddenColumns().length).toBe(0);
        })
        afterAll(() => {
            destroy(gridObj);
        });
    });

    describe('changed data feature testing', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: false,
                    allowGrouping: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true  },
                        { headerText: 'CustomerID', field: 'CustomerID', visible: false },
                        { headerText: 'Freight', field: 'Freight' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipAddress', field: 'Shipping Address of the order' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });
        it('changing the freight value in edit mode false', (done:Function) => {
            gridObj.updateRowValue(10248,{OrderID:10248,Freight:200});
            let actionComplete = (args: any) => {
                expect(gridObj.dataSource[0].Freight).toBe(200);
                done();
            };
           gridObj.actionComplete=actionComplete;            
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            gridObj.actionComplete = null;
        });
    });

    describe('EJ2-37293-double click in row-drag-n-drop icon to get row object', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: false,
                    allowGrouping: true,
                    allowRowDragAndDrop: true,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
                        { headerText: 'CustomerID', field: 'CustomerID', visible: false },
                        { headerText: 'Freight', field: 'Freight' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipAddress', field: 'Shipping Address of the order' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });
        it('double click in row-drag-n-drop icon', (done: Function) => {
            let recordDoubleClick = (args: any) => {
                expect(args.rowData).toBeDefined();
                expect(args.rowIndex).toBe(0);
                expect(args.row).toBeDefined();
                done();
            }
            gridObj.recordDoubleClick = recordDoubleClick;
            (gridObj as any).dblClickHandler({target:gridObj.element.querySelector('.e-rowdragdrop')});
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            gridObj.recordDoubleClick = null;
        });
    });

    describe('EJ2-38148-Column name mismatches in recordClick event when Grid is grouped', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: false,
                    allowGrouping: true,
                    groupSettings:{columns:['OrderID','CustomerID']},
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
                        { headerText: 'CustomerID', field: 'CustomerID', visible: false },
                        { headerText: 'Freight', field: 'Freight' },
                        { headerText: 'EmployeeID', field: 'EmployeeID' },
                        { headerText: 'ShipAddress', field: 'Shipping Address of the order' },
                        { headerText: 'ShipCity', field: 'ShipCity' },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });
        it('double click in row-drag-n-drop icon', (done: Function) => {
            let recordClick = (args: any) => {
                expect(args.column.field).toBe('Freight');
                done();
            }
            gridObj.recordClick = recordClick;
            (gridObj.element.querySelectorAll('.e-rowcell')[2] as any).click();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
            gridObj.recordClick = null;
        });
        describe('EJ2-42713-Updating Query dynamically issue', () => {
            let gridObj: Grid;
            beforeAll((done: Function) => {
                gridObj = createGrid(
                    {
                        dataSource: data,
                        query : new Query().addParams('ManufacturingLineIdFilter', '1'),
                        columns: [
                            { headerText: 'OrderID', field: 'OrderID' },
                            { headerText: 'CustomerID', field: 'CustomerID' },
                            { headerText: 'Freight', field: 'Freight' },
                            { headerText: 'EmployeeID', field: 'EmployeeID' }
                        ],
                    }, done);
            });
            it('checking refresh action', (done: Function) => {
                let actionComplete = (args: any) => {
                    expect(args.requestType).toBe('refresh');
                    done();
                }
                gridObj.actionComplete = actionComplete;
                gridObj.query = new Query().addParams('ManufacturingLineIdFilter', '2');
            });
            afterAll(() => {
                destroy(gridObj);
                gridObj = null;
                gridObj.actionComplete = null;
            });
        });
        describe('EJ2-46639 - getRowIndexByPrimarykey not working properly with complex data', function () {
            let gridObj: Grid;
            let complexData: Object[] = [
                { OrderID: { ID: { ordID: 10248 } }, CustomerID: "VINET", Freight: 32.38, ShipCountry: "France" },
                { OrderID: { ID: { ordID: 10249 } }, CustomerID: "TOMSP", Freight: 11.61, ShipCountry: "Germany" },
                { OrderID: { ID: { ordID: 10250 } }, CustomerID: "HANAR", Freight: 65.83, ShipCountry: "Brazil" },
                { OrderID: { ID: { ordID: 10251 } }, CustomerID: "VICTE", Freight: 41.34, ShipCountry: "France" }];
            beforeAll(function (done) {
                gridObj = createGrid({
                    dataSource: complexData,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID.ID.ordID', type: 'number', isPrimaryKey: true },
                        { headerText: 'CustomerID', field: 'CustomerID' },
                        { headerText: 'Freight', field: 'Freight', format: "C2" },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                    allowSelection: true,
                }, done);
            });
            it('Get rowindex from primarykey', function () {
                expect(gridObj.getRowIndexByPrimaryKey(10248)).toBe(0);
                expect(gridObj.getRowIndexByPrimaryKey(10249)).toBe(1);
                expect(gridObj.getRowIndexByPrimaryKey(10250)).toBe(2);
                expect(gridObj.getRowIndexByPrimaryKey(10355)).toBe(-1);
            });
            afterAll(function () {
                destroy(gridObj);
            });
        });
    });
    describe('EJ2-46527 - Server export coverage', function () {
        let gridObj: Grid;
        beforeAll(function (done) {
            gridObj = createGrid({
                dataSource: data,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', type: 'number', isPrimaryKey: true },
                    { headerText: 'OrderDate', field: 'Order Date', format: { type: "date", format: "dd/MM/yyyy" } },
                    { headerText: 'Freight', field: 'Freight', format: "C2" },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                ]
            }, done);
        });
        it('Calling export functions', function () {
            let column: Column = gridObj.columns[1] as Column;
            getNumberFormat((gridObj as any).getFormat(column.format), column.type, true);
        });
        afterAll(function () {
            destroy(gridObj);
        });
    });

    describe('EJ2-52883 - Need to provide a method for clearing all the Grid actions => ', () => {
        let gridObj: Grid;
        let actionComplete: (args: any) => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowFiltering: true,
                    allowGrouping: true,
                    allowSorting: true,
                    cssClass: 'grid1',
                    toolbar: ['Search'],
                    groupSettings: { columns: ['CustomerID','ShipCountry'] },
                    searchSettings: { fields: ['CustomerID'], key: 'a' },
                    allowPaging: false,
                    columns: [
                        { field: 'OrderID', type: 'number', isPrimaryKey: true, visible: true, validationRules: { required: true } },
                        { field: 'CustomerID', type: 'string' },
                        { field: 'EmployeeID', type: 'number', allowEditing: false },
                        { field: 'Freight', format: 'C2', type: 'number', editType: 'numericedit' },
                        { field: 'ShipCity' },
                        { field: 'Verified', type: 'boolean', editType: 'booleanedit' },
                        { field: 'ShipName', isIdentity: true },
                        { field: 'ShipCountry', type: 'string', editType: 'dropdownedit' },
                        { field: 'ShipRegion', type: 'string' },
                        { field: 'OrderDate', format: { skeleton: 'yMd', type: 'date' }, type: 'date', editType: 'datepickeredit' }
                    ],
                    actionComplete: actionComplete
                }, done);
        });
        it('clear the all action', function (done: Function) {
            actionComplete = (args: any) => {
                done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.clearGridActions();
        });
        
        it('check the group and sort columns', () => {
            // Check parent cssClass name
            expect(gridObj.element.classList.contains('grid1')).toBeTruthy();
            expect(gridObj.groupSettings.columns.length).toBe(0);
            expect(gridObj.searchSettings.key).toBe('');
            gridObj.cssClass = 'grid2';
        });
        it('EJ2-60580 - cssClass property is not updated dynamically', () => {
            expect(gridObj.element.classList.contains('grid2')).toBeTruthy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj  = actionComplete = null;
        });
    });

    describe('Normal Grid Mask Row', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 10),
                    loadingIndicator: { indicatorType: 'Shimmer' },
                    height: 300,
                    columns: [
                        { field: 'OrderID'},
                        { field: 'CustomerID'},
                        { field: 'EmployeeID'},
                    ]
                }, done);
        });
        it('Show Mask Row', () => {
            gridObj.showMaskRow();
            (gridObj as any).translateMaskRow({target: gridObj.getContent().firstChild});
            expect(gridObj.getContent().querySelector('.e-masked-table')).toBeTruthy();
        });
        it('Refresh Mask Row', () => {
            (gridObj as any).refreshMaskRow();
            expect(gridObj.getContent().querySelector('.e-masked-table').clientWidth).toBe(gridObj.getContent().querySelector('.e-table:not(.e-masked-table)').clientWidth);
        });
        it('Remove Mask Row', () => {
            gridObj.removeMaskRow();
            expect(gridObj.getContent().querySelector('.e-masked-table')).toBeFalsy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Auto generated columns Mask Row for coverage', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 10),
                    loadingIndicator: { indicatorType: 'Shimmer' },
                    height: 300
                }, done);
        });
        it('Create Empty Mask Table', () => {
            expect(gridObj.getContent().querySelector('.e-masked-table')).toBeFalsy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-66841 - Script error thrown when saving the data with Shimmer effect', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 15),
                    loadingIndicator: { indicatorType: 'Shimmer' },
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    height: 200,
                    columns: [
                        { field: 'OrderID'},
                        { field: 'CustomerID'},
                        { field: 'EmployeeID'},
                    ]
                }, done);
        });
        it('Select row', () => {
            (gridObj.getContent().firstChild as HTMLElement).scrollTop = 200;
            gridObj.selectRow(8);
        });
        it('Start Edit', () => {
            gridObj.startEdit();
        });
        it('End Edit', () => {
            gridObj.endEdit();
            expect(1).toBe(1);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    
    describe('EJ2-68404 - Missing Cancel icon in Reactive Aggregate sample in toolbar button.', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 15),
                    allowPaging: true,
                    pageSettings: {pageCount: 5},
                    allowGrouping: true,
                    groupSettings: { showDropArea: false, columns: ['CustomerID'] },
                    editSettings: { allowEditing: true, allowDeleting: true, mode: 'Batch' },
                    toolbar: [ 'Delete', 'Update', 'Cancel'],
                    columns: [
                        {
                            field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right',
                            validationRules: { required: true }, width: 120
                        },
                        {
                            field: 'CustomerID', headerText: 'Customer ID',
                            validationRules: { required: true }, width: 140
                        },
                        {
                            field: 'Freight', headerText: 'Freight', textAlign: 'Right', editType: 'numericedit',
                            width: 120, format: 'C2', validationRules: { required: true }
                        },
                        {
                            field: 'OrderDate', headerText: 'Order Date', editType: 'datepickeredit', format: 'yMd',
                            width: 170
                        },
                        {
                            field: 'ShipCountry', headerText: 'Ship Country', editType: 'dropdownedit', width: 150,
                            edit: { params: { popupHeight: '300px' } }
                        }],
                    aggregates: [{
                        columns: [ {
                            type: 'Sum',
                            field: 'Freight',
                            format: 'C2',
                            footerTemplate: 'Sum : ${Sum}'
                        },
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
                        }]
                }],
            }, done);
        });
        it('Select element outside grid to check cancel icon', () => {
            let inputEle: HTMLElement = document.body.appendChild(createElement('input', { id: 'TestInput' }));
            let e: any = { target: inputEle };
            (<any>gridObj).focusOutHandler(e);
            expect(document.querySelector('.e-toolbar').querySelector('.e-tbar-btn').querySelector('.e-btn-icon').classList.contains('.e-hide')).toBe(false);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('EJ2-35549 - When dynamically change group Settings,sortSettings and columns causes the script error', () => {
        let gridObj: Grid;
        let column1: ColumnModel[] = [ { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
                                        { headerText: 'CustomerID', field: 'CustomerID' },
                                        { headerText: 'Freight', field: 'Freight' },
                                        { headerText: 'EmployeeID', field: 'EmployeeID' }
                                    ];
        let column2:   ColumnModel[] = [{ headerText: 'ShipAddress', field: 'Shipping Address of the order' },
                                        { headerText: 'ShipCity', field: 'ShipCity' },
                                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                                        { headerText: 'ShipName', field: 'ShipName' }
                                        ];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowGrouping: true,
                    groupSettings: { columns: ['CustomerID'] },
                    columns: column1,
                }, done);
        });
        it('called the clear All Grid Actions', (done: Function) => {
            let dataBound = (args: Object) => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.changeDataSource(filterData, column2);
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = column1 = column2 = null;
        });
    });

    describe('EJ2-35549 - When dynamically change group Settings,sortSettings and columns causes the script error', () => {
        let gridObj: Grid;
        let rows: Element[];
        let column1: ColumnModel[] = [ { headerText: 'OrderID', field: 'OrderID', isPrimaryKey: true },
                                        { headerText: 'CustomerID', field: 'CustomerID' },
                                        { headerText: 'Freight', field: 'Freight' },
                                        { headerText: 'EmployeeID', field: 'EmployeeID' }
                                    ];
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowGrouping: true,
                    groupSettings: { columns: ['CustomerID'] },
                    columns: column1,
                    allowFiltering: true,
                    allowSorting: true,
                    queryCellInfo: function (args: QueryCellInfoEventArgs) {
                        if (args.column.field === 'Freight') {
                            args.cell.classList.add('e-colour');
                        }
                    },
                    filterSettings: { columns: [{ field: 'CustomerID', matchCase: false, operator: 'notequal', value: 'TOMSP' }] },
                    sortSettings: { columns: [{ field: 'OrderID', direction: 'Ascending' }, { field: 'CustomerID', direction: 'Ascending' }] },
                }, done);
        });
        it('check queryCellInfo class name - 1', () => {
            rows = gridObj.getRows();
            expect((rows[1] as HTMLTableRowElement).cells[3].classList.contains('e-colour')).toBeTruthy();
        });
        it('datasource changed ', (done: Function) => {
            let newColumn: object[] = [
                { 'field': 'OrderID', 'headerText': 'Order ID', 'width': 120, 'textAlign': 'Right' },
                { 'field': 'CustomerID', 'headerText': 'Customer Name', 'width': 160 },
                { 'field': 'OrderDate', 'headerText': 'Order Date', 'width': 130, 'format': 'yMd' },
                { 'field': 'Freight', 'width': 120, 'format': 'C', 'textAlign': 'Right' },
                { 'field': 'ShipName', 'headerText': 'Ship Name', 'width': '170' }];
            let dataBound = (args: Object) => {
                done();
            };
            gridObj.dataBound = dataBound;
            gridObj.changeDataSource(filterData, newColumn);
        });
        it('check queryCellInfo class name - 2', () => {
            rows = gridObj.getRows();
            expect((rows[1] as HTMLTableRowElement).cells[2].classList.contains('e-colour')).toBeFalsy();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = column1 = rows = null;
        });
    });

    describe('Auto fit column =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData,
                    columns: [{ field: 'OrderID', headerText: 'Order ID', width: 200 },
                    { field: 'CustomerID', headerText: 'CustomerID', visible: false },
                    { field: 'ShipCity', headerText: 'Ship City', width: 200 }],
                    allowGrouping: true,
                    groupSettings: { showDropArea: true, showGroupedColumn: true, columns: ['CustomerID'] },
                }, done);
        });
        it('Enable autoFit', () => {
            gridObj.autoFit = true;
        });
        it('Check table width by setting autoFit as true', () => {
            expect((gridObj.getContentTable()as HTMLElement).style.width).toBe('430px');
            gridObj.showColumns('CustomerID');
        });
        it('Check table width by visibling undefined width column', () => {
            expect((gridObj.getContentTable()as HTMLElement).style.width).toBe('');
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });


    describe('Provide XSS- security for Grid =>', () => {
        let gridObj: Grid;
        let actionComplete: () => void;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [{
                        OrderID: 10248,  ShipCity: 'Münster',
                        ShipName: '<img id="target" src="x" onerror="alert(document.domain)">'
                    },
                    {
                        OrderID: 10249, ShipCity: 'Luisenstr',
                        ShipName: '<p><strong>Environmentally friendly</strong> or <strong>environment-friendly</strong>'
                        
                    },
                    {
                        OrderID: 10250,  ShipCity: 'Rio de Janeiro',
                        ShipName: 'from the tow at \"low\" altitude and turned back toward the gliderport when the nose of the glider pointed “down,\" and the glider descended',
                    }],
                    enableHtmlSanitizer: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal'},
                    toolbar: ['Add', 'Edit', 'Delete', 'Update', 'Cancel'],
                    columns: [
                        {
                            field: 'OrderID',
                            isPrimaryKey: true,
                            headerText: '<h1>Order ID<h1>',
                            disableHtmlEncode: false,
                            clipMode: "EllipsisWithTooltip",
                            width: 120,
                        },
                        {
                            field: 'ShipName',
                            width: 150,
                            disableHtmlEncode: false,
                            headerText: 'Ship Name',
                            clipMode: 'EllipsisWithTooltip',
                        },
                        {
                            field: 'SupplierID',
                            width: 150,
                            disableHtmlEncode: false,
                            headerText: 'Supplier ID',
                        },
                    ],
                }, done);
        });
        it('test the html sanitizer' , () => {        
            expect((gridObj.getRowByIndex(0) as any ).cells[1].innerHTML).toBe('<img id="target" src="x">');     
        });
        it('update cell test', function () {
            gridObj.setCellValue(10249, 'ShipName', '<img id="target" src="x" onerror="alert(document.domain)">');
            let selRow: any = gridObj.contentModule.getRows()[1];
            expect((<any>selRow).data.ShipName).toEqual('<img id="target" src="x">');
        });
        it('Start Editing', () => {
            gridObj.selectRow(2);
            gridObj.startEdit();
        });
        it('Edited value check', (done: Function) => {
            actionComplete = (args?: any): void => {
                if (args.requestType === 'save') {
                    expect((gridObj.currentViewData[2] as any).ShipName).toBe('<img id="target" src="x">');
                    done();
                }
            };
            gridObj.actionComplete = actionComplete;
            (select('#' + gridObj.element.id + 'ShipName', gridObj.element) as any).value = '<img id="target" src="x" onerror="alert(document.domain)">';
            (<any>gridObj.toolbarModule).toolbarClickHandler({ item: { id: gridObj.element.id + '_update' } });
        });
  
        afterAll(() => {
            destroy(gridObj);
            gridObj = actionComplete = null;
        });
    });

describe('EJ2-855141 - Height 100% is not working when dynamically changing properties', () => {
    let gridObj: Grid;
    let contentHeight: string;
    let dataBound: (args: Object) => void;
    let actionComplete: (args: Object) => void;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData.slice(0, 5),
                allowFiltering: true,
                allowPaging: true,
                allowGrouping: true,
                height: '100%',
                toolbar: ['Search'],
                columns: [{ field: 'OrderID', headerText: 'Order ID', width: 200 },
                { field: 'CustomerID', headerText: 'CustomerID', visible: false },
                { field: 'ShipCity', headerText: 'Ship City', width: 200 },
                { field: 'Freight', width: 200 }],
                aggregates: [{
                    columns: [{
                        type: 'Sum',
                        field: 'Freight',
                        footerTemplate: 'Sum: ${Sum}'
                    }]
                }]
            }, done);
    });
    it('Get the initial height', () => {
        contentHeight = (gridObj.element.querySelector('.e-gridcontent') as HTMLElement).style.height;
        expect(contentHeight).not.toBeUndefined();
    });
    it('EJ2-891083 - Apply filter', (done: Function) => {
        dataBound = () => {
            let newHeight: string = (gridObj.element.querySelector('.e-gridcontent') as HTMLElement).style.height;
            expect(contentHeight).not.toEqual(newHeight);
            contentHeight = newHeight;
            gridObj.dataBound = null;
            done();
        };
        gridObj.dataBound = dataBound;
        gridObj.filterByColumn('CustomerID', 'contains', 'VINET');
    });
    it('clear Filter', (done: Function) => {
        dataBound = () => {
            let newHeight: string = (gridObj.element.querySelector('.e-gridcontent') as HTMLElement).style.height;
            expect(contentHeight).not.toEqual(newHeight);
            contentHeight = newHeight;
            gridObj.dataBound = null;
            done();
        };
        gridObj.dataBound = dataBound;
        gridObj.clearFiltering();
    });
    it('Change paging', (done: Function) => {
        actionComplete = (args: Object) => {
            let newHeight: string = (gridObj.element.querySelector('.e-gridcontent') as HTMLElement).style.height;
            expect(contentHeight).not.toEqual(newHeight);
            contentHeight = newHeight;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.allowPaging = false;
    });
    it('Code coverage1', (done: Function) => {
        gridObj.actionComplete = null;
        gridObj.filterSettings.type = 'Menu';
        gridObj.filterSettings.type = 'FilterBar';
        gridObj.groupSettings.showDropArea = false;
        gridObj.groupSettings.showDropArea = true;
        done();
    });
    it('Change filter', (done: Function) => {
        actionComplete = (args: Object) => {
            let newHeight: string = (gridObj.element.querySelector('.e-gridcontent') as HTMLElement).style.height;
            expect(contentHeight).not.toEqual(newHeight);
            contentHeight = newHeight;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.allowFiltering = false;
    });
    it('Change grouping', (done: Function) => {
        actionComplete = (args: Object) => {
            let newHeight: string = (gridObj.element.querySelector('.e-gridcontent') as HTMLElement).style.height;
            expect(contentHeight).not.toEqual(newHeight);
            contentHeight = newHeight;
            done();
        };
        gridObj.actionComplete = actionComplete;
        gridObj.allowGrouping = false;
    });
    it('Code coverage2', (done: Function) => {
        gridObj.actionComplete = null;
        gridObj.aggregates = null;
        gridObj.toolbar = null;
        done();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = contentHeight = dataBound = actionComplete = null;
    });
});

// used for code coverage
describe('get edit template =>', () => {
    let gridObj: Grid;
    let userAgent: any;
    let column: any;
    beforeAll((done: Function) => {
        gridObj =
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 5),
                    allowPaging: true,
                    allowGrouping: true,
                    allowTextWrap: true,
                    textWrapSettings: { wrapMode: "Header" },
                    groupSettings: { columns: ["ShipCountry"] },
                    toolbar: ["ColumnChooser"],
                    enablePersistence: true,
                    columns: [
                        {
                            field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right',
                            validationRules: { required: true }, width: 120
                        },
                        {
                            field: 'CustomerID', headerText: 'Customer ID', template: '<div>${CustomerID}</div>', width: 'auto', minWidth: 100
                        },
                        {
                            field: 'Freight', headerText: 'Freight', format: 'C2', width: 120
                        },
                        {
                            field: 'ShipCountry', headerText: 'Ship Country', width: "30%"
                        },
                        {
                            headerText: "Ship Details", width: 200, columns: [
                                { field: 'ShipAddress', headerText: 'Ship Address', width: 270, minWidth: 10 },
                                { field: 'ShipCity', headerText: 'Ship City', width: 250, minWidth: 10 },]
                        }
                    ],
                    aggregates: [{
                        columns: [{
                            type: 'Sum',
                            field: 'Freight',
                            format: 'C2',
                        }]
                    }],
                }, done);
    });
    it('execute methods 1', (done) => {
        gridObj.resetIndentWidth();
        expect((gridObj as any).calculatePageSizeByParentHeight("100%")).not.toBe(0);
        expect(gridObj.getHeight("100%")).not.toBe("100%");
        expect((gridObj as any).setHeaderText(gridObj.columns, "field").length).toBe(gridObj.columns.length);
        expect(gridObj.getEditHeaderTemplate()).toBeUndefined();
        expect(gridObj.getEditFooterTemplate()).toBeUndefined();
        done();
    });

    it('execute methods 2', (done) => {
        gridObj.element.classList.add('e-bigger');
        gridObj.applyBiggerTheme(document.createElement('div'));
        userAgent = gridObj.getRowUid('row');
        (gridObj as any).getUserAgent();
        (gridObj as any).addRowObject(gridObj.getRowsObject()[1], 1);
        gridObj.getPreviousRowData();
        getActualRowHeight(document.body);
        padZero(2);
        getColumnModelByFieldName(gridObj, 'OrderID');
        done();
    });

    it('execute methods 3', function (done) {
        window.localStorage.setItem('grid' + gridObj.element.id, gridObj.getPersistData())
        gridObj.mergePersistGridData();
        window.localStorage.setItem('grid' + gridObj.element.id, '');
        done();
    });

    it('execute methods 4', function (done) {
        getCollapsedRowsCount(gridObj.getRowsObject()[0], gridObj);
        distinctStringValues(['a', 'b', 'a', 'c', 'c']);
        done();
    });

    it('selection file code coverage - 1', () => {
        gridObj.selectedRowIndex = -5;
        (gridObj.selectionModule as any).selectRowIndex();
        
    });


    afterAll(() => {
        destroy(gridObj);
        gridObj = userAgent = null;
    });
});

// used for code coverage
describe('dateonly =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: new DataManager([{OrderID: 10248, OrderDate: '2023-04-04'}]),
                    allowPaging: true,
                    allowGrouping: true,
                    allowFiltering: true,
                    filterSettings: { type: 'Excel' },
                    allowSorting: true,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    columns: [
                        {
                            field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 120
                        },
                        {
                            field: 'OrderDate', headerText: 'Order Date', type: 'dateonly', width: 120
                        },
                    ],
                }, done);
    });
    it('execute methods 1', (done: Function) => {
        (gridObj.filterModule as any).filterIconClickHandler(getClickObj(gridObj.getColumnHeaderByField('OrderDate').querySelector('.e-filtermenudiv')));
        done();
    });


    it('execute methods 2', (done: Function) => {
        gridObj.excelExport();
        done();
    });

    it('execute methods 3', (done: Function) => {
        gridObj.pdfExport();
        done();
    });

    it('execute methods 4', function (done: Function) {
        gridObj.groupColumn('OrderDate');
        done();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

// used for code coverage
describe('EJ2-871826: Error when using Stacked Header with Column Template and updating dataSource dynamically in React =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 1),
                    columns: [
                        {
                            field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 120
                        },
                        {headerText: 'Details', textAlign: 'Center', columns:[
                            {field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Center', width: '80'},
                            {field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Center', width: '60'},
                          ]},
                    ],
                }, done);
    });
    it('execute column setProperties method', (done: Function) => {
        const col: Column = {headerText: 'Details', textAlign: 'Center', columns:[
            {field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Center', width: '80'},
            {field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Center', width: '100'},
          ]} as Column;
        (gridObj.columns[1] as Column).setProperties(col);
        done();
    });
    it('execute column toJSON method', () => {
        (gridObj.columns[1] as Column).toJSON();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-880511: When entering the grid through the tab key press, want to focus first cell of grid =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    height: 300,
                    allowPaging: true,
                    pageSettings: { pageSize: 50 },
                    columns: [
                        {
                            field: 'OrderID',
                            headerText: 'Order ID',
                            width: 120,
                            isPrimaryKey: true,
                            textAlign: 'Right',
                        },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        { field: 'Freight', width: 120, format: 'C2', textAlign: 'Right' },
                        { field: 'ShipCountry', headerText: 'Ship Country', width: 150 },
                        { field: 'Details', width: 150 },
                    ],
                }, done);
    });
    it('Check tab index for Grid when empty record', () => {
        expect(gridObj.element.tabIndex).toBe(-1);
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});


// used for code coverage
describe('Focusing  code coverage =>', () => {
    let gridObj: Grid;
    let e: object;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        { field: 'ShipCity', headerText: 'Ship Cit', width: 150 },
                        { field: 'ShipCountry', headerText: 'Ship Counrty', width: 150 },
                        { field: 'Verified', width: 120, textAlign: 'Right' }]
                }, done);
    });
    it('for coverage - 1', () => {
        e = { target: gridObj.element.querySelector('.e-emptyrow') };
        (gridObj.focusModule as any).focusCheck(e);
        parents(gridObj.element.querySelector('.e-content')as Element, gridObj.element.id, true);
    });
    it('for coverage - 2', () => {
        getComplexFieldID(undefined);
        getParsedFieldID(undefined);
        padZero(12);
        getPrintGridModel(null, gridObj.hierarchyPrintMode);
        getPrototypesOfObj({id: '1', value: '2'});
        (gridObj.focusModule as any).onFocus(e);
    });
    it('for coverage - 3', () => {
        (e as any).target.classList.add('e-detailcell');
        gridObj.focusModule.currentInfo.element = (e as any).target;
        (gridObj.focusModule as any).passiveFocus(e);
    });
    it('for coverage - 4', () => {
        gridObj.focusModule.currentInfo.skipAction = true;
        (gridObj.focusModule as any).skipOn(e);
    });
    it('for coverage - 5', () => {
        (gridObj.focusModule as any).addOutline();
        gridObj.focusModule.currentInfo.element = null;
        (gridObj.focusModule as any).focusHeader();
        (gridObj.focusModule as any).focusContent();
        (gridObj.focusModule as any).resetFocus();
    });
    it('for coverage - 6', () => {
        (gridObj.focusModule as any).findNextCellFocus(0, 0);
        gridObj.isDestroyed = true;
        (gridObj.focusModule as any).addEventListener();
        gridObj.resetIndentWidth();
        gridObj.addListener();
        gridObj.isDestroyed = false;
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = e = null;
    });
});

// used for code coverage
describe('Focusing  code coverage =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    allowGrouping: true,
                    frozenRows: 2,
                    groupSettings: { showDropArea: false, showGroupedColumn: true, columns: ['CustomerID'] },
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                    filterSettings: { type: 'Menu' },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        { field: 'ShipCity', headerText: 'Ship Cit', width: 150 },
                        { field: 'ShipCountry', headerText: 'Ship Counrty', width: 150 },
                        { field: 'Verified', width: 120, textAlign: 'Right' }]
                }, done);
    });
    it('for coverage - 7', () => {
        gridObj.groupModule.groupTextFocus = true;
        gridObj.focusModule.restoreFocus();
        gridObj.focusModule.setActiveByKey('home', gridObj.focusModule.active);
        
    });
    it('for coverage - 8', () => {
        (gridObj.focusModule as any).header.getHeaderType();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});


// used for code coverage
describe('Focusing  code coverage =>', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    allowGrouping: true,
                    frozenRows: 2,
                    allowFiltering: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        {
                            headerText: 'Order Details', columns: [
                                { field: 'OrderDate', headerText: 'Order Date', textAlign: 'Right', width: 135, format: 'yMd', minWidth: 10 },
                                {
                                    headerText: 'Ship Details', columns: [
                                        { field: 'ShippedDate', headerText: 'Shipped Date', textAlign: 'Right', width: 145, format: 'yMd', minWidth: 10},
                                        { field: 'ShipCountry', headerText: 'Ship Country', width: 140, minWidth: 10 },
                                    ]
                                }
                            ]
                        },
                        { field: 'Verified', width: 120, textAlign: 'Right' }
                    ]
                }, done);
    });

    it('for coverage - 9', () => {
        (gridObj.focusModule as any).content.getGridSeletion();
        gridObj.focusModule.header.matrix.current = [-1, -1];
        (gridObj.focusModule as any).header.shouldFocusChange();
        gridObj.enableHeaderFocus = true;
        gridObj.focusModule.header.jump('tab',[0, 3]);
    });

    it('for coverage - 10', () => {
        (gridObj.focusModule as any).header.getNextCurrent(null, null, null, 'shiftRight');
        (gridObj.focusModule as any).header.getNextCurrent([1, 0], null, null, 'tab');
        (gridObj.focusModule as any).content.getNextCurrent([1, 0], null, null, 'tab');
    });

    it('for coverage - keycode', () => {
        gridObj.pagerModule.pagerObj.element.tabIndex = 0;
        let e: object = { target: gridObj.element.querySelector('.e-rowcell'), keyCode: 9, shiftKey : true, preventDefault };
        (gridObj.focusModule as any).onKeyPress(e);
    });

    it('for coverage - jump', function () {
        gridObj.focusModule.content.jump('tab', [-1]);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});



// used for code coverage
describe('Focusing  code coverage =>', () => {
    let gridObj: Grid;
    let preventDefault: Function = new Function();
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPaging: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Batch' },
                    filterSettings: { type: 'Menu' },
                    showColumnChooser: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        { field: 'ShipCity', headerText: 'Ship Cit', width: 150 },
                        { field: 'ShipCountry', headerText: 'Ship Counrty', width: 150 },
                        { field: 'Verified', width: 120, textAlign: 'Right' }]
                }, done);
    });
    it('for coverage - 11', () => {
        (gridObj as any).frozenLeftBorderColumns(null);
        (gridObj as any).frozenRightBorderColumns(null);
        (gridObj as any).widthUnit(true);
        (gridObj as any).defaultIndentWidth(true);
    });
    it('for coverage - 12', () => {
        let e: object = { target: gridObj.element.querySelector('.e-rowcell') };
        gridObj.element.classList.add('e-gantt');
        (gridObj.focusModule as any).onBlur(e);
    });
    it('for coverage - 13', () => {
        let e: object = { target: gridObj.element.querySelector('.e-rowcell'), key: 'Tab', shiftKey : true, preventDefault };
        (gridObj.focusModule as any).handleFilterNavigation(e, '.e-rowcell', '.e-rowcell');
        (e as any).shiftKey = false;
        (gridObj.focusModule as any).handleFilterNavigation(e, '.e-rowcell', '.e-rowcell');
        (gridObj.focusModule as any).onKeyPress(e);
    });

    it('for coverage - 14', () => {
        let e: object = { target: gridObj.element.querySelector('.e-numericitem'), action: 'shiftTab', keyCode: 38, preventDefault };
        gridObj.pagerModule.pagerObj.element.tabIndex = 0;
        (gridObj.focusModule as any).onKeyPress(e);
        let elem: Element = (gridObj.pagerModule as any).element.querySelector('[tabindex]:not([tabindex="-1"])');
        elem.classList.add('e-focused');
        (gridObj.focusModule as any).onKeyPress(e);
        gridObj.element.classList.add('e-detailcell');
        gridObj.element.classList.add('e-childgrid');
        (e as any).action = 'tab';
        (e as any).target = elem;
        (gridObj.focusModule as any).onKeyPress(e);
        (e as any).action = '';
        (gridObj.focusModule as any).onKeyPress(e);
     
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

// used for code coverage
describe('Column code coverage =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0, 1),
                    columns: [
                        {
                            field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', width: 120
                        },
                        {field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Center', width: '80'},
                        {field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Center', width: '60'},
                    
                    ],
                }, done);
    });
    it('execute column setProperties method', (done: Function) => {
        const col: Column = 
            {field: 'CustomerID', template: '#template', editTemplate: '#template', textAlign: 'Center', width: '80'} as Column;
        (gridObj as any).isReact = true;
        (gridObj.columns[1] as Column).setProperties(col);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});


// used for code coverage
describe('Util  code coverage =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableInfiniteScrolling: true,
                    height: 400,
                    frozenRows: 1,
                    infiniteScrollSettings: { enableCache: true },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        { field: 'ShipCity', headerText: 'Ship Cit', width: 150 },
                        { field: 'ShipCountry', headerText: 'Ship Counrty', width: 150 },
                        { field: 'Verified', width: 120, textAlign: 'Right' }]
                }, done);
    });
    it('for coverage - resetCachedRowIndex', () => {
        resetCachedRowIndex(gridObj)
    });

    it('for coverage - sliceElements', () => {
        sliceElements(gridObj.element.querySelector('.e-row'), 0, 3);
    });

    it('for coverage - applyStickyLeftRightPosition', () => {
        applyStickyLeftRightPosition(gridObj.element.querySelector('.e-rowcell'), 100, true, 'Left');
        applyStickyLeftRightPosition(gridObj.element.querySelector('.e-rowcell'), 100, true, 'Right');
        getCellFromRow(gridObj, 1, 6);
    });
    it('Conetnt-renderer getInfiniteMovableRows coverage', () => {
        (gridObj as any).contentModule.getInfiniteMovableRows();
        (gridObj as any).contentModule.infiniteRowVisibility(true);
    });
    it('Conetnt-renderer drop coverage', () => {
        let e = { target: gridObj.element.querySelector('.e-rowcell'), droppedElement: gridObj.element.querySelector('.e-rowcell') };
        (gridObj as any).contentModule.drop(e);
    });
    it('for coverage - canSkip', () => {
        (gridObj as any).contentModule.canSkip(gridObj.columns[0], gridObj.getRowsObject()[0], 0);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});


// used for code coverage
describe('Conetent-renderer  code coverage =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    enableVirtualization: true,
                    height: 400,
                    frozenRows: 1,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        { field: 'ShipCity', headerText: 'Ship Cit', width: 150 }]
                }, done);
    });

    it('refresh virtual grid', function(done: Function){
        let dataBound = () => {
            gridObj.dataBound = null;
            done();
        };
        gridObj.dataBound = dataBound;
        gridObj.refresh();
    });


    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});


// used for code coverage
describe('Conetnt-renderer code coverage =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data.slice(0,4),
                    load: function () {
                        this.clearTemplate = (propertyNames?: string[], index?: any, callback?: Function): void => {
                            if (callback) {
                                callback();
                            }
                        }
                    },
                    frozenRows: 1,
                    rowTemplate: '<tr><td>${OrderID}</td><td>${CustomerID}</td><td>${EmployeeID}</td></tr>',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name', width: 150 },
                        { field: 'ShipCity', headerText: 'Ship Cit', width: 150 }]
                }, done);
    });

    it('refresh grid', function(done: Function){
        (gridObj as any).isReact = true;
        let dataBound = () => {
            gridObj.dataBound = null;
            done();
        };
        gridObj.dataBound = dataBound;
        gridObj.refresh();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

// used for code coverage
describe('requireTemplateRef code coverage =>', () => {
    let gridObj: Grid;
    let load: (args: LoadEventArgs) => void;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', width: 120, textAlign: 'Right' }]
                }, done);
    });

    it('hide spinner', function () {
        gridObj.isExportGrid = true;
        gridObj.hideSpinner();
        gridObj.isExportGrid = false;
    });

    it('freeze refresh 1', function () {
        gridObj.isReact = true;
        load = (args: LoadEventArgs) => {
            args.requireTemplateRef = false;
        };
        gridObj.load = load;
        gridObj.freezeRefresh();
    });

    it('freeze refresh 2', function () {
        load = (args: LoadEventArgs) => {
            args.requireTemplateRef = true;
        };
        gridObj.load = load;
        gridObj.freezeRefresh();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = load = null;
    });
});

// used for code coverage
describe('width controller  code coverage =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    height: '100%',
                    width:'100',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID',minWidth:'100', textAlign: 'Right' },
                        { field: 'CustomerID', headerText: 'Customer Name',  },
                        { field: 'ShipCity', headerText: 'Ship Cit' }]
                }, done);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

// used for code coverage
describe('width controller  code coverage =>', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    width:'100',
                    allowResizing: true,
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID' },
                        { field: 'CustomerID', headerText: 'Customer Name',  },
                        { field: 'ShipCity', headerText: 'Ship Cit' }]
                }, done);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for currentViewData public property
    it("currentViewData", () => {
        // Test with null value
        gridObj.currentViewData = null;
        gridObj.dataBind();
        expect(gridObj.currentViewData).toBe(null);

        // Test with undefined value
        gridObj.currentViewData = undefined;
        gridObj.dataBind();
        expect(gridObj.currentViewData).toBe(undefined);
    });

    // Test cases for aggregates public property
    it("aggregates", () => {
        // Test with null value
        gridObj.aggregates = null;
        gridObj.dataBind();
        expect(gridObj.aggregates.length).toBe(0);

        // Test with undefined value
        gridObj.aggregates = undefined;
        gridObj.dataBind();
        expect(gridObj.aggregates.length).toBe(0);
    });

    // Test cases for allowExcelExport public property
    it("allowExcelExport", () => {
        // Test with null value
        gridObj.allowExcelExport = null;
        gridObj.dataBind();
        expect(gridObj.allowExcelExport).toBe(null);

        // Test with undefined value
        gridObj.allowExcelExport = undefined;
        gridObj.dataBind();
        expect(gridObj.allowExcelExport).toBe(undefined);
    });

    // Test cases for allowFiltering public property
    it("allowFiltering", () => {
        // Test with null value
        gridObj.allowFiltering = null;
        gridObj.dataBind();
        expect(gridObj.allowFiltering).toBe(null);

        // Test with undefined value
        gridObj.allowFiltering = undefined;
        gridObj.dataBind();
        expect(gridObj.allowFiltering).toBe(undefined);
    });

    // Test cases for allowGrouping public property
    it("allowGrouping", () => {
        // Test with null value
        gridObj.allowGrouping = null;
        gridObj.dataBind();
        expect(gridObj.allowGrouping).toBe(null);

        // Test with undefined value
        gridObj.allowGrouping = undefined;
        gridObj.dataBind();
        expect(gridObj.allowGrouping).toBe(undefined);
    });

    // Test cases for allowKeyboard public property
    it("allowKeyboard", () => {
        // Test with null value
        gridObj.allowKeyboard = null;
        gridObj.dataBind();
        expect(gridObj.allowKeyboard).toBe(null);

        // Test with undefined value
        gridObj.allowKeyboard = undefined;
        gridObj.dataBind();
        expect(gridObj.allowKeyboard).toBe(undefined);
    });

    // Test cases for allowMultiSorting public property
    it("allowMultiSorting", () => {
        // Test with null value
        gridObj.allowMultiSorting = null;
        gridObj.dataBind();
        expect(gridObj.allowMultiSorting).toBe(null);

        // Test with undefined value
        gridObj.allowMultiSorting = undefined;
        gridObj.dataBind();
        expect(gridObj.allowMultiSorting).toBe(undefined);
    });

    // Test cases for allowPaging public property
    it("allowPaging", () => {
        // Test with null value
        gridObj.allowPaging = null;
        gridObj.dataBind();
        expect(gridObj.allowPaging).toBe(null);

        // Test with undefined value
        gridObj.allowPaging = undefined;
        gridObj.dataBind();
        expect(gridObj.allowPaging).toBe(undefined);
    });

    // Test cases for allowPdfExport public property
    it("allowPdfExport", () => {
        // Test with null value
        gridObj.allowPdfExport = null;
        gridObj.dataBind();
        expect(gridObj.allowPdfExport).toBe(null);

        // Test with undefined value
        gridObj.allowPdfExport = undefined;
        gridObj.dataBind();
        expect(gridObj.allowPdfExport).toBe(undefined);
    });

    // Test cases for allowReordering public property
    it("allowReordering", () => {
        // Test with null value
        gridObj.allowReordering = null;
        gridObj.dataBind();
        expect(gridObj.allowReordering).toBe(null);

        // Test with undefined value
        gridObj.allowReordering = undefined;
        gridObj.dataBind();
        expect(gridObj.allowReordering).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for allowResizing public property
    it("allowResizing", () => {
        // Test with null value
        gridObj.allowResizing = null;
        gridObj.dataBind();
        expect(gridObj.allowResizing).toBe(null);

        // Test with undefined value
        gridObj.allowResizing = undefined;
        gridObj.dataBind();
        expect(gridObj.allowResizing).toBe(undefined);
    });

    // Test cases for allowRowDragAndDrop public property
    it("allowRowDragAndDrop", () => {
        // Test with null value
        gridObj.allowRowDragAndDrop = null;
        gridObj.dataBind();
        expect(gridObj.allowRowDragAndDrop).toBe(null);

        // Test with undefined value
        gridObj.allowRowDragAndDrop = undefined;
        gridObj.dataBind();
        expect(gridObj.allowRowDragAndDrop).toBe(undefined);
    });

    // Test cases for allowSelection public property
    it("allowSelection", () => {
        // Test with null value
        gridObj.allowSelection = null;
        gridObj.dataBind();
        expect(gridObj.allowSelection).toBe(null);

        // Test with undefined value
        gridObj.allowSelection = undefined;
        gridObj.dataBind();
        expect(gridObj.allowSelection).toBe(undefined);
    });

    // Test cases for allowSorting public property
    it("allowSorting", () => {
        // Test with null value
        gridObj.allowSorting = null;
        gridObj.dataBind();
        expect(gridObj.allowSorting).toBe(null);

        // Test with undefined value
        gridObj.allowSorting = undefined;
        gridObj.dataBind();
        expect(gridObj.allowSorting).toBe(undefined);
    });

    // Test cases for allowTextWrap public property
    it("allowTextWrap", () => {
        // Test with null value
        gridObj.allowTextWrap = null;
        gridObj.dataBind();
        expect(gridObj.allowTextWrap).toBe(null);

        // Test with undefined value
        gridObj.allowTextWrap = undefined;
        gridObj.dataBind();
        expect(gridObj.allowTextWrap).toBe(undefined);
    });

    // Test cases for autoFit public property
    it("autoFit", () => {
        // Test with null value
        gridObj.autoFit = null;
        gridObj.dataBind();
        expect(gridObj.autoFit).toBe(null);

        // Test with undefined value
        gridObj.autoFit = undefined;
        gridObj.dataBind();
        expect(gridObj.autoFit).toBe(undefined);
    });

    // Test cases for childGrid public property
    it("childGrid", () => {
        // Test with null value
        gridObj.childGrid = null;
        gridObj.dataBind();
        expect(gridObj.childGrid).toBe(null);

        // Test with undefined value
        gridObj.childGrid = undefined;
        gridObj.dataBind();
        expect(gridObj.childGrid).toBe(undefined);
    });

    // Test cases for clipMode public property
    it("clipMode", () => {
        // Test with null value
        gridObj.clipMode = null;
        gridObj.dataBind();
        expect(gridObj.clipMode).toBe(null);

        // Test with undefined value
        gridObj.clipMode = undefined;
        gridObj.dataBind();
        expect(gridObj.clipMode).toBe(undefined);
    });

    // Test cases for columnMenuItems public property
    it("columnMenuItems", () => {
        // Test with null value
        gridObj.columnMenuItems = null;
        gridObj.dataBind();
        expect(gridObj.columnMenuItems).toBe(null);

        // Test with undefined value
        gridObj.columnMenuItems = undefined;
        gridObj.dataBind();
        expect(gridObj.columnMenuItems).toBe(undefined);
    });

    // Test cases for columnQueryMode public property
    it("columnQueryMode", () => {
        // Test with null value
        gridObj.columnQueryMode = null;
        gridObj.dataBind();
        expect(gridObj.columnQueryMode).toBe(null);

        // Test with undefined value
        gridObj.columnQueryMode = undefined;
        gridObj.dataBind();
        expect(gridObj.columnQueryMode).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for columns public property
    it("columns", () => {
        // Test with null value
        gridObj.columns = null;
        gridObj.dataBind();
        expect(gridObj.columns).toBe(null);

        // Test with undefined value
        gridObj.columns = undefined;
        gridObj.dataBind();
        expect(gridObj.columns).toBe(undefined);
    });

    // Test cases for contextMenuItems public property
    it("contextMenuItems", () => {
        // Test with null value
        gridObj.contextMenuItems = null;
        gridObj.dataBind();
        expect(gridObj.contextMenuItems).toBe(null);

        // Test with undefined value
        gridObj.contextMenuItems = undefined;
        gridObj.dataBind();
        expect(gridObj.contextMenuItems).toBe(undefined);
    });

    // Test cases for cssClass public property
    it("cssClass", () => {
        // Test with null value
        gridObj.cssClass = null;
        gridObj.dataBind();
        expect(gridObj.cssClass).toBe(null);

        // Test with undefined value
        gridObj.cssClass = undefined;
        gridObj.dataBind();
        expect(gridObj.cssClass).toBe(undefined);
    });

    // Test cases for currentAction public property
    it("currentAction", () => {
        // Test with null value
        gridObj.currentAction = null;
        gridObj.dataBind();
        expect(gridObj.currentAction).toBe(null);

        // Test with undefined value
        gridObj.currentAction = undefined;
        gridObj.dataBind();
        expect(gridObj.currentAction).toBe(undefined);
    });

    // Test cases for dataSource public property
    it("dataSource", () => {
        // Test with null value
        gridObj.dataSource = null;
        gridObj.dataBind();
        expect(gridObj.dataSource).toBe(null);

        // Test with undefined value
        gridObj.dataSource = undefined;
        gridObj.dataBind();
        expect(gridObj.dataSource).toBe(undefined);
    });

    // Test cases for detailTemplate public property
    it("detailTemplate", () => {
        // Test with null value
        gridObj.detailTemplate = null;
        gridObj.dataBind();
        expect(gridObj.detailTemplate).toBe(null);

        // Test with undefined value
        gridObj.detailTemplate = undefined;
        gridObj.dataBind();
        expect(gridObj.detailTemplate).toBe(undefined);
    });

    // Test cases for ej2StatePersistenceVersion public property
    it("ej2StatePersistenceVersion", () => {
        // Test with null value
        gridObj.ej2StatePersistenceVersion = null;
        gridObj.dataBind();
        expect(gridObj.ej2StatePersistenceVersion).toBe(null);

        // Test with undefined value
        gridObj.ej2StatePersistenceVersion = undefined;
        gridObj.dataBind();
        expect(gridObj.ej2StatePersistenceVersion).toBe(undefined);
    });

    // Test cases for emptyRecordTemplate public property
    it("emptyRecordTemplate", () => {
        // Test with null value
        gridObj.emptyRecordTemplate = null;
        gridObj.dataBind();
        expect(gridObj.emptyRecordTemplate).toBe(null);

        // Test with undefined value
        gridObj.emptyRecordTemplate = undefined;
        gridObj.dataBind();
        expect(gridObj.emptyRecordTemplate).toBe(undefined);
    });

    // Test cases for enableAdaptiveUI public property
    it("enableAdaptiveUI", () => {
        // Test with null value
        gridObj.enableAdaptiveUI = null;
        gridObj.dataBind();
        expect(gridObj.enableAdaptiveUI).toBe(null);

        // Test with undefined value
        gridObj.enableAdaptiveUI = undefined;
        gridObj.dataBind();
        expect(gridObj.enableAdaptiveUI).toBe(undefined);
    });

    // Test cases for enableAltRow public property
    it("enableAltRow", () => {
        // Test with null value
        gridObj.enableAltRow = null;
        gridObj.dataBind();
        expect(gridObj.enableAltRow).toBe(null);

        // Test with undefined value
        gridObj.enableAltRow = undefined;
        gridObj.dataBind();
        expect(gridObj.enableAltRow).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for enableAutoFill public property
    it("enableAutoFill", () => {
        // Test with null value
        gridObj.enableAutoFill = null;
        gridObj.dataBind();
        expect(gridObj.enableAutoFill).toBe(null);

        // Test with undefined value
        gridObj.enableAutoFill = undefined;
        gridObj.dataBind();
        expect(gridObj.enableAutoFill).toBe(undefined);
    });

    // Test cases for enableColumnVirtualization public property
    it("enableColumnVirtualization", () => {
        // Test with null value
        gridObj.enableColumnVirtualization = null;
        gridObj.dataBind();
        expect(gridObj.enableColumnVirtualization).toBe(null);

        // Test with undefined value
        gridObj.enableColumnVirtualization = undefined;
        gridObj.dataBind();
        expect(gridObj.enableColumnVirtualization).toBe(undefined);
    });

    // Test cases for enableHeaderFocus public property
    it("enableHeaderFocus", () => {
        // Test with null value
        gridObj.enableHeaderFocus = null;
        gridObj.dataBind();
        expect(gridObj.enableHeaderFocus).toBe(null);

        // Test with undefined value
        gridObj.enableHeaderFocus = undefined;
        gridObj.dataBind();
        expect(gridObj.enableHeaderFocus).toBe(undefined);
    });

    // Test cases for enableHover public property
    it("enableHover", () => {
        // Test with null value
        gridObj.enableHover = null;
        gridObj.dataBind();
        expect(gridObj.enableHover).toBe(null);

        // Test with undefined value
        gridObj.enableHover = undefined;
        gridObj.dataBind();
        expect(gridObj.enableHover).toBe(undefined);
    });

    // Test cases for enableHtmlSanitizer public property
    it("enableHtmlSanitizer", () => {
        // Test with null value
        gridObj.enableHtmlSanitizer = null;
        gridObj.dataBind();
        expect(gridObj.enableHtmlSanitizer).toBe(null);

        // Test with undefined value
        gridObj.enableHtmlSanitizer = undefined;
        gridObj.dataBind();
        expect(gridObj.enableHtmlSanitizer).toBe(undefined);
    });

    // Test cases for enableImmutableMode public property
    it("enableImmutableMode", () => {
        // Test with null value
        gridObj.enableImmutableMode = null;
        gridObj.dataBind();
        expect(gridObj.enableImmutableMode).toBe(null);

        // Test with undefined value
        gridObj.enableImmutableMode = undefined;
        gridObj.dataBind();
        expect(gridObj.enableImmutableMode).toBe(undefined);
    });

    // Test cases for enableInfiniteScrolling public property
    it("enableInfiniteScrolling", () => {
        // Test with null value
        gridObj.enableInfiniteScrolling = null;
        gridObj.dataBind();
        expect(gridObj.enableInfiniteScrolling).toBe(null);

        // Test with undefined value
        gridObj.enableInfiniteScrolling = undefined;
        gridObj.dataBind();
        expect(gridObj.enableInfiniteScrolling).toBe(undefined);
    });

    // Test cases for enablePersistence public property
    it("enablePersistence", () => {
        // Test with null value
        gridObj.enablePersistence = null;
        gridObj.dataBind();
        expect(gridObj.enablePersistence).toBe(null);

        // Test with undefined value
        gridObj.enablePersistence = undefined;
        gridObj.dataBind();
        expect(gridObj.enablePersistence).toBe(undefined);
    });

    // Test cases for enableRtl public property
    it("enableRtl", () => {
        // Test with null value
        gridObj.enableRtl = null;
        gridObj.dataBind();
        expect(gridObj.enableRtl).toBe(null);

        // Test with undefined value
        gridObj.enableRtl = undefined;
        gridObj.dataBind();
        expect(gridObj.enableRtl).toBe(undefined);
    });

    // Test cases for enableStickyHeader public property
    it("enableStickyHeader", () => {
        // Test with null value
        gridObj.enableStickyHeader = null;
        gridObj.dataBind();
        expect(gridObj.enableStickyHeader).toBe(null);

        // Test with undefined value
        gridObj.enableStickyHeader = undefined;
        gridObj.dataBind();
        expect(gridObj.enableStickyHeader).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for enableVirtualMaskRow public property
    it("enableVirtualMaskRow", () => {
        // Test with null value
        gridObj.enableVirtualMaskRow = null;
        gridObj.dataBind();
        expect(gridObj.enableVirtualMaskRow).toBe(null);

        // Test with undefined value
        gridObj.enableVirtualMaskRow = undefined;
        gridObj.dataBind();
        expect(gridObj.enableVirtualMaskRow).toBe(undefined);
    });

    // Test cases for enableVirtualization public property
    it("enableVirtualization", () => {
        // Test with null value
        gridObj.enableVirtualization = null;
        gridObj.dataBind();
        expect(gridObj.enableVirtualization).toBe(null);

        // Test with undefined value
        gridObj.enableVirtualization = undefined;
        gridObj.dataBind();
        expect(gridObj.enableVirtualization).toBe(undefined);
    });

    // Test cases for exportGrids public property
    it("exportGrids", () => {
        // Test with null value
        gridObj.exportGrids = null;
        gridObj.dataBind();
        expect(gridObj.exportGrids).toBe(null);

        // Test with undefined value
        gridObj.exportGrids = undefined;
        gridObj.dataBind();
        expect(gridObj.exportGrids).toBe(undefined);
    });

    // Test cases for frozenColumns public property
    it("frozenColumns", () => {
        // Test with null value
        gridObj.frozenColumns = null;
        gridObj.dataBind();
        expect(gridObj.frozenColumns).toBe(null);

        // Test with undefined value
        gridObj.frozenColumns = undefined;
        gridObj.dataBind();
        expect(gridObj.frozenColumns).toBe(undefined);
    });

    // Test cases for frozenRows public property
    it("frozenRows", () => {
        // Test with null value
        gridObj.frozenRows = null;
        gridObj.dataBind();
        expect(gridObj.frozenRows).toBe(null);

        // Test with undefined value
        gridObj.frozenRows = undefined;
        gridObj.dataBind();
        expect(gridObj.frozenRows).toBe(undefined);
    });

    // Test cases for gridLines public property
    it("gridLines", () => {
        // Test with null value
        gridObj.gridLines = null;
        gridObj.dataBind();
        expect(gridObj.gridLines).toBe(null);

        // Test with undefined value
        gridObj.gridLines = undefined;
        gridObj.dataBind();
        expect(gridObj.gridLines).toBe(undefined);
    });

    // Test cases for height public property
    it("height", () => {
        // Test with null value
        gridObj.height = null;
        gridObj.dataBind();
        expect(gridObj.height).toBe(null);

        // Test with undefined value
        gridObj.height = undefined;
        gridObj.dataBind();
        expect(gridObj.height).toBe(undefined);
    });

    // Test cases for hierarchyPrintMode public property
    it("hierarchyPrintMode", () => {
        // Test with null value
        gridObj.hierarchyPrintMode = null;
        gridObj.dataBind();
        expect(gridObj.hierarchyPrintMode).toBe(null);

        // Test with undefined value
        gridObj.hierarchyPrintMode = undefined;
        gridObj.dataBind();
        expect(gridObj.hierarchyPrintMode).toBe(undefined);
    });

    // Test cases for loadingIndicator public property
    it("loadingIndicator", () => {
        // Test with null value
        gridObj.loadingIndicator.indicatorType = null;
        gridObj.dataBind();
        expect(gridObj.loadingIndicator.indicatorType).toBe(null);

        // Test with undefined value
        gridObj.loadingIndicator.indicatorType = undefined;
        gridObj.dataBind();
        expect(gridObj.loadingIndicator.indicatorType).toBe(undefined);
    });

    // Test cases for locale public property
    it("locale", () => {
        // Test with null value
        gridObj.locale = null;
        gridObj.dataBind();
        expect(gridObj.locale).toBe(null);

        // Test with undefined value
        gridObj.locale = undefined;
        gridObj.dataBind();
        expect(gridObj.locale).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for pagerTemplate public property
    it("pagerTemplate", () => {
        // Test with null value
        gridObj.pagerTemplate = null;
        gridObj.dataBind();
        expect(gridObj.pagerTemplate).toBe(null);

        // Test with undefined value
        gridObj.pagerTemplate = undefined;
        gridObj.dataBind();
        expect(gridObj.pagerTemplate).toBe(undefined);
    });

    // Test cases for parentDetails public property
    it("parentDetails", () => {
        // Test with null value
        gridObj.parentDetails = null;
        gridObj.dataBind();
        expect(gridObj.parentDetails).toBe(null);

        // Test with undefined value
        gridObj.parentDetails = undefined;
        gridObj.dataBind();
        expect(gridObj.parentDetails).toBe(undefined);
    });

    // Test cases for printMode public property
    it("printMode", () => {
        // Test with null value
        gridObj.printMode = null;
        gridObj.dataBind();
        expect(gridObj.printMode).toBe(null);

        // Test with undefined value
        gridObj.printMode = undefined;
        gridObj.dataBind();
        expect(gridObj.printMode).toBe(undefined);
    });

    // Test cases for query public property
    it("query", () => {
        // Test with null value
        gridObj.query = null;
        gridObj.dataBind();
        expect(gridObj.query).toBe(null);

        // Test with undefined value
        gridObj.query = undefined;
        gridObj.dataBind();
        expect(gridObj.query).toBe(undefined);
    });

    // Test cases for queryString public property
    it("queryString", () => {
        // Test with null value
        gridObj.queryString = null;
        gridObj.dataBind();
        expect(gridObj.queryString).toBe(null);

        // Test with undefined value
        gridObj.queryString = undefined;
        gridObj.dataBind();
        expect(gridObj.queryString).toBe(undefined);
    });

    // Test cases for requireTemplateRef public property
    it("requireTemplateRef", () => {
        // Test with null value
        gridObj.requireTemplateRef = null;
        gridObj.dataBind();
        expect(gridObj.requireTemplateRef).toBe(null);

        // Test with undefined value
        gridObj.requireTemplateRef = undefined;
        gridObj.dataBind();
        expect(gridObj.requireTemplateRef).toBe(undefined);
    });

    // Test cases for rowHeight public property
    it("rowHeight", () => {
        // Test with null value
        gridObj.rowHeight = null;
        gridObj.dataBind();
        expect(gridObj.rowHeight).toBe(null);

        // Test with undefined value
        gridObj.rowHeight = undefined;
        gridObj.dataBind();
        expect(gridObj.rowHeight).toBe(undefined);
    });

    // Test cases for rowRenderingMode public property
    it("rowRenderingMode", () => {
        // Test with null value
        gridObj.rowRenderingMode = null;
        gridObj.dataBind();
        expect(gridObj.rowRenderingMode).toBe(null);

        // Test with undefined value
        gridObj.rowRenderingMode = undefined;
        gridObj.dataBind();
        expect(gridObj.rowRenderingMode).toBe(undefined);
    });

    // Test cases for rowTemplate public property
    it("rowTemplate", () => {
        // Test with null value
        gridObj.rowTemplate = null;
        gridObj.dataBind();
        expect(gridObj.rowTemplate).toBe(null);

        // Test with undefined value
        gridObj.rowTemplate = undefined;
        gridObj.dataBind();
        expect(gridObj.rowTemplate).toBe(undefined);
    });

    // Test cases for selectedRowIndex public property
    it("selectedRowIndex", () => {
        // Test with null value
        gridObj.selectedRowIndex = null;
        gridObj.dataBind();
        expect(gridObj.selectedRowIndex).toBe(null);

        // Test with undefined value
        gridObj.selectedRowIndex = undefined;
        gridObj.dataBind();
        expect(gridObj.selectedRowIndex).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for showColumnChooser public property
    it("showColumnChooser", () => {
        // Test with null value
        gridObj.showColumnChooser = null;
        gridObj.dataBind();
        expect(gridObj.showColumnChooser).toBe(null);

        // Test with undefined value
        gridObj.showColumnChooser = undefined;
        gridObj.dataBind();
        expect(gridObj.showColumnChooser).toBe(undefined);
    });

    // Test cases for showColumnMenu public property
    it("showColumnMenu", () => {
        // Test with null value
        gridObj.showColumnMenu = null;
        gridObj.dataBind();
        expect(gridObj.showColumnMenu).toBe(null);

        // Test with undefined value
        gridObj.showColumnMenu = undefined;
        gridObj.dataBind();
        expect(gridObj.showColumnMenu).toBe(undefined);
    });

    // Test cases for showHider public property
    it("showHider", () => {
        // Test with null value
        gridObj.showHider = null;
        gridObj.dataBind();
        expect(gridObj.showHider).toBe(null);

        // Test with undefined value
        gridObj.showHider = undefined;
        gridObj.dataBind();
        expect(gridObj.showHider).toBe(undefined);
    });

    // Test cases for toolbar public property
    it("toolbar", () => {
        // Test with null value
        gridObj.toolbar = null;
        gridObj.dataBind();
        expect(gridObj.toolbar).toBe(null);

        // Test with undefined value
        gridObj.toolbar = undefined;
        gridObj.dataBind();
        expect(gridObj.toolbar).toBe(undefined);
    });

    // Test cases for toolbarTemplate public property
    it("toolbarTemplate", () => {
        // Test with null value
        gridObj.toolbarTemplate = null;
        gridObj.dataBind();
        expect(gridObj.toolbarTemplate).toBe(null);

        // Test with undefined value
        gridObj.toolbarTemplate = undefined;
        gridObj.dataBind();
        expect(gridObj.toolbarTemplate).toBe(undefined);
    });

    // Test cases for width public property
    it("width", () => {
        // Test with null value
        gridObj.width = null;
        gridObj.dataBind();
        expect(gridObj.width).toBe(null);

        // Test with undefined value
        gridObj.width = undefined;
        gridObj.dataBind();
        expect(gridObj.width).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for each public property
    it("clipboardModule", () => {
        // Test with null value
        gridObj.clipboardModule = null;
        gridObj.dataBind();
        expect(gridObj.clipboardModule).toBe(null);

        // Test with undefined value
        gridObj.clipboardModule = undefined;
        gridObj.dataBind();
        expect(gridObj.clipboardModule).toBe(undefined);
    });

    // Test cases for each public property
    it("columnMenuModule", () => {
        // Test with null value
        gridObj.columnMenuModule = null;
        gridObj.dataBind();
        expect(gridObj.columnMenuModule).toBe(null);

        // Test with undefined value
        gridObj.columnMenuModule = undefined;
        gridObj.dataBind();
        expect(gridObj.columnMenuModule).toBe(undefined);
    });

    // Test cases for each public property
    it("contextMenuModule", () => {
        // Test with null value
        gridObj.contextMenuModule = null;
        gridObj.dataBind();
        expect(gridObj.contextMenuModule).toBe(null);

        // Test with undefined value
        gridObj.contextMenuModule = undefined;
        gridObj.dataBind();
        expect(gridObj.contextMenuModule).toBe(undefined);
    });

    // Test cases for each public property
    it("editModule", () => {
        // Test with null value
        gridObj.editModule = null;
        gridObj.dataBind();
        expect(gridObj.editModule).toBe(null);

        // Test with undefined value
        gridObj.editModule = undefined;
        gridObj.dataBind();
        expect(gridObj.editModule).toBe(undefined);
    });

    // Test cases for each public property
    it("excelExportModule", () => {
        // Test with null value
        gridObj.excelExportModule = null;
        gridObj.dataBind();
        expect(gridObj.excelExportModule).toBe(null);

        // Test with undefined value
        gridObj.excelExportModule = undefined;
        gridObj.dataBind();
        expect(gridObj.excelExportModule).toBe(undefined);
    });

    // Test cases for each public property
    it("filterModule", () => {
        // Test with null value
        gridObj.filterModule = null;
        gridObj.dataBind();
        expect(gridObj.filterModule).toBe(null);

        // Test with undefined value
        gridObj.filterModule = undefined;
        gridObj.dataBind();
        expect(gridObj.filterModule).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});


describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for each public property
    it("groupModule", () => {
        // Test with null value
        gridObj.groupModule = null;
        gridObj.dataBind();
        expect(gridObj.groupModule).toBe(null);

        // Test with undefined value
        gridObj.groupModule = undefined;
        gridObj.dataBind();
        expect(gridObj.groupModule).toBe(undefined);
    });

    // Test cases for each public property
    it("infiniteScrollModule", () => {
        // Test with null value
        gridObj.infiniteScrollModule = null;
        gridObj.dataBind();
        expect(gridObj.infiniteScrollModule).toBe(null);

        // Test with undefined value
        gridObj.infiniteScrollModule = undefined;
        gridObj.dataBind();
        expect(gridObj.infiniteScrollModule).toBe(undefined);
    });

    // Test cases for each public property
    it("keyboardModule", () => {
        // Test with null value
        gridObj.keyboardModule = null;
        gridObj.dataBind();
        expect(gridObj.keyboardModule).toBe(null);

        // Test with undefined value
        gridObj.keyboardModule = undefined;
        gridObj.dataBind();
        expect(gridObj.keyboardModule).toBe(undefined);
    });

    // Test cases for each public property
    it("pagerModule", () => {
        // Test with null value
        gridObj.pagerModule = null;
        gridObj.dataBind();
        expect(gridObj.pagerModule).toBe(null);

        // Test with undefined value
        gridObj.pagerModule = undefined;
        gridObj.dataBind();
        expect(gridObj.pagerModule).toBe(undefined);
    });

    // Test cases for each public property
    it("pdfExportModule", () => {
        // Test with null value
        gridObj.pdfExportModule = null;
        gridObj.dataBind();
        expect(gridObj.pdfExportModule).toBe(null);

        // Test with undefined value
        gridObj.pdfExportModule = undefined;
        gridObj.dataBind();
        expect(gridObj.pdfExportModule).toBe(undefined);
    });

    // Test cases for each public property
    it("printModule", () => {
        // Test with null value
        gridObj.printModule = null;
        gridObj.dataBind();
        expect(gridObj.printModule).toBe(null);

        // Test with undefined value
        gridObj.printModule = undefined;
        gridObj.dataBind();
        expect(gridObj.printModule).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for each public property
    it("reorderModule", () => {
        // Test with null value
        gridObj.reorderModule = null;
        gridObj.dataBind();
        expect(gridObj.reorderModule).toBe(null);

        // Test with undefined value
        gridObj.reorderModule = undefined;
        gridObj.dataBind();
        expect(gridObj.reorderModule).toBe(undefined);
    });

    // Test cases for each public property
    it("rowDragAndDropModule", () => {
        // Test with null value
        gridObj.rowDragAndDropModule = null;
        gridObj.dataBind();
        expect(gridObj.rowDragAndDropModule).toBe(null);

        // Test with undefined value
        gridObj.rowDragAndDropModule = undefined;
        gridObj.dataBind();
        expect(gridObj.rowDragAndDropModule).toBe(undefined);
    });

    // Test cases for each public property
    it("scrollModule", () => {
        // Test with null value
        gridObj.scrollModule = null;
        gridObj.dataBind();
        expect(gridObj.scrollModule).toBe(null);

        // Test with undefined value
        gridObj.scrollModule = undefined;
        gridObj.dataBind();
        expect(gridObj.scrollModule).toBe(undefined);
    });

    // Test cases for each public property
    it("searchModule", () => {
        // Test with null value
        gridObj.searchModule = null;
        gridObj.dataBind();
        expect(gridObj.searchModule).toBe(null);

        // Test with undefined value
        gridObj.searchModule = undefined;
        gridObj.dataBind();
        expect(gridObj.searchModule).toBe(undefined);
    });

    // Test cases for each public property
    it("selectionModule", () => {
        // Test with null value
        gridObj.selectionModule = null;
        gridObj.dataBind();
        expect(gridObj.selectionModule).toBe(null);

        // Test with undefined value
        gridObj.selectionModule = undefined;
        gridObj.dataBind();
        expect(gridObj.selectionModule).toBe(undefined);
    });

    // Test cases for each public property
    it("sortModule", () => {
        // Test with null value
        gridObj.sortModule = null;
        gridObj.dataBind();
        expect(gridObj.sortModule).toBe(null);

        // Test with undefined value
        gridObj.sortModule = undefined;
        gridObj.dataBind();
        expect(gridObj.sortModule).toBe(undefined);
    });

    // Test cases for each public property
    it("toolbarModule", () => {
        // Test with null value
        gridObj.toolbarModule = null;
        gridObj.dataBind();
        expect(gridObj.toolbarModule).toBe(null);

        // Test with undefined value
        gridObj.toolbarModule = undefined;
        gridObj.dataBind();
        expect(gridObj.toolbarModule).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for each public property
    it("columnChooserSettings", () => {
        // Test with null value
        gridObj.columnChooserSettings.ignoreAccent = null;
        gridObj.columnChooserSettings.operator = null;
        gridObj.dataBind();
        expect(gridObj.columnChooserSettings.ignoreAccent).toBe(null);
        expect(gridObj.columnChooserSettings.operator).toBe(null);

        // Test with undefined value
        gridObj.columnChooserSettings.ignoreAccent = undefined;
        gridObj.columnChooserSettings.operator = undefined;
        gridObj.dataBind();
        expect(gridObj.columnChooserSettings.ignoreAccent).toBe(undefined);
        expect(gridObj.columnChooserSettings.operator).toBe(undefined);
    });

    // Test cases for each public property
    it("editSettings", () => {
        // Test with null value
        gridObj.editSettings.allowAdding = null;
        gridObj.editSettings.allowDeleting = null;
        gridObj.editSettings.allowEditOnDblClick = null;
        gridObj.editSettings.allowEditing = null;
        gridObj.editSettings.allowNextRowEdit = null;
        gridObj.editSettings.dialog = null;
        gridObj.editSettings.footerTemplate = null;
        gridObj.editSettings.headerTemplate = null;
        gridObj.editSettings.mode = null;
        gridObj.dataBind();
        expect(gridObj.editSettings.allowAdding).toBe(null);
        expect(gridObj.editSettings.allowDeleting).toBe(null);
        expect(gridObj.editSettings.allowEditOnDblClick).toBe(null);
        expect(gridObj.editSettings.allowEditing).toBe(null);
        expect(gridObj.editSettings.allowNextRowEdit).toBe(null);
        expect(gridObj.editSettings.dialog).toBe(null);
        expect(gridObj.editSettings.footerTemplate).toBe(null);
        expect(gridObj.editSettings.headerTemplate).toBe(null);
        expect(gridObj.editSettings.mode).toBe(null);

        // Test with undefined value
        gridObj.editSettings.allowAdding = undefined;
        gridObj.editSettings.allowDeleting = undefined;
        gridObj.editSettings.allowEditOnDblClick= undefined;
        gridObj.editSettings.allowEditing = undefined;
        gridObj.editSettings.allowNextRowEdit = undefined;
        gridObj.editSettings.dialog = undefined;
        gridObj.editSettings.footerTemplate = undefined;
        gridObj.editSettings.headerTemplate = undefined;
        gridObj.editSettings.mode = undefined;
        gridObj.dataBind();
        expect(gridObj.editSettings.allowAdding).toBe(undefined);
        expect(gridObj.editSettings.allowDeleting).toBe(undefined);
        expect(gridObj.editSettings.allowEditOnDblClick).toBe(undefined);
        expect(gridObj.editSettings.allowEditing).toBe(undefined);
        expect(gridObj.editSettings.allowNextRowEdit).toBe(undefined);
        expect(gridObj.editSettings.dialog).toBe(undefined);
        expect(gridObj.editSettings.footerTemplate).toBe(undefined);
        expect(gridObj.editSettings.headerTemplate).toBe(undefined);
        expect(gridObj.editSettings.mode).toBe(undefined);
    });

    // Test cases for each public property
    it("filterSettings", () => {
        // Test with null value
        gridObj.filterSettings.columns = null;
        gridObj.filterSettings.enableCaseSensitivity = null;
        gridObj.filterSettings.enableInfiniteScrolling = null;
        gridObj.filterSettings.ignoreAccent = null;
        gridObj.filterSettings.immediateModeDelay = null;
        gridObj.filterSettings.itemsCount = null;
        gridObj.filterSettings.loadingIndicator = null;
        gridObj.filterSettings.mode = null;
        gridObj.filterSettings.operators = null;
        gridObj.filterSettings.showFilterBarOperator = null;
        gridObj.filterSettings.showFilterBarStatus = null;
        gridObj.filterSettings.type = null;
        gridObj.dataBind();
        expect(gridObj.filterSettings.columns.length).toBe(0);
        expect(gridObj.filterSettings.enableCaseSensitivity).toBe(null);
        expect(gridObj.filterSettings.enableInfiniteScrolling).toBe(null);
        expect(gridObj.filterSettings.ignoreAccent).toBe(null);
        expect(gridObj.filterSettings.immediateModeDelay).toBe(null);
        expect(gridObj.filterSettings.itemsCount).toBe(null);
        expect(gridObj.filterSettings.loadingIndicator).toBe(null);
        expect(gridObj.filterSettings.mode).toBe(null);
        expect(gridObj.filterSettings.operators).toBe(null);
        expect(gridObj.filterSettings.showFilterBarOperator).toBe(null);
        expect(gridObj.filterSettings.showFilterBarStatus).toBe(null);
        expect(gridObj.filterSettings.type).toBe(null);

        // Test with undefined value
        gridObj.filterSettings.columns = undefined;
        gridObj.filterSettings.enableCaseSensitivity = undefined;
        gridObj.filterSettings.enableInfiniteScrolling = undefined;
        gridObj.filterSettings.ignoreAccent = undefined;
        gridObj.filterSettings.immediateModeDelay = undefined;
        gridObj.filterSettings.itemsCount = undefined;
        gridObj.filterSettings.loadingIndicator = undefined;
        gridObj.filterSettings.mode = undefined;
        gridObj.filterSettings.operators = undefined;
        gridObj.filterSettings.showFilterBarOperator = undefined;
        gridObj.filterSettings.showFilterBarStatus = undefined;
        gridObj.filterSettings.type = undefined;
        gridObj.dataBind();
        expect(gridObj.filterSettings.columns.length).toBe(0);
        expect(gridObj.filterSettings.enableCaseSensitivity).toBe(undefined);
        expect(gridObj.filterSettings.enableInfiniteScrolling).toBe(undefined);
        expect(gridObj.filterSettings.ignoreAccent).toBe(undefined);
        expect(gridObj.filterSettings.immediateModeDelay).toBe(undefined);
        expect(gridObj.filterSettings.itemsCount).toBe(undefined);
        expect(gridObj.filterSettings.loadingIndicator).toBe(undefined);
        expect(gridObj.filterSettings.mode).toBe(undefined);
        expect(gridObj.filterSettings.operators).toBe(undefined);
        expect(gridObj.filterSettings.showFilterBarOperator).toBe(undefined);
        expect(gridObj.filterSettings.showFilterBarStatus).toBe(undefined);
        expect(gridObj.filterSettings.type).toBe(undefined);
    });

    // Test cases for each public property
    it("groupSettings", () => {
        // Test with null value
        gridObj.groupSettings.allowReordering = null;
        gridObj.groupSettings.captionTemplate = null;
        gridObj.groupSettings.columns = null;
        gridObj.groupSettings.disablePageWiseAggregates = null;
        gridObj.groupSettings.enableLazyLoading = null;
        gridObj.groupSettings.showDropArea = null;
        gridObj.groupSettings.showGroupedColumn = null;
        gridObj.groupSettings.showToggleButton = null;
        gridObj.groupSettings.showUngroupButton = null;
        gridObj.dataBind();
        expect(gridObj.groupSettings.allowReordering).toBe(null);
        expect(gridObj.groupSettings.captionTemplate).toBe(null);
        expect(gridObj.groupSettings.columns).toBe(null);
        expect(gridObj.groupSettings.disablePageWiseAggregates).toBe(null);
        expect(gridObj.groupSettings.enableLazyLoading).toBe(null);
        expect(gridObj.groupSettings.showDropArea).toBe(null);
        expect(gridObj.groupSettings.showGroupedColumn).toBe(null);
        expect(gridObj.groupSettings.showToggleButton).toBe(null);
        expect(gridObj.groupSettings.showUngroupButton).toBe(null);

        // Test with undefined value
        gridObj.groupSettings.allowReordering = undefined;
        gridObj.groupSettings.captionTemplate = undefined;
        gridObj.groupSettings.columns = undefined;
        gridObj.groupSettings.disablePageWiseAggregates = undefined;
        gridObj.groupSettings.enableLazyLoading = undefined;
        gridObj.groupSettings.showDropArea = undefined;
        gridObj.groupSettings.showGroupedColumn = undefined;
        gridObj.groupSettings.showToggleButton = undefined;
        gridObj.groupSettings.showUngroupButton = undefined;
        gridObj.dataBind();
        expect(gridObj.groupSettings.allowReordering).toBe(undefined);
        expect(gridObj.groupSettings.captionTemplate).toBe(undefined);
        expect(gridObj.groupSettings.columns).toBe(undefined);
        expect(gridObj.groupSettings.disablePageWiseAggregates).toBe(undefined);
        expect(gridObj.groupSettings.enableLazyLoading).toBe(undefined);
        expect(gridObj.groupSettings.showDropArea).toBe(undefined);
        expect(gridObj.groupSettings.showGroupedColumn).toBe(undefined);
        expect(gridObj.groupSettings.showToggleButton).toBe(undefined);
        expect(gridObj.groupSettings.showUngroupButton).toBe(undefined);
    });


    // Test cases for each public property
    it("infiniteScrollSettings", () => {
        // Test with null value
        gridObj.infiniteScrollSettings.enableCache = null;
        gridObj.infiniteScrollSettings.initialBlocks = null;
        gridObj.infiniteScrollSettings.maxBlocks = null;
        gridObj.dataBind();
        expect(gridObj.infiniteScrollSettings.enableCache).toBe(null);
        expect(gridObj.infiniteScrollSettings.initialBlocks).toBe(null);
        expect(gridObj.infiniteScrollSettings.maxBlocks).toBe(null);

        // Test with undefined value
        gridObj.infiniteScrollSettings.enableCache = undefined;
        gridObj.infiniteScrollSettings.initialBlocks = undefined;
        gridObj.infiniteScrollSettings.maxBlocks = undefined;
        gridObj.dataBind();
        expect(gridObj.infiniteScrollSettings.enableCache).toBe(undefined);
        expect(gridObj.infiniteScrollSettings.initialBlocks).toBe(undefined);
        expect(gridObj.infiniteScrollSettings.maxBlocks).toBe(undefined);
    });

    // Test cases for each public property
    it("pageSettings", () => {
        // Test with null value
        gridObj.pageSettings.currentPage = null;
        gridObj.pageSettings.enableQueryString = null;
        gridObj.pageSettings.pageCount = null;
        gridObj.pageSettings.pageSize = null;
        gridObj.pageSettings.pageSizes = null;
        gridObj.pageSettings.template = null;
        gridObj.dataBind();
        expect(gridObj.pageSettings.currentPage).toBe(null);
        expect(gridObj.pageSettings.enableQueryString).toBe(null);
        expect(gridObj.pageSettings.pageCount).toBe(null);
        expect(gridObj.pageSettings.pageSize).toBe(null);
        expect(gridObj.pageSettings.pageSizes).toBe(null);
        expect(gridObj.pageSettings.template).toBe(null);

        // Test with undefined value
        gridObj.pageSettings.currentPage = undefined;
        gridObj.pageSettings.enableQueryString = undefined;
        gridObj.pageSettings.pageCount = undefined;
        gridObj.pageSettings.pageSize = undefined;
        gridObj.pageSettings.pageSizes = undefined;
        gridObj.pageSettings.template = undefined;
        gridObj.dataBind();
        expect(gridObj.pageSettings.currentPage).toBe(undefined);
        expect(gridObj.pageSettings.enableQueryString).toBe(undefined);
        expect(gridObj.pageSettings.pageCount).toBe(undefined);
        expect(gridObj.pageSettings.pageSize).toBe(undefined);
        expect(gridObj.pageSettings.pageSizes).toBe(undefined);
        expect(gridObj.pageSettings.template).toBe(undefined);
    });

        // Test cases for each public property
        it("resizeSettings", () => {
            // Test with null value
            gridObj.resizeSettings.mode = null;
            gridObj.dataBind();
            expect(gridObj.resizeSettings.mode).toBe(null);
    
            // Test with undefined value
            gridObj.resizeSettings.mode = undefined;
            gridObj.dataBind();
            expect(gridObj.resizeSettings.mode).toBe(undefined);
        });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe("Grid Public properties null or undefined value testing", () => {
    let gridObj: Grid;
    // Setup
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                columns: [
                    { field: 'OrderID', headerText: 'Order ID' },
                    { field: 'CustomerID', headerText: 'Customer Name',  },
                    { field: 'ShipCity', headerText: 'Ship Cit' }]
            }, done);
        });

    // Test cases for each public property
    it("rowDropSettings", () => {
        // Test with null value
        gridObj.rowDropSettings.targetID= null;
        gridObj.dataBind();
        expect(gridObj.rowDropSettings.targetID).toBe(null);

        // Test with undefined value
        gridObj.rowDropSettings.targetID= undefined;
        gridObj.dataBind();
        expect(gridObj.rowDropSettings.targetID).toBe(undefined);
    });

    // Test cases for each public property
    it("searchSettings", () => {
        // Test with null value
        gridObj.searchSettings.fields = null;
        gridObj.searchSettings.ignoreAccent = null;
        gridObj.searchSettings.ignoreCase = null;
        gridObj.searchSettings.key = null;
        gridObj.searchSettings.operator = null;
        gridObj.dataBind();
        expect(gridObj.searchSettings.fields).toBe(null);
        expect(gridObj.searchSettings.ignoreAccent).toBe(null);
        expect(gridObj.searchSettings.ignoreCase).toBe(null);
        expect(gridObj.searchSettings.key).toBe(null);
        expect(gridObj.searchSettings.operator).toBe(null);

        // Test with undefined value
        gridObj.searchSettings.fields = undefined;
        gridObj.searchSettings.ignoreAccent = undefined;
        gridObj.searchSettings.ignoreCase = undefined;
        gridObj.searchSettings.key = undefined;
        gridObj.searchSettings.operator = undefined;
        gridObj.dataBind();
        expect(gridObj.searchSettings.fields).toBe(undefined);
        expect(gridObj.searchSettings.ignoreAccent).toBe(undefined);
        expect(gridObj.searchSettings.ignoreCase).toBe(undefined);
        expect(gridObj.searchSettings.key).toBe(undefined);
        expect(gridObj.searchSettings.operator).toBe(undefined);
    });

    // Test cases for each public property
    it("selectionSettings", () => {
        // Test with null value
        gridObj.selectionSettings.allowColumnSelection = null;
        gridObj.selectionSettings.cellSelectionMode = null;
        gridObj.selectionSettings.checkboxMode = null;
        gridObj.selectionSettings.checkboxOnly = null;
        gridObj.selectionSettings.enableSimpleMultiRowSelection = null;
        gridObj.selectionSettings.enableToggle = null;
        gridObj.selectionSettings.mode = null;
        gridObj.selectionSettings.persistSelection = null;
        gridObj.selectionSettings.mode = null;
        gridObj.selectionSettings.type = null;
        gridObj.dataBind();
        expect(gridObj.selectionSettings.allowColumnSelection).toBe(null);
        expect(gridObj.selectionSettings.cellSelectionMode).toBe(null);
        expect(gridObj.selectionSettings.checkboxMode).toBe(null);
        expect(gridObj.selectionSettings.checkboxOnly).toBe(null);
        expect(gridObj.selectionSettings.enableSimpleMultiRowSelection).toBe(null);
        expect(gridObj.selectionSettings.enableToggle).toBe(null);
        expect(gridObj.selectionSettings.mode).toBe(null);
        expect(gridObj.selectionSettings.type).toBe(null);
        expect(gridObj.selectionSettings.mode).toBe(null);
        expect(gridObj.selectionSettings.persistSelection).toBe(null);

        // Test with undefined value
        gridObj.selectionSettings.allowColumnSelection = undefined;
        gridObj.selectionSettings.cellSelectionMode = undefined;
        gridObj.selectionSettings.checkboxMode = undefined;
        gridObj.selectionSettings.checkboxOnly = undefined;
        gridObj.selectionSettings.enableSimpleMultiRowSelection = undefined;
        gridObj.selectionSettings.enableToggle = undefined;
        gridObj.selectionSettings.mode = undefined;
        gridObj.selectionSettings.persistSelection = undefined;
        gridObj.selectionSettings.mode = undefined;
        gridObj.selectionSettings.type = undefined;
        gridObj.dataBind();
        expect(gridObj.selectionSettings.allowColumnSelection).toBe(undefined);
        expect(gridObj.selectionSettings.cellSelectionMode).toBe(undefined);
        expect(gridObj.selectionSettings.checkboxMode).toBe(undefined);
        expect(gridObj.selectionSettings.checkboxOnly).toBe(undefined);
        expect(gridObj.selectionSettings.enableSimpleMultiRowSelection).toBe(undefined);
        expect(gridObj.selectionSettings.enableToggle).toBe(undefined);
        expect(gridObj.selectionSettings.mode).toBe(undefined);
        expect(gridObj.selectionSettings.type).toBe(undefined);
        expect(gridObj.selectionSettings.mode).toBe(undefined);
        expect(gridObj.selectionSettings.persistSelection).toBe(undefined);
    });

    // Test cases for each public property
    it("sortSettings", () => {
        // Test with null value
        gridObj.sortSettings.allowUnsort = null;
        gridObj.sortSettings.columns = null;
        gridObj.dataBind();
        expect(gridObj.sortSettings.allowUnsort).toBe(null);
        expect(gridObj.sortSettings.columns.length).toBe(0);

        // Test with undefined value
        gridObj.sortSettings.allowUnsort = undefined;
        gridObj.sortSettings.columns = undefined;
        gridObj.dataBind();
        expect(gridObj.sortSettings.allowUnsort).toBe(undefined);
        expect(gridObj.sortSettings.columns.length).toBe(0);
    });

    // Test cases for each public property
    it("textWrapSettings", () => {
        // Test with null value
        gridObj.textWrapSettings.wrapMode= null;
        gridObj.dataBind();
        expect(gridObj.textWrapSettings.wrapMode).toBe(null);

        // Test with undefined value
        gridObj.textWrapSettings.wrapMode= undefined;
        gridObj.dataBind();
        expect(gridObj.textWrapSettings.wrapMode).toBe(undefined);
    });

    // Cleanup
    afterAll(() => {
        destroy(gridObj);
    });

});

describe('EJ2-883850: Custom localization apply on expand/collapse icon =>', () => {
    let grid: Grid;
    beforeAll((done: Function) => {
        L10n.load({
            'de-DE': {
                'grid': {
                    'Expanded':'Expandido',
                    'Collapsed':'Colapsado'
                }
            }
        });

        grid = createGrid(
            {
            dataSource: filterData,
            locale: 'de-DE',
            allowGrouping: true,
            allowPaging: true,
            groupSettings: { columns: ['CustomerID'],showGroupedColumn: true },
            pageSettings: { pageSize: 6 },
            columns: [
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                { field: 'Freight', headerText: 'Freight', width: 150, format:'C2', textAlign: 'Right' },
                { field: 'ShipName', headerText: 'Ship Name', width: 150 }
            ]
        },done);
    });

    it('expandcollapse rows method testing', () => {
        let expandElem = grid.getContent().querySelectorAll('.e-recordplusexpand');
        grid.groupModule.expandCollapseRows(expandElem[1]);
        // EJ2-883850 - Screen Reader not announcing the state of the expand and collapse icon properly
        expect(expandElem[0].firstElementChild.getAttribute('title')).toBe('Expandido');
        grid.groupModule.expandCollapseRows(expandElem[0]);

        // EJ2-883850 - Screen Reader not announcing the state of the expand and collapse icon properly
        expect(expandElem[0].firstElementChild.getAttribute('title')).toBe('Colapsado');
    });
    afterAll(() => {
        destroy(grid);
        grid = null;
    });

});


describe('Code Coverage feature - 1 =>', () => {
    let grid: Grid;
    beforeAll((done: Function) => {
        grid = createGrid(
            {
            dataSource: filterData,
            allowPaging: true,
            pageSettings: { pageSize: 6 },
            columns: [
                { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                { field: 'Freight', headerText: 'Freight', width: 150, format:'C2', textAlign: 'Right' },
                { field: 'ShipName', headerText: 'Ship Name', width: 150 }
            ]
        },done);
    });

    it('Remove Focus Check', () => {
        (grid as any).focusModule.focusOutFromHeader();
        (grid as any).focusModule.content.matrix.get(0, 0 , [-1, 0]);
        (grid.element.querySelectorAll('.e-rowcell')[2] as any).click();
        (grid as any).focusModule.currentInfo.element.parentElement.innerHTML = '';
        (grid as any).isReact = true;
        (grid as any).focusModule.removeFocus();
    });

    it('searchBlur coverage', () => {
        (grid as any).focusModule.content.getNextCurrent();
        grid.columns = [];
        (grid as any).focusModule.setFirstFocusableTabIndex();
        (grid as any).headerModule.headerTable = null;
        (grid as any).headerModule.refreshUI();
        (grid as any).headerModule.droppable = null;
        (grid as any).headerModule.droppableDestroy();
        (grid as any).headerModule.drag({});
    });

    afterAll(() => {
        destroy(grid);
        grid = null;
    });


    describe('Code Coverage feature - 2 =>', () => {
        let grid: Grid;
        let preventDefault: Function = new Function();
        beforeAll((done: Function) => {
            let templete: string = '<div></div>';
            document.body.appendChild(createElement('div', { innerHTML: templete, id: 'toolbar' }));
            grid = createGrid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    pageSettings: { pageSize: 6 },
                    toolbarTemplate: '#toolbar',
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                        { field: 'Freight', headerText: 'Freight', width: 150, format: 'C2', textAlign: 'Right' },
                        { field: 'ShipName', headerText: 'Ship Name', width: 150 }
                    ]
                }, done);
        });

        it('focus focusVirtualElement and focusOutFromHeader coverage', () => {
            (grid as any).focusModule.showAddNewRowFocus();
            (grid as any).focusModule.focusVirtualElement();
            (grid as any).focusModule.focusOutFromHeader({ preventDefault: preventDefault });
            (grid as any).headerModule.createTable(grid.element.querySelector('.e-headercontent'));
            (grid as any).contentModule.contentTable.innerHTML = '';
            (grid as any).focusModule.setLastContentCellTabIndex()
        });

        afterAll(() => {
            destroy(grid);
            grid = preventDefault = null;
        });
    });


    describe('Code Coverage feature - 3 =>', () => {
        let grid: Grid;
        let preventDefault: Function = new Function();
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    allowGrouping: true,
                    toolbar: ['Add'],
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                        { field: 'Freight', headerText: 'Freight', width: 150, format: 'C2', textAlign: 'Right' },
                        { field: 'ShipName', headerText: 'Ship Name', width: 150 }
                    ]
                }, done);
        });


        it('onkeypress shiftTab key coverage', () => {
            (grid as any).focusModule.onKeyPress ({ target: grid.element,  action: 'shiftTab', preventDefault: preventDefault });
            (grid as any).focusModule.onKeyPress ({ target: grid.element.querySelector('.e-groupdroparea'),  action: 'shiftTab', preventDefault: preventDefault });
            grid.groupSettings.showDropArea  = false;
            (grid as any).focusModule.onKeyPress ({ target: grid.element.querySelector('.e-toolbar'),  action: 'shiftTab', preventDefault: preventDefault });
        });

        it('onkeypress tab key coverage', () => {
            (grid as any).focusModule.onKeyPress({ target: grid.element, action: 'tab', preventDefault: preventDefault });
            (grid as any).toolbar = null;
            (grid as any).focusModule.onKeyPress({ target: grid.element.querySelector('.e-groupdroparea'), action: 'tab', preventDefault: preventDefault });
        });

        it('focusOutFromHeader coverage', () => {
            (grid as any).focusModule.content.getNextCurrent(undefined);
            (grid as any).focusModule.focusOutFromHeader({ preventDefault: preventDefault });
            (grid as any).headerModule.createHeader(undefined);
        });


        afterAll(() => {
            destroy(grid);
            grid = preventDefault = null;
        });
    });


    describe('Code Coverage feature - 4 =>', () => {
        let grid: Grid;
        let preventDefault: Function = new Function();
        beforeAll((done: Function) => {
            grid = createGrid(
                {
                    dataSource: filterData,
                    allowPaging: true,
                    allowGrouping: true,
                    toolbar: ['Add'],
                    groupSettings: { columns: ['CustomerID'] },
                    columns: [
                        { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                        { field: 'CustomerID', headerText: 'Customer ID', width: 150 },
                        { field: 'Freight', headerText: 'Freight', width: 150, format: 'C2', textAlign: 'Right' },
                        { field: 'ShipName', headerText: 'Ship Name', width: 150 }
                    ]
                }, done);
        });

        it('editmodule  coverage', () => {
            (grid as any).deleteRecord();
            (grid as any).startEdit();
            (grid as any).endEdit();
            (grid as any).closeEdit();
            (grid as any).addRecord();
            (grid as any).deleteRow();
            (grid as any).editCell();
            (grid as any).saveCell();
            (grid as any).updateCell();
            (grid as any).updateRow();
            (grid as any).filterByColumn();
            (grid as any).clearFiltering();
            (grid as any).removeFilteredColsByField();

        });       

        it('onkeypress shiftTab key coverage', () => {
            (grid as any).createColumnchooser();
            (grid as any).focusModule.onKeyPress ({ target: grid.element.querySelector('.e-toolbar'),  action: 'tab', preventDefault: preventDefault });
            (grid as any).focusModule.onKeyPress({ target: grid.element, action: 'tab', preventDefault: preventDefault });
            (grid as any).focusModule.onKeyPress ({ target: grid.element.querySelector('.e-toolbar'),  action: 'tab', preventDefault: preventDefault });
        });       

        afterAll(() => {
            destroy(grid);
            grid = preventDefault = null;
        });
    });

    

    describe('grid file code coverage - 1', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: [],
                    height: 300,
                    frozenRows: 2,
                    allowFiltering: true,
                    allowResizing: true,
                    resizeSettings: { mode: 'Auto' },
                    allowSelection: false,
                    filterSettings: { type: 'Menu' },
                    showColumnChooser: true,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, newRowPosition: 'Top' },
                    columns: [
                        {
                            field: 'OrderID', isPrimaryKey: true, headerText: 'Order ID', textAlign: 'Right',
                            validationRules: { required: true, number: true }, width: 140
                        },
                        {
                            field: 'ShipCountry', headerText: 'Ship Country', validationRules: { required: true }, width: 150, allowFiltering: false
                        }
                    ],
                }, done);
        });

        it('grid file method complete coverage', () => {
            gridObj.resetFilterDlgPosition('');
            gridObj.resetFilterDlgPosition('ShipCountry');
            gridObj.resetFilterDlgPosition('OrderID');
            (gridObj as any).calculatePageSizeByParentHeight();
            (gridObj as any).applyBiggerTheme();
            (gridObj as any).clearCellSelection();
            (gridObj as any).clearRowSelection();
            (gridObj as any).selectCells();
            (gridObj as any).selectRowsByRange();
            (gridObj as any).selectRow();
            (gridObj as any).selectRows();
            (gridObj as any).clearSelection();
            (gridObj as any).selectCell();
            (gridObj as any).getSelectedColumnsUid();
            (gridObj as any).getSelectedRowCellIndexes();
            (gridObj as any).getSelectedRecords();
            (gridObj as any).clearSorting();
            (gridObj as any).removeSortColumn();
            (gridObj as any).sortColumn();
            (gridObj as any).updateExternalMessage();
            (gridObj as any).goToPage();
            (gridObj as any).detailExpandAll();
            (gridObj as any).detailCollapseAll();
            (gridObj as any).openColumnChooser();
            (gridObj as any).groupColumn();
            (gridObj as any).groupExpandAll();
            (gridObj as any).groupCollapseAll();
            (gridObj as any).clearGrouping();
            (gridObj as any).ungroupColumn();
            (gridObj as any).getNoncontentHeight();
            (gridObj as any).restoreAdjustColumns();
            (gridObj as any).preventAdjustColumns();
            (gridObj as any).reorderColumns();
            (gridObj as any).reorderColumnByIndex();
            (gridObj as any).reorderColumnByTargetIndex();
            (gridObj as any).reorderRows();
            (gridObj as any).enableToolbarItems();
            (gridObj as any).getColumnHeaderByUid('grid-column');
            (gridObj as any).getColumnHeaderByField('');
            (gridObj as any).rowObject();
            (gridObj as any).refreshReactHeaderTemplateByUid();
            (gridObj as any).maintainSelection(-1);
            (gridObj as any).refreshMaskRow();
            (gridObj as any).leftrightColumnWidth();
            gridObj.textWrapSettings.wrapMode = 'Content';
            (gridObj as any).removeTextWrap();
            gridObj.isDestroyed = true;
            gridObj.refresh();
            gridObj.isDestroyed = false;
        });


        it('renderRowElement and deleteRowElement complete coverage', () => {
            gridObj.element.classList.add('e-frozenrow-empty');
            (gridObj as any).renderRowElement({ OrderID: 101 }, 0);
            let target = gridObj.element.querySelector('.e-rowcell');
            gridObj.element.querySelector('.e-row').classList.add('e-unboundcelldiv');
            (gridObj as any).dblClickHandler({ target: target });
        });

        it('setNewData complete coverage', () => {
            (gridObj as any).setNewData();
        });

        it('grid file method complete coverage', () => {
            gridObj.isEdit = true;
            (gridObj as any).keyActionHandler({ action: 'leftArrow' });
            (gridObj as any).keyDownHandler({});
            (gridObj as any).keyDownHandler({ altKey: true, keyCode: 1212 });
            (gridObj as any).keyDownHandler({ keyCode: 13 });
            // (gridObj as any).keyDownHandler({});
            (gridObj as any).mergeColumns(gridObj.columns, gridObj.columns);
            (gridObj as any).headerModule.headerPanel = null;
            (gridObj as any).getNoncontentHeight();
            (gridObj as any).contentModule.contentTable.innerHTML = '';
            (gridObj as any).getAllDataRows();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });


    describe('coverage improvement row-reorder file - 1', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0, 1),
                    allowRowDragAndDrop: true,
                    height: 300,
                    enableInfiniteScrolling : true,
                    groupSettings: { enableLazyLoading: true },
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 10 },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });
        it('row reorder file method coverage', () => {
            gridObj.isDestroyed = true;
            (gridObj as any).isCheckBoxSelection = true;
            (gridObj.rowDragAndDropModule as any).dragStop({});
            gridObj.isDestroyed = false;
            (gridObj.rowDragAndDropModule as any).singleRowDrop({target: gridObj.element.querySelector('.e-rowcell'), droppedElement: gridObj.element.firstElementChild});
            (gridObj.rowDragAndDropModule as any).enableAfterRender({});
            var dropELem: any = document.createElement('div');
            dropELem.setAttribute('action', 'grouping');
            (gridObj.rowDragAndDropModule as any).columnDrop({
                target: gridObj.element.querySelector('.e-rowcell'),
                droppedElement: dropELem
            });
            (gridObj.rowDragAndDropModule as any).removeLastRowBorder();
            (gridObj.rowDragAndDropModule as any).moveDragRows({ target: dropELem });
            (gridObj.rowDragAndDropModule as any).setScrollDown(gridObj.element.querySelector('.e-content'), 2);
            (gridObj.rowDragAndDropModule as any).startedRow = gridObj.element.querySelector('.e-row');
            (gridObj.rowDragAndDropModule as any).currentViewData();
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });


    describe('coverage improvement row-reorder file - 2', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0, 5),
                    allowRowDragAndDrop: true,
                    height: 300,
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 10 },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                    childGrid: {
                        dataSource: filterData.slice(0, 5),
                        queryString: 'ShipCountry',
                        columns: [
                            { headerText: 'ShipCountry', field: 'ShipCountry' },
                            { field: 'ShipName', headerText: 'Ship Name', textAlign: 'Left', width: 100 }
                        ]
                    },
                }, done);
        });
        it('row reorder file method coverage - 2', () => {
            gridObj.detailRowModule.expand(gridObj.getDataRows()[1].querySelector('.e-detailrowcollapse'));
            gridObj.detailRowModule.expand(gridObj.getDataRows()[3].querySelector('.e-detailrowcollapse'));
        });
        it('row reorder coverage', () => {
            let rows: Element[] = gridObj.getDataRows();
            (gridObj.rowDragAndDropModule as any).rowOrder({
                target: gridObj.element.querySelector('.e-rowcelldrag'),
                droppedElement: rows[1].querySelector('.e-rowcell'),
                dropIndex: 1,
                fromIndex: 2,
                rows: [rows[3]],
                draggableType: 'rows',
                data: gridObj.getRowsObject()[3].data
            });
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('coverage improvement row-reorder file - 2', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: filterData.slice(0, 5),
                    allowRowDragAndDrop: true,
                    height: 300,
                    frozenRows: 2,
                    editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, showAddNewRow: true},
                    columns: [
                        { headerText: 'OrderID', field: 'OrderID', width: 10 },
                        { headerText: 'ShipCountry', field: 'ShipCountry' },
                    ],
                }, done);
        });

        it('frozen row reorder coverage - 2', () => {
            (gridObj.rowDragAndDropModule as any).isNewRowAdded();
            (gridObj.rowDragAndDropModule as any).getParentGrid(gridObj.element);
            let rows: Element[] = gridObj.getDataRows();
            (gridObj.rowDragAndDropModule as any).rowOrder({
                target: gridObj.element.querySelector('.e-rowcelldrag'),
                droppedElement: rows[1].querySelector('.e-rowcell'),
                dropIndex: 1,
                fromIndex: 2,
                rows: [rows[3]],
                draggableType: 'rows',
                data: gridObj.getRowsObject()[3].data
            });
        });
        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});

describe('EJ2-899559 - Column jumping issue on column resizing with minWidth and width', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowResizing: true,
                columns: [
                    { field: 'OrderID', minWidth: 50, width: 'auto' },
                    { field: 'CustomerID', minWidth: 60 },
                    { field: 'Freight', minWidth: 60 },
                    { field: 'ShipCountry', minWidth: 60 },
                ]
            }, done);
    });
    it('Ensure 1st Column Width ', () => {
        const cols: HTMLCollection = gridObj.getHeaderTable().querySelector('colgroup').children;
        expect((cols[0] as HTMLElement).style.width).toBe('auto');
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-899784 - Need to add headervalueaccessor property in aspcore and mvc platform', () => {
    let gridObj: Grid;
    (window as any).headerValueAccessorFn = (field: any, column: any) => {
        return 'HeaderValueAccessor';
    }
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                allowResizing: true,
                columns: [
                    { field: 'OrderID', minWidth: 50, width: 'auto' },
                    { field: 'CustomerID', minWidth: 60, headerValueAccessor: "headerValueAccessorFn" },
                    { field: 'Freight', minWidth: 60 },
                    { field: 'ShipCountry', minWidth: 60 },
                ]
            }, done);
    });
    it('Check header text', () => {
        expect(gridObj.getHeaderTable().querySelectorAll('th')[1].innerText).toBe('HeaderValueAccessor');
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Coverage for 916454: actionBegin event triggered multiple times when dynamically changing the data source', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 10),
                allowPaging: true,
                pageSettings: { pageSize: 10, pageSizes: [10, 20, 50] },
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', width: 10 },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                ]
            }, done);
    });

    it('Change DataSource', () => {
        gridObj.dataSource = data.slice(0, 8);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Second coverage for 916454: actionBegin event triggered multiple times when dynamically changing the data source', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 10),
                allowPaging: true,
                pageSettings: { pageSize: 10, pageSizes: ['All', 10, 20, 50] },
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', width: 10 },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                ]
            }, done);
    });

    it('Change DataSource with pageSizes ALL', () => {
        gridObj.dataSource = data.slice(0, 8);
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('EJ2-927038: Script Error with Grid AutoFit: Undefined First Column Width and Hidden Visibility', () => {
    let gridObj: Grid;
    let table: HTMLElement;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data.slice(0, 10),
                autoFit: true,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', visible: false },
                    { headerText: 'ShipCountry', field: 'ShipCountry', width: 100 }
                ]
            }, done);
    });

    it('Get the table', () => {
        table = gridObj.getContentTable() as HTMLElement;
    });

    it('Check the table width', () => {
        expect(table.style.width).toBe('100px');
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('935213: Script error occurs when updating dataSource with frozen column and pager dropdown All option', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData.slice(0, 12),
                allowPaging: true,
                pageSettings: {pageSizes: true},
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', width: 10 },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                ]
            }, done);
    });

    it('Change DataSource', (done: Function) => {
        let dataBound = function() {
            done();
        }
        gridObj.dataBound = dataBound;
        gridObj.dataSource = filterData.slice(0, 24);
    });

    it ('If script error not occurs grid datasource changed to 24 datas', (done: Function) => {
        expect((gridObj.currentViewData as any).length === 24).toBeTruthy();
        done();
    })

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('Coverage for skips the hidden cell focus', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                width: 400,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', width: 'auto' },
                    { headerText: 'CustomerID', field: 'CustomerID', width: 150 },
                    {headerText: 'Freight', field: 'Freight', width: 150},
                    { headerText: 'ShipCountry', field: 'ShipCountry', width: 'auto'},
                    { headerText: 'EmployeeID', field: 'EmployeeID', width: 150 },
                    { headerText: 'ShipCity', field: 'ShipCity', width: 'auto'},
                ],
            }, done);
    });

    it ('Coverage for navigation of last cell to next row first cell', (done: Function) => {
        gridObj.focusModule.content.getTable().rows[0].cells[4].click();
        var e = { target:gridObj.focusModule.currentInfo.elementToFocus, preventDefault: new Function(), action:'tab' };
        (gridObj.focusModule as any).onKeyPress(e);
        expect(gridObj.focusModule.active.matrix.current.toString() === [1, 1].toString()).toBeTruthy();
        done();
    });

    it ('Coverage for first to previous row last visible cell', (done: Function) => {
        var e = { target:gridObj.focusModule.currentInfo.elementToFocus, preventDefault: new Function(), action:'shiftTab' };
        (gridObj.focusModule as any).onKeyPress(e);
        expect(gridObj.focusModule.active.matrix.current.toString() === [0, 4].toString()).toBeTruthy();
        done();
    });

    it ('Coverage for navigation of first cell to header focus', (done: Function) => {
        gridObj.focusModule.content.getTable().rows[0].cells[1].click();
        var e = { target:gridObj.focusModule.currentInfo.elementToFocus, preventDefault: new Function(), action:'shiftTab' };
        (gridObj.focusModule as any).onKeyPress(e);
        expect(gridObj.focusModule.header.matrix.current.toString() === [0, 4].toString()).toBeTruthy();
        done();
    });

    it ('Coverage for last header cell to first content cell', (done: Function) => {
        var e = { target:gridObj.focusModule.currentInfo.elementToFocus, preventDefault: new Function(), action:'tab' };
        (gridObj.focusModule as any).onKeyPress(e);
        expect(gridObj.focusModule.content.matrix.current.toString() === [0, 1].toString()).toBeTruthy();
        done();
    });

    it ('Coverage for lefttArrow key action', (done: Function) => {
        gridObj.focusModule.content.getTable().rows[0].cells[4].click();
        var e = { target:gridObj.focusModule.currentInfo.elementToFocus, preventDefault: new Function(), action:'leftArrow' };
        (gridObj.focusModule as any).onKeyPress(e);
        expect(gridObj.focusModule.content.matrix.current.toString() === [0, 2].toString()).toBeTruthy();
        done();
    });

    it ('Coverage for rightArrow key action', (done: Function) => {
        var e = { target:gridObj.focusModule.currentInfo.elementToFocus, preventDefault: new Function(), action:'rightArrow' };
        (gridObj.focusModule as any).onKeyPress(e);
        expect(gridObj.focusModule.content.matrix.current.toString() === [0, 4].toString()).toBeTruthy();
        done();
    });

    it ('Tab navigation coverage for last content cell', (done: Function) => {
        gridObj.focusModule.content.getTable().rows[gridObj.focusModule.active.matrix.matrix.length -1].cells[4].click();
        var e = { target:gridObj.focusModule.currentInfo.elementToFocus, preventDefault: new Function(), action:'tab' };
        (gridObj.focusModule as any).onKeyPress(e);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('946711: Row height issue in tree grid team', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: filterData.slice(0, 12),
                allowPaging: true,
                pageSettings: {pageSizes: true},
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', width: 10 },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                ]
            }, done);
    });

    it ('Check row height', (done: Function) => {
        const cellHeight: number = (gridObj.getContentTable() as HTMLTableElement).rows[1].cells[0].getBoundingClientRect().height;
        expect(gridObj.getRowHeight()).toBe(Math.ceil(cellHeight));
        expect(gridObj.getRowHeight(true)).toBe(cellHeight);
        expect(gridObj.getRowHeight(false)).toBe(Math.ceil(cellHeight));
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('963939: Last row border line is missing when we update record by using setRowData method.', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: [
                    { OrderID: 1, ShipCountry: 'USA' },
                    { OrderID: 2, ShipCountry: 'USA' },
                    { OrderID: 3, ShipCountry: 'USA' },
                    { OrderID: 4, ShipCountry: 'USA' },
                    { OrderID: 5, ShipCountry: 'USA' }
                ],
                height: 500,
                editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true },
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', width: 10, isPrimaryKey: true },
                    { headerText: 'ShipCountry', field: 'ShipCountry' },
                ]
            }, done);
    });

    it('Check table', (done: Function) => {
        expect(gridObj.getContentTable()).toBeTruthy;
        done();
    });

    it('setRowData', (done: Function) => {
        const data = gridObj.currentViewData[4];
        gridObj.setRowData(5, data);
        setTimeout(() => {
            done();
        }, 100);
    });

    it('Check last row cell', (done: Function) => {
        expect(gridObj.getContentTable().querySelectorAll('.e-lastrowcell').length).toBe(2);
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});

describe('979939: Need to remove "aria-selected" attribute from detail template expand/collapse icon cell', () => {
    let gridObj: Grid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                height: 300,
                columns: [
                    { headerText: 'OrderID', field: 'OrderID', width: 'auto' },
                    { headerText: 'CustomerID', field: 'CustomerID', width: 150 },
                    {headerText: 'Freight', field: 'Freight', width: 150},
                ],
                childGrid: {
                    dataSource: data,
                    queryString: 'OrderID',
                    columns: [
                        { field: 'ShipName', headerText: 'Ship Name', width: 150 },
                        { field: 'ShipCity', headerText: 'Ship City', width: 120 },
                        { headerText: 'ShipCountry', field: 'ShipCountry', width: 'auto'},
                    ],
                },
            }, done);
    });

    it('Select the 1st row', (done: Function) => {
        gridObj.selectRow(0);
        done();
    });
    it('Check the attribute', (done: Function) => {
        expect(gridObj.getContentTable().querySelector('.e-detailrowcollapse.e-selectionbackground').getAttribute('aria-selected')).toBeFalsy();
        done();
    });

    afterAll(() => {
        destroy(gridObj);
        gridObj = null;
    });
});