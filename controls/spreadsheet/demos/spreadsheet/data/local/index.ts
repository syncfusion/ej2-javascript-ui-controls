/**
 * Local data binding
 */
import { Spreadsheet } from './../../../../src/index';
import { virtualData, dataSource } from './../../../common/data-source';


document.body.style.height = `${document.documentElement.clientHeight}px`;

dataSource();
let spreadsheet: Spreadsheet = new Spreadsheet({
    sheets: [{
        rangeSettings: [{
            dataSource: virtualData,
            startCell: 'A1'
        }]
    }]
});
spreadsheet.appendTo('#spreadsheet');

window.addEventListener('resize', onResize);

function onResize(): void {
    document.body.style.height = `${document.documentElement.clientHeight}px`;
    spreadsheet.resize();
}