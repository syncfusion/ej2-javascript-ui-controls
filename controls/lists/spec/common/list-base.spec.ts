import { ListBase, ListBaseOptions } from '../../src/common/list-base';
import { extend, isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';

/**
 * ListBase Spec
 */
let minimalDs_string: { [key: string]: Object }[] = [
    { text: 'text1' },
    { text: 'text2' },
    { text: 'text3' },
];

let minimalDs_number: { [key: string]: Object }[] = [
    { text: 1 },
    { text: 2 },
    { text: 3 },
];

let data_source: { [key: string]: Object }[] = [
    {
        id: '01', text: 'text1',
        tooltip: 'title1', iconCss: 'iconClass1',
        imageUrl: 'base/spec/img/img1.jpg', imageAttributes: { height: '200px' },
        htmlAttributes: { role: 'li-1', class: 'base base1', uid: 1111 },
        url: 'https://www.google.com', urlAttributes: {
            role: 'li-1',
            class: 'base base1', uid: 1111
        }, enabled: false, isVisible: false
    },
    {
        id: null, text: null, tooltip: null,
        iconCss: null, imageUrl: null, htmlAttributes: null,
        url: null, urlAttributes: null,
        enabled: null, isVisible: null
    },
    {
        id: undefined, text: undefined,
        tooltip: undefined, iconCss: undefined, imageUrl: undefined, htmlAttributes: undefined,
        url: undefined, urlAttributes: undefined,
        enabled: true, isVisible: true
    },
    {
        id_mapping: '04', text_mapping: 'text4',
        tooltip_mapping: 'title4', iconCss_mapping: 'iconClass4',
        imageUrl_mapping: 'base/spec/img/img4.jpg', imageAttributes_mapping: { height: '200px' },
        htmlAttributes_mapping: { role: 'li-4', class: 'base base4', uid: 4444 },
        url_mapping: 'https://www.google.com', urlAttributes_mapping: { role: 'li-4', class: 'base base4', uid: 4444 },
        enabled_mapping: false, isVisible_mapping: false
    },
    {
        id: '05', text: 'text5',
        tooltip: 'title5', iconCss: 'iconClass5',
        imageUrl: 'base/spec/img/img1.jpg',
        htmlAttributes: { role: 'li-1', uid: 1111 },
        url: 'https://www.google.com', enabled: false, isVisible: false
    },
];

let nested_dataSource: { [key: string]: Object }[] = [
    {
        id: '01', text: 'text1',
        child: [{
            id: '01_1', text: 'subText1',
            child: [{ id: '01_1_1', text: 'nestedText1' },
            { id: '01_1_2', text: 'nestedText2' }]
        },
        { id: '01_2', text: 'subText2' },
        { id: '01_3', text: 'subText3' }]
    },
    {
        id: '02', text: 'text2', child: null
    },
    {
        id: '03', text: 'text3', child: undefined
    },
    {
        id: '04', text: 'text4',
        child_mapping: [{ id: '01_1', text: 'subText1' },
        { id: '01_2', text: 'subText2' },
        { id: '01_3', text: 'subText3' }]
    },
];

let group_dataSource: { [key: string]: Object }[] = [
    { id: '01', text: 'GTC4', category: 'Ferrari' },
    { id: '02', text: 'a3', category: 'Audi' },
    { id: '03', text: 'r8', category: 'Audi' },
    { id: '04', text: 'g3', category: 'BMW' },
    { id: '05', text: 'series2', category: 'BMW' },
];


function deepCloning(data: { [key: string]: object }[]) {
    return <{ [key: string]: object }[]>extend([], data, [], true);
}

describe('ListBase', () => {

    describe('createListItemFromArray method', () => {

        it('Listitem creation', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            expect(listCollection.length).toBe(2);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
        });

        it('Listitem creation with empty dataSource', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, []);
            expect(listCollection.length).toBe(0);
        });

        it('Listitem creation with null/undefined dataSource', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, [undefined]);
            expect(listCollection.length).toBe(0);
        });

        it('ListItem class names', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
            expect((firstListItem.children[0]).classList.contains('e-text-content')).toBe(true);
            expect((firstListItem.children[0].children[0]).classList.contains('e-list-text')).toBe(true);
        });

        it('ListItem attributes', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.getAttribute('role')).toBe('presentation');
            expect(isNullOrUndefined(firstListItem.getAttribute('data-uid'))).toBe(false);
            expect(firstListItem.children[0].getAttribute('role')).toBe('presentation');
            expect(firstListItem.children[0].children[0].getAttribute('role')).toBe('list-item');

        });

        it('ListItem TextContent with array of string', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.children[0].children[0].textContent).toBe('item1');

        });

        it('ListItem TextContent with array of number', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, [1, 2]);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.children[0].children[0].textContent).toBe('1');

        });

        it('ListItem structure (tag)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.children[0].tagName).toBe('DIV');
            expect(firstListItem.children[0].children[0].tagName).toBe('SPAN');
        });

        it('ListItem Aria attributes', () => {
            let option: ListBaseOptions = { ariaAttributes: { itemRole: 'treeView', itemText: 'treeItem', wrapperRole: 'tree-wrapper' } };
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], false, option);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.getAttribute('role')).toBe('treeView');
            expect(firstListItem.children[0].getAttribute('role')).toBe('tree-wrapper');
            expect(firstListItem.children[0].children[0].getAttribute('role')).toBe('treeItem');

        });

        it('ListItem creation (isSinglelevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], true);
            let firstListItem: HTMLElement = listCollection[0];
            expect(listCollection.length).toEqual(2);
            expect(firstListItem.children.length).toBe(0);
            expect(firstListItem.tagName).toBe('LI');
        });

        it('ListItem class names (isSinglelevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], true);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
        });

        it('ListItem attributes (isSinglelevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], true);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.getAttribute('role')).toBe('option');
            expect(isNullOrUndefined(firstListItem.getAttribute('id'))).toBe(false);
            expect(firstListItem.getAttribute('data-value')).toBe('item1');

        });

        it('ListItem TextContent with array of string (isSinglelevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.textContent).toBe('item1');
        });

        it('ListItem TextContent with array of number (isSinglelevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, [1, 2]);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.textContent).toBe('1');
        });

        it('Callback function', () => {
            let arrayData: string[] = ['Text'];
            let option: ListBaseOptions = {
                itemCreated: (e: { [key: string]: string }) => {
                    expect(e.dataSource).toBe(arrayData);
                    expect(e.curData).toBe(arrayData[0]);
                    expect(e.text).toBe(arrayData[0]);
                },
                itemCreating: (e: { [key: string]: string }) => {
                    expect(e.dataSource).toBe(arrayData);
                    expect(e.curData).toBe(arrayData[0]);
                    expect(e.text).toBe(arrayData[0]);
                    e.curData = "aaa"
                }
            }

            ListBase.createListItemFromArray(createElement, arrayData, false, option);
        });

        it('moduleclass names', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], false, { moduleName: 'menu' });
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-menu-item')).toBe(true);
            expect((firstListItem.children[0].children[0]).classList.contains('e-menu-text')).toBe(true);
        });

        it('module class names (isSinglelevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], true, { moduleName: 'menu' });
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-menu-item')).toBe(true);
        });

        it('DOM order', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
            expect(firstListItem.children[0].tagName).toBe('DIV');
            expect(firstListItem.children[0].classList.contains('e-text-content')).toBe(true);
            expect(firstListItem.children[0].children[0].tagName).toBe('SPAN');
            expect(firstListItem.children[0].children[0].classList.contains('e-list-text')).toBe(true);
        });

        it('DOM order (isSinglelevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], true);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
            expect(firstListItem.children.length).toBe(0);
        });
    });

    describe('generateUL', () => {
        it('UL element creation', () => {
            let liItem: HTMLElement = document.createElement('li');
            let ul: HTMLElement = ListBase.generateUL(createElement, [liItem]);
            expect(ul.tagName).toBe('UL');
            expect(ul.children.length).toBe(1);
            expect(ul.classList.contains('e-ul')).toBe(true);
            expect(ul.classList.contains('e-list-parent')).toBe(true);
            expect(ul.getAttribute('role')).toBe('presentation');
        });

        it('UL - ClassName', () => {
            let liItem: HTMLElement = document.createElement('li');
            let ul: HTMLElement = ListBase.generateUL(createElement, [liItem], 'e-list base');
            expect(ul.classList.contains('e-ul')).toBe(true);
            expect(ul.classList.contains('e-list-parent')).toBe(true);
            expect(ul.classList.contains('e-list')).toBe(true);
            expect(ul.classList.contains('base')).toBe(true);
        });

        it('UL - with and without Aria attributes', () => {
            let liItem: HTMLElement = document.createElement('li');
            let ul_withAriaAtrribute: HTMLElement = ListBase.generateUL(createElement, [liItem], '', { ariaAttributes: { listRole: 'ul' } });
            expect(ul_withAriaAtrribute.getAttribute('role')).toBe('ul');
            let ul_withoutAriaAtrribute: HTMLElement = ListBase.generateUL(createElement, [liItem], '', { ariaAttributes: { listRole: '' } });
            expect(ul_withoutAriaAtrribute.hasAttribute('role')).toBe(false);

        });
    });

    describe('createListFromArray method', () => {

        it('UL element creation', () => {
            let ulElement: HTMLElement = ListBase.createListFromArray(createElement, ['item1', 'item2']);
            expect(ulElement.tagName).toBe('UL');
            let listCollection: HTMLCollection = ulElement.children
            expect(listCollection.length).toBe(2);
            let firstListItem: HTMLElement = listCollection[0] as HTMLElement;
            expect(firstListItem.tagName).toBe('LI');
        });

    });

    describe('createListItemFromJson method', () => {
        it('Listitem creation', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string));
            expect(listCollection.length).toBe(3);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
        });

        it('Listitem creation with empty dataSource', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, []);
            expect(listCollection.length).toBe(0);
        });

        it('Listitem creation with null/undefined dataSource', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, [undefined]);
            expect(listCollection.length).toBe(0);
        });

        it('ListItem class names', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string));
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
            expect(firstListItem.classList.contains('e-level-1')).toBe(true);
            expect((firstListItem.children[0]).classList.contains('e-text-content')).toBe(true);
            expect((firstListItem.children[0].children[0]).classList.contains('e-list-text')).toBe(true);
        });
        it('ListItem attributes', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string));
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.getAttribute('role')).toBe('presentation');
            expect(firstListItem.getAttribute('aria-level')).toBe('1');
            expect(isNullOrUndefined(firstListItem.getAttribute('data-uid'))).toBe(false);
            expect(firstListItem.children[0].getAttribute('role')).toBe('presentation');
            expect(firstListItem.children[0].children[0].getAttribute('role')).toBe('list-item');

        });

        it('ListItem TextContent with array of string', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string));
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.children[0].children[0].textContent).toBe('text1');

        });

        it('ListItem TextContent with array of number', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_number));
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.children[0].children[0].textContent).toBe('1');

        });

        it('ListItem structure (tag)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string))
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.children[0].tagName).toBe('DIV');
            expect(firstListItem.children[0].children[0].tagName).toBe('SPAN');
        });

        it('ListItem (with & without) Aria attributes & level with flat list', () => {
            let option_withAria: ListBaseOptions = { ariaAttributes: { level: 2, itemRole: 'treeView', itemText: 'treeItem', wrapperRole: 'tree-wrapper' } };
            let listCollection_withAria: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string), option_withAria);
            let firstListItem_withAria: HTMLElement = listCollection_withAria[0];
            expect(firstListItem_withAria.getAttribute('role')).toBe('treeView');
            expect(firstListItem_withAria.getAttribute('aria-level')).toBe('2');
            expect(firstListItem_withAria.classList.contains('e-level-2')).toBe(true);
            expect(firstListItem_withAria.children[0].getAttribute('role')).toBe('tree-wrapper');
            expect(firstListItem_withAria.children[0].children[0].getAttribute('role')).toBe('treeItem');
            let option_withoutAria: ListBaseOptions = { ariaAttributes: { itemRole: '', itemText: '', wrapperRole: '' } };
            let listCollection_withoutAria: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string), option_withoutAria);
            let firstListItem_withoutAria: HTMLElement = listCollection_withoutAria[0];
            expect(firstListItem_withoutAria.hasAttribute('role')).toBe(false);
            expect(firstListItem_withoutAria.getAttribute('aria-level')).toBe('1');
            expect(firstListItem_withoutAria.classList.contains('e-level-1')).toBe(true);
            expect(firstListItem_withoutAria.children[0].hasAttribute('role')).toBe(false);
            expect(firstListItem_withoutAria.children[0].children[0].hasAttribute('role')).toBe(false);
        });

        it('ListItem ID attributes with normal, null and undefined input', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source));
            let firstIdAttribute: string = listCollection[0].getAttribute('data-uid');
            let secondIdAttribute: string = listCollection[1].getAttribute('data-uid');
            let thirdIdAttribute: string = listCollection[2].getAttribute('data-uid');
            expect(firstIdAttribute).toBe('01');
            expect(isNullOrUndefined(secondIdAttribute)).toBe(false);
            expect(isNullOrUndefined(thirdIdAttribute)).toBe(false);
            let mapping: ListBaseOptions = { fields: { id: 'id_mapping' } };
            let fourthIdAttribute: string = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping)[3].getAttribute('data-uid');
            expect(fourthIdAttribute).toBe('04');
        });

        it('ListItem icon element with normal, null and undefined input', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source), { showIcon: true });
            let firstIconElement: HTMLElement = <HTMLElement>listCollection[0].querySelector('.e-list-icon');
            let secondIconElement: HTMLElement = <HTMLElement>listCollection[1].querySelector('.e-list-icon');
            let thirdIconElement: HTMLElement = <HTMLElement>listCollection[2].querySelector('.e-list-icon');
            expect(firstIconElement.tagName).toBe('DIV');
            expect(firstIconElement.classList.contains('iconClass1')).toBe(true);
            expect(secondIconElement).toBe(null);
            expect(thirdIconElement).toBe(null);
            let mapping: ListBaseOptions = { showIcon: true, fields: { iconCss: 'iconCss_mapping' } };
            let fourthIconElement: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping)[3].querySelector('.e-list-icon');
            expect(fourthIconElement.tagName).toBe('DIV');
            expect(fourthIconElement.classList.contains('iconClass4')).toBe(true);
        });

        it('ListItem tooltip with normal, null and undefined input', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source));
            let firstTooltipContent: string = listCollection[0].getAttribute('title');
            let secondTooltipContent: boolean = listCollection[1].hasAttribute('title');
            let thirdTooltipContent: boolean = listCollection[2].hasAttribute('title');
            expect(firstTooltipContent).toBe('title1');
            expect(secondTooltipContent).toBe(false);
            expect(thirdTooltipContent).toBe(false);
            let mapping: ListBaseOptions = { fields: { tooltip: 'tooltip_mapping' } };
            let fourthTooltipContent: string = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping)[3].getAttribute('title');
            expect(fourthTooltipContent).toBe('title4');
        });

        it('ListItem text content with normal, null and undefined input', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source));
            let firstTextContent: string = listCollection[0].querySelector('.e-list-text').textContent;
            let secondTextContent: string = listCollection[1].querySelector('.e-list-text').textContent;
            let thirdTextContent: string = listCollection[2].querySelector('.e-list-text').textContent;
            expect(firstTextContent).toBe('text1');
            expect(secondTextContent).toBe('');
            expect(thirdTextContent).toBe('');
            let mapping: ListBaseOptions = { fields: { text: 'text_mapping' } };
            let fourthTextContent: string = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping)[3].querySelector('.e-list-text').textContent;
            expect(fourthTextContent).toBe('text4');
        });

        it('ListItem - img url and img attr with normal, null and undefined input', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source));
            let firstImgElement: HTMLImageElement = listCollection[0].querySelector('.e-list-img');
            let secondImgElement: HTMLImageElement = listCollection[1].querySelector('.e-list-img');
            let thirdImgElement: HTMLImageElement = listCollection[2].querySelector('.e-list-img');
            expect(firstImgElement.tagName).toBe('IMG');
            expect(firstImgElement.src.indexOf('base/spec/img/img1.jpg')).not.toBe(-1);
            expect(firstImgElement.getAttribute('height')).toBe('200px');
            expect(secondImgElement).toBe(null);
            expect(thirdImgElement).toBe(null);
            let mapping: ListBaseOptions = { fields: { imageUrl: 'imageUrl_mapping', imageAttributes: 'imageAttributes_mapping' } };
            let fourthImgElement: HTMLImageElement = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping)[3].querySelector('.e-list-img');
            expect(fourthImgElement.tagName).toBe('IMG');
            expect(fourthImgElement.src.indexOf('base/spec/img/img4.jpg')).not.toBe(-1);
            expect(fourthImgElement.getAttribute('height')).toBe('200px');
        });

        it('ListItem - html attr with normal, null and undefined input', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source));
            expect(listCollection[0].classList.contains('base')).toBe(true);
            expect(listCollection[0].classList.contains('base1')).toBe(true);
            expect(listCollection[0].getAttribute('role')).toBe('li-1');
            expect(listCollection[0].getAttribute('uid')).toBe('1111');
            expect(listCollection[1].getAttribute('role')).toBe('presentation');
            expect(listCollection[1].hasAttribute('uid')).toBe(false);
            expect(listCollection[2].getAttribute('role')).toBe('presentation');
            expect(listCollection[2].hasAttribute('uid')).toBe(false);
            let mapping: ListBaseOptions = { fields: { htmlAttributes: 'htmlAttributes_mapping' } };
            let mappedListItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping)[3];
            expect(mappedListItem.classList.contains('base')).toBe(true);
            expect(mappedListItem.classList.contains('base4')).toBe(true);
            expect(mappedListItem.getAttribute('role')).toBe('li-4');
            expect(mappedListItem.getAttribute('uid')).toBe('4444');
        });

        it('ListItem - URL link & URL attr with normal, null and undefined input', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source));
            let firstanchorElement: HTMLImageElement = listCollection[0].querySelector('.e-list-url');
            let secondanchorElement: HTMLImageElement = listCollection[1].querySelector('.e-list-url');
            let thirdanchorElement: HTMLImageElement = listCollection[2].querySelector('.e-list-url');
            expect(firstanchorElement.tagName).toBe('A');
            expect(firstanchorElement.classList.contains('base')).toBe(true);
            expect(firstanchorElement.classList.contains('e-list-text')).toBe(true);
            expect(firstanchorElement.classList.contains('base1')).toBe(true);
            expect(firstanchorElement.getAttribute('role')).toBe('li-1');
            expect(firstanchorElement.getAttribute('uid')).toBe('1111');
            expect(firstanchorElement.getAttribute('href')).toBe('https://www.google.com');
            expect(secondanchorElement).toBe(null);
            expect(thirdanchorElement).toBe(null);
            let mapping: ListBaseOptions = { fields: { urlAttributes: 'urlAttributes_mapping', url: 'url_mapping' } };
            let fourthanchorElement: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping)[3].querySelector('.e-list-url');
            expect(fourthanchorElement.tagName).toBe('A');
            expect(fourthanchorElement.classList.contains('base')).toBe(true);
            expect(fourthanchorElement.classList.contains('e-list-text')).toBe(true);
            expect(fourthanchorElement.classList.contains('base4')).toBe(true);
            expect(fourthanchorElement.getAttribute('role')).toBe('li-4');
            expect(fourthanchorElement.getAttribute('uid')).toBe('4444');
            expect(fourthanchorElement.getAttribute('href')).toBe('https://www.google.com');
        });

        it('ListItem - checkbox', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source), { showCheckBox: true });
            let checkboxElement: HTMLInputElement = listCollection[0].querySelector('.e-list-check');
            expect(checkboxElement.tagName).toBe('INPUT');
            expect(checkboxElement.getAttribute('type')).toBe('checkbox');
        });

        it('ListItem - enabled', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source));
            expect(listCollection[0].classList.contains('e-disabled')).toBe(true);
            expect(listCollection[1].classList.contains('e-disabled')).toBe(false);
            expect(listCollection[2].classList.contains('e-disabled')).toBe(false);
            let mapping: ListBaseOptions = { fields: { enabled: 'enabled_mapping' } };
            let mappedItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping)[3];
            expect(mappedItem.classList.contains('e-disabled')).toBe(true);
        });

        it('ListItem - isVisible', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source));
            expect(listCollection[0].style.display).toBe('none');
            expect(listCollection[1].style.display).not.toBe('none');
            expect(listCollection[2].style.display).not.toBe('none');
            let mapping: ListBaseOptions = { fields: { isVisible: 'isVisible_mapping' } };
            let mappedItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping)[3];
            expect(mappedItem.style.display).toBe('none');
        });

        it('ListItem - nestedList', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(nested_dataSource));
            expect(listCollection[0].classList.contains('e-has-child')).toBe(true);
            expect(listCollection[1].classList.contains('e-has-child')).toBe(false);
            expect(listCollection[2].classList.contains('e-has-child')).toBe(false);
            let mapping: ListBaseOptions = { fields: { child: 'child_mapping' } };
            let mappedItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(nested_dataSource), mapping)[3];
            expect(mappedItem.classList.contains('e-has-child')).toBe(true);
        });

        it('ListItem - processSubChild', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(nested_dataSource), { processSubChild: true });
            let firstLevelListItem: HTMLElement = listCollection[0];
            expect(firstLevelListItem.classList.contains('e-has-child')).toBe(true);
            expect(firstLevelListItem.classList.contains('e-level-1')).toBe(true);
            expect(firstLevelListItem.getAttribute('aria-level')).toBe('1');
            let secondLevelList: HTMLElement = firstLevelListItem.querySelector('ul');
            expect(secondLevelList.classList.contains('e-ul')).toBe(true);
            expect(secondLevelList.classList.contains('e-list-parent')).toBe(true);
            expect(secondLevelList.children.length).toBe(3);
            let secondLevelListItem: Element = secondLevelList.children[0];
            expect(secondLevelListItem.tagName).toBe('LI');
            expect(secondLevelListItem.classList.contains('e-has-child')).toBe(true);
            expect(secondLevelListItem.classList.contains('e-level-2')).toBe(true);
            expect(secondLevelListItem.getAttribute('aria-level')).toBe('2');
            let thirdLevelList: HTMLElement = secondLevelListItem.querySelector('ul');
            expect(thirdLevelList.classList.contains('e-ul')).toBe(true);
            expect(thirdLevelList.classList.contains('e-list-parent')).toBe(true);
            expect(thirdLevelList.children.length).toBe(2);
            let thirdLevelListItem: Element = thirdLevelList.children[0];
            expect(thirdLevelListItem.tagName).toBe('LI');
            expect(thirdLevelListItem.classList.contains('e-has-child')).toBe(false);
            expect(thirdLevelListItem.classList.contains('e-level-3')).toBe(true);
            expect(thirdLevelListItem.getAttribute('aria-level')).toBe('3');
            expect(thirdLevelListItem.querySelector('ul')).toBe(null);
        });

        it('ListItem - expandCollapse', () => {
            let listCollection_right: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(nested_dataSource), { expandCollapse: true });
            let expandCollapseRightElement: Element = listCollection_right[0].querySelector('.e-list-text').nextElementSibling;
            expect(expandCollapseRightElement.parentElement.classList.contains('e-icon-wrapper')).toBe(true);
            expect(expandCollapseRightElement.tagName).toBe('DIV');
            expect(expandCollapseRightElement.classList.contains('e-icons')).toBe(true);
            expect(expandCollapseRightElement.classList.contains('e-icon-collapsible')).toBe(true);
            let listCollection_left: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(nested_dataSource), { expandCollapse: true, expandIconClass: 'e-icon-expandable', expandIconPosition: 'Left' });
            let expandCollapseLeftElement: Element = listCollection_left[0].querySelector('.e-list-text').previousElementSibling;
            expect(expandCollapseLeftElement.parentElement.classList.contains('e-icon-wrapper')).toBe(true);
            expect(expandCollapseLeftElement.tagName).toBe('DIV');
            expect(expandCollapseLeftElement.classList.contains('e-icons')).toBe(true);
            expect(expandCollapseLeftElement.classList.contains('e-icon-expandable')).toBe(true);
        });


        it('ListItem - groupList', () => {
            let ds: { [key: string]: object }[] = ListBase.groupDataSource(group_dataSource, { groupBy: 'category' });
            expect(ds.length).toBe(8);
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, ds);
            let grouplistItem: HTMLElement[] = Array.prototype.filter.call(listCollection, (li: HTMLElement) => li.classList.contains('e-list-group-item'));
            let listItem: HTMLElement[] = Array.prototype.filter.call(listCollection, (li: HTMLElement) => li.classList.contains('e-list-item'));
            expect(listCollection.length).toBe(ds.length);
            expect(grouplistItem.length).toBe(3);
            expect(listItem.length).toBe(5);
            expect(listCollection.length).toBe(ds.length);
            let groupListItem: HTMLElement = listCollection[0];
            expect(groupListItem.tagName).toBe('LI');
            expect(groupListItem.classList.contains('e-list-group-item')).toBe(true);
            expect(groupListItem.classList.contains('e-level-1')).toBe(true);
            expect((groupListItem.children[0]).classList.contains('e-text-content')).toBe(true);
            expect((groupListItem.children[0].children[0]).classList.contains('e-list-text')).toBe(true);
            expect(groupListItem.getAttribute('role')).toBe('group');
            expect(groupListItem.getAttribute('aria-level')).toBe('1');
            expect(isNullOrUndefined(groupListItem.getAttribute('data-uid'))).toBe(false);
            expect(groupListItem.children[0].getAttribute('role')).toBe('presentation');
            expect(groupListItem.children[0].children[0].getAttribute('role')).toBe('list-item');
            expect(groupListItem.children[0].children[0].textContent).toBe('Ferrari');
            expect(listCollection[1].classList.contains('e-list-group-item')).toBe(false);
            expect(listCollection[1].children[0].children[0].textContent).toBe('GTC4');
        });

        it('ListItem Aria attributes & level with group list', () => {
            let ds: { [key: string]: object }[] = ListBase.groupDataSource(group_dataSource, { groupBy: 'category' });
            let option: ListBaseOptions = { ariaAttributes: { level: 2, groupItemRole: 'tree-group', itemRole: 'treeView', itemText: 'treeItem', wrapperRole: 'tree-wrapper' } };
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, ds, option);
            let groupListItem: HTMLElement = listCollection[0];
            expect(groupListItem.getAttribute('role')).toBe('tree-group');
            expect(groupListItem.getAttribute('aria-level')).toBe('2');
            expect(groupListItem.classList.contains('e-level-2')).toBe(true);
            expect(groupListItem.children[0].getAttribute('role')).toBe('tree-wrapper');
            expect(groupListItem.children[0].children[0].getAttribute('role')).toBe('treeItem');
        });

        it('Callback function', () => {
            let jsonData: { [key: string]: string }[] = [{ text: 'Text', value: '01' }];
            let option: ListBaseOptions = {
                itemCreated: (e: { [key: string]: Object }) => {
                    expect(e.dataSource).toBe(jsonData);
                    expect(e.curData).toBe(jsonData[0]);
                    expect(e.text).toBe(jsonData[0].text);

                },
                itemCreating: (e: { [key: string]: Object }) => {
                    expect(e.dataSource).toBe(jsonData);
                    expect(e.curData).toBe(jsonData[0]);
                    expect(e.text).toBe(jsonData[0].text);
                    e.text = "mari"
                }
            }

            ListBase.createListItemFromJson(createElement, jsonData, option);
        });

        it('Callback function - Changing value in itemCreating event', () => {
            let data: { [key: string]: Object }[] = [
                { id: 'data01', text: 'Cut', iconCss: 'e-icons e-cut' }
            ];
            let listCollection: Element[] = ListBase.createListItemFromJson(createElement, data, {
                itemCreating: (e: { [key: string]: { [key: string]: Object } }) => {
                    e.curData.text = 'Paste';
                    e.curData.id = 'data02';
                    e.curData.iconCss = 'e-icons e-paste';
                },
                showIcon: true
            });
            expect(listCollection[0].querySelector('.e-list-icon').classList.contains('e-paste')).toBe(true);
            expect(listCollection[0].querySelector('.e-list-text').textContent).toBe('Paste');
            expect(listCollection[0].getAttribute('data-uid')).toBe('data02');
        });

        it('Listitem creation (isSingleLevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string), {}, 1, true);
            expect(listCollection.length).toBe(3);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
        });

        it('ListItem class names (isSingleLevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string), {}, 1, true);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
        });
        it('ListItem attributes (isSingleLevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string), {}, 1, true);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.getAttribute('role')).toBe('option');
            expect(isNullOrUndefined(firstListItem.getAttribute('id'))).toBe(false);
        });

        it('ListItem (with & without) Aria attributes & level with flat list (isSingleLevel) wrong', () => {
            let option_withAria: ListBaseOptions = { ariaAttributes: { itemRole: 'treeView' } };
            let listCollection_withAria: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string), option_withAria, 1, true);
            let firstListItem_withAria: HTMLElement = listCollection_withAria[0];
            expect(firstListItem_withAria.getAttribute('role')).toBe('option');
            let option_withoutAria: ListBaseOptions = { ariaAttributes: { itemRole: '', groupItemRole: '' } };
            let listCollection_withoutAria: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string), option_withoutAria, 1, true);
            let firstListItem_withoutAria: HTMLElement = listCollection_withoutAria[0];
            expect(firstListItem_withoutAria.getAttribute('role')).toBe('option');
        });
        it('ListItem TextContent with array of string (isSingleLevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string), {}, 1, true);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.textContent).toBe('text1');

        });

        it('ListItem TextContent with array of number (isSingleLevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_number), {}, 1, true);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.textContent).toBe('1');

        });

        it('ListItem structure (tag)(isSingleLevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDs_string), {}, 1, true);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.children.length).toBe(0);
        });

        it('ListItem icon element with normal, null and undefined input (isSingleLevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source), { showIcon: true }, 1, true);
            let firstIconElement: HTMLElement = <HTMLElement>listCollection[0].querySelector('.e-list-icon');
            let secondIconElement: HTMLElement = <HTMLElement>listCollection[1].querySelector('.e-list-icon');
            let thirdIconElement: HTMLElement = <HTMLElement>listCollection[2].querySelector('.e-list-icon');
            expect(firstIconElement.tagName).toBe('SPAN');
            expect(firstIconElement.classList.contains('iconClass1')).toBe(true);
            expect(secondIconElement).toBe(null);
            expect(thirdIconElement).toBe(null);
            let mapping: ListBaseOptions = { showIcon: true, fields: { iconCss: 'iconCss_mapping' } };
            let fourthIconElement: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping, 1, true)[3].querySelector('.e-list-icon');
            expect(fourthIconElement.tagName).toBe('SPAN');
            expect(fourthIconElement.classList.contains('iconClass4')).toBe(true);
        });


        it('ListItem - enabled (isSingleLevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source), {}, 1, true);
            expect(listCollection[0].classList.contains('e-disabled')).toBe(true);
            expect(listCollection[1].classList.contains('e-disabled')).toBe(false);
            expect(listCollection[2].classList.contains('e-disabled')).toBe(false);
            let mapping: ListBaseOptions = { fields: { enabled: 'enabled_mapping' } };
            let mappedItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping, 1, true)[3];
            expect(mappedItem.classList.contains('e-disabled')).toBe(true);
        });

        it('ListItem - html attr with normal, null and undefined input (isSingleLevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source), {}, 1, true);
            expect(listCollection[0].classList.contains('base')).toBe(true);
            expect(listCollection[0].classList.contains('base1')).toBe(true);
            expect(listCollection[0].getAttribute('role')).toBe('li-1');
            expect(listCollection[0].getAttribute('uid')).toBe('1111');
            expect(listCollection[1].getAttribute('role')).toBe('option');
            expect(listCollection[1].hasAttribute('uid')).toBe(false);
            expect(listCollection[2].getAttribute('role')).toBe('option');
            expect(listCollection[2].hasAttribute('uid')).toBe(false);
            let mapping: ListBaseOptions = { fields: { htmlAttributes: 'htmlAttributes_mapping' } };
            let mappedListItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping, 1, true)[3];
            expect(mappedListItem.classList.contains('base')).toBe(true);
            expect(mappedListItem.classList.contains('base4')).toBe(true);
            expect(mappedListItem.getAttribute('role')).toBe('li-4');
            expect(mappedListItem.getAttribute('uid')).toBe('4444');
        });

        it('ListItem - URL link & URL attr with normal, null and undefined input (isSingleLevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source), {}, 1, true);
            let firstanchorElement: HTMLImageElement = listCollection[0].querySelector('.e-list-url');
            let secondanchorElement: HTMLImageElement = listCollection[1].querySelector('.e-list-url');
            let thirdanchorElement: HTMLImageElement = listCollection[2].querySelector('.e-list-url');
            expect(firstanchorElement.tagName).toBe('A');
            expect(firstanchorElement.classList.contains('base')).toBe(true);
            expect(firstanchorElement.classList.contains('e-list-text')).toBe(true);
            expect(firstanchorElement.classList.contains('base1')).toBe(true);
            expect(firstanchorElement.getAttribute('role')).toBe('li-1');
            expect(firstanchorElement.getAttribute('uid')).toBe('1111');
            expect(firstanchorElement.getAttribute('href')).toBe('https://www.google.com');
            expect(secondanchorElement).toBe(null);
            expect(thirdanchorElement).toBe(null);
            let mapping: ListBaseOptions = { fields: { urlAttributes: 'urlAttributes_mapping', url: 'url_mapping' } };
            let fourthanchorElement: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(data_source), mapping, 1, true)[3].querySelector('.e-list-url');
            expect(fourthanchorElement.tagName).toBe('A');
            expect(fourthanchorElement.classList.contains('base')).toBe(true);
            expect(fourthanchorElement.classList.contains('e-list-text')).toBe(true);
            expect(fourthanchorElement.classList.contains('base4')).toBe(true);
            expect(fourthanchorElement.getAttribute('role')).toBe('li-4');
            expect(fourthanchorElement.getAttribute('uid')).toBe('4444');
            expect(fourthanchorElement.getAttribute('href')).toBe('https://www.google.com');
        });
        it('ListItem - groupList (isSingleLevel)', () => {
            let ds: { [key: string]: object }[] = ListBase.groupDataSource(group_dataSource, { groupBy: 'category' });
            expect(ds.length).toBe(8);
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, ds, {}, 1, true);
            let grouplistItem: HTMLElement[] = Array.prototype.filter.call(listCollection, (li: HTMLElement) => li.classList.contains('e-list-group-item'));
            let listItem: HTMLElement[] = Array.prototype.filter.call(listCollection, (li: HTMLElement) => li.classList.contains('e-list-item'));
            expect(listCollection.length).toBe(ds.length);
            expect(grouplistItem.length).toBe(3);
            expect(listItem.length).toBe(5);
            expect(listCollection.length).toBe(ds.length);
            let groupListItem: HTMLElement = listCollection[0];
            expect(groupListItem.tagName).toBe('LI');
            expect(groupListItem.classList.contains('e-list-group-item')).toBe(true);
            expect(groupListItem.getAttribute('role')).toBe('group');
            expect(isNullOrUndefined(groupListItem.getAttribute('id'))).toBe(false);
            expect(groupListItem.textContent).toBe('Ferrari');
            expect(listCollection[1].classList.contains('e-list-group-item')).toBe(false);
            expect(listCollection[1].textContent).toBe('GTC4');
        });

        it('ListItem Aria attributes & level with group list (isSingleLevel)', () => {
            let ds: { [key: string]: object }[] = ListBase.groupDataSource(group_dataSource, { groupBy: 'category' });
            let option: ListBaseOptions = { ariaAttributes: { groupItemRole: 'tree-group' } };
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, ds, option, 1, true);
            let groupListItem: HTMLElement = listCollection[0];
            expect(groupListItem.getAttribute('role')).toBe('tree-group');
        });

        it('ListItem - Template', () => {
            let option: ListBaseOptions = { template: '<div class="${iconCss_mapping}" role="${htmlAttributes_mapping.role}" id="${urlAttributes_mapping.uid}"><span id="${abc}">${text_mapping}</span></div>' };
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning([data_source[3]]), option);
            let listItem: HTMLElement = listCollection[0];
            expect(listItem.tagName).toBe('LI');
            let templateElemet: Element = listItem.children[0];
            expect(templateElemet.tagName).toBe('DIV');
            expect(templateElemet.classList.contains('iconClass4')).toBe(true);
            expect(templateElemet.getAttribute('role')).toBe('li-4');
            expect(templateElemet.getAttribute('id')).toBe('4444');
            expect(templateElemet.children.length).toBe(1);
            expect(templateElemet.children[0].tagName).toBe('SPAN');
            expect(templateElemet.children[0].getAttribute('id')).toBe('undefined');
            expect(templateElemet.children[0].textContent).toBe('text4');
        });

        it('ListItem - Group Template', () => {
            let ds: { [key: string]: object }[] = ListBase.groupDataSource([data_source[3]], { groupBy: 'text_mapping' });
            let option: ListBaseOptions = { groupTemplate: '<div class="${items[0].iconCss_mapping}" role="${items[0].htmlAttributes_mapping.role}" id="${items[0].urlAttributes_mapping.uid}"><span id="${abc}">${text}</span></div>' };
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, ds, option);
            let groupListItem: HTMLElement = listCollection[0];
            expect(groupListItem.tagName).toBe('LI');
            let templateElemet: Element = groupListItem.children[0];
            expect(templateElemet.tagName).toBe('DIV');
            expect(templateElemet.classList.contains('iconClass4')).toBe(true);
            expect(templateElemet.getAttribute('role')).toBe('li-4');
            expect(templateElemet.getAttribute('id')).toBe('4444');
            expect(templateElemet.children.length).toBe(1);
            expect(templateElemet.children[0].tagName).toBe('SPAN');
            expect(templateElemet.children[0].getAttribute('id')).toBe('undefined');
            expect(templateElemet.children[0].textContent).toBe('text4');
        });

        it('DOM order', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source), { showIcon: true, showCheckBox: true, });
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
            expect(firstListItem.children[0].tagName).toBe('DIV');
            expect(firstListItem.children[0].classList.contains('e-text-content')).toBe(true);
            expect(firstListItem.children[0].children[0].tagName).toBe('INPUT');
            expect(firstListItem.children[0].children[0].classList.contains('e-list-check')).toBe(true);
            expect(firstListItem.children[0].children[1].tagName).toBe('DIV');
            expect(firstListItem.children[0].children[1].classList.contains('e-list-icon')).toBe(true);
            expect(firstListItem.children[0].children[2].tagName).toBe('IMG');
            expect(firstListItem.children[0].children[2].classList.contains('e-list-img')).toBe(true);
            expect(firstListItem.children[0].children[3].tagName).toBe('A');
            expect(firstListItem.children[0].children[3].classList.contains('e-list-url')).toBe(true);
        });

        it('DOM order (isSinglelevel)', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(data_source), { showIcon: true, showCheckBox: true }, 1, true);
            let firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
            expect(firstListItem.children[0].tagName).toBe('INPUT');
            expect(firstListItem.children[0].classList.contains('e-list-check')).toBe(true);
            expect(firstListItem.children[1].tagName).toBe('SPAN');
            expect(firstListItem.children[1].classList.contains('e-list-icon')).toBe(true);
            expect(firstListItem.children[2].tagName).toBe('A');
            expect(firstListItem.children[2].classList.contains('e-list-url')).toBe(true);
        });

    });

    describe('createListFromJSON method', () => {

        it('UL element creation', () => {
            let ulElement: HTMLElement = ListBase.createListFromJson(createElement, deepCloning(minimalDs_number));
            expect(ulElement.tagName).toBe('UL');
            let listCollection: HTMLCollection = ulElement.children
            expect(listCollection.length).toBe(3);
            let firstListItem: HTMLElement = listCollection[0] as HTMLElement;
            expect(firstListItem.tagName).toBe('LI');
        });

    });

    describe('createList method', () => {

        it('List creation - String[]', () => {
            let ulElement: HTMLElement = ListBase.createList(createElement, ['text1', 'text2']);
            expect(ulElement.tagName).toBe('UL');
            let listCollection: HTMLCollection = ulElement.children
            expect(listCollection.length).toBe(2);
            let firstListItem: HTMLElement = listCollection[0] as HTMLElement;
            expect(firstListItem.tagName).toBe('LI');
        });

        it('List creation - Number[]', () => {
            let ulElement: HTMLElement = ListBase.createList(createElement, [1, 2, 3]);
            expect(ulElement.tagName).toBe('UL');
            let listCollection: HTMLCollection = ulElement.children
            expect(listCollection.length).toBe(3);
            let firstListItem: HTMLElement = listCollection[0] as HTMLElement;
            expect(firstListItem.tagName).toBe('LI');
        });

        it('List creation - Json[]', () => {
            let ulElement: HTMLElement = ListBase.createList(createElement, deepCloning(minimalDs_number));
            expect(ulElement.tagName).toBe('UL');
            let listCollection: HTMLCollection = ulElement.children
            expect(listCollection.length).toBe(3);
            let firstListItem: HTMLElement = listCollection[0] as HTMLElement;
            expect(firstListItem.tagName).toBe('LI');
        });

    });

    describe('createJsonFromElement method', () => {
        it('JSON data creation  - List', () => {
            let UL: HTMLElement = document.createElement('ul');
            UL.innerHTML = '<li>item1</li><li>item2</li>';
            let dataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL);
            expect(dataSource.length).toBe(2);
            expect(dataSource[0].text).toBe('item1');
            expect(isNullOrUndefined(dataSource[0].id)).toBe(false);
            expect(dataSource[1].text).toBe('item2');
            expect(isNullOrUndefined(dataSource[1].id)).toBe(false);
            let mappedDataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL, { fields: { text: 'name', id: 'uid' } });
            expect(mappedDataSource.length).toBe(2);
            expect(mappedDataSource[0].name).toBe('item1');
            expect(isNullOrUndefined(mappedDataSource[0].uid)).toBe(false);
            expect(mappedDataSource[1].name).toBe('item2');
            expect(isNullOrUndefined(mappedDataSource[1].uid)).toBe(false);
        });

        it('JSON data creation  - List with anchor tag', () => {
            let UL: HTMLElement = document.createElement('ul');
            UL.innerHTML = '<li><a>item1<a/></li><li><a>item2</a></li>';
            let dataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL);
            expect(dataSource.length).toBe(2);
            expect(dataSource[0].text).toBe('item1');
            expect(isNullOrUndefined(dataSource[0].id)).toBe(false);
            expect(dataSource[1].text).toBe('item2');
            expect(isNullOrUndefined(dataSource[1].id)).toBe(false);
            let mappedDataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL, { fields: { text: 'name', id: 'uid' } });
            expect(mappedDataSource.length).toBe(2);
            expect(mappedDataSource[0].name).toBe('item1');
            expect(isNullOrUndefined(mappedDataSource[0].uid)).toBe(false);
            expect(mappedDataSource[1].name).toBe('item2');
            expect(isNullOrUndefined(mappedDataSource[1].uid)).toBe(false);
        });

        it('JSON data with html attributes', () => {
            let UL: HTMLElement = document.createElement('ul');
            UL.innerHTML = '<li id="default" class = "list level-1" >item1</li><li id="sub">item2</li>';
            let dataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL);
            expect((dataSource[0].htmlAttributes as { [key: string]: {} }).class).toBe('list level-1');
            expect((dataSource[0].htmlAttributes as { [key: string]: {} }).id).toBe(undefined);
            expect(dataSource[0].id).toBe('default');
            expect(dataSource[1].htmlAttributes).toBe(undefined);
            expect(dataSource[1].id).toBe('sub');
            let mappedDataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL, { fields: { htmlAttributes: 'attr', id: 'uid' } });
            expect((mappedDataSource[0].attr as { [key: string]: {} }).class).toBe('list level-1');
            expect((mappedDataSource[0].attr as { [key: string]: {} }).id).toBe(undefined);
            expect(mappedDataSource[0].uid).toBe('default');
            expect(mappedDataSource[1].attr).toBe(undefined);
            expect(mappedDataSource[1].uid).toBe('sub');

        });

        it('JSON data with URL && HTML attributes', () => {
            let UL: HTMLElement = document.createElement('ul');
            UL.innerHTML = '<li id="default" class = "list level-1" ><a href = "www.google.com" >google</a></li><li id = "sub" ><a href = "www.yahoo.com">yahoo</a></li>';
            let dataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL);
            expect((dataSource[0].htmlAttributes as { [key: string]: {} }).class).toBe('list level-1');
            expect((dataSource[0].htmlAttributes as { [key: string]: {} }).id).toBe(undefined);
            expect(dataSource[0].id).toBe('default');
            expect(dataSource[1].htmlAttributes).toBe(undefined);
            expect(dataSource[1].id).toBe('sub');
            expect((dataSource[0].urlAttributes as { [key: string]: {} }).href).toBe('www.google.com');
            expect((dataSource[1].urlAttributes as { [key: string]: {} }).href).toBe('www.yahoo.com');
            let mappedDataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL, { fields: {id: 'uid', htmlAttributes: 'attr', urlAttributes: 'url' } });
            expect((mappedDataSource[0].attr as { [key: string]: {} }).class).toBe('list level-1');
            expect((mappedDataSource[0].attr as { [key: string]: {} }).id).toBe(undefined);
            expect(mappedDataSource[0].uid).toBe('default');
            expect(mappedDataSource[1].attr).toBe(undefined);
            expect(mappedDataSource[1].uid).toBe('sub');
            expect((mappedDataSource[0].url as { [key: string]: {} }).href).toBe('www.google.com');
            expect((mappedDataSource[1].url as { [key: string]: {} }).href).toBe('www.yahoo.com');
        });

        it('sub level child creation', () => {
            let UL: HTMLElement = document.createElement('ul');
            UL.innerHTML = '<li>item1<ul><li>sub1</li><li>sub2</li><li>sub3</li></ul></li>' +
                '<li>item2</li><li>item3</li><li>item4</li><li>item5</li>' +
                '<li>item6</li><li>item7</li>';
            let dataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL);
            expect(dataSource.length).toBe(7);
            expect((dataSource[0].child as { [key: string]: {} }).length).toBe(3);
            expect(dataSource[0].text).toBe('item1');
            expect(((dataSource[0].child as { [key: string]: {} })[0] as { [key: string]: {} }).text).toBe('sub1');
            let mappedDataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL, { fields: { child: 'sub', text: 'name' } });
            expect(mappedDataSource.length).toBe(7);
            expect((mappedDataSource[0].sub as { [key: string]: {} }).length).toBe(3);
            expect(mappedDataSource[0].name).toBe('item1');
            expect(((mappedDataSource[0].sub as { [key: string]: {} })[0] as { [key: string]: {} }).name).toBe('sub1');
        });
    });

    describe('getSiblingLI  method', () => {
        let UL: HTMLElement = document.createElement('ul');
        UL.id = 'uls';
        UL.innerHTML = '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
            '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';
        document.body.appendChild(UL);

        it('get next sibling', () => {
            let li: HTMLElement = <HTMLElement>UL.querySelector('#i4');
            let nextLI: HTMLElement = <HTMLElement>UL.querySelector('#i5');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li)).toBe(nextLI);
        });

        it('get previous sibling', () => {
            let li: HTMLElement = <HTMLElement>UL.querySelector('#i4');
            let prevLI: HTMLElement = <HTMLElement>UL.querySelector('#i3');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li, true)).toBe(prevLI);
        });

        it('get previous visible sibling', () => {
            let li: HTMLElement = <HTMLElement>UL.querySelector('#i3');
            let prevLI: HTMLElement = <HTMLElement>UL.querySelector('#s3');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li, true)).toBe(prevLI);
        });

        it('get next visible sibling', () => {
            let li: HTMLElement = <HTMLElement>UL.querySelector('#s3');
            let nextLI: HTMLElement = <HTMLElement>UL.querySelector('#i3');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li)).toBe(nextLI);
        });

        it('get first visible li from array', () => {
            let li: HTMLElement = <HTMLElement>UL.querySelector('#s');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li)).toBe(UL.querySelector('#uls>li:first-child'));
        });

        it('get last visible li from array', () => {
            let li: HTMLElement = <HTMLElement>UL.querySelector('#s');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li, true)).toBe(UL.querySelector('#uls>li:last-child'));
        });

        it('get siblings li when no array list', () => {
            let li: HTMLElement = <HTMLElement>UL.querySelector('#s');
            expect(ListBase.getSiblingLI([], li)).toBe(undefined);
        });
    });

    describe('indexOf method', () => {
        let UL: HTMLElement = document.createElement('ul');
        UL.id = 'uls';
        UL.innerHTML = '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
            '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';
        document.body.appendChild(UL);

        it('li from node list', () => {
            let li: HTMLElement = <HTMLElement>UL.querySelector('#i4');
            expect(ListBase.indexOf(li, UL.querySelectorAll('#uls>li'))).toBe(3);
        });

        it('li not in list', () => {
            let li: HTMLElement = <HTMLElement>UL.querySelector('#i4');
            expect(ListBase.indexOf(li, UL.querySelectorAll('p'))).toBe(-1);
        });

        it('element is empty', () => {
            let li: HTMLElement = <HTMLElement>UL.querySelector('#i');
            expect(ListBase.indexOf(li, UL.querySelectorAll('li'))).toBe(undefined);
        });

    });

    describe('generateIcon method', (): void => {

        it('DOM structure', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['text']);
            let liItem: HTMLElement = ListBase.generateIcon(createElement, listCollection[0]);
            let iconElement: Element = liItem.querySelector('.e-list-text').nextElementSibling;
            expect(iconElement.tagName).toBe('DIV');
            expect(iconElement.classList.contains('e-icons')).toBe(true);
            expect(iconElement.classList.contains('e-icon-collapsible')).toBe(true);
        });

        it('with additional class name', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, [1]);
            let liItem: HTMLElement = ListBase.generateIcon(createElement, listCollection[0], 'e-level');
            let iconElement: Element = liItem.querySelector('.e-list-text').nextElementSibling;
            expect(iconElement.classList.contains('e-icons')).toBe(true);
            expect(iconElement.classList.contains('e-icon-collapsible')).toBe(true);
            expect(iconElement.classList.contains('e-level')).toBe(true);
        });

        it('with customized expand collapse class name', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, [{ text: 'text' }]);
            let liItem: HTMLElement = ListBase.generateIcon(createElement, listCollection[0], 'e-level', { expandIconClass: 'e-icon-expandable' });
            let iconElement: Element = liItem.querySelector('.e-list-text').nextElementSibling;
            expect(iconElement.classList.contains('e-icons')).toBe(true);
            expect(iconElement.classList.contains('e-icon-collapsible')).toBe(false);
            expect(iconElement.classList.contains('e-icon-expandable')).toBe(true);
            expect(iconElement.classList.contains('e-level')).toBe(true);
        });

        it('with expandIconPosition option', () => {
            let listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['text']);
            let liItem: HTMLElement = ListBase.generateIcon(createElement, listCollection[0], '', { expandIconPosition: 'Left' });
            let iconElement: Element = liItem.querySelector('.e-list-text').previousElementSibling;
            expect(iconElement.tagName).toBe('DIV');
            expect(iconElement.classList.contains('e-icons')).toBe(true);
            expect(iconElement.classList.contains('e-icon-collapsible')).toBe(true);
        });

    });

    describe('addSorting method', (): void => {

        it('default', () => {
            let newDS: { [key: string]: number | object }[] = ListBase.getDataSource(minimalDs_number, ListBase.addSorting('None', 'text'));
            expect(newDS[0].text).toBe(1);
            expect(newDS[1].text).toBe(2);
            expect(newDS[2].text).toBe(3);
        });

        it('sorting order by ascending', () => {
            let newDS: { [key: string]: number | object }[] = ListBase.getDataSource(minimalDs_number, ListBase.addSorting('Ascending', 'text'));
            expect(newDS[0].text).toBe(1);
            expect(newDS[1].text).toBe(2);
            expect(newDS[2].text).toBe(3);
        });

        it('sorting order by descending', () => {
            let newDS: { [key: string]: number | object }[] = ListBase.getDataSource(minimalDs_number, ListBase.addSorting('Descending', 'text'));
            expect(newDS[0].text).toBe(3);
            expect(newDS[1].text).toBe(2);
            expect(newDS[2].text).toBe(1);
        });

        it('sorting order with wrong query', () => {
           let listQuery: Query = ListBase.addSorting(undefined, 'text',new Query().search('VI', ['CustomerID']));
           expect(listQuery.queries[0].fn).not.toBe('onSortBy');
        });

    });

    describe('groupDataSource method', (): void => {
        it('default', () => {
            let newDS: { [key: string]: object | string | boolean | string[] }[] = ListBase.groupDataSource(group_dataSource, { groupBy: 'category' });
            expect(newDS.length).toBe(8);
            expect(newDS[0].text).toBe('Ferrari');
            expect(newDS[0].isHeader).toBe(true);
            expect((newDS[0].items as string[]).length).toBe(1);
            expect(newDS[2].text).toBe('Audi');
            expect(newDS[2].isHeader).toBe(true);
            expect((newDS[2].items as string[]).length).toBe(2);
            expect(newDS[5].text).toBe('BMW');
            expect(newDS[5].isHeader).toBe(true);
            expect((newDS[5].items as string[]).length).toBe(2);

        });

        it('ascending order', () => {
            let newDS: { [key: string]: object | string | boolean | string[] }[] = ListBase.groupDataSource(group_dataSource, { groupBy: 'category' }, 'Ascending');
            expect(newDS.length).toBe(8);
            expect(newDS[0].text).toBe('Audi');
            expect(newDS[0].isHeader).toBe(true);
            expect((newDS[0].items as string[]).length).toBe(2);
            expect(newDS[3].text).toBe('BMW');
            expect(newDS[3].isHeader).toBe(true);
            expect((newDS[3].items as string[]).length).toBe(2);
            expect(newDS[6].text).toBe('Ferrari');
            expect(newDS[6].isHeader).toBe(true);
            expect((newDS[6].items as string[]).length).toBe(1);

        });

        it('descending order', () => {
            let newDS: { [key: string]: object | string | boolean | string[] }[] = ListBase.groupDataSource(group_dataSource, { groupBy: 'category' }, 'Descending');
            expect(newDS.length).toBe(8);
            expect(newDS[0].text).toBe('Ferrari');
            expect(newDS[0].isHeader).toBe(true);
            expect((newDS[0].items as string[]).length).toBe(1);
            expect(newDS[2].text).toBe('BMW');
            expect(newDS[2].isHeader).toBe(true);
            expect((newDS[2].items as string[]).length).toBe(2);
            expect(newDS[5].text).toBe('Audi');
            expect(newDS[5].isHeader).toBe(true);
            expect((newDS[5].items as string[]).length).toBe(2);

        });

        it('ListItem - groupList with no category', () => {
            let data: { [key: string]: string }[] = [{ id: '01', text: 'GTC4', category: 'Ferrari' },
            { id: '02', text: 'a3' }]
            let ds: { [key: string]: object }[] = ListBase.groupDataSource(data, { groupBy: 'category' });
            expect(ds.length).toBe(4);
        });
    });


    describe('renderContentTemplate method', () => {
        it('ListItem creation', () => {
            let template: string = '<div class="name" id ="${id}">${text}</div>';
            let ul: HTMLElement = ListBase.renderContentTemplate(createElement, template, deepCloning([data_source[0]]), { value: 'text' });
            let liItem = ul.children[0];
            expect(ul.tagName).toBe('UL');
            expect(ul.classList.contains('e-list-parent')).toBe(true);
            expect(ul.classList.contains('e-ul')).toBe(true);
            expect(ul.getAttribute('role')).toBe('presentation');
            expect(liItem.tagName).toBe('LI');
            expect(liItem.classList.contains('e-list-item')).toBe(true);
            expect(liItem.getAttribute('role')).toBe('option');
            expect(liItem.getAttribute('data-value')).toBe('text1');
            let templateElement: Element = liItem.children[0];
            expect(templateElement.tagName).toBe('DIV');
            expect(templateElement.classList.contains('name')).toBe(true);
            expect(templateElement.getAttribute("id")).toBe('01');
            expect(templateElement.textContent).toBe('text1');
        });

        it('Group ListItem creation - ', () => {
            let template: string = '<div class="name">${text}</div>';
            let ds: { [key: string]: Object }[] = ListBase.groupDataSource(group_dataSource, { groupBy: 'category' });
            let ul: HTMLElement = ListBase.renderContentTemplate(createElement, template, ds, { value: 'text' });
            let groupLiItem = ul.children[0];
            let liItem = ul.children[1];
            expect(ul.tagName).toBe('UL');
            expect(ul.classList.contains('e-list-parent')).toBe(true);
            expect(ul.classList.contains('e-ul')).toBe(true);
            expect(ul.getAttribute('role')).toBe('presentation');
            expect(groupLiItem.tagName).toBe('LI');
            expect(groupLiItem.classList.contains('e-list-group-item')).toBe(true);
            expect(groupLiItem.getAttribute('role')).toBe('presentation');
            expect(groupLiItem.textContent).toBe('Ferrari');
            expect(liItem.tagName).toBe('LI');
            expect(liItem.classList.contains('e-list-item')).toBe(true);
            expect(liItem.getAttribute('role')).toBe('option');
            expect(liItem.getAttribute('data-value')).toBe('GTC4');
            let templateElement: Element = liItem.children[0];
            expect(templateElement.tagName).toBe('DIV');
            expect(templateElement.classList.contains('name')).toBe(true);
            expect(templateElement.textContent).toBe('GTC4');
        });

        it('Callback function', () => {
            let template: string = '<div class="name" id ="${id}">${text}</div>';
            let options: ListBaseOptions = {
                itemCreating: (args: { [key: string]: Object }) => {
                    expect(args.text).toBe('text1');
                    (args.curData as { [key: string]: string }).text = 'customText'
                },
                itemCreated: (args: { [key: string]: Object }) => {
                    expect(args.text).toBe('customText');
                }
            };
            let ul: HTMLElement = ListBase.renderContentTemplate(createElement, template, deepCloning([data_source[0]]), { value: 'text' }, options);
            let templateElement: Element = ul.children[0].children[0];
            expect(templateElement.tagName).toBe('DIV');
            expect(templateElement.classList.contains('name')).toBe(true);
            expect(templateElement.getAttribute("id")).toBe('01');
            expect(templateElement.textContent).toBe('customText');
        });
    });

    describe('renderGroupTemplate method', () => {
        it('ListItem creation', () => {
            let template: string = '<div class="name" id ="${id}">${text}</div>';
            let ds: { [key: string]: Object }[] = ListBase.groupDataSource(group_dataSource, { groupBy: 'category' });
            let ul: HTMLElement = ListBase.renderContentTemplate(createElement, template, ds, { value: 'text' });
            let groupListCollections: Element[] = Array.prototype.slice.call(ul.querySelectorAll('.e-list-group-item'));
            expect(groupListCollections.length).toBe(3);
            let groupTemplate: string = '<div class="header">${category}</div>';
            let groupLi: Element[] = ListBase.renderGroupTemplate(groupTemplate, ds, { groupBy: 'category' }, groupListCollections);
            expect(groupLi[0].tagName).toBe('LI');
            expect(groupLi[0].classList.contains('e-list-group-item')).toBe(true);
            expect(groupLi[0].getAttribute('role')).toBe('presentation');
            expect(isNullOrUndefined(groupLi[0].getAttribute('id'))).toBe(false);
            let groupTemplateElement: Element = groupLi[0].children[0];
            expect(groupTemplateElement.tagName).toBe('DIV');
            expect(groupTemplateElement.classList.contains('header')).toBe(true);
            expect(groupTemplateElement.textContent).toBe('Ferrari');
        });
    });
});