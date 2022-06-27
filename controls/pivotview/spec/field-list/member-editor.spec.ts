import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { MemberEditorOpenEventArgs, MemberFilteringEventArgs } from '../../src/common/base/interface';

describe('- Members limit in editor - field list', () => {
    let fieldListObj: PivotFieldList;
    let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
    afterAll(() => {
        if (fieldListObj) {
            fieldListObj.destroy();
        }
        remove(elem);
    });
    beforeAll((done: Function) => {
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
        let dataBound: EmitType<Object> = () => { done(); };
        fieldListObj = new PivotFieldList(
            {
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product' }, { name: 'state' }],
                    columns: [{ name: 'gender' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'index' }]
                },
                maxNodeLimitInMemberEditor: 5,
                renderMode: 'Fixed',
                dataBound: dataBound,
                memberEditorOpen: (args: MemberEditorOpenEventArgs) => {
                    expect(args.fieldMembers).toBeTruthy;
                    expect(args.cancel).toBe(false);
                    console.log('MemberFilterOpenNAme: ' + args.fieldName);
                },
                memberFiltering: (args: MemberFilteringEventArgs) => {
                    expect(args.filterSettings).toBeTruthy;
                    expect(args.cancel).toBe(false);
                    console.log('MemberFilterOpenNAme: ' + args.filterSettings.name);
                }
            });
        fieldListObj.appendTo('#PivotFieldList');
    });
    it('field list render testing', () => {
        // if (document.querySelectorAll('.e-pivot-calc-dialog-div .e-icon-btn')) {
        //     (document.querySelectorAll('.e-pivot-calc-dialog-div .e-icon-btn')[0] as HTMLElement).click()
        // }
        expect(document.querySelectorAll('.e-pivot-button').length).toBe(6);
    });

    it('check filtering field', (done: Function) => {
        let pivotButtons: HTMLElement[] =
            [].slice.call(document.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
        ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
        setTimeout(() => {
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            done();
        }, 1000);
    });
    it('check all nodes on filter popup', () => {
        let allNode: HTMLElement = document.querySelector('.e-member-editor-container .e-checkbox-wrapper');
        let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
        allNode.querySelector('.e-frame').dispatchEvent(args);
        args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
        allNode.querySelector('.e-frame').dispatchEvent(args);
        args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
        allNode.querySelector('.e-frame').dispatchEvent(args);
        let checkedEle: Element[] = <Element[] & NodeListOf<Element>>document.querySelectorAll('.e-member-editor-container .e-check');
        expect(checkedEle.length).toEqual(0);
        expect(document.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
        let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-container .e-checkbox-wrapper')[1] as HTMLElement;
        args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        checkedEle = <Element[] & NodeListOf<Element>>document.querySelectorAll('.e-member-editor-container .e-check');
        expect(checkedEle.length).toEqual(1);
        expect(document.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
        (document.querySelector('.e-ok-btn') as HTMLElement).click();
    });
    it('check filter state after update', () => {
        expect(document.querySelectorAll('.e-pv-filtered').length).toBe(1);
    });
    it('check filtering field', (done: Function) => {
        let pivotButtons: HTMLElement[] =
            [].slice.call(document.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
        ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
        setTimeout(() => {
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(0);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            done();
        }, 1000);
    });
    it('search 0', () => {
        let searchOption: MaskedTextBox = fieldListObj.pivotCommon.filterDialog.editorSearch;
        searchOption.setProperties({ value: '0' });
        searchOption.change({ value: searchOption.value });
        expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
        expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(0);
        expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
        expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[1] as HTMLElement).innerText).toBe("10");
    });
    it('search 11', () => {
        let searchOption: MaskedTextBox = fieldListObj.pivotCommon.filterDialog.editorSearch;
        searchOption.setProperties({ value: '11' });
        searchOption.change({ value: searchOption.value });
        expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
        expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(0);
        expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(0);
        expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("811");
    });
    it('check 11', (done: Function) => {
        let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
        let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-container .e-checkbox-wrapper')[1] as HTMLElement;
        args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        let searchOption: MaskedTextBox = fieldListObj.pivotCommon.filterDialog.editorSearch;
        searchOption.setProperties({ value: '0' });
        searchOption.change({ value: searchOption.value });
        setTimeout(() => {
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("40");
            done();
        }, 1000);
    });
    it('search 11', () => {
        let searchOption: MaskedTextBox = fieldListObj.pivotCommon.filterDialog.editorSearch;
        searchOption.setProperties({ value: '11' });
        searchOption.change({ value: searchOption.value });
        expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
        expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
        expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
        expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("811");
    });
    it('check all search 0', (done: Function) => {
        let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
        let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-container .e-checkbox-wrapper')[0] as HTMLElement;
        args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(1);
        expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(5);
        let searchOption: MaskedTextBox = fieldListObj.pivotCommon.filterDialog.editorSearch;
        searchOption.setProperties({ value: '0' });
        searchOption.change({ value: searchOption.value });
        setTimeout(() => {
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("40");
            done();
        }, 1000);
    });
    it('check all btn click', () => {
        let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
        let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-container .e-checkbox-wrapper')[0] as HTMLElement;
        args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
        firstNode.querySelector('.e-frame').dispatchEvent(args);
        expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(1);
        expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(5);
        (document.querySelector('.e-ok-btn') as HTMLElement).click();
    });
    it('change mem limit to 10', (done: Function) => {
        fieldListObj.maxNodeLimitInMemberEditor = 10;
        let pivotButtons: HTMLElement[] =
            [].slice.call(document.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
        ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
        setTimeout(() => {
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(10);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            done();
        }, 1000);
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