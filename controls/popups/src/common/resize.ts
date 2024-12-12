/**
 * Resize library
 */
import { isNullOrUndefined as isNOU, createElement, EventHandler, detach, Browser } from '@syncfusion/ej2-base';
const elementClass: string [] = ['north-west', 'north', 'north-east', 'west', 'east', 'south-west', 'south', 'south-east'];
const RESIZE_HANDLER: string =  'e-resize-handle';
const FOCUSED_HANDLER: string = 'e-focused-handle';
const DIALOG_RESIZABLE: string = 'e-dlg-resizable';
const RESTRICT_LEFT: string [] = ['e-restrict-left'];
const RESIZE_WITHIN_VIEWPORT: string = 'e-resize-viewport';
const dialogBorderResize: string [] = ['north', 'west', 'east', 'south'];
let targetElement: HTMLElement;
let selectedHandler: HTMLElement;
let originalWidth: number = 0;
let originalHeight: number = 0;
let originalX: number = 0;
let originalY: number = 0;
let originalMouseX: number = 0;
let originalMouseY: number = 0;
let minHeight: number;
let maxHeight: number;
let minWidth: number;
let maxWidth: number;
let containerElement: HTMLElement;
let resizeStart: Function = null;
let resize: Function = null;
let resizeEnd: Function = null;
let resizeWestWidth: number;
let setLeft: boolean = true;
let previousWidth: number = 0;
let setWidth: boolean = true;
// eslint-disable-next-line
let proxy: any;
/* eslint-enable */
/**
 * Provides information about a Resize event.
 */
export interface ResizeArgs {
    element: HTMLElement | string
    direction: string
    minHeight: number
    minWidth: number
    maxHeight?: number
    maxWidth?: number
    boundary?: HTMLElement | string
    resizeBegin(e: MouseEvent): void
    resizing(e: MouseEvent): void
    resizeComplete(e: MouseEvent): void
    // eslint-disable-next-line
    proxy: any;
}
/**
 *
 * @param {ResizeArgs} args - specifies the resize args
 * @returns {void}
 */
export function createResize(args: ResizeArgs): void {
    resizeStart = args.resizeBegin;
    resize = args.resizing;
    resizeEnd = args.resizeComplete;
    targetElement = getDOMElement(args.element);
    containerElement = getDOMElement(args.boundary);
    const directions: string[] = args.direction.split(' ');
    for (let i: number = 0; i < directions.length; i++) {
        if (dialogBorderResize.indexOf(directions[i as number]) >= 0 && directions[i as number]) {
            setBorderResizeElm(directions[i as number]);
        } else if (directions[i as number].trim() !== '') {
            const resizeHandler: HTMLElement = createElement(
                'div', { className: 'e-icons ' + RESIZE_HANDLER + ' ' + 'e-' + directions[i as number] }
            );
            targetElement.appendChild(resizeHandler);
        }
    }
    minHeight = args.minHeight;
    minWidth = args.minWidth;
    maxWidth = args.maxWidth;
    maxHeight = args.maxHeight;
    if (args.proxy && args.proxy.element && args.proxy.element.classList.contains('e-dialog')) {
        wireEvents(args.proxy);
    } else {
        wireEvents();
    }
}
/**
 *
 * @param {string} direction - specifies the string
 * @returns {void}
 */
function setBorderResizeElm(direction: string): void {
    calculateValues();
    const borderBottom: HTMLElement = createElement('span', {
        attrs: {
            'unselectable': 'on', 'contenteditable': 'false'
        }
    });
    borderBottom.setAttribute('class', 'e-dialog-border-resize e-' + direction);
    if (direction === 'south') {
        borderBottom.style.height = '2px';
        borderBottom.style.width = '100%';
        borderBottom.style.bottom = '0px';
        borderBottom.style.left = '0px';
    }
    if (direction === 'north') {
        borderBottom.style.height = '2px';
        borderBottom.style.width = '100%';
        borderBottom.style.top = '0px';
        borderBottom.style.left = '0px';
    }
    if (direction === 'east') {
        borderBottom.style.height = '100%';
        borderBottom.style.width = '2px';
        borderBottom.style.right = '0px';
        borderBottom.style.top = '0px';
    }
    if (direction === 'west') {
        borderBottom.style.height = '100%';
        borderBottom.style.width = '2px';
        borderBottom.style.left = '0px';
        borderBottom.style.top = '0px';
    }
    targetElement.appendChild(borderBottom);
}

/**
 *
 * @param {string} element - specifies the element
 * @returns {HTMLElement} - returns the element
 */
