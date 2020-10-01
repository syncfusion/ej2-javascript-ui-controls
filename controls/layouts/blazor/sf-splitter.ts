import { addClass, removeClass, isNullOrUndefined, BlazorDotnetObject, detach, extend, setStyleAttribute } from '@syncfusion/ej2-base';
import { EventHandler, select, Browser, selectAll } from '@syncfusion/ej2-base';
import { BeforeExpandEventArgs } from '../src/splitter/splitter';
import { PanePropertiesModel } from '../src/splitter/splitter-model';

/* class variables */
const ROOT: string = 'e-splitter';
const HORIZONTAL_PANE: string = 'e-splitter-horizontal';
const PANE: string = 'e-pane';
const SPLIT_BAR: string = 'e-split-bar';
const SPLIT_H_BAR: string = 'e-split-bar-horizontal';
const SPLIT_V_BAR: string = 'e-split-bar-vertical';
const STATIC_PANE: string = 'e-static-pane';
const RESIZE_BAR: string = 'e-resize-handler';
const RESIZABLE_BAR: string = 'e-resizable-split-bar';
const SPLIT_BAR_HOVER: string = 'e-split-bar-hover';
const SPLIT_BAR_ACTIVE: string = 'e-split-bar-active';
const HIDE_HANDLER: string = 'e-hide-handler';
const COLLAPSIBLE: string = 'e-collapsible';
const NAVIGATE_ARROW: string = 'e-navigate-arrow';
const ARROW_RIGHT: string = 'e-arrow-right';
const ARROW_LEFT: string = 'e-arrow-left';
const ARROW_UP: string = 'e-arrow-up';
const ARROW_DOWN: string = 'e-arrow-down';
const HIDE_ICON: string = 'e-icon-hidden';
const EXPAND_PANE: string = 'e-expanded';
const COLLAPSE_PANE: string = 'e-collapsed';
const PANE_HIDDEN: string = 'e-pane-hidden';
const RESIZABLE_PANE: string = 'e-resizable';
const LAST_BAR: string = 'e-last-bar';

/* common variables */
const MSIE: string = 'msie';
const IE: string = 'e-ie';
const HORIZONTAL: string = 'Horizontal';
const VERTICAL: string = 'Vertical';
const PX: string = 'px';
const ZERO_PX: string = '0px';
const IFRAME: string = 'iframe';
const SEPARATOR: string = 'separator';
const CHROME: string = 'chrome';
const ARIA_EXPANDED: string = 'aria-expanded';
const PREVIOUS: string = 'previous';
const CURRENT: string = 'current';
const FLEX_ONE: string = '1';
const FLEX_ZERO: string = '0';
const FLEX_EMPTY: string = '';
const ORDER_NO: number = 2; //TO find panes and seprator position.
const MIN: string = 'min';
const MAX: string = 'max';
const AUTO: string = 'auto';
const STRING: string = 'string';
const NONE: string = 'none';
const BAR_SIZE_DEFAULT: number = 1;
const RADIX: number = 10;
const PERCENT: number = 100;
const TRUE: string = 'true';
const FALSE: string = 'false';

/* event names */
const TOUCHSTART_CLICK: string = 'touchstart click';
const TOUCHSTART: string = 'touchstart';
const POINTERDOWN: string = 'pointerdown';
const MOUSEDOWN: string = 'mousedown';
const KEYDOWN: string = 'keydown';
const FOCUS: string = 'focus';
const BLUR: string = 'blur';
const MOUSEMOVE: string = 'mousemove';
const MOUSEUP: string = 'mouseup';
const POINTERMOVE: string = 'pointermove';
const POINTERUP: string = 'pointerup';
const TOUCHMOVE: string = 'touchmove';
const TOUCHEND: string = 'touchend';
const MOUSEENTER: string = 'mouseenter';
const MOUSELEAVE: string = 'mouseleave';
const MOUSEOUT: string = 'mouseout';
const MOUSEOVER: string = 'mouseover';
const MOUSE: string = 'mouse';
const TOUCH: string = 'touch';
const RESIZE: string = 'resize';
const SPLIT_TOUCH: string = 'e-splitter-touch';

/* Server side event variables */
const CREATED_EVENT: string = 'CreatedEvent';
const RESIZING_EVENT: string = 'ResizingEvent';
const RESIZE_START_EVENT: string = 'ResizeStartEvent';
const ONCOLLAPSED_EVENT: string = 'OnCollapseEvent';
const COLLAPSED_EVENT: string = 'CollapsedEvent';
const RESIZESTOP_EVENT: string = 'ResizeStopEvent';
const ONEXPAND_EVENT: string = 'OnExpandEvent';
const EXPANDED_EVENT: string = 'ExpandedEvent';
const UPDATE_COLLAPSED : string = 'UpdateCollapsed';

/* keycode values */
const KEY_LEFT_ARROW: number = 37;
const KEY_UP_ARROW: number = 38;
const KEY_RIGHT_ARROW: number = 39;
const KEY_DOWN_ARROW: number = 40;

class SfSplitter {
    private allPanes: HTMLElement[] = [];
    private currentSeparator: HTMLElement;
    private allBars: HTMLElement[] = [];
    private previousCoordinates: Coordinates = {};
    private currentCoordinates: Coordinates = {};
    private totalWidth: number;
    private totalPercent: number;
    private order: number;
    private previousPane: HTMLElement;
    private nextPane: HTMLElement;
    private prevPaneIndex: number;
    private previousPaneHeightWidth: string;
    private updatePrePaneInPercentage: boolean = false;
    private updateNextPaneInPercentage: boolean = false;
    private prePaneDimenson: number;
    private nextPaneDimension: number;
    private panesDimensions: number[] = [];
    private border: number = 0;
    // tslint:disable-next-line
    private prevPaneCurrentWidth: any;
    // tslint:disable-next-line
    private nextPaneCurrentWidth: any;
    private nextPaneIndex: number;
    // tslint:disable-next-line
    private nextPaneHeightWidth: any;
    private arrow: string;
    private currentBarIndex: number;
    private prevBar: HTMLElement;
    private nextBar: HTMLElement;
    private splitInstance: PaneDetails;
    private leftArrow: string;
    private rightArrow: string;
    private iconsDelay: number = 300;
    private collapseFlag: Boolean = false;
    private expandFlag: Boolean = true;
    private orientation: string;
    private separatorSize: number;
    private paneSettings: PanePropertiesModel[];
    private element: BlazorSplitterElement;
    private dotNetRef: BlazorDotnetObject;

    constructor(element: BlazorSplitterElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject) {
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(options);
        this.element.blazor__instance = this;
    }

    private updateContext(splitObj: { [key: string]: Object }): void {
        extend(this, this, splitObj);
    }

    public initialize(): void {
        this.addSeparator();
        this.collapseFlag = true;
        this.isCollapsed();
        this.collapseFlag = false;
        this.updateClass();
        EventHandler.add(document, TOUCHSTART_CLICK, this.onDocumentClick, this);
        this.dotNetRef.invokeMethodAsync(CREATED_EVENT, null);
        EventHandler.add(this.element, KEYDOWN, this.onMove, this);
        window.addEventListener(RESIZE, this.reportWindowSize.bind(this), true);
        if ( Browser.isDevice ) {
            addClass([this.element], SPLIT_TOUCH);
        }
    }

    private onDocumentClick(e: Event | MouseEvent): void {
        if (!(<HTMLElement>e.target).classList.contains(SPLIT_BAR) && !isNullOrUndefined(this.currentSeparator)) {
            removeClass([this.currentSeparator], [SPLIT_BAR_HOVER, SPLIT_BAR_ACTIVE]);
        }
    }

    private updateClass() : void {
        if (Browser.info.name === MSIE) {
            addClass([this.element], IE);
            let allBar: NodeListOf<Element> = this.element.querySelectorAll('.' + ROOT + ' .' + RESIZE_BAR);
            for (let i: number = 0; i < allBar.length; i++) {
                let separatorSize: number = isNullOrUndefined(this.separatorSize) ? 1 : this.separatorSize;
                setStyleAttribute((allBar[i] as HTMLElement), { 'padding-left': separatorSize / ORDER_NO + PX,
                    'padding-right': separatorSize / ORDER_NO + PX });
            }
        }
    }

    private reportWindowSize(): void {
        let paneCount: number = this.allPanes.length;
        for (let i: number = 0; i < paneCount; i++) {
            if (isNullOrUndefined(this.paneSettings[i].size)) {
                this.allPanes[i].classList.remove(STATIC_PANE);
            }
            if (paneCount - 1 === i) {
                let staticPaneCount: number = this.element.querySelectorAll('.' + STATIC_PANE).length;
                if (staticPaneCount === paneCount) {
                    removeClass([this.allPanes[i]], STATIC_PANE);
                }
            }
        }
        setTimeout(() => { this.updateSplitterSize(true); }, 200);
    }

