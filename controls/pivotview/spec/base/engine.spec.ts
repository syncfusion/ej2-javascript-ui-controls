import { PivotEngine, IDataOptions, IDataSet, IAxisSet, IPageSettings, ICustomProperties } from '../../src/base/engine';
import { pivot_dataset, pivot_undefineddata } from '../base/datasource.spec';
import { PivotUtil } from '../../src/base/util';
import { profile, inMB, getMemoryProfile } from '../common.spec';

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
                columnSize: 2,
                rowSize: 2,
                columnCurrentPage: 1,
                rowCurrentPage: 1
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
                    columnSize: 4,
                    rowSize: 4,
                    columnCurrentPage: 2,
                    rowCurrentPage: 2
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
                        columnCurrentPage: 1,
                        rowCurrentPage: 1,
                        columnSize: 1,
                        rowSize: 1
                    }
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            });
            it('Virtual Scrolling', () => {
                expect(pivotEngine.pivotValues.length).toBe(5);
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