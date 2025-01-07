/**
 * Collision module.
 */
import { calculatePosition, OffsetPosition } from './position';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

interface TopCorners {
    topSide: boolean
    bottomSide: boolean
}
interface LeftCorners {
    leftSide: boolean
    rightSide: boolean
}

interface RectData {
    width: number
    height: number
}
//eslint-disable-next-line
interface ElementsData {
    elementData: RectData
}
interface EdgeOffset {
    TL: OffsetPosition
    TR: OffsetPosition
    BL: OffsetPosition
    BR: OffsetPosition
}
interface PositionLocation {
    posX: string
    posY: string
    offsetX: number
    offsetY: number
    position: OffsetPosition
}
let parentDocument: Document;
let targetContainer: HTMLElement;

/**
 * Provides information about a CollisionCoordinates.
 */
export interface CollisionCoordinates {
    X: boolean
    Y: boolean
}
/**
 *
 * @param {HTMLElement} element - specifies the element
 * @param {HTMLElement} viewPortElement - specifies the element
 * @param {CollisionCoordinates} axis - specifies the collision coordinates
 * @param {OffsetPosition} position - specifies the position
 * @returns {void}
 */
export function fit(
    element: HTMLElement,
    viewPortElement: HTMLElement = null,
    axis: CollisionCoordinates = {X: false, Y: false},
    position?: OffsetPosition): OffsetPosition {
    if (!axis.Y && !axis.X) {
        return {left: 0, top: 0};
    }
    const elemData: ClientRect = element.getBoundingClientRect();
    targetContainer = viewPortElement;
    parentDocument = element.ownerDocument;
    if (!position) {
        position = calculatePosition(element, 'left', 'top');
    }
    if (axis.X) {
        const containerWidth: number = targetContainer ? getTargetContainerWidth() : getViewPortWidth();
        const containerLeft: number = ContainerLeft();
        const containerRight: number = ContainerRight();
        const overLeft: number = containerLeft - position.left;
        const overRight: number = position.left + elemData.width - containerRight;
        if (elemData.width > containerWidth) {
            if (overLeft > 0 && overRight <= 0) {
                position.left = containerRight - elemData.width;
            } else if (overRight > 0 && overLeft <= 0) {
                position.left = containerLeft;
            } else {
                position.left = overLeft > overRight ? (containerRight - elemData.width) : containerLeft;
            }
        } else if (overLeft > 0) {
            position.left += overLeft;
        } else if (overRight > 0) {
            position.left -= overRight;
        }
    }
    if (axis.Y) {
        const containerHeight: number = targetContainer ? getTargetContainerHeight() : getViewPortHeight();
        const containerTop: number = ContainerTop();
        const containerBottom: number = ContainerBottom();
        const overTop: number = containerTop - position.top;
        const overBottom: number = position.top + elemData.height - containerBottom;
        if (elemData.height > containerHeight) {
            if (overTop > 0 && overBottom <= 0) {
                position.top = containerBottom - elemData.height;
            } else if (overBottom > 0 && overTop <= 0) {
                position.top = containerTop;
            } else {
                position.top = overTop > overBottom ? (containerBottom - elemData.height) : containerTop;
            }
        } else if (overTop > 0) {
            position.top += overTop;
        } else if (overBottom > 0) {
            position.top -= overBottom;
        }
    }
    return position;
}
/**
 *
 * @param {HTMLElement} element - specifies the html element
 * @param {HTMLElement} viewPortElement - specifies the html element
 * @param {number} x - specifies the number
 * @param {number} y - specifies the number
 * @returns {string[]} - returns the string value
 */
export function isCollide(element: HTMLElement, viewPortElement: HTMLElement = null, x?: number, y?: number): string[] {
    const elemOffset: OffsetPosition = calculatePosition(element, 'left', 'top');
    if (x) {
        elemOffset.left = x;
    }
    if (y) {
        elemOffset.top = y;
    }
    const data: string[] = [];
    targetContainer = viewPortElement;
    parentDocument = element.ownerDocument;
    const elementRect: ClientRect = element.getBoundingClientRect();
    const top: number = elemOffset.top;
    const left: number = elemOffset.left;
    const right: number = elemOffset.left + elementRect.width;
    const bottom: number = elemOffset.top + elementRect.height;
    const yAxis: TopCorners = topCollideCheck(top, bottom);
    const xAxis: LeftCorners = leftCollideCheck(left, right);
    if (yAxis.topSide) {
        data.push('top');
    }
    if (xAxis.rightSide) {
        data.push('right');
    }
    if (xAxis.leftSide) {
        data.push('left');
    }
    if (yAxis.bottomSide) {
        data.push('bottom');
    }
    return data;
}
/**
 *
 * @param {HTMLElement} element - specifies the element
 * @param {HTMLElement} target - specifies the element
 * @param {number} offsetX - specifies the number
 * @param {number} offsetY - specifies the number
 * @param {string} positionX - specifies the string value
 * @param {string} positionY - specifies the string value
 * @param {HTMLElement} viewPortElement - specifies the element
 * @param {CollisionCoordinates} axis - specifies the collision axis
 * @param {boolean} fixedParent - specifies the boolean
 * @returns {void}
 */
