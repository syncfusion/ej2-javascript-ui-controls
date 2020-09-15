window.sfBlazor = window.sfBlazor || {};
window.sfBlazor.Splitter = (function () {
'use strict';

/* class variables */
var ROOT = 'e-splitter';
var HORIZONTAL_PANE = 'e-splitter-horizontal';
var PANE = 'e-pane';
var SPLIT_BAR = 'e-split-bar';
var SPLIT_H_BAR = 'e-split-bar-horizontal';
var SPLIT_V_BAR = 'e-split-bar-vertical';
var STATIC_PANE = 'e-static-pane';
var RESIZE_BAR = 'e-resize-handler';
var RESIZABLE_BAR = 'e-resizable-split-bar';
var SPLIT_BAR_HOVER = 'e-split-bar-hover';
var SPLIT_BAR_ACTIVE = 'e-split-bar-active';
var HIDE_HANDLER = 'e-hide-handler';
var COLLAPSIBLE = 'e-collapsible';
var NAVIGATE_ARROW = 'e-navigate-arrow';
var ARROW_RIGHT = 'e-arrow-right';
var ARROW_LEFT = 'e-arrow-left';
var ARROW_UP = 'e-arrow-up';
var ARROW_DOWN = 'e-arrow-down';
var HIDE_ICON = 'e-icon-hidden';
var EXPAND_PANE = 'e-expanded';
var COLLAPSE_PANE = 'e-collapsed';
var PANE_HIDDEN = 'e-pane-hidden';
var RESIZABLE_PANE = 'e-resizable';
var LAST_BAR = 'e-last-bar';
/* common variables */
var MSIE = 'msie';
var IE = 'e-ie';
var HORIZONTAL = 'Horizontal';
var VERTICAL = 'Vertical';
var PX = 'px';
var ZERO_PX = '0px';
var IFRAME = 'iframe';
var SEPARATOR = 'separator';
var CHROME = 'chrome';
var ARIA_EXPANDED = 'aria-expanded';
var PREVIOUS = 'previous';
var CURRENT = 'current';
var FLEX_ONE = '1';
var FLEX_ZERO = '0';
var FLEX_EMPTY = '';
var ORDER_NO = 2; //TO find panes and seprator position.
var MIN = 'min';
var MAX = 'max';
var AUTO = 'auto';
var STRING = 'string';
var NONE = 'none';
var BAR_SIZE_DEFAULT = 1;
var RADIX = 10;
var PERCENT = 100;
var TRUE = 'true';
var FALSE = 'false';
/* event names */
var TOUCHSTART_CLICK = 'touchstart click';
var TOUCHSTART = 'touchstart';
var POINTERDOWN = 'pointerdown';
var MOUSEDOWN = 'mousedown';
var KEYDOWN = 'keydown';
var FOCUS = 'focus';
var BLUR = 'blur';
var MOUSEMOVE = 'mousemove';
var MOUSEUP = 'mouseup';
var POINTERMOVE = 'pointermove';
var POINTERUP = 'pointerup';
var TOUCHMOVE = 'touchmove';
var TOUCHEND = 'touchend';
var MOUSEENTER = 'mouseenter';
var MOUSELEAVE = 'mouseleave';
var MOUSEOUT = 'mouseout';
var MOUSEOVER = 'mouseover';
var MOUSE = 'mouse';
var TOUCH = 'touch';
var RESIZE = 'resize';
var SPLIT_TOUCH = 'e-splitter-touch';
/* Server side event variables */
var CREATED_EVENT = 'CreatedEvent';
var RESIZING_EVENT = 'ResizingEvent';
var RESIZE_START_EVENT = 'ResizeStartEvent';
var ONCOLLAPSED_EVENT = 'OnCollapseEvent';
var COLLAPSED_EVENT = 'CollapsedEvent';
var RESIZESTOP_EVENT = 'ResizeStopEvent';
var ONEXPAND_EVENT = 'OnExpandEvent';
var EXPANDED_EVENT = 'ExpandedEvent';
var UPDATE_COLLAPSED = 'UpdateCollapsed';
/* keycode values */
var KEY_LEFT_ARROW = 37;
var KEY_UP_ARROW = 38;
var KEY_RIGHT_ARROW = 39;
var KEY_DOWN_ARROW = 40;
var SfSplitter = /** @class */ (function () {
    function SfSplitter(element, options, dotnetRef) {
        this.allPanes = [];
        this.allBars = [];
        this.previousCoordinates = {};
        this.currentCoordinates = {};
        this.updatePrePaneInPercentage = false;
        this.updateNextPaneInPercentage = false;
        this.panesDimensions = [];
        this.border = 0;
        this.iconsDelay = 300;
        this.collapseFlag = false;
        this.expandFlag = true;
        this.element = element;
        this.dotNetRef = dotnetRef;
        this.updateContext(options);
        this.element.blazor__instance = this;
    }
    SfSplitter.prototype.updateContext = function (splitObj) {
        sf.base.extend(this, this, splitObj);
    };
    SfSplitter.prototype.initialize = function () {
        this.addSeparator();
        this.collapseFlag = true;
        this.isCollapsed();
        this.collapseFlag = false;
        this.updateClass();
        sf.base.EventHandler.add(document, TOUCHSTART_CLICK, this.onDocumentClick, this);
        this.dotNetRef.invokeMethodAsync(CREATED_EVENT, null);
        sf.base.EventHandler.add(this.element, KEYDOWN, this.onMove, this);
        window.addEventListener(RESIZE, this.reportWindowSize.bind(this), true);
        if (sf.base.Browser.isDevice) {
            sf.base.addClass([this.element], SPLIT_TOUCH);
        }
    };
    SfSplitter.prototype.onDocumentClick = function (e) {
        if (!e.target.classList.contains(SPLIT_BAR) && !sf.base.isNullOrUndefined(this.currentSeparator)) {
            sf.base.removeClass([this.currentSeparator], [SPLIT_BAR_HOVER, SPLIT_BAR_ACTIVE]);
        }
    };
    SfSplitter.prototype.updateClass = function () {
        if (sf.base.Browser.info.name === MSIE) {
            sf.base.addClass([this.element], IE);
            var allBar = this.element.querySelectorAll('.' + ROOT + ' .' + RESIZE_BAR);
            for (var i = 0; i < allBar.length; i++) {
                var separatorSize = sf.base.isNullOrUndefined(this.separatorSize) ? 1 : this.separatorSize;
                sf.base.setStyleAttribute(allBar[i], { 'padding-left': separatorSize / ORDER_NO + PX,
                    'padding-right': separatorSize / ORDER_NO + PX });
            }
        }
    };
    SfSplitter.prototype.reportWindowSize = function () {
        var _this = this;
        var paneCount = this.allPanes.length;
        for (var i = 0; i < paneCount; i++) {
            if (sf.base.isNullOrUndefined(this.paneSettings[i].size)) {
                this.allPanes[i].classList.remove(STATIC_PANE);
            }
            if (paneCount - 1 === i) {
                var staticPaneCount = this.element.querySelectorAll('.' + STATIC_PANE).length;
                if (staticPaneCount === paneCount) {
                    sf.base.removeClass([this.allPanes[i]], STATIC_PANE);
                }
            }
        }
        setTimeout(function () { _this.updateSplitterSize(true); }, 200);
    };
    SfSplitter.prototype.onMove = function (event) {
        if (this.allPanes.length > 1) {
            this.getPaneDetails();
            this.getPaneDimensions();
            var index = this.getSeparatorIndex(this.currentSeparator);
            var isPrevpaneCollapsed = this.previousPane.classList.contains(COLLAPSE_PANE);
            var isPrevpaneExpanded = this.previousPane.classList.contains(EXPAND_PANE);
            var isNextpaneCollapsed = this.nextPane.classList.contains(COLLAPSE_PANE);
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
            }
            else if (event.keyCode === 13 && this.paneSettings[index].collapsible &&
                document.activeElement.classList.contains(SPLIT_BAR)) {
                if (!this.previousPane.classList.contains(COLLAPSE_PANE)) {
                    this.collapse(index);
                    sf.base.addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
                }
                else {
                    this.expand(index);
                    sf.base.addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
                }
            }
        }
    };
    
    SfSplitter.prototype.addSeparator = function () {
        var _this = this;
        var separator;
        for (var j = 0; j < this.element.children.length; j++) {
            if (this.element.children[j].classList.contains(PANE)) {
                this.allPanes.push(this.element.children[j]);
            }
            if (this.element.children[j].classList.contains(SPLIT_BAR)) {
                this.allBars.push(this.element.children[j]);
            }
        }
        var childCount = this.allPanes.length;
        for (var i = 0; i < childCount; i++) {
            if (i < childCount - 1) {
                separator = this.allBars[i];
                this.updateIconClass();
                if (!sf.base.isNullOrUndefined(separator)) {
                    this.currentSeparator = separator;
                    this.addMouseActions(separator);
                    sf.base.EventHandler.add(this.currentSeparator, TOUCHSTART_CLICK, this.clickHandler, this);
                    separator.addEventListener(FOCUS, function () {
                        if (document.activeElement.classList.contains(SPLIT_BAR)) {
                            _this.currentSeparator = document.activeElement;
                            sf.base.addClass([_this.currentSeparator], SPLIT_BAR_ACTIVE);
                        }
                    });
                    separator.addEventListener(BLUR, function () {
                        sf.base.removeClass([_this.currentSeparator], SPLIT_BAR_ACTIVE);
                    });
                }
                if (!sf.base.isNullOrUndefined(separator)) {
                    if (this.isResizable()) {
                        sf.base.EventHandler.add(separator, MOUSEDOWN, this.onMouseDown, this);
                        var eventName = (sf.base.Browser.info.name === MSIE) ? POINTERDOWN : TOUCHSTART;
                        sf.base.EventHandler.add(separator, eventName, this.onMouseDown, this);
                        sf.base.addClass([separator], RESIZABLE_BAR);
                        this.updateResizablePanes(i);
                    }
                    else {
                        sf.base.addClass([sf.base.select('.' + RESIZE_BAR, separator)], HIDE_HANDLER);
                    }
                }
            }
            else {
                if (separator) {
                    sf.base.addClass([separator], LAST_BAR);
                }
                if (childCount > 1) {
                    this.updateResizablePanes(i);
                }
            }
        }
    };
    SfSplitter.prototype.updateResizablePanes = function (index) {
        this.getPaneDetails();
        this.isResizable() ? sf.base.addClass([this.allPanes[index]], RESIZABLE_PANE) : sf.base.addClass([this.allPanes[index]], RESIZABLE_PANE);
    };
    SfSplitter.prototype.getPaneDetails = function () {
        var prevPane = null;
        var nextPane = null;
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
    };
    SfSplitter.prototype.checkSplitPane = function (currentBar, elementIndex) {
        return this.collectPanes(currentBar.parentElement.children)[elementIndex];
    };
    SfSplitter.prototype.collectPanes = function (childNodes) {
        var elements = [];
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].classList.contains(PANE)) {
                elements.push(childNodes[i]);
            }
        }
        return elements;
    };
    SfSplitter.prototype.getPreviousPaneIndex = function () {
        return ((parseInt(this.currentSeparator.style.order, RADIX) - 1) / ORDER_NO);
    };
    SfSplitter.prototype.getNextPaneIndex = function () {
        return ((parseInt(this.currentSeparator.style.order, RADIX) - 1) / (ORDER_NO) + 1);
    };
    SfSplitter.prototype.onMouseDown = function (e) {
        e.preventDefault();
        var target = e.target;
        this.splitterDetails(e);
        if (target.classList.contains(NAVIGATE_ARROW)) {
            return;
        }
        this.updateCurrentSeparator(target);
        sf.base.addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.updateCursorPosition(e, PREVIOUS);
        this.getPaneDetails();
        var iframeElements = this.element.querySelectorAll(IFRAME);
        for (var i = 0; i < iframeElements.length; i++) {
            iframeElements[i].style.pointerEvents = NONE;
        }
        this.dotNetRef.invokeMethodAsync(RESIZE_START_EVENT, {
            event: this.getMouseEvtArgs(e),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.getDomObject(SEPARATOR, this.currentSeparator),
            cancel: false
        });
    };
    SfSplitter.prototype.getMouseEvtArgs = function (e) {
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
    
    SfSplitter.prototype.getKeyBoardEvtArgs = function (e) {
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
    
    SfSplitter.prototype.getDomObject = function (value, element) {
        if (element != null) {
            // tslint:disable-next-line
            return window.sfBlazor.getDomObject(value, element);
        }
        else {
            return null;
        }
    };
    SfSplitter.prototype.resizeEvent = function (e) {
        this.wireResizeEvents();
        this.checkPaneSize(e);
    };
    SfSplitter.prototype.checkPaneSize = function (e) {
        var prePaneSize;
        var nextPaneSize;
        var splitBarSize = sf.base.isNullOrUndefined(this.separatorSize) ? BAR_SIZE_DEFAULT : this.separatorSize;
        prePaneSize = this.orientation === HORIZONTAL ? this.previousPane.offsetWidth : this.previousPane.offsetHeight;
        nextPaneSize = this.orientation === HORIZONTAL ? this.nextPane.offsetWidth : this.nextPane.offsetHeight;
        if ((this.previousPane.style.flexBasis.indexOf('%') > 0 || this.nextPane.style.flexBasis.indexOf('%') > 0)) {
            var previousFlexBasis = this.updatePaneFlexBasis(this.previousPane);
            var nextFlexBasis = this.updatePaneFlexBasis(this.nextPane);
            this.totalPercent = previousFlexBasis + nextFlexBasis;
            this.totalWidth = this.convertPercentageToPixel(this.totalPercent + '%');
            if (e.type === KEYDOWN && (!sf.base.isNullOrUndefined(e.keyCode))) {
                if ((e.keyCode === KEY_RIGHT_ARROW ||
                    (e.keyCode === KEY_DOWN_ARROW)) && nextPaneSize > 0) {
                    this.previousPane.style.flexBasis = (previousFlexBasis + 1) + '%';
                    this.nextPane.style.flexBasis = (nextFlexBasis - 1) + '%';
                }
                else if ((e.keyCode === KEY_LEFT_ARROW ||
                    (e.keyCode === KEY_UP_ARROW)) && prePaneSize > 0) {
                    this.previousPane.style.flexBasis = (previousFlexBasis - 1) + '%';
                    this.nextPane.style.flexBasis = (nextFlexBasis + 1) + '%';
                }
            }
        }
        else {
            this.totalWidth = (this.orientation === HORIZONTAL) ? this.previousPane.offsetWidth + this.nextPane.offsetWidth :
                this.previousPane.offsetHeight + this.nextPane.offsetHeight;
            if (e.type === KEYDOWN && (!sf.base.isNullOrUndefined(e.keyCode))) {
                if ((e.keyCode === KEY_RIGHT_ARROW ||
                    (e.keyCode === KEY_DOWN_ARROW)) && nextPaneSize > 0) {
                    this.addStaticPaneClass();
                    this.previousPane.style.flexBasis = (prePaneSize + splitBarSize) + PX;
                    this.nextPane.style.flexBasis = (nextPaneSize < splitBarSize) ? ZERO_PX :
                        (nextPaneSize - splitBarSize) + PX;
                }
                else if ((e.keyCode === KEY_LEFT_ARROW ||
                    (e.keyCode === KEY_UP_ARROW)) && prePaneSize > 0) {
                    this.addStaticPaneClass();
                    this.previousPane.style.flexBasis = (prePaneSize < splitBarSize) ? ZERO_PX :
                        (prePaneSize - splitBarSize) + PX;
                    this.nextPane.style.flexBasis = (nextPaneSize + splitBarSize) + PX;
                }
            }
        }
    };
    SfSplitter.prototype.addStaticPaneClass = function () {
        if (!this.previousPane.classList.contains(STATIC_PANE)) {
            sf.base.addClass([this.previousPane], STATIC_PANE);
        }
        if (!this.nextPane.classList.contains(STATIC_PANE)) {
            sf.base.addClass([this.nextPane], STATIC_PANE);
        }
    };
    SfSplitter.prototype.convertPercentageToPixel = function (value, targetElement) {
        var percentage = value.toString();
        var convertedValue;
        if (percentage.indexOf('%') > -1) {
            convertedValue = parseFloat(percentage.slice(0, percentage.indexOf('%')));
            var offsetValue = void 0;
            if (!sf.base.isNullOrUndefined(targetElement)) {
                offsetValue = this.panesDimensions[this.allPanes.indexOf(targetElement)];
            }
            else {
                offsetValue = (this.orientation === HORIZONTAL) ? this.element.offsetWidth : this.element.offsetHeight;
            }
            convertedValue = Math.ceil(offsetValue * (convertedValue / PERCENT));
        }
        else {
            convertedValue = parseInt(percentage, RADIX);
        }
        return convertedValue;
    };
    SfSplitter.prototype.updatePaneFlexBasis = function (pane) {
        var previous;
        if (pane.style.flexBasis.indexOf('%') > 0) {
            previous = parseFloat(pane.style.flexBasis.slice(0, pane.style.flexBasis.indexOf('%')));
        }
        else {
            if (pane.style.flexBasis !== '') {
                previous = this.convertPixelToPercentage(this.convertPixelToNumber(pane.style.flexBasis));
            }
            else {
                var offset = (this.orientation === HORIZONTAL) ? (pane.offsetWidth) : (pane.offsetHeight);
                previous = this.convertPixelToPercentage(offset);
            }
        }
        return previous;
    };
    SfSplitter.prototype.convertPixelToPercentage = function (value) {
        var offsetValue = (this.orientation === HORIZONTAL) ? this.element.offsetWidth : this.element.offsetHeight;
        return (value / offsetValue) * PERCENT;
    };
    SfSplitter.prototype.convertPixelToNumber = function (value) {
        return value.indexOf('p') > -1 ? parseFloat(value.slice(0, value.indexOf('p'))) : parseFloat(value);
    };
    SfSplitter.prototype.updateCurrentSeparator = function (target) {
        this.currentSeparator = target.classList.contains(SPLIT_BAR) ? target : target.parentElement;
    };
    SfSplitter.prototype.wireResizeEvents = function () {
        sf.base.EventHandler.add(document, MOUSEMOVE, this.onMouseMove, this);
        sf.base.EventHandler.add(document, MOUSEUP, this.onMouseUp, this);
        var touchMoveEvent = (sf.base.Browser.info.name === MSIE) ? POINTERMOVE : TOUCHMOVE;
        var touchEndEvent = (sf.base.Browser.info.name === MSIE) ? POINTERUP : TOUCHEND;
        sf.base.EventHandler.add(document, touchMoveEvent, this.onMouseMove, this);
        sf.base.EventHandler.add(document, touchEndEvent, this.onMouseUp, this);
    };
    SfSplitter.prototype.unwireResizeEvents = function () {
        var touchMoveEvent = (sf.base.Browser.info.name === MSIE) ? POINTERMOVE : TOUCHMOVE;
        var touchEndEvent = (sf.base.Browser.info.name === MSIE) ? POINTERUP : TOUCHEND;
        sf.base.EventHandler.remove(document, MOUSEMOVE, this.onMouseMove);
        sf.base.EventHandler.remove(document, MOUSEUP, this.onMouseUp);
        sf.base.EventHandler.remove(document, touchMoveEvent, this.onMouseMove);
        sf.base.EventHandler.remove(document, touchEndEvent, this.onMouseUp);
        window.removeEventListener(RESIZE, this.reportWindowSize.bind(this));
    };
    SfSplitter.prototype.onMouseMove = function (e) {
        if (!this.isCursorMoved(e)) {
            return;
        }
        this.getPaneDetails();
        this.getPaneDimensions();
        this.dotNetRef.invokeMethodAsync(RESIZING_EVENT, {
            event: this.getMouseEvtArgs(e),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.getDomObject(SEPARATOR, this.currentSeparator),
            paneSize: [this.prePaneDimenson, this.nextPaneDimension]
        });
        var left = this.validateDraggedPosition(this.getSeparatorPosition(e), this.prePaneDimenson, this.nextPaneDimension);
        var separatorNewPosition;
        this.getBorder();
        if (this.orientation === HORIZONTAL) {
            separatorNewPosition = (this.element.getBoundingClientRect().left + left) -
                this.currentSeparator.getBoundingClientRect().left + this.border;
        }
        else {
            separatorNewPosition = (this.element.getBoundingClientRect().top + left) -
                this.currentSeparator.getBoundingClientRect().top + this.border;
        }
        this.nextPaneHeightWidth =
            (typeof (this.nextPaneHeightWidth) === STRING && this.nextPaneHeightWidth.indexOf('p') > -1) ?
                this.convertPixelToNumber(this.nextPaneHeightWidth) : parseInt(this.nextPaneHeightWidth, RADIX);
        this.prevPaneCurrentWidth = separatorNewPosition + this.convertPixelToNumber(this.previousPaneHeightWidth);
        this.nextPaneCurrentWidth = this.nextPaneHeightWidth - separatorNewPosition;
        this.validateMinMaxValues();
        if (this.nextPaneCurrentWidth < 0) {
            this.nextPaneCurrentWidth = 0;
        }
        /* istanbul ignore next */
        if (this.prevPaneCurrentWidth < 0) {
            this.prevPaneCurrentWidth = 0;
        }
        if ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth) > this.totalWidth) {
            if (this.nextPaneCurrentWidth < this.prevPaneCurrentWidth) {
                this.prevPaneCurrentWidth = this.prevPaneCurrentWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth)
                    - this.totalWidth);
            }
            else {
                this.nextPaneCurrentWidth = this.nextPaneCurrentWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth)
                    - this.totalWidth);
            }
        }
        /* istanbul ignore next */
        if ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth) < this.totalWidth) {
            var difference = this.totalWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth));
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + difference;
        }
        this.calculateCurrentDimensions();
        this.addStaticPaneClass();
        this.previousPane.style.flexBasis = this.prevPaneCurrentWidth;
        this.nextPane.style.flexBasis = this.nextPaneCurrentWidth;
        if (!(this.allPanes.length > ORDER_NO)) {
            this.updateSplitterSize();
        }
    };
    SfSplitter.prototype.updateSplitterSize = function (iswindowResize) {
        var totalWidth = 0;
        var flexPaneIndexes = [];
        var flexCount = 0;
        var children = this.element.children;
        for (var i = 0; i < children.length; i++) {
            totalWidth += this.orientation === HORIZONTAL ? children[i].offsetWidth :
                children[i].offsetHeight;
        }
        for (var j = 0; j < this.allBars.length; j++) {
            var cssStyles = getComputedStyle(this.allBars[j]);
            totalWidth += this.orientation === HORIZONTAL ? parseInt(cssStyles.marginLeft, RADIX) +
                parseInt(cssStyles.marginLeft, RADIX) : parseInt(cssStyles.marginTop, RADIX) +
                parseInt(cssStyles.marginBottom, RADIX);
        }
        var diff = this.orientation === HORIZONTAL ? this.element.offsetWidth -
            ((this.border * ORDER_NO) + totalWidth) :
            this.element.offsetHeight - ((this.border * ORDER_NO) + totalWidth);
        for (var i = 0; i < this.allPanes.length; i++) {
            if (!this.paneSettings[i].size && !(this.allPanes[i].innerText === '')) {
                flexPaneIndexes[flexCount] = i;
                flexCount++;
            }
        }
        var avgDiffWidth = diff / flexPaneIndexes.length;
        for (var j = 0; j < flexPaneIndexes.length; j++) {
            this.allPanes[flexPaneIndexes[j]].style.flexBasis = this.orientation === HORIZONTAL ?
                (this.allPanes[flexPaneIndexes[j]].offsetWidth + avgDiffWidth) + PX :
                (this.allPanes[flexPaneIndexes[j]].offsetHeight + avgDiffWidth) + PX;
        }
        if (this.allPanes.length === 2 && iswindowResize) {
            var paneCount = this.allPanes.length;
            var minValue = void 0;
            var paneMinRange = void 0;
            var paneIndex = 0;
            var updatePane = void 0;
            var flexPane = void 0;
            for (var i = 0; i < paneCount; i++) {
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
                        }
                        else {
                            updatePane = this.allPanes[i];
                            flexPane = this.allPanes[i - 1];
                        }
                        var sizeDiff = minValue - this.allPanes[i].offsetWidth;
                        var isPercent = updatePane.style.flexBasis.indexOf('%') > -1;
                        updatePane.style.flexBasis = isPercent ? this.convertPixelToPercentage(updatePane.offsetWidth + sizeDiff) + '%'
                            : (updatePane.offsetWidth + sizeDiff) + 'px';
                        flexPane.style.flexBasis = flexPane.style.flexBasis.indexOf('%') > -1 ?
                            this.convertPixelToPercentage(flexPane.offsetWidth - sizeDiff) + '%' : (flexPane.offsetWidth - sizeDiff) + 'px';
                    }
                }
            }
        }
    };
    SfSplitter.prototype.calcDragPosition = function (rectValue, offsetValue) {
        var separatorPosition;
        var separator;
        separatorPosition = this.orientation === HORIZONTAL ? (this.currentCoordinates.x - rectValue) :
            (this.currentCoordinates.y - rectValue);
        separator = separatorPosition / offsetValue;
        separator = (separator > 1) ? 1 : (separator < 0) ? 0 : separator;
        return separator * offsetValue;
    };
    SfSplitter.prototype.getSeparatorPosition = function (e) {
        this.updateCursorPosition(e, CURRENT);
        var rectBound = (this.orientation === HORIZONTAL) ? this.element.getBoundingClientRect().left :
            this.element.getBoundingClientRect().top + window.scrollY;
        var offSet = (this.orientation === HORIZONTAL) ? this.element.offsetWidth : this.element.offsetHeight;
        return this.calcDragPosition(rectBound, offSet);
    };
    SfSplitter.prototype.getBorder = function () {
        var border = this.orientation === HORIZONTAL ? ((this.element.offsetWidth - this.element.clientWidth) / ORDER_NO) :
            (this.element.offsetHeight - this.element.clientHeight) / ORDER_NO;
        this.border = sf.base.Browser.info.name !== CHROME ? 0 : border;
    };
    SfSplitter.prototype.validateMinMaxValues = function () {
        this.prevPaneCurrentWidth = this.validateMinRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        this.nextPaneCurrentWidth = this.validateMinRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
        this.prevPaneCurrentWidth = this.validateMaxRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        this.nextPaneCurrentWidth = this.validateMaxRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
    };
    SfSplitter.prototype.validateMinRange = function (paneIndex, paneCurrentWidth, pane) {
        var paneMinRange = null;
        var paneMinDimensions;
        var difference = 0;
        var validatedVal;
        if (!sf.base.isNullOrUndefined(this.paneSettings[paneIndex]) && !sf.base.isNullOrUndefined(this.paneSettings[paneIndex].min)) {
            paneMinRange = this.paneSettings[paneIndex].min.toString();
        }
        if (!sf.base.isNullOrUndefined(paneMinRange)) {
            if (paneMinRange.indexOf('%') > 0) {
                paneMinRange = this.convertPercentageToPixel(paneMinRange).toString();
            }
            paneMinDimensions = this.convertPixelToNumber(paneMinRange);
            if (paneCurrentWidth < paneMinDimensions) {
                difference = (paneCurrentWidth - paneMinDimensions) <= 0 ? 0 :
                    (paneCurrentWidth - paneMinDimensions);
                this.totalWidth = this.totalWidth - difference;
                this.totalPercent = this.convertPixelToPercentage(this.totalWidth);
                validatedVal = paneMinDimensions;
            }
        }
        return sf.base.isNullOrUndefined(validatedVal) ? paneCurrentWidth : validatedVal;
    };
    SfSplitter.prototype.validateMaxRange = function (paneIndex, paneCurrentWidth, pane) {
        var paneMaxRange = null;
        var paneMaxDimensions;
        var validatedVal;
        if (!sf.base.isNullOrUndefined(this.paneSettings[paneIndex]) && !sf.base.isNullOrUndefined(this.paneSettings[paneIndex].max)) {
            paneMaxRange = this.paneSettings[paneIndex].max.toString();
        }
        if (!sf.base.isNullOrUndefined(paneMaxRange)) {
            if (paneMaxRange.indexOf('%') > 0) {
                paneMaxRange = this.convertPercentageToPixel(paneMaxRange).toString();
            }
            paneMaxDimensions = this.convertPixelToNumber(paneMaxRange);
            if (paneCurrentWidth > paneMaxDimensions) {
                this.totalWidth = this.totalWidth - (paneCurrentWidth - paneMaxDimensions);
                this.totalPercent = this.convertPixelToPercentage(this.totalWidth);
                validatedVal = paneMaxDimensions;
            }
        }
        return sf.base.isNullOrUndefined(validatedVal) ? paneCurrentWidth : validatedVal;
    };
    SfSplitter.prototype.calculateCurrentDimensions = function () {
        if (this.updatePrePaneInPercentage || this.updateNextPaneInPercentage) {
            this.prevPaneCurrentWidth = Math.round(Number(Math.round(this.convertPixelToPercentage(this.prevPaneCurrentWidth)
                * RADIX) / RADIX));
            this.nextPaneCurrentWidth = Math.round(Number(Math.round(this.convertPixelToPercentage(this.nextPaneCurrentWidth)
                * RADIX) / RADIX));
            if (this.prevPaneCurrentWidth === 0) {
                this.nextPaneCurrentWidth = this.totalPercent;
            }
            if (this.nextPaneCurrentWidth === 0) {
                this.prevPaneCurrentWidth = this.totalPercent;
            }
            if (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth !== this.totalPercent) {
                this.equatePaneWidths();
            }
            else {
                this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + '%';
                this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + '%';
            }
            this.prevPaneCurrentWidth = (this.updatePrePaneInPercentage) ? this.prevPaneCurrentWidth :
                this.convertPercentageToPixel(this.prevPaneCurrentWidth) + 'px';
            this.nextPaneCurrentWidth = (this.updateNextPaneInPercentage) ? this.nextPaneCurrentWidth :
                this.convertPercentageToPixel(this.nextPaneCurrentWidth) + 'px';
            this.updatePrePaneInPercentage = false;
            this.updateNextPaneInPercentage = false;
        }
        else {
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + 'px';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + 'px';
        }
    };
    SfSplitter.prototype.equatePaneWidths = function () {
        var difference;
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
    };
    SfSplitter.prototype.validateDraggedPosition = function (draggedPos, prevPaneHeightWidth, nextPaneHeightWidth) {
        var separatorTopLeft = (this.orientation === HORIZONTAL) ? this.currentSeparator.offsetLeft :
            this.currentSeparator.offsetTop;
        var prePaneRange = separatorTopLeft - prevPaneHeightWidth;
        var nextPaneRange = nextPaneHeightWidth + separatorTopLeft;
        var pane1MinSize = this.getMinMax(this.prevPaneIndex, MIN);
        var pane2MinSize = this.getMinMax(this.nextPaneIndex, MIN);
        var pane1MaxSize = this.getMinMax(this.prevPaneIndex, MAX);
        var pane2MaxSize = this.getMinMax(this.nextPaneIndex, MAX);
        var validatedSize = draggedPos;
        if (draggedPos > nextPaneRange - pane2MinSize) {
            validatedSize = nextPaneRange - pane2MinSize;
        }
        else if (draggedPos < prePaneRange + pane1MinSize) {
            validatedSize = prePaneRange + pane1MinSize;
        }
        if (!sf.base.isNullOrUndefined(pane1MaxSize)) {
            if (draggedPos > prePaneRange + pane1MaxSize) {
                validatedSize = prePaneRange + pane1MaxSize;
            }
        }
        else if (!sf.base.isNullOrUndefined(pane2MaxSize)) {
            if (draggedPos < nextPaneRange - pane2MaxSize) {
                validatedSize = nextPaneRange - pane2MaxSize;
            }
        }
        return validatedSize;
    };
    SfSplitter.prototype.getMinMax = function (paneIndex, selection) {
        var defaultVal = selection === MIN ? 0 : null;
        // tslint:disable-next-line
        var paneValue = null;
        if (selection === MIN) {
            if (!sf.base.isNullOrUndefined(this.paneSettings[paneIndex]) &&
                !sf.base.isNullOrUndefined(this.paneSettings[paneIndex].min)) {
                paneValue = this.paneSettings[paneIndex].min;
            }
        }
        else {
            if (!sf.base.isNullOrUndefined(this.paneSettings[paneIndex]) &&
                !sf.base.isNullOrUndefined(this.paneSettings[paneIndex].max)) {
                paneValue = this.paneSettings[paneIndex].max;
            }
        }
        if (this.paneSettings.length > 0 && !sf.base.isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !sf.base.isNullOrUndefined(paneValue)) {
            if (paneValue.indexOf('%') > 0) {
                paneValue = this.convertPercentageToPixel(paneValue).toString();
            }
            return this.convertPixelToNumber(paneValue);
        }
        else {
            return defaultVal;
        }
    };
    SfSplitter.prototype.isValidSize = function (paneIndex) {
        var isValid;
        if (!sf.base.isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !sf.base.isNullOrUndefined(this.paneSettings[paneIndex].size) &&
            this.paneSettings[paneIndex].size.indexOf('%') > -1) {
            isValid = true;
        }
        return isValid;
    };
    SfSplitter.prototype.getPaneDimensions = function () {
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
    };
    SfSplitter.prototype.getPaneHeight = function (pane) {
        return ((this.orientation === HORIZONTAL) ? pane.offsetWidth.toString() :
            pane.offsetHeight.toString());
    };
    SfSplitter.prototype.isCursorMoved = function (e) {
        var cursorMoved = true;
        if (this.getEventType(e.type) === MOUSE || (!sf.base.isNullOrUndefined(e.pointerType)) &&
            this.getEventType(e.pointerType) === MOUSE) {
            cursorMoved = this.checkCoordinates(e.pageX, e.pageY);
        }
        else {
            cursorMoved = (sf.base.Browser.info.name !== MSIE) ?
                this.checkCoordinates(e.touches[0].pageX, e.touches[0].pageY) :
                this.checkCoordinates(e.pageX, e.pageY);
        }
        return cursorMoved;
    };
    SfSplitter.prototype.checkCoordinates = function (pageX, pageY) {
        var coordinatesChanged = true;
        if ((pageX === this.previousCoordinates.x || pageY === this.previousCoordinates.y)) {
            coordinatesChanged = false;
        }
        return coordinatesChanged;
    };
    SfSplitter.prototype.onMouseUp = function (e) {
        sf.base.removeClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.unwireResizeEvents();
        for (var i = 0; i < this.element.querySelectorAll(IFRAME).length; i++) {
            this.element.querySelectorAll(IFRAME)[i].style.pointerEvents = AUTO;
        }
        this.getPaneDimensions();
        this.dotNetRef.invokeMethodAsync(RESIZESTOP_EVENT, {
            event: this.getMouseEvtArgs(e),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.getDomObject(SEPARATOR, this.currentSeparator),
            paneSize: [this.prePaneDimenson, this.nextPaneDimension]
        });
    };
    SfSplitter.prototype.isMouseEvent = function (e) {
        var isMouse;
        if (this.getEventType(e.type) === MOUSE || (!sf.base.isNullOrUndefined(e.pointerType) &&
            this.getEventType(e.pointerType) === MOUSE)) {
            isMouse = true;
        }
        return isMouse;
    };
    SfSplitter.prototype.getEventType = function (e) {
        return (e.indexOf(MOUSE) > -1) ? MOUSE : TOUCH;
    };
    SfSplitter.prototype.updateCursorPosition = function (e, type) {
        if (this.isMouseEvent(e)) {
            this.changeCoordinates({ x: e.pageX, y: e.pageY }, type);
        }
        else {
            var eventType = sf.base.Browser.info.name !== MSIE ? e.touches[0] : e;
            this.changeCoordinates({ x: eventType.pageX, y: eventType.pageY }, type);
        }
    };
    SfSplitter.prototype.changeCoordinates = function (coordinates, type) {
        type === PREVIOUS ? this.previousCoordinates = coordinates : this.currentCoordinates = coordinates;
    };
    SfSplitter.prototype.isResizable = function () {
        var resizable;
        var nextPaneIndex = this.getNextPaneIndex();
        var prevPaneIndex = this.getPreviousPaneIndex();
        if ((!sf.base.isNullOrUndefined(this.paneSettings[prevPaneIndex]) &&
            this.paneSettings[prevPaneIndex].resizable &&
            !sf.base.isNullOrUndefined(this.paneSettings[nextPaneIndex]) &&
            this.paneSettings[nextPaneIndex].resizable) ||
            sf.base.isNullOrUndefined(this.paneSettings[nextPaneIndex])) {
            resizable = true;
        }
        return resizable;
    };
    SfSplitter.prototype.clickHandler = function (e) {
        if (!e.target.classList.contains(NAVIGATE_ARROW)) {
            var hoverBars = sf.base.selectAll('.' + ROOT + ' > .' + SPLIT_BAR + '.' + SPLIT_BAR_HOVER);
            if (hoverBars.length > 0) {
                sf.base.removeClass(hoverBars, SPLIT_BAR_HOVER);
            }
            sf.base.addClass([e.target], SPLIT_BAR_HOVER);
        }
        this.updateIconClass();
        var icon = e.target;
        if (icon.classList.contains(ARROW_LEFT) || icon.classList.contains(ARROW_UP)) {
            this.collapseAction(e);
        }
        if (icon.classList.contains(ARROW_RIGHT) || icon.classList.contains(ARROW_DOWN)) {
            this.expandAction(e);
        }
        var totalWidth = 0;
        var children = this.element.children;
        for (var i = 0; i < children.length; i++) {
            totalWidth += this.orientation === HORIZONTAL ? children[i].offsetWidth :
                children[i].offsetHeight;
        }
        if (totalWidth > this.element.offsetWidth) {
            this.updateSplitterSize();
        }
    };
    SfSplitter.prototype.collapseAction = function (e) {
        this.splitterDetails(e);
        if (this.collapseFlag) {
            this.collapsePane(e);
        }
        else {
            this.dotNetRef.invokeMethodAsync(ONCOLLAPSED_EVENT, -1, {
                event: this.getMouseEvtArgs(e),
                index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
                cancel: false,
            });
        }
    };
    SfSplitter.prototype.onCollapseEvent = function (e) {
        var iconClass = this.orientation === HORIZONTAL ? ARROW_LEFT : ARROW_UP;
        var targetEle = this.allBars[e.index[0]].querySelector('.' + iconClass);
        var event = {
            target: targetEle
        };
        this.collapsePane(event);
        this.dotNetRef.invokeMethodAsync(COLLAPSED_EVENT, {
            event: this.getMouseEvtArgs(e),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()]
        });
    };
    SfSplitter.prototype.collapsePane = function (e) {
        var collapseCount = this.element.querySelectorAll('.' + COLLAPSE_PANE).length;
        var nextPaneSibling = this.nextPane.nextElementSibling;
        var flexStatus = (this.previousPane.classList.contains(STATIC_PANE) &&
            !this.previousPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE) &&
            nextPaneSibling.classList.contains(PANE) &&
            !nextPaneSibling.classList.contains(STATIC_PANE) &&
            !nextPaneSibling.classList.contains(COLLAPSE_PANE) &&
            !(collapseCount === this.allPanes.length - 2))
            || (this.nextPane.classList.contains(COLLAPSE_PANE) && !this.previousPane.classList.contains(STATIC_PANE)
                && this.nextPane.classList.contains(STATIC_PANE));
        var collapseClass = [COLLAPSE_PANE, PANE_HIDDEN];
        if (this.nextPane.classList.contains(COLLAPSE_PANE)) {
            sf.base.removeClass([this.previousPane], EXPAND_PANE);
            sf.base.removeClass([this.nextPane], collapseClass);
            if (!this.collapseFlag) {
                this.updatePaneSettings(this.nextPaneIndex, false);
            }
        }
        else {
            sf.base.removeClass([this.previousPane], EXPAND_PANE);
            sf.base.removeClass([this.nextPane], collapseClass);
            sf.base.addClass([this.nextPane], EXPAND_PANE);
            sf.base.addClass([this.previousPane], collapseClass);
            if (!this.collapseFlag) {
                this.updatePaneSettings(this.prevPaneIndex, true);
            }
        }
        this.updateIconsOnCollapse(e);
        this.previousPane.setAttribute(ARIA_EXPANDED, FALSE);
        this.nextPane.setAttribute(ARIA_EXPANDED, TRUE);
        this.updateFlexGrow(this.checkStaticPanes());
        if (flexStatus) {
            sf.base.removeClass([this.nextPane], EXPAND_PANE);
            this.nextPane.style.flexGrow = '';
        }
    };
    SfSplitter.prototype.updateIconsOnCollapse = function (e) {
        this.splitterProperty();
        if (this.previousPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE)) {
            sf.base.addClass([e.target], HIDE_ICON);
            if (this.paneSettings[this.prevPaneIndex].collapsible) {
                sf.base.removeClass([sf.base.select('.' + this.arrow, this.currentSeparator)], HIDE_ICON);
            }
            this.resizableModel(this.currentBarIndex, false);
            if (this.previousPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE) &&
                !this.paneSettings[this.prevPaneIndex].collapsible) {
                this.hideTargetBarIcon(this.prevBar, this.rightArrow);
            }
            if (this.previousPane.previousElementSibling && !this.previousPane.previousElementSibling.classList.contains(COLLAPSE_PANE)) {
                if (this.previousPane.classList.contains(COLLAPSE_PANE) && this.paneSettings[this.prevPaneIndex].collapsible) {
                    this.showTargetBarIcon(this.prevBar, this.leftArrow);
                }
                else if (!this.paneSettings[this.prevPaneIndex].collapsible) {
                    this.hideTargetBarIcon(this.prevBar, this.leftArrow);
                }
            }
            if (!sf.base.isNullOrUndefined(this.prevBar)) {
                this.resizableModel(this.currentBarIndex - 1, false);
                this.hideTargetBarIcon(this.prevBar, this.arrow);
            }
            if (!this.paneSettings[this.prevPaneIndex].collapsible) {
                this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
            }
        }
        else if (!this.splitInstance.prevPaneCollapsed && !this.splitInstance.nextPaneExpanded) {
            if (this.paneSettings[this.currentBarIndex].resizable) {
                this.resizableModel(this.currentBarIndex, true);
            }
            if (!this.splitInstance.nextPaneNextEle.classList.contains(COLLAPSE_PANE) &&
                this.paneSettings[this.currentBarIndex + 1].resizable) {
                this.resizableModel(this.currentBarIndex + 1, true);
            }
            if (!this.paneSettings[this.currentBarIndex].collapsible) {
                sf.base.addClass([e.target], HIDE_ICON);
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
            if (!sf.base.isNullOrUndefined(this.nextBar)) {
                if (this.nextPane.nextElementSibling && (this.nextPane.nextElementSibling.classList.contains(COLLAPSE_PANE) &&
                    this.paneSettings[this.nextPaneIndex + 1].collapsible) ||
                    (!this.nextPane.nextElementSibling.classList.contains(COLLAPSE_PANE) &&
                        this.paneSettings[this.nextPaneIndex].collapsible)) {
                    this.showTargetBarIcon(this.nextBar, this.leftArrow);
                }
                else if (!this.paneSettings[this.splitInstance.nextPaneIndex + 1].collapsible &&
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
    };
    SfSplitter.prototype.expandAction = function (e) {
        this.splitterDetails(e);
        if (this.expandFlag) {
            this.dotNetRef.invokeMethodAsync(ONEXPAND_EVENT, {
                event: this.getMouseEvtArgs(e),
                index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
                cancel: false
            });
        }
        else {
            this.expandPane(e);
        }
    };
    SfSplitter.prototype.onExpandEvent = function (e) {
        var iconClass = this.orientation === HORIZONTAL ? ARROW_RIGHT : ARROW_DOWN;
        var targetEle = this.allBars[e.index[0]].querySelector('.' + iconClass);
        var event = {
            target: targetEle
        };
        this.expandPane(event);
        this.dotNetRef.invokeMethodAsync(EXPANDED_EVENT, {
            event: this.getMouseEvtArgs(e),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()]
        });
    };
    SfSplitter.prototype.getSeparatorIndex = function (target) {
        var separator = this.orientation === HORIZONTAL ? SPLIT_H_BAR : SPLIT_V_BAR;
        if (this.allBars.length < 1) {
            this.allBars = sf.base.selectAll('.' + separator, this.element);
        }
        var array = [].slice.call(this.allBars);
        return array.indexOf(target);
    };
    SfSplitter.prototype.updateBars = function (index) {
        this.prevBar = this.allBars[(index - 1)];
        this.nextBar = this.allBars[(index + 1)];
    };
    SfSplitter.prototype.splitterDetails = function (e) {
        if (this.element.classList.contains(HORIZONTAL_PANE)) {
            this.orientation = HORIZONTAL;
            this.arrow = e.target.classList.contains(ARROW_LEFT) ? ARROW_RIGHT : ARROW_LEFT;
        }
        else {
            this.orientation = VERTICAL;
            this.arrow = e.target.classList.contains(ARROW_UP) ? ARROW_DOWN : ARROW_UP;
        }
        this.updateCurrentSeparator(e.target);
        this.currentBarIndex = this.getSeparatorIndex(e.target.parentElement);
        this.updateBars(this.currentBarIndex);
        this.getPaneDetails();
    };
    SfSplitter.prototype.expandPane = function (e) {
        var collapseCount = this.element.querySelectorAll('.' + COLLAPSE_PANE).length;
        var flexStatus = (!this.previousPane.classList.contains(COLLAPSE_PANE) &&
            this.previousPane.classList.contains(STATIC_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE) &&
            !this.nextPane.classList.contains(EXPAND_PANE) && this.nextPane.nextElementSibling.classList.contains(PANE) &&
            !this.nextPane.nextElementSibling.classList.contains(STATIC_PANE) && !(collapseCount === this.allPanes.length - ORDER_NO));
        var collapseClass = [COLLAPSE_PANE, PANE_HIDDEN];
        if (!this.previousPane.classList.contains(COLLAPSE_PANE)) {
            sf.base.removeClass([this.nextPane], EXPAND_PANE);
            sf.base.removeClass([this.previousPane], collapseClass);
            sf.base.addClass([this.previousPane], EXPAND_PANE);
            sf.base.addClass([this.nextPane], collapseClass);
            if (this.expandFlag) {
                this.updatePaneSettings(this.nextPaneIndex, true);
            }
        }
        else {
            sf.base.removeClass([this.previousPane], collapseClass);
            sf.base.removeClass([this.nextPane], EXPAND_PANE);
            if (this.expandFlag) {
                this.updatePaneSettings(this.prevPaneIndex, false);
            }
        }
        this.updateIconsOnExpand(e);
        this.previousPane.setAttribute(ARIA_EXPANDED, TRUE);
        this.nextPane.setAttribute(ARIA_EXPANDED, FALSE);
        this.updateFlexGrow(this.checkStaticPanes());
        if (flexStatus) {
            sf.base.removeClass([this.previousPane], EXPAND_PANE);
            this.previousPane.style.flexGrow = '';
        }
    };
    SfSplitter.prototype.checkStaticPanes = function () {
        var staticPane = true;
        for (var i = 0; i < this.allPanes.length; i++) {
            if (!this.allPanes[i].classList.contains(COLLAPSE_PANE) && staticPane) {
                staticPane = this.allPanes[i].classList.contains(STATIC_PANE) ? true : false;
            }
        }
        return staticPane;
    };
    SfSplitter.prototype.splitterProperty = function () {
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
            nextPaneNextEle: this.nextPane.nextElementSibling,
            prevPanePreEle: this.previousPane.previousElementSibling,
        };
    };
    SfSplitter.prototype.updateIconsOnExpand = function (e) {
        this.splitterProperty();
        sf.base.addClass([e.target], HIDE_ICON);
        if (!this.splitInstance.prevPaneExpanded && !this.splitInstance.nextPaneCollapsed) {
            if (this.paneSettings[this.prevPaneIndex].collapsible) {
                sf.base.removeClass([sf.base.select('.' + this.arrow, this.currentSeparator)], HIDE_ICON);
            }
            if (this.paneSettings[this.nextPaneIndex].collapsible) {
                sf.base.removeClass([e.target], HIDE_ICON);
            }
            if (this.paneSettings[this.currentBarIndex].resizable) {
                this.resizableModel(this.currentBarIndex, true);
            }
            if (!sf.base.isNullOrUndefined(this.prevBar) &&
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
                }
                else if (this.paneSettings[this.currentBarIndex].collapsible &&
                    !this.paneSettings[this.currentBarIndex + 1].collapsible) {
                    this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                }
            }
            else {
                if (this.previousPane.previousElementSibling && this.paneSettings[this.prevPaneIndex].collapsible &&
                    (this.previousPane.previousElementSibling.classList.contains(COLLAPSE_PANE) &&
                        this.paneSettings[this.prevPaneIndex - 1].collapsible)) {
                    this.showTargetBarIcon(this.prevBar, this.rightArrow);
                }
                if (!this.paneSettings[this.currentBarIndex + 1].collapsible) {
                    this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
                }
            }
        }
        else if (this.splitInstance.prevPaneExpanded && this.splitInstance.nextPaneCollapsed) {
            this.resizableModel(this.currentBarIndex, false);
            this.resizableModel(this.currentBarIndex + 1, false);
            if (this.paneSettings[this.nextPaneIndex].collapsible) {
                sf.base.removeClass([sf.base.select('.' + this.arrow, this.currentSeparator)], HIDE_ICON);
            }
            if (!sf.base.isNullOrUndefined(this.nextBar)) {
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
    };
    SfSplitter.prototype.showResizer = function (target) {
        if (!sf.base.isNullOrUndefined(this.previousPane) && this.previousPane.classList.contains(RESIZABLE_PANE) &&
            !sf.base.isNullOrUndefined(this.nextPane) && this.nextPane.classList.contains(RESIZABLE_PANE)) {
            sf.base.removeClass([sf.base.select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
        }
    };
    SfSplitter.prototype.resizableModel = function (index, newVal) {
        var paneIndex;
        var i = index;
        paneIndex = (index === (this.allBars.length)) ? (index - 1) : index;
        sf.base.EventHandler.remove(this.allBars[paneIndex], MOUSEDOWN, this.onMouseDown);
        if (newVal) {
            sf.base.EventHandler.add(this.allBars[paneIndex], MOUSEDOWN, this.onMouseDown, this);
            if (this.isResizable()) {
                this.showResizer(this.allBars[paneIndex]);
                sf.base.removeClass([sf.base.select('.' + RESIZE_BAR, this.allBars[paneIndex])], HIDE_HANDLER);
                sf.base.addClass([this.allBars[paneIndex]], RESIZABLE_BAR);
                (index === (this.allBars.length)) ? sf.base.addClass([this.allPanes[index]], RESIZABLE_PANE) :
                    sf.base.addClass([this.allPanes[paneIndex]], RESIZABLE_PANE);
                this.updateResizablePanes(i);
            }
        }
        else {
            this.updateResizablePanes(i);
            sf.base.addClass([sf.base.select('.' + RESIZE_BAR, this.allBars[paneIndex])], HIDE_HANDLER);
            sf.base.removeClass([this.allBars[paneIndex]], RESIZABLE_BAR);
            if (index === this.allBars.length) {
                sf.base.removeClass([this.allPanes[index]], RESIZABLE_PANE);
            }
            else {
                sf.base.removeClass([this.allPanes[paneIndex]], RESIZABLE_PANE);
            }
        }
    };
    SfSplitter.prototype.hideTargetBarIcon = function (targetBar, targetArrow) {
        sf.base.addClass([sf.base.select('.' + targetArrow, targetBar)], HIDE_ICON);
    };
    SfSplitter.prototype.showTargetBarIcon = function (targetBar, targetArrow) {
        sf.base.removeClass([sf.base.select('.' + targetArrow, targetBar)], HIDE_ICON);
    };
    SfSplitter.prototype.updateFlexGrow = function (status) {
        var panes = this.allPanes;
        for (var i = 0; i < panes.length; i++) {
            panes[i].style.flexGrow = panes[i].classList.contains(EXPAND_PANE) ?
                FLEX_ONE : panes[i].classList.contains(COLLAPSE_PANE) ? FLEX_ZERO : FLEX_EMPTY;
            if (status && !this.nextPane.classList.contains(COLLAPSE_PANE)) {
                this.nextPane.style.flexGrow = FLEX_ONE;
            }
        }
    };
    SfSplitter.prototype.updatePaneSettings = function (index, collapsed) {
        this.paneSettings[index].collapsed = collapsed;
        this.dotNetRef.invokeMethodAsync(UPDATE_COLLAPSED, index, collapsed);
    };
    SfSplitter.prototype.addMouseActions = function (separator) {
        var _this = this;
        var sTout;
        var hoverTimeOut;
        separator.addEventListener(MOUSEENTER, function () {
            /* istanbul ignore next */
            sTout = setTimeout(function () { sf.base.addClass([separator], [SPLIT_BAR_HOVER]); }, _this.iconsDelay);
        });
        separator.addEventListener(MOUSELEAVE, function () {
            clearTimeout(sTout);
            sf.base.removeClass([separator], [SPLIT_BAR_HOVER]);
        });
        separator.addEventListener(MOUSEOUT, function () {
            clearTimeout(hoverTimeOut);
        });
        separator.addEventListener(MOUSEOVER, function () {
            /* istanbul ignore next */
            hoverTimeOut = setTimeout(function () { sf.base.addClass([separator], [SPLIT_BAR_HOVER]); }, _this.iconsDelay);
        });
    };
    SfSplitter.prototype.updateIconClass = function () {
        if (this.orientation === HORIZONTAL) {
            this.leftArrow = ARROW_LEFT;
            this.rightArrow = ARROW_RIGHT;
        }
        else {
            this.leftArrow = ARROW_UP;
            this.rightArrow = ARROW_DOWN;
        }
    };
    SfSplitter.prototype.isCollapsed = function (index) {
        if (!sf.base.isNullOrUndefined(index) && this.paneSettings[index].collapsed
            && sf.base.isNullOrUndefined(this.allPanes[index].classList.contains(COLLAPSE_PANE))) {
            return;
        }
        this.expandFlag = false;
        if (!sf.base.isNullOrUndefined(index)) {
            this.collapseFlag = true;
            var targetEle = void 0;
            var lastBarIndex = (index === this.allBars.length);
            var barIndex = lastBarIndex ? index - 1 : index;
            if (!lastBarIndex && this.allPanes[index + 1].classList.contains(COLLAPSE_PANE) && index !== 0) {
                targetEle = this.collapseArrow(barIndex - 1, this.targetArrows().lastBarArrow);
            }
            else {
                targetEle = (lastBarIndex) ? this.collapseArrow(barIndex, this.targetArrows().lastBarArrow) :
                    this.collapseArrow(barIndex, this.targetArrows().collapseArrow);
            }
            var event_1 = { target: targetEle };
            this.splitterDetails(event_1);
            this.dotNetRef.invokeMethodAsync(ONCOLLAPSED_EVENT, index, {
                index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
                cancel: false
            });
        }
        else {
            for (var m = 0; m < this.allPanes.length; m++) {
                if (!sf.base.isNullOrUndefined(this.paneSettings[m]) && this.paneSettings[m].collapsed) {
                    this.updateIsCollapsed(m, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
                }
            }
            for (var m = this.allPanes.length - 1; m >= 0; m--) {
                if (!sf.base.isNullOrUndefined(this.paneSettings[m]) && this.paneSettings[m].collapsed &&
                    !this.allPanes[m].classList.contains(COLLAPSE_PANE)) {
                    var collapseArrow = this.orientation === HORIZONTAL ? ARROW_RIGHT : ARROW_DOWN;
                    if (m !== 0) {
                        var targetEle = this.collapseArrow(m - 1, collapseArrow);
                        targetEle.click();
                    }
                    if (!this.nextPane.classList.contains(COLLAPSE_PANE)) {
                        var targetEle = this.collapseArrow(m - 1, collapseArrow);
                        targetEle.click();
                    }
                }
            }
        }
        this.expandFlag = true;
    };
    SfSplitter.prototype.collapseMethodEvent = function (index, e) {
        this.expandFlag = false;
        var collapsedindex = [];
        collapsedindex[0] = index;
        var j = 1;
        for (var i = 0; i < this.allPanes.length; i++) {
            if (this.allPanes[i].classList.contains(COLLAPSE_PANE)) {
                collapsedindex[j] = i;
                j++;
            }
        }
        collapsedindex = collapsedindex.sort();
        this.updateIsCollapsed(index, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
        for (var i = 0; i < collapsedindex.length; i++) {
            if (!this.allPanes[collapsedindex[i]].classList.contains(COLLAPSE_PANE)) {
                this.updateIsCollapsed(collapsedindex[i], this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
            }
        }
        for (var i = collapsedindex.length; i > 0; i--) {
            if (!this.allPanes[collapsedindex[i - 1]].classList.contains(COLLAPSE_PANE)) {
                var targetArrow = this.targetArrows();
                this.updateIsCollapsed(collapsedindex[i - 1], targetArrow.collapseArrow, targetArrow.lastBarArrow);
            }
        }
        this.dotNetRef.invokeMethodAsync(COLLAPSED_EVENT, {
            event: this.getMouseEvtArgs(e),
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
        });
        this.collapseFlag = false;
        this.expandFlag = true;
    };
    SfSplitter.prototype.expand = function (index) {
        this.collapsedOnchange(index);
        this.updatePaneSettings(index, false);
    };
    SfSplitter.prototype.collapse = function (index) {
        this.isCollapsed(index);
        this.updatePaneSettings(index, true);
    };
    SfSplitter.prototype.collapsedOnchange = function (index) {
        if (!sf.base.isNullOrUndefined(this.paneSettings[index]) && !sf.base.isNullOrUndefined(this.paneSettings[index].collapsed)
            && this.allPanes[index].classList.contains(COLLAPSE_PANE)) {
            this.updateIsCollapsed(index, this.targetArrows().lastBarArrow, this.targetArrows().collapseArrow);
        }
    };
    SfSplitter.prototype.collapsibleModelUpdate = function (index) {
        var arrow2;
        var arrow1;
        var paneIndex;
        paneIndex = index === (this.allBars.length) ? (index - 1) : index;
        arrow2 = (this.orientation === HORIZONTAL) ? this.checkArrow(paneIndex, ARROW_LEFT) : this.checkArrow(paneIndex, ARROW_UP);
        arrow1 = (this.orientation === HORIZONTAL) ? this.checkArrow(paneIndex, ARROW_RIGHT) : this.checkArrow(paneIndex, ARROW_DOWN);
        this.paneCollapsible(this.allPanes[index], index);
        this.updateCollapseIcons(paneIndex, arrow1, arrow2);
    };
    SfSplitter.prototype.updateCollapseIcons = function (index, arrow1, arrow2) {
        if (!sf.base.isNullOrUndefined(this.paneSettings[index])) {
            if (!sf.base.isNullOrUndefined(this.paneSettings[index].collapsible)) {
                this.paneSettings[index].collapsible ? sf.base.removeClass([arrow2], [HIDE_ICON]) : sf.base.addClass([arrow2], [HIDE_ICON]);
                if (!sf.base.isNullOrUndefined(this.paneSettings[index + 1])) {
                    this.paneSettings[index + 1].collapsible ? sf.base.removeClass([arrow1], [HIDE_ICON]) : sf.base.addClass([arrow1], [HIDE_ICON]);
                }
            }
        }
    };
    SfSplitter.prototype.checkArrow = function (paneIndex, targetArrow) {
        return (this.allBars[paneIndex].querySelector('.' + NAVIGATE_ARROW + '.' + targetArrow));
    };
    SfSplitter.prototype.paneCollapsible = function (pane, index) {
        this.paneSettings[index].collapsible ? sf.base.addClass([pane], COLLAPSIBLE) : sf.base.removeClass([pane], COLLAPSIBLE);
    };
    SfSplitter.prototype.propertyChanged = function (splitObj, changedArgs) {
        sf.base.extend(this, this, splitObj);
        this.updateClass();
        if (changedArgs) {
            for (var i = 0; i <= Object.keys(changedArgs).length; i++) {
                var key = parseInt(Object.keys(changedArgs)[i], RADIX);
                if (Object(changedArgs)[key]) {
                    for (var j = 0; j < Object(changedArgs)[key].length; j++) {
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
                    }
                }
            }
        }
    };
    SfSplitter.prototype.targetArrows = function () {
        this.splitterProperty();
        return {
            collapseArrow: (this.orientation === HORIZONTAL) ? ARROW_LEFT : ARROW_UP,
            lastBarArrow: (this.orientation === VERTICAL) ? ARROW_DOWN : ARROW_RIGHT
        };
    };
    SfSplitter.prototype.collapseArrow = function (barIndex, arrow) {
        return sf.base.selectAll('.' + arrow, this.allBars[barIndex])[0];
    };
    SfSplitter.prototype.updateIsCollapsed = function (index, collapseArrow, lastBarArrow) {
        if (!sf.base.isNullOrUndefined(index)) {
            var targetEle = void 0;
            var lastBarIndex = (index === this.allBars.length);
            var barIndex = lastBarIndex ? index - 1 : index;
            if (!lastBarIndex && this.allPanes[index + 1].classList.contains(COLLAPSE_PANE) && index !== 0) {
                targetEle = this.collapseArrow(barIndex - 1, lastBarArrow);
            }
            else {
                targetEle = (lastBarIndex) ? this.collapseArrow(barIndex, lastBarArrow) : this.collapseArrow(barIndex, collapseArrow);
            }
            targetEle.click();
        }
    };
    SfSplitter.prototype.destroy = function () {
        sf.base.EventHandler.remove(document, TOUCHSTART_CLICK, this.onDocumentClick);
        while (this.element.attributes.length > 0) {
            this.element.removeAttribute(this.element.attributes[0].name);
        }
        var splitNodes = this.element.children;
        for (var i = splitNodes.length - 1; i >= 0; i--) {
            sf.base.detach(splitNodes[i]);
        }
    };
    return SfSplitter;
}());
// tslint:disable-next-line
var Splitter = {
    initialize: function (element, options, dotnetRef) {
        new SfSplitter(element, options, dotnetRef);
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.initialize();
        }
    },
    collapse: function (element, index) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.collapse(index);
        }
    },
    expand: function (element, index) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.expand(index);
        }
    },
    resizeEvent: function (element, e) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.resizeEvent(e);
        }
    },
    onCollapseEvent: function (element, event) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.onCollapseEvent(event);
        }
    },
    collapseMethodEvent: function (element, event, index) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.collapseMethodEvent(index, event);
        }
    },
    onExpandEvent: function (element, event) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.onExpandEvent(event);
        }
    },
    destroy: function (element) {
        if (!sf.base.isNullOrUndefined(element)) {
            element.blazor__instance.destroy();
        }
    },
    propertyChanged: function (splitObj, changedArgs) {
        if (!sf.base.isNullOrUndefined(splitObj.element)) {
            splitObj.element.blazor__instance.propertyChanged(splitObj, changedArgs);
        }
    }
};

return Splitter;

}());