function getDOMElement(element: string | HTMLElement): HTMLElement {
    let domElement: HTMLElement;
    if (!isNOU(element)) {
        if (typeof(element) === 'string') {
            domElement =  document.querySelector(element);
        } else {
            domElement = element;
        }
    }
    return domElement;
}
/**
 * Wires up the event handlers for the resizable elements.
 *
 * @param {any} [args] - Optional arguments that provide context for the event handlers.
 * @returns {void}
 */
function wireEvents(args?: any): void  {
    const context: any = args || this;
    const resizers: NodeListOf<Element> = targetElement.querySelectorAll('.' + RESIZE_HANDLER);
    for (let i: number = 0; i < resizers.length; i++) {
        selectedHandler = resizers[i as number] as HTMLElement;
        EventHandler.add(selectedHandler, 'mousedown', onMouseDown, context);
        const eventName: string = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
        EventHandler.add(selectedHandler, eventName, onTouchStart, context);
    }
    const borderResizers: NodeListOf<Element> = targetElement.querySelectorAll('.e-dialog-border-resize');
    if (!isNOU(borderResizers)) {
        for (let i: number = 0; i < borderResizers.length; i++) {
            selectedHandler = borderResizers[i as number] as HTMLElement;
            EventHandler.add(selectedHandler, 'mousedown', onMouseDown, context);
            const eventName: string = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
            EventHandler.add(selectedHandler, eventName, onTouchStart, context);
        }
    }
}

/* istanbul ignore next */
/**
 *
 * @param {string} e - specifies the string
 * @returns {string} - returns the string
 */
function getEventType(e: string): string {
    return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
}

/* istanbul ignore next */
/**
 *
 * @param {MouseEvent} e - specifies the mouse event
 * @returns {void}
 */
function onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    targetElement = (e.target as HTMLElement).parentElement;
    calculateValues();
    originalMouseX = e.pageX;
    originalMouseY = e.pageY;
    (e.target as HTMLElement).classList.add(FOCUSED_HANDLER);
    if (!isNOU(resizeStart)) {
        const proxy: any = null || this;
        if (resizeStart(e, proxy) === true) {
            return;
        }
    }
    if (this.targetEle && targetElement && targetElement.querySelector('.' + DIALOG_RESIZABLE)) {
        containerElement = this.target === ('body' || 'document.body' || document.body) ? null : this.targetEle;
        maxWidth = this.targetEle.clientWidth;
        maxHeight = this.targetEle.clientHeight;
    }
    const target: Document | HTMLElement = (isNOU(containerElement)) ? document : containerElement;
    EventHandler.add(target, 'mousemove', onMouseMove, this);
    EventHandler.add(document, 'mouseup', onMouseUp, this);
    for (let i: number = 0; i < RESTRICT_LEFT.length; i++) {
        if (targetElement.classList.contains(RESTRICT_LEFT[i as number])) {
            setLeft = false;
        } else {
            setLeft = true;
        }
    }
}
/* istanbul ignore next */
/**
 *
 * @param {MouseEvent} e - specifies the event
 * @returns {void}
 */
function onMouseUp(e: MouseEvent): void {
    const touchMoveEvent: string = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
    const touchEndEvent: string = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
    const target: Document | HTMLElement = (isNOU(containerElement)) ? document : containerElement;
    const eventName: string = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
    EventHandler.remove(target, 'mousemove', onMouseMove);
    EventHandler.remove(target, touchMoveEvent , onMouseMove);
    EventHandler.remove(target, eventName, onMouseMove);
    if (!isNOU(document.body.querySelector('.' + FOCUSED_HANDLER))) {
        document.body.querySelector('.' + FOCUSED_HANDLER).classList.remove(FOCUSED_HANDLER);
    }
    if (!isNOU(resizeEnd)) {
        const proxy: any = null || this;
        resizeEnd(e, proxy);
    }
    EventHandler.remove(document, 'mouseup', onMouseUp);
    EventHandler.remove(document, touchEndEvent, onMouseUp);
}

/* istanbul ignore next */
/**
 * @returns {void}
 */
function calculateValues(): void {
    originalWidth = parseFloat(getComputedStyle(targetElement, null).getPropertyValue('width').replace('px', ''));
    originalHeight = parseFloat(getComputedStyle(targetElement, null).getPropertyValue('height').replace('px', ''));
    originalX = targetElement.getBoundingClientRect().left;
    originalY = targetElement.getBoundingClientRect().top;
}
/* istanbul ignore next */
/**
 *
 * @param {MouseEvent} e - specifies the event
 * @returns {void}
 */
