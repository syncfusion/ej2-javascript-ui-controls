import { IDataSet } from '../../src/base/engine';
import { pivot_dataset, pivot_smalldata } from '../base/datasource.spec';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType} from '@syncfusion/ej2-base';
import { Pager, VirtualScroll } from '../../src/pivotview/actions';
import { PDFExport } from '../../src/pivotview/actions/pdf-export';
import { ExcelExport } from '../../src/pivotview/actions/excel-export';
import { Toolbar } from '../../src/common/popups/toolbar';
import { FieldList } from '../../src/common/actions/field-list';
import { BeforeExportEventArgs, ExportCompleteEventArgs, PdfCellRenderArgs, PivotActionBeginEventArgs } from '../../src/common/base/interface';
import { ExcelExportProperties, PdfExportProperties } from '@syncfusion/ej2-grids';
import { PdfFontFamily, PdfFontStyle, PdfPageSize, PdfStandardFont, PdfStringFormat } from '@syncfusion/ej2-pdf-export';

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
                pending(); //Skips test (in Chai)
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
                virtualScrollSettings: { allowSinglePage: false }
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
                pending(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll, ExcelExport);
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
                allowExcelExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true,
                onPdfCellRender: (args: PdfCellRenderArgs) => {
                    if (args.pivotCell && args.pivotCell.valueSort && args.pivotCell.valueSort.levelName === 'male.balance') {
                        args.column.width = 50;
                    }
                },
                virtualScrollSettings: { allowSinglePage: false }
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
        it('Excel Export', (done: Function) => {
            pivotGridObj.excelExport();
            setTimeout(() => {
                expect(1).toBe(1);
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
                pending(); //Skips test (in Chai)
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
                pending(); //Skips test (in Chai)
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
                },
                virtualScrollSettings: { allowSinglePage: false }
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
                pending(); //Skips test (in Chai)
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
                pending(); //Skips test (in Chai)
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
                pending(); //Skips test (in Chai)
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
                pending(); //Skips test (in Chai)
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
                pending(); //Skips test (in Chai)
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
                pending(); //Skips test (in Chai)
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
                pending(); //Skips test (in Chai)
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
                pending(); //Skips test (in Chai)
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
                pending(); //Skips test (in Chai)
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

    describe('- Applying back color to table - Excel export', () => {
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
                pending(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll, ExcelExport);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                gridSettings: {
                    excelQueryCellInfo: (args) => {
                        args.style = { backColor: '#81D0FF' };
                    },
                },
                height: 800,
                width: '100%',
                allowExcelExport: true,
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('- Exporting', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
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
                pending(); //Skips test (in Chai)
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
                pending(); //Skips test (in Chai)
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
                virtualScrollSettings: { allowSinglePage: false }
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

    describe('- Applying the theme to the cells in the PDF', () => {
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
                pending(); //Skips test (in Chai)
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
                height: 800,
                width: '100%',
                allowPdfExport: true,
                showFieldList: true,
                toolbar: ['Export'],
                showToolbar: true,
                enableVirtualization: true,
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            fileName: 'sample',
                            theme: {
                                header: {
                                    fontColor: '#64FA50', fontName: 'Calibri', fontSize: 17, underline: true, bold: true,
                                    strikeout: true, font: new PdfStandardFont(PdfFontFamily.Helvetica, 15, PdfFontStyle.Underline)
                                },
                                record: {
                                    fontColor: '#64FA50', fontName: 'Courier', fontSize: 17, italic: true,
                                    border: { color: '#64FA50', lineStyle: 'Thin', dashStyle: 'Dash' },
                                    font: new PdfStandardFont(PdfFontFamily.Helvetica, 15, PdfFontStyle.Underline)
                                },
                                caption: {
                                    fontColor: '#64FA50', fontName: 'Calibri', fontSize: 17, strikeout: true
                                }
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false);
                    }
                },
                beforeExport: (args: BeforeExportEventArgs) => {
                    args.fileName = 'Export';
                },
                virtualScrollSettings: { allowSinglePage: false }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('- Table render', (done: Function) => {
            setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[0][1] as IDataSet).formattedText).toBe("female");
                done();
            }, 1500);
        });
        it('- Exporting', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 500);
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

    describe('- Applying the styles to the cells in the PDF', () => {
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
                pending(); //Skips test (in Chai)
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
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        let pdfExportProperties: PdfExportProperties = {
                            theme: {
                                header: {
                                    fontColor: '#64FA50', fontName: 'TimesRoman', fontSize: 17, underline: true, bold: true,
                                    strikeout: true, font: new PdfStandardFont(PdfFontFamily.Helvetica, 15, PdfFontStyle.Underline)
                                },
                                record: {
                                    fontColor: '#64FA50', fontName: 'Symbol', fontSize: 17, italic: true,
                                    border: { color: '#64FA50', lineStyle: 'Thin', dashStyle: 'Dash' },
                                    font: new PdfStandardFont(PdfFontFamily.Helvetica, 15, PdfFontStyle.Underline)
                                }
                            }
                        };
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false);
                    }
                },
                onPdfCellRender: (args: PdfCellRenderArgs) => {
                    args.style = {
                        fontFamily: 'Helvetica',
                        bold: true,
                        italic: true,
                        underline: true,
                        strikeout: true,
                        backgroundColor: '#000080',
                        textBrushColor: '#000080',
                        textPenColor: '#000000',
                        border: { color: '#64FA50', dashStyle: 'Dash' }
                    };
                },
                virtualScrollSettings: { allowSinglePage: false }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('- Exporting', (done: Function) => {
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
    describe('- PDf Export Properties in Chart', () => {
        let pivotGridObj: PivotView;
        let pdfExportProperties: PdfExportProperties = {
            pageSize:'A4',
            pageOrientation:'Landscape',
            header: {
                fromTop: 0,
                height: 130,
                contents: [
                    {
                        type: 'Text',
                        value: "Northwind Traders",
                        position: { x: 0, y: 50 },
                        style: { textBrushColor: '#000000', fontSize: 13 }
                    },

                ]
            },
            footer: {
                fromBottom: 160,
                height: 150,
                contents: [
                    {
                        type: 'PageNumber',
                        pageNumberType: 'Arabic',
                        format: 'Page {$current} of {$total}',
                        position: { x: 0, y: 25 },
                        style: { textBrushColor: '#02007a', fontSize: 15 }
                    }
                ]
            }
        }
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
                pending(); //Skips test (in Chai)
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
                    expandAll: false,
                    enableSorting: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                width: '100%',
                height: 300,
                allowCalculatedField: true,
                allowExcelExport: true,
                allowPdfExport: true,
                showFieldList: true,
                showTooltip:true,
                enableVirtualization: true,
                toolbar: ['Export'],
                showToolbar: true,
                allowConditionalFormatting: true,
                displayOption: { view: 'Both', primary: 'Chart' },

                chartSettings: {
                    value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: true, showPointColorByMembers: true, enableScrollOnMultiAxis: true,
                },
                exportComplete: (args: ExportCompleteEventArgs) => {
                    if (args.promise) {
                        args.promise.then((e: { blobData: Blob }) => {
                            console.log(e.blobData);
                        });
                    }
                },
                beforeExport: (args: BeforeExportEventArgs) => {
                    if (args.currentExportView === 'Chart') {
                        args.width = 200;
                        args.height = pivotGridObj.element.offsetHeight;
                        args.fileName = "ChartExport";
                        args.pdfMargins.top = 10;
                        args.pdfMargins.bottom = 15;
                        args.pdfMargins.left = 12;
                        args.pdfMargins.right = 4;
                        args.pdfExportProperties = pdfExportProperties;
            
                    } else if (args.currentExportView === 'Table') {
                        args.width = pivotGridObj.element.offsetWidth;
                        args.height = pivotGridObj.element.offsetHeight;
                    }
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-Chart', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('Pdf Export in Chart', (done: Function) => {
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
    describe('-Empty Data in Chart', () => {
        let pivotGridObj: PivotView;
        let pdfExportProperties: PdfExportProperties = {
            header: {
                fromTop: 0,
                height: 130,
                contents: [
                    {
                        type: 'Text',
                        value: "Northwind Traders",
                        position: { x: 0, y: 50 },
                        style: { textBrushColor: '#000000', fontSize: 13 }
                    },

                ]
            },
            footer: {
                fromBottom: 160,
                height: 150,
                contents: [
                    {
                        type: 'PageNumber',
                        pageNumberType: 'Arabic',
                        format: 'Page {$current} of {$total}',
                        position: { x: 0, y: 25 },
                        style: { textBrushColor: '#02007a', fontSize: 15 }
                    }
                ]
            }
        }
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
                pending(); //Skips test (in Chai)
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
                    expandAll: false,
                    enableSorting: true,
                },
                width: '100%',
                height: 300,
                allowCalculatedField: true,
                allowExcelExport: true,
                allowPdfExport: true,
                showFieldList: true,
                enableVirtualization: true,
                toolbar: ['Export'],
                showToolbar: true,
                allowConditionalFormatting: true,
                displayOption: { view: 'Both', primary: 'Chart' },

                chartSettings: {
                    value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: true, showPointColorByMembers: true, enableScrollOnMultiAxis: true,
                },
              
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-Empty Data', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
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
    describe('- Excel Export With Header', () => {
        let pivotGridObj: PivotView;
        let excelExportProperties: ExcelExportProperties = {
            header: {
                headerRows: 2,
                rows: [
                    { cells: [{ colSpan: 4, value: "Pivot Table", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'Center', bold: true, underline: true } }] }
                ]
            },
            footer: {
                footerRows: 4,
                rows: [
                    { cells: [{ colSpan: 4, value: "Thank you for your business!", style: { hAlign: 'Center', bold: true } }] },
                    { cells: [{ colSpan: 4, value: "!Visit Again!", style: { hAlign: 'Center', bold: true } }] }
                ]
            }
        };
       
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
                pending(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport,ExcelExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_smalldata as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    columns: [{ name: 'Date' }, { name: 'Product' }],
                    rows: [{ name: 'Country' }, { name: 'State' }],
                    formatSettings: [{ name: 'Amount', format: 'C' }],
                    values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                    allowValueFilter: false,
                    allowLabelFilter: true
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'Excel export') {
                       pivotGridObj.excelExport(excelExportProperties)
                        
                    }
                },
                width: '100%',
                height: 300,
                allowCalculatedField: true,
                allowExcelExport: true,
                allowPdfExport: true,
                showFieldList: true,
                showTooltip:true,
                enableVirtualization: true,
                toolbar: ['Export'],
                showToolbar: true,
                allowConditionalFormatting: true,
                displayOption: { view: 'Both', primary: 'Table' },

                chartSettings: {
                    value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: true, showPointColorByMembers: true, enableScrollOnMultiAxis: true,
                },
                
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-Chart', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('Excel  Export in header', (done: Function) => {
            setTimeout(() => {
                debugger;
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                done();
            }, 2000);
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
    describe('Export', () => {
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
                pending(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: [
                        { row: 'row1', column1: 'column1', column2: 'column1', value: 1 },
                        { row: 'row2', column1: 'column2', column2: 'column2', value: 2 },
                        { row: 'row3', column1: 'column3', column2: 'column3', value: 3 },
                        { row: 'row4', column1: 'column4', column2: 'column4', value: 4 },
                    ],
                    columns: [{ name: 'column1' }, { name: 'column2' }],
                    rows: [],
                    values: [{ name: 'value' }],
                    valueAxis: 'row'
                },
                allowPdfExport: true,
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Export ensuring for row axis.', (done: Function) => {
            pivotGridObj.pdfExport();
            setTimeout(() => {
                pivotGridObj.dataSourceSettings = {
                    dataSource: [
                        { row: 'row1', column1: 'column1', column2: 'column1', value: 1 },
                        { row: 'row2', column1: 'column2', column2: 'column2', value: 2 },
                        { row: 'row3', column1: 'column3', column2: 'column3', value: 3 },
                        { row: 'row4', column1: 'column4', column2: 'column4', value: 4 },
                    ],
                    columns: [],
                    rows: [{ name: 'row' }],
                    values: [{ name: 'value' }],
                    valueAxis: 'column'
                }
                expect(1).toBe(1);
                done();
            }, 1000);
        });
        it('Export ensuring for column axis.', (done: Function) => {
            pivotGridObj.pdfExport();
            setTimeout(() => {
                expect(1).toBe(1);
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
    describe('- PDf Export Properties in Chart without file name', () => {
        let pivotGridObj: PivotView;
        let pdfExportProperties: PdfExportProperties = {
            pageSize:'A4',
            pageOrientation:'Landscape',
            header: {
                fromTop: 0,
                height: 130,
                contents: [
                    {
                        type: 'Text',
                        value: "Northwind Traders",
                        position: { x: 0, y: 50 },
                        style: { textBrushColor: '#000000', fontSize: 13 }
                    },

                ]
            },
            footer: {
                fromBottom: 160,
                height: 150,
                contents: [
                    {
                        type: 'PageNumber',
                        pageNumberType: 'Arabic',
                        format: 'Page {$current} of {$total}',
                        position: { x: 0, y: 25 },
                        style: { textBrushColor: '#02007a', fontSize: 15 }
                    }
                ]
            }
        }
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
                pending(); //Skips test (in Chai)
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
                    expandAll: false,
                    enableSorting: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        pivotGridObj.pdfExport(pdfExportProperties, false, null, false, true);
                    }
                },
                width: '100%',
                height: 300,
                allowCalculatedField: true,
                allowExcelExport: true,
                allowPdfExport: true,
                showFieldList: true,
                showTooltip:true,
                enableVirtualization: true,
                toolbar: ['Export'],
                showToolbar: true,
                allowConditionalFormatting: true,
                displayOption: { view: 'Both', primary: 'Chart' },
                chartSettings: {
                    value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: true, showPointColorByMembers: true, enableScrollOnMultiAxis: true,
                },
                exportComplete: (args: ExportCompleteEventArgs) => {
                    if (args.promise) {
                        args.promise.then((e: { blobData: Blob }) => {
                            console.log(e.blobData);
                        });
                    }
                },
                beforeExport: (args: BeforeExportEventArgs) => {
                    if (args.currentExportView === 'Chart') {
                        args.pdfMargins.top = 10;
                        args.pdfMargins.bottom = 15;
                        args.pdfMargins.left = 12;
                        args.pdfMargins.right = 4;
                        args.pdfExportProperties = pdfExportProperties;
            
                    } else if (args.currentExportView === 'Table') {
                        args.width = pivotGridObj.element.offsetWidth;
                        args.height = pivotGridObj.element.offsetHeight;
                    }
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('For sample render-Chart', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('Pdf Export in Chart', (done: Function) => {
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
    describe('Excel Export with paging', () => {
        let pivotGridObj: PivotView;
        let excelExportProperties: ExcelExportProperties = {
            header: {
                headerRows: 2,
                rows: [
                    { cells: [{ colSpan: 4, value: "Pivot Table", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'Center', bold: true, underline: true } }] }
                ]
            },
            footer: {
                footerRows: 4,
                rows: [
                    { cells: [{ colSpan: 4, value: "Thank you for your business!", style: { hAlign: 'Center', bold: true } }] },
                    { cells: [{ colSpan: 4, value: "!Visit Again!", style: { hAlign: 'Center', bold: true } }] }
                ]
            }
        };
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
                pending(); //Skips test (in Chai)
                return;
            }
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(Toolbar, PDFExport, ExcelExport, FieldList, VirtualScroll, Pager);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: [
                        { row: 'row1', column1: 'column1', column2: 'column1', value: 1 },
                        { row: 'row2', column1: 'column2', column2: 'column2', value: 2 },
                        { row: 'row3', column1: 'column3', column2: 'column3', value: 3 },
                        { row: 'row4', column1: 'column4', column2: 'column4', value: 4 },
                    ],
                    columns: [{ name: 'column1' }, { name: 'column2' }],
                    rows: [],
                    values: [{ name: 'value' }],
                    valueAxis: 'row'
                },
                allowPdfExport: true,
                allowExcelExport: true,
                enablePaging: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Export ensuring for row axis.', (done: Function) => {
            pivotGridObj.pdfExport();
            setTimeout(() => {
                pivotGridObj.dataSourceSettings = {
                    dataSource: [
                        { row: 'row1', column1: 'column1', column2: 'column1', value: 1 },
                        { row: 'row2', column1: 'column2', column2: 'column2', value: 2 },
                        { row: 'row3', column1: 'column3', column2: 'column3', value: 3 },
                        { row: 'row4', column1: 'column4', column2: 'column4', value: 4 },
                    ],
                    columns: [],
                    rows: [{ name: 'row' }],
                    values: [{ name: 'value' }],
                    valueAxis: 'column'
                }
                expect(1).toBe(1);
                done();
            }, 1000);
        });
        it('Export ensuring for column axis.', (done: Function) => {
            pivotGridObj.pdfExport();
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 1000);
        });
        it('Excel Export with header and footer.', (done: Function) => {
            pivotGridObj.excelExport(excelExportProperties);
            setTimeout(() => {
                expect(1).toBe(1);
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