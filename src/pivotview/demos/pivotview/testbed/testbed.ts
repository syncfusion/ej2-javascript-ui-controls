/**
 * Pivot Field List Default Sample
 */
import { NumericTextBox, ChangeEventArgs as NumericEventArgs } from '@syncfusion/ej2-inputs';
import { MaskedTextBox, MaskChangeEventArgs } from '@syncfusion/ej2-inputs';
import { DropDownList, MultiSelect, ChangeEventArgs, SelectEventArgs, RemoveEventArgs, PopupEventArgs, CheckBoxSelection } from '@syncfusion/ej2-dropdowns';
//import { DropDownList, ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { CheckBox, ChangeEventArgs as CheckChange } from '@syncfusion/ej2-buttons';
//import {VirtualScroll} from '../../demos/pivotview/virtualscrolling';
import {Button} from '@syncfusion/ej2-buttons';
import { IDataSet, IDataOptions } from '../../../src/base/engine';
import { pivot_dataset } from '../../../spec/base/datasource.spec';
import { PivotView   } from '../../../src/pivotview/base/pivotview';
import { FieldList } from '../../../src/common/actions/field-list';
import { CalculatedField } from '../../../src/common/calculatedfield/calculated-field';
import{ConditionalFormatting} from'../../../src/common/conditionalformatting/conditional-formatting';
import{GroupingBar} from'../../../src/common/grouping-bar/grouping-bar';
import{FilterModel} from '../../../src/pivotview/model/dataSource-model';
//import{FilterModel} from '../../pivotview/'
import { Operators, SummaryTypes } from '../../../src/base';
import { enableRipple } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';

//import { VirtualScroll } from '../../demos/pivotview/virtualscrolling';
import { VirtualScroll } from '../../../src/pivotview/actions/virtualscroll';
import { DataSource } from '../../../src/pivotview/model/dataSource';

enableRipple(false);
//335 or 315
PivotView.Inject(FieldList, CalculatedField);
PivotView.Inject(ConditionalFormatting);
PivotView.Inject(GroupingBar);
PivotView.Inject(VirtualScroll);
PivotView.Inject(MultiSelect);
MultiSelect.Inject(CheckBoxSelection);

//virtualscroll
let customername: string[] = ['TOM', 'Hawk', 'Jon', 'Chandler', 'Monica', 'Rachel', 'Phoebe', 'Gunther',
    'Ross', 'Geller', 'Joey', 'Bing', 'Tribbiani', 'Janice', 'Bong', 'Perk', 'Green', 'Ken', 'Adams'];
let city: string[] = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Philadelphia', 'Phoenix', 'San Antonio', 'Austin',
    'San Francisco', 'Columbus', 'Washington', 'Portland', 'Oklahoma', 'Las Vegas', 'Virginia', 'St. Louis', 'Birmingham'];

let date1: number;
let date2: number;
let isInit: boolean;
let dt: number = 0;

// let pivotvirtualGridObj: PivotView = new PivotView({
//     dataSource: {
//         data: [],
//         enableSorting: false,
    
//         expandAll: true,
//         formatSettings: [{ name: 'Price', format: 'C0' }],
//         rows: [{ name: 'ProductID' }],
//         columns: [{ name: 'Year' }],
//         values: [{ name: 'Price', caption: 'Unit Price' }, { name: 'Sold', caption: 'Unit Sold' }],
//     },
//     width: 860,
//     height: 300,
//     enableVirtualization: true,
//     gridSettings: { columnWidth: 140 },
//     dataBound: (args: any): void => {
//         if (date1 && isInit) {
//             date2 = new Date().getTime();
//             document.getElementById('performanceTime').innerHTML = 'Time Taken: ' + (date2 - date1) / 1000 + ' sec';
//         }
//         isInit = false;
//         virtualBtn.disabled = false;
//         document.getElementById('popup').style.display = 'none';
//     },
// });
// pivotvirtualGridObj.appendTo('#PivotView');



//let filterCollections: { [key: string]: FilterModel } = {};

let fieldCollections: { [key: string]: FilterModel } = {};
let fieldmemCollections: { [key: string]: { [key: string]: Object }[] } = {};
let filterCollections: { [key: string]: FilterModel } = {};
let isInitial: boolean = true;
let type: string[] = ['Include', 'Exclude'];
let values: { [key: string]: Object }[] = [];
let fieldsmem: string[] = ['product', 'eyeColor', 'gender'];

let measures: { [key: string]: Object }[] = [
    { value: 'balance', text: 'Balance' },
    { value: 'quantity',text: 'Quantity' }
    ];

    let dialogObj: Dialog = new Dialog({
        header: 'Pivot Grid Features',
        target: document.getElementById('target'),
        animationSettings: { effect: 'Zoom' },
        showCloseIcon: true,
        width: '870',
        height:'auto',
        zIndex:100,
        visible:false,
        position:{Y:'Top'},
        closeOnEscape: true,
        allowDragging: true,
        open: dialogOpen,
        close: dialogClose
    });
    dialogObj.appendTo('#defaultDialog');
    let buttondialog: Button = new Button({isPrimary:true});
    buttondialog.appendTo('#dialogBtn');
    
    document.getElementById('dialogBtn').onclick = (): void => {
        dialogObj.show();
      
    };
    
    function dialogClose(): void {
        document.getElementById('dialogBtn').style.display = 'block';
        
    }
    
    // 'Open' Button will be hidden, if Dialog is opened
    function dialogOpen(): void {
        document.getElementById('dialogBtn').style.display = 'none';
        
    }




