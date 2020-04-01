/**
 * Position library
 */
import { isNullOrUndefined } from '@syncfusion/ej2-base';
let elementRect: ClientRect;
let popupRect: ClientRect;
let element: Element;
let parentDocument: Document;
let fixedParent: Boolean = false;

export function calculateRelativeBasedPosition(
    anchor: HTMLElement,
    element: HTMLElement): OffsetPosition {
    let fixedElement: Boolean = false;
    let anchorPos: OffsetPosition = { left: 0, top: 0 };
    let tempAnchor: HTMLElement = anchor;
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

export function calculatePosition(
    currentElement: Element, positionX?: string, positionY?: string, parentElement?: Boolean,
    targetValues?: ClientRect): OffsetPosition {
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
    let pos: OffsetPosition = { left: 0, top: 0 };
    return updatePosition(positionX.toLowerCase(), positionY.toLowerCase(), pos);
}
function setPosx(value: number, pos: OffsetPosition): void {
    pos.left = value;
}
function setPosy(value: number, pos: OffsetPosition): void {
    pos.top = value;
}

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
function getBodyScrollTop(): number {
    return parentDocument.documentElement.scrollTop || parentDocument.body.scrollTop;
}
function getBodyScrollLeft(): number {
    return parentDocument.documentElement.scrollLeft || parentDocument.body.scrollLeft;
}
function getElementBottom(): number {
    return fixedParent ? elementRect.bottom : elementRect.bottom + getBodyScrollTop();
}
function getElementVCenter(): number {
    return getElementTop() + (elementRect.height / 2);
}
function getElementTop(): number {
    return fixedParent ? elementRect.top : elementRect.top + getBodyScrollTop();
}
function getElementLeft(): number {
    return elementRect.left + getBodyScrollLeft();
}
function getElementRight(): number {
    return elementRect.right + getBodyScrollLeft() - (popupRect ? popupRect.width : 0);
}
function getElementHCenter(): number {
    return getElementLeft() + (elementRect.width / 2);
}

/**
 * Provides information about a OffsetPosition.
 */
export interface OffsetPosition {
    left: number;
    top: number;
}