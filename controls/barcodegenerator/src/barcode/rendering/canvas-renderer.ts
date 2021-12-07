import { IBarcodeRenderer } from './IRenderer';
import { BaseAttributes } from './canvas-interface';
import { createHtmlElement } from '../utility/dom-util';

/**
 * canvas renderer
 */


/** @private */
export class BarcodeCanvasRenderer implements IBarcodeRenderer {

    /**
     * Get the context value for the canvas.\
     *
     * @returns {CanvasRenderingContext2D} Get the context value for the canvas .
     * @param {HTMLCanvasElement} canvas - Provide the canvas element .
     * @private
     */
    public static getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    /**
     * Draw the root element for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     * @param {Object} attribute - Provide the canvas element .
     * @param {string} backGroundColor - Provide the canvas element .
     * @param {number} width - Provide the canvas element .
     * @param {number} height - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    public renderRootElement(attribute: Object, backGroundColor: string, width: number, height: number): HTMLElement {
        const canvasObj: HTMLCanvasElement = createHtmlElement('canvas', attribute) as HTMLCanvasElement;
        const ctx: CanvasRenderingContext2D = canvasObj.getContext('2d');
        ctx.fillStyle = backGroundColor;
        ctx.fillRect(0, 0, width, height);
        return canvasObj;
    }





    /**
     * Draw the rect for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     *  @param {Object} canvas - Provide the canvas element .
     *  @param {Object} attribute - Provide the canvas element .
     * @private
     */
    public renderRect(canvas: HTMLCanvasElement, attribute: BaseAttributes): HTMLElement {
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.fillStyle = attribute.color;
        ctx.fillRect(attribute.x, attribute.y, attribute.width, attribute.height);
        return canvas;
    }

    /**
     * Draw the text for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     *  @param {Object} canvas - Provide the canvas element .
     *  @param {Object} attribute - Provide the canvas element .
     * @private
     */
    public renderText(canvas: HTMLCanvasElement, attribute: BaseAttributes): HTMLElement {
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.font = (attribute.stringSize) + 'px ' + attribute.fontStyle;
        ctx.fillStyle = attribute.color;
        ctx.fillText(attribute.string, attribute.x, attribute.y);
        return canvas;
    }
}
