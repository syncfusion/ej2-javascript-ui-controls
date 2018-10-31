import { SvgRenderer, CanvasRenderer, remove, createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { FontModel, BorderModel, PaletteCollectionModel } from '../model/base-model';
import { HeatMap } from '../heatmap';
import { RgbColor } from '../utils/colorMapping';
import { BubbleTooltipData } from '../model/base';

/**
 * Helper method for heatmap
 */

/** @private */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}


/**
 * Function to measure the height and width of the text.
 * @private
 */
export function measureText(text: string, font: FontModel): Size {
    let htmlObject: HTMLElement = document.getElementById('heatmapmeasuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'heatmapmeasuretext' });
        document.body.appendChild(htmlObject);
    }

    htmlObject.innerHTML = text;
    htmlObject.style.position = 'absolute';
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.fontSize = (font.size).indexOf('px') !== -1 ? font.size : font.size + 'px';
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.whiteSpace = 'nowrap';
    // For bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}

/** @private */
export class TextElement {
    public ['font-size']: string;
    public ['font-style']: string;
    public ['font-family']: string;
    public ['font-weight']: string;
    public fill: string;

    constructor(fontModel: FontModel, fontColor?: string) {
        this['font-size'] = fontModel.size;
        this['font-style'] = fontModel.fontStyle;
        this['font-family'] = fontModel.fontFamily;
        this['font-weight'] = fontModel.fontWeight;
        this.fill = fontColor ? fontColor : '';
    }
}

export function titlePositionX(width: number, leftPadding: number, rightPadding: number, titleStyle: FontModel): number {
    let positionX: number;
    if (titleStyle.textAlignment === 'Near') {
        positionX = leftPadding;
    } else if (titleStyle.textAlignment === 'Center') {
        positionX = leftPadding + width / 2;
    } else {
        positionX = width + leftPadding;
    }
    return positionX;
}

/**
 * Internal class size for height and width
 * @private
 */
export class Size {
    /**
     * height of the size
     */
    public height: number;
    /**
     * width of the size
     */
    public width: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}

/** @private */
export class CustomizeOption {

    public id: string;
    constructor(id?: string) {
        this.id = id;
    }
}

/** @private */
export class PathOption extends CustomizeOption {
    public opacity: number;
    public fill: string;
    public stroke: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    public d: string;

    constructor(id: string, fill: string, width: number, color?: string, opacity?: number, dashArray?: string, d?: string) {
        super(id);
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color ? color : '';
        this['stroke-width'] = parseFloat(width.toString());
        this['stroke-dasharray'] = dashArray;
        this.d = d;
    }
}

/**
 * Class to define currentRect private property.
 * @private
 */
export class CurrentRect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public value: number|BubbleTooltipData[];
    public id: string;
    constructor(x: number, y: number, width: number, height: number, value: number|BubbleTooltipData[], id: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.value = value;
        this.id = id;
    }
}

/**
 * Class to define property to draw rectangle.
 * @private
 */
export class RectOption extends PathOption {

    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public rx: number;
    public ry: number;
    public transform: string;

    constructor(
        id: string, fill: string, border: BorderModel, opacity: number,
        rect: Rect, borderColor?: string, rx?: number, ry?: number, transform?: string, dashArray?: string
    ) {
        super(id, fill, border.width, borderColor, opacity, dashArray);
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height > 0 ? rect.height : 0;
        this.width = rect.width > 0 ? rect.width : 0;
        this.rx = rx ? rx : 0;
        this.ry = ry ? ry : 0;
        this.transform = transform ? transform : '';
    }
}

/**
 * Class to define property to draw circle.
 * @private
 */
export class CircleOption extends PathOption {

    public cx: number;
    public cy: number;
    public r: number;

    constructor(
        id: string, fill: string, border: BorderModel, opacity: number,
        borderColor?: string, cx?: number, cy?: number, r?: number
    ) {
        super(id, fill, border.width, borderColor, opacity);
        this.cx = cx ? cx : 0;
        this.cy = cy ? cy : 0;
        this.r = r ? r : 0;
    }
}

/**
 * Helper Class to define property to draw rectangle.
 * @private
 */
export class Rect {

    public x: number;
    public y: number;
    public height: number;
    public width: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

/**
 * Class to define property to draw text.
 * @private
 */
export class TextOption extends TextElement {
    public id: string;
    public ['text-anchor']: string;
    public text: string | string[];
    public transform: string = '';
    public x: number;
    public y: number;
    public ['dominant-baseline']: string = 'auto';
    public labelRotation: number = 0;
    public baseline: string = 'auto';
    public dy: string;

