import { ListBaseOptions, ListBase } from '../../src/common/list-base';
import { extend, isNullOrUndefined, createElement } from '@syncfusion/ej2-base';
import { Query } from '@syncfusion/ej2-data';

/**
 * ListBase Spec
 */
const minimalDsString: { [key: string]: Object }[] = [
    { text: 'text1' },
    { text: 'text2' },
    { text: 'text3' }
];

const minimalDsNumber: { [key: string]: Object }[] = [
    { text: 1 },
    { text: 2 },
    { text: 3 }
];

const nullValueDataSource: { [key: string]: Object } =  {
    id: '01', text: null,
    tooltip: 'title1', iconCss: 'iconClass1',
    imageUrl: 'base/spec/img/img1.jpg', imageAttributes: { height: '200px' },
    htmlAttributes: { role: 'li-1', class: 'base base1', uid: 1111 },
    url: 'https://www.google.com', urlAttributes: {
        role: 'li-1',
        class: 'base base1', uid: 1111
    }, enabled: false, isVisible: false
};

const dataSource: { [key: string]: Object }[] = [
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
        idMapping: '04', textMapping: 'text4',
        tooltipMapping: 'title4', iconCssMapping: 'iconClass4',
        imageUrlMapping: 'base/spec/img/img4.jpg', imageAttributesMapping: { height: '200px' },
        htmlAttributesMapping: { role: 'li-4', class: 'base base4', uid: 4444 },
        urlMapping: 'https://www.google.com', urlAttributesMapping: { role: 'li-4', class: 'base base4', uid: 4444 },
        enabledMapping: false, isVisibleMapping: false
    },
    {
        id: '05', text: 'text5',
        tooltip: 'title5', iconCss: 'iconClass5',
        imageUrl: 'base/spec/img/img1.jpg',
        htmlAttributes: { role: 'li-1', uid: 1111 },
        url: 'https://www.google.com', enabled: false, isVisible: false
    }
];

const nestedDataSource: { [key: string]: Object }[] = [
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
        childMapping: [{ id: '01_1', text: 'subText1' },
            { id: '01_2', text: 'subText2' },
            { id: '01_3', text: 'subText3' }]
    }
];

const groupdataSources: { [key: string]: Object }[] = [
    { id: '01', text: 'GTC4', category: 'Ferrari' },
    { id: '02', text: 'a3', category: 'Audi' },
    { id: '03', text: 'r8', category: 'Audi' },
    { id: '04', text: 'g3', category: 'BMW' },
    { id: '05', text: 'series2', category: 'BMW' }
];

const nullValueGroupDataSource: { [key: string]: Object }[] = [
    { id: '01', text: null, category: 'Ferrari' },
    { id: '02', text: 'a3', category: 'Audi' },
    { id: '03', text: 'r8', category: 'Audi' },
    { id: '04', text: 'g3', category: 'BMW' },
    { id: '05', text: 'series2', category: 'BMW' }
];

const fullRowDatasourceFalse: { [key: string]: Object }[] = [
    { id: '01', text: 'list1' },
    { id: '02', text: 'list2' },
    { id: '03', text: 'list3' },
    { id: '04', text: 'list4' },
    { id: '05', text: 'list5' }
];

const fullRowDatasourceTrue: { [key: string]: Object }[] = [
    { id: '01', text: 'list1', url: 'https:google.com', imageUrl: 'imageUrlMapping', iconCss: 'sample-icon' },
    { id: '02', text: 'list2', url: 'https:google.com', imageUrl: 'imageUrlMapping', iconCss: 'sample-icon' },
    { id: '03', text: 'list3', url: 'https:google.com', imageUrl: 'imageUrlMapping', iconCss: 'sample-icon' },
    { id: '04', text: 'list4', url: 'https:google.com', imageUrl: 'imageUrlMapping', iconCss: 'sample-icon' },
    { id: '05', text: 'list5', url: 'https:google.com', imageUrl: 'imageUrlMapping', iconCss: 'sample-icon' }
];

// eslint-disable-next-line
function deepCloning(data: { [key: string]: object }[]) {
    return <{ [key: string]: object }[]>extend([], data, [], true);
}

