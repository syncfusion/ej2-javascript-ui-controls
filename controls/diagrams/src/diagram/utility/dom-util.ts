import { PointModel } from '../primitives/point-model';
import { Rect } from '../primitives/rect';
import { Size } from '../primitives/size';
import { TextStyleModel } from './../core/appearance-model';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { processPathData, splitArrayCollection, transformPath } from './path-util';
import { whiteSpaceToString, wordBreakToString, textAlignToString, bBoxText } from './base-util';
import { Matrix, identityMatrix, transformPointByMatrix, rotateMatrix } from '../primitives/matrix';
import { ITouches } from '../objects/interface/interfaces';
import { compile, createElement, Browser } from '@syncfusion/ej2-base';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { DiagramNativeElement } from '../core/elements/native-element';
import { BaseAttributes, TextAttributes, SubTextElement, TextBounds } from '../rendering/canvas-interface';
import { getElement } from './diagram-util';

/**
 * Defines the functionalities that need to access DOM
 */

/** @private */
export function findSegmentPoints(element: PathElement): PointModel[] {
    let pts: PointModel[] = [];
    let sample: SVGPoint; let sampleLength: number;
    let measureElement: string = 'measureElement';
    window[measureElement].style.visibility = 'visible';
    let svg: SVGSVGElement = window[measureElement].children[2];
    let pathNode: SVGPathElement = getChildNode(svg)[0] as SVGPathElement;
    pathNode.setAttributeNS(null, 'd', element.data);
    let pathBounds: Rect = element.absoluteBounds; // || pathNode.getBBox();
    let pathData: string = updatePath(element, pathBounds, element);
    pathNode.setAttributeNS(null, 'd', pathData);
    let pathLength: number = pathNode.getTotalLength();
    for (sampleLength = 0; sampleLength <= pathLength; sampleLength += 10) {
        sample = pathNode.getPointAtLength(sampleLength);
        pts.push({ x: sample.x, y: sample.y });
    }
    window[measureElement].style.visibility = 'hidden';
    return pts;

}
export function getChildNode(node: SVGElement): SVGElement[] | HTMLCollection {
    let child: SVGElement;
    let collection: SVGElement[] | HTMLCollection = [];
    if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
        for (let i: number = 0; i < node.childNodes.length; i++) {
            child = node.childNodes[i] as SVGElement;
            if (child.nodeType === 1) {
                collection.push(child);
            }
        }
    } else {
        collection = node.children;
    }
    return collection;
}
export function translatePoints(element: PathElement, points: PointModel[]): PointModel[] {
    let translatedPts: PointModel[] = [];
    for (let point of points) {
        let pt1: PointModel = {
            x: element.offsetX - element.actualSize.width * element.pivot.x + point.x,
            y: element.offsetY - element.actualSize.height * element.pivot.y + point.y
        };
        let matrix: Matrix;
        let angle: number = element.rotateAngle + element.parentTransform;
        if (angle) {
            matrix = identityMatrix();
            rotateMatrix(matrix, angle, element.offsetX, element.offsetY);
        }
        if (matrix) {
            pt1 = transformPointByMatrix(matrix, pt1);
        }
        translatedPts.push(pt1);
    }
    return translatedPts;

}

/** @private */
export function measurePath(data: string): Rect {
    if (data) {
        let measureElement: string = 'measureElement';
        window[measureElement].style.visibility = 'visible';
        let svg: SVGSVGElement = window[measureElement].children[2];
        let element: SVGPathElement = getChildNode(svg)[0] as SVGPathElement;
        element.setAttribute('d', data);
        let bounds: SVGRect = element.getBBox();
        let svgBounds: Rect = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        window[measureElement].style.visibility = 'hidden';
        return svgBounds;
    }
    return new Rect(0, 0, 0, 0);
}


