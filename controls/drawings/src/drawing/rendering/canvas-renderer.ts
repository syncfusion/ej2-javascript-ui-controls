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
 * Canvas Renderer
 */

/** @private */
export class CanvasRenderer {
     /** @private */
     public imageList: Record<string, ImageEntry[]> = {};
    /**   @private  */
    public static getContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    private setStyle(canvas: HTMLCanvasElement, style: StyleAttributes): void {
        let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
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
        ctx.globalAlpha = style.opacity;
        let dashArray: number[] = [];
        if (style.dashArray) {
            dashArray = this.parseDashArray(style.dashArray);
        }
        ctx.setLineDash(dashArray);
        ctx.fillStyle = style.fill;
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

                ctx.save();
                ctx.beginPath();
                let cornerRadius: number = options.cornerRadius;
                let pivotX: number = options.x + options.width * options.pivotX;
                let pivotY: number = options.y + options.height * options.pivotY;
                this.rotateContext(canvas, options.angle, pivotX, pivotY);
                this.setStyle(canvas, options as StyleAttributes);
                if (options.thickness !== undefined) {
                    let strokeWidth = ctx.lineWidth || 1; // default to 1 if not set
                    let halfStroke = strokeWidth / 2;
                    let x = options.x + halfStroke;
                    let y = options.y + halfStroke;
                    let width = options.width - strokeWidth;
                    let height = options.height - strokeWidth;
                    // Draw adjusted rectangle
                    ctx.rect(x, y, width, height);
                    ctx.fillRect(x, y, width, height);
                } else {
                    ctx.rect(options.x, options.y, options.width, options.height);
                    ctx.fillRect(options.x, options.y, options.width, options.height);
                }
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
                ctx.restore();
            }
        }
    }


    /**   @private  */
    public drawPath(canvas: HTMLCanvasElement, options: PathAttributes): void {
        let collection: Object[] = [];
        collection = processPathData(options.data);
        collection = pathSegmentCollection(collection);
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
                let obj: Object = segs[parseInt(i.toString(), 10)]; let seg: PathSegment = obj; let char: string = seg.command;
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
    public drawText(canvas: HTMLCanvasElement, options: TextAttributes, maxHeight: number, isFreeTextAnnotation: boolean, zoomFactor:number): void {
        if (options.content && options.visible === true) {
            let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            this.setStyle(canvas, options as StyleAttributes);

            this.setFontStyle(canvas, options);
            let ascent: number = 0;
            let lineHeight: number = 0;
            if (options.thickness !== undefined) {
                // Used this to get the exact text height for Freetext annotation according to the font size and font family.
                const metrics: TextMetrics = ctx.measureText(options.content);
                ascent = metrics.actualBoundingBoxAscent as number;
                if (ascent == null) ascent = options.fontSize * 0.8;
                let descent: number = metrics.actualBoundingBoxDescent;
                if (descent == null) descent = options.fontSize * 0.2;
                lineHeight = (ascent + descent);
                options.height = lineHeight * options.childNodes.length;
            }

            let pivotX: number = options.x + options.width * options.pivotX;
            let pivotY: number = options.y + options.height * options.pivotY;
            this.rotateContext(canvas, options.angle, pivotX, pivotY);

            let i: number = 0;
            let childNodes: SubTextElement[] = [];
            childNodes = options.childNodes;
            let wrapBounds: TextBounds = options.wrapBounds;
            ctx.fillStyle = options.color;
            if (wrapBounds) {
                let position: PointModel = this.labelAlign(options, wrapBounds, childNodes, lineHeight);
                let paddingAdjustment: number = options.thickness !== undefined ? (options.thickness * (96 / 72)) * 2 : 0;
                let textHeight: number = 0;
                for (i = 0; i < childNodes.length; i++) {
                    let child: SubTextElement = childNodes[parseInt(i.toString(), 10)];
                    let offsetX: number;
                    let offsetY: number;
                    let isTextDecorationApplied: boolean = false;
                    if (options.textAlign === 'justify') {
                        if (child.text === '\n') continue;
                        let baseSpaceWidth: number = ctx.measureText(' ').width;
                        let targetWidth: number = wrapBounds.width;
                        offsetX = position.x + child.x - wrapBounds.x + paddingAdjustment;
                        offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + paddingAdjustment;
                        let isLastLine: boolean = i === childNodes.length - 1;
                        if (!isLastLine && targetWidth > 0) {
                            let leftEdge: number = position.x + child.x + paddingAdjustment;
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
                                ctx.fillText(words[i], pen, offsetY);
                                if (i < gaps) {
                                    pen += widths[i] + baseSpaceWidth + extraPerGap;
                                }
                            }
                            if (options.textDecoration === 'Underline'
                                || options.textDecoration === 'Overline'
                                || options.textDecoration === 'LineThrough') {
                                let startX: number = leftEdge;
                                let startY: number;
                                let endX: number = leftEdge + targetWidth - paddingAdjustment * 2;
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
                                        startY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                        endY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
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
                        if (options.textAlign == "right") {
                            offsetX = position.x + child.x - wrapBounds.x - paddingAdjustment
                        } else if (options.textAlign == "center") {
                            offsetX = position.x + child.x - wrapBounds.x + (paddingAdjustment / 2);
                        } else {
                            offsetX = position.x + child.x - wrapBounds.x + paddingAdjustment;
                        }
                        offsetY = position.y + child.dy * i + ((options.fontSize) * 0.8) + paddingAdjustment;
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
                            || options.textDecoration === 'LineThrough' && !isTextDecorationApplied) {
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
                                    startPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
                                    endPointY = ((offsetY + position.y + child.dy * i) / 2) + 2 + (paddingAdjustment / 2);
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
    //end region

    // vector magnitude
    private m(v: number[]): number { return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2)); }
    // ratio between two vectors
    private r(u: number[], v: number[]): number { return (u[0] * v[0] + u[1] * v[1]) / (this.m(u) * this.m(v)); }
    // angle between two vectors
    private a(u: number[], v: number[]): number { return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(this.r(u, v)); }
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
        width: number, height: number, alignOptions: ImageAttributes, annotationCallback?: (annotationID: string) => boolean)
        :
        void {
        ctx.beginPath();
        let srcWidth: number = image.width;
        let srcHeight: number = image.height;
        let destinationW: number = width;
        let destinationH: number = height;
        let resultWidth: number = 0;
        let resultHeight: number = 0;
        ctx.globalAlpha = alignOptions.opacity;
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
                ctx.clearRect(x, y, dWidth, dHeight);
                ctx1.drawImage(image, x1, y1, sWidth, sHeight, 0, 0, dWidth, dHeight);
                ctx.clearRect(x, y, width, height);
                ctx.drawImage(canvas1, x, y, width, height);
            } else if (alignOptions.scale === 'Meet') {
                let srcRatio: number = (srcHeight / srcWidth);
                let destRatio: number = (destinationH / destinationW);
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
                if (this.imageList[canvasId]) {                         
                    const existingImageIndex: number = this.isExistingImage(canvasId, this.imageList, alignOptions);
                    if (existingImageIndex !== -1) {
                        this.updateImageList(existingImageIndex, this.imageList, canvasId);
                    }
                    this.updateCanvasList(this.imageList, canvasId);
                }
                //ctx.clearRect(x, y, width, height);
                ctx.drawImage(image, x, y, width, height);
            } else {
                const proxy: CanvasRenderer = this;
                let transform: DOMMatrix = ctx.getTransform();
                image.onload = null;
                const canvasId: string = ctx.canvas.id;
                if (!this.imageList[canvasId]) {
                    this.imageList[canvasId] = [];
                }       
                const existingImageIndex = this.isExistingImage(canvasId, this.imageList, alignOptions);
                const newImageEntry = { id: alignOptions.id, image: image, canvasId: canvasId };
            
                if (existingImageIndex !== -1) {
                    this.updateImageList(existingImageIndex, this.imageList, canvasId);
                }             
                this.imageList[canvasId].push(newImageEntry);
                image.onload = () => {
                    const lastIndex: number = alignOptions.id.lastIndexOf('_content')
                    const annotationID:string = lastIndex !== -1 ? alignOptions.id.substring(0, lastIndex) : alignOptions.id;
                    var annotationObject: boolean = true; 
                    if (annotationCallback !== undefined && !annotationCallback(annotationID)) {
                        annotationObject = false; 
                    }
                    if (annotationObject) {
                    ctx.setTransform(transform.a, transform.b, transform.c, transform.d, transform.e, transform.f);
                    //ctx.clearRect(x, y, width, height);
                    //ctx.drawImage(image, x, y, width, height);
                    const canvasIdValue: string = ctx.canvas.id;
                    if (proxy.imageList[canvasIdValue]) {
                        const existingImageIndex: number = proxy.isExistingImage(canvasIdValue, proxy.imageList, alignOptions);
                        if (existingImageIndex !== -1) {
                          proxy.updateImageList(existingImageIndex, proxy.imageList, canvasIdValue);
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
        return imageList[canvasId].findIndex(imageObject => imageObject.id === alignOptions.id);
    }

    private updateImageList(existingImageIndex: number, imageList: Record<string, ImageEntry[]>, canvasId: string): void {
        imageList[canvasId][existingImageIndex].image.onload = null;
        imageList[canvasId].splice(existingImageIndex, 1);
    }

    private updateCanvasList(imageList: Record<string, ImageEntry[]>, canvasId: string) {
        if (imageList[canvasId] && imageList[canvasId].length === 0) {
          delete imageList[canvasId];
      }
    }
    
    // text utility
    private loadImage(
        ctx: CanvasRenderingContext2D, obj: ImageAttributes, canvas: HTMLCanvasElement, pivotX: number, pivotY: number, annotationCallback?:(annotationID: string) => boolean, annotationType?: string):
        void {
        this.rotateContext(canvas, obj.angle, pivotX, pivotY);
        let image: HTMLImageElement;
        if ((<any>window).customStampCollection && (<any>window).customStampCollection.get(obj.printID)) {
            image = (<any>window).customStampCollection.get(obj.printID);
        } else if ((<any>window).signatureCollection && (<any>window).signatureCollection.get(obj.printID)) {
            image = (<any>window).signatureCollection.get(obj.printID);
        } else {
            // Check if it is a sticky note type annotation
            if (window && (<any>window).stickyNote && (<any>window).stickyNote.src && annotationType && annotationType == 'StickyNotes') {
                image = (<any>window).stickyNote;
            } else {
                // Create a new Image and set the source
                image = new Image();
                image.src = obj.source;
            }
        }
        this.image(ctx, image, obj.x, obj.y, obj.width, obj.height, obj, annotationCallback);
    }
    /**   @private  */
    public drawImage(canvas: HTMLCanvasElement, obj: ImageAttributes, parentSvg?: SVGSVGElement, fromPalette?: boolean, annotationCallback?:(annotationID: string) => boolean, annotationType?: string): void {

        if (obj.visible) {
            let ctx: CanvasRenderingContext2D = CanvasRenderer.getContext(canvas);
            ctx.save();
            let pivotX: number = obj.x + obj.width * obj.pivotX;
            let pivotY: number = obj.y + obj.height * obj.pivotY;

            let imageObj: HTMLImageElement = new Image();
            imageObj.src = obj.source;
            let id: string[] = ctx.canvas.id.split('_');
            let value: boolean = id[id.length - 1] === ('diagram' || 'diagramLayer') ? true : false;
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
                this.loadImage(ctx, obj, canvas, pivotX, pivotY, annotationCallback, annotationType);
            } else {
                imageObj.onload = () => {
                    this.loadImage(ctx, obj, canvas, pivotX, pivotY);
                };
            }
            ctx.restore();
        }
    }
    /**   @private  */
    public labelAlign(text: TextAttributes, wrapBounds: TextBounds, childNodes: SubTextElement[], lineHeight: number): PointModel {
        let bounds: Size = new Size(wrapBounds.width, childNodes.length * (text.fontSize * 1.2));
        const totalHeight = text.thickness !== undefined ? childNodes.length * lineHeight : 0;
        let position: PointModel = { x: 0, y: 0 };
        let labelX: number = text.x;
        let labelY: number = text.y;
        let pointx: number = text.width * 0.5;
        let pointy: number = text.height * 0.5;
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
        if (text.thickness !== undefined) {
            position.y = labelY + (text.height * 0.5) - (totalHeight / 2);
        } else {
            position.y = labelY + pointy - bounds.height / 2;
        }
        return position;
    }
}

export function refreshDiagramElements(
    canvas: HTMLCanvasElement, drawingObjects: DrawingElement[], renderer: DrawingRenderer, annotationCallback?:(annotationID: string) => boolean, annotationType?: string): void {
    if (annotationType == "FreeText") {
        renderer.isFreeTextAnnotation = true;
    }
    for (let i: number = 0; i < drawingObjects.length; i++) {
        renderer.renderElement(drawingObjects[parseInt(i.toString(), 10)], canvas, undefined, undefined, undefined, undefined, undefined, undefined, annotationCallback, annotationType);
    }
    renderer.isFreeTextAnnotation = false;
}
