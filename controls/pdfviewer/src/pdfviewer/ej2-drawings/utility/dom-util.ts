import { PointModel } from '../primitives/point-model';
import { Rect } from '../primitives/rect';
import { Size } from '../primitives/size';
import { TextStyleModel } from './../core/appearance-model';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { whiteSpaceToString, wordBreakToString, textAlignToString, bBoxText, bBoxTextHeight, bBoxTextBlazor } from './base-util';
import { Matrix, identityMatrix, transformPointByMatrix, rotateMatrix } from '../primitives/matrix';
import { createElement, Browser } from '@syncfusion/ej2-base'; /*externalscript*/
import { BaseAttributes, TextAttributes, SubTextElement, TextBounds } from '../rendering/canvas-interface';

/**
 * @param {SVGElement} node - node
 * @private
 * @returns {SVGElement[] | HTMLCollection} - child elements
 */
export function getChildNode(node: SVGElement): SVGElement[] | HTMLCollection {
    let child: SVGElement;
    let collection: SVGElement[] | HTMLCollection = [];
    if (Browser.info.name === 'msie' || Browser.info.name === 'edge') {
        for (let i: number = 0; i < node.childNodes.length; i++) {
            child = node.childNodes[parseInt(i.toString(), 10)] as SVGElement;
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
 * @hidden
 * ChildNodeResult interface
 */
interface ChildNodeResult {
    childNode: SubTextElement[];
    height: number;
}

/**
 * @param {PathElement} element - element
 * @param {PointModel[]} points - PointModel[]
 * @private
 * @returns {PointModel[]} - PointModel[]
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
 * @param {string} data - data
 * @private
 * @returns {Rect} - Rect
 */
export function measurePath(data: string): Rect {
    const path: string = 'pathTable';
    if (!(window as any)[path as string]) {
        (window as any)[path as string] = {};
    }
    if (data) {
        const measureElement: string = 'measureElement';
        (window as any)[measureElement as string].style.visibility = 'visible';
        const svg: SVGSVGElement = (window as any)[measureElement as string].children[2];
        const element: SVGPathElement = getChildNode(svg)[0] as SVGPathElement;
        element.setAttribute('d', data);
        //let bounds: SVGRect = element.getBBox();
        let bounds: SVGRect;
        if ((window as any)[path as string][data as string]) {
            bounds = (window as any)[path as string][data as string];
        } else {
            (window as any)[path as string][data as string] = bounds = element.getBBox();
            if ((bounds.x === 0 || bounds.y === 0) && (bounds.width === 0 || bounds.height === 0)) {
                (window as any)[path as string][data as string] = bounds = getBBox(data);
            }
        }
        const svgBounds: Rect = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        (window as any)[measureElement as string].style.visibility = 'hidden';
        return svgBounds;
    }
    return new Rect(0, 0, 0, 0);
}

/**
 * @param {string} path - path
 * @private
 * @returns {any} - Rect
 */
function getBBox(path: string): any {
    let xmin: number = 0;
    let xmax: number = 0;
    let ymin: number = 0;
    let ymax: number = 0;
    // tslint:disable-next-line
    let currentValue: any;
    // tslint:disable-next-line
    let currentpath: any = path;
    currentpath = currentpath.replace(/[a-z].*/g, ' ').replace(/[\sA-Z]+/gi, ' ').trim().split(' ');
    for (let i: number = 0; i < currentpath.length; i++) {
        if (currentpath[parseInt(i.toString(), 10)].length > 1) {
            currentValue = currentpath[parseInt(i.toString(), 10)].split(',');
            xmin = xmax = currentValue[0]; ymin = ymax = currentValue[1];
        }
    }
    for (let i: number = 0; i < currentpath.length; i++) {
        currentValue = currentpath[parseInt(i.toString(), 10)].split(',');
        if (!currentValue[1]) {
            currentValue[0] = xmin;
            currentValue[1] = ymin;
        }
        xmin = Math.min(xmin, currentValue[0]);
        xmax = Math.max(xmax, currentValue[0]);
        ymin = Math.min(ymin, currentValue[1]);
        ymax = Math.max(ymax, currentValue[1]);
    }
    return { x: xmin, y: ymin, width: xmax - xmin, height: ymax - ymin };
}

/**
 * @param {TextElement} element - element
 * @param {number} maxWidth - maxWidth
 * @private
 * @returns {BaseAttributes} - BaseAttributes
 */
function getTextOptions(element: TextElement, maxWidth?: number): BaseAttributes {
    const options: BaseAttributes = {
        fill: element.style.fill, stroke: element.style.strokeColor, angle: element.rotateAngle + element.parentTransform,
        pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: element.style.strokeWidth,
        dashArray: element.style.strokeDashArray, opacity: element.style.opacity,
        visible: element.visible, id: element.id,
        width: maxWidth || element.actualSize.width, height: element.actualSize.height,
        x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
        y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5,
        relativeMode: element.relativeMode
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
    if (element.thickness !== undefined){
        (options as TextAttributes).thickness = element.thickness;
    }
    options.dashArray = ''; options.strokeWidth = element.style.strokeWidth; options.fill = '';
    return options;
}

/**
 * @param {TextAttributes} text - text
 * @param {string} textValue - textValue
 * @param {number} maxHeight - maxHeight
 * @private
 * @returns {SubTextElement[]} - array of SubTextElement
 */
function wrapSvgTextEJ2(text: TextAttributes, textValue?: string, maxHeight?: number): SubTextElement[] {
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
                    // if (txtValue.indexOf('\n') > -1) {
                    //     txtValue = txtValue.replace('\n', '');
                    // }
                    const width: number = bBoxText(txtValue, text);
                    if ((Math.ceil(width) + 2 >= text.width && txtValue.length > 0) || (txtValue.indexOf('\n') > -1)) {
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
            childNodes = wordWrappingEJ2(text, textValue, maxHeight);
        }
    } else {
        childNodes[childNodes.length] = { text: content, x: 0, dy: 0, width: bBoxText(content, text) };
    }
    return childNodes;
}

/**
 * @param {TextAttributes} text - text
 * @param {string} textValue - textValue
 * @param {number} maxHeight - maxHeight
 * @private
 * @returns {SubTextElement[]} - array of SubTextElement
 */
function wordWrappingEJ2(text: TextAttributes, textValue?: string, maxHeight?: number): SubTextElement[] {
    let childNodes: SubTextElement[] = []; let txtValue: string = ''; let j: number = 0;
    let i: number = 0;
    const wrap: boolean = text.whiteSpace !== 'nowrap' ? true : false;
    const content: string = textValue || text.content;
    let bounds1: number;
    const eachLine: string[] = content.split('\n');
    let txt: string;
    let words: Object[]; let newText: string;
    let height: number = 0;
    let existingWidth: number;
    let existingText: string;
    for (j = 0; j < eachLine.length; j++) {
        txt = '';
        words = text.textWrapping !== 'NoWrap' ? eachLine[parseInt(j.toString(), 10)].split(' ') : eachLine;
        for (i = 0; i < words.length; i++) {
            bounds1 = bBoxText(words[parseInt(i.toString(), 10)] as string, text);
            if (bounds1 > text.width && (words[parseInt(i.toString(), 10)] as string).length > 0 && text.textWrapping !== 'NoWrap') {
                if (eachLine.length > 1) {
                    words[parseInt(i.toString(), 10)] = words[parseInt(i.toString(), 10)] + '\n';
                }
                const previousTextContent: string = text.content;
                text.content = words[parseInt(i.toString(), 10)] as string;
                //childNodes = wrapText(text, txtValue, childNodes, maxHeight, height);
                const res: any = wrapTextEJ2(text, txtValue, childNodes, maxHeight, height);
                childNodes = res.childNode;
                height = res.height;
                text.content = previousTextContent;
            } else {
                txtValue += (((i !== 0 || words.length === 1) && wrap && txtValue.length > 0) ? ' ' : '') + words[parseInt(i.toString(), 10)];
                newText = txtValue + (words[i + 1] || '');
                let width: number = bBoxText(newText, text);
                if (text.content[text.content.indexOf(txtValue) + txtValue.length] === ' ') {
                    width += bBoxText(' ', text);
                }
                if (eachLine.length > 1 && i === words.length - 1) {
                    txtValue = txtValue + '\n';
                }
                if (Math.floor(width) > text.width - 2 && txtValue.length > 0) {
                    textValue = txtValue;
                    const differenceValue: number = (text.fontSize * 1.2) - bBoxTextHeight(txtValue, text);
                    height = height + bBoxTextHeight(txtValue, text) + differenceValue;
                    if (maxHeight === undefined || maxHeight === null || height <= maxHeight ||
                        (height > maxHeight && childNodes.length === 0)) {
                        childNodes[childNodes.length] = {
                            text: (txtValue.indexOf('\n') === -1 && i !== words.length - 1) ? txtValue + ' ' : textValue, x: 0, dy: 0,
                            width: newText === txtValue ? width : (txtValue === existingText) ? existingWidth : bBoxText(txtValue, text)
                        };
                    }
                    txtValue = '';
                } else {
                    if (i === words.length - 1) {
                        const differenceValue: number = (text.fontSize * 1.2) - bBoxTextHeight(txtValue, text);
                        height = height + bBoxTextHeight(txtValue, text) + differenceValue;
                        if (maxHeight === undefined || height <= maxHeight || (height > maxHeight && childNodes.length === 0)) {
                            childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                            txtValue = '';
                        }
                    }
                }
                existingText = newText;
                existingWidth = width;
            }
        }
    }
    return childNodes;
}

/**
 * @param {TextAttributes} txt - txt
 * @param {string} textValue - textValue
 * @param {SubTextElement[]} childNode - childNode
 * @param {number} maxHeight - maxHeight
 * @param {number} height - height
 * @private
 * @returns {any} - any
 */
function wrapTextEJ2(txt: TextAttributes, textValue?: string, childNode?: SubTextElement[],
                     maxHeight?: number, height?: number): any {
    let k: number = 0;
    let txtValue: string; let bounds1: number;
    const content: string = textValue || txt.content;
    txtValue = '';
    txtValue += content[0];
    let isFreeTextHeightAllowed: boolean;
    for (k = 0; k < content.length; k++) {
        bounds1 = bBoxText(txtValue, txt);
        if (bounds1 >= txt.width && txtValue.length > 0) {
            const differenceValue: number = (txt.fontSize * 1.2) - bBoxTextHeight(txtValue, txt);
            height = height + bBoxTextHeight(txtValue, txt) + differenceValue;
            if (maxHeight === undefined || maxHeight === null || height <= maxHeight || (height > maxHeight && childNode.length === 0)) {
                childNode[childNode.length] = { text: txtValue, x: 0, dy: 0, width: bounds1 };
            }
            txtValue = '';
        } else {
            txtValue = txtValue + (content[k + 1] || '');
            let width: number = bBoxText(txtValue, txt);
            if ((Math.ceil(width) + 2 >= txt.width && txtValue.length > 0)) {
                txtValue = txtValue.slice(0, -1);
                const differenceValue: number = (txt.fontSize * 1.2) - bBoxTextHeight(txtValue, txt);
                height = height + bBoxTextHeight(txtValue, txt) + differenceValue;
                width = bBoxText(txtValue, txt);
                isFreeTextHeightAllowed = (maxHeight === undefined || maxHeight === null ||
                    height <= maxHeight || (height > maxHeight && childNode.length === 0));
                if (isFreeTextHeightAllowed) {
                    childNode[childNode.length] = { text: txtValue, x: 0, dy: 0, width: width };
                }
                txtValue = content[k + 1] || '';
            }
            if (k === content.length - 1 && txtValue.length > 0) {
                const differenceValue: number = (txt.fontSize * 1.2) - bBoxTextHeight(txtValue, txt);
                height = height + bBoxTextHeight(txtValue, txt) + differenceValue;
                isFreeTextHeightAllowed = (maxHeight === undefined || maxHeight === null || height <= maxHeight ||
                    (height > maxHeight && childNode.length === 0));
                if (isFreeTextHeightAllowed) {
                    childNode[childNode.length] = { text: txtValue, x: 0, dy: 0, width: width };
                }
                txtValue = '';
            }
        }
    }
    return { childNode, height };
}

/**
 * @param {TextAttributes} text - text
 * @param {string} textValue - textValue
 * @param {number} maxHeight - maxHeight
 * @private
 * @returns {SubTextElement[]} - array of SubTextElement
 */
function wrapSvgText(text: TextAttributes, textValue?: string, maxHeight?: number): SubTextElement[] {
    let childNodes: SubTextElement[] = []; let k: number = 0;
    let txtValue: string; let bounds1: number;
    const content: string = textValue || text.content;
    if (text.whiteSpace !== 'nowrap' && text.whiteSpace !== 'pre') {
        if (text.breakWord === 'breakall') {
            txtValue = '';
            txtValue += content[0];
            for (k = 0; k < content.length; k++) {
                bounds1 = bBoxText(txtValue, text);
                if (txtValue === '\n'){
                    txtValue = content[k + 1];
                    k++;
                }
                if (bounds1 >= text.width && txtValue.length > 0) {
                    txtValue = content[k + 1] === '\n' ? txtValue + content[k + 1] : txtValue;
                    childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: bounds1 };
                    txtValue = '';
                } else {
                    txtValue = txtValue + (content[k + 1] || '');
                    // if (txtValue.indexOf('\n') > -1) {
                    //     txtValue = txtValue.replace('\n', '');
                    // }
                    let width: number = bBoxText(txtValue, text);
                    if ((Math.ceil(width) + 2 >= text.width && txtValue.length > 0) || (txtValue.indexOf('\n') > -1)) {
                        txtValue = txtValue.slice(0, -1);
                        width = bBoxText(txtValue, text);
                        txtValue = content[k + 1] === '\n' ? txtValue + content[k + 1] : txtValue;
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                        txtValue = content[k + 1] || '';
                    }
                    if (k === content.length - 1 && txtValue.length > 0) {
                        txtValue = content[k + 1] === '\n' ? txtValue + content[k + 1] : txtValue;
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                        txtValue = '';
                    }
                }
            }
        } else {
            childNodes = wordWrapping(text, textValue, maxHeight);
        }
    } else {
        childNodes[childNodes.length] = { text: content, x: 0, dy: 0, width: bBoxText(content, text) };
    }
    return childNodes;
}

/**
 * @param {TextAttributes} text - text
 * @param {string} textValue - textValue
 * @param {number} maxHeight - maxHeight
 * @private
 * @returns {SubTextElement[]} - array of SubTextElement
 */
function wrapSvgTextBlazor(text: TextAttributes, textValue?: string, maxHeight?: number): SubTextElement[] {
    let childNodes: SubTextElement[] = []; let k: number = 0;
    let txtValue: string; let bounds1: number;
    const content: string = textValue || text.content;
    if (text.whiteSpace !== 'nowrap' && text.whiteSpace !== 'pre') {
        if (text.breakWord === 'breakall') {
            txtValue = '';
            txtValue += content[0];
            for (k = 0; k < content.length; k++) {
                bounds1 = bBoxTextBlazor(txtValue, text);
                if (txtValue === '\n'){
                    txtValue = content[k + 1];
                    k++;
                }
                if (bounds1 >= text.width && txtValue.length > 0) {
                    txtValue = content[k + 1] === '\n' ? txtValue + content[k + 1] : txtValue;
                    childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: bounds1 };
                    txtValue = '';
                } else {
                    txtValue = txtValue + (content[k + 1] || '');
                    // if (txtValue.indexOf('\n') > -1) {
                    //     txtValue = txtValue.replace('\n', '');
                    // }
                    let width: number = bBoxTextBlazor(txtValue, text);
                    if ((Math.ceil(width) + 2 >= text.width && txtValue.length > 0) || (txtValue.indexOf('\n') > -1)) {
                        txtValue = txtValue.slice(0, -1);
                        width = bBoxTextBlazor(txtValue, text);
                        txtValue = content[k + 1] === '\n' ? txtValue + content[k + 1] : txtValue;
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                        txtValue = content[k + 1] || '';
                    }
                    if (k === content.length - 1 && txtValue.length > 0) {
                        txtValue = content[k + 1] === '\n' ? txtValue + content[k + 1] : txtValue;
                        childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                        txtValue = '';
                    }
                }
            }
        } else {
            childNodes = wordWrappingBlazor(text, textValue, maxHeight);
        }
    } else {
        childNodes[childNodes.length] = { text: content, x: 0, dy: 0, width: bBoxTextBlazor(content, text) };
    }
    return childNodes;
}

/**
 * @param {TextAttributes} text - text
 * @param {string} textValue - textValue
 * @param {number} maxHeight - maxHeight
 * @private
 * @returns {SubTextElement[]} - array of SubTextElement
 */
function wordWrappingBlazor(text: TextAttributes, textValue?: string, maxHeight?: number): SubTextElement[] {
    let childNodes: SubTextElement[] = []; let txtValue: string = ''; let j: number = 0;
    let i: number = 0;
    const wrap: boolean = text.whiteSpace !== 'nowrap' ? true : false;
    const content: string = textValue || text.content;
    let bounds1: number;
    const eachLine: string[] = content.split('\n'); let txt: string;
    let words: Object[]; let newText: string;
    let existingWidth: number;
    let existingText: string;
    let height: number = 0;
    const thicknessInPixel: number = text.thickness * (96 / 72);
    // The padding has been added to remove the overflow text such that text would be contained within the bounds.
    const topPadding: number = text.thickness !== undefined ? thicknessInPixel === 1 ||
    thicknessInPixel === 0 ?  thicknessInPixel * 4 : thicknessInPixel + 4 : 5;
    for (j = 0; j < eachLine.length; j++) {
        txt = '';
        if (childNodes.length > 0 && ((childNodes.length * text.fontSize * 1.2) + topPadding) > maxHeight) {
            break;
        }
        words = text.textWrapping !== 'NoWrap' ? eachLine[parseInt(j.toString(), 10)].split(' ') : eachLine;
        const exactMaxHeight: number = text.thickness !== undefined ? Math.floor(maxHeight) : maxHeight;
        for (i = 0; i < words.length; i++) {
            const exactTextHeight: number = text.thickness !== undefined ? Math.ceil(height) : height;
            bounds1 = bBoxTextBlazor(words[parseInt(i.toString(), 10)] as string, text);
            //Used to get the word width including thickness.
            const wordWidth: number = text.thickness !== undefined ? thicknessInPixel === 1 ||
            thicknessInPixel === 0 ? (thicknessInPixel * 2) + bounds1 : (thicknessInPixel * 2) + 4 + bounds1 : bounds1;
            if (wordWidth > text.width && (words[parseInt(i.toString(), 10)] as string).length > 0 && text.textWrapping !== 'NoWrap' && exactTextHeight < exactMaxHeight) {
                if (eachLine.length > 1) {
                    words[parseInt(i.toString(), 10)] = words[parseInt(i.toString(), 10)] + '\n';
                }
                const previousTextContent: string = text.content;
                text.content = words[parseInt(i.toString(), 10)] as string;
                const res: ChildNodeResult = wrapTextBlazor(text, txtValue, childNodes, maxHeight, height);
                childNodes = res.childNode;
                height = res.height;
                text.content = previousTextContent;
            } else {
                txtValue += (((i !== 0 || words.length === 1) && wrap && txtValue.length > 0) ? ' ' : '') + words[parseInt(i.toString(), 10)];
                const spaceWithText: string = text.thickness !== undefined && i + 1 !== words.length ? ' ' : '';
                newText = txtValue + spaceWithText + (words[i + 1] || '');
                const width: number = bBoxTextBlazor(newText, text);
                if (eachLine.length > 1 && i === words.length - 1) {
                    txtValue = txtValue + '\n';
                }
                const isNewlineOnly: boolean = txtValue === '\n';
                const isLastWordAndNextLineEmpty: boolean = (i + 1 >= words.length &&  eachLine[parseInt((j + 1).toString(), 10)] === '');
                const calculatedWidth: number = text.thickness !== undefined ? thicknessInPixel === 1 ? Math.floor(thicknessInPixel) +
                Math.ceil(width) : Math.floor(thicknessInPixel) * 2 + 4 + Math.ceil(width) + 2 : Math.ceil(width) + 2;
                if (childNodes.length === 0 && text.thickness !== undefined && topPadding !== 0 && topPadding > exactMaxHeight) {
                    height = height + getHeightMultiplier(txtValue) * bBoxTextHeight(txtValue, text) + topPadding;
                    break;
                }
                const exactTextWidth: number = text.thickness !== undefined ? Math.floor(text.width) : text.width;
                if ((calculatedWidth + 1) >= exactTextWidth && txtValue.length > 0) {
                    textValue = txtValue;
                    if ((maxHeight === undefined || maxHeight === null || exactTextHeight < exactMaxHeight ||
                        childNodes.length === 0 && text.fontSize * 1.2 > maxHeight)) {
                        childNodes[childNodes.length] = {
                            text: (txtValue.indexOf('\n') === -1 && i !== words.length - 1) ? txtValue + ' ' : textValue, x: 0, dy: 0,
                            width: newText === txtValue ? width : (txtValue === existingText) ? existingWidth :
                                bBoxTextBlazor(txtValue, text)
                        };
                        if (text.textAlign === 'justify' && text.thickness !== undefined) {
                            childNodes[childNodes.length - 1].width = Math.floor(text.width);
                        }
                    } else if (text.thickness !== undefined && exactTextHeight >= exactMaxHeight) {
                        childNodes[childNodes.length] = {
                            text: txtValue.indexOf('\n') === -1 && i !== words.length ? txtValue + ' ' : textValue, x: 0, dy: 0,
                            width: newText === txtValue ? width : txtValue === existingText ? existingWidth : bBoxTextBlazor(txtValue, text)
                        };
                        if (text.textAlign === 'justify' && text.thickness !== undefined) {
                            childNodes[childNodes.length - 1].width = Math.floor(text.width);
                        }
                        break;
                    }
                    const sanitizedForHeight: string = (isNewlineOnly || isLastWordAndNextLineEmpty) ? txtValue : txtValue.replace(/\n/g, '');
                    height = height + getHeightMultiplier(sanitizedForHeight) * bBoxTextHeight(sanitizedForHeight, text);
                    txtValue = '';
                } else {
                    if (i === words.length - 1) {
                        if ((maxHeight === undefined) || (exactTextHeight < exactMaxHeight) ||
                        childNodes.length === 0 && text.fontSize * 1.2 > maxHeight) {
                            childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                            if (text.textAlign === 'justify' && text.thickness !== undefined) {
                                childNodes[childNodes.length - 1].width = Math.floor(text.width);
                            }
                        } else if (text.thickness !== undefined && exactTextHeight >= exactMaxHeight) {
                            childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                            if (text.textAlign === 'justify' && text.thickness !== undefined) {
                                childNodes[childNodes.length - 1].width = Math.floor(text.width);
                            }
                            break;
                        }
                        const sanitizedForHeightEnd: string = (isNewlineOnly || isLastWordAndNextLineEmpty) ? txtValue : txtValue.replace(/\n/g, '');
                        height = height + getHeightMultiplier(sanitizedForHeightEnd) * bBoxTextHeight(sanitizedForHeightEnd, text);
                        txtValue = '';
                    }
                }
                existingText = newText;
                existingWidth = width;
            }
        }
    }
    return childNodes;
}

/**
 * @param {TextAttributes} text - text
 * @param {string} textValue - textValue
 * @param {number} maxHeight - maxHeight
 * @private
 * @returns {SubTextElement[]} - array of SubTextElement
 */
function wordWrapping(text: TextAttributes, textValue?: string, maxHeight?: number): SubTextElement[] {
    let childNodes: SubTextElement[] = []; let txtValue: string = ''; let j: number = 0;
    let i: number = 0;
    const  wrap: boolean = text.whiteSpace !== 'nowrap' ? true : false;
    const content: string = textValue || text.content;
    let bounds1: number;
    const eachLine: string[] = content.split('\n');
    let txt: string;
    let words: Object[]; let newText: string;
    let existingWidth: number;
    let existingText: string;
    let height: number = 0;
    const thicknessInPixel: number = text.thickness * (96 / 72);
    // The padding has been added to remove the overflow text such that text would be contained within the bounds.
    const topPadding: number = text.thickness !== undefined ? (thicknessInPixel) * 4 : 5;
    for (j = 0; j < eachLine.length; j++) {
        txt = '';
        if (childNodes.length > 0 && ((childNodes.length * text.fontSize * 1.2) + topPadding) > maxHeight) {
            break;
        }
        words = text.textWrapping !== 'NoWrap' ? eachLine[parseInt(j.toString(), 10)].split(' ') : eachLine;
        const exactMaxHeight: number = text.thickness !== undefined ? Math.floor(maxHeight) : maxHeight;
        for (i = 0; i < words.length; i++) {
            const exactTextHeight: number = text.thickness !== undefined ? Math.ceil(height) : height;
            bounds1 = bBoxText(words[parseInt(i.toString(), 10)] as string, text);
            //Used to get the word width including thickness.
            const wordWidth: number = text.thickness !== undefined ? thicknessInPixel * 4 + bounds1 : bounds1;
            if (wordWidth > text.width && (words[parseInt(i.toString(), 10)] as string).length > 0 && text.textWrapping !== 'NoWrap' && exactTextHeight < exactMaxHeight) {
                if (eachLine.length > 1) {
                    words[parseInt(i.toString(), 10)] = words[parseInt(i.toString(), 10)] + '\n';
                }
                text.content = words[parseInt(i.toString(), 10)] as string;
                childNodes = wrapText(text, txtValue, childNodes, maxHeight);
            } else {
                txtValue += (((i !== 0 || words.length === 1) && wrap && txtValue.length > 0) ? ' ' : '') + words[parseInt(i.toString(), 10)];
                const spaceWithText: string = text.thickness !== undefined && i + 1 !== words.length ? ' ' : '';
                newText = txtValue + spaceWithText + (words[i + 1] || '');
                const width: number = bBoxText(newText, text);
                if (eachLine.length > 1 && i === words.length - 1) {
                    txtValue = txtValue + '\n';
                }
                const isNewlineOnly: boolean = txtValue === '\n';
                const isLastWordAndNextLineEmpty: boolean = (i + 1 >= words.length &&  eachLine[parseInt((j + 1).toString(), 10)] === '');
                const calculatedWidth: number = text.thickness !== undefined ? Math.ceil(thicknessInPixel) * 4 +
                Math.ceil(width) + 2 : Math.ceil(width) + 2;
                const paddingBetweenWords: number = text.thickness !== undefined ? (thicknessInPixel) * 2 : 0;
                if (childNodes.length === 0 && text.thickness !== undefined && topPadding !== 0 && topPadding > exactMaxHeight) {
                    height = height + getHeightMultiplier(txtValue) * bBoxTextHeight(txtValue, text) + topPadding;
                    break;
                }
                const exactTextWidth: number = text.thickness !== undefined ? Math.floor(text.width) : text.width;
                if (calculatedWidth >= exactTextWidth && txtValue.length > 0) {
                    textValue = txtValue;
                    if ((maxHeight === undefined || maxHeight === null || exactTextHeight < exactMaxHeight ||
                        childNodes.length === 0 && text.fontSize * 1.2 > maxHeight)) {
                        childNodes[childNodes.length] = {
                            text: (txtValue.indexOf('\n') === -1 && i !== words.length - 1) ? txtValue + ' ' : textValue, x: 0, dy: 0,
                            width: newText === txtValue ? width : (txtValue === existingText) ? existingWidth : bBoxText(txtValue, text)
                        };
                        if (text.textAlign === 'justify' && text.thickness !== undefined) {
                            childNodes[childNodes.length - 1].width = Math.floor(text.width);
                        }
                    } else if (text.thickness !== undefined && exactTextHeight >= exactMaxHeight &&
                        bBoxTextHeight(txtValue, text) > paddingBetweenWords) {
                        childNodes[childNodes.length] = {
                            text: txtValue.indexOf('\n') === -1 && i !== words.length ? txtValue + ' ' : textValue, x: 0, dy: 0,
                            width: newText === txtValue ? width : txtValue === existingText ? existingWidth : bBoxText(txtValue, text)
                        };
                        if (text.textAlign === 'justify' && text.thickness !== undefined) {
                            childNodes[childNodes.length - 1].width = Math.floor(text.width);
                        }
                        break;
                    }
                    const sanitizedForHeight: string = (isNewlineOnly || isLastWordAndNextLineEmpty) ? txtValue : txtValue.replace(/\n/g, '');
                    height = height + getHeightMultiplier(sanitizedForHeight) *
                    bBoxTextHeight(sanitizedForHeight, text) + paddingBetweenWords;
                    txtValue = '';
                } else {
                    if (i === words.length - 1) {
                        if ((maxHeight === undefined) || (exactTextHeight < exactMaxHeight) ||
                        childNodes.length === 0 && text.fontSize * 1.2 > maxHeight) {
                            childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                            if (text.textAlign === 'justify' && text.thickness !== undefined) {
                                childNodes[childNodes.length - 1].width = Math.floor(text.width);
                            }
                        } else if (text.thickness !== undefined && exactTextHeight >= exactMaxHeight &&
                            bBoxTextHeight(txtValue, text) > paddingBetweenWords) {
                            childNodes[childNodes.length] = { text: txtValue, x: 0, dy: 0, width: width };
                            if (text.textAlign === 'justify' && text.thickness !== undefined) {
                                childNodes[childNodes.length - 1].width = Math.floor(text.width);
                            }
                            break;
                        }
                        const sanitizedForHeightEnd: string = (isNewlineOnly || isLastWordAndNextLineEmpty) ? txtValue : txtValue.replace(/\n/g, '');
                        height = height + getHeightMultiplier(sanitizedForHeightEnd) *
                        bBoxTextHeight(sanitizedForHeightEnd, text) + paddingBetweenWords;
                        txtValue = '';
                    }
                }
                existingText = newText;
                existingWidth = width;
            }
        }
    }
    return childNodes;
}

/**
 * @param {TextAttributes} text - text
 * @private
 * @returns {number} - number
 */
function getHeightMultiplier(text: string) : number{
    const lines: string[] = text.split(/\r?\n/);
    const hasContent: boolean = lines.some((line: string) => line.trim().length > 0);
    return hasContent ? lines.length : 1;
}

/**
 * @param {TextAttributes} txt - txt
 * @param {string} textValue - textValue
 * @param {SubTextElement[]} childNode - childNode
 * @param {number} maxHeight - maxHeight
 * @param {number} height - height
 * @private
 * @returns {ChildNodeResult} - ChildNodeResult
 */
function wrapTextBlazor(txt: TextAttributes, textValue?: string, childNode?: SubTextElement[],
                        maxHeight?: number, height?: number): ChildNodeResult {
    let k: number = 0;
    let txtValue: string; let bounds1: number;
    const content: string = textValue || txt.content;
    txtValue = '';
    txtValue += content[0];
    let isFreeTextHeightAllowed: boolean;
    const additionalPadding: number = txt.thickness !== undefined && (txt.thickness === 0 || txt.thickness === 1) ?
        Math.ceil(txt.thickness * (96 / 72)) : Math.ceil(txt.thickness * (96 / 72)) + 4;
    for (k = 0; k < content.length; k++) {
        bounds1 = bBoxTextBlazor(txtValue, txt);
        if (bounds1 + additionalPadding >= txt.width && txtValue.length > 0) {
            if (maxHeight === undefined || maxHeight === null || height + additionalPadding < maxHeight || childNode.length === 0) {
                childNode[childNode.length] = { text: txtValue, x: 0, dy: 0, width: bounds1 };
            }
            height = height +  bBoxTextHeight(txtValue, txt);
            txtValue = content[k + 1] || '';
        } else {
            txtValue = txtValue + (content[k + 1] || '');
            let width: number = bBoxTextBlazor(txtValue, txt) + additionalPadding;
            if ((Math.ceil(width) + 2 >= txt.width && txtValue.length > 0)) {
                height = height +  bBoxTextHeight(txtValue, txt);
                txtValue = txtValue.slice(0, -1);
                width = bBoxTextBlazor(txtValue, txt);
                isFreeTextHeightAllowed = ((maxHeight === undefined || maxHeight === null || height + additionalPadding <= maxHeight));
                if (isFreeTextHeightAllowed || childNode.length === 0) {
                    childNode[childNode.length] = { text: txtValue, x: 0, dy: 0, width: width };
                }
                txtValue = content[k + 1] || '';
            }
            if (k === content.length - 1 && txtValue.length > 0) {
                height = height + bBoxTextHeight(txtValue, txt);
                isFreeTextHeightAllowed = ((maxHeight === undefined || maxHeight === null || height + additionalPadding <= maxHeight));
                if (isFreeTextHeightAllowed || childNode.length === 0) {
                    childNode[childNode.length] = { text: txtValue, x: 0, dy: 0, width: width };
                }
                txtValue = '';
            }
        }
    }
    return {
        childNode: childNode,
        height: height
    };
}

/**
 * @param {TextAttributes} txt - txt
 * @param {string} textValue - textValue
 * @param {SubTextElement[]} childNode - childNode
 * @param {number} maxHeight - maxHeight
 * @private
 * @returns {SubTextElement[]} - SubTextElement[]
 */
function wrapText(txt: TextAttributes, textValue?: string, childNode?: SubTextElement[],
                  maxHeight?: number): SubTextElement[] {
    let k: number = 0;
    let txtValue: string; let bounds1: number;
    const content: string = textValue || txt.content;
    txtValue = '';
    let height: number = 0;
    txtValue += content[0];
    let isFreeTextHeightAllowed: boolean;
    let additionalPadding: number = txt.thickness !== undefined ? Math.ceil(txt.thickness * (96 / 72)) * 4 : 0;
    for (k = 0; k < content.length; k++) {
        bounds1 = bBoxText(txtValue, txt);
        if (bounds1 + additionalPadding >= txt.width && txtValue.length > 0) {
            if (maxHeight === undefined || maxHeight === null || height < maxHeight) {
                childNode[childNode.length] = { text: txtValue, x: 0, dy: 0, width: bounds1 };
            }
            height = height +  bBoxTextHeight(txtValue, txt) + additionalPadding;
            additionalPadding = 0;
            txtValue = '';
        } else {
            txtValue = txtValue + (content[k + 1] || '');
            let width: number = bBoxText(txtValue, txt) + additionalPadding;
            if ((Math.ceil(width) + 2 >= txt.width && txtValue.length > 0)) {
                height = height +  bBoxTextHeight(txtValue, txt) + additionalPadding;
                additionalPadding = 0;
                txtValue = txtValue.slice(0, -1);
                width = bBoxText(txtValue, txt);
                isFreeTextHeightAllowed = ((maxHeight === undefined || maxHeight === null || height <= maxHeight));
                if (isFreeTextHeightAllowed) {
                    childNode[childNode.length] = { text: txtValue, x: 0, dy: 0, width: width };
                }
                txtValue = content[k + 1] || '';
            }
            if (k === content.length - 1 && txtValue.length > 0) {
                if (txt.strokeWidth > 1 && txt.relativeMode === 'Point') {
                    height = height + bBoxTextHeight(txtValue, txt) + additionalPadding;
                    additionalPadding = 0;
                }
                isFreeTextHeightAllowed = ((maxHeight === undefined || maxHeight === null || height <= maxHeight));
                if (isFreeTextHeightAllowed) {
                    childNode[childNode.length] = { text: txtValue, x: 0, dy: 0, width: width };
                }
                txtValue = '';
            }
        }
    }
    return childNode;
}

/**
 * @param {TextAttributes} text - text
 * @param {SubTextElement[]} childNodes - childNodes
 * @param {boolean} isEJ2 - isEJ2
 * @private
 * @returns {TextBounds} - TextBounds
 */
function wrapSvgTextAlign(text: TextAttributes, childNodes: SubTextElement[], isEJ2?: boolean): TextBounds {
    let wrapBounds: TextBounds = { x: 0, width: 0 };
    let k: number = 0;
    let txtWidth: number;
    let width: number;
    for (k = 0; k < childNodes.length; k++) {
        txtWidth = childNodes[parseInt(k.toString(), 10)].width;
        width = txtWidth;
        if (isEJ2 === true) {
            if (text.textAlign === 'left' || text.textAlign === 'justify') {
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
        } else {
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
        }
        childNodes[parseInt(k.toString(), 10)].dy = text.fontSize * 1.2;
        childNodes[parseInt(k.toString(), 10)].x = txtWidth;
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
 * @param {TextElement} text - text
 * @param {TextStyleModel} style - style
 * @param {string} content - content
 * @param {number} maxWidth - maxWidth
 * @param {number} maxHeight - maxHeight
 * @param {string} textValue - textValue
 * @private
 * @returns {Size} - Size
 */
export function measureText(
    text: TextElement, style: TextStyleModel, content: string,
    maxWidth?: number, maxHeight?: number, textValue?: string): Size {
    const bounds: Size = new Size(0, 0);
    let childNodes: SubTextElement[];
    let wrapBounds: TextBounds;
    const options: TextAttributes = getTextOptions(text, maxWidth) as TextAttributes;
    if (text.isEJ2 === true && text.isFreeText === true) {        // EJ2 Free Text: use strokeWidth only, double the standard 1.5x per-side padding
        const stroke: number = Math.ceil(options.strokeWidth || 0);
        const totalPad: number = stroke * 3 * 1.8;
        options.width = Math.max(0, options.width - totalPad + stroke);
        options.height = Math.max(0, options.height - totalPad);
        if (maxHeight != null) {
            maxHeight = Math.max(0, maxHeight - totalPad + (stroke / 1.5));
        }
        text.childNodes = childNodes = wrapSvgTextEJ2(options, textValue, maxHeight);
    } else {
        if (text.isFreeText === true) {
            text.freeTextSelectorWidth = options.width ? options.width : 0;
            text.childNodes = childNodes = wrapSvgTextBlazor(options, textValue, maxHeight);
        }
        else {
            text.childNodes = childNodes = wrapSvgText(options, textValue, maxHeight);
        }
    }
    text.wrapBounds = wrapBounds = wrapSvgTextAlign(options, childNodes, text.isEJ2);
    bounds.width = wrapBounds.width;
    if (text.wrapBounds.width >= maxWidth && options.textOverflow !== 'Wrap') {
        bounds.width = maxWidth;
    }
    bounds.height = childNodes.length * text.style.fontSize * 1.2;
    return bounds;
}

/**
 * @param {string} elementId - elementId
 * @param {string} contentId - contentId
 * @private
 * @returns {HTMLElement} - HTMLElement
 */
export function getDiagramElement(elementId: string, contentId?: string): HTMLElement {
    let element: HTMLElement;
    if (contentId && (typeof document !== 'undefined')) {
        element = document.getElementById(contentId);
    }
    const diagramElement: HTMLElement = (element) ? element.querySelector('#' + elementId) as HTMLElement : (typeof document !== 'undefined') ? document.getElementById(elementId) : null;
    return diagramElement;
}

/**
 * @param {string} elementType - elementType
 * @param {Object} attribute - attribute
 * @private
 * @returns {HTMLElement} - HTMLElement
 */
export function createHtmlElement(elementType: string, attribute: Object): HTMLElement {
    const element: HTMLElement = createElement(elementType);
    setAttributeHtml(element, attribute);
    return element;
}

/**
 * @param {HTMLElement} element - element
 * @param {Object} attributes - attributes
 * @private
 * @returns {void} - void
 */
export function setAttributeHtml(element: HTMLElement, attributes: Object): void {
    const keys: string[] = Object.keys(attributes);
    for (let i: number = 0; i < keys.length; i++) {
        if (keys[parseInt(i.toString(), 10)] === 'style') {
            element.style.cssText = (attributes as any)[keys[parseInt(i.toString(), 10)]];
        }
        else {
            element.setAttribute(keys[parseInt(i.toString(), 10)], (attributes as any)[keys[parseInt(i.toString(), 10)]]);
        }
    }
}

/**
 * @param {string} diagramId - diagramId
 * @param {number} index - index
 * @private
 * @returns {SVGSVGElement} - SVGSVGElement
 */
export function getAdornerLayerSvg(diagramId: string, index?: number): SVGSVGElement {
    let adornerLayerSvg: SVGSVGElement = null;
    const diagramElement: HTMLElement = getDiagramElement(diagramId + index + '_diagramAdornerLayer');
    let elementcoll: HTMLCollection;
    if (diagramElement) {
        elementcoll = diagramElement.getElementsByClassName('e-adorner-layer' + index);
        adornerLayerSvg = elementcoll[0] as SVGSVGElement;
    }
    return adornerLayerSvg;
}

/**
 * @param {string} diagramId - diagramId
 * @param {number} index - index
 * @private
 * @returns {SVGElement} - SVGElement
 */
export function getSelectorElement(diagramId: string, index?: number): SVGElement {
    let adornerLayer: SVGElement = null;
    const adornerSvg: SVGSVGElement = getAdornerLayerSvg(diagramId, index);
    if (adornerSvg) {
        adornerLayer = adornerSvg.getElementById(diagramId + '_SelectorElement') as SVGElement;
    }
    return adornerLayer;
}

/**
 * @private
 * @returns {void} - void
 */
export function createMeasureElements(): void {
    const measureElement: string = 'measureElement';
    if (!(window as any)[measureElement as string]) {
        const divElement: HTMLElement = createHtmlElement('div', {
            id: 'measureElement',
            style: 'visibility:hidden ; height: 0px ; width: 0px; overflow: hidden;'
        });
        const text: HTMLElement = createHtmlElement('span', { 'style': 'display:inline-block ; line-height: normal' });
        divElement.appendChild(text);
        const imageElement: HTMLImageElement = createHtmlElement('img', {}) as HTMLImageElement;
        divElement.appendChild(imageElement);
        if (typeof document !== 'undefined') {
            const svg: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
            divElement.appendChild(svg);

            const element: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            svg.appendChild(element);

            const data: Text = document.createTextNode('');
            const tSpan: SVGTextElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            tSpan.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
            svg.appendChild(tSpan);
            (window as any)[measureElement as string] = divElement;
            (window as any)[measureElement as string].usageCount = 1;
            document.body.appendChild(divElement);
        }
    } else {
        (window as any)[measureElement as string].usageCount += 1;
    }
}

/**
 * @param {string} source - source
 * @param {Size} contentSize - contentSize
 * @private
 * @returns {Size} - Size
 */
export function measureImage(source: string, contentSize: Size): Size {
    const measureElement: string = 'measureElement';
    (window as any)[measureElement as string].style.visibility = 'visible';
    const imageElement: HTMLImageElement = (window as any)[measureElement as string].children[1];
    imageElement.setAttribute('src', source);
    const bounds: ClientRect = imageElement.getBoundingClientRect();
    const width: number = bounds.width;
    const height: number = bounds.height;
    contentSize = new Size(width, height);
    (window as any)[measureElement as string].style.visibility = 'hidden';
    return contentSize;
}
