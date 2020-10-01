/**
 * Spreadsheet default sample
 */
import { Spreadsheet, SheetModel, ColumnModel, SortEventArgs, CellSaveEventArgs, SaveCompleteEventArgs, CollaborativeEditArgs, BeforeCellFormatArgs, CellModel, CellInfoEventArgs, overlay } from './../../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { switchTheme } from '../../../common/switch-theme';
import { defaultData as dataSource } from './../../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';
import { Overlay } from '../../../../src/spreadsheet/services';

enableRipple(true);

let wrapper: HTMLElement = document.getElementById('wrapper');

wrapper.style.height = `${document.documentElement.clientHeight - 70}px`;


let sheet: SheetModel[] = [{
    name: 'Picture',
    
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
   
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    created: (args: object) => {
        spreadsheet.insertImage([{src:"https://www.w3schools.com/images/w3schools_green.jpg", height: 400, width: 400}] ,"D3")
    },
    
});

spreadsheet.appendTo('#spreadsheet');

switchTheme('#select-theme', spreadsheet);