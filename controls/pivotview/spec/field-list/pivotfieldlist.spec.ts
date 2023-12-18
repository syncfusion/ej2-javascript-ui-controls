import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, isNullOrUndefined, EmitType, closest } from '@syncfusion/ej2-base';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import { PivotCommon } from '../../src/common/base/pivot-common';
import { TreeView } from '@syncfusion/ej2-navigations';
import { profile, inMB, getMemoryProfile } from '../common.spec';
import * as util from '../utils.spec';
import { FieldDragStartEventArgs, FieldDropEventArgs, FieldDroppedEventArgs, FieldRemoveEventArgs, CalculatedFieldCreateEventArgs } from '../../src/common/base/interface';
import { DataManager, ODataV4Adaptor, Query } from '@syncfusion/ej2-data';

describe('PivotFieldList spec', () => {
    /**
     * Pivot Field List base spec
     */

    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    describe('Pivot Field List base module', () => {
        describe('Field List properties', () => {
            let fieldListObj: PivotFieldList;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
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
                        values: [{ name: 'balance', caption: 'Amount' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                    },
                    cssClass: 'test-class',
                    dataBound: dataBound
                });
                fieldListObj.appendTo('#PivotFieldList');
                util.disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            it('control class testing', () => {
                expect(document.getElementById('PivotFieldList').classList.contains('e-pivotfieldlist')).toEqual(true);
            });
            it('show field list', () => {
                (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(fieldListObj.dialogRenderer.fieldListDialog.element.classList.contains('e-popup-open')).toBe(true);
            });
            it('field-list getPersist', () => {
                persistdata = fieldListObj.getPersistData();
                expect(true).toBeTruthy();
            });
            it('set locale property', () => {
                let element: HTMLElement = document.getElementById('PivotFieldList_Container_title').querySelector('.e-title-content');
                expect(element.textContent).toBe('Field List');
                fieldListObj.destroy();
            });
            it('field-list destroy expect', () => {
                expect(fieldListObj.element.innerHTML).toBe('');
            });
        });
        describe('Field List with RTL', () => {
            let fieldListObj: PivotFieldList;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
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
                    cssClass: 'test-class',
                    enableRtl: true,
                    dataBound: dataBound
                });
                fieldListObj.appendTo('#PivotFieldList');
                util.disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            it('control class testing', () => {
                expect(document.getElementById('PivotFieldList').classList.contains('e-pivotfieldlist')).toEqual(true);
                expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).toEqual(true);
            });
            it('get component name testing', () => {
                expect(fieldListObj.getModuleName()).toEqual('pivotfieldlist');
            });
            it('show field list', () => {
                (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(fieldListObj.dialogRenderer.fieldListDialog.element.classList.contains('e-popup-open')).toBe(true);
            });
            it('set locale property', (done: Function) => {
                fieldListObj.locale = 'en-US';
                setTimeout(() => {
                    let element: HTMLElement = document.getElementById('PivotFieldList_Container_title').querySelector('.e-title-content');
                    expect(element.textContent).toBe('Field List');
                    done();
                }, 1000);
            });
            it('field-list destroy', () => {
                fieldListObj.destroy();
                expect(true).toBeTruthy();
            });
            it('field-list destroy expect', () => {
                expect(fieldListObj.element.innerHTML).toBe('');
            });
        });

        describe('Binding an empty data source', () => {
            let fieldListObj: PivotFieldList;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            let remoteData: DataManager;
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
                fieldListObj = new PivotFieldList({
                    dataSourceSettings: {
                        dataSource: [],
                        expandAll: false,
                        columns: [{ name: 'CustomerID', caption: 'Customer ID' }],
                        rows: [{ name: 'ShipCountry', caption: 'Ship Country' }, { name: 'ShipCity', caption: 'Ship City' }],
                        values: [{ name: 'Freight' }]
                    },
                    renderMode: 'Fixed',
                });
                fieldListObj.appendTo('#PivotFieldList');
            });
            it('Loading the remote data', function (done) {
                let remoteData: DataManager = new DataManager({
                    url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Orders',
                    adaptor: new ODataV4Adaptor(),
                    crossDomain: true
                });
                remoteData.defaultQuery = new Query().take(5);
                fieldListObj.dataSourceSettings.dataSource = remoteData;
                setTimeout(function () {
                    expect(document.querySelector('.e-pivotfieldlist-container') !== null).toBeTruthy;
                    done();
                }, 3000);
            });
            it('Checking the pivot buttons', function (done) {
                setTimeout(function () {
                    expect(document.querySelectorAll('.e-axis-content')[1].querySelectorAll('.e-pivot-button').length > 0).toBeTruthy;
                    expect(document.querySelectorAll('.e-axis-content')[2].querySelectorAll('.e-pivot-button').length > 0).toBeTruthy;
                    expect(document.querySelectorAll('.e-axis-content')[3].querySelectorAll('.e-pivot-button').length > 0).toBeTruthy;
                    done();
                }, 1000);
            });
            it('Redering empty data', function (done) {
                remoteData = new DataManager({
                    url: 'https://services.odata.org/V4/Northwind/Northwind.svc/Orders',
                    adaptor: new ODataV4Adaptor(),
                    crossDomain: true
                });
                remoteData.defaultQuery = new Query().take(0);
                fieldListObj.dataSourceSettings.dataSource = remoteData;
                setTimeout(function () {
                    expect(document.querySelector('.e-pivotfieldlist-container') !== null).toBeTruthy;
                    done();
                }, 3000);
            });
            it('Redering empty data', function (done) {
                setTimeout(function () {
                    expect(document.querySelectorAll('.e-axis-content')[1].querySelectorAll('.e-pivot-button').length === 0).toBeTruthy;
                    expect(document.querySelectorAll('.e-axis-content')[2].querySelectorAll('.e-pivot-button').length === 0).toBeTruthy;
                    expect(document.querySelectorAll('.e-axis-content')[3].querySelectorAll('.e-pivot-button').length === 0).toBeTruthy;
                    done();
                }, 1000);
            });
        });
    });

    /**
     * Pivot Field List tree view spec
     */

    describe('Pivot Field List Rendering', () => {
        describe('Field List with Tree Node Action', () => {
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
                        fieldDragStart: (args: FieldDragStartEventArgs) => {
                            expect(args.fieldItem).toBeTruthy;
                            expect(args.cancel).toBe(false);
                            console.log('fieldDragName: ' + args.fieldItem.name);
                        },
                        fieldDrop: (args: FieldDropEventArgs) => {
                            expect(args.dropField).toBeTruthy;
                            expect(args.cancel).toBe(false);
                            console.log('fieldDropName: ' + args.dropField.name);
                        },
                        onFieldDropped: (args: FieldDroppedEventArgs) => {
                            expect(args.droppedField).toBeTruthy;
                            console.log('fieldDroppedName: ' + args.droppedField.name);
                        },
                        fieldRemove: (args: FieldRemoveEventArgs) => {
                            expect(args.fieldItem).toBeTruthy;
                            expect(args.cancel).toBe(false);
                            console.log('fieldRemoveName: ' + args.fieldItem.name);
                        },
                        calculatedFieldCreate: (args: CalculatedFieldCreateEventArgs) => {
                            expect(args.calculatedField).toBeTruthy;
                            expect(args.cancel).toBe(false);
                            console.log('CreateCalcaltedFieldName: ' + args.calculatedField.name);
                        }
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });

            let persistdata: string;
            it('check field list tree view', () => {
                expect(!isNullOrUndefined(fieldListObj.element.querySelector('.e-pivotfieldlist-container')));
                expect(fieldListObj.treeViewModule.fieldTable.element.classList.contains('e-field-list'));
            });
            it('check tree header node', (done: Function) => {
                setTimeout(() => {
                    let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                    util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                    expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                    done();
                });
            });
            it('checked node check axis button', (done: Function) => {
                setTimeout(() => {
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                    let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).toBe('pno');
                    done();
                });
            });
            it('un-check tree header nodes', (done: Function) => {
                setTimeout(() => {
                    let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                    util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                    expect(checkEle[0].getAttribute('aria-checked')).toBe('false');
                    done();
                });
            });
            it('un-checked node check axis button', (done: Function) => {
                setTimeout(() => {
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                    let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).not.toBe('pno');
                    done();
                });
            });
            it('show filter popup', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                setTimeout(() => {
                    expect(1).toBe(1);
                    done();
                });
            });
            it('check tree header node with filter popup', (done: Function) => {
                setTimeout(() => {
                    let treeObj: TreeView = fieldListObj.pivotCommon.filterDialog.memberTreeView;
                    let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(checkEle.length).toBeGreaterThan(0);
                    expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                    util.checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                    expect(checkEle[0].getAttribute('aria-checked')).toBe('true');
                    done();
                });
            });
        });
    });

    /**
     * Pivot Field List sort and filter spec
     */

    describe('Pivot Field List Rendering', () => {
        describe('Check Sort Actions', () => {
            let fieldListObj: PivotFieldList;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
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
                fieldListObj = new PivotFieldList(
                    {
                        dataSourceSettings: {
                            dataSource: pivot_dataset as IDataSet[],
                            expandAll: false,
                            enableSorting: false,
                            sortSettings: [{ name: 'company', order: 'Descending' }],
                            filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                            { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                            { name: 'gender', type: 'Include', items: ['male'] }],
                            rows: [{ name: 'company' }, { name: 'state' }],
                            columns: [{ name: 'name' }],
                            values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                        },
                        renderMode: 'Fixed',
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
            });
            it('check sort icon disabled', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-icons').classList.contains('e-drag')).toBeTruthy;
            });
            it('enable enableSorting on dataSource', () => {
                fieldListObj.dataSourceSettings = {
                    dataSource: pivot_dataset as IDataSet[],
                    expandAll: false,
                    enableSorting: true,
                    sortSettings: [{ name: 'company', order: 'None' }],
                    filterSettings: [{ name: 'name', type: 'Include', items: ['Knight Wooten'] },
                    { name: 'company', type: 'Exclude', items: ['NIPAZ'] },
                    { name: 'gender', type: 'Include', items: ['male'] }],
                    rows: [{ name: 'company' }, { name: 'state' }],
                    columns: [{ name: 'name' }],
                    values: [{ name: 'balance' }, { name: 'quantity' }], filters: [{ name: 'gender' }]
                };
                fieldListObj.refresh();
                    let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                    let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                    expect(pivotButtons.length).toBeGreaterThan(0);
                    expect((pivotButtons[0]).querySelector('.e-sort')).toBeTruthy;
            });
            it('sort ascending order field', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-sort') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check descending order field', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-descend')).toBeTruthy;
            });
            it('Sort descending order field', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[1]) as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('testing on open error dialog with message', (done: Function) => {
                let title: string = 'Title';
                let message: string = 'Error dialog has been opened';
                fieldListObj.pivotCommon.errorDialog.createErrorDialog(title, message);
                setTimeout(() => {
                    expect(fieldListObj.pivotCommon.errorDialog.errorPopUp.element.classList.contains('e-popup-open')).toBe(true);
                    expect(fieldListObj.pivotCommon.errorDialog.errorPopUp.element.querySelector('.e-dlg-header').textContent).toBe(title);
                    expect(fieldListObj.pivotCommon.errorDialog.errorPopUp.element.querySelector('.e-dlg-content').textContent).toBe(message);
                    done();
                }, 1000);
            });
            it('close error dialog', (done: Function) => {
                (fieldListObj.pivotCommon.errorDialog.errorPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
                setTimeout(() => {
                    expect(fieldListObj.pivotCommon.errorDialog.errorPopUp).toBeUndefined;
                    done();
                }, 1000);
            });
            it('Sort descending order field', (done: Function) => {
                setTimeout(() => {
                    fieldListObj.dataSourceSettings.sortSettings = [{ name: 'state', order: 'Descending', membersOrder: ['New Jercy', 'Delhi'] }];
                    expect(true).toBe(true);
                    done();
                }, 1000);
            });
            it('sort ascending order field', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect(true).toBe(true);
            });
        });
    });

    describe('Exclude Fields from fieldlist', () => {
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
                        excludeFields: ['index', '_id', 'guid', 'pno', 'phone', 'email', 'advance'],
                        sortSettings: [{ name: 'company', order: 'Descending' }],
                        calculatedFieldSettings: [
                            { name: 'price', formula: '(("Sum(balance)"*10^3+"Count(quantity)")/100)+"Sum(balance)"' },
                            { name: 'total', formula: '"Sum(balance)"+"Sum(quantity)"' }],
                        rows: [{ name: 'product' }],
                        columns: [{ name: 'gender' }],
                        values: [{ name: 'balance' }, { name: 'price', type: 'CalculatedField' },
                        { name: 'quantity' }],
                        filters: [{ name: 'eyeColor' }, { name: 'product' }, { name: 'isActive' }, { name: 'state' }, { name: 'pno' }, { name: 'gender' }]
                    },
                    renderMode: 'Fixed',
                });
            fieldListObj.appendTo('#PivotFieldList');
            pivotCommon = fieldListObj.pivotCommon;
        });
        it('exclude fields ui check', (done: Function) => {
            setTimeout(() => {
                expect((fieldListObj.element.querySelector('.e-list-parent') as HTMLElement).children.length).toBe(13);
                fieldListObj.dataSourceSettings.excludeFields = [];
                done();
            }, 1000);
        });
        it('exclude fields null and ui check', (done: Function) => {
            fieldListObj.dataSourceSettings.excludeFields = [];
            fieldListObj.refresh();
            setTimeout(() => {
                expect((fieldListObj.element.querySelector('.e-list-parent') as HTMLElement).children.length).toBe(20);
                done();
            }, 1000);
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
