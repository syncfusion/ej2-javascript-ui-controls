/**
 * MultiSelect Sample
 */
import { MultiSelect } from '../../src/multi-select/index';



let datasource: { [key: string]: Object }[] = [{ id: 'list1', text: 'JAVA', icon: 'icon' }, { id: 'list2', text: 'C#' },
{ id: 'list3', text: 'C++' }, { id: 'list4', text: '.NET', icon: 'icon' }, { id: 'list5', text: 'Oracle' }, { id: 'list6', text: 'GO' }, { id: 'list7', text: 'Haskell' }, { id: 'list8', text: 'Racket' }, { id: 'list8', text: 'F#' }];

let listObj: MultiSelect = new MultiSelect({
    dataSource: datasource,
    mode: 'Default',
    popupHeight: 200,
    fields: { text: 'text',value:'text' },
    value: ['JAVA', 'C#', 'C++'],
	placeholder: 'Select a vegetable',
	floatLabelType: 'Always',
    change: function(e){
        console.log("change event triggered");
        console.log(e);
    },
    select: function(e){
        console.log("select event triggered");
        console.log(e);
    },
    removed: function(e){
        console.log("removed event triggered");
        console.log(e);
    },
    removing: function(e){
        console.log("removing event triggered");
        console.log(e);
    }
});
listObj.appendTo(<HTMLElement>document.querySelector("#component"));
let listObj1: MultiSelect = new MultiSelect({
    closePopupOnSelect: true,
    dataSource: datasource,
	placeholder: 'Select a vegetable',
        floatLabelType: 'Auto',
    fields: { text: 'text',value:'text' },
    mode: 'Box',
    value: ['JAVA', 'C#', '.NET'],
    change: function(e){
        console.log("change event triggered");
        console.log(e);
    },
    select: function(e){
        console.log("select event triggered");
        console.log(e);
    },
    removed: function(e){
        console.log("removed event triggered");
        console.log(e);
    },
    removing: function(e){
        console.log("removing event triggered");
        console.log(e);
    }
    
});
listObj1.appendTo(<HTMLElement>document.querySelector("#box"));

let listObj11: MultiSelect = new MultiSelect({
    closePopupOnSelect: true,
    dataSource: datasource,
	placeholder: 'Select a vegetable',
        floatLabelType: 'Never',
    fields: { text: 'text',value:'text' },
    mode: 'Box',
    enableRtl:true,
    value: ['JAVA', 'C#', '.NET'],
    change: function(e){
        console.log("change event triggered");
        console.log(e);
    },
    select: function(e){
        console.log("select event triggered");
        console.log(e);
    },
    removed: function(e){
        console.log("removed event triggered");
        console.log(e);
    },
    removing: function(e){
        console.log("removing event triggered");
        console.log(e);
    }
});
listObj11.appendTo(<HTMLElement>document.querySelector("#box-rtl"));

let listObj2: MultiSelect = new MultiSelect({
    dataSource: datasource,
    mode: 'Delimiter',
    placeholder: 'Select a vegetable',
	floatLabelType: 'Auto',
    fields: { text: 'text',value:'text' },
    value: ['JAVA', 'C#', 'Oracle'],
    change: function(e){
        console.log("change event triggered");
        console.log(e);
    },
    select: function(e){
        console.log("select event triggered");
        console.log(e);
    },
    removed: function(e){
        console.log("removed event triggered");
        console.log(e);
    },
    removing: function(e){
        console.log("removing event triggered");
        console.log(e);
    }
});
listObj2.appendTo(<HTMLElement>document.querySelector("#delim"));

