/**
 * tab spec document
 */
import { Browser, createElement, closest, DomElements, L10n, isVisible, isNullOrUndefined as isNOU, detach } from '@syncfusion/ej2-base';
import { Tab, SelectingEventArgs, RemoveEventArgs, AddEventArgs, SelectEventArgs, DragEventArgs } from '../src/tab/tab';
import { TabActionSettingsModel, TabAnimationSettingsModel, TabItemModel } from '../src/tab/tab-model';
import { Toolbar } from '../src/toolbar/toolbar';
import { profile, inMB, getMemoryProfile } from './common.spec';
import '../node_modules/es6-promise/dist/es6-promise';

/**
 * Method to trigger mouse event
 *
 * @param {HTMLElement} node Accepts the DOM element
 * @param {string} eventType Accepts the event type
 * @param {number} x Accepts the X value
 * @param {number} y Accepts the Y value
 * @param {boolean} isShiftKey Accepts the shift key allowed or not
 * @param {boolean} isCtrlKey Accepts the ctrl key allowed or not
 * @returns {void}
 * @private
 */
// eslint-disable-next-line max-len
export function triggerMouseEvent(node: HTMLElement, eventType: string, x: number = 0, y: number = 0, isShiftKey?: boolean, isCtrlKey?: boolean): void {
    const mouseEve: MouseEvent = new MouseEvent(eventType);
    mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, isCtrlKey, false, isShiftKey, false, 0, null);
    node.dispatchEvent(mouseEve);
}