function getTextOptions(element: TextElement, maxWidth?: number): BaseAttributes {
    let options: BaseAttributes = {
        fill: element.style.fill, stroke: element.style.strokeColor, angle: element.rotateAngle + element.parentTransform,
        pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: element.style.strokeWidth,
        dashArray: element.style.strokeDashArray, opacity: element.style.opacity, shadow: element.shadow,
        gradient: element.style.gradient, visible: element.visible, id: element.id, description: element.description,
        width: maxWidth || element.actualSize.width, height: element.actualSize.height,
        x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
        y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5
    };
    (options as TextAttributes).fontSize = element.style.fontSize;
    (options as TextAttributes).fontFamily = element.style.fontFamily;
    (options as TextAttributes).textOverflow = element.style.textOverflow;
    (options as TextAttributes).textDecoration = element.style.textDecoration;
    (options as TextAttributes).doWrap = element.doWrap;
    (options as TextAttributes).whiteSpace = whiteSpaceToString(element.style.whiteSpace, element.style.textWrapping);
    (options as TextAttributes).content = element.content;
    (options as TextAttributes).textWrapping = element.style.textWrapping;
    (options as TextAttributes).breakWord = wordBreakToString(element.style.textWrapping);
    (options as TextAttributes).textAlign = textAlignToString(element.style.textAlign);
    (options as TextAttributes).color = element.style.color;
    (options as TextAttributes).italic = element.style.italic;
    (options as TextAttributes).bold = element.style.bold;
    options.dashArray = ''; options.strokeWidth = 0; options.fill = '';
    return options;
}


function wrapSvgText(text: TextAttributes, textValue?: string): SubTextElement[] {
    let childNodes: SubTextElement[] = []; let k: number = 0;
    let txtValue: string; let bounds1: number;
    let content: string = textValue || text.content;
    if (text.whiteSpace !== 'nowrap' && text.whiteSpace !== 'pre') {
        if (text.breakWord === 'breakall') {
            txtValue = '';
            txtValue += content[0];
            for (k = 0; k < content.length; k++) {
                bounds1 = bBoxText(txtValue, text);
                if (bounds1 >= text.width && txtValue.length > 0) {
                    childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: bounds1 };
                    txtValue = '';
                } else {
                    txtValue = txtValue + (content[k + 1] || '');
                    if (txtValue.indexOf('\n') > -1) {
                        txtValue = txtValue.replace('\n', '');
                    }
                    let width: number = bBoxText(txtValue, text);
                    if (Math.ceil(width) + 2 >= text.width && txtValue.length > 0) {
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                        txtValue = '';
                    }
                    if (k === content.length - 1 && txtValue.length > 0) {
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                        txtValue = '';
                    }
                }
            }
        } else {
            childNodes = wordWrapping(text, textValue);
        }
    } else {
        childNodes[childNodes.length] = { text: content, x: 0, dy: 0, width: bBoxText(content, text) };
    }
    return childNodes;
}

function wordWrapping(text: TextAttributes, textValue?: string): SubTextElement[] {
    let childNodes: SubTextElement[] = []; let txtValue: string = ''; let j: number = 0;
    let i: number = 0; let wrap: boolean = text.whiteSpace !== 'nowrap' ? true : false;
    let content: string = textValue || text.content;
    let eachLine: string[] = content.split('\n'); let txt: string;
    let words: Object[]; let newText: string;

    let existingWidth: number;
    let existingText: string;
    for (j = 0; j < eachLine.length; j++) {
        txt = '';
        words = text.textWrapping !== 'NoWrap' ? eachLine[j].split(' ') : eachLine;
        for (i = 0; i < words.length; i++) {
            txtValue += (((i !== 0 || words.length === 1) && wrap && txtValue.length > 0) ? ' ' : '') + words[i];
            newText = txtValue + (words[i + 1] || '');
            let width: number = bBoxText(newText, text);
            if (Math.floor(width) > text.width - 2 && txtValue.length > 0) {
                childNodes[childNodes.length] = {
                    text: txtValue, x: 0, dy: 0,
                    width: newText === txtValue ? width : (txtValue === existingText) ? existingWidth : bBoxText(txtValue, text)
                };
                txtValue = '';
            } else {
                if (i === words.length - 1) {
                    childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                    txtValue = '';
                }
            }
            existingText = newText;
            existingWidth = width;
        }
    }
    return childNodes;
}

