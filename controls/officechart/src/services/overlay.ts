import { EventHandler, Browser, removeClass, closest, isNullOrUndefined, formatUnit } from '@syncfusion/ej2-base';
import { IOverlayHost, IOverlayCompleteEventArgs } from '../integrations/overlay-host';

interface IChartManagerActionAdapter {
    onOverlayAction?: (action: string, id: string, bounds: { width?: number; height?: number; top?: number; left?: number }) => void;
}

/**
 * Returns pointerdown or mousedown event string.
 *
 * @returns {string} The start event string.
 */
function getStartEvent(): string {
    return (Browser.isPointer ? 'pointerdown' : 'mousedown touchstart');
}

/**
 * Returns pointermove or mousemove event string.
 *
 * @returns {string} The move event string.
 */
function getMoveEvent(): string {
    return (Browser.isPointer ? 'pointermove' : 'mousemove touchmove');
}

/**
 * Returns pointerup or mouseup event string.
 *
 * @returns {string} The end event string.
 */
function getEndEvent(): string {
    return (Browser.isPointer ? 'pointerup' : 'mouseup touchend');
}

/**
 * Checks if the event is a touch move event.
 *
 * @param {Event} e - The event to check.
 * @returns {boolean} True if touch move, false otherwise.
 */
function isTouchMove(e: Event): boolean {
    return e.type === 'touchmove' || (e.type === 'pointermove' && (e as PointerEvent).pointerType === 'touch');
}

/**
 * Gets the client X coordinate from mouse or touch event.
 *
 * @param {MouseEvent | TouchEvent} e - Specifies the mouse or touch event.
 * @returns {number} - Returns the client X position in pixels.
 * @hidden
 */
function getClientX(e: TouchEvent & MouseEvent): number {
    return (!isNullOrUndefined(e.changedTouches) && e.changedTouches.length > 0) ? e.changedTouches[0].clientX : e.clientX;
}

/**
 * Gets the client Y coordinate from mouse or touch event.
 *
 * @param {MouseEvent | TouchEvent} e - Specifies the mouse or touch event.
 * @returns {number} - Returns the client Y position in pixels.
 * @hidden
 */
function getClientY(e: MouseEvent & TouchEvent): number {
    return (!isNullOrUndefined(e.changedTouches) && e.changedTouches.length > 0) ? e.changedTouches[0].clientY : e.clientY;
}

/**
 * Service to manage overlay creation, selection, resize handles, dragging, and resizing across Office components.
 */
export class OverlayService {
    private handleMode: 4 | 8 = 4;
    private host: IOverlayHost;
    private minHeight: string = '300px';
    private minWidth: string = '400px';
    public isOverlayClicked: boolean = false;
    public isResizerClicked: boolean = false;
    private originalMouseX: number;
    private originalMouseY: number;
    private originalWidth: number;
    private originalHeight: number;
    private currentWidth: number = 400;
    private currenHeight: number = 300;
    private originalResizeLeft: number;
    private originalResizeTop: number;
    private originalReorderLeft: number;
    private originalReorderTop: number;
    private resizedReorderLeft: number;
    private resizedReorderTop: number;
    private resizer: string;
    private diffX: number;
    private diffY: number;
    private prevX: number;
    private prevY: number;
    private isMouseUpBound: boolean = false;
    private boundClick: (e: TouchEvent & MouseEvent) => void;
    private boundMove: (e: MouseEvent & TouchEvent) => void;
    private boundUp: (e: MouseEvent & TouchEvent) => void;

    private chartManager: Object;
    private chartRibbon: Object;

    constructor(host?: IOverlayHost, chartManager?: Object, chartRibbon?: Object) {
        this.boundClick = this.overlayClickHandler.bind(this);
        this.boundMove = this.overlayMouseMoveHandler.bind(this);
        this.boundUp = this.overlayMouseUpHandler.bind(this);
        if (host) {
            this.host = host;
        }
        if (chartManager) {
            this.chartManager = chartManager;
        }
        if (chartRibbon) {
            this.chartRibbon = chartRibbon;
        }
    }

    public setAdapters(chartManager: Object, chartRibbon?: Object): void {
        this.chartManager = chartManager;
        this.chartRibbon = chartRibbon || null;
    }

