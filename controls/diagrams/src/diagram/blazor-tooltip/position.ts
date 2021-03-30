/* eslint-disable valid-jsdoc */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/**
 * Position library
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
let elementRect: ClientRect;
let popupRect: ClientRect;
let element: Element;
let parentDocument: Document;
// eslint-disable-next-line @typescript-eslint/ban-types
let fixedParent: Boolean = false;
/**
 * @private
 */
export function calculateRelativeBasedPosition(
    anchor: HTMLElement,
    element: HTMLElement): OffsetPosition {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let fixedElement: Boolean = false;
    const anchorPos: OffsetPosition = { left: 0, top: 0 };
    const tempAnchor: HTMLElement = anchor;
    if ( !anchor || !element) {
        return anchorPos;
    }
    if (isNullOrUndefined(element.offsetParent) && element.style.position === 'fixed') {
        fixedElement = true;
    }
    while ((element.offsetParent || fixedElement) && anchor && element.offsetParent !== anchor) {
        anchorPos.left += anchor.offsetLeft;
        anchorPos.top += anchor.offsetTop;
        anchor = anchor.offsetParent as HTMLElement;
    }
    anchor = tempAnchor;
    while ((element.offsetParent || fixedElement) && anchor && element.offsetParent !== anchor) {
        anchorPos.left -= anchor.scrollLeft;
        anchorPos.top -= anchor.scrollTop;
        anchor = anchor.parentElement;
    }
    return anchorPos;
}
/**
 * @private
 */
export function calculatePosition(
    // eslint-disable-next-line @typescript-eslint/ban-types
    currentElement: Element, positionX?: string, positionY?: string, parentElement?: Boolean,
    targetValues?: ClientRect): OffsetPosition {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    (positionY + positionX === 'topright') ? popupRect = undefined : popupRect = targetValues;
    popupRect = targetValues;
    fixedParent = parentElement ? true : false;
    if (!currentElement) {
        return{ left: 0, top: 0 };
    }
    if (!positionX) {
        positionX = 'left';
    }
    if (!positionY) {
        positionY = 'top';
    }
    parentDocument = currentElement.ownerDocument;
    element = currentElement;
    const pos: OffsetPosition = { left: 0, top: 0 };
    return updatePosition(positionX.toLowerCase(), positionY.toLowerCase(), pos);
}
/**
 * @private
 */
function setPosx(value: number, pos: OffsetPosition): void {
    pos.left = value;
}
/**
 * @private
 */
function setPosy(value: number, pos: OffsetPosition): void {
    pos.top = value;
}
/**
 * @private
 */
function updatePosition(posX: string, posY: string, pos: OffsetPosition): OffsetPosition {
    elementRect = element.getBoundingClientRect();

    switch (posY + posX) {
    case 'topcenter':
        setPosx(getElementHCenter(), pos);
        setPosy(getElementTop(), pos);
        break;
    case 'topright':
        setPosx(getElementRight(), pos);
        setPosy(getElementTop(), pos);
        break;
    case 'centercenter':
        setPosx(getElementHCenter(), pos);
        setPosy(getElementVCenter(), pos);
        break;
    case 'centerright':
        setPosx(getElementRight(), pos);
        setPosy(getElementVCenter(), pos);
        break;
    case 'centerleft':
        setPosx(getElementLeft(), pos);
        setPosy(getElementVCenter(), pos);
        break;
    case 'bottomcenter':
        setPosx(getElementHCenter(), pos);
        setPosy(getElementBottom(), pos);
        break;
    case 'bottomright':
        setPosx(getElementRight(), pos);
        setPosy(getElementBottom(), pos);
        break;
    case 'bottomleft':
        setPosx(getElementLeft(), pos);
        setPosy(getElementBottom(), pos);
        break;
    default:
    case 'topleft':
        setPosx(getElementLeft(), pos);
        setPosy(getElementTop(), pos);
        break;
    }
    return pos;

}
/**
 * @private
 */
function getBodyScrollTop(): number {
    return parentDocument.documentElement.scrollTop || parentDocument.body.scrollTop;
}
/**
 * @private
 */
function getBodyScrollLeft(): number {
    return parentDocument.documentElement.scrollLeft || parentDocument.body.scrollLeft;
}
/**
 * @private
 */
function getElementBottom(): number {
    return fixedParent ? elementRect.bottom : elementRect.bottom + getBodyScrollTop();
}
/**
 * @private
 */
function getElementVCenter(): number {
    return getElementTop() + (elementRect.height / 2);
}
/**
 * @private
 */
function getElementTop(): number {
    return fixedParent ? elementRect.top : elementRect.top + getBodyScrollTop();
}
/**
 * @private
 */
function getElementLeft(): number {
    return elementRect.left + getBodyScrollLeft();
}
/**
 * @private
 */
function getElementRight(): number {
    return elementRect.right + getBodyScrollLeft() - (popupRect ? popupRect.width : 0);
}
/**
 * @private
 */
function getElementHCenter(): number {
    return getElementLeft() + (elementRect.width / 2);
}

/**
 * Provides information about a OffsetPosition.
 *
 * @private
 */
export interface OffsetPosition {
    left: number;
    top: number;
}
