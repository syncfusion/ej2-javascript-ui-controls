import { IBarcodeRenderer } from './IRenderer';
import { createSvgElement } from '../utility/dom-util';
import { BaseAttributes } from './canvas-interface';

/**
 * svg renderer
 */

/** @private */
export class BarcodeSVGRenderering implements IBarcodeRenderer {
    /**   @private  */
    public renderRootElement(attribute: Object, backGroundColor: string, ): HTMLElement {
        let canvasObj: HTMLElement = createSvgElement('svg', attribute) as HTMLElement;
        canvasObj.setAttribute('style', 'background:' + backGroundColor);
        return canvasObj;
    }

    /**   @private  */
    public renderRect(svg: HTMLElement, attribute: BaseAttributes): HTMLElement {
        let rect: SVGRectElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', attribute.x.toString());
        rect.setAttribute('y', attribute.y.toString());
        rect.setAttribute('width', attribute.width.toString());
        rect.setAttribute('height', attribute.height.toString());
        rect.setAttribute('fill', attribute.color);
        rect.setAttribute('style', 'shape-rendering: crispEdges');
        svg.appendChild(rect);
        return svg;
    }

    /**   @private  */
    public renderText(svg: HTMLElement, attribute: BaseAttributes): HTMLElement {
        let text: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', attribute.x.toString());
        text.setAttribute('y', attribute.y.toString());
        text.setAttribute('fill', attribute.color);
        text.style.fontSize = attribute.stringSize.toString() + 'px';
        text.style.fontFamily = attribute.fontStyle;
        text.textContent = attribute.string;
        svg.appendChild(text);
        return svg;
    }
}