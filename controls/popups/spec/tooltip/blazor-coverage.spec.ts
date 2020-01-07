/**
 * tooltip spec document
 */
import { createElement } from '@syncfusion/ej2-base'
import { Tooltip, TooltipEventArgs  } from '../../src/tooltip/tooltip';
import '../../node_modules/es6-promise/dist/es6-promise';
import { enableBlazorMode, disableBlazorMode } from '@syncfusion/ej2-base';



describe('Tooltip blazor coverage fix', () => {
    describe('Ensure the Public methods, Event arguments for blazor', () => {
        let tooltip: any;
        
        beforeAll(() => {
            let tooltipElement: HTMLElement = createElement('div', { id: 'tooltip1' });
            document.body.appendChild(tooltipElement);
            tooltip = new Tooltip({content:'First demo content' });
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
           let args:TooltipEventArgs =  {element: document.getElementById('tooltip1'), target: document.getElementById('tooltip1'), type:"", event: null, cancel: false};
           (window as any).ejsInterop={ updateModel:(args: any)=> {return true;}};
            tooltip.beforeRenderCallback(args);
        });

        it("Coverage for dynamic tooltip content", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', {className: 'e-tip-content'});
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
        });

        it("Coverage for dynamic tooltip cssClass", () => {
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', {className: 'e-tip-content'});
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
            let contentElement: HTMLElement = createElement('div', {className: 'e-tip-content'});
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
            let contentElement: HTMLElement = createElement('div', {className: 'e-tip-content'});
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
            tooltip["interopAdaptor"] = function(){};
            tooltip.interopAdaptor["invokeMethodAsync"] = function () {return Promise.resolve();};
            let element: HTMLElement = createElement('div', {});
            let contentElement: HTMLElement = createElement('div', {className: 'e-tip-content'});
            let innerContent: HTMLElement = createElement('div', { className: 'e-arrow-tip' });
            let outerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-outer' });
            let innerArrowElement: HTMLElement = createElement('div', { className: 'e-arrow-tip-inner' });
            innerContent.appendChild(outerArrowElement);
            innerContent.appendChild(innerArrowElement);
            element.appendChild(contentElement);
            element.appendChild(innerContent);
            document.body.appendChild(element);
            let args:TooltipEventArgs =  {element: document.getElementById('tooltip1'), target: document.getElementById('tooltip1'), type:"", event: null, cancel: false};            
            tooltip.beforeRenderCallback(args);
        });

        it("Coverage for contentUpdated", () => {
            tooltip["interopAdaptor"] = function(){};
            tooltip.interopAdaptor["invokeMethodAsync"] = function () {return Promise.resolve();};
            let element: HTMLElement = createElement('div', {id: 'tooltip1_content'});
            let contentElement: HTMLElement = createElement('div', {className: 'e-tip-content'});
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
            tooltip["interopAdaptor"] = function(){};
            tooltip.interopAdaptor["invokeMethodAsync"] = function () {return Promise.resolve();};
            let element: HTMLElement = createElement('div', {id: 'tooltip1'});
            let contentElement: HTMLElement = createElement('div', {className: 'e-tip-content'});
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

