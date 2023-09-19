import { IDataSet } from '../../src/base/engine';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import {
    BeginDrillThroughEventArgs
} from '../../src/common/base/interface';
import { Grid } from '@syncfusion/ej2-grids';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { DrillThrough } from '../../src/pivotview/actions';

describe('Group By Date feature', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe(' -  Initial Rendering and Value Sorting', () => {
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = pivotDatas as IDataSet[];
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
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    expandAll: false,
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    filterSettings: [{ name: 'date_date_group_years', type: 'Include', items: ['1970', '1971', '1972', '1973', '1974', '1975'] }],
                    rows: [{ name: 'date', caption: 'TimeLine' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance', caption: 'Balance' }],
                    filters: [{ name: 'product', caption: 'Category' }],
                    groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'] }],
                    alwaysShowValueHeader: true
                },
                enableValueSorting: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Check date groups initially', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('1975');
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 100);
        });
        it('Check single value header', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('1975');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 100);
        });
        it('Check date groups after value sorting', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('1975');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 100);
        });
        it('Check group settings update using on proptery', (done: Function) => {
            pivotGridObj.dataSourceSettings.groupSettings[0].groupInterval = ['Years', 'Quarters', 'Months', 'Days', 'Hours'];
            setTimeout(() => {
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 100);
        });
        it('Check group settings update using on proptery', (done: Function) => {
            pivotGridObj.dataSourceSettings.groupSettings = [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
            { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 }];
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 100);
        });
        it('Check date groups initially', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="2"]')[0].textContent).toBe('Balance');
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 100);
        });
        it('Check single value header', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[aria-colindex="2"]')[0].textContent).toBe('Balance');
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 100);
        });
        it('Check date groups after value sorting', (done: Function) => {
            setTimeout(() => {
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 100);
        });
        it('Check group settings update using on proptery', (done: Function) => {
            pivotGridObj.dataSourceSettings.groupSettings[0].groupInterval = ['Years', 'Quarters', 'Months', 'Days', 'Hours'];
            setTimeout(() => {
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 100);
        });
        it('Update dataSourceSettings', (done: Function) => {
            pivotGridObj.dataSourceSettings.groupSettings = [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
            { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 }];
            pivotGridObj.dataSourceSettings.rows = [{ name: 'date', caption: 'TimeLine' }];
            pivotGridObj.dataSourceSettings.columns = [{ name: 'age' }, { name: 'gender', caption: 'Population' }];
            pivotGridObj.dataSourceSettings.values = [{ name: 'balance', caption: 'Balance' }];
            pivotGridObj.dataSourceSettings.filters = [{ name: 'product', caption: 'Category' }];
            setTimeout(() => {
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 100);
        });
        it('Check date groups initially', (done: Function) => {
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[data-colindex="1"]')[0].textContent).toBe('27-31');
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 100);
        });
        it('Check single value header', (done: Function) => {
            setTimeout(() => {
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                (pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).click();
                done();
            }, 100);
        });
        it('Check group settings update using on proptery', (done: Function) => {
            pivotGridObj.dataSourceSettings.groupSettings[0].groupInterval = ['Years', 'Quarters', 'Months', 'Days', 'Hours'];
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('th[data-colindex="3"]')[0].textContent).toBe('Out of Range');
                expect((pivotGridObj.element.querySelector('.e-firstcell') as HTMLInputElement).innerText.trim() === 'Balance').toBeTruthy();
                done();
            }, 100);
        });
    });
    describe(' -  Initial Rendering with range - PivotChart', () => {
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = pivotDatas as IDataSet[];
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
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    expandAll: false,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    rows: [{ name: 'date', caption: 'TimeLine' }],
                    columns: [{ name: 'age' }, { name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance', caption: 'Balance' }],
                    filters: [{ name: 'product', caption: 'Category' }],
                    groupSettings: [{ name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                    { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 }],
                    alwaysShowValueHeader: true
                },
                chartSettings: {
                    chartSeries: { type: 'Column', animation: { enable: false } }
                },
                displayOption: { view: 'Chart' },
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('Group settings with chart - Days on values', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows = [{ name: 'date_date_group_years' }, { name: 'date_date_group_quarters' }, { name: 'date_date_group_months' }];
            pivotGridObj.dataSourceSettings.values = [{ name: 'date' }];
            setTimeout(() => {
                expect(document.getElementById('PivotGrid_chart_Series_0_Point_0').getAttribute('aria-label')).toBe('Out of Range:4856.54, 27-31');
                done();
            }, 100);
        });
        it('Group settings with chart - Days and Months on values', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows = [{ name: 'date_date_group_years' }, { name: 'date_date_group_quarters' }];
            pivotGridObj.dataSourceSettings.values = [{ name: 'date' }, { name: 'date_date_group_months' }];
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 100);
        });
        it('Group settings with chart - Days, Months and Quarters on values', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows = [{ name: 'date_date_group_years' }];
            pivotGridObj.dataSourceSettings.values = [{ name: 'date' }, { name: 'date_date_group_months' }, { name: 'date_date_group_quarters' }];
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 100);
        });
        it('Group settings with chart - Days, Months, Quarters and Years on values', (done: Function) => {
            pivotGridObj.dataSourceSettings.rows = [];
            pivotGridObj.dataSourceSettings.values = [{ name: 'date' }, { name: 'date_date_group_months' }, { name: 'date_date_group_years' }, { name: 'date_date_group_quarters' }];
            setTimeout(() => {
                expect(1).toBe(1);
                done();
            }, 100);
        });
    });
    describe('- Editing - normal', () => {
        let pivotGridObj: PivotView;
        let ds: IDataSet[] = pivotDatas as IDataSet[];
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
                    dataSource: pivotDatas as IDataSet[],
                    expandAll: false,
                    allowLabelFilter: true,
                    formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    filterSettings: [{ name: 'date_date_group_years', type: 'Exclude', items: ['1970', '1971', '1972', '1973', '1974', '1975'] }],
                    rows: [{ name: 'date', caption: 'TimeLine' }],
                    columns: [{ name: 'gender', caption: 'Population' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [{ name: 'product', caption: 'Category' }],
                    groupSettings: [{ name: 'date', groupInterval: ['Years', 'Quarters', 'Months', 'Days'] }]
                },
                height: 300,
                width: 800,
                allowDrillThrough: true,
                editSettings: {
                    allowAdding: true, allowDeleting: true, allowEditing: true,
                    showConfirmDialog: false, showDeleteConfirmDialog: false, allowCommandColumns: false, mode: 'Normal'
                },
                beginDrillThrough: (args: BeginDrillThroughEventArgs) => {
                    if (args.gridObj) {
                        let eventType: string = args.type;
                        let gridObj: Grid = args.gridObj;
                        gridObj.allowKeyboard = false;
                    }
                },
                showGroupingBar: true,
                dataBound: dataBound
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let event: MouseEvent = new MouseEvent('dblclick', {
            'view': window,
            'bubbles': true,
            'cancelable': true
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
        it('render testing', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivot-button').length).toBe(4);
                done();
            }, 100);
        });
        it('render testing', (done: Function) => {
            setTimeout(() => {
                document.querySelectorAll('td[aria-colindex="4"]')[0].dispatchEvent(event);
                done();
            }, 100);
        });
        it('click female-balance', (done: Function) => {
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("13");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 100);
        });
        it('click female-quantity', () => {
            expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("47");
            if (document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0]) {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mouseup);
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("14");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
            }
        });
    });
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