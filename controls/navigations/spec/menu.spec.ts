/**
 *  Menu spec document
 */
import { Menu } from '../src/menu/menu';
import { MenuItemModel } from '../src/common/menu-base-model';
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';

describe('Menu', () => {
    let menu: any;
    let items: MenuItemModel[] = [
        {
            text: 'Home',
            iconCss: 'e-icons e-home'
        },
        {
            text: 'Book Categories',
            iconCss: 'e-icons e-book',
            items: [
                {
                    text: 'Cookbooks',
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
                    iconCss: 'e-icons e-share',
                    items: [
                        {
                            text: 'Programming Languages',
                            iconCss: 'e-icons e-share',
                        },
                        {
                            text: 'Wifi Hacking',
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
            iconCss: 'e-icons e-purchase'
        },
        {
            text: 'Contact Us',
            iconCss: 'e-icons e-contact'
        },
        {
            separator: true,
        },
        {
            text: 'Login',
            iconCss: 'e-icons e-login'
        }
    ];
    let flatDatasource: { [key: string]: Object }[] = [
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
    let templateDatasource: { [key: string]: Object }[] = [
        { title: "Option1" },
        { title: "Option2" },
        { title: "Option3" },
        { title: "Option4" },
        { title: "Option5" }
    ];
    let ul: HTMLElement =  createElement('ul', { id: 'menu' });
    let sTag: HTMLElement = createElement('script', { id: 'menuTemplate', attrs:{ type: 'text/x-template' } });
    sTag.innerHTML = '<div>${title}</div>';
    let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

    describe('DOM', () => {
        afterEach(() => {
            menu.destroy();
        });
    });

    describe('Property', () => {
        afterEach(() => {
            menu.destroy();
        });
        it('cssClass Checking', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, cssClass: 'e-custom e-custom1' }, '#menu');
            let wrap: HTMLElement = menu.getWrapper();
            expect(wrap.classList.contains('e-custom')).toEqual(true);
            expect(wrap.classList.contains('e-custom1')).toEqual(true);
        });
        it('orientation Checking', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, orientation: 'Vertical' }, '#menu');
            let wrap: HTMLElement = menu.getWrapper();
            expect(wrap.children[0].classList.contains('e-vertical')).toEqual(true);
        });
        it('flat datasource binding', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: flatDatasource }, '#menu');
            let wrap: HTMLElement = menu.getWrapper();
            expect(wrap.children[0].classList.contains('e-menu')).toEqual(true);
        });
        it('template checking', () => {
            document.body.appendChild(ul);
            document.body.appendChild(sTag);
            menu = new Menu({ items: templateDatasource, fields: { text: 'title' }, template: "#menuTemplate" }, '#menu');
            let wrap: HTMLElement = menu.getWrapper();
            expect(wrap.children[0].children[0].textContent).toEqual('Option1');
        });
    });

    describe('Mouse events', () => {
        afterEach(() => {
            menu.destroy();
        });

        it('Opening submenu inside relative element Checking', () => {
            let relativeEle: HTMLElement = createElement('div');
            relativeEle.style.position = 'relative';
            document.body.appendChild(relativeEle);
            relativeEle.appendChild(ul);
            menu = new Menu({ items: items, showItemOnClick: true }, '#menu');
            (menu.element.children[1] as HTMLElement).click();
            expect(menu.getWrapper().childElementCount).toEqual(2);
        });
    });

    describe('Public Methods Checking', () => {
        afterEach(() => {
            menu.destroy();
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
            let wrap: HTMLElement = menu.getWrapper();
            expect(wrap.children[0].classList.contains('e-scrollable')).toEqual(true);
        });
    });

    describe('notify property changes of', () => {
        afterEach(() => {
            menu.destroy();
        });

        it('orientation', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.orientation = 'vertical';
            menu.dataBind();
        });

        it('orientation', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, orientation: 'Vertical' }, '#menu');
            menu.orientation = 'horizontal';
            menu.dataBind();
        });
        it('showItemOnClick', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.showItemOnClick = true;
            menu.dataBind();
        });
        it('showItemOnClick', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.cssClass = 'e-test-css';
            menu.dataBind();
            expect(menu.getWrapper().classList.contains('e-test-css')).toEqual(true);
        });
    });

    describe('Keyboard actions', () => {
        afterEach(() => {
            menu.destroy();
        });
        let endEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'end',
            type: 'keyup',
            target: null
        };
        let homeEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'home',
            type: 'keyup',
            target: null
        };
        let rightEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'rightarrow',
            type: 'keyup',
            target: null
        };
        let leftEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'leftarrow',
            type: 'keyup',
            target: null
        };
        let upEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'uparrow',
            type: 'keyup',
            target: null
        };
        let downEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            action: 'downarrow',
            type: 'keyup',
            target: null
        };
        it('end arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(endEventArgs);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[li.length - 1] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('home arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(homeEventArgs);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('right arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(rightEventArgs);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('left arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(leftEventArgs);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[li.length - 1] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('down arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items }, '#menu');
            menu.keyBoardHandler(rightEventArgs);
            menu.keyBoardHandler(rightEventArgs);
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(downEventArgs);
            let subElem: HTMLElement = menu.getWrapper().children[1];
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
            let subElem: HTMLElement = menu.getWrapper().children[1];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>subElem.querySelectorAll('li');
            expect((li[li.length - 1] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('rtl - right arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, enableRtl: true, orientation: 'Vertical' }, '#menu');
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(rightEventArgs);
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>ul.querySelectorAll('li');
            expect((li[1] as Element).classList.contains('e-focused')).toBe(true);
        });
        it('rtl - left arrow action', () => {
            document.body.appendChild(ul);
            menu = new Menu({ items: items, enableRtl: true, orientation: 'Vertical' }, '#menu');
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(downEventArgs);
            menu.keyBoardHandler(leftEventArgs);
            let subElem: HTMLElement = menu.getWrapper().children[1];
            let li: Element[] = <Element[] & NodeListOf<HTMLLIElement>>subElem.querySelectorAll('li');
            expect((li[0] as Element).classList.contains('e-focused')).toBe(true);
        });
    });

    describe('Methods Checking', () => {
        afterEach(() => {
            menu.destroy();
        });
    });

    describe('Public events', () => {
        afterEach(() => {
            menu.destroy();
        });
    });
});