import { print as printFunction, createElement } from '@syncfusion/ej2-base';
import { CircularGauge } from '../../index';
import { getElement } from '../utils/helper-common';
import { IPrintEventArgs } from './interface';
import { beforePrint } from './constants';


/**
 * Represent the print for gauge
 *
 * @hidden
 */
export class Print {

    /**
     * Constructor for gauge
     *
     * @param {CircularGauge} control - Specifies the instance of the gauge.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(control: CircularGauge) {
    }

    /**
     * To print the gauge
     *
     * @param {CircularGauge} gauge - Specifies the instance of Circular Gauge.
     * @param {string[] | string | Element} elements - Specifies the element.
     * @returns {void}
     * @private
     */
    public print(gauge: CircularGauge, elements?: string[] | string | Element): void {
        let printWindow: Window = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        printWindow.moveTo(0, 0);
        printWindow.resizeTo(screen.availWidth, screen.availHeight);
        const argsData: IPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(gauge, elements), name: beforePrint
        };
        gauge.trigger('beforePrint', argsData, (beforePrintArgs: IPrintEventArgs) => {
            if (!argsData.cancel) {
                printFunction(argsData.htmlContent, printWindow);
            }
        });
    }

    /**
     * To get the html string of the gauge
     *
     * @param {CircularGauge} gauge - Specifies the instance of Circular Gauge.
     * @param { string[] | string | Element} elements - Specifies the element.
     * @returns {Element} - Returns the div element.
     * @private
     */
    public getHTMLContent(gauge: CircularGauge, elements?: string[] | string | Element): Element {
        const div: Element = createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                elements.forEach((value: string) => {
                    div.appendChild(getElement(value).cloneNode(true) as Element);
                });
            } else if (elements instanceof Element) {
                div.appendChild(elements.cloneNode(true) as Element);
            } else {
                div.appendChild(getElement(elements).cloneNode(true) as Element);
            }
        } else {
            div.appendChild(gauge.element.cloneNode(true) as Element);
        }
        return div;
    }


    protected getModuleName(): string {
        // Returns te module name
        return 'Print';
    }

    /**
     * To destroy the Print.
     * 
     * @returns {void}
     * @private
     */
    public destroy(): void { }
    
}
