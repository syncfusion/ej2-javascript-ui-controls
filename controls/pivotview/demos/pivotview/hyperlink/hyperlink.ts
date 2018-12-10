/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { CellClickEventArgs } from '../../../src/common/base/interface';
import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { Dialog } from '@syncfusion/ej2-popups';

//335 or 315
let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: pivot_dataset as IDataSet[],
        expandAll: true,
        enableSorting: true,
        allowLabelFilter: true,
        allowValueFilter: true,
        sortSettings: [{ name: 'company', order: 'Descending' }],
        formatSettings: [{ name: 'balance', format: 'C' }, { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
        drilledMembers: [{ name: 'product', items: ['Bike', 'Car', 'Jet'] }, { name: 'gender', items: ['male'] }],
        filterSettings: [{ name: 'eyeColor', type: 'Exclude', items: ['blue'] }],
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'quantity' }],
        filters: [],
    },
    hyperlinkCellClick: (args: CellClickEventArgs) => {
        let cell: string = '';
        if (args.currentCell.className.indexOf('e-stot') > -1 || args.currentCell.className.indexOf('e-gtot') > -1) {
            cell += 'Summary '
        }
        if (args.currentCell.className.indexOf('e-rowsheader') > -1) {
            cell += 'Row Header '
        } else if (args.currentCell.className.indexOf('e-columnsheader') > -1) {
            cell += 'Column Header '
        } else if (args.currentCell.className.indexOf('e-valuescontent') > -1) {
            cell += 'Value '
        }
        // window.alert(cell + 'CellClick event is fired');
        dialogObj.content = cell + 'CellClick event is fired';
        dialogObj.dataBind();
        dialogObj.show();
    },
    width: 1000,
});
pivotGridObj.appendTo('#PivotView');

let listObj: DropDownList = new DropDownList({
    placeholder: 'Select a hyperlink option',
    popupHeight: '200px',
    value: 'novalue',
    change: (args: ChangeEventArgs) => {
        if (args.value === 'allcells') {
            pivotGridObj.hyperlinkSettings = {
                showHyperlink: true,
                showRowHeaderHyperlink: false,
                showColumnHeaderHyperlink: false,
                showValueCellHyperlink: false,
                showSummaryCellHyperlink: false,
                headerText: undefined,
                conditionalSettings: []
            };
        } else if (args.value === 'rowheader') {
            pivotGridObj.hyperlinkSettings = {
                showHyperlink: false,
                showRowHeaderHyperlink: true,
                showColumnHeaderHyperlink: false,
                showValueCellHyperlink: false,
                showSummaryCellHyperlink: false,
                headerText: undefined,
                conditionalSettings: []
            };
        } else if (args.value === 'columnheader') {
            pivotGridObj.hyperlinkSettings = {
                showHyperlink: false,
                showRowHeaderHyperlink: false,
                showColumnHeaderHyperlink: true,
                showValueCellHyperlink: false,
                showSummaryCellHyperlink: false,
                headerText: undefined,
                conditionalSettings: []
            };
        } else if (args.value === 'valuecells') {
            pivotGridObj.hyperlinkSettings = {
                showHyperlink: false,
                showRowHeaderHyperlink: false,
                showColumnHeaderHyperlink: false,
                showValueCellHyperlink: true,
                showSummaryCellHyperlink: false,
                headerText: undefined,
                conditionalSettings: []
            };
        } else if (args.value === 'summarycells') {
            pivotGridObj.hyperlinkSettings = {
                showHyperlink: false,
                showRowHeaderHyperlink: false,
                showColumnHeaderHyperlink: false,
                showValueCellHyperlink: false,
                showSummaryCellHyperlink: true,
                headerText: undefined,
                conditionalSettings: []
            };
        } else if (args.value === 'measurebasedconditioanl') {
            pivotGridObj.hyperlinkSettings = {
                showHyperlink: false,
                showRowHeaderHyperlink: false,
                showColumnHeaderHyperlink: false,
                showValueCellHyperlink: false,
                showSummaryCellHyperlink: false,
                headerText: undefined,
                conditionalSettings: [
                    {
                        measure: 'balance',
                        conditions: 'LessThan',
                        value1: 10000
                    }
                ]
            };
        } else if (args.value === 'labelbasedconditioanl') {
            pivotGridObj.hyperlinkSettings = {
                showHyperlink: false,
                showRowHeaderHyperlink: false,
                showColumnHeaderHyperlink: false,
                showValueCellHyperlink: false,
                showSummaryCellHyperlink: false,
                headerText: undefined,
                conditionalSettings: [
                    {
                        label: 'Tempo',
                        conditions: 'LessThan',
                        value1: 1000,
                        value2: 550
                    }
                ]
            };
        } else if (args.value === 'specificrow') {
            pivotGridObj.hyperlinkSettings = {
                showHyperlink: false,
                showRowHeaderHyperlink: false,
                showColumnHeaderHyperlink: false,
                showValueCellHyperlink: false,
                showSummaryCellHyperlink: false,
                headerText: 'Car',
                conditionalSettings: []
            };
        } else if (args.value === 'specificcolumn') {
            pivotGridObj.hyperlinkSettings = {
                showHyperlink: false,
                showRowHeaderHyperlink: false,
                showColumnHeaderHyperlink: false,
                showValueCellHyperlink: false,
                showSummaryCellHyperlink: false,
                headerText: 'female.false.balance',
                conditionalSettings: []
            };
        }
    },
    width: '250px'
});
listObj.appendTo('#hyper-link');

let dialogObj: Dialog = new Dialog({
    target: document.getElementById('container'),
    animationSettings: { effect: 'Fade' },
    isModal: true,
    visible: false,
    showCloseIcon: true,
    closeOnEscape: true,
    overlayClick: (): void => {
        dialogObj.hide();
    },
    width: '350px',
    height: '150px',
    buttons: [{
        click: () => { dialogObj.hide(); },
        buttonModel: { content: 'Close', isPrimary: true }
    }]
});
dialogObj.appendTo('#EventDialog');