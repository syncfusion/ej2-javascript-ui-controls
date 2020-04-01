import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, EmitType, closest } from '@syncfusion/ej2-base';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { PivotCommon } from '../../src/common/base/pivot-common';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { TreeView } from '@syncfusion/ej2-navigations';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Value Sorting - Static field list', () => {
    let fieldListObj: PivotFieldList;
    let pivotGridObj: PivotView;
    let pivotCommon: PivotCommon;
    let grid: HTMLElement = createElement('div', { id: 'PivotView', styles: 'width: 58%; height: 100%; float: left' });
    let fieldlist: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'width: 42%; height: 100%; float: right' });
    let elem: HTMLElement = createElement('div', { className: 'container', styles: 'height: 700px' });
    elem.appendChild(grid); elem.appendChild(fieldlist);
    PivotView.Inject(GroupingBar);
    PivotFieldList.Inject(CalculatedField);
    afterAll(() => {
        if (fieldListObj) {
            fieldListObj.destroy();
        }
        if (pivotGridObj) {
            pivotGridObj.destroy();
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
        let dataBound: EmitType<Object> = () => {
            done();
        };
        pivotGridObj = new PivotView({
            enginePopulated: () => {
                if (fieldListObj) {
                    fieldListObj.update(pivotGridObj);
                }
            },
            enableValueSorting: true,
            showGroupingBar: true,
            width: '99%',
            height: 530,
            gridSettings: { columnWidth: 140 }
        });
        pivotGridObj.appendTo('#PivotView');
        fieldListObj = new PivotFieldList(
            {
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    rows: [{ name: 'state' }],
                    columns: [{ name: 'gender' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }],
                    valueSortSettings: {
                        headerText: 'female##quantity',
                        headerDelimiter: '##',
                        sortOrder: 'Descending'
                    }
                },
                allowCalculatedField: true,
                showValuesButton: true,
                load: (): void => {
                    (fieldListObj as any).enableValueSorting = true;
                },
                enginePopulated: (): void => {
                    if (pivotGridObj) {
                        fieldListObj.updateView(pivotGridObj);
                    }
                },
                renderMode: 'Fixed',
                dataBound: dataBound
            });
        fieldListObj.appendTo('#PivotFieldList');
        pivotCommon = fieldListObj.pivotCommon;
    });
    it('check code behind value sorting', (done: Function) => {
        let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
        let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
        expect(pivotButtons.length).toBeGreaterThan(0);
        ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        setTimeout(() => {
            expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            expect(pivotGridObj.element.querySelectorAll('td')[10].innerText).toBe("638");
            done();
        }, 1000);
    });
    it('update filter State by check member node', () => {
        expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
        let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
        let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
        expect(checkEle.length).toBeGreaterThan(0);
        expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
        util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
        (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
    });
    it('Check after filtering', (done: Function) => {
        setTimeout(() => {
            expect(pivotGridObj.element.querySelectorAll('td')[9].innerText).toBe("559");
            let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
            let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
            done();
        }, 1000);
    });
    it('Check after sorting', () => {
        expect(pivotGridObj.element.querySelectorAll('td')[9].innerText).toBe("559");
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