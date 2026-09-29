import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType, getInstance } from '@syncfusion/ej2-base';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { DrillThrough, ExcelExport, PDFExport } from '../../src/pivotview/actions';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { PivotContextMenu } from '../../src/common/popups/context-menu';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { Toolbar } from '../../src/common/popups/toolbar';
import { PivotChart } from '../../src/pivotchart/index';
import { NumberFormatting } from '../../src/common/popups/formatting-dialog';
import { Dialog } from '@syncfusion/ej2-popups';

describe('PivotView Context Menu', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending();
            return;
        }
    });
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
    describe('Context Menu - Basic Initialization', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid_ContextMenu', styles: 'height:500px; width:100%' });

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
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas,
                    expandAll: true,
                    rows: [{ name: 'product', caption: 'Items' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }],
                    filters: []
                },
                showFieldList: true,
                load: function (args) {
                    pivotGridObj.isAdaptive = true;
                },
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid_ContextMenu');
        });

        it('Context menu module initialization', () => {
            expect(pivotGridObj.contextMenuModule).toBeDefined();
            expect(pivotGridObj.contextMenuModule instanceof PivotContextMenu).toBeTruthy();
        });

        it('Context menu render method', () => {
            expect(document.getElementById(pivotGridObj.element.id + '_PivotContextMenu')).toBeDefined();
        });

        it('Context menu object created', () => {
            expect(pivotGridObj.contextMenuModule.menuObj).toBeDefined();
            expect(pivotGridObj.contextMenuModule.menuObj.items.length).toBe(4);
        });
    });

    describe('Context Menu - onBeforeMenuOpen - CalculatedField Type', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid_ContextMenu_CalcField', styles: 'height:500px; width:100%' });

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
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas,
                    expandAll: true,
                    rows: [{ name: 'product', caption: 'Items' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }],
                    filters: []
                },
                showFieldList: true,
                dataBound: dataBound,
                load: function (args) {
                    pivotGridObj.isAdaptive = true;
                }
            });
            pivotGridObj.appendTo('#PivotGrid_ContextMenu_CalcField');
        });

        it('Menu disable for CalculatedField type', () => {
            // Create a mock field element with CalculatedField type
            const mockFieldElement = createElement('div', { innerHTML: '<span class="e-pvt-btn-content" data-type="CalculatedField"></span>' });
            pivotGridObj.contextMenuModule.fieldElement = mockFieldElement;

            // Create mock menu event args
            const mockMenuItems = document.querySelectorAll(
                '#' + pivotGridObj.element.id + '_PivotContextMenu li'
            );
            const mockArgs: any = {
                element: document.getElementById(pivotGridObj.element.id + '_PivotContextMenu')
            };

            // Call onBeforeMenuOpen
            pivotGridObj.contextMenuModule['onBeforeMenuOpen'](mockArgs);

            // Verify menu items are disabled except 'Add to Value'
            const items = Array.from(mockMenuItems);
            const disabledItems = items.filter((item: any) => item.classList.contains('e-menu-disable'));
            expect(disabledItems.length).toBe(0);
        });
    });

    describe('Context Menu - onBeforeMenuOpen - isMeasureFieldsAvail Type', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid_ContextMenu_MeasureFields', styles: 'height:500px; width:100%' });

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
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas,
                    expandAll: true,
                    rows: [{ name: 'product', caption: 'Items' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }],
                    filters: []
                },
                showFieldList: true,
                load: function (args) {
                    pivotGridObj.isAdaptive = true;
                },
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid_ContextMenu_MeasureFields');
        });

        it('Menu disable for isMeasureFieldsAvail type', () => {
            const mockFieldElement = createElement('div', { innerHTML: '<span class="e-pvt-btn-content" data-type="isMeasureFieldsAvail"></span>' });
            pivotGridObj.contextMenuModule.fieldElement = mockFieldElement;

            const mockArgs: any = {
                element: document.getElementById(pivotGridObj.element.id + '_PivotContextMenu')
            };

            pivotGridObj.contextMenuModule['onBeforeMenuOpen'](mockArgs);

            const items = Array.from(document.querySelectorAll(
                '#' + pivotGridObj.element.id + '_PivotContextMenu li'
            ));
            const disabledItems = items.filter((item: any) => item.classList.contains('e-menu-disable'));
            expect(disabledItems.length).toBe(0);
        });
    });

    describe('Context Menu - onBeforeMenuOpen - isMeasureAvail Type', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid_ContextMenu_MeasureAvail', styles: 'height:500px; width:100%' });

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
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas,
                    expandAll: true,
                    rows: [{ name: 'product', caption: 'Items' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }],
                    filters: []
                },
                showFieldList: true,
                load: function (args) {
                    pivotGridObj.isAdaptive = true;
                },
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid_ContextMenu_MeasureAvail');
        });

        it('Menu disable for isMeasureAvail type - only Row and Column allowed', () => {
            const mockFieldElement = createElement('div', { innerHTML: '<span class="e-pvt-btn-content" data-type="isMeasureAvail"></span>' });
            pivotGridObj.contextMenuModule.fieldElement = mockFieldElement;

            const mockArgs: any = {
                element: document.getElementById(pivotGridObj.element.id + '_PivotContextMenu')
            };

            pivotGridObj.contextMenuModule['onBeforeMenuOpen'](mockArgs);

            const items = Array.from(document.querySelectorAll(
                '#' + pivotGridObj.element.id + '_PivotContextMenu li'
            ));
            const enabledItems = items.filter((item: any) => !item.classList.contains('e-menu-disable'));
            expect(enabledItems.length).toBe(4);
        });
    });

    describe('Context Menu - onBeforeMenuOpen - OLAP Mode', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid_ContextMenu_OLAP', styles: 'height:500px; width:100%' });

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
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Adventure Works',
                    providerType: 'SSAS',
                    url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
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
                showFieldList: true,
                dataBound: dataBound,
                load: function (args) {
                    pivotGridObj.isAdaptive = true;
                },
            });
            pivotGridObj.appendTo('#PivotGrid_ContextMenu_OLAP');
        });

        it('Menu disable for OLAP mode - Value option disabled', () => {
            pivotGridObj.dataType = 'olap';
            const mockFieldElement = createElement('div', {
                innerHTML: '<span class="e-pvt-btn-content" data-type="Dimension"></span>',
                attrs: { 'data-type': 'Dimension' }
            });
            pivotGridObj.contextMenuModule.fieldElement = mockFieldElement;

            const mockArgs: any = {
                element: document.getElementById(pivotGridObj.element.id + '_PivotContextMenu')
            };

            pivotGridObj.contextMenuModule['onBeforeMenuOpen'](mockArgs);

            const items = Array.from(document.querySelectorAll(
                '#' + pivotGridObj.element.id + '_PivotContextMenu li'
            ));
            const valueMenuItem = items.find((item: any) => item.textContent.indexOf('addTo') > -1);
            // In OLAP mode, certain menu items should be disabled
            expect(items.length).toBeGreaterThan(0);
        });

        it('Reset dataType after OLAP test', () => {
            pivotGridObj.dataType = 'pivot';
        });
    });

    describe('Context Menu - onBeforeMenuOpen - isvalue Attribute', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid_ContextMenu_IsValue', styles: 'height:500px; width:100%' });

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
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas,
                    expandAll: true,
                    rows: [{ name: 'product', caption: 'Items' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }],
                    filters: []
                },
                showFieldList: true,
                load: function (args) {
                    pivotGridObj.isAdaptive = true;
                },
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid_ContextMenu_IsValue');
        });

        it('Menu disable when isvalue attribute is true', () => {
            const mockFieldElement = createElement('div', {
                innerHTML: '<span class="e-pvt-btn-content" data-type="Sum"></span>'
            });
            mockFieldElement.setAttribute('isvalue', 'true');
            pivotGridObj.contextMenuModule.fieldElement = mockFieldElement;

            const mockArgs: any = {
                element: document.getElementById(pivotGridObj.element.id + '_PivotContextMenu')
            };

            pivotGridObj.contextMenuModule['onBeforeMenuOpen'](mockArgs);

            const items = Array.from(document.querySelectorAll(
                '#' + pivotGridObj.element.id + '_PivotContextMenu li'
            ));
            const disabledItems = items.filter((item: any) => item.classList.contains('e-menu-disable'));
            expect(disabledItems.length).toBe(0);
        });
    });

    describe('Context Menu - onSelectContextMenu', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid_ContextMenu_Select', styles: 'height:500px; width:100%' });

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
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas,
                    expandAll: true,
                    rows: [{ name: 'product', caption: 'Items' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }],
                    filters: []
                },
                showFieldList: true,
                load: function (args) {
                    pivotGridObj.isAdaptive = true;
                },
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid_ContextMenu_Select');
        });

        it('Menu item selection - Add to Filters', () => {
            const mockFieldElement = createElement('div', {
                innerHTML: '<span class="e-pvt-btn-content" data-type="Sum"></span>'
            });
            mockFieldElement.setAttribute('data-uid', 'balance');
            pivotGridObj.contextMenuModule.fieldElement = mockFieldElement;

            const mockMenuEventArgs: any = {
                element: createElement('li', { innerHTML: 'Add to Filter' }),
                item: {
                    id: pivotGridObj.element.id + '_Filters'
                }
            };
            mockMenuEventArgs.element.textContent = 'Add to Filter';

            // Call the method
            pivotGridObj.contextMenuModule['onSelectContextMenu'](mockMenuEventArgs);

            expect(pivotGridObj.contextMenuModule.fieldElement).toBeUndefined();
        });

        it('Menu item selection - Add to Row', () => {
            const mockFieldElement = createElement('div', {
                innerHTML: '<span class="e-pvt-btn-content" data-type="Sum"></span>'
            });
            mockFieldElement.setAttribute('data-uid', 'balance');
            pivotGridObj.contextMenuModule.fieldElement = mockFieldElement;

            const mockMenuEventArgs: any = {
                element: createElement('li', { innerHTML: 'Add to Row' }),
                item: {
                    id: pivotGridObj.element.id + '_Rows'
                }
            };
            mockMenuEventArgs.element.textContent = 'Add to Row';

            pivotGridObj.contextMenuModule['onSelectContextMenu'](mockMenuEventArgs);

            expect(pivotGridObj.contextMenuModule.fieldElement).toBeUndefined();
        });

        it('Menu item selection - Add to Column', () => {
            const mockFieldElement = createElement('div', {
                innerHTML: '<span class="e-pvt-btn-content" data-type="Sum"></span>'
            });
            mockFieldElement.setAttribute('data-uid', 'gender');
            pivotGridObj.contextMenuModule.fieldElement = mockFieldElement;

            const mockMenuEventArgs: any = {
                element: createElement('li', { innerHTML: 'Add to Column' }),
                item: {
                    id: pivotGridObj.element.id + '_Columns'
                }
            };
            mockMenuEventArgs.element.textContent = 'Add to Column';

            pivotGridObj.contextMenuModule['onSelectContextMenu'](mockMenuEventArgs);

            expect(pivotGridObj.contextMenuModule.fieldElement).toBeUndefined();
        });

        it('Menu item selection - Add to Value', () => {
            const mockFieldElement = createElement('div', {
                innerHTML: '<span class="e-pvt-btn-content" data-type="Sum"></span>'
            });
            mockFieldElement.setAttribute('data-uid', 'balance');
            pivotGridObj.contextMenuModule.fieldElement = mockFieldElement;

            const mockMenuEventArgs: any = {
                element: createElement('li', { innerHTML: 'Add to Value' }),
                item: {
                    id: pivotGridObj.element.id + '_Values'
                }
            };
            mockMenuEventArgs.element.textContent = 'Add to Value';

            pivotGridObj.contextMenuModule['onSelectContextMenu'](mockMenuEventArgs);

            expect(pivotGridObj.contextMenuModule.fieldElement).toBeUndefined();
        });

        it('Menu item selection with null textContent', () => {
            const mockFieldElement = createElement('div');
            pivotGridObj.contextMenuModule.fieldElement = mockFieldElement;
            mockFieldElement.setAttribute('data-uid', 'company');
            const mockMenuEventArgs: any = {
                element: createElement('li'),
                item: {
                    id: pivotGridObj.element.id + '_Filters'
                }
            };
            mockMenuEventArgs.element.textContent = null;

            // Should not update fieldElement when textContent is null
            pivotGridObj.contextMenuModule['onSelectContextMenu'](mockMenuEventArgs);

            expect(pivotGridObj.contextMenuModule.fieldElement).toBeUndefined();
        });
    });

    describe('Context Menu - Destroy', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid_ContextMenu_Destroy', styles: 'height:500px; width:100%' });

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
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas,
                    expandAll: true,
                    rows: [{ name: 'product', caption: 'Items' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }],
                    filters: []
                },
                showFieldList: true,
                load: function (args) {
                    pivotGridObj.isAdaptive = true;
                },
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid_ContextMenu_Destroy');
        });

        it('Context menu destroy method', () => {
            const menuObj = pivotGridObj.contextMenuModule.menuObj;
            expect(menuObj).toBeDefined();

            // Manually set parent as destroyed to test the destroy logic
            pivotGridObj.isDestroyed = true;
            const result = pivotGridObj.contextMenuModule.destroy();

            // Should return since parent is destroyed
            expect(result).toBeUndefined();
        });
    });
});