    public setHost(host: IOverlayHost): void {
        if (this.host && this.host !== host) {
            this.removeEventListener();
        }
        this.host = host;
    }

    public getHost(): IOverlayHost {
        return this.host;
    }

    public setHandleMode(mode: 4 | 8): void {
        this.handleMode = mode;
    }

    public getHandleMode(): 4 | 8 {
        return this.handleMode;
    }

    /**
     * Creates or initializes the overlay element container.
     *
     * @param {string} id - Unique ID for overlay element.
     * @param {boolean} [active=true] - Whether the overlay should be initialized as active.
     * @param {HTMLElement} [target] - Target container to append to.
     * @param {object} [dimensions] - Optional dimensions.
     * @param {string | number} [dimensions.width] - Optional width.
     * @param {string | number} [dimensions.height] - Optional height.
     * @param {string | number} [dimensions.top] - Optional top coordinate.
     * @param {string | number} [dimensions.left] - Optional left coordinate.
     * @returns {HTMLElement} The created overlay container element.
     */
    public createOverlayElement(
        id: string, active: boolean = true, target?: HTMLElement,
        dimensions?: { width?: string | number, height?: string | number, top?: string | number, left?: string | number }
    ): HTMLElement {
        const div: HTMLElement = (this.host && this.host.createElement)
            ? this.host.createElement('div', { id: id, className: 'e-ss-overlay e-office-overlay' })
            : document.createElement('div');
        div.id = id;
        div.className = 'e-ss-overlay e-office-overlay';
        div.style.width = dimensions && !isNullOrUndefined(dimensions.width) ? formatUnit(dimensions.width) : this.minWidth;
        div.style.height = dimensions && !isNullOrUndefined(dimensions.height) ? formatUnit(dimensions.height) : this.minHeight;
        div.style.top = dimensions && !isNullOrUndefined(dimensions.top) ? formatUnit(dimensions.top) : '0px';
        div.style.left = dimensions && !isNullOrUndefined(dimensions.left) ? formatUnit(dimensions.left) : '0px';
        div.style.position = 'absolute';
        div.style.boxSizing = 'border-box';
        div.style.border = '1px dashed #1a73e8';
        div.style.backgroundColor = 'transparent';
        div.style.userSelect = 'none';
        div.style.touchAction = 'none';
        div.style.cursor = 'move';
        if (active) {
            const root: HTMLElement = target || (this.host ? this.host.getRootElement() : document.body);
            const actOverlayElems: HTMLElement[] = Array.from(root.getElementsByClassName('e-ss-overlay-active') as HTMLCollectionOf<HTMLElement>);
            for (let i: number = 0; i < actOverlayElems.length; i++) {
                removeClass([actOverlayElems[i as number]], 'e-ss-overlay-active');
                actOverlayElems[i as number].style.border = '1px dashed #1a73e8';
            }
            div.classList.add('e-ss-overlay-active');
            div.style.border = '1.5px solid #1a73e8';
        }
        if (target) {
            target.appendChild(div);
        }
        return div;
    }

    /**
     * Alias method to create an overlay element.
     *
     * @param {string} id - Unique ID for overlay element.
     * @param {boolean} [active=true] - Whether the overlay should be initialized as active.
     * @param {HTMLElement} [target] - Target container to append to.
     * @param {object} [dimensions] - Optional dimensions.
     * @param {string | number} [dimensions.width] - Optional width.
     * @param {string | number} [dimensions.height] - Optional height.
     * @param {string | number} [dimensions.top] - Optional top coordinate.
     * @param {string | number} [dimensions.left] - Optional left coordinate.
     * @returns {HTMLElement} The created overlay container element.
     */
    public createOverlay(
        id: string, active: boolean = true, target?: HTMLElement,
        dimensions?: { width?: string | number, height?: string | number, top?: string | number, left?: string | number }
    ): HTMLElement {
        return this.createOverlayElement(id, active, target, dimensions);
    }