export function flip(
    element: HTMLElement,
    target: HTMLElement,
    offsetX: number,
    offsetY: number,
    positionX: string,
    positionY: string,
    viewPortElement: HTMLElement = null,
    /* eslint-disable */
    axis: CollisionCoordinates = {X: true, Y: true},
    fixedParent?: boolean): void {
    if (!target || !element || !positionX || !positionY || (!axis.X && !axis.Y)) {
        return;
    }
    const tEdge: EdgeOffset = { TL: null,
            TR: null,
            BL: null,
            BR: null
        }, eEdge: EdgeOffset = {
            TL: null,
            TR: null,
            BL: null,
            BR: null
            /* eslint-enable */
        };
    let elementRect: ClientRect;
    if (window.getComputedStyle(element).display === 'none') {
        const oldVisibility: string = element.style.visibility;
        element.style.visibility = 'hidden';
        element.style.display = 'block';
        elementRect = element.getBoundingClientRect();
        element.style.removeProperty('display');
        element.style.visibility = oldVisibility;
    } else {
        elementRect = element.getBoundingClientRect();
    }
    const pos: PositionLocation = {
        posX: positionX, posY: positionY, offsetX: offsetX, offsetY: offsetY, position: {left: 0, top: 0}};
    targetContainer = viewPortElement;
    parentDocument = target.ownerDocument;
    updateElementData(target, tEdge, pos, fixedParent, elementRect);
    setPosition(eEdge, pos, elementRect);
    if (axis.X) {
        leftFlip(target, eEdge, tEdge, pos, elementRect, true);
    }
    if (axis.Y && tEdge.TL.top > -1) {
        topFlip(target, eEdge, tEdge, pos, elementRect, true);
    }
    setPopup(element, pos, elementRect);
}
/**
 *
 * @param {HTMLElement} element - specifies the element
 * @param {PositionLocation} pos - specifies the location
 * @param {ClientRect} elementRect - specifies the client rect
 * @returns {void}
 */
function setPopup(element: HTMLElement, pos: PositionLocation, elementRect: ClientRect): void {
    let left: number = 0; let top: number = 0;
    if (element.offsetParent != null
            && (getComputedStyle(element.offsetParent).position === 'absolute' ||
            getComputedStyle(element.offsetParent).position === 'relative' )) {
        const data: OffsetPosition = calculatePosition(element.offsetParent, 'left', 'top', false, elementRect);
        left = data.left;
        top = data.top;
    }
    let scaleX: number = 1;
    let scaleY: number = 1;
    const tranformElement: HTMLElement = getTransformElement(element);
    if (tranformElement) {
        const transformStyle: string = getComputedStyle(tranformElement).transform;
        if (transformStyle !== 'none') {
            const matrix: DOMMatrix = new DOMMatrix(transformStyle);
            scaleX = matrix.a;
            scaleY = matrix.d;
        }
        const zoomStyle: string = getComputedStyle(tranformElement).zoom;
        if (zoomStyle !== 'none') {
            const bodyZoom: number = getZoomValue(document.body);
            scaleX = bodyZoom * scaleX;
            scaleY = bodyZoom * scaleY;
        }
    }
    element.style.top = ((pos.position.top / scaleY) + pos.offsetY - (top / scaleY)) + 'px';
    element.style.left = ((pos.position.left / scaleX) + pos.offsetX - (left / scaleX)) + 'px';
}

export function getZoomValue(element: HTMLElement): number {
    const zoomValue: string = getComputedStyle(element).zoom;
    return parseFloat(zoomValue) || 1; // Default zoom value is 1 (no zoom)
}
/**
 *
 * @param {HTMLElement} element - specifies the element
 * @returns {HTMLElement} The modified element.
 */