// let pivotGridObj: PivotView = new PivotView({
//     dataSource: {
//         data: pivot_dataset as IDataSet[],
    
//         expandAll: false,
//         enableSorting: true,
//         allowLabelFilter: true,
//         allowValueFilter: true,
//         //sortSettings: [{ name: 'company', order: 'Descending' }],
//         formatSettings: [{ name: 'balance', format: 'C' },
//         { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
//         drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
//         // filterSettings: [
//         //     { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
//         //     { name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' },
//         //     // { name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'Contains', value1: 'e', value2: 'v' },
//         //     // { name: 'product', type: 'Value', condition: 'GreaterThan', value1: '2000', value2: '800', measure: 'quantity' },
//         //     // { name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '600', value2: '800', measure: 'quantity' },
//         //     //{ name: 'eyeColor', type: 'Exclude', items: ['blue'] }
//         // ],
//         rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
//         // rows: [{ name: 'date', caption: 'TimeLine' }],
//         columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
//         values: [{ name: 'balance' }, { name: 'quantity' }],
//         filters: [],
//         conditionalFormatSettings: [
//             {
//                 measure: 'balance',
//                 value1: 100,
//                 conditions: 'Less Than',
//                 style: {
//                     backgroundColor: '#80cbc4',
//                     color: 'black',
//                     fontFamily: 'Tahoma',
//                     fontSize: '12px'
//                 }
//             },
//             {
//                 value1: 50,
//                 value2: 300,
//                 measure: 'quantity',
//                 conditions: 'Between',
//                 style: {
//                     backgroundColor: '#f48fb1',
//                     color: 'black',
//                     fontFamily: 'Tahoma',
//                     fontSize: '12px'
//                 }
//             }
//         ]
//     },
    
// // dataBound: (args: any): void => {
// //     if (isInitial) {
// //         //To fill the members for each fields into the object fieldCollections. 
// //         let fieldCnt: number = fieldsmem.length - 1;
// //         while (fieldCnt > -1) {
// //             let members: string[] = Object.keys(pivotGridObj.engineModule.fieldList[fieldsmem[fieldCnt]].members);
// //             let memberCnt: number = members.length - 1;
// //             let memberColl: { [key: string]: Object }[] = [];
// //             while (memberCnt > -1) {
// //                 memberColl.push({ Member: members[memberCnt], Checked: members[memberCnt] + '_' + false });
// //                 memberCnt--;
// //             }
// //             fieldmemCollections[fieldsmem[fieldCnt]] = memberColl;
// //             fieldCnt--;
// //         }
// //         values = fieldmemCollections[fieldsmem[0]];
// //         isInitial = false;

// //    }
    
// //     for (let field of pivotGridObj.dataSource.filterSettings) {
// //         filterCollections[field.name] = field;
// //     }

// // },

//     //enableVirtualization:true,
//     allowCalculatedField: true,
//     allowConditionalFormatting:true,
//     showFieldList: true,
//     showGroupingBar:true,
//     allowExcelExport:true,
//     enableValueSorting:true,
//     showValuesButton:true,
//     allowPdfExport:true,
//     height: 280,
// });
// pivotGridObj.appendTo('#PivotView');

