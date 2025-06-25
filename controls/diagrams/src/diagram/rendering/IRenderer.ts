import { PathAttributes, TextAttributes } from './canvas-interface';
import { RectAttributes, ImageAttributes, BaseAttributes } from './canvas-interface';
import { ImageElement } from '../core/elements/image-element';
import { GroupableView } from '../core/containers/container';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { DiagramElement } from '../core/elements/diagram-element';
/**
 * IRenderer interface defines the base of the SVG and Canvas renderer.
 */
/** @private */
export interface IRenderer {
    renderShadow(options: BaseAttributes, canvas: HTMLCanvasElement | SVGElement,
        collection: Object[]): void;
    parseDashArray(dashArray: string): number[];
    drawRectangle(canvas: HTMLCanvasElement | SVGElement, options: RectAttributes, diagramId: string,
        onlyRect?: boolean, isSelector?: boolean, parentSvg?: SVGSVGElement, ariaLabel?: Object,
        isCircularHandle?: boolean, enableSelector?: number, renderer?: any, element?: any): void;
    drawPath(canvas: HTMLCanvasElement | SVGElement, options: PathAttributes, diagramId: string,
        isSelector?: boolean, parentSvg?: SVGSVGElement, ariaLabel?: Object, scale?: number,  renderer?: any, element?: PathElement): void;
    renderPath(canvas: HTMLCanvasElement | SVGElement, options: PathAttributes,
        collection: Object[]): void;
    drawText(canvas: HTMLCanvasElement | SVGElement, options: TextAttributes, parentSvg?: SVGSVGElement, ariaLabel?: Object,
        diagramId?: string, scaleValue?: number, renderer?: any, element?: TextElement): void;
    drawImage(
        canvas: HTMLCanvasElement | SVGElement | ImageElement,
        obj: ImageAttributes, parentSvg?: SVGSVGElement, fromPalette?: boolean, renderer?: any, element?: ImageElement): void;
}
