import { Size } from './../primitives/size';
import { PointModel } from './../primitives/point-model';
import { pathSegmentCollection, getRectanglePath, processPathData } from './../utility/path-util';
// import { overFlow } from './../utility/base-util';
import { createHtmlElement } from './../utility/dom-util';
import { PathSegment, StyleAttributes, ImageAttributes } from './canvas-interface';
import { RectAttributes, PathAttributes, TextAttributes, SubTextElement, TextBounds, ImageEntry } from './canvas-interface';
import { DrawingElement } from '../core/elements/drawing-element';
import { DrawingRenderer } from './renderer';

/**
 * @hidden
 * CloudArcModel
 */
export interface CloudArcModel {
    start: PointModel;
    end: PointModel;
    center: PointModel;
    radius: number;
    startAngle: number;
    endAngle: number;
    anticlockwise: boolean;
}

/**
 * @hidden
 * BoundsModel
 */
export interface BoundsModel {
    x: number;
    y: number;
    width: number;
    height: number;
}

/**
 * @hidden
 * DistancePointModel
 */
export interface DistancePointModel extends PointModel {
    distance: number;
}

/**
 * @hidden
 * Canvas Renderer
 */
export class CanvasRenderer {
    /** @private */
    public imageList: Record<string, ImageEntry[]> = {};
    private rectWidth: number = 0;
    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @private
     * @returns {CanvasRenderingContext2D} - CanvasRenderingContext2D
     */
    public static getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    private setStyle(canvas: HTMLCanvasElement, style: StyleAttributes): void {
        const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        if (style.fill === 'none') { style.fill = 'transparent'; }
        if (style.stroke === 'none') { style.stroke = 'transparent'; }
        ctx.strokeStyle = style.stroke;
        if (style.thickness !== undefined) {
            ctx.lineWidth = style.thickness * (96 / 72);
        }
        else {
            ctx.lineWidth = style.strokeWidth;
        }
        if (style.strokeWidth === 0) {
            ctx.strokeStyle = 'transparent';
        }
        if (style.isSharpEdge) {
            ctx.lineJoin = 'miter';
            ctx.miterLimit = 10;
            ctx.lineCap = 'butt';
        }
        ctx.globalAlpha = style.opacity;
        let dashArray: number[] = [];
        if (style.dashArray) {
            dashArray = this.parseDashArray(style.dashArray);
            if (dashArray && dashArray.length > 0) {
                ctx.lineCap = 'butt';
                ctx.lineDashOffset = 0;
            }
        }
        ctx.setLineDash(dashArray);
        ctx.fillStyle = style.fill;
    }

