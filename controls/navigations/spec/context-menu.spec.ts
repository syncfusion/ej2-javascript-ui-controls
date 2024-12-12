/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/**
 *  Context Menu spec document
 */
import { ContextMenu } from '../src/context-menu/context-menu';
import { BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs, MenuEventArgs } from '../src/common/menu-base';
import { MenuItemModel } from '../src/common/menu-base-model';
import { createElement, select, isVisible, EventHandler, Browser } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import { profile , inMB, getMemoryProfile } from './common.spec';

function copyObject(source: any, destination: any): Object {
    for (const prop in source) {
        destination[prop] = source[prop];
    }
    return destination;
}

function setMouseCoordinates(eventarg: any, x: number, y: number, target: Element): Object {
    eventarg.pageX = x;
    eventarg.pageY = y;
    eventarg.clientX = x;
    eventarg.clientY = y;
    eventarg.target = target;
    return eventarg;
}

export function getEventObject(eventType: string, eventName: string): Object {
    const tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    const returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('ContextMenu', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    let contextMenu: any;
    const items: MenuItemModel[] = [
        {
            text: 'Preview',
            iconCss: 'e-icons e-preview'
        },
        {
            text: 'Share',
            iconCss: 'e-icons e-share',
            items: [
                {
                    text: 'Facebook',
                    iconCss: 'e-icons e-share',
                    items: [
                        {
                            text: 'Post'
                        },
                        {
                            text: 'Share',
                            items: [
                                {
                                    text: 'Share with Friends'
                                },
                                {
                                    text: 'Share All'
                                }
                            ]
                        }
                    ]
                },
                {
                    text: 'Whatsapp',
                    iconCss: 'e-icons e-share',
                }
            ]
        },
        {
            text: 'Get Link'
        },
        {
            text: 'Copy',
            iconCss: 'e-icons e-copy'
        },
        {
            text: 'Download',
            iconCss: 'e-icons e-download'
        },
        {
            text: 'Remove',
            iconCss: 'e-icons e-delete'
        },
        {
            text: 'Copy',
            iconCss: 'e-icons e-copy',
            id: 'copy-id',
            items: [{
                text: 'Facebook',
                id: 'fb-id'
            }]
        }
    ];
    const options: { [key: string]: Object } = {
        target: '#target',
        items: items
    };
    const ul: HTMLElement = createElement('ul', { id: 'contextmenu' });
    const div: HTMLElement = createElement('div', { id: 'target', styles: 'width: 300px;height: 300px' });
    const filterDiv: HTMLElement = createElement('div', { className: 'e-list-item', styles: 'width: 100px;height: 100px' });
    const ulEle: HTMLElement = createElement('ul', { id: 'list' });
    const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

    describe('DOM', () => {
        afterEach(() => {
            contextMenu.destroy();
            ul.innerHTML = '';
        });

        it('Template Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            let li: Element = document.createElement('li');
            li.textContent = 'Cut';
            ul.appendChild(li);
            li = document.createElement('li');
            li.textContent = 'Copy';
            ul.appendChild(li);
            li = document.createElement('li');
            li.textContent = 'Paste';
            ul.appendChild(li);
            contextMenu = new ContextMenu({ target: '#target' }, '#contextmenu');
            expect(contextMenu.element.classList.contains('e-contextmenu')).toBe(true);
            contextMenu.cssClass = 'e-test';
            contextMenu.dataBind();
            contextMenu.getPersistData();
            contextMenu.scrollHandler();
        });
        it('Refresh method with Template Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            let li: Element = document.createElement('li');
            li.textContent = 'Cut';
            ul.appendChild(li);
            li = document.createElement('li');
            li.textContent = 'Copy';
            ul.appendChild(li);
            li = document.createElement('li');
            li.textContent = 'Paste';
            ul.appendChild(li);
            contextMenu = new ContextMenu({ target: '#target' }, '#contextmenu');
            expect(contextMenu.element.classList.contains('e-contextmenu')).toBe(true);
            contextMenu.refresh();
            expect(contextMenu.element.classList.contains('e-contextmenu')).toBe(true);
            expect(contextMenu.element.childElementCount).toEqual(3);
        });
    });

    describe('Property', () => {
        afterEach(() => {
            contextMenu.destroy();
        });
        it('cssClass Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', cssClass: 'e-custom' }, '#contextmenu');
            const wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.classList.contains('e-custom')).toEqual(true);
        });
        it('RTL Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', enableRtl: true }, '#contextmenu');
            const wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.classList.contains('e-rtl')).toEqual(true);
        });
        it('Target as null Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: null }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
        const mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null,
            type: 'click',
            changedTouches: [{ clientX: 0, clientY: 0 }]
        };
        const touchEventArgs: any = {
            originalEvent: mouseEventArgs
        };
        it('RTL for Submenu', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', enableRtl: true }, '#contextmenu');
            const wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.classList.contains('e-rtl')).toEqual(true);
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'mouseover';
            contextMenu.clickHandler(mouseEventArgs);
            contextMenu.mouseDownHandler(mouseEventArgs);
            contextMenu.touchHandler(touchEventArgs);
            contextMenu.close();
            contextMenu.open(10, 10);
            contextMenu.openMenu(null, null);
        });
        it('showItemOnClick Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', showItemOnClick: true }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[0];
            contextMenu.clickHandler(mouseEventArgs);
            expect(contextMenu.element.style.display).toBe('none');
        });
        it('showItemOnClick Checking on li having sub menu element', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', showItemOnClick: true }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            contextMenu.clickHandler(mouseEventArgs);
        });
        it('Target Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
        it('Right Click on non target element', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            document.body.appendChild(ulEle);
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#list'));
            EventHandler.trigger(ulEle, 'contextmenu', contextmenu);
        });
        it('IconCss Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            const items: MenuItemModel[] = [{ text: 'Cut', iconCss: 'e-cut' }, { text: 'Copy' }, { text: 'Paste' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            const span: HTMLElement = li[0].children[0] as HTMLElement;
            expect(span.classList.contains('e-menu-icon')).toEqual(true);
        });
        it('IconCss as empty string Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            const items: MenuItemModel[] = [{ text: 'Cut', iconCss: '' }, { text: 'Copy', iconCss: 'e-cut' }, { text: 'Paste', iconCss: 'e-cut' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            expect(li[0].classList.contains('e-blankicon')).toEqual(true);
            expect(li[0].getElementsByClassName('e-menu-icon')[0]).toBeUndefined();
        });
        it('Separator Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            const items: MenuItemModel[] = [{ text: 'Cut', iconCss: 'e-cut' }, { text: 'Copy' }, { separator: true }, { text: 'Paste' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            expect(li[2].classList.contains('e-separator')).toEqual(true);
        });
        it('Filter checking', () => {
            div.appendChild(filterDiv);
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ target: '#target', items: items, filter: 'e-list-item' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 10, select('.e-list-item'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
        it('Right click on non filter element', () => {
            const nonFilter: HTMLElement = createElement('div', { className: 'e-filter', styles: 'width: 100px;height: 100px' });
            div.appendChild(filterDiv);
            div.appendChild(nonFilter);
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ target: '#target', items: items, filter: 'e-filter' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 10, select('.e-list-item'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
    });

    describe('Mouse events', () => {
        afterEach(() => {
            contextMenu.destroy();
        });
        const mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null,
            type: 'mouseover'
        };
        it('mouse hover event', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1].firstChild;
            contextMenu.moverHandler(mouseEventArgs);
        });
        it('Mouse hover on li having child element', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'mouseover';
            contextMenu.moverHandler(mouseEventArgs);
        });
        it('Mouse Hover on sub items not having sub elements', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'mouseover';
            contextMenu.clickHandler(mouseEventArgs);
            const childUL: HTMLElement = contextMenu.getWrapper().children[1];
            li = <Element[] & NodeListOf<HTMLLIElement>>childUL.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'mouseover';
            contextMenu.clickHandler(mouseEventArgs);
        });
        it('Mouse hover from li element having sub child to another li', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'mouseover';
            contextMenu.moverHandler(mouseEventArgs);
            mouseEventArgs.target = li[2];
            mouseEventArgs.type = 'mouseover';
            contextMenu.moverHandler(mouseEventArgs);
            expect(contextMenu.getWrapper().children.length).toBe(1);
        });
        it('Mouse click on other elements', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            document.body.appendChild(ulEle);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            mouseEventArgs.target = select('#list');
            contextMenu.clickHandler(mouseEventArgs);
        });
        it('Right Click Event checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
        it('Right click two times', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            contextMenu.element.children[0].classList.add('e-focused');
            mouseEventArgs.target = document.body;
            contextMenu.mouseDownHandler(mouseEventArgs);
            contextmenu = setMouseCoordinates(contextmenu, 2, 2, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            contextMenu.element.children[1].classList.add('e-selected');
            mouseEventArgs.target = document.body;
            contextMenu.mouseDownHandler(mouseEventArgs);
        });
        it('Mouse click on li having child element', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, showItemOnClick: true, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'click';
            contextMenu.clickHandler(mouseEventArgs);
        });
        it('Hover on Separator element', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            const items: MenuItemModel[] = [{ text: 'Cut', iconCss: 'e-cut' }, { text: 'Copy' }, { separator: true }, { text: 'Paste' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[2];
            mouseEventArgs.type = 'mouseover';
            contextMenu.moverHandler(mouseEventArgs);
            mouseEventArgs.target = contextMenu.element;
            mouseEventArgs.type = 'mouseover';
            contextMenu.moverHandler(mouseEventArgs);
        });
        it('Mouse click on li having child element two times', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, showItemOnClick: true, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'click';
            contextMenu.clickHandler(mouseEventArgs);
            contextMenu.clickHandler(mouseEventArgs);
        });
        it('Mouse Click on sub items not having sub elements', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, showItemOnClick: true, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'click';
            contextMenu.clickHandler(mouseEventArgs);
            const childUL: HTMLElement = contextMenu.getWrapper().children[1];
            li = <Element[] & NodeListOf<HTMLLIElement>>childUL.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'click';
            contextMenu.clickHandler(mouseEventArgs);
        });
        it('Mouse click from li element having sub child to another li', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, showItemOnClick: true, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'click';
            contextMenu.moverHandler(mouseEventArgs);
            mouseEventArgs.target = li[2];
            mouseEventArgs.type = 'click';
            contextMenu.moverHandler(mouseEventArgs);
            expect(contextMenu.getWrapper().children.length).toBe(1);
        });
    });

    describe('Public Methods Checking', () => {
        afterEach(() => {
            contextMenu.destroy();
        });
        it('open', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            //Element without id checking.
            contextMenu = new ContextMenu({ items: items, animationSettings: { effect: 'None' } }, '#contextmenu');
            contextMenu.open(20, 20, document.body);
            expect(contextMenu.element.style.display).toEqual('block');
        });
        it('enableItems', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.enableItems(['Copy'], false);
            expect(contextMenu.element.children[3].classList.contains('e-disabled')).toBe(true);
            contextMenu.enableItems(['Copy']);
            expect(contextMenu.element.children[3].classList.contains('e-disabled')).toBe(false);
            contextMenu.enableItems(['copy-id'], false, true);
            expect(contextMenu.element.children[6].classList.contains('e-disabled')).toBe(true);
            contextMenu.enableItems(['copy-id'], true, true);
            expect(contextMenu.element.children[6].classList.contains('e-disabled')).toBe(false);
        });
        it('hideItems', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.hideItems(['Copy']);
            contextMenu.hideItems(['Facebook']);
            let wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.children[0].children[3].classList).toContain('e-menu-hide');
            contextMenu.hideItems(['copy-id'], true);
            wrap = contextMenu.getWrapper();
            expect(wrap.children[0].children[6].classList).toContain('e-menu-hide');
        });
        it('showItems', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.showItems(['Copy']);
            contextMenu.showItems(['Facebook']);
            let wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.children[0].children[3].classList).not.toContain('e-menu-hide');
            contextMenu.showItems(['copy-id'], true);
            wrap = contextMenu.getWrapper();
            expect(wrap.children[0].children[6].classList).not.toContain('e-menu-hide');
        });
        it('removeItems', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.removeItems(['Copy']);
            expect(contextMenu.getWrapper().children[0].children[3].textContent).not.toContain('Copy');
            contextMenu.removeItems(['copy-id'], true);
            expect(contextMenu.getWrapper().children[0].children[4].textContent).not.toContain('Copy');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
        it('removeItems for child', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.removeItems(['Download']);
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
        it('insertAfter', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.insertAfter([{ text: 'Enable' }], 'Copy');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            contextMenu.insertAfter([{ text: 'Enable' }], 'Copy');
            expect(contextMenu.getWrapper().children[0].children[4].textContent).toContain('Enable');
            contextMenu.insertAfter([{ text: 'Enable1' }], 'copy-id', true);
            expect(contextMenu.getWrapper().children[0].children[9].textContent).toContain('Enable1');
        });
        it('insertAfter for Child', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.insertAfter([{ text: 'App' }], 'Facebook');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
        it('insertBefore', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.insertBefore([{ text: 'Disable' }], 'Copy');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            contextMenu.insertBefore([{ text: 'Disable' }], 'Copy');
            expect(contextMenu.getWrapper().children[0].children[4].textContent).toContain('Disable');
            contextMenu.insertBefore([{ text: 'Disable1' }], 'copy-id', true);
            expect(contextMenu.getWrapper().children[0].children[8].textContent).toContain('Disable1');
        });
        it('insertBefore for child', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.insertBefore([{ text: 'App' }], 'Facebook');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
        it('enableItems for Child', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            contextMenu.moverHandler({ type: 'mouseover', target: li[1] });
            contextMenu.enableItems(['Share All'], true);
        });

        it('Refresh method Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            expect(contextMenu.element.classList.contains('e-contextmenu')).toBe(true);
            contextMenu.refresh();
            expect(contextMenu.element.classList.contains('e-contextmenu')).toBe(true);
        });
    });

    describe('Device Mode Checking', () => {
        afterEach(() => {
            Browser.userAgent = "";
            contextMenu.destroy();
        });
        const mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null,
            type: 'click'
        };
        it('Click event Checking', () => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1].firstChild;
            contextMenu.clickHandler(mouseEventArgs);
            const childUL: HTMLElement = contextMenu.getWrapper().children[1];
            const headerLI: Element = childUL.children[0];
            expect(headerLI.classList.contains('e-menu-header')).toEqual(true);
        });
        it('Click event Checking for ios', () => {
            const iosUserAgent: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) ' +
                'AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3';
            Browser.userAgent = iosUserAgent;
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.getIdx(contextMenu.element, contextMenu.element.children[0]);
        });
        it('Header Element Click', () => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1].firstChild;
            contextMenu.clickHandler(mouseEventArgs);
            const childUL: HTMLElement = contextMenu.getWrapper().children[1];
            const headerLI: Element = childUL.children[0];
            expect(headerLI.classList.contains('e-menu-header')).toEqual(true);
            mouseEventArgs.target = headerLI;
            contextMenu.clickHandler(mouseEventArgs);
            expect(contextMenu.getWrapper().children[0].style.display).toBe('none');
        });
        it('Header', () => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            mouseEventArgs.target = li[1].firstChild;
            contextMenu.clickHandler(mouseEventArgs);
            const childUL: HTMLElement = contextMenu.getWrapper().children[1];
            const headerLI: Element = childUL.children[0];
            expect(headerLI.classList.contains('e-menu-header')).toEqual(true);
            mouseEventArgs.target = childUL.children[1];
            contextMenu.clickHandler(mouseEventArgs);
        });
        it('enableItems', () => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.enableItems(['Copy'], false);
            expect(contextMenu.element.children[3].classList.contains('e-disabled')).toBe(true);
            contextMenu.enableItems(['Copy']);
            expect(contextMenu.element.children[3].classList.contains('e-disabled')).toBe(false);
        });
        const clickEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null,
            type: 'click',
            changedTouches: [{ clientX: 0, clientY: 0 }]
        };
        it('enableItems for Child', () => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            clickEventArgs.target = li[1];
            contextMenu.clickHandler(clickEventArgs);
            contextMenu.navIdx = [1, 0];
            contextMenu.enableItems(['Share All'], false);
        });
        it('hideItems', () => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.hideItems(['Copy']);
            contextMenu.hideItems(['Facebook']);
        });
    });

    describe('notify property changes of', () => {
        afterEach(() => {
            contextMenu.destroy();
        });
        it('cssClass', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', cssClass: 'e-custom' }, '#contextmenu');
            //null cssClass
            contextMenu.cssClass = '';
            contextMenu.dataBind();
            contextMenu.cssClass = 'e-styles e-custom';
            contextMenu.dataBind();
            const wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.classList.contains('e-styles')).toEqual(true);
            expect(wrap.classList.contains('e-custom')).toEqual(true);
        });
        it('RTL', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', enableRtl: false }, '#contextmenu');
            contextMenu.enableRtl = true;
            contextMenu.dataBind();
            const wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.classList.contains('e-rtl')).toEqual(true);
        });
        it('showItemOnClick', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            contextMenu.showItemOnClick = true;
            contextMenu.dataBind();
        });
        it('filter', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            contextMenu.filter = 'e-list-item';
            contextMenu.dataBind();
        });
        it('target', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            document.body.appendChild(ulEle);
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            contextMenu.target = '#list';
            contextMenu.dataBind();
        });
        it('items', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            contextMenu.items[0].text = "Cut";
            contextMenu.items[1].text = "Copy";
            contextMenu.items[2].text = "Paste"
            contextMenu.dataBind();
            contextMenu.items = [{text:'Paste'},{text:'Special'}];
            contextMenu.dataBind();
            expect(contextMenu.items[0].text).toEqual('Paste');
        });
    });

    describe('Keyboard actions', () => {
        afterEach(() => {
            contextMenu.destroy();
        });
        const downEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'downarrow',
            type: 'keyup',
            target: null
        };
        it('down arrow action', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[3].classList.add('e-focused');
            downEventArgs.target = li[4];
            contextMenu.keyBoardHandler(downEventArgs);
            expect((li[4] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('down arrow action with no element selected', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            downEventArgs.target = contextMenu.getWrapper();
            contextMenu.keyBoardHandler(downEventArgs);
            expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('down arrow action with last element selected', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            contextMenu.element.lastElementChild.classList.add('e-focused');
            contextMenu.keyBoardHandler(downEventArgs);
            expect(contextMenu.element.firstElementChild.classList.contains('e-focused')).toBe(true);
        });
        it('down arrow action with separator checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            const items: MenuItemModel[] = [{ text: 'Cut' }, { text: 'Copy' }, { separator: true }, { text: 'Paste' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[1].classList.add('e-focused');
            contextMenu.keyBoardHandler(downEventArgs);
            expect(li[3].classList.contains('e-focused')).toBe(true);
        });
        it('down arrow UL as target', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            downEventArgs.target = ul;
            contextMenu.keyBoardHandler(downEventArgs);
            expect(contextMenu.element.firstElementChild.classList.contains('e-focused')).toEqual(true);
        });
        const upEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'uparrow',
            type: 'keyup',
            target: null
        };
        it('up arrow action', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[3].classList.add('e-focused');
            upEventArgs.target = li[3];
            contextMenu.keyBoardHandler(upEventArgs);
            expect((li[2] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('up arrow action with no element selected', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            upEventArgs.target = contextMenu.getWrapper();
            contextMenu.keyBoardHandler(upEventArgs);
        });
        it('up arrow action with first element selected', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[0].classList.add('e-focused');
            upEventArgs.target = li[0];
            contextMenu.keyBoardHandler(upEventArgs);
            expect(contextMenu.element.lastElementChild.classList.contains('e-focused')).toBe(true);
        });
        it('up arrow action with separator checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            const items: MenuItemModel[] = [{ text: 'Cut' }, { text: 'Copy' }, { separator: true }, { text: 'Paste' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[3].classList.add('e-focused');
            upEventArgs.target = li[3];
            contextMenu.keyBoardHandler(upEventArgs);
            expect(li[1].classList.contains('e-focused')).toBe(true);
        });
        it('up arrow UL as target', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            upEventArgs.target = ul;
            contextMenu.keyBoardHandler(upEventArgs);
        });
        const leftEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'leftarrow',
            type: 'keyup'
        };
        const rightEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'rightarrow',
            type: 'keyup'
        };
        it('left arrow action', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[0].classList.add('e-focused');
            leftEventArgs.target = li[0];
            contextMenu.keyBoardHandler(leftEventArgs);
            expect(li[0].classList.contains('e-focused')).toBe(true);
        });
        it('left arrow action with focus class not added', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            leftEventArgs.target = li[0];
            contextMenu.keyBoardHandler(leftEventArgs);
        });
        it('left arrow for child elements', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[1].classList.add('e-focused');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
            leftEventArgs.target = li[1];
            contextMenu.keyBoardHandler(leftEventArgs);
            expect(contextMenu.getWrapper().childElementCount).toBe(1);
        });
        it('right arrow action', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[1].classList.add('e-focused');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
            expect(contextMenu.getWrapper().childElementCount).toBe(2);
        });
        it('right arrow action with focused not added', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
        });
        it('right arrow action for multiple sub elements', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[1].classList.add('e-focused');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
        });
        it('right arrow action for sub elements', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[1].classList.add('e-focused');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
        });
        it('right arrow action for sub elements with separator', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            const menuItems: MenuItemModel[] = [
                {
                    text: 'Preview',
                    iconCss: 'e-icons e-preview'
                },
                {
                    text: 'Share',
                    iconCss: 'e-icons e-share',
                    items: [
                        {
                            text: 'Facebook',
                            iconCss: 'e-icons e-share'
                        },
                        {
                            separator: true
                        },
                        {
                            text: 'Whatsapp',
                            iconCss: 'e-icons e-share',
                        }
                    ]
                },
                {
                    text: 'Get Link'
                }
            ];
            const menuOptions: { [key: string]: Object } = {
                target: '#target',
                items: menuItems
            };
            contextMenu = new ContextMenu(menuOptions, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = contextMenu.element.children;
            li[1].classList.add('e-focused');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
            const childUL: HTMLElement = contextMenu.getWrapper().children[1];
            li = <Element[] & NodeListOf<HTMLLIElement>>childUL.querySelectorAll('li');
            li[0].classList.remove('e-focused');
            li[1].classList.add('e-focused');
            downEventArgs.target = li[2];
            contextMenu.keyBoardHandler(downEventArgs);
        });
        it('right arrow action with separator as first element', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ target: '#target', items: [{ text: 'Cut' }, { text: 'Copy' }, { text: 'Paste', items: [{ separator: true }, { separator: true }, { text: 'Paste Special' }] }] }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[2].classList.add('e-focused');
            rightEventArgs.target = li[2];
            contextMenu.keyBoardHandler(rightEventArgs);
        });
        const escapeEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'escape',
            type: 'keyup'
        };
        it('escape action', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[0].classList.add('e-focused');
            escapeEventArgs.target = li[0];
            contextMenu.keyBoardHandler(escapeEventArgs);
        });
        const enterEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter',
            type: 'keyup'
        };
        it('enter action', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[3].classList.add('e-focused');
            enterEventArgs.target = li[3];
            contextMenu.keyBoardHandler(enterEventArgs);
            expect(contextMenu.getWrapper().children.length).toBe(1);
        });
        it('enter action for sub elements', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            const li: Element[] = contextMenu.element.querySelectorAll('li');
            li[1].classList.add('e-focused');
            enterEventArgs.target = li[1];
            contextMenu.keyBoardHandler(enterEventArgs);
            expect(contextMenu.getWrapper().children.length).toBe(2);
        });
        it('Persist data checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ target: '#target', items: items }, '#contextmenu');
            contextMenu.getPersistData();
        });
    });

    describe('Methods Checking', () => {
        afterEach(() => {
            contextMenu.destroy();
        });
        it('Prerender Checking', () => {
            ul.remove();
            document.body.appendChild(div);
            document.body.appendChild(createElement('EJS-CONTEXTMENU', { id: 'contextmenu' }));
            contextMenu = new ContextMenu(options, '#contextmenu');
            expect(contextMenu.element.parentElement.tagName).toEqual('DIV');
            expect(contextMenu.element.parentElement.classList.contains('e-contextmenu-wrapper')).toEqual(true);
        });
        it('Get scrollable parents Checking', () => {
            const targetElement: HTMLElement = createElement('div', { id: 'target2' });
            targetElement.innerHTML =
                '<div id="par" style="position: relative;overflow:scroll"><div style="position:absolute" id="target1"></div></div>';
            document.body.innerHTML = '';
            document.body.appendChild(targetElement);
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            const parents: HTMLElement[] = getScrollableParent(document.getElementById('target1'));
            expect(parents.length).toBe(2);
        });
        it('Collision Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            div.style.marginLeft = 'auto';
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 20, 20, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
    });

    describe('Public events', () => {
        afterEach(() => {
            contextMenu.destroy();
        });

        it('beforeItemRender and select event testing', () => {
            let count = 0;
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(
                {
                    target: '#target',
                    items: items,
                    animationSettings: { effect: 'None' },
                    beforeItemRender: (args: MenuEventArgs) => {
                        expect(args.name).toBe('beforeItemRender');
                        expect(args.item.text).toBe(items[count].text);
                        expect(args.element.textContent).toBe(items[count].text);
                        if (args.item.text === 'Preview') {
                            args.element.classList.add('e-check');
                        }
                        count++;
                    },
                    select: (args: MenuEventArgs) => {
                        expect(args.name).toBe('select');
                        expect(args.element).toBe(target);
                        expect(args.item).toBe(contextMenu.items[0]);
                    }
                },
                '#contextmenu');
            const target: HTMLElement = contextMenu.element.children[0];
            contextMenu.open(40, 62, target);
            expect(target.classList.contains('e-check')).toBeTruthy();
            target.click();
            expect(isVisible(contextMenu.element)).toBeFalsy();
        });

        it('beforeOpen event testing', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(
                {
                    target: '#target',
                    items: items,
                    animationSettings: { effect: 'None' },
                    beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                        expect(args.name).toBe('beforeOpen');
                        expect(args.element).toBe(contextMenu.element);
                        expect(args.items).toBe(contextMenu.items);
                        expect(args.parentItem).toBeNull();
                        expect(args.cancel).toBeFalsy();
                        args.cancel = true;
                    }
                },
                '#contextmenu');
            contextMenu.element.style.display = 'none';
            const target: HTMLElement = select('#target') as HTMLElement;
            expect(isVisible(contextMenu.element)).toBeFalsy();
            contextMenu.open(50, 30, target);
            expect(isVisible(contextMenu.element)).toBeFalsy();
        });

        it('beforeClose event testing', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(
                {
                    target: '#target',
                    items: items,
                    animationSettings: { effect: 'None' },
                    beforeClose: (args: BeforeOpenCloseMenuEventArgs) => {
                        expect(args.name).toBe('beforeClose');
                        expect(args.element).toBe(contextMenu.element);
                        expect(args.items).toBe(contextMenu.items);
                        expect(args.parentItem).toBeNull();
                        expect(args.event).toBeNull();
                        expect(args.cancel).toBeFalsy();
                        args.cancel = true;
                    }
                },
                '#contextmenu');
            const target: HTMLElement = select('#target') as HTMLElement;
            contextMenu.open(10, 10, target);
            expect(isVisible(contextMenu.element)).toBeTruthy();
            contextMenu.close();
            expect(isVisible(contextMenu.element)).toBeTruthy();
        });

        it('onOpen and onClose event testing', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(
                {
                    target: '#target',
                    items: items,
                    animationSettings: { effect: 'None' },
                    onOpen: (args: OpenCloseMenuEventArgs) => {
                        expect(args.name).toBe('onOpen');
                        expect(args.element).toBe(contextMenu.element);
                        expect(args.items).toBe(contextMenu.items);
                        expect(args.parentItem).toBeNull();
                    },
                    onClose: (args: OpenCloseMenuEventArgs) => {
                        expect(args.name).toBe('onClose');
                        expect(args.element).toBe(contextMenu.element);
                        expect(args.items).toBe(contextMenu.items);
                        expect(args.parentItem).toBeNull();
                    }
                },
                '#contextmenu');
            const target: HTMLElement = select('#target') as HTMLElement;
            contextMenu.open(20, 17, target);
            expect(isVisible(contextMenu.element)).toBeTruthy();
            contextMenu.close();
            expect(isVisible(contextMenu.element)).toBeFalsy();
        });
    });

    describe('Customer Reported issues', () => {
        afterEach(() => {
            contextMenu.destroy();
        });

        it('EJ2-50727- Role attribute error in context menu', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            const wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.children[0].getAttribute('role')).toEqual('menubar');
        });

        it('EJ2-899285 - Context Menu was not opened while using animationSettings effect as none and open method', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(
                {
                    target: '#target',
                    items: items,
                    animationSettings: { effect: 'None' },
                }, '#contextmenu');
            contextMenu.close();
            let eleBtn: HTMLElement = createElement('button', { id: 'ejbutton' });
            eleBtn.innerText = 'Open Context Menu';
            document.body.appendChild(eleBtn);            
            eleBtn.onclick = (e: Event) => { 
                contextMenu.open(20, 17);
                expect(isVisible(contextMenu.element)).toBeTruthy();
                const target: HTMLElement = contextMenu.element.children[0];
                target.click();
                expect(isVisible(contextMenu.element)).toBeFalsy();
            };
            eleBtn.click();            
        });
    });

    it('memory leak', () => {
        profile.sample();
        const average: any = inMB(profile.averageChange)
        // check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        const memory: any = inMB(getMemoryProfile())
        // check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    });

    describe('Null or undefined Property testing', () => {
        afterEach(() => {
            contextMenu.destroy();
        });
        it('ContextMenu with cssClass', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ cssClass: null }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.cssClass).toEqual(null);
            contextMenu = new ContextMenu({ cssClass: undefined }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.cssClass).toEqual('');
        });
        it('ContextMenu with RTL', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ enableRtl: null }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.enableRTL).toEqual(undefined);
            contextMenu = new ContextMenu({ enableRtl: undefined }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.enableRTL).toEqual(undefined);
        });
        it('ContextMenu with  showItemOnClick', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ showItemOnClick: null }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.showItemOnClick).toEqual(null);
            contextMenu = new ContextMenu({ showItemOnClick: undefined }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.showItemOnClick).toEqual(false);
        });
        it('ContextMenu with filter', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ filter: null }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.filter).toEqual(null);
            contextMenu = new ContextMenu({ filter: undefined }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.filter).toEqual('');
        });
        it('ContextMenu with target', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ target: null }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.target).toEqual(null);
            contextMenu = new ContextMenu({ target: undefined }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.target).toEqual('');
        });
        it('ContextMenu with items', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: null }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.items).toEqual([]);
            contextMenu = new ContextMenu({ items: undefined }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.items).toEqual([]);
        });

        it('ContextMenu with hoverDelay', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ hoverDelay: null }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.hoverDelay).toEqual(null);
            contextMenu = new ContextMenu({ hoverDelay: undefined }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.hoverDelay).toEqual(0);
        });

        it('ContextMenu with locale', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ locale: null }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.locale).toEqual('en-US');
            contextMenu = new ContextMenu({ locale: undefined }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.locale).toEqual('en-US');
        });

        it('ContextMenu with enableHtmlSanitizer', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ enableHtmlSanitizer: null }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.enableHtmlSanitizer).toEqual(null);
            contextMenu = new ContextMenu({ enableHtmlSanitizer: undefined }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.enableHtmlSanitizer).toEqual(true);
        });

        it('ContextMenu with animationSettings', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ animationSettings: { duration: null, easing: null, effect: null } }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.animationSettings.duration).toEqual(null);
            expect(contextMenu.animationSettings.easing).toEqual(null);
            expect(contextMenu.animationSettings.effect).toEqual(null);
            contextMenu = new ContextMenu({ animationSettings: { duration: undefined, easing: undefined, effect: undefined } }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.animationSettings.duration).toEqual(undefined);
            expect(contextMenu.animationSettings.easing).toEqual(undefined);
            expect(contextMenu.animationSettings.effect).toEqual(undefined);
        });

        it('ContextMenu with enablePersistence', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ enablePersistence: null }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.enablePersistence).toEqual(null);
            contextMenu = new ContextMenu({ enablePersistence: undefined }, '#contextmenu');
            contextMenu.dataBind();
            expect(contextMenu.enablePersistence).toEqual(false);
        });
    });

    describe('Context Menu With Template', () => {
        let contextMenu: ContextMenu;
        let div: HTMLElement;
        let ul: HTMLElement;
    
        beforeEach(() => {
            div = document.createElement('div');
            div.id = 'target';
            document.body.appendChild(div);
            ul = document.createElement('ul');
            ul.id = 'contextmenu';
            document.body.appendChild(ul);
        });
    
        afterEach(() => {
            // Destroy the context menu instance and clean up elements
            if (contextMenu) {
                contextMenu.destroy();
            }
            document.body.removeChild(div);
            document.body.removeChild(ul);
        });
    
        it('ContextMenu Template Testing', () => {
            const items = [
                { text: 'JavaScript' },
                { text: 'TypeScript' },
                { text: 'Angular' },
                { text: 'React' },
                { text: 'Vue' }
            ];
            contextMenu = new ContextMenu({
                items: items,
                target: '#target',
                enableScrolling: true,
                itemTemplate: "<span class='ename'>${text}</span>"
            }, '#contextmenu');
            (contextMenu as any).isReact = true
            contextMenu.refresh();
            const liElements = contextMenu.element.querySelectorAll('li .ename');
            expect(liElements[0].innerHTML).toEqual("JavaScript");
            (contextMenu as any).isReact = false;
        });
    });

    describe('Context Menu With scroll enabled', () => {
        let contextMenu: any;
        let div: HTMLElement;
        let ul: HTMLElement;
    
        beforeEach(() => {
            div = document.createElement('div');
            div.id = 'target';
            document.body.appendChild(div);
            ul = document.createElement('ul');
            ul.id = 'contextmenu';
            document.body.appendChild(ul);
        });
    
        afterEach(() => {
            // Destroy the context menu instance and clean up elements
            if (contextMenu) {
                contextMenu.destroy();
            }
            document.body.removeChild(div);
            document.body.removeChild(ul);
        });

        it('Context Menu With scroll enabled testing', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(
                {
                    target: '#target',
                    items: items,
                    enableScrolling: true,
                    beforeOpen: (args: MenuEventArgs) => {
                        args.element.parentElement.style.height = '100px';
                    }
                },
            '#contextmenu');
            contextMenu.open(40, 62);
            const wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.children[0].classList.contains('e-menu-vscroll')).toBeTruthy();
            expect(wrap.children[0].children[0].classList.contains('e-scroll-up-nav')).toBeTruthy();
            expect(wrap.children[0].lastElementChild.classList.contains('e-scroll-down-nav')).toBeTruthy();
            expect(ul.parentElement.classList.contains('e-vscroll-content')).toBeTruthy();
            (wrap.children[0].lastElementChild as HTMLElement).click();
            contextMenu.close();
            contextMenu.enableScrolling = false;
            contextMenu.dataBind();
            expect(contextMenu.enableScrolling).toBeFalsy();
        });
    });

});
