/**
 *  Context Menu spec document
 */
import { ContextMenu } from '../src/context-menu/context-menu';
import { BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs, MenuEventArgs } from '../src/common/menu-base';
import { MenuItemModel } from '../src/common/menu-base-model';
import { createElement, select, isVisible, EventHandler, Browser } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';

function copyObject(source: any, destination: any): Object {
    for (let prop in source) {
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
    let tempEvent: any = document.createEvent(eventType);
    tempEvent.initEvent(eventName, true, true);
    let returnObject: any = copyObject(tempEvent, {});
    returnObject.preventDefault = () => { return true; };
    return returnObject;
}

describe('ContextMenu', () => {
    let contextMenu: any;
    let items: MenuItemModel[] = [
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
    let options: { [key: string]: Object } = {
        target: '#target',
        items: items
    };
    let ul: HTMLElement = createElement('ul', { id: 'contextmenu' });
    let parent: HTMLElement = createElement('div', { id: 'parentEle' });
    let div: HTMLElement = createElement('div', { id: 'target', styles: 'width: 300px;height: 300px' });
    let filterDiv: HTMLElement = createElement('div', { className: 'e-list-item', styles: 'width: 100px;height: 100px' });
    let ulEle: HTMLElement = createElement('ul', { id: 'list' });
    let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

    describe('DOM', () => {
        afterEach(() => {
            contextMenu.destroy();
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
            expect(ul.classList.contains('e-contextmenu')).toBe(true);
            contextMenu.cssClass = 'e-test';
            contextMenu.dataBind();
            contextMenu.getPersistData();
            let item: MenuItemModel;
            contextMenu.scrollHandler();
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
            let wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.classList.contains('e-custom')).toEqual(true);
        });
        it('RTL Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', enableRtl: true }, '#contextmenu');
            let wrap: HTMLElement = contextMenu.getWrapper();
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
        let mouseEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            target: null,
            type: 'click',
            changedTouches: [{ clientX: 0, clientY: 0 }]
        };
        let touchEventArgs: any = {
            originalEvent: mouseEventArgs
        };
        it('RTL for Submenu', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', enableRtl: true }, '#contextmenu');
            let wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.classList.contains('e-rtl')).toEqual(true);
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            mouseEventArgs.target = li[0];
            contextMenu.clickHandler(mouseEventArgs);
            expect(ul.style.display).toBe('none');
        });
        it('showItemOnClick Checking on li having sub menu element', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', showItemOnClick: true }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            let wrap: HTMLElement = contextMenu.getWrapper();
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
            let items: MenuItemModel[] = [{ text: 'Cut', iconCss: 'e-cut' }, { text: 'Copy' }, { text: 'Paste' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            let span: HTMLElement = li[0].children[0] as HTMLElement;
            expect(span.classList.contains('e-menu-icon')).toEqual(true);
        });
        it('Separator Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            let items: MenuItemModel[] = [{ text: 'Cut', iconCss: 'e-cut' }, { text: 'Copy' }, { separator: true }, { text: 'Paste' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect(li[2].classList.contains('e-separator')).toEqual(true);
        });
        it('Filter checking', () => {
            div.appendChild(filterDiv);
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ target: '#target', items: items, filter: 'e-list-item' }, '#contextmenu');
            contextMenu.appendTo('#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 10, select('.e-list-item'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
        it('Right click on non filter element', () => {
            let nonFilter: HTMLElement = createElement('div', { className: 'e-filter', styles: 'width: 100px;height: 100px' });
            div.appendChild(filterDiv);
            div.appendChild(nonFilter);
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ target: '#target', items: items, filter: 'e-filter' }, '#contextmenu');
            contextMenu.appendTo('#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 10, select('.e-list-item'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
        });
    });

    describe('Mouse events', () => {
        afterEach(() => {
            contextMenu.destroy();
        });
        let mouseEventArgs: any = {
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'mouseover';
            contextMenu.clickHandler(mouseEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1];
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'mouseover';
            contextMenu.moverHandler(mouseEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1];
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'click';
            contextMenu.clickHandler(mouseEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1];
        });
        it('Hover on Separator element', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            let items: MenuItemModel[] = [{ text: 'Cut', iconCss: 'e-cut' }, { text: 'Copy' }, { separator: true }, { text: 'Paste' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'click';
            contextMenu.clickHandler(mouseEventArgs);
            contextMenu.clickHandler(mouseEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1];
        });
        it('Mouse Click on sub items not having sub elements', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, showItemOnClick: true, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'click';
            contextMenu.clickHandler(mouseEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1];
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            mouseEventArgs.target = li[1];
            mouseEventArgs.type = 'click';
            contextMenu.moverHandler(mouseEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1];
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            contextMenu.moverHandler({ type: 'mouseover', target: li[1] });
            contextMenu.enableItems(['Share All'], true);
        });
    });

    describe('Device Mode Checking', () => {
        afterEach(() => {
            Browser.userAgent = "";
            contextMenu.destroy();
        });
        let mouseEventArgs: any = {
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            mouseEventArgs.target = li[1].firstChild;
            contextMenu.clickHandler(mouseEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1];
            let headerLI: Element = childUL.children[0];
            expect(headerLI.classList.contains('e-menu-header')).toEqual(true);
        });
        it('Click event Checking for ios', () => {
            let iosUserAgent: string = 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) ' +
                'AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3';
            Browser.userAgent = iosUserAgent;
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.getIdx(ul, ul.children[0]);
        });
        it('Header Element Click', () => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            mouseEventArgs.target = li[1].firstChild;
            contextMenu.clickHandler(mouseEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1];
            let headerLI: Element = childUL.children[0];
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            mouseEventArgs.target = li[1].firstChild;
            contextMenu.clickHandler(mouseEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1];
            let headerLI: Element = childUL.children[0];
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
        let clickEventArgs: any = {
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let wrap: HTMLElement = contextMenu.getWrapper();
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
            let wrap: HTMLElement = contextMenu.getWrapper();
            expect(wrap.classList.contains('e-styles')).toEqual(true);
            expect(wrap.classList.contains('e-custom')).toEqual(true);
        });
        it('RTL', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu({ items: items, target: '#target', enableRtl: false }, '#contextmenu');
            contextMenu.enableRtl = true;
            contextMenu.dataBind();
            let wrap: HTMLElement = contextMenu.getWrapper();
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
        });
    });

    describe('Keyboard actions', () => {
        afterEach(() => {
            contextMenu.destroy();
        });
        let downEventArgs: any = {
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let items: MenuItemModel[] = [{ text: 'Cut' }, { text: 'Copy' }, { separator: true }, { text: 'Paste' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            expect(ul.firstElementChild.classList.contains('e-focused')).toEqual(true);
        });
        let upEventArgs: any = {
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            li[0].classList.add('e-focused');
            upEventArgs.target = li[0];
            contextMenu.keyBoardHandler(upEventArgs);
            expect(contextMenu.element.lastElementChild.classList.contains('e-focused')).toBe(true);
        });
        it('up arrow action with separator checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            let items: MenuItemModel[] = [{ text: 'Cut' }, { text: 'Copy' }, { separator: true }, { text: 'Paste' }];
            contextMenu = new ContextMenu({ items: items, target: '#target' }, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
        let leftEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'leftarrow',
            type: 'keyup'
        };
        let rightEventArgs: any = {
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            li[1].classList.add('e-focused');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1].firstChild;
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            li[1].classList.add('e-focused');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1].firstChild;
            expect(contextMenu.getWrapper().childElementCount).toBe(2);
        });
        it('right arrow action with focused not added', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            li[1].classList.add('e-focused');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1].firstChild;
        });
        it('right arrow action for sub elements', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.appendTo('#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            li[1].classList.add('e-focused');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
        });
        it('right arrow action for sub elements with separator', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            let menuItems: MenuItemModel[] = [
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
            let menuOptions: { [key: string]: Object } = {
                target: '#target',
                items: menuItems
            };
            contextMenu = new ContextMenu(menuOptions, '#contextmenu');
            contextMenu.appendTo('#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = contextMenu.element.children;
            li[1].classList.add('e-focused');
            rightEventArgs.target = li[1];
            contextMenu.keyBoardHandler(rightEventArgs);
            let childUL: HTMLElement = contextMenu.getWrapper().children[1];
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            li[2].classList.add('e-focused');
            rightEventArgs.target = li[2];
            contextMenu.keyBoardHandler(rightEventArgs);
        });
        let escapeEventArgs: any = {
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
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            li[0].classList.add('e-focused');
            escapeEventArgs.target = li[0];
            contextMenu.keyBoardHandler(escapeEventArgs);
        });
        let enterEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter',
            type: 'keyup'
        };
        it('enter action', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.appendTo('#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            li[3].classList.add('e-focused');
            enterEventArgs.target = li[3];
            contextMenu.keyBoardHandler(enterEventArgs);
            expect(contextMenu.getWrapper().children.length).toBe(1);
        });
        it('enter action for sub elements', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.appendTo('#contextmenu');
            let contextmenu: any = getEventObject('MouseEvents', 'contextmenu');
            contextmenu = setMouseCoordinates(contextmenu, 5, 5, select('#target'));
            EventHandler.trigger(div, 'contextmenu', contextmenu);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
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
            let targetElement: HTMLElement = createElement('div', { id: 'target2' });
            targetElement.innerHTML =
                '<div id="par" style="position: relative;overflow:scroll"><div style="position:absolute" id="target1"></div></div>';
            document.body.innerHTML = '';
            document.body.appendChild(targetElement);
            document.body.appendChild(div);
            document.body.appendChild(ul);
            contextMenu = new ContextMenu(options, '#contextmenu');
            let parents: HTMLElement[] = getScrollableParent(document.getElementById('target1'));
            expect(parents.length).toBe(2);
        });
        it('Collision Checking', () => {
            document.body.appendChild(div);
            document.body.appendChild(ul);
            div.style.marginLeft = 'auto';
            contextMenu = new ContextMenu(options, '#contextmenu');
            contextMenu.appendTo('#contextmenu');
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
            let count: number = 0;
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
            let target: HTMLElement = contextMenu.element.children[0];
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
                        expect(args.event).toBeNull();
                        expect(args.cancel).toBeFalsy();
                        args.cancel = true;
                    }
                },
                '#contextmenu');
            contextMenu.element.style.display = 'none';
            let target: HTMLElement = select('#target') as HTMLElement;
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
            let target: HTMLElement = select('#target') as HTMLElement;
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
            let target: HTMLElement = select('#target') as HTMLElement;
            contextMenu.open(20, 17, target);
            expect(isVisible(contextMenu.element)).toBeTruthy();
            contextMenu.close();
            expect(isVisible(contextMenu.element)).toBeFalsy();
        });
    });
});