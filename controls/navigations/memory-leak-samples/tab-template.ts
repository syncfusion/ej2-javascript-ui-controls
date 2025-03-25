import { Tab } from '../src/tab/index';

document.getElementById('render').addEventListener('click', renderTab);
document.getElementById('destroy').addEventListener('click', destoryTab);

let tabObj: Tab;

function renderTab(): void {
    tabObj = new Tab({
        heightAdjustMode: 'Auto',
        items: [
            {
                header: { 'text': '<div id="france" >France</div>' },
                content: '<div id="france-content">France, officially the French Republic is a sovereign state comprising territory in western Europe and several overseas regions and territories. The European part of France, called Metropolitan France, extends from the Mediterranean Sea to the English Channel and the North Sea, and from the Rhine to the Atlantic Ocean; France covers 640,679 square kilo metres and as of August 2015 has a population of 67 million, counting all the overseas departments and territories.</div>'
            },
            {
                header: { 'text': 'India' },
                content: '.indiaClass'
            },
            {
                header: { 'text': 'Australia' },
                content: '#australiaId'
            },
            {
                header: { 'text': 'USA' },
                content: document.getElementById('usaElement')
            }
        ],
        destroyed: () => {
            if (!(tabObj as any).refreshing && tabObj.items && tabObj.items.length > 0) {
                for (let i: number = 0; i < tabObj.items.length; i++) {
                    if (typeof (tabObj.items[i].content) == 'object' && (tabObj.items[i].content as any).getAttribute('id') == 'usaElement') {
                        tabObj.items[i] = null;
                    }
                }
            }
        }
    });
    tabObj.appendTo('#tab');
}

function destoryTab(): void {
    if (tabObj) {
        tabObj.destroy();
        tabObj = null;
    }
}
