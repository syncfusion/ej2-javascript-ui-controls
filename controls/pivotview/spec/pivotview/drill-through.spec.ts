import { IDataSet } from '../../src/base/engine';
import { pivot_dataset, pivot_nodata } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType, isNullOrUndefined } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { BeginDrillThroughEventArgs, DrillThroughEventArgs } from '../../src/common/base/interface';
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
            setTimeout(() => { done(); }, 1000);
        });
        it('state no data', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(0);
                done();
            }, 1000);
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
            setTimeout(() => { done(); }, 1000);
        });
        let event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        it('render testing', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
                done();
            }, 1000);
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

    describe('- Using CSV data', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        let csvdata: string = "Region,Country,Item Type,Sales Channel,Order Priority,Order Date,Order ID,Ship Date,Units Sold,Unit Price,Unit Cost,Total Revenue,Total Cost,Total Profit\r\n" +
        "Middle East and North Africa,Libya,Cereal,Offline,M,10/18/2014,686800706,10/31/2014,8446,437.20,263.33,3692591.20,2224085.18,1468506.02\r\n" +
        "North America,Canada,Cosmetics,Online,M,11/7/2011,185941302,12/8/2011,3018,154.06,90.93,464953.08,274426.74,190526.34\r\n" +
        "Asia,Japan,Cereal,Offline,C,4/10/2010,161442649,5/12/2010,3322,205.70,117.11,683335.40,389039.42,294295.98\r\n" +
        "Sub-Saharan Africa,Chad,Cosmetics,Offline,H,8/16/2011,645713555,8/31/2011,9845,9.33,6.92,91853.85,68127.40,23726.45\r\n" +
        "Europe,Armenia,Cosmetics,Online,H,11/24/2014,683458888,12/28/2014,9528,205.70,117.11,1959909.60,1115824.08,844085.52\r\n" +
        "Sub-Saharan Africa,Eritrea,Cereal,Online,H,3/4/2015,679414975,4/17/2015,2844,205.70,117.11,585010.80,333060.84,251949.96\r\n";
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
                    dataSource: getCSVData(),
                    type: 'CSV',
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    allowValueFilter: true,
                    rows: [
                        { name: 'Region' },
                        { name: 'Country' }
                    ], columns: [
                        { name: 'Item Type' },
                        { name: 'Sales Channel' }
                    ], values: [
                        { name: 'Total Cost' },
                        { name: 'Total Revenue' },
                        { name: 'Total', type: 'CalculatedField' }
                    ],
                    filters: [],
                    calculatedFieldSettings: [{ name: 'Total', formula: '"Sum(Total Cost)"' }]
                },
                width: '100%',
                editSettings: { allowEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                allowDrillThrough: true,
                dataBound: dataBound,
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        function getCSVData(): string[][] {
            let dataSource: string[][] = [];
            let jsonObject: string[] = csvdata.split(/\r?\n|\r/);
            for (let i: number = 0; i < jsonObject.length; i++) {
                if (!isNullOrUndefined(jsonObject[i]) && jsonObject[i] !== '') {
                    dataSource.push(jsonObject[i].split(','));
                }
            }
            return dataSource;
        }
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Editing cell value', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[1].dispatchEvent(new Event('dblclick', { bubbles: true }));
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="2"]')[0].dispatchEvent(new Event('dblclick', { bubbles: true }));
                document.querySelectorAll('.e-spin-up')[0].dispatchEvent(new Event('mouseup', { bubbles: true }));
                document.getElementById('PivotGrid_drillthroughgrid_update').dispatchEvent(new Event('click', { bubbles: true }));
                document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0].dispatchEvent(new Event('click', { bubbles: true }));
                expect(document.querySelectorAll('.e-drillthrough-grid td[data-colindex="1"]')[0].textContent).toBe('389040.42');
                done();
            }, 1000);
        });
    });

    describe('- Using drillthrough event', () => {
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
                    expandAll: true,
                    enableSorting: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: []
                },
                width: '100%',
                editSettings: { allowEditing: true, allowInlineEditing: true, allowAdding: true, allowDeleting: true, mode: 'Normal' },
                allowDrillThrough: true,
                drillThrough: function (args: DrillThroughEventArgs) {
                    args.rawData = [args.rawData[1]];
                },
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('Render testing', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="5"]')[1].dispatchEvent(new Event('dblclick', { bubbles: true }));
            setTimeout(() => {
                document.querySelectorAll('.e-spin-up')[0].dispatchEvent(new Event('mouseup', { bubbles: true }));
                expect(document.querySelectorAll('.e-pivot-button').length).toBe(0);
                done();
            }, 1000);
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
    describe('- datacompression', () => {
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
                allowDataCompression: true,
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
        it('render testing', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
                done();
            }, 1000);
        });
        it('click car-quantity-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="5"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 500);
        });
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
        it('render testing', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
                done();
            }, 1000);
        });
        it('click car-quantity-male', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="5"]')[1].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-dialog').length).toBe(1);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 300);
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