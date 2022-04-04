import { PointModel } from '../primitives/point-model';
import { Rect } from '../primitives/rect';
import { Size } from '../primitives/size';
import { TextStyleModel } from './../core/appearance-model';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { processPathData, splitArrayCollection, transformPath } from './path-util';
import { whiteSpaceToString, wordBreakToString, textAlignToString, bBoxText, cloneObject } from './base-util';
import { Matrix, identityMatrix, transformPointByMatrix, rotateMatrix } from '../primitives/matrix';
import { ITouches } from '../objects/interface/interfaces';
import { compile, createElement, Browser, isBlazor } from '@syncfusion/ej2-base';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { Node } from '../objects/node';
import { DiagramNativeElement } from '../core/elements/native-element';
import { BaseAttributes, TextAttributes, SubTextElement, TextBounds } from '../rendering/canvas-interface';
import { getElement, cloneBlazorObject } from './diagram-util';
import { Annotation, PathAnnotation } from '../objects/annotation';
import { templateCompiler } from '../utility/base-util';
import { SelectorModel } from '../objects/node-model';
import { UserHandleModel } from '../interaction/selector-model';


/**
 * Defines the functionalities that need to access DOM
 */

/**
 * removeElementsByClass method \
 *
 * @returns {void} removeElementsByClass method .\
 * @param { string } className - provide the element  value.
 * @param {string} id - provide the string  value.
 * @private
 */
