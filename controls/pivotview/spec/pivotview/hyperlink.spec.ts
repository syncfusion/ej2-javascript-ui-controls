import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove } from '@syncfusion/ej2-base';
import { HyperCellClickEventArgs } from '../../src/common/base/interface';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Pivot Grid - HyperLink', () => {
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
            this.skip(); //Skips test (in Chai)
            return;
        }
        if (document.getElementById(elem.id)) {
            remove(document.getElementById(elem.id));
        }
        document.body.appendChild(elem);
        pivotGridObj = new PivotView({
            dataSourceSettings: {
                dataSource: pivot_dataset as IDataSet[],
                expandAll: true,
                enableSorting: true,
                sortSettings: [{ name: 'company', order: 'Descending' }],
                formatSettings: [{ name: 'balance', format: 'C' }],
                drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
                filterSettings: [{ name: 'eyeColor', type: 'Exclude', items: ['blue'] }
                ],
                rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                values: [{ name: 'balance' }, { name: 'quantity' }],
                filters: [],
            },
            width: 1000,
            height: 200
        });
        pivotGridObj.appendTo('#PivotGrid');
    });
    it('Check on show all cells hyperlink', (done: Function) => {
        pivotGridObj.hyperlinkSettings = {
            showHyperlink: true,
            showRowHeaderHyperlink: false,
            showColumnHeaderHyperlink: false,
            showValueCellHyperlink: false,
            showSummaryCellHyperlink: false,
            headerText: undefined,
            conditionalSettings: []
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
            expect(pivotGridObj.element.querySelector('.e-gridcontent .e-frozencontent td a')).toBeTruthy;
            done();
        }, 1000);
    });
    it('Check on show row header cell hyperlink only', (done: Function) => {
        pivotGridObj.hyperlinkSettings = {
            showHyperlink: false,
            showRowHeaderHyperlink: true,
            showColumnHeaderHyperlink: false,
            showValueCellHyperlink: false,
            showSummaryCellHyperlink: false,
            headerText: undefined,
            conditionalSettings: []
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
            expect(pivotGridObj.element.querySelector('.e-gridcontent .e-frozencontent td a')).toBeTruthy;
            done();
        }, 1000);
    });
    it('Check on show column cell hyperlink only', (done: Function) => {
        pivotGridObj.hyperlinkSettings = {
            showHyperlink: false,
            showRowHeaderHyperlink: false,
            showColumnHeaderHyperlink: true,
            showValueCellHyperlink: false,
            showSummaryCellHyperlink: false,
            headerText: undefined,
            conditionalSettings: []
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
            expect(pivotGridObj.element.querySelector('.e-gridheader .e-headercontent th a')).toBeTruthy;
            done();
        }, 1000);
    });
    it('Check on show value cells hyperlink only', (done: Function) => {
        pivotGridObj.hyperlinkSettings = {
            showHyperlink: false,
            showRowHeaderHyperlink: false,
            showColumnHeaderHyperlink: false,
            showValueCellHyperlink: true,
            showSummaryCellHyperlink: false,
            headerText: undefined,
            conditionalSettings: []
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
            expect(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent').querySelectorAll('.e-valuescontent a')[30]).toBeTruthy;
            done();
        }, 1000);
    });
    it('Check on show summary cells hyperlink only', (done: Function) => {
        pivotGridObj.hyperlinkSettings = {
            showHyperlink: false,
            showRowHeaderHyperlink: false,
            showColumnHeaderHyperlink: false,
            showValueCellHyperlink: false,
            showSummaryCellHyperlink: true,
            headerText: undefined,
            conditionalSettings: []
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
            expect(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent td a')).toBeTruthy;
            done();
        }, 1000);
    });
    it('Check on show hyperlink with conditional-based', (done: Function) => {
        pivotGridObj.hyperlinkSettings = {
            showHyperlink: false,
            showRowHeaderHyperlink: false,
            showColumnHeaderHyperlink: false,
            showValueCellHyperlink: false,
            showSummaryCellHyperlink: false,
            headerText: undefined,
            conditionalSettings: [
                {
                    label: 'Tempo',
                    conditions: 'LessThan',
                    value1: 1000,
                    value2: 550
                },
                {
                    measure: 'balance',
                    conditions: 'LessThan',
                    value1: 10000
                }
            ]
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
            expect(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent').querySelectorAll('.e-valuescontent a')[40]).toBeTruthy;
            done();
        }, 1000);
    });
    it('Check on show hyperlink with label text', (done: Function) => {
        pivotGridObj.hyperlinkSettings = {
            showHyperlink: false,
            showRowHeaderHyperlink: false,
            showColumnHeaderHyperlink: false,
            showValueCellHyperlink: false,
            showSummaryCellHyperlink: false,
            headerText: 'female.false',
            conditionalSettings: []
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            expect(pivotGridObj.element.querySelectorAll('.e-gridheader,.e-gridcontent').length > 1).toBeTruthy();
            expect(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent td a')).toBeTruthy;
            done();
        }, 1000);
    });
    it('Check on hyperlink click event trigger with label text', (done: Function) => {
        pivotGridObj.hyperlinkCellClick = function (args: HyperCellClickEventArgs) {
            args.cancel = false;
        };
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            expect(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent td a')).toBeTruthy;
            //(pivotGridObj.element.querySelector('.e-gridcontent .e-movablecontent td a') as HTMLElement).click();
            done();
        }, 1000);
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