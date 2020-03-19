import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove } from '@syncfusion/ej2-base';
import { ExcelExport, PDFExport } from '../../src/pivotview/actions';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Miscellaneous Features', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Exporting and scrolling', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(ExcelExport, PDFExport);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    sortSettings: [{ name: 'company', order: 'Descending' }],
                    formatSettings: [{ name: 'balance', format: 'C' }],
                    filterSettings: [
                        { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                        { name: 'isActive', type: 'Include', items: ['true'] },
                        {
                            name: 'date', type: 'Include', items: [
                                'Fri Dec 18 1987 05:37:53 GMT+0530 (India Standard Time)',
                                'Fri Jan 10 2003 20:13:56 GMT+0530 (India Standard Time)',
                                'Fri Jan 15 2010 12:24:35 GMT+0530 (India Standard Time)',
                                'Fri Mar 30 1990 00:54:08 GMT+0530 (India Standard Time)',
                                'Fri May 24 1996 23:27:58 GMT+0530 (India Standard Time)',
                                'Fri May 27 1983 06:48:41 GMT+0530 (India Standard Time)',
                                'Fri Nov 06 1987 19:11:22 GMT+0530 (India Standard Time)'
                            ]
                        }],
                    columns: [{ name: 'eyeColor' }, { name: 'date' }],
                    rows: [{ name: 'isActive' }, { name: 'state' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }]
                },
                beforeExport: util.beforeExport,
                onPdfCellRender: util.pdfCellRender,
                allowExcelExport: true,
                allowPdfExport: true,
                enableRtl: true,
                width: 1000,
                height: 100,
                gridSettings: {
                    allowReordering: true,
                    pdfHeaderQueryCellInfo: (args: any): void => {
                    },
                    pdfQueryCellInfo: (args: any): void => {
                    },
                    excelHeaderQueryCellInfo: (args: any): void => {
                    },
                    excelQueryCellInfo: (args: any): void => {
                    }
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });

        it('pivotgrid excel export', () => {
            pivotGridObj.excelExport();
        });

        it('pivotgrid csv dataSource', () => {
            pivotGridObj.csvExport();
        });

        it('pivotgrid pdf dataSource', () => {
            pivotGridObj.pdfExport();
        });

        it('pivotgrid excel-engine export', () => {
            pivotGridObj.excelExportModule.exportToExcel('Excel');
        });

        it('pivotgrid csv-engine dataSource', () => {
            pivotGridObj.excelExportModule.exportToExcel('CSV');
            pivotGridObj.excelExportModule.destroy();
        });

        it('value axis row', () => {
            pivotGridObj.dataSourceSettings.valueAxis = 'row';
            pivotGridObj.pdfExportModule.exportToPDF();
            pivotGridObj.pdfExportModule.destroy();
        });

        it('pivotgrid excel export', () => {
            pivotGridObj.excelExport();
        });

        it('pivotgrid pdf dataSource', () => {
            pivotGridObj.pdfExport();
        });
    });
    describe('Pivot Grid Conditional Formatting Export', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(ExcelExport, PDFExport, ConditionalFormatting);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    sortSettings: [{ name: 'company', order: 'Descending' }],
                    formatSettings: [{ name: 'balance', format: 'C' }],
                    filterSettings: [
                        { name: 'eyeColor', type: 'Include', items: ['blue'] },
                        { name: 'isActive', type: 'Include', items: ['true'] }
                    ],
                    rows: [{ name: 'eyeColor' }, { name: 'product' }],
                    columns: [{ name: 'isActive' }, { name: 'gender' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    conditionalFormatSettings: [
                        {
                            value1: 50000,
                            value2: 600,
                            conditions: 'Between',
                            style: {
                                backgroundColor: 'violet',
                                color: 'yellow',
                                fontFamily: 'Verdana',
                                fontSize: '13px'
                            },
                        }
                    ]
                },
                allowConditionalFormatting: true,
                allowExcelExport: true,
                allowPdfExport: true,
                width: 1000,
                height: 200
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('pivotgrid excel-engine export', () => {
            pivotGridObj.excelExportModule.exportToExcel('Excel');
        });
        it('pivotgrid pdf-engine dataSource', () => {
            pivotGridObj.pdfExportModule.exportToPDF();
        });
    });
    describe('Pivot Grid Conditional Formatting Export with Virtual Scrolling', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(ExcelExport, PDFExport, ConditionalFormatting);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    sortSettings: [{ name: 'company', order: 'Descending' }],
                    formatSettings: [{ name: 'balance', format: 'C' }],
                    filterSettings: [
                        { name: 'eyeColor', type: 'Include', items: ['blue'] },
                        { name: 'isActive', type: 'Include', items: ['true'] }
                    ],
                    rows: [{ name: 'eyeColor' }, { name: 'product' }],
                    columns: [{ name: 'isActive' }, { name: 'gender' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    conditionalFormatSettings: [
                        {
                            value1: 50000,
                            value2: 600,
                            conditions: 'Between',
                            style: {
                                backgroundColor: 'violet',
                                color: 'yellow',
                                fontFamily: 'Verdana',
                                fontSize: '13px'
                            },
                        }
                    ]
                },
                allowConditionalFormatting: true,
                allowExcelExport: true,
                allowPdfExport: true,
                enableVirtualization: true,
                width: 1000,
                height: 200
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('pivotgrid excel-engine export', () => {
            pivotGridObj.excelExportModule.exportToExcel('Excel');
        });
        it('pivotgrid pdf-engine dataSource', () => {
            pivotGridObj.pdfExportModule.exportToPDF();
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        //expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});