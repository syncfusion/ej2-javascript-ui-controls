import { Browser, ChildProperty, Collection, Component, Draggable, Event, EventHandler, NotifyPropertyChanges, Property, SanitizeHtmlHelper, addClass, append, closest, compile, detach, extend, formatUnit, isBlazor, isNullOrUndefined, isUndefined, removeClass, select, selectAll, setStyleAttribute, updateBlazorTemplate } from '@syncfusion/ej2-base';

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
const SPLIT_BAR_HOVER = 'e-split-bar-hover';
const SPLIT_BAR_ACTIVE = 'e-split-bar-active';
const HIDE_HANDLER = 'e-hide-handler';
const SPLIT_TOUCH = 'e-splitter-touch';
const DISABLED = 'e-disabled';
const RTL = 'e-rtl';
const E_ICONS = 'e-icons';
const COLLAPSIBLE = 'e-collapsible';
const NAVIGATE_ARROW = 'e-navigate-arrow';
const ARROW_RIGHT = 'e-arrow-right';
const ARROW_LEFT = 'e-arrow-left';
const ARROW_UP = 'e-arrow-up';
const ARROW_DOWN = 'e-arrow-down';
const HIDE_ICON = 'e-icon-hidden';
const EXPAND_PANE = 'e-expanded';
const COLLAPSE_PANE = 'e-collapsed';
const PANE_HIDDEN = 'e-pane-hidden';
const RESIZABLE_PANE = 'e-resizable';
const LAST_BAR = 'e-last-bar';
const BAR_SIZE_DEFAULT = 1;
/**
 * Interface to configure pane properties such as its content, size, min, max, resizable, collapsed and collapsible.
 */