let pivotGridObj:PivotView= new PivotView({
    dataSource:{
        data: pivot_dataset as IDataSet[],
        expandAll:false,
        enableSorting:true,
        allowLabelFilter:true,
        allowValueFilter:true,
        formatSettings: [{name:'balance',format:'C'},{name:'date', format:'dd/MM/yyyy-hh-mm',type:'date'}],
        drilledMembers:[{name:'product',items:['Bike','Car']},{name:'gender',items:['male']}],
        rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
        // rows: [{ name: 'date', caption: 'TimeLine' }],
        columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
        values: [{ name: 'balance' }, { name: 'quantity' }],
        filters: [],
        conditionalFormatSettings:[
            {
                measure:'balance',
                value1:100,
                conditions:'LessThan',
                style:{
                    backgroundColor:'#80cbc4',
                    color:'black',
                    fontFamily:'Tahoma',
                    fontSize:'12px'

                }
            },
            {
                measure:'quantity',
                value1:50,
                value2:300,
                conditions:'Between',
                style:{
                    backgroundColor:'#f48fb1',
                    color:'black',
                    fontFamily:'Tahoma',
                    fontSize:'12px'
                }
            }
        ]

    },
    dataBound:(args:any):void=>{
        if(isInitial)
        {
            let fieldCnt:number =fieldsmem.length-1;
            while(fieldCnt > -1)
            {
                let members:string[] = Object.keys(pivotGridObj.engineModule.fieldList[fieldsmem[fieldCnt]].members);
                let memberCnt: number = members.length - 1;
                let memberColl: { [key: string]: Object }[] = [];
                while (memberCnt > -1) {
                    memberColl.push({ Member: members[memberCnt], Checked: members[memberCnt] + '_' + false });
                    memberCnt--;
                }
                fieldmemCollections[fieldsmem[fieldCnt]] = memberColl;
                fieldCnt--;
            }
            values = fieldmemCollections[fieldsmem[0]];
            isInitial = false;
        }
        for (let field of pivotGridObj.dataSource.filterSettings) {
            filterCollections[field.name] = field;
        }
    },
    allowCalculatedField:true,
    allowConditionalFormatting:true,
    showFieldList:true,
    showGroupingBar:true,
    allowExcelExport:true,
    allowPdfExport:true,
    showValuesButton:true,
    height:280,
});
pivotGridObj.appendTo('#PivotView');
//virtualscrolling
let data: Function = (count: number) => {
    let result: Object[] = [];
    for (let i: number = 1; i < (count + 1); i++) {
        dt++;
        let round: string;
        let toString: string = i.toString();
        if (toString.length === 1) {
            round = '0000' + (i);
        }
        else if (toString.length === 2) {
            round = '000' + i;
        }
        else if (toString.length === 3) {
            round = '00' + i;
        } else if (toString.length === 4) {
            round = '0' + i;
        } else {
            round = toString;
        }
        result.push({
            ProductID: 'PRO-' + round,
            City: city[Math.round(Math.random() * city.length)] || city[0],
            Year: "FY " + (dt + 2013),
            CustomerName: customername[Math.round(Math.random() * customername.length)] || customername[0],
            Price: Math.round(Math.random() * 5000) + 5000,
            Sold: Math.round(Math.random() * 80) + 10,
            
        });
        if (dt / 4 == 1) {
            dt = 0;
        }
    }
    return result;
};
let virtualBtn: Button = new Button({ isPrimary: true});
    virtualBtn.appendTo('#applyvirtualscroll');

    function show() {
        document.getElementById('popup').style.display = 'inline-block';
    }

    virtualBtn.element.onclick = (): void => {
        // show();
        isInit = true;
        
         // pivotGridObj.dataSource={};
        let data1: IDataSet[] =   data(1000) as IDataSet[];
         let dataSource: IDataOptions =  {
            data: data1,
            enableSorting: false,
            expandAll: true, 
            drilledMembers:[],
            conditionalFormatSettings:[],
            allowLabelFilter:true,
            allowValueFilter:true,
            filters:[],
            calculatedFieldSettings:[],
            valueAxis:null,
           
            filterSettings:[],

            formatSettings: [{ name: 'Price', format: 'C0' }],
            rows: [{ name: 'ProductID' }],
            columns: [{ name: 'Year' }],
            values: [{ name: 'Price', caption: 'Unit Price' }, { name: 'Sold', caption: 'Unit Sold' }]
        };
       // pivotGridObj.appendTo('#PivotView');
        pivotGridObj.enableVirtualization=true;
        pivotGridObj.dataSource = dataSource;
        
      
    };
    

    let destroyBtn:Button=new Button({isPrimary:true});
    destroyBtn.appendTo('#destroy');
    document.getElementById('destroy').onclick=():void => {
        // pivotvirtualGridObj.isDestroyed=true;
        pivotGridObj.dataSource=  {
            data: pivot_dataset as IDataSet[],
        
            expandAll: false,
            enableSorting: true,
            allowLabelFilter: true,
            allowValueFilter: true,
            // sortSettings: [{ name: 'company', order: 'Descending' }],
            formatSettings: [{ name: 'balance', format: 'C' },
            { name: 'date', format: 'dd/MM/yyyy-hh:mm', type: 'date' }],
            drilledMembers: [{ name: 'product', items: ['Bike', 'Car'] }, { name: 'gender', items: ['male'] }],
            filterSettings: [
                { name: 'date', type: 'Date', condition: 'Between', value1: new Date('02/16/2000'), value2: new Date('02/16/2002') },
                { name: 'age', type: 'Number', condition: 'Between', value1: '25', value2: '35' },
                // { name: 'product', type: 'Label', items: ['Car', 'Bike'], condition: 'Contains', value1: 'e', value2: 'v' },
                // { name: 'product', type: 'Value', condition: 'GreaterThan', value1: '2000', value2: '800', measure: 'quantity' },
                // { name: 'eyeColor', type: 'Value', condition: 'GreaterThan', value1: '600', value2: '800', measure: 'quantity' },
                // { name: 'eyeColor', type: 'Exclude', items: ['blue'] }
            ],
            rows: [{ name: 'product', caption: 'Items' }, { name: 'eyeColor' }],
            // rows: [{ name: 'date', caption: 'TimeLine' }],
            columns: [{ name: 'gender', caption: 'Population' }, { name: 'isActive' }],
            values: [{ name: 'balance' }, { name: 'quantity' }],
            filters: [],
            // conditionalFormatSettings: [
            //     {
            //         measure: 'balance',
            //         value1: 100,
            //         conditions: 'Less Than',
            //         style: {
            //             backgroundColor: '#80cbc4',
            //             color: 'black',
            //             fontFamily: 'Tahoma',
            //             fontSize: '12px'
            //         }
            //     },
            //     {
            //         value1: 50,
            //         value2: 300,
            //         measure: 'quantity',
            //         conditions: 'Between',
            //         style: {
            //             backgroundColor: '#f48fb1',
            //             color: 'black',
            //             fontFamily: 'Tahoma',
            //             fontSize: '12px'
            //         }
            //     }
            // ]
            conditionalFormatSettings:[
                {
                    measure:'balance',
                    value1:100,
                    conditions:'LessThan',
                    style:{
                        backgroundColor:'#80cbc4',
                        color:'black',
                        fontFamily:'Tahoma',
                        fontSize:'12px'
                    }
                },
                {
                    measure:'quantity',
                    value1:50,
                    value2:300,
                    conditions:'Between',
                    style:{
                        backgroundColor:'#f48fb1',
                        color:'black',
                        fontFamily:'Tahoma',
                        fontSize:'12px'
                    }
                }
        ]
        }
        // pivotGridObj.appendTo('#PivotView');
        // pivotGridObj.refresh;
    }
    

