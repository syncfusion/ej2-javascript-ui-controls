/**
 * Grid Excel Export spec document
 */
/* tslint:disable */
import { Grid } from '../../../src/grid/base/grid';
import { Page } from '../../../src/grid/actions/page';
import { Selection } from '../../../src/grid/actions/selection';
import { Group } from '../../../src/grid/actions/group';
import { Toolbar } from '../../../src/grid/actions/toolbar';
import { DetailRow } from '../../../src/grid/actions/detail-row';
import { ForeignKey } from '../../../src/grid/actions/foreign-key';
import { data, employeeData, customerData } from '../base/datasource.spec';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { ExcelExport } from '../../../src/grid/actions/excel-export';
import { createGrid, destroy} from '../base/specutil.spec';
import { DataManager } from '@syncfusion/ej2-data';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { ExcelRow, ExcelExportProperties } from '../../../src';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';

Grid.Inject(Page, Group, Selection, Toolbar, ExcelExport, DetailRow, ForeignKey);

describe('excel Export =>', () => {
    let exportComplete: () => void = () => true;
    describe('Single Grid excel Export =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
            }
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowExcelExport: true,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                        { field: 'City', headerText: 'city', width: 110 },
                        { field: 'Country', headerText: 'Country', width: 110 }
                    ],
                    excelExportComplete: exportComplete,
                    beforeExcelExport: () => true
                }, done);
        });

        it("Export cancel Check", (done: Function) => {
            gridObj.beforeExcelExport = (args: any) => {
                gridObj.beforeExcelExport = undefined;
                args.cancel = true;
            };
            gridObj.excelExport().then((doc) => {
                expect(doc).toBeUndefined();
                done();
            });
        });

        it('grid exporting(Check with multiple exporting)', (done) => {
            spyOn(gridObj, 'excelExportComplete');
            gridObj.excelExport({}, true).then((excelDoc: Workbook) => {
                expect(gridObj.excelExportComplete).toHaveBeenCalled();
                expect(excelDoc).not.toBeUndefined();
                done();
            });     
        });
        
        it('Excel grid Check column length', () => {
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, {}, {result: gridObj.dataSource });
            expect((<any>gridObj.excelExportModule).columns.length).toBe(10);
            expect(excelRows.length).toBe((<any>gridObj.dataSource).length + 1);
            expect(excelRows[0].cells.length).toBe(5);
        });

        it("hide a column", () => {
            gridObj.hideColumns('Title');
            expect(gridObj.getVisibleColumns().length).toBe(4);            
        });

        it('visibility check', () => {
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, {}, {result: gridObj.dataSource });
            expect(excelRows[0].cells.length).toBe(4);
        });

        it('visibility check include hidden column', () => {
            (<any>gridObj.excelExportModule).includeHiddenColumn = true;
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, {includeHiddenColumn: true}, {result: gridObj.dataSource });
            expect(excelRows[0].cells.length).toBe(5);
        });

        it('check cell with value 0', () => {
            var data: Object = [gridObj.dataSource[0]];
            data[0]['EmployeeID'] = 0;
            gridObj.excelQueryCellInfo = (args) => {
                if(args.column.field == 'EmployeeID' && args.data['FirstName'] == 'Nancy') {
                expect(args.value).toBe(0);
                }
            }
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, undefined, {result: data });
        });

        it('check cell with value null', () => {
            var data: Object = [gridObj.dataSource[0]];
            data[0]['FirstName'] = null;
            gridObj.excelQueryCellInfo = (args) => {
                if(args.column.field == 'FirstName' && args.data['EmployeeID'] == 0) {
                expect(args.value).toBe('');
                }
            }
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, undefined, {result: data });
        });

        it('check cell with empty string value', () => {
            var data: Object = [gridObj.dataSource[0]];
            data[0]['FirstName'] = '';
            gridObj.excelQueryCellInfo = (args) => {
                if(args.column.field == 'FirstName' && args.data['EmployeeID'] == 0) {
                expect(args.value).toBe('');
                }
            }
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, undefined, {result: data });
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Stacked Header Grid Excel Export =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowExcelExport: true,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', dataSource: employeeData, foreignKeyValue: 'FirstName', width: 120 },
                        {
                            headerText: 'Order Details', columns: [
                                { field: 'OrderDate', headerText: 'Order Date', textAlign: 'Right', width: 135, format: 'yMd' },
                                { field: 'Freight', headerText: 'Freight($)', textAlign: 'Right', width: 120, format: 'C2' },
                            ]
                        },
                        {
                            headerText: 'Ship Details', columns: [
                                { field: 'ShippedDate', headerText: 'Shipped Date', textAlign: 'Right', width: 145, format: 'yMd' },
                                { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
                            ]
                        }
                    ],
                    excelExportComplete: exportComplete,
                }, done);
        });
        it('grid exporting(Check with multiple exporting)', (done) => {
            gridObj.excelExport({dataSource: data}, true).then((Doc: Workbook) => {
                expect(Doc).not.toBeUndefined();
                done();
            });     
        });
        it('Excel grid header length', () => {
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, {}, {result: gridObj.dataSource });
            expect(excelRows.length).toBe((<any>gridObj.dataSource).length + 2);
            expect((<any>excelRows[0]).cells.length).toBe(3);
            expect((<any>excelRows[1]).cells.length).toBe(4);
            expect((<any>excelRows[0]).cells[0].rowSpan).toBe(2);
            expect((<any>excelRows[0]).cells[1].colSpan).toBe(2);
        });

        it("hide a column", () => {
            gridObj.hideColumns('Freight', 'field');
            expect(gridObj.getVisibleColumns().length).toBe(4);            
        });
        it('stacked header visibility check', () => {
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, undefined, {result: gridObj.dataSource });
            expect((<any>excelRows[0]).cells.length).toBe(3);
            expect((<any>excelRows[1]).cells.length).toBe(3);
        });

        it('stacked header visibility check for include hidden column', () => {
            (<any>gridObj.excelExportModule).includeHiddenColumn = true;
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, {includeHiddenColumn: true}, {result: gridObj.dataSource } );
            expect((<any>excelRows[0]).cells.length).toBe(3);
            expect((<any>excelRows[1]).cells.length).toBe(4);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Custom font in Grid excel Export =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowExcelExport: true,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                        { field: 'City', headerText: 'city', width: 110 },
                        { field: 'Country', headerText: 'Country', width: 110 }
                    ],
                    excelExportComplete: exportComplete,
                }, done);
        });
        it('grid exporting(Check with multiple exporting)', (done) => {
            gridObj.excelExport({dataSource: new DataManager(data)}, true).then((doc: Workbook) => {
                expect(doc).not.toBeUndefined();
                done();
            });     
        });
        it('Excel grid Check column length', () => {
            (<any>gridObj.excelExportModule).styles = [];
            (<any>gridObj.excelExportModule).theme = {
                header: { bold: false, fontSize: 15 },
                caption: { bold: true, fontSize: 10 },
                record: { fontName: "TimesRoman", fontColor: "#FFFFFF", fontSize: 12 }
            }
            let excelRows: ExcelRow[] = (<any>gridObj.excelExportModule).processGridExport(gridObj, {
                theme: {
                    header: { bold: false, fontSize: 15 },
                    caption: { bold: true, fontSize: 10 },
                    record: { fontName: "TimesRoman", fontColor: "#FFFFFF", fontSize: 12 }
                },
            } as ExcelExportProperties, {result: gridObj.dataSource });
            expect((<any>excelRows[0]).cells[0].style.fontSize).toBe(15);
            expect((<any>excelRows[0]).cells[0].style.bold).toBeFalsy();
            expect((<any>excelRows[0]).cells[0].style.hAlign).toBe('right');
            let style: any = (<any>gridObj.excelExportModule).styles[(<any>gridObj.excelExportModule).getColumnStyle(gridObj, 1)];
            expect(style.bold).toBeFalsy();
            expect(style.fontSize).toBe(12);
            expect(style.fontName).toBe("TimesRoman");
            expect(style.fontColor).toBe("#FFFFFF");
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Hierarchy Excel export => ', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowSorting: true,
                    allowFiltering: true,
                    allowGrouping: true,
                    allowPaging: true,
                    pageSettings: {pageSize: 4},
                    allowExcelExport: true,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                        { field: 'City', headerText: 'city', width: 110 },
                        { field: 'Country', headerText: 'Country', width: 110 }
                    ],
                    childGrid: {
                        dataSource: data,
                        queryString: 'EmployeeID',
                        columns: [
                            { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: 120 },
                            { field: 'ShipCity', headerText: 'Ship City', width: 120 },
                            { field: 'Freight', headerText: 'Freight', width: 120 },
                            { field: 'ShipName', headerText: 'Ship Name', width: 150 }
                        ],
                        childGrid: {
                            dataSource: customerData,
                            queryString: 'CustomerID',
                            columns: [
                                { field: 'CustomerID', headerText: 'Customer ID', textAlign: 'Right', width: 75 },
                                { field: 'Phone', headerText: 'Phone', width: 100 },
                                { field: 'Address', headerText: 'Address', width: 120 },
                                { field: 'Country', headerText: 'Country', width: 100 }
                            ]
                        }
                    },
                    excelExportComplete: exportComplete,
                }, done);
        });
        it('grid exporting(Check with multiple exporting)', (done) => {
            gridObj.excelExport({}, true).then((Doc: Workbook) => {
                expect(Doc).not.toBeUndefined();
                done();
            });     
        });
        it('Expand a detail row', (done) => {
            gridObj.childGrid.dataBound = () => {
                expect(gridObj.getRowsObject().filter((row: any) => row.isExpand && !row.isDetailRow).length).toBe(1);
                done();
            }
            gridObj.detailRowModule.expand(0);
        });

        it('Hierarchy grid exporting', (done) => {
            gridObj.excelExport({}, true).then((doc) => {
                expect(doc).not.toBeUndefined();
                done();
            });
        });

        it('Hierarchy grid exporting', (done) => {
            gridObj.excelExport({hierarchyExportMode: 'All'}, true).then((doc) => {
                expect(doc).not.toBeUndefined();
                done();
            });
        });

        it('Hierarchy grid exporting', (done) => {
            gridObj.excelExport({hierarchyExportMode: 'None'}, true).then((doc) => {
                expect(doc).not.toBeUndefined();
                done();
            });
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

    describe('EJ2-36327 exportGrooupCaption event in excel export =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowExcelExport: true,
                    allowGrouping:true,
                    groupSettings:{columns:["FirstName"]},
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                        { field: 'City', headerText: 'city', width: 110 },
                        { field: 'Country', headerText: 'Country', width: 110 }
                    ],
                }, done);
        });
        it('grid excel exportGroupCaption check', (done) => {
            let exportGroupCaption = (args?: any): void => {
                expect(args.type).toBe("Excel");
                gridObj.exportGroupCaption = null;
                done();
            };
            gridObj.exportGroupCaption = exportGroupCaption;   
            gridObj.excelExport();
        });
        it('grid csv exportGroupCaption check', (done) => {
            let exportGroupCaption = (args?: any): void => {
                expect(args.type).toBe("CSV");
                gridObj.exportGroupCaption = null;
                done();
            };
            gridObj.exportGroupCaption = exportGroupCaption;   
            gridObj.csvExport();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
    describe('EJ2-40200 internal exportDataBound event in excel export =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowExcelExport: true,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                        { field: 'City', headerText: 'city', width: 110 },
                        { field: 'Country', headerText: 'Country', width: 110 }
                    ],
                }, done);
        });
        it('grid excel exportGroupCaption check', (done) => {
            gridObj.on('export-DataBound', function(args: {excelRows: ExcelRow[]}){
                expect(args.excelRows.length).toBe((gridObj.dataSource as any).length+1);
                done();
            });  
            gridObj.excelExport();
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });
});