function onTouchStart(e: TouchEvent | MouseEvent): void {
    targetElement = (e.target as HTMLElement).parentElement;
    calculateValues();
    const dialogResizeElement: boolean = targetElement.classList.contains( 'e-dialog' );
    if ( ( ( e.target as HTMLElement ).classList.contains( RESIZE_HANDLER ) || ( e.target as HTMLElement ).classList.contains( 'e-dialog-border-resize' ) ) && dialogResizeElement ) {
        ( e.target as HTMLElement ).classList.add( FOCUSED_HANDLER );
    }
    const coordinates: Touch | MouseEvent = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e as MouseEvent;
    originalMouseX = coordinates.pageX;
    originalMouseY = coordinates.pageY;
    if (!isNOU(resizeStart)) {
        const proxy: any = null || this;
        if (resizeStart(e, proxy) === true) {
            return;
        }
    }
    const touchMoveEvent: string = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
    const touchEndEvent: string = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
    const target: Document | HTMLElement = (isNOU(containerElement)) ? document : containerElement;
    EventHandler.add(target, touchMoveEvent, onMouseMove, this);
    EventHandler.add(document, touchEndEvent, onMouseUp, this);
}

/* istanbul ignore next */
/**
 *
 * @param {MouseEvent} e - specifies the event
 * @returns {void}
 */
function onMouseMove(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains(RESIZE_HANDLER) && (e.target as HTMLElement).classList.contains(FOCUSED_HANDLER)) {
        selectedHandler =   e.target as HTMLElement;
    } else if (!isNOU(document.body.querySelector('.' + FOCUSED_HANDLER))) {
        selectedHandler = document.body.querySelector('.' + FOCUSED_HANDLER);
    }
    if (!isNOU(selectedHandler)) {
        let resizeTowards: string = '';
        for (let i: number = 0; i < elementClass.length; i++) {
            if (selectedHandler.classList.contains('e-' + elementClass[i as number])) {
                resizeTowards = elementClass[i as number];
            }
        }
        if (!isNOU(resize)) {
            const proxy: any = null || this;
            resize(e, proxy);
        }
        switch (resizeTowards) {
        case 'south':
            resizeSouth(e);
            break;
        case 'north':
            resizeNorth(e);
            break;
        case 'west':
            resizeWest(e);
            break;
        case 'east':
            resizeEast(e);
            break;
        case 'south-east':
            resizeSouth(e);
            resizeEast(e);
            break;
        case 'south-west':
            resizeSouth(e);
            resizeWest(e);
            break;
        case 'north-east':
            resizeNorth(e);
            resizeEast(e);
            break;
        case 'north-west':
            resizeNorth(e);
            resizeWest(e);
            break;
        default: break;
        }
    }
}

/* istanbul ignore next */
/**
 *
 * @param {HTMLElement} element - specifies the eleemnt
 * @returns {ClientRect} - returns the client
 */
function getClientRectValues (element: HTMLElement): ClientRect | DOMRect {
    return element.getBoundingClientRect();
}

/**
 * @param {MouseEvent | TouchEvent} e - specifies the event
 * @returns {void}
 */