    private onMove(event: KeyboardEvent): void {
        if (this.allPanes.length > 1) {
            this.getPaneDetails();
            this.getPaneDimensions();
            let index: number = this.getSeparatorIndex(this.currentSeparator);
            let isPrevpaneCollapsed: boolean = this.previousPane.classList.contains(COLLAPSE_PANE);
            let isPrevpaneExpanded: boolean = this.previousPane.classList.contains(EXPAND_PANE);
            let isNextpaneCollapsed: boolean = this.nextPane.classList.contains(COLLAPSE_PANE);
            if (((this.orientation !== HORIZONTAL && event.keyCode === KEY_UP_ARROW)
                || (this.orientation === HORIZONTAL && event.keyCode === KEY_RIGHT_ARROW)
                || (this.orientation === HORIZONTAL && event.keyCode === KEY_LEFT_ARROW)
                || (this.orientation !== HORIZONTAL && event.keyCode === KEY_DOWN_ARROW))
                && (!isPrevpaneExpanded && !isNextpaneCollapsed && !isPrevpaneCollapsed
                    || (isPrevpaneExpanded) && !isNextpaneCollapsed)
                && document.activeElement.classList.contains(SPLIT_BAR)
                && (this.paneSettings[index].resizable && this.paneSettings[index + 1].resizable)) {
                this.checkPaneSize(event);
                this.dotNetRef.invokeMethodAsync(RESIZING_EVENT, {
                    event: this.getKeyBoardEvtArgs(event),
                    index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
                    separator: this.getDomObject(SEPARATOR, this.currentSeparator),
                    paneSize: [this.prePaneDimenson, this.nextPaneDimension]
                });
            } else if (event.keyCode === 13 && this.paneSettings[index].collapsible &&
                document.activeElement.classList.contains(SPLIT_BAR)) {
                if (!this.previousPane.classList.contains(COLLAPSE_PANE)) {
                    this.collapse(index);
                    addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
                } else {
                    this.expand(index);
                    addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
                }
            }
        }
    };

    private addSeparator(): void {
        let separator: HTMLElement;
        for (let j : number = 0; j < this.element.children.length; j++) {
            if (this.element.children[j].classList.contains(PANE)) {
                this.allPanes.push(this.element.children[j] as HTMLElement);
            }
            if (this.element.children[j].classList.contains(SPLIT_BAR)) {
                this.allBars.push(this.element.children[j] as HTMLElement);
            }
        }
        let childCount: number = this.allPanes.length;
        for (let i: number = 0; i < childCount; i++) {
            if (i < childCount - 1) {
                separator = this.allBars[i];
                this.updateIconClass();
                if (!isNullOrUndefined(separator)) {
                    this.currentSeparator = separator;
                    this.addMouseActions(separator);
                    EventHandler.add(this.currentSeparator, TOUCHSTART_CLICK, this.clickHandler, this);
                    separator.addEventListener(FOCUS, () => {
                        if (document.activeElement.classList.contains(SPLIT_BAR)) {
                            this.currentSeparator = document.activeElement as HTMLElement;
                            addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
                        }
                    });
                    separator.addEventListener(BLUR, () => {
                        removeClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
                    });
                }
                if (!isNullOrUndefined(separator)) {
                    if (this.isResizable()) {
                        EventHandler.add(separator, MOUSEDOWN, this.onMouseDown, this);
                        let eventName: string = (Browser.info.name === MSIE) ? POINTERDOWN : TOUCHSTART;
                        EventHandler.add(separator, eventName, this.onMouseDown, this);
                        addClass([separator], RESIZABLE_BAR);
                        this.updateResizablePanes(i);
                    } else {
                        addClass([select('.' + RESIZE_BAR, separator)], HIDE_HANDLER);
                    }
                }
            } else {
                if (separator) { addClass([separator], LAST_BAR); }
                if (childCount > 1) { this.updateResizablePanes(i); }
            }
        }
    }

    private updateResizablePanes(index: number): void {
        this.getPaneDetails();
        this.isResizable() ? addClass([this.allPanes[index]], RESIZABLE_PANE) : addClass([this.allPanes[index]], RESIZABLE_PANE);
    }

    private getPaneDetails(): void {
        let prevPane: HTMLElement = null;
        let nextPane: HTMLElement = null;
        this.order = parseInt(this.currentSeparator.style.order, RADIX);
        if (this.allPanes.length > 1) {
            prevPane = this.checkSplitPane(this.currentSeparator, ((this.order - 1) / (ORDER_NO)));
            nextPane = this.checkSplitPane(this.currentSeparator, (((this.order - 1) / ORDER_NO) + 1));
        }
        if (prevPane && nextPane) {
            this.previousPane = prevPane;
            this.nextPane = nextPane;
            this.prevPaneIndex = this.getPreviousPaneIndex();
            this.nextPaneIndex = this.getNextPaneIndex();
        }
    }

    private checkSplitPane(currentBar: Element, elementIndex: number): HTMLElement {
        return this.collectPanes(currentBar.parentElement.children)[elementIndex] as HTMLElement;
    }

    private collectPanes(childNodes: HTMLCollection): HTMLElement[] {
        let elements: HTMLElement[] = [];
        for (let i: number = 0; i < childNodes.length; i++) {
            if (childNodes[i].classList.contains(PANE)) {
                elements.push(childNodes[i] as HTMLElement);
            }
        }
        return elements;
    }

    private getPreviousPaneIndex(): number {
        return ((parseInt(this.currentSeparator.style.order, RADIX) - 1) / ORDER_NO);
    }

    private getNextPaneIndex(): number {
        return ((parseInt(this.currentSeparator.style.order, RADIX) - 1) / (ORDER_NO) + 1);
    }

    private onMouseDown(e: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent): void {
        e.preventDefault();
        let target: HTMLElement = e.target as HTMLElement;
        this.splitterDetails(e);
        if (target.classList.contains(NAVIGATE_ARROW)) { return; }
        this.updateCurrentSeparator(target);
        addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.updateCursorPosition(e, PREVIOUS);
        this.getPaneDetails();
        let iframeElements: NodeListOf<HTMLIFrameElement> = this.element.querySelectorAll(IFRAME);
        for (let i: number = 0; i < iframeElements.length; i++) {
         iframeElements[i].style.pointerEvents = NONE;
         }
        this.dotNetRef.invokeMethodAsync(RESIZE_START_EVENT, {
            event: this.getMouseEvtArgs(e as MouseEvent),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.getDomObject(SEPARATOR, this.currentSeparator),
            cancel: false
        });
    }

    private getMouseEvtArgs(e: MouseEvent): { [key: string]: string | number | boolean } {
        return {
            button: e.button,
            buttons: e.buttons,
            clientX: e.clientX,
            clientY: e.clientY,
            detail: e.detail,
            screenX: e.screenX,
            screenY: e.screenY,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shittKey: e.shiftKey,
            altKey: e.altKey,
            type: e.type
        };
    };

    private getKeyBoardEvtArgs(e: KeyboardEvent): { [key: string]: string | number | boolean } {
        return {
            key: e.key,
            code: e.code,
            location: e.location,
            repeat: e.repeat,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            shittKey: e.shiftKey,
            altKey: e.altKey,
            type: e.type
        };
    };

    private getDomObject(value: string, element: HTMLElement): string {
        if (element != null) {
            // tslint:disable-next-line
            return (<any>window).sfBlazor.getDomObject(value, element);
        } else {
            return null;
        }
    }

    public resizeEvent(e: MouseEvent): void {
        this.wireResizeEvents();
        this.checkPaneSize(e);
    }

    private checkPaneSize(e: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent): void {
        let prePaneSize: number;
        let nextPaneSize: number;
        let splitBarSize: number = isNullOrUndefined(this.separatorSize) ? BAR_SIZE_DEFAULT : this.separatorSize;
        prePaneSize = this.orientation === HORIZONTAL ? this.previousPane.offsetWidth : this.previousPane.offsetHeight;
        nextPaneSize = this.orientation === HORIZONTAL ? this.nextPane.offsetWidth : this.nextPane.offsetHeight;
        if ((this.previousPane.style.flexBasis.indexOf('%') > 0 || this.nextPane.style.flexBasis.indexOf('%') > 0)) {
            let previousFlexBasis: number = this.updatePaneFlexBasis(this.previousPane);
            let nextFlexBasis: number = this.updatePaneFlexBasis(this.nextPane);
            this.totalPercent = previousFlexBasis + nextFlexBasis;
            this.totalWidth = this.convertPercentageToPixel(this.totalPercent + '%');
            if (e.type === KEYDOWN && (!isNullOrUndefined((<KeyboardEvent>e).keyCode))) {
                if (((<KeyboardEvent>e).keyCode === KEY_RIGHT_ARROW ||
                 ((<KeyboardEvent>e).keyCode === KEY_DOWN_ARROW)) && nextPaneSize > 0) {
                    this.previousPane.style.flexBasis = (previousFlexBasis + 1) + '%';
                    this.nextPane.style.flexBasis = (nextFlexBasis - 1) + '%';
                } else if (((<KeyboardEvent>e).keyCode === KEY_LEFT_ARROW ||
                ((<KeyboardEvent>e).keyCode === KEY_UP_ARROW)) && prePaneSize > 0) {
                    this.previousPane.style.flexBasis = (previousFlexBasis - 1) + '%';
                    this.nextPane.style.flexBasis = (nextFlexBasis + 1) + '%';
                }
            }
        } else {
            this.totalWidth = (this.orientation === HORIZONTAL) ? this.previousPane.offsetWidth + this.nextPane.offsetWidth :
                this.previousPane.offsetHeight + this.nextPane.offsetHeight;
            if (e.type === KEYDOWN && (!isNullOrUndefined((<KeyboardEvent>e).keyCode))) {
                if (((<KeyboardEvent>e).keyCode === KEY_RIGHT_ARROW ||
                ((<KeyboardEvent>e).keyCode === KEY_DOWN_ARROW)) && nextPaneSize > 0) {
                    this.addStaticPaneClass();
                    this.previousPane.style.flexBasis = (prePaneSize + splitBarSize) + PX;
                    this.nextPane.style.flexBasis = (nextPaneSize < splitBarSize) ? ZERO_PX :
                        (nextPaneSize - splitBarSize) + PX;
                } else if (((<KeyboardEvent>e).keyCode === KEY_LEFT_ARROW ||
                ((<KeyboardEvent>e).keyCode === KEY_UP_ARROW)) && prePaneSize > 0) {
                    this.addStaticPaneClass();
                    this.previousPane.style.flexBasis = (prePaneSize < splitBarSize) ? ZERO_PX :
                        (prePaneSize - splitBarSize) + PX;
                    this.nextPane.style.flexBasis = (nextPaneSize + splitBarSize) + PX;
                }
            }
        }
    }

