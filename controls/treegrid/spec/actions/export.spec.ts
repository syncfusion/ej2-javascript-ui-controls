import { TreeGrid } from '../../src/treegrid/base/treegrid';
import { createGrid, destroy } from '../base/treegridutil.spec';
import { sampleData, projectData, summaryRowData } from '../base/datasource.spec';
import { isNullOrUndefined, setValue, EmitType, createElement, remove } from '@syncfusion/ej2-base';
import { actionComplete, getObject, ExcelQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs, ExcelExportProperties } from '@syncfusion/ej2-grids';
import { Filter } from '../../src/treegrid/actions/filter';
import {ExcelExport } from '../../src/treegrid/actions/excel-export';
import {  PdfExport } from '../../src/treegrid/actions/pdf-export';
import { TreeGridExcelExportProperties, TreeGridPdfExportProperties } from '../../src';
import { Page } from '../../src/treegrid/actions/page';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';
import { Aggregate } from '../../src/treegrid/actions/summary';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { Toolbar } from '../../src/treegrid/actions/toolbar';

/**
 * Grid Export spec 
 */
TreeGrid.Inject(Filter, ExcelExport, PdfExport, Page, Aggregate, Toolbar);
let exportComplete: () => void = () => true;
describe('Exporting Module Test cases', () => {
    describe('Excel Exporting local data', () => {
        let gridObj: TreeGrid;
        beforeAll((done: Function) => {
            gridObj = createGrid(
                {
                    dataSource: sampleData,
                    childMapping: 'subtasks',
                    treeColumnIndex: 1,
                    allowExcelExport: true,
                    allowPdfExport: true,
                    columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
                },
                done
            );
        });
        it('Checking the excel export', (done: Function) => {
            gridObj.excelExport().then((doc: Workbook)=>{
                expect(doc).not.toBeUndefined();
                done();
            });
        });
        afterAll(() => {
            destroy(gridObj);
        });
    });
});

describe('Excel Exporting custom data', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowExcelExport: true,
          allowPdfExport: true,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
        },
        done
      );
    });
    it('Checking the export with custom data source', (done: Function) => {
        let excelExportProperties: TreeGridExcelExportProperties = {
            dataSource: sampleData.slice(0,1),
            exportType: 'AllPages',
            isCollapsedStatePersist: true
        }
        gridObj.excelExport(excelExportProperties).then((doc: Workbook)=>{
            expect(doc).not.toBeUndefined();
            done();
        });
    });
    afterAll(() => {
      destroy(gridObj);
    });
});

describe('Pdf Exporting local data', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowExcelExport: true,
                allowPdfExport: true,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
            },
            done
        );
    });
    it('Checking the pdf export', (done: Function) => {
        gridObj.pdfExport().then((doc)=>{
            expect(doc).not.toBeUndefined();
            done();
        });
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Pdf Exporting custom data', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
      gridObj = createGrid(
        {
          dataSource: sampleData,
          childMapping: 'subtasks',
          treeColumnIndex: 1,
          allowPaging: true,
          allowExcelExport: true,
          allowPdfExport: true,
          columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress']
        },
        done
      );
    });
    it('Checking the export with custom data source', (done: Function) => {
        let pdfExportProperties: TreeGridPdfExportProperties = {
            dataSource: sampleData.slice(0,1),
            isCollapsedStatePersist: true
        }
        gridObj.pdfExport(pdfExportProperties).then((doc)=>{
            expect(doc).not.toBeUndefined();
            done();
        });
    });
    afterAll(() => {
      destroy(gridObj);
    });
});

