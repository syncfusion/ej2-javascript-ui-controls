import { IDataSet } from '../../src/base/engine';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType, getInstance } from '@syncfusion/ej2-base';
import { Grouping } from '../../src/common/popups/grouping';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { DrillThrough, VirtualScroll } from '../../src/pivotview/actions';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { MaskedTextBox, NumericTextBox } from '@syncfusion/ej2-inputs';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { pivot_dataset } from './datasource.spec';
import * as util from '../utils.spec';

describe('Label Filtering', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
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
    describe('Label Filtering', () => {
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
            PivotView.Inject(GroupingBar, DrillThrough, CalculatedField, Grouping, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
                    { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
                    rows: [{ name: 'product', caption: 'Category' }],
                    values: [{ name: 'balance', caption: 'Balance($)' }, { name: 'quantity' }],
                    columns: [{ name: 'age' }],
                    filters: [{ name: 'gender', caption: 'Population' }, { name: 'date', caption: 'TimeLine' }],
                    groupSettings: [
                        { name: 'date', type: 'Date', groupInterval: ['Years', 'Quarters'], startingAt: new Date(1975, 0, 10), endingAt: new Date(2005, 10, 5) },
                    { name: 'age', type: 'Number', startingAt: 25, endingAt: 35, rangeInterval: 5 },
                    { name: 'product', type: 'Custom', customGroups: [{ groupName: 'Four wheelers', items: ['Car', 'Tempo', 'Van'] }, { groupName: 'Airways', items: ['Jet', 'Flight'] }] }
                    ]
                },
                dataBound: dataBound,
                showGroupingBar: true,
                showFieldList: true,
                allowGrouping: true,
                allowCalculatedField: true,
                height: 500,
                width: 1000
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let shiftClick: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'shiftKey': true
        });
        let ctrlClick: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'ctrlKey': true
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
        it('Check date groups initially', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                done();
            }, 1000);
        });
        it('Check date groups initially', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelector('[aria-colindex="1"][index="3"]').dispatchEvent(ctrlClick);
            setTimeout(() => {
                document.querySelector('[aria-colindex="1"][index="4"]').dispatchEvent(ctrlClick);
                done();
            }, 1000);
        });
        it('Check single value header', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotGridObj.lastCellClicked = document.querySelector('[aria-colindex="1"][index="4"]');
                let cell: HTMLElement = document.querySelector('[aria-colindex="1"][index="4"]');
                util.triggerMouseEvent(cell, 'contextmenu');
                done();
            }, 1000);
        });
        it('Perform group option for selected headers', (done: Function) => {
            (document.querySelector('#' + pivotGridObj.element.id + '_custom_group') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                expect(document.querySelector('.e-group-field-settings').querySelector('.e-group-caption-text').getAttribute('value')).toBe('Category2');
                done();
            }, 1000);
        });
        it('Update without group name for false statement', (done: Function) => {
            (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelector('.e-group-field-settings')).toBeTruthy();
                done();
            }, 1000);
        });
        it('Assign new group name for selected headers', (done: Function) => {
            let input1: MaskedTextBox = getInstance(document.querySelector('#' + pivotGridObj.element.id + 'group_input_option') as HTMLElement, MaskedTextBox) as MaskedTextBox;
            expect(input1).toBeTruthy;
            input1.value = 'Airways';
            setTimeout(() => {
                expect(input1.value).toBe('Airways');
                (document.querySelector('.e-group-field-settings').querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('Check updated new group selected headers in table', (done: Function) => {
            expect(document.querySelector('.e-group-field-settings') == null).toBeTruthy();
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[0].textContent).toBe('Airways');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[1].textContent).toBe('Flight');
                expect(pivotGridObj.element.querySelectorAll('td[aria-colindex="1"]')[2].textContent).toBe('Jet');
                done();
            }, 1000);
        });
    });
    describe('Single page mode', () => {
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
            PivotView.Inject(GroupingBar, DrillThrough, CalculatedField, Grouping, FieldList, VirtualScroll);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowLabelFilter: true,
                    formatSettings: [{ name: 'age', format: 'N' }, { name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm a', type: 'date' }],
                    calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
                    { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
                    rows: [{ name: 'date', caption: 'Category' }, { name: 'product' }],
                    values: [{ name: 'balance', caption: 'Balance($)' }, { name: 'quantity' }],
                    columns: [{ name: 'age', caption: 'Category' }]
                },
                dataBound: dataBound,
                showGroupingBar: true,
                showFieldList: true,
                allowGrouping: true,
                allowCalculatedField: true,
                enableVirtualization: true,
                virtualScrollSettings: {
                    allowSinglePage: true
                },
                height: 500,
                width: 1000
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let shiftClick: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'shiftKey': true
        });
        let ctrlClick: MouseEvent = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true,
            'ctrlKey': true
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
        it('Initial render ', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[7][5].formattedText).toBe('$1,912.32');
                done();
            }, 500);
        });
        it('Scrolling vertical', (done: Function) => {
            document.querySelectorAll('.e-content')[0].scrollTop = 10000;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("touchstart", { clientY: 1000, view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[13][7].formattedText).toBe('$3,060.54');
                done();
            }, 1000);
        });
        it('Scrolling horizontal', (done: Function) => {
            document.querySelectorAll('.e-movablescrolldiv')[0].scrollLeft = 500;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("touchstart", { clientX: 1000, view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelectorAll('.e-content')[0].dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.pivotValues[13][7].formattedText).toBe('$3,060.54');
                done();
            }, 500);
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

describe('Pivot Table - Top and Bottom Value Filters', () => {
    let pivotGridObj: PivotView;
    let element: HTMLElement;
    beforeAll(() => {
        const isDefined = (value: any): boolean => value !== undefined && value !== null;
        if (!isDefined((window as any).performance)) {
            console.log('Unsupported environment: window.performance.memory is unavailable');
            pending();
        }
    });
    beforeAll((done: Function) => {
        element = createElement('div', { id: 'PivotGrid' });
        document.body.appendChild(element);
        PivotView.Inject(GroupingBar, FieldList, VirtualScroll);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                enableSorting: true,
                allowValueFilter: true,
                allowMemberFilter: false,
                formatSettings: [{ name: 'balance', format: 'C' }],
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: [],
                filterSettings: [
                    {
                        condition: 'Top',
                        items: [],
                        levelCount: 1,
                        measure: 'quantity',
                        name: 'product',
                        type: 'Value',
                        value1: '2',
                        value2: '0'
                    },
                    {
                        condition: 'Bottom',
                        items: [],
                        levelCount: 1,
                        measure: 'balance',
                        name: 'eyeColor',
                        type: 'Value',
                        value1: '1',
                        value2: '0'
                    }
                ]
            },
            showFieldList: true,
            showGroupingBar: true,
            width: 1000,
            height: 400,
            dataBound: () => done()
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(element);
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });
    it('Top and Bottom value filter on row axis - product field', (done: Function) => {
        setTimeout(function () {
            expect((pivotGridObj.engineModule.pivotValues[3][4] as IDataSet).formattedText).toBe("86");
            pivotGridObj.dataSourceSettings.filterSettings = [
                {
                    condition: 'Bottom',
                    items: [],
                    levelCount: 1,
                    measure: 'quantity',
                    name: 'product',
                    type: 'Value',
                    value1: '2',
                    value2: '0'
                },
                {
                    condition: 'Top',
                    items: [],
                    levelCount: 1,
                    measure: 'balance',
                    name: 'eyeColor',
                    type: 'Value',
                    value1: '1',
                    value2: '0'
                }
            ];
            done();
        }, 1000);
    });
    it('Bottom value filter on column axis - gender field', (done: Function) => {
        setTimeout(function () {
            expect((pivotGridObj.engineModule.pivotValues[3][4] as IDataSet).formattedText).toBe("79");
            pivotGridObj.dataSourceSettings.filterSettings = [
                {
                    condition: 'Bottom',
                    items: [],
                    levelCount: 1,
                    measure: 'quantity',
                    name: 'gender',
                    type: 'Value',
                    value1: '1',
                    value2: '0'
                },
                {
                    condition: 'Top',
                    items: [],
                    levelCount: 1,
                    measure: 'balance',
                    name: 'isActive',
                    type: 'Value',
                    value1: '1',
                    value2: '0'
                }
            ];
            done();
        }, 1000);
    });
    it('Top value filter on column axis - gender and isActive fields', (done: Function) => {
        setTimeout(function () {
            expect((pivotGridObj.engineModule.pivotValues[3][4] as IDataSet).formattedText).toBe("252");
            pivotGridObj.dataSourceSettings.filterSettings = [
                {
                    condition: 'Top',
                    items: [],
                    levelCount: 1,
                    measure: 'quantity',
                    name: 'gender',
                    type: 'Value',
                    value1: '1',
                    value2: '0'
                },
                {
                    condition: 'Bottom',
                    items: [],
                    levelCount: 1,
                    measure: 'balance',
                    name: 'isActive',
                    type: 'Value',
                    value1: '1',
                    value2: '0'
                }
            ];
            done();
        }, 1000);
    });
    it('Value filter testing with negative values', (done: Function) => {
        setTimeout(function () {
            expect((pivotGridObj.engineModule.pivotValues[3][4] as IDataSet).formattedText).toBe("271");
            pivotGridObj.dataSourceSettings.filterSettings = [
                {
                    condition: 'Top',
                    items: [],
                    levelCount: 1,
                    measure: 'quantity',
                    name: 'gender',
                    type: 'Value',
                    value1: '-12',
                    value2: '0'
                },
                {
                    condition: 'Bottom',
                    items: [],
                    levelCount: 1,
                    measure: 'balance',
                    name: 'isActive',
                    type: 'Value',
                    value1: '-7',
                    value2: '0'
                }
            ];
            done();
        }, 1000);
    });
    it('Value filter testing with negative values', (done: Function) => {
        setTimeout(function () {
            expect((pivotGridObj.engineModule.pivotValues[4][1] as IDataSet).actualText).toBe('balance');
            pivotGridObj.dataSourceSettings.filterSettings = [];
            done();
        }, 1000);
    });
    it('memory leak check', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        expect(average).toBeLessThan(10);
    });
});

