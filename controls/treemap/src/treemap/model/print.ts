import { print as printFunction, createElement } from '@syncfusion/ej2-base';
import { TreeMap} from '../../index';
import { getElement } from '../utils/helper';
import { IPrintEventArgs } from '../model/interface';
import { beforePrint } from '../model/constants';

/**
 * Print module handles the print functionality for treemap.
 *
 * @hidden
 */
export class Print {

    /**
     * Constructor for Maps
     *
     * @param {TreeMap} control - Specifies the treemap instance.
     */
    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    constructor(control: TreeMap) {
    }

    /**
     * This method is used to perform the print functionality in treemap.
     *
     * @param { string[] | string | Element} elements - Specifies the element.
     * @returns {void}
     * @private
     */
    public print(treeMap: TreeMap, elements?: string[] | string | Element): void {
        let printWindow: Window = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        printWindow.moveTo(0, 0);
        printWindow.resizeTo(screen.availWidth, screen.availHeight);
        const argsData: IPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(treeMap, elements), name: beforePrint
        };
        treeMap.trigger(beforePrint, argsData, () => {
            if (!argsData.cancel) {
                printFunction(argsData.htmlContent, printWindow);
            }
        });
    }

    /**
     * To get the html string of the Maps
     *
     * @param {string[] | string | Element} elements - Specifies the element
     * @returns {Element} - Returns the element
     * @private
     */
    public getHTMLContent(treeMap: TreeMap, elements?: string[] | string | Element): Element {
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
            div.appendChild(treeMap.element.cloneNode(true) as Element);
        }
        return div;
    }

    /**
     * Get module name.
     *
     * @returns {string} - Returns the module name.
     */
    protected getModuleName(): string {
        // Returns te module name
        return 'Print';
    }
    /**
     * To destroy the Print module.
     * 
     * @returns {void}
     * @private
     */
    public destroy(): void { }
}
