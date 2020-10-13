/**
 * Grid base spec 
 */
import { L10n, EmitType,EventHandler } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { GridLine } from '../../../src/grid/base/enum';
import { Column } from '../../../src/grid/models/column';
import { Page } from '../../../src/grid/actions/page';
import { data, filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy, getClickObj, getKeyActionObj } from '../base/specutil.spec';
import  {profile , inMB, getMemoryProfile} from './common.spec';
import { keyPressed, KeyboardEventArgs, columnChooserOpened, AggregateColumnModel, recordClick } from '../../../src';
import { Selection } from '../../../src/grid/actions/selection';
Grid.Inject(Page);

describe('Grid base module', () => {
    describe('Grid properties', () => {
        let gridObj: Grid;
        let actionComplete: (e?: Object) => void;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                this.skip(); //Skips test (in Chai)
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
        it('Setting pagesize', function (done) {
            actionComplete = (args: Object): void => {     
            expect(gridObj.currentViewData.length).toEqual(15);                
            done();
            };
            gridObj.actionComplete = actionComplete;
            gridObj.pageSettings.pageSize = 20;            
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
                        this.skip(); //Skips test (in Chai)
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

        it('collapseAll method testing', () => {
            let expandElem = gridObj.getContent().querySelectorAll('.e-recordplusexpand');
            gridObj.groupModule.expandCollapseRows(expandElem[1]);
            gridObj.groupModule.expandCollapseRows(expandElem[0]);
            gridObj.groupCollapseAll();
            expect(gridObj.getContent().querySelectorAll('tr:not([style*="display: none"])').length).toBe(0);
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
                let cheEle: any = gridObj.element.querySelectorAll('.e-cc-chbox')[0];
                let cheEle1: any = gridObj.element.querySelectorAll('.e-cc-chbox')[1];
                cheEle.click();
                cheEle1.click();
                (<HTMLElement>gridObj.element.querySelector('.e-cc_okbtn')).click();
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
                    this.skip(); //Skips test (in Chai)
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
                expect(gridObj.getContentTable().querySelectorAll('.e-detailrow').length).toBe(0);
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
    });