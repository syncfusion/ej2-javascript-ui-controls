import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, closest, getInstance } from '@syncfusion/ej2-base';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { PivotCommon } from '../../src/common/base/pivot-common';
import { TreeView } from '@syncfusion/ej2-navigations';
import { EventHandler } from '@syncfusion/ej2-base';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import { MemberEditorOpenEventArgs, MemberFilteringEventArgs } from '../../src/common/base/interface';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';

describe('Pivot Field List Slicer Appearance', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            pending(); //Skips test (in Chai)
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
                        calculatedFieldSettings: [
                            { name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
                            { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
                        filterSettings: [
                            { name: 'product', type: 'Exclude', items: ['Car', 'Bike', 'Van', 'Jet', 'Tempo'] },
                            { name: 'eyeColor', type: 'Include', items: ['blue', 'brown'] },
                            { name: 'isActive', type: 'Exclude', items: ['false'] },
                            { name: 'pno', type: 'Include', items: ['MEWD9812'] },
                            { name: 'state', type: 'Include', items: ['Rajkot', 'New Jercy', 'Vetaikan', 'Tamilnadu', 'Californiya', 'Delhi'] },
                            { name: 'gender', type: 'Exclude', items: ['male'] },
                            { name: 'email', type: 'Exclude', items: ['gwendixon@icology.com', 'skinnerward@grok.com'] }
                        ],
                        rows: [{ name: 'product' }],
                        columns: [{ name: 'gender' }],
                        values: [{ name: 'balance' }, { name: 'price', type: 'CalculatedField' },
                        { name: 'quantity' }],
                        filters: [{ name: 'eyeColor' }, { name: 'product' }, { name: 'isActive' }, { name: 'state' }, { name: 'pno' }, { name: 'gender' }]
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
                    },
                    locale: 'en-US'
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
                expect(pivotCommon.filterDialog.dialogPopUp).toBeNull;
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
        it('check filter button state after update', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let filterAxis: HTMLElement = leftAxisPanel.querySelector('.e-filters');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: HTMLElement[] = [].slice.call(filterAxis.querySelectorAll('.e-pivot-button'));
                expect((pivotButtons[0].querySelector('.e-pvt-btn-content') as HTMLElement).innerText).toEqual('eyeColor (All)');
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
        it('un-check single node on filter popup', () => {
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
            let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
            expect(checkEle.length).toBeGreaterThan(0);
            expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
            util.checkTreeNode(treeObj, closest(checkEle[2], 'li'));
            util.checkTreeNode(treeObj, closest(checkEle[1], 'li'));
            let allNode: HTMLElement = pivotCommon.filterDialog.allMemberSelect.element.querySelector('.e-checkbox-wrapper');
            expect(allNode.querySelector('.e-frame').classList.contains('e-stop')).toBeTruthy;
            expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
            (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
        });
        it('check filter button after update', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let filterAxisContent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
            let pivotButtons: HTMLElement[] = [].slice.call(filterAxisContent.querySelectorAll('.e-pivot-button'));
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((pivotButtons[3].querySelector('.e-pvt-btn-content') as HTMLElement).innerText).toEqual('state (All)');
                done();
            }, 1000);
        });
        it('check filter popup after update', () => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            expect((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
        });
        it('check filter button state', (done: Function) => {
            fieldListObj.dataSourceSettings.filterSettings = [{ name: 'eyeColor', type: 'Include', items: ['green'] }];
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect((pivotButtons[0].querySelector('.e-pvt-btn-content') as HTMLElement).innerText).toEqual('eyeColor (All)');
                done();
            }, 1000);
        });
        it('check single node on filter popup', (done: Function) => {
            fieldListObj.dataSourceSettings.filterSettings = [{ name: 'eyeColor', type: 'Include', items: ['green'] }];
            expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect((pivotButtons[0].querySelector('.e-pvt-btn-content') as HTMLElement).innerText).toEqual('eyeColor (All)');
                done();
            }, 1000);
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
        it('check single node on filter', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect((pivotButtons[4].querySelector('.e-pvt-btn-content') as HTMLElement).innerText).toEqual('pno (MEWD9812)');
                done();
            }, 1000);
        });
        it('uncheck single node on filter popup', () => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        it('drag and drop pivot button from filter axis to row axis', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            let filterAxisContent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
            let pivotButton: HTMLElement[] = [].slice.call((filterAxisContent).querySelectorAll('.e-pivot-button'));
            let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, filterAxisContent, 15, 70);
            mousemove.srcElement = filterAxisContent;
            mousemove.target = mousemove.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, filterAxisContent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = filterAxisContent;
            mouseUp.target = mouseUp.toElement = rowAxiscontent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            setTimeout(() => {
                pivotButton = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp).toBeNull;
                expect((pivotButton[pivotButton.length - 1].querySelector('.e-pvt-btn-content') as HTMLElement).innerText).toEqual('eyeColor');
                done();
            }, 1000);
        });
        it('drag/drop pivot button from row axis to filter axis', (done: Function) => {
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
            let filterAxisContent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
            let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
            let dragElement: HTMLElement = pivotButton[pivotButton.length - 1].querySelector('.e-draggable');
            let mousedown: any =
                util.getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
            EventHandler.trigger(dragElement, 'mousedown', mousedown);
            let mousemove: any =
                util.getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
            mousemove.srcElement = rowAxiscontent;
            mousemove.target = mousemove.toElement = filterAxisContent;
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            mousemove = util.setMouseCordinates(mousemove, 15, 75);
            EventHandler.trigger(<any>(document), 'mousemove', mousemove);
            let mouseUp: any = util.getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
            mouseUp.type = 'mouseup';
            mouseUp.srcElement = rowAxiscontent;
            mouseUp.target = mouseUp.toElement = filterAxisContent;
            EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            setTimeout(() => {
                pivotButton = [].slice.call((filterAxisContent).querySelectorAll('.e-pivot-button'));
                expect(pivotCommon.filterDialog.dialogPopUp).toBeNull;
                expect((pivotButton[pivotButton.length - 1].querySelector('.e-pvt-btn-content') as HTMLElement).innerText).toEqual('eyeColor (green)');
                done();
            }, 1000);
        });
    });

    describe('- Opening filter dialog', () => {
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
            PivotView.Inject(GroupingBar);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowValueFilter: true,
                    sortSettings: [{ name: 'company', order: 'Descending' }],
                    formatSettings: [{ name: 'balance', format: 'C' }],
                    filterSettings: [
                        { name: 'gender', type: 'Value', condition: 'Equals', value1: '3250', measure: 'quantity' },
                        { name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '200', measure: 'quantity' }
                    ],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                showFieldList: true,
                showGroupingBar: true,
                width: 1000,
                height: 400,
                memberEditorOpen: function(args: MemberEditorOpenEventArgs) {
                    args.cancel = true;
                }
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 500);
        });
        it('Opening member editor dialog', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                (document.querySelectorAll('.e-pv-filter')[0] as HTMLElement).click();
                done();
            }, 500);
        });
    });

    describe('- Searching for field members', () => {
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
            PivotView.Inject(GroupingBar);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: true,
                    enableSorting: true,
                    allowValueFilter: true,
                    sortSettings: [{ name: 'company', order: 'Descending' }],
                    formatSettings: [{ name: 'balance', format: 'C' }],
                    filterSettings: [
                        { name: 'gender', type: 'Value', condition: 'Equals', value1: '3250', measure: 'quantity' },
                        { name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '200', measure: 'quantity' }
                    ],
                    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
                    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    filters: [],
                },
                showFieldList: true,
                showGroupingBar: true,
                width: 1000,
                height: 400
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        let down: MouseEvent = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        let up: MouseEvent = new MouseEvent('mouseup', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        beforeEach((done: Function) => {
            setTimeout(() => { done(); }, 500);
        });
        it('Searching for field members that start with the letter A', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            (document.querySelectorAll('.e-pv-filter')[0] as HTMLElement).click();
            (document.querySelectorAll('.e-maskedtextbox.e-input')[0] as any).ej2_instances[0].value = 'A';
            (document.querySelectorAll('.e-maskedtextbox.e-input')[0] as any).ej2_instances[0].element.dispatchEvent(new Event('keyup', { bubbles: true }));
            setTimeout(() => {
                expect(document.querySelectorAll('.e-list-text')[0].textContent).toBe('All');
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                done();
            }, 500);
        });

        it('Selecting field member', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-pv-filter')[0] as HTMLElement).click();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-fullrow');
                expect(checkEle.length).toBeGreaterThan(0);
                util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                checkEle[0].dispatchEvent(down);
                checkEle[0].dispatchEvent(up);
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('Unselecting field member', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-pv-filter')[0] as HTMLElement).click();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-fullrow');
                expect(checkEle.length).toBeGreaterThan(0);
                util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                checkEle[0].dispatchEvent(down);
                checkEle[0].dispatchEvent(up);
                (document.querySelectorAll('.e-ok-btn')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('Unselecting field member', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-pv-filter')[0] as HTMLElement).click();
                let treeObj: TreeView = pivotGridObj.pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-fullrow');
                expect(checkEle.length).toBeGreaterThan(0);
                util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                checkEle[0].dispatchEvent(down);
                checkEle[0].dispatchEvent(up);
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                done();
            }, 1000);
        });

        it('Sorting field member', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-pv-filter')[0] as HTMLElement).click();
                (document.querySelectorAll('.e-sort-ascend-icon')[0] as HTMLElement).click();
                done();
            }, 1000);
        });

        it('Selecting a field from the dropdown menu', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-btn-filter')[0] as HTMLElement).click();
                document.getElementsByClassName('e-ddl')[0].dispatchEvent(new Event('mousedown', { bubbles: true }));
                document.querySelectorAll('.e-value-options .e-list-item')[0].dispatchEvent(new Event('click', { bubbles: true }));
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                done();
            }, 1000);
        });

        it('Selecting a filter operator from the dropdown menu', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-btn-filter')[0] as HTMLElement).click();
                document.getElementsByClassName('e-ddl')[1].dispatchEvent(new Event('mousedown', { bubbles: true }));
                document.querySelectorAll('.e-filter-operator .e-list-item')[1].dispatchEvent(new Event('click', { bubbles: true }));
                document.getElementsByClassName('e-ddl')[1].dispatchEvent(new Event('mousedown', { bubbles: true }));
                document.querySelectorAll('.e-filter-operator .e-list-item')[6].dispatchEvent(new Event('click', { bubbles: true }));
                document.querySelectorAll('.e-spin-down')[0].dispatchEvent(new Event('mouseup', { bubbles: true }));
                document.querySelectorAll('.e-spin-down')[1].dispatchEvent(new Event('mouseup', { bubbles: true }));
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                done();
            }, 1000);
        });

        it('Filtering values using between operator', (done: Function) => {
            setTimeout(() => {
                (document.querySelectorAll('.e-btn-filter')[0] as HTMLElement).click();
                document.getElementsByClassName('e-ddl')[1].dispatchEvent(new Event('mousedown', { bubbles: true }));
                document.querySelectorAll('.e-filter-operator .e-list-item')[1].dispatchEvent(new Event('click', { bubbles: true }));
                document.getElementsByClassName('e-ddl')[1].dispatchEvent(new Event('mousedown', { bubbles: true }));
                document.querySelectorAll('.e-filter-operator .e-list-item')[6].dispatchEvent(new Event('click', { bubbles: true }));
                (document.querySelector('.e-cancel-btn') as HTMLElement).click();
                done();
            }, 1000);
        });
    });
});