function wrapSvgTextAlign(text: TextAttributes, childNodes: SubTextElement[]): TextBounds {
    let wrapBounds: TextBounds = { x: 0, width: 0 };
    let k: number = 0; let txtWidth: number;
    let width: number;
    for (k = 0; k < childNodes.length; k++) {
        txtWidth = childNodes[k].width;
        width = txtWidth;
        if (text.textAlign === 'left') {
            txtWidth = 0;
        } else if (text.textAlign === 'center') {
            if (txtWidth > text.width && (text.textOverflow === 'Ellipsis' || text.textOverflow === 'Clip')) {
                txtWidth = 0;
            } else {
                txtWidth = -txtWidth / 2;
            }
        } else if (text.textAlign === 'right') {
            txtWidth = -txtWidth;
        } else {
            txtWidth = childNodes.length > 1 ? 0 : -txtWidth / 2;
        }
        childNodes[k].dy = text.fontSize * 1.2;
        childNodes[k].x = txtWidth;
        if (!wrapBounds) {
            wrapBounds = {
                x: txtWidth,
                width: width
            };
        } else {
            wrapBounds.x = Math.min(wrapBounds.x, txtWidth);
            wrapBounds.width = Math.max(wrapBounds.width, width);
        }
    }
    return wrapBounds;
}

export function measureHtmlText(style: TextStyleModel, content: string, width: number, height: number, maxWidth?: number): Size {
    let bounds: Size = new Size();
    let text: HTMLElement = createHtmlElement('span', { 'style': 'display:inline-block; line-height: normal' });
    if (style.bold) {
        text.style.fontWeight = 'bold';
    }
    if (style.italic) {
        text.style.fontStyle = 'italic';
    }
    if (width !== undefined) {
        text.style.width = width.toString() + 'px';
    }
    if (height !== undefined) {
        text.style.height = height.toString() + 'px';
    }
    if (maxWidth !== undefined) {
        text.style.maxWidth = maxWidth.toString() + 'px';
    }
    text.style.fontFamily = style.fontFamily;
    text.style.fontSize = style.fontSize + 'px';
    text.style.color = style.color;
    text.textContent = content;
    text.style.whiteSpace = whiteSpaceToString(style.whiteSpace, style.textWrapping);
    if (maxWidth !== undefined) {
        text.style.wordBreak = 'break-word';
    } else {
        text.style.wordBreak = wordBreakToString(style.textWrapping);
    }
    document.body.appendChild(text);
    bounds.width = text.offsetWidth;
    bounds.height = text.offsetHeight;
    document.body.removeChild(text);
    return bounds;
}


/** @private */
export function measureText(
    text: TextElement, style: TextStyleModel, content: string,
    maxWidth?: number, textValue?: string): Size {
    let bounds: Size = new Size(0, 0);
    let childNodes: SubTextElement[];
    let wrapBounds: TextBounds;
    let options: TextAttributes = getTextOptions(text, maxWidth) as TextAttributes;
    text.childNodes = childNodes = wrapSvgText(options, textValue);
    text.wrapBounds = wrapBounds = wrapSvgTextAlign(options, childNodes);
    bounds.width = wrapBounds.width;
    bounds.height = childNodes.length * text.style.fontSize;
    return bounds;
}

/** @private */
export function measureImage(source: string, contentSize: Size): Size {
    let measureElement: string = 'measureElement';
    window[measureElement].style.visibility = 'visible';
    let imageElement: HTMLImageElement = window[measureElement].children[1];
    imageElement.setAttribute('src', source);
    let bounds: ClientRect = imageElement.getBoundingClientRect();
    let width: number = bounds.width;
    let height: number = bounds.height;
    contentSize = new Size(width, height);
    window[measureElement].style.visibility = 'hidden';
    return contentSize;
}

/** @private */
export function measureNativeContent(nativeContent: SVGElement): Rect {
    let measureElement: string = 'measureElement';
    window[measureElement].style.visibility = 'visible';
    let nativeSVG: SVGSVGElement = window[measureElement].children[2];
    nativeSVG.appendChild(nativeContent);
    let bounds: ClientRect = nativeContent.getBoundingClientRect();
    let svgBounds: ClientRect = nativeSVG.getBoundingClientRect();
    let rect: Rect = bounds as Rect;
    rect.x = bounds.left - svgBounds.left;
    rect.y = bounds.top - svgBounds.top;
    nativeSVG.removeChild(nativeContent);
    window[measureElement].style.visibility = 'hidden';
    return rect;
}

/**
 * @private
 */
