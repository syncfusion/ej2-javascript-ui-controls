import { Size } from './../primitives/size';
import { Point } from './../primitives/point';
import { PointModel } from './../primitives/point-model';
import { processPathData, pathSegmentCollection, getRectanglePath } from './../utility/path-util';
import { overFlow } from './../utility/base-util';
import { createHtmlElement } from './../utility/dom-util';
import { PathSegment, ImageAttributes, StyleAttributes, BaseAttributes, LineAttributes, CircleAttributes } from './canvas-interface';
import { LinearGradientModel, RadialGradientModel, StopModel } from './../core/appearance-model';
import { RectAttributes, PathAttributes, TextAttributes, SubTextElement, TextBounds } from './canvas-interface';
import { IRenderer } from './../rendering/IRenderer';

/**
 * Canvas Renderer
 */

/** @private */
export class CanvasRenderer implements IRenderer {

    /**   @private  */
    public static getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    private static setCanvasSize(canvas: HTMLCanvasElement, width: number, height: number): void {
        if (canvas) {
            canvas.setAttribute('width', width.toString());
            canvas.setAttribute('height', height.toString());
        }
    };

    /**   @private  */
    public renderGradient(options: StyleAttributes, ctx: CanvasRenderingContext2D, x?: number, y?: number): CanvasRenderingContext2D {
        let max: number; let min: number;
        let grd: CanvasGradient;
        if (options.gradient.type !== 'None') {
            for (let i: number = 0; i < options.gradient.stops.length; i++) {
                max = max !== undefined ? options.gradient.stops[i].offset : Math.max(max, options.gradient.stops[i].offset);
                min = min !== undefined ? options.gradient.stops[i].offset : Math.min(min, options.gradient.stops[i].offset);
            }
            if (options.gradient.type === 'Linear') {
                let linear: LinearGradientModel = options.gradient;
                grd = ctx.createLinearGradient(x + linear.x1, y + linear.y1, x + linear.x2, y + linear.y2);
            } else {
                let radial: RadialGradientModel = options.gradient;
                grd = ctx.createRadialGradient(x + radial.fx, y + radial.fy, 0, x + radial.cx, y + radial.cy, radial.r);
            }
            for (let i: number = 0; i < options.gradient.stops.length; i++) {
                let stop: StopModel = options.gradient.stops[i];
                let offset: number = min < 0 ? (max + stop.offset) / (2 * max) : stop.offset / max;
                grd.addColorStop(offset, stop.color);
            }
            ctx.fillStyle = grd;
        }
        return ctx;
    }

    /**   @private  */
    public renderShadow(options: BaseAttributes, canvas: HTMLCanvasElement, collection: Object[] = null): void {
        let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = ctx.fillStyle = options.shadow.color;
        ctx.globalAlpha = options.shadow.opacity;
        let ptModel: PointModel = { x: 0, y: 0 };
        let point: PointModel = Point.transform(ptModel, options.shadow.angle, options.shadow.distance);
        let transX: number = options.x + point.x; let transY: number = options.y + point.y;
        let pivotX: number = transX + options.width * options.pivotX;
        let pivotY: number = transY + options.height * options.pivotY;
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

    /**   @private  */
    public static createCanvas(id: string, width: number, height: number): HTMLCanvasElement {
        let canvasObj: HTMLCanvasElement = createHtmlElement('canvas', { 'id': id }) as HTMLCanvasElement;
        this.setCanvasSize(canvasObj, width, height);
        return canvasObj;
    };

    private setStyle(canvas: HTMLCanvasElement, style: StyleAttributes): void {
        let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
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
            this.renderGradient(style, ctx, 0, 0);
        } else {
            ctx.fillStyle = style.fill;
        }

    }

    private rotateContext(canvas: HTMLCanvasElement, angle: number, x: number, y: number): void {
        let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        ctx.translate(x, y);
        ctx.rotate(angle * Math.PI / 180);
        ctx.translate(-x, -y);
    }

