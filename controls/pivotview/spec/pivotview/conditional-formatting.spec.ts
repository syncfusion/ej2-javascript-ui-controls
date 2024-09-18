import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType, getInstance } from '@syncfusion/ej2-base';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { LoadEventArgs } from '../../src';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { DropDownList } from '@syncfusion/ej2-dropdowns';

describe('Conditional Formatting', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
    });
    describe(' - Code Behind', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        filterSettings: [
                            { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                        ],
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                        conditionalFormatSettings: [
                            {
                                value1: 50000,
                                value2: 600,
                                conditions: 'Between',
                                style: {
                                    backgroundColor: 'violet',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            },
                            {
                                value1: 50000,
                                value2: 600,
                                conditions: 'NotBetween',
                                style: {
                                    backgroundColor: 'green',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            },
                            {
                                measure: 'quantity',
                                value1: 500,
                                conditions: 'Equals',
                                style: {
                                    backgroundColor: 'yellow',
                                    color: 'violet',
                                    fontFamily: 'Verdana',
                                    fontSize: '15px'
                                }
                            },
                            {
                                measure: 'balance',
                                value1: 500,
                                conditions: 'NotEquals',
                                style: {
                                    backgroundColor: 'yellow',
                                    color: 'violet',
                                    fontFamily: 'Verdana',
                                    fontSize: '15px'
                                }
                            },
                            {
                                measure: 'quantity',
                                value1: 500,
                                conditions: 'LessThanOrEqualTo',
                                style: {
                                    backgroundColor: 'yellow',
                                    color: 'violet',
                                    fontFamily: 'Verdana',
                                    fontSize: '15px'
                                }
                            },
                            {
                                measure: 'balance',
                                value1: 500,
                                conditions: 'GreaterThanOrEqualTo',
                                style: {
                                    backgroundColor: 'yellow',
                                    color: 'violet',
                                    fontFamily: 'Verdana',
                                    fontSize: '15px'
                                }
                            },
                            {
                                value1: 600,
                                value2: 50000,
                                conditions: 'Between',
                                style: {
                                    backgroundColor: 'violet',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            },
                            {
                                value1: 600,
                                value2: 50000,
                                conditions: 'NotBetween',
                                style: {
                                    backgroundColor: 'green',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '13px'
                                },
                            },
                            {
                                measure: 'quantity',
                                label: 'female.false',
                                value1: 500,
                                conditions: 'LessThan',
                                style: {
                                    backgroundColor: 'yellow',
                                    color: 'violet',
                                    fontFamily: 'Verdana',
                                    fontSize: '15px'
                                }
                            },
                            {
                                measure: 'quantity',
                                label: 'female.false',
                                value1: 500,
                                conditions: 'GreaterThan',
                                style: {
                                    backgroundColor: 'yellow',
                                    color: 'green',
                                    fontFamily: 'Verdana',
                                    fontSize: '15px'
                                }
                            }
                        ]
                    },
                    height: 400,
                    cssClass: 'Check_ID',
                    allowConditionalFormatting: true,
                    dataBound: dataBound,
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('Check Default Format', () => {
            expect((pivotGridObj.pivotValues[3][1] as any).cssClass === 'formatPivotGrid6').toBeTruthy();
        });
        it('Check Default Format', () => {
            expect((pivotGridObj.pivotValues[3][2] as any).cssClass === 'formatPivotGrid8').toBeTruthy();
            pivotGridObj.dataSourceSettings.values.pop();
            pivotGridObj.engineModule.generateGridData(pivotGridObj.dataSourceSettings);
            pivotGridObj.engineModule.isEngineUpdated = false;
            pivotGridObj.pivotValues = pivotGridObj.engineModule.pivotValues;
        });
        it('With Single Measure', () => {
            expect((pivotGridObj.pivotValues[3][1] as any).cssClass === 'formatPivotGrid6').toBeTruthy();
        });
        it('With Single Measure', () => {
            expect((pivotGridObj.pivotValues[3][2] as any).cssClass === 'formatPivotGrid6').toBeTruthy();
            pivotGridObj.dataSourceSettings = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: [],
                conditionalFormatSettings: [
                    {
                        value1: 50000,
                        value2: 600,
                        conditions: 'Between',
                        style: {
                            backgroundColor: 'violet',
                            color: 'yellow',
                            fontFamily: 'Verdana',
                            fontSize: '13px'
                        },
                    }
                ]
            };
        });
        it('Without Filtering', () => {
            expect((pivotGridObj.pivotValues[3][1] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.dataSourceSettings = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: [],
                filterSettings: [
                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                    { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                ],
                conditionalFormatSettings: [
                    {
                        value1: 50000,
                        value2: 600,
                        conditions: 'Between',
                        style: {
                            backgroundColor: 'violet',
                            color: 'yellow',
                            fontFamily: 'Verdana',
                            fontSize: '13px'
                        },
                    }
                ]
            };
        });
        it('With Filtering', () => {
            expect((pivotGridObj.pivotValues[3][1] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.dataSourceSettings = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'Price', type: 'CalculatedField' }],
                filters: [],
                calculatedFieldSettings: [{ name: 'Price', formula: '"Sum(balance)" + "Sum(quantity)"' }],
                filterSettings: [
                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                    { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                ],
                conditionalFormatSettings: [
                    {
                        value1: 50000,
                        value2: 600,
                        measure: 'Price',
                        conditions: 'Between',
                        style: {
                            backgroundColor: 'violet',
                            color: 'yellow',
                            fontFamily: 'Verdana',
                            fontSize: '13px'
                        },
                    }
                ]
            };
        });
        it('With Calculated Field', () => {
            expect((pivotGridObj.pivotValues[3][3] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.setProperties({ enableValueSorting: true }, true);
            pivotGridObj.dataSourceSettings = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'Price', type: 'CalculatedField' }],
                filters: [],
                calculatedFieldSettings: [{ name: 'Price', formula: '"Sum(balance)" + "Sum(quantity)"' }],
                valueSortSettings: { headerText: 'female##false##Price', headerDelimiter: '##', sortOrder: 'Descending' },
                filterSettings: [
                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                    { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                ],
                conditionalFormatSettings: [
                    {
                        value1: 50000,
                        value2: 600,
                        measure: 'Price',
                        conditions: 'Between',
                        style: {
                            backgroundColor: 'violet',
                            color: 'yellow',
                            fontFamily: 'Verdana',
                            fontSize: '13px'
                        },
                    }
                ]
            };
        });
        it('With Value Sorting', () => {
            expect((pivotGridObj.pivotValues[3][3] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.setProperties({ enableValueSorting: true }, true);
            pivotGridObj.dataSourceSettings = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'Price', type: 'CalculatedField' }],
                filters: [],
                calculatedFieldSettings: [{ name: 'Price', formula: '"Sum(balance)" + "Sum(quantity)"' }],
                sortSettings: [{ name: 'product', order: 'Descending' }],
                filterSettings: [
                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                    { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                ],
                conditionalFormatSettings: [
                    {
                        value1: 50000,
                        value2: 600,
                        measure: 'Price',
                        conditions: 'Between',
                        style: {
                            backgroundColor: 'violet',
                            color: 'yellow',
                            fontFamily: 'Verdana',
                            fontSize: '13px'
                        },
                    }
                ]
            };
        });
        it('With Default Sorting', () => {
            expect((pivotGridObj.pivotValues[4][3] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.dataSourceSettings = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'company' }],
                columns: [{ name: 'gender', caption: 'Population' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                conditionalFormatSettings: [
                    {
                        value1: 2000,
                        measure: 'balance',
                        conditions: 'LessThan',
                        style: {
                            backgroundColor: 'violet',
                            color: 'yellow',
                            fontFamily: 'Verdana',
                            fontSize: '13px'
                        },
                    }
                ]
            };
        });
        it('Check empty cell', () => {
            expect((pivotGridObj.pivotValues[5][1] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
            let element = document.querySelector('#' + pivotGridObj.element.id)
            while(element) {
                remove(elem);
                element = document.querySelector('#' + pivotGridObj.element.id)
            }
        });
    });
    describe(' - UI', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        PivotView.Inject(ConditionalFormatting);
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        filterSettings: [
                            { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                        ],
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                        conditionalFormatSettings: [
                            {
                                measure: 'quantity',
                                value1: 500,
                                conditions: 'LessThan',
                                style: {
                                    backgroundColor: 'green',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '12px'
                                }
                            }
                        ]
                    },
                    allowConditionalFormatting: true,
                    dataBound: dataBound,
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        let click: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        it('Check for cssClass to be empty', () => {
            pivotGridObj.cssClass = 'formatPivotGrid0';
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        })
        it('Check code behind format', () => {
            expect((pivotGridObj.pivotValues[3][2] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Delete format', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-delete-button') as HTMLElement).click();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check code behind format', () => {
            expect((pivotGridObj.pivotValues[3][2] as any).cssClass === 'formatPivotGrid0').toBeFalsy();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Add format', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-condition-button') as HTMLElement).click();
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue10') as HTMLInputElement).value = '500';
            (document.querySelectorAll('.e-dropdown-btn')[0] as HTMLElement).click();
            (document.querySelectorAll('.e-tile')[9] as HTMLElement).click();
            (document.querySelector('.e-apply') as HTMLElement).click();
            (document.querySelectorAll('.e-dropdown-btn')[1] as HTMLElement).click();
            (document.querySelectorAll('.e-tile')[55] as HTMLElement).click();
            (document.querySelector('.e-apply') as HTMLElement).click();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check applied format', () => {
            expect((pivotGridObj.pivotValues[3][2] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Cancel button click', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-cancel-button') as HTMLElement).click();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Add format', () => {
            expect(true).toBeTruthy();
            const conditionalFormatting = document.querySelector('#' + pivotGridObj.element.id + 'conditionalformatting');
            let element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'measureinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'balance';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'conditioninput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Between';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontnameinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Serif';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontsizeinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue10') as HTMLInputElement).value = '500';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue20') as HTMLInputElement).value = '50000';
        });
        it('Click apply button', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check applied format', () => {
            expect((pivotGridObj.pivotValues[3][1] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Add format', () => {
            expect(true).toBeTruthy();
            const conditionalFormatting = document.querySelector('#' + pivotGridObj.element.id + 'conditionalformatting');
            let element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'measureinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'balance';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'conditioninput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'NotBetween';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontnameinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Serif';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontsizeinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue10') as HTMLInputElement).value = '500';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue20') as HTMLInputElement).value = '50000';
            (document.querySelectorAll('.e-check')[0] as HTMLInputElement).dispatchEvent(click);
        });
        it('Click apply button', () => {
            expect((pivotGridObj.pivotValues[5][1] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check applied format', () => {
            expect((pivotGridObj.pivotValues[5][1] as any).cssClass === undefined).toBeTruthy();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Add format', () => {
            expect(true).toBeTruthy();
            const conditionalFormatting = document.querySelector('#' + pivotGridObj.element.id + 'conditionalformatting');
            let element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'measureinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'quantity';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'conditioninput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'LessThan';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontnameinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Serif';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontsizeinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue10') as HTMLInputElement).value = '500';
        });
        it('Click apply button', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check applied format', () => {
            expect((pivotGridObj.pivotValues[3][2] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.dataSourceSettings = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'Price', type: 'CalculatedField' }],
                filters: [],
                calculatedFieldSettings: [{ name: 'Price', formula: '"Sum(balance)" + "Sum(quantity)"' }],
                sortSettings: [{ name: 'product', order: 'Descending' }],
                filterSettings: [
                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                    { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                ],
                conditionalFormatSettings: [
                    {
                        value1: undefined,
                        measure: undefined,
                        conditions: undefined,
                        style: {
                            backgroundColor: undefined,
                            color: undefined,
                            fontFamily: undefined,
                            fontSize: undefined
                        },
                    }
                ]
            };
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - Mobile', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        PivotView.Inject(ConditionalFormatting);
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                        filterSettings: [
                            { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                        ],
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                        conditionalFormatSettings: [
                            {
                                measure: 'quantity',
                                value1: 500,
                                conditions: 'LessThan',
                                style: {
                                    backgroundColor: 'green',
                                    color: 'yellow',
                                    fontFamily: 'Verdana',
                                    fontSize: '12px'
                                }
                            }
                        ]
                    },
                    load: (args: LoadEventArgs) => {
                        pivotGridObj.isAdaptive = true;
                    },
                    allowConditionalFormatting: true,
                    dataBound: dataBound,
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('Check code behind format', () => {
            expect((pivotGridObj.pivotValues[3][2] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Delete format', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-delete-button') as HTMLElement).click();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check code behind format', () => {
            expect((pivotGridObj.pivotValues[3][2] as any).cssClass === 'formatPivotGrid0').toBeFalsy();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Add format', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-condition-button') as HTMLElement).click();
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue10') as HTMLInputElement).value = '500';
            (document.querySelectorAll('.e-dropdown-btn')[0] as HTMLElement).click();
            (document.querySelectorAll('.e-tile')[9] as HTMLElement).click();
            (document.querySelector('.e-apply') as HTMLElement).click();
            (document.querySelectorAll('.e-dropdown-btn')[1] as HTMLElement).click();
            (document.querySelectorAll('.e-tile')[55] as HTMLElement).click();
            (document.querySelector('.e-apply') as HTMLElement).click();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check applied format', () => {
            expect((pivotGridObj.pivotValues[3][2] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Cancel button click', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-cancel-button') as HTMLElement).click();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Add format', () => {
            expect(true).toBeTruthy();
            const conditionalFormatting = document.querySelector('#' + pivotGridObj.element.id + 'conditionalformatting');
            let element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'measureinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'balance';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'conditioninput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Between';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontnameinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Serif';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontsizeinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue10') as HTMLInputElement).value = '500';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue20') as HTMLInputElement).value = '50000';
        });
        it('Click apply button', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check applied format', () => {
            expect((pivotGridObj.pivotValues[3][1] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Add format', () => {
            expect(true).toBeTruthy();
            const conditionalFormatting = document.querySelector('#' + pivotGridObj.element.id + 'conditionalformatting');
            let element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'measureinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'balance';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'conditioninput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'NotBetween';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontnameinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Serif';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontsizeinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue10') as HTMLInputElement).value = '500';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue20') as HTMLInputElement).value = '50000';
        });
        it('Click apply button', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check applied format', () => {
            expect((pivotGridObj.pivotValues[5][3] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Add format', () => {
            expect(true).toBeTruthy();
            const conditionalFormatting = document.querySelector('#' + pivotGridObj.element.id + 'conditionalformatting');
            let element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'measureinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'quantity';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'conditioninput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'LessThan';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontnameinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Serif';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontsizeinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue10') as HTMLInputElement).value = '500';
        });
        it('Click apply button', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check applied format', () => {
            expect((pivotGridObj.pivotValues[3][2] as any).cssClass === 'formatPivotGrid0').toBeTruthy();
            pivotGridObj.dataSourceSettings = {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: false,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'Price', type: 'CalculatedField' }],
                filters: [],
                calculatedFieldSettings: [{ name: 'Price', formula: '"Sum(balance)" + "Sum(quantity)"' }],
                sortSettings: [{ name: 'product', order: 'Descending' }],
                filterSettings: [
                    { name: 'product', type: 'Include', items: ['Car', 'Bike'] },
                    { name: 'eyeColor', type: 'Include', items: ['blue', 'green'] },
                ],
                conditionalFormatSettings: [
                    {
                        value1: undefined,
                        measure: undefined,
                        conditions: undefined,
                        style: {
                            backgroundColor: undefined,
                            color: undefined,
                            fontFamily: undefined,
                            fontSize: undefined
                        },
                    }
                ]
            };
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Cancel button click', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-cancel-button') as HTMLElement).click();
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - Opening the conditional formatting dialog', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
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
                    ]
                },
                height: 300,
                allowConditionalFormatting: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });

        it('- Using the corresponding method', (done: Function) => {
            setTimeout(() => {
                pivotGridObj.showConditionalFormattingDialog();
                expect(document.querySelectorAll('.e-format-outer-div').length).toBe(2);
                (document.querySelectorAll('.e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
            let element = document.querySelector('#' + pivotGridObj.element.id)
            while(element) {
                remove(elem);
                element = document.querySelector('#' + pivotGridObj.element.id)
            }
        });
    });
    describe(' - Conditional formatting value empty', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        beforeAll((done: Function) => {
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                    conditionalFormatSettings: [
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
                    ]
                },
                height: 300,
                allowConditionalFormatting: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });

        it('Check applied format', function () {
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Add format', () => {
            expect(true).toBeTruthy();
            const conditionalFormatting = document.querySelector('#' + pivotGridObj.element.id + 'conditionalformatting');
            let element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'measureinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'balance';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'conditioninput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Between';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontnameinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Serif';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontsizeinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue10') as HTMLInputElement).value = '';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue20') as HTMLInputElement).value = '';
        });
        it('Click apply button', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        it('Check applied format', function () {
            pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
        });
        it('Add format', () => {
            expect(true).toBeTruthy();
            const conditionalFormatting = document.querySelector('#' + pivotGridObj.element.id + 'conditionalformatting');
            let element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'measureinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'balance';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'conditioninput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Between';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontnameinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = 'Serif';
            element = (conditionalFormatting as any).querySelector('#' + pivotGridObj.element.id + 'fontsizeinput' + 0);
            (getInstance(element as HTMLElement, DropDownList) as DropDownList).value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue10') as HTMLInputElement).value = '400';
            (document.querySelector('#' + pivotGridObj.element.id + 'conditionvalue20') as HTMLInputElement).value = '';
        });
        it('Click apply button', () => {
            expect(true).toBeTruthy();
            (document.querySelector('.e-format-apply-button') as HTMLElement).click();
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
            let element = document.querySelector('#' + pivotGridObj.element.id)
            while(element) {
                remove(elem);
                element = document.querySelector('#' + pivotGridObj.element.id)
            }
        });
        describe(' - Opening the conditional formatting dialog and checking rgba,rgb', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
            beforeAll((done: Function) => {
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                        conditionalFormatSettings: [
                            {
                                measure: 'balance',
                                value1: 100000,
                                conditions: 'LessThan',
                                style: {
                                    backgroundColor: 'rgba(255, 99, 71, 0.5)',
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
                                    backgroundColor: 'rgb(255, 99, 71, 0.5)',
                                    color: 'black',
                                    fontFamily: 'Tahoma',
                                    fontSize: '12px'
                                }
                            }
                        ]
                    },
                    height: 300,
                    allowConditionalFormatting: true,
                    dataBound: dataBound
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 100);
            });
            it('Check applied format', () => {
                pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
            });
            it('Click apply button', () => {
                expect(true).toBeTruthy();
                (document.querySelector('.e-format-apply-button') as HTMLElement).click();
            });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
                let element = document.querySelector('#' + pivotGridObj.element.id)
                while (element) {
                    remove(elem);
                    element = document.querySelector('#' + pivotGridObj.element.id)
                }
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
});
