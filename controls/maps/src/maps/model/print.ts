import { print as printFunction, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Maps } from '../../index';
import { getElement } from '../utils/helper';
import { IPrintEventArgs } from '../model/interface';
import { beforePrint } from '../model/constants';

/**
 * This module enables the print functionality in maps.
 *
 * @hidden
 */
export class Print {

    /**
     * Constructor for Maps.
     *
     * @param {Maps} control - Specifies the instance of the Maps
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    constructor(control: Maps) { }

    /**
     * To print the Maps.
     *
     * @param {Maps} maps -Specifies the Maps instance.
     * @param {string[] | string | Element} elements - Specifies the element of the Maps
     * @returns {void}
     * @private
     */
    public print(maps: Maps, elements?: string[] | string | Element): void {
        const printWindow: Window = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
        printWindow.moveTo(0, 0);
        printWindow.resizeTo(screen.availWidth, screen.availHeight);
        const argsData: IPrintEventArgs = {
            cancel: false, htmlContent: this.getHTMLContent(maps, elements), name: beforePrint
        };
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        maps.trigger('beforePrint', argsData, (beforePrintArgs: IPrintEventArgs) => {
            if (!argsData.cancel) {
                printFunction(argsData.htmlContent, printWindow);
            }
        });
    }

    /**
     * To get the html string of the Maps.
     *
     * @param {Maps} maps -Specifies the Maps instance.
     * @param {string[] | string | Element} elements - Specifies the html element
     * @returns {Element} - Returns the div element
     * @private
     */
    private getHTMLContent(maps: Maps, elements?: string[] | string | Element): Element {
        const div: Element = createElement('div');
        const divElement: Element = maps.element.cloneNode(true) as Element;
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        let backgroundElement: HTMLElement = (!maps.isTileMap ? divElement.getElementsByTagName('svg')[0] as any : divElement.getElementsByTagName('svg')[1] as any) as HTMLElement;
        if (!isNullOrUndefined(backgroundElement)) {
            backgroundElement = backgroundElement.childNodes[0] as HTMLElement;
            if (!isNullOrUndefined(backgroundElement)) {
                const backgroundColor: string = backgroundElement.getAttribute('fill');
                if ((maps.theme === 'Tailwind' || maps.theme === 'Bootstrap5' || maps.theme === 'Fluent' || maps.theme === 'Material3' ||
                    maps.theme === 'Fluent2')
                    && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                    (backgroundElement as HTMLElement).setAttribute('fill', 'rgba(255,255,255, 1)');
                } else if ((maps.theme === 'TailwindDark' || maps.theme === 'Bootstrap5Dark' || maps.theme === 'FluentDark' || maps.theme === 'Material3Dark' ||
                    maps.theme === 'Fluent2Dark' || maps.theme === 'Fluent2HighContrast')
                    && (backgroundColor === 'rgba(255,255,255, 0.0)' || backgroundColor === 'transparent')) {
                    (backgroundElement as HTMLElement).setAttribute('fill', 'rgba(0, 0, 0, 1)');
                }
            }
        }
        if (maps.isTileMap) {
            for (let i: number = 0; i < divElement.childElementCount; i++) {
                if (divElement.children[i as number].id === maps.element.id + '_tile_parent') {
                    (divElement.children[i as number] as HTMLElement).style.removeProperty('height');
                    (divElement.children[i as number] as HTMLElement).style.removeProperty('width');
                    (divElement.children[i as number] as HTMLElement).style.removeProperty('top');
                    (divElement.children[i as number] as HTMLElement).style.removeProperty('left');
                    (divElement.children[i as number] as HTMLElement).style.removeProperty('right');
                    (divElement.children[i as number] as HTMLElement).style.removeProperty('overflow');
                    const svgElement: HTMLElement = document.getElementById(maps.element.id + '_Tile_SVG_Parent');
                    (divElement.children[i as number].children[0] as HTMLElement).style.overflow = 'hidden';
                    (divElement.children[i as number].children[0] as HTMLElement).style.position = 'absolute';
                    (divElement.children[i as number].children[0] as HTMLElement).style.height = svgElement.style.height;
                    (divElement.children[i as number].children[0] as HTMLElement).style.width = svgElement.style.width;
                    (divElement.children[i as number].children[0] as HTMLElement).style.left = svgElement.style.left;
                    (divElement.children[i as number].children[0] as HTMLElement).style.top = svgElement.style.top;
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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    public destroy(): void { }
}