// gulpfilteringcheckboxes

let labelfiltercBox:CheckBox = new CheckBox({
    label:'Label Filter', labelPosition:'After', checked:true,
    change: (args: CheckChange) => {
        if (args.checked) {
            fieldsfddl.enabled=true;
            operatorfddl.enabled=true;
            valueInput1.enabled=true;
            valueInput2.enabled=true;
            applyfilterBtn.disabled=false;
            clearBtn.disabled=false;
        }
        else{
            fieldsfddl.enabled=false;
            operatorfddl.enabled=false;
            valueInput1.enabled=false;
            valueInput2.enabled=false;
            applyfilterBtn.disabled=true;
            clearBtn.disabled=true;
        }
    }
});
labelfiltercBox.appendTo('#labelfilter');

let valuefiltercBox:CheckBox = new CheckBox({
    label:'Value Filter', labelPosition:'After', checked:true,
    change: (args: CheckChange) => {
        if (args.checked) {
            fieldsvddl.enabled=true;
            operatorvddl.enabled=true;
            measuresddl.enabled=true;
            valueInput01.enabled=true;
            valueInput02.enabled=true;
            applyvalueBtn.disabled=false;
            clearvalueBtn.disabled=false;
        }
        else{
            fieldsvddl.enabled=false;
            measuresddl.enabled=false;
            operatorvddl.enabled=false;
            valueInput01.enabled=false;
            valueInput02.enabled=false;
            applyvalueBtn.disabled=true;
            clearvalueBtn.disabled=true;
        }
    }
});
valuefiltercBox.appendTo('#valuefilter');

let memfiltercBox:CheckBox = new CheckBox({
    label:'Member Filter', labelPosition:'After', checked:true,
    change: (args: CheckChange) => {
        if (args.checked) {
          fieldsmemddl.enabled=true;
          valuesmemddl.enabled=true;
          typeddl.enabled=true;
          applymemfilterBtn.disabled=false;
        }
        else{
            fieldsmemddl.enabled=false;
            valuesmemddl.enabled=false;
            typeddl.enabled=false;
            applymemfilterBtn.disabled=true;
        }
    }
});
memfiltercBox.appendTo('#memberfilter');


//memfiltering


let valuesmemddl: MultiSelect = new MultiSelect({
    dataSource: values,
    mode: 'CheckBox',
    showDropDownIcon: true,
    enabled:true,
    width:'80%',
    closePopupOnSelect:true,
    showClearButton: false,
    enableSelectionOrder: false,
    fields: { text: 'Member' },
    select: (args: SelectEventArgs): void => {
        applymemfilterBtn.disabled = false;
        setMemberCheckedState((<any>fieldsmemddl).itemData, args.item.textContent, args.item.textContent + '_' + true);
    },
    removed: (args: RemoveEventArgs): void => {
        setMemberCheckedState((<any>fieldsmemddl).itemData, args.item.textContent, args.item.textContent + '_' + false);
        setApplyBtnState();
    },
    open: (args: PopupEventArgs): void => {
        (args.popup.element.querySelector(".e-filter-parent") as HTMLElement).style.display = 'none';
    }
});
valuesmemddl.appendTo('#values');

let fieldsmemddl: DropDownList = new DropDownList({
    dataSource: fieldsmem,
    index: 1,
    
    width: '80%',
    change: (args: ChangeEventArgs) => {
        valuesmemddl.dataSource = fieldmemCollections[args.value.toString()];
        valuesmemddl.value = getSelectedMembers(args.value.toString());
        if (filterCollections[args.value.toString()]) {
            typeddl.value = filterCollections[args.value.toString()].type;
        }
        valuesmemddl.dataBind();
        typeddl.dataBind();
    }
});
fieldsmemddl.appendTo('#fieldsmem');

let typeddl: DropDownList = new DropDownList({
    dataSource: type,
    width:'80%',
    index: 0
    
});
typeddl.appendTo('#type');

let applymemfilterBtn: Button = new Button({
     isPrimary: true, disabled: true
});
applymemfilterBtn.appendTo('#applymemfilter');
let clearmemfilterBtn: Button=new Button({
    
});
clearmemfilterBtn.appendTo('#clearmemfilter');