    private addStaticPaneClass(): void {
        if (!this.previousPane.classList.contains(STATIC_PANE)) { addClass([this.previousPane], STATIC_PANE); }
        if (!this.nextPane.classList.contains(STATIC_PANE)) { addClass([this.nextPane], STATIC_PANE); }
    }

    private convertPercentageToPixel(value: string, targetElement?: HTMLElement): number {
        let percentage: string = value.toString();
        let convertedValue: number;
        if (percentage.indexOf('%') > -1) {
            convertedValue = parseFloat(percentage.slice(0, percentage.indexOf('%')));
            let offsetValue: number;
            if (!isNullOrUndefined(targetElement)) {
                offsetValue = this.panesDimensions[this.allPanes.indexOf(targetElement)];
            } else {
                offsetValue = (this.orientation === HORIZONTAL) ? this.element.offsetWidth : this.element.offsetHeight;
            }
            convertedValue = Math.ceil(offsetValue * (convertedValue / PERCENT));
        } else {
            convertedValue = parseInt(percentage, RADIX);
        }
        return convertedValue;
    }

    private updatePaneFlexBasis(pane: HTMLElement): number {
        let previous: number;
        if (pane.style.flexBasis.indexOf('%') > 0) {
            previous = parseFloat(pane.style.flexBasis.slice(0, pane.style.flexBasis.indexOf('%')));
        } else {
            if (pane.style.flexBasis !== '') {
                previous = this.convertPixelToPercentage(this.convertPixelToNumber(pane.style.flexBasis));
            } else {
                let offset: number = (this.orientation === HORIZONTAL) ? (pane.offsetWidth) : (pane.offsetHeight);
                previous = this.convertPixelToPercentage(offset);
            }
        }
        return previous;
    }

    private convertPixelToPercentage(value: number): number {
        let offsetValue: number = (this.orientation === HORIZONTAL) ? this.element.offsetWidth : this.element.offsetHeight;
        return (value / offsetValue) * PERCENT;
    }

    private convertPixelToNumber(value: string): number {
        return value.indexOf('p') > -1 ? parseFloat(value.slice(0, value.indexOf('p'))) : parseFloat(value);
    }

    private updateCurrentSeparator(target: HTMLElement): void {
        this.currentSeparator  = target.classList.contains(SPLIT_BAR) ? target :  target.parentElement;
    }

    private wireResizeEvents(): void {
        EventHandler.add(document, MOUSEMOVE, this.onMouseMove, this);
        EventHandler.add(document, MOUSEUP, this.onMouseUp, this);
        let touchMoveEvent: string = (Browser.info.name === MSIE) ? POINTERMOVE : TOUCHMOVE;
        let touchEndEvent: string = (Browser.info.name === MSIE) ? POINTERUP : TOUCHEND;
        EventHandler.add(document, touchMoveEvent, this.onMouseMove, this);
        EventHandler.add(document, touchEndEvent, this.onMouseUp, this);
    }

    private unwireResizeEvents(): void {
        let touchMoveEvent: string = (Browser.info.name === MSIE) ? POINTERMOVE : TOUCHMOVE;
        let touchEndEvent: string = (Browser.info.name === MSIE) ? POINTERUP : TOUCHEND;
        EventHandler.remove(document, MOUSEMOVE, this.onMouseMove);
        EventHandler.remove(document, MOUSEUP, this.onMouseUp);
        EventHandler.remove(document, touchMoveEvent, this.onMouseMove);
        EventHandler.remove(document, touchEndEvent, this.onMouseUp);
        window.removeEventListener(RESIZE, this.reportWindowSize.bind(this));
    }