    /**
     * Inserts an overlay element and attaches handlers matching Office component requirements.
     *
     * @param {string} id - Element ID.
     * @param {number} top - Top coordinate in pixels.
     * @param {number} left - Left coordinate in pixels.
     * @param {HTMLElement} [parentElement] - Parent container to append to.
     * @param {string} [width] - Optional width override.
     * @param {string} [height] - Optional height override.
     * @param {4 | 8} [handleMode] - Optional handle configuration (4 or 8 handles).
     * @returns {object} Object containing the element, top, and left coordinates.
     */
    public insertOverlayElement(
        id: string, top: number, left: number, parentElement?: HTMLElement, width?: string, height?: string, handleMode?: 4 | 8
    ): { element: HTMLElement, top: number, left: number } {
        const mode: 4 | 8 = handleMode || this.handleMode;
        const target: HTMLElement = parentElement || (this.host ? this.host.getParentElement() : document.body);
        const div: HTMLElement = this.createOverlayElement(id, true, target, {
            top: top,
            left: left,
            width: width || this.minWidth,
            height: height || this.minHeight
        });
        this.renderResizeHandler(div, mode);
        this.addEventListener(div);
        this.originalWidth = parseFloat(div.style.width) || 400;
        this.originalHeight = parseFloat(div.style.height) || 300;
        return { element: div, top: top, left: left };
    }

    /**
     * Renders either 4 standard handles or 8 handles.
     *
     * @param {HTMLElement} overlay - Overlay element to append handles to.
     * @param {4 | 8} [handleMode] - Number of resize handles (4 or 8).
     * @returns {void}
     */
    public renderResizeHandler(overlay: HTMLElement, handleMode?: 4 | 8): void {
        const existing: NodeListOf<Element> = overlay.querySelectorAll('.e-office-resizer, .e-ss-resizer');
        for (let i: number = 0; i < existing.length; i++) {
            existing[i as number].remove();
        }
        const mode: 4 | 8 = handleMode || this.handleMode;
        const handles: string[] = mode === 8
            ? ['e-ss-overlay-t', 'e-ss-overlay-r', 'e-ss-overlay-b', 'e-ss-overlay-l',
                'e-ss-overlay-tl', 'e-ss-overlay-tr', 'e-ss-overlay-br', 'e-ss-overlay-bl']
            : ['e-ss-overlay-t', 'e-ss-overlay-r', 'e-ss-overlay-b', 'e-ss-overlay-l'];
        let idx: number = 0;
        let handleElem: HTMLElement;
        while (idx < handles.length) {
            const handle: string = handles[idx as number];
            handleElem = (this.host && this.host.createElement)
                ? this.host.createElement('div')
                : document.createElement('div');
            handleElem.className = handle + ' e-ss-resizer e-office-resizer' + (Browser.isDevice ? ' e-ss-resizer-touch' : '');
            handleElem.style.position = 'absolute';
            handleElem.style.boxSizing = 'border-box';
            handleElem.style.width = '8px';
            handleElem.style.height = '8px';
            handleElem.style.backgroundColor = '#ffffff';
            handleElem.style.border = '1.5px solid #1a73e8';
            handleElem.style.borderRadius = '4px';
            handleElem.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
            handleElem.style.zIndex = '10';
            if (handle === 'e-ss-overlay-t') {
                handleElem.style.top = '-4px';
                handleElem.style.left = '50%';
                handleElem.style.transform = 'translateX(-50%)';
                handleElem.style.cursor = 'ns-resize';
            } else if (handle === 'e-ss-overlay-b') {
                handleElem.style.bottom = '-4px';
                handleElem.style.left = '50%';
                handleElem.style.transform = 'translateX(-50%)';
                handleElem.style.cursor = 'ns-resize';
            } else if (handle === 'e-ss-overlay-l') {
                handleElem.style.left = '-4px';
                handleElem.style.top = '50%';
                handleElem.style.transform = 'translateY(-50%)';
                handleElem.style.cursor = 'ew-resize';
            } else if (handle === 'e-ss-overlay-r') {
                handleElem.style.right = '-4px';
                handleElem.style.top = '50%';
                handleElem.style.transform = 'translateY(-50%)';
                handleElem.style.cursor = 'ew-resize';
            } else if (handle === 'e-ss-overlay-tl') {
                handleElem.style.top = '-4px';
                handleElem.style.left = '-4px';
                handleElem.style.cursor = 'nwse-resize';
            } else if (handle === 'e-ss-overlay-tr') {
                handleElem.style.top = '-4px';
                handleElem.style.right = '-4px';
                handleElem.style.cursor = 'nesw-resize';
            } else if (handle === 'e-ss-overlay-br') {
                handleElem.style.bottom = '-4px';
                handleElem.style.right = '-4px';
                handleElem.style.cursor = 'nwse-resize';
            } else if (handle === 'e-ss-overlay-bl') {
                handleElem.style.bottom = '-4px';
                handleElem.style.left = '-4px';
                handleElem.style.cursor = 'nesw-resize';
            }
            overlay.appendChild(handleElem);
            idx++;
        }
    }

