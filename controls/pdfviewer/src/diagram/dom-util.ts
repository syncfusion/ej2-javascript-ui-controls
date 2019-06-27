import { createHtmlElement, getDiagramElement } from '@syncfusion/ej2-drawings';
import { setAttributeSvg, createSvgElement } from '@syncfusion/ej2-drawings';
import { PdfViewer } from '../pdfviewer';

/**
 * @hidden
 */
export function renderAdornerLayer(
    bounds: ClientRect, commonStyle: string, cavas: HTMLElement, index: number, pdfViewer: PdfViewer): void {
    let divElement: HTMLElement = createHtmlElement('div', {
        'id': pdfViewer.element.id + index + '_diagramAdornerLayer',
        'style': 'width:' + bounds.width + 'px;height:' + bounds.height + 'px;' + commonStyle
    });
    if (!getDiagramElement(divElement.id)) {

    let svgAdornerSvg: SVGElement = createSvg(pdfViewer.element.id + index + '_diagramAdorner_svg', bounds.width, bounds.height);
    svgAdornerSvg.setAttribute('class', 'e-adorner-layer' + index);
    svgAdornerSvg.setAttribute('style', 'pointer-events:none;');
    pdfViewer.adornerSvgLayer = createSvgElement('g', { 'id': pdfViewer.element.id + '_diagramAdorner' }) as SVGSVGElement;
    pdfViewer.adornerSvgLayer.setAttribute('style', ' pointer-events: all; ');
    svgAdornerSvg.appendChild(pdfViewer.adornerSvgLayer);
    divElement.appendChild(svgAdornerSvg);
    cavas.parentElement.appendChild(divElement);
    let svgSelector: SVGElement = createSvgElement('g', { 'id': pdfViewer.element.id + '_SelectorElement' });
    pdfViewer.adornerSvgLayer.appendChild(svgSelector);
    setAttributeSvg(svgAdornerSvg, { style: 'pointer-events:none;' });
    }
}

/**
 * @hidden
 */
export function createSvg(id: string, width: string | Number, height: string | Number): SVGElement {
    let svgObj: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    setAttributeSvg(svgObj, { 'id': id, 'width': width, 'height': height });
    return svgObj;
}