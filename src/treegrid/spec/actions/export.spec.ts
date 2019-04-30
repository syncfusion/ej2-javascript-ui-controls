// import { TreeGrid } from '../../src/base/treegrid';
// import { createGrid, destroy } from '../base/treegridutil.spec';
// import { sampleData, projectData } from '../base/datasource.spec';
// import { DataManager } from '@syncfusion/ej2-data'
// import { isNullOrUndefined, setValue, EmitType, createElement, remove } from '@syncfusion/ej2-base';
// import { actionComplete, getObject, ExcelQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';
// import { Filter } from '../../src/actions/filter';
// import {ExcelExport } from '../../src/actions/excel-export';
// import {  PdfExport } from '../../src/actions/pdf-export';

// /**
//  * Grid Export spec 
//  */
// TreeGrid.Inject(Filter, ExcelExport, PdfExport);
// describe('Exporting Module Test cases', () => {
//     describe('Excel Exporting local data', () => {
//         let gridObj: TreeGrid;
//         let rows: Element[];
//         let originalTimeout: number;
//         let actionComplete: () => void;
//         let queryCellInfo: () => void;
//         beforeAll((done: Function) => {
//           gridObj = createGrid(
//             {
//               dataSource: sampleData,
//               childMapping: 'subtasks',
//               treeColumnIndex: 1,
//               allowExcelExport: true,
//               allowPdfExport: true,
//               columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
//             },
//             done
//           );
//         });
//         it('Checking the events', (done: Function) => {
//             gridObj.beforeExcelExport = (args?: Object) => {
//                 expect(gridObj.flatData.length === getObject('dataSource.dataSource.json', args).length).toBe(true);
//                 setValue('cancel', true, args);
//                 done();
//             }
//             gridObj.excelExport();
//         });
//         afterAll(() => {
//           destroy(gridObj);
//         });
//       });
//     describe('Excel Exporting - filtering local data', () => {
//         let gridObj: TreeGrid;
//         let rows: Element[];
//         beforeAll((done: Function) => {
//             gridObj = createGrid(
//             {
//                 dataSource: sampleData,
//                 childMapping: 'subtasks',
//                 treeColumnIndex: 1,
//                 allowExcelExport: true,
//                 allowPdfExport: true,
//                 allowFiltering: true,
//                 filterSettings: { columns: [{ field: 'taskName', value: 'Plan', operator: 'startswith'}] },
//                 columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
//             },
//             done
//             );
//         });
//         it('Checking the events', (done: Function) => {
//             gridObj.beforeExcelExport = (args?: Object) => {
//                 setValue('cancel', true, args);
//                 expect(gridObj.getContent().getElementsByClassName('e-row').length === getObject('dataSource.dataSource.json', args).length).toBe(true);
//                 expect(args['isCsv']).toBe(false);
//                 done()
//             }
//             gridObj.excelExport();
//         });
//         afterAll(() => {
//             destroy(gridObj);
//         });
//     });
//     describe('PDF Exporting local data', () => {
//         let gridObj: TreeGrid;
//         let queryCellInfo: () => void;
//         beforeAll((done: Function) => {
//           gridObj = createGrid(
//             {
//               dataSource: sampleData,
//               childMapping: 'subtasks',
//               treeColumnIndex: 1,
//               allowExcelExport: true,
//               allowPdfExport: true,
//               pdfQueryCellInfo: queryCellInfo,
//               columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
//             },
//             done
//           );
//         });
//         it('Checking the events', (done: Function) => {
//             gridObj.beforePdfExport = (args?: Object) => {
//                 expect(gridObj.flatData.length === getObject('dataSource.dataSource.json', args).length).toBe(true);
//                 setValue('cancel', true, args);
//                 done();
//             }
//             gridObj.pdfExport();
//         });
//         afterAll(() => {
//           destroy(gridObj);
//         });
//       });
//     describe('PDF Exporting - filtering local data', () => {
//         let gridObj: TreeGrid;
//         let rows: Element[];
//         beforeAll((done: Function) => {
//             gridObj = createGrid(
//             {
//                 dataSource: sampleData,
//                 childMapping: 'subtasks',
//                 treeColumnIndex: 1,
//                 allowExcelExport: true,
//                 allowPdfExport: true,
//                 allowFiltering: true,
//                 filterSettings: { columns: [{ field: 'taskName', value: 'Plan', operator: 'startswith'}] },
//                 columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
//             },
//             done
//             );
//         });
//         it('Checking the events', (done: Function) => {
//             gridObj.beforePdfExport = (args?: Object) => {
//                 expect(gridObj.getContent().getElementsByClassName('e-row').length === getObject('dataSource.dataSource.json', args).length).toBe(true);
//                 setValue('cancel', true, args);
//                 done();
//             }
//             gridObj.pdfExport();
//         });
//         afterAll(() => {
//             destroy(gridObj);
//         });
//     });
 