    /**
     * Attaches event listeners to an overlay element.
     *
     * @param {HTMLElement} div - Overlay element to attach events to.
     * @returns {void}
     */
    public addEventListener(div: HTMLElement): void {
        const overlayElem: Element = div;
        EventHandler.add(overlayElem, getStartEvent(), this.boundClick);
        if (this.host && this.host.getRootElement()) {
            const root: HTMLElement = this.host.getRootElement();
            EventHandler.add(root, getMoveEvent(), this.boundMove);
        }
        if (!this.isMouseUpBound) {
            EventHandler.add(document, getEndEvent(), this.boundUp);
            this.isMouseUpBound = true;
        }
    }

    public setOriginalSize(args: { height: number, width: number }): void {
        this.originalHeight = args.height;
        this.originalWidth = args.width;
    }

    public getOriginalDimensions(): { height: number, width: number } {
        return { height: this.originalHeight, width: this.originalWidth };
    }

    public overlayClickHandler(e: TouchEvent & MouseEvent): void {
        if (e.button && e.button !== 0) {
            return;
        }
        if (this.host) {
            if (this.host.isProtected && this.host.isProtected()) {
                return;
            }
            if (this.host.isAllowEditing && !this.host.isAllowEditing()) {
                return;
            }
        }
        this.isResizerClicked = false;
        this.resizer = undefined;
        this.isOverlayClicked = true;
        const target: HTMLElement = e.target as HTMLElement;
        if (!target) {
            this.isOverlayClicked = false;
            return;
        }
        let overlayElem: HTMLElement = target;
        if (!target.classList || (!target.classList.contains('e-ss-overlay') && !target.classList.contains('e-office-overlay'))) {
            const matched: HTMLElement = (closest(e.target as Element, '.e-datavisualization-chart') ||
                closest(e.target as Element, '.e-ss-overlay') || closest(e.target as Element, '.e-office-overlay')) as HTMLElement;
            overlayElem = !isNullOrUndefined(matched) ? matched : target.parentElement;
        }
        if (!overlayElem) {
            return;
        }
        if (this.host && this.host.onFreezePaneClick) {
            this.host.onFreezePaneClick(overlayElem);
        }
        this.originalWidth = this.currentWidth = parseFloat(overlayElem.style.width);
        this.originalHeight = this.currenHeight = parseFloat(overlayElem.style.height);
        this.originalReorderLeft = parseFloat(overlayElem.style.left);
        this.originalReorderTop = parseFloat(overlayElem.style.top);
        this.resizedReorderLeft = parseFloat(overlayElem.style.left);
        this.resizedReorderTop = parseFloat(overlayElem.style.top);
        this.originalResizeTop = this.originalReorderTop;
        this.originalResizeLeft = this.originalReorderLeft;
        this.originalMouseX = getClientX(e);
        this.originalMouseY = getClientY(e);
        this.diffX = this.originalMouseX - this.originalReorderLeft;
        this.diffY = this.originalMouseY - this.originalReorderTop;
        const root: HTMLElement = this.host ? this.host.getRootElement() : document.body;
        const actOverlayElems: HTMLElement[] = Array.from(root.getElementsByClassName('e-ss-overlay-active') as HTMLCollectionOf<HTMLElement>);
        let prevActiveId: string;
        if (actOverlayElems.length > 0) {
            prevActiveId = actOverlayElems[0].id;
        }
        for (let i: number = 0; i < actOverlayElems.length; i++) {
            removeClass([actOverlayElems[i as number]], 'e-ss-overlay-active');
            actOverlayElems[i as number].style.border = '1px dashed #1a73e8';
        }
        const activeTarget: HTMLElement = document.getElementById(overlayElem.id) || overlayElem;
        if (activeTarget && activeTarget.classList) {
            activeTarget.classList.add('e-ss-overlay-active');
            activeTarget.style.border = '1.5px solid #1a73e8';
        }
        if (target.classList.contains('e-ss-resizer') || target.classList.contains('e-office-resizer')) {
            this.resizer = target.classList[0];
            this.isResizerClicked = true;
        }
        const isChart: boolean = overlayElem.classList.contains('e-datavisualization-chart');
        if (isChart) {
            const chartId: string = overlayElem.id.replace(/_overlay$/, '');
            if (this.chartManager) {
                const managerAny: { setActiveChart?: (id: string) => void } = this.chartManager as {
                    setActiveChart?: (id: string) => void;
                };
                if (managerAny.setActiveChart) {
                    managerAny.setActiveChart(chartId);
                }
            }
        }
        if (this.host && this.host.onOverlaySelect) {
            this.host.onOverlaySelect(overlayElem.id, isChart, this.isResizerClicked, prevActiveId);
        }
        const clientRect: ClientRect = overlayElem.getBoundingClientRect();
        this.prevX = clientRect.left;
        this.prevY = clientRect.top;
    }

