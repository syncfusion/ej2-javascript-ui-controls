import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { PivotCommon } from '../../src/common/base/pivot-common';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

/**
 * Pivot Field List render spec
 */

describe('Pivot Field List Rendering', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Field List with Static mode', () => {
        let fieldListObj: PivotFieldList;
        let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
        afterAll(() => {
            if (fieldListObj) {
                fieldListObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            fieldListObj = new PivotFieldList(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name', caption: 'The caption is used to show the horizontal scrollbar' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    renderMode: 'Fixed'
                });
            fieldListObj.appendTo('#PivotFieldList');
        });
        let persistdata: string;
        it('control class testing', () => {
            expect(document.getElementById('PivotFieldList').classList.contains('e-pivotfieldlist')).toEqual(true);
        });
        it('check field list control wrapper', () => {
            expect(!isNullOrUndefined(fieldListObj.element.querySelector('.e-pivotfieldlist-wrapper')));
        });
        it('check calculated field', () => {
            let controlWrapper: HTMLElement = fieldListObj.element.querySelector('.e-pivotfieldlist-wrapper');
            (controlWrapper.querySelector('.e-calculated-field') as HTMLElement).click();
            expect(!isNullOrUndefined(fieldListObj.element.querySelector('.e-pivotfieldlist-wrapper')));
        });
    });
    describe('Field List with Dynamic mode', () => {
        let fieldListObj: PivotFieldList;
        let pivotCommon: PivotCommon;
        let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
        let elem1: HTMLElement = createElement('div', { id: 'PivotFieldList1', styles: 'height:400px;width:60%' });
        afterAll(() => {
            if (fieldListObj) {
                fieldListObj.destroy();
            }
            remove(elem);
            remove(elem1);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            if (document.getElementById(elem1.id)) {
                remove(document.getElementById(elem1.id));
            }
            document.body.appendChild(elem);
            document.body.appendChild(elem1);
            fieldListObj = new PivotFieldList(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name', caption: 'The caption is used to show the horizontal scrollbar' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    renderMode: 'Popup',
                    target: elem1
                });
            fieldListObj.appendTo('#PivotFieldList');
            util.disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
            pivotCommon = fieldListObj.pivotCommon;
        });
        let persistdata: string;
        it('control class testing', () => {
            expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
        });
        it('check field list icon', () => {
            (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('check field list dialog with targetID', () => {
            expect(!isNullOrUndefined(elem1.querySelector('.e-pivotfieldlist-wrapper')));
        });
        it('check calculated field', () => {
            let controlWrapper: HTMLElement = elem1.querySelector('.e-pivotfieldlist-wrapper');
            (controlWrapper.querySelector('.e-calculated-field') as HTMLElement).click();
            expect(!isNullOrUndefined(elem1.querySelector('.e-pivotfieldlist-wrapper')));
            expect(elem1.querySelector('.e-pivotfieldlist-wrapper').classList.contains('e-popup-open'));
        });
        it('check filter popup', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('check close field list', () => {
            let controlWrapper: HTMLElement = elem1.querySelector('.e-pivotfieldlist-wrapper');
            (controlWrapper.querySelector('.e-cancel-btn') as HTMLElement).click();
            expect(elem1.querySelector('.e-pivotfieldlist-wrapper').classList.contains('e-popup-close'));
        });
    });
    describe('Field List with target ID', () => {
        let fieldListObj: PivotFieldList;
        let pivotCommon: PivotCommon;
        let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
        let elem1: HTMLElement = createElement('div', { id: 'PivotFieldList1', styles: 'height:400px;width:60%' });
        afterAll(() => {
            if (fieldListObj) {
                fieldListObj.destroy();
            }
            remove(elem);
            remove(elem1);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            if (document.getElementById(elem1.id)) {
                remove(document.getElementById(elem1.id));
            }
            document.body.appendChild(elem);
            document.body.appendChild(elem1);
            fieldListObj = new PivotFieldList(
                {
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        enableSorting: true,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    renderMode: 'Popup',
                    target: '#' + elem1.id
                });
            fieldListObj.appendTo('#PivotFieldList');
            util.disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
            pivotCommon = fieldListObj.pivotCommon;
        });
        let persistdata: string;
        it('control class testing', () => {
            expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
        });
        it('check field list icon', () => {
            (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
            expect(true).toBe(true);
        });
        it('check field list dialog with targetID', () => {
            expect(!isNullOrUndefined(elem1.querySelector('.e-pivotfieldlist-wrapper')));
        });
        it('check calculated field', () => {
            let controlWrapper: HTMLElement = elem1.querySelector('.e-pivotfieldlist-wrapper');
            (controlWrapper.querySelector('.e-calculated-field') as HTMLElement).click();
            expect(!isNullOrUndefined(elem1.querySelector('.e-pivotfieldlist-wrapper')));
            expect(elem1.querySelector('.e-pivotfieldlist-wrapper').classList.contains('e-popup-open'));
        });
        it('check filter popup', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('check close field list', () => {
            let controlWrapper: HTMLElement = elem1.querySelector('.e-pivotfieldlist-wrapper');
            (controlWrapper.querySelector('.e-cancel-btn') as HTMLElement).click();
            expect(elem1.querySelector('.e-pivotfieldlist-wrapper').classList.contains('e-popup-close'));
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