/**
 * Pivot Context Menu Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { pivot_dataset, pivot_smalldata } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { MenuEventArgs,MenuItemModel,
    ContextMenuModel,  
    BeforeOpenCloseMenuEventArgs} from '@syncfusion/ej2-navigations';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { Button } from '@syncfusion/ej2-buttons';

//335 or 315
PivotView.Inject(FieldList, CalculatedField, GroupingBar);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: pivot_dataset as IDataSet[],
        enableSorting: true,
        allowLabelFilter: true,
        allowValueFilter: true,
        formatSettings: [ { name: 'balance', format: 'C' },{ name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
        filterSettings: [
            { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
            { name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' },
            { name: 'eyeColor', type: 'Exclude', items: ['blue'] }
        ],
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'quantity' }],
        filters: [],
        // rows: [{ name: 'Product', caption: 'Items' }, { name: 'Country' }],
        // columns: [{ name: 'Date', caption: 'Year' }],
        // values: [{ name: 'Amount' }, { name: 'Quantity' }],
    },
    gridSettings:{
        contextMenuItems:['Aggregate','CalculatedField','Drillthrough','Excel Export','Pdf Export','Csv Export','Expand','Collapse',
        'Sort Ascending','Sort Descending',{ separator: true, target: 'td.e-valuescontent,th.e-columnsheader,td.e-rowsheader' },{text:'Tooltip',id:'tooltip',target:'td.e-valuescontent',
        items:[{text:'Show',id:'show'},{text:'Hide',id:'hide',}]},{text:'Exit',id:'close', target:'td.e-valuescontent,th.e-columnsheader,td.e-rowsheader'} as any],
        contextMenuClick(args:MenuEventArgs):void {
            if(args.item.id==='show'){
                pivotGridObj.showTooltip = true;
            } else if(args.item.id==='hide'){
                pivotGridObj.showTooltip = false;
            }
        }
    },
    allowCalculatedField: true,
    showFieldList: false,
    allowExcelExport:true,
    allowPdfExport:true,
    allowDrillThrough:true,
    showGroupingBar: false,
    showTooltip:false,
    showValuesButton: true,
    editSettings:{allowEditing:true,mode:'Normal'},
    enableValueSorting:true,
    //enableRtl:true,
    width: 1000,
});
pivotGridObj.appendTo('#PivotView');