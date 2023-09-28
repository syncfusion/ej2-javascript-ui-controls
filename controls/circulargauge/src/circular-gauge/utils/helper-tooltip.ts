/**
 * Specifies Circular-Gauge Tooltip Helper methods
 */

import { GaugeLocation, getTemplateFunction, Size } from './helper-common';
import { remove } from '@syncfusion/ej2-base';
import { CircularGauge } from '../circular-gauge';

/**
 * Function to get the mouse position
 *
 * @param {number} pageX - Specifies the pageX value.
 * @param {number} pageY - Specifies the pageY value.
 * @param {Element} element - Specifies the element.
 * @returns {GaugeLocation} - Returns the location.
 *
 * @private
 */
export function getMousePosition(pageX: number, pageY: number, element: Element): GaugeLocation {
    const elementRect: ClientRect = element.getBoundingClientRect();
    const pageXOffset: number = element.ownerDocument.defaultView.pageXOffset;
    const pageYOffset: number = element.ownerDocument.defaultView.pageYOffset;
    const clientTop: number = element.ownerDocument.documentElement.clientTop;
    const clientLeft: number = element.ownerDocument.documentElement.clientLeft;
    const positionX: number = elementRect.left + pageXOffset - clientLeft;
    const positionY: number = elementRect.top + pageYOffset - clientTop;
    return new GaugeLocation((pageX - positionX), (pageY - positionY));
}
/**
 * function to get the size of the element.
 *
 * @param {string} template - Specifies the template element.
 * @param {CircularGauge} gauge - Specifies the gauge instance.
 * @param {HTMLElement} parent - specifies the element.
 * @returns {Size} - Return the size of the element
 *
 * @private
 */
export function getElementSize(template: string | Function, gauge: CircularGauge, parent: HTMLElement): Size {
    let elementSize: Size; let element: HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const templateFn: any = getTemplateFunction(template, gauge);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tooltipData: Element[] = templateFn ? ((gauge as any).isVue || (gauge as any).isVue3) ? templateFn({}, gauge, null, gauge.element.id + 'Template')
        : templateFn({}, null, null, gauge.element.id + 'Template') : [];
    if (templateFn && tooltipData.length) {
        element = gauge.createElement('div', { id: gauge.element.id + '_Measure_Element' });
        gauge.element.appendChild(element);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const templateElement: HTMLCollection = ((gauge as any).isVue || (gauge as any).isVue3) ? templateFn({}, gauge, null, gauge.element.id + 'Template')
            : templateFn({}, null, null, gauge.element.id + 'Template');
        let templateLength: number = templateElement.length;
        while (templateLength > 0) {
            element.appendChild(templateElement[0]);
            templateLength--;
        }
        parent.appendChild(element);
        elementSize = new Size(parent.getBoundingClientRect().width, parent.getBoundingClientRect().height);
        remove(element);
    }
    return elementSize;
}
