/**
 * tooltip spec document
 */

import { createElement, isVisible } from '@syncfusion/ej2-base';
import { EventHandler, Browser } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs } from '../../src/tooltip/tooltip';
import '../../node_modules/es6-promise/dist/es6-promise';

function triggerMouseEvent(node: HTMLElement, eventType: string, x?: number, y?: number) {
    let mouseEve: MouseEvent = document.createEvent("MouseEvents");
    if (x && y) {
        mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, null);
    } else {
        mouseEve.initEvent(eventType, true, true);
    }
    node.dispatchEvent(mouseEve);
}
function triggerTouchEvent(node: HTMLElement | Document, eventType: string, x?: number, y?: number) {
    let touchEvent: Event = new TouchEvent(eventType);
    node.dispatchEvent(touchEvent);
}
function triggerScrollEvent(target: HTMLElement, scrollTop: number) {
    target.scrollTop = scrollTop;
    let e: UIEvent = document.createEvent("UIEvents");
    e.initUIEvent("scroll", true, true, window, 1);
    target.dispatchEvent(e);
}

function addCss(css: string) {
    const tag = document.createElement('style');
    tag.id = 'cssLink';
    tag.textContent = css;
    document.body.appendChild(tag);
}

describe('Tooltip Control', () => {
    beforeAll(() => {
        let css: string = ".e-popup { height: auto; position: absolute; width: auto; z-index: 1000;} .e-popup.e-popup-open { display: block;} .e-popup.e-popup-close { display: none;}"
            + ".e-tooltip-wrap { max-width: 350px; min-width: 30px; padding: 0; position: absolute; visibility: visible;} .e-tooltip-wrap .e-arrow-tip { overflow: hidden; position: absolute; } .e-tooltip-wrap .e-arrow-tip.e-tip-bottom { height: 8px; left: 50%; top: 100%; width: 16px; } .e-tooltip-wrap .e-arrow-tip.e-tip-top { height: 8px; left: 50%; top: -9px; width: 16px; } .e-tooltip-wrap .e-arrow-tip.e-tip-left { height: 16px; left: -9px; top: 48%; width: 8px; } .e-tooltip-wrap .e-arrow-tip.e-tip-right { height: 16px; left: 100%; top: 50%; width: 8px; } .e-tooltip-wrap .e-tooltip-close {  float: right;  position: absolute;  right: -9px;  top: -9px; } .e-tooltip-wrap .e-tip-content { height: 100%; line-height: 16px; overflow-x: hidden; padding: 3px 6px; position: relative; white-space: normal; width: 100%; } .e-tooltip-wrap.e-popup { background-color: #616161; border: 1px solid #616161; } .e-tooltip-wrap .e-arrow-tip-outer { height: 0; left: 0; position: absolute; top: 0;  width: 0; } .e-tooltip-wrap .e-arrow-tip-outer.e-tip-bottom { border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #616161; } .e-tooltip-wrap .e-arrow-tip-outer.e-tip-top { border-bottom: 8px solid #616161; border-left: 8px solid transparent; border-right: 8px solid transparent; } .e-tooltip-wrap .e-arrow-tip-outer.e-tip-left { border-bottom: 8px solid transparent; border-right: 8px solid #616161; border-top: 8px solid transparent; } .e-tooltip-wrap .e-arrow-tip-outer.e-tip-right { border-bottom: 8px solid transparent; border-left: 8px solid #616161; border-top: 8px solid transparent; } .e-tooltip-wrap .e-arrow-tip-inner { height: 0; position: absolute; width: 0; } .e-tooltip-wrap .e-arrow-tip-inner.e-tip-bottom {  border-left: 7px solid transparent;  border-right: 7px solid transparent;  border-top: 7px solid #616161;  left: 1px;  top: 0; } .e-tooltip-wrap .e-arrow-tip-inner.e-tip-top { border-bottom: 7px solid #616161;  border-left: 7px solid transparent;  border-right: 7px solid transparent;  left: 1px;  top: 1px; } .e-tooltip-wrap .e-arrow-tip-inner.e-tip-left { border-bottom: 7px solid transparent; border-right: 7px solid #616161; border-top: 7px solid transparent; left: 1px; top: 1px; } .e-tooltip-wrap .e-arrow-tip-inner.e-tip-right {  border-bottom: 7px solid transparent;  border-left: 7px solid #616161;  border-top: 7px solid transparent;  left: 0;  top: 1px; } .e-tooltip-wrap .e-tip-content {  color: #fff;  font-family: 'Roboto';  font-size: 11px; }";
        let style: HTMLStyleElement = document.createElement('style');
        style.type = 'text/css';
        style.id = 'tooltipStyle';
        style.appendChild(document.createTextNode(css));
        document.getElementsByTagName('head')[0].appendChild(style);
    });
    afterAll(() => {
        document.getElementById('tooltipStyle').remove();
    });
    describe('Dom tooltip element', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', { id: 'tstooltip', innerHTML: 'Show Tooltip' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Control class testing', () => {
            tooltip = new Tooltip({ content: 'Tooltip Content' });
            tooltip.appendTo('#tstooltip');
            expect(document.getElementById('tstooltip').classList.contains('e-tooltip')).toEqual(true);
        });
        it('Constructor with option and element argument testing', () => {
            tooltip = new Tooltip({ content: 'Tooltip Content' }, '#tstooltip');
            expect(document.getElementById('tstooltip').classList.contains('e-tooltip')).toEqual(true);
        });
        it('Empty options testing', () => {
            window.localStorage.setItem('tooltippersist', '');
            tooltip = new Tooltip({ enablePersistence: true });
            expect(tooltip.element).toEqual(undefined);
            tooltip.appendTo('#tstooltip');
            expect(document.getElementById('tstooltip').classList.contains('e-tooltip')).toEqual(true);
        });
        it('Destroy method testing', () => {
            let tooltip: Tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.destroy();
            expect(document.getElementById('tstooltip').classList.contains('e-tooltip')).toEqual(false);
        });
        it('get component name testing', () => {
            tooltip = new Tooltip({ content: 'Tooltip Content' }, '#tstooltip');
            expect(tooltip.getModuleName()).toEqual('tooltip');
        });
        it('cssClass at initialize testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                cssClass: 'myCustomClass', content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('myCustomClass')).toEqual(true);
            tooltip.close();
        });
        it('cssClass at property change', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            tooltip.cssClass = "myCustomClass";
            tooltip.dataBind();
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('myCustomClass')).toEqual(true);
            tooltip.close();
        });
        it('cssClass at property change', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content',
                cssClass: "myCustomClass1"
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('myCustomClass1')).toEqual(true);
            tooltip.cssClass = "myCustomClass2";
            tooltip.dataBind();
            expect(element.classList.contains('myCustomClass1')).toEqual(false);
            expect(element.classList.contains('myCustomClass2')).toEqual(true);
            tooltip.cssClass = null;
            tooltip.dataBind();
            expect(element.classList.contains('myCustomClass2')).toEqual(false);
            tooltip.close();
        });
        it('cssClass at property change when popup element does not present in document', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.cssClass = "myCustomClass";
            tooltip.dataBind();
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('myCustomClass')).toEqual(true);
            tooltip.close();
        });
        it('enableRtl at initialize testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                enableRtl: true, content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('e-rtl')).toEqual(true);
            tooltip.close();
        });
        it('enableRtl at property change', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            tooltip.enableRtl = true;
            tooltip.dataBind();
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('e-rtl')).toEqual(true);
            tooltip.enableRtl = false;
            tooltip.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(false);
            tooltip.close();
        });
        it('enableRtl popup element does not present in document at property change ', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.enableRtl = true;
            tooltip.dataBind();
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('e-rtl')).toEqual(true);
            tooltip.enableRtl = false;
            tooltip.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(false);
            tooltip.close();
        });
        it('Tooltip content width testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: '200px', content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.style.width).toEqual('200px');
            tooltip.width = 'auto';
            tooltip.dataBind();
            expect(element.style.width).toEqual('auto');
            tooltip.close();
        });
        it('Tooltip content height testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                height: '50px', content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.style.height).toEqual('50px');
            tooltip.height = 'auto';
            tooltip.dataBind();
            expect(element.style.height).toEqual('auto');
            tooltip.close();
        });
        it('Tooltip height and width property changes', () => {
            tooltip = new Tooltip({ animation: { open: { effect: 'None' }, close: { effect: 'None' } } }, '#tstooltip');
            tooltip.height = '300px';
            tooltip.width = '350px';
            tooltip.dataBind();
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.style.height).toEqual('300px');
            expect(element.style.width).toEqual('350px');
        });
        it('Tooltip height and width number type test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: 350, height: 300
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.style.height).toEqual('300px');
            expect(element.style.width).toEqual('350px');
        });
        it('Tooltip content html testing', () => {
            let tipcontent: HTMLElement = createElement('p', { innerHTML: 'tooltip content from html' });
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: tipcontent
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.querySelector('.e-tip-content').innerHTML).toEqual('<p>tooltip content from html</p>');
            tooltip.refresh();
            expect(element.querySelector('.e-tip-content').innerHTML).toEqual('<p>tooltip content from html</p>');
            tooltip.close();
        });
    });
    describe('Dom tooltip title attribute', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', {
                id: 'tstooltip', innerHTML: 'Show Tooltip',
                attrs: { title: 'tooltip with title attribute' }
            });
            document.body.appendChild(ele);
            let ele1: HTMLElement = createElement('div', {
                id: 'targetContainer', innerHTML: "<button id='btn' aria-describedby='descriptionClose'>X</button><div id='descriptionClose'>Closing this window will discard any information entered and return you back to the main page</div>"
            });
            document.body.appendChild(ele1);

        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('aria role and title attribute test cases', () => {
            tooltip = new Tooltip({ animation: { open: { effect: 'None' }, close: { effect: 'None' } } });
            tooltip.appendTo('#tstooltip');
            let target: HTMLElement = document.getElementById('tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            expect(target.getAttribute('title')).toBeNull();
            expect(target.getAttribute('data-content')).toEqual('tooltip with title attribute');
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.getAttribute('role')).toEqual('tooltip');
            tooltip.close();
            expect(target.getAttribute('title')).toEqual('tooltip with title attribute');
        });
        it('aria describedby and target dimension less than tooltip test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'tooltip from button', height: '40px'
            }, '#btn');
            let describedby: string = document.getElementById('btn').getAttribute('aria-describedby');
            tooltip.open(document.getElementById('btn'));
            expect(document.getElementById('btn').getAttribute('aria-describedby').indexOf('descriptionClose')).toEqual(0);
            tooltip.close();
            expect(document.getElementById('btn').getAttribute('aria-describedby')).toEqual(describedby);
            tooltip.position = 'RightCenter';
            tooltip.dataBind();
            tooltip.open(document.getElementById('btn'));
        });
    });
    describe('Tooltip Mouse hover events', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', { id: 'tstooltip', innerHTML: 'Tooltip' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Mouse hover event testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: '100px', height: '50px', content: 'Tooltip Content'
            }, '#tstooltip');
            let target: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            triggerMouseEvent(target, 'mouseover');
            triggerMouseEvent(document.getElementById('tstooltip'), 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(document.getElementById('tstooltip'), 'mouseover');
            document.getElementById('tstooltip').removeAttribute('aria-describedby');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerMouseEvent(document.getElementById('tstooltip'), 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
    describe('Tooltip Focus events', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', {
                id: 'tstooltip', innerHTML:
                "<label for='name'>User Name:</label><input type='text' id='name' class='formctrl' name='firstname' title='enter name'>"
            });
            document.body.appendChild(ele);
            let ele1: HTMLElement = createElement('div', {
                id: 'tstooltip1', innerHTML:
                "<div id='focusdiv' style='width: 100px;height: 30px;border: 1px solid;' tabindex='1' title='focus from div'></div>"
            });
            document.body.appendChild(ele1);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('focus event testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                opensOn: 'Focus', target: '.formctrl'
            }, '#tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            document.getElementById("name").focus();
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            document.getElementById("name").blur();
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('focus event for div element testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                opensOn: 'Focus'
            }, '#focusdiv');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            document.getElementById("focusdiv").focus();
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            document.getElementById("focusdiv").blur();
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
    describe('Tooltip Click events', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', {
                id: 'tstooltip', innerHTML:
                "<label for='name'>User Name:</label><input type='text' id='name' class='formctrl' name='firstname' title='enter name'>"
            });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('click event testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                opensOn: 'Click', target: '.formctrl'
            }, '#tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(document.getElementById("name"), 'mousedown');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            triggerMouseEvent(document.getElementById("name"), 'mousedown');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('click event testing for Sticky mode', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } }, isSticky: true,
                opensOn: 'Click', target: '.formctrl'
            }, '#tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(document.getElementById("name"), 'mousedown');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            triggerMouseEvent(document.getElementById("name"), 'mousedown');
            expect(isVisible(tooltipEle)).toBe(true);
            let closeEle: HTMLElement = document.querySelector('.e-tooltip-close') as HTMLElement;
            triggerMouseEvent(closeEle, 'mousedown');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
    describe('Tooltip custom events', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', { id: 'tstooltip', innerHTML: 'Tooltip' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('custom event testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                opensOn: 'Custom', width: '100px', height: '50px'
            }, '#tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            document.getElementById("tstooltip").click();
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            let target1: HTMLElement = document.getElementById('tstooltip');
            tooltip.open(target1);
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            tooltip.close();
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
    describe('Tooltip with multiple target', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', {
                className: 'tooltiptarget', innerHTML:
                "<p><a id='link1' title='MAScript (or ES) is a trademarked scripting-language specification'>ECMAScript</a> and "
                + "<a id='link2' title='The World Wide Web'>WWW</a></p> <a id='link3'>Test without title attribute</a>"
            });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('multiple target mouse hover event testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: '100px', height: '40px', showTipPointer: false, target: '#link1,#link2,#link3'
            }, '.tooltiptarget');
            let target1: HTMLElement = document.getElementById('link1');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();

            let target2: HTMLElement = document.getElementById('link2');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target2, 'mouseover');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerMouseEvent(target2, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();

            let target3: HTMLElement = document.getElementById('link3');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target3, 'mouseover');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            expect(document.querySelector('.e-tip-content').innerHTML).toBe('');
            triggerMouseEvent(target3, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('multiple target click event testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: '100px', height: '40px', showTipPointer: false, target: '#link1,#link2',
                opensOn: 'Click'
            }, '.tooltiptarget');
            let target1: HTMLElement = document.getElementById('link1');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mousedown');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerMouseEvent(target1, 'mousedown');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();

            let target3: HTMLElement = document.getElementById('link3');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target3, 'mousedown');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
    describe('Tooltip and tip positions', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', {
                className: 'tooltipparent', styles: 'margin:200px', innerHTML:
                "<div id='tstooltip' style='width:400px;height:100px;background: #a7c2e4;' title='Position combinations test cases'>Hover me !</div>"
            });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('TopLeft position testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'TopLeft', tipPointerPosition: 'Start'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('TopCenter position and start tip testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'TopCenter', tipPointerPosition: 'Start'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('TopCenter position and middle tip testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'TopCenter', tipPointerPosition: 'Middle'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('TopCenter position and end tip testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'TopCenter', tipPointerPosition: 'End'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('TopRight position testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'TopRight', tipPointerPosition: 'End'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('RightTop position testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'RightTop', tipPointerPosition: 'Start', height: '30px', width: '100px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('RightCenter position and start tip testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'RightCenter', tipPointerPosition: 'Start', height: '30px', width: '100px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('RightCenter position and middle tip testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'RightCenter', tipPointerPosition: 'Middle', height: '30px', width: '100px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('RightCenter position and end tip testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },

                position: 'RightCenter', tipPointerPosition: 'End', height: '30px', width: '100px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('RightBottom position testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'RightBottom', tipPointerPosition: 'End', height: '30px', width: '100px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('BottomRight position testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'BottomRight'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('BottomCenter position testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'BottomCenter'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('BottomLeft position testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'BottomLeft'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('LeftBottom position testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'LeftBottom', width: '100px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-right')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('LeftCenter position testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'LeftCenter', width: '100px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-right')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('LeftTop position testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'LeftTop', width: '100px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-right')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
    });
    describe('tooltip container collision scenario test cases', () => {
        let tooltip: Tooltip;
        beforeEach(() => {
            tooltip = undefined;
        });
        afterEach(() => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('collision affected position - left and top', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'LeftTop', content: 'collision left and top', target: '#target'
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('collision affected position - left and center', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:0px;top:150px;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'LeftCenter', content: 'collision left and center', target: '#target'
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('collision affected position - left and bottom', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:0px;top:300px;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'LeftBottom', content: 'collision left and bottom', target: '#target'
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('collision affected position - right and top', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:300px;top:0px;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'RightTop', content: 'collision right and top', target: '#target'
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('collision affected position - right and center', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:300px;top:120px;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'RightCenter', content: 'collision right and center', target: '#target'
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('collision affected position - right and bottom', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:300px;top:300px;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'RightBottom', content: 'collision right and bottom', target: '#target'
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
    });
    describe('Touch event', () => {
        let tooltip: any;
        let uA: string = Browser.userAgent;
        let originalTimeout: number;
        beforeEach((): void => {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1800;
            let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidUserAgent;
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', {
                className: 'tooltipparent', innerHTML:
                "<div id='tstooltip' title='touch event test cases'>Touch me !</div>"
            });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (tooltip) {
                tooltip.destroy();
            }
            Browser.userAgent = uA;
            document.body.innerHTML = '';
        });
        it('event handler for tap hold event', function (done) {
            tooltip = new Tooltip({ animation: { open: { effect: 'None' }, close: { effect: 'None' } }, width: '100px' }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            let e: any = {}; e.originalEvent = {};
            e.originalEvent.target = target1;
            e.originalEvent.type = 'touchstart';
            tooltip.tapHoldHandler(e);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            tooltip.touchEndHandler(e);
            setTimeout(function () {
                expect((<HTMLElement>document.querySelector('.e-tooltip-wrap')).classList.contains("e-popup-open")).toEqual(true);
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            }, 600);
            setTimeout(function () {
                expect(document.querySelector('.e-tooltip-wrap') as HTMLElement).toBeNull();
                done();
            }, 1600);
            expect(isVisible(tooltipEle)).toBe(true);
        });
        it('Sticky mode for tap hold event', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } }, isSticky: true,
                width: '100px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            let e: any = {}; e.originalEvent = {};
            e.originalEvent.target = target1;
            e.originalEvent.type = 'touchstart';
            tooltip.tapHoldHandler(e);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            tooltip.touchEndHandler(e);
            expect(isVisible(tooltipEle)).toBe(true);
            triggerTouchEvent(document, "touchend");
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
    describe('Mouse trail option test cases', () => {
        let tooltip: any;
        let uA: string = Browser.userAgent;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', {
                innerHTML:
                "<div id='tstooltip' style='height: 300px;width: 300px;background: #4e699c;margin:50px' title='Position combinations'>Hover me !</div>"
            });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            Browser.userAgent = uA;
            document.body.innerHTML = '';
        });
        it('mouse trail mouse option test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 200, 120);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, "mousemove", 200, 20);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail touch device option test cases', () => {
            let androidUserAgent: string = 'Mozilla/5.0 (Linux; Android 4.3; Nexus 7 Build/JWR66Y) ' +
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.92 Safari/537.36';
            Browser.userAgent = androidUserAgent;
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            let e: any = {}; e.originalEvent = {};
            e.originalEvent.target = target1;
            e.originalEvent.type = 'touchstart';
            tooltip.tapHoldHandler(e);
            // var touch: Touch = document.createTouch(window, target1, 0, 100, 200, 0, 0);
            // let touches: TouchList = document.createTouchList(touch);
            let touches: Object[] = [{ pageX: 100, pageY: 200 }];
            EventHandler.trigger(target1, 'touchstart', {
                type: "touchstart",
                target: target1,
                preventDefault: () => { return true; },
                altKey: false,
                changedTouches: touches,
                ctrlKey: false,
                metaKey: false,
                shiftKey: false,
                targetTouches: touches,
                touches: touches
            });
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerTouchEvent(document, "touchend");
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail TopLeft position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'TopLeft', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 60, 60);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail TopRight position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'TopRight', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 300, 100);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail RightTop position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'RightTop', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 300, 100);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail RightCenter position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'RightCenter', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 300, 200);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail RightBottom position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'RightBottom', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 300, 300);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail BottomLeft position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'BottomLeft', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 60, 300);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail BottomCenter position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'BottomCenter', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 200, 300);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail BottomRight position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'BottomRight', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 300, 300);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail LeftBottom position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'LeftBottom', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 170, 300);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-right')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail LeftCenter position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'LeftCenter', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 170, 200);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-right')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('mouse trail LeftTop position test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                mouseTrail: true, position: 'LeftTop', width: '80px', height: '40px'
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, "mousemove", 170, 100);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-right')).toEqual(true);
            triggerMouseEvent(target1, "mousemove", 70, 100);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
    describe('Keyboard event', () => {
        let tooltip: any;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', {
                className: 'tooltipparent', innerHTML:
                "<div id='tstooltip' title='keyboard event test cases'>Click me !</div>"
            });
            document.body.appendChild(ele);
            tooltip = new Tooltip({ animation: { open: { effect: 'None' }, close: { effect: 'None' } }, width: '100px' }, '#tstooltip');
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('close on escape key', () => {
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            tooltip.open(target1);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            tooltip.keyDown({ keyCode: 13, altKey: false, ctrlKey: false, shiftKey: false });
            expect(isVisible(tooltipEle)).toBe(true);
            let eventArgs: any = { keyCode: 27, altKey: false, ctrlKey: false, shiftKey: false };
            tooltip.keyDown(eventArgs);
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
    describe('Tooltip client side events', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', {
                id: 'tstooltip', innerHTML: 'Tooltip',
                attrs: { title: "tooltip with title attribute" }
            });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Created event', () => {
            let i: number = 0;
            function createFn(): void {
                i++;
            }
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                created: createFn
            });
            tooltip.appendTo('#tstooltip');
            expect(i).toEqual(1);
        });
        it('before collision event', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip content',
                position: 'TopCenter',
                beforeCollision: function (args: TooltipEventArgs) {
                    expect(args.collidedPosition).toBe('BottomCenter');
                }
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
        });
        it('before open, after open event', () => {
            let tipFn1: jasmine.Spy = jasmine.createSpy('tooltipevent');
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                beforeOpen: tipFn1,
                beforeClose: tipFn1,
                afterOpen: tipFn1,
                afterClose: tipFn1
            });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            expect(tipFn1).toHaveBeenCalledTimes(2);
            tooltip.refresh();
            tooltip.close();
            tooltip.refresh();
            expect(tipFn1).toHaveBeenCalledTimes(4);
        });
        it('cancel before render event', () => {
            function onBeforeRender(args: TooltipEventArgs) {
                args.cancel = true;
            }
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                beforeRender: onBeforeRender
            });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle).toBeNull();
        });
        it('cancel before open event', () => {
            function cancelbeforeOpen(args: TooltipEventArgs) {
                args.cancel = true;
            }
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                beforeOpen: cancelbeforeOpen
            });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle).toBeNull();
        });
        it('cancel before close event', () => {
            function cancelbeforeClose(args: TooltipEventArgs) {
                args.cancel = true;
            }
            let tooltip: any = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                beforeClose: cancelbeforeClose
            });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            tooltip.close();
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toEqual(true);
            tooltip.clear();
        });
    });
    describe('Tooltip sticky mode test cases', () => {
        let tooltip: any;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', {
                className: 'tooltipparent', innerHTML:
                "<div id='tstooltip' title='sticky mode test cases'>Stick me !</div>"
            });
            document.body.appendChild(ele);
            let ele1: HTMLElement = createElement('div', {
                className: 'tooltiptarget', innerHTML:
                "<p><a id='link1' title='MAScript (or ES) is a trademarked scripting-language specification'>ECMAScript</a> and "
                + "<a id='link2' title='The World Wide Web'>WWW</a></p><a id='link3'>Test without title attribute</a>"
            });
            document.body.appendChild(ele1);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('sticky mode target mouse leave', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: '100px', isSticky: true
            }, '#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(isVisible(tooltipEle)).toBe(true);
            let closeEle: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-tooltip-close'))[0];
            triggerMouseEvent(closeEle, 'mousedown');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('sticky mode with multiple targets', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                isSticky: true, showTipPointer: false, target: '#link1,#link2,#link3'
            }, '.tooltiptarget');
            let target1: HTMLElement = document.getElementById('link1');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target1, 'mouseover');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerMouseEvent(target1, 'mouseleave');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            expect(document.querySelector('.e-tip-content').innerHTML).
                toEqual('MAScript (or ES) is a trademarked scripting-language specification');

            let target2: HTMLElement = document.getElementById('link2');
            triggerMouseEvent(target2, 'mouseover');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            expect(document.querySelector('.e-tip-content').innerHTML).
                toEqual('The World Wide Web');
            let closeele: HTMLElement = (<HTMLScriptElement[]><any>document.getElementsByClassName('e-tooltip-close'))[0];
            triggerMouseEvent(closeele, 'mousedown');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
    describe("Animation open property and openDelay test cases", function () {
        let originalTimeout: number;
        let tooltip: Tooltip;
        beforeEach(function () {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            let ele: HTMLElement = createElement('div', {
                className: 'tooltipparent', innerHTML:
                "<div id='tstooltip' title='animation test cases'>Animate me !</div>"
            });
            document.body.appendChild(ele);
        });

        it("animation while open tooltip test case", function (done) {
            tooltip = new Tooltip({
                width: '100px', height: '40px', animation: { open: { effect: 'FadeIn', duration: 500, delay: 100 } }
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            setTimeout(function () {
                expect((<HTMLElement>document.querySelector('.e-tooltip-wrap')).classList.contains("e-popup-open")).toEqual(true);
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
                done();
            }, 900);
        });

        it("delay to open tooltip", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px', openDelay: 600, animation: { open: { effect: 'None' } } });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            setTimeout(function () {
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
                done();
            }, 900);
        });

        it("delay to open tooltip", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px', openDelay: 600, animation: { open: { effect: 'None' } } });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            setTimeout(function () {
                tooltip.close();
            }, 300);
            setTimeout(function () {
                expect(document.querySelector('.e-tooltip-wrap') as HTMLElement).toBeNull();
                done();
            }, 900);
        });

        it("apply animation through public method open test case", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px' }, '#tstooltip');
            let animationOptions: Object = { effect: 'FadeIn', duration: 400, delay: 10 };
            tooltip.open(document.getElementById('tstooltip'), animationOptions);
            setTimeout(function () {
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
                done();
            }, 500);
        });
        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
    });
    describe("Animation close property and closeDelay test cases", function () {
        let originalTimeout: number;
        let tooltip: Tooltip;
        beforeEach(function () {
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;
            let ele: HTMLElement = createElement('div', {
                className: 'tooltipparent', innerHTML:
                "<div id='tstooltip' title='animation test cases'>Animate me !</div>"
            });
            document.body.appendChild(ele);
        });

        it("animation while close tooltip test case", function (done) {
            tooltip = new Tooltip({
                width: '100px', height: '40px', animation: { close: { effect: 'FadeOut', duration: 500, delay: 100 } }
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            tooltip.close();
            setTimeout(function () {
                expect(document.querySelector('.e-tooltip-wrap') as HTMLElement).toBeNull();
                done();
            }, 900);
        });

        it("delay to close tooltip", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px', closeDelay: 600, animation: { close: { effect: 'None' } } });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            tooltip.close();
            setTimeout(function () {
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            }, 300);
            setTimeout(function () {
                expect(document.querySelector('.e-tooltip-wrap') as HTMLElement).toBeNull();
                done();
            }, 900);
        });
        it("delay to close tooltip", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px', closeDelay: 800, animation: { close: { effect: 'None' } } });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            tooltip.close();
            setTimeout(function () {
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
                if (tooltip) {
                    tooltip.destroy();
                    tooltip = null;
                }
            }, 300);
            setTimeout(function () {
                expect(document.querySelector('.e-tooltip-wrap') as HTMLElement).toBeNull();
                done();
            }, 900);
        });
        it("apply animation through public method close test case", function (done) {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: '100px', height: '40px'
            }, '#tstooltip');
            let animationOptions: Object = { effect: 'FadeOut', duration: 400, delay: 10 };
            tooltip.open(document.getElementById('tstooltip'));
            tooltip.close(animationOptions);
            setTimeout(function () {
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            }, 300);
            setTimeout(function () {
                expect(document.querySelector('.e-tooltip-wrap') as HTMLElement).toBeNull();
                done();
            }, 500);
        });
        afterEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
    });
    describe('Tooltip property changes', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="tstooltip" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:150px;top:150px;">property changes</div></div>';
            document.body.appendChild(elem.firstChild);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('content property changes', () => {
            tooltip = new Tooltip({ animation: { open: { effect: 'None' }, close: { effect: 'None' } } }, '#tstooltip');
            tooltip.content = 'Tooltip Content';
            tooltip.dataBind();
            tooltip.open(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.querySelector('.e-tip-content').innerHTML).toEqual('Tooltip Content');
            tooltip.close();
        });
        it('content property changes when popup element does not in document', () => {
            tooltip = new Tooltip({ animation: { open: { effect: 'None' }, close: { effect: 'None' } } }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            tooltip.content = 'Tooltip Content';
            tooltip.dataBind();
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.querySelector('.e-tip-content').innerHTML).toEqual('Tooltip Content');
            tooltip.close();
        });
        it('Openson property changes', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            let target: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            tooltip.opensOn = 'Click';
            tooltip.dataBind();
            triggerMouseEvent(target, 'mouseover');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(document.getElementById("tstooltip"), 'mousedown');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerMouseEvent(document.getElementById("tstooltip"), 'mousedown');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('Position property changes', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'RightCenter', content: 'Tooltip Content'
            }, '#tstooltip');
            let target: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            tooltip.position = 'LeftCenter';
            tooltip.dataBind();
            triggerMouseEvent(target, 'mouseover');
            expect(document.querySelector('.e-arrow-tip').classList.contains('e-tip-right')).toEqual(true);
            tooltip.position = 'RightCenter';
            tooltip.dataBind();
            expect(document.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target, 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('Tip Pointer position property changes', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                tipPointerPosition: 'Start', content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            expect(isVisible(document.querySelector('.e-tooltip-wrap'))).toBe(true);
            tooltip.close();
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            tooltip.tipPointerPosition = 'Middle';
            tooltip.dataBind();
            tooltip.open(document.getElementById('tstooltip'));
            expect(isVisible(document.querySelector('.e-tooltip-wrap'))).toBe(true);
            tooltip.tipPointerPosition = 'End';
            tooltip.dataBind();
            expect(isVisible(document.querySelector('.e-tooltip-wrap'))).toBe(true);
            tooltip.close();
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it('offsetX and offsetY properties changes', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let x: number = parseInt((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.left, 10);
            let y: number = parseInt((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.top, 10);
            tooltip.offsetX = 20;
            tooltip.offsetY = 20;
            tooltip.dataBind();
            expect(parseInt((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.left, 10)).toEqual(x + 20);
            expect(parseInt((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.top, 10)).toEqual(y + 20);
        });
        it('offsetX and offsetY properties changes when popup element does not present in DOM', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let x: number = parseInt((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.left, 10);
            let y: number = parseInt((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.top, 10);
            tooltip.close();
            tooltip.offsetX = 20;
            tooltip.offsetY = 20;
            tooltip.dataBind();
            tooltip.open(document.getElementById('tstooltip'));
            expect(parseInt((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.left, 10)).toEqual(x + 20);
            expect(parseInt((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.top, 10)).toEqual(y + 20);
        });
    });
    describe('Tooltip public method test cases', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="tstooltip" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:150px;top:150px;">property changes</div></div>';
            document.body.appendChild(elem.firstChild);
            document.body.appendChild(createElement('div', { id: 'hiddenEle', styles: 'display:none', innerHTML: 'Hidden Element' }));
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('refresh method test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            (<HTMLElement>document.getElementById('tstooltip')).style.left = "10px";
            tooltip.refresh(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.querySelector('.e-tip-content').innerHTML).toEqual('Tooltip Content');
            expect((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.left).toBe("191.5px");
            tooltip.close();
            expect(document.querySelector('.e-tooltip-wrap') as HTMLElement).toBeNull();
            tooltip.close();
        });
        it('change height and width dynamically test cases', () => {
            let elem: HTMLElement = document.createElement('button');
            let tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            let tip: HTMLElement = document.querySelector('.e-arrow-tip') as HTMLElement;
            let tipPreviousVal=tip.style.left;
            elem.onclick=function(){
                tooltip.height='50px';
                tooltip.width='150px';
                tooltip.dataBind();
            };
            elem.click();
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.style.height).toBe("50px");
            expect(element.style.width).toBe("150px");
            expect(tipPreviousVal).not.toEqual(tip.style.left);
            tooltip.close();
        });
        it('Performance test cases', () => {
            let start: number = Date.now();
            tooltip = new Tooltip({
                content: 'Tooltip Content'
            }, '#tstooltip');
            let end: number = Date.now();
            expect(end - start).toBeLessThanOrEqual(5);
        });
        it('Prevent Tooltip appears on hidden element', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('hiddenEle'));
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
    describe('Collision testing on target and container resizing', () => {
        let tooltip: Tooltip;
        let target: HTMLElement;
        let button: HTMLElement;
        let block: HTMLElement;
        let tooltipWrapper: HTMLElement;
        let currentPosition: string;
        beforeEach(() => {
            addCss(
                `#btn {position: relative;left: 50%;top: 50%;transform: translateX(-50%) translateY(-50%);}
			    .block {display: inline-block;width: 340px;height: 170px;position: relative;border: 3px dashed grey;
                left: 50%;transform: translateX(-50%);top: 100px;}`
            );
            block = document.createElement('div');
            button = document.createElement('button');
            block.className = 'block';
            button.id = 'btn';
            button.textContent = 'Show Tooltip';
            block.appendChild(button);
            document.body.appendChild(block);

        });

        afterEach((done) => {
            setTimeout(() => {
                if (tooltip) {
                    tooltip.destroy();
                }
                document.body.innerHTML = '';
                done()
            }, 300);

        });

        it('container resized while tooltip is from TopCenter', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'TopCenter',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('TopCenter');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('BottomCenter');
                done();
            }, 500);
        });

        it('container resized while tooltip is from TopRight', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'TopRight',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('TopRight');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('BottomRight');
                done();
            }, 500);
        });

        it('container resized while tooltip is from TopLeft', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'TopLeft',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('TopLeft');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('BottomLeft');
                done();
            }, 500);
        });

        it('container resized while tooltip is from TopRight', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'TopRight',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('TopRight');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('BottomRight');
                done();
            }, 500);
        });

        it('container resized while tooltip is from BottomCenter', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'BottomCenter',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('BottomCenter');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('TopCenter');
                done();
            }, 500);
        });

        it('container resized while tooltip is from BottomRight', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'BottomRight',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('BottomRight');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('TopRight');
                done();
            }, 500);
        });

        it('container resized while tooltip is from BottomLeft', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'BottomLeft',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('BottomLeft');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('TopLeft');
                done();
            }, 500);
        });

        it('container resized while tooltip is from LeftTop height compressing', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'LeftTop',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('LeftTop');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('LeftBottom');
                done();
            }, 500);
        });

        it('container resized while tooltip is from LeftTop width compressing', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'LeftTop',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('LeftTop');
            tooltip.close();
            setTimeout(() => {
                block.style.width = '130px';
                tooltip.open(button);
                expect(currentPosition).toBe('TopLeft');
                done();
            }, 500);
        });

        it('container resized while tooltip is from LeftBottom height compressing', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'LeftBottom',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('LeftBottom');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('LeftTop');
                done();
            }, 500);
        });

        it('container resized while tooltip is from LeftBottom width compressing', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'LeftBottom',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('LeftBottom');
            tooltip.close();
            setTimeout(() => {
                block.style.width = '130px';
                tooltip.open(button);
                expect(currentPosition).toBe('BottomLeft');
                done();
            }, 500);
        });

        it('container resized while tooltip is from RightTop height compressing', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'RightTop',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('RightTop');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('RightBottom');
                done();
            }, 500);
        });

        it('container resized while tooltip is from RightTop width compressing', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'RightTop',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('RightTop');
            tooltip.close();
            setTimeout(() => {
                block.style.width = '130px';
                tooltip.open(button);
                expect(currentPosition).toBe('TopRight');
                done();
            }, 500);
        });

        it('container resized while tooltip is from RightBottom height compressing', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'RightBottom',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('RightBottom');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button);
                expect(currentPosition).toBe('RightTop');
                done();
            }, 500);
        });

        it('container resized while tooltip is from RightBottom width compressing', (done) => {
            tooltip = new Tooltip({
                content: 'Content',
                position: 'RightBottom',
                opensOn: 'Click',
                target: '#btn',
                beforeCollision: (args: any) => {
                    currentPosition = args.collidedPosition;
                }
            });
            tooltip.appendTo('.block');
            tooltip.open(button);
            expect(currentPosition).toBe('RightBottom');
            tooltip.close();
            setTimeout(() => {
                block.style.width = '130px';
                tooltip.open(button);
                expect(currentPosition).toBe('BottomRight');
                done();
            }, 500);
        });
    });
    describe('Scroll event test cases', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 2000px;"><span id="tstooltip">Hover Me</span></div>';
            document.body.appendChild(elem.firstChild);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('document scroll event test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip'));
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerScrollEvent(document.body, 1000);
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });
 
});
