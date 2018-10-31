/**
 * To import utils
 */
import {isNullOrUndefined} from './util';
import {LineAttributes, PathAttributes, CircleAttributes, RectAttributes, EllipseAttributes, PolylineAttributes,
    BaseAttibutes, TextAttributes, ImageAttributes, SVGCanvasAttributes, GradientColor } from './svg-canvas-interface';
/**
 * @private
 */
export class CanvasRenderer {
    //Internal Variables 
    private canvasObj: HTMLCanvasElement;
    /* Properties */
    /**
     * Specifies root id of the canvas element
     * @default null
     */
    private rootId: string;
    /**
     * Specifies the height of the canvas element.
     * @default null
     */
    public height: number;

    /**
     * Specifies the width of the canvas element.
     * @default null
     */
    public width: number;

    /**
     * Specifies the context of the canvas.
     * @default null
     */
    public ctx: CanvasRenderingContext2D;

    /**
     * Holds the context of the rendered canvas as string.
     * @default null
     */
    public dataUrl: string;

    /* End-Properties */

    constructor(rootID: string) {
        this.rootId = rootID;
    }

    // method to get the attributes value
    /* tslint:disable */ 
    private getOptionValue<T>(options: any, key: string): T {
        return options[key] as T;
    }
    /* tslint:enable */

    /**
     * To create a Html5 canvas element
     * @param {BaseAttibutes} options - Options to create canvas
     * @return {HTMLCanvasElement}
     */
    public createCanvas(options: BaseAttibutes): HTMLCanvasElement {
        let canvasObj: HTMLCanvasElement = document.createElement('canvas');
        canvasObj.setAttribute('id', this.rootId + '_canvas');
        this.ctx = canvasObj.getContext('2d');
        this.canvasObj = canvasObj;
        this.setCanvasSize(options.width, options.height);
        return this.canvasObj;
    }

    /**
     * To set the width and height for the Html5 canvas element
     * @param {number} width - width of the canvas
     * @param {number} height - height of the canvas
     * @return {void}
     */
    public setCanvasSize(width: number, height: number): void {
        let element: HTMLElement = document.getElementById(this.rootId);
        let size: ClientRect = !isNullOrUndefined(element) ? element.getBoundingClientRect() : null;
        if (isNullOrUndefined(this.width)) {
            this.canvasObj.setAttribute('width', width ? width.toString() : size.width.toString());
        } else {
            this.canvasObj.setAttribute('width', this.width.toString());
        }

        if (isNullOrUndefined(this.height)) {
            this.canvasObj.setAttribute('height', height ? height.toString() : '450');
        } else {
            this.canvasObj.setAttribute('height', this.height.toString());
        }
    }

    // To set the values to the attributes
    private setAttributes(options: SVGCanvasAttributes): void {
        this.ctx.lineWidth = this.getOptionValue<number>(options, 'stroke-width');
        let dashArray: string = this.getOptionValue<string>(options, 'stroke-dasharray');
        if (!isNullOrUndefined(dashArray)) {
            let dashArrayString: string[] = dashArray.split(',');
            this.ctx.setLineDash([parseInt(dashArrayString[0], 10), parseInt(dashArrayString[1], 10)]);
        }
        this.ctx.strokeStyle = this.getOptionValue<string>(options, 'stroke');
    }

    /**
     * To draw a line 
     * @param {LineAttributes} options - required options to draw a line on the canvas
     * @return {void}
     */
    public drawLine(options: LineAttributes): void {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.getOptionValue<number>(options, 'stroke-width');
        this.ctx.strokeStyle = options.stroke;
        this.ctx.moveTo(options.x1, options.y1);
        this.ctx.lineTo(options.x2, options.y2);
        this.ctx.stroke();
        this.ctx.restore();
        this.dataUrl = this.canvasObj.toDataURL();
    }