export function getTransformElement(element: HTMLElement): HTMLElement {
    while (element) {
        const transform: string = window.getComputedStyle(element).transform;
        const zoom: number = getZoomValue(document.body);
        if ((transform && transform !== 'none') || (zoom && zoom !== 1)) {
            return element;
        }
        if (element === document.body) {
            return null;
        }
        element = (element.offsetParent || element.parentElement) as HTMLElement;
    }
    return null;
}
/**
 *
 * @param {HTMLElement} target - specifies the element
 * @param {EdgeOffset} edge - specifies the offset
 * @param {PositionLocation} pos - specifies theloaction
 * @param {boolean} fixedParent - specifies the boolean
 * @param {ClientRect} elementRect - specifies the client rect
 * @returns {void}
 */
function updateElementData(
    target: HTMLElement,
    edge: EdgeOffset,
    pos: PositionLocation,
    fixedParent: boolean,
    elementRect: ClientRect): void {
    pos.position = calculatePosition(target, pos.posX, pos.posY, fixedParent, elementRect);
    edge.TL = calculatePosition(target, 'left', 'top', fixedParent, elementRect);
    edge.TR = calculatePosition(target, 'right', 'top', fixedParent, elementRect);
    edge.BR = calculatePosition(target, 'left', 'bottom', fixedParent, elementRect);
    edge.BL = calculatePosition(target, 'right', 'bottom', fixedParent, elementRect);
}
/**
 *
 * @param {EdgeOffset} eStatus - specifies the status
 * @param {PositionLocation} pos - specifies the location
 * @param {ClientRect} elementRect - specifies the client
 * @returns {void}
 */
function setPosition(
    eStatus: EdgeOffset,
    pos: PositionLocation,
    elementRect: ClientRect): void {
    eStatus.TL = { top: pos.position.top + pos.offsetY, left: pos.position.left + pos.offsetX };
    eStatus.TR = { top: eStatus.TL.top, left: eStatus.TL.left + elementRect.width };
    eStatus.BL = { top: eStatus.TL.top + elementRect.height,
        left: eStatus.TL.left };
    eStatus.BR = { top: eStatus.TL.top + elementRect.height
        , left: eStatus.TL.left + elementRect.width };
}
/**
 *
 * @param {number} left - specifies the  number
 * @param {number} right - specifies the number
 * @returns {LeftCorners} - returns the value
 */
function leftCollideCheck(left: number, right: number): LeftCorners {
//eslint-disable-next-line
    let leftSide: boolean = false, rightSide: boolean = false;
    if (((left - getBodyScrollLeft()) < ContainerLeft())) {
        leftSide = true;
    }
    if (right > ContainerRight()) {
        rightSide = true;
    }
    return {leftSide: leftSide, rightSide: rightSide};
}
/**
 *
 * @param {HTMLElement} target - specifies the element
 * @param {EdgeOffset} edge - specifes the element
 * @param {EdgeOffset} tEdge - specifies the edge offset
 * @param {PositionLocation} pos - specifes the location
 * @param {ClientRect} elementRect - specifies the client
 * @param {boolean} deepCheck - specifies the boolean value
 * @returns {void}
 */
function leftFlip(
    target: HTMLElement,
    edge: EdgeOffset,
    tEdge: EdgeOffset,
    pos: PositionLocation,
    elementRect: ClientRect,
    deepCheck: boolean): void {
    const collideSide: LeftCorners = leftCollideCheck(edge.TL.left, edge.TR.left);
    if ((tEdge.TL.left - getBodyScrollLeft()) <= ContainerLeft()) {
        collideSide.leftSide = false;
    }
    if (tEdge.TR.left > ContainerRight()) {
        collideSide.rightSide = false;
    }
    if ((collideSide.leftSide && !collideSide.rightSide) || (!collideSide.leftSide && collideSide.rightSide)) {
        if (pos.posX === 'right') {
            pos.posX = 'left';
        } else {
            pos.posX = 'right';
        }
        pos.offsetX = pos.offsetX + elementRect.width;
        pos.offsetX = -1 * pos.offsetX;
        pos.position = calculatePosition(target, pos.posX, pos.posY, false);
        setPosition(edge, pos, elementRect);
        if (deepCheck) {
            leftFlip(target, edge, tEdge, pos, elementRect, false);
        }
    }
}
/**
 *
 * @param {HTMLElement} target - specifies the element
 * @param {EdgeOffset} edge - specifies the offset
 * @param {EdgeOffset} tEdge - specifies the offset
 * @param {PositionLocation} pos - specifies the location
 * @param {ClientRect} elementRect - specifies the client rect
 * @param {boolean} deepCheck - specifies the boolean
 * @returns {void}
 */
