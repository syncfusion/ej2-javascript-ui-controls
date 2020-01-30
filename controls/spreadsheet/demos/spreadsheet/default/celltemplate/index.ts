/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, ColumnModel, CellSaveEventArgs, CellRenderEventArgs, RangeSetting, CellEditEventArgs, ValueChangedArgs, getData, CellModel, BeforeSelectEventArgs, getRangeIndexes } from '../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from '../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';
import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { DropDownList, ChangeEventArgs, AutoComplete } from '@syncfusion/ej2-dropdowns';
import { DatePicker } from '@syncfusion/ej2-calendars';
import { TextBox, ChangedEventArgs } from '@syncfusion/ej2-inputs';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;

let columns: ColumnModel[] = [
    {
        width: 130
    },
    {
        width: 92
    },
    {
        width: 96
    }
];

let sheet: SheetModel[] = [{
    rangeSettings: [{
        dataSource: dataSource,
        startCell: 'A2',
        template: '<button class="e-button-template">BUTTON</button>',
        range: 'A3:D100'
    }],
    name: 'Button',
    columns: columns
}, {
    rangeSettings: [{
        dataSource: dataSource,
        startCell: 'A2',
        template: '<input type="text" class="e-ddb-template" tabindex="1" />',
        range: 'A3:D100'
    }], name: 'Dropdown', columns: columns
}, {
    rangeSettings: [{
        dataSource: dataSource,
        startCell: 'A2',
        template: '<input type="check" class="e-checkbox-template" />',
        range: 'A3:D100'
    }], name: 'Checkbox', columns: columns
}, {
    rangeSettings: [{
        dataSource: dataSource,
        startCell: 'A2',
        template: '<input type="text" class="e-datepicker-template" />',
        range: 'A3:D100'
    }], name: 'Datepicker', columns: columns
}, {
    rangeSettings: [{
        dataSource: dataSource,
        startCell: 'A2',
        template: '<input type="text" class="e-autocomplete-template" tabindex="1" />',
        range: 'A3:D100'
    }], name: 'Auto Complete', columns: columns
}, {
    rangeSettings: [{
        dataSource: dataSource,
        startCell: 'A1',
        template: '<input type="text" class="e-textbox-template" />',
        range: 'A3:D100'
    }], name: 'TextBox', columns: columns
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    beforeDataBound: (): void => {
        if (spreadsheet.sheets[spreadsheet.activeSheetTab - 1].name === 'Sheet1') {
            spreadsheet.cellFormat({ fontWeight: 'bold', textAlign: 'center' }, 'A1:H1');
        }
    },
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    cellSave: (evt: CellSaveEventArgs) => {
        if (evt.address == "Button!K1") {
            spreadsheet.sheets[0].rangeSettings = [{
                dataSource: dataSource,
                startCell: 'A2',
                template: '<input type="check" class="e-checkbox-template" />',
                range: 'A3:D100'
            }];
            spreadsheet.dataBind();
        }
    },
    created: (evt: Event) => {
        spreadsheet.autoFit("1:100");
    },
    cellEdit: (evt: CellEditEventArgs) => {
        // if(evt.element.cl)
        console.log(evt);
    },
    // created:(evt: Event) => {
    //     spreadsheet
    // },

    beforeCellRender: (evt: CellRenderEventArgs) => {
        if (evt.element.children.length) {
            let template: string = evt.element.children[0].className;
            switch (template) {
                case 'e-button-template':
                    new Button({
                        content: (evt.cell && evt.cell.value) ? evt.cell.value : 'Button'
                    }, evt.element.children[0] as HTMLButtonElement);
                    break;
                case 'e-ddb-template':
                    let arr: string[] = [];
                    let ddb: DropDownList = new DropDownList({
                        placeholder: 'Select a Game',
                        dataSource: ['BMW', 'Honda', 'Benz', 'Hero', 'Hyundai', 'Chevrelet'],
                        popupHeight: '200px',
                        value: evt.cell ? evt.cell.value : null,
                        change: (args: ChangeEventArgs) => {
                            if (evt.cell) {
                                evt.cell.value = args.value.toString();
                            } else {
                                let range: number[] = getRangeIndexes(evt.address)
                                spreadsheet.sheets[spreadsheet.activeSheetTab - 1].rows[range[0]].cells[range[1]] = { value: args.value.toString() };
                            }
                        }
                    }, evt.element.children[0] as HTMLElement);
                    break;
                case 'e-checkbox-template':
                    new CheckBox({
                        checked: (evt.cell && evt.cell.value) === 'TRUE',
                        change: (chkEvent: any) => {
                            if (evt.cell) {
                                evt.cell.value = chkEvent.checked ? 'TRUE' : 'FALSE';
                            }
                        }
                    }, evt.element.children[0] as HTMLInputElement);
                    break;
                case 'e-datepicker-template':
                    let dpValue: Date;
                    if (evt.cell) {
                        dpValue = !Number(evt.cell.value) ? new Date(evt.cell.value) : null
                    }
                    new DatePicker({
                        value: dpValue,
                        change: (args: any) => {
                            evt.cell.value = args.value.toLocaleDateString();
                        }
                    }, evt.element.children[0] as HTMLInputElement);
                    break;
                case 'e-autocomplete-template':
                    new AutoComplete({
                        dataSource: [
                            "Badminton",
                            "Basketball",
                            "Cricket",
                            "Football",
                            "Golf",
                            "Gymnastics",
                            "Hockey",
                            "Rugby",
                            "Snooker",
                            "Tennis"
                        ], placeholder: 'e.g. Basketball',
                        value: evt.cell ? evt.cell.value : null,
                        change: (args: any) => {
                            if (evt.cell) {
                                evt.cell.value = args.value.toString();
                            }
                        }
                    }, evt.element.children[0] as HTMLInputElement);
                    break;
                case 'e-textbox-template':
                    new TextBox({
                        value: evt.cell ? evt.cell.value : '',
                        change: (args: ChangedEventArgs) => {
                            evt.cell.value = args.value;
                        }
                    }, evt.element.children[0] as HTMLInputElement);
            }
        }
    }
});

spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;
    spreadsheet.resize();
}

switchTheme('#select-theme', spreadsheet);