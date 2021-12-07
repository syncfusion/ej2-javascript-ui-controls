import { Splitter } from '../../src/splitter/splitter';
import { isNullOrUndefined } from '@syncfusion/ej2-base';


let splitterObj: Splitter = new Splitter({
    height: '250px',
    paneSettings: [
        { size: '30%' },
        { size: '70%' }
    ],
    width: '100%'
});
splitterObj.appendTo('#splitter');

document.getElementById('addpane').onclick = function () {
    let paneDetails = {
        size: '190px',
        content: '<div class="content">New Pane</div>',
        min: '30px',
        max: '250px',
    }
    splitterObj.addPane(paneDetails, 1);
}

document.getElementById('removepane').onclick = function () {
    if (!isNullOrUndefined(document.querySelector('#splitter').querySelectorAll('.e-pane-horizontal')[1]))
    {
        splitterObj.removePane(1);
    }
}