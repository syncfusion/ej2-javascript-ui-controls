/**
 * Splitter feature-matrix
 */
import { Splitter } from '../../src/splitter/splitter';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base'

let splitterObj: Splitter = new Splitter({
    height: '260px',
    paneSettings: [
        { size: '30%', min: '10%', max: '60%', content: "<div class='content'><h3 class='h3'>PARIS</h3>Paris, the city of lights and love - this short guide is full of ideas for how to make the most of the romanticism...</div>" },
        { size: '40%', min: '15%', max: '80%', content: "<div class='content'><h3 class='h3'>CAMEMBERT </h3>The village in the Orne département of Normandy where the famous French cheese is originated from.</div>" },
        { size: '30%', min: '10%', max: '60%', content:  "<div class='content'><h3 class='h3'>GRENOBLE </h3>The capital city of the French Alps and a major scientific center surrounded by many ski resorts, host of the Winter Olympics in 1968.</div>"}
    ],
    width: '100%',
    created: onCreated,
    resizeStart: onResizestart,
    resizeStop: onResizestop,
    resizing: onResizing
});
splitterObj.appendTo('#splitter');

document.getElementById('clear').onclick = (): void => {
    document.getElementById('eventargs').innerText = '';
}

// Events
function onCreated() {
    let element: Element = createElement('p', { innerHTML: 'created event triggered'});
    document.getElementById('eventargs').appendChild(element);
}

function onResizestart() {
    let element: Element = createElement('p', { innerHTML: 'resizeStart event triggered'});
    document.getElementById('eventargs').appendChild(element);
}

function onResizestop() {
    let element: Element = createElement('p', { innerHTML: 'resizeStop event triggered'});
    document.getElementById('eventargs').appendChild(element);
}

function onResizing() {
    let element: Element = createElement('p', { innerHTML: 'resizing event triggered'});
    document.getElementById('eventargs').appendChild(element);
}

// Methods
document.getElementById('refresh').onclick = (): void => {
    splitterObj.refresh();
}

document.getElementById('destroy').onclick = (): void => {
    splitterObj.destroy();
}

document.getElementById('addPane').onclick = (): void => {
    let paneDetails: any = {
        size: '190px',
        content: 'New Pane',
        min: '30px',
        max: '250px',
    }
    splitterObj.addPane(paneDetails, 1);
}

document.getElementById('removePane').onclick = (): void => {
    if (!isNullOrUndefined(document.querySelector('#splitter').querySelectorAll('.e-pane-horizontal')[1])) {
        splitterObj.removePane(1);
    }
}

// Properties
document.getElementById('rtl').onclick = (): void => {  
    if(splitterObj.enableRtl) {
        splitterObj.enableRtl = false;
        document.getElementById('rtl').innerText = 'Enable RTL';
    } else {
        splitterObj.enableRtl = true;
        document.getElementById('rtl').innerText = 'Disable RTL';
    }
}

document.getElementById('enabled').onclick = (): void => {
    if(splitterObj.enabled) {
        splitterObj.enabled = false;
        document.getElementById('enabled').innerText = 'Enable';
    } else {
        splitterObj.enabled = true;
        document.getElementById('enabled').innerText = 'Disable';
    }
}

document.getElementById('height').onchange = (): void => {
    splitterObj.height = (<any>document.getElementById("height")).value;
    splitterObj.dataBind();
}

document.getElementById('width').onchange = (): void => {
    splitterObj.width = (<any>document.getElementById("width")).value;
    splitterObj.dataBind();
}

document.getElementById('cssclass').onchange = (): void => {
    splitterObj.cssClass = (<any>document.getElementById("cssclass")).value;
    splitterObj.dataBind();
}

document.getElementById('separator').onchange = (): void => {
    splitterObj.separatorSize = (<any>document.getElementById("separator")).value;
    splitterObj.dataBind();
}

document.getElementById('orientation').onchange = (): void => {
    splitterObj.orientation = (<any>document.getElementById('orientation')).value;
    splitterObj.dataBind();
}

document.getElementById('contentOk').onclick = (): void => {
    let index = (<any>document.getElementById("index")).value;
    let customSize = (<any>document.getElementById("size")).value;
    let customMin = (<any>document.getElementById("min")).value;
    let customMax = (<any>document.getElementById("max")).value;
    let customContent = (<any>document.getElementById("content")).value;
    customContent ? splitterObj.paneSettings[index].content = customContent : customContent = splitterObj.paneSettings[index].content;
    customSize ? splitterObj.paneSettings[index].size = customSize : customSize = splitterObj.paneSettings[index].size;
    customMin ? splitterObj.paneSettings[index].min = customMin : customMin = splitterObj.paneSettings[index].min;
    customMax ? splitterObj.paneSettings[index].max = customMax : customMax = splitterObj.paneSettings[index].max;
    splitterObj.dataBind();
};

document.getElementById('resize').onclick = (): void => {
    let index = (<any>document.getElementById("index")).value;
    if (index != '') {
        if(splitterObj.paneSettings[index].resizable) {
            splitterObj.paneSettings[index].resizable = false;
            document.getElementById('resize').innerText = 'Enable resize';
        } else {
            splitterObj.paneSettings[index].resizable = true;
            document.getElementById('resize').innerText = 'Disable resize';
        }
    }
};