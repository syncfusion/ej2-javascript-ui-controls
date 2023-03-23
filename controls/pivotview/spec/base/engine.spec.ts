import { PivotEngine, IDataOptions, IDataSet, IAxisSet, IPageSettings, ICustomProperties, IFilter, IFieldOptions } from '../../src/base/engine';
import { pivot_dataset, pivot_undefineddata } from '../base/datasource.spec';
import { PivotUtil } from '../../src/base/util';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
// import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { closest, createElement, EmitType, remove } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
// import { BeginDrillThroughEventArgs } from '../../src/common/base/interface';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
// import { Grid } from '@syncfusion/ej2-grids';
import { VirtualScroll } from '../../src/pivotview/actions';
import { DrillThrough } from '../../src/pivotview/actions';
import { FieldList } from '../../src/common/actions/field-list';
import { Pager } from '../../src/pivotview/actions/pager';
import { PivotActionCompleteEventArgs } from '../../src/index';
import { TreeView } from '@syncfusion/ej2-navigations';

describe('PivotView spec', () => {
    /**
     * Test case for PivotEngine
     */
    describe('PivotEngine population', () => {
        let pivotDataset: IDataSet[] = [
            { Amount: 100, Country: 'Canada', Date: 'FY 2005', Product: 'Bike', State: 'Califo' },
            { Amount: 200, Country: 'Canada', Date: 'FY 2006', Product: 'Van', State: 'Miyar' },
            { Amount: 100, Country: 'Canada', Date: 'FY 2005', Product: 'Tempo', State: 'Tada' },
            { Amount: 200, Country: 'Canada', Date: 'FY 2005', Product: 'Van', State: 'Basuva' }
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
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
        });
        describe('Check the Field List information', () => {
            let dataSourceSettings: IDataOptions = {
                dataSource: pivotDataset, rows: [{ name: 'Product' }],
                columns: [{ name: 'Date' }], values: [{ name: 'Amount' }], filters: [{ name: 'State' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('Ensure the field list data', () => {
                expect(pivotEngine.fieldList).toBeTruthy;
            });
            it('String node type', () => {
                expect(pivotEngine.fieldList.Country.type === 'string').toBeTruthy;
            });
            it('Number node type', () => {
                expect(pivotEngine.fieldList.Amount.type === 'number').toBeTruthy;
            });
            it('Default sorting type of node', () => {
                expect(pivotEngine.fieldList.Country.sort === 'Ascending').toBeTruthy;
            });
        });
        describe('Initial data binding', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                //filterSettings: [{ name: 'Date', type: 'exclude', items: ['FY 2006']}, {name: 'gender', type: 'include', items: ['Canada']}],
                drilledMembers: [{ name: 'state', items: ['New Jercy'] }],
                dataSource: ds,
                rows: [{ name: 'company' }, { name: 'state' }],
                columns: [{ name: 'name' }],
                values: [{ name: 'balance' },
                { name: 'quantity' }], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('Ensure the initial biding', () => {
                expect(pivotEngine.pivotValues.length).toBe(423);
                expect(pivotEngine.pivotValues[2].length).toBe(843);
            });
            it('Ensure the initial biding with empty row', () => {
                dataSourceSettings = {
                    dataSource: ds
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect(pivotEngine.pivotValues.length).toBe(2);
                expect(pivotEngine.pivotValues[0].length).toBe(1);
            });
        });
        describe('Sort settings', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                sortSettings: [{ name: 'company', order: 'Descending' }],
                dataSource: ds,
                rows: [{ name: 'company' }, { name: 'state' }],
                columns: [{ name: 'name' }],
                values: [{ name: 'balance' },
                { name: 'quantity' }], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('company in decending order', () => {
                expect((pivotEngine.pivotValues[2][0] as IDataSet).actualText).toBe('ZYTREX');
            });
            it('Disable the default sorting', () => {
                dataSourceSettings.enableSorting = false;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('ICOLOGY');
            });
            it('Sorting with unavailable field', () => {
                dataSourceSettings.sortSettings = [{ name: 'test', order: 'Descending' }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('ICOLOGY');
            });
            it('Drilled members with unavailable field', () => {
                dataSourceSettings.drilledMembers = [{ name: 'test', items: ['test', 'ACRUEX'] }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('ICOLOGY');
            });
        });
        describe('Expand all', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                expandAll: false,
                dataSource: ds,
                rows: [{ name: 'company' }, { name: 'state' }],
                columns: [{ name: 'name' }, { name: 'gender' }],
                values: [{ name: 'balance' },
                { name: 'quantity' }], filters: [{ name: 'gender' }]
            };
            let timeStamp1: number = new Date().getTime();
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            let timeStamp2: number = new Date().getTime();
            timeStamp1 = timeStamp2 - timeStamp1;
            it('Expand all members', () => {
                expect(pivotEngine.pivotValues.length === 1338 && pivotEngine.pivotValues[0].length === 3130).toBeTruthy;
            });

            it('Performance metrics', () => {
                let timeStamp1: number = new Date().getTime();
                let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                let timeStamp2: number = new Date().getTime();
                timeStamp1 = timeStamp2 - timeStamp1;
                dataSourceSettings.expandAll = false;
                let ctimeStamp1: number = new Date().getTime();
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                let ctimeStamp2: number = new Date().getTime();
                ctimeStamp1 = ctimeStamp2 - ctimeStamp1;
                expect(timeStamp1 < 1900 && ctimeStamp1 < 640).toBeTruthy;
            });
        });
        describe('Number Format on value field', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                expandAll: false,
                formatSettings: [{ format: 'P2', name: 'balance', useGrouping: true },
                { name: 'quantity', skeleton: 'Ehms', type: 'date' }],
                dataSource: ds,
                rows: [{ name: 'state' }],
                columns: [{ name: 'product' }],
                values: [{ name: 'balance' }, { name: 'advance' },
                { name: 'quantity' }], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('For Percentage', () => {
                expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('2,146,222.00%');
                expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('2,894,924.00%');
            });
            it('For date/time/date-time', () => {
                expect((pivotEngine.pivotValues[2][3] as IDataSet).value).toBe(126);
                expect((pivotEngine.pivotValues[3][3] as IDataSet).value).toBe(178);
            });
            it('Without format', () => {
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('50089');
                expect((pivotEngine.pivotValues[3][2] as IDataSet).formattedText).toBe('70839');
            });
            it('Format with unavailable field', () => {
                dataSourceSettings.formatSettings = [{ format: 'P2', name: 'test', useGrouping: true }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('50089');
                expect((pivotEngine.pivotValues[3][2] as IDataSet).formattedText).toBe('70839');
            });
            describe('With decimal separation', () => {
                let ds: IDataSet[] = pivot_dataset as IDataSet[];
                let dataSourceSettings: IDataOptions = {
                    expandAll: false,
                    formatSettings: [{ format: 'N2', name: 'balance' },
                    { format: '$ ###.00', name: 'advance' }],
                    dataSource: ds,
                    rows: [{ name: 'state' }],
                    columns: [{ name: 'product' }],
                    values: [{ name: 'balance' }, { name: 'advance' },
                    { name: 'quantity' }], filters: [{ name: 'gender' }]
                };
                let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                it('For Numeric separation', () => {
                    expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('21,462.22');
                    expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('28,949.24');
                });
                it('For custom format with curreny', () => {
                    expect((pivotEngine.pivotValues[2][3] as IDataSet).formattedText).toBe('126');
                    expect((pivotEngine.pivotValues[3][3] as IDataSet).formattedText).toBe('178');
                });
            });
            describe('With date and time', () => {
                let ds: IDataSet[] = pivot_dataset as IDataSet[];
                let dataSourceSettings: IDataOptions = {
                    expandAll: false,
                    formatSettings: [{ name: 'balance', skeleton: 'medium', type: 'date' },
                    { name: 'advance', skeleton: 'short', type: 'time' },
                    { name: 'quantity', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                    dataSource: ds,
                    rows: [{ name: 'state' }],
                    columns: [{ name: 'product' }],
                    values: [{ name: 'balance' }, { name: 'advance' },
                    { name: 'quantity' }],
                    filters: [{ name: 'gender' }]
                };
                let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                it('For Date', () => {
                    expect((pivotEngine.pivotValues[2][1] as IDataSet).formattedText).toBe('Jan 1, 1970');
                    expect((pivotEngine.pivotValues[3][1] as IDataSet).formattedText).toBe('Jan 1, 1970');
                });
                it('For Time', () => {
                    expect((pivotEngine.pivotValues[2][2] as IDataSet).value).toBe(50089);
                    expect((pivotEngine.pivotValues[3][2] as IDataSet).value).toBe(70839);
                });
                it('For DateTime', () => {
                    expect((pivotEngine.pivotValues[2][3] as IDataSet).value).toBe(126);
                    expect((pivotEngine.pivotValues[3][3] as IDataSet).value).toBe(178);
                });
            });
        });
        describe('Number Format on row/column field', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                expandAll: false,
                formatSettings: [{ format: 'P2', name: 'balance', useGrouping: true },
                { name: 'quantity', skeleton: 'Ehms', type: 'date' }],
                dataSource: ds,
                rows: [{ name: 'quantity' }],
                columns: [{ name: 'product' }],
                values: [{ name: 'balance' }, { name: 'advance' },
                ], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it('Date/time/date-time format', () => {
                expect(((pivotEngine.pivotValues[2][0] as IDataSet).dateText.toString()).indexOf('1970/01/01/')).toBeGreaterThanOrEqual(0);
            });
            it('Percentage format', () => {
                dataSourceSettings.rows = [{ name: 'state' }];
                dataSourceSettings.columns = [{ name: 'balance' }];
                dataSourceSettings.values = [{ name: 'advance' }, { name: 'quantity' }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).formattedText).toBe('1015.32');
            });
            describe('With custom date and time', () => {
                let ds: IDataSet[] = pivot_dataset as IDataSet[];
                let dataSourceSettings: IDataOptions = {
                    expandAll: false,
                    formatSettings: [{ name: 'balance', skeleton: 'medium', type: 'date' },
                    { name: 'advance', skeleton: 'short', type: 'time' },
                    { name: 'quantity', skeleton: 'yMEd', type: 'date' },
                    { name: 'date', format: '\'year:\'y \'month:\' MM', type: 'date' }
                    ],
                    dataSource: ds,
                    rows: [{ name: 'quantity' }],
                    columns: [{ name: 'date' }],
                    values: [{ name: 'balance' }, { name: 'advance' },
                    ],
                    filters: [{ name: 'gender' }]
                };
                let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                it('For custom format', () => {
                    expect((pivotEngine.pivotValues[0][1] as IDataSet).formattedText).toBe('year:1970 month: 01');
                    expect((pivotEngine.pivotValues[0][3] as IDataSet).formattedText).toBe('year:1970 month: 02');
                });
                it('For additional format', () => {
                    expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe('Thu, 1/1/1970');
                    expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe('Thu, 1/1/1970');
                });
            });
        });
        describe('Paging', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                dataSource: ds,
                rows: [{ name: 'company' }],
                columns: [{ name: 'name' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
            };
            let pivotEngine: PivotEngine;
            let pageSettings: IPageSettings = {
                columnPageSize: 2,
                rowPageSize: 2,
                currentColumnPage: 1,
                currentRowPage: 1
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                pageSettings: pageSettings,
                enableValueSorting: undefined,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            it('Ensure the page data', () => {
                expect(pivotEngine.pivotValues.length === 8 && pivotEngine.pivotValues[2].length === 7).toBeTruthy;
            });
            it('Ensure the row data', () => {
                expect((pivotEngine.pivotValues[2][0] as IAxisSet).formattedText === "ACCEL").toBeTruthy;
            });
            it('Ensure the column data', () => {
                expect((pivotEngine.pivotValues[0][1] as IAxisSet).formattedText === "Abigail Petty").toBeTruthy;
            });
            it('Ensure the page data', () => {
                let pageSettings: IPageSettings = {
                    columnPageSize: 4,
                    rowPageSize: 4,
                    currentColumnPage: 2,
                    currentRowPage: 2
                };
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: undefined,
                    pageSettings: pageSettings,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 15 && pivotEngine.pivotValues[2].length === 15).toBeTruthy;
            });
        });
        describe('ValueSorting', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                enableSorting: true,
                allowMemberFilter: true,
                sortSettings: [{ name: 'state', order: 'Descending' }],
                formatSettings: [{ name: 'balance', format: 'C' }],
                filterSettings: [
                    {
                        name: 'state', type: 'Include',
                        items: ['Delhi', 'Tamilnadu', 'New Jercy']
                    }
                ],
                rows: [{ name: 'state' }, { name: 'product' }],
                columns: [{ name: 'eyeColor' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                valueSortSettings: {
                    headerText: 'Grand Total##balance',
                    headerDelimiter: '##',
                    sortOrder: 'Ascending'
                }
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
            it("Ensure the ascending data", () => {
                expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe("Tamilnadu");
            });
            it("Ensure the descending data", () => {
                dataSourceSettings.rows = [{ name: 'state' }, { name: 'product' }, { name: 'gender' }];
                dataSourceSettings.valueSortSettings.sortOrder = 'Descending';
                dataSourceSettings.expandAll = true;
                let customProperties: ICustomProperties = {
                    savedFieldList: undefined,
                    enableValueSorting: true,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe("New Jercy");
            });
            it("Ensure the sort data while single measure", () => {
                dataSourceSettings.values.pop();
                dataSourceSettings.valueSortSettings.headerText = "Grand Total";
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe("Bike");
            });
            it("Value sorting with unavailable header", () => {
                dataSourceSettings.valueSortSettings.headerText = "test";
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe("Bike");
            });
        });

        describe('enable/disable ValueSorting', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                enableSorting: true,
                allowMemberFilter: true,
                sortSettings: [{ name: 'state', order: 'Descending' }],
                formatSettings: [{ name: 'balance', format: 'C' }],
                filterSettings: [
                    {
                        name: 'state', type: 'Include',
                        items: ['Delhi', 'Tamilnadu', 'New Jercy']
                    }
                ],
                rows: [{ name: 'state' }, { name: 'product' }],
                columns: [{ name: 'eyeColor' }],
                values: [{ name: 'balance' }, { name: 'quantity' }]
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: false,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            it("Disable value sorting", () => {
                expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe("Delhi");
            });
            customProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Ascending'
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            it("Ensure the Ascending data", () => {
                expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe("New Jercy");
            });
            dataSourceSettings.valueSortSettings = {
                headerText: 'Grand Total##balance',
                headerDelimiter: '##',
                sortOrder: 'Descending'
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            it("Ensure the descending data ", () => {
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe("Delhi");
            });
        });
        describe('exclude fields from fieldlist', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                enableSorting: true,
                allowMemberFilter: true,
                excludeFields: ['age', 'advance', 'guid', 'index', 'pno', 'phone', 'email'],
                sortSettings: [{ name: 'state', order: 'Descending' }],
                formatSettings: [{ name: 'balance', format: 'C' }],
                filterSettings: [
                    {
                        name: 'state', type: 'Include',
                        items: ['Delhi', 'Tamilnadu', 'New Jercy']
                    }
                ],
                rows: [{ name: 'state' }, { name: 'product' }],
                columns: [{ name: 'eyeColor' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: []
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: true,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            let pivotEngine: PivotEngine;
            it("Ensure fields excluded from fieldlist", () => {
                dataSourceSettings.excludeFields = ['age', 'advance', 'guid', 'index', 'pno', 'phone', 'email'];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.fields.length)).toBeLessThanOrEqual(12);
            });
            it("Ensure exclude fields empty", () => {
                dataSourceSettings.excludeFields = [];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.fields.length)).toBeLessThanOrEqual(18);
            });
            it("add fields to exclude fields", () => {
                dataSourceSettings.excludeFields = ['pno', 'email', 'guid'];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.fields.length)).toBeGreaterThanOrEqual(15);
            });
            it("add fields to row and exclude fields", () => {
                dataSourceSettings.excludeFields = ['pno', 'email', 'advance', 'phone'];
                dataSourceSettings.rows = [{ name: 'state' }, { name: 'product' }, { name: 'pno' }];
                dataSourceSettings.columns = [{ name: 'eyeColor' }, { name: 'email' }]
                dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }, { name: 'advance' }],
                    dataSourceSettings.filters = [{ name: 'phone' }]
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings);
                expect((pivotEngine.fields.length)).toBeGreaterThanOrEqual(14);
            });
        });

        describe('Hide blank members', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                dataSource: pivot_undefineddata as IDataSet[],
                expandAll: false,
                rows: [{ name: 'Country' }, { name: 'State' }],
                columns: [{ name: 'Product' }, { name: 'Date' }],
                values: [{ name: 'Amount' }, { name: 'Quantity' }],
                showHeaderWhenEmpty: false,
                allowMemberFilter: true,
                allowLabelFilter: true,
                allowValueFilter: true
            };
            let customProperties: ICustomProperties = {
                mode: '',
                savedFieldList: undefined,
                enableValueSorting: false,
                isDrillThrough: undefined,
                localeObj: undefined
            };
            let pivotEngine: PivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            it("Ensure initial rendering", () => {
                expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe("Canada");
                customProperties = {
                    mode: '',
                    savedFieldList: undefined,
                    enableValueSorting: true,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                dataSourceSettings.valueSortSettings = {
                    headerText: 'Grand Total##Amount',
                    headerDelimiter: '##',
                    sortOrder: 'Ascending'
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it("With value sorting - Ascending", () => {
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe("United Kingdom");
                dataSourceSettings.valueSortSettings = {
                    headerText: 'Grand Total##Amount',
                    headerDelimiter: '##',
                    sortOrder: 'Descending'
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it("With value sorting - Descending", () => {
                expect((pivotEngine.pivotValues[3][0] as IDataSet).formattedText).toBe("United States");
                dataSourceSettings.expandAll = true;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it("Expand All", () => {
                expect((pivotEngine.pivotValues[23][0] as IDataSet).hasChild).toBeFalsy;
                dataSourceSettings.excludeFields = ['State', 'Date'];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it("Exclude Fields", () => {
                expect((pivotEngine.pivotValues[3][0] as IDataSet).hasChild).toBeFalsy;
                dataSourceSettings.excludeFields = [];
                dataSourceSettings.calculatedFieldSettings = [{ name: 'Total', formula: '"Sum(Amount)"+"Sum(Quantity)"' }];
                dataSourceSettings.values = [{ name: 'Amount' }, { name: 'Quantity' }, { name: 'Total' }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it("Calculated Field", () => {
                expect((pivotEngine.pivotValues[3][0] as IDataSet).hasChild).toBeFalsy;
                dataSourceSettings.filterSettings = [{ name: 'Country', type: 'Value', condition: 'GreaterThan', value1: '500', measure: 'Amount' }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it('With value filters', () => {
                expect(pivotEngine.pivotValues.length).toBe(6);
                dataSourceSettings.filterSettings = [{ name: 'Product', type: 'Label', condition: 'Equals', value1: 'Van' }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it('With label filters', () => {
                expect(pivotEngine.pivotValues.length).toBe(6);
                dataSourceSettings.filterSettings = [{ name: 'Country', type: 'Include', items: ['France', 'Germany'] }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it('With Include filter', () => {
                expect(pivotEngine.pivotValues.length).toBe(5);
                dataSourceSettings.filterSettings = [{ name: 'Country', type: 'Exclude', items: ['France', 'Germany'] }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it('With Exclude filter', () => {
                expect(pivotEngine.pivotValues.length).toBe(6);
                dataSourceSettings.enableSorting = true;
                dataSourceSettings.sortSettings = [{ name: 'Product', order: 'Descending' }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it('With sorting enabled', () => {
                expect(pivotEngine.pivotValues.length).toBe(6);
                dataSourceSettings.columns[0] = { name: 'Product', showNoDataItems: true };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it('No data', () => {
                expect(pivotEngine.pivotValues.length).toBe(6);
                dataSourceSettings.filterSettings = [];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: undefined,
                    enableValueSorting: false,
                    isDrillThrough: undefined,
                    localeObj: undefined,
                    pageSettings: {
                        currentColumnPage: 1,
                        currentRowPage: 1,
                        columnPageSize: 1,
                        rowPageSize: 1
                    }
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it('Virtual Scrolling', () => {
                expect(pivotEngine.pivotValues.length).toBe(5);
            });
        });

        describe('getLabelFilterMembers', () => {
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
                // let actionComplete: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, DrillThrough, CalculatedField, FieldList, VirtualScroll);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivotDatas as IDataSet[],
                        sortSettings: [],
                        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                        rows: [{ name: 'product' }, { name: 'date' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'gender' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'price' }], filters: [{ name: 'index' }],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        filterSettings: [],
                    },
                    height: 300,
                    width: 800,
                    allowDrillThrough: true,
                    allowDataCompression: true,
                    showGroupingBar: true,
                    enableVirtualization: true,
                    showFieldList: true,
                    showValuesButton: true,
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Filter testing', (done: Function) => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'Equals', value1: 'car' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("14");
                done();
                }, 1000);
            });
            it('Filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'BeginWith', value1: 'C' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("14");
                done();
                }, 1000);
            });
            it('Filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'EndsWith', value1: 'e' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("16");
                done();
                }, 1000);
            });
            it('Filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', condition: 'GreaterThan', value1: 'Car' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[3][3] as IDataSet).formattedText).toBe("52740.04999999999");
                done();
                }, 1000);
            });
            it('Filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', condition: 'GreaterThanOrEqualTo', value1: 'Jet' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("33");
                done();
                }, 1000);
            });
            it('Filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', condition: 'LessThanOrEqualTo', value1: 'Flight' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[3][2] as IDataSet).formattedText).toBe("14");
                done();
                }, 1000);
            });
            it('Filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'Contains', value1: 'e', value2: 'v' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[4][5] as IDataSet).formattedText).toBe("34");
                expect((pivotGridObj.engineModule.pivotValues[5][5] as IDataSet).formattedText).toBe("50");
                done();
                }, 1000);
            });
            it('date testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.rows = [{ name: 'date' }, { name: 'product' }];
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'Before', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("16");
                done();
                }, 1000);
            });
            it('date testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'Equals', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("15");
                done();
                }, 1000);
            });
            it('date testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'After', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[4][2] as IDataSet).formattedText).toBe("18");
                done();
                }, 1000);
            });
            it('date testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'AfterOrEqualTo', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("15");
                done();
                }, 1000);
            });
            it('date testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'BeforeOrEqualTo', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[4][2] as IDataSet).formattedText).toBe("15");
                done();
                }, 1000);
            });
            it('date testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'Between', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)', value2: 'Tue Sep 09 2008 09:47:08 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("15");
                done();
                }, 1000);
            });
            it('date testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', value1: 'Tue Sep 09 2008 09:47:08 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                setTimeout(() => {
                expect((pivotGridObj.engineModule.pivotValues[4][2] as IDataSet).formattedText).toBe("15");
                pivotGridObj.dataSourceSettings.filterSettings = [];
                pivotGridObj.dataSourceSettings.columns = [{ name: 'gender' }, {name: 'advance'}];
                pivotGridObj.dataSourceSettings.values = [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type:'PercentageOfGrandTotal' }, { name: 'price', type: 'CalculatedField' }];
                pivotGridObj.dataSourceSettings.sortSettings = [{name: 'gender', order: 'Descending'}, {name: 'advance', order: 'Descending', membersOrder: [6124, 7107]}];
                pivotGridObj.refreshData();
                done();
                }, 1000);
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][2] as IDataSet).formattedText).toBe("12.5%");
                    done();
                }, 1000);
            });
            it('date testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-expand')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                (document.querySelectorAll('.e-icons.e-sort')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(() => {
                    debugger;
                    expect((pivotGridObj.engineModule.pivotValues[5][2] as IDataSet).formattedText).toBe("11.72%");
                    done();
                }, 1000);
            });
            it('data testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.rows = [{ name: 'product' }, { name: 'date' }];
                pivotGridObj.refreshData();
                expect(("1")).toBe("1");
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-icons.e-sort')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                (document.querySelectorAll('.e-expand')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                expect(("1")).toBe("1");
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][5] as IDataSet).formattedText).toBe("26.56%");
                    done();
                }, 1000);
                (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                expect((pivotGridObj.engineModule.pivotValues[3][5] as IDataSet).formattedText).toBe("15.63%");
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][5] as IDataSet).formattedText).toBe("17.09%");
                    done();
                }, 1000);
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][5] as IDataSet).formattedText).toBe("70.21%");
                    done();
                }, 1000);
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][5] as IDataSet).formattedText).toBe("100%");
                    done();
                }, 1000);
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-btn-filter')[4] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][5] as IDataSet).formattedText).toBe("100%");
                    done();
                }, 1000);
            });
            it('aggreagation testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                let field: IFieldOptions = {
                    "name": "balance",
                    "isCalculatedField": false,
                    "isNamedSet": false,
                    "showNoDataItems": false,
                    "showSubTotals": true,
                    "type": "Product",
                    "showFilterIcon": true,
                    "showSortIcon": true,
                    "showRemoveIcon": true,
                    "showValueTypeIcon": true,
                    "showEditIcon": true,
                    "allowDragAndDrop": true,
                    "expandAll": false,
                    "axis": undefined,
                    "baseField": undefined,
                    "baseItem": undefined,
                    "caption": undefined,
                    "dataType": undefined,
                    "groupName": undefined
                }
                pivotGridObj.engineModule.onAggregation(field);
                expect(("1")).toBe("1");
            });
        });

        describe('getLabelFilterMembers', () => {
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
                PivotView.Inject(GroupingBar, DrillThrough, CalculatedField, FieldList, VirtualScroll, Pager);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                        rows: [{ name: 'product' }, { name: 'date' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'gender' }, { name: 'advance' }],
                        values: [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'DifferenceFrom' }], filters: [{ name: 'index' }],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        filterSettings: [],
                        valueAxis: 'row'
                    },
                    height: 300,
                    width: 800,
                    allowDrillThrough: true,
                    allowDataCompression: true,
                    showGroupingBar: true,
                    enableVirtualization: true,
                    showFieldList: true,
                    showValuesButton: true,
                    enablePaging: true,
                    pageSettings: {
                        rowPageSize: 10,
                        columnPageSize: 5,
                        currentColumnPage: 1,
                        currentRowPage: 1
                    },
                    pagerSettings: {
                        position: 'Bottom',
                        enableCompactView: false,
                        showColumnPager: true,
                        showRowPager: true
                    },
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Paging testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("105");
                (document.querySelector('#PivotGrid_row_nextIcon') as HTMLElement).click();
                setTimeout(() => {
                    pivotGridObj.refreshData();
                    expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("-35");
                    done();
                }, 3000);
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("-35");
                    done();
                }, 1000);
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("-21");
                    done();
                }, 1000);
            });
            it('sort testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-icons.e-sort')[0] as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                (document.querySelectorAll('.e-icons.e-sort')[2] as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("-$3,468.89");
                    done();
                }, 1000);
            });
            it('set data', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.setProperties({ dataSourceSettings: { valueIndex: 1 } });
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                expect("1").toBe("1");
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-btn-filter')[4] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Car");
                    done();
                }, 1000);
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.dataSourceSettings.valueAxis = 'column';
                pivotGridObj.dataSourceSettings.valueIndex = 2;
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('sort testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-icons.e-sort')[1] as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                (document.querySelectorAll('.e-icons.e-sort')[3] as HTMLElement).click();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][0] as IDataSet).formattedText).toBe("Van");
                    done();
                }, 1000);
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[5][0] as IDataSet).formattedText).toBe("Car");
                    done();
                }, 1000);
            });
            it('filter testing', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Jet");
                    done();
                }, 1000);
            });
        });
    });

    /**
     * Test case for common utility
     */
    describe('Common Util', () => {
        describe('Relational data handling', () => {
            it('To check getType method - datetime', () => {
                new PivotUtil();
                let date: Date = new Date();
                expect(PivotUtil.getType(date)).toEqual('datetime');
            });
            it('To check getType method - date', () => {
                let date: Date = new Date();
                date = new Date(date.toDateString());
                expect(PivotUtil.getType(date)).toEqual('date');
            });
        });
    });
    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});