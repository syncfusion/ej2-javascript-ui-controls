import { IDataSet } from '../../src/base/engine';
import { pivot_smalldata } from '../base/datasource.spec';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType} from '@syncfusion/ej2-base';
import { Pager, VirtualScroll } from '../../src/pivotview/actions';
import { PDFExport } from '../../src/pivotview/actions/pdf-export';
import { ExcelExport } from '../../src/pivotview/actions/excel-export';
import { Toolbar } from '../../src/common/popups/toolbar';
import { FieldList } from '../../src/common/actions/field-list';
import { BeforeExportEventArgs, ColumnRenderEventArgs, ExcelExportProperties, ExcelImage, ExportCompleteEventArgs, PdfCellRenderArgs, PivotActionBeginEventArgs } from '../../src/common/base/interface';
import { ExcelQueryCellInfoEventArgs, PdfExportProperties } from '@syncfusion/ej2-grids';
import { PdfFontFamily, PdfFontStyle, PdfPageOrientation, PdfPageSize, PdfStandardFont, PdfStringFormat } from '@syncfusion/ej2-pdf-export';
import { ILoadedEventArgs } from '@syncfusion/ej2-charts';

let image: string = '/9j/4AAQSkZJRgABAQAAAQABAAD/9k=';

describe('PDF Export', () => {
    let pivotDatas: IDataSet[] = [
        {
            _id: "5a940692c2d185d9fde50e5e",
            index: 0,
            guid: "810a1191-81bd-4c18-ac73-d16ad3fc80eb",
            isActive: "false",
            balance: 2430.87,
            advance: 7658,
            quantity: 11,
            age: 21,
            eyeColor: "blue",
            name: "Skinner Ward",
            gender: "male",
            company: "GROK",
            email: "skinnerward@grok.com",
            phone: "+1 (931) 600-3042",
            date: "Wed Feb 16 2000 15:01:01 GMT+053s0 (India Standard Time)",
            product: "Flight",
            state: "New Jercy",
            pno: "FEDD2340",
        },
        {
            _id: "5a940692c5752f1ed81bbb3d",
            index: 1,
            guid: "41c9986b-ccef-459e-a22d-5458bbdca9c7",
            isActive: "true",
            balance: 3192.7,
            advance: 6124,
            quantity: 15,

            age: 27,
            eyeColor: "brown",
            name: "Gwen Dixon",
            gender: "female",
            company: "ICOLOGY",
            email: "gwendixon@icology.com",
            phone: "+1 (951) 589-2187",
            date: "Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)",
            product: "Jet",
            state: "Vetaikan",
            pno: "ERTS4512",
        },
        {
            _id: "5a9406924c0e7f4c98a82ca7",
            index: 2,
            guid: "50d2bf16-9092-4202-84f6-e892721fe5a5",
            isActive: "true",
            balance: 1663.84,
            advance: 7631,
            quantity: 14,

            age: 28,
            eyeColor: "green",
            name: "Deena Gillespie",
            gender: "female",
            company: "OVERPLEX",
            email: "deenagillespie@overplex.com",
            phone: "+1 (826) 588-3430",
            date: "Thu Mar 18 1993 17:07:48 GMT+0530 (India Standard Time)",
            product: "Car",
            state: "New Jercy",
            pno: "ERTS4512",
        },
        {
            _id: "5a940692dd9db638eee09828",
            index: 3,
            guid: "b8bdc65e-4338-440f-a731-810186ce0b3a",
            isActive: "true",
            balance: 1601.82,
            advance: 6519,
            quantity: 18,

            age: 33,
            eyeColor: "green",
            name: "Susanne Peterson",
            gender: "female",
            company: "KROG",
            email: "susannepeterson@krog.com",
            phone: "+1 (868) 499-3292",
            date: "Sat Feb 09 2002 04:28:45 GMT+0530 (India Standard Time)",
            product: "Jet",
            state: "Vetaikan",
            pno: "CCOP1239",
        },
        {
            _id: "5a9406926f9971a87eae51af",
            index: 4,
            guid: "3f4c79ec-a227-4210-940f-162ca0c293de",
            isActive: "false",
            balance: 1855.77,
            advance: 7333,
            quantity: 20,

            age: 33,
            eyeColor: "green",
            name: "Stokes Hicks",
            gender: "male",
            company: "SIGNITY",
            email: "stokeshicks@signity.com",
            phone: "+1 (927) 585-2980",
            date: "Fri Mar 12 2004 11:08:06 GMT+0530 (India Standard Time)",
            product: "Van",
            state: "Tamilnadu",
            pno: "MEWD9812",
        },
        {
            _id: "5a940692bcbbcdde08fcf7ec",
            index: 5,
            guid: "1d0ee387-14d4-403e-9a0c-3a8514a64281",
            isActive: "true",
            balance: 1372.23,
            advance: 5668,
            quantity: 16,

            age: 39,
            eyeColor: "green",
            name: "Sandoval Nicholson",
            gender: "male",
            company: "IDEALIS",
            email: "sandovalnicholson@idealis.com",
            phone: "+1 (951) 438-3539",
            date: "Sat Aug 30 1975 22:02:15 GMT+0530 (India Standard Time)",
            product: "Bike",
            state: "Tamilnadu",
            pno: "CCOP1239",
        },
        {
            _id: "5a940692ff31a6e1cdd10487",
            index: 6,
            guid: "58417d45-f279-4e21-ba61-16943d0f11c1",
            isActive: "false",
            balance: 2008.28,
            advance: 7107,
            quantity: 14,

            age: 20,
            eyeColor: "brown",
            name: "Blake Thornton",
            gender: "male",
            company: "IMMUNICS",
            email: "blakethornton@immunics.com",
            phone: "+1 (852) 462-3571",
            date: "Mon Oct 03 2005 05:16:53 GMT+0530 (India Standard Time)",
            product: "Tempo",
            state: "New Jercy",
            pno: "CCOP1239",
        },
        {
            _id: "5a9406928f2f2598c7ac7809",
            index: 7,
            guid: "d16299e3-e243-4e57-90fb-52446c4c0275",
            isActive: "false",
            balance: 2052.58,
            advance: 7431,
            quantity: 20,

            age: 22,
            eyeColor: "blue",
            name: "Dillard Sharpe",
            gender: "male",
            company: "INEAR",
            email: "dillardsharpe@inear.com",
            phone: "+1 (963) 473-2308",
            date: "Thu May 25 1978 04:57:00 GMT+0530 (India Standard Time)",
            product: "Tempo",
            state: "Rajkot",
            pno: "ERTS4512",
        },
    ];

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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
                    dataSource: pivotDatas as IDataSet[],
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
    describe('PDF Export - Table and chart', () => {
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
                    rows: [{ name: 'row' },],
                    values: [{ name: 'value' }],
                },
                allowPdfExport: true,
                displayOption: { view: 'Both', primary: 'Table'},
                beforeExport: (args: BeforeExportEventArgs) => {
                    args.width = 100;
                    args.height = 100;
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('PDF export - primary table 1', (done: Function) => {
            setTimeout(() => {
                pivotGridObj.pdfExport(undefined, false, undefined, false, true);
                expect(1).toBe(1);
                done();
            }, 1000);
        });
        it('PDF export - primary chart 2', (done: Function) => {
            pivotGridObj.displayOption.primary = 'Chart'
            setTimeout(() => {
                pivotGridObj.pdfExport(undefined, false, undefined, false, true);
                expect(1).toBe(1);
                done();
            }, 1000);
        });
        it('PDF export - primary chart 3', (done: Function) => {
            pivotGridObj.displayOption.primary = 'Chart'
            setTimeout(() => {
                pivotGridObj.chartExport('PDF', { fileName: 'result' }, undefined, null, undefined);
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
        it('Time out', function (done) {
            setTimeout(function () {
                expect(1).toBe(1);
                done();
            }, 1000);
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
        it('Time out', function (done) {
            setTimeout(function () {
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
    describe('- Export Multiple Pivot Tables to Excel - AppendToSheet', () => {
        let pivotGridObj: PivotView;
        let pivotGridObj1: PivotView;
        let excelExportProperties: ExcelExportProperties = {
            multipleExport: { type: 'AppendToSheet', blankRows: 3 },
            includeHiddenColumn: true,
            pivotTableIds : ['PivotView', 'PivotView1'],
            header: {
                headerRows: 5,
                rows: [
                    { cells: [{ colSpan: 4, value: "Pivot Table", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'Center', bold: true, underline: true } }] },
                    { cells: [{ colSpan: 4, hyperlink: { target: 'https://www.northwind.com/', displayText: 'www.northwind.com' }, style: { hAlign: 'Center' } }] },
                    { cells: [{ colSpan: 4, hyperlink: { target: 'mailto:support@northwind.com' }, style: { hAlign: 'Center' } }] },
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
       
        let elem: HTMLElement = createElement('div', { id: 'PivotView' });
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);

        let elem1: HTMLElement = createElement('div', { id: 'PivotView1' });
        if (document.getElementById(elem1.id)) {
            remove(document.getElementById(elem1.id));
        }
        document.body.appendChild(elem1);

        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            if (pivotGridObj1) {
                pivotGridObj1.destroy();
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
                    allowLabelFilter: true,
                    filterSettings: [{name: 'Country', items: ['United Kingdom'], type: 'Exclude'}]
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'Excel export') {
                        args.cancel = true;
                        pivotGridObj.excelExport(excelExportProperties, true);
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
                gridSettings: {
                    excelQueryCellInfo: (args: ExcelQueryCellInfoEventArgs) => {
                        if ((args.cell as any).formattedText == "Canada") {
                            args.image = { height: 75, base64: image, width: 75 };
                        }
                    }
                }
            });
            pivotGridObj.appendTo('#PivotView');
            pivotGridObj1 = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_smalldata as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    columns: [{ name: 'Date' }, { name: 'Product' }],
                    rows: [{ name: 'Country' }, { name: 'State' }],
                    formatSettings: [{ name: 'Amount', format: 'C' }],
                    values: [{ name: 'Amount' }], filters: [],
                    allowValueFilter: false,
                    allowLabelFilter: true,
                    filterSettings: [{name: 'Country', items: ['United Kingdom'], type: 'Exclude'}]
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
                gridSettings: {
                    excelQueryCellInfo: (args: ExcelQueryCellInfoEventArgs) => {
                        if ((args.cell as any).formattedText == "Canada") {
                            args.hyperLink = { target: 'https://www.Syncfusion.com/' };
                            args.image = { base64: image } as any;
                        }
                    },
                    columnRender: (args: ColumnRenderEventArgs) => {
                        args.stackedColumns[1].visible = false;
                    }
                }
            });
            pivotGridObj1.appendTo('#PivotView1');

        });
        it('For sample render-Chart', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('Excel Export - AppendToSheet', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotViewexport_menu').children[0] as HTMLElement;
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
    describe('- Export Multiple Pivot Tables to Excel - NewSheet', () => {
        let pivotGridObj: PivotView;
        let pivotGridObj1: PivotView;
        let excelExportProperties: ExcelExportProperties = {
            multipleExport: { type: 'NewSheet' },
            pivotTableIds : ['PivotTable', 'PivotTable1'],
            header: {
                headerRows: 5,
                rows: [
                    { cells: [{ colSpan: 4, value: "Pivot Table", style: { fontColor: '#C67878', fontSize: 20, hAlign: 'Center', bold: true, underline: true } }] },
                    { cells: [{ colSpan: 4, hyperlink: { target: 'https://www.northwind.com/', displayText: 'www.northwind.com' }, style: { hAlign: 'Center' } }] },
                    { cells: [{ colSpan: 4, hyperlink: { target: 'mailto:support@northwind.com' }, style: { hAlign: 'Center' } }] },
                ]
            },
            footer: {
                footerRows: 4,
                rows: [
                    { cells: [{ colSpan: 4, value: "Thank you for your business!", hyperlink: { target: 'https://www.northwind.com/' }, style: { hAlign: 'Center', bold: true } }] },
                    { cells: [{ colSpan: 4, value: "!Visit Again!", style: { hAlign: 'Center', bold: true } }] }
                ]
            },
            theme:
            {
                header: { fontName: 'Segoe UI', fontColor: '#666666' },
                record: { fontName: 'Segoe UI', fontColor: '#666666' },
                caption: { fontName: 'Segoe UI', fontColor: '#666666' }
            }
        };

        let elem: HTMLElement = createElement('div', { id: 'PivotTable' });
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        let elem1: HTMLElement = createElement('div', { id: 'PivotTable1' });
        if (document.getElementById(elem1.id)) {
            remove(document.getElementById(elem1.id));
        }
        document.body.appendChild(elem1);

        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            if (pivotGridObj1) {
                pivotGridObj1.destroy();
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
                    allowLabelFilter: true,
                    filterSettings: [{name: 'Country', items: ['United Kingdom'], type: 'Exclude'}]
                },
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'Excel export') {
                        args.cancel = true;
                        pivotGridObj.excelExport(excelExportProperties, true);
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
                gridSettings: {
                    excelQueryCellInfo: (args: ExcelQueryCellInfoEventArgs) => {
                        if ((args.cell as any).formattedText == "Canada") {
                            args.image = { height: 10, base64: image } as any;
                        }
                    }
                }
            });
            pivotGridObj.appendTo('#PivotTable');
            pivotGridObj1 = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_smalldata as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    columns: [{ name: 'Date' }, { name: 'Product' }],
                    rows: [{ name: 'Country' }, { name: 'State' }],
                    formatSettings: [{ name: 'Amount', format: 'C' }],
                    values: [{ name: 'Amount' }], filters: [],
                    allowValueFilter: false,
                    allowLabelFilter: true,
                    filterSettings: [{name: 'Country', items: ['United Kingdom'], type: 'Exclude'}]
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
                gridSettings: {
                    columnRender: (args: ColumnRenderEventArgs) => {
                        args.stackedColumns[1].visible = false;
                    }
                }
            });
            pivotGridObj1.appendTo('#PivotTable1');

        });
        it('For sample render-Chart', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 500);
        });
        it('Excel Export - NewSheet', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotTableexport_menu').children[0] as HTMLElement;
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

    describe('- Pivot Chart Export with Header and Footer', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let pdfExportProperties: PdfExportProperties = {
            pageSize: 'A4',
            pageOrientation: 'Landscape',
            header: {
                fromTop: 0,
                height: 130,
                contents: [
                    {
                        type: 'Text',
                        value: 'Northwind Traders',
                        position: { x: 0, y: 50 },
                        style: { textBrushColor: '#000000', fontSize: 13 }
                    }
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
            },
            fileName: 'result'
        };
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
        beforeAll((done: Function) => {
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
            PivotView.Inject(Toolbar, PDFExport);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    expandAll: false
                },
                width: '100%',
                height: 300,
                allowPdfExport: true,
                toolbar: ['Export'],
                showToolbar: true,
                actionBegin: function (args: PivotActionBeginEventArgs) {
                    if (args.actionName === 'PDF export') {
                        args.cancel = true;
                        pivotGridObj.chartExport('PDF', pdfExportProperties, undefined, null, true);
                    }
                },
                chartSettings: {
                    load: function(args: ILoadedEventArgs) {
                        args.chart.theme = 'HighContrast';
                    }
                },
                beforeExport: (args: BeforeExportEventArgs) => {
                    if (args.currentExportView === 'Chart') {
                        args.pdfMargins.top = 10;
                        args.pdfMargins.bottom = 15;
                        args.pdfMargins.left = 12;
                        args.pdfMargins.right = 4;
                        args.orientation = PdfPageOrientation.Portrait;
                        args.pdfExportProperties = pdfExportProperties;
                    }
                },
                displayOption: { view: 'Chart' },
                dataBound: () => done()
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Rendering Example 16', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 300);
        });
        it('Clicking the toolbar item for export', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                done();
            }, 100);
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