/**
 * Context Menu default sample
 */
import { Browser, select } from '@syncfusion/ej2-base';
import { ContextMenu } from './../../src/context-menu/index';

let menuObj: ContextMenu = new ContextMenu({ target: '#editor' } , '#contextmenu');

if (Browser.isDevice) {
    document.body.classList.add('e-bigger');
    menuObj.element.parentElement.classList.add('e-bigger');
    (select('#editor') as HTMLElement).style.width = 'auto';
}