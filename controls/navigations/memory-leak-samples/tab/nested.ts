import { Tab, SelectEventArgs } from '../../src/tab/index';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';

let itemCollection1 = [
    {
        header: { 'text': '1' },
        content: 'India officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area, the second-most populous country with over 1.2 billion people, and the most populous democracy in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the south-west, and the Bay of Bengal on the south-east, it shares land borders with Pakistan to the west;China, Nepal, and Bhutan to the north-east; and Burma and Bangladesh to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; in addition, India Andaman and Nicobar Islands share a maritime border with Thailand and Indonesia.'
    },
    {
        header: { 'text': '1' },
        content: 'Australia, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east.  <br/><br/>India is a vast South Asian country with diverse terrain – from Himalayan peaks to Indian Ocean coastline – and history reaching back 5 millennia. In the north, Mughal Empire andmarks include Delhis Red Fort complex and massive Jama Masjid mosque, plus Agras iconic Taj Mahal mausoleum. Pilgrims bathe in the Ganges in Varanasi, and Rishikesh is a yoga centre  and base for Himalayan trekking.'
    },
    {
        header: { 'text': '1' },
        content: 'The United States of America (USA or U.S.A.), commonly called the United States (US or U.S.) and America, is a federal republic consisting of fifty states and a federal district. The 48 contiguous states and the federal district of Washington, D.C. are in central North America between Canada and Mexico. The state of Alaska is west of Canada and east of Russia across the Bering Strait, and the state of Hawaii is in the mid-North Pacific. The country also has five populated and nine unpopulated territories in the Pacific and the Caribbean.'
    },
    {
        header: { 'text': '1' },
        content: 'France, officially the French Republic is a sovereign state comprising territory in western Europe and several overseas regions and territories. The European part of France, called Metropolitan France, extends from the Mediterranean Sea to the English Channel and the North Sea, and from the Rhine to the Atlantic Ocean; France covers 640,679 square kilo metres and as of August 2015 has a population of 67 million, counting all the overseas departments and territories.'
    }
];
let itemCollection2 = [
    {
        header: { 'text': '2' },
        content: 'India officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area, the second-most populous country with over 1.2 billion people, and the most populous democracy in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the south-west, and the Bay of Bengal on the south-east, it shares land borders with Pakistan to the west;China, Nepal, and Bhutan to the north-east; and Burma and Bangladesh to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; in addition, India Andaman and Nicobar Islands share a maritime border with Thailand and Indonesia.'
    },
    {
        header: { 'text': '2' },
        content: 'Australia, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east.  <br/><br/>India is a vast South Asian country with diverse terrain – from Himalayan peaks to Indian Ocean coastline – and history reaching back 5 millennia. In the north, Mughal Empire andmarks include Delhis Red Fort complex and massive Jama Masjid mosque, plus Agras iconic Taj Mahal mausoleum. Pilgrims bathe in the Ganges in Varanasi, and Rishikesh is a yoga centre  and base for Himalayan trekking.'
    },
    {
        header: { 'text': '2' },
        content: 'The United States of America (USA or U.S.A.), commonly called the United States (US or U.S.) and America, is a federal republic consisting of fifty states and a federal district. The 48 contiguous states and the federal district of Washington, D.C. are in central North America between Canada and Mexico. The state of Alaska is west of Canada and east of Russia across the Bering Strait, and the state of Hawaii is in the mid-North Pacific. The country also has five populated and nine unpopulated territories in the Pacific and the Caribbean.'
    },
    {
        header: { 'text': '2' },
        content: 'France, officially the French Republic is a sovereign state comprising territory in western Europe and several overseas regions and territories. The European part of France, called Metropolitan France, extends from the Mediterranean Sea to the English Channel and the North Sea, and from the Rhine to the Atlantic Ocean; France covers 640,679 square kilo metres and as of August 2015 has a population of 67 million, counting all the overseas departments and territories.'
    }
];
let itemCollection3 = [
    {
        header: { 'text': '3' },
        content: 'India officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area, the second-most populous country with over 1.2 billion people, and the most populous democracy in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the south-west, and the Bay of Bengal on the south-east, it shares land borders with Pakistan to the west;China, Nepal, and Bhutan to the north-east; and Burma and Bangladesh to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; in addition, India Andaman and Nicobar Islands share a maritime border with Thailand and Indonesia.'
    },
    {
        header: { 'text': '3' },
        content: 'Australia, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east.  <br/><br/>India is a vast South Asian country with diverse terrain – from Himalayan peaks to Indian Ocean coastline – and history reaching back 5 millennia. In the north, Mughal Empire andmarks include Delhis Red Fort complex and massive Jama Masjid mosque, plus Agras iconic Taj Mahal mausoleum. Pilgrims bathe in the Ganges in Varanasi, and Rishikesh is a yoga centre  and base for Himalayan trekking.'
    },
    {
        header: { 'text': '3' },
        content: 'The United States of America (USA or U.S.A.), commonly called the United States (US or U.S.) and America, is a federal republic consisting of fifty states and a federal district. The 48 contiguous states and the federal district of Washington, D.C. are in central North America between Canada and Mexico. The state of Alaska is west of Canada and east of Russia across the Bering Strait, and the state of Hawaii is in the mid-North Pacific. The country also has five populated and nine unpopulated territories in the Pacific and the Caribbean.'
    },
    {
        header: { 'text': '3' },
        content: 'France, officially the French Republic is a sovereign state comprising territory in western Europe and several overseas regions and territories. The European part of France, called Metropolitan France, extends from the Mediterranean Sea to the English Channel and the North Sea, and from the Rhine to the Atlantic Ocean; France covers 640,679 square kilo metres and as of August 2015 has a population of 67 million, counting all the overseas departments and territories.'
    }
];

