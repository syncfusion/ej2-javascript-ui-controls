/**
 * Grid PDF Export spec document
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
import { PdfExport } from '../../../src/grid/actions/pdf-export';
import { createGrid, destroy} from '../base/specutil.spec';
import { HierarchyGridPrintMode } from '../../../src/grid/base/enum';
import { PdfDocument, PdfGrid, PdfStandardFont, PdfFontFamily, PdfFontStyle } from '@syncfusion/ej2-pdf-export';
import { DataManager } from '@syncfusion/ej2-data';
import  {profile , inMB, getMemoryProfile} from '../base/common.spec';
import { PdfExportProperties } from '../../../src/grid/base/interface';

Grid.Inject(Page, Group, Selection, Toolbar, PdfExport, DetailRow, ForeignKey);

describe('pdf Export =>', () => {
    let exportComplete: () => void = () => true;
    describe('Single Grid Pdf Export =>', () => {
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
                    allowPdfExport: true,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                        { field: 'City', headerText: 'city', width: 110 },
                        { field: 'Country', headerText: 'Country', width: 110 }
                    ],
                    pdfExportComplete: exportComplete,
                    beforePdfExport: (args: any) => {
                        gridObj.beforePdfExport = undefined;
                        args.cancel = true;
                    }
                }, done);
        });

        it("Export cancel Check", (done: Function) => {
            gridObj.pdfExport().then((doc) => {
                expect(doc).toBeUndefined();
                done();
            });
        });

        it('grid exporting(Check with multiple exporting)', (done) => {
            spyOn(gridObj, 'pdfExportComplete');
            gridObj.pdfExport({}, true).then((pdfDoc: PdfDocument) => {
                expect(gridObj.pdfExportComplete).toHaveBeenCalled();
                expect(pdfDoc instanceof PdfDocument).toBeTruthy();
                done();
            });     
        });
        
        it('Pdf grid Check column length', () => {
            let pdfGrid: PdfGrid = (<any>gridObj.pdfExportModule).processGridExport(gridObj, {result: gridObj.dataSource } ,{});
            expect(pdfGrid.columns.count).toBe(5);
            expect(pdfGrid.rows.count).toBe((<any>gridObj.dataSource).length);
            expect((<any>pdfGrid.headers).rows.length).toBe(1);
        });

        it("hide a column", () => {
            gridObj.hideColumns('Title');
            expect(gridObj.getVisibleColumns().length).toBe(4);            
        });

        it('visibility check', () => {
            let pdfGrid: PdfGrid = (<any>gridObj.pdfExportModule).processGridExport(gridObj, {result: gridObj.dataSource } ,{});
            expect(pdfGrid.columns.count).toBe(4);
        });

        it('visibility check include hidden column', () => {
            let pdfGrid: PdfGrid = (<any>gridObj.pdfExportModule).processGridExport(gridObj, {result: gridObj.dataSource } , {includeHiddenColumn: true});
            expect(pdfGrid.columns.count).toBe(5);
        });

        it('check cell with value 0', () => {
            var data: Object = [gridObj.dataSource[0]];
            data[0]['EmployeeID'] = 0;
            gridObj.pdfQueryCellInfo = (args) => {
                if(args.column.field == 'EmployeeID' && args.data['FirstName'] == 'Nancy') {
                expect(args.value).toBe('0');
                }
            }
            let pdfGrid: PdfGrid = (<any>gridObj.pdfExportModule).processGridExport(gridObj, {result: data } , {includeHiddenColumn: true});
        });

        it('check cell with value null', () => {
            var data: Object = [gridObj.dataSource[0]];
            data[0]['FirstName'] = null;
            gridObj.pdfQueryCellInfo = (args) => {
                if(args.column.field == 'FirstName' && args.data['EmployeeID'] == 0) {
                expect(args.value).toBe('');
                }
            }
            let pdfGrid: PdfGrid = (<any>gridObj.pdfExportModule).processGridExport(gridObj, {result: data } , {includeHiddenColumn: true});
        });

        it('check cell with empty string value', () => {
            var data: Object = [gridObj.dataSource[0]];
            data[0]['FirstName'] = '';
            gridObj.pdfQueryCellInfo = (args) => {
                if(args.column.field == 'FirstName' && args.data['EmployeeID'] == 0) {
                expect(args.value).toBe('');
                }
            }
            let pdfGrid: PdfGrid = (<any>gridObj.pdfExportModule).processGridExport(gridObj, {result: data } , {includeHiddenColumn: true});
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Stacked Header Grid Pdf Export =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: data,
                    allowPdfExport: true,
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
                    pdfExportComplete: exportComplete,
                }, done);
        });
        it('grid exporting(Check with multiple exporting)', (done) => {
            gridObj.pdfExport({dataSource: data}, true).then((pdfDoc: PdfDocument) => {
                expect(pdfDoc instanceof PdfDocument).toBeTruthy();
                done();
            });     
        });
        it('Pdf grid header length', () => {
            let pdfGrid: PdfGrid = (<any>gridObj.pdfExportModule).processGridExport(gridObj, {result: gridObj.dataSource } ,{});
            expect(pdfGrid.columns.count).toBe(5);
            expect(pdfGrid.rows.count).toBe((<any>gridObj.dataSource).length);
            expect((<any>pdfGrid.headers).rows.length).toBe(2);
            expect((<any>pdfGrid.headers).rows[0].gridCells.cells.length).toBe(5);
            expect((<any>pdfGrid.headers).rows[0].gridCells.cells[0].rowSpan).toBe(2);
            expect((<any>pdfGrid.headers).rows[0].gridCells.cells[1].columnSpan).toBe(2);
            expect((<any>pdfGrid.headers).rows[1].gridCells.cells.length).toBe(5);
        });

        it("hide a column", () => {
            gridObj.hideColumns('Freight', 'field');
            expect(gridObj.getVisibleColumns().length).toBe(4); 
        });
        it('stacked header visibility check', () => {
            let pdfGrid: PdfGrid = (<any>gridObj.pdfExportModule).processGridExport(gridObj, {result: gridObj.dataSource } ,{});
            expect((<any>pdfGrid.headers).rows[0].gridCells.cells.length).toBe(4);
            expect((<any>pdfGrid.headers).rows[1].gridCells.cells.length).toBe(4);
        });

        it('stacked header visibility check for include hidden column', () => {
            let pdfGrid: PdfGrid = (<any>gridObj.pdfExportModule).processGridExport(gridObj, {result: gridObj.dataSource } , {includeHiddenColumn: true});
            expect((<any>pdfGrid.headers).rows[0].gridCells.cells.length).toBe(5);
            expect((<any>pdfGrid.headers).rows[1].gridCells.cells.length).toBe(5);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Custom font in Grid Pdf Export =>', () => {
        let gridObj: Grid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowPdfExport: true,
                    columns: [
                        { field: 'EmployeeID', headerText: 'Employee ID', textAlign: 'Right', width: 125 },
                        { field: 'FirstName', headerText: 'Name', width: 125 },
                        { field: 'Title', headerText: 'Title', width: 180 },
                        { field: 'City', headerText: 'city', width: 110 },
                        { field: 'Country', headerText: 'Country', width: 110 }
                    ],
                    pdfExportComplete: exportComplete,
                }, done);
        });
        it('grid exporting(Check with multiple exporting)', (done) => {
            gridObj.pdfExport({dataSource: new DataManager(data)}, true).then((pdfDoc: PdfDocument) => {
                expect(pdfDoc instanceof PdfDocument).toBeTruthy();
                done();
            });     
        });
        it('Pdf grid Check column length', () => {
            let pdfGrid: PdfGrid = (<any>gridObj.pdfExportModule).processGridExport(gridObj, {result: gridObj.dataSource }, {
                theme: {
                    header: { font: new PdfStandardFont(PdfFontFamily.TimesRoman, 10, PdfFontStyle.Italic) },
                    caption: { font: new PdfStandardFont(PdfFontFamily.TimesRoman, 11, PdfFontStyle.Italic) },
                    record: { font: new PdfStandardFont(PdfFontFamily.TimesRoman, 12, PdfFontStyle.Regular) }
                },
            });
            expect((<any>pdfGrid.headers).rows[0].style.font.fontSize).toBe(10);
            expect((<any>pdfGrid.headers).rows[0].style.font.fontStyle).toBe(PdfFontStyle.Italic);
            expect((<any>pdfGrid.headers).rows[0].style.font.fontFamily).toBe(PdfFontFamily.TimesRoman);
            expect((pdfGrid.rows as any).rows[0].style.font.fontFamily).toBe(PdfFontFamily.TimesRoman);
            expect((pdfGrid.rows as any).rows[0].style.font.fontSize).toBe(12);
            expect((pdfGrid.rows as any).rows[0].style.font.fontStyle).toBe(PdfFontStyle.Regular);
        });

        afterAll(() => {
            destroy(gridObj);
            gridObj = null;
        });
    });

    describe('Hierarchy pdf export => ', () => {
        let gridObj: Grid;
        let catchEvent: boolean = true;
        let localData: Object[] = [{ OrderID: "100", CustomerID: "Vinet", Freight: "2.00", OrderDate: new Date() },
            { OrderID: "101", CustomerID: "Hanar", Freight: "2.01", OrderDate: new Date() },
            { OrderID: "102", CustomerID: "Mega", Freight: "4.48", OrderDate: new Date() },
            { OrderID: "103", CustomerID: "Sam", Freight: "19.23", OrderDate: new Date() }];
        let pdfpropery: PdfExportProperties = {dataSource: localData, footer: { fromBottom: -300 }};
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: employeeData,
                    allowSorting: true,
                    allowFiltering: true,
                    allowGrouping: true,
                    allowPaging: true,
                    pageSettings: {pageSize: 4},
                    allowPdfExport: true,
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
                    pdfExportComplete: exportComplete,
                }, done);
        });
        it('grid exporting(Check with multiple exporting)', (done) => {
            gridObj.pdfExport({}, true).then((pdfDoc: PdfDocument) => {
                expect(pdfDoc instanceof PdfDocument).toBeTruthy();
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
            gridObj.pdfExport({}, true).then((doc) => {
                expect(doc).not.toBeUndefined();
                done();
            });
        });

        it('Hierarchy grid exporting', (done) => {
            gridObj.pdfExport({hierarchyExportMode: 'All'}, true).then((doc) => {
                expect(doc).not.toBeUndefined();
                done();
            });
        });

        it('Hierarchy grid exporting', (done) => {
            gridObj.pdfExport({hierarchyExportMode: 'None'}, true).then((doc) => {
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

        it('pdf-export -> catch method', (done) => {
            gridObj.pdfExport({footer:{fromBottom: -300}}).then((doc) =>{} ).catch((e) =>{
                catchEvent = false;
                done();
            });
        });

        it('catch method check', () => {
          expect(catchEvent).toBeFalsy();
        });

        it('custom datasource catch method', (done) => {
            gridObj.pdfExport(pdfpropery).then((doc) =>{} ).catch((e) =>{
                catchEvent = true;
                done();
            });
        });

        it('catch method check', () => {
          expect(catchEvent).toBeTruthy();
        });
    
        afterAll(() => {
            destroy(gridObj);
            gridObj = catchEvent = pdfpropery = localData = null;
        });
    });
});



// describe('Blob data pdf export => ', () => {
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
//                 allowPdfExport: true,
//                 pdfExportComplete: exportComplete
//             }, done);
//     });

//     it('blob pdf export testing', (done) => {
//         let exportComplete: any = (e: any)=>{            
//             expect(e.promise).not.toBeUndefined();            
//             gridObj.pdfExportComplete = null;
//             done();
//         };
//         gridObj.pdfExportComplete = exportComplete;
//         gridObj.pdfExport(null,null,null,true);       
//     });

//     afterAll(() => {
//         destroy(gridObj);
//     });
// });  


// describe('PDF Export', () => {
//     let gridObj: Grid;
//     let elem: HTMLElement = createElement('div', { id: 'Grid' });
//     let actionBegin: (e?: Object) => void;
//     let actionComplete: (e?: Object) => void;
//     function QueryCellEvent(args: QueryCellInfoEventArgs): void {
//         let data: any = args.data;
//         if (args.column.field == 'Freight' && data.Freight > 50) {
//             args.colSpan = 2;
//         }
//     }

//     let rData = new DataManager(data.slice(10, 15) as JSON[]);
//     let remoteData: PdfExportProperties = {
//         dataSource: rData,
//         pageSize: 'Legal',
//         pageOrientation: 'Landscape',
//     }

//     let exportproperties: PdfExportProperties = {
//         exportType: 'CurrentPage',
//         includeHiddenColumn: true,
//         pageSize: 'Letter',
//         pageOrientation: 'Portrait',
//         header: {
//             fromTop: 0,
//             height: 150,
//             contents: [
//                 {
//                     type: 'Image',
//                     src: image,
//                     position: { x: 250, y: 10 },
//                     size: { height: 100, width: 250 },
//                 },
//                 {
//                     type: 'Line',
//                     style: { penColor: '#C67878', penSize: 2, dashStyle: 'Solid' },
//                     points: { x1: 0, y1: 4, x2: 500, y2: 4 }
//                 },
//                 {
//                     type: 'Line',
//                     style: { penColor: '#C67878', penSize: 2, dashStyle: 'Dot' },
//                     points: { x1: 0, y1: 7, x2: 500, y2: 7 }
//                 },
//                 {
//                     type: 'Line',
//                     style: { penColor: '#C67878', penSize: 2, dashStyle: 'Dot' },
//                     points: { x1: 0, y1: 114, x2: 500, y2: 114 }
//                 },
//                 {
//                     type: 'Line',
//                     style: { penColor: '#C67878', penSize: 2, dashStyle: 'Solid' },
//                     points: { x1: 0, y1: 117, x2: 500, y2: 117 }
//                 },
//                 {
//                     type: 'PageNumber',
//                     pageNumberType: 'Arabic',
//                     format: 'Page {$current} of {$total}', //optional
//                     position: { x: 0, y: 25 },
//                     // size: { height: 40, width: 200 }, //optional
//                     style: { textBrushColor: '#C67878', fontSize: 15, hAlign: 'Center' }
//                 },
//                 {
//                     type: 'Text',
//                     value: "Northwind Traders",
//                     position: { x: 0, y: 50 },
//                     style: { textBrushColor: '#000000', fontSize: 13 }
//                 },
//                 {
//                     type: 'Text',
//                     value: "2501 Aerial Center Parkway",
//                     position: { x: 0, y: 75 },
//                     style: { textBrushColor: '#000000', fontSize: 13 }
//                 },
//                 {
//                     type: 'Text',
//                     value: "Tel +1 888.936.8638 Fax +1 919.573.0306",
//                     position: { x: 0, y: 100 },
//                     style: { textBrushColor: '#000000', fontSize: 13 }
//                 },
//             ]
//         },
//         footer: {
//             fromBottom: 160,
//             height: 150,
//             contents: [
//                 {
//                     type: 'Image',
//                     src: image,
//                     position: { x: 250, y: 10 },
//                     size: { height: 100, width: 250 },
//                 },
//                 {
//                     type: 'Line',
//                     style: { penColor: '#000055', penSize: 2, dashStyle: 'Solid' },
//                     points: { x1: 0, y1: 4, x2: 500, y2: 4 }
//                 },
//                 {
//                     type: 'Line',
//                     style: { penColor: '#000055', penSize: 2, dashStyle: 'Dot' },
//                     points: { x1: 0, y1: 7, x2: 500, y2: 7 }
//                 },
//                 {
//                     type: 'Line',
//                     style: { penColor: '#000055', penSize: 2, dashStyle: 'Dot' },
//                     points: { x1: 0, y1: 114, x2: 500, y2: 114 }
//                 },
//                 {
//                     type: 'Line',
//                     style: { penColor: '#000055', penSize: 2, dashStyle: 'Solid' },
//                     points: { x1: 0, y1: 117, x2: 500, y2: 117 }
//                 },
//                 {
//                     type: 'PageNumber',
//                     pageNumberType: 'Arabic',
//                     format: 'Page {$current} of {$total}', //optional
//                     position: { x: 0, y: 25 },
//                     // size: { height: 40, width: 200 }, //optional
//                     style: { textBrushColor: '#000000', fontSize: 15, hAlign: 'Center' }
//                 },
//                 {
//                     type: 'Text',
//                     value: "Northwind Traders",
//                     position: { x: 0, y: 50 },
//                     style: { textBrushColor: '#000000', fontSize: 13 }
//                 },
//                 {
//                     type: 'Text',
//                     value: "2501 Aerial Center Parkway",
//                     position: { x: 0, y: 75 },
//                     style: { textBrushColor: '#000000', fontSize: 13 }
//                 },
//                 {
//                     type: 'Text',
//                     value: "Tel +1 888.936.8638 Fax +1 919.573.0306",
//                     position: { x: 0, y: 100 },
//                     style: { textBrushColor: '#000000', fontSize: 13 }
//                 },
//             ]
//         }
//     }

//     let customAggregateFn1 = (data: Object[]) => data.filter((item: any) => item.Freight > 50).length;
//     afterAll(() => {
//         remove(elem);
//     });
//     beforeEach(() => {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
//         document.body.appendChild(elem);
//         gridObj = new Grid(
//             {
//                 dataSource: data,
//                 allowPdfExport: true,
//                 allowPaging: true,
//                 allowGrouping: true,
//                 groupSettings: { columns: ['Verified', 'ShipRegion', 'ShipCountry'] },
//                 toolbar: ['PdfExport'],
//                 pageSettings: { pageCount: 5 },
//                 pdfQueryCellInfo: QueryCellEvent,
//                 columns: [
//                     { field: 'OrderID', headerText: 'Order ID', textAlign: 'Right', width: '120px' },
//                     {
//                         field: 'OrderDate', headerText: 'Order Date', headerTextAlign: 'Right',
//                         textAlign: 'Right', width: '15%', format: 'yMd'
//                     },
//                     { field: 'Freight', headerText: 'Freight($)', textAlign: 'Right', width: 120, format: 'C2' },
//                     { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
//                     { field: 'ShipRegion', width: 140 },
//                     { field: 'Verified', width: 140 },
//                     {
//                         headerText: 'Ship Details', headerTextAlign: 'Justify', columns: [
//                             { field: 'ShipPostalCode', headerText: 'Ship Postal Code', textAlign: 'Center', width: 145 },
//                             { field: 'ShipCountry', headerText: 'Ship Country', width: 140 },
//                         ]
//                     },
//                     { field: 'InvalidOrderID', isPrimaryKey: true, headerText: 'Order ID' },
//                     { headerText: 'Order Date 1', field: 'OrderDate', type: 'date', format: 'MMMEd' },
//                     { headerText: 'Order Date 2', field: 'OrderDate', format: { type: 'date', skeleton: 'MMMEd' } },
//                     { headerText: 'Order Date 3', field: 'OrderDate', type: 'date', format: { skeleton: 'MMMEd' } },
//                     { headerText: 'Order Date 4', field: 'OrderDate', format: { skeleton: 'MMMEd' } },
//                     { headerText: 'Order Date 5', field: 'OrderDate', type: 'datetime', format: 'MMMEd' },
//                     { headerText: 'Order Date 6', field: 'OrderDate', format: { type: 'datetime', skeleton: 'MMMEd' } },
//                     { headerText: 'Order Date 7', field: 'OrderDate', type: 'datetime', format: { skeleton: 'MMMEd' } },
//                     { headerText: 'Order Date 8', field: 'OrderDate', type: 'date', format: 'short' },
//                     { headerText: 'Order Date 9', field: 'OrderDate', type: 'date', format: 'long' },
//                     { headerText: 'Order Date 10', field: 'OrderDate', type: 'date', format: 'medium' },
//                     { headerText: 'Order Date 11', field: 'OrderDate', type: 'date', format: 'full' },
//                     { headerText: 'Order Date 12', field: 'OrderDate', type: 'datetime', format: 'short' },
//                     { headerText: 'Order Date 13', field: 'OrderDate', type: 'datetime', format: 'long' },
//                     { headerText: 'Order Date 14', field: 'OrderDate', type: 'datetime', format: 'medium' },
//                     { headerText: 'Order Date 15', field: 'OrderDate', type: 'datetime', format: 'full' },
//                     { headerText: 'Order Date 16', field: 'OrderDate', type: 'time', format: 'short' },
//                     { headerText: 'Order Date 17', field: 'OrderDate', type: 'time', format: 'long' },
//                     { headerText: 'Order Date 18', field: 'OrderDate', type: 'time', format: 'medium' },
//                     { headerText: 'Order Date 19', field: 'OrderDate', type: 'time', format: 'full' },
//                     { headerText: 'Order Date 20', field: 'OrderDate', format: { type: 'time', skeleton: 'short' } },
//                     { headerText: 'Order Date 21', field: 'OrderDate', format: { type: 'time', skeleton: 'long' } },
//                     { headerText: 'Order Date 22', field: 'OrderDate', format: { type: 'time', skeleton: 'medium' } },
//                     { headerText: 'Order Date 23', field: 'OrderDate', format: { type: 'time', skeleton: 'full' } },
//                     { headerText: 'Order Date 24', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'short' } },
//                     { headerText: 'Order Date 25', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'long' } },
//                     { headerText: 'Order Date 26', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'medium' } },
//                     { headerText: 'Order Date 27', field: 'OrderDate', type: 'time', format: { type: 'time', skeleton: 'full' } },
//                     { headerText: 'Order Date 28', field: 'OrderDate', type: 'time', format: { skeleton: 'full' } },
//                     { headerText: 'Order Date 29', field: 'OrderDate', type: 'datetime', format: { type: 'datetime', skeleton: 'MMMEd' } },
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
//                         }
//                     ]
//                 },
//                 {
//                     columns: [{
//                         type: 'Max',
//                         field: 'Freight',
//                         format: 'C2'
//                     }]
//                 }, {
//                     columns: [{
//                         type: 'Custom',
//                         customAggregate: customAggregateFn1,
//                         field: 'Freight',
//                     }]
//                 }, {
//                     columns: [{
//                         type: 'Custom',
//                         customAggregate: customAggregateFn1,
//                         columnName: 'Freight',
//                     }]
//                 }]
//             });
//         gridObj.appendTo('#Grid');
//         gridObj.dataBind();
//     });
//     it('Custom Theme', (done) => {
//         gridObj.pdfExport({
//             theme: {
//                 header: {
//                     fontColor: '#64FA50', fontName: 'Calibri', fontSize: 17, bold: true, borders: { color: '#64FA50', lineStyle: 'thin' }
//                 },
//                 record: {
//                     fontColor: '#64FA50', fontName: 'Calibri', fontSize: 17, bold: true
//                 },
//                 caption: {
//                     fontColor: '#64FA50', fontName: 'Calibri', fontSize: 17, bold: true
//                 }
//             }
//         });
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('material', (done) => {
//         gridObj.pdfExport();
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('exportproperties = undefined', (done) => {
//         gridObj.pdfExport(undefined);
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('header and footer', (done) => {
//         gridObj.pdfExport(exportproperties);
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('empty exportproperties', (done) => {
//         gridObj.pdfExport({});
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
//     it('remote data', (done) => {
//         gridObj.pdfExport(remoteData);
//         setTimeout(() => {
//             expect('').toBe('');
//             done();
//         }, 500);
//     });
// });

// /* tslint:enable */