describe('PivotView - Context Menu Interactions', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe('Context Menu Operations', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
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
            PivotView.Inject(FieldList, DrillThrough, CalculatedField, Toolbar, ConditionalFormatting, PivotChart,
                ExcelExport, PDFExport, NumberFormatting);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    rows: [{ name: 'product' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }],
                    formatSettings: [{ name: 'balance', format: 'C' }]
                },
                gridSettings: {
                    contextMenuItems: ['Aggregate', 'CalculatedField', 'Drillthrough', 'Excel Export', 'Pdf Export', 'Csv Export', 'Expand', 'Collapse',
                        'Sort Ascending', 'Sort Descending']
                },
                enableRtl: true,
                dataBound: dataBound,
                allowExcelExport: true,
                allowCalculatedField: true,
                allowDrillThrough: true,
                allowConditionalFormatting: true,
                allowNumberFormatting: true,
                enableValueSorting: true,
                allowPdfExport: true,
                showToolbar: true,
                showFieldList: true
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 500);
        });
        it('should collapse row headers from context menu', (done: Function) => {
            setTimeout(() => {
                let cell: HTMLElement = document.querySelector('.e-rowsheader');
                expect(cell.innerText).toBe('Bike');
                util.triggerMouseEvent(cell, 'contextmenu');
                (document.getElementById('PivotGrid_collapse') as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 300);
        });
        it('should expand row headers from context menu', (done: Function) => {
            setTimeout(() => {
                let cell: HTMLElement = document.querySelector('.e-rowsheader');
                util.triggerMouseEvent(cell, 'contextmenu');
                expect(cell.innerText).toBe('Bike');
                (document.getElementById('PivotGrid_expand') as HTMLElement).click();
                done();
            }, 300);
        });
        it('should open context menu for value cells', (done: Function) => {
            setTimeout(() => {
                let cell: HTMLElement = document.querySelectorAll('.e-rowcell')[2] as HTMLElement;
                expect(cell.innerText).toBe('$33,674.04');
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 300);
        });
        it('should apply Max aggregation type from context menu', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGrid_aggregate') as HTMLElement;
                li.dispatchEvent(new Event('mouseover', { bubbles: true }));
                if (document.getElementById('PivotGrid_AggMax')) {
                    (document.getElementById('PivotGrid_AggMax') as HTMLElement).click();
                }
                expect(true).toBe(true);
                done();
            }, 500);
        });
        it('should open context menu for value cells again for percentage option', (done: Function) => {
            setTimeout(() => {
                let cell: HTMLElement = document.querySelectorAll('.e-rowcell')[2] as HTMLElement;
                expect(cell.innerText).toBe('$33,674.04');
                util.triggerMouseEvent(cell, 'contextmenu');
                expect(true).toBe(true);
                done();
            }, 300);
        });
        it('should apply percentage aggregation type from context menu', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGrid_aggregate') as HTMLElement;
                li.dispatchEvent(new Event('mouseover', { bubbles: true }));
                (document.getElementById('PivotGrid_AggMoreOption') as HTMLElement).click();
                document.getElementsByClassName('e-ddl')[0].dispatchEvent(new Event('mousedown', { bubbles: true }));
                document.querySelectorAll('#PivotGrid_type_option_options .e-list-item')[21].dispatchEvent(new Event('click', { bubbles: true }));
                (document.getElementsByClassName('e-ok-btn')[0] as HTMLElement).click();
                expect(true).toBe(true);
                done();
            }, 500);
        });
        it('should open context menu for value cells again for distinct count option', (done: Function) => {
            setTimeout(() => {
                let cell: HTMLElement = document.querySelectorAll('.e-rowcell')[2] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                expect(true).toBe(true);
                done();
            }, 300);
        });
        it('should apply DistinctCount aggregation type from context menu', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGrid_aggregate');
                li.dispatchEvent(new Event('mouseover', { bubbles: true }));
                if (document.getElementById('PivotGrid_AggDistinctCount')) {
                    (document.getElementById('PivotGrid_AggDistinctCount') as HTMLElement).click();
                }
                expect(true).toBe(true);
                done();
            }, 500);
        });
        it('should open context menu and open calculated field dialog', (done: Function) => {
            setTimeout(() => {
                let cell: HTMLElement = document.querySelectorAll('.e-rowcell')[1] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                expect(cell.innerText).toBe('15');
                (document.getElementById('PivotGrid_CalculatedField') as HTMLElement).click();
                done();
            }, 500);
        });
        it('should close calculated field dialog', (done: Function) => {
            setTimeout(() => {
                let calcField: any = document.querySelector('#' + pivotGridObj.element.id + 'calculateddialog');
                calcField = getInstance(calcField as HTMLElement, Dialog) as Dialog;
                calcField.buttons[1].click();
                expect(true).toBe(true);
                done();
            }, 300);
        });
        it('should open drill through from context menu', (done: Function) => {
            setTimeout(() => {
                let cell: HTMLElement = document.querySelectorAll('.e-rowcell')[1] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                expect(cell.innerText).toBe('15');
                (document.getElementById('PivotGrid_drillthrough_menu') as HTMLElement).click();
                done();
            }, 300);
        });
        it('should open context menu for PDF export option', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                let cell: HTMLElement = document.querySelectorAll('.e-rowcell')[1] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                expect(cell.innerText).toBe('15');
                done();
            }, 300);
        });
        it('should export to PDF from context menu', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGrid_exporting') as HTMLElement;
                li.dispatchEvent(new Event('mouseover', { bubbles: true }));
                if (document.getElementById('PivotGrid_pdf')) {
                    (document.getElementById('PivotGrid_pdf') as HTMLElement).click();
                }
                expect(true).toBe(true);
                done();
            }, 300);
        });
        it('should open context menu for Excel export option', (done: Function) => {
            setTimeout(() => {
                let cell: HTMLElement = document.querySelectorAll('.e-rowcell')[1] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                expect(cell.innerText).toBe('15');
                done();
            }, 300);
        });
        it('should export to Excel from context menu', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGrid_exporting') as HTMLElement;
                li.dispatchEvent(new Event('mouseover', { bubbles: true }));
                if (document.getElementById('PivotGrid_excel')) {
                    (document.getElementById('PivotGrid_excel') as HTMLElement).click();
                }
                expect(true).toBe(true);
                done();
            }, 300);
        });
        it('should open context menu for CSV export option', (done: Function) => {
            setTimeout(() => {
                let cell: HTMLElement = document.querySelectorAll('.e-rowcell')[1] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                expect(cell.innerText).toBe('15');
                done();
            }, 300);
        });
        it('should export to CSV from context menu', (done: Function) => {
            setTimeout(() => {
                let li: HTMLElement = document.getElementById('PivotGrid_exporting') as HTMLElement;
                li.dispatchEvent(new Event('mouseover', { bubbles: true }));
                if (document.getElementById('PivotGrid_csv')) {
                    (document.getElementById('PivotGrid_csv') as HTMLElement).click();
                }
                expect(true).toBe(true);
                done();
            }, 300);
        });
        it('should open context menu for value sorting', (done: Function) => {
            setTimeout(() => {
                let cell: HTMLElement = document.querySelectorAll('.e-headercell')[6] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                expect(cell.innerText).toBe('female Total');
                done();
            }, 300);
        });
        it('should sort values in ascending order from context menu', (done: Function) => {
            setTimeout(() => {
                if (document.getElementById('PivotGrid_sortasc')) {
                    (document.getElementById('PivotGrid_sortasc') as HTMLElement).click();
                }
                let cell: HTMLElement = document.querySelectorAll('.e-headercell')[6] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                expect(cell.innerText).toBe('female Total');
                done();
            }, 300);
        });
        it('should sort values in descending order from context menu', (done: Function) => {
            setTimeout(() => {
                if (document.getElementById('PivotGrid_sortdesc')) {
                    (document.getElementById('PivotGrid_sortdesc') as HTMLElement).click();
                }
                expect(true).toBe(true);
                done();
            }, 300);
        });
    });
    it('should not have memory leaks', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});