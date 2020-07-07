window.sf = window.sf || {};
var sfsplitter = (function (exports) {
'use strict';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ROOT = 'e-splitter';
var HORIZONTAL_PANE = 'e-splitter-horizontal';
var VERTICAL_PANE = 'e-splitter-vertical';
var PANE = 'e-pane';
var SPLIT_H_PANE = 'e-pane-horizontal';
var SPLIT_V_PANE = 'e-pane-vertical';
var SPLIT_BAR = 'e-split-bar';
var SPLIT_H_BAR = 'e-split-bar-horizontal';
var SPLIT_V_BAR = 'e-split-bar-vertical';
var STATIC_PANE = 'e-static-pane';
var SCROLL_PANE = 'e-scrollable';
var RESIZE_BAR = 'e-resize-handler';
var RESIZABLE_BAR = 'e-resizable-split-bar';
var SPLIT_BAR_HOVER = 'e-split-bar-hover';
var SPLIT_BAR_ACTIVE = 'e-split-bar-active';
var HIDE_HANDLER = 'e-hide-handler';
var SPLIT_TOUCH = 'e-splitter-touch';
var DISABLED = 'e-disabled';
var RTL = 'e-rtl';
var E_ICONS = 'e-icons';
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
var BAR_SIZE_DEFAULT = 1;
/**
 * Interface to configure pane properties such as its content, size, min, max, resizable, collapsed and collapsible.
 */
var PaneProperties = /** @class */ (function (_super) {
    __extends(PaneProperties, _super);
    function PaneProperties() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        sf.base.Property()
    ], PaneProperties.prototype, "size", void 0);
    __decorate([
        sf.base.Property(false)
    ], PaneProperties.prototype, "collapsible", void 0);
    __decorate([
        sf.base.Property(false)
    ], PaneProperties.prototype, "collapsed", void 0);
    __decorate([
        sf.base.Property(true)
    ], PaneProperties.prototype, "resizable", void 0);
    __decorate([
        sf.base.Property(null)
    ], PaneProperties.prototype, "min", void 0);
    __decorate([
        sf.base.Property(null)
    ], PaneProperties.prototype, "max", void 0);
    __decorate([
        sf.base.Property()
    ], PaneProperties.prototype, "content", void 0);
    __decorate([
        sf.base.Property('')
    ], PaneProperties.prototype, "cssClass", void 0);
    return PaneProperties;
}(sf.base.ChildProperty));
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
var Splitter = /** @class */ (function (_super) {
    __extends(Splitter, _super);
    /**
     * Initializes a new instance of the Splitter class.
     * @param options  - Specifies Splitter model properties as options.
     * @param element  - Specifies the element that is rendered as an Splitter.
     */
    function Splitter(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.allPanes = [];
        _this.paneOrder = [];
        _this.separatorOrder = [];
        _this.allBars = [];
        _this.previousCoordinates = {};
        _this.currentCoordinates = {};
        _this.updatePrePaneInPercentage = false;
        _this.updateNextPaneInPercentage = false;
        _this.panesDimensions = [];
        _this.border = 0;
        _this.validDataAttributes = ['data-size', 'data-min', 'data-max', 'data-collapsible', 'data-resizable', 'data-content', 'data-collapsed'];
        _this.validElementAttributes = ['data-orientation', 'data-width', 'data-height'];
        _this.iconsDelay = 300;
        _this.templateElement = [];
        _this.collapseFlag = false;
        _this.expandFlag = true;
        return _this;
    }
    /**
     * Gets called when the model property changes.The data that describes the old and new values of the property that changed.
     * @param  {SplitterModel} newProp
     * @param  {SplitterModel} oldProp
     * @returns void
     * @private
     */
    Splitter.prototype.onPropertyChanged = function (newProp, oldProp) {
        if (!this.element.classList.contains(ROOT)) {
            return;
        }
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
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
                        var paneCounts = Object.keys(newProp.paneSettings);
                        for (var i = 0; i < paneCounts.length; i++) {
                            var index = parseInt(Object.keys(newProp.paneSettings)[i], 10);
                            var changedPropsCount = Object.keys(newProp.paneSettings[index]).length;
                            for (var j = 0; j < changedPropsCount; j++) {
                                var property = Object.keys(newProp.paneSettings[index])[j];
                                switch (property) {
                                    case 'content':
                                        var newValue = Object(newProp.paneSettings[index])[property];
                                        if (!sf.base.isNullOrUndefined(newValue)) {
                                            this.allPanes[index].innerHTML = '';
                                            this.setTemplate(newValue, this.allPanes[index]);
                                        }
                                        break;
                                    case 'resizable':
                                        var newVal = Object(newProp.paneSettings[index])[property];
                                        this.resizableModel(index, newVal);
                                        break;
                                    case 'collapsible':
                                        this.collapsibleModelUpdate(index);
                                        break;
                                    case 'collapsed':
                                        newProp.paneSettings[index].collapsed ? this.isCollapsed(index) : this.collapsedOnchange(index);
                                        break;
                                    case 'cssClass':
                                        this.setCssClass(this.allPanes[index], newProp.paneSettings[index].cssClass);
                                        break;
                                    case 'size':
                                        var newValSize = Object(newProp.paneSettings[index])[property];
                                        if (newValSize !== '' && !sf.base.isNullOrUndefined(newValSize)) {
                                            this.updatePaneSize(newValSize, index);
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
    };
    Splitter.prototype.updatePaneSize = function (newValSize, index) {
        this.allPanes[index].style.flexBasis = newValSize;
        var flexPaneIndexes = [];
        var staticPaneWidth;
        var flexCount = 0;
        for (var i = 0; i < this.allPanes.length; i++) {
            if (!this.paneSettings[i].size && !(this.allPanes[i].innerText === '')) {
                flexPaneIndexes[flexCount] = i;
                flexCount++;
            }
            else if (this.paneSettings[i].size) {
                staticPaneWidth = this.orientation === 'Horizontal' ? this.allPanes[index].offsetWidth : this.allPanes[index].offsetHeight;
            }
        }
        staticPaneWidth = this.orientation === 'Horizontal' ? (this.allBars[0].offsetWidth * this.allBars.length) + staticPaneWidth :
            (this.allBars[0].offsetHeight * this.allBars.length) + staticPaneWidth;
        var flexPaneWidth = (this.orientation === 'Horizontal' ? this.element.offsetWidth : this.element.offsetHeight)
            - staticPaneWidth - (this.border * 2);
        var avgDiffWidth = flexPaneWidth / flexPaneIndexes.length;
        for (var j = 0; j < flexPaneIndexes.length; j++) {
            this.allPanes[flexPaneIndexes[j]].style.flexBasis = avgDiffWidth + 'px';
        }
        this.allPanes[index].classList.add(STATIC_PANE);
    };
    Splitter.prototype.preRender = function () {
        this.wrapper = this.element.cloneNode(true);
        this.wrapperParent = this.element.parentElement;
        if (!this.checkBlazor()) {
            sf.base.removeClass([this.wrapper], ['e-control', 'e-lib', ROOT]);
            var orientation_1 = this.orientation === 'Horizontal' ? HORIZONTAL_PANE : VERTICAL_PANE;
            sf.base.addClass([this.element], orientation_1);
        }
        var name = sf.base.Browser.info.name;
        var css = (name === 'msie') ? 'e-ie' : '';
        this.setCssClass(this.element, css);
        if (sf.base.Browser.isDevice) {
            sf.base.addClass([this.element], SPLIT_TOUCH);
        }
    };
    Splitter.prototype.getPersistData = function () {
        return this.addOnPersist([]);
    };
    /**
     * Returns the current module name.
     * @returns string
     * @private
     */
    Splitter.prototype.getModuleName = function () {
        return 'splitter';
    };
    /**
     * To Initialize the control rendering
     * @private
     */
    Splitter.prototype.render = function () {
        if (!this.checkBlazor()) {
            this.checkDataAttributes();
            this.setCssClass(this.element, this.cssClass);
            this.isEnabled(this.enabled);
            this.setDimension(this.getHeight(this.element), this.getWidth(this.element));
        }
        this.createSplitPane(this.element);
        this.addSeparator(this.element);
        this.getPanesDimensions();
        this.setPaneSettings();
        if (!this.checkBlazor()) {
            this.setRTL(this.enableRtl);
        }
        this.collapseFlag = true;
        this.isCollapsed();
        this.collapseFlag = false;
        sf.base.EventHandler.add(document, 'touchstart click', this.onDocumentClick, this);
        this.renderComplete();
        window.addEventListener('resize', this.reportWindowSize.bind(this), true);
        sf.base.EventHandler.add(this.element, 'keydown', this.onMove, this);
    };
    Splitter.prototype.onDocumentClick = function (e) {
        if (!e.target.classList.contains(SPLIT_BAR) && !sf.base.isNullOrUndefined(this.currentSeparator)) {
            this.currentSeparator.classList.remove(SPLIT_BAR_HOVER);
            this.currentSeparator.classList.remove(SPLIT_BAR_ACTIVE);
        }
    };
    Splitter.prototype.checkPaneSize = function (e) {
        var prePaneSize;
        var nextPaneSize;
        var splitBarSize = sf.base.isNullOrUndefined(this.separatorSize) ? BAR_SIZE_DEFAULT : this.separatorSize;
        prePaneSize = this.orientation === 'Horizontal' ? this.previousPane.offsetWidth : this.previousPane.offsetHeight;
        nextPaneSize = this.orientation === 'Horizontal' ? this.nextPane.offsetWidth : this.nextPane.offsetHeight;
        if ((this.previousPane.style.flexBasis.indexOf('%') > 0 || this.nextPane.style.flexBasis.indexOf('%') > 0)) {
            var previousFlexBasis = this.updatePaneFlexBasis(this.previousPane);
            var nextFlexBasis = this.updatePaneFlexBasis(this.nextPane);
            this.totalPercent = previousFlexBasis + nextFlexBasis;
            this.totalWidth = this.convertPercentageToPixel(this.totalPercent + '%');
            if (e.type === 'keydown' && (!sf.base.isNullOrUndefined(e.keyCode))) {
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
            if (e.type === 'keydown' && (!sf.base.isNullOrUndefined(e.keyCode))) {
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
    };
    Splitter.prototype.onMove = function (event) {
        if (this.allPanes.length > 1) {
            var index = this.getSeparatorIndex(this.currentSeparator);
            var isPrevpaneCollapsed = this.previousPane.classList.contains(COLLAPSE_PANE);
            var isPrevpaneExpanded = this.previousPane.classList.contains(EXPAND_PANE);
            var isNextpaneCollapsed = this.nextPane.classList.contains(COLLAPSE_PANE);
            if (((this.orientation !== 'Horizontal' && event.keyCode === 38) || (this.orientation === 'Horizontal' &&
                event.keyCode === 39) ||
                (this.orientation === 'Horizontal' && event.keyCode === 37) || (this.orientation !== 'Horizontal' && event.keyCode === 40))
                && (!isPrevpaneExpanded && !isNextpaneCollapsed && !isPrevpaneCollapsed || (isPrevpaneExpanded) && !isNextpaneCollapsed) &&
                document.activeElement.classList.contains(SPLIT_BAR) && (this.paneSettings[index].resizable &&
                this.paneSettings[index + 1].resizable)) {
                this.checkPaneSize(event);
                this.triggerResizing(event);
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
    
    /**
     * @hidden
     */
    Splitter.prototype.sanitizeHelper = function (value) {
        if (this.enableHtmlSanitizer) {
            var item = sf.base.SanitizeHtmlHelper.beforeSanitize();
            var beforeEvent = {
                cancel: false,
                helper: null
            };
            sf.base.extend(item, item, beforeEvent);
            this.trigger('beforeSanitizeHtml', item);
            if (item.cancel && !sf.base.isNullOrUndefined(item.helper)) {
                value = item.helper(value);
            }
            else if (!item.cancel) {
                value = sf.base.SanitizeHtmlHelper.serializeValue(item, value);
            }
        }
        return value;
    };
    Splitter.prototype.checkDataAttributes = function () {
        var api;
        var value;
        // Element values
        for (var dataIndex = 0; dataIndex < this.validElementAttributes.length; dataIndex++) {
            value = this.element.getAttribute(this.validElementAttributes[dataIndex]);
            if (!sf.base.isNullOrUndefined(value)) {
                api = this.removeDataPrefix(this.validElementAttributes[dataIndex]);
                // tslint:disable-next-line
                this[api] = value;
            }
        }
        // Pane values
        for (var paneIndex = 0; paneIndex < this.element.children.length; paneIndex++) {
            for (var dataAttr = 0; dataAttr < this.validDataAttributes.length; dataAttr++) {
                value = this.element.children[paneIndex].getAttribute(this.validDataAttributes[dataAttr]);
                if (!sf.base.isNullOrUndefined(value)) {
                    api = this.removeDataPrefix(this.validDataAttributes[dataAttr]);
                    value = (api === 'collapsible' || api === 'resizable') ? (value === 'true') : value;
                    if (sf.base.isNullOrUndefined(this.paneSettings[paneIndex])) {
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
                    var paneAPI = this.paneSettings[paneIndex][api];
                    if (api === 'resizable' || api === 'collapsible' || api === 'collapsed') {
                        // tslint:disable-next-line
                        this.paneSettings[paneIndex][api] = value;
                    }
                    if (sf.base.isNullOrUndefined(paneAPI) || paneAPI === '') {
                        // tslint:disable-next-line
                        this.paneSettings[paneIndex][api] = value;
                    }
                }
            }
        }
    };
    Splitter.prototype.destroyPaneSettings = function () {
        [].slice.call(this.element.children).forEach(function (el) { sf.base.detach(el); });
        this.restoreElem();
    };
    Splitter.prototype.checkBlazor = function () {
        return sf.base.isBlazor() && this.isServerRendered;
    };
    Splitter.prototype.setPaneSettings = function () {
        var childCount = this.allPanes.length;
        var paneCollection = [];
        var paneValue = {
            size: '',
            min: null,
            max: null,
            content: '',
            resizable: true,
            collapsed: false,
            collapsible: false,
            cssClass: ''
        };
        for (var i = 0; i < childCount; i++) {
            if (sf.base.isNullOrUndefined(this.paneSettings[i])) {
                paneCollection[i] = paneValue;
            }
            else {
                paneCollection[i] = this.paneSettings[i];
            }
        }
        this.setProperties({ 'paneSettings': paneCollection }, true);
    };
    Splitter.prototype.checkArrow = function (paneIndex, targetArrow) {
        return (this.allBars[paneIndex].querySelector('.' + NAVIGATE_ARROW + '.' + targetArrow));
    };
    Splitter.prototype.removeDataPrefix = function (attribute) {
        return attribute.slice(attribute.lastIndexOf('-') + 1);
    };
    Splitter.prototype.setRTL = function (rtl) {
        rtl ? sf.base.addClass([this.element], RTL) : sf.base.removeClass([this.element], RTL);
    };
    Splitter.prototype.setSplitterSize = function (element, size, property) {
        var style = property === 'width' ? { 'width': sf.base.formatUnit(size) } : { 'height': sf.base.formatUnit(size) };
        sf.base.setStyleAttribute(element, style);
    };
    Splitter.prototype.getPanesDimensions = function () {
        for (var index = 0; index < this.allPanes.length; index++) {
            this.orientation === 'Horizontal' ? this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().width) :
                this.panesDimensions.push(this.allPanes[index].getBoundingClientRect().height);
        }
    };
    Splitter.prototype.setCssClass = function (element, className) {
        if (className) {
            sf.base.addClass([element], className.split(className.indexOf(',') > -1 ? ',' : ' '));
        }
    };
    Splitter.prototype.hideResizer = function (target) {
        sf.base.addClass([sf.base.select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
    };
    Splitter.prototype.showResizer = function (target) {
        if (!sf.base.isNullOrUndefined(this.previousPane) && this.previousPane.classList.contains(RESIZABLE_PANE) &&
            !sf.base.isNullOrUndefined(this.nextPane) && this.nextPane.classList.contains(RESIZABLE_PANE)) {
            sf.base.removeClass([sf.base.select('.' + RESIZE_BAR, target)], HIDE_HANDLER);
        }
    };
    Splitter.prototype.resizableModel = function (index, newVal) {
        var paneIndex;
        var i = index;
        paneIndex = (index === (this.allBars.length)) ? (index - 1) : index;
        sf.base.EventHandler.remove(this.allBars[paneIndex], 'mousedown', this.onMouseDown);
        if (newVal) {
            sf.base.EventHandler.add(this.allBars[paneIndex], 'mousedown', this.onMouseDown, this);
            if (this.isResizable()) {
                this.showResizer(this.allBars[paneIndex]);
                sf.base.removeClass([sf.base.select('.' + RESIZE_BAR, this.allBars[paneIndex])], HIDE_HANDLER);
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
    };
    Splitter.prototype.collapsibleModelUpdate = function (index) {
        var arrow2;
        var arrow1;
        var paneIndex;
        paneIndex = index === (this.allBars.length) ? (index - 1) : index;
        arrow2 = (this.orientation === 'Horizontal') ? this.checkArrow(paneIndex, ARROW_LEFT) : this.checkArrow(paneIndex, ARROW_UP);
        arrow1 = (this.orientation === 'Horizontal') ? this.checkArrow(paneIndex, ARROW_RIGHT) : this.checkArrow(paneIndex, ARROW_DOWN);
        this.paneCollapsible(this.allPanes[index], index);
        this.updateCollapseIcons(paneIndex, arrow1, arrow2);
    };
    Splitter.prototype.collapseArrow = function (barIndex, arrow) {
        return sf.base.selectAll('.' + arrow, this.allBars[barIndex])[0];
    };
    Splitter.prototype.updateIsCollapsed = function (index, collapseArrow, lastBarArrow) {
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
    Splitter.prototype.isCollapsed = function (index) {
        var _this = this;
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
            var eventArgs = this.beforeAction(event_1);
            this.trigger('beforeCollapse', eventArgs, function (beforeCollapseArgs) {
                if (!beforeCollapseArgs.cancel) {
                    var collapsedindex = [];
                    collapsedindex[0] = index;
                    var j = 1;
                    for (var i = 0; i < _this.allPanes.length; i++) {
                        if (_this.allPanes[i].classList.contains(COLLAPSE_PANE)) {
                            collapsedindex[j] = i;
                            j++;
                        }
                    }
                    collapsedindex = collapsedindex.sort();
                    _this.updateIsCollapsed(index, _this.targetArrows().collapseArrow, _this.targetArrows().lastBarArrow);
                    for (var i = 0; i < collapsedindex.length; i++) {
                        if (!_this.allPanes[collapsedindex[i]].classList.contains(COLLAPSE_PANE)) {
                            _this.updateIsCollapsed(collapsedindex[i], _this.targetArrows().collapseArrow, _this.targetArrows().lastBarArrow);
                        }
                    }
                    for (var i = collapsedindex.length; i > 0; i--) {
                        if (!_this.allPanes[collapsedindex[i - 1]].classList.contains(COLLAPSE_PANE)) {
                            var targetArrow = _this.targetArrows();
                            _this.updateIsCollapsed(collapsedindex[i - 1], targetArrow.collapseArrow, targetArrow.lastBarArrow);
                        }
                    }
                    var collapseEventArgs = _this.afterAction(event_1);
                    _this.trigger('collapsed', collapseEventArgs);
                    _this.collapseFlag = false;
                }
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
                    var collapseArrow = this.orientation === 'Horizontal' ? ARROW_RIGHT : ARROW_DOWN;
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
    Splitter.prototype.targetArrows = function () {
        this.splitterProperty();
        return { collapseArrow: (this.orientation === 'Horizontal') ? ARROW_LEFT : ARROW_UP,
            lastBarArrow: (this.orientation === 'Vertical') ? ARROW_DOWN : ARROW_RIGHT
        };
    };
    Splitter.prototype.collapsedOnchange = function (index) {
        if (!sf.base.isNullOrUndefined(this.paneSettings[index]) && !sf.base.isNullOrUndefined(this.paneSettings[index].collapsed)
            && this.allPanes[index].classList.contains(COLLAPSE_PANE)) {
            this.updateIsCollapsed(index, this.targetArrows().lastBarArrow, this.targetArrows().collapseArrow);
        }
    };
    Splitter.prototype.isEnabled = function (enabled) {
        enabled ? sf.base.removeClass([this.element], DISABLED) : sf.base.addClass([this.element], DISABLED);
    };
    Splitter.prototype.setSeparatorSize = function (size) {
        var sizeValue = sf.base.isNullOrUndefined(size) ? 'auto' : size + 'px';
        var separator = this.orientation === 'Horizontal' ? SPLIT_H_BAR : SPLIT_V_BAR;
        for (var index = 0; index < this.allBars.length; index++) {
            var splitBar = sf.base.selectAll('.' + separator, this.element)[index];
            var resizeBar = sf.base.selectAll('.' + RESIZE_BAR, splitBar)[0];
            if (this.orientation === 'Horizontal') {
                splitBar.style.width = sizeValue;
                if (!sf.base.isNullOrUndefined(resizeBar)) {
                    resizeBar.style.width = sizeValue;
                }
            }
            else {
                splitBar.style.height = sizeValue;
                if (!sf.base.isNullOrUndefined(resizeBar)) {
                    resizeBar.style.height = sizeValue;
                }
            }
        }
    };
    Splitter.prototype.changeOrientation = function (orientation) {
        var isVertical = orientation === 'Vertical';
        this.element.classList.remove(isVertical ? HORIZONTAL_PANE : VERTICAL_PANE);
        this.element.classList.add(isVertical ? VERTICAL_PANE : HORIZONTAL_PANE);
        for (var index = 0; index < this.allPanes.length; index++) {
            this.allPanes[index].classList.remove(isVertical ? SPLIT_H_PANE : SPLIT_V_PANE);
            this.allPanes[index].classList.add(isVertical ? SPLIT_V_PANE : SPLIT_H_PANE);
        }
        for (var index = 0; index < this.allBars.length; index++) {
            sf.base.detach(this.allBars[index]);
        }
        this.allBars = [];
        this.addSeparator(this.element);
    };
    Splitter.prototype.checkSplitPane = function (currentBar, elementIndex) {
        var paneEle = this.collectPanes(currentBar.parentElement.children)[elementIndex];
        return paneEle;
    };
    Splitter.prototype.collectPanes = function (childNodes) {
        var elements = [];
        for (var i = 0; i < childNodes.length; i++) {
            if (childNodes[i].classList.contains(PANE)) {
                elements.push(childNodes[i]);
            }
        }
        return elements;
    };
    Splitter.prototype.getPrevPane = function (currentBar, order) {
        return this.checkSplitPane(currentBar, ((order - 1) / (2)));
    };
    Splitter.prototype.getNextPane = function (currentBar, order) {
        return this.checkSplitPane(currentBar, (((order - 1) / 2) + 1));
    };
    Splitter.prototype.updateSeparatorSize = function (resizeHanlder) {
        var sizeValue = sf.base.isNullOrUndefined(this.separatorSize) ? '1px' : this.separatorSize + 'px';
        this.orientation === 'Horizontal' ? (resizeHanlder.style.width = sizeValue) : resizeHanlder.style.height = sizeValue;
    };
    Splitter.prototype.addResizeHandler = function (currentBar) {
        var resizeHanlder = this.createElement('div');
        sf.base.addClass([resizeHanlder], [RESIZE_BAR, E_ICONS]);
        this.updateSeparatorSize(resizeHanlder);
        currentBar.appendChild(resizeHanlder);
    };
    Splitter.prototype.getHeight = function (target) {
        var height = this.height;
        height = target.style.height !== '' && this.height === '100%' ? target.style.height : this.height;
        return height;
    };
    Splitter.prototype.getWidth = function (target) {
        var width = this.width;
        width = target.style.width !== '' && this.width === '100%' ? target.style.width : this.width;
        return width;
    };
    Splitter.prototype.setDimension = function (height, width) {
        sf.base.setStyleAttribute(this.element, { 'height': height, 'width': width });
    };
    Splitter.prototype.updateCollapseIcons = function (index, arrow1, arrow2) {
        if (!sf.base.isNullOrUndefined(this.paneSettings[index])) {
            if (!sf.base.isNullOrUndefined(this.paneSettings[index].collapsible)) {
                this.paneSettings[index].collapsible ? sf.base.removeClass([arrow2], [HIDE_ICON]) : sf.base.addClass([arrow2], [HIDE_ICON]);
                if (!sf.base.isNullOrUndefined(this.paneSettings[index + 1])) {
                    this.paneSettings[index + 1].collapsible ? sf.base.removeClass([arrow1], [HIDE_ICON]) : sf.base.addClass([arrow1], [HIDE_ICON]);
                }
                if (!sf.base.isNullOrUndefined(this.paneSettings[index + 1])) {
                    if ((this.paneSettings[index + 1].collapsible)) {
                        this.paneSettings[index + 1].collapsible ? sf.base.removeClass([arrow1], [HIDE_ICON]) : sf.base.addClass([arrow1], [HIDE_ICON]);
                    }
                }
            }
        }
    };
    Splitter.prototype.updateIconClass = function () {
        if (this.orientation === 'Horizontal') {
            this.leftArrow = ARROW_LEFT;
            this.rightArrow = ARROW_RIGHT;
        }
        else {
            this.leftArrow = ARROW_UP;
            this.rightArrow = ARROW_DOWN;
        }
    };
    Splitter.prototype.createSeparator = function (i) {
        var separator = this.createElement('div');
        this.allBars.push(separator);
        var arrow1 = this.createElement('button');
        var arrow2 = this.createElement('button');
        arrow1.setAttribute('tabindex', '-1');
        arrow2.setAttribute('tabindex', '-1');
        arrow1.setAttribute('aria-label', 'Toggle navigation');
        arrow2.setAttribute('aria-label', 'Toggle navigation');
        arrow1.setAttribute('type', 'button');
        arrow2.setAttribute('type', 'button');
        var size;
        var proxy;
        size = sf.base.isNullOrUndefined(this.separatorSize) ? '1px' : this.separatorSize + 'px';
        if (this.orientation === 'Horizontal') {
            this.updateIconClass();
            sf.base.addClass([arrow2], [NAVIGATE_ARROW, ARROW_LEFT, HIDE_ICON]);
            sf.base.addClass([arrow1], [NAVIGATE_ARROW, ARROW_RIGHT, HIDE_ICON]);
            sf.base.addClass([separator], [SPLIT_BAR, SPLIT_H_BAR]);
            separator.style.width = size;
        }
        else {
            sf.base.addClass([arrow1], [NAVIGATE_ARROW, ARROW_DOWN, HIDE_ICON]);
            sf.base.addClass([arrow2], [NAVIGATE_ARROW, ARROW_UP, HIDE_ICON]);
            sf.base.addClass([separator], [SPLIT_BAR, SPLIT_V_BAR]);
            this.updateIconClass();
            separator.style.height = size;
        }
        this.addMouseActions(separator);
        separator.appendChild(arrow2);
        this.addResizeHandler(separator);
        separator.appendChild(arrow1);
        this.updateCollapseIcons(i, arrow1, arrow2);
        separator.setAttribute('tabindex', '0');
        proxy = this;
        separator.addEventListener('focus', function () {
            separator.classList.add(SPLIT_BAR_ACTIVE);
            proxy.currentSeparator = separator;
            proxy.getPaneDetails();
        });
        separator.addEventListener('blur', function () {
            separator.classList.remove(SPLIT_BAR_ACTIVE);
        });
        return separator;
    };
    Splitter.prototype.updateResizablePanes = function (index) {
        this.getPaneDetails();
        this.isResizable() ? this.allPanes[index].classList.add(RESIZABLE_PANE) : this.allPanes[index].classList.remove(RESIZABLE_PANE);
    };
    Splitter.prototype.addSeparator = function (target) {
        var _this = this;
        var childCount = this.allPanes.length;
        var clonedEle = target.children;
        var separator;
        var proxy;
        if (this.checkBlazor()) {
            for (var j = 0; j < this.element.children.length; j++) {
                if (this.element.children[j].classList.contains(SPLIT_BAR)) {
                    this.allBars.push(this.element.children[j]);
                }
            }
        }
        for (var i = 0; i < childCount; i++) {
            if (i < childCount - 1) {
                if (!this.checkBlazor()) {
                    separator = this.createSeparator(i);
                    sf.base.setStyleAttribute(separator, { 'order': (i * 2) + 1 });
                    this.separatorOrder.push((i * 2) + 1);
                    clonedEle[i].parentNode.appendChild(separator);
                    this.currentSeparator = separator;
                    separator.setAttribute('role', 'separator');
                    separator.setAttribute('aria-orientation', this.orientation.toLowerCase());
                }
                if (this.checkBlazor()) {
                    proxy = this;
                    separator = this.allBars[i];
                    this.updateIconClass();
                }
                if (!this.checkBlazor()) {
                    this.wireClickEvents();
                }
                if (this.checkBlazor() && !sf.base.isNullOrUndefined(separator)) {
                    this.currentSeparator = separator;
                    this.addMouseActions(separator);
                    this.wireClickEvents();
                    separator.addEventListener('focus', function () {
                        if (document.activeElement.classList.contains('e-split-bar')) {
                            proxy.currentSeparator = document.activeElement;
                            proxy.currentSeparator.classList.add(SPLIT_BAR_ACTIVE);
                        }
                        _this.getPaneDetails();
                    });
                    separator.addEventListener('blur', function () {
                        proxy.currentSeparator.classList.remove(SPLIT_BAR_ACTIVE);
                    });
                }
                if (!sf.base.isNullOrUndefined(separator)) {
                    if (this.isResizable()) {
                        sf.base.EventHandler.add(separator, 'mousedown', this.onMouseDown, this);
                        var eventName = (sf.base.Browser.info.name === 'msie') ? 'pointerdown' : 'touchstart';
                        sf.base.EventHandler.add(separator, eventName, this.onMouseDown, this);
                        separator.classList.add(RESIZABLE_BAR);
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
        if (sf.base.Browser.info.name === 'msie') {
            var allBar = this.element.querySelectorAll('.e-splitter .e-resize-handler');
            for (var i = 0; i < allBar.length; i++) {
                var sepSize = sf.base.isNullOrUndefined(this.separatorSize) ? 1 : this.separatorSize;
                allBar[i].style.paddingLeft = sepSize / 2 + 'px';
                allBar[i].style.paddingRight = sepSize / 2 + 'px';
            }
        }
    };
    Splitter.prototype.isResizable = function () {
        var resizable = false;
        if ((!sf.base.isNullOrUndefined(this.paneSettings[this.getPreviousPaneIndex()]) &&
            this.paneSettings[this.getPreviousPaneIndex()].resizable &&
            !sf.base.isNullOrUndefined(this.paneSettings[this.getNextPaneIndex()]) &&
            this.paneSettings[this.getNextPaneIndex()].resizable) ||
            sf.base.isNullOrUndefined(this.paneSettings[this.getNextPaneIndex()])) {
            resizable = true;
        }
        return resizable;
    };
    Splitter.prototype.addMouseActions = function (separator) {
        var _this = this;
        var sTout;
        var hoverTimeOut;
        separator.addEventListener('mouseenter', function () {
            /* istanbul ignore next */
            sTout = setTimeout(function () { sf.base.addClass([separator], [SPLIT_BAR_HOVER]); }, _this.iconsDelay);
        });
        separator.addEventListener('mouseleave', function () {
            clearTimeout(sTout);
            sf.base.removeClass([separator], [SPLIT_BAR_HOVER]);
        });
        separator.addEventListener('mouseout', function () {
            clearTimeout(hoverTimeOut);
        });
        separator.addEventListener('mouseover', function () {
            /* istanbul ignore next */
            hoverTimeOut = setTimeout(function () { sf.base.addClass([separator], [SPLIT_BAR_HOVER]); }, _this.iconsDelay);
        });
    };
    Splitter.prototype.getEventType = function (e) {
        return (e.indexOf('mouse') > -1) ? 'mouse' : 'touch';
    };
    Splitter.prototype.updateCurrentSeparator = function (target) {
        this.currentSeparator = this.isSeparator(target) ? target.parentElement : target;
    };
    Splitter.prototype.isSeparator = function (target) {
        return (target.classList.contains(SPLIT_BAR) ? false : true);
    };
    Splitter.prototype.isMouseEvent = function (e) {
        var isMouse = false;
        if (this.getEventType(e.type) === 'mouse' || (!sf.base.isNullOrUndefined(e.pointerType) &&
            this.getEventType(e.pointerType) === 'mouse')) {
            isMouse = true;
        }
        return isMouse;
    };
    Splitter.prototype.updateCursorPosition = function (e, type) {
        if (this.isMouseEvent(e)) {
            this.changeCoordinates({ x: e.pageX, y: e.pageY }, type);
        }
        else {
            var eventType = sf.base.Browser.info.name !== 'msie' ? e.touches[0] : e;
            this.changeCoordinates({ x: eventType.pageX, y: eventType.pageY }, type);
        }
    };
    Splitter.prototype.changeCoordinates = function (coordinates, type) {
        if (type === 'previous') {
            this.previousCoordinates = coordinates;
        }
        else {
            this.currentCoordinates = coordinates;
        }
    };
    Splitter.prototype.reportWindowSize = function () {
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
        setTimeout(function () { _this.updateSplitterSize(); }, 200);
    };
    Splitter.prototype.updateSplitterSize = function () {
        var totalWidth = 0;
        var flexPaneIndexes = [];
        var flexCount = 0;
        var children = this.element.children;
        for (var i = 0; i < children.length; i++) {
            totalWidth += this.orientation === 'Horizontal' ? children[i].offsetWidth :
                children[i].offsetHeight;
        }
        for (var j = 0; j < this.allBars.length; j++) {
            totalWidth += this.orientation === 'Horizontal' ? parseInt(getComputedStyle(this.allBars[j]).marginLeft, 10) +
                parseInt(getComputedStyle(this.allBars[j]).marginLeft, 10) : parseInt(getComputedStyle(this.allBars[j]).marginTop, 10) +
                parseInt(getComputedStyle(this.allBars[j]).marginBottom, 10);
        }
        var diff = this.orientation === 'Horizontal' ? this.element.offsetWidth -
            ((this.border * 2) + totalWidth) :
            this.element.offsetHeight - ((this.border * 2) + totalWidth);
        for (var i = 0; i < this.allPanes.length; i++) {
            if (!this.paneSettings[i].size && !(this.allPanes[i].innerText === '')) {
                flexPaneIndexes[flexCount] = i;
                flexCount++;
            }
        }
        var avgDiffWidth = diff / flexPaneIndexes.length;
        for (var j = 0; j < flexPaneIndexes.length; j++) {
            this.allPanes[flexPaneIndexes[j]].style.flexBasis = this.orientation === 'Horizontal' ?
                (this.allPanes[flexPaneIndexes[j]].offsetWidth + avgDiffWidth) + 'px' :
                (this.allPanes[flexPaneIndexes[j]].offsetHeight + avgDiffWidth) + 'px';
        }
    };
    Splitter.prototype.wireResizeEvents = function () {
        sf.base.EventHandler.add(document, 'mousemove', this.onMouseMove, this);
        sf.base.EventHandler.add(document, 'mouseup', this.onMouseUp, this);
        var touchMoveEvent = (sf.base.Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        var touchEndEvent = (sf.base.Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        sf.base.EventHandler.add(document, touchMoveEvent, this.onMouseMove, this);
        sf.base.EventHandler.add(document, touchEndEvent, this.onMouseUp, this);
    };
    Splitter.prototype.unwireResizeEvents = function () {
        window.removeEventListener('resize', this.reportWindowSize.bind(this));
        var touchMoveEvent = (sf.base.Browser.info.name === 'msie') ? 'pointermove' : 'touchmove';
        var touchEndEvent = (sf.base.Browser.info.name === 'msie') ? 'pointerup' : 'touchend';
        sf.base.EventHandler.remove(document, 'mousemove', this.onMouseMove);
        sf.base.EventHandler.remove(document, 'mouseup', this.onMouseUp);
        sf.base.EventHandler.remove(document, touchMoveEvent, this.onMouseMove);
        sf.base.EventHandler.remove(document, touchEndEvent, this.onMouseUp);
    };
    Splitter.prototype.wireClickEvents = function () {
        sf.base.EventHandler.add(this.currentSeparator, 'touchstart click', this.clickHandler, this);
    };
    Splitter.prototype.clickHandler = function (e) {
        if (!e.target.classList.contains(NAVIGATE_ARROW)) {
            var hoverBars = sf.base.selectAll('.' + ROOT + ' > .' + SPLIT_BAR + '.' + SPLIT_BAR_HOVER);
            if (hoverBars.length > 0) {
                sf.base.removeClass(hoverBars, SPLIT_BAR_HOVER);
            }
            e.target.classList.add(SPLIT_BAR_HOVER);
        }
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
            totalWidth += this.orientation === 'Horizontal' ? children[i].offsetWidth :
                children[i].offsetHeight;
        }
        if (totalWidth > this.element.offsetWidth) {
            this.updateSplitterSize();
        }
    };
    Splitter.prototype.expandAction = function (e) {
        var _this = this;
        this.splitterDetails(e);
        var eventArgs = this.beforeAction(e);
        if (this.expandFlag) {
            this.trigger('beforeExpand', eventArgs, function (beforeExpandArgs) {
                if (!beforeExpandArgs.cancel) {
                    _this.expandPane(e);
                }
                var expandEventArgs = _this.afterAction(e);
                _this.trigger('expanded', expandEventArgs);
            });
        }
        else {
            this.expandPane(e);
        }
    };
    Splitter.prototype.expandPane = function (e) {
        var collapseCount = this.element.querySelectorAll('.' + COLLAPSE_PANE).length;
        var flexStatus = (!this.previousPane.classList.contains(COLLAPSE_PANE) &&
            this.previousPane.classList.contains(STATIC_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE) &&
            !this.nextPane.classList.contains(EXPAND_PANE) && this.nextPane.nextElementSibling.classList.contains(PANE) &&
            !this.nextPane.nextElementSibling.classList.contains(STATIC_PANE) && !(collapseCount === this.allPanes.length - 2));
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
        this.previousPane.setAttribute('aria-expanded', 'true');
        this.nextPane.setAttribute('aria-expanded', 'false');
        this.updateFlexGrow(this.checkStaticPanes());
        if (flexStatus) {
            this.previousPane.classList.remove(EXPAND_PANE);
            this.previousPane.style.flexGrow = '';
        }
    };
    Splitter.prototype.checkStaticPanes = function () {
        var staticPane = true;
        for (var i = 0; i < this.allPanes.length; i++) {
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
    };
    Splitter.prototype.updateFlexGrow = function (status) {
        var panes = this.allPanes;
        for (var i = 0; i < panes.length; i++) {
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
    };
    Splitter.prototype.hideTargetBarIcon = function (targetBar, targetArrow) {
        sf.base.addClass([sf.base.select('.' + targetArrow, targetBar)], HIDE_ICON);
    };
    Splitter.prototype.showTargetBarIcon = function (targetBar, targetArrow) {
        sf.base.removeClass([sf.base.select('.' + targetArrow, targetBar)], HIDE_ICON);
    };
    Splitter.prototype.updateIconsOnCollapse = function (e) {
        this.splitterProperty();
        if (this.previousPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE)) {
            sf.base.addClass([e.target], HIDE_ICON);
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
                this.showTargetBarIcon(this.getPrevBar(this.nextPaneIndex), this.rightArrow);
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
    Splitter.prototype.collapseAction = function (e) {
        var _this = this;
        this.splitterDetails(e);
        var eventArgs = this.beforeAction(e);
        if (this.collapseFlag) {
            this.collapsePane(e);
        }
        else {
            this.trigger('beforeCollapse', eventArgs, function (beforeCollapseArgs) {
                if (!beforeCollapseArgs.cancel) {
                    _this.collapsePane(e);
                    var collapseEventArgs = _this.afterAction(e);
                    _this.trigger('collapsed', collapseEventArgs);
                }
            });
        }
    };
    Splitter.prototype.collapsePane = function (e) {
        var collapseCount = this.element.querySelectorAll('.' + COLLAPSE_PANE).length;
        var flexStatus = (this.previousPane.classList.contains(STATIC_PANE) &&
            !this.previousPane.classList.contains(COLLAPSE_PANE) && !this.nextPane.classList.contains(COLLAPSE_PANE) &&
            this.nextPane.nextElementSibling.classList.contains(PANE) &&
            !this.nextPane.nextElementSibling.classList.contains(STATIC_PANE) &&
            !this.nextPane.nextElementSibling.classList.contains(COLLAPSE_PANE) &&
            !(collapseCount === this.allPanes.length - 2)) || (this.nextPane.classList.contains(COLLAPSE_PANE) &&
            !this.previousPane.classList.contains(STATIC_PANE) && this.nextPane.classList.contains(STATIC_PANE));
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
        this.previousPane.setAttribute('aria-expanded', 'false');
        this.nextPane.setAttribute('aria-expanded', 'true');
        this.updateFlexGrow(this.checkStaticPanes());
        if (flexStatus) {
            this.nextPane.classList.remove(EXPAND_PANE);
            this.nextPane.style.flexGrow = '';
        }
    };
    Splitter.prototype.beforeAction = function (e) {
        var eventArgs = sf.base.isBlazor() ? {
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
    };
    Splitter.prototype.updatePaneSettings = function (index, collapsed) {
        this.paneSettings[index].collapsed = collapsed;
    };
    Splitter.prototype.splitterProperty = function () {
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
    Splitter.prototype.showCurrentBarIcon = function () {
        sf.base.removeClass([sf.base.select('.' + this.arrow, this.currentSeparator)], HIDE_ICON);
    };
    Splitter.prototype.updateIconsOnExpand = function (e) {
        this.splitterProperty();
        sf.base.addClass([e.target], HIDE_ICON);
        if (!this.splitInstance.prevPaneExpanded && !this.splitInstance.nextPaneCollapsed) {
            if (this.paneSettings[this.prevPaneIndex].collapsible) {
                this.showCurrentBarIcon();
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
                this.showCurrentBarIcon();
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
    Splitter.prototype.afterAction = function (e) {
        var eventArgs = sf.base.isBlazor() ? {
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
    };
    Splitter.prototype.currentIndex = function (e) {
        this.currentBarIndex = this.getSeparatorIndex(e.target.parentElement);
    };
    Splitter.prototype.getSeparatorIndex = function (target) {
        var separator = this.orientation === 'Horizontal' ? SPLIT_H_BAR : SPLIT_V_BAR;
        if (this.checkBlazor() && this.allBars.length < 1) {
            this.allBars = sf.base.selectAll('.' + separator, this.element);
        }
        var array = [].slice.call(this.allBars);
        return array.indexOf(target);
    };
    Splitter.prototype.getPrevBar = function (currentBar) {
        var prevbar = this.allBars[(currentBar - 1)];
        return prevbar;
    };
    Splitter.prototype.getNextBar = function (currentBar) {
        var prevbar = this.allBars[(currentBar + 1)];
        return prevbar;
    };
    Splitter.prototype.updateBars = function (index) {
        this.prevBar = this.getPrevBar(index);
        this.nextBar = this.getNextBar(index);
    };
    Splitter.prototype.splitterDetails = function (e) {
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
    };
    Splitter.prototype.triggerResizing = function (e) {
        var eventArgs = sf.base.isBlazor() ? {
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
    };
    Splitter.prototype.onMouseDown = function (e) {
        var _this = this;
        e.preventDefault();
        var target = e.target;
        if (target.classList.contains(NAVIGATE_ARROW)) {
            return;
        }
        this.updateCurrentSeparator(target);
        sf.base.addClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.updateCursorPosition(e, 'previous');
        this.getPaneDetails();
        var eventArgs = sf.base.isBlazor() ? {
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
        for (var i = 0; i < this.element.querySelectorAll('iframe').length; i++) {
            this.element.querySelectorAll('iframe')[i].style.pointerEvents = 'none';
        }
        this.trigger('resizeStart', eventArgs, function (resizeStartArgs) {
            if (!resizeStartArgs.cancel) {
                _this.wireResizeEvents();
                _this.checkPaneSize(e);
            }
        });
    };
    Splitter.prototype.updatePaneFlexBasis = function (pane) {
        var previous;
        if (pane.style.flexBasis.indexOf('%') > 0) {
            previous = this.removePercentageUnit(pane.style.flexBasis);
        }
        else {
            if (pane.style.flexBasis !== '') {
                previous = this.convertPixelToPercentage(this.convertPixelToNumber(pane.style.flexBasis));
            }
            else {
                var offset = (this.orientation === 'Horizontal') ? (pane.offsetWidth) : (pane.offsetHeight);
                previous = this.convertPixelToPercentage(offset);
            }
        }
        return previous;
    };
    Splitter.prototype.removePercentageUnit = function (value) {
        return parseFloat(value.slice(0, value.indexOf('%')));
    };
    Splitter.prototype.convertPercentageToPixel = function (value, targetElement) {
        var percentage = value.toString();
        var convertedValue;
        if (percentage.indexOf('%') > -1) {
            convertedValue = parseFloat(percentage.slice(0, percentage.indexOf('%')));
            var offsetValue = void 0;
            if (!sf.base.isNullOrUndefined(targetElement)) {
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
    };
    Splitter.prototype.convertPixelToPercentage = function (value) {
        var offsetValue = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
        return (value / offsetValue) * 100;
    };
    Splitter.prototype.convertPixelToNumber = function (value) {
        if (value.indexOf('p') > -1) {
            return parseFloat(value.slice(0, value.indexOf('p')));
        }
        else {
            return parseFloat(value);
        }
    };
    Splitter.prototype.calcDragPosition = function (rectValue, offsetValue) {
        var separatorPosition;
        var separator;
        separatorPosition = this.orientation === 'Horizontal' ? (this.currentCoordinates.x - rectValue) :
            (this.currentCoordinates.y - rectValue);
        separator = separatorPosition / offsetValue;
        separator = (separator > 1) ? 1 : (separator < 0) ? 0 : separator;
        return separator * offsetValue;
    };
    Splitter.prototype.getSeparatorPosition = function (e) {
        this.updateCursorPosition(e, 'current');
        var rectBound = (this.orientation === 'Horizontal') ? this.element.getBoundingClientRect().left :
            this.element.getBoundingClientRect().top;
        var offSet = (this.orientation === 'Horizontal') ? this.element.offsetWidth : this.element.offsetHeight;
        return this.calcDragPosition(rectBound, offSet);
    };
    Splitter.prototype.getMinMax = function (paneIndex, target, selection) {
        var defaultVal = selection === 'min' ? 0 : null;
        // tslint:disable-next-line
        var paneValue = null;
        if (selection === 'min') {
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
    Splitter.prototype.getPreviousPaneIndex = function () {
        var prePaneIndex = ((parseInt(this.currentSeparator.style.order, 10) - 1) / 2);
        return prePaneIndex;
    };
    Splitter.prototype.getNextPaneIndex = function () {
        var nextPaneIndex = (parseInt(this.currentSeparator.style.order, 10) - 1) / (2);
        return nextPaneIndex + 1;
    };
    Splitter.prototype.getPaneDetails = function () {
        var prevPane = null;
        var nextPane = null;
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
    };
    Splitter.prototype.getPaneHeight = function (pane) {
        return ((this.orientation === 'Horizontal') ? pane.offsetWidth.toString() :
            pane.offsetHeight.toString());
    };
    Splitter.prototype.isValidSize = function (paneIndex) {
        var isValid = false;
        if (!sf.base.isNullOrUndefined(this.paneSettings[paneIndex]) &&
            !sf.base.isNullOrUndefined(this.paneSettings[paneIndex].size) &&
            this.paneSettings[paneIndex].size.indexOf('%') > -1) {
            isValid = true;
        }
        return isValid;
    };
    Splitter.prototype.getPaneDimensions = function () {
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
    Splitter.prototype.checkCoordinates = function (pageX, pageY) {
        var coordinatesChanged = true;
        if ((pageX === this.previousCoordinates.x || pageY === this.previousCoordinates.y)) {
            coordinatesChanged = false;
        }
        return coordinatesChanged;
    };
    Splitter.prototype.isCursorMoved = function (e) {
        var cursorMoved = true;
        if (this.getEventType(e.type) === 'mouse' || (!sf.base.isNullOrUndefined(e.pointerType)) &&
            this.getEventType(e.pointerType) === 'mouse') {
            cursorMoved = this.checkCoordinates(e.pageX, e.pageY);
        }
        else {
            cursorMoved = (sf.base.Browser.info.name !== 'msie') ?
                this.checkCoordinates(e.touches[0].pageX, e.touches[0].pageY) :
                this.checkCoordinates(e.pageX, e.pageY);
        }
        return cursorMoved;
    };
    Splitter.prototype.getBorder = function () {
        this.border = 0;
        var border = this.orientation === 'Horizontal' ? ((this.element.offsetWidth - this.element.clientWidth) / 2) :
            (this.element.offsetHeight - this.element.clientHeight) / 2;
        this.border = sf.base.Browser.info.name !== 'chrome' ? this.border : border;
    };
    Splitter.prototype.onMouseMove = function (e) {
        if (!this.isCursorMoved(e)) {
            return;
        }
        this.getPaneDetails();
        this.getPaneDimensions();
        this.triggerResizing(e);
        var left = this.validateDraggedPosition(this.getSeparatorPosition(e), this.prePaneDimenson, this.nextPaneDimension);
        var separatorNewPosition;
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
            var difference = this.totalWidth - ((this.nextPaneCurrentWidth + this.prevPaneCurrentWidth));
            this.nextPaneCurrentWidth = this.nextPaneCurrentWidth + difference;
        }
        this.calculateCurrentDimensions();
        this.addStaticPaneClass();
        this.previousPane.style.flexBasis = this.prevPaneCurrentWidth;
        this.nextPane.style.flexBasis = this.nextPaneCurrentWidth;
        if (!(this.allPanes.length > 2)) {
            this.updateSplitterSize();
        }
    };
    Splitter.prototype.validateMinRange = function (paneIndex, paneCurrentWidth, pane) {
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
    Splitter.prototype.validateMaxRange = function (paneIndex, paneCurrentWidth, pane) {
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
    Splitter.prototype.validateMinMaxValues = function () {
        //validate previous pane minimum range
        this.prevPaneCurrentWidth = this.validateMinRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        // Validate next pane minimum range
        this.nextPaneCurrentWidth = this.validateMinRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
        // validate previous pane maximum range
        this.prevPaneCurrentWidth = this.validateMaxRange(this.prevPaneIndex, this.prevPaneCurrentWidth, this.previousPane);
        // validate next pane maximum range
        this.nextPaneCurrentWidth = this.validateMaxRange(this.nextPaneIndex, this.nextPaneCurrentWidth, this.nextPane);
    };
    Splitter.prototype.equatePaneWidths = function () {
        var difference;
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
    };
    Splitter.prototype.calculateCurrentDimensions = function () {
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
    };
    Splitter.prototype.addStaticPaneClass = function () {
        if (!this.previousPane.classList.contains(STATIC_PANE)) {
            this.previousPane.classList.add(STATIC_PANE);
        }
        if (!this.nextPane.classList.contains(STATIC_PANE)) {
            this.nextPane.classList.add(STATIC_PANE);
        }
    };
    Splitter.prototype.validateDraggedPosition = function (draggedPos, prevPaneHeightWidth, nextPaneHeightWidth) {
        var separatorTopLeft = (this.orientation === 'Horizontal') ? this.currentSeparator.offsetLeft :
            this.currentSeparator.offsetTop;
        var prePaneRange = separatorTopLeft - prevPaneHeightWidth;
        var nextPaneRange = nextPaneHeightWidth + separatorTopLeft;
        var pane1MinSize = this.getMinMax(this.prevPaneIndex, this.previousPane, 'min');
        var pane2MinSize = this.getMinMax(this.nextPaneIndex, this.nextPane, 'min');
        var pane1MaxSize = this.getMinMax(this.prevPaneIndex, this.previousPane, 'max');
        var pane2MaxSize = this.getMinMax(this.nextPaneIndex, this.nextPane, 'max');
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
    Splitter.prototype.onMouseUp = function (e) {
        sf.base.removeClass([this.currentSeparator], SPLIT_BAR_ACTIVE);
        this.unwireResizeEvents();
        var eventArgs = sf.base.isBlazor() ? {
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
        for (var i = 0; i < this.element.querySelectorAll('iframe').length; i++) {
            this.element.querySelectorAll('iframe')[i].style.pointerEvents = 'auto';
        }
        this.trigger('resizeStop', eventArgs);
    };
    Splitter.prototype.panesDimension = function (index, child) {
        var childCount = child.length;
        var size;
        parseInt(this.getHeight(this.element), 10);
        if (!sf.base.isNullOrUndefined(this.paneSettings[index])) {
            if (!sf.base.isNullOrUndefined(this.paneSettings[index].size)) {
                size = this.paneSettings[index].size;
                if (index < childCount) {
                    sf.base.setStyleAttribute(child[index], { 'flex-basis': size, 'order': index * 2 });
                    if (index < childCount - 1 && this.paneSettings[index].size !== '') {
                        sf.base.addClass([child[index]], STATIC_PANE);
                    }
                    else if (!this.sizeFlag) {
                        child[index].style.flexBasis = null;
                    }
                    if ((index === childCount - 1) && this.sizeFlag && this.paneSettings[index].size !== '') {
                        sf.base.addClass([child[index]], STATIC_PANE);
                    }
                }
            }
            else {
                this.sizeFlag = true;
                sf.base.setStyleAttribute(child[index], { 'order': index * 2 });
            }
        }
        else {
            sf.base.setStyleAttribute(child[index], { 'order': index * 2 });
        }
        this.paneOrder.push(index * 2);
    };
    Splitter.prototype.setTemplate = function (template, toElement) {
        toElement.innerHTML = '';
        template = typeof (template) === 'string' ? this.sanitizeHelper(template) : template;
        this.templateCompile(toElement, template);
    };
    // tslint:disable-next-line
    Splitter.prototype.templateCompile = function (ele, cnt) {
        var tempEle = this.createElement('div');
        this.compileElement(tempEle, cnt, 'content');
        if (tempEle.childNodes.length !== 0) {
            [].slice.call(tempEle.childNodes).forEach(function (childEle) {
                ele.appendChild(childEle);
            });
        }
    };
    Splitter.prototype.compileElement = function (ele, val, prop) {
        if (typeof (val) === 'string') {
            if (val[0] === '.' || val[0] === '#') {
                var eleVal = document.querySelector(val);
                if (!sf.base.isNullOrUndefined(eleVal)) {
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
        var templateFn;
        if (!sf.base.isNullOrUndefined(val.outerHTML)) {
            templateFn = sf.base.compile(val.outerHTML);
        }
        else {
            templateFn = sf.base.compile(val);
        }
        var templateFUN;
        if (!sf.base.isNullOrUndefined(templateFn)) {
            if (sf.base.isBlazor() && !this.isStringTemplate) {
                templateFUN = templateFn({}, this, prop, this.element.id + 'content' + this.allPanes.length.toString(), this.isStringTemplate);
            }
            else {
                templateFUN = templateFn({}, this, prop, this.element.id + 'content' + this.allPanes.length.toString(), true);
            }
        }
        if (!sf.base.isNullOrUndefined(templateFn) && templateFUN.length > 0) {
            [].slice.call(templateFUN).forEach(function (el) {
                ele.appendChild(el);
            });
        }
    };
    Splitter.prototype.paneCollapsible = function (pane, index) {
        this.paneSettings[index].collapsible ? sf.base.addClass([pane], COLLAPSIBLE) : sf.base.removeClass([pane], COLLAPSIBLE);
    };
    Splitter.prototype.createSplitPane = function (target) {
        var childCount = target.children.length;
        if (!this.checkBlazor()) {
            for (var i = 0; i < this.paneSettings.length; i++) {
                if (childCount < this.paneSettings.length) {
                    var childElement = this.createElement('div');
                    this.element.appendChild(childElement);
                    childCount = childCount + 1;
                }
            }
        }
        childCount = target.children.length;
        var child = [].slice.call(target.children);
        this.sizeFlag = false;
        if (childCount > 0) {
            for (var i = 0; i < childCount; i++) {
                // To accept only div and span element as pane
                if (child[i].nodeName === 'DIV' || child[i].nodeName === 'SPAN') {
                    if (this.checkBlazor() && child[i].classList.contains(PANE)) {
                        this.allPanes.push(child[i]);
                    }
                    else if (!this.checkBlazor()) {
                        this.allPanes.push(child[i]);
                    }
                    if (!this.checkBlazor()) {
                        if (this.orientation === 'Horizontal') {
                            sf.base.addClass([child[i]], [PANE, SPLIT_H_PANE, SCROLL_PANE]);
                            this.panesDimension(i, child);
                        }
                        else {
                            sf.base.addClass([child[i]], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
                            this.panesDimension(i, child);
                        }
                        if (!sf.base.isNullOrUndefined(this.paneSettings[i]) && !sf.base.isNullOrUndefined(this.paneSettings[i].content)) {
                            this.setTemplate(this.paneSettings[i].content, child[i]);
                        }
                        if (!sf.base.isNullOrUndefined(this.paneSettings[i]) && this.paneSettings[i].cssClass) {
                            this.setCssClass(child[i], this.paneSettings[i].cssClass);
                        }
                        if (!sf.base.isNullOrUndefined(this.paneSettings[i])) {
                            this.paneCollapsible(child[i], i);
                        }
                    }
                }
            }
        }
    };
    
    /**
     * expands corresponding pane based on the index is passed.
     * @param { number } index - Specifies the index value of the corresponding pane to be expanded at initial rendering of splitter.
     * @returns void
     */
    Splitter.prototype.expand = function (index) {
        this.collapsedOnchange(index);
        this.updatePaneSettings(index, false);
    };
    /**
     * collapses corresponding pane based on the index is passed.
     * @param { number } index - Specifies the index value of the corresponding pane to be collapsed at initial rendering of splitter.
     * @returns void
     */
    Splitter.prototype.collapse = function (index) {
        this.isCollapsed(index);
        this.updatePaneSettings(index, true);
    };
    /**
     * Removes the control from the DOM and also removes all its related events.
     * @returns void
     */
    Splitter.prototype.destroy = function () {
        if (!this.isDestroyed) {
            if (!this.checkBlazor()) {
                _super.prototype.destroy.call(this);
            }
            sf.base.EventHandler.remove(document, 'touchstart click', this.onDocumentClick);
            while (this.element.attributes.length > 0) {
                this.element.removeAttribute(this.element.attributes[0].name);
            }
            if (this.checkBlazor()) {
                var splitNodes = this.element.children;
                for (var i = splitNodes.length - 1; i >= 0; i--) {
                    sf.base.detach(splitNodes[i]);
                }
            }
            else {
                this.element.innerHTML = this.wrapper.innerHTML;
                for (var i = 0; i < this.wrapper.attributes.length; i++) {
                    this.element.setAttribute(this.wrapper.attributes[i].name, this.wrapper.attributes[i].value);
                }
            }
            if (this.refreshing) {
                sf.base.addClass([this.element], ['e-control', 'e-lib', ROOT]);
                this.allBars = [];
                this.allPanes = [];
            }
            this.restoreElem();
        }
    };
    Splitter.prototype.restoreElem = function () {
        if (this.templateElement.length > 0) {
            for (var i = 0; i < this.templateElement.length; i++) {
                this.templateElement[i].style.display = 'none';
                document.body.appendChild(this.templateElement[i]);
            }
        }
    };
    Splitter.prototype.addPaneClass = function (pane) {
        this.orientation === 'Horizontal' ? sf.base.addClass([pane], [PANE, SPLIT_H_PANE, SCROLL_PANE]) :
            sf.base.addClass([pane], [PANE, SPLIT_V_PANE, SCROLL_PANE]);
        return pane;
    };
    Splitter.prototype.removePaneOrders = function (paneClass) {
        var panes = document.querySelectorAll('.' + paneClass);
        for (var i = 0; i < panes.length; i++) {
            panes[i].style.removeProperty('order');
        }
    };
    Splitter.prototype.setPaneOrder = function () {
        for (var i = 0; i < this.allPanes.length; i++) {
            this.panesDimension(i, this.allPanes);
        }
    };
    Splitter.prototype.removeSeparator = function () {
        for (var i = 0; i < this.allBars.length; i++) {
            sf.base.detach(this.allBars[i]);
        }
        this.allBars = [];
    };
    Splitter.prototype.updatePanes = function () {
        this.setPaneOrder();
        this.removeSeparator();
        this.addSeparator(this.element);
    };
    /**
     * Allows you to add a pane dynamically to the specified index position by passing the pane properties.
     * @param { PanePropertiesModel } paneProperties - Specifies the pane’s properties that apply to new pane.
     * @param { number } index - Specifies the index where the pane will be inserted.
     * @returns void
     */
    Splitter.prototype.addPane = function (paneProperties, index) {
        var newPane = this.createElement('div');
        newPane = this.addPaneClass(newPane);
        index = (index > this.allPanes.length + 1) ? this.allPanes.length : index;
        var paneDetails = {
            size: sf.base.isNullOrUndefined(paneProperties.size) ? '' : paneProperties.size,
            min: sf.base.isNullOrUndefined(paneProperties.min) ? null : paneProperties.min,
            max: sf.base.isNullOrUndefined(paneProperties.max) ? null : paneProperties.max,
            content: sf.base.isNullOrUndefined(paneProperties.content) ? '' : paneProperties.content,
            resizable: sf.base.isNullOrUndefined(paneProperties.resizable) ? true : paneProperties.resizable,
            collapsible: sf.base.isNullOrUndefined(paneProperties.collapsible) ? false : paneProperties.collapsible,
            collapsed: sf.base.isNullOrUndefined(paneProperties.collapsed) ? false : paneProperties.collapsed,
            cssClass: sf.base.isNullOrUndefined(paneProperties.cssClass) ? '' : paneProperties.cssClass
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
    };
    /**
     * Allows you to remove the specified pane dynamically by passing its index value.
     * @param { number } index - Specifies the index value to remove the corresponding pane.
     * @returns void
     */
    Splitter.prototype.removePane = function (index) {
        index = (index > this.allPanes.length + 1) ? this.allPanes.length : index;
        var elementClass = (this.orientation === 'Horizontal') ? SPLIT_H_PANE : SPLIT_V_PANE;
        if (sf.base.isNullOrUndefined(this.element.querySelectorAll('.' + elementClass)[index])) {
            return;
        }
        sf.base.detach(this.element.querySelectorAll('.' + elementClass)[index]);
        this.allPanes.splice(index, 1);
        this.removePaneOrders(elementClass);
        this.updatePanes();
        this.paneSettings.splice(index, 1);
        this.setProperties({ 'paneSettings': this.paneSettings }, true);
        if (this.allPanes.length > 0) {
            this.allPanes[this.allPanes.length - 1].classList.remove(STATIC_PANE);
        }
    };
    __decorate([
        sf.base.Property('100%')
    ], Splitter.prototype, "height", void 0);
    __decorate([
        sf.base.Property('100%')
    ], Splitter.prototype, "width", void 0);
    __decorate([
        sf.base.Collection([], PaneProperties)
    ], Splitter.prototype, "paneSettings", void 0);
    __decorate([
        sf.base.Property('Horizontal')
    ], Splitter.prototype, "orientation", void 0);
    __decorate([
        sf.base.Property('')
    ], Splitter.prototype, "cssClass", void 0);
    __decorate([
        sf.base.Property(true)
    ], Splitter.prototype, "enabled", void 0);
    __decorate([
        sf.base.Property(true)
    ], Splitter.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        sf.base.Property(null)
    ], Splitter.prototype, "separatorSize", void 0);
    __decorate([
        sf.base.Event()
    ], Splitter.prototype, "beforeSanitizeHtml", void 0);
    __decorate([
        sf.base.Event()
    ], Splitter.prototype, "created", void 0);
    __decorate([
        sf.base.Event()
    ], Splitter.prototype, "resizeStart", void 0);
    __decorate([
        sf.base.Event()
    ], Splitter.prototype, "resizing", void 0);
    __decorate([
        sf.base.Event()
    ], Splitter.prototype, "resizeStop", void 0);
    __decorate([
        sf.base.Event()
    ], Splitter.prototype, "beforeCollapse", void 0);
    __decorate([
        sf.base.Event()
    ], Splitter.prototype, "beforeExpand", void 0);
    __decorate([
        sf.base.Event()
    ], Splitter.prototype, "collapsed", void 0);
    __decorate([
        sf.base.Event()
    ], Splitter.prototype, "expanded", void 0);
    Splitter = __decorate([
        sf.base.NotifyPropertyChanges
    ], Splitter);
    return Splitter;
}(sf.base.Component));

/**
 * splitter modules
 */

exports.PaneProperties = PaneProperties;
exports.Splitter = Splitter;

return exports;

});
sfBlazor.modules["splitter"] = "layouts.Splitter";
sfBlazor.loadDependencies(sfBlazor.dependencyJson.splitter, () => {
    sf.layouts = sf.base.extend({}, sf.layouts, sfsplitter({}));
});