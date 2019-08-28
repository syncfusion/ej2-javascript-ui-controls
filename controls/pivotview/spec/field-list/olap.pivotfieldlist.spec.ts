import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, isNullOrUndefined, EmitType, closest } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { PivotCommon } from '../../src/common/base/pivot-common';
import { MaskedTextBox } from '@syncfusion/ej2-inputs';
import { TreeView } from '@syncfusion/ej2-navigations';
import { LoadEventArgs } from '../../src';
import { CalculatedField } from '../../src/common/calculatedfield/calculated-field';
import { EventHandler } from '@syncfusion/ej2-base';
import { addClass, removeClass } from '@syncfusion/ej2-base';
import { profile, inMB, getMemoryProfile } from '../common.spec';

describe('PivotFieldList spec', () => {
    /**
     * Pivot Field List base spec for OLAP datasource
     */
    // let url: string = 'https://bi.syncfusion.com/olap/msmdpump.dll';
    // let catalog: string = 'Adventure Works DW 2008 SE';
    let url: string = 'https://olap.flexmonster.com/olap/msmdpump.dll';
    let catalog: string = 'Adventure Works DW Standard Edition';
    function disableDialogAnimation(dialogObject: Dialog): void {
        dialogObject.animationSettings = { effect: 'None' };
        dialogObject.dataBind();
        dialogObject.hide();
    }

    function checkTreeNode(treeObj: TreeView, li: Element): void {
        removeClass(treeObj.element.querySelectorAll('li'), ['e-node-focus', 'e-active']);
        addClass([li], ['e-node-focus', 'e-active']);
        (treeObj as any).checkNode((li).getAttribute('data-uid'));
    }

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
            let originalTimeout: number;
            let fieldListObj: PivotFieldList;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                fieldListObj = new PivotFieldList({
                    dataSourceSettings: {
                        catalog: catalog,
                        cube: 'Adventure Works',
                        dataProviderType: 'microsoft analysis services',
                        url: url,
                        localeIdentifier: 1033,
                        rows: [
                            { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                        ],
                        columns: [
                            { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                            { name: '[Measures]', caption: 'Measures' }
                        ],
                        values: [
                            { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                        ],
                        filters: [],
                        valueAxis: 'column'
                    },
                    cssClass: 'test-class',
                    dataBound: dataBound
                });
                fieldListObj.appendTo('#PivotFieldList');
                disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            it('control class testing', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(document.getElementById('PivotFieldList').classList.contains('e-pivotfieldlist')).toEqual(true);
            });
            it('get component name testing', () => {
                expect(fieldListObj.getModuleName()).toEqual('pivotfieldlist');
            });
            it('show field list', () => {
                (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(fieldListObj.dialogRenderer.fieldListDialog.element.classList.contains('e-popup-open')).toBe(true);
            });
            it('field-list getPersist', () => {
                persistdata = fieldListObj.getPersistData();
                expect(true).toBeTruthy();
            });
            it('field-list getPersist expect', () => {
                expect(!isNullOrUndefined(JSON.parse(persistdata).dataSourceSettings)).toBeTruthy();
            });
            it('set rtl property', () => {
                fieldListObj.enableRtl = true;
            });
            it('check-set rtl property', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).toBeTruthy;
            });
            it('remove rtl property', () => {
                fieldListObj.enableRtl = false;
            });
            it('check-remove rtl property', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(document.getElementById('PivotFieldList').classList.contains('e-rtl')).not.toBeTruthy;
            });
            it('set locale property', () => {
                fieldListObj.locale = 'fr-FR';
            });
            it('check-set locale property', () => {
                let element: HTMLElement = document.getElementById('PivotFieldList_Wrapper_title').querySelector('.e-title-content');
                expect(element.textContent).toBe('Field List');
            });
            it('field-list destroy', () => {
                fieldListObj.destroy();
                expect(true).toBeTruthy();
            });
            it('field-list destroy expect', () => {
                expect(fieldListObj.element.innerHTML).toBe('');
            });
        });
    });

    /**
     * Pivot Field List render spec
     */

    describe('Pivot Field List Rendering', () => {
        describe('Field List with Static mode', () => {
            let originalTimeout: number;
            let fieldListObj: PivotFieldList;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                fieldListObj = new PivotFieldList(
                    {
                        dataSourceSettings: {
                            catalog: catalog,
                            cube: 'Adventure Works',
                            dataProviderType: 'microsoft analysis services',
                            url: url,
                            localeIdentifier: 1033,
                            rows: [
                                { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                            ],
                            columns: [
                                { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                                { name: '[Measures]', caption: 'Measures' }
                            ],
                            values: [
                                { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                            ],
                            filters: [],
                            valueAxis: 'column'
                        },
                        renderMode: 'Fixed',
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
            });
            it('control class testing', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(document.getElementById('PivotFieldList').classList.contains('e-pivotfieldlist')).toEqual(true);
            });
            it('check field list control wrapper', () => {
                expect(!isNullOrUndefined(fieldListObj.element.querySelector('.e-pivotfieldlist-wrapper')));
            });
        });
        describe('Field List with Dynamic mode', () => {
            let originalTimeout: number;
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
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 35000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                if (document.getElementById(elem1.id)) {
                    remove(document.getElementById(elem1.id));
                }
                document.body.appendChild(elem);
                document.body.appendChild(elem1);
                let dataBound: EmitType<Object> = () => { done(); };
                fieldListObj = new PivotFieldList(
                    {
                        dataSourceSettings: {
                            catalog: catalog,
                            cube: 'Adventure Works',
                            dataProviderType: 'microsoft analysis services',
                            url: url,
                            localeIdentifier: 1033,
                            rows: [
                                { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                            ],
                            columns: [
                                { name: '[Geography].[Geography]', caption: 'Geography' },
                                { name: '[Measures]', caption: 'Measures' }
                            ],
                            values: [
                                { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                            ],
                            filters: [{ name: '[Customer].[Customer]', caption: 'Customer' }],
                            valueAxis: 'column'
                        },
                        renderMode: 'Popup',
                        maxNodeLimitInMemberEditor: 50,
                        target: elem1,
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
                disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
                pivotCommon = fieldListObj.pivotCommon;
            });
            let persistdata: string;
            it('control class testing', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Geography].[Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] WHERE ({({[Customer].[Customer]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(fieldListObj.element.classList.contains('e-pivotfieldlist')).toEqual(true);
            });
            it('check field list icon', () => {
                (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                expect(true).toBe(true);
            });
            it('check field list dialog with targetID', () => {
                expect(!isNullOrUndefined(elem1.querySelector('.e-pivotfieldlist-wrapper')));
            });
            it('open filter popup', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            });
            it('check-filter popup', () => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                expect(document.querySelectorAll('.e-member-editor-container li').length).toBe(50);
            });
            it('check close field list', () => {
                let controlWrapper: HTMLElement = elem1.querySelector('.e-pivotfieldlist-wrapper');
                (controlWrapper.querySelector('.e-cancel-btn') as HTMLElement).click();
                expect(elem1.querySelector('.e-pivotfieldlist-wrapper').classList.contains('e-popup-close'));
            });
        });
        describe('Field List rendering on mobile device', () => {
            let originalTimeout: number;
            let fieldListObj: PivotFieldList;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:100%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                fieldListObj = new PivotFieldList({
                    dataSourceSettings: {
                        catalog: catalog,
                        cube: 'Adventure Works',
                        dataProviderType: 'microsoft analysis services',
                        url: url,
                        localeIdentifier: 1033,
                        rows: [
                            { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                        ],
                        columns: [
                            { name: '[Geography].[Geography]', caption: 'Geography' },
                            { name: '[Measures]', caption: 'Measures' }
                        ],
                        values: [
                            { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                        ],
                        filters: [{ name: '[Customer].[Customer]', caption: 'Customer' }],
                        valueAxis: 'column'
                    },
                    dataBound: dataBound,
                    load: (args: LoadEventArgs) => {
                        fieldListObj.isAdaptive = true;
                    }
                });
                fieldListObj.appendTo('#PivotFieldList');
                disableDialogAnimation(fieldListObj.dialogRenderer.fieldListDialog);
            });
            let persistdata: string;
            it('control class testing for mobile device', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Geography].[Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] WHERE ({({[Customer].[Customer]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(document.getElementById('PivotFieldList').classList.contains('e-pivotfieldlist')).toEqual(true);
                expect(document.getElementById('PivotFieldList').classList.contains('e-device')).toEqual(true);
            });
            it('get component name testing', () => {
                expect(fieldListObj.getModuleName()).toEqual('pivotfieldlist');
            });
            it('check field list icon', (done: Function) => {
                (fieldListObj.element.querySelector('.e-toggle-field-list') as HTMLElement).click();
                setTimeout(() => {
                    expect(fieldListObj.dialogRenderer.fieldListDialog.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('Remove pivot button', () => {
                let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect(pivotButtons[0].id).toBe('[Customer].[Customer]');
                (pivotButtons[0].querySelector('.e-remove') as HTMLElement).click();
            });
            it('check remove pivot button', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Geography].[Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                pivotButtons = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toEqual(0);
            });
            it('check on column axis view change', (done: Function) => {
                let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(4);
                let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                headerElement[1].click();
                setTimeout(() => {
                    expect(headerElement[1].textContent).toBe('Columns');
                    expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                    let addButton: HTMLElement = dialogElement.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                    expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('open filter popup', () => {
                let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            });
            it('open filter popup', () => {
                expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
            });
            it('close filter popup by cancel', (done: Function) => {
                (fieldListObj.pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-cancel-btn') as HTMLElement).click();
                setTimeout(() => {
                    expect(fieldListObj.pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    done();
                }, 1000);
            });
            it('check on filter axis view change', (done: Function) => {
                let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                expect([].slice.call(element.querySelectorAll('.e-toolbar-item')).length).toEqual(4);
                let headerElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
                expect(headerElement[1].classList.contains('e-active')).toBeTruthy;
                headerElement[0].click();
                setTimeout(() => {
                    expect(headerElement[0].textContent).toBe('Filters');
                    expect(headerElement[0].classList.contains('e-active')).toBeTruthy;
                    let addButton: HTMLElement = dialogElement.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                    expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('Open fields dialog', (done: Function) => {
                let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toEqual(0);
                let addButton: HTMLElement = dialogElement.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                expect(addButton.classList.contains('e-disable')).not.toBeTruthy;
                addButton.click();
                setTimeout(() => {
                    expect(dialogElement.querySelector('.e-adaptive-field-list-dialog').classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check on field node', () => {
                let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = [].slice.call(treeObj.element.querySelectorAll('li'));
                expect(checkEle.length).toBeGreaterThan(0);
                checkTreeNode(treeObj, checkEle[31]);
                expect(checkEle[31].querySelector('.e-check')).toBeTruthy;
                (dialogElement.querySelector('.e-adaptive-field-list-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('check add fields to current axis', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Geography].[Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] WHERE ({({[Customer].[Customer]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                expect(dialogElement.querySelector('.e-adaptive-field-list-dialog')).toBeUndefined;
                let contentElement: HTMLElement = element.querySelector('.e-content').querySelector('.e-item.e-active');
                let pivotButtons: HTMLElement[] = [].slice.call(contentElement.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toEqual(1);
                expect(pivotButtons[0].id).toBe('[Customer].[Customer]');
                let addButton: HTMLElement = dialogElement.querySelector('.e-field-list-footer').querySelector('.e-field-list-btn');
                addButton.click();
            });
            it('check add fields on search option', (done: Function) => {
                let dialogElement: HTMLElement = fieldListObj.dialogRenderer.fieldListDialog.element;
                let element: HTMLElement = dialogElement.querySelector('.e-adaptive-container');
                expect(element.parentElement.querySelector('.e-adaptive-field-list-dialog')).toBeTruthy;
                expect(element.parentElement
                    .querySelector('.e-adaptive-field-list-dialog').classList.contains('e-popup-open')).toBe(true);
                let searchOption: MaskedTextBox = (fieldListObj.treeViewModule as any).editorSearch;
                expect(searchOption).not.toBeUndefined;
                searchOption.setProperties({ value: 'customer' });
                searchOption.change({ value: searchOption.value });
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                searchOption.setProperties({ value: '' });
                searchOption.change({ value: searchOption.value });
                checkEle = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                setTimeout(() => {
                    expect(checkEle[31].querySelector('.e-check')).toBeTruthy;
                    (element.parentElement
                        .querySelector('.e-adaptive-field-list-dialog').querySelector('.e-ok-btn') as HTMLElement).click();
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
            let originalTimeout: number;
            let fieldListObj: PivotFieldList;
            let pivotCommon: PivotCommon;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                fieldListObj = new PivotFieldList(
                    {
                        dataSourceSettings: {
                            catalog: catalog,
                            cube: 'Adventure Works',
                            dataProviderType: 'microsoft analysis services',
                            url: url,
                            localeIdentifier: 1033,
                            rows: [
                                { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                            ],
                            columns: [
                                { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                                { name: '[Measures]', caption: 'Measures' }
                            ],
                            values: [
                                { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                            ],
                            filters: [],
                            valueAxis: 'column'
                        },
                        renderMode: 'Fixed',
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });

            let persistdata: string;
            it('check field list tree view', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                expect(!isNullOrUndefined(fieldListObj.element.querySelector('.e-pivotfieldlist-wrapper')));
                expect(fieldListObj.treeViewModule.fieldTable.element.classList.contains('e-field-list'));
            });
            it('check tree header node', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[171], 'li'));
                expect(checkEle[171].getAttribute('aria-checked')).toBe('true');
            });
            it('checked node check axis button', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * ({DrilldownLevel({[Department].[Departments]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] =
                    [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).toBe('[Department].[Departments]');
            });
            it('un-check tree header nodes', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[171], 'li'));
                expect(checkEle[171].getAttribute('aria-checked')).toBe('false');
            });
            it('un-checked node check axis button', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).toBe('[Date].[Fiscal]');
            });
            it('check tree value node', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                expect(checkEle[2].getAttribute('aria-checked')).toBe('true');
            });
            it('checked node check axis button', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).toBe('[Measures].[Internet Sales Amount]');
            });
            it('un-check tree value nodes', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[2], 'li'));
                expect(checkEle[2].getAttribute('aria-checked')).toBe('false');
            });
            it('un-checked node check axis button', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).getAttribute('data-uid')).toBe('[Measures].[Customer Count]');
            });
        });
    });

    /**
     * Pivot Field List filter spec
     */

    describe('Pivot Field List Rendering', () => {
        describe('Check Filter Actions', () => {
            let originalTimeout: number;
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
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                fieldListObj = new PivotFieldList(
                    {
                        dataSourceSettings: {
                            catalog: catalog,
                            cube: 'Adventure Works',
                            dataProviderType: 'microsoft analysis services',
                            url: url,
                            localeIdentifier: 1033,
                            filterSettings: [
                                {
                                    type: 'Include',
                                    name: '[Customer].[Customer Geography]',
                                    items: ['[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]',
                                        '[Customer].[Customer Geography].[Country].&[Germany]',
                                        '[Customer].[Customer Geography].[Country].&[France]',
                                        '[Customer].[Customer Geography].[Country].&[United Kingdom]',
                                        '[Customer].[Customer Geography].[Country].&[United States]']
                                }
                            ],
                            rows: [
                                { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                            ],
                            columns: [
                                { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                                { name: '[Measures]', caption: 'Measures' }
                            ],
                            values: [
                                { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                            ],
                            filters: [],
                            valueAxis: 'column'
                        },
                        renderMode: 'Fixed'
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('open filter popup', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[State-Province].&amp;[NSW]&amp;[AU],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            });
            it('close filter popup by cancel', (done: Function) => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-cancel-btn') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element).toBeUndefined;
                    done();
                }, 1000);
            });
            it('check include type filter field', (done: Function) => {
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('check all nodes on filter popup', (done: Function) => {
                let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
                let memberTreeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                let allNode: HTMLElement = treeObj.element.querySelector('.e-checkbox-wrapper');
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(allNode.classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(allNode, 'li'));
                setTimeout(() => {
                    let checkedEle: Element[] = <Element[] & NodeListOf<Element>>memberTreeObj.element.querySelectorAll('.e-check');
                    expect(checkEle.length).toEqual(checkedEle.length);
                    expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                    (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('check filter state after update', (done: Function) => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                let pivotButtons: HTMLElement[] = [].slice.call(rightAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[0]).querySelector('.e-btn-filter').classList.contains('e-pv-filter')).toBeTruthy;
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
                setTimeout(() => {
                    expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                    done();
                }, 1000);
            });
            it('update filter State by check member node', () => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                let checkEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                expect(checkEle.length).toBeGreaterThan(0);
                expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                checkTreeNode(treeObj, closest(checkEle[0], 'li'));
                let checkedEle: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-check');
                expect(checkedEle.length).toEqual(5);
                expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
            });
            it('open filter popup', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[Country].&amp;[Canada],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                ((pivotButtons[0]).querySelector('.e-btn-filter') as HTMLElement).click();
            });
            it('Expand filter popup', (done: Function) => {
                let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                let liElements: Element[] = [].slice.call(treeObj.element.querySelectorAll('li'));
                expect(liElements.length).toBeGreaterThan(0);
                treeObj.expandAll([liElements[0]]);
                setTimeout(() => {
                    let expandedLiElements: Element[] = [].slice.call(treeObj.element.querySelectorAll('li'));
                    expect(expandedLiElements.length).toBeGreaterThan(liElements.length);
                    done();
                }, 1000);
            });
            it('check search nodes for no matches', (done: Function) => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                let searchOption: MaskedTextBox = pivotCommon.filterDialog.editorSearch;
                searchOption.setProperties({ value: 'x' });
                searchOption.change({ value: searchOption.value });
                setTimeout(() => {
                    let treeObj: TreeView = pivotCommon.filterDialog.allMemberSelect;
                    let allNode: HTMLLIElement[] = <HTMLLIElement[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                    expect(allNode.length).toBe(1);
                    expect(allNode[0].classList.contains('e-disable')).not.toBeTruthy;
                    expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe('disabled');
                    done();
                }, 1000);
            });
            it('check single node on search nodes', (done: Function) => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                let searchOption: MaskedTextBox = pivotCommon.filterDialog.editorSearch;
                searchOption.setProperties({ value: 'FY 2005' });
                searchOption.change({ value: searchOption.value });
                setTimeout(() => {
                    let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                    let liNode: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(liNode.length).toBeGreaterThan(0);
                    expect(treeObj.element.querySelector('.e-checkbox-wrapper').classList.contains('e-small')).toBe(false);
                    checkTreeNode(treeObj, closest(liNode[3], 'li'));
                    expect(liNode[3].querySelector('.e-frame').classList.contains('e-check')).not.toBeTruthy;
                    done();
                }, 1000);
            });
            it('clear search filters', (done: Function) => {
                expect(pivotCommon.filterDialog.dialogPopUp.element.classList.contains('e-popup-open')).toBe(true);
                let searchOption: MaskedTextBox = pivotCommon.filterDialog.editorSearch;
                searchOption.setProperties({ value: '' });
                searchOption.change({ value: searchOption.value });
                setTimeout(() => {
                    let treeObj: TreeView = pivotCommon.filterDialog.memberTreeView;
                    let liNode: Element[] = <Element[] & NodeListOf<Element>>treeObj.element.querySelectorAll('.e-checkbox-wrapper');
                    expect(liNode.length).toBeGreaterThan(0);
                    expect(pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn').getAttribute('disabled')).toBe(null);
                    (pivotCommon.filterDialog.dialogPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('check filter popup after update', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM( SELECT ({[Customer].[Customer Geography].[Country].&amp;[Canada],[Customer].[Customer Geography].[Country].&amp;[France],[Customer].[Customer Geography].[Country].&amp;[Germany],[Customer].[Customer Geography].[Country].&amp;[United Kingdom],[Customer].[Customer Geography].[Country].&amp;[United States]} ) ON COLUMNS ,({[Date].[Fiscal].[Fiscal Quarter].&amp;[2005]&amp;[3],[Date].[Fiscal].[Fiscal Year].&amp;[2006],[Date].[Fiscal].[Fiscal Year].&amp;[2007],[Date].[Fiscal].[Fiscal Year].&amp;[2008],[Date].[Fiscal].[Fiscal Year].&amp;[2009],[Date].[Fiscal].[Fiscal Year].&amp;[2010],[Date].[Fiscal].[Fiscal Year].&amp;[2011],[Date].[Fiscal].[Fiscal Year].&amp;[2012],[Date].[Fiscal].[Fiscal Year].&amp;[2013],[Date].[Fiscal].[Fiscal Year].&amp;[2014]}) ON ROWS  FROM [Adventure Works]) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                expect(pivotCommon.filterDialog.dialogPopUp).toBeUndefined;
                let pivotButtons: HTMLElement[] = [].slice.call(leftAxisPanel.querySelectorAll('.e-pivot-button'));
                expect(pivotButtons.length).toBeGreaterThan(0);
                expect((pivotButtons[pivotButtons.length - 1]).querySelector('.e-btn-filter').classList.contains('e-pv-filtered')).toBeTruthy;
            });
        });
    });

    /**
     * Pivot Field List Drag and drop spec
     */


    function copyObject(source: any, destiation: any): Object {
        for (let prop of source) {
            destiation[prop] = source[prop];
        }
        return destiation;
    }

    function getEventObject(eventType: string, eventName: string, currentTarget?: Element, target?: Element, x?: number, y?: number): Object {
        let tempEvent: any = document.createEvent(eventType);
        tempEvent.initEvent(eventName, true, true);
        let returnObject: any = copyObject(tempEvent, {});
        returnObject.preventDefault = () => { return true; };

        if (!isNullOrUndefined(x)) {
            returnObject.pageX = x;
            returnObject.clientX = x;
        }
        if (!isNullOrUndefined(y)) {
            returnObject.pageY = y;
            returnObject.clientY = y;
        }
        if (!isNullOrUndefined(currentTarget)) {
            returnObject.currentTarget = currentTarget;
        }
        if (!isNullOrUndefined(target)) {
            returnObject.target = returnObject.srcElement = returnObject.toElement = target;
            returnObject.offsetY = 7;
        }
        returnObject.type = 'mouse';
        return returnObject;
    }

    function setMouseCordinates(eventarg: any, x: number, y: number): Object {
        eventarg.pageX = x;
        eventarg.pageY = y;
        eventarg.clientX = x;
        eventarg.clientY = y;
        eventarg.offsetY = 7;
        return eventarg;
    }

    describe('Pivot Field List Rendering', () => {
        describe('Check node drag and drop Actions', () => {
            let originalTimeout: number;
            let fieldListObj: PivotFieldList;
            let pivotCommon: PivotCommon;
            let mouseEventArgs: any;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeEach(() => {
                mouseEventArgs = {
                    preventDefault: (): void => { },
                    stopImmediatePropagation: (): void => { },
                    target: null,
                    type: null,
                    shiftKey: false,
                    ctrlKey: false,
                    originalEvent: { target: null }
                };
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                fieldListObj = new PivotFieldList(
                    {
                        dataSourceSettings: {
                            catalog: catalog,
                            cube: 'Adventure Works',
                            dataProviderType: 'microsoft analysis services',
                            url: url,
                            localeIdentifier: 1033,
                            rows: [
                                { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                            ],
                            columns: [
                                { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
                                // { name: '[Measures]', caption: 'Measures' }
                            ],
                            values: [
                                { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                            ],
                            filters: [],
                            valueAxis: 'column'
                        },
                        renderMode: 'Fixed',
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('drag and drop node to filter axis', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(0);
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[66].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[66].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, filterAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            });
            it('check drag and drop node to filter axis', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] WHERE ({({[Account].[Account Type]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect((li[66]).querySelector('e-check')).toBeTruthy;
                expect(pivotButton.length).toEqual(1);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('[Account].[Account Type]');
            });
            it('drag and drop node to value axis', () => {
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let valueAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-values');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', treeObj.element, li[2].querySelector('.e-drag'), 15, 10);
                EventHandler.trigger(treeObj.element, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', treeObj.element, li[2].querySelector('.e-drag'), 15, 70);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove.srcElement = mousemove.target = mousemove.toElement = valueAxiscontent;
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseup: any = getEventObject('MouseEvents', 'mouseup', treeObj.element, valueAxiscontent);
                mouseup.type = 'mouseup';
                EventHandler.trigger(<any>(document), 'mouseup', mouseup);
            });
            it('check drag and drop node to value axis', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Customer].[Customer Geography]})}) * {{[Measures].[Customer Count], [Measures].[Internet Sales Amount]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] WHERE ({({[Account].[Account Type]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let valueAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-values');
                let columnAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-columns');
                let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>treeObj.element.querySelectorAll('li');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect((li[2]).querySelector('e-check')).toBeTruthy;
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('[Measures].[Internet Sales Amount]');
                pivotButton = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                expect(pivotButton[pivotButton.length - 1].getAttribute('data-uid')).toBe('[Measures]');
            });
        });
        describe('Check pivot button drag and drop Actions', () => {
            let originalTimeout: number;
            let fieldListObj: PivotFieldList;
            let pivotCommon: PivotCommon;
            let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
            afterAll(() => {
                if (fieldListObj) {
                    fieldListObj.destroy();
                }
                remove(elem);
            });
            beforeAll((done: Function) => {
                originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 25000;
                if (document.getElementById(elem.id)) {
                    remove(document.getElementById(elem.id));
                }
                document.body.appendChild(elem);
                let dataBound: EmitType<Object> = () => { done(); };
                PivotFieldList.Inject(CalculatedField);
                fieldListObj = new PivotFieldList(
                    {
                        dataSourceSettings: {
                            catalog: catalog,
                            cube: 'Adventure Works',
                            dataProviderType: 'microsoft analysis services',
                            url: url,
                            localeIdentifier: 1033,
                            rows: [
                                { name: '[Date].[Fiscal]', caption: 'Date Fiscal' }
                            ],
                            columns: [
                                { name: '[Geography].[Geography]', caption: 'Geography' },
                                { name: '[Measures]', caption: 'Measures' }
                            ],
                            values: [
                                { name: '[Measures].[Customer Count]', caption: 'Customer Count' }
                            ],
                            filters: [
                                { name: '[Customer].[Customer]', caption: 'Customer' }
                            ],
                            valueAxis: 'column'
                        },
                        renderMode: 'Fixed',
                        dataBound: dataBound
                    });
                fieldListObj.appendTo('#PivotFieldList');
                pivotCommon = fieldListObj.pivotCommon;
            });
            it('drag and drop pivot button to body', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Geography].[Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] WHERE ({({[Customer].[Customer]})}) CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let treeObj: TreeView = fieldListObj.treeViewModule.fieldTable;
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
                let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, treeObj.element, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = treeObj.element;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, treeObj.element);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = treeObj.element;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            });
            it('check drag and drop pivot button to body', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Geography].[Geography]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
                let pivotButton: HTMLElement[] = [].slice.call((filterAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(0);
            });
            it('drag/drop pivot button from axis field to axis field', () => {
                debugger
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let columnAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-columns');
                let pivotButton: HTMLElement[] = [].slice.call((columnAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[1].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, rowAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, rowAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = rowAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            });
            it('check drag/drop pivot button from axis field to axis field', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Geography].[Geography]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY (({DrilldownLevel({[Date].[Fiscal]})}) * {{[Measures].[Customer Count]}}) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
            });
            it('drag/drop pivot button from axis field to button position', () => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
                let dragElement: HTMLElement = pivotButton[pivotButton.length - 1].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, pivotButton[0], 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = pivotButton[0];
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, pivotButton[0]);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = pivotButton[0];
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
            });
            it('check drag/drop pivot button from axis field to button position', () => {
                expect(fieldListObj.olapEngineModule.mdxQuery).toBe('Select NON EMPTY (({DrilldownLevel({[Geography].[Geography]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON COLUMNS, NON EMPTY ({{[Measures].[Customer Count]}} * ({DrilldownLevel({[Date].[Fiscal]})})) DIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE ON ROWS FROM [Adventure Works] CELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE');
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rowAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-rows');
                let pivotButton: HTMLElement[] = [].slice.call((rowAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(2);
            });
            it('drag/drop measure field to filter axis field', (done: Function) => {
                let leftAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-left-axis-fields');
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let valueAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-values');
                let filterAxiscontent: HTMLElement = leftAxisPanel.querySelector('.e-filters');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
                let dragElement: HTMLElement = pivotButton[0].querySelector('.e-draggable');
                let mousedown: any =
                    getEventObject('MouseEvents', 'mousedown', dragElement, dragElement, 15, 10);
                EventHandler.trigger(dragElement, 'mousedown', mousedown);
                let mousemove: any =
                    getEventObject('MouseEvents', 'mousemove', dragElement, filterAxiscontent, 15, 70);
                mousemove.srcElement = mousemove.target = mousemove.toElement = filterAxiscontent;
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                mousemove = setMouseCordinates(mousemove, 15, 75);
                EventHandler.trigger(<any>(document), 'mousemove', mousemove);
                let mouseUp: any = getEventObject('MouseEvents', 'mouseup', dragElement, filterAxiscontent);
                mouseUp.type = 'mouseup';
                mouseUp.srcElement = mouseUp.target = mouseUp.toElement = filterAxiscontent;
                EventHandler.trigger(<any>(document), 'mouseup', mouseUp);
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
                setTimeout(() => {
                    expect(pivotCommon.errorDialog.errorPopUp.element.classList.contains('e-popup-open')).toBeTruthy;
                    (pivotCommon.errorDialog.errorPopUp.element.querySelector('.e-ok-btn') as HTMLElement).click();
                    done();
                }, 1000);
            });
            it('Updated DataSourceSettings', () => {
                expect(pivotCommon.errorDialog.errorPopUp).toBeUndefined;
                let rightAxisPanel: HTMLElement = fieldListObj.axisTableModule.axisTable.querySelector('.e-right-axis-fields');
                let valueAxiscontent: HTMLElement = rightAxisPanel.querySelector('.e-values');
                let pivotButton: HTMLElement[] = [].slice.call((valueAxiscontent).querySelectorAll('.e-pivot-button'));
                expect(pivotButton.length).toEqual(1);
            });
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