// /**
//  * Grid Excel Export spec document
//  */
// import { EmitType, EventHandler } from '@syncfusion/ej2-base';
// import { extend } from '@syncfusion/ej2-base';
// import { createElement, remove } from '@syncfusion/ej2-base';
// import { Grid } from '../../../src/grid/base/grid';
// import { Page } from '../../../src/grid/actions/page';
// import { Selection } from '../../../src/grid/actions/selection';
// import { Group } from '../../../src/grid/actions/group';
// import { Aggregate } from '../../../src/grid/actions/aggregate';
// import { Toolbar } from '../../../src/grid/actions/toolbar';
// import { ItemModel } from '@syncfusion/ej2-navigations';
// import { data } from '../base/datasource.spec';
// import { DataManager, ODataV4Adaptor } from '@syncfusion/ej2-data';
// import { ExcelExport } from '../../../src/grid/actions/excel-export';
// import { createGrid, destroy, getKeyUpObj, getClickObj, getKeyActionObj } from '../base/specutil.spec';
// import '../../../node_modules/es6-promise/dist/es6-promise';
 
// Grid.Inject(Page, Group, Selection, Toolbar, ExcelExport, Aggregate);


// function excelQueryCellInfo(args: any): void {
//     if ((args.column.field === 'OrderID') && (args.value > 10250)) {
//         args.style = { fontName: 'Tahoma', bold: true, italic: true, backColor: '#C67890', leftBorder: { color: '#C67878', lineStyle: 'thick' } };
//     }
//     if (args.column.field === 'ShipCountry' && args.value === 'Switzerland') {
//         args.style = { textAlignment: 'right', backColor: '#C67890', verticalAlignment: 'bottom', fontStyle: 'Bold', fontSize: 15, fontFamily: 'TimesRoman' };
//     }
//     if (args.column.field === 'OrderDate') {
//         args.style = { name: 'colm', textAlignment: 'right', backColor: '#C67890', verticalAlignment: 'bottom', fontStyle: 'Bold', fontSize: 15, fontFamily: 'TimesRoman' };
//     }
// }

