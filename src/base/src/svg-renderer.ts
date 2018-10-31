/**
 * To import utils
 */
import {isNullOrUndefined, } from './util';
import {LineAttributes, PathAttributes, CircleAttributes, SVGAttributes, EllipseAttributes, PolylineAttributes,
    BaseAttibutes, TextAttributes, ImageAttributes, SVGCanvasAttributes, PatternAttributes,
    LinearGradient, RadialGradient, RectAttributes, GradientColor } from './svg-canvas-interface';

export class SvgRenderer {
    //Internal Variables 
    private svgLink: string = 'http://www.w3.org/2000/svg';
    private svgObj: Element;
    private rootId: string;
    /* Properties */

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

    /* End-Properties */

    constructor(rootID: string) {
        this.rootId = rootID;
    }

    // method to get the attributes value
    /* tslint:disable */ 
    private getOptionValue<T>(options: any, key: string): T {
        return options[key] as T;
    } /* tslint:enable */

    /**
     * To create a Html5 SVG element
     * @param {SVGAttributes} options - Options to create SVG
     * @return {Element}
     */
    public createSvg(options: SVGAttributes): Element {
        if (isNullOrUndefined(options.id)) {
            options.id = this.rootId + '_svg';
        }
        this.svgObj = document.getElementById(options.id);
        if (isNullOrUndefined(document.getElementById(options.id))) {
            this.svgObj = document.createElementNS(this.svgLink, 'svg');
        }
        this.svgObj = this.setElementAttributes(options as SVGCanvasAttributes, this.svgObj);
        this.setSVGSize(options.width, options.height);
        return this.svgObj;
    }

    // method to set the height and width for the SVG element
    private setSVGSize(width: number, height: number): void {
        let element: Element = document.getElementById(this.rootId);
        let size: ClientRect = !isNullOrUndefined(element) ? element.getBoundingClientRect() : null;
        if (isNullOrUndefined(this.width) || this.width <= 0) {
            this.svgObj.setAttribute('width', width ? width.toString() : size.width.toString());
        } else {
            this.svgObj.setAttribute('width', this.width.toString());
        }

        if (isNullOrUndefined(this.height) || this.height <= 0) {
            this.svgObj.setAttribute('height', height ? height.toString() : '450');
        } else {
            this.svgObj.setAttribute('height', this.height.toString());
        }
    }

    /**
     * To draw a path
     * @param {PathAttributes} options - Options to draw a path in SVG
     * @return {Element}
     */
    public drawPath(options: PathAttributes): Element {
        let path: Element = document.getElementById(options.id);
        if (path === null) {
            path = document.createElementNS(this.svgLink, 'path');
        }
        path = this.setElementAttributes(options as SVGCanvasAttributes, path);
        return path;
    }

    /**
     * To draw a line
     * @param {LineAttributes} options - Options to draw a line in SVG
     * @return {Element}
     */
    public drawLine(options: LineAttributes): Element {
        let line: Element = document.getElementById(options.id);
        if (line === null) {
            line = document.createElementNS(this.svgLink, 'line');
        }
        line = this.setElementAttributes(options as SVGCanvasAttributes, line);
        return line;
    }

    /**
     * To draw a rectangle
     * @param {BaseAttibutes} options - Required options to draw a rectangle in SVG
     * @return {Element}
     */
    public drawRectangle(options: RectAttributes): Element {
        let rectangle: Element = document.getElementById(options.id);
        if (rectangle === null) {
            rectangle = document.createElementNS(this.svgLink, 'rect');
        }
        rectangle = this.setElementAttributes(options as SVGCanvasAttributes, rectangle);
        return rectangle;
    }

    /**
     * To draw a circle
     * @param {CircleAttributes} options - Required options to draw a circle in SVG
     * @return {Element}
     */
    public drawCircle(options: CircleAttributes): Element {
        let circle: Element = document.getElementById(options.id);
        if (circle === null) {
            circle = document.createElementNS(this.svgLink, 'circle');
        }
        circle = this.setElementAttributes(options as SVGCanvasAttributes, circle);
        return circle;
    }

    /**
     * To draw a polyline
     * @param {PolylineAttributes} options - Options required to draw a polyline
     * @return {Element}
     */
    public drawPolyline(options: PolylineAttributes): Element {
        let polyline: Element = document.getElementById(options.id);
        if (polyline === null) {
            polyline = document.createElementNS(this.svgLink, 'polyline');
        }
        polyline = this.setElementAttributes(options as SVGCanvasAttributes, polyline);
        return polyline;
    }

