import { IDataSet } from '../../src/base/engine';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { TreeView } from '@syncfusion/ej2-navigations';
import { Dialog } from '@syncfusion/ej2-popups';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { MemberEditorOpenEventArgs, MemberFilteringEventArgs } from '../../src/common/base/interface';

describe('- Members limit in editor', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('- Members limit in editor - groupingbar', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
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
            PivotView.Inject(GroupingBar);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product' }, { name: 'state' }],
                    columns: [{ name: 'gender' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'index' }],
                    allowLabelFilter: true,
                    allowValueFilter: true
                },
                showGroupingBar: true,
                dataBound: dataBound,
                maxNodeLimitInMemberEditor: 5,
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
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('grouping bar render testing', () => {
            expect(document.querySelectorAll('.e-pivot-button').length).toBe(6);
        });

        it('check filtering field', (done: Function) => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                done();
            }, 1000);
        });
        it('check all nodes on filter popup', () => {
            let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
            let filterDialog: Dialog = pivotGridObj.pivotCommon.filterDialog.dialogPopUp;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkedEle.length).toEqual(0);
            expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
            let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[1] as HTMLElement;
            args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            checkedEle = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkedEle.length).toEqual(1);
            expect(filterDialog.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (filterDialog.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter state after update', (done: Function) => {
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"]')[1] as HTMLElement).innerText).toBe('Grand Total');
                done();
            }, 1000);
        });
        it('check filtering field', (done: Function) => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(0);
                expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                done();
            }, 1000);
        });
        it('search 0', () => {
            let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '0' });
            searchOption.change({ value: searchOption.value });
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(0);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[1] as HTMLElement).innerText).toBe("10");
        });
        it('search 11', () => {
            let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '11' });
            searchOption.change({ value: searchOption.value });
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(0);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(0);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("811");
        });
        it('check 11', () => {
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[1] as HTMLElement;
            args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '0' });
            searchOption.change({ value: searchOption.value });
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("40");
        });
        it('search 11', () => {
            let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '11' });
            searchOption.change({ value: searchOption.value });
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("811");
        });
        it('check all search 0', () => {
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[0] as HTMLElement;
            args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(5);
            let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '0' });
            searchOption.change({ value: searchOption.value });
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("40");
        });
        it('check all btn click', () => {
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            let firstNode: HTMLElement = document.querySelectorAll('.e-checkbox-wrapper')[0] as HTMLElement;
            args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(5);
            (document.querySelector('.e-ok-btn') as HTMLElement).click();
            pivotGridObj.maxNodeLimitInMemberEditor = 3;
        });
        it('state search a', (done: Function) => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-rows').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[1]).querySelector('.e-btn-filter') as HTMLElement).click();
            setTimeout(() => {
                let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
                searchOption.setProperties({ value: 'a' });
                searchOption.change({ value: searchOption.value });
                expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(3);
                done();
            }, 1000);
        });
        it('gender search a', (done: Function) => {
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-columns').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            setTimeout(() => {
                let searchOption: MaskedTextBox = pivotGridObj.pivotCommon.filterDialog.editorSearch;
                searchOption.setProperties({ value: 'a' });
                searchOption.change({ value: searchOption.value });
                expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(2);
                done();
            }, 1000);
        });
        it('change mem limit to 10', (done: Function) => {
            pivotGridObj.maxNodeLimitInMemberEditor = 10;
            let pivotButtons: HTMLElement[] =
                [].slice.call(pivotGridObj.element.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(10);
                expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
                expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
                done();
            }, 1000);
        });
    });
    describe('- Members limit in editor - field list', () => {
        let pivotGridObj: PivotView;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
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
            PivotView.Inject(FieldList);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    rows: [{ name: 'product' }, { name: 'state' }],
                    columns: [{ name: 'gender' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'index' }]
                },
                showFieldList: true,
                dataBound: dataBound,
                maxNodeLimitInMemberEditor: 5,
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
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('field list render testing', () => {
            expect(document.querySelectorAll('.e-pivot-button').length).toBe(6);
        });

        it('check filtering field', (done: Function) => {
            (document.querySelectorAll('.e-toggle-field-list')[0] as HTMLElement).click();
            let pivotButtons: HTMLElement[] =
                [].slice.call(document.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
                done();
            }, 1000);
        });
        it('check all nodes on filter popup', () => {
            let allNode: HTMLElement = document.querySelector('.e-member-editor-wrapper .e-checkbox-wrapper');
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            allNode.querySelector('.e-frame').dispatchEvent(args);
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>document.querySelectorAll('.e-member-editor-wrapper .e-check');
            expect(checkedEle.length).toEqual(0);
            expect(document.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
            let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[1] as HTMLElement;
            args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            checkedEle = <Element[] & NodeListOf<Element>>document.querySelectorAll('.e-member-editor-wrapper .e-check');
            expect(checkedEle.length).toEqual(1);
            expect(document.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (document.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter state after update', (done: Function) => {
            setTimeout(() => {
                expect((document.querySelectorAll('td[aria-colindex="0"]')[1] as HTMLElement).innerText).toBe('Grand Total');
                done();
            }, 1000);
        });
        it('check filtering field', (done: Function) => {
            (document.querySelectorAll('.e-toggle-field-list')[0] as HTMLElement).click();
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
            let searchOption: MaskedTextBox = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '0' });
            searchOption.change({ value: searchOption.value });
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(0);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[1] as HTMLElement).innerText).toBe("10");
        });
        it('search 11', () => {
            let searchOption: MaskedTextBox = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '11' });
            searchOption.change({ value: searchOption.value });
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(0);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(0);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("811");
        });
        it('check 11', () => {
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[1] as HTMLElement;
            args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            let searchOption: MaskedTextBox = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '0' });
            searchOption.change({ value: searchOption.value });
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("40");
        });
        it('search 11', () => {
            let searchOption: MaskedTextBox = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '11' });
            searchOption.change({ value: searchOption.value });
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("811");
        });
        it('check all search 0', () => {
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[0] as HTMLElement;
            args = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("mouseup", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            args = new MouseEvent("click", { view: window, bubbles: true, cancelable: true });
            firstNode.querySelector('.e-frame').dispatchEvent(args);
            expect(document.querySelectorAll('.e-select-all li .e-check').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(5);
            let searchOption: MaskedTextBox = pivotGridObj.pivotFieldListModule.pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '0' });
            searchOption.change({ value: searchOption.value });
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(5);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
            expect((document.querySelectorAll('.e-member-editor-container li .e-list-text')[4] as HTMLElement).innerText).toBe("40");
        });
        it('check all btn click', () => {
            let args: MouseEvent = new MouseEvent("mousedown", { view: window, bubbles: true, cancelable: true });
            let firstNode: HTMLElement = document.querySelectorAll('.e-member-editor-wrapper .e-checkbox-wrapper')[0] as HTMLElement;
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
        it('change mem limit to 10', () => {
            pivotGridObj.maxNodeLimitInMemberEditor = 10;
            pivotGridObj.pivotFieldListModule.maxNodeLimitInMemberEditor = 10;
            let pivotButtons: HTMLElement[] =
                [].slice.call(document.querySelector('.e-filters').querySelectorAll('.e-pivot-button'));
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
        });
        it('change mem limit to 10-check', () => {
            expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(10);
            expect(document.querySelectorAll('.e-select-all li .e-stop').length).toBe(1);
            expect(document.querySelectorAll('.e-member-editor-container li .e-check').length).toBe(1);
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