    constructor(id: string, basic: TextBasic, element: FontModel, fontColor?: string) {
        super(element, fontColor);
        this.id = id;
        this.x = basic.x;
        this.y = basic.y;
        this['text-anchor'] = basic['text-anchor'];
        this.text = basic.text;
        this.transform = basic.transform;
        this.labelRotation = basic.labelRotation;
        this['dominant-baseline'] = basic['dominant-baseline'];
        this.baseline = basic.baseline;
        this.dy = basic.dy;
    }

}

/**
 * Helper Class to define property to draw text.
 * @private
 */
export class TextBasic {

    public ['text-anchor']: string;
    public text: string | string[];
    public transform: string = '';
    public x: number;
    public y: number;
    public ['dominant-baseline']: string = 'auto';
    public labelRotation: number = 0;
    public baseline: string = 'auto';
    public dy: string;

    constructor(
        x?: number, y?: number, anchor?: string, text?: string | string[],
        labelRotation?: number, transform?: string, baseLine?: string, dy?: string) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
        this['text-anchor'] = anchor ? anchor : '';
        this.text = text ? text : '';
        this.transform = transform ? transform : '';
        this.labelRotation = labelRotation;
        this['dominant-baseline'] = baseLine ? baseLine : '';
        this.baseline = baseLine ? baseLine : '';
        this.dy = dy ? dy : '';
    }
}

/**
 * Class to define property to draw line.
 * @private
 */
export class Line {

    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;

    constructor(x1: number, y1: number, x2: number, y2: number) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }
}

/**
 * Class to define property to draw line.
 * @private
 */
export class LineOption extends PathOption {
    public x1: number;
    public y1: number;
    public x2: number;
    public y2: number;
    constructor(id: string, line: Line, stroke: string, strokewidth: number, opacity?: number, dasharray?: string) {
        super(id, null, strokewidth, stroke, opacity, dasharray, null);
        this.x1 = line.x1;
        this.y1 = line.y1;
        this.x2 = line.x2;
        this.y2 = line.y2;
    }
}

/**
 * Properties required to render path.
 * @private
 */
export class PathAttributes extends PathOption {
    public d: string;
    public x: number;
    public y: number;
    constructor(
        id: string, path: Path, fill: string, border: BorderModel, borderWidth: number,
        opacity: number, borderColor?: string) {
        super(id, fill, borderWidth, borderColor, opacity, null);
        this.d = path.d;
        this.x = path.x;
        this.y = path.y;
    }
}


/**
 * Helper Class to define property to path.
 * @private
 */
export class Path {

    public d: string;
    public innerR: boolean;
    public cx: number;
    public cy: number;
    public x: number;
    public y: number;
    public x1: number;
    public y1: number;
    public start: number;
    public end: number;
    public radius: number;
    public counterClockWise: boolean;

    constructor(
        d: string, innerR: boolean, x: number, y: number, x1: number, y1: number,
        cx: number, cy: number, start: number,
        end: number, radius: number, counterClockWise: boolean) {
        this.d = d;
        this.innerR = innerR;
        this.cx = cx;
        this.cy = cy;
        this.x = x;
        this.y = y;
        this.x1 = x1;
        this.y1 = y1;
        this.start = start;
        this.end = end;
        this.radius = radius;
        this.counterClockWise = counterClockWise;
    }
}

/** @private */
export function sum(values: number[]): number {
    let sum: number = 0;
    for (let value of values) {
        sum += value;
    }
    return sum;
}

/** @private */
export function titlePositionY(heatmapSize: Size, topPadding: number, bottomPadding: number, titleStyle: FontModel): number {
    let positionY: number;
    if (titleStyle.textAlignment === 'Near') {
        positionY = heatmapSize.height - bottomPadding;
    } else if (titleStyle.textAlignment === 'Center') {
        positionY = heatmapSize.height / 2;
    } else {
        positionY = topPadding;
    }
    return positionY;
}