// let customDataProperties: any = {
//     dataSource: data.slice(10, 15)
// }
// let customAggregateFn = (data: Object[]) => data.filter((item: any) => item.ShipCountry === 'France').length;

// let excelExportProperties: any = {
//     header: {
//         headerRows: 3,
//         rows: [
//             { cells: [{ colSpan: 6, value: "Northwind Traders", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'Center', bold: true, } }] },
//             { cells: [{ colSpan: 6, value: "2501 Aerial Center Parkway", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'Center', bold: true, } }] },
//             { cells: [{ colSpan: 6, value: "Suite 200 Morrisville, NC 27560 USA", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'Center', bold: true, } }] },
//             { cells: [{ colSpan: 6, value: "Tel +1 888.936.8638 Fax +1 919.573.0306", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'Center', bold: true, } }] },
//             { cells: [{ colSpan: 6, hyperlink: { target: 'https://www.northwind.com/', displayText: 'www.northwind.com' }, style: { hAlign: 'Center' } }] },
//             { cells: [{ colSpan: 6, hyperlink: { target: 'mailto:support@northwind.com' }, style: { hAlign: 'Center' } }] },
//         ]
//     },
//     footer: {
//         footerRows: 4,
//         rows: [
//             { cells: [{ colSpan: 6, value: "Thank you for your business!", style: { hAlign: 'Center', bold: true } }] },
//             { cells: [{ colSpan: 6, value: "!Visit Again!", style: { hAlign: 'Center', bold: true } }] }
//         ]
//     },
//     exportType: 'CurrentPage'
// };

