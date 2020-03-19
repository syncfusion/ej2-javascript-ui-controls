import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove } from '@syncfusion/ej2-base';
import { ConditionalFormatting } from '../../src/common/conditionalformatting/conditional-formatting';
import { LoadEventArgs } from '../../src';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Conditional Formatting', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe(' - Code Behind', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        beforeAll(() => {
            document.body.appendChild(elem);
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
                    allowConditionalFormatting: true
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
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
            //pivotGridObj.enableValueSorting = true;
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
            //pivotGridObj.enableValueSorting = false;
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
            expect((pivotGridObj.pivotValues[4][3] as any).cssClass === 'formatPivotGrid0').toBeFalsy();
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - UI', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        PivotView.Inject(ConditionalFormatting);
        beforeAll(() => {
            document.body.appendChild(elem);
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
                    allowConditionalFormatting: true
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
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
            (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
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
            (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'balance';
            (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'Between';
            (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
            (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
            (document.querySelector('.e-format-value2') as HTMLInputElement).value = '50000';
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
            (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'balance';
            (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'NotBetween';
            (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
            (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
            (document.querySelector('.e-format-value2') as HTMLInputElement).value = '50000';
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
            (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'quantity';
            (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'LessThan';
            (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
            (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
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
        beforeAll(() => {
            document.body.appendChild(elem);
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
                    allowConditionalFormatting: true
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
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
            (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
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
            (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'balance';
            (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'Between';
            (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
            (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
            (document.querySelector('.e-format-value2') as HTMLInputElement).value = '50000';
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
            (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'balance';
            (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'NotBetween';
            (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
            (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
            (document.querySelector('.e-format-value2') as HTMLInputElement).value = '50000';
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
            (pivotGridObj.conditionalFormattingModule as any).fieldsDropDown[0].value = 'quantity';
            (pivotGridObj.conditionalFormattingModule as any).conditionsDropDown[0].value = 'LessThan';
            (pivotGridObj.conditionalFormattingModule as any).fontNameDropDown[0].value = 'Serif';
            (pivotGridObj.conditionalFormattingModule as any).fontSizeDropDown[0].value = '16px';
            (pivotGridObj.conditionalFormattingModule as any).fontColor[0].value = '#f5dd05';
            (pivotGridObj.conditionalFormattingModule as any).backgroundColor[0].value = '#cb04aa';
            (document.querySelector('.e-format-value1') as HTMLInputElement).value = '500';
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

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange);
        //Check average change in memory samples to not be over 10MB
        //expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile());
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });
});