/** @private */
export function rotateTextSize(font: FontModel, text: string, angle: number): Size {

    let renderer: SvgRenderer = new SvgRenderer('heatmapMeasureRotateText');
    let svgObject: Element = renderer.createSvg({ id: 'heatmapMeasureRotateText_svg', width: 100, height: 100 });
    let box: ClientRect;
    let options: Object;
    let htmlObject: HTMLElement;
    options = {
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'transform': 'rotate(' + angle + ', 0, 0)',
        'text-anchor': 'middle'
    };
    htmlObject = renderer.createText(options, text) as HTMLElement;
    svgObject.appendChild(htmlObject);
    document.body.appendChild(svgObject);
    box = htmlObject.getBoundingClientRect();
    remove(svgObject);
    return new Size((box.right - box.left), (box.bottom - box.top));
}

/**
 * Class to draw SVG and Canvas Rectangle & Text.
 * @private
 */
export class DrawSvgCanvas {
    private heatMap: HeatMap;
    constructor(heatmap?: HeatMap) {
        this.heatMap = heatmap;
    }
    //Svg & Canvas Rectangle Part
    public drawRectangle(properties: RectOption, parentElement: Element, isFromSeries?: Boolean): void {
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(this.heatMap.renderer.drawRectangle(properties));
        } else {
            this.drawCanvasRectangle(this.heatMap.canvasRenderer, properties, isFromSeries);
        }
    }

    //Svg & Canvas Bubble Part
    public drawCircle(properties: CircleOption, parentElement: Element): void {
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(this.heatMap.renderer.drawCircle(properties));
        } else {
            this.drawCanvasCircle(this.heatMap.canvasRenderer, properties);
        }
    }

    //Svg & Canvas Pie Part
    public drawPath(properties: PathAttributes, options: Path, parentElement: Element): void {
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(this.heatMap.renderer.drawPath(properties));
        } else {
            this.drawCanvasPath(this.heatMap.canvasRenderer, properties, options);
        }
    }

    //Svg & Canvas Text Part
    public createText(properties: TextOption, parentElement: Element, text: string): void {
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(this.heatMap.renderer.createText(properties, text));
        } else {
            this.canvasDrawText(properties, text);
        }
    }

    //Draw the wrapped text for both SVG & canvas
    public createWrapText(options: TextOption, font: FontModel, parentElement: Element): void {
        let renderOptions: Object = {};
        let htmlObject: Element;
        let tspanElement: Element;
        let text: string;
        let height: number;
        renderOptions = {
            'id': options.id,
            'x': options.x,
            'y': options.y,
            'fill': options.fill,
            'font-size': font.size,
            'font-style': font.fontStyle,
            'font-family': font.fontFamily,
            'font-weight': font.fontWeight,
            'text-anchor': options['text-anchor'],
            'transform': options.transform,
            'dominant-baseline': options['dominant-baseline']
        };
        text = options.text[0];
        if (!this.heatMap.enableCanvasRendering) {
            htmlObject = this.heatMap.renderer.createText(renderOptions, text);
        } else {
            this.heatMap.canvasRenderer.drawText(options, text);
        }
        if (typeof options.text !== 'string' && options.text.length > 1) {
            for (let i: number = 1, len: number = options.text.length; i < len; i++) {
                height = (measureText(options.text[i], font).height);
                if (!this.heatMap.enableCanvasRendering) {
                    tspanElement = this.heatMap.renderer.createTSpan(
                        {
                            'x': options.x, 'id': options.id + i,
                            'y': (options.y) + (i * height)
                        },
                        options.text[i]
                    );
                    htmlObject.appendChild(tspanElement);
                } else {
                    options.id = options.id + i;
                    options.y += height;
                    this.heatMap.canvasRenderer.drawText(options, options.text[i]);
                }
            }
        }
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(htmlObject);
        }
    }

    public drawLine(properties: LineOption, parentElement: Element): void {
        if (!this.heatMap.enableCanvasRendering) {
            parentElement.appendChild(this.heatMap.renderer.drawLine(properties) as HTMLElement);
        } else {
            this.heatMap.canvasRenderer.drawLine(properties);
        }
    }

    //Canvas Text Part
    public canvasDrawText(options: TextOption, label: string, translateX?: number, translateY?: number): void {
        let ctx: CanvasRenderingContext2D = this.heatMap.canvasRenderer.ctx;
        if (!translateX) {
            translateX = options.x;
        }
        if (!translateY) {
            translateY = options.y;
        }
        let fontWeight: string = this.getOptionValue<string>(options, 'font-weight');
        if (!isNullOrUndefined(fontWeight) && fontWeight.toLowerCase() === 'regular') {
            fontWeight = 'normal';
        }
        let fontFamily: string = this.getOptionValue<string>(options, 'font-family');
        let fontSize: string = (options['font-size'].toString()).indexOf('px') === -1 ? options['font-size'] + 'px' : options['font-size'];
        let anchor: string = this.getOptionValue<string>(options, 'text-anchor');
        let fontStyle: string = this.getOptionValue<string>(options, 'font-style').toLowerCase();
        let font: string = (fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily);
        if (anchor === 'middle') {
            anchor = 'center';
        }
        ctx.save();
        ctx.fillStyle = options.fill;
        ctx.font = font;
        ctx.textAlign = anchor;
        if (options.baseline) {
            ctx.textBaseline = options.baseline;
        }
        ctx.translate(translateX, translateY);
        ctx.rotate(options.labelRotation * Math.PI / 180);
        ctx.fillText(label, options.x - translateX, options.y - translateY);
        ctx.restore();
    }
    // method to get the attributes value
    /* tslint:disable */
    private getOptionValue<T>(options: any, key: string): T {
        return options[key] as T;
    }

    private setAttributes(canvas: CanvasRenderer, options: RectOption | CircleOption | PathAttributes) {
        canvas.ctx.lineWidth = options['stroke-width'];
        let dashArray = options['stroke-dasharray'];
        if (!isNullOrUndefined(dashArray)) {
            let dashArrayString = dashArray.split(',');
            canvas.ctx.setLineDash([parseInt(dashArrayString[0], 10), parseInt(dashArrayString[1], 10)]);
        }
        canvas.ctx.strokeStyle = options['stroke'];
    };

    public drawCanvasRectangle(canvas: CanvasRenderer, options: RectOption, isFromSeries?: Boolean) {
        let canvasCtx = canvas.ctx;
        let cornerRadius = options.rx;
        canvas.ctx.save();
        canvas.ctx.beginPath();
        canvas.ctx.globalAlpha = options['opacity'];
        this.setAttributes(canvas, options);
        this.drawCornerRadius(canvas, options);
        if ((options['stroke-width'] && options['stroke-width'] != 0) || isFromSeries) {
            canvas.ctx.stroke();
        }
        canvas.ctx.restore();
        canvas.ctx = canvasCtx;
    };
    // To draw the corner of a rectangle
    private drawCornerRadius(canvas: CanvasRenderer, options: RectOption) {
        let cornerRadius = options.rx;
        let x = options.x;
        let y = options.y;
        let width = options.width;
        let height = options.height;
        if (options.fill === 'none') {
            options.fill = 'transparent';
        }
        canvas.ctx.fillStyle = options.fill;
        if (width < 2 * cornerRadius) {
            cornerRadius = width / 2;
        }
        if (height < 2 * cornerRadius) {
            cornerRadius = height / 2;
        }
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(x + width - cornerRadius, y);
        canvas.ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);
        canvas.ctx.arcTo(x + width, y + height, x, y + height, cornerRadius);
        canvas.ctx.arcTo(x, y + height, x, y, cornerRadius);
        canvas.ctx.arcTo(x, y, x + width, y, cornerRadius);
        canvas.ctx.closePath();
        canvas.ctx.fill();
    };

    public drawCanvasCircle(canvas: CanvasRenderer, options: CircleOption) {
        canvas.ctx.save();
        canvas.ctx.beginPath();
        canvas.ctx.arc(options.cx, options.cy, options.r, 0, 2 * Math.PI);
        canvas.ctx.fillStyle = options.fill;
        canvas.ctx.globalAlpha = options.opacity;
        canvas.ctx.fill();
        this.setAttributes(canvas, options);
        if (options['stroke-width'] && options['stroke-width'] !== 0) {
            canvas.ctx.stroke();
        }
        canvas.ctx.restore();
    };

    public drawCanvasPath(canvas: CanvasRenderer, properties: PathAttributes, options: Path) {
        let path: string = properties.d;
        let dataSplit: string[] = path.split(' ');
        let borderWidth: number = this.getOptionValue<number>(options, 'stroke-width');
        canvas.ctx.save();
        canvas.ctx.beginPath();
        canvas.ctx.globalAlpha = properties.opacity;
        canvas.ctx.fillStyle = properties.fill;
        this.setAttributes(canvas, properties);
        for (let i: number = 0; i < dataSplit.length; i = i + 3) {
            let x1: number = parseFloat(dataSplit[i + 1]);
            let y1: number = parseFloat(dataSplit[i + 2]);
            switch (dataSplit[i]) {
                case 'M':
                    canvas.ctx.moveTo(x1, y1);
                    break;
                case 'L':
                    canvas.ctx.lineTo(x1, y1);
                    break;
                case 'A':
                case 'a':
                    canvas.ctx.arc(options.x, options.y, options.radius, (options.start * 0.0174533), (options.end * 0.0174533), false);
                    i = dataSplit[i] === 'a' ? i + 13 : i + 5;
                    break;
                case 'Z':
                    canvas.ctx.closePath();
                    break;
            }
        }
        canvas.ctx.fill();
        if (properties['stroke-width'] && properties['stroke-width'] !== 0) {
            canvas.ctx.stroke();
        }
        canvas.ctx.restore();
    };
}