// describe('Blob data excel export => ', () => {
//     let gridObj: Grid;
//     let checkBoxFilter: Element; 
//     let exportComplete: () => void;
//     beforeAll((done: Function) => {
//         gridObj = createGrid(
//             {
//                 dataSource: data,
//                 allowPaging: true,
//                 filterSettings: { type: 'Menu', showFilterBarStatus: true },
//                 columns: [{ field: 'OrderID', type: 'number', visible: true },
//                 { field: 'CustomerID', type: 'string', filter: {type: 'CheckBox'} },
//                 { field: 'Freight', format: 'C2', type: 'number' }
//                 ],
//                 allowExcelExport: true,
//                 excelExportComplete: exportComplete
//             }, done);
//     });

//     it('blob csv export testing', (done) => {
//         let exportComplete: any = (e: any)=>{            
//             expect(e.promise).not.toBeUndefined();            
//             gridObj.excelExportComplete = null;
//             done();
//         };
//         gridObj.excelExportComplete = exportComplete;
//         gridObj.csvExport(null,null,null,true);       
//     });
//     it('blob excel export testing', (done) => {
//         let exportComplete: any = (e: any)=>{            
//             expect(e.promise).not.toBeUndefined();            
//             gridObj.excelExportComplete = null;
//             done();
//         };
//         gridObj.excelExportComplete = exportComplete;
//         gridObj.excelExport(null,null,null,true);       
//     });

