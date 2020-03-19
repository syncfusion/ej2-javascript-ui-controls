import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, closest } from '@syncfusion/ej2-base';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { PivotCommon } from '../../src/common/base/pivot-common';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { TreeView } from '@syncfusion/ej2-navigations';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { MemberEditorOpenEventArgs, MemberFilteringEventArgs } from '../../src/common/base/interface';

describe('Member Filter', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Check Filter Actions', () => {
        let fieldListObj: PivotFieldList;
        let pivotCommon: PivotCommon;
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
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    renderMode: 'Fixed',
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
            pivotCommon = fieldListObj.pivotCommon;
        });
        it('open filter popup', (done: Function) => {
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
        it('close filter popup by cancel', (done: Function) => {
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-cancel-btn') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                done();
            }, 1000);
        });
        it('check include type filter field', (done: Function) => {
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
        it('check all nodes on filter popup', () => {
            let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(allNode.classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(allNode, 'li'));
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkEle.length).toEqual(checkedEle.length);
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter state after update', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filter')).toBeTruthy;
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('un-check all nodes on filter popup', () => {
            let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(allNode.classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(allNode, 'li'));
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
        });
        it('check single node on filter popup', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
            expect(checkedEle.length).toEqual(1);
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
        });
        it('un-check single node on filter popup', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
            expect(checkedEle.length).toEqual(0);
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('update filter State by check member node', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
            expect(checkedEle.length).toEqual(1);
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter popup after update', () => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
        });
        it('check exclude type filter field', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[1]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('close filter dialog by sort icon', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                done();
            }, 1000);
        });
        it('check filter field without having filter-setings', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('un-check single node on filter popup', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            let allNode: HTMLElement = pivotCommon.filterDialog.allMemberSelect.element.querySelector('.e-checkbox-wrapper');
            expect(allNode.querySelector('.e-frame').classList.contains('e-stop')).toBeTruthy;
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
        });
        it('check filter popup after update', () => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
        });
        it('check search nodes for no matches', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let searchOption: MaskedTextBox = pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '1' });
            searchOption.change({ value: searchOption.value });
            let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
            let allNode: HTMLLIElement[] = <HTMLLIElement[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            expect(allNode.length).toBe(1);
            expect(allNode[0].classList.contains('e-disable')).not.toBeTruthy;
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
        });
        it('check single node on search nodes', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let searchOption: MaskedTextBox = pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: 'delhi' });
            searchOption.change({ value: searchOption.value });
            let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
            let allNode: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(allNode.length).toBe(1);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(allNode[0], 'li'));
            expect(allNode[0].querySelector('.e-frame').classList.contains('e-check')).not.toBeTruthy;
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter popup after update', () => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
        });
    });
    describe('Check Filter Actions without member filtering enabled', () => {
        let fieldListObj: PivotFieldList;
        let pivotCommon: PivotCommon;
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
                        allowMemberFilter: false,
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                        { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male'] }],
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    renderMode: 'Fixed',
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
            pivotCommon = fieldListObj.pivotCommon;
        });
        it('open filter popup', () => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toEqual(3);
            expect(((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).classList).toContain('e-disable');
            expect(((pivotButtons[1]).querySelector('.e-btn-filter') as HTMLElement).classList).toContain('e-disable');
            expect(((pivotButtons[2]).querySelector('.e-btn-filter') as HTMLElement).classList).toContain('e-disable');
        });
    });
    describe('Check Filter Actions for unavailable members', () => {
        let fieldListObj: PivotFieldList;
        let pivotCommon: PivotCommon;
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
                        filterSettings: [{ name: 'name', type: 'Include', items: ['Knight', 'Wooten'] },  // having unavailable member
                        { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                        { name: 'gender', type: 'Include', items: ['male', 'femal'] }], // having unavailable member
                        rows: [{ name: 'company' }, { name: 'state' }],
                        columns: [{ name: 'name' }],
                        values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    renderMode: 'Fixed',
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
            pivotCommon = fieldListObj.pivotCommon;
        });
        it('check filter status on "name" field', () => {
            let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect(pivotButtons[0].querySelector('.e-btn-filter').classList.contains('e-pv-filter'));
        });
        it('open filter popup', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect(pivotButtons[0].querySelector('.e-btn-filter').classList.contains('e-pv-filtered'));
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('close filter popup by cancel', (done: Function) => {
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-cancel-btn') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                done();
            }, 1000);
        });
        it('check include type filter field', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect(pivotButtons[0].querySelector('.e-btn-filter').classList.contains('e-pv-filtered'));
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('check all nodes on filter popup', () => {
            let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkedEle.length).toEqual(1);
            expect(allNode.classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(allNode, 'li'));
            checkedEle = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
            expect(checkEle.length).toEqual(checkedEle.length);
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter state after update', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filter')).toBeTruthy;
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('un-check all nodes on filter popup', () => {
            let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
            let memberTreeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(allNode.classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(allNode, 'li'));
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
        });
        it('check single node on filter popup', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
            expect(checkedEle.length).toEqual(1);
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
        });
        it('un-check single node on filter popup', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
            expect(checkedEle.length).toEqual(0);
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('update filter State by check member node', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            let checkedEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
            expect(checkedEle.length).toEqual(1);
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter popup after update', () => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
        });
        it('check exclude type filter field', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[1]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('close filter dialog by sort icon', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                done();
            }, 1000);
        });
        it('check filter field without having filter-setings', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                done();
            }, 1000);
        });
        it('un-check single node on filter popup', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
            let allNode: HTMLElement = pivotCommon.filterDialog.allMemberSelect.element.querySelector('.e-checkbox-wrapper');
            expect(allNode.querySelector('.e-frame').classList.contains('e-stop')).toBeTruthy;
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
        });
        it('check filter popup after update', () => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
        });
        it('check search nodes for no matches', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let searchOption: MaskedTextBox = pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: '1' });
            searchOption.change({ value: searchOption.value });
            let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
            let allNode: HTMLLIElement[] = <HTMLLIElement[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
            expect(allNode.length).toBe(1);
            expect(allNode[0].classList.contains('e-disable')).not.toBeTruthy;
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
        });
        it('check single node on search nodes', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let searchOption: MaskedTextBox = pivotCommon.filterDialog.editorSearch;
            searchOption.setProperties({ value: 'delhi' });
            searchOption.change({ value: searchOption.value });
            let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
            let allNode: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(allNode.length).toBe(1);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(allNode[0], 'li'));
            expect(allNode[0].querySelector('.e-frame').classList.contains('e-check')).not.toBeTruthy;
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter popup after update', () => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
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