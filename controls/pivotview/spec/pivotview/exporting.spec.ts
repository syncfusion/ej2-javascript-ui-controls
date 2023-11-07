import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType} from '@syncfusion/ej2-base';
import { VirtualScroll } from '../../src/pivotview/actions';
import { PDFExport } from '../../src/pivotview/actions/pdf-export';
import { ExcelExport } from '../../src/pivotview/actions/excel-export';
import { Toolbar } from '../../src/common/popups/toolbar';
import { FieldList } from '../../src/common/actions/field-list';
import { BeforeExportEventArgs, PdfCellRenderArgs, PivotActionBeginEventArgs } from '../../src/common/base/interface';
import { PdfExportProperties } from '@syncfusion/ej2-grids';
import { PdfFontFamily, PdfFontStyle, PdfStandardFont, PdfStringFormat } from '@syncfusion/ej2-pdf-export';

let image: string = '/9j/4AAQSkZJRgABAQAAAQABAAD/9k=';

describe('PDF Export', () => {
    describe('- Row height', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false,
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true,
                onPdfCellRender: (args: PdfCellRenderArgs) => {
                    if (args.pivotCell && args.pivotCell.valueSort && args.pivotCell.valueSort.levelName === 'Bike') {
                        args.cell.height = 150;
                    }
                },
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('- customization while export', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('Column width', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false,
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true,
                onPdfCellRender: (args: PdfCellRenderArgs) => {
                    if (args.pivotCell && args.pivotCell.valueSort && args.pivotCell.valueSort.levelName === 'male.balance') {
                        args.column.width = 50;
                    }
                },
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-2', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('- customization while export', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('Olap specified export', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, ExcelExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW 2008R2',
                    cube: 'Adventure Works',
                    providerType: 'SSAS',
                    url: 'https://demos.telerik.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    formatSettings: [{ name: '[Measures].[Customer Count]', format: 'N2' }],
                    rows: [
                        { name: '[Date].[Date]', caption: 'Date Fiscal' },
                    ],
                    columns: [
                        { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                        { name: '[Measures]', caption: 'Measures' },
                    ], 
                    values: [
                        { name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                        { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' },
                    ],
                    valueAxis: 'column'
                },
                enableVirtualization: true,
                exportAllPages: true,
                beforeExport: function (args) {
                    pivotGridObj.exportSpecifiedPages = { rowSize: 10, columnSize: 5 }
                },
                displayOption: { view: 'Both' },
                chartSettings: {
                    value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                },
                toolbar: ['Export', 'FieldList'],
                allowExcelExport: true,
                allowConditionalFormatting: true,
                allowPdfExport: true,
                showToolbar: true,
                allowCalculatedField: true,
                showFieldList: true,
                showGroupingBar: true,
                height: '500px',
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For olap specified export sample render', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 4000);
        });
        it('Export', (done: Function) => {
            setTimeout(() => {
            let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
            expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            util.triggerEvent(li, 'mouseover');
            done();
            }, 4000);
        });
        it('PDF Export', (done: Function) => {
            setTimeout(() => {
            (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
            let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
            expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            util.triggerEvent(li, 'mouseover');
            done();
            }, 4000);
        });
        it('Excel Export', (done: Function) => {
            setTimeout(() => {
            (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
            let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
            expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            util.triggerEvent(li, 'mouseover');
            done();
            }, 4000);
        });
        it('CSV Export', (done: Function) => {
            setTimeout(() => {
            (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
            let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
            expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            done();
            }, 4000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('Olap export', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, ExcelExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW 2008R2',
                    cube: 'Adventure Works',
                    providerType: 'SSAS',
                    url: 'https://demos.telerik.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    formatSettings: [{ name: '[Measures].[Customer Count]', format: 'N2' }],
                    rows: [
                        { name: '[Date].[Date]', caption: 'Date Fiscal' },
                    ],
                    columns: [
                        { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                        { name: '[Measures]', caption: 'Measures' },
                    ], 
                    values: [
                        { name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                        { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' },
                    ],
                    valueAxis: 'column'
                },
                enableVirtualization: true,
                exportAllPages: true,
                displayOption: { view: 'Both' },
                chartSettings: {
                    value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                },
                toolbar: ['Export', 'FieldList'],
                allowExcelExport: true,
                allowConditionalFormatting: true,
                allowPdfExport: true,
                showToolbar: true,
                allowCalculatedField: true,
                showFieldList: true,
                showGroupingBar: true,
                height: '500px',
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For olap sample render', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 4000);
        });
        it('Export', (done: Function) => {
            setTimeout(() => {
            let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
            expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            util.triggerEvent(li, 'mouseover');
            done();
            }, 4000);
        });
        it('PDF Export', (done: Function) => {
            setTimeout(() => {
            (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
            let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
            expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            util.triggerEvent(li, 'mouseover');
            done();
            }, 4000);
        });
        it('Excel Export', (done: Function) => {
            setTimeout(() => {
            (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
            let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
            expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            util.triggerEvent(li, 'mouseover');
            done();
            }, 4000);
        });
        it('CSV Export', (done: Function) => {
            setTimeout(() => {
            (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
            let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
            expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            done();
            }, 4000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });
    describe('- HeaderAndFooter', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Text',
                                        value: 'Northwind Traders',
                                        position: { x: 0, y: 100 },
                                        style: { textBrushColor: '#000000', fontSize: 13, hAlign: 'Center', vAlign: 'Bottom' },
                                        font: new PdfStandardFont(PdfFontFamily.Helvetica, 15, PdfFontStyle.Underline),
                                        stringFormat: new PdfStringFormat()
                                    },
                                    {
                                        type: 'Text',
                                        value: 'Southwind Traders',
                                        position: { x: 0, y: 100 },
                                        size: { height: 100, width: 250 },
                                        style: { textPenColor: '#000000', fontSize: 13, hAlign: 'Justify', vAlign: 'Top' },
                                        font: new PdfStandardFont(PdfFontFamily.Courier, 15, PdfFontStyle.Bold)
                                    },
                                    {
                                        type: 'Text',
                                        value: 'Eastern Traders',
                                        position: { x: 0, y: 100 },
                                        style: { fontSize: 13, hAlign: 'Left', vAlign: 'Top' },
                                        font: new PdfStandardFont(PdfFontFamily.Symbol, 15, PdfFontStyle.Regular)
                                    },
                                    {
                                        type: 'Text',
                                        value: 'Western Traders',
                                        position: { x: 0, y: 100 },
                                        size: { height: 100, width: 250 },
                                        style: { textBrushColor: '#000000', fontSize: 13 },
                                        font: new PdfStandardFont(PdfFontFamily.TimesRoman, 15, PdfFontStyle.Strikeout)
                                    },
                                    {
                                        type: 'Text',
                                        value: 'Northeast Traders',
                                        position: { x: 0, y: 100 },
                                        size: { height: 100, width: 250 },
                                        style: { textBrushColor: '#000000', hAlign: 'Right', vAlign: 'Bottom' },
                                        font: new PdfStandardFont(PdfFontFamily.ZapfDingbats, PdfFontStyle.Underline)
                                    },
                                    {
                                        type: 'PageNumber',
                                        pageNumberType: 'Arabic',
                                        format: 'Page {$current} of {$total}',
                                        position: { x: 0, y: 25 },
                                        size: { height: 100, width: 250 },
                                        style: { textBrushColor: '#000000', hAlign: 'Center', vAlign: 'Bottom' }
                                    },
                                    {
                                        type: 'PageNumber',
                                        pageNumberType: 'LowerLatin',
                                        position: { x: 0, y: 25 },
                                        style: { textBrushColor: '#ffff80', fontSize: 15, hAlign: 'Center' },
                                    },
                                    {
                                        type: 'PageNumber',
                                        pageNumberType: 'LowerRoman',
                                        format: 'Page',
                                        position: { x: 0, y: 25 },
                                        style: { fontSize: 15, hAlign: 'Center' }
                                    },
                                    {
                                        type: 'PageNumber',
                                        pageNumberType: 'UpperLatin',
                                        format: 'Page {$current}',
                                        position: { x: 0, y: 25 },
                                        style: { textBrushColor: '#ffff80', fontSize: 15, hAlign: 'Center' }
                                    },
                                    {
                                        type: 'PageNumber',
                                        pageNumberType: 'UpperRoman',
                                        format: 'Page {$total} of {$current}',
                                        position: { x: 0, y: 25 },
                                        style: { textBrushColor: '#ffff80', fontSize: 15, hAlign: 'Center' }
                                    },
                                    {
                                        type: 'Image',
                                        src: image,
                                        position: { x: 40, y: 10 },
                                        size: { height: 100, width: 250 }
                                    },
                                    {
                                        type: 'Image',
                                        src: image,
                                        position: { x: 40, y: 10 },
                                        size: { height: 100, width: null }
                                    },
                                    {
                                        type: 'Image',
                                        src: image,
                                        position: { x: 40, y: 10 },
                                        size: { height: null, width: null }
                                    },
                                    {
                                        type: 'Line',
                                        pageNumberType: 'Numeric',
                                        style: { penColor: '#000080', penSize: 2, dashStyle: 'Dash' },
                                        points: { x1: 0, y1: 4, x2: 685, y2: 4 }
                                    },
                                    {
                                        type: 'Line',
                                        pageNumberType: 'LowerLatin',
                                        style: { penColor: '#000080', penSize: 2, dashStyle: 'DashDot' },
                                        points: { x1: 0, y1: 4, x2: 685, y2: 4 }
                                    },
                                    {
                                        type: 'Line',
                                        pageNumberType: 'LowerRoman',
                                        style: { penColor: '#000080', penSize: 2, dashStyle: 'DashDotDot' },
                                        points: { x1: 0, y1: 4, x2: 685, y2: 4 }
                                    },
                                    {
                                        type: 'Line',
                                        pageNumberType: 'UpperLatin',
                                        style: { penColor: '#000080', penSize: 2, dashStyle: 'Dot' },
                                        points: { x1: 0, y1: 4, x2: 685, y2: 4 }
                                    },
                                    {
                                        type: 'Line',
                                        pageNumberType: 'UpperRoman',
                                        style: { penColor: '#000080', penSize: 2, dashStyle: 'Solid' },
                                        points: { x1: 0, y1: 4, x2: 685, y2: 4 }
                                    }
                                ]
                            },
                            footer: {
                                fromBottom: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Image',
                                        src: image,
                                        position: { x: 40, y: 10 }
                                    },
                                    {
                                        type: 'Text',
                                        value: '',
                                        position: { x: 0, y: 100 },
                                        style: { textBrushColor: '#000000', fontSize: 13, hAlign: 'Center', vAlign: 'Bottom' },
                                        font: new PdfStandardFont(PdfFontFamily.Helvetica, 15, PdfFontStyle.Underline),
                                        stringFormat: new PdfStringFormat()
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                displayOption: { view: 'Both', primary: 'Table' },
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-3', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('For All content types', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Line', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Line',
                                        pageNumberType: 'UpperRoman',
                                        style: { penColor: '#000080', penSize: 2, dashStyle: 'Solid' }
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true,
                displayOption: { view: 'Both', primary: 'Table' },
                chartSettings: {
                    value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-4', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('without points', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Line Without', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: null,
                                        value: 'Northwind Traders',
                                        position: { x: 0, y: 100 },
                                        style: { textBrushColor: '#000000', fontSize: 13, hAlign: 'Center', vAlign: 'Bottom' },
                                        font: new PdfStandardFont(PdfFontFamily.Helvetica, 15, PdfFontStyle.Underline),
                                        stringFormat: new PdfStringFormat()
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-5', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('type', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Line Without x1', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Line',
                                        pageNumberType: 'UpperRoman',
                                        style: { penColor: '#000080', penSize: 2, dashStyle: 'Solid' },
                                        points: { x1: null, y1: 10, x2: 10, y2: 10 }
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-6', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('point', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Line Without x2', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Line',
                                        pageNumberType: 'UpperRoman',
                                        style: { penColor: '#000080', penSize: 2, dashStyle: 'Solid' },
                                        points: { x1: 10, y1: 10, x2: null, y2: 10 }
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-7', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('point', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Line Without y1', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Line',
                                        pageNumberType: 'UpperRoman',
                                        style: { penColor: '#000080', penSize: 2, dashStyle: 'Solid' },
                                        points: { x1: 10, y1: null, x2: 10, y2: 10 }
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-8', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('point', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Line Without y2', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Line',
                                        pageNumberType: 'UpperRoman',
                                        style: { penColor: '#000080', penSize: 2, dashStyle: 'Solid' },
                                        points: { x1: 10, y1: 10, x2: 10, y2: null }
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-9', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('point', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Image', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Image',
                                        src: image
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-10', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('Without any position', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Image Without x', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Image',
                                        src: image,
                                        position: { x: null, y: 10 }
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-11', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('postion', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Image Without y', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Image',
                                        src: image,
                                        position: { x: 10, y: null }
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-12', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('postion', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Image Without', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 0,
                                height: 0,
                                contents: [
                                    {
                                        type: 'Image',
                                        src: null,
                                        position: { x: 10, y: 10 }
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-13', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('src', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for Image Without', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 10,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Text',
                                        value: 'Header',
                                        position: { x: 0, y: 100 },
                                        style: { textBrushColor: '', fontSize: 13, hAlign: 'Center', vAlign: 'Bottom' },
                                        font: new PdfStandardFont(PdfFontFamily.Helvetica, 15, PdfFontStyle.Underline),
                                        stringFormat: new PdfStringFormat()
                                    }
                                ]
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-14', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('textBrushColor', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });

    describe('- HeaderAndFooter for', () => {
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
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            header: {
                                fromTop: 10,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Text',
                                        value: 'Header',
                                        position: { x: 0, y: 100 }
                                    }
                                ]
                            },
                            footer: {
                                fromBottom: 10,
                                height: 300,
                                contents: [
                                    {
                                        type: 'Text',
                                        value: 'Footer',
                                        position: { x: 0, y: 100 }
                                    }
                                ]
                            }
                        };
                        pivotGridObj.chartExport('PDF', pdfExportProperties)
                    }
                },
                beforeExport: (args: BeforeExportEventArgs) => {
                    args.fileName = 'PivotChart'
                },
                height: 800,
                width: 800,
                showToolbar: true,
                allowPdfExport: true,
                enableVirtualization: true,
                displayOption: { view: 'Chart' },
                toolbar: ['Export'],
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-15', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('Chart', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('memory leak', () => {
            profile.sample();
            let average: any = inMB(profile.averageChange);
            //Check average change in memory samples to not be over 10MB
            let memory: any = inMB(getMemoryProfile());
            //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
            expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        });
    });
});