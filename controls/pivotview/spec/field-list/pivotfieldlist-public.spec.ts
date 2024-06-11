import { PivotFieldList } from '../../src/pivotfieldlist/base/field-list';
import { createElement, remove, isNullOrUndefined, EmitType, closest } from '@syncfusion/ej2-base';
import { pivot_dataset } from '../base/datasource.spec';
import { IDataSet } from '../../src/base/engine';
import * as util from '../utils.spec';


describe('PivotFieldList null or undefinied values testing', () => {
    describe('Field List -public property testing', () => {
        let fieldListObj11: PivotFieldList;
        let elem: HTMLElement = createElement('div', { id: 'PivotFieldList', styles: 'height:400px;width:60%' });
        afterAll(() => {
            fieldListObj11.destroy();
            remove(elem);
        });
        beforeAll((done: Function) => {
            if (document.getElementById(elem.id)) {
                remove(document.getElementById(elem.id));
            }
            document.body.appendChild(elem);
            let dataBound: EmitType<Object> = () => { done(); };
            fieldListObj11 = new PivotFieldList({
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
            fieldListObj11.appendTo('#PivotFieldList');
            util.disableDialogAnimation(fieldListObj11.dialogRenderer.fieldListDialog);
        });
        // Test case for the allowCalculatedField public property
        it('allowCalculatedField - public property', () => {
            // Test with null value
            fieldListObj11.allowCalculatedField = null;
            fieldListObj11.dataBind();
            expect(fieldListObj11.allowCalculatedField).toBe(null);

            // Test with undefined value.
            fieldListObj11.allowCalculatedField = undefined;
            fieldListObj11.dataBind();
            expect(fieldListObj11.allowCalculatedField).toBe(undefined);
        });

        // Test case for the allowDeferLayoutUpdate public property
        it('allowDeferLayoutUpdate - public property', () => {
            // Test with null value
            fieldListObj11.allowDeferLayoutUpdate = null;
            fieldListObj11.dataBind();
            expect(fieldListObj11.allowDeferLayoutUpdate).toBe(null);

            // Test with undefined value.
            fieldListObj11.allowDeferLayoutUpdate = undefined;
            fieldListObj11.dataBind();
            expect(fieldListObj11.allowDeferLayoutUpdate).toBe(undefined);
        });
        // Test case for the cssClass public property
        it('cssClass - public property', () => {
            // Test with null value
            fieldListObj11.cssClass = null;
            fieldListObj11.dataBind();
            expect(fieldListObj11.cssClass).toBe(null);

            // Test with undefined value.
            fieldListObj11.cssClass = undefined;
            fieldListObj11.dataBind();
            expect(fieldListObj11.cssClass).toBe(undefined);
        });
        // Test case for the enableFieldSearching public property
        it('enableFieldSearching - public property', () => {
            // Test with null value
            fieldListObj11.enableFieldSearching = null;
            fieldListObj11.dataBind();
            expect(fieldListObj11.enableFieldSearching).toBe(null);

            // Test with undefined value.
            fieldListObj11.enableFieldSearching = undefined;
            fieldListObj11.dataBind();
            expect(fieldListObj11.enableFieldSearching).toBe(undefined);
        });
        // Test case for the enableHtmlSanitizer public property
        it('enableHtmlSanitizer - public property', () => {
            // Test with null value
            fieldListObj11.enableHtmlSanitizer = null;
            fieldListObj11.dataBind();
            expect(fieldListObj11.enableHtmlSanitizer).toBe(null);

            // Test with undefined value.
            fieldListObj11.enableHtmlSanitizer = undefined;
            fieldListObj11.dataBind();
            expect(fieldListObj11.enableHtmlSanitizer).toBe(undefined);
        });
        // Test case for the enablePersistence public property
        it('enablePersistence - public property', () => {
            // Test with null value
            fieldListObj11.enablePersistence = null;
            fieldListObj11.dataBind();
            expect(fieldListObj11.enablePersistence).toBe(null);

            // Test with undefined value.
            fieldListObj11.enablePersistence = undefined;
            fieldListObj11.dataBind();
            expect(fieldListObj11.enablePersistence).toBe(undefined);
        });
        // Test case for the enableRtl public property
        it('enableRtl - public property', () => {
            // Test with null value
            fieldListObj11.enableRtl = null;
            fieldListObj11.dataBind();
            expect(fieldListObj11.enableRtl).toBe(null);

            // Test with undefined value.
            fieldListObj11.enableRtl = undefined;
            fieldListObj11.dataBind();
            expect(fieldListObj11.enableRtl).toBe(undefined);
        });
        // Test case for the maxNodeLimitInMemberEditor public property
        it('maxNodeLimitInMemberEditor - public property', () => {
            // Test with null value
            fieldListObj11.maxNodeLimitInMemberEditor = null;
            fieldListObj11.dataBind();
            expect(fieldListObj11.maxNodeLimitInMemberEditor).toBe(null);

            // Test with undefined value.
            fieldListObj11.maxNodeLimitInMemberEditor = undefined;
            fieldListObj11.dataBind();
            expect(fieldListObj11.maxNodeLimitInMemberEditor).toBe(undefined);
        });
        // Test case for the dataSourceSettings public property
        it('dataSourceSettings - public property', () => {
            // Test with null value
            fieldListObj11.dataSourceSettings.allowLabelFilter = null;
            fieldListObj11.dataSourceSettings.allowMemberFilter = null;
            fieldListObj11.dataSourceSettings.allowValueFilter = null;
            fieldListObj11.dataSourceSettings.alwaysShowValueHeader = null;
            fieldListObj11.dataSourceSettings.emptyCellsTextContent = null;
            fieldListObj11.dataSourceSettings.enableSorting = null;
            fieldListObj11.dataSourceSettings.excludeFields = null;
            fieldListObj11.dataSourceSettings.expandAll = null;
            fieldListObj11.dataSourceSettings.grandTotalsPosition = null;
            fieldListObj11.dataSourceSettings.mode = null;
            fieldListObj11.dataSourceSettings.showAggregationOnValueField = null;
            fieldListObj11.dataSourceSettings.showColumnGrandTotals = null;
            fieldListObj11.dataSourceSettings.showColumnSubTotals = null;
            fieldListObj11.dataSourceSettings.showGrandTotals = null;
            fieldListObj11.dataSourceSettings.showHeaderWhenEmpty = null;
            fieldListObj11.dataSourceSettings.showRowGrandTotals = null;
            fieldListObj11.dataSourceSettings.showRowSubTotals = null;
            fieldListObj11.dataSourceSettings.showSubTotals = null;
            fieldListObj11.dataSourceSettings.subTotalsPosition = null;
            fieldListObj11.dataSourceSettings.type = null;
            fieldListObj11.dataSourceSettings.valueIndex = null;
            fieldListObj11.dataBind();
            expect(fieldListObj11.dataSourceSettings.allowLabelFilter).toBe(null);
            expect(fieldListObj11.dataSourceSettings.allowMemberFilter).toBe(null);
            expect(fieldListObj11.dataSourceSettings.allowValueFilter).toBe(null);
            expect(fieldListObj11.dataSourceSettings.alwaysShowValueHeader).toBe(null);
            expect(fieldListObj11.dataSourceSettings.emptyCellsTextContent).toBe(null);
            expect(fieldListObj11.dataSourceSettings.enableSorting).toBe(null);
            expect(fieldListObj11.dataSourceSettings.excludeFields).toBe(null);
            expect(fieldListObj11.dataSourceSettings.expandAll).toBe(null);
            expect(fieldListObj11.dataSourceSettings.grandTotalsPosition).toBe(null);
            expect(fieldListObj11.dataSourceSettings.mode).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showAggregationOnValueField).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showColumnGrandTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showColumnSubTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showGrandTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showHeaderWhenEmpty).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showRowGrandTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showRowSubTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.showSubTotals).toBe(null);
            expect(fieldListObj11.dataSourceSettings.subTotalsPosition).toBe(null);
            expect(fieldListObj11.dataSourceSettings.type).toBe(null);
            expect(fieldListObj11.dataSourceSettings.valueIndex).toBe(null);

            // Test with undefined value.
            fieldListObj11.dataSourceSettings.allowLabelFilter = undefined;
            fieldListObj11.dataSourceSettings.allowMemberFilter = undefined;
            fieldListObj11.dataSourceSettings.allowValueFilter = undefined;
            fieldListObj11.dataSourceSettings.alwaysShowValueHeader = undefined;
            fieldListObj11.dataSourceSettings.emptyCellsTextContent = undefined;
            fieldListObj11.dataSourceSettings.enableSorting = undefined;
            fieldListObj11.dataSourceSettings.excludeFields = undefined;
            fieldListObj11.dataSourceSettings.expandAll = undefined;
            fieldListObj11.dataSourceSettings.grandTotalsPosition = undefined;
            fieldListObj11.dataSourceSettings.mode = undefined;
            fieldListObj11.dataSourceSettings.showAggregationOnValueField = undefined;
            fieldListObj11.dataSourceSettings.showColumnGrandTotals = undefined;
            fieldListObj11.dataSourceSettings.showColumnSubTotals = undefined;
            fieldListObj11.dataSourceSettings.showGrandTotals = undefined;
            fieldListObj11.dataSourceSettings.showHeaderWhenEmpty = undefined;
            fieldListObj11.dataSourceSettings.showRowGrandTotals = undefined;
            fieldListObj11.dataSourceSettings.showRowSubTotals = undefined;
            fieldListObj11.dataSourceSettings.showSubTotals = undefined;
            fieldListObj11.dataSourceSettings.subTotalsPosition = undefined;
            fieldListObj11.dataSourceSettings.type = undefined;
            fieldListObj11.dataSourceSettings.valueIndex = undefined;
            fieldListObj11.dataBind();
            expect(fieldListObj11.dataSourceSettings.allowLabelFilter).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.allowMemberFilter).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.allowValueFilter).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.alwaysShowValueHeader).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.emptyCellsTextContent).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.enableSorting).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.excludeFields).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.expandAll).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.grandTotalsPosition).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.mode).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showAggregationOnValueField).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showColumnGrandTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showColumnSubTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showGrandTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showHeaderWhenEmpty).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showRowGrandTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showRowSubTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.showSubTotals).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.subTotalsPosition).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.type).toBe(undefined);
            expect(fieldListObj11.dataSourceSettings.valueIndex).toBe(undefined);
        });
    });



});