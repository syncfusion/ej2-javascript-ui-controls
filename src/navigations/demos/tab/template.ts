/**
 *  Tab template sample
 */
import { Tab } from '../../src/tab/index';

let tabObj: Tab = new Tab({
    overflowMode: 'Popup',
    heightAdjustMode: 'Auto'
});
tabObj.appendTo('#templateTab');
document.getElementById('btn_touch').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByTagName('body')[0]).classList.add('e-bigger');
};
document.getElementById('btn_mouse').onclick = (e : Event) => {
    (<HTMLElement>document.getElementsByClassName('e-bigger')[0]).classList.remove('e-bigger');
};
document.getElementById('btn_high').onclick = (e : Event) => {
    document.getElementsByTagName('link')[0].href = '../../styles/highcontrast.css';
};
document.getElementById('btn_boot').onclick = (e : Event) => {
    document.getElementsByTagName('link')[0].href = '../../styles/bootstrap.css';
};
document.getElementById('btn_fabric').onclick = (e : Event) => {
    document.getElementsByTagName('link')[0].href = '../../styles/fabric.css';
};
document.getElementById('btn_material').onclick = (e : Event) => {
    document.getElementsByTagName('link')[0].href = '../../styles/material.css';
};
document.getElementById('btn_closeButton').onclick = (e : Event) => {
    if(tabObj.showCloseButton) {
        tabObj.showCloseButton = false;
    } else {
        tabObj.showCloseButton = true;
    }
    tabObj.dataBind();
};
document.getElementById('btn_enableRtl').onclick = (e : Event) => {
    if(tabObj.enableRtl) {
        tabObj.enableRtl = false;
    } else {
        tabObj.enableRtl = true;
    }
    tabObj.dataBind();
};
document.getElementById('btn_orientation').onclick = (e : Event) => {
    if(tabObj.headerPlacement == 'Top') {
        tabObj.headerPlacement = 'Bottom';
    } else {
        tabObj.headerPlacement = 'Top';
    }
    tabObj.dataBind();
};
document.getElementById('btn_default').onclick = (e : Event) => {
    removeClass();
};
document.getElementById('btn_fill').onclick = (e : Event) => {
    removeClass();
    (<HTMLElement>document.getElementsByClassName('e-tab')[0]).classList.add('e-fill');
};
document.getElementById('btn_bg').onclick = (e : Event) => {
    removeClass();
    (<HTMLElement>document.getElementsByClassName('e-tab')[0]).classList.add('e-background');
};
document.getElementById('btn_accent').onclick = (e : Event) => {
    removeClass();
    (<HTMLElement>document.getElementsByClassName('e-tab')[0]).classList.add('e-background');
    (<HTMLElement>document.getElementsByClassName('e-tab')[0]).classList.add('e-accent');
};
function removeClass() {
    let ele: HTMLElement = (<HTMLElement>document.getElementsByClassName('e-tab')[0]);
    ele.classList.remove('e-fill');
    ele.classList.remove('e-background');
    ele.classList.remove('e-accent');
}