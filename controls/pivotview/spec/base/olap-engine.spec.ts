import { PivotView } from '../../src/pivotview/base/pivotview';
import { getInstance, closest, createElement, remove, EmitType, EventHandler } from '@syncfusion/ej2-base';
import { FieldList } from '../../src/common/actions/field-list';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { ExcelExport, PDFExport, VirtualScroll } from '../../src/pivotview/actions';
import { Toolbar } from '../../src/common/popups/toolbar';
import * as util from '../utils.spec';
import { getMemoryProfile, inMB, profile } from '../common.spec';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { MaskedTextBox, TextArea, TextBox } from '@syncfusion/ej2-inputs';
import { TreeView } from '@syncfusion/ej2-navigations';
import { NumberFormatting } from '../../src/common/popups/formatting-dialog';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { DrillThrough } from '../../src/pivotview/actions';
import { Grouping } from '../../src/common/popups/grouping';
import { HeadersSortEventArgs } from '../../src/common/base/interface';

describe('Pivot Olap Engine', () => {
    /**
     * Test case for PivotOlapEngine
     */
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });

    describe('Initial rendering', () => {
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let pivotGridObj: PivotView;
        let down: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        let up: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
        });
        let searchField: TextBox;
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Finance',
                    providerType: 'SSAS',
                    url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    columns: [],
                    rows: [],
                    values: [],
                },
                showFieldList: true,
                enableFieldSearching: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Randering empty table', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[0][0].actualText).toBe('Grand Total');
                expect(pivotGridObj.element.querySelectorAll('.e-content .e-rowcell')[1].textContent).toBe('No records to display');
                done();
            }, 2000);
        });
        it('inital rendering', (done: Function) => {
            pivotGridObj.dataSourceSettings = {
                catalog: 'Adventure Works DW Standard Edition',
                cube: 'Finance',
                providerType: 'SSAS',
                url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                localeIdentifier: 1033,
                enableSorting: true,
                columns: [{ name: '[Account].[Accounts]', caption: 'Accounts' },
                    { name: '[Measures]', caption: 'Measures' }],
                rows: [{ name: '[Scenario].[Scenario]', caption: 'Customer Geography' }],
                values: [{ name: '[Measures].[Amount]', caption: 'Amount' }],
            };
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[0][1].actualText).toBe('[Account].[Accounts].&[1]');
                expect(pivotGridObj.pivotValues[0][1].formattedText).toBe('Balance Sheet');
                expect(pivotGridObj.pivotValues[2][1].formattedText).toBe('$0.00');
                done();
            }, 3000);
        });
        it('Drilling column header', (done: Function) => {
            (pivotGridObj.element.querySelectorAll('.e-expand')[0] as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[1][1].actualText).toBe('[Account].[Accounts].&[2]');
                expect(pivotGridObj.pivotValues[1][1].formattedText).toBe('Assets');
                expect(pivotGridObj.pivotValues[3][1].formattedText).toBe('$384,254,267.00');
                done();
            }, 2000);
        });
        it('Moving measure to row axis', (done: Function) => {
            pivotGridObj.dataSourceSettings = {
                catalog: 'Adventure Works DW Standard Edition',
                cube: 'Finance',
                providerType: 'SSAS',
                url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                localeIdentifier: 1033,
                enableSorting: true,
                columns: [{ name: '[Account].[Accounts]', caption: 'Accounts' }],
                rows: [{ name: '[Scenario].[Scenario]', caption: 'Customer Geography' },
                    { name: '[Measures]', caption: 'Measures' }],
                values: [{ name: '[Measures].[Amount]', caption: 'Amount' }],
            };
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][0].formattedText).toBe('Amount');
                expect(pivotGridObj.pivotValues[3][1].formattedText).toBe('$384,254,267.00');
                done();
            }, 3000);
        });
        it('Field list search checking - 1', (done: Function) => {
            (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
            setTimeout(() => {
                searchField = getInstance(document.querySelectorAll('.e-textbox.e-input')[0] as HTMLElement, TextBox) as TextBox;
                searchField.value = 'customer';
                searchField.element.dispatchEvent(new Event('input', { bubbles: true }));
                expect(document.querySelector('.e-pivotfieldlist-container .e-field-table .e-field-list ul li:not(.e-disable)').textContent).toBe('MeasuresFinancial ReportingAmountExchange RatesAverage RateEnd of Day Rate');
                done();
            }, 3000);
        });
        it('Field list search checking - 2', (done: Function) => {
            expect(document.querySelector('.e-pivotfieldlist-container .e-field-table .e-field-list ul li:not(.e-disable)').textContent).toBe('MeasuresFinancial ReportingAmountExchange RatesAverage RateEnd of Day Rate');
            setTimeout(() => {
                searchField.element.dispatchEvent(new Event('input', { bubbles: true }));
                done();
            }, 3000);
        });
        it('Validating search & select node', (done: Function) => {
            expect(document.querySelector('.e-pivotfieldlist-container .e-field-table .e-field-list ul li:not(.e-disable)').textContent).toBe('ScenarioCustomer Geography');
            expect(document.querySelectorAll('.e-pivotfieldlist-container .e-left-axis-fields .e-field-list-rows .e-pivot-button')[0].textContent).toBe('Customer Geography');
            let checkEle: NodeListOf<Element> = document.querySelectorAll('.e-pivotfieldlist-container .e-field-table .e-field-list ul li:not(.e-disable) ul li .e-checkbox-wrapper');
            closest(checkEle[0], 'li').dispatchEvent(down);
            closest(checkEle[0], 'li').dispatchEvent(up);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivotfieldlist-container .e-left-axis-fields .e-field-list-rows .e-pivot-button')[0].textContent).toBe('Measures');
                done();
            }, 3000);
        });
    });

    describe('Features ensuring - Value sorting', () => {
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let pivotGridObj: PivotView;
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Finance',
                    providerType: 'SSAS',
                    url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    enableSorting: true,
                    columns: [{ name: '[Account].[Accounts]', caption: 'Accounts' },
                        { name: '[Measures]', caption: 'Measures' }],
                    rows: [{ name: '[Scenario].[Scenario]', caption: 'Customer Geography' }],
                    values: [{ name: '[Measures].[Amount]', caption: 'Amount' }],
                },
                showFieldList: true,
                enableValueSorting: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Initial rendering', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[2][1].formattedText).toBe('$0.00');
                done();
            }, 3000);
        });
        it('Perform value sorting - column - 1', (done: Function) => {
            (pivotGridObj.element.querySelectorAll('.e-table thead tr')[1].querySelectorAll('.e-headercell')[1] as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[2][2].formattedText).toBe('$12,609,503.00');
                done();
            }, 1000);
        });
        it('Perform value sorting - column - 2', (done: Function) => {
            (pivotGridObj.element.querySelectorAll('.e-value-sort-icon')[0] as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[2][2].formattedText).toBe('');
                done();
            }, 1000);
        });
        it('Perform value sorting - row - 1', (done: Function) => {
            pivotGridObj.dataSourceSettings = {
                catalog: 'Adventure Works DW Standard Edition',
                cube: 'Finance',
                providerType: 'SSAS',
                url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                localeIdentifier: 1033,
                enableSorting: true,
                columns: [{ name: '[Account].[Accounts]', caption: 'Accounts' }],
                rows: [{ name: '[Measures]', caption: 'Measures' },
                    { name: '[Scenario].[Scenario]', caption: 'Customer Geography' }],
                values: [{ name: '[Measures].[Amount]', caption: 'Amount' }],
            };
            pivotGridObj.dataSourceSettings.valueAxis = 'row';
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][1].formattedText).toBe('');
                done();
            }, 3000);
        });
        it('Perform value sorting - row - 2', (done: Function) => {
            (pivotGridObj.element.querySelectorAll('.e-table tr')[4].querySelectorAll('td')[0] as HTMLElement).click()
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][1].formattedText).toBe('$5,583,900.00');
                (pivotGridObj.element.querySelectorAll('.e-value-sort-icon')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Perform value sorting - row - 3', (done: Function) => {
            expect(pivotGridObj.pivotValues[3][1].formattedText).toBe('');
            done();
        });
        it('Perform value sorting - User defined - 1', (done: Function) => {
            pivotGridObj.dataSourceSettings = {
                catalog: 'Adventure Works DW Standard Edition',
                cube: 'Finance',
                providerType: 'SSAS',
                url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                localeIdentifier: 1033,
                enableSorting: true,
                columns: [
                    { name: '[Date].[Fiscal]', caption: 'Date Fiscal' },
                    { name: '[Account].[Accounts]', caption: 'Accounts' },
                    { name: '[Measures]', caption: 'Measures' }
                ],
                rows: [{ name: '[Scenario].[Scenario]', caption: 'Customer Geography' }],
                values: [{ name: '[Measures].[Amount]', caption: 'Amount' }],
            },
            pivotGridObj.dataSourceSettings.valueAxis = 'column';
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][2].formattedText).toBe('NA');
                (pivotGridObj.element.querySelectorAll('.e-table thead tr')[2].querySelectorAll('.e-headercell')[1] as HTMLElement).click();
                done();
            }, 3000);
        });
        it('Perform value sorting - User defined - 2', (done: Function) => {
            expect(pivotGridObj.pivotValues[3][2].formattedText).toBe('NA');
            pivotGridObj.dataSourceSettings.columns = [
                { name: '[Date].[Fiscal]', caption: 'Date Fiscal' },
                { name: '[Measures]', caption: 'Measures' }
            ];
            setTimeout(() => {
                expect(document.querySelectorAll('.e-table tr')[3].querySelectorAll('td')[0].textContent).toBe('Actual');
                done();
            }, 3000);
        });
        it('Perform value sorting - User defined - grand total', (done: Function) => {
            (pivotGridObj.element.querySelectorAll('.e-table thead tr')[1].querySelectorAll('.e-headercell')[4] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-table tr')[3].querySelectorAll('td')[0].textContent).toBe('Budget Variance %');
                done();
            }, 1000);
        });
        it('Perform value sorting - child level - 1', (done: Function) => {
            (pivotGridObj.element.querySelectorAll('.e-table thead tr')[1].querySelectorAll('.e-headercell')[4] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-table tr')[3].querySelectorAll('td')[0].textContent).toBe('Actual');
                done();
            }, 1000);
        });
        it('Perform value sorting - child level - 2', (done: Function) => {
            (pivotGridObj.element.querySelectorAll('.e-expand')[0] as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-table tr')[4].querySelectorAll('td')[0].textContent).toBe('Actual');
                done();
            }, 2000);
        });
        it('Perform value sorting - child level - 3', (done: Function) => {
            (pivotGridObj.element.querySelectorAll('.e-table thead tr')[2].querySelectorAll('.e-headercell')[2] as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-table tr')[4].querySelectorAll('td')[0].textContent).toBe('Budget Variance %');
                done();
            }, 1000);
        });
        it('Perform value sorting - child level - 4', (done: Function) => {
            (pivotGridObj.element.querySelectorAll('.e-table thead tr')[2].querySelectorAll('.e-headercell')[2] as HTMLElement).click();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-table tr')[4].querySelectorAll('td')[0].textContent).toBe('Actual');
                done();
            }, 2000);
        });
    });

    describe('Features ensuring - Paging & Virtualization', () => {
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let pivotGridObj: PivotView;
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Finance',
                    providerType: 'SSAS',
                    url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    enableSorting: true,
                    columns: [{ name: '[Account].[Accounts]', caption: 'Accounts' },
                        { name: '[Measures]', caption: 'Measures' }],
                    rows: [{ name: '[Account].[Account Number]', caption: 'Account Number' }],
                    values: [{ name: '[Measures].[Amount]', caption: 'Amount' }],
                },
                height: 350,
                showFieldList: true,
                enableVirtualization: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Initial rendering', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][0].formattedText).toBe('1110');
                done();
            }, 3000);
        });
        it('Scrolling table - 1', (done: Function) => {
            document.querySelectorAll('.e-content')[0].scrollTop = 1000;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("touchstart", { clientY: 1000, view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][0].formattedText).toBe('4130');
                done();
            }, 1000);
        });
        it('Scrolling table - 2', (done: Function) => {
            document.querySelectorAll('.e-content')[0].scrollTop = 1000;
            let args: MouseEvent = new MouseEvent("touchstart", { clientY: 1000, view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][0].formattedText).toBe('4130');
                document.querySelectorAll('.e-content')[0].scrollTop = 2000;
                pivotGridObj.virtualscrollModule.direction = 'vertical';
                let args: MouseEvent = new MouseEvent("touchstart", { clientY: 2000, view: window, bubbles: true, cancelable: true });
                document.querySelectorAll('.e-content')[0].dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelectorAll('.e-content')[0].dispatchEvent(args);
                done();
            }, 1000);
        });
        it('Scrolling table - 3', (done: Function) => {
            document.querySelectorAll('.e-content')[0].scrollTop = 2000;
            let args: MouseEvent = new MouseEvent("touchstart", { clientY: 2000, view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][0].formattedText).toBe('6040');
                document.querySelectorAll('.e-content')[0].scrollTop = 0;
                pivotGridObj.virtualscrollModule.direction = 'vertical';
                let args: MouseEvent = new MouseEvent("touchstart", { clientY: 0, view: window, bubbles: true, cancelable: true });
                document.querySelectorAll('.e-content')[0].dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelectorAll('.e-content')[0].dispatchEvent(args);
                done();
            }, 1000);
        });
        it('Scrolling table - 4', (done: Function) => {
            document.querySelectorAll('.e-content')[0].scrollTop = 0;
            let args: MouseEvent = new MouseEvent("touchstart", { clientY: 0, view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][0].formattedText).toBe('1110');
                done();
            }, 1000);
        });
        it('Virtulization without totals - 1', (done: Function) => {
            pivotGridObj.dataSourceSettings.columns = [
                { name: '[Measures]', caption: 'Measures' },
                { name: '[Account].[Accounts]', caption: 'Accounts' }
            ];
            pivotGridObj.dataSourceSettings.showGrandTotals = false;
            pivotGridObj.dataSourceSettings.showSubTotals = false;
            setTimeout(() => {
                document.querySelectorAll('.e-content')[0].scrollTop = 2000;
                let args: MouseEvent = new MouseEvent("touchstart", { clientY: 2000, view: window, bubbles: true, cancelable: true });
                document.querySelectorAll('.e-content')[0].dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelectorAll('.e-content')[0].dispatchEvent(args);
                expect(pivotGridObj.pivotValues[3][0].formattedText).toBe('6040');
                done();
            }, 3000);
        });
        it('Virtulization without totals - 2', (done: Function) => {
            document.querySelectorAll('.e-content')[0].scrollTop = 2000;
            let args: MouseEvent = new MouseEvent("touchstart", { clientY: 2000, view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][0].formattedText).toBe('6040');
                done();
            }, 3000);
        });
    });

    describe('Features ensuring - Grouping bar', () => {
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let pivotGridObj: PivotView;
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList, GroupingBar);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Finance',
                    providerType: 'SSAS',
                    url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    enableSorting: true,
                    columns: [{ name: '[Account].[Accounts]', caption: 'Accounts' },
                        { name: '[Measures]', caption: 'Measures' }],
                    rows: [{ name: '[Scenario].[Scenario]', caption: 'Customer Geography' }],
                    values: [{ name: '[Measures].[Amount]', caption: 'Amount' }],
                },
                showGroupingBar: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Initial rendering', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[3][0].formattedText).toBe('Budget');
                done();
            }, 3000);
        });
        it('Destrying grouping table', (done: Function) => {
            pivotGridObj.destroy();
            setTimeout(() => {
                expect(pivotGridObj.groupingBarModule).toBe(null);
                done();
            }, 500);
        });
        it('Destrying grouping chart table ', (done: Function) => {
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Finance',
                    providerType: 'SSAS',
                    url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    enableSorting: true,
                    columns: [{ name: '[Account].[Accounts]', caption: 'Accounts' },
                        { name: '[Measures]', caption: 'Measures' }],
                    rows: [{ name: '[Scenario].[Scenario]', caption: 'Customer Geography' }],
                    values: [{ name: '[Measures].[Amount]', caption: 'Amount' }],
                },
                displayOption: { view: 'Chart' },
                showGroupingBar: true,
            });
            pivotGridObj.appendTo('#PivotGrid');
            setTimeout(() => {
                pivotGridObj.destroy();
                expect(pivotGridObj.groupingBarModule).toBe(null);
                done();
            }, 3000);
        });
    });

    describe('Calculated field', () => {
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let pivotGridObj: PivotView;
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(FieldList, CalculatedField);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    catalog: 'Adventure Works DW Standard Edition',
                    cube: 'Finance',
                    providerType: 'SSAS',
                    url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
                    localeIdentifier: 1033,
                    enableSorting: true,
                    columns: [{ name: '[Account].[Accounts]', caption: 'Accounts' },
                    { name: '[Measures]', caption: 'Measures' }],
                    rows: [{ name: '[Scenario].[Scenario]', caption: 'Customer Geography' }],
                    values: [
                        { name: '[Measures].[Amount]', caption: 'Amount' },
                        { name: 'Calculated field 1', caption: 'Calculated field', isCalculatedField: true }
                    ],
                    calculatedFieldSettings: [
                        {
                            formula: '[Measures].[Amount]*[Measures].[Average Rate]',
                            name: 'Calculated field 1',
                            formatString: 'Standard'
                        }
                    ]
                },
                showFieldList: true,
                allowCalculatedField: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Initial rendering', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[1][2].actualText).toBe('Calculated field 1');
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                done();
            }, 3000);
        });
        it('Open calculated Filed popup ', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivotfieldlist').length).toBe(1);
                (document.querySelectorAll('.e-calculated-field')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Open calculated popup - To check the clearFormula coverage', function (done) {
            setTimeout(function () {
                (document.querySelectorAll('.e-calc-clear-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Initial rendering', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[1][2].actualText).toBe('Calculated field 1');
                (pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                done();
            }, 3000);
        });
        it('Open calculated popup - 1', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivotfieldlist').length).toBe(1);
                (document.querySelectorAll('.e-calculated-field')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Creating calculated field 2 - 1', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-olap-calc-outer-div').length).toBe(1);
                (getInstance(document.querySelectorAll('.e-olap-calc-outer-div .e-pivot-calc-input')[0] as HTMLElement,
                    MaskedTextBox) as MaskedTextBox).value = 'Calculated field 2';
                (document.querySelectorAll('.e-olap-calc-outer-div .e-pivot-formula')[0] as HTMLInputElement
                ).value = '[Measures].[Amount]+[Measures].[Average Rate]';
                done();
            }, 1000);
        });
        it('Creating calculated field 2 - 2', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-olap-calc-outer-div').length).toBe(1);
                (document.querySelectorAll('.e-olap-calc-dialog-div .e-primary')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Olap calculated field', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivotfieldlist').length).toBe(1);
                (document.querySelectorAll('.e-calculated-field')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Creating calculated field 3 - 1', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-olap-calc-outer-div').length).toBe(1);
                (getInstance(document.querySelectorAll('.e-olap-calc-outer-div .e-pivot-calc-input')[0] as HTMLElement,
                    MaskedTextBox) as MaskedTextBox).value = 'Calculated field 3';
                (document.querySelectorAll('.e-olap-calc-outer-div .e-pivot-formula')[0] as HTMLInputElement
                ).value = '[Measures].[Amount]-[Measures].[Average Rate]';
                done();
            }, 1000);
        });
        it('Creating calculated field 2 - 4', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-olap-calc-outer-div').length).toBe(1);
                (document.querySelectorAll('.e-olap-calc-dialog-div .e-primary')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Open calculated popup - 2', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivotfieldlist').length).toBe(1);
                (document.querySelectorAll('.e-calculated-field')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Removing calculated field - 1', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-olap-calc-outer-div').length).toBe(1);
                let treeObj: TreeView = getInstance(document.querySelectorAll('.e-pivot-treeview')[0] as HTMLElement, TreeView) as TreeView;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-icon-expandable'));
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, li[0].querySelector('.e-icon-expandable'));
                EventHandler.trigger(treeObj.element, 'mouseup', mouseup);
                done();
            }, 1000);
        });
        it('Removing calculated field - 2', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-olap-calc-outer-div').length).toBe(1);
                let treeObj: TreeView = getInstance(document.querySelectorAll('.e-pivot-treeview')[0] as HTMLElement, TreeView) as TreeView;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li .e-remove-report');
                let mousedown: any = util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2]);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, li[2]);
                EventHandler.trigger(treeObj.element, 'mouseup', mouseup);
                done();
            }, 1000);
        });
        it('Removing calculated field - 3', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-olap-calc-outer-div').length).toBe(1);
                (document.querySelectorAll('.e-pivot-error-dialog .e-primary')[0] as HTMLButtonElement).click();
                done();
            }, 1000);
        });
        it('Olap calculated field ensuring - 2', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-olap-calc-outer-div').length).toBe(1);
                (document.querySelectorAll('.e-olap-calc-dialog-div .e-btn')[3] as HTMLElement).click();
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
