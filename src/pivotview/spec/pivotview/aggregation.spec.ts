import { IDataSet } from '../../src/base/engine';
import { pivot_dataset, pivot_smalldata } from '../base/datasource.spec';
import { PivotUtil } from '../../src/base/util';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { closest, createElement, EmitType, getInstance, remove } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { NumberFormatting } from '../../src/common/popups/formatting-dialog';
import { VirtualScroll } from '../../src/pivotview/actions';
import { PDFExport } from '../../src/pivotview/actions/pdf-export';
import { ExcelExport } from '../../src/pivotview/actions/excel-export';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { Toolbar } from '../../src/common/popups/toolbar';
import { DrillThrough } from '../../src/pivotview/actions';
import { FieldList } from '../../src/common/actions/field-list';
import { Pager } from '../../src/pivotview/actions/pager';
import { Grouping } from '../../src/common/popups/grouping';
import { TreeView } from '@syncfusion/ej2-navigations';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';
import { ExcelHeaderQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';

describe('PivotView spec', () => {
    /**
     * Test case for PivotEngine
     */
    describe('PivotEngine population', () => {
        let pivotDataset: IDataSet[] = [
            { Amount: 100, Country: 'Canada', Date: 'FY 2005', Product: 'Bike', State: 'Califo', Sold: 200, Status: 'up' },
            { Amount: 200, Country: 'India', Date: 'FY 2006', Product: 'Van', State: 'Miyar', Sold: 125, Status: 'high' },
            { Amount: 100, Country: 'Africa', Date: 'FY 2007', Product: 'Tempo', State: 'Tada', Sold: 300, Status: 'down' },
            { Amount: 200, Country: 'Southee', Date: 'FY 2008', Product: 'Car', State: 'Basuva', Sold: 600, Status: 'low' },
            { Amount: 400, Country: 'Thanganega', Date: 'FY 2005', Product: 'Bike', State: 'Califo', Sold: 200, Status: 'up' },
            { Amount: 600, Country: 'Canada', Date: 'FY 2006', Product: 'Jet', State: 'Miyar', Sold: 425, Status: 'up' },
            { Amount: 300, Country: 'Canada', Date: 'FY 2007', Product: 'Tempo', State: 'Tada', Sold: 900, Status: 'down' },
            { Amount: 230, Country: 'Southee', Date: 'FY 2008', Product: 'Van', State: 'Basuva', Sold: 1600, Status: 'up' },
            { Amount: 900, Country: 'Thanganega', Date: 'FY 2005', Product: 'Bike', State: 'Califo', Sold: 200, Status: 'down' },
            { Amount: 2600, Country: 'India', Date: 'FY 2006', Product: 'Jet', State: 'Miyar', Sold: 425, Status: 'low' },
            { Amount: 560, Country: 'Thanganega', Date: 'FY 2007', Product: 'Tempo', State: 'Tada', Sold: 900, Status: 'up' },
            { Amount: 730, Country: 'Southee', Date: 'FY 2008', Product: 'Van', State: 'Basuva', Sold: 1600, Status: 'high' }
        ];
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
                date: "Wed Feb 16 2000 15:01:01 GMT+0530 (India Standard Time)",
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

        describe('Aggregation', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, DrillThrough, Pager, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivotDataset as IDataSet[],
                        valueSortSettings: { "headerDelimiter": "##", "sortOrder": "Ascending" },
                        drilledMembers: [{ name: 'State', items: ['Tada', 'Califo'] }],
                        rows: [{ name: 'State' }, { name: 'Product' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'Country', expandAll: true }, { name: 'Date' }],
                        values: [{ name: 'Sold', type: 'Sum' }, { name: 'Amount', type: 'Count' }],
                        expandAll: false,
                        enableSorting: true,
                        groupSettings: [
                            { name: 'Date', type: 'Date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2006, 10, 5) }
                        ],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        valueAxis: 'column',
                        valueIndex: 2,
                        filters: [],
                        fieldMapping: [{ name: 'Status', dataType: 'string' }],
                        conditionalFormatSettings: [
                            {
                                measure: 'Amount',
                                value1: 1000,
                                conditions: 'LessThan',
                                style: {
                                    backgroundColor: '#80cbc4',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            },
                            {
                                value1: 500,
                                value2: 1000,
                                measure: 'Sold',
                                conditions: 'Between',
                                style: {
                                    backgroundColor: '#f48fb1',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            }
                        ],
                        showHeaderWhenEmpty: false,
                        emptyCellsTextContent: '-',
                        showAggregationOnValueField: true
                    },
                    height: 800,
                    width: 800,
                    allowDrillThrough: true,
                    allowDataCompression: true,
                    showToolbar: true,
                    allowExcelExport: true,
                    allowConditionalFormatting: true,
                    allowPdfExport: true,
                    showGroupingBar: true,
                    enableVirtualization: false,
                    showFieldList: false,
                    showValuesButton: true,
                    allowGrouping: true,
                    enablePaging: false,
                    allowNumberFormatting: true,
                    allowCalculatedField: true,
                    allowDeferLayoutUpdate: true,
                    enableValueSorting: true,
                    exportAllPages: false,
                    maxNodeLimitInMemberEditor: 50,
                    saveReport: util.saveReport.bind(this),
                    fetchReport: util.fetchReport.bind(this),
                    loadReport: util.loadReport.bind(this),
                    removeReport: util.removeReport.bind(this),
                    renameReport: util.renameReport.bind(this),
                    newReport: util.newReport.bind(this),
                    toolbarRender: util.beforeToolbarRender.bind(this),
                    displayOption: { view: 'Both' },
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Pie', animation: { enable: false } }, enableMultipleAxis: false,
                    },
                    gridSettings: {
                        columnWidth: 120, rowHeight: 36, allowSelection: true,
                        selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' }
                    },
                    dataBound: dataBound,
                    toolbar: ['Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Initial', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][1] as IDataSet).formattedText).toBe("-");
                    done();
                }, 100);
            });
            it('Type', () => {
                pivotGridObj.dataSourceSettings.values[0].type = 'Avg';
            });
            it('Type1', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'DifferenceFrom';
            });
            it('Type2', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'DistinctCount';
            });
            it('Type3', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'Index';
            });
            it('Type4', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'Max';
            });
            it('Type5', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'Median';
            });
            it('Type6', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'Min';
            });
            it('Type7', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'PercentageOfColumnTotal';
            });
            it('Type8', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'PercentageOfDifferenceFrom';
            });
            it('Type9', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'PercentageOfGrandTotal';
            });
            it('Type10', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'PercentageOfParentColumnTotal';
            });
            it('Type11', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'PercentageOfParentRowTotal';
            });
            it('Type12', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'PercentageOfParentTotal';
            });
            it('Type13', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'PercentageOfRowTotal';
            });
            it('Type14', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'PopulationStDev';
            });
            it('Type15', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'PopulationVar';
            });
            it('Type16', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'Product';
            });
            it('Type17', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'RunningTotals';
            });
            it('Type18', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'SampleStDev';
            });
            it('Type19', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[0].type = 'SampleVar';
            });
            it('Sorting-row', () => {
                (document.querySelectorAll('.e-sort')[0] as HTMLElement).click();
            });
            it('Sorting-column', () => {
                (document.querySelectorAll('.e-sort')[0] as HTMLElement).click();
            });
            it('Drilldown-row', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
            });
            it('Drilldown-column', () => {
                (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
            });
            it('Drillup-row', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
            });
            it('Drillup-column', () => {
                (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
            });
            it('Change settings', () => {
                pivotGridObj.dataSourceSettings.valueAxis = 'row';
                pivotGridObj.dataSourceSettings.valueIndex = 1;
                pivotGridObj.enableVirtualization = true;
                pivotGridObj.dataSourceSettings.expandAll = false;
            });
            it('Initial', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][1] as IDataSet).formattedText).toBe("-");
                    done();
                }, 100);
            });
            it('AnotherType', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'Avg';
            });
            it('AnotherType1', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'DifferenceFrom';
            });
            it('AnotherType2', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'DistinctCount';
            });
            it('AnotherType3', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'Index';
            });
            it('AnotherType4', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'Max';
            });
            it('AnotherType5', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'Median';
            });
            it('AnotherType6', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'Min';
            });
            it('AnotherType7', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'PercentageOfColumnTotal';
            });
            it('AnotherType8', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'PercentageOfDifferenceFrom';
            });
            it('AnotherType9', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'PercentageOfGrandTotal';
            });
            it('AnotherType10', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'PercentageOfParentColumnTotal';
            });
            it('AnotherType11', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'PercentageOfParentRowTotal';
            });
            it('AnotherType12', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'PercentageOfParentTotal';
            });
            it('AnotherType13', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'PercentageOfRowTotal';
            });
            it('AnotherType14', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'PopulationStDev';
            });
            it('AnotherType15', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'PopulationVar';
            });
            it('AnotherType16', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'Product';
            });
            it('AnotherType17', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'RunningTotals';
            });
            it('AnotherType18', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'SampleStDev';
            });
            it('AnotherType19', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                pivotGridObj.dataSourceSettings.values[1].type = 'SampleVar';
            });
            it('Sorting-row1', () => {
                (document.querySelectorAll('.e-sort')[0] as HTMLElement).click();
            });
            it('Sorting-column1', () => {
                (document.querySelectorAll('.e-sort')[0] as HTMLElement).click();
            });
            it('Drilldown-row1', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
            });
            it('Drilldown-column1', () => {
                (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
            });
            it('Drillup-row1', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("-");
                (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
            });
            it('Drillup-column1', () => {
                (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
            });
        });
        describe('Grouping Settings update', () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000; // Increase timeout interval to 30 seconds
        
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            let pivotDataset: IDataSet[] = [
                { Amount: 100, Country: 'Canada', Date: 'FY 2005', Product: 'Bike', State: 'Califo', Sold: 200, Status: 'up' },
                { Amount: 200, Country: 'India', Date: 'FY 2006', Product: 'Van', State: 'Miyar', Sold: 125, Status: 'high' },
                { Amount: 100, Country: 'Africa', Date: 'FY 2007', Product: 'Tempo', State: 'Tada', Sold: 300, Status: 'down' },
                { Amount: 200, Country: 'Southee', Date: 'FY 2008', Product: 'Car', State: 'Basuva', Sold: 600, Status: 'low' },
                { Amount: 400, Country: 'Thanganega', Date: 'FY 2005', Product: 'Bike', State: 'Califo', Sold: 200, Status: 'up' },
                { Amount: 600, Country: 'Canada', Date: 'FY 2006', Product: 'Jet', State: 'Miyar', Sold: 425, Status: 'up' },
                { Amount: 300, Country: 'Canada', Date: 'FY 2007', Product: 'Tempo', State: 'Tada', Sold: 900, Status: 'down' },
                { Amount: 230, Country: 'Southee', Date: 'FY 2008', Product: 'Van', State: 'Basuva', Sold: 1600, Status: 'up' },
                { Amount: 900, Country: 'Thanganega', Date: 'FY 2005', Product: 'Bike', State: 'Califo', Sold: 200, Status: 'down' },
                { Amount: 2600, Country: 'India', Date: 'FY 2006', Product: 'Jet', State: 'Miyar', Sold: 425, Status: 'low' },
                { Amount: 560, Country: 'Thanganega', Date: 'FY 2007', Product: 'Tempo', State: 'Tada', Sold: 900, Status: 'up' },
                { Amount: 730, Country: 'Southee', Date: 'FY 2008', Product: 'Van', State: 'Basuva', Sold: 1600, Status: 'high' }
            ];
        
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
        
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
        
                let dataBound: EmitType<Object> = () => { 
                    console.log('Data Bound event fired');
                    done(); 
                };
        
                PivotView.Inject(GroupingBar, DrillThrough, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
        
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivotDataset as IDataSet[],
                        valueSortSettings: { "headerDelimiter": "##", "sortOrder": "Ascending" },
                        drilledMembers: [{ name: 'State', items: ['Tada', 'Califo'] }],
                        rows: [{ name: 'State' }, { name: 'Product' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'Country', expandAll: true }, { name: 'Date' }],
                        values: [{ name: 'Sold', type: 'Sum' }, { name: 'Amount', type: 'Count' }],
                        expandAll: false,
                        enableSorting: true,
                        groupSettings: [
                            { name: 'Date', type: 'Date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2006, 10, 5) }
                        ],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        valueAxis: 'column',
                        valueIndex: 2,
                        filters: [],
                        fieldMapping: [{ name: 'Status', dataType: 'string' }],
                        conditionalFormatSettings: [
                            {
                                measure: 'Amount',
                                value1: 1000,
                                conditions: 'LessThan',
                                style: {
                                    backgroundColor: '#80cbc4',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            },
                            {
                                value1: 500,
                                value2: 1000,
                                measure: 'Sold',
                                conditions: 'Between',
                                style: {
                                    backgroundColor: '#f48fb1',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            }
                        ],
                        showHeaderWhenEmpty: false,
                        emptyCellsTextContent: '-',
                        showAggregationOnValueField: true
                    },
                    allowCalculatedField: true,
                    showGroupingBar: true,
                    groupingBarSettings: { showFieldsPanel: true },
                    height: 500,
                    dataBound: dataBound,
                });
        
                pivotGridObj.appendTo('#PivotGrid');
            });
        
            it('Initial- Rendering', (done: Function) => {
                console.log('Initial rendering test started');
                setTimeout(() => {
                    console.log('Checking pivot values');
                    expect((pivotGridObj.engineModule.pivotValues[4][1] as IDataSet).formattedText).toBe("-");
                    done();
                }, 500);
            });
        });
        describe('Excel and Pdf Events', () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, DrillThrough, Pager, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        allowLabelFilter: true,
                        allowValueFilter: true,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    height: 800,
                    width: 800,
                    displayOption: { view: 'Both' },
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,showMemberSeries:true,
                    },
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
                    allowExcelExport: true,
                    allowConditionalFormatting: true,
                    allowPdfExport: true,
                    showToolbar: true,
                    allowCalculatedField: true,
                    showFieldList: true,
                    gridSettings: {
                        excelHeaderQueryCellInfo: (args: ExcelHeaderQueryCellInfoEventArgs) => {
                            //triggers every time for header cell while exporting
                        },
                        pdfQueryCellInfo: (args: PdfQueryCellInfoEventArgs) => {
                            //triggers every time for value cell while pdf exporting
                        },
                        excelQueryCellInfo: (args: ExcelQueryCellInfoEventArgs) => {
                            //triggers every time for value cell while exporting
                        },
                        pdfHeaderQueryCellInfo: (args: PdfHeaderQueryCellInfoEventArgs) => {
                            //triggers every time for header cell while pdf exporting
                        }
                    },
                    dataBound: dataBound,
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Export', () => {
                debugger;
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
            });
            it('PDF Export', () => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
            });
            it('Excel Export', () => {
                (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                util.triggerEvent(li, 'mouseover');
            });
            it('CSV Export', () => {
                (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            });
        });
        describe('Aggregation-string fields', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, FieldList);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivotDataset as IDataSet[],
                        valueSortSettings: { "headerDelimiter": "##", "sortOrder": "Ascending" },
                        drilledMembers: [{ name: 'State', items: ['Tada', 'Califo'] }],
                        rows: [{ name: 'State' }, { name: 'Product' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'Country'}],
                        values: [{ name: 'Status' }, { name: 'Amount', type: 'Count' }],
                        expandAll: false,
                        enableSorting: true,
                        fieldMapping: [{ name: 'Status', dataType: 'string' }],
                        showHeaderWhenEmpty: false,
                        emptyCellsTextContent: '-',
                        showAggregationOnValueField: true
                    },
                    height: 800,
                    width: 800,
                    showGroupingBar: true,
                    showFieldList: false,
                    dataBound: dataBound,
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 100);
            });
            it('Initial', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.engineModule.pivotValues.length).toBe(9);
                    done();
                }, 100);
            });
            it('- Using the corresponding method', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-values .e-dropdown-icon')[0] as HTMLElement).click();
                    done();
                }, 1000);
            });
        });
    });
  
});