document.getElementById('applymemfilter').onclick = () => {
    //You can set your filter settings here. 
    pivotGridObj.dataSource.filterSettings = [
        { name: fieldsmem[0], items: getSelectedMembers(fieldsmem[0]), type: updateFilterType(fieldsmem[0]) },
        { name: fieldsmem[1], items: getSelectedMembers(fieldsmem[1]), type: updateFilterType(fieldsmem[1]) },
        { name: fieldsmem[2], items: getSelectedMembers(fieldsmem[2]), type: updateFilterType(fieldsmem[2]) }
    ];
};
document.getElementById('clearmemfilter').onclick=()=>{
    pivotGridObj.dataSource.filterSettings=[];
};
function updateFilterType(fieldName: string) {
    if ((fieldsmemddl as any).itemData === fieldName) {
        return (typeddl as any).itemData;
    } else if (filterCollections[fieldName]) {
        return filterCollections[fieldName].type;
    } else {
        return 'Exclude'
    }
}

// To get the checked members here as string array. 
function getSelectedMembers(field: string) {
    let membersColl: string[] = [];
    let members: { [key: string]: Object }[] = fieldmemCollections[field];
    let memLength: number = members.length - 1;
    while (memLength > -1) {
        if (members[memLength]['Checked'] === members[memLength]['Member'] + '_' + true) {
            membersColl.push(members[memLength]['Member'].toString());
        }
        memLength--;
    }
    return membersColl;
}

// To set the checked status of the members maintained in the object fieldCollections. 
function setMemberCheckedState(field: string, member: string, checkedState: string) {
    let members: { [key: string]: Object }[] = fieldmemCollections[field];
    let memLength: number = members.length - 1;
    while (memLength > -1) {
        if (members[memLength]['Member'] === member) {
            members[memLength]['Checked'] = checkedState;
            break;
        }
        memLength--;
    }
}

//* To set disabled/enabled state in the Apply button. 
function setApplyBtnState() {
    let fieldArray: string[] = ['product', 'eyeColor', 'gender'];
    let loopCount = fieldArray.length - 1;
    let isSelected: boolean = false;
    while (loopCount > -1) {
        if (getSelectedMembers(fieldArray[loopCount]).length > 0) {
            isSelected = true;
            break;
        }
        loopCount--;
    }
    applymemfilterBtn.disabled = !isSelected;
}


//sorting

let order: string[] = ['Ascending', 'Descending'];
    let fields: { [key: string]: Object }[] = [
        { Field: 'product', Order: 'product_asc' },
        { Field: 'eyeColor', Order: 'eyeColor_asc' },
        { Field: 'gender', Order: 'gender_asc' },
        
    ];

    let checkBoxObj: CheckBox = new CheckBox({
        label: 'Enable Sorting', labelPosition: 'After', checked: true,
        change: (args: CheckChange) => {
            if (args.checked) {
                pivotGridObj.enableValueSorting=true;
                fieldsddl.enabled = true;
                orderddl.enabled = true;
                applyBtn.disabled = false;
            } else {
                pivotGridObj.enableValueSorting=false;
                fieldsddl.enabled = false;
                orderddl.enabled = false;
                applyBtn.disabled = true;
            
            }
        }
    });
    checkBoxObj.appendTo('#sorting');

    let fieldsddl: DropDownList = new DropDownList({
        dataSource: fields,
        fields: { text: 'Field', value: 'Order' },
        width:'150px',
        index: 0,
        
        enabled: true,
        
        change: (args: ChangeEventArgs) => {
            if ((fieldsddl.dataSource as { [key: string]: Object }[])[fieldsddl.index].Order === (fieldsddl.dataSource as { [key: string]: Object }[])[fieldsddl.index].Field + '_asc') {
                orderddl.index = 0;
            } else {
                orderddl.index = 1;
            }
            /*if (fieldsddl.dataSource[fieldsddl.index].Order === fieldsddl.dataSource[fieldsddl.index].Field + '_asc') {
                orderddl.index = 0;
            } else {
                orderddl.index = 1;
            }*/
            
        }
    });
    fieldsddl.appendTo('#fields');

    let orderddl: DropDownList = new DropDownList({
        dataSource: order,
        index: 0,
        width:'150px',
        enabled: true,
        change: (args: ChangeEventArgs) => {
           if (args.value === 'Ascending') {
                (fieldsddl.dataSource as { [key: string]: Object }[])[fieldsddl.index].Order = (fieldsddl.dataSource as { [key: string]: Object }[])[fieldsddl.index].Field + '_asc';
               //fieldsddl.dataSource[].Order = fieldsddl.dataSource[fieldsddl.index].Field + '_asc';
            } else {
                (fieldsddl.dataSource as { [key: string]: Object }[])[fieldsddl.index].Order = (fieldsddl.dataSource as { [key: string]: Object }[])[fieldsddl.index].Field + '_desc';
                //fieldsddl.dataSource[fieldsddl.index].Order = fieldsddl.dataSource[fieldsddl.index].Field + '_desc';
            }
            fieldsddl.refresh();
        }
    });
    orderddl.appendTo('#order');

    let applyBtn: Button = new Button({
        iconCss: 'e-icons e-play-icon', cssClass: 'e-flat', isPrimary: true,
    });
    applyBtn.appendTo('#apply');


    document.getElementById('apply').onclick = () => {
       if (checkBoxObj.checked) {
            pivotGridObj.dataSource.enableSorting = true;
            pivotGridObj.dataSource.sortSettings = [
                { name: 'product', order: (fieldsddl.dataSource as { [key: string]: Object }[])[0].Order === 'product_asc' ? 'Ascending' : 'Descending' },
                { name: 'eyeColor', order: (fieldsddl.dataSource as { [key: string]: Object }[])[1].Order === 'eyeColor_asc' ? 'Ascending' : 'Descending' },
                { name: 'gender', order: (fieldsddl.dataSource as { [key: string]: Object }[])[2].Order === 'gender_asc' ? 'Ascending' : 'Descending' },
                //{ name: 'product', order: fieldsddl.dataSource[0].Order === 'product_asc' ? 'Ascending' : 'Descending' },
                //{ name: 'eyeColor', order: fieldsddl.dataSource[1].Order === 'eyeColor_asc' ? 'Ascending' : 'Descending' },
                //{ name: 'gender', order: fieldsddl.dataSource[2].Order === 'gender_asc' ? 'Ascending' : 'Descending' },
                
            ];
        } else {
            pivotGridObj.dataSource.enableSorting = false;
            pivotGridObj.dataSource.sortSettings = [];
        }
       
    };


