/**
 * Pivot Field List Default Sample
 */

import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { Uploader } from '@syncfusion/ej2-inputs';

//335 or 315
PivotView.Inject(FieldList, CalculatedField, GroupingBar);

let uploadObj: Uploader = new Uploader({
});
uploadObj.appendTo('#fileupload');

const input = document.querySelector('input[type="file"]');
input.addEventListener('change', function (e: Event) {
    const reader: FileReader = new FileReader();
    reader.onload = function () {
        const lines: string[][] = (reader.result as string).split('\n').map(function (line) {
            return line.split(',');
        });
        let pivotGridObj: PivotView = new PivotView({
            dataSourceSettings: {
                dataSource: lines,
                type: 'CSV',
                expandAll: true,
                enableSorting: true,
                allowLabelFilter: true,
                allowValueFilter: true,
                rows: [{ name: 'Category' }, { name: 'Color' }],
                columns: [{ name: 'Business Type' }, { name: 'Country' }],
                values: [{ name: 'Price' }, { name: 'Quantity' }],
                filters: [],
                calculatedFieldSettings: [{ name: 'ActualPrice', formula: '"Sum(Price)"-"Sum(Discount)"' }],
                groupSettings: [
                    { name: 'Category', type: 'Custom', customGroups: [{ groupName: 'UnknownTypes', items: ['Accessories', 'Components', 'Clothing'] }] }
                ],
                fieldMapping: [
                    { name: 'Category', dataType: 'string' },
                    { name: 'Size', dataType: 'string', showSortIcon: false },
                    { name: 'Color', dataType: 'string' },
                    { name: 'Destination', dataType: 'string', showFilterIcon: false },
                    { name: 'Business Type', dataType: 'string' },
                    { name: 'Country', dataType: 'string' },
                    { name: 'Price', dataType: 'number' },
                    { name: 'Quantity', dataType: 'number' },
                    { name: 'Discount', dataType: 'number', allowDragAndDrop: false }
                ]
            },
            editSettings: { allowAdding: true, allowDeleting: true, allowEditing: true, allowCommandColumns: false, mode: 'Normal', showConfirmDialog: false, showDeleteConfirmDialog: false },
            showGroupingBar: true,
            allowCalculatedField: true,
            showFieldList: true,
            width: 1000,
        });
        pivotGridObj.appendTo('#PivotView');
    };
    reader.readAsText((input as any).files[0]);
});