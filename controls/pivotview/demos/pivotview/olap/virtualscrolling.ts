import { PivotView } from '../../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../../src/common/actions/field-list';
import { VirtualScroll } from '../../../src/pivotview/actions/virtualscroll';

PivotView.Inject(GroupingBar, FieldList, VirtualScroll);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        catalog: 'Adventure Works DW 2008R2',
        cube: 'Adventure Works',
        providerType: 'SSAS',
        url: 'https://bi.syncfusion.com/olap/msmdpump.dll',
        localeIdentifier: 1033,
        rows: [
            { name: '[Customer].[Customer]', caption: 'Customer' },
        ],
        columns: [
            { name: '[Employee].[Gender]', caption: 'Gender' },
            { name: '[Measures]', caption: 'Measures' },
        ],
        values: [
            { name: '[Measures].[Customer Count]', caption: 'Customer Count' },
            { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' },
        ],
        filters: [],
    },
    enableVirtualization: true,
    showGroupingBar: true,
    showFieldList: true,
    width: 800,
    height: 360
});

pivotGridObj.appendTo('#PivotView');