//calculatedfield
let calcBtn:Button=new Button({ isPrimary: true })
calcBtn.appendTo('#CalculatedField');
document.getElementById('CalculatedField').addEventListener('click',()=>{
    pivotGridObj.calculatedFieldModule.createCalculatedFieldDialog();
});
let calculateField:CheckBox = new CheckBox({
    label:'Calculated Field', labelPosition:'After', checked:true,
    change: (args: CheckChange) => {
        if (args.checked) {
            calcBtn.disabled=false;
        }
        else{
             calcBtn.disabled=true;
        }
    }
});
calculateField.appendTo('#cfield');

//EXPORT


let pdfBtn:Button=new Button({isPrimary:true})
pdfBtn.appendTo('#pdf');
let excelBtn:Button=new Button({isPrimary:true})
excelBtn.appendTo('#excel');
let csvBtn:Button=new Button({isPrimary:true})
csvBtn.appendTo('#csv')

document.getElementById('pdf').onclick=function(){
    pivotGridObj.pdfExport();
};
document.getElementById('excel').onclick=function(){
    pivotGridObj.excelExport();
};
document.getElementById('csv').onclick=function(){
    pivotGridObj.csvExport();
};
//expand and rtl
let expand: CheckBox = new CheckBox({
    label: 'Expand All', labelPosition: 'After', checked: false,
    change:checkcha
    
});
expand.appendTo('#expand');
function checkcha(args: CheckChange)
{
        if (args.checked) {
            pivotGridObj.dataSource.expandAll=true;
        } else {
            pivotGridObj.dataSource.expandAll=false;
        }
}

let rtl: CheckBox=new CheckBox({
    label:'Right To Left', labelPosition:'After', checked:false,
    change:rtlf
});
rtl.appendTo('#rtl')
function rtlf(args: CheckChange){
    if(args.checked){
        pivotGridObj.enableRtl=true;
       
    }
    else{
        pivotGridObj.enableRtl=false;
    }
}
//conditionalformatting
let button: Button = new Button({ isPrimary: true });
button.appendTo('#conditional-formatting-btn');

let button1: Button = new Button({ isPrimary: true });
button1.appendTo('#reset-format');

let condFormat:CheckBox = new CheckBox({
    label:'Conditional Formatting', labelPosition:'After', checked:true,
    change: (args: CheckChange) => {
        if (args.checked) {
            button.disabled=false;
            button1.disabled=false;
        }
        else{
            button.disabled=true;
            button1.disabled=true;
        }
    }
});

condFormat.appendTo('#cformatting');

button1.element.onclick = (): void => {
    if (pivotGridObj.dataSource.conditionalFormatSettings.length > 0) {
        pivotGridObj.setProperties({ dataSource: { conditionalFormatSettings: [] } }, true);
        pivotGridObj.renderPivotGrid();
    }
    pivotGridObj.conditionalFormattingModule.destroy();
    document.getElementById('reset-format').blur();
};

button.element.onclick = (): void => {
    if (pivotGridObj.conditionalFormattingModule) {
        pivotGridObj.conditionalFormattingModule.showConditionalFormattingDialog();
    }
};

//fieldlist

let fList:CheckBox=new CheckBox({
    label:'Field List', labelPosition:'After', checked:true, 
    change:(args: CheckChange)=>{
        if(args.checked){
            pivotGridObj.showFieldList=true;
            
        }
        else{
            pivotGridObj.showFieldList=false;
            
        }
    
    }
});
fList.appendTo('#fieldlist')
//groupingbar
let gbar:CheckBox=new CheckBox({
    label:'Grouping Bar', labelPosition:'After', checked:true, 
    change:(args: CheckChange)=>{
        if(args.checked){
            pivotGridObj.showGroupingBar=true;
            filter.disabled=false;
            remove.disabled=false;
            sort.disabled=false
        }
        else{
            pivotGridObj.showGroupingBar=false;
            filter.disabled=true;
            remove.disabled=true;
            sort.disabled=true;
        }
    
    }
});
gbar.appendTo('#groupbar');
let filter: CheckBox = new CheckBox({
    label: 'Show Filter Icon',
    checked: true,
    change: onChange
});
filter.appendTo('#filter');
let sort: CheckBox = new CheckBox({
    label: 'Show Sort Icon',
    checked: true,
    change: onChange
});
sort.appendTo('#sort');
let remove: CheckBox = new CheckBox({
    label: 'Show Remove Icon',
    checked: true,
    change: onChange
});
remove.appendTo('#remove');

