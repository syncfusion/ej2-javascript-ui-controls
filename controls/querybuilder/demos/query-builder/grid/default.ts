/**
 * QueryBuilder with grid Sample
 */
import { QueryBuilder , ColumnsModel, RuleModel} from './../../../src/query-builder/index';
import { DataManager, Query, ReturnOption, Predicate } from '@syncfusion/ej2-data';
import { orderData } from '../data-source';
import { Grid , Selection } from '@syncfusion/ej2-grids';
Grid.Inject(Selection);
let columnData: ColumnsModel [] = [
    { field: 'OrderID', label: 'Order ID', type: 'number'},
    { field: 'CustomerID', label: 'Customer Name', type: 'string' },
    { field: 'OrderDate', label: 'Order Date', type: 'date' },
    { field: 'Freight', label: 'Freight', type: 'number' },
    { field: 'ShippedDate', label: 'Shipped Date', type: 'date' },
    { field: 'ShipCountry', label: 'Ship Country', type: 'string' }
];
let importRules: RuleModel = {
    'condition': 'and',
    'rules': [{
        'label': 'Order ID',
        'field': 'OrderID',
        'type': 'number',
        'operator': 'equal',
        'value': 10248
    },
    {
        'condition': 'or',
        'rules': [{
            'label': 'Customer ID',
                'field': 'CustomerID',
                'type': 'string',
                'operator': 'equal',
                'value': 'Yang Wang'
        }]
    }]
    };

let qryBldrObj: QueryBuilder = new QueryBuilder({  width: '800px',  dataSource: orderData, columns: columnData, rule: importRules });
qryBldrObj.appendTo('#querybuilder');
let data: Object = new DataManager(orderData as JSON[]).executeLocal(new Query().take(20));
let grid: Grid = new Grid(
    {
        dataSource: data,
        width: '800px',
        columns: [
            { field: 'OrderID', headerText: 'Order ID', width: 50, textAlign: 'Right' },
            { field: 'CustomerID', headerText: 'Customer Name', width: 80 },
            { field: 'OrderDate', headerText: 'Order Date', width: 40, format: 'yMd', textAlign: 'Right' },
            { field: 'Freight', width: 50, format: 'C2', textAlign: 'Right' },
            { field: 'ShippedDate', headerText: 'Shipped Date', width: 50, format: 'yMd', textAlign: 'Right' },
            { field: 'ShipCountry', headerText: 'Ship Country', width: 50 }
        ]
    });
grid.appendTo('#Grid');


document.getElementById('apply').onclick = (): void => {
    let fltrDataSource: Object [] = [];
    let dataManagerQuery : Query = getDataMangerQuery(qryBldrObj.rule);
    function getDataMangerQuery(rule: RuleModel): Query {
        let predicate: Predicate = qryBldrObj.getPredicate(rule);
        let query: Query;
        query = new Query().select(['OrderID', 'CustomerID', 'OrderDate', 'Freight', 'ShippedDate', 'ShipCountry' ])
        .where(predicate).take(20);
        return query;
    }
    new DataManager(orderData)
    .executeQuery(dataManagerQuery)
    .then((e: ReturnOption) => {  (<Object[]>e.result).forEach((data: Object) => {
            fltrDataSource.push(data);
        });
    });
    setTimeout(function(){ grid.dataSource = fltrDataSource; grid.refresh();}, 1000);
};