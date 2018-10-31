/**
 * Pivot Field List Default Sample
 */

import { IDataSet } from '../../src/base/engine';
import { PivotView } from '../../src/pivotview/base/pivotview';
import '../../node_modules/es6-promise/dist/es6-promise';
import { VirtualScroll } from '../../src/pivotview/actions/virtualscroll';


let names: string[] = ['TOM', 'Hawk', 'Jon', 'Chandler', 'Monica', 'Rachel', 'Phoebe', 'Gunther',
    'Ross', 'Geller', 'Joey', 'Bing', 'Tribbiani', 'Janice', 'Bong', 'Perk', 'Green', 'Ken', 'Adams'];
let city: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia', 'Phoenix', 'San Antonio', 'Austin',
    'San Francisco', 'Columbus', 'Washington', 'Portland', 'Oklahoma', 'Las Vegas', 'Virginia', 'St. Louis', 'Birmingham']
let hours: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let rating: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let designation: string[] = ['Manager', 'Engineer 1', 'Engineer 2', 'Developer', 'Tester'];
let status: string[] = ['Completed', 'Open', 'In Progress', 'Review', 'Testing']
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
    return result;
};

PivotView.Inject(VirtualScroll);
let pivotGridObj: PivotView = new PivotView({
    dataSource: {
        data: [],
        expandAll: true,
        formatSettings: [{ name: 'balance', format: 'C' }],
        rows: [{ name: 'TaskID' }],
        columns: [{ name: 'Designation' }],
        values: [{ name: 'Estimation' }, { name: 'Rating' }],
    },
    width: 800,
    height: 300,
    enableVirtualization: true
});
pivotGridObj.appendTo('#PivotView');
document.getElementById('load').onclick = function () {
    if ((pivotGridObj.dataSource.data as IDataSet[]).length === 0) {
        pivotGridObj.dataSource.data = data(100000) as IDataSet[];
    }
};