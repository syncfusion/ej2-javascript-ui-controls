
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BorderModel, FontModel, ColorMappingModel, LeafItemSettingsModel } from '../model/base-model';
import { createElement, compile, merge, isNullOrUndefined, remove, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { Alignment, LabelPosition } from '../utils/enum';
import { TreeMap } from '../treemap';
import { IShapes } from '../model/interface';
import { ExportType } from '../utils/enum';
/**
 * Specifies the size parameters.
 */
export class Size {
    /**
     * Defines the height in the size object.
     */
    public height: number;
    /**
     * Defines the width in the size object.
     */
    public width: number;
    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }
}
/**
 *
 * @param {string} value - specifies the text.
 * @param {number} containerSize - specifies the container size value.
 * @returns {number} - Returns the number value which is converted from string.
 */
export function stringToNumber(value: string, containerSize: number): number {
    if (value !== null && value !== undefined) {
        return value.indexOf('%') !== -1 ? (containerSize / 100) * parseInt(value, 10) : parseInt(value, 10);
    }
    return null;
}

/**
 * Internal use of type rect
 *
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
 * Internal use of rectangle options
 *
 * @private
 */
export class RectOption {
    public id: string;
    public fill: string;
    public x: number;
    public y: number;
    public height: number;
    public width: number;
    public opacity: number;
    public stroke: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    constructor(
        id: string, fill: string, border: BorderModel, opacity: number, rect: Rect, dashArray?: string
    ) {
        this.y = rect.y;
        this.x = rect.x;
        this.height = rect.height;
        this.width = rect.width;
        this.id = id;
        this.fill = fill;
        this.opacity = opacity;
        this.stroke = border.color;
        this['stroke-width'] = border.width;
        this['stroke-dasharray'] = dashArray;
    }
}

export class PathOption {
    public id: string;
    public opacity: number;
    public fill: string;
    public stroke: string;
    public ['stroke-width']: number;
    public ['stroke-dasharray']: string;
    public d: string;
    constructor(
        id: string, fill: string, width: number, color: string, opacity?: number,
        dashArray?: string, d?: string
    ) {
        this.id = id;
        this.opacity = opacity;
        this.fill = fill;
        this.stroke = color;
        this['stroke-width'] = width;
        this['stroke-dasharray'] = dashArray;
        this.d = d;
    }
}

/**
 * Function to measure the height and width of the text.
 *
 * @param  {string} text - Specifies the text.
 * @param  {FontModel} font - Specifies the font.
 * @returns {Size} - Returns the size.
 * @private
 */
export function measureText(text: string, font: FontModel): Size {
    let measureObject: HTMLElement = document.getElementById('treeMapMeasureText');
    if (measureObject === null) {
        measureObject = createElement('text', { id: 'treeMapMeasureText' });
        document.body.appendChild(measureObject);
    }
    measureObject.innerHTML = SanitizeHtmlHelper.sanitize(text);
    measureObject.style.position = 'absolute';
    measureObject.style.fontSize = font.size;
    measureObject.style.fontWeight = font.fontWeight;
    measureObject.style.fontStyle = font.fontStyle;
    measureObject.style.fontFamily = font.fontFamily;
    measureObject.style.visibility = 'hidden';
    measureObject.style.top = '-100';
    measureObject.style.left = '0';
    measureObject.style.whiteSpace = 'nowrap';
    // For bootstrap line height issue
    measureObject.style.lineHeight = 'normal';
    return new Size(measureObject.clientWidth, measureObject.clientHeight);
}

/**
 * Internal use of text options
 *
 * @private
 */
export class TextOption {
    public anchor: string;
    public id: string;
    public transform: string = '';
    public x: number;
    public y: number;
    public text: string | string[];
    public baseLine: string = 'auto';
    public connectorText: string;
    constructor(
        id?: string, x?: number, y?: number, anchor?: string, text?: string | string[], transform: string = '',
        baseLine?: string, connectorText?: string
    ) {
        this.id = id;
        this.text = text;
        this.transform = transform;
        this.anchor = anchor;
        this.x = x;
        this.y = y;
        this.baseLine = baseLine;
        this.connectorText = connectorText;
    }
}


/**
 * Trim the title text
 *
 * @param {number} maxWidth - Specifies the maximum width
 * @param {string} text - Specifies the text
 * @param {FontModel} font - Specifies the font
 * @returns {string} - Returns the string
 * @private
 */
export function textTrim(maxWidth: number, text: string, font: FontModel): string {
    let label: string = text;
    let size: number = measureText(text, font).width;
    if (size > maxWidth) {
        const textLength: number = text.length;
        for (let i: number = textLength - 1; i >= 0; --i) {
            label = text.substring(0, i) + '...';
            size = measureText(label, font).width;
            if (size <= maxWidth || label.length < 4) {
                if (label.length < 4) {
                    label = ' ';
                }
                return label;
            }
        }
    }
    return label;
}

/**
 * Specifies the location parameters.
 */

