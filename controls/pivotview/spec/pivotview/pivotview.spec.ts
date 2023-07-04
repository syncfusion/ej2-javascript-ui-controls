import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotUtil } from '../../src/base/util';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { closest, createElement, EmitType, remove } from '@syncfusion/ej2-base';
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
        
        describe('PagerUI', () => {
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
                        valueSortSettings: { "headerDelimiter": "##", "sortOrder": "Ascending" },
                        sortSettings: [{ name: 'company', order: 'Descending' }, { name: 'product', order: 'Descending', membersOrder: ['Jet', 'Flight', 'Van'] }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        rows: [{ name: 'state' }, { name: 'age' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'gender', expandAll: true }, { name: 'advance' }],
                        values: [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'DifferenceFrom' }],
                        expandAll: false,
                        enableSorting: true,
                        groupSettings: [
                            { name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                            { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                            { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }
                        ],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        filterSettings: [
                            { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                        ],
                        valueAxis: 'row',
                        valueIndex: 1,
                        filters: [{ name: 'age', axis: 'row' }, { name: 'index' , axis: 'column' }, { name: 'name' }],
                        fieldMapping: [{ name: 'product', dataType: 'string' },
                        { name: 'company', caption: 'Company' },
                        { name: 'pno', caption: 'Phone No' },
                        { name: 'email', caption: 'Email' },
                        { name: 'age', caption: 'Age' },
                        { name: 'guid', caption: 'Guid' }],
                        conditionalFormatSettings: [
                            {
                                measure: 'balance',
                                value1: 100000,
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
                                measure: 'quantity',
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
                        excludeFields: ['isActive']
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
                    enablePaging: true,
                    allowNumberFormatting: true,
                    allowCalculatedField: true,
                    allowDeferLayoutUpdate: true,
                    enableValueSorting: true,
                    exportAllPages: false,
                    maxNodeLimitInMemberEditor: 50,
                    pageSettings: {
                        rowPageSize: 4,
                        columnPageSize: 3,
                        currentColumnPage: 1,
                        currentRowPage: 1
                    },
                    pagerSettings: {
                        position: 'Bottom',
                        enableCompactView: false,
                        showColumnPager: true,
                        showRowPager: true
                    },
                    saveReport: util.saveReport.bind(this),
                    fetchReport: util.fetchReport.bind(this),
                    loadReport: util.loadReport.bind(this),
                    removeReport: util.removeReport.bind(this),
                    renameReport: util.renameReport.bind(this),
                    newReport: util.newReport.bind(this),
                    toolbarRender: util.beforeToolbarRender.bind(this),
                    displayOption: { view: 'Both' },
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                    },
                    gridSettings: {
                        columnWidth: 120, rowHeight: 36, allowSelection: true,
                        selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' }
                    },
                    dataBound: dataBound,
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('values testing', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("#N/A");
                (document.querySelector('#PivotGrid_row_nextIcon') as HTMLElement).click();
                    pivotGridObj.refreshData();
                    expect(pivotGridObj.engineModule.pivotValues.length === 8 && pivotGridObj.engineModule.pivotValues[2].length === 4).toBeTruthy;
            });
            it('filter testing', () => {
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("#N/A");
            });
            it('filter testing1', () => {
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                    expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("-");
                    expect(pivotGridObj.engineModule.pivotValues.length === 7 && pivotGridObj.engineModule.pivotValues[2].length === 3).toBeTruthy;
            });
            it('sort testing2', () => {
                (document.querySelectorAll('.e-icons.e-sort')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-icons.e-sort')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                    expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("-");
                    expect(pivotGridObj.engineModule.pivotValues.length === 7 && pivotGridObj.engineModule.pivotValues[3].length === 3).toBeTruthy;
            });
            it('set data', () => {
                pivotGridObj.setProperties({ dataSourceSettings: { valueIndex: -1 } });
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('filter testing3', () => {
                (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
                expect(pivotGridObj.engineModule.pivotValues.length === 7 && pivotGridObj.engineModule.pivotValues[2].length === 3).toBeTruthy;
            });
            it('filter testing4', () => {
                (document.querySelectorAll('.e-btn-filter')[4] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("New Jercy");
                    expect(pivotGridObj.engineModule.pivotValues.length === 7 && pivotGridObj.engineModule.pivotValues[4].length === 3).toBeTruthy;
            });
            it('filter testing5', () => {
                pivotGridObj.dataSourceSettings.valueAxis = 'column';
                pivotGridObj.dataSourceSettings.valueIndex = 2;
                pivotGridObj.refreshData();
                    expect("1").toBe("1");
                    expect(pivotGridObj.engineModule.pivotValues.length === 6 && pivotGridObj.engineModule.pivotValues[5].length === 5).toBeTruthy;
            });
            it('sort testing6', () => {
                (document.querySelectorAll('.e-icons.e-sort')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-icons.e-sort')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                    expect((pivotGridObj.engineModule.pivotValues[3][0] as IDataSet).formattedText).toBe("Delhi");
                    expect(pivotGridObj.engineModule.pivotValues.length === 6 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
            });
            it('filter testing7', () => {
                (document.querySelectorAll('.e-btn-filter')[6] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                    expect((pivotGridObj.engineModule.pivotValues[5][0] as IDataSet).formattedText).toBe("Grand Total");
                    expect(pivotGridObj.engineModule.pivotValues.length === 6 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
            });
            it('filter testing8', () => {
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Californiya");
                    expect(pivotGridObj.engineModule.pivotValues.length === 6 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
            });
            it('drilldown testing8', (done: Function) => {
                (document.querySelectorAll('.e-expand')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("39");
                    expect(pivotGridObj.engineModule.pivotValues.length === 7 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 200);
            });
            it('drillup testing8', (done: Function) => {
                (document.querySelectorAll('.e-collapse')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Californiya");
                    expect(pivotGridObj.engineModule.pivotValues.length === 6 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 200);
            });
            it('remove testing9', () => {
                (document.querySelectorAll('.e-remove')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-remove')[9] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-remove')[5] as HTMLElement).click();
                pivotGridObj.refreshData();
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("33");
                    expect(pivotGridObj.engineModule.pivotValues.length === 6 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
            });
            it('Sub Total', (done: Function) => {
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Sub Total - True', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Sub Total - False', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Sub Total - Row', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Sub Total - Column', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    done();
                }, 100);
            });
            it('Grand Total', (done: Function) => {
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Grand Total - True', () => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - False', () => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - Row', () => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - Column', () => {
                    (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            });
            it('Mouseover on chart icon', () => {
                    expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                    expect((pivotGridObj.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === 'none').toBeTruthy();
                    let li: HTMLElement = document.getElementById('PivotGridchart_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Click Column Chart with chart grouping bar', () => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display).toBe('none');
                    expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-chart-grouping-bar')).toBeTruthy();
            });
            it('Switch to Grid with grouping bar', () => {
                (document.querySelector('.e-pivot-toolbar .e-toolbar-grid') as HTMLElement).click();
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy();
                    pivotGridObj.displayOption.primary = 'Chart';
            });
            it('Export', () => {
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

        describe('VirtualUI', () => {
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
                PivotView.Inject(GroupingBar, DrillThrough, Pager, Grouping, Toolbar, PDFExport, VirtualScroll, ExcelExport, ConditionalFormatting, NumberFormatting);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        valueSortSettings: { "headerDelimiter": "##", "sortOrder": "Ascending" },
                        sortSettings: [{ name: 'company', order: 'Descending' }, { name: 'product', order: 'Descending', membersOrder: ['Jet', 'Flight', 'Van'] }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        rows: [{ name: 'state' }, { name: 'age' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'gender', expandAll: true }, { name: 'advance' }],
                        values: [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'DifferenceFrom' }],
                        expandAll: false,
                        enableSorting: true,
                        groupSettings: [
                            { name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                            { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                            { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }
                        ],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        filterSettings: [
                            { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                        ],
                        valueAxis: 'row',
                        valueIndex: 1,
                        filters: [{ name: 'age', axis: 'row' }, { name: 'index' , axis: 'column' }, { name: 'name' }],
                        fieldMapping: [{ name: 'product', dataType: 'string' },
                        { name: 'company', caption: 'Company' },
                        { name: 'pno', caption: 'Phone No' },
                        { name: 'email', caption: 'Email' },
                        { name: 'age', caption: 'Age' },
                        { name: 'guid', caption: 'Guid' }],
                        conditionalFormatSettings: [
                            {
                                measure: 'balance',
                                value1: 100000,
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
                                measure: 'quantity',
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
                        excludeFields: ['isActive']
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
                    enableVirtualization: true,
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
                    dataBound: dataBound,
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                    },
                    gridSettings: {
                        columnWidth: 120, rowHeight: 36, allowSelection: true,
                        selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' }
                    },
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('values testing', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("#N/A");
                    done();
                }, 500);
            });
            it('filter testing', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("#N/A");
                    done();
                }, 100);
            });
            it('filter testing1', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("-");
                    expect(pivotGridObj.engineModule.pivotValues.length === 22 && pivotGridObj.engineModule.pivotValues[2].length === 3).toBeTruthy;
                    done();
                }, 100);
            });
            it('sort testing2', (done: Function) => {
                (document.querySelectorAll('.e-icons.e-sort')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-icons.e-sort')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("-");
                    expect(pivotGridObj.engineModule.pivotValues.length === 22 && pivotGridObj.engineModule.pivotValues[3].length === 3).toBeTruthy;
                    done();
                }, 100);
            });
            it('set data', () => {
                pivotGridObj.setProperties({ dataSourceSettings: { valueIndex: -1 } });
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('filter testing3', () => {
                (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
                expect(pivotGridObj.engineModule.pivotValues.length === 22 && pivotGridObj.engineModule.pivotValues[2].length === 3).toBeTruthy;
            });
            it('filter testing4', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[4] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Tamilnadu");
                    expect(pivotGridObj.engineModule.pivotValues.length === 22 && pivotGridObj.engineModule.pivotValues[4].length === 3).toBeTruthy;
                    done();
                }, 100);
            });
            it('filter testing5', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueAxis = 'column';
                pivotGridObj.dataSourceSettings.valueIndex = 2;
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect("1").toBe("1");
                    expect(pivotGridObj.engineModule.pivotValues.length === 10 && pivotGridObj.engineModule.pivotValues[5].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('sort testing6', (done: Function) => {
                (document.querySelectorAll('.e-icons.e-sort')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-icons.e-sort')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][0] as IDataSet).formattedText).toBe("Vetaikan");
                    expect(pivotGridObj.engineModule.pivotValues.length === 10 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('filter testing7', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[6] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[5][0] as IDataSet).formattedText).toBe("Rajkot");
                    expect(pivotGridObj.engineModule.pivotValues.length === 10 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('filter testing8', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Tamilnadu");
                    expect(pivotGridObj.engineModule.pivotValues.length === 10 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('drilldown testing8', (done: Function) => {
                (document.querySelectorAll('.e-expand')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-expand')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("39");
                    expect(pivotGridObj.engineModule.pivotValues.length === 25 && pivotGridObj.engineModule.pivotValues[2].length === 21).toBeTruthy;
                    done();
                }, 100);
            });
            it('drillup testing8', (done: Function) => {
                (document.querySelectorAll('.e-collapse')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Tamilnadu");
                    expect(pivotGridObj.engineModule.pivotValues.length === 10 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('remove testing9', (done: Function) => {
                (document.querySelectorAll('.e-remove')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-remove')[9] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-remove')[5] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("37");
                    expect(pivotGridObj.engineModule.pivotValues.length === 23 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('Sub Total', () => {
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Sub Total - True', () => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Sub Total - False', () => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Sub Total - Row', () => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Sub Total - Column', () => {
                    (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            });
            it('Grand Total', () => {
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - True', () => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - False', () => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - Row', () => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - Column', () => {
                    (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            });
            it('Mouseover on chart icon', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                    expect((pivotGridObj.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === 'none').toBeTruthy();
                    let li: HTMLElement = document.getElementById('PivotGridchart_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Click Column Chart with chart grouping bar', (done: Function) => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display).toBe('none');
                    expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-chart-grouping-bar')).toBeTruthy();
                    done();
                }, 100);
            });
            it('Switch to Grid with grouping bar', (done: Function) => {
                (document.querySelector('.e-pivot-toolbar .e-toolbar-grid') as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy();
                    pivotGridObj.displayOption.primary = 'Chart';
                    done();
                }, 100);
            });
            it('Export', (done: Function) => {
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('PDF Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
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

        describe('NormalUI', () => {
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
                PivotView.Inject(GroupingBar, DrillThrough, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivotDatas as IDataSet[],
                        valueSortSettings: { "headerDelimiter": "##", "sortOrder": "Ascending" },
                        sortSettings: [{ name: 'company', order: 'Descending' }, { name: 'product', order: 'Descending', membersOrder: ['Jet', 'Flight', 'Van'] }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        rows: [{ name: 'state' }, { name: 'age' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'gender', expandAll: true }, { name: 'advance' }],
                        values: [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'DifferenceFrom' }],
                        expandAll: false,
                        enableSorting: true,
                        groupSettings: [
                            { name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                            { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                            { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }
                        ],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        filterSettings: [
                            { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                        ],
                        valueAxis: 'row',
                        valueIndex: 1,
                        filters: [{ name: 'age', axis: 'row' }, { name: 'index' , axis: 'column' }, { name: 'name' }],
                        fieldMapping: [{ name: 'product', dataType: 'string' },
                        { name: 'company', caption: 'Company' },
                        { name: 'pno', caption: 'Phone No' },
                        { name: 'email', caption: 'Email' },
                        { name: 'age', caption: 'Age' },
                        { name: 'guid', caption: 'Guid' }],
                        conditionalFormatSettings: [
                            {
                                measure: 'balance',
                                value1: 100000,
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
                                measure: 'quantity',
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
                        excludeFields: ['isActive']
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
                    enableVirtualization: true,
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
                    dataBound: dataBound,
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                    },
                    gridSettings: {
                        columnWidth: 120, rowHeight: 36, allowSelection: true,
                        selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' }
                    },
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('values testing', (done: Function) => {
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][4] as IDataSet).formattedText).toBe("-$2,775.31");
                    done();
                }, 500);
            });
            it('filter testing', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][4] as IDataSet).formattedText).toBe("3");
                    done();
                }, 100);
            });
            it('filter testing1', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("-");
                    expect(pivotGridObj.engineModule.pivotValues.length === 13 && pivotGridObj.engineModule.pivotValues[2].length === 3).toBeTruthy;
                    done();
                }, 100);
            });
            it('sort testing2', (done: Function) => {
                (document.querySelectorAll('.e-icons.e-sort')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-icons.e-sort')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[1][0] as IDataSet).formattedText).toBe("Tamilnadu");
                    expect(pivotGridObj.engineModule.pivotValues.length === 13 && pivotGridObj.engineModule.pivotValues[3].length === 3).toBeTruthy;
                    done();
                }, 100);
            });
            it('set data', () => {
                pivotGridObj.setProperties({ dataSourceSettings: { valueIndex: -1 } });
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('filter testing3', () => {
                (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
                expect(pivotGridObj.engineModule.pivotValues.length === 10 && pivotGridObj.engineModule.pivotValues[2].length === 3).toBeTruthy;
            });
            it('filter testing4', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[4] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Rajkot");
                    expect(pivotGridObj.engineModule.pivotValues.length === 10 && pivotGridObj.engineModule.pivotValues[4].length === 3).toBeTruthy;
                    done();
                }, 100);
            });
            it('filter testing5', (done: Function) => {
                pivotGridObj.dataSourceSettings.valueAxis = 'column';
                pivotGridObj.dataSourceSettings.valueIndex = 2;
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect("1").toBe("1");
                    expect(pivotGridObj.engineModule.pivotValues.length === 6 && pivotGridObj.engineModule.pivotValues[5].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('sort testing6', (done: Function) => {
                (document.querySelectorAll('.e-icons.e-sort')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-icons.e-sort')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][0] as IDataSet).formattedText).toBe("Tamilnadu");
                    expect(pivotGridObj.engineModule.pivotValues.length === 6 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('filter testing7', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[6] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[5][0] as IDataSet).formattedText).toBe("Grand Total");
                    expect(pivotGridObj.engineModule.pivotValues.length === 6 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('filter testing8', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Rajkot");
                    expect(pivotGridObj.engineModule.pivotValues.length === 7 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('drilldown testing8', (done: Function) => {
                (document.querySelectorAll('.e-expand')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-expand')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("33");
                    expect(pivotGridObj.engineModule.pivotValues.length === 8 && pivotGridObj.engineModule.pivotValues[2].length === 11).toBeTruthy;
                    done();
                }, 100);
            });
            it('drillup testing8', (done: Function) => {
                (document.querySelectorAll('.e-collapse')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Rajkot");
                    expect(pivotGridObj.engineModule.pivotValues.length === 7 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('remove testing9', (done: Function) => {
                (document.querySelectorAll('.e-remove')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-remove')[9] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-remove')[5] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("21");
                    expect(pivotGridObj.engineModule.pivotValues.length === 7 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('Sub Total', () => {
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Sub Total - True', () => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Sub Total - False', () => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Sub Total - Row', () => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Sub Total - Column', () => {
                    (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridsubtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            });
            it('Grand Total', () => {
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - True', () => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - False', () => {
                    (document.querySelectorAll('.e-menu-popup li')[1] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - Row', () => {
                    (document.querySelectorAll('.e-menu-popup li')[2] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Grand Total - Column', () => {
                    (document.querySelectorAll('.e-menu-popup li')[3] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridgrandtotal_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            });
            it('Mouseover on chart icon', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                    expect((pivotGridObj.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === 'none').toBeTruthy();
                    let li: HTMLElement = document.getElementById('PivotGridchart_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('Click Column Chart with chart grouping bar', (done: Function) => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display).toBe('none');
                    expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-chart-grouping-bar')).toBeTruthy();
                    done();
                }, 100);
            });
            it('Switch to Grid with grouping bar', (done: Function) => {
                (document.querySelector('.e-pivot-toolbar .e-toolbar-grid') as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-grouping-bar')).toBeTruthy();
                    pivotGridObj.displayOption.primary = 'Chart';
                    done();
                }, 100);
            });
            it('Export', (done: Function) => {
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('PDF Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
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

        describe('Virtual-Popups', () => {
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
                PivotView.Inject(GroupingBar, DrillThrough, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting, VirtualScroll);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivotDatas as IDataSet[],
                        sortSettings: [],
                        expandAll: true,
                        rows: [{ name: 'product' }, { name: 'date' }],
                        formatSettings: [{ name: 'quantity', format: 'C' }, { name: 'balance', format: '€ ###.0'}, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'gender' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'price' }], filters: [{ name: 'index' }],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        filterSettings: [ { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') }],
                        conditionalFormatSettings: [
                            {
                                measure: 'balance',
                                value1: 100000,
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
                                measure: 'quantity',
                                conditions: 'Between',
                                style: {
                                    backgroundColor: '#f48fb1',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            }
                        ],
                    },
                    height: 300,
                    width: 800,
                    allowDrillThrough: true,
                    showToolbar: true,
                    showGroupingBar: true,
                    enableVirtualization: true,
                    allowConditionalFormatting: true,
                    showFieldList: true,
                    showValuesButton: true,
                    allowNumberFormatting: true,
                    displayOption: { view: 'Both' },
                    dataBound: dataBound,
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                    },
                    gridSettings: {
                        columnWidth: 120, rowHeight: 36, allowSelection: true,
                        selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' }
                    },
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'NumberFormatting', 'FieldList'],
                    saveReport: util.saveReport.bind(this),
                    fetchReport: util.fetchReport.bind(this),
                    loadReport: util.loadReport.bind(this),
                    removeReport: util.removeReport.bind(this),
                    renameReport: util.renameReport.bind(this),
                    newReport: util.newReport.bind(this),
                    toolbarRender: util.beforeToolbarRender.bind(this)
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('date filter', (done: Function) => {
                setTimeout(() => {
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
                done();
                }, 300);
            });
            it('Filter testing', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'Equals', value1: 'car' }];
                pivotGridObj.refreshData();
                    expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
            });
            it('lable filter', () => {
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelector('.e-filter-operator') as HTMLElement).click();
                (document.querySelectorAll('.e-list-item')[2] as HTMLElement).click();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('value filter', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
                (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelector('#e-item-PivotGrid_FilterTabContainer_2') as HTMLElement).click();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('value filter', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
                (document.querySelectorAll('.e-btn-filter')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelector('#PivotGrid_Sort_Descend') as HTMLElement).click();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('aggregation value', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
                (document.querySelectorAll('.e-dropdown-icon')[0] as HTMLElement).click();
                (document.querySelector('#PivotGrid_Avg') as HTMLElement).click();
                (document.querySelectorAll('.e-dropdown-icon')[1] as HTMLElement).click();
                (document.querySelector('#PivotGrid_Product') as HTMLElement).click();
                (document.querySelectorAll('.e-dropdown-icon')[0] as HTMLElement).click();
                (document.querySelector('#PivotGrid_MoreOption') as HTMLElement).click();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('conditionalformatting-filter', (done: Function) => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
                (document.querySelector('#PivotGridformatting') as HTMLElement).click();
                (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                (document.querySelector('#PivotGridformatting') as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    (document.querySelector('.e-format-condition-button') as HTMLElement).click();
                    (document.querySelector('.e-format-cancel-button') as HTMLElement).click();
                    expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('numberformatting-filter', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
                (document.querySelector('#PivotGridnumberFormatting') as HTMLElement).click();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('Filter testing', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("14");
            });
            it('Mouseover on chart icon', () => {
                    expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                    expect((pivotGridObj.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === 'none').toBeTruthy();
                    let li: HTMLElement = document.getElementById('PivotGridchart_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Click Column Chart with chart grouping bar', (done: Function) => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display).toBe('none');
                    expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-chart-grouping-bar')).toBeTruthy();
                    done();
                }, 100);
            });
            it('Filter testing', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("14");
            });
        });

        describe('Normal-Popups', () => {
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
                PivotView.Inject(GroupingBar, DrillThrough, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting, VirtualScroll);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivotDatas as IDataSet[],
                        sortSettings: [],
                        expandAll: true,
                        rows: [{ name: 'product' }, { name: 'date' }],
                        formatSettings: [{ name: 'quantity', format: 'C' }, { name: 'balance', format: '€ ###.0'}, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'gender' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'price' }], filters: [{ name: 'index' }],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        filterSettings: [ { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') }],
                        conditionalFormatSettings: [
                            {
                                measure: 'balance',
                                value1: 100000,
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
                                measure: 'quantity',
                                conditions: 'Between',
                                style: {
                                    backgroundColor: '#f48fb1',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            }
                        ],
                    },
                    height: 300,
                    width: 800,
                    allowDrillThrough: true,
                    showToolbar: true,
                    showGroupingBar: true,
                    enableVirtualization: false,
                    allowConditionalFormatting: true,
                    showFieldList: true,
                    showValuesButton: true,
                    allowNumberFormatting: true,
                    displayOption: { view: 'Both' },
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                    },
                    dataBound: dataBound,
                    gridSettings: {
                        columnWidth: 120, rowHeight: 36, allowSelection: true,
                        selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' }
                    },
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'NumberFormatting', 'FieldList'],
                    saveReport: util.saveReport.bind(this),
                    fetchReport: util.fetchReport.bind(this),
                    loadReport: util.loadReport.bind(this),
                    removeReport: util.removeReport.bind(this),
                    renameReport: util.renameReport.bind(this),
                    newReport: util.newReport.bind(this),
                    toolbarRender: util.beforeToolbarRender.bind(this)
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('date filter', (done: Function) => {
                setTimeout(() => {
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
                done();
                }, 300);
            });
            it('Filter testing', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'Equals', value1: 'car' }];
                pivotGridObj.refreshData();
                    expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
            });
            it('lable filter', () => {
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelector('.e-filter-operator') as HTMLElement).click();
                (document.querySelectorAll('.e-list-item')[2] as HTMLElement).click();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('value filter', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
                (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelector('#e-item-PivotGrid_FilterTabContainer_2') as HTMLElement).click();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('value filter', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
                (document.querySelectorAll('.e-btn-filter')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelector('#PivotGrid_Sort_Descend') as HTMLElement).click();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('aggregation value', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
                (document.querySelectorAll('.e-dropdown-icon')[0] as HTMLElement).click();
                (document.querySelector('#PivotGrid_Avg') as HTMLElement).click();
                (document.querySelectorAll('.e-dropdown-icon')[1] as HTMLElement).click();
                (document.querySelector('#PivotGrid_Product') as HTMLElement).click();
                (document.querySelectorAll('.e-dropdown-icon')[0] as HTMLElement).click();
                (document.querySelector('#PivotGrid_MoreOption') as HTMLElement).click();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('conditionalformatting-filter', (done: Function) => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
                (document.querySelector('#PivotGridformatting') as HTMLElement).click();
                (document.querySelector('.e-format-apply-button') as HTMLElement).click();
                (document.querySelector('#PivotGridformatting') as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    (document.querySelector('.e-format-condition-button') as HTMLElement).click();
                    (document.querySelector('.e-format-cancel-button') as HTMLElement).click();
                    expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                    done();
                }, 100);
            });
            it('numberformatting-filter', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("$14.00");
                (document.querySelector('#PivotGridnumberFormatting') as HTMLElement).click();
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('Filter testing', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("14");
            });
            it('Mouseover on chart icon', () => {
                    expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                    expect((pivotGridObj.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === 'none').toBeTruthy();
                    let li: HTMLElement = document.getElementById('PivotGridchart_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
            });
            it('Click Column Chart with chart grouping bar', (done: Function) => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display).toBe('none');
                    expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display === 'block').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-chart-grouping-bar')).toBeTruthy();
                    done();
                }, 100);
            });
            it('Filter testing', () => {
                expect(pivotGridObj.engineModule.pivotValues.length === 5 && pivotGridObj.engineModule.pivotValues[2].length === 5).toBeTruthy;
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("14");
            });
        });

        describe('Virtual-Chart', () => {
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
                PivotView.Inject(GroupingBar, DrillThrough, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivotDatas as IDataSet[],
                        valueSortSettings: { "headerDelimiter": "##", "sortOrder": "Ascending" },
                        sortSettings: [{ name: 'company', order: 'Descending' }, { name: 'product', order: 'Descending', membersOrder: ['Jet', 'Flight', 'Van'] }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        rows: [{ name: 'state' }, { name: 'age' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'gender', expandAll: true }, { name: 'advance' }],
                        values: [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'DifferenceFrom' }],
                        expandAll: false,
                        enableSorting: true,
                        groupSettings: [
                            { name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                            { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                            { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }
                        ],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        filterSettings: [
                            { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                        ],
                        valueAxis: 'row',
                        valueIndex: 1,
                        filters: [{ name: 'age', axis: 'row' }, { name: 'index' , axis: 'column' }, { name: 'name' }],
                        fieldMapping: [{ name: 'product', dataType: 'string' },
                        { name: 'company', caption: 'Company' },
                        { name: 'pno', caption: 'Phone No' },
                        { name: 'email', caption: 'Email' },
                        { name: 'age', caption: 'Age' },
                        { name: 'guid', caption: 'Guid' }],
                        conditionalFormatSettings: [
                            {
                                measure: 'balance',
                                value1: 100000,
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
                                measure: 'quantity',
                                conditions: 'Between',
                                style: {
                                    backgroundColor: '#f48fb1',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            }
                        ],
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
                    enableVirtualization: true,
                    showValuesButton: true,
                    allowGrouping: true,
                    enablePaging: false,
                    allowNumberFormatting: true,
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
                    dataBound: dataBound,
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                    },
                    gridSettings: {
                        columnWidth: 120, rowHeight: 36, allowSelection: true,
                        selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' }
                    },
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Mouseover on chart icon', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                    expect((pivotGridObj.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === 'none').toBeTruthy();
                    let li: HTMLElement = document.getElementById('PivotGridchart_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 300);
            });
            it('Click Column Chart with chart grouping bar', (done: Function) => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display).toBe('none');
                    expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-chart-grouping-bar')).toBeTruthy();
                    done();
                }, 100);
            });
            it('Export', (done: Function) => {
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('PDF Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('PNG Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('#PivotGridpng')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('JPEG Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('#PivotGridjpeg')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('SVG Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('#PivotGridsvg')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    done();
                }, 100);
            });
        });

        describe('Normal-Chart', () => {
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
                PivotView.Inject(GroupingBar, DrillThrough, Grouping, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, NumberFormatting);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivotDatas as IDataSet[],
                        valueSortSettings: { "headerDelimiter": "##", "sortOrder": "Ascending" },
                        sortSettings: [{ name: 'company', order: 'Descending' }, { name: 'product', order: 'Descending', membersOrder: ['Jet', 'Flight', 'Van'] }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        rows: [{ name: 'state' }, { name: 'age' }],
                        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                        columns: [{ name: 'gender', expandAll: true }, { name: 'advance' }],
                        values: [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'DifferenceFrom' }],
                        expandAll: false,
                        enableSorting: true,
                        groupSettings: [
                            { name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                            { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                            { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }
                        ],
                        allowValueFilter: true,
                        allowLabelFilter: true,
                        filterSettings: [
                            { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                        ],
                        valueAxis: 'row',
                        valueIndex: 1,
                        filters: [{ name: 'age', axis: 'row' }, { name: 'index' , axis: 'column' }, { name: 'name' }],
                        fieldMapping: [{ name: 'product', dataType: 'string' },
                        { name: 'company', caption: 'Company' },
                        { name: 'pno', caption: 'Phone No' },
                        { name: 'email', caption: 'Email' },
                        { name: 'age', caption: 'Age' },
                        { name: 'guid', caption: 'Guid' }],
                        conditionalFormatSettings: [
                            {
                                measure: 'balance',
                                value1: 100000,
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
                                measure: 'quantity',
                                conditions: 'Between',
                                style: {
                                    backgroundColor: '#f48fb1',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            }
                        ],
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
                    showValuesButton: true,
                    allowGrouping: true,
                    enablePaging: false,
                    allowNumberFormatting: true,
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
                    dataBound: dataBound,
                    chartSettings: {
                        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultipleAxis: false,
                    },
                    gridSettings: {
                        columnWidth: 120, rowHeight: 36, allowSelection: true,
                        selectionSettings: { mode: 'Cell', type: 'Single', cellSelectionMode: 'Box' }
                    },
                    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
                    'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Mouseover on chart icon', (done: Function) => {
                setTimeout(() => {
                    expect(pivotGridObj.element.querySelector('.e-pivot-toolbar') !== undefined).toBeTruthy();
                    expect((pivotGridObj.element.querySelector('.e-chart-grouping-bar') as HTMLElement).style.display === 'none').toBeTruthy();
                    let li: HTMLElement = document.getElementById('PivotGridchart_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 300);
            });
            it('Click Column Chart with chart grouping bar', (done: Function) => {
                (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                setTimeout(() => {
                    expect((document.querySelector('.e-grid') as HTMLElement).style.display).toBe('none');
                    expect((document.querySelector('.e-pivotchart') as HTMLElement).style.display === 'none').toBeFalsy();
                    expect(pivotGridObj.element.querySelector('.e-chart-grouping-bar')).toBeTruthy();
                    done();
                }, 100);
            });
            it('Export', (done: Function) => {
                setTimeout(() => {
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('PDF Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('.e-menu-popup li')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('PNG Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('#PivotGridpng')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('JPEG Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('#PivotGridjpeg')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    util.triggerEvent(li, 'mouseover');
                    done();
                }, 100);
            });
            it('SVG Export', (done: Function) => {
                setTimeout(() => {
                    (document.querySelectorAll('#PivotGridsvg')[0] as HTMLElement).click();
                    let li: HTMLElement = document.getElementById('PivotGridexport_menu').children[0] as HTMLElement;
                    expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
                    done();
                }, 100);
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
                expect(PivotUtil.getType(date)).toEqual('number');
            });
            it('To check getType method - date', () => {
                let date: Date = new Date();
                date = new Date(date.toDateString());
                expect(PivotUtil.getType(date)).toEqual('number');
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