describe('Excel Exporting Remote data', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                height: 400,
                treeColumnIndex: 1,
                allowExcelExport: true,
                allowPdfExport: true,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
                excelExportComplete: exportComplete
            },
            done
        );
    });
    it('Checking the excel export', (done: Function) => {
        gridObj.excelExport().then((doc: Workbook)=>{
            expect(doc).not.toBeUndefined();
            done();
        });
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Excel Exporting Remote data with custom data source', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                height: 400,
                treeColumnIndex: 1,
                allowPaging: true,
                allowExcelExport: true,
                allowPdfExport: true,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
                excelExportComplete: exportComplete
            },
            done
        );
    });
    it('Checking the excel export', (done: Function) => {
        let excelExportProperties: TreeGridExcelExportProperties = {
            dataSource: data,
            isCollapsedStatePersist: true,
            exportType: 'CurrentPage'
        }
        gridObj.excelExport(excelExportProperties).then((doc)=>{
            expect(doc).not.toBeUndefined();
            done();
        })
        
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Pdf Exporting Remote data', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                height: 400,
                treeColumnIndex: 1,
                allowExcelExport: true,
                allowPdfExport: true,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ]
            },
            done
        );
    });
    it('Checking the excel export', (done: Function) => {
        gridObj.pdfExport().then((doc)=>{
            expect(doc).not.toBeUndefined();
            done();
        });
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Pdf Exporting Remote data with custom data source', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                height: 400,
                treeColumnIndex: 1,
                allowPaging: true,
                allowExcelExport: true,
                allowPdfExport: true,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ]
            },
            done
        );
    });
    it('Checking the excel export', (done: Function) => {
        let pdfportProperties: TreeGridPdfExportProperties = {
            dataSource: data,
            isCollapsedStatePersist: true,
            exportType: 'CurrentPage'
        }
        gridObj.pdfExport(pdfportProperties).then((doc)=>{
            expect(doc).not.toBeUndefined();
            done();
        });
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Csv Exporting local data', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowExcelExport: true,
                allowPdfExport: true,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
            },
            done
        );
    });
    it('Checking the csv export', (done: Function) => {
        gridObj.csvExport().then((doc)=>{
            expect(doc).not.toBeUndefined();
            done();
        });
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Exporting with aggregates', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: summaryRowData,
                childMapping: 'children',
                treeColumnIndex: 0,
                allowExcelExport: true,
                allowPdfExport: true,
                toolbar: ['PdfExport', 'ExcelExport', 'CsvExport'],
                height: 400,
                columns: [
                    { field: 'FreightID', headerText: 'Freight ID', width: 130 },
                    { field: 'FreightName', width: 200, headerText: 'Freight Name' },
                    { field: 'UnitWeight', headerText: 'Weight Per Unit', type: 'number', width: 140, textAlign: 'Right' },
                    { field: 'TotalUnits', headerText: 'Total Units', type: 'number', width: 140, textAlign: 'Right' }
                ],
                aggregates: [{
                    columns: [
                        {
                            type: 'Max',
                            field: 'UnitWeight',
                            columnName: 'UnitWeight',
                            footerTemplate: 'Maximum: ${Max}'
                        },
                        {
                            type: 'Min',
                            field: 'TotalUnits',
                            columnName: 'TotalUnits',
                            footerTemplate: 'Minimum: ${Min}'
                        }]
                }],
            },
            done
        );
    });
    it('Checking the pdfExport', (done: Function) => {
        gridObj.pdfExport().then((doc) => {
            expect(doc).not.toBeUndefined();
            done();
        });
    });
    it('Checking the excelExport', (done: Function) => {
        gridObj.excelExport().then((doc)=>{
            expect(doc).not.toBeUndefined();
            done();
        });
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Exporting with aggregates', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: summaryRowData,
                childMapping: 'children',
                treeColumnIndex: 0,
                allowExcelExport: true,
                allowPdfExport: true,
                toolbar: ['PdfExport', 'ExcelExport', 'CsvExport'],
                height: 400,
                columns: [
                    { field: 'FreightID', headerText: 'Freight ID', width: 130 },
                    { field: 'FreightName', width: 200, headerText: 'Freight Name' },
                    { field: 'UnitWeight', headerText: 'Weight Per Unit', type: 'number', width: 140, textAlign: 'Right' },
                    { field: 'TotalUnits', headerText: 'Total Units', type: 'number', width: 140, textAlign: 'Right' }
                ],
                aggregates: [{
                    columns: [
                        {
                            type: 'Max',
                            field: 'UnitWeight',
                            columnName: 'UnitWeight',
                            footerTemplate: 'Maximum: ${Max}'
                        },
                        {
                            type: 'Min',
                            field: 'TotalUnits',
                            columnName: 'TotalUnits',
                            footerTemplate: 'Minimum: ${Min}'
                        }]
                }],
            },
            done
        );
    });
    it('Checking the excelExport', (done: Function) => {
        gridObj.excelExport().then((doc)=>{
            expect(doc).not.toBeUndefined();
            done();
        });
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Excel Exporting Remote data without exportType', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                height: 400,
                treeColumnIndex: 1,
                allowPaging: true,
                allowExcelExport: true,
                allowPdfExport: true,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
                excelExportComplete: exportComplete
            },
            done
        );
    });
    it('Checking the excel export', (done: Function) => {
        let excelExportProperties: TreeGridExcelExportProperties = {
            dataSource: data,
            isCollapsedStatePersist: true
        }
        gridObj.excelExport(excelExportProperties);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj.excelExportModule.destroy();
    });
});

describe('Pdf Exporting local data without enable the property', () => {
    let gridObj: TreeGrid;
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: sampleData,
                childMapping: 'subtasks',
                treeColumnIndex: 1,
                allowExcelExport: false,
                allowPdfExport: false,
                columns: ['taskID', 'taskName', 'startDate', 'endDate', 'duration', 'progress'],
                toolbar: ['ExcelExport', 'CsvExport', 'PdfExport'],
            },
            done
        );
    });
    it('Export with toolbar', (done: Function) => {
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_excelexport' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_pdfexport' } });
        (<any>gridObj.grid.toolbarModule).toolbarClickHandler({ item: { id: gridObj.grid.element.id + '_csvexport' } });
        done();
    });
    afterAll(() => {
        destroy(gridObj);
    });
});

describe('Excel Exporting Remote data with exportType as AllPage', () => {
    let gridObj: TreeGrid;
    let data: Object = new DataManager({
        url: 'https://services.syncfusion.com/js/production/api/SelfReferenceData',
        adaptor: new WebApiAdaptor,
        crossDomain: true
    });
    beforeAll((done: Function) => {
        gridObj = createGrid(
            {
                dataSource: data,
                hasChildMapping: 'isParent',
                idMapping: 'TaskID',
                parentIdMapping: 'ParentItem',
                height: 400,
                treeColumnIndex: 1,
                allowPaging: true,
                allowExcelExport: true,
                allowPdfExport: true,
                columns: [
                    { field: 'TaskID', headerText: 'Task ID', textAlign: 'Right', width: 120 },
                    { field: 'TaskName', headerText: 'Task Name', width: 150 },
                    { field: 'StartDate', headerText: 'Start Date', textAlign: 'Right', width: 120 }
                ],
                excelExportComplete: exportComplete
            },
            done
        );
    });
    it('Checking the excel export', (done: Function) => {
        gridObj.filterModule = null;
        let excelExportProperties: any = {
            exportType:'AllPages'
        }
        gridObj.excelExport(excelExportProperties);
        done();
    });
    afterAll(() => {
        destroy(gridObj);
        gridObj.excelExportModule.destroy();
    });
});
