/**
 * Pivot Field List Default Sample
 */

import { PivotView } from '../../../src/pivotview/base/pivotview';
import { GroupingBar } from '../../../src/common/grouping-bar/grouping-bar';
import { FieldList } from '../../../src/common/actions/field-list';
import { Toolbar } from '../../../src/common/popups/toolbar';
import {
    SaveReportArgs, FetchReportArgs, LoadReportArgs,
    RemoveReportArgs, RenameReportArgs, ToolbarArgs
} from '../../../src/common/base/interface';
import { PDFExport } from '../../../src/pivotview/actions/pdf-export';
import { ExcelExport } from '../../../src/pivotview/actions/excel-export';
import { ConditionalFormatting } from '../../../src/common/conditionalformatting/conditional-formatting';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import { VirtualScroll } from '../../../src/pivotview/actions/virtualscroll';
import '../../../node_modules/es6-promise/dist/es6-promise';

PivotView.Inject(GroupingBar, FieldList, CalculatedField, Toolbar, PDFExport, ExcelExport, ConditionalFormatting, VirtualScroll);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        // catalog: 'FoodMart',
        // cube: 'Sales',
        // url: 'http://olap.flexmonster.com:8080/mondrian/xmla',


        // catalog: 'Adventure Works DW 2008 SE',
        // catalog: 'Adventure Works DW Standard Edition',
        catalog: 'Adventure Works DW 2008R2',
        // catalog: 'Sales',
        // catalog: 'FoodMart',

        cube: 'Adventure Works',
        // cube: 'Sales',

        providerType: 'SSAS',

        // url: 'https://bi.syncfusion.com/olap/msmdpump.dll',
        // url: 'https://olap.flexmonster.com/olap/msmdpump.dll',
        url: 'https://demos.telerik.com/olap/msmdpump.dll',
        // url: 'http://52.4.22.157:8282/icCube/xmla',
        // url: 'http://olap.flexmonster.com:8282/icCube/xmla',
        // url: 'https://demos.devexpress.com/Services/OLAP/msmdpump.dll',
        // url: 'http://olap.flexmonster.com:8080/mondrian/xmla',  
        localeIdentifier: 1033,
        drilledMembers: [
            // {
            //     name: '[Date].[Fiscal]',
            //     items: ['[Date].[Fiscal].[Fiscal Year].&[2002]',
            //         '[Date].[Fiscal].[Fiscal Semester].&[2002]&[2]',
            //         '[Date].[Fiscal].[Fiscal Year].&[2005]']
            // },
            // {
            //     name: '[Date].[Fiscal]',
            //     items: ['[Date].[Fiscal].[Fiscal Year].&[2010]',
            //         '[Date].[Fiscal].[Fiscal Semester].&[2010]&[2]',
            //         '[Date].[Fiscal].[Fiscal Year].&[2012]']
            // },
            {
                name: '[Date].[Fiscal]',
                items: ['[Date].[Fiscal].[Fiscal Year].&[2006]',
                    '[Date].[Fiscal].[Fiscal Semester].&[2006]&[2]',
                    '[Date].[Fiscal].[Fiscal Year].&[2008]']
            },
            // {
            //     name: '[Customer].[Customer Geography]',
            //     items: ['[Customer].[Customer Geography].[Country].&[Australia]',
            //         '[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]'], delimiter: '##'
            // },
            // {
            //     name: '[Geography].[Geography]',
            //     items: ['[Geography].[Geography].[Country].&[Australia]',
            //         '[Geography].[Geography].[State-Province].&[NSW]&[AU]'], delimiter: '##'
            // }
        ],
        allowLabelFilter: true,
        allowValueFilter: true,
        filterSettings: [
            {
                name: '[Customer].[Customer Geography]',
                items: ['[Customer].[Customer Geography].[State-Province].&[NSW]&[AU]',
                    '[Customer].[Customer Geography].[State-Province].&[QLD]&[AU]',
                    '[Customer].[Customer Geography].[Country].&[Germany]',
                    '[Customer].[Customer Geography].[Country].&[France]',
                    '[Customer].[Customer Geography].[Country].&[United Kingdom]',
                    '[Customer].[Customer Geography].[Country].&[United States]'],
                levelCount: 2
            },
            // {
            //     name: '[Date].[Fiscal]',
            //     selectedField: '[Date].[Fiscal].[Fiscal Semester]',
            //     condition: 'Contains',
            //     value1: 'h1 fy 2002',
            //     type: 'Label'
            // },
            // {
            //     name: '[Date].[Fiscal]',
            //     selectedField: '[Date].[Fiscal].[Fiscal Year]',
            //     condition: 'Contains',
            //     value1: '2002',
            //     type: 'Label'
            // },
            // {
            //     name: '[Date].[Fiscal]',
            //     selectedField: '[Date].[Fiscal].[Fiscal Semester]',
            //     condition: 'Contains',
            //     value1: 'h2 fy 2010',
            //     type: 'Label'
            // },
            // {
            //     name: '[Date].[Fiscal]',
            //     selectedField: '[Date].[Fiscal].[Fiscal Year]',
            //     condition: 'Contains',
            //     value1: '2010',
            //     type: 'Label'
            // },
            // { name: '[Employee].[Employee Department]', items: ['[Employee].[Employee Department].[Title].&[Control Specialist]'], levelCount: 3 },
            // { name: '[Date].[Fiscal]', items: ['[Date].[Fiscal].[Fiscal Quarter].&[2012]&[4]', '[Date].[Fiscal].[Fiscal Year].&[2010]'], levelCount: 3 },
        ],
        calculatedFieldSettings: [
            {
                name: 'BikeAndComponents',
                formula: '([Product].[Product Categories].[Category].[Bikes] + [Product].[Product Categories].[Category].[Components] )',
                hierarchyUniqueName: '[Product].[Product Categories]',
                formatString: 'Standard'
            },
            {
                name: 'Order on Discount',
                formula: '[Measures].[Order Quantity] + ([Measures].[Order Quantity] * 0.10)',
                formatString: 'Currency'
            }
        ],
        rows: [
            //     // { name: '[Customers].[Geography]' },
            //     { name: '[Geography].[Geography]', caption: 'Geography' },
            { name: '[Date].[Fiscal]', caption: 'Date Fiscal' },
            // { name: 'BikeAndComponents', caption: 'Bike And Components', isCalculatedField: true }
            // { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
            // { name: '[Employee].[Employee Department]', caption: 'Employee Department' }
            //     // { name: '[Product].[Category]', caption: 'Product Category' },
            //     // { name: '[Product].[Subcategory]' },

        ],
        columns: [
            //     // { name: '[Product].[Product]'}
            // { name: '[Product].[Category]', caption: 'Product Category' },
            { name: '[Customer].[Customer Geography]', caption: 'Customer Geography' },
            // { name: '[Geography].[Geography]', caption: 'Geography' },
            //     // { name: '[Department].[Departments]', caption: 'Departments' },
            { name: '[Measures]', caption: 'Measures' },
            //     // { name: '[Core Product Group]', isNamedSet: true },
            //     // { name: '[Ship Date].[Calendar Year]' },
            //     // { name: '[Ship Date].[Month of Year]' },
        ],
        values: [
            //     // { name: '[Measures].[Amount]' },
            { name: '[Measures].[Customer Count]', caption: 'Customer Count' },
            // { name: '[Measures].[Reseller Order Count]', caption: 'Reseller Order Count' },
            //     { name: '[Measures].[Discount Amount]', caption: 'Discount Amount' }
            //     // { name: '[Measures].[Product Gross Profit Margin Status]', caption: 'Profit Margin Status' },
            { name: '[Measures].[Internet Sales Amount]', caption: 'Internet Sales Amount' },
            // { name: 'Order on Discount', caption: 'Order on Discount', isCalculatedField: true }
        ],
        filters: [
            // { name: '[Employee].[Employee Department]', caption: 'Employee Department' },
            // { name: '[Customer].[Customer]', caption: 'Customer' }
        ],
        // formatSettings: [ { name: '[Measures].[Customer Count]', format: 'P' }],
        valueAxis: 'column',
        valueSortSettings: {
            sortOrder: 'Descending',
            measure: '[Measures].[Internet Sales Amount]'
        }
    },
    enableVirtualization: false,
    saveReport: function (args: SaveReportArgs): void {
        let reports: SaveReportArgs[] = [];
        let isSaved: boolean = false;
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reports = JSON.parse(localStorage.pivotviewReports);
        }
        if (args.report && args.reportName && args.reportName !== '') {
            reports.map(function (item: any): any {
                if (args.reportName === item.reportName) {
                    item.report = args.report; isSaved = true;
                }
            });
            if (!isSaved) {
                reports.push(args);
            }
            localStorage.pivotviewReports = JSON.stringify(reports);
        }
    },
    fetchReport: function (args: FetchReportArgs): void {
        let reportCollection: string[] = [];
        let reeportList: string[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection.map(function (item: any): void { reeportList.push(item.reportName); });
        args.reportName = reeportList;
    },
    loadReport: function (args: LoadReportArgs): void {
        let reportCollection: string[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection.map(function (item: any): void {
            if (args.reportName === item.reportName) {
                args.report = item.report;
            }
        });
        if (args.report) {
            pivotGridObj.dataSourceSettings = JSON.parse(args.report).dataSourceSettings;
        }
    },
    removeReport: function (args: RemoveReportArgs): void {
        let reportCollection: any[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        for (let i: number = 0; i < reportCollection.length; i++) {
            if (reportCollection[i].reportName === args.reportName) {
                reportCollection.splice(i, 1);
            }
        }
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            localStorage.pivotviewReports = JSON.stringify(reportCollection);
        }
    },
    renameReport: function (args: RenameReportArgs): void {
        let reportCollection: string[] = [];
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            reportCollection = JSON.parse(localStorage.pivotviewReports);
        }
        reportCollection.map(function (item: any): any { if (args.reportName === item.reportName) { item.reportName = args.rename; } });
        if (localStorage.pivotviewReports && localStorage.pivotviewReports !== "") {
            localStorage.pivotviewReports = JSON.stringify(reportCollection);
        }
    },
    toolbarRender: function (args: ToolbarArgs): void {
        args.customToolbar.splice(6, 0, {
            type: 'Separator'
        });
        args.customToolbar.splice(9, 0, {
            type: 'Separator'
        });
    },
    newReport: function (): void {
        pivotGridObj.setProperties({ dataSourceSettings: { columns: [], rows: [], values: [], filters: [] } }, false);
    },
    displayOption: { view: 'Both' },
    chartSettings: {
        value: 'Amount', enableExport: true, chartSeries: { type: 'Column', animation: { enable: false } }, enableMultiAxis: false,
    },
    toolbar: ['New', 'Save', 'SaveAs', 'Rename', 'Remove', 'Load',
        'Grid', 'Chart', 'MDX', 'Export', 'SubTotal', 'GrandTotal', 'ConditionalFormatting', 'FieldList'],
    allowExcelExport: true,
    allowConditionalFormatting: true,
    allowPdfExport: true,
    showToolbar: true,
    allowCalculatedField: true,
    showFieldList: true,
    showGroupingBar: true,
    height: '500px',
});

pivotGridObj.appendTo('#PivotView');