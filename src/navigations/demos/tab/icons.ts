/**
 *  Tab icons Sample
 */
import { Tab } from '../../src/tab/index';

let tabObj1: Tab = new Tab({
    items: [
        {
            header: { 'text':'bold', 'iconCss': 'e-bold' },
            content: 'Bold, bold face, or bold font is any text that is darkened to help emphasize a remark or comment. For example, this is bold text. If your browser supports bold text, the previous words "bold text" should have been in bold lettering.'
        },
        {
            header: { 'text': 'Cut', 'iconCss': 'e-cut' },
            content: 'In the case of items inside a file, Cut deletes the content from the screen, but keeps it in memory'
        },
        {
            header: { 'text': 'Copy', 'iconCss': 'e-copy' },
            content: 'Makes a duplicate of the original file, which can be moved or edited without altering the original.'
        },
        {
            header: { 'text': 'Paste', 'iconCss': 'e-paste' },
            content: 'Used to make a cut or copied item appear again at a specific location.'
        }
    ]
});
tabObj1.appendTo('#iconsDefault');

let tabObj2: Tab = new Tab({
    items: [
        {
            header: { 'iconCss': 'e-bold' },
            content: 'Bold, bold face, or bold font is any text that is darkened to help emphasize a remark or comment. For example, this is bold text. If your browser supports bold text, the previous words "bold text" should have been in bold lettering.'
        },
        {
            header: { 'iconCss': 'e-cut' },
            content: 'In the case of items inside a file, Cut deletes the content from the screen, but keeps it in memory'
        },
        {
            header: { 'iconCss': 'e-copy' },
            content: 'Makes a duplicate of the original file, which can be moved or edited without altering the original.'
        },
        {
            header: { 'iconCss': 'e-paste' },
            content: 'Used to make a cut or copied item appear again at a specific location.'
        }
    ]
});
tabObj2.appendTo('#icons');
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
    if(tabObj1.showCloseButton) {
        tabObj1.showCloseButton = false;
        tabObj2.showCloseButton = false;
    } else {
        tabObj1.showCloseButton = true;
        tabObj2.showCloseButton = true;
    }
    tabObj1.dataBind();
    tabObj2.dataBind();
};
document.getElementById('btn_enableRtl').onclick = (e : Event) => {
    if(tabObj1.enableRtl) {
        tabObj1.enableRtl = false;
        tabObj2.enableRtl = false;
    } else {
        tabObj1.enableRtl = true;
        tabObj2.enableRtl = true;
    }
    tabObj1.dataBind();
    tabObj2.dataBind();
};
document.getElementById('btn_orientation').onclick = (e : Event) => {
    if(tabObj1.headerPlacement == 'Top') {
        tabObj1.headerPlacement = 'Bottom';
        tabObj2.headerPlacement = 'Bottom';
    } else {
        tabObj1.headerPlacement = 'Top';
        tabObj2.headerPlacement = 'Top';
    }
    tabObj1.dataBind();
    tabObj2.dataBind();
};
document.getElementById('btn_default').onclick = (e : Event) => {
    removeClass();
};
document.getElementById('btn_fill').onclick = (e : Event) => {
    removeClass();
    (<HTMLElement>document.getElementsByClassName('e-tab')[0]).classList.add('e-fill');
    (<HTMLElement>document.getElementsByClassName('e-tab')[1]).classList.add('e-fill');
};
document.getElementById('btn_bg').onclick = (e : Event) => {
    removeClass();
    (<HTMLElement>document.getElementsByClassName('e-tab')[0]).classList.add('e-background');
    (<HTMLElement>document.getElementsByClassName('e-tab')[1]).classList.add('e-background');
};
document.getElementById('btn_accent').onclick = (e : Event) => {
    removeClass();
    (<HTMLElement>document.getElementsByClassName('e-tab')[0]).classList.add('e-background');
    (<HTMLElement>document.getElementsByClassName('e-tab')[1]).classList.add('e-background');
    (<HTMLElement>document.getElementsByClassName('e-tab')[0]).classList.add('e-accent');
    (<HTMLElement>document.getElementsByClassName('e-tab')[1]).classList.add('e-accent');
};
function removeClass() {
    let ele: HTMLElement = (<HTMLElement>document.getElementsByClassName('e-tab')[0]);
    ele.classList.remove('e-fill');
    ele.classList.remove('e-background');
    ele.classList.remove('e-accent');
    let ele1: HTMLElement = (<HTMLElement>document.getElementsByClassName('e-tab')[1]);
    ele1.classList.remove('e-fill');
    ele1.classList.remove('e-background');
    ele1.classList.remove('e-accent');
}