//     afterAll(() => {
//         destroy(gridObj);
//     });
// });  


// describe('excel export', () => {

//     let gridObj: Grid;
//     let elem: HTMLElement = createElement('div', { id: 'Grid' });
//     let actionBegin: (e?: Object) => void;
//     let actionComplete: (e?: Object) => void;


//     afterAll(() => {
//         remove(elem);
//     });
//     beforeEach(() => {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
//         document.body.appendChild(elem);
//         gridObj = new Grid(
//             {
//                 dataSource: data,
//                 allowExcelExport: true,
//                 allowPdfExport: true,
//                 allowPaging: true,
//                 allowGrouping: true,
//                 groupSettings: { columns: ['Verified', 'ShipRegion', 'ShipCountry'] },
//                 toolbar: ['ExcelExport'],
//                 pageSettings: { pageCount: 5 },
//                 excelQueryCellInfo: excelQueryCellInfo,
//                 columns: [
//                     {
//                         field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: '120px'
//                         , columns: [
//                             { field: 'OrderID1', headerText: 'Shipped Date', textAlign: 'Right', width: 145, format: 'yMd' },
//                             { field: 'OrderID2', headerText: 'Ship Country', width: 140 },
//                         ]
//                     },
//                     { field: 'OrderDate', headerText: 'Order Date', headerTextAlign: 'Right', textAlign: 'Right', width: '15%', format: 'yMd' },
//                     { field: 'Freight', headerText: 'Freight($)', textAlign: 'Right', width: 120, format: 'C2' },
//                     { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
//                     { field: 'ShipRegion', width: 140 },
//                     { field: 'Verified', width: 140 },
//                     { field: 'ProductName', headerText: 'Product Name', textAlign: 'Right' },
//                     { field: 'OrderDate', headerText: 'short-skeleton-date', format: { skeleton: 'short' } },
//                     { field: 'OrderDate', headerText: 'short-format-date', format: 'short', type: 'date' },
//                     { field: 'OrderDate', headerText: 'medium-format-date', format: 'medium', type: 'date' },
//                     { field: 'OrderDate', headerText: 'long-format-date', format: 'long', type: 'date' },
//                     { field: 'OrderDate', headerText: 'full-format-date', format: 'full', type: 'date' },

//                     { field: 'OrderDate', headerText: 'short-format-time', format: 'short', type: 'time' },
//                     { field: 'OrderDate', headerText: 'medium-format-time', format: 'medium', type: 'time' },
//                     { field: 'OrderDate', headerText: 'long-format-time', format: 'long', type: 'time' },
//                     { field: 'OrderDate', headerText: 'full-format-time', format: 'full', type: 'time' },

//                     { field: 'OrderDate', headerText: 'short-format-datetime', format: 'short', type: 'datetime' },
//                     { field: 'OrderDate', headerText: 'medium-format-datetime', format: 'medium', type: 'datetime' },
//                     { field: 'OrderDate', headerText: 'long-format-datetime', format: 'long', type: 'datetime' },
//                     { field: 'OrderDate', headerText: 'full-format-datetime', format: 'full', type: 'datetime' },
//                     { field: 'OrderDate', headerText: 'short-skeleton-date', format: { skeleton: 'short', type: 'date' } },
//                     { field: 'OrderDate', headerText: 'medium-skeleton-date', format: { skeleton: 'medium', type: 'date' } },
//                     { field: 'OrderDate', headerText: 'long-skeleton-date', format: { skeleton: 'long', type: 'date' } },
//                     { field: 'OrderDate', headerText: 'full-skeleton-date', format: { skeleton: 'full', type: 'date' } },