document.getElementById('render').addEventListener('click', renderTab);
document.getElementById('destroy').addEventListener('click', destoryTab);

let tabObj: Tab;

function renderTab(): void {
    tabObj = new Tab({
        selected: handleSelectEvent,
        created: handleCreateEvent,
        items: [
            { header: { text: 'Nested 1' }, content: '<div id="nested1"></div>' },
            { header: { text: 'Nested 2' }, content: '<div id="nested2"></div>' },
            { header: { text: 'Nested 3' }, content: '<div id="nested3"></div>' }
        ]
    });
    tabObj.appendTo('#tab');
}

function handleCreateEvent(): void {
    if (isNOU(document.querySelector('#nested1.e-tab'))) {
        let nested1_obj: Tab = new Tab({
            items: itemCollection1
        });
        nested1_obj.appendTo('#nested1');
    }
}
function handleSelectEvent(e: SelectEventArgs): void {
    if (e.selectedIndex === 0 && isNOU(document.querySelector('#nested1.e-tab'))) {
        let nested1_obj: Tab = new Tab({
            items: itemCollection1
        });
        nested1_obj.appendTo('#nested1');
    } else if (e.selectedIndex === 1 && isNOU(document.querySelector('#nested2.e-tab'))) {
        let nested2_obj: Tab = new Tab({
            items: itemCollection2
        });
        nested2_obj.appendTo('#nested2');
    } else if (e.selectedIndex === 2 && isNOU(document.querySelector('#nested3.e-tab'))) {
        let nested3_obj: Tab = new Tab({
            items: itemCollection3
        });
        nested3_obj.appendTo('#nested3');
    }
}

function destoryTab(): void {
    const tabs: HTMLElement[] = [].slice.call(document.querySelectorAll('.e-tab.e-control')).reverse();
    if (tabs.length > 0) {
        for(const tab of tabs) {
            const instance = (tab as any).ej2_instances[0];
            instance.destroy();
            instance.element = null;
        }
    }
}
