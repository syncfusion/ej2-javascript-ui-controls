/**
 * Spreadsheet collaborative editing sample
 */
import { Spreadsheet, SheetModel, ColumnModel, CollaborativeEditArgs } from './../../../src/index';
import { enableRipple } from '@syncfusion/ej2-base';
import { defaultData as dataSource, data } from './../../common/data-source';
import './../../../../node_modules/es6-promise/dist/es6-promise';
//import * as signalR from '@aspnet/signalr';

enableRipple(true);
// const connection: signalR.HubConnection = new signalR.HubConnectionBuilder().withUrl('http://localhost:62869/hubs/spreadsheethub',{
//     skipNegotiation: true,
//     transport: signalR.HttpTransportType.WebSockets
//   }).build();

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
    ranges: [{
        dataSource: dataSource,
        startCell: 'A1'
    }],
    rowCount: 200,
    columns: columns
}];

let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: sheet,
    openUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/open',
    saveUrl: 'https://ej2services.syncfusion.com/production/web-services/api/spreadsheet/save',
    actionComplete: (args) => {
       // connection.send('server', JSON.stringify(args));
    }
});

spreadsheet.appendTo('#spreadsheet');

//  connection.on('dataReceived', (data: string) => {
//      spreadsheet.updateAction(data);
//  });
//     connection.start().then(() => {
//         console.log('server connected!!!');
//     }).catch(err => console.log(err));
