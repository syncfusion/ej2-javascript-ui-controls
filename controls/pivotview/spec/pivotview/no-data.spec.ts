import { IDataOptions, IDataSet } from '../../src/base/engine';
import { pivot_nodata } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, extend } from '@syncfusion/ej2-base';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { VirtualScroll } from '../../src/pivotview/actions';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe(' - no data', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe(' - no data', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let noData: IDataSet[] = [
            { "Teams": "Application Support", "Priority": "p1", "Calls": 4 },
            { "Teams": "Application Support", "Priority": "p2", "Calls": 1 },
            { "Teams": "Application Support", "Priority": "p3", "Calls": 2 },
            { "Teams": "Service Desk", "Priority": "p1", "Calls": 4 },
            { "Teams": "Service Desk", "Priority": "p2", "Calls": 1 },
            { "Teams": "Service Desk", "Priority": "p3", "Calls": 2 },
            { "Teams": "Network Support", "Priority": "p4", "Calls": 5 },
            { "Teams": "Network Support", "Priority": "p5", "Calls": 6 }
        ];
        document.body.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(FieldList, CalculatedField);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    expandAll: true,
                    dataSource: noData as IDataSet[],
                    rows: [{ name: 'Teams', showNoDataItems: true }],
                    columns: [{ name: 'Priority', showNoDataItems: true }],
                    values: [{ name: 'Calls', showNoDataItems: true }],
                    allowLabelFilter: true,
                    allowValueFilter: true
                },
                showFieldList: true,
                allowCalculatedField: true,
                height: 400
            });
            pivotGridObj.appendTo('#PivotGrid');
        });

        let dataSourceSettings: IDataOptions
        it('pivotgrid render testing', (done: Function) => {
            dataSourceSettings = extend({}, pivotGridObj.dataSourceSettings, null, true);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Network Support');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="4"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('5');
                done();
            }, 1000);
        });
        it('priority to row', (done: Function) => {
            pivotGridObj.setProperties({
                dataSourceSettings: {
                    rows: [{ name: 'Teams', showNoDataItems: true }, { name: 'Priority', showNoDataItems: true }]
                }
            }, true);
            pivotGridObj.dataSourceSettings.columns = [];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                // expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Application Support');
                // expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[4] as HTMLElement).innerText).toBe('p4');
                // expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[4] as HTMLElement).innerText).toBe('');
                done();
            }, 1000);
        });
        it('swap row elements', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows = [
                { name: 'Priority', showNoDataItems: true },
                { name: 'Teams', showNoDataItems: true }
            ];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Network Support');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[14] as HTMLElement).innerText).toBe('Network Support');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[14] as HTMLElement).innerText).toBe('5');
                done();
            }, 1000);
        });
        it('swap to columns', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { rows: [] } }, true);
            pivotGridObj.dataSourceSettings.columns = [
                { name: 'Priority', showNoDataItems: true },
                { name: 'Teams', showNoDataItems: true }
            ];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="13"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('th[aria-colindex="13"] .e-headertext')[0] as HTMLElement).innerText).toBe('Application Support');
                expect((document.querySelectorAll('td[aria-colindex="14"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('5');
                expect((document.querySelectorAll('th[aria-colindex="14"] .e-headertext')[0] as HTMLElement).innerText).toBe('Network Support');
                done();
            }, 1000);
        });
        it('swap to rows', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { columns: [] } }, true);
            pivotGridObj.dataSourceSettings.rows = [
                { name: 'Priority', showNoDataItems: true },
                { name: 'Teams', showNoDataItems: true }
            ];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Network Support');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[14] as HTMLElement).innerText).toBe('Network Support');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[14] as HTMLElement).innerText).toBe('5');
                done();
            }, 1000);
        });
        it('exclude p4,p5', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows = [
                { name: 'Teams', showNoDataItems: true },
                { name: 'Priority', showNoDataItems: true }
            ];
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'Priority', type: 'Exclude', items: ['p4', 'p5'] }
            ],
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[4] as HTMLElement).innerText).toBe('Network Support');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[4] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[8] as HTMLElement).innerText).toBe('7');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[7] as HTMLElement).innerText).toBe('');
                done();
            }, 1000);
        });
        it('exclude p1,p2,p3', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'Priority', type: 'Include', items: ['p4', 'p5'] }
            ],
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Application Support');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('p4');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Network Support');
                done();
            }, 1000);
        });
        it('dont show priority no items', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows[1].showNoDataItems = false;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Application Support');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('p4');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Network Support');
                done();
            }, 1000);
        });
        it('sort teams', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { sortSettings: [{ name: 'Teams', order: 'Descending' }] } }, true);
            pivotGridObj.dataSourceSettings.rows[1].showNoDataItems = true;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Service Desk');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('p4');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Network Support');
                done();
            }, 1000);
        });
        it('sort priority', (done: Function) => {
            pivotGridObj.dataSourceSettings.sortSettings = [{ name: 'Priority', order: 'Descending' }];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Application Support');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('p5');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Network Support');
                done();
            }, 1000);
        });
        it('change data source', (done: Function) => {
            pivotGridObj.setProperties({
                dataSourceSettings: {
                    dataSource: pivot_nodata,
                    expandAll: false,
                    drilledMembers: [{ name: 'Country', items: ['Canada'] }],
                    rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                    columns: [{ name: 'Product', showNoDataItems: true }, { name: 'Date', showNoDataItems: true }],
                    values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                    filterSettings: []
                }
            }, true);
            pivotGridObj.dataSourceSettings.sortSettings = [];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('99960');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Bayern');
                done();
            }, 1000);
        });
        it('filter state BeginWith e', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'State', type: 'Label', condition: 'BeginWith', value1: 'e' }
            ]
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('England');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('France');
                done();
            }, 1000);
        });
        it('filter state DoesNotBeginWith e', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { drilledMembers: [{ name: 'Country', items: ['United Kingdom'] }] } });
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'State', type: 'Label', condition: 'DoesNotBeginWith', value1: 'e' }
            ]
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('United Kingdom');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[13] as HTMLElement).innerText).toBe('Garonne (Haute)');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[13] as HTMLElement).innerText).toBe('');
                done();
            }, 1000);
        });
        it('state nodata false', (done: Function) => {
            pivotGridObj.setProperties({
                dataSourceSettings: {
                    rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: false }],
                    drilledMembers: [{ name: 'Country', items: ['Canada'] }],
                }
            }, true);
            pivotGridObj.dataSourceSettings.filterSettings = [];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('99960');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('5250');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Brunswick');
                done();
            }, 1000);
        });
        it('filter state BeginWith e', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'State', type: 'Label', condition: 'BeginWith', value1: 'e' }
            ]
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('England');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('France');
                done();
            }, 1000);
        });
        it('filter state DoesNotBeginWith e', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { drilledMembers: [{ name: 'Country', items: ['United Kingdom'] }] } });
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'State', type: 'Label', condition: 'DoesNotBeginWith', value1: 'e' }
            ]
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('United Kingdom');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[13] as HTMLElement).innerText).toBe('Garonne (Haute)');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[13] as HTMLElement).innerText).toBe('');
                done();
            }, 1000);
        });
        it('filter clear', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('99960');
                done();
            }, 1000);
        });

        it('filter state quantity LessThan 500', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { drilledMembers: [{ name: 'Country', items: ['Canada'] }] } });
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'State', type: 'Value', condition: 'LessThan', value1: '500', measure: 'Quantity' }
            ]
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('19260');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('5250');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Grand Total');
                done();
            }, 1000);
        });
        it('filter state quantity GreaterThan 500', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'State', type: 'Value', condition: 'GreaterThan', value1: '500', measure: 'Quantity' }
            ]
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('80700');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('British Columbia');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('13500');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Ontario');
                done();
            }, 1000);
        });
        it('filter state quantity LessThan 500', (done: Function) => {
            pivotGridObj.setProperties({
                dataSourceSettings: {
                    rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                }
            }, true);
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'State', type: 'Value', condition: 'LessThan', value1: '500', measure: 'Quantity' }
            ]
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('19260');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('5250');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Grand Total');
                done();
            }, 1000);
        });
        it('filter state quantity GreaterThan 500', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'State', type: 'Value', condition: 'GreaterThan', value1: '500', measure: 'Quantity' }
            ]
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('80700');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('British Columbia');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('13500');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[3] as HTMLElement).innerText).toBe('Ontario');
                done();
            }, 1000);
        });
    });
    describe(' - virtual scroll ', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        document.body.appendChild(elem);
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    expandAll: true,
                    dataSource: pivot_nodata as IDataSet[],
                    rows: [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }],
                    columns: [{ name: 'Product', showNoDataItems: true }, { name: 'Date', showNoDataItems: true }],
                    values: [{ name: 'Amount' }, { name: 'Quantity' }], filters: [],
                },
                enableVirtualization: true,
                width: 800,
                height: 300
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let scrollEvent: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
        let upEvent: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
        let dataSourceSettings: IDataOptions
        it('pivotgrid render testing', (done: Function) => {
            dataSourceSettings = extend({}, pivotGridObj.dataSourceSettings, null, true);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                done();
            }, 2000);
        });
        it('state false', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows = [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: false }];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('2100');
                done();
            }, 2000);
        });
        it('include england', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'State', type: 'Include', items: ['England'] }
            ],
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('England');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('United Kingdom');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('1040');
                done();
            }, 2000);
        });
        it('exclude england', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'State', type: 'Exclude', items: ['England'] }
            ],
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alberta');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('2100');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Quebec');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('6400');
                done();
            }, 2000);
        });
        it('state true', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows = [{ name: 'Country', showNoDataItems: true }, { name: 'State', showNoDataItems: true }];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Brunswick');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('6300');
                done();
            }, 2000);
        });
        it('scroll bottom', (done: Function) => {
            document.querySelector('.e-movablecontent').scrollTop = 100;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Brunswick');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('6300');
                done();
            }, 2000);
        });
        it('scroll top', (done: Function) => {
            document.querySelector('.e-movablecontent').scrollTop = 0;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('Canada');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[0] as HTMLElement).innerText).toBe('28550');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('Alabama');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[1] as HTMLElement).innerText).toBe('');
                expect((document.querySelectorAll('td[aria-colindex="0"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('Brunswick');
                expect((document.querySelectorAll('td[aria-colindex="1"] .e-cellvalue')[6] as HTMLElement).innerText).toBe('6300');
                pivotGridObj.scrollerBrowserLimit = 1000;
                done();
            }, 2000);
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