function onChange(args: any) {
    if ((args.event.target as HTMLElement).id === 'filter') {
        pivotGridObj.groupingBarSettings.showFilterIcon = args.checked;
    } else if (args.event.target.id === 'sort') {
        pivotGridObj.groupingBarSettings.showSortIcon = args.checked;
    } else {
        pivotGridObj.groupingBarSettings.showRemoveIcon = args.checked;
    }
}
//labelfilter

let operators: string[] = ['Equals', 'DoesNotEquals', 'BeginWith', 'DoesNotBeginWith', 'EndsWith',
        'DoesNotEndsWith', 'Contains', 'DoesNotContains', 'GreaterThan',
        'GreaterThanOrEqualTo', 'LessThan', 'LessThanOrEqualTo', 'Between', 'NotBetween'];
let fieldsf: string[] = ['product', 'eyeColor', 'gender'];

let fieldsfddl: DropDownList = new DropDownList({
        dataSource: fieldsf,
        index: 0,
        width:'80%',
        
        change: (args: ChangeEventArgs) => {
            if (fieldCollections[args.value as string]) {
                operatorfddl.value = fieldCollections[args.value as string].condition;
                valueInput1.value = fieldCollections[args.value as string].value1 as string;
                valueInput2.value = fieldCollections[args.value as string].value2 as string;
            } else {
                setFilters(args.value as string, 'DoesNotEquals', '', '');
                operatorfddl.value = 'DoesNotEquals';
                valueInput1.value = '';
                valueInput2.value = '';
            }
            updateButtonState();
        }
    });
    fieldsfddl.appendTo('#fieldsf');

let operatorfddl: DropDownList = new DropDownList({
        dataSource: operators,
        value: 'DoesNotEquals',
        width:'80%',
        //closePopupOnSelect:true,
        change: (args: ChangeEventArgs) => {
            if (args.value === 'Between' || args.value === 'NotBetween') {
                (document.querySelector('.input2cls') as HTMLElement).style.display = '';
            } else {
                (document.querySelector('.input2cls') as HTMLElement).style.display = 'none';
            }
            setFilters(fieldsfddl.value as string, args.value as Operators, valueInput1.value, valueInput2.value);
            updateButtonState();
        }
    });
    operatorfddl.appendTo('#conditions');
    let valueInput1: MaskedTextBox = new MaskedTextBox({
        value: '',
        width:'60%',
        placeholder: 'Example: "Bike"',
        change: (e: MaskChangeEventArgs) => {
            setFilters(fieldsfddl.value as string, operatorfddl.value as Operators, e.value, valueInput2.value);
            updateButtonState();
        }
        
    });
    valueInput1.appendTo('#value1');

  let valueInput2: MaskedTextBox = new MaskedTextBox({
        value: '',
        placeholder: 'Example: "States"',
        width:'60%',
        change: (e: MaskChangeEventArgs) => {
            setFilters(fieldsfddl.value as string, operatorfddl.value as Operators, valueInput1.value, e.value);
            updateButtonState();
        }
    });
    valueInput2.appendTo('#value2');
    let applyfilterBtn: Button = new Button({
        isPrimary: true, disabled: true
    });
    applyfilterBtn.appendTo('#applyfilter');

    let clearBtn: Button = new Button();
    clearBtn.appendTo('#clear');

    function setFilters(fieldName: string, condition: Operators, operand1: string, operand2: string) {
        fieldCollections[fieldName] = {
            name: fieldName,
            type: 'Label',
            condition: condition,
            value1: operand1,
            value2: operand2
        };
    }

    function updateButtonState() {
        applyfilterBtn.disabled = true;
        for (let field of fieldsf) {
            if (fieldCollections[field] && (fieldCollections[field].value1 !== '' || fieldCollections[field].value2 !== '')) {
                applyfilterBtn.disabled = false;
                break;
            };
        }
    }

    document.getElementById('applyfilter').onclick = () => {
        let filterOptions: FilterModel[] = [];
        for (let field of fieldsf) {
            if (fieldCollections[field] && fieldCollections[field].value1 !== '') {
                filterOptions.push(fieldCollections[field]);
            }
        }
        pivotGridObj.dataSource.filterSettings = filterOptions;
    };

    document.getElementById('clear').onclick = () => {
        pivotGridObj.dataSource.filterSettings = [];
    }



//valuefiltering



