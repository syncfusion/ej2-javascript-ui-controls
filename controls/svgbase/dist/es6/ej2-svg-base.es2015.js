import { Animation, Browser, ChildProperty, Complex, Component, Event, NotifyPropertyChanges, Property, SvgRenderer, compile, createElement, extend, merge, remove } from '@syncfusion/ej2-base';

/** @private */
function getTooltipThemeColor(theme) {
    let style;
    switch (theme) {
        case 'Highcontrast':
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
    let htmlObject = document.getElementById('chartmeasuretext');
    if (htmlObject === null) {
        htmlObject = createElement('text', { id: 'chartmeasuretext' });
        document.body.appendChild(htmlObject);
    }
    htmlObject.innerHTML = text;
    htmlObject.style.position = 'absolute';
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
    constructor(id, x, y, anchor, text, transform = '', baseLine) {
        super(id);
        this.transform = '';
        this.baseLine = 'auto';
        this.x = x;
        this.y = y;
        this.anchor = anchor;
        this.text = text;
        this.transform = transform;
        this.baseLine = baseLine;
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
        this.initPrivateVariable();
        this.removeSVG();
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
    }
    createTooltipElement() {
        this.textElements = [];
        if (!this.template || this.shared) {
            // SVG element for tooltip
            let svgObject = this.renderer.createSvg({ id: this.element.id + '_svg' });
            this.element.appendChild(svgObject);
            // Group to hold text and path.
            let groupElement = this.renderer.createGroup({ id: this.element.id + '_group' });
            svgObject.appendChild(groupElement);
            let pathElement = this.renderer.drawPath({
                'id': this.element.id + '_path', 'stroke-width': this.border.width,
                'fill': this.fill || this.themeStyle.tooltipFill, 'opacity': this.opacity,
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
            let headerSize = measureText(this.header, this.textStyle).height + (this.marginY * 2) +
                (isBottom ? this.arrowPadding : 0); //header padding;
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
        svgObject.setAttribute('height', (rect.height + this.border.width + (!((!this.inverted)) ? 0 : this.arrowPadding)).toString());
        svgObject.setAttribute('width', (rect.width + this.border.width + (((!this.inverted)) ? 0 : this.arrowPadding)).toString());
        svgObject.setAttribute('opacity', '1');
        pathElement.setAttribute('d', findDirection(this.rx, this.ry, pointRect, arrowLocation, this.arrowPadding, isTop, isBottom, isLeft, tipLocation.x, tipLocation.y, this.tipRadius));
        if (this.enableShadow) {
            // To fix next chart initial tooltip opacity issue in tab control
            let shadowId = this.element.id + '_shadow';
            pathElement.setAttribute('filter', Browser.isIE ? '' : 'url(#' + shadowId + ')');
            let shadow = '<filter id="' + shadowId + '" height="130%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"/>';
            shadow += '<feOffset dx="3" dy="3" result="offsetblur"/><feComponentTransfer><feFuncA type="linear" slope="0.5"/>';
            shadow += '</feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
            let defElement = this.renderer.createDefs();
            defElement.setAttribute('id', 'SVG_tooltip_definition');
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
    renderText(isRender) {
        let height = 0;
        let width = 0; // Padding for text;
        let subWidth = 0;
        let size;
        let lines;
        let key = 'properties';
        let font = extend({}, this.textStyle, null, true)[key];
        let groupElement = getElement(this.element.id + '_group');
        let tspanElement;
        let tspanStyle = '';
        let line;
        let tspanOption;
        this.findFormattedText();
        let headerContent = this.header.replace(/<b>/g, '').replace(/<\/b>/g, '').trim();
        let headerSpace = (headerContent !== '') ? this.marginY : 0;
        let isRow = true;
        let isColumn = true;
        this.markerPoint = [];
        let markerSize = (this.shapes.length > 0) ? 10 : 0;
        let markerPadding = (this.shapes.length > 0) ? 5 : 0;
        let spaceWidth = 4;
        let fontSize = '13px';
        let fontWeight = 'Normal';
        let labelColor = this.themeStyle.tooltipLightLabel;
        let dy = (22 / parseFloat(fontSize)) * (parseFloat(font.size));
        if (!isRender) {
            removeElement(this.element.id + '_text');
            removeElement(this.element.id + '_header_path');
            removeElement(this.element.id + '_trackball_group');
            removeElement('SVG_tooltip_definition');
        }
        let options = new TextOption(this.element.id + '_text', this.marginX * 2, (this.marginY * 2 + this.padding * 2 + (this.marginY === 2 ? 3 : 0)), 'start', '');
        let parentElement = textElement(options, font, null, groupElement);
        for (let k = 0, pointsLength = this.formattedText.length; k < pointsLength; k++) {
            let textCollection = this.formattedText[k].replace(/<(b|strong)>/g, '<b>')
                .replace(/<\/(b|strong)>/g, '</b>')
                .split(/<br.*?>/g);
            if (textCollection[0] === '') {
                continue;
            }
            size = measureText(this.formattedText[k], font);
            if ((k !== 0) || (headerContent === '')) {
                this.markerPoint.push((headerContent !== '' ? (this.marginY) : 0) + options.y + height);
            }
            for (let i = 0, len = textCollection.length; i < len; i++) { // string value of unicode for LTR is \u200E
                lines = textCollection[i].replace(/<b>/g, '<br><b>').replace(/<\/b>/g, '</b><br>').replace(/:/g, '<br>\u200E:<br>')
                    .split('<br>');
                subWidth = 0;
                isColumn = true;
                height += dy;
                for (let k = 0, len = lines.length; k < len; k++) {
                    line = lines[k];
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
                                tspanOption = { x: (headerContent === '') ? ((this.marginX * 2) + (markerSize + markerPadding))
                                        : (this.marginX * 2) };
                            }
                            else {
                                tspanOption = {};
                            }
                        }
                        isColumn = false;
                        tspanElement = this.renderer.createTSpan(tspanOption, '');
                        parentElement.appendChild(tspanElement);
                        if (line.indexOf('<b>') > -1) {
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
                        if (line.indexOf('</b>') > -1) {
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
        if (headerContent !== '' && element) {
            font.fontWeight = 'bold';
            let width = (this.elementSize.width + (2 * this.padding)) / 2 - measureText(headerContent, font).width / 2;
            element.setAttribute('x', width.toString());
        }
    }
    createTemplate(areaBounds, location) {
        let argsData = { cancel: false, name: 'tooltipRender', tooltip: this };
        this.trigger('tooltipRender', argsData);
        let parent = document.getElementById(this.element.id);
        let firstElement = parent.firstElementChild;
        if (firstElement) {
            remove(firstElement);
        }
        if (!argsData.cancel) {
            let templateElement = this.templateFn(this.data);
            let elem = createElement('div', { id: this.element.id + 'parent_template' });
            while (templateElement && templateElement.length > 0) {
                elem.appendChild(templateElement[0]);
            }
            parent.appendChild(elem);
            let rect = this.element.getBoundingClientRect();
            this.padding = 0;
            this.elementSize = new Size(rect.width, rect.height);
            let tooltipRect = this.tooltipLocation(areaBounds, location, new TooltipLocation(0, 0), new TooltipLocation(0, 0));
            if (this.enableAnimation && !this.shared && !this.isFirst) {
                this.animateTooltipDiv(this.element, tooltipRect);
            }
            else {
                this.updateDiv(this.element, tooltipRect.x, tooltipRect.y);
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
    tooltipLocation(bounds, symbolLocation, arrowLocation, tipLocation) {
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
            duration: 300,
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
        let tooltipElement = getElement(this.element.id);
        if (tooltipElement) {
            let tooltipGroup = tooltipElement.firstChild;
            let opacity = parseFloat(tooltipGroup.getAttribute('opacity')) || 1;
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

export { TextStyle, TooltipBorder, AreaBounds, ToolLocation, Tooltip, getTooltipThemeColor };
//# sourceMappingURL=ej2-svg-base.es2015.js.map