    private setStyleFreetextEJ2(canvas: HTMLCanvasElement, style: StyleAttributes): void {
        const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        if (style.fill === 'none') { style.fill = 'transparent'; }
        if (style.stroke === 'none') { style.stroke = 'transparent'; }
        ctx.strokeStyle = style.stroke;
        if (style.thickness !== undefined) {
            ctx.lineWidth = style.thickness * (96 / 72);
        }
        else {
            ctx.lineWidth = style.strokeWidth * (96 / 72);
        }
        if (style.strokeWidth === 0) {
            ctx.strokeStyle = 'transparent';
        }
        ctx.lineJoin = 'miter';
        ctx.miterLimit = 10;
        ctx.lineCap = 'butt';
        ctx.globalAlpha = style.opacity;
        let dashArray: number[] = [];
        if (style.dashArray) {
            dashArray = this.parseDashArray(style.dashArray);
        }
        ctx.setLineDash(dashArray);
        ctx.fillStyle = style.fill;
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
     * @param {string} dashArray - dashArray
     * @private
     * @returns {number[]} - array of number
     */
    public parseDashArray(dashArray: string | number[]): number[] {
        if (Array.isArray(dashArray)) {
            return dashArray;
        }
        const dashes: number[] = [];
        const separator: string = dashArray.indexOf(' ') !== -1 ? ' ' : ',';
        const splittedDashes: string[] = dashArray.split(separator);
        for (const i of splittedDashes) {
            dashes.push(Number(i));
        }
        return dashes;
    }

    /**
     * Renders a cloud-style (scalloped) border along a rectangle's perimeter.
     *
     * The cloud is drawn as a single continuous path that walks around the
     * rectangle laying down outward-bulging semicircles (scallops) along each
     * edge and a single rounded scallop at each corner. The scallop radius is
     * a constant derived from `cloudIntensity` and is independent of the
     * rectangle's size so resizing only changes how many arcs fit on each edge.
     *
     * @param {CanvasRenderingContext2D} ctx - canvas context
     * @param {number} x - rectangle x (top-left)
     * @param {number} y - rectangle y (top-left)
     * @param {number} width - rectangle width
     * @param {number} height - rectangle height
     * @param {number} cloudIntensity - intensity in the range 1..2 (controls scallop size)
     * @param {string} fillColor - fillColor
     * @returns {void} - void
     */
    private drawCloudRectangle(ctx: CanvasRenderingContext2D, x: number, y: number, width: number,
                               height: number, cloudIntensity: number, fillColor: string): void {
        // Early exit for invalid dimensions
        if (width <= 0 || height <= 0) {
            return;
        }
        const intensity: number = Math.min(Math.max(cloudIntensity, 1), 2);
        const radius: number = Math.max(3, Math.min(20, 6 * intensity));
        let horizontalRadius: number = this.getAdjustedRadius(width, radius);
        let verticalRadius: number = this.getAdjustedRadius(height, radius);
        horizontalRadius = horizontalRadius || 1;
        verticalRadius = verticalRadius || 1;
        // Pre-calculate common endpoints
        const rightEnd: number = x + width;
        const topEnd: number = y + height;
        ctx.beginPath();
        // Case 1: Height is very small (flat rectangle)
        if (height <= verticalRadius * 2) {
            if (height < radius) {
                // Very short - draw horizontal scallops only
                const scallopCount: number = Math.max(1, Math.round(width / (radius * 2)));
                const adjHRadius: number = width / (scallopCount * 2);
                ctx.moveTo(x, y);
                // Top scallops
                for (let i: number = 0; i < scallopCount; i++) {
                    const centerX: number = x + adjHRadius + i * adjHRadius * 2;
                    ctx.arc(centerX, y, adjHRadius, Math.PI, 0, false);
                }
                ctx.lineTo(rightEnd, topEnd);
                // Bottom scallops
                for (let i: number = scallopCount - 1; i >= 0; i--) {
                    const centerX: number = x + adjHRadius + i * adjHRadius * 2;
                    ctx.arc(centerX, topEnd, adjHRadius, 0, Math.PI, false);
                }
                ctx.lineTo(x, y);
            } else {
                // Moderate height - draw rounded corners with middle scallops
                const capRadius: number = height / 2;
                let adjHRadius: number = this.getAdjustedRadius(width - capRadius * 2, radius) || 1;
                let lastX: number = x + capRadius + adjHRadius;
                ctx.arc(x, y, capRadius, Math.PI / 2, 0, false);
                adjHRadius = adjHRadius <= 0 ? 1 : adjHRadius;
                while (lastX + adjHRadius <= rightEnd) {
                    ctx.arc(lastX, y, adjHRadius, Math.PI, 0, false);
                    lastX += adjHRadius * 2;
                }
                ctx.arc(rightEnd, y, capRadius, Math.PI, Math.PI / 2, false);
                ctx.arc(rightEnd, topEnd, capRadius, Math.PI * 1.5, Math.PI, false);
                lastX = rightEnd - capRadius - adjHRadius;
                while (lastX - adjHRadius >= x) {
                    ctx.arc(lastX, topEnd, adjHRadius, 0, Math.PI, false);
                    lastX -= adjHRadius * 2;
                }
                ctx.arc(x, topEnd, capRadius, 0, Math.PI * 1.5, false);
            }
            ctx.closePath();
            if (fillColor !== 'transparent') {
                ctx.fill();
            }
            if (ctx.strokeStyle !== 'transparent'){
                ctx.stroke();
            }
            return;
        }
        // Case 2: Width is very small (narrow rectangle)
        if (width <= horizontalRadius * 2) {
            if (width < radius) {
                // Very narrow - draw vertical scallops only
                const scallopCount: number = Math.max(1, Math.round(height / (radius * 2)));
                const adjVRadius: number = height / (scallopCount * 2);
                ctx.moveTo(x, y);
                // Left scallops (top to bottom)
                for (let i: number = 0; i < scallopCount; i++) {
                    const centerY: number = y + adjVRadius + i * adjVRadius * 2;
                    ctx.arc(x, centerY, adjVRadius, -Math.PI / 2, Math.PI / 2, true);
                }
                ctx.lineTo(rightEnd, topEnd);
                // Right scallops (bottom to top)
                for (let i: number = scallopCount - 1; i >= 0; i--) {
                    const centerY: number = y + adjVRadius + i * adjVRadius * 2;
                    ctx.arc(rightEnd, centerY, adjVRadius, Math.PI / 2, -Math.PI / 2, true);
                }
                ctx.lineTo(x, y);
            } else {
                // Moderate width - draw rounded corners with middle scallops
                const capRadius: number = width / 2;
                const availableHeight: number = height - capRadius * 2;
                if (availableHeight <= 0) {
                    // Rectangle too small, draw simple rectangle
                    ctx.rect(x, y, width, height);
                } else {
                    const adjVRadius: number = this.getAdjustedRadius(availableHeight, radius) || 1;
                    const lastX: number = x + capRadius * 2;
                    let lastY: number = y + capRadius + adjVRadius;
                    ctx.arc(x, y, capRadius, Math.PI / 2, 0, false);
                    ctx.arc(lastX, y, capRadius, Math.PI, Math.PI / 2, false);
                    while (lastY + adjVRadius <= topEnd) {
                        ctx.arc(lastX, lastY, adjVRadius, Math.PI * 1.5, Math.PI / 2, false);
                        lastY += adjVRadius * 2;
                    }
                    ctx.arc(lastX, lastY, capRadius, Math.PI * 1.5, Math.PI, false);
                    ctx.arc(lastX - capRadius * 2, lastY, capRadius, 0, Math.PI * 1.5, false);
                    lastY = topEnd - capRadius - adjVRadius;
                    while (lastY - adjVRadius >= y) {
                        ctx.arc(x, lastY, adjVRadius, Math.PI / 2, Math.PI * 1.5, false);
                        lastY -= adjVRadius * 2;
                    }
                }
            }
            ctx.closePath();
            if (fillColor !== 'transparent'){
                ctx.fill();
            }
            if (ctx.strokeStyle !== 'transparent') {
                ctx.stroke();
            }
            return;
        }
        // Case 3: Normal rectangle - draw full scallop pattern
        let lastX: number = x;
        let lastY: number = y;
        // Top-left corner
        ctx.arc(x, y, horizontalRadius, Math.PI / 2, 0, false);
        lastX = x + horizontalRadius * 2;
        // Top edge scallops
        while (lastX + horizontalRadius <= rightEnd) {
            ctx.arc(lastX, lastY, horizontalRadius, Math.PI, 0, false);
            lastX += horizontalRadius * 2;
        }
        // Top-right corner
        ctx.arc(lastX, lastY, horizontalRadius, Math.PI, Math.PI / 2, false);
        lastY = y + horizontalRadius * 2;
        // Right edge scallops
        while (lastY + verticalRadius <= topEnd) {
            ctx.arc(lastX, lastY, verticalRadius, Math.PI * 1.5, Math.PI / 2, false);
            lastY += verticalRadius * 2;
        }
        // Bottom-right corner
        ctx.arc(lastX, lastY, verticalRadius, Math.PI * 1.5, Math.PI, false);
        lastX = lastX - verticalRadius * 2;
        // Bottom edge scallops
        while (lastX - horizontalRadius >= x) {
            ctx.arc(lastX, lastY, horizontalRadius, 0, Math.PI, false);
            lastX -= horizontalRadius * 2;
        }
        // Bottom-left corner
        ctx.arc(lastX, lastY, horizontalRadius, 0, Math.PI * 1.5, false);
        lastY -= horizontalRadius * 2;
        // Left edge scallops
        while (lastY - verticalRadius >= y) {
            ctx.arc(lastX, lastY, verticalRadius, Math.PI / 2, Math.PI * 1.5, false);
            lastY -= verticalRadius * 2;
        }
        ctx.closePath();
        if (fillColor !== 'transparent') {
            ctx.fill();
        }
        if (ctx.strokeStyle !== 'transparent'){
            ctx.stroke();
        }
    }

    /**
     * @param {number} length - canvas
     * @param {number} preferredRadius - options
     * @private
     * @returns {number} - number
     */
    private getAdjustedRadius(length: number, preferredRadius: number): number {
        const cloudCount: number = Math.max(
            1,
            Math.round(length / (preferredRadius * 2))
        );
        return length / (cloudCount * 2);
    }

    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @param {RectAttributes} options - options
     * @private
     * @returns {void} - void
     */
    public drawRectangle(canvas: HTMLCanvasElement, options: RectAttributes): void {
        if ((options as any).childNodes === undefined) {
            this.rectWidth = options.width;
        }
        if (options.visible === true) {
            if (options.cornerRadius) {
                (options as PathAttributes).data = getRectanglePath(options.cornerRadius, options.height, options.width);
                this.drawPath(canvas, options as PathAttributes);
            } else {
                const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
                ctx.save();
                ctx.beginPath();
                const cornerRadius: number = options.cornerRadius;
                const pivotX: number = options.x + options.width * options.pivotX;
                const pivotY: number = options.y + options.height * options.pivotY;
                this.rotateContext(canvas, options.angle, pivotX, pivotY);
                this.setStyle(canvas, options as StyleAttributes);
                // Cloud border shorthand detection. The renderer is invoked from a shared path
                // for rectangle annotations, so the trigger lives on the options bag.
                const isCloudBorder: boolean = options.borderStyle === 'Cloud';
                const cloudIntensity: number = options.cloudIntensity !== undefined ? options.cloudIntensity : 1;
                if (isCloudBorder) {
                    // Reset any dash pattern so the cloud stroke is continuous.
                    ctx.setLineDash([]);
                    this.drawCloudRectangle(ctx, options.x, options.y, options.width, options.height, cloudIntensity, options.fill);
                    ctx.closePath();
                    ctx.restore();
                } else if (options.thickness !== undefined && !(options as TextAttributes).isShapeLabel) {
                    const strokeWidth: number = ctx.lineWidth || 1;
                    const halfStroke: number = strokeWidth / 2;
                    const strokeX: number = options.x + halfStroke;
                    const strokeY: number = options.y + halfStroke;
                    const strokeW: number = Math.max(0, options.width - strokeWidth);
                    const strokeH: number = Math.max(0, options.height - strokeWidth);
                    if (ctx.fillStyle !== 'transparent') {
                        const fillX: number = options.x + (strokeWidth > 0 ? strokeWidth : 0);
                        const fillY: number = options.y + (strokeWidth > 0 ? strokeWidth : 0);
                        const fillW: number = Math.max(0, options.width - (strokeWidth > 0 ? 2 * strokeWidth : 0));
                        const fillH: number = Math.max(0, options.height - (strokeWidth > 0 ? 2 * strokeWidth : 0));
                        if (fillW > 0 && fillH > 0) {
                            ctx.fillRect(fillX, fillY, fillW, fillH);
                        }
                    }
                    if (ctx.strokeStyle !== 'transparent' && strokeW > 0 && strokeH > 0) {
                        ctx.rect(strokeX, strokeY, strokeW, strokeH);
                        ctx.stroke();
                        ctx.closePath();
                        ctx.restore();
                    }
                } else {
                    ctx.rect(options.x, options.y, options.width, options.height);
                    ctx.fillRect(options.x, options.y, options.width, options.height);
                    if (!options.isRectangle) {
                        ctx.fill();
                    }
                    ctx.stroke();
                    ctx.closePath();
                    ctx.restore();
                }
            }
        }
    }

    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @param {RectAttributes} options - options
     * @private
     * @returns {void} - void
     */
    public drawRectangleFreetextEJ2(canvas: HTMLCanvasElement, options: RectAttributes): void {
        if ((options as any).childNodes === undefined) {
            this.rectWidth = options.width;
        }
        if (options.visible === true) {
            if (options.cornerRadius) {
                (options as PathAttributes).data = getRectanglePath(options.cornerRadius, options.height, options.width);
                this.drawPath(canvas, options as PathAttributes);
            } else {
                const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
                ctx.save();
                ctx.beginPath();
                const cornerRadius: number = options.cornerRadius;
                const pivotX: number = options.x + options.width * options.pivotX;
                const pivotY: number = options.y + options.height * options.pivotY;
                this.rotateContext(canvas, options.angle, pivotX, pivotY);
                this.setStyleFreetextEJ2(canvas, options as StyleAttributes);
                ctx.beginPath();
                // Cloud border support for FreeText
                if (options.borderStyle === 'Cloud' && options.cloudIntensity !== undefined) {
                    const cloudIntensity: number = options.cloudIntensity;
                    this.drawCloudRectangle(ctx, options.x, options.y, options.width, options.height, cloudIntensity, options.fill);
                    return;
                }
                ctx.rect(options.x, options.y, options.width, options.height);
                ctx.clip();
                const strokeWidth: number = ctx.lineWidth || 1;
                const halfStroke: number = strokeWidth / 2;
                const strokeX: number = options.x + halfStroke;
                const strokeY: number = options.y + halfStroke;
                const strokeW: number = Math.max(0, options.width - strokeWidth);
                let strokeH: number = Math.max(0, options.height - strokeWidth);
                if (strokeH <= 0) {
                    strokeH = 1;
                }
                if (ctx.fillStyle !== 'transparent') {
                    const fillX: number = options.x + (strokeWidth > 0 ? strokeWidth : 0);
                    const fillY: number = options.y + (strokeWidth > 0 ? strokeWidth : 0);
                    const fillW: number = Math.max(0, options.width - (strokeWidth > 0 ? 2 * strokeWidth : 0));
                    const fillH: number = Math.max(0, options.height - (strokeWidth > 0 ? 2 * strokeWidth : 0));
                    if (fillW > 0 && fillH > 0) {
                        ctx.fillRect(fillX, fillY, fillW, fillH);
                    }
                }
                if (ctx.strokeStyle !== 'transparent' && strokeW > 0 && strokeH > 0) {
                    ctx.beginPath();
                    ctx.rect(strokeX, strokeY, strokeW, strokeH);
                    ctx.stroke();
                    ctx.closePath();
                }
                ctx.restore();
            }
        }
    }


    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @param {PathAttributes} options - options
     * @private
     * @returns {void} - void
     */
    public drawPath(canvas: HTMLCanvasElement, options: PathAttributes): void {
        let collection: Object[] = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
        const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        // R-18 / Phase 3: match the live Freehand Highlight drawing stroke
        // styling (ctx.lineCap = 'round'; ctx.lineJoin = 'round' set in
        // ink-annotation.ts:5853-5857 and ink-annotation.ts:761). Without
        // these, the EJ2 PathElement redraw via refreshDiagramElements
        // produces sharper stroke edges than the live preview, which is
        // noticeable once the annotation enters the collection. Applied
        // here so every PathElement redraw — annotation canvas, blend
        // canvas, FH wrappers, plain Ink, Shape, FreeText callouts —
        // uses the same rounded geometry.
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.save();
        ctx.beginPath();
        const pivotY: number = options.y + options.height * options.pivotY;
        const pivotX: number = options.x + options.width * options.pivotX;
        this.rotateContext(canvas, options.angle, pivotX, pivotY);
        this.setStyle(canvas, options as StyleAttributes);
        ctx.translate(options.x, options.y);
        if (options.strokeWidth > 1 && options.opacity < 1 && collection.length > 2 && options.id !== 'diagram_helper_content' &&
            (options.annotationType === 'Polygon' || options.annotationType === 'Radius' || options.annotationType === 'Ellipse')) {
            this.drawPathWithMask(canvas, ctx, options, collection);
        }
        else {
            this.renderPath(canvas, options, collection);
            ctx.fill();
            ctx.translate(-options.x, -options.y);
            ctx.stroke();
            ctx.restore();
        }
    }

    private drawPathWithMask(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, options: PathAttributes,
                             collection: Object[]): void {
        ctx.save();
        ctx.beginPath();
        this.renderPath(canvas, options, collection);
        ctx.globalAlpha = options.opacity;
        ctx.fillStyle = options.fill;
        ctx.fill('evenodd');
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1;
        ctx.lineWidth = options.strokeWidth;
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = options.stroke;
        ctx.lineWidth = options.strokeWidth;
        ctx.globalAlpha = options.opacity;
        ctx.stroke();
        ctx.restore();
        ctx.translate(-options.x, -options.y);
    }

    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @param {PathAttributes} options - options
     * @param {Object[]} collection - collection
     * @private
     * @returns {void} - void
     */
    public renderPath(canvas: HTMLCanvasElement, options: PathAttributes, collection: Object[]): void {
        if (options.visible === true) {
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            const isCloudBorder: boolean = options.borderStyle === 'Cloud';
            const cloudIntensity: number = options.cloudIntensity ? options.cloudIntensity : 1;
            if (isCloudBorder) {
                this.renderCloudPath(canvas, options, collection, ctx, cloudIntensity);
                return;
            }
            let x0: number; let y0: number; let x1: number; let y1: number; let x2: number; let y2: number;
            let x: number; let y: number; let length: number; let i: number; let newSeg: Object; const segs: Object[] = collection;
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
                {
                    const curr: PointModel = { x: x0, y: y0 };
                    let rx: number = seg.r1;
                    let ry: number = seg.r2;
                    const xAxisRotation: number = seg.angle * (Math.PI / 180.0);
                    const largeArc: boolean = seg.largeArc;
                    const sweep: boolean = seg.sweep;
                    const cp: PointModel = { x: x, y };
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
                }
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

    private renderCloudPath(canvas: HTMLCanvasElement, options: PathAttributes, collection: Object[],
                            ctx: CanvasRenderingContext2D, cloudIntensity: number): void {
        const bounds: { minX: number; minY: number; maxX: number; maxY: number } = this.getPathBounds(collection);
        const width: number = Math.max(0, bounds.maxX - bounds.minX);
        const height: number = Math.max(0, bounds.maxY - bounds.minY);
        if (width <= 0 || height <= 0) {
            return;
        }
        ctx.save();
        ctx.beginPath();
        this.rotateContext(canvas, options.angle, options.x + options.width * options.pivotX, options.y + options.height * options.pivotY);
        this.setStyle(canvas, options as StyleAttributes);
        ctx.setLineDash([]);
        const annotationType: string = options.annotationType as string;
        if (annotationType === 'Radius' || annotationType === 'Ellipse') {
            // Restore the earlier simple cloud radius logic.
            const intensity: number = Math.min(Math.max(cloudIntensity, 1), 2);
            const radius: number = Math.max(3, Math.min(20, 6 * intensity));
            this.drawCloudEllipsePath(ctx, bounds.minX, bounds.minY, width, height, radius);
        }
        else if (annotationType === 'Line' || annotationType === 'Polygon' || annotationType === 'Area' || annotationType === 'Volume') {
            const intensity: number = cloudIntensity;
            const radius: number = Math.max(3, Math.min(20, 7.5 * intensity));
            const points: PointModel[] = this.getPathPoints(collection, annotationType);
            this.drawOpenCloudPolygon(ctx, points, radius, undefined, undefined, this.getCloudSide(points));
        }
        else {
            this.drawCloudRectangle(ctx, bounds.minX, bounds.minY, width, height, cloudIntensity, options.fill);
        }
        if (annotationType !== 'Line') {
            ctx.closePath();
        }
        ctx.restore();
    }

    private getCloudSide(points: PointModel[]): string {
        if (!points || points.length < 3) {
            return 'right';
        }
        let signedArea: number = 0;
        let pointCount: number = points.length;
        /*
         * Ignore repeated closing points at the end.
         */
        while (
            pointCount > 1 &&
            points[pointCount - 1].x === points[0].x &&
            points[pointCount - 1].y === points[0].y
        ) {
            pointCount--;
        }
        if (pointCount < 3) {
            return 'right';
        }
        /*
         * Determine the polygon winding direction using the
         * shoelace formula.
         */
        for (let i: number = 0; i < pointCount; i++) {
            const currentPoint: PointModel = points[parseInt(i.toString(), 10)];
            const nextPoint: PointModel = points[(i + 1) % pointCount];
            signedArea +=
                currentPoint.x * nextPoint.y -
                nextPoint.x * currentPoint.y;
        }
        /*
         * In Canvas coordinates:
         * signedArea > 0 means clockwise.
         * signedArea < 0 means counterclockwise.
         *
         * The cloud side represents the arc-center side.
         * The arc center should be toward the polygon interior,
         * allowing the visible arc to bulge outward.
         */
        return signedArea > 0 ? 'right' : 'left';
    }

    /**
     * Draw an open cloudy polygon/polyline.
     *
     * Important:
     * 1. No ctx.closePath().
     * 2. No modulo operation connecting the last point
     *    back to the first.
     * 3. The last vertex remains open.
     * @param {CanvasRenderingContext2D} ctx - canvas ctx
     * @param {PointModel} inputPoints - inputPoints
     * @param {number} cloudRadius - cloudRadius
     * @param {string} strokeColor - strokeColor
     * @param {number} lineWidth - lineWidth
     * @param {string} cloudSide - cloudSide
     * @returns {void} void
     */
    private drawOpenCloudPolygon(ctx: CanvasRenderingContext2D, inputPoints: PointModel[], cloudRadius: number = 0,
                                 strokeColor: string = '#e04636', lineWidth: number = 1, cloudSide: string = 'right'): void {
        const points: PointModel[] = this.sanitizeOpenPoints(inputPoints);
        if (points.length < 2) {
            return;
        }
        const radius: number = this.getCloudRadius(points, cloudRadius);
        /*
         * Generate every cloud lobe independently per edge.
         *
         * This guarantees that every clicked vertex remains
         * in its original position and avoids perimeter
         * redistribution when another point is added.
         */
        const lobes: CloudArcModel[] = [];
        for (let edgeIndex: number = 0; edgeIndex < points.length - 1; edgeIndex++) {
            const edgeStart: PointModel = points[parseInt(edgeIndex.toString(), 10)];
            const edgeEnd: PointModel = points[edgeIndex + 1];
            const edgeLobes: CloudArcModel[] = this.createEdgeCloudLobes(edgeStart, edgeEnd, radius, cloudSide);
            for (const lobe of edgeLobes) {
                lobes.push(lobe);
            }
        }
        if (lobes.length === 0) {
            return;
        }
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(lobes[0].start.x, lobes[0].start.y);
        for (const lobe of lobes) {
            /*
             * If two polygon edges meet at a vertex, the end
             * of the previous lobe and start of the next lobe
             * are the same polygon vertex.
             */
            ctx.arc(lobe.center.x, lobe.center.y, lobe.radius, lobe.startAngle,
                    lobe.endAngle, lobe.anticlockwise);
        }
        /*
         * Intentionally do not call ctx.closePath().
         */
        ctx.stroke();
        ctx.restore();
    }


    /**
     * Create cloud arcs along one polygon edge.
     *
     * Each edge starts and ends exactly at its original
     * clicked vertices, so adding a new point does not
     * shift old vertex positions.
     * @param {PointModel} edgeStart - edgeStart
     * @param {PointModel} edgeEnd - edgeEnd
     * @param {number} cloudRadius - cloudRadius
     * @param {string} cloudSide - cloudSide
     * @returns {CloudArcModel[]} - CloudArcModel[]
     */
    private createEdgeCloudLobes(edgeStart: PointModel, edgeEnd: PointModel, cloudRadius: number,
                                 cloudSide: string): CloudArcModel[] {
        const dx: number = edgeEnd.x - edgeStart.x;
        const dy: number = edgeEnd.y - edgeStart.y;
        const edgeLength: number = Math.hypot(dx, dy);
        if (edgeLength < 0.0001 || cloudRadius <= 0) {
            return [];
        }
        /*
         * Keep each chord shorter than the cloud diameter.
         * Therefore, every lobe can use exactly cloudRadius.
         */
        const maximumChordLength: number = cloudRadius * 1.65;
        const lobeCount: number = Math.max(1, Math.ceil(edgeLength / maximumChordLength));
        const lobes: CloudArcModel[] = [];
        for (let i: number = 0; i < lobeCount; i++) {
            const startRatio: number = i / lobeCount;
            const endRatio: number = (i + 1) / lobeCount;
            const startPoint: PointModel = {
                x: edgeStart.x + dx * startRatio,
                y: edgeStart.y + dy * startRatio
            };
            const endPoint: PointModel = {
                x: edgeStart.x + dx * endRatio,
                y: edgeStart.y + dy * endRatio
            };
            const lobe: CloudArcModel | null = this.createCloudLobe(startPoint, endPoint, cloudRadius, cloudSide);
            if (lobe) {
                lobes.push(lobe);
            }
        }
        return lobes;
    }

    /**
     * Calculate a circular cloud arc between two points.
     *
     * cloudSide:
     * "right" places the visible bulge on the right side
     * of the directed segment.
     *
     * "left" places the visible bulge on the left side.
     * @param {PointModel} startPoint - startPoint
     * @param {PointModel} endPoint - endPoint
     * @param {number} preferredRadius - preferredRadius
     * @param {string} cloudSide - cloudSide
     * @returns {CloudArcModel | null} - CloudArcModel | null
     */
    private createCloudLobe(startPoint: PointModel, endPoint: PointModel, preferredRadius: number, cloudSide: string
    ): CloudArcModel | null {
        const dx: number = endPoint.x - startPoint.x;
        const dy: number = endPoint.y - startPoint.y;
        const chordLength: number = Math.hypot(dx, dy);
        if (chordLength < 0.0001) {
            return null;
        }
        const actualRadius: number = preferredRadius;
        const midpoint: PointModel = {
            x: (startPoint.x + endPoint.x) / 2,
            y: (startPoint.y + endPoint.y) / 2
        };
        const centerOffset: number = Math.sqrt(
            Math.max(0, actualRadius * actualRadius - chordLength * chordLength / 4));
        /*
         * Left-side unit normal of the directed chord.
         */
        const normalX: number = -dy / chordLength;
        const normalY: number = dx / chordLength;
        /*
         * To make the visible arc bulge on the right,
         * place the circle center on the left.
         *
         * To make the visible arc bulge on the left,
         * place the circle center on the right.
         */
        const centerDirection: number = cloudSide === 'left' ? -1 : 1;
        const center: PointModel = {
            x: midpoint.x + normalX * centerOffset * centerDirection,
            y: midpoint.y + normalY * centerOffset * centerDirection
        };
        const startAngle: number = Math.atan2(startPoint.y - center.y, startPoint.x - center.x);
        const endAngle: number = Math.atan2(endPoint.y - center.y, endPoint.x - center.x);
        /*
         * Calculate clockwise angular sweep and always
         * select the minor arc.
         */
        const clockwiseSweep: number = this.normalizeAngle(endAngle - startAngle);
        const anticlockwise: boolean = clockwiseSweep > Math.PI;
        return {
            start: this.copyPoint(startPoint),
            end: this.copyPoint(endPoint),
            center,
            radius: actualRadius,
            startAngle,
            endAngle,
            anticlockwise
        };
    }

    /**
     * Automatically calculate cloud size from the open
     * polygon bounds.
     * @param {PointModel} points - points
     * @param {number} suppliedRadius - suppliedRadius
     * @returns {number} - number
     */
    private getCloudRadius(points: PointModel[], suppliedRadius: number): number {
        if (Number.isFinite(suppliedRadius) && suppliedRadius > 0) {
            return suppliedRadius;
        }
        const bounds: BoundsModel = this.getOpenPathBounds(points);
        const pathLength: number = this.getOpenPathLength(points);
        /*
         * Use both the bounding size and path length.
         * This also works for nearly vertical or horizontal
         * open polygons where one bound can be close to zero.
         */
        const usableDimension: number = Math.max(1, Math.min(bounds.width > 0 ? bounds.width : Infinity,
                                                             bounds.height > 0 ? bounds.height : Infinity));
        const dimensionRadius: number = Number.isFinite(usableDimension) ? usableDimension * 0.055
            : pathLength * 0.04;
        const lengthRadius: number = pathLength * 0.025;
        return this.clamp(Math.max(dimensionRadius, lengthRadius), 4, 24);
    }

    private sanitizeOpenPoints(inputPoints: PointModel[]): PointModel[] {
        if (!Array.isArray(inputPoints)) {
            return [];
        }
        const result: PointModel[] = [];
        for (const point of inputPoints) {
            if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) {
                continue;
            }
            const previous: PointModel = result[result.length - 1];
            if (previous && this.pointDistance(previous, point) < 0.001) {
                continue;
            }
            result.push(this.copyPoint(point));
        }
        /*
         * Do not remove or add a closing point here.
         * This function represents an open path exactly
         * as supplied by the UI.
         */
        return result;
    }

    private getOpenPathBounds(points: PointModel[]): BoundsModel {
        let minimumX: number = Infinity;
        let minimumY: number = Infinity;
        let maximumX: number = -Infinity;
        let maximumY: number = -Infinity;
        for (const point of points) {
            minimumX = Math.min(minimumX, point.x);
            minimumY = Math.min(minimumY, point.y);
            maximumX = Math.max(maximumX, point.x);
            maximumY = Math.max(maximumY, point.y);
        }
        return {
            x: minimumX,
            y: minimumY,
            width: maximumX - minimumX,
            height: maximumY - minimumY
        };
    }

    private getOpenPathLength(points: PointModel[]): number {
        let totalLength: number = 0;
        /*
         * Notice points.length - 1.
         * The last point is not connected to points[0].
         */
        for (let i: number = 0; i < points.length - 1; i++) {
            totalLength += this.pointDistance(points[parseInt(i.toString(), 10)], points[i + 1]);
        }
        return totalLength;
    }

    private pointDistance(first: PointModel, second: PointModel): number {
        return Math.hypot(second.x - first.x, second.y - first.y);
    }

    private copyPoint(point: PointModel): PointModel {
        return { x: point.x, y: point.y };
    }

    /**
     * Draws an automatically scaled cloudy circle or ellipse.
     *
     * @param {CanvasRenderingContext2D} ctx - ctx
     * @param {number} x - Left position of annotation bounds
     * @param {number} y - Top position of annotation bounds
     * @param {number} width - Annotation width
     * @param {number} height - Annotation height
     * @param {number|null} cloudRadius - Optional fixed cloud radius
     * @param {string} strokeColor - strokeColor
     * @param {number} lineWidth - lineWidth
     * @returns {void} - void
     */
    private drawCloudEllipsePath(ctx: CanvasRenderingContext2D, x: number, y: number,
                                 width: number, height: number, cloudRadius: number | null,
                                 strokeColor: string = '#e04636', lineWidth: number = 1): void {
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(width) ||
            !Number.isFinite(height) || width <= 0 || height <= 0) {
            return;
        }
        const centerX: number = x + width / 2;
        const centerY: number = y + height / 2;
        const radiusX: number = width / 2;
        const radiusY: number = height / 2;
        const minimumDimension: number = Math.min(width, height);
        const autoCloudRadius: number = this.clamp(minimumDimension * 0.055, 1, 20);
        const lobeRadius: number = cloudRadius !== null && Number.isFinite(cloudRadius) &&
                                    cloudRadius > 0 ? cloudRadius : autoCloudRadius;
        const perimeter: number = this.getEllipsePerimeter(radiusX, radiusY);
        const targetChordLength: number = lobeRadius * 2;
        let lobeCount: number = Math.round(perimeter / targetChordLength);
        const maximumDimension: number = Math.max(width, height);
        const isCompactSmallShape: boolean = maximumDimension <= lobeRadius * 2;
        if (isCompactSmallShape) {
            lobeCount = 6;
        } else {
            lobeCount = this.clamp(lobeCount, 6, 100);
            if (lobeCount % 2 !== 0) {
                lobeCount++;
            }
        }
        const points: PointModel[] = this.getEqualDistanceEllipsePoints(centerX, centerY,
                                                                        radiusX, radiusY, lobeCount);
        if (points.length < 2) {
            return;
        }
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        /*
         * Start at the top of the ellipse.
         */
        ctx.moveTo(points[0].x, points[0].y);
        for (let i: number = 0; i < points.length; i++) {
            const currentPoint: PointModel = points[parseInt(i.toString(), 10)];
            const nextPoint: PointModel = points[(i + 1) % points.length];
            this.drawOutwardCloudLobe(ctx, currentPoint, nextPoint,
                                      centerX, centerY, lobeRadius);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }

    /**
     * Draws one outward cloud lobe between two points.
     * @param {CanvasRenderingContext2D} ctx - ctx
     * @param {PointModel} startPoint - startPoint
     * @param {PointModel} endPoint - endPoint
     * @param {number} shapeCenterX - shapeCenterX
     * @param {number} shapeCenterY - shapeCenterY
     * @param {number} preferredRadius - preferredRadius
     * @returns {void} - void
     */
    private drawOutwardCloudLobe(ctx: CanvasRenderingContext2D, startPoint: PointModel, endPoint: PointModel,
                                 shapeCenterX: number, shapeCenterY: number, preferredRadius: number): void {
        const dx: number = endPoint.x - startPoint.x;
        const dy: number = endPoint.y - startPoint.y;
        const chordLength: number = Math.hypot(dx, dy);
        if (!Number.isFinite(chordLength) || chordLength < 0.0001) {
            return;
        }
        const halfChord: number = chordLength / 2;
        /*
         * The arc radius must be at least half the chord length.
         * Keeping the maximum radius close to half the chord produces
         * a strong, visible cloud lobe instead of a shallow arc.
         */
        const minimumRadius: number = halfChord + 0.001;
        const maximumRadius: number = chordLength * 0.53;
        const validPreferredRadius: number = Number.isFinite(preferredRadius) && preferredRadius > 0
            ? preferredRadius : minimumRadius;
        const actualRadius: number = Math.max(minimumRadius, Math.min(validPreferredRadius, maximumRadius));
        const midpointX: number = (startPoint.x + endPoint.x) / 2;
        const midpointY: number = (startPoint.y + endPoint.y) / 2;
        /*
         * Calculate the distance between the chord midpoint
         * and each possible circle center.
         */
        const centerOffsetSquared: number = actualRadius * actualRadius - halfChord * halfChord;
        const centerOffset: number = Math.sqrt(Math.max(0, centerOffsetSquared));
        /*
         * Unit normal perpendicular to the chord.
         */
        const normalX: number = -dy / chordLength;
        const normalY: number = dx / chordLength;
        /*
         * Two possible circle centers can pass through the
         * start and end points.
         */
        const candidate1: PointModel = {
            x: midpointX + normalX * centerOffset,
            y: midpointY + normalY * centerOffset
        };
        const candidate2: PointModel = {
            x: midpointX - normalX * centerOffset,
            y: midpointY - normalY * centerOffset
        };
        const candidate1Distance: number = Math.hypot(candidate1.x - shapeCenterX, candidate1.y - shapeCenterY);
        const candidate2Distance: number = Math.hypot(candidate2.x - shapeCenterX, candidate2.y - shapeCenterY);
        /*
         * The circle center closer to the ellipse center normally
         * produces an outward-facing cloud lobe.
         */
        const arcCenter: PointModel = candidate1Distance <= candidate2Distance ? candidate1 : candidate2;
        const startAngle: number = Math.atan2(startPoint.y - arcCenter.y, startPoint.x - arcCenter.x);
        const endAngle: number = Math.atan2(endPoint.y - arcCenter.y, endPoint.x - arcCenter.x);
        const twoPi: number = Math.PI * 2;
        /*
         * Normalize the clockwise sweep to the range 0 to 2π.
         */
        let clockwiseSweep: number = (endAngle - startAngle) % twoPi;
        if (clockwiseSweep < 0) {
            clockwiseSweep += twoPi;
        }
        const counterClockwiseSweep: number = twoPi - clockwiseSweep;
        /*
         * Determine the midpoint of both possible arcs.
         */
        const clockwiseMiddleAngle: number = startAngle + clockwiseSweep / 2;
        const counterClockwiseMiddleAngle: number = startAngle - counterClockwiseSweep / 2;
        const clockwiseMiddlePoint: PointModel = {
            x: arcCenter.x + actualRadius * Math.cos(clockwiseMiddleAngle),
            y: arcCenter.y + actualRadius * Math.sin(clockwiseMiddleAngle)
        };
        const counterClockwiseMiddlePoint: PointModel = {
            x: arcCenter.x + actualRadius * Math.cos(counterClockwiseMiddleAngle),
            y: arcCenter.y + actualRadius * Math.sin(counterClockwiseMiddleAngle)
        };
        const clockwiseDistance: number = Math.hypot(clockwiseMiddlePoint.x - shapeCenterX,
                                                     clockwiseMiddlePoint.y - shapeCenterY);
        const counterClockwiseDistance: number = Math.hypot(counterClockwiseMiddlePoint.x - shapeCenterX,
                                                            counterClockwiseMiddlePoint.y - shapeCenterY);
        /*
         * Select the arc whose midpoint is farther from the
         * ellipse center.
         */
        const anticlockwise: boolean = counterClockwiseDistance > clockwiseDistance;
        ctx.arc(arcCenter.x, arcCenter.y, actualRadius, startAngle, endAngle, anticlockwise);
    }

    /**
     * Returns approximately equal-distance points around
     * an ellipse, beginning at the top.
     * @param {number} centerX - centerX
     * @param {number} centerY - centerY
     * @param {number} radiusX - radiusX
     * @param {number} radiusY - radiusY
     * @param {number} pointCount - pointCount
     * @returns {PointModel[]} - PointModel[]
     */
    private getEqualDistanceEllipsePoints(centerX: number, centerY: number, radiusX: number,
                                          radiusY: number, pointCount: number): PointModel[] {
        /*
         * A lookup table is necessary because equal angle
         * changes do not produce equal distances on an ellipse.
         */
        const sampleCount: number = Math.max(1000, pointCount * 50);
        const lookup: DistancePointModel[] = [];
        let previousX: number = centerX;
        let previousY: number = centerY - radiusY;
        let totalDistance: number = 0;
        lookup.push({
            x: previousX,
            y: previousY,
            distance: 0
        });
        /*
         * Begin at -PI / 2, which is the top of the ellipse.
         * Increasing angles move clockwise in Canvas.
         */
        for (let i: number = 1; i <= sampleCount; i++) {
            const angle: number = -Math.PI / 2 + (i / sampleCount) * Math.PI * 2;
            const currentX: number = centerX + radiusX * Math.cos(angle);
            const currentY: number = centerY + radiusY * Math.sin(angle);
            totalDistance += Math.hypot(currentX - previousX, currentY - previousY);
            lookup.push({
                x: currentX,
                y: currentY,
                distance: totalDistance
            });
            previousX = currentX;
            previousY = currentY;
        }
        const distanceStep: number = totalDistance / pointCount;
        const result: PointModel[] = [];
        let lookupIndex: number = 0;
        for (let i: number = 0; i < pointCount; i++) {
            const targetDistance: number = i * distanceStep;
            while (lookupIndex < lookup.length - 2 && lookup[lookupIndex + 1].distance < targetDistance) {
                lookupIndex++;
            }
            const first: DistancePointModel = lookup[parseInt(lookupIndex.toString(), 10)];
            const second: DistancePointModel = lookup[lookupIndex + 1];
            const segmentDistance: number = second.distance - first.distance;
            const ratio: number = segmentDistance === 0 ? 0 : (targetDistance - first.distance) / segmentDistance;
            result.push({
                x: first.x + (second.x - first.x) * ratio,
                y: first.y + (second.y - first.y) * ratio
            });
        }
        return result;
    }

    /**
     * Approximate ellipse perimeter using
     * Ramanujan's second approximation.
     * @param {number} radiusX - radiusX
     * @param {number} radiusY - radiusY
     * @returns {number} - number
     */
    private getEllipsePerimeter(radiusX: number, radiusY: number): number {
        if (!Number.isFinite(radiusX) || !Number.isFinite(radiusY) || radiusX <= 0 || radiusY <= 0) {
            return 0;
        }
        const radiusSum: number = radiusX + radiusY;
        if (radiusSum <= 0) {
            return 0;
        }
        const radiusDifference: number = radiusX - radiusY;
        const height: number = (radiusDifference * radiusDifference) / (radiusSum * radiusSum);
        const denominator: number = 10 + Math.sqrt(Math.max(0, 4 - 3 * height));
        return Math.PI * radiusSum * (1 + (3 * height) / denominator);
    }

    private normalizeAngle(angle: number): number {
        const fullCircle: number = Math.PI * 2;
        angle %= fullCircle;
        if (angle < 0) {
            angle += fullCircle;
        }
        return angle;
    }

    private clamp(value: number, minimum: number, maximum: number): number {
        return Math.max(minimum, Math.min(maximum, value));
    }

    private getPathBounds(collection: Object[]): { minX: number; minY: number; maxX: number; maxY: number } {
        let minX: number = Number.POSITIVE_INFINITY;
        let minY: number = Number.POSITIVE_INFINITY;
        let maxX: number = Number.NEGATIVE_INFINITY;
        let maxY: number = Number.NEGATIVE_INFINITY;
        for (const item of collection) {
            const seg: PathSegment = item as PathSegment;
            if (seg.x !== undefined) {
                minX = Math.min(minX, seg.x);
                maxX = Math.max(maxX, seg.x);
            }
            if (seg.y !== undefined) {
                minY = Math.min(minY, seg.y);
                maxY = Math.max(maxY, seg.y);
            }
            if (seg.x1 !== undefined) {
                minX = Math.min(minX, seg.x1);
                maxX = Math.max(maxX, seg.x1);
            }
            if (seg.y1 !== undefined) {
                minY = Math.min(minY, seg.y1);
                maxY = Math.max(maxY, seg.y1);
            }
            if (seg.x2 !== undefined) {
                minX = Math.min(minX, seg.x2);
                maxX = Math.max(maxX, seg.x2);
            }
            if (seg.y2 !== undefined) {
                minY = Math.min(minY, seg.y2);
                maxY = Math.max(maxY, seg.y2);
            }
            if (seg.cx !== undefined) {
                minX = Math.min(minX, seg.cx);
                maxX = Math.max(maxX, seg.cx);
            }
            if (seg.cy !== undefined) {
                minY = Math.min(minY, seg.cy);
                maxY = Math.max(maxY, seg.cy);
            }
        }
        if (!isFinite(minX) || !isFinite(minY) || !isFinite(maxX) || !isFinite(maxY)) {
            return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
        }
        return { minX, minY, maxX, maxY };
    }

    private getPathPoints(collection: Object[], annotationType?: string): PointModel[] {
        const points: PointModel[] = [];
        for (const item of collection) {
            const seg: PathSegment = item as PathSegment;
            if (seg.command === 'M' || seg.command === 'L') {
                if (seg.x !== undefined && seg.y !== undefined) {
                    points.push({ x: seg.x, y: seg.y });
                }
            }
            else if (seg.command === 'Z' || seg.command === 'z') {
                if (points.length > 0) {
                    points.push({ x: points[0].x, y: points[0].y });
                }
            }
        }
        if (points.length > 0) {
            const first: PointModel = points[0];
            const last: PointModel = points[points.length - 1];
            if ((first.x !== last.x || first.y !== last.y) && annotationType !== 'Line') {
                points.push({ x: first.x, y: first.y });
            }
        }
        return points;
    }

    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @param {TextAttributes} options - options
     * @param {boolean} isFreeTextAnnotation - isFreeTextAnnotation
     * @param {number} rectHeight - rectHeight
     * @private
     * @returns {void} - void
     */
    public drawTextFreetextEJ2(canvas: HTMLCanvasElement, options: TextAttributes, isFreeTextAnnotation: boolean,
                               rectHeight: number): void {
        if (options.content && options.visible === true) {
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options as StyleAttributes);
            this.setFontStyle(canvas, options);
            let ascent: number = 0;
            let lineHeight: number = 0;
            if (options.thickness !== undefined) {
                // Used this to get the exact text height for Freetext annotation according to the font size and font family.
                const metrics: TextMetrics = ctx.measureText(options.content);
                ascent = metrics.actualBoundingBoxAscent as number;
                if (ascent == null) {
                    ascent = options.fontSize * 0.8;
                }
                let descent: number = metrics.actualBoundingBoxDescent;
                if (descent == null) {
                    descent = options.fontSize * 0.2;
                }
                lineHeight = (ascent + descent);
                options.height = lineHeight * options.childNodes.length;
            }
            const pivotX: number = options.x + options.width * options.pivotX;
            const pivotY: number = options.y + options.height * options.pivotY;
            this.rotateContext(canvas, options.angle, pivotX, pivotY);

            let i: number = 0;
            let childNodes: SubTextElement[] = [];
            childNodes = options.childNodes;
            const wrapBounds: TextBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                const position: PointModel = this.labelAlign(options, wrapBounds, childNodes, lineHeight);
                let padding: number = 0;
                let paddingY: number = 0;
                const heightDiff: number = rectHeight - (options.height + options.strokeWidth * 2);
                const stroke: number = Math.ceil(options.strokeWidth || 0);
                if (isFreeTextAnnotation && heightDiff >= 3.5) {
                    if (options.strokeWidth <= 4 && options.childNodes.length <= 1) {
                        padding = stroke * 1.5 * 1.65;
                        paddingY = stroke * 1.5 * 3;
                    } else {
                        padding = stroke * 1.5 * 1.65;
                        if (options.strokeWidth <= 3) {
                            paddingY = stroke * 1.5 * 2;
                        } else {
                            paddingY = stroke * 1.5 * 1.5;
                        }
                    }
                } else if (isFreeTextAnnotation) {
                    if (options.strokeWidth <= 4 && options.childNodes.length <= 1) {
                        padding = stroke * 1.5;
                        paddingY = stroke * 1.5;
                    } else {
                        padding = stroke;
                        paddingY = stroke / 2;
                    }
                } else {
                    padding = options.strokeWidth / 2;
                    paddingY = options.strokeWidth / 2;
                }
                for (i = 0; i < childNodes.length; i++) {
                    const child: SubTextElement = childNodes[parseInt(i.toString(), 10)];
                    let offsetX: number;
                    let offsetY: number;
                    let isTextDecorationApplied: boolean = false;
                    if (options.textAlign === 'justify') {
                        if (child.text === '\n') {
                            continue;
                        }
                        const baseSpaceWidth: number = ctx.measureText(' ').width;
                        const targetWidth: number = this.rectWidth - (Math.ceil(options.strokeWidth) * 3 * 1.5);
                        offsetX = position.x + child.x - wrapBounds.x + padding;
                        offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + paddingY;
                        const isLastLine: boolean = i === childNodes.length - 1;
                        if (!isLastLine && targetWidth > 0) {
                            const leftEdge: number = position.x + child.x - wrapBounds.x + padding;
                            const words: string[] = child.text.trim().split(/\s+/);
                            if (words.length <= 1) {
                                ctx.fillText(child.text, leftEdge, offsetY);
                                continue;
                            }
                            const widths: number[] = words.map((w: any) => ctx.measureText(w).width);
                            const wordsTotal: any = widths.reduce((a: any, b: any) => a + b, 0);
                            const gaps: number = words.length - 1;
                            const naturalWidth: any = wordsTotal + baseSpaceWidth * gaps;
                            const extra: number = Math.max(0, targetWidth - naturalWidth);
                            const extraPerGap: number = extra / gaps;
                            let pen: number = leftEdge;
                            for (let i: number = 0; i < words.length; i++) {
                                ctx.fillText(words[i as number], pen, offsetY);
                                if (i < gaps) {
                                    pen += widths[i as number] + baseSpaceWidth + extraPerGap;
                                }
                            }
                            if (options.textDecoration === 'Underline'
                                || options.textDecoration === 'Overline'
                                || options.textDecoration === 'LineThrough') {
                                const startX: number = leftEdge;
                                let startY: number;
                                const endX: number = leftEdge + targetWidth;
                                let endY: number;
                                switch (options.textDecoration) {
                                case 'Underline':
                                    startY = offsetY + 2;
                                    endY = offsetY + 2;
                                    break;
                                case 'Overline':
                                    startY = (position.y + child.dy * i);
                                    endY = (position.y + child.dy * i);
                                    break;
                                case 'LineThrough':
                                    startY = ((offsetY + position.y + child.dy * i) / 2) + 2;
                                    endY = ((offsetY + position.y + child.dy * i) / 2) + 2;
                                }
                                ctx.beginPath();
                                ctx.moveTo(startX, startY);
                                ctx.lineTo(endX, endY);
                                ctx.strokeStyle = options.color;
                                ctx.lineWidth = options.fontSize * .08;
                                ctx.globalAlpha = options.opacity;
                                ctx.stroke();
                                isTextDecorationApplied = true;
                            }
                        } else {
                            ctx.fillText(child.text, offsetX, offsetY);
                        }
                    }
                    else if (child.text !== '\n') {
                        if (options.textAlign === 'right') {
                            offsetX = position.x + child.x - wrapBounds.x - padding;
                        }
                        else if (options.textAlign === 'center') {
                            offsetX = position.x + child.x - wrapBounds.x;
                        }
                        else {
                            offsetX = position.x + child.x - wrapBounds.x + padding;
                        }
                        if (options.relativeMode === 'Point') {
                            if (isFreeTextAnnotation && options.childNodes.length <= 1 && options.strokeWidth >= 5 && heightDiff <= 3.5) {
                                offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) - paddingY;
                            } else {
                                offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + paddingY;
                            }
                            if (options.strokeWidth === 0) {
                                offsetY += 1;
                            }
                        }
                        else {
                            offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8);
                        }
                        ctx.fillText(child.text, offsetX, offsetY);
                        // if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap') {
                        //     child.text = overFlow(child.text, options);
                        // }
                        //ctx.fillText(child.text, offsetX, offsetY);
                    }
                    if (child.text !== '\n') {
                        let decorations: any = [];
                        if (Array.isArray(options.textDecoration)) {
                            decorations = options.textDecoration;
                        } else if (options.textDecoration.includes(' ')) {
                            decorations = options.textDecoration.split(/[,\s]+/).filter(Boolean);
                        }
                        else {
                            decorations = [options.textDecoration];
                        }
                        for (let x: number = 0; x < decorations.length; x++) {
                            const textDecoration: any = decorations[x as number];
                            if (textDecoration === 'Underline'
                                || textDecoration === 'Overline'
                                || textDecoration === 'LineThrough' && !isTextDecorationApplied) {
                                const startPointX: number = offsetX;
                                let startPointY: number;
                                const textlength: number = ctx.measureText(child.text).width;
                                const endPointX: number = offsetX + textlength;
                                let endPointY: number;
                                switch (textDecoration) {
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
                }
            }
            ctx.restore();
        }
    }

    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @param {TextAttributes} options - options
     * @param {boolean} isStampAnnotation - isStampAnnotation
     * @private
     * @returns {void} - void
     */
    public drawTextEJ2(canvas: HTMLCanvasElement, options: TextAttributes, isStampAnnotation?: boolean): void {
        if (options.content && options.visible === true) {
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options as StyleAttributes);
            this.setFontStyle(canvas, options);
            let ascent: number = 0;
            let lineHeight: number = 0;
            if (options.thickness !== undefined) {
                // Used this to get the exact text height for Freetext annotation according to the font size and font family.
                const metrics: TextMetrics = ctx.measureText(options.content);
                ascent = metrics.actualBoundingBoxAscent as number;
                if (ascent == null) {
                    ascent = options.fontSize * 0.8;
                }
                let descent: number = metrics.actualBoundingBoxDescent;
                if (descent == null) {
                    descent = options.fontSize * 0.2;
                }
                lineHeight = (ascent + descent);
                options.height = lineHeight * options.childNodes.length;
            }
            const pivotX: number = options.x + options.width * options.pivotX;
            const pivotY: number = options.y + options.height * options.pivotY;
            this.rotateContext(canvas, options.angle, pivotX, pivotY);
            let i: number = 0;
            let childNodes: SubTextElement[] = [];
            childNodes = options.childNodes;
            const wrapBounds: TextBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                const position: PointModel = this.labelAlign(options, wrapBounds, childNodes, lineHeight);
                let paddingAdjustment: number;
                if (isStampAnnotation) {
                    paddingAdjustment = options.thickness !== undefined ? (options.thickness * (96 / 72)) * 2 : 0;
                }
                for (i = 0; i < childNodes.length; i++) {
                    const child: SubTextElement = childNodes[parseInt(i.toString(), 10)];
                    let offsetX: number;
                    let offsetY: number;
                    let isTextDecorationApplied: boolean = false;
                    if (options.textAlign === 'justify') {
                        if (child.text === '\n') {
                            continue;
                        }
                        const baseSpaceWidth: number = ctx.measureText(' ').width;
                        const targetWidth: number = wrapBounds.width;
                        offsetX = position.x + child.x - wrapBounds.x + options.strokeWidth / 2;
                        offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + options.strokeWidth / 2;
                        const isLastLine: boolean = i === childNodes.length - 1;
                        if (!isLastLine && targetWidth > 0) {
                            const leftEdge: number = position.x + child.x + options.strokeWidth / 2;
                            const words: string[] = child.text.trim().split(/\s+/);
                            if (words.length <= 1) {
                                ctx.fillText(child.text, leftEdge, offsetY);
                                continue;
                            }
                            const widths: number[] = words.map((w: any) => ctx.measureText(w).width);
                            const wordsTotal: any = widths.reduce((a: any, b: any) => a + b, 0);
                            const gaps: number = words.length - 1;
                            const naturalWidth: any = wordsTotal + baseSpaceWidth * gaps;
                            const extra: number = Math.max(0, targetWidth - naturalWidth);
                            const extraPerGap: number = extra / gaps;
                            let pen: number = leftEdge;
                            for (let i: number = 0; i < words.length; i++) {
                                ctx.fillText(words[i as number], pen, offsetY);
                                if (i < gaps) {
                                    pen += widths[i as number] + baseSpaceWidth + extraPerGap;
                                }
                            }
                            if (options.textDecoration === 'Underline'
                                || options.textDecoration === 'Overline'
                                || options.textDecoration === 'LineThrough') {
                                const startX: number = leftEdge;
                                let startY: number;
                                const endX: number = leftEdge + targetWidth;
                                let endY: number;
                                switch (options.textDecoration) {
                                case 'Underline':
                                    startY = offsetY + 2;
                                    endY = offsetY + 2;
                                    break;
                                case 'Overline':
                                    startY = (position.y + child.dy * i);
                                    endY = (position.y + child.dy * i);
                                    break;
                                case 'LineThrough':
                                    startY = ((offsetY + position.y + child.dy * i) / 2) + 2;
                                    endY = ((offsetY + position.y + child.dy * i) / 2) + 2;
                                }
                                ctx.beginPath();
                                ctx.moveTo(startX, startY);
                                ctx.lineTo(endX, endY);
                                ctx.strokeStyle = options.color;
                                ctx.lineWidth = options.fontSize * .08;
                                ctx.globalAlpha = options.opacity;
                                ctx.stroke();
                                isTextDecorationApplied = true;
                            }
                        } else {
                            ctx.fillText(child.text, offsetX, offsetY);
                        }
                    }
                    else if (child.text !== '\n') {
                        if (options.textAlign === 'right') {
                            offsetX = position.x + child.x - wrapBounds.x - options.strokeWidth / 2;
                        } else if (options.textAlign === 'center') {
                            offsetX = position.x + child.x - wrapBounds.x;
                        } else {
                            if (isStampAnnotation) {
                                offsetX = position.x + child.x - wrapBounds.x + paddingAdjustment;
                            }
                            else {
                                offsetX = position.x + child.x - wrapBounds.x + options.strokeWidth / 2;
                            }
                        }
                        if (options.relativeMode === 'Point') {
                            if (isStampAnnotation) {
                                offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + paddingAdjustment;
                            }
                            else {
                                offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + options.strokeWidth / 2;
                            }
                        } else {
                            offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8);
                        }
                        ctx.fillText(child.text, offsetX, offsetY);
                        // if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap') {
                        //     child.text = overFlow(child.text, options);
                        // }
                        //ctx.fillText(child.text, offsetX, offsetY);
                    }
                    if (child.text !== '\n') {
                        if (options.textDecoration === 'Underline'
                            || options.textDecoration === 'Overline'
                            || options.textDecoration === 'LineThrough' && !isTextDecorationApplied) {
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
            }
            ctx.restore();
        }
    }

    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @param {TextAttributes} options - options
     * @param {number} maxHeight - maxHeight
     * @param {boolean} isFreeTextAnnotation - isFreeTextAnnotation
     * @param {number} zoomFactor - zoomFactor
     * @private
     * @returns {void} - void
     */
    public drawFreeTextBlazor(canvas: HTMLCanvasElement, options: TextAttributes, maxHeight: number,
                              isFreeTextAnnotation: boolean, zoomFactor: number): void {
        if (options.content && options.visible === true) {
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options as StyleAttributes);

            this.setFontStyle(canvas, options);
            let ascent: number = 0;
            let lineHeight: number = 0;
            if (options.thickness !== undefined) {
                // Used this to get the exact text height for Freetext annotation according to the font size and font family.
                const metrics: TextMetrics = ctx.measureText(options.content);
                ascent = metrics.actualBoundingBoxAscent as number;
                if (ascent == null) {
                    ascent = options.fontSize * 0.8;
                }
                let descent: number = metrics.actualBoundingBoxDescent;
                if (descent == null) {
                    descent = options.fontSize * 0.2;
                }
                lineHeight = (ascent + descent);
                options.height = lineHeight * options.childNodes.length;
            }
            const pivotX: number = options.x + options.width * options.pivotX;
            const pivotY: number = options.y + options.height * options.pivotY;
            this.rotateContext(canvas, options.angle, pivotX, pivotY);
            let i: number = 0;
            let childNodes: SubTextElement[] = [];
            childNodes = options.childNodes;
            const wrapBounds: TextBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                const position: PointModel = this.labelAlign(options, wrapBounds, childNodes, lineHeight);
                const paddingAdjustmentX: number = options.thickness !== undefined &&
                    options.thickness === 0 ? Math.floor(options.thickness * (96 / 72)) + 2 :
                    Math.floor(options.thickness * (96 / 72)) * 1 + 2;
                const paddingAdjustmentY: number = options.thickness !== undefined &&
                    options.thickness === 0 ? Math.floor(options.thickness * (96 / 72)) + 5 :
                    Math.floor(options.thickness * (96 / 72)) * 1 + 4;
                let totalTextHeightCanvas: number = 0;
                for (let j: number = 0; j < childNodes.length; j++) {
                    const child: SubTextElement = childNodes[j as number];
                    totalTextHeightCanvas += (child.dy ? child.dy : (lineHeight || options.fontSize * 1.2));
                }
                const isApplyClip: boolean = isFreeTextAnnotation && maxHeight > 0 &&
                    Math.ceil(totalTextHeightCanvas + paddingAdjustmentY + 4) > maxHeight;
                let clipLeft: number;
                let clipTop: number;
                let clipWidth: number;
                let clipHeight: number;
                let clipActive: boolean = false;
                if (isApplyClip) {
                    if (options.textAlign === 'right') {
                        clipLeft = position.x - paddingAdjustmentX;
                    } else if (options.textAlign === 'center') {
                        clipLeft = position.x;
                    } else {
                        clipLeft = position.x + paddingAdjustmentX;
                    }
                    clipTop = position.y - ascent - paddingAdjustmentX;
                    clipWidth = Math.max(0, options.freeTextSelectorWidth + paddingAdjustmentX);
                    clipHeight = maxHeight + ascent;
                }
                if (isApplyClip) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(clipLeft, clipTop, clipWidth, clipHeight);
                    ctx.clip();
                    clipActive = true;
                }
                let textHeight: number = 0;
                for (i = 0; i < childNodes.length; i++) {
                    const child: SubTextElement = childNodes[parseInt(i.toString(), 10)];
                    let offsetX: number;
                    let offsetY: number;
                    let isTextDecorationApplied: boolean = false;
                    if (options.textAlign === 'justify') {
                        if (child.text === '\n') {
                            continue;
                        }
                        const baseSpaceWidth: number = ctx.measureText(' ').width;
                        const targetWidth: number = wrapBounds.width;
                        offsetX = position.x + child.x - wrapBounds.x + paddingAdjustmentX;
                        offsetY = position.y + child.dy * i + ascent + paddingAdjustmentY;
                        const isLastLine: boolean = i === childNodes.length - 1;
                        if (!isLastLine && targetWidth > 0) {
                            const leftEdge: number = position.x + child.x + paddingAdjustmentX;
                            const words: string[] = child.text.trim().split(/\s+/);
                            if (words.length <= 1) {
                                ctx.fillText(child.text, leftEdge, offsetY);
                                continue;
                            }
                            const widths: number[] = words.map((w: any) => ctx.measureText(w).width);
                            const wordsTotal: any = widths.reduce((a: any, b: any) => a + b, 0);
                            const gaps: number = words.length - 1;
                            const naturalWidth: any = wordsTotal + baseSpaceWidth * gaps + paddingAdjustmentX * 2;
                            const extra: number = Math.max(0, targetWidth - naturalWidth);
                            const extraPerGap: number = extra / gaps;
                            let pen: number = leftEdge;
                            for (let i: number = 0; i < words.length; i++) {
                                ctx.fillText(words[i as number], pen, offsetY);
                                if (i < gaps) {
                                    pen += widths[i as number] + baseSpaceWidth + extraPerGap;
                                }
                            }
                            if (options.textDecoration === 'Underline'
                                || options.textDecoration === 'Overline'
                                || options.textDecoration === 'LineThrough' || options.textDecoration === 'Underline LineThrough') {
                                const startX: number = leftEdge;
                                let startY: number;
                                const endX: number = leftEdge + targetWidth - paddingAdjustmentX * 2;
                                let endY: number;
                                switch (options.textDecoration) {
                                case 'Underline':
                                    startY = offsetY + 2;
                                    endY = offsetY + 2;
                                    this.drawLine(ctx, startX, startY, endX, endY, options);
                                    break;
                                case 'Overline':
                                    startY = (position.y + child.dy * i);
                                    endY = (position.y + child.dy * i);
                                    this.drawLine(ctx, startX, startY, endX, endY, options);
                                    break;
                                case 'LineThrough':
                                    startY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustmentY / 2);
                                    endY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustmentY / 2);
                                    this.drawLine(ctx, startX, startY, endX, endY, options);
                                    break;
                                case 'Underline LineThrough':
                                {
                                    this.drawLine(ctx, startX, offsetY + 2, endX, offsetY + 2, options);
                                    const midY: number = (offsetY + position.y + child.dy * i) / 2 + 2 + paddingAdjustmentY / 2;
                                    this.drawLine(ctx, startX, midY, endX, midY, options);
                                    break;
                                }
                                }
                                isTextDecorationApplied = true;
                            }
                        } else {
                            ctx.fillText(child.text, offsetX, offsetY);
                        }
                    }
                    else if (child.text !== '\n') {
                        if (options.textAlign === 'right') {
                            offsetX = position.x + child.x - wrapBounds.x - paddingAdjustmentX;
                        } else if (options.textAlign === 'center') {
                            offsetX = position.x + child.x - wrapBounds.x;
                        } else {
                            offsetX = position.x + child.x - wrapBounds.x + paddingAdjustmentX;
                        }
                        if (options.relativeMode === 'Point') {
                            offsetY = position.y + child.dy * i + ascent + paddingAdjustmentY;
                        } else {
                            offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8);
                        }
                        const tabSize: number = 7;
                        const textWithTabs: string = child.text.replace(/\t/g, ' '.repeat(tabSize));
                        textHeight += child.dy;
                        if (isFreeTextAnnotation || (maxHeight === 0 ||
                            (textHeight * zoomFactor < maxHeight * zoomFactor && isFreeTextAnnotation))) {
                            ctx.fillText(textWithTabs, offsetX, offsetY);
                        }

                        // if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap') {
                        //     child.text = overFlow(child.text, options);
                        // }
                        //ctx.fillText(child.text, offsetX, offsetY);
                    }
                    else if (isFreeTextAnnotation) {
                        textHeight += child.dy;
                    }
                    if (child.text !== '\n') {
                        if (options.textDecoration === 'Underline'
                            || options.textDecoration === 'Overline'
                            || options.textDecoration === 'LineThrough'
                            || options.textDecoration === 'Underline LineThrough' && !isTextDecorationApplied) {
                            const startPointX: number = offsetX;
                            let startPointY: number;
                            const textlength: number = ctx.measureText(child.text).width;
                            const endPointX: number = offsetX + textlength;
                            let endPointY: number;
                            switch (options.textDecoration) {
                            case 'Underline':
                                startPointY = offsetY + 2;
                                endPointY = offsetY + 2;
                                this.drawLine(ctx, startPointX, startPointY, endPointX, endPointY, options);
                                break;
                            case 'Overline':
                                startPointY = (position.y + child.dy * i);
                                endPointY = (position.y + child.dy * i);
                                this.drawLine(ctx, startPointX, startPointY, endPointX, endPointY, options);
                                break;
                            case 'LineThrough':
                                startPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustmentY / 2);
                                endPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustmentY / 2);
                                this.drawLine(ctx, startPointX, startPointY, endPointX, endPointY, options);
                                break;
                            case 'Underline LineThrough':
                            {
                                this.drawLine(ctx, startPointX, offsetY + 2, endPointX, offsetY + 2, options);
                                const midY: number = (offsetY + position.y + child.dy * i) / 2 + 2 + paddingAdjustmentY / 2;
                                this.drawLine(ctx, startPointX, midY, endPointX, midY, options);
                                break;
                            }
                            }
                        }
                    }
                }
                if (clipActive) {
                    ctx.restore();
                }
            }
            ctx.restore();
        }
    }

    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @param {TextAttributes} options - options
     * @param {number} maxHeight - maxHeight
     * @param {boolean} isFreeTextAnnotation - isFreeTextAnnotation
     * @param {number} zoomFactor - zoomFactor
     * @private
     * @returns {void} - void
     */
    public drawText(canvas: HTMLCanvasElement, options: TextAttributes, maxHeight: number,
                    isFreeTextAnnotation: boolean, zoomFactor: number): void {
        if (options.content && options.visible === true) {
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options as StyleAttributes);

            this.setFontStyle(canvas, options);
            let ascent: number = 0;
            let lineHeight: number = 0;
            if (options.thickness !== undefined) {
                // Used this to get the exact text height for Freetext annotation according to the font size and font family.
                const metrics: TextMetrics = ctx.measureText(options.content);
                ascent = metrics.actualBoundingBoxAscent as number;
                if (ascent == null) {
                    ascent = options.fontSize * 0.8;
                }
                let descent: number = metrics.actualBoundingBoxDescent;
                if (descent == null) {
                    descent = options.fontSize * 0.2;
                }
                lineHeight = (ascent + descent);
                options.height = lineHeight * options.childNodes.length;
            }

            const pivotX: number = options.x + options.width * options.pivotX;
            const pivotY: number = options.y + options.height * options.pivotY;
            this.rotateContext(canvas, options.angle, pivotX, pivotY);
            let i: number = 0;
            let childNodes: SubTextElement[] = [];
            childNodes = options.childNodes;
            const wrapBounds: TextBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                const position: PointModel = this.labelAlign(options, wrapBounds, childNodes, lineHeight);
                const paddingAdjustment: number = options.thickness !== undefined ? (options.thickness * (96 / 72)) * 2 : 0;
                let textHeight: number = 0;
                for (i = 0; i < childNodes.length; i++) {
                    const child: SubTextElement = childNodes[parseInt(i.toString(), 10)];
                    let offsetX: number;
                    let offsetY: number;
                    let isTextDecorationApplied: boolean = false;
                    if (options.textAlign === 'justify') {
                        if (child.text === '\n') {
                            continue;
                        }
                        const baseSpaceWidth: number = ctx.measureText(' ').width;
                        const targetWidth: number = wrapBounds.width;
                        offsetX = position.x + child.x - wrapBounds.x + paddingAdjustment;
                        offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + paddingAdjustment;
                        const isLastLine: boolean = i === childNodes.length - 1;
                        if (!isLastLine && targetWidth > 0) {
                            const leftEdge: number = position.x + child.x + paddingAdjustment;
                            const words: string[] = child.text.trim().split(/\s+/);
                            if (words.length <= 1) {
                                ctx.fillText(child.text, leftEdge, offsetY);
                                continue;
                            }
                            const widths: number[] = words.map((w: any) => ctx.measureText(w).width);
                            const wordsTotal: any = widths.reduce((a: any, b: any) => a + b, 0);
                            const gaps: number = words.length - 1;
                            const naturalWidth: any = wordsTotal + baseSpaceWidth * gaps + paddingAdjustment * 2;
                            const extra: number = Math.max(0, targetWidth - naturalWidth);
                            const extraPerGap: number = extra / gaps;
                            let pen: number = leftEdge;
                            for (let i: number = 0; i < words.length; i++) {
                                ctx.fillText(words[i as number], pen, offsetY);
                                if (i < gaps) {
                                    pen += widths[i as number] + baseSpaceWidth + extraPerGap;
                                }
                            }
                            if (options.textDecoration === 'Underline'
                                || options.textDecoration === 'Overline'
                                || options.textDecoration === 'LineThrough' || options.textDecoration === 'Underline LineThrough') {
                                const startX: number = leftEdge;
                                let startY: number;
                                const endX: number = leftEdge + targetWidth - paddingAdjustment * 2;
                                let endY: number;
                                switch (options.textDecoration) {
                                case 'Underline':
                                    startY = offsetY + 2;
                                    endY = offsetY + 2;
                                    this.drawLine(ctx, startX, startY, endX, endY, options);
                                    break;
                                case 'Overline':
                                    startY = (position.y + child.dy * i);
                                    endY = (position.y + child.dy * i);
                                    this.drawLine(ctx, startX, startY, endX, endY, options);
                                    break;
                                case 'LineThrough':
                                    startY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                    endY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                    this.drawLine(ctx, startX, startY, endX, endY, options);
                                    break;
                                case 'Underline LineThrough':
                                {
                                    this.drawLine(ctx, startX, offsetY + 2, endX, offsetY + 2, options);
                                    const midY: number = (offsetY + position.y + child.dy * i) / 2 + 2 + paddingAdjustment / 2;
                                    this.drawLine(ctx, startX, midY, endX, midY, options);
                                    break;
                                }
                                }
                                isTextDecorationApplied = true;
                            }
                        } else {
                            ctx.fillText(child.text, offsetX, offsetY);
                        }
                    }
                    else if (child.text !== '\n') {
                        if (options.textAlign === 'right') {
                            offsetX = position.x + child.x - wrapBounds.x - paddingAdjustment;
                        } else if (options.textAlign === 'center') {
                            offsetX = position.x + child.x - wrapBounds.x + (paddingAdjustment / 2);
                        } else {
                            offsetX = position.x + child.x - wrapBounds.x + paddingAdjustment;
                        }
                        if (options.relativeMode === 'Point') {
                            offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + paddingAdjustment;
                        } else {
                            offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8);
                        }
                        const tabSize: number = 7;
                        const textWithTabs: string = child.text.replace(/\t/g, ' '.repeat(tabSize));
                        textHeight += child.dy;
                        if (!isFreeTextAnnotation || (maxHeight === 0 || (textHeight * zoomFactor < maxHeight && isFreeTextAnnotation))) {
                            ctx.fillText(textWithTabs, offsetX, offsetY);
                        }

                        // if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap') {
                        //     child.text = overFlow(child.text, options);
                        // }
                        //ctx.fillText(child.text, offsetX, offsetY);
                    }
                    else if (isFreeTextAnnotation) {
                        textHeight += child.dy;
                    }
                    if (child.text !== '\n') {
                        if (options.textDecoration === 'Underline'
                            || options.textDecoration === 'Overline'
                            || options.textDecoration === 'LineThrough'
                            || options.textDecoration === 'Underline LineThrough' && !isTextDecorationApplied) {
                            const startPointX: number = offsetX;
                            let startPointY: number;
                            const textlength: number = ctx.measureText(child.text).width;
                            const endPointX: number = offsetX + textlength;
                            let endPointY: number;
                            switch (options.textDecoration) {
                            case 'Underline':
                                startPointY = offsetY + 2;
                                endPointY = offsetY + 2;
                                this.drawLine(ctx, startPointX, startPointY, endPointX, endPointY, options);
                                break;
                            case 'Overline':
                                startPointY = (position.y + child.dy * i);
                                endPointY = (position.y + child.dy * i);
                                this.drawLine(ctx, startPointX, startPointY, endPointX, endPointY, options);
                                break;
                            case 'LineThrough':
                                startPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                endPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                this.drawLine(ctx, startPointX, startPointY, endPointX, endPointY, options);
                                break;
                            case 'Underline LineThrough':
                            {
                                this.drawLine(ctx, startPointX, offsetY + 2, endPointX, offsetY + 2, options);
                                const midY: number = (offsetY + position.y + child.dy * i) / 2 + 2 + paddingAdjustment / 2;
                                this.drawLine(ctx, startPointX, midY, endPointX, midY, options);
                                break;
                            }
                            }
                        }
                    }
                }
            }
            ctx.restore();
        }
    }

    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @param {TextAttributes} options - options
     * @param {number} maxHeight - maxHeight
     * @param {boolean} isFreeTextAnnotation - isFreeTextAnnotation
     * @param {number} zoomFactor - zoomFactor
     * @private
     * @returns {void} - void
     */
    public drawTextBlazor(canvas: HTMLCanvasElement, options: TextAttributes, maxHeight: number,
                          isFreeTextAnnotation: boolean, zoomFactor: number): void {
        if (options.content && options.visible === true) {
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options as StyleAttributes);

            this.setFontStyle(canvas, options);
            let ascent: number = 0;
            let lineHeight: number = 0;
            if (options.thickness !== undefined) {
                // Used this to get the exact text height for Freetext annotation according to the font size and font family.
                const metrics: TextMetrics = ctx.measureText(options.content);
                ascent = metrics.actualBoundingBoxAscent as number;
                if (ascent == null) {
                    ascent = options.fontSize * 0.8;
                }
                let descent: number = metrics.actualBoundingBoxDescent;
                if (descent == null) {
                    descent = options.fontSize * 0.2;
                }
                lineHeight = (ascent + descent);
                options.height = lineHeight * options.childNodes.length;
            }
            const pivotX: number = options.x + options.width * options.pivotX;
            const pivotY: number = options.y + options.height * options.pivotY;
            this.rotateContext(canvas, options.angle, pivotX, pivotY);
            let i: number = 0;
            let childNodes: SubTextElement[] = [];
            childNodes = options.childNodes;
            const wrapBounds: TextBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                const position: PointModel = this.labelAlign(options, wrapBounds, childNodes, lineHeight);
                const paddingAdjustment: number = options.thickness !== undefined ? (options.thickness * (96 / 72)) * 2 : 0;
                let textHeight: number = 0;
                for (i = 0; i < childNodes.length; i++) {
                    const child: SubTextElement = childNodes[parseInt(i.toString(), 10)];
                    let offsetX: number;
                    let offsetY: number;
                    let isTextDecorationApplied: boolean = false;
                    if (options.textAlign === 'justify') {
                        if (child.text === '\n') {
                            continue;
                        }
                        const baseSpaceWidth: number = ctx.measureText(' ').width;
                        const targetWidth: number = wrapBounds.width;
                        offsetX = position.x + child.x - wrapBounds.x + paddingAdjustment;
                        offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + paddingAdjustment;
                        const isLastLine: boolean = i === childNodes.length - 1;
                        if (!isLastLine && targetWidth > 0) {
                            const leftEdge: number = position.x + child.x + paddingAdjustment;
                            const words: string[] = child.text.trim().split(/\s+/);
                            if (words.length <= 1) {
                                ctx.fillText(child.text, leftEdge, offsetY);
                                continue;
                            }
                            const widths: number[] = words.map((w: any) => ctx.measureText(w).width);
                            const wordsTotal: any = widths.reduce((a: any, b: any) => a + b, 0);
                            const gaps: number = words.length - 1;
                            const naturalWidth: any = wordsTotal + baseSpaceWidth * gaps + paddingAdjustment * 2;
                            const extra: number = Math.max(0, targetWidth - naturalWidth);
                            const extraPerGap: number = extra / gaps;
                            let pen: number = leftEdge;
                            for (let i: number = 0; i < words.length; i++) {
                                ctx.fillText(words[i as number], pen, offsetY);
                                if (i < gaps) {
                                    pen += widths[i as number] + baseSpaceWidth + extraPerGap;
                                }
                            }
                            if (options.textDecoration === 'Underline'
                                || options.textDecoration === 'Overline'
                                || options.textDecoration === 'LineThrough' || options.textDecoration === 'Underline LineThrough') {
                                const startX: number = leftEdge;
                                let startY: number;
                                const endX: number = leftEdge + targetWidth - paddingAdjustment * 2;
                                let endY: number;
                                switch (options.textDecoration) {
                                case 'Underline':
                                    startY = offsetY + 2;
                                    endY = offsetY + 2;
                                    this.drawLine(ctx, startX, startY, endX, endY, options);
                                    break;
                                case 'Overline':
                                    startY = (position.y + child.dy * i);
                                    endY = (position.y + child.dy * i);
                                    this.drawLine(ctx, startX, startY, endX, endY, options);
                                    break;
                                case 'LineThrough':
                                    startY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                    endY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                    this.drawLine(ctx, startX, startY, endX, endY, options);
                                    break;
                                case 'Underline LineThrough':
                                {
                                    this.drawLine(ctx, startX, offsetY + 2, endX, offsetY + 2, options);
                                    const midY: number = (offsetY + position.y + child.dy * i) / 2 + 2 + paddingAdjustment / 2;
                                    this.drawLine(ctx, startX, midY, endX, midY, options);
                                    break;
                                }
                                }
                                isTextDecorationApplied = true;
                            }
                        } else {
                            ctx.fillText(child.text, offsetX, offsetY);
                        }
                    }
                    else if (child.text !== '\n') {
                        if (options.textAlign === 'right') {
                            offsetX = position.x + child.x - wrapBounds.x - paddingAdjustment;
                        } else if (options.textAlign === 'center') {
                            offsetX = position.x + child.x - wrapBounds.x;
                        } else {
                            offsetX = position.x + child.x - wrapBounds.x + paddingAdjustment;
                        }
                        if (options.relativeMode === 'Point') {
                            offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + paddingAdjustment;
                        } else {
                            offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8);
                        }
                        const tabSize: number = 7;
                        const textWithTabs: string = child.text.replace(/\t/g, ' '.repeat(tabSize));
                        textHeight += child.dy;
                        if (!isFreeTextAnnotation || (maxHeight === 0 || (textHeight * zoomFactor < maxHeight && isFreeTextAnnotation))) {
                            ctx.fillText(textWithTabs, offsetX, offsetY);
                        }

                        // if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap') {
                        //     child.text = overFlow(child.text, options);
                        // }
                        //ctx.fillText(child.text, offsetX, offsetY);
                    }
                    else if (isFreeTextAnnotation) {
                        textHeight += child.dy;
                    }
                    if (child.text !== '\n') {
                        if (options.textDecoration === 'Underline'
                            || options.textDecoration === 'Overline'
                            || options.textDecoration === 'LineThrough'
                            || options.textDecoration === 'Underline LineThrough' && !isTextDecorationApplied) {
                            const startPointX: number = offsetX;
                            let startPointY: number;
                            const textlength: number = ctx.measureText(child.text).width;
                            const endPointX: number = offsetX + textlength;
                            let endPointY: number;
                            switch (options.textDecoration) {
                            case 'Underline':
                                startPointY = offsetY + 2;
                                endPointY = offsetY + 2;
                                this.drawLine(ctx, startPointX, startPointY, endPointX, endPointY, options);
                                break;
                            case 'Overline':
                                startPointY = (position.y + child.dy * i);
                                endPointY = (position.y + child.dy * i);
                                this.drawLine(ctx, startPointX, startPointY, endPointX, endPointY, options);
                                break;
                            case 'LineThrough':
                                startPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                endPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                this.drawLine(ctx, startPointX, startPointY, endPointX, endPointY, options);
                                break;
                            case 'Underline LineThrough':
                            {
                                this.drawLine(ctx, startPointX, offsetY + 2, endPointX, offsetY + 2, options);
                                const midY: number = (offsetY + position.y + child.dy * i) / 2 + 2 + paddingAdjustment / 2;
                                this.drawLine(ctx, startPointX, midY, endPointX, midY, options);
                                break;
                            }
                            }
                        }
                    }
                }
            }
            ctx.restore();
        }
    }
    /**
     * Draw Line and Line Through
     *
     * @param {CanvasRenderingContext2D} ctx - ctx
     * @param {number} startPointX - startPointX
     * @param {number} startPointY - startPointY
     * @param {number} endPointX - endPointX
     * @param {number} endPointY - endPointY
     * @param {TextAttributes} options - endPointY
     * @private
     * @returns {void} - void
     */
    private drawLine(ctx: CanvasRenderingContext2D, startPointX: number,
                     startPointY: number, endPointX: number, endPointY: number, options: TextAttributes): void {
        ctx.beginPath();
        ctx.moveTo(startPointX, startPointY);
        ctx.lineTo(endPointX, endPointY);
        ctx.strokeStyle = options.color;
        ctx.lineWidth = options.fontSize * .08;
        ctx.globalAlpha = options.opacity;
        ctx.stroke();
    }
    // vector magnitude
    private m(v: number[]): number { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); }
    // ratio between two vectors
    private r(u: number[], v: number[]): number { return (u[0] * v[0] + u[1] * v[1]) / (this.m(u) * this.m(v)); }
    // angle between two vectors
    private a(u: number[], v: number[]): number { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(this.r(u, v)); }
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

    private getSliceOffset(arg: string, res: number, dest: number, src: number): number {
        switch (arg) {
        case 'min': return 0;
        case 'mid': return (res - dest) / 2 * src / res;
        case 'max': return (res - dest) * src / res;
        default: return 0;
        }
    }

    private image(
        ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number,
        width: number, height: number, alignOptions: ImageAttributes, annotationCallback?: (annotationID: string) => boolean): void {
        ctx.beginPath();
        const srcWidth: number = image.width;
        const srcHeight: number = image.height;
        const destinationW: number = width;
        const destinationH: number = height;
        let resultWidth: number = 0;
        let resultHeight: number = 0;
        ctx.globalAlpha = alignOptions.opacity;
        if (alignOptions && alignOptions.alignment !== 'None') {
            const xalign: string = alignOptions.alignment.toLowerCase().substr(1, 3);
            const yalign: string = alignOptions.alignment.toLowerCase().substr(5, 3);
            if (alignOptions.scale === 'Slice') {
                const a: Function = () => {
                    resultWidth = destinationW;
                    resultHeight = srcHeight * destinationW / srcWidth;
                };
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
                ctx.clearRect(x, y, dWidth, dHeight);
                ctx1.drawImage(image, x1, y1, sWidth, sHeight, 0, 0, dWidth, dHeight);
                ctx.clearRect(x, y, width, height);
                ctx.drawImage(canvas1, x, y, width, height);
            } else if (alignOptions.scale === 'Meet') {
                const srcRatio: number = (srcHeight / srcWidth);
                const destRatio: number = (destinationH / destinationW);
                resultWidth = destRatio > srcRatio ? destinationW : destinationH / srcRatio;
                resultHeight = destRatio > srcRatio ? destinationW * srcRatio : destinationH;
                x += this.getMeetOffset(xalign, resultWidth, destinationW);
                y += this.getMeetOffset(yalign, resultHeight, destinationH);
                ctx.clearRect(x, y, resultWidth, resultHeight);
                ctx.drawImage(image, 0, 0, srcWidth, srcHeight, x, y, resultWidth, resultHeight);
            } else {
                ctx.clearRect(x, y, width, height);
                ctx.drawImage(image, x, y, width, height);
            }
        } else {
            if (image.complete) {
                const canvasId: string = ctx.canvas.id;
                if (this.imageList[canvasId as string]) {
                    const existingImageIndex: number = this.isExistingImage(canvasId, this.imageList, alignOptions);
                    if (existingImageIndex !== -1) {
                        this.updateImageList(existingImageIndex, this.imageList, canvasId);
                    }
                    this.updateCanvasList(this.imageList, canvasId);
                }
                //ctx.clearRect(x, y, width, height);
                ctx.drawImage(image, x, y, width, height);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const proxy: CanvasRenderer = this;
                const transform: DOMMatrix = ctx.getTransform();
                image.onload = null;
                const canvasId: string = ctx.canvas.id;
                if (!this.imageList[canvasId as string]) {
                    this.imageList[canvasId as string] = [];
                }
                const existingImageIndex: number = this.isExistingImage(canvasId, this.imageList, alignOptions);
                const newImageEntry: any = { id: alignOptions.id, image: image, canvasId: canvasId };
                if (existingImageIndex !== -1) {
                    this.updateImageList(existingImageIndex, this.imageList, canvasId);
                }
                this.imageList[canvasId as string].push(newImageEntry);
                image.onload = () => {
                    const lastIndex: number = alignOptions.id.lastIndexOf('_content');
                    const annotationID: string = lastIndex !== -1 ? alignOptions.id.substring(0, lastIndex) : alignOptions.id;
                    let annotationObject: boolean = true;
                    if (annotationCallback !== undefined && !annotationCallback(annotationID)) {
                        annotationObject = false;
                    }
                    if (annotationObject) {
                        ctx.setTransform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
                        //ctx.clearRect(x, y, width, height);
                        //ctx.drawImage(image, x, y, width, height);
                        const canvasIdValue: string = ctx.canvas.id;
                        if (proxy.imageList[canvasIdValue as string]) {
                            const existingImageIndex: number = proxy.isExistingImage(canvasIdValue, proxy.imageList, alignOptions);
                            if (existingImageIndex !== -1) {
                                proxy.updateImageList(existingImageIndex, proxy.imageList, canvasIdValue);
                                ctx.globalAlpha = alignOptions.opacity;
                                ctx.drawImage(image, x, y, width, height);
                            }
                            proxy.updateCanvasList(proxy.imageList, canvasIdValue);
                        }
                    }
                };
            }
        }
        ctx.closePath();
    }

    private isExistingImage(canvasId: string, imageList: Record<string, ImageEntry[]>, alignOptions: ImageAttributes): number {
        return imageList[canvasId as string].findIndex((imageObject: ImageEntry) => imageObject.id === alignOptions.id);
    }

    private updateImageList(existingImageIndex: number, imageList: Record<string, ImageEntry[]>, canvasId: string): void {
        imageList[canvasId as string][existingImageIndex as number].image.onload = null;
        imageList[canvasId as string].splice(existingImageIndex, 1);
    }

    private updateCanvasList(imageList: Record<string, ImageEntry[]>, canvasId: string): void {
        if (imageList[canvasId as string] && imageList[canvasId as string].length === 0) {
            delete imageList[canvasId as string];
        }
    }

    // text utility
    private loadImage(ctx: CanvasRenderingContext2D, obj: ImageAttributes, canvas: HTMLCanvasElement, pivotX: number,
                      pivotY: number, annotationCallback?: (annotationID: string) => boolean, annotationType?: string): void {
        this.rotateContext(canvas, obj.angle, pivotX, pivotY);
        let image: HTMLImageElement;
        if ((<any>window).customStampCollection && (<any>window).customStampCollection.get(obj.printID)) {
            image = (<any>window).customStampCollection.get(obj.printID);
        } else if ((<any>window).signatureCollection && (<any>window).signatureCollection.get(obj.printID)) {
            image = (<any>window).signatureCollection.get(obj.printID);
        } else {
            // Check if it is a sticky note type annotation
            if (window && (<any>window).stickyNote && (<any>window).stickyNote.src && annotationType && annotationType === 'StickyNotes') {
                image = (<any>window).stickyNote;
            } else {
                // Create a new Image and set the source
                image = new Image();
                image.src = obj.source;
            }
        }
        this.image(ctx, image, obj.x, obj.y, obj.width, obj.height, obj, annotationCallback);
    }

    /**
     * @param {HTMLCanvasElement} canvas - canvas
     * @param {ImageAttributes} obj - obj
     * @param {SVGSVGElement} parentSvg - parentSvg
     * @param {boolean} fromPalette - fromPalette
     * @param {boolean} annotationCallback - annotationCallback
     * @param {string} annotationType - annotationType
     * @private
     * @returns {void} - void
     */
    public drawImage(canvas: HTMLCanvasElement, obj: ImageAttributes, parentSvg?: SVGSVGElement, fromPalette?: boolean,
                     annotationCallback?: (annotationID: string) => boolean, annotationType?: string): void {

        if (obj.visible) {
            const ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            const pivotX: number = obj.x + obj.width * obj.pivotX;
            const pivotY: number = obj.y + obj.height * obj.pivotY;
            const imageObj: HTMLImageElement = new Image();
            imageObj.src = obj.source;
            const id: string[] = ctx.canvas.id.split('_');
            // const value: boolean = id[id.length - 1] === ('diagram' || 'diagramLayer') ? true : false;
            // Since Clipping portion for node with slice option is not calculated properly
            // if (obj.sourceX !== undefined && obj.sourceY !== undefined && obj.sourceWidth !== undefined
            //  && obj.sourceHeight !== undefined) {
            //  ctx.drawImage(imageObj, obj.sourceX, obj.sourceY, obj.sourceWidth, obj.sourceHeight, obj.x, obj.y, obj.width, obj.height);
            //  } else {
            //             ctx.drawImage(imageObj, obj.x, obj.y, obj.width, obj.height);
            // }
            if (!fromPalette) {
                this.loadImage(ctx, obj, canvas, pivotX, pivotY, annotationCallback, annotationType);
            } else {
                imageObj.onload = () => {
                    this.loadImage(ctx, obj, canvas, pivotX, pivotY);
                };
            }
            ctx.restore();
        }
    }
    /**
     * @param {TextAttributes} text - text
     * @param {TextBounds} wrapBounds - wrapBounds
     * @param {SubTextElement[]} childNodes - childNodes
     * @param {number} lineHeight - lineHeight
     * @private
     * @returns {PointModel} - PointModel
     */
    public labelAlign(text: TextAttributes, wrapBounds: TextBounds, childNodes: SubTextElement[], lineHeight: number): PointModel {
        const bounds: Size = new Size(wrapBounds.width, childNodes.length * (text.fontSize * 1.2));
        const totalHeight: number = text.thickness !== undefined ? childNodes.length * lineHeight : 0;
        const position: PointModel = { x: 0, y: 0 };
        const labelX: number = text.x;
        const labelY: number = text.y;
        let pointx: number = text.width * 0.5;
        const pointy: number = text.height * 0.5;
        if (text.isEJ2 === true) {
            if (text.textAlign === 'left' || text.textAlign === 'justify') {
                pointx = 0;
            } else if (text.textAlign === 'center') {
                if (wrapBounds.width > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                    pointx = 0;
                } else {
                    pointx = text.width * 0.5;
                }
            } else if (text.textAlign === 'right') {
                pointx = (text.width * 1);
            }
        } else {
            if (text.textAlign === 'left') {
                pointx = 0;
            } else if (text.textAlign === 'center') {
                if (wrapBounds.width > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                    pointx = 0;
                } else {
                    pointx = text.width * 0.5;
                }
            } else if (text.textAlign === 'right') {
                pointx = (text.width * 1);
            }
        }
        position.x = labelX + pointx + (wrapBounds ? wrapBounds.x : 0);
        if (text.thickness !== undefined) {
            position.y = labelY + (text.height * 0.5) - (totalHeight / 2);
        } else {
            position.y = labelY + pointy - bounds.height / 2;
        }
        return position;
    }
}

/**
 * @param {HTMLCanvasElement} canvas - canvas
 * @param {DrawingElement[]} drawingObjects - drawingObjects
 * @param {DrawingRenderer} renderer - renderer
 * @param {boolean} annotationCallback - annotationCallback
 * @param {string} annotationType - annotationType
 * @private
 * @returns {void} - void
 */
export function refreshDiagramElements(canvas: HTMLCanvasElement, drawingObjects: DrawingElement[], renderer: DrawingRenderer,
                                       annotationCallback?: (annotationID: string) => boolean, annotationType?: string): void {
    if (annotationType === 'FreeText') {
        renderer.isFreeTextAnnotation = true;
    }
    if (annotationType === 'Stamp') {
        renderer.isStampAnnotation = true;
    }
    for (let i: number = 0; i < drawingObjects.length; i++) {
        renderer.renderElement(drawingObjects[parseInt(i.toString(), 10)], canvas, undefined, undefined, undefined,
                               undefined, undefined, undefined, annotationCallback, annotationType);
    }
    renderer.isFreeTextAnnotation = false;
    renderer.isStampAnnotation = false;
}
