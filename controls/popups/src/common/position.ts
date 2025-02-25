/**
 * Position library
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
let elementRect: ClientRect;
let popupRect: ClientRect;
let element: Element;
let parentDocument: Document;
let fixedParent: boolean = false;
/**
 *
 * @param {HTMLElement} anchor - specifies the element
 * @param {HTMLElement} element - specifies the element
 * @returns {OffsetPosition} - returns the value
 */
export function calculateRelativeBasedPosition(
    anchor: HTMLElement,
    element: HTMLElement): OffsetPosition {
    let fixedElement: boolean = false;
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
 *
 * @param {Element} currentElement - specifies the element
 * @param {string} positionX - specifies the position
 * @param {string} positionY - specifies the position
 * @param {boolean} parentElement - specifies the boolean
 * @param {ClientRect} targetValues - specifies the client
 * @returns {OffsetPosition} - returns the position
 */
export function calculatePosition(
    currentElement: Element, positionX?: string, positionY?: string, parentElement?: boolean,
    targetValues?: ClientRect): OffsetPosition {
    popupRect = undefined;
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
 *
 * @param {number} value - specifies the number
 * @param {OffsetPosition} pos - specifies the position
 * @returns {void}
 */
function setPosx(value: number, pos: OffsetPosition): void {
    pos.left = value;
}
/**
 *
 * @param {number} value - specifies the number
 * @param {OffsetPosition} pos - specifies the position
 * @returns {void}
 */
function setPosy(value: number, pos: OffsetPosition): void {
    pos.top = value;
}
/**
 *
 * @param {string} posX - specifies the position
 * @param {string} posY - specifies the position
 * @param {OffsetPosition} pos - specifies the position
 * @returns {OffsetPosition} - returns the postion
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
    element = null;
    return pos;

}
/**
 * @returns {number} - specifies the number value
 */
function getBodyScrollTop(): number {
    return parentDocument.documentElement.scrollTop || parentDocument.body.scrollTop;
}
/**
 * @returns {number} - specifies the number value
 */
function getBodyScrollLeft(): number {
    return parentDocument.documentElement.scrollLeft || parentDocument.body.scrollLeft;
}
/**
 * @returns {number} - specifies the number value
 */
function getElementBottom(): number {
    return fixedParent ? elementRect.bottom : elementRect.bottom + getBodyScrollTop();
}
/**
 * @returns {number} - specifies the number value
 */
function getElementVCenter(): number {
    return getElementTop() + (elementRect.height / 2);
}
/**
 * @returns {number} - specifies the number value
 */
function getElementTop(): number {
    return fixedParent ? elementRect.top : elementRect.top + getBodyScrollTop();
}
/**
 * @returns {number} - specifies the number value
 */
function getElementLeft(): number {
    return elementRect.left + getBodyScrollLeft();
}
/**
 * @returns {number} - specifies the number value
 */
function getElementRight(): number {
    let popupWidth: number = (element && (((element.classList.contains('e-date-wrapper') || element.classList.contains('e-datetime-wrapper')) && element.classList.contains('e-rtl')) || (element.classList.contains('e-ddl') && element.classList.contains('e-rtl')) || element.classList.contains('e-date-range-wrapper'))) ? (popupRect ? popupRect.width : 0) :
        (popupRect && (elementRect.width >= popupRect.width) ? popupRect.width : 0);
    if (element && element.classList.contains('e-rtl') && element.classList.contains('e-multiselect')) {
        popupWidth = popupRect.width;
    }
    return elementRect.right + getBodyScrollLeft() - popupWidth;
}
/**
 * @returns {number} - specifies the number value
 */
function getElementHCenter(): number {
    return getElementLeft() + (elementRect.width / 2);
}

/**
 * Provides information about a OffsetPosition.
 */
export interface OffsetPosition {
    left: number
    top: number
}
