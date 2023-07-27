import { IDataSet } from '../../src/base/engine';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { BeginDrillThroughEventArgs } from '../../src/common/base/interface';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { Grid } from '@syncfusion/ej2-grids';
import { DrillThrough } from '../../src/pivotview/actions';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('- Editing', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
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
    describe('- normal', () => {
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
            PivotView.Inject(GroupingBar, DrillThrough, CalculatedField);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivotDatas as IDataSet[],
                    calculatedFieldSettings: [{ name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' }],
                    rows: [{ name: 'product' }, { name: 'state' }],
                    columns: [{ name: 'gender' }],
                    values: [{ name: 'balance' }, { name: 'price' }, { name: 'quantity' }], filters: [{ name: 'index' }],
                    drilledMembers: [{ name: 'product', items: ['Flight'] }],
                    allowValueFilter: true,
                    allowLabelFilter: true
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
        it('render testing', () => {
            expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
        });
        it('click california-quantity-female', (done: Function) => {
            expect(document.querySelectorAll('td[aria-colindex="5"]')[0].textContent).toBe("1372.23");
            document.querySelectorAll('td[aria-colindex="5"]')[3].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mouseup);
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("12");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('remove tamilnadu single', (done: Function) => {
            expect(document.querySelectorAll('td[aria-colindex="3"]')[3].textContent).toBe("");
            document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(click);
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('remove tamilnadu single check', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("28");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('remove tamilnadu', (done: Function) => {
            expect(document.querySelectorAll('td[aria-colindex="3"]')[7].textContent).toBe("35922.28");
            document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(click);
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('remove tamilnadu full', (done: Function) => {
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(click);
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('remove tamilnadu full check', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_drillthroughgridEditAlert_dialog-content').textContent).toBe("No records selected for delete operation");
                done();
            }, 1000);
        });
        it('add tamilnadu', (done: Function) => {
            expect(document.querySelectorAll('td[aria-colindex="3"]')[7].textContent).toBe("35922.28");
            document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('add tamilnadu 1', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[0] as HTMLInputElement).value = "Tamilnadu";
                (document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[1] as HTMLInputElement).value = "Flight";
                (document.querySelectorAll('.e-drillthrough-grid .e-inline-edit .e-input')[2] as HTMLInputElement).value = "female";
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[3].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[3].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[5].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[5].dispatchEvent(mouseup);
                done();
            }, 1000);
        });
        it('add tamilnadu check', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("1");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });


        it('batch mode', (done: Function) => {
            setTimeout(() => {
                pivotGridObj.editSettings.mode = 'Batch';
                pivotGridObj.editSettings.showConfirmDialog = false;
                pivotGridObj.editSettings.showDeleteConfirmDialog = false;
                pivotGridObj.dataSourceSettings.dataSource = pivotDatas as IDataSet[];
                pivotGridObj.refresh();
                done();
            }, 1000);
        });

        it('batch click bike-female-balance', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="2"]')[1].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="14"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                done();
            }, 1000);
        });
        it('batch click bike-female-balance check', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("1662.84");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('dummy', (done: Function) => {
            setTimeout(() => {
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('batch remove tamilnadu single', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(click);
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[1].dispatchEvent(click);
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('dialogmode', (done: Function) => {
            setTimeout(() => {
                pivotGridObj.editSettings.mode = 'Dialog';
                pivotGridObj.dataSourceSettings.dataSource = pivotDatas as IDataSet[];
                pivotGridObj.refresh();
                done();
            }, 1000);
        });
        it('dialog click bike-female-balance', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="5"]')[0].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="12"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-edit-dialog button.e-primary')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('dialog click bike-female-balance check', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="12"]')[0].textContent).toBe("16");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('command columns mode', (done: Function) => {
            setTimeout(() => {
                pivotGridObj.editSettings.allowCommandColumns = true;
                pivotGridObj.dataSourceSettings.dataSource = pivotDatas as IDataSet[];
                pivotGridObj.refresh();
                done();
            }, 1000);
        });

        it('cc click bike-female-balance', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="5"]')[0].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click bike-female-balance save', (done: Function) => {
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click bike-female-balance check', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("39");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('cc click california-quantity-female', (done: Function) => {
            expect(document.querySelectorAll('td[aria-colindex="4"]')[1].textContent).toBe("14");
            document.querySelectorAll('td[aria-colindex="5"]')[3].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click california-quantity-female save', (done: Function) => {
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click california-quantity-female check', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("21");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('cc click bike-female-balance', (done: Function) => {
            document.querySelectorAll('td[aria-colindex="5"]')[0].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click bike-female-balance save', (done: Function) => {
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click bike-female-balance check', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="12"]')[0].textContent).toBe("15");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('apply value filter', () => {
            expect(document.querySelector('.e-drillthrough-dialog')).toBeTruthy;
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'product', type: 'Value', condition: 'GreaterThan', value1: '1000', measure: 'quantity' },
            ];
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