describe('Pivot Table - Top and Bottom Value Filters via UI', () => {
    let pivotGridObj: PivotView;
    let element: HTMLElement;
    beforeAll(() => {
        const isDefined = (value: any): boolean => value !== undefined && value !== null;
        if (!isDefined((window as any).performance)) {
            console.log('Unsupported environment: window.performance.memory is unavailable');
            pending();
        }
    });
    beforeAll((done: Function) => {
        element = createElement('div', { id: 'PivotGrid' });
        document.body.appendChild(element);
        PivotView.Inject(GroupingBar, FieldList, VirtualScroll);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                enableSorting: true,
                allowValueFilter: true,
                allowMemberFilter: false,
                formatSettings: [{ name: 'balance', format: 'C' }],
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'quantity' }],
                filters: [],
                filterSettings: [
                    {
                        condition: 'Top',
                        items: [],
                        measure: 'quantity',
                        name: 'product',
                        type: 'Value',
                        value1: '1',
                        value2: '0'
                    }
                ]
            },
            showFieldList: true,
            showGroupingBar: true,
            width: 1000,
            height: 400,
            dataBound: () => done()
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(element);
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });
    it('Bottom value filter via UI on row axis - eyeColor field', (done: Function) => {
        setTimeout(function () {
            expect((pivotGridObj.engineModule.pivotValues[3][4] as IDataSet).formattedText).toBe("128");
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[1]).querySelector('.e-btn-filter') as HTMLElement).click();
            document.getElementsByClassName('e-ddl')[1].dispatchEvent(new Event('mousedown', { bubbles: true }));
            document.querySelectorAll('.e-filter-operator .e-list-item')[9].dispatchEvent(new Event('click', { bubbles: true }));
            document.querySelectorAll('.e-spin-down')[0].dispatchEvent(new Event('mouseup', { bubbles: true }));
            (document.querySelector('.e-ok-btn') as HTMLElement).click();
            pivotGridObj.dataSourceSettings.filterSettings = [];
            done();
        }, 1000);
    });
    it('Top value filter via UI on row axis - eyeColor field', (done: Function) => {
        setTimeout(function () {
            expect((pivotGridObj.engineModule.pivotValues[3][4] as IDataSet).formattedText).toBe("128");
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[1]).querySelector('.e-btn-filter') as HTMLElement).click();
            document.getElementsByClassName('e-ddl')[1].dispatchEvent(new Event('mousedown', { bubbles: true }));
            document.querySelectorAll('.e-filter-operator .e-list-item')[8].dispatchEvent(new Event('click', { bubbles: true }));
            document.querySelectorAll('.e-spin-down')[0].dispatchEvent(new Event('mouseup', { bubbles: true }));
            (document.querySelector('.e-ok-btn') as HTMLElement).click();
            pivotGridObj.dataSourceSettings.filterSettings = [];
            done();
        }, 1000);
    });
    it('Bottom value filter via UI on column axis - gender field', (done: Function) => {
        setTimeout(function () {
            expect((pivotGridObj.engineModule.pivotValues[3][4] as IDataSet).formattedText).toBe("74");
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            document.getElementsByClassName('e-ddl')[1].dispatchEvent(new Event('mousedown', { bubbles: true }));
            document.querySelectorAll('.e-filter-operator .e-list-item')[9].dispatchEvent(new Event('click', { bubbles: true }));
            document.querySelectorAll('.e-spin-down')[0].dispatchEvent(new Event('mouseup', { bubbles: true }));
            (document.querySelector('.e-ok-btn') as HTMLElement).click();
            pivotGridObj.dataSourceSettings.filterSettings = [];
            done();
        }, 1000);
    });
    it('Top value filter via UI on column axis - isActive field with negative value', (done: Function) => {
        setTimeout(function () {
            expect((pivotGridObj.engineModule.pivotValues[3][4] as IDataSet).formattedText).toBe("74");
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[1]).querySelector('.e-btn-filter') as HTMLElement).click();
            document.getElementsByClassName('e-ddl')[1].dispatchEvent(new Event('mousedown', { bubbles: true }));
            document.querySelectorAll('.e-filter-operator .e-list-item')[8].dispatchEvent(new Event('click', { bubbles: true }));
            document.querySelectorAll('.e-spin-down')[0].dispatchEvent(new Event('mouseup', { bubbles: true }));
            (document.querySelector('.e-ok-btn') as HTMLElement).click();
            pivotGridObj.dataSourceSettings.filterSettings = [
                {
                    condition: 'Top',
                    items: [],
                    levelCount: 1,
                    measure: 'quantity',
                    name: 'isActive',
                    type: 'Value',
                    value1: '-12'
                }
            ];
            done();
        }, 1000);
    });
    it('Value filter testing with negative values', (done: Function) => {
        setTimeout(function () {
            let pivotButtons: HTMLElement[] = [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            expect(document.querySelectorAll('.e-btn-filter').length > 1).toBeTruthy();
            ((pivotButtons[1]).querySelector('.e-btn-filter') as HTMLElement).click();
            document.querySelectorAll('.e-spin-down')[0].dispatchEvent(new Event('mouseup', { bubbles: true }));
            done();
        }, 1000);
    });
    it('memory leak check', () => {
        profile.sample();
        const average: number = inMB(profile.averageChange);
        const memory: number = inMB(getMemoryProfile());
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
        expect(average).toBeLessThan(10);
    });
});