    public overlayMouseMoveHandler(e: MouseEvent & TouchEvent): void {
        const target: HTMLElement = e.target as HTMLElement;
        const root: HTMLElement = this.host ? this.host.getRootElement() : document.body;
        const overlayElem: HTMLElement = root.getElementsByClassName('e-ss-overlay-active')[0] as HTMLElement;
        if (!overlayElem) {
            return;
        }
        const checkOffset: number[] = (this.host && this.host.getCheckOffset) ? this.host.getCheckOffset() : [-1, -1];
        let height1: number;
        let top: number;
        let width1: number;
        let height2: number;
        let width2: number;
        let left: number;
        if (this.isOverlayClicked && this.isResizerClicked) {
            if (isTouchMove(e)) {
                e.preventDefault();
            }
            switch (this.resizer) {
            case 'e-ss-overlay-t':
                height1 = Math.max(this.originalMouseY - getClientY(e) + this.originalHeight, 20);
                top = getClientY(e) - (this.originalMouseY - this.originalResizeTop);
                if (height1 > 20 && top > checkOffset[0]) {
                    overlayElem.style.height = height1 + 'px';
                    overlayElem.style.top = top + 'px';
                    this.resizedReorderTop = top;
                    this.currenHeight = height1;
                    this.triggerResizeProgress(overlayElem);
                }
                break;
            case 'e-ss-overlay-r':
                width1 = this.originalWidth + (getClientX(e) - this.originalMouseX);
                if (width1 > 20) {
                    overlayElem.style.width = width1 + 'px';
                    this.currentWidth = width1;
                    this.triggerResizeProgress(overlayElem);
                }
                break;
            case 'e-ss-overlay-b':
                height2 = this.originalHeight + (getClientY(e) - this.originalMouseY);
                if (height2 > 20) {
                    overlayElem.style.height = height2 + 'px';
                    this.currenHeight = height2;
                    this.triggerResizeProgress(overlayElem);
                }
                break;
            case 'e-ss-overlay-l':
                width2 = Math.max(this.originalMouseX - getClientX(e) + this.originalWidth, 20);
                left = getClientX(e) - (this.originalMouseX - this.originalResizeLeft);
                if (width2 > 20 && left > checkOffset[1]) {
                    overlayElem.style.width = width2 + 'px';
                    overlayElem.style.left = left + 'px';
                    this.resizedReorderLeft = left;
                    this.currentWidth = width2;
                    this.triggerResizeProgress(overlayElem);
                }
                break;
            case 'e-ss-overlay-tl':
                height1 = Math.max(this.originalMouseY - getClientY(e) + this.originalHeight, 20);
                top = getClientY(e) - (this.originalMouseY - this.originalResizeTop);
                width2 = Math.max(this.originalMouseX - getClientX(e) + this.originalWidth, 20);
                left = getClientX(e) - (this.originalMouseX - this.originalResizeLeft);
                if (height1 > 20 && top > checkOffset[0]) {
                    overlayElem.style.height = height1 + 'px';
                    overlayElem.style.top = top + 'px';
                    this.resizedReorderTop = top;
                    this.currenHeight = height1;
                }
                if (width2 > 20 && left > checkOffset[1]) {
                    overlayElem.style.width = width2 + 'px';
                    overlayElem.style.left = left + 'px';
                    this.resizedReorderLeft = left;
                    this.currentWidth = width2;
                }
                this.triggerResizeProgress(overlayElem);
                break;
            case 'e-ss-overlay-tr':
                height1 = Math.max(this.originalMouseY - getClientY(e) + this.originalHeight, 20);
                top = getClientY(e) - (this.originalMouseY - this.originalResizeTop);
                width1 = this.originalWidth + (getClientX(e) - this.originalMouseX);
                if (height1 > 20 && top > checkOffset[0]) {
                    overlayElem.style.height = height1 + 'px';
                    overlayElem.style.top = top + 'px';
                    this.resizedReorderTop = top;
                    this.currenHeight = height1;
                }
                if (width1 > 20) {
                    overlayElem.style.width = width1 + 'px';
                    this.currentWidth = width1;
                }
                this.triggerResizeProgress(overlayElem);
                break;
            case 'e-ss-overlay-br':
                height2 = this.originalHeight + (getClientY(e) - this.originalMouseY);
                width1 = this.originalWidth + (getClientX(e) - this.originalMouseX);
                if (height2 > 20) {
                    overlayElem.style.height = height2 + 'px';
                    this.currenHeight = height2;
                }
                if (width1 > 20) {
                    overlayElem.style.width = width1 + 'px';
                    this.currentWidth = width1;
                }
                this.triggerResizeProgress(overlayElem);
                break;
            case 'e-ss-overlay-bl':
                height2 = this.originalHeight + (getClientY(e) - this.originalMouseY);
                width2 = Math.max(this.originalMouseX - getClientX(e) + this.originalWidth, 20);
                left = getClientX(e) - (this.originalMouseX - this.originalResizeLeft);
                if (height2 > 20) {
                    overlayElem.style.height = height2 + 'px';
                    this.currenHeight = height2;
                }
                if (width2 > 20 && left > checkOffset[1]) {
                    overlayElem.style.width = width2 + 'px';
                    overlayElem.style.left = left + 'px';
                    this.resizedReorderLeft = left;
                    this.currentWidth = width2;
                }
                this.triggerResizeProgress(overlayElem);
                break;
            }
        } else if (this.isOverlayClicked) {
            if (isTouchMove(e)) {
                e.preventDefault();
            }
            const isInsideContainer: boolean = (this.host && this.host.isValidDragTarget)
                ? this.host.isValidDragTarget(target)
                : (root.contains(target) || (target.parentElement && (target.parentElement.classList.contains('e-ss-overlay') || target.parentElement.classList.contains('e-office-overlay'))));
            if (isInsideContainer) {
                const aX: number = getClientX(e) - this.diffX;
                const aY: number = getClientY(e) - this.diffY;
                const clampX: number = checkOffset[1] >= 0 ? checkOffset[1] : 0;
                const clampY: number = checkOffset[0] >= 0 ? checkOffset[0] : 0;
                if (aX > clampX) {
                    overlayElem.style.left = aX + 'px';
                    this.resizedReorderLeft = aX;
                } else {
                    this.resizedReorderLeft = clampX;
                }
                if (aY > clampY) {
                    overlayElem.style.top = aY + 'px';
                    this.resizedReorderTop = aY;
                } else {
                    this.resizedReorderTop = clampY;
                }
            } else {
                this.overlayMouseUpHandler(e, true);
            }
        }
    }

