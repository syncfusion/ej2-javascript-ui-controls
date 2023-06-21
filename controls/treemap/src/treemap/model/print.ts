import { print as printFunction, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    constructor(control: TreeMap) {
    }

    /**
     * This method is used to perform the print functionality in treemap.
     *
     * @param {TreeMap} treeMap - Specifies the treemap instance.
     * @param { string[] | string | Element} elements - Specifies the element.
     * @returns {void}
     * @private
     */
    public print(treeMap: TreeMap, elements?: string[] | string | Element): void {
        const printWindow: Window = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
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
     * @param {TreeMap} treeMap - Specifies the treemap instance.
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
            const exportElement: HTMLElement = treeMap.element.cloneNode(true)  as HTMLElement;
            let backgroundElement: HTMLElement = exportElement.childNodes[1] as HTMLElement;
            if (!isNullOrUndefined(backgroundElement)) {
                backgroundElement = backgroundElement.childNodes[0] as HTMLElement;
                const backgroundColor: string = backgroundElement.getAttribute('fill');
                if ((treeMap.theme === 'Tailwind' || treeMap.theme === 'Bootstrap5' || treeMap.theme === 'Fluent' || treeMap.theme === 'Material3') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                    (exportElement.childNodes[1].childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
                } else if ((treeMap.theme === 'TailwindDark' || treeMap.theme === 'Bootstrap5Dark' || treeMap.theme === 'FluentDark' || treeMap.theme === 'Material3Dark') && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                    (exportElement.childNodes[1].childNodes[0] as HTMLElement).setAttribute('fill', 'rgba(0, 0, 0, 1)');
                }
            }
            div.appendChild(exportElement as Element);
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public destroy(): void { }
}
