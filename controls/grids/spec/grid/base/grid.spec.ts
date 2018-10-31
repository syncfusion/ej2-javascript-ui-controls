/**
 * Grid base spec 
 */
import { L10n, EmitType } from '@syncfusion/ej2-base';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { createElement, remove } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';
import { Grid } from '../../../src/grid/base/grid';
import { GridLine } from '../../../src/grid/base/enum';
import { Column } from '../../../src/grid/models/column';
import { Page } from '../../../src/grid/actions/page';
import { data, filterData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { createGrid, destroy } from '../base/specutil.spec';

Grid.Inject(Page);

describe('Grid base module', () => {
    describe('Grid properties', () => {
        let gridObj: Grid;
        let actionComplete: (e?: Object) => void;
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

        afterAll(() => {
            destroy(gridObj);
        });

    });

    describe('Allow resizing test cases', () => {
        let gridObj: Grid;
        let colHeader: Element;
        let content: Element;
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
        });
    });

    describe('Allow resizing - columns', () => {
        let gridObj: Grid;
        let colHeader: Element;
        let content: Element;
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
        });
    });

    describe('Grid lines testing', () => {
        let gridObj: Grid;
        let header: Element;
        let content: Element;
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

        afterAll(() => {
            destroy(gridObj);
        });
    });


    describe('Grid lines testing', () => {
        let gridObj: Grid;
        let colHeader: Element;
        let content: Element;
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
        });
    });

    describe('media columns testing', () => {
        let gridObj: Grid;
        let targetEle: {};
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
                    { field: 'Freight', format: 'C2', template:'#template', type: 'number', allowFiltering: false },
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
        afterAll(() => {
            destroy(gridObj);
        });
    });


});

