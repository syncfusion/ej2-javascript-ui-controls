import { IDataSet } from '../../src/base/engine';
import { pivot_dataset, pivot_nodata } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EventHandler, EmitType } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { VirtualScroll } from '../../src/pivotview/actions';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe(' - VirtualScrolling', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe(' - VirtualScrolling', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        beforeAll(() => {
            document.body.appendChild(elem);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: false,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'product' }, { name: 'state' }],
                        columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    allowCalculatedField: true,
                    enableVirtualization: true,
                    width: 600,
                    height: 300
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });

        it('scroll top', (done: Function) => {
            document.querySelectorAll('.e-frozencontent')[0].scrollTop = 317;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("touchstart", { clientY: 317, view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-frozencontent').dispatchEvent(args);
            // args = new MouseEvent("touchmove", { view: window, bubbles: true, cancelable: true });
            // document.querySelector('.e-frozencontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-frozencontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 317).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                done();
            }, 1000);
        });

        it('scroll top false', (done: Function) => {
            document.querySelectorAll('.e-frozencontent')[0].scrollTop = 317;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("touchstart", { clientY: 0, view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-frozencontent').dispatchEvent(args);
            args = new MouseEvent("touchmove", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-frozencontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-frozencontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 317).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                done();
            }, 1000);
        });

        it('scroll right', (done: Function) => {
            document.querySelectorAll('.e-movableheader')[0].scrollLeft = 1360;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("touchstart", { clientX: 1360, view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movableheader').dispatchEvent(args);
            // args = new MouseEvent("touchmove", { view: window, bubbles: true, cancelable: true });
            // document.querySelector('.e-movableheader').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movableheader').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                done();
            }, 1000);
        });

        it('scroll right false', (done: Function) => {
            document.querySelectorAll('.e-movableheader')[0].scrollLeft = 1360;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("touchstart", { clientX: 0, view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movableheader').dispatchEvent(args);
            // args = new MouseEvent("touchmove", { view: window, bubbles: true, cancelable: true });
            // document.querySelector('.e-movableheader').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movableheader').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                done();
            }, 1000);
        });

        it('scroll top wheel', (done: Function) => {
            document.querySelectorAll('.e-frozencontent')[0].scrollTop = 0;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("wheel", { clientY: 0, view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-frozencontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-frozencontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 0).toBeTruthy();
                done();
            }, 1000);
        });

        it('scroll top wheel false', (done: Function) => {
            document.querySelectorAll('.e-frozencontent')[0].scrollTop = 0;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("wheel", { clientY: 0, view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-frozencontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-frozencontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 0).toBeTruthy();
                done();
            }, 1000);
        });

        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - VirtualScrolling', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        beforeAll(() => {
            document.body.appendChild(elem);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: false,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'product' }, { name: 'state' }],
                        columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    allowCalculatedField: true,
                    enableVirtualization: true,
                    width: 600,
                    height: 300
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('pivotgrid render testing', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                done();
            }, 1000);
        });
        it('scroll top', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 317;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 317).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                done();
            }, 1000);
        });
        it('scroll right', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 1360;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$33,116.92');
                done();
            }, 1000);
        });
        it('scroll bottom', (done: Function) => {
            pivotGridObj.element.querySelectorAll('.e-movablecontent')[0].scrollTop = 0;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(0);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,045.16');
                done();
            }, 1000);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 400;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(400);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('684.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                done();
            }, 1000);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 0;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                // expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(0);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('684.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                done();
            }, 1000);
        });
        it('Collapse flight', (done: Function) => {
            (document.querySelectorAll('.e-frozencontent tr .e-icons')[0] as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                done();
            }, 1000);
        });
        it('Collapse male', (done: Function) => {
            (document.querySelectorAll('.e-movableheader th .e-icons')[0] as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$95,040.55');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                done();
            }, 1000);
        });
        it('scroll top', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 900;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(900);
                expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Delhi');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$15,264.74');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('432.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                done();
            }, 1000);
        });
        it('scroll top', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(890);
                expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Delhi');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$15,264.74');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('432.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                done();
            }, 1000);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 752;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$15,264.74');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('432.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                done();
            }, 1000);
        });

        it('Collapse bike', (done: Function) => {
            (document.querySelectorAll('.e-frozencontent tr .e-icons')[2] as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(752);
                done();
            }, 1000);
        });
        it('Collapse female', (done: Function) => {
            (document.querySelectorAll('.e-movableheader th .e-collapse')[0] as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(890);
                done();
            }, 1000);
        });
        it('value in row axis', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'row' } }, true);
            pivotGridObj.dataSourceSettings.drilledMembers = [];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('1692.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('790px');
                done();
            }, 1000);
        });
        it('scroll top', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
                pivotGridObj.virtualscrollModule.direction = 'vertical';
                let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablecontent').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablecontent').dispatchEvent(args);
                done();
            }, 1000);
        });
        it('append name in column', (done: Function) => {
            pivotGridObj.dataSourceSettings.columns = [{ name: 'gender' }, { name: 'eyeColor' }, { name: 'name' }];
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                //expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(890);
                done();
            }, 1000);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 50000;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                done();
            }, 1000);
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - Grouping Bar', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        beforeAll(() => {
            document.body.appendChild(elem);
            PivotView.Inject(GroupingBar, FieldList, VirtualScroll);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: false,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'product' }, { name: 'state' }],
                        columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    allowCalculatedField: true,
                    showGroupingBar: true,
                    enableVirtualization: true,
                    showFieldList: true,
                    showValuesButton: true,
                    width: 600,
                    height: 300
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('pivotgrid render testing', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                done();
            }, 1000);
        });
        it('scroll top', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 317;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 317).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                done();
            }, 1000);
        });
        it('scroll right', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 1360;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$33,116.92');
                done();
            }, 1000);
        });
        it('scroll bottom', (done: Function) => {
            pivotGridObj.element.querySelectorAll('.e-movablecontent')[0].scrollTop = 0;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(0);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,045.16');
                done();
            }, 1000);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 0;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('684.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1730px');
                done();
            }, 1000);
        });
        it('Collapse flight', (done: Function) => {
            (document.querySelectorAll('.e-frozencontent tr .e-icons')[0] as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1730px');
                done();
            }, 1000);
        });
        it('Collapse male', (done: Function) => {
            (document.querySelectorAll('.e-movableheader th .e-icons')[0] as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$95,040.55');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1070px');
                done();
            }, 1000);
        });
        it('scroll top', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 358;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(358);
                expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('New Jercy');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$24,452.08');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1070px');
                done();
            }, 1000);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 752;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$24,452.08');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1070px');
                done();
            }, 1000);
        });

        it('Collapse bike', (done: Function) => {
            (document.querySelectorAll('.e-frozencontent tr .e-icons')[2] as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(752);
                done();
            }, 1000);
        });
        it('Collapse female', (done: Function) => {
            (document.querySelectorAll('.e-movableheader th .e-collapse')[0] as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(358);
                done();
            }, 1000);
        });

        it('filter', (done: Function) => {
            (document.querySelector('#product.e-pivot-button .e-pv-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let allNode: HTMLElement = document.querySelector('.e-checkbox-wrapper');
                let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                allNode.querySelector('.e-frame').dispatchEvent(args);
                let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[2] as HTMLElement;
                args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
                firstNode.querySelector('.e-frame').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                firstNode.querySelector('.e-frame').dispatchEvent(args);
                (document.querySelector('.e-ok-btn') as HTMLElement).click();
                done();
            }, 1000);
        });
        it('filter check', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(Math.round(document.querySelectorAll('.e-movableheader')[0].scrollLeft)).toBeGreaterThan(735);
                expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(358);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                done();
            }, 1000);
        });

        it('value moved to row', (done: Function) => {
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            let dragElement: HTMLElement = pivotButton[2].querySelector('.e-content');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                done();
            }, 1000);
        });
        it('value moved to column', (done: Function) => {
            let rowAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-rows');
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            let dragElement: HTMLElement = pivotButton[2].querySelector('.e-content');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, columnAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = columnAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, columnAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = columnAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(3);
                done();
            }, 1000);
        });
        it('value removed', (done: Function) => {
            let rowAxiscontent: any = document;
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
            expect(pivotButton.length).toEqual(3);
            let dragElement: HTMLElement = pivotButton[2].querySelector('.e-content');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
            mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(8);
                done();
            }, 1000);
        });
        it('values added', () => {
            pivotGridObj.dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
        });
        it('values removed', (done: Function) => {
            let columnAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-columns');
            let valueAxiscontent: HTMLElement = pivotGridObj.element.querySelector('.e-values');
            let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
            (pivotButton[2].querySelector('.e-remove') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                pivotButton = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(0);
                done();
            }, 1000);
        });
        it('values added', () => {
            pivotGridObj.dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
        });

        it('RTL', (done: Function) => {
            pivotGridObj.enableRtl = true;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(document.querySelectorAll('.e-movablecontent')[0].scrollTop).toBe(0);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('0.1px');
                done();
            }, 1000);
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - ValueSorting', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        beforeAll(() => {
            document.body.appendChild(elem);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: false,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'product' }, { name: 'state' }],
                        columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    enableVirtualization: true,
                    enableValueSorting: true,
                    width: 600,
                    height: 300
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('render testing', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                done();
            }, 1000);
        });
        it('sort male-blue-balance', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            (document.querySelectorAll('.e-movableheader th.e-firstcell')[0] as HTMLElement).click()
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$43,025.37');
                done();
            }, 1000);
        });
        it('scrollTop', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 398;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$43,025.37');
                done();
            }, 1000);
        });
        it('scrollLeft', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 1235;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(25);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Tempo');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$35,784.78');
                done();
            }, 1000);
        });
        it('Collapse car', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            (document.querySelectorAll('.e-frozencontent tr')[14].querySelector('.e-icons') as HTMLElement).click()
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(25);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Tempo');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$35,784.78');
                done();
            }, 1000);
        });
        it('scrollTop', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 0;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(25);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Tempo');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$23,417.02');
                done();
            }, 1000);
        });
        it('scrollLeft', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 0;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$14,986.08');
                done();
            }, 1000);
        });
        it('sort male-green-balance', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            (document.querySelectorAll('.e-movableheader th.e-firstcell')[1] as HTMLElement).click()
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,045.16');
                done();
            }, 1000);
        });
        it('remove quantity', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.values = [{ name: 'balance' }];
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(9);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                done();
            }, 1000);
        });
        it('sort female-brown', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            (document.querySelectorAll('.e-movableheader th.e-firstcell')[1] as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(9);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Car');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,295.87');
                done();
            }, 1000);
        });
        it('insert quantity', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.values = [{ name: 'balance' }, { name: 'quantity' }];
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Car');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$32,295.87');
                done();
            }, 1000);
        });
        it('move values to row', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.dataSourceSettings.valueAxis = 'row';
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(36);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(9);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('');
                done();
            }, 3000);
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - advanced filtering ', () => {
        let originalTimeout: number;
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        beforeAll(() => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            document.body.appendChild(elem);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        allowLabelFilter: true,
                        allowValueFilter: true,
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: true,
                        enableSorting: false,
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'product' }, { name: 'state' }],
                        columns: [{ name: 'gender' }, { name: 'eyeColor' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }],
                        filters: [],
                    },
                    enableVirtualization: true,
                    width: 600,
                    height: 300
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
        });
        it('pivotgrid render testing', (done: Function) => {
            setTimeout(() => {
                expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                done();
            }, 5000);
        });
        it('state start with t', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'state', type: 'Label', condition: 'BeginWith', value1: 't' }],
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(13);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Van');
                    expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Tamilnadu');
                    done();
                }, 5000);
        });
        it('state contains e', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'state', type: 'Label', condition: 'Contains', value1: 'e' }],
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-frozencontent tr').length).toBe(24);
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelectorAll('td').length).toBe(14);
                    expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                    expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('New Jercy');
                    done();
                }, 5000);
        });
        it('scroll top', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 317;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                expect(Math.round(document.querySelectorAll('.e-frozencontent')[0].scrollTop) === 317).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$11,131.56');
                done();
            }, 5000);
        });
        it('eyeColor equals blue', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'state', type: 'Label', condition: 'Contains', value1: 'e' },
                { name: 'eyeColor', type: 'Label', condition: 'Equals', value1: 'blue' }],
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('blue');
                    expect(document.querySelectorAll('.e-movableheader th')[4].textContent).toBe('male Total');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$11,131.56');
                    done();
                }, 5000);
        });
        it('scroll right', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 1360;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Flight');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$11,131.56');
                done();
            }, 5000);
        });
        it('product quantity > 100', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'product', type: 'Value', condition: 'GreaterThan', measure: 'quantity', value1: '100' }],
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-movableheader th')[4].textContent).toBe('brown');
                    expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('green');
                    expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                    done();
                }, 5000);
        });
        // it('eyeColor blue quantity < 100', (done: Function) => {
        //     pivotGridObj.dataSource.filterSettings = [
        //         { name: 'product', type: 'Value', condition: 'GreaterThan', measure: 'quantity', value1: '100' },
        //         { name: 'eyeColor', type: 'Value', condition: 'LessThan', measure: 'quantity', value1: '100' }],
        //     setTimeout(() => {
        //         expect(document.querySelectorAll('.e-movableheader th')[1].textContent).toBe('balance');
        //         expect(document.querySelectorAll('.e-movableheader th')[2].textContent).toBe('quantity');
        //         done();
        //     }, 1000);
        // });
        it('product quantity > 100', (done: Function) => {
            pivotGridObj.dataSourceSettings.filterSettings = [
                { name: 'product', type: 'Value', condition: 'GreaterThan', measure: 'quantity', value1: '100' }],
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-movableheader th')[4].textContent).toBe('brown');
                    expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('green');
                    // expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$12,490.89');
                    done();
                }, 5000);
        });
        it('scroll bottom', (done: Function) => {
            pivotGridObj.element.querySelectorAll('.e-movablecontent')[0].scrollTop = 0;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-frozencontent')[0].scrollTop === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                done();
            }, 5000);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 400;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft).toBe(400);
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('648.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                done();
            }, 5000);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 0;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Jet');
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('$27,813.73');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('648.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                done();
            }, 5000);
        });
        it('Collapse flight', (done: Function) => {
            (document.querySelectorAll('.e-frozencontent tr .e-icons')[0] as HTMLElement).click()
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('New Jercy');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$6,416.24');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1780px');
                done();
            }, 5000);
        });
        it('Collapse male', (done: Function) => {
            (document.querySelectorAll('.e-movableheader th .e-icons')[0] as HTMLElement).click()
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect(document.querySelectorAll('.e-movableheader')[0].scrollLeft === 0).toBeTruthy();
                expect(document.querySelectorAll('.e-movableheader th')[3].textContent).toBe('male Total');
                expect(document.querySelectorAll('.e-movablecontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('$24,452.08');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('468.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('1120px');
                done();
            }, 5000);
        });
        it('value in row axis', (done: Function) => {
            pivotGridObj.setProperties({ dataSourceSettings: { valueAxis: 'row' } }, true);
            pivotGridObj.dataSourceSettings.drilledMembers = [];
            setTimeout(() => {
                let mCnt: HTMLElement = document.querySelector('.e-movablecontent') as HTMLElement;
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.height).toBe('1692.1px');
                expect((mCnt.querySelectorAll('.e-virtualtrack')[0] as HTMLElement).style.width).toBe('790px');
                done();
            }, 5000);
        });
        it('scroll top', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
            pivotGridObj.virtualscrollModule.direction = 'vertical';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                document.querySelectorAll('.e-movablecontent')[0].scrollTop = 890;
                pivotGridObj.virtualscrollModule.direction = 'vertical';
                let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablecontent').dispatchEvent(args);
                args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
                document.querySelector('.e-movablecontent').dispatchEvent(args);
                done();
            }, 5000);
        });
        it('timeout', (done: Function) => {
            // pivotGridObj.dataSource.columns = [{ name: 'gender' }, { name: 'eyeColor' }, { name: 'name' }],
            setTimeout(() => {
                done();
            }, 1000);
        });
        it('append name in column', (done: Function) => {
            pivotGridObj.dataSourceSettings.columns = [{ name: 'gender' }, { name: 'eyeColor' }, { name: 'name' }],
                setTimeout(() => {
                    //expect(document.querySelectorAll('.e-frozencontent')[0].scrollTop).toBe(890);
                    done();
                }, 5000);
        });
        it('scroll left', (done: Function) => {
            document.querySelectorAll('.e-movablecontent')[0].scrollLeft = 50000;
            pivotGridObj.virtualscrollModule.direction = 'horizondal';
            let args: MouseEvent = new MouseEvent("scroll", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            document.querySelector('.e-movablecontent').dispatchEvent(args);
            setTimeout(() => {
                expect(pivotGridObj.element.querySelectorAll('.e-movableheader')[0].scrollLeft === document.querySelectorAll('.e-movablecontent')[0].scrollLeft).toBeTruthy();
                done();
            }, 5000);
        });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe(' - Coverage', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
        let cf: any;
        beforeAll(() => {
            document.body.appendChild(elem);
            PivotView.Inject(VirtualScroll, CalculatedField, GroupingBar, FieldList);
            pivotGridObj = new PivotView(
                {
                    dataSourceSettings: {
                        dataSource: pivot_nodata as IDataSet[],
                        enableSorting: false,
                        expandAll: true,
                        rows: [{ name: 'Country' }, { name: 'State' }],
                        columns: [{ name: 'Product' }, { name: 'Date' }],
                        values: [{ name: 'Amount' }, { name: 'Quantity' }],
                    },
                    allowCalculatedField: true,
                    showFieldList: true,
                    showGroupingBar: true,
                    enableVirtualization: true,
                    width: 600,
                    height: 300
                });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 1000);
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
        it('drop down menu (Sum of Amount) click', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-values .e-dropdown-icon')).not.toBeUndefined;
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('28550');
                document.querySelectorAll('.e-values .e-dropdown-icon')[0].dispatchEvent(click);
                done();
            }, 1000);
        });

        it('Sum of Amount -> Count of Amount _using grouping bar dropdown menu', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let menu: MenuEventArgs = {
                    element: document.querySelectorAll('.e-menu-item')[1] as HTMLElement,
                    item: { id: pivotGridObj.element.id + '_Count', text: 'Count' }
                };
                (pivotGridObj.pivotButtonModule.menuOption as any).selectOptionInContextMenu(menu);
                done();
            }, 1000);
        });
        it('Sum of Amount -> Count of Amount _result + enable sorting', () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('6');
            pivotGridObj.dataSourceSettings.enableSorting = true;
        });
        it('Country -> descending _using grouping bar sort icon', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                //expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('');
                document.querySelectorAll('.e-group-rows .e-sort')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('Country -> descending _result + Switch to ascending', () => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('7');
            expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('United States');
            document.querySelectorAll('.e-group-rows .e-sort')[0].dispatchEvent(click);
        });
        it('Country -> Switch to ascending _result + open field list', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-movablecontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('6');
                expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
                document.querySelectorAll('.e-toggle-field-list')[0].dispatchEvent(click);
                done();
            }, 1000);
        });
        it('Open calculated field dialog', (done: Function) => {
            cf = new CalculatedField(pivotGridObj);
            cf.createCalculatedFieldDialog(pivotGridObj);
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            pivotGridObj.engineModule.enableSort = false;
            setTimeout(() => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                done();
            }, 1000);
        });
        it('drag and drop Amount(Count) node to drop field', () => {
            let treeObj: any = cf.treeObj;
            let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[0].querySelector('.e-drag'), 15, 10);
            EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[0].querySelector('.e-drag'), 15, 70);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
            mousemove = util.setMouseCordinates(mousemove, 150, 400);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
            mouseup.type = 'mouseup';
            EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value !== null).toBeTruthy;
        });
        it('set new field as "New" and close the dialog', () => {
            cf.inputObj.value = 'New';
            (document.querySelector('.e-pivot-calc-input') as HTMLInputElement).value = 'New';
            (document.querySelector('.e-pivot-formula') as HTMLInputElement).value = '10';
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
            cf.dialog.buttons[0].click();
            document.querySelector('.e-pivotfieldlist-wrapper .e-cancel-btn').dispatchEvent(click);
        });
        it('Country -> open filter dialog + uncheck canada + click ok btn', (done: Function) => {
            pivotGridObj.engineModule.enableSort = true;
            expect(document.querySelectorAll('.e-movableheader th')[11].textContent).toBe('New');
            document.querySelectorAll('#Country .e-btn-filter')[0].dispatchEvent(click);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[1] as HTMLElement;
                firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                firstNode.querySelector('.e-frame').dispatchEvent(click);
                document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                done();
            }, 1000);
        });
        it('Country -> open filter dialog + check canada + click ok btn', (done: Function) => {
            expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('France');
            expect(document.querySelectorAll('.e-movablecontent td')[0].textContent).toBe('4');
            document.querySelectorAll('#Country .e-btn-filter')[0].dispatchEvent(click);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[1] as HTMLElement;
                firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                firstNode.querySelector('.e-frame').dispatchEvent(click);
                document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                done();
            }, 1000);
        });
        it('Country -> set report as no data', (done: Function) => {
            expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
            //expect(document.querySelectorAll('.e-movablecontent td')[0].textContent).toBe('');
            pivotGridObj.dataSourceSettings.rows[0].showNoDataItems = true;
            setTimeout(() => {
                //expect(document.querySelectorAll('.e-frozencontent tr')[1].querySelector('td .e-cellvalue').textContent).toBe('Alberta');
                done();
            }, 1000);
        });
        it('Country -> open filter dialog + uncheck france + click ok btn', (done: Function) => {
            document.querySelectorAll('#Country .e-btn-filter')[0].dispatchEvent(click);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[2] as HTMLElement;
                firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                firstNode.querySelector('.e-frame').dispatchEvent(click);
                document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                done();
            }, 1000);
        });
        it('Country -> open filter dialog + check france + click ok btn', (done: Function) => {
            expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
            expect(document.querySelectorAll('.e-movablecontent td')[0].textContent).toBe('6');
            document.querySelectorAll('#Country .e-btn-filter')[0].dispatchEvent(click);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[2] as HTMLElement;
                firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                firstNode.querySelector('.e-frame').dispatchEvent(click);
                document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                done();
            }, 1000);
        });
        it('State -> open filter dialog + uncheck essonnee + click ok btn', (done: Function) => {
            expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
            expect(document.querySelectorAll('.e-movablecontent td')[0].textContent).toBe('6');
            document.querySelectorAll('#State .e-btn-filter')[0].dispatchEvent(click);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                let treeNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[11] as HTMLElement;
                treeNode.querySelector('.e-frame').dispatchEvent(mousedown);
                treeNode.querySelector('.e-frame').dispatchEvent(mouseup);
                treeNode.querySelector('.e-frame').dispatchEvent(click);
                document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                done();
            }, 1000);
        });
        it('State -> open filter dialog + check essonnee + click ok btn', (done: Function) => {
            document.querySelectorAll('#State .e-btn-filter')[0].dispatchEvent(click);
            expect(document.querySelectorAll('.e-frozencontent td')[11].textContent).toBe('Garonne (Haute)');
            setTimeout(() => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                let treeNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[11] as HTMLElement;
                treeNode.querySelector('.e-frame').dispatchEvent(mousedown);
                treeNode.querySelector('.e-frame').dispatchEvent(mouseup);
                treeNode.querySelector('.e-frame').dispatchEvent(click);
                document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                done();
            }, 1000);
        });
        it('Collapse Car', (done: Function) => {
            expect(document.querySelectorAll('.e-frozencontent td')[11].textContent).toBe('Essonne');
            expect(document.querySelectorAll('.e-frozencontent tr')[0].querySelector('td .e-cellvalue').textContent).toBe('Canada');
            document.querySelectorAll('.e-movableheader th .e-collapse')[1].dispatchEvent(click);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-movableheader th')[1].getAttribute('aria-rowspan')).toBe('2');
                done();
            }, 1000);
        });
        it('Expand Car', (done: Function) => {
            document.querySelectorAll('.e-movableheader th .e-expand')[0].dispatchEvent(click);
            setTimeout(() => {
                expect(document.querySelectorAll('.e-movableheader th')[1].getAttribute('aria-rowspan')).toBe('1');
                done();
            }, 1000);
        });
        it('Product -> open filter dialog + uncheck car + click ok btn', (done: Function) => {
            document.querySelectorAll('#Product .e-btn-filter')[0].dispatchEvent(click);
            setTimeout(() => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[2] as HTMLElement;
                firstNode.querySelector('.e-frame').dispatchEvent(mousedown);
                firstNode.querySelector('.e-frame').dispatchEvent(mouseup);
                firstNode.querySelector('.e-frame').dispatchEvent(click);
                document.querySelector('.e-member-editor-dialog .e-ok-btn').dispatchEvent(click);
                done();
            }, 1000);
        });
        it('Refresh data source', (done: Function) => {
            (pivotGridObj.engineModule as any).getAxisByFieldName('None');
            pivotGridObj.dataSourceSettings.dataSource = [];
            done();
        });

        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
    });
    describe('Scroll apperance', () => {

        describe('Scroll comparison ', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:1000px; width:900px' });
            let data: IDataSet[] = [
                { row: 'row1', column: 'column1', value: 1 },
                { row: 'row2', column: 'column2', value: 2 },
                { row: 'row3', column: 'column3', value: 3 },
                { row: 'row4', column: 'column4', value: 4 },
            ]
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.style.height = '500px';
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, VirtualScroll);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: data,
                        expandAll: false,
                        rows: [{ name: 'row' }],
                        columns: [{ name: 'column' }],
                        values: [{ name: 'value' }],
                    },
                    width: 900,
                    height: 300,
                    enableVirtualization: false,
                    showGroupingBar: true,
                    dataBound: dataBound

                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });
            it('Compare scrollbar', () => {
                expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
            });

            it('Display vertical scrollbar alone', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.height = 200;
                setTimeout(() => {
                    expect(document.querySelector('.e-movablecontent').scrollHeight).toBeGreaterThan(document.querySelector('.e-movablecontent').clientHeight);
                    expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                    done();
                }, 1000);
            });

            it('Display horizondal scrollbar alone', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.setProperties({ height: '100%' }, true);
                pivotGridObj.width = 300;
                setTimeout(() => {
                    expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                    expect(document.querySelector('.e-movablecontent').scrollWidth).toBeGreaterThan(document.querySelector('.e-movablecontent').clientWidth);
                    done();
                }, 1000);
            });

            it('Hide both scrollbars', (done: Function) => {
                pivotGridObj.setProperties({ height: '100%' }, true);
                pivotGridObj.width = '100%';
                setTimeout(() => {
                    expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                    expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                    done();
                }, 1000);
            });

            it('Hide both scrollbars by setting auto', (done: Function) => {
                pivotGridObj.setProperties({ height: 'auto' }, true);
                setTimeout(() => {
                    expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                    expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                    done();
                }, 1000);
            });

        });

        describe('Scroll comparison - virtual scrolling', () => {
            let pivotGridObj: PivotView;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:1000px; width:900px' });
            let data: IDataSet[] = [
                { row: 'row1', column: 'column1', value: 1 },
                { row: 'row2', column: 'column2', value: 2 },
                { row: 'row3', column: 'column3', value: 3 },
                { row: 'row4', column: 'column4', value: 4 },
            ]
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (!document.getElementById(elem.id)) {
                    document.body.style.height = '500px';
                    document.body.appendChild(elem);
                }
                let dataBound: EmitType<Object> = () => { done(); };
                PivotView.Inject(GroupingBar, VirtualScroll);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: data,
                        expandAll: false,
                        rows: [{ name: 'row' }],
                        columns: [{ name: 'column' }],
                        values: [{ name: 'value' }],
                    },
                    width: 900,
                    height: 300,
                    enableVirtualization: true,
                    showGroupingBar: true,
                    dataBound: dataBound

                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            beforeEach((done: Function) => {
                setTimeout(() => { done(); }, 1000);
            });

            it('Scroll compare', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                    expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                    done();
                }, 1000);
            });

            it('Display vertical scrollbar alone', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.height = 200;
                setTimeout(() => {
                    expect(document.querySelector('.e-movablecontent').scrollHeight).toBeGreaterThan(document.querySelector('.e-movablecontent').clientHeight);
                    expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                    done();
                }, 1000);
            });

            it('Display horizondal scrollbar alone', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.setProperties({ height: '100%' }, true);
                pivotGridObj.width = 300;
                setTimeout(() => {
                    expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                    expect(document.querySelector('.e-movablecontent').scrollWidth).toBeGreaterThan(document.querySelector('.e-movablecontent').clientWidth);
                    done();
                }, 1000);
            });

            it('Hide both scrollbars by setting 100%', (done: Function) => {
                pivotGridObj.setProperties({ height: '100%' }, true);
                pivotGridObj.width = '100%';
                setTimeout(() => {
                    expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                    expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                    done();
                }, 1000);
            });

            it('Hide both scrollbars by setting auto', (done: Function) => {
                pivotGridObj.setProperties({ height: 'auto' }, true);
                setTimeout(() => {
                    expect(document.querySelector('.e-movablecontent').scrollHeight).toBe(document.querySelector('.e-movablecontent').clientHeight);
                    expect(document.querySelector('.e-movablecontent').scrollWidth).toBe(document.querySelector('.e-movablecontent').clientWidth);
                    done();
                }, 1000);
            });

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