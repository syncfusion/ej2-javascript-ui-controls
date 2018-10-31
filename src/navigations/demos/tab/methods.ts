/**
 *  Tab methods Sample
 */
import { Tab } from '../../src/tab/index';

let tabObj: Tab = new Tab({
    heightAdjustMode: 'Auto',
    items: [
        {
            header: { 'text': 'India' },
            content: 'India officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area, the second-most populous country with over 1.2 billion people, and the most populous democracy in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the south-west, and the Bay of Bengal on the south-east, it shares land borders with Pakistan to the west;China, Nepal, and Bhutan to the north-east; and Burma and Bangladesh to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; in addition, India Andaman and Nicobar Islands share a maritime border with Thailand and Indonesia.'
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
            content: 'France, officially the French Republic is a sovereign state comprising territory in western Europe and several overseas regions and territories. The European part of France, called Metropolitan France, extends from the Mediterranean Sea to the English Channel and the North Sea, and from the Rhine to the Atlantic Ocean; France covers 640,679 square kilo metres and as of August 2015 has a population of 67 million, counting all the overseas departments and territories.'
        }
    ],
    
});
tabObj.appendTo('#ej2Tab');

document.getElementById('btnEnableTab').onclick = (e : Event) => {
    let index: number = Number((<HTMLInputElement> document.getElementById('enableIndex')).value);
    tabObj.enableTab(index, true);
};
document.getElementById('btnDisableTab').onclick = (e : Event) => {
    let index: number = Number((<HTMLInputElement> document.getElementById('enableIndex')).value);
    tabObj.enableTab(index, false);
};
document.getElementById('btnAddTab').onclick = (e : Event) => {
    let item: object[] = [{ header: { 'text': 'IND' }, content: 'India' },
        { header: { 'text': 'US' }, content: 'USA' },
        { header: { 'text': 'FR' }, content: 'France' } ];
    let index: number = Number((<HTMLInputElement> document.getElementById('addIndex')).value);
    tabObj.addTab(item, index);
};
document.getElementById('btnRemoveTab').onclick = (e : Event) => {
    let index: number = Number((<HTMLInputElement> document.getElementById('removeIndex')).value);
    tabObj.removeTab(index);
};
document.getElementById('btnHideTab').onclick = (e : Event) => {
    let index: number = Number((<HTMLInputElement> document.getElementById('hideIndex')).value);
    tabObj.hideTab(index, true);
};
document.getElementById('btnShowTab').onclick = (e : Event) => {
    let index: number = Number((<HTMLInputElement> document.getElementById('hideIndex')).value);
    tabObj.hideTab(index, false);
};
document.getElementById('btnSelect').onclick = (e : Event) => {
    let index: number = Number((<HTMLInputElement> document.getElementById('selectIndex')).value);
    tabObj.select(index);
};
document.getElementById('btnDisable').onclick = (e : Event) => {
    tabObj.disable(true);
};
document.getElementById('btnEnable').onclick = (e : Event) => {
    tabObj.disable(false);
};
document.getElementById('btnDestroy').onclick = (e : Event) => {
    tabObj.destroy();
};

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