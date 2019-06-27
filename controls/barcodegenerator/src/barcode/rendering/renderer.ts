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
    public isSvgMode: Boolean = null;
    constructor(name: string, isSvgMode: Boolean) {
        this.isSvgMode = isSvgMode;
        this.renderer = isSvgMode ? new BarcodeSVGRenderering() : new BarcodeCanvasRenderer();

    }

    /**   @private  */
    public renderRootElement(attribute: Object, backGroundColor: string, width: number, height: number): HTMLElement {
        let canvasObj: HTMLElement = this.renderer.renderRootElement(attribute, backGroundColor, width, height) as HTMLCanvasElement;
        return canvasObj;
    }


    /**   @private  */
    public renderRectElement(canvas: HTMLCanvasElement, attribute: Object): HTMLElement {
        let canvasObj: HTMLElement = this.renderer.renderRect(canvas, attribute) as HTMLCanvasElement;
        return canvasObj;
    }

    /**   @private  */
    public renderTextElement(canvas: HTMLCanvasElement, attribute: Object): HTMLElement {
        let canvasObj: HTMLElement = this.renderer.renderText(canvas, attribute) as HTMLCanvasElement;
        return canvasObj;
    }
}