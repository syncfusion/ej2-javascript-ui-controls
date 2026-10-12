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
            ctx.lineWidth = style.thickness  * (96 / 72);
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
            ctx.lineWidth = style.thickness  * (96 / 72);
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
    public parseDashArray(dashArray: string): number[] {
        const dashes: number[] = [];
        const separator: string = dashArray.indexOf(' ') !== -1 ? ' ' : ',';
        const splittedDashes: string[] = dashArray.split(separator);
        for (const i of splittedDashes) {
            dashes.push(Number(i));
        }
        return dashes;
    }
    //Rendering Part

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
                if (options.thickness !== undefined && !(options as TextAttributes).isShapeLabel) {
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
        ctx.save();
        ctx.beginPath();
        const pivotY: number = options.y + options.height * options.pivotY;
        const pivotX: number = options.x + options.width * options.pivotX;
        this.rotateContext(canvas, options.angle, pivotX, pivotY);
        this.setStyle(canvas, options as StyleAttributes);
        ctx.translate(options.x, options.y);
        this.renderPath(canvas, options, collection);
        ctx.fill();
        ctx.translate(-options.x, -options.y);
        ctx.stroke();
        ctx.restore();
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
                            const leftEdge: number =  position.x + child.x - wrapBounds.x + padding;
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
                options.thickness === 0 ? Math.floor(options.thickness * (96 / 72)) + 2 : Math.floor(options.thickness * (96 / 72)) * 1 + 2;
                const paddingAdjustmentY: number = options.thickness !== undefined &&
                options.thickness === 0 ? Math.floor(options.thickness * (96 / 72)) + 5 : Math.floor(options.thickness * (96 / 72)) * 1 + 4;
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
                    clipTop = position.y  - ascent - paddingAdjustmentX;
                    clipWidth = Math.max(0,  options.freeTextSelectorWidth + paddingAdjustmentX);
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
                                    this.drawLine(ctx, startX, startY, endX,  endY, options);
                                    break;
                                case 'Overline':
                                    startY = (position.y + child.dy * i);
                                    endY = (position.y + child.dy * i);
                                    this.drawLine(ctx, startX, startY, endX,  endY, options);
                                    break;
                                case 'LineThrough':
                                    startY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustmentY / 2);
                                    endY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustmentY / 2);
                                    this.drawLine(ctx, startX, startY, endX,  endY, options);
                                    break;
                                case 'Underline LineThrough':
                                {
                                    this.drawLine(ctx, startX, offsetY + 2, endX,  offsetY + 2, options);
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
                                this.drawLine(ctx, startPointX, startPointY, endPointX,  endPointY, options);
                                break;
                            case 'Overline':
                                startPointY = (position.y + child.dy * i);
                                endPointY = (position.y + child.dy * i);
                                this.drawLine(ctx, startPointX, startPointY, endPointX,  endPointY, options);
                                break;
                            case 'LineThrough':
                                startPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustmentY / 2);
                                endPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustmentY / 2);
                                this.drawLine(ctx, startPointX, startPointY, endPointX,  endPointY, options);
                                break;
                            case 'Underline LineThrough':
                            {
                                this.drawLine(ctx, startPointX, offsetY + 2, endPointX,  offsetY + 2, options);
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
                                    this.drawLine(ctx, startX, startY, endX,  endY, options);
                                    break;
                                case 'Overline':
                                    startY = (position.y + child.dy * i);
                                    endY = (position.y + child.dy * i);
                                    this.drawLine(ctx, startX, startY, endX,  endY, options);
                                    break;
                                case 'LineThrough':
                                    startY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                    endY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                    this.drawLine(ctx, startX, startY, endX,  endY, options);
                                    break;
                                case 'Underline LineThrough':
                                {
                                    this.drawLine(ctx, startX, offsetY + 2, endX,  offsetY + 2, options);
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
                                this.drawLine(ctx, startPointX, startPointY, endPointX,  endPointY, options);
                                break;
                            case 'Overline':
                                startPointY = (position.y + child.dy * i);
                                endPointY = (position.y + child.dy * i);
                                this.drawLine(ctx, startPointX, startPointY, endPointX,  endPointY, options);
                                break;
                            case 'LineThrough':
                                startPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                endPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                this.drawLine(ctx, startPointX, startPointY, endPointX,  endPointY, options);
                                break;
                            case 'Underline LineThrough':
                            {
                                this.drawLine(ctx, startPointX, offsetY + 2, endPointX,  offsetY + 2, options);
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
                                    this.drawLine(ctx, startX, startY, endX,  endY, options);
                                    break;
                                case 'Overline':
                                    startY = (position.y + child.dy * i);
                                    endY = (position.y + child.dy * i);
                                    this.drawLine(ctx, startX, startY, endX,  endY, options);
                                    break;
                                case 'LineThrough':
                                    startY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                    endY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                    this.drawLine(ctx, startX, startY, endX,  endY, options);
                                    break;
                                case 'Underline LineThrough':
                                {
                                    this.drawLine(ctx, startX, offsetY + 2, endX,  offsetY + 2, options);
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
                                this.drawLine(ctx, startPointX, startPointY, endPointX,  endPointY, options);
                                break;
                            case 'Overline':
                                startPointY = (position.y + child.dy * i);
                                endPointY = (position.y + child.dy * i);
                                this.drawLine(ctx, startPointX, startPointY, endPointX,  endPointY, options);
                                break;
                            case 'LineThrough':
                                startPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                endPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                this.drawLine(ctx, startPointX, startPointY, endPointX,  endPointY, options);
                                break;
                            case 'Underline LineThrough':
                            {
                                this.drawLine(ctx, startPointX, offsetY + 2, endPointX,  offsetY + 2, options);
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