export function getTitle(title: string, style: FontModel, width: number): string[] {
    let titleCollection: string[] = [];
    switch (style.textOverflow) {
        case 'Wrap':
            titleCollection = textWrap(title, width, style);
            break;
        case 'Trim':
            titleCollection.push(textTrim(width, title, style));
            break;
        default:
            titleCollection.push(textNone(width, title, style));
            break;
    }
    return titleCollection;
}

export function textWrap(currentLabel: string, maximumWidth: number, font: FontModel): string[] {
    let textCollection: string[] = currentLabel.split(' ');
    let label: string = '';
    let labelCollection: string[] = [];
    let text: string;
    for (let i: number = 0, len: number = textCollection.length; i < len; i++) {
        text = textCollection[i];
        if (measureText(label.concat(text), font).width < maximumWidth) {
            label = label.concat((label === '' ? '' : ' ') + text);
        } else {
            if (label !== '') {
                labelCollection.push(textTrim(maximumWidth, label, font));
                label = text;
            } else {
                labelCollection.push(textTrim(maximumWidth, text, font));
                text = '';
            }
        }
        if (label && i === len - 1) {
            labelCollection.push(textTrim(maximumWidth, label, font));
        }
    }
    return labelCollection;
}

/** @private */
export function textTrim(maxWidth: number, text: string, font: FontModel): string {
    let label: string = text;
    let size: number = measureText(text, font).width;
    if (size > maxWidth) {
        let textLength: number = text.length;
        for (let index: number = textLength - 1; index >= 0; --index) {
            label = text.substring(0, index) + '...';
            size = measureText(label, font).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}

/** @private */
export function textNone(maxWidth: number, text: string, font: FontModel): string {
    let label: string = text;
    let size: number = measureText(text, font).width;
    if (size > maxWidth) {
        let textLength: number = text.length;
        for (let i: number = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i);
            size = measureText(label, font).width;
            if (size <= maxWidth) {
                return label;
            }
        }
    }
    return label;
}

/** @private */
export class Gradient {
    public id: string;
    public x1: string;
    public x2: string;
    public y1: string;
    public y2: string;
    constructor(x: string, x1: string, x2: string, y1: string, y2: string) {
        this.id = x;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

export class GradientColor {
    public color: string;
    public colorStop: string;
    constructor(color: string, colorStop: string) {
        this.color = color;
        this.colorStop = colorStop;
    }
}

/** @private */
export function showTooltip(
    text: string, x: number, y: number, areaWidth: number, id: string, element: Element,
    isTouch?: boolean, heatmap?: HeatMap
): void {
    let tooltip: HTMLElement = document.getElementById(id);
    let initialClip: Rect = heatmap.initialClipRect;
    let size: Size = measureText(text, {
        fontFamily: 'Segoe UI', size: '12px',
        fontStyle: 'Normal', fontWeight: 'Regular'
    });
    let width: number = size.width + 5;
    x = (x + width > areaWidth) ? x - width : x;
    x = x < 0 ? 5 : x;
    if (!tooltip) {
        tooltip = createElement('div', {
            innerHTML: text,
            id: id,
            styles: 'top:' + (y + 15).toString() + 'px;left:' + (x + 15).toString() +
                'px;background-color: rgb(255, 255, 255) !important; color:black !important; ' +
                'position:absolute;border:1px solid rgb(112, 112, 112); padding-left : 3px; padding-right : 2px;' +
                'padding-bottom : 2px; padding-top : 2px; font-size:12px; font-family: Segoe UI'
        });
        element.appendChild(tooltip);
    } else {
        tooltip.innerHTML = text;
        tooltip.style.top = (y + 15).toString() + 'px';
        tooltip.style.left = (x + 15).toString() + 'px';
    }
    if(text === heatmap.titleSettings.text) {
        tooltip.style.width = (x + 15) + size.width + 7 > heatmap.availableSize.width ?
         ( heatmap.availableSize.width - (x + 15) ).toString() + 'px' : '';
    } else {
    tooltip.style.left =  (x + 15) + size.width + 7 > heatmap.availableSize.width ?
     (heatmap.availableSize.width - (size.width +7)).toString() + 'px' : x.toString() + 'px';
    tooltip.style.top =  (y + 15) + size.height + 6 > heatmap.availableSize.height ?
     (initialClip.height + initialClip.y - (size.height + 6) + 5).toString() + 'px': tooltip.style.top; // 6 and 7 are padding and border width
    }
    if (isTouch) {
        setTimeout(() => { removeElement(id); }, 1500);
    }
}

/** @private */
export function removeElement(id: string): void {
    let element: Element = getElement(id);
    if (element) {
        remove(element);
    }
}

/** @private */
export function getElement(id: string): Element {
    return document.getElementById(id);
}

/** @private */
export function increaseDateTimeInterval(value: number, interval: number, intervalType: string, increment: number): Date {
    let result: Date = new Date(value);
    interval = Math.ceil(interval * increment);
    switch (intervalType) {
        case 'Years':
            result.setFullYear(result.getFullYear() + interval);
            break;

        case 'Months':
            result.setMonth(result.getMonth() + interval);
            break;

        case 'Days':
            result.setDate(result.getDate() + interval);
            break;
        case 'Hours':
            result.setHours(result.getHours() + interval);
            break;
        case 'Minutes':
            result.setMinutes(result.getMinutes() + interval);
            break;
    }
    return result;
}

/* private */
export class CanvasTooltip {
    public text: string;
    public region: Rect = new Rect(0, 0, 0, 0);
    constructor(text: string, rect: Rect) {
        this.text = text;
        this.region = rect;
    }
}

/* private*/
/* Method to get the tool tip text in canvas based on region. */
export function getTooltipText(tooltipCollection: CanvasTooltip[], xPosition: number, yPosition: number): string {
    let length: number = tooltipCollection.length;
    let tooltip: CanvasTooltip;
    let region: Rect;
    let text: string;
    for (let i: number = 0; i < length; i++) {
        tooltip = tooltipCollection[i];
        region = tooltip.region;
        if (xPosition >= region.x && xPosition <= (region.x + region.width) && yPosition >= region.y && yPosition <= (region.y + region.height)) {
            text = tooltip.text;
            break;
        }
    }
    return text;
}
/**
 * @private
 */
export class PaletterColor {
    public isCompact: boolean;
    public offsets: PaletteCollectionModel[];
}

/**
 * @private
 */
export class GradientPointer {
    public pathX1: number;
    public pathY1: number;
    public pathX2: number;
    public pathY2: number;
    public pathX3: number;
    public pathY3: number;
    constructor(pathX1: number, pathY1: number, pathX2: number, pathY2: number, pathX3: number, pathY3: number) {
        this.pathX1 = pathX1;
        this.pathY1 = pathY1;
        this.pathX2 = pathX2;
        this.pathY2 = pathY2;
        this.pathX3 = pathX3;
        this.pathY3 = pathY3;
    }
}

/**
 * Class to define currentRect private property.
 * @private
 */
export class CurrentLegendRect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public label: string;
    public id: string;
    constructor(x: number, y: number, width: number, height: number, label: string, id: string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.label = label;
        this.id = id;
    }
}

/** @private */
export function colorNameToHex(color: string): string {
    let element: HTMLElement;
    color = color === 'transparent' ? 'white' : color;
    element = document.getElementById('heatmapmeasuretext');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    let exp: RegExp = /^(rgb|hsl)(a?)[(]\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*,\s*([\d.]+\s*%?)\s*(?:,\s*([\d.]+)\s*)?[)]$/;
    let isRGBValue: RegExpExecArray = exp.exec(color);
    return convertToHexCode(
        new RgbColor(parseInt(isRGBValue[3], 10), parseInt(isRGBValue[4], 10), parseInt(isRGBValue[5], 10))
    );
}

/** @private */
export function convertToHexCode(value: RgbColor): string {
    return '#' + componentToHex(value.R) + componentToHex(value.G) + componentToHex(value.B);
}

/** @private */
export function componentToHex(value: number): string {
    let hex: string = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

/** @private */
export function convertHexToColor(hex: string): RgbColor {
    let result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new RgbColor(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new RgbColor(255, 255, 255);
}