class PaneProperties extends ChildProperty {
}
__decorate([
    Property()
], PaneProperties.prototype, "size", void 0);
__decorate([
    Property(false)
], PaneProperties.prototype, "collapsible", void 0);
__decorate([
    Property(false)
], PaneProperties.prototype, "collapsed", void 0);
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
__decorate([
    Property('')
], PaneProperties.prototype, "cssClass", void 0);
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
        this.validDataAttributes = ['data-size', 'data-min', 'data-max', 'data-collapsible', 'data-resizable', 'data-content', 'data-collapsed'];
        this.validElementAttributes = ['data-orientation', 'data-width', 'data-height'];
        this.iconsDelay = 300;
        this.templateElement = [];
        this.collapseFlag = false;
        this.expandFlag = true;
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
                    this.setCssClass(this.element, newProp.cssClass);
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
                                    case 'collapsible':
                                        this.collapsibleModelUpdate(index);
                                        break;
                                    case 'collapsed':
                                        newProp.paneSettings[index].collapsed ? this.isCollapsed() : this.collapsedOnchange(index);
                                        break;
                                    case 'cssClass':
                                        this.setCssClass(this.allPanes[index], newProp.paneSettings[index].cssClass);
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
                        this.isCollapsed();
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
        let name = Browser.info.name;
        let css = (name === 'msie') ? 'e-ie' : '';
        this.setCssClass(this.element, css);
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
        this.setCssClass(this.element, this.cssClass);
        this.isEnabled(this.enabled);
        this.setDimension(this.getHeight(this.element), this.getWidth(this.element));
        this.createSplitPane(this.element);
        this.addSeparator(this.element);
        this.getPanesDimensions();
        this.setPaneSettings();
        this.setRTL(this.enableRtl);
        this.collapseFlag = true;
        this.isCollapsed();
        this.collapseFlag = false;
        EventHandler.add(document, 'touchstart click', this.onDocumentClick, this);
        this.renderComplete();
        EventHandler.add(this.element, 'keydown', this.onMove, this);
    }
    onDocumentClick(e) {
        if (!e.target.classList.contains(SPLIT_BAR) && !isNullOrUndefined(this.currentSeparator)) {
            this.currentSeparator.classList.remove(SPLIT_BAR_HOVER);
            this.currentSeparator.classList.remove(SPLIT_BAR_ACTIVE);
        }
    }
    checkPaneSize(e) {
        let prePaneSize;
        let nextPaneSize;
        let splitBarSize = isNullOrUndefined(this.separatorSize) ? BAR_SIZE_DEFAULT : this.separatorSize;
        prePaneSize = this.orientation === 'Horizontal' ? this.previousPane.offsetWidth : this.previousPane.offsetHeight;
        nextPaneSize = this.orientation === 'Horizontal' ? this.nextPane.offsetWidth : this.nextPane.offsetHeight;
        if ((this.previousPane.style.flexBasis.indexOf('%') > 0 || this.nextPane.style.flexBasis.indexOf('%') > 0)) {
            let previousFlexBasis = this.updatePaneFlexBasis(this.previousPane);
            let nextFlexBasis = this.updatePaneFlexBasis(this.nextPane);
            this.totalPercent = previousFlexBasis + nextFlexBasis;
            this.totalWidth = this.convertPercentageToPixel(this.totalPercent + '%');
            if (e.type === 'keydown' && (!isNullOrUndefined(e.keyCode))) {
                if ((e.keyCode === 39 || (e.keyCode === 40)) && nextPaneSize > 0) {
                    this.previousPane.style.flexBasis = (previousFlexBasis + 1) + '%';
                    this.nextPane.style.flexBasis = (nextFlexBasis - 1) + '%';
                }
                else if ((e.keyCode === 37 || (e.keyCode === 38)) && prePaneSize > 0) {
                    this.previousPane.style.flexBasis = (previousFlexBasis - 1) + '%';
                    this.nextPane.style.flexBasis = (nextFlexBasis + 1) + '%';
                }
            }
        }
        else {
            this.totalWidth = (this.orientation === 'Horizontal') ? this.previousPane.offsetWidth + this.nextPane.offsetWidth :
                this.previousPane.offsetHeight + this.nextPane.offsetHeight;
            if (e.type === 'keydown' && (!isNullOrUndefined(e.keyCode))) {
                if ((e.keyCode === 39 || (e.keyCode === 40)) && nextPaneSize > 0) {
                    this.addStaticPaneClass();
                    this.previousPane.style.flexBasis = (prePaneSize + splitBarSize) + 'px';
                    this.nextPane.style.flexBasis = (nextPaneSize < splitBarSize) ? '0px' :
                        (nextPaneSize - splitBarSize) + 'px';
                }
                else if ((e.keyCode === 37 || (e.keyCode === 38)) && prePaneSize > 0) {
                    this.addStaticPaneClass();
                    this.previousPane.style.flexBasis = (prePaneSize < splitBarSize) ? '0px' :
                        (prePaneSize - splitBarSize) + 'px';
                    this.nextPane.style.flexBasis = (nextPaneSize + splitBarSize) + 'px';
                }
            }
        }
    }
    onMove(event) {
        let index = this.getSeparatorIndex(this.currentSeparator);
        let isPrevpaneCollapsed = this.previousPane.classList.contains(COLLAPSE_PANE);
        let isPrevpaneExpanded = this.previousPane.classList.contains(EXPAND_PANE);
        let isNextpaneCollapsed = this.nextPane.classList.contains(COLLAPSE_PANE);
        if (((this.orientation !== 'Horizontal' && event.keyCode === 38) || (this.orientation === 'Horizontal' && event.keyCode === 39) ||
            (this.orientation === 'Horizontal' && event.keyCode === 37) || (this.orientation !== 'Horizontal' && event.keyCode === 40))
            && (!isPrevpaneExpanded && !isNextpaneCollapsed && !isPrevpaneCollapsed || (isPrevpaneExpanded) && !isNextpaneCollapsed) &&
            document.activeElement.classList.contains(SPLIT_BAR)) {
            this.checkPaneSize(event);
            this.triggerResizing(event);
        }
        else if (event.keyCode === 13 && this.paneSettings[index].collapsible && document.activeElement.classList.contains(SPLIT_BAR)) {
            if (!this.previousPane.classList.contains(COLLAPSE_PANE)) {
                this.collapse(index);
                addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
            }
            else {
                this.expand(index);
                addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
            }
        }
    }
    ;
    /**
     * @hidden
     */
    sanitizeHelper(value) {
        if (this.enableHtmlSanitizer) {
            let item = SanitizeHtmlHelper.beforeSanitize();
            let beforeEvent = {
                cancel: false,
                helper: null
            };
            extend(item, item, beforeEvent);
            this.trigger('beforeSanitizeHtml', item);
            if (item.cancel && !isNullOrUndefined(item.helper)) {
                value = item.helper(value);
            }
            else if (!item.cancel) {
                value = SanitizeHtmlHelper.serializeValue(item, value);
            }
        }
        return value;
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
                            collapsible: false,
                            collapsed: false
                        };
                    }
                    // tslint:disable-next-line
                    let paneAPI = this.paneSettings[paneIndex][api];
                    if (api === 'resizable' || api === 'collapsible' || api === 'collapsed') {
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
        this.restoreElem();
    }
    setPaneSettings() {
        let childCount = this.allPanes.length;
        let paneCollection = [];
        let paneValue = {
            size: '',
            min: null,
            max: null,
            content: '',
            resizable: true,
            collapsed: false,
            collapsible: false,
            cssClass: ''
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
    checkArrow(paneIndex, targetArrow) {
        return (this.allBars[paneIndex].querySelector('.' + NAVIGATE_ARROW + '.' + targetArrow));
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
            this.orientation === 'Horizontal' ? this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().width) :
                this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().height);
        }
    }
    setCssClass(element, className) {
        if (className) {
            addClass([element], className.split(className.indexOf(',') > -1 ? ',' : ' '));
        }
    }
    hideResizer(target) {
        addClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
    }
    showResizer(target) {
        if (!isNullOrUndefined(this.previousPane) && this.previousPane.classList.contains(RESIZABLE_PANE) &&
            !isNullOrUndefined(this.nextPane) && this.nextPane.classList.contains(RESIZABLE_PANE)) {
            removeClass([select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
        }
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
    collapsibleModelUpdate(index) {
        let arrow2;
        let arrow1;
        let paneIndex;
        paneIndex = index === (this.allBars.length) ? (index - 1) : index;
        arrow2 = (this.orientation === 'Horizontal') ? this.checkArrow(paneIndex, ARROW_LEFT) : this.checkArrow(paneIndex, ARROW_UP);
        arrow1 = (this.orientation === 'Horizontal') ? this.checkArrow(paneIndex, ARROW_RIGHT) : this.checkArrow(paneIndex, ARROW_DOWN);
        this.paneCollapsible(this.allPanes[index], index);
        this.updateCollapseIcons(paneIndex, arrow1, arrow2);
    }
    collapseArrow(barIndex, arrow) {
        return selectAll('.' + arrow, this.allBars[barIndex])[0];
    }
    updateIsCollapsed(index, collapseArrow, lastBarArrow) {
        if (!isNullOrUndefined(index)) {
            let targetEle;
            let lastBarIndex = (index === this.allBars.length);
            let barIndex = lastBarIndex ? index - 1 : index;
            if (!lastBarIndex && this.allPanes[index + 1].classList.contains(COLLAPSE_PANE) && index !== 0) {
                targetEle = this.collapseArrow(barIndex - 1, lastBarArrow);
            }
            else {
                targetEle = (lastBarIndex) ? this.collapseArrow(barIndex, lastBarArrow) : this.collapseArrow(barIndex, collapseArrow);
            }
            targetEle.click();
        }
    }
    isCollapsed(index) {
        this.expandFlag = false;
        if (!isNullOrUndefined(index)) {
            this.collapseFlag = true;
            let targetEle;
            let lastBarIndex = (index === this.allBars.length);
            let barIndex = lastBarIndex ? index - 1 : index;
            if (!lastBarIndex && this.allPanes[index + 1].classList.contains(COLLAPSE_PANE) && index !== 0) {
                targetEle = this.collapseArrow(barIndex - 1, this.targetArrows().lastBarArrow);
            }
            else {
                targetEle = (lastBarIndex) ? this.collapseArrow(barIndex, this.targetArrows().lastBarArrow) :
                    this.collapseArrow(barIndex, this.targetArrows().collapseArrow);
            }
            let event = { target: targetEle };
            let eventArgs = this.beforeAction(event);
            this.trigger('beforeCollapse', eventArgs, (beforeCollapseArgs) => {
                if (!beforeCollapseArgs.cancel) {
                    let collapsedindex = [];
                    collapsedindex[0] = index;
                    let j = 1;
                    for (let i = 0; i < this.allPanes.length; i++) {
                        if (this.allPanes[i].classList.contains(COLLAPSE_PANE)) {
                            collapsedindex[j] = i;
                            j++;
                        }
                    }
                    this.updateIsCollapsed(index, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
                    collapsedindex = collapsedindex.sort();
                    this.updateIsCollapsed(index, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
                    for (let i = 0; i < collapsedindex.length; i++) {
                        if (!this.allPanes[collapsedindex[i]].classList.contains(COLLAPSE_PANE)) {
                            this.updateIsCollapsed(collapsedindex[i], this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
                        }
                    }
                    for (let i = collapsedindex.length; i > 0; i--) {
                        if (!this.allPanes[collapsedindex[i - 1]].classList.contains(COLLAPSE_PANE)) {
                            let targetArrow = this.targetArrows();
                            this.updateIsCollapsed(collapsedindex[i - 1], targetArrow.collapseArrow, targetArrow.lastBarArrow);
                        }
                    }
                    let collapseEventArgs = this.afterAction(event);
                    this.trigger('collapsed', collapseEventArgs);
                    this.collapseFlag = false;
                }
            });
        }
        else {
            for (let m = 0; m < this.allPanes.length; m++) {
                if (!isNullOrUndefined(this.paneSettings[m]) && this.paneSettings[m].collapsed) {
                    this.updateIsCollapsed(m, this.targetArrows().collapseArrow, this.targetArrows().lastBarArrow);
                }
            }
            for (let m = this.allPanes.length - 1; m >= 0; m--) {
                if (!isNullOrUndefined(this.paneSettings[m]) && this.paneSettings[m].collapsed &&
                    !this.allPanes[m].classList.contains(COLLAPSE_PANE)) {
                    let collapseArrow = this.orientation === 'Horizontal' ? ARROW_RIGHT : ARROW_DOWN;
                    if (m !== 0) {
                        let targetEle = this.collapseArrow(m - 1, collapseArrow);
                        targetEle.click();
                    }
                    if (!this.nextPane.classList.contains(COLLAPSE_PANE)) {
                        let targetEle = this.collapseArrow(m - 1, collapseArrow);
                        targetEle.click();
                    }
                }
            }
        }
        this.expandFlag = true;
    }
    targetArrows() {
        this.splitterProperty();
        return { collapseArrow: (this.orientation === 'Horizontal') ? ARROW_LEFT : ARROW_UP,
            lastBarArrow: (this.orientation === 'Vertical') ? ARROW_DOWN : ARROW_RIGHT
        };
    }
    collapsedOnchange(index) {
        if (!isNullOrUndefined(this.paneSettings[index]) && !isNullOrUndefined(this.paneSettings[index].collapsed)
            && this.allPanes[index].classList.contains(COLLAPSE_PANE)) {
            this.updateIsCollapsed(index, this.targetArrows().lastBarArrow, this.targetArrows().collapseArrow);
        }
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
        for (let index = 0; index < this.allPanes.length; index++) {
            this.allPanes[index].classList.remove(isVertical ? SPLIT_H_PANE : SPLIT_V_PANE);
            this.allPanes[index].classList.add(isVertical ? SPLIT_V_PANE : SPLIT_H_PANE);
        }
        for (let index = 0; index < this.allBars.length; index++) {
            detach(this.allBars[index]);
        }
        this.allBars = [];
        this.addSeparator(this.element);
    }
    checkSplitPane(currentBar, elementIndex) {
        let paneEle = this.collectPanes(currentBar.parentElement.children)[elementIndex];
        return paneEle;
    }
    collectPanes(childNodes) {
        let elements = [];
        for (let i = 0; i < childNodes.length; i++) {
            if (childNodes[i].classList.contains('e-pane')) {
                elements.push(childNodes[i]);
            }
        }
        return elements;
    }
    getPrevPane(currentBar, order) {
        return this.checkSplitPane(currentBar, ((order - 1) / (2)));
    }
    getNextPane(currentBar, order) {
        return this.checkSplitPane(currentBar, (((order - 1) / 2) + 1));
    }
    addResizeHandler(currentBar) {
        let resizeHanlder = this.createElement('div');
        addClass([resizeHanlder], [RESIZE_BAR, E_ICONS]);
        let sizeValue = isNullOrUndefined(this.separatorSize) ? '1px' : this.separatorSize + 'px';
        this.orientation === 'Horizontal' ? (resizeHanlder.style.width = sizeValue) : resizeHanlder.style.height = sizeValue;
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
    updateCollapseIcons(index, arrow1, arrow2) {
        if (!isNullOrUndefined(this.paneSettings[index])) {
            if (!isNullOrUndefined(this.paneSettings[index].collapsible)) {
                this.paneSettings[index].collapsible ? removeClass([arrow2], [HIDE_ICON]) : addClass([arrow2], [HIDE_ICON]);
                if (!isNullOrUndefined(this.paneSettings[index + 1])) {
                    this.paneSettings[index + 1].collapsible ? removeClass([arrow1], [HIDE_ICON]) : addClass([arrow1], [HIDE_ICON]);
                }
                if (!isNullOrUndefined(this.paneSettings[index + 1])) {
                    if ((this.paneSettings[index + 1].collapsible)) {
                        this.paneSettings[index + 1].collapsible ? removeClass([arrow1], [HIDE_ICON]) : addClass([arrow1], [HIDE_ICON]);
                    }
                }
            }
        }
    }
    createSeparator(i) {
        let separator = this.createElement('div');
        this.allBars.push(separator);
        let arrow1 = this.createElement('button');
        let arrow2 = this.createElement('button');
        arrow1.setAttribute('tabindex', '-1');
        arrow2.setAttribute('tabindex', '-1');
        arrow1.setAttribute('aria-label', 'Toggle navigation');
        arrow2.setAttribute('aria-label', 'Toggle navigation');
        arrow1.setAttribute('type', 'button');
        arrow2.setAttribute('type', 'button');
        let size;
        let proxy;
        size = isNullOrUndefined(this.separatorSize) ? '1px' : this.separatorSize + 'px';
        if (this.orientation === 'Horizontal') {
            this.leftArrow = ARROW_LEFT;
            this.rightArrow = ARROW_RIGHT;
            addClass([arrow2], [NAVIGATE_ARROW, ARROW_LEFT, HIDE_ICON]);
            addClass([arrow1], [NAVIGATE_ARROW, ARROW_RIGHT, HIDE_ICON]);
            addClass([separator], [SPLIT_BAR, SPLIT_H_BAR]);
            separator.style.width = size;
        }
        else {
            addClass([arrow1], [NAVIGATE_ARROW, ARROW_DOWN, HIDE_ICON]);
            addClass([arrow2], [NAVIGATE_ARROW, ARROW_UP, HIDE_ICON]);
            addClass([separator], [SPLIT_BAR, SPLIT_V_BAR]);
            this.leftArrow = ARROW_UP;
            this.rightArrow = ARROW_DOWN;
            separator.style.height = size;
        }
        this.addMouseActions(separator);
        separator.appendChild(arrow2);
        this.addResizeHandler(separator);
        separator.appendChild(arrow1);
        this.updateCollapseIcons(i, arrow1, arrow2);
        separator.setAttribute('tabindex', '0');
        proxy = this;
        separator.addEventListener('focus', () => {
            if (document.activeElement.classList.contains('e-split-bar')) {
                proxy.currentSeparator = document.activeElement;
                proxy.currentSeparator.classList.add(SPLIT_BAR_ACTIVE);
            }
            proxy.getPaneDetails();
        });
        separator.addEventListener('blur', () => {
            proxy.currentSeparator.classList.remove(SPLIT_BAR_ACTIVE);
        });
        return separator;
    }
    updateResizablePanes(index) {
        this.getPaneDetails();
        this.isResizable() ? this.allPanes[index].classList.add(RESIZABLE_PANE) : this.allPanes[index].classList.remove(RESIZABLE_PANE);
    }
    addSeparator(target) {
        let childCount = this.allPanes.length;
        let clonedEle = target.children;
        let separator;
        for (let i = 0; i < childCount; i++) {
            if (i < childCount - 1) {
                separator = this.createSeparator(i);
                setStyleAttribute(separator, { 'order': (i * 2) + 1 });
                this.separatorOrder.push((i * 2) + 1);
                clonedEle[i].parentNode.appendChild(separator);
                this.currentSeparator = separator;
                separator.setAttribute('role', 'separator');
                separator.setAttribute('aria-orientation', this.orientation.toLowerCase());
                this.wireClickEvents();
                if (this.isResizable()) {
                    EventHandler.add(separator, 'mousedown', this.onMouseDown, this);
                    let eventName = (Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
                    EventHandler.add(separator, eventName, this.onMouseDown, this);
                    separator.classList.add(RESIZABLE_BAR);
                    this.updateResizablePanes(i);
                }
                else {
                    addClass([select('.' + RESIZE_BAR, separator)], HIDE_HANDLER);
                }
            }
            else {
                if (separator) {
                    addClass([separator], LAST_BAR);
                }
                if (childCount > 1) {
                    this.updateResizablePanes(i);
                }
            }
        }
        if (Browser.info.name === 'msie') {
            let allBar = this.element.querySelectorAll('.e-splitter .e-resize-handler');
            for (let i = 0; i < allBar.length; i++) {
                let sepSize = isNullOrUndefined(this.separatorSize) ? 1 : this.separatorSize;
                allBar[i].style.paddingLeft = sepSize / 2 + 'px';
                allBar[i].style.paddingRight = sepSize / 2 + 'px';
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
        let sTout;
        let hoverTimeOut;
        separator.addEventListener('mouseenter', () => {
            /* istanbul ignore next */
            sTout = setTimeout(() => { addClass([separator], [SPLIT_BAR_HOVER]); }, this.iconsDelay);
        });
        separator.addEventListener('mouseleave', () => {
            clearTimeout(sTout);
            removeClass([separator], [SPLIT_BAR_HOVER]);
        });
        separator.addEventListener('mouseout', () => {
            clearTimeout(hoverTimeOut);
        });
        separator.addEventListener('mouseover', () => {
            /* istanbul ignore next */
            hoverTimeOut = setTimeout(() => { addClass([separator], [SPLIT_BAR_HOVER]); }, this.iconsDelay);
        });
    }
    getEventType(e) {
        return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
    }
    updateCurrentSeparator(target) {
        this.currentSeparator = this.isSeparator(target) ? target.parentElement : target;
    }
    isSeparator(target) {
        return ((target.classList.contains(RESIZE_BAR) || target.classList.contains(SPLIT_BAR)) ? false : true);
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
    reportWindowSize() {
        let paneCount = this.allPanes.length;
        for (let i = 0; i < paneCount; i++) {
            if (isNullOrUndefined(this.paneSettings[i].size)) {
                this.allPanes[i].classList.remove(STATIC_PANE);
            }
            if (paneCount - 1 === i) {
                let staticPaneCount = this.element.querySelectorAll('.' + STATIC_PANE).length;
                if (staticPaneCount === paneCount) {
                    removeClass([this.allPanes[i]], STATIC_PANE);
                }
            }
        }
    }
    wireResizeEvents() {
        window.addEventListener('resize', this.reportWindowSize.bind(this));
        EventHandler.add(document, 'mousemove', this.onMouseMove, this);
        EventHandler.add(document, 'mouseup', this.onMouseUp, this);
        let touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        let touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.add(document, touchMoveEvent, this.onMouseMove, this);
        EventHandler.add(document, touchEndEvent, this.onMouseUp, this);
    }
    unwireResizeEvents() {
        window.removeEventListener('resize', this.reportWindowSize.bind(this));
        let touchMoveEvent = (Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        let touchEndEvent = (Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        EventHandler.remove(document, 'mousemove', this.onMouseMove);
        EventHandler.remove(document, 'mouseup', this.onMouseUp);
        EventHandler.remove(document, touchMoveEvent, this.onMouseMove);
        EventHandler.remove(document, touchEndEvent, this.onMouseUp);
    }
    wireClickEvents() {
        EventHandler.add(this.currentSeparator, 'touchstart click', this.clickHandler, this);
    }
    clickHandler(e) {
        if (!e.target.classList.contains(NAVIGATE_ARROW)) {
            let hoverBars = selectAll('.' + ROOT + ' > .' + SPLIT_BAR + '.' + SPLIT_BAR_HOVER);
            if (hoverBars.length > 0) {
                removeClass(hoverBars, SPLIT_BAR_HOVER);
            }
            e.target.classList.add(SPLIT_BAR_HOVER);
        }
        let icon = e.target;
        if (icon.classList.contains(ARROW_LEFT) || icon.classList.contains(ARROW_UP)) {
            this.collapseAction(e);
        }
        if (icon.classList.contains(ARROW_RIGHT) || icon.classList.contains(ARROW_DOWN)) {
            this.expandAction(e);
        }
    }
    expandAction(e) {
        this.splitterDetails(e);
        let eventArgs = this.beforeAction(e);
        if (this.expandFlag) {
            this.trigger('beforeExpand', eventArgs, (beforeExpandArgs) => {
                if (!beforeExpandArgs.cancel) {
                    this.expandPane(e);
                }
                let expandEventArgs = this.afterAction(e);
                this.trigger('expanded', expandEventArgs);
            });
        }
        else {
            this.expandPane(e);
        }
    }
    expandPane(e) {
        let collapseCount = this.element.querySelectorAll('.' + COLLAPSE_PANE).length;
        let flexStatus = (!this.previousPane.classList.contains(COLLAPSE_PANE) &&
            this.previousPane.classList.contains(STATIC_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE) &&
            !this.nextPane.classList.contains(EXPAND_PANE) && this.nextPane.nextElementSibling.classList.contains(PANE) &&
            !this.nextPane.nextElementSibling.classList.contains(STATIC_PANE) && !(collapseCount === this.allPanes.length - 2));
        let collapseClass = [COLLAPSE_PANE, PANE_HIDDEN];
        if (!this.previousPane.classList.contains(COLLAPSE_PANE)) {
            removeClass([this.nextPane], EXPAND_PANE);
            removeClass([this.previousPane], collapseClass);
            addClass([this.previousPane], EXPAND_PANE);
            addClass([this.nextPane], collapseClass);
        }
        else {
            removeClass([this.previousPane], collapseClass);
            removeClass([this.nextPane], EXPAND_PANE);
        }
        this.updateIconsOnExpand(e);
        this.previousPane.setAttribute('aria-expanded', 'true');
        this.nextPane.setAttribute('aria-expanded', 'false');
        this.updateFlexGrow(this.checkStaticPanes());
        if (flexStatus) {
            this.previousPane.classList.remove(EXPAND_PANE);
            this.previousPane.style.flexGrow = '';
        }
    }
    checkStaticPanes() {
        let staticPane = true;
        for (let i = 0; i < this.allPanes.length; i++) {
            if (!this.allPanes[i].classList.contains(COLLAPSE_PANE) && staticPane) {
                if (this.allPanes[i].classList.contains(STATIC_PANE)) {
                    staticPane = true;
                }
                else {
                    staticPane = false;
                }
            }
        }
        return staticPane;
    }
    updateFlexGrow(status) {
        let panes = this.allPanes;
        for (let i = 0; i < panes.length; i++) {
            if (panes[i].classList.contains(EXPAND_PANE)) {
                panes[i].style.flexGrow = '1';
            }
            else if (panes[i].classList.contains(COLLAPSE_PANE)) {
                panes[i].style.flexGrow = '0';
            }
            else {
                panes[i].style.flexGrow = '';
            }
            if (status && !this.nextPane.classList.contains(COLLAPSE_PANE)) {
                this.nextPane.style.flexGrow = '1';
            }
        }
    }
    hideTargetBarIcon(targetBar, targetArrow) {
        addClass([select('.' + targetArrow, targetBar)], HIDE_ICON);
    }
    showTargetBarIcon(targetBar, targetArrow) {
        removeClass([select('.' + targetArrow, targetBar)], HIDE_ICON);
    }
    updateIconsOnCollapse(e) {
        this.splitterProperty();
        if (this.previousPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE)) {
            addClass([e.target], HIDE_ICON);
            if (this.paneSettings[this.prevPaneIndex].collapsible) {
                this.showCurrentBarIcon();
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
            if (!isNullOrUndefined(this.prevBar)) {
                this.resizableModel(this.currentBarIndex - 1, false);
                this.hideTargetBarIcon(this.prevBar, this.arrow);
            }
            if (!this.paneSettings[this.prevPaneIndex].collapsible) {
                this.hideTargetBarIcon(this.currentSeparator, this.rightArrow);
            }
        }
        else if (!this.splitInstance.prevPaneCollapsed && !this.splitInstance.nextPaneExpanded) {
            this.resizableModel(this.currentBarIndex, true);
            if (!this.splitInstance.nextPaneNextEle.classList.contains('e-collapsed')) {
                this.resizableModel(this.currentBarIndex + 1, true);
            }
            if (!this.paneSettings[this.currentBarIndex].collapsible) {
                addClass([e.target], HIDE_ICON);
            }
            if (this.previousPane && this.prevPaneIndex === 0 && (this.paneSettings[this.prevPaneIndex].collapsible)) {
                this.showTargetBarIcon(this.currentSeparator, this.leftArrow);
            }
            if (this.nextPane && this.nextPaneIndex === this.allPanes.length - 1 && (this.paneSettings[this.nextPaneIndex].collapsible)) {
                this.showTargetBarIcon(this.getPrevBar(this.nextPaneIndex), this.rightArrow);
            }
            if (!(this.previousPane.classList.contains(COLLAPSE_PANE)) && this.paneSettings[this.nextPaneIndex].collapsible) {
                this.showTargetBarIcon(this.currentSeparator, this.rightArrow);
            }
            if (!isNullOrUndefined(this.nextBar)) {
                if (this.nextPane.nextElementSibling && (this.nextPane.nextElementSibling.classList.contains('e-collapsed') &&
                    this.paneSettings[this.nextPaneIndex + 1].collapsible) ||
                    (!this.nextPane.nextElementSibling.classList.contains('e-collapsed') &&
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
    }
    collapseAction(e) {
        this.splitterDetails(e);
        let eventArgs = this.beforeAction(e);
        if (this.collapseFlag) {
            this.collapsePane(e);
        }
        else {
            this.trigger('beforeCollapse', eventArgs, (beforeCollapseArgs) => {
                if (!beforeCollapseArgs.cancel) {
                    this.collapsePane(e);
                    let collapseEventArgs = this.afterAction(e);
                    this.trigger('collapsed', collapseEventArgs);
                }
            });
        }
    }
    collapsePane(e) {
        let collapseCount = this.element.querySelectorAll('.' + COLLAPSE_PANE).length;
        let flexStatus = (this.previousPane.classList.contains(STATIC_PANE) &&
            !this.previousPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE) &&
            this.nextPane.nextElementSibling.classList.contains(PANE) &&
            !this.nextPane.nextElementSibling.classList.contains(STATIC_PANE) &&
            !this.nextPane.nextElementSibling.classList.contains(COLLAPSE_PANE) &&
            !(collapseCount === this.allPanes.length - 2)) || (this.nextPane.classList.contains(COLLAPSE_PANE) &&
            !this.previousPane.classList.contains(STATIC_PANE) && this.nextPane.classList.contains(STATIC_PANE));
        let collapseClass = [COLLAPSE_PANE, PANE_HIDDEN];
        if (this.nextPane.classList.contains(COLLAPSE_PANE)) {
            removeClass([this.previousPane], EXPAND_PANE);
            removeClass([this.nextPane], collapseClass);
        }
        else {
            removeClass([this.previousPane], EXPAND_PANE);
            removeClass([this.nextPane], collapseClass);
            addClass([this.nextPane], EXPAND_PANE);
            addClass([this.previousPane], collapseClass);
        }
        this.updateIconsOnCollapse(e);
        this.previousPane.setAttribute('aria-expanded', 'false');
        this.nextPane.setAttribute('aria-expanded', 'true');
        this.updateFlexGrow(this.checkStaticPanes());
        if (flexStatus) {
            this.nextPane.classList.remove(EXPAND_PANE);
            this.nextPane.style.flexGrow = '';
        }
    }
    beforeAction(e) {
        let eventArgs = isBlazor() ? {
            element: this.element,
            event: e,
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            cancel: false
        } : {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            cancel: false
        };
        return eventArgs;
    }
    splitterProperty() {
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
    }
    showCurrentBarIcon() {
        removeClass([select('.' + this.arrow, this.currentSeparator)], HIDE_ICON);
    }
    updateIconsOnExpand(e) {
        this.splitterProperty();
        addClass([e.target], HIDE_ICON);
        if (!this.splitInstance.prevPaneExpanded && !this.splitInstance.nextPaneCollapsed) {
            if (this.paneSettings[this.prevPaneIndex].collapsible) {
                this.showCurrentBarIcon();
            }
            if (this.paneSettings[this.nextPaneIndex].collapsible) {
                removeClass([e.target], HIDE_ICON);
            }
            this.resizableModel(this.currentBarIndex, true);
            if (!isNullOrUndefined(this.prevBar) &&
                !this.splitInstance.prevPanePreEle.classList.contains(COLLAPSE_PANE)) {
                this.resizableModel(this.currentBarIndex - 1, true);
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
                this.showCurrentBarIcon();
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
    afterAction(e) {
        let eventArgs = isBlazor() ? {
            element: this.element,
            event: e,
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator
        } : {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator
        };
        return eventArgs;
    }
    currentIndex(e) {
        this.currentBarIndex = this.getSeparatorIndex(e.target.parentElement);
    }
    getSeparatorIndex(target) {
        let array = [].slice.call(this.allBars);
        return array.indexOf(target);
    }
    getPrevBar(currentBar) {
        let prevbar = this.allBars[(currentBar - 1)];
        return prevbar;
    }
    getNextBar(currentBar) {
        let prevbar = this.allBars[(currentBar + 1)];
        return prevbar;
    }
    updateBars(index) {
        this.prevBar = this.getPrevBar(index);
        this.nextBar = this.getNextBar(index);
    }
    splitterDetails(e) {
        if (this.orientation === 'Horizontal') {
            this.arrow = e.target.classList.contains(ARROW_LEFT) ? ARROW_RIGHT : ARROW_LEFT;
        }
        else {
            this.arrow = e.target.classList.contains(ARROW_UP) ? ARROW_DOWN : ARROW_UP;
        }
        this.updateCurrentSeparator(e.target);
        this.currentIndex(e);
        this.updateBars(this.currentBarIndex);
        this.getPaneDetails();
    }
    triggerResizing(e) {
        let eventArgs = isBlazor() ? {
            element: this.element,
            event: e,
            index: [this.prevPaneIndex, this.nextPaneIndex],
            paneSize: [this.prePaneDimenson, this.nextPaneDimension],
            separator: this.currentSeparator
        } : {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            paneSize: [this.prePaneDimenson, this.nextPaneDimension],
            separator: this.currentSeparator
        };
        this.trigger('resizing', eventArgs);
    }
    onMouseDown(e) {
        e.preventDefault();
        let target = e.target;
        if (target.classList.contains(NAVIGATE_ARROW)) {
            return;
        }
        this.updateCurrentSeparator(target);
        addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.updateCursorPosition(e, 'previous');
        this.getPaneDetails();
        let eventArgs = isBlazor() ? {
            element: this.element,
            event: e,
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.currentSeparator,
            cancel: false
        } : {
            element: this.element,
            event: e,
            pane: [this.previousPane, this.nextPane],
            index: [this.getPreviousPaneIndex(), this.getNextPaneIndex()],
            separator: this.currentSeparator,
            cancel: false
        };
        for (let i = 0; i < this.element.querySelectorAll('iframe').length; i++) {
            this.element.querySelectorAll('iframe')[i].style.pointerEvents = 'none';
        }
        this.trigger('resizeStart', eventArgs, (resizeStartArgs) => {
            if (!resizeStartArgs.cancel) {
                this.wireResizeEvents();
                this.checkPaneSize(e);
            }
        });
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
                let offset = (this.orientation === 'Horizontal') ? (pane.offsetWidth) : (pane.offsetHeight);
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
        return prePaneIndex;
    }
    getNextPaneIndex() {
        let nextPaneIndex = (parseInt(this.currentSeparator.style.order, 10) - 1) / (2);
        return nextPaneIndex + 1;
    }
    getPaneDetails() {
        let prevPane = null;
        let nextPane = null;
        this.order = parseInt(this.currentSeparator.style.order, 10);
        if (this.allPanes.length > 1) {
            prevPane = this.getPrevPane(this.currentSeparator, this.order);
            nextPane = this.getNextPane(this.currentSeparator, this.order);
        }
        if (prevPane && nextPane) {
            this.previousPane = prevPane;
            this.nextPane = nextPane;
            this.prevPaneIndex = this.getPreviousPaneIndex();
            this.nextPaneIndex = this.getNextPaneIndex();
        }
        else {
            return;
        }
    }
    getPaneHeight(pane) {
        return ((this.orientation === 'Horizontal') ? pane.offsetWidth.toString() :
            pane.offsetHeight.toString());
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
        this.triggerResizing(e);
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
        let eventArgs = isBlazor() ? {
            event: e,
            element: this.element,
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            paneSize: [this.prePaneDimenson, this.nextPaneDimension]
        } : {
            event: e,
            element: this.element,
            pane: [this.previousPane, this.nextPane],
            index: [this.prevPaneIndex, this.nextPaneIndex],
            separator: this.currentSeparator,
            paneSize: [this.prePaneDimenson, this.nextPaneDimension]
        };
        for (let i = 0; i < this.element.querySelectorAll('iframe').length; i++) {
            this.element.querySelectorAll('iframe')[i].style.pointerEvents = 'auto';
        }
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
                    if (index < childCount - 1 && this.paneSettings[index].size !== '') {
                        addClass([child[index]], STATIC_PANE);
                    }
                    else if (!this.sizeFlag) {
                        child[index].style.flexBasis = null;
                    }
                    if ((index === childCount - 1) && this.sizeFlag && this.paneSettings[index].size !== '') {
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
        toElement.innerHTML = '';
        template = typeof (template) === 'string' ? this.sanitizeHelper(template) : template;
        this.templateCompile(toElement, template);
    }
    // tslint:disable-next-line
    templateCompile(ele, cnt) {
        let blazorContain = Object.keys(window);
        let tempEle = this.createElement('div');
        this.compileElement(tempEle, cnt, 'content');
        if (tempEle.childNodes.length !== 0) {
            [].slice.call(tempEle.childNodes).forEach((childEle) => {
                ele.appendChild(childEle);
            });
            if (blazorContain.indexOf('ejsInterop') !== -1 && !this.isStringTemplate && cnt.indexOf('<div>Blazor') === 0) {
                updateBlazorTemplate(this.element.id + 'content' + this.allPanes.length.toString(), 'ContentTemplate', this.paneSettings[this.allPanes.length - 1]);
            }
        }
    }
    compileElement(ele, val, prop) {
        let blazorContain = Object.keys(window);
        if (typeof (val) === 'string') {
            if (val[0] === '.' || val[0] === '#') {
                let eleVal = document.querySelector(val);
                if (!isNullOrUndefined(eleVal)) {
                    this.templateElement.push(eleVal);
                    if (eleVal.style.display === 'none') {
                        eleVal.style.removeProperty('display');
                    }
                    if (eleVal.getAttribute('style') === '') {
                        eleVal.removeAttribute('style');
                    }
                    ele.appendChild(eleVal);
                    return;
                }
                else {
                    val = val.trim();
                }
            }
            else {
                val = val.trim();
            }
        }
        let templateFn;
        if (!isNullOrUndefined(val.outerHTML)) {
            templateFn = compile(val.outerHTML);
        }
        else {
            templateFn = compile(val);
        }
        let templateFUN;
        if (!isNullOrUndefined(templateFn)) {
            if (blazorContain.indexOf('ejsInterop') !== -1 && !this.isStringTemplate && val.indexOf('<div>Blazor') === 0) {
                templateFUN = templateFn({}, this, prop, this.element.id + 'content' + this.allPanes.length.toString(), this.isStringTemplate);
            }
            else {
                templateFUN = templateFn({}, this, prop, this.element.id + 'content' + this.allPanes.length.toString(), true);
            }
        }
        if (!isNullOrUndefined(templateFn) && templateFUN.length > 0) {
            [].slice.call(templateFUN).forEach((el) => {
                ele.appendChild(el);
            });
        }
    }
    paneCollapsible(pane, index) {
        this.paneSettings[index].collapsible ? addClass([pane], COLLAPSIBLE) : removeClass([pane], COLLAPSIBLE);
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
        this.sizeFlag = false;
        if (childCount > 0) {
            for (let i = 0; i < childCount; i++) {
                // To accept only div and span element as pane
                if (child[i].nodeName === 'DIV' || child[i].nodeName === 'SPAN') {
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
                    if (!isNullOrUndefined(this.paneSettings[i]) && this.paneSettings[i].cssClass) {
                        this.setCssClass(child[i], this.paneSettings[i].cssClass);
                    }
                    if (!isNullOrUndefined(this.paneSettings[i])) {
                        this.paneCollapsible(child[i], i);
                    }
                }
            }
        }
    }
    ;
    /**
     * expands corresponding pane based on the index is passed.
     * @param { number } index - Specifies the index value of the corresponding pane to be expanded at initial rendering of splitter.
     * @returns void
     */
    expand(index) {
        this.collapsedOnchange(index);
    }
    /**
     * collapses corresponding pane based on the index is passed.
     * @param { number } index - Specifies the index value of the corresponding pane to be collapsed at initial rendering of splitter.
     * @returns void
     */
    collapse(index) {
        this.isCollapsed(index);
    }
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    destroy() {
        if (!this.isDestroyed) {
            super.destroy();
            EventHandler.remove(document, 'touchstart click', this.onDocumentClick);
            while (this.element.attributes.length > 0) {
                this.element.removeAttribute(this.element.attributes[0].name);
            }
            this.element.innerHTML = this.wrapper.innerHTML;
            for (let i = 0; i < this.wrapper.attributes.length; i++) {
                this.element.setAttribute(this.wrapper.attributes[i].name, this.wrapper.attributes[i].value);
            }
            if (this.refreshing) {
                addClass([this.element], ['e-control', 'e-lib', ROOT]);
                this.allBars = [];
                this.allPanes = [];
            }
            this.restoreElem();
        }
    }
    restoreElem() {
        if (this.templateElement.length > 0) {
            for (let i = 0; i < this.templateElement.length; i++) {
                this.templateElement[i].style.display = 'none';
                document.body.appendChild(this.templateElement[i]);
            }
        }
    }
    addPaneClass(pane) {
        this.orientation === 'Horizontal' ? addClass([pane], [PANE, SPLIT_H_PANE, SCROLL_PANE]) :
            addClass([pane], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
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
            resizable: isNullOrUndefined(paneProperties.resizable) ? true : paneProperties.resizable,
            collapsible: isNullOrUndefined(paneProperties.collapsible) ? false : paneProperties.collapsible,
            collapsed: isNullOrUndefined(paneProperties.collapsed) ? false : paneProperties.collapsed,
            cssClass: isNullOrUndefined(paneProperties.cssClass) ? '' : paneProperties.cssClass
        };
        this.paneSettings.splice(index, 0, paneDetails);
        this.setProperties({ 'paneSettings': this.paneSettings }, true);
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
        this.setCssClass(this.allPanes[index], paneProperties.cssClass);
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
        this.paneSettings.splice(index, 1);
        this.setProperties({ 'paneSettings': this.paneSettings }, true);
        if (this.allPanes.length > 0) {
            this.allPanes[this.allPanes.length - 1].classList.remove(STATIC_PANE);
        }
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
    Property(true)
], Splitter.prototype, "enableHtmlSanitizer", void 0);
__decorate([
    Property(null)
], Splitter.prototype, "separatorSize", void 0);
__decorate([
    Event()
], Splitter.prototype, "beforeSanitizeHtml", void 0);
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
__decorate([
    Event()
], Splitter.prototype, "beforeCollapse", void 0);
__decorate([
    Event()
], Splitter.prototype, "beforeExpand", void 0);
__decorate([
    Event()
], Splitter.prototype, "collapsed", void 0);
__decorate([
    Event()
], Splitter.prototype, "expanded", void 0);
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
const preventSelect = 'e-prevent';
const dragging = 'e-dragging';
const draggable = 'e-draggable';
const resize = 'e-resize';
const responsive = 'e-responsive';
const east = 'e-east';
const west = 'e-west';
const north = 'e-north';
const south = 'e-south';
const single = 'e-single';
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
__decorate$1([
    Property(1000)
], Panel.prototype, "zIndex", void 0);
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
        this.isBlazor = false;
        this.isInlineRendering = false;
    }
    /**
     * Initialize the event handler
     * @private
     */
    preRender() {
        this.isBlazor = (isBlazor() && this.isServerRendered);
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
        this.setOldRowCol();
        this.calculateCellSize();
        this.contentTemplateChild = [].slice.call(this.element.children);
    }
    setOldRowCol() {
        for (let i = 0; i < this.panels.length; i++) {
            if (!this.panels[i].id) {
                this.panelPropertyChange(this.panels[i], { id: 'layout_' + this.panelID.toString() });
                this.panelID = this.panelID + 1;
            }
            this.oldRowCol[this.panels[i].id] = { row: this.panels[i].row, col: this.panels[i].col };
        }
    }
    createPanelElement(cssClass, idValue) {
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
        this.initialize();
        this.isRenderComplete = true;
        if (this.showGridLines && !this.checkMediaQuery()) {
            this.initGridLines();
        }
        this.updateDragArea();
        this.renderComplete();
        if (isBlazor() && this.isInlineRendering) {
            this.setProperties({ panels: this.panels }, true);
            this.allowServerDataBinding = true;
            this.serverDataBind();
        }
    }
    initGridLines() {
        this.table = document.createElement('table');
        let tbody = document.createElement('tbody');
        this.table.classList.add('e-dashboard-gridline-table');
        for (let i = 0; i < this.maxRow(); i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < this.columns; j++) {
                let td = document.createElement('td');
                td.classList.add('e-dashboard-gridline');
                this.setAttributes({ value: { row: i.toString(), col: j.toString(), sizeX: '1', sizeY: '1' } }, td);
                td.setAttribute('id', '' + j);
                this.setPanelPosition(td, i, j);
                this.setHeightAndWidth(td, { row: i, col: j, sizeX: 1, sizeY: 1 });
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        this.table.appendChild(tbody);
        this.element.appendChild(this.table);
    }
    initialize() {
        this.updateRowHeight();
        if (this.element.childElementCount > 0 && this.element.querySelectorAll('.e-panel').length > 0
            && !(this.isBlazor && this.panels.length > 0)) {
            let panelElements = [];
            this.setProperties({ panels: [] }, true);
            this.isInlineRendering = true;
            for (let i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
                panelElements.push((this.element.querySelectorAll('.e-panel')[i]));
            }
            for (let i = 0; i < panelElements.length; i++) {
                let panelElement = panelElements[i];
                if (this.enableRtl) {
                    addClass([panelElement], 'e-rtl');
                }
                this.getInlinePanels(panelElement);
                this.maxCol();
                this.maxRow();
            }
            for (let i = 0; i < this.panels.length; i++) {
                let panelElement = this.element.querySelector('#' + this.panels[i].id);
                this.setMinMaxValues(this.panels[i]);
                if (this.maxColumnValue < this.panels[i].col || this.maxColumnValue < (this.panels[i].col + this.panels[i].sizeX)) {
                    let colValue = this.maxColumnValue - this.panels[i].sizeX;
                    this.panelPropertyChange(this.panels[i], { col: colValue < 0 ? 0 : colValue });
                }
                this.setXYAttributes(panelElement, this.panels[i]);
                this.isBlazor = false;
                let panel = this.renderPanels(panelElement, this.panels[i], this.panels[i].id, false);
                this.isBlazor = (isBlazor() && this.isServerRendered);
                this.panelCollection.push(panel);
                this.setHeightAndWidth(panelElement, this.panels[i]);
                this.tempObject = this;
                if (this.mediaQuery && !window.matchMedia('(' + this.mediaQuery + ')').matches) {
                    this.setPanelPosition(panelElement, this.panels[i].row, this.panels[i].col);
                    this.mainElement = panelElement;
                    this.updatePanelLayout(panelElement, this.panels[i]);
                    this.mainElement = null;
                }
                this.setClasses([panelElement]);
            }
            if (this.checkMediaQuery()) {
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
        this.updatePanels();
        this.updateCloneArrayObject();
        this.checkColumnValue = this.maxColumnValue;
        if (!(this.checkMediaQuery())) {
            this.panelResponsiveUpdate();
        }
        if (!this.isBlazor) {
            this.setEnableRtl();
        }
    }
    checkMediaQuery() {
        return (this.mediaQuery && window.matchMedia('(' + this.mediaQuery + ')').matches);
    }
    calculateCellSize() {
        this.cellSize = [];
        if ((this.checkMediaQuery())) {
            this.cellSize[1] = this.element.parentElement
                && Math.floor((this.element.parentElement.offsetWidth)) / this.cellAspectRatio;
        }
        else {
            this.cellSize[0] = this.element.parentElement &&
                Math.floor((this.element.parentElement.offsetWidth));
            this.cellSize[0] = this.element.parentElement
                && Math.floor((this.element.parentElement.offsetWidth - ((this.maxCol() - 1) * this.cellSpacing[0]))
                    / (this.maxCol()));
            this.cellSize[1] = this.cellSize[0] / this.cellAspectRatio;
        }
    }
    maxRow(recheck) {
        let maxRow = 1;
        if (this.rows > 1 && isNullOrUndefined(recheck)) {
            maxRow = this.rows;
            return maxRow;
        }
        for (let i = 0; i < this.panels.length; i++) {
            if (this.panels[i].sizeY + this.panels[i].row > maxRow) {
                maxRow = this.panels[i].sizeY + this.panels[i].row;
            }
        }
        if (this.panels.length === 0) {
            maxRow = this.columns;
        }
        return maxRow;
    }
    maxCol() {
        let maxCol = 1;
        maxCol = this.columns;
        this.maxColumnValue = maxCol;
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
                let sanitizedValue = SanitizeHtmlHelper.sanitize(template);
                return compile((this.enableHtmlSanitizer && typeof (template) === 'string') ? sanitizedValue : template);
            }
        }
        return undefined;
    }
    renderTemplate(content, appendElement, type, isStringTemplate) {
        let templateFn = this.templateParser(content);
        let templateElements = [];
        for (let item of templateFn({}, null, null, type, isStringTemplate)) {
            templateElements.push(item);
        }
        append([].slice.call(templateElements), appendElement);
    }
    renderPanels(cellElement, panelModel, panelId, isStringTemplate) {
        if (!this.isBlazor) {
            addClass([cellElement], [panel, panelTransition]);
        }
        this.panelContent = cellElement.querySelector('.e-panel-container') ?
            cellElement.querySelector('.e-panel-container') :
            this.createSubElement(panelModel.cssClass, cellElement.id + '_content', panelContainer);
        if (!this.isBlazor) {
            cellElement.appendChild(this.panelContent);
            if (!panelModel.enabled) {
                this.disablePanel(cellElement);
            }
        }
        if (panelModel.header) {
            let headerTemplateElement = cellElement.querySelector('.e-panel-header') ?
                cellElement.querySelector('.e-panel-header') : this.createSubElement('', cellElement.id + 'template', '');
            if (!this.isBlazor) {
                addClass([headerTemplateElement], [header]);
            }
            if (!cellElement.querySelector('.e-panel-header') && !this.isBlazor) {
                let id = this.element.id + 'HeaderTemplate' + panelId;
                this.renderTemplate(panelModel.header, headerTemplateElement, id, isStringTemplate);
                this.panelContent.appendChild(headerTemplateElement);
                updateBlazorTemplate(id, 'HeaderTemplate', panelModel);
            }
        }
        if (panelModel.content) {
            this.panelBody = cellElement.querySelector('.e-panel-content') ? cellElement.querySelector('.e-panel-content') :
                this.createSubElement(panelModel.cssClass, cellElement.id + '_body', panelContent);
            let headerHeight = this.panelContent.querySelector('.e-panel-header') ?
                window.getComputedStyle(this.panelContent.querySelector('.e-panel-header')).height : '0px';
            let contentHeightValue = 'calc( 100% - ' + headerHeight + ')';
            setStyleAttribute(this.panelBody, { height: contentHeightValue });
            if (!cellElement.querySelector('.e-panel-content') && !this.isBlazor) {
                let id = this.element.id + 'ContentTemplate' + panelId;
                this.renderTemplate(panelModel.content, this.panelBody, id, isStringTemplate);
                this.panelContent.appendChild(this.panelBody);
                updateBlazorTemplate(id, 'ContentTemplate', panelModel);
            }
        }
        return cellElement;
    }
    disablePanel(panelElement) {
        addClass([panelElement], [disable]);
    }
    getInlinePanels(panelElement) {
        let model = {
            sizeX: panelElement.hasAttribute('data-sizex') ? parseInt(panelElement.getAttribute('data-sizex'), 10) : 1,
            sizeY: panelElement.hasAttribute('data-sizey') ? parseInt(panelElement.getAttribute('data-sizey'), 10) : 1,
            minSizeX: panelElement.hasAttribute('data-minsizex') ? parseInt(panelElement.getAttribute('data-minsizex'), 10) : 1,
            minSizeY: panelElement.hasAttribute('data-minsizey') ? parseInt(panelElement.getAttribute('data-minsizey'), 10) : 1,
            maxSizeX: panelElement.hasAttribute('data-maxsizex') ? parseInt(panelElement.getAttribute('data-maxsizex'), 10) : null,
            maxSizeY: panelElement.hasAttribute('data-maxsizey') ? parseInt(panelElement.getAttribute('data-maxsizey'), 10) : null,
            row: panelElement.hasAttribute('data-row') ? parseInt(panelElement.getAttribute('data-row'), 10) : 0,
            col: panelElement.hasAttribute('data-col') ? parseInt(panelElement.getAttribute('data-col'), 10) : 0,
            id: panelElement.getAttribute('id'),
            zIndex: panelElement.hasAttribute('data-zindex') ? parseInt(panelElement.getAttribute('data-zIndex'), 10) : 1000,
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
        panelElement.style.zIndex = '' + model.zIndex;
        // tslint:disable-next-line
        let panelProp = new Panel(this, 'panels', model, true);
        this.panels.push(panelProp);
    }
    resizeEvents() {
        if (this.allowResizing) {
            let panelElements = this.element.querySelectorAll('.e-panel .e-panel-container .e-resize');
            for (let i = 0; i < panelElements.length; i++) {
                let eventName = (Browser.info.name === 'msie') ? 'mousedown pointerdown' : 'mousedown';
                EventHandler.add(panelElements[i], eventName, this.downResizeHandler, this);
                if (Browser.info.name !== 'msie') {
                    EventHandler.add(panelElements[i], 'touchstart', this.touchDownResizeHandler, this);
                }
            }
        }
    }
    bindEvents() {
        window.addEventListener('resize', this.refresh.bind(this));
        this.resizeEvents();
    }
    downResizeHandler(e) {
        this.downHandler(e);
        this.lastMouseX = e.pageX;
        this.lastMouseY = e.pageY;
        let moveEventName = (Browser.info.name === 'msie') ? 'mousemove pointermove' : 'mousemove';
        let upEventName = (Browser.info.name === 'msie') ? 'mouseup pointerup' : 'mouseup';
        if (!this.isMouseMoveBound) {
            EventHandler.add(document, moveEventName, this.moveResizeHandler, this);
            this.isMouseMoveBound = true;
        }
        if (!this.isMouseUpBound) {
            EventHandler.add(document, upEventName, this.upResizeHandler, this);
            this.isMouseUpBound = true;
        }
    }
    ;
    downHandler(e) {
        this.resizeCalled = false;
        let el = closest((e.currentTarget), '.e-panel');
        let args = { event: e, element: el };
        this.trigger('resizeStart', args);
        this.downTarget = e.currentTarget;
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        addClass([this.element], [preventSelect]);
        this.element.appendChild(this.shadowEle);
        this.elementX = parseInt(el.style.left, 10);
        this.elementY = parseInt(el.style.top, 10);
        this.elementWidth = el.offsetWidth;
        this.elementHeight = el.offsetHeight;
        this.originalWidth = this.getCellInstance(el.id).sizeX;
        this.originalHeight = this.getCellInstance(el.id).sizeY;
        this.previousRow = this.getCellInstance(el.id).row;
    }
    touchDownResizeHandler(e) {
        this.downHandler(e);
        this.lastMouseX = e.changedTouches[0].pageX;
        this.lastMouseY = e.changedTouches[0].pageY;
        if (!this.isMouseMoveBound) {
            EventHandler.add(document, 'touchmove', this.touchMoveResizeHandler, this);
            this.isMouseMoveBound = true;
        }
        if (!this.isMouseUpBound) {
            EventHandler.add(document, 'touchend', this.upResizeHandler, this);
            this.isMouseUpBound = true;
        }
    }
    getCellSize() {
        return [parseInt((this.cellSize[0]), 10), parseInt(this.cellSize[1], 10)];
    }
    updateMaxTopLeft(e) {
        this.moveTarget = this.downTarget;
        let el = closest((this.moveTarget), '.e-panel');
        let args = { event: e, element: el };
        this.trigger('resize', args);
    }
    updateResizeElement(el) {
        this.maxLeft = this.element.offsetWidth - 1;
        this.maxTop = this.cellSize[1] * this.maxRows - 1;
        removeClass([el], 'e-panel-transition');
        addClass([el], [dragging]);
        let handleArray = [east, west, north, south, southEast, northEast, northWest, southWest];
        for (let i = 0; i < this.moveTarget.classList.length; i++) {
            if (handleArray.indexOf(this.moveTarget.classList[i]) !== -1) {
                this.handleClass = (this.moveTarget.classList[i]);
            }
        }
    }
    moveResizeHandler(e) {
        this.updateMaxTopLeft(e);
        let el = closest((this.moveTarget), '.e-panel');
        if (this.lastMouseX === e.pageX || this.lastMouseY === e.pageY) {
            return;
        }
        this.updateResizeElement(el);
        let panelModel = this.getCellInstance(el.getAttribute('id'));
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
        let diffY = this.mouseY - this.lastMouseY + this.mOffY;
        let diffX = this.mouseX - this.lastMouseX + this.mOffX;
        this.mOffX = this.mOffY = 0;
        this.lastMouseY = this.mouseY;
        this.lastMouseX = this.mouseX;
        this.resizingPanel(el, panelModel, diffX, diffY);
    }
    touchMoveResizeHandler(e) {
        this.updateMaxTopLeft(e);
        let el = closest((this.moveTarget), '.e-panel');
        if (this.lastMouseX === e.changedTouches[0].pageX || this.lastMouseY === e.changedTouches[0].pageY) {
            return;
        }
        this.updateResizeElement(el);
        let panelModel = this.getCellInstance(el.getAttribute('id'));
        this.mouseX = e.changedTouches[0].pageX;
        this.mouseY = e.changedTouches[0].pageY;
        let diffX = this.mouseX - this.lastMouseX + this.mOffX;
        let diffY = this.mouseY - this.lastMouseY + this.mOffY;
        this.mOffX = this.mOffY = 0;
        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
        this.resizingPanel(el, panelModel, diffX, diffY);
    }
    /* istanbul ignore next */
    resizingPanel(el, panelModel, currentX, currentY) {
        let oldSizeX = this.getCellInstance(el.id).sizeX;
        let oldSizeY = this.getCellInstance(el.id).sizeY;
        let dY = currentY;
        let dX = currentX;
        if (this.handleClass.indexOf('north') >= 0) {
            if (this.elementHeight - dY < this.getMinHeight(panelModel)) {
                currentY = this.elementHeight - this.getMinHeight(panelModel);
                this.mOffY = dY - currentY;
            }
            else if (panelModel.maxSizeY && this.elementHeight - dY > this.getMaxHeight(panelModel)) {
                currentY = this.elementHeight - this.getMaxHeight(panelModel);
                this.mOffY = dY - currentY;
            }
            else if (this.elementY + dY < this.minTop) {
                currentY = this.minTop - this.elementY;
                this.mOffY = dY - currentY;
            }
            this.elementY += currentY;
            this.elementHeight -= currentY;
        }
        if (this.handleClass.indexOf('south') >= 0) {
            if (this.elementHeight + dY < this.getMinHeight(panelModel)) {
                currentY = this.getMinHeight(panelModel) - this.elementHeight;
                this.mOffY = dY - currentY;
            }
            else if (panelModel.maxSizeY && this.elementHeight + dY > this.getMaxHeight(panelModel)) {
                currentY = this.getMaxHeight(panelModel) - this.elementHeight;
                this.mOffY = dY - currentY;
            }
            else if (this.elementY + this.elementHeight + dY > this.maxTop) {
                currentY = this.maxTop - this.elementY - this.elementHeight;
                this.mOffY = dY - currentY;
            }
            this.elementHeight += currentY;
        }
        if (this.handleClass.indexOf('west') >= 0) {
            if (this.elementWidth - dX < this.getMinWidth(panelModel)) {
                currentX = this.elementWidth - this.getMinWidth(panelModel);
                this.mOffX = dX - currentX;
            }
            else if (panelModel.maxSizeX && this.elementWidth - dX > this.getMaxWidth(panelModel)) {
                currentX = this.elementWidth - this.getMaxWidth(panelModel);
                this.mOffX = dX - currentX;
            }
            else if (this.elementX + dX < this.minLeft) {
                currentX = this.minLeft - this.elementX;
                this.mOffX = dX - currentX;
            }
            this.elementX += currentX;
            this.elementWidth -= currentX;
        }
        if (this.handleClass.indexOf('east') >= 0) {
            if (this.elementWidth + dX < this.getMinWidth(panelModel)) {
                currentX = this.getMinWidth(panelModel) - this.elementWidth;
                this.mOffX = dX - currentX;
            }
            else if (panelModel.maxSizeX && this.elementWidth + dX > this.getMaxWidth(panelModel)) {
                currentX = this.getMaxWidth(panelModel) - this.elementWidth;
                this.mOffX = dX - currentX;
            }
            else if (this.elementX + this.elementWidth + dX > this.maxLeft) {
                currentX = this.maxLeft - this.elementX - this.elementWidth;
                this.mOffX = dX - currentX;
            }
            this.elementWidth += currentX;
        }
        el.style.top = this.elementY + 'px';
        el.style.left = this.elementX + 'px';
        el.style.width = this.elementWidth + 'px';
        el.style.height = this.elementHeight + 'px';
        let item = this.getResizeRowColumn(panelModel, this.moveTarget);
        if (item.col + item.sizeX > this.columns) {
            this.panelPropertyChange(item, { sizeX: item.sizeX - 1 });
        }
        this.shadowEle.style.top = ((item.row * this.getCellSize()[1] + (item.row * this.cellSpacing[1]))) + 'px';
        this.shadowEle.style.left = ((item.col * this.getCellSize()[0]) + ((item.col) * this.cellSpacing[0])) + 'px';
        this.shadowEle.style.height = ((item.sizeY * (this.getCellSize()[1] + (this.cellSpacing[1])))) + 'px';
        this.shadowEle.style.width = ((item.sizeX * (this.getCellSize()[0] + (this.cellSpacing[0])))) + 'px';
        if (oldSizeX !== item.sizeX || oldSizeY !== item.sizeY) {
            oldSizeX = item.sizeX;
            oldSizeY = item.sizeY;
            let model = this.getCellInstance(el.id);
            let value = {
                attributes: {
                    row: model.row.toString(),
                    col: model.col.toString(),
                    sizeX: model.sizeX.toString(),
                    sizeY: model.sizeY.toString()
                }
            };
            this.setAttributes(value, el);
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
        let el = closest((this.upTarget), '.e-panel');
        let args = { event: e, element: el };
        if (el) {
            addClass([el], 'e-panel-transition');
            let moveEventName = (Browser.info.name === 'msie') ? 'mousemove pointermove' : 'mousemove';
            let upEventName = (Browser.info.name === 'msie') ? 'mouseup pointerup' : 'mouseup';
            EventHandler.remove(document, moveEventName, this.moveResizeHandler);
            EventHandler.remove(document, upEventName, this.upResizeHandler);
            if (Browser.info.name !== 'msie') {
                EventHandler.remove(document, 'touchmove', this.touchMoveResizeHandler);
                EventHandler.remove(document, 'touchend', this.upResizeHandler);
            }
            this.isMouseUpBound = false;
            this.isMouseMoveBound = false;
            if (this.shadowEle) {
                detach(this.shadowEle);
            }
            this.shadowEle = null;
            let panelModel = this.getCellInstance(el.getAttribute('id'));
            this.setPanelPosition(el, panelModel.row, panelModel.col);
            this.setHeightAndWidth(el, panelModel);
        }
        removeClass([el], [dragging]);
        this.trigger('resizeStop', args);
        this.resizeCalled = false;
        this.lastMouseX = this.lastMouseY = undefined;
        this.mOffX = this.mOffY = 0;
        this.mainElement = null;
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.updatePanels();
        this.updateCloneArrayObject();
    }
    getResizeRowColumn(item, e) {
        let isChanged = false;
        let col = item.col;
        if (['e-west', 'e-south-west'].indexOf(this.handleClass) !== -1) {
            col = this.pixelsToColumns(this.elementX, false);
        }
        let row = item.row;
        if (['e-north'].indexOf(this.handleClass) !== -1) {
            row = this.pixelsToRows(this.elementY, false);
            if (this.previousRow !== row) {
                this.previousRow = row;
                isChanged = true;
            }
        }
        let sizeX = item.sizeX;
        if (['e-north', 'e-south'].indexOf(this.handleClass) === -1) {
            sizeX = this.pixelsToColumns(this.elementWidth - (sizeX) * this.cellSpacing[1], true);
        }
        let sizeY = item.sizeY;
        if (['e-east', 'e-west'].indexOf(this.handleClass) === -1) {
            if (this.handleClass === 'e-north' ? isChanged : true) {
                sizeY = this.pixelsToRows(this.elementHeight - (sizeY) * this.cellSpacing[0], true);
            }
        }
        if (item.col + item.sizeX > this.columns) {
            item.sizeX = item.sizeX - 1;
        }
        let canOccupy = row > -1 && col > -1 && sizeX + col <= this.maxCol() && sizeY + row <= this.maxRow();
        if (canOccupy && (this.collisions(row, col, sizeX, sizeY, this.getPanelBase(item.id)).length === 0)
            || this.allowPushing !== false) {
            this.panelPropertyChange(item, { row: row, col: col, sizeX: sizeX, sizeY: sizeY });
        }
        return item;
    }
    pixelsToColumns(pixels, isCeil) {
        let curColWidth = this.cellSize[0];
        if (isCeil) {
            return Math.ceil(pixels / curColWidth);
        }
        else {
            return Math.floor(pixels / curColWidth);
        }
    }
    pixelsToRows(pixels, isCeil) {
        if (isCeil) {
            return Math.round(pixels / this.cellSize[1]);
        }
        else {
            return Math.round(pixels / (this.cellSize[1] + this.cellSpacing[0]));
        }
    }
    getMinWidth(item) {
        return (item.minSizeX) * this.getCellSize()[0];
    }
    ;
    getMaxWidth(item) {
        return (item.maxSizeX) * this.getCellSize()[0];
    }
    ;
    getMinHeight(item) {
        return (item.minSizeY) * this.getCellSize()[1];
    }
    ;
    getMaxHeight(item) {
        return (item.maxSizeY) * this.getCellSize()[1];
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
        this.updateGridLines();
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
            let items = this.collisions(rowIndex, colIndex, sizeX, sizeY, item);
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
            if (this.oldRowCol[item.id] !== undefined && this.oldRowCol[item.id].row !== null &&
                typeof this.oldRowCol[item.id].col !== 'undefined') {
                {
                    let oldRow = this.sortedArray[this.oldRowCol[item.id].row];
                    if (this.oldRowCol[item.id] && oldRow[this.oldRowCol[item.id].col] === item) {
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
            this.panelPropertyChange(this.getCellInstance(item.id), { row: rowValue, col: columnValue });
            let panelModel = this.getCellInstance(item.id);
            this.setAttributes({ value: { col: panelModel.col.toString(), row: panelModel.row.toString() } }, item);
            this.updateLayout(item, this.getCellInstance(item.id));
        }
    }
    updateLayout(element, panelModel) {
        this.setPanelPosition(element, panelModel.row, panelModel.col);
        this.setHeightAndWidth(element, panelModel);
        this.updateRowHeight();
        this.sortedPanel();
    }
    ;
    refresh() {
        this.updateDragArea();
        if (this.checkMediaQuery()) {
            this.checkMediaQuerySizing();
        }
        else {
            if (this.element.classList.contains(responsive)) {
                removeClass([this.element], [responsive]);
                for (let i = 0; i < this.element.querySelectorAll('.e-panel').length; i++) {
                    let ele = this.element.querySelectorAll('.e-panel')[i];
                    let cellInstance = this.getCellInstance(ele.id);
                    let row = parseInt(ele.getAttribute('data-row'), 10);
                    let col = parseInt(ele.getAttribute('data-col'), 10);
                    this.panelPropertyChange(cellInstance, { row: row, col: col });
                    this.setHeightAndWidth(ele, this.getCellInstance(ele.id));
                    this.setPanelPosition(ele, row, col);
                    this.updateRowHeight();
                }
            }
            this.panelResponsiveUpdate();
            this.updateGridLines();
        }
        this.removeResizeClasses(this.panelCollection);
        this.setClasses(this.panelCollection);
        this.resizeEvents();
        this.checkDragging(this.dragCollection);
    }
    updateGridLines() {
        if (this.element.querySelector('.e-dashboard-gridline-table')) {
            if (this.table) {
                detach(this.table);
            }
            this.initGridLines();
        }
    }
    checkDragging(dragCollection) {
        if (this.checkMediaQuery() || !this.allowDragging) {
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
    sortPanels() {
        let model = [];
        for (let row = 0; row <= this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                this.panels.filter((panel) => {
                    if (panel.row === row && panel.col === col) {
                        model.push(panel);
                    }
                });
            }
        }
        return model;
    }
    checkMediaQuerySizing() {
        addClass([this.element], [responsive]);
        let updatedPanel = this.sortPanels();
        this.updatedRows = updatedPanel.length;
        for (let i = 0; i < updatedPanel.length; i++) {
            let panelElement = document.getElementById(updatedPanel[i].id);
            if (panelElement) {
                setStyleAttribute(panelElement, { 'width': '100%' });
                panelElement.style.height = ' ' + (this.element.parentElement
                    && this.element.parentElement.offsetWidth / this.cellAspectRatio) + 'px';
                this.cellSize[1] = this.element.parentElement
                    && (this.element.parentElement.offsetWidth / this.cellAspectRatio);
                this.panelPropertyChange(updatedPanel[i], { row: i, col: 0 });
                this.setPanelPosition(panelElement, updatedPanel[i].row, updatedPanel[i].col);
                this.setClasses(this.panelCollection);
                this.checkDragging(this.dragCollection);
                this.removeResizeClasses(this.panelCollection);
            }
        }
        this.updateRowHeight();
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
        this.updateRowHeight();
    }
    updateRowHeight() {
        this.getRowColumn();
        this.setHeightWidth();
    }
    setHeightWidth() {
        let heightValue;
        let widthValue;
        if (this.checkMediaQuery()) {
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
    renderCell(panel, isStringTemplate, index) {
        let cellElement;
        this.dimensions = this.setXYDimensions(panel);
        if (isUndefined(panel.enabled)) {
            panel.enabled = true;
        }
        if (this.isBlazor) {
            cellElement = document.getElementById(panel.id);
        }
        else {
            if (this.contentTemplateChild.length > 0 && !isNullOrUndefined(index)) {
                cellElement = this.contentTemplateChild[index];
                if (panel.cssClass) {
                    addClass([cellElement], [panel.cssClass]);
                }
                if (panel.id) {
                    cellElement.setAttribute('id', panel.id);
                }
            }
            else {
                cellElement = this.createPanelElement(panel.cssClass, panel.id);
            }
            cellElement.style.zIndex = '' + panel.zIndex;
            this.element.appendChild(cellElement);
        }
        let dashBoardCell = this.renderPanels(cellElement, panel, panel.id, isStringTemplate);
        this.panelCollection.push(dashBoardCell);
        if (!this.isBlazor) {
            this.setXYAttributes(cellElement, panel);
        }
        else {
            let bodyElement = cellElement.querySelector('.e-panel-content');
            if (bodyElement) {
                let headerHeight = cellElement.querySelector('.e-panel-header') ?
                    window.getComputedStyle(cellElement.querySelector('.e-panel-header')).height : '0px';
                let contentHeightValue = 'calc( 100% - ' + headerHeight + ')';
                setStyleAttribute(bodyElement, { height: contentHeightValue });
            }
        }
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
            this.panelPropertyChange(panel, { sizeX: panel.minSizeX });
        }
        else if ((panel.maxSizeX && panel.sizeX > panel.maxSizeX)) {
            this.panelPropertyChange(panel, { sizeX: panel.maxSizeX });
        }
        else if (panel.sizeX > this.columns) {
            this.panelPropertyChange(panel, { sizeX: this.columns });
        }
        else {
            this.panelPropertyChange(panel, { sizeX: panel.sizeX });
        }
        if (!panel.sizeY || panel.sizeY < panel.minSizeY) {
            this.panelPropertyChange(panel, { sizeY: panel.minSizeY });
        }
        else if (panel.maxSizeY && panel.sizeY > panel.maxSizeY) {
            this.panelPropertyChange(panel, { sizeY: panel.maxSizeY });
        }
        else {
            this.panelPropertyChange(panel, { sizeY: panel.sizeY });
        }
    }
    checkMinMaxValues(panel) {
        if (panel.col + panel.sizeX > this.columns) {
            this.panelPropertyChange(panel, { sizeX: panel.sizeX + (this.columns - (panel.col + panel.sizeX)) });
        }
    }
    panelPropertyChange(panel, value) {
        this.allowServerDataBinding = false;
        // tslint:disable-next-line
        panel.setProperties(value, true);
    }
    renderDashBoardCells(cells) {
        if (this.element.querySelectorAll('.e-panel').length > 0 || this.panels.length > 0) {
            for (let j = 0; j < cells.length; j++) {
                this.gridPanelCollection.push(cells[j]);
                if (!(this.isBlazor && this.panels.length > 0)) {
                    this.setMinMaxValues(cells[j]);
                }
                if (this.maxColumnValue < cells[j].col || this.maxColumnValue < (cells[j].col + cells[j].sizeX)) {
                    this.panelPropertyChange(cells[j], { col: this.maxColumnValue - cells[j].sizeX });
                }
                let cell = this.renderCell(cells[j], false, j);
                if (!this.isBlazor) {
                    if (this.enableRtl) {
                        addClass([cell], 'e-rtl');
                    }
                    this.element.appendChild(cell);
                }
                if (this.checkMediaQuery() && j === cells.length - 1) {
                    this.checkMediaQuerySizing();
                }
                else {
                    this.setPanelPosition(cell, cells[j].row, cells[j].col);
                    this.mainElement = cell;
                    this.updatePanelLayout(cell, cells[j]);
                    this.mainElement = null;
                }
            }
        }
        this.setClasses(this.panelCollection);
    }
    collisions(row, col, sizeX, sizeY, ignore) {
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
        rowElement = this.getRowElements(this.collisions(row, 0, this.columns, sizeY, []));
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
                if ((rowValue !== endRow) && (rowValue === endRow - sizeY) &&
                    this.collisions(rowValue, col, sizeX, sizeY, element).length === 0) {
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
                        let collisionValue = this.collisions(row, spaces[i], sizeX, sizeY, this.checkingElement);
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
                        let collisionValue = this.collisions(row, spacing[i], sizeX, sizeY, this.checkingElement);
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
        let removeableElement = [];
        if (!this.mainElement) {
            this.sortedPanel();
        }
        collisionItems.forEach((element) => {
            this.checkingElement = element;
            let model = this.getCellInstance(element.id);
            let adjust = !this.adjustmentAvailable(model.row, model.col, model.sizeY, model.sizeX, ele);
            if (model.sizeX > 1 && adjust) {
                for (let rowValue = model.row; rowValue < panelModel.row + panelModel.sizeY; rowValue++) {
                    let collisions = this.collisions(rowValue, model.col, model.sizeX, model.sizeY, element);
                    collisions.forEach((item) => {
                        if (collisionItems.indexOf(item) >= 0 && removeableElement.indexOf(item) === -1) {
                            removeableElement.push(item);
                        }
                    });
                }
            }
        });
        removeableElement.forEach((item) => {
            if (removeableElement.indexOf(item) >= 0) {
                collisionItems.splice(collisionItems.indexOf(item), 1);
            }
        });
        return collisionItems;
    }
    resetLayout(model, element) {
        let collisions = this.collisions(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
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
                this.panelPropertyChange(this.getCellInstance(element.id), { row: rowValue, col: colValue });
                this.setAttributes({ value: { col: colValue.toString(), row: rowValue.toString() } }, element);
                this.updateOldRowColumn();
            }
        }
        this.sortedArray = this.cloneArray;
        collisions = this.collisions(model.row, model.col, model.sizeX, model.sizeY, this.mainElement);
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
                collision = this.collisions(eleModel.row + i, collideModel.col, collideModel.sizeX, collideModel.sizeY, excludeEle);
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
            if (collideInstance.sizeY === 1 && ignore.indexOf(collisions[count]) === -1) {
                ignore.push(collisions[count]);
            }
            else if (collideInstance.sizeY > 1 && ignore.indexOf(collisions[count]) === -1) {
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
            if (collideInstance.sizeY <= elementinstance.sizeY && ignore.indexOf(collisions[count]) === -1) {
                ignore.push(collisions[count]);
            }
            let swapCollision;
            ignore.push(this.mainElement);
            swapCollision = this.collisions(updatedRow, collideInstance.col, collideInstance.sizeX, collideInstance.sizeY, ignore);
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
        if (!this.movePanelCalled) {
            let collisionInstance = this.getCellInstance(collisions[0].id);
            this.panelPropertyChange(panelModel, { row: direction === 0 ? eleSwapRow : collisionItemsRow + collisionInstance.sizeY });
        }
        for (let count = 0; count < collisions.length; count++) {
            swappedElements.push(collisions[count]);
            this.setPanelPosition(collisions[count], collisionItemsRow, (this.getCellInstance(collisions[count].id)).col);
            this.panelPropertyChange(this.getCellInstance(collisions[count].id), { row: collisionItemsRow });
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
        if (this.mainElement && this.isRenderComplete) {
            initialModel = this.resetLayout(panelModel, element);
        }
        else {
            initialModel = this.collisions(panelModel.row, panelModel.col, panelModel.sizeX, panelModel.sizeY, element);
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
                        let value = {
                            attributes: {
                                row: this.spacedRowValue.toString(),
                                col: this.spacedColumnValue.toString(),
                            }
                        };
                        this.setAttributes(value, initialModel[i]);
                        this.panelPropertyChange(model, { col: this.spacedColumnValue, row: this.spacedRowValue });
                        // updated the panel model array as inTopAdjustable case with floating enabled instead of dragging and extra row
                        if (this.topAdjustable && this.allowFloating) {
                            this.updatePanels();
                            this.updateCloneArrayObject();
                        }
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
        this.updateRowHeight();
        this.updateGridLines();
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
                    this.panelPropertyChange(overlapElementModel, { row: overlapElementModel.row + 1 });
                    ele.setAttribute('data-row', overlapElementModel.row.toString());
                    this.setPanelPosition(ele, overlapElementModel.row, colValue);
                    this.updateCollisionChecked(ele);
                    this.oldRowCol[(ele.id)] = { row: overlapElementModel.row, col: colValue };
                    let panelModel = this.getCellInstance(ele.id);
                    this.panelPropertyChange(panelModel, { col: colValue, row: overlapElementModel.row });
                    let eleRow = parseInt(ele.getAttribute('data-row'), 10);
                    let eleCol = parseInt(ele.getAttribute('data-col'), 10);
                    let sizeX = parseInt(ele.getAttribute('data-sizeX'), 10);
                    let sizeY = parseInt(ele.getAttribute('data-sizeY'), 10);
                    let excludeElements = [];
                    excludeElements.push(ele);
                    excludeElements.push(srcEle);
                    collisionModels = this.collisions(eleRow, eleCol, sizeX, sizeY, excludeElements);
                    if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                        collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                    }
                    this.collisionPanel(collisionModels, eleCol, eleRow, ele);
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
                collisionModels = this.collisions(updatedRow, collisionCol, collisionX, collisionY, excludeEle);
                if (this.mainElement && collisionModels.indexOf(this.mainElement) !== -1) {
                    collisionModels.splice(collisionModels.indexOf(this.mainElement), 1);
                }
                colValue = parseInt(this.overlapElementClone[i].getAttribute('data-col'), 10);
                this.setPanelPosition(this.overlapElementClone[i], updatedRow, colValue);
                this.updateCollisionChecked(this.overlapElementClone[i]);
                this.oldRowCol[(this.overlapElementClone[i].id)] = { row: updatedRow, col: colValue };
                let panelModel = this.getCellInstance(this.overlapElementClone[i].id);
                this.panelPropertyChange(panelModel, { col: colValue, row: updatedRow });
                this.collisionPanel(collisionModels, colValue, updatedRow, this.overlapElementClone[i]);
            }
        }
    }
    collisionPanel(collisionModels, colValue, updatedRow, clone) {
        let panelModel = this.getCellInstance(clone.id);
        this.panelPropertyChange(panelModel, { row: updatedRow, col: colValue });
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
                    collisionModels1 = this.collisions(rowVal, colValue, sizeX, sizeY, this.overlapSubElementClone);
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
                this.mediaQuery ? !(this.checkMediaQuery()) : false) {
                this.setResizingClass(element, containerEle);
            }
        }
    }
    setResizingClass(ele, container) {
        this.availableClasses = this.resizableHandles;
        for (let j = 0; j < this.availableClasses.length; j++) {
            let spanEle = this.createElement('span');
            let addClassValue;
            container.appendChild(spanEle);
            if (this.availableClasses[j] === 'e-east' || this.availableClasses[j] === 'e-west' ||
                this.availableClasses[j] === 'e-north' || this.availableClasses[j] === 'e-south') {
                addClassValue = single;
            }
            else {
                addClassValue = double;
            }
            addClass([spanEle], [addClassValue, this.availableClasses[j], resize]);
        }
    }
    setXYAttributes(element, panelModel) {
        let value = {
            value: {
                sizeX: panelModel.sizeX.toString(),
                sizeY: panelModel.sizeY.toString(),
                minSizeX: panelModel.minSizeX.toString(),
                minSizeY: panelModel.minSizeY.toString(),
                maxSizeX: !isNullOrUndefined(panelModel.maxSizeX) ? panelModel.maxSizeX.toString() : undefined,
                maxSizeY: !isNullOrUndefined(panelModel.maxSizeY) ? panelModel.maxSizeY.toString() : undefined,
                row: panelModel.row.toString(),
                col: panelModel.col.toString(),
            }
        };
        this.setAttributes(value, element);
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
                    preventDefault: false,
                    clone: false,
                    dragArea: this.element,
                    isDragScroll: true,
                    handle: this.draggableHandle ? this.draggableHandle : '.e-panel',
                    abort: '.e-resize',
                    dragStart: this.onDraggingStart.bind(this),
                    dragStop: (args) => {
                        let model = this.getCellInstance(this.mainElement.id);
                        if (this.allowPushing &&
                            this.collisions(model.row, model.col, model.sizeX, model.sizeY, this.mainElement).length > 0) {
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
                            this.collisions(row, col, panelModel.sizeX, panelModel.sizeY, document.getElementById(item.id)).length === 0) {
                            this.panelPropertyChange(this.getCellInstance(args.element.id), { row: row, col: col });
                            this.oldRowCol[args.element.id].row = row;
                            this.oldRowCol[args.element.id].col = col;
                            this.setAttributes({ value: { col: col.toString(), row: row.toString() } }, args.element);
                            this.sortedPanel();
                        }
                        else {
                            this.panelPropertyChange(this.getCellInstance(args.element.id), {
                                row: this.oldRowCol[args.element.id].row,
                                col: this.oldRowCol[args.element.id].col
                            });
                            args.element.setAttribute('data-col', this.getCellInstance(args.element.id).col.toString());
                            args.element.setAttribute('data-row', this.getCellInstance(args.element.id).row.toString());
                            this.sortedPanel();
                        }
                        let panelInstance = this.getCellInstance(args.element.id);
                        this.setPanelPosition(args.element, panelInstance.row, panelInstance.col);
                        this.updatePanels();
                        this.updateCloneArrayObject();
                        for (let i = 0; i < this.panels.length; i++) {
                            if (this.panels[i].row !== this.panelsInitialModel[i].row ||
                                this.panels[i].col !== this.panelsInitialModel[i].col) {
                                changedPanels.push(this.panels[i]);
                            }
                        }
                        if (changedPanels.length > 0) {
                            let changedArgs = { changedPanels: changedPanels };
                            this.trigger('change', changedArgs);
                        }
                        this.dragStopEventArgs = { event: args.event, element: args.element };
                        this.trigger('dragStop', args);
                        this.resizeEvents();
                        this.rows = this.maxRow(true);
                        this.setHeightWidth();
                        this.updateDragArea();
                        this.allowServerDataBinding = true;
                        this.serverDataBind();
                    },
                    drag: (args) => {
                        this.draggedEventArgs = {
                            event: args.event,
                            element: args.element,
                            target: closest((args.target), '.e-panel')
                        };
                        this.trigger('drag', this.draggedEventArgs);
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
    updatePanels() {
        this.moveItemsUpwards();
        this.updateOldRowColumn();
        this.sortedPanel();
    }
    updateDragArea() {
        this.dragCollection.forEach((dragobj) => {
            // tslint:disable-next-line
            dragobj.setDragArea();
        });
    }
    updateRowsHeight(row, sizeY, addRows) {
        if (row + sizeY >= this.rows) {
            this.rows = this.rows + addRows;
            this.setHeightWidth();
        }
    }
    onDraggingStart(args) {
        let dragArgs = args;
        this.trigger('dragStart', dragArgs, (dragArgs) => {
            if (isBlazor()) {
                dragArgs.bindEvents(args.element);
            }
        });
        this.panelsInitialModel = this.cloneModels(this.panels);
        this.mainElement = args.element;
        this.cloneObject = JSON.parse(JSON.stringify(this.cloneObject));
        let eleRowValue = this.startRow = parseInt(args.element.getAttribute('data-row'), 10);
        this.startCol = parseInt(args.element.getAttribute('data-col'), 10);
        let eleSizeY = parseInt(args.element.getAttribute('data-sizeY'), 10);
        this.updateRowsHeight(eleRowValue, eleSizeY, eleSizeY);
        this.updateDragArea();
        this.shadowEle = document.createElement('div');
        this.shadowEle.classList.add('e-holder');
        this.shadowEle.classList.add('e-holder-transition');
        setStyleAttribute(this.shadowEle, { 'position': 'absolute' });
        addClass([this.element], [preventSelect]);
        addClass([args.element], [dragging]);
        this.element.appendChild(this.shadowEle);
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
        if (col < 0 || row < 0) {
            return;
        }
        this.panelPropertyChange(this.getCellInstance(args.element.id), { row: row, col: col });
        let panelModel = this.getCellInstance(args.element.id);
        this.updateRowsHeight(panelModel.row, panelModel.sizeY, 1);
        this.updateDragArea();
        if (this.allowPushing) {
            this.setAttributes({ value: { col: col.toString(), row: row.toString() } }, args.element);
            this.panelPropertyChange(this.getCellInstance(args.element.id), { row: row, col: col });
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
                    this.checkCollision = this.collisions(model.row, model.col, model.sizeX, model.sizeY, args.element);
                    if (panelModel.col >= this.checkColumnValue) {
                        this.checkCollision = [];
                    }
                    this.updatePanelLayout(args.element, panelModel);
                    this.moveItemsUpwards();
                }
            }
        }
        if (this.allowPushing !== false) {
            this.panelPropertyChange(this.getCellInstance(args.element.id), { row: row, col: col });
        }
        if (this.oldRowCol[args.element.id].row !== row || this.oldRowCol[args.element.id].col !== col) {
            this.panelPropertyChange(this.getCellInstance(args.element.id), { row: row, col: col });
            this.setAttributes({ value: { col: col.toString(), row: row.toString() } }, args.element);
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
     * @param {panel: [`PanelModel`](./panelModel)} panel -  Defines the panel element.
     * @returns void
     * @deprecated
     */
    addPanel(panel) {
        this.allowServerDataBinding = false;
        this.maxCol();
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
        // tslint:disable-next-line
        let panelProp = new Panel(this, 'panels', panel, true);
        this.panels.push(panelProp);
        this.setMinMaxValues(panelProp);
        if (this.maxColumnValue < panelProp.col || this.maxColumnValue < (panelProp.col + panelProp.sizeX)) {
            this.panelPropertyChange(panelProp, { col: this.maxColumnValue - panelProp.sizeX });
        }
        let cell = this.renderCell(panelProp, true, null);
        this.oldRowCol[panelProp.id] = { row: panelProp.row, col: panelProp.col };
        this.cloneObject[panelProp.id] = { row: panelProp.row, col: panelProp.col };
        this.updateOldRowColumn();
        this.element.insertAdjacentElement('afterbegin', cell);
        let container = cell.querySelector('.e-panel-container');
        if (this.checkMediaQuery()) {
            this.checkMediaQuerySizing();
            this.removeResizeClasses(this.panelCollection);
        }
        else {
            this.addPanelCalled = true;
            this.mainElement = cell;
            if (!this.checkCollision) {
                this.checkCollision = [];
            }
            this.setPanelPosition(cell, panelProp.row, panelProp.col);
            if (this.isBlazor) {
                cell.style.removeProperty('visibility');
            }
            this.updatePanelLayout(cell, panelProp);
            this.addPanelCalled = false;
        }
        if (this.allowResizing &&
            this.mediaQuery ? !(this.checkMediaQuery()) : false) {
            this.setResizingClass(cell, container);
        }
        if (this.allowDragging &&
            this.mediaQuery ? !(this.checkMediaQuery()) : false) {
            this.enableDraggingContent([document.getElementById(panelProp.id)]);
        }
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.updateOldRowColumn();
        this.sortedPanel();
        this.updateCloneArrayObject();
        if (this.allowResizing) {
            for (let i = 0; i < cell.querySelectorAll('.e-resize').length; i++) {
                let eventName = (Browser.info.name === 'msie') ? 'mousedown pointerdown' : 'mousedown';
                EventHandler.add(cell.querySelectorAll('.e-resize')[i], eventName, this.downResizeHandler, this);
                if (Browser.info.name !== 'msie') {
                    EventHandler.add(cell.querySelectorAll('.e-resize')[i], 'touchstart', this.touchDownResizeHandler, this);
                }
            }
        }
        this.allowServerDataBinding = true;
        this.serverDataBind();
    }
    /**
     * Allows to update a panel in the DashboardLayout.
     * @param {panel: [`panelModel`](./panelModel)} panel - Defines the panel element.
     * @returns void
     * @deprecated
     */
    updatePanel(panel) {
        if (!panel.id) {
            return;
        }
        let panelInstance = this.getCellInstance(panel.id);
        if (!panelInstance) {
            return;
        }
        this.maxCol();
        panel.col = (panel.col < 1) ? 0 : ((panel.col > this.columns)) ? this.columns - 1 : panel.col;
        if (isNullOrUndefined(panel.col)) {
            panel.col = panelInstance.col;
        }
        this.panelPropertyChange(panelInstance, panel);
        this.setMinMaxValues(panelInstance);
        let cell = document.getElementById(panel.id);
        this.mainElement = cell;
        this.panelContent = cell.querySelector('.e-panel-container') ?
            cell.querySelector('.e-panel-container') :
            this.createSubElement(panelInstance.cssClass, cell.id + '_content', panelContainer);
        cell.appendChild(this.panelContent);
        if (panelInstance.header) {
            let headerTemplateElement = cell.querySelector('.e-panel-header') ?
                cell.querySelector('.e-panel-header') : this.createSubElement('', cell.id + 'template', '');
            addClass([headerTemplateElement], [header]);
            headerTemplateElement.innerHTML = '';
            let id = this.element.id + 'HeaderTemplate' + panelInstance.id;
            this.renderTemplate(panelInstance.header, headerTemplateElement, id, true);
            this.panelContent.appendChild(headerTemplateElement);
        }
        else {
            if (cell.querySelector('.e-panel-header')) {
                detach(cell.querySelector('.e-panel-header'));
            }
        }
        if (panelInstance.content) {
            this.panelBody = cell.querySelector('.e-panel-content') ? cell.querySelector('.e-panel-content') :
                this.createSubElement(panelInstance.cssClass, cell.id + '_body', panelContent);
            this.panelBody.innerHTML = '';
            let headerHeight = this.panelContent.querySelector('.e-panel-header') ?
                window.getComputedStyle(this.panelContent.querySelector('.e-panel-header')).height : '0px';
            let contentHeightValue = 'calc( 100% - ' + headerHeight + ')';
            setStyleAttribute(this.panelBody, { height: contentHeightValue });
            let id = this.element.id + 'ContentTemplate' + panelInstance.id;
            this.renderTemplate(panelInstance.content, this.panelBody, id, true);
            this.panelContent.appendChild(this.panelBody);
        }
        else {
            if (cell.querySelector('.e-panel-content')) {
                detach(cell.querySelector('.e-panel-content'));
            }
        }
        this.setXYAttributes(cell, panelInstance);
        this.setHeightAndWidth(cell, panelInstance);
        this.setPanelPosition(cell, panelInstance.row, panelInstance.col);
        this.updatePanelLayout(cell, panelInstance);
        this.mainElement = null;
        this.updatePanels();
        this.updateCloneArrayObject();
    }
    updateCloneArrayObject() {
        this.cloneArray = this.sortedArray;
        this.cloneObject = JSON.parse(JSON.stringify(this.oldRowCol));
    }
    /**
     * Returns the panels object of the DashboardLayout.
     * @returns [`PanelModel[]`](./panelModel)
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
        this.removeAllPanel();
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
        this.setProperties({ panels: [] }, true);
        this.updatePanels();
        this.updateCloneArrayObject();
    }
    /**
     * Removes the panel from the DashboardLayout.
     * @param {id: string} id -  Defines the panel ID.
     * @returns void
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
        this.updatePanels();
        this.gridPanelCollection.forEach((item) => {
            if (item.id === id) {
                this.gridPanelCollection.splice(this.gridPanelCollection.indexOf(item), 1);
            }
        });
        this.updateCloneArrayObject();
    }
    /**
     * Moves the panel in the DashboardLayout.
     * @param {id: string} id - Defines the panel ID.
     * @param {row: number} row - Defines the row of dashboard layout.
     * @param {col: number} col - Defines the column of dashboard layout.
     * @returns void
     */
    movePanel(id, row, col) {
        this.movePanelCalled = true;
        let panelInstance = this.getCellInstance(id);
        if (col < 0) {
            col = 0;
        }
        else if (col > this.columns) {
            col = this.columns - panelInstance.sizeX;
        }
        this.panelPropertyChange(panelInstance, { row: row, col: col });
        let ele = document.getElementById(id);
        this.mainElement = ele;
        this.startRow = parseInt(ele.getAttribute('data-row'), 10);
        this.startCol = parseInt(ele.getAttribute('data-col'), 10);
        this.setAttributes({ value: { col: col.toString(), row: row.toString() } }, ele);
        this.updateOldRowColumn();
        this.setPanelPosition(ele, row, col);
        this.updatePanelLayout(ele, panelInstance);
        this.updateRowHeight();
        this.updatePanels();
        this.updateCloneArrayObject();
        this.mainElement = null;
        if (this.allowFloating) {
            this.moveItemsUpwards();
        }
        this.movePanelCalled = false;
    }
    setAttributes(value, ele) {
        for (let i = 0; i < Object.keys(value).length; i++) {
            if (Object.keys(value)) {
                if (value[Object.keys(value)[i]].col) {
                    ele.setAttribute('data-col', value[Object.keys(value)[i]].col.toString());
                }
                if (value[Object.keys(value)[i]].row) {
                    ele.setAttribute('data-row', value[Object.keys(value)[i]].row.toString());
                }
                if (value[Object.keys(value)[i]].sizeX) {
                    ele.setAttribute('data-sizeX', value[Object.keys(value)[i]].sizeX.toString());
                }
                if (value[Object.keys(value)[i]].sizeY) {
                    ele.setAttribute('data-sizeY', value[Object.keys(value)[i]].sizeY.toString());
                }
                if (value[Object.keys(value)[i]].minSizeX) {
                    ele.setAttribute('data-minSizeX', value[Object.keys(value)[i]].minSizeX.toString());
                }
                if (value[Object.keys(value)[i]].minSizeY) {
                    ele.setAttribute('data-minSizeY', value[Object.keys(value)[i]].minSizeY.toString());
                }
                if (value[Object.keys(value)[i]].maxSizeX) {
                    ele.setAttribute('data-maxSizeY', value[Object.keys(value)[i]].maxSizeX.toString());
                }
                if (value[Object.keys(value)[i]].maxSizeY) {
                    ele.setAttribute('data-maxSizeY', value[Object.keys(value)[i]].maxSizeY.toString());
                }
            }
        }
    }
    /**
     * Resize the panel in the DashboardLayout.
     * @param {id: string} id - Defines the panel ID.
     * @param {sizeX: number} sizeX - Defines the sizeX of dashboard layout.
     * @param {sizeY: number} sizeY - Defines the sizeY of dashboard layout.
     */
    resizePanel(id, sizeX, sizeY) {
        let panelInstance = this.getCellInstance(id);
        this.resizeCalled = true;
        this.panelPropertyChange(panelInstance, { sizeX: sizeX, sizeY: sizeY });
        this.setMinMaxValues(panelInstance);
        this.checkMinMaxValues(panelInstance);
        let ele = document.getElementById(id);
        this.mainElement = ele;
        this.setAttributes({ value: { sizeX: panelInstance.sizeX.toString(), sizeY: panelInstance.sizeY.toString() } }, ele);
        this.setHeightAndWidth(ele, panelInstance);
        this.updatePanelLayout(ele, panelInstance);
        this.updatePanels();
        this.updateRowHeight();
        this.resizeCalled = false;
    }
    /**
     * Destroys the DashboardLayout component
     * @returns void
     */
    destroy() {
        removeClass([this.element], ['e-dashboardlayout', 'e-lib', 'e-responsive', 'e-control']);
        this.element.removeAttribute('style');
        for (let i = 0; i < this.dragCollection.length; i++) {
            this.dragCollection[i].destroy();
        }
        this.removeAllPanel();
        super.destroy();
    }
    removeAllPanel() {
        while (this.element.firstElementChild) {
            detach(this.element.firstElementChild);
        }
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
    updatePanelsDynamically(panels) {
        this.removeAll();
        this.setProperties({ panels: panels }, true);
        this.setOldRowCol();
        if (this.table) {
            this.table.remove();
        }
        this.isBlazor = false;
        this.initialize();
        this.isBlazor = (isBlazor() && this.isServerRendered);
        if (this.showGridLines) {
            this.initGridLines();
        }
    }
    checkForIDValues(panels) {
        if (!isNullOrUndefined(panels)) {
            this.panelID = 0;
            panels.forEach((panel) => {
                if (!panel.id) {
                    this.panelPropertyChange(panel, { id: 'layout_' + this.panelID.toString() });
                    this.panelID = this.panelID + 1;
                }
            });
        }
    }
    /**
     * Called internally if any of the property value changed.
     * returns void
     * @private
     */
    onPropertyChanged(newProp, oldProp) {
        if (newProp.panels) {
            this.checkForIDValues(newProp.panels);
        }
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'enableRtl':
                    this.setProperties({ enableRtl: newProp.enableRtl }, true);
                    this.setEnableRtl();
                    break;
                case 'mediaQuery':
                    this.setProperties({ mediaQuery: newProp.mediaQuery }, true);
                    if (this.checkMediaQuery()) {
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
                        let panelElements = this.element.querySelectorAll('.e-panel .e-panel-container .e-resize');
                        for (let i = 0; i < panelElements.length; i++) {
                            let eventName = (Browser.info.name === 'msie') ? 'mousedown pointerdown' : 'mousedown';
                            let element = panelElements[i];
                            EventHandler.remove(element, eventName, this.downResizeHandler);
                            if (Browser.info.name !== 'msie') {
                                EventHandler.remove(element, 'touchstart', this.touchDownResizeHandler);
                            }
                        }
                        this.removeResizeClasses(this.panelCollection);
                    }
                    break;
                case 'cellSpacing':
                    this.setProperties({ cellSpacing: newProp.cellSpacing }, true);
                    this.updateCellSizeAndSpacing();
                    this.updateGridLines();
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
                case 'showGridLines':
                    if (this.showGridLines) {
                        this.setProperties({ showGridLines: newProp.showGridLines }, true);
                        this.initGridLines();
                    }
                    else {
                        if (this.table) {
                            detach(this.table);
                        }
                    }
                    break;
                case 'allowPushing':
                    this.setProperties({ allowPushing: newProp.allowPushing }, true);
                    break;
                case 'panels':
                    if (!newProp.columns) {
                        this.isRenderComplete = false;
                        this.updatePanelsDynamically(newProp.panels);
                        this.isRenderComplete = true;
                    }
                    break;
                case 'columns':
                    this.isRenderComplete = false;
                    if (newProp.panels) {
                        this.updatePanelsDynamically(newProp.panels);
                    }
                    this.setProperties({ columns: newProp.columns }, true);
                    this.panelCollection = [];
                    this.maxColumnValue = this.columns;
                    this.calculateCellSize();
                    this.panels.forEach((panel) => {
                        this.setMinMaxValues(panel);
                        if (this.maxColumnValue < panel.col || this.maxColumnValue < (panel.col + panel.sizeX)) {
                            let colValue = this.maxColumnValue - panel.sizeX;
                            this.panelPropertyChange(panel, { col: colValue < 0 ? 0 : colValue });
                            this.setXYAttributes(document.getElementById(panel.id), panel);
                        }
                        this.setHeightAndWidth(document.getElementById(panel.id), panel);
                        this.panelCollection.push(document.getElementById(panel.id));
                        this.setPanelPosition(document.getElementById(panel.id), panel.row, panel.col);
                        this.mainElement = document.getElementById(panel.id);
                        this.updatePanelLayout(document.getElementById(panel.id), panel);
                        this.mainElement = null;
                    });
                    this.updatePanels();
                    this.updateCloneArrayObject();
                    this.isRenderComplete = true;
                    this.updateGridLines();
                    break;
            }
        }
    }
    /**
     * Gets the properties to be maintained upon browser refresh.
     * @returns string
     * @private
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
], DashboardLayout.prototype, "enableHtmlSanitizer", void 0);
__decorate$1([
    Property(true)
], DashboardLayout.prototype, "allowFloating", void 0);
__decorate$1([
    Property(1)
], DashboardLayout.prototype, "cellAspectRatio", void 0);
__decorate$1([
    Property([5, 5])
], DashboardLayout.prototype, "cellSpacing", void 0);
__decorate$1([
    Property(1)
], DashboardLayout.prototype, "columns", void 0);
__decorate$1([
    Property(false)
], DashboardLayout.prototype, "showGridLines", void 0);
__decorate$1([
    Property(null)
], DashboardLayout.prototype, "draggableHandle", void 0);
__decorate$1([
    Property('en-US')
], DashboardLayout.prototype, "locale", void 0);
__decorate$1([
    Property('max-width: 600px')
], DashboardLayout.prototype, "mediaQuery", void 0);
__decorate$1([
    Collection([], Panel)
], DashboardLayout.prototype, "panels", void 0);
__decorate$1([
    Property(['e-south-east'])
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
__decorate$1([
    Event()
], DashboardLayout.prototype, "created", void 0);
__decorate$1([
    Event()
], DashboardLayout.prototype, "destroyed", void 0);
DashboardLayout = __decorate$1([
    NotifyPropertyChanges
], DashboardLayout);

/**
 * dashboardlayout modules
 */

/**
 *     Layout all modules
 */

export { PaneProperties, Splitter, Panel, DashboardLayout };
//# sourceMappingURL=ej2-layouts.es2015.js.map
