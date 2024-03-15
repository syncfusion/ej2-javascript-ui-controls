import { IDataSet } from '../../src/base/engine';
import { pivot_dataset, pivot_nodata } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { BeginDrillThroughEventArgs } from '../../src/common/base/interface';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { Grid } from '@syncfusion/ej2-grids';
import { VirtualScroll } from '../../src/pivotview/actions';
import { DrillThrough } from '../../src/pivotview/actions';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('- Drill Through', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            return;
        }
    });
    describe('- normal', () => {
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
            PivotView.Inject(GroupingBar, DrillThrough, CalculatedField);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                    rows: [{ name: 'product' }, { name: 'state' }],
                    columns: [{ name: 'gender' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'price' }], filters: [{ name: 'index' }],
                    allowValueFilter: true,
                    allowLabelFilter: true
                },
                height: 300,
                width: 800,
                allowDrillThrough: true,
                beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
                    if (args.gridObj) {
                        let eventType: string = args.type;
                        let gridObj: Grid = args.gridObj;
                        gridObj.allowKeyboard = false;
                    }
                },
                showGroupingBar: true,
                dataBound: dataBound,
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('render testing', () => {
            expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
        });
        it('click car-quantity-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="5"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click jet-price-female', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('560');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Delhi');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 100);
        });
        it('click bike-quantity', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="8"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('170737.21999999997');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('New Jercy');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 100);
        });
        it('click price', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="9"]')[6].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header')[0].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('6370');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('New Jercy');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click delhi-quantity-female', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[2].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('61457.67');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Rajkot');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 500);
        });
        it('value axis to row', () => {
            pivotGridObj.dataSourceSettings.valueAxis = 'row';
        });
        it('click bike-balance-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Delhi');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 100);
        });
        it('click bike-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[0].dispatchEvent(event);
            setTimeout(() => {
                if (document.querySelectorAll('.e-drillthrough-dialog').length === 0) {
                    expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                } else {
                    expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                }
                done();
            }, 100);
        });
        it('value axis to column filter bike alone', () => {
            pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'column' } });
            pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Include', items: ['Bike'] }];
        });
    });
    describe('- no data', () => {
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
            PivotView.Inject(GroupingBar, DrillThrough, CalculatedField);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                    allowValueFilter: true,
                    allowLabelFilter: true,
                    dataSource: pivot_nodata as IDataSet[],
                    expandAll: false,
                    rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                    columns: [{ name: 'Product', showNoDataItems: true }, { name: 'Date', showNoDataItems: true }],
                    values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                    filterSettings: []
                },
                height: 300,
                width: 800,
                allowDrillThrough: true,
                beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
                    if (args.gridObj) {
                        let eventType: string = args.type;
                        let gridObj: Grid = args.gridObj;
                        gridObj.allowKeyboard = false;
                    }
                },
                showGroupingBar: true,
                dataBound: dataBound,
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 100);
        });
        it('state no data', () => {
            expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
        });
        it('click empty data', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 300);
        });
        it('click balance', (done: Function) => {
            document.querySelectorAll('th[aria-colindex="2"]')[0].querySelector('.e-headertext').dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                pivotGridObj.isAdaptive = true;
                pivotGridObj.render();
                done();
            }, 300);
        });
        it('click Bike adaptive', (done: Function) => {
            document.querySelectorAll('th[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                done();
            }, 300);
        });
    });
    describe('- Virtual scrolling', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(GroupingBar, DrillThrough, CalculatedField, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                    rows: [{ name: 'product' }, { name: 'state' }],
                    columns: [{ name: 'gender' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'price' }], filters: [{ name: 'index' }],
                    allowValueFilter: true,
                    allowLabelFilter: true
                },
                height: 300,
                width: 800,
                allowDrillThrough: true,
                enableVirtualization: true,
                showGroupingBar: true,
                dataBound: dataBound,
                virtualScrollSettings: { allowSinglePage: false }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 500);
        });
        let event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        it('render testing', () => {
            expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
        });
        it('click car-quantity-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="5"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Car');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('male');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('102234.66000000005');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Californiya');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 500);
        });
        it('click jet-price-female', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('560');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Delhi');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 500);
        });
        it('click bike-quantity', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="8"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('170737.21999999997');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('New Jercy');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 500);
        });
        it('click price', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="9"]')[6].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header')[0].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('6370');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('New Jercy');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 500);
        });
        it('click delhi-quantity-female', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[2].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('61457.67');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Rajkot');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 500);
        });
        it('value axis to row', () => {
            pivotGridObj.dataSourceSettings.valueAxis = 'row';
        });
        it('click bike-balance-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Delhi');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click bike-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                done();
            }, 500);
        });
        it('click delhi-quantity-female', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[19].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Tempo - price');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('price');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('625807.73');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 500);
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