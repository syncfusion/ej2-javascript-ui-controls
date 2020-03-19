import { IDataSet } from '../../src/base/engine';
import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { pivot_dataset } from '../base/datasource.spec';
import { PivotView } from '../../src/pivotview/base/pivotview';
import { createElement, remove, EmitType, EventHandler } from '@syncfusion/ej2-base';
import { GroupingBar } from '../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../src/common/actions/field-list';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { LoadEventArgs, AggregateMenuOpenEventArgs } from '../../src/common/base/interface';
import * as util from '../utils.spec';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('Aggregation', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });
    describe('Testing Aggregation menu for String fields in fieldList,calculated field setting', () => {
        let pivotGridObj: any;
        let cf: any;
        let mouseEvent: any;
        let tapEvent: any;
        let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
        afterAll(() => {
            if (pivotGridObj) {
                pivotGridObj.destroy();
            }
            remove(elem);
        });
        beforeAll(() => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            PivotView.Inject(GroupingBar, FieldList, CalculatedField);
            pivotGridObj = new PivotView({
                dataSourceSettings: {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: false,
                    formatSettings: [{ name: 'balance', format: 'C' }],
                    rows: [{ name: 'eyeColor' }],
                    columns: [{ name: 'isActive' }],
                    values: [{ name: 'product' }, { name: 'balance' }]
                },
                showFieldList: true,
                allowCalculatedField: true,
                showGroupingBar: true,
                tooltipTemplate: '<div id="templateCheck"><span>${rowHeaders}</span><span>${columnHeaders}</span><span>${value}</span><span>${aggregateType}</span><span>${rowFields}</span><span>${columnFields}</span>',
                aggregateMenuOpen: (args: AggregateMenuOpenEventArgs) => {
                    expect(args.aggregateTypes).toBeTruthy;
                    expect(args.cancel).toBe(false);
                    console.log('aggregateMenuFieldName: ' + args.fieldName);
                },
                width: 1000,
                height: 500
            });
            pivotGridObj.appendTo('#PivotGrid');
        });
        it('check dropdown icon for String field', () => {
            var valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            (pivotButtons[0].querySelector('.e-dropdown-icon') as HTMLElement).click();
            setTimeout(() => {
                expect(document.getElementById('PivotGridvalueFieldStringContextMenu')).toBeTruthy();
            }, 1000);
        });
        it('select context Menu Distinct Count in Product', (done: Function) => {
            var valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            (pivotButtons[0].querySelector('.e-dropdown-icon') as HTMLElement).click();
            let menuObj: any = (pivotGridObj.pivotButtonModule.menuOption as any).menuInfo[1];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
            let menu: any = {
                element: li[1],
                item: menuObj.items[1]
            };
            menuObj.select(menu as MenuEventArgs);
            let buttonText: HTMLElement = ((pivotButtons[0]).querySelector('.e-content') as HTMLElement);
            setTimeout(() => {
                menuObj.close();
                expect(buttonText.innerHTML).toEqual('Distinct Count of product');
                done();
            }, 1000);
        });
        it('check pivot grid aggregation', () => {
            expect(pivotGridObj.pivotValues[2][1].formattedText).toEqual('6');
            expect(pivotGridObj.pivotValues[2][3].formattedText).toEqual('6');
        });
        it('Mouse hover event testing tooltiptemplate- Value cell', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let target: HTMLElement = pivotGridObj.element.querySelector('td[aria-colindex="3"]');
            util.triggerMouseEvent(target, 'mouseover');
            setTimeout(() => {
                let span: any = document.querySelector('.e-tooltip-wrap #templateCheck').querySelectorAll('span');
                expect(span[0].textContent.trim()).toBe('blue');
                expect(span[1].textContent.trim()).toBe('true - product');
                expect(span[2].textContent.trim()).toBe('6');
                expect(span[3].textContent.trim()).toBe('DistinctCount');
                expect(span[4].textContent.trim()).toBe('eyeColor');
                expect(span[5].textContent.trim()).toBe('isActive');
                done();
            }, 2000);
        });

        it('Mouse hover event testing tooltiptemplate- bottom left value cell', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            let target: HTMLElement = pivotGridObj.element.querySelectorAll('td[index="5"]')[2] as HTMLElement;
            util.triggerMouseEvent(target, 'mouseover');
            setTimeout(() => {
                let span: any = document.querySelector('.e-tooltip-wrap #templateCheck').querySelectorAll('span');
                expect(span[0].innerText).toBe('Grand Total');
                expect(span[1].innerText).toBe('false - balance');
                expect(span[2].innerText).toBe('$514,355.62');
                expect(span[3].innerText).toBe('Sum');
                expect(span[4].innerText).toBe('eyeColor');
                expect(span[5].innerText).toBe('isActive');
                done();
            }, 2000);
        });
        it('Check aggregation in fieldlist', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect((pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click()).toBeTruthy;
                done();
            }, 1000);
        });
        it('check dropdown icon of product', () => {
            var valueField: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-field-list-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            (pivotButtons[0].querySelector('.e-dropdown-icon') as HTMLElement).click();
            setTimeout(() => {
                expect(document.getElementById('PivotGrid_PivotFieldListvalueFieldStringContextMenu')).toBeTruthy();
            }, 1000);
        });
        it('select context Menu of product', (done: Function) => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            var valueField: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-field-list-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            (pivotButtons[0].querySelector('.e-dropdown-icon') as HTMLElement).click();
            let menuObj: any = (pivotGridObj.pivotFieldListModule.pivotButtonModule.menuOption as any).menuInfo[1];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
            let menu: any = {
                element: li[1],
                item: menuObj.items[1]
            };
            menuObj.select(menu as MenuEventArgs);
            var valueField: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-field-list-values');
            var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
            expect(pivotButtons.length).toBeGreaterThan(0);
            let buttonText: HTMLElement = ((pivotButtons[1]).querySelector('.e-content') as HTMLElement);
            expect(buttonText.innerHTML === 'Sum of balance').toBeTruthy();
            done();
        });

        it('check pivot grid aggregation', () => {
            expect(pivotGridObj.pivotValues[2][1].formattedText).toEqual('6');
        });
        it('destroy aggregate menu', () => {
            let menuOption: any = pivotGridObj.pivotButtonModule.menuOption;
            menuOption.destroy();
            expect((pivotGridObj.pivotButtonModule.menuOption as any).menuInfo[1]).toBeUndefined;
            expect((pivotGridObj.pivotButtonModule.menuOption as any).valueDialog).toBeUndefined;
        });

        it('Open calculated field dialog', (done: Function) => {
            cf = new CalculatedField(pivotGridObj);
            cf.createCalculatedFieldDialog(pivotGridObj);
            pivotGridObj.engineModule.enableSort = false;
            setTimeout(() => {
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                done();
            }, 1000);
        });
        it('nodeExpanding event is triggered', () => {
            mouseEvent = {
                preventDefault: (): void => { },
                stopImmediatePropagation: (): void => { },
                target: null,
                type: null,
                shiftKey: false,
                ctrlKey: false
            };
            tapEvent = {
                originalEvent: mouseEvent,
                tapCount: 1
            };
            let li: Element[] = <Element[] & NodeListOf<Element>>cf.treeObj.element.querySelectorAll('li');
            mouseEvent.target = li[2].querySelector('.e-icons');
            cf.treeObj.touchClickObj.tap(tapEvent);
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        });
        it('treeview click on _id', () => {
            let treeObj: any = cf.treeObj;
            let liTreeObj: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
            mouseEvent.target = liTreeObj[0].querySelector('.e-format');
            tapEvent.originalEvent = mouseEvent;
            treeObj.touchClickObj.tap(tapEvent);
            expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
        });
        it('Context menu click of _id field', () => {
            let menuObj: any = cf.menuObj;
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
            let menu: any = {
                element: li[1]
            };
            cf.selectContextMenu(menu as MenuEventArgs);
            menuObj.element.style.display = 'none';
            let liTreeObj: Element[] = <Element[] & NodeListOf<Element>>cf.treeObj.element.querySelectorAll('li');
            expect((liTreeObj[0].querySelector('.e-text-content') as HTMLElement).innerText).toBe('_id (Distinct Count)');
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
            expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value).toBe('"DistinctCount(_id)"');
        });
        it('close the fieldlist dialog', () => {
            cf.closeDialog();
            let fieldListWrapper = document.getElementById('PivotGrid_PivotFieldList_Wrapper');
            (fieldListWrapper.querySelector('.e-cancel-btn') as HTMLElement).click();
        });
    });
    describe('Calculated Field string field Aggregation for mobile', () => {
        let fieldListObj: PivotFieldList;
        let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:100%' });
        afterAll(() => {
            if (fieldListObj) {
                fieldListObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            fieldListObj = new PivotFieldList({
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
                allowCalculatedField: true,
                dataBound: dataBound,
                renderMode: 'Fixed',
                load: (args: LoadEventArgs) => {
                    fieldListObj.isAdaptive = true;
                },
                aggregateMenuOpen: (args: AggregateMenuOpenEventArgs) => {
                    expect(args.aggregateTypes).toBeTruthy;
                    expect(args.cancel).toBe(false);
                    console.log('aggregateMenuFieldName: ' + args.fieldName);
                },
            });
            fieldListObj.appendTo('#PivotFieldList');
            fieldListObj.calculatedFieldModule = new CalculatedField(fieldListObj);
        });
        let persistdata: string;
        it('check on axis view change to calculated field', (done: Function) => {
            let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
            expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
            let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
            headerElement[4].click();
            setTimeout(() => {
                expect(headerElement[4].textContent).toBe('Create Calculated Field');
                expect(headerElement[4].classList.contains('e-active')).toBeTruthy();
                let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-calculated-field-btn');
                expect(addButton.classList.contains('e-disable')).not.toBeTruthy();
                done();
            }, 100);
        });
        it('check on calculated field add button', (done: Function) => {
            (document.querySelector('.e-calculated-field-btn') as any).click();
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivot-accord').length > 0).toBeTruthy();
                (document.querySelector('.e-pivot-cancel-button') as any).click();
                done();
            }, 1000);
        });
        it('check on calculated field add field', (done: Function) => {
            (document.querySelector('.e-calculated-field-btn') as any).click();
            (document.querySelector('.e-icons.e-frame') as any).click();
            (document.querySelector('.e-tgl-collapse-icon') as any).click();
            (document.querySelectorAll('.e-pivot-calc-radio')[1] as any).click();
            (document.querySelectorAll('.e-icons.e-frame')[12] as any).click();
            (document.querySelector('.e-pivot-add-button') as any).click();
            expect((document.querySelector('.e-pivot-formula') as any).
                value).toBe('"DistinctCount(pno)""Sum(advance)"');
            (document.querySelector('.e-pivot-calc-input') as any).value = 'New';
            let calc: any = fieldListObj.calculatedFieldModule;
            calc.inputObj.value = 'New';
            (document.querySelector('.e-pivot-ok-button') as any).click();
            done();
        });
    });
    describe('Calculated Field string field Aggregation', () => {
        let fieldListObj: PivotFieldList;
        let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:100%' });
        afterAll(() => {
            if (fieldListObj) {
                fieldListObj.destroy();
            }
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            fieldListObj = new PivotFieldList({
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
                allowCalculatedField: true,
                dataBound: dataBound,
                renderMode: 'Fixed',
                load: (args: LoadEventArgs) => {
                    fieldListObj.isAdaptive = true;
                },
                aggregateMenuOpen: (args: AggregateMenuOpenEventArgs) => {
                    expect(args.aggregateTypes).toBeTruthy;
                    expect(args.cancel).toBe(false);
                    console.log('aggregateMenuFieldName: ' + args.fieldName);
                },
            });
            fieldListObj.appendTo('#PivotFieldList');
            fieldListObj.calculatedFieldModule = new CalculatedField(fieldListObj);
        });
        let persistdata: string;
        it('check on axis view change to calculated field', (done: Function) => {
            let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
            expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
            let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
            expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
            headerElement[4].click();
            setTimeout(() => {
                expect(headerElement[4].textContent).toBe('Create Calculated Field');
                expect(headerElement[4].classList.contains('e-active')).toBeTruthy;
                let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-calculated-field-btn');
                expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                done();
            }, 100);
        });
        it('check on calculated field add button', (done: Function) => {
            (document.querySelector('.e-calculated-field-btn') as any).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            setTimeout(() => {
                expect(document.querySelectorAll('.e-pivot-accord').length > 0).toBeTruthy;
                (document.querySelector('.e-pivot-cancel-button') as any).click();
                done();
            }, 1000);
        });
        it('check on calculated field add field', (done: Function) => {
            (document.querySelector('.e-calculated-field-btn') as any).click();
            (document.querySelector('.e-icons.e-frame') as any).click();
            (document.querySelector('.e-tgl-collapse-icon') as any).click();
            (document.querySelectorAll('.e-pivot-calc-radio')[1] as any).click();
            (document.querySelectorAll('.e-icons.e-frame')[12] as any).click();
            (document.querySelector('.e-pivot-add-button') as any).click();
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
            expect((document.querySelector('.e-pivot-formula') as any).
                value).toBe('"DistinctCount(pno)""Sum(advance)"');
            (document.querySelector('.e-pivot-calc-input') as any).value = 'New';
            let calc: any = fieldListObj.calculatedFieldModule;
            calc.inputObj.value = 'New';
            (document.querySelector('.e-pivot-ok-button') as any).click();
            done();
        });
    });
    describe('Testing Aggregation menu for String fields in fieldList,calculated field setting with aggregate Type', () => {
        describe('Testing aggregate Type in grouping bar, fieldlist , and calculated field setting', () => {
            let pivotGridObj: any;
            let cf: any;
            let mouseEvent: any;
            let tapEvent: any;
            let elem: HTMLElement = createElement('div', { id: 'PivotGrid', styles: 'height:200px; width:500px' });
            afterAll(() => {
                if (pivotGridObj) {
                    pivotGridObj.destroy();
                }
                remove(elem);
            });
            beforeAll(() => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                PivotView.Inject(GroupingBar, FieldList, CalculatedField);
                pivotGridObj = new PivotView({
                    dataSourceSettings: {
                        dataSource: pivot_dataset as IDataSet[],
                        expandAll: false,
                        formatSettings: [{ name: 'balance', format: 'C' }],
                        rows: [{ name: 'eyeColor' }],
                        columns: [{ name: 'isActive' }],
                        values: [{ name: 'product' }, { name: 'balance' }]
                    },
                    showFieldList: true,
                    allowCalculatedField: true,
                    showGroupingBar: true,
                    aggregateTypes: ['Count', 'Sum', 'DistinctCount'],
                    width: 1000,
                    height: 500,
                    aggregateMenuOpen: (args: AggregateMenuOpenEventArgs) => {
                        expect(args.aggregateTypes).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        //expect(args.aggregateTypes.length).toBe(pivotGridObj.aggregateTypes.length);
                        console.log('aggregateMenuFieldName: ' + args.fieldName);
                    },
                    gridSettings: {
                        contextMenuItems: ['Collapse', 'Drillthrough', 'Expand', 'Excel Export', 'Pdf Export', 'Csv Export',
                            'Sort Ascending', 'Sort Descending', 'Aggregate', 'CalculatedField']
                    },
                });
                pivotGridObj.appendTo('#PivotGrid');
            });
            it('check dropdown of Product', (done: Function) => {
                var valueField: HTMLElement = pivotGridObj.element.querySelector('.e-group-values');
                var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
                (pivotButtons[1].querySelector('.e-dropdown-icon') as HTMLElement).click();
                let menuObj = (pivotGridObj.pivotButtonModule.menuOption as any).menuInfo[0];
                let li = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                expect(li.length).toBe(pivotGridObj.aggregateTypes.length);
                (pivotButtons[0].querySelector('.e-dropdown-icon') as HTMLElement).click();
                menuObj = (pivotGridObj.pivotButtonModule.menuOption as any).menuInfo[1];
                li = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                expect(li.length).toBe(2);
                (pivotButtons[0].querySelector('.e-dropdown-icon') as HTMLElement).click();
                let menu: any = {
                    element: li[1],
                    item: menuObj.items[1]
                };
                menuObj.select(menu as MenuEventArgs);
                let buttonText: HTMLElement = ((pivotButtons[0]).querySelector('.e-content') as HTMLElement);
                setTimeout(() => {
                    menuObj.close();
                    expect(buttonText.innerHTML).toEqual('Distinct Count of product');
                    done();
                }, 1000);
            });
            it('check pivot grid aggregation', (done: Function) => {
                setTimeout(() => {
                    let target: HTMLElement = pivotGridObj.element.querySelector('td[aria-colindex="1"]');
                    expect(target.querySelector('.e-cellvalue').innerHTML).toEqual('6');
                    done();
                }, 1000);
            });
            it('Check aggregation in fieldlist', (done: Function) => {
                pivotGridObj.pivotFieldListModule.aggregateTypes = ['Max', 'Avg', 'Min', 'Sum', 'Product', 'Index', 'SampleStDev', 'PopulationStDev', 'DistinctCount'];
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect((pivotGridObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click()).toBeTruthy;
                    done();
                }, 1000);
            });
            it('check dropdown for string and number Field', () => {
                var valueField: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-field-list-values');
                var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
                (pivotButtons[0].querySelector('.e-dropdown-icon') as HTMLElement).click();
                let menuObj: any = (pivotGridObj.pivotFieldListModule.pivotButtonModule.menuOption as any).menuInfo[1];
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                expect(li.length).toBe(1);
                (pivotButtons[1].querySelector('.e-dropdown-icon') as HTMLElement).click();
                menuObj = (pivotGridObj.pivotFieldListModule.pivotButtonModule.menuOption as any).menuInfo[0];
                li = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                expect(li.length).toBe(8);
            });
            it('select context Menu option of min in balance Field', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                var valueField: HTMLElement = pivotGridObj.pivotFieldListModule.axisTableModule.axisTable.querySelector('.e-field-list-values');
                var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
                (pivotButtons[1].querySelector('.e-dropdown-icon') as HTMLElement).click();
                let menuObj: any = (pivotGridObj.pivotFieldListModule.pivotButtonModule.menuOption as any).menuInfo[0];
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                let menu: any = {
                    element: li[2],
                    item: menuObj.items[2]
                };
                menuObj.select(menu as MenuEventArgs);
                let buttonText: HTMLElement = ((pivotButtons[1]).querySelector('.e-content') as HTMLElement);
                expect(buttonText.innerHTML === 'Min of balance').toBeTruthy();
                done();
            });

            it('check pivot grid aggregation', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    let target: HTMLElement = pivotGridObj.element.querySelector('td[aria-colindex="2"]');
                    expect(target.querySelector('.e-cellvalue').innerHTML).toEqual('$1,028.43');
                    done();
                }, 1000);
            });
            it('destroy aggregate menu', () => {
                let menuOption: any = pivotGridObj.pivotButtonModule.menuOption;
                menuOption.destroy();
                expect((pivotGridObj.pivotButtonModule.menuOption as any).menuInfo[0]).toBeUndefined;
                expect((pivotGridObj.pivotButtonModule.menuOption as any).valueDialog).toBeUndefined;
            });

            it('Open calculated field dialog', (done: Function) => {
                pivotGridObj.setProperties({ aggregateTypes: ['Max', 'Avg', 'Min', 'Sum', 'Product', 'Index', 'SampleStDev', 'PopulationStDev', 'DistinctCount'] }, true);
                cf = new CalculatedField(pivotGridObj);
                cf.createCalculatedFieldDialog(pivotGridObj);
                pivotGridObj.engineModule.enableSort = false;
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 2000);
                mouseEvent = {
                    preventDefault: (): void => { },
                    stopImmediatePropagation: (): void => { },
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEvent,
                    tapCount: 1
                };
            });
            it('treeview Context menu click advance Field', () => {
                let treeObj: any = cf.treeObj;
                let liTreeObj: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                mouseEvent.target = liTreeObj[1].querySelector('.e-format');
                tapEvent.originalEvent = mouseEvent;
                treeObj.touchClickObj.tap(tapEvent);
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                let menuObj: any = cf.menuObj;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                let menu: any = {
                    element: li[5]
                };
                cf.selectContextMenu(menu as MenuEventArgs);
                menuObj.element.style.display = 'none';
                expect((liTreeObj[1].querySelector('.e-text-content') as HTMLElement).innerText).toBe('advance (Sample StDev)');
            });
            it('drag and drop advance node to drop field', () => {
                let treeObj: any = cf.treeObj;
                let filterAxiscontent: HTMLElement = document.getElementById(cf.parentID + 'droppable');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let mousedown: any =
                    util.getEventObject('MouseEvents', 'mousedown', treeObj.element, li[1].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    util.getEventObject('MouseEvents', 'mousemove', treeObj.element, li[1].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                mousemove = util.setMouseCordinates(mousemove, 150, 400);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = util.getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
                expect((document.querySelector('.e-pivot-formula') as HTMLTextAreaElement).value).toBe('"SampleStDev(advance)"');
            });
            it('close the fieldlist dialog', () => {
                cf.closeDialog();
                let fieldListWrapper = document.getElementById('PivotGrid_PivotFieldList_Wrapper');
                (fieldListWrapper.querySelector('.e-cancel-btn') as HTMLElement).click();
            });
            it('contextmenu open', () => {
                pivotGridObj.lastCellClicked = document.querySelectorAll('.e-valuescontent')[1];
                let cell: HTMLElement = document.querySelectorAll('.e-valuescontent')[1] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    util.triggerMouseEvent(target, 'mouseover');
                }, 1000);
            });
            it('aggregate Max click', (done: Function) => {
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-menu-parent.e-ul li').length).toBe(8);
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggMax') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('validate click', () => {
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-valuescontent')[1].textContent).toBe('$3,938.08');
                }, 1000);
            });
            it('contextmenu open', () => {
                pivotGridObj.lastCellClicked = document.querySelectorAll('.e-valuescontent')[0];
                let cell: HTMLElement = document.querySelectorAll('.e-valuescontent')[0] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    util.triggerMouseEvent(target, 'mouseover');
                }, 1000);
            });
            it('aggregate distinct count click', (done: Function) => {
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-menu-parent.e-ul li').length).toBe(1);
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggDistinctCount') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('validate click', () => {
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-valuescontent')[0].textContent).toBe('6');
                }, 1000);
            });
            it('contextmenu open', () => {
                pivotGridObj.lastCellClicked = document.querySelectorAll('.e-valuescontent')[1];
                let cell: HTMLElement = document.querySelectorAll('.e-valuescontent')[1] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    util.triggerMouseEvent(target, 'mouseover');
                }, 1000);
            });
            it('aggregate  click', (done: Function) => {
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-menu-parent.e-ul li').length).toBe(8);
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggMoreOption') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('check dialog close click and change aggregationType', (done: Function) => {
                expect(document.querySelector('#PivotGrid_ValueDialog') !== null).toBe(true);
                setTimeout(() => {
                    (document.getElementsByClassName('e-btn-icon e-icon-dlg-close e-icons')[0] as HTMLElement).click();
                    done();
                }, 1000);
                pivotGridObj.aggregateTypes = ['Sum', 'DifferenceFrom', 'Max'];
            });
            it('contextmenu open', () => {
                pivotGridObj.lastCellClicked = document.querySelectorAll('.e-valuescontent')[1];
                let cell: HTMLElement = document.querySelectorAll('.e-valuescontent')[1] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    util.triggerMouseEvent(target, 'mouseover');
                }, 1000);
            });
            it('aggregate Sum click', (done: Function) => {
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-menu-parent.e-ul li').length).toBe(3);
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggSum') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('validate click', () => {
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-valuescontent')[1].textContent).toBe('$155,654.12');
                }, 1000);
            });
            it('contextmenu check string field disable', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelectorAll('.e-valuescontent')[0];
                let cell: HTMLElement = document.querySelectorAll('.e-valuescontent')[0] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    expect(target.classList.contains('e-disabled')).toBe(true);
                    done();
                }, 1000);
            });
            it('contextmenu open', () => {
                setTimeout(() => {
                    pivotGridObj.lastCellClicked = document.querySelectorAll('.e-valuescontent')[1];
                    let cell: HTMLElement = document.querySelectorAll('.e-valuescontent')[1] as HTMLElement;
                    util.triggerMouseEvent(cell, 'contextmenu');
                }, 1000);
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    util.triggerMouseEvent(target, 'mouseover');
                }, 1000);
            });
            it('aggregate  click Difference From', (done: Function) => {
                setTimeout(() => {
                    expect(document.querySelectorAll('.e-menu-parent.e-ul li').length).toBe(3);
                    (document.querySelector('#' + pivotGridObj.element.id + '_AggDifferenceFrom') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('check , dialog close click and change aggregationType', (done: Function) => {
                expect(document.querySelector('#PivotGrid_ValueDialog') !== null).toBe(true);
                setTimeout(() => {
                    expect(document.querySelector('.e-type-option-wrapper .e-value-options').textContent).toBe('Difference From');
                    (document.getElementsByClassName('e-btn-icon e-icon-dlg-close e-icons')[0] as HTMLElement).click();
                    done();
                }, 1000);
                pivotGridObj.aggregateTypes = [];
            });

            it('contextmenu open number field check disable check', () => {
                pivotGridObj.lastCellClicked = document.querySelectorAll('.e-valuescontent')[1];
                let cell: HTMLElement = document.querySelectorAll('.e-valuescontent')[1] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    expect(target.classList.contains('e-disabled')).toBe(true);
                }, 1000);
            });

            it('contextmenu open string field disable check', (done: Function) => {
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                pivotGridObj.lastCellClicked = document.querySelectorAll('.e-valuescontent')[0];
                let cell: HTMLElement = document.querySelectorAll('.e-valuescontent')[0] as HTMLElement;
                util.triggerMouseEvent(cell, 'contextmenu');
                setTimeout(() => {
                    let target: HTMLElement = document.querySelector('#' + pivotGridObj.element.id + '_aggregate');
                    expect(target.classList.contains('e-disabled')).toBe(true);
                    done();
                }, 1000);
            });
        });
        describe('aggregate type with inputs matching number fields', () => {
            let fieldListObj: PivotFieldList;
            let cf: any;
            let mouseEvent: any;
            let tapEvent: any;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:100%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                fieldListObj = new PivotFieldList({
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
                        values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'gender' }]
                    },
                    aggregateTypes: ['Sum', 'DifferenceFrom'],
                    allowCalculatedField: true,
                    dataBound: dataBound,
                    renderMode: 'Fixed',
                    load: (args: LoadEventArgs) => {
                    },
                    aggregateMenuOpen: (args: AggregateMenuOpenEventArgs) => {
                        expect(args.aggregateTypes).toBeTruthy;
                        expect(args.cancel).toBe(false);
                       // expect(args.aggregateTypes.length).toBe(fieldListObj.aggregateTypes.length);
                        console.log('aggregateMenuFieldName: ' + args.fieldName);
                    }
                });
                fieldListObj.appendTo('#PivotFieldList');
                fieldListObj.calculatedFieldModule = new CalculatedField(fieldListObj);
            });
            it('check dropdown', () => {
                var valueField: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-field-list-values');
                var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons[2].querySelector('.e-dropdown-icon') as HTMLElement).toBeNull();
                (pivotButtons[0].querySelector('.e-dropdown-icon') as HTMLElement).click();
                let menuObj: any = (fieldListObj.pivotButtonModule.menuOption as any).menuInfo[0];
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                expect(li.length).toBe(2);
                (pivotButtons[1].querySelector('.e-dropdown-icon') as HTMLElement).click();
                menuObj = (fieldListObj.pivotButtonModule.menuOption as any).menuInfo[0];
                li = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                let menu: any = {
                    element: li[1],
                    item: menuObj.items[1]
                };
                menuObj.select(menu as MenuEventArgs);
                setTimeout(() => {
                    let valueFieldDialog = fieldListObj.element.querySelector('.e-value-field-settings');
                    expect(valueFieldDialog).toBeTruthy();
                    expect((valueFieldDialog.querySelector('.e-type-option-wrapper input') as HTMLInputElement).value).toBe('Difference From');
                    (valueFieldDialog.querySelector('.e-cancel-btn') as HTMLInputElement).click();
                }, 1000);
            });
            it('destroy aggregate menu', () => {
                let menuOption: any = fieldListObj.pivotButtonModule.menuOption;
                menuOption.destroy();
                expect((fieldListObj.pivotButtonModule.menuOption as any).menuInfo[0]).toBeUndefined;
                expect((fieldListObj.pivotButtonModule.menuOption as any).valueDialog).toBeUndefined;
            });

            it('Open calculated field dialog', (done: Function) => {
                cf = new CalculatedField(fieldListObj);
                cf.createCalculatedFieldDialog(fieldListObj);
                fieldListObj.engineModule.enableSort = false;
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 2000);
                mouseEvent = {
                    preventDefault: (): void => { },
                    stopImmediatePropagation: (): void => { },
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false
                };
                tapEvent = {
                    originalEvent: mouseEvent,
                    tapCount: 1
                };
            });
            it('treeview Context menu dropdown check', () => {
                let treeObj: any = cf.treeObj;
                let liTreeObj: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(liTreeObj[1].querySelector('.e-format.e-icons')).toBeTruthy();
                expect(liTreeObj[0].querySelector('.e-format.e-icons')).toBeNull();
                mouseEvent.target = liTreeObj[1].querySelector('.e-format');
                tapEvent.originalEvent = mouseEvent;
                treeObj.touchClickObj.tap(tapEvent);
                expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                let menuObj: any = cf.menuObj;
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>menuObj.element.querySelectorAll('li');
                let menu: any = {
                    element: li[0]
                };
                cf.selectContextMenu(menu as MenuEventArgs);
                menuObj.element.style.display = 'none';
                expect((liTreeObj[1].querySelector('.e-text-content') as HTMLElement).innerText).toBe('advance (Sum)');
                cf.closeDialog();
            });
        });
        describe(' summary type with no inputs', () => {
            let fieldListObj: PivotFieldList;
            let cf: any;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:100%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                fieldListObj = new PivotFieldList({
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
                        values: [{ name: 'balance' }, { name: 'quantity' }, { name: 'gender' }]
                    },
                    aggregateTypes: [],
                    allowCalculatedField: true,
                    dataBound: dataBound,
                    renderMode: 'Fixed',
                    load: (args: LoadEventArgs) => {
                    },
                    aggregateMenuOpen: (args: AggregateMenuOpenEventArgs) => {
                        expect(args.aggregateTypes).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        //expect(args.aggregateTypes.length).toBe(fieldListObj.aggregateTypes.length);
                        console.log('aggregateMenuFieldName: ' + args.fieldName);
                    }
                });
                fieldListObj.appendTo('#PivotFieldList');
                fieldListObj.calculatedFieldModule = new CalculatedField(fieldListObj);
            });
            it('check dropdown', () => {
                var valueField: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-field-list-values');
                var pivotButtons: HTMLElement[] = [].slice.call(valueField.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons[2].querySelector('.e-dropdown-icon') as HTMLElement).toBeNull();
                expect(pivotButtons[0].querySelector('.e-dropdown-icon') as HTMLElement).toBeNull();
            });
            it('Open calculated field dialog', (done: Function) => {
                cf = new CalculatedField(fieldListObj);
                cf.createCalculatedFieldDialog(fieldListObj);
                fieldListObj.engineModule.enableSort = false;
                setTimeout(() => {
                    expect(document.getElementsByClassName('e-dialog').length > 0).toBeTruthy();
                    done();
                }, 2000);
            });
            it('treeview Context menu dropdown check', () => {
                let treeObj: any = cf.treeObj;
                let liTreeObj: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('li');
                expect(liTreeObj[1].querySelector('.e-format.e-icons')).toBeNull();
                expect(liTreeObj[0].querySelector('.e-format.e-icons')).toBeNull();
                cf.closeDialog();
            });
        });
    });
    describe('Aggregation menu display with aggregateTypes', () => {
        describe('summary type input matching both fields', () => {
            let fieldListObj: PivotFieldList;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:100%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                fieldListObj = new PivotFieldList({
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
                    aggregateTypes: ['Max', 'Avg', 'Min', 'Sum', 'Product', 'Index', 'SampleStDev', 'PopulationStDev', 'DistinctCount'],
                    allowCalculatedField: true,
                    dataBound: dataBound,
                    renderMode: 'Fixed',
                    load: (args: LoadEventArgs) => {
                        fieldListObj.isAdaptive = true;
                    },
                    aggregateMenuOpen: (args: AggregateMenuOpenEventArgs) => {
                        expect(args.aggregateTypes).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        //expect(args.aggregateTypes.length).toBe(fieldListObj.aggregateTypes.length);
                        console.log('aggregateMenuFieldName: ' + args.fieldName);
                    }
                });
                fieldListObj.appendTo('#PivotFieldList');
                fieldListObj.calculatedFieldModule = new CalculatedField(fieldListObj);
            });
            it('change to calculated field and check aggregation', (done: Function) => {
                let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                headerElement[4].click();
                setTimeout(() => {
                    expect(headerElement[4].textContent).toBe('Create Calculated Field');
                    expect(headerElement[4].classList.contains('e-active')).toBeTruthy();
                    let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-calculated-field-btn');
                    expect(addButton.classList.contains('e-disable')).not.toBeTruthy();
                    done();
                }, 100);
                (document.querySelector('.e-calculated-field-btn') as any).click();
                (document.querySelector('.e-icons.e-frame') as any).click();
                (document.querySelector('.e-tgl-collapse-icon') as any).click();
                (document.querySelectorAll('.e-pivot-calc-radio')[0] as any).click();
                (document.querySelectorAll('.e-icons.e-frame')[12] as any).click();
                (document.querySelector('.e-pivot-add-button') as any).click();
                expect((document.querySelector('.e-pivot-formula') as any).
                    value).toBe('"DistinctCount(pno)""Sum(advance)"');
                (document.querySelector('.e-pivot-calc-input') as any).value = 'New';
                let calc: any = fieldListObj.calculatedFieldModule;
                calc.inputObj.value = 'New';
                (document.querySelector('.e-pivot-ok-button') as any).click();
                done();
            });
        });
        describe('summary type with empty inputs', () => {
            let fieldListObj: PivotFieldList;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:100%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                fieldListObj = new PivotFieldList({
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
                    aggregateTypes: [],
                    allowCalculatedField: true,
                    dataBound: dataBound,
                    renderMode: 'Fixed',
                    load: (args: LoadEventArgs) => {
                        fieldListObj.isAdaptive = true;
                    },
                    aggregateMenuOpen: (args: AggregateMenuOpenEventArgs) => {
                        expect(args.aggregateTypes).toBeTruthy;
                        expect(args.cancel).toBe(false);
                        //expect(args.aggregateTypes.length).toBe(fieldListObj.aggregateTypes.length);
                        console.log('aggregateMenuFieldName: ' + args.fieldName);
                    }
                });
                fieldListObj.appendTo('#PivotFieldList');
                fieldListObj.calculatedFieldModule = new CalculatedField(fieldListObj);
            });
            it('change to calculated field and check aggregation', (done: Function) => {
                let element: HTMLElement = fieldListObj.element.querySelector('.e-adaptive-container');
                expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(5);
                let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                headerElement[4].click();
                setTimeout(() => {
                    expect(headerElement[4].textContent).toBe('Create Calculated Field');
                    expect(headerElement[4].classList.contains('e-active')).toBeTruthy();
                    let addButton: HTMLElement = element.querySelector('.e-field-list-footer').querySelector('.e-calculated-field-btn');
                    expect(addButton.classList.contains('e-disable')).not.toBeTruthy();
                    done();
                }, 100);
                (document.querySelector('.e-calculated-field-btn') as any).click();
                (document.querySelector('.e-icons.e-frame') as any).click();
                expect(document.querySelector('.e-tgl-collapse-icon')).toBeNull();
                (document.querySelectorAll('.e-icons.e-frame')[12] as any).click();
                (document.querySelector('.e-pivot-add-button') as any).click();
                expect((document.querySelector('.e-pivot-formula') as any).
                    value).toBe('"Count(pno)""Sum(advance)"');
                (document.querySelector('.e-pivot-calc-input') as any).value = 'New';
                let calc: any = fieldListObj.calculatedFieldModule;
                calc.inputObj.value = 'New';
                (document.querySelector('.e-pivot-ok-button') as any).click();
                done();
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