function resizeSouth(e: MouseEvent | TouchEvent): void {
    const documentHeight: number = document.documentElement.clientHeight;
    let calculateValue: boolean = false;
    const coordinates: Touch | MouseEvent = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e as MouseEvent;
    const currentpageY: number = coordinates.pageY;
    const targetRectValues: ClientRect = getClientRectValues(targetElement);
    let containerRectValues: ClientRect;
    if (!isNOU(containerElement)) {
        containerRectValues = getClientRectValues(containerElement);
    }
    if (!isNOU(containerElement)) {
        calculateValue = true;
    } else if (isNOU(containerElement) && ((documentHeight - currentpageY) >= 0 || (targetRectValues.top < 0))) {
        calculateValue = true;
    }
    let calculatedHeight: number = originalHeight + (currentpageY - originalMouseY);
    calculatedHeight = (calculatedHeight > minHeight) ? calculatedHeight : minHeight;
    let containerTop: number = 0;
    if (!isNOU(containerElement)) {
        containerTop =  containerRectValues.top;
    }
    const borderValue: number = isNOU(containerElement) ? 0 : containerElement.offsetHeight - containerElement.clientHeight;
    let topWithoutborder: number = (targetRectValues.top - containerTop) - (borderValue / 2);
    topWithoutborder = (topWithoutborder < 0) ? 0 : topWithoutborder;
    if ( targetRectValues.top > 0 && (topWithoutborder + calculatedHeight) > maxHeight) {
        calculateValue = false;
        if (targetElement.classList.contains(RESIZE_WITHIN_VIEWPORT)) {
            return;
        }
        targetElement.style.height = (maxHeight - parseInt(topWithoutborder.toString(), 10)) + 'px';
        return;
    }
    let targetTop: number = 0;
    if (calculateValue) {
        if (targetRectValues.top < 0 && (documentHeight + (targetRectValues.height + targetRectValues.top) > 0)) {
            targetTop = targetRectValues.top;
            if ((calculatedHeight + targetTop) <= 30 ) {
                calculatedHeight = (targetRectValues.height - (targetRectValues.height + targetRectValues.top)) + 30;
            }
        }
        if (((calculatedHeight + targetRectValues.top) >= maxHeight)) {
            targetElement.style.height = targetRectValues.height +
            (documentHeight - (targetRectValues.height + targetRectValues.top)) + 'px';
        }
        const calculatedTop: number = (isNOU(containerElement)) ? targetTop : topWithoutborder;
        if (calculatedHeight >= minHeight && ((calculatedHeight + calculatedTop) <= maxHeight)) {
            targetElement.style.height = calculatedHeight + 'px';
        }
    }
}

/**
 * Resizes the element towards the north direction.
 *
 * @param {MouseEvent | TouchEvent} e - The event object.
 * @returns {void}
 */
function resizeNorth(e: MouseEvent | TouchEvent): void {
    let calculateValue: boolean = false;
    let boundaryRectValues: ClientRect;
    const pageY: number = (getEventType(e.type) === 'mouse') ? (e as MouseEvent).pageY : (e as TouchEvent).touches[0].pageY;
    const targetRectValues: ClientRect = getClientRectValues(targetElement);
    const borderValue: number = isNOU(containerElement) ? 0 : containerElement.offsetHeight - containerElement.clientHeight;
    if (!isNOU(containerElement)) {
        boundaryRectValues = getClientRectValues(containerElement);
    }
    if (!isNOU(containerElement) && (targetRectValues.top - boundaryRectValues.top) > 0 ) {
        calculateValue = true;
    } else if (isNOU(containerElement) && pageY > 0) {
        calculateValue = true;
    } else if (!isNOU(containerElement) &&
    (Math.floor((targetRectValues.top - boundaryRectValues.top) + targetRectValues.height +
    (boundaryRectValues.bottom - targetRectValues.bottom)) - borderValue) <= maxHeight) {
        calculateValue = true;
    }
    const currentHeight: number = originalHeight - (pageY - originalMouseY);
    if (calculateValue) {
        if (currentHeight >= minHeight && currentHeight <= maxHeight) {
            let containerTop: number = 0;
            if (!isNOU(containerElement)) {
                containerTop = boundaryRectValues.top;
            }
            let top: number = (originalY - containerTop) + (pageY - originalMouseY);
            top = top > 0 ? top : 1;
            targetElement.style.height = currentHeight  + 'px';
            targetElement.style.top = top + 'px';
        }
    }
}

/**
 * Resizes the element towards the west direction.
 *
 * @param {MouseEvent | TouchEvent} e - The event object.
 * @returns {void}
 */
