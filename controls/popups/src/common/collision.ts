
/**
 * Collision module.
 */
import { calculatePosition, OffsetPosition } from './position';
import { isNullOrUndefined } from '@syncfusion/ej2-base';

    interface TopCorners {
        topSide: boolean;
        bottomSide: boolean;
    }
    interface LeftCorners {
        leftSide: boolean;
        rightSide: boolean;
    }

    interface RectData {
        width: number;
        height: number;
    }
    interface ElementsData {
        elementData: RectData;
    }
    interface EdgeOffset {
        TL: OffsetPosition;
        TR: OffsetPosition;
        BL: OffsetPosition;
        BR: OffsetPosition;
    }
    interface PositionLocation {
        posX: string;
        posY: string;
        offsetX: number;
        offsetY: number;
        position: OffsetPosition;
    }
    let parentDocument: Document;
    let targetContainer: HTMLElement;

    /**
     * Provides information about a CollisionCoordinates.
     */
    export interface CollisionCoordinates {
        X: boolean;
        Y: boolean;
    }
    export function fit(
        element: HTMLElement,
        viewPortElement: HTMLElement = null,
        axis: CollisionCoordinates = {X: false, Y: false},
        position?: OffsetPosition): OffsetPosition {
        if (!axis.Y && !axis.X) {
            return {left: 0, top: 0};
        }
        let elemData: ClientRect = element.getBoundingClientRect();
        targetContainer = viewPortElement;
        parentDocument = element.ownerDocument;
        if (!position) {
            position = calculatePosition(element, 'left', 'top');
        }
        if (axis.X) {
            let containerWidth: number = targetContainer ? getTargetContainerWidth() : getViewPortWidth();
            let containerLeft: number = ContainerLeft();
            let containerRight: number = ContainerRight();
            let overLeft: number = containerLeft - position.left;
            let overRight: number = position.left + elemData.width - containerRight;
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
            let containerHeight: number = targetContainer ? getTargetContainerHeight() : getViewPortHeight();
            let containerTop: number = ContainerTop();
            let containerBottom: number = ContainerBottom();
            let overTop: number = containerTop - position.top;
            let overBottom: number = position.top + elemData.height - containerBottom;
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
    export function isCollide(element: HTMLElement, viewPortElement: HTMLElement = null, x?: number, y?: number): string[] {
        let elemOffset: OffsetPosition = calculatePosition(element, 'left', 'top');
        if (x) {
            elemOffset.left = x;
        }
        if (y) {
            elemOffset.top = y;
        }
        let data: string[] = [];
        targetContainer = viewPortElement;
        parentDocument = element.ownerDocument;
        let elementRect: ClientRect = element.getBoundingClientRect();
        let top: number = elemOffset.top;
        let left: number = elemOffset.left;
        let right: number = elemOffset.left + elementRect.width;
        let bottom: number = elemOffset.top + elementRect.height;
        let topData: string = '';
        let leftData: string = '';
        let yAxis: TopCorners = topCollideCheck(top, bottom);
        let xAxis: LeftCorners = leftCollideCheck(left, right);
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
    export function flip(
        element: HTMLElement,
        target: HTMLElement,
        offsetX: number,
        offsetY: number,
        positionX: string,
        positionY: string,
        viewPortElement: HTMLElement = null,
        axis: CollisionCoordinates = {X: true, Y: true},
        fixedParent?: Boolean): void {
            if (!target || !element || !positionX || !positionY || (!axis.X && !axis.Y)) {
                return;
            }
            let tEdge: EdgeOffset = { TL: null,
            TR: null,
            BL: null,
            BR: null };
            let eEdge: EdgeOffset = {
                TL: null,
                TR: null,
                BL: null,
                BR: null
            };
            let elementRect: ClientRect = element.getBoundingClientRect();
            let pos: PositionLocation = {
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
    function setPopup(element: HTMLElement, pos: PositionLocation, elementRect: ClientRect): void {
        let left: number = 0;
        let top: number = 0;
        if (element.offsetParent != null
            && (getComputedStyle(element.offsetParent).position === 'absolute' ||
            getComputedStyle(element.offsetParent).position === 'relative' )) {
            let data: OffsetPosition = calculatePosition(element.offsetParent, 'left', 'top', false, elementRect);
            left = data.left;
            top = data.top;
        }
        element.style.top = (pos.position.top + pos.offsetY  - (top)) + 'px';
        element.style.left = (pos.position.left + pos.offsetX - (left)) + 'px';
    }
    function updateElementData(
        target: HTMLElement,
        edge: EdgeOffset,
        pos: PositionLocation,
        fixedParent: Boolean,
        elementRect: ClientRect): void {
            pos.position = calculatePosition(target, pos.posX, pos.posY, fixedParent, elementRect);
            edge.TL = calculatePosition(target, 'left', 'top', fixedParent, elementRect);
            edge.TR = calculatePosition(target, 'right', 'top', fixedParent, elementRect);
            edge.BR = calculatePosition(target, 'left', 'bottom', fixedParent, elementRect);
            edge.BL = calculatePosition(target, 'right', 'bottom', fixedParent, elementRect);
    }
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
    function leftCollideCheck(left: number, right: number): LeftCorners {
        let leftSide: boolean = false;
        let rightSide: boolean = false;
        if (((left - getBodyScrollLeft()) < ContainerLeft())) {
            leftSide = true;
        }
        if (right > ContainerRight()) {
            rightSide = true;
        }
        return {leftSide: leftSide, rightSide: rightSide};
    }
    function leftFlip(
        target: HTMLElement,
        edge: EdgeOffset,
        tEdge: EdgeOffset,
        pos: PositionLocation,
        elementRect: ClientRect,
        deepCheck: boolean): void {
        let collideSide: LeftCorners = leftCollideCheck(edge.TL.left, edge.TR.left);
        if ((tEdge.TL.left - getBodyScrollLeft()) <= ContainerLeft()) {
            collideSide.leftSide = false;
        }
        if (tEdge.TR.left >= ContainerRight()) {
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
    function topFlip(
        target: HTMLElement,
        edge: EdgeOffset,
        tEdge: EdgeOffset,
        pos: PositionLocation,
        elementRect: ClientRect,
        deepCheck: boolean): void {
        let collideSide: TopCorners = topCollideCheck(edge.TL.top, edge.BL.top);
        if ((tEdge.TL.top - getBodyScrollTop()) <= ContainerTop()) {
            collideSide.topSide = false;
        }
        if (tEdge.BL.top >= ContainerBottom()) {
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
    function topCollideCheck(top: number, bottom: number): TopCorners {
        let topSide: boolean = false;
        let bottomSide: boolean = false;
        if ((top - getBodyScrollTop()) < ContainerTop()) {
            topSide = true;
        }
        if (bottom > ContainerBottom()) {
            bottomSide = true;
        }
        return { topSide: topSide, bottomSide: bottomSide };
    }
    function getTargetContainerWidth(): number {
        return targetContainer.getBoundingClientRect().width;
    }
    function getTargetContainerHeight(): number {
        return targetContainer.getBoundingClientRect().height;
    }
    function getTargetContainerLeft(): number {
        return targetContainer.getBoundingClientRect().left;
    }
    function getTargetContainerTop(): number {
        return targetContainer.getBoundingClientRect().top;
    }
    function ContainerTop(): number {
        if (targetContainer) {
            return getTargetContainerTop();
        }
        return 0;
    }
    function ContainerLeft(): number {
        if (targetContainer) {
            return getTargetContainerLeft();
        }
        return 0;
    }
    function ContainerRight(): number {
        if (targetContainer) {
            return (getBodyScrollLeft() + getTargetContainerLeft() + getTargetContainerWidth());
        }
        return (getBodyScrollLeft() + getViewPortWidth());
    }
    function ContainerBottom(): number {
        if (targetContainer) {
            return (getBodyScrollTop() + getTargetContainerTop() + getTargetContainerHeight());
        }
        return (getBodyScrollTop() + getViewPortHeight());
    }
    function getBodyScrollTop(): number {
        // if(targetContainer)
        //     return targetContainer.scrollTop;
        return parentDocument.documentElement.scrollTop || parentDocument.body.scrollTop;
    }
    function getBodyScrollLeft(): number {
        // if(targetContainer)
        //     return targetContainer.scrollLeft;
        return parentDocument.documentElement.scrollLeft || parentDocument.body.scrollLeft;
    }

    function getViewPortHeight(): number {
        return  window.innerHeight;
    }

    function getViewPortWidth(): number {
        let windowWidth : number = window.innerWidth;
        let offsetWidth: number = (isNullOrUndefined(document.documentElement)) ? 0 : document.documentElement.offsetWidth;
        return windowWidth - (windowWidth - offsetWidth);
    }