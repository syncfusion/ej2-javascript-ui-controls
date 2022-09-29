import { createHtmlElement, getDiagramElement } from '@syncfusion/ej2-drawings';
import { setAttributeSvg, createSvgElement } from '@syncfusion/ej2-drawings';
import { PdfViewer } from '../index';

/**
 * @param {ClientRect} bounds - Specified the bounds of the annotation.
 * @param {string} commonStyle  - Specified the annotation styles.
 * @param {HTMLElement} cavas  - Specified the annotation canvas element.
 * @param {number} index - Specified the page index value.
 * @param {PdfViewer} pdfViewer - Specified the pdfviewer element.
 * @hidden
 * @returns {void}
 */
export function renderAdornerLayer(
    bounds: ClientRect, commonStyle: string, cavas: HTMLElement, index: number, pdfViewer: PdfViewer): void {
    const divElement: HTMLElement = createHtmlElement('div', {
        'id': pdfViewer.element.id + index + '_diagramAdornerLayer',
        'style': 'width:' + bounds.width + 'px;height:' + bounds.height + 'px;' + commonStyle
    });
    if (!getDiagramElement(divElement.id)) {
        const nextElement: HTMLElement = pdfViewer.viewerBase.getElement('_pageDiv_' + index);
        let pageBound = nextElement.getBoundingClientRect();
        const svgAdornerSvg: SVGElement = createSvg(pdfViewer.element.id + index + '_diagramAdorner_svg', pageBound.width, pageBound.height);
        svgAdornerSvg.setAttribute('class', 'e-adorner-layer' + index);
        svgAdornerSvg.setAttribute('style', 'pointer-events:none;');
        pdfViewer.adornerSvgLayer = createSvgElement('g', { 'id': pdfViewer.element.id + index + '_diagramAdorner' }) as SVGSVGElement;
        pdfViewer.adornerSvgLayer.setAttribute('style', ' pointer-events: all; ');
        svgAdornerSvg.appendChild(pdfViewer.adornerSvgLayer);
        divElement.appendChild(svgAdornerSvg);
        divElement.style.width = pageBound.width + 'px';
        divElement.style.height = pageBound.height + 'px';
        if (nextElement) {
            nextElement.insertBefore(divElement, nextElement.childNodes[0]);
        } else {
            cavas.parentElement.appendChild(divElement);
        }
        const svgSelector: SVGElement = createSvgElement('g', { 'id': pdfViewer.element.id + index + '_SelectorElement' });
        pdfViewer.adornerSvgLayer.appendChild(svgSelector);
        setAttributeSvg(svgAdornerSvg, { style: 'pointer-events:none;' });
    }
    pdfViewer.viewerBase.applyElementStyles(divElement, index);
}

/**
 * @param {string} id - Specified the Id of the svg element.
 * @param {string | number} width - Specified the width of the svg element.
 * @param {string | number} height - Specified the height of the svg element.
 * @hidden
 * @returns {SVGElement} - Returns the svg element.
 */
export function createSvg(id: string, width: string | number, height: string | number): SVGElement {
    const svgObj: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    setAttributeSvg(svgObj, { 'id': id, 'width': width, 'height': height });
    return svgObj;
}
