/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../../src/base/engine';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { VirtualScroll } from '../../../src/pivotview/actions/virtualscroll';
import { FieldList, GroupingBar, CalculatedField } from '../../../src/common/index';


let names: string[] = ['TOM', 'Hawk', 'Jon', 'Chandler', 'Monica', 'Rachel', 'Phoebe', 'Gunther',
    'Ross', 'Geller', 'Joey', 'Bing', 'Tribbiani', 'Janice', 'Bong', 'Perk', 'Green', 'Ken', 'Adams'];
let city: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia', 'Phoenix', 'San Antonio', 'Austin',
    'San Francisco', 'Columbus', 'Washington', 'Portland', 'Oklahoma', 'Las Vegas', 'Virginia', 'St. Louis', 'Birmingham']
let hours: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let rating: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let designation: string[] = ['Manager', 'Engineer 1', 'Engineer 2', 'Developer', 'Tester'];
let status: string[] = ['Completed', 'Open', 'In Progress', 'Review', 'Testing'];
let time: number = 0;
let data: Function = (count: number) => {
    let result: Object[] = [];
    for (let i = 0; i < count; i++) {
        result.push({
            TaskID: i + 1,
            Engineer: names[Math.round(Math.random() * names.length)] || names[0],
            City: names[Math.round(Math.random() * city.length)] || city[0],
            Designation: designation[Math.round(Math.random() * designation.length)] || designation[0],
            Estimation: hours[Math.round(Math.random() * hours.length)] || hours[0],
            Rating: hours[Math.round(Math.random() * rating.length)] || rating[0],
            Status: status[Math.round(Math.random() * status.length)] || status[0]
        });
    }
    time = new Date().getTime();
    return result;
};

PivotView.Inject(VirtualScroll, FieldList, GroupingBar, CalculatedField);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: [],
        expandAll: false,
        formatSettings: [{ name: 'Estimation', format: 'C' }],
        rows: [{ name: 'TaskID' }, { name: 'Status' }],
        columns: [{ name: 'Designation' }],
        values: [{ name: 'Estimation' }, { name: 'Rating' }],        
    },
    width: 800,
    height: 300,
    enableVirtualization: true,
    showFieldList: true,
    showGroupingBar: true,
    enableValueSorting: true,
    allowCalculatedField: true,    
    dataBound: function () {
        if (!(pivotGridObj as any).isEmptyGrid) {
            console.log((new Date().getTime() - time) / 1000);
            time = new Date().getTime();  
        }
    }
});
pivotGridObj.appendTo('#PivotView');
document.getElementById('load').onclick = function () {
    if ((pivotGridObj.dataSourceSettings.dataSource as IDataSet[]).length === 0) {
        pivotGridObj.dataSourceSettings.dataSource = data(1000000) as IDataSet[];
    }
};