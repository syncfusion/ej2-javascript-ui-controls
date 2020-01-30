/**
 * DOM util
 */

import { createElement, Browser } from '@syncfusion/ej2-base';
import { Size } from '../primitives/size';
import { BaseAttributes } from '../rendering/canvas-interface';


/** @private */
export function createHtmlElement(elementType: string, attribute?: Object): HTMLElement {
    let element: HTMLElement = createElement(elementType);
    if (attribute) {
        setAttribute(element, attribute);
    }
    return element;
}
export function getChildNode(node: SVGElement): SVGElement[] | HTMLCollection {
    let child: SVGElement;
    let collection: SVGElement[] | HTMLCollection = [];
    if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
        for (let i: number = 0; i < node.childNodes.length; i++) {
            child = node.childNodes[i] as SVGElement;
            if (child.nodeType === 1) {
                collection.push(child);
            }
        }
    } else {
        collection = node.children;
    }
    return collection;
}
export function measureText(textContent: BaseAttributes): Size {
    let measureElement: string = 'barcodeMeasureElement';
    window[measureElement].style.visibility = 'visible';
    let svg: SVGElement = window[measureElement].children[1];
    let text: SVGTextElement = getChildNode(svg)[0] as SVGTextElement;
    text.textContent = textContent.string;
    text.setAttribute('style', 'font-size:' + textContent.stringSize + 'px; font-family:'
        + textContent.fontStyle + ';font-weight:');
    let bBox: Size = new Size(0, 0);
    bBox.width = text.getBBox().width;
    bBox.height = text.getBBox().height;
    window[measureElement].style.visibility = 'hidden';
    return bBox;
}


/** @private */
export function setAttribute(element: HTMLElement | SVGElement, attributes: Object): void {
    let keys: string[] = Object.keys(attributes);
    for (let i: number = 0; i < keys.length; i++) {
        element.setAttribute(keys[i], attributes[keys[i]]);
    }
}

/** @private */
export function createSvgElement(elementType: string, attribute: Object): HTMLElement | SVGElement {
    let element: HTMLElement | SVGElement = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    setAttribute(element, attribute);
    return element;
}
/** @private */
export function createMeasureElements(): void {
    let measureElement: string = 'barcodeMeasureElement';
    if (!window[measureElement]) {
        let divElement: HTMLElement = createHtmlElement('div', {
            id: 'barcodeMeasureElement', class: 'barcodeMeasureElement',
            style: 'visibility:hidden ; height: 0px ; width: 0px; overflow: hidden;'
        });
        let text: HTMLElement = createHtmlElement('span', { 'style': 'display:inline-block ; line-height: normal' });
        divElement.appendChild(text);
        let svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        divElement.appendChild(svg);
        let tSpan: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
        svg.appendChild(tSpan);
        window[measureElement] = divElement;
        window[measureElement].usageCount = 1;
        document.body.appendChild(divElement);
    } else {
        window[measureElement].usageCount += 1;
    }
}