    private setFontStyle(canvas: HTMLCanvasElement, text: TextAttributes): void {
        let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
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

    /**   @private  */
    public parseDashArray(dashArray: string): number[] {
        let dashes: number[] = [];
        let separator: string = dashArray.indexOf(' ') !== -1 ? ' ' : ',';
        let splittedDashes: string[] = dashArray.split(separator);
        for (let i of splittedDashes) {
            dashes.push(Number(i));
        }
        return dashes;
    }
    //Rendering Part

    /**   @private  */
    public drawRectangle(canvas: HTMLCanvasElement, options: RectAttributes): void {
        if (options.visible === true) {
            if (options.cornerRadius) {
                (options as PathAttributes).data = getRectanglePath(options.cornerRadius, options.height, options.width);
                this.drawPath(canvas, options as PathAttributes);
            } else {
                let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
                if (options.shadow) {
                    this.renderShadow(options, canvas);
                }
                ctx.save();
                ctx.beginPath();
                let cornerRadius: number = options.cornerRadius;
                let pivotX: number = options.x + options.width * options.pivotX;
                let pivotY: number = options.y + options.height * options.pivotY;
                this.rotateContext(canvas, options.angle, pivotX, pivotY);
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
    /**   @private  */
    public drawPath(canvas: HTMLCanvasElement, options: PathAttributes): void {
        let collection: Object[] = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
        if (options.shadow) {
            this.renderShadow(options, canvas, collection);
        }
        let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
        ctx.save();
        ctx.beginPath();
        let pivotY: number = options.y + options.height * options.pivotY;
        let pivotX: number = options.x + options.width * options.pivotX;
        this.rotateContext(canvas, options.angle, pivotX, pivotY);
        this.setStyle(canvas, options as StyleAttributes);
        ctx.translate(options.x, options.y);
        this.renderPath(canvas, options, collection);
        ctx.fill();
        ctx.translate(-options.x, -options.y);
        ctx.stroke();
        ctx.restore();
    }

    /**   @private  */
    public renderPath(canvas: HTMLCanvasElement, options: PathAttributes, collection: Object[]): void {
        if (options.visible === true) {
            let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            let x0: number; let y0: number; let x1: number; let y1: number; let x2: number; let y2: number;
            let x: number; let y: number; let length: number; let i: number; let newSeg: Object; let segs: Object[] = collection;
            for (x = 0, y = 0, i = 0, length = segs.length; i < length; ++i) {
                let obj: Object = segs[i]; let seg: PathSegment = obj; let char: string = seg.command;
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
                        let curr: PointModel = { x: x0, y: y0 }; let rx: number = seg.r1; let ry: number = seg.r2;
                        let xAxisRotation: number = seg.angle * (Math.PI / 180.0);
                        let largeArc: boolean = seg.largeArc; let sweep: boolean = seg.sweep; let cp: PointModel = { x: x, y };
                        let currp: PointModel = {
                            x:
                            Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
                            y: -Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
                        };
                        let l: number = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);
                        if (l > 1) {
                            rx *= Math.sqrt(l);
                            ry *= Math.sqrt(l);
                        }
                        let k: number = (Math.pow(ry, 2) * Math.pow(currp.x, 2));
                        let s: number = (largeArc === sweep ? -1 : 1) * Math.sqrt(
                            ((Math.pow(rx, 2) * Math.pow(ry, 2)) - (Math.pow(rx, 2) * Math.pow(currp.y, 2)) - k) /
                            (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2))
                        );
                        if (isNaN(s)) {
                            s = 0;
                        }
                        let cpp: PointModel = { x: s * rx * currp.y / ry, y: s * -ry * currp.x / rx };
                        let centp: PointModel = {
                            x:
                            (curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
                            y: (curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
                        };
                        let a1: number = this.a([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]);
                        let u: number[] = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
                        let v: number[] = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
                        let ad: number = this.a(u, v);
                        if (this.r(u, v) <= -1) {
                            ad = Math.PI;
                        }
                        if (this.r(u, v) >= 1) {
                            ad = 0;
                        }
                        let dir: number = !sweep ? -1.0 : 1.0;
                        let ah: number = a1 + dir * (ad / 2.0);
                        let halfWay: PointModel = {
                            x:
                            centp.x + rx * Math.cos(ah),
                            y: centp.y + ry * Math.sin(ah)
                        };
                        seg.centp = centp; seg.xAxisRotation = xAxisRotation; seg.rx = rx;
                        seg.ry = ry; seg.a1 = a1; seg.ad = ad; seg.sweep = sweep;
                        if (ctx != null) {
                            let ra: number = rx > ry ? rx : ry;
                            let sx: number = rx > ry ? 1 : rx / ry;
                            let sy: number = rx > ry ? ry / rx : 1;
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

    /**   @private  */
    public drawText(canvas: HTMLCanvasElement, options: TextAttributes): void {
        if (options.content && options.visible === true) {
            let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options as StyleAttributes);

            let pivotX: number = options.x + options.width * options.pivotX;
            let pivotY: number = options.y + options.height * options.pivotY;
            this.rotateContext(canvas, options.angle, pivotX, pivotY);

            this.setFontStyle(canvas, options);

            let i: number = 0;
            let childNodes: SubTextElement[] = [];
            childNodes = options.childNodes;
            let wrapBounds: TextBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                let position: PointModel = this.labelAlign(options, wrapBounds, childNodes);
                for (i = 0; i < childNodes.length; i++) {
                    let child: SubTextElement = childNodes[i];
                    let offsetX: number = position.x + child.x - wrapBounds.x;
                    let offsetY: number = position.y + child.dy * i + ((options.fontSize) * 0.8);
                    if (wrapBounds.width > options.width && options.textOverflow !== 'Wrap') {
                        child.text = overFlow(child.text, options);
                    }
                    ctx.fillText(child.text, offsetX, offsetY);
                    if (options.textDecoration === 'Underline'
                        || options.textDecoration === 'Overline'
                        || options.textDecoration === 'LineThrough') {
                        let startPointX: number = offsetX;
                        let startPointY: number;
                        let textlength: number = ctx.measureText(child.text).width;
                        let endPointX: number = offsetX + textlength;
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

    private loadImage(ctx: CanvasRenderingContext2D, obj: ImageAttributes): void {
        ctx.rotate(obj.angle * Math.PI / 180);
        let image: HTMLImageElement = new Image();
        image.src = obj.source;
        this.image(ctx, image, obj.x, obj.y, obj.width, obj.height, obj);
        ctx.rotate(-(obj.angle * Math.PI / 180));
    }

    /**   @private  */
    public drawImage(canvas: HTMLCanvasElement, obj: ImageAttributes, parentSvg?: SVGSVGElement, fromPalette?: boolean): void {

        if (obj.visible) {
            let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            let pivotX: number = obj.x + obj.width * obj.pivotX;
            let pivotY: number = obj.y + obj.height * obj.pivotY;

            let imageObj: HTMLImageElement = new Image();
            imageObj.src = obj.source;
            /** 
             *  Since Clipping portion for node with slice option is not calculated properly
             * if (obj.sourceX !== undefined && obj.sourceY !== undefined && obj.sourceWidth !== undefined
             *  && obj.sourceHeight !== undefined) {
             *  ctx.drawImage(imageObj, obj.sourceX, obj.sourceY, obj.sourceWidth, obj.sourceHeight, obj.x, obj.y, obj.width, obj.height);
             *  } else {
             *             ctx.drawImage(imageObj, obj.x, obj.y, obj.width, obj.height);
             * }
             */
            if (!fromPalette) {
                this.loadImage(ctx, obj);
            } else {
                imageObj.onload = () => {
                    this.loadImage(ctx, obj);
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
        let srcWidth: number = image.width;
        let srcHeight: number = image.height;
        let destinationW: number = width;
        let destinationH: number = height;
        let resultWidth: number = 0;
        let resultHeight: number = 0;

        if (alignOptions && alignOptions.alignment !== 'None') {
            let xalign: string = alignOptions.alignment.toLowerCase().substr(1, 3);
            let yalign: string = alignOptions.alignment.toLowerCase().substr(5, 3);
            if (alignOptions.scale === 'Slice') {
                let a: Function = () => {
                    resultWidth = destinationW;
                    resultHeight = srcHeight * destinationW / srcWidth;
                };
                let b: Function = () => {
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

                let x1: number = this.getSliceOffset(xalign, resultWidth, destinationW, srcWidth);
                let y1: number = this.getSliceOffset(yalign, resultHeight, destinationH, srcHeight);
                let sWidth: number = srcWidth - x1;
                let sHeight: number = srcHeight - y1;
                let dWidth: number = resultWidth - (x1 * (resultWidth / srcWidth));
                let dHeight: number = resultHeight - (y1 * (resultHeight / srcHeight));
                let canvas1: HTMLCanvasElement = createHtmlElement(
                    'canvas', { 'width': width.toString(), 'height': height.toString() }) as HTMLCanvasElement;
                let ctx1: CanvasRenderingContext2D = canvas1.getContext('2d');
                ctx1.drawImage(image, x1, y1, sWidth, sHeight, 0, 0, dWidth, dHeight);
                ctx.drawImage(canvas1, x, y, width, height);
            } else if (alignOptions.scale === 'Meet') {
                let srcRatio: number = (srcHeight / srcWidth);
                let destRatio: number = (destinationH / destinationW);
                resultWidth = destRatio > srcRatio ? destinationW : destinationH / srcRatio;
                resultHeight = destRatio > srcRatio ? destinationW * srcRatio : destinationH;
                x += this.getMeetOffset(xalign, resultWidth, destinationW);
                y += this.getMeetOffset(yalign, resultHeight, destinationH);
                ctx.drawImage(image, 0, 0, srcWidth, srcHeight, x, y, resultWidth, resultHeight);
            } else {
                ctx.drawImage(image, x, y, width, height);
            }
        } else {
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

        let max: number = Math.max(res, dest);
        let min: number = Math.min(res, dest);

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


    /**   @private  */
    public labelAlign(text: TextAttributes, wrapBounds: TextBounds, childNodes: SubTextElement[]): PointModel {
        let bounds: Size = new Size(wrapBounds.width, childNodes.length * (text.fontSize * 1.2));
        let position: PointModel = { x: 0, y: 0 };
        let labelX: number = text.x;
        let labelY: number = text.y;
        let offsetx: number = text.width * 0.5;
        let offsety: number = text.height * 0.5;
        let pointx: number = offsetx;
        let pointy: number = offsety;
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
        position.x = labelX + pointx + (wrapBounds ? wrapBounds.x : 0);
        position.y = labelY + pointy - bounds.height / 2;
        return position;
    }
}