describe('Tab Control', () => {
    beforeAll(() => {
        const isDef = (o: any) => o !== undefined && o !== null;
        if (!isDef(window.performance)) {
            console.log("Unsupported environment, window.performance.memory is unavailable");
            this.skip(); //Skips test (in Chai)
            return;
        }
    });

    let commonCss: string = ".e-toolbar { display: block; white-space: nowrap; position: relative; } .e-separator { border-right:1px solid; height: 15px; margin: 7.5px 3px} .e-hor-nav { height: 30px; } .e-toolbar .e-toolbar-items .e-toolbar-item.e-separator + .e-separator { display:none } .e-toolbar-items { display: inline-block; } .e-toolbar-items.e-hscroll { width:inherit; }  .e-toolbar .e-fix-width {width : 0px !important; } .e-toolbar .e-tbarpop  { position: fixed; } .e-toolbar-items .e-toolbar-item, .e-toolbar-left, .e-toolbar-center, .e-toolbar-right { display: inline-block; } .e-toolbar .e-hor-nav { float:right; width:30px; }  .e-toolbar .e-toolbar-pop { position: fixed;} .e-popup-open { display:block } .e-popup-close { display: none } button {font-family:Arial; font-size: 14px; padding: 1px 6px}";
    let commonCss2: string = ".e-vertical.e-toolbar { display: block; } .e-vscroll { height: inherit; } .e-vscroll > * { height: inherit; } .e-toolbar-items { display: block; } .e-vertical .e-toolbar-item { display: block !important; } .e-vertical .e-scroll-nav { height: 0px }";

    describe('Root of tab element', () => {
        let tab: any;
        let ele: HTMLElement
        beforeEach((): void => {
            tab = undefined;
            ele = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Control class testing', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-tab')).toEqual(true);
            expect(element.classList.contains('e-control')).toEqual(true);
        });
        it('Template - Control and template class testing', () => {
            ele.innerHTML = '<div class="e-tab-header"> </div> <div class="e-content"></div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-tab')).toEqual(true);
            expect(element.classList.contains('e-template')).toEqual(true);
            expect(element.classList.contains('e-control')).toEqual(true);
        });
        it('Items - Toolbar child element testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolbar')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(1);
        });
        it('Items [Orientation left] - Toolbar child element testing', () => {
            tab = new Tab({
                headerPlacement: 'Left',
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolbar')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-vertical')).toEqual(true);
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.querySelector('.e-tab-header').classList.contains('e-vertical-left')).toEqual(true);
        });
        it('Items [Orientation right] - Toolbar child element testing', () => {
            tab = new Tab({
                headerPlacement: 'Right',
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolbar')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-vertical')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-vertical-right')).toEqual(true);
        });
        it('Items - Without content data to item render testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" } }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolbar')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(1);
        });
        it('Items - Without header data to single item render testing', () => {
            tab = new Tab({
                items: [
                    { content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolbar')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(0);
        });
        it('Items - Without header data to multiple collection item render testing', () => {
            tab = new Tab({
                items: [
                    { content: "Content0" },
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolbar')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(1);
        });
        it('Template - Toolbar child element testing', () => {
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> </div> <div class="e-content"> <div> Content1 </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolbar')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(1);
        });
        it('Template [Orientation left] - Toolbar child element testing', () => {
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> </div> <div class="e-content"> <div> Content1 </div> </div>';
            tab = new Tab({ headerPlacement: 'Left' });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolbar')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-vertical')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-vertical-left')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(1);
        });
        it('Template [Orientation right] - Toolbar child element testing', () => {
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> </div> <div class="e-content"> <div> Content1 </div> </div>';
            tab = new Tab({ headerPlacement: 'Right' });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolbar')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-vertical')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-vertical-right')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(1);
        });
        it('Template - Without content element', () => {
            ele.innerHTML = '<div class="e-tab-header"> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-tab-header').classList.contains('e-control')).toEqual(false);
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolbar')).toEqual(false);
        });
        it('Template - Without header element', () => {
            ele.innerHTML = '<div class="e-content"> <div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-content div').classList.contains('e-item')).toEqual(false);
        });
    });
    describe('Tab default model value testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Main public property - Default model value testing', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.height).toEqual('auto');
            expect(tab.width).toEqual('100%');
            expect(tab.cssClass).toEqual('');
            expect(tab.selectedItem).toEqual(0);
            expect(tab.showCloseButton).toEqual(false);
            expect(tab.heightAdjustMode).toEqual('Content');
            expect(tab.enableRtl).toEqual(false);
            expect(tab.items.length).toEqual(0);
            expect(tab.headerPlacement).toEqual('Top');
            expect(tab.enablePersistence).toEqual(false);
            expect(tab.overflowMode).toEqual('Scrollable');
        });
        it('Tab items collection - default model value testing', () => {
            tab = new Tab({
                items: [{ header: { 'text': 'sample' } }]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items[0].header instanceof Object).toEqual(true);
            expect(tab.items[0].content).toEqual('');
            expect(tab.items[0].cssClass).toEqual('');
            expect(tab.items[0].disabled).toEqual(false);
            expect(tab.items[0].visible).toEqual(true);
        });
        it('TabItemHeader object - default model value testing', () => {
            tab = new Tab({
                items: [{ header: { 'iconCss': 'sampleIcon' } }]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items[0].header.text).toEqual('');
            expect(tab.items[0].header.iconCss).toEqual('sampleIcon');
            expect(tab.items[0].header.iconPosition).toEqual('left');
        });
        it('TabItemHeader object - default model value testing', () => {
            tab = new Tab({
                items: [{ header: { text: 'sample' } }]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items[0].header.text).toEqual('sample');
            expect(tab.items[0].header.iconCss).toEqual('');
        });
    });
    describe('Dynamic model value testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            let styleTag: any = document.createElement('style');
            let styles: string = '.e-toolbar-items { height: 100%; } .e-toolbar-item { display: inline-flex; width: auto; }';
            styleTag.innerHTML = styles;
            document.body.appendChild(styleTag);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Model value testing', () => {
            tab = new Tab({
                width: '300px',
                height: '250px',
                selectedItem: 2,
                cssClass: 'e-test e-test2',
                heightAdjustMode: 'Auto',
                enableRtl: true,
                showCloseButton: true,
                enablePersistence: false,
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.width).toEqual('300px');
            expect(tab.height).toEqual('250px');
            expect(tab.selectedItem).toEqual(2);
            expect(tab.cssClass).toEqual('e-test e-test2');
            expect(tab.heightAdjustMode).toEqual('Auto');
            expect(tab.cssClass).toContain('e-test2');
            expect(tab.cssClass).toContain('e-test');
            expect(tab.showCloseButton).toEqual(true);
            expect(tab.enableRtl).toEqual(true);
            expect(tab.enablePersistence).toEqual(false);
            expect(tab.overflowMode).toEqual('Popup');
        });
        it('Base property animation with models', () => {
            let prevSetting: TabActionSettingsModel = {
                effect: 'FadeIn',
                duration: 500,
                easing: 'ease'
            }
            let nextSetting: TabActionSettingsModel = {
                effect: 'FadeOut',
                duration: 500,
                easing: 'ease'
            }
            let anima: TabAnimationSettingsModel = {
                previous: prevSetting,
                next: nextSetting
            }
            tab = new Tab({
                width: '300px',
                height: '250px',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ],
                animation: anima
            }, '#ej2Tab');
            expect(tab.width).toEqual('300px');
            expect(tab.animation.previous.effect).toEqual('FadeIn');
            expect(tab.animation.next.effect).toEqual('FadeOut');
        });
        it('Animation default value assign testing', () => {
            tab = new Tab({
                width: '300px',
                height: '250px',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ],
                animation: {
                    previous: { effect: 'SlideLeftIn', duration: 400, easing: 'ease' },
                    next: { effect: 'SlideRightIn', duration: 400, easing: 'ease' }
                }
            }, '#ej2Tab');
            expect(tab.width).toEqual('300px');
            expect(tab.animation.previous.effect).toEqual('SlideLeftIn');
            expect(tab.animation.next.effect).toEqual('SlideRightIn');
        });
        it('Animation model value testing', () => {
            tab = new Tab({
                width: '300px',
                height: '250px',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ],
                animation: {
                    previous: { effect: 'None', duration: 400, easing: 'ease' },
                    next: { effect: 'FadeOut', duration: 400, easing: 'ease' }
                }
            }, '#ej2Tab');
            expect(tab.width).toEqual('300px');
            expect(tab.animation.previous.effect).toEqual('None');
            expect(tab.animation.next.effect).toEqual('FadeOut');
        });
        it('Tab items collection - New model value testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content1", cssClass: "tabCssClass" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items[0].content).toEqual('Content1');
            expect(tab.items[0].cssClass).toEqual('tabCssClass');
            expect(tab.items[0].header instanceof Object).toEqual(true);
            expect(tab.items[0].header.text).toEqual('item1');
            expect(tab.items[0].header.iconCss).toEqual('e-icon');
            expect(tab.items[0].header.iconPosition).toEqual('right');
        });
    });

    describe('Disable Animation testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('None animation', () => {
            tab = new Tab({
                width: '300px',
                height: '250px',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ],
                animation: {
                    previous: { effect: 'None', duration: 400, easing: 'ease' },
                    next: { effect: 'None', duration: 400, easing: 'ease' }
                }
            }, '#ej2Tab');
            let element1: HTMLElement = document.getElementById('e-item-ej2Tab_0');
            tab.select(element1);
            let element2: HTMLElement = document.getElementById('e-item-ej2Tab_1');
            tab.select(element2);
            let element3: HTMLElement = document.getElementById('e-item-ej2Tab_2');
            tab.select(element3);
            expect(tab.animation.previous.effect).toEqual('None');
            expect(tab.animation.next.effect).toEqual('None');
            let content: HTMLElement[] = [].slice.call(document.querySelectorAll('.e-content .e-active'));
            expect(content[0].innerText).toEqual('Content3');
            expect(content.length).toEqual(1);
        });
        it('Handling null case in animation', () => {
            tab = new Tab({
                width: '300px',
                height: '250px',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ],
                animation: {
                    previous: { effect: null, duration: 400, easing: 'ease' },
                    next: { effect: null, duration: 400, easing: 'ease' }
                }
            }, '#ej2Tab');
            let element1: HTMLElement = document.getElementById('e-item-ej2Tab_0');
            tab.select(element1);
            let element2: HTMLElement = document.getElementById('e-item-ej2Tab_1');
            tab.select(element2);
            let element3: HTMLElement = document.getElementById('e-item-ej2Tab_2');
            tab.select(element3);
            expect(tab.animation.previous.effect).toEqual(null);
            expect(tab.animation.next.effect).toEqual(null);
            let content: HTMLElement[] = [].slice.call(document.querySelectorAll('.e-content .e-active'));
            expect(content[0].innerText).toEqual('Content3');
            expect(content.length).toEqual(1);
        });
    });

    describe('Width property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Width value as number', () => {
            tab = new Tab({
                width: 500
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).toEqual('500px');
        });
        it('Width value as string', () => {
            tab = new Tab({
                width: '500px'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).toEqual('500px');
        });
        it('Width value with %', () => {
            tab = new Tab({
                width: '40%'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).toEqual('40%');
        });
        it('Width value as auto', () => {
            tab = new Tab({
                width: 'auto'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).toEqual('auto');
        });
        it('Width value as negative 0', () => {
            tab = new Tab({
                width: -0
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).not.toEqual("-300px");
            expect(element.style.width).toEqual("0px");
        });
        it('Width value as negative number', () => {
            tab = new Tab({
                width: -300
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).not.toEqual("-300px");
            expect(element.style.width).not.toEqual("300px");
        });
        it('Width value as negative string', () => {
            tab = new Tab({
                width: '-300px'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).not.toEqual("-300px");
            expect(element.style.width).not.toEqual("300px");
        });
        it('Width value as negative percentage', () => {
            tab = new Tab({
                width: '-20%'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).not.toEqual("-20%");
        });
        it('onPropertyChange - Width value as number', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.width = 500;
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).toEqual('500px');
        });
        it('onPropertyChange - Width value as string', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.width = '500px';
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).toEqual('500px');
        });
        it('onPropertyChange - Width value as %', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.width = '40%';
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).toEqual('40%');
        });
        it('onPropertyChange - Width value as auto', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.width = 'auto';
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).toEqual('auto');
        });
        it('onPropertyChange - Width value as negative number', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.width = -300;
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).not.toEqual("-300px");
            expect(element.style.width).not.toEqual("300px");
        });
        it('onPropertyChange - Width value as negative 0', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.width = -0;
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).not.toEqual("-300px");
            expect(element.style.width).toEqual("0px");
        });
        it('onPropertyChange - Width value as negative number', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.width = '-300px';
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).not.toEqual("-300px");
            expect(element.style.width).not.toEqual("300px");
        });
        it('onPropertyChange - Width value as negative percentage', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.width = '-20%';
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.width).not.toEqual("-20%");
        });
        it('onPropertyChange - checking data-id attributes', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let newItems: object[] = [
                { header: { "text": "item1" }, content: "Content1" },
                { header: { "text": "item2" }, content: "Content2" }
            ];
            tab.items = newItems;
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item')[0].getAttribute('data-id')).not.toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-item')[0].getAttribute('data-id')).toEqual('tabitem_0');
            expect(element.querySelectorAll('.e-toolbar-item')[1].getAttribute('data-id')).toEqual('tabitem_1');
        });
    });
    describe('Height property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Height value as number', () => {
            tab = new Tab({
                height: 300
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).toEqual('300px');
        });
        it('Height value as string', () => {
            tab = new Tab({
                height: '300px'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).toEqual('300px');
        });
        it('Height value as %', () => {
            tab = new Tab({
                height: '20%'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).toEqual('20%');
        });
        it('Height value as auto', () => {
            tab = new Tab({
                height: 'auto'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).toEqual('auto');
        });
        it('Height value as negative number', () => {
            tab = new Tab({
                height: -300
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).not.toEqual("-300px");
            expect(element.style.height).not.toEqual("300px");
        });
        it('Height value as negative 0', () => {
            tab = new Tab({
                height: -0
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).not.toEqual("-300px");
            expect(element.style.height).toEqual("0px");
        });
        it('Height value as negative pixel', () => {
            tab = new Tab({
                height: '-300px'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).not.toEqual("-300px");
            expect(element.style.height).not.toEqual("300px");
        });
        it('Height value as negative percentage', () => {
            tab = new Tab({
                height: '-20%'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).not.toEqual("-20%");
        });
        it('onPropertyChanged - Height value as number', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.height = 300;
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).toEqual('300px');
        });
        it('onPropertyChanged - Height value as string', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.height = '300px';
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).toEqual('300px');
        });
        it('onPropertyChanged - Height value as %', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.height = '20%';
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).toEqual('20%');
        });
        it('onPropertyChanged - Height value as auto', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.height = 'auto';
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).toEqual('auto');
        });
        it('onPropertyChanged - Height value as negative number', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.height = -300;
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).not.toEqual("-300px");
            expect(element.style.height).not.toEqual("300px");
        });
        it('onPropertyChanged - Height value as negative number', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.height = -0;
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).not.toEqual("-300px");
            expect(element.style.height).toEqual("0px");
        });
        it('onPropertyChanged - Height value as negative pixel', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.height = '-300px';
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).not.toEqual("-300px");
            expect(element.style.height).not.toEqual("300px");
        });
        it('onPropertyChanged - Height value as negative percentage', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.height = '-20%';
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.style.height).not.toEqual("-20%");
        });
    });
    describe('Items property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Tab items count testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Items - Tab items with iconCSS testing', () => {
            tab = new Tab({
                items: [
                    { header: { "iconCss": "e-bold" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Items - tab items onPropertyChanged with count testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            let newItems: object[] = [
                { header: { "text": "item1" }, content: "Content1" },
                { header: { "text": "item2" }, content: "Content" }
            ];
            tab.items = newItems;
            tab.dataBind();
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
    });
    describe('Disabled toolbar item property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Disabled class availability testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2", disabled: true }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(true);
        });
    });
    describe('Testing visible property for item', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - hidden class availability testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2", visible: false }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
        });
    });
    describe('overflowMode property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            let styleTag: any = document.createElement('style');
            let styles: string = '.e-toolbar-items { height: 100%; } .e-toolbar-item { display: inline-flex; width: auto; }';
            styleTag.innerHTML = styles;
            document.body.appendChild(styleTag);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Default mode value testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.overflowMode).toEqual('Scrollable');
        });
        it('Popup mode - Model value testing', () => {
            tab = new Tab({
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.overflowMode).toEqual('Popup');
        });
        it('Scrollable mode - Model value testing', () => {
            tab = new Tab({
                overflowMode: 'Scrollable',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.overflowMode).toEqual('Scrollable');
        });
        it('onPropertyChanged to overflowMode model value testing for popup', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.overflowMode).toEqual('Scrollable');
            tab.overflowMode = 'Popup';
            tab.dataBind();
            expect(tab.overflowMode).toEqual('Popup');
        });
        it('onPropertyChanged to overflowMode model value testing for scrollable', () => {
            tab = new Tab({
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.overflowMode).toEqual('Popup');
            tab.overflowMode = 'Scrollable';
            tab.dataBind();
            expect(tab.overflowMode).toEqual('Scrollable');
        });
    });
    describe('heightAdjustMode Property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            let div: HTMLElement = createElement('div', { id: 'test' })
            document.body.appendChild(ele);
            document.body.appendChild(div);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Initial rendering value set as Auto', () => {
            tab = new Tab({
                heightAdjustMode: 'Auto',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.heightAdjustMode).toEqual('Auto');
        });
        it('Items - Initial rendering value set as Content', () => {
            tab = new Tab({
                heightAdjustMode: 'Content',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.heightAdjustMode).toEqual('Content');
        });
        it('Items - Initial rendering value set as Fill', () => {
            tab = new Tab({
                heightAdjustMode: 'Fill',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.heightAdjustMode).toEqual('Fill');
        });
        it('Items - Initial rendering value set as None', () => {
            tab = new Tab({
                heightAdjustMode: 'None',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.heightAdjustMode).toEqual('None');
        });
        it('Items - Initial rendering value set as None with height value', () => {
            tab = new Tab({
                heightAdjustMode: 'None',
                height: 200,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.heightAdjustMode).toEqual('None');
            expect(tab.height).toEqual(200);
            expect(ele.querySelector('.e-content').scrollHeight).toBeLessThan(ele.offsetHeight);
        });
        it('Items - HTMLElement passing as content', () => {
            let test: HTMLElement = <HTMLElement>document.querySelector('#test');
            tab = new Tab({
                heightAdjustMode: 'Auto',
                items: [
                    { header: { "text": "item1" }, content: test },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.heightAdjustMode).toEqual('Auto');
        });
        it('Items - Template engine to content passing', () => {
            tab = new Tab({
                heightAdjustMode: 'Auto',
                items: [
                    { header: { "text": "item1" }, content: "#test" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.heightAdjustMode).toEqual('Auto');
        });
        it('Items - onPropertyChanged value set as Auto', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            tab.heightAdjustMode = 'Auto';
            tab.dataBind();
            expect(tab.heightAdjustMode).toEqual('Auto');
        });
        it('Items - onPropertyChanged value set as Content', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            tab.heightAdjustMode = 'Content';
            tab.dataBind();
            expect(tab.heightAdjustMode).toEqual('Content');
        });
        it('Items - onPropertyChanged value set as Fill', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            tab.heightAdjustMode = 'Fill';
            tab.dataBind();
            expect(tab.heightAdjustMode).toEqual('Fill');
        });
        it('Items - onPropertyChanged value set as None', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            tab.heightAdjustMode = 'None';
            tab.dataBind();
            expect(tab.heightAdjustMode).toEqual('None');
        });
        it('Items - onPropertyChanged value set as None with height value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            tab.heightAdjustMode = 'None';
            tab.height = 200;
            tab.dataBind();
            expect(tab.heightAdjustMode).toEqual('None');
            expect(tab.height).toEqual(200);
            expect(ele.querySelector('.e-content').scrollHeight).toBeLessThan(ele.offsetHeight);
        });
        it('Template - Initial rendering value set as Auto', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                heightAdjustMode: 'Auto'
            });
            tab.appendTo('#ej2Tab');
            expect(tab.heightAdjustMode).toEqual('Auto');
        });
        it('Template - Initial rendering value set as Content', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                heightAdjustMode: 'Content'
            });
            tab.appendTo('#ej2Tab');
            expect(tab.heightAdjustMode).toEqual('Content');
        });
        it('Template - Initial rendering value set as Fill', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                heightAdjustMode: 'Fill'
            });
            tab.appendTo('#ej2Tab');
            expect(tab.heightAdjustMode).toEqual('Fill');
        });
        it('Template - Initial rendering value set as None', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                heightAdjustMode: 'None'
            });
            tab.appendTo('#ej2Tab');
            expect(tab.heightAdjustMode).toEqual('None');
        });
        it('Template - Initial rendering value set as None with height value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                heightAdjustMode: 'None',
                height: 200
            });
            tab.appendTo('#ej2Tab');
            expect(tab.heightAdjustMode).toEqual('None');
            expect(tab.height).toEqual(200);
            expect(ele.querySelector('.e-content').scrollHeight).toBeLessThan(ele.offsetHeight);
        });
        it('Template - onPropertyChanged value set as Auto', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.heightAdjustMode = 'Auto';
            tab.dataBind();
            expect(tab.heightAdjustMode).toEqual('Auto');
        });
        it('Template - onPropertyChanged value set as Content', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.heightAdjustMode = 'Content';
            tab.dataBind();
            expect(tab.heightAdjustMode).toEqual('Content');
        });
        it('Template - onPropertyChanged value set as Fill', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.heightAdjustMode = 'Fill';
            tab.dataBind();
            expect(tab.heightAdjustMode).toEqual('Fill');
        });
        it('Template - onPropertyChanged value set as None', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.heightAdjustMode = 'None';
            tab.dataBind();
            expect(tab.heightAdjustMode).toEqual('None');
        });
        it('Template - Initial rendering value set as None with height value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.heightAdjustMode = 'None';
            tab.height = 200;
            tab.dataBind();
            expect(tab.heightAdjustMode).toEqual('None');
            expect(tab.height).toEqual(200);
            expect(ele.querySelector('.e-content').scrollHeight).toBeLessThan(ele.offsetHeight);
        });
    });
    describe('Header item and content count testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Equal header and content', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(3);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(1);
        });
        it('Items - Three header and two content', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" } }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(3);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(1);
        });
        it('Items - Three header and no content', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" } },
                    { header: { "text": "item2" } },
                    { header: { "text": "item3" } }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(3);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(1);
        });
        it('Items - Two header and three content', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(1);
        });
        it('Items - No header and three content', () => {
            tab = new Tab({
                items: [
                    { content: "Content1" },
                    { content: "Content2" },
                    { content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(0);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(0);
        });
        it('Items - Empty objects', () => {
            tab = new Tab({
                items: [{}, {}, {}]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(0);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(0);
        });
        it('Items - Empty array', () => {
            tab = new Tab({
                items: []
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(0);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(0);
        });
        it('Items - Text With HTMLElement', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let txtEle: HTMLElement = createElement('div', { id: 'testEle' });
            tab = new Tab({
                items: [
                    { header: { "text": txtEle }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(element.querySelector('.e-tab-header .e-toolbar-item.e-active .e-tab-text > div').id).toEqual('testEle');
        });
        it('Template - Equal header and content', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> <div> item3 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div> <h1>Content3</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(3);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(3);
        });
        it('Template - Three header and two content', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> <div> item3 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(3);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(2);
        });
        it('Template - Three header and no content', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> <div> item3 </div> </div>'
                + '<div class="e-content"> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(3);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(0);
        });
        it('Template - Two header and three content', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div> <h1>Content3</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(2);
        });
        it('Template - No header and three content', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div> <h1>Content3</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(0);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(0);
        });
        it('Template - Empty value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div>  </div> <div>  </div> <div>  </div> </div>'
                + '<div class="e-content"> <div></div> <div> </div> <div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(3);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(3);
        });
        it('Template - Empty child', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header">  </div>'
                + '<div class="e-content"> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-toolbar-item').length).toEqual(0);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(0);
        });
    });
    describe('Main property - cssClass property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('cssClass property with single class', () => {
            tab = new Tab({
                cssClass: 'tab1'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('tab1')).toEqual(true);
        });
        it('cssClass property with multiple class', () => {
            tab = new Tab({
                cssClass: 'tab1 root'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('tab1')).toEqual(true);
            expect(element.classList.contains('root')).toEqual(true);
        });
        it('onPropertyChange with single class passing in cssClass property', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.cssClass = "tab1";
            tab.dataBind();
            expect(tab.cssClass).toEqual('tab1');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('tab1')).toEqual(true);
        });
        it('onPropertyChange with multiple class passing in cssClass property', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            tab.cssClass = "tab1 root";
            tab.dataBind();
            expect(tab.cssClass).toEqual('tab1 root');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('tab1')).toEqual(true);
            expect(element.classList.contains('root')).toEqual(true);
        });
    });
    describe('Main property headerPlacement testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - headerPlacement property with default value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Top');
        });
        it('Items - headerPlacement property as bottom', () => {
            tab = new Tab({
                headerPlacement: 'Bottom',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Bottom');
        });
        it('Items - headerPlacement property as left', () => {
            tab = new Tab({
                headerPlacement: 'Left',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-left')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Left');
        });
        it('Items - headerPlacement property as right', () => {
            tab = new Tab({
                headerPlacement: 'Right',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Right');
        });
        it('Items - headerPlacement property with onPropertyChanged testing', () => {
            tab = new Tab({
                headerPlacement: 'Top',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Top');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('horizontal');
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelector('.e-tab-header').getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(1).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Top';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Top');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Left';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Left');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-left')).toEqual(true);
            tab.headerPlacement = 'Top';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Top');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Right';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Right');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(true);
            tab.headerPlacement = 'Top';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Top');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelector('.e-tab-header').getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(1).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Left';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Left');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-left')).toEqual(true);
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelector('.e-tab-header').getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(1).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Right';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Right');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(true);
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelector('.e-tab-header').getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(1).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Left';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Left');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-left')).toEqual(true);
            tab.headerPlacement = 'Right';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Right');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(true);
            tab.headerPlacement = 'Left';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Left');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-left')).toEqual(true);
        });
        it('Items - headerPlacement onPropertyChanged with model value testing', () => {
            tab = new Tab({
                selectedItem: 1,
                headerPlacement: 'Top',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Top');
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Items - headerPlacement with toolbar render testing', () => {
            tab = new Tab({
                headerPlacement: 'Top',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-toolbar')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Top');
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-toolbar')).toEqual(true);
        });
        it('Template - headerPlacement property with default value', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Top');
        });
        it('Template - headerPlacement property as bottom', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div> <div class="e-tab-header"> <div> item1 </div>'
            '<div> item2 </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Bottom');
        });
        it('Template - headerPlacement property with onPropertyChanged', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Top');
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelector('.e-tab-header').getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(1).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Top';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Top');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Left';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Left');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-left')).toEqual(true);
            tab.headerPlacement = 'Top';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Top');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Right';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Right');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(true);
            tab.headerPlacement = 'Top';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Top');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelector('.e-tab-header').getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(1).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Left';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Left');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-left')).toEqual(true);
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelector('.e-tab-header').getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(1).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Right';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Right');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(true);
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(1).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Left';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Left');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-left')).toEqual(true);
            tab.headerPlacement = 'Right';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Right');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(true);
            tab.headerPlacement = 'Left';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Left');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-left')).toEqual(true);
        });
        it('Template - onPropertyChanged with headerPlacement model value testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Top');
            tab.select(1);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Template - headerPlacement with toolbar render testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-toolbar')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Top');
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-toolbar')).toEqual(true);
        });
        it('Items - headerPlacement and overflowMode property testing', () => {
            tab = new Tab({
                headerPlacement: 'Top',
                height: '100px',
                width: '200px',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" },
                    { header: { "text": "item5" }, content: "Content5" },
                    { header: { "text": "item6" }, content: "Content6" },
                    { header: { "text": "item7" }, content: "Content7" },
                    { header: { "text": "item8" }, content: "Content8" },
                    { header: { "text": "item9" }, content: "Content9" },
                    { header: { "text": "item10" }, content: "Content10" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-indicator')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-ignore')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-hidden')).toEqual(false);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('horizontal');
            expect(tab.headerPlacement).toEqual('Top');
            tab.select(8);
            tab.headerPlacement = 'Left';
            tab.dataBind();
            expect(element.querySelectorAll('.e-toolbar-item').item(4).classList.contains('e-active')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-indicator')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-ignore')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-hidden')).toEqual(false);
            expect(tab.headerPlacement).toEqual('Left');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-left')).toEqual(true);
            tab.headerPlacement = 'Bottom';
            tab.dataBind();
            expect(element.querySelectorAll('.e-toolbar-item').item(3).classList.contains('e-active')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-indicator')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-ignore')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-hidden')).toEqual(false);
            expect(tab.headerPlacement).toEqual('Bottom');
            expect(element.querySelector('.e-tab-header').getAttribute('aria-orientation')).toEqual('horizontal');
            expect(element.classList.contains('e-vertical-tab')).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(1).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-vertical')).toEqual(false);
            expect(element.children.item(1).classList.contains('e-vertical-right')).toEqual(false);
            tab.headerPlacement = 'Right';
            tab.dataBind();
            expect(element.querySelectorAll('.e-toolbar-item').item(4).classList.contains('e-active')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-indicator')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-ignore')).toEqual(true);
            expect((<HTMLElement>element.querySelector('.e-toolbar-items').firstChild).classList.contains('e-hidden')).toEqual(false);
            expect(tab.headerPlacement).toEqual('Right');
            expect(element.firstElementChild.getAttribute('aria-orientation')).toEqual('vertical');
            expect(element.classList.contains('e-vertical-tab')).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-vertical-right')).toEqual(true);
        });
        it('EJ2-49949 - The aria-selected attribute of each tab stays true', () => {
            tab = new Tab({
                headerPlacement: 'Top',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-toolbar')).toEqual(true);
            const toolbarElement: HTMLElement[] = [].slice.call(element.querySelectorAll('.e-toolbar-item'));
            expect(toolbarElement[0].firstElementChild.getAttribute('aria-selected')).toEqual('true');
            expect(toolbarElement[1].firstElementChild.getAttribute('aria-selected')).toEqual('false');
            expect(toolbarElement[2].firstElementChild.getAttribute('aria-selected')).toEqual('false');
            tab.selectedItem = 1;
            tab.dataBind();
            expect(toolbarElement[0].firstElementChild.getAttribute('aria-selected')).toEqual('false');
            expect(toolbarElement[1].firstElementChild.getAttribute('aria-selected')).toEqual('true');
            expect(toolbarElement[2].firstElementChild.getAttribute('aria-selected')).toEqual('false');
            tab.selectedItem = 2;
            tab.dataBind();
            expect(toolbarElement[0].firstElementChild.getAttribute('aria-selected')).toEqual('false');
            expect(toolbarElement[1].firstElementChild.getAttribute('aria-selected')).toEqual('false');
            expect(toolbarElement[2].firstElementChild.getAttribute('aria-selected')).toEqual('true');
            expect(toolbarElement[2].firstElementChild.getAttribute('role')).toEqual('tab');
        });
    });
    describe('enableRTL property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Default model value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.enableRtl).toEqual(false);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-rtl')).toEqual(false);
            expect(element.querySelector('.e-tab-header').classList.contains('e-rtl')).toEqual(false);
        });
        it('Items - enableRTL at initial rendering', () => {
            tab = new Tab({
                enableRtl: true,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.enableRtl).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-rtl')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-rtl')).toEqual(true);
        });
        it('Items - onPropertyChanged with enableRTL', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.enableRtl).toEqual(false);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-rtl')).toEqual(false);
            expect(element.querySelector('.e-tab-header').classList.contains('e-rtl')).toEqual(false);
            tab.enableRtl = true;
            tab.dataBind();
            expect(tab.enableRtl).toEqual(true);
            expect(element.classList.contains('e-rtl')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-rtl')).toEqual(true);
            tab.enableRtl = false;
            tab.dataBind();
            expect(tab.enableRtl).toEqual(false);
            expect(element.classList.contains('e-rtl')).toEqual(false);
            expect(element.querySelector('.e-tab-header').classList.contains('e-rtl')).toEqual(false);
        });
        it('Template - Default model value', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.enableRtl).toEqual(false);
            expect(element.classList.contains('e-rtl')).toEqual(false);
            expect(element.querySelector('.e-tab-header').classList.contains('e-rtl')).toEqual(false);
        });
        it('Template - EnableRTL at initial rendering', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                enableRtl: true
            });
            tab.appendTo('#ej2Tab');
            expect(tab.enableRtl).toEqual(true);
            expect(element.classList.contains('e-rtl')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-rtl')).toEqual(true);
        });

        it('Template - onPropertyChanged with enableRTL', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.enableRtl).toEqual(false);
            expect(element.classList.contains('e-rtl')).toEqual(false);
            expect(element.querySelector('.e-tab-header').classList.contains('e-rtl')).toEqual(false);
            tab.enableRtl = true;
            tab.dataBind();
            expect(tab.enableRtl).toEqual(true);
            expect(element.classList.contains('e-rtl')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-rtl')).toEqual(true);
            tab.enableRtl = false;
            tab.dataBind();
            expect(tab.enableRtl).toEqual(false);
            expect(element.classList.contains('e-rtl')).toEqual(false);
            expect(element.querySelector('.e-tab-header').classList.contains('e-rtl')).toEqual(false);
        });
    });
    describe('showCloseButton property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Close icon availability checking', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.showCloseButton).toEqual(false);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-icons.e-close-icon').length == 2).toEqual(true);
        });
        it('Items - Default model value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.showCloseButton).toEqual(false);
            let element: HTMLElement = document.getElementById('ej2Tab');
        });
        it('Items - enable a showCloseButton at initial rendering', () => {
            tab = new Tab({
                showCloseButton: true,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.showCloseButton).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
        });
        it('Items - onPropertyChanged with showCloseButton property testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.showCloseButton).toEqual(false);
            tab.showCloseButton = true;
            tab.dataBind();
            expect(tab.showCloseButton).toEqual(true);
            tab.showCloseButton = false;
            tab.dataBind();
            expect(tab.showCloseButton).toEqual(false);
        });
        it('Items - Click event testing with close button', () => {
            tab = new Tab({
                showCloseButton: true,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.showCloseButton).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            let target: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-item .e-close-icon')[0];
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            target.click();
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
        });
        it('Template - Close button availability checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.showCloseButton).toEqual(false);
            expect(element.querySelectorAll('.e-tab-header .e-icons.e-close-icon').length == 2).toEqual(true);
        });
        it('Template - Default model value', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.showCloseButton).toEqual(false);
        });
        it('Template - enable a showCloseButton at initial rendering', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                showCloseButton: true
            });
            tab.appendTo('#ej2Tab');
            expect(tab.showCloseButton).toEqual(true);
        });
        it('Template - onPropertyChanged with showCloseButton property testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.showCloseButton).toEqual(false);
            tab.showCloseButton = true;
            tab.dataBind();
            expect(tab.showCloseButton).toEqual(true);
            tab.showCloseButton = false;
            tab.dataBind();
            expect(tab.showCloseButton).toEqual(false);
        });
        it('Template - Click event testing with close button', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                showCloseButton: true
            });
            tab.appendTo('#ej2Tab');
            expect(tab.showCloseButton).toEqual(true);
            let target: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-item .e-close-icon')[0];
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            target.click();
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
        });
    });
    describe('Main property selectedItem testing', () => {
        let tab: Tab;
        let tbEle: HTMLElement
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            tbEle = createElement('div', { id: 'toolbar' });
            document.body.appendChild(ele);
            document.body.appendChild(tbEle);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Element render to content', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: tbEle },
                    { header: { "text": "item1" }, content: <HTMLElement>document.querySelector('#toolbar') },
                    { header: { "text": "item2" }, content: '<div id ="e-itemTemplate" tabindex="0" >Hi</div>' },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(false);
        });
        it('Items - selectedItem with default value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(false);
        });
        it('Items - selectedItem as 1', () => {
            tab = new Tab({
                selectedItem: 1,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(1);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Items - selectedItem as existed value', () => {
            tab = new Tab({
                selectedItem: 1,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(tab.selectedItem).toEqual(1);
            tab.selectedItem = 3;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Items - selectedItem as negative value', () => {
            tab = new Tab({
                selectedItem: -1,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Items - selectedItem as NaN value', () => {
            tab = new Tab({
                selectedItem: NaN,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Items - onPropertyChanged with selectedItem as 1', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            tab.selectedItem = 1;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(1);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Items - onPropertyChanged with selectedItem with existed value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(tab.selectedItem).toEqual(0);
            tab.selectedItem = 3;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Items - onPropertyChanged with selectedItem as negative value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            tab.selectedItem = -1;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Items - onPropertyChanged with selectedItem as NaN value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            tab.selectedItem = NaN;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Items - onPropertyChanged with selectedItem as same value', () => {
            tab = new Tab({
                selectedItem: 1,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(1);
            tab.selectedItem = 1;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(1);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Items - selectedItem value check using select method with HTMLElement', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content1", cssClass: "tabCssClass" },
                    { header: { "text": "item2", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content2", cssClass: "tabCssClass" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(tab.element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(<HTMLElement>document.querySelectorAll('.e-toolbar-item').item(1));
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Items - selectedItem property using select method with invalid HTMLElement', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content1", cssClass: "tabCssClass" },
                    { header: { "text": "item2", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content2", cssClass: "tabCssClass" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(tab.element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(<HTMLElement>document.querySelector('.e-toolbar-items'));
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - selectedItem with default value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(false);
        });
        it('Template - selectedItem as 1', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                selectedItem: 1
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(1);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Template - selectedItem with existed value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                selectedItem: 1
            });
            tab.appendTo('#ej2Tab');
            expect(tab.element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(tab.selectedItem).toEqual(1);
            tab.selectedItem = 3;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - selectedItem as negative value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                selectedItem: -1
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - selectedItem as NaN value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                selectedItem: NaN
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - onPropertyChanged as 1', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            tab.selectedItem = 1;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(1);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Template - onPropertyChanged with selectedItem as same value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                selectedItem: 1
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(1);
            tab.selectedItem = 1;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(1);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Template - onPropertyChanged with selectedItem as existed value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(tab.selectedItem).toEqual(0);
            tab.selectedItem = 3;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - onPropertyChanged with selectedItem as negative value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            tab.selectedItem = -1;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - onPropertyChanged with selectedItem as NaN value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            tab.selectedItem = NaN;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - selectedItem value check using select method with HTMLElement', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(tab.element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(<HTMLElement>document.querySelectorAll('.e-toolbar-item').item(1));
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Template - selectedItem value check using select method with invalid HTMLElement', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(tab.element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(<HTMLElement>document.querySelector('.e-toolbar-items'));
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(false);
        });
    });
    describe('enableTab method testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - enableTab as false', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(true);
        });
        it('Items - enableTab as true', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(true);
            tab.enableTab(1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Items - enableTab as false to active item', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(0, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Items - enableTab as false with unknown index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(2, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Items - enableTab as true with unknown index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(2, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(2, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Items - enableTab as false with negative index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(-1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Items - enableTab as true with negative index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(-1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(-1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Items - enableTab as false with NaN index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(NaN, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Items - enableTab as true with NaN index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(NaN, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(NaN, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Template - enableTab as false', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(true);
        });
        it('Template - enableTab as true', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(true);
            tab.enableTab(1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Template - enableTab as false to active item', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(0, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Template - enableTab as false with unknown index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(2, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Template - enableTab as true with unknown index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(2, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(2, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Template - enableTab as false with negative index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(-1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Template - enableTab as true with negative index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(-1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(-1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Template - enableTab as false with NaN index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(NaN, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
        it('Template - enableTab as true with NaN index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(NaN, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
            tab.enableTab(NaN, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-overlay')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-overlay')).toEqual(false);
        });
    });
    describe('addTab method testing', () => {
        let tab: Tab;
        let newItems: object[];
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            newItems = [
                { header: { "text": "item3" }, content: "Content3" },
                { header: { "text": "item4" }, content: "Content4" }
            ];
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Empty items with addTab method testing', () => {
            tab = new Tab({
                items: []
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(0);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(0);
            expect(element.querySelectorAll('.e-content').length).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            expect(element.querySelectorAll('.e-content > .e-item').length).toEqual(0);
            tab.addTab(newItems, 0);
            expect(element.children.length).toEqual(2);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-content > .e-item').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
            expect(element.querySelectorAll('.e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-content > .e-item.e-active').length).toEqual(1);
            expect(element.querySelector('.e-content > .e-item.e-active').innerHTML).toEqual('<div>Content3</div>');
        });
        it('Items - New index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab(newItems, 1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-item').item(2).id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelectorAll('.e-toolbar-item').item(3).id).toEqual('e-item' + tab.tabId + '_1');
        });
        it('Items - last index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab(newItems, 2);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-item').item(3).id).toEqual('e-item' + tab.tabId + '_3');
        });
        it('Items - Without index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab(newItems);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-item').item(2).id).toEqual('e-item' + tab.tabId + '_3');
        });
        it('Items - Negative index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab(newItems, -1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Items - NaN index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab(newItems, NaN);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Items - Passing empty array', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab([], 1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Items - Any active index with add testing', (done: Function) => {
            tab = new Tab({
                selectedItem: 1,
                items: [
                    { header: { "text": "item0" }, content: "Content0" },
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(3);
            expect(element.querySelectorAll('.e-tab > .e-content > .e-item.e-active').length).toEqual(1);
            expect(element.querySelector('.e-tab > .e-content > .e-item.e-active').innerHTML).toEqual('<div>Content1</div>');
            tab.addTab(newItems, 1);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(5);
            setTimeout(function () {
                expect(element.querySelectorAll('.e-tab > .e-content > .e-item.e-active').length).toEqual(1);
                expect(element.querySelector('.e-tab > .e-content > .e-item.e-active').innerHTML).toEqual('<div>Content3</div>');
                done();
            }, 2000);
        });
        it('Items - 0th active index with add testing', (done: Function) => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-tab > .e-content > .e-item.e-active').length).toEqual(1);
            expect(element.querySelector('.e-tab > .e-content > .e-item.e-active').innerHTML).toEqual('<div>Content1</div>');
            tab.addTab(newItems, 0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
            setTimeout(function () {
                expect(element.querySelectorAll('.e-tab > .e-content > .e-item.e-active').length).toEqual(1);
                expect(element.querySelector('.e-tab > .e-content > .e-item.e-active').innerHTML).toEqual('<div>Content3</div>');
                done();
            }, 1000);
        });
        it('Template - New index', (done: Function) => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab(newItems, 1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
            expect(element.querySelectorAll('.e-content > .e-item').length).toEqual(4);
            tab.selectedItem = 1;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(1);
            setTimeout(function () {
                expect(element.querySelectorAll('.e-tab > .e-content > .e-item.e-active').length).toEqual(1);
                expect(element.querySelector('.e-tab > .e-content > .e-item.e-active').innerHTML).toEqual('<div>Content3</div>');
                done();
            }, 1000);
        });
        it('Template - last item not available index', (done: Function) => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-content > .e-item').length).toEqual(2);
            tab.addTab(newItems, 2);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
            expect(element.querySelectorAll('.e-content > .e-item').length).toEqual(4);
            tab.selectedItem = 2;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(2);
            setTimeout(function () {
                expect(element.querySelectorAll('.e-tab > .e-content > .e-item.e-active').length).toEqual(1);
                expect(element.querySelector('.e-tab > .e-content > .e-item.e-active').innerHTML).toEqual('<div>Content3</div>');
                done();
            }, 1000);
        });
        it('Template - Negative index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab(newItems, -1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Template - NaN index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab(newItems, NaN);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Template - Empty array', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab([], 1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Template - Any active index with add testing', (done: Function) => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item0 </div> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content0</h1> <p> text</p> </div> </div> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                selectedItem: 1
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(3);
            expect(element.querySelectorAll('.e-tab > .e-content > .e-item.e-active').length).toEqual(1);
            expect(element.querySelector('.e-tab > .e-content > .e-item.e-active').innerHTML).toEqual(' <div> <h1>Content1</h1> <p> text</p> </div> ');
            tab.addTab(newItems, 1);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(5);
            setTimeout(function () {
                expect(element.querySelectorAll('.e-tab > .e-content > .e-item.e-active').length).toEqual(1);
                expect(element.querySelector('.e-tab > .e-content > .e-item.e-active').innerHTML).toEqual('<div>Content3</div>');
                done();
            }, 2000);
        });
        it('Template - 0th active index with add testing', (done: Function) => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-tab > .e-content > .e-item.e-active').length).toEqual(1);
            expect(element.querySelector('.e-tab > .e-content > .e-item.e-active').innerHTML).toEqual(' <div> <h1>Content1</h1> <p> text</p> </div> ');
            tab.addTab(newItems, 0);
            setTimeout(() => {
                expect(tab.selectedItem).toEqual(0);
                expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
                expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
                expect(element.querySelectorAll('.e-tab > .e-content > .e-item.e-active').length).toEqual(1);
                expect(element.querySelector('.e-tab > .e-content > .e-item.e-active').innerHTML).toEqual('<div>Content3</div>');
                done();
            }, 1000);
        });
    });
    describe('removeTab method testing', () => {
        let tab: Tab;
        let newItems: Object[] = [
            { header: { "text": "item3" }, content: "Content3" },
            { header: { "text": "item4" }, content: "Content4" }
        ];
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Specified value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.items.length).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.removeTab(1);
            expect(tab.items.length).toEqual(1);
            expect(tab.items[0].content).toEqual('Content1');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
        });
        it('Items - Animation with removeTab', () => {
            tab = new Tab({
                selectedItem: 2,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.items.length).toEqual(4);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
            tab.selectedItem = 3;
            tab.dataBind();
            tab.removeTab(3);
            expect(tab.items.length).toEqual(3);
            expect(tab.items[2].content).toEqual('Content3');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(3);
        });
        it('Items - canel argument for RemoveEventArgs', () => {
            tab = new Tab({
                showCloseButton: true,
                removing: (args: RemoveEventArgs) => {
                    args.cancel = true;
                },
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" }
                ]
            });
            tab.appendTo("#ej2Tab");
            let ele: HTMLElement = tab.element;
            let activeEle: HTMLElement = ele.querySelector('.e-toolbar-item.e-active') as HTMLElement;
            let closebtn: HTMLElement = activeEle.querySelector('.e-close-icon');
            expect(ele.querySelectorAll('.e-toolbar-item').length).toBe(4);
            closebtn.click();
            expect(ele.querySelector('.e-toolbar-item.e-active')).toEqual(activeEle);
            expect(ele.querySelectorAll('.e-toolbar-item').length).toBe(4);
        });
        it('Items - canel argument for AddEventArgs', () => {
            tab = new Tab({
                adding: (args: AddEventArgs) => {
                    args.cancel = true;
                },
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" }
                ]
            });
            tab.appendTo("#ej2Tab");
            let ele: HTMLElement = tab.element;
            expect(ele.querySelectorAll('.e-toolbar-item').length).toBe(4);
            tab.addTab([{ header: { "text": "Newitem1" }, content: "NewContent1" }], 1);
            expect(ele.querySelectorAll('.e-toolbar-item').length).toBe(4);
        });
        it('Items - Animation with removeTab test', () => {
            tab = new Tab({
                selectedItem: 3,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.items.length).toEqual(4);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
            tab.removeTab(3);
            expect(tab.items.length).toEqual(3);
            expect(tab.items[2].content).toEqual('Content3');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(3);
            tab.removeTab(0);
            expect(tab.items.length).toEqual(2);
            expect(tab.items[1].content).toEqual('Content3');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Items - Active item remove testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.items.length).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.removeTab(0);
            expect(tab.items.length).toEqual(1);
            expect(tab.items[0].content).toEqual('Content2');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
        });
        it('Items - Unknown value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items.length).toEqual(2);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.removeTab(2);
            expect(tab.items.length).toEqual(2);
            expect(tab.items[1].content).toEqual('Content2');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Items - Negative value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.items.length).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.removeTab(-1);
            expect(tab.items.length).toEqual(2);
            expect(tab.items[1].content).toEqual('Content2');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Items - NaN value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.items.length).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.removeTab(NaN);
            expect(tab.items.length).toEqual(2);
            expect(tab.items[1].content).toEqual('Content2');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Items - Removing all item', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.items.length).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.removeTab(1);
            expect(tab.items.length).toEqual(1);
            expect(tab.items[0].content).toEqual('Content1');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            tab.removeTab(0);
            expect(tab.items.length).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            expect(element.querySelectorAll('.e-content .e-item').length).toEqual(0);
        });
        it('Items - Active class state ensuring', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" },
                    { header: { "text": "item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.items.length).toEqual(5);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(2);
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            tab.removeTab(2);
            expect(tab.selectedItem).toEqual(2);
            expect(tab.items.length).toEqual(4);
            expect(tab.items[3].content).toEqual('Content5');
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).id).toEqual('e-item' + tab.tabId + '_3');
            tab.select(3);
            expect(tab.selectedItem).toEqual(3);
            expect(element.querySelectorAll('.e-toolbar-item').item(3).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(3).id).toEqual('e-item' + tab.tabId + '_4');
            tab.removeTab(3);
            expect(tab.selectedItem).toEqual(2);
            expect(tab.items.length).toEqual(3);
            expect(tab.items[2].content).toEqual('Content4');
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).id).toEqual('e-item' + tab.tabId + '_3');
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
            tab.removeTab(0);
            expect(tab.selectedItem).toEqual(0);
            expect(tab.items.length).toEqual(2);
            expect(tab.items[1].content).toEqual('Content4');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_1');
        });
        it('Items - Remove all tab after addTab testing', (done: Function) => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.items.length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            tab.removeTab(0);
            expect(tab.items.length).toEqual(0);
            expect(element.children.length).toEqual(2);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            expect(element.querySelector('.e-toolbar-items').children.length).toEqual(1);
            expect(element.querySelector('.e-content').children.length).toEqual(0);
            tab.addTab(newItems, 0);
            setTimeout(() => {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.children.length).toEqual(2);
                expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
                expect(element.querySelectorAll('.e-content').length).toEqual(1);
                expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
                expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
                expect(element.querySelectorAll('.e-content > .e-item').length).toEqual(1);
                expect(element.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
                expect(element.querySelectorAll('.e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_1');
                expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
                expect(element.querySelectorAll('.e-content > .e-item.e-active').length).toEqual(1);
                expect(element.querySelector('.e-content > .e-item.e-active').innerHTML).toEqual('<div>Content3</div>');
                done();
            }, 1000);
        });
        it('Template - Specified value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.removeTab(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
        });
        it('Template - Unknown value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.removeTab(2);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Template - Negative value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.removeTab(-1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Template - NaN value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.removeTab(NaN);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('Template - Active class state ensuring', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> <div> item3 </div>'
                + '<div> item4 </div> <div> item5 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div> </div>'
                + '<div> <div> <h1>Content1</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(2);
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            tab.removeTab(2);
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).id).toEqual('e-item' + tab.tabId + '_3');
            tab.select(3);
            expect(tab.selectedItem).toEqual(3);
            expect(element.querySelectorAll('.e-toolbar-item').item(3).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(3).id).toEqual('e-item' + tab.tabId + '_4');
            tab.removeTab(3);
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).id).toEqual('e-item' + tab.tabId + '_3');
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
            tab.removeTab(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_1');
        });
        it('Template - Remove all tab after addTab testing', (done: Function) => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            tab.removeTab(0);
            expect(element.children.length).toEqual(2);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            expect(element.querySelector('.e-toolbar-items').children.length).toEqual(1);
            expect(element.querySelector('.e-content').children.length).toEqual(0);
            tab.addTab(newItems, 0);
            setTimeout(() => {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.children.length).toEqual(2);
                expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
                expect(element.querySelectorAll('.e-content').length).toEqual(1);
                expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
                expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
                expect(element.querySelectorAll('.e-content > .e-item').length).toEqual(2);
                expect(element.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
                expect(element.querySelectorAll('.e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_1');
                expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
                expect(element.querySelectorAll('.e-content > .e-item.e-active').length).toEqual(1);
                expect(element.querySelector('.e-content > .e-item.e-active').innerHTML).toEqual('<div>Content3</div>');
                done();
            }, 1000);
        });
    });
    describe('hideTab method testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - hideTab as true', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
        });
        it('Items - hideTab as false', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
            tab.hideTab(1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideTab as true with unknown index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(2, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideTab as false with unknown index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(2, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(2, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideTab as true with negative index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(-1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideTab as false with negative index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(-1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(-1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - Missing boolean value for hideTab', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideTab as true with NaN index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(NaN, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideTab as false with NaN index', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(NaN, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(NaN, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideTab as true with active class', () => {
            tab = new Tab({
                selectedItem: 2,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            tab.hideTab(2, true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(false);
            tab.hideTab(0, true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - hideTab as false with active class', () => {
            tab = new Tab({
                selectedItem: 2,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            tab.hideTab(2, true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(2, false);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.hideTab(0, true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(0, false);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - All tab hide with component visibility testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.hideTab(0, true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(1, true);
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(2, true);
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(true);
            expect(element.classList.contains('e-hidden')).toEqual(true);
            tab.hideTab(0, false);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideTab as true', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
        });
        it('Template - hideTab as false', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
            tab.hideTab(1, false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideTab as true with unknown index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(2, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideTab as false with unknown index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(2, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideTab as true with negative index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            tab.hideTab(-1, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideTab as false with NaN index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            tab.hideTab(NaN, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideTab as true with NaN index', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-disable')).toEqual(false);
            tab.hideTab(NaN, true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideTab as true with active class', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> <div> item3 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <h1>Content3</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                selectedItem: 2
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            tab.hideTab(2, true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(false);
            tab.hideTab(0, true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - hideTab as false with active class', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> <div> item3 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <h1>Content3</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                selectedItem: 2
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            tab.hideTab(2, true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(2, false);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.hideTab(0, true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(0, false);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - All tab hide with component visibility testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> <div> item3 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <h1>Content3</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                selectedItem: 0
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.hideTab(0, true);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(1, true);
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(false);
            tab.hideTab(2, true);
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(true);
            expect(element.classList.contains('e-hidden')).toEqual(true);
            tab.hideTab(0, false);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(2).classList.contains('e-hidden')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-hidden')).toEqual(false);
            expect(element.classList.contains('e-hidden')).toEqual(false);
        });
    });
    describe('Select method testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Select method with empty item', () => {
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
        });
        it('Items - Select method with new value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(1);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Items - Select method with same value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Items - Select method with existed value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(2);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Items - Select method with negative value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(-1);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Items - Select method with new value animation testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" }
                ],
                animation: {
                    previous: { effect: 'ZoomIn', duration: 400, easing: 'ease' },
                    next: { effect: 'ZoomOut', duration: 400, easing: 'ease' }
                }
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(1);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            tab.select(2);
            expect(tab.selectedItem).toEqual(2);
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
        });
        it('Items - Select method with NaN value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(NaN);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Items - Select method with HTMLElement', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(tab.element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(<HTMLElement>document.querySelectorAll('.e-toolbar-item').item(1));
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Items - Select method with invalid HTMLElement', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(<HTMLElement>element.querySelector('.e-toolbar-items').children.item(3));
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - Select method with empty item', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> </div> <div class="e-content"> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
        });
        it('Template - Select method with new value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(1);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Template - Select method with same value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(0);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - Select method with existed value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(2);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - Select method with negative value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(-1);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - Select method with NaN value', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(-1);
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('Template - Select method with HTMLElement', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(tab.element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(<HTMLElement>document.querySelectorAll('.e-toolbar-item').item(1));
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Template - Select method with invalid HTMLElement', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(<HTMLElement>element.querySelector('.e-toolbar-items').children.item(3));
            expect(tab.selectedItem).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
    });
    describe('Destroy method testing', () => {
        let tab: any;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Destroy', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            tab.destroy();
            expect(element.children.length).toEqual(0);
            expect(element.classList.contains('e-rtl')).toBe(false);
            expect(element.classList.contains('e-focused')).toBe(false);
        });
        it('Template - Without header element tab destroy', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.toolbarObj).toEqual(undefined);
            tab.destroy();
        });
    });
    describe('Disable method testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Disable as true', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-disable')).toEqual(false);
            tab.disable(true);
            expect(element.classList.contains('e-disable')).toEqual(true);
        });
        it('Items - Disable as false', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-disable')).toEqual(false);
            tab.disable(true);
            expect(element.classList.contains('e-disable')).toEqual(true);
            tab.disable(false);
            expect(element.classList.contains('e-disable')).toEqual(false);
        });
        it('Template - Disable as true', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-disable')).toEqual(false);
            tab.disable(true);
            expect(element.classList.contains('e-disable')).toEqual(true);
        });
        it('Template - Disable as false', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-disable')).toEqual(false);
            tab.disable(true);
            expect(element.classList.contains('e-disable')).toEqual(true);
            tab.disable(false);
            expect(element.classList.contains('e-disable')).toEqual(false);
        });
    });
    describe('Events initialize testing', () => {
        let tab: Tab;
        let i: number = 0;
        let selectedContent: HTMLElement;
        let isInteracted_selecting: boolean = false;
        let isInteracted_selected: boolean = false;
        function clickFn(): void {
            i++;
        }
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - created event', () => {
            tab = new Tab({
                created: clickFn,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(i).toEqual(1);
        });
        it('Items - selecting and selected events', () => {
            tab = new Tab({
                selecting: clickFn,
                selected: clickFn,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(i).toEqual(1);
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(1);
            expect(i).toEqual(3);
        });
        it('selected event arguments testing', () => {
            tab = new Tab({
                selected: (args: SelectEventArgs) => {
                    selectedContent = args.selectedContent;
                },
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            tab.select(1);
            expect(selectedContent.classList.contains('e-active')).toBe(true);
            let activeContent: HTMLElement = tab.element.querySelector("#e-content" + tab.tabId + "_1");
            expect(activeContent.classList.contains('e-active')).toBe(true);
        });
        it('selecting and selected event isInteracted testing', () => {
            let isInteracted_selecting: boolean = false;
            let isInteracted_selected: boolean = false;
            tab = new Tab({
                selected: (args: SelectEventArgs) => {
                    isInteracted_selected = args.isInteracted;
                },
                selecting: (args: SelectingEventArgs) => {
                    isInteracted_selecting = args.isInteracted;
                },
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(1);
            expect(isInteracted_selecting).toBe(false);
            expect(isInteracted_selected).toBe(false);
            let activeContent: HTMLElement = tab.element.querySelector("#e-content" + tab.tabId + "_1");
            expect(activeContent.classList.contains('e-active')).toBe(true);
            let thirdTab: HTMLElement = <HTMLElement>document.querySelectorAll(".e-tab-header .e-toolbar-item")[2];
            thirdTab.click();
            expect(isInteracted_selecting).toBe(true);
            expect(isInteracted_selected).toBe(true);
            tab.selectedItem = 0;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(isInteracted_selecting).toBe(false);
            expect(isInteracted_selected).toBe(false);
            let secondTab: HTMLElement = <HTMLElement>document.querySelectorAll(".e-tab-header .e-toolbar-item")[1];
            secondTab.click();
            expect(isInteracted_selecting).toBe(true);
            expect(isInteracted_selected).toBe(true);
        });
        it('Items - removing and removed events', () => {
            tab = new Tab({
                removing: clickFn,
                removed: clickFn,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            tab.removeTab(1);
            expect(i).toEqual(5);
        });
        it('Items - adding and added events', () => {
            tab = new Tab({
                adding: clickFn,
                added: clickFn,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.addTab([{ header: { "text": "item1" }, content: "Content1" }], 1);
            expect(i).toEqual(7);
        });
        it('Template - created event', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                created: clickFn
            });
            tab.appendTo('#ej2Tab');
            expect(i).toEqual(8);
        });
        it('Template - selecting and selected events', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                selecting: clickFn,
                selected: clickFn
            });
            tab.appendTo('#ej2Tab');
            expect(i).toEqual(8);
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(1);
            expect(i).toEqual(10);
        });
        it('Template - removing and removed events', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                removing: clickFn,
                removed: clickFn
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.removeTab(1);
            expect(i).toEqual(12);
        });
        it('Template - adding and added events', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                adding: clickFn,
                added: clickFn
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.addTab([{ header: { "text": "item1" }, content: "Content1" }], 1);
            expect(i).toEqual(14);
        });
    });
    describe('Tab direct child element testing', () => {
        let tab: Tab;
        let ele: HTMLElement;
        beforeEach((): void => {
            tab = undefined;
            ele = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items based rendering - Child element checking', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-content')).toEqual(true);
        });
        it('Template based rendering - Child element checking', () => {
            ele.innerHTML = '<div class="e-tab-header"> </div> <div class="e-content"></div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-content')).toEqual(true);
        });
        it('Items and Template combined input based control rendering test', () => {
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> </div> <div class="e-content">  <div> content1 </div> </div>';
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.classList.contains('e-template')).toEqual(true);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-content')).toEqual(true);
        });
    });
    describe('Scrollable - Mobile adaptive mode', () => {
        let tab: any;
        let keyEventArgs: any;
        let toolbar: DomElements;
        let toolbarObj: any;
        beforeAll((): void => {
            let css: string = ".e-toolbar-items { height: 100%; } .e-toolbar-item { display: table-cell !important; width: auto; } .e-scroll-left-nav { height: 20px;} .e-scroll-right-nav {height: 20px; } button { font-family:Arial; font-size: 14px; padding: 1px 6px; } .e-toolbar-items.e-hscroll { width:inherit; }  .e-toolbar .e-fix-width {width : 0px !important; } .e-toolbar-items .e-toolbar-item, .e-toolbar-left, .e-toolbar-center, .e-toolbar-right { display: inline-block; } .e-toolbar .e-hor-nav { float:right; width:30px; height: 38px; display: block }" + commonCss2;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            let styleNode: Node = style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        });
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab();
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        afterAll((): void => {
            document.getElementById('scroll').remove();
        });
        it('Items - Required scrollable class testing', () => {
            tab = new Tab({
                width: '200px',
                overflowMode: 'Scrollable',
                items: [
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" },
                    { header: { "text": "header-item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-items').classList.contains('e-hscroll')).toEqual(true);
            expect(element.querySelectorAll('.e-scroll-nav').length).toEqual(2);
            expect(element.querySelectorAll('.e-scroll-left-nav').length).toEqual(1);
            expect(element.querySelectorAll('.e-scroll-right-nav').length).toEqual(1);
            expect(element.querySelectorAll('.e-hscroll-bar').length).toEqual(1);
            expect(element.querySelectorAll('.e-hscroll-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-hscroll-content .e-toolbar-item').length).toEqual(6);
        });
        it('Vertical - Items - Required scrollable class testing', () => {
            tab = new Tab({
                height: '70px',
                heightAdjustMode: 'None',
                headerPlacement: 'Left',
                overflowMode: 'Scrollable',
                items: [
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" },
                    { header: { "text": "header-item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-items').classList.contains('e-vscroll')).toEqual(true);
            expect(element.querySelectorAll('.e-scroll-nav').length).toEqual(2);
            expect(element.querySelectorAll('.e-scroll-up-nav').length).toEqual(1);
            expect(element.querySelectorAll('.e-scroll-down-nav').length).toEqual(1);
            expect(element.querySelectorAll('.e-vscroll-bar').length).toEqual(1);
            expect(element.querySelectorAll('.e-vscroll-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-vscroll-content .e-toolbar-item').length).toEqual(6);
        });
        it('Items - Switching to popup mode with no toolbar items testing', () => {
            tab = new Tab({
                width: '120px',
                overflowMode: 'Scrollable',
                items: [
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" },
                    { header: { "text": "header-item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.overflowMode = 'Popup';
            tab.dataBind();
            expect(element.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Items - Perform scroll by click event', () => {
            tab = new Tab({
                width: '200px',
                overflowMode: 'Scrollable',
                items: [
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" },
                    { header: { "text": "header-item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let rightScrollArrow: HTMLElement = <HTMLElement>document.querySelector('.e-scroll-right-nav');
            let leftScrollArrow: HTMLElement = <HTMLElement>document.querySelector('.e-scroll-left-nav');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().left > 0).toEqual(true);
            rightScrollArrow.click();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().left < 0).toEqual(true);
            leftScrollArrow.click();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().left > 0).toEqual(true);
        });
        it('Vertical - Items - Perform scroll by click event', () => {
            tab = new Tab({
                height: '70px',
                heightAdjustMode: 'None',
                headerPlacement: 'Left',
                overflowMode: 'Scrollable',
                items: [
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" },
                    { header: { "text": "header-item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let upScrollArrow: HTMLElement = <HTMLElement>document.querySelector('.e-scroll-up-nav');
            let downScrollArrow: HTMLElement = <HTMLElement>document.querySelector('.e-scroll-down-nav');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().top > 20).toEqual(true);
            downScrollArrow.click();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().top < 20).toEqual(true);
            upScrollArrow.click();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().top > 20).toEqual(true);
        });
        it('Space key testing', () => {
            tab = new Tab({
                width: '200px',
                overflowMode: 'Scrollable',
                items: [
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" },
                    { header: { "text": "header-item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_5');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.selectedItem).toEqual(5);
            expect(element.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle3, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
        });
        it('Vertical - Space key testing', () => {
            tab = new Tab({
                height: '70px',
                heightAdjustMode: 'None',
                headerPlacement: 'Left',
                overflowMode: 'Scrollable',
                items: [
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" },
                    { header: { "text": "header-item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_5');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.selectedItem).toEqual(5);
            expect(element.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle3, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
        });
        it('Template - Required scrollable class testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item1 </div> <div> header-item2 </div>'
                + ' <div> header-item3 </div> <div> header-item4 </div> <div> header-item5 </div>'
                + '<div> header-item6 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            tab = new Tab({
                width: '200px',
                overflowMode: 'Scrollable',
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-items').classList.contains('e-hscroll')).toEqual(true);
            expect(element.querySelectorAll('.e-scroll-nav').length).toEqual(2);
            expect(element.querySelectorAll('.e-scroll-left-nav').length).toEqual(1);
            expect(element.querySelectorAll('.e-scroll-right-nav').length).toEqual(1);
            expect(element.querySelectorAll('.e-hscroll-bar').length).toEqual(1);
            expect(element.querySelectorAll('.e-hscroll-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-hscroll-content .e-toolbar-item').length).toEqual(6);
        });
        it('Vertical - Template - Required scrollable class testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item1 </div> <div> header-item2 </div>'
                + ' <div> header-item3 </div> <div> header-item4 </div> <div> header-item5 </div>'
                + '<div> header-item6 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            tab = new Tab({
                height: '70px',
                heightAdjustMode: 'None',
                headerPlacement: 'Left',
                overflowMode: 'Scrollable'
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-items').classList.contains('e-vscroll')).toEqual(true);
            expect(element.querySelectorAll('.e-scroll-nav').length).toEqual(2);
            expect(element.querySelectorAll('.e-scroll-up-nav').length).toEqual(1);
            expect(element.querySelectorAll('.e-scroll-down-nav').length).toEqual(1);
            expect(element.querySelectorAll('.e-vscroll-bar').length).toEqual(1);
            expect(element.querySelectorAll('.e-vscroll-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-vscroll-content .e-toolbar-item').length).toEqual(6);
        });
        it('Template - Switching to popup mode with no toolbar items testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item1 </div> <div> header-item2 </div>'
                + ' <div> header-item3 </div> <div> header-item4 </div> <div> header-item5 </div>'
                + '<div> header-item6 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            tab = new Tab({
                width: '120px',
                overflowMode: 'Scrollable',
            });
            tab.appendTo('#ej2Tab');
            tab.overflowMode = 'Popup';
            tab.dataBind();
            expect(ele.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Template - Perform scroll by click event', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item1 </div> <div> header-item2 </div>'
                + ' <div> header-item3 </div> <div> header-item4 </div> <div> header-item5 </div>'
                + '<div> header-item6 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            tab = new Tab({
                width: '200px',
                overflowMode: 'Scrollable',
            });
            tab.appendTo('#ej2Tab');
            let rightScrollArrow: HTMLElement = <HTMLElement>document.querySelector('.e-scroll-right-nav');
            let leftScrollArrow: HTMLElement = <HTMLElement>document.querySelector('.e-scroll-left-nav');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().left > 0).toEqual(true);
            rightScrollArrow.click();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().left < 0).toEqual(true);
            leftScrollArrow.click();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().left > 0).toEqual(true);
        });
        it('Vertical - Template - Perform scroll by click event', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item1 </div> <div> header-item2 </div>'
                + ' <div> header-item3 </div> <div> header-item4 </div> <div> header-item5 </div>'
                + '<div> header-item6 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            tab = new Tab({
                height: '70px',
                heightAdjustMode: 'None',
                headerPlacement: 'Left',
                overflowMode: 'Scrollable',
            });
            tab.appendTo('#ej2Tab');
            let upScrollArrow: HTMLElement = <HTMLElement>document.querySelector('.e-scroll-up-nav');
            let downScrollArrow: HTMLElement = <HTMLElement>document.querySelector('.e-scroll-down-nav');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().top > 20).toEqual(true);
            downScrollArrow.click();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().top < 20).toEqual(true);
            upScrollArrow.click();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().top > 20).toEqual(true);
        });
    });
    describe('Popup [Items] - Mobile adaptive mode - class and element testing', () => {
        let tab: Tab;
        beforeAll((): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        });
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                width: '200px',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" },
                    { header: { "text": "header-item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        afterAll((): void => {
            document.getElementById('scroll').remove();
        });
        it('Header element popup class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolpop')).toEqual(true);
        });
        it('Popup container element availability checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop').length).toEqual(1);
        });
        it('Popup container class checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-control')).toEqual(true);
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup')).toEqual(true);
        });
        it('Popup container holds toolbar item checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').length > 0).toEqual(true);
        });
        it('Popup class testing in toolbar item inside the popup', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').item(0).classList.contains('e-toolbar-popup')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').item(1).classList.contains('e-toolbar-popup')).toEqual(true);
        });
        it('Popup button availability checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-_nav').length > 0).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header .e-hor-nav').length > 0).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header .e-hor-nav .e-icons').length > 0).toEqual(true);
        });
        it('Popup default icon class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-close')).toEqual(true);
        });
    });
    describe('Vertical - Popup [Items] - Mobile adaptive mode - class and element testing', () => {
        let tab: Tab;
        beforeAll((): void => {
            let css: string = commonCss2;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        });
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                height: '70px',
                heightAdjustMode: 'None',
                headerPlacement: 'Left',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" },
                    { header: { "text": "header-item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        afterAll((): void => {
            document.getElementById('scroll').remove();
        });
        it('Header element popup class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolpop')).toEqual(true);
        });
        it('Popup container element availability checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop').length).toEqual(1);
        });
        it('Popup container class checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-control')).toEqual(true);
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup')).toEqual(true);
        });
        it('Popup container holds toolbar item checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').length > 0).toEqual(true);
        });
        it('Popup class testing in toolbar item inside the popup', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').item(0).classList.contains('e-toolbar-popup')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').item(1).classList.contains('e-toolbar-popup')).toEqual(true);
        });
        it('Popup button availability checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-_nav').length > 0).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header .e-hor-nav').length > 0).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header .e-hor-nav .e-icons').length > 0).toEqual(true);
        });
        it('Popup default icon class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-close')).toEqual(true);
        });
    });
    describe('Popup [Template] - Mobile adaptive mode - class and element testing', () => {
        let tab: Tab;
        beforeAll((): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        });
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item0 </div> <div> header-item1 </div>'
                + ' <div> header-item2 </div> <div> header-item3 </div> <div> header-item4 </div>'
                + '<div> header-item5 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            document.body.appendChild(ele);
            tab = new Tab({
                width: '200px',
                overflowMode: 'Popup'
            });
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        afterAll((): void => {
            document.getElementById('scroll').remove();
        });
        it('Header element popup class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolpop')).toEqual(true);
        });
        it('Popup container element availability checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop').length).toEqual(1);
        });
        it('Popup container class checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-control')).toEqual(true);
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup')).toEqual(true);
        });
        it('Popup container holds toolbar item checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').length > 0).toEqual(true);
        });
        it('Popup class testing in toolbar item inside the popup', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').item(0).classList.contains('e-toolbar-popup')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').item(1).classList.contains('e-toolbar-popup')).toEqual(true);
        });
        it('Popup button availability checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-_nav').length > 0).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header .e-hor-nav').length > 0).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header .e-hor-nav .e-icons').length > 0).toEqual(true);
        });
        it('Popup default icon class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-close')).toEqual(true);
        });
    });
    describe('Vertical - Popup [Template] - Mobile adaptive mode - class and element testing', () => {
        let tab: Tab;
        beforeAll((): void => {
            let css: string = commonCss2;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        });
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item0 </div> <div> header-item1 </div>'
                + ' <div> header-item2 </div> <div> header-item3 </div> <div> header-item4 </div>'
                + '<div> header-item5 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            document.body.appendChild(ele);
            tab = new Tab({
                height: '70px',
                heightAdjustMode: 'None',
                headerPlacement: 'Right',
                overflowMode: 'Popup'
            });
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        afterAll((): void => {
            document.getElementById('scroll').remove();
        });
        it('Header element popup class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-tab-header').classList.contains('e-toolpop')).toEqual(true);
        });
        it('Popup container element availability checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop').length).toEqual(1);
        });
        it('Popup container class checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-control')).toEqual(true);
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup')).toEqual(true);
        });
        it('Popup container holds toolbar item checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').length > 0).toEqual(true);
        });
        it('Popup class testing in toolbar item inside the popup', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').item(0).classList.contains('e-toolbar-popup')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').item(1).classList.contains('e-toolbar-popup')).toEqual(true);
        });
        it('Popup button availability checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header .e-_nav').length > 0).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header .e-hor-nav').length > 0).toEqual(true);
            expect(element.querySelectorAll('.e-tab-header .e-hor-nav .e-icons').length > 0).toEqual(true);
        });
        it('Popup default icon class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-close')).toEqual(true);
        });
    });
    describe('Items [Popup] - Mobile adaptive mode [Handling]', () => {
        let tab: Tab;
        beforeEach((done: Function): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                width: '150px',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let popup: HTMLElement = <HTMLElement>document.querySelector('.e-tab-header .e-hor-nav');
            popup.click();
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Select element from popup by click event', () => {
            let targetElement: HTMLElement = document.getElementById('e-item' + tab.tabId + '_1');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).id).toEqual('e-item' + tab.tabId + '_1');
            targetElement.click();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).id).toEqual('e-item' + tab.tabId + '_0');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-active')).toEqual(false);
        });
        it('Select element from popup by click event when RTL enable state', () => {
            tab.enableRtl = true;
            tab.dataBind();
            let targetElement: HTMLElement = document.getElementById('e-item' + tab.tabId + '_1');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).id).toEqual('e-item' + tab.tabId + '_1');
            targetElement.click();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).id).toEqual('e-item' + tab.tabId + '_0');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-active')).toEqual(false);
        });
        it('OverflowMode switching', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.overflowMode = "Scrollable";
            tab.width = 150;
            tab.dataBind();
            expect(element.querySelectorAll('.e-hscroll-bar').length).toEqual(1);
            tab.overflowMode = "Popup";
            tab.dataBind();
            expect(element.querySelectorAll('.e-toolbar-pop').length).toEqual(1);
        });
        it('Ripple element availability checking', () => {
            let targetElement: HTMLElement = document.getElementById('e-item' + tab.tabId + '_1');
            let element: HTMLElement = document.getElementById('ej2Tab');
            targetElement.querySelector('.e-close-icon').classList.add('e-ripple-element');
            targetElement.click();
            expect(targetElement.querySelectorAll('.e-ripple-element').length == 0).toEqual(true);
        });
        it('Select method to popup element selection', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).id).toEqual('e-item' + tab.tabId + '_1');
            tab.select(2);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).id).toEqual('e-item' + tab.tabId + '_0');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-active')).toEqual(false);
        });
    });
    describe('Template [Popup] - Mobile adaptive mode [Handling]', () => {
        let tab: Tab;
        beforeEach((done: Function): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item0 </div> <div> header-item1 </div>'
                + ' <div> header-item2 </div> <div> header-item3 </div> <div> header-item4 </div>'
                + '<div> header-item5 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            document.body.appendChild(ele);
            tab = new Tab({
                width: '200px',
                overflowMode: 'Popup'
            });
            tab.appendTo('#ej2Tab');
            let popup: HTMLElement = <HTMLElement>document.querySelector('.e-tab-header .e-hor-nav');
            popup.click();
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Select element from popup by click event', () => {
            let targetElement: HTMLElement = document.getElementById('e-item' + tab.tabId + '_2');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).id).toEqual('e-item' + tab.tabId + '_2');
            targetElement.click();
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-active')).toEqual(false);
        });
        it('Select method to popup element selection', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).id).toEqual('e-item' + tab.tabId + '_2');
            tab.select(2);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-item.e-toolbar-popup').item(0).classList.contains('e-active')).toEqual(false);
        });
    });
    describe('Animation combination testing', () => {
        let tab: Tab;
        beforeEach((done: Function): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                width: '400px',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let popup: HTMLElement = <HTMLElement>document.querySelector('.e-tab-header .e-hor-nav');
            popup.click();
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Animation setting with none value', () => {
            tab.animation = {
                previous: { effect: 'None', duration: 400, easing: 'ease' },
                next: { effect: 'None', duration: 400, easing: 'ease' }
            }
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
            tab.selectedItem = 1;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_1').innerHTML).toEqual('<div>Content1</div>');
            tab.selectedItem = 0;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
        });
        it('Animation setting with different value', () => {
            tab.animation = {
                previous: { effect: 'FadeZoomIn', duration: 400, easing: 'ease' },
                next: { effect: 'ZoomOut', duration: 400, easing: 'ease' }
            }
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
            tab.selectedItem = 1;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_1').innerHTML).toEqual('<div>Content1</div>');
            tab.selectedItem = 0;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
        });
    });
    describe('Items - Animations related testing', () => {
        let tab: Tab;
        beforeEach((done: Function): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                width: '400px',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let popup: HTMLElement = <HTMLElement>document.querySelector('.e-tab-header .e-hor-nav');
            popup.click();
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Default content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
        });
        it('SelectedItem property based content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
            tab.selectedItem = 1;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_1').innerHTML).toEqual('<div>Content1</div>');
            tab.selectedItem = 0;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
        });
        it('Select method based content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
            tab.select(1);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_1').innerHTML).toEqual('<div>Content1</div>');
            tab.select(0);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
        });
        it('Select method based content value checking with RTL', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
            tab.enableRtl = true;
            tab.dataBind();
            tab.select(1);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_1').innerHTML).toEqual('<div>Content1</div>');
            tab.select(0);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
        });
        it('SelectedItem property using popup element - Content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
            tab.selectedItem = 2;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_2').innerHTML).toEqual('<div>Content2</div>');
            tab.selectedItem = 4;
            tab.dataBind();
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').id).toEqual('e-item' + tab.tabId + '_4');
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_4').innerHTML).toEqual('<div>Content4</div>');
            tab.selectedItem = 5;
            tab.dataBind();
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').id).toEqual('e-item' + tab.tabId + '_5');
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').id).toEqual('e-item' + tab.tabId + '_4');
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_5').innerHTML).toEqual('<div>Content5</div>');
        });
        it('Select method using popup element - Content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>Content0</div>');
            tab.select(2);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_2').innerHTML).toEqual('<div>Content2</div>');
            tab.select(3);
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').id).toEqual('e-item' + tab.tabId + '_4');
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_3').innerHTML).toEqual('<div>Content3</div>');
            tab.select(4);
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').id).toEqual('e-item' + tab.tabId + '_4');
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_4').innerHTML).toEqual('<div>Content4</div>');
        });
    });
    describe('Template - Animations related testing', () => {
        let tab: Tab;
        beforeEach((done: Function): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item0 </div> <div> header-item1 </div>'
                + ' <div> header-item2 </div> <div> header-item3 </div> <div> header-item4 </div>'
                + '<div> header-item5 </div> </div> <div class="e-content"> <div>Content0</div> <div>Content1</div> <div>Content2</div>'
                + '<div>Content3</div> <div>Content4</div> <div>Content5</div>';
            document.body.appendChild(ele);
            tab = new Tab({
                width: '300px',
                overflowMode: 'Popup'
            });
            tab.appendTo('#ej2Tab');
            let popup: HTMLElement = <HTMLElement>document.querySelector('.e-tab-header .e-hor-nav');
            popup.click();
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Default content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('Content0');
        });
        it('SelectedItem property based content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('Content0');
            tab.selectedItem = 1;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_1').innerHTML).toEqual('Content1');
            tab.selectedItem = 0;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('Content0');
        });
        it('Select method based content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('Content0');
            tab.select(1);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_1').innerHTML).toEqual('Content1');
            tab.select(0);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('Content0');
        });
        it('Select method based content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('Content0');
            tab.enableRtl = true;
            tab.dataBind();
            tab.select(1);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_1').innerHTML).toEqual('Content1');
            tab.select(0);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('Content0');
        });
        it('SelectedItem property using popup element - Content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('Content0');
            tab.selectedItem = 2;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_2').innerHTML).toEqual('Content2');
            tab.selectedItem = 3;
            tab.dataBind();
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_3').innerHTML).toEqual('Content3');
            tab.selectedItem = 4;
            tab.dataBind();
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').id).toEqual('e-item' + tab.tabId + '_4');
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_4').innerHTML).toEqual('Content4');
        });
        it('Select method using popup element - Content value checking', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content .e-item').innerHTML).toEqual('Content0');
            tab.select(2);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_2').innerHTML).toEqual('Content2');
            tab.select(4);
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').id).toEqual('e-item' + tab.tabId + '_4');
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_4').innerHTML).toEqual('Content4');
            tab.select(5);
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').id).toEqual('e-item' + tab.tabId + '_5');
            expect(element.querySelector('.e-toolbar-item:not(.e-toolbar-popup):last-child').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').id).toEqual('e-item' + tab.tabId + '_4');
            expect(element.querySelector('.e-toolbar-item.e-toolbar-popup:first-child').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_5').innerHTML).toEqual('Content5');
        });
    });
    describe('Scrollable mode - Active item focused view testing', () => {
        let tab: any;
        let keyEventArgs: any;
        let toolbar: DomElements;
        let toolbarObj: any;
        beforeEach((): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                width: '150px',
                overflowMode: 'Scrollable',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            toolbar = <DomElements>element.querySelector('.e-tab-header');
            toolbarObj = <Toolbar>toolbar.ej2_instances[0];
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('moveRight and moveLeft key with item visibility testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: actEle1,
            };
            tab.keyHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_1');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: actEle2,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle3, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Vertical tab - end and home key with item visibility testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            tab.keyHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_5');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: actEle2,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle3, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
    });
    describe('Items - Keyboard navigation testing', () => {
        let tab: any;
        let keyEventArgs: any;
        let toolbar: DomElements;
        let toolbarObj: any;
        beforeEach((done: Function): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                width: '400px',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let popup: HTMLElement = <HTMLElement>document.querySelector('.e-tab-header .e-hor-nav');
            popup.click();
            let element: HTMLElement = document.getElementById('ej2Tab');
            toolbar = <DomElements>element.querySelector('.e-tab-header');
            toolbarObj = <Toolbar>toolbar.ej2_instances[0];
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            expect(isVisible(tab.popObj.element)).toBe(false);
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('moveRight and moveLeft with shiftTab popup opening key testing', (done: Function): void => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_1');
            expect(isVisible(tab.popObj.element)).toBe(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'shiftTab',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(() => { done(); }, 450);
        });
    });
    describe('Items - Keyboard navigation testing', () => {
        let tab: any;
        let keyEventArgs: any;
        let toolbar: DomElements;
        let toolbarObj: any;
        beforeEach((done: Function): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                width: '400px',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let popup: HTMLElement = <HTMLElement>document.querySelector('.e-tab-header .e-hor-nav');
            popup.click();
            let element: HTMLElement = document.getElementById('ej2Tab');
            toolbar = <DomElements>element.querySelector('.e-tab-header');
            toolbarObj = <Toolbar>toolbar.ej2_instances[0];
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('keyboard class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-keyboard')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-keyboard')).toEqual(true);
        });
        it('Tab key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('moveRight and moveLeft key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_1');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'shiftTab',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(actEle3.getAttribute('tabindex')).toEqual('-1');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: actEle3,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle4: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle4, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Home and End key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_3');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: actEle2,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle3, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Space key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_3');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.selectedItem).toEqual(3);
            expect(element.querySelector('#e-item' + tab.tabId + '_3').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle3, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: actEle3,
            };
            tab.keyHandler(keyEventArgs);
            let actEle4: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.selectedItem).toEqual(3);
            expect(element.querySelector('#e-item' + tab.tabId + '_3').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle4, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
            tab.height = 2000;
            tab.dataBind();
            let actEle5: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle5, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
            expect(document.documentElement.scrollTop).toEqual(0);
            let e: any = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: '32', shiftKey: true });
            Object.defineProperty(e, "keyCode", { "value": 32 });
            Object.defineProperty(e, "which", { "value": 32 });
            actEle5.dispatchEvent(e);
            (<HTMLElement>element.children[1].children[0]).dispatchEvent(e);
            expect(document.documentElement.scrollTop).toEqual(0);
            let eve: any = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: '32', shiftKey: true });
            Object.defineProperty(eve, "keyCode", { "value": 32 });
            Object.defineProperty(eve, "which", { "value": 40 });
            actEle5.dispatchEvent(eve);
            expect(document.documentElement.scrollTop).toEqual(0);
            let arg: any = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: '35', shiftKey: true });
            Object.defineProperty(arg, "keyCode", { "value": 35 });
            Object.defineProperty(arg, "which", { "value": 35 });
            actEle5.dispatchEvent(arg);
            expect(document.documentElement.scrollTop).toEqual(0);
        });
        it('Space key to popup close testing', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            trgEle.focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-close')).toEqual(true);
                done();
            }, 1000);
        });
        it('Enter key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_3');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'enter',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_3').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle3, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
        });
        it('Delete key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.showCloseButton = true;
            tab.dataBind();
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(true);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: actEle2
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_3')).toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
        });
        it('Delete key with showCloseButton as false', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(false);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: actEle2
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_3')).not.toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
        });
        it('Delete key with invalid element as target', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.showCloseButton = true;
            tab.dataBind();
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(true);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_3')).not.toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
        });
        it('Delete key press with next element focus testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.showCloseButton = true;
            tab.dataBind();
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let targetEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            targetEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(true);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('#e-item' + tab.tabId + '_1 div');
            trgEle.focus();
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: actEle2
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_1')).toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(4);
            let actEle4: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle4, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
        });
    });
    describe('Vertical - Items - Keyboard navigation testing', () => {
        let tab: any;
        let keyEventArgs: any;
        let toolbar: DomElements;
        let toolbarObj: any;
        beforeEach((done: Function): void => {
            let css: string = commonCss2;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                height: '100px',
                heightAdjustMode: 'None',
                headerPlacement: 'Left',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let popup: HTMLElement = <HTMLElement>document.querySelector('.e-tab-header .e-hor-nav');
            popup.click();
            let element: HTMLElement = document.getElementById('ej2Tab');
            toolbar = <DomElements>element.querySelector('.e-tab-header');
            toolbarObj = <Toolbar>toolbar.ej2_instances[0];
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Tab key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('moveUp and moveDown key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveDown',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_1');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'shiftTab',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(actEle3.getAttribute('tabindex')).toEqual('-1');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveUp',
                target: actEle3,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle4: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle4, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Home and End key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: actEle2,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle3, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Space key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle3, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: actEle3,
            };
            tab.keyHandler(keyEventArgs);
            let actEle4: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle4, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
            tab.height = 2000;
            tab.dataBind();
            let actEle5: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle5, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
            expect(document.documentElement.scrollTop).toEqual(0);
            let e: any = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: '32', shiftKey: true });
            Object.defineProperty(e, "keyCode", { "value": 32 });
            Object.defineProperty(e, "which", { "value": 32 });
            actEle5.dispatchEvent(e);
            (<HTMLElement>element.children[1].children[0]).dispatchEvent(e);
            expect(document.documentElement.scrollTop).toEqual(0);
            let eve: any = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: '32', shiftKey: true });
            Object.defineProperty(eve, "keyCode", { "value": 32 });
            Object.defineProperty(eve, "which", { "value": 40 });
            actEle5.dispatchEvent(eve);
            expect(document.documentElement.scrollTop).toEqual(0);
            let arg: any = new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: '35', shiftKey: true });
            Object.defineProperty(arg, "keyCode", { "value": 35 });
            Object.defineProperty(arg, "which", { "value": 35 });
            actEle5.dispatchEvent(arg);
            expect(document.documentElement.scrollTop).toEqual(0);
        });
        it('Space key to popup close testing', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            trgEle.focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-close')).toEqual(true);
                done();
            }, 1000);
        });
        it('Enter key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'enter',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle3, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
        });
        it('Delete key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.showCloseButton = true;
            tab.dataBind();
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(true);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: actEle2
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_2')).toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
        });
        it('Delete key with showCloseButton as false', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(false);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: actEle2
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_2')).not.toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
        });
        it('Delete key with invalid element as target', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.showCloseButton = true;
            tab.dataBind();
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(true);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_2')).not.toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
        });
        it('Delete key press with next element focus testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.showCloseButton = true;
            tab.dataBind();
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let targetEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            targetEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(true);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('#e-item' + tab.tabId + '_1 div');
            trgEle.focus();
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: actEle2
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_1')).toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
        });
    });
    describe('Template - Keyboard navigation testing', () => {
        let tab: any;
        let keyEventArgs: any;
        let toolbar: DomElements;
        let toolbarObj: any;
        beforeEach((done: Function): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item0 </div> <div> header-item1 </div>'
                + ' <div> header-item2 </div> <div> header-item3 </div> <div> header-item4 </div>'
                + '<div> header-item5 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            document.body.appendChild(ele);
            tab = new Tab({
                width: '300px',
                overflowMode: 'Popup',
            });
            tab.appendTo('#ej2Tab');
            let popup: HTMLElement = <HTMLElement>document.querySelector('.e-tab-header .e-hor-nav');
            popup.click();
            let element: HTMLElement = document.getElementById('ej2Tab');
            toolbar = <DomElements>element.querySelector('.e-tab-header');
            toolbarObj = <Toolbar>toolbar.ej2_instances[0];
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('keyboard class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-keyboard')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-keyboard')).toEqual(true);
        });
        it('Tab key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('moveRight and moveLeft key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_1');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: actEle2,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle3, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Home and End key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: actEle2,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle3, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Space key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle3, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
        });
        it('Space key to popup close testing', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            trgEle.focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-close')).toEqual(true);
                done();
            }, 1000);
        });
        it('Enter key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'enter',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle3, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
        });
        it('Delete key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.showCloseButton = true;
            tab.dataBind();
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(true);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: actEle2
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_2')).toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
        });
        it('Delete key press with next element focus testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.showCloseButton = true;
            tab.dataBind();
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let targetEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            targetEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(true);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('#e-item' + tab.tabId + '_1 div');
            trgEle.focus();
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: actEle2
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_1')).toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            let actEle4: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle4, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
        });
    });
    describe('Vertical - Template - Keyboard navigation testing', () => {
        let tab: any;
        let keyEventArgs: any;
        let toolbar: DomElements;
        let toolbarObj: any;
        beforeEach((done: Function): void => {
            let css: string = commonCss2;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item0 </div> <div> header-item1 </div>'
                + ' <div> header-item2 </div> <div> header-item3 </div> <div> header-item4 </div>'
                + '<div> header-item5 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            document.body.appendChild(ele);
            tab = new Tab({
                height: '100px',
                heightAdjustMode: 'None',
                headerPlacement: 'Left',
                overflowMode: 'Popup',
            });
            tab.appendTo('#ej2Tab');
            let popup: HTMLElement = <HTMLElement>document.querySelector('.e-tab-header .e-hor-nav');
            popup.click();
            let element: HTMLElement = document.getElementById('ej2Tab');
            toolbar = <DomElements>element.querySelector('.e-tab-header');
            toolbarObj = <Toolbar>toolbar.ej2_instances[0];
            setTimeout(() => { done(); }, 450);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('keyboard class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-keyboard')).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-keyboard')).toEqual(true);
        });
        it('Tab key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('moveRight and moveLeft key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveLeft',
                target: actEle2,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle3, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Home and End key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'home',
                target: actEle2,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle3, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
        });
        it('Space key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle3, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
        });
        it('Space key to popup close testing', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            trgEle.focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-close')).toEqual(true);
                done();
            }, 1000);
        });
        it('Enter key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'enter',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            expect(closest(actEle3, '.e-toolbar-item').classList.contains('e-active')).toEqual(true);
        });
        it('Delete key testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.showCloseButton = true;
            tab.dataBind();
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(true);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'end',
                target: actEle1
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: actEle2
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_2')).toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
        });
        it('Delete key press with next element focus testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.showCloseButton = true;
            tab.dataBind();
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let targetEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            targetEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(tab.showCloseButton).toEqual(true);
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('#e-item' + tab.tabId + '_1 div');
            trgEle.focus();
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(3);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'delete',
                target: actEle2
            };
            tab.keyHandler(keyEventArgs);
            expect(element.querySelector('#e-item' + tab.tabId + '_1')).toEqual(null);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item').length).toEqual(2);
        });
    });
    describe('Items - Keyboard navigation at scrollable mode testing', () => {
        let tab: any;
        let keyEventArgs: any;
        beforeEach((): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                width: '200px',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Enter key testing', () => {
            let trgEle: HTMLElement;
            let element: HTMLElement = document.getElementById('ej2Tab');
            trgEle = <HTMLElement>element.querySelector('.e-scroll-right-nav');
            trgEle.focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'enter',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().left < 0).toEqual(true);
            trgEle = <HTMLElement>element.querySelector('.e-scroll-left-nav');
            trgEle.focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'enter',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_0').getBoundingClientRect().left > 0).toEqual(true);
        });
    });
    describe('Items - Resize to active element position testing', () => {
        let tab: any;
        beforeEach((): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                width: '300px',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Active element visibility testing when resize', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            tab.select(2);
            expect(tab.selectedItem).toEqual(2);
            expect(element.querySelector('.e-toolbar-item.e-active').id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-toolbar-popup')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-toolbar-popup')).toEqual(false);
            tab.width = 250;
            tab.dataBind();
            toolbarObj.resize();
            tab.refreshActiveTabBorder();
            expect(element.querySelectorAll('.e-toolbar-pop').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').length).toEqual(4);
            expect(element.querySelector('.e-toolbar-item.e-active').id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-toolbar-popup')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-toolbar-popup')).toEqual(false);
        });
    });
    describe('Template - Resize to active element position testing', () => {
        let tab: any;
        beforeEach((): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            ele.innerHTML = '<div class="e-tab-header"> <div> header-item0 </div> <div> header-item1 </div>'
                + ' <div> header-item2 </div> <div> header-item3 </div> <div> header-item4 </div>'
                + '<div> header-item5 </div> </div> <div class="e-content"> <div> <div> <h1>Content1</h1>'
                + '<p> text</p> </div> </div> <div> <div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div>'
                + '<h1>Content3</h1> <p> text</p> </div> </div> <div> <div> <h1>Content4</h1> <p> text</p> </div>'
                + '</div> <div> <div> <h1>Content5</h1> <p> text</p> </div> </div> <div> <div> <h1>Content6</h1>'
                + '<p> text</p> </div> </div> </div>';
            document.body.appendChild(ele);
            tab = new Tab({
                width: '600px',
                overflowMode: 'Popup'
            });
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Active element visibility testing when resize', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbar: DomElements = <DomElements>element.querySelector('.e-tab-header');
            let toolbarObj: any = <Toolbar>toolbar.ej2_instances[0];
            tab.select(3);
            expect(tab.selectedItem).toEqual(3);
            expect(element.querySelector('.e-toolbar-item.e-active').id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-toolbar-popup')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_3').classList.contains('e-toolbar-popup')).toEqual(false);
            tab.width = 300;
            tab.dataBind();
            toolbarObj.resize();
            tab.refreshActiveTabBorder();
            expect(element.querySelectorAll('.e-toolbar-pop').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-pop .e-toolbar-item').length).toEqual(3);
            expect(element.querySelector('.e-toolbar-item.e-active').id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-toolbar-popup')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_3').classList.contains('e-toolbar-popup')).toEqual(false);
        });
    });
    describe('Items - Popup open testing using keyboard navigation', () => {
        let tab: any;
        let keyEventArgs: any;
        beforeEach((): void => {
            let css: string = commonCss;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                width: '400px',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Open Popup when press space key', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            trgEle.focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                done();
            }, 1000);
        });
        it('Open Popup when press enter key', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            trgEle.focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'enter',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                done();
            }, 1000);
        });
        it('Open Popup when press shift+f10 key', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'openPopup',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                keyEventArgs = {
                    preventDefault: function () { },
                    action: 'openPopup',
                    target: trgEle,
                };
                tab.keyHandler(keyEventArgs);
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                done();
            }, 1000);
        });
        it('Open Popup when invalid key press', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-popup');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'openPopup',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                done();
            }, 1000);
        });
    });
    describe('Vertical - Items - Popup open testing using keyboard navigation', () => {
        let tab: any;
        let keyEventArgs: any;
        beforeEach((): void => {
            let css: string = commonCss2;
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                height: '100px',
                heightAdjustMode: 'None',
                headerPlacement: 'Left',
                overflowMode: 'Popup',
                items: [
                    { header: { "text": "header-item0" }, content: "Content0" },
                    { header: { "text": "header-item1" }, content: "Content1" },
                    { header: { "text": "header-item2" }, content: "Content2" },
                    { header: { "text": "header-item3" }, content: "Content3" },
                    { header: { "text": "header-item4" }, content: "Content4" },
                    { header: { "text": "header-item5" }, content: "Content5" }
                ]
            });
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Open Popup when press space key', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            trgEle.focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'space',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                done();
            }, 1000);
        });
        it('Open Popup when press enter key', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            trgEle.focus();
            keyEventArgs = {
                preventDefault: function () { },
                action: 'enter',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                done();
            }, 1000);
        });
        it('Open Popup when press shift+f10 key', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-hor-nav');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'openPopup',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                keyEventArgs = {
                    preventDefault: function () { },
                    action: 'openPopup',
                    target: trgEle,
                };
                tab.keyHandler(keyEventArgs);
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                done();
            }, 1000);
        });
        it('Open Popup when invalid key press', (done: Function) => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-popup');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'openPopup',
                target: trgEle,
            };
            tab.keyHandler(keyEventArgs);
            setTimeout(function () {
                let element: HTMLElement = document.getElementById('ej2Tab');
                expect(element.querySelector('.e-toolbar-pop').classList.contains('e-popup-open')).toEqual(true);
                done();
            }, 1000);
        });
    });
    describe('Item based render testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Tab child element count and it class testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-content')).toEqual(true);
        });
        it('Items collection availability checking', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items).not.toEqual([]);
        });
        it('Icon Class - Single class', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", 'iconCss': 'e-btn-icon', "iconPosition": "left" }, content: "Content1" },
                    { header: { "text": "item2", 'iconCss': 'e-btn-icon', "iconPosition": "right" }, content: "Content2" },
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.getElementsByClassName('e-btn-icon').item(0).classList.contains('e-icon-left')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[0].children[0].classList.contains('e-icon-left')).toEqual(true);
            expect(element.getElementsByClassName('e-btn-icon').item(1).classList.contains('e-icon-right')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[1].children[0].classList.contains('e-icon-right')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[1].children[1].classList.contains('e-icon-right')).toEqual(true);
        });
        it('Icon Class - Multiple class', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", 'iconCss': 'e-btn-icon', "iconPosition": "left" }, content: "Content1" },
                    { header: { "text": "item2", 'iconCss': 'e-btn-icon e-btn', "iconPosition": "right" }, content: "Content2" },
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.getElementsByClassName('e-btn-icon').item(0).classList.contains('e-icon-left')).toEqual(true);
            expect(element.getElementsByClassName('e-btn-icon').item(1).classList.contains('e-icon-right')).toEqual(true);
            expect(element.getElementsByClassName('e-btn-icon').item(1).classList.contains('e-btn')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[0].children[2].classList.contains('e-close-icon')).toBe(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[1].children[2].classList.contains('e-close-icon')).toBe(true);
        });
        it('Icon Class - Without text', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { 'iconCss': 'e-btn-icon' }, content: "Content2", },
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.getElementsByClassName('e-toolbar-item').item(1).classList.contains('e-icon')).toEqual(true);
        });
        it('Icon position', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", 'iconCss': 'e-btn-icon', "iconPosition": "left" }, content: "Content1" },
                    { header: { "text": "item2", 'iconCss': 'e-btn-icon', "iconPosition": "right" }, content: "Content2" },
                    { header: { "text": "item3", 'iconCss': 'e-btn-icon', "iconPosition": "top" }, content: "Content3" },
                    { header: { "text": "item4", 'iconCss': 'e-btn-icon', "iconPosition": "bottom" }, content: "Content4" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.getElementsByClassName('e-toolbar-item').item(0).classList.contains('e-ileft')).toEqual(true);
            expect(element.getElementsByClassName('e-toolbar-item').item(1).classList.contains('e-iright')).toEqual(true);
            expect(element.getElementsByClassName('e-toolbar-item').item(2).classList.contains('e-itop')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[2].children[0].classList.contains('e-icon-top')).toEqual(true);
            expect(element.getElementsByClassName('e-toolbar-item').item(3).classList.contains('e-ibottom')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[3].children[0].classList.contains('e-icon-top')).toEqual(false);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[3].children[1].classList.contains('e-icon-bottom')).toEqual(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[0].children[2].classList.contains('e-close-icon')).toBe(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[0].children[2].classList.contains('e-close-icon')).toBe(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[1].children[2].classList.contains('e-close-icon')).toBe(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[2].children[2].classList.contains('e-close-icon')).toBe(true);
            expect(element.querySelectorAll('.e-toolbar .e-text-wrap')[3].children[2].classList.contains('e-close-icon')).toBe(true);
        });
        it('Content render with HTMLElement', () => {
            let cnt: HTMLElement = createElement('div', { id: 'content' });
            document.body.appendChild(cnt);
            cnt.innerHTML = 'testing';
            let cntEle: HTMLElement = document.getElementById('content');
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: cntEle }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items[0].content).toEqual(cntEle);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('#content').length).toEqual(1);
        });
        it('Content render with HTML string', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: '<div id="content"> content1 </div>' }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('#content').length).toEqual(1);
        });
        it('Select method with selectedItem value Testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            expect(element.getElementsByClassName('e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            tab.select(1);
            expect(tab.selectedItem).toEqual(1);
            expect(element.getElementsByClassName('e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            tab.select(2);
            expect(tab.selectedItem).toEqual(2);
            expect(element.getElementsByClassName('e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.getElementsByClassName('e-toolbar-item').item(1).classList.contains('e-active')).toEqual(false);
            expect(element.getElementsByClassName('e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            tab.select(3);
            expect(tab.selectedItem).toEqual(0);
            expect(element.getElementsByClassName('e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('onPropertyChanged for selectedItem', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            tab.selectedItem = 1;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(1);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.getElementsByClassName('e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.getElementsByClassName('e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('TabItemHeader click event', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbarElement: HTMLElement = <HTMLElement>document.querySelectorAll('.e-toolbar-item')[1];
            expect(element.getElementsByClassName('e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(tab.selectedItem).toEqual(0);
            toolbarElement.click();
            expect(tab.selectedItem).toEqual(1);
            expect(element.getElementsByClassName('e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
    });
    describe('Template based rendering', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> <div> item3 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> <div> <div> <h1>Content3</h1> <p> text</p> </div>'
                + '</div> </div>';
            document.body.appendChild(ele);
            tab = new Tab();
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Control class testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.classList.contains('e-tab')).toEqual(true);
            expect(element.classList.contains('e-template')).toEqual(true);
        });
        it('Ensuring items property value exist or not class testing', () => {
            expect(tab.items.length).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).not.toEqual(0);
        });
        it('Template rendering with required child testing', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-content')).toEqual(true);
        });
        it('Select method with template', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            tab.select(1);
            expect(tab.selectedItem).toEqual(1);
            expect(element.querySelectorAll('.e-content > .e-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.getElementsByClassName('e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
            expect(element.getElementsByClassName('e-item').item(1).classList.contains('e-active')).toEqual(true);
            tab.select(2);
            expect(tab.selectedItem).toEqual(2);
            expect(element.getElementsByClassName('e-toolbar-item').item(1).classList.contains('e-active')).toEqual(false);
            expect(element.getElementsByClassName('e-item').item(1).classList.contains('e-active')).toEqual(false);
            expect(element.getElementsByClassName('e-toolbar-item').item(2).classList.contains('e-active')).toEqual(true);
            expect(element.getElementsByClassName('e-item').item(2).classList.contains('e-active')).toEqual(true);
            tab.select(3);
            expect(tab.selectedItem).toEqual(0);
            expect(element.getElementsByClassName('e-item').item(0).classList.contains('e-active')).toEqual(true);
        });
        it('onPropertyChanged for selectedItem', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.selectedItem).toEqual(0);
            tab.selectedItem = 1;
            tab.dataBind();
            expect(tab.selectedItem).toEqual(1);
            expect(element.getElementsByClassName('e-toolbar-item').item(0).classList.contains('e-active')).toEqual(false);
            expect(element.getElementsByClassName('e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
        it('Tab header item click event', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            let toolbarElement: HTMLElement = <HTMLElement>document.querySelectorAll('.e-toolbar-item')[1];
            expect(element.getElementsByClassName('e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(tab.selectedItem).toEqual(0);
            toolbarElement.click();
            expect(tab.selectedItem).toEqual(1);
            expect(element.getElementsByClassName('e-toolbar-item').item(1).classList.contains('e-active')).toEqual(true);
        });
    });
    describe('Persistence property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - localStorage value', () => {
            window.localStorage.setItem('tabej2Tab', JSON.stringify({ actEleId: 'e-item_1' }));
            tab = new Tab({
                enablePersistence: true,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(JSON.parse(window.localStorage.tabej2Tab).actEleId).toEqual('e-item_1');
        });
    });
    describe('Getting tab item index using item ID ', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('tab item index testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1", id: '1' },
                    { header: { "text": "item2" }, content: "Content2", id: '2' }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll(".e-toolbar-item")[0].getAttribute('data-id')).toBe("1");
            let tabIndex: number = tab.getItemIndex(tab.items[0].id);
            expect(tabIndex).toEqual(0);
            expect(element.querySelectorAll(".e-toolbar-item")[1].getAttribute('data-id')).toBe("2");
            tabIndex = tab.getItemIndex(tab.items[1].id);
            expect(tabIndex).toEqual(1);
        });
        it ('EJ2-60839 - Tab item index testing for dynamically added tab item', () => {
            let items: TabItemModel[] = [
                { header: { 'text': 'item3' }, content: 'Content3' },
                { header: { 'text': 'item4' }, content: 'Content4' }
            ];
            tab = new Tab({
                items: [
                    { header: { 'text': 'item1' }, content: 'Content1', id: '1' },
                    { header: { 'text': 'item2' }, content: 'Content2', id: '2' }
                ]
            });
            tab.appendTo('#ej2Tab');
            const element: HTMLElement = tab.element;
            expect(element.querySelectorAll('.e-toolbar-item').length).toBe(2);
            tab.addTab(items, 1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toBe(4);
            expect(element.querySelectorAll('.e-toolbar-item')[1].getAttribute('data-id')).toBe('e-item-ej2Tab_tabitem_2');
            let tabIndex: number = tab.getItemIndex(tab.items[1].id);
            expect(tabIndex).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item')[2].getAttribute('data-id')).toBe('e-item-ej2Tab_tabitem_3');
            tabIndex = tab.getItemIndex(tab.items[2].id);
            expect(tabIndex).toEqual(2);
            items = [
                { header: { 'text': 'item5' }, content: 'Content5', id: '3' },
                { header: { 'text': 'item6' }, content: 'Content6', id: '4' }
            ];
            expect(element.querySelectorAll('.e-toolbar-item').length).toBe(4);
            tab.addTab(items, 3);
            expect(element.querySelectorAll('.e-toolbar-item').length).toBe(6);
            expect(element.querySelectorAll('.e-toolbar-item')[3].getAttribute('data-id')).toBe('3');
            tabIndex = tab.getItemIndex(tab.items[3].id);
            expect(tabIndex).toEqual(3);
            expect(element.querySelectorAll('.e-toolbar-item')[4].getAttribute('data-id')).toBe('4');
            tabIndex = tab.getItemIndex(tab.items[4].id);
            expect(tabIndex).toEqual(4);
        });
    });
    describe('Localization - Mouseover on close icon testing', () => {
        let tab: any;
        let mouseEventArgs: any;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            L10n.load({
                'fr-BE': {
                    'tab': {
                        'closeButtonTitle': "Cls",
                    }
                },
                'en-US': {
                    'tab': {
                        'closeButtonTitle': 'Close',
                    }
                }
            });
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Defualt title value testing', () => {
            tab = new Tab({
                showCloseButton: true,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let trg: HTMLElement = <HTMLElement>document.querySelector('.e-close-icon');
            mouseEventArgs = {
                target: trg
            };
            tab.hoverHandler(mouseEventArgs);
            expect(document.querySelector('.e-close-icon').getAttribute('title')).toEqual('Close');
        });
        it('Items - New localization mapping to title text testing', () => {
            tab = new Tab({
                locale: 'fr-BE',
                showCloseButton: true,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let trg: HTMLElement = <HTMLElement>document.querySelector('.e-close-icon');
            mouseEventArgs = {
                target: trg
            };
            tab.hoverHandler(mouseEventArgs);
            expect(document.querySelector('.e-close-icon').getAttribute('title')).toEqual('Cls');
        });
        it('Items - Mapping invalid element', () => {
            tab = new Tab({
                locale: 'fr-BE',
                showCloseButton: true,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let trg: HTMLElement = <HTMLElement>document.querySelector('.e-close-icon').parentElement;
            mouseEventArgs = {
                target: trg
            };
            tab.hoverHandler(mouseEventArgs);
            expect(document.querySelector('.e-close-icon').getAttribute('title')).not.toEqual('Cls');
        });
        it('Template - Default title text testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                showCloseButton: true
            });
            tab.appendTo('#ej2Tab');
            let trg: HTMLElement = <HTMLElement>document.querySelector('.e-close-icon');
            mouseEventArgs = {
                target: trg
            };
            tab.hoverHandler(mouseEventArgs);
            expect(document.querySelector('.e-close-icon').getAttribute('title')).toEqual('Close');
        });
        it('Template - New localization mapping with title text testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                showCloseButton: true,
                locale: 'fr-BE'
            });
            tab.appendTo('#ej2Tab');
            let trg: HTMLElement = <HTMLElement>document.querySelector('.e-close-icon');
            mouseEventArgs = {
                target: trg
            };
            tab.hoverHandler(mouseEventArgs);
            expect(document.querySelector('.e-close-icon').getAttribute('title')).toEqual('Cls');
        });
        it('Template - Mapping invalid element', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                showCloseButton: true,
                locale: 'fr-BE'
            });
            tab.appendTo('#ej2Tab');
            let trg: HTMLElement = <HTMLElement>document.querySelector('.e-close-icon').parentElement;
            mouseEventArgs = {
                target: trg
            };
            tab.hoverHandler(mouseEventArgs);
            expect(document.querySelector('.e-close-icon').getAttribute('title')).not.toEqual('Cls');
        });
    });
    describe('Border element testing', () => {
        let tab: Tab;
        beforeAll((): void => {
            let css: string = ".e-hor-nav { position: absolute }";
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            let styleNode: Node = style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        });
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        afterAll((): void => {
            document.getElementById('scroll').remove();
        });
        it('Items - Border element class list and availability checking', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-indicator')).toEqual(true);
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-ignore')).toEqual(true);
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-hidden')).toEqual(false);
        });
        it('Items - Scrollable mode border element appended place checking', () => {
            tab = new Tab({
                width: 50,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect((<HTMLElement>ele.querySelector('.e-hscroll-content').firstChild).classList.contains('e-indicator')).toEqual(true);
        });
        it('Template - Border element class list and availability checking', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-indicator')).toEqual(true);
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-ignore')).toEqual(true);
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-hidden')).toEqual(false);
        });
        it('Template - Scrollable mode Border element appended place checking', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                width: 50
            });
            tab.appendTo('#ej2Tab');
            expect((<HTMLElement>ele.querySelector('.e-hscroll-content').firstChild).classList.contains('e-indicator')).toEqual(true);
        });
        it('Vertical - Items - Border element class list and availability checking', () => {
            tab = new Tab({
                headerPlacement: 'Left',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-indicator')).toEqual(true);
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-ignore')).toEqual(true);
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-hidden')).toEqual(false);
        });
        it('Vertical - Items - Scrollable mode border element appended place checking', () => {
            tab = new Tab({
                height: 20,
                headerPlacement: 'Right',
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect((<HTMLElement>ele.querySelector('.e-vscroll-content').firstChild).classList.contains('e-indicator')).toEqual(true);
        });
        it('Vertical - Template - Border element class list and availability checking', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                headerPlacement: 'Left'
            });
            tab.appendTo('#ej2Tab');
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-indicator')).toEqual(true);
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-ignore')).toEqual(true);
            expect((<HTMLElement>ele.querySelector('.e-toolbar-items').firstChild).classList.contains('e-hidden')).toEqual(false);
        });
        it('Vertical - Template - Scrollable mode Border element appended place checking', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({
                height: 20,
                headerPlacement: 'Right'
            });
            tab.appendTo('#ej2Tab');
            expect((<HTMLElement>ele.querySelector('.e-vscroll-content').firstChild).classList.contains('e-indicator')).toEqual(true);
        });
    });
    describe('Swipe event testing', () => {
        let tab: any;
        let swipeEventArgs: any;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Swipe right and left testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Left',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                originalEvent: { stopPropagation: function () { } },
                swipeDirection: 'Right'
            };
            tab.swipeHandler(swipeEventArgs);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
        });
        it('Items - Swipe right, left and velocity with testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Left',
                velocity: 0.58,
                originalEvent: { stopPropagation: function () { } }
            };
            tab.swipeHandler(swipeEventArgs);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
        });
        it('Items - Swipe left to right testing at last item selected', () => {
            tab = new Tab({
                width: 100,
                selectedItem: 3,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_3').classList.contains('e-active')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                originalEvent: { stopPropagation: function () { } },
                swipeDirection: 'Right'
            };
            tab.swipeHandler(swipeEventArgs);
            expect(ele.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                originalEvent: { stopPropagation: function () { } },
                swipeDirection: 'Right'
            };
            tab.swipeHandler(swipeEventArgs);
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
        });
        it('Items - Swipe top and bottom', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            swipeEventArgs = {
                preventDefault: function () { },
                originalEvent: { stopPropagation: function () { } },
                swipeDirection: 'Top'
            };
            tab.swipeHandler(swipeEventArgs);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                originalEvent: { stopPropagation: function () { } },
                swipeDirection: 'Bottom'
            };
            tab.swipeHandler(swipeEventArgs);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
        });
    });
    describe('Cross browser tab element class testing', () => {
        let tab: any;
        let ieUa: string = 'Mozilla/5.0 (Windows NT 6.3; WOW64; Trident/7.0; Touch; .NET4.0E; .NET4.0C; ' +
            'Tablet PC 2.0; .NET CLR 3.5.30729; .NET CLR 2.0.50727; .NET CLR 3.0.30729; InfoPath.3; rv:11.0) like Gecko';
        let safari: string = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_90) AppleWebKit/602.4.8 ' +
            '(KHTML, like Gecko) Version/10.0.3 Safari/602.4.8';
        let edge: string = 'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) ' +
            'Chrome/42.0.2311.135 Safari/537.36 Edge/12.10240';
        let box: string = 'Mozilla/5.0 (Windows NT 6.1; rv:23.0) Gecko/20100101 Firefox/23.0';

        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Default', () => {
            Browser.userAgent = box;
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.classList.contains('e-ie')).toEqual(false);
            expect(ele.classList.contains('e-edge')).toEqual(false);
            expect(ele.classList.contains('e-safari')).toEqual(false);
        });
        it('User Agent as IE', () => {
            Browser.userAgent = ieUa;
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.classList.contains('e-ie')).toEqual(true);
        });
        it('User Agent as Edge', () => {
            Browser.userAgent = edge;
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.classList.contains('e-edge')).toEqual(true);
        });
        it('User Agent as Safari', () => {
            Browser.userAgent = safari;
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.classList.contains('e-safari')).toEqual(true);
        });
    });

    describe('Nested Tab testing', () => {
        let tabObj: Tab
        beforeAll((): void => {
            let css: string = ".e-hor-nav { position: absolute }";
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            let styleNode: Node = style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        });
        beforeEach((): void => {
            let rootDiv: HTMLElement = createElement('div', { id: 'temTab' });
            let header: HTMLElement = createElement('div', { className: 'e-tab-header' });
            let itemHead1: HTMLElement = createElement('div', { innerHTML: 'India' });
            let itemHead2: HTMLElement = createElement('div', { innerHTML: 'Canada' });
            let itemHead3: HTMLElement = createElement('div', { innerHTML: 'Australia' });
            let itemHead4: HTMLElement = createElement('div', { innerHTML: 'USA' });
            let content: HTMLElement = createElement('div', { className: 'e-content' });
            let contentItem1: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "India, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab1'></div>" }));
            let contentItem2: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "Canada, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab2'></div>" }));
            let contentItem3: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "Australia, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab3'></div>" }));
            let contentItem4: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "USA, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab4'></div>" }));
            content.appendChild(contentItem1);
            content.appendChild(contentItem2);
            content.appendChild(contentItem3);
            content.appendChild(contentItem4);
            header.appendChild(itemHead1);
            header.appendChild(itemHead2);
            header.appendChild(itemHead3);
            header.appendChild(itemHead4);
            rootDiv.appendChild(header);
            rootDiv.appendChild(content);
            document.body.appendChild(rootDiv);
            tabObj = new Tab({
                overflowMode: 'Popup',
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } }
            });
            tabObj.appendTo(rootDiv);
            let tabObj1: Tab = new Tab({
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India1' },
                        content: '1India'
                    },
                    {
                        header: { 'text': 'Australia1' },
                        content: '1Australia'
                    },
                    {
                        header: { 'text': 'USA1' },
                        content: '1The United States of America'
                    },
                    {
                        header: { 'text': 'France1' },
                        content: '1France'
                    }
                ],
            });
            tabObj1.appendTo('#Tab1')
            let tabObj2: Tab = new Tab({
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India2' },
                        content: '2India'
                    },
                    {
                        header: { 'text': 'Australia2' },
                        content: '2Australia'
                    },
                    {
                        header: { 'text': 'USA2' },
                        content: '2The United States of America'
                    },
                    {
                        header: { 'text': 'France2' },
                        content: '2France'
                    }
                ],
            });
            tabObj2.appendTo('#Tab2')
            let tabObj3: Tab = new Tab({
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India3' },
                        content: '3India'
                    },
                    {
                        header: { 'text': 'Australia3' },
                        content: '3Australia'
                    },
                    {
                        header: { 'text': 'USA3' },
                        content: '3The United States of America'
                    },
                    {
                        header: { 'text': 'France3' },
                        content: '3France'
                    }
                ],
            });
            tabObj3.appendTo('#Tab3');
        });
        afterEach((): void => {
            if (tabObj) {
                tabObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Nested tab Testing', () => {
            let rootEle: HTMLElement = document.getElementById('temTab');
            let rootCon: HTMLElement = rootEle.children[1] as HTMLElement;
            let fNested: HTMLElement = rootCon.querySelector('#Tab1') as HTMLElement;
            let fNestContent: HTMLElement = rootCon.querySelector('#Tab1').children[1] as HTMLElement;
            expect(rootCon.children[0].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].innerHTML).toBe('<div>1India</div>');
            (<HTMLElement>fNested.children[0].children[0].children[2]).click();
            expect(fNestContent.children[1].innerHTML).toBe('<div>1Australia</div>');
            expect(fNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>fNested.children[0].children[0].children[3]).click();
            expect(fNestContent.children[2].innerHTML).toBe('<div>1The United States of America</div>');
            expect(fNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>fNested.children[0].children[0].children[4]).click();
            expect(fNestContent.children[3].innerHTML).toBe('<div>1France</div>');
            expect(fNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[2].classList.contains('e-active')).toBe(false);
            let sNested: HTMLElement = rootCon.querySelector('#Tab2') as HTMLElement;
            let sNestContent: HTMLElement = rootCon.querySelector('#Tab2').children[1] as HTMLElement;
            (<HTMLElement>rootEle.children[0].children[0].children[2]).click();
            expect(rootCon.children[1].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].innerHTML).toBe('<div>2India</div>');
            (<HTMLElement>sNested.children[0].children[0].children[2]).click();
            expect(sNestContent.children[1].innerHTML).toBe('<div>2Australia</div>');
            expect(sNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>sNested.children[0].children[0].children[3]).click();
            expect(sNestContent.children[2].innerHTML).toBe('<div>2The United States of America</div>');
            expect(sNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>sNested.children[0].children[0].children[4]).click();
            expect(sNestContent.children[3].innerHTML).toBe('<div>2France</div>');
            expect(sNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[2].classList.contains('e-active')).toBe(false);
            let tNested: HTMLElement = rootCon.querySelector('#Tab3') as HTMLElement;
            let tNestContent: HTMLElement = rootCon.querySelector('#Tab3').children[1] as HTMLElement;
            (<HTMLElement>rootEle.children[0].children[0].children[3]).click();
            expect(rootCon.children[2].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].innerHTML).toBe('<div>3India</div>');
            (<HTMLElement>tNested.children[0].children[0].children[2]).click();
            expect(tNestContent.children[1].innerHTML).toBe('<div>3Australia</div>');
            expect(tNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>tNested.children[0].children[0].children[3]).click();
            expect(tNestContent.children[2].innerHTML).toBe('<div>3The United States of America</div>');
            expect(tNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>tNested.children[0].children[0].children[4]).click();
            expect(tNestContent.children[3].innerHTML).toBe('<div>3France</div>');
            expect(tNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[2].classList.contains('e-active')).toBe(false);
        });
    });
    describe('Horizontal -Nested Tab testing with headerPlacement as bottom', () => {
        let tabObj: Tab
        beforeAll((): void => {
            let css: string = ".e-hor-nav { position: absolute }";
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            let styleNode: Node = style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        });
        beforeEach((): void => {
            let rootDiv: HTMLElement = createElement('div', { id: 'temTab' });
            let header: HTMLElement = createElement('div', { className: 'e-tab-header' });
            let itemHead1: HTMLElement = createElement('div', { innerHTML: 'India' });
            let itemHead2: HTMLElement = createElement('div', { innerHTML: 'Canada' });
            let itemHead3: HTMLElement = createElement('div', { innerHTML: 'Australia' });
            let itemHead4: HTMLElement = createElement('div', { innerHTML: 'USA' });
            let content: HTMLElement = createElement('div', { className: 'e-content' });
            let contentItem1: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "India, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab1'></div>" }));
            let contentItem2: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "Canada, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab2'></div>" }));
            let contentItem3: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "Australia, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab3'></div>" }));
            let contentItem4: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "USA, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab4'></div>" }));
            content.appendChild(contentItem1);
            content.appendChild(contentItem2);
            content.appendChild(contentItem3);
            content.appendChild(contentItem4);
            header.appendChild(itemHead1);
            header.appendChild(itemHead2);
            header.appendChild(itemHead3);
            header.appendChild(itemHead4);
            rootDiv.appendChild(header);
            rootDiv.appendChild(content);
            document.body.appendChild(rootDiv);
            tabObj = new Tab({
                overflowMode: 'Popup',
                headerPlacement: 'Bottom',
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } }
            });
            tabObj.appendTo(rootDiv);
            let tabObj1: Tab = new Tab({
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India1' },
                        content: '1India'
                    },
                    {
                        header: { 'text': 'Australia1' },
                        content: '1Australia'
                    },
                    {
                        header: { 'text': 'USA1' },
                        content: '1The United States of America'
                    },
                    {
                        header: { 'text': 'France1' },
                        content: '1France'
                    }
                ],
            });
            tabObj1.appendTo('#Tab1')
            let tabObj2: Tab = new Tab({
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India2' },
                        content: '2India'
                    },
                    {
                        header: { 'text': 'Australia2' },
                        content: '2Australia'
                    },
                    {
                        header: { 'text': 'USA2' },
                        content: '2The United States of America'
                    },
                    {
                        header: { 'text': 'France2' },
                        content: '2France'
                    }
                ],
            });
            tabObj2.appendTo('#Tab2')
            let tabObj3: Tab = new Tab({
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India3' },
                        content: '3India'
                    },
                    {
                        header: { 'text': 'Australia3' },
                        content: '3Australia'
                    },
                    {
                        header: { 'text': 'USA3' },
                        content: '3The United States of America'
                    },
                    {
                        header: { 'text': 'France3' },
                        content: '3France'
                    }
                ],
            });
            tabObj3.appendTo('#Tab3');
        });
        afterEach((): void => {
            if (tabObj) {
                tabObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Nested tab Testing with headerPlacement testing', () => {
            let rootEle: HTMLElement = document.getElementById('temTab');
            let rootCon: HTMLElement = rootEle.children[0] as HTMLElement;
            let fNested: HTMLElement = rootCon.querySelector('#Tab1') as HTMLElement;
            let fNestContent: HTMLElement = rootCon.querySelector('#Tab1').children[1] as HTMLElement;
            expect(rootCon.children[0].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].innerHTML).toBe('<div>1India</div>');
            (<HTMLElement>fNested.children[0].children[0].children[2]).click();
            expect(fNestContent.children[1].innerHTML).toBe('<div>1Australia</div>');
            expect(fNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>fNested.children[0].children[0].children[3]).click();
            expect(fNestContent.children[2].innerHTML).toBe('<div>1The United States of America</div>');
            expect(fNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>fNested.children[0].children[0].children[4]).click();
            expect(fNestContent.children[3].innerHTML).toBe('<div>1France</div>');
            expect(fNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[2].classList.contains('e-active')).toBe(false);
            let sNested: HTMLElement = rootCon.querySelector('#Tab2') as HTMLElement;
            let sNestContent: HTMLElement = rootCon.querySelector('#Tab2').children[1] as HTMLElement;
            (<HTMLElement>rootEle.children[1].children[0].children[2]).click();
            expect(rootCon.children[1].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].innerHTML).toBe('<div>2India</div>');
            (<HTMLElement>sNested.children[0].children[0].children[2]).click();
            expect(sNestContent.children[1].innerHTML).toBe('<div>2Australia</div>');
            expect(sNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>sNested.children[0].children[0].children[3]).click();
            expect(sNestContent.children[2].innerHTML).toBe('<div>2The United States of America</div>');
            expect(sNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>sNested.children[0].children[0].children[4]).click();
            expect(sNestContent.children[3].innerHTML).toBe('<div>2France</div>');
            expect(sNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[2].classList.contains('e-active')).toBe(false);
            let tNested: HTMLElement = rootCon.querySelector('#Tab3') as HTMLElement;
            let tNestContent: HTMLElement = rootCon.querySelector('#Tab3').children[1] as HTMLElement;
            (<HTMLElement>rootEle.children[1].children[0].children[3]).click();
            expect(rootCon.children[2].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].innerHTML).toBe('<div>3India</div>');
            (<HTMLElement>tNested.children[0].children[0].children[2]).click();
            expect(tNestContent.children[1].innerHTML).toBe('<div>3Australia</div>');
            expect(tNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>tNested.children[0].children[0].children[3]).click();
            expect(tNestContent.children[2].innerHTML).toBe('<div>3The United States of America</div>');
            expect(tNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>tNested.children[0].children[0].children[4]).click();
            expect(tNestContent.children[3].innerHTML).toBe('<div>3France</div>');
            expect(tNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[2].classList.contains('e-active')).toBe(false);
        });
    });
    describe('Vertical Orientation Left - Nested Tab testing with headerPlacement', () => {
        let tabObj: Tab
        beforeAll((): void => {
            let css: string = ".e-hor-nav { position: absolute } .e-toolbar-items { height: 100%; } .e-toolbar-item { display: block !important; width: auto; }";
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            let styleNode: Node = style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        });
        beforeEach((done: Function): void => {
            let rootDiv: HTMLElement = createElement('div', { id: 'temTab' });
            let header: HTMLElement = createElement('div', { className: 'e-tab-header' });
            let itemHead1: HTMLElement = createElement('div', { innerHTML: 'India' });
            let itemHead2: HTMLElement = createElement('div', { innerHTML: 'Canada' });
            let itemHead3: HTMLElement = createElement('div', { innerHTML: 'Australia' });
            let itemHead4: HTMLElement = createElement('div', { innerHTML: 'USA' });
            let content: HTMLElement = createElement('div', { className: 'e-content' });
            let contentItem1: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "India, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab1'></div>" }));
            let contentItem2: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "Canada, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab2'></div>" }));
            let contentItem3: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "Australia, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab3'></div>" }));
            let contentItem4: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "USA, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab4'></div>" }));
            content.appendChild(contentItem1);
            content.appendChild(contentItem2);
            content.appendChild(contentItem3);
            content.appendChild(contentItem4);
            header.appendChild(itemHead1);
            header.appendChild(itemHead2);
            header.appendChild(itemHead3);
            header.appendChild(itemHead4);
            rootDiv.appendChild(header);
            rootDiv.appendChild(content);
            document.body.appendChild(rootDiv);
            tabObj = new Tab({
                overflowMode: 'Popup',
                headerPlacement: 'Left',
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } }
            });
            tabObj.appendTo(rootDiv);
            let tabObj1: Tab = new Tab({
                headerPlacement: 'Left',
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India1' },
                        content: '1India'
                    },
                    {
                        header: { 'text': 'Australia1' },
                        content: '1Australia'
                    },
                    {
                        header: { 'text': 'USA1' },
                        content: '1The United States of America'
                    },
                    {
                        header: { 'text': 'France1' },
                        content: '1France'
                    }
                ],
            });
            tabObj1.appendTo('#Tab1')
            let tabObj2: Tab = new Tab({
                headerPlacement: 'Left',
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India2' },
                        content: '2India'
                    },
                    {
                        header: { 'text': 'Australia2' },
                        content: '2Australia'
                    },
                    {
                        header: { 'text': 'USA2' },
                        content: '2The United States of America'
                    },
                    {
                        header: { 'text': 'France2' },
                        content: '2France'
                    }
                ],
            });
            tabObj2.appendTo('#Tab2')
            let tabObj3: Tab = new Tab({
                headerPlacement: 'Left',
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India3' },
                        content: '3India'
                    },
                    {
                        header: { 'text': 'Australia3' },
                        content: '3Australia'
                    },
                    {
                        header: { 'text': 'USA3' },
                        content: '3The United States of America'
                    },
                    {
                        header: { 'text': 'France3' },
                        content: '3France'
                    }
                ],
            });
            tabObj3.appendTo('#Tab3');
            setTimeout(() => { done(); }, 2000);
        });
        afterEach((): void => {
            if (tabObj) {
                tabObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Nested tab Testing with headerPlacement testing', () => {
            let rootEle: HTMLElement = document.getElementById('temTab');
            let rootCon: HTMLElement = rootEle.children[1] as HTMLElement;
            let fNested: HTMLElement = rootCon.querySelector('#Tab1') as HTMLElement;
            let fNestContent: HTMLElement = rootCon.querySelector('#Tab1').children[1] as HTMLElement;
            expect(rootCon.children[0].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].innerHTML).toBe('<div>1India</div>');
            (<HTMLElement>fNested.children[0].children[0].children[2]).click();
            expect(fNestContent.children[1].innerHTML).toBe('<div>1Australia</div>');
            expect(fNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>fNested.children[0].children[0].children[3]).click();
            expect(fNestContent.children[2].innerHTML).toBe('<div>1The United States of America</div>');
            expect(fNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>fNested.children[0].children[0].children[4]).click();
            expect(fNestContent.children[3].innerHTML).toBe('<div>1France</div>');
            expect(fNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[2].classList.contains('e-active')).toBe(false);
            let sNested: HTMLElement = rootCon.querySelector('#Tab2') as HTMLElement;
            let sNestContent: HTMLElement = rootCon.querySelector('#Tab2').children[1] as HTMLElement;
            (<HTMLElement>rootEle.children[0].children[0].children[2]).click();
            expect(rootCon.children[1].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].innerHTML).toBe('<div>2India</div>');
            (<HTMLElement>sNested.children[0].children[0].children[2]).click();
            expect(sNestContent.children[1].innerHTML).toBe('<div>2Australia</div>');
            expect(sNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>sNested.children[0].children[0].children[3]).click();
            expect(sNestContent.children[2].innerHTML).toBe('<div>2The United States of America</div>');
            expect(sNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>sNested.children[0].children[0].children[4]).click();
            expect(sNestContent.children[3].innerHTML).toBe('<div>2France</div>');
            expect(sNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[2].classList.contains('e-active')).toBe(false);
            let tNested: HTMLElement = rootCon.querySelector('#Tab3') as HTMLElement;
            let tNestContent: HTMLElement = rootCon.querySelector('#Tab3').children[1] as HTMLElement;
            (<HTMLElement>rootEle.children[0].children[0].children[3]).click();
            expect(rootCon.children[2].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].innerHTML).toBe('<div>3India</div>');
            (<HTMLElement>tNested.children[0].children[0].children[2]).click();
            expect(tNestContent.children[1].innerHTML).toBe('<div>3Australia</div>');
            expect(tNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>tNested.children[0].children[0].children[3]).click();
            expect(tNestContent.children[2].innerHTML).toBe('<div>3The United States of America</div>');
            expect(tNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>tNested.children[0].children[0].children[4]).click();
            expect(tNestContent.children[3].innerHTML).toBe('<div>3France</div>');
            expect(tNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[2].classList.contains('e-active')).toBe(false);
        });
    });
    describe('Vertical Orientation Right - Nested Tab testing with headerPlacement', () => {
        let tabObj: Tab
        beforeAll((): void => {
            let css: string = ".e-hor-nav { position: absolute } .e-toolbar-items { height: 100%; } .e-toolbar-item { display: block !important; width: auto; }";
            let style: HTMLStyleElement = document.createElement('style');
            style.type = 'text/css';
            style.id = 'scroll';
            let styleNode: Node = style.appendChild(document.createTextNode(css));
            document.getElementsByTagName('head')[0].appendChild(style);
        });
        beforeEach((done: Function): void => {
            let rootDiv: HTMLElement = createElement('div', { id: 'temTab' });
            let header: HTMLElement = createElement('div', { className: 'e-tab-header' });
            let itemHead1: HTMLElement = createElement('div', { innerHTML: 'India' });
            let itemHead2: HTMLElement = createElement('div', { innerHTML: 'Canada' });
            let itemHead3: HTMLElement = createElement('div', { innerHTML: 'Australia' });
            let itemHead4: HTMLElement = createElement('div', { innerHTML: 'USA' });
            let content: HTMLElement = createElement('div', { className: 'e-content' });
            let contentItem1: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "India, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab1'></div>" }));
            let contentItem2: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "Canada, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab2'></div>" }));
            let contentItem3: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "Australia, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab3'></div>" }));
            let contentItem4: HTMLElement = createElement('div').appendChild(createElement('div', { innerHTML: "USA, officially the Commonwealth of Australia, is a country comprising the mainland of the Australian continent, the island of Tasmania and numerous smaller islands. It is the world's sixth-largest country by total area. Neighboring countries include Indonesia, East Timor and Papua New Guinea to the north; the Solomon Islands, Vanuatu and New Caledonia to the north-east; and New Zealand to the south-east. <div id='Tab4'></div>" }));
            content.appendChild(contentItem1);
            content.appendChild(contentItem2);
            content.appendChild(contentItem3);
            content.appendChild(contentItem4);
            header.appendChild(itemHead1);
            header.appendChild(itemHead2);
            header.appendChild(itemHead3);
            header.appendChild(itemHead4);
            rootDiv.appendChild(header);
            rootDiv.appendChild(content);
            document.body.appendChild(rootDiv);
            tabObj = new Tab({
                overflowMode: 'Popup',
                headerPlacement: 'Right',
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } }
            });
            tabObj.appendTo(rootDiv);
            let tabObj1: Tab = new Tab({
                headerPlacement: 'Right',
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India1' },
                        content: '1India'
                    },
                    {
                        header: { 'text': 'Australia1' },
                        content: '1Australia'
                    },
                    {
                        header: { 'text': 'USA1' },
                        content: '1The United States of America'
                    },
                    {
                        header: { 'text': 'France1' },
                        content: '1France'
                    }
                ],
            });
            tabObj1.appendTo('#Tab1')
            let tabObj2: Tab = new Tab({
                headerPlacement: 'Right',
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India2' },
                        content: '2India'
                    },
                    {
                        header: { 'text': 'Australia2' },
                        content: '2Australia'
                    },
                    {
                        header: { 'text': 'USA2' },
                        content: '2The United States of America'
                    },
                    {
                        header: { 'text': 'France2' },
                        content: '2France'
                    }
                ],
            });
            tabObj2.appendTo('#Tab2')
            let tabObj3: Tab = new Tab({
                headerPlacement: 'Right',
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                items: [
                    {
                        header: { 'text': 'India3' },
                        content: '3India'
                    },
                    {
                        header: { 'text': 'Australia3' },
                        content: '3Australia'
                    },
                    {
                        header: { 'text': 'USA3' },
                        content: '3The United States of America'
                    },
                    {
                        header: { 'text': 'France3' },
                        content: '3France'
                    }
                ],
            });
            tabObj3.appendTo('#Tab3');
            setTimeout(() => { done(); }, 2000);
        });
        afterEach((): void => {
            if (tabObj) {
                tabObj.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Nested tab Testing with headerPlacement testing', () => {
            let rootEle: HTMLElement = document.getElementById('temTab');
            let rootCon: HTMLElement = rootEle.children[1] as HTMLElement;
            let fNested: HTMLElement = rootCon.querySelector('#Tab1') as HTMLElement;
            let fNestContent: HTMLElement = rootCon.querySelector('#Tab1').children[1] as HTMLElement;
            expect(rootCon.children[0].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].innerHTML).toBe('<div>1India</div>');
            (<HTMLElement>fNested.children[0].children[0].children[2]).click();
            expect(fNestContent.children[1].innerHTML).toBe('<div>1Australia</div>');
            expect(fNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>fNested.children[0].children[0].children[3]).click();
            expect(fNestContent.children[2].innerHTML).toBe('<div>1The United States of America</div>');
            expect(fNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>fNested.children[0].children[0].children[4]).click();
            expect(fNestContent.children[3].innerHTML).toBe('<div>1France</div>');
            expect(fNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(fNestContent.children[2].classList.contains('e-active')).toBe(false);
            let sNested: HTMLElement = rootCon.querySelector('#Tab2') as HTMLElement;
            let sNestContent: HTMLElement = rootCon.querySelector('#Tab2').children[1] as HTMLElement;
            (<HTMLElement>rootEle.children[0].children[0].children[2]).click();
            expect(rootCon.children[1].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].innerHTML).toBe('<div>2India</div>');
            (<HTMLElement>sNested.children[0].children[0].children[2]).click();
            expect(sNestContent.children[1].innerHTML).toBe('<div>2Australia</div>');
            expect(sNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>sNested.children[0].children[0].children[3]).click();
            expect(sNestContent.children[2].innerHTML).toBe('<div>2The United States of America</div>');
            expect(sNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>sNested.children[0].children[0].children[4]).click();
            expect(sNestContent.children[3].innerHTML).toBe('<div>2France</div>');
            expect(sNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(sNestContent.children[2].classList.contains('e-active')).toBe(false);
            let tNested: HTMLElement = rootCon.querySelector('#Tab3') as HTMLElement;
            let tNestContent: HTMLElement = rootCon.querySelector('#Tab3').children[1] as HTMLElement;
            (<HTMLElement>rootEle.children[0].children[0].children[3]).click();
            expect(rootCon.children[2].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].innerHTML).toBe('<div>3India</div>');
            (<HTMLElement>tNested.children[0].children[0].children[2]).click();
            expect(tNestContent.children[1].innerHTML).toBe('<div>3Australia</div>');
            expect(tNestContent.children[1].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[0].classList.contains('e-active')).toBe(false);
            (<HTMLElement>tNested.children[0].children[0].children[3]).click();
            expect(tNestContent.children[2].innerHTML).toBe('<div>3The United States of America</div>');
            expect(tNestContent.children[2].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[1].classList.contains('e-active')).toBe(false);
            (<HTMLElement>tNested.children[0].children[0].children[4]).click();
            expect(tNestContent.children[3].innerHTML).toBe('<div>3France</div>');
            expect(tNestContent.children[3].classList.contains('e-active')).toBe(true);
            expect(tNestContent.children[2].classList.contains('e-active')).toBe(false);
        });
    });
    describe('prevent selection in tab select while swiping', () => {
        let tab: any;
        let swipeEventArgs: any;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Swipe content selection prevention', () => {
            tab = new Tab({
                selecting: (e: any) => {
                    if (e.isSwiped) {
                        e.cancel = true;
                    }
                },
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ],
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } }
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Left',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Left',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
        });
    });
    describe('SelectedItem onPropertychange testing with navigating zeroth index', () => {
        let tab: any;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('SelectedItem onPropertychange testing', () => {
            tab = new Tab({
                selectedItem: 1,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ],
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } }
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            tab.selectedItem = 0;
            tab.dataBind();
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
        });
    });
    describe('Onproperty change with zero items to any item', () => {
        let tab: any;
        let swipeEventArgs: any;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('items onpropertychange testing with zeor item', () => {
            tab = new Tab({
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } }
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items.length).toBe(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.childElementCount).toBe(0);
            expect(isNOU(tab.tbObj)).toBe(true);
            tab.items = [
                { header: { "text": "item1" }, content: "Content1" },
                { header: { "text": "item2" }, content: "Content2" }
            ];
            tab.dataBind();
            expect(tab.items.length).toBe(2);
            expect(element.childElementCount).toBe(2);
            expect(isNOU(tab.tbObj)).toBe(false);
        });
        it('items onpropertychange testing with zeor item', () => {
            tab = new Tab({
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } }
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items.length).toBe(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.childElementCount).toBe(0);
            expect(isNOU(tab.tbObj)).toBe(true);
            tab.items = [
                { header: { "text": "item1" } },
                { header: { "text": "item2" } }
            ];
            tab.dataBind();
            expect(tab.items.length).toBe(2);
            expect(element.childElementCount).toBe(2);
            expect(element.children[1].childElementCount).toBe(1);
            expect(isNOU(tab.tbObj)).toBe(false);
        });
        it('items onpropertychange testing with selectedItem', () => {
            tab = new Tab({
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                selectedItem: 1,
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items.length).toBe(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.childElementCount).toBe(0);
            expect(isNOU(tab.tbObj)).toBe(true);
            tab.items = [
                { header: { "text": "item1" } },
                { header: { "text": "item2" } }
            ];
            tab.dataBind();
            expect(tab.items.length).toBe(2);
            expect(element.childElementCount).toBe(2);
            expect(element.children[1].childElementCount).toBe(1);
            expect(element.children[1].querySelectorAll('.e-active').length).toBe(1);
            expect(isNOU(tab.tbObj)).toBe(false);
            (<HTMLElement>element.children[0].children[0].children[0]).click();
            expect(element.children[1].querySelectorAll('.e-active').length).toBe(1);
        });
        it('items onpropertychange testing with selectedItem', () => {
            tab = new Tab({
                animation: { next: { effect: 'None' }, previous: { effect: 'None' } },
                selectedItem: 1,
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items.length).toBe(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.childElementCount).toBe(0);
            expect(isNOU(tab.tbObj)).toBe(true);
            tab.items = [
                { header: { "text": "item1" }, content: "Content1" },
                { header: { "text": "item2" }, content: "Content2" },
                { header: { "text": "item3" }, content: "Content3" }
            ];
            tab.dataBind();
            expect(element.childElementCount).toBe(2);
            expect(element.children[1].childElementCount).toBe(1);
            expect(element.children[1].querySelectorAll('.e-active').length).toBe(1);
            expect(isNOU(tab.tbObj)).toBe(false);
            (<HTMLElement>element.children[0].children[0].children[0]).click();
            expect(element.children[1].querySelectorAll('.e-active').length).toBe(1);
            (<HTMLElement>element.children[0].children[0].children[1]).click();
            expect(element.children[1].querySelectorAll('.e-active').length).toBe(1);
        });
    });
    describe('Disable functionality testing', () => {
        let tab: any;
        let toolbar: DomElements;
        let keyEventArgs: any;
        let toolbarObj: any;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('items onpropertychange testing with zero item', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "#templateId" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            tab.enableTab(1, false);
            tab.disable(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            toolbar = <DomElements>element.querySelector('.e-tab-header');
            let trgEle: HTMLElement = <HTMLElement>element.querySelector('.e-toolbar-item .e-tab-wrap');
            toolbarObj = <Toolbar>toolbar.ej2_instances[0];
            expect(element.classList.contains('e-disable')).toBe(true);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element,
            };
            tab.keyHandler(keyEventArgs);
            trgEle.focus();
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle1, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: actEle1,
            };
            toolbarObj.keyActionHandler(keyEventArgs);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'moveRight',
                target: actEle1,
            };
            tab.keyHandler(keyEventArgs);
            let actEle2: HTMLElement = <HTMLElement>document.activeElement;
            expect(closest(actEle2, '.e-toolbar-item').id).toEqual('e-item' + tab.tabId + '_0');
            tab.disable(false);
            keyEventArgs = {
                preventDefault: function () { },
                action: 'enter',
                target: actEle2,
            };
            tab.keyHandler(keyEventArgs);
            let actEle3: HTMLElement = <HTMLElement>document.activeElement;
            expect(element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-disable')).toEqual(true);
        });
    });
    describe('Content template property testing', () => {
        let tab: any;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            let el2: HTMLElement = createElement('div', { id: 'templateId' });
            el2.innerHTML = "<span class='content-template'>Content Template</span>";
            document.body.appendChild(el2);
            let el3: HTMLElement = createElement('div', { className: 'templateId' });
            el3.innerHTML = "<span class='content-template'>Content Template</span>";
            document.body.appendChild(el3);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('ID based content template testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "#templateId" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0 #templateId')).not.toEqual(undefined);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0 #templateId .content-template').innerHTML).toEqual('Content Template');
        });
        it('Class based content template testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: ".templateId" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0 .templateId')).not.toEqual(undefined);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0 .templateId .content-template').innerHTML).toEqual('Content Template');
        });
        it('heightAdjustMode with class based content template testing', () => {
            tab = new Tab({
                heightAdjustMode: 'Auto',
                items: [
                    { header: { "text": "item1" }, content: ".templateId" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0 .templateId')).not.toEqual(undefined);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0 .templateId .content-template').innerHTML).toEqual('Content Template');
        });
        it('Unknown class based content template testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: ".templateIdui" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0').innerHTML).toEqual('<div>.templateIdui</div>');
        });
        it('HTMLElement with ID based content template testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: document.getElementById('templateId') },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0 #templateId')).not.toEqual(undefined);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0 #templateId .content-template').innerHTML).toEqual('Content Template');
        });
        it('HTMLElement with class based content template testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: <HTMLElement>document.getElementsByClassName('templateId')[0] },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0 .templateId')).not.toEqual(undefined);
            expect(element.querySelector('.e-content #e-content' + tab.tabId + '_0 .templateId .content-template').innerHTML).toEqual('Content Template');
        });
    });
    describe('Onproperty change testing for items', () => {
        let tab: any;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            let test1: HTMLElement = createElement('div', { id: 'test1' });
            let test2: HTMLElement = createElement('div', { id: 'test2' });
            document.body.appendChild(ele);
            document.body.appendChild(test1);
            document.body.appendChild(test2);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items object change', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content1", cssClass: "tabCssClass1" },
                    { header: { "text": "item2", "iconCss": "e-icon", "iconPosition": "left" }, content: "Content2", cssClass: "tabCssClass2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items[0].content).toEqual('Content1');
            expect(tab.items[0].cssClass).toEqual('tabCssClass1');
            expect(tab.items[0].disabled).toEqual(false);
            expect(tab.items[0].header instanceof Object).toEqual(true);
            expect(tab.items[0].header.text).toEqual('item1');
            expect(tab.items[0].header.iconCss).toEqual('e-icon');
            expect(tab.items[0].header.iconPosition).toEqual('right');
            expect(tab.items[1].content).toEqual('Content2');
            expect(tab.items[1].cssClass).toEqual('tabCssClass2');
            expect(tab.items[1].disabled).toEqual(false);
            expect(tab.items[1].header instanceof Object).toEqual(true);
            expect(tab.items[1].header.text).toEqual('item2');
            expect(tab.items[1].header.iconCss).toEqual('e-icon');
            expect(tab.items[1].header.iconPosition).toEqual('left');
            tab.items = [
                { header: { "text": "item2", "iconCss": "e-icon", "iconPosition": "left" }, content: "Content2", cssClass: "tabCssClass2", disabled: false },
                { header: { "text": "item1", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content1", cssClass: "tabCssClass1", disabled: true }
            ];
            tab.dataBind();
            expect(tab.items[0].content).toEqual('Content2');
            expect(tab.items[0].cssClass).toEqual('tabCssClass2');
            expect(tab.items[0].disabled).toEqual(false);
            expect(tab.items[0].header instanceof Object).toEqual(true);
            expect(tab.items[0].header.text).toEqual('item2');
            expect(tab.items[0].header.iconCss).toEqual('e-icon');
            expect(tab.items[0].header.iconPosition).toEqual('left');
            expect(tab.items[1].content).toEqual('Content1');
            expect(tab.items[1].disabled).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-disable')).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-overlay')).toEqual(true);
            expect(tab.items[1].cssClass).toEqual('tabCssClass1');
            expect(tab.items[1].header instanceof Object).toEqual(true);
            expect(tab.items[1].header.text).toEqual('item1');
            expect(tab.items[1].header.iconCss).toEqual('e-icon');
            expect(tab.items[1].header.iconPosition).toEqual('right');
        });
        it('Items - content property change testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content1", cssClass: "tabCssClass1" },
                    { header: { "text": "item2", "iconCss": "e-icon", "iconPosition": "left" }, content: "Content2", cssClass: "tabCssClass2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items[0].content).toEqual('Content1');
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_0').innerText.trim()).toEqual('Content1');
            tab.items[0].content = 'New Content 1';
            tab.dataBind();
            expect(tab.items[0].content).toEqual('New Content 1');
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_0').innerText.trim()).toEqual('New Content 1');
            expect(tab.items[1].content).toEqual('Content2');
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_1')).toEqual(null);
            tab.items[1].content = 'New Content 2';
            tab.dataBind();
            expect(tab.items[1].content).toEqual('New Content 2');
            tab.select(1);
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_1')).not.toEqual(null);
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_1').innerText.trim()).toEqual('New Content 2');
            tab.element.querySelector('#e-content' + tab.tabId + '_0').classList.remove('e-active');
            tab.items[0].content = 'New Content 11';
            tab.dataBind();
            expect(tab.items[0].content).toEqual('New Content 11');
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_1')).not.toEqual(null);
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_1').innerText.trim()).toEqual('New Content 2');
            tab.select(0);
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_0')).not.toEqual(null);
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_0').innerText.trim()).toEqual('New Content 11');
        });
        it('Items - cssClass property change testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content1", cssClass: "tabCssClass1" },
                    { header: { "text": "item2", "iconCss": "e-icon", "iconPosition": "left" }, content: "Content2", cssClass: "tabCssClass2" },
                    { content: "Content3", cssClass: "tabCssClass3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items[0].cssClass).toEqual('tabCssClass1');
            expect(tab.items[1].cssClass).toEqual('tabCssClass2');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('tabCssClass1')).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('tabCssClass2')).toEqual(true);
            tab.items[0].cssClass = 'test1';
            tab.dataBind();
            expect(tab.items[0].cssClass).toEqual('test1');
            expect(tab.items[1].cssClass).toEqual('tabCssClass2');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('tabCssClass1')).not.toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('test1')).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('tabCssClass2')).toEqual(true);
            tab.items[1].cssClass = 'test2';
            tab.dataBind();
            expect(tab.items[0].cssClass).toEqual('test1');
            expect(tab.items[1].cssClass).toEqual('test2');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('tabCssClass1')).not.toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('test1')).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('tabCssClass2')).not.toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('test2')).toEqual(true);
            tab.dataBind();
        });
        it('Items - disabled property change testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content1", cssClass: "tabCssClass1", disabled: true },
                    { header: { "text": "item2", "iconCss": "e-icon", "iconPosition": "left" }, content: "Content2", cssClass: "tabCssClass2", disabled: false },
                    { header: { "text": "item3", "iconCss": "e-icon", "iconPosition": "left" }, content: "Content3", cssClass: "tabCssClass2", disabled: true }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items[0].disabled).toEqual(true);
            expect(tab.items[1].disabled).toEqual(false);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-disable')).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-overlay')).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-disable')).toEqual(false);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-overlay')).toEqual(false);
            tab.items[0].disabled = false;
            tab.dataBind();
            expect(tab.items[0].disabled).toEqual(false);
            expect(tab.items[1].disabled).toEqual(false);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-disable')).toEqual(false);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-overlay')).toEqual(false);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-disable')).toEqual(false);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-overlay')).toEqual(false);
            tab.items[1].disabled = true;
            tab.dataBind();
            tab.select(1);
            expect(tab.items[0].disabled).toEqual(false);
            expect(tab.items[1].disabled).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-disable')).toEqual(false);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-overlay')).toEqual(false);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-disable')).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-overlay')).toEqual(true);
        });
        it('Items - header each single property testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", "iconCss": "e-icon", "iconPosition": "right" }, content: "Content1" },
                    { header: { "text": "item2", "iconCss": "e-icon", "iconPosition": "left" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.items[0].header instanceof Object).toEqual(true);
            expect(tab.items[0].header.text).toEqual('item1');
            expect(tab.items[0].header.iconCss).toEqual('e-icon');
            expect(tab.items[0].header.iconPosition).toEqual('right');
            expect(tab.items[1].header instanceof Object).toEqual(true);
            expect(tab.items[1].header.text).toEqual('item2');
            expect(tab.items[1].header.iconCss).toEqual('e-icon');
            expect(tab.items[1].header.iconPosition).toEqual('left');
            expect(tab.element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.items[0].header.text = 'headerText1';
            tab.dataBind();
            expect(tab.items[0].header.text).toEqual('headerText1');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0 .e-tab-text').innerText).toEqual('headerText1');
            tab.items[0].header.iconCss = 'e-new-icon';
            tab.dataBind();
            expect(tab.items[0].header.iconCss).toEqual('e-new-icon');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0 .e-tab-icon').classList.contains('e-new-icon')).toEqual(true);
            tab.items[0].header.iconPosition = 'left';
            tab.dataBind();
            expect(tab.items[0].header.iconPosition).toEqual('left');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-ileft')).toEqual(true);
            tab.items[1].header.text = 'headerText2';
            tab.dataBind();
            expect(tab.items[1].header.text).toEqual('headerText2');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1 .e-tab-text').innerText).toEqual('headerText2');
            tab.items[1].header.iconCss = 'e-new-icons';
            tab.dataBind();
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-ileft')).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1 .e-tab-icon').classList.contains('e-new-icons')).toEqual(true);
            tab.items[1].header.iconPosition = 'right';
            tab.dataBind();
            expect(tab.items[1].header.iconPosition).toEqual('right');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-iright')).toEqual(true);
            let dataObj: Object = { "text": "item11", "iconCss": "e-icons", "iconPosition": "left" };
            tab.items[0].header = dataObj;
            tab.dataBind();
            expect(tab.items[0].header instanceof Object).toEqual(true);
            expect(tab.items[0].header.text).toEqual('item11');
            expect(tab.items[0].header.iconCss).toEqual('e-icons');
            expect(tab.items[0].header.iconPosition).toEqual('left');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0 .e-tab-text').innerText).toEqual('item11');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0 .e-tab-icon').classList.contains('e-icons')).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-ileft')).toEqual(true);
            tab.items[0].header = { "text": "item22", "iconCss": "e-iconset", "iconPosition": "right" };
            tab.dataBind();
            expect(tab.items[0].header instanceof Object).toEqual(true);
            expect(tab.items[0].header.text).toEqual('item22');
            expect(tab.items[0].header.iconCss).toEqual('e-iconset');
            expect(tab.items[0].header.iconPosition).toEqual('right');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0 .e-tab-text').innerText).toEqual('item22');
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0 .e-tab-icon').classList.contains('e-iconset')).toEqual(true);
            expect(tab.element.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-iright')).toEqual(true);
        });
        it('Items - dynamic add content using id', function () {
            let test1: HTMLElement = <HTMLElement>document.querySelector('#test1');
            let test2: HTMLElement = <HTMLElement>document.querySelector('#test2');
            tab = new Tab({
                items: [
                    { header: { "text": "Twitter", "iconCss": "e-twitter" }, content: test1 }
                ]
            });
            test1.innerHTML = '<div>Content changed</div>';
            test2.innerHTML = '<div>Content replaced</div>';
            tab.appendTo('#ej2Tab');
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_0').innerText.trim()).toEqual('Content changed');
            tab.items[0].content = "";
            tab.dataBind();
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_0').innerText.trim()).toEqual('');
            tab.items[0].content = "#test2";
            tab.dataBind();
            expect(tab.element.querySelector('#e-content' + tab.tabId + '_0').innerText.trim()).toEqual('Content replaced');
        });
    });

    describe('Content Event Unbinding issue fix while passing element', () => {
        let tab: Tab;
        let btnCLick: number = 0;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            let eleBtn: HTMLElement = createElement('button', { id: 'ejbutton' });
            document.body.appendChild(eleBtn);
            eleBtn.onclick = (e: Event) => {
                ++btnCLick;
            }
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Content Event unBinding testing', () => {
            let btnEle = document.getElementById('ejbutton')
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: btnEle },
                    { header: { "text": "item2" }, content: "Content2", }
                ]
            });
            tab.appendTo('#ej2Tab');
            (<HTMLElement>tab.element.querySelector('#ejbutton')).click();
            expect(btnCLick).toBe(1);
        });
        it('Header element duplicate testing', () => {
            let btnEle = document.getElementById('ejbutton')
            tab = new Tab({
                items: [
                    { header: { "text": btnEle }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2", }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(document.querySelectorAll('#ejbutton').length).toBe(1);
        });
    });

    describe('Hide method with onProperty change update combination', () => {
        let tab: Tab;
        let eventCount: number = 0;
        function onAdding() {
            ++eventCount;
        }
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Updating in hidden item', () => {
            tab = new Tab({
                added: onAdding,
                adding: onAdding,
                removed: onAdding,
                removing: onAdding,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.hideTab(1);
            expect(element.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-hidden")).toBe(true);
            expect(element.querySelectorAll(".e-toolbar-item")[1].querySelector(".e-tab-text").innerHTML).toBe("item2");
            tab.items[1].header.text = "Item3";
            tab.dataBind();
            expect(element.querySelectorAll(".e-toolbar-item")[1].classList.contains("e-hidden")).toBe(true);
            expect(element.querySelectorAll(".e-toolbar-item")[1].querySelector(".e-tab-text").innerHTML).toBe("Item3");
            expect(eventCount).toBe(0);
        });
    });

    describe('Selecting event - Ensure selecting index and selecting item arguments added', () => {
        let tab: Tab;
        let i: number = 0;
        let j: HTMLElement;
        let k: HTMLElement;
        function selectEventFn(obj: SelectingEventArgs): any {
            i = obj.selectingIndex;
            j = obj.selectingItem;
            k = obj.selectingContent;
        }
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - selecting', () => {
            tab = new Tab({
                selecting: selectEventFn,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(0);
            expect(i).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[0] as HTMLElement).toEqual(j);
            expect(element.querySelector('.e-content').children[0]).toEqual(k);
            tab.select(1);
            expect(i).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items .e-toolbar-item')[1] as HTMLElement).toEqual(j);
            expect(k).toEqual(null);
            tab.select(1);
            expect(element.querySelector('.e-content').children[1]).toEqual(k);
            tab.select(0);
            expect(element.querySelector('.e-content').children[0]).toEqual(k);
        });
    });
    describe('Hidden tab with select method arguments testing', () => {
        let tab: any;
        let prevIndex = 0;
        let swipeEventArgs: any;
        function selected(e: any) {
            prevIndex = e.previousIndex;
        }
        beforeAll((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                selected: selected,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" },
                    { header: { "text": "item5" }, content: "Content5" },
                    { header: { "text": "item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
        });
        afterAll((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Active item 0 with Left direction swipe testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            tab.hideTab(1);
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Left',
                originalEvent: { stopPropagation: function () { } },
            };
            tab.swipeHandler(swipeEventArgs);
            expect(prevIndex).toEqual(0);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
        });
        it('Active item 2 with Right direction swipe testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Right',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            expect(prevIndex).toEqual(2);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(false);
        });
    });
    describe('Active tab to hideTab method with next tab selection testing', () => {
        let tab: any;
        beforeAll((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" },
                    { header: { "text": "item5" }, content: "Content5" },
                    { header: { "text": "item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
        });
        afterAll((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Active item 0 with hideTab testing', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            tab.hideTab(0, true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            tab.hideTab(0, false);
        });
        it('Last item active with hideTab testing', () => {
            tab.select(5);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-active')).toEqual(true);
            tab.hideTab(5, true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_4').classList.contains('e-active')).toEqual(true);
            tab.hideTab(5, false);
        });
        it('Last item active with 0th item hidden to hideTab testing', () => {
            tab.hideTab(4, true);
            tab.select(5);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-active')).toEqual(true);
            tab.hideTab(5);
            expect(ele.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_4').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_4').classList.contains('e-hidden')).toEqual(true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_3').classList.contains('e-active')).toEqual(true);
        });
    });
    describe('Item hidden with swipe event testing', () => {
        let tab: any;
        let swipeEventArgs: any;
        beforeAll((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" },
                    { header: { "text": "item5" }, content: "Content5" },
                    { header: { "text": "item6" }, content: "Content6" }
                ]
            });
            tab.appendTo('#ej2Tab');
        });
        afterAll((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Active item 0 with Right direction swipe testing', () => {
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Right',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
        });
        it('Active item 1 with Right direction swipe testing', () => {
            tab.select(1);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Right',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
        });
        it('Active item 2 and 1st item as hidden with Right direction swipe testing', () => {
            tab.hideTab(1, true);
            tab.select(2);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-hidden')).toEqual(true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Right',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-hidden')).toEqual(true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(false);
            tab.hideTab(1, false);
        });
        it('Active item 0 with Left direction swipe testing', () => {
            tab.select(0);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Left',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(true);
        });
        it('Last item active with Left direction swipe testing', () => {
            tab.select(5);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-active')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Left',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-active')).toEqual(true);
        });
        it('0th item active and 1st item hidden with swipe left testing', () => {
            tab.hideTab(1, true);
            tab.select(0);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Left',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-hidden')).toEqual(true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_1').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_2').classList.contains('e-active')).toEqual(true);
            tab.hideTab(1, false);
        });
        it('4th item active and 5th item hidden with swipe left testing', () => {
            tab.hideTab(5, true);
            tab.select(4);
            let ele: HTMLElement = document.getElementById('ej2Tab');
            expect(ele.querySelector('#e-item' + tab.tabId + '_4').classList.contains('e-active')).toEqual(true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-hidden')).toEqual(true);
            swipeEventArgs = {
                preventDefault: function () { },
                swipeDirection: 'Left',
                originalEvent: {
                    changedTouches: {},
                    stopPropagation: function () { }
                }
            };
            tab.swipeHandler(swipeEventArgs);
            expect(ele.querySelector('#e-item' + tab.tabId + '_0').classList.contains('e-active')).toEqual(false);
            expect(ele.querySelector('#e-item' + tab.tabId + '_4').classList.contains('e-active')).toEqual(true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-hidden')).toEqual(true);
            expect(ele.querySelector('#e-item' + tab.tabId + '_5').classList.contains('e-active')).toEqual(false);
            tab.hideTab(5, false);
        });
    });
    describe('Header field value empty with addTab method testing', () => {
        let tab: Tab;
        let newItems: object[];
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            newItems = [
                { header: {}, content: "sample content" },
                { header: { "text": "" }, content: "sample content" },
                { header: { "text": "", "iconCss": "icon" }, content: 'samle content' },
                { header: { "text": "", "iconCss": "" }, content: 'sample content' }
            ];
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Empty header with addTab method testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab([newItems[0]], 0);
            expect(element.children.length).toEqual(2);
        });
        it('Empty header Text with addTab method testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab([newItems[1]], 0);
            expect(element.children.length).toEqual(2);
        });
        it('Empty header Text & headerIcon with addTab method testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab([newItems[2]], 0);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(3);
        });
        it('Empty header Text & Empty headerIcon with addTab method testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item3" }, content: "Content3" },
                    { header: { "text": "item4" }, content: "Content4" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab([newItems[3]], 0);
            expect(element.children.length).toEqual(2);
        });
    });
    describe('Header field value empty with onPropertyChanged value testing', () => {
        let tab: Tab;
        let items: any;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            items = [
                { header: { "text": "sample1" }, content: "sample content" },
                { header: { "text": "", "iconCss": "icon" }, content: "sample content" },
                { header: { "text": "sample2", "iconCss": "icon" }, content: "sample content" }
            ];
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('onPropertyChanged - empty header testing', () => {
            tab = new Tab({
                items: items
            });
            tab.appendTo('#ej2Tab');
            tab.items[0].header.text = "";
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('onPropertyChanged -empty icon testing', () => {
            tab = new Tab({
                items: items
            });
            tab.appendTo('#ej2Tab');
            tab.items[1].header.iconCss = "";
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
        });
        it('onPropertyChanged - empty header with icon testing', () => {
            tab = new Tab({
                items: items
            });
            tab.appendTo('#ej2Tab');
            tab.items[0].header.text = "sample3";
            tab.dataBind();
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(tab.items[0].header.text).toEqual('sample3');
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(3);
        });
    });

    describe('Focus should be removed for initial active tab content', () => {
        let tab1: Tab;
        let tab2: Tab;
        let items1: any;
        let items2: any;
        beforeEach((): void => {
            let styleTag: any = document.createElement('style');
            let styles: string = '#Tab2 { margin-top: 2000px; } ';
            styleTag.innerHTML = styles;
            document.body.appendChild(styleTag);
            tab1 = undefined;
            let ele: HTMLElement = createElement('div', { id: 'Tab1' });
            document.body.appendChild(ele);
            tab2 = undefined;
            let ele2: HTMLElement = createElement('div', { id: 'Tab2' });
            document.body.appendChild(ele2);
            items1 = [
                { header: { "text": "item1" }, content: "Content1" },
                { header: { "text": "item2" }, content: "Content2" },
                { header: { "text": "item3" }, content: "Content3" }
            ];
            items2 = [
                { header: { "text": "item1" }, content: "Content1" },
                { header: { "text": "item2" }, content: "Content2" },
                { header: { "text": "item3" }, content: "Content3" }
            ];
        });
        afterEach((): void => {
            if (tab1) {
                tab1.destroy();
            }
            if (tab2) {
                tab2.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Ininitial tab rendering testing', () => {
            tab1 = new Tab({
                items: items1
            });
            tab1.appendTo('#Tab1');
            tab2 = new Tab({
                items: items2
            });
            tab2.appendTo('#Tab2');
            let actEle1: HTMLElement = <HTMLElement>document.activeElement;
            expect(actEle1).toBe(document.body);
            expect(document.getElementsByTagName('html')[0].scrollTop).toEqual(0);
        });
    });

    describe('Selecting event - Ensure selecting item argument cancel added', () => {
        let tab: Tab;
        let i: boolean;
        function selectEventFn(obj: SelectingEventArgs): any {
            i = obj.cancel;
        }
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - selecting', () => {
            tab = new Tab({
                selecting: selectEventFn,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            tab.select(0);
            expect(i).toEqual(false);
        });
    });

    describe('Tab Header template', () => {
        let tab: Tab;
        let i: boolean;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Rendering testing', () => {
            tab = new Tab({
                items: [
                    { headerTemplate: "item1", content: "Content1" },
                    { headerTemplate: "item2", content: "Content2" },
                    { headerTemplate: "item3", content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll(".e-toolbar-item")[0].querySelector(".e-tab-text").innerHTML).toBe("item1");
            tab.items[0].headerTemplate = 'headerText1';
            tab.dataBind();
            expect(element.querySelectorAll(".e-toolbar-item")[0].querySelector(".e-tab-text").innerHTML).toBe("headerText1");
            tab.addTab([{ headerTemplate: "Newitem1", content: "NewContent1" }], 0);
            expect(element.querySelectorAll(".e-toolbar-item")[0].querySelector(".e-tab-text").innerHTML).toBe("Newitem1");
        });
    });

    describe('refresh currentTab function calling is template is FALSE', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - headerPlacement checking', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(tab.headerPlacement).toEqual('Top');
            expect(tab.isStringTemplate).toEqual(false);
            tab.refreshActiveTab();
            let ele: any = (tab as any).hdrEle.querySelector('.e-toolbar-item.e-active').children[0];
            let cont: any = (tab as any).content.querySelector('.e-active').children[0];
            detach(ele);
            detach(cont);
            expect((tab as any).hdrEle.querySelector('.e-toolbar-item.e-active').childElementCount).toEqual(0);
            expect((tab as any).content.querySelector('.e-active').childElementCount).toEqual(0);
            let elem: HTMLElement = createElement('div', { id: 'e-tab-text' });
            elem.setAttribute('role', 'presentation');
            elem.innerHTML = 'item1';
            let elemSpan: HTMLElement = createElement('span');
            elemSpan.setAttribute('title', 'Close');
            let mainElem: HTMLElement = createElement('div', { id: 'e-text-wrap' });
            mainElem.appendChild(elem);
            mainElem.appendChild(elemSpan);
            let headerEle: HTMLElement = createElement('div', { id: 'e-tab-wrap' });
            headerEle.setAttribute('tabindex', '-1');
            headerEle.appendChild(mainElem);
            (tab as any).hdrEle.querySelector('.e-toolbar-item.e-active').appendChild(headerEle);
            let subContent: HTMLElement = createElement('div');
            subContent.innerHTML = 'content';
            (tab as any).content.querySelector('.e-active').appendChild(subContent);
            expect((tab as any).hdrEle.querySelector('.e-toolbar-item.e-active').childElementCount).toEqual(1);
            expect((tab as any).content.querySelector('.e-active').childElementCount).toEqual(1);
        });
    });

    describe('Tab direct child element testing', () => {
        let tab: Tab;
        let ele: HTMLElement;
        beforeEach((): void => {
            tab = undefined;
            ele = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items based rendering - Child element checking', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.children.item(1).classList.contains('e-content')).toEqual(true);
        });
        it('Template based rendering - Child element checking', () => {
            ele.innerHTML = '<div class="e-tab-header"> </div> <div class="e-content"></div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
        });
        it('Items and Template combined input based control rendering test', () => {
            ele.innerHTML = '<div class="e-tab-header"> <div> item1 </div> </div> <div class="e-content">  <div> <div> content1 </div> </div> </div>';
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.length).toEqual(2);
            expect(element.classList.contains('e-template')).toEqual(true);
            tab.refreshActiveTab();
            let eles: any = (tab as any).hdrEle.querySelector('.e-toolbar-item.e-active').children[0];
            let cont: any = (tab as any).content.querySelector('.e-active').children[0];
            detach(eles);
            detach(cont);
            expect((tab as any).hdrEle.querySelector('.e-toolbar-item.e-active').childElementCount).toEqual(0);
            expect((tab as any).content.querySelector('.e-active').childElementCount).toEqual(0);
            let elem: HTMLElement = createElement('div', { id: 'e-tab-text' });
            elem.setAttribute('role', 'presentation');
            elem.innerHTML = 'item1';
            let elemSpan: HTMLElement = createElement('span');
            elemSpan.setAttribute('title', 'Close');
            let mainElem: HTMLElement = createElement('div', { id: 'e-text-wrap' });
            mainElem.appendChild(elem);
            mainElem.appendChild(elemSpan);
            let headerEle: HTMLElement = createElement('div', { id: 'e-tab-wrap' });
            headerEle.setAttribute('tabindex', '-1');
            headerEle.appendChild(mainElem);
            (tab as any).hdrEle.querySelector('.e-toolbar-item.e-active').appendChild(headerEle);
            let subContent: HTMLElement = createElement('div');
            subContent.innerHTML = 'content';
            (tab as any).content.querySelector('.e-active').appendChild(subContent);
            expect((tab as any).hdrEle.querySelector('.e-toolbar-item.e-active').childElementCount).toEqual(1);
            expect((tab as any).content.querySelector('.e-active').childElementCount).toEqual(1);
        });
    });

    describe('EJ2-52052 - Each tab items contains all tab items content issue checking', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });

        it('Tab items content class checking', () => {
            let ele: HTMLElement = document.getElementById('ej2Tab');
            ele.innerHTML = `<div class="e-tab-header"><div><span id="tab-header-1">Tab 1</span></div><div><span id="tab-header-2">Tab 2</span></div></div>
            <div class="e-content"><div class="tab-content-1">Content 1</div><div class="tab-content-2">Content 2</div></div>`;
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            let content: HTMLElement = tab.element.querySelector('.e-content');
            let items: NodeListOf<Element> = content.querySelectorAll('.e-item');
            expect(items.length).toEqual(2);
        });
    });

    describe('EJ2-50535 - Script error from the EJ2 tab component', () => {
        let tab: Tab;
        let tbItems: object[] = [
            { header: { "text": "item3" }, content: "Content3" },
            { header: { "text": "item4" }, content: "Content4" }
        ];
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - header checking', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            const newItems: object[] = [
                { header: { "text": "item2" }, content: "" }
            ];
            tab.addTab(newItems, 0);
            expect(element.querySelectorAll(".e-toolbar-item")[0].querySelector(".e-tab-text").innerHTML).toBe("item2");
            expect(element.querySelectorAll(".e-toolbar-item")[1].querySelector(".e-tab-text").innerHTML).toBe("item1");
            tab.items[1].header.text = 'NewItem1';
            tab.dataBind();
            expect(element.querySelectorAll(".e-toolbar-item")[0].querySelector(".e-tab-text").innerHTML).toBe("item2");
            expect(element.querySelectorAll(".e-toolbar-item")[1].querySelector(".e-tab-text").innerHTML).toBe("NewItem1");
            tab.addTab(tbItems, 1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(4);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_2');
            expect(element.querySelectorAll('.e-toolbar-item').item(2).id).toEqual('e-item' + tab.tabId + '_3');
            expect(element.querySelectorAll('.e-toolbar-item').item(3).id).toEqual('e-item' + tab.tabId + '_0');
        });
    });

    describe('EJ2-52472 - Tab visible property not working on initial load', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - visible property checking', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1", "iconCss": "icon" }, content: "Content1" },
                    { header: { "text": "item2", "iconCss": "icon" }, content: "Content2", visible: false }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.children.item(0).classList.contains('e-tab-header')).toEqual(true);
            expect(element.querySelectorAll(".e-toolbar-item")[0].querySelector(".e-tab-text").innerHTML).toBe("item1");
            expect(element.querySelectorAll(".e-toolbar-item")[1].querySelector(".e-tab-text").innerHTML).toBe("item2");
            expect(tab.items[0].header.iconCss).toEqual('icon');
            expect(tab.items[1].header.iconCss).toEqual('icon');
            expect(tab.element.querySelectorAll('.e-toolbar-item')[0].className).toBe('e-toolbar-item e-ileft e-template e-active');
            expect(tab.element.querySelectorAll('.e-toolbar-item')[1].className).toBe('e-toolbar-item e-hidden e-ileft e-template');
        });
    });

    describe('allowDragandDrop property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('allowDragAndDrop property with default value testing', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            }, '#ej2Tab');
            expect(tab.allowDragAndDrop).toBe(false);
        });
        it('allowDragAndDrop property testing', () => {
            tab = new Tab({
                allowDragAndDrop: true,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(3);
            expect(element.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-draggable')).toBe(true);
            expect(element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-draggable')).toBe(true);
            expect(element.querySelectorAll('.e-toolbar-item')[2].classList.contains('e-draggable')).toBe(true);
        });
        it('Disabled property with drag and drop', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            }, '#ej2Tab');
            tab.enableTab(1, false);
            expect((tab.element.querySelectorAll('.e-toolbar-item')[1]).classList.contains('e-draggable')).toBe(false);
        });
        it('Allow drag and drop testing with empty items', () => {
            tab = new Tab({
                items: [],
                allowDragAndDrop: true
            });
            tab.appendTo('#ej2Tab');
            const element: HTMLElement = document.getElementById('ej2Tab');
            tab.enableTab(1, false);
            expect(element.children.length).toEqual(0);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(0);
            expect(element.querySelectorAll('.e-content').length).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(0);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(0);
            expect(element.querySelectorAll('.e-content > .e-item').length).toEqual(0);
            const newItems: Object[] = [
                { header: { 'text': 'item1' }, content: 'Content1' },
                { header: { 'text': 'item2' }, content: 'Content2' }
            ];
            tab.addTab(newItems, 0);
            expect(element.children.length).toEqual(2);
            expect(element.querySelectorAll('.e-tab-header').length).toEqual(1);
            expect(element.querySelectorAll('.e-content').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-items').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            expect(element.querySelectorAll('.e-content > .e-item').length).toEqual(1);
            expect(element.querySelectorAll('.e-toolbar-item').item(0).id).toEqual('e-item' + tab.tabId + '_0');
            expect(element.querySelectorAll('.e-toolbar-item').item(1).id).toEqual('e-item' + tab.tabId + '_1');
            expect(element.querySelectorAll('.e-toolbar-item').item(0).classList.contains('e-active')).toEqual(true);
            expect(element.querySelectorAll('.e-content > .e-item.e-active').length).toEqual(1);
            expect(element.querySelector('.e-content > .e-item.e-active').innerHTML).toEqual('<div>Content1</div>');
            expect(element.querySelectorAll('.e-toolbar-item')[0].classList.contains('e-draggable')).toBe(true);
            expect(element.querySelectorAll('.e-toolbar-item')[1].classList.contains('e-draggable')).toBe(true);
        });
    });

    describe('reorderActiveTab property testing', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Items - Default model value', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.reorderActiveTab).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-tab-header').classList.contains('e-reorder-active-item')).toEqual(false);
        });
        it('Items - reorderActiveTab at initial rendering', () => {
            tab = new Tab({
                reorderActiveTab: false,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.reorderActiveTab).toEqual(false);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-tab-header').classList.contains('e-reorder-active-item')).toEqual(true);
        });
        it('Items - onPropertyChanged with reorderActiveTab', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" }
                ]
            });
            tab.appendTo('#ej2Tab');
            expect(tab.reorderActiveTab).toEqual(true);
            let element: HTMLElement = document.getElementById('ej2Tab');
            expect(element.querySelector('.e-tab-header').classList.contains('e-reorder-active-item')).toEqual(false);
            tab.reorderActiveTab = false;
            tab.dataBind();
            expect(tab.reorderActiveTab).toEqual(false);
            expect(element.querySelector('.e-tab-header').classList.contains('e-reorder-active-item')).toEqual(true);
            tab.reorderActiveTab = true;
            tab.dataBind();
            expect(tab.reorderActiveTab).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-reorder-active-item')).toEqual(false);
        });
        it('Template - Default model value', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.reorderActiveTab).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-reorder-active-item')).toEqual(false);
        });
        it('Template - reorderActiveTab at initial rendering', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab({ reorderActiveTab: false });
            tab.appendTo('#ej2Tab');
            expect(tab.reorderActiveTab).toEqual(false);
            expect(element.querySelector('.e-tab-header').classList.contains('e-reorder-active-item')).toEqual(true);
        });

        it('Template - onPropertyChanged with reorderActiveTab', () => {
            let element: HTMLElement = document.getElementById('ej2Tab');
            element.innerHTML = '<div class="e-tab-header"> <div> item1 </div> <div> item2 </div> </div>'
                + '<div class="e-content"> <div> <div> <h1>Content1</h1> <p> text</p> </div> </div> <div>'
                + '<div> <h1>Content2</h1> <p> text</p> </div> </div> </div>';
            tab = new Tab();
            tab.appendTo('#ej2Tab');
            expect(tab.reorderActiveTab).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-reorder-active-item')).toEqual(false);
            tab.reorderActiveTab = false;
            tab.dataBind();
            expect(tab.reorderActiveTab).toEqual(false);
            expect(element.querySelector('.e-tab-header').classList.contains('e-reorder-active-item')).toEqual(true);
            tab.reorderActiveTab = true;
            tab.dataBind();
            expect(tab.reorderActiveTab).toEqual(true);
            expect(element.querySelector('.e-tab-header').classList.contains('e-reorder-active-item')).toEqual(false);
        });
    });

    describe('EJ2-58100-Tab content element is wrong while using addTab method and removing items using close button', () => {
        let tab: Tab;
        let tabItems: TabItemModel[] = [
            {header: { text: 'item_2' }, content: '<div><b>Tab content 2</b><div id="item_2"></div></div>' },
            {header: { text: 'item_3' }, content: '<div><b>Tab content 3</b><div id="item_3"></div></div>' }
        ];
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Add and remove items and ensure the respective content rendered for last added tab item', () => {
            tab = new Tab({
                showCloseButton: true,
                items: [{
                    header: { text: 'item_1' },
                    content: '<div><b>TabContent_1</b></div>',
                }]
            }, '#ej2Tab');
            expect(tab.element.querySelectorAll('.e-toolbar-item').length).toEqual(1);
            tab.addTab(tabItems, 1);
            expect(tab.element.querySelectorAll('.e-toolbar-item').length).toEqual(3);
            const tabHeader = tab.element.querySelector('#e-item-ej2Tab_1.e-toolbar-item');
            (tabHeader.querySelector('.e-close-icon') as HTMLButtonElement).click();
            expect(tab.element.querySelectorAll('.e-toolbar-item').length).toEqual(2);
            tab.addTab([{header: { text: 'item_4' }, content: '<div><b>Tab content 4</b><div id="item_4"></div></div>' }], 2);
            tab.select(2);
            expect(tab.element.querySelector('#e-item-ej2Tab_3.e-toolbar-item')).toBeTruthy();
            const content: HTMLElement = tab.element.querySelector('#e-content-ej2Tab_3.e-item');
            expect(content).toBeTruthy();
            expect(content.textContent).toEqual('Tab content 4');
            expect(tab.element.querySelectorAll('.e-toolbar-item').length).toEqual(3);
        });
    });
    describe('tab key support in tabitems', () => {
        let tab: any;
        let keyEventArgs: any;
        let toolbar: DomElements;
        let toolbarObj: any;
        beforeEach((): void => {
            tab = undefined;
            const ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
            tab = new Tab();
            tab.appendTo('#ej2Tab');
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        afterAll((): void => {
            document.getElementById('scroll').remove();
        });
        it('tab key support in  popup mode', () => {
            tab = new Tab({
                overflowMode: 'Popup',
                items: [
                    { header: { 'text': 'header-item1' }, content: 'Content1', tabIndex: 1 },
                    { header: { 'text': 'header-item2' }, content: 'Content2', tabIndex: 2 },
                    { header: { 'text': 'header-item3' }, content: 'Content3', tabIndex: 3 },
                    { header: { 'text': 'header-item4' }, content: 'Content4', tabIndex: 4 }
                ]
            });
            tab.appendTo('#ej2Tab');
            const element: HTMLElement = document.getElementById('ej2Tab');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            const ele1 = tab.element.querySelectorAll('.e-toolbar-item').item(0).firstChild;
            expect(ele1.getAttribute('tabindex')).toBe ('1');
            expect(ele1.getAttribute('data-tabindex')).toBe ('1');
            const ele2 = tab.element.querySelectorAll('.e-toolbar-item').item(1).firstChild;
            expect(ele2.getAttribute('tabindex')).toBe ('2');
            expect(ele2.getAttribute('data-tabindex')).toBe ('2');
            const ele3 = tab.element.querySelectorAll('.e-toolbar-item').item(2).firstChild;
            expect(ele3.getAttribute('tabindex')).toBe ('3');
            expect(ele3.getAttribute('data-tabindex')).toBe ('3');
            const ele4 = tab.element.querySelectorAll('.e-toolbar-item').item(3).firstChild;
            expect(ele4.getAttribute('tabindex')).toBe ('4');
            expect(ele4.getAttribute('data-tabindex')).toBe ('4');
            tab.enableTab(1, false);
            expect(ele2.getAttribute('tabindex')).toBe (null);
            expect(ele2.getAttribute('data-tabindex')).toBe ('2');
            tab.enableTab(1, true);
            expect(ele2.getAttribute('tabindex')).toBe ('2');
            expect(ele2.getAttribute('data-tabindex')).toBe ('2');
        });
        it('tab key support in  scrollable mode', () => {
            tab = new Tab({
                overflowMode: 'Scrollable',
                items: [
                    { header: { 'text': 'header-item1' }, content: 'Content1', tabIndex: 1 },
                    { header: { 'text': 'header-item2' }, content: 'Content2', tabIndex: 2 }
                ]
            });
            tab.appendTo('#ej2Tab');
            const element: HTMLElement = document.getElementById('ej2Tab');
            keyEventArgs = {
                preventDefault: function () { },
                action: 'tab',
                target: element
            };
            tab.keyHandler(keyEventArgs);
            tab.refreshActiveTab();
            const ele1 = tab.element.querySelectorAll('.e-toolbar-item').item(0).firstChild;
            expect(ele1.getAttribute('tabindex')).toBe ('1');
            expect(ele1.getAttribute('data-tabindex')).toBe ('1');
            const ele2 = tab.element.querySelectorAll('.e-toolbar-item').item(1).firstChild;
            expect(ele2.getAttribute('tabindex')).toBe ('2');
            expect(ele2.getAttribute('data-tabindex')).toBe ('2');
        });
    });
    
    describe('While using underscore on tab id ', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab_123' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('wrong content is shown for the selected tab item', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item1" }, content: "Content1" }
                ]
            });
            tab.appendTo('#ej2Tab_123');
            let element: HTMLElement = document.getElementById('ej2Tab_123');
            const ele1: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-item').item(0);
            expect(ele1.classList.contains('e-active')).toEqual(true);
            const contentItem1: HTMLElement = element.querySelectorAll('.e-item')[0] as HTMLElement;
            expect(ele1.getAttribute('id')).toEqual(contentItem1.getAttribute('aria-labelledby'));
            expect(ele1.firstElementChild.getAttribute('aria-controls')).toEqual(contentItem1.getAttribute('id'));
            const ele2: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-item').item(1);
            ele2.click();
            expect(ele1.classList.contains('e-active')).toEqual(false);
            expect(ele2.classList.contains('e-active')).toEqual(true);
            const contentItem2: HTMLElement = element.querySelectorAll('.e-item')[1] as HTMLElement;
            expect(ele2.getAttribute('id')).toEqual(contentItem2.getAttribute('aria-labelledby'));
            expect(ele1.firstElementChild.getAttribute('aria-controls')).not.toEqual(null);
            expect(ele2.firstElementChild.getAttribute('aria-controls')).toEqual(contentItem2.getAttribute('id'));
            const ele3: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-item').item(2);
            ele3.click();
            expect(ele2.classList.contains('e-active')).toEqual(false);
            expect(ele3.classList.contains('e-active')).toEqual(true);
            const contentItem3: HTMLElement = element.querySelectorAll('.e-item')[2] as HTMLElement;
            expect(ele3.getAttribute('id')).toEqual(contentItem3.getAttribute('aria-labelledby'));
            expect(ele2.firstElementChild.getAttribute('aria-controls')).not.toEqual(null);
            expect(ele3.firstElementChild.getAttribute('aria-controls')).toEqual(contentItem3.getAttribute('id'));
        });
    });

    describe('EJ2-36811 - tab navigation is not working ', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('after removed the first tab issue fixed', () => {
            tab = new Tab({
                showCloseButton: true,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ]
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            const ele2: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-item').item(1);
            ele2.click();
            expect(tab.selectedItem).toEqual(1);
            let target: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-item .e-close-icon')[0];
            target.click();
            expect(tab.selectedItem).toEqual(0);
            const ele3: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-item').item(1);
            ele3.click();
            expect(tab.selectedItem).toEqual(1);
        });
    });

    describe('EJ2-71625 - when the same selected tab is re-selected, ', () => {
        let tab: Tab;
        let i: number = 0;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('the tab selecting event is triggered issue fixed', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ],
                selecting: () => {
                    i++;
                },
            });
            tab.appendTo('#ej2Tab');
            let element: HTMLElement = document.getElementById('ej2Tab');
            const ele2: HTMLElement = <HTMLElement>element.querySelectorAll('.e-toolbar-item').item(1);
            ele2.click();
            expect(i).toEqual(1);
            ele2.click();
            expect(i).toEqual(1);
        });
    });

    describe('ES-828018 - Drag and drop is not working in the tab ', () => {
        let tab: Tab;
        let i: number = 0;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('after setting args.cancel to true in the dragStart event issue fixed', () => {
            var j = 0;
            tab = new Tab({
                allowDragAndDrop: true,
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ],
                onDragStart: (args: DragEventArgs) => {
                    j++;
                    const tabItemsCount = tab.items.length;
                    if (args.index === tabItemsCount - 1) {
                      args.cancel = true;
                    }
                },
                dragging: (args: DragEventArgs) => {
                    i++;
                },
            });
            tab.appendTo('#ej2Tab');
            expect(j).toEqual(0);
            let element: HTMLElement = document.getElementById('ej2Tab');
            const dragElement: HTMLElement = element.querySelectorAll('.e-toolbar-item')[2] as HTMLElement;
            triggerMouseEvent(dragElement, 'mousedown', 8, 48);
            triggerMouseEvent(dragElement, 'mousemove', 8, 58);
            triggerMouseEvent(dragElement, 'mousemove', 8, 68);
            expect(j).toEqual(1);
            triggerMouseEvent(dragElement, 'mouseup');
            expect(i).toEqual(0);
            const secondItemDragElement: HTMLElement = element.querySelectorAll('.e-toolbar-item')[1] as HTMLElement;
            triggerMouseEvent(secondItemDragElement, 'mousedown', 8, 30);
            triggerMouseEvent(secondItemDragElement, 'mousemove', 8, 40);
            triggerMouseEvent(secondItemDragElement, 'mousemove', 8, 50);
            expect(j).toEqual(2);
            triggerMouseEvent(secondItemDragElement, 'mouseup');
            expect(i).toEqual(1);
        });
    });

    describe('ES-833459 - Prevent Tab item focus after selection', () => {
        let tab: Tab;
        beforeEach((): void => {
            tab = undefined;
            let ele: HTMLElement = createElement('div', { id: 'ej2Tab' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tab) {
                tab.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Prevent focus after selection', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ],
                selected: (args: SelectEventArgs) => {
                    expect(args.preventFocus).toEqual(false);
                    (document.activeElement as HTMLElement).blur();
                    args.preventFocus = true;
                    expect(args.preventFocus).toEqual(true);
                }
            });
            tab.appendTo('#ej2Tab');
            tab.select(1);
            expect(document.activeElement.tagName).toEqual('BODY');
            expect(document.activeElement.classList.contains('e-tab-wrap')).toEqual(false);
        });
        it('Set focus after selection', () => {
            tab = new Tab({
                items: [
                    { header: { "text": "item1" }, content: "Content1" },
                    { header: { "text": "item2" }, content: "Content2" },
                    { header: { "text": "item3" }, content: "Content3" }
                ],
                selected: (args: SelectEventArgs) => {
                    expect(args.preventFocus).toEqual(false);
                    (document.activeElement as HTMLElement).blur();
                }
            });
            tab.appendTo('#ej2Tab');
            tab.select(1);
            expect(document.activeElement.classList.contains('e-tab-wrap')).toEqual(true);
        });
    });

    it('memory leak', () => {
        profile.sample();
        let average: any = inMB(profile.averageChange)
        //Check average change in memory samples to not be over 10MB
        expect(average).toBeLessThan(10);
        let memory: any = inMB(getMemoryProfile())
        //Check the final memory usage against the first usage, there should be little change if everything was properly deallocated
        expect(memory).toBeLessThan(profile.samples[0] + 0.25);
    })
});
