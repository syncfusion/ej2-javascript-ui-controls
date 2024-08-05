/**
 * tooltip spec document
 */

import { createElement, isVisible } from '@syncfusion/ej2-base';
import { EventHandler, Browser } from '@syncfusion/ej2-base';
import { Tooltip, TooltipEventArgs } from '../../src/tooltip/tooltip';
import '../../node_modules/es6-promise/dist/es6-promise';

function triggerMouseEvent(node: HTMLElement, eventType: string, x?: number, y?: number, relatedTarget?: any) {
    let mouseEve: MouseEvent = document.createEvent("MouseEvents");
    const relatedTargetElement = relatedTarget ? relatedTarget : null;
    if (x && y) {
        mouseEve.initMouseEvent(eventType, true, true, window, 0, 0, 0, x, y, false, false, false, false, 0, relatedTargetElement);
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
    let e = new UIEvent("scroll", {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1
    });
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
        it('Destroy method testing while using beforeClose Event', () => {
            function cancelbeforeClose(args: TooltipEventArgs) {
                args.cancel = true;
            }
            let tooltip: any = new Tooltip({
                content: 'Tooltip Content',
                mouseTrail: true,
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                beforeClose: cancelbeforeClose
            });
            tooltip.appendTo('#tstooltip');
            let target1: HTMLElement = document.getElementById('tstooltip');
            triggerMouseEvent(target1, 'mouseover');
            triggerMouseEvent(target1, 'mouseleave');
            tooltip.destroy();
            triggerMouseEvent(target1, 'mouseenter');
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('myCustomClass')).toEqual(true);
            tooltip.close();
        });
        it('cssClass at property change', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('myCustomClass')).toEqual(true);
            tooltip.close();
        });
        it('enableRtl at initialize testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                enableRtl: true, content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('e-rtl')).toEqual(true);
            tooltip.close();
        });
        it('enableRtl at property change', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            tooltip.enableRtl = true;
            tooltip.dataBind();
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.classList.contains('e-rtl')).toEqual(true);
            tooltip.enableRtl = false;
            tooltip.dataBind();
            expect(element.classList.contains('e-rtl')).toEqual(false);
            tooltip.close();
        });
	it('isSticky at property change', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            tooltip.isSticky = true;
            tooltip.dataBind();
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap .e-tooltip-close') as HTMLElement;
            expect(element.classList.contains('e-tooltip-close')).toEqual(true);
            tooltip.isSticky = false;
            tooltip.dataBind();
            let element1: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element1.classList.contains('e-tooltip-close')).toEqual(false);
            tooltip.close();
        });
        it('enableHtmlSanitizer as false and content as string', () => {
            tooltip = new Tooltip({
                enableHtmlSanitizer: false, content: 'Tooltip Content<style>body{background:rgb(0, 0, 255)}<\/style>'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).toBe("rgb(0, 0, 255)");
            tooltip.close();
        });
        it('enableHtmlSanitizer as true and content as string', () => {
            tooltip = new Tooltip({
                enableHtmlSanitizer: true, content: 'Tooltip Content<style>body{background:blue}<\/style>'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).not.toBe("rgb(0, 0, 255)");
            tooltip.close();
        });
        it('enableHtmlParse as false and HTML script tag as string content', () => {
            tooltip = new Tooltip({
                content: 'Tooltip Content<style>body{background:rgb(0, 0, 255)}<\/style>',
                enableHtmlParse:false
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).toBe("rgba(0, 0, 0, 0)");
            tooltip.close();
        });
        it('enableHtmlParse as false and HTML script tag as string content', () => {
            tooltip = new Tooltip({
                content: 'Tooltip Content<style>body{background:rgb(0, 0, 255)}<\/style>',
                enableHtmlParse:true
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).toBe("rgba(0, 0, 0, 0)");
            tooltip.close();
        });
        it('enableHtmlParse as false, enableHtmlSanitizer as false and HTML script tag as string content', () => {
            tooltip = new Tooltip({
                content: 'Tooltip Content<style>body{background:rgb(0, 0, 255)}<\/style>',
                enableHtmlParse:false,
                enableHtmlSanitizer:false
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).not.toBe("rgb(0, 0, 255)");
            tooltip.close();
        });
        it('enableHtmlParse as false, enableHtmlSanitizer as true and HTML script tag as string content', () => {
            tooltip = new Tooltip({
                content: 'Tooltip Content<style>body{background:rgb(0, 0, 255)}<\/style>',
                enableHtmlParse:false,
                enableHtmlSanitizer:true
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).not.toBe("rgb(0, 0, 255)");
            tooltip.close();
        });
        it('enableHtmlParse as true, enableHtmlSanitizer as false and HTML script tag as string content', () => {
            tooltip = new Tooltip({
                content: 'Tooltip Content<style>body{background:rgb(0, 0, 255)}<\/style>',
                enableHtmlParse:true,
                enableHtmlSanitizer:false
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).toBe("rgb(0, 0, 255)");
            tooltip.close();
        });
        it('enableHtmlParse as true, enableHtmlSanitizer as true and HTML script tag as string content', () => {
            tooltip = new Tooltip({
                content: 'Tooltip Content<style>body{background:rgb(0, 0, 255)}<\/style>',
                enableHtmlParse:true,
                enableHtmlSanitizer:true
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).not.toBe("rgb(0, 0, 255)");
            tooltip.close();
        });
        it('enableHtmlSanitizer as false and content as HtmlElement', () => {
            var tipcontent = createElement('p', { innerHTML: 'tooltip content from html<style>body{background:rgb(0, 0, 255)}<\/style>' });
            tooltip = new Tooltip({
                enableHtmlSanitizer: false, content: tipcontent
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).toBe("rgb(0, 0, 255)");
            tooltip.close();
        });
        it('enableHtmlSanitizer as true and content as HtmlElement', () => {
            tooltip = new Tooltip({
                enableHtmlSanitizer: true, content: 'Tooltip Content<style>body{background:rgb(0, 0, 255)}<\/style>'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            var ele = document.body;
            expect(window.getComputedStyle(ele).backgroundColor).not.toBe("rgb(0, 0, 255)");
            tooltip.close();
        });
        it('enableRtl at property change', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.style.height).toEqual('300px');
            expect(element.style.width).toEqual('350px');
        });
        it('Tooltip height and width number type test cases', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: 350, height: 300
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
                id: 'targetContainer', innerHTML: "<button id='btn' >X</button><div id='descriptionClose'>Closing this window will discard any information entered and return you back to the main page</div>"
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.appendTo('#btn');
            let target: HTMLElement = document.getElementById('btn');
            tooltip.open(target);
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(target.getAttribute('aria-describedby')).toEqual(tooltipEle.id);
            expect(target.getAttribute('data-tooltip-id')).toEqual(tooltipEle.id)
            expect(tooltipEle.getAttribute('role')).toEqual('tooltip');
            tooltip.close();
            expect(target.getAttribute('aria-describedby')).toBeNull();
            expect(target.getAttribute('data-tooltip-id')).toBeNull();
            tooltip.position = 'RightCenter';
            tooltip.dataBind();
            tooltip.open(target);
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
        it('Mouse hover event testing with isInteracted', () => {
            function tooltipFunction(args: TooltipEventArgs) {
                expect(args.isInteracted).toBe(true);
            }
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: '100px', height: '50px', content: 'Tooltip Content', beforeRender: tooltipFunction,
                beforeOpen: tooltipFunction, beforeClose: tooltipFunction, afterClose: tooltipFunction, afterOpen: tooltipFunction
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

        it('Mouse hover over tooltip itself with closeDelay', (done) => {
            let tipFn1: jasmine.Spy = jasmine.createSpy('tooltipevent');
            tooltip = new Tooltip({
                width: '100px', height: '50px', content: 'Tooltip Content', closeDelay: 800, animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                beforeClose: tipFn1, afterClose: tipFn1,
            }, '#tstooltip');
            let target: HTMLElement = document.getElementById('tstooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            expect(tipFn1).toHaveBeenCalledTimes(0);
            triggerMouseEvent(document.getElementById('tstooltip'), 'mouseleave');
            expect(tipFn1).toHaveBeenCalledTimes(0);
            triggerMouseEvent(tooltipEle, 'mouseenter');
            expect(isVisible(tooltipEle)).toBe(true);
            expect(document.querySelector('.e-tooltip-wrap')).not.toBeNull();
            triggerMouseEvent(tooltipEle, 'mouseleave');
            expect(tipFn1).toHaveBeenCalledTimes(0);
            setTimeout(function () {
                expect(document.querySelector('.e-tooltip-wrap') as HTMLElement).toBeNull();
                expect(tipFn1).toHaveBeenCalledTimes(2);
                done();
            }, 900);
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
        it('focus event for dynamically added button element testing', () => {
            let btn1: HTMLElement = createElement('div', {
                id: 'div1', innerHTML: "<button id='tooltip1' class='btn' title='Content 1'>tooltip1</button>"
            });
            let btn2: HTMLElement = createElement('button', {
                id: 'tooltip2', attrs: { "title": "Content 2" }
            });
            document.body.appendChild(btn1);
            document.getElementById("div1").appendChild(btn2);
            btn1.addEventListener("mousedown", function () {
                btn2.innerText = "tooltip2";
                btn2.classList.add("btn");
                tooltip.refresh();
                document.getElementById("tooltip2").focus();
            });
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } }, target: '.btn', opensOn: "Focus Click"
            }, '#div1');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            document.getElementById("tooltip1").focus();
            expect((document.querySelector('.e-tip-content') as HTMLElement).innerText).toEqual('Content 1');
            triggerMouseEvent(document.getElementById("tooltip1"), 'mousedown');
            expect((document.querySelector('.e-tip-content') as HTMLElement).innerHTML).toEqual('Content 2');
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
        it('click event with scaling testing', () => {
            document.body.style.transform = "scale(0.8)";
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
            document.body.style.transform = "";
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
            tooltip.open(target1); // Open the tooltip based on target element specified in optional parameter
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
                    "<p><a id='link1' class='targettooltip' title='MAScript (or ES) is a trademarked scripting-language specification'>ECMAScript</a> and "
                    + "<a id='link2' class='targettooltip' title='The World Wide Web'>WWW</a></p> <a id='link3' class='targettooltip'>Test without title attribute</a>"
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
        it('dynamically added target testing', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: '100px', height: '40px', showTipPointer: false, target: '.targettooltip'
            }, '.tooltiptarget');
            let target2 = document.querySelector('.tooltiptarget');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            let childEle: HTMLElement = createElement('div', {
                className: 'targettooltip', innerHTML: "Dynamicall added target"
            });
            target2.appendChild(childEle);
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
        it('windowCollision with collision affected position - left and top', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'LeftTop', content: 'collision left and top', target: '#target',
                windowCollision:true
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-right')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('Tooltip popup reposition mock teste for windowResize event', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;position:relative;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'LeftTop', content: 'collision left and top', target: '#target',
            }, '#target');
            tooltip.open();
            expect((document.getElementsByClassName("e-popup")[0] as any).offsetLeft).toEqual(168);
            let target1: HTMLElement = document.getElementById('target');
            target1.style.left = "300px";
            (tooltip as any).windowResize();
            expect((document.getElementsByClassName("e-popup")[0] as any).offsetLeft).toEqual(468);
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
        it('windowCollision with collision affected position - left and center', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:0px;top:150px;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'LeftCenter', content: 'collision left and center', target: '#target',
                windowCollision:true
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-right')).toEqual(true);
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
        it('windowCollision with collision affected position - left and bottom', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:0px;top:300px;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'BottomCenter', content: 'collision left and bottom', target: '#target',
                windowCollision:true
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
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
        it('windowCollision with collision affected position - right and top', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:300px;top:0px;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'RightTop', content: 'collision right and top', target: '#target',
                windowCollision:true
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
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
        it('windowCollision with collision affected position - right and bottom', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;position:absolute;left:300px;top:300px;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'RightBottom', content: 'collision right and bottom', target: '#target',
                windowCollision:true
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-left')).toEqual(true);
            triggerMouseEvent(target1, 'mouseleave');
        });
        it('collision affected position - top with offset', () => {
            let elem: HTMLDivElement = document.createElement('div');
            elem.innerHTML = '<div id="targetContainer" style="height: 400px;width: 400px;background: #4e699c;margin: 100px 0px 50px 165px;float: left;overflow: scroll;position: relative;"><div id="target" style="height: 100px;width: 100px;background: #af0404;float: left;">Tooltip target</div></div>';
            document.body.appendChild(elem.firstChild);
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                position: 'TopCenter', content: 'collision left and top', target: '#target', offsetY: -10, beforeCollision: onCollision
            }, '#targetContainer');
            let target1: HTMLElement = document.getElementById('target');
            triggerMouseEvent(target1, 'mouseover');
            function onCollision(e: TooltipEventArgs) {
                expect(e.collidedPosition).toBe('BottomCenter');
            }
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            let tipHeight: number = 8;
            // tooltipOffset is space between tooltip element and target element
            let tooltipOffset: number = (tooltipEle.getBoundingClientRect().top - tipHeight) - target1.getBoundingClientRect().bottom;
            expect(tooltipOffset).toEqual(10);
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
            expect(isVisible(tooltipEle)).toBe(true);
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

        it("mousetrail with open delay", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px', openDelay: 600, mouseTrail: true, animation: { open: { effect: 'None' } } });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
                expect(isVisible(tooltipEle)).toBe(false);
            setTimeout(function () {
                let target1: HTMLElement = document.getElementById('tstooltip');
                triggerMouseEvent(target1, 'mouseover');
                triggerMouseEvent(target1, "mousemove", 200, 120);
                let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
                expect(isVisible(tooltipEle)).toBe(true);
                expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-bottom')).toEqual(true);
                triggerMouseEvent(target1, "mousemove", 200, 20);
                expect(tooltipEle.querySelector('.e-arrow-tip').classList.contains('e-tip-top')).toEqual(true);
                triggerMouseEvent(target1, 'mouseleave');
                done();
            }, 900);
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
            tooltip.open(target1); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            expect(tipFn1).toHaveBeenCalledTimes(2);
            tooltip.refresh();
            tooltip.close();
            tooltip.refresh();
            expect(tipFn1).toHaveBeenCalledTimes(4);
        });
        it('after open event without arrow element', () => {
            let tipFn1: jasmine.Spy = jasmine.createSpy('tooltipevent');
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                target: '#tstooltip',
                showTipPointer: false,
                afterOpen: tipFn1
            });
            tooltip.appendTo('#tstooltip');
            tooltip.open();
            expect(tooltip.showTipPointer).toBe(false);
            let arrowEle: HTMLElement = document.querySelector('.e-arrow-tip') as HTMLElement;
            expect(arrowEle).toBeNull();
            expect(tipFn1).toHaveBeenCalledTimes(1);
            tooltip.close();
        });
        it('cancel before render event', () => {
            function onBeforeRender(args: TooltipEventArgs) {
                args.cancel = true;
                expect(args.isInteracted).toBe(false);
            }
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                beforeRender: onBeforeRender
            });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle).toBeNull();
        });
        it('cancel before open event', () => {
            function cancelbeforeOpen(args: TooltipEventArgs) {
                args.cancel = true;
                expect(args.isInteracted).toBe(false);
            }
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                beforeOpen: cancelbeforeOpen
            });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle).toBeNull();
        });
        it('after open event', () => {
            function cancelbeforeOpen(args: TooltipEventArgs) {
                expect(args.isInteracted).toBe(false);
            }
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                afterOpen: cancelbeforeOpen
            });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
        });
        it('after close event', () => {
            function cancelbeforeOpen(args: TooltipEventArgs) {
                expect(args.isInteracted).toBe(false);
            }
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                afterOpen: cancelbeforeOpen
            });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter            
            tooltip.close();
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(tooltipEle).toBeNull();
        });
        it('cancel before close event', () => {
            function cancelbeforeClose(args: TooltipEventArgs) {
                args.cancel = true;
                expect(args.isInteracted).toBe(false);
            }
            let tooltip: any = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                beforeClose: cancelbeforeClose
            });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            setTimeout(function () {
                expect((<HTMLElement>document.querySelector('.e-tooltip-wrap')).classList.contains("e-popup-open")).toEqual(true);
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
                done();
            }, 900);
        });

        it("delay to open tooltip", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px', openDelay: 600, animation: { open: { effect: 'None' } } });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            setTimeout(function () {
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
                done();
            }, 900);
        });

        it("delay to open tooltip", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px', openDelay: 600, animation: { open: { effect: 'None' } } });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip'), animationOptions); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            tooltip.close();
            setTimeout(function () {
                expect(document.querySelector('.e-tooltip-wrap') as HTMLElement).toBeNull();
                done();
            }, 900);
        });

        it("delay to close tooltip", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px', closeDelay: 600, animation: { close: { effect: 'None' } } });
            tooltip.appendTo('#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.querySelector('.e-tip-content').innerHTML).toEqual('Tooltip Content');
            tooltip.close();
        });
        it('content property changes when popup element does not in document', () => {
            tooltip = new Tooltip({ animation: { open: { effect: 'None' }, close: { effect: 'None' } } }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            expect(isVisible(document.querySelector('.e-tooltip-wrap'))).toBe(true);
            tooltip.close();
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            tooltip.tipPointerPosition = 'Middle';
            tooltip.dataBind();
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let x: number = parseInt((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.left, 10);
            let y: number = parseInt((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.top, 10);
            tooltip.close();
            tooltip.offsetX = 20;
            tooltip.offsetY = 20;
            tooltip.dataBind();
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            (<HTMLElement>document.getElementById('tstooltip')).style.left = "10px";
            tooltip.refresh(document.getElementById('tstooltip'));
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.querySelector('.e-tip-content').innerHTML).toEqual('Tooltip Content');
            expect((<HTMLElement>document.querySelector('.e-tooltip-wrap')).style.left).toBe("191.5px");
            tooltip.close();
            expect(document.querySelector('.e-tooltip-wrap') as HTMLElement).toBeNull();
            tooltip.close();
        });
        it("public method open test case with empty parameter", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px' }, '#tstooltip');
            let animationOptions: Object = { effect: 'FadeIn', duration: 400, delay: 10 };
            tooltip.open();
            setTimeout(function () {
                expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
                done();
            }, 500);
        });        
        it('change height and width dynamically test cases', () => {
            let elem: HTMLElement = document.createElement('button');
            let tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                content: 'Tooltip Content'
            }, '#tstooltip');
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let tip: HTMLElement = document.querySelector('.e-arrow-tip') as HTMLElement;
            let tipPreviousVal = tip.style.left;
            elem.onclick = function () {
                tooltip.height = '50px';
                tooltip.width = '150px';
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
            tooltip.open(document.getElementById('hiddenEle')); // Open the tooltip based on target element specified in optional parameter
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
        it("public method close test case with empty target", function (done) {
            tooltip = new Tooltip({ width: '100px', height: '40px' }, '#tstooltip');
            let animationOptions: Object = { effect: 'FadeIn', duration: 400, delay: 10 };
            document.getElementById("tstooltip").remove();
            tooltip.close();
            setTimeout(function () {                
                expect((document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(null);
                done();
            }, 500);
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('TopCenter');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('TopRight');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('TopLeft');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('TopRight');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('BottomCenter');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('BottomRight');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('BottomLeft');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('LeftTop');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('LeftTop');
            tooltip.close();
            setTimeout(() => {
                block.style.width = '130px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('LeftBottom');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('LeftBottom');
            tooltip.close();
            setTimeout(() => {
                block.style.width = '130px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('RightTop');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('RightTop');
            tooltip.close();
            setTimeout(() => {
                block.style.width = '130px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('RightBottom');
            tooltip.close();
            setTimeout(() => {
                block.style.height = '30px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
            expect(currentPosition).toBe('RightBottom');
            tooltip.close();
            setTimeout(() => {
                block.style.width = '130px';
                tooltip.open(button); // Open the tooltip based on target element specified in optional parameter
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
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerScrollEvent(document.body, 1000);
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });

    describe('Tooltip should not close on hover on the content element', () => {
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
            const positions = tooltipEle.getElementsByClassName('e-tip-content')[0].getBoundingClientRect();
            triggerMouseEvent(target, 'mouseover');
            triggerMouseEvent(target, 'mouseleave', positions.left, positions.top, tooltipEle);
            expect(isVisible(tooltipEle)).toBe(true);
            triggerMouseEvent(tooltipEle, 'mouseleave');
        });
    });
    describe('Check the tooltip template', () => {
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
        it('Tooltip template', () => {
            tooltip = new Tooltip({ animation: { open: { effect: 'None' }, close: { effect: 'None' } } }, '#tstooltip');
            tooltip.content = '<div>Blazor Content</div>';
            tooltip.dataBind();
            tooltip.open(document.getElementById('tstooltip')); // Open the tooltip based on target element specified in optional parameter
            let element: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            console.log(element.querySelector('.e-tip-content').innerHTML);
            expect(element.querySelector('.e-tip-content').innerHTML).toEqual('<div>Blazor Content</div>');
            tooltip.close();
        });
        it('Tooltip function template', () => {
            tooltip = new Tooltip({ animation: { open: { effect: 'None' }, close: { effect: 'None' } } }, '#tstooltip');
            tooltip.content = ()=>{return '<div>Blazor Content</div>'};
            tooltip.isAngular = true;
            tooltip.dataBind();
            tooltip.open(document.getElementById('tstooltip'));
            tooltip.close();
        });
    });

    describe('Tooltip starts with ID as number', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let ele: HTMLElement = createElement('div', { id: '1tooltip', innerHTML: 'Show Tooltip' });
            document.body.appendChild(ele);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Opens on mouse hover', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                width: '100px', height: '50px', content: 'Tooltip Content'
            });
            tooltip.appendTo( '#1tooltip');
            let target: HTMLElement = document.getElementById('1tooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            triggerMouseEvent(target, 'mouseover');
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseover');
            document.getElementById('1tooltip').removeAttribute('aria-describedby');
            expect(isVisible(document.querySelector('.e-tooltip-wrap') as HTMLElement)).toBe(true);
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });

        it('Opens on Click', () => {
            tooltip = new Tooltip({
                animation: { open: { effect: 'None' }, close: { effect: 'None' } },
                opensOn: 'Click'
            });
            tooltip.appendTo( '#1tooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            let target: HTMLElement = document.getElementById('1tooltip');
            triggerMouseEvent(target, 'mousedown');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(isVisible(tooltipEle)).toBe(true);
            triggerMouseEvent(target, 'mousedown');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
       
    });

    describe('Tooltip within container', () => {
        let tooltip: Tooltip;
        beforeEach((): void => {
            tooltip = undefined;
            let container: HTMLElement = createElement('div', { id: 'container', styles: "height:500px; width:500px;" });
            let container1: HTMLElement = createElement('div', { id: 'container1', styles: "height:300px; width:300px;" });
            let ele: HTMLElement = createElement('div', { id: '1tooltip', innerHTML: 'Show Tooltip', styles: "margin-top:300px;" });
            container.appendChild(ele);
            document.body.appendChild(container);
            document.body.appendChild(container1);
        });
        afterEach((): void => {
            if (tooltip) {
                tooltip.destroy();
            }
            document.body.innerHTML = '';
        });
        it('Check popup finds string selector container', () => {
            tooltip = new Tooltip({
                container: "#container"
            });
            tooltip.appendTo('#1tooltip');
            let target: HTMLElement = document.getElementById('1tooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            triggerMouseEvent(target, 'mouseover');
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseover');
            expect(document.querySelector("#container").querySelectorAll('.e-tooltip-wrap').length == 1).toBe(true);
            let element: HTMLElement = document.querySelector("#container").querySelector('.e-tooltip-wrap') as HTMLElement;
            expect(element.style.left).toEqual("234px");
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseleave');
            expect(document.querySelector("#container").querySelectorAll('.e-tooltip-wrap').length == 0).toBe(true);
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });

        it('Check popup finds Element selector container', () => {
            tooltip = new Tooltip({
                container: document.getElementById('container')
            });
            tooltip.appendTo('#1tooltip');
            let target: HTMLElement = document.getElementById('1tooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            triggerMouseEvent(target, 'mouseover');
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseover');
            expect(document.querySelector("#container").querySelectorAll('.e-tooltip-wrap').length == 1).toBe(true);
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseleave');
            expect(document.querySelector("#container").querySelectorAll('.e-tooltip-wrap').length == 0).toBe(true);
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });

        it('Check popup changes for dynamic container when Tooltip is open', () => {
            tooltip = new Tooltip({
                container: document.getElementById('container'), opensOn: "Custom"
            });
            tooltip.appendTo('#1tooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            tooltip.open();
            expect(document.querySelector("#container").querySelectorAll('.e-tooltip-wrap').length == 1).toBe(true);
            tooltip.container = "#container1";
            tooltip.dataBind();
            expect(document.querySelector("#container").querySelectorAll('.e-tooltip-wrap').length == 1).toBe(false);
            expect(document.querySelector("#container1").querySelectorAll('.e-tooltip-wrap').length == 1).toBe(true);
        });

        it('Check popup changes for dynamic container when Tooltip on close initially', () => {
            tooltip = new Tooltip({
                container: document.getElementById('container'), opensOn: "Custom"
            });
            tooltip.appendTo('#1tooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            tooltip.container = "#container1";
            tooltip.dataBind();
            tooltip.open();
            expect(document.querySelector("#container").querySelectorAll('.e-tooltip-wrap').length == 1).toBe(false);
            expect(document.querySelector("#container1").querySelectorAll('.e-tooltip-wrap').length == 1).toBe(true);
        });

        it('Check popup changes for dynamic container when Tooltip is not open', () => {
            tooltip = new Tooltip({
                container: document.getElementById('container')
            });
            tooltip.appendTo('#1tooltip');
            let target: HTMLElement = document.getElementById('1tooltip');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(target, 'mouseover');
            let tooltipEle: HTMLElement = document.querySelector('.e-tooltip-wrap') as HTMLElement;
            triggerMouseEvent(target, 'mouseover');
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseover');
            expect(document.querySelector("#container").querySelectorAll('.e-tooltip-wrap').length == 1).toBe(true);
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseleave');
            tooltip.container = "#container1";
            expect(document.querySelector("#container").querySelectorAll('.e-tooltip-wrap').length == 0).toBe(true);
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseover');
            expect(document.querySelector("#container1").querySelectorAll('.e-tooltip-wrap').length == 1).toBe(true);
            triggerMouseEvent(document.getElementById('1tooltip'), 'mouseleave');
            expect(document.querySelector('.e-tooltip-wrap')).toBeNull();
        });
    });

    describe('Tooltip Null or undefined value testing ', () => {
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
        it('width', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", width: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.width).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", width: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.width).toBe('auto');
            tooltip.destroy();
        });
        it('height', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", height: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.height).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", height: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.height).toBe('auto');
            tooltip.destroy();
        });
        it('content', () => {
            tooltip = new Tooltip({ content: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.content).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.content).toBe(undefined);
            tooltip.destroy();
        });
        it('container', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", container: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.container).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", container: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.container).toBe('body');
            tooltip.destroy();
        });
        it('target', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", target: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.target).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", target: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.target).toBe(undefined);
            tooltip.destroy();
        });
        it('opensOn', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", opensOn: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.opensOn).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", opensOn: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.opensOn).toBe('Auto');
            tooltip.destroy();
        });
        it('position', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", position: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.position).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", position: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.position).toBe('TopCenter');
            tooltip.destroy();
        });
        it('tipPointerPosition', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", tipPointerPosition: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.tipPointerPosition).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", tipPointerPosition: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.tipPointerPosition).toBe('Auto');
            tooltip.destroy();
        });
        it('offsetX', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", offsetX: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.offsetX).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", offsetX: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.offsetX).toBe(0);
            tooltip.destroy();
        });
        it('offsetY', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", offsetY: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.offsetY).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", offsetY: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.offsetY).toBe(0);
            tooltip.destroy();
        });
        it('cssClass', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", cssClass: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.cssClass).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", cssClass: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.cssClass).toBe(undefined);
            tooltip.destroy();
        });
        it('animation', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", animation: {
                open: { effect: null },
                close: { effect: null }
            } }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.animation.open.effect).toBe(null);
            expect(tooltip.animation.close.effect).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", animation: {
                open: { effect: undefined },
                close: { effect: undefined }
            } }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.animation.open.effect).toBe(undefined);
            expect(tooltip.animation.close.effect).toBe(undefined);
            tooltip.destroy();
        });
        // windowCollision
        it('windowCollision', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", windowCollision: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.windowCollision).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", windowCollision: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.windowCollision).toBe(false);
            tooltip.destroy();
        });
        // mouseTrail
        it('mouseTrail', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", mouseTrail: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.mouseTrail).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", mouseTrail: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.mouseTrail).toBe(false);
            tooltip.destroy();
        });
        // showTipPointer
        it('showTipPointer', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", showTipPointer: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.showTipPointer).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", showTipPointer: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.showTipPointer).toBe(true);
            tooltip.destroy();
        });
        // tipPointerPosition
        it('tipPointerPosition', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", tipPointerPosition: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.tipPointerPosition).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", tipPointerPosition: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.tipPointerPosition).toBe('Auto');
            tooltip.destroy();
        });
        // isSticky
        it('isSticky', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", isSticky: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.isSticky).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", isSticky: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.isSticky).toBe(false);
            tooltip.destroy();
        });
        // openDelay
        it('openDelay', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", openDelay: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.openDelay).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", openDelay: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.openDelay).toBe(0);
            tooltip.destroy();
        });
        // closeDelay
        it('closeDelay', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", closeDelay: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.closeDelay).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", closeDelay: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.closeDelay).toBe(0);
            tooltip.destroy();
        });
        // htmlAttributes
        it('htmlAttributes', () => {
            tooltip = new Tooltip({ content: "Tooltip Content", htmlAttributes: null }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.htmlAttributes).toBe(null);
            tooltip.destroy();
            tooltip = new Tooltip({ content: "Tooltip Content", htmlAttributes: undefined }, '#tstooltip');
            tooltip.dataBind();
            expect(tooltip.htmlAttributes).not.toBe(null);
            tooltip.destroy();
        });
        
    });
});