function topFlip(
    target: HTMLElement,
    edge: EdgeOffset,
    tEdge: EdgeOffset,
    pos: PositionLocation,
    elementRect: ClientRect,
    deepCheck: boolean): void {
    const collideSide: TopCorners = topCollideCheck(edge.TL.top, edge.BL.top);
    if ((tEdge.TL.top - getBodyScrollTop()) <= ContainerTop()) {
        collideSide.topSide = false;
    }
    if (tEdge.BL.top >= ContainerBottom() && target.getBoundingClientRect().bottom < window.innerHeight) {
        collideSide.bottomSide = false;
    }
    if ((collideSide.topSide && !collideSide.bottomSide) || (!collideSide.topSide && collideSide.bottomSide)) {
        if (pos.posY === 'top') {
            pos.posY = 'bottom';
        } else {
            pos.posY = 'top';
        }
        pos.offsetY = pos.offsetY + elementRect.height;
        pos.offsetY = -1 * pos.offsetY;
        pos.position = calculatePosition(target, pos.posX, pos.posY, false, elementRect);
        setPosition(edge, pos, elementRect);
        if (deepCheck) {
            topFlip(target, edge, tEdge, pos, elementRect, false);
        }
    }
}
/**
 *
 * @param {number} top - specifies the number
 * @param {number} bottom - specifies the number
 * @returns {TopCorners} - retyrns the value
 */
function topCollideCheck(top: number, bottom: number): TopCorners {
//eslint-disable-next-line
    let topSide: boolean = false, bottomSide: boolean = false;
    if ((top - getBodyScrollTop()) < ContainerTop()) {
        topSide = true;
    }
    if (bottom > ContainerBottom()) {
        bottomSide = true;
    }
    return { topSide: topSide, bottomSide: bottomSide };
}
/**
 * @returns {void}
 */
function getTargetContainerWidth(): number {
    return targetContainer.getBoundingClientRect().width;
}
/**
 * @returns {void}
 */
function getTargetContainerHeight(): number {
    return targetContainer.getBoundingClientRect().height;
}
/**
 * @returns {void}
 */
function getTargetContainerLeft(): number {
    return targetContainer.getBoundingClientRect().left;
}
/**
 * @returns {void}
 */
function getTargetContainerTop(): number {
    return targetContainer.getBoundingClientRect().top;
}
//eslint-disable-next-line
function ContainerTop(): number {
    if (targetContainer) {
        return getTargetContainerTop();
    }
    return 0;
}
//eslint-disable-next-line
function ContainerLeft(): number {
    if (targetContainer) {
        return getTargetContainerLeft();
    }
    return 0;
}
//eslint-disable-next-line
function ContainerRight(): number {
    if (targetContainer) {
        return (getBodyScrollLeft() + getTargetContainerLeft() + getTargetContainerWidth());
    }
    return (getBodyScrollLeft() + getViewPortWidth());
}
//eslint-disable-next-line
function ContainerBottom(): number {
    if (targetContainer) {
        return (getBodyScrollTop() + getTargetContainerTop() + getTargetContainerHeight());
    }
    return (getBodyScrollTop() + getViewPortHeight());
}
/**
 * @returns {number} - returns the scroll top value
 */
function getBodyScrollTop(): number {
    // if(targetContainer)
    //     return targetContainer.scrollTop;
    return parentDocument.documentElement.scrollTop || parentDocument.body.scrollTop;
}
/**
 * @returns {number} - returns the scroll left value
 */
function getBodyScrollLeft(): number {
    // if(targetContainer)
    //     return targetContainer.scrollLeft;
    return parentDocument.documentElement.scrollLeft || parentDocument.body.scrollLeft;
}

/**
 * @returns {number} - returns the viewport height
 */
function getViewPortHeight(): number {
    return  window.innerHeight;
}

/**
 * @returns {number} - returns the viewport width
 */
function getViewPortWidth(): number {
    const windowWidth : number = window.innerWidth;
    const documentReact: ClientRect = document.documentElement.getBoundingClientRect();
    const offsetWidth: number = (isNullOrUndefined(document.documentElement)) ? 0 : documentReact.width;
    return windowWidth - (windowWidth - offsetWidth);
}
/**
 * @returns {void}
 */
export function destroy(): void {
    targetContainer = null;
    parentDocument = null;
}