    /**
     * To draw an ellipse
     * @param {EllipseAttributes} options - Options required to draw an ellipse
     * @return {Element}
     */
    public drawEllipse(options: EllipseAttributes): Element {
        let ellipse: Element = document.getElementById(options.id);
        if (ellipse === null) {
            ellipse = document.createElementNS(this.svgLink, 'ellipse');
        }
        ellipse = this.setElementAttributes(options as SVGCanvasAttributes, ellipse);
        return ellipse;
    }

    /**
     * To draw a polygon
     * @param {PolylineAttributes} options - Options needed to draw a polygon in SVG
     * @return {Element}
     */
    public drawPolygon(options: PolylineAttributes): Element {
        let polygon: Element = document.getElementById(options.id);
        if (polygon === null) {
            polygon = document.createElementNS(this.svgLink, 'polygon');
        }
        polygon = this.setElementAttributes(options as SVGCanvasAttributes, polygon);
        return polygon;
    }

    /**
     * To draw an image 
     * @param {ImageAttributes} options - Required options to draw an image in SVG
     * @return {Element}
     */
    public drawImage(options: ImageAttributes): Element {
        let img: Element = document.createElementNS(this.svgLink, 'image');
        img.setAttributeNS(null, 'height', options.height.toString());
        img.setAttributeNS(null, 'width', options.width.toString());
        img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', options.href);
        img.setAttributeNS(null, 'x', options.x.toString());
        img.setAttributeNS(null, 'y', options.y.toString());
        img.setAttributeNS(null, 'id', options.id);
        img.setAttributeNS(null, 'visibility', options.visibility);
        if (!isNullOrUndefined(this.getOptionValue<string>(options, 'clip-path'))) {
            img.setAttributeNS(null, 'clip-path', this.getOptionValue<string>(options, 'clip-path'));
        }
        if (!isNullOrUndefined(options.preserveAspectRatio)) {
            img.setAttributeNS(null, 'preserveAspectRatio', options.preserveAspectRatio);
        }
        return img;
    }

    /**
     * To draw a text
     * @param {TextAttributes} options - Options needed to draw a text in SVG
     * @return {Element}
     */
    public createText(options: TextAttributes, label: string): Element {
        let text: Element = document.createElementNS(this.svgLink, 'text');
        text = this.setElementAttributes(options as SVGCanvasAttributes, text);
        if (!isNullOrUndefined(label)) {
            text.textContent = label;
        }
        return text;
    }

    /**
     * To create a tSpan
     * @param {TextAttributes} options - Options to create tSpan
     * @param {string} label - The text content which is to be rendered in the tSpan
     * @return {Element}
     */
    public createTSpan(options: TextAttributes, label: string): Element {
        let tSpan: Element = document.createElementNS(this.svgLink, 'tspan');
        tSpan = this.setElementAttributes(options as SVGCanvasAttributes, tSpan);
        if (!isNullOrUndefined(label)) {
            tSpan.textContent = label;
        }
        return tSpan;
    }

    /**
     * To create a title
     * @param {string} text - The text content which is to be rendered in the title
     * @return {Element}
     */
    public createTitle(text: string): Element {
        let title: Element = document.createElementNS(this.svgLink, 'title');
        title.textContent = text;
        return title;
    }

    /**
     * To create defs element in SVG
     * @return {Element}
     */
    public createDefs(): Element {
        let defs: Element = document.createElementNS(this.svgLink, 'defs');
        return defs;
    }

    /**
     * To create clip path in SVG
     * @param {BaseAttibutes} options - Options needed to create clip path
     * @return {Element}
     */
    public createClipPath(options: BaseAttibutes): Element {
        let clipPath: Element = document.createElementNS(this.svgLink, 'clipPath');
        clipPath = this.setElementAttributes(options as SVGCanvasAttributes, clipPath);
        return clipPath;
    }

    /**
     * To create foreign object in SVG
     * @param {BaseAttibutes} options - Options needed to create foreign object
     * @return {Element}
     */
    public createForeignObject(options: BaseAttibutes): Element {
        let foreignObject: Element = document.createElementNS(this.svgLink, 'foreignObject');
        foreignObject = this.setElementAttributes(options as SVGCanvasAttributes, foreignObject);
        return foreignObject;
    }

    /**
     * To create group element in SVG
     * @param {BaseAttibutes} options - Options needed to create group
     * @return {Element}
     */
    public createGroup(options: BaseAttibutes): Element {
        let group: Element = document.createElementNS(this.svgLink, 'g');
        group = this.setElementAttributes(options as SVGCanvasAttributes, group);
        return group;
    }

    /**
     * To create pattern in SVG
     * @param {PatternAttributes} options - Required options to create pattern in SVG
     * @param {string} type - Specifies the name of the pattern
     * @return {Element}
     */
    public createPattern(options: PatternAttributes, element: string): Element {
        let pattern: Element = document.createElementNS(this.svgLink, element);
        pattern = this.setElementAttributes(options as SVGCanvasAttributes, pattern);
        return pattern;
    }

