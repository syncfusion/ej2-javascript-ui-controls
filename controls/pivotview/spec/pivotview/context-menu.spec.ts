import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

// Spec for pivot context menu
describe('Pivot Context Menu Spec', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe(' context menu in default grid', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            // if (document.getElementById(elem.id)) {
            //     remove(document.getElementById(elem.id));
            // }
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
            if (!document.getElementById(elem.id)) {
                document.body.appendChild(elem);
            }
            //document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            PivotView.Inject(CalculatedField, GroupingBar, FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    enableSorting: true,
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                enableValueSorting: true,
                allowDrillThrough: true,
                allowExcelExport: true,
                allowPdfExport: true,
                showValuesButton: true,
                allowCalculatedField: true,
                dataBound: dataBound,
                gridSettings: {
                    contextMenuItems: ['Collapse', 'Drillthrough', 'Expand', 'Excel Export', 'Pdf Export', 'Csv Export',
                        'Sort Ascending', 'Sort Descending', 'Aggregate', 'CalculatedField']
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 2000);
        });
        it('check', () => {
            expect(true).toBeTruthy();
        })
        it('contextmenu in values-content', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
            let cell: HTMLElement = document.querySelector('.e-valuesheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu in values content', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelector('#PivotGrid_grid_cmenu') !== null)
                expect(true);
                done();
            }, 1000);
        });
        it('contextmenu in values-content', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu select drill through', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_drillthrough_menu') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('drillthrough check', function (done) {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(function () {
                expect(document.querySelector('#PivotGrid_drillthrough') !== null).toBe(true);
                done();
            }, 1000);
        });
        it('dialog close click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.getElementsByClassName('e-btn-icon e-icon-dlg-close e-icons')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu open calculated field', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_CalculatedField') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('dialog close click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelector('#PivotGridcalculateddialog') !== null).toBe(true);
                done();
            }, 1000);
        });
        it('dialog close click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.getElementsByClassName('e-btn-icon e-icon-dlg-close e-icons')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu expand', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_expand') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            expect(document.querySelector('e-collapse')).toBe(null);
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu collapse', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_collapse') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            expect(document.querySelector('.e-collapse') === null).toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu pdf export', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
            setTimeout(() => {
                util.triggerMouseEvent(target, 'mouseover');
                (document.querySelector('#' + pivotGridObj.element.id + '_pdf') as HTMLElement).click();
                expect(document.querySelector('.e-collapse') === null).toBeTruthy();
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu excel export', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
            setTimeout(() => {
                util.triggerMouseEvent(target, 'mouseover');
                (document.querySelector('#' + pivotGridObj.element.id + '_excel') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu csv export', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
            setTimeout(() => {
                util.triggerMouseEvent(target, 'mouseover');
                (document.querySelector('#' + pivotGridObj.element.id + '_csv') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
            let cell: HTMLElement = document.querySelector('.e-valuesheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu value sorting ascending', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_sortasc') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            expect(document.querySelector('.e-ascending')).toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
            let cell: HTMLElement = document.querySelector('.e-valuesheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu value sorting descending', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_sortdesc') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            expect(document.querySelector('.e-descending')).toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
            let cell: HTMLElement = document.querySelector('.e-valuesheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('contextmenu open', () => {
            expect(document.querySelector('.e-descending')).toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu value aggregate count', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('aggregate count click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_AggCount') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', (done: Function) => {
            // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "46").toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "46").toBeTruthy();
                done();
            }, 1000);
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu value aggregate dcount', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('aggregate dcount click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_AggDistinctCount') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', (done: Function) => {
            // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "46").toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "46").toBeTruthy();
                done();
            }, 1000);
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu value aggregate product', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('aggregate product click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_AggProduct') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', (done: Function) => {
            // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "6.588638896563111e+152").toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "6.588638896563111e+152").toBeTruthy();
                done();
            }, 1000);
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu value aggregate average', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('aggregate avg click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_AggAvg') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', (done: Function) => {
            //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "2409.7805263157893").toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "2409.7805263157893").toBeTruthy();
                done();
            }, 1000);
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu value aggregate minimum', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('aggregate Min click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_AggMin') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', (done: Function) => {
            // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "1195.56").toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "1195.56").toBeTruthy();
                done();
            }, 1000);
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu value aggregate maximum', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('aggregate Max click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_AggMax') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', (done: Function) => {
            //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "3958.73").toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "3958.73").toBeTruthy();
                done();
            }, 1000);
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu value aggregate sum', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('aggregate sum click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_AggSum') as HTMLElement).click();
                done();
            }, 1000);
            // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText).toBe("104702.76999999997");
        });
        it('contextmenu open', (done: Function) => {
            // expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "104702.76999999997").toBeTruthy();
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                //expect((document.querySelector('.e-valuescontent') as HTMLElement).innerText.trim() === "104702.76999999997").toBeTruthy();
                done();
            }, 1000);
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu value aggregate more option', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('aggregate  click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelector('#' + pivotGridObj.element.id + '_AggMoreOption') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            expect(document.querySelector('#PivotGrid_ValueDialog') !== null).toBe(true);
            pivotGridObj.allowDrillThrough = false;
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('dialog close click', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.getElementsByClassName('e-btn-icon e-icon-dlg-close e-icons')[0] as HTMLElement).click();
                done();
            }, 1000);
        });
        it('context menu hide drillthrough', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelector('#' + pivotGridObj.element.id + '_drillthrough_menu').classList.contains('e-disabled') === true);
                done();
            }, 1000);
        });
        it('contextmenu open', () => {
            pivotGridObj.enableValueSorting = false;
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
            let cell: HTMLElement = document.querySelector('.e-valuesheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu hide sorting', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelector('#' + pivotGridObj.element.id + '_sortasc').classList.contains('e-disabled') === true);
                expect(document.querySelector('#' + pivotGridObj.element.id + '_sortdesc').classList.contains('e-disabled') === true);
                done();
            }, 1000);
        });
        it('contextmenu open calc disabled', () => {
            pivotGridObj.allowCalculatedField = false;
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu check calculated field', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelector('#' + pivotGridObj.element.id + '_CalculatedField').classList.contains('e-disabled') === true);
                done();
            }, 1000);
        });
        it('contextmenu open pdf disabled', () => {
            pivotGridObj.allowPdfExport = false;
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu check pdf menu', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
                    util.triggerMouseEvent(target, 'mouseover');
                    done();
                }, 1000);
            });
        });
        it('check pdf field', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelector('#' + pivotGridObj.element.id + '_pdf').classList.contains('e-disabled') === true);
                done();
            }, 1000);
        });
        it('contextmenu open excel disabled', () => {
            pivotGridObj.allowExcelExport = false;
            pivotGridObj.allowPdfExport = true;
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu check pdf menu', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
                    util.triggerMouseEvent(target, 'mouseover');
                    done();
                }, 1000);
            });
        });
        it('check pdf field', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelector('#' + pivotGridObj.element.id + '_excel').classList.contains('e-disabled') === true);
                expect(document.querySelector('#' + pivotGridObj.element.id + '_csv').classList.contains('e-disabled') === true);
                done();
                done();
            }, 1000);
        });
        it('contextmenu open excel disabled', () => {
            pivotGridObj.allowExcelExport = false;
            pivotGridObj.allowPdfExport = false;
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu check excel and csv field', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_exporting');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('check excel and csv field', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelector('#' + pivotGridObj.element.id + '_exporting').classList.contains('e-disabled') === true);
                expect(document.querySelector('#' + pivotGridObj.element.id + '_excel').classList.contains('e-disabled') === true);
                expect(document.querySelector('#' + pivotGridObj.element.id + '_csv').classList.contains('e-disabled') === true);
                done();
            }, 1000);
        });
        it('contextmenu open calculated field disabled', () => {
            pivotGridObj.allowCalculatedField = false;
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu check calculated field', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_CalculatedField');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('check calc field in disabled state', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelector('#' + pivotGridObj.element.id + '_CalculatedField').classList.contains('e-disabled') === true);
                done();
            }, 1000);
            pivotGridObj.dataSourceSettings.valueAxis = 'row';
        });
        it('contextmenu open values in row ', () => {
            pivotGridObj.dataSourceSettings.valueAxis = 'row';
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
            let cell: HTMLElement = document.querySelector('.e-valuescontent');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('context menu check calculated field', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                util.triggerMouseEvent(target, 'mouseover');
                done();
            }, 1000);
        });
        it('check calc field in disabled state', (done: Function) => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelector('#' + pivotGridObj.element.id + '_aggregate').classList.contains('e-disabled') === true);
                done();
            }, 1000);
        });
        it('contextmenu open values in column header ', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-columnsheader');
            let cell: HTMLElement = document.querySelector('.e-columnsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('contextmenu open headertext ', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-headertext');
            let cell: HTMLElement = document.querySelector('.e-headertext');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('contextmenu open rowsheader ', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
        it('contextmenu open rowsheader ', () => {
            //jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.lastCellClicked = document.querySelector('.e-rowsheader');
            let cell: HTMLElement = document.querySelector('.e-rowsheader');
            util.triggerMouseEvent(cell, 'contextmenu');
        });
    });
    // describe('Context menu in disabled state', ()=>{
    //     let pivotGridObj: PivotView;
    //     let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:500px; width:100%' });
    //     afterAll(() => {
    //         if (pivotGridObj) {
    //             pivotGridObj.destroy();
    //         }
    //         remove(elem);
    //     });
    //     beforeAll((done: Function) => {
    //         if (!document.getElementById(elem.id)) {
    //             document.body.appendChild(elem);
    //         }
    //         let dataBound: EmitType<Object> = () => { done(); };
    //         pivotGridObj = new PivotView({
    //             dataSourceSettings: {
    //                 dataSource: pivot_dataset as IDataSet[],
    //                 enableSorting: true,
    //                 rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
    //                 columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
    //                 values: [{ name: 'balance' }, { name: 'quantity' }],
    //                 filters: [],
    //             },
    //             enableValueSorting: false,
    //             allowDrillThrough: false,
    //             allowExcelExport:false,
    //             allowPdfExport:false,
    //             allowCalculatedField: false,
    //             showValuesButton: true,
    //             showGroupingBar:false,
    //             dataBound: dataBound,
    //             gridSettings : {
    //                 contextMenuItems:['Collapse','Drillthrough','Expand','EXCELExport','PDFExport','CSVExport',
    //                 'Sort Ascending','Sort Descending','Aggregate','CalculatedField']
    //             }
    //         });
    //         pivotGridObj.appendTo('#PivotGrid');
    //     });
    //     beforeEach((done: Function) => {
    //         setTimeout(() => { done(); }, 1000);
    //     });
    //     it('contextmenu in values-content', ()=>{
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //         pivotGridObj.lastCellClicked = document.querySelector('.e-valuesheader');
    //         let cell: HTMLElement = document.querySelector('.e-valuesheader');
    //         util.triggerMouseEvent(cell,'contextmenu');
    //     });
    //     it('context menu in values sorting', (done: Function) => {
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //         setTimeout(() => {
    //             expect(document.querySelector('#sortasc').classList.contains('e-disabled') === true);
    //             expect(document.querySelector('#sortasc').classList.contains('e-disabled') === true);
    //             done();
    //         }, 1000);
    //     });
    //     it('contextmenu in values-content', ()=>{
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //         pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
    //         let cell: HTMLElement = document.querySelector('.e-valuescontent');
    //         util.triggerMouseEvent(cell,'contextmenu');
    //     });
    //     it('context menu in values content', (done: Function) => {
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //         setTimeout(() => {
    //             expect(document.querySelector('#drillthrough').classList.contains('e-disabled') === true);
    //             expect(document.querySelector('#CalculatedField').classList.contains('e-disabled') === true);
    //             expect(document.querySelector('#exporting').classList.contains('e-disabled') === true);
    //             done();
    //         }, 1000);
    //         pivotGridObj.dataSource.valueAxis = 'row';
    //     });
    //     it('contextmenu in empty-content', ()=>{
    //         pivotGridObj.dataSource.valueAxis = 'row';
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //         pivotGridObj.lastCellClicked = document.querySelector('.e-valuescontent');
    //         let cell: HTMLElement = document.querySelector('.e-valuescontent');
    //         util.triggerMouseEvent(cell,'contextmenu');
    //     });
    //     it('context menu in empty content', (done: Function) => {
    //         jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    //         setTimeout(() => {
    //             expect(document.querySelector('#drillthrough').classList.contains('e-disabled') === true);
    //             expect(document.querySelector('#aggregate').classList.contains('e-disabled') === true);
    //             done();
    //         }, 1000);
    //     });
    // });

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