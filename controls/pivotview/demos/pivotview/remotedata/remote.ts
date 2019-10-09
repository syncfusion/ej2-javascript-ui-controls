/**
 * Pivot Field List Default Sample
 */
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { DataManager, ODataAdaptor, JsonAdaptor, ODataV4Adaptor, UrlAdaptor, WebApiAdaptor } from '@syncfusion/ej2-data';
import { DataSourceSettingsModel } from '../../../src/pivotview/model/datasourcesettings-model';

//335 or 315
PivotView.Inject(FieldList);

let oData: DataManager = new DataManager({
    url: 'https://js.syncfusion.com/demos/ejServices/Wcf/Northwind.svc/Orders/?$top=7',
    adaptor: new ODataAdaptor
});
let jsonData: DataManager = new DataManager({
    json: pivot_dataset,
    adaptor: new JsonAdaptor
});
let apiData: DataManager = new DataManager({
    url: 'http://controller.com/api',
    adaptor: new WebApiAdaptor
});
let v4Data: DataManager = new DataManager({
    url: 'http://services.odata.org/V4/Northwind/Northwind.svc/Orders/',
    adaptor: new ODataV4Adaptor
});

let oDataReport: DataSourceSettingsModel = {
    dataSource: oData as DataManager,
    expandAll: true,
    rows: [{ name: 'OrderID' }, { name: 'CustomerID' }],
    columns: [{ name: 'OrderDate' }, { name: 'ShipCity' }],
    values: [{ name: 'Freight' }],
    filters: [],
};
let jsonReport: DataSourceSettingsModel = {
    dataSource: jsonData as DataManager,
    expandAll: true,
    rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
    columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
    values: [{ name: 'balance' }, { name: 'quantity' }],
    filters: [],
};
let apiReport: DataSourceSettingsModel = {
    dataSource: apiData as DataManager,
    expandAll: true,
    rows: [{ name: 'OrderID' }, { name: 'CustomerID' }],
    columns: [{ name: 'OrderDate' }],
    values: [{ name: 'Freight' }],
    filters: [],
};
let v4Report: DataSourceSettingsModel = {
    dataSource: v4Data as DataManager,
    expandAll: false,
    rows: [{ name: 'OrderID' }, { name: 'CustomerID' }],
    columns: [{ name: 'ShipCity' }],
    values: [{ name: 'Freight' }],
    filters: [],
};


let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: oDataReport,
    showFieldList: true,
    height: 350,
    width: 1200
});
pivotGridObj.appendTo('#PivotView');
document.getElementById('json').onclick = function () {
    pivotGridObj.dataSourceSettings = jsonReport;
};
document.getElementById('webapi').onclick = function () {
    pivotGridObj.dataSourceSettings = apiReport;
};
document.getElementById('odata').onclick = function () {
    pivotGridObj.dataSourceSettings = oDataReport;
};
document.getElementById('v4').onclick = function () {
    pivotGridObj.dataSourceSettings = v4Report;
};