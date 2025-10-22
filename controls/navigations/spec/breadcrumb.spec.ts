/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 *  Breadcrumb spec document
 */
import { Breadcrumb, BreadcrumbBeforeItemRenderEventArgs, BreadcrumbClickEventArgs } from '../src/breadcrumb/breadcrumb';
import { closest, createElement, Browser, isNullOrUndefined, select } from '@syncfusion/ej2-base';
import { profile , inMB, getMemoryProfile } from './common.spec';
import { BreadcrumbItemModel } from '../src/breadcrumb';

describe('Breadcrumb', () => {
    beforeAll(() => {
        const isDef: any = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log('Unsupported environment, window.performance.memory is unavailable');
            pending(); // skips test (in Chai)
            return;
        }
    });

    let breadcrumb: any;
    const items: BreadcrumbItemModel[] = [
        {
            text: 'Home',
            url: './'
        },
        {
            text: 'Demos',
            url: '../'
        },
        {
            text: 'Breadcrumb',
            url: '/default'
        }
    ];
    const disabledItems: BreadcrumbItemModel[] = [
        {
            text: 'This PC',
            iconCss: 'e-bicons e-folder'
        },
        {
            text: 'Local Disk',
            iconCss: 'e-bicons e-folder'
        },
        {
            text: 'User',
            iconCss: 'e-bicons e-folder',
            disabled: true
        },
        {
            text: 'Pictures',
            iconCss: 'e-bicons e-file'
        }
    ];
    const iconItems: BreadcrumbItemModel[] = [
        {
            text: 'This PC',
            iconCss: 'e-bicons e-home',
            url: './'
        },
        {
            text: 'Local Disk',
            iconCss: 'e-bicons e-folder',
            url: './../'
        },
        {
            text: 'User',
            iconCss: 'e-bicons e-folder'
        },
        {
            text: 'Pictures',
            iconCss: 'e-bicons e-file'
        }
    ];
    let overflowItems: BreadcrumbItemModel[] = [
        {
            text: "Home",
            url: "../"
        },
        {
            text: "Getting",
            url: "./breadcrumb/getting-started"
        },
        {
            text: "Data-Binding",
            url: "./breadcrumb/data-binding"
        },
        {
            text: "Icons",
            url: "./breadcrumb/icons"
        },
        {
            text: "Navigation",
            url: "./breadcrumb/navigation",
            iconCss: 'e-bicons e-folder'
        },
        {
            text: "templates",
            url: "./breadcrumb/templates"
        },
        {
            text: "Overflow",
            url: "./breadcrumb/overflow"
        }
    ];
    const nav: HTMLElement = createElement('nav', { id: 'breadcrumb' });
    const sTag: HTMLElement = createElement('script', { id: 'menuTemplate', attrs: { type: 'text/x-template' } });
    sTag.innerHTML = '<div>${title}</div>';
    const androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';

    describe('DOM', () => {
        afterEach(() => {
            breadcrumb.destroy();
        });
        it('Architecture Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items}, '#breadcrumb');
            expect(breadcrumb.element.classList.contains('e-breadcrumb')).toEqual(true);
            breadcrumb = new Breadcrumb({}, '#breadcrumb');
        });
    });

    describe('Property', () => {
        let mouseEventArs: any = {
            preventDefault: (): void => { },
            stopImmediatePropagation: (): void => { },
            target: null,
            relatedTarget: null,
            type: null,
            shiftKey: false,
            ctrlKey: false,
            offset: Number
        };
        afterEach(() => {
            breadcrumb.destroy();
        });
        it('cssClass Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, cssClass: 'e-custom'}, '#breadcrumb');
            expect(breadcrumb.element.classList.contains('e-custom')).toEqual(true);
        });
        it('activeItem Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, activeItem: 'Demos'}, '#breadcrumb');
            expect(breadcrumb.element.firstChild.querySelectorAll('.e-breadcrumb-item').length).toEqual(3);
        });
        it('disabled Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, disabled: true}, '#breadcrumb');
            expect(breadcrumb.element.classList.contains('e-disabled')).toEqual(true);
        });
        it('enableActiveItemNavigation Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, enableActiveItemNavigation: true}, '#breadcrumb');
        });
        it('enableNavigation Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, enableNavigation: false}, '#breadcrumb');
            mouseEventArs.target = breadcrumb.element.firstChild.firstChild;
            breadcrumb.clickHandler(mouseEventArs);
        });
        it('itemTemplate Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, 
                itemTemplate: '<div id="chip-default" class="e-lib e-chip-list e-control e-chip-set" role="listbox" aria-multiselectable="false"><div class="e-chip e-primary" tabindex="0" role="option" aria-label="Apple" aria-selected="false"><span class="e-chip-text">${text}</span></div></div>'
            }, '#breadcrumb');
        });
        it('maxItems Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 2}, '#breadcrumb');
            //expect(breadcrumb.element.firstChild.querySelectorAll('.e-breadcrumb-item').length).toEqual(3);
        });
        it('overflow Collapsed mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Collapsed' }, '#breadcrumb');
            let element: HTMLElement = breadcrumb.element.querySelector('.e-breadcrumb-collapsed');
            expect(element.classList.contains('e-breadcrumb-collapsed')).toEqual(true);
        });
        it('overflow Menu mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Menu' }, '#breadcrumb');
            let element: HTMLElement = breadcrumb.element.querySelector('.e-breadcrumb-menu');
            expect(element.classList.contains('e-breadcrumb-menu')).toEqual(true);
        });
        it('overflow Wrap mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Wrap' }, '#breadcrumb');
            expect(breadcrumb.element.classList.contains('e-breadcrumb-wrap-mode')).toEqual(true);
        });
        it('overflow Scroll mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Scroll' }, '#breadcrumb');
            expect(breadcrumb.element.classList.contains('e-breadcrumb-scroll-mode')).toEqual(true);
        });
        it('overflow Hidden mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Hidden' }, '#breadcrumb');
            let element: any = breadcrumb.element.querySelectorAll('.e-breadcrumb-item.e-navigable');
            expect(element.length).toEqual(1);
        });
        it('separatorTemplate Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, separatorTemplate: '<span class="e-icons e-bullet-arrow"></span>' }, '#breadcrumb');
            // let element: any = breadcrumb.element.querySelectorAll('.e-bullet-arrow')
            // expect(element.length).toEqual(6);
        });
        it('url Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({ url: "https://ej2.syncfusion.com/demos/breadcrumb/bind-to-location" }, '#breadcrumb');
            // let element: any = breadcrumb.element.querySelectorAll('.e-breadcrumb-item.e-navigable');
            // expect(element.length).toEqual(4);
        });
    });

    describe('Public Methods Checking', () => {
        afterEach(() => {
            breadcrumb.destroy();
        });

        it('refresh', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: iconItems}, '#breadcrumb');
            breadcrumb.refresh();
        });
    });

    describe('Events', () => {
        afterEach(() => {
            Browser.userAgent = '';
            breadcrumb.destroy();
        });
        it('created', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: iconItems,
                created: () => {
                    expect(breadcrumb.element.classList.contains('e-breadcrumb')).toEqual(true);
                }
            }, '#breadcrumb');
        });
        it('beforeItemRender', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: iconItems, maxItems: 3, overflowMode: 'Collapsed', activeItem: 'Pictures',
                beforeItemRender: (args: BreadcrumbBeforeItemRenderEventArgs) => {
                    if (args.item.text === 'Local Disk' || ((args.item as any).nextItem && (args.item as any).nextItem.text === 'Local Disk')) {
                        args.element.classList.add('e-icon-right');
                    } else if (args.item.text === 'User' || ((args.item as any).nextItem && (args.item as any).nextItem.text === 'User')) {
                        args.element.classList.add('e-disabled');
                        args.item.disabled = true;
                    } else if (args.item.text === 'Pictures' || ((args.item as any).nextItem && (args.item as any).nextItem.text === 'Pictures')) {
                        args.item.iconCss = '';
                        args.item.url = '/pic';
                        args.item.text = 'pic';
                    }
                }
            }, '#breadcrumb');
        });
        it('itemClick', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: iconItems,
                itemClick: (args: BreadcrumbClickEventArgs) => {
                    expect(breadcrumb.element.classList.contains('e-breadcrumb')).toEqual(true);
                }
            }, '#breadcrumb');
            breadcrumb.element.firstChild.firstChild.click();
        });
    });

    describe('notify property changes of', () => {
        afterEach(() => {
            breadcrumb.destroy();
        });

        it('cssClass', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, cssClass: 'e-custom'}, '#breadcrumb');
            expect(breadcrumb.element.classList.contains('e-custom')).toEqual(true);
            breadcrumb.cssClass = 'e-custom1';
            breadcrumb.dataBind();
            expect(breadcrumb.element.classList.contains('e-custom1')).toEqual(true);
        });
        it('activeItem Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, activeItem: 'Demos'}, '#breadcrumb');
            expect(breadcrumb.element.firstChild.querySelectorAll('.e-breadcrumb-item').length).toEqual(3);
            breadcrumb.activeItem = 'Breadcrumb';
            breadcrumb.dataBind();
            //expect(breadcrumb.element.firstChild.querySelectorAll('.e-breadcrumb-item').length).toEqual(5);
        });
        it('disabled Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, disabled: true}, '#breadcrumb');
            expect(breadcrumb.element.classList.contains('e-disabled')).toEqual(true);
            breadcrumb.disabled = false;
            breadcrumb.dataBind();
            expect(breadcrumb.element.classList.contains('e-disabled')).toEqual(false);
        });
        it('enableActiveItemNavigation & enableNavigation Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, enableActiveItemNavigation: true, enableNavigation: false}, '#breadcrumb');
            breadcrumb.enableActiveItemNavigation = false;
            breadcrumb.enableNavigation = false;
            breadcrumb.dataBind();
        });
        it('maxItems Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 2}, '#breadcrumb');
            //expect(breadcrumb.element.firstChild.querySelectorAll('.e-breadcrumb-item').length).toEqual(3);
            breadcrumb.maxItems = 4;
            breadcrumb.dataBind();
            //expect(breadcrumb.element.firstChild.querySelectorAll('.e-breadcrumb-item').length).toEqual(7);
        });
        it('url Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({ url: "https://ej2.syncfusion.com/demos/breadcrumb/bind-to-location" }, '#breadcrumb');
            //let element: any = breadcrumb.element.querySelectorAll('.e-breadcrumb-item.e-navigable');
            //expect(element.length).toEqual(4);
            breadcrumb.url = 'https://ej2.syncfusion.com/documentation/breadcrumb';
            breadcrumb.dataBind();
            //element = breadcrumb.element.querySelectorAll('.e-breadcrumb-item.e-navigable');
            //expect(element.length).toEqual(3);
        });
        it('overflow Collapsed mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Collapsed' }, '#breadcrumb');
            let element: HTMLElement = breadcrumb.element.querySelector('.e-breadcrumb-collapsed');
            expect(element.classList.contains('e-breadcrumb-collapsed')).toEqual(true);
            breadcrumb.overflow = 'Menu';
            breadcrumb.dataBind();
            //expect(element.classList.contains('e-breadcrumb-collapsed')).toEqual(false);
        });
        it('overflow Menu mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Menu' }, '#breadcrumb');
            let element: HTMLElement = breadcrumb.element.querySelector('.e-breadcrumb-menu');
            expect(element.classList.contains('e-breadcrumb-menu')).toEqual(true);
            breadcrumb.overflow = 'Wrap';
            breadcrumb.dataBind();
            //expect(element.classList.contains('e-breadcrumb-menu')).toEqual(false);
        });
        it('overflow Wrap mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Wrap' }, '#breadcrumb');
            //let element: HTMLElement = breadcrumb.element.querySelector('.e-breadcrumb-wrap-mode');
            //expect(element.classList.contains('e-breadcrumb-wrap-mode')).toEqual(true);
            breadcrumb.overflow = 'Scroll';
            breadcrumb.dataBind();
            //expect(element.classList.contains('e-breadcrumb-wrap-mode')).toEqual(false);
        });
        it('overflow Scroll mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Scroll' }, '#breadcrumb');
            //let element: HTMLElement = breadcrumb.element.querySelector('.e-breadcrumb-scroll-mode');
            //expect(element.classList.contains('e-breadcrumb-scroll-mode')).toEqual(true);
            breadcrumb.overflow = 'Hidden';
            breadcrumb.dataBind();
            //expect(element.classList.contains('e-breadcrumb-scroll-mode')).toEqual(false);
        });
        it('overflow Hidden mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Hidden' }, '#breadcrumb');
            breadcrumb.overflow = 'Menu';
            breadcrumb.dataBind();
        });
        it('enableRtle mode Checking', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems }, '#breadcrumb');
            breadcrumb.enableRtl = true;
            breadcrumb.dataBind();
            expect(breadcrumb.element.classList.contains('e-rtl')).toEqual(true);
            breadcrumb.enableRtl = false;
            breadcrumb.dataBind();
            expect(breadcrumb.element.classList.contains('e-rtl')).toEqual(false);
        });
    });

    describe('Keyboard actions', () => {
        afterEach(() => {
            breadcrumb.destroy();
        });
        const enterEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            key: 'Enter',
            type: 'keyup',
            target: null
        };
        const escapeEventArgs: any = {
            preventDefault: (): void => { /** NO Code */ },
            key: 'Escape',
            type: 'keyup',
            target: null
        };
        it('enter action', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items}, '#breadcrumb');
            breadcrumb.element.firstChild.firstChild.focus();
            enterEventArgs.target = document.activeElement;
            breadcrumb.keyDownHandler(enterEventArgs);
        });
        it('resize action', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items}, '#breadcrumb');
            breadcrumb.resize();
            breadcrumb.enablePersistence = true;
            breadcrumb.getPersistData();
        });
        it('expandHandler action', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items}, '#breadcrumb');
            enterEventArgs.target = breadcrumb.element;
            breadcrumb.expandHandler(enterEventArgs);
        });
        it('popupKeyDownHandler action', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items}, '#breadcrumb');
            escapeEventArgs.target = breadcrumb.element;
            breadcrumb.popupKeyDownHandler(escapeEventArgs);
        });
    });

    describe('Click actions', () => {
        let mouseEventArs: any = {
            preventDefault: (): void => { },
            stopImmediatePropagation: (): void => { },
            target: null,
            relatedTarget: null,
            type: null,
            shiftKey: false,
            ctrlKey: false,
            offset: Number
        };
        afterEach(() => {
            breadcrumb.destroy();
        });
        it('Collapsed item click action', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Collapsed', activeItem: 'Overflow',
                beforeItemRender: (args: BreadcrumbBeforeItemRenderEventArgs) => {
                    if (args.item.text === 'Getting' || ((args.item as any).nextItem && (args.item as any).nextItem.text === 'Getting')) {
                        args.item.iconCss = 'e-getting';
                    } else if (args.item.text === 'Icons' || ((args.item as any).nextItem && (args.item as any).nextItem.text === 'Icons')) {
                        args.item.text = 'Iconing';
                    } else if (args.item.text === 'Navigation' || ((args.item as any).nextItem && (args.item as any).nextItem.text === 'Navigation')) {
                        args.item.text = 'e-navigate';
                    } else if (args.item.text === 'templates' || ((args.item as any).nextItem && (args.item as any).nextItem.text === 'templates')) {
                        args.item.url = '/pic';
                    }
                }
            }, '#breadcrumb');
            mouseEventArs.target = document.querySelector('.e-breadcrumb-collapsed');
            breadcrumb.clickHandler(mouseEventArs);
            mouseEventArs.target = document.querySelector('.e-breadcrumb-text');
            breadcrumb.clickHandler(mouseEventArs);
        });
        it('Menu item click action', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'None', activeItem: 'Overflow'}, '#breadcrumb');
            breadcrumb.overflowMode = 'Menu';
            mouseEventArs.target = document.querySelector('.e-breadcrumb-text');
            breadcrumb.clickHandler(mouseEventArs);
        });
        it('Wrap item click action', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Wrap', activeItem: 'Overflow'}, '#breadcrumb');
            mouseEventArs.target = document.querySelector('.e-breadcrumb-text');
            breadcrumb.clickHandler(mouseEventArs);
        });
        it('Hidden item click action', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Hidden', activeItem: 'Overflow'}, '#breadcrumb');
            mouseEventArs.target = document.querySelector('.e-breadcrumb-text');
            breadcrumb.clickHandler(mouseEventArs);
        });
        it('document click action', () => {
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems:2, overflowMode: 'Menu'}, '#breadcrumb');
            let element: any = breadcrumb.element.querySelector('.e-breadcrumb-menu');
            element.click();
            mouseEventArs.target = breadcrumb.element.firstChild;
            breadcrumb.documentClickHandler(mouseEventArs);
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
            breadcrumb.destroy();
        });
        
        it('EJ2-916680 - Breadcrumb menu popup not destroyed after breadcrumb element destroyed', () => {
            breadcrumb.destroy();
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: overflowItems, maxItems: 3, overflowMode: 'Menu' }, '#breadcrumb');
            let element: HTMLElement = breadcrumb.element.querySelector('.e-breadcrumb-menu');
            expect(element.classList.contains('e-breadcrumb-menu')).toEqual(true);
            element.click();
            expect(document.getElementsByClassName('e-breadcrumb-popup')[2].classList.contains('e-popup-open')).toBe(true);
            breadcrumb.destroy();
            expect(document.getElementsByClassName('e-breadcrumb-popup')[2]).toBeUndefined();
        });
    });

    describe('null or undefined property testing', () => {
        afterEach(() => {
            breadcrumb.destroy();
        });

        it('cssClass', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, cssClass: null}, '#breadcrumb');
            expect(breadcrumb.cssClass).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, cssClass: undefined}, '#breadcrumb');
            expect(breadcrumb.cssClass).toEqual('');
        });

        it('activeItem', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, activeItem: null}, '#breadcrumb');
            expect(breadcrumb.activeItem).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, activeItem: undefined}, '#breadcrumb');
            expect(breadcrumb.activeItem).toEqual('');
        });

        it('disabled', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, disabled: null}, '#breadcrumb');
            expect(breadcrumb.disabled).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, disabled: undefined}, '#breadcrumb');
            expect(breadcrumb.disabled).toEqual(false);
        });

        it('enableActiveItemNavigation', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, enableActiveItemNavigation: null}, '#breadcrumb');
            expect(breadcrumb.enableActiveItemNavigation).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, enableActiveItemNavigation: undefined}, '#breadcrumb');
            expect(breadcrumb.enableActiveItemNavigation).toEqual(false);
        });

        it('enableNavigation', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, enableNavigation: null}, '#breadcrumb');
            expect(breadcrumb.enableNavigation).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, enableNavigation: undefined}, '#breadcrumb');
            expect(breadcrumb.enableNavigation).toEqual(true);
        });

        it('enablePersistence', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, enablePersistence: null}, '#breadcrumb');
            expect(breadcrumb.enablePersistence).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, enablePersistence: undefined}, '#breadcrumb');
            expect(breadcrumb.enablePersistence).toEqual(false);
        });

        it('enableRtl', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, enableRtl: null}, '#breadcrumb');
            expect(breadcrumb.enableRtl).toEqual(false);
            breadcrumb = new Breadcrumb({items: items, enableRtl: undefined}, '#breadcrumb');
            expect(breadcrumb.enableRtl).toEqual(false);
        });

        it('itemTemplate', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, itemTemplate: null}, '#breadcrumb');
            expect(breadcrumb.itemTemplate).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, itemTemplate: undefined}, '#breadcrumb');
            expect(breadcrumb.itemTemplate).toEqual(null);
        });

        it('items', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: [{text: null}, {url: null}]}, '#breadcrumb');
            expect(breadcrumb.items.text).toEqual(undefined);
            expect(breadcrumb.items.url).toEqual(undefined);
            breadcrumb = new Breadcrumb({items: [{text: undefined}, {url: undefined}]}, '#breadcrumb');
            expect(breadcrumb.items.text).toEqual(undefined);
            expect(breadcrumb.items.url).toEqual(undefined);
        });

        it('maxItems', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: [{text: null}, {url: null}], maxItems: null}, '#breadcrumb');
            expect(breadcrumb.maxItems).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, maxItems: undefined}, '#breadcrumb');
            expect(breadcrumb.maxItems).toEqual(-1);
        });

        it('overflowMode', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, overflowMode: null}, '#breadcrumb');
            expect(breadcrumb.overflowMode).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, overflowMode: undefined}, '#breadcrumb');
            expect(breadcrumb.overflowMode).toEqual('Menu');
        });

        it('separatorTemplate', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, separatorTemplate: null}, '#breadcrumb');
            expect(breadcrumb.separatorTemplate).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, separatorTemplate: undefined}, '#breadcrumb');
            expect(breadcrumb.separatorTemplate).toEqual('/');
        });

        it('url', () => {
            document.body.appendChild(nav);
            document.body.appendChild(nav);
            breadcrumb = new Breadcrumb({items: items, url: null}, '#breadcrumb');
            expect(breadcrumb.url).toEqual(null);
            breadcrumb = new Breadcrumb({items: items, url: undefined}, '#breadcrumb');
            expect(breadcrumb.url).toEqual('');
        });

    });
    describe('Breadcrumb Dynamic Item Updates',() =>{
        it('should update UI correctly when adding items dynamically with different overflow modes', () => {
            document.body.appendChild(nav);
            const overflowModes = ['Menu', 'Hidden', 'Collapsed', 'Wrap', 'Scroll', 'None'];
            for (const mode of overflowModes) {
                breadcrumb = new Breadcrumb({
                    items: items.slice(), 
                    maxItems: 3,
                    overflowMode: mode
                }, '#breadcrumb');
                const initialCount = breadcrumb.items.length;
                const initialRenderedItems = breadcrumb.element.querySelectorAll('.e-breadcrumb-item').length;
                const newItem = { text: `New ${mode} Item`, url: `./breadcrumb/${mode.toLowerCase()}` };
                breadcrumb.items = [...breadcrumb.items, newItem];
                breadcrumb.dataBind();
                expect(breadcrumb.items.length).toBe(initialCount + 1);
                if (mode === 'Menu') {
                    const menuButton = breadcrumb.element.querySelector('.e-breadcrumb-menu');
                    expect(menuButton).not.toBeNull();
                    if (menuButton) {
                        menuButton.click();
                        if (breadcrumb.popupObj) {
                            expect(document.querySelector('.e-breadcrumb-popup')).not.toBeNull();
                            breadcrumb.documentClickHandler({ target: document.body });
                        }
                    }
                } else if (mode === 'Hidden') {
                    const newRenderedItems = breadcrumb.element.querySelectorAll('.e-breadcrumb-item').length;
                    expect(newRenderedItems >= initialRenderedItems - 1).toBe(true);
                } else if (mode === 'Collapsed') {
                    const collapsedIcon = breadcrumb.element.querySelector('.e-breadcrumb-collapsed');
                    expect(collapsedIcon).not.toBeNull();
                }
                breadcrumb.destroy();
            }
        });
    });
    describe('Accessibility compliance', () => {
        afterEach(() => {
            breadcrumb.destroy();
        });
        it('should not set hardcoded aria-label on breadcrumb items', () => {
            const host = createElement('nav', { id: 'breadcrumb-aria-label', styles: 'width: 400px;' });
            document.body.appendChild(host);

            breadcrumb = new Breadcrumb({ items: items.slice(), overflowMode: 'None' });
            breadcrumb.appendTo(host);

            const itemElements: HTMLElement[] = [].slice.call(
                host.querySelectorAll('.e-breadcrumb-item:not(.e-breadcrumb-separator)')
            );

            expect(itemElements.length).toBe(items.length);
            expect(host.querySelector('[aria-label="home"]')).toBeNull();

            breadcrumb.destroy();
            host.remove();
        });

        it('should set aria-current="page" only on the active breadcrumb item', () => {
            const host = createElement('nav', { id: 'breadcrumb-aria-label', styles: 'width: 400px;' });
            document.body.appendChild(host);

            breadcrumb = new Breadcrumb({ items: items.slice(), activeItem: 'Breadcrumb', overflowMode: 'None'});
            breadcrumb.appendTo(host);

            const itemElements: HTMLElement[] = [].slice.call(host.querySelectorAll('.e-breadcrumb-item:not(.e-breadcrumb-separator)'));
            expect(itemElements.length).toBe(items.length);
            const activeItem = host.querySelector('.e-breadcrumb-item[data-active-item]') as HTMLElement;
            expect(activeItem).not.toBeNull();
            expect(activeItem.getAttribute('aria-current')).toBe('page');

            itemElements.filter((li: HTMLElement) => li !== activeItem).forEach((li: HTMLElement) => {expect(li.hasAttribute('aria-current')).toBe(false);});
            
            breadcrumb.destroy();
            host.remove();
        });
    });
});