export function measureNativeSvg(nativeContent: SVGElement): Rect {
    let measureElement: string = 'measureElement';
    window[measureElement].style.visibility = 'visible';
    let nativeSVG: SVGSVGElement = window[measureElement].children[2];
    nativeSVG.appendChild(nativeContent);
    let svgBounds: Rect = nativeSVG.getBoundingClientRect() as Rect;
    nativeSVG.removeChild(nativeContent);
    window[measureElement].style.visibility = 'hidden';
    return svgBounds;
}

/** @private */
export function updatePath(element: PathElement, bounds: Rect, child: PathElement): string {
    let initX: number = 0; let initY: number = 0;
    let scaleX: number = 0; let scaleY: number = 0; let isScale: boolean = false;
    let bBox: Rect; let isInit: boolean; let isResizing: boolean = true; let newPathString: string = '';
    let arrayCollection: Object[] = [];
    bBox = bounds;
    if (initX !== bBox.x || initY !== bBox.y) {
        scaleX = initX - Number(bBox.x);
        scaleY = initY - Number(bBox.y);
    }
    if (element.actualSize.width !== bBox.width || element.actualSize.height !== bBox.height) {
        scaleX = element.actualSize.width / Number(bBox.width ? bBox.width : 1);
        scaleY = element.actualSize.height / Number(bBox.height ? bBox.height : 1);
        isScale = true;
    }
    arrayCollection = processPathData(element.data);
    arrayCollection = splitArrayCollection(arrayCollection);
    newPathString = transformPath(arrayCollection, scaleX, scaleY, isScale, bBox.x, bBox.y, initX, initY);
    isScale = false;
    return newPathString;
}

/** @private */
export function getDiagramLayerSvg(diagramId: string): SVGSVGElement {
    let diagramLayerSvg: SVGSVGElement;
    let diagramElement: HTMLElement = getDiagramElement(diagramId);
    let elementcoll: NodeList;
    elementcoll = diagramElement.getElementsByClassName('e-diagram-layer');
    diagramLayerSvg = elementcoll[0] as SVGSVGElement;
    return diagramLayerSvg;
}

/** @private */
export function getDiagramElement(elementId: string, contentId?: string): HTMLElement {
    let diagramElement: HTMLElement; let element: HTMLElement;
    if (contentId) { element = document.getElementById(contentId); }
    diagramElement = (element) ? element.querySelector('#' + elementId) as HTMLElement : document.getElementById(elementId);
    return diagramElement;
}

/**
 * @private
 */
export function getAdornerLayerSvg(diagramId: string): SVGSVGElement {
    let adornerLayerSvg: SVGSVGElement = null;
    let diagramElement: HTMLElement = getDiagramElement(diagramId);
    let elementcoll: NodeList;
    elementcoll = diagramElement.getElementsByClassName('e-adorner-layer');
    adornerLayerSvg = elementcoll[0] as SVGSVGElement;
    return adornerLayerSvg;
}

/** @private */
export function getSelectorElement(diagramId: string): SVGElement {
    let adornerLayer: SVGElement = null;
    let adornerSvg: SVGSVGElement = getAdornerLayerSvg(diagramId);
    adornerLayer = adornerSvg.getElementById(diagramId + '_SelectorElement') as SVGElement;
    return adornerLayer;
}

/**
 * @private
 */
export function getAdornerLayer(diagramId: string): SVGElement {
    let adornerLayer: SVGElement = null;
    let diagramAdornerSvg: SVGSVGElement = getAdornerLayerSvg(diagramId);
    adornerLayer = diagramAdornerSvg.getElementById(diagramId + '_diagramAdorner') as SVGElement;
    return adornerLayer;
}

// /** @private */
// export function getDiagramLayer(diagramId: string): SVGElement {
//     let diagramLayer: SVGElement;
//     let diagramLayerSvg: SVGSVGElement = getDiagramLayerSvg(diagramId);
//     diagramLayer = diagramLayerSvg.getElementById(diagramId + '_diagramLayer') as SVGElement;
//     return diagramLayer;
// }

/** @private */
export function getPortLayerSvg(diagramId: string): SVGSVGElement {
    let adornerLayerSvg: SVGSVGElement = null;
    let diagramElement: HTMLElement = getDiagramElement(diagramId);
    let elementcoll: NodeList;
    elementcoll = diagramElement.getElementsByClassName('e-ports-expand-layer');
    adornerLayerSvg = elementcoll[0] as SVGSVGElement;
    return adornerLayerSvg;
}