export function removeElementsByClass(className: string, id?: string): void {
    let elements: HTMLCollectionOf<Element> | NodeListOf<Element>;
    if (id && document.getElementById(id).classList.contains(className)) {
        elements = document.getElementById(id).getElementsByClassName(className);
    } else {
        elements = document.getElementsByClassName(className);
    }
    while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

/**
 * findSegmentPoints method \
 *
 * @returns {PointModel[]} findSegmentPoints method .\
 * @param { PathElement } element - provide the element  value.
 * @private
 */
export function findSegmentPoints(element: PathElement): PointModel[] {
    const pts: PointModel[] = [];
    let sample: SVGPoint; let sampleLength: number;
    const measureWindowElement: string = 'measureElement';
    window[measureWindowElement].style.visibility = 'visible';
    const svg: SVGSVGElement = window[measureWindowElement].children[2];
    const pathNode: SVGPathElement = getChildNode(svg)[0] as SVGPathElement;
    pathNode.setAttributeNS(null, 'd', element.data);
    const pathBounds: Rect = element.absoluteBounds; // || pathNode.getBBox();
    const pathData: string = updatePath(element, pathBounds, element);
    pathNode.setAttributeNS(null, 'd', pathData);
    const pathLength: number = pathNode.getTotalLength();
    for (sampleLength = 0; sampleLength <= pathLength; sampleLength += 10) {
        sample = pathNode.getPointAtLength(sampleLength);
        pts.push({ x: sample.x, y: sample.y });
    }
    window[measureWindowElement].style.visibility = 'hidden';
    return pts;

}
/**
 * getChildNode method \
 *
 * @returns {SVGElement[] | HTMLCollection} findSegmentPoints method .\
 * @param { SVGElement } node - provide the element  value.
 * @private
 */
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
/**
 * translatePoints method \
 *
 * @returns {PointModel[]} translatePoints method .\
 * @param { SVGElement } element - provide the element  value.
 * @param { PointModel[] } points - provide the element  value.
 * @private
 */
export function translatePoints(element: PathElement, points: PointModel[]): PointModel[] {
    const translatedPts: PointModel[] = [];
    for (const point of points) {
        let pt1: PointModel = {
            x: element.offsetX - element.actualSize.width * element.pivot.x + point.x,
            y: element.offsetY - element.actualSize.height * element.pivot.y + point.y
        };
        let matrix: Matrix;
        const angle: number = element.rotateAngle + element.parentTransform;
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

/**
 * measurePath method \
 *
 * @returns {Rect} measurePath method .\
 * @param { string } data - provide the element  value.
 * @private
 */
export function measurePath(data: string): Rect {
    if (data) {
        const measureWindowElement: string = 'measureElement';
        window[measureWindowElement].style.visibility = 'visible';
        const svg: SVGSVGElement = window[measureWindowElement].children[2];
        const element: SVGPathElement = getChildNode(svg)[0] as SVGPathElement;
        element.setAttribute('d', data);
        const bounds: SVGRect = element.getBBox();
        const svgBounds: Rect = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        window[measureWindowElement].style.visibility = 'hidden';
        return svgBounds;
    }
    return new Rect(0, 0, 0, 0);
}

/**
 * getTextOptions method \
 *
 * @returns {BaseAttributes} getTextOptions method .\
 * @param { TextElement } element - provide the element  value.
 * @param { number } maxWidth - provide the maxWidth  value.
 * @private
 */
function getTextOptions(element: TextElement, maxWidth?: number): BaseAttributes {
    const options: BaseAttributes = {
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

/**
 * wrapSvgText method \
 *
 * @returns {SubTextElement[]} wrapSvgText method .\
 * @param { TextAttributes } text - provide the element  value.
 * @param { string } textValue - provide the maxWidth  value.
 * @param { number } laneWidth - provide the maxWidth  value.
 * @private
 */
function wrapSvgText(text: TextAttributes, textValue?: string, laneWidth?: number): SubTextElement[] {
    let childNodes: SubTextElement[] = []; let k: number = 0;
    let txtValue: string; let bounds1: number;
    const content: string = textValue || text.content;
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
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: bBoxText(txtValue, text) };
                        txtValue = '';
                    }
                    const width: number = bBoxText(txtValue, text);
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
            childNodes = wordWrapping(text, textValue, laneWidth);
        }
    } else {
        childNodes[childNodes.length] = { text: content, x: 0, dy: 0, width: bBoxText(content, text) };
    }
    return childNodes;
}

/**
 * wordWrapping method \
 *
 * @returns {SubTextElement[]} wordWrapping method .\
 * @param { TextAttributes } text - provide the element  value.
 * @param { string } textValue - provide the maxWidth  value.
 * @param { number } laneWidth - provide the maxWidth  value.
 * @private
 */
function wordWrapping(text: TextAttributes, textValue?: string, laneWidth?: number): SubTextElement[] {
    const childNodes: SubTextElement[] = []; let txtValue: string = ''; let j: number = 0;
    let i: number = 0; const wrap: boolean = text.whiteSpace !== 'nowrap' ? true : false;
    const content: string = textValue || text.content;
    const eachLine: string[] = content.split('\n'); let txt: string;
    let words: Object[]; let newText: string;

    let existingWidth: number;
    let existingText: string;
    for (j = 0; j < eachLine.length; j++) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        txt = '';
        words = text.textWrapping !== 'NoWrap' ? eachLine[j].split(' ') : (text.textWrapping === 'NoWrap') ? [eachLine[j]] : eachLine;
        for (i = 0; i < words.length; i++) {
            txtValue += (((i !== 0 || words.length === 1) && wrap && txtValue.length > 0) ? ' ' : '') + words[i];
            newText = txtValue + ' ' + (words[i + 1] || '');
            const width: number = bBoxText(newText, text);
            if (Math.floor(width) > (laneWidth || text.width) - 2 && txtValue.length > 0) {
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
/**
 * wrapSvgTextAlign method \
 *
 * @returns {TextBounds} wrapSvgTextAlign method .\
 * @param { TextAttributes } text - provide the element  value.
 * @param { string } childNodes - provide the maxWidth  value.
 * @private
 */
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

/**
 * measureHtmlText method \
 *
 * @returns {TextBounds} measureHtmlText method .\
 * @param { TextStyleModel } style - provide the style  value.
 * @param { string } content - provide the content  value.
 * @param { string } width - provide the width  value.
 * @param { string } height - provide the height  value.
 * @param { string } maxWidth - provide the maxWidth  value.
 * @private
 */
export function measureHtmlText(style: TextStyleModel, content: string, width: number, height: number, maxWidth?: number): Size {
    const bounds: Size = new Size();
    const text: HTMLElement = createHtmlElement('span', { 'style': 'display:inline-block; line-height: normal' });
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


/**
 * measureText method \
 *
 * @returns {Size} measureText method .\
 * @param { TextStyleModel } text - provide the text  value.
 * @param { string } style - provide the style  value.
 * @param { string } content - provide the content  value.
 * @param { number } maxWidth - provide the maxWidth  value.
 * @param { string } textValue - provide the textValue  value.
 * @private
 */
export function measureText(
    text: TextElement, style: TextStyleModel, content: string,
    maxWidth?: number, textValue?: string): Size {
    const bounds: Size = new Size(0, 0);
    let childNodes: SubTextElement[];
    let wrapBounds: TextBounds;
    const options: TextAttributes = getTextOptions(text, maxWidth) as TextAttributes;
    text.childNodes = childNodes = wrapSvgText(options, textValue, text.isLaneOrientation ? maxWidth : undefined);
    text.wrapBounds = wrapBounds = wrapSvgTextAlign(options, childNodes);
    bounds.width = wrapBounds.width;
    if (text.wrapBounds.width >= maxWidth && options.textOverflow !== 'Wrap') {
        bounds.width = maxWidth;
    }
    bounds.height = childNodes.length * text.style.fontSize * 1.2;
    return bounds;
}

/**
 * measureImage method \
 *
 * @returns {Size} measureImage method .\
 * @param { string } source - provide the text  value.
 * @param { Size } contentSize - provide the style  value.
 * @param { string } id - provide the content  value.
 * @param { Function } callback - provide the maxWidth  value.
 * @private
 */
// eslint-disable-next-line
export function measureImage(source: string, contentSize: Size, id?: string, callback?: Function): Size {
    const measureWindowElement: string = 'measureElement';
    window[measureWindowElement].style.visibility = 'visible';
    const imageElement: HTMLImageElement = window[measureWindowElement].children[1];
    imageElement.setAttribute('src', source);
    const bounds: ClientRect = imageElement.getBoundingClientRect();
    const width: number = bounds.width;
    const height: number = bounds.height;
    contentSize = new Size(width, height);
    window[measureWindowElement].style.visibility = 'hidden';

    const element: HTMLElement = document.createElement('img');
    element.setAttribute('src', source);
    setAttributeHtml(element, { id: id + 'sf-imageNode', style: 'display: none;' });
    document.body.appendChild(element);
    // eslint-disable-next-line
    element.onload = (event: any) => {
        const loadedImage: HTMLImageElement = event.currentTarget;
        if (callback) {
            callback(id, { width: loadedImage.width, height: loadedImage.height });
        }
    };
    return contentSize;
}
/* eslint-disable */

/**
 * measureNativeContent method \
 *
 * @returns {Rect} measureNativeContent method .\
 * @param { SVGElement } nativeContent - provide the text  value.
 * @private
 */
export function measureNativeContent(nativeContent: SVGElement): Rect {
    const measureWindowElement: string = 'measureElement';
    window[measureWindowElement].style.visibility = 'visible';
    let nativeSVG: SVGSVGElement = window[measureWindowElement].children[2];
    nativeSVG.appendChild(nativeContent);
    const bounds: ClientRect = nativeContent.getBoundingClientRect();
    const svgBounds: ClientRect = nativeSVG.getBoundingClientRect();
    const rect: Rect = bounds as Rect;
    rect.x = bounds.left - svgBounds.left;
    rect.y = bounds.top - svgBounds.top;
    nativeSVG.removeChild(nativeContent);
    window[measureWindowElement].style.visibility = 'hidden';
    return rect;
}

/**
 * measureNativeSvg method \
 *
 * @returns {Rect} measureNativeSvg method .\
 * @param { SVGElement } nativeContent - provide the text  value.
 * @private
 */
export function measureNativeSvg(nativeContent: SVGElement): Rect {
    const measureWindowElement: string = 'measureElement';
    window[measureWindowElement].style.visibility = 'visible';
    const nativeSVG: SVGSVGElement = window[measureWindowElement].children[2];
    nativeSVG.appendChild(nativeContent);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svgBounds: Rect | any = nativeSVG.getBoundingClientRect() as unknown as Rect;
    nativeSVG.removeChild(nativeContent);
    window[measureWindowElement].style.visibility = 'hidden';
    return svgBounds;
}

/**
 * updatePath method \
 *
 * @returns {string} updatePath method .\
 * @param { SVGElement } element - provide the element  value.
 * @param { Rect } bounds - provide the bounds  value.
 * @param { PathElement } child - provide the child  value.
 * @param { BaseAttributes } options - provide the options  value.
 * @private
 */
export function updatePath(element: PathElement, bounds: Rect, child: PathElement, options?: BaseAttributes): string {
    const initX: number = 0; const initY: number = 0;
    let scaleX: number = 0; let scaleY: number = 0; let isScale: boolean = false;
    let newPathString: string = '';
    let arrayCollection: Object[] = [];
    const bBox: Rect = bounds;
    if (initX !== bBox.x || initY !== bBox.y) {
        scaleX = initX - Number(bBox.x);
        scaleY = initY - Number(bBox.y);
    }
    if (element.actualSize.width !== bBox.width || element.actualSize.height !== bBox.height || options) {
        scaleX = (options && options.width || element.actualSize.width) / Number(bBox.width ? bBox.width : 1);
        scaleY = (options && options.height || element.actualSize.height) / Number(bBox.height ? bBox.height : 1);
        isScale = true;
    }
    arrayCollection = processPathData(element.data);
    arrayCollection = splitArrayCollection(arrayCollection);
    newPathString = transformPath(arrayCollection, scaleX, scaleY, isScale, bBox.x, bBox.y, initX, initY);
    isScale = false;
    return newPathString;
}

/**
 * getDiagramLayerSvg method \
 *
 * @returns {string} getDiagramLayerSvg method .\
 * @param { string } diagramId - provide the element  value.
 * @private
 */
export function getDiagramLayerSvg(diagramId: string): SVGSVGElement {
    //let diagramLayerSvg: SVGSVGElement;
    const diagramElement: HTMLElement = getDiagramElement(diagramId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elementcoll: NodeList | any = diagramElement.getElementsByClassName('e-diagram-layer');
    const diagramLayerSvg: SVGSVGElement = elementcoll[0] as SVGSVGElement;
    return diagramLayerSvg;
}

/**
 * getDiagramElement method \
 *
 * @returns {HTMLElement} getDiagramElement method .\
 * @param { string } elementId - provide the elementId  value.
 * @param { string } contentId - provide the elementId  value.
 * @private
 */
export function getDiagramElement(elementId: string, contentId?: string): HTMLElement {
    let diagramElement: HTMLElement; let element: HTMLElement;
    if (contentId) { element = document.getElementById(contentId); }
    if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
        diagramElement = (element) ? element.querySelector('#' + elementId) as HTMLElement : document.getElementById(elementId);
    } else {
        diagramElement = (element) ? element.querySelector('#' + CSS.escape(elementId)) as HTMLElement : document.getElementById(elementId);
    }
    return diagramElement;
}

/**
 * getDomIndex method \
 *
 * @returns {HTMLElement} getDomIndex method .\
 * @param { string } viewId - provide the elementId  value.
 * @param { string } elementId - provide the elementId  value.
 * @param { string } layer - provide the elementId  value.
 * @private
 */
export function getDomIndex(viewId: string, elementId: string, layer: string): number {
    let index: number = undefined;
    let parentElement: HTMLElement | SVGElement;
    let postId: string = '';
    if (layer === 'native') {
        parentElement = getNativeLayer(viewId);
        postId = '_content_groupElement';
    } else if (layer === 'html') {
        parentElement = getHTMLLayer(viewId).childNodes[0] as HTMLElement;
        postId = '_html_element';
    } else {
        parentElement = getDiagramLayer(viewId);
        postId = '_groupElement';
    }
    let childElement: HTMLElement | SVGElement;
    for (let i: number = 0; parentElement.childNodes && i < parentElement.childNodes.length; i++) {
        childElement = parentElement.childNodes[i] as (HTMLElement | SVGElement);
        if (childElement && childElement.id === elementId + postId) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * getAdornerLayerSvg method \
 *
 * @returns {SVGSVGElement} getAdornerLayerSvg method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getAdornerLayerSvg(diagramId: string): SVGSVGElement {
    let adornerLayerSvg: SVGSVGElement = null;
    const diagramElement: HTMLElement = getDiagramElement(diagramId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elementcoll: NodeList | any = diagramElement.getElementsByClassName('e-adorner-layer');
    adornerLayerSvg = elementcoll[0] as SVGSVGElement;
    return adornerLayerSvg;
}

/**
 * getSelectorElement method \
 *
 * @returns {SVGSVGElement} getSelectorElement method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getSelectorElement(diagramId: string): SVGElement {
    let adornerLayer: SVGElement = null;
    const adornerSvg: SVGSVGElement = getAdornerLayerSvg(diagramId);
    adornerLayer = adornerSvg.getElementById(diagramId + '_SelectorElement') as SVGElement;
    return adornerLayer;
}

/**
 * getAdornerLayer method \
 *
 * @returns {SVGSVGElement} getAdornerLayer method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getAdornerLayer(diagramId: string): SVGElement {
    let adornerLayer: SVGElement = null;
    const diagramAdornerSvg: SVGSVGElement = getAdornerLayerSvg(diagramId);
    adornerLayer = diagramAdornerSvg.getElementById(diagramId + '_diagramAdorner') as SVGElement;
    return adornerLayer;
}

/**
 * getUserHandleLayer method \
 *
 * @returns {HTMLElement} getUserHandleLayer method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getUserHandleLayer(diagramId: string): HTMLElement {
    let adornerLayer: HTMLElement = null;
    const diagramUserHandleLayer: HTMLElement = getDiagramElement(diagramId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elementcoll: NodeList | any = diagramUserHandleLayer.getElementsByClassName('e-userHandle-layer');
    adornerLayer = elementcoll[0] as HTMLElement;
    return adornerLayer;
}

/**
 * getDiagramLayer method \
 *
 * @returns {HTMLElement} getDiagramLayer method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getDiagramLayer(diagramId: string): SVGElement {
    //let diagramLayer: SVGElement;
    const diagramLayerSvg: SVGSVGElement = getDiagramLayerSvg(diagramId);
    const diagramLayer: SVGElement = diagramLayerSvg.getElementById(diagramId + '_diagramLayer') as SVGElement;
    return diagramLayer;
}

/**
 * getPortLayerSvg method \
 *
 * @returns {SVGSVGElement} getPortLayerSvg method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getPortLayerSvg(diagramId: string): SVGSVGElement {
    let adornerLayerSvg: SVGSVGElement = null;
    const diagramElement: HTMLElement = getDiagramElement(diagramId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elementcoll: NodeList | any = diagramElement.getElementsByClassName('e-ports-expand-layer');
    adornerLayerSvg = elementcoll[0] as SVGSVGElement;
    return adornerLayerSvg;
}

/**
 * getNativeLayerSvg method \
 *
 * @returns {SVGSVGElement} getNativeLayerSvg method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getNativeLayerSvg(diagramId: string): SVGSVGElement {
    let nativeLayerSvg: SVGSVGElement;
    const diagramElement: HTMLElement = getDiagramElement(diagramId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elementcoll: NodeList | any = diagramElement.getElementsByClassName('e-native-layer');
    nativeLayerSvg = elementcoll[0] as SVGSVGElement;
    return nativeLayerSvg;
}

/**
 * getGridLayerSvg method \
 *
 * @returns {SVGSVGElement} getNativeLayerSvg method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getGridLayerSvg(diagramId: string): SVGSVGElement {
    let gridLayerSvg: SVGSVGElement = null;
    const diagramElement: HTMLElement = getDiagramElement(diagramId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elementcoll: NodeList | any = diagramElement.getElementsByClassName('e-grid-layer');
    gridLayerSvg = elementcoll[0] as SVGSVGElement;
    return gridLayerSvg;
}

/**
 * getBackgroundLayerSvg method \
 *
 * @returns {SVGSVGElement} getBackgroundLayerSvg method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getBackgroundLayerSvg(diagramId: string): SVGSVGElement {
    let gridLayerSvg: SVGSVGElement = null;
    const diagramElement: HTMLElement = getDiagramElement(diagramId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elementcoll: NodeList | any = diagramElement.getElementsByClassName('e-background-layer');
    return elementcoll[0].parentNode as SVGSVGElement;
}
/**
 * getBackgroundImageLayer method \
 *
 * @returns {SVGSVGElement} getBackgroundImageLayer method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getBackgroundImageLayer(diagramId: string): SVGSVGElement {
    let imageLayer: SVGSVGElement = null;
    const diagramElement: HTMLElement = getDiagramElement(diagramId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elementcoll: NodeList | any = diagramElement.getElementsByClassName('e-background-image-layer');
    imageLayer = elementcoll[0] as SVGSVGElement;
    return imageLayer;
}

/**
 * getBackgroundLayer method \
 *
 * @returns {SVGSVGElement} getBackgroundLayer method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getBackgroundLayer(diagramId: string): SVGSVGElement {
    let imageLayer: SVGSVGElement = null;
    const diagramElement: HTMLElement = getDiagramElement(diagramId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const elementcoll: NodeList | any = diagramElement.getElementsByClassName('e-background-layer');
    imageLayer = elementcoll[0] as SVGSVGElement;
    return imageLayer;
}

/**
 * getGridLayer method \
 *
 * @returns {SVGSVGElement} getGridLayer method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getGridLayer(diagramId: string): SVGElement {
    const domTable: string = 'domTable';
    let expandCollapse: SVGElement = null;
    if (!window[domTable][diagramId + '_gridline']) {
        const diagramGridSvg: SVGSVGElement = getGridLayerSvg(diagramId);
        expandCollapse = diagramGridSvg.getElementById(diagramId + '_gridline') as SVGElement;
        window[domTable][diagramId + '_gridline'] = expandCollapse;
    } else {
        expandCollapse = window[domTable][diagramId + '_gridline'];
    }
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

/**
 * getNativeLayer method \
 *
 * @returns {SVGSVGElement} getNativeLayer method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getNativeLayer(diagramId: string): SVGElement {
    let nativeLayer: SVGElement = null;
    const nativeLayerSvg: SVGSVGElement = getNativeLayerSvg(diagramId);
    nativeLayer = nativeLayerSvg.getElementById(diagramId + '_nativeLayer') as SVGElement;
    return nativeLayer;
}

/**
 * getHTMLLayer method \
 *
 * @returns {SVGSVGElement} getHTMLLayer method .\
 * @param { string } diagramId - provide the diagramId  value.
 * @private
 */
export function getHTMLLayer(diagramId: string): HTMLElement {
    let htmlLayer: HTMLElement = null;
    const domTable: string = 'domTable';
    if (!window[domTable][diagramId + 'html_layer']) {
        const element: HTMLElement = getDiagramElement(diagramId);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const elementcoll: NodeList | any = element.getElementsByClassName('e-html-layer');
        htmlLayer = elementcoll[0] as HTMLElement;
        window[domTable][diagramId + 'html_layer'] = htmlLayer;
    } else {
        htmlLayer = window[domTable][diagramId + 'html_layer'] as HTMLElement;
    }
    return htmlLayer;
}
/* eslint-enable */
/**
 * createHtmlElement method \
 *
 * @returns {SVGSVGElement} createHtmlElement method .\
 * @param { string } elementType - provide the diagramId  value.
 * @param { Object } attribute - provide the diagramId  value.
 * @private
 */
export function createHtmlElement(elementType: string, attribute: Object): HTMLElement {
    const element: HTMLElement = createElement(elementType);
    setAttributeHtml(element, attribute);
    return element;
}

/**
 * createSvgElement method \
 *
 * @returns {SVGSVGElement} createSvgElement method .\
 * @param { string } elementType - provide the elementType  value.
 * @param { Object } attribute - provide the attribute  value.
 * @private
 */
export function createSvgElement(elementType: string, attribute: Object): SVGElement {
    const element: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', elementType);
    setAttributeSvg(element, attribute);
    return element;
}

/** @hidden */
/**
 * parentsUntil method \
 *
 * @returns {SVGSVGElement} parentsUntil method .\
 * @param { Element } elem - provide the elementType  value.
 * @param { string } selector - provide the attribute  value.
 * @param { boolean } isID - provide the attribute  value.
 * @private
 */
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

/**
 * hasClass method \
 *
 * @returns {SVGSVGElement} hasClass method .\
 * @param { HTMLElement } element - provide the element  value.
 * @param { string } className - provide the className  value.
 * @private
 */
export function hasClass(element: HTMLElement, className: string): boolean {
    const eClassName: string | SVGAnimatedString =
        (typeof element.className === 'object') ? (element.className as SVGAnimatedString).animVal : element.className;
    return ((' ' + eClassName + ' ').indexOf(' ' + className + ' ') > -1) ? true : false;
}
/**
 * getScrollerWidth method \
 *
 * @returns {number} getScrollerWidth method .\
 * @private
 */
export function getScrollerWidth(): number {
    const outer: HTMLElement = createHtmlElement('div', { 'style': 'visibility:hidden; width: 100px' });
    document.body.appendChild(outer);
    const widthNoScroll: number = outer.getBoundingClientRect().width;
    // force scrollbars
    outer.style.overflow = 'scroll';

    // add innerdiv
    const inner: HTMLElement = createHtmlElement('div', { 'style': 'width:100%' });
    outer.appendChild(inner);

    const widthWithScroll: number = inner.getBoundingClientRect().width;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;

}

/**
 * addTouchPointer method \
 *
 * @returns {ITouches[]} addTouchPointer method .\
 * @param { ITouches[] } touchList - provide the touchList  value.
 * @param { PointerEvent } e - provide the e  value.
 * @param { TouchList } touches - provide the touches  value.
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
 * removes the element from dom \
 *
 * @returns {void} removes the element from dom .\
 * @param { ITouches[] } elementId - provide the elementId  value.
 * @param { PointerEvent } contentId - provide the contentId  value.
 * @private
 */
export function removeElement(elementId: string, contentId?: string): void {
    const div: HTMLElement = getDiagramElement(elementId, contentId);
    if (div) {
        div.parentNode.removeChild(div);
    }
}

/**
 * getContent method   \
 *
 * @returns {void} getContent method .\
 * @param { DiagramHtmlElement | DiagramNativeElement } element - provide the elementId  value.
 * @param { boolean } isHtml - provide the boolean  value.
 * @param { Node | Annotation | PathAnnotation } nodeObject - provide the nodeObject  value.
 * @private
 */
export function getContent(
    element: DiagramHtmlElement | DiagramNativeElement, isHtml: boolean,
    nodeObject?: Node | Annotation | PathAnnotation): HTMLElement | SVGElement {
    let div: SVGElement | HTMLElement;
    /* eslint-disable */
    if (isHtml) {
        const attr: Object = { 'style': 'height: 100%; width: 100%' };
        div = createHtmlElement('div', attr);
    } else {
        div = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    }
    const node: Object = getElement(element);
    let content: string = '';
    let sentNode: Object = {};
    let isSvg: boolean = false;
    let propertyName: string;
    if (node instanceof Node) {
        sentNode = node;
        if (node.shape.type === 'Native') {
            isSvg = true;
            let svgContent: string;
            const div: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            document.body.appendChild(div);

            div.innerHTML = ((node.shape as any).content) as string;
            /* tslint:disable */
            svgContent = (div.getElementsByTagName('svg').length > 0)
                ? div.getElementsByTagName('svg')[0].outerHTML :
                div.getElementsByTagName('g').length > 0 ? div.getElementsByTagName('g')[0].outerHTML : "";
            /* tslint:disable */
            (node.shape as any).content = svgContent;
            /* tslint:disable */
            element.content = svgContent;
            div.parentElement.removeChild(div);
        }
        //let blazor: string = 'Blazor';
        if (isBlazor()) {
            content = 'diagramsf_node_template';
            sentNode = cloneBlazorObject(node);
        }
        propertyName = "nodeTemplate";
    } else {
        sentNode = node;
        //new
        if (isBlazor()) {
            sentNode = cloneBlazorObject(node);
            content = 'diagramsf_annotation_template';
        }
        propertyName = "annotationTemplate";
    }
    let item: HTMLElement | SVGElement;
    const diagramElement: Object = document.getElementById(element.diagramId);
    const instance: string = 'ej2_instances';
    const diagram: Object = diagramElement[instance][0];

    if (typeof element.content === 'string' && (!(element as DiagramHtmlElement).isTemplate || isBlazor())) {
        const template: HTMLElement = document.getElementById(element.content);
        if (template) {
            div.appendChild(template);
        } else {
            /* eslint-disable */
            let compiledString: Function;
            compiledString = compile(element.content);

            for (item of compiledString(sentNode, diagram, propertyName, content)) {
                div.appendChild(item);
            }
            //new
            // for (item of compiledString(sentNode, null, null, content, undefined, undefined, isSvg)) {
            //     div.appendChild(item);
            // }
        }
    } else if ((element as DiagramHtmlElement).isTemplate) {
        let compiledString: Function;
        if ((diagram as any).isReact) {
            compiledString = (element as DiagramHtmlElement).getNodeTemplate()(
                /* eslint-enable */
                // eslint-disable-next-line quotes
                cloneObject(nodeObject), diagram, propertyName + "_" + ((propertyName === "nodeTemplate") ? nodeObject.id : element.nodeId + nodeObject.id), undefined, undefined, false, div);
        } else if ((diagram as any).isVue || (diagram as any).isVue3) {
            // EJ2-57563 - Added the below code to provide slot template support for Vue and Vue 3
            let templateFn: Function = (element as DiagramHtmlElement).getNodeTemplate();
            if (templateFn) {
                // If other than slot template, this if block gets execute and template get returned.
                compiledString = (element as DiagramHtmlElement).getNodeTemplate()(
                    /* eslint-enable */
                    // eslint-disable-next-line quotes
                    cloneObject(nodeObject), diagram, propertyName + "_" + ((propertyName === "nodeTemplate") ? nodeObject.id : element.nodeId + nodeObject.id), undefined, undefined, false, div);
            } else {
                // If we provide slot template means then it enters in this block and returns a template
                if (propertyName === "nodeTemplate") {
                    compiledString = compile((diagram as any).nodeTemplate)
                } else {
                    compiledString = compile((diagram as any).annotationTemplate)
                }
                compiledString = compiledString(
                    /* eslint-enable */
                    // eslint-disable-next-line quotes
                    cloneObject(nodeObject), diagram, propertyName + "_" + ((propertyName === "nodeTemplate") ? nodeObject.id : element.nodeId + nodeObject.id), undefined, undefined, false, div);
            }
        } else {
            compiledString = (element as DiagramHtmlElement).getNodeTemplate()(
                /* eslint-enable */
                // eslint-disable-next-line quotes
                cloneObject(nodeObject), diagram, propertyName + "_" + ((propertyName === "nodeTemplate") ? nodeObject.id : element.nodeId + nodeObject.id), undefined, undefined, false);
        }
        if (compiledString) {
            for (let i: number = 0; i < compiledString.length; i++) {
                div.appendChild(compiledString[i]);
            }
        }
    } else {
        div.appendChild(element.content as HTMLElement);
    }
    return (element as DiagramHtmlElement).isTemplate ?
        div : (isHtml ? div.cloneNode(true) as HTMLElement : div.cloneNode(true) as SVGElement);
}
/* eslint-enable */

/**
 * setAttributeSvg method   \
 *
 * @returns {void} setAttributeSvg method .\
 * @param { SVGElement } svg - provide the svg  value.
 * @param { Object } attributes - provide the boolean  value.
 * @private
 */
export function setAttributeSvg(svg: SVGElement, attributes: Object): void {
    const keys: string[] = Object.keys(attributes);
    for (let i: number = 0; i < keys.length; i++) {
        if (keys[i] !== 'style') {
            svg.setAttribute(keys[i], attributes[keys[i]]);
        } else {
            applyStyleAgainstCsp(svg, attributes[keys[i]]);
        }
    }
}

/**
 * applyStyleAgainstCsp method   \
 *
 * @returns {void} applyStyleAgainstCsp method .\
 * @param { SVGElement } svg - provide the svg  value.
 * @param { string } attributes - provide the boolean  value.
 * @private
 */
export function applyStyleAgainstCsp(svg: SVGElement | HTMLElement, attributes: string): void {
    const keys: string[] = attributes.split(';');
    for (let i: number = 0; i < keys.length; i++) {
        const attribute: string[] = keys[i].split(':');
        if (attribute.length === 2) {
            svg.style[attribute[0].trim()] = attribute[1].trim();
        }
    }
}

/**
 * setAttributeHtml method   \
 *
 * @returns {void} setAttributeHtml method .\
 * @param { HTMLElement } element - provide the svg  value.
 * @param { Object } attributes - provide the boolean  value.
 * @private
 */
export function setAttributeHtml(element: HTMLElement, attributes: Object): void {
    const keys: string[] = Object.keys(attributes);
    for (let i: number = 0; i < keys.length; i++) {
        if (keys[i] !== 'style') {
            element.setAttribute(keys[i], attributes[keys[i]]);
        } else {
            applyStyleAgainstCsp(element, attributes[keys[i]]);
        }
    }
}

/**
 * createMeasureElements method   \
 *
 * @returns {void} createMeasureElements method .\
 * @private
 */
export function createMeasureElements(): void {
    const measureWindowElement: string = 'measureElement';
    if (!window[measureWindowElement]) {
        const divElement: HTMLElement = createHtmlElement('div', {
            id: 'measureElement',
            style: 'visibility:hidden ; height: 0px ; width: 0px; overflow: hidden;'
        });
        const text: HTMLElement = createHtmlElement('span', { 'style': 'display:inline-block ; line-height: normal' });
        divElement.appendChild(text);
        //let imageElement: HTMLImageElement;
        const imageElement: HTMLImageElement = createHtmlElement('img', { 'alt': 'measureElementImage', 'src': 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' }) as HTMLImageElement;
        divElement.appendChild(imageElement);

        const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
        divElement.appendChild(svg);

        const element: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        element.setAttribute('d', '');
        svg.appendChild(element);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const data: Text = document.createTextNode('');
        const tSpan: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
        svg.appendChild(tSpan);
        window[measureWindowElement] = divElement;
        window[measureWindowElement].usageCount = 1;
        document.body.appendChild(divElement);
        const measureElementCount: string = 'measureElementCount';
        if (!window[measureElementCount]) {
            window[measureElementCount] = 1;
        } else {
            window[measureElementCount]++;
        }


    } else {
        window[measureWindowElement].usageCount += 1;
    }
}

/**
 * setChildPosition method   \
 *
 * @returns {number} setChildPosition method .\
 * @param {SubTextElement} temp - provide the temp  value.
 * @param {SubTextElement[]} childNodes - provide the childNodes  value.
 * @param {number} i - provide the i  value.
 * @param {TextAttributes} options - provide the options  value.
 * @private
 */
export function setChildPosition(temp: SubTextElement, childNodes: SubTextElement[], i: number, options: TextAttributes): number {
    if (childNodes.length >= 1 && temp.x === 0 &&
        (options.textOverflow === 'Clip' || options.textOverflow === 'Ellipsis') &&
        (options.textWrapping === 'Wrap' || options.textWrapping === 'WrapWithOverflow')) {
        temp.x = childNodes[i - 1] ? childNodes[i - 1].x : -(temp.width / 2);
        return temp.x;
    }
    return temp.x;
}

/**
 * getTemplateContent method   \
 *
 * @returns {DiagramHtmlElement} getTemplateContent method .\
 * @param {DiagramHtmlElement} annotationcontent - provide the annotationcontent  value.
 * @param {Annotation} annotation - provide the annotation  value.
 * @param {number} annotationTemplate - provide the annotationTemplate  value.
 * @private
 */
export function getTemplateContent(
    // eslint-disable-next-line @typescript-eslint/ban-types
    annotationcontent: DiagramHtmlElement, annotation: Annotation, annotationTemplate?: string | Function): DiagramHtmlElement {
    if (annotationTemplate && !annotation.template) {
        annotationcontent.isTemplate = true;
        annotationcontent.template = annotationcontent.content = getContent(annotationcontent, true, annotation) as HTMLElement;
    } else {
        annotationcontent.content = annotation.template;
    }
    return annotationcontent;
}

/* eslint-disable */
/** @private */
export function createUserHandleTemplates(userHandleTemplate: string, template: HTMLCollection, selectedItems: SelectorModel, diagramID: string): void {
    let userHandleFn: Function;
    let handle: UserHandleModel;
    let compiledString: Function;
    let i: number;
    let div: HTMLElement;
    let diagramElement: Object = document.getElementById(diagramID);
    let instance: string = 'ej2_instances';
    let diagram: Object = diagramElement[instance][0];

    if (userHandleTemplate && template) {
        userHandleFn = templateCompiler(userHandleTemplate);
        for (handle of selectedItems.userHandles) {
            if (userHandleFn) {
                compiledString = userHandleFn(cloneObject(handle), diagram, 'userHandleTemplate' + '_' + handle.name, undefined, undefined, false);
                for (i = 0; i < compiledString.length; i++) {
                    let attr: Object = {
                        'style': 'height: 100%; width: 100%; pointer-events: all',
                        'id': handle.name + '_template_hiddenUserHandle'
                    };
                    div = createHtmlElement('div', attr);
                    div.appendChild(compiledString[i]);
                }
                template[0].appendChild(div);
            }
        }
    } else if (isBlazor()) {
        let content: string = 'diagramsf_userHandle_template';
        let a: Function;
        for (handle of selectedItems.userHandles) {
            if (!handle.pathData && !handle.content && !handle.source) {
                compiledString = compile(handle.content);
                for (i = 0, a = compiledString(cloneBlazorObject(handle), diagram, 'userHandleTemplate', content); i < a.length; i++) {
                    let attr: object = {
                        'style': 'height: 100%; width: 100%; pointer-events: all',
                        'id': handle.name + '_template_hiddenUserHandle'
                    };
                    div = createHtmlElement('div', attr);
                    div.appendChild(a[i]);
                }
                template[0].appendChild(div);
            }
        }
    }
}

/* eslint-enable */