let fieldsv: string[] = ['product', 'eyeColor', 'gender'];
let fieldsvddl: DropDownList = new DropDownList({
    dataSource: fieldsv,
    index: 0,
    width:'80%',
    change: (args: ChangeEventArgs) => {
        if (fieldCollections[args.value as string]) {
            measuresddl.value = fieldCollections[args.value as string].measure;
            operatorvddl.value = fieldCollections[args.value as string].condition;
        } else {
            setFiltersvalue(args.value as string, 'In_Stock', 'DoesNotEquals', '', '');
            operatorvddl.value = 'DoesNotEquals';
            measuresddl.value = 'In_Stock';
        }
    }
});
fieldsvddl.appendTo('#fieldsv');
let measuresddl: DropDownList = new DropDownList({
    dataSource: measures,
    fields: { value: 'value', text: 'text' },
    value: 'balance',
    width:'80%',
    change: (args: ChangeEventArgs) => {
        setFiltersvalue(fieldsvddl.value as string, args.value as string, operatorvddl.value as Operators, valueInput1.value.toString(), valueInput2.value.toString());
    }
});
measuresddl.appendTo('#measures');
let operatorvddl: DropDownList = new DropDownList({
    dataSource: operators,
    value: 'DoesNotEquals',
    width:'80%',
    change: (args: ChangeEventArgs) => {
        if (args.value === 'Between' || args.value === 'NotBetween') {
            (document.querySelector('.input02cls') as HTMLElement).style.display = '';
        } else {
            (document.querySelector('.input02cls') as HTMLElement).style.display = 'none';
        }
        setFiltersvalue(fieldsvddl.value as string, measuresddl.value as string, args.value as Operators, valueInput01.value.toString(), valueInput02.value.toString());
    }
});
operatorvddl.appendTo('#conditionsv');
let valueInput01: NumericTextBox = new NumericTextBox({
    value: 9000,
    width:'60%',
    placeholder: "Example: 9590",
    change: (e: NumericEventArgs) => {
        setFiltersvalue(fieldsvddl.value as string, measuresddl.value as string, operatorvddl.value as Operators, e.value.toString(), valueInput02.value.toString());
    }
});
valueInput01.appendTo('#value01');

let valueInput02: NumericTextBox = new NumericTextBox({
    value: 17500,
    width:'60%',
    placeholder: "Example: 17500",
    change: (e: NumericEventArgs) => {
        setFiltersvalue(fieldsvddl.value as string, measuresddl.value as string, operatorvddl.value as Operators, valueInput01.value.toString(), e.value.toString());
    }
});
valueInput02.appendTo('#value02');
let applyvalueBtn: Button = new Button({
    isPrimary: true
});
applyvalueBtn.appendTo('#applyvaluefilter');

let clearvalueBtn: Button = new Button();
clearvalueBtn.appendTo('#clearvaluefilter');

function setFiltersvalue(fieldName: string, measureName: string, condition: Operators, operand1: string, operand2: string) {
    fieldCollections[fieldName] = {
        name: fieldName,
        measure: measureName,
        type: 'Value',
        condition: condition,
        value1: operand1,
        value2: operand2
    };
}

document.getElementById('applyvaluefilter').onclick = () => {
    let filterOptions: FilterModel[] = [];
    filterOptions = [{
        name: fieldsvddl.value as string,
        type: 'Value',
        measure: measuresddl.value as string,
        condition: operatorvddl.value as Operators,
        value1: valueInput01.value === null ? '1' : valueInput01.value.toString(),
        value2: valueInput02.value === null ? '1' : valueInput02.value.toString()
    }];
    pivotGridObj.dataSource.filterSettings = filterOptions;
};
document.getElementById('clearvaluefilter').onclick = () => {
    pivotGridObj.dataSource.filterSettings = [];
    
};

//Aggregation

let aggregationcBox:CheckBox = new CheckBox({
    label:'Aggregation', labelPosition:'After', checked:true,
    change: (args: CheckChange) => {
        if (args.checked) {
            balanceDropDown.enabled=true;
            quantityDropDown.enabled=true;
        }
        else{
             balanceDropDown.enabled=false;
            quantityDropDown.enabled=false;
        }
    }
});
aggregationcBox.appendTo('#aggregation');

  let balanceDropDown: DropDownList = new DropDownList({
        placeholder: 'Balance',
        width:'150px',
        floatLabelType: 'Auto',
        change: (args: ChangeEventArgs) => {
            setSummaryType('balance', args.value as SummaryTypes);
        }
    });
    balanceDropDown.appendTo('#balancedrpdwn');

    let quantityDropDown: DropDownList = new DropDownList({
        placeholder: 'Quantity',
        width:'150px',
        floatLabelType: 'Auto',
        change: (args: ChangeEventArgs) => {
            setSummaryType('quantity', args.value as SummaryTypes);
        }
    });
    quantityDropDown.appendTo('#quantitydrpdwn');

    function setSummaryType(fieldName: string, summaryType: SummaryTypes): void {
        let isAvail: boolean = false;
        for (let vCnt: number = 0; vCnt < pivotGridObj.dataSource.values.length; vCnt++) {
            if (pivotGridObj.dataSource.values[vCnt].name === fieldName) {
                pivotGridObj.dataSource.values[vCnt].type = summaryType;
                isAvail = (<any>pivotGridObj.dataSource.values[vCnt]).properties ? false : true;
            }
        }
        if (isAvail) {
            pivotGridObj.updateDataSource();
        }
    }