    private triggerResizeProgress(overlayElem: HTMLElement): void {
        if (this.chartManager) {
            const managerAny: IChartManagerActionAdapter =
                this.chartManager as IChartManagerActionAdapter;
            if (managerAny.onOverlayAction) {
                managerAny.onOverlayAction('resizeProgress', overlayElem.id, {
                    width: parseFloat(overlayElem.style.width),
                    height: parseFloat(overlayElem.style.height)
                });
            }
        }
        if (this.host && this.host.onOverlayResizeProgress) {
            this.host.onOverlayResizeProgress(overlayElem.id, overlayElem.style.width, overlayElem.style.height, overlayElem);
        }
    }

    public overlayMouseUpHandler(e: MouseEvent & TouchEvent, isMouseUp?: boolean): void {
        let elem: HTMLElement = (e.target as HTMLElement);
        if (!elem || !elem.classList) {
            elem = undefined;
        }
        const usedResizer: string = this.resizer;
        this.isResizerClicked = false;
        this.resizer = undefined;
        if (this.host) {
            if (this.host.isProtected && this.host.isProtected()) {
                return;
            }
            if (this.host.isAllowEditing && !this.host.isAllowEditing()) {
                return;
            }
        }
        const root: HTMLElement = this.host ? this.host.getRootElement() : document.body;
        const overlayElems: HTMLCollectionOf<Element> =
            root.getElementsByClassName('e-datavisualization-chart e-ss-overlay-active') as HTMLCollectionOf<Element>;
        if (elem && !elem.classList.contains('e-ss-overlay') && !elem.classList.contains('e-office-overlay')) {
            const matched: HTMLElement = (closest(e.target as Element, '.e-datavisualization-chart') ||
                closest(e.target as Element, '.e-ss-overlay') || closest(e.target as Element, '.e-office-overlay')) as HTMLElement;
            elem = !isNullOrUndefined(matched) ? matched : elem;
        }
        const overlayEle: HTMLElement = root.getElementsByClassName('e-ss-overlay-active')[0] as HTMLElement;
        const targetElement: HTMLElement = overlayEle || elem;
        const targetId: string = targetElement ? targetElement.id : '';
        const isFreezeAvailable: boolean = (this.host && this.host.getCheckOffset && this.host.getCheckOffset()[0] !== -1);
        const eventArgs: IOverlayCompleteEventArgs = {
            prevTop: isFreezeAvailable ? this.prevY : this.originalReorderTop,
            prevLeft: isFreezeAvailable ? this.prevX : this.originalReorderLeft,
            currentTop: this.resizedReorderTop >= 0 ? parseInt(this.resizedReorderTop.toString(), 10) : this.originalReorderTop,
            currentLeft: this.resizedReorderLeft >= 0 ? parseInt(this.resizedReorderLeft.toString(), 10) : this.originalReorderLeft,
            id: targetId,
            currentHeight: this.currenHeight,
            currentWidth: this.currentWidth,
            prevHeight: this.originalHeight,
            prevWidth: this.originalWidth,
            element: targetElement,
            resizerHandle: usedResizer,
            actionType: 'none',
            isChart: (overlayElems && overlayElems[0]) ? true :
                (targetElement && targetElement.classList.contains('e-datavisualization-chart'))
        };
        if (this.isOverlayClicked || isMouseUp) {
            if (overlayElems && overlayElems[0] && overlayElems[0].querySelector('.e-control')) {
                eventArgs.id = overlayElems[0].id;
            }
            const isResize: boolean = !isNullOrUndefined(usedResizer) &&
                (this.currenHeight !== this.originalHeight || this.originalWidth !== this.currentWidth);
            const isMove: boolean = (this.originalReorderTop !== this.resizedReorderTop ||
                this.originalReorderLeft !== this.resizedReorderLeft);
            if (isResize) {
                eventArgs.actionType = 'resize';
                eventArgs.requestType = (!isNullOrUndefined(overlayElems) &&
                    !isNullOrUndefined(overlayElems[0])) ? 'chartRefresh' : 'imageRefresh';
                if (this.chartManager) {
                    const managerAny: IChartManagerActionAdapter =
                        this.chartManager as IChartManagerActionAdapter;
                    if (managerAny.onOverlayAction) {
                        managerAny.onOverlayAction('resize', eventArgs.id, {
                            width: eventArgs.currentWidth,
                            height: eventArgs.currentHeight,
                            top: eventArgs.currentTop,
                            left: eventArgs.currentLeft
                        });
                    }
                }
                if (this.host && this.host.onOverlayComplete) {
                    this.host.onOverlayComplete(eventArgs);
                } else if (this.host && this.host.onOverlayResized) {
                    this.host.onOverlayResized(eventArgs);
                }
                this.originalHeight = this.currenHeight;
                this.originalWidth = this.currentWidth;
            } else if (isMove) {
                eventArgs.actionType = 'move';
                eventArgs.requestType = (!isNullOrUndefined(overlayElems) &&
                    !isNullOrUndefined(overlayElems[0])) ? 'chartRefresh' : 'imageRefresh';
                if (this.chartManager) {
                    const managerAny: IChartManagerActionAdapter =
                        this.chartManager as IChartManagerActionAdapter;
                    if (managerAny.onOverlayAction) {
                        managerAny.onOverlayAction('move', eventArgs.id, {
                            top: eventArgs.currentTop,
                            left: eventArgs.currentLeft
                        });
                    }
                }
                if (this.host && this.host.onOverlayComplete) {
                    this.host.onOverlayComplete(eventArgs);
                } else if (this.host && this.host.onOverlayMoved) {
                    this.host.onOverlayMoved(eventArgs);
                }
                this.resizedReorderTop = this.originalReorderTop;
                this.resizedReorderLeft = this.originalReorderLeft;
            }
        }
        this.isOverlayClicked = false;
    }

    public refreshOverlayElem(selector?: string): void {
        const root: HTMLElement = this.host ? this.host.getRootElement() : document.body;
        if (selector) {
            const fullSelector: string = '.e-ss-overlay-active' + selector;
            const overlayElem: HTMLElement = root.querySelector(fullSelector);
            if (overlayElem) {
                removeClass([overlayElem], 'e-ss-overlay-active');
                overlayElem.style.border = '1px dashed #1a73e8';
            }
        } else {
            const overlayElems: HTMLElement[] =
                Array.from(root.getElementsByClassName('e-ss-overlay-active') as HTMLCollectionOf<HTMLElement>);
            for (let i: number = 0; i < overlayElems.length; i++) {
                const element: HTMLElement = overlayElems[i as number];
                if (element) {
                    removeClass([element], 'e-ss-overlay-active');
                    element.style.border = '1px dashed #1a73e8';
                }
            }
        }
        if (this.chartManager) {
            const managerAny: { setActiveChart?: (id: string) => void } = this.chartManager as {
                setActiveChart?: (id: string) => void;
            };
            if (managerAny.setActiveChart) {
                managerAny.setActiveChart(null);
            }
        }
    }

    public destroyOverlay(host?: IOverlayHost, id?: string): void {
        void host;
        if (id) {
            const el: HTMLElement = document.getElementById(id + '_overlay') || document.getElementById(id);
            if (el) {
                el.remove();
            }
        }
    }

    public removeEventListener(): void {
        const root: HTMLElement = (this.host && this.host.getRootElement()) || document.body;
        if (!root) {
            return;
        }
        const overlays: NodeList = root.querySelectorAll('.e-ss-overlay, .e-office-overlay');
        if (overlays.length) {
            for (let idx: number = 0; idx < overlays.length; idx++) {
                EventHandler.remove(<Element>overlays[idx as number], getStartEvent(), this.boundClick);
            }
        }
        EventHandler.remove(root, getMoveEvent(), this.boundMove);
        if (this.isMouseUpBound) {
            EventHandler.remove(document, getEndEvent(), this.boundUp);
            this.isMouseUpBound = false;
        }
    }

    public destroy(): void {
        this.removeEventListener();
        this.currentWidth = null;
        this.currenHeight = null;
        this.minHeight = null;
        this.minWidth = null;
        this.isOverlayClicked = null;
        this.isResizerClicked = null;
        this.resizer = null;
        this.originalMouseX = null;
        this.originalMouseY = null;
        this.originalWidth = null;
        this.originalHeight = null;
        this.originalResizeLeft = null;
        this.originalResizeTop = null;
        this.originalReorderLeft = null;
        this.originalReorderTop = null;
        this.resizedReorderLeft = null;
        this.resizedReorderTop = null;
        this.diffX = null;
        this.diffY = null;
        this.prevX = null;
        this.prevY = null;
        this.boundClick = null;
        this.boundMove = null;
        this.boundUp = null;
        this.host = null;
        this.chartManager = null;
        this.chartRibbon = null;
    }
}
