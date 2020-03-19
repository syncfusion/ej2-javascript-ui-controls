import { Animation, Browser, ChildProperty, Complex, Component, Event, NotifyPropertyChanges, Property, compile, createElement, extend, isBlazor, isNullOrUndefined, merge, remove, resetBlazorTemplate, updateBlazorTemplate } from '@syncfusion/ej2-base';

/**
 * To import utils
 */
class SvgRenderer {
    /* End-Properties */
    constructor(rootID) {
        //Internal Variables 
        this.svgLink = 'http://www.w3.org/2000/svg';
        this.rootId = rootID;
    }
    // method to get the attributes value
    /* tslint:disable */
    getOptionValue(options, key) {
        return options[key];
    } /* tslint:enable */
    /**
     * To create a Html5 SVG element
     * @param {SVGAttributes} options - Options to create SVG
     * @return {Element}
     */
    createSvg(options) {
        if (isNullOrUndefined(options.id)) {
            options.id = this.rootId + '_svg';
        }
        this.svgObj = document.getElementById(options.id);
        if (isNullOrUndefined(document.getElementById(options.id))) {
            this.svgObj = document.createElementNS(this.svgLink, 'svg');
        }
        this.svgObj = this.setElementAttributes(options, this.svgObj);
        this.setSVGSize(options.width, options.height);
        return this.svgObj;
    }
    // method to set the height and width for the SVG element
    setSVGSize(width, height) {
        let element = document.getElementById(this.rootId);
        let size = !isNullOrUndefined(element) ? element.getBoundingClientRect() : null;
        if (isNullOrUndefined(this.width) || this.width <= 0) {
            this.svgObj.setAttribute('width', width ? width.toString() : size.width.toString());
        }
        else {
            this.svgObj.setAttribute('width', this.width.toString());
        }
        if (isNullOrUndefined(this.height) || this.height <= 0) {
            this.svgObj.setAttribute('height', height ? height.toString() : '450');
        }
        else {
            this.svgObj.setAttribute('height', this.height.toString());
        }
    }
    /**
     * To draw a path
     * @param {PathAttributes} options - Options to draw a path in SVG
     * @param {Int32Array} canvasTranslate - Used as dummy variable for canvas rendering
     * @return {Element}
     */
    drawPath(options, canvasTranslate) {
        let path = document.getElementById(options.id);
        if (path === null) {
            path = document.createElementNS(this.svgLink, 'path');
        }
        path = this.setElementAttributes(options, path);
        return path;
    }
    /**
     * To draw a line
     * @param {LineAttributes} options - Options to draw a line in SVG
     * @return {Element}
     */
    drawLine(options) {
        let line = document.getElementById(options.id);
        if (line === null) {
            line = document.createElementNS(this.svgLink, 'line');
        }
        line = this.setElementAttributes(options, line);
        return line;
    }
    /**
     * To draw a rectangle
     * @param {BaseAttibutes} options - Required options to draw a rectangle in SVG
     * @return {Element}
     */
    drawRectangle(options, canvasTranslate) {
        let rectangle = document.getElementById(options.id);
        if (rectangle === null) {
            rectangle = document.createElementNS(this.svgLink, 'rect');
        }
        rectangle = this.setElementAttributes(options, rectangle);
        return rectangle;
    }
    /**
     * To draw a circle
     * @param {CircleAttributes} options - Required options to draw a circle in SVG
     * @return {Element}
     */
    drawCircle(options) {
        let circle = document.getElementById(options.id);
        if (circle === null) {
            circle = document.createElementNS(this.svgLink, 'circle');
        }
        circle = this.setElementAttributes(options, circle);
        return circle;
    }
    /**
     * To draw a polyline
     * @param {PolylineAttributes} options - Options required to draw a polyline
     * @return {Element}
     */
    drawPolyline(options) {
        let polyline = document.getElementById(options.id);
        if (polyline === null) {
            polyline = document.createElementNS(this.svgLink, 'polyline');
        }
        polyline = this.setElementAttributes(options, polyline);
        return polyline;
    }
    /**
     * To draw an ellipse
     * @param {EllipseAttributes} options - Options required to draw an ellipse
     * @return {Element}
     */
    drawEllipse(options) {
        let ellipse = document.getElementById(options.id);
        if (ellipse === null) {
            ellipse = document.createElementNS(this.svgLink, 'ellipse');
        }
        ellipse = this.setElementAttributes(options, ellipse);
        return ellipse;
    }
    /**
     * To draw a polygon
     * @param {PolylineAttributes} options - Options needed to draw a polygon in SVG
     * @return {Element}
     */
    drawPolygon(options) {
        let polygon = document.getElementById(options.id);
        if (polygon === null) {
            polygon = document.createElementNS(this.svgLink, 'polygon');
        }
        polygon = this.setElementAttributes(options, polygon);
        return polygon;
    }
    /**
     * To draw an image
     * @param {ImageAttributes} options - Required options to draw an image in SVG
     * @return {Element}
     */
    drawImage(options) {
        let img = document.createElementNS(this.svgLink, 'image');
        img.setAttributeNS(null, 'height', options.height.toString());
        img.setAttributeNS(null, 'width', options.width.toString());
        img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', options.href);
        img.setAttributeNS(null, 'x', options.x.toString());
        img.setAttributeNS(null, 'y', options.y.toString());
        img.setAttributeNS(null, 'id', options.id);
        img.setAttributeNS(null, 'visibility', options.visibility);
        if (!isNullOrUndefined(this.getOptionValue(options, 'clip-path'))) {
            img.setAttributeNS(null, 'clip-path', this.getOptionValue(options, 'clip-path'));
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
    createText(options, label, transX, transY) {
        let text = document.createElementNS(this.svgLink, 'text');
        text = this.setElementAttributes(options, text);
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
    createTSpan(options, label) {
        let tSpan = document.createElementNS(this.svgLink, 'tspan');
        tSpan = this.setElementAttributes(options, tSpan);
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
    createTitle(text) {
        let title = document.createElementNS(this.svgLink, 'title');
        title.textContent = text;
        return title;
    }
    /**
     * To create defs element in SVG
     * @return {Element}
     */
    createDefs() {
        let defs = document.createElementNS(this.svgLink, 'defs');
        return defs;
    }
    /**
     * To create clip path in SVG
     * @param {BaseAttibutes} options - Options needed to create clip path
     * @return {Element}
     */
    createClipPath(options) {
        let clipPath = document.createElementNS(this.svgLink, 'clipPath');
        clipPath = this.setElementAttributes(options, clipPath);
        return clipPath;
    }
    /**
     * To create foreign object in SVG
     * @param {BaseAttibutes} options - Options needed to create foreign object
     * @return {Element}
     */
    createForeignObject(options) {
        let foreignObject = document.createElementNS(this.svgLink, 'foreignObject');
        foreignObject = this.setElementAttributes(options, foreignObject);
        return foreignObject;
    }
    /**
     * To create group element in SVG
     * @param {BaseAttibutes} options - Options needed to create group
     * @return {Element}
     */
    createGroup(options) {
        let group = document.createElementNS(this.svgLink, 'g');
        group = this.setElementAttributes(options, group);
        return group;
    }
    /**
     * To create pattern in SVG
     * @param {PatternAttributes} options - Required options to create pattern in SVG
     * @param {string} type - Specifies the name of the pattern
     * @return {Element}
     */
    createPattern(options, element) {
        let pattern = document.createElementNS(this.svgLink, element);
        pattern = this.setElementAttributes(options, pattern);
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
    createRadialGradient(colors, name, options) {
        let colorName;
        if (!isNullOrUndefined(colors[0].colorStop)) {
            let newOptions = {
                'id': this.rootId + '_' + name + 'radialGradient',
                'cx': options.cx + '%',
                'cy': options.cy + '%',
                'r': options.r + '%',
                'fx': options.fx + '%',
                'fy': options.fy + '%'
            };
            this.drawGradient('radialGradient', newOptions, colors);
            colorName = 'url(#' + this.rootId + '_' + name + 'radialGradient)';
        }
        else {
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
    createLinearGradient(colors, name, options) {
        let colorName;
        if (!isNullOrUndefined(colors[0].colorStop)) {
            let newOptions = {
                'id': this.rootId + '_' + name + 'linearGradient',
                'x1': options.x1 + '%',
                'y1': options.y1 + '%',
                'x2': options.x2 + '%',
                'y2': options.y2 + '%'
            };
            this.drawGradient('linearGradient', newOptions, colors);
            colorName = 'url(#' + this.rootId + '_' + name + 'linearGradient)';
        }
        else {
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
    drawGradient(gradientType, options, colors) {
        let defs = this.createDefs();
        let gradient = document.createElementNS(this.svgLink, gradientType);
        gradient = this.setElementAttributes(options, gradient);
        for (let i = 0; i < colors.length; i++) {
            let stop = document.createElementNS(this.svgLink, 'stop');
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
    drawClipPath(options) {
        let defs = this.createDefs();
        let clipPath = this.createClipPath({ 'id': options.id });
        options.id = options.id + '_Rect';
        let rect = this.drawRectangle(options);
        clipPath.appendChild(rect);
        defs.appendChild(clipPath);
        return defs;
    }
    /**
     * To create circular clip path in SVG
     * @param {CircleAttributes} options - Options required to create circular clip path
     * @return {Element}
     */
    drawCircularClipPath(options) {
        let defs = this.createDefs();
        let clipPath = this.createClipPath({ 'id': options.id });
        options.id = options.id + '_Circle';
        let circle = this.drawCircle(options);
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
    setElementAttributes(options, element) {
        let keys = Object.keys(options);
        for (let i = 0; i < keys.length; i++) {
            element.setAttribute(keys[i], options[keys[i]]);
        }
        return element;
    }
    /**
     * To create a Html5 canvas element
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {BaseAttibutes} options - Options to create canvas
     * @return {HTMLCanvasElement}
     */
    createCanvas(options) {
        return null;
    }
}

/**
 * To import utils
 */
/**
 * @private
 */
class CanvasRenderer {
    /* End-Properties */
    constructor(rootID) {
        this.rootId = rootID;
    }
    // method to get the attributes value
    /* tslint:disable */
    getOptionValue(options, key) {
        return options[key];
    }
    /* tslint:enable */
    /**
     * To create a Html5 canvas element
     * @param {BaseAttibutes} options - Options to create canvas
     * @return {HTMLCanvasElement}
     */
    createCanvas(options) {
        let canvasObj = document.createElement('canvas');
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
    setCanvasSize(width, height) {
        let element = document.getElementById(this.rootId);
        let size = !isNullOrUndefined(element) ? element.getBoundingClientRect() : null;
        if (isNullOrUndefined(this.width)) {
            this.canvasObj.setAttribute('width', width ? width.toString() : size.width.toString());
        }
        else {
            this.canvasObj.setAttribute('width', this.width.toString());
        }
        if (isNullOrUndefined(this.height)) {
            this.canvasObj.setAttribute('height', height ? height.toString() : '450');
        }
        else {
            this.canvasObj.setAttribute('height', this.height.toString());
        }
    }
    // To set the values to the attributes
    setAttributes(options) {
        this.ctx.lineWidth = this.getOptionValue(options, 'stroke-width');
        let dashArray = this.getOptionValue(options, 'stroke-dasharray');
        if (!isNullOrUndefined(dashArray)) {
            let dashArrayString = dashArray.split(',');
            this.ctx.setLineDash([parseInt(dashArrayString[0], 10), parseInt(dashArrayString[1], 10)]);
        }
        this.ctx.strokeStyle = this.getOptionValue(options, 'stroke');
    }
    /**
     * To draw a line
     * @param {LineAttributes} options - required options to draw a line on the canvas
     * @return {void}
     */
    drawLine(options) {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.lineWidth = this.getOptionValue(options, 'stroke-width');
        this.ctx.strokeStyle = options.stroke;
        this.ctx.moveTo(options.x1, options.y1);
        this.ctx.lineTo(options.x2, options.y2);
        this.ctx.stroke();
        this.ctx.restore();
    }
    /**
     * To draw a rectangle
     * @param {RectAttributes} options - required options to draw a rectangle on the canvas
     * @return {void}
     */
    drawRectangle(options, canvasTranslate) {
        let canvasCtx = this.ctx;
        let cornerRadius = options.rx;
        this.ctx.save();
        this.ctx.beginPath();
        if (canvasTranslate) {
            this.ctx.translate(canvasTranslate[0], canvasTranslate[1]);
        }
        this.ctx.globalAlpha = this.getOptionValue(options, 'opacity');
        this.setAttributes(options);
        this.ctx.rect(options.x, options.y, options.width, options.height);
        if (cornerRadius !== null && cornerRadius >= 0) {
            this.drawCornerRadius(options);
        }
        else {
            if (options.fill === 'none') {
                options.fill = 'transparent';
            }
            this.ctx.fillStyle = options.fill;
            this.ctx.fillRect(options.x, options.y, options.width, options.height);
            this.ctx.stroke();
        }
        this.ctx.restore();
        this.ctx = canvasCtx;
        return (this.canvasObj);
    }
    // To draw the corner of a rectangle
    drawCornerRadius(options) {
        let cornerRadius = options.rx;
        let x = options.x;
        let y = options.y;
        let width = options.width;
        let height = options.height;
        if (options.fill === 'none') {
            options.fill = 'transparent';
        }
        this.ctx.fillStyle = options.fill;
        if (width < 2 * cornerRadius) {
            cornerRadius = width / 2;
        }
        if (height < 2 * cornerRadius) {
            cornerRadius = height / 2;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x + width - cornerRadius, y);
        this.ctx.arcTo(x + width, y, x + width, y + height, cornerRadius);
        this.ctx.arcTo(x + width, y + height, x, y + height, cornerRadius);
        this.ctx.arcTo(x, y + height, x, y, cornerRadius);
        this.ctx.arcTo(x, y, x + width, y, cornerRadius);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();
    }
    /**
     * To draw a path on the canvas
     * @param {PathAttributes} options - options needed to draw path
     * @param {Int32Array} canvasTranslate - Array of numbers to translate the canvas
     * @return {void}
     */
    drawPath(options, canvasTranslate) {
        let path = options.d;
        let dataSplit = path.split(' ');
        let borderWidth = this.getOptionValue(options, 'stroke-width');
        let canvasCtx = this.ctx;
        let flag = true;
        this.ctx.save();
        this.ctx.beginPath();
        if (canvasTranslate) {
            this.ctx.translate(canvasTranslate[0], canvasTranslate[1]);
        }
        this.ctx.globalAlpha = options.opacity ? options.opacity : this.getOptionValue(options, 'fill-opacity');
        this.setAttributes(options);
        for (let i = 0; i < dataSplit.length; i = i + 3) {
            let x1 = parseFloat(dataSplit[i + 1]);
            let y1 = parseFloat(dataSplit[i + 2]);
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
                case 'Q':
                    let q1 = parseFloat(dataSplit[i + 3]);
                    let q2 = parseFloat(dataSplit[i + 4]);
                    this.ctx.quadraticCurveTo(x1, y1, q1, q2);
                    i = i + 2;
                    break;
                case 'C':
                    let c1 = parseFloat(dataSplit[i + 3]);
                    let c2 = parseFloat(dataSplit[i + 4]);
                    let c3 = parseFloat(dataSplit[i + 5]);
                    let c4 = parseFloat(dataSplit[i + 6]);
                    this.ctx.bezierCurveTo(x1, y1, c1, c2, c3, c4);
                    i = i + 4;
                    break;
                case 'A':
                    if (!options.innerR) {
                        if (options.cx) {
                            this.ctx.arc(options.cx, options.cy, options.radius, 0, 2 * Math.PI, options.counterClockWise);
                        }
                        else {
                            this.ctx.moveTo(options.x, options.y);
                            this.ctx.arc(options.x, options.y, options.radius, options.start, options.end, options.counterClockWise);
                            this.ctx.lineTo(options.x, options.y);
                        }
                    }
                    else if (flag) {
                        this.ctx.arc(options.x, options.y, options.radius, options.start, options.end, options.counterClockWise);
                        this.ctx.arc(options.x, options.y, options.innerR, options.end, options.start, !options.counterClockWise);
                        flag = false;
                    }
                    i = i + 5;
                    break;
                case 'z':
                case 'Z':
                    this.ctx.closePath();
                    //since for loop is incremented by 3, to get next value after 'z' i is decremented for 2.
                    i = i - 2;
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
        return this.canvasObj;
    }
    /**
     * To draw a text
     * @param {TextAttributes} options - options required to draw text
     * @param {string} label - Specifies the text which has to be drawn on the canvas
     * @return {void}
     */
    createText(options, label, transX, transY) {
        let fontWeight = this.getOptionValue(options, 'font-weight');
        if (!isNullOrUndefined(fontWeight) && fontWeight.toLowerCase() === 'regular') {
            fontWeight = 'normal';
        }
        let fontSize = this.getOptionValue(options, 'font-size');
        let fontFamily = this.getOptionValue(options, 'font-family');
        let fontStyle = this.getOptionValue(options, 'font-style').toLowerCase();
        let font = (fontStyle + ' ' + fontWeight + ' ' + fontSize + ' ' + fontFamily);
        let anchor = this.getOptionValue(options, 'text-anchor');
        let opacity = options.opacity !== undefined ? options.opacity : 1;
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
        let txtlngth = 0;
        this.ctx.translate(options.x + (txtlngth / 2) + (transX ? transX : 0), options.y + (transY ? transY : 0));
        this.ctx.rotate(options.labelRotation * Math.PI / 180);
        this.ctx.fillText(label, 0, 0);
        this.ctx.restore();
        return this.canvasObj;
    }
    /**
     * To draw circle on the canvas
     * @param {CircleAttributes} options - required options to draw the circle
     * @return {void}
     */
    drawCircle(options, canvasTranslate) {
        let canvasCtx = this.ctx;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(options.cx, options.cy, options.r, 0, 2 * Math.PI);
        this.ctx.fillStyle = options.fill;
        this.ctx.globalAlpha = options.opacity;
        this.ctx.fill();
        if (canvasTranslate) {
            this.ctx.translate(canvasTranslate[0], canvasTranslate[1]);
        }
        this.setAttributes(options);
        this.ctx.stroke();
        this.ctx.restore();
        this.ctx = canvasCtx;
        return this.canvasObj;
    }
    /**
     * To draw polyline
     * @param {PolylineAttributes} options - options needed to draw polyline
     * @return {void}
     */
    drawPolyline(options) {
        this.ctx.save();
        this.ctx.beginPath();
        let points = options.points.split(' ');
        for (let i = 0; i < points.length - 1; i++) {
            let point = points[i].split(',');
            let x = parseFloat(point[0]);
            let y = parseFloat(point[1]);
            if (i === 0) {
                this.ctx.moveTo(x, y);
            }
            else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.lineWidth = this.getOptionValue(options, 'stroke-width');
        this.ctx.strokeStyle = options.stroke;
        this.ctx.stroke();
        this.ctx.restore();
    }
    /**
     * To draw an ellipse on the canvas
     * @param {EllipseAttributes} options - options needed to draw ellipse
     * @return {void}
     */
    drawEllipse(options, canvasTranslate) {
        let canvasCtx = this.ctx;
        let circumference = Math.max(options.rx, options.ry);
        let scaleX = options.rx / circumference;
        let scaleY = options.ry / circumference;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(options.cx, options.cy);
        if (canvasTranslate) {
            this.ctx.translate(canvasTranslate[0], canvasTranslate[1]);
        }
        this.ctx.save();
        this.ctx.scale(scaleX, scaleY);
        this.ctx.arc(0, 0, circumference, 0, 2 * Math.PI, false);
        this.ctx.fillStyle = options.fill;
        this.ctx.fill();
        this.ctx.restore();
        this.ctx.lineWidth = this.getOptionValue(options, 'stroke-width');
        this.ctx.strokeStyle = options.stroke;
        this.ctx.stroke();
        this.ctx.restore();
        this.ctx = canvasCtx;
    }
    /**
     * To draw an image
     * @param {ImageAttributes} options - options required to draw an image on the canvas
     * @return {void}
     */
    drawImage(options) {
        this.ctx.save();
        let imageObj = new Image();
        if (!isNullOrUndefined(options.href)) {
            imageObj.src = options.href;
            this.ctx.drawImage(imageObj, options.x, options.y, options.width, options.height);
        }
        this.ctx.restore();
    }
    /**
     * To create a linear gradient
     * @param {string[]} colors - Specifies the colors required to create linear gradient
     * @return {string}
     */
    createLinearGradient(colors) {
        let myGradient;
        if (!isNullOrUndefined(colors[0].colorStop)) {
            myGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvasObj.height);
        }
        let color = this.setGradientValues(colors, myGradient);
        return color;
    }
    /**
     * To create a radial gradient
     * @param {string[]} colors - Specifies the colors required to create linear gradient
     * @return {string}
     */
    createRadialGradient(colors) {
        let myGradient;
        if (!isNullOrUndefined(colors[0].colorStop)) {
            myGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.canvasObj.height);
        }
        let colorName = this.setGradientValues(colors, myGradient);
        return colorName;
    }
    // To set the gradient values
    setGradientValues(colors, myGradient) {
        let colorName;
        if (!isNullOrUndefined(colors[0].colorStop)) {
            for (let i = 0; i <= colors.length - 1; i++) {
                let color = colors[i].color;
                let newColorStop = (colors[i].colorStop).slice(0, -1);
                let stopColor = parseInt(newColorStop, 10) / 100;
                myGradient.addColorStop(stopColor, color);
            }
            colorName = myGradient.toString();
        }
        else {
            colorName = colors[0].color.toString();
        }
        return colorName;
    }
    /**
     * To set the attributes to the element
     * @param {SVGCanvasAttributes} options - Attributes to set for the element
     * @param {HTMLElement} element - The element to which the attributes need to be set
     * @return {HTMLElement}
     */
    setElementAttributes(options, element) {
        let keys = Object.keys(options);
        let values = Object.keys(options).map((key) => { return options[key]; });
        for (let i = 0; i < keys.length; i++) {
            element.setAttribute(keys[i], values[i]);
        }
        return null;
    }
    /**
     * To update the values of the canvas element attributes
     * @param {SVGCanvasAttributes} options - Specifies the colors required to create gradient
     * @return {void}
     */
    updateCanvasAttributes(options) {
        this.setElementAttributes(options, this.canvasObj);
        let ctx = this.ctx;
        if (!isNullOrUndefined(this.dataUrl)) {
            let img = new Image;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = this.dataUrl;
        }
    }
    /**
     * This method clears the given rectangle region
     * @param options
     */
    clearRect(rect) {
        this.ctx.restore();
        this.ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    }
    ;
    /**
     * For canvas rendering in chart
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {BaseAttibutes} options - Options needed to create group
     * @return {Element}
     */
    createGroup(options) {
        return null;
    }
    /**
     * To render a clip path
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {BaseAttibutes} options - Options required to render a clip path
     * @return {Element}
     */
    drawClipPath(options) {
        return null;
    }
    /**
     * Clip method to perform clip in canvas mode
     * @param options
     */
    canvasClip(options) {
        this.ctx.save();
        this.ctx.fillStyle = 'transparent';
        this.ctx.rect(options.x, options.y, options.width, options.height);
        this.ctx.fill();
        this.ctx.clip();
    }
    /**
     * Tp restore the canvas
     * @param options
     */
    canvasRestore() {
        this.ctx.restore();
    }
    /**
     * To draw a polygon
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {PolylineAttributes} options - Options needed to draw a polygon in SVG
     * @return {Element}
     */
    drawPolygon(options) {
        return null;
    }
    /**
     * To create defs element in SVG
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @return {Element}
     */
    createDefs() {
        return null;
    }
    /**
     * To create clip path in SVG
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {BaseAttibutes} options - Options needed to create clip path
     * @return {Element}
     */
    createClipPath(options) {
        return null;
    }
    /**
     * To create a Html5 SVG element
     * Dummy method for using canvas/svg render in the same variable name in chart control
     * @param {SVGAttributes} options - Options to create SVG
     * @return {Element}
     */
    createSvg(options) {
        return null;
    }
}

/**
 * Base modules
 */

/** @private */
function getTooltipThemeColor(theme) {
    let style;
    switch (theme) {
        case 'Highcontrast':
        case 'HighContrast':
            style = {
                tooltipFill: '#ffffff',
                tooltipBoldLabel: '#000000',
                tooltipLightLabel: '#000000',
                tooltipHeaderLine: '#969696'
            };
            break;
        case 'MaterialDark':
        case 'FabricDark':
        case 'BootstrapDark':
            style = {
                tooltipFill: '#F4F4F4',
                tooltipBoldLabel: '#282727',
                tooltipLightLabel: '#333232',
                tooltipHeaderLine: '#9A9A9A'
            };
            break;
        case 'Bootstrap4':
            style = {
                tooltipFill: 'rgba(0, 0, 0, 0.9)',
                tooltipBoldLabel: 'rgba(255, 255, 255)',
                tooltipLightLabel: 'rgba(255, 255, 255, 0.9)',
                tooltipHeaderLine: 'rgba(255, 255, 255, 0.2)'
            };
            break;
        default:
            style = {
                tooltipFill: 'rgba(0, 8, 22, 0.75)',
                tooltipBoldLabel: '#ffffff',
                tooltipLightLabel: '#dbdbdb',
                tooltipHeaderLine: '#ffffff'
            };
            break;
    }
    return style;
}

/**
 * Function to measure the height and width of the text.
 * @param  {string} text
 * @param  {FontModel} font
 * @param  {string} id
 * @returns no
 * @private
 */
function measureText(text, font) {
    let breakText = text || ''; // For avoid NuLL value
    let htmlObject = document.getElementById('chartmeasuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'chartmeasuretext' });
        document.body.appendChild(htmlObject);
    }
    if (typeof (text) === 'string' && (text.indexOf('<') > -1 || text.indexOf('>') > -1)) {
        let textArray = text.split(' ');
        for (let i = 0; i < textArray.length; i++) {
            if (textArray[i].indexOf('<br/>') === -1) {
                textArray[i] = textArray[i].replace(/[<>]/g, '&');
            }
        }
        text = textArray.join(' ');
    }
    htmlObject.innerHTML = (breakText.indexOf('<br>') > -1 || breakText.indexOf('<br/>') > -1) ? breakText : text;
    htmlObject.style.position = 'fixed';
    htmlObject.style.fontSize = font.size;
    htmlObject.style.fontWeight = font.fontWeight;
    htmlObject.style.fontStyle = font.fontStyle;
    htmlObject.style.fontFamily = font.fontFamily;
    htmlObject.style.visibility = 'hidden';
    htmlObject.style.top = '-100';
    htmlObject.style.left = '0';
    htmlObject.style.whiteSpace = 'nowrap';
    // For bootstrap line height issue
    htmlObject.style.lineHeight = 'normal';
    return new Size(htmlObject.clientWidth, htmlObject.clientHeight);
}
/** @private */
function findDirection(rX, rY, rect, arrowLocation, arrowPadding, top, bottom, left, tipX, tipY, tipRadius) {
    let direction = '';
    let startX = rect.x;
    let startY = rect.y;
    let width = rect.x + rect.width;
    let height = rect.y + rect.height;
    tipRadius = tipRadius ? tipRadius : 0;
    if (top) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + startY + ' ' + (startX + rX) + ' ' + startY + ' ' +
            ' L' + ' ' + (width - rX) + ' ' + (startY) + ' Q ' + width + ' '
            + startY + ' ' + (width) + ' ' + (startY + rY));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + width + ' '
            + (height) + ' ' + (width - rX) + ' ' + (height));
        if (arrowPadding !== 0) {
            direction = direction.concat(' L' + ' ' + (arrowLocation.x + arrowPadding / 2) + ' ' + (height));
            direction = direction.concat(' L' + ' ' + (tipX + tipRadius) + ' ' + (height + arrowPadding - tipRadius));
            direction += ' Q' + ' ' + (tipX) + ' ' + (height + arrowPadding) + ' ' + (tipX - tipRadius) +
                ' ' + (height + arrowPadding - tipRadius);
        }
        if ((arrowLocation.x - arrowPadding / 2) > startX) {
            direction = direction.concat(' L' + ' ' + (arrowLocation.x - arrowPadding / 2) + ' ' + height +
                ' L' + ' ' + (startX + rX) + ' ' + height + ' Q ' + startX + ' '
                + height + ' ' + (startX) + ' ' + (height - rY) + ' z');
        }
        else {
            if (arrowPadding === 0) {
                direction = direction.concat(' L' + ' ' + (startX + rX) + ' ' + height + ' Q ' + startX + ' '
                    + height + ' ' + (startX) + ' ' + (height - rY) + ' z');
            }
            else {
                direction = direction.concat(' L' + ' ' + (startX) + ' ' + (height + rY) + ' z');
            }
        }
    }
    else if (bottom) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + (startY) + ' ' + (startX + rX) + ' ' + (startY) + ' L' + ' ' + (arrowLocation.x - arrowPadding / 2) + ' ' + (startY));
        direction = direction.concat(' L' + ' ' + (tipX - tipRadius) + ' ' + (arrowLocation.y + tipRadius));
        direction += ' Q' + ' ' + (tipX) + ' ' + (arrowLocation.y) + ' ' + (tipX + tipRadius) + ' ' + (arrowLocation.y + tipRadius);
        direction = direction.concat(' L' + ' ' + (arrowLocation.x + arrowPadding / 2) + ' ' + (startY) + ' L' + ' '
            + (width - rX) + ' ' + (startY) + ' Q ' + (width) + ' ' + (startY) + ' ' + (width) + ' ' + (startY + rY));
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + (width) + ' '
            + (height) + ' ' + (width - rX) + ' ' + (height) +
            ' L' + ' ' + (startX + rX) + ' ' + (height) + ' Q ' + (startX) + ' '
            + (height) + ' ' + (startX) + ' ' + (height - rY) + ' z');
    }
    else if (left) {
        direction = direction.concat('M' + ' ' + (startX) + ' ' + (startY + rY) + ' Q ' + startX + ' '
            + (startY) + ' ' + (startX + rX) + ' ' + (startY));
        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (startY) + ' Q ' + (width) + ' '
            + (startY) + ' ' + (width) + ' ' + (startY + rY) + ' L' + ' ' + (width) + ' ' + (arrowLocation.y - arrowPadding / 2));
        direction = direction.concat(' L' + ' ' + (width + arrowPadding - tipRadius) + ' ' + (tipY - tipRadius));
        direction += ' Q ' + (width + arrowPadding) + ' ' + (tipY) + ' ' + (width + arrowPadding - tipRadius) + ' ' + (tipY + tipRadius);
        direction = direction.concat(' L' + ' ' + (width) + ' ' + (arrowLocation.y + arrowPadding / 2) +
            ' L' + ' ' + (width) + ' ' + (height - rY) + ' Q ' + width + ' ' + (height) + ' ' + (width - rX) + ' ' + (height));
        direction = direction.concat(' L' + ' ' + (startX + rX) + ' ' + (height) + ' Q ' + startX + ' '
            + (height) + ' ' + (startX) + ' ' + (height - rY) + ' z');
    }
    else {
        direction = direction.concat('M' + ' ' + (startX + rX) + ' ' + (startY) + ' Q ' + (startX) + ' '
            + (startY) + ' ' + (startX) + ' ' + (startY + rY) + ' L' + ' ' + (startX) + ' ' + (arrowLocation.y - arrowPadding / 2));
        direction = direction.concat(' L' + ' ' + (startX - arrowPadding + tipRadius) + ' ' + (tipY - tipRadius));
        direction += ' Q ' + (startX - arrowPadding) + ' ' + (tipY) + ' ' + (startX - arrowPadding + tipRadius) + ' ' + (tipY + tipRadius);
        direction = direction.concat(' L' + ' ' + (startX) + ' ' + (arrowLocation.y + arrowPadding / 2) +
            ' L' + ' ' + (startX) + ' ' + (height - rY) + ' Q ' + startX + ' '
            + (height) + ' ' + (startX + rX) + ' ' + (height));
        direction = direction.concat(' L' + ' ' + (width - rX) + ' ' + (height) + ' Q ' + width + ' '
            + (height) + ' ' + (width) + ' ' + (height - rY) +
            ' L' + ' ' + (width) + ' ' + (startY + rY) + ' Q ' + width + ' '
            + (startY) + ' ' + (width - rX) + ' ' + (startY) + ' z');
    }
    return direction;
}
/** @private */
class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
}
/** @private */
class Rect {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
class Side {
    constructor(bottom, right) {
        this.isRight = right;
        this.isBottom = bottom;
    }
}
/** @private */
class CustomizeOption {
    constructor(id) {
        this.id = id;
    }
}
/** @private */
class TextOption extends CustomizeOption {
    constructor(id, x, y, anchor, text, transform = '', baseLine, labelRotation) {
        super(id);
        this.transform = '';
        this.baseLine = 'auto';
        this.labelRotation = 0;
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
        this.transform = transform;
        this.baseLine = baseLine;
        this.labelRotation = labelRotation;
    }
}
/** @private */
function getElement(id) {
    return document.getElementById(id);
}
/** @private */
function removeElement(id) {
    let element = getElement(id);
    if (element) {
        remove(element);
    }
}
/** @private */
function drawSymbol(location, shape, size, url, options, label) {
    let renderer = new SvgRenderer('');
    let temp = calculateShapes(location, size, shape, options, url);
    let htmlObject = renderer['draw' + temp.functionName](temp.renderOption);
    htmlObject.setAttribute('aria-label', label);
    return htmlObject;
}
/** @private */
function calculateShapes(location, size, shape, options, url) {
    let path;
    let functionName = 'Path';
    let width = size.width;
    let height = size.height;
    let locX = location.x;
    let locY = location.y;
    let x = location.x + (-width / 2);
    let y = location.y + (-height / 2);
    switch (shape) {
        case 'Circle':
        case 'Bubble':
            functionName = 'Ellipse';
            merge(options, { 'rx': width / 2, 'ry': height / 2, 'cx': locX, 'cy': locY });
            break;
        case 'Cross':
            path = 'M' + ' ' + x + ' ' + locY + ' ' + 'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
                'M' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + locX + ' ' +
                (locY + (-height / 2));
            merge(options, { 'd': path });
            break;
        case 'HorizontalLine':
            path = 'M' + ' ' + x + ' ' + locY + ' ' + 'L' + ' ' + (locX + (width / 2)) + ' ' + locY;
            merge(options, { 'd': path });
            break;
        case 'VerticalLine':
            path = 'M' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' + 'L' + ' ' + locX + ' ' + (locY + (-height / 2));
            merge(options, { 'd': path });
            break;
        case 'Diamond':
            path = 'M' + ' ' + x + ' ' + locY + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + locY + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + locY + ' z';
            merge(options, { 'd': path });
            break;
        case 'Rectangle':
            path = 'M' + ' ' + x + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (-height / 2)) + ' z';
            merge(options, { 'd': path });
            break;
        case 'Triangle':
            path = 'M' + ' ' + x + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (-height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + x + ' ' + (locY + (height / 2)) + ' z';
            merge(options, { 'd': path });
            break;
        case 'InvertedTriangle':
            path = 'M' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                'L' + ' ' + locX + ' ' + (locY + (height / 2)) + ' ' +
                'L' + ' ' + (locX - (width / 2)) + ' ' + (locY - (height / 2)) + ' ' +
                'L' + ' ' + (locX + (width / 2)) + ' ' + (locY - (height / 2)) + ' z';
            merge(options, { 'd': path });
            break;
        case 'Pentagon':
            let eq = 72;
            let xValue;
            let yValue;
            for (let i = 0; i <= 5; i++) {
                xValue = (width / 2) * Math.cos((Math.PI / 180) * (i * eq));
                yValue = (height / 2) * Math.sin((Math.PI / 180) * (i * eq));
                if (i === 0) {
                    path = 'M' + ' ' + (locX + xValue) + ' ' + (locY + yValue) + ' ';
                }
                else {
                    path = path.concat('L' + ' ' + (locX + xValue) + ' ' + (locY + yValue) + ' ');
                }
            }
            path = path.concat('Z');
            merge(options, { 'd': path });
            break;
        case 'Image':
            functionName = 'Image';
            merge(options, { 'href': url, 'height': height, 'width': width, x: x, y: y });
            break;
    }
    return { renderOption: options, functionName: functionName };
}
/** @private */
class PathOption extends CustomizeOption {
    constructor(id, fill, width, color, opacity, dashArray, d) {
        super(id);
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
    }
}
/** @private */
function textElement(options, font, color, parent) {
    let renderOptions = {};
    let htmlObject;
    let renderer = new SvgRenderer('');
    let text;
    renderOptions = {
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color,
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'text-anchor': options.anchor,
        'transform': options.transform,
        'opacity': font.opacity,
        'dominant-baseline': options.baseLine
    };
    text = typeof options.text === 'string' ? options.text : options.text[0];
    htmlObject = renderer.createText(renderOptions, text);
    parent.appendChild(htmlObject);
    return htmlObject;
}
class TooltipLocation {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/**
 * Configures the fonts in charts.
 * @private
 */
class TextStyle extends ChildProperty {
}
__decorate([
    Property(null)
], TextStyle.prototype, "size", void 0);
__decorate([
    Property('')
], TextStyle.prototype, "color", void 0);
__decorate([
    Property('Segoe UI')
], TextStyle.prototype, "fontFamily", void 0);
__decorate([
    Property('Normal')
], TextStyle.prototype, "fontWeight", void 0);
__decorate([
    Property('Normal')
], TextStyle.prototype, "fontStyle", void 0);
__decorate([
    Property(1)
], TextStyle.prototype, "opacity", void 0);
/**
 * Configures the borders in the chart.
 * @private
 */
class TooltipBorder extends ChildProperty {
}
__decorate([
    Property('')
], TooltipBorder.prototype, "color", void 0);
__decorate([
    Property(1)
], TooltipBorder.prototype, "width", void 0);
/**
 * Configures the borders in the chart.
 * @private
 */
class AreaBounds extends ChildProperty {
}
__decorate([
    Property(0)
], AreaBounds.prototype, "x", void 0);
__decorate([
    Property(0)
], AreaBounds.prototype, "y", void 0);
__decorate([
    Property(0)
], AreaBounds.prototype, "width", void 0);
__decorate([
    Property(0)
], AreaBounds.prototype, "height", void 0);
/**
 * Configures the borders in the chart.
 * @private
 */
class ToolLocation extends ChildProperty {
}
__decorate([
    Property(0)
], ToolLocation.prototype, "x", void 0);
__decorate([
    Property(0)
], ToolLocation.prototype, "y", void 0);
/**
 * Represents the Tooltip control.
 * ```html
 * <div id="tooltip"/>
 * <script>
 *   var tooltipObj = new Tooltip({ isResponsive : true });
 *   tooltipObj.appendTo("#tooltip");
 * </script>
 * ```
 * @private
 */
let Tooltip = class Tooltip extends Component {
    /**
     * Constructor for creating the widget
     * @hidden
     */
    constructor(options, element) {
        super(options, element);
    }
    /**
     * Initialize the event handler.
     *  @private.
     */
    preRender() {
        this.allowServerDataBinding = false;
        this.initPrivateVariable();
        if (!this.isCanvas) {
            this.removeSVG();
        }
        this.createTooltipElement();
    }
    initPrivateVariable() {
        this.renderer = new SvgRenderer(this.element.id);
        this.themeStyle = getTooltipThemeColor(this.theme);
        this.formattedText = [];
        this.padding = 5;
        this.isFirst = true;
        this.markerPoint = [];
    }
    removeSVG() {
        let svgObject = document.getElementById(this.element.id + '_svg');
        let templateObject = document.getElementById(this.element.id + 'parent_template');
        if (this.blazorTemplate) {
            resetBlazorTemplate(this.element.id + 'parent_template' + '_blazorTemplate');
        }
        if (svgObject && svgObject.parentNode) {
            remove(svgObject);
        }
        if (templateObject && templateObject.parentNode) {
            remove(templateObject);
        }
    }
    /**
     * To Initialize the control rendering.
     */
    render() {
        this.fadeOuted = false;
        if (!this.template) {
            this.renderText(this.isFirst);
            let argsData = {
                cancel: false, name: 'tooltipRender', tooltip: this
            };
            this.trigger('tooltipRender', argsData);
            let markerSide = this.renderTooltipElement(this.areaBounds, this.location);
            this.drawMarker(markerSide.isBottom, markerSide.isRight, this.markerSize);
        }
        else {
            this.updateTemplateFn();
            this.createTemplate(this.areaBounds, this.location);
        }
        this.trigger('loaded', { tooltip: this });
        let element = document.getElementById('chartmeasuretext');
        if (element) {
            remove(element);
        }
        this.allowServerDataBinding = true;
    }
    createTooltipElement() {
        this.textElements = [];
        if (!this.template || this.shared) {
            // SVG element for tooltip
            let svgObject = this.renderer.createSvg({ id: this.element.id + '_svg' });
            this.element.appendChild(svgObject);
            // Group to hold text and path.
            let groupElement = document.getElementById(this.element.id + '_group');
            if (!groupElement) {
                groupElement = this.renderer.createGroup({ id: this.element.id + '_group' });
                groupElement.setAttribute('transform', 'translate(0,0)');
            }
            svgObject.appendChild(groupElement);
            let pathElement = this.renderer.drawPath({
                'id': this.element.id + '_path', 'stroke-width': this.theme === 'Bootstrap4' ? 0 : this.border.width,
                'fill': this.fill || this.themeStyle.tooltipFill, 'opacity': this.theme === 'Bootstrap4' ? 0.9 : this.opacity,
                'stroke': this.border.color
            });
            groupElement.appendChild(pathElement);
        }
    }
    drawMarker(isBottom, isRight, size) {
        if (this.shapes.length <= 0) {
            return null;
        }
        let shapeOption;
        let count = 0;
        let markerGroup = this.renderer.createGroup({ id: this.element.id + '_trackball_group' });
        let groupElement = getElement(this.element.id + '_group');
        let x = (this.marginX * 2) + (size / 2) + (isRight ? this.arrowPadding : 0);
        for (let shape of this.shapes) {
            shapeOption = new PathOption(this.element.id + '_Trackball_' + count, this.palette[count], 1, '#cccccc', 1, null);
            if (this.markerPoint[count]) {
                markerGroup.appendChild(drawSymbol(new TooltipLocation(x, this.markerPoint[count] - this.padding + (isBottom ? this.arrowPadding : 0)), shape, new Size(size, size), '', shapeOption, null));
            }
            count++;
        }
        groupElement.appendChild(markerGroup);
    }
    renderTooltipElement(areaBounds, location) {
        let tooltipDiv = getElement(this.element.id);
        let arrowLocation = new TooltipLocation(0, 0);
        let tipLocation = new TooltipLocation(0, 0);
        let svgObject = getElement(this.element.id + '_svg');
        let groupElement = getElement(this.element.id + '_group');
        let pathElement = getElement(this.element.id + '_path');
        let rect;
        let isTop = false;
        let isLeft = false;
        let isBottom = false;
        let x = 0;
        let y = 0;
        this.tipRadius = 1;
        if (this.header !== '') {
            this.elementSize.height += this.marginY;
        }
        if (this.content.length > 1) {
            rect = this.sharedTooltipLocation(areaBounds, this.location.x, this.location.y);
            isTop = true;
        }
        else {
            rect = this.tooltipLocation(areaBounds, location, arrowLocation, tipLocation);
            if (!this.inverted) {
                isTop = (rect.y < (location.y + this.clipBounds.y));
                isBottom = !isTop;
                y = (isTop ? 0 : this.arrowPadding);
            }
            else {
                isLeft = (rect.x < (location.x + this.clipBounds.x));
                x = (isLeft ? 0 : this.arrowPadding);
            }
        }
        if (this.header !== '') {
            let headerSize = measureText(this.isWrap ? this.wrappedText : this.header, this.textStyle).height +
                (this.marginY * 2) + (isBottom ? this.arrowPadding : 0) + (this.isWrap ? 5 : 0); //header padding;
            let xLength = (this.marginX * 3) + (!isLeft && !isTop && !isBottom ? this.arrowPadding : 0);
            let direction = 'M ' + xLength + ' ' + headerSize +
                'L ' + (rect.width + (!isLeft && !isTop && !isBottom ? this.arrowPadding : 0) - (this.marginX * 2)) +
                ' ' + headerSize;
            let pathElement = this.renderer.drawPath({
                'id': this.element.id + '_header_path', 'stroke-width': 1,
                'fill': null, 'opacity': 0.8, 'stroke': this.themeStyle.tooltipHeaderLine, 'd': direction
            });
            groupElement.appendChild(pathElement);
        }
        let start = this.border.width / 2;
        let pointRect = new Rect(start + x, start + y, rect.width - start, rect.height - start);
        groupElement.setAttribute('opacity', '1');
        if (this.enableAnimation && !this.shared && !this.isFirst) {
            this.animateTooltipDiv(tooltipDiv, rect);
        }
        else {
            this.updateDiv(tooltipDiv, rect.x, rect.y);
        }
        svgObject.setAttribute('height', (rect.height + this.border.width + (!((!this.inverted)) ? 0 : this.arrowPadding) + 5).toString());
        svgObject.setAttribute('width', (rect.width + this.border.width + (((!this.inverted)) ? 0 : this.arrowPadding) + 5).toString());
        svgObject.setAttribute('opacity', '1');
        if (!isNullOrUndefined(this.tooltipPlacement)) {
            isTop = this.tooltipPlacement.indexOf('Top') > -1;
            isBottom = this.tooltipPlacement.indexOf('Bottom') > -1;
            isLeft = this.tooltipPlacement.indexOf('Left') > -1;
        }
        pathElement.setAttribute('d', findDirection(this.rx, this.ry, pointRect, arrowLocation, this.arrowPadding, isTop, isBottom, isLeft, tipLocation.x, tipLocation.y, this.tipRadius));
        if (this.enableShadow && this.theme !== 'Bootstrap4') {
            // To fix next chart initial tooltip opacity issue in tab control
            let shadowId = this.element.id + '_shadow';
            pathElement.setAttribute('filter', Browser.isIE ? '' : 'url(#' + shadowId + ')');
            let shadow = '<filter id="' + shadowId + '" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/>';
            shadow += '<feOffset dx="3" dy="3" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.5"/>';
            shadow += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
            let defElement = this.renderer.createDefs();
            defElement.setAttribute('id', this.element.id + 'SVG_tooltip_definition');
            groupElement.appendChild(defElement);
            defElement.innerHTML = shadow;
        }
        pathElement.setAttribute('stroke', this.border.color);
        this.changeText(new TooltipLocation(x, y), isBottom, !isLeft && !isTop && !isBottom, rect);
        return new Side(isBottom, !isLeft && !isTop && !isBottom);
    }
    changeText(point, isBottom, isRight, rect) {
        let element = document.getElementById(this.element.id + '_text');
        if (isBottom) {
            element.setAttribute('transform', 'translate(0,' + this.arrowPadding + ')');
        }
        if (isRight) {
            element.setAttribute('transform', 'translate(' + this.arrowPadding + ' 0)');
        }
    }
    findFormattedText() {
        this.formattedText = [];
        if (this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '') {
            this.formattedText = this.formattedText.concat(this.header);
        }
        this.formattedText = this.formattedText.concat(this.content);
    }
    // tslint:disable-next-line:max-func-body-length
    renderText(isRender) {
        let height = 0;
        let width = 0; // Padding for text;
        let subWidth = 0;
        let lines;
        let key = 'properties';
        let size;
        let font = extend({}, this.textStyle, null, true)[key];
        let groupElement = getElement(this.element.id + '_group');
        let tspanElement;
        let textCollection;
        let tspanStyle = '';
        let line;
        let tspanOption;
        this.findFormattedText();
        let isHeader;
        this.leftSpace = this.areaBounds.x + this.location.x;
        this.rightSpace = (this.areaBounds.x + this.areaBounds.width) - this.leftSpace;
        let headerContent = this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim();
        let isBoldTag = this.header.indexOf('<b>') > -1 && this.header.indexOf('</b>') > -1;
        let headerWidth = measureText(this.formattedText[0], font).width + (2 * this.marginX) + this.arrowPadding;
        let isLeftSpace = (this.location.x - headerWidth) < this.location.x;
        let isRightSpace = (this.areaBounds.x + this.areaBounds.width) < (this.location.x + headerWidth);
        let header;
        let headerSpace = (headerContent !== '') ? this.marginY : 0;
        let isRow = true;
        let isColumn = true;
        this.markerPoint = [];
        let markerSize = (this.shapes.length > 0) ? 10 : 0;
        let markerPadding = (this.shapes.length > 0) ? 5 : 0;
        let spaceWidth = 4;
        let subStringLength;
        let fontSize = '13px';
        let fontWeight = 'Normal';
        let labelColor = this.themeStyle.tooltipLightLabel;
        let dy = (22 / parseFloat(fontSize)) * (parseFloat(font.size));
        if (!isRender || this.isCanvas) {
            removeElement(this.element.id + '_text');
            removeElement(this.element.id + '_header_path');
            removeElement(this.element.id + '_trackball_group');
            removeElement(this.element.id + 'SVG_tooltip_definition');
        }
        let options = new TextOption(this.element.id + '_text', this.marginX * 2, (this.marginY * 2 + this.padding * 2 + (this.marginY === 2 ? 3 : 0)), 'start', '');
        let parentElement = textElement(options, font, null, groupElement);
        let withoutHeader = this.formattedText.length === 1 && this.formattedText[0].indexOf(' : <b>') > -1;
        isHeader = this.header !== '';
        size = isHeader && isBoldTag ? 16 : 13;
        for (let k = 0, pointsLength = this.formattedText.length; k < pointsLength; k++) {
            textCollection = this.formattedText[k].replace(/<(b|strong)>/g, '<b>')
                .replace(/<\/(b|strong)>/g, '</b>')
                .split(/<br.*?>/g);
            if (k === 0 && !withoutHeader && this.isTextWrap &&
                (this.leftSpace < headerWidth || isLeftSpace) &&
                (this.rightSpace < headerWidth || isRightSpace)) {
                subStringLength = Math.round(this.leftSpace > this.rightSpace ? (this.leftSpace / size) : (this.rightSpace / size));
                header = headerContent !== '' ? headerContent : this.formattedText[k];
                textCollection = header.match(new RegExp('.{1,' + subStringLength + '}', 'g'));
                this.wrappedText = isBoldTag ? '<b>' + textCollection.join('<br>') + '</b>' : textCollection.join('<br>');
                this.isWrap = textCollection.length > 1;
            }
            if (textCollection[0] === '') {
                continue;
            }
            if ((k !== 0) || (headerContent === '')) {
                this.markerPoint.push((headerContent !== '' ? (this.marginY) : 0) + options.y + height);
            }
            for (let i = 0, len = textCollection.length; i < len; i++) { // string value of unicode for LTR is \u200E
                lines = textCollection[i].replace(/<b>/g, '<br><b>').replace(/<\/b>/g, '</b><br>').replace(/:/g, '<br>\u200E:<br>')
                    .split('<br>');
                subWidth = 0;
                isColumn = true;
                height += dy;
                for (let j = 0, len = lines.length; j < len; j++) {
                    line = lines[j];
                    if (!/\S/.test(line) && line !== '') {
                        line = ' '; //to trim multiple white spaces to single white space
                    }
                    if ((!isColumn && line === ' ') || (line.replace(/<b>/g, '').replace(/<\/b>/g, '').trim() !== '')) {
                        subWidth += line !== ' ' ? spaceWidth : 0;
                        if (isColumn && !isRow) {
                            tspanOption = { x: (this.marginX * 2) + (markerSize + markerPadding),
                                dy: dy + ((isColumn) ? headerSpace : 0), fill: '' };
                            headerSpace = null;
                        }
                        else {
                            if (isRow && isColumn) {
                                tspanOption = {
                                    x: (headerContent === '') ? ((this.marginX * 2) + (markerSize + markerPadding))
                                        : (this.marginX * 2) + (this.isWrap ? (markerSize + markerPadding) : 0)
                                };
                            }
                            else {
                                tspanOption = {};
                            }
                        }
                        isColumn = false;
                        tspanElement = this.renderer.createTSpan(tspanOption, '');
                        parentElement.appendChild(tspanElement);
                        if (line.indexOf('<b>') > -1 || ((isBoldTag && j === 0 && k === 0) && (isHeader || this.isWrap))) {
                            fontWeight = 'bold';
                            labelColor = this.themeStyle.tooltipBoldLabel;
                            tspanStyle = 'font-weight:' + fontWeight;
                            font.fontWeight = fontWeight;
                            (tspanElement).setAttribute('fill', this.textStyle.color || labelColor);
                        }
                        else {
                            tspanStyle = fontWeight === 'bold' ? 'font-weight:' + fontWeight : '';
                            font.fontWeight = fontWeight;
                            (tspanElement).setAttribute('fill', this.textStyle.color || labelColor);
                        }
                        if (line.indexOf('</b>') > -1 || ((isBoldTag && j === len - 1 && k === 0) && (isHeader || this.isWrap))) {
                            fontWeight = 'Normal';
                            labelColor = this.themeStyle.tooltipLightLabel;
                        }
                        (tspanElement).textContent = line = line.replace(/<[a-zA-Z\/](.|\n)*?>/g, '');
                        subWidth += measureText(line, font).width;
                        if (tspanStyle !== '') {
                            tspanElement.setAttribute('style', tspanStyle);
                        }
                        isRow = false;
                    }
                }
                subWidth -= spaceWidth;
                width = Math.max(width, subWidth);
            }
        }
        this.elementSize = new Size(width + (width > 0 ? (2 * this.marginX) : 0), height);
        this.elementSize.width += (markerSize + markerPadding); // marker size + marker Spacing
        let element = (parentElement.childNodes[0]);
        if (headerContent !== '' && element && !this.isWrap) {
            font.fontWeight = 'bold';
            let width = (this.elementSize.width + (2 * this.padding)) / 2 - measureText(headerContent, font).width / 2;
            element.setAttribute('x', width.toString());
        }
    }
    createTemplate(areaBounds, location) {
        let argsData = { cancel: false, name: 'tooltipRender', tooltip: this };
        this.trigger('tooltipRender', argsData);
        let parent = document.getElementById(this.element.id);
        if (this.isCanvas) {
            this.removeSVG();
        }
        let firstElement = parent.firstElementChild;
        if (firstElement) {
            remove(firstElement);
        }
        if (!argsData.cancel) {
            let elem = createElement('div', { id: this.element.id + 'parent_template' });
            let templateElement = this.templateFn(this.data, null, null, elem.id + '_blazorTemplate', '');
            while (templateElement && templateElement.length > 0) {
                if (isBlazor()) {
                    elem.appendChild(templateElement[0]);
                    templateElement = null;
                }
                else {
                    elem.appendChild(templateElement[0]);
                }
            }
            parent.appendChild(elem);
            let element = this.isCanvas ? elem : this.element;
            let rect = element.getBoundingClientRect();
            this.padding = 0;
            this.elementSize = new Size(rect.width, rect.height);
            let tooltipRect = this.tooltipLocation(areaBounds, location, new TooltipLocation(0, 0), new TooltipLocation(0, 0));
            if (this.enableAnimation && !this.shared && !this.isFirst) {
                this.animateTooltipDiv(this.element, tooltipRect);
            }
            else {
                this.updateDiv(element, tooltipRect.x, tooltipRect.y);
            }
            if (this.blazorTemplate) {
                //Customer issue - F149037  Call back function to handle the blazor tooltip alignment issues
                let tooltipRendered = () => {
                    let rect1 = getElement(thisObject.element.id).getBoundingClientRect();
                    thisObject.elementSize = new Size(rect1.width, rect1.height);
                    let tooltipRect1 = thisObject.tooltipLocation(areaBounds, location, new TooltipLocation(0, 0), new TooltipLocation(0, 0));
                    thisObject.updateDiv(getElement(thisObject.element.id), tooltipRect1.x, tooltipRect1.y);
                };
                let thisObject = this;
                tooltipRendered.bind(thisObject, areaBounds, location);
                updateBlazorTemplate(this.element.id + 'parent_template' + '_blazorTemplate', this.blazorTemplate.name, this.blazorTemplate.parent, undefined, tooltipRendered);
            }
        }
        else {
            remove(getElement(this.element.id + '_tooltip'));
        }
    }
    sharedTooltipLocation(bounds, x, y) {
        let width = this.elementSize.width + (2 * this.marginX);
        let height = this.elementSize.height + (2 * this.marginY);
        let tooltipRect = new Rect(x + 2 * this.padding, y - height - this.padding, width, height);
        if (tooltipRect.y < bounds.y) {
            tooltipRect.y += (tooltipRect.height + 2 * this.padding);
        }
        if (tooltipRect.x + tooltipRect.width > bounds.x + bounds.width) {
            tooltipRect.x -= (tooltipRect.width + 4 * this.padding);
        }
        return tooltipRect;
    }
    getCurrentPosition(bounds, symbolLocation, arrowLocation, tipLocation) {
        let position = this.tooltipPlacement;
        let clipX = this.clipBounds.x;
        let clipY = this.clipBounds.y;
        let markerHeight = this.offset;
        let width = this.elementSize.width + (2 * this.marginX);
        let height = this.elementSize.height + (2 * this.marginY);
        let location = new TooltipLocation(symbolLocation.x, symbolLocation.y);
        if (position === 'Top' || position === 'Bottom') {
            location = new TooltipLocation(location.x + clipX - this.elementSize.width / 2 - this.padding, location.y + clipY - this.elementSize.height - (2 * this.padding) - this.arrowPadding - markerHeight);
            arrowLocation.x = tipLocation.x = width / 2;
            if (position === 'Bottom') {
                location.y = symbolLocation.y + clipY + markerHeight;
            }
            if (bounds.x + bounds.width < location.x + width) {
                location.x = (bounds.width > width) ? ((bounds.x + bounds.width) - width + 6) : bounds.x;
                arrowLocation.x = tipLocation.x = (bounds.width > width) ? (bounds.x + symbolLocation.x - location.x) : symbolLocation.x;
            }
            else if (bounds.x > location.x) {
                location.x = bounds.x;
                arrowLocation.x = tipLocation.x = symbolLocation.x;
            }
        }
        else {
            location = new TooltipLocation(location.x + clipX + markerHeight, location.y + clipY - this.elementSize.height / 2 - (this.padding));
            arrowLocation.y = tipLocation.y = height / 2;
            if (position === 'Left') {
                location.x = symbolLocation.x + clipX - markerHeight - (width + this.arrowPadding);
            }
            if (bounds.y + bounds.height < location.y + height) {
                location.y = (bounds.height > height) ? ((bounds.y + bounds.height) - height + 6) : bounds.y;
                arrowLocation.y = tipLocation.y = (bounds.height > height) ? (bounds.y + symbolLocation.y - location.y) : symbolLocation.y;
            }
            else if (bounds.y > location.y) {
                location.y = bounds.y;
                arrowLocation.y = tipLocation.y = symbolLocation.y;
            }
        }
        return new Rect(location.x, location.y, width, height);
    }
    // tslint:disable-next-line:max-func-body-length
    tooltipLocation(bounds, symbolLocation, arrowLocation, tipLocation) {
        if (!isNullOrUndefined(this.tooltipPlacement)) {
            let tooltipRect = this.getCurrentPosition(bounds, symbolLocation, arrowLocation, tipLocation);
            return tooltipRect;
        }
        let location = new TooltipLocation(symbolLocation.x, symbolLocation.y);
        let width = this.elementSize.width + (2 * this.marginX);
        let height = this.elementSize.height + (2 * this.marginY);
        let markerHeight = this.offset;
        let clipX = this.clipBounds.x;
        let clipY = this.clipBounds.y;
        let boundsX = bounds.x;
        let boundsY = bounds.y;
        if (!this.inverted) {
            location = new TooltipLocation(location.x + clipX - this.elementSize.width / 2 - this.padding, location.y + clipY - this.elementSize.height - (2 * this.padding) - this.arrowPadding - markerHeight);
            arrowLocation.x = tipLocation.x = width / 2;
            if (location.y < boundsY || (this.isNegative)) {
                location.y = (symbolLocation.y < 0 ? 0 : symbolLocation.y) + clipY + markerHeight;
            }
            if (location.y + height + this.arrowPadding > boundsY + bounds.height) {
                location.y = (symbolLocation.y > bounds.height ? bounds.height : symbolLocation.y)
                    + clipY - this.elementSize.height - (2 * this.padding) - this.arrowPadding - markerHeight;
            }
            tipLocation.x = width / 2;
            if (location.x < boundsX) {
                arrowLocation.x -= (boundsX - location.x);
                tipLocation.x -= (boundsX - location.x);
                location.x = boundsX;
            }
            if (location.x + width > boundsX + bounds.width) {
                arrowLocation.x += ((location.x + width) - (boundsX + bounds.width));
                tipLocation.x += ((location.x + width) - (boundsX + bounds.width));
                location.x -= ((location.x + width) - (boundsX + bounds.width));
            }
            if (arrowLocation.x + this.arrowPadding / 2 > width - this.rx) {
                arrowLocation.x = width - this.rx - this.arrowPadding / 2;
                tipLocation.x = width;
                this.tipRadius = 0;
            }
            if (arrowLocation.x - this.arrowPadding / 2 < this.rx) {
                arrowLocation.x = this.rx + this.arrowPadding / 2;
                tipLocation.x = 0;
                this.tipRadius = 0;
            }
        }
        else {
            location = new TooltipLocation(location.x + clipX + markerHeight, location.y + clipY - this.elementSize.height / 2 - (this.padding));
            arrowLocation.y = tipLocation.y = height / 2;
            if ((location.x + width + this.arrowPadding > boundsX + bounds.width) || (this.isNegative)) {
                location.x = (symbolLocation.x > bounds.width ? bounds.width : symbolLocation.x)
                    + clipX - markerHeight - (width + this.arrowPadding);
            }
            if (location.x < boundsX) {
                location.x = (symbolLocation.x < 0 ? 0 : symbolLocation.x) + clipX + markerHeight;
            }
            if (location.y <= boundsY) {
                arrowLocation.y -= (boundsY - location.y);
                tipLocation.y -= (boundsY - location.y);
                location.y = boundsY;
            }
            if (location.y + height >= boundsY + bounds.height) {
                arrowLocation.y += ((location.y + height) - (boundsY + bounds.height));
                tipLocation.y += ((location.y + height) - (boundsY + bounds.height));
                location.y -= ((location.y + height) - (boundsY + bounds.height));
            }
            if (arrowLocation.y + this.arrowPadding / 2 > height - this.ry) {
                arrowLocation.y = height - this.ry - this.arrowPadding / 2;
                tipLocation.y = height;
                this.tipRadius = 0;
            }
            if (arrowLocation.y - this.arrowPadding / 2 < this.ry) {
                arrowLocation.y = this.ry + this.arrowPadding / 2;
                tipLocation.y = 0;
                this.tipRadius = 0;
            }
        }
        return new Rect(location.x, location.y, width, height);
    }
    animateTooltipDiv(tooltipDiv, rect) {
        let x = parseFloat(tooltipDiv.style.left);
        let y = parseFloat(tooltipDiv.style.top);
        let currenDiff;
        new Animation({}).animate(tooltipDiv, {
            duration: this.duration,
            progress: (args) => {
                currenDiff = (args.timeStamp / args.duration);
                tooltipDiv.style.animation = null;
                tooltipDiv.style.left = (x + currenDiff * (rect.x - x)) + 'px';
                tooltipDiv.style.top = (y + currenDiff * (rect.y - y)) + 'px';
            },
            end: (model) => {
                this.updateDiv(tooltipDiv, rect.x, rect.y);
                this.trigger('animationComplete', { tooltip: this });
            }
        });
    }
    updateDiv(tooltipDiv, x, y) {
        tooltipDiv.style.left = x + 'px';
        tooltipDiv.style.top = y + 'px';
    }
    updateTemplateFn() {
        if (this.template) {
            try {
                if (document.querySelectorAll(this.template).length) {
                    this.templateFn = compile(document.querySelector(this.template).innerHTML.trim());
                }
            }
            catch (e) {
                this.templateFn = compile(this.template);
            }
        }
    }
    /** @private */
    fadeOut() {
        let tooltipElement = (this.isCanvas && !this.template) ? getElement(this.element.id + '_svg') :
            getElement(this.element.id);
        if (tooltipElement) {
            let tooltipGroup = tooltipElement.firstChild;
            if (this.isCanvas && !this.template) {
                tooltipGroup = document.getElementById(this.element.id + '_group') ? document.getElementById(this.element.id + '_group') :
                    tooltipGroup;
            }
            let opacity;
            if (tooltipGroup) {
                opacity = parseFloat(tooltipGroup.getAttribute('opacity')) || 1;
            }
            new Animation({}).animate(tooltipGroup, {
                duration: 200,
                progress: (args) => {
                    //  tooltipGroup.removeAttribute('e-animate');
                    this.progressAnimation(tooltipGroup, opacity, (args.timeStamp / args.duration));
                },
                end: (model) => {
                    this.fadeOuted = true;
                    this.endAnimation(tooltipGroup);
                }
            });
        }
    }
    progressAnimation(tooltipGroup, opacity, timeStamp) {
        tooltipGroup.style.animation = '';
        tooltipGroup.setAttribute('opacity', (opacity - timeStamp).toString());
    }
    /*
     * @hidden
     */
    endAnimation(tooltipGroup) {
        tooltipGroup.setAttribute('opacity', '0');
        if (this.template && !this.shared) {
            tooltipGroup.style.display = 'none';
        }
        this.trigger('animationComplete', { tooltip: this });
    }
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    getPersistData() {
        let keyEntity = [];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Get component name
     *  @private
     */
    getModuleName() {
        return 'tooltip';
    }
    /**
     * To destroy the accumulationcharts
     * @private
     */
    destroy() {
        super.destroy();
        this.element.classList.remove('e-tooltip');
    }
    /**
     * Called internally if any of the property value changed.
     * @return {void}
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (this.blazorTemplate) {
            resetBlazorTemplate(this.element.id + 'parent_template' + '_blazorTemplate');
        }
        this.isFirst = false;
        this.render();
    }
};
__decorate([
    Property(false)
], Tooltip.prototype, "enable", void 0);
__decorate([
    Property(false)
], Tooltip.prototype, "shared", void 0);
__decorate([
    Property(true)
], Tooltip.prototype, "enableShadow", void 0);
__decorate([
    Property(null)
], Tooltip.prototype, "fill", void 0);
__decorate([
    Property('')
], Tooltip.prototype, "header", void 0);
__decorate([
    Property(0.75)
], Tooltip.prototype, "opacity", void 0);
__decorate([
    Complex({ size: '13px', fontWeight: 'Normal', color: null, fontStyle: 'Normal', fontFamily: 'Segoe UI' }, TextStyle)
], Tooltip.prototype, "textStyle", void 0);
__decorate([
    Property(null)
], Tooltip.prototype, "template", void 0);
__decorate([
    Property(true)
], Tooltip.prototype, "enableAnimation", void 0);
__decorate([
    Property(300)
], Tooltip.prototype, "duration", void 0);
__decorate([
    Property(false)
], Tooltip.prototype, "inverted", void 0);
__decorate([
    Property(false)
], Tooltip.prototype, "isNegative", void 0);
__decorate([
    Complex({ color: '#cccccc', width: 0.5 }, TooltipBorder)
], Tooltip.prototype, "border", void 0);
__decorate([
    Property([])
], Tooltip.prototype, "content", void 0);
__decorate([
    Property(10)
], Tooltip.prototype, "markerSize", void 0);
__decorate([
    Complex({ x: 0, y: 0 }, ToolLocation)
], Tooltip.prototype, "clipBounds", void 0);
__decorate([
    Property([])
], Tooltip.prototype, "palette", void 0);
__decorate([
    Property([])
], Tooltip.prototype, "shapes", void 0);
__decorate([
    Complex({ x: 0, y: 0 }, ToolLocation)
], Tooltip.prototype, "location", void 0);
__decorate([
    Property(0)
], Tooltip.prototype, "offset", void 0);
__decorate([
    Property(2)
], Tooltip.prototype, "rx", void 0);
__decorate([
    Property(2)
], Tooltip.prototype, "ry", void 0);
__decorate([
    Property(5)
], Tooltip.prototype, "marginX", void 0);
__decorate([
    Property(5)
], Tooltip.prototype, "marginY", void 0);
__decorate([
    Property(12)
], Tooltip.prototype, "arrowPadding", void 0);
__decorate([
    Property(null)
], Tooltip.prototype, "data", void 0);
__decorate([
    Property('Material')
], Tooltip.prototype, "theme", void 0);
__decorate([
    Complex({ x: 0, y: 0, width: 0, height: 0 }, AreaBounds)
], Tooltip.prototype, "areaBounds", void 0);
__decorate([
    Property(null)
], Tooltip.prototype, "availableSize", void 0);
__decorate([
    Property()
], Tooltip.prototype, "blazorTemplate", void 0);
__decorate([
    Property(false)
], Tooltip.prototype, "isCanvas", void 0);
__decorate([
    Property(false)
], Tooltip.prototype, "isTextWrap", void 0);
__decorate([
    Property(null)
], Tooltip.prototype, "tooltipPlacement", void 0);
__decorate([
    Event()
], Tooltip.prototype, "tooltipRender", void 0);
__decorate([
    Event()
], Tooltip.prototype, "loaded", void 0);
__decorate([
    Event()
], Tooltip.prototype, "animationComplete", void 0);
Tooltip = __decorate([
    NotifyPropertyChanges
], Tooltip);

/**
 * Chart component exported items
 */

/**
 * Chart components exported.
 */

export { TextStyle, TooltipBorder, AreaBounds, ToolLocation, Tooltip, getTooltipThemeColor, measureText, findDirection, Size, Rect, Side, CustomizeOption, TextOption, getElement, removeElement, drawSymbol, calculateShapes, PathOption, textElement, TooltipLocation, SvgRenderer, CanvasRenderer };
//# sourceMappingURL=ej2-svg-base.es2015.js.map