function resizeWest(e: MouseEvent | TouchEvent): void {
    const documentWidth: number = document.documentElement.clientWidth;
    let calculateValue: boolean = false;
    let rectValues: ClientRect;
    if (!isNOU(containerElement)) {
        rectValues = getClientRectValues(containerElement);
    }
    const pageX: number = (getEventType(e.type) === 'mouse') ? (e as MouseEvent).pageX : (e as TouchEvent).touches[0].pageX;
    const targetRectValues: ClientRect = getClientRectValues(targetElement);
    const borderValue: number = isNOU(containerElement) ? 0 : containerElement.offsetWidth - containerElement.clientWidth;
    /* eslint-disable */
    let left: number = isNOU(containerElement) ? 0 : rectValues.left;
    let containerWidth: number = isNOU(containerElement) ? 0 : rectValues.width;
    /* eslint-enable */
    if (isNOU(resizeWestWidth)) {
        if (!isNOU(containerElement)) {
            resizeWestWidth = (((targetRectValues.left - left) - borderValue / 2)) + targetRectValues.width ;
            resizeWestWidth = resizeWestWidth + (containerWidth - borderValue - resizeWestWidth);
        } else {
            resizeWestWidth = documentWidth;
        }
    }
    if (!isNOU(containerElement) &&
    (Math.floor((targetRectValues.left - rectValues.left) + targetRectValues.width +
    (rectValues.right - targetRectValues.right)) - borderValue) <= maxWidth) {
        calculateValue = true;
    } else if (isNOU(containerElement) && pageX >= 0) {
        calculateValue = true;
    }
    let calculatedWidth: number = originalWidth - (pageX - originalMouseX);
    if (setLeft) {
        calculatedWidth = (calculatedWidth > resizeWestWidth) ? resizeWestWidth : calculatedWidth;
    }
    if (calculateValue) {
        if (calculatedWidth >= minWidth && calculatedWidth <= maxWidth) {
            let containerLeft: number = 0;
            if (!isNOU(containerElement)) {
                containerLeft = rectValues.left;
            }
            let left: number = (originalX - containerLeft) + (pageX - originalMouseX);
            left = (left > 0) ? left : 1;
            if (calculatedWidth !== previousWidth && setWidth) {
                targetElement.style.width = calculatedWidth + 'px';
            }
            if (setLeft) {
                targetElement.style.left = left + 'px';
                if (left === 1) {
                    setWidth = false;
                } else {
                    setWidth = true;
                }
            }
        }
    }
    previousWidth = calculatedWidth;
}

/**
 * Resizes the element towards the east direction.
 *
 * @param {MouseEvent | TouchEvent} e - The event object.
 * @returns {void}
 */
function resizeEast(e: MouseEvent | TouchEvent): void {
    const documentWidth: number = document.documentElement.clientWidth;
    let calculateValue: boolean = false;
    let containerRectValues: ClientRect;
    if (!isNOU(containerElement)) {
        containerRectValues = getClientRectValues(containerElement);
    }
    const coordinates: Touch | MouseEvent = (e as TouchEvent).touches ? (e as TouchEvent).changedTouches[0] : e as MouseEvent;
    const pageX: number = coordinates.pageX;
    const targetRectValues: ClientRect | DOMRect =  getClientRectValues(targetElement);
    if (!isNOU(containerElement) && (((targetRectValues.left - containerRectValues.left) + targetRectValues.width) <= maxWidth
    || (targetRectValues.right - containerRectValues.left) >= targetRectValues.width)) {
        calculateValue = true;
    } else if (isNOU(containerElement) && (documentWidth - pageX) > 0) {
        calculateValue = true;
    }
    const calculatedWidth: number = originalWidth + (pageX - originalMouseX);
    let containerLeft: number = 0;
    if (!isNOU(containerElement)) {
        containerLeft = containerRectValues.left;
    }
    if (((targetRectValues.left - containerLeft) + calculatedWidth) > maxWidth) {
        calculateValue = false;
        if (targetElement.classList.contains(RESIZE_WITHIN_VIEWPORT)) {
            return;
        }
        targetElement.style.width = maxWidth - (targetRectValues.left - containerLeft) + 'px';
    }
    if (calculateValue) {
        if (calculatedWidth >= minWidth && calculatedWidth <= maxWidth) {
            targetElement.style.width = calculatedWidth + 'px';
        }
    }
}

/* istanbul ignore next */
/**
 *
 * @param {number} minimumHeight - specifies the number
 * @returns {void}
 */
export function setMinHeight(minimumHeight: number): void {
    minHeight = minimumHeight;
}

/**
 *
 * @param {number} value - specifies the number value
 * @returns {void}
 */
export function setMaxWidth(value: number): void {
    maxWidth = value;
}
/**
 *
 * @param {number} value - specifies the number value
 * @returns {void}
 */
export function setMaxHeight(value: number): void {
    maxHeight = value;
}
/**
 * @returns {void}
 */
export function removeResize(): void {
    const handlers: NodeListOf<HTMLElement> = targetElement.querySelectorAll('.' + RESIZE_HANDLER);
    for (let i: number = 0; i < handlers.length; i++ ) {
        detach(handlers[i as number]);
    }
    const borderResizers: NodeListOf<HTMLElement> = targetElement.querySelectorAll('.e-dialog-border-resize');
    if (!isNOU(borderResizers)) {
        for (let i: number = 0; i < borderResizers.length; i++ ) {
            detach(borderResizers[i as number]);
        }
    }
}
/**
 * @returns {void}
 */
export function resizeDestroy(): void {
    targetElement = null;
    selectedHandler = null;
    containerElement = null;
    resizeWestWidth = null;
    resizeStart = null;
    resize = null;
    resizeEnd = null;
}
