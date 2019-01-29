import { Browser, ChildProperty, Collection, Component, Draggable, Event, EventHandler, NotifyPropertyChanges, Property, addClass, append, compile, detach, formatUnit, isNullOrUndefined, isUndefined, removeClass, select, selectAll, setStyleAttribute } from '@syncfusion/ej2-base';

var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const ROOT = 'e-splitter';
const HORIZONTAL_PANE = 'e-splitter-horizontal';
const VERTICAL_PANE = 'e-splitter-vertical';
const PANE = 'e-pane';
const SPLIT_H_PANE = 'e-pane-horizontal';
const SPLIT_V_PANE = 'e-pane-vertical';
const SPLIT_BAR = 'e-split-bar';
const SPLIT_H_BAR = 'e-split-bar-horizontal';
const SPLIT_V_BAR = 'e-split-bar-vertical';
const STATIC_PANE = 'e-static-pane';
const SCROLL_PANE = 'e-scrollable';
const RESIZE_BAR = 'e-resize-handler';
const RESIZABLE_BAR = 'e-resizable-split-bar';
const SPLIT_BAR_LINE = 'e-split-line';
const SPLIT_BAR_HOVER = 'e-split-bar-hover';
const SPLIT_BAR_ACTIVE = 'e-split-bar-active';
const HIDE_HANDLER = 'e-hide-handler';
const SPLIT_TOUCH = 'e-splitter-touch';
const DISABLED = 'e-disabled';
const RTL = 'e-rtl';
const E_ICONS = 'e-icons';
/**
 * Interface to configure pane properties such as its content, size, min, max, and resizable.
 */
class PaneProperties extends ChildProperty {
}
__decorate([
    Property()
], PaneProperties.prototype, "size", void 0);
__decorate([
    Property(true)
], PaneProperties.prototype, "resizable", void 0);
__decorate([
    Property(null)
], PaneProperties.prototype, "min", void 0);
__decorate([
    Property(null)
], PaneProperties.prototype, "max", void 0);
__decorate([
    Property()
], PaneProperties.prototype, "content", void 0);
/**
 * Splitter is a layout user interface (UI) control that has resizable and collapsible split panes.
 * The container can be split into multiple panes, which are oriented horizontally or vertically.
 * The separator (divider) splits the panes and resizes and expands/collapses the panes.
 * The splitter is placed inside the split pane to make a nested layout user interface.
 *
 * ```html
 * <div id="splitter">
 *  <div> Left Pane </div>
 *  <div> Center Pane </div>
 *  <div> Right Pane </div>
 * </div>
 * ```
 * ```typescript
 * <script>
 *   var splitterObj = new Splitter({ width: '300px', height: '200px'});
 *   splitterObj.appendTo('#splitter');
 * </script>
 * ```
 */