/** @private */
export function getNativeLayerSvg(diagramId: string): SVGSVGElement {
    let nativeLayerSvg: SVGSVGElement;
    let diagramElement: HTMLElement = getDiagramElement(diagramId);
    let elementcoll: NodeList;
    elementcoll = diagramElement.getElementsByClassName('e-native-layer');
    nativeLayerSvg = elementcoll[0] as SVGSVGElement;
    return nativeLayerSvg;
}

/** @private */
export function getGridLayerSvg(diagramId: string): SVGSVGElement {
    let gridLayerSvg: SVGSVGElement = null;
    let diagramElement: HTMLElement = getDiagramElement(diagramId);
    let elementcoll: NodeList;
    elementcoll = diagramElement.getElementsByClassName('e-grid-layer');
    gridLayerSvg = elementcoll[0] as SVGSVGElement;
    return gridLayerSvg;
}

/** @private */
export function getBackgroundLayerSvg(diagramId: string): SVGSVGElement {
    let gridLayerSvg: SVGSVGElement = null;
    let diagramElement: HTMLElement = getDiagramElement(diagramId);
    let elementcoll: NodeList = diagramElement.getElementsByClassName('e-background-layer');
    return elementcoll[0].parentNode as SVGSVGElement;
}
/** @private */
export function getBackgroundImageLayer(diagramId: string): SVGSVGElement {
    let imageLayer: SVGSVGElement = null;
    let diagramElement: HTMLElement = getDiagramElement(diagramId);
    let elementcoll: NodeList;
    elementcoll = diagramElement.getElementsByClassName('e-background-image-layer');
    imageLayer = elementcoll[0] as SVGSVGElement;
    return imageLayer;
}

/** @private */
export function getBackgroundLayer(diagramId: string): SVGSVGElement {
    let imageLayer: SVGSVGElement = null;
    let diagramElement: HTMLElement = getDiagramElement(diagramId);
    let elementcoll: NodeList;
    elementcoll = diagramElement.getElementsByClassName('e-background-layer');
    imageLayer = elementcoll[0] as SVGSVGElement;
    return imageLayer;
}

/** @private */
export function getGridLayer(diagramId: string): SVGElement {
    let expandCollapse: SVGElement = null;
    let diagramGridSvg: SVGSVGElement = getGridLayerSvg(diagramId);
    expandCollapse = diagramGridSvg.getElementById(diagramId + '_gridline') as SVGElement;
    return expandCollapse;
}

// /** @private */
// export function getExpandCollapseLayer(diagramId: string): SVGElement {
//     let expandCollapse: SVGElement = null;
//     let diagramPortSvg: SVGSVGElement = getPortLayerSvg(diagramId);
//     expandCollapse = diagramPortSvg.getElementById(diagramId + '_diagramExpander') as SVGElement;
//     return expandCollapse;
// }

// /** @private */
// export function getPortsLayer(diagramId: string): SVGElement {
//     let expandCollapse: SVGElement = null;
//     let diagramPortSvg: SVGSVGElement = getPortLayerSvg(diagramId);
//     expandCollapse = diagramPortSvg.getElementById(diagramId + '_diagramPorts') as SVGElement;
//     return expandCollapse;
// }

/** @private */
export function getNativeLayer(diagramId: string): SVGElement {
    let nativeLayer: SVGElement = null;
    let nativeLayerSvg: SVGSVGElement = getNativeLayerSvg(diagramId);
    nativeLayer = nativeLayerSvg.getElementById(diagramId + '_nativeLayer') as SVGElement;
    return nativeLayer;
}

/** @private */
export function getHTMLLayer(diagramId: string): HTMLElement {
    let htmlLayer: HTMLElement = null;
    let element: HTMLElement = getDiagramElement(diagramId);
    let elementcoll: NodeList;
    elementcoll = element.getElementsByClassName('e-html-layer');
    htmlLayer = elementcoll[0] as HTMLElement;
    return htmlLayer;
}

/** @private */
export function createHtmlElement(elementType: string, attribute: Object): HTMLElement {
    let element: HTMLElement = createElement(elementType);
    setAttributeHtml(element, attribute);
    return element;
}

/** @private */
export function createSvgElement(elementType: string, attribute: Object): SVGElement {
    let element: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    setAttributeSvg(element, attribute);
    return element;
}

