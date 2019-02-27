import { Browser, ChildProperty, Collection, Component, Event, EventHandler, NotifyPropertyChanges, Property, addClass, append, compile, detach, formatUnit, isNullOrUndefined, removeClass, select, selectAll, setStyleAttribute } from '@syncfusion/ej2-base';

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
const RESIZABLE_PANE = 'e-resizable';
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
                                switch (property) {
                                    case 'content':
                                        let newValue = Object(newProp.paneSettings[index])[property];
                                        if (!isNullOrUndefined(newValue)) {
                                            this.allPanes[index].innerHTML = '';
                                            this.setTemplate(newValue, this.allPanes[index]);
                                        }
                                        break;
                                    case 'resizable':
                                        let newVal = Object(newProp.paneSettings[index])[property];
                                        this.resizableModel(index, newVal);
                                        break;
                                    case 'size':
                                        let newValSize = Object(newProp.paneSettings[index])[property];
                                        if (newValSize !== '' && !isNullOrUndefined(newValSize)) {
                                            this.allPanes[index].style.flexBasis = newValSize;
                                            this.allPanes[index].classList.add(STATIC_PANE);
                                        }
                                        break;
                                }
                            }
                        }
                    }
                    else {
                        this.destroyPaneSettings();
                        this.allBars = [];
                        this.allPanes = [];
                        this.createSplitPane(this.element);
                        this.addSeparator(this.element);
                        this.getPanesDimensions();
                        this.setRTL(this.enableRtl);
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
        this.setPaneSettings();
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
    destroyPaneSettings() {
        [].slice.call(this.element.children).forEach((el) => { detach(el); });
    }
    setPaneSettings() {
        let childCount = this.allPanes.length;
        let paneCollection = [];
        let paneValue = {
            size: '',
            min: null,
            max: null,
            content: '',
            resizable: true
        };
        for (let i = 0; i < childCount; i++) {
            if (isNullOrUndefined(this.paneSettings[i])) {
                paneCollection[i] = paneValue;
            }
            else {
                paneCollection[i] = this.paneSettings[i];
            }
        }
        this.setProperties({ 'paneSettings': paneCollection }, true);
    }
    resizableModel(index, newVal) {
        let paneIndex;
        let i = index;
        paneIndex = (index === (this.allBars.length)) ? (index - 1) : index;
        EventHandler.remove(this.allBars[paneIndex], 'mousedown', this.onMouseDown);
        if (newVal) {
            EventHandler.add(this.allBars[paneIndex], 'mousedown', this.onMouseDown, this);
            if (this.isResizable()) {
                this.showResizer(this.allBars[paneIndex]);
                removeClass([select('.' + RESIZE_BAR, this.allBars[paneIndex])], HIDE_HANDLER);
                this.allBars[paneIndex].classList.add(RESIZABLE_BAR);
                (index === (this.allBars.length)) ? this.allPanes[index].classList.add(RESIZABLE_PANE) :
                    this.allPanes[paneIndex].classList.add(RESIZABLE_PANE);
                this.updateResizablePanes(i);
            }
        }
        else {
            this.updateResizablePanes(i);
            this.hideResizer(this.allBars[paneIndex]);
            this.allBars[paneIndex].classList.remove(RESIZABLE_BAR);
            (index === (this.allBars.length)) ? this.allPanes[index].classList.remove(RESIZABLE_PANE) :
                this.allPanes[paneIndex].classList.remove(RESIZABLE_PANE);
        }
    }
    updateResizablePanes(index) {
        this.getPaneDetails();
        this.isResizable() ? this.allPanes[index].classList.add(RESIZABLE_PANE) : this.allPanes[index].classList.remove(RESIZABLE_PANE);
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

/**
 *     Layout all modules
 */

export { PaneProperties, Splitter };
//# sourceMappingURL=ej2-layouts.es2015.js.map
