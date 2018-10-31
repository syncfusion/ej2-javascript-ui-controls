import { PivotEngine, IDataOptions, IDataSet, IAxisSet, IPageSettings } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotUtil } from '../../src/base/util';
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
        describe('Check the Field List information', () => {
            let dataSource: IDataOptions = {
                data: pivotDataset, rows: [{ name: 'Product' }],
                columns: [{ name: 'Date' }], values: [{ name: 'Amount' }], filters: [{ name: 'State' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
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
            let dataSource: IDataOptions = {
                //filterSettings: [{ name: 'Date', type: 'exclude', items: ['FY 2006']}, {name: 'gender', type: 'include', items: ['Canada']}],
                drilledMembers: [{ name: 'state', items: ['New Jercy'] }],
                data: ds,
                rows: [{ name: 'company' }, { name: 'state' }],
                columns: [{ name: 'name' }],
                values: [{ name: 'balance' },
                { name: 'quantity' }], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it('Ensure the initial biding', () => {
                expect(pivotEngine.pivotValues.length).toBe(423);
                expect(pivotEngine.pivotValues[2].length).toBe(843);
            });
            it('Ensure the initial biding with empty row', () => {
                dataSource = {
                    data: ds
                };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(2);
                expect(pivotEngine.pivotValues[0].length).toBe(1);
            });
        });
        describe('Sort settings', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                sortSettings: [{ name: 'company', order: 'Descending' }],
                data: ds,
                rows: [{ name: 'company' }, { name: 'state' }],
                columns: [{ name: 'name' }],
                values: [{ name: 'balance' },
                { name: 'quantity' }], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it('company in decending order', () => {
                expect((pivotEngine.pivotValues[2][0] as IDataSet).actualText).toBe('ZYTREX');
            });
            it('Disable the default sorting', () => {
                dataSource.enableSorting = false;
                pivotEngine = new PivotEngine(dataSource);
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('ICOLOGY');
            });
        });
        describe('Filter settings', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                { name: 'company', type: 'Include', items: ['NIPAZ'] },
                { name: 'gender', type: 'Include', items: ['male'] }],
                data: ds,
                rows: [{ name: 'company' }, { name: 'state' }],
                columns: [{ name: 'name' }],
                values: [{ name: 'balance' },
                { name: 'quantity' }], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it('Only include filters', () => {
                expect(pivotEngine.pivotValues.length).toBe(4);
                expect(pivotEngine.pivotValues[0].length).toBe(5);
            });
            it('Exclude with include filter', () => {
                dataSource.filterSettings[0].type = 'Exclude';
                dataSource.filterSettings[1].type = 'Exclude';
                // dataSource.filterSettings.length = 1;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(218);
                expect(pivotEngine.pivotValues[0].length).toBe(433);
            });
            it('Only exclude filter', () => {
                dataSource.filterSettings[0].type = 'Exclude';
                dataSource.filterSettings[1].type = 'Exclude';
                dataSource.filterSettings.length = 1;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(422);
                expect(pivotEngine.pivotValues[0].length).toBe(841);
            });
            it('Clear filters items', () => {
                dataSource.filterSettings = [];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues).toBeTruthy;
            });
        });
        describe('Expand all', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                expandAll: false,
                data: ds,
                rows: [{ name: 'company' }, { name: 'state' }],
                columns: [{ name: 'name' }, { name: 'gender' }],
                values: [{ name: 'balance' },
                { name: 'quantity' }], filters: [{ name: 'gender' }]
            };
            let timeStamp1: number = new Date().getTime();
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            let timeStamp2: number = new Date().getTime();
            timeStamp1 = timeStamp2 - timeStamp1;
            it('Expand all members', () => {
                expect(pivotEngine.pivotValues.length === 1338 && pivotEngine.pivotValues[0].length === 3130).toBeTruthy;
            });

            it('Performance metrics', () => {
                let timeStamp1: number = new Date().getTime();
                let pivotEngine: PivotEngine = new PivotEngine(dataSource);
                let timeStamp2: number = new Date().getTime();
                timeStamp1 = timeStamp2 - timeStamp1;
                dataSource.expandAll = false;
                let ctimeStamp1: number = new Date().getTime();
                pivotEngine = new PivotEngine(dataSource);
                let ctimeStamp2: number = new Date().getTime();
                ctimeStamp1 = ctimeStamp2 - ctimeStamp1;
                expect(timeStamp1 < 1900 && ctimeStamp1 < 640).toBeTruthy;
            });
        });
        describe('Aggregation', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                expandAll: false,
                data: ds,
                rows: [{ name: 'state' }],
                columns: [{ name: 'product' }],
                values: [{ name: 'balance' },
                { name: 'quantity', type: 'Count' }], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it('Count', () => {
                expect((pivotEngine.pivotValues[2][2] as IDataSet).value).toBe(8);
                expect((pivotEngine.pivotValues[8][2] as IDataSet).value).toBe(69);
            });
            it('Minimum type', () => {
                dataSource.values[1].type = 'Min';
                pivotEngine = new PivotEngine(dataSource);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).value).toBe(11);
                expect((pivotEngine.pivotValues[8][2] as IDataSet).value).toBe(10);
            });
            it('Maximum Type', () => {
                dataSource.values[1].type = 'Max';
                pivotEngine = new PivotEngine(dataSource);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).value).toBe(20);
                expect((pivotEngine.pivotValues[8][2] as IDataSet).value).toBe(20);
            });
            it('Average Type', () => {
                dataSource.values[1].type = 'Avg';
                pivotEngine = new PivotEngine(dataSource);
                expect((pivotEngine.pivotValues[7][1] as IDataSet).value).toBe(34644.87);
                expect((pivotEngine.pivotValues[7][2] as IDataSet).value).toBe(14.785714285714286);
            });
            it('Summary Type', () => {
                dataSource.values[1].type = 'Sum';
                pivotEngine = new PivotEngine(dataSource);
                expect((pivotEngine.pivotValues[2][2] as IDataSet).value).toBe(126);
                expect((pivotEngine.pivotValues[8][2] as IDataSet).value).toBe(1060);
            });
        });
        describe('Number Format on value field', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                expandAll: false,
                formatSettings: [{ format: 'P2', name: 'balance', useGrouping: true },
                { name: 'quantity', skeleton: 'Ehms', type: 'date' }],
                data: ds,
                rows: [{ name: 'state' }],
                columns: [{ name: 'product' }],
                values: [{ name: 'balance' }, { name: 'advance' },
                { name: 'quantity' }], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
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
            describe('With decimal separation', () => {
                let ds: IDataSet[] = pivot_dataset as IDataSet[];
                let dataSource: IDataOptions = {
                    expandAll: false,
                    formatSettings: [{ format: 'N2', name: 'balance' },
                    { format: '$ ###.00', name: 'advance' }],
                    data: ds,
                    rows: [{ name: 'state' }],
                    columns: [{ name: 'product' }],
                    values: [{ name: 'balance' }, { name: 'advance' },
                    { name: 'quantity' }], filters: [{ name: 'gender' }]
                };
                let pivotEngine: PivotEngine = new PivotEngine(dataSource);
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
                let dataSource: IDataOptions = {
                    expandAll: false,
                    formatSettings: [{ name: 'balance', skeleton: 'medium', type: 'date' },
                    { name: 'advance', skeleton: 'short', type: 'time' },
                    { name: 'quantity', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                    data: ds,
                    rows: [{ name: 'state' }],
                    columns: [{ name: 'product' }],
                    values: [{ name: 'balance' }, { name: 'advance' },
                    { name: 'quantity' }],
                    filters: [{ name: 'gender' }]
                };
                let pivotEngine: PivotEngine = new PivotEngine(dataSource);
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
            let dataSource: IDataOptions = {
                expandAll: false,
                formatSettings: [{ format: 'P2', name: 'balance', useGrouping: true },
                { name: 'quantity', skeleton: 'Ehms', type: 'date' }],
                data: ds,
                rows: [{ name: 'quantity' }],
                columns: [{ name: 'product' }],
                values: [{ name: 'balance' }, { name: 'advance' },
                ], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it('Date/time/date-time format', () => {
                expect(((pivotEngine.pivotValues[2][0] as IDataSet).actualText.toString()).indexOf('1970/01/01/')).toBeGreaterThanOrEqual(0);
            });
            it('Percentage format', () => {
                dataSource.rows = [{ name: 'state' }];
                dataSource.columns = [{ name: 'balance' }];
                dataSource.values = [{ name: 'advance' }, { name: 'quantity' }];
                pivotEngine = new PivotEngine(dataSource);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).formattedText).toBe('101,532.00%');
            });
            describe('With custom date and time', () => {
                let ds: IDataSet[] = pivot_dataset as IDataSet[];
                let dataSource: IDataOptions = {
                    expandAll: false,
                    formatSettings: [{ name: 'balance', skeleton: 'medium', type: 'date' },
                    { name: 'advance', skeleton: 'short', type: 'time' },
                    { name: 'quantity', skeleton: 'yMEd', type: 'date' },
                    { name: 'date', format: '\'year:\'y \'month:\' MM', type: 'date' }
                    ],
                    data: ds,
                    rows: [{ name: 'quantity' }],
                    columns: [{ name: 'date' }],
                    values: [{ name: 'balance' }, { name: 'advance' },
                    ],
                    filters: [{ name: 'gender' }]
                };
                let pivotEngine: PivotEngine = new PivotEngine(dataSource);
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
        describe('Calculated field', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                expandAll: false,
                enableSorting: true,
                sortSettings: [{ name: 'company', order: 'Descending' }],
                filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                { name: 'company', type: 'Include', items: ['NIPAZ'] },
                { name: 'gender', type: 'Include', items: ['male'] }],
                data: ds,
                calculatedFieldSettings: [{ name: 'price', formula: '10+5' },
                { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
                rows: [{ name: 'company' }, { name: 'state' }],
                columns: [{ name: 'name' }],
                values: [{ name: 'balance' }, { name: 'price', type: 'CalculatedField' },
                { name: 'quantity' }], filters: [{ name: 'gender' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it('Calculated field with simple calculation', () => {
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('15');
            });
            it('Calculated field with complex calculation', () => {
                dataSource.calculatedFieldSettings[0].formula = '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"';
                pivotEngine = new PivotEngine(dataSource);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('price');
                expect((pivotEngine.pivotValues[2][2] as IDataSet).formattedText).toBe('11673.65');
            });
        });
        describe('Paging', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                data: ds,
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
            pivotEngine = new PivotEngine(dataSource, '', undefined, pageSettings);
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
                pivotEngine = new PivotEngine(dataSource, '', undefined, pageSettings);
                expect(pivotEngine.pivotValues.length === 15 && pivotEngine.pivotValues[2].length === 15).toBeTruthy;
            });
        });
        describe('ValueSorting', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                data: pivot_dataset as IDataSet[],
                expandAll: false,
                enableSorting: true,
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
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it("Ensure the ascending data", () => {
                expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe("Tamilnadu");
            });
            it("Ensure the descending data", () => {
                dataSource.rows = [{ name: 'state' }, { name: 'product' }, { name: 'gender' }];
                dataSource.valueSortSettings.sortOrder = 'Descending';
                dataSource.expandAll = true;
                pivotEngine = new PivotEngine(dataSource);
                expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe("New Jercy");
            });
            it("Ensure the sort data while single measure", () => {
                dataSource.values.pop();
                dataSource.valueSortSettings.headerText = "Grand Total";
                pivotEngine = new PivotEngine(dataSource);
                expect((pivotEngine.pivotValues[2][0] as IDataSet).formattedText).toBe("Bike");
            });
        });
        describe('Label Filtering', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                data: pivot_dataset as IDataSet[],
                allowLabelFilter: true,
                filterSettings: [{ name: 'company', type: 'Label', condition: 'Contains', value1: 'z' }],
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'company' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: [{ name: 'gender', caption: 'Population' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it('With single label filters', () => {
                expect(pivotEngine.pivotValues.length).toBe(10);
                expect(pivotEngine.pivotValues[0].length).toBe(89);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Bike');
            });
            it('With two label filters', () => {
                dataSource.filterSettings.push({ name: 'product', type: 'Label', condition: 'DoesNotContains', value1: 'i' });
                expect(dataSource.filterSettings.length === 2).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(8);
                expect(pivotEngine.pivotValues[0].length).toBe(67);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With Include filter', () => {
                dataSource.filterSettings.push({ name: 'eyeColor', type: 'Include', items: ['blue'] });
                expect(dataSource.filterSettings.length === 3).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(8);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('PULZE');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With Exclude filter', () => {
                dataSource.filterSettings[2].type = 'Exclude';
                expect(dataSource.filterSettings.length === 3).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(8);
                expect(pivotEngine.pivotValues[0].length).toBe(51);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With sorting enabled', () => {
                dataSource.enableSorting = true;
                dataSource.sortSettings = [{ name: 'product', order: 'Descending' }];
                expect(dataSource.sortSettings.length === 1).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(8);
                expect(pivotEngine.pivotValues[0].length).toBe(51);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
            });
            it('With valuesorting enabled', () => {
                dataSource.valueSortSettings = {
                    headerText: 'Grand Total##balance',
                    headerDelimiter: '##',
                    sortOrder: 'Descending'
                };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(8);
                expect(pivotEngine.pivotValues[0].length).toBe(51);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With ExpandAll enabled', () => {
                dataSource.expandAll = true;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(16);
                expect(pivotEngine.pivotValues[0].length).toBe(99);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With Drilled members', () => {
                dataSource.drilledMembers = [{ name: 'product', items: ['Bike', 'Van'] }, { name: 'company', items: ['BIZMATIC'] }];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(14);
                expect(pivotEngine.pivotValues[0].length).toBe(97);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With Format Settings', () => {
                dataSource.formatSettings = [{ name: 'balance', format: 'C' }];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(14);
                expect(pivotEngine.pivotValues[0].length).toBe(97);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With Calculated Settings', () => {
                dataSource.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
                dataSource.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(14);
                expect(pivotEngine.pivotValues[0].length).toBe(145);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With label filter condition(Equals and NotEquals)', () => {
                dataSource.filterSettings[0] = { name: 'company', type: 'Label', condition: 'Equals', value1: 'BIZMATIC' };
                dataSource.filterSettings[1] = { name: 'product', type: 'Label', condition: 'DoesNotEquals', value1: 'bike' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
            });
            it('With label filter condition(BeginWith and DoesNotBeginWith)', () => {
                dataSource.filterSettings[0] = { name: 'company', type: 'Label', condition: 'BeginWith', value1: 'BIZMATIC' };
                dataSource.filterSettings[1] = { name: 'product', type: 'Label', condition: 'DoesNotBeginWith', value1: 'bike' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
            });
            it('With label filter condition(EndsWith and DoesNotEndsWith)', () => {
                dataSource.filterSettings[0] = { name: 'company', type: 'Label', condition: 'EndsWith', value1: 'BIZMATIC' };
                dataSource.filterSettings[1] = { name: 'product', type: 'Label', condition: 'DoesNotEndsWith', value1: 'bike' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('BIZMATIC');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
            });
            it('With label filter condition(GreaterThan and GreaterThanOrEqualTo)', () => {
                dataSource.filterSettings[0] = { name: 'company', type: 'Label', condition: 'GreaterThan', value1: 'z' };
                dataSource.filterSettings[1] = { name: 'product', type: 'Label', condition: 'GreaterThanOrEqualTo', value1: 'bike' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(14);
                expect(pivotEngine.pivotValues[0].length).toBe(106);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ZAGGLE');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
            });
            it('With label filter condition(LessThan and LessThanOrEqualTo)', () => {
                dataSource.filterSettings[0] = { name: 'company', type: 'Label', condition: 'LessThan', value1: 'b' };
                dataSource.filterSettings[1] = { name: 'product', type: 'Label', condition: 'LessThanOrEqualTo', value1: 'bike' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(22);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('AQUACINE');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Bike');
            });
            it('With label filter condition(Between and NotBetween)', () => {
                dataSource.filterSettings[0] = { name: 'company', type: 'Label', condition: 'Between', value1: 'a', value2: 'c' };
                dataSource.filterSettings[1] = { name: 'product', type: 'Label', condition: 'NotBetween', value1: 'a', value2: 'c' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(17);
                expect(pivotEngine.pivotValues[0].length).toBe(169);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
            });
        });
        describe('Date Filtering', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                data: pivot_dataset as IDataSet[],
                allowLabelFilter: true,
                formatSettings: [{ name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
                filterSettings: [{ name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') }],
                rows: [{ name: 'date', caption: 'TimeLine' }],
                columns: [{ name: 'company' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: [{ name: 'gender', caption: 'Population' }]
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it('With date filters at code-behind', () => {
                expect(pivotEngine.pivotValues.length).toBe(29);
                expect(pivotEngine.pivotValues[0].length).toBe(53);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
                expect(((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).indexOf('2000/02/16/')).toBeGreaterThanOrEqual(0);
            });
            it('With label filters', () => {
                dataSource.filterSettings.push({ name: 'company', type: 'Label', condition: 'BeginWith', value1: 'a' });
                expect(dataSource.filterSettings.length === 2).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(5);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
                expect(((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
            });
            it('With Include filter', () => {
                dataSource.filterSettings.push({ name: 'isActive', type: 'Include', items: ['true'] });
                expect(dataSource.filterSettings.length === 3).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(4);
                expect(pivotEngine.pivotValues[0].length).toBe(3);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe(undefined);
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(undefined);
            });
            it('With Exclude filter', () => {
                dataSource.filterSettings[2].type = 'Exclude';
                expect(dataSource.filterSettings.length === 3).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(5);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
                expect(((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
            });
            it('With sorting enabled', () => {
                dataSource.filterSettings.pop();
                dataSource.enableSorting = true;
                dataSource.sortSettings = [{ name: 'date', order: 'Descending' }];
                expect(dataSource.filterSettings.length === 2).toBeTruthy;
                expect(dataSource.sortSettings.length === 1).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(5);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
                expect(((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
            });
            it('With valuesorting enabled', () => {
                dataSource.valueSortSettings = {
                    headerText: 'Grand Total##balance',
                    headerDelimiter: '##',
                    sortOrder: 'Descending'
                };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(5);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
                expect(((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
            });
            it('With ExpandAll enabled', () => {
                dataSource.expandAll = true;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
                expect(((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
            });
            it('With Drilled members', () => {
                dataSource.drilledMembers = [{ name: 'company', items: ['ACRUEX'] }];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(5);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
                expect(((pivotEngine.pivotValues[3][0] as IDataSet).actualText.toString()).indexOf('2001/08/31/')).toBeGreaterThanOrEqual(0);
            });
            it('With Format Settings', () => {
                dataSource.formatSettings = [{ name: 'balance', format: 'C' }];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(5);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Aug 31 2001 20:48:59 GMT+0530 (India Standard Time)');
            });
            it('With Calculated Settings', () => {
                dataSource.calculatedFieldSettings = [{ name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }];
                dataSource.values = [{ name: 'balance' }, { name: 'total' }, { name: 'quantity' }];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Aug 31 2001 20:48:59 GMT+0530 (India Standard Time)');
            });
            it('With date filter condition(Equals)', () => {
                dataSource.filterSettings[0] = { name: 'date', type: 'Date', condition: 'Equals', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(4);
                expect(pivotEngine.pivotValues[0].length).toBe(4);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe(undefined);
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(undefined);
            });
            it('With date filter condition(NotEquals)', () => {
                dataSource.filterSettings[0] = { name: 'date', type: 'Date', condition: 'DoesNotEquals', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(30);
                expect(pivotEngine.pivotValues[0].length).toBe(157);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
            });
            it('With date filter condition(Before)', () => {
                dataSource.filterSettings[0] = { name: 'date', type: 'Date', condition: 'Before', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(23);
                expect(pivotEngine.pivotValues[0].length).toBe(118);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
            });
            it('With date filter condition(BeforeOrEqualTo)', () => {
                dataSource.filterSettings[0] = { name: 'date', type: 'Date', condition: 'BeforeOrEqualTo', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(23);
                expect(pivotEngine.pivotValues[0].length).toBe(118);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
            });
            it('With date filter condition(After)', () => {
                dataSource.filterSettings[0] = { name: 'date', type: 'Date', condition: 'After', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(11);
                expect(pivotEngine.pivotValues[0].length).toBe(43);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCUFARM');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jan 01 2016 13:46:21 GMT+0530 (India Standard Time)');
            });
            it('With date filter condition(AfterOrEqualTo)', () => {
                dataSource.filterSettings[0] = { name: 'date', type: 'Date', condition: 'AfterOrEqualTo', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(11);
                expect(pivotEngine.pivotValues[0].length).toBe(43);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCUFARM');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jan 01 2016 13:46:21 GMT+0530 (India Standard Time)');
            });
            it('With date filter condition(Between)', () => {
                dataSource.filterSettings[0] = { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACRUEX');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Aug 31 2001 20:48:59 GMT+0530 (India Standard Time)');
            });
            it('With date filter condition(NotBetween)', () => {
                dataSource.filterSettings[0] = { name: 'date', type: 'Date', condition: 'NotBetween', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(29);
                expect(pivotEngine.pivotValues[0].length).toBe(154);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('ACCEL');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Fri Jul 17 1998 03:22:30 GMT+0530 (India Standard Time)');
            });
        });
        describe('Number Filtering', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                data: pivot_dataset as IDataSet[],
                allowLabelFilter: true,
                filterSettings: [{ name: 'age', type: 'Number', condition: 'Equals', value1: '25', value2: '35' }],
                rows: [{ name: 'age', caption: 'Age' }],
                columns: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: [],
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it('With number filters at code-behind', () => {
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(13);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
            });
            it('With label filters', () => {
                dataSource.filterSettings.push({ name: 'product', type: 'Label', condition: 'Contains', value1: 'e' });
                expect(dataSource.filterSettings.length === 2).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(9);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
            });
            it('With Include filter', () => {
                dataSource.filterSettings.push({ name: 'eyeColor', type: 'Include', items: ['blue', 'brown'] });
                expect(dataSource.filterSettings.length === 3).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(9);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
            });
            it('With Exclude filter', () => {
                dataSource.filterSettings.pop();
                dataSource.filterSettings.push({ name: 'eyeColor', type: 'Exclude', items: ['green'] })
                expect(dataSource.filterSettings.length === 3).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(9);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Bike');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
            });
            it('With sorting enabled', () => {
                dataSource.enableSorting = true;
                dataSource.sortSettings = [{ name: 'product', order: 'Descending' }];
                expect(dataSource.sortSettings.length === 1).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(9);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
            });
            it('With valuesorting enabled', () => {
                dataSource.valueSortSettings = {
                    headerText: 'Grand Total##balance',
                    headerDelimiter: '##',
                    sortOrder: 'Descending'
                };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(9);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
            });
            it('With ExpandAll enabled', () => {
                dataSource.expandAll = true;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(19);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
            });
            it('With Drilled members', () => {
                dataSource.drilledMembers = [{ name: 'product', items: ['Bike', 'Car'] }];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(17);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
            });
            it('With Format Settings', () => {
                dataSource.formatSettings = [{ name: 'balance', format: 'C' }];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(17);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
            });
            it('With number filter condition(Equals)', () => {
                dataSource.filterSettings[0] = { name: 'age', type: 'Number', condition: 'Equals', value1: '25', value2: '35' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(17);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(25);
            });
            it('With number filter condition(NotEquals)', () => {
                dataSource.filterSettings[0] = { name: 'age', type: 'Number', condition: 'DoesNotEquals', value1: '25', value2: '35' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(24);
                expect(pivotEngine.pivotValues[0].length).toBe(17);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
            });
            it('With number filter condition(GreaterThan)', () => {
                dataSource.filterSettings[0] = { name: 'age', type: 'Number', condition: 'GreaterThan', value1: '25', value2: '35' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(19);
                expect(pivotEngine.pivotValues[0].length).toBe(17);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
            });
            it('With number filter condition(GreaterThanOrEqualTo)', () => {
                dataSource.filterSettings[0] = { name: 'age', type: 'Number', condition: 'GreaterThanOrEqualTo', value1: '25', value2: '35' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(20);
                expect(pivotEngine.pivotValues[0].length).toBe(17);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
            });
            it('With number filter condition(LessThan)', () => {
                dataSource.filterSettings[0] = { name: 'age', type: 'Number', condition: 'LessThan', value1: '25', value2: '35' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(9);
                expect(pivotEngine.pivotValues[0].length).toBe(17);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(21);
            });
            it('With number filter condition(LessThanOrEqualTo)', () => {
                dataSource.filterSettings[0] = { name: 'age', type: 'Number', condition: 'LessThanOrEqualTo', value1: '25', value2: '35' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(10);
                expect(pivotEngine.pivotValues[0].length).toBe(17);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(21);
            });
            it('With number filter condition(Between)', () => {
                dataSource.filterSettings[0] = { name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(15);
                expect(pivotEngine.pivotValues[0].length).toBe(17);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(27);
            });
            it('With number filter condition(NotBetween)', () => {
                dataSource.filterSettings[0] = { name: 'age', type: 'Number', condition: 'NotBetween', value1: '25', value2: '35' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(14);
                expect(pivotEngine.pivotValues[0].length).toBe(17);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('Tempo');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe(40);
            });
        });
        describe('Value Filtering', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSource: IDataOptions = {
                data: pivot_dataset as IDataSet[],
                allowLabelFilter: true,
                allowValueFilter: true,
                filterSettings: [{ name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '400', measure: 'quantity' }],
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: [],
            };
            let pivotEngine: PivotEngine = new PivotEngine(dataSource);
            it('With single value filters', () => {
                expect(pivotEngine.pivotValues.length).toBe(9);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Bike');
            });
            it('With two value filters', () => {
                dataSource.filterSettings.push({ name: 'product', type: 'Value', condition: 'GreaterThan', value1: '500', measure: 'quantity' });
                expect(dataSource.filterSettings.length === 2).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With label filters', () => {
                dataSource.filterSettings[1] = { name: 'product', type: 'Label', condition: 'Equals', value1: 'Van' };
                expect(dataSource.filterSettings.length === 2).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
            });
            it('With Include filter', () => {
                dataSource.filterSettings.pop();
                dataSource.filterSettings[0].type = 'Value';
                dataSource.filterSettings[0].condition = 'GreaterThanOrEqualTo';
                dataSource.filterSettings[0].value1 = '500';
                dataSource.filterSettings.push({ name: 'eyeColor', type: 'Include', items: ['blue', 'green'] });
                expect(dataSource.filterSettings.length === 2).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(4);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
            });
            it('With Exclude filter', () => {
                dataSource.filterSettings.pop();
                dataSource.filterSettings.push({ name: 'eyeColor', type: 'Exclude', items: ['blue'] })
                expect(dataSource.filterSettings.length === 2).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With sorting enabled', () => {
                dataSource.enableSorting = true;
                dataSource.sortSettings = [{ name: 'product', order: 'Descending' }];
                expect(dataSource.sortSettings.length === 1).toBeTruthy;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With valuesorting enabled', () => {
                dataSource.valueSortSettings = {
                    headerText: 'Grand Total##balance',
                    headerDelimiter: '##',
                    sortOrder: 'Descending'
                };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(7);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With ExpandAll enabled', () => {
                dataSource.expandAll = true;
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(6);
                expect(pivotEngine.pivotValues[0].length).toBe(15);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With Drilled members', () => {
                dataSource.drilledMembers = [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(11);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With Format Settings', () => {
                dataSource.formatSettings = [{ name: 'balance', format: 'C' }];
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(11);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With value filter condition(Equals and NotEquals)', () => {
                dataSource.filterSettings[0] = { name: 'isActive', type: 'Value', condition: 'Equals', value1: '1339', measure: 'quantity' };
                dataSource.filterSettings[1] = { name: 'eyeColor', type: 'Value', condition: 'DoesNotEquals', value1: '194', measure: 'quantity' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(22);
                expect(pivotEngine.pivotValues[0].length).toBe(3);
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Van');
            });
            it('With value filter condition(GreaterThan and GreaterThanOrEqualTo)', () => {
                dataSource.filterSettings[0] = { name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '400', measure: 'quantity' };
                dataSource.filterSettings[1] = { name: 'product', type: 'Value', condition: 'GreaterThanOrEqualTo', value1: '500', measure: 'quantity' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(5);
                expect(pivotEngine.pivotValues[0].length).toBe(11);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Car');
            });
            it('With value filter condition(LessThan and LessThanOrEqualTo)', () => {
                dataSource.filterSettings[0] = { name: 'eyeColor', type: 'Value', condition: 'LessThan', value1: '400', measure: 'quantity' };
                dataSource.filterSettings[1] = { name: 'product', type: 'Value', condition: 'LessThanOrEqualTo', value1: '500', measure: 'quantity' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(7);
                expect(pivotEngine.pivotValues[0].length).toBe(11);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
                expect((pivotEngine.pivotValues[3][0] as IDataSet).actualText).toBe('Tempo');
            });
            it('With value filter condition(Between and NotBetween)', () => {
                dataSource.filterSettings[0] = { name: 'eyeColor', type: 'Value', condition: 'Between', value1: '400', value2: '550', measure: 'quantity' };
                dataSource.filterSettings[1] = { name: 'product', type: 'Value', condition: 'NotBetween', value1: '400', value2: '660', measure: 'quantity' };
                pivotEngine = new PivotEngine(dataSource);
                expect(pivotEngine.pivotValues.length).toBe(4);
                expect(pivotEngine.pivotValues[0].length).toBe(11);
                expect((pivotEngine.pivotValues[0][1] as IDataSet).actualText).toBe('female');
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
});