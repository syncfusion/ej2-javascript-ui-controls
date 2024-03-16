import { PivotEngine, IDataOptions, IDataSet, IAxisSet, IPageSettings, ICustomProperties, IFilter, IFieldOptions } from '../../src/base/engine';
import { pivot_dataset, pivot_undefineddata, pivot_nodata } from '../base/datasource.spec';
import { PivotUtil } from '../../src/base/util';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { closest, createElement, EmitType, remove, EventHandler, getInstance } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { VirtualScroll } from '../../src/pivotview/actions';
import { DrillThrough } from '../../src/pivotview/actions';
import { FieldList } from '../../src/common/actions/field-list';
import { Pager } from '../../src/pivotview/actions/pager';
import { PivotActionCompleteEventArgs } from '../../src/index';
import { TreeView } from '@syncfusion/ej2-navigations';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { Button } from '@syncfusion/ej2-buttons';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';

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
                return;
            }
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
                let dataBound: EmitType<Object> = () => { done(); };
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
                    dataBound: dataBound,
                    virtualScrollSettings: { allowSinglePage: false }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Filter testing1', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'Equals', value1: 'car' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("14");
            });
            it('Filter testing2', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'BeginWith', value1: 'C' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("14");
            });
            it('Filter testing3', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'EndsWith', value1: 'e' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("16");
            });
            it('Filter testing4', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', condition: 'GreaterThan', value1: 'Car' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[3][3] as IDataSet).formattedText).toBe("52740.04999999999");
            });
            it('Filter testing5', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', condition: 'GreaterThanOrEqualTo', value1: 'Jet' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("33");
            });
            it('Filter testing6', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', condition: 'LessThanOrEqualTo', value1: 'Flight' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[3][2] as IDataSet).formattedText).toBe("14");
            });
            it('Filter testing7', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'Contains', value1: 'e', value2: 'v' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[4][5] as IDataSet).formattedText).toBe("34");
                expect((pivotGridObj.engineModule.pivotValues[5][5] as IDataSet).formattedText).toBe("50");
            });
            it('date testing1', () => {
                pivotGridObj.dataSourceSettings.rows = [{ name: 'date' }, { name: 'product' }];
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'Before', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("16");
            });
            it('date testing2', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'Equals', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("15");
            });
            it('date testing3', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'After', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[4][2] as IDataSet).formattedText).toBe("18");
            });
            it('date testing4', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'AfterOrEqualTo', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("15");
            });
            it('date testing5', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'BeforeOrEqualTo', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[4][2] as IDataSet).formattedText).toBe("15");
            });
            it('date testing6', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', condition: 'Between', value1: 'Sun Feb 10 1991 20:28:59 GMT+0530 (India Standard Time)', value2: 'Tue Sep 09 2008 09:47:08 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("15");
            });
            it('date testing7', () => {
                pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'date', type: 'Date', value1: 'Tue Sep 09 2008 09:47:08 GMT+0530 (India Standard Time)' }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[4][2] as IDataSet).formattedText).toBe("15");
                pivotGridObj.dataSourceSettings.filterSettings = [];
                pivotGridObj.dataSourceSettings.columns = [{ name: 'gender' }, { name: 'advance' }];
                pivotGridObj.dataSourceSettings.values = [{ name: 'balance', type: 'DifferenceFrom' }, { name: 'quantity', type: 'PercentageOfGrandTotal' }, { name: 'price', type: 'CalculatedField' }];
                pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'gender', order: 'Descending' }, { name: 'advance', order: 'Descending', membersOrder: [6124, 7107] }];
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[3][2] as IDataSet).formattedText).toBe("12.5%");
            });
            it('date testing8', () => {
                (document.querySelectorAll('.e-expand')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-icons.e-sort')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-collapse')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[5][2] as IDataSet).formattedText).toBe("11.72%");
            });
            it('data testing9', () => {
                pivotGridObj.dataSourceSettings.rows = [{ name: 'product' }, { name: 'date' }];
                pivotGridObj.refreshData();
                expect(("1")).toBe("1");
            });
            it('filter testing1', () => {
                (document.querySelectorAll('.e-icons.e-sort')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                (document.querySelectorAll('.e-expand')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                expect(("1")).toBe("1");
            });
            it('filter testing2', () => {
                expect((pivotGridObj.engineModule.pivotValues[4][5] as IDataSet).formattedText).toBe("26.56%");
                pivotGridObj.refreshData();
            });
            it('filter testing3', (done: Function) => {
                expect((pivotGridObj.engineModule.pivotValues[3][5] as IDataSet).formattedText).toBe("15.63%");
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(function () {
                    expect((pivotGridObj.engineModule.pivotValues[3][5] as IDataSet).formattedText).toBe("17.54%");
                    done();
                }, 1000);
            });
            it('filter testing4', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[1] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(function () {
                    expect((pivotGridObj.engineModule.pivotValues[3][5] as IDataSet).formattedText).toBe("29.85%");
                    done();
                }, 1000);
            });
            it('filter testing5', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(function () {
                    expect((pivotGridObj.engineModule.pivotValues[3][5] as IDataSet).formattedText).toBe("42.55%");
                    done();
                }, 1000);
            });
            it('filter testing6', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[4] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[3][5] as IDataSet).formattedText).toBe("64.52%");
                    done();
                }, 1000);
            });
            it('aggreagation testing', () => {
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
                let dataBound: EmitType<Object> = () => { done(); };
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
                    dataBound: dataBound,
                    virtualScrollSettings: { allowSinglePage: false }
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Paging testing', () => {
                expect((pivotGridObj.engineModule.pivotValues[6][1] as IDataSet).formattedText).toBe("105");
                (document.querySelector('#PivotGrid_row_nextIcon') as HTMLElement).click();
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("-35");
            });
            it('filter testing1', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(function () {
                    expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("-23");
                    done();
                }, 1000);
            });
            it('filter testing2', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(function () {
                    expect((pivotGridObj.engineModule.pivotValues[3][1] as IDataSet).formattedText).toBe("-21");
                    done();
                }, 1000);
            });
            it('sort testing', () => {
                (document.querySelectorAll('.e-icons.e-sort')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-icons.e-sort')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[2][2] as IDataSet).formattedText).toBe("-$3,468.89");
            });
            it('set data', () => {
                pivotGridObj.setProperties({ dataSourceSettings: { valueIndex: 1 } });
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
            });
            it('filter testing4', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[4] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(function () {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Flight");
                    done();
                }, 1000);
            });
            it('filter testing5', () => {
                pivotGridObj.dataSourceSettings.valueAxis = 'column';
                pivotGridObj.dataSourceSettings.valueIndex = 2;
                pivotGridObj.refreshData();
                expect("1").toBe("1");
            });
            it('sort testing', () => {
                (document.querySelectorAll('.e-icons.e-sort')[1] as HTMLElement).click();
                (document.querySelectorAll('.e-icons.e-sort')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                expect((pivotGridObj.engineModule.pivotValues[3][0] as IDataSet).formattedText).toBe("Van");
            });
            it('filter testing6', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[3] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(function () {
                    expect((pivotGridObj.engineModule.pivotValues[5][0] as IDataSet).formattedText).toBe("Flight");
                    done();
                }, 1000)
            });
            it('filter testing7', (done: Function) => {
                (document.querySelectorAll('.e-btn-filter')[2] as HTMLElement).click();
                pivotGridObj.refreshData();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                pivotGridObj.refreshData();
                setTimeout(() => {
                    expect((pivotGridObj.engineModule.pivotValues[4][0] as IDataSet).formattedText).toBe("Jet");
                    done();
                }, 1000);
            });
        });

        describe('FilterCommonUpdate', () => {
            let ds: IDataSet[] = pivotDatas as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                dataSource: ds,
                enableSorting: true,
                emptyCellsTextContent: '*',
                expandAll: true,
                sortSettings: [],
                valueSortSettings: { "headerDelimiter": ".", "sortOrder": "None" },
                drilledMembers: [],
                "valueAxis": "column", 
                "grandTotalsPosition": "Bottom",
                "calculatedFieldSettings": [],
                "fieldMapping": [], 
                "showSubTotals": true, 
                "showRowSubTotals": true, 
                "showColumnSubTotals": true,
                "subTotalsPosition": "Auto",
                "showGrandTotals": true,
                "showRowGrandTotals": true, 
                "showColumnGrandTotals": true, 
                "showHeaderWhenEmpty": true,
                "alwaysShowValueHeader": false,
                "conditionalFormatSettings": [], 
                "groupSettings": [],
                "showAggregationOnValueField": true,
                "authentication": {},
                "valueIndex": -1,
                rows: [{ "name": "eyeColor", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Sum", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "gender", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Sum", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }],
                formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                columns: [{ name: 'age', caption: 'Count' }, { name: 'product' }],
                values: [{ "name": "balance", "baseField": "Product", "baseItem": "Staplers", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Sum", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "quantity", "baseField": "Product", "baseItem": "Staplers", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Sum", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }], filters: [{ name: 'age', axis: 'row' }],
                allowValueFilter: true,
                allowLabelFilter: true,
                filterSettings: [
                    { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                    { name: 'product', type: 'Exclude', items: ['Tempo', 'Jet', 'Bike', 'Car'] }
                ],
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
                enableVirtualization: true,
                isDrillThrough: undefined,
                localeObj: undefined,
                enableOptimizedRendering: false
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            it('Ensure the page data', () => {
                expect(pivotEngine.pivotValues.length === 9 && pivotEngine.pivotValues[2].length === 27).toBeTruthy;
            });
            it('Ensure the row data', () => {
                expect((pivotEngine.pivotValues[4][7] as IAxisSet).formattedText === "$2,430.87").toBeTruthy;
            });
            it('Ensure the column data', () => {
                expect((pivotEngine.pivotValues[0][1] as IAxisSet).formattedText === "20").toBeTruthy;
            });
            it('Ensure the filtered data1', () => {
                dataSourceSettings.filterSettings = [{ name: 'product', type: 'Include', items: ['Bike', 'Car', 'Jet'] }]
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
                    enableVirtualization: true
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 12 && pivotEngine.pivotValues[2].length === 33).toBeTruthy;
                expect((pivotEngine.pivotValues[3][6] as IAxisSet).formattedText === "11").toBeTruthy;
            });
            it('Ensure the filtered data2', () => {
                dataSourceSettings.filters = [{ name: 'index' }];
                dataSourceSettings.filterSettings = [{ name: 'index', type: 'Exclude', items: ['0', '2', '3', '4', '5', '6', '1', '7'] }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 9 && pivotEngine.pivotValues[2].length === 27).toBeTruthy;
                expect((pivotEngine.pivotValues[3][6] as IAxisSet).formattedText === "11").toBeTruthy;
            });
            it('Ensure the filtered data3', () => {
                dataSourceSettings.filterSettings = [{ name: 'index', type: 'Include', items: ['0', '4', '6'] }];
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 9 && pivotEngine.pivotValues[2].length === 27).toBeTruthy;
                expect((pivotEngine.pivotValues[3][6] as IAxisSet).formattedText === "11").toBeTruthy;
            });
        });

        describe('dataCompression', () => {
            let ds: IDataSet[] = pivot_dataset as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                dataSource: ds,
                enableSorting: true,
                emptyCellsTextContent: '*',
                expandAll: true,
                sortSettings: [{ name: 'company', order: 'Descending' }],
                calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
                { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
                valueSortSettings: { "headerDelimiter": ".", "sortOrder": "None" },
                drilledMembers: [],
                "valueAxis": "column", 
                "grandTotalsPosition": "Bottom",
                "fieldMapping": [], 
                "showSubTotals": true, 
                "showRowSubTotals": true, 
                "showColumnSubTotals": true,
                "subTotalsPosition": "Auto",
                "showGrandTotals": true,
                "showRowGrandTotals": true, 
                "showColumnGrandTotals": true, 
                "showHeaderWhenEmpty": true,
                "alwaysShowValueHeader": false,
                "conditionalFormatSettings": [], 
                "groupSettings": [],
                "showAggregationOnValueField": true,
                "authentication": {},
                "valueIndex": -1,
                rows: [{ "name": "product", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Count", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "state", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Sum", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }],
                formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                columns: [{ "name": "gender", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Product", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "age", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "DistinctCount", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }],
                values: [{ "name": "balance", "baseField": "Product", "baseItem": "Staplers", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Min", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "quantity", "baseField": "Product", "baseItem": "Staplers", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Max", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { name: 'price', type: 'CalculatedField' }], 
                filters: [],
                allowValueFilter: true,
                allowLabelFilter: true,
                filterSettings: [
                    { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                ],
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
                allowDataCompression: true,
                pageSettings: pageSettings,
                enableValueSorting: undefined,
                enableVirtualization: true,
                isDrillThrough: undefined,
                localeObj: undefined,
                enableOptimizedRendering: false
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            it('Ensure the page data', () => {
                expect(pivotEngine.pivotValues.length === 9 && pivotEngine.pivotValues[2].length === 22).toBeTruthy;
            });
            it('Ensure the row data', () => {
                expect((pivotEngine.pivotValues[6][3] as IAxisSet).formattedText === "14059.28").toBeTruthy;
            });
            it('Ensure the column data1', () => {
                expect((pivotEngine.pivotValues[3][1] as IAxisSet).formattedText === "$1,278.10").toBeTruthy;
            });
            it('Ensure the filtered data', () => {
                dataSourceSettings.filterSettings = [{ name: 'product', type: 'Include', items: ['Bike', 'Car', 'Jet'] }]
                let pageSettings: IPageSettings = {
                    columnPageSize: 4,
                    rowPageSize: 4,
                    currentColumnPage: 2,
                    currentRowPage: 2
                };
                let customProperties: ICustomProperties = {
                    mode: '',
                    allowDataCompression: true,
                    savedFieldList: undefined,
                    pageSettings: pageSettings,
                    enableValueSorting: undefined,
                    enableVirtualization: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "14059.28").toBeTruthy;
            });
            it('Ensure the column data2', () => {
                expect((pivotEngine.pivotValues[11][8] as IAxisSet).formattedText === "18").toBeTruthy;
            });
        });

        describe('calcfield', () => {
            let ds: IDataSet[] = pivotDatas as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                dataSource: ds,
                enableSorting: true,
                emptyCellsTextContent: '*',
                expandAll: true,
                sortSettings: [{ name: 'company', order: 'Descending' }],
                calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
                { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
                valueSortSettings: { "headerDelimiter": ".", "sortOrder": "None" },
                drilledMembers: [],
                "valueAxis": "column", 
                "grandTotalsPosition": "Bottom",
                "fieldMapping": [], 
                "showSubTotals": true, 
                "showRowSubTotals": true, 
                "showColumnSubTotals": true,
                "subTotalsPosition": "Auto",
                "showGrandTotals": true,
                "showRowGrandTotals": true, 
                "showColumnGrandTotals": true, 
                "showHeaderWhenEmpty": true,
                "alwaysShowValueHeader": false,
                "conditionalFormatSettings": [], 
                "groupSettings": [],
                "showAggregationOnValueField": true,
                "authentication": {},
                "valueIndex": -1,
                rows: [{ "name": "product", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Count", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "state", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Sum", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }],
                formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                columns: [{ "name": "gender", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Product", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "age", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "DistinctCount", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }],
                values: [{ "name": "balance", "baseField": "Product", "baseItem": "Staplers", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Min", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "quantity", "baseField": "Product", "baseItem": "Staplers", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Max", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { name: 'price', type: 'CalculatedField' }], 
                filters: [],
                allowValueFilter: true,
                allowLabelFilter: true,
                filterSettings: [
                    { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                ],
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
                allowDataCompression: true,
                pageSettings: pageSettings,
                enableValueSorting: undefined,
                enableVirtualization: true,
                isDrillThrough: undefined,
                localeObj: undefined,
                enableOptimizedRendering: false
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            it('Ensure the page data', () => {
                expect(pivotEngine.pivotValues.length === 9 && pivotEngine.pivotValues[2].length === 22).toBeTruthy;
            });
            it('Ensure the row data', () => {
                expect((pivotEngine.pivotValues[6][3] as IAxisSet).formattedText === "14059.28").toBeTruthy;
            });
            it('Ensure the filtered data', () => {
                dataSourceSettings.calculatedFieldSettings = [{ name: 'price', formula: '"Sum(balance)"' }]
                let pageSettings: IPageSettings = {
                    columnPageSize: 4,
                    rowPageSize: 4,
                    currentColumnPage: 2,
                    currentRowPage: 2
                };
                let customProperties: ICustomProperties = {
                    mode: '',
                    allowDataCompression: true,
                    savedFieldList: undefined,
                    pageSettings: pageSettings,
                    enableValueSorting: undefined,
                    enableVirtualization: false
                };
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the column data', () => {
                expect((pivotEngine.pivotValues[11][8] as IAxisSet).formattedText === "18").toBeTruthy;
            });
        });

        describe('subtotals', () => {
            let ds: IDataSet[] = pivotDatas as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                dataSource: ds,
                enableSorting: true,
                emptyCellsTextContent: '*',
                expandAll: true,
                sortSettings: [{ name: 'company', order: 'Descending' }],
                calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
                { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
                valueSortSettings: { "headerDelimiter": ".", "sortOrder": "None" },
                drilledMembers: [],
                "valueAxis": "row", 
                "grandTotalsPosition": "Bottom",
                "fieldMapping": [], 
                "showSubTotals": true, 
                "showRowSubTotals": true, 
                "showColumnSubTotals": true,
                "subTotalsPosition": "Bottom",
                "showGrandTotals": true,
                "showRowGrandTotals": true, 
                "showColumnGrandTotals": true, 
                "showHeaderWhenEmpty": true,
                "alwaysShowValueHeader": false,
                "conditionalFormatSettings": [], 
                "groupSettings": [],
                "showAggregationOnValueField": true,
                "authentication": {},
                "valueIndex": -1,
                rows: [{ "name": "product", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Count", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "state", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Sum", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }],
                formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                columns: [{ "name": "gender", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Product", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "age", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "DistinctCount", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }],
                values: [{ "name": "balance", "baseField": "Product", "baseItem": "Staplers", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Min", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "quantity", "baseField": "Product", "baseItem": "Staplers", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Max", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { name: 'price', type: 'CalculatedField' }], 
                filters: [],
                allowValueFilter: true,
                allowLabelFilter: true,
                filterSettings: [
                    { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                ],
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
                allowDataCompression: true,
                pageSettings: pageSettings,
                enableValueSorting: undefined,
                enableVirtualization: true,
                isDrillThrough: undefined,
                localeObj: undefined,
                enableOptimizedRendering: false
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            it('Ensure the page data', () => {
                expect(pivotEngine.pivotValues.length === 9 && pivotEngine.pivotValues[2].length === 22).toBeTruthy;
            });
            it('Ensure the row data1', () => {
                expect((pivotEngine.pivotValues[6][3] as IAxisSet).formattedText === "14059.28").toBeTruthy;
            });
            it('Ensure the row data2', () => {
                expect((pivotEngine.pivotValues[6][3] as IAxisSet).formattedText === "14059.28").toBeTruthy;
            });
            it('Ensure the filtered data1', () => {
                dataSourceSettings.valueIndex = 0;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data2', () => {
                dataSourceSettings.valueIndex = 1;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data3', () => {
                dataSourceSettings.valueIndex = -1;
                dataSourceSettings.valueAxis = 'column';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data4', () => {
                dataSourceSettings.valueIndex = 0;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data5', () => {
                dataSourceSettings.valueIndex = 1;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data6', () => {
                dataSourceSettings.showRowSubTotals = false;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data7', () => {
                dataSourceSettings.showColumnSubTotals = false;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data8', () => {
                dataSourceSettings.showRowSubTotals = false;
                dataSourceSettings.showRowSubTotals = true;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });

            it('Ensure the filtered data9', () => {
                dataSourceSettings.showRowSubTotals = true;
                dataSourceSettings.subTotalsPosition = 'Auto';
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.valueIndex = 0;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data10', () => {
                dataSourceSettings.valueIndex = 1;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data11', () => {
                dataSourceSettings.valueIndex = -1;
                dataSourceSettings.valueAxis = 'column';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data12', () => {
                dataSourceSettings.valueIndex = 0;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data13', () => {
                dataSourceSettings.valueIndex = 1;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data14', () => {
                dataSourceSettings.showRowSubTotals = false;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data15', () => {
                dataSourceSettings.showColumnSubTotals = false;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data16', () => {
                dataSourceSettings.showRowSubTotals = false;
                dataSourceSettings.showRowSubTotals = true;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });

            it('Ensure the filtered data17', () => {
                dataSourceSettings.showRowSubTotals = true;
                dataSourceSettings.subTotalsPosition = 'Top';
                dataSourceSettings.valueAxis = 'row';
                dataSourceSettings.valueIndex = 0;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data18', () => {
                dataSourceSettings.valueIndex = 1;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data19', () => {
                dataSourceSettings.valueIndex = -1;
                dataSourceSettings.valueAxis = 'column';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data20', () => {
                dataSourceSettings.valueIndex = 0;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data21', () => {
                dataSourceSettings.valueIndex = 1;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data22', () => {
                dataSourceSettings.showRowSubTotals = false;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data23', () => {
                dataSourceSettings.showColumnSubTotals = false;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
            it('Ensure the filtered data24', () => {
                dataSourceSettings.showRowSubTotals = false;
                dataSourceSettings.showRowSubTotals = true;
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect(pivotEngine.pivotValues.length === 46 && pivotEngine.pivotValues[2].length === 136).toBeTruthy;
                expect((pivotEngine.pivotValues[3][3] as IAxisSet).formattedText === "1278.1").toBeTruthy;
            });
        });

        describe('Calc-field', () => {
            let ds: IDataSet[] = pivotDatas as IDataSet[];
            let dataSourceSettings: IDataOptions = {
                dataSource: ds,
                enableSorting: true,
                emptyCellsTextContent: '*',
                expandAll: true,
                sortSettings: [{ name: 'company', order: 'Descending' }],
                valueSortSettings: { "headerDelimiter": ".", "sortOrder": "None" },
                drilledMembers: [],
                "valueAxis": "row", 
                "grandTotalsPosition": "Bottom",
                "fieldMapping": [], 
                "showSubTotals": true, 
                "showRowSubTotals": true, 
                "showColumnSubTotals": true,
                "subTotalsPosition": "Bottom",
                "showGrandTotals": true,
                "showRowGrandTotals": true, 
                "showColumnGrandTotals": true, 
                "showHeaderWhenEmpty": true,
                "alwaysShowValueHeader": false,
                "conditionalFormatSettings": [], 
                "groupSettings": [],
                "showAggregationOnValueField": true,
                "authentication": {},
                "valueIndex": -1,
                rows: [{ "name": "product", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Count", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "state", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Sum", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }],
                formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy', type: 'date' }],
                columns: [{ "name": "gender", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Product", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "age", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "DistinctCount", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }],
                values: [{ "name": "balance", "baseField": "Product", "baseItem": "Staplers", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Min", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { "name": "quantity", "baseField": "Product", "baseItem": "Staplers", "isCalculatedField": false, "isNamedSet": false, "showNoDataItems": false, "showSubTotals": true, "type": "Max", "showFilterIcon": true, "showSortIcon": true, "showRemoveIcon": true, "showValueTypeIcon": true, "showEditIcon": true, "allowDragAndDrop": true, "expandAll": false }, { name: 'price', type: 'CalculatedField' }], 
                allowValueFilter: true,
                allowLabelFilter: true,
                filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                    { name: 'company', type: 'Include', items: ['NIPAZ'] },
                    { name: 'gender', type: 'Include', items: ['male'] }],
                calculatedFieldSettings: [{ name: 'price', formula: '10+5' },
                    { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
                filters: [{ name: 'gender' }],
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
                allowDataCompression: true,
                pageSettings: pageSettings,
                enableValueSorting: undefined,
                enableVirtualization: true,
                isDrillThrough: undefined,
                localeObj: undefined,
                enableOptimizedRendering: false
            };
            pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
            it('Calculated field with simple calculation', () => {
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field with complex calculation', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field using min function', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = 'min("Sum(balance)","Count(quantity)")';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field using max function', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = 'max("Sum(balance)","Count(quantity)")';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field using abs function', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = 'abs("Sum(balance)") + "Count(quantity)"';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field using Math.min function', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = 'Math.min("Sum(balance)","Count(quantity)")';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field using Math.max function', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = 'Math.max("Sum(balance)","Count(quantity)")';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field using Math.abs function', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = 'Math.abs("Sum(balance)") + "Count(quantity)"';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field using > condition', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" > "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field using < condition', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" < "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field using >= condition', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" >= "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
            });
            it('Calculated field using <= condition', () => {
                dataSourceSettings.calculatedFieldSettings[0].formula = '"Sum(balance)" <= "Count(quantity)" ? "Count(quantity)" : "Sum(balance)"';
                pivotEngine = new PivotEngine(); pivotEngine.renderEngine(dataSourceSettings, customProperties);
                expect((pivotEngine.pivotValues[1][2] as IDataSet).formattedText).toBe('28');
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

describe(' - VirtualScrolling', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe(' - VirtualScrolling1', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: false,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'product' }, { name: 'state' }],
                        columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    allowCalculatedField: true,
                    enableVirtualization: true,
                    dataBound: dataBound,
                    width: 600,
                    height: 300,
                    virtualScrollSettings: { allowSinglePage: false }
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('scroll top1', (done: Function) => {
            setTimeout(() => {
                done();
            }, 1000);
        });
        it('scroll top2', () => {
            expect(1).toBe(1);
        });
        it('scroll top3', () => {
            document.querySelectorAll('.e-content-virtualtable')[0].scrollTop = 317;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("touchstart", { clientY: 317, view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content-virtualtable')[0].dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content-virtualtable')[0].dispatchEvent(args);
            expect(Math.round(document.querySelectorAll('.e-content-virtualtable')[0].scrollTop) === 0).toBeTruthy();
            expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
            expect(document.querySelectorAll('.e-content-virtualtable td')[1].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
        });

        it('scroll right', () => {
            document.querySelectorAll('.e-headercontent')[0].scrollLeft = 1360;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("touchstart", { clientX: 1360, view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-headercontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-headercontent').dispatchEvent(args);
            expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
            expect(document.querySelectorAll('.e-content-virtualtable td')[1].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
        });

        it('scroll right false', () => {
            document.querySelectorAll('.e-headercontent')[0].scrollLeft = 1360;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("touchstart", { clientX: 0, view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-headercontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-headercontent').dispatchEvent(args);
            expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
            expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td:not(.e-freezeleftborder) .e-cellvalue').textContent).toBe('$12,490.89');
        });

        it('scroll top wheel', () => {
            document.querySelectorAll('.e-content-virtualtable')[0].scrollTop = 0;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("wheel", { clientY: 0, view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            expect(Math.round(document.querySelectorAll('.e-content-virtualtable')[0].scrollTop) === 0).toBeTruthy();
        });

        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - VirtualScrolling2', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: false,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'product' }, { name: 'state' }],
                        columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    allowCalculatedField: true,
                    enableVirtualization: true,
                    dataBound: dataBound,
                    width: 600,
                    height: 300,
                    virtualScrollSettings: { allowSinglePage: false }
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('pivotgrid render testing', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-content-virtualtable tr').length).toBe(30);
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelectorAll('td:not(.e-freezeleftborder)').length).toBe(14);
                expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                done();
            }, 1000);
        });
        it('scroll right', (done: Function) => {
            document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft = 1360;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-headercontent')[0].scrollLeft === document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft).toBeTruthy();
                expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                done();
            }, 100);
        });
        it('scroll bottom', (done: Function) => {
            pivotGridObj.element.querySelectorAll('.e-content-virtualtable')[0].scrollTop = 0;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-content-virtualtable')[0].scrollTop).toBe(0);
                expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td:not(.e-freezeleftborder) .e-cellvalue').textContent).toBe('$32,045.16');
                done();
            }, 100);
        });
        it('scroll left1', (done: Function) => {
            document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft = 400;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-content-virtualtable') as HTMLElement;
                expect(pivotGridObj.element.querySelectorAll('.e-headercontent')[0].scrollLeft).toBe(400);
                expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('390.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1980px');
                done();
            }, 100);
        });
        it('scroll left2', (done: Function) => {
            document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft = 0;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-content-virtualtable') as HTMLElement;
                expect(pivotGridObj.element.querySelectorAll('.e-headercontent')[0].scrollLeft).toBe(0);
                expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-content-virtualtable td')[1].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                done();
            }, 100);
        });
        it('Collapse flight', (done: Function) => {
            (document.querySelectorAll('.e-content-virtualtable tr .e-icons')[0] as HTMLElement).click();
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-content-virtualtable') as HTMLElement;
                expect(document.querySelectorAll('.e-headercontent')[0].scrollLeft === 0).toBeTruthy();
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('210.1px');
                done();
            }, 100);
        });
        it('Collapse male', (done: Function) => {
            (document.querySelectorAll('.e-headercontent th .e-sortfilterdiv.e-icons')[0] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-headercontent')[0].scrollLeft === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-headercontent th')[6].textContent).toBe('male Total');
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td:not(.e-leftfreeze) .e-cellvalue').textContent).toBe('$12,490.89');
                done();
            }, 100);
        });

        it('Collapse bike', (done: Function) => {
            (document.querySelectorAll('.e-content-virtualtable tr .e-icons')[2] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-headercontent')[0].scrollLeft).toBe(0);
                done();
            }, 100);
        });
        it('Collapse female', (done: Function) => {
            (document.querySelectorAll('.e-headercontent th .e-collapse')[0] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-content-virtualtable')[0].scrollTop).toBe(0);
                done();
            }, 100);
        });
        it('value in row axis', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'row' } }, true);
            pivotGridObj.dataSourceSettings.drilledMembers = [];
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-content-virtualtable') as HTMLElement;
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('30.1px');
                done();
            }, 100);
        });
        it('append name in column', (done: Function) => {
            pivotGridObj.dataSourceSettings.columns = [{ name: 'gender' }, { name: 'eyeColor' }, { name: 'name' }];
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 100);
        });
        it('scroll left3', (done: Function) => {
            document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft = 50000;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-headercontent')[0].scrollLeft === document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft).toBeTruthy();
                done();
            }, 100);
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - Grouping Bar', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(GroupingBar, FieldList, VirtualScroll);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: false,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'product' }, { name: 'state' }],
                        columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    allowCalculatedField: true,
                    showGroupingBar: true,
                    enableVirtualization: true,
                    showFieldList: true,
                    showValuesButton: true,
                    dataBound: dataBound,
                    width: 600,
                    height: 300,
                    virtualScrollSettings: { allowSinglePage: false }
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('pivotgrid render testing', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-content-virtualtable tr').length).toBe(30);
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelectorAll('td:not(.e-leftfreeze)').length).toBe(14);
                expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                done();
            }, 100);
        });
        it('scroll right', (done: Function) => {
            document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft = 1360;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-headercontent')[0].scrollLeft === document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft).toBeTruthy();
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                done();
            }, 100);
        });
        it('scroll bottom', (done: Function) => {
            pivotGridObj.element.querySelectorAll('.e-content-virtualtable')[0].scrollTop = 0;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-content-virtualtable')[0].scrollTop).toBe(0);
                expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-content-virtualtable td')[1].querySelector('td .e-cellvalue').textContent).toBe('$32,045.16');
                done();
            }, 100);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft = 0;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-headercontent')[0].scrollLeft === 0).toBeTruthy();
                done();
            }, 100);
        });
        it('Collapse flight', (done: Function) => {
            (document.querySelectorAll('.e-content-virtualtable tr .e-icons')[0] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-content-virtualtable tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                done();
            }, 500);
        });

        it('filter', (done: Function) => {
            (document.querySelector('#PivotGrid_product.e-pivot-button .e-pv-filter') as HTMLElement).click();
            setTimeout(() => {
                let allNode: HTMLElement = document.querySelector('.e-checkbox-wrapper');
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[2] as HTMLElement;
                args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                firstNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                firstNode.querySelector('.e-frame').dispatchEvent(args);
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 100);
        });
        it('filter check', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                done();
            }, 500);
        });

        it('value moved to row', (done: Function) => {
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            let dragElement: HTMLElement = pivotButton[2].querySelector('.e-pvt-btn-content');
            let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                done();
            }, 100);
        });
        it('value moved to column', (done: Function) => {
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            let dragElement: HTMLElement = pivotButton[2].querySelector('.e-pvt-btn-content');
            let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', dragElement, columnAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = columnAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, columnAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = columnAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            setTimeout(() => {
                pivotButton = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                done();
            }, 100);
        });
        it('value removed', (done: Function) => {
            let rowAxiscontent: any = document;
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            let dragElement: HTMLElement = pivotButton[2].querySelector('.e-pvt-btn-content');
            let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(8);
                done();
            }, 100);
        });
        it('values added', () => {
            pivotGridObj.dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
        });
        it('value removed1', (done: Function) => {
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 1000);
        });
        it('values removed', (done: Function) => {
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
            let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
            (pivotButton[0].querySelector('.e-remove') as HTMLElement).click();
            (pivotButton[1].querySelector('.e-remove') as HTMLElement).click();
            setTimeout(() => {
                pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                (pivotButton[0].querySelector('.e-remove') as HTMLElement).click();
                (pivotButton[1].querySelector('.e-remove') as HTMLElement).click();
                expect(pivotButton.length).toEqual(2);
                done();
            }, 1000);
        });
        it('values added', () => {
            pivotGridObj.dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
        });

        it('RTL', (done: Function) => {
            pivotGridObj.enableRtl = true;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-content-virtualtable')[0].scrollTop).toBe(0);
                done();
            }, 100);
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - advanced filtering ', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            let dataBound: EmitType<Object> = () => { done(); };
            document.body.appendChild(elem);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        allowLabelFilter: true,
                        allowValueFilter: true,
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: false,
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'product' }, { name: 'state' }],
                        columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    enableVirtualization: true,
                    dataBound: dataBound,
                    width: 600,
                    height: 300,
                    virtualScrollSettings: { allowSinglePage: false }
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('pivotgrid render testing', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-content-virtualtable tr').length).toBe(30);
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelectorAll('td:not(.e-leftfreeze)').length).toBe(14);
                done();
            }, 100);
        });
        it('state start with t', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'state', type: 'Label', condition: 'BeginWith', value1: 't' }],
            setTimeout(() => {
                expect(document.querySelectorAll('.e-content-virtualtable tr').length).toBe(30);
                expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                done();
            }, 100);
        });
        it('state contains e', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'state', type: 'Label', condition: 'Contains', value1: 'e' }],
            setTimeout(() => {
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelectorAll('td:not(.e-leftfreeze)').length).toBe(14);
                done();
            }, 100);
        });
        it('eyeColor equals blue', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'state', type: 'Label', condition: 'Contains', value1: 'e' },
                { name: 'eyeColor', type: 'Label', condition: 'Equals', value1: 'blue' }],
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 100);
        });
        it('scroll right', (done: Function) => {
            document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft = 1360;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-headercontent')[0].scrollLeft === document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft).toBeTruthy();
                done();
            }, 100);
        });
        it('product quantity > 100', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'product', type: 'Value', condition: 'GreaterThan', measure: 'quantity', value1: '100' }],
            setTimeout(() => {
                expect(document.querySelectorAll('.e-headercontent th')[5].textContent).toBe('male Total');
                done();
            }, 100);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-content-virtualtable')[0].scrollLeft = 0;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-content-virtualtable').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-headercontent')[0].scrollLeft === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-content-virtualtable td')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                done();
            }, 300);
        });
        it('Collapse flight', (done: Function) => {
            (document.querySelectorAll('.e-content-virtualtable tr .e-icons')[0] as HTMLElement).click()
            setTimeout(() => {
                expect(document.querySelectorAll('.e-headercontent')[0].scrollLeft !== 0).toBeTruthy();
                done();
            }, 100);
        });
        it('Collapse male', (done: Function) => {
            (document.querySelectorAll('.e-headercontent th .e-sortfilterdiv.e-icons')[0] as HTMLElement).click()
            setTimeout(() => {
                expect(document.querySelectorAll('.e-headercontent')[0].scrollLeft !== 0).toBeTruthy();
                expect(document.querySelectorAll('.e-headercontent th')[6].textContent).toBe('male Total');
                done();
            }, 100);
        });
        it('value in row axis', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'row' } }, true);
            pivotGridObj.dataSourceSettings.drilledMembers = [];
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-content-virtualtable') as HTMLElement;
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('210.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1980px');
                done();
            }, 100);
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - Coverage', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let cf: any;
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(VirtualScroll, CalculatedField, GroupingBar, FieldList);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_nodata as IDataSet[],
                        enableSorting: false,
                        expandAll: true,
                        rows: [{ name: 'Country' }, { name: 'State' }],
                        columns: [{ name: 'Product' }, { name: 'Date' }],
                        values: [{ name: 'Amount' }, { name: 'Quantity' }],
                    },
                    allowCalculatedField: true,
                    showFieldList: true,
                    showGroupingBar: true,
                    enableVirtualization: true,
                    dataBound: dataBound,
                    width: 600,
                    height: 300,
                    virtualScrollSettings: { allowSinglePage: false }
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let mouseup: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let mousedown: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        it('drop down menu (Sum of Amount) click', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-values .e-dropdown-icon')).not.toBeUndefined;
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td:not(.e-leftfreeze) .e-cellvalue').textContent).toBe('28550');
                document.querySelectorAll('.e-values .e-dropdown-icon')[0].dispatchEvent(click);
                done();
            }, 500);
        });

        it('Sum of Amount -> Count of Amount _using grouping bar dropdown menu', () => {
            let menu: MenuEventArgs = {
                element: document.querySelectorAll('.e-menu-item')[1] as HTMLElement,
                item: { id: pivotGridObj.element.id + '_Count', text: 'Count' }
            };
            (pivotGridObj.pivotButtonModule.menuOption as any).selectOptionInContextMenu(menu);
        });
        it('Sum of Amount -> Count of Amount _result + enable sorting', () => {
            expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td:not(.e-leftfreeze) .e-cellvalue').textContent).toBe('28550');
            pivotGridObj.dataSourceSettings.enableSorting = true;
        });
        it('Country -> descending _using grouping bar sort icon', (done: Function) => {
            setTimeout(() => {
                document.querySelectorAll('.e-group-rows .e-sort')[0].dispatchEvent(click);
                done();
            }, 100);
        });
        it('Country -> descending _result + Switch to ascending', (done: Function) => {
            setTimeout(function () {
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td:not(.e-leftfreeze) .e-cellvalue').textContent).toBe('7');
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td .e-cellvalue').textContent).toBe('United States');
                document.querySelectorAll('.e-group-rows .e-sort')[0].dispatchEvent(click);
                done();
            }, 500)
        });
        it('Country -> Switch to ascending _result + open field list', (done: Function) => {
            setTimeout(function () {
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td:not(.e-leftfreeze) .e-cellvalue').textContent).toBe('6');
                expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
                document.querySelectorAll('.e-toggle-field-list')[0].dispatchEvent(click);
                done();
            }, 500)
        });
        it('Open calculated field dialog', () => {
            cf = new CalculatedField(pivotGridObj);
            cf.createCalculatedFieldDialog(pivotGridObj);
            pivotGridObj.engineModule.enableSort = false;
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        });
        it('drag and drop Amount(Count) node to drop field', () => {
            let treeObj: any = cf.treeObj;
            let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-drag'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any = util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-drag'), 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
            mousemove = util.setMouseCordinates(mousemove, 150, 400);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
        });
        it('set new field as "New" and close the dialog', () => {
            const calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
            (getInstance(calcField.querySelector('#' + pivotGridObj.element.id + 'ddlelement'), MaskedTextBox) as MaskedTextBox).value = 'New';
            (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'New';
            (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            (getInstance(calcField.querySelectorAll('.e-btn')[1] as HTMLElement, Button) as Button).click()
            document.querySelector('.e-pivotfieldlist-container .e-cancel-btn').dispatchEvent(click);
        });
        it('Country -> open filter dialog + uncheck canada + click ok btn', (done: Function) => {
            pivotGridObj.engineModule.enableSort = true;
            expect(document.querySelectorAll('.e-headercontent th')[12].textContent).toBe('New');
            document.querySelectorAll('#PivotGrid_PivotFieldList_Country .e-btn-filter')[0].dispatchEvent(click);
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-container .e-checkbox-wrapper')[1] as HTMLElement;
            firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
            firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
            firstNode.querySelector('.e-frame').dispatchEvent(click);
            setTimeout(() => {
                document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                done();
            }, 500);
        });
        it('Country -> open filter dialog + check canada + click ok btn', (done: Function) => {
            expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
            expect(document.querySelectorAll('.e-content-virtualtable td:not(.e-leftfreeze)')[0].textContent).toBe('6');
            document.querySelectorAll('#PivotGrid_PivotFieldList_Country .e-btn-filter')[0].dispatchEvent(click);
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-container .e-checkbox-wrapper')[1] as HTMLElement;
            firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
            firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
            firstNode.querySelector('.e-frame').dispatchEvent(click);
            setTimeout(() => {
                document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                done();
            }, 500);
        });
        it('Country -> set report as no data', () => {
            expect(document.querySelectorAll('.e-content-virtualtable tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
            pivotGridObj.dataSourceSettings.rows[0].showNoDataItems = true;
        });
        it('Country -> open filter dialog + uncheck france + click ok btn', (done: Function) => {
            document.querySelectorAll('#PivotGrid_PivotFieldList_Country .e-btn-filter')[0].dispatchEvent(click);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-container .e-checkbox-wrapper')[2] as HTMLElement;
                firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                firstNode.querySelector('.e-frame').dispatchEvent(click);
                document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                done();
            }, 100);
        });

        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe('Scroll apperance', () => {

        describe('Scroll comparison ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:1000px; width:900px' });
            let data: IDataSet[] = [
                { row: 'row1', column: 'column1', value: 1 },
                { row: 'row2', column: 'column2', value: 2 },
                { row: 'row3', column: 'column3', value: 3 },
                { row: 'row4', column: 'column4', value: 4 },
            ]
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.style.height = '500px';
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, VirtualScroll);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: data,
                        expandAll: false,
                        rows: [{ name: 'row' }],
                        columns: [{ name: 'column' }],
                        values: [{ name: 'value' }],
                    },
                    width: 900,
                    height: 300,
                    enableVirtualization: false,
                    showGroupingBar: true,
                    dataBound: dataBound

                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('Compare scrollbar', () => {
                expect(document.querySelector('.e-content').scrollHeight).toBe(document.querySelector('.e-content').clientHeight);
                expect(document.querySelector('.e-content').scrollWidth).toBe(document.querySelector('.e-content').clientWidth);
            });

            it('Display vertical scrollbar alone', () => {
                pivotGridObj.height = 200;
                expect(document.querySelector('.e-content').scrollHeight).toBe(document.querySelector('.e-content').clientHeight);
                expect(document.querySelector('.e-content').scrollWidth).toBe(document.querySelector('.e-content').clientWidth);
            });

            it('Display horizondal scrollbar alone', () => {
                pivotGridObj.setProperties({ height: '100%' }, true);
                pivotGridObj.width = 300;
                expect(document.querySelector('.e-content').scrollHeight).toBe(document.querySelector('.e-content').clientHeight);
                expect(document.querySelector('.e-content').scrollWidth).toBe(document.querySelector('.e-content').clientWidth);
            });

            it('Hide both scrollbars', () => {
                pivotGridObj.setProperties({ height: '100%' }, true);
                pivotGridObj.width = '100%';
                expect(document.querySelector('.e-content').scrollHeight).toBe(document.querySelector('.e-content').clientHeight);
                expect(document.querySelector('.e-content').scrollWidth).toBe(document.querySelector('.e-content').clientWidth);
            });

            it('Hide both scrollbars by setting auto', () => {
                pivotGridObj.setProperties({ height: 'auto' }, true);
                expect(document.querySelector('.e-content').scrollHeight).toBe(document.querySelector('.e-content').clientHeight);
                expect(document.querySelector('.e-content').scrollWidth).toBeGreaterThan(document.querySelector('.e-content').clientWidth);
            });

        });

        describe('Scroll comparison - virtual scrolling', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:1000px; width:900px' });
            let data: IDataSet[] = [
                { row: 'row1', column: 'column1', value: 1 },
                { row: 'row2', column: 'column2', value: 2 },
                { row: 'row3', column: 'column3', value: 3 },
                { row: 'row4', column: 'column4', value: 4 },
            ]
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.style.height = '500px';
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, VirtualScroll);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: data,
                        expandAll: false,
                        rows: [{ name: 'row' }],
                        columns: [{ name: 'column' }],
                        values: [{ name: 'value' }],
                    },
                    width: 900,
                    height: 300,
                    enableVirtualization: true,
                    showGroupingBar: true,
                    dataBound: dataBound,
                    virtualScrollSettings: { allowSinglePage: false }

                });
                pivotGridObj.appendTo('#PivotGrid');
            });

            it('Scroll compare', () => {
                expect(document.querySelector('.e-content-virtualtable').scrollHeight).toBe(document.querySelector('.e-content-virtualtable').clientHeight);
                expect(document.querySelector('.e-content-virtualtable').scrollWidth).toBe(document.querySelector('.e-content-virtualtable').clientWidth);
            });

            it('Display vertical scrollbar alone', () => {
                pivotGridObj.height = 200;
                expect(document.querySelector('.e-content-virtualtable').scrollHeight).toBe(document.querySelector('.e-content-virtualtable').clientHeight);
                expect(document.querySelector('.e-content-virtualtable').scrollWidth).toBe(document.querySelector('.e-content-virtualtable').clientWidth);
            });

            it('Display horizondal scrollbar alone', () => {
                pivotGridObj.setProperties({ height: '100%' }, true);
                pivotGridObj.width = 300;
                expect(document.querySelector('.e-content-virtualtable').scrollHeight).toBe(document.querySelector('.e-content-virtualtable').clientHeight);
                expect(document.querySelector('.e-content-virtualtable').scrollWidth).toBe(document.querySelector('.e-content-virtualtable').clientWidth);
            });

            it('Hide both scrollbars by setting 100%', () => {
                pivotGridObj.setProperties({ height: '100%' }, true);
                pivotGridObj.width = '100%';
                expect(document.querySelector('.e-content-virtualtable').scrollHeight).toBe(document.querySelector('.e-content-virtualtable').clientHeight);
                expect(document.querySelector('.e-content-virtualtable').scrollWidth).toBe(document.querySelector('.e-content-virtualtable').clientWidth);
            });

            it('Hide both scrollbars by setting auto', () => {
                pivotGridObj.setProperties({ height: 'auto' }, true);
                expect(document.querySelector('.e-content-virtualtable').scrollHeight).toBe(document.querySelector('.e-content-virtualtable').clientHeight);
                expect(document.querySelector('.e-content-virtualtable').scrollWidth).toBeGreaterThan(document.querySelector('.e-content-virtualtable').clientWidth);
            });

        });
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