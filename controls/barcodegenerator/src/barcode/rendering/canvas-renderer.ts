import { IBarcodeRenderer } from './IRenderer';
import { BaseAttributes } from './canvas-interface';
import { createHtmlElement } from '../utility/dom-util';

/**
 * canvas renderer
 */


/** @private */
export class BarcodeCanvasRenderer implements IBarcodeRenderer {

    /**   @private  */
    public static getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    /**   @private  */
    public renderRootElement(attribute: Object, backGroundColor: string, width: number, height: number): HTMLElement {
        let canvasObj: HTMLCanvasElement = createHtmlElement('canvas', attribute) as HTMLCanvasElement;
        let ctx: CanvasRenderingContext2D = canvasObj.getContext('2d');
        ctx.fillStyle = backGroundColor;
        ctx.fillRect(0, 0, width, height);
        return canvasObj;
    }





    /**   @private  */
    public renderRect(canvas: HTMLCanvasElement, attribute: BaseAttributes): HTMLElement {
        let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.fillStyle = attribute.color;
        ctx.fillRect(attribute.x, attribute.y, attribute.width, attribute.height);
        return canvas;
    }

    public renderText(canvas: HTMLCanvasElement, attribute: BaseAttributes): HTMLElement {
        let ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.save();
        ctx.font = (attribute.stringSize) + 'px ' + attribute.fontStyle;
        ctx.fillStyle = attribute.color;
        ctx.fillText(attribute.string, attribute.x, attribute.y);
        return canvas;
    }
}