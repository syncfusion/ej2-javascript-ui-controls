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
})