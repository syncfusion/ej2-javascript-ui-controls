import { print as printWindow, createElement } from '@syncfusion/ej2-base';
import { Maps } from '../../index';
import { getElement } from '../utils/helper';
import { IPrintEventArgs } from '../model/interface';
import { beforePrint } from '../model/constants';

/**
 * This module enables the print functionality in maps.
 * @hidden
 */
export class Print {
    private control: Maps;
    private printWindow: Window;

    /**
     * Constructor for Maps
     * @param control 
     */
    constructor(control: Maps) {
        this.control = control;
    }

    /**
     * To print the Maps
     * @param elements 
     * @private
     */
    public print(elements?: string[] | string | Element): void {
        this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        this.printWindow.moveTo(0, 0);
        this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
        let argsData: IPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(elements), name: beforePrint
        };
        this.control.trigger('beforePrint', argsData, (beforePrintArgs: IPrintEventArgs) => {
            if (!argsData.cancel) {
                printWindow(argsData.htmlContent, this.printWindow);
            }
        });
    }

    /**
     * To get the html string of the Maps 
     * @param elements 
     * @private
     */
    private getHTMLContent(elements?: string[] | string | Element): Element {
        let div: Element = createElement('div');
        if (elements) {
            if (elements instanceof Array) {
                Array.prototype.forEach.call(elements, (value: string) => {
                    div.appendChild(getElement(value).cloneNode(true) as Element);
                });
            } else if (elements instanceof Element) {
                div.appendChild(elements.cloneNode(true) as Element);
            } else {
                div.appendChild(getElement(elements).cloneNode(true) as Element);
            }
        } else {
            div.appendChild(this.control.element.cloneNode(true) as Element);
        }
        return div;
    }
     /**
      * Get module name.
      */
    protected getModuleName(): string {
        return 'Print';
    }

    /**
     * To destroy the print.
     * @return {void}
     * @private
     */
    public destroy(maps: Maps): void {
        /**
         * Destroy method performed here
         */
    }
} 