describe('ListBase', () => {

    describe('ListBase.createListItemFromArray method', () => {

        it('Listitem creation', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            expect(listCollection.length).toBe(2);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
        });

        it('Listitem creation with empty dataSource', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, []);
            expect(listCollection.length).toBe(0);
        });

        it('Listitem creation with null/undefined dataSource', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, [undefined]);
            expect(listCollection.length).toBe(0);
        });

        it('ListItem class names', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
            expect((firstListItem.children[0]).classList.contains('e-text-content')).toBe(true);
            expect((firstListItem.children[0].children[0]).classList.contains('e-list-text')).toBe(true);
        });

        it('ListItem attributes', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.getAttribute('role')).toBe('presentation');
            expect(isNullOrUndefined(firstListItem.getAttribute('data-uid'))).toBe(false);
            expect(firstListItem.children[0].getAttribute('role')).toBe('presentation');
            expect(firstListItem.children[0].children[0].getAttribute('role')).toBe('list-item');

        });

        it('ListItem TextContent with array of string', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.children[0].children[0].textContent).toBe('item1');

        });

        it('ListItem TextContent with array of number', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, [1, 2]);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.children[0].children[0].textContent).toBe('1');

        });

        it('ListItem structure (tag)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.children[0].tagName).toBe('DIV');
            expect(firstListItem.children[0].children[0].tagName).toBe('SPAN');
        });

        it('ListItem Aria attributes', () => {
            const option: ListBaseOptions = { ariaAttributes: { itemRole: 'treeView', itemText: 'treeItem', wrapperRole: 'tree-wrapper' } };
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], false, option);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.getAttribute('role')).toBe('treeView');
            expect(firstListItem.children[0].getAttribute('role')).toBe('tree-wrapper');
            expect(firstListItem.children[0].children[0].getAttribute('role')).toBe('treeItem');

        });

        it('ListItem creation (isSinglelevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], true);
            const firstListItem: HTMLElement = listCollection[0];
            expect(listCollection.length).toEqual(2);
            expect(firstListItem.children.length).toBe(0);
            expect(firstListItem.tagName).toBe('LI');
        });

        it('ListItem class names (isSinglelevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], true);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
        });

        it('ListItem attributes (isSinglelevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], true);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.getAttribute('role')).toBe('option');
            expect(isNullOrUndefined(firstListItem.getAttribute('id'))).toBe(false);
            expect(firstListItem.getAttribute('data-value')).toBe('item1');

        });

        it('ListItem TextContent with array of string (isSinglelevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.textContent).toBe('item1');
        });

        it('ListItem TextContent with array of number (isSinglelevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, [1, 2]);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.textContent).toBe('1');
        });

        it('Callback function', () => {
            const arrayData: string[] = ['Text'];
            const option: ListBaseOptions = {
                itemCreated: (e: { [key: string]: string }) => {
                    expect(e.dataSource).toBe(arrayData);
                    expect(e.curData).toBe(arrayData[0]);
                    expect(e.text).toBe(arrayData[0]);
                },
                itemCreating: (e: { [key: string]: string }) => {
                    expect(e.dataSource).toBe(arrayData);
                    expect(e.curData).toBe(arrayData[0]);
                    expect(e.text).toBe(arrayData[0]);
                    e.curData = 'aaa';
                }
            };

            ListBase.createListItemFromArray(createElement, arrayData, false, option);
        });

        it('moduleclass names', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], false, { moduleName: 'menu' });
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-menu-item')).toBe(true);
            expect((firstListItem.children[0].children[0]).classList.contains('e-menu-text')).toBe(true);
        });

        it('module class names (isSinglelevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], true, { moduleName: 'menu' });
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-menu-item')).toBe(true);
        });

        it('DOM order', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2']);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
            expect(firstListItem.children[0].tagName).toBe('DIV');
            expect(firstListItem.children[0].classList.contains('e-text-content')).toBe(true);
            expect(firstListItem.children[0].children[0].tagName).toBe('SPAN');
            expect(firstListItem.children[0].children[0].classList.contains('e-list-text')).toBe(true);
        });

        it('DOM order (isSinglelevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['item1', 'item2'], true);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
            expect(firstListItem.children.length).toBe(0);
        });
    });

    describe('ListBase.generateUL', () => {
        it('UL element creation', () => {
            const liItem: HTMLElement = document.createElement('li');
            const ul: HTMLElement = ListBase.generateUL(createElement, [liItem]);
            expect(ul.tagName).toBe('UL');
            expect(ul.children.length).toBe(1);
            expect(ul.classList.contains('e-ul')).toBe(true);
            expect(ul.classList.contains('e-list-parent')).toBe(true);
            expect(ul.getAttribute('role')).toBe('presentation');
        });

        it('UL - ClassName', () => {
            const liItem: HTMLElement = document.createElement('li');
            const ul: HTMLElement = ListBase.generateUL(createElement, [liItem], 'e-list base');
            expect(ul.classList.contains('e-ul')).toBe(true);
            expect(ul.classList.contains('e-list-parent')).toBe(true);
            expect(ul.classList.contains('e-list')).toBe(true);
            expect(ul.classList.contains('base')).toBe(true);
        });

        it('UL - with and without Aria attributes', () => {
            const liItem: HTMLElement = document.createElement('li');
            const ulwithAriaAtrribute: HTMLElement = ListBase.generateUL(createElement, [liItem], '', { ariaAttributes: { listRole: 'ul' } });
            expect(ulwithAriaAtrribute.getAttribute('role')).toBe('ul');
            const ulwithoutAriaAtrribute: HTMLElement = ListBase.generateUL(createElement, [liItem], '', { ariaAttributes: { listRole: '' } });
            expect(ulwithoutAriaAtrribute.hasAttribute('role')).toBe(false);

        });
    });

    describe('createListFromArray method', () => {

        it('UL element creation', () => {
            const ulElement: HTMLElement = ListBase.createListFromArray(createElement, ['item1', 'item2']);
            expect(ulElement.tagName).toBe('UL');
            const listCollection: HTMLCollection = ulElement.children;
            expect(listCollection.length).toBe(2);
            const firstListItem: HTMLElement = listCollection[0] as HTMLElement;
            expect(firstListItem.tagName).toBe('LI');
        });

    });

    describe('ListBase.createListItemFromJson method', () => {
        it('Listitem creation', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString));
            expect(listCollection.length).toBe(3);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
        });

        it('Listitem creation with empty dataSource', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, []);
            expect(listCollection.length).toBe(0);
        });

        it('Listitem creation with null/undefined dataSource', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, [undefined]);
            expect(listCollection.length).toBe(0);
        });

        it('ListItem class names', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString));
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
            expect(firstListItem.classList.contains('e-level-1')).toBe(true);
            expect((firstListItem.children[0]).classList.contains('e-text-content')).toBe(true);
            expect((firstListItem.children[0].children[0]).classList.contains('e-list-text')).toBe(true);
        });
        it('ListItem attributes', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString));
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.getAttribute('role')).toBe('presentation');
            expect(firstListItem.getAttribute('aria-level')).toBe('1');
            expect(isNullOrUndefined(firstListItem.getAttribute('data-uid'))).toBe(false);
            expect(firstListItem.children[0].getAttribute('role')).toBe('presentation');
            expect(firstListItem.children[0].children[0].getAttribute('role')).toBe('list-item');

        });

        it('ListItem TextContent with array of string', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString));
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.children[0].children[0].textContent).toBe('text1');

        });

        it('ListItem TextContent with array of number', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsNumber));
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.children[0].children[0].textContent).toBe('1');

        });

        it('ListItem structure (tag)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString));
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.children[0].tagName).toBe('DIV');
            expect(firstListItem.children[0].children[0].tagName).toBe('SPAN');
        });

        it('ListItem (with & without) Aria attributes & level with flat list', () => {
            const optionWithAria: ListBaseOptions = { ariaAttributes: { level: 2, itemRole: 'treeView', itemText: 'treeItem', wrapperRole: 'tree-wrapper' } };
            // eslint-disable-next-line max-len
            const listCollectionWithAria: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString), optionWithAria);
            const firstListItemWithAria: HTMLElement = listCollectionWithAria[0];
            expect(firstListItemWithAria.getAttribute('role')).toBe('treeView');
            expect(firstListItemWithAria.getAttribute('aria-level')).toBe('2');
            expect(firstListItemWithAria.classList.contains('e-level-2')).toBe(true);
            expect(firstListItemWithAria.children[0].getAttribute('role')).toBe('tree-wrapper');
            expect(firstListItemWithAria.children[0].children[0].getAttribute('role')).toBe('treeItem');
            const optionWithoutAria: ListBaseOptions = { ariaAttributes: { itemRole: '', itemText: '', wrapperRole: '' } };
            // eslint-disable-next-line max-len
            const listCollectionWithoutAria: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString), optionWithoutAria);
            const firstListItemWithoutAria: HTMLElement = listCollectionWithoutAria[0];
            expect(firstListItemWithoutAria.hasAttribute('role')).toBe(false);
            expect(firstListItemWithoutAria.getAttribute('aria-level')).toBe('1');
            expect(firstListItemWithoutAria.classList.contains('e-level-1')).toBe(true);
            expect(firstListItemWithoutAria.children[0].hasAttribute('role')).toBe(false);
            expect(firstListItemWithoutAria.children[0].children[0].hasAttribute('role')).toBe(false);
        });

        it('ListItem ID attributes with normal, null and undefined input', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource));
            const firstIdAttribute: string = listCollection[0].getAttribute('data-uid');
            const secondIdAttribute: string = listCollection[1].getAttribute('data-uid');
            const thirdIdAttribute: string = listCollection[2].getAttribute('data-uid');
            expect(firstIdAttribute).toBe('01');
            expect(isNullOrUndefined(secondIdAttribute)).toBe(false);
            expect(isNullOrUndefined(thirdIdAttribute)).toBe(false);
            const mapping: ListBaseOptions = { fields: { id: 'idMapping' } };
            const fourthIdAttribute: string = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping)[3].getAttribute('data-uid');
            expect(fourthIdAttribute).toBe('04');
        });

        it('ListItem icon element with normal, null and undefined input', () => {
            const listCollection: HTMLElement[]
            = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), { showIcon: true });
            const firstIconElement: HTMLElement = <HTMLElement>listCollection[0].querySelector('.e-list-icon');
            const secondIconElement: HTMLElement = <HTMLElement>listCollection[1].querySelector('.e-list-icon');
            const thirdIconElement: HTMLElement = <HTMLElement>listCollection[2].querySelector('.e-list-icon');
            expect(firstIconElement.tagName).toBe('DIV');
            expect(firstIconElement.classList.contains('iconClass1')).toBe(true);
            expect(secondIconElement).toBe(null);
            expect(thirdIconElement).toBe(null);
            const mapping: ListBaseOptions = { showIcon: true, fields: { iconCss: 'iconCssMapping' } };
            const fourthIconElement: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping)[3].querySelector('.e-list-icon');
            expect(fourthIconElement.tagName).toBe('DIV');
            expect(fourthIconElement.classList.contains('iconClass4')).toBe(true);
        });

        it('ListItem tooltip with normal, null and undefined input', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource));
            const firstTooltipContent: string = listCollection[0].getAttribute('title');
            const secondTooltipContent: boolean = listCollection[1].hasAttribute('title');
            const thirdTooltipContent: boolean = listCollection[2].hasAttribute('title');
            expect(firstTooltipContent).toBe('title1');
            expect(secondTooltipContent).toBe(false);
            expect(thirdTooltipContent).toBe(false);
            const mapping: ListBaseOptions = { fields: { tooltip: 'tooltipMapping' } };
            const fourthTooltipContent: string = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping)[3].getAttribute('title');
            expect(fourthTooltipContent).toBe('title4');
        });

        it('ListItem text content with normal, null and undefined input', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource));
            const firstTextContent: string = listCollection[0].querySelector('.e-list-text').textContent;
            const secondTextContent: string = listCollection[1].querySelector('.e-list-text').textContent;
            const thirdTextContent: string = listCollection[2].querySelector('.e-list-text').textContent;
            expect(firstTextContent).toBe('text1');
            expect(secondTextContent).toBe('');
            expect(thirdTextContent).toBe('');
            const mapping: ListBaseOptions = { fields: { text: 'textMapping' } };
            const fourthTextContent: string = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping)[3].querySelector('.e-list-text').textContent;
            expect(fourthTextContent).toBe('text4');
        });

        it('ListItem - img url and img attr with normal, null and undefined input', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource));
            const firstImgElement: HTMLImageElement = listCollection[0].querySelector('.e-list-img');
            const secondImgElement: HTMLImageElement = listCollection[1].querySelector('.e-list-img');
            const thirdImgElement: HTMLImageElement = listCollection[2].querySelector('.e-list-img');
            expect(firstImgElement.tagName).toBe('IMG');
            expect(firstImgElement.src.indexOf('base/spec/img/img1.jpg')).not.toBe(-1);
            expect(firstImgElement.getAttribute('height')).toBe('200px');
            expect(secondImgElement).toBe(null);
            expect(thirdImgElement).toBe(null);
            const mapping: ListBaseOptions = { fields: { imageUrl: 'imageUrlMapping', imageAttributes: 'imageAttributesMapping' } };
            const fourthImgElement: HTMLImageElement = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping)[3].querySelector('.e-list-img');
            expect(fourthImgElement.tagName).toBe('IMG');
            expect(fourthImgElement.src.indexOf('base/spec/img/img4.jpg')).not.toBe(-1);
            expect(fourthImgElement.getAttribute('height')).toBe('200px');
        });

        it('ListItem - html attr with normal, null and undefined input', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource));
            expect(listCollection[0].classList.contains('base')).toBe(true);
            expect(listCollection[0].classList.contains('base1')).toBe(true);
            expect(listCollection[0].getAttribute('role')).toBe('li-1');
            expect(listCollection[0].getAttribute('uid')).toBe('1111');
            expect(listCollection[1].getAttribute('role')).toBe('presentation');
            expect(listCollection[1].hasAttribute('uid')).toBe(false);
            expect(listCollection[2].getAttribute('role')).toBe('presentation');
            expect(listCollection[2].hasAttribute('uid')).toBe(false);
            const mapping: ListBaseOptions = { fields: { htmlAttributes: 'htmlAttributesMapping' } };
            const mappedListItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping)[3];
            expect(mappedListItem.classList.contains('base')).toBe(true);
            expect(mappedListItem.classList.contains('base4')).toBe(true);
            expect(mappedListItem.getAttribute('role')).toBe('li-4');
            expect(mappedListItem.getAttribute('uid')).toBe('4444');
        });

        it('ListItem - URL link & URL attr with normal, null and undefined input', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource));
            const firstanchorElement: HTMLImageElement = listCollection[0].querySelector('.e-list-url');
            const secondanchorElement: HTMLImageElement = listCollection[1].querySelector('.e-list-url');
            const thirdanchorElement: HTMLImageElement = listCollection[2].querySelector('.e-list-url');
            expect(firstanchorElement.tagName).toBe('A');
            expect(firstanchorElement.classList.contains('base')).toBe(true);
            expect(firstanchorElement.classList.contains('e-list-text')).toBe(true);
            expect(firstanchorElement.classList.contains('base1')).toBe(true);
            expect(firstanchorElement.getAttribute('role')).toBe('li-1');
            expect(firstanchorElement.getAttribute('uid')).toBe('1111');
            expect(firstanchorElement.getAttribute('href')).toBe('https://www.google.com');
            expect(secondanchorElement).toBe(null);
            expect(thirdanchorElement).toBe(null);
            const mapping: ListBaseOptions = { fields: { urlAttributes: 'urlAttributesMapping', url: 'urlMapping' } };
            const fourthanchorElement: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping)[3].querySelector('.e-list-url');
            expect(fourthanchorElement.tagName).toBe('A');
            expect(fourthanchorElement.classList.contains('base')).toBe(true);
            expect(fourthanchorElement.classList.contains('e-list-text')).toBe(true);
            expect(fourthanchorElement.classList.contains('base4')).toBe(true);
            expect(fourthanchorElement.getAttribute('role')).toBe('li-4');
            expect(fourthanchorElement.getAttribute('uid')).toBe('4444');
            expect(fourthanchorElement.getAttribute('href')).toBe('https://www.google.com');
        });

        it('ListItem - checkbox', () => {
            const listCollection: HTMLElement[]
            = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), { showCheckBox: true });
            const checkboxElement: HTMLInputElement = listCollection[0].querySelector('.e-list-check');
            expect(checkboxElement.tagName).toBe('INPUT');
            expect(checkboxElement.getAttribute('type')).toBe('checkbox');
        });

        it('ListItem - enabled', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource));
            expect(listCollection[0].classList.contains('e-disabled')).toBe(true);
            expect(listCollection[1].classList.contains('e-disabled')).toBe(false);
            expect(listCollection[2].classList.contains('e-disabled')).toBe(false);
            const mapping: ListBaseOptions = { fields: { enabled: 'enabledMapping' } };
            const mappedItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping)[3];
            expect(mappedItem.classList.contains('e-disabled')).toBe(true);
        });

        it('ListItem - isVisible', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource));
            expect(listCollection[0].style.display).toBe('none');
            expect(listCollection[1].style.display).not.toBe('none');
            expect(listCollection[2].style.display).not.toBe('none');
            const mapping: ListBaseOptions = { fields: { isVisible: 'isVisibleMapping' } };
            const mappedItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping)[3];
            expect(mappedItem.style.display).toBe('none');
        });

        it('ListItem - nestedList', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(nestedDataSource));
            expect(listCollection[0].classList.contains('e-has-child')).toBe(true);
            expect(listCollection[1].classList.contains('e-has-child')).toBe(false);
            expect(listCollection[2].classList.contains('e-has-child')).toBe(false);
            const mapping: ListBaseOptions = { fields: { child: 'childMapping' } };
            const mappedItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(nestedDataSource), mapping)[3];
            expect(mappedItem.classList.contains('e-has-child')).toBe(true);
        });

        it('ListItem - processSubChild', () => {
            // eslint-disable-next-line max-len
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(nestedDataSource), { processSubChild: true });
            const firstLevelListItem: HTMLElement = listCollection[0];
            expect(firstLevelListItem.classList.contains('e-has-child')).toBe(true);
            expect(firstLevelListItem.classList.contains('e-level-1')).toBe(true);
            expect(firstLevelListItem.getAttribute('aria-level')).toBe('1');
            const secondLevelList: HTMLElement = firstLevelListItem.querySelector('ul');
            expect(secondLevelList.classList.contains('e-ul')).toBe(true);
            expect(secondLevelList.classList.contains('e-list-parent')).toBe(true);
            expect(secondLevelList.children.length).toBe(3);
            const secondLevelListItem: Element = secondLevelList.children[0];
            expect(secondLevelListItem.tagName).toBe('LI');
            expect(secondLevelListItem.classList.contains('e-has-child')).toBe(true);
            expect(secondLevelListItem.classList.contains('e-level-2')).toBe(true);
            expect(secondLevelListItem.getAttribute('aria-level')).toBe('2');
            const thirdLevelList: HTMLElement = secondLevelListItem.querySelector('ul');
            expect(thirdLevelList.classList.contains('e-ul')).toBe(true);
            expect(thirdLevelList.classList.contains('e-list-parent')).toBe(true);
            expect(thirdLevelList.children.length).toBe(2);
            const thirdLevelListItem: Element = thirdLevelList.children[0];
            expect(thirdLevelListItem.tagName).toBe('LI');
            expect(thirdLevelListItem.classList.contains('e-has-child')).toBe(false);
            expect(thirdLevelListItem.classList.contains('e-level-3')).toBe(true);
            expect(thirdLevelListItem.getAttribute('aria-level')).toBe('3');
            expect(thirdLevelListItem.querySelector('ul')).toBe(null);
        });

        it('ListItem - expandCollapse', () => {
            const listCollectionRight: HTMLElement[] =
             ListBase.createListItemFromJson(createElement, deepCloning(nestedDataSource), { expandCollapse: true });
            const expandCollapseRightElement: Element = listCollectionRight[0].querySelector('.e-list-text').nextElementSibling;
            expect(expandCollapseRightElement.parentElement.classList.contains('e-icon-wrapper')).toBe(true);
            expect(expandCollapseRightElement.tagName).toBe('DIV');
            expect(expandCollapseRightElement.classList.contains('e-icons')).toBe(true);
            expect(expandCollapseRightElement.classList.contains('e-icon-collapsible')).toBe(true);
            const listCollectionLeft: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(nestedDataSource), { expandCollapse: true, expandIconClass: 'e-icon-expandable', expandIconPosition: 'Left' });
            const expandCollapseLeftElement: Element = listCollectionLeft[0].querySelector('.e-list-text').previousElementSibling;
            expect(expandCollapseLeftElement.parentElement.classList.contains('e-icon-wrapper')).toBe(true);
            expect(expandCollapseLeftElement.tagName).toBe('DIV');
            expect(expandCollapseLeftElement.classList.contains('e-icons')).toBe(true);
            expect(expandCollapseLeftElement.classList.contains('e-icon-expandable')).toBe(true);
        });


        it('ListItem - groupList', () => {
            const ds: { [key: string]: object }[] = ListBase.groupDataSource(groupdataSources, { groupBy: 'category' });
            expect(ds.length).toBe(8);
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, ds);
            const grouplistItem: HTMLElement[] = Array.prototype.filter.call(listCollection, (li: HTMLElement) => li.classList.contains('e-list-group-item'));
            const listItem: HTMLElement[] = Array.prototype.filter.call(listCollection, (li: HTMLElement) => li.classList.contains('e-list-item'));
            expect(listCollection.length).toBe(ds.length);
            expect(grouplistItem.length).toBe(3);
            expect(listItem.length).toBe(5);
            expect(listCollection.length).toBe(ds.length);
            const groupListItem: HTMLElement = listCollection[0];
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
            const ds: { [key: string]: object }[] = ListBase.groupDataSource(groupdataSources, { groupBy: 'category' });
            const option: ListBaseOptions = { ariaAttributes: { level: 2, groupItemRole: 'tree-group', itemRole: 'treeView', itemText: 'treeItem', wrapperRole: 'tree-wrapper' } };
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, ds, option);
            const groupListItem: HTMLElement = listCollection[0];
            expect(groupListItem.getAttribute('role')).toBe('tree-group');
            expect(groupListItem.getAttribute('aria-level')).toBe('2');
            expect(groupListItem.classList.contains('e-level-2')).toBe(true);
            expect(groupListItem.children[0].getAttribute('role')).toBe('tree-wrapper');
            expect(groupListItem.children[0].children[0].getAttribute('role')).toBe('treeItem');
        });

        it('Callback function', () => {
            const jsonData: { [key: string]: string }[] = [{ text: 'Text', value: '01' }];
            const option: ListBaseOptions = {
                itemCreated: (e: { [key: string]: Object }) => {
                    expect(e.dataSource).toBe(jsonData);
                    expect(e.curData).toBe(jsonData[0]);
                    expect(e.text).toBe(jsonData[0].text);

                },
                itemCreating: (e: { [key: string]: Object }) => {
                    expect(e.dataSource).toBe(jsonData);
                    expect(e.curData).toBe(jsonData[0]);
                    expect(e.text).toBe(jsonData[0].text);
                    e.text = 'mari';
                }
            };

            ListBase.createListItemFromJson(createElement, jsonData, option);
        });

        it('Callback function - Changing value in itemCreating event', () => {
            const data: { [key: string]: Object }[] = [
                { id: 'data01', text: 'Cut', iconCss: 'e-icons e-cut' }
            ];
            const listCollection: Element[] = ListBase.createListItemFromJson(createElement, data, {
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
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString), {}, 1, true);
            expect(listCollection.length).toBe(3);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
        });

        it('ListItem class names (isSingleLevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString), {}, 1, true);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.classList.contains('e-list-item')).toBe(true);
        });
        it('ListItem attributes (isSingleLevel)', () => {
            const  listCollection: HTMLElement[]
            = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString), {}, 1, true);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.getAttribute('role')).toBe('option');
            expect(isNullOrUndefined(firstListItem.getAttribute('id'))).toBe(false);
        });

        it('ListItem (with & without) Aria attributes & level with flat list (isSingleLevel) wrong', () => {
            const optionWithAria: ListBaseOptions = { ariaAttributes: { itemRole: 'treeView' } };
            const listCollectionWithAria: HTMLElement[] =
             ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString), optionWithAria, 1, true);
            const firstListItemWithAria: HTMLElement = listCollectionWithAria[0];
            expect(firstListItemWithAria.getAttribute('role')).toBe('option');
            const optionWithoutAria: ListBaseOptions = { ariaAttributes: { itemRole: '', groupItemRole: '' } };
            // eslint-disable-next-line
            const listCollectionWithoutAria : any = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString), optionWithoutAria, 1, true);
            const firstListItemWithoutAria: HTMLElement = listCollectionWithoutAria[0];
            expect(firstListItemWithoutAria.getAttribute('role')).toBe('option');
        });
        it('ListItem TextContent with array of string (isSingleLevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString), {}, 1, true);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.textContent).toBe('text1');

        });

        it('ListItem TextContent with array of number (isSingleLevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsNumber), {}, 1, true);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.textContent).toBe('1');

        });

        it('ListItem structure (tag)(isSingleLevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(minimalDsString), {}, 1, true);
            const firstListItem: HTMLElement = listCollection[0];
            expect(firstListItem.tagName).toBe('LI');
            expect(firstListItem.children.length).toBe(0);
        });

        it('ListItem icon element with normal, null and undefined input (isSingleLevel)', () => {
            const listCollection: HTMLElement[] =
            ListBase.createListItemFromJson(createElement, deepCloning(dataSource), { showIcon: true }, 1, true);
            const firstIconElement: HTMLElement = <HTMLElement>listCollection[0].querySelector('.e-list-icon');
            const secondIconElement: HTMLElement = <HTMLElement>listCollection[1].querySelector('.e-list-icon');
            const thirdIconElement: HTMLElement = <HTMLElement>listCollection[2].querySelector('.e-list-icon');
            expect(firstIconElement.tagName).toBe('SPAN');
            expect(firstIconElement.classList.contains('iconClass1')).toBe(true);
            expect(secondIconElement).toBe(null);
            expect(thirdIconElement).toBe(null);
            const mapping: ListBaseOptions = { showIcon: true, fields: { iconCss: 'iconCssMapping' } };
            const fourthIconElement: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping, 1, true)[3].querySelector('.e-list-icon');
            expect(fourthIconElement.tagName).toBe('SPAN');
            expect(fourthIconElement.classList.contains('iconClass4')).toBe(true);
        });


        it('ListItem - enabled (isSingleLevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), {}, 1, true);
            expect(listCollection[0].classList.contains('e-disabled')).toBe(true);
            expect(listCollection[1].classList.contains('e-disabled')).toBe(false);
            expect(listCollection[2].classList.contains('e-disabled')).toBe(false);
            const mapping: ListBaseOptions = { fields: { enabled: 'enabledMapping' } };
            const mappedItem: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping, 1, true)[3];
            expect(mappedItem.classList.contains('e-disabled')).toBe(true);
        });

        it('ListItem - html attr with normal, null and undefined input (isSingleLevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), {}, 1, true);
            expect(listCollection[0].classList.contains('base')).toBe(true);
            expect(listCollection[0].classList.contains('base1')).toBe(true);
            expect(listCollection[0].getAttribute('role')).toBe('li-1');
            expect(listCollection[0].getAttribute('uid')).toBe('1111');
            expect(listCollection[1].getAttribute('role')).toBe('option');
            expect(listCollection[1].hasAttribute('uid')).toBe(false);
            expect(listCollection[2].getAttribute('role')).toBe('option');
            expect(listCollection[2].hasAttribute('uid')).toBe(false);
            const mapping: ListBaseOptions = { fields: { htmlAttributes: 'htmlAttributesMapping' } };
            const mappedListItem: HTMLElement =
            ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping, 1, true)[3];
            expect(mappedListItem.classList.contains('base')).toBe(true);
            expect(mappedListItem.classList.contains('base4')).toBe(true);
            expect(mappedListItem.getAttribute('role')).toBe('li-4');
            expect(mappedListItem.getAttribute('uid')).toBe('4444');
        });

        it('ListItem - URL link & URL attr with normal, null and undefined input (isSingleLevel)', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), {}, 1, true);
            const firstanchorElement: HTMLImageElement = listCollection[0].querySelector('.e-list-url');
            const secondanchorElement: HTMLImageElement = listCollection[1].querySelector('.e-list-url');
            const thirdanchorElement: HTMLImageElement = listCollection[2].querySelector('.e-list-url');
            expect(firstanchorElement.tagName).toBe('A');
            expect(firstanchorElement.classList.contains('base')).toBe(true);
            expect(firstanchorElement.classList.contains('e-list-text')).toBe(true);
            expect(firstanchorElement.classList.contains('base1')).toBe(true);
            expect(firstanchorElement.getAttribute('role')).toBe('li-1');
            expect(firstanchorElement.getAttribute('uid')).toBe('1111');
            expect(firstanchorElement.getAttribute('href')).toBe('https://www.google.com');
            expect(secondanchorElement).toBe(null);
            expect(thirdanchorElement).toBe(null);
            const mapping: ListBaseOptions = { fields: { urlAttributes: 'urlAttributesMapping', url: 'urlMapping' } };
            const fourthanchorElement: HTMLElement = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), mapping, 1, true)[3].querySelector('.e-list-url');
            expect(fourthanchorElement.tagName).toBe('A');
            expect(fourthanchorElement.classList.contains('base')).toBe(true);
            expect(fourthanchorElement.classList.contains('e-list-text')).toBe(true);
            expect(fourthanchorElement.classList.contains('base4')).toBe(true);
            expect(fourthanchorElement.getAttribute('role')).toBe('li-4');
            expect(fourthanchorElement.getAttribute('uid')).toBe('4444');
            expect(fourthanchorElement.getAttribute('href')).toBe('https://www.google.com');
        });
        it('ListItem - groupList (isSingleLevel)', () => {
            const ds: { [key: string]: object }[] = ListBase.groupDataSource(groupdataSources, { groupBy: 'category' });
            expect(ds.length).toBe(8);
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, ds, {}, 1, true);
            const grouplistItem: HTMLElement[] = Array.prototype.filter.call(listCollection, (li: HTMLElement) => li.classList.contains('e-list-group-item'));
            const listItem: HTMLElement[] = Array.prototype.filter.call(listCollection, (li: HTMLElement) => li.classList.contains('e-list-item'));
            expect(listCollection.length).toBe(ds.length);
            expect(grouplistItem.length).toBe(3);
            expect(listItem.length).toBe(5);
            expect(listCollection.length).toBe(ds.length);
            const groupListItem: HTMLElement = listCollection[0];
            expect(groupListItem.tagName).toBe('LI');
            expect(groupListItem.classList.contains('e-list-group-item')).toBe(true);
            expect(groupListItem.getAttribute('role')).toBe('group');
            expect(isNullOrUndefined(groupListItem.getAttribute('id'))).toBe(false);
            expect(groupListItem.textContent).toBe('Ferrari');
            expect(listCollection[1].classList.contains('e-list-group-item')).toBe(false);
            expect(listCollection[1].textContent).toBe('GTC4');
        });

        it('ListItem Aria attributes & level with group list (isSingleLevel)', () => {
            const ds: { [key: string]: object }[] = ListBase.groupDataSource(groupdataSources, { groupBy: 'category' });
            const option: ListBaseOptions = { ariaAttributes: { groupItemRole: 'tree-group' } };
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, ds, option, 1, true);
            const groupListItem: HTMLElement = listCollection[0];
            expect(groupListItem.getAttribute('role')).toBe('tree-group');
        });

        it('ListItem - Template', () => {
            const option: ListBaseOptions = { template: '<div class="${iconCssMapping}" role="${htmlAttributesMapping.role}" id="${urlAttributesMapping.uid}"><span id="${abc}">${textMapping}</span></div>' };
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning([dataSource[3]]), option);
            const listItem: HTMLElement = listCollection[0];
            expect(listItem.tagName).toBe('LI');
            const templateElemet: Element = listItem.children[0];
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
            const ds: { [key: string]: object }[] = ListBase.groupDataSource([dataSource[3]], { groupBy: 'textMapping' });
            const option: ListBaseOptions = { groupTemplate: '<div class="${items[0].iconCssMapping}" role="${items[0].htmlAttributesMapping.role}" id="${items[0].urlAttributesMapping.uid}"><span id="${abc}">${text}</span></div>' };
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, ds, option);
            const groupListItem: HTMLElement = listCollection[0];
            expect(groupListItem.tagName).toBe('LI');
            const templateElemet: Element = groupListItem.children[0];
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
            // eslint-disable-next-line max-len
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), { showIcon: true, showCheckBox: true });
            const firstListItem: HTMLElement = listCollection[0];
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
            // eslint-disable-next-line max-len
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, deepCloning(dataSource), { showIcon: true, showCheckBox: true }, 1, true);
            const firstListItem: HTMLElement = listCollection[0];
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
            const ulElement: HTMLElement = ListBase.createListFromJson(createElement, deepCloning(minimalDsNumber));
            expect(ulElement.tagName).toBe('UL');
            const listCollection: HTMLCollection = ulElement.children;
            expect(listCollection.length).toBe(3);
            const firstListItem: HTMLElement = listCollection[0] as HTMLElement;
            expect(firstListItem.tagName).toBe('LI');
        });

    });

    describe('createList method', () => {

        it('List creation - String[]', () => {
            const ulElement: HTMLElement = ListBase.createList(createElement, ['text1', 'text2']);
            expect(ulElement.tagName).toBe('UL');
            const listCollection: HTMLCollection = ulElement.children;
            expect(listCollection.length).toBe(2);
            const firstListItem: HTMLElement = listCollection[0] as HTMLElement;
            expect(firstListItem.tagName).toBe('LI');
        });

        it('List creation - Number[]', () => {
            const ulElement: HTMLElement = ListBase.createList(createElement, [1, 2, 3]);
            expect(ulElement.tagName).toBe('UL');
            const listCollection: HTMLCollection = ulElement.children;
            expect(listCollection.length).toBe(3);
            const firstListItem: HTMLElement = listCollection[0] as HTMLElement;
            expect(firstListItem.tagName).toBe('LI');
        });

        it('List creation - Json[]', () => {
            const ulElement: HTMLElement = ListBase.createList(createElement, deepCloning(minimalDsNumber));
            expect(ulElement.tagName).toBe('UL');
            const listCollection: HTMLCollection = ulElement.children;
            expect(listCollection.length).toBe(3);
            const firstListItem: HTMLElement = listCollection[0] as HTMLElement;
            expect(firstListItem.tagName).toBe('LI');
        });

    });

    describe('ListBase.createJsonFromElement method', () => {
        it('JSON data creation  - List', () => {
            const UL: HTMLElement = document.createElement('ul');
            UL.innerHTML = '<li>item1</li><li>item2</li>';
            // eslint-disable-next-line @typescript-eslint/ban-types
            const dataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL);
            expect(dataSource.length).toBe(2);
            expect(dataSource[0].text).toBe('item1');
            expect(isNullOrUndefined(dataSource[0].id)).toBe(false);
            expect(dataSource[1].text).toBe('item2');
            expect(isNullOrUndefined(dataSource[1].id)).toBe(false);
            // eslint-disable-next-line @typescript-eslint/ban-types
            const mappedDataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL, { fields: { text: 'name', id: 'uid' } });
            expect(mappedDataSource.length).toBe(2);
            expect(mappedDataSource[0].name).toBe('item1');
            expect(isNullOrUndefined(mappedDataSource[0].uid)).toBe(false);
            expect(mappedDataSource[1].name).toBe('item2');
            expect(isNullOrUndefined(mappedDataSource[1].uid)).toBe(false);
        });

        it('JSON data creation  - List with anchor tag', () => {
            const UL: HTMLElement = document.createElement('ul');
            UL.innerHTML = '<li><a>item1<a/></li><li><a>item2</a></li>';
            // eslint-disable-next-line
            const dataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL);
            expect(dataSource.length).toBe(2);
            expect(dataSource[0].text).toBe('item1');
            expect(isNullOrUndefined(dataSource[0].id)).toBe(false);
            expect(dataSource[1].text).toBe('item2');
            expect(isNullOrUndefined(dataSource[1].id)).toBe(false);
            // eslint-disable-next-line
            const mappedDataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL, { fields: { text: 'name', id: 'uid' } });
            expect(mappedDataSource.length).toBe(2);
            expect(mappedDataSource[0].name).toBe('item1');
            expect(isNullOrUndefined(mappedDataSource[0].uid)).toBe(false);
            expect(mappedDataSource[1].name).toBe('item2');
            expect(isNullOrUndefined(mappedDataSource[1].uid)).toBe(false);
        });

        it('JSON data with html attributes', () => {
            const UL: HTMLElement = document.createElement('ul');
            UL.innerHTML = '<li id="default" class = "list level-1" >item1</li><li id="sub">item2</li>';
            // eslint-disable-next-line
            const dataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL);
            // eslint-disable-next-line
            expect((dataSource[0].htmlAttributes as { [key: string]: {} }).class).toBe('list level-1');
            // eslint-disable-next-line
            expect((dataSource[0].htmlAttributes as { [key: string]: {} }).id).toBe(undefined);
            expect(dataSource[0].id).toBe('default');
            expect(dataSource[1].htmlAttributes).toBe(undefined);
            expect(dataSource[1].id).toBe('sub');
            // eslint-disable-next-line
            const mappedDataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL, { fields: { htmlAttributes: 'attr', id: 'uid' } });
            // eslint-disable-next-line
            expect((mappedDataSource[0].attr as { [key: string]: {} }).class).toBe('list level-1');
            // eslint-disable-next-line
            expect((mappedDataSource[0].attr as { [key: string]: {} }).id).toBe(undefined);
            expect(mappedDataSource[0].uid).toBe('default');
            expect(mappedDataSource[1].attr).toBe(undefined);
            expect(mappedDataSource[1].uid).toBe('sub');

        });

        it('JSON data with URL && HTML attributes', () => {
            const UL: HTMLElement = document.createElement('ul');
            UL.innerHTML = '<li id="default" class = "list level-1" ><a href = "www.google.com" >google</a></li><li id = "sub" ><a href = "www.yahoo.com">yahoo</a></li>';
            // eslint-disable-next-line
            const dataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL);
            // eslint-disable-next-line
            expect((dataSource[0].htmlAttributes as { [key: string]: {} }).class).toBe('list level-1');
            // eslint-disable-next-line
            expect((dataSource[0].htmlAttributes as { [key: string]: {} }).id).toBe(undefined);
            expect(dataSource[0].id).toBe('default');
            expect(dataSource[1].htmlAttributes).toBe(undefined);
            expect(dataSource[1].id).toBe('sub');
            // eslint-disable-next-line
            expect((dataSource[0].urlAttributes as { [key: string]: {} }).href).toBe('www.google.com');
            // eslint-disable-next-line
            expect((dataSource[1].urlAttributes as { [key: string]: {} }).href).toBe('www.yahoo.com');
            // eslint-disable-next-line
            const mappedDataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL, { fields: {id: 'uid', htmlAttributes: 'attr', urlAttributes: 'url' } });
            // eslint-disable-next-line
            expect((mappedDataSource[0].attr as { [key: string]: {} }).class).toBe('list level-1');
            // eslint-disable-next-line @typescript-eslint/ban-types
            expect((mappedDataSource[0].attr as { [key: string]: {} }).id).toBe(undefined);
            expect(mappedDataSource[0].uid).toBe('default');
            expect(mappedDataSource[1].attr).toBe(undefined);
            expect(mappedDataSource[1].uid).toBe('sub');
            // eslint-disable-next-line
            expect((mappedDataSource[0].url as { [key: string]: {} }).href).toBe('www.google.com');
            // eslint-disable-next-line
            expect((mappedDataSource[1].url as { [key: string]: {} }).href).toBe('www.yahoo.com');
        });

        it('sub level child creation', () => {
            const UL: HTMLElement = document.createElement('ul');
            UL.innerHTML = '<li>item1<ul><li>sub1</li><li>sub2</li><li>sub3</li></ul></li>' +
                '<li>item2</li><li>item3</li><li>item4</li><li>item5</li>' +
                '<li>item6</li><li>item7</li>';
            // eslint-disable-next-line
            const dataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL);
            expect(dataSource.length).toBe(7);
            // eslint-disable-next-line
            expect((dataSource[0].child as { [key: string]: {} }).length).toBe(3);
            expect(dataSource[0].text).toBe('item1');
            // eslint-disable-next-line
            expect(((dataSource[0].child as { [key: string]: {} })[0] as { [key: string]: {} }).text).toBe('sub1');
            // eslint-disable-next-line
            const mappedDataSource: { [key: string]: {} }[] = ListBase.createJsonFromElement(UL, { fields: { child: 'sub', text: 'name' } });
            expect(mappedDataSource.length).toBe(7);
            // eslint-disable-next-line
            expect((mappedDataSource[0].sub as { [key: string]: {} }).length).toBe(3);
            expect(mappedDataSource[0].name).toBe('item1');
            // eslint-disable-next-line
            expect(((mappedDataSource[0].sub as { [key: string]: {} })[0] as { [key: string]: {} }).name).toBe('sub1');
        });
    });

    describe('ListBase.getSiblingLI  method', () => {
        const UL: HTMLElement = document.createElement('ul');
        UL.id = 'uls';
        UL.innerHTML = '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
            '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';
        document.body.appendChild(UL);

        it('get next sibling', () => {
            const li: HTMLElement = <HTMLElement>UL.querySelector('#i4');
            const nextLI: HTMLElement = <HTMLElement>UL.querySelector('#i5');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li)).toBe(nextLI);
        });

        it('get previous sibling', () => {
            const li: HTMLElement = <HTMLElement>UL.querySelector('#i4');
            const prevLI: HTMLElement = <HTMLElement>UL.querySelector('#i3');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li, true)).toBe(prevLI);
        });

        it('get previous visible sibling', () => {
            const li: HTMLElement = <HTMLElement>UL.querySelector('#i3');
            const prevLI: HTMLElement = <HTMLElement>UL.querySelector('#s3');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li, true)).toBe(prevLI);
        });

        it('get next visible sibling', () => {
            const li: HTMLElement = <HTMLElement>UL.querySelector('#s3');
            const nextLI: HTMLElement = <HTMLElement>UL.querySelector('#i3');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li)).toBe(nextLI);
        });

        it('get first visible li from array', () => {
            const li: HTMLElement = <HTMLElement>UL.querySelector('#s');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li)).toBe(UL.querySelector('#uls>li:first-child'));
        });

        it('get last visible li from array', () => {
            const li: HTMLElement = <HTMLElement>UL.querySelector('#s');
            expect(ListBase.getSiblingLI(UL.querySelectorAll('li'), li, true)).toBe(UL.querySelector('#uls>li:last-child'));
        });

        it('get siblings li when no array list', () => {
            const li: HTMLElement = <HTMLElement>UL.querySelector('#s');
            expect(ListBase.getSiblingLI([], li)).toBe(undefined);
        });
        afterAll(() => {
            UL.remove();
        });
    });

    describe('indexOf method', () => {
        const UL: HTMLElement = document.createElement('ul');
        UL.id = 'uls';
        UL.innerHTML = '<li id="i1">item1<ul><li id="s1">sub1</li><li id="s2">sub2</li><li id="s3">sub3</li></ul></li>' +
            '<li id="i2" style="display:none">item2</li><li id="i3">item3</li><li id="i4">item4</li><li id="i5">item5</li>' +
            '<li>item6</li><li>item7</li>';
        document.body.appendChild(UL);

        it('li from node list', () => {
            const li: HTMLElement = <HTMLElement>UL.querySelector('#i4');
            expect(ListBase.indexOf(li, UL.querySelectorAll('#uls>li'))).toBe(3);
        });

        it('li not in list', () => {
            const li: HTMLElement = <HTMLElement>UL.querySelector('#i4');
            expect(ListBase.indexOf(li, UL.querySelectorAll('p'))).toBe(-1);
        });

        it('element is empty', () => {
            const li: HTMLElement = <HTMLElement>UL.querySelector('#i');
            expect(ListBase.indexOf(li, UL.querySelectorAll('li'))).toBe(undefined);
        });
        afterAll(() => {
            UL.remove();
        });
    });

    describe('ListBase.generateIcon method', (): void => {

        it('DOM structure', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['text']);
            const liItem: HTMLElement = ListBase.generateIcon(createElement, listCollection[0]);
            const iconElement: Element = liItem.querySelector('.e-list-text').nextElementSibling;
            expect(iconElement.tagName).toBe('DIV');
            expect(iconElement.classList.contains('e-icons')).toBe(true);
            expect(iconElement.classList.contains('e-icon-collapsible')).toBe(true);
        });

        it('with additional class name', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, [1]);
            const liItem: HTMLElement = ListBase.generateIcon(createElement, listCollection[0], 'e-level');
            const iconElement: Element = liItem.querySelector('.e-list-text').nextElementSibling;
            expect(iconElement.classList.contains('e-icons')).toBe(true);
            expect(iconElement.classList.contains('e-icon-collapsible')).toBe(true);
            expect(iconElement.classList.contains('e-level')).toBe(true);
        });

        it('with customized expand collapse class name', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromJson(createElement, [{ text: 'text' }]);
            const liItem: HTMLElement = ListBase.generateIcon(createElement, listCollection[0], 'e-level', { expandIconClass: 'e-icon-expandable' });
            const iconElement: Element = liItem.querySelector('.e-list-text').nextElementSibling;
            expect(iconElement.classList.contains('e-icons')).toBe(true);
            expect(iconElement.classList.contains('e-icon-collapsible')).toBe(false);
            expect(iconElement.classList.contains('e-icon-expandable')).toBe(true);
            expect(iconElement.classList.contains('e-level')).toBe(true);
        });

        it('with expandIconPosition option', () => {
            const listCollection: HTMLElement[] = ListBase.createListItemFromArray(createElement, ['text']);
            const liItem: HTMLElement = ListBase.generateIcon(createElement, listCollection[0], '', { expandIconPosition: 'Left' });
            const iconElement: Element = liItem.querySelector('.e-list-text').previousElementSibling;
            expect(iconElement.tagName).toBe('DIV');
            expect(iconElement.classList.contains('e-icons')).toBe(true);
            expect(iconElement.classList.contains('e-icon-collapsible')).toBe(true);
        });

    });

    describe('ListBase.addSorting method', (): void => {

        it('default', () => {
            const newDS: { [key: string]: number | object }[] = ListBase.getDataSource(minimalDsNumber, ListBase.addSorting('None', 'text'));
            expect(newDS[0].text).toBe(1);
            expect(newDS[1].text).toBe(2);
            expect(newDS[2].text).toBe(3);
        });

        it('sorting order by ascending', () => {
            const newDS: { [key: string]: number | object }[] = ListBase.getDataSource(minimalDsNumber, ListBase.addSorting('Ascending', 'text'));
            expect(newDS[0].text).toBe(1);
            expect(newDS[1].text).toBe(2);
            expect(newDS[2].text).toBe(3);
        });

        it('sorting order by descending', () => {
            const newDS: { [key: string]: number | object }[] = ListBase.getDataSource(minimalDsNumber, ListBase.addSorting('Descending', 'text'));
            expect(newDS[0].text).toBe(3);
            expect(newDS[1].text).toBe(2);
            expect(newDS[2].text).toBe(1);
        });

        it('sorting order with wrong query', () => {
            const listQuery: Query = ListBase.addSorting(undefined, 'text', new Query().search('VI', ['CustomerID']));
            expect(listQuery.queries[0].fn).not.toBe('onSortBy');
        });

    });

    describe('ListBase.groupDataSource method', (): void => {
        it('default', () => {
            const newDS: { [key: string]: object | string | boolean | string[] }[] = ListBase.groupDataSource(groupdataSources, { groupBy: 'category' });
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
            const newDS: { [key: string]: object | string | boolean | string[] }[] = ListBase.groupDataSource(groupdataSources, { groupBy: 'category' }, 'Ascending');
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
            const newDS: { [key: string]: object | string | boolean | string[] }[] = ListBase.groupDataSource(groupdataSources, { groupBy: 'category' }, 'Descending');
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
            const data: { [key: string]: string }[] = [{ id: '01', text: 'GTC4', category: 'Ferrari' },
                { id: '02', text: 'a3' }];
            const ds: { [key: string]: object }[] = ListBase.groupDataSource(data, { groupBy: 'category' });
            expect(ds.length).toBe(4);
        });
    });


    describe('ListBase.renderContentTemplate method', () => {
        it('ListItem creation', () => {
            const template: string = '<div class="name" id ="${id}">${text}</div>';
            const ul: HTMLElement = ListBase.renderContentTemplate(createElement, template, deepCloning([dataSource[0]]), { value: 'text' });
            // eslint-disable-next-line
            const liItem = ul.children[0];
            expect(ul.tagName).toBe('UL');
            expect(ul.classList.contains('e-list-parent')).toBe(true);
            expect(ul.classList.contains('e-ul')).toBe(true);
            expect(ul.getAttribute('role')).toBe('presentation');
            expect(liItem.tagName).toBe('LI');
            expect(liItem.classList.contains('e-list-item')).toBe(true);
            expect(liItem.getAttribute('role')).toBe('option');
            expect(liItem.getAttribute('data-value')).toBe('text1');
            const templateElement: Element = liItem.children[0];
            expect(templateElement.tagName).toBe('DIV');
            expect(templateElement.classList.contains('name')).toBe(true);
            expect(templateElement.getAttribute('id')).toBe('01');
            expect(templateElement.textContent).toBe('text1');
        });
        it('ListItem creation-nullable data', () => {
            const template: string = '<div class="name" id ="${id}">${text}</div>';
            const ul: HTMLElement = ListBase.renderContentTemplate(createElement, template, deepCloning([nullValueDataSource]), { value: 'text' });
            // eslint-disable-next-line
            const liItem : any = ul.children[0];
            expect(ul.tagName).toBe('UL');
            expect(ul.classList.contains('e-list-parent')).toBe(true);
            expect(ul.classList.contains('e-ul')).toBe(true);
            expect(ul.getAttribute('role')).toBe('presentation');
            expect(liItem.tagName).toBe('LI');
            expect(liItem.classList.contains('e-list-item')).toBe(true);
            expect(liItem.getAttribute('role')).toBe('option');
            expect(liItem.getAttribute('data-value')).toBe('null');
            const templateElement: Element = liItem.children[0];
            expect(templateElement.tagName).toBe('DIV');
            expect(templateElement.classList.contains('name')).toBe(true);
            expect(templateElement.getAttribute('id')).toBe('01');
            expect(templateElement.textContent).toBe('null');
        });

        it('Group ListItem creation - ', () => {
            const template: string = '<div class="name">${text}</div>';
            const ds: { [key: string]: Object }[] = ListBase.groupDataSource(groupdataSources, { groupBy: 'category' });
            const ul: HTMLElement = ListBase.renderContentTemplate(createElement, template, ds, { value: 'text' });

            // eslint-disable-next-line
            const groupLiItem : any = ul.children[0];
            // eslint-disable-next-line
            const liItem : any = ul.children[1];
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
            const templateElement: Element = liItem.children[0];
            expect(templateElement.tagName).toBe('DIV');
            expect(templateElement.classList.contains('name')).toBe(true);
            expect(templateElement.textContent).toBe('GTC4');
        });
        it('Group ListItem creation -nullable data ', () => {
            const template: string = '<div class="name">${text}</div>';
            const ds: { [key: string]: Object }[] = ListBase.groupDataSource(nullValueGroupDataSource, { groupBy: 'category' });
            const ul: HTMLElement = ListBase.renderContentTemplate(createElement, template, ds, { value: 'text' });
            // eslint-disable-next-line
            const groupLiItem : any = ul.children[0];
            // eslint-disable-next-line
            const liItem : any = ul.children[1];
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
            expect(liItem.getAttribute('data-value')).toBe('null');
            const templateElement: Element = liItem.children[0];
            expect(templateElement.tagName).toBe('DIV');
            expect(templateElement.classList.contains('name')).toBe(true);
            expect(templateElement.textContent).toBe('null');
        });

        it('Callback function', () => {
            const template: string = '<div class="name" id ="${id}">${text}</div>';
            const options: ListBaseOptions = {
                itemCreating: (args: { [key: string]: Object }) => {
                    expect(args.text).toBe('text1');
                    (args.curData as { [key: string]: string }).text = 'customText';
                },
                itemCreated: (args: { [key: string]: Object }) => {
                    expect(args.text).toBe('customText');
                }
            };
            const ul: HTMLElement = ListBase.renderContentTemplate(createElement, template, deepCloning([dataSource[0]]), { value: 'text' }, options);
            const templateElement: Element = ul.children[0].children[0];
            expect(templateElement.tagName).toBe('DIV');
            expect(templateElement.classList.contains('name')).toBe(true);
            expect(templateElement.getAttribute('id')).toBe('01');
            expect(templateElement.textContent).toBe('customText');
        });
    });

    describe('renderGroupTemplate method', () => {
        it('ListItem creation', () => {
            const template: string = '<div class="name" id ="${id}">${text}</div>';
            const ds: { [key: string]: Object }[] = ListBase.groupDataSource(groupdataSources, { groupBy: 'category' });
            const ul: HTMLElement = ListBase.renderContentTemplate(createElement, template, ds, { value: 'text' });
            const groupListCollections: Element[] = Array.prototype.slice.call(ul.querySelectorAll('.e-list-group-item'));
            expect(groupListCollections.length).toBe(3);
            const groupTemplate: string = '<div class="header">${category}</div>';
            const groupLi: Element[] = ListBase.renderGroupTemplate(groupTemplate, ds, { groupBy: 'category' }, groupListCollections);
            expect(groupLi[0].tagName).toBe('LI');
            expect(groupLi[0].classList.contains('e-list-group-item')).toBe(true);
            expect(groupLi[0].getAttribute('role')).toBe('presentation');
            expect(isNullOrUndefined(groupLi[0].getAttribute('id'))).toBe(false);
            const groupTemplateElement: Element = groupLi[0].children[0];
            expect(groupTemplateElement.tagName).toBe('DIV');
            expect(groupTemplateElement.classList.contains('header')).toBe(true);
            expect(groupTemplateElement.textContent).toBe('Ferrari');
        });
    });
    describe('fullRow navigation', () => {
        it('checking without url in complex', () => {
            const listoption: ListBaseOptions = {
                showIcon: true,
                itemNavigable: true
            };
            const ulElement: HTMLElement = ListBase.createList(createElement, fullRowDatasourceFalse, listoption, false);
            expect(ulElement.children[0].classList.contains('e-navigable')).toBe(false);
            expect(ulElement.children[0].querySelector('.e-anchor-wrap')).toBe(null);
        });
        it('checking without url in single', () => {
            const listoption: ListBaseOptions = {
                showIcon: true,
                itemNavigable: true
            };
            const ulElement: HTMLElement = ListBase.createList(createElement, fullRowDatasourceFalse, listoption, true);
            expect(ulElement.children[0].classList.contains('e-navigable')).toBe(false);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap').length).toBe(0);
        });
        it('checking with url in complex without checkbox', () => {
            const listoption: ListBaseOptions = {
                showIcon: true,
                itemNavigable: true
            };
            const ulElement: HTMLElement = ListBase.createList(createElement, fullRowDatasourceTrue, listoption, false);
            expect(ulElement.children[0].classList.contains('e-navigable')).toBe(true);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap').length).toBe(1);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap')[0].querySelectorAll('.sample-icon').length).toBe(1);
        });
        it('checking with url in single without checkbox', () => {
            const listoption: ListBaseOptions = {
                showIcon: true,
                itemNavigable: true
            };
            const ulElement: HTMLElement = ListBase.createList(createElement, fullRowDatasourceTrue, listoption, true);
            expect(ulElement.children[0].classList.contains('e-navigable')).toBe(true);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap').length).toBe(1);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap')[0].querySelectorAll('.sample-icon').length).toBe(1);
        });
        it('checking with url in complex with checkbox', () => {
            const listoption: ListBaseOptions = {
                showIcon: true,
                showCheckBox: true,
                itemNavigable: true
            };
            const ulElement: HTMLElement = ListBase.createList(createElement, fullRowDatasourceTrue, listoption, false);
            expect(ulElement.children[0].classList.contains('e-navigable')).toBe(true);
            expect(ulElement.children[0].querySelectorAll('.e-list-check').length).toBe(1);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap').length).toBe(1);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap')[0].querySelectorAll('.sample-icon').length).toBe(1);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap')[0].querySelectorAll('.e-list-check').length).toBe(0);
        });
        it('checking with url in single with checkbox', () => {
            const listoption: ListBaseOptions = {
                showIcon: true,
                showCheckBox: true,
                itemNavigable: true
            };
            const ulElement: HTMLElement = ListBase.createList(createElement, fullRowDatasourceTrue, listoption, true);
            expect(ulElement.children[0].classList.contains('e-navigable')).toBe(true);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap').length).toBe(1);
            expect(ulElement.children[0].querySelectorAll('.e-list-check').length).toBe(1);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap')[0].querySelectorAll('.sample-icon').length).toBe(1);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap')[0].querySelectorAll('.e-list-check').length).toBe(0);
        });
        it('checking with url in complex with text alone', () => {
            const listoption: ListBaseOptions = {
                showIcon: false,
                showCheckBox: false,
                itemNavigable: true
            };
            const ulElement: HTMLElement = ListBase.createList(createElement, fullRowDatasourceTrue, listoption, false);
            expect(ulElement.children[0].classList.contains('e-navigable')).toBe(true);
            expect(ulElement.children[0].querySelectorAll('.e-list-check').length).toBe(0);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap').length).toBe(1);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap')[0].querySelectorAll('.sample-icon').length).toBe(0);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap')[0].querySelectorAll('.e-list-check').length).toBe(0);
        });
        it('checking with url in single with text alone', () => {
            const listoption: ListBaseOptions = {
                showIcon: false,
                showCheckBox: false,
                itemNavigable: true
            };
            const ulElement: HTMLElement = ListBase.createList(createElement, fullRowDatasourceTrue, listoption, true);
            expect(ulElement.children[0].classList.contains('e-navigable')).toBe(true);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap').length).toBe(1);
            expect(ulElement.children[0].querySelectorAll('.e-list-check').length).toBe(0);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap')[0].querySelectorAll('.sample-icon').length).toBe(0);
            expect(ulElement.children[0].querySelectorAll('.e-anchor-wrap')[0].querySelectorAll('.e-list-check').length).toBe(0);
        });
    });
});