let Splitter = class Splitter extends Component {
    /**
     * Initializes a new instance of the Splitter class.
     * @param options  - Specifies Splitter model properties as options.
     * @param element  - Specifies the element that is rendered as an Splitter.
     */
    constructor(options, element) {
        super(options, element);
        this.allPanes = [];
        this.paneOrder = [];
        this.separatorOrder = [];
        this.allBars = [];
        this.previousCoordinates = {};
        this.currentCoordinates = {};
        this.updatePrePaneInPercentage = false;
        this.updateNextPaneInPercentage = false;
        this.panesDimensions = [];
        this.border = 0;
        this.validDataAttributes = ['data-size', 'data-min', 'data-max', 'data-collapsible', 'data-resizable', 'data-content'];
        this.validElementAttributes = ['data-orientation', 'data-width', 'data-height'];
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     * @param  {SplitterModel} newProp
     * @param  {SplitterModel} oldProp
     * @returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'height':
                    this.setSplitterSize(this.element, newProp.height, 'height');
                    break;
                case 'width':
                    this.setSplitterSize(this.element, newProp.width, 'width');
                    break;
                case 'cssClass':
                    this.setCssClass(newProp.cssClass);
                    break;
                case 'enabled':
                    this.isEnabled(this.enabled);
                    break;
                case 'separatorSize':
                    this.setSeparatorSize(newProp.separatorSize);
                    break;
                case 'orientation':
                    this.changeOrientation(newProp.orientation);
                    break;
                case 'paneSettings':
                    if (!(newProp.paneSettings instanceof Array && oldProp.paneSettings instanceof Array)) {
                        let paneCounts = Object.keys(newProp.paneSettings);
                        for (let i = 0; i < paneCounts.length; i++) {
                            let index = parseInt(Object.keys(newProp.paneSettings)[i], 10);
                            let changedPropsCount = Object.keys(newProp.paneSettings[index]).length;
                            for (let j = 0; j < changedPropsCount; j++) {
                                let property = Object.keys(newProp.paneSettings[index])[j];
                                let newVal = Object(newProp.paneSettings[index])[property];
                                index = (this.enableRtl) ? (this.allBars.length - 1) - index : index;
                                if (property === 'content') {
                                    this.allPanes[index].innerHTML = '';
                                    this.setTemplate(newVal, this.allPanes[index]);
                                }
                                if (property === 'resizable') {
                                    EventHandler.remove(this.allBars[index], 'mousedown', this.onMouseDown);
                                    if (newVal) {
                                        EventHandler.add(this.allBars[index], 'mousedown', this.onMouseDown, this);
                                        this.currentSeparator = this.allBars[index];
                                        if (this.isResizable()) {
                                            this.showResizer(this.allBars[index]);
                                            this.allBars[index].classList.add(RESIZABLE_BAR);
                                        }
                                    }
                                    else {
                                        this.hideResizer(this.allBars[index]);
                                        this.allBars[index].classList.remove(RESIZABLE_BAR);
                                    }
                                }
                                if (property === 'size') {
                                    this.allPanes[index].style.flexBasis = newVal;
                                }
                            }
                        }
                    }
                    break;
                case 'enableRtl':
                    this.setRTL(newProp.enableRtl);
                    break;
            }
        }
    }
    preRender() {
        this.wrapper = this.element.cloneNode(true);
        this.wrapperParent = this.element.parentElement;
        removeClass([this.wrapper], ['e-control', 'e-lib', ROOT]);
        let orientation = this.orientation === 'Horizontal' ? HORIZONTAL_PANE : VERTICAL_PANE;
        addClass([this.element], orientation);
        if (Browser.isDevice) {
            addClass([this.element], SPLIT_TOUCH);
        }
    }
    getPersistData() {
        return this.addOnPersist([]);
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'splitter';
    }
    /**
     * To Initialize the control rendering
     * @private
     */
    render() {
        this.checkDataAttributes();
        this.setCssClass(this.cssClass);
        this.isEnabled(this.enabled);
        this.setDimension(this.getHeight(this.element), this.getWidth(this.element));
        this.createSplitPane(this.element);
        this.addSeparator(this.element);
        this.getPanesDimensions();
        this.setRTL(this.enableRtl);
    }
    checkDataAttributes() {
        let api;
        let value;
        // Element values
        for (let dataIndex = 0; dataIndex < this.validElementAttributes.length; dataIndex++) {
            value = this.element.getAttribute(this.validElementAttributes[dataIndex]);
            if (!isNullOrUndefined(value)) {
                api = this.removeDataPrefix(this.validElementAttributes[dataIndex]);
                // tslint:disable-next-line
                this[api] = value;
            }
        }
        // Pane values
        for (let paneIndex = 0; paneIndex < this.element.children.length; paneIndex++) {
            for (let dataAttr = 0; dataAttr < this.validDataAttributes.length; dataAttr++) {
                value = this.element.children[paneIndex].getAttribute(this.validDataAttributes[dataAttr]);
                if (!isNullOrUndefined(value)) {
                    api = this.removeDataPrefix(this.validDataAttributes[dataAttr]);
                    value = (api === 'collapsible' || api === 'resizable') ? (value === 'true') : value;
                    if (isNullOrUndefined(this.paneSettings[paneIndex])) {
                        this.paneSettings[paneIndex] = {
                            size: '',
                            min: null,
                            max: null,
                            content: '',
                            resizable: true,
                        };
                    }
                    // tslint:disable-next-line
                    let paneAPI = this.paneSettings[paneIndex][api];
                    if (api === 'resizable' && this.paneSettings[paneIndex].resizable) {
                        // tslint:disable-next-line
                        this.paneSettings[paneIndex][api] = value;
                    }
                    if (isNullOrUndefined(paneAPI) || paneAPI === '') {
                        // tslint:disable-next-line
                        this.paneSettings[paneIndex][api] = value;
                    }
                }
            }
        }
    }
    removeDataPrefix(attribute) {
        return attribute.slice(attribute.lastIndexOf('-') + 1);
    }
    setRTL(rtl) {
        rtl ? addClass([this.element], RTL) : removeClass([this.element], RTL);
    }
    setSplitterSize(element, size, property) {
        let style = property === 'width' ? { 'width': formatUnit(size) } : { 'height': formatUnit(size) };
        setStyleAttribute(element, style);
    }
    getPanesDimensions() {
        for (let index = 0; index < this.allPanes.length; index++) {
            if (this.orientation === 'Horizontal') {
                this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().width);
            }
            else {
                this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().height);
            }
        }
    }
    setCssClass(className) {
        if (className !== '') {
            addClass([this.element], className.split(' '));
        }
    }
    hideResizer(target) {
        addClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
    }
    showResizer(target) {
        removeClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
    }
    isEnabled(enabled) {
        enabled ? removeClass([this.element], DISABLED) : addClass([this.element], DISABLED);
    }
    setSeparatorSize(size) {
        let sizeValue = isNullOrUndefined(size) ? 'auto' : size + 'px';
        let seaprator = this.orientation === 'Horizontal' ? SPLIT_H_BAR : SPLIT_V_BAR;
        for (let index = 0; index < this.allBars.length; index++) {
            let splitBar = selectAll('.' + seaprator, this.element)[index];
            let resizeBar = selectAll('.' + RESIZE_BAR, splitBar)[0];
            if (this.orientation === 'Horizontal') {
                splitBar.style.width = sizeValue;
                if (!isNullOrUndefined(resizeBar)) {
                    resizeBar.style.width = sizeValue;
                }
            }
            else {
                splitBar.style.height = sizeValue;
                if (!isNullOrUndefined(resizeBar)) {
                    resizeBar.style.height = sizeValue;
                }
            }
        }
    }
    changeOrientation(orientation) {
        let isVertical = orientation === 'Vertical';
        this.element.classList.remove(isVertical ? HORIZONTAL_PANE : VERTICAL_PANE);
        this.element.classList.add(isVertical ? VERTICAL_PANE : HORIZONTAL_PANE);
        this.element.removeAttribute('aria-orientation');
        this.element.setAttribute('aria-orientation', orientation);
        for (let index = 0; index < this.allPanes.length; index++) {
            this.allPanes[index].classList.remove(isVertical ? SPLIT_H_PANE : SPLIT_V_PANE);
            this.allPanes[index].classList.add(isVertical ? SPLIT_V_PANE : SPLIT_H_PANE);
        }
        for (let index = 0; index < this.allBars.length; index++) {
            this.allBars[index].classList.remove(isVertical ? SPLIT_H_BAR : SPLIT_V_BAR);
            this.allBars[index].classList.add(isVertical ? SPLIT_V_BAR : SPLIT_H_BAR);
        }
    }
    getPrevPane(currentBar, order) {
        let elementIndex = (this.enableRtl && this.orientation === 'Horizontal') ? ((order - 1) / 2) + 1 : (order - 1) / (2);
        return currentBar.parentElement.children[elementIndex];
    }
    getNextPane(currentBar, order) {
        let elementIndex = (this.enableRtl && this.orientation === 'Horizontal') ? (order - 1) / (2) : ((order - 1) / 2) + 1;
        return currentBar.parentElement.children[elementIndex];
    }
    addResizeHandler(currentBar) {
        let resizeHanlder = this.createElement('div');
        addClass([resizeHanlder], [RESIZE_BAR, E_ICONS]);
        let sizeValue = isNullOrUndefined(this.separatorSize) ? '1px' : this.separatorSize + 'px';
        if (this.orientation === 'Horizontal') {
            resizeHanlder.style.width = sizeValue;
        }
        else {
            resizeHanlder.style.height = sizeValue;
        }
        currentBar.appendChild(resizeHanlder);
    }
    getHeight(target) {
        let height = this.height;
        height = target.style.height !== '' && this.height === '100%' ? target.style.height : this.height;
        return height;
    }
    getWidth(target) {
        let width = this.width;
        width = target.style.width !== '' && this.width === '100%' ? target.style.width : this.width;
        return width;
    }
    setDimension(height, width) {
        setStyleAttribute(this.element, { 'height': height, 'width': width });
    }
    createSeparator(i) {
        let separator = this.createElement('div');
        this.allBars.push(separator);
        if (this.orientation === 'Horizontal') {
            addClass([separator], [SPLIT_BAR, SPLIT_H_BAR]);
            separator.style.width = isNullOrUndefined(this.separatorSize) ? 'auto' : this.separatorSize + 'px';
        }
        else {
            addClass([separator], [SPLIT_BAR, SPLIT_V_BAR]);
            separator.style.height = isNullOrUndefined(this.separatorSize) ? 'auto' : this.separatorSize + 'px';
        }
        this.addMouseActions(separator);
        this.addResizeHandler(separator);
        return separator;
    }
    addSeparator(target) {
        let childCount = this.allPanes.length;
        let clonedEle = target.children;
        for (let i = 0; i < childCount; i++) {
            if (i < childCount - 1) {
                let separator = this.createSeparator(i);
                setStyleAttribute(separator, { 'order': (i * 2) + 1 });
                this.separatorOrder.push((i * 2) + 1);
                clonedEle[i].parentNode.appendChild(separator);
                this.currentSeparator = separator;
                separator.setAttribute('role', 'separator');
                if (this.isResizable()) {
                    EventHandler.add(separator, 'mousedown', this.onMouseDown, this);
                    let eventName = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
                    EventHandler.add(separator, eventName, this.onMouseDown, this);
                    separator.classList.add(RESIZABLE_BAR);
                }
                else {
                    this.hideResizer(separator);
                }
            }
        }
    }
    isResizable() {
        let resizable = false;
        if ((!isNullOrUndefined(this.paneSettings[this.getPreviousPaneIndex()]) &&
            this.paneSettings[this.getPreviousPaneIndex()].resizable &&
            !isNullOrUndefined(this.paneSettings[this.getNextPaneIndex()]) &&
            this.paneSettings[this.getNextPaneIndex()].resizable) ||
            isNullOrUndefined(this.paneSettings[this.getNextPaneIndex()])) {
            resizable = true;
        }
        return resizable;
    }
    addMouseActions(separator) {
        separator.addEventListener('mouseover', () => {
            addClass([separator], [SPLIT_BAR_HOVER]);
        });
        separator.addEventListener('mouseout', () => {
            removeClass([separator], [SPLIT_BAR_HOVER]);
        });
    }
    getEventType(e) {
        return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
    }
    updateCurrentSeparator(target) {
        this.currentSeparator = !this.isSeparator(target) ? target.parentElement : target;
    }
    isSeparator(target) {
        let isSeparatorLine = true;
        if (target.classList.contains(RESIZE_BAR) || target.classList.contains(SPLIT_BAR_LINE)) {
            isSeparatorLine = false;
        }
        return isSeparatorLine;
    }
    isMouseEvent(e) {
        let isMouse = false;
        if (this.getEventType(e.type) === 'mouse' || (!isNullOrUndefined(e.pointerType) &&
            this.getEventType(e.pointerType) === 'mouse')) {
            isMouse = true;
        }
        return isMouse;
    }
    updateCursorPosition(e, type) {
        if (this.isMouseEvent(e)) {
            this.changeCoordinates({ x: e.pageX, y: e.pageY }, type);
        }
        else {
            let eventType = Browser.info.name !== 'msie' ? e.touches[0] : e;
            this.changeCoordinates({ x: eventType.pageX, y: eventType.pageY }, type);
        }
    }
    changeCoordinates(coordinates, type) {
        if (type === 'previous') {
            this.previousCoordinates = coordinates;
        }
        else {
            this.currentCoordinates = coordinates;
        }
    }
    wireResizeEvents() {
        EventHandler.add(document, 'mousemove', this.onMouseMove, this);
        EventHandler.add(document, 'mouseup', this.onMouseUp, this);
        let touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        let touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.add(document, touchMoveEvent, this.onMouseMove, this);
        EventHandler.add(document, touchEndEvent, this.onMouseUp, this);
    }
    unwireResizeEvents() {
        let touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        let touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.remove(document, 'mousemove', this.onMouseMove);
        EventHandler.remove(document, 'mouseup', this.onMouseUp);
        EventHandler.remove(document, touchMoveEvent, this.onMouseMove);
        EventHandler.remove(document, touchEndEvent, this.onMouseUp);
    }
    onMouseDown(e) {
        e.preventDefault();
        let target = e.target;
        this.updateCurrentSeparator(target);
        addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.updateCursorPosition(e, 'previous');
        this.getPaneDetails();
        let eventArgs = {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.currentSeparator,
            cancel: false
        };
        this.trigger('resizeStart', eventArgs);
        if (eventArgs.cancel) {
            return;
        }
        this.wireResizeEvents();
        if (this.previousPane.style.flexBasis.indexOf('%') > 0 || this.nextPane.style.flexBasis.indexOf('%') > 0) {
            let previousFlexBasis = this.updatePaneFlexBasis(this.previousPane);
            let nextFlexBasis = this.updatePaneFlexBasis(this.nextPane);
            this.totalPercent = previousFlexBasis + nextFlexBasis;
            this.totalWidth = this.convertPercentageToPixel(this.totalPercent + '%');
        }
        else {
            this.totalWidth = (this.orientation === 'Horizontal') ? this.previousPane.offsetWidth + this.nextPane.offsetWidth :
                this.previousPane.offsetHeight + this.nextPane.offsetHeight;
        }
    }
    updatePaneFlexBasis(pane) {
        let previous;
        if (pane.style.flexBasis.indexOf('%') > 0) {
            previous = this.removePercentageUnit(pane.style.flexBasis);
        }
        else {
            if (pane.style.flexBasis !== '') {
                previous = this.convertPixelToPercentage(this.convertPixelToNumber(pane.style.flexBasis));
            }
            else {
                let offset = (this.orientation === 'Horizontal') ? (pane.offsetWidth + this.currentSeparator.offsetWidth) :
                    (pane.offsetHeight + this.currentSeparator.offsetHeight);
                previous = this.convertPixelToPercentage(offset);
            }
        }
        return previous;
    }
    removePercentageUnit(value) {
        return parseFloat(value.slice(0, value.indexOf('%')));
    }
    convertPercentageToPixel(value, targetElement) {
        let percentage = value.toString();
        let convertedValue;
        if (percentage.indexOf('%') > -1) {
            convertedValue = parseFloat(percentage.slice(0, percentage.indexOf('%')));
            let offsetValue;
            if (!isNullOrUndefined(targetElement)) {
                offsetValue = this.panesDimensions[this.allPanes.indexOf(targetElement)];
            }
            else {
                offsetValue = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
            }
            convertedValue = Math.ceil(offsetValue * (convertedValue / 100));
        }
        else {
            convertedValue = parseInt(percentage, 10);
        }
        return convertedValue;
    }
    convertPixelToPercentage(value) {
        let offsetValue = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
        return (value / offsetValue) * 100;
    }
    convertPixelToNumber(value) {
        if (value.indexOf('p') > -1) {
            return parseFloat(value.slice(0, value.indexOf('p')));
        }
        else {
            return parseFloat(value);
        }
    }
    calcDragPosition(rectValue, offsetValue) {
        let separatorPosition;
        let separator;
        separatorPosition = this.orientation === 'Horizontal' ? (this.currentCoordinates.x - rectValue) :
            (this.currentCoordinates.y - rectValue);
        separator = separatorPosition / offsetValue;
        separator = (separator > 1) ? 1 : (separator < 0) ? 0 : separator;
        return separator * offsetValue;
    }
    getSeparatorPosition(e) {
        this.updateCursorPosition(e, 'current');
        let rectBound = (this.orientation === 'Horizontal') ? this.element.getBoundingClientRect().left :
            this.element.getBoundingClientRect().top;
        let offSet = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
        return this.calcDragPosition(rectBound, offSet);
    }
    getMinMax(paneIndex, target, selection) {
        let defaultVal = selection === 'min' ? 0 : null;
        // tslint:disable-next-line
        let paneValue = null;
        if (selection === 'min') {
            if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
                !isNullOrUndefined(this.paneSettings[paneIndex].min)) {
                paneValue = this.paneSettings[paneIndex].min;
            }
        }
        else {
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
        }
        else {
            return defaultVal;
        }
    }
    getPreviousPaneIndex() {
        let prePaneIndex = ((parseInt(this.currentSeparator.style.order, 10) - 1) / 2);
        return (this.enableRtl) ? prePaneIndex + 1 : prePaneIndex;
    }
    getNextPaneIndex() {
        let nextPaneIndex = (parseInt(this.currentSeparator.style.order, 10) - 1) / (2);
        return (this.enableRtl) ? nextPaneIndex : nextPaneIndex + 1;
    }
    getPaneDetails() {
        this.order = parseInt(this.currentSeparator.style.order, 10);
        this.previousPane = this.getPrevPane(this.currentSeparator, this.order);
        this.nextPane = this.getNextPane(this.currentSeparator, this.order);
        this.prevPaneIndex = this.getPreviousPaneIndex();
        this.nextPaneIndex = this.getNextPaneIndex();
    }
    getPaneHeight(pane) {
        return (this.orientation === 'Horizontal') ? pane.offsetWidth.toString() :
            pane.offsetHeight.toString();
    }
    boundingRectValues(pane) {
        return (this.orientation === 'Horizontal') ? pane.getBoundingClientRect().width :
            pane.getBoundingClientRect().height;
    }
    isValidSize(paneIndex) {
        let isValid = false;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !isNullOrUndefined(this.paneSettings[paneIndex].size) &&
            this.paneSettings[paneIndex].size.indexOf('%') > -1) {
            isValid = true;
        }
        return isValid;
    }
    getPaneDimensions() {
        this.previousPaneHeightWidth = (this.previousPane.style.flexBasis === '') ? this.getPaneHeight(this.previousPane) :
            this.previousPane.style.flexBasis;
        this.nextPaneHeightWidth = (this.nextPane.style.flexBasis === '') ? this.getPaneHeight(this.nextPane) :
            this.nextPane.style.flexBasis;
        if (this.paneSettings.length < 1) {
            this.prePaneDimenson = this.boundingRectValues(this.previousPane);
            this.nextPaneDimension = this.boundingRectValues(this.nextPane);
            return;
        }
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
    checkCoordinates(pageX, pageY) {
        let coordinatesChanged = true;
        if ((pageX === this.previousCoordinates.x || pageY === this.previousCoordinates.y)) {
            coordinatesChanged = false;
        }
        return coordinatesChanged;
    }
    isCursorMoved(e) {
        let cursorMoved = true;
        if (this.getEventType(e.type) === 'mouse' || (!isNullOrUndefined(e.pointerType)) &&
            this.getEventType(e.pointerType) === 'mouse') {
            cursorMoved = this.checkCoordinates(e.pageX, e.pageY);
        }
        else {
            cursorMoved = (Browser.info.name !== 'msie') ?
                this.checkCoordinates(e.touches[0].pageX, e.touches[0].pageY) :
                this.checkCoordinates(e.pageX, e.pageY);
        }
        return cursorMoved;
    }
    getBorder() {
        this.border = 0;
        let border = this.orientation === 'Horizontal' ? ((this.element.offsetWidth - this.element.clientWidth) / 2) :
            (this.element.offsetHeight - this.element.clientHeight) / 2;
        this.border = Browser.info.name !== 'chrome' ? this.border : border;
    }
    onMouseMove(e) {
        if (!this.isCursorMoved(e)) {
            return;
        }
        this.getPaneDetails();
        this.getPaneDimensions();
        let eventArgs = {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            paneSize: [this.prePaneDimenson, this.nextPaneDimension],
            separator: this.currentSeparator
        };
        this.trigger('resizing', eventArgs);
        let left = this.validateDraggedPosition(this.getSeparatorPosition(e), this.prePaneDimenson, this.nextPaneDimension);
        let separatorNewPosition;
        this.getBorder();
        if (this.orientation === 'Horizontal') {
            separatorNewPosition = (this.element.getBoundingClientRect().left + left) -
                this.currentSeparator.getBoundingClientRect().left + this.border;
        }
        else {
            separatorNewPosition = (this.element.getBoundingClientRect().top + left) -
                this.currentSeparator.getBoundingClientRect().top + this.border;
        }
        this.nextPaneHeightWidth =
            (typeof (this.nextPaneHeightWidth) === 'string' && this.nextPaneHeightWidth.indexOf('p') > -1) ?
                this.convertPixelToNumber(this.nextPaneHeightWidth) : parseInt(this.nextPaneHeightWidth, 10);
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
            let difference = this.totalWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth));
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + difference;
        }
        this.calculateCurrentDimensions();
        this.addStaticPaneClass();
        this.previousPane.style.flexBasis = this.prevPaneCurrentWidth;
        this.nextPane.style.flexBasis = this.nextPaneCurrentWidth;
    }
    validateMinRange(paneIndex, paneCurrentWidth, pane) {
        let paneMinRange = null;
        let paneMinDimensions;
        let difference = 0;
        let validatedVal;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) && !isNullOrUndefined(this.paneSettings[paneIndex].min)) {
            paneMinRange = this.paneSettings[paneIndex].min.toString();
        }
        if (!isNullOrUndefined(paneMinRange)) {
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
        return isNullOrUndefined(validatedVal) ? paneCurrentWidth : validatedVal;
    }
    validateMaxRange(paneIndex, paneCurrentWidth, pane) {
        let paneMaxRange = null;
        let paneMaxDimensions;
        let validatedVal;
        if (!isNullOrUndefined(this.paneSettings[paneIndex]) && !isNullOrUndefined(this.paneSettings[paneIndex].max)) {
            paneMaxRange = this.paneSettings[paneIndex].max.toString();
        }
        if (!isNullOrUndefined(paneMaxRange)) {
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
        return isNullOrUndefined(validatedVal) ? paneCurrentWidth : validatedVal;
    }
    validateMinMaxValues() {
        //validate previous pane minimum range
        this.prevPaneCurrentWidth = this.validateMinRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        // Validate next pane minimum range
        this.nextPaneCurrentWidth = this.validateMinRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
        // validate previous pane maximum range
        this.prevPaneCurrentWidth = this.validateMaxRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        // validate next pane maximum range
        this.nextPaneCurrentWidth = this.validateMaxRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
    }
    equatePaneWidths() {
        let difference;
        if ((this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) > this.totalPercent) {
            difference = (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) - this.totalPercent;
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth - (difference / 2) + '%';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth - (difference / 2) + '%';
        }
        if ((this.prevPaneCurrentWidth + this.nextPaneCurrentWidth) < this.totalPercent) {
            difference = this.totalPercent - (this.prevPaneCurrentWidth + this.nextPaneCurrentWidth);
            this.prevPaneCurrentWidth = this.prevPaneCurrentWidth + (difference / 2) + '%';
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + (difference / 2) + '%';
        }
    }
    calculateCurrentDimensions() {
        if (this.updatePrePaneInPercentage || this.updateNextPaneInPercentage) {
            this.prevPaneCurrentWidth = Math.round(Number(Math.round(this.convertPixelToPercentage(this.prevPaneCurrentWidth)
                * 10) / 10));
            this.nextPaneCurrentWidth = Math.round(Number(Math.round(this.convertPixelToPercentage(this.nextPaneCurrentWidth)
                * 10) / 10));
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
    }
    addStaticPaneClass() {
        if (!this.previousPane.classList.contains(STATIC_PANE)) {
            this.previousPane.classList.add(STATIC_PANE);
        }
        if (!this.nextPane.classList.contains(STATIC_PANE)) {
            this.nextPane.classList.add(STATIC_PANE);
        }
    }
    validateDraggedPosition(draggedPos, prevPaneHeightWidth, nextPaneHeightWidth) {
        let separatorTopLeft = (this.orientation === 'Horizontal') ? this.currentSeparator.offsetLeft :
            this.currentSeparator.offsetTop;
        let prePaneRange = separatorTopLeft - prevPaneHeightWidth;
        let nextPaneRange = nextPaneHeightWidth + separatorTopLeft;
        let pane1MinSize = this.getMinMax(this.prevPaneIndex, this.previousPane, 'min');
        let pane2MinSize = this.getMinMax(this.nextPaneIndex, this.nextPane, 'min');
        let pane1MaxSize = this.getMinMax(this.prevPaneIndex, this.previousPane, 'max');
        let pane2MaxSize = this.getMinMax(this.nextPaneIndex, this.nextPane, 'max');
        let validatedSize = draggedPos;
        if (draggedPos > nextPaneRange - pane2MinSize) {
            validatedSize = nextPaneRange - pane2MinSize;
        }
        else if (draggedPos < prePaneRange + pane1MinSize) {
            validatedSize = prePaneRange + pane1MinSize;
        }
        if (!isNullOrUndefined(pane1MaxSize)) {
            if (draggedPos > prePaneRange + pane1MaxSize) {
                validatedSize = prePaneRange + pane1MaxSize;
            }
        }
        else if (!isNullOrUndefined(pane2MaxSize)) {
            if (draggedPos < nextPaneRange - pane2MaxSize) {
                validatedSize = nextPaneRange - pane2MaxSize;
            }
        }
        return validatedSize;
    }
    onMouseUp(e) {
        removeClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.unwireResizeEvents();
        let eventArgs = {
            event: e,
            element: this.element,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            paneSize: [this.prePaneDimenson, this.nextPaneDimension]
        };
        this.trigger('resizeStop', eventArgs);
    }
    panesDimension(index, child) {
        let childCount = child.length;
        let size;
        parseInt(this.getHeight(this.element), 10);
        if (!isNullOrUndefined(this.paneSettings[index])) {
            if (!isNullOrUndefined(this.paneSettings[index].size)) {
                size = this.paneSettings[index].size;
                if (index < childCount) {
                    setStyleAttribute(child[index], { 'flex-basis': size, 'order': index * 2 });
                    if (index < childCount - 1) {
                        addClass([child[index]], STATIC_PANE);
                    }
                    else if (!this.sizeFlag) {
                        child[index].style.flexBasis = null;
                    }
                    if ((index === childCount - 1) && this.sizeFlag) {
                        addClass([child[index]], STATIC_PANE);
                    }
                }
            }
            else {
                this.sizeFlag = true;
                setStyleAttribute(child[index], { 'order': index * 2 });
            }
        }
        else {
            setStyleAttribute(child[index], { 'order': index * 2 });
        }
        this.paneOrder.push(index * 2);
    }
    setTemplate(template, toElement) {
        let templateFn = compile(template);
        let fromElements = [];
        for (let item of templateFn({})) {
            fromElements.push(item);
        }
        append([].slice.call(fromElements), toElement);
    }
    createSplitPane(target) {
        let childCount = target.children.length;
        for (let i = 0; i < this.paneSettings.length; i++) {
            if (childCount < this.paneSettings.length) {
                let childElement = this.createElement('div');
                this.element.appendChild(childElement);
                childCount = childCount + 1;
            }
        }
        childCount = target.children.length;
        let child = [].slice.call(target.children);
        this.element.setAttribute('aria-orientation', this.orientation);
        this.element.setAttribute('role', 'splitter');
        this.sizeFlag = false;
        if (childCount > 1) {
            for (let i = 0; i < childCount; i++) {
                // to get only div element
                if (child[i].nodeType === 1) {
                    this.allPanes.push(child[i]);
                    if (this.orientation === 'Horizontal') {
                        addClass([child[i]], [PANE, SPLIT_H_PANE, SCROLL_PANE]);
                        this.panesDimension(i, child);
                    }
                    else {
                        addClass([child[i]], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
                        this.panesDimension(i, child);
                    }
                    if (!isNullOrUndefined(this.paneSettings[i]) && !isNullOrUndefined(this.paneSettings[i].content)) {
                        this.setTemplate(this.paneSettings[i].content, child[i]);
                    }
                }
            }
        }
    }
    ;
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    destroy() {
        detach(this.element);
        this.element = this.wrapper;
        this.wrapperParent.appendChild(this.wrapper);
    }
    addPaneClass(pane) {
        if (this.orientation === 'Horizontal') {
            addClass([pane], [PANE, SPLIT_H_PANE, SCROLL_PANE]);
        }
        else {
            addClass([pane], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
        }
        return pane;
    }
    removePaneOrders(paneClass) {
        let panes = document.querySelectorAll('.' + paneClass);
        for (let i = 0; i < panes.length; i++) {
            panes[i].style.removeProperty('order');
        }
    }
    setPaneOrder() {
        for (let i = 0; i < this.allPanes.length; i++) {
            this.panesDimension(i, this.allPanes);
        }
    }
    removeSeparator() {
        for (let i = 0; i < this.allBars.length; i++) {
            detach(this.allBars[i]);
        }
        this.allBars = [];
    }
    updatePanes() {
        this.setPaneOrder();
        this.removeSeparator();
        this.addSeparator(this.element);
    }
    /**
     * Allows you to add a pane dynamically to the specified index position by passing the pane properties.
     * @param { PanePropertiesModel } paneProperties - Specifies the pane’s properties that apply to new pane.
     * @param { number } index - Specifies the index where the pane will be inserted.
     * @returns void
     */
    addPane(paneProperties, index) {
        let newPane = this.createElement('div');
        newPane = this.addPaneClass(newPane);
        index = (index > this.allPanes.length + 1) ? this.allPanes.length : index;
        let paneDetails = {
            size: isNullOrUndefined(paneProperties.size) ? '' : paneProperties.size,
            min: isNullOrUndefined(paneProperties.min) ? null : paneProperties.min,
            max: isNullOrUndefined(paneProperties.max) ? null : paneProperties.max,
            content: isNullOrUndefined(paneProperties.content) ? '' : paneProperties.content,
            resizable: isNullOrUndefined(paneProperties.resizable) ? true : paneProperties.resizable
        };
        this.paneSettings.splice(index, 0, paneDetails);
        if (this.orientation === 'Horizontal') {
            this.element.insertBefore(newPane, this.element.querySelectorAll('.' + SPLIT_H_PANE)[index]);
            this.removePaneOrders(SPLIT_H_PANE);
        }
        else {
            this.element.insertBefore(newPane, this.element.querySelectorAll('.' + SPLIT_V_PANE)[index]);
            this.removePaneOrders(SPLIT_V_PANE);
        }
        this.allPanes.splice(index, 0, newPane);
        this.updatePanes();
        this.setTemplate(this.paneSettings[index].content, newPane);
        this.allPanes[this.allPanes.length - 1].classList.remove(STATIC_PANE);
    }
    /**
     * Allows you to remove the specified pane dynamically by passing its index value.
     * @param { number } index - Specifies the index value to remove the corresponding pane.
     * @returns void
     */
    removePane(index) {
        index = (index > this.allPanes.length + 1) ? this.allPanes.length : index;
        let elementClass = (this.orientation === 'Horizontal') ? SPLIT_H_PANE : SPLIT_V_PANE;
        if (isNullOrUndefined(this.element.querySelectorAll('.' + elementClass)[index])) {
            return;
        }
        detach(this.element.querySelectorAll('.' + elementClass)[index]);
        this.allPanes.splice(index, 1);
        this.removePaneOrders(elementClass);
        this.updatePanes();
        this.allPanes[this.allPanes.length - 1].classList.remove(STATIC_PANE);
    }
};
__decorate([
    Property('100%')
], Splitter.prototype, "height", void 0);
__decorate([
    Property('100%')
], Splitter.prototype, "width", void 0);
__decorate([
    Collection([], PaneProperties)
], Splitter.prototype, "paneSettings", void 0);
__decorate([
    Property('Horizontal')
], Splitter.prototype, "orientation", void 0);
__decorate([
    Property('')
], Splitter.prototype, "cssClass", void 0);
__decorate([
    Property(true)
], Splitter.prototype, "enabled", void 0);
__decorate([
    Property(false)
], Splitter.prototype, "enableRtl", void 0);
__decorate([
    Property(null)
], Splitter.prototype, "separatorSize", void 0);
__decorate([
    Event()
], Splitter.prototype, "created", void 0);
__decorate([
    Event()
], Splitter.prototype, "resizeStart", void 0);
__decorate([
    Event()
], Splitter.prototype, "resizing", void 0);
__decorate([
    Event()
], Splitter.prototype, "resizeStop", void 0);
Splitter = __decorate([
    NotifyPropertyChanges
], Splitter);

/**
 * splitter modules
 */

var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// constant class definitions
const ROOT$1 = 'e-dashboard-layout';
const preventSelect = 'e-prevent';
const dragging = 'e-dragging';
const draggable = 'e-draggable';
const resize = 'e-resize';
const responsive = 'e-responsive';
const east = 'e-east';
const west = 'e-west';
const north = 'e-north';
const south = 'e-south';
const double = 'e-double';
const northEast = 'e-north-east';
const southEast = 'e-south-east';
const northWest = 'e-north-west';
const southWest = 'e-south-west';
const panel = 'e-panel';
const panelContent = 'e-panel-content';
const panelContainer = 'e-panel-container';
const disable = 'e-disabled';
const header = 'e-panel-header';
const panelTransition = 'e-panel-transition';
/**
 * Defines the panel of the DashboardLayout component.
 */
class Panel extends ChildProperty {
}
__decorate$1([
    Property('')
], Panel.prototype, "id", void 0);
__decorate$1([
    Property('')
], Panel.prototype, "cssClass", void 0);
__decorate$1([
    Property('')
], Panel.prototype, "header", void 0);
__decorate$1([
    Property('')
], Panel.prototype, "content", void 0);
__decorate$1([
    Property(true)
], Panel.prototype, "enabled", void 0);
__decorate$1([
    Property(0)
], Panel.prototype, "row", void 0);
__decorate$1([
    Property(0)
], Panel.prototype, "col", void 0);
__decorate$1([
    Property(1)
], Panel.prototype, "sizeX", void 0);
__decorate$1([
    Property(1)
], Panel.prototype, "sizeY", void 0);
__decorate$1([
    Property(1)
], Panel.prototype, "minSizeY", void 0);
__decorate$1([
    Property(1)
], Panel.prototype, "minSizeX", void 0);
__decorate$1([
    Property(null)
], Panel.prototype, "maxSizeY", void 0);
__decorate$1([
    Property(null)
], Panel.prototype, "maxSizeX", void 0);
/**
 * The DashboardLayout is a grid structured layout control, that helps to create a dashboard with panels.
 * Panels hold the UI components or data to be visualized with flexible options like resize, reorder, drag-n-drop, remove and add,
 * that allows users to easily place the panels at a desired position within the grid layout.
 * ```html
 * <div id="default-layout">
 * ```
 * ```typescript
 * <script>
 *   let dashBoardObject : DashboardLayout = new DashboardLayout();
 *   dashBoardObject.appendTo('#default-layout');
 * </script>
 * ```
 */
let DashboardLayout = class DashboardLayout extends Component {
    constructor(options, element) {
        super(options, element);
        this.rows = 1;
        this.panelID = 0;
        this.movePanelCalled = false;
        this.resizeCalled = false;
        this.mOffX = 0;
        this.mOffY = 0;
        this.maxTop = 9999;
        this.maxRows = 100;
        this.mouseX = 0;
        this.mouseY = 0;
        this.minTop = 0;
        this.minLeft = 0;
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        this.panelCollection = [];
        this.sortedArray = [];
        this.gridPanelCollection = [];
        this.overlapElement = [];
        this.overlapElementClone = [];
        this.overlapSubElementClone = [];
        this.collisionChecker = {};
        this.dragCollection = [];
        this.elementRef = { top: '', left: '', height: '', width: '' };
        this.dimensions = [];
        this.allItems = [];
        this.oldRowCol = {};
        this.availableClasses = [];
        addClass([this.element], [ROOT$1]);
        for (let i = 0; i < this.panels.length; i++) {
            if (!this.panels[i].id) {
                this.panels[i].id = 'layout_' + this.panelID.toString();
                this.panelID = this.panelID + 1;
            }
            this.oldRowCol[this.panels[i].id] = { row: this.panels[i].row, col: this.panels[i].col };
        }
        this.calculateCellSize();
    }
    createPanelElement(cssClass, idValue, className) {
        let ele = this.createElement('div');
        if (cssClass) {
            addClass([ele], [cssClass]);
        }
        if (idValue) {
            ele.setAttribute('id', idValue);
        }
        return ele;
    }
    /**
     * To Initialize the control rendering.
     * @returns void
     * @private
     */
    render() {
        this.getRowColumn();
        this.setHeightWidth();
        if (this.element.childElementCount > 0) {
            let panelElements = [];
            this.panels = [];
            for (let i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
                panelElements.push((this.element.querySelectorAll('.e-panel')[i]));
            }
            for (let i = 0; i < panelElements.length; i++) {
                let panelElement = panelElements[i];
                if (this.enableRtl) {
                    addClass([panelElement], 'e-rtl');
                }
                let rowValue = parseInt(panelElement.getAttribute('data-row'), 10);
                let colValue = parseInt(panelElement.getAttribute('data-col'), 10);
                this.setPanelPosition(panelElement, rowValue, colValue);
                this.getInlinePanels(panelElement);
                this.maxCol();
                this.maxRow();
            }
            for (let i = 0; i < this.panels.length; i++) {
                let panelElement = this.element.querySelector('#' + this.panels[i].id);
                let panel = this.renderPanels(panelElement, this.panels[i]);
                this.panelCollection.push(panel);
                this.setMinMaxValues(this.panels[i]);
                this.setHeightAndWidth(panelElement, this.panels[i]);
                this.tempObject = this;
                if (this.mediaQuery && !window.matchMedia('(' + this.mediaQuery + ')').matches) {
                    this.setPanelPosition(panelElement, this.panels[i].row, this.panels[i].col);
                    this.updatePanelLayout(panelElement, this.panels[i]);
                }
                this.setClasses([panelElement]);
            }
            if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
                this.checkMediaQuerySizing();
            }
        }
        else {
            this.renderDashBoardCells(this.panels);
        }
        if (this.allowDragging && (this.mediaQuery ? !window.matchMedia('(' + this.mediaQuery + ')').matches : true)) {
            this.enableDraggingContent(this.panelCollection);
        }
        this.sortedPanel();
        this.bindEvents();
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.updateOldRowColumn();
        this.sortedPanel();
        this.cloneArray = this.sortedArray;
        this.checkColumnValue = this.maxColumnValue;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
        if (!(this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches)) {
            this.panelResponsiveUpdate();
        }
        this.setEnableRtl();
    }
    calculateCellSize() {
        this.cellSize = [];
        if ((this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches)) {
            this.cellSize[1] = Math.floor((this.element.parentElement.offsetWidth)) / this.cellAspectRatio;
        }
        else {
            this.cellSize[0] = Math.floor((this.element.parentElement.offsetWidth));
            this.cellSize[0] = Math.floor((this.element.parentElement.offsetWidth - ((this.maxCol() - 1) * this.cellSpacing[0]))
                / (this.maxCol()));
            this.cellSize[1] = this.cellSize[0] / this.cellAspectRatio;
        }
    }
    maxRow() {
        let maxRow = 1;
        if (this.rows > 1) {
            maxRow = this.rows;
            return maxRow;
        }
        for (let i = 0; i < this.panels.length; i++) {
            if (this.panels[i].sizeY + this.panels[i].row > maxRow) {
                maxRow = this.panels[i].sizeY + this.panels[i].row;
            }
        }
        if (this.panels.length === 0) {
            maxRow = 1;
        }
        return maxRow;
    }
    maxCol() {
        let maxCol = 1;
        if (this.columns > 1) {
            maxCol = this.columns;
            return maxCol;
        }
        for (let i = 0; i < this.panels.length; i++) {
            if (this.panels[i].sizeX + this.panels[i].col > maxCol) {
                maxCol = this.panels[i].sizeX + this.panels[i].col;
            }
        }
        if (this.panels.length === 0) {
            maxCol = this.columns;
        }
        return maxCol;
    }
    updateOldRowColumn() {
        for (let i = 0; i < this.panels.length; i++) {
            let id = this.panels[i].id;
            if (document.getElementById(id)) {
                let row = parseInt(document.getElementById(id).getAttribute('data-row'), 10);
                let col = parseInt(document.getElementById(id).getAttribute('data-col'), 10);
                this.oldRowCol[this.panels[i].id] = { row: row, col: col };
            }
            else {
                continue;
            }
        }
    }
    createSubElement(cssClass, idValue, className) {
        let element = this.createElement('div');
        if (className) {
            addClass([element], [className]);
        }
        if (cssClass) {
            addClass([element], [cssClass]);
        }
        if (idValue) {
            element.setAttribute('id', idValue);
        }
        return element;
    }
    templateParser(template) {
        if (template) {
            try {
                if (document.querySelectorAll(template).length) {
                    return compile(document.querySelector(template).innerHTML.trim());
                }
            }
            catch (error) {
                return compile(template);
            }
        }
        return undefined;
    }
    renderTemplate(content, appendElement) {
        let templateFn = this.templateParser(content);
        let templateElements = [];
        for (let item of templateFn({})) {
            templateElements.push(item);
        }
        append([].slice.call(templateElements), appendElement);
    }
    renderPanels(cellElement, panelModel) {
        addClass([cellElement], [panel, panelTransition]);
        this.panelContent = cellElement.querySelector('.e-panel-container') ?
            cellElement.querySelector('.e-panel-container') :
            this.createSubElement(panelModel.cssClass, cellElement.id + '_content', panelContainer);
        cellElement.appendChild(this.panelContent);
        if (!panelModel.enabled) {
            this.disablePanel(cellElement);
        }
        if (panelModel.header) {
            let headerTemplateElement = this.createSubElement('', cellElement.id + 'template', '');
            addClass([headerTemplateElement], [header]);
            this.renderTemplate(panelModel.header, headerTemplateElement);
            this.panelContent.appendChild(headerTemplateElement);
        }
        if (panelModel.content && panelModel.content) {
            this.panelBody = this.createSubElement(panelModel.cssClass, cellElement.id + '_body', panelContent);
            this.renderTemplate(panelModel.content, this.panelBody);
            this.panelContent.appendChild(this.panelBody);
        }
        return cellElement;
    }
    disablePanel(panelElement) {
        addClass([panelElement], [disable]);
    }
    getInlinePanels(panelElement) {
        let model = {
            sizeX: parseInt(panelElement.getAttribute('data-sizex'), 10),
            sizeY: parseInt(panelElement.getAttribute('data-sizey'), 10),
            minSizeX: parseInt(panelElement.getAttribute('data-minsizex'), 10),
            minSizeY: parseInt(panelElement.getAttribute('data-minsizey'), 10),
            maxSizeX: parseInt(panelElement.getAttribute('data-maxsizex'), 10),
            maxSizeY: parseInt(panelElement.getAttribute('data-maxsizey'), 10),
            row: parseInt(panelElement.getAttribute('data-row'), 10),
            col: parseInt(panelElement.getAttribute('data-col'), 10),
            id: panelElement.getAttribute('id'),
            header: panelElement.querySelector('.e-panel-header') && '.e-panel-header',
            content: panelElement.querySelector('.e-panel-content') && '.e-panel-content',
        };
        if (!model.id) {
            model.id = 'layout_' + this.panelID.toString();
            panelElement.setAttribute('id', model.id);
            this.panelID = this.panelID + 1;
        }
        if (isUndefined(model.enabled)) {
            model.enabled = true;
        }
        this.panels.push(model);
    }
    resizeEvents() {
        if (this.allowResizing) {
            for (let i = 0; i < document.querySelectorAll('.e-resize').length; i++) {
                EventHandler.add(document.querySelectorAll('.e-resize')[i], 'mousedown', this.downResizeHandler, this);
                EventHandler.add(document, 'mouseup', this.upResizeHandler, this);
            }
        }
    }
    bindEvents() {
        window.addEventListener('resize', this.onResize.bind(this));
        this.resizeEvents();
    }
    downResizeHandler(e) {
        this.resizeCalled = false;
        let el = (e.currentTarget).closest('.e-panel');
        let args = { event: e, element: el };
        this.trigger('resizeStart', args);
        this.downTarget = e.currentTarget;
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        addClass([this.element], [preventSelect]);
        this.element.appendChild(this.shadowEle);
        this.lastMouseX = e.pageX;
        this.lastMouseY = e.pageY;
        this.elementX = parseInt(el.style.left, 10);
        this.elementY = parseInt(el.style.top, 10);
        this.elementWidth = el.offsetWidth;
        this.elementHeight = el.offsetHeight;
        this.originalWidth = this.getCellInstance(el.id).sizeX;
        this.originalHeight = this.getCellInstance(el.id).sizeY;
        EventHandler.add(document, 'mousemove', this.moveResizeHandler, this);
    }
    ;
    getCellSize() {
        return [parseInt((this.cellSize[0]), 10), parseInt(this.cellSize[1], 10)];
    }
    /* istanbul ignore next */
    moveResizeHandler(e) {
        this.moveTarget = this.downTarget;
        let el = this.moveTarget.closest('.e-panel');
        let args = { event: e, element: el };
        this.trigger('resize', args);
        if (this.lastMouseX === e.pageX || this.lastMouseY === e.pageY) {
            return;
        }
        this.maxLeft = this.element.offsetWidth - 1;
        this.maxTop = this.cellSize[1] * this.maxRows - 1;
        removeClass([el], 'e-panel-transition');
        addClass([el], [dragging]);
        let oldSizeX = this.getCellInstance(el.id).sizeX;
        let oldSizeY = this.getCellInstance(el.id).sizeY;
        let handleArray = [east, west, north, south, southEast, northEast, northWest, southWest];
        let oldProp = [this.elementWidth, this.elementHeight];
        for (let i = 0; i < this.moveTarget.classList.length; i++) {
            if (handleArray.indexOf(this.moveTarget.classList[i]) !== -1) {
                this.handleClass = (this.moveTarget.classList[i]);
            }
        }
        let panelModel = this.getCellInstance(el.getAttribute('id'));
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
        let diffX = this.mouseX - this.lastMouseX + this.mOffX;
        let diffY = this.mouseY - this.lastMouseY + this.mOffY;
        this.mOffX = this.mOffY = 0;
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        let dY = diffY;
        let dX = diffX;
        if (this.handleClass && this.handleClass.indexOf('south') >= 0) {
            if (this.elementHeight + dY < this.getMinHeight(panelModel)) {
                diffY = this.getMinHeight(panelModel) - this.elementHeight;
                this.mOffY = dY - diffY;
            }
            else if (this.elementY + this.elementHeight + dY > this.maxTop) {
                diffY = this.maxTop - this.elementY - this.elementHeight;
                this.mOffY = dY - diffY;
            }
            this.elementHeight += diffY;
        }
        if (this.handleClass && this.handleClass.indexOf('east') >= 0) {
            if (this.elementWidth + dX < this.getMinWidth(panelModel)) {
                diffX = this.getMinWidth(panelModel) - this.elementWidth;
                this.mOffX = dX - diffX;
            }
            else if (this.elementX + this.elementWidth + dX > this.maxLeft) {
                diffX = this.maxLeft - this.elementX - this.elementWidth;
                this.mOffX = dX - diffX;
            }
            this.elementWidth += diffX;
        }
        el.style.top = this.elementY + 'px';
        el.style.left = this.elementX + 'px';
        el.style.width = this.elementWidth + 'px';
        el.style.height = this.elementHeight + 'px';
        let item = this.getResizeRowColumn(panelModel, this.moveTarget);
        if (item.col + item.sizeX > this.columns) {
            item.sizeX = item.sizeX - 1;
        }
        this.shadowEle.style.top = ((item.row * this.getCellSize()[1] + (item.row * this.cellSpacing[1]))) + 'px';
        this.shadowEle.style.left = ((item.col * this.getCellSize()[0]) + ((item.col) * this.cellSpacing[0])) + 'px';
        this.shadowEle.style.height = ((item.sizeY * (this.getCellSize()[1] + (this.cellSpacing[1])))) + 'px';
        this.shadowEle.style.width = ((item.sizeX * (this.getCellSize()[0] + (this.cellSpacing[0])))) + 'px';
        if (oldSizeX !== item.sizeX || oldSizeY !== item.sizeY) {
            oldSizeX = item.sizeX;
            oldSizeY = item.sizeY;
            el.setAttribute('data-sizeX', this.getCellInstance(el.id).sizeX.toString());
            el.setAttribute('data-sizeY', this.getCellInstance(el.id).sizeY.toString());
            el.setAttribute('data-row', this.getCellInstance(el.id).row.toString());
            el.setAttribute('data-col', this.getCellInstance(el.id).col.toString());
            this.mainElement = el;
            this.updatePanelLayout(el, this.getCellInstance(el.id));
            this.updateOldRowColumn();
            this.sortedPanel();
        }
    }
    upResizeHandler(e) {
        if (isNullOrUndefined(this.downTarget)) {
            return;
        }
        this.upTarget = this.downTarget;
        let el = this.upTarget.closest('.e-panel');
        let args = { event: e, element: el };
        this.trigger('resizeStop', args);
        if (el) {
            addClass([el], 'e-panel-transition');
            EventHandler.remove(document, 'mousemove', this.moveResizeHandler);
            if (this.shadowEle) {
                detach(this.shadowEle);
            }
            this.shadowEle = null;
            let panelModel = this.getCellInstance(el.getAttribute('id'));
            this.setPanelPosition(el, panelModel.row, panelModel.col);
            this.setHeightAndWidth(el, panelModel);
        }
        this.resizeCalled = false;
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.updateOldRowColumn();
        this.sortedPanel();
        this.cloneArray = this.sortedArray;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
    }
    getResizeRowColumn(item, e) {
        let col = item.col;
        let row = item.row;
        let sizeX = item.sizeX;
        if (['e-north', 'e-south'].indexOf(this.handleClass) === -1) {
            sizeX = this.pixelsToColumns(this.elementWidth, true);
        }
        let sizeY = item.sizeY;
        if (['e-east', 'e-west'].indexOf(this.handleClass) === -1) {
            sizeY = this.pixelsToRows(this.elementHeight, true);
        }
        if (item.col + item.sizeX > this.columns) {
            item.sizeX = item.sizeX - 1;
        }
        let canOccupy = row > -1 && col > -1 && sizeX + col <= this.maxCol() && sizeY + row <= this.maxRow();
        if (canOccupy && (this.getItems(row, col, sizeX, sizeY, this.getPanelBase(item.id)).length === 0)
            || this.allowPushing !== false) {
            item.row = row;
            item.col = col;
            item.sizeX = sizeX;
            item.sizeY = sizeY;
        }
        return item;
    }
    pixelsToColumns(pixels, isCeil) {
        let curColWidth = this.cellSize[0];
        return Math.ceil(pixels / curColWidth);
    }
    pixelsToRows(pixels, isCeil) {
        return Math.ceil(pixels / this.cellSize[1]);
    }
    getMinWidth(item) {
        return (item.minSizeX) * this.getCellSize()[0];
    }
    ;
    getMinHeight(item) {
        return (item.minSizeY) * this.getCellSize()[1];
    }
    ;
    sortedPanel() {
        this.sortedArray = [];
        for (let i = 0, l = this.panelCollection.length; i < l; ++i) {
            this.sortItem(this.panelCollection[i]);
        }
    }
    moveItemsUpwards() {
        if (this.allowFloating === false) {
            return;
        }
        for (let rowIndex = 0, l = this.sortedArray.length; rowIndex < l; ++rowIndex) {
            let columns = this.sortedArray[rowIndex];
            if (!columns) {
                continue;
            }
            for (let colIndex = 0, len = columns.length; colIndex < len; ++colIndex) {
                let item = columns[colIndex];
                if (item) {
                    this.moveItemUpwards(item);
                }
            }
        }
    }
    ;
    moveItemUpwards(item) {
        if (this.allowFloating === false || item === this.mainElement) {
            return;
        }
        let colIndex = this.getCellInstance(item.id).col;
        let sizeY = parseInt(item.getAttribute('data-sizeY'), 10);
        let sizeX = parseInt(item.getAttribute('data-sizeX'), 10);
        let availableRow = null;
        let availableColumn = null;
        let rowIndex = parseInt(item.getAttribute('data-row'), 10) - 1;
        while (rowIndex > -1) {
            let items = this.collisionItems(rowIndex, colIndex, sizeX, sizeY, item);
            if (items.length !== 0) {
                break;
            }
            availableRow = rowIndex;
            availableColumn = colIndex;
            --rowIndex;
        }
        if (availableRow !== null) {
            this.sortItem(item, availableRow, availableColumn);
        }
    }
    sortItem(item, rowValue, columnValue, ignoreItems) {
        this.overlapElement = [];
        let column = parseInt(item.getAttribute('data-col'), 10);
        let row = parseInt(item.getAttribute('data-row'), 10);
        if (!this.sortedArray[row]) {
            this.sortedArray[row] = [];
        }
        this.sortedArray[row][column] = item;
        if (item !== undefined && rowValue !== undefined && columnValue !== undefined) {
            if (this.oldRowCol[item.id].row !== null &&
                typeof this.oldRowCol[item.id].col !== 'undefined') {
                let isSamePosition = this.oldRowCol[item.id].col === columnValue &&
                    this.oldRowCol[item.id].row === rowValue;
                {
                    let oldRow = this.sortedArray[this.oldRowCol[item.id].row];
                    if (oldRow && oldRow[this.oldRowCol[item.id].col] === item) {
                        delete oldRow[this.oldRowCol[item.id].col];
                        this.updateOldRowColumn();
                        this.sortedPanel();
                    }
                }
            }
            this.oldRowCol[item.id].row = rowValue;
            this.oldRowCol[item.id].row = columnValue;
            if (!this.sortedArray[row]) {
                this.sortedArray[row] = [];
            }
            this.sortedArray[row][column] = item;
            if (this.allItems.indexOf(item) === -1) {
                this.allItems.push(item);
            }
            this.getCellInstance(item.id).row = rowValue;
            this.getCellInstance(item.id).col = columnValue;
            item.setAttribute('data-col', this.getCellInstance(item.id).col.toString());
            item.setAttribute('data-row', this.getCellInstance(item.id).row.toString());
            this.updateLayout(item, this.getCellInstance(item.id));
        }
    }
    updateLayout(element, panelModel) {
        this.setPanelPosition(element, panelModel.row, panelModel.col);
        this.setHeightAndWidth(element, panelModel);
        this.getRowColumn();
        this.setHeightWidth();
        this.sortedPanel();
    }
    ;
    onResize() {
        if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
            this.checkMediaQuerySizing();
        }
        else {
            if (this.element.classList.contains(responsive)) {
                removeClass([this.element], [responsive]);
                for (let i = 0; i < this.element.childElementCount; i++) {
                    let ele = this.element.children[i];
                    let cellInstance = this.getCellInstance(ele.id);
                    let row = parseInt(ele.getAttribute('data-row'), 10);
                    let col = parseInt(ele.getAttribute('data-col'), 10);
                    cellInstance.row = row;
                    cellInstance.col = col;
                    this.setHeightAndWidth(ele, this.getCellInstance(ele.id));
                    this.setPanelPosition(ele, row, col);
                    this.getRowColumn();
                    this.setHeightWidth();
                }
            }
            this.panelResponsiveUpdate();
        }
        this.removeResizeClasses(this.panelCollection);
        this.setClasses(this.panelCollection);
        this.checkDragging(this.dragCollection);
    }
    checkDragging(dragCollection) {
        if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches || !this.allowDragging) {
            for (let i = 0; i < dragCollection.length; i++) {
                dragCollection[i].destroy();
            }
        }
        else {
            for (let i = 0; i < dragCollection.length; i++) {
                dragCollection[i].destroy();
            }
            this.enableDraggingContent(this.panelCollection);
        }
    }
    checkMediaQuerySizing() {
        addClass([this.element], [responsive]);
        let panelElements = this.element.querySelectorAll('.e-panel');
        this.updatedRows = panelElements.length;
        for (let i = 0; i < panelElements.length; i++) {
            if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
                setStyleAttribute(panelElements[i], { 'width': '100%' });
                panelElements[i].style.height = ' ' + (this.element.parentElement.offsetWidth / this.cellAspectRatio) + 'px';
                this.cellSize[1] = (this.element.parentElement.offsetWidth / this.cellAspectRatio);
                let panelModel = this.getCellInstance(panelElements[i].id);
                panelModel.col = 0;
                panelModel.row = i;
                this.setPanelPosition(panelElements[i], panelModel.row, panelModel.col);
                this.setClasses(this.panelCollection);
                this.checkDragging(this.dragCollection);
                this.removeResizeClasses(this.panelCollection);
            }
        }
        this.getRowColumn();
        this.setHeightWidth();
    }
    panelResponsiveUpdate() {
        this.element.classList.add('e-responsive');
        this.calculateCellSize();
        for (let i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
            let ele = this.element.querySelectorAll('.e-panel')[i];
            let panelModel = this.getCellInstance(ele.id);
            this.setHeightAndWidth(ele, panelModel);
        }
        for (let i = 0; i < this.panels.length; i++) {
            this.setPanelPosition(document.getElementById(this.panels[i].id), this.panels[i].row, this.panels[i].col);
        }
        this.getRowColumn();
        this.setHeightWidth();
    }
    setHeightWidth() {
        let heightValue;
        let widthValue;
        if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
            heightValue = ((this.maxRow()) *
                (this.element.parentElement && Math.floor((this.element.parentElement.offsetWidth)) / this.cellAspectRatio) +
                (this.maxRow() - 1) * this.cellSpacing[1]) + 'px';
        }
        else {
            heightValue = ((this.maxRow()) *
                (this.cellSize[0] / this.cellAspectRatio) + (this.maxRow() - 1) * this.cellSpacing[1]) + 'px';
        }
        setStyleAttribute(this.element, { 'height': heightValue });
        widthValue = window.getComputedStyle(this.element).width;
        setStyleAttribute(this.element, { 'width': widthValue });
    }
    setHeightAndWidth(panelElement, panelModel) {
        setStyleAttribute(panelElement, { 'height': formatUnit(this.setXYDimensions(panelModel)[0]) });
        setStyleAttribute(panelElement, { 'width': formatUnit(this.setXYDimensions(panelModel)[1]) });
    }
    renderCell(panel) {
        this.dimensions = this.setXYDimensions(panel);
        if (isUndefined(panel.enabled)) {
            panel.enabled = true;
        }
        let cellElement = this.createPanelElement(panel.cssClass, panel.id, '');
        let dashBoardCell = this.renderPanels(cellElement, panel);
        this.element.appendChild(cellElement);
        this.panelCollection.push(dashBoardCell);
        this.setXYAttributes(cellElement, panel);
        this.setHeightAndWidth(cellElement, panel);
        return cellElement;
    }
    setPanelPosition(cellElement, row, col) {
        if (!cellElement) {
            return;
        }
        let heightValue = this.getCellSize()[1];
        let widthValue = this.getCellSize()[0];
        let left = col === 0 ? 0 : (((col) * (parseInt(widthValue.toString(), 10) + this.cellSpacing[0])));
        let top = row === 0 ? 0 : (((row) * (parseInt(heightValue.toString(), 10) + this.cellSpacing[1])));
        setStyleAttribute(cellElement, { 'left': left + 'px', 'top': top + 'px' });
    }
    getRowColumn() {
        this.calculateMaxColumnValue(this.panels);
        if (this.columns < this.maxColumnValue) {
            this.columns = this.maxColumnValue;
        }
        this.rows = null;
        if (this.element.querySelectorAll('.e-panel').length > 0 && !this.updatedRows) {
            let panelElements = this.element.querySelectorAll('.e-panel');
            for (let i = 0; i < panelElements.length; i++) {
                let panelElement = panelElements[i];
                let rowValue = parseInt(panelElement.getAttribute('data-row'), 10);
                let xValue = parseInt(panelElement.getAttribute('data-sizeY'), 10);
                this.rows = Math.max(this.rows, (rowValue + xValue));
            }
        }
        else {
            if (this.updatedRows) {
                this.rows = this.updatedRows;
                this.updatedRows = null;
            }
            for (let i = 0; i < this.panels.length; i++) {
                this.rows = Math.max(this.rows, this.panels[i].row);
            }
        }
    }
    setMinMaxValues(panel) {
        if (!panel.sizeX || panel.sizeX < panel.minSizeX) {
            panel.sizeX = panel.minSizeX;
        }
        else if ((panel.maxSizeX && panel.sizeX > panel.maxSizeX)) {
            panel.sizeX = panel.maxSizeX;
        }
        else if (panel.sizeX > this.columns) {
            panel.sizeX = this.columns;
        }
        else {
            panel.sizeX = panel.sizeX;
        }
        if (!panel.sizeY || panel.sizeY < panel.minSizeY) {
            panel.sizeY = panel.minSizeY;
        }
        else if (panel.maxSizeY && panel.sizeY > panel.maxSizeY) {
            panel.sizeY = panel.maxSizeY;
        }
        else {
            panel.sizeY = panel.sizeY;
        }
    }
    calculateMaxColumnValue(panels) {
        for (let count = 0; count < panels.length; count++) {
            let panel = panels[count];
            if (isUndefined(this.maxColumnValue)) {
                this.maxColumnValue = panel.col + panel.sizeX;
            }
            else if (this.maxColumnValue < panel.col) {
                this.maxColumnValue = panel.col + panel.sizeX;
            }
            if (this.maxColumnValue < panel.col + panel.sizeX) {
                this.maxColumnValue = panel.sizeX + panel.col;
            }
        }
    }
    renderDashBoardCells(cells) {
        let isValid = true;
        if (this.panels.length === 1) {
            if (isNullOrUndefined(this.panels[0].content)) {
                isValid = false;
            }
            else {
                isValid = true;
            }
        }
        if (this.element.querySelectorAll('.e-panel').length > 0 || (isValid && (this.panels.length > 0))) {
            for (let j = 0; j < cells.length; j++) {
                this.gridPanelCollection.push(cells[j]);
                this.setMinMaxValues(cells[j]);
                let cell = this.renderCell(cells[j]);
                if (this.enableRtl) {
                    addClass([cell], 'e-rtl');
                }
                this.element.appendChild(cell);
                if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
                    this.checkMediaQuerySizing();
                }
                else {
                    this.setPanelPosition(cell, cells[j].row, cells[j].col);
                    this.updatePanelLayout(cell, cells[j]);
                }
            }
        }
        this.setClasses(this.panelCollection);
    }
    collisionItems(row, col, sizeX, sizeY, ignore) {
        let items = [];
        if (!sizeX || !sizeY) {
            sizeX = sizeY = 1;
        }
        if (ignore && !(ignore instanceof Array)) {
            ignore = [ignore];
        }
        let item;
        for (let h = 0; h < sizeY; ++h) {
            for (let w = 0; w < sizeX; ++w) {
                item = this.getPanel(row + h, col + w, ignore);
                if (item && (!ignore || ignore.indexOf(document.getElementById(item.id)) === -1) &&
                    items.indexOf(document.getElementById(item.id)) === -1) {
                    items.push(document.getElementById(item.id));
                }
            }
        }
        return items;
    }
    ;
    rightWardsSpaceChecking(rowElements, col, ele) {
        let columns = [];
        let spacedColumns = [];
        rowElements.forEach((element) => {
            let columnValue = parseInt(element.getAttribute('data-col'), 10);
            let sizeXValue = parseInt(element.getAttribute('data-sizeX'), 10);
            if (col < this.columns && columnValue >= col) {
                if (sizeXValue > 1) {
                    for (let i = columnValue; i < columnValue + sizeXValue; i++) {
                        columns.push(i);
                    }
                }
                else {
                    columns.push(columnValue);
                }
            }
        });
        if (columns.length > 0) {
            for (let i = col + 1; i <= this.columns - 1; i++) {
                if (columns.indexOf(i) === -1 && i !== col) {
                    if (spacedColumns.indexOf(i) === -1) {
                        spacedColumns.push(i);
                    }
                }
            }
        }
        let occupiedValues = this.getOccupiedColumns(ele, 'right');
        occupiedValues.forEach((colValue) => {
            if (colValue > col && spacedColumns.indexOf(colValue) !== -1) {
                spacedColumns.splice(spacedColumns.indexOf(colValue), 1);
            }
        });
        let eleOccupiedValues = this.getOccupiedColumns(this.checkingElement, 'left');
        eleOccupiedValues.forEach((col) => {
            if (col > parseInt(ele.getAttribute('data-col'), 10) && occupiedValues.indexOf(col) === -1 &&
                spacedColumns.indexOf(col) === -1) {
                spacedColumns.push(col);
            }
        });
        spacedColumns = spacedColumns.sort((next, previous) => { return next - previous; });
        return spacedColumns;
    }
    getOccupiedColumns(element, type) {
        let occupiedItems = [];
        let sizeX = parseInt(element.getAttribute('data-sizeX'), 10);
        let col = parseInt(element.getAttribute('data-col'), 10);
        for (let i = col; (i < col + sizeX && i <= this.columns); i++) {
            occupiedItems.push(i);
        }
        return occupiedItems;
    }
    leftWardsSpaceChecking(rowElements, col, ele) {
        let spacedColumns = [];
        let columns = [];
        rowElements.forEach((element) => {
            let colValue = parseInt(element.getAttribute('data-col'), 10);
            let xValue = parseInt(element.getAttribute('data-sizeX'), 10);
            if (col <= this.columns && colValue <= col) {
                if (xValue > 1) {
                    for (let i = colValue; i < colValue + xValue; i++) {
                        columns.push(i);
                    }
                }
                else {
                    columns.push(colValue);
                }
            }
        });
        if (columns.length > 0) {
            for (let i = 0; i <= col; i++) {
                if (columns.indexOf(i) === -1 && i !== col) {
                    if (spacedColumns.indexOf(i) === -1) {
                        spacedColumns.push(i);
                    }
                }
            }
        }
        let occupiedValues = this.getOccupiedColumns(ele, 'left');
        occupiedValues.forEach((colValue) => {
            if (colValue < col && spacedColumns.indexOf(colValue) !== -1) {
                spacedColumns.splice(spacedColumns.indexOf(colValue), 1);
            }
        });
        let eleOccupiedValues = this.getOccupiedColumns(this.checkingElement, 'left');
        eleOccupiedValues.forEach((col) => {
            if (col < parseInt(ele.getAttribute('data-col'), 10) && occupiedValues.indexOf(col) === -1 &&
                spacedColumns.indexOf(col) === -1) {
                spacedColumns.push(col);
            }
        });
        spacedColumns = spacedColumns.sort((next, prev) => { return next - prev; });
        spacedColumns = spacedColumns.reverse();
        return spacedColumns;
    }
    adjustmentAvailable(row, col, sizeY, sizeX, ele) {
        this.leftAdjustable = undefined;
        this.rightAdjustable = undefined;
        let isAdjustable = false;
        let leftSpacing;
        let rightSpacing;
        let rowElement = [];
        this.topAdjustable = undefined;
        let eleSizeX = parseInt(ele.getAttribute('data-sizeX'), 10);
        let eleCol = parseInt(ele.getAttribute('data-col'), 10);
        rowElement = this.getRowElements(this.collisionItems(row, 0, this.columns, sizeY, []));
        if (rowElement.indexOf(ele) === -1) {
            rowElement.push(ele);
        }
        leftSpacing = this.leftWardsSpaceChecking(rowElement, col, ele);
        if (leftSpacing.length > 0) {
            this.leftAdjustable = this.isLeftAdjustable(leftSpacing, ele, row, col, sizeX, sizeY);
            if (this.spacedColumnValue !== eleCol - this.getCellInstance(this.checkingElement.id).sizeX) {
                this.leftAdjustable = false;
            }
            if (this.leftAdjustable) {
                this.rightAdjustable = false;
            }
            else {
                this.leftAdjustable = false;
                rightSpacing = this.rightWardsSpaceChecking(rowElement, col, ele);
                this.rightAdjustable = rightSpacing.length > 0 ? this.isRightAdjustable(rightSpacing, ele, row, col, sizeX, sizeY) : false;
                if (this.spacedColumnValue !== eleSizeX + eleCol) {
                    this.rightAdjustable = false;
                }
                if (!this.rightAdjustable) {
                    this.rightAdjustable = false;
                }
            }
        }
        else {
            rightSpacing = this.rightWardsSpaceChecking(rowElement, col, ele);
            this.rightAdjustable = rightSpacing.length > 0 ? this.isRightAdjustable(rightSpacing, ele, row, col, sizeX, sizeY) : false;
            if (this.spacedColumnValue !== eleSizeX + eleCol) {
                this.rightAdjustable = false;
            }
            if (this.rightAdjustable) {
                this.leftAdjustable = false;
            }
        }
        if (!this.rightAdjustable && !this.leftAdjustable && row > 0) {
            let endRow = this.getCellInstance(ele.id).row;
            let topCheck = false;
            if (this.startRow !== endRow) {
                topCheck = true;
            }
            for (let rowValue = row; rowValue >= 0; rowValue--) {
                let element = (this.getCellInstance(ele.id).sizeY > 1 && topCheck) ? this.checkingElement : ele;
                if ((rowValue !== endRow) && (sizeY > 1 ? rowValue === endRow - sizeY - 1 : rowValue === endRow - sizeY) &&
                    this.collisionItems(rowValue, col, sizeX, sizeY, element).length === 0) {
                    topCheck = false;
                    this.topAdjustable = true;
                    this.spacedRowValue = isNullOrUndefined(this.spacedRowValue) ? rowValue : this.spacedRowValue;
                    this.spacedColumnValue = col;
                }
            }
        }
        if (this.rightAdjustable || this.leftAdjustable || this.topAdjustable) {
            isAdjustable = true;
            if (isNullOrUndefined(this.spacedRowValue)) {
                this.spacedRowValue = row;
            }
        }
        return isAdjustable;
    }
    isXSpacingAvailable(spacing, sizeX) {
        let isSpaceAvailable = false;
        let subSpacingColumns = [];
        for (let i = 0; i < spacing.length; i++) {
            if (spacing[i + 1] - spacing[i] === 1 || spacing[i + 1] - spacing[i] === -1) {
                subSpacingColumns.push(spacing[i]);
                if (sizeX === 2) {
                    subSpacingColumns.push(spacing[i + 1]);
                }
                if (i === spacing.length - 2) {
                    subSpacingColumns.push(spacing[i + 1]);
                    if (subSpacingColumns.length > sizeX) {
                        subSpacingColumns.splice(-1);
                    }
                }
                if (subSpacingColumns.length === sizeX) {
                    isSpaceAvailable = true;
                    this.spacedColumnValue = subSpacingColumns.sort((next, previous) => { return next - previous; })[0];
                    if (this.spacedColumnValue < 0) {
                        this.spacedColumnValue = 1;
                    }
                    return isSpaceAvailable;
                }
            }
            else {
                subSpacingColumns = [];
                continue;
            }
        }
        return isSpaceAvailable;
    }
    getRowElements(base) {
        let rowElements = [];
        for (let i = 0; i < base.length; i++) {
            rowElements.push(base[i]);
        }
        return rowElements;
    }
    isLeftAdjustable(spaces, ele, row, col, sizeX, sizeY) {
        let isLeftAdjudtable;
        if (sizeX === 1 && sizeY === 1 && spaces.length > 0) {
            this.spacedColumnValue = spaces[0];
            isLeftAdjudtable = true;
        }
        else if (sizeX > 1 && sizeY === 1) {
            isLeftAdjudtable = this.isXSpacingAvailable(spaces, sizeX);
        }
        else if (sizeY > 1) {
            if (sizeX === 1) {
                let xAdjust;
                if (spaces.length >= 1) {
                    xAdjust = true;
                }
                if (xAdjust) {
                    for (let i = 0; i < spaces.length; i++) {
                        let collisionValue = this.collisionItems(row, spaces[i], sizeX, sizeY, this.checkingElement);
                        if (collisionValue.length === 0) {
                            this.spacedColumnValue = spaces[i];
                            isLeftAdjudtable = true;
                            return isLeftAdjudtable;
                        }
                        else {
                            isLeftAdjudtable = false;
                        }
                    }
                }
            }
            else {
                let checkValues = this.getColumnValues(this.checkingElement);
                let eleValues = this.getColumnValues(ele);
                isLeftAdjudtable = this.replacable(spaces, sizeX, row, sizeY, ele);
            }
        }
        return isLeftAdjudtable;
    }
    isRightAdjustable(spacing, ele, row, col, sizeX, sizeY) {
        let isRightAdjudtable;
        if (sizeX === 1 && sizeY === 1 && spacing.length > 0) {
            this.spacedColumnValue = spacing[0];
            isRightAdjudtable = true;
        }
        else if (sizeX > 1 && sizeY === 1) {
            isRightAdjudtable = this.isXSpacingAvailable(spacing, sizeX);
        }
        else if (sizeY > 1) {
            if (sizeX === 1) {
                let xAdjust;
                if (spacing.length >= 1) {
                    xAdjust = true;
                }
                if (xAdjust) {
                    for (let i = 0; i < spacing.length; i++) {
                        let collisionValue = this.collisionItems(row, spacing[i], sizeX, sizeY, this.checkingElement);
                        for (let collision = 0; collision < collisionValue.length; collision++) {
                            if (parseInt(ele.getAttribute('data-col'), 10) !== spacing[i]) {
                                collisionValue.splice(collisionValue.indexOf(collisionValue[collision]), 1);
                            }
                        }
                        if (collisionValue.length === 0) {
                            isRightAdjudtable = true;
                            this.spacedColumnValue = spacing[i];
                            return isRightAdjudtable;
                        }
                        else {
                            isRightAdjudtable = false;
                        }
                    }
                }
            }
            else {
                let subValues = this.getColumnValues(this.checkingElement);
                let eleValues = this.getColumnValues(ele);
                isRightAdjudtable = this.replacable(spacing, sizeX, row, sizeY, ele);
            }
        }
        return isRightAdjudtable;
    }
    replacable(spacing, sizeX, row, sizeY, ele) {
        let isRightAdjudtable;
        let updatedCollision = [];
        for (let j = 0; j < spacing.length; j++) {
            let xAdjust = this.isXSpacingAvailable(spacing, sizeX);
            if (xAdjust) {
                let exclusions = [];
                exclusions.push(this.checkingElement);
                exclusions.push(ele);
                if (updatedCollision.length === 0) {
                    isRightAdjudtable = true;
                    this.spacedColumnValue = this.spacedColumnValue;
                    return isRightAdjudtable;
                }
                else {
                    isRightAdjudtable = false;
                }
            }
        }
        return isRightAdjudtable;
    }
    getColumnValues(element) {
        let colValues = [];
        let colValue = parseInt(element.getAttribute('data-col'), 10);
        let sizeXValue = parseInt(element.getAttribute('data-sizeX'), 10);
        for (let i = colValue; i < colValue + sizeXValue; i++) {
            colValues.push(i);
        }
        return colValues;
    }
    sortCollisionItems(collisionItems) {
        let updatedCollision = [];
        let rowElements;
        for (let row = this.rows - 1; row >= 0; row--) {
            rowElements = [];
            collisionItems.forEach((element) => {
                if (element && element.getAttribute('data-row') === row.toString()) {
                    rowElements.push(element);
                }
            });
            for (let column = this.columns - 1; column >= 0; column--) {
                rowElements.forEach((item) => {
                    if (item && item.getAttribute('data-col') === column.toString()) {
                        updatedCollision.push(item);
                    }
                });
            }
        }
        return updatedCollision;
    }
    updatedModels(collisionItems, panelModel, ele) {
        if (!this.mainElement) {
            this.sortedPanel();
        }
        collisionItems.forEach((element) => {
            this.checkingElement = element;
            let model = this.getCellInstance(element.id);
            let adjust = !this.adjustmentAvailable(model.row, model.col, model.sizeY, model.sizeX, ele);
            if (model.sizeX > 1 && adjust) {
                for (let rowValue = model.row; rowValue < panelModel.row + panelModel.sizeY; rowValue++) {
                    let collisions = this.collisionItems(rowValue, model.col, model.sizeX, model.sizeY, element);
                    collisions.forEach((item) => {
                        if (collisionItems.indexOf(item) >= 0) {
                            collisionItems.splice(collisionItems.indexOf(item), 1);
                        }
                    });
                }
            }
        });
        return collisionItems;
    }
    resetLayout(model, element) {
        let collisions = this.collisionItems(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
        if (!this.mainElement || this.addPanelCalled || this.resizeCalled || this.movePanelCalled) {
            return collisions;
        }
        if (this.mainElement && this.oldRowCol !== this.cloneObject) {
            for (let i = 0; i < this.panels.length; i++) {
                let element = document.getElementById(this.panels[i].id);
                if (element === this.mainElement) {
                    continue;
                }
                let rowValue = this.cloneObject[element.id].row;
                let colValue = this.cloneObject[element.id].col;
                this.setPanelPosition(element, rowValue, colValue);
                this.getCellInstance(element.id).row = rowValue;
                this.getCellInstance(element.id).col = colValue;
                element.setAttribute('data-row', rowValue.toString());
                element.setAttribute('data-col', colValue.toString());
                this.updateOldRowColumn();
            }
        }
        this.sortedArray = this.cloneArray;
        collisions = this.collisionItems(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
        this.sortedPanel();
        this.updateOldRowColumn();
        if (this.checkCollision && this.checkCollision.length > 0 && collisions.indexOf(this.checkCollision[0]) === -1 &&
            this.cloneObject[this.checkCollision[0].id].row === model.row) {
            collisions.push(this.checkCollision[0]);
        }
        return collisions;
    }
    swapAvailability(collisions, element) {
        let available = true;
        let eleModel = this.getCellInstance(element.id);
        for (let count = 0; count < collisions.length; count++) {
            let collideModel = this.getCellInstance(collisions[count].id);
            for (let i = 1; i < eleModel.sizeY; i++) {
                let excludeEle = [];
                excludeEle.push(element);
                excludeEle.push(collisions[count]);
                let collision;
                collision = this.collisionItems(eleModel.row + i, collideModel.col, collideModel.sizeX, collideModel.sizeY, excludeEle);
                if (collision.length > 0) {
                    available = false;
                    return false;
                }
                else {
                    continue;
                }
            }
        }
        return available;
    }
    checkForSwapping(collisions, element, panelModel) {
        if (!this.mainElement || collisions.length === 0) {
            return false;
        }
        let direction;
        let eleSwapRow = parseInt(collisions[0].getAttribute('data-row'), 10);
        if (this.startRow < eleSwapRow) {
            direction = 1;
        }
        else if (this.startRow > eleSwapRow) {
            direction = 0;
        }
        if (!this.swapAvailability(collisions, element)) {
            return false;
        }
        let isSwappable = false;
        for (let count1 = 0; count1 < collisions.length; count1++) {
            if (collisions.length >= 1 && this.cloneObject[this.mainElement.id].row === this.oldRowCol[this.mainElement.id].row) {
                return false;
            }
        }
        let updatedRow = direction === 0 ?
            this.getCellInstance(this.mainElement.id).row + this.getCellInstance(this.mainElement.id).sizeY
            : this.startRow;
        for (let count = 0; count < collisions.length; count++) {
            let collideInstance = this.getCellInstance(collisions[count].id);
            let elementinstance = this.getCellInstance(element.id);
            let ignore = [];
            if (collideInstance.sizeY === 1) {
                ignore.push(collisions[count]);
            }
            else if (collideInstance.sizeY > 1) {
                if (direction === 1 && elementinstance.row === (this.cloneObject[collideInstance.id].row + collideInstance.sizeY - 1)) {
                    ignore.push(collisions[count]);
                }
                else if (direction === 0 && elementinstance.row === (this.cloneObject[collideInstance.id].row)) {
                    ignore.push(collisions[count]);
                }
                else {
                    return false;
                }
            }
            if (collideInstance.sizeY <= elementinstance.sizeY) {
                ignore.push(collisions[count]);
            }
            let swapCollision;
            swapCollision = this.collisionItems(updatedRow, collideInstance.col, collideInstance.sizeX, collideInstance.sizeY, ignore);
            if (swapCollision.length > 0) {
                isSwappable = false;
                return isSwappable;
            }
            else {
                if (count === collisions.length - 1) {
                    isSwappable = true;
                }
                continue;
            }
        }
        return isSwappable;
    }
    swapItems(collisions, element, panelModel) {
        let direction;
        let swappedElements = [];
        swappedElements.push(element);
        let eleSwapRow = parseInt(collisions[0].getAttribute('data-row'), 10);
        if (this.startRow < eleSwapRow) {
            direction = 1;
        }
        else if (this.startRow > eleSwapRow) {
            direction = 0;
        }
        let collisionItemsRow = direction === 0 ? eleSwapRow + panelModel.sizeY : this.startRow;
        panelModel.row = direction === 0 ? eleSwapRow : collisionItemsRow + 1;
        for (let count = 0; count < collisions.length; count++) {
            swappedElements.push(collisions[count]);
            this.setPanelPosition(collisions[count], collisionItemsRow, (this.getCellInstance(collisions[count].id)).col);
            this.getCellInstance(collisions[count].id).row = collisionItemsRow;
            collisions[count].setAttribute('data-row', collisionItemsRow.toString());
        }
        element.setAttribute('data-row', panelModel.row.toString());
        this.setPanelPosition(this.shadowEle, panelModel.row, panelModel.col);
        for (let i = 0; i < this.panels.length; i++) {
            this.oldRowCol[this.panels[i].id] = { row: this.panels[i].row, col: this.panels[i].col };
        }
        this.startRow = panelModel.row;
        this.updateOldRowColumn();
        swappedElements.forEach((item) => {
            this.cloneObject[item.id] = this.oldRowCol[item.id];
            let itemModel = this.getCellInstance(item.id);
            for (let i = 0; i < this.sortedArray.length; i++) {
                if (!this.sortedArray[i]) {
                    continue;
                }
                for (let j = 0; j < this.sortedArray[i].length; j++) {
                    if (this.sortedArray[i][j] === item) {
                        this.sortedArray[i][j] = undefined;
                    }
                }
            }
            if (!this.sortedArray[itemModel.row]) {
                this.sortedArray[itemModel.row] = [];
            }
            this.sortedArray[itemModel.row][itemModel.col] = item;
            this.cloneArray = this.sortedArray;
        });
    }
    updatePanelLayout(element, panelModel) {
        this.collisionChecker = {};
        let initialModel = [];
        let checkForAdjustment;
        let collisionModels = [];
        let swappingAvailable;
        if (this.mainElement) {
            initialModel = this.resetLayout(panelModel, element);
        }
        else {
            initialModel = this.collisionItems(panelModel.row, panelModel.col, panelModel.sizeX, panelModel.sizeY, element);
        }
        if (initialModel.length > 0) {
            initialModel = this.sortCollisionItems(initialModel);
            initialModel = this.updatedModels(initialModel, panelModel, element);
            swappingAvailable = !isNullOrUndefined(this.startRow) ? this.checkForSwapping(initialModel, element, panelModel) : false;
            if (swappingAvailable) {
                this.swapItems(initialModel, element, panelModel);
            }
            else {
                for (let i = 0; i < initialModel.length; i++) {
                    let model = this.getCellInstance(initialModel[i].id);
                    this.checkingElement = initialModel[i];
                    this.spacedRowValue = null;
                    this.spacedColumnValue = null;
                    checkForAdjustment = this.adjustmentAvailable(model.row, model.col, model.sizeY, model.sizeX, element);
                    if (checkForAdjustment && !isNullOrUndefined(this.spacedColumnValue)) {
                        this.setPanelPosition(initialModel[i], this.spacedRowValue, this.spacedColumnValue);
                        this.oldRowCol[(initialModel[i].id)] = { row: this.spacedRowValue, col: this.spacedColumnValue };
                        initialModel[i].setAttribute('data-col', this.spacedColumnValue.toString());
                        initialModel[i].setAttribute('data-row', this.spacedRowValue.toString());
                        model.col = this.spacedColumnValue;
                        model.row = this.spacedRowValue;
                        this.topAdjustable = false;
                        this.spacedRowValue = null;
                        if (i < initialModel.length) {
                            continue;
                        }
                    }
                    else {
                        collisionModels.push(initialModel[i]);
                    }
                }
            }
        }
        if (collisionModels.length > 0) {
            let proxy = this;
            collisionModels.forEach((item1) => {
                if (proxy.overlapElement.indexOf(item1) === -1) {
                    proxy.overlapElement.push(item1);
                }
            });
            if (this.overlapElement && this.overlapElement.indexOf(element) !== -1) {
                this.overlapElement.splice(this.overlapElement.indexOf(element), 1);
            }
            if (collisionModels.length > 0) {
                this.updateRowColumn(panelModel.row, this.overlapElement, element);
                this.checkForCompletePushing();
            }
        }
        if (!this.isSubValue) {
            this.sortedPanel();
        }
        this.getRowColumn();
        this.setHeightWidth();
    }
    checkForCompletePushing() {
        for (let i = 0; i < this.panels.length; i++) {
            if (this.collisionChecker[this.panels[i].id] && this.collisionChecker[this.panels[i].id] !== null) {
                this.overlapElement = [this.collisionChecker[this.panels[i].id].ele];
                let key = this.panels[i].id;
                this.updateRowColumn(this.collisionChecker[key].row, this.overlapElement, this.collisionChecker[key].srcEle);
            }
        }
    }
    updateCollisionChecked(item) {
        for (let count = 0; count < Object.keys(this.collisionChecker).length; count++) {
            this.collisionChecker[item.id] = null;
        }
    }
    updateRowColumn(row, ele, srcEle) {
        if (!srcEle) {
            return;
        }
        let eleSizeY = parseInt(srcEle.getAttribute('data-sizeY'), 10);
        let eleRow = parseInt(srcEle.getAttribute('data-row'), 10);
        this.overlapElementClone = this.overlapElement && !this.shouldRestrict ? this.overlapElement : this.overlapElement;
        for (let i = 0; i < this.overlapElementClone.length; i++) {
            if (this.overlapElementClone.length === 0) {
                return;
            }
            for (let i = 0; i < this.overlapElementClone.length; i++) {
                this.collisionChecker[this.overlapElementClone[i].id] = {
                    ele: this.overlapElementClone[i],
                    row: row,
                    srcEle: srcEle
                };
            }
            let updatedRow = eleRow + eleSizeY;
            let collisionY = parseInt(this.overlapElementClone[i].getAttribute('data-sizeY'), 10);
            let collisionCol = parseInt(this.overlapElementClone[i].getAttribute('data-col'), 10);
            let collisionX = parseInt(this.overlapElementClone[i].getAttribute('data-sizeX'), 10);
            let colValue;
            let collisionModels;
            if (this.overlapSubElementClone.indexOf(srcEle) === -1) {
                this.overlapSubElementClone.push(srcEle);
            }
            if (this.overlapSubElementClone.indexOf(this.overlapElementClone[i]) === -1) {
                this.overlapSubElementClone.push(this.overlapElementClone[i]);
            }
            if (collisionY > 1 || collisionX > 1) {
                let overlapElementModel = this.getCellInstance(this.overlapElementClone[i].id);
                colValue = overlapElementModel.col;
                let ele = document.getElementById(overlapElementModel.id);
                for (let k = overlapElementModel.row; k < eleRow + eleSizeY; k++) {
                    this.isSubValue = true;
                    overlapElementModel.row = overlapElementModel.row + 1;
                    ele.setAttribute('data-row', overlapElementModel.row.toString());
                    this.setPanelPosition(ele, overlapElementModel.row, colValue);
                    this.updateCollisionChecked(ele);
                    this.oldRowCol[(ele.id)] = { row: overlapElementModel.row, col: colValue };
                    let panelModel = this.getCellInstance(ele.id);
                    panelModel.col = colValue;
                    panelModel.row = overlapElementModel.row;
                    let eleRow = parseInt(ele.getAttribute('data-row'), 10);
                    let eleCol = parseInt(ele.getAttribute('data-col'), 10);
                    let sizeX = parseInt(ele.getAttribute('data-sizeX'), 10);
                    let sizeY = parseInt(ele.getAttribute('data-sizeY'), 10);
                    let excludeElements = [];
                    excludeElements.push(ele);
                    excludeElements.push(srcEle);
                    collisionModels = this.collisionItems(eleRow, eleCol, sizeX, sizeY, excludeElements);
                    if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                        collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                    }
                    this.updatePanel(collisionModels, eleCol, eleRow, ele);
                }
                this.isSubValue = false;
            }
            else {
                if (this.addPanelCalled) {
                    this.addPanelCalled = false;
                }
                this.overlapElementClone[i].setAttribute('data-row', updatedRow.toString());
                let excludeEle = [];
                excludeEle.push(this.overlapElementClone[i]);
                excludeEle.push(srcEle);
                collisionModels = this.collisionItems(updatedRow, collisionCol, collisionX, collisionY, excludeEle);
                if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                    collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                }
                colValue = parseInt(this.overlapElementClone[i].getAttribute('data-col'), 10);
                this.setPanelPosition(this.overlapElementClone[i], updatedRow, colValue);
                this.updateCollisionChecked(this.overlapElementClone[i]);
                this.oldRowCol[(this.overlapElementClone[i].id)] = { row: updatedRow, col: colValue };
                let panelModel = this.getCellInstance(this.overlapElementClone[i].id);
                panelModel.col = colValue;
                panelModel.row = updatedRow;
                this.updatePanel(collisionModels, colValue, updatedRow, this.overlapElementClone[i]);
            }
        }
    }
    updatePanel(collisionModels, colValue, updatedRow, clone) {
        let panelModel = this.getCellInstance(clone.id);
        panelModel.col = colValue;
        panelModel.row = updatedRow;
        if (collisionModels.length > 0) {
            let proxy = this;
            this.overlapElement = [];
            this.shouldRestrict = true;
            collisionModels.forEach((item1) => {
                proxy.overlapElement.push(item1);
            });
            let overlapElementRow1 = parseInt(clone.getAttribute('data-row'), 10);
            for (let m = 0; m < this.overlapElement.length; m++) {
                this.updateRowColumn(overlapElementRow1, this.overlapElement, clone);
            }
            this.shouldRestrict = false;
        }
        else {
            if (!this.addPanelCalled) {
                this.sortedPanel();
            }
            if (this.overlapSubElementClone.length > 0) {
                for (let p = 0; p < this.overlapSubElementClone.length; p++) {
                    let rowVal = parseInt(this.overlapSubElementClone[p].getAttribute('data-row'), 10);
                    let colValue = parseInt(this.overlapSubElementClone[p].getAttribute('data-col'), 10);
                    let sizeX = parseInt(this.overlapSubElementClone[p].getAttribute('data-sizeX'), 10);
                    let sizeY = parseInt(this.overlapSubElementClone[p].getAttribute('data-sizeY'), 10);
                    let collisionModels1;
                    collisionModels1 = this.collisionItems(rowVal, colValue, sizeX, sizeY, this.overlapSubElementClone);
                    if (this.mainElement && collisionModels1.indexOf(this.mainElement) !== -1) {
                        collisionModels1.splice(collisionModels1.indexOf(this.mainElement), 1);
                    }
                    let proxy = this;
                    collisionModels1.forEach((item1) => {
                        proxy.overlapElement.push(item1);
                    });
                    if (collisionModels1.length > 0) {
                        this.updateRowColumn(rowVal, this.overlapElement, this.overlapSubElementClone[p]);
                    }
                }
            }
            this.overlapSubElementClone = [];
        }
    }
    removeResizeClasses(panelElements) {
        for (let i = 0; i < panelElements.length; i++) {
            let element = panelElements[i];
            let resizerElements = element.querySelectorAll('.e-resize');
            for (let i = 0; i < resizerElements.length; i++) {
                detach(resizerElements[i]);
            }
        }
    }
    setClasses(panelCollection) {
        for (let i = 0; i < panelCollection.length; i++) {
            let element = panelCollection[i];
            let containerEle = panelCollection[i].querySelector('.e-panel-container');
            if (this.allowDragging) {
                if (this.draggableHandle && element.querySelectorAll(this.draggableHandle)[0]) {
                    addClass([element.querySelectorAll(this.draggableHandle)[0]], [draggable]);
                }
            }
            if (this.allowResizing &&
                this.mediaQuery ? !window.matchMedia('(' + this.mediaQuery + ')').matches : false) {
                this.setResizingClass(element, containerEle);
            }
        }
    }
    setResizingClass(ele, container) {
        this.availableClasses = this.resizableHandles || [southEast];
        for (let j = 0; j < this.availableClasses.length; j++) {
            let spanEle = this.createElement('span');
            let addClassValue;
            container.appendChild(spanEle);
            addClassValue = double;
            addClass([spanEle], [addClassValue, this.availableClasses[j], resize]);
        }
    }
    setXYAttributes(element, panelModel) {
        element.setAttribute('data-sizex', panelModel.sizeX.toString());
        element.setAttribute('data-sizey', panelModel.sizeY.toString());
        if (!isNullOrUndefined(panelModel.row)) {
            element.setAttribute('data-row', panelModel.row.toString());
        }
        if (!isNullOrUndefined(panelModel.col)) {
            element.setAttribute('data-col', panelModel.col.toString());
        }
        if (!isNullOrUndefined(panelModel.minSizeX)) {
            element.setAttribute('data-minSizeX', panelModel.minSizeX.toString());
        }
        if (!isNullOrUndefined(panelModel.minSizeY)) {
            element.setAttribute('data-minSizeY', panelModel.minSizeY.toString());
        }
        if (!isNullOrUndefined(panelModel.maxSizeX)) {
            element.setAttribute('data-maxSizeX', panelModel.maxSizeX.toString());
        }
        if (!isNullOrUndefined(panelModel.maxSizeY)) {
            element.setAttribute('data-maxSizeY', panelModel.maxSizeY.toString());
        }
    }
    setXYDimensions(panelModel) {
        let cellHeight = this.getCellSize()[1];
        let cellWidth = this.getCellSize()[0];
        let widthValue;
        let heigthValue;
        if (panelModel && typeof (cellWidth) === 'number' && typeof (panelModel.sizeX) === 'number' && panelModel.sizeX > 1) {
            widthValue = (panelModel.sizeX * cellWidth) + (panelModel.sizeX - 1) * this.cellSpacing[0];
        }
        else {
            widthValue = cellWidth;
        }
        if (panelModel && typeof (cellHeight) === 'number' && panelModel.sizeY > 1 && typeof (panelModel.sizeY) === 'number') {
            heigthValue = (panelModel.sizeY * cellHeight) + (panelModel.sizeY - 1) * this.cellSpacing[1];
        }
        else {
            heigthValue = formatUnit(cellHeight);
        }
        return [heigthValue, widthValue];
    }
    getRowColumnDragValues(args) {
        let value = [];
        let elementTop = parseInt(args.element.style.top, 10);
        let elementLeft = parseInt(args.element.style.left, 10);
        let row = Math.round(elementTop / (this.getCellSize()[1] + this.cellSpacing[1]));
        let col = Math.round(elementLeft / (this.getCellSize()[0] + +this.cellSpacing[0]));
        value = [row, col];
        return value;
    }
    enableDraggingContent(collections) {
        for (let i = 0; i < collections.length; i++) {
            let cellElement = collections[i];
            {
                this.dragobj = new Draggable(cellElement, {
                    clone: false,
                    dragArea: this.element,
                    handle: this.draggableHandle ? this.draggableHandle : '.e-panel',
                    abort: '.e-resize',
                    dragStart: this.onDraggingStart.bind(this),
                    dragStop: (args) => {
                        let model = this.getCellInstance(this.mainElement.id);
                        if (this.allowPushing &&
                            this.collisionItems(model.row, model.col, model.sizeX, model.sizeY, this.mainElement).length > 0) {
                            this.setHolderPosition(args);
                            this.setPanelPosition(this.mainElement, model.row, model.col);
                            this.updatePanelLayout(this.mainElement, model);
                        }
                        else {
                            this.setPanelPosition(this.mainElement, model.row, model.col);
                        }
                        let changedPanels = [];
                        this.mainElement = null;
                        let item = this.getPanelBase(args);
                        if (this.shadowEle) {
                            detach(this.shadowEle);
                        }
                        removeClass([this.element], [preventSelect]);
                        removeClass([args.element], [dragging]);
                        this.shadowEle = null;
                        args.element.classList.remove('e-dragging');
                        let row = this.getRowColumnDragValues(args)[0];
                        let col = this.getRowColumnDragValues(args)[1];
                        let panelModel = this.getCellInstance(args.element.id);
                        if (this.allowPushing &&
                            this.getItems(row, col, panelModel.sizeX, panelModel.sizeY, document.getElementById(item.id)).length === 0) {
                            this.oldRowCol[args.element.id].row = this.getCellInstance(args.element.id).row = row;
                            this.oldRowCol[args.element.id].col = this.getCellInstance(args.element.id).col = col;
                            args.element.setAttribute('data-col', col.toString());
                            args.element.setAttribute('data-row', row.toString());
                            this.sortedPanel();
                        }
                        else {
                            this.getCellInstance(args.element.id).row = this.oldRowCol[args.element.id].row;
                            this.getCellInstance(args.element.id).col = this.oldRowCol[args.element.id].col;
                            args.element.setAttribute('data-col', this.getCellInstance(args.element.id).col.toString());
                            args.element.setAttribute('data-row', this.getCellInstance(args.element.id).row.toString());
                            this.sortedPanel();
                        }
                        let panelInstance = this.getCellInstance(args.element.id);
                        this.setPanelPosition(args.element, panelInstance.row, panelInstance.col);
                        this.moveItemsUpwards();
                        this.updateOldRowColumn();
                        this.sortedPanel();
                        this.cloneArray = this.sortedArray;
                        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
                        for (let i = 0; i < this.panels.length; i++) {
                            if (this.panels[i].row !== this.panelsInitialModel[i].row ||
                                this.panels[i].col !== this.panelsInitialModel[i].col) {
                                changedPanels.push(this.panels[i]);
                            }
                        }
                        if (changedPanels.length > 0) {
                            this.trigger('change', changedPanels);
                        }
                        this.trigger('dragStop', args);
                        this.resizeEvents();
                    },
                    drag: (args) => {
                        this.trigger('drag', args);
                        this.onDragStart(args);
                    }
                });
                if (this.dragCollection.indexOf(this.dragobj) === -1) {
                    this.dragCollection.push(this.dragobj);
                }
            }
        }
    }
    ;
    onDraggingStart(args) {
        this.panelsInitialModel = this.cloneModels(this.panels);
        this.mainElement = args.element;
        this.cloneObject = JSON.parse(JSON.stringify(this.cloneObject));
        let eleRowValue = this.startRow = parseInt(args.element.getAttribute('data-row'), 10);
        this.startCol = parseInt(args.element.getAttribute('data-col'), 10);
        let eleSizeY = parseInt(args.element.getAttribute('data-sizeY'), 10);
        if (eleRowValue + eleSizeY === this.rows) {
            this.rows = this.rows + eleSizeY;
            this.setHeightWidth();
            // tslint:disable-next-line
            this.dragobj.setDragArea();
        }
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        this.shadowEle.classList.add('e-holder-transition');
        setStyleAttribute(this.shadowEle, { 'position': 'absolute' });
        addClass([this.element], [preventSelect]);
        addClass([args.element], [dragging]);
        this.element.appendChild(this.shadowEle);
        let sizeY = parseInt(args.element.getAttribute('data-sizeY'), 10);
        let sizeX = parseInt(args.element.getAttribute('data-sizeX'), 10);
        if (args.element.offsetWidth !== this.setXYDimensions(this.getCellInstance(args.element.id))[1]) {
            this.cellSize[0] = parseInt(args.element.style.width, 10) / sizeX;
            this.cellSize[1] = parseInt(args.element.style.height, 10) / sizeY;
        }
        this.shadowEle = document.querySelector('.e-holder');
        this.shadowEle.style.height = (this.getCellInstance(args.element.id).sizeY * this.cellSize[1]) + 'px';
        this.shadowEle.style.width = (this.getCellInstance(args.element.id).sizeX * this.cellSize[0]) + 'px';
        let panelInstance = this.getCellInstance(args.element.id);
        this.setPanelPosition(this.shadowEle, panelInstance.row, panelInstance.col);
    }
    ;
    // tslint:disable-next-line
    cloneModels(source, target) {
        if (target === undefined) {
            target = [];
        }
        for (let i = 0; i < source.length; i++) {
            // tslint:disable-next-line
            if (!target[i]) {
                target[i] = {};
            }
            // tslint:disable-next-line
            for (let k in source[i]) {
                target[i][k] = source[i][k];
            }
        }
        return target;
    }
    ;
    onDragStart(args) {
        let endCol;
        let endRow;
        let dragCol;
        let col = dragCol = this.getRowColumnDragValues(args)[1];
        let row = this.getRowColumnDragValues(args)[0];
        this.getCellInstance(args.element.id).row = row;
        this.getCellInstance(args.element.id).col = col;
        let panelModel = this.getCellInstance(args.element.id);
        let itemsInTheWay;
        itemsInTheWay = this.getItems(row, col, panelModel.sizeX, panelModel.sizeY, args.element);
        let hasItemsInTheWay = itemsInTheWay.length !== 0;
        if (this.allowPushing) {
            args.element.setAttribute('data-col', col.toString());
            args.element.setAttribute('data-row', row.toString());
            this.getCellInstance(args.element.id).row = row;
            this.getCellInstance(args.element.id).col = col;
            endCol = this.oldRowCol[(args.element.id)].col;
            endRow = this.oldRowCol[(args.element.id)].row;
            this.oldRowCol[(args.element.id)] = { row: row, col: col };
            this.updateOldRowColumn();
            if (this.startCol !== endCol || this.startRow !== endRow) {
                this.setHolderPosition(args);
                if (this.startCol !== endCol) {
                    this.startRow = endRow;
                }
                if (this.startRow !== endRow) {
                    this.startCol = endCol;
                }
                if (this.allowPushing) {
                    this.mainElement = args.element;
                    let model = panelModel;
                    this.checkCollision = this.collisionItems(model.row, model.col, model.sizeX, model.sizeY, args.element);
                    if (panelModel.col >= this.checkColumnValue) {
                        this.checkCollision = [];
                    }
                    this.updatePanelLayout(args.element, panelModel);
                    this.moveItemsUpwards();
                }
            }
        }
        if (this.allowPushing !== false) {
            this.getCellInstance(args.element.id).row = row;
            this.getCellInstance(args.element.id).col = col;
        }
        if (this.oldRowCol[args.element.id].row !== row || this.oldRowCol[args.element.id].col !== col) {
            this.getCellInstance(args.element.id).row = row;
            this.getCellInstance(args.element.id).col = col;
            args.element.setAttribute('data-col', col.toString());
            args.element.setAttribute('data-row', row.toString());
        }
        if (this.startCol !== dragCol) {
            this.startCol = endCol;
            this.moveItemsUpwards();
        }
        if (!this.allowPushing) {
            this.setHolderPosition(args);
        }
        this.removeResizeClasses(this.panelCollection);
        this.setClasses(this.panelCollection);
        if (this.allowPushing === false) {
            return;
        }
    }
    getPanelBase(args) {
        let item;
        for (let i = 0; i < this.panelCollection.length; i++) {
            if (this.panelCollection[i].id === ((args.element
                && args.element.id) || args)) {
                item = this.panelCollection[i];
            }
        }
        return item;
    }
    getItems(row, column, sizeX, sizeY, elements) {
        let items = [];
        if (!sizeX || !sizeY) {
            sizeX = sizeY = 1;
        }
        if (elements && !(elements instanceof Array)) {
            elements = [elements];
        }
        let item;
        for (let h = 0; h < sizeY; ++h) {
            for (let w = 0; w < sizeX; ++w) {
                item = this.getPanel(row + h, column + w, elements);
                if (item && (!elements || elements.indexOf(document.getElementById(item.id)) === -1) &&
                    items.indexOf(document.getElementById(item.id)) === -1) {
                    items.push(document.getElementById(item.id));
                }
            }
        }
        return items;
    }
    ;
    getPanel(row, column, excludeItems) {
        if (excludeItems && !(excludeItems instanceof Array)) {
            excludeItems = [excludeItems];
        }
        let sizeY = 1;
        while (row > -1) {
            let sizeX = 1;
            let col = column;
            while (col > -1) {
                let items = this.sortedArray[row];
                if (items) {
                    let item = items[col];
                    if (item && (!excludeItems ||
                        excludeItems.indexOf(item) === -1) && parseInt(item.getAttribute('data-sizeX'), 10) >= sizeX
                        && parseInt(item.getAttribute('data-sizeY'), 10) >= sizeY) {
                        return item;
                    }
                }
                ++sizeX;
                --col;
            }
            --row;
            ++sizeY;
        }
        return null;
    }
    ;
    setHolderPosition(args) {
        let cellSizeOne;
        let cellSizeZero;
        let sizeY = parseInt(args.element.getAttribute('data-sizeY'), 10);
        let col = parseInt(args.element.getAttribute('data-col'), 10);
        let row = parseInt(args.element.getAttribute('data-row'), 10);
        let sizeX = parseInt(args.element.getAttribute('data-sizeX'), 10);
        if (args.element.offsetWidth !== this.setXYDimensions(this.getCellInstance(args.element.id))[1]) {
            this.cellSize[1] = parseInt(args.element.style.height, 10) / sizeY;
            this.cellSize[0] = parseInt(args.element.style.width, 10) / sizeX;
        }
        let widthValue = this.getCellSize()[0];
        let heightValue = this.getCellSize()[1];
        let top = row === 0 ? 0 : (((row) * (parseInt(heightValue.toString(), 10) + this.cellSpacing[1])));
        let left = col === 0 ? 0 : (((col) * (parseInt(widthValue.toString(), 10) + this.cellSpacing[0])));
        cellSizeOne = this.getCellSize()[1];
        cellSizeZero = this.getCellSize()[0];
        this.elementRef.top = this.shadowEle.style.top = top + 'px';
        this.elementRef.left = this.shadowEle.style.left = left + 'px';
        this.elementRef.height = this.shadowEle.style.height = ((sizeY * cellSizeOne) + ((sizeY - 1) * this.cellSpacing[1])) + 'px';
        this.elementRef.width = this.shadowEle.style.width = ((sizeX * cellSizeZero) + ((sizeX - 1) * this.cellSpacing[0])) + 'px';
    }
    ;
    getCellInstance(idValue) {
        let currentCellInstance;
        for (let i = 0; i < this.panels.length; i++) {
            if (this.panels[i].id === idValue) {
                currentCellInstance = this.panels[i];
            }
        }
        return currentCellInstance;
    }
    /**
     * Allows to add a panel to the Dashboardlayout.
     */
    addPanel(panel) {
        this.panels.push(panel);
        if (!panel.minSizeX) {
            panel.minSizeX = 1;
        }
        if (!panel.minSizeY) {
            panel.minSizeY = 1;
        }
        if (!panel.id) {
            panel.id = 'layout_' + this.panelID.toString();
            this.panelID = this.panelID + 1;
        }
        let cell = this.renderCell(panel);
        this.oldRowCol[panel.id] = { row: panel.row, col: panel.col };
        this.cloneObject[panel.id] = { row: panel.row, col: panel.col };
        this.updateOldRowColumn();
        this.setMinMaxValues(panel);
        this.element.appendChild(cell);
        let container = cell.querySelector('.e-panel-container');
        if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
            this.checkMediaQuerySizing();
        }
        else {
            this.addPanelCalled = true;
            this.mainElement = cell;
            if (!this.checkCollision) {
                this.checkCollision = [];
            }
            this.setPanelPosition(cell, panel.row, panel.col);
            this.updatePanelLayout(cell, panel);
            this.addPanelCalled = false;
        }
        if (this.allowResizing) {
            this.setResizingClass(cell, container);
        }
        if (this.allowDragging) {
            let subCollection = [];
            this.panelCollection.forEach((item) => {
                if (item.id === panel.id) {
                    subCollection.push(item);
                }
            });
            this.enableDraggingContent(subCollection);
        }
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.updateOldRowColumn();
        this.sortedPanel();
        this.cloneArray = this.sortedArray;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
        this.bindEvents();
    }
    /**
     * Returns the panels object of the DashboardLayout.
     */
    serialize() {
        let cloneModel = this.cloneModels(this.panels);
        let customObject = [];
        for (let i = 0; i < cloneModel.length; i++) {
            customObject.push({
                id: cloneModel[i].id, row: cloneModel[i].row, col: cloneModel[i].col, sizeX: cloneModel[i].sizeX,
                sizeY: cloneModel[i].sizeY, minSizeX: cloneModel[i].minSizeX, minSizeY: cloneModel[i].minSizeY,
                maxSizeX: cloneModel[i].maxSizeX, maxSizeY: cloneModel[i].maxSizeY
            });
        }
        return (customObject);
    }
    /**
     * Removes all the panels from the DashboardLayout.
     */
    removeAll() {
        for (let i = 0; i < this.panelCollection.length; i++) {
            detach(this.panelCollection[i]);
        }
        this.element.innerHTML = '';
        this.rows = 0;
        this.gridPanelCollection = [];
        this.setHeightWidth();
        this.sortedPanel();
        this.sortedArray = [];
        this.overlapElementClone = [];
        this.overlapElement = [];
        this.overlapSubElementClone = [];
        this.panelCollection = [];
        this.oldRowCol = {};
        this.cloneObject = {};
        this.panels = [];
    }
    /**
     * Removes the panel from the DashboardLayout.
     */
    removePanel(id) {
        for (let i = 0; i < this.panelCollection.length; i++) {
            if (this.panelCollection[i].id === id) {
                detach(this.panelCollection[i]);
                this.panelCollection.splice(i, 1);
            }
            if (this.panels[i].id === id) {
                this.panels.splice(i, 1);
                this.updateOldRowColumn();
                this.sortedPanel();
            }
        }
        this.moveItemsUpwards();
        this.updateOldRowColumn();
        this.sortedPanel();
        this.gridPanelCollection.forEach((item) => {
            if (item.id === id) {
                this.gridPanelCollection.splice(this.gridPanelCollection.indexOf(item), 1);
            }
        });
    }
    /**
     * Moves the panel in the DashboardLayout.
     */
    movePanel(id, row, col) {
        this.movePanelCalled = true;
        let panelInstance = this.getCellInstance(id);
        panelInstance.row = row;
        panelInstance.col = col;
        if (col < 1) {
            col = 0;
        }
        else if (col > this.columns) {
            col = this.columns;
        }
        let ele = document.getElementById(id);
        this.mainElement = ele;
        ele.setAttribute('data-col', col.toString());
        ele.setAttribute('data-row', row.toString());
        this.setPanelPosition(ele, row, col);
        this.updatePanelLayout(ele, panelInstance);
        this.getRowColumn();
        this.setHeightWidth();
        this.moveItemsUpwards();
        this.updateOldRowColumn();
        this.sortedPanel();
        this.cloneArray = this.sortedArray;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
        this.movePanelCalled = false;
    }
    /**
     * Resize the panel in the DashboardLayout.
     */
    resizePanel(id, sizeX, sizeY) {
        let panelInstance = this.getCellInstance(id);
        this.resizeCalled = true;
        panelInstance.sizeX = sizeX;
        panelInstance.sizeY = sizeY;
        this.setMinMaxValues(panelInstance);
        let ele = document.getElementById(id);
        ele.setAttribute('data-sizeX', panelInstance.sizeX.toString());
        ele.setAttribute('data-sizeY', panelInstance.sizeY.toString());
        this.setHeightAndWidth(ele, panelInstance);
        this.updatePanelLayout(ele, panelInstance);
        this.updateOldRowColumn();
        this.moveItemsUpwards();
        this.sortedPanel();
        this.getRowColumn();
        this.setHeightWidth();
        this.resizeCalled = false;
    }
    /**
     * Destroys the DashboardLayout component
     */
    destroy() {
        removeClass([this.element], [ROOT$1]);
        this.element.removeAttribute('style');
        for (let i = 0; i < this.dragCollection.length; i++) {
            this.dragCollection[i].destroy();
        }
        for (let i = 0; i < this.panelCollection.length; i++) {
            let ele = this.panelCollection[i];
        }
        this.element.innerHTML = '';
    }
    setEnableRtl() {
        this.enableRtl ? addClass([this.element], 'e-rtl') : removeClass([this.element], 'e-rtl');
    }
    getDragInstance(id) {
        let draggableInstance;
        let ele = document.getElementById(id);
        for (let i = 0; i < this.dragCollection.length; i++) {
            draggableInstance = this.dragCollection[i].element === ele ? this.dragCollection[i] : null;
            if (draggableInstance) {
                return draggableInstance;
            }
        }
        return draggableInstance;
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    updateCellSizeAndSpacing() {
        this.panelResponsiveUpdate();
        this.setHeightWidth();
        this.getRowColumn();
        for (let i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
            let ele = this.element.querySelectorAll('.e-panel')[i];
            let panelModel = this.getCellInstance(ele.id);
            this.setHeightAndWidth(ele, panelModel);
            this.setPanelPosition(ele, panelModel.row, panelModel.col);
        }
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    this.setEnableRtl();
                    break;
                case 'mediaQuery':
                    this.setProperties({ mediaQuery: newProp.mediaQuery }, true);
                    if (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches) {
                        this.checkMediaQuerySizing();
                    }
                    break;
                case 'allowDragging':
                    this.setProperties({ allowDragging: newProp.allowDragging }, true);
                    this.checkDragging(this.dragCollection);
                    break;
                case 'allowResizing':
                    this.setProperties({ allowResizing: newProp.allowResizing }, true);
                    if (this.allowResizing) {
                        this.setClasses(this.panelCollection);
                        this.resizeEvents();
                    }
                    else {
                        for (let i = 0; i < document.querySelectorAll('.e-resize').length; i++) {
                            let element = document.querySelectorAll('.e-resize')[i];
                            EventHandler.remove(element, 'mousedown', this.downResizeHandler);
                            EventHandler.remove(document, 'mouseup', this.upResizeHandler);
                        }
                        this.removeResizeClasses(this.panelCollection);
                    }
                    break;
                case 'cellSpacing':
                    this.setProperties({ cellSpacing: newProp.cellSpacing }, true);
                    this.updateCellSizeAndSpacing();
                    break;
                case 'draggableHandle':
                    this.setProperties({ draggableHandle: newProp.draggableHandle }, true);
                    for (let i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
                        let ele = this.element.querySelectorAll('.e-panel')[i];
                        let draggableInstance = this.getDragInstance(ele.id);
                        draggableInstance.handle = this.draggableHandle;
                    }
                    break;
                case 'allowFloating':
                    this.setProperties({ allowFloating: newProp.allowFloating }, true);
                    this.moveItemsUpwards();
                    break;
                case 'allowPushing':
                    this.setProperties({ allowPushing: newProp.allowPushing }, true);
                    break;
            }
        }
    }
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     */
    getPersistData() {
        let keyEntity = ['panels'];
        return this.addOnPersist(keyEntity);
    }
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    getModuleName() {
        return 'DashboardLayout';
    }
};
__decorate$1([
    Property(true)
], DashboardLayout.prototype, "allowDragging", void 0);
__decorate$1([
    Property(false)
], DashboardLayout.prototype, "allowResizing", void 0);
__decorate$1([
    Property(true)
], DashboardLayout.prototype, "allowPushing", void 0);
__decorate$1([
    Property(true)
], DashboardLayout.prototype, "allowFloating", void 0);
__decorate$1([
    Property(1)
], DashboardLayout.prototype, "cellAspectRatio", void 0);
__decorate$1([
    Property([0, 0])
], DashboardLayout.prototype, "cellSpacing", void 0);
__decorate$1([
    Property(1)
], DashboardLayout.prototype, "columns", void 0);
__decorate$1([
    Property(null)
], DashboardLayout.prototype, "draggableHandle", void 0);
__decorate$1([
    Property(false)
], DashboardLayout.prototype, "enableRtl", void 0);
__decorate$1([
    Property('en-US')
], DashboardLayout.prototype, "locale", void 0);
__decorate$1([
    Property('max-width: 600px')
], DashboardLayout.prototype, "mediaQuery", void 0);
__decorate$1([
    Collection([{}], Panel)
], DashboardLayout.prototype, "panels", void 0);
__decorate$1([
    Property(null)
], DashboardLayout.prototype, "resizableHandles", void 0);
__decorate$1([
    Event()
], DashboardLayout.prototype, "change", void 0);
__decorate$1([
    Event()
], DashboardLayout.prototype, "dragStart", void 0);
__decorate$1([
    Event()
], DashboardLayout.prototype, "drag", void 0);
__decorate$1([
    Event()
], DashboardLayout.prototype, "dragStop", void 0);
__decorate$1([
    Event()
], DashboardLayout.prototype, "resizeStart", void 0);
__decorate$1([
    Event()
], DashboardLayout.prototype, "resize", void 0);
__decorate$1([
    Event()
], DashboardLayout.prototype, "resizeStop", void 0);
DashboardLayout = __decorate$1([
    NotifyPropertyChanges
], DashboardLayout);

/**
 * portlet modules
 */

/**
 *     Layout all modules
 */

export { PaneProperties, Splitter, Panel, DashboardLayout };
//# sourceMappingURL=ej2-layouts.es2015.js.map
