import { Sortable } from '../../../src/sortable/index';
import { createElement } from '@syncfusion/ej2-base';
import { ListView } from '../../../src/list-view/index';

/**
 * Duel list Sortable sample
 */
let list1: { [key: string]: Object }[] = [
    { text: 'Australia', id: 'AU' },
    { text: 'Bermuda', id: 'BM' },
    { text: 'Canada', id: 'CA' },
    { text: 'Cameroon', id: 'CM' },
    { text: 'Denmark', id: 'DK' },
    { text: 'France', id: 'FR' },
    { text: 'Finland', id: 'FI' },
    { text: 'Germany', id: 'DE' },
    { text: 'Hong Kong', id: 'HK' }
];
let list2: { [key: string]: Object }[] = [
    { text: 'India', id: 'IN' },
    { text: 'Italy', id: 'IT' },
    { text: 'Japan', id: 'JP' },
    { text: 'Mexico', id: 'MX' },
    { text: 'Norway', id: 'NO' },
    { text: 'Poland', id: 'PL' },
    { text: 'Switzerland', id: 'CH' },
    { text: 'United Kingdom', id: 'GB' },
    { text: 'United States', id: 'US' }
];
let listObj1: ListView = new ListView({ dataSource: list1 });
listObj1.appendTo('#list1');

let listObj2: ListView = new ListView({ dataSource: list2 });
listObj2.appendTo('#list2');

new Sortable(listObj1.element.querySelector('.e-ul') as HTMLElement, {
    scope: 'combined-list',
    itemClass: 'e-list-item',
    placeHolder: (): HTMLElement => {
        return createElement('li', { className: 'e-placeholder' });
    }
});

new Sortable(listObj2.element.querySelector('.e-ul') as HTMLElement, {
    scope: 'combined-list',
    itemClass: 'e-list-item',
    placeHolder: (): HTMLElement => {
        return createElement('li', { className: 'e-placeholder' });
    }
});
