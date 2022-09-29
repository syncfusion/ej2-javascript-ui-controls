/* eslint-disable @typescript-eslint/no-unused-vars */
import { print as printFunction, createElement } from '@syncfusion/ej2-base';
import { Maps } from '../../index';
import { getElement, getClientElement } from '../utils/helper';
import { IPrintEventArgs } from '../model/interface';
import { beforePrint } from '../model/constants';

/**
 * This module enables the print functionality in maps.
 *
 * @hidden
 */
export class Print {

    /**
     * Constructor for Maps
     *
     * @param {Maps} control - Specifies the instance of the map
     */
    constructor(control: Maps) { }

    /**
     * To print the Maps
     *
     * @param {string[] | string | Element} elements - Specifies the element
     * @returns {void}
     * @private
     */
    public print(maps: Maps, elements?: string[] | string | Element): void {
        let printWindow: Window = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        printWindow.moveTo(0, 0);
        printWindow.resizeTo(screen.availWidth, screen.availHeight);
        const argsData: IPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(maps, elements), name: beforePrint
        };
        maps.trigger('beforePrint', argsData, (beforePrintArgs: IPrintEventArgs) => {
            if (!argsData.cancel) {
                printFunction(argsData.htmlContent, printWindow);
            }
        });
    }

    /**
     * To get the html string of the Maps
     *
     * @param {string[] | string | Element} elements - Specifies the html element
     * @returns {Element} - Returns the div element
     * @private
     */
    private getHTMLContent(maps: Maps, elements?: string[] | string | Element): Element {
        let div: Element = createElement('div');
        let divElement: Element = maps.element.cloneNode(true) as Element;
        if (maps.isTileMap) {
            for (let i: number = 0; i < divElement.childElementCount; i++) {
                if (divElement.children[i].id === maps.element.id + '_tile_parent') {
                    (divElement.children[i] as HTMLElement).style.removeProperty('height');
                    (divElement.children[i] as HTMLElement).style.removeProperty('width');
                    (divElement.children[i] as HTMLElement).style.removeProperty('top');
                    (divElement.children[i] as HTMLElement).style.removeProperty('left');
                    (divElement.children[i] as HTMLElement).style.removeProperty('right');
                    (divElement.children[i] as HTMLElement).style.removeProperty('overflow');
                    const svgElement: HTMLElement = document.getElementById(maps.element.id + '_Tile_SVG_Parent');
                    (divElement.children[i].children[0] as HTMLElement).style.overflow = 'hidden';
                    (divElement.children[i].children[0] as HTMLElement).style.position = 'absolute';
                    (divElement.children[i].children[0] as HTMLElement).style.height = svgElement.style.height;
                    (divElement.children[i].children[0] as HTMLElement).style.width = svgElement.style.width;
                    (divElement.children[i].children[0] as HTMLElement).style.left = svgElement.style.left;
                    (divElement.children[i].children[0] as HTMLElement).style.top = svgElement.style.top;
                    break;
                }
            }
        }
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
            div.appendChild(divElement);
        }
        return div;
    }
    /**
     * Get module name.
     *
     * @returns {string} Returns the module name
     */
    protected getModuleName(): string {
        return 'Print';
    }

    /**
     * To destroy the print.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void { }
}