    /**
     * To create radial gradient in SVG
     * @param {string[]} colors - Specifies the colors required to create radial gradient
     * @param {string[]} colorStop - Specifies the colorstop required to create radial gradient
     * @param {string} name - Specifies the name of the gradient
     * @param {RadialGradient} options - value for radial gradient
     * @return {string}
     */
    public createRadialGradient(colors: GradientColor[], name: string, options: RadialGradient): string {
        let colorName: string;
        if (!isNullOrUndefined(colors[0].colorStop)) {
            let newOptions: RadialGradient = {
                'id': this.rootId + '_' + name + 'radialGradient',
                'cx': options.cx + '%',
                'cy': options.cy + '%',
                'r': options.r + '%',
                'fx': options.fx + '%',
                'fy': options.fy + '%'
            };
            this.drawGradient('radialGradient', newOptions, colors);
            colorName = 'url(#' + this.rootId + '_' + name + 'radialGradient)';
        } else {
            colorName = colors[0].color.toString();
        }
        return colorName;
    }

    /**
     * To create linear gradient in SVG
     * @param {string[]} colors - Array of string specifies the values for color
     * @param {string[]} colors - Array of string specifies the values for colorStop
     * @param {string} name - Specifies the name of the gradient
     * @param {LinearGradient} options - Specifies the options for gradient
     * @return {string}
     */
    public createLinearGradient(colors: GradientColor[], name: string, options: LinearGradient): string {
        let colorName: string;
        if (!isNullOrUndefined(colors[0].colorStop)) {
            let newOptions: LinearGradient = {
                'id': this.rootId + '_' + name + 'linearGradient',
                'x1': options.x1 + '%',
                'y1': options.y1 + '%',
                'x2': options.x2 + '%',
                'y2': options.y2 + '%'
            };
            this.drawGradient('linearGradient', newOptions, colors);
            colorName = 'url(#' + this.rootId + '_' + name + 'linearGradient)';
        } else {
            colorName = colors[0].color.toString();
        }
        return colorName;
    }

    /**
     * To render the gradient element in SVG
     * @param {string} gradientType - Specifies the type of the gradient
     * @param {RadialGradient | LinearGradient} options - Options required to render a gradient
     * @param {string[]} colors - Array of string specifies the values for color
     * @param {string[]} colorStop - Array of string specifies the values for colorStop
     * @return {Element}
     */
    public drawGradient(gradientType: string, options: RadialGradient | LinearGradient, colors: GradientColor[]): Element {
        let defs: Element = this.createDefs();
        let gradient: Element = document.createElementNS(this.svgLink, gradientType);
        gradient = this.setElementAttributes(options as SVGCanvasAttributes, gradient);
        for (let i: number = 0; i < colors.length; i++) {
            let stop: Element = document.createElementNS(this.svgLink, 'stop');
            stop.setAttribute('offset', colors[i].colorStop);
            stop.setAttribute('stop-color', colors[i].color);
            stop.setAttribute('stop-opacity', '1');
            gradient.appendChild(stop);
        }
        defs.appendChild(gradient);
        return defs;
    }

    /**
     * To render a clip path
     * @param {BaseAttibutes} options - Options required to render a clip path
     * @return {Element}
     */
    public drawClipPath(options: BaseAttibutes): Element {
        let defs: Element = this.createDefs();
        let clipPath: Element = this.createClipPath({ 'id': options.id });
        let rect: Element = this.drawRectangle(options);
        clipPath.appendChild(rect);
        defs.appendChild(clipPath);
        return defs;
    }

    /**
     * To create circular clip path in SVG
     * @param {CircleAttributes} options - Options required to create circular clip path
     * @return {Element}
     */
    public drawCircularClipPath(options: CircleAttributes): Element {
        let defs: Element = this.createDefs();
        let clipPath: Element = this.createClipPath({ 'id': options.id });
        let circle: Element = this.drawCircle(options);
        clipPath.appendChild(circle);
        defs.appendChild(clipPath);
        return defs;
    }

    /**
     * To set the attributes to the element
     * @param {SVGCanvasAttributes} options - Attributes to set for the element
     * @param {Element} element - The element to which the attributes need to be set
     * @return {Element}
     */
    public setElementAttributes(options: SVGCanvasAttributes, element: Element): Element {
        let keys: string[] = Object.keys(options);
        for (let i: number = 0; i < keys.length; i++) {
            element.setAttribute(keys[i], options[keys[i]]);
        }
        return element;
    }

}
