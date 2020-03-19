/**
 *  Tab ajax sample
 */
import { Tab } from '../../src/tab/index';
import { Accordion} from '../../src/accordion/index';
import { Ajax } from '@syncfusion/ej2-base';

let tabObj: Tab;
let ajax: Ajax = new Ajax('./Ajax-content.html', 'GET', true);
ajax.send().then((data: any): void => {
    tabObj = new Tab({
        heightAdjustMode: 'Auto',
        items: [
            {
                header: { 'text': 'India' },
                content: '<div id="ej2Accordion"></div>'
            },
            {
                header: { 'text': 'Australia' },
                content: 'Australia, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east.  <br/><br/>India is a vast South Asian country with diverse terrain – from Himalayan peaks to Indian Ocean coastline – and history reaching back 5 millennia. In the north, Mughal Empire andmarks include Delhis Red Fort complex and massive Jama Masjid mosque, plus Agras iconic Taj Mahal mausoleum. Pilgrims bathe in the Ganges in Varanasi, and Rishikesh is a yoga centre  and base for Himalayan trekking.'
            },
            {
                header: { 'text': 'USA' },
                content: 'The United States of America (USA or U.S.A.), commonly called the United States (US or U.S.) and America, is a federal republic consisting of fifty states and a federal district. The 48 contiguous states and the federal district of Washington, D.C. are in central North America between Canada and Mexico. The state of Alaska is west of Canada and east of Russia across the Bering Strait, and the state of Hawaii is in the mid-North Pacific. The country also has five populated and nine unpopulated territories in the Pacific and the Caribbean.'
            },
            {
                header: { 'text': 'France' },
                content: data
            }
        ]
    });
    tabObj.appendTo('#ej2Tab');
    let ajax1: Ajax = new Ajax('./Ajax-content.html', 'GET', true);
    ajax1.send().then((data: any): void => {
        let ctn0: string = 'Australia, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east.  <br/><br/>India is a vast South Asian country with diverse terrain – from Himalayan peaks to Indian Ocean coastline – and history reaching back 5 millennia. In the north, Mughal Empire andmarks include Delhis Red Fort complex and massive Jama Masjid mosque, plus Agras iconic Taj Mahal mausoleum. Pilgrims bathe in the Ganges in Varanasi, and Rishikesh is a yoga centre  and base for Himalayan trekking.';
        let ctn1: string = 'The United States of America (USA or U.S.A.), commonly called the United States (US or U.S.) and America, is a federal republic consisting of fifty states and a federal district. The 48 contiguous states and the federal district of Washington, D.C. are in central North America between Canada and Mexico. The state of Alaska is west of Canada and east of Russia across the Bering Strait, and the state of Hawaii is in the mid-North Pacific. The country also has five populated and nine unpopulated territories in the Pacific and the Caribbean.';
        let ctn2: string = data;
        let acrdnObj: Accordion = new Accordion({
            expandMode: 'Single',
            items: [
                { header: 'Australia', content: ctn0, expanded: true },
                { header: 'USA', content: ctn1 },
                { header: 'France', content: ctn2}
            ]
        });
        acrdnObj.appendTo('#ej2Accordion');
    });
});

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