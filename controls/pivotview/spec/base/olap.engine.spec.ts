import { OlapEngine, IOlapCustomProperties as ICustomProperties } from '../../src/base/olap/engine';
import { IDataOptions, IPivotValues, IAxisSet } from '../../src/base/engine';
import { PivotUtil } from '../../src/base/util';
import { MDXQuery } from '../../src/base/olap/mdx-query';
import { createElement } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('PivotView spec', () => {
    /**
     * Test case for OlapEngine
     */
    // let url: string = 'https://bi.syncfusion.com/olap/msmdpump.dll';
    // let catalog: string = 'Adventure Works DW 2008 SE';
    let url: string = 'https://olap.flexmonster.com/olap/msmdpump.dll';
    let catalog: string = 'Adventure Works DW Standard Edition';
    describe('PivotEngine population', () => {
        beforeAll(() => {
            const isDef = (o: any) => o !== undefined && o !== null;
            if (!isDef(window.performance)) {
                console.log("Unsupported environment, window.performance.memory is unavailable");
                this.skip(); //Skips test (in Chai)
                return;
            }
        });
        /**
         * Test case for Initial Rendering
         */
        describe('Initial data binding', () => {
            let originalTimeout: number;
            let olapEngine: OlapEngine;
            let dataSourceSettings: IDataOptions;
            let elem: HTMLElement = createElement('div', { id: 'PivotView', styles: 'height:200px; width:500px' });
            document.body.appendChild(elem);
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 13000;
                dataSourceSettings = {
                    catalog: catalog,
                    cube: 'Adventure Works',
                    dataProviderType: 'microsoft analysis services',
                    url: url,
                    localeIdentifier: 1033,
                    rows: [
                        { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                    ],
                    columns: [
                        { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                        { name: '[Measures]', caption: 'Measures' }
                    ],
                    values: [
                        { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                    ],
                    filters: [],
                    valueAxis: 'column'
                };
                olapEngine = new OlapEngine();
                olapEngine.renderEngine(dataSourceSettings);
                done();
            });
            it('Ensure the initial binding', () => {
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(7);
                expect(result[0].length).toBe(8);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('FY 2003');
            });
            it('Ensure the initial binding with multiple dimensions in rows', () => {
                dataSourceSettings.rows = [{ name: '[Date].[Fiscal]', caption: 'Date Fiscal' },
                { name: '[Employee].[Employee Department]', caption: 'Employee Department' }
                ];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(71);
                expect(result[0].length).toBe(8);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Document Control');
            });
            it('Ensure the initial binding with multiple measures in column', () => {
                dataSourceSettings.values = [{ name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' }
                ];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(71);
                expect(result[0].length).toBe(15);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Document Control');
            });
            it('Ensure the initial binding with multiple measures in row', () => {
                dataSourceSettings.columns.pop();
                dataSourceSettings.rows.push({ name: '[Measures]', caption: 'Measures' });
                dataSourceSettings.valueAxis = 'row';
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(208);
                expect(result[0].length).toBe(8);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Internet Sales Amount');
            });
            it('Ensure the initial binding with dimension in slicer axis', () => {
                dataSourceSettings.filters = [{ name: '[Geography].[Geography]', caption: 'Geography' }];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] WHERE ({({[Geography].[Geography]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(208);
                expect(result[0].length).toBe(8);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Internet Sales Amount');
            });
            it('Ensure the initial binding with empty row', () => {
                dataSourceSettings.rows = [];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY ({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] WHERE ({({[Geography].[Geography]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(3);
                expect(result[0].length).toBe(8);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[2][0] as IAxisSet).formattedText).toBe('Internet Sales Amount');
            });
        });

        /**
         * Test case for Filter Settings
         */
        describe('Engine spec with Filter settings', () => {
            let originalTimeout: number;
            let olapEngine: OlapEngine;
            let dataSourceSettings: IDataOptions;
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 13000;
                dataSourceSettings = {
                    catalog: catalog,
                    cube: 'Adventure Works',
                    dataProviderType: 'microsoft analysis services',
                    url: url,
                    localeIdentifier: 1033,
                    filterSettings: [
                        {
                            type: 'Include',
                            name: '[Customer].[Customer Geography]',
                            items: ['[Customer].[Customer Geography].[Country].&[Germany]',
                                '[Customer].[Customer Geography].[Country].&[France]',
                                '[Customer].[Customer Geography].[Country].&[United Kingdom]',
                                '[Customer].[Customer Geography].[Country].&[United States]']
                        }
                    ],
                    rows: [
                        { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                    ],
                    columns: [
                        { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                        { name: '[Measures]', caption: 'Measures' }
                    ],
                    values: [
                        { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                    ],
                    filters: [],
                    valueAxis: 'column',
                };
                olapEngine = new OlapEngine();
                olapEngine.renderEngine(dataSourceSettings);
                done();
            });
            it('Ensure the initial binding', () => {
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(7);
                expect(result[0].length).toBe(6);
                expect((result[0][1] as IAxisSet).formattedText).toBe('France');
                expect((result[3][0] as IAxisSet).formattedText).toBe('FY 2003');
            });
            it('Ensure the initial binding with multiple dimensions in rows', () => {
                dataSourceSettings.rows = [{ name: '[Date].[Fiscal]', caption: 'Date Fiscal' },
                { name: '[Employee].[Employee Department]', caption: 'Employee Department' }
                ];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(71);
                expect(result[0].length).toBe(6);
                expect((result[0][1] as IAxisSet).formattedText).toBe('France');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Document Control');
            });
            it('Ensure the initial binding with multiple measures in column', () => {
                dataSourceSettings.values = [{ name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' }
                ];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(71);
                expect(result[0].length).toBe(11);
                expect((result[0][1] as IAxisSet).formattedText).toBe('France');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Document Control');
            });
            it('Ensure the initial binding with multiple measures in row', () => {
                dataSourceSettings.columns.pop();
                dataSourceSettings.rows.push({ name: '[Measures]', caption: 'Measures' });
                dataSourceSettings.valueAxis = 'row';
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(208);
                expect(result[0].length).toBe(6);
                expect((result[0][1] as IAxisSet).formattedText).toBe('France');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Internet Sales Amount');
            });
            it('Ensure the initial binding with dimension in slicer axis', () => {
                dataSourceSettings.filters = [{ name: '[Geography].[Geography]', caption: 'Geography' }];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) WHERE ({({[Geography].[Geography]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(208);
                expect(result[0].length).toBe(6);
                expect((result[0][1] as IAxisSet).formattedText).toBe('France');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Internet Sales Amount');
            });
            it('Ensure the initial binding with empty row', () => {
                dataSourceSettings.rows = [];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY ({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) WHERE ({({[Geography].[Geography]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(3);
                expect(result[0].length).toBe(6);
                expect((result[0][1] as IAxisSet).formattedText).toBe('France');
                expect((result[2][0] as IAxisSet).formattedText).toBe('Internet Sales Amount');
            });
        });

        /**
         * Test case for Drill Settings
         */
        describe('Engine spec with Drill settings', () => {
            let originalTimeout: number;
            let olapEngine: OlapEngine;
            let dataSourceSettings: IDataOptions;
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 13000;
                dataSourceSettings = {
                    catalog: catalog,
                    cube: 'Adventure Works',
                    dataProviderType: 'microsoft analysis services',
                    url: url,
                    localeIdentifier: 1033,
                    drilledMembers: [{
                            name: '[Date].[Fiscal]',
                            items: ['[Date].[Fiscal].[Fiscal Year].&[2010]',
                                '[Date].[Fiscal].[Fiscal Semester].&[2010]&[2]',
                                '[Date].[Fiscal].[Fiscal Year].&[2012]']
                        },
                        {
                            name: '[Customer].[Customer Geography]',
                            items: ['[Customer].[Customer Geography].[Country].&[Australia]',
                                '[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]'], delimiter: '##'
                        }
                    ],
                    filterSettings: [
                        {
                            type: 'Include',
                            name: '[Customer].[Customer Geography]',
                            items: ['[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]',
                                '[Customer].[Customer Geography].[Country].&[Germany]',
                                '[Customer].[Customer Geography].[Country].&[France]',
                                '[Customer].[Customer Geography].[Country].&[United Kingdom]',
                                '[Customer].[Customer Geography].[Country].&[United States]']
                        }
                    ],
                    rows: [
                        { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                    ],
                    columns: [
                        { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                        { name: '[Measures]', caption: 'Measures' }
                    ],
                    values: [
                        { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                    ],
                    filters: [],
                    valueAxis: 'column',
                };
                olapEngine = new OlapEngine();
                olapEngine.renderEngine(dataSourceSettings);
                done();
            });
            it('Ensure the initial binding', () => {
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}},(([Customer].[Customer Geography].[Country].&amp;[Australia].CHILDREN),({{[Measures].[Customer Count]}})),(([Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU].CHILDREN),({{[Measures].[Customer Count]}}))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({({DrilldownLevel({[Date].[Fiscal]})}),(([Date].[Fiscal].[Fiscal Year].&amp;[2010].CHILDREN)),(([Date].[Fiscal].[Fiscal Semester].&amp;[2010]&amp;[2].CHILDREN)),(([Date].[Fiscal].[Fiscal Year].&amp;[2012].CHILDREN))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(9);
                expect(result[0].length).toBe(26);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[5][0] as IAxisSet).formattedText).toBe('FY 2003');
            });
            it('Ensure the initial binding with multiple dimensions in rows', () => {
                dataSourceSettings.rows = [{ name: '[Date].[Fiscal]', caption: 'Date Fiscal' },
                { name: '[Employee].[Employee Department]', caption: 'Employee Department' }
                ];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}},(([Customer].[Customer Geography].[Country].&amp;[Australia].CHILDREN),({{[Measures].[Customer Count]}})),(([Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU].CHILDREN),({{[Measures].[Customer Count]}}))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}),(([Date].[Fiscal].[Fiscal Year].&amp;[2010].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]}))),(([Date].[Fiscal].[Fiscal Semester].&amp;[2010]&amp;[2].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]}))),(([Date].[Fiscal].[Fiscal Year].&amp;[2012].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(73);
                expect(result[0].length).toBe(26);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[5][0] as IAxisSet).formattedText).toBe('Document Control');
            });
            it('Ensure the initial binding with multiple measures in column', () => {
                dataSourceSettings.values = [{ name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' }
                ];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}},(([Customer].[Customer Geography].[Country].&amp;[Australia].CHILDREN),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}})),(([Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU].CHILDREN),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}),(([Date].[Fiscal].[Fiscal Year].&amp;[2010].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]}))),(([Date].[Fiscal].[Fiscal Semester].&amp;[2010]&amp;[2].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]}))),(([Date].[Fiscal].[Fiscal Year].&amp;[2012].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(73);
                expect(result[0].length).toBe(51);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[5][0] as IAxisSet).formattedText).toBe('Document Control');
            });
            it('Ensure the initial binding with multiple measures in row', () => {
                dataSourceSettings.columns.pop();
                dataSourceSettings.rows.push({ name: '[Measures]', caption: 'Measures' });
                dataSourceSettings.valueAxis = 'row';
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({({DrilldownLevel({[Customer].[Customer Geography]})}),(([Customer].[Customer Geography].[Country].&amp;[Australia].CHILDREN)),(([Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU].CHILDREN))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}},(([Date].[Fiscal].[Fiscal Year].&amp;[2010].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}})),(([Date].[Fiscal].[Fiscal Semester].&amp;[2010]&amp;[2].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}})),(([Date].[Fiscal].[Fiscal Year].&amp;[2012].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(210);
                expect(result[0].length).toBe(26);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('FY 2002');
            });
            it('Ensure the initial binding with dimension in slicer axis', () => {
                dataSourceSettings.filters = [{ name: '[Geography].[Geography]', caption: 'Geography' }];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({({DrilldownLevel({[Customer].[Customer Geography]})}),(([Customer].[Customer Geography].[Country].&amp;[Australia].CHILDREN)),(([Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU].CHILDREN))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}},(([Date].[Fiscal].[Fiscal Year].&amp;[2010].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}})),(([Date].[Fiscal].[Fiscal Semester].&amp;[2010]&amp;[2].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}})),(([Date].[Fiscal].[Fiscal Year].&amp;[2012].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) WHERE ({({[Geography].[Geography]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(210);
                expect(result[0].length).toBe(26);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('FY 2002');
            });
            it('Ensure the initial binding with empty row', () => {
                dataSourceSettings.rows = [];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({({DrilldownLevel({[Customer].[Customer Geography]})}),(([Customer].[Customer Geography].[Country].&amp;[Australia].CHILDREN)),(([Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU].CHILDREN))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({{{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) WHERE ({({[Geography].[Geography]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(4);
                expect(result[0].length).toBe(26);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Grand Total');
            });
        });
        /**
         * Test case for Measure Sorting
         */
        describe('Engine spec with measure sorting', () => {
            let originalTimeout: number;
            let olapEngine: OlapEngine;
            let dataSourceSettings: IDataOptions;
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 13000;
                dataSourceSettings = {
                    catalog: catalog,
                    cube: 'Adventure Works',
                    dataProviderType: 'microsoft analysis services',
                    url: url,
                    localeIdentifier: 1033,
                    drilledMembers: [{
                        name: '[Date].[Fiscal]',
                        items: ['[Date].[Fiscal].[Fiscal Year].&[2010]',
                            '[Date].[Fiscal].[Fiscal Semester].&[2010]&[2]',
                            '[Date].[Fiscal].[Fiscal Year].&[2012]']
                    },
                    {
                        name: '[Customer].[Customer Geography]',
                        items: ['[Date].[Fiscal].[Fiscal Quarter].&[2010]&[3]##[Customer].[Customer Geography].[Country].&[Australia]',
                            '[Date].[Fiscal].[Fiscal Quarter].&[2010]&[3]##[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]'], delimiter: '##'
                    }
                    ],
                    filterSettings: [
                        {
                            type: 'Include',
                            name: '[Customer].[Customer Geography]',
                            items: ['[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]',
                                '[Customer].[Customer Geography].[Country].&[Germany]',
                                '[Customer].[Customer Geography].[Country].&[France]',
                                '[Customer].[Customer Geography].[Country].&[United Kingdom]',
                                '[Customer].[Customer Geography].[Country].&[United States]']
                        }
                    ],
                    rows: [
                        { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                    ],
                    columns: [
                        { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                        { name: '[Measures]', caption: 'Measures' }
                    ],
                    values: [
                        { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                    ],
                    filters: [],
                    valueAxis: 'column',
                    valueSortSettings: {
                        sortOrder: 'Descending',
                        measure: '[Measures].[Internet Sales Amount]'
                    }
                };
                olapEngine = new OlapEngine();
                olapEngine.renderEngine(dataSourceSettings);
                done();
            });
            it('Ensure the initial binding', () => {
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({ORDER({({DrilldownLevel({[Date].[Fiscal]})}),(([Date].[Fiscal].[Fiscal Year].&amp;[2010].CHILDREN)),(([Date].[Fiscal].[Fiscal Semester].&amp;[2010]&amp;[2].CHILDREN)),(([Date].[Fiscal].[Fiscal Year].&amp;[2012].CHILDREN))},([Measures].[Internet Sales Amount]), DESC)})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(7);
                expect(result[0].length).toBe(7);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('FY 2003');
            });
            it('Ensure the initial binding with multiple dimensions in rows', () => {
                dataSourceSettings.rows = [{ name: '[Date].[Fiscal]', caption: 'Date Fiscal' },
                { name: '[Employee].[Employee Department]', caption: 'Employee Department' }
                ];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({ORDER({({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}),(([Date].[Fiscal].[Fiscal Year].&amp;[2010].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]}))),(([Date].[Fiscal].[Fiscal Semester].&amp;[2010]&amp;[2].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]}))),(([Date].[Fiscal].[Fiscal Year].&amp;[2012].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})))},([Measures].[Internet Sales Amount]), DESC)})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(71);
                expect(result[0].length).toBe(7);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Document Control');
            });
            it('Ensure the initial binding with multiple measures in column', () => {
                dataSourceSettings.values = [{ name: '[Measures].[Customer Count]', caption: 'Customer Count' },
                { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' }
                ];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({ORDER({({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}),(([Date].[Fiscal].[Fiscal Year].&amp;[2010].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]}))),(([Date].[Fiscal].[Fiscal Semester].&amp;[2010]&amp;[2].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]}))),(([Date].[Fiscal].[Fiscal Year].&amp;[2012].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})))},([Measures].[Internet Sales Amount]), DESC)})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(71);
                expect(result[0].length).toBe(13);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Document Control');
            });
            it('Ensure the initial binding with multiple measures in row', () => {
                dataSourceSettings.columns.pop();
                dataSourceSettings.rows.push({ name: '[Measures]', caption: 'Measures' });
                dataSourceSettings.valueAxis = 'row';
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({ORDER({({DrilldownLevel({[Customer].[Customer Geography]})})},([Measures].[Internet Sales Amount]), DESC)})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}},(([Date].[Fiscal].[Fiscal Year].&amp;[2010].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}})),(([Date].[Fiscal].[Fiscal Semester].&amp;[2010]&amp;[2].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}})),(([Date].[Fiscal].[Fiscal Year].&amp;[2012].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(208);
                expect(result[0].length).toBe(7);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Internet Sales Amount');
            });
            it('Ensure the initial binding with dimension in slicer axis', () => {
                dataSourceSettings.filters = [{ name: '[Geography].[Geography]', caption: 'Geography' }];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({ORDER({({DrilldownLevel({[Customer].[Customer Geography]})})},([Measures].[Internet Sales Amount]), DESC)})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Employee].[Employee Department]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}},(([Date].[Fiscal].[Fiscal Year].&amp;[2010].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}})),(([Date].[Fiscal].[Fiscal Semester].&amp;[2010]&amp;[2].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}})),(([Date].[Fiscal].[Fiscal Year].&amp;[2012].CHILDREN),(DrilldownLevel({[Employee].[Employee Department]})),({{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}))})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) WHERE ({({[Geography].[Geography]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(208);
                expect(result[0].length).toBe(7);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[3][0] as IAxisSet).formattedText).toBe('Internet Sales Amount');
            });
            it('Ensure the initial binding with empty row', () => {
                dataSourceSettings.rows = [];
                let customProperties: ICustomProperties = {
                    mode: '',
                    savedFieldList: olapEngine.fieldList,
                    savedFieldListData: olapEngine.fieldListData,
                    pageSettings: undefined,
                    enableValueSorting: undefined,
                    isDrillThrough: undefined,
                    localeObj: undefined
                };
                olapEngine.renderEngine(dataSourceSettings, customProperties);
                let result: IPivotValues = olapEngine.pivotValues;
                expect(olapEngine.mdxQuery).toBe('Select NON EMPTY (Hierarchize({ORDER({({DrilldownLevel({[Customer].[Customer Geography]})})},([Measures].[Internet Sales Amount]), DESC)})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (Hierarchize({{{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) WHERE ({({[Geography].[Geography]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(result.length).toBeGreaterThan(0);
                expect(result.length).toBe(2);
                expect(result[0].length).toBe(7);
                expect((result[0][1] as IAxisSet).formattedText).toBe('Australia');
                expect((result[1][0] as IAxisSet).formattedText).toBe('Grand Total');
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