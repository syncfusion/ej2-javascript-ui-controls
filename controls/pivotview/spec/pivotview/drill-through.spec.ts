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
            this.skip(); //Skips test (in Chai)
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
            setTimeout(() => { done(); }, 1000);
        });
        it('render testing', () => {
            expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
        });
        it('click bike-female-balance', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-grid .e-groupdroparea')).toBeTruthy();
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('72975.03000000001');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="1"]')[2].textContent).toBe('Delhi');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click car-quantity-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="5"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Car');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('male');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('585');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Car');
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
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('price');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('1007288.6399999999');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Jet');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click bike-quantity', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="8"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('1060');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click female-balance', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="1"]')[6].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('477089.13');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Jet');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click price', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="9"]')[6].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header')[0].textContent).toBe('price');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('11314903.290000001');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Car');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('expand bike', (done: Function) => {
            (document.querySelectorAll('td[aria-colindex="0"] .e-expand')[0] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Delhi');
                done();
            }, 1000);
        });
        it('click delhi-quantity-female', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[2].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike - Delhi');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('79');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('value axis to row', (done: Function) => {
            pivotGridObj.dataSourceSettings.valueAxis = 'row';
            setTimeout(() => {
                expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('quantity');
                done();
            }, 1000);
        });
        it('click bike-balance-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('male');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('97762.19000000002');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click bike-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                done();
            }, 1000);
        });
        it('value axis to column filter bike alone', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'column' } });
            pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Include', items: ['Bike'] }];
            setTimeout(() => {
                expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Delhi');
                done();
            }, 1000);
        });
        it('click quantity-female', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[7].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('478');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click quantity-female keyboard', (done: Function) => {
            (pivotGridObj.keyboardModule as any).keyActionHandler({ action: 'enter', target: document.querySelectorAll('td[aria-colindex="2"]')[7], preventDefault: (): void => { /** Null */ } });
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('478');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click bike', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="0"]')[0].querySelector('.e-cellvalue').dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                done();
            }, 1000);
        });
        it('click female', (done: Function) => {
            document.querySelectorAll('th[aria-colindex="1"]')[0].querySelector('.e-stackedheadercelldiv').dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                done();
            }, 1000);
        });
        it('state no data', (done: Function) => {
            pivotGridObj.setProperties({
                dataSourceSettings: {
                    dataSource: pivot_nodata as IDataSet[],
                    expandAll: false,
                    rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                    columns: [{ name: 'Product', showNoDataItems: true }, { name: 'Date', showNoDataItems: true }],
                    values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                    filterSettings: []
                }
            }, true);
            pivotGridObj.dataSourceSettings.drilledMembers = [{ name: 'Country', items: ['Canada'] }];
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                done();
            }, 1000);
        });
        it('click empty data', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="1"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click balance', (done: Function) => {
            document.querySelectorAll('th[aria-colindex="1"]')[1].querySelector('.e-headertext').dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                pivotGridObj.isAdaptive = true;
                pivotGridObj.render();
                done();
            }, 1000);
        });
        it('click Bike adaptive', (done: Function) => {
            document.querySelectorAll('th[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                done();
            }, 1000);
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
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        let event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        it('render testing', () => {
            expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
        });
        it('click bike-female-balance', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('72975.03000000001');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="1"]')[2].textContent).toBe('Delhi');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click car-quantity-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="5"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Car');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('male');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('585');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Car');
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
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('price');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('1007288.6399999999');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Jet');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click bike-quantity', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="8"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('1060');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click female-balance', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="1"]')[6].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('477089.13');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Jet');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click price', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="9"]')[6].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header')[0].textContent).toBe('price');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('11314903.290000001');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Car');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('expand bike', (done: Function) => {
            (document.querySelectorAll('td[aria-colindex="0"] .e-expand')[0] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Delhi');
                done();
            }, 1000);
        });
        it('click delhi-quantity-female', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[2].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike - Delhi');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('79');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('value axis to row', (done: Function) => {
            pivotGridObj.dataSourceSettings.valueAxis = 'row';
            setTimeout(() => {
                expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('quantity');
                done();
            }, 1000);
        });
        it('click bike-balance-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Bike');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('male');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of balance');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('97762.19000000002');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click bike-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                done();
            }, 1000);
        });
        it('value axis to column filter bike alone', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'column' } });
            pivotGridObj.dataSourceSettings.filterSettings = [{ name: 'product', type: 'Include', items: ['Bike'] }];
            setTimeout(() => {
                expect(document.querySelectorAll('td[aria-colindex="0"]')[2].textContent).toBe('Delhi');
                done();
            }, 1000);
        });
        it('click quantity-female', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[7].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[1].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('478');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Bike');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('filter clear expand all', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { expandAll: true } });
            pivotGridObj.dataSourceSettings.filterSettings = [];
            setTimeout(() => {
                expect(document.querySelectorAll('td[aria-colindex="0"]')[7].textContent).toBe('Vetaikan');
                done();
            }, 1000);
        });
        it('scroll bottom', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 1265;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                expect(document.querySelectorAll('td[aria-colindex="0"]')[1].textContent).toBe('Tamilnadu');
                done();
            }, 1000);
        });
        it('click delhi-quantity-female', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[19].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[0].textContent).toBe('Van - Delhi');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[1].textContent).toBe('female');
                expect(document.querySelectorAll('.e-drillthrough-body-header')[2].textContent).toBe('Sum of quantity');
                expect(document.querySelectorAll('.e-drillthrough-body-header-value')[2].textContent).toBe('52');
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[2].textContent).toBe('Van');
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
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