//                     { field: 'OrderDate', headerText: 'short-skeleton-time', format: { skeleton: 'short', type: 'time' } },
//                     { field: 'OrderDate', headerText: 'medium-skeleton-time', format: { skeleton: 'medium', type: 'time' } },
//                     { field: 'OrderDate', headerText: 'long-skeleton-time', format: { skeleton: 'long', type: 'time' } },
//                     { field: 'OrderDate', headerText: 'full-skeleton-time', format: { skeleton: 'full', type: 'time' } },
//                 ],
//                 aggregates: [{
//                     columns: [
//                         {
//                             type: 'Min',
//                             field: 'Freight',
//                             format: 'C2',
//                             groupFooterTemplate: 'Min: ${min}'
//                         },
//                         {
//                             type: 'Max',
//                             field: 'OrderDate',
//                             format: { type: 'date', skeleton: 'medium' },
//                             groupFooterTemplate: 'Max: ${max}'
//                         }, {
//                             type: 'Max',
//                             field: 'Freight',
//                             format: 'C2',
//                             groupCaptionTemplate: 'Max: ${max}'
//                         }, {
//                             type: 'Max',
//                             field: 'OrderDate',
//                             format: { type: 'date', skeleton: 'medium' },
//                             groupCaptionTemplate: 'Max: ${max}'
//                         }, {
//                             type: 'Custom',
//                             customAggregate: customAggregateFn,
//                             field: 'ShipCountry',
//                         }
//                     ]
//                 }, {
//                     columns: [{
//                         type: 'Custom',
//                         customAggregate: customAggregateFn,
//                         columnName: 'ShipCountry',
//                     }]
//                 }]
//             });
//         gridObj.appendTo('#Grid');
//         gridObj.dataBind();
//     });

