import { RectAttributes } from './canvas-interface';
/**
 * @hidden
 * IRenderer interface defines the base of the SVG and Canvas renderer.
 */
export interface IRenderer {
    parseDashArray(dashArray: string): number[];
    drawRectangle(canvas: HTMLCanvasElement | SVGElement, options: RectAttributes, diagramId: string,
        onlyRect?: boolean, isSelector?: boolean, parentSvg?: SVGSVGElement, ariaLabel?: Object): void;
}
