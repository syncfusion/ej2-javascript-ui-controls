/**
 * Virtual Scrolling with feature matrix
 */

import { IDataSet } from '../../../src/base/engine';
import { PivotView } from '../../../src/pivotview/base/pivotview';
import '../../../node_modules/es6-promise/dist/es6-promise';
import { VirtualScroll } from '../../../src/pivotview/actions/virtualscroll';
import { FieldList, GroupingBar, CalculatedField } from '../../../src/common/index';
import { Button } from '@syncfusion/ej2-buttons';
import { ConditionalFormatting } from '../../../src/common/conditionalformatting/conditional-formatting';
let date1: number;
let date2: number;
let isInit: boolean
let expand: boolean;
let condFormat: boolean;
let drill: boolean;
let calcfield: boolean;
let valSort: boolean;
let labelfil: boolean;
let labelsort: boolean;
let vscroll: boolean = false;
let smeasure: boolean;
let vrow: boolean;
let format:boolean;
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

PivotView.Inject(VirtualScroll, FieldList, GroupingBar, CalculatedField, ConditionalFormatting);
let pivotGridObj: PivotView = new PivotView({
    dataSourceSettings: {
        dataSource: [],
        expandAll: false,
        // valueAxis:'row',
        // formatSettings: [{ name: 'Estimation', format: 'C' }],
        rows: [{ name: 'TaskID' }, { name: 'Status' }],
        columns: [{ name: 'Designation' }],
        values: [{ name: 'Estimation' }, { name: 'Rating' }],
    },
    width: 600,
    height: 300,
    enableVirtualization: true,
    showFieldList: true,
    showGroupingBar: true,
    allowConditionalFormatting:true,
    enableValueSorting: true,
    allowCalculatedField: true,
    dataBound: (args: any): void => {
        let time: number;
        if (date1 && isInit) {
            date2 = new Date().getTime();
            
            if(drill){
                document.getElementById('performanceTime').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
            }
            if(expand){
                document.getElementById('performanceTime2').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
                time = (date2 - date1) / 1000;
            }
            if(condFormat) {
                document.getElementById('performanceTime1').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
            }
            if(valSort) {
                document.getElementById('performanceTime3').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
            }
            if(calcfield) {
                document.getElementById('performanceTime4').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
            }
            if(labelfil) {
                document.getElementById('performanceTime5').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
            }
            if(labelsort) {
                document.getElementById('performanceTime6').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
            }
            if(vscroll) {
                document.getElementById('performanceTime7').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
            }
            if(smeasure) {
                document.getElementById('performanceTime8').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
            }
            if(vrow) {
                document.getElementById('performanceTime9').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
            }
            if(format) {
                document.getElementById('performanceTime10').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
            }
        }
        if(time>1.5){
            document.getElementById('performanceTime2').style.color = 'red';
        }
        isInit = false;
        expand = false;
        valSort = false;
        condFormat = false;
        drill = false;
        labelfil = false;
        labelsort = false;
        vscroll = false;
        calcfield = false;
        load.disabled = true;
        smeasure= false;
        vrow = false;
        format = false;
        // document.getElementById('popup').style.display = 'none';
    },
});
pivotGridObj.appendTo('#PivotView');
let load: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
load.appendTo('#load');
document.getElementById('load').onclick = function () {
    if ((pivotGridObj.dataSourceSettings.dataSource as IDataSet[]).length === 0) {
        pivotGridObj.dataSourceSettings.dataSource = data(1000000) as IDataSet[];
    }
};
let expandall: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
expandall.appendTo('#expandall');
document.getElementById('expandall').onclick = function () {
    isInit = true;
    expand = true;
    pivotGridObj.dataSourceSettings.dataSource = data(500000);
    // pivotGridObj.dataSource.drilledMembers= [{ name: 'TaskID', items: ['1', '2'] }],
    pivotGridObj.dataSourceSettings.expandAll = true;
    date1 = new Date().getTime();
    expandall.disabled= true;
};
let condFortmat: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
condFortmat.appendTo('#condformat');
document.getElementById('condformat').onclick = function () {
    isInit = true;
    condFormat = true;
    pivotGridObj.dataSourceSettings.conditionalFormatSettings =  [
        {
            measure: 'Estimation',
            value1: 0,
            conditions: 'GreaterThan',
            style: {
                backgroundColor: '#80cbc4',
                color: 'black',
                fontFamily: 'Tahoma',
                fontSize: '12px'
            }
        },
        {
            value1: 100,
            measure: 'Rating',
            conditions: 'LessThan',
            style: {
                backgroundColor: '#f48fb1',
                color: 'black',
                fontFamily: 'Tahoma',
                fontSize: '12px'
            }
        }
    ];
    date1 = new Date().getTime();
    condFortmat.disabled = true;
};
let valueSort: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
valueSort.appendTo('#valuesort');
document.getElementById('valuesort').onclick = function () {
    isInit = true;
    valSort = true;
    // pivotGridObj.dataSource.conditionalFormatSettings = [];
    pivotGridObj.dataSourceSettings.valueSortSettings =  {
        headerText: 'Engineer 1##Estimation',
        headerDelimiter: '##',
        sortOrder: 'Descending'
    };
    date1 = new Date().getTime();
    valueSort.disabled = true;
};
let calcField: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
calcField.appendTo('#calcfield');
document.getElementById('calcfield').onclick = function () {
    isInit = true;
    calcfield = true;
    // pivotGridObj.dataSourceSettings.conditionalFormatSettings = [];
    // pivotGridObj.dataSourceSettings.valueSortSettings = {};
    pivotGridObj.dataSourceSettings.values= [{ name: 'Estimation' }, { name: 'Rating' },{ name: 'Total', caption: 'Check' }];
    pivotGridObj.dataSourceSettings.calculatedFieldSettings = [
        {
            name: 'Total',
            formula: '"Sum(Estimation)"+"Sum(Rating)"'
        }];
    date1 = new Date().getTime();
    calcField.disabled = true;
};
let drillMem: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
drillMem.appendTo('#drillmem');
document.getElementById('drillmem').onclick = function () {
    isInit = true;
    drill = true;
    pivotGridObj.dataSourceSettings.drilledMembers= [{ name: 'TaskID', items: ['1', '2'] }],
    // pivotGridObj.dataSourceSettings.expandAll = true;
    date1 = new Date().getTime();
    drillMem.disabled= true;
};
let labFil: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
labFil.appendTo('#labelFil');
document.getElementById('labelFil').onclick = function () {
    isInit = true;
    labelfil = true;
    // pivotGridObj.dataSourceSettings.conditionalFormatSettings = [];
    // pivotGridObj.dataSourceSettings.valueSortSettings = {};
    // pivotGridObj.dataSourceSettings.calculatedFieldSettings = [];
    pivotGridObj.dataSourceSettings.allowLabelFilter = true;
    pivotGridObj.dataSourceSettings.filterSettings= [
        { name: 'Designation', type: 'Label', items: ['Manager', 'Engineer 1'], condition: 'Contains', value1: 'e' }
    ],
    pivotGridObj.dataSourceSettings.sortSettings = [];
    date1 = new Date().getTime();
    labFil.disabled= true;
};
let labSort: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
labSort.appendTo('#labelSort');
document.getElementById('labelSort').onclick = function () {
    isInit = true;
    labelsort = true;
    // pivotGridObj.dataSourceSettings.conditionalFormatSettings = [];
    // pivotGridObj.dataSourceSettings.valueSortSettings = {};
    // pivotGridObj.dataSourceSettings.calculatedFieldSettings = [];
    // pivotGridObj.dataSourceSettings.filterSettings= [];
    pivotGridObj.dataSourceSettings.enableSorting = true;
    pivotGridObj.dataSourceSettings.sortSettings = [{name:'TaskID',order:'Descending'}];
    date1 = new Date().getTime();
    labSort.disabled= true;
};
let scroll: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
scroll.appendTo('#vscroll');
document.getElementById('vscroll').onclick = function () {
    isInit = true;
    vscroll = true;
    pivotGridObj.virtualscrollModule.direction='vertical';
    document.querySelectorAll('.e-movablecontent')[0].scrollTop = 12600;
    date1 = new Date().getTime();
    scroll.disabled= true;
};
let singlemeasure: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
singlemeasure.appendTo('#singlemeasure');
document.getElementById('singlemeasure').onclick = function () {
    isInit = true;
    smeasure = true;
    pivotGridObj.dataSourceSettings.values= [{ name: 'Estimation' }];
    date1 = new Date().getTime();
    singlemeasure.disabled= true;
};
let valuerow: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
valuerow.appendTo('#valuerow');
document.getElementById('valuerow').onclick = function () {
    isInit = true;
    vrow = true;
    pivotGridObj.dataSourceSettings.alwaysShowValueHeader = true;
    pivotGridObj.dataSourceSettings.valueAxis = 'row';
    date1 = new Date().getTime();
    valuerow.disabled= true;
};
let formatting: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
formatting.appendTo('#formatting');
document.getElementById('formatting').onclick = function () {
    isInit = true;
    format = true;
    pivotGridObj.dataSourceSettings.formatSettings = [{ name: 'Estimation', format: 'C' }],
    date1 = new Date().getTime();
    formatting.disabled= true;
};
let groupingBar: Button = new Button({ isPrimary: true, cssClass: 'e-info' });
groupingBar.appendTo('#groupingBar');
document.getElementById('groupingBar').onclick = function () {
    if(pivotGridObj.showGroupingBar === false)
    {
        pivotGridObj.showGroupingBar = true;
    } else {
        pivotGridObj.showGroupingBar = false;
    }
    
};