//     it('material', (done) => {
//         gridObj.excelExport();
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('bootstrap', (done) => {
//         gridObj.excelExport({
//             theme:
//                 {
//                     header: { fontName: 'Segoe UI', fontColor: '#666666' },
//                     record: { fontName: 'Segoe UI', fontColor: '#666666' },
//                     caption: { fontName: 'Segoe UI', fontColor: '#666666' }
//                 }
//         });
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('header and footer', (done) => {
//         gridObj.excelExport(excelExportProperties);
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('custom data source', (done) => {
//         gridObj.excelExport(customDataProperties);
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('remote data', (done) => {
//         gridObj.excelExport(new DataManager(data.slice(10, 15) as JSON[]));
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });

//     it('material-csv', (done) => {
//         gridObj.csvExport();
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('bootstrap - csv', (done) => {
//         gridObj.csvExport({
//             theme:
//                 {
//                     header: { fontName: 'Segoe UI', fontColor: '#666666' },
//                     record: { fontName: 'Segoe UI', fontColor: '#666666' },
//                     caption: { fontName: 'Segoe UI', fontColor: '#666666' }
//                 }
//         });
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('header and footer - csv', (done) => {
//         gridObj.csvExport(excelExportProperties);
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('custom data source - csv', (done) => {
//         gridObj.csvExport(customDataProperties);
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('remote data - csv', (done) => {
//         gridObj.csvExport(new DataManager(data.slice(10, 15) as JSON[]));
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
// });

// describe('multiple-grid-exporting', () => {
//     let gridObj1: Grid;
//     let elem1: HTMLElement = createElement('div', { id: 'Grid1' });
//     let gridObj3: Grid;
//     let elem3: HTMLElement = createElement('div', { id: 'Grid3' });
//     let actionBegin: (e?: Object) => void;
//     let actionComplete: (e?: Object) => void;
//     let excelExportPropertiesHeader: any = {
//         multipleExport: {},
//         includeHiddenColumn: true,
//         header: {
//             headerRows: 7,
//             rows: [
//                 { cells: [{ colSpan: 6, value: "Northwind Traders", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'Center', bold: true, } }] },
//                 { cells: [{ colSpan: 6, value: "2501 Aerial Center Parkway", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'Center', bold: true, } }] },
//                 { cells: [{ colSpan: 6, value: "Suite 200 Morrisville, NC 27560 USA", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'Center', bold: true, } }] },
//                 { cells: [{ colSpan: 6, value: "Tel +1 888.936.8638 Fax +1 919.573.0306", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'Center', bold: true, } }] },
//                 { cells: [{ colSpan: 6, hyperlink: { target: 'https://www.northwind.com/', displayText: 'www.northwind.com' }, style: { hAlign: 'Center' } }] },
//                 { cells: [{ colSpan: 6, hyperlink: { target: 'mailto:support@northwind.com' }, style: { hAlign: 'Center' } }] },
//             ]
//         }
//     };
//     let appendExcelExportProperties: any = {
//         multipleExport: { blankRows: 3 },
//         includeHiddenColumn: true,
//         header: {
//             headerRows: 7,
//             rows: [
//                 { cells: [{ colSpan: 6, value: "Northwind Traders", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'Center', bold: true, } }] },
//                 { cells: [{ colSpan: 6, value: "2501 Aerial Center Parkway", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'Center', bold: true, } }] },
//                 { cells: [{ colSpan: 6, value: "Suite 200 Morrisville, NC 27560 USA", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'Center', bold: true, } }] },
//                 { cells: [{ colSpan: 6, value: "Tel +1 888.936.8638 Fax +1 919.573.0306", style: { fontColor: '#C67878', fontSize: 15, hAlign: 'Center', bold: true, } }] },
//                 { cells: [{ colSpan: 6, hyperlink: { target: 'https://www.northwind.com/', displayText: 'www.northwind.com' }, style: { hAlign: 'Center' } }] },
//                 { cells: [{ colSpan: 6, hyperlink: { target: 'mailto:support@northwind.com' }, style: { hAlign: 'Center' } }] },
//             ]
//         },
//         footer: {
//             footerRows: 4,
//             rows: [
//                 { cells: [{ colSpan: 6, value: "Thank you for your business!", style: { hAlign: 'Center', bold: true } }] },
//                 { cells: [{ colSpan: 6, value: "!Visit Again!", style: { hAlign: 'Center', bold: true } }] }
//             ]
//         },
//     };

//     beforeEach(function () {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
//     });

//     beforeAll(() => {
//         document.body.appendChild(elem1);
//         document.body.appendChild(elem3);
//         gridObj1 = new Grid(
//             {
//                 dataSource: data.slice(0, 2),
//                 allowExcelExport: true,
//                 toolbar: ['ExcelExport'],
//                 columns: [
//                     { field: 'OrderID', headerText: 'Order ID', width: 120 },
//                     { field: 'OrderDate', format: { skeleton: 'full', type: 'date' }, visible: false },
//                 ],
//             });

//         gridObj3 = new Grid(
//             {
//                 dataSource: data.slice(0, 2),
//                 allowExcelExport: true,
//                 columns: [
//                     { field: 'OrderID', headerText: 'Order ID', width: 120 },
//                     { field: 'OrderDate', format: { skeleton: 'full', type: 'time' } },
//                 ],
//             });

//         gridObj1.appendTo('#Grid1');
//         gridObj3.appendTo('#Grid3');
//     });
//     afterAll(() => {
//         remove(elem1);
//         remove(elem3);
//     });
//     let gBook: any;
//     it('multiexport without saving the book', (done) => {
//         let excelExp: Promise<any> = gridObj1.excelExport(excelExportPropertiesHeader, true);
//         excelExp.then((data: any) => {
//             gBook = data;
//             done();
//         });
//     });
//     it('multiexport with saving the book', (done) => {
//         let excelExp: Promise<any> = gridObj3.excelExport(appendExcelExportProperties, false, gBook);
//         excelExp.then((data: any) => {
//             done();
//         });
//     });
//     it('multiexport without saving the book-csv', (done) => {
//         let excelExp: Promise<any> = gridObj1.csvExport(excelExportPropertiesHeader, true);
//         excelExp.then((data: any) => {
//             gBook = data;
//             done();
//         });
//     });

//     it('multiexport with saving the book-csv', (done) => {
//         let excelExp: Promise<any> = gridObj3.csvExport(appendExcelExportProperties, false, gBook);
//         excelExp.then((data: any) => {
//             done();
//         });
//     });
// });