    /**
     * To draw a rectangle 
     * @param {RectAttributes} options - required options to draw a rectangle on the canvas
     * @return {void}
     */
    public drawRectangle(options: RectAttributes): void {
        let canvasCtx: CanvasRenderingContext2D = this.ctx;
        let cornerRadius: number = options.rx;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.globalAlpha = this.getOptionValue<number>(options, 'opacity');
        this.setAttributes(options as SVGCanvasAttributes);
        this.ctx.rect(options.x, options.y, options.width, options.height);
        if (cornerRadius !== null && cornerRadius >= 0) {
            this.drawCornerRadius(options);
        } else {
            if (options.fill === 'none') { options.fill = 'transparent'; }
            this.ctx.fillStyle = options.fill;
            this.ctx.fillRect(options.x, options.y, options.width, options.height);
            this.ctx.stroke();
        }
        this.ctx.restore();
        this.ctx = canvasCtx;
        this.dataUrl = this.canvasObj.toDataURL();
    }


    // To draw the corner of a rectangle
    private drawCornerRadius(options: RectAttributes): void {
        let cornerRadius: number = options.rx;
        let x: number = options.x;
        let y: number = options.y;
        let width: number = options.width;
        let height: number = options.height;
        if (options.fill === 'none') {
            options.fill = 'transparent';
        }
        this.ctx.fillStyle = options.fill;
        if (width < 2 * cornerRadius) { cornerRadius = width / 2; }
        if (height < 2 * cornerRadius) { cornerRadius = height / 2; }
        this.ctx.beginPath();
        this.ctx.moveTo(x + width - cornerRadius, y);
        this.ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);
        this.ctx.arcTo(x + width, y + height, x, y + height, cornerRadius);
        this.ctx.arcTo(x, y + height, x, y, cornerRadius);
        this.ctx.arcTo(x, y, x + width, y, cornerRadius);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
        this.dataUrl = this.canvasObj.toDataURL();
    }

    /**
     * To draw a path on the canvas
     * @param {PathAttributes} options - options needed to draw path
     * @param {Int32Array} canvasTranslate - Array of numbers to translate the canvas
     * @return {void}
     */
    public drawPath(options: PathAttributes, canvasTranslate: Int32Array): void {
        let path: string = options.d;
        let dataSplit: string[] = path.split(' ');
        let borderWidth: number = this.getOptionValue<number>(options, 'stroke-width');
        let canvasCtx: CanvasRenderingContext2D = this.ctx;
        let flag: boolean = true;
        this.ctx.save();
        this.ctx.beginPath();
        if (canvasTranslate) { this.ctx.translate(canvasTranslate[0], canvasTranslate[1]); }
        this.ctx.globalAlpha = options.opacity ? options.opacity : this.getOptionValue<number>(options, 'fill-opacity');
        this.setAttributes(options as SVGCanvasAttributes);
        for (let i: number = 0; i < dataSplit.length; i = i + 3) {
            let x1: number = parseFloat(dataSplit[i + 1]);
            let y1: number = parseFloat(dataSplit[i + 2]);
            switch (dataSplit[i]) {
                case 'M':
                    if (!options.innerR && !options.cx) {
                        this.ctx.moveTo(x1, y1);
                    }
                    break;
                case 'L':
                    if (!options.innerR) {
                        this.ctx.lineTo(x1, y1);
                    }
                    break;
                case 'C':
                    let c1: number = parseFloat(dataSplit[i + 3]);
                    let c2: number = parseFloat(dataSplit[i + 4]);
                    let c3: number = parseFloat(dataSplit[i + 5]);
                    let c4: number = parseFloat(dataSplit[i + 6]);
                    this.ctx.bezierCurveTo(x1, y1, c1, c2, c3, c4);
                    i = i + 4;
                    break;
                case 'A':
                    if (!options.innerR) {
                        if (options.cx) {
                            this.ctx.arc(options.cx, options.cy, options.radius, 0, 2 * Math.PI, options.counterClockWise);
                        } else {
                            this.ctx.moveTo(options.x, options.y);
                            this.ctx.arc(options.x, options.y, options.radius, options.start, options.end, options.counterClockWise);
                            this.ctx.lineTo(options.x, options.y);
                        }
                    } else if (flag) {
                        this.ctx.arc(options.x, options.y, options.radius, options.start, options.end, options.counterClockWise);
                        this.ctx.arc(options.x, options.y, options.innerR, options.end, options.start, !options.counterClockWise);
                        flag = false;
                    }
                    i = i + 5;
                    break;
                case 'z':
                    this.ctx.closePath();
                    break;
            }
        }
        if (options.fill !== 'none' && options.fill !== undefined) {
            this.ctx.fillStyle = options.fill;
            this.ctx.fill();
        }
        if (borderWidth > 0) {
            this.ctx.stroke();
        }
        this.ctx.restore();
        this.ctx = canvasCtx;
        this.dataUrl = this.canvasObj.toDataURL();
    }

    /**
     * To draw a text
     * @param {TextAttributes} options - options required to draw text
     * @param {string} label - Specifies the text which has to be drawn on the canvas
     * @return {void}
     */
    public drawText(options: TextAttributes, label: string): void {
        let fontWeight: string = this.getOptionValue<string>(options, 'font-weight');
        if (!isNullOrUndefined(fontWeight) && fontWeight.toLowerCase() === 'regular') {
           fontWeight = 'normal';
        }
        let fontSize: string = this.getOptionValue<string>(options, 'font-size');
        let fontFamily: string = this.getOptionValue<string>(options, 'font-family');
        let fontStyle: string = this.getOptionValue<string>(options, 'font-style').toLowerCase();
        let font: string = (fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily);
        let anchor: string = this.getOptionValue<string>(options, 'text-anchor');
        let opacity: number = options.opacity !== undefined ? options.opacity : 1;
        if (anchor === 'middle') {
            anchor = 'center';
        }
        this.ctx.save();
        this.ctx.fillStyle = options.fill;
        this.ctx.font = font;
        this.ctx.textAlign = anchor;
        this.ctx.globalAlpha = opacity;
        if (options.baseline) {
            this.ctx.textBaseline = options.baseline;
        }
        let txtlngth: number = 0;
        this.ctx.translate(options.x + (txtlngth / 2), options.y);
        this.ctx.rotate(options.labelRotation * Math.PI / 180);
        this.ctx.fillText(label, 0, 0);
        this.ctx.restore();
        this.dataUrl = this.canvasObj.toDataURL();
    }

    /**
     * To draw circle on the canvas
     * @param {CircleAttributes} options - required options to draw the circle
     * @return {void}
     */
    public drawCircle(options: CircleAttributes): void {
        let canvasCtx: CanvasRenderingContext2D = this.ctx;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(options.cx, options.cy, options.r, 0, 2 * Math.PI);
        this.ctx.fillStyle = options.fill;
        this.ctx.globalAlpha = options.opacity;
        this.ctx.fill();
        this.setAttributes(options as SVGCanvasAttributes);
        this.ctx.stroke();
        this.ctx.restore();
        this.ctx = canvasCtx;
        this.dataUrl = this.canvasObj.toDataURL();
    }

    /**
     * To draw polyline 
     * @param {PolylineAttributes} options - options needed to draw polyline
     * @return {void}
     */
    public drawPolyline(options: PolylineAttributes): void {
        this.ctx.save();
        this.ctx.beginPath();
        let points: string[] = options.points.split(' ');
        for (let i: number = 0; i < points.length - 1; i++) {
            let point: string[] = points[i].split(',');
            let x: number = parseFloat(point[0]);
            let y: number = parseFloat(point[1]);
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.lineWidth = this.getOptionValue<number>(options, 'stroke-width');
        this.ctx.strokeStyle = options.stroke;
        this.ctx.stroke();
        this.ctx.restore();
        this.dataUrl = this.canvasObj.toDataURL();
    }

    /**
     * To draw an ellipse on the canvas
     * @param {EllipseAttributes} options - options needed to draw ellipse
     * @return {void}
     */
    public drawEllipse(options: EllipseAttributes): void {
        let canvasCtx: CanvasRenderingContext2D = this.ctx;
        let circumference: number = Math.max(options.rx, options.ry);
        let scaleX: number = options.rx / circumference;
        let scaleY: number = options.ry / circumference;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(options.cx, options.cy);
        this.ctx.save();
        this.ctx.scale(scaleX, scaleY);
        this.ctx.arc(0, 0, circumference, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = options.fill;
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.lineWidth = this.getOptionValue<number>(options, 'stroke-width');
        this.ctx.strokeStyle = options.stroke;
        this.ctx.stroke();
        this.ctx.restore();
        this.ctx = canvasCtx;
        this.dataUrl = this.canvasObj.toDataURL();
    }

    /**
     * To draw an image
     * @param {ImageAttributes} options - options required to draw an image on the canvas
     * @return {void}
     */
    public drawImage(options: ImageAttributes): void {
        this.ctx.save();
        let imageObj: HTMLImageElement = new Image();
        if (!isNullOrUndefined(options.href)) {
            imageObj.src = options.href;
            this.ctx.drawImage(imageObj, options.x, options.y, options.width, options.height);
        }
        this.ctx.restore();
        this.dataUrl = this.canvasObj.toDataURL();
    }

    /**
     * To create a linear gradient
     * @param {string[]} colors - Specifies the colors required to create linear gradient
     * @return {string}
     */
    public createLinearGradient(colors: GradientColor[]): string {
        let myGradient: CanvasGradient;
        if (!isNullOrUndefined(colors[0].colorStop)) {
            myGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasObj.height);
        }
        let color: string = this.setGradientValues(colors, myGradient);
        return color;
    }

    /**
     * To create a radial gradient
     * @param {string[]} colors - Specifies the colors required to create linear gradient
     * @return {string}
     */
    public createRadialGradient(colors: GradientColor[]): string {
        let myGradient: CanvasGradient;
        if (!isNullOrUndefined(colors[0].colorStop)) {
            myGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.canvasObj.height);
        }
        let colorName: string = this.setGradientValues(colors, myGradient);
        return colorName;
    }

    // To set the gradient values
    private setGradientValues(colors: GradientColor[], myGradient: CanvasGradient): string {
        let colorName: string;
        if (!isNullOrUndefined(colors[0].colorStop)) {
            for (let i: number = 0; i <= colors.length - 1; i++) {
                let color: string = colors[i].color;
                let newColorStop: string = (colors[i].colorStop).slice(0, -1);
                let stopColor: number = parseInt(newColorStop, 10) / 100;
                myGradient.addColorStop(stopColor, color);
            }
            colorName = myGradient.toString();
        } else {
            colorName = colors[0].color.toString();
        }
        this.dataUrl = this.canvasObj.toDataURL();
        return colorName;
    }

    /**
     * To set the attributes to the element
     * @param {SVGCanvasAttributes} options - Attributes to set for the element
     * @param {HTMLElement} element - The element to which the attributes need to be set
     * @return {HTMLElement}
     */
    public setElementAttributes(options: SVGCanvasAttributes, element: HTMLElement): HTMLElement {
        let keys: string[] = Object.keys(options);
        let values: string[] = Object.keys(options).map((key: string) => { return options[key]; });
        for (let i: number = 0; i < keys.length; i++) {
            element.setAttribute(keys[i], values[i]);
        }
        return element;
    }

    /**
     * To update the values of the canvas element attributes 
     * @param {SVGCanvasAttributes} options - Specifies the colors required to create gradient
     * @return {void}
     */
    public updateCanvasAttributes(options: SVGCanvasAttributes): void {
        this.setElementAttributes(options, this.canvasObj);
        let ctx: CanvasRenderingContext2D = this.ctx;
        if (!isNullOrUndefined(this.dataUrl)) {
            let img: HTMLImageElement = new Image;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = this.dataUrl;
        }
    }
}