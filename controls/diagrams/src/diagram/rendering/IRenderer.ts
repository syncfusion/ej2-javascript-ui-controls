import { PathAttributes, TextAttributes } from './canvas-interface';
import { RectAttributes, ImageAttributes, BaseAttributes } from './canvas-interface';
import { ImageElement } from '../core/elements/image-element';
import { Container } from '../core/containers/container';
/**
 * IRenderer interface defines the base of the SVG and Canvas renderer.
 */
/** @private */
export interface IRenderer {
    renderShadow(options: BaseAttributes, canvas: HTMLCanvasElement | SVGElement,
        collection: Object[]): void;
    parseDashArray(dashArray: string): number[];
    drawRectangle(canvas: HTMLCanvasElement | SVGElement, options: RectAttributes, diagramId: string,
        onlyRect?: boolean, isSelector?: boolean, parentSvg?: SVGSVGElement, ariaLabel?: Object): void;
    drawPath(canvas: HTMLCanvasElement | SVGElement, options: PathAttributes, diagramId: string,
        isSelector?: boolean, parentSvg?: SVGSVGElement, ariaLabel?: Object, scale?: number): void;
    renderPath(canvas: HTMLCanvasElement | SVGElement, options: PathAttributes,
        collection: Object[]): void;
    drawText(canvas: HTMLCanvasElement | SVGElement, options: TextAttributes, parentSvg?: SVGSVGElement, ariaLabel?: Object,
        diagramId?: string, scaleValue?: number, parentNode?: Container): void;
    drawImage(
        canvas: HTMLCanvasElement | SVGElement | ImageElement,
        obj: ImageAttributes, parentSvg?: SVGSVGElement, fromPalette?: boolean): void;
}