export class Location {
    /**
     * Defines the horizontal position.
     */
    public x: number;
    /**
     * Defines the vertical position.
     */
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

/**
 * Method to calculate x position of title
 *
 * @param {Rect} location - Specifies the location of text.
 * @param {Alignment} alignment - Specifies the alignment of the text.
 * @param {Size} textSize - Specifies the size of the text.
 * @param {type} type - Specifies whether the provided text is title or subtitle.
 * @returns {Location} - Returns the location of text.
 * @private
 */
export function findPosition(location: Rect, alignment: Alignment, textSize: Size, type: string): Location {
    let x: number;
    switch (alignment) {
    case 'Near':
        x = location.x;
        break;
    case 'Center':
        x = (type === 'title') ? (location.width / 2 - textSize.width / 2) :
            ((location.x + (location.width / 2)) - textSize.width / 2);
        break;
    case 'Far':
        x = (type === 'title') ? (location.width - location.y - textSize.width) :
            ((location.x + location.width) - textSize.width);
        break;
    }
    const y: number = (type === 'title') ? location.y + (textSize.height / 2) : ((location.y + location.height / 2) + textSize.height / 2);
    return new Location(x, y);
}

/**
 *
 * @param {SvgRenderer} renderer - Specifies the rendering element of the SVG.
 * @param {any} renderOptions - Specifies the settings of the text.
 * @param {string} text - Specifies the text.
 * @returns {HTMLElement} - Returns the HTML element for the text.
 */
export function createTextStyle(
    renderer: SvgRenderer, renderOptions: any, text: string
): HTMLElement {
    const htmlObject: HTMLElement = <HTMLElement>renderer.createText(renderOptions, text);
    htmlObject.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
    htmlObject.style['user-select'] = 'none';
    htmlObject.style['-moz-user-select'] = 'none';
    htmlObject.style['-webkit-touch-callout'] = 'none';
    htmlObject.style['-webkit-user-select'] = 'none';
    htmlObject.style['-khtml-user-select'] = 'none';
    htmlObject.style['-ms-user-select'] = 'none';
    htmlObject.style['-o-user-select'] = 'none';
    return htmlObject;
}

/**
 * Internal rendering of text
 *
 * @param {TextOption} options - Specifies the text option
 * @param {FontModel} font - Specifies the font model
 * @param {string} color - Specifies the color
 * @param {HTMLElement | Element} parent - Specifies the parent element of the text
 * @param {boolean} isMinus - Specifies the boolean value
 * @returns {Element} - Returns the element
 * @private
 */
export function renderTextElement(
    options: TextOption, font: FontModel, color: string, parent: HTMLElement | Element, isMinus: boolean = false
): Element {
    const renderOptions: any = {
        'font-size': font.size,
        'font-style': font.fontStyle,
        'font-family': font.fontFamily,
        'font-weight': font.fontWeight,
        'text-anchor': options.anchor,
        'transform': options.transform,
        'opacity': font.opacity,
        'dominant-baseline': options.baseLine,
        'id': options.id,
        'x': options.x,
        'y': options.y,
        'fill': color
    };
    const text: string = typeof options.text === 'string' ? options.text : isMinus ? options.text[options.text.length - 1] : options.text[0];
    let tspanElement: Element;
    const renderer: SvgRenderer = new SvgRenderer('');
    let height: number; let htmlObject: HTMLElement;
    const breadCrumbText: boolean = !isNullOrUndefined(text) && !isNullOrUndefined(options.connectorText) ?
        (text.includes(options.connectorText[1])) : false;
    if (breadCrumbText) {
        const drilledLabel: string = text;
        const spacing: number = 5;
        const drillLevelText: string[] = drilledLabel.split('#');
        for (let z: number = 0; z < drillLevelText.length; z++) {
            let drillText: string = (drillLevelText[z as number].search(options.connectorText) !== -1 &&
                                     !isNullOrUndefined(options.connectorText)) ?
                options.connectorText : drillLevelText[z as number];
            renderOptions['id'] = options.id + '_' + z;
            htmlObject = createTextStyle(renderer, renderOptions, drillText);
            if (z % 2 === 0 && z !== 0) {
                const re: RegExp = /\s+/g;
                drillText = drillText.replace(re, '&nbsp');
            }
            const size: Size = measureText(drillText, font);
            renderOptions['x'] = z !== 0 ? renderOptions['x'] + size.width : renderOptions['x'] + size.width + spacing;
            parent.appendChild(htmlObject);
        }
    } else {
        htmlObject = createTextStyle(renderer, renderOptions, text);
        parent.appendChild(htmlObject);
    }
    if (typeof options.text !== 'string' && options.text.length > 1) {
        for (let i: number = 1, len: number = options.text.length; i < len; i++) {
            height = (measureText(options.text[i as number], font).height);
            tspanElement = renderer.createTSpan(
                {
                    'x': options.x, 'id': options.id,
                    'y': (options.y) + (i * height)
                },
                options.text[i as number]);
            htmlObject.appendChild(tspanElement);
        }
        parent.appendChild(htmlObject);
    }
    return htmlObject;
}

/**
 *
 * @param {string} targetId - Specifies the id of the element to which template is to be appended.
 * @param {Element} targetElement - Specifies the element to which template is to be appended.
 * @param {string} contentItemTemplate - Specifies the content to be appended as template.
 * @returns {void}
 */
export function setItemTemplateContent(targetId: string, targetElement: Element, contentItemTemplate: string): void {
    const itemSelect: string = targetId.split('_RectPath')[0];
    let itemTemplate: Element;
    if (targetId.indexOf('_LabelTemplate') > -1) {
        itemTemplate = targetElement;
    } else {
        itemTemplate = document.querySelector('#' + itemSelect + '_LabelTemplate');
    }
    if (!isNullOrUndefined(itemTemplate)) {
        itemTemplate.innerHTML = contentItemTemplate;
    }
}

/**
 *
 * @param {string} id - Specifies the id of the element.
 * @returns {Element} - Returns the element.
 */
export function getElement(id: string): Element {
    return document.getElementById(id);
}
/**
 *
 * @param {any} a - Specifies the first order of TreeMap leaf elements.
 * @param {any} b - Specifies the second order of TreeMap leaf elements.
 * @returns {number} - Returns the order of the TreeMap leaf element.
 */
export function itemsToOrder(a: any, b: any): number {
    return a['weight'] === b['weight'] ? 0 : a['weight'] < b['weight'] ? 1 : -1;
}

/**
 *
 * @param {string[]} source - Specifies the data from the data source.
 * @param {string} pathName - Specifies the path name in the data source.
 * @param {any} processData - Specifies the data source object.
 * @param {TreeMap} treemap - Specifies the treemap instance.
 * @returns {boolean} - Specifies whether data is available in the data source or not.
 */
export function isContainsData(source: string[], pathName: string, processData: any, treemap: TreeMap): boolean {
    let isExist: boolean = false; let name: string = ''; let path: string;
    const leaf: LeafItemSettingsModel = treemap.leafItemSettings; for (let i: number = 0; i < source.length; i++) {
        path = treemap.levels[i as number] ? treemap.levels[i as number].groupPath : leaf.labelPath ? leaf.labelPath :
            treemap.weightValuePath;
        const data: string = processData[path as string] || 'undefined';
        if (source[i as number] === data) {
            name += data + (i === source.length - 1 ? '' : '#');
            if (name === pathName) {
                isExist = true;
                break;
            }
        }
    }
    return isExist;
}

/**
 *
 * @param {any} data - Specifies the data to which the children elements to be found.
 * @returns {any} - Returns the children elements of the TreeMap leaf element.
 */
export function findChildren(data: any): any {
    let children: any;
    if (data) {
        const keys: string[] = Object.keys(data);
        children = {};
        for (let i: number = 0; i < keys.length; i++) {
            if (data[keys[i as number]] instanceof Array) {
                children['values'] = data[keys[i as number]];
                children['key'] = keys[i as number];
                break;
            }
        }
    }
    return children;
}

/**
 *
 * @param {any} data - Specifies the data to which highlight must be done.
 * @param {items} items - Specifies the data source items.
 * @param {string} mode - Specifies the mode of highlight.
 * @param {TreeMap} treeMap - Specifies the treemap instance.
 * @returns {string[]} - Returns the highlighted items.
 */
export function findHightLightItems(data: any, items: string[], mode: string, treeMap: TreeMap): string[] {
    if (mode === 'Child') {
        items.push(data['levelOrderName']);
        const children: any[] = findChildren(data)['values'];
        if (children && children.length > 0) {
            for (let i: number = 0; i < children.length; i++) {
                if (items.indexOf(children[i as number]['levelOrderName']) === -1) {
                    items.push(children[i as number]['levelOrderName']);
                }
            }
            for (let j: number = 0; j < children.length; j++) {
                findHightLightItems(children[j as number], items, mode, treeMap);
            }
        }
    } else if (mode === 'Parent') {
        if (typeof data['levelOrderName'] === 'string' && items.indexOf(data['levelOrderName']) === -1) {
            items.push(data['levelOrderName']);
            findHightLightItems(data['parent'], items, mode, treeMap);
        }
    } else if (mode === 'All') {
        const parentName: string = (data['levelOrderName'] as string).split('#')[0];
        let currentItem: any;
        for (let i: number = 0; i < treeMap.layout.renderItems.length; i++) {
            currentItem = treeMap.layout.renderItems[i as number];
            if ((currentItem['levelOrderName']).indexOf(parentName) > -1 && items.indexOf(currentItem['levelOrderName']) === -1) {
                items.push(currentItem['levelOrderName']);
            }
        }
    } else {
        items.push(data['levelOrderName']);
    }
    return items;
}

/**
 * Function to compile the template function for maps.
 *
 * @param {string} template - Specifies the template
 * @returns {Function} - Returns the template function
 * @private
 */
export function getTemplateFunction(template: string | Function): any {
    let templateFn: any = null;
    try {
        if (typeof template !== 'function' && document.querySelectorAll(template).length) {
            templateFn = compile(document.querySelector(template).innerHTML.trim());
        } else {
            templateFn = compile(template);
        }
    } catch (e) {
        templateFn = compile(template);
    }
    return templateFn;
}

/**
 * @private
 * @param {HTMLCollection} element - Specifies the element
 * @param {string} labelId - Specifies the label id
 * @param {Object} data - Specifies the data
 * @returns {HTMLElement} - Returns the element
 */
export function convertElement(element: HTMLCollection, labelId: string, data: any): HTMLElement {
    const childElement: HTMLElement = createElement('div', {
        id: labelId
    });
    childElement.style.cssText = 'position: absolute;pointer-events: auto;';
    let elementLength: number = element.length;
    while (elementLength > 0) {
        childElement.appendChild(element[0]);
        elementLength--;
    }
    let templateHtml: string = childElement.innerHTML;
    const keys: any[] = Object.keys(data);
    for (let i: number = 0; i < keys.length; i++) {
        const regExp: RegExpConstructor = RegExp;
        templateHtml = templateHtml.replace(new regExp('{{:' + <string>keys[i as number] + '}}', 'g'), data[keys[i as number].toString()]);
    }
    childElement.innerHTML = templateHtml;
    return childElement;
}

/**
 *
 * @param {Rect} rect - Specifies the area.
 * @param {LabelPosition} position - Specifies the position
 * @param {Size} labelSize - Specifies the label size.
 * @param {string} type - Specifies the type.
 * @param {TreeMap} treemap - Specifies the treemap instance.
 * @returns {Location} - Returns the text location.
 */
export function findLabelLocation(rect: Rect, position: LabelPosition, labelSize: Size, type: string, treemap: TreeMap): Location {
    const location: Location = new Location(0, 0);
    const padding: number = 5;
    const paddings: number = 2;
    const x: number = (type === 'Template') ? treemap.areaRect.x : 0;
    const y: number = (type === 'Template') ? treemap.areaRect.y : 0;
    location.x = (Math.abs(x - ((position.indexOf('Left') > -1) ? rect.x + padding : !(position.indexOf('Right') > -1) ?
        rect.x + ((rect.width / 2) - (labelSize.width / 2)) : (rect.x + rect.width) - labelSize.width))) - paddings;
    if (treemap.enableDrillDown && (treemap.renderDirection === 'BottomLeftTopRight'
        || treemap.renderDirection === 'BottomRightTopLeft')) {
        location.y = Math.abs((rect.y + rect.height) - labelSize.height + padding);
    } else {
        location.y = Math.abs(y - ((position.indexOf('Top') > -1) ? (type === 'Template' ? rect.y : rect.y + labelSize.height) :
            !(position.indexOf('Bottom') > -1) ? type === 'Template' ? (rect.y + ((rect.height / 2) - (labelSize.height / 2))) :
                (rect.y + (rect.height / 2) + labelSize.height / 4) : (rect.y + rect.height) - labelSize.height));
    }

    return location;
}

/**
 *
 * @param {HTMLElement} element - Specifies the element to be measured.
 * @param {HTMLElement} parentElement - Specifies the parent element of the element to be measured.
 * @returns {Size} - Returns the element size.
 */
export function measureElement(element: HTMLElement, parentElement: HTMLElement): Size {
    const size: Size = new Size(0, 0);
    parentElement.appendChild(element);
    size.height = element.offsetHeight;
    size.width = element.offsetWidth;
    const measureElementId: HTMLElement = document.getElementById(element.id);
    measureElementId.parentNode.removeChild(measureElementId);
    return size;
}

/**
 *
 * @param {Rect} rect - Specifies the area.
 * @returns {number} - Returns the area width.
 */
export function getArea(rect: Rect): number {
    return (rect.width - rect.x) * (rect.height - rect.y);
}
/**
 *
 * @param {Rect} input - Specifies input for the calculation.
 * @returns {number} - Returns the shortest edge.
 */
export function getShortestEdge(input: Rect): number {
    const container: Rect = convertToContainer(input);
    const width: number = container.width;
    const height: number = container.height;
    const result: number = Math.min(width, height);
    return result;
}
/**
 *
 * @param {Rect} rect - Specifies the rectangle bounds of the container.
 * @returns {Rect} - Returns the rectangle bounds.
 */
export function convertToContainer(rect: Rect): Rect {
    const x: number = rect.x;
    const y: number = rect.y;
    const width: number = rect.width;
    const height: number = rect.height;
    return {
        x: x,
        y: y,
        width: width - x,
        height: height - y
    };
}
/**
 *
 * @param {Rect} container - Specifies the rectangle bounds of the container.
 * @returns {Rect} - Returns the rectangle bounds.
 */
export function convertToRect(container: Rect): Rect {
    const xOffset: number = container.x;
    const yOffset: number = container.y;
    const width: number = container.width;
    const height: number = container.height;
    return {
        x: xOffset,
        y: yOffset,
        width: xOffset + width,
        height: yOffset + height
    };
}
/**
 *
 * @param {number} pageX - Specifies the horizontal position of the mouse location.
 * @param {number} pageY - Specifies the vertical position of the mouse location.
 * @param {Element} element - Specifies the element to which the click is done.
 * @returns {Location} - Returns the clicked location.
 */
export function getMousePosition(pageX: number, pageY: number, element: Element): Location {
    const elementRect: ClientRect = element.getBoundingClientRect();
    const pageXOffset: number = element.ownerDocument.defaultView.pageXOffset;
    const pageYOffset: number = element.ownerDocument.defaultView.pageYOffset;
    const clientTop: number = element.ownerDocument.documentElement.clientTop;
    const clientLeft: number = element.ownerDocument.documentElement.clientLeft;
    const positionX: number = elementRect.left + pageXOffset - clientLeft;
    const positionY: number = elementRect.top + pageYOffset - clientTop;
    return new Location((pageX - positionX), (pageY - positionY));
}
/**
 *
 * @param {ColorMappingModel[]} colorMapping - Specifies the color mapping instance.
 * @param {string} equalValue - Specifies the equal value.
 * @param {number | string} value - Specifies the range value.
 * @returns {any} - Returns the color mapping object.
 * @private
 */
export function colorMap(
    colorMapping: ColorMappingModel[], equalValue: string,
    value: number | string): any {
    let fill: string; const paths: string[] = []; let opacity: string;
    if (isNullOrUndefined(equalValue) && (isNullOrUndefined(value) && isNaN(<number>value))) {
        return null;
    }
    for (let i: number = 0; i < colorMapping.length; i++) {
        let isEqualColor: boolean = false; const dataValue: number = <number>value;
        if (!isNullOrUndefined(colorMapping[i as number].from) && !isNullOrUndefined(colorMapping[i as number].to)
            && !isNullOrUndefined(colorMapping[i as number].value)) {
            if ((value >= colorMapping[i as number].from && colorMapping[i as number].to >= value) &&
                (colorMapping[i as number].value === equalValue)) {
                isEqualColor = true;
                if (Object.prototype.toString.call(colorMapping[i as number].color) === '[object Array]') {
                    fill = !isEqualColor ? colorCollections(colorMapping[i as number], dataValue) : colorMapping[i as number].color[0];
                } else {
                    fill = <string>colorMapping[i as number].color;
                }
            }
        } else if ((!isNullOrUndefined(colorMapping[i as number].from) && !isNullOrUndefined(colorMapping[i as number].to))
            || !isNullOrUndefined((colorMapping[i as number].value))) {
            if ((value >= colorMapping[i as number].from && colorMapping[i as number].to >= value)
                || (colorMapping[i as number].value === equalValue)) {
                if (colorMapping[i as number].value === equalValue) {
                    isEqualColor = true;
                }
                if (Object.prototype.toString.call(colorMapping[i as number].color) === '[object Array]') {
                    fill = !isEqualColor ? colorCollections(colorMapping[i as number], dataValue) : colorMapping[i as number].color[0];
                } else {
                    fill = <string>colorMapping[i as number].color;
                }
            }
        }
        if (((value >= colorMapping[i as number].from && value <= colorMapping[i as number].to)
            || (colorMapping[i as number].value === equalValue))
            && !isNullOrUndefined(colorMapping[i as number].minOpacity) && !isNullOrUndefined(colorMapping[i as number].maxOpacity)
            && fill) {
            opacity = deSaturationColor(colorMapping[i as number], value as number);
        }
        if ((fill === '' || isNullOrUndefined(fill))
            && isNullOrUndefined(colorMapping[i as number].from) && isNullOrUndefined(colorMapping[i as number].to)
            && isNullOrUndefined(colorMapping[i as number].minOpacity) && isNullOrUndefined(colorMapping[i as number].maxOpacity)
            && isNullOrUndefined(colorMapping[i as number].value)) {
            fill = (Object.prototype.toString.call(colorMapping[i as number].color) === '[object Array]') ?
                <string>colorMapping[i as number].color[0] : <string>colorMapping[i as number].color;
        }
        opacity = !isNullOrUndefined(opacity) ? opacity : '1';
        paths.push(fill);
    }
    for (let j: number = paths.length - 1; j >= 0; j--) {
        fill = paths[j as number];
        j = (fill) ? -1 : j;
    }
    return { fill: fill, opacity: opacity };
}

/**
 *
 * @param {ColorMappingModel} colorMapping - Specifies the color mapping object.
 * @param {number} rangeValue - Specifies the range value.
 * @returns {string} - Returns the opacity for the color mapping.
 * @private
 */
export function deSaturationColor(colorMapping: ColorMappingModel, rangeValue: number): string {
    let opacity: number = 1;
    if ((rangeValue >= colorMapping.from && rangeValue <= colorMapping.to)) {
        const ratio: number = (rangeValue - colorMapping.from) / (colorMapping.to - colorMapping.from);
        opacity = (ratio * (colorMapping.maxOpacity - colorMapping.minOpacity)) + colorMapping.minOpacity;
    }
    return opacity.toString();
}
/**
 *
 * @param {ColorMappingModel} colorMap - Specifies the color mapping object.
 * @param {number} value - Specifies the range value.
 * @returns {string} - Returns the fill color.
 */
export function colorCollections(colorMap: ColorMappingModel, value: number): string {
    const gradientFill: string = getColorByValue(colorMap, value);
    return gradientFill;
}
/**
 *
 * @param {number} r - Specifies the red color value.
 * @param {number} g - Specifies the green color value.
 * @param {number} b - Specifies the blue color value.
 * @returns {string} - Returns the fill color.
 */
export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
/**
 *
 * @param {ColorMappingModel} colorMap - Specifies the color mapping.
 * @param {number} value - Specifies the range value.
 * @returns {string} - Returns the fill color.
 */
export function getColorByValue(colorMap: ColorMappingModel, value: number): string {
    let color: string = '';
    let rbg: ColorValue;
    if (Number(value) === colorMap.from) {
        color = colorMap.color[0];
    } else if (Number(value) === colorMap.to) {
        color = colorMap.color[colorMap.color.length - 1];
    } else {
        rbg = getGradientColor(Number(value), colorMap);
        color = rgbToHex(rbg.r, rbg.g, rbg.b);
    }
    return color;
}
/**
 *
 * @param {number} value - Specifies the range value.
 * @param {ColorMappingModel} colorMap - Specifies the color mapping.
 * @returns {ColorValue} - Returns the color value object.
 */
export function getGradientColor(value: number, colorMap: ColorMappingModel): ColorValue {
    const previousOffset: number = colorMap.from;
    const nextOffset: number = colorMap.to;
    let percent: number = 0;
    const full: number = nextOffset - previousOffset; let midColor: string;
    percent = (value - previousOffset) / full; let previousColor: string; let nextColor: string;
    if (colorMap.color.length <= 2) {
        previousColor = colorMap.color[0].charAt(0) === '#' ? colorMap.color[0] : colorNameToHex(colorMap.color[0]);
        nextColor = colorMap.color[colorMap.color.length - 1].charAt(0) === '#' ?
            colorMap.color[colorMap.color.length - 1] : colorNameToHex(colorMap.color[colorMap.color.length - 1]);
    } else {
        previousColor = colorMap.color[0].charAt(0) === '#' ? colorMap.color[0] : colorNameToHex(colorMap.color[0]);
        nextColor = colorMap.color[colorMap.color.length - 1].charAt(0) === '#' ?
            colorMap.color[colorMap.color.length - 1] : colorNameToHex(colorMap.color[colorMap.color.length - 1]);
        const a: number = full / (colorMap.color.length - 1); let b: number; let c: number;

        const length: number = colorMap.color.length - 1;
        const splitColorValueOffset: any[] = []; let splitColor: any = {};
        for (let j: number = 1; j < length; j++) {
            c = j * a;
            b = previousOffset + c;
            splitColor = { b: b, color: colorMap.color[j as number] };
            splitColorValueOffset.push(splitColor);
        }
        for (let i: number = 0; i < splitColorValueOffset.length; i++) {
            if (previousOffset <= value && value <= splitColorValueOffset[i as number]['b'] && i === 0) {
                midColor = splitColorValueOffset[i as number]['color'].charAt(0) === '#' ?
                    splitColorValueOffset[i as number]['color'] : colorNameToHex(splitColorValueOffset[i as number]['color']);
                nextColor = midColor;
                percent = value < splitColorValueOffset[i as number]['b'] ? 1 - Math.abs((value - splitColorValueOffset[i as number]['b']) / a)
                    : (value - splitColorValueOffset[i as number]['b']) / a;
            } else if (splitColorValueOffset[i as number]['b'] <= value && value <= nextOffset && i === (splitColorValueOffset.length - 1)) {
                midColor = splitColorValueOffset[i as number]['color'].charAt(0) === '#' ?
                    splitColorValueOffset[i as number]['color'] : colorNameToHex(splitColorValueOffset[i as number]['color']);
                previousColor = midColor;
                percent = value < splitColorValueOffset[i as number]['b'] ?
                    1 - Math.abs((value - splitColorValueOffset[i as number]['b']) / a) : (value - splitColorValueOffset[i as number]['b']) / a;
            }
            if (i !== splitColorValueOffset.length - 1 && i < splitColorValueOffset.length) {
                if (splitColorValueOffset[i as number]['b'] <= value && value <= splitColorValueOffset[i + 1]['b']) {
                    midColor = splitColorValueOffset[i as number]['color'].charAt(0) === '#' ?
                        splitColorValueOffset[i as number]['color'] : colorNameToHex(splitColorValueOffset[i as number]['color']);
                    previousColor = midColor;
                    nextColor = splitColorValueOffset[i + 1]['color'].charAt(0) === '#' ?
                        splitColorValueOffset[i + 1]['color'] : colorNameToHex(splitColorValueOffset[i + 1]['color']);
                    percent = Math.abs((value - splitColorValueOffset[i + 1]['b'])) / a;
                }
            }
        }
    }
    return getPercentageColor(percent, previousColor, nextColor);
}
/**
 *
 * @param {number} percent - Specifies the percentage of the color.
 * @param {number} previous - Specifies the previous color.
 * @param {number} next - Specifies the next color.
 * @returns {ColorValue} - Returns the color value object.
 */
export function getPercentageColor(percent: number, previous: string, next: string): ColorValue {
    const nextColor: string = next.split('#')[1];
    const prevColor: string = previous.split('#')[1];
    const r: number = getPercentage(percent, parseInt(prevColor.substr(0, 2), 16), parseInt(nextColor.substr(0, 2), 16));
    const g: number = getPercentage(percent, parseInt(prevColor.substr(2, 2), 16), parseInt(nextColor.substr(2, 2), 16));
    const b: number = getPercentage(percent, parseInt(prevColor.substr(4, 2), 16), parseInt(nextColor.substr(4, 2), 16));
    return new ColorValue(r, g, b);
}
/**
 *
 * @param {number} percent - Specifies the percentage of the color.
 * @param {number} previous - Specifies the previous color.
 * @param {number} next - Specifies the next color.
 * @returns {number} - Returns the color value.
 */
export function getPercentage(percent: number, previous: number, next: number): number {
    const full: number = next - previous;
    return Math.round((previous + (full * percent)));
}
/**
 *
 * @param {number} maximumWidth - Specifies the length of the text.
 * @param {string} dataLabel - Specifies the label.
 * @param {FontModel} font - Specifies the font of the label.
 * @returns {string[]} - Returns the labels.
 */
export function wordWrap(maximumWidth: number, dataLabel: string, font: FontModel): string[] {
    const textCollection: string[] = dataLabel.split(' ');
    let label: string = '';
    const labelCollection: string[] = [];
    let text: string;
    for (let i: number = 0, len: number = textCollection.length; i < len; i++) {
        text = textCollection[i as number];
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
/**
 *
 * @param {number} maxWidth - Specifies the length of the text.
 * @param {string} label - Specifies the label.
 * @param {FontModel} font - Specifies the font of the label.
 * @returns {string[]} - Returns the labels.
 */
export function textWrap(maxWidth: number, label: string, font: FontModel): string[] {
    const resultText: string[] = [];
    let currentLength: number = 0;
    let totalWidth: number = measureText(label, font).width;
    const totalLength: number = label.length;
    if (maxWidth >= totalWidth) {
        resultText.push(label);
        return resultText;
    } else {
        for (let i: number = label.length; i > currentLength; i--) {
            const sliceString: string = label.slice(currentLength, i);
            totalWidth = measureText(sliceString, font).width;
            if (totalWidth <= maxWidth) {
                resultText.push(sliceString);
                currentLength += sliceString.length;
                if (totalLength === currentLength) {
                    return resultText;
                }
                i = totalLength + 1;
            }
        }
    }
    return resultText;
}
/**
 * hide function
 *
 * @param {number} maxWidth - Specifies the maximum width.
 * @param {number} maxHeight - Specifies the maximum height.
 * @param {string} text - Specifies the text.
 * @param {FontModel} font - Specifies the font.
 * @returns {string} - Returns the hidden text.
 * @private
 */
export function hide(maxWidth: number, maxHeight: number, text: string, font: FontModel): string {
    let hideText: string = text;
    const textSize: Size = measureText(text, font);
    hideText = (textSize.width > maxWidth || textSize.height > maxHeight) ? ' ' : text;
    return hideText;
}
/**
 *
 * @param {number} a - Specifies the first value of the leaf.
 * @param {number} b - Specifies the second value of the leaf.
 * @returns {number} - Returns whether values are equal or not.
 */
export function orderByArea(a: number, b: number): number {
    if (a['itemArea'] === b['itemArea']) {
        return 0;
    } else if (a['itemArea'] < b['itemArea']) {
        return 1;
    }
    return -1;
}
/**
 *
 * @param {TreeMap} treemap - Specifies the treemap instance.
 * @param {Element} element - Specifies the selected TreeMap leaf item.
 * @param {string} className -Specifies the selected class name.
 * @returns {void}
 */
export function maintainSelection(treemap: TreeMap, element: Element, className: string): void {
    const elementId: string[] = treemap.levelSelection;
    if (elementId) {
        for (let index: number = 0; index < elementId.length; index++) {
            if (element.getAttribute('id') === elementId[index as number] ||
                element.children[0].id === elementId[index as number]) {
                if (element.childElementCount > 0 && element.children[0].id.indexOf('_Group') === -1) {
                    element.children[0].setAttribute('class', className);
                    applyOptions(
                        element.childNodes[0] as SVGPathElement,
                        {
                            border: treemap.selectionSettings.border, fill: treemap.selectionSettings.fill,
                            opacity: treemap.selectionSettings.opacity
                        }
                    );
                }
            } else {
                element.setAttribute('class', '');
            }
        }
    }
}
/**
 *
 * @param {TreeMap} treemap - Specifies the treemap instance.
 * @param {Element} legendGroup - Specifies the selected element.
 * @returns {void}
 */
export function legendMaintain(treemap: TreeMap, legendGroup: Element): void {
    const elementId: string[] = treemap.legendId;
    if (elementId) {
        for (let i: number = 0; i < elementId.length; i++) {
            if (treemap.legendSettings.mode === 'Interactive') {
                for (let j: number = 0; j < legendGroup.childElementCount; j++) {
                    if (legendGroup.childNodes[j as number]['id'] === elementId[i as number] ||
                        parseFloat(legendGroup.childNodes[j as number]['id'].split('Index_')[1]) === parseFloat(elementId[i as number].split('Index_')[1])) {
                        const treemapSVGRectElement: SVGRectElement = <SVGRectElement>legendGroup.childNodes[j as number];
                        treemapSVGRectElement.setAttribute('fill', treemap.selectionSettings.fill);
                        treemapSVGRectElement.setAttribute('opacity', treemap.selectionSettings.opacity);
                        if (treemapSVGRectElement.id.indexOf('Text') === -1) {
                            treemapSVGRectElement.setAttribute('stroke-width', (treemap.selectionSettings.border.width).toString());
                            treemapSVGRectElement.setAttribute('stroke', treemap.selectionSettings.border.color);
                        } else {
                            treemapSVGRectElement.setAttribute('stroke', null);
                            treemapSVGRectElement.setAttribute('stroke-width', null);
                        }
                    }
                }
            } else {
                const legendItem: Element = document.getElementById(elementId[i as number]);
                if (!isNullOrUndefined(legendItem)) {
                    legendItem.setAttribute('fill', treemap.selectionSettings.fill);
                    legendItem.setAttribute('opacity', treemap.selectionSettings.opacity);
                    if (legendItem.id.indexOf('Text') === -1) {
                        legendItem.setAttribute('stroke', treemap.selectionSettings.border.color);
                        legendItem.setAttribute('stroke-width', (treemap.selectionSettings.border.width).toString());
                    } else {
                        legendItem.setAttribute('stroke', null);
                        legendItem.setAttribute('stroke-width', null);
                    }
                }
            }
        }
    }
}
/**
 *
 * @param {HTMLCollection} elements - Specifies the selected TreeMap element.
 * @param {string} type - Specifies the selection type.
 * @param {TreeMap} treemap - Specifies the TreeMap instance.
 * @returns {void}
 */
export function removeClassNames(elements: HTMLCollection, type: string, treemap: TreeMap): void {
    let element: SVGPathElement;
    let options: any = {};
    for (let j: number = 0; j < elements.length; j++) {
        element = isNullOrUndefined(elements[j as number].childNodes[0] as SVGPathElement) ? elements[j as number] as SVGPathElement :
            elements[j as number].childNodes[0] as SVGPathElement;
        options = treemap.layout.renderItems[parseFloat(element.id.split('_Item_Index_')[1])]['options'];
        applyOptions(element, options);
        elements[j as number].classList.remove(type);
        j -= 1;
    }
}
/**
 *
 * @param {SVGPathElement} element - Specifies the SVG path element.
 * @param {any} options - Specifies the settings for the SVG path element.
 * @returns {void}
 */
export function applyOptions(element: SVGPathElement, options: any): void {
    element.setAttribute('opacity', options['opacity']);
    if (!isNullOrUndefined(options['fill'])) {
        element.setAttribute('fill', options['fill']);
    } else {
        element.setAttribute('fill', 'black');
    }
    element.setAttribute('stroke', options['border']['color']);
    element.setAttribute('stroke-width', options['border']['width']);
}
/**
 *
 * @param {string} format - Specifies the format value.
 * @param {any} data - Specifies the data source object.
 * @param {TreeMap} treemap - Specifies the TreeMap instance.
 * @returns {string} - Returns the formatted text.
 */
export function textFormatter(format: string, data: any, treemap: TreeMap): string {
    if (isNullOrUndefined(format)) {
        return null;
    }
    const keys: string[] = Object.keys(data);
    for (const key of keys) {
        format = format.split('${' + key + '}').join(formatValue(data[key as string], treemap).toString());
    }
    return format;
}
/**
 *
 * @param {number} value - Specifies the text to be formatted.
 * @param {TreeMap} treemap - Specifies the TreeMap instance.
 * @returns {string | number} - Returns the formatted text.
 */
export function formatValue(value: number, treemap: TreeMap): string | number {
    let formatValue: string | number; let formatFunction: any;
    if (treemap.format && !isNaN(Number(value))) {
        formatFunction = treemap.intl.getNumberFormat(
            { format: treemap.format, useGrouping: treemap.useGroupingSeparator });
        formatValue = formatFunction(Number(value));
    } else {
        formatValue = value;
    }
    return formatValue ? formatValue : '';
}

/**
 * @private
 */
export class ColorValue {
    public r: number;
    public g: number;
    public b: number;
    constructor(r?: number, g?: number, b?: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
}

/**
 * @param {ColorValue} value - Specfies the color value
 * @returns {string} - Returns the string
 * @private
 */
export function convertToHexCode(value: ColorValue): string {
    return '#' + componentToHex(value.r) + componentToHex(value.g) + componentToHex(value.b);
}

/**
 * @param {number} value - Specifies the value
 * @returns {string} - Returns the string
 * @private */
export function componentToHex(value: number): string {
    const hex: string = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

/**
 * @param {string} hex - Specifies the hex value
 * @returns {ColorValue} - Returns the color value
 * @private
 */
export function convertHexToColor(hex: string): ColorValue {
    const result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new ColorValue(parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)) :
        new ColorValue(255, 255, 255);
}

/**
 * @param {string} color - Specifies the color
 * @returns {string} - Returns the string
 * @private
 */
export function colorNameToHex(color: string): string {
    color = color === 'transparent' ? 'white' : color;
    const element: HTMLElement = document.getElementById('treeMapMeasureText');
    element.style.color = color;
    color = window.getComputedStyle(element).color;
    const isRGBValue: string[] = color.replace(/[()RGBrgba ]/g, '').split(',');
    return convertToHexCode(
        new ColorValue(parseInt(isRGBValue[0], 10), parseInt(isRGBValue[1], 10), parseInt(isRGBValue[2], 10))
    );
}

/**
 * @param {Location} location - Specifies the location
 * @param {string} shape - Specifies the shape
 * @param {Size} size - Specifies the size
 * @param {string} url - Specifies the url
 * @param {PathOption} options - Specifies the options
 * @returns {Element} - Returns the element
 * @private
 */
export function drawSymbol(location: Location, shape: string, size: Size, url: string, options: PathOption): Element {
    const svgRenderer: SvgRenderer = new SvgRenderer('');
    const temp: IShapes = renderLegendShape(location, size, shape, options, url);
    const htmlElement: Element = svgRenderer['draw' + temp.functionName](temp.renderOption);
    return htmlElement;
}
/**
 * @param {Location} location - Specifies the location
 * @param {Size} size - Specifies the size
 * @param {string} shape - Specifies the shape
 * @param {PathOption} options - Specifies the path option
 * @param {string} url - Specifies the string
 * @returns {IShapes} - Returns the shapes
 * @private
 */
export function renderLegendShape(location: Location, size: Size, shape: string, options: PathOption, url: string): IShapes {
    let renderPath: string;
    let functionName: string = 'Path';
    const shapeWidth: number = size.width;
    const shapeHeight: number = size.height;
    const shapeX: number = location.x;
    const shapeY: number = location.y;
    const x: number = location.x + (-shapeWidth / 2);
    const y: number = location.y + (-shapeHeight / 2);
    switch (shape) {
    case 'Circle':
    case 'Bubble':
        functionName = 'Ellipse';
        merge(options, { 'rx': shapeWidth / 2, 'ry': shapeHeight / 2, 'cx': shapeX, 'cy': shapeY });
        break;
    case 'VerticalLine':
        renderPath = 'M' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' + 'L' + ' ' + shapeX + ' '
            + (shapeY + (-shapeHeight / 2));
        merge(options, { 'd': renderPath });
        break;
    case 'Diamond':
        renderPath = 'M' + ' ' + x + ' ' + shapeY + ' ' +
            'L' + ' ' + shapeX + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + shapeY + ' ' +
            'L' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + x + ' ' + shapeY + ' z';
        merge(options, { 'd': renderPath });
        break;
    case 'Rectangle':
        renderPath = 'M' + ' ' + x + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (shapeY + (-shapeHeight / 2)) + ' z';
        merge(options, { 'd': renderPath });
        break;
    case 'Triangle':
        renderPath = 'M' + ' ' + x + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + shapeX + ' ' + (shapeY + (-shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + x + ' ' + (shapeY + (shapeHeight / 2)) + ' z';
        merge(options, { 'd': renderPath });
        break;
    case 'InvertedTriangle':
        renderPath = 'M' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY - (shapeHeight / 2)) + ' ' +
            'L' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX - (shapeWidth / 2)) + ' ' + (shapeY - (shapeHeight / 2)) + ' ' +
            'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + (shapeY - (shapeHeight / 2)) + ' z';
        merge(options, { 'd': renderPath });
        break;
    case 'Pentagon':
        // eslint-disable-next-line no-case-declarations
        const eq: number = 72;
        // eslint-disable-next-line no-case-declarations
        let xValue: number;
        // eslint-disable-next-line no-case-declarations
        let yValue: number;
        for (let i: number = 0; i <= 5; i++) {
            xValue = (shapeWidth / 2) * Math.cos((Math.PI / 180) * (i * eq));
            yValue = (shapeWidth / 2) * Math.sin((Math.PI / 180) * (i * eq));
            if (i === 0) {
                renderPath = 'M' + ' ' + (shapeX + xValue) + ' ' + (shapeY + yValue) + ' ';
            } else {
                renderPath = renderPath.concat('L' + ' ' + (shapeX + xValue) + ' ' + (shapeY + yValue) + ' ');
            }
        }
        renderPath = renderPath.concat('Z');
        merge(options, { 'd': renderPath });
        break;
    case 'Star':
        renderPath = 'M ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + (location.x - size.width / 2)
            + ' ' + (location.y + size.height / 6) + ' L ' + (location.x + size.width / 2) + ' ' + (location.y + size.height / 6)
            + ' L ' + (location.x - size.width / 3) + ' ' + (location.y - size.height / 2) + ' L ' + location.x + ' ' +
            (location.y + size.height / 2) + ' L ' + (location.x + size.width / 3) + ' ' + (location.y - size.height / 2) + ' Z';
        merge(options, { 'd': renderPath });
        break;
    case 'Cross':
        renderPath = 'M' + ' ' + x + ' ' + shapeY + ' ' + 'L' + ' ' + (shapeX + (shapeWidth / 2)) + ' ' + shapeY + ' ' +
            'M' + ' ' + shapeX + ' ' + (shapeY + (shapeHeight / 2)) + ' ' + 'L' + ' ' + shapeX + ' ' +
            (shapeY + (-shapeHeight / 2));
        merge(options, { 'd': renderPath });
        break;
    case 'Image':
        functionName = 'Image';
        merge(options, { 'href': url, 'height': shapeHeight, 'width': shapeWidth, x: x, y: y });
        break;
    }
    return { renderOption: options, functionName: functionName };
}

/**
 *
 * @param {any} data - Specifies the data source object.
 * @param {any} item - Specifies the leaf item.
 * @returns {boolean} - Returns whether the TreeMap item is level item or leaf item.
 */
export function isParentItem(data: any[], item: any): boolean {
    let isParentItem: boolean = false;
    for (let j: number = 0; j < data.length; j++) {
        if (item['levelOrderName'] === data[j as number]['levelOrderName']) {
            isParentItem = true;
            break;
        }
    }
    return isParentItem;
}
/**
 * Specifies the data to be received through Ajax request for treemap.
 */
export class TreeMapAjax {
    /** Defines the options for the data for treemap. */
    public dataOptions: string | any;
    /** Defines the type of the data. */
    public type: string;
    /** Specifies whether the request is asynchronous or not. */
    public async: boolean;
    /** Defines the type of the content. */
    public contentType: string;
    /** Defines the data to be sent through the request. */
    public sendData: string | any;
    constructor(options: string | any, type?: string, async?: boolean, contentType?: string, sendData?: string | any) {
        this.dataOptions = options;
        this.type = type || 'GET';
        this.async = async || true;
        this.contentType = contentType;
        this.sendData = sendData;
    }
}
/**
 *
 * @param {any[]} collection - Specifies the legend collection.
 * @returns {void}
 * @private
 */
export function removeShape(collection: any[]): void {
    if (collection.length > 0) {
        for (let i: number = 0; i < collection.length; i++) {
            const item: any = collection[i as number];
            setColor(item['legendEle'], item['oldFill'], item['oldOpacity'], item['oldBorderColor'], item['oldBorderWidth']);
        }
    }
}
/**
 *
 * @param {any[]} collection - Specifies the legend collection.
 * @param {TreeMap} treeMap - Specifies the treemap instance.
 * @returns {void}
 * @private
 */
export function removeLegend(collection: any[], treeMap: TreeMap): void {
    if (collection.length > 0) {
        for (let j: number = 0; j < collection.length; j++) {
            const item: any = collection[j as number];
            const legendIndex: number = parseFloat(item['legendEle'].id.split('_Index_')[1]);
            const isText: boolean = item['legendEle'].id.indexOf('Text') > -1;
            const shapeId: string = isText ? item['legendEle'].id.replace('_Text', '') : item['legendEle'].id;
            const legendShape: Element = treeMap.legendSettings.mode === 'Interactive'
                ? document.getElementById(shapeId)
                : document.getElementById(treeMap.element.id + '_Legend_Shape_Index_' + legendIndex);
            const legendText: Element = treeMap.legendSettings.mode === 'Interactive'
                ? document.getElementById(shapeId + '_Text')
                : document.getElementById(treeMap.element.id + '_Legend_Text_Index_' + legendIndex);
            if (!isNullOrUndefined(legendShape)) {
                setColor(legendShape, item['oldFill'], item['oldOpacity'], 'none', '0px');
            }
            if (!isNullOrUndefined(legendText)) {
                setColor(legendText, treeMap.legendSettings.textStyle.color || treeMap.themeStyle.legendTextColor, item['oldOpacity'], null, null);
            }
            const dataCount: number = !isNullOrUndefined(item['ShapeCollection']) ? item['ShapeCollection']['Elements'].length : 0;
            for (let k: number = 0; k < dataCount; k++) {
                const shapeElement: Element = document.getElementById(item['ShapeCollection']['Elements'][k as number].id);
                if (!isNullOrUndefined(shapeElement)) {
                    setColor(
                        shapeElement, item['shapeOldFill'], item['shapeOldOpacity'],
                        item['shapeOldBorderColor'], item['shapeOldBorderWidth']);
                }
            }
        }
    }
}
/**
 *
 * @param {Element} element - Specifies the selected element.
 * @param {string} fill - Specifies the fill color.
 * @param {string} opacity - Specifies the opacity.
 * @param {string} borderColor - Specifies the border color.
 * @param {string} borderWidth - Specifies the border width.
 * @returns {void}
 */
export function setColor(element: Element, fill: string, opacity: string, borderColor: string, borderWidth: string): void {
    element.setAttribute('fill', fill);
    element.setAttribute('opacity', opacity);
    if (!isNullOrUndefined(borderColor)) {
        element.setAttribute('stroke', borderColor);
    }
    if (!isNullOrUndefined(borderWidth)) {
        element.setAttribute('stroke-width', borderWidth);
    }
}
/**
 *
 * @param {any[]} collection - Specifies the selected item collection.
 * @param {any[]} element - Specifies the selected element collection.
 * @param {TreeMap} treemap - Specifies the TreeMap instance.
 * @returns {void}
 */
export function removeSelectionWithHighlight(collection: any[], element: any[], treemap: TreeMap): void {
    removeLegend(collection, treemap);
    element = [];
    removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', treemap);
}
/**
 *
 * @param {number} length - Specifies the length of the legend group.
 * @param {any} item - Specifies the legend item.
 * @param {TreeMap} treemap - Specifies the TreeMap instance.
 * @returns {number} - Returns the legend index.
 */
export function getLegendIndex(length: number, item: any, treemap: TreeMap): number {
    let index: number;
    const valuePath: string = (treemap.rangeColorValuePath !== '') ? treemap.rangeColorValuePath : null;
    let indexFound: boolean = false;
    for (let i: number = 0; i < length && !indexFound; i++) {
        const dataLength: number = treemap.treeMapLegendModule.legendCollections[i as number]['legendData'].length;
        if (dataLength > 0) {
            for (let j: number = 0; j < dataLength; j++) {
                if ((!isNullOrUndefined(valuePath) && treemap.leafItemSettings.colorMapping.length > 0 ?
                    (treemap.treeMapLegendModule.legendCollections[i as number]['legendData'][j as number]['data'][valuePath as string] === item['data'][valuePath as string])
                    : treemap.treeMapLegendModule.legendCollections[i as number]['legendData'][j as number]['levelOrderName'] === item['levelOrderName']
                    || item['levelOrderName'].indexOf(treemap.treeMapLegendModule.legendCollections[i as number]['legendName']) > -1)
                ) {
                    index = i;
                    indexFound = true;
                    break;
                }
            }
        } else if (treemap.palette && treemap.palette.length > 0) {
            if ((treemap.treeMapLegendModule.legendCollections[i as number]['levelOrderName'] === item['levelOrderName'] ||
                (item['levelOrderName'].indexOf(treemap.treeMapLegendModule.legendCollections[i as number]['levelOrderName'])) > -1)
                && treemap.treeMapLegendModule.legendCollections[i as number]['legendName'] === item['name']) {
                index = i;
                break;
            }
        }
    }
    return index;
}
/**
 *
 * @param {any[]} collection - Specifies the legend collection.
 * @param {number} index - Specifies the index of legend.
 * @param {number} number - Specifies the leaf item index.
 * @param {Element} legendElement - Specifies the legend element.
 * @param {Element} shapeElement - Specifies the shape element.
 * @param {any[]} renderItems - Specifies the item index.
 * @param {any[]} legendCollection - Specifies the legend collection.
 * @returns {void}
 */
export function pushCollection(
    collection: any[], index: number, number: number, legendElement: Element, shapeElement: Element,
    renderItems: any[], legendCollection: any[]): void {
    collection.push({
        legendEle: legendElement, oldFill: legendCollection[index as number]['legendFill'],
        oldOpacity: legendCollection[index as number]['opacity'], oldBorderColor: legendCollection[index as number]['borderColor'],
        oldBorderWidth: legendCollection[index as number]['borderWidth'],
        shapeElement: shapeElement, shapeOldFill: renderItems[number as number]['options']['fill'],
        shapeOldOpacity: renderItems[number as number]['options']['opacity'],
        shapeOldBorderColor: renderItems[number as number]['options']['border']['color'],
        shapeOldBorderWidth: renderItems[number as number]['options']['border']['width']
    });
}

/**
 * To trigger the download element
 *
 * @param {string} fileName - Specifies the file name
 * @param {ExportType} type - Specifies the type
 * @param {string} url - Specifies the url
 * @param {boolean} isDownload - Specifies the boolean value
 * @returns {void}
 * @private
 */
export function triggerDownload(fileName: string, type: ExportType, url: string, isDownload: boolean): void {
    createElement('a', {
        attrs: {
            'download': fileName + '.' + (type as string).toLocaleLowerCase(),
            'href': url
        }
    }).dispatchEvent(new MouseEvent(isDownload ? 'click' : 'move', {
        view: window,
        bubbles: false,
        cancelable: true
    }));
}
/**
 *
 * @param {string} id - Specifies the id of the element to be removed.
 * @returns {void}
 */
export function removeElement(id: string): void {
    const element: Element = document.getElementById(id);
    return element ? remove(element) : null;
}
