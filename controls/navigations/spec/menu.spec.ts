/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  Menu spec document
 */
import { Menu } from '../src/menu/menu';
import { MenuItemModel, BeforeOpenCloseMenuEventArgs } from '../src/common/index';
import { closest, createElement, Browser, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { profile , inMB, getMemoryProfile } from './common.spec';

function triggerMouseEvent(node: HTMLElement, eventType: string) {
    const mouseEve: MouseEvent = document.createEvent('MouseEvents');
    mouseEve.initEvent(eventType, true, true);
    node.dispatchEvent(mouseEve);
}

function appendStyles(css: string) {
    const head: HTMLHeadElement = document.getElementsByTagName('head')[0];
    const style: HTMLStyleElement = createElement('style') as HTMLStyleElement;
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
}

describe('Menu', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            this.skip(); // skips test (in Chai)
            return;
        }
    });

    let menu: any;
    const items: MenuItemModel[] = [
        {
            text: 'Home',
            id: 'home',
            iconCss: 'e-icons e-home'
        },
        {
            text: 'Book Categories',
            id: 'book',
            iconCss: 'e-icons e-book',
            items: [
                {
                    text: 'Cookbooks',
                    id: 'cookbooks',
                    iconCss: 'e-icons e-share',
                    items: [
                        {
                            text: 'Desserts',
                            iconCss: 'e-icons e-share',
                        },
                        {
                            text: 'South Indian Cooks',
                            iconCss: 'e-icons e-share',
                        },
                        {
                            text: 'Cooking tips',
                            iconCss: 'e-icons e-share',
                        }
                    ]
                },
                {
                    text: 'Children',
                    iconCss: 'e-icons e-share',
                    items: [
                        {
                            text: 'Tales',
                            iconCss: 'e-icons e-share',
                        },
                        {
                            text: 'Animals',
                            iconCss: 'e-icons e-share',
                        },
                        {
                            text: 'Dreams',
                            iconCss: 'e-icons e-share',
                        }
                    ]
                },
                {
                    text: 'technologies',
                    items: [
                        {
                            text: 'Programming Languages',
                            iconCss: 'e-icons e-share',
                        },
                        {
                            text: 'Wifi Hacking',
                            id: 'hacking',
                            iconCss: 'e-icons e-share',
                        },
                        {
                            text: 'Upcoming Tech',
                            iconCss: 'e-icons e-share',
                        }
                    ]
                }
            ]
        },
        {
            text: 'Purchase',
            iconCss: 'e-icons e-purchase',
            id: 'purchase'
        },
        {
            text: 'Contact Us',
            iconCss: 'e-icons e-contact',
            id: 'contact'
        },
        {
            separator: true,
        },
        {
            text: 'Login',
            iconCss: 'e-icons e-login',
            id: 'login'
        }
    ];
    const flatDatasource: { [key: string]: Object }[] = [
        { id: "Op1", text: "File", iconCss: "", parentId: null },
        { id: "Op2", text: "Edit", iconCss: "", parentId: null },
        { id: "Op3", text: "Go", iconCss: "", parentId: null },
        { id: "Op4", text: "Help", iconCss: "", parentId: null },

        { id: "Op5", text: "New File", iconCss: "e-icons e-link", parentId: "Op1" },
        { id: "Op6", text: "New Window", iconCss: "", parentId: "Op1" },
        { id: "Op7", text: "Undo", iconCss: "", parentId: "Op2" },

        { id: "Op8", text: "Switch Editor", iconCss: "", parentId: "Op3" },
        { id: "Op9", text: "Switch Group", iconCss: "", parentId: "Op3" },
        { id: "Op10", text: "Go to File", iconCss: "", parentId: "Op3" },

        { id: "Op11", text: "New Editor", iconCss: "", parentId: "Op8" },
        { id: "Op12", text: "Previous Editor", iconCss: "", parentId: "Op8" },

        { id: "Op13", text: "Group 1", iconCss: "", parentId: "Op9" },
        { id: "Op14", text: "Group 2", iconCss: "", parentId: "Op9" }
    ];
    const templateDatasource: { [key: string]: Object }[] = [
        { title: "Option1" },
        { title: "Option2" },
        { title: "Option3" },
        { title: "Option4" },
        { title: "Option5" }
    ];
    const ul: HTMLElement = createElement('ul', { id: 'menu' });
    const sTag: HTMLElement = createElement('script', { id: 'menuTemplate', attrs: { type: 'text/x-template' } });
    sTag.innerHTML = '<div>${title}</div>';
    const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

    describe('DOM', () => {
        afterEach(() => {
            menu.destroy();
        });
        it('Architecture Checking', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            expect(wrap.classList.contains('e-menu-wrapper')).toBeTruthy();
            expect(wrap.children[0].classList.contains('e-menu')).toBeTruthy();
            expect(wrap.children[0].getAttribute('role')).toEqual('menubar');
            expect(wrap.children[0].children[0].classList.contains('e-menu-item')).toBeTruthy();
            // Sub menu li
            const li: HTMLElement = ul.children[1] as HTMLElement;
            expect(li.classList.contains('e-menu-caret-icon')).toBeTruthy();
            expect(li.getAttribute('aria-haspopup')).toEqual('true');
            expect(li.getAttribute('aria-expanded')).toEqual('false');
            triggerMouseEvent(li, 'mouseover');
            expect(li.getAttribute('aria-expanded')).toEqual('true');
            const popup: HTMLElement = menu.getPopups()[0];
            expect(popup.classList.contains('e-menu-popup')).toBeTruthy();
            expect(popup.children[0].classList.contains('e-ul')).toBeTruthy();
            triggerMouseEvent(document.body, 'mouseover');
            expect(menu.getPopups().length).toBe(0);
        });
        it('Menu with scroll enabled', () => {
            appendStyles('#menu { width: 400px; } .e-menu-wrapper { width: 250px; } #cookbooks-ej2menu-menu-popup.e-menu-popup, #book-ej2menu-menu-popup.e-menu-popup{ height: 200px; } #cookbooks-ej2menu-menu-popup.e-menu-popup .e-ul, #book-ej2menu-menu-popup.e-menu-popup .e-ul{ height: 250px; }');
            document.body.appendChild(ul);
            menu = new Menu({ items: items, enableScrolling: true }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            let li: HTMLElement = select('#book', wrap.children[0]) as HTMLElement;
            triggerMouseEvent(li, 'mouseover');
            const popup: HTMLElement = menu.getPopups()[0];
            expect(wrap.children[0].classList.contains('e-menu-hscroll')).toBeTruthy();
            expect(wrap.children[0].children[0].classList.contains('e-scroll-left-nav')).toBeTruthy();
            expect(wrap.children[0].lastElementChild.classList.contains('e-scroll-right-nav')).toBeTruthy();
            expect(ul.parentElement.classList.contains('e-hscroll-content')).toBeTruthy();
            expect(popup.children[0].classList.contains('e-menu-vscroll')).toBeTruthy();
            expect(popup.children[0].children[0].classList.contains('e-scroll-up-nav')).toBeTruthy();
            expect(popup.children[0].lastElementChild.classList.contains('e-scroll-down-nav')).toBeTruthy();
            expect(select('.e-ul', popup).parentElement.classList.contains('e-vscroll-content')).toBeTruthy();
            li = select('#cookbooks', popup) as HTMLElement;
            triggerMouseEvent(li, 'mouseover');
            expect(menu.navIdx.length).toBe(2);
            triggerMouseEvent(document.body, 'mouseover');
        });
        it('Vertical Menu with scroll enabled', () => {
            appendStyles('#menu { height: 250px; } .e-menu-wrapper { height: 200px; }');
            document.body.appendChild(ul);
            menu = new Menu({ items: items, orientation: 'Vertical', enableScrolling: true }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            expect(ul.classList.contains('e-vertical')).toBeTruthy();
            expect(wrap.children[0].classList.contains('e-menu-vscroll')).toBeTruthy();
            expect(wrap.children[0].children[0].classList.contains('e-scroll-up-nav')).toBeTruthy();
            expect(wrap.children[0].lastElementChild.classList.contains('e-scroll-down-nav')).toBeTruthy();
            expect(ul.parentElement.classList.contains('e-vscroll-content')).toBeTruthy();
        });

        it('Vertical Menu with scroll enabled', () => {
            document.body.appendChild(createElement('ejs-menu', { id: 'ng-menu' }));
            menu = new Menu({ items: items }, '#ng-menu');
            const wrap: HTMLElement = menu.getWrapper();
            expect(wrap.classList.contains('e-menu-wrapper')).toBeTruthy();
            expect(wrap.tagName).toEqual('EJS-MENU');
            expect(wrap.children[0].classList.contains('e-menu')).toBeTruthy();
        });

        it('Hamburger mode with vertical orientation Checking', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, orientation: 'Vertical', hamburgerMode: true }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            expect(wrap.classList.contains('e-hamburger')).toEqual(true);
            expect(wrap.children[0].classList.contains('e-vertical')).toEqual(true);
        });

        it('Hamburger mode with user interaction checking', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, hamburgerMode: true }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            (wrap.children[0].getElementsByClassName('e-menu-icon')[0] as HTMLElement).click();
            expect(menu.element.classList.contains('e-hide-menu')).toBeFalsy();
            // Sub menu li
            const li: HTMLElement = ul.children[1] as HTMLElement;
            triggerMouseEvent(li, 'mouseover');
            expect(li.getElementsByTagName('ul').length).toBeGreaterThan(0);
            const subLi: HTMLElement = li.getElementsByTagName('ul')[0].children[2] as HTMLElement;
            triggerMouseEvent(subLi, 'mouseover');
            expect(subLi.getElementsByTagName('ul').length).toBeGreaterThan(0);
            (wrap.children[0].getElementsByClassName('e-menu-icon')[0] as HTMLElement).click();
            expect(menu.element.classList.contains('e-hide-menu')).toBeTruthy();
            menu.destroy();
            menu = new Menu({ items: items, orientation: 'Vertical' }, '#menu');
            menu.hamburgerMode = true;
            menu.dataBind();
            expect(menu.element.previousElementSibling.classList.contains('e-vertical')).toBeTruthy();
        });

        it('target with or without hamburger mode checking', () => {
            document.body.appendChild(ul);
            const trgtElem: HTMLElement = createElement('button', { id: 'menuTrgt' });
            document.body.appendChild(trgtElem);
            menu = new Menu({ items: items, hamburgerMode: true }, '#menu');
            menu.target = '#menuTrgt';
            menu.dataBind();
            expect(menu.element.classList.contains('e-hide-menu')).toBeTruthy();
            menu.destroy();
            menu = new Menu({ items: items, target: '#menuTrgt' }, '#menu');
            menu.hamburgerMode = true;
            menu.dataBind();
            expect(menu.element.previousElementSibling.classList.contains('e-vertical')).toBeTruthy();
            menu.destroy();
            menu = new Menu({ items: items, hamburgerMode: true, target: '#menuTrgt' }, '#menu');
            menu.target = '';
            menu.dataBind();
            expect(menu.element.previousElementSibling.classList.contains('e-vertical')).toBeFalsy();
            menu.destroy();
            menu = new Menu({ items: items, orientation: 'Vertical', target: '#menuTrgt' }, '#menu');
            menu.title = 'Hamburger';
            menu.dataBind();
            const wrap: HTMLElement = menu.getWrapper();
            menu.hamburgerMode = true;
            menu.dataBind();
            expect(menu.element.previousElementSibling.classList.contains('e-vertical')).toBeFalsy();
            expect(wrap.getElementsByClassName('e-menu-title')[0].innerHTML).toBe('Hamburger');
        });
    });

    describe('Property', () => {
        afterEach(() => {
            menu.destroy();
        });
        it('cssClass Checking', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, cssClass: 'e-custom e-custom1' }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            expect(wrap.classList.contains('e-custom')).toEqual(true);
            expect(wrap.classList.contains('e-custom1')).toEqual(true);
        });
        it('orientation Checking', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, orientation: 'Vertical' }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            expect(wrap.children[0].classList.contains('e-vertical')).toEqual(true);
        });
        it('Hamburger mode Checking', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, hamburgerMode: true }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            expect(wrap.classList.contains('e-hamburger')).toEqual(true);
            menu.hamburgerMode = false;
            menu.dataBind();
            expect(wrap.classList.contains('e-hamburger')).toEqual(false);
        });
        it('title Checking', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, hamburgerMode: true }, '#menu');
            menu.title = 'Hamburger Menu';
            menu.dataBind();
            const wrap: HTMLElement = menu.getWrapper();
            expect(wrap.getElementsByClassName('e-menu-title')[0].innerHTML).toEqual('Hamburger Menu');
        });
        it('flat datasource binding', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: flatDatasource }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            expect(wrap.children[0].classList.contains('e-menu')).toEqual(true);
        });
        it('template checking', () => {
            document.body.appendChild(ul);
            document.body.appendChild(sTag);
            menu = new Menu({ items: templateDatasource, fields: { text: 'title' }, template: "#menuTemplate" }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            expect(wrap.children[0].children[0].textContent).toEqual('Option1');
        });
        it('enableScrolling Checking', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, enableScrolling: true }, '#menu');
            expect(menu.enableScrolling).toBeTruthy();
        });
    });

    describe('Public Methods Checking', () => {
        afterEach(() => {
            menu.destroy();
        });

        it('Show and Hide items', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.hideItems(['Home', 'Purchase']);
            expect(ul.children[0].classList.contains('e-menu-hide')).toBeTruthy();
            expect(ul.children[2].classList.contains('e-menu-hide')).toBeTruthy();
            menu.showItems(['home', 'purchase'], true);
            expect(ul.children[0].classList.contains('e-menu-hide')).toBeFalsy();
            expect(ul.children[2].classList.contains('e-menu-hide')).toBeFalsy();
            menu.destroy();
        });

        it('Enable and Disable items', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, showItemOnClick: true }, '#menu');
            menu.enableItems(['hacking', 'purchase', 'cookbooks'], false, true);
            expect(ul.children[2].classList.contains('e-disabled')).toBeTruthy();
            (menu.element.children[1] as HTMLElement).click();
            menu.enableItems(['hacking', 'purchase', 'cookbooks'], false, true);
            const popup: Element = menu.getPopups()[0].firstElementChild;
            expect(popup.children[0].classList.contains('e-disabled')).toBeTruthy();
            (popup.children[1] as HTMLElement).click();
            expect(menu.getPopups()[1].firstElementChild.children[1].classList.contains('e-disabled')).toBeFalsy();
            (popup.children[2] as HTMLElement).click();
            menu.enableItems(['hacking', 'purchase', 'cookbooks'], false, true);
            expect(menu.getPopups()[1].firstElementChild.children[1].classList.contains('e-disabled')).toBeTruthy();
            menu.enableItems(['Wifi Hacking', 'Purchase', 'Cookbooks'], true);
            expect(ul.children[2].classList.contains('e-disabled')).toBeFalsy();
            expect(popup.children[0].classList.contains('e-disabled')).toBeFalsy();
            expect(menu.getPopups()[1].firstElementChild.children[1].classList.contains('e-disabled')).toBeFalsy();
        });

        it('intertAfter, insertBefore and removeItems', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.insertBefore([{ text: 'Blog', id: 'blog' }], 'contact', true);
            expect(menu.items[3].text).toBe('Blog');
            expect(menu.items[3].id).toBe('blog');
            menu.removeItems(['Blog']);
            expect(menu.items[3].text).toBe('Contact Us');
            menu.insertAfter([{ text: 'Blog', id: 'blog' }], 'Contact Us');
            expect(menu.items[4].text).toBe('Blog');
            expect(menu.items[4].id).toBe('blog');
            menu.removeItems(['blog'], true);
            expect(menu.items[4].separator).toBeTruthy();
        });

        it('open and close', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, hamburgerMode: true }, '#menu');
            menu.open();
            expect(menu.element.classList.contains('e-hide-menu')).toBeFalsy();
            menu.close();
            expect(menu.element.classList.contains('e-hide-menu')).toBeTruthy();
            menu.hamburgerMode = false;
            menu.dataBind();
            menu.open();
            expect(menu.element.classList.contains('e-hide-menu')).toBeFalsy();
            menu.close();
            expect(menu.element.classList.contains('e-hide-menu')).toBeTruthy();
        });
		it('setitem', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
			expect(menu.element.children[0].textContent).toEqual('Home');
            menu.setItem({text: 'Home1'}, 'home', true);
            menu.refresh();
			expect(menu.element.children[0].textContent).toEqual('Home1');
			menu.setItem({text: 'Home'}, 'Home1');
            menu.refresh();
			expect(menu.element.children[0].textContent).toEqual('Home');
			menu.setItem({text: 'Home1', id: 'home' }, null, true);
            menu.refresh();
			expect(menu.element.children[0].textContent).toEqual('Home1'); 
        });
    });

    describe('Events', () => {
        afterEach(() => {
            Browser.userAgent = '';
            menu.destroy();
        });
        it('Custom position using beforeOpen', () => {
            document.body.appendChild(ul);
            let left: string; let top: string;
            menu = new Menu({
                items: items,
                showItemOnClick: true,
                beforeOpen: (args: BeforeOpenCloseMenuEventArgs) => {
                    if (args.parentItem.text === 'Book Categories') {
                        const position: ClientRect = closest(args.event.target as Element, '.e-menu-item').getBoundingClientRect();
                        args.left = position.left + pageXOffset;
                        left = args.left + 'px';
                        args.element.parentElement.style.display = 'block';
                        args.top = (position.top + pageYOffset) - args.element.parentElement.offsetHeight;
                        top = args.top + 'px';
                    }
                }
            }, '#menu');
            (ul.children[1] as HTMLElement).click();
            const popup: HTMLElement = menu.getPopups()[0];
            expect(popup.style.left).toEqual(left);
            expect(popup.style.top).toEqual(top);
            (ul.children[2] as HTMLElement).click();
        });
    });

    describe('Device Mode Checking', () => {
        afterEach(() => {
            Browser.userAgent = '';
            menu.destroy();
        });
        it('Scrollable mode Checking', () => {
            Browser.userAgent = androidUserAgent;
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            expect(menu.getWrapper().classList.contains('e-scrollable')).toEqual(true);
        });
    });

    describe('notify property changes of', () => {
        afterEach(() => {
            menu.destroy();
        });

        it('orientation', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.orientation = 'Vertical';
            menu.dataBind();
            expect(ul.classList.contains('e-vertical')).toBeTruthy();
            menu.orientation = 'Horizontal';
            menu.dataBind();
            expect(ul.classList.contains('e-vertical')).toBeFalsy();
        });
        it('hamburger mode', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.hamburgerMode = true;
            menu.dataBind();
            expect(menu.getWrapper().classList.contains('e-hamburger')).toBeTruthy();
            menu.hamburgerMode = false;
            menu.dataBind();
            expect(menu.getWrapper().classList.contains('e-hamburger')).toBeFalsy();
        });
        it('hamburger mode with orientation', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, hamburgerMode: true }, '#menu');
            menu.orientation = 'Vertical';
            menu.dataBind();
            expect(ul.previousElementSibling.classList.contains('e-vertical')).toBeTruthy();
            menu.orientation = 'Horizontal';
            menu.dataBind();
            expect(ul.previousElementSibling.classList.contains('e-vertical')).toBeFalsy();
        });
        it('items', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            expect(menu.items[0].text).toEqual('Home');
            expect(ul.children[1].textContent).toEqual('Book Categories');
            menu.items =  [
                { text: 'File', iconCss: 'e-file', items: [{ text: 'Open', iconCss: 'em-icons e-open' },{ separator: true },{ text: 'Exit' }] },
                { text: 'Edit' },{ text: 'View',
                  items: [{ text: 'Toolbars', items: [{ text: 'Menu Bar' },{ text: 'Bookmarks Toolbar' },{ text: 'Customize' }] },
                    { text: 'Zoom', items: [{ text: 'Zoom In' },{ text: 'Zoom Out' },{ text: 'Reset' }] }, { text: 'Full Screen' }]
                },{ text: 'Tools' },{ text: 'Help' }
            ];
            menu.dataBind();
            expect(menu.items[0].text).toEqual('File');
            expect(menu.items.length).toEqual(ul.childElementCount);
            expect(ul.children[1].textContent).toEqual('Edit');
        });
        it('Self referential menu items', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: flatDatasource }, '#menu');
            expect(menu.items[1].text).toEqual('Edit');
            expect(ul.children[2].textContent).toEqual('Go');
            menu.items = [
                { id: 'parent1', text: 'Appliances', parentId: null },
                { id: 'parent2', text: 'Accessories', parentId: null },
                { id: 'parent3', text: 'Fashion', parentId: null },
                { id: 'parent6', text: 'Kitchen', parentId: 'parent1' },
                { id: 'parent7', text: 'Washing Machine', parentId: 'parent1' },
                { id: 'parent8', text: 'Air Conditioners', parentId: 'parent1' },
                { id: 'parent9', text: 'Electric Cookers', parentId: 'parent6' },
                { id: 'parent10', text: 'Coffee Makers', parentId: 'parent6' },
                { id: 'parent11', text: 'Blenders', parentId: 'parent6' },
                { id: 'parent17', text: 'Mobile', parentId: 'parent2' },
                { id: 'parent18', text: 'Computer', parentId: 'parent2' }
            ];
            menu.dataBind();
            expect(menu.items[0].text).toEqual('Appliances');
            expect(menu.items[2].text).toEqual('Fashion');
            expect(menu.items.length).toEqual(ul.childElementCount);
            expect(ul.children[1].textContent).toEqual('Accessories');
            expect(ul.children[2].textContent).toEqual('Fashion');
            let li: HTMLElement = ul.children[0] as HTMLElement;
            triggerMouseEvent(li, 'mouseover');
            let popup: Element[] = menu.getPopups();
            expect(popup.length).toBe(1);
            expect(li.classList.contains('e-selected')).toEqual(true);
            li = popup[0].querySelector('.e-menu-item');
            triggerMouseEvent(li, 'mouseover');
            popup = menu.getPopups();
            expect(popup.length).toBe(2);
            expect(li.classList.contains('e-selected')).toEqual(true);
        });
        it('showItemOnClick', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            const li: HTMLElement = ul.children[1] as HTMLElement;
            triggerMouseEvent(li, 'mouseover');
            let popup: Element[] = menu.getPopups();
            expect(popup.length).toBe(1);
            triggerMouseEvent(li, 'mousedown');
            triggerMouseEvent(document.body, 'mouseover');
            popup = menu.getPopups();
            expect(popup.length).toBe(0);
            menu.showItemOnClick = true;
            menu.dataBind();
            triggerMouseEvent(li, 'mouseover');
            popup = menu.getPopups();
            expect(popup.length).toBe(0);
        });
        it('cssClass', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.cssClass = 'e-test-css';
            menu.dataBind();
            expect(menu.getWrapper().classList.contains('e-test-css')).toEqual(true);
            menu.cssClass = '';
            menu.dataBind();
            expect(menu.getWrapper().classList.contains('e-test-css')).toBeFalsy();
        });
        it('enableScrolling', () => {
            appendStyles('#menu { height: 400px; } .e-menu-wrapper { height: 250px; } #cookbooks-menu-popup.e-menu-popup{ height: 200px; } #cookbooks-menu-popup.e-menu-popup .e-ul{ height: 250px; }');
            document.body.appendChild(ul);
            menu = new Menu({ items: items, animationSettings: { effect: 'None' } }, '#menu');
            const wrap: HTMLElement = menu.getWrapper();
            const li: HTMLElement = ul.children[1] as HTMLElement;
            triggerMouseEvent(li, 'mouseover');
            let popup: HTMLElement = menu.getPopups()[0];
            menu.enableScrolling = true;
            menu.dataBind();
            expect(wrap.children[0].classList.contains('e-menu-hscroll')).toBeTruthy();
            expect(ul.parentElement.classList.contains('e-hscroll-content')).toBeTruthy();
            expect(popup.children[0].classList.contains('e-menu-vscroll')).toBeTruthy();
            expect(select('.e-ul', popup).parentElement.classList.contains('e-vscroll-content')).toBeTruthy();
            menu.enableScrolling = false;
            menu.dataBind();
            expect(wrap.children[0].classList.contains('e-menu-hscroll')).toBeFalsy();
            expect(ul.parentElement.classList.contains('e-menu-wrapper')).toBeTruthy();
            expect(popup.children[0].classList.contains('e-menu-vscroll')).toBeFalsy();
            expect(select('.e-ul', popup).parentElement.classList.contains('e-menu-popup')).toBeTruthy();
            triggerMouseEvent(document.body, 'mouseover');
            triggerMouseEvent(li, 'mouseover');
            menu.orientation = 'Vertical';
            menu.dataBind();
            expect(ul.classList.contains('e-vertical')).toBeTruthy();
            menu.enableScrolling = true;
            menu.dataBind();
            popup = menu.getPopups()[0].children[0] as HTMLElement;
            expect(ul.parentElement.classList.contains('e-vscroll-content')).toBeTruthy();
            expect(popup.classList.contains('e-menu-vscroll')).toBeTruthy();
            popup.click();
            menu.enableScrolling = false;
            menu.dataBind();
            expect(ul.parentElement.classList.contains('e-vscroll-content')).toBeFalsy();
            expect(ul.parentElement.classList.contains('e-menu-wrapper')).toBeTruthy();
            triggerMouseEvent(document.body, 'mouseover');
        });
    });

    describe('Keyboard actions', () => {
        afterEach(() => {
            menu.destroy();
        });
        const endEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'end',
            type: 'keyup',
            target: null
        };
        const homeEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'home',
            type: 'keyup',
            target: null
        };
        const rightEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'rightarrow',
            type: 'keyup',
            target: null
        };
        const leftEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'leftarrow',
            type: 'keyup',
            target: null
        };
        const upEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'uparrow',
            type: 'keyup',
            target: null
        };
        const downEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'downarrow',
            type: 'keyup',
            target: null
        };
        const enterEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'enter',
            type: 'keyup',
            target: null
        };
        it('end arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(endEventArgs);
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[li.length - 1] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('home arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(homeEventArgs);
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('right arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(rightEventArgs);
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('left arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(leftEventArgs);
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[li.length - 1] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('down arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(rightEventArgs);
            menu.keyBoardHandler(rightEventArgs);
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(downEventArgs);
            const subElem: HTMLElement = menu.getPopups()[0];
            expect(isNullOrUndefined(subElem)).toBe(false);
            menu.keyBoardHandler(leftEventArgs);
        });
        it('up arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(rightEventArgs);
            menu.keyBoardHandler(rightEventArgs);
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(upEventArgs);
            const subElem: HTMLElement = menu.getPopups()[0];
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>subElem.querySelectorAll('li');
            expect((li[li.length - 1] as Element).classList.contains('e-focused')).toBe(true);
            menu.closeMenu(1);
        });
        it('enter action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, hamburgerMode: true }, '#menu');
            expect(menu.element.classList.contains('e-hide-menu')).toBe(true);
            menu.getWrapper().querySelector('.e-menu-header .e-menu-icon').focus();
            enterEventArgs.target = document.activeElement;
            menu.keyBoardHandler(enterEventArgs);
            expect(menu.element.classList.contains('e-hide-menu')).toBe(false);
        });
        it('rtl - right arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, enableRtl: true, orientation: 'Vertical' }, '#menu');
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(rightEventArgs);
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[1] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('rtl - left arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, enableRtl: true, orientation: 'Vertical' }, '#menu');
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(leftEventArgs);
            const subElem: HTMLElement = menu.getPopups()[0];
            const li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>subElem.querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
            menu.closeMenu(1);
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

    describe('CR issues', () => {
        afterEach(() => {
            menu.destroy();
        });
        it('EJ2-46737 - Delay support on hovering the menu', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, hoverDelay: 300}, '#menu');
            expect(menu.hoverDelay).toEqual(300);
        });
        it('EJ2-49377 - Hamburger mode is not working when items are dynamically added', () => {
            document.body.appendChild(ul);
            let menuItems: MenuItemModel[] = [];
             menu = new Menu({ items: menuItems , hamburgerMode: true, showItemOnClick: true}, '#menu');
             menu.items = [
                     {
                     text: 'File',
                     iconCss: 'em-icons e-file',
                     items: [
                       { text: 'Open', iconCss: 'em-icons e-open' },
                       { text: 'Save', iconCss: 'em-icons e-save' },
                       { separator: true },
                       { text: 'Exit' }
                     ]
                     },
                     {
                     text: 'Edit',
                     iconCss: 'em-icons e-edit',
                     items: [
                       { text: 'Cut', iconCss: 'em-icons e-cut' },
                       { text: 'Copy', iconCss: 'em-icons e-copy' },
                       { text: 'Paste', iconCss: 'em-icons e-paste' }
                     ]
                     },
                     {
                     text: 'View',
                     items: [
                       {
                         text: 'Toolbars',
                         items: [
                           { text: 'Menu Bar' },
                           { text: 'Bookmarks Toolbar' },
                           { text: 'Customize' }
                         ]
                       },
                       {
                         text: 'Zoom',
                         items: [{ text: 'Zoom In' }, { text: 'Zoom Out' }, { text: 'Reset' }]
                       },
                       { text: 'Full Screen' }
                     ]
                     },
                     {
                     text: 'Tools',
                     items: [
                       { text: 'Spelling & Grammar' },
                       { text: 'Customize' },
                       { separator: true },
                       { text: 'Options' }
                     ]
                     },
                     {
                     text: 'Help'
                     }
             ];
             menu.dataBind();
             const wrap: HTMLElement = menu.getWrapper();
             expect(wrap.classList.contains('e-menu-wrapper')).toBeTruthy();
             expect(wrap.lastElementChild.classList.contains('e-menu')).toBeTruthy();
             expect(wrap.lastElementChild.getAttribute('role')).toEqual('menubar');
             expect(wrap.lastElementChild.childElementCount).toEqual(5);
         });
    });
});