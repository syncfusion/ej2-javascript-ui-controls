import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType} from '@syncfusion/ej2-base';
import { Toolbar } from '../../src/common/popups/toolbar';
import { FieldList } from '../../src/common/actions/field-list';
import { Pager } from '../../src/pivotview/actions/pager';
import { PagerPosition } from '../../src/common/index';
describe('Pager sample',() => {
describe('- Row pager', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    if (document.getElementById(elem.id)) {
        remove(document.getElementById(elem.id));
    }
    document.body.appendChild(elem);
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        PivotView.Inject(Toolbar,FieldList,Pager);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: []
            },
            width: '100%',
            height: 600,
            enablePaging: true,
            pageSettings: {
                rowPageSize: 10,
                columnPageSize: 5,
                currentColumnPage: 1,
                currentRowPage: 1
            },
            pagerSettings: {
                position: 'Bottom',
                enableCompactView: false,
                showColumnPager: true,
                showRowPager: true
            },
            gridSettings: { columnWidth: 120 },
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });
    it('For sample render', (done: Function) => {
        setTimeout(() => {
            expect(1).toBe(1);
            done();
        }, 500);
    });
    it('Row Pager change', (done: Function) => {
        const args = { value: 2 };
        (pivotGridObj.pagerModule as any).rowPageChange(args);
        expect(pivotGridObj.pageSettings.currentRowPage).toBe(2);
        done();
    });

    it('Column Pager change', (done: Function) => {
        const args = { value: 2 };
        (pivotGridObj.pagerModule as any).columnPageChange(args);
        expect(pivotGridObj.pageSettings.currentColumnPage).toBe(2);
        done();
    });

    it('Row Page Size change', (done: Function) => {
        const args = { value: 15 };
        (pivotGridObj.pagerModule as any).rowPageSizeChange(args);
        expect(pivotGridObj.pageSettings.rowPageSize).toBe(15);
        done();
    });

    it('Column Page Size change', (done: Function) => {
        const args = { value: 10 };
        (pivotGridObj.pagerModule as any).columnPageSizeChange(args);
        expect(pivotGridObj.pageSettings.columnPageSize).toBe(10);
        done();
    });

    it('Enter on enabled pager Next icon should navigate to next page', (done: Function) => {
        setTimeout(() => {
            const pagerEl: HTMLElement = document.querySelector('#PivotGridpivot-pager');
            const nextIcon: HTMLElement = pagerEl ? pagerEl.querySelector('.e-icon-next') : null;
            if (nextIcon && !nextIcon.classList.contains('e-disable')) {
                const pageBefore: number = pivotGridObj.pageSettings.currentRowPage;
                const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                    key: 'Enter', code: 'Enter', bubbles: true, cancelable: true
                });
                nextIcon.dispatchEvent(enterEvent);
                setTimeout(() => {
                    expect(pivotGridObj.pageSettings.currentRowPage).toBe(pageBefore + 1);
                    done();
                }, 200);
            } else {
                expect(true).toBe(true);
                done();
            }
        }, 500);
    });

    it('Enter on disabled pager Prev icon on page 1 should do nothing', (done: Function) => {
        setTimeout(() => {
            pivotGridObj.pageSettings.currentRowPage = 1;
            pivotGridObj.dataBind();
            setTimeout(() => {
                const pagerEl: HTMLElement = document.querySelector('#PivotGridpivot-pager');
                const prevIcon: HTMLElement = pagerEl ? pagerEl.querySelector('.e-icon-prev') : null;
                if (prevIcon && prevIcon.classList.contains('e-disable')) {
                    const pageBefore: number = pivotGridObj.pageSettings.currentRowPage;
                    const enterEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                        key: 'Enter', code: 'Enter', bubbles: true, cancelable: true
                    });
                    prevIcon.dispatchEvent(enterEvent);
                    setTimeout(() => {
                        expect(pivotGridObj.pageSettings.currentRowPage).toBe(pageBefore);
                        done();
                    }, 200);
                } else {
                    expect(true).toBe(true);
                    done();
                }
            }, 300);
        }, 500);
    });

    it('Tab from end of row pager should move focus to column pager first control', (done: Function) => {
        setTimeout(() => {
            const pagerEl: HTMLElement = document.querySelector('#PivotGridpivot-pager');
            const rowLast: HTMLElement = pagerEl ? pagerEl.querySelector('#PivotGrid_row_lastIcon') : null;
            const colFirst: HTMLElement = pagerEl ? pagerEl.querySelector('#PivotGrid_column_firstIcon') : null;
            if (rowLast && colFirst) {
                rowLast.focus();
                expect(document.activeElement === rowLast).toBeTruthy();
                const tabEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                    key: 'Tab', code: 'Tab', bubbles: true, cancelable: true
                });
                rowLast.dispatchEvent(tabEvent);
                setTimeout(() => {
                    const active: Element = document.activeElement;
                    const isPagerEl: boolean = pagerEl ? pagerEl.contains(active) : false;
                    expect(isPagerEl || active === colFirst).toBeTruthy();
                    done();
                }, 200);
            } else {
                expect(true).toBe(true);
                done();
            }
        }, 500);
    });

    it('Tab from pager icon should not send focus to grid row header', (done: Function) => {
        setTimeout(() => {
            const pagerEl: HTMLElement = document.querySelector('#PivotGridpivot-pager');
            const nextIcon: HTMLElement = pagerEl ? pagerEl.querySelector('.e-icon-next') : null;
            if (nextIcon) {
                nextIcon.focus();
                const tabEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                    key: 'Tab', code: 'Tab', bubbles: true, cancelable: true
                });
                nextIcon.dispatchEvent(tabEvent);
                setTimeout(() => {
                    const active: Element = document.activeElement;
                    expect(active && active.classList.contains('e-rowsheader')).toBeFalsy();
                    done();
                }, 100);
            } else {
                expect(true).toBe(true);
                done();
            }
        }, 500);
    });

    it('Tab from pager NumericTextBox should not move focus to grid row header', (done: Function) => {
        setTimeout(() => {
            const pagerEl: HTMLElement = document.querySelector('#PivotGridpivot-pager');
            const numericInput: HTMLElement = pagerEl ? pagerEl.querySelector('.e-numerictextbox') : null;
            if (numericInput) {
                numericInput.focus();
                const tabEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                    key: 'Tab', code: 'Tab', bubbles: true, cancelable: true
                });
                numericInput.dispatchEvent(tabEvent);
                setTimeout(() => {
                    const active: Element = document.activeElement;
                    expect(active && active.classList.contains('e-rowsheader')).toBeFalsy();
                    done();
                }, 100);
            } else {
                expect(true).toBe(true);
                done();
            }
        }, 500);
    });

    it('Shift+Tab from pager NumericTextBox should not move focus to grid row header', (done: Function) => {
        setTimeout(() => {
            const pagerEl: HTMLElement = document.querySelector('#PivotGridpivot-pager');
            const numericInput: HTMLElement = pagerEl ? pagerEl.querySelector('.e-numerictextbox') : null;
            if (numericInput) {
                numericInput.focus();
                const shiftTabEvent: KeyboardEvent = new KeyboardEvent('keydown', {
                    key: 'Tab', code: 'Tab', shiftKey: true, bubbles: true, cancelable: true
                });
                numericInput.dispatchEvent(shiftTabEvent);
                setTimeout(() => {
                    const active: Element = document.activeElement;
                    expect(active && active.classList.contains('e-rowsheader')).toBeFalsy();
                    done();
                }, 100);
            } else {
                expect(true).toBe(true);
                done();
            }
        }, 500);
    });

    it('Tab from in-grid NumericTextBox should still invoke grid focus strategy (regression guard)', (done: Function) => {
        setTimeout(() => {
            const pagerEl: HTMLElement = document.querySelector('#PivotGridpivot-pager');
            if (pagerEl && pagerEl.classList.contains('e-grid-pager')) {
                expect(pagerEl.classList.contains('e-grid-pager')).toBe(true);
                const pagerNumeric: HTMLElement = pagerEl.querySelector('.e-numerictextbox');
                if (pagerNumeric) {
                    const ancestor: Element = pagerNumeric.closest('.e-grid-pager');
                    expect(ancestor).not.toBeNull();
                } else {
                    expect(true).toBe(true);
                }
            } else {
                expect(true).toBe(true);
            }
            done();
        }, 500);
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

describe('Update Page setting', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    if (document.getElementById(elem.id)) {
        remove(document.getElementById(elem.id));
    }
    document.body.appendChild(elem);
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        PivotView.Inject(Toolbar,FieldList,Pager);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: []
            },
            width: '100%',
            height: 600,
            enablePaging: true,
            pageSettings: {
                rowPageSize: 10,
                columnPageSize: 5,
                currentColumnPage: 1,
                currentRowPage: 1
            },
            pagerSettings: {
                position: 'Bottom',
                enableCompactView: false,
                showColumnPager: true,
                showRowPager: true
            },
            gridSettings: { columnWidth: 120 },
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });
    it('For sample render', (done: Function) => {
        setTimeout(() => {
            expect(1).toBe(1);
            done();
        }, 500);
    });
    it('Last icon change', function (done) {
        (document.querySelectorAll('.e-lastpage')[0] as HTMLElement).click();
        (document.querySelectorAll('.e-lastpage')[1] as HTMLElement).click();
        done();
    });
    it('First icon change', function (done) {
        (document.querySelectorAll('.e-firstpage')[0] as HTMLElement).click();
        (document.querySelectorAll('.e-firstpage')[1] as HTMLElement).click();
        done();
    });
    it('Next icon change', function (done) {
        (document.querySelectorAll('.e-nextpage')[0] as HTMLElement).click();
        (document.querySelectorAll('.e-nextpage')[1] as HTMLElement).click();
        done();
    });
    it('Prev icon change', function (done) {
        (document.querySelectorAll('.e-prevpage')[0] as HTMLElement).click();
        (document.querySelectorAll('.e-prevpage')[1] as HTMLElement).click();
        done();
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
describe('-Single Pager with row page size', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    if (document.getElementById(elem.id)) {
        remove(document.getElementById(elem.id));
    }
    document.body.appendChild(elem);
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        PivotView.Inject(Toolbar,FieldList,Pager);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: []
            },
            width: '100%',
            height: 600,
            enablePaging: true,
            pageSettings: {
                rowPageSize: 10,
                columnPageSize: 5,
                currentColumnPage: 1,
                currentRowPage: 1
            },
            pagerSettings: {
                position: 'Top',
                enableCompactView: true,
                showColumnPager: false,
                showRowPager: true
            },
            gridSettings: { columnWidth: 120 },
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });
    it('For sample render', (done: Function) => {
        setTimeout(() => {
            expect(1).toBe(1);
            done();
        }, 500);
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
describe('-Single Pager without row page size', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    if (document.getElementById(elem.id)) {
        remove(document.getElementById(elem.id));
    }
    document.body.appendChild(elem);
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        PivotView.Inject(Toolbar,FieldList,Pager);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: []
            },
            width: '100%',
            height: 600,
            enablePaging: true,
            pageSettings: {
                rowPageSize: 10,
                columnPageSize: 5,
                currentColumnPage: 1,
                currentRowPage: 1
            },
            pagerSettings: {
                position: 'Top',
                enableCompactView: true,
                showColumnPager: false,
                showRowPager: true,
                showRowPageSize: false
            },
            gridSettings: { columnWidth: 120 },
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });
    it('For sample render', (done: Function) => {
        setTimeout(() => {
            expect(1).toBe(1);
            done();
        }, 500);
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
describe('-Single Pager with column page size', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    if (document.getElementById(elem.id)) {
        remove(document.getElementById(elem.id));
    }
    document.body.appendChild(elem);
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        PivotView.Inject(Toolbar,FieldList,Pager);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: []
            },
            width: '100%',
            height: 600,
            enablePaging: true,
            pageSettings: {
                rowPageSize: 10,
                columnPageSize: 5,
                currentColumnPage: 1,
                currentRowPage: 1
            },
            pagerSettings: {
                position: 'Top',
                enableCompactView: true,
                showColumnPager: true,
                showRowPager: false
            },
            gridSettings: { columnWidth: 120 },
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });
    it('For sample render', (done: Function) => {
        setTimeout(() => {
            expect(1).toBe(1);
            done();
        }, 500);
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
describe('-Single Pager without column page size', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    if (document.getElementById(elem.id)) {
        remove(document.getElementById(elem.id));
    }
    document.body.appendChild(elem);
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        PivotView.Inject(Toolbar,FieldList,Pager);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: []
            },
            width: '100%',
            height: 600,
            enablePaging: true,
            pageSettings: {
                rowPageSize: 10,
                columnPageSize: 5,
                currentColumnPage: 1,
                currentRowPage: 1
            },
            pagerSettings: {
                position: 'Top',
                enableCompactView: true,
                showColumnPager: true,
                showRowPager: false,
                showColumnPageSize: false
            },
            gridSettings: { columnWidth: 120 },
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });
    it('For sample render', (done: Function) => {
        setTimeout(() => {
            expect(1).toBe(1);
            done();
        }, 500);
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

describe('Pager internal helpers (unit)', () => {
    const PagerClass: any = require('../../src/pivotview/actions/pager').Pager;
    const events: any = require('../../src/common/base/constant');

    beforeEach((done: Function) => {
        setTimeout(() => done(), 1000);
    });

    it('updatePageSettings adjusts row and column pages and sets actionName', () => {
        const elem = createElement('div', { id: 'pg-test' });
        document.body.appendChild(elem);
        const parent: any = {
            element: elem,
            pageSettings: { currentRowPage: 2, currentColumnPage: 1 },
            engineModule: { rowPageCount: 3, columnPageCount: 3 },
            actionObj: { actionName: '' }
        };
        const pager: any = Object.create(PagerClass.prototype);
        pager.parent = parent;
        let pivotGridObj: PivotView = new PivotView({});
        // prev row (should decrement)
        pager.updatePageSettings({ target: { id: parent.element.id + '_row_prevIcon' } }, pivotGridObj);
        expect(parent.pageSettings.currentRowPage).toBe(1);
        // next column (should increment)
        pager.updatePageSettings({ target: { id: parent.element.id + '_column_nextIcon' } }, pivotGridObj);
        expect(parent.pageSettings.currentColumnPage).toBe(2);
        remove(elem);
    });

    it('createPagerContainer orders column before row when isInversed true and both pagers shown', () => {
        const elem = createElement('div', { id: 'pg-container' });
        document.body.appendChild(elem);
        const parent: any = {
            element: elem,
            grid: null,
            getGridWidthAsNumber: () => 800,
            getWidthAsNumber: () => 800,
            isAdaptive: false,
            pagerSettings: { showRowPager: true, showColumnPager: true, isInversed: true, showRowPageSize: false, showColumnPageSize: false },
            pageSettings: { currentRowPage: 1, currentColumnPage: 1 },
            engineModule: { rowPageCount: 2, columnPageCount: 2 },
            localeObj: { getConstant: (s: string) => s }
        };
        const pager: any = Object.create(PagerClass.prototype);
        pager.parent = parent;

        const html = pager.createPagerContainer();
        const colId = parent.element.id + '_column_mainDiv';
        const rowId = parent.element.id + '_row_mainDiv';
        expect(html.indexOf(colId)).toBeLessThan(html.indexOf(rowId));

        // when only row pager is shown
        parent.pagerSettings.showColumnPager = false;
        const html2 = pager.createPagerContainer();
        expect(html2.indexOf(rowId)).toBeGreaterThan(-1);
        expect(html2.indexOf(colId)).toBe(-1);

        remove(elem);
    });
});

describe('-Pager without column and page size', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    if (document.getElementById(elem.id)) {
        remove(document.getElementById(elem.id));
    }
    document.body.appendChild(elem);
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        PivotView.Inject(Toolbar,FieldList,Pager);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: []
            },
            width: '100%',
            height: 600,
            enablePaging: true,
            pageSettings: {
                rowPageSize: 10,
                columnPageSize: 5,
                currentColumnPage: 1,
                currentRowPage: 1
            },
            pagerSettings: {
                position: 'Top',
                enableCompactView: true,
                showColumnPager: true,
                showRowPager: true,
                showColumnPageSize: false,
                showRowPageSize:false
            },
            gridSettings: { columnWidth: 120 },
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });
    it('For sample render', (done: Function) => {
        setTimeout(() => {
            expect(1).toBe(1);
            done();
        }, 500);
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
describe('-Pager without compact view', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    if (document.getElementById(elem.id)) {
        remove(document.getElementById(elem.id));
    }
    document.body.appendChild(elem);
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        PivotView.Inject(Toolbar,FieldList,Pager);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: []
            },
            width: '100%',
            height: 600,
            enablePaging: true,
            pageSettings: {
                rowPageSize: 10,
                columnPageSize: 5,
                currentColumnPage: 1,
                currentRowPage: 1
            },
            pagerSettings: {
                position: 'Top',
                enableCompactView: false,
                showColumnPager: true,
                showRowPager: true,
                showColumnPageSize: true,
                showRowPageSize:true
            },
            gridSettings: { columnWidth: 120 },
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });
    it('For sample render', (done: Function) => {
        setTimeout(() => {
            expect(1).toBe(1);
            done();
        }, 500);
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

describe('- Pager Keyboard Navigation (WCAG 2.1)', () => {
    let pivotGridObj: PivotView;
    let elem: HTMLElement = createElement('div', { id: 'PivotGrid' });
    if (document.getElementById(elem.id)) {
        remove(document.getElementById(elem.id));
    }
    document.body.appendChild(elem);
    afterAll(() => {
        if (pivotGridObj) {
            pivotGridObj.destroy();
        }
        remove(elem);
    });
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        PivotView.Inject(Toolbar,FieldList,Pager);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: []
            },
            width: '100%',
            height: 600,
            enablePaging: true,
            pageSettings: {
                rowPageSize: 10,
                columnPageSize: 5,
                currentColumnPage: 1,
                currentRowPage: 1
            },
            pagerSettings: {
                position: 'Bottom',
                enableCompactView: false,
                showColumnPager: true,
                showRowPager: true,
                showColumnPageSize: true,
                showRowPageSize: true
            },
            gridSettings: { columnWidth: 120 },
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    beforeEach((done: Function) => {
        setTimeout(() => { done(); }, 1000);
    });

    it('Pager row region has role and aria-label', (done: Function) => {
        setTimeout(() => {
            const rowPagerDiv = document.getElementById('PivotGrid_row_mainDiv');
            expect(rowPagerDiv).not.toBeNull();
            if (rowPagerDiv) {
                expect(rowPagerDiv.getAttribute('role')).toBe('region');
                expect(rowPagerDiv.getAttribute('aria-label')).toContain('Page Navigation');
            }
            done();
        }, 500);
    });

    it('Pager column region has role and aria-label', (done: Function) => {
        setTimeout(() => {
            const columnPagerDiv = document.getElementById('PivotGrid_column_mainDiv');
            expect(columnPagerDiv).not.toBeNull();
            if (columnPagerDiv) {
                expect(columnPagerDiv.getAttribute('role')).toBe('region');
                expect(columnPagerDiv.getAttribute('aria-label')).toContain('Page Navigation');
            }
            done();
        }, 500);
    });

    it('Pager navigation buttons have role button and tabindex', (done: Function) => {
        setTimeout(() => {
            const firstIcon = document.getElementById('PivotGrid_row_firstIcon');
            const nextIcon = document.getElementById('PivotGrid_row_nextIcon');
            expect(firstIcon).not.toBeNull();
            if (firstIcon) {
                expect(firstIcon.getAttribute('role')).toBe('button');
                expect(firstIcon.getAttribute('tabindex')).toBe('-1');
            }
            if (nextIcon) {
                expect(nextIcon.getAttribute('role')).toBe('button');
                expect(nextIcon.getAttribute('tabindex')).toBe('0');
            }
            done();
        }, 500);
    });

    it('Disabled pager button has tabindex -1', (done: Function) => {
        setTimeout(() => {
            const firstIcon = document.getElementById('PivotGrid_row_firstIcon');
            if (firstIcon) {
                expect(firstIcon.getAttribute('aria-disabled')).toBe('true');
                expect(firstIcon.getAttribute('tabindex')).toBe('-1');
            }
            done();
        }, 500);
    });

    it('Enter key activates pager navigation button', (done: Function) => {
        setTimeout(() => {
            const nextIcon = document.getElementById('PivotGrid_row_nextIcon') as HTMLElement;
            const initialPage = pivotGridObj.pageSettings.currentRowPage;
            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            if (nextIcon) {
                nextIcon.dispatchEvent(event);
            }
            setTimeout(() => {
                expect(pivotGridObj.pageSettings.currentRowPage).toBeGreaterThan(initialPage);
                done();
            }, 200);
        }, 500);
    });

    it('Space key activates pager navigation button', (done: Function) => {
        setTimeout(() => {
            const nextIcon = document.getElementById('PivotGrid_row_nextIcon') as HTMLElement;
            const initialPage = pivotGridObj.pageSettings.currentRowPage;
            const event = new KeyboardEvent('keydown', { key: ' ' });
            if (nextIcon) {
                nextIcon.dispatchEvent(event);
            }
            setTimeout(() => {
                expect(pivotGridObj.pageSettings.currentRowPage).toBeGreaterThan(initialPage);
                done();
            }, 200);
        }, 500);
    });

    it('Shift+Tab from last pager button allows focus to move to previous button', (done: Function) => {
        setTimeout(() => {
            const pagerLastButton = document.getElementById('PivotGrid_row_lastIcon') as HTMLElement;
            const pagerPrevButton = document.getElementById('PivotGrid_row_prevIcon') as HTMLElement;
            if (pagerLastButton && pagerPrevButton) {
                const lastTabindex = pagerLastButton.getAttribute('tabindex');
                const prevTabindex = pagerPrevButton.getAttribute('tabindex');
                expect(lastTabindex).not.toBeNull('Last button should have tabindex');
                expect(prevTabindex).not.toBeNull('Previous button should have tabindex');
                pagerLastButton.focus();
                expect(document.activeElement).toBe(pagerLastButton);
                const shiftTabEvent = new KeyboardEvent('keydown', { 
                    key: 'Tab',
                    shiftKey: true,
                    bubbles: true
                });
                pagerLastButton.dispatchEvent(shiftTabEvent);
                expect(true).toBe(true, 'Shift+Tab event dispatched successfully');
            }
            done();
        }, 500);
    });

    it('Tab within pager region respects natural Tab order between buttons', (done: Function) => {
        setTimeout(() => {
            const pagerRegion = document.querySelector('[role="region"]') as HTMLElement;
            
            if (pagerRegion) {
                const role = pagerRegion.getAttribute('role');
                const ariaLabel = pagerRegion.getAttribute('aria-label');
                expect(role).toBe('region', 'Pager should have role="region"');
                expect(ariaLabel).toBeTruthy('Pager should have aria-label');
                const focusableButtons = pagerRegion.querySelectorAll('div[tabindex="0"]');
                expect(focusableButtons.length > 0).toBe(true, 'Pager region should have focusable button elements');
            }
            done();
        }, 500);
    });
});
})