/** @hidden */
export function parentsUntil(elem: Element, selector: string, isID?: boolean): Element {
    let parent: Element = elem;
    while (parent) {
        if (isID ? parent.id === selector : hasClass(parent as HTMLElement, selector)) {
            break;
        }
        parent = parent.parentNode as Element;
    }
    return parent;
}

export function hasClass(element: HTMLElement, className: string): boolean {
    let eClassName: string | SVGAnimatedString =
        (typeof element.className === 'object') ? (element.className as SVGAnimatedString).animVal : element.className;
    return ((' ' + eClassName + ' ').indexOf(' ' + className + ' ') > -1) ? true : false;
}
/** @hidden */
export function getScrollerWidth(): number {
    let outer: HTMLElement = createHtmlElement('div', { 'style': 'visibility:hidden; width: 100px' });
    document.body.appendChild(outer);
    let widthNoScroll: number = outer.getBoundingClientRect().width;
    // force scrollbars
    outer.style.overflow = 'scroll';

    // add innerdiv
    let inner: HTMLElement = createHtmlElement('div', { 'style': 'width:100%' });
    outer.appendChild(inner);

    let widthWithScroll: number = inner.getBoundingClientRect().width;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;

}

/**
 * Handles the touch pointer. 
 * @return {boolean}
 * @private
 */
export function addTouchPointer(touchList: ITouches[], e: PointerEvent, touches: TouchList): ITouches[] {
    touchList = [];
    for (let i: number = 0, length: number = touches.length; i < length; i++) {
        touchList.push({ pageX: touches[i].clientX, pageY: touches[i].clientY, pointerId: null });
    }

    return touchList;
}

/**
 * removes the element from dom
 * @param elementId
 */
export function removeElement(elementId: string, contentId?: string): void {
    let div: HTMLElement = getDiagramElement(elementId, contentId);
    if (div) {
        div.parentNode.removeChild(div);
    }
}

export function getContent(element: DiagramHtmlElement | DiagramNativeElement, isHtml: boolean): HTMLElement | SVGElement {
    let div: SVGElement | HTMLElement;
    if (isHtml) {
        let attr: Object = { 'style': 'height: 100%; width: 100%' };
        div = createHtmlElement('div', attr);
    } else {
        div = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    }
    let node: Object = getElement(element);
    let item: HTMLElement | SVGElement;
    if (typeof element.content === 'string') {
        let compiledString: Function;
        compiledString = compile(element.content);
        for (item of compiledString(node)) {
            div.appendChild(item);
        }
    } else {
        div.appendChild(element.content);
    }
    return isHtml ? div.cloneNode(true) as HTMLElement : div.cloneNode(true) as SVGElement;
}

/** @private */
export function setAttributeSvg(svg: SVGElement, attributes: Object): void {
    let keys: string[] = Object.keys(attributes);
    for (let i: number = 0; i < keys.length; i++) {
        svg.setAttribute(keys[i], attributes[keys[i]]);
    }
}


/** @private */
export function setAttributeHtml(element: HTMLElement, attributes: Object): void {
    let keys: string[] = Object.keys(attributes);
    for (let i: number = 0; i < keys.length; i++) {
        element.setAttribute(keys[i], attributes[keys[i]]);
    }
}

/** @private */
export function createMeasureElements(): void {
    let measureElement: string = 'measureElement';
    if (!window[measureElement]) {
        let divElement: HTMLElement = createHtmlElement('div', {
            id: 'measureElement',
            style: 'visibility:hidden ; height: 0px ; width: 0px; overflow: hidden;'
        });
        let text: HTMLElement = createHtmlElement('span', { 'style': 'display:inline-block ; line-height: normal' });
        divElement.appendChild(text);
        let imageElement: HTMLImageElement;
        imageElement = createHtmlElement('img', {}) as HTMLImageElement;
        divElement.appendChild(imageElement);

        let svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
        divElement.appendChild(svg);

        let element: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        svg.appendChild(element);

        let data: Text = document.createTextNode('');
        let tSpan: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
        svg.appendChild(tSpan);
        window[measureElement] = divElement;
        window[measureElement].usageCount = 1;
        document.body.appendChild(divElement);
    } else {
        window[measureElement].usageCount += 1;
    }
}