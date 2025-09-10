/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/indent */
import { Size } from './../primitives/size';
import { Point } from './../primitives/point';
import { PointModel } from './../primitives/point-model';
import { processPathData, pathSegmentCollection, getRectanglePath } from './../utility/path-util';
import { overFlow } from './../utility/base-util';
import { createHtmlElement, setChildPosition } from './../utility/dom-util';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PathSegment, ImageAttributes, StyleAttributes, BaseAttributes, LineAttributes, CircleAttributes, ITransform } from './canvas-interface';
import { LinearGradientModel, RadialGradientModel, StopModel } from './../core/appearance-model';
import { RectAttributes, PathAttributes, TextAttributes, SubTextElement, TextBounds } from './canvas-interface';
import { IRenderer } from './../rendering/IRenderer';
import { GroupableView } from '../core/containers/container';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { ImageElement } from '../core/elements/image-element';
import { ElementAction, FlipDirection } from '../enum/enum';
import { DiagramElement } from '../core/elements/diagram-element';
import { Diagram } from '../diagram';
import { Rect } from '../primitives/rect';

/**
 * Canvas Renderer
 */

/** @private */
export class CanvasRenderer implements IRenderer {


    /**
     * Provide the context value for the canvas \
     *
     *  @returns {CanvasRenderingContext2D} Provide the context value for the canvas .\
     *  @param { HTMLCanvasElement} canvas - Return the dashed array values .
     *  @private
     */
    public static getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    private static setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number): void {
        if (canvas) {
            canvas.setAttribute('width', width.toString());
            canvas.setAttribute('height', height.toString());
        }
    }

    /**
     * Draw the gradient for the diagram shapes .\
     *
     *  @returns {SVGElement} Draw the gradient for the diagram shapes.
     *  @param {StyleAttributes} options - Provide the options  for the gradient  element .
     *  @param {SVGElement} ctx - Provide canvas values .
     *  @param {string} x - Provide the x value for the gradient .
     *  @param {string} y - Provide the x value for the gradient .
     *  @private
     */
    public renderGradient(options: StyleAttributes, ctx: CanvasRenderingContext2D, x?: number, y?: number): CanvasRenderingContext2D {
        let max: number; let min: number;
        let grd: CanvasGradient;
        if (options.gradient.type !== 'None') {
            for (let i: number = 0; i < options.gradient.stops.length; i++) {
                max = max !== undefined ? options.gradient.stops[parseInt(i.toString(), 10)].offset
                    : Math.max(max, options.gradient.stops[parseInt(i.toString(), 10)].offset);
                min = min !== undefined ? options.gradient.stops[parseInt(i.toString(), 10)].offset
                    : Math.min(min, options.gradient.stops[parseInt(i.toString(), 10)].offset);
            }
            if (options.gradient.type === 'Linear') {
                const linear: LinearGradientModel = options.gradient;
                //952013 - Gradient is not rendered correctly upon export
                let x1: number = linear.x1;
                let x2: number = linear.x2;
                let y1: number = linear.y1;
                let y2: number = linear.y2;
                if ((linear as any).controlParent instanceof Diagram && ((linear as any).controlParent as Diagram).mode === 'SVG') {
                    x1 = (options as any).width ? x1 * (options as any).width / 100 : x1;
                    x2 = (options as any).width ? x2 * (options as any).width / 100 : x2;
                    y1 = (options as any).height ? y1 * (options as any).height / 100 : y1;
                    y2 = (options as any).height ? y2 * (options as any).height / 100 : y2;
                    if (x1 !== x2 && y1 !== y2) {
                        const xdistance: number = x2 - x1;
                        const ydistance: number = y2 - y1;
                        const angleRad: number = Math.atan2(ydistance, xdistance);
                        let angleDeg: number = (angleRad * (180 / Math.PI)) % 360;
                        angleDeg = angleDeg < 0 ? angleDeg + 360 : angleDeg;
                        const inverseAngleDeg: number = 90 - angleDeg;
                        const inverseAngleRad: number = inverseAngleDeg * (Math.PI / 180);
                        const effectiveDistance: number = (xdistance * Math.sin(angleRad)) + (ydistance * Math.cos(angleRad));
                        x2 = x1 + effectiveDistance * Math.cos(inverseAngleRad);
                        y2 = y1 + effectiveDistance * Math.sin(inverseAngleRad);
                    }
                }
                grd = ctx.createLinearGradient(x + x1, y + y1, x + x2, y + y2);
            } else {
                const radial: RadialGradientModel = options.gradient;
                grd = ctx.createRadialGradient(x + radial.fx, y + radial.fy, 0, x + radial.cx, y + radial.cy, radial.r);
            }
            for (let i: number = 0; i < options.gradient.stops.length; i++) {
                const stop: StopModel = options.gradient.stops[parseInt(i.toString(), 10)];
                const offset: number = min < 0 ? (max + stop.offset) / (2 * max) : stop.offset / max;
                grd.addColorStop(offset, stop.color);
            }
            ctx.fillStyle = grd;
        }
        return ctx;
    }

    /**
     * Draw the shawdow  for the rectangle shape in diagram \
     *
     *  @returns {void}  Draw the shawdow  for the rectangle shape in diagram .\
     *
     *  @param { SVGElement} options - Provide the base attributes .
     *  @param { RectAttributes} canvas - Provide the canvas values .
     *  @param { string} collection - Provide the collection value.
     *  @private
     */
    public renderShadow(options: BaseAttributes, canvas: HTMLCanvasElement, collection: Object[] = null): void {
        const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = ctx.fillStyle = options.shadow.color;
        ctx.globalAlpha = options.shadow.opacity;
        const ptModel: PointModel = { x: 0, y: 0 };
        const point: PointModel = Point.transform(ptModel, options.shadow.angle, options.shadow.distance);
        const transX: number = options.x + point.x; const transY: number = options.y + point.y;
        const pivotX: number = transX + options.width * options.pivotX;
        const pivotY: number = transY + options.height * options.pivotY;
        this.rotateContext(canvas, options.angle, pivotX, pivotY);
        if (collection) {
            ctx.translate(transX, transY);
            this.renderPath(canvas, options as PathAttributes, collection);
            ctx.translate(-transX, -transY);
        } else {
            ctx.rect(transX, transY, options.width, options.height);
            ctx.fillRect(transX, transY, options.width, options.height);
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }


    /**
     * Create canvas element for the diagram \
     *
     *  @returns {HTMLCanvasElement}    Create canvas element for the diagram .\
     *
     *  @param { SVGElement} id - Provide the id for the canvas.
     *  @param { Object} width - Provide the width for the canvas.
     *  @param { Object} height - Provide the height for the canvas.
     *  @private
     */
    public static createCanvas(id: string, width: number, height: number): HTMLCanvasElement {
        const canvasObj: HTMLCanvasElement = createHtmlElement('canvas', { 'id': id }) as HTMLCanvasElement;
        this.setCanvasSize(canvasObj, width, height);
        return canvasObj;
    }

    private setStyle(canvas: HTMLCanvasElement, style: StyleAttributes): void {
        const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        if (style.fill === 'none') { style.fill = 'transparent'; }
        if (style.stroke === 'none') { style.stroke = 'transparent'; }
        ctx.strokeStyle = style.stroke;
        ctx.lineWidth = style.strokeWidth;
        if (style.strokeWidth === 0) {
            ctx.strokeStyle = 'transparent';
        }
        ctx.globalAlpha = style.opacity;
        let dashArray: number[] = [];
        if (style.dashArray) {
            dashArray = this.parseDashArray(style.dashArray);
        }
        ctx.setLineDash(dashArray);
        if (style.gradient && style.gradient.type !== 'None') {
                if ((style as BaseAttributes).shapeType === 'Rectangle') {
                    this.renderGradient(style, ctx, (style as BaseAttributes).x, (style as BaseAttributes).y);
                } else {
                    this.renderGradient(style, ctx, 0, 0);
                }
        } else {
            ctx.fillStyle = style.fill;
        }

    }

    private rotateContext(canvas: HTMLCanvasElement, angle: number, x: number, y: number): void {
        const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-x, -y);
    }

    private setFontStyle(canvas: HTMLCanvasElement, text: TextAttributes): void {
        const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        let font: string = '';
        if (text.italic) {
            font += 'italic ';
        }
        if (text.bold) {
            font += 'bold ';
        }
        font += (text.fontSize) + 'px ';
        font += text.fontFamily;
        ctx.font = font;
    }

    /**
     * Return the dashed array values \
     *
     *  @returns {number[]}  Return the dashed array values .\
     *  @param { SVGElement} dashArray - Return the dashed array values .
     *  @private
     */
    public parseDashArray(dashArray: string): number[] {
        const dashes: number[] = [];
        const separator: string = dashArray.indexOf(' ') !== -1 ? ' ' : ',';
        const splittedDashes: string[] = dashArray.split(separator);
        for (const i of splittedDashes) {
            dashes.push(Number(i));
        }
        return dashes;
    }

    private drawRoundedRect(canvas: HTMLCanvasElement, options: RectAttributes): void {
        const context: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        context.beginPath();
        const x: number = options.x;
        const y: number = options.y;
        const w: number = options.width;
        const h: number = options.height;
        const mx: number = x + w / 2;
        const my: number = y + h / 2;
        context.beginPath();
        this.setStyle(canvas, options);
        context.moveTo(x, my);
        context.quadraticCurveTo(x, y, mx, y);
        context.quadraticCurveTo(x + w, y, x + w, my);
        context.quadraticCurveTo(x + w, y + h, mx, y + h);
        context.quadraticCurveTo(x, y + h, x, my);
        //892454-Fill color not applied for BPMN activity shapes inside the symbol palette.
        context.fill();
        context.stroke();
    }

    //Rendering Part

    /**
     * Draw the Rectangle for the diagram \
     *
     *  @returns {void}  Draw the Rectangle for the diagram .\
     *
     *  @param { SVGElement} canvas - Provide the SVG .
     *  @param { RectAttributes} options - Provide the Rect attributes .
     *  @param { string} diagramId - Provide the diagram id .
     *  @param { boolean} isExport - Provide the isExport .
     *  @param { boolean} isSelector - Provide the selector possobilities .
     *  @param { SVGSVGElement} parentSvg - Provide the parent svg element .
     *  @param { Object} ariaLabel - Provide the Arial label attributes .
     *  @param { boolean} isCircularHandle - Provide the boolean attribute for the circular handle .
     *  @param { number} enableSelector - Provide the selector possobilities .
     *  @param { any } renderer - Provide the renderer value .
     *  @param { any } element - Provide the element value .
     *  @private
     */
    public drawRectangle(canvas: HTMLCanvasElement, options: RectAttributes, diagramId: string, isExport: boolean,
                         isSelector?: boolean, parentSvg?: SVGSVGElement, ariaLabel?: Object,
                         isCircularHandle?: boolean, enableSelector?: number, renderer?: any, element?: any): void {
        if (options.visible === true) {
            if (options.cornerRadius) {
                if (!isExport && (options.width < 30 || options.height < 30)) {
                    this.drawRoundedRect(canvas, options);
                } else {
                    (options as PathAttributes).data = getRectanglePath(options.cornerRadius, options.height, options.width);
                    this.drawPath(canvas, options as PathAttributes, diagramId, isSelector, parentSvg, ariaLabel,
                                  undefined, renderer, element);
                }
            } else {
                const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
                if (options.shadow) {
                    this.renderShadow(options, canvas);
                }
                ctx.save();
                ctx.beginPath();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const cornerRadius: number = options.cornerRadius;
                const pivotX: number = options.x + options.width * options.pivotX;
                const pivotY: number = options.y + options.height * options.pivotY;
                //To flip the annotation background rect.
                if ((options as TextAttributes).textWrapping && (options as TextAttributes).wrapBounds) {
                    this.applyFlipAndRotate(ctx, options, canvas, pivotX, pivotY, renderer, element);
                } else {
                    const angle: number = (options as any).isImage ? -options.angle : options.angle;
                    this.rotateContext(canvas, angle, pivotX, pivotY);
                }
                this.setStyle(canvas, options as StyleAttributes);
                ctx.rect(options.x, options.y, options.width, options.height);
                ctx.fillRect(options.x, options.y, options.width, options.height);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
    }

    // public updateSelectionRegion(canvas: HTMLCanvasElement, options: RectAttributes): void {
    //     this.drawRectangle(canvas, options);
    // }

    // public drawLine(canvas: HTMLCanvasElement, options: LineAttributes): void {
    //     let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
    //     ctx.save();
    //     ctx.beginPath();
    //     let pivotX: number = options.x + options.width * options.pivotX;
    //     let pivotY: number = options.y + options.height * options.pivotY;
    //     this.rotateContext(canvas, options.angle, pivotX, pivotY);
    //     this.setStyle(canvas, options as StyleAttributes);
    //     ctx.translate(options.x, options.y);
    //     ctx.moveTo(options.startPoint.x, options.startPoint.y);
    //     ctx.lineTo(options.endPoint.x, options.endPoint.y);
    //     ctx.translate(-options.x, -options.y);
    //     ctx.stroke();
    //     ctx.closePath();
    //     ctx.restore();
    // }

    // public drawCircle(canvas: HTMLCanvasElement, options: CircleAttributes): void {
    //     let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
    //     ctx.save();
    //     ctx.beginPath();
    //     let pivotY: number = options.y + options.height * options.pivotY;
    //     let pivotX: number = options.x + options.width * options.pivotX;
    //     this.setStyle(canvas, options as StyleAttributes);
    //     this.rotateContext(canvas, options.angle, pivotX, pivotY);
    //     ctx.arc(options.centerX, options.centerY, options.radius, 0, 2 * Math.PI);
    //     ctx.fill();
    //     ctx.stroke();
    //     ctx.closePath();
    //     ctx.restore();
    // }

    /**
     * Draw the path element for the diagram\
     *
     *  @returns {void}  Draw the path element for the diagram .\
     *
     *  @param { SVGElement} canvas - Provide the SVG element .
     *  @param { PathAttributes} options - Provide the path element attributes .
     *  @param {string} diagramId - Provide the diagram id .
     *  @param {boolean} isSelector - Provide selector boolean value .
     *  @param {SVGSVGElement} parentSvg - Provide the parent SVG element .
     *  @param {Object} ariaLabel - Provide arial label value .
     *  @param {number} scale - Provide the scale value .
     *  @param {any} renderer - Provide the renderer value .
     *  @param {PathElement} element - Provide the path element value .
     *  @private
     */
    public drawPath(canvas: HTMLCanvasElement, options: PathAttributes, diagramId?: string, isSelector?: boolean,
        parentSvg?: SVGSVGElement, ariaLabel?: Object, scale?: number, renderer?: any, element?: PathElement): void {
        let collection: Object[] = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
        if (options.shadow) {
            this.renderShadow(options, canvas, collection);
        }
        const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        ctx.save();
        ctx.beginPath();
        const pivotY: number = options.y + options.height * options.pivotY;
        const pivotX: number = options.x + options.width * options.pivotX;
        this.applyFlipAndRotate(ctx, options, canvas, pivotX, pivotY, renderer, element);
        this.setStyle(canvas, options as StyleAttributes);
        ctx.translate(options.x, options.y);
        this.renderPath(canvas, options, collection);
        ctx.fill();
        ctx.translate(-options.x, -options.y);
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draw the path element for the diagram\
     *
     *  @returns {void}  Draw the path element for the diagram .\
     *
     *  @param { SVGElement} canvas - Provide the SVG element .
     *  @param {PathAttributes} options - Provide the path element attributes .
     *  @param {Object[]} collection - Provide the parent SVG element .
     *  @private
     */
    public renderPath(canvas: HTMLCanvasElement, options: PathAttributes, collection: Object[]): void {
        if (options.visible === true) {
            let arcCount: number = 0;
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            let x0: number; let y0: number; let x1: number; let y1: number; let x2: number; let y2: number;
            let x: number; let y: number; let length: number; let i: number; const segs: Object[] = collection;
            for (x = 0, y = 0, i = 0, length = segs.length; i < length; ++i) {
                const obj: Object = segs[parseInt(i.toString(), 10)]; const seg: PathSegment = obj; const char: string = seg.command;
                if ('x1' in seg) { x1 = seg.x1; }
                if ('x2' in seg) { x2 = seg.x2; }
                if ('y1' in seg) { y1 = seg.y1; }
                if ('y2' in seg) { y2 = seg.y2; }
                if ('x' in seg) { x = seg.x; }
                if ('y' in seg) { y = seg.y; }
                switch (char) {
                case 'M':
                    ctx.moveTo(x, y); seg.x = x; seg.y = y;
                    break;
                case 'L':
                    ctx.lineTo(x, y); seg.x = x; seg.y = y;

                    break;
                case 'C':
                    ctx.bezierCurveTo(x1, y1, x2, y2, x, y);
                    seg.x = x; seg.y = y; seg.x1 = x1; seg.y1 = y1; seg.x2 = x2; seg.y2 = y2;
                    break;
                case 'Q':
                    ctx.quadraticCurveTo(x1, y1, x, y);
                    seg.x = x; seg.y = y; seg.x1 = x1; seg.y1 = y1;
                    break;
                case 'A':
                // eslint-disable-next-line
                let curr: PointModel = { x: x0, y: y0 }; let rx: number; let ry: number;
                if ((options as any).arc && (options as any).arc.length > 0) {
                    if (seg.r1 === 0) {
                        rx = (options as any).arc[parseInt(arcCount.toString(), 10)].r1;
                    } else {
                        rx = seg.r1;
                    }
                    if (seg.r2 === 0) {
                        ry = (options as any).arc[parseInt(arcCount.toString(), 10)].r2;
                    } else {
                        ry = seg.r2;
                    }
                    arcCount++;
                }
                else {
                    rx = seg.r1; ry = seg.r2;
                }
                const xAxisRotation: number = seg.angle * (Math.PI / 180.0);
                const largeArc: boolean = seg.largeArc; const sweep: boolean = seg.sweep; const cp: PointModel = { x: x, y };
                        const currp: PointModel = {
                            x:
                                Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
                            y: -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
                        };
                        const l: number = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
                        if (l > 1) {
                            rx *= Math.sqrt(l);
                            ry *= Math.sqrt(l);
                        }
                        const k: number = (Math.pow(ry, 2) * Math.pow(currp.x, 2));
                        let s: number = (largeArc === sweep ? -1 : 1) * Math.sqrt(
                            ((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - k) /
                            (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2))
                        );
                        if (isNaN(s)) {
                            s = 0;
                        }
                    const cpp: PointModel = { x: s * rx * currp.y / ry, y: s * -ry * currp.x / rx };
                        const centp: PointModel = {
                            x:
                            (curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
                        y: (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
                    };
                    const a1: number = this.a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
                    const u: number[] = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
                    const v: number[] = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
                    let ad: number = this.a(u, v);
                    if (this.r(u, v) <= -1) {
                        ad = Math.PI;
                    }
                    if (this.r(u, v) >= 1) {
                        ad = 0;
                      }
                    const dir: number = !sweep ? -1.0 : 1.0;
                    const ah: number = a1 + dir * (ad / 2.0);
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        const halfWay: PointModel = {
                            x:
                                centp.x + rx * Math.cos(ah),
                            y: centp.y + ry * Math.sin(ah)
                        };
                    seg.centp = centp; seg.xAxisRotation = xAxisRotation; seg.rx = rx;
                    seg.ry = ry; seg.a1 = a1; seg.ad = ad; seg.sweep = sweep;
                    if (ctx != null) {
                        const ra: number = rx > ry ? rx : ry;
                        const sx: number = rx > ry ? 1 : rx / ry;
                        const sy: number = rx > ry ? ry / rx : 1;
                        ctx.save();
                        ctx.translate(centp.x, centp.y);
                        ctx.rotate(xAxisRotation);
                        ctx.scale(sx, sy);
                        ctx.arc(0, 0, ra, a1, a1 + ad, !sweep);
                        ctx.scale(1 / sx, 1 / sy);
                        ctx.rotate(-xAxisRotation);
                        ctx.translate(-centp.x, -centp.y);
                        ctx.restore();
                    }
                    break;
                case 'Z':
                case 'z':
                    ctx.closePath();
                    x = x0; y = y0;
                    break;
                }
                x0 = x; y0 = y;
            }
        }
    }

    /**
     * Draw the text element for the diagram\
     *
     *  @returns {void}  Draw the text element for the diagram .\
     *
     *  @param { SVGElement} canvas - Provide the SVG element .
     *  @param {TextAttributes} options - Provide the text element attributes .
     *  @param {SVGSVGElement} parentSvg - Provide the parent SVG element .
     *  @param {Object} ariaLabel - Provide the label properties .
     *  @param {string} diagramId - Provide the diagram id .
     *  @param {number} scaleValue - Provide the scale value .
     *  @param {any} renderer - Provide the renderer value .
     *  @param {element} element - Provide the text element value.
     *  @private
     */
    public drawText(
        canvas: HTMLCanvasElement, options: TextAttributes, parentSvg?: SVGSVGElement, ariaLabel?: Object,
        diagramId?: string, scaleValue?: number, renderer?: any, element?: TextElement):
        void {
        if (options.content && options.visible === true) {
            const parentNode: GroupableView = renderer.groupElement;
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options as StyleAttributes);
            if (scaleValue) {
                options.fontSize *= scaleValue;
            }
            const pivotX: number = options.x + options.width * options.pivotX;
            const pivotY: number = options.y + options.height * options.pivotY;
            // 919944: Text Flip and Rotation Not Applied in Exported Image
            this.applyFlipAndRotate(ctx, options, canvas, pivotX, pivotY, renderer, element);

            this.setFontStyle(canvas, options);

            let i: number = 0;
            let childNodes: SubTextElement[] = [];
            childNodes = options.childNodes;
            const wrapBounds: TextBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                const position: PointModel = this.labelAlign(options, wrapBounds, childNodes);
                for (i = 0; i < childNodes.length; i++) {
                    const child: SubTextElement = childNodes[parseInt(i.toString(), 10)];
                    child.x = setChildPosition(child, childNodes, i, options);
                    const offsetX: number = position.x + (scaleValue ? child.x * scaleValue : child.x) - wrapBounds.x;
                    const offsetY: number = position.y + (scaleValue ? child.dy * scaleValue : child.dy) * i + ((options.fontSize) * 0.8);
                    if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap' && options.textWrapping === 'NoWrap') {
                        child.text = overFlow(child.text, options);
                    }
                    if ((options.textOverflow === 'Clip' || options.textOverflow === 'Ellipsis') && options.textWrapping === 'Wrap') {
                        if (offsetY < parentNode.actualSize.height + parentNode.bounds.y) {
                            if (options.textOverflow === 'Ellipsis' && childNodes[i + 1]) {
                                const temp: SubTextElement = childNodes[i + 1];
                                const y: number = position.y + temp.dy * (i + 1) + ((options.fontSize) * 0.8);
                                if (y > parentNode.actualSize.height + parentNode.bounds.y) {
                                    child.text = child.text.slice(0, child.text.length - 3);
                                    child.text = child.text.concat('...');
                                }
                            }
                            ctx.fillText(child.text, offsetX, offsetY);
                        }
                    } else {
                        ctx.fillText(child.text, offsetX, offsetY);
                    }
                    if (options.textDecoration === 'Underline'
                        || options.textDecoration === 'Overline'
                        || options.textDecoration === 'LineThrough') {
                        const startPointX: number = offsetX;
                        let startPointY: number;
                        const textlength: number = ctx.measureText(child.text).width;
                        const endPointX: number = offsetX + textlength;
                        let endPointY: number;
                        switch (options.textDecoration) {
                        case 'Underline':
                            startPointY = offsetY + 2;
                            endPointY = offsetY + 2;
                            break;
                        case 'Overline':
                            startPointY = (position.y + child.dy * i);
                            endPointY = (position.y + child.dy * i);
                            break;
                        case 'LineThrough':
                            startPointY = ((offsetY + position.y + child.dy * i) / 2) + 2;
                            endPointY = ((offsetY + position.y + child.dy * i) / 2) + 2;
                        }
                        ctx.beginPath();
                        ctx.moveTo(startPointX, startPointY);
                        ctx.lineTo(endPointX, endPointY);
                        ctx.strokeStyle = options.color;
                        ctx.lineWidth = options.fontSize * .08;
                        ctx.globalAlpha = options.opacity;
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
        }
    }

    // 919944: Flip position and rotate angle calculation for elements
    private applyFlipAndRotate(
        ctx: CanvasRenderingContext2D, options: any, canvas: HTMLCanvasElement, pivotX: number, pivotY: number,
        renderer?: any, element?: PathElement | TextElement | ImageElement | DiagramElement):
        void {
            if (options.flip !== FlipDirection.None && renderer && element && !(element.elementActions & ElementAction.ElementIsPort)) {
                const parent: GroupableView  = renderer.groupElement;
                const textWrapper: PathElement | TextElement | ImageElement | DiagramElement = element;
                let transform: ITransform;
                if ((element instanceof TextElement && (element as any).position)) {
                    transform = renderer.renderFlipTextElement( parent, canvas, textWrapper, options.flip, options.flipMode, true );
                } else if (element instanceof PathElement || element instanceof ImageElement || (element instanceof TextElement
                           && !(element as any).position) || element instanceof DiagramElement) {
                    transform = renderer.renderFlipElement( parent, canvas, options.flip, true);
                }
                transform = this.setElementTransform(element, renderer) || transform;
                //To set the translate and scale for the diagram elements while print and export.
                if (transform && transform.transform) {
                    // Parse and apply the transform directly
                    const transformRegex: RegExp = /(translate|scale|rotate)\(([^)]+)\)/g;
                    let match: RegExpExecArray | null;
                    // eslint-disable-next-line no-cond-assign
                    while ((match = transformRegex.exec(transform.transform)) !== null) {
                        const type: string = match[1]; // translate, scale, rotate
                        const values: number[] = match[2].split(',').map((v: string) => parseFloat(v.trim()));
                        switch (type) {
                            case 'translate': {
                                const tx: number = values[0] || 0;
                                const ty: number = values[1] || 0;
                                ctx.translate(tx, ty);
                                break;
                            }
                            case 'scale': {
                                const sx: number = values[0] || 1;
                                const sy: number = values[1] || sx; // Use uniform scaling if sy is not specified
                                ctx.scale(sx, sy);
                                break;
                            }
                        }
                    }
                }
            }
            this.rotateContext(canvas, options.angle, pivotX, pivotY);
    }
    private setElementTransform(element: PathElement | TextElement | ImageElement | DiagramElement,
                                renderer: any): { transform: string } | null {
        const eventSuffixes: string[] = [
            '_cancel_1_event', '_cancel_0_event', '_cancel_2_trigger',
            '_success_0_event', '_success_1_event', '_success_2_trigger',
            '_failure_0_event', '_failure_1_event', '_failure_2_trigger'
        ];
        // Check if the id ends with the transaction sub type ids.
        for (const suffix of eventSuffixes) {
            if (element.id.endsWith(suffix)) {
               const bounds: Rect = renderer.transactionBounds;
               let posX: number = 0; let posY: number = 0; let scaleX: number = 1; let scaleY: number = 1;
               let offsetX: number = 0; let offsetY: number = 0;
               if (element.flip === 1 || element.flip === 3) {
                        posX = bounds.center.x;
                        scaleX = -1;
                        offsetX = -posX;
                    }
                    if (element.flip === 2 || element.flip === 3) {
                        posY = bounds.center.y;
                        scaleY = -1;
                        offsetY = -posY;
                    }
                    return {
                        transform: 'translate(' + posX + ',' + posY + ') scale(' + scaleX + ','
                            + scaleY + ') translate(' + offsetX + ',' + offsetY + ')'
                    };
            }
        }

        return null;
    }

    private loadImage(
        ctx: CanvasRenderingContext2D, obj: ImageAttributes, canvas: HTMLCanvasElement, pivotX: number, pivotY: number):
        void {
        // 919944: Image Node Flip and Rotation Not Applied in Exported Image
        const image: HTMLImageElement = new Image();
        image.src = obj.source;
        this.image(ctx, image, obj.x, obj.y, obj.width, obj.height, obj);
    }

    /**
     * Draw the image element for the diagram\
     *
     *  @returns {void} Draw the image element for the diagram .
     *  @param { SVGElement | HTMLCanvasElement} canvas - Provide the SVG element .
     *  @param {ImageAttributes} obj - Provide the image attributes .
     *  @param {SVGSVGElement} parentSvg - Provide the parent SVG element .
     *  @param {boolean} fromPalette - Provide the pointer event value .
     *  @param {any} renderer - provide renderer value
     *  @param {ImageElement} element - provide image element
     *  @private
     */
    public drawImage(canvas: HTMLCanvasElement, obj: ImageAttributes, parentSvg?: SVGSVGElement, fromPalette?: boolean,
                     renderer?: any, element?: ImageElement): void {

        if (obj.visible) {
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            const pivotX: number = obj.x + obj.width * obj.pivotX;
            const pivotY: number = obj.y + obj.height * obj.pivotY;

            const imageObj: HTMLImageElement = new Image();
            imageObj.src = obj.source;
            // 919867: Opacity for the image node is not applied to the exported image
            this.setStyle(canvas, obj as StyleAttributes);
            const id: string[] = ctx.canvas.id.split('_');
            // eslint-disable-next-line
            const value: boolean = id[id.length - 1] === ('diagram' || 'diagramLayer') ? true : false;
            // eslint-disable-next-line
            /** 
             *  Since Clipping portion for node with slice option is not calculated properly
             * if (obj.sourceX !== undefined && obj.sourceY !== undefined && obj.sourceWidth !== undefined
             *  && obj.sourceHeight !== undefined) {
             *  ctx.drawImage(imageObj, obj.sourceX, obj.sourceY, obj.sourceWidth, obj.sourceHeight, obj.x, obj.y, obj.width, obj.height);
             *  } else {
             *             ctx.drawImage(imageObj, obj.x, obj.y, obj.width, obj.height);
             * }
             */
            // 919944: Image Node Flip and Rotation Not Applied in Exported Image
            this.applyFlipAndRotate(ctx, obj, canvas, pivotX, pivotY, renderer, element);
            if (!fromPalette) {
                this.loadImage(ctx, obj, canvas, pivotX, pivotY);
            } else {
                imageObj.onload = () => {
                    this.loadImage(ctx, obj, canvas, pivotX, pivotY);
                };
            }
            ctx.restore();
        }
    }

    private image(
        ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number,
        width: number, height: number, alignOptions: ImageAttributes)
        :
        void {
        ctx.beginPath();
        const srcWidth: number = image.width;
        const srcHeight: number = image.height;
        const destinationW: number = width;
        const destinationH: number = height;
        let resultWidth: number = 0;
        let resultHeight: number = 0;

        if (alignOptions && alignOptions.alignment !== 'None') {
            const xalign: string = alignOptions.alignment.toLowerCase().substr(1, 3);
            const yalign: string = alignOptions.alignment.toLowerCase().substr(5, 3);
            if (alignOptions.scale === 'Slice') {
                // eslint-disable-next-line
                const a: Function = () => {
                    resultWidth = destinationW;
                    resultHeight = srcHeight * destinationW / srcWidth;
                };
                // eslint-disable-next-line
                const b: Function = () => {
                    resultWidth = srcWidth * destinationH / srcHeight;
                    resultHeight = destinationH;
                };

                if (destinationW > destinationH) {
                    a();
                    if (destinationH > resultHeight) {
                        b();
                    }
                } else if (destinationW === destinationH) {
                    if (srcWidth > srcHeight) {
                        b();
                    } else {
                        a();
                    }
                } else {
                    b();
                    if (destinationW > resultWidth) {
                        a();
                    }
                }

                const x1: number = this.getSliceOffset(xalign, resultWidth, destinationW, srcWidth);
                const y1: number = this.getSliceOffset(yalign, resultHeight, destinationH, srcHeight);
                const sWidth: number = srcWidth - x1;
                const sHeight: number = srcHeight - y1;
                const dWidth: number = resultWidth - (x1 * (resultWidth / srcWidth));
                const dHeight: number = resultHeight - (y1 * (resultHeight / srcHeight));
                const canvas1: HTMLCanvasElement = createHtmlElement(
                    'canvas', { 'width': width.toString(), 'height': height.toString() }) as HTMLCanvasElement;
                const ctx1: CanvasRenderingContext2D = canvas1.getContext('2d');
                ctx1.drawImage(image, x1, y1, sWidth, sHeight, 0, 0, dWidth, dHeight);
                ctx.drawImage(canvas1, x, y, width, height);
            } else if (alignOptions.scale === 'Meet') {
                const srcRatio: number = (srcHeight / srcWidth);
                const destRatio: number = (destinationH / destinationW);
                resultWidth = destRatio > srcRatio ? destinationW : destinationH / srcRatio;
                resultHeight = destRatio > srcRatio ? destinationW * srcRatio : destinationH;
                x += this.getMeetOffset(xalign, resultWidth, destinationW);
                y += this.getMeetOffset(yalign, resultHeight, destinationH);
                ctx.drawImage(image, 0, 0, srcWidth, srcHeight, x, y, resultWidth, resultHeight);
            } else {
                ctx.drawImage(image, x, y, width, height);
            }
        }
        else {
            ctx.drawImage(image, x, y, width, height);
        }
        ctx.closePath();
    }

    private getSliceOffset(arg: string, res: number, dest: number, src: number): number {
        switch (arg) {
        case 'min': return 0;
        case 'mid': return (res - dest) / 2 * src / res;
        case 'max': return (res - dest) * src / res;
        default: return 0;
        }
    }

    private getMeetOffset(arg: string, res: number, dest: number): number {

        const max: number = Math.max(res, dest);
        const min: number = Math.min(res, dest);

        switch (arg) {
        case 'min': return 0;
        case 'mid': return (max - min) / 2;
        case 'max': return max - min;
        default: return 0;
        }
    }

    //end region

    // vector magnitude
    private m(v: number[]): number { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); }
    // ratio between two vectors
    private r(u: number[], v: number[]): number { return (u[0] * v[0] + u[1] * v[1]) / (this.m(u) * this.m(v)); }
    // angle between two vectors
    private a(u: number[], v: number[]): number { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(this.r(u, v)); }



    // text utility


    /**
     * Draw the SVG label.\
     *
     * @returns {PointModel} Draw the SVG label .
     *  @param {TextAttributes} text - Provide the canvas element .
     *  @param {Object} wrapBounds - Provide the canvas element .
     *  @param {SubTextElement []} childNodes - Provide the canvas element .
     * @private
     */
    public labelAlign(text: TextAttributes, wrapBounds: TextBounds, childNodes: SubTextElement[]): PointModel {
        const bounds: Size = new Size(wrapBounds.width, childNodes.length * (text.fontSize * 1.2));
        const position: PointModel = { x: 0, y: 0 };
        const labelX: number = text.x;
        const labelY: number = text.y;
        const offsetx: number = text.width * 0.5;
        const offsety: number = text.height * 0.5;
        let pointx: number = offsetx;
        const pointy: number = offsety;
        if (text.textAlign === 'left') {
            pointx = 0;
        } else if (text.textAlign === 'center') {
            if (wrapBounds.width > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                if (text.textWrapping === 'NoWrap') {
                    pointx = 0;
                } else {
                    pointx = text.width * 0.5;
                }
            } else {
                pointx = text.width * 0.5;
            }
        } else if (text.textAlign === 'right') {
            pointx = (text.width * 1);
        }
        position.x = labelX + pointx + (wrapBounds ? wrapBounds.x : 0);
        position.y = labelY + pointy - bounds.height / 2;
        return position;
    }
}

