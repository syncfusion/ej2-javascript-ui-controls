/**
 * tooltip spec document
 */
import { createElement, isVisible } from '@syncfusion/ej2-base'
import { Tooltip, TooltipEventArgs } from '../../src/tooltip/tooltip';
import '../../node_modules/es6-promise/dist/es6-promise';
import { enableBlazorMode, disableBlazorMode } from '@syncfusion/ej2-base';



describe('Tooltip blazor coverage fix', () => {
    describe('Ensure the Public methods, Event arguments for blazor', () => {
        let tooltip: any;

        beforeAll(() => {
            let tooltipElement: HTMLElement = createElement('div', { id: 'tooltip1' });
            document.body.appendChild(tooltipElement);
            tooltip = new Tooltip({ content: 'First demo content' });
            tooltip.appendTo('#tooltip1');
            tooltip.isServerRendered = true;
        });

        beforeEach(() => {
            enableBlazorMode();
        });

        it("Coverage for tooltip show", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            contentElement.appendChild(outerArrowElement);
            contentElement.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip.renderArrow();
        });

        it("Coverage for beforeRenderCallback", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            contentElement.appendChild(outerArrowElement);
            contentElement.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            let args: TooltipEventArgs = { element: document.getElementById('tooltip1'), target: document.getElementById('tooltip1'), type: "", event: null, cancel: false };
            (window as any).sfBlazor = { updateModel: (args: any) => { return true; } };
            tooltip.beforeRenderCallback(args);
        });

        it("Coverage for dynamic tooltip content", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip.content = "Hi";
            tooltip.height = "50px";
            tooltip.width = "100px";
        });

        it("Coverage for dynamic tooltip cssClass", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip["interopAdaptor"] = function () { };
            tooltip.interopAdaptor["invokeMethodAsync"] = function () { return Promise.resolve(); };
            tooltip.cssClass = "checkcssClass";
        });

        it("Coverage for dynamic tooltip height", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip["interopAdaptor"] = function () { };
            tooltip.interopAdaptor["invokeMethodAsync"] = function () { return Promise.resolve(); };
            tooltip.height = "100px";
        });

        it("Coverage for dynamic tooltip width", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip["interopAdaptor"] = function () { };
            tooltip.interopAdaptor["invokeMethodAsync"] = function () { return Promise.resolve(); };
            tooltip.width = "100px";
        });

        it("Coverage for tooltip content", () => {
            tooltip["interopAdaptor"] = function () { };
            tooltip.interopAdaptor["invokeMethodAsync"] = function () { return Promise.resolve(); };
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            document.body.appendChild(element);
            let args: TooltipEventArgs = { element: document.getElementById('tooltip1'), target: document.getElementById('tooltip1'), type: "", event: null, cancel: false };
            tooltip.beforeRenderCallback(args);
        });

        it("Coverage for contentUpdated", () => {
            tooltip["interopAdaptor"] = function () { };
            tooltip.interopAdaptor["invokeMethodAsync"] = function () { return Promise.resolve(); };
            let element: HTMLElement = createElement('div', { id: 'tooltip1_content' });
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            document.body.appendChild(element);
            tooltip.contentTargetValue = null;
            tooltip.contentEvent = null
            tooltip.contentAnimation = null;
            tooltip.contentUpdated(true);
        });

        it("Coverage for clear function", () => {
            tooltip["interopAdaptor"] = function () { };
            tooltip.interopAdaptor["invokeMethodAsync"] = function () { return Promise.resolve(); };
            let element: HTMLElement = createElement('div', { id: 'tooltip1' });
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            document.body.appendChild(element);
            tooltip.clear();
        });

        it("Coverage for RTL", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            let rtl: HTMLElement = createElement('div', { className: 'e-rtl' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            innerContent.appendChild(rtl);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip.enableRtl = true;
            tooltip.content = "Enabled Rtl";
        });

        it("Coverage for Is Sticky openDelay tooltip", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            let stickyIcon: HTMLElement = createElement('div', { className: 'e-icons' });
            let stickyClose: HTMLElement = createElement('div', { className: 'e-tooltip-close' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            element.appendChild(stickyIcon);
            element.appendChild(stickyClose);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip.isSticky = true;
            tooltip.openDelay = 1000;
            tooltip.closeDelay = 1000;
            tooltip.enablePersistence = true;
            tooltip.content = "Is Sticky";

        });

        it("Coverage for Mouse Trail tooltip and tip pointer", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            let mouseTrail: HTMLElement = createElement('div', { className: 'e-tip-bottom' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            element.appendChild(mouseTrail);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip.content = 'Mouse Trail';
            tooltip.position = 'TopCenter';
            tooltip.showTipPointer = true;
        });

        it("Coverage for tooltip position and Offset", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            let positionLeft: HTMLElement = createElement('div', { className: 'e-tip-left' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            element.appendChild(positionLeft);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip.content = "Position";
            tooltip.OffsetX = 5;
            tooltip.OffsetY = 5;

        });

        it("Coverage for customize tooltip", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let wrap: HTMLElement = createElement('div', { className: 'e-tooltip-wrap' });
            let popup: HTMLElement = createElement('div', { className: 'e-popup' });
            let customize: HTMLElement = createElement('div', { className: 'e-lib' });
            let popupOpen: HTMLElement = createElement('div', { className: 'e-popup-open' });
            element.appendChild(innerContent);
            innerContent.appendChild(wrap);
            innerContent.appendChild(popup);
            element.appendChild(contentElement);
            element.appendChild(popupOpen);
            element.appendChild(customize);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip.content = "Coustomiz tooltip";
        });

        it("Coverage tipPointer position", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            let tipPointer: HTMLElement = createElement('div', { className: 'e-tip-bottom' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            element.appendChild(tipPointer);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip["interopAdaptor"] = function () { };
            tooltip.interopAdaptor["invokeMethodAsync"] = function () { return Promise.resolve(); };
            tooltip.cssClass = "checkcssClass";
        });

        it("Coverage for dynamic tooltip cssClass", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip["interopAdaptor"] = function () { };
            tooltip.interopAdaptor["invokeMethodAsync"] = function () { return Promise.resolve(); };
            tooltip.cssClass = "customtip";
        });

        it("Coverage for animation", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            tooltip["interopAdaptor"] = function () { };
            tooltip.interopAdaptor["invokeMethodAsync"] = function () { return Promise.resolve(); };
            tooltip.cssClass = "customtip";
            tooltip.animation.open = { effect: 'ZoomIn', duration: 400, delay: 10 };
        });

        it("Coverage Tooltip destroy method", () => {
            let placeholder_element: HTMLElement = createElement('div', { id: 'tooltip1_content_placeholder' });
            let element: HTMLElement = createElement('div', { id: 'tooltip1_content' });
            let contentElement: HTMLElement = createElement('div', { className: 'e-tip-content' });
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            element.appendChild(innerContent);
            element.appendChild(contentElement);
            tooltip.tooltipEle = element;
            document.body.appendChild(tooltip.tooltipEle);
            document.body.appendChild(placeholder_element);
            tooltip.content = "Coustomiz tooltip";
            tooltip.destroy();
        });

        afterEach(() => {
            disableBlazorMode();
            tooltip.tooltipEle = null;
        });

        afterAll(() => {
            disableBlazorMode();
            delete (window as any).Blazor;
            tooltip.destroy();
            document.body.innerHTML = '';
        });

    });
});

