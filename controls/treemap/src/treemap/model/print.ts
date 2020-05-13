import { print as printWindow, createElement } from '@syncfusion/ej2-base';
import { TreeMap} from '../../index';
import { getElement } from '../utils/helper';
import { IPrintEventArgs } from '../model/interface';
import { beforePrint } from '../model/constants';

/**
 * Print module handles the print functionality for treemap. 
 * @hidden
 */
export class Print {
    private control: TreeMap ;
    private printWindow: Window;

    /**
     * Constructor for Maps
     * @param control 
     */
    constructor(control: TreeMap) {
        this.control = control;
    }

    /**
     * This method is used to perform the print functionality in treemap.
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
        this.control.trigger(beforePrint, argsData, () => {
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
    public getHTMLContent(elements?: string[] | string | Element): Element {
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
        // Returns te module name
            return 'Print';
    }
    /**
     * To destroy the legend. 
     * @return {void}
     * @private
     */
    public destroy(treemap: TreeMap): void {
            /**
             * Destroy method performed here
             */
    }
}