import { RadioButton } from '@syncfusion/ej2-buttons';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { Kanban, KanbanModel, DialogEventArgs } from '../../src/kanban/index';
import { kanbanData } from '../../spec/kanban/common/kanban-data.spec';
import '../../node_modules/es6-promise/dist/es6-promise';

/**
 * kanban sample
 */

let kanbanOptions: KanbanModel = {
    dataSource: kanbanData,
    keyField: 'Status',
    columns: [
        { headerText: 'Backlog', keyField: 'Open', showAddButton: true },
        { headerText: 'In Progress', keyField: 'InProgress' },
        { headerText: 'Testing', keyField: 'Testing', showAddButton: true },
        { headerText: 'Done', keyField: 'Close' }
    ],
    cardSettings: {
        contentField: 'Summary',
        headerField: 'Id',
    },
    swimlaneSettings: {
        keyField: 'Assignee'
    },
    dialogOpen: open,
    dialogClose: close,
    dialogSettings: {
        model: { width: 500 },
        fields: [
            { text: 'ID', key: 'Id', type: 'TextBox' },
            { key: 'Status', type: 'DropDown' },
            { key: 'Assignee', type: 'DropDown' },
            { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
            { key: 'Summary', type: 'TextArea', validationRules: { required: true } }
        ]
    }
};

let kanbanObj: Kanban = new Kanban(kanbanOptions);
kanbanObj.appendTo('#kanban');
let statusData: string[] = ['Open', 'InProgress', 'Testing', 'Close'];
let assigneeData: string[] = ['Nancy Davloio', 'Andrew Fuller', 'Janet Leverling',
    'Steven walker', 'Robert King', 'Margaret hamilt', 'Michael Suyama'];
let priorityData: string[] = ['Low', 'Normal', 'Critical', 'Release Breaker', 'High'];
function open(args: DialogEventArgs): void {
    if (args.requestType === 'Edit') {
        let curData: IDataModel = args.data;
        let numericObj: NumericTextBox = new NumericTextBox({
            value: curData.Estimate as number, placeholder: 'Estimate', floatLabelType: 'Always'
        });
        numericObj.appendTo(args.element.querySelector('#Estimate') as HTMLInputElement);
        let statusDropObj: DropDownList = new DropDownList({
            value: curData.Status as string, popupHeight: '300px', floatLabelType: 'Always',
            dataSource: statusData, fields: { text: 'Status', value: 'Status' }, placeholder: 'Status'
        });
        statusDropObj.appendTo(args.element.querySelector('#Status') as HTMLInputElement);
        let assigneeDropObj: DropDownList = new DropDownList({
            value: curData.Assignee as string, popupHeight: '300px', floatLabelType: 'Always',
            dataSource: assigneeData, fields: { text: 'Assignee', value: 'Assignee' }, placeholder: 'Assignee'
        });
        assigneeDropObj.appendTo(args.element.querySelector('#Assignee') as HTMLInputElement);
        let priorityObj: DropDownList = new DropDownList({
            value: curData.Priority as string, popupHeight: '300px', floatLabelType: 'Always',
            dataSource: priorityData, fields: { text: 'Priority', value: 'Priority' }, placeholder: 'Priority'
        });
        priorityObj.appendTo(args.element.querySelector('#Priority') as HTMLInputElement);
    }
}

function close(args: DialogEventArgs): void {
    console.log(args.data);
}

let radioButton: RadioButton = new RadioButton({ label: 'Predefined', name: 'editing', value: 'predefined', checked: true });
radioButton.appendTo('#predefined');
let radioButton1: RadioButton = new RadioButton({ label: 'Template', name: 'editing', value: 'template' });
radioButton1.appendTo('#template');

document.getElementById('predefined').onchange = () => {
    let checkEle: HTMLInputElement = document.getElementById('predefined') as HTMLInputElement;
    if (checkEle.checked) {
        kanbanObj.dialogSettings.fields = [
            { text: 'ID', key: 'Id', type: 'TextBox' },
            { key: 'Status', type: 'DropDown' },
            { key: 'Assignee', type: 'DropDown' },
            { key: 'Estimate', type: 'Numeric', validationRules: { range: [0, 1000] } },
            { key: 'Summary', type: 'TextArea', validationRules: { required: true } }
        ];
        kanbanObj.dialogSettings.template = null;
    }
};

document.getElementById('template').onchange = () => {
    let checkEle: HTMLInputElement = document.getElementById('template') as HTMLInputElement;
    if (checkEle.checked) {
        kanbanObj.dialogSettings.fields = [];
        kanbanObj.dialogSettings.template = '#dialogTemplate';
    }
};

document.getElementById('addNew').onclick = (e: Event): void => {
    let curData: object = {
        Id: 111, Status: 'Open', Priority: '', Assignee: 'Andrew Fuller', Estimate: 0, Tags: '', Summary: ''
    };
    kanbanObj.openDialog('Add', curData);
};

export interface IDataModel {
    Id?: number;
    Status?: string;
    Summary?: Date;
    Type?: number;
    Priority?: string;
    Tags?: string;
    Estimate?: number;
    Assignee?: string;
    RankId?: number;
}