//     describe('CSV Exporting local data', () => {
//         let gridObj: TreeGrid;
//         beforeAll((done: Function) => {
//             gridObj = createGrid(
//             {
//                 dataSource: sampleData,
//                 childMapping: 'subtasks',
//                 treeColumnIndex: 1,
//                 allowExcelExport: true,
//                 allowPdfExport: true,
//                 columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
//             },
//             done
//             );
//         });
//         it('Checking CSV', (done: Function) => {
//             gridObj.beforeExcelExport = (args?: Object) => {
//                 expect(gridObj.flatData.length === getObject('dataSource.dataSource.json', args).length).toBe(true);
//                 expect(getObject('isCsv', args)).toBe(true);
//                 setValue('cancel', true, args);
//                 done();
//             }
//             gridObj.csvExport();
//         });
//         afterAll(() => {
//             destroy(gridObj);
//         });
//     });
//     describe('PDF Exporting local data', () => {
//         let gridObj: TreeGrid;
//         let queryCellInfo: () => void;
//         beforeAll((done: Function) => {
//           gridObj = createGrid(
//             {
//               dataSource: sampleData,
//               childMapping: 'subtasks',
//               treeColumnIndex: 1,
//               allowExcelExport: true,
//               allowPdfExport: true,
//               pdfQueryCellInfo: queryCellInfo,
//               columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
//             },
//             done
//           );
//         });
//         it('Checking the events', (done: Function) => {
//             gridObj.beforePdfExport = (args?: Object) => {
//                 expect(gridObj.flatData.length === getObject('dataSource.dataSource.json', args).length).toBe(true);
//                 setValue('cancel', true, args);
//                 done();
//             }
//             gridObj.pdfExport();
//         });
//         afterAll(() => {
//           destroy(gridObj);
//         });
//       });
//     describe('Set Model', () => {
//         let gridObj: TreeGrid;
//         let rows: Element[];
//         beforeAll((done: Function) => {
//             gridObj = createGrid(
//             {
//                 dataSource: sampleData,
//                 childMapping: 'subtasks',
//                 treeColumnIndex: 1,
//                 columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
//             },
//             done
//             );
//         });
//         it('enabling excel export', () => {
//             gridObj.allowExcelExport = true;
//         });
//         it('enabling pdf export and checking excel export', () => {
//             expect(!isNullOrUndefined(gridObj.excelExportModule)).toBe(true);
//         });
//         afterAll(() => {
//             destroy(gridObj);
//         });
//     });

//     describe('Set Model for PDF export', () => {
//         let gridObj: TreeGrid;
//         let rows: Element[];
//         beforeAll((done: Function) => {
//             gridObj = createGrid(
//             {
//                 dataSource: sampleData,
//                 childMapping: 'subtasks',
//                 treeColumnIndex: 1,
//                 columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
//             },
//             done
//             );
//         });
//         it('enabling pdf export', () => {
//             gridObj.allowPdfExport = true;
//         });
//         it('enabling pdf export', () => {
//             expect(!isNullOrUndefined(gridObj.pdfExportModule)).toBe(true);
//         });
//         afterAll(() => {
//             destroy(gridObj);
//         });
//     });
// });