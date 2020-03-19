import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
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
                    dataSource: pivot_dataset as IDataSet[],
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
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('.e-pivot-button').length).toBe(7);
        });
        it('click bike-female-balance', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid .e-groupdroparea')).toBeTruthy();
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("19");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('click california-quantity-female', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("477");
            document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mouseup);
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("19");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('remove tamilnadu single', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('td[aria-colindex="3"]')[3].textContent).toBe("66");
            document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(click);
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('remove tamilnadu single check', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("12");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('remove tamilnadu full', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('td[aria-colindex="3"]')[7].textContent).toBe("12");
            document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid tr')[2].querySelector('td').dispatchEvent(click);
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('remove tamilnadu full check', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid tr')[2].textContent).toBe("No records to display");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('add tamilnadu', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('td[aria-colindex="3"]')[7].textContent).toBe("");
            document.querySelectorAll('td[aria-colindex="3"]')[7].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('add tamilnadu 1', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
            ///jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("1");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[3].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });


        it('batch mode', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotGridObj.editSettings.mode = 'Batch';
                pivotGridObj.editSettings.showConfirmDialog = false;
                pivotGridObj.editSettings.showDeleteConfirmDialog = false;
                pivotGridObj.dataSourceSettings.dataSource = pivot_dataset as IDataSet[];
                pivotGridObj.refresh();
                done();
            }, 1000);
        });

        it('batch click bike-female-balance', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[0].dispatchEvent(mouseup);
                done();
            }, 1000);
        });
        it('batch click bike-female-balance check', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("18");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('dummy', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(true).toBe(true);
                done();
            }, 1000);
        });
        it('batch click california-quantity-female', (done: Function) => {
            expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("476");
            document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-numeric span')[1].dispatchEvent(mouseup);
                done();
            }, 1000);
        });
        it('batch click california-quantity-female', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid .e-numeric input')[0].getAttribute('aria-valuenow')).toBe("20");
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                document.querySelectorAll('.e-drillthrough-grid .e-tbar-btn')[2].dispatchEvent(click);
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('batch remove tamilnadu single', (done: Function) => {
            ///jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
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
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotGridObj.editSettings.mode = 'Dialog';
                pivotGridObj.dataSourceSettings.dataSource = pivot_dataset as IDataSet[];
                pivotGridObj.refresh();
                done();
            }, 1000);
        });
        it('dialog click bike-female-balance', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-edit-dialog button.e-primary')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('dialog click bike-female-balance check', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("17");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('dialog click california-quantity-female', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("475");
            document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].dispatchEvent(event);
                document.querySelectorAll('.e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-edit-dialog button.e-primary')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('dialog click california-quantity-female', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("21");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('command columns mode', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotGridObj.editSettings.allowCommandColumns = true;
                pivotGridObj.dataSourceSettings.dataSource = pivot_dataset as IDataSet[];
                pivotGridObj.refresh();
                done();
            }, 1000);
        });

        it('cc click bike-female-balance', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click bike-female-balance save', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click bike-female-balance check', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("16");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('cc click california-quantity-female', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('td[aria-colindex="3"]')[0].textContent).toBe("474");
            document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click california-quantity-female save', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click california-quantity-female check', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("22");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('cc click bike-female-balance', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('td[aria-colindex="1"]')[0].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click bike-female-balance save', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-up')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click bike-female-balance check', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("20");
                (document.querySelectorAll('.e-drillthrough-dialog .e-dlg-closeicon-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('cc click california-quantity-female', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('td[aria-colindex="3"]')[3].dispatchEvent(event);
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-editbutton')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click california-quantity-female save', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mousedown);
                document.querySelectorAll('.e-drillthrough-grid .e-spin-down')[0].dispatchEvent(mouseup);
                document.querySelectorAll('.e-drillthrough-grid .e-savebutton')[2].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('cc click california-quantity-female check', (done: Function) => {
            ///jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-drillthrough-grid td[aria-colindex="11"]')[0].textContent).toBe("18");
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
        it('value filter check', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('td[aria-colindex="9"]')[4].textContent).toBe("4663");
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