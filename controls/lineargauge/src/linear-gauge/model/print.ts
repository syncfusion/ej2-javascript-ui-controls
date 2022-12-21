import { print as printFunction, createElement } from '@syncfusion/ej2-base';
import { LinearGauge} from '../../index';
import { getElement } from '../utils/helper';
import { IPrintEventArgs } from '../model/interface';
import { beforePrint } from '../model/constant';

/**
 * Represent the print and export for gauge.
 *
 * @hidden
 */
export class Print {

    /**
     * Constructor for gauge
     *
     * @param {LinearGauge} control - Specifies the linear gauge instance.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    constructor(control: LinearGauge) {
    }

    /**
     * To print the gauge
     *
     * @param elements
     * @private
     */

    public print(gauge: LinearGauge, elements?: string[] | string | Element): void {
        const printWindow: Window = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        printWindow.moveTo(0, 0);
        printWindow.resizeTo(screen.availWidth, screen.availHeight);
        const argsData: IPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(gauge, elements), name: beforePrint
        };
        gauge.trigger('beforePrint', argsData, () => {
            if (!argsData.cancel) {
                printFunction(argsData.htmlContent, printWindow);
            }
        });
    }

    /**
     * To get the html string of the gauge
     *
     * @param elements
     * @private
     */

    private getHTMLContent(gauge : LinearGauge, elements?: string[] | string | Element): Element {
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

    /**
     * Get module name.
     */

    protected getModuleName(): string {
        return 'Print';
    }

    /**
     * To destroy the print.
     *
     * @return {void}
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public destroy(): void {
    }
}
