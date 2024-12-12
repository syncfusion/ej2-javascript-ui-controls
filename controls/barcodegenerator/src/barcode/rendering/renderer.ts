import { BarcodeCanvasRenderer } from './canvas-renderer';
import { IBarcodeRenderer } from './IRenderer';
import { BarcodeSVGRenderering } from './svg-renderer';

/**
 * Renderer
 */

/**
 * Renderer module is used to render basic barcode elements
 */

/** @private */
export class BarcodeRenderer {

    /**   @private  */
    public renderer: IBarcodeRenderer = null;
    public isSvgMode: boolean = null;
    constructor(name: string, isSvgMode: boolean) {
        this.isSvgMode = isSvgMode;
        this.renderer = isSvgMode ? new BarcodeSVGRenderering() : new BarcodeCanvasRenderer();

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
        const canvasObj: HTMLElement = this.renderer.renderRootElement(attribute, backGroundColor, width, height) as HTMLCanvasElement;
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
    // eslint-disable-next-line
    public renderRectElement(canvas: HTMLCanvasElement, attribute: Object): HTMLElement {
        const canvasObj: HTMLElement = this.renderer.renderRect(canvas, attribute) as HTMLCanvasElement;
        return canvasObj;
    }

    /**
     * Draw the text for the barcode.\
     *
     * @returns {HTMLElement} Draw the barcode SVG .
     *  @param {Object} canvas - Provide the canvas element .
     *  @param {Object} attribute - Provide the canvas element .
     * @private
     */
    // eslint-disable-next-line
    public renderTextElement(canvas: HTMLCanvasElement, attribute: Object): HTMLElement {
        const canvasObj: HTMLElement = this.renderer.renderText(canvas, attribute) as HTMLCanvasElement;
        return canvasObj;
    }
}
