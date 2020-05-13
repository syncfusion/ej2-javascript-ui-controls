import { print as printWindow, createElement } from '@syncfusion/ej2-base';
import { LinearGauge} from '../../index';
import { getElement } from '../utils/helper';
import { IPrintEventArgs } from '../model/interface';
import { beforePrint } from '../model/constant';

/**
 * Represent the print and export for gauge.
 * @hidden
 */
export class Print {
    private control: LinearGauge;
    private printWindow: Window;

    /**
     * Constructor for gauge
     * @param control 
     */
    constructor(control: LinearGauge) {
        this.control = control;
    }

     /**
      * To print the gauge
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
      * To get the html string of the gauge
      * @param elements 
      * @private
      */
    private getHTMLContent(elements?: string[] | string | Element): Element {
        let div: Element = createElement('div');
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
    public destroy(control: LinearGauge): void {
        /**
         * Destroy method performed here
         */
    }
}