    private onMouseMove(e: MouseEvent | TouchEvent | PointerEvent): void {
        if (!this.isCursorMoved(e)) { return; }
        this.getPaneDetails();
        this.getPaneDimensions();
        this.dotNetRef.invokeMethodAsync(RESIZING_EVENT, {
            event: this.getMouseEvtArgs(e as MouseEvent),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.getDomObject(SEPARATOR, this.currentSeparator),
            paneSize: [this.prePaneDimenson, this.nextPaneDimension]
        });
        let left: number = this.validateDraggedPosition(this.getSeparatorPosition(e), this.prePaneDimenson, this.nextPaneDimension);
        let separatorNewPosition: number;
        this.getBorder();
        if (this.orientation === HORIZONTAL) {
            separatorNewPosition = (this.element.getBoundingClientRect().left + left) -
                this.currentSeparator.getBoundingClientRect().left + this.border;
        } else {
            separatorNewPosition = (this.element.getBoundingClientRect().top + left) -
                this.currentSeparator.getBoundingClientRect().top + this.border;
        }
        this.nextPaneHeightWidth =
            (typeof (this.nextPaneHeightWidth) === STRING && this.nextPaneHeightWidth.indexOf('p') > -1) ?
                this.convertPixelToNumber(this.nextPaneHeightWidth) : parseInt(this.nextPaneHeightWidth, RADIX);
        this.prevPaneCurrentWidth = separatorNewPosition + this.convertPixelToNumber(this.previousPaneHeightWidth);
        this.nextPaneCurrentWidth = this.nextPaneHeightWidth - separatorNewPosition;
        this.validateMinMaxValues();
        if (this.nextPaneCurrentWidth < 0) { this.nextPaneCurrentWidth = 0; }
        /* istanbul ignore next */
        if (this.prevPaneCurrentWidth < 0) { this.prevPaneCurrentWidth = 0; }
        if ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth) > this.totalWidth) {
            if (this.nextPaneCurrentWidth < this.prevPaneCurrentWidth) {
                this.prevPaneCurrentWidth = this.prevPaneCurrentWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth)
                    - this.totalWidth);
            } else {
                this.nextPaneCurrentWidth = this.nextPaneCurrentWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth)
                    - this.totalWidth);
            }
        }
        /* istanbul ignore next */
        if ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth) < this.totalWidth) {
            let difference: number = this.totalWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth));
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + difference;
        }
        this.calculateCurrentDimensions();
        this.addStaticPaneClass();
        this.previousPane.style.flexBasis = this.prevPaneCurrentWidth;
        this.nextPane.style.flexBasis = this.nextPaneCurrentWidth;
        if (!(this.allPanes.length > ORDER_NO)) {
            this.updateSplitterSize();
        }
    }

    private updateSplitterSize(iswindowResize ?: boolean): void {
        let totalWidth: number = 0;
        let flexPaneIndexes: number[] = [];
        let flexCount: number = 0;
        let children: HTMLCollection = this.element.children;
        for (let i: number = 0; i < children.length; i++) {
            totalWidth += this.orientation === HORIZONTAL ? (children[i] as HTMLElement).offsetWidth :
                (children[i] as HTMLElement).offsetHeight;
        }
        for (let j: number = 0; j < this.allBars.length; j++) {
            let cssStyles: CSSStyleDeclaration = getComputedStyle(this.allBars[j]);
            totalWidth += this.orientation === HORIZONTAL ? parseInt(cssStyles.marginLeft, RADIX) +
            parseInt(cssStyles.marginLeft, RADIX) : parseInt(cssStyles.marginTop, RADIX) +
            parseInt(cssStyles.marginBottom, RADIX);
        }
        let diff: number = this.orientation === HORIZONTAL ? this.element.offsetWidth -
            ((this.border * ORDER_NO) + totalWidth) :
            this.element.offsetHeight - ((this.border * ORDER_NO) + totalWidth);
        for (let i: number = 0; i < this.allPanes.length; i++) {
            if (!this.paneSettings[i].size && !(this.allPanes[i].innerText === '')) {
                flexPaneIndexes[flexCount] = i;
                flexCount++;
            }
        }
        let avgDiffWidth: number = diff / flexPaneIndexes.length;
        for (let j: number = 0; j < flexPaneIndexes.length; j++) {
            this.allPanes[flexPaneIndexes[j]].style.flexBasis = this.orientation === HORIZONTAL ?
                (this.allPanes[flexPaneIndexes[j]].offsetWidth + avgDiffWidth) + PX :
                (this.allPanes[flexPaneIndexes[j]].offsetHeight + avgDiffWidth) + PX;
        }
        if (this.allPanes.length === 2 && iswindowResize) {
            let paneCount : number = this.allPanes.length;
            let minValue : number;
            let paneMinRange : number;
            let paneIndex : number = 0;
            let updatePane : HTMLElement;
            let flexPane : HTMLElement;
            for (let i : number = 0; i < paneCount; i++) {
                if (this.paneSettings[i].min !== null) {
                    paneMinRange = this.convertPixelToNumber((this.paneSettings[i].min).toString());
                    if (this.paneSettings[i].min.indexOf('%') > 0) {
                        paneMinRange = this.convertPercentageToPixel(this.paneSettings[i].min);
                    }
                    minValue = this.convertPixelToNumber((paneMinRange).toString());
                    if (this.allPanes[i].offsetWidth < minValue) {
                        if (i === paneIndex) {
                            updatePane = this.allPanes[i];
                            flexPane = this.allPanes[i + 1];
                        } else {
                            updatePane = this.allPanes[i];
                            flexPane = this.allPanes[i - 1];
                        }
                        let sizeDiff : number = minValue - this.allPanes[i].offsetWidth;
                        let isPercent : boolean = updatePane.style.flexBasis.indexOf('%') > -1;
                        updatePane.style.flexBasis = isPercent ? this.convertPixelToPercentage(updatePane.offsetWidth + sizeDiff) + '%'
                         : (updatePane.offsetWidth + sizeDiff) + 'px';
                        flexPane.style.flexBasis = flexPane.style.flexBasis.indexOf('%') > -1 ?
                         this.convertPixelToPercentage(flexPane.offsetWidth - sizeDiff) + '%' : (flexPane.offsetWidth - sizeDiff) + 'px';
                    }
                }
            }
        }
    }

    private calcDragPosition(rectValue: number, offsetValue: number): number {
        let separatorPosition: number;
        let separator: number;
        separatorPosition = this.orientation === HORIZONTAL ? (this.currentCoordinates.x - rectValue) :
            (this.currentCoordinates.y - rectValue);
        separator = separatorPosition / offsetValue;
        separator = (separator > 1) ? 1 : (separator < 0) ? 0 : separator;
        return separator * offsetValue;
    }

    private getSeparatorPosition(e: MouseEvent | TouchEvent | PointerEvent): number {
        this.updateCursorPosition(e, CURRENT);
        let rectBound: number = (this.orientation === HORIZONTAL) ? this.element.getBoundingClientRect().left :
            this.element.getBoundingClientRect().top +  window.scrollY;
        let offSet: number = (this.orientation === HORIZONTAL) ? this.element.offsetWidth : this.element.offsetHeight;
        return this.calcDragPosition(rectBound, offSet);
    }

    private getBorder(): void {
        let border: number = this.orientation === HORIZONTAL ? ((this.element.offsetWidth - this.element.clientWidth) / ORDER_NO) :
            (this.element.offsetHeight - this.element.clientHeight) / ORDER_NO;
        this.border = Browser.info.name !== CHROME ? 0 : border;
    }

    private validateMinMaxValues(): void {
        this.prevPaneCurrentWidth = this.validateMinRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        this.nextPaneCurrentWidth = this.validateMinRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
        this.prevPaneCurrentWidth = this.validateMaxRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        this.nextPaneCurrentWidth = this.validateMaxRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
    }

    private validateMinRange(paneIndex: number, paneCurrentWidth: number, pane: HTMLElement): number {
        let paneMinRange: string | number = null;
        let paneMinDimensions: number;
        let difference: number = 0;
        let validatedVal: number;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) && !isNullOrUndefined(this.paneSettings[paneIndex].min)) {
            paneMinRange = this.paneSettings[paneIndex].min.toString();
        }
        if (!isNullOrUndefined(paneMinRange)) {
            if ((<string>paneMinRange).indexOf('%') > 0) {
                paneMinRange = this.convertPercentageToPixel((<string>paneMinRange)).toString();
            }
            paneMinDimensions = this.convertPixelToNumber((<string>paneMinRange));
            if (paneCurrentWidth < paneMinDimensions) {
                difference = (paneCurrentWidth - paneMinDimensions) <= 0 ? 0 :
                    (paneCurrentWidth - paneMinDimensions);
                this.totalWidth = this.totalWidth - difference;
                this.totalPercent = this.convertPixelToPercentage(this.totalWidth);
                validatedVal = paneMinDimensions;
            }
        }
        return isNullOrUndefined(validatedVal) ? paneCurrentWidth : validatedVal;
    }

    private validateMaxRange(paneIndex: number, paneCurrentWidth: number, pane: HTMLElement): number {
        let paneMaxRange: string | number = null;
        let paneMaxDimensions: number;
        let validatedVal: number;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) && !isNullOrUndefined(this.paneSettings[paneIndex].max)) {
            paneMaxRange = this.paneSettings[paneIndex].max.toString();
        }
        if (!isNullOrUndefined(paneMaxRange)) {
            if ((<string>paneMaxRange).indexOf('%') > 0) {
                paneMaxRange = this.convertPercentageToPixel(<string>paneMaxRange).toString();
            }
            paneMaxDimensions = this.convertPixelToNumber(<string>paneMaxRange);
            if (paneCurrentWidth > paneMaxDimensions) {
                this.totalWidth = this.totalWidth - (paneCurrentWidth - paneMaxDimensions);
                this.totalPercent = this.convertPixelToPercentage(this.totalWidth);
                validatedVal = paneMaxDimensions;
            }
        }
        return isNullOrUndefined(validatedVal) ? paneCurrentWidth : validatedVal;
    }

    private calculateCurrentDimensions(): void {
        if (this.updatePrePaneInPercentage || this.updateNextPaneInPercentage) {
            this.prevPaneCurrentWidth = Math.round(Number(Math.round(this.convertPixelToPercentage(this.prevPaneCurrentWidth)
                * RADIX) / RADIX));
            this.nextPaneCurrentWidth = Math.round(Number(Math.round(this.convertPixelToPercentage(this.nextPaneCurrentWidth)
                * RADIX) / RADIX));
            if (this.prevPaneCurrentWidth === 0) { this.nextPaneCurrentWidth = this.totalPercent; }
            if (this.nextPaneCurrentWidth === 0) { this.prevPaneCurrentWidth = this.totalPercent; }
            if (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth !== this.totalPercent) {
                this.equatePaneWidths();
            } else {
                this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + '%';
                this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + '%';
            }
            this.prevPaneCurrentWidth = (this.updatePrePaneInPercentage) ? this.prevPaneCurrentWidth :
                this.convertPercentageToPixel(this.prevPaneCurrentWidth) + 'px';
            this.nextPaneCurrentWidth = (this.updateNextPaneInPercentage) ? this.nextPaneCurrentWidth :
                this.convertPercentageToPixel(this.nextPaneCurrentWidth) + 'px';
            this.updatePrePaneInPercentage = false;
            this.updateNextPaneInPercentage = false;
        } else {
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + 'px';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + 'px';
        }
    }

    private equatePaneWidths(): void {
        let difference: number;
        if ((this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) > this.totalPercent) {
            difference = (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) - this.totalPercent;
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth - (difference / ORDER_NO) + '%';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth - (difference / ORDER_NO) + '%';
        }
        if ((this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) < this.totalPercent) {
            difference = this.totalPercent - (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth);
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + (difference / ORDER_NO) + '%';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + (difference / ORDER_NO) + '%';
        }
    }

    private validateDraggedPosition(draggedPos: number, prevPaneHeightWidth: number, nextPaneHeightWidth: number): number {
        let separatorTopLeft: number = (this.orientation === HORIZONTAL) ? this.currentSeparator.offsetLeft :
            this.currentSeparator.offsetTop;
        let prePaneRange: number = separatorTopLeft - prevPaneHeightWidth;
        let nextPaneRange: number = nextPaneHeightWidth + separatorTopLeft;
        let pane1MinSize: number = this.getMinMax(this.prevPaneIndex, MIN);
        let pane2MinSize: number = this.getMinMax(this.nextPaneIndex, MIN);
        let pane1MaxSize: number = this.getMinMax(this.prevPaneIndex, MAX);
        let pane2MaxSize: number = this.getMinMax(this.nextPaneIndex, MAX);
        let validatedSize: number = draggedPos;
        if (draggedPos > nextPaneRange - pane2MinSize) {
            validatedSize = nextPaneRange - pane2MinSize;
        } else if (draggedPos < prePaneRange + pane1MinSize) {
            validatedSize = prePaneRange + pane1MinSize;
        }
        if (!isNullOrUndefined(pane1MaxSize)) {
            if (draggedPos > prePaneRange + pane1MaxSize) {
                validatedSize = prePaneRange + pane1MaxSize;
            }
        } else if (!isNullOrUndefined(pane2MaxSize)) {
            if (draggedPos < nextPaneRange - pane2MaxSize) {
                validatedSize = nextPaneRange - pane2MaxSize;
            }
        }
        return validatedSize;
    }

    private getMinMax(paneIndex: number, selection: string): number {
        let defaultVal: number = selection === MIN ? 0 : null;
        // tslint:disable-next-line
        let paneValue: any = null;
        if (selection === MIN) {
            if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
                !isNullOrUndefined(this.paneSettings[paneIndex].min)) {
                paneValue = this.paneSettings[paneIndex].min;
            }
        } else {
            if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
                !isNullOrUndefined(this.paneSettings[paneIndex].max)) {
                paneValue = this.paneSettings[paneIndex].max;
            }
        }
        if (this.paneSettings.length > 0 && !isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !isNullOrUndefined(paneValue)) {
            if (paneValue.indexOf('%') > 0) {
                paneValue = this.convertPercentageToPixel(paneValue).toString();
            }
            return this.convertPixelToNumber(paneValue);
        } else {
            return defaultVal;
        }
    }

    private isValidSize(paneIndex: number): boolean {
        let isValid: boolean;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !isNullOrUndefined(this.paneSettings[paneIndex].size) &&
            this.paneSettings[paneIndex].size.indexOf('%') > -1) {
            isValid = true;
        }
        return isValid;
    }

    private getPaneDimensions(): void {
        this.previousPaneHeightWidth = (this.previousPane.style.flexBasis === '') ? this.getPaneHeight(this.previousPane) :
            this.previousPane.style.flexBasis;
        this.nextPaneHeightWidth = (this.nextPane.style.flexBasis === '') ? this.getPaneHeight(this.nextPane) :
            this.nextPane.style.flexBasis;
        if (this.isValidSize(this.prevPaneIndex)) {
            this.previousPaneHeightWidth = this.convertPercentageToPixel(this.previousPaneHeightWidth).toString();
            this.updatePrePaneInPercentage = true;
        }
        if (this.isValidSize(this.nextPaneIndex)) {
            this.nextPaneHeightWidth = this.convertPercentageToPixel(this.nextPaneHeightWidth).toString();
            this.updateNextPaneInPercentage = true;
        }
        this.prePaneDimenson = this.convertPixelToNumber(this.previousPaneHeightWidth.toString());
        this.nextPaneDimension = this.convertPixelToNumber(this.nextPaneHeightWidth.toString());
    }

    private getPaneHeight(pane: HTMLElement): string {
        return ((this.orientation === HORIZONTAL) ? pane.offsetWidth.toString() :
            pane.offsetHeight.toString());
    }

    private isCursorMoved(e: MouseEvent | TouchEvent | PointerEvent): boolean {
        let cursorMoved: boolean = true;
        if (this.getEventType(e.type) === MOUSE || (!isNullOrUndefined((<PointerEvent>e).pointerType)) &&
            this.getEventType((<PointerEvent>e).pointerType) === MOUSE) {
            cursorMoved = this.checkCoordinates((<MouseEvent>e).pageX, (<MouseEvent>e).pageY);
        } else {
            cursorMoved = (Browser.info.name !== MSIE) ?
                this.checkCoordinates((<TouchEvent>e).touches[0].pageX, (<TouchEvent>e).touches[0].pageY) :
                this.checkCoordinates((<MouseEvent>e).pageX, (<MouseEvent>e).pageY);
        }
        return cursorMoved;
    }


    private checkCoordinates(pageX: number, pageY: number): boolean {
        let coordinatesChanged: boolean = true;
        if ((pageX === this.previousCoordinates.x || pageY === this.previousCoordinates.y)) {
            coordinatesChanged = false;
        }
        return coordinatesChanged;
    }

    private onMouseUp(e: MouseEvent | TouchEvent | PointerEvent): void {
        removeClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.unwireResizeEvents();
        for (let i: number = 0; i < this.element.querySelectorAll(IFRAME).length; i++) {
            (this.element.querySelectorAll(IFRAME)[i] as HTMLElement).style.pointerEvents = AUTO;
        }
        this.getPaneDimensions();
        this.dotNetRef.invokeMethodAsync(RESIZESTOP_EVENT, {
            event: this.getMouseEvtArgs(e as MouseEvent),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.getDomObject(SEPARATOR, this.currentSeparator),
            paneSize: [this.prePaneDimenson, this.nextPaneDimension]
        });
    }
    private isMouseEvent(e: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent): boolean {
        let isMouse: boolean;
        if (this.getEventType(e.type) === MOUSE || (!isNullOrUndefined((<PointerEvent>e).pointerType) &&
            this.getEventType((<PointerEvent>e).pointerType) === MOUSE)) {
            isMouse = true;
        }
        return isMouse;
    }

    private getEventType(e: string): string {
        return (e.indexOf(MOUSE) > -1) ? MOUSE : TOUCH;
    }

    private updateCursorPosition(e: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent, type: string): void {
        if (this.isMouseEvent(e)) {
            this.changeCoordinates({ x: (<MouseEvent>e).pageX, y: (<MouseEvent>e).pageY }, type);
        } else {
            let eventType: MouseEvent | Touch = Browser.info.name !== MSIE ? (<TouchEvent>e).touches[0] : (<MouseEvent>e);
            this.changeCoordinates({ x: eventType.pageX, y: eventType.pageY }, type);
        }
    }

    private changeCoordinates(coordinates: Coordinates, type: string): void {
        type === PREVIOUS ? this.previousCoordinates = coordinates : this.currentCoordinates = coordinates;
    }

    private isResizable(): boolean {
        let resizable: boolean;
        let nextPaneIndex: number = this.getNextPaneIndex();
        let prevPaneIndex: number = this.getPreviousPaneIndex();
        if ((!isNullOrUndefined(this.paneSettings[prevPaneIndex]) &&
            this.paneSettings[prevPaneIndex].resizable &&
            !isNullOrUndefined(this.paneSettings[nextPaneIndex]) &&
            this.paneSettings[nextPaneIndex].resizable) ||
            isNullOrUndefined(this.paneSettings[nextPaneIndex])) {
             resizable = true;
        }
        return resizable;
    }

    private clickHandler(e: Event): void {
        if (!(<HTMLElement>e.target).classList.contains(NAVIGATE_ARROW)) {
            let hoverBars: HTMLElement[] = selectAll('.' + ROOT + ' > .' + SPLIT_BAR + '.' + SPLIT_BAR_HOVER);
            if (hoverBars.length > 0) { removeClass(hoverBars, SPLIT_BAR_HOVER); }
            addClass([(<HTMLElement>e.target)], SPLIT_BAR_HOVER);
        }
        this.updateIconClass();
        let icon: HTMLElement = (<HTMLElement>e.target);
        if (icon.classList.contains(ARROW_LEFT) || icon.classList.contains(ARROW_UP)) {
            this.collapseAction(e);
        }
        if (icon.classList.contains(ARROW_RIGHT) || icon.classList.contains(ARROW_DOWN)) {
            this.expandAction(e);
        }
        let totalWidth: number = 0;
        let children: HTMLCollection = this.element.children;
        for (let i: number = 0; i < children.length; i++) {
            totalWidth += this.orientation === HORIZONTAL ? (children[i] as HTMLElement).offsetWidth :
                (children[i] as HTMLElement).offsetHeight;
        }
        if (totalWidth > this.element.offsetWidth) {
            this.updateSplitterSize();
        }
    }

    private collapseAction(e: Event): void {
        this.splitterDetails(e);
        if (this.collapseFlag) {
            this.collapsePane(e);
        } else {
            this.dotNetRef.invokeMethodAsync(ONCOLLAPSED_EVENT, {
                event: this.getMouseEvtArgs(e as MouseEvent),
                index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
                cancel: false,
            });
        }
    }

    public onCollapseEvent(e: BeforeExpandEventArgs): void {
        let iconClass: string = this.orientation === HORIZONTAL ? ARROW_LEFT : ARROW_UP;
        let targetEle: HTMLElement = this.allBars[e.index[0]].querySelector('.' + iconClass);
        let event: object = {
            target: targetEle
        };
        this.collapsePane(event as MouseEvent);
        this.dotNetRef.invokeMethodAsync(COLLAPSED_EVENT, {
            event: this.getMouseEvtArgs(e as MouseEvent),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()]
        });
    }

    private collapsePane(e: Event): void {
        let collapseCount: number = this.element.querySelectorAll('.' + COLLAPSE_PANE).length;
        let nextPaneSibling: Element = this.nextPane.nextElementSibling;
        let flexStatus: boolean = (this.previousPane.classList.contains(STATIC_PANE) &&
        !this.previousPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE) &&
            nextPaneSibling.classList.contains(PANE) &&
            !nextPaneSibling.classList.contains(STATIC_PANE) &&
            !nextPaneSibling.classList.contains(COLLAPSE_PANE) &&
            !(collapseCount === this.allPanes.length - 2))
            || (this.nextPane.classList.contains(COLLAPSE_PANE) && !this.previousPane.classList.contains(STATIC_PANE)
                && this.nextPane.classList.contains(STATIC_PANE));
        let collapseClass: string[] = [COLLAPSE_PANE, PANE_HIDDEN];
        if (this.nextPane.classList.contains(COLLAPSE_PANE)) {
            removeClass([this.previousPane], EXPAND_PANE);
            removeClass([this.nextPane], collapseClass);
            if (!this.collapseFlag) { this.updatePaneSettings(this.nextPaneIndex, false); }
        } else {
            removeClass([this.previousPane], EXPAND_PANE);
            removeClass([this.nextPane], collapseClass);
            addClass([this.nextPane], EXPAND_PANE);
            addClass([this.previousPane], collapseClass);
            if (!this.collapseFlag) { this.updatePaneSettings(this.prevPaneIndex, true); }
        }
        this.updateIconsOnCollapse(e);
        this.previousPane.setAttribute(ARIA_EXPANDED, FALSE);
        this.nextPane.setAttribute(ARIA_EXPANDED, TRUE);
        this.updateFlexGrow(this.checkStaticPanes());
        if (flexStatus) {
            removeClass([this.nextPane], EXPAND_PANE);
            this.nextPane.style.flexGrow = '';
        }
    }

    private updateIconsOnCollapse(e: Event): void {
        this.splitterProperty();
        if (this.previousPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE)) {
            addClass([e.target as HTMLElement], HIDE_ICON);
            if (this.paneSettings[this.prevPaneIndex].collapsible) {
                removeClass([select('.' + this.arrow, this.currentSeparator)], HIDE_ICON);
            }
            this.resizableModel(this.currentBarIndex, false);
            if (this.previousPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE) &&
                !this.paneSettings[this.prevPaneIndex].collapsible) {
                this.hideTargetBarIcon(this.prevBar, this.rightArrow);
            }
            if (this.previousPane.previousElementSibling && !this.previousPane.previousElementSibling.classList.contains(COLLAPSE_PANE)) {
                if (this.previousPane.classList.contains(COLLAPSE_PANE) && this.paneSettings[this.prevPaneIndex].collapsible) {
                    this.showTargetBarIcon(this.prevBar, this.leftArrow);
                } else if (!this.paneSettings[this.prevPaneIndex].collapsible) {
                    this.hideTargetBarIcon(this.prevBar, this.leftArrow);
                }
            }
            if (!isNullOrUndefined(this.prevBar)) {
                this.resizableModel(this.currentBarIndex - 1, false);
                this.hideTargetBarIcon(this.prevBar, this.arrow);
            }
            if (!this.paneSettings[this.prevPaneIndex].collapsible) {
                this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
            }
        } else if (!this.splitInstance.prevPaneCollapsed && !this.splitInstance.nextPaneExpanded) {
            if (this.paneSettings[this.currentBarIndex].resizable) {
                this.resizableModel(this.currentBarIndex, true);
            }
            if (!this.splitInstance.nextPaneNextEle.classList.contains(COLLAPSE_PANE) &&
                this.paneSettings[this.currentBarIndex + 1].resizable) {
                this.resizableModel(this.currentBarIndex + 1, true);
            }
            if (!this.paneSettings[this.currentBarIndex].collapsible) {
                addClass([e.target as HTMLElement], HIDE_ICON);
            }
            if (this.previousPane && this.prevPaneIndex === 0 && (this.paneSettings[this.prevPaneIndex].collapsible)) {
                this.showTargetBarIcon(this.currentSeparator, this.leftArrow);
            }
            if (this.nextPane && this.nextPaneIndex === this.allPanes.length - 1 && (this.paneSettings[this.nextPaneIndex].collapsible)) {
                this.showTargetBarIcon(this.allBars[(this.nextPaneIndex - 1)], this.rightArrow);
            }
            if (!(this.previousPane.classList.contains(COLLAPSE_PANE)) && this.paneSettings[this.nextPaneIndex].collapsible) {
                this.showTargetBarIcon(this.currentSeparator, this.rightArrow);
            }
            if (!isNullOrUndefined(this.nextBar)) {
                if (this.nextPane.nextElementSibling && (this.nextPane.nextElementSibling.classList.contains(COLLAPSE_PANE) &&
                    this.paneSettings[this.nextPaneIndex + 1].collapsible) ||
                    (!this.nextPane.nextElementSibling.classList.contains(COLLAPSE_PANE) &&
                        this.paneSettings[this.nextPaneIndex].collapsible)) {
                    this.showTargetBarIcon(this.nextBar, this.leftArrow);
                } else if (!this.paneSettings[this.splitInstance.nextPaneIndex + 1].collapsible &&
                    this.paneSettings[this.currentBarIndex]) {
                    this.hideTargetBarIcon(this.nextBar, this.arrow);
                }
            }
            if (!(this.nextPaneIndex === this.allPanes.length - 1) && this.nextPane.nextElementSibling &&
                !this.nextPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.nextElementSibling.classList.contains(COLLAPSE_PANE)
                && !this.paneSettings[this.nextPaneIndex + 1].collapsible) {
                this.hideTargetBarIcon(this.nextBar, this.rightArrow);
            }
        }
    }

    private expandAction(e: Event): void {
        this.splitterDetails(e);
        if (this.expandFlag) {
            this.dotNetRef.invokeMethodAsync(ONEXPAND_EVENT, {
                event: this.getMouseEvtArgs(e as MouseEvent),
                index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
                cancel: false
            });
        } else {
            this.expandPane(e);
        }
    }

    public onExpandEvent(e: BeforeExpandEventArgs): void {
        let iconClass : string = this.orientation === HORIZONTAL ? ARROW_RIGHT : ARROW_DOWN;
        let targetEle : HTMLElement = this.allBars[e.index[0]].querySelector('.' + iconClass);
        let event: object = {
            target: targetEle
        };
        this.expandPane(event as Event);
        this.dotNetRef.invokeMethodAsync(EXPANDED_EVENT, {
            event: this.getMouseEvtArgs(e as MouseEvent),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()]
        });
    }

    private getSeparatorIndex(target?: HTMLElement): number {
        let separator: string = this.orientation === HORIZONTAL ? SPLIT_H_BAR : SPLIT_V_BAR;
        if (this.allBars.length < 1) {
            this.allBars = selectAll('.' + separator, this.element);
        }
        let array: HTMLElement[] = [].slice.call(this.allBars);
        return array.indexOf(target);
    }

    private updateBars(index: number): void {
        this.prevBar = this.allBars[(index - 1)];
        this.nextBar =  this.allBars[(index + 1)];
    }
    private splitterDetails(e: Event): void {
        if (this.element.classList.contains(HORIZONTAL_PANE)) {
            this.orientation = HORIZONTAL;
            this.arrow = (<HTMLElement>e.target).classList.contains(ARROW_LEFT) ? ARROW_RIGHT : ARROW_LEFT;
        } else {
            this.orientation = VERTICAL;
            this.arrow = (<HTMLElement>e.target).classList.contains(ARROW_UP) ? ARROW_DOWN : ARROW_UP;
        }
        this.updateCurrentSeparator(e.target as HTMLElement);
        this.currentBarIndex = this.getSeparatorIndex((<HTMLElement>e.target).parentElement);
        this.updateBars(this.currentBarIndex);
        this.getPaneDetails();
    }

    private expandPane(e: Event): void {
        let collapseCount: number = this.element.querySelectorAll('.' + COLLAPSE_PANE).length;
        let flexStatus: boolean = (!this.previousPane.classList.contains(COLLAPSE_PANE) &&
            this.previousPane.classList.contains(STATIC_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE) &&
            !this.nextPane.classList.contains(EXPAND_PANE) && this.nextPane.nextElementSibling.classList.contains(PANE) &&
            !this.nextPane.nextElementSibling.classList.contains(STATIC_PANE) && !(collapseCount === this.allPanes.length - ORDER_NO));
        let collapseClass: string[] = [COLLAPSE_PANE, PANE_HIDDEN];
        if (!this.previousPane.classList.contains(COLLAPSE_PANE)) {
            removeClass([this.nextPane], EXPAND_PANE);
            removeClass([this.previousPane], collapseClass);
            addClass([this.previousPane], EXPAND_PANE);
            addClass([this.nextPane], collapseClass);
            if (this.expandFlag) {
                this.updatePaneSettings(this.nextPaneIndex, true);
            }
        } else {
            removeClass([this.previousPane], collapseClass);
            removeClass([this.nextPane], EXPAND_PANE);
            if (this.expandFlag) {
                this.updatePaneSettings(this.prevPaneIndex, false);
            }
        }
        this.updateIconsOnExpand(e);
        this.previousPane.setAttribute(ARIA_EXPANDED, TRUE);
        this.nextPane.setAttribute(ARIA_EXPANDED, FALSE);
        this.updateFlexGrow(this.checkStaticPanes());
        if (flexStatus) {
            removeClass([this.previousPane], EXPAND_PANE);
            this.previousPane.style.flexGrow = '';
        }
    }

    private checkStaticPanes(): boolean {
        let staticPane: boolean = true;
        for (let i: number = 0; i < this.allPanes.length; i++) {
            if (!this.allPanes[i].classList.contains(COLLAPSE_PANE) && staticPane) {
                staticPane = this.allPanes[i].classList.contains(STATIC_PANE) ? true : false;
            }
        }
        return staticPane;
    }

    private splitterProperty(): void {
        this.splitInstance = {
            currentBarIndex: this.currentBarIndex,
            nextPaneCollapsible: this.nextPane.classList.contains(COLLAPSIBLE),
            prevPaneCollapsible: this.previousPane.classList.contains(COLLAPSIBLE),
            prevPaneExpanded: this.previousPane.classList.contains(EXPAND_PANE),
            nextPaneExpanded: this.nextPane.classList.contains(EXPAND_PANE),
            nextPaneCollapsed: this.nextPane.classList.contains(COLLAPSE_PANE),
            prevPaneCollapsed: this.previousPane.classList.contains(COLLAPSE_PANE),
            nextPaneIndex: this.getNextPaneIndex(),
            prevPaneIndex: this.getPreviousPaneIndex(),
            nextPaneNextEle: this.nextPane.nextElementSibling as HTMLElement,
            prevPanePreEle: this.previousPane.previousElementSibling as HTMLElement,
        };
    }

    private updateIconsOnExpand(e: Event): void {
        this.splitterProperty();
        addClass([e.target as HTMLElement], HIDE_ICON);
        if (!this.splitInstance.prevPaneExpanded && !this.splitInstance.nextPaneCollapsed) {
            if (this.paneSettings[this.prevPaneIndex].collapsible) {
                removeClass([select('.' + this.arrow, this.currentSeparator)], HIDE_ICON);
            }
            if (this.paneSettings[this.nextPaneIndex].collapsible) {
                removeClass([e.target as HTMLElement], HIDE_ICON);
            }
            if (this.paneSettings[this.currentBarIndex].resizable) {
                this.resizableModel(this.currentBarIndex, true);
            }
            if (!isNullOrUndefined(this.prevBar) &&
                !this.splitInstance.prevPanePreEle.classList.contains(COLLAPSE_PANE)) {
                if (this.paneSettings[this.currentBarIndex - 1].resizable) {
                    this.resizableModel(this.currentBarIndex - 1, true);
                }
                if (this.paneSettings[this.prevPaneIndex].collapsible) {
                    this.showTargetBarIcon(this.prevBar, this.rightArrow);
                }
                if (!this.paneSettings[this.currentBarIndex - 1].collapsible) {
                    this.hideTargetBarIcon(this.prevBar, this.arrow);
                    if (this.paneSettings[this.currentBarIndex].collapsible &&
                        !this.paneSettings[this.currentBarIndex + 1].collapsible) {
                        this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                    }
                } else if (this.paneSettings[this.currentBarIndex].collapsible &&
                    !this.paneSettings[this.currentBarIndex + 1].collapsible) {
                    this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                }
            } else {
                if (this.previousPane.previousElementSibling && this.paneSettings[this.prevPaneIndex].collapsible &&
                    (this.previousPane.previousElementSibling.classList.contains(COLLAPSE_PANE) &&
                        this.paneSettings[this.prevPaneIndex - 1].collapsible)) {
                    this.showTargetBarIcon(this.prevBar, this.rightArrow);
                }
                if (!this.paneSettings[this.currentBarIndex + 1].collapsible) {
                    this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                }
            }
        } else if (this.splitInstance.prevPaneExpanded && this.splitInstance.nextPaneCollapsed) {
            this.resizableModel(this.currentBarIndex, false);
            this.resizableModel(this.currentBarIndex + 1, false);
            if (this.paneSettings[this.nextPaneIndex].collapsible) {
                removeClass([select('.' + this.arrow, this.currentSeparator)], HIDE_ICON);
            }
            if (!isNullOrUndefined(this.nextBar)) {
                this.hideTargetBarIcon(this.nextBar, this.arrow);
            }
            if (this.nextPane && this.nextPaneIndex === this.allPanes.length - 1 && (!this.paneSettings[this.nextPaneIndex].collapsible &&
                this.splitInstance.nextPaneCollapsed)) {
                this.hideTargetBarIcon(this.currentSeparator, this.arrow);
            }
            if (!(this.nextPaneIndex === this.allPanes.length - 1) && this.nextPane.nextElementSibling &&
                this.nextPane.classList.contains(COLLAPSE_PANE) &&
                !this.nextPane.nextElementSibling.classList.contains(COLLAPSE_PANE)
                && this.paneSettings[this.nextPaneIndex].collapsible) {
                this.showTargetBarIcon(this.nextBar, this.rightArrow);
            }
        }
    }

    private showResizer(target: HTMLElement): void {
        if (!isNullOrUndefined(this.previousPane) && this.previousPane.classList.contains(RESIZABLE_PANE) &&
            !isNullOrUndefined(this.nextPane) && this.nextPane.classList.contains(RESIZABLE_PANE)) {
            removeClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
        }
    }

    private resizableModel(index: number, newVal: boolean): void {
        let paneIndex: number;
        let i: number = index;
        paneIndex = (index === (this.allBars.length)) ? (index - 1) : index;
        EventHandler.remove(this.allBars[paneIndex], MOUSEDOWN, this.onMouseDown);
        if (newVal) {
            EventHandler.add(this.allBars[paneIndex], MOUSEDOWN, this.onMouseDown, this);
            if (this.isResizable()) {
                this.showResizer(this.allBars[paneIndex]);
                removeClass([select('.' + RESIZE_BAR, this.allBars[paneIndex])], HIDE_HANDLER);
                addClass([this.allBars[paneIndex]], RESIZABLE_BAR);
                (index === (this.allBars.length)) ? addClass([this.allPanes[index]], RESIZABLE_PANE) :
                    addClass([this.allPanes[paneIndex]], RESIZABLE_PANE);
                this.updateResizablePanes(i);
            }
        } else {
            this.updateResizablePanes(i);
            addClass([select('.' + RESIZE_BAR, this.allBars[paneIndex])], HIDE_HANDLER);
            removeClass([this.allBars[paneIndex]], RESIZABLE_BAR);
            if (index === this.allBars.length) {
                removeClass([this.allPanes[index]], RESIZABLE_PANE);
            } else {
            removeClass([this.allPanes[paneIndex]], RESIZABLE_PANE);
            }
        }
    }

    private hideTargetBarIcon(targetBar: HTMLElement, targetArrow: string): void {
        addClass([select('.' + targetArrow, targetBar)], HIDE_ICON);
    }

    private showTargetBarIcon(targetBar: HTMLElement, targetArrow: string): void {
        removeClass([select('.' + targetArrow, targetBar)], HIDE_ICON);
    }

    private updateFlexGrow(status: boolean): void {
        let panes: HTMLElement[] = this.allPanes;
        for (let i: number = 0; i < panes.length; i++) {
            panes[i].style.flexGrow = panes[i].classList.contains(EXPAND_PANE) ?
            FLEX_ONE : panes[i].classList.contains(COLLAPSE_PANE) ? FLEX_ZERO : FLEX_EMPTY;
            if (status && !this.nextPane.classList.contains(COLLAPSE_PANE)) {
                this.nextPane.style.flexGrow = FLEX_ONE;
            }
        }
    }

    private updatePaneSettings(index: number, collapsed: boolean): void {
        this.paneSettings[index].collapsed = collapsed;
        this.dotNetRef.invokeMethodAsync(UPDATE_COLLAPSED, index , collapsed);
    }

    private addMouseActions(separator: HTMLElement): void {
        let sTout: ReturnType<typeof setTimeout>; let hoverTimeOut: ReturnType<typeof setTimeout>;
        separator.addEventListener(MOUSEENTER, () => {
            /* istanbul ignore next */
            sTout = setTimeout(() => { addClass([separator], [SPLIT_BAR_HOVER]); }, this.iconsDelay);
        });
        separator.addEventListener(MOUSELEAVE, () => {
            clearTimeout(sTout);
            removeClass([separator], [SPLIT_BAR_HOVER]);
        });
        separator.addEventListener(MOUSEOUT, () => {
            clearTimeout(hoverTimeOut);
        });
        separator.addEventListener(MOUSEOVER, () => {
            /* istanbul ignore next */
            hoverTimeOut = setTimeout(() => { addClass([separator], [SPLIT_BAR_HOVER]); }, this.iconsDelay);
        });
    }

    private updateIconClass(): void {
        if (this.orientation === HORIZONTAL) {
            this.leftArrow = ARROW_LEFT;
            this.rightArrow = ARROW_RIGHT;
        } else {
            this.leftArrow = ARROW_UP;
            this.rightArrow = ARROW_DOWN;
        }
    }

    private isCollapsed(index?: number): void {
        if (!isNullOrUndefined(index) && this.paneSettings[index].collapsed
            && isNullOrUndefined(this.allPanes[index].classList.contains(COLLAPSE_PANE))) { return; }
        this.expandFlag = false;
        if (!isNullOrUndefined(index)) {
            this.collapseFlag = true;
            let targetEle: HTMLElement;
            let lastBarIndex: boolean = (index === this.allBars.length);
            let barIndex: number = lastBarIndex ? index - 1 : index;
            if (!lastBarIndex && this.allPanes[index + 1].classList.contains(COLLAPSE_PANE) && index !== 0) {
                targetEle = this.collapseArrow(barIndex - 1, this.targetArrows().lastBarArrow);
            } else {
                targetEle = (lastBarIndex) ? this.collapseArrow(barIndex, this.targetArrows().lastBarArrow) :
                    this.collapseArrow(barIndex, this.targetArrows().collapseArrow);
            }
            let event: Object = { target: targetEle };
            this.splitterDetails(event as Event);
            this.dotNetRef.invokeMethodAsync(ONCOLLAPSED_EVENT, {
                index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
                cancel: false
            });
        } else {
            for (let m: number = 0; m < this.allPanes.length; m++) {
                if (!isNullOrUndefined(this.paneSettings[m]) && this.paneSettings[m].collapsed) {
                    this.updateIsCollapsed(m, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
                }
            }
            for (let m: number = this.allPanes.length - 1; m >= 0; m--) {
                if (!isNullOrUndefined(this.paneSettings[m]) && this.paneSettings[m].collapsed &&
                    !this.allPanes[m].classList.contains(COLLAPSE_PANE)) {
                    let collapseArrow: string = this.orientation === HORIZONTAL ? ARROW_RIGHT : ARROW_DOWN;
                    if (m !== 0) {
                        let targetEle: HTMLElement = this.collapseArrow(m - 1, collapseArrow);
                        targetEle.click();
                    }
                    if (!this.nextPane.classList.contains(COLLAPSE_PANE)) {
                        let targetEle: HTMLElement = this.collapseArrow(m - 1, collapseArrow);
                        targetEle.click();
                    }
                }
            }
        }
        this.expandFlag = true;
    }

    public collapseMethodEvent(index: number, e: BeforeExpandEventArgs): void {
        this.expandFlag = false;
        let collapsedindex: number[] = [];
        collapsedindex[0] = index;
        let j: number = 1;
        for (let i: number = 0; i < this.allPanes.length; i++) {
            if (this.allPanes[i].classList.contains(COLLAPSE_PANE)) {
                collapsedindex[j] = i;
                j++;
            }
        }
        collapsedindex = collapsedindex.sort();
        this.updateIsCollapsed(index, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
        for (let i: number = 0; i < collapsedindex.length; i++) {
            if (!this.allPanes[collapsedindex[i]].classList.contains(COLLAPSE_PANE)) {
                this.updateIsCollapsed(collapsedindex[i], this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
            }
        }
        for (let i: number = collapsedindex.length; i > 0; i--) {
            if (!this.allPanes[collapsedindex[i - 1]].classList.contains(COLLAPSE_PANE)) {
                let targetArrow: { [key: string]: string; } = this.targetArrows();
                this.updateIsCollapsed(collapsedindex[i - 1], targetArrow.collapseArrow, targetArrow.lastBarArrow);
            }
        }
        this.dotNetRef.invokeMethodAsync(COLLAPSED_EVENT, {
            event: this.getMouseEvtArgs(e as MouseEvent),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
        });
        this.collapseFlag = false;
        this.expandFlag = true;
    }

    public expand(index: number): void {
        this.collapsedOnchange(index);
        this.updatePaneSettings(index, false);
    }

    public collapse(index: number): void {
        this.isCollapsed(index);
        this.updatePaneSettings(index, true);
    }

    private collapsedOnchange(index: number): void {
        if (!isNullOrUndefined(this.paneSettings[index]) && !isNullOrUndefined(this.paneSettings[index].collapsed)
            && this.allPanes[index].classList.contains(COLLAPSE_PANE)) {
            this.updateIsCollapsed(index, this.targetArrows().lastBarArrow, this.targetArrows().collapseArrow);
        }
    }

    private collapsibleModelUpdate(index: number): void {
        let arrow2: HTMLElement;
        let arrow1: HTMLElement;
        let paneIndex: number;
        paneIndex = index === (this.allBars.length) ? (index - 1) : index;
        arrow2 = (this.orientation === HORIZONTAL) ? this.checkArrow(paneIndex, ARROW_LEFT) : this.checkArrow(paneIndex, ARROW_UP);
        arrow1 = (this.orientation === HORIZONTAL) ? this.checkArrow(paneIndex, ARROW_RIGHT) : this.checkArrow(paneIndex, ARROW_DOWN);
        this.paneCollapsible(this.allPanes[index], index);
        this.updateCollapseIcons(paneIndex, arrow1, arrow2);
    }

    private updateCollapseIcons(index: number, arrow1: HTMLElement, arrow2: HTMLElement): void {
        if (!isNullOrUndefined(this.paneSettings[index])) {
            if (!isNullOrUndefined(this.paneSettings[index].collapsible)) {
                this.paneSettings[index].collapsible ? removeClass([arrow2], [HIDE_ICON]) : addClass([arrow2], [HIDE_ICON]);
                if (!isNullOrUndefined(this.paneSettings[index + 1])) {
                    this.paneSettings[index + 1].collapsible ? removeClass([arrow1], [HIDE_ICON]) : addClass([arrow1], [HIDE_ICON]);
                }
            }
        }
    }

    private checkArrow(paneIndex: number, targetArrow: string): HTMLElement {
        return (this.allBars[paneIndex].querySelector('.' + NAVIGATE_ARROW + '.' + targetArrow));
    }

    private paneCollapsible(pane: HTMLElement, index: number): void {
        this.paneSettings[index].collapsible ? addClass([pane], COLLAPSIBLE) : removeClass([pane], COLLAPSIBLE);
    }

    public propertyChanged(splitObj: { [key: string]: Object }, changedArgs: { [key: string]: Object }): void {
        extend(this, this, splitObj);
        this.updateClass();
        if (changedArgs) {
            for (let i: number = 0; i <= Object.keys(changedArgs).length; i++) {
                let key: number = parseInt(Object.keys(changedArgs)[i], RADIX);
                if (Object(changedArgs)[key]) {
                for (let j : number = 0; j < Object(changedArgs)[key].length ; j++ ) {
                switch (Object(changedArgs)[key][j]) {
                    case 'Resizable':
                        this.resizableModel(key, this.paneSettings[key].resizable);
                        break;
                    case 'Collapsible':
                        this.collapsibleModelUpdate(key);
                        break;
                    case 'Collapsed':
                        this.paneSettings[key].collapsed ? this.isCollapsed(key) : this.collapsedOnchange(key);
                        break;
                }
            }}
            }
        }
    }

    private targetArrows(): { [key: string]: string } {
        this.splitterProperty();
        return {
            collapseArrow: (this.orientation === HORIZONTAL) ? ARROW_LEFT : ARROW_UP,
            lastBarArrow: (this.orientation === VERTICAL) ? ARROW_DOWN : ARROW_RIGHT
        };
    }

    private collapseArrow(barIndex: number, arrow: string): HTMLElement {
        return selectAll('.' + arrow, this.allBars[barIndex])[0];
    }

    private updateIsCollapsed(index: number, collapseArrow: string, lastBarArrow: string): void {
        if (!isNullOrUndefined(index)) {
            let targetEle: HTMLElement;
            let lastBarIndex: boolean = (index === this.allBars.length);
            let barIndex: number = lastBarIndex ? index - 1 : index;
            if (!lastBarIndex && this.allPanes[index + 1].classList.contains(COLLAPSE_PANE) && index !== 0) {
                targetEle = this.collapseArrow(barIndex - 1, lastBarArrow);
            } else {
                targetEle = (lastBarIndex) ? this.collapseArrow(barIndex, lastBarArrow) : this.collapseArrow(barIndex, collapseArrow);
            }
            targetEle.click();
        }
    }

    public destroy(): void {
        EventHandler.remove(document, TOUCHSTART_CLICK, this.onDocumentClick);
        while (this.element.attributes.length > 0) {
            this.element.removeAttribute(this.element.attributes[0].name);
        }
        let splitNodes: HTMLCollection = this.element.children;
        for (let i: number = splitNodes.length - 1; i >= 0; i--) {
            detach(splitNodes[i]);
        }
    }
}

/**
 * To maintain pane details
 */
interface PaneDetails {
    /** to check whether the prevPane is Collapsible */
    prevPaneCollapsible?: boolean;
    /** to check whether the prevPane is expanded */
    prevPaneExpanded?: boolean;
    /** to check whether the nextPane is Collapsible */
    nextPaneCollapsible?: boolean;
    /** to check whether the nextPane is expanded */
    nextPaneExpanded?: boolean;
    /** previous pane index */
    prevPaneIndex?: number;
    /** next pane index */
    nextPaneIndex?: number;
    /** currentbar index */
    currentBarIndex?: number;
    /** to get prevPane's previous element */
    prevPanePreEle?: HTMLElement;
    /** to get nextPane's next element */
    nextPaneNextEle?: HTMLElement;
    /** to check whether the nextPane is collapsed */
    nextPaneCollapsed?: boolean;
    /** to check whether the previousPane is collapsed */
    prevPaneCollapsed?: boolean;

}

/**
 * Interface for accessing element coordinates
 */

interface Coordinates {
    /**
     * x coordinate of an element
     */
    x?: number;
    /**
     * y coordinate of an element.
     */
    y?: number;
}
// tslint:disable-next-line
let Splitter: object = {
    initialize(element: BlazorSplitterElement, options: { [key: string]: Object }, dotnetRef: BlazorDotnetObject): void {
        new SfSplitter(element, options, dotnetRef);
        element.blazor__instance.initialize();
    },
    collapse(element: BlazorSplitterElement, index: number): void {
        element.blazor__instance.collapse(index);
    },
    expand(element: BlazorSplitterElement, index: number): void {
        element.blazor__instance.expand(index);
    },
    resizeEvent(element: BlazorSplitterElement, e: MouseEvent): void {
        element.blazor__instance.resizeEvent(e);
    },
    onCollapseEvent(element: BlazorSplitterElement, event: BeforeExpandEventArgs): void {
        element.blazor__instance.onCollapseEvent(event);
    },
    collapseMethodEvent(element: BlazorSplitterElement, event: BeforeExpandEventArgs): void {
        element.blazor__instance.collapseMethodEvent(event.index[0], event);
    },
    onExpandEvent(element: BlazorSplitterElement, event: BeforeExpandEventArgs): void {
        element.blazor__instance.onExpandEvent(event);
    },
    destroy(element: BlazorSplitterElement): void {
        if (element) {
            element.blazor__instance.destroy();
        }
    },
    propertyChanged(splitObj: { [key: string]: Object }, changedArgs: { [key: string]: string }): void {
        (splitObj.element as BlazorSplitterElement).blazor__instance.propertyChanged(splitObj, changedArgs);
    }
};

interface BlazorSplitterElement extends HTMLElement {
    blazor__instance